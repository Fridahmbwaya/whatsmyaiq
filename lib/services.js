import { createHmac, timingSafeEqual } from "node:crypto";
import { assessQuiz } from "./assessment";
import { renderFreeSnapshotEmail, renderPaidReportEmail } from "./email-templates";

export function missingSettings(names) {
  return names.filter(name => !process.env[name]);
}

export async function stripeRequest(method, path, form) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  const options = {
    method,
    headers: { Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY }
  };
  if (form) {
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.body = form.toString();
  }
  const response = await fetch("https://api.stripe.com" + path, options);
  const data = await response.json();
  if (!response.ok) {
    console.error("Stripe API request failed", response.status, data?.error?.code);
    throw new Error("Stripe request failed");
  }
  return data;
}

export function verifyStripeEvent(rawBody, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signature) throw new Error("Missing Stripe webhook signature or secret");
  const pieces = signature.split(",").map(piece => piece.trim().split("="));
  const timestamp = pieces.find(piece => piece[0] === "t")?.[1];
  const validSignatures = pieces.filter(piece => piece[0] === "v1").map(piece => piece[1]);
  const time = Number(timestamp);
  if (!Number.isFinite(time) || Math.abs(Date.now() / 1000 - time) > 300 || validSignatures.length === 0) {
    throw new Error("Stale or malformed Stripe webhook");
  }
  const expected = createHmac("sha256", secret).update(timestamp + "." + rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const matched = validSignatures.some(value => {
    if (!/^[a-f0-9]{64}$/i.test(value)) return false;
    const actualBuffer = Buffer.from(value, "hex");
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  });
  if (!matched) throw new Error("Invalid Stripe webhook signature");
  return JSON.parse(rawBody);
}

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
  );
}

function listHtml(items) {
  return "<ul>" + items.map(item => "<li style='margin:8px 0;line-height:1.65'>" + escapeHtml(item) + "</li>").join("") + "</ul>";
}

function emailShell(title, content) {
  return "<!doctype html><html lang='en'><meta charset='UTF-8'/>" +
    "<body style='margin:0;background:#f5f7f9;color:#16202d;font-family:Arial,sans-serif'>" +
    "<main style='max-width:640px;margin:0 auto;padding:36px 24px;background:#fff'>" +
    "<p style='color:#607082;font-size:12px;letter-spacing:2px;font-weight:700'>WHAT'S MY AIQ</p>" +
    "<h1 style='font-size:30px;line-height:1.2'>" + escapeHtml(title) + "</h1>" +
    content +
    "<hr style='border:none;border-top:1px solid #ddd;margin:30px 0'/>" +
    "<p style='font-size:12px;color:#607082'>Your assessment is a self-reported learning guide, not a clinical or employment evaluation.</p>" +
    "<p style='font-size:12px;color:#607082'>What's My AIQ · <a href='https://whatsmyaiq.online'>whatsmyaiq.online</a></p>" +
    "</main></body></html>";
}

export function snapshotEmail(assessment) {
  return renderFreeSnapshotEmail(assessment, { paymentsEnabled: process.env.PAYMENTS_ENABLED === "true" });
}

export async function sendBrevoEmail(email, subject, htmlContent) {
  const required = missingSettings(["BREVO_API_KEY", "BREVO_SENDER_EMAIL"]);
  if (required.length) throw new Error("Email delivery not configured");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: process.env.BREVO_SENDER_NAME || "What's My AIQ" },
      to: [{ email }],
      subject,
      htmlContent
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.messageId) {
    console.error("Brevo send failed", response.status, data?.code);
    throw new Error("Email delivery failed");
  }
  return data.messageId;
}

const SYSTEM_PROMPT = [
  "You are an expert AI capability coach, writing a useful, commercially valuable personalised readiness report.",
  "Treat the quiz as self-reported behavioural evidence, not a validated psychometric or predictive employment test.",
  "Never shame the user, promise career security, invent personalised facts or make unsupported claims about percentages of peers.",
  "Use the precise selected answers as evidence and adapt every recommendation to the stated audience.",
  "Return ONLY a JSON object with these keys:",
  'headline (string), summary (3-5 sentences), practice (3 concrete observations as strings),',
  'strengths (3 strings), gaps (3 strings), use_cases (3 specific role-relevant strings),',
  'fastest_win (one clear action), actions (array of exactly 3 objects with day and action keys for Day 1, Day 3, Day 7),',
  'thirty_day_plan (3 actionable strings), verdict (one grounded, encouraging sentence).',
  "All claims must derive from the inputs. No markdown fences, no external URLs, no score changes."
].join("\n");

export async function generatePaidReport(assessment) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Anthropic is not configured");
  const input = {
    score: assessment.score, maxScore: 60, tier: assessment.tier.label,
    personality: assessment.tier.personality, audience: assessment.audienceLabel,
    answers: assessment.responseDetails
  };
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2026-10-21",
      Authorization: "Bearer " + process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 2600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(input) }]
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Anthropic request failed", response.status, data?.error?.type);
    throw new Error("AI report generation failed");
  }
  const raw = data.content?.filter(part => part.type === "text").map(part => part.text).join("\n");
  if (!raw || data.stop_reason === "max_tokens") throw new Error("AI report was incomplete");
  let report;
  try {
    report = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/gi, "").trim());
  } catch {
    throw new Error("AI report returned invalid JSON");
  }
  const arrays = ["practice", "strengths", "gaps", "use_cases", "thirty_day_plan"];
  if (!report || !["headline", "summary", "fastest_win", "verdict"].every(k => typeof report[k] === "string" && report[k].length > 5) ||
      !arrays.every(k => Array.isArray(report[k]) && report[k].length >= 2 && report[k].every(x => typeof x === "string")) ||
      !Array.isArray(report.actions) || report.actions.length !== 3 ||
      !report.actions.every(x => x && typeof x.day === "string" && typeof x.action === "string")) {
    throw new Error("AI report failed content validation");
  }
  return report;
}

export function paidReportEmail(assessment, report) {
  return renderPaidReportEmail(assessment, report);
}

export function assessmentFromStripeSession(session) {
  if (session?.metadata?.product !== "aiq-report-v1") throw new Error("Not an AIQ report order");
  const answers = (session.metadata.answers || "").split(",").map(Number);
  const audience = session.metadata.audience;
  const email = session.customer_details?.email || session.customer_email;
  return assessQuiz({ answers, audience, email });
}
