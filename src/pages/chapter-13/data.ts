import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "gru",                   label: "GRU",                   icon: "↻", category: "Gated Units",      ready: true },
    { id: "bidirectional",         label: "Bidirectional RNN",     icon: "⇄", category: "Gated Units",      ready: true },
    { id: "deep-rnns",             label: "Deep RNNs",             icon: "▦", category: "Architectures",    ready: true },
    { id: "sequential-parallelism", label: "Sequential Parallelism", icon: "⧉", category: "Architectures",    ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    gru: {
        eyebrow: "Chapter 13 · Gated Units",
        subtitle: "A streamlined gating mechanism that matches LSTM performance with fewer parameters and faster computation",
    },
    bidirectional: {
        eyebrow: "Chapter 13 · Gated Units",
        subtitle: "Reading sequences in both directions to capture future and past context simultaneously",
    },
    "deep-rnns": {
        eyebrow: "Chapter 13 · Architectures",
        subtitle: "Stacking recurrent layers for hierarchical representations — depth in the time domain",
    },
    "sequential-parallelism": {
        eyebrow: "Chapter 13 · Architectures",
        subtitle: "Techniques for training and inference parallelism in inherently sequential models",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history",    label: "History" },
    { id: "kid",        label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths",      label: "Maths" },
    { id: "python",     label: "Python / NumPy" },
    { id: "code",       label: "TypeScript" },
]
