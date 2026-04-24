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
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "scaling-laws": {
        eyebrow: "Chapter 18 · Scaling",
        subtitle:
            "OpenAI's 2020 discovery that loss predictably improves with model size, data, and compute",
    },
    "power-laws": {
        eyebrow: "Chapter 18 · Scaling",
        subtitle:
            "The mathematical relationships governing how language models improve with scale",
    },
    "emergent-abilities": {
        eyebrow: "Chapter 18 · Behavior",
        subtitle:
            "Capabilities that appear suddenly and unpredictably as models grow larger",
    },
    chinchilla: {
        eyebrow: "Chapter 18 · Optimal Training",
        subtitle:
            "DeepMind's 2022 finding that most models are under-trained — and how to fix it",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Sample Code" },
]
