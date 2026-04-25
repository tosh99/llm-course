import type { TopicId, TabId } from "./types"

type TopicConfig = {
    id: TopicId
    label: string
    category: string
    icon: string
    ready: boolean
}

type TabConfig = {
    id: TabId
    label: string
}

type TopicMeta = {
    eyebrow: string
    subtitle: string
}

// ── Topic Configuration ───────────────────────────────────────────────────────

export const TABS: TabConfig[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]

export const TOPICS: TopicConfig[] = [
    {
        id: "deep-belief-networks",
        label: "Deep Belief Networks",
        category: "Pretraining",
        icon: "⬡",
        ready: true,
    },
    {
        id: "relu",
        label: "ReLU Activation",
        category: "Activation",
        icon: "∧",
        ready: true,
    },
    {
        id: "dropout",
        label: "Dropout Regularization",
        category: "Regularization",
        icon: "⊘",
        ready: true,
    },
    {
        id: "initialization",
        label: "Weight Initialization",
        category: "Training",
        icon: "∇",
        ready: true,
    },
]

// ── Topic Metadata ─────────────────────────────────────────────────────────────

export const TOPIC_META: Record<TopicId, TopicMeta> = {
    "deep-belief-networks": {
        eyebrow: "Chapter 9 · Pretraining",
        subtitle: "Hinton's unsupervised pretraining strategy that made training deep networks feasible",
    },
    relu: {
        eyebrow: "Chapter 9 · Activation",
        subtitle: "Rectified Linear Units eliminate the vanishing gradient problem with simple computation",
    },
    dropout: {
        eyebrow: "Chapter 9 · Regularization",
        subtitle: "Randomly dropping neurons during training as a powerful regularization technique",
    },
    initialization: {
        eyebrow: "Chapter 9 · Training",
        subtitle: "Xavier and He initialization strategies for stable gradient flow in deep networks",
    },
}
