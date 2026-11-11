import test from "node:test";
import assert from "node:assert/strict";
import { assessQuiz, QUESTIONS, SCORE_TIERS } from "../lib/assessment.js";

const payload = (answer, audience = "work", email = "reader@example.com") => ({
  answers: Array(QUESTIONS.length).fill(answer), audience, email
});

test("all low answers map to At Risk, not an inflated tier", () => {
  const result = assessQuiz(payload(1));
  assert.equal(result.score, 8);
  assert.equal(result.tier.label, "At Risk");
  assert.equal(result.responseDetails.length, 8);
});

test("all high answers map to Vanguard", () => {
  const result = assessQuiz(payload(5, "student", "PERSON@EXAMPLE.COM"));
  assert.equal(result.score, 40);
  assert.equal(result.tier.label, "Vanguard");
  assert.equal(result.email, "person@example.com");
});

test("score tiers cover the entire 8–40 range without overlap", () => {
  for (let score = 8; score <= 40; score++) {
    const matches = SCORE_TIERS.filter(tier => score >= tier.min && score <= tier.max);
    assert.equal(matches.length, 1, "score " + score + " should belong to one tier");
  }
});

test("forged, missing and oversized answers are rejected", () => {
  assert.throws(() => assessQuiz({ ...payload(5), answers: [5] }), /Invalid quiz/);
  assert.throws(() => assessQuiz({ ...payload(5), answers: Array(8).fill(8) }), /Invalid quiz/);
  assert.throws(() => assessQuiz({ ...payload(5), audience: "admin" }), /Invalid audience/);
  assert.throws(() => assessQuiz({ ...payload(5), email: "not-an-email" }), /email/);
});

test("answers are converted to the actual selected quiz options", () => {
  const quiz = assessQuiz(payload(3));
  assert.equal(quiz.responseDetails[0].answer, QUESTIONS[0].options.find(opt => opt.points === 3).text);
  assert.equal(quiz.guide.reading.length, 2);
});
