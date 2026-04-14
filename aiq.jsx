"use client";
import { useState, useEffect } from "react";

const AUDIENCES = [
  { id: "student", emoji: "📚", label: "Student", sub: "School, university, or studying" },
  { id: "work", emoji: "💼", label: "Professional", sub: "Your job or career" },
  { id: "side", emoji: "🚀", label: "Building something", sub: "Side project, startup, or freelance" },
  { id: "both", emoji: "🔀", label: "All of the above", sub: "School + work + something on the side" },
];

const QUESTIONS = [
  {
    id: 1,
    question: "When you hear AI is changing your field, what's your honest reaction?",
    options: [
      { text: "I'm ahead of it — I'm building or using the tools doing the changing", points: 5 },
      { text: "I'm aware and actively positioning myself ahead of it", points: 4 },
      { text: "I know I should do more but haven't made it a priority", points: 3 },
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
      { text: "A few times a week when I remember to", points: 3 },
      { text: "Occasionally — I've tried it but it's not a real habit", points: 2 },
      { text: "Barely at all", points: 1 },
    ],
  },
  {
    id: 3,
    question: "Which best describes your knowledge of AI tools available right now?",
    options: [
      { text: "I know multiple tools deeply — Claude, Perplexity, DeepSeek, ChatGPT — and use each for different reasons", points: 5 },
      { text: "I know a few tools well and have clear reasons for using each", points: 4 },
      { text: "I mainly use ChatGPT and know a couple of others exist", points: 3 },
      { text: "I've heard of a few but mostly just use ChatGPT when I need something", points: 2 },
      { text: "I don't really know what's out there beyond ChatGPT", points: 1 },
    ],
  },
  {
    id: 4,
    question: "You need to research a complex topic and cite real sources. What do you actually do?",
    options: [
      { text: "Use Perplexity or Claude — I need cited, verifiable sources I can trust", points: 5 },
      { text: "Ask ChatGPT then verify the key claims independently", points: 4 },
      { text: "Ask ChatGPT and mostly trust what it gives me", points: 3 },
      { text: "Google it — I go deep myself, cross-referencing multiple sources", points: 2 },
      { text: "I just Google it, AI isn't really part of my research process yet", points: 1 },
    ],
  },
  {
    id: 5,
    question: "When you use AI, how would you describe your prompting style?",
    options: [
      { text: "I use structured frameworks — role, context, task, format — and engineer prompts deliberately", points: 5 },
      { text: "I guide it as we go — I pull, react to the output, add context, and iterate until it's right", points: 4 },
      { text: "I write detailed prompts upfront and refine based on what comes back", points: 3 },
      { text: "I type a clear question and try a couple of variations if it doesn't work", points: 2 },
      { text: "I type what I need and take what I get", points: 1 },
    ],
  },
  {
    id: 6,
    question: "AI gives you a confident, detailed answer — but something feels off. What do you do?",
    options: [
      { text: "I have a verification routine: cross-check sources, run a second model, flag uncertainties", points: 5 },
      { text: "I dig into the specific claim that felt wrong and verify it properly", points: 4 },
      { text: "I Google the main facts to spot-check", points: 3 },
      { text: "I use it but add a mental note that it might need checking", points: 2 },
      { text: "I use it anyway — it's probably fine", points: 1 },
    ],
  },
  {
    id: 7,
    question: "Have you ever connected AI into a repeatable system — notes, tasks, spreadsheets, automations, or workflows?",
    options: [
      { text: "Yes — I've built agents or automations that run without me", points: 5 },
      { text: "Yes — AI is embedded into my regular workflow in a structured way", points: 4 },
      { text: "Partially — I use AI in some tasks regularly but it's not fully systematised", points: 3 },
      { text: "Not really — I use it ad hoc when I think of it", points: 2 },
      { text: "No, I haven't gotten that far yet", points: 1 },
    ],
  },
  {
    id: 8,
    question: "If your company or university hired someone great at AI tomorrow — how would you compare?",
    options: [
      { text: "I'd be the benchmark they're measured against", points: 5 },
      { text: "I'd hold my own — I have real, practical AI skills", points: 4 },
      { text: "I'd be roughly equal — neither ahead nor behind", points: 3 },
      { text: "They'd probably outshine me in most areas", points: 2 },
      { text: "I wouldn't be close", points: 1 },
    ],
  },
];

const TIER_IMAGES = {
  "At Risk": "/images/bystander.png",
  "Operator": "/images/operator.png",
  "Navigator": "/images/navigator.png",
  "Architect": "/images/architect.png",
  "Vanguard": "/images/leader.png",
};

const TIERS = [
  {
    min: 8, max: 15,
    label: "At Risk", emoji: "🚨",
    color: "#C0392B", lightColor: "#FDECEA", accentColor: "#E74C3C",
    urgency: "HIGH RISK",
    tagline: "AI isn't coming for your future. It's already reshaping it.",
    short: "The gap between you and someone who uses AI daily is widening every week.",
    emailTeaser: {
      win: "You're self-aware enough to take this seriously — most people aren't",
      gap1: "AI isn't part of your actual workflow yet",
      gap2: "You're spending hours on tasks AI could halve",
    },
    badges: { strong: "Awareness", weak: "Workflow", lane: "Daily habits" },
    personality: {
      title: "The Bystander",
      description: "You know AI is happening. You've probably heard about ChatGPT. But it hasn't become part of how you actually work or study — and that's the real risk. Not because AI is scary, but because the people around you are quietly building habits that compound every week.",
      looks_like: [
        "You Google things you could ask AI in 10 seconds",
        "You've seen AI demos but never made it a daily habit",
        "The words 'prompt engineering' don't mean much to you yet",
        "You feel a bit behind but aren't sure where to start",
      ],
    },
    modules: {
      student: [
        { step: "Start here", tag: "FOUNDATION", title: "What AI Actually Is — And Why It Changes How You Study", outcome: "Save 3+ hours a week on reading, notes, and research", content: "AI isn't a shortcut to cheating — it's a thinking partner that makes you faster and sharper. This module breaks down what AI can and can't do for students, how to use it without academic integrity risk, and the 3 habits that separate students who use AI well from those who get burned by it.", takeaways: ["How AI actually works in plain language", "The academic integrity line — and how to stay on the right side", "3 daily habits that build your AI skill automatically"] },
        { step: "Then this", tag: "ACTION", title: "Your First AI Study Stack: Tools That Actually Help", outcome: "Go from zero to a working AI study routine in 7 days", content: "You don't need to try everything. This module gives you a starter kit matched to what students actually need — note synthesis, essay drafting, research, and revision — with specific tools and how to use each one.", takeaways: ["The 3 tools every student should start with", "How to use AI for notes without losing your own thinking", "A 7-day habit plan to make AI stick"] },
        { step: "Then this", tag: "SKILLS", title: "How to Ask AI Good Questions (It Changes Everything)", outcome: "Get dramatically better outputs from every AI interaction", content: "The biggest mistake beginners make is typing vague questions and getting vague answers. This module teaches you the prompting fundamentals that change your results immediately.", takeaways: ["The 4-part prompt that works for almost anything", "Before and after examples from real student tasks", "How to iterate when the first answer isn't good enough"] },
      ],
      work: [
        { step: "Start here", tag: "FOUNDATION", title: "What AI Can Actually Do For Your Job Right Now", outcome: "Identify the 3 tasks in your role AI could halve this week", content: "Most people at this stage have vague awareness that AI could help but no concrete picture of where. This module maps the most common professional tasks to specific AI tools.", takeaways: ["AI use cases mapped to real job functions", "What good AI-assisted work actually looks like", "The 3 highest-ROI places to start based on your role"] },
        { step: "Then this", tag: "ACTION", title: "Your First AI Work Routine: From Zero to Daily User in 7 Days", outcome: "Build an AI habit that makes you measurably faster at work", content: "Habit is the difference between someone who tried AI once and someone who uses it to do in 2 hours what takes colleagues a day.", takeaways: ["Day-by-day integration plan", "How to use AI without your outputs looking AI-generated", "The one workflow to start with based on your job type"] },
        { step: "Then this", tag: "SKILLS", title: "Prompting That Gets Real Work Done", outcome: "Stop getting mediocre AI outputs — get ones you can actually use", content: "The output quality gap between a beginner and an experienced AI user comes down almost entirely to how they write prompts.", takeaways: ["The structured prompt framework used by power users", "10 prompts you can use at work this week", "How to edit AI outputs so they sound like you"] },
      ],
    },
  },
  {
    min: 16, max: 22,
    label: "Operator", emoji: "⚡",
    color: "#D35400", lightColor: "#FEF5E7", accentColor: "#E67E22",
    urgency: "MODERATE RISK",
    tagline: "You've used AI. But you're only seeing the surface.",
    short: "ChatGPT is not an AI strategy. There's a whole world beyond it you haven't touched.",
    emailTeaser: {
      win: "You're using AI — you're already ahead of most people",
      gap1: "Your use is surface-level and inconsistent",
      gap2: "You're leaving significant time and quality on the table",
    },
    badges: { strong: "Familiarity", weak: "Systems", lane: "Tool expansion" },
    personality: {
      title: "The ChatGPT User",
      description: "You use ChatGPT. For emails, maybe some research, the occasional question. You get it — AI is useful. But your use is reactive, not strategic. One tool, one beam of focus — competent but narrow. You know there's more to it, you just haven't built the system yet.",
      looks_like: [
        "ChatGPT is your go-to but you've barely tried anything else",
        "You use it when you remember to — not as part of a real workflow",
        "Your prompts are mostly questions — you haven't discovered frameworks yet",
        "You know AI can do more, you're just not sure what exactly",
      ],
    },
    modules: {
      student: [
        { step: "Start here", tag: "TOOLS", title: "Beyond ChatGPT: The Student AI Stack That Actually Works", outcome: "Replace 2 inefficient study habits with AI-powered ones this week", content: "ChatGPT is one tool in a growing toolkit. This module introduces the tools that genuinely change how students work — Perplexity for research with real citations, Claude for long-form thinking and essays.", takeaways: ["When Claude beats ChatGPT for student work", "Perplexity for research that actually cites sources", "Building a personal AI study stack"] },
        { step: "Then this", tag: "SKILLS", title: "Strategic Prompting for Essays, Research, and Exams", outcome: "Get outputs you can actually use — not just vague summaries", content: "The gap between mediocre and excellent AI outputs is almost always the prompt. This module teaches you frameworks used by top students.", takeaways: ["The structured prompt framework for academic work", "How to use AI for essays without it sounding like AI", "Prompts for exam prep that actually build understanding"] },
        { step: "Then this", tag: "WORKFLOW", title: "Building a Study Workflow That Compounds Over Time", outcome: "Save 5+ hours a week by the end of the semester", content: "Individual AI uses are helpful. A system is transformational. This module shows you how to connect tools into a study workflow.", takeaways: ["The lecture-to-essay AI pipeline", "How to build a personal knowledge base with AI", "Saving and reusing your best prompts across modules"] },
      ],
      work: [
        { step: "Start here", tag: "TOOLS", title: "Beyond ChatGPT: The Professional AI Stack", outcome: "Find at least one tool that changes how you work this week", content: "Most professionals at this level have tried ChatGPT and stopped there. This module introduces the tools that actually change professional output.", takeaways: ["When to use Claude vs ChatGPT at work", "Perplexity for professional research that cites real sources", "Building your personal AI toolkit by job function"] },
        { step: "Then this", tag: "SKILLS", title: "Prompting for Professional Output: From Functional to Excellent", outcome: "Produce work in 30 minutes that used to take 2 hours", content: "The difference between a beginner and a power user is almost entirely prompt quality.", takeaways: ["The 4-part professional prompt framework", "How to get AI outputs that sound like you not a robot", "10 prompts to steal and use at work this week"] },
        { step: "Then this", tag: "WORKFLOW", title: "AI for Your Career: Building a Reputation as Someone Who Works Smarter", outcome: "Become the person your team notices for output quality and speed", content: "There's a right way to use AI professionally. This module shows you how to integrate AI into your work in ways that make you look sharper.", takeaways: ["AI integration by job function — what to automate what to own", "How to verify and edit AI outputs before they leave your desk", "Building a professional AI workflow your reviews will reflect"] },
      ],
    },
  },
  {
    min: 23, max: 28,
    label: "Navigator", emoji: "🌐",
    color: "#1A6B8A", lightColor: "#EBF5FB", accentColor: "#2E86AB",
    urgency: "LOW RISK",
    tagline: "You know more than most. Now it's time to go deeper.",
    short: "You're in the top 25% — but the Architects are pulling away.",
    emailTeaser: {
      win: "You're using AI strategically — clearly ahead of the curve",
      gap1: "You're dabbling in depth but not yet building systems",
      gap2: "The gap between you and the top 10% is still there",
    },
    badges: { strong: "Tool fluency", weak: "Automation", lane: "Agent building" },
    personality: {
      title: "The Multi-Tool Switcher",
      description: "You switch between Claude, Perplexity, DeepSeek, and ChatGPT — intentionally. You understand different models have different strengths. You read AI news. You're dipping into agents. You're not just keeping up — you're starting to lead. But there's a ceiling if you don't go deeper.",
      looks_like: [
        "You use Claude for thinking and ChatGPT for speed — and you know why",
        "DeepSeek caught your attention when everyone else was still on GPT-4",
        "You follow at least one AI newsletter or podcast",
        "You've tried agents or automation but haven't fully built one yet",
        "People come to you when they have AI questions",
      ],
    },
    modules: {
      student: [
        { step: "Start here", tag: "STRATEGY", title: "The AI Landscape: What Students Who Get It Actually Know", outcome: "Develop a mental model of AI that most graduates won't have for years", content: "You already know the tools. This module gives you the map — how US and Chinese AI companies differ and how to choose the right tool for the right academic task.", takeaways: ["US vs Chinese AI philosophy — what it means for which tools you use", "Model selection by task type — a practical decision framework", "How to track AI developments without getting lost in hype"] },
        { step: "Then this", tag: "AGENTS", title: "Your First Agent: Automate a Real Study Task", outcome: "Build one automated workflow that saves you hours this semester", content: "You've read about agents. Now build one. This module walks you through creating a real functional agent for a student use case using no-code tools.", takeaways: ["What makes something an agent vs a chatbot", "No-code agent tools: Make, Zapier, Claude Projects", "Step-by-step: build your first research agent"] },
        { step: "Then this", tag: "ADVANCED", title: "Advanced Prompting: Chaining, Context, and Output Systems", outcome: "Produce research and writing at a level that sets you apart", content: "You're past basics. This module covers prompt chaining for complex academic tasks and building reusable prompt systems.", takeaways: ["Prompt chaining for multi-step academic tasks", "Using long context windows for literature synthesis", "Building a personal prompt system for your discipline"] },
      ],
      work: [
        { step: "Start here", tag: "STRATEGY", title: "The AI Landscape: US vs China and What It Means for Your Work", outcome: "Make smarter tool choices based on what each model was built for", content: "Most professionals think AI is just OpenAI and Google. You already know better. This module goes deeper.", takeaways: ["The real difference between US and Chinese AI philosophy", "Which models are worth your attention right now", "How to choose a model based on what it was built for"] },
        { step: "Then this", tag: "AGENTS", title: "Agents 101: What They Are and How to Build Your First One", outcome: "Create one automated workflow that runs without you this week", content: "You've dipped your toes in — now get your feet wet. This module walks you through building a real agent.", takeaways: ["What makes something an agent vs a chatbot", "No-code agent tools: Make, Zapier, Claude Projects", "Build your first professional research agent step by step"] },
        { step: "Then this", tag: "ADVANCED", title: "Advanced Prompting: Chaining, Context, and Model Routing", outcome: "Reach the top 10% of AI users in your professional context", content: "This module covers the techniques that separate good AI users from great ones.", takeaways: ["Prompt chaining for complex professional tasks", "How to use long context windows for deep research", "Model routing: which task goes to which AI and why"] },
      ],
    },
  },
  {
    min: 29, max: 33,
    label: "Architect", emoji: "🧠",
    color: "#4A235A", lightColor: "#F5EEF8", accentColor: "#7D3C98",
    urgency: "ADVANCED",
    tagline: "You build with AI. Most people just talk about it.",
    short: "You're in the top 10%. The question now is whether you're building the right things.",
    emailTeaser: {
      win: "You're building with AI — genuinely ahead of 90% of people",
      gap1: "Moving from prototype to production is where most builders stall",
      gap2: "Strategy — knowing what to build — is the next gap to close",
    },
    badges: { strong: "Systems thinking", weak: "Scale & strategy", lane: "Production agents" },
    personality: {
      title: "The Builder",
      description: "You don't just use AI — you build with it. You've deployed agents, created tools, and you think in systems. When you see a workflow, you see automation. You're ahead of 90% of people.",
      looks_like: [
        "You've built at least one AI tool that other people actually use",
        "You've deployed an agent that runs without you watching it",
        "You think in pipelines and systems not just prompts",
        "You have strong opinions about which model to use for which task",
        "You've introduced someone to a tool they now can't live without",
      ],
    },
    modules: {
      student: [
        { step: "Start here", tag: "BUILD", title: "Building AI Tools for Your Academic Work and Beyond", outcome: "Ship one AI-powered tool that other students or researchers actually use", content: "You're past using AI — now build with it. This module covers how to design and deploy AI tools for academic contexts.", takeaways: ["Designing AI tools for academic use cases", "From idea to deployed tool in a week", "How to get other students or researchers to actually use it"] },
        { step: "Then this", tag: "STRATEGY", title: "AI Strategy for Student Builders: What to Build and Why", outcome: "Evaluate your AI project ideas with a real framework", content: "Having the ability to build is one thing. Knowing what to build is another.", takeaways: ["The AI opportunity evaluation framework", "Where student builders are creating real value right now", "How to validate an idea before you spend a week building it"] },
        { step: "Then this", tag: "FRONTIER", title: "What's Next: Multimodal AI and the Next Wave of Use Cases", outcome: "Stay 6-12 months ahead of what your peers are discovering", content: "Text was the beginning. Vision, voice, code generation, and real-time agents are the next frontier.", takeaways: ["Multimodal use cases that work today vs what's still hype", "Voice and vision AI in real academic workflows", "Where the next builder opportunities are emerging"] },
      ],
      work: [
        { step: "Start here", tag: "BUILD", title: "Production-Ready AI Agents: From Prototype to Reliable", outcome: "Build agents that don't embarrass you when someone else uses them", content: "Moving from prototype to production is where most builders stall. This module covers reliability, error handling, and human-in-the-loop design.", takeaways: ["Reliability patterns for production AI agents", "When and how to add human-in-the-loop checkpoints", "Monitoring and debugging agents after launch"] },
        { step: "Then this", tag: "STRATEGY", title: "AI Strategy for Builders: What to Build and Why It Matters", outcome: "Stop building things that don't create real value", content: "Building ability is one thing. Knowing what to build is another.", takeaways: ["The AI opportunity evaluation framework", "Where builders are creating real value in professional settings", "How to validate a tool idea before building it"] },
        { step: "Then this", tag: "FRONTIER", title: "Multimodal AI and the Next Wave of Professional Use Cases", outcome: "Identify and build the next high-value AI opportunity in your field", content: "Text was just the beginning. This module maps the multimodal landscape.", takeaways: ["Multimodal use cases that work today vs hype", "Voice and vision AI in real professional workflows", "Where the next builder opportunities are opening up"] },
      ],
    },
  },
  {
    min: 34, max: 40,
    label: "Vanguard", emoji: "🚀",
    color: "#0E6655", lightColor: "#E8F8F5", accentColor: "#1ABC9C",
    urgency: "PROTECTED",
    tagline: "AI isn't your threat. It's your weapon.",
    short: "You're the person others are trying to catch. Don't slow down.",
    emailTeaser: {
      win: "You're genuinely at the frontier — the person others want to learn from",
      gap1: "The risk for you isn't falling behind — it's coasting",
      gap2: "The Vanguard stays ahead by going deeper not by maintaining",
    },
    badges: { strong: "Leadership", weak: "Scale & influence", lane: "AI ventures" },
    personality: {
      title: "The Leader",
      description: "You're not keeping up with AI — you're setting the pace. You build tools, deploy agents, and you understand the landscape at a level most people won't reach for years. People already come to you. The risk isn't falling behind — it's coasting on a lead that others are closing.",
      looks_like: [
        "People come to you when they want to know what's actually happening in AI",
        "You've built things with AI that genuinely changed how people work or study",
        "You have strong nuanced opinions on model capabilities and tradeoffs",
        "You read primary sources — papers, changelogs, founder interviews",
        "You're already thinking about what comes next not just what exists now",
      ],
    },
    modules: {
      student: [
        { step: "Start here", tag: "LEADERSHIP", title: "AI Leadership in Academic Contexts: Influence Not Just Skill", outcome: "Become the person who shapes how your department or cohort uses AI", content: "Being great at AI is one thing. Being able to bring others along is what separates individual contributors from people who change institutions.", takeaways: ["How to communicate AI strategy to non-technical academics", "Building AI literacy in your cohort or department", "Your role in shaping responsible AI use in education"] },
        { step: "Then this", tag: "FRONTIER", title: "Tracking the Frontier: How to Stay Ahead When Everything Moves Fast", outcome: "Build a system for staying 6-12 months ahead of the mainstream", content: "You're already ahead. This module is about staying there.", takeaways: ["How to read AI research papers in 20 minutes", "Tracking model capability curves — what to watch", "Spotting the next capability jump before it's obvious"] },
        { step: "Then this", tag: "BUILD", title: "Building AI Ventures from Academic Research", outcome: "Turn your academic AI work into something with real-world impact", content: "If you're at Vanguard level as a student you probably have ideas that could become real products.", takeaways: ["Where real moats exist in AI products built from research", "Why most AI wrappers fail — and what works instead", "From academic insight to durable AI product"] },
      ],
      work: [
        { step: "Start here", tag: "LEADERSHIP", title: "AI Leadership: Shaping Strategy Not Just Executing It", outcome: "Move from the best AI user in the room to the person who shapes AI strategy", content: "Being great at AI is one thing. Leading others through it is what separates individual contributors from people who change organisations.", takeaways: ["How to communicate AI strategy to non-technical stakeholders", "Building AI literacy in the people around you", "Your role in AI adoption governance and decision-making"] },
        { step: "Then this", tag: "FRONTIER", title: "Frontier Models and What's Coming: How to Stay Ahead", outcome: "Build a system to stay 6-12 months ahead of what everyone else discovers", content: "You're already ahead. This module is about staying there.", takeaways: ["How to read AI research papers efficiently", "Tracking model capability curves — what to actually watch", "Spotting the next capability jump before it's mainstream"] },
        { step: "Then this", tag: "VENTURE", title: "Building AI Ventures: From Tool to Durable Business", outcome: "Evaluate your AI product ideas with a framework that actually predicts success", content: "At Vanguard level you probably have product ideas. This module covers the unique dynamics of building AI-native businesses.", takeaways: ["Where real moats exist in AI products", "Why most AI wrappers fail — and what doesn't", "The AI venture framework: from idea to durable product"] },
      ],
    },
  },
];

function getTier(score) {
  return TIERS.find((t) => score >= t.min && score <= t.max) || TIERS[0];
}
function getModules(tier, audience) {
  return tier.modules[audience === "student" ? "student" : "work"] || tier.modules.work;
}

const SYSTEM_PROMPT = `You are a sharp, direct AI capability advisor. Write a personalised AI report. Be specific, honest, useful. Balance urgency with agency.

Format EXACTLY as JSON:
{
  "headline": "one punchy sentence max 12 words",
  "summary": "2-3 sentences. Direct. Reference their answer patterns.",
  "in_practice": ["how their tier shows up in daily life 1", "example 2", "example 3"],
  "next_level": "one sentence: what someone one tier above can do that they currently can't",
  "threats": ["specific gap 1", "specific gap 2"],
  "advantages": ["genuine strength 1", "genuine strength 2"],
  "fastest_win": "one specific thing they can do this week for biggest improvement",
  "actions": [
    {"day": "Day 1", "action": "very specific action"},
    {"day": "Day 3", "action": "very specific action"},
    {"day": "Day 7", "action": "action that compounds progress"}
  ],
  "verdict": "one final sentence — act vs don't act"
}
Respond ONLY with valid JSON. No markdown, no backticks.`;

export default function WhatsmyAIQ() {
  const [screen, setScreen] = useState("landing");
  const [audience, setAudience] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [openModule, setOpenModule] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const totalScore = answers.reduce((s, a) => s + a, 0);
  const tier = getTier(totalScore);
  const maxScore = QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map(o => o.points)), 0);
  const pct = Math.round(((totalScore - 8) / (maxScore - 8)) * 100);
  const modules = audience ? getModules(tier, audience) : [];
  const audienceLabel = audience === "student" ? "student" : audience === "both" ? "student and professional" : "professional";
  const tierImage = TIER_IMAGES[tier.label];

  useEffect(() => {
    if (screen === "email") setTimeout(() => setBarWidth(Math.max(pct, 5)), 400);
  }, [screen]);

  useEffect(() => {
    const i = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  function selectAudience(id) { setAudience(id); setScreen("quiz"); }
  function selectOption(pts) { setSelected(pts); }

  function next() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= QUESTIONS.length) { setScreen("email"); }
    else {
      setAnimIn(false);
      setTimeout(() => { setCurrent(current + 1); setAnimIn(true); }, 200);
    }
  }

  function submitEmail() {
    if (!email || !email.includes("@")) { setEmailError("Enter a valid email to get your snapshot."); return; }
    setEmailError("");
    setEmailSubmitted(true);
  }

  async function unlockReport() {
    setReportLoading(true);
    setScreen("report");
    const answerSummary = answers.map((pts, i) => {
      const q = QUESTIONS[i];
      const opt = q.options.find((o) => o.points === pts);
      return `Q${i + 1}: "${q.question}" → "${opt?.text}" (${pts} pts)`;
    }).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Context: ${audienceLabel}\nScore: ${totalScore}/${maxScore} — Tier: ${tier.label} (${tier.personality.title})\n\nAnswers:\n${answerSummary}` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      setReport(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setReport({
        headline: "You're at the threshold. The next move matters.",
        summary: `As a ${tier.personality.title}, you're more aware than most — but the gap between awareness and systematic use is where you're losing the most time right now.`,
        in_practice: ["You start tasks manually that AI could set up in 2 minutes", "Your AI outputs are functional but not as sharp as they could be", "You know AI could help more — you just haven't built the system yet"],
        next_level: "Someone one tier above you has AI embedded into their daily workflow — it's not an extra step, it's how they work.",
        threats: ["Inconsistent use means inconsistent results", "The habit gap compounds — the longer you wait the bigger it grows"],
        advantages: ["You're self-aware enough to diagnose the problem", "You're at the stage where a small push creates disproportionate results"],
        fastest_win: "Open Module 1 below and implement one thing from it before you close this tab.",
        actions: [
          { day: "Day 1", action: "Complete Module 1 and implement one thing from it today" },
          { day: "Day 3", action: "Replace one tool you currently use with an AI-powered alternative" },
          { day: "Day 7", action: "Teach one thing you learned to someone else — it compounds your own understanding" },
        ],
        verdict: "Act on the modules below this week and you'll outpace 80% of your peers. Ignore them and this was just entertainment.",
      });
    }
    setReportLoading(false);
  }

  function reset() {
    setScreen("landing"); setCurrent(0); setAnswers([]);
    setSelected(null); setReport(null); setBarWidth(0);
    setAudience(null); setEmail(""); setEmailSubmitted(false);
    setEmailError(""); setOpenModule(null);
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }
    @keyframes scanline { 0%{top:-2px;}100%{top:100%;} }
    @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0;} }
    @keyframes ticker { 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }
    @keyframes loadbar { 0%{width:0%;}100%{width:100%;} }
    @keyframes glitch1 { 0%{clip-path:inset(0 0 96% 0);transform:translate(-3px);}25%{clip-path:inset(45% 0 48% 0);transform:translate(3px);}50%{clip-path:inset(75% 0 15% 0);transform:translate(-2px);}75%{clip-path:inset(25% 0 65% 0);transform:translate(2px);}100%{clip-path:inset(0 0 96% 0);transform:translate(0);} }
    @keyframes expandDown { from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);} }
    @keyframes avatarIn { from{opacity:0;transform:scale(0.9) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);} }
    @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }

    .fu1{animation:fadeUp .4s ease forwards;}
    .fu2{animation:fadeUp .4s .07s ease forwards;opacity:0;}
    .fu3{animation:fadeUp .4s .14s ease forwards;opacity:0;}
    .fu4{animation:fadeUp .4s .21s ease forwards;opacity:0;}
    .fu5{animation:fadeUp .4s .28s ease forwards;opacity:0;}
    .fu6{animation:fadeUp .4s .35s ease forwards;opacity:0;}

    .dark-screen{background:#060608;color:#E8E8F0;min-height:100vh;}
    .light-screen{background:#FAFAF7;color:#1A1A1A;min-height:100vh;}

    .audience-btn{display:flex;align-items:center;gap:14px;width:100%;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:16px 18px;cursor:pointer;transition:all .15s;text-align:left;font-family:'DM Sans',sans-serif;margin-bottom:10px;color:#E8E8F0;}
    .audience-btn:hover{background:rgba(255,255,255,.055);border-color:rgba(255,68,68,.35);transform:translateX(4px);}

    .opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:14px 17px;margin-bottom:8px;color:rgba(215,215,230,.62);font-size:.91rem;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;line-height:1.4;}
    .opt:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.14);color:#fff;transform:translateX(3px);}
    .opt.sel{background:rgba(255,68,68,.09);border-color:rgba(255,68,68,.42);color:#FF5555;}

    .next-dark{width:100%;padding:14px;border-radius:8px;border:none;font-weight:800;font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;letter-spacing:.06em;text-transform:uppercase;margin-top:5px;cursor:pointer;transition:all .15s;}
    .next-dark.on{background:#FF4444;color:#fff;}
    .next-dark.on:hover{background:#ff2020;transform:translateY(-1px);}
    .next-dark.off{background:rgba(255,255,255,.04);color:rgba(255,255,255,.16);cursor:not-allowed;}

    .cta-dark{background:#FF4444;color:#fff;border:none;border-radius:8px;padding:16px 40px;font-size:1.05rem;font-weight:800;cursor:pointer;font-family:'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:all .15s;}
    .cta-dark:hover{background:#ff2020;transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,68,68,.35);}

    .cta-light{color:#fff;border:none;border-radius:10px;padding:16px 40px;font-size:1.05rem;font-weight:800;cursor:pointer;font-family:'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:all .15s;}
    .cta-light:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.2);}

    .email-input{width:100%;background:#fff;border:1.5px solid #E0E0E0;border-radius:10px;padding:14px 16px;color:#1A1A1A;font-size:1rem;font-family:'DM Sans',sans-serif;outline:none;transition:border .15s;margin-bottom:10px;}
    .email-input::placeholder{color:#BDBDBD;}
    .email-input:focus{border-color:#999;}

    .ticker-wrap{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(255,68,68,.16);border-bottom:1px solid rgba(255,68,68,.16);padding:8px 0;margin:24px 0;}
    .ticker-inner{display:inline-block;animation:ticker 24s linear infinite;}
    .t-item{display:inline-block;padding:0 26px;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,68,68,.6);font-family:'DM Sans',sans-serif;}

    .scanline{position:fixed;left:0;right:0;height:100px;background:linear-gradient(transparent,rgba(255,68,68,.03),transparent);animation:scanline 10s linear infinite;pointer-events:none;z-index:999;}
    .glitch{position:relative;}
    .glitch::after{content:attr(data-text);position:absolute;top:0;left:0;color:#FF4444;opacity:0;pointer-events:none;}
    .glitch.active::after{opacity:.55;animation:glitch1 .15s steps(1) forwards;}

    .tier-avatar{animation:avatarIn .7s cubic-bezier(0.175,0.885,0.32,1.275) forwards;width:100%;border-radius:16px;object-fit:cover;display:block;}
    .tier-avatar-float{animation:avatarIn .7s cubic-bezier(0.175,0.885,0.32,1.275) forwards, float 4s 0.7s ease-in-out infinite;}

    .lcard{background:#fff;border:1px solid #EBEBEB;border-radius:14px;padding:22px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
    .lslabel{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;font-family:'DM Sans',sans-serif;font-weight:700;}
    .lpill-r{display:inline-block;border-radius:6px;padding:5px 12px;font-size:.82rem;margin:3px;font-family:'DM Sans',sans-serif;font-weight:500;}
    .lpill-g{display:inline-block;border-radius:6px;padding:5px 12px;font-size:.82rem;margin:3px;font-family:'DM Sans',sans-serif;font-weight:500;}

    .sbox{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:16px;text-align:center;}
    .lb{height:3px;background:#E8E8E8;border-radius:2px;overflow:hidden;margin:18px 0;}
    .lb-inner{height:100%;animation:loadbar 2.5s ease forwards;}

    .module-btn{width:100%;text-align:left;background:#FAFAF7;border:1.5px solid #E8E8E8;border-radius:10px;padding:15px 17px;cursor:pointer;transition:all .15s;display:flex;justify-content:space-between;align-items:flex-start;font-family:'DM Sans',sans-serif;margin-bottom:0;}
    .module-btn:hover{background:#F5F5F0;border-color:#D0D0D0;}
    .module-btn.open{background:#F5F5F0;border-color:#C0C0C0;border-radius:10px 10px 0 0;}
    .module-body{animation:expandDown .25s ease forwards;padding:16px 17px 18px;background:#fff;border:1.5px solid #E8E8E8;border-top:none;border-radius:0 0 10px 10px;margin-bottom:12px;}
    .module-wrap{margin-bottom:12px;}

    .gap-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #F0F0F0;font-size:.87rem;color:#555;line-height:1.4;}
    .gap-item:last-child{border-bottom:none;}
    .step-badge{display:inline-block;border-radius:4px;padding:2px 8px;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-right:8px;}

    .badge-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;}
    .badge-card{border-radius:10px;padding:14px;text-align:center;}
    .badge-label{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:4px;}
    .badge-value{font-size:.9rem;font-weight:700;color:#1A1A1A;}
  `;

  const tickers = ["AI replaced 300M jobs globally","85% of companies accelerating AI adoption","AI-literate workers earn 25% more","The gap widens every week","Are you on the right side of this?"];

  return (
    <>
      <style>{css}</style>

      {screen === "landing" && (
        <div className="dark-screen">
          <div className="scanline"/>
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em"}}>WHAT'S MY <span style={{color:"#FF4444"}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"rgba(255,255,255,.22)",letterSpacing:".08em",textTransform:"uppercase"}}>whatsmyaiq.online</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>
            <div className="fu1" style={{display:"inline-flex",alignItems:"center",gap:"7px",background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.24)",borderRadius:"4px",padding:"5px 12px",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase",color:"#FF4444",marginBottom:"24px"}}>
              <span style={{width:"5px",height:"5px",background:"#FF4444",borderRadius:"50%",display:"inline-block",animation:"blink 1s step-end infinite"}}/>AI Job Displacement: Active
            </div>
            <h1 className={`fu2 glitch${glitchActive?" active":""}`} data-text="AI IS REPLACING PEOPLE." style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(2.4rem,8vw,4.4rem)",lineHeight:1.0,color:"#fff",marginBottom:"16px",textTransform:"uppercase",letterSpacing:".02em"}}>
              AI IS REPLACING<br/><span style={{color:"#FF4444"}}>PEOPLE.</span>
            </h1>
            <p className="fu3" style={{fontSize:"1rem",color:"rgba(232,232,240,.52)",lineHeight:1.65,marginBottom:"10px"}}>Your classmates and colleagues are using AI to do in 2 hours what takes you a day. The question isn't whether AI affects your future.</p>
            <p className="fu3" style={{fontSize:"1.05rem",color:"#fff",fontWeight:600,lineHeight:1.5,marginBottom:"24px"}}>It's whether <span style={{color:"#FF4444"}}>you're on the right side of it.</span></p>
            <div className="ticker-wrap fu4">
              <div className="ticker-inner">{[...tickers,...tickers].map((t,i)=><span key={i} className="t-item">{t} <span style={{color:"rgba(255,68,68,.3)"}}>◆</span></span>)}</div>
            </div>
            <div className="fu4" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"9px",marginBottom:"28px"}}>
              {[{num:"8",label:"Questions"},{num:"2 MIN",label:"To complete"},{num:"FREE",label:"To start"}].map(s=>(
                <div key={s.label} className="sbox">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.45rem",fontWeight:900,color:"#fff"}}>{s.num}</div>
                  <div style={{fontSize:".7rem",color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".07em",marginTop:"2px"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="fu5" style={{display:"flex",flexDirection:"column",alignItems:"stretch",gap:"9px"}}>
              <button className="cta-dark" style={{width:"100%"}} onClick={()=>setScreen("audience")}>Find Out If You're AI-Proof →</button>
              <p style={{textAlign:"center",fontSize:".74rem",color:"rgba(255,255,255,.2)"}}>Takes 2 minutes · Free · No signup required</p>
            </div>
          </div>
        </div>
      )}

      {screen === "audience" && (
        <div className="dark-screen">
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#E8E8F0"}}>WHAT'S MY <span style={{color:"#FF4444"}}>AIQ</span></div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>
            <div className="fu1" style={{marginBottom:"28px"}}>
              <p style={{fontSize:".72rem",letterSpacing:".12em",textTransform:"uppercase",color:"#FF4444",marginBottom:"10px",fontWeight:600}}>Before we begin</p>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"clamp(1.6rem,5vw,2.2rem)",color:"#fff",textTransform:"uppercase",lineHeight:1.1}}>Where do you already use AI?</h2>
              <p style={{fontSize:".88rem",color:"rgba(255,255,255,.35)",marginTop:"8px"}}>Your modules and action plan will be built around your answer.</p>
            </div>
            {AUDIENCES.map((a,i)=>(
              <button key={a.id} className="audience-btn" style={{animationDelay:`${i*.06}s`}} onClick={()=>selectAudience(a.id)}>
                <span style={{fontSize:"1.6rem"}}>{a.emoji}</span>
                <div><div style={{fontWeight:700,color:"#fff",fontSize:"1rem"}}>{a.label}</div><div style={{fontSize:".83rem",color:"rgba(255,255,255,.35)",marginTop:"2px"}}>{a.sub}</div></div>
                <span style={{marginLeft:"auto",color:"rgba(255,255,255,.2)",fontSize:"1rem"}}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === "quiz" && (
        <div className="dark-screen">
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#E8E8F0"}}>WHAT'S MY <span style={{color:"#FF4444"}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"rgba(255,68,68,.5)",letterSpacing:".08em",textTransform:"uppercase"}}>AI-Proof Test</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"28px 20px 60px",transition:"opacity .2s,transform .2s",opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(10px)"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"5px"}}>
              {QUESTIONS.map((_,i)=><div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<current?"#FF4444":i===current?"rgba(255,68,68,.38)":"rgba(255,255,255,.06)",transition:"background .3s"}}/>)}
            </div>
            <p style={{fontSize:".7rem",color:"rgba(255,255,255,.26)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"28px"}}>Question {current+1} of {QUESTIONS.length}</p>
            <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"clamp(1.25rem,3.5vw,1.65rem)",lineHeight:1.2,color:"#fff",marginBottom:"20px",textTransform:"uppercase",letterSpacing:".02em"}}>{QUESTIONS[current].question}</h2>
            {QUESTIONS[current].options.map(opt=>(
              <button key={opt.points} className={`opt${selected===opt.points?" sel":""}`} onClick={()=>selectOption(opt.points)}>{opt.text}</button>
            ))}
            <button className={`next-dark${selected!==null?" on":" off"}`} onClick={next}>{current+1===QUESTIONS.length?"See My Results →":"Next →"}</button>
          </div>
        </div>
      )}

      {screen === "email" && (
        <div className="light-screen">
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #EBEBEB",background:"#fff"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#1A1A1A"}}>WHAT'S MY <span style={{color:tier.accentColor}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"#BDBDBD",letterSpacing:".08em",textTransform:"uppercase"}}>whatsmyaiq.online</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>

            {/* Hero image */}
            <div className="fu1" style={{marginBottom:"24px",borderRadius:"16px",overflow:"hidden",maxHeight:"380px"}}>
              <img src={tierImage} alt={tier.personality.title} className="tier-avatar-float" style={{width:"100%",maxHeight:"380px",objectFit:"cover",objectPosition:"top",borderRadius:"16px"}}/>
            </div>

            <div className="fu1" style={{display:"inline-block",background:tier.lightColor,border:`1.5px solid ${tier.accentColor}40`,borderRadius:"6px",padding:"4px 13px",fontSize:".68rem",letterSpacing:".13em",textTransform:"uppercase",color:tier.color,marginBottom:"12px",fontWeight:700}}>{tier.urgency}</div>

            <h2 className="fu2" style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(2rem,6vw,3rem)",color:tier.color,textTransform:"uppercase",letterSpacing:".02em",lineHeight:1,marginBottom:"4px"}}>
              You're {tier.label==="At Risk"?"At Risk":`a${["A","E","I","O","U"].includes(tier.label[0])?"n":""} ${tier.label}`}.
            </h2>
            <p className="fu2" style={{fontSize:".82rem",color:"#888",marginBottom:"20px",fontStyle:"italic"}}>{tier.personality.title} · {audienceLabel}</p>

            <div className="fu3" style={{background:"#EBEBEB",borderRadius:"4px",height:"6px",marginBottom:"8px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${barWidth}%`,background:tier.accentColor,borderRadius:"4px",transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
            <p className="fu3" style={{fontSize:".75rem",color:"#BDBDBD",marginBottom:"24px",textAlign:"right"}}>Score: {totalScore}/{maxScore}</p>

            <div className="fu3 badge-row">
              <div className="badge-card" style={{background:tier.lightColor,border:`1.5px solid ${tier.accentColor}30`}}>
                <div className="badge-label" style={{color:tier.color}}>Strongest at</div>
                <div className="badge-value">{tier.badges.strong}</div>
              </div>
              <div className="badge-card" style={{background:"#FEF5F5",border:"1.5px solid #FFCCCC"}}>
                <div className="badge-label" style={{color:"#C0392B"}}>Weakest at</div>
                <div className="badge-value">{tier.badges.weak}</div>
              </div>
              <div className="badge-card" style={{background:"#F5F5F0",border:"1.5px solid #E0E0D8"}}>
                <div className="badge-label" style={{color:"#666"}}>Best next lane</div>
                <div className="badge-value">{tier.badges.lane}</div>
              </div>
            </div>

            <div className="fu3" style={{background:"#fff",border:"1.5px solid #EBEBEB",borderRadius:"14px",padding:"18px 20px",marginBottom:"20px",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
              <p style={{fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase",color:"#BDBDBD",marginBottom:"12px",fontWeight:600}}>What your answers revealed:</p>
              {[{icon:"✓",color:"#27AE60",text:tier.emailTeaser.win},{icon:"✗",color:"#E74C3C",text:tier.emailTeaser.gap1},{icon:"✗",color:"#E74C3C",text:tier.emailTeaser.gap2}].map((item,i,arr)=>(
                <div key={item.text} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"9px 0",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
                  <span style={{color:item.color,fontWeight:700,fontSize:"1rem",flexShrink:0}}>{item.icon}</span>
                  <span style={{fontSize:".9rem",color:"#444",lineHeight:1.4}}>{item.text}</span>
                </div>
              ))}
              <div style={{marginTop:"14px",paddingTop:"14px",borderTop:"1px solid #F5F5F5"}}>
                <p style={{fontSize:".82rem",color:"#888",lineHeight:1.5}}>Your full gap analysis, learning path, and 7-day action plan are in your report. <span style={{color:"#1A1A1A",fontWeight:600}}>Get your free snapshot first.</span></p>
              </div>
            </div>

            {!emailSubmitted ? (
              <div className="fu4">
                <p style={{fontSize:".82rem",color:"#666",marginBottom:"10px"}}>Where should we send your free AIQ snapshot?</p>
                <input className="email-input" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitEmail()}/>
                {emailError&&<p style={{fontSize:".78rem",color:"#E74C3C",marginBottom:"8px"}}>{emailError}</p>}
                <button className="cta-light" style={{width:"100%",background:tier.accentColor}} onClick={submitEmail}>Send My Free Snapshot →</button>
                <p style={{textAlign:"center",fontSize:".72rem",color:"#BDBDBD",marginTop:"8px"}}>No spam. One snapshot email. Unsubscribe anytime.</p>
              </div>
            ) : (
              <div className="fu4">
                <div style={{background:"#F0FFF6",border:"1.5px solid #A8E6C4",borderRadius:"14px",padding:"16px 20px",marginBottom:"16px"}}>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.05rem",color:"#27AE60",marginBottom:"4px",textTransform:"uppercase",letterSpacing:".03em"}}>✓ Snapshot on its way to {email}</p>
                  <p style={{fontSize:".83rem",color:"#555",lineHeight:1.5}}>Check your inbox in a few minutes. Ready to see the full picture now?</p>
                </div>
                <div style={{background:"#fff",border:"1.5px solid #EBEBEB",borderRadius:"14px",padding:"20px",marginBottom:"14px",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                  <p style={{fontSize:".7rem",letterSpacing:".1em",textTransform:"uppercase",color:"#BDBDBD",marginBottom:"10px",fontWeight:600}}>Your full report includes:</p>
                  {[`Your ${tier.personality.title} profile — what it means for your ${audienceLabel} context`,"Your exact capability gaps with specific examples","What someone one tier above you can do that you currently can't","Your fastest win this week","3 learning modules sequenced for your level and path","A 7-day action plan built for you"].map(item=>(
                    <div key={item} style={{display:"flex",alignItems:"flex-start",gap:"8px",padding:"6px 0",borderBottom:"1px solid #F5F5F5",fontSize:".83rem",color:"#555"}}>
                      <span style={{color:tier.accentColor,fontWeight:700,flexShrink:0}}>→</span>{item}
                    </div>
                  ))}
                  <div style={{marginTop:"16px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"#1A1A1A"}}>$24.99</div>
                    <div style={{fontSize:".72rem",color:"#BDBDBD",marginBottom:"12px"}}>One-time · Instant access · No subscription</div>
                    <button className="cta-light" style={{width:"100%",background:tier.accentColor}} onClick={() => window.open('https://buy.stripe.com/cNi8wQ7Vx5WD4V52Yh8g000', '_blank')}>Unlock My Full Report →</button>
                  </div>
                </div>
                <p style={{textAlign:"center",fontSize:".7rem",color:"#BDBDBD"}}>🔒 Secure · Instant delivery · 7-day guarantee</p>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "report" && (
        <div className="light-screen">
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #EBEBEB",background:"#fff"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#1A1A1A"}}>WHAT'S MY <span style={{color:tier.accentColor}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"#BDBDBD",letterSpacing:".08em",textTransform:"uppercase"}}>whatsmyaiq.online</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>
            {reportLoading ? (
              <div style={{textAlign:"center",paddingTop:"60px"}}>
                <img src={tierImage} alt={tier.personality.title} style={{width:"120px",height:"120px",objectFit:"cover",objectPosition:"top",borderRadius:"12px",margin:"0 auto 20px",display:"block"}}/>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.35rem",fontWeight:800,color:"#1A1A1A",textTransform:"uppercase",letterSpacing:".05em",marginBottom:"7px"}}>Building Your Report</div>
                <p style={{fontSize:".8rem",color:"#888",marginBottom:"4px"}}>Generating your personalised AI-Proof report...</p>
                <div className="lb"><div className="lb-inner" style={{background:tier.accentColor}}/></div>
                <p style={{fontSize:".7rem",color:"#BDBDBD",letterSpacing:".08em",textTransform:"uppercase"}}>Analysing {QUESTIONS.length} answers · {audienceLabel} context</p>
              </div>
            ) : report ? (
              <>
                <div style={{display:"flex",alignItems:"flex-start",gap:"20px",marginBottom:"24px"}}>
                  <img src={tierImage} alt={tier.personality.title} className="tier-avatar" style={{width:"110px",height:"130px",objectFit:"cover",objectPosition:"top",borderRadius:"12px",flexShrink:0}}/>
                  <div>
                    <div style={{display:"inline-block",background:tier.lightColor,border:`1.5px solid ${tier.accentColor}40`,borderRadius:"6px",padding:"3px 10px",fontSize:".65rem",letterSpacing:".12em",textTransform:"uppercase",color:tier.color,marginBottom:"8px",fontWeight:700}}>{tier.urgency} · {tier.label}</div>
                    <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(1.3rem,4vw,1.8rem)",color:"#1A1A1A",textTransform:"uppercase",lineHeight:1.1}}>{report.headline}</h2>
                    <p style={{fontSize:".78rem",color:"#888",marginTop:"4px",fontStyle:"italic"}}>{tier.personality.title} · {audienceLabel}</p>
                  </div>
                </div>

                <div className="badge-row" style={{marginBottom:"16px"}}>
                  <div className="badge-card" style={{background:tier.lightColor,border:`1.5px solid ${tier.accentColor}30`}}>
                    <div className="badge-label" style={{color:tier.color}}>Strongest at</div>
                    <div className="badge-value">{tier.badges.strong}</div>
                  </div>
                  <div className="badge-card" style={{background:"#FEF5F5",border:"1.5px solid #FFCCCC"}}>
                    <div className="badge-label" style={{color:"#C0392B"}}>Weakest at</div>
                    <div className="badge-value">{tier.badges.weak}</div>
                  </div>
                  <div className="badge-card" style={{background:"#F5F5F0",border:"1.5px solid #E0E0D8"}}>
                    <div className="badge-label" style={{color:"#666"}}>Best next lane</div>
                    <div className="badge-value">{tier.badges.lane}</div>
                  </div>
                </div>

                <div className="lcard">
                  <p className="lslabel" style={{color:tier.color}}>📊 Your Situation</p>
                  <p style={{fontSize:".91rem",color:"#444",lineHeight:1.65}}>{report.summary}</p>
                </div>

                <div className="lcard">
                  <p className="lslabel" style={{color:tier.color}}>🪞 Your AI Profile: {tier.personality.title}</p>
                  <p style={{fontSize:".87rem",color:"#555",lineHeight:1.6,marginBottom:"12px"}}>{tier.personality.description}</p>
                  <p style={{fontSize:".65rem",letterSpacing:".1em",textTransform:"uppercase",color:"#BDBDBD",marginBottom:"8px",fontWeight:600}}>In practice, this looks like:</p>
                  {report.in_practice?.map(item=>(
                    <div key={item} className="gap-item">
                      <span style={{color:tier.accentColor,flexShrink:0,marginTop:"1px"}}>◆</span>{item}
                    </div>
                  ))}
                  {report.next_level&&(
                    <div style={{marginTop:"12px",paddingTop:"12px",borderTop:"1px solid #F5F5F5"}}>
                      <p style={{fontSize:".65rem",letterSpacing:".1em",textTransform:"uppercase",color:"#BDBDBD",marginBottom:"6px",fontWeight:600}}>One tier above you:</p>
                      <p style={{fontSize:".87rem",color:"#666",lineHeight:1.5,fontStyle:"italic"}}>{report.next_level}</p>
                    </div>
                  )}
                </div>

                <div className="lcard">
                  <p className="lslabel" style={{color:"#C0392B"}}>🚨 Your Gaps Right Now</p>
                  {report.threats?.map(t=><span key={t} className="lpill-r" style={{background:"#FEF5F5",color:"#C0392B",border:"1px solid #FFCCCC"}}>{t}</span>)}
                </div>

                <div className="lcard">
                  <p className="lslabel" style={{color:"#27AE60"}}>✅ What You Have Going For You</p>
                  {report.advantages?.map(a=><span key={a} className="lpill-g" style={{background:"#F0FFF6",color:"#27AE60",border:"1px solid #A8E6C4"}}>{a}</span>)}
                </div>

                {report.fastest_win&&(
                  <div style={{background:tier.lightColor,border:`1.5px solid ${tier.accentColor}30`,borderRadius:"14px",padding:"16px 18px",marginBottom:"14px"}}>
                    <p style={{fontSize:".65rem",letterSpacing:".12em",textTransform:"uppercase",color:tier.color,marginBottom:"7px",fontWeight:700}}>⚡ Your Fastest Win This Week</p>
                    <p style={{fontSize:".9rem",color:"#1A1A1A",lineHeight:1.5,fontWeight:500}}>{report.fastest_win}</p>
                  </div>
                )}

                <div className="lcard">
                  <p className="lslabel" style={{color:tier.color}}>📅 Your 7-Day Action Plan</p>
                  {report.actions?.map(a=>(
                    <div key={a.day} style={{display:"flex",gap:"13px",alignItems:"flex-start",marginBottom:"12px"}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:".82rem",color:tier.accentColor,minWidth:"48px",paddingTop:"1px",textTransform:"uppercase",letterSpacing:".04em"}}>{a.day}</span>
                      <span style={{fontSize:".87rem",color:"#444",lineHeight:1.5}}>{a.action}</span>
                    </div>
                  ))}
                </div>

                <div className="lcard" style={{background:"#FAFAF7"}}>
                  <p className="lslabel" style={{color:tier.color}}>📚 Your Learning Path</p>
                  <p style={{fontSize:".8rem",color:"#888",marginBottom:"14px",lineHeight:1.5}}>3 modules sequenced for your level. Follow them in order — each builds on the last.</p>
                  {modules.map((mod,idx)=>(
                    <div key={mod.title} className="module-wrap">
                      <button className={`module-btn${openModule===idx?" open":""}`} onClick={()=>setOpenModule(openModule===idx?null:idx)}>
                        <div style={{flex:1}}>
                          <div style={{marginBottom:"5px"}}>
                            <span className="step-badge" style={{background:tier.lightColor,color:tier.color,border:`1px solid ${tier.accentColor}30`}}>{mod.step}</span>
                            <span style={{fontSize:".62rem",letterSpacing:".1em",textTransform:"uppercase",color:tier.accentColor,fontWeight:700}}>{mod.tag}</span>
                          </div>
                          <div style={{fontSize:".88rem",color:"#1A1A1A",fontWeight:600,lineHeight:1.3}}>{mod.title}</div>
                          <div style={{fontSize:".76rem",color:"#888",marginTop:"4px"}}>🎯 {mod.outcome}</div>
                        </div>
                        <div style={{color:"#BDBDBD",fontSize:"1rem",marginLeft:"12px",flexShrink:0,marginTop:"2px"}}>{openModule===idx?"↑":"↓"}</div>
                      </button>
                      {openModule===idx&&(
                        <div className="module-body">
                          <p style={{fontSize:".86rem",color:"#555",lineHeight:1.65,marginBottom:"12px"}}>{mod.content}</p>
                          <p style={{fontSize:".65rem",letterSpacing:".1em",textTransform:"uppercase",color:"#BDBDBD",marginBottom:"7px",fontWeight:600}}>Key Takeaways</p>
                          {mod.takeaways.map(t=>(
                            <div key={t} style={{display:"flex",alignItems:"flex-start",gap:"8px",padding:"5px 0",fontSize:".82rem",color:"#555",lineHeight:1.4}}>
                              <span style={{color:tier.accentColor,flexShrink:0,marginTop:"1px"}}>→</span>{t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{background:tier.lightColor,border:`1.5px solid ${tier.accentColor}30`,borderRadius:"14px",padding:"20px",marginBottom:"16px",textAlign:"center"}}>
                  <p style={{fontSize:".65rem",letterSpacing:".12em",textTransform:"uppercase",color:tier.color,marginBottom:"8px",fontWeight:700}}>Your Verdict</p>
                  <p style={{fontSize:".97rem",color:"#1A1A1A",lineHeight:1.6,fontStyle:"italic",fontWeight:500}}>"{report.verdict}"</p>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
                  <button className="cta-light" style={{width:"100%",background:tier.accentColor}} onClick={reset}>Share With a Friend →</button>
                  <p style={{textAlign:"center",fontSize:".72rem",color:"#BDBDBD"}}>whatsmyaiq.online</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}