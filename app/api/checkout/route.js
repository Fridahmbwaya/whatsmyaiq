import { NextResponse } from "next/server";
import { assessQuiz } from "../../../lib/assessment";
import { missingSettings, stripeRequest } from "../../../lib/services";

export const runtime = "nodejs";

export async function POST(request) {
  const missing = missingSettings([
    "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "ANTHROPIC_API_KEY",
    "BREVO_API_KEY", "BREVO_SENDER_EMAIL"
  ]);
  if (process.env.PAYMENTS_ENABLED !== "true" || missing.length) {
    return NextResponse.json({ error: "Paid reports are not available yet. Please try again later." }, { status: 503 });
  }
  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) {
      return NextResponse.json({ error: "Invalid request" }, { status: 413 });
    }
    const quiz = assessQuiz(await request.json());
    const origin = new URL(request.url).origin;
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("customer_email", quiz.email);
    form.set("line_items[0][price_data][currency]", "usd");
    form.set("line_items[0][price_data][unit_amount]", "2499");
    form.set("line_items[0][price_data][product_data][name]", "What's My AIQ — Personalised Report");
    form.set("line_items[0][quantity]", "1");
    form.set("success_url", origin + "/?checkout=success&session_id={CHECKOUT_SESSION_ID}");
    form.set("cancel_url", origin + "/?checkout=cancelled");
    form.set("metadata[product]", "aiq-report-v1");
    form.set("metadata[audience]", quiz.audience);
    form.set("metadata[answers]", quiz.answers.join(","));
    form.set("metadata[delivery_status]", "pending");
    const session = await stripeRequest("POST", "/v1/checkout/sessions", form);
    if (!session.url || !session.url.startsWith("https://checkout.stripe.com/")) {
      throw new Error("Invalid Stripe Checkout URL");
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (/Invalid quiz|Invalid audience|Enter a valid email/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Checkout session creation failed", error.message);
    return NextResponse.json({ error: "Checkout could not be started. Please try again later." }, { status: 502 });
  }
}
