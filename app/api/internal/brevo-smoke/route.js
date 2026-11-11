import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Temporary staging-only smoke test. This Brevo sandbox request never sends an email.
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Unavailable" }, { status: 404 });
  }
  const configured = Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
  if (!configured) {
    console.warn("AIQ Brevo smoke test: missing configuration");
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "What's My AIQ"
        },
        to: [{ email: "integration-check@example.invalid" }],
        subject: "AIQ API smoke test — no email delivery",
        htmlContent: "<html><body>Brevo API connectivity test.</body></html>",
        headers: { "X-Sib-Sandbox": "drop" }
      })
    });
    const body = await response.json().catch(() => ({}));
    const ok = response.ok && typeof body.messageId === "string";
    console.info("AIQ Brevo drop-mode smoke test", { accepted: ok, status: response.status, code: body.code || null });
    return NextResponse.json({
      ok, providerStatus: response.status, providerCode: body.code || null, failureReason: /key not found/i.test(String(body.message || "")) ? "key_not_found" : /access denied|permission/i.test(String(body.message || "")) ? "permission_denied" : /ip address|ip restriction/i.test(String(body.message || "")) ? "ip_restriction" : /invalid key/i.test(String(body.message || "")) ? "invalid_key" : "other", deliveryAttempted: false
    }, { status: ok ? 200 : 502, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("AIQ Brevo drop-mode smoke test network error", error.name);
    return NextResponse.json({ ok: false, reason: "network_error" }, { status: 502 });
  }
}
