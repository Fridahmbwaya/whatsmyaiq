"use client";
import { useState, useEffect } from "react";
import { QUESTIONS, calculateDimensions, PERSONA_PROFILES } from "./lib/assessment";

const AUDIENCES = [
  { id: "student", emoji: "📚", label: "Student", sub: "School, university, coursework, or studying" },
  { id: "work", emoji: "💼", label: "Employee / Professional", sub: "Your job, internship, or day-to-day work" },
  { id: "side", emoji: "🚀", label: "Founder / Side Project", sub: "A business, startup, freelance work, or something you're building" },
  { id: "both", emoji: "🔀", label: "A Mix of These", sub: "You use AI across school, work, and side projects — often all at once" },
];

const TIER_IMAGES = {
  "At Risk": "/images/bystander.png",
  "Operator": "/images/operator.png",
  "Navigator": "/images/navigator.png",
  "Architect": "/images/architect.png",
  "Vanguard": "/images/leader-fixed.webp",
};

const TIERS = [
  {
    min: 12, max: 23,
    label: "At Risk", emoji: "🚨",
    color: "#C0392B", lightColor: "#FDECEA", accentColor: "#E74C3C",
    urgency: "EARLY EXPLORER",
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
    min: 24, max: 34,
    label: "Operator", emoji: "⚡",
    color: "#D35400", lightColor: "#FEF5E7", accentColor: "#E67E22",
    urgency: "BUILDING MOMENTUM",
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
    min: 35, max: 43,
    label: "Navigator", emoji: "🌐",
    color: "#1A6B8A", lightColor: "#EBF5FB", accentColor: "#2E86AB",
    urgency: "GROWING CONFIDENCE",
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
    min: 44, max: 50,
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
    min: 51, max: 60,
    label: "Vanguard", emoji: "🚀",
    color: "#0E6655", lightColor: "#E8F8F5", accentColor: "#1ABC9C",
    urgency: "AI FRONTRUNNER",
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
  if (audience === "student") return tier.modules.student || tier.modules.work;
  if (audience === "work") return tier.modules.work || tier.modules.student;
  if (audience === "side") return tier.modules.work || tier.modules.student;
  if (audience === "both") return tier.modules.work || tier.modules.student;
  return tier.modules.work || tier.modules.student;
}

const AUDIENCE_META = {
  student: { label: "student", labelLong: "student" },
  work: { label: "professional", labelLong: "professional" },
  side: { label: "builder", labelLong: "founder / side-project builder" },
  both: { label: "multi-context user", labelLong: "student, professional, and builder" },
};

const FREE_RESULT_COPY = {
  "At Risk": {
    student: {
      means: [
        "Right now, AI is not really part of how you study.",
        "You may have tried it a few times, but it is not yet something you reach for naturally when you are reading, revising, or getting unstuck.",
      ],
      missing: [
        "You are still doing first drafts, explanations, and study support fully manually.",
        "You are spending more time than you need to on getting started.",
        "You do not yet have a basic habit of using AI to make school feel lighter.",
      ],
      next: [
        "This is not about mastering every tool.",
        "It is about getting comfortable using AI for small, everyday academic tasks.",
        "Your report shows you exactly where to start without crossing the line into lazy or low-integrity work.",
      ],
    },
    work: {
      means: [
        "Right now, AI is not really part of how you work.",
        "You may be aware of it, but it is not yet something shaping how you write, research, or get through routine tasks.",
      ],
      missing: [
        "You are still doing simple drafting, summarising, and idea-generation fully manually.",
        "You are spending time on tasks that no longer need your full effort.",
        "You do not yet have a reliable habit of using AI to make work faster or cleaner.",
      ],
      next: [
        "This is not about becoming an expert overnight.",
        "It is about building a basic working habit that immediately saves time.",
        "Your report shows you the first use cases worth adopting in your role.",
      ],
    },
    side: {
      means: [
        "Right now, AI is not meaningfully part of how you build.",
        "You may have experimented with it, but it is not yet helping you move ideas into action faster.",
      ],
      missing: [
        "You are still brainstorming, drafting, and figuring things out mostly on your own.",
        "You are not yet using AI to reduce the friction of building.",
        "Your progress depends almost entirely on your own time and energy.",
      ],
      next: [
        "This is not about agents or advanced systems yet.",
        "It is about using AI to reduce the drag that slows down small projects.",
        "Your report shows you the first places where AI can actually speed up execution.",
      ],
    },
    both: {
      means: [
        "Right now, AI is not yet a real habit across school, work, or anything you are building.",
        "You may know it matters, but it is not consistently helping you in the places where it could save the most time.",
      ],
      missing: [
        "You are still handling similar tasks manually across multiple parts of your life.",
        "You do not yet have one reliable way of using AI that travels across contexts.",
        "You are putting in more effort than you need to almost everywhere.",
      ],
      next: [
        "This is about building one habit that starts paying off across contexts.",
        "Not everything at once — just the first repeatable use that changes your week.",
        "Your report shows you where that first win is most likely to be.",
      ],
    },
  },
  Operator: {
    student: {
      means: [
        "You are already using AI for school, which puts you ahead of most students.",
        "But right now your usage looks like this: you open ChatGPT when you are stuck, get help with an assignment or concept, and then move on.",
      ],
      missing: [
        "You use AI to get through work faster, but not to structure how you study.",
        "You still take notes, revise, and organise material mostly from scratch.",
        "Each assignment gets easier, but your overall system is not improving.",
      ],
      next: [
        "Your next level is not using AI more for homework.",
        "It is using it to support how you learn, revise, and prepare across subjects.",
        "Your report shows where your current approach is leaving real study leverage on the table.",
      ],
    },
    work: {
      means: [
        "You are already using AI at work, which puts you ahead of most people.",
        "But right now your usage looks like this: you use it for quick drafting, emails, writing, or thinking help when needed, then go back to your usual process.",
      ],
      missing: [
        "You speed up one-off tasks, but still redo similar work each time.",
        "You do not yet have a repeatable way of using AI across your actual workflow.",
        "Your output is faster, but your process has not really changed.",
      ],
      next: [
        "Your next level is not just using AI more often.",
        "It is turning repeat tasks into structured workflows and using different tools for different jobs.",
        "Your report shows where that shift would create the biggest payoff in your role.",
      ],
    },
    side: {
      means: [
        "You are already using AI for something you are building, which puts you ahead of most people.",
        "But right now your usage looks like this: you use it for ideas, writing, or getting unstuck, but not as a real execution layer.",
      ],
      missing: [
        "You use AI to help think, but not to speed up actual building.",
        "You are still doing too much manually across research, drafting, and execution.",
        "You do not yet have a repeatable system for building with AI.",
      ],
      next: [
        "Your next level is not using AI only when you hit a wall.",
        "It is using it across the actual build process so progress compounds.",
        "Your report shows where your current setup is slowing down what you are building.",
      ],
    },
    both: {
      means: [
        "You are already using AI across more than one part of your life, which is a strong starting point.",
        "But right now your usage is still reactive: you reach for it when stuck, not as part of one system that helps across school, work, and building.",
      ],
      missing: [
        "You solve tasks faster in the moment, but start from scratch too often.",
        "You are not yet carrying what works from one context into another.",
        "You are using AI, but not in a way that compounds across your week.",
      ],
      next: [
        "Your next level is building one repeatable way of working that travels across contexts.",
        "That means fewer one-off prompts and more reusable patterns.",
        "Your report shows where that cross-context leverage is easiest to unlock.",
      ],
    },
  },
  Navigator: {
    student: {
      means: [
        "You have moved past basic use and are already exploring AI more intentionally than most students.",
        "You try different tools, compare outputs, and think more critically about what each one is good for.",
      ],
      missing: [
        "You are learning fast, but not always locking in what works.",
        "You switch between tools, but do not yet have a clear academic setup for repeat tasks.",
        "You experiment often, but your best methods are not compounding yet.",
      ],
      next: [
        "Your next level is turning exploration into consistency.",
        "That means deciding which tools you trust for which academic tasks and reusing what works.",
        "Your report shows where your current experimentation still leaks time.",
      ],
    },
    work: {
      means: [
        "You are ahead of most professionals because you already know AI is not just one tool.",
        "You explore, compare, and adjust instead of blindly accepting the first answer.",
      ],
      missing: [
        "You are improving, but your setup is still more exploratory than systematic.",
        "You find useful prompts and workflows, but do not always save or standardise them.",
        "Each task still takes more fresh effort than it should.",
      ],
      next: [
        "Your next level is moving from experimenting well to operating consistently.",
        "That means assigning tools to tasks and building repeatable ways of working.",
        "Your report shows where your current curiosity is not yet translating into real leverage.",
      ],
    },
    side: {
      means: [
        "You are already using multiple tools and thinking more strategically than most people building things with AI.",
        "You are not just playing around — you are exploring what each tool can do for different stages of execution.",
      ],
      missing: [
        "You are discovering useful patterns, but not yet turning them into a build system.",
        "You test workflows, but do not always formalise them into a repeatable process.",
        "You are progressing, but not scaling your own learning yet.",
      ],
      next: [
        "Your next level is turning discovery into a system you can rely on.",
        "That means fewer experiments that disappear and more workflows that compound.",
        "Your report shows where that shift matters most for what you are building.",
      ],
    },
    both: {
      means: [
        "You are already more thoughtful than most because you use different tools across different contexts.",
        "You are experimenting intelligently, but your setup is still fragmented.",
      ],
      missing: [
        "You are learning in multiple lanes, but not yet unifying what works.",
        "You have useful instincts, but not one clear system that follows you across school, work, and projects.",
        "Your progress is real, but it still depends on remembering what to do each time.",
      ],
      next: [
        "Your next level is creating consistency across contexts.",
        "That means fewer scattered experiments and more reusable patterns that travel with you.",
        "Your report shows where that fragmentation is costing you the most.",
      ],
    },
  },
  Architect: {
    student: {
      means: [
        "You already think about AI at a systems level, not just as a shortcut.",
        "You are intentional with prompts, outputs, and tools, and you are operating at a much higher level than most students.",
      ],
      missing: [
        "You still rebuild strong processes more often than you should.",
        "You know how to get excellent outputs, but your systems still depend heavily on your own active input.",
        "Your results are strong, but not yet as reusable or automated as they could be.",
      ],
      next: [
        "Your next level is turning your thinking into systems that keep working without constant reinvention.",
        "That means less manual orchestration and more designed reuse.",
        "Your report shows where your current process still depends too much on you.",
      ],
    },
    work: {
      means: [
        "You are already operating beyond most professionals because you think strategically about how AI should be used, not just whether it can help.",
        "You are deliberate with tools, prompts, and outputs, and that changes the quality of your work.",
      ],
      missing: [
        "You still rebuild strong workflows more often than necessary.",
        "You optimise tasks well, but many of your best processes still require your direct involvement every time.",
        "Your systems are strong, but not yet fully leveraged.",
      ],
      next: [
        "Your next level is moving from control to leverage.",
        "That means designing workflows once and using them many times with minimal intervention.",
        "Your report shows where your current process still depends too much on your time and attention.",
      ],
    },
    side: {
      means: [
        "You are already thinking like a builder, not just a user.",
        "You see workflows, not just prompts, and that puts you far ahead of most people building with AI.",
      ],
      missing: [
        "You can create strong systems, but you may still be rebuilding or over-managing them.",
        "You know how to make things work, but not every process is yet reliable or reusable.",
        "Your output is impressive, but some of your leverage still lives in your head.",
      ],
      next: [
        "Your next level is turning your best thinking into systems that scale beyond your immediate input.",
        "That means less reinvention and more durable build infrastructure.",
        "Your report shows where that shift matters most for what you are creating.",
      ],
    },
    both: {
      means: [
        "You are already operating at a systems level across more than one part of your life, which is rare.",
        "You are not just using AI well — you are thinking about structure, repeatability, and leverage.",
      ],
      missing: [
        "Your systems are strong, but some of them still depend too much on your own memory and attention.",
        "You may be rebuilding good processes separately in different contexts.",
        "You are already advanced, but not yet fully compounding that advantage across your whole week.",
      ],
      next: [
        "Your next level is designing once and benefiting across contexts.",
        "That means fewer duplicated systems and more shared infrastructure in how you think and work.",
        "Your report shows where your leverage is strongest and where it is still leaking.",
      ],
    },
  },
  Vanguard: {
    student: {
      means: [
        "You are already operating at a level where most people would come to you for AI advice.",
        "You are not trying to catch up — you are already ahead, and your real question is how to stay there.",
      ],
      missing: [
        "Your risk is not ignorance. It is coasting on an edge that still needs to deepen.",
        "You may be using AI brilliantly, but not always converting that edge into broader influence or long-term systems.",
        "At your level, the gains are less obvious — but still very real.",
      ],
      next: [
        "Your next level is not basic skill growth. It is sharper strategy, stronger systems, and bigger influence.",
        "That means going deeper, not just maintaining your lead.",
        "Your report shows where your current edge can still expand meaningfully.",
      ],
    },
    work: {
      means: [
        "You are already ahead enough that most people around you are still trying to catch up.",
        "You are not just competent with AI — you are operating near the frontier of what practical users in your context are doing.",
      ],
      missing: [
        "Your risk is not falling behind. It is staying impressive without becoming more strategic.",
        "You may already have the skill, but not yet be translating it into the largest possible leverage or influence.",
        "At your level, the gap is not obvious productivity — it is scale, leadership, and positioning.",
      ],
      next: [
        "Your next level is not more experimentation for its own sake.",
        "It is using your edge to shape systems, teams, and decisions more deliberately.",
        "Your report shows where your current strength can still become bigger leverage.",
      ],
    },
    side: {
      means: [
        "You are already operating at a level where AI is clearly a build advantage, not just a convenience.",
        "You are thinking beyond usage and into strategy, opportunity, and what is worth building.",
      ],
      missing: [
        "Your risk is not underusing AI. It is using it well without pushing toward the highest-leverage opportunities.",
        "You may already move fast, but not every strength is yet translating into durable advantage.",
        "At your level, the gap is less about speed and more about strategic depth.",
      ],
      next: [
        "Your next level is turning your edge into something more durable than good execution.",
        "That means sharper choices about what to build, what to automate, and what is actually worth pursuing.",
        "Your report shows where that frontier-level leverage still has room to expand.",
      ],
    },
    both: {
      means: [
        "You are already rare because you are using AI at a high level across multiple parts of your life.",
        "You are not just ahead in one lane — your edge is broad, and that is exactly why the next level matters so much.",
      ],
      missing: [
        "Your risk is not being behind. It is spreading your advantage without fully concentrating it.",
        "You may already be excellent in several contexts, but not yet maximising how those strengths reinforce each other.",
        "At your level, the opportunity is not more basic skill. It is sharper leverage.",
      ],
      next: [
        "Your next level is integrating your edge so it compounds across everything you do.",
        "That means fewer isolated wins and more deliberate systems, positioning, and influence.",
        "Your report shows where your current advantage can still become much more durable.",
      ],
    },
  },
};

function getFreeResultCopy(tierLabel, audience) {
  return FREE_RESULT_COPY[tierLabel]?.[audience] || FREE_RESULT_COPY[tierLabel]?.work || FREE_RESULT_COPY["Operator"].work;
}

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
  const [emailLoading, setEmailLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderState, setOrderState] = useState("verifying");
  const [sessionId, setSessionId] = useState("");

  // A return URL is never proof of payment; only the server can verify with Stripe.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    if (params.get("checkout") === "success" && id) {
      setSessionId(id);
      setScreen("receipt");
      verifyOrder(id);
    } else if (params.get("checkout") === "cancelled") {
      try {
        const savedAnswers = JSON.parse(sessionStorage.getItem("aiq_answers") || "[]");
        const savedAudience = sessionStorage.getItem("aiq_audience");
        if (savedAnswers.length === QUESTIONS.length && savedAudience) {
          setAnswers(savedAnswers);
          setAudience(savedAudience);
          setEmail(sessionStorage.getItem("aiq_email") || "");
          setEmailSubmitted(true);
          setScreen("email");
          setCheckoutError("Checkout was cancelled. No purchase was completed.");
        }
      } catch {}
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function verifyOrder(id) {
    setOrderState("verifying");
    try {
      const response = await fetch("/api/order-status?session_id=" + encodeURIComponent(id), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't verify your payment");
      setOrderState(data.paid ? data.delivery : "unpaid");
    } catch {
      setOrderState("error");
    }
  }

  const totalScore = answers.reduce((s, a) => s + a, 0);
  const tier = getTier(totalScore);
  const maxScore = QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map(o => o.points)), 0);
  const pct = Math.round(Math.max(0, (totalScore - QUESTIONS.length) / (maxScore - QUESTIONS.length)) * 100);
  const modules = audience ? getModules(tier, audience) : [];
  const audienceMeta = AUDIENCE_META[audience] || AUDIENCE_META.work;
  const audienceLabel = audienceMeta.labelLong;
  const freeResult = getFreeResultCopy(tier.label, audience);
  const tierImage = TIER_IMAGES[tier.label];
  const persona = PERSONA_PROFILES[tier.label];
  const dimensions = answers.length === QUESTIONS.length ? calculateDimensions(answers) : [];
  const rankedDimensions = [...dimensions].sort((a,b) => b.score / b.max - a.score / a.max);
  const strongest = rankedDimensions[0];
  const growthArea = rankedDimensions[rankedDimensions.length - 1];

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

  async function submitEmail() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email to get your snapshot.");
      return;
    }
    setEmailLoading(true);
    setEmailError("");
    try {
      const response = await fetch("/api/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audience, answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't send your snapshot");
      setEmailSubmitted(true);
    } catch (error) {
      setEmailError(error.message || "We couldn't send your snapshot. Please retry.");
    } finally {
      setEmailLoading(false);
    }
  }

  async function unlockReport() {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audience, answers })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout unavailable");
      if (!data.url || !data.url.startsWith("https://checkout.stripe.com/")) throw new Error("Invalid checkout link");
      sessionStorage.setItem("aiq_answers", JSON.stringify(answers));
      sessionStorage.setItem("aiq_audience", audience);
      sessionStorage.setItem("aiq_email", email);
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error.message || "Checkout unavailable. Please try later.");
      setCheckoutLoading(false);
    }
  }

  function reset() {
    setScreen("landing"); setCurrent(0); setAnswers([]);
    setSelected(null); setReport(null); setBarWidth(0);
    setAudience(null); setEmail(""); setEmailSubmitted(false);
    setEmailError(""); setOpenModule(null); setCheckoutError(""); setOrderState("verifying");
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

    .dark-screen{background:#0D0F14;color:#E8E8F0;min-height:100vh;}
    .light-screen{background:#FAFAF7;color:#1A1A1A;min-height:100vh;}

    .audience-btn{display:flex;align-items:center;gap:14px;width:100%;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:16px 18px;cursor:pointer;transition:all .15s;text-align:left;font-family:'DM Sans',sans-serif;margin-bottom:10px;color:#E8E8F0;}
    .audience-btn:hover{background:rgba(255,255,255,.055);border-color:rgba(0,212,255,.35);transform:translateX(4px);}

    .opt{display:block;width:100%;text-align:left;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:14px 17px;margin-bottom:8px;color:rgba(215,215,230,.62);font-size:.91rem;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;line-height:1.4;}
    .opt:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.14);color:#fff;transform:translateX(3px);}
    .opt.sel{background:rgba(0,212,255,.09);border-color:rgba(0,212,255,.42);color:#FF5555;}

    .next-dark{width:100%;padding:14px;border-radius:8px;border:none;font-weight:800;font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;letter-spacing:.06em;text-transform:uppercase;margin-top:5px;cursor:pointer;transition:all .15s;}
    .next-dark.on{background:#00D4FF;color:#fff;}
    .next-dark.on:hover{background:#00AACC;transform:translateY(-1px);}
    .next-dark.off{background:rgba(255,255,255,.04);color:rgba(255,255,255,.16);cursor:not-allowed;}

    .cta-dark{background:#00D4FF;color:#fff;border:none;border-radius:8px;padding:16px 40px;font-size:1.05rem;font-weight:800;cursor:pointer;font-family:'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:all .15s;}
    .cta-dark:hover{background:#00AACC;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,212,255,.35);}

    .cta-light{color:#fff;border:none;border-radius:10px;padding:16px 40px;font-size:1.05rem;font-weight:800;cursor:pointer;font-family:'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;transition:all .15s;}
    .cta-light:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.2);}

    .email-input{width:100%;background:#fff;border:1.5px solid #E0E0E0;border-radius:10px;padding:14px 16px;color:#1A1A1A;font-size:1rem;font-family:'DM Sans',sans-serif;outline:none;transition:border .15s;margin-bottom:10px;}
    .email-input::placeholder{color:#BDBDBD;}
    .email-input:focus{border-color:#999;}

    .ticker-wrap{overflow:hidden;white-space:nowrap;border-top:1px solid rgba(0,212,255,.16);border-bottom:1px solid rgba(0,212,255,.16);padding:8px 0;margin:24px 0;}
    .ticker-inner{display:inline-block;animation:ticker 24s linear infinite;}
    .t-item{display:inline-block;padding:0 26px;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(0,212,255,.6);font-family:'DM Sans',sans-serif;}

    .scanline{position:fixed;left:0;right:0;height:100px;background:linear-gradient(transparent,rgba(0,212,255,.03),transparent);animation:scanline 10s linear infinite;pointer-events:none;z-index:999;}
    .glitch{position:relative;}
    .glitch::after{content:attr(data-text);position:absolute;top:0;left:0;color:#00D4FF;opacity:0;pointer-events:none;}
    .glitch.active::after{opacity:.55;animation:glitch1 .15s steps(1) forwards;}

    .tier-avatar{animation:avatarIn .7s cubic-bezier(0.175,0.885,0.32,1.275) forwards;width:100%;border-radius:16px;object-fit:cover;display:block;}
    .tier-avatar-float{animation:float 4.6s ease-in-out infinite;will-change:transform;}
    @media (prefers-reduced-motion:reduce){.tier-avatar-float{animation:none}.tier-avatar{animation:none}}

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

    .result-stack{display:flex;flex-direction:column;gap:12px;margin-bottom:20px;}
    .result-card{background:#fff;border:1.5px solid #EBEBEB;border-radius:14px;padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
    .result-card-title{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#8F8F8F;margin-bottom:10px;font-weight:700;font-family:'DM Sans',sans-serif;}
    .result-card-copy{font-size:.92rem;color:#444;line-height:1.6;}
    .result-list{margin-top:10px;padding-left:18px;}
    .result-list li{font-size:.9rem;color:#444;line-height:1.55;margin-bottom:8px;}
    .result-note{margin-top:12px;padding-top:12px;border-top:1px solid #F1F1F1;font-size:.84rem;color:#777;line-height:1.5;}
  `;

  const tickers = ["Most people overestimate their AI level","What's your real AIQ?","Only 12% of professionals use AI strategically","Are you actually informed — or just nodding along?","Find out where you actually stand"];

  return (
    <>
      <style>{css}</style>

      {screen === "landing" && (
        <div className="dark-screen">
          <div className="scanline"/>
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em"}}>WHAT'S MY <span style={{color:"#00D4FF"}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"rgba(255,255,255,.22)",letterSpacing:".08em",textTransform:"uppercase"}}>whatsmyaiq.online</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>
            <div className="fu1" style={{display:"inline-flex",alignItems:"center",gap:"7px",background:"rgba(0,212,255,.1)",border:"1px solid rgba(0,212,255,.24)",borderRadius:"4px",padding:"5px 12px",fontSize:".68rem",letterSpacing:".12em",textTransform:"uppercase",color:"#00D4FF",marginBottom:"24px"}}>
              <span style={{width:"5px",height:"5px",background:"#00D4FF",borderRadius:"50%",display:"inline-block",animation:"blink 1s step-end infinite"}}/>2 min · free · find your level
            </div>
            <h1 className={`fu2 glitch${glitchActive?" active":""}`} data-text="WHAT'S YOUR REAL AIQ?" style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(2.4rem,8vw,4.4rem)",lineHeight:1.0,color:"#fff",marginBottom:"16px",textTransform:"uppercase",letterSpacing:".02em"}}>
              WHAT'S YOUR<br/><span style={{color:"#00D4FF"}}>REAL AIQ?</span>
            </h1>
            <p className="fu3" style={{fontSize:"1rem",color:"rgba(232,232,240,.52)",lineHeight:1.65,marginBottom:"10px"}}>Your feed is full of AI. Your friends won't stop talking about it. But which tools are actually worth your time and money?</p>
            <p className="fu3" style={{fontSize:"1.05rem",color:"#fff",fontWeight:600,lineHeight:1.5,marginBottom:"24px"}}>Find out exactly <span style={{color:"#00D4FF"}}>where you actually stand.</span></p>
            <div className="ticker-wrap fu4">
              <div className="ticker-inner">{[...tickers,...tickers].map((t,i)=><span key={i} className="t-item">{t} <span style={{color:"rgba(0,212,255,.3)"}}>◆</span></span>)}</div>
            </div>
            <div className="fu4" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"9px",marginBottom:"28px"}}>
              {[{num:String(QUESTIONS.length),label:"Questions"},{num:"3 MIN",label:"To complete"},{num:"FREE",label:"To start"}].map(s=>(
                <div key={s.label} className="sbox">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.45rem",fontWeight:900,color:"#fff"}}>{s.num}</div>
                  <div style={{fontSize:".7rem",color:"rgba(255,255,255,.28)",textTransform:"uppercase",letterSpacing:".07em",marginTop:"2px"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="fu5" style={{display:"flex",flexDirection:"column",alignItems:"stretch",gap:"9px"}}>
              <button className="cta-dark" style={{width:"100%"}} onClick={()=>setScreen("audience")}>Discover Your AIQ →</button>
              <p style={{textAlign:"center",fontSize:".74rem",color:"rgba(255,255,255,.2)"}}>Takes about 3 minutes · Free to start · Email for your personal profile</p>
            </div>
          </div>
        </div>
      )}

      {screen === "audience" && (
        <div className="dark-screen">
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#E8E8F0"}}>WHAT'S MY <span style={{color:"#00D4FF"}}>AIQ</span></div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"32px 20px 60px"}}>
            <div className="fu1" style={{marginBottom:"28px"}}>
              <p style={{fontSize:".72rem",letterSpacing:".12em",textTransform:"uppercase",color:"#00D4FF",marginBottom:"10px",fontWeight:600}}>Before we begin</p>
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
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",letterSpacing:".04em",color:"#E8E8F0"}}>WHAT'S MY <span style={{color:"#00D4FF"}}>AIQ</span></div>
            <div style={{fontSize:".68rem",color:"rgba(0,212,255,.5)",letterSpacing:".08em",textTransform:"uppercase"}}>AIQ Assessment</div>
          </div>
          <div style={{maxWidth:"580px",margin:"0 auto",padding:"28px 20px 60px",transition:"opacity .2s,transform .2s",opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(10px)"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"5px"}}>
              {QUESTIONS.map((_,i)=><div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<current?"#00D4FF":i===current?"rgba(0,212,255,.38)":"rgba(255,255,255,.06)",transition:"background .3s"}}/>)}
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

            {/* Natural image proportions avoid cropping heads; float animates the whole portrait, not the image crop. */}
            <div className="fu1" style={{marginBottom:"22px",padding:"6px 0 8px"}}>
              <div className="tier-avatar-float" style={{borderRadius:"16px",overflow:"hidden",background:tier.lightColor,boxShadow:`0 12px 34px ${tier.accentColor}1D`}}>
                <img src={tierImage} alt={tier.personality.title} className="tier-avatar" style={{width:"100%",height:"auto",display:"block"}}/>
              </div>
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

            <div className="fu3" style={{background:`linear-gradient(135deg, ${tier.color}, #121827)`,color:"#fff",borderRadius:"18px",padding:"22px",marginBottom:"18px",border:`1px solid ${tier.accentColor}55`,boxShadow:`0 12px 24px ${tier.accentColor}18`}}>
              <div style={{fontSize:".69rem",letterSpacing:".14em",textTransform:"uppercase",color:tier.lightColor,fontWeight:800,marginBottom:"10px"}}>Your AIQ personality · First look</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:900,letterSpacing:".03em",marginBottom:"10px"}}>{tier.personality.title}</div>
              <p style={{fontSize:".9rem",lineHeight:1.7,color:"#DDE3EC",marginBottom:"8px"}}>{persona.nudge}</p>
              <p style={{fontSize:".78rem",color:"#E4E8ED"}}>Your self-reported answers point to a bigger pattern. Your email explains what it means for you.</p>
            </div>

            <div className="fu3" style={{background:"#fff",border:`1.5px solid ${tier.accentColor}50`,borderRadius:"16px",padding:"20px",marginBottom:"18px",boxShadow:`0 5px 22px ${tier.accentColor}10`}}>
              <div style={{fontSize:".68rem",color:tier.color,textTransform:"uppercase",letterSpacing:".12em",fontWeight:800,marginBottom:"6px"}}>Your AIQ DNA</div>
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:900,color:"#16202B",marginBottom:"4px"}}>Four signals. One bigger picture.</h3>
              <p style={{fontSize:".79rem",lineHeight:1.5,color:"#657383",marginBottom:"18px"}}>These are self-reported readiness indicators, not a formal ability test. Discover how they connect in your personalised email.</p>
              {dimensions.map((dim) => (
                <div key={dim.id} style={{marginBottom:"15px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:"10px",marginBottom:"6px",alignItems:"center"}}>
                    <span style={{fontSize:".84rem",fontWeight:700,color:"#243142"}}>{dim.label}</span>
                    <span style={{fontSize:".82rem",fontWeight:800,color:tier.color}}>{dim.score}/{dim.max}</span>
                  </div>
                  <div style={{height:"8px",background:"#ECF0F6",borderRadius:"8px",overflow:"hidden"}}>
                    <div style={{width:`${100*dim.score/dim.max}%`,height:"100%",background:`linear-gradient(90deg, ${tier.color}, ${tier.accentColor})`,borderRadius:"8px"}}/>
                  </div>
                </div>
              ))}
              <div style={{borderTop:"1px solid #E9ECF2",paddingTop:"14px",display:"flex",flexWrap:"wrap",gap:"12px",justifyContent:"space-between"}}>
                <div><div style={{fontSize:".65rem",fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:"#8190A0"}}>Leading signal</div><div style={{fontSize:".88rem",fontWeight:700,color:"#16202B"}}>{strongest?.label}</div></div>
                <div><div style={{fontSize:".65rem",fontWeight:800,textTransform:"uppercase",letterSpacing:".08em",color:"#8190A0"}}>Room to grow</div><div style={{fontSize:".88rem",fontWeight:700,color:"#16202B"}}>{growthArea?.label}</div></div>
              </div>
            </div>

            {!emailSubmitted ? (
              <div className="fu4">
                <p style={{fontSize:".82rem",color:"#666",marginBottom:"10px"}}>Get the story behind your score—your personality profile, what each signal means, your strongest area and a practical next step. Free, straight to your inbox.</p>
                <input className="email-input" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitEmail()}/>
                {emailError&&<p style={{fontSize:".78rem",color:"#E74C3C",marginBottom:"8px"}}>{emailError}</p>}
                <button className="cta-light" style={{width:"100%",background:tier.accentColor}} onClick={submitEmail} disabled={emailLoading}>{emailLoading?"Preparing Your Profile…":"Email My Personal AIQ Profile →"}</button>
                <p style={{textAlign:"center",fontSize:".72rem",color:"#BDBDBD",marginTop:"8px"}}>One assessment email. No marketing subscription.</p>
              </div>
            ) : (
              <div className="fu4">
                <div style={{background:tier.lightColor,border:`1.5px solid ${tier.accentColor}75`,borderRadius:"14px",padding:"16px 20px",marginBottom:"16px"}}>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:"1.05rem",color:tier.color,marginBottom:"4px",textTransform:"uppercase",letterSpacing:".03em"}}>✓ Your AIQ profile is on its way to {email}</p>
                  <p style={{fontSize:".83rem",color:"#555",lineHeight:1.5}}>Check your inbox for your personality breakdown and tailored starting point. For a deeper diagnosis, the full report goes further.</p>
                </div>
                <div style={{background:"#fff",border:`1.5px solid ${tier.accentColor}60`,borderRadius:"14px",padding:"20px",marginBottom:"14px",boxShadow:`0 7px 24px ${tier.accentColor}13`}}>
                  <p style={{fontSize:".7rem",letterSpacing:".1em",textTransform:"uppercase",color:tier.color,marginBottom:"7px",fontWeight:800}}>BEYOND YOUR SCORE · $24.99</p>
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.5rem",lineHeight:1.15,color:"#172238",marginBottom:"9px"}}>Turn your AIQ into a plan.</h3>
                  <p style={{fontSize:".84rem",color:"#5F6C78",lineHeight:1.6,marginBottom:"14px"}}>Your free profile highlights your patterns. Your deep dive turns them into practical steps—starting with {growthArea?.label?.toLowerCase() || "your next opportunity"}.</p>
                  {[`Deep-dive into four AIQ dimensions in your ${audienceLabel} context`,"Evidence-based interpretation of your answers","Three relevant AI use cases and capability gaps","Your fastest practical win this week","A 7-day action plan and 30-day growth roadmap","Recommended learning areas to reach the next level"].map(item=>(
                    <div key={item} style={{display:"flex",alignItems:"flex-start",gap:"8px",padding:"6px 0",borderBottom:"1px solid #F5F5F5",fontSize:".83rem",color:"#555"}}>
                      <span style={{color:tier.accentColor,fontWeight:700,flexShrink:0}}>→</span>{item}
                    </div>
                  ))}
                  <div style={{marginTop:"16px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2.2rem",fontWeight:900,color:"#1A1A1A"}}>$24.99</div>
                    <div style={{fontSize:".72rem",color:"#BDBDBD",marginBottom:"12px"}}>One-time purchase · Personalised email delivery · No subscription</div>
                    <button className="cta-light" style={{width:"100%",background:tier.accentColor}} onClick={unlockReport} disabled={checkoutLoading}>{checkoutLoading?"Opening Secure Checkout…":"Unlock My Full Report →"}</button>
                  </div>
                </div>
                {checkoutError && <p role="alert" style={{color:"#B42318",fontSize:".84rem",marginBottom:"12px"}}>{checkoutError}</p>}
                <p style={{textAlign:"center",fontSize:".7rem",color:"#BDBDBD"}}>🔒 Secure checkout · Paid reports are delivered by email</p>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === "receipt" && (
        <div className="light-screen">
          <div style={{maxWidth:"620px",margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.3rem",marginBottom:"24px"}}>WHAT'S MY AIQ</div>
            <h1 style={{fontSize:"clamp(1.7rem,4vw,2.5rem)",fontWeight:800,color:"#17202a",marginBottom:"16px"}}>
              {orderState === "verifying" ? "Checking Your Payment" :
               orderState === "sent" ? "Your Report Has Been Sent" :
               orderState === "pending" ? "Payment Confirmed" :
               orderState === "unpaid" ? "Payment Not Yet Confirmed" : "We Couldn't Check Your Payment"}
            </h1>
            <p style={{color:"#555",lineHeight:1.65,fontSize:"1rem",marginBottom:"28px"}}>
              {orderState === "verifying" ? "Confirming your payment directly with Stripe." :
               orderState === "sent" ? "Your personalised AI readiness report has been passed to our email provider. Check your inbox and spam folder." :
               orderState === "pending" ? "Your purchase is confirmed. We're preparing your personalised report and will send it to the email used at checkout." :
               orderState === "unpaid" ? "Stripe has not confirmed a completed payment. If you just paid, please check again." :
               "Your payment status is currently unavailable. Please check again; do not pay a second time."}
            </p>
            {(orderState === "pending" || orderState === "verifying" || orderState === "error" || orderState === "unpaid") &&
              <button className="cta-light" style={{background:"#00D4FF"}} onClick={() => verifyOrder(sessionId)}>Check Status Again</button>}
            <p style={{fontSize:".76rem",color:"#8a8a8a",marginTop:"24px"}}>Your report is fulfilled using Stripe's confirmed payment record, even if you close this page.</p>
          </div>
        </div>
      )}

    </>
  );
}