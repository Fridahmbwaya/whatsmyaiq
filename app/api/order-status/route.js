import { NextResponse } from "next/server";
import { stripeRequest } from "../../../lib/services";

export const runtime = "nodejs";

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("session_id");
  if (!id || !/^cs_(test_|live_)[a-zA-Z0-9]{10,}$/.test(id)) {
    return NextResponse.json({ error: "Invalid checkout session" }, { status: 400 });
  }
  try {
    const session = await stripeRequest("GET", "/v1/checkout/sessions/" + encodeURIComponent(id));
    if (session.metadata?.product !== "aiq-report-v1") {
      return NextResponse.json({ error: "Unknown order" }, { status: 404 });
    }
    return NextResponse.json({
      paid: session.payment_status === "paid",
      delivery: session.metadata?.delivery_status === "sent" ? "sent" : "pending"
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Checkout status check failed", error.message);
    return NextResponse.json({ error: "Unable to verify payment status" }, { status: 502 });
  }
}
