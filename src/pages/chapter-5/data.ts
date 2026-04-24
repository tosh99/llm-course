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
        id: "simple-rnn",
        label: "Simple RNNs",
        icon: "⟳",
        category: "Architecture",
        ready: true,
    },
    {
        id: "bptt",
        label: "Backpropagation Through Time",
        icon: "⤵",
        category: "Training",
        ready: true,
    },
    {
        id: "vanishing-gradient",
        label: "Vanishing Gradient Problem",
        icon: "↘",
        category: "Training",
        ready: true,
    },
    {
        id: "lstm",
        label: "Long Short-Term Memory",
        icon: "⊡",
        category: "Architecture",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "simple-rnn": {
        eyebrow: "Chapter 5 · Architecture",
        subtitle:
            "Adding memory to neural networks — Elman and Jordan recurrent architectures",
    },
    bptt: {
        eyebrow: "Chapter 5 · Training",
        subtitle:
            "Unrolling time: how gradients flow backwards through sequence steps",
    },
    "vanishing-gradient": {
        eyebrow: "Chapter 5 · Training",
        subtitle:
            "Why RNNs forget: the curse of exponentially decaying gradients in deep sequences",
    },
    lstm: {
        eyebrow: "Chapter 5 · Architecture",
        subtitle:
            "Hochreiter & Schmidhuber's gating solution — letting the network decide what to remember",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Sample Code" },
]
