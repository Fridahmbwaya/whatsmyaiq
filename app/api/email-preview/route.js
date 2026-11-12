import { assessQuiz, QUESTIONS } from "../../../lib/assessment";
import { renderFreeSnapshotEmail } from "../../../lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (process.env.VERCEL_ENV !== "preview") {
    return new Response("Not found", { status: 404 });
  }
  const tier = new URL(request.url).searchParams.get("tier") || "Architect";
  const level = { "At Risk": 1, Operator: 2, Navigator: 3, Architect: 4, Vanguard: 5 }[tier];
  if (!level) return new Response("Unknown personality", { status: 400 });
  const answers = Array(QUESTIONS.length).fill(level);
  answers[5] = Math.max(1, level - 1);
  answers[8] = Math.min(5, level + 1);
  const assessment = assessQuiz({ email:"sample@example.com", answers, audience:"work" });
  const message = renderFreeSnapshotEmail(assessment,{paymentsEnabled:false});
  return new Response(message.htmlContent, {
    status: 200,
    headers: { "Content-Type":"text/html; charset=utf-8", "Cache-Control":"no-store",
      "X-Robots-Tag":"noindex", "Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; form-action 'none'; frame-ancestors 'none'" }
  });
}
