import { NextResponse } from "next/server";
import { assessQuiz } from "../../../lib/assessment";
import { sendBrevoEmail, snapshotEmail } from "../../../lib/services";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) {
      return NextResponse.json({ error: "Invalid request" }, { status: 413 });
    }
    const input = await request.json();
    if (input.website) return NextResponse.json({ ok: true });
    const quiz = assessQuiz(input);
    const message = snapshotEmail(quiz);
    await sendBrevoEmail(quiz.email, message.subject, message.htmlContent);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (/Invalid quiz|Invalid audience|Enter a valid email/.test(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Free snapshot email failed", error.message);
    return NextResponse.json({ error: "We couldn't send the snapshot. Please try again later." }, { status: 502 });
  }
}
