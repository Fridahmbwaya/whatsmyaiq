import { assessQuiz, QUESTIONS, AUDIENCE_NAMES } from "../../../lib/assessment";
import { renderFreeSnapshotEmail, renderPaidReportEmail } from "../../../lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fictional, deterministic sample content: no customer data, Stripe charge or Anthropic call.
// Keep this endpoint restricted to Vercel preview deployments.
const SAMPLE_USE_CASES = {
  student: [
    "Create a source-backed reading brief, checking citations against the original papers.",
    "Turn a lecture topic into a self-test, then answer before looking at AI explanations.",
    "Build a weekly revision checklist and compare your understanding before and after."
  ],
  work: [
    "Draft a meeting follow-up with decisions, owners and deadlines, then confirm against your notes.",
    "Use AI to structure a research brief while checking each key claim against its source.",
    "Document a repeated task as a short checklist and compare accuracy and time against your manual process."
  ],
  side: [
    "Turn customer questions into a first-pass FAQ, then review every answer against your product.",
    "Draft three testable customer discovery questions and use the answers to refine your offer.",
    "Create a repeatable content workflow with a human approval gate before publishing."
  ],
  both: [
    "Turn a repeated task from work or study into a reusable, reviewed checklist.",
    "Compare two AI tools on the same task and record which output you can actually trust.",
    "Build a short learning log that tracks your prompts, errors, time saved and next experiment."
  ]
};

function samplePaidReport(assessment) {
  const strongest = [...assessment.dimensions].sort((a,b) => b.score - a.score)[0];
  const growth = [...assessment.dimensions].sort((a,b) => a.score - b.score)[0];
  return {
    headline: "Your next AI advantage",
    summary: assessment.persona.intro + " Your answers suggest " + strongest.label.toLowerCase() +
      " is a relative strength, while " + growth.label.toLowerCase() +
      " is a useful place to focus next. This is a sample interpretation of fictional answers, not an ability diagnosis.",
    practice: [
      "On tool knowledge, the sample answer is: " + assessment.responseDetails[2].answer,
      "On verification, the sample answer is: " + assessment.responseDetails[5].answer,
      "On repeatable workflows, the sample answer is: " + assessment.responseDetails[6].answer
    ],
    strengths: [
      assessment.persona.strength,
      "Your strongest self-reported dimension is " + strongest.label.toLowerCase() + ".",
      "Your answers provide a starting point for tracking improvement over time."
    ],
    gaps: [
      assessment.persona.opportunity,
      "Develop one measurable habit around " + growth.label.toLowerCase() + ".",
      "Use a simple quality check rather than assuming a polished AI answer is correct."
    ],
    use_cases: SAMPLE_USE_CASES[assessment.audience],
    fastest_win: "Choose one low-risk task, try AI on it, verify the output and record what improved.",
    actions: [
      { day: "Day 1", action: "Choose a task and define what a good result would look like." },
      { day: "Day 3", action: "Try a structured prompt and verify its most important claim." },
      { day: "Day 7", action: "Compare the result with your original method and decide what to repeat." }
    ],
    thirty_day_plan: [
      "Week 1: Establish a reliable baseline on one task.",
      "Weeks 2–3: Improve the workflow, add checks and document what works.",
      "Week 4: Review quality, speed and confidence before expanding."
    ],
    verdict: "Build the next skill deliberately, then measure the difference."
  };
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== "preview") {
    return new Response("Not found", { status: 404 });
  }
  const url = new URL(request.url);
  const tier = url.searchParams.get("tier") || "Architect";
  const type = url.searchParams.get("type") || "free";
  const audience = url.searchParams.get("audience") || "work";
  const level = { "At Risk": 1, Operator: 2, Navigator: 3, Architect: 4, Vanguard: 5 }[tier];
  if (!level || !["free", "paid"].includes(type) || !Object.hasOwn(AUDIENCE_NAMES, audience)) {
    return new Response("Unknown sample", { status: 400 });
  }
  const answers = Array(QUESTIONS.length).fill(level);
  answers[5] = Math.max(1, level - 1);
  answers[8] = Math.min(5, level + 1);
  const assessment = assessQuiz({ email: "sample@example.com", answers, audience });
  const message = type === "paid"
    ? renderPaidReportEmail(assessment, samplePaidReport(assessment))
    : renderFreeSnapshotEmail(assessment, { paymentsEnabled: false });
  const previewLabel = type === "paid" ? "PAID REPORT SAMPLE" : "FREE EMAIL SAMPLE";
  const banner = "<div style='background:#222E2B;color:#fff;text-align:center;padding:13px 18px;font:700 12px Arial,sans-serif;letter-spacing:1px'>" +
    previewLabel + " · FICTIONAL QUIZ ANSWERS · NO EMAIL SENT OR PAYMENT MADE</div>";
  const html = message.htmlContent.replace(/(<body\b[^>]*>)/i, "$1" + banner);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; form-action 'none'; frame-ancestors 'none'"
    }
  });
}
