import test from "node:test";
import assert from "node:assert/strict";
import { assessQuiz, QUESTIONS, SCORE_TIERS, calculateDimensions, AIQ_DIMENSIONS } from "../lib/assessment.js";

const payload = (answer, audience = "work", email = "reader@example.com") => ({
  answers: Array(QUESTIONS.length).fill(answer), audience, email
});

test("all low answers map to At Risk, not an inflated tier", () => {
  const result = assessQuiz(payload(1));
  assert.equal(result.score, 12);
  assert.equal(result.tier.label, "At Risk");
  assert.equal(result.responseDetails.length, 12);
});

test("all high answers map to Vanguard", () => {
  const result = assessQuiz(payload(5, "student", "PERSON@EXAMPLE.COM"));
  assert.equal(result.score, 60);
  assert.equal(result.tier.label, "Vanguard");
  assert.equal(result.email, "person@example.com");
});

test("score tiers cover the entire 12–60 range without overlap", () => {
  for (let score = 12; score <= 60; score++) {
    const matches = SCORE_TIERS.filter(tier => score >= tier.min && score <= tier.max);
    assert.equal(matches.length, 1, "score " + score + " should belong to one tier");
  }
});

test("forged, missing and oversized answers are rejected", () => {
  assert.throws(() => assessQuiz({ ...payload(5), answers: [5] }), /Invalid quiz/);
  assert.throws(() => assessQuiz({ ...payload(5), answers: Array(QUESTIONS.length).fill(8) }), /Invalid quiz/);
  assert.throws(() => assessQuiz({ ...payload(5), audience: "admin" }), /Invalid audience/);
  assert.throws(() => assessQuiz({ ...payload(5), email: "not-an-email" }), /email/);
});

test("answers are converted to the actual selected quiz options", () => {
  const quiz = assessQuiz(payload(3));
  assert.equal(quiz.responseDetails[0].answer, QUESTIONS[0].options.find(opt => opt.points === 3).text);
  assert.equal(quiz.guide.reading.length, 2);
});

test("AIQ includes concept, privacy, tool selection and evaluation questions", () => {
  assert.equal(QUESTIONS.length, 12);
  assert.equal(QUESTIONS[8].id, 9);
  assert.match(QUESTIONS[8].question, /language model/);
  assert.match(QUESTIONS[9].question, /personal or confidential/);
});

test("four distinct dimensions each use three questions", () => {
  const dimensions = calculateDimensions(payload(3).answers);
  assert.equal(dimensions.length, 4);
  assert.deepEqual(dimensions.map(d => d.score), [9,9,9,9]);
  assert.equal(dimensions.reduce((sum, d) => sum + d.score, 0), 36);
  const ids = AIQ_DIMENSIONS.flatMap(d => d.questionIds).sort((a,b)=>a-b);
  assert.deepEqual(ids, Array.from({ length: QUESTIONS.length }, (_, i) => i + 1));
});

test("dimension scores change independently when only one answer changes", () => {
  const answers = payload(3).answers;
  const before = calculateDimensions(answers);
  answers[8] = 5; // LLM knowledge, part of AI foundations
  const after = calculateDimensions(answers);
  assert.equal(after[0].score, before[0].score + 2);
  for (let i=1; i<4; i++) assert.equal(after[i].score, before[i].score);
});
