import test from "node:test";
import assert from "node:assert/strict";
import { assessQuiz, QUESTIONS } from "../lib/assessment.js";
import { renderFreeSnapshotEmail, renderPaidReportEmail, escapeEmailHtml } from "../lib/email-templates.js";

const quiz = (value, audience = "work") => assessQuiz({
  email: "sample@example.com",
  audience,
  answers: Array(QUESTIONS.length).fill(value)
});

test("personality email includes a polished HTML layout and all four scores", () => {
  const result = quiz(4);
  const email = renderFreeSnapshotEmail(result, {paymentsEnabled:false});
  assert.match(email.subject, /Architect/);
  assert.match(email.htmlContent, /WHAT'S MY/);
  assert.match(email.htmlContent, /Four dimensions/);
  assert.match(email.htmlContent, /AI foundations/);
  assert.match(email.htmlContent, /Practical application/);
  assert.match(email.htmlContent, /Critical judgment/);
  assert.match(email.htmlContent, /Workflow &amp; mindset/);
  assert.match(email.htmlContent, /48/);
  assert.match(email.htmlContent, /60/);
  assert.match(email.htmlContent, /room to grow/i);
  assert.match(email.htmlContent, /full report is being prepared for launch/);
  assert.doesNotMatch(email.htmlContent, /<script/i);
});

test("free email varies by audience and personality", () => {
  const student = renderFreeSnapshotEmail(quiz(1,"student"),{paymentsEnabled:false});
  const builder = renderFreeSnapshotEmail(quiz(5,"side"),{paymentsEnabled:false});
  assert.match(student.subject, /Bystander/);
  assert.match(builder.subject, /Vanguard/);
  assert.match(student.htmlContent, /In your studies/);
  assert.match(builder.htmlContent, /founder or side-project builder/);
});

test("email escapes untrusted content", () => {
  assert.equal(escapeEmailHtml("<script>\"&'"), "&lt;script&gt;&quot;&amp;&#39;");
  const result=quiz(3);
  result.responseDetails[4].answer="<img src=x onerror=alert(1)>";
  result.persona.intro="<svg onload=alert(1)>";
  const email=renderFreeSnapshotEmail(result);
  assert.doesNotMatch(email.htmlContent, /<svg onload/);
});

test("paid report email includes all report sections", () => {
  const report={
    headline:"Your AIQ is ready",summary:"A thoughtful readiness profile for you.",
    practice:["Practice A","Practice B","Practice C"],
    strengths:["Strength 1","Strength 2","Strength 3"],
    gaps:["Gap 1","Gap 2","Gap 3"],
    use_cases:["Use A","Use B","Use C"],
    fastest_win:"One small experiment to try tomorrow",
    actions:[{day:"Day 1",action:"Define your task"},{day:"Day 3",action:"Try a prompt"},{day:"Day 7",action:"Review outcome"}],
    thirty_day_plan:["Week 1 step","Week 2 step","Week 3 step"],
    verdict:"Keep improving your routines."
  };
  const message=renderPaidReportEmail(quiz(3),report);
  for(const phrase of ["Your next 7 days","Your next 30 days","Three use cases","Strength 1","Day 7","AIQ DNA"]) {
    assert.match(message.htmlContent,new RegExp(phrase,"i"));
  }
});
