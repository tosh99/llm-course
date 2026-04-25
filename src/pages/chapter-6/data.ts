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
    { id: "bidirectional", label: "Bidirectional RNN", icon: "⇄", category: "Architecture", ready: true },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "simple-rnn": {
        eyebrow: "Chapter 6 · Architecture",
        subtitle:
            "Adding memory to neural networks — Elman and Jordan recurrent architectures",
    },
    bptt: {
        eyebrow: "Chapter 6 · Training",
        subtitle:
            "Unrolling time: how gradients flow backwards through sequence steps",
    },
    "vanishing-gradient": {
        eyebrow: "Chapter 6 · Training",
        subtitle:
            "Why RNNs forget: the curse of exponentially decaying gradients in deep sequences",
    },
    lstm: {
        eyebrow: "Chapter 6 · Architecture",
        subtitle:
            "Hochreiter & Schmidhuber's gating solution — letting the network decide what to remember",
    },
    bidirectional: { eyebrow: "Chapter 6 · Architecture", subtitle: "Schuster & Paliwal (1997) — processing sequences in both directions for richer context" },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
