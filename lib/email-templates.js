import { DIMENSION_COACHING } from "./assessment.js";

export function escapeEmailHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
}

const COLORS = {
  "At Risk": {accent:"#F77D80",pale:"#FFF0F0"},
  Operator: {accent:"#F6A955",pale:"#FFF6E8"},
  Navigator: {accent:"#45BBD8",pale:"#E9F8FC"},
  Architect: {accent:"#AD8DF0",pale:"#F4EFFD"},
  Vanguard: {accent:"#4AE1BF",pale:"#EBFFF8"}
};

function text(value) { return escapeEmailHtml(value); }
function pill(label, color) {
  return "<span style='display:inline-block;background:" + color + ";color:#10182B;border-radius:24px;" +
    "padding:7px 13px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase'>" + text(label) + "</span>";
}
function heading(kicker, title) {
  return "<p style='font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#72869C;margin:0 0 9px'>" + text(kicker) + "</p>" +
    "<h2 style='font-size:24px;letter-spacing:-.7px;line-height:1.2;color:#111A2E;margin:0 0 18px;font-weight:800'>" + text(title) + "</h2>";
}
function paragraph(value) {
  return "<p style='font-size:15px;line-height:1.8;color:#47566A;margin:0 0 14px'>" + text(value) + "</p>";
}
function list(items) {
  return "<ul style='margin:10px 0 0;padding:0 0 0 20px'>" + items.map(item =>
    "<li style='color:#47566A;font-size:14px;line-height:1.75;margin:0 0 9px'>" + text(item) + "</li>"
  ).join("") + "</ul>";
}
function card(content, background="#F4F7FB") {
  return "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='border-collapse:separate;border-radius:14px;background:" + background + ";margin:12px 0 24px'><tr><td style='padding:21px 23px'>" + content + "</td></tr></table>";
}
function outer(eyebrow, title, subtitle, score, max, badge, content, previewText) {
  const accent = COLORS[badge]?.accent || "#48D8E9";
  return "<!doctype html><html lang='en'><head><meta charset='UTF-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/>" +
    "<title>" + text(title) + "</title>" +
    "<style>@media only screen and (max-width:640px){.wrap{width:100%!important}.pad{padding-left:24px!important;padding-right:24px!important}.hero-title{font-size:34px!important}.score-cell{font-size:44px!important}}</style></head>" +
    "<body style='margin:0;padding:0;background:#0D1220;font-family:Arial,Helvetica,sans-serif;color:#172034'>" +
    "<div style='display:none;max-height:0;overflow:hidden;opacity:0'>" + text(previewText) + "</div>" +
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0' style='background:#0D1220;border-collapse:collapse'><tr><td align='center' style='padding:36px 12px 50px'>" +
    "<table class='wrap' role='presentation' width='620' cellpadding='0' cellspacing='0' border='0' style='width:620px;max-width:100%;border-collapse:separate;overflow:hidden;border-radius:19px;background:#ffffff'>" +
    "<tr><td class='pad' style='padding:22px 42px;background:#11192B;border-bottom:1px solid #354153'>" +
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td style='font-size:16px;font-weight:900;color:#FFFFFF;letter-spacing:1px'>WHAT'S MY <span style='color:" + accent + "'>AIQ</span></td>" +
    "<td align='right' style='font-size:10px;font-weight:800;letter-spacing:1.3px;color:#A7BBCC'>YOUR AI READINESS PROFILE</td></tr></table></td></tr>" +
    "<tr><td class='pad' style='padding:40px 42px 34px;background:#11192B'>" +
    "<p style='margin:0 0 12px;color:" + accent + ";font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase'>" + text(eyebrow) + "</p>" +
    "<h1 class='hero-title' style='margin:0 0 12px;color:#FFFFFF;font-size:42px;line-height:1.05;letter-spacing:-1.3px;font-weight:900'>" + text(title) + "</h1>" +
    "<p style='margin:0 0 26px;color:#C2CEDA;line-height:1.75;font-size:15px'>" + text(subtitle) + "</p>" +
    "<table role='presentation' cellpadding='0' cellspacing='0' border='0' width='100%' style='border-collapse:separate;border-radius:13px;background:#1C2940'><tr>" +
    "<td style='padding:16px 20px'><p style='margin:0;color:#AEBED0;font-size:10px;letter-spacing:1.3px;font-weight:800'>YOUR AIQ SCORE</p>" +
    "<div class='score-cell' style='margin:3px 0 0;color:#FFFFFF;font-size:50px;font-weight:900;line-height:1.1'>" + text(score) +
    "<span style='font-size:18px;color:#91A3B6;font-weight:500'> / " + text(max) + "</span></div></td>" +
    "<td align='right' style='padding:16px 20px;vertical-align:middle'>" + pill(badge, accent) + "<p style='color:#AEBED0;font-size:10px;margin:9px 0 0'>Self-reported snapshot</p></td>" +
    "</tr></table></td></tr>" +
    "<tr><td class='pad' style='padding:34px 42px 12px;background:#FFFFFF'>" + content + "</td></tr>" +
    "<tr><td class='pad' style='padding:18px 42px 32px;background:#F5F7FA;border-top:1px solid #E7EBF2'>" +
    "<table role='presentation' width='100%'><tr><td style='font-size:12px;font-weight:900;color:#182138'>WHAT'S MY <span style='color:" + accent + "'>AIQ</span></td>" +
    "<td align='right' style='font-size:12px;color:#8290A3'><a href='https://whatsmyaiq.online' style='color:#61748D;text-decoration:none'>whatsmyaiq.online</a></td></tr></table>" +
    "<p style='font-size:11px;line-height:1.6;color:#95A0B0;margin:16px 0 0'>Your AIQ score describes your answers to a self-reported readiness quiz. It is not a validated IQ, intelligence or employment assessment. This is a one-time transactional email, not a marketing subscription.</p>" +
    "</td></tr></table></td></tr></table></body></html>";
}

function dimensionRow(d, accent) {
  const color = accent || "#33A8C2";
  const percentage = Math.round(100 * d.score / d.max);
  return "<tr><td style='padding:10px 0 3px;color:#1A2639;font-size:14px;font-weight:700'>" + text(d.label) + "</td>" +
    "<td align='right' style='padding:10px 0 3px;color:#4B5D73;font-size:13px;font-weight:800'>" + d.score + "/" + d.max + "</td></tr>" +
    "<tr><td colspan='2' style='padding:0 0 8px'><table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;background:#E9EDF4;border-radius:6px'><tr>" +
    "<td style='height:8px;width:" + percentage + "%;background:" + color + ";border-radius:6px;font-size:1px'>&nbsp;</td>" +
    "<td style='height:8px;font-size:1px'>&nbsp;</td></tr></table></td></tr>";
}
function sectionBreak() {
  return "<div style='height:1px;background:#E7EBF0;margin:27px 0 26px'></div>";
}

const AUDIENCE_LENS = {
  student: "In your studies, focus on how AI can deepen understanding while leaving room for independent thinking and academic integrity.",
  work: "At work, measure usefulness by accuracy and repeatability—not only how quickly a draft appears.",
  side: "As a founder or side-project builder, prioritize the problems AI helps you solve for real users, not the number of tools you try.",
  both: "Because you move across study, work and side projects, look for reliable habits that transfer across contexts."
};

export function renderFreeSnapshotEmail(assessment, options = {}) {
  const { score, tier, audience, audienceLabel, persona, dimensions, guide } = assessment;
  const strongest = [...dimensions].sort((a,b) => b.score - a.score)[0];
  const growth = [...dimensions].sort((a,b) => a.score - b.score)[0];
  const copy = DIMENSION_COACHING[growth.id];
  const leadingCopy = DIMENSION_COACHING[strongest.id];
  const accent = COLORS[tier.label]?.accent || "#4CD6E8";
  const pale = COLORS[tier.label]?.pale || "#ECF8FB";
  const userExample = growth.questionIds.map(id => assessment.responseDetails[id-1]).sort((a,b)=>a.points-b.points)[0];
  const summary = heading("01 / Your personality", "Meet " + tier.personality) +
    paragraph(persona.intro) + paragraph(AUDIENCE_LENS[audience] || AUDIENCE_LENS.work) +
    sectionBreak() +
    heading("02 / Your AIQ DNA", "Four dimensions. Your unique pattern.") +
    "<p style='margin:0 0 14px;color:#627187;font-size:13px;line-height:1.6'>These four signals come directly from your 12 quiz answers. They show where you report confidence and where to build next.</p>" +
    "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='border-collapse:collapse'>" + dimensions.map(d => dimensionRow(d, accent)).join("") + "</table>" +
    sectionBreak() +
    heading("03 / What stands out", "Your strongest signal and growth edge") +
    card("<p style='color:#56637A;font-size:11px;letter-spacing:1.4px;font-weight:900;margin:0 0 6px'>YOUR LEADING SIGNAL</p>" +
      "<p style='font-size:20px;font-weight:900;color:#17263A;margin:0 0 8px'>" + text(strongest.label) + "</p>" +
      paragraph(leadingCopy.high), pale) +
    card("<p style='color:#56637A;font-size:11px;letter-spacing:1.4px;font-weight:900;margin:0 0 6px'>ROOM TO GROW</p>" +
      "<p style='font-size:20px;font-weight:900;color:#17263A;margin:0 0 8px'>" + text(growth.label) + "</p>" +
      paragraph(copy.low) +
      "<p style='font-size:12px;line-height:1.65;color:#68738B;margin:5px 0 0'>One answer behind this signal: “" + text(userExample.answer) + "”</p>", pale) +
    sectionBreak() +
    heading("04 / Your first move", "One useful thing to try this week") +
    card("<p style='font-size:17px;font-weight:800;line-height:1.55;color:#182438;margin:0'>" + text(copy.action) + "</p>",pale) +
    heading("A little more to explore", "Two worthwhile reads") +
    guide.reading.map((r,i) => "<p style='padding:12px 0;margin:0;border-bottom:1px solid #E9EEF4'><span style='color:#8FA3B6;font-size:12px;font-weight:800;margin-right:12px'>0"+(i+1)+"</span><a style='font-size:14px;color:#1D7898;font-weight:700;text-decoration:underline' href='"+text(r.url)+"'>"+text(r.title)+"</a></p>").join("") +
    sectionBreak() +
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#11192B;border-collapse:separate;border-radius:14px;margin-bottom:24px'><tr><td style='padding:28px'>" +
    "<p style='color:" + accent + ";font-size:11px;font-weight:900;letter-spacing:1.5px;margin:0 0 9px'>WHEN YOU'RE READY FOR MORE</p>" +
    "<h2 style='color:#FFFFFF;font-size:23px;line-height:1.25;margin:0 0 12px'>Your deeper AIQ report · $24.99</h2>" +
    "<p style='color:#C9D5E2;font-size:14px;line-height:1.7;margin:0 0 16px'>Unlock a closer look at your answers, three tailored use cases, the gaps holding you back, and practical 7- and 30-day plans.</p>" +
    (options.paymentsEnabled ?
      "<a href='https://whatsmyaiq.online' style='display:inline-block;background:#32DBE4;border-radius:9px;padding:13px 18px;color:#0E1728;font-size:13px;font-weight:900;text-decoration:none'>EXPLORE THE FULL REPORT</a>" :
      "<p style='color:#99CED5;font-size:12px;font-weight:700;margin:0'>The full report is being prepared for launch.</p>") +
    "</td></tr></table>";
  const htmlContent = outer("Free personality profile · " + persona.eyebrow,
    "The " + tier.personality.replace(/^The /, ""), "A personalised look at your AI readiness as a " + audienceLabel,
    score, 60, tier.label, summary, "Your personality, four AIQ scores and first practical move are inside.");
  return {
    subject: "Your AIQ personality is in: " + tier.personality + " · " + score + "/60",
    htmlContent
  };
}

export function renderPaidReportEmail(assessment, report) {
  const { score, tier, dimensions, audienceLabel } = assessment;
  const accent = COLORS[tier.label]?.accent || "#4CD6E8";
  const content =
    heading("01 / Your diagnosis", "What your answers are telling us") +
    paragraph(report.summary) +
    sectionBreak() +
    heading("02 / Your AIQ DNA", "Your four readiness signals") +
    "<table role='presentation' width='100%' cellpadding='0' cellspacing='0'>" + dimensions.map(d => dimensionRow(d, accent)).join("") + "</table>" +
    sectionBreak() +
    heading("03 / Your patterns", "How your AIQ shows up in practice") +
    list(report.practice) +
    card(heading("Your strengths", "What to build on") + list(report.strengths), "#EBF9F7") +
    card(heading("Your growth edges", "Where to focus next") + list(report.gaps), "#F6F1FC") +
    sectionBreak() +
    heading("04 / Actionable opportunities", "Three use cases worth trying") +
    list(report.use_cases) +
    card("<p style='margin:0 0 10px;color:#177B86;font-size:11px;font-weight:900;letter-spacing:1.2px'>YOUR FASTEST WIN</p>" +
      "<p style='margin:0;color:#18263A;font-size:18px;font-weight:800;line-height:1.6'>" + text(report.fastest_win) + "</p>","#E9F8FA") +
    sectionBreak() +
    heading("05 / Your action plan", "Your next 7 days") +
    list(report.actions.map(a=>a.day + ": " + a.action)) +
    heading("Build the habit", "Your next 30 days") +
    list(report.thirty_day_plan) +
    sectionBreak() +
    heading("06 / Keep learning", "Resources for your level") +
    assessment.guide.reading.map((r,i)=>"<p style='padding:12px 0;margin:0;border-bottom:1px solid #E9EEF4'><a style='font-size:14px;color:#1D7898;font-weight:700;text-decoration:underline' href='"+text(r.url)+"'>"+text(r.title)+"</a></p>").join("") +
    card("<p style='font-size:11px;letter-spacing:1px;font-weight:900;color:#647CB1;margin:0 0 9px'>WHAT COMES NEXT</p>" +
      paragraph(report.verdict) +
      "<p style='font-size:13px;line-height:1.6;color:#6F7B8B;margin:0'>Tailored paid AI learning modules are in development; they are not part of this purchase.</p>");
  const htmlContent = outer("Premium AIQ report · personalised",
    report.headline, "Your personalised AI capability report for " + audienceLabel,
    score, 60, tier.label, content, "Your personalised capability gaps, real use cases, and action plan are inside.");
  return {subject: "Your personalised AIQ report · " + tier.personality, htmlContent};
}
