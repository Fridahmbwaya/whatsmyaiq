import { NextResponse } from "next/server";
import { assessmentFromStripeSession, generatePaidReport, paidReportEmail, sendBrevoEmail, stripeRequest, verifyStripeEvent } from "../../../lib/services";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request) {
  let event;
  try {
    const rawBody = await request.text();
    event = verifyStripeEvent(rawBody, request.headers.get("stripe-signature"));
  } catch (error) {
    console.warn("Stripe webhook rejected:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    return NextResponse.json({ received: true });
  }
  try {
    const id = event.data?.object?.id;
    if (!/^cs_(test_|live_)[a-zA-Z0-9]{10,}$/.test(id || "")) {
      throw new Error("Unexpected checkout session");
    }
    // Fetch the canonical Stripe session. Neither the redirect URL nor the webhook payload alone unlocks a report.
    const session = await stripeRequest("GET", "/v1/checkout/sessions/" + encodeURIComponent(id));
    if (session.payment_status !== "paid") return NextResponse.json({ received: true, pending: true });
    if (session.amount_total !== 2499 || session.currency !== "usd") throw new Error("Unexpected payment amount");
    if (session.metadata?.delivery_status === "sent") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    const assessment = assessmentFromStripeSession(session);
    const report = await generatePaidReport(assessment);
    const email = paidReportEmail(assessment, report);
    const messageId = await sendBrevoEmail(assessment.email, email.subject, email.htmlContent);
    // Prevent sequential webhook retries from resending. For exact-once handling under simultaneous events,
    // add a transactional order database with a unique session_id lock before public launch.
    const form = new URLSearchParams();
    form.set("metadata[delivery_status]", "sent");
    form.set("metadata[brevo_message_id]", messageId.slice(0, 490));
    await stripeRequest("POST", "/v1/checkout/sessions/" + encodeURIComponent(id), form);
    return NextResponse.json({ received: true, delivered: true });
  } catch (error) {
    console.error("AIQ report fulfillment failed", event?.id, error.message);
    // Return 500 to let Stripe retry after a transient Anthropic, Brevo or Stripe API error.
    return NextResponse.json({ error: "Temporary fulfillment failure" }, { status: 500 });
  }
}
