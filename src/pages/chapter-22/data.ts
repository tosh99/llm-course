import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: {
    id: TopicId
    label: string
    icon: string
    category: string
    ready: boolean
}[] = [
    {
        id: "scaling-laws",
        label: "Kaplan Scaling Laws",
        icon: "📈",
        category: "Scaling",
        ready: true,
    },
    {
        id: "power-laws",
        label: "Power Laws",
        icon: "∿",
        category: "Scaling",
        ready: true,
    },
    {
        id: "emergent-abilities",
        label: "Emergent Abilities",
        icon: "✨",
        category: "Behavior",
        ready: true,
    },
    {
        id: "chinchilla",
        label: "Chinchilla",
        icon: "🐭",
        category: "Optimal Training",
        ready: true,
    },
    {
        id: "gpt3",
        label: "GPT-3 (175B)",
        icon: "③",
        category: "Architecture",
        ready: true,
    },
    {
        id: "incontext",
        label: "In-Context Learning",
        icon: "↺",
        category: "Core Concepts",
        ready: true,
    },
    {
        id: "fewshot",
        label: "Zero / One / Few-Shot",
        icon: "⟶",
        category: "Core Concepts",
        ready: true,
    },
    {
        id: "prompt",
        label: "Prompt Engineering",
        icon: "✎",
        category: "Applications",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "scaling-laws": {
        eyebrow: "Chapter 22 · Scaling",
        subtitle:
            "OpenAI's 2020 discovery that loss predictably improves with model size, data, and compute",
    },
    "power-laws": {
        eyebrow: "Chapter 22 · Scaling",
        subtitle:
            "The mathematical relationships governing how language models improve with scale",
    },
    "emergent-abilities": {
        eyebrow: "Chapter 22 · Behavior",
        subtitle:
            "Capabilities that appear suddenly and unpredictably as models grow larger",
    },
    chinchilla: {
        eyebrow: "Chapter 22 · Optimal Training",
        subtitle:
            "DeepMind's 2022 finding that most models are under-trained — and how to fix it",
    },
    gpt3: {
        eyebrow: "Chapter 22 · The Model",
        subtitle:
            "A 175-billion-parameter autoregressive language model that demonstrated emergent few-shot capabilities at scale",
    },
    incontext: {
        eyebrow: "Chapter 22 · The Model",
        subtitle:
            "Learning from examples embedded directly in the prompt — no gradient updates required",
    },
    fewshot: {
        eyebrow: "Chapter 22 · Paradigms",
        subtitle:
            "The spectrum from zero-shot generalization to few-shot adaptation without parameter updates",
    },
    prompt: {
        eyebrow: "Chapter 22 · Paradigms",
        subtitle:
            "The art and science of crafting instructions and context to steer large language model behavior",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
