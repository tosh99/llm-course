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
        id: "mcculloch-pitts",
        label: "McCulloch-Pitts Neuron",
        icon: "⬡",
        category: "Origins",
        ready: true,
    },
    {
        id: "hebbian",
        label: "Hebb's Rule",
        icon: "⚡",
        category: "Origins",
        ready: true,
    },
    {
        id: "perceptron",
        label: "Rosenblatt Perceptron",
        icon: "◎",
        category: "Origins",
        ready: true,
    },
    {
        id: "xor-problem",
        label: "XOR Problem",
        icon: "⊕",
        category: "Limitations",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "mcculloch-pitts": {
        eyebrow: "Chapter 2 · Origins",
        subtitle:
            "The first mathematical model of a neuron — all-or-nothing logic with thresholds",
    },
    hebbian: {
        eyebrow: "Chapter 2 · Origins",
        subtitle:
            "Neurons that fire together wire together — the first learning rule",
    },
    perceptron: {
        eyebrow: "Chapter 2 · Origins",
        subtitle:
            "The first working learning algorithm — and what it could and couldn't learn",
    },
    "xor-problem": {
        eyebrow: "Chapter 2 · Limitations",
        subtitle:
            "The devastating result that halted neural network research for a decade",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
