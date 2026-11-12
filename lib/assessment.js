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
  {
    id: 9,
    question: "What is the most accurate description of a large language model (LLM)?",
    options: [
      { text: "It predicts and generates text from learned patterns and context; even confident answers may be wrong", points: 5 },
      { text: "It generates responses using learned patterns, but I still need to verify important facts", points: 4 },
      { text: "It learns from lots of examples, though I'm not sure how responses are created", points: 3 },
      { text: "It searches the internet in real time for accurate answers by default", points: 2 },
      { text: "It retrieves verified answers from a database, so its facts are generally guaranteed", points: 1 },
    ],
  },
  {
    id: 10,
    question: "Before giving AI a document containing personal or confidential information, what do you do?",
    options: [
      { text: "Check approval and data policies, remove unnecessary sensitive information, and review outputs", points: 5 },
      { text: "Check the tool's privacy and company policies and redact sensitive details", points: 4 },
      { text: "Avoid uploading very sensitive information, but I rarely check the policy", points: 3 },
      { text: "Upload it if the tool seems reputable and avoid sharing the result", points: 2 },
      { text: "Assume my conversation is private and upload the full document", points: 1 },
    ],
  },
  {
    id: 11,
    question: "You have an unfamiliar task that AI might help with. How do you decide where to start?",
    options: [
      { text: "Define the desired output, choose the right tool, test quality, and compare with a manual baseline", points: 5 },
      { text: "Think through the task, try a suitable tool, and improve based on results", points: 4 },
      { text: "Try my usual AI tool and adjust the prompt if it struggles", points: 3 },
      { text: "Ask my usual chatbot to do the task and see what happens", points: 2 },
      { text: "I usually avoid AI if I haven't used it for that exact task before", points: 1 },
    ],
  },
  {
    id: 12,
    question: "You have used AI for the same task repeatedly. How do you know it is genuinely helping?",
    options: [
      { text: "Track time, output quality, errors and review effort; keep improving the workflow", points: 5 },
      { text: "Compare time and quality with doing the task without AI", points: 4 },
      { text: "Notice whether it feels faster and whether results are good enough", points: 3 },
      { text: "Assume it helps if I use it often", points: 2 },
      { text: "I don't measure outcomes or repeat AI workflows", points: 1 },
    ],
  },
];

export const AUDIENCE_NAMES = {
  student: "Student", work: "Employee / Professional",
  side: "Founder / Side Project", both: "Mixed work, school and projects"
};
export const SCORE_TIERS = [
  {min: 12, max: 23, label: "At Risk", personality: "The Bystander"},
  {min: 24, max: 34, label: "Operator", personality: "The Operator"},
  {min: 35, max: 43, label: "Navigator", personality: "The Navigator"},
  {min: 44, max: 50, label: "Architect", personality: "The Architect"},
  {min: 51, max: 60, label: "Vanguard", personality: "The Vanguard"}
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


export const AIQ_DIMENSIONS = [
  { id: "foundations", label: "AI foundations", short: "What AI can and cannot do", questionIds: [3,9,10] },
  { id: "application", label: "Practical application", short: "How deliberately you use AI", questionIds: [2,5,11] },
  { id: "judgment", label: "Critical judgment", short: "How you verify and evaluate results", questionIds: [4,6,12] },
  { id: "integration", label: "Workflow & mindset", short: "How you make AI part of your work", questionIds: [1,7,8] }
];

export const PERSONA_PROFILES = {
  "At Risk": {
    eyebrow: "Early explorer",
    intro: "You sense that AI is changing the game, but it has not yet become a reliable part of your day. That does not describe your potential—it describes your starting point.",
    strength: "Being willing to assess your habits is the first step towards building genuine fluency.",
    opportunity: "Build one repeatable, low-stakes use case before worrying about advanced tools.",
    nudge: "One well-chosen habit is worth more than ten apps you rarely open."
  },
  Operator: {
    eyebrow: "Everyday user",
    intro: "You've started using AI, often to speed up individual tasks. The next leap is less about using it more and more about using it with intention.",
    strength: "You already know where AI can remove friction from familiar work.",
    opportunity: "Turn repeated prompts into a consistent, verifiable workflow.",
    nudge: "The difference between occasional help and real leverage is a system."
  },
  Navigator: {
    eyebrow: "Deliberate user",
    intro: "You're developing judgment around when and how to use AI. You've moved beyond experimentation, but there may still be untapped value in making your methods systematic.",
    strength: "You can adapt tools and prompts instead of accepting the first answer.",
    opportunity: "Compare results across tools and document the practices that work.",
    nudge: "Good intuition becomes powerful when you can teach it and repeat it."
  },
  Architect: {
    eyebrow: "System builder",
    intro: "You already think beyond a single prompt. Your next frontier is creating AI-assisted workflows that hold up when repeated, measured and shared.",
    strength: "You're inclined to structure work around outcomes, not just clever outputs.",
    opportunity: "Measure the quality of your systems and put clear review gates in place.",
    nudge: "The strongest AI workflow is one another person can trust and use."
  },
  Vanguard: {
    eyebrow: "AI frontrunner",
    intro: "You report advanced AI habits and a willingness to lead. Staying ahead now calls for evidence, governance and an ability to help others succeed—not just personal speed.",
    strength: "You think about AI as a capability that can transform how work gets done.",
    opportunity: "Develop benchmarks, safeguards and coaching that let high-quality work scale.",
    nudge: "Your next leap is from personal mastery to measurable impact."
  }
};

export const DIMENSION_COACHING = {
  foundations: {
    high: "You show familiarity with the tools, concepts and privacy decisions around AI.",
    low: "Explore what LLMs can and cannot reliably do, and check data handling before sharing files.",
    action: "Explain in your own words how an LLM generates a response, then test one claim against a reliable source."
  },
  application: {
    high: "Your responses suggest you use AI with purpose rather than only when something comes to mind.",
    low: "There may be room to choose tools and prompts more deliberately.",
    action: "Pick a real task and write a prompt that specifies context, constraints, output format and success criteria."
  },
  judgment: {
    high: "You demonstrate habits for checking claims and evaluating results.",
    low: "Verification and outcome measurement are promising areas to strengthen.",
    action: "Compare an AI result to an original source, then record one error or uncertainty you caught."
  },
  integration: {
    high: "You are thinking about AI as a repeatable way of working.",
    low: "Individual experiments may not yet translate into consistent habits.",
    action: "Turn one useful AI interaction into a short checklist you can follow again next week."
  }
};

export function calculateDimensions(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) throw new Error("Invalid quiz answers");
  return AIQ_DIMENSIONS.map(dimension => {
    const values = dimension.questionIds.map(id => answers[id - 1]);
    const score = values.reduce((sum,value) => sum + value, 0);
    const max = 5 * values.length;
    return {
      ...dimension, score, max, percentage: Math.round(100 * (score - values.length) / (max - values.length))
    };
  });
}

export function assessQuiz(input) {
  const answers = input?.answers;
  const audience = input?.audience;
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length ||
      !answers.every((v, i) => Number.isInteger(v) && QUESTIONS[i].options.some(o => o.points === v))) {
    throw new Error("Invalid quiz answers");
  }
  if (!Object.hasOwn(AUDIENCE_NAMES, audience)) throw new Error("Invalid audience");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new Error("Enter a valid email address");
  }
  const score = answers.reduce((sum, n) => sum + n, 0);
  const tier = SCORE_TIERS.find(t => score >= t.min && score <= t.max);
  if (!tier) throw new Error("Invalid quiz score");
  return {
    email, answers, audience, audienceLabel: AUDIENCE_NAMES[audience],
    score, tier, guide: LEVEL_GUIDES[tier.label], persona: PERSONA_PROFILES[tier.label], dimensions: calculateDimensions(answers),
    responseDetails: QUESTIONS.map((q, i) => ({
      question: q.question,
      answer: q.options.find(o => o.points === answers[i]).text,
      points: answers[i]
    }))
  };
}
