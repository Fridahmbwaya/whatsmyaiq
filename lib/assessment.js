export const QUESTIONS = [
  {
    id: 1,
    question: "When you hear AI is changing your field, what's your honest reaction?",
    options: [
      { text: "I'm ahead of it — I'm already building or using the tools doing the changing", points: 5 },
      { text: "I'm aware and actively positioning myself ahead of it", points: 4 },
      { text: "I know I should be doing more, but haven't made it a priority", points: 3 },
      { text: "I feel behind and a bit anxious about it", points: 2 },
      { text: "Honestly I try not to think about it", points: 1 },
    ],
  },
  {
    id: 2,
    question: "How often do you actually use AI tools (ChatGPT, Claude, Gemini, etc.) right now?",
    options: [
      { text: "Multiple times a day — it's core to how I work or study", points: 5 },
      { text: "Daily, for writing, research, or thinking through problems", points: 4 },
      { text: "A few times a week — when I remember or have time", points: 3 },
      { text: "Occasionally — I've tried it but it's not a real habit", points: 2 },
      { text: "Barely at all", points: 1 },
    ],
  },
  {
    id: 3,
    question: "Which best describes your knowledge of AI tools available right now?",
    options: [
      { text: "I know multiple tools deeply — and use each for different reasons", points: 5 },
      { text: "I know a few tools well — and choose between them intentionally", points: 4 },
      { text: "I mainly use ChatGPT — it's my default for almost everything", points: 3 },
      { text: "I've heard of a few but mostly just use ChatGPT when I need something", points: 2 },
      { text: "I don't really know what's out there beyond ChatGPT", points: 1 },
    ],
  },
  {
    id: 4,
    question: "You need to research a complex topic and cite real sources. What do you actually do?",
    options: [
      { text: "I start with AI tools that surface sources, then verify key claims properly", points: 5 },
      { text: "I start with AI, then verify the important claims independently", points: 4 },
      { text: "I use AI and double-check only if something feels off", points: 3 },
      { text: "I mostly rely on AI and don't verify much unless I have to", points: 2 },
      { text: "I prefer not to use AI for serious research", points: 1 },
    ],
  },
  {
    id: 5,
    question: "When you use AI, how would you describe your prompting style?",
    options: [
      { text: "I design prompts deliberately using structure and strategy", points: 5 },
      { text: "I guide it as we go — pull, react, add context, iterate until it's right", points: 4 },
      { text: "I start with a detailed prompt and refine based on the output", points: 3 },
      { text: "I ask a clear question and try a few variations if needed", points: 2 },
      { text: "I type what I need and take what I get", points: 1 },
    ],
  },
  {
    id: 6,
    question: "AI gives you a confident, detailed answer — but something feels off. What do you do?",
    options: [
      { text: "I have a verification routine: cross-check, compare models, and flag uncertainty", points: 5 },
      { text: "I dig into the specific claim that feels wrong and verify it properly", points: 4 },
      { text: "I quickly spot-check the key facts", points: 3 },
      { text: "I use it, but keep in mind that it may need checking", points: 2 },
      { text: "I usually use it anyway — it's probably fine", points: 1 },
    ],
  },
  {
    id: 7,
    question: "Have you connected AI into a repeatable system — notes, tasks, spreadsheets, automations, or workflows?",
    options: [
      { text: "I've built systems or automations that run without me", points: 5 },
      { text: "AI is embedded into my regular workflow in a structured way", points: 4 },
      { text: "I use AI regularly in some tasks, but not systematically", points: 3 },
      { text: "I use AI ad hoc when I think of it", points: 2 },
      { text: "I don't really use AI in a structured way yet", points: 1 },
    ],
  },
  {
    id: 8,
    question: "Someone joins your team tomorrow and they're brilliant at AI. Your honest first reaction?",
    options: [
      { text: "I'd be the one they're learning from — I'm already ahead", points: 5 },
      { text: "Excited — I'd finally have someone to geek out with about this", points: 4 },
      { text: "Relieved — I could use the support, I know I'm behind", points: 3 },
      { text: "Honestly a bit threatened — they'd probably outshine me on things I should already know", points: 2 },
      { text: "Anxious — I wouldn't know where to start to catch up", points: 1 },
    ],
  },
];

export const AUDIENCE_NAMES = {
  student: "Student", work: "Employee / Professional",
  side: "Founder / Side Project", both: "Mixed work, school and projects"
};
export const SCORE_TIERS = [
  {min: 8, max: 15, label: "At Risk", personality: "The Bystander"},
  {min: 16, max: 22, label: "Operator", personality: "The Operator"},
  {min: 23, max: 28, label: "Navigator", personality: "The Navigator"},
  {min: 29, max: 33, label: "Architect", personality: "The Architect"},
  {min: 34, max: 40, label: "Vanguard", personality: "The Vanguard"}
];

export const LEVEL_GUIDES = {
  "At Risk": {
    tip: "Try one low-stakes AI task each day this week, and verify the result against an original source.",
    reading: [
      { title: "OpenAI Academy — AI fundamentals", url: "https://academy.openai.com/" },
      { title: "Microsoft Learn — AI learning paths", url: "https://learn.microsoft.com/en-us/training/browse/?terms=AI" }
    ]
  },
  Operator: {
    tip: "Choose one recurring task and build a repeatable prompt with context, desired format and a review step.",
    reading: [
      { title: "OpenAI Academy — practical AI learning", url: "https://academy.openai.com/" },
      { title: "DeepLearning.AI — short courses", url: "https://www.deeplearning.ai/short-courses/" }
    ]
  },
  Navigator: {
    tip: "Compare two AI tools on one meaningful task, document output quality and create a repeatable workflow.",
    reading: [
      { title: "DeepLearning.AI — short courses", url: "https://www.deeplearning.ai/short-courses/" },
      { title: "Microsoft Learn — AI learning paths", url: "https://learn.microsoft.com/en-us/training/browse/?terms=AI" }
    ]
  },
  Architect: {
    tip: "Turn your best individual workflow into a documented process with a measurement and human review gate.",
    reading: [
      { title: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { title: "DeepLearning.AI — short courses", url: "https://www.deeplearning.ai/short-courses/" }
    ]
  },
  Vanguard: {
    tip: "Evaluate impact across a team: measure quality, speed, error rate and governance before scaling agents.",
    reading: [
      { title: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { title: "Microsoft Learn — AI learning paths", url: "https://learn.microsoft.com/en-us/training/browse/?terms=AI" }
    ]
  }
};

export function assessQuiz(input) {
  const answers = input?.answers;
  const audience = input?.audience;
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length ||
      !answers.every((v, i) => Number.isInteger(v) && QUESTIONS[i].options.some(o => o.points === v))) {
    throw new Error("Invalid quiz answers");
  }
  if (!Object.hasOwn(AUDIENCE_NAMES, audience)) throw new Error("Invalid audience");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address");
  }
  const score = answers.reduce((sum, n) => sum + n, 0);
  const tier = SCORE_TIERS.find(t => score >= t.min && score <= t.max);
  if (!tier) throw new Error("Invalid quiz score");
  return {
    email, answers, audience, audienceLabel: AUDIENCE_NAMES[audience],
    score, tier, guide: LEVEL_GUIDES[tier.label],
    responseDetails: QUESTIONS.map((q, i) => ({
      question: q.question,
      answer: q.options.find(o => o.points === answers[i]).text,
      points: answers[i]
    }))
  };
}
