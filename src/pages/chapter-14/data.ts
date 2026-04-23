import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "scaled-dot-product", label: "Scaled Dot-Product", icon: "⊙", category: "Attention", ready: true },
    { id: "multi-head",         label: "Multi-Head Attention", icon: "⧉", category: "Attention", ready: true },
    { id: "positional-encoding", label: "Positional Encoding", icon: "⌖", category: "Architecture", ready: true },
    { id: "encoder-decoder",    label: "Encoder / Decoder", icon: "⇄", category: "Architecture", ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    "scaled-dot-product": {
        eyebrow: "Chapter 14 · Attention",
        subtitle: "The core operation that replaced recurrence with direct pairwise comparison",
    },
    "multi-head": {
        eyebrow: "Chapter 14 · Attention",
        subtitle: "Running attention in parallel subspaces to capture diverse relational patterns",
    },
    "positional-encoding": {
        eyebrow: "Chapter 14 · Architecture",
        subtitle: "Injecting order information into a permutation-invariant architecture",
    },
    "encoder-decoder": {
        eyebrow: "Chapter 14 · Architecture",
        subtitle: "The full Transformer stack: self-attention, cross-attention, and feed-forward layers",
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
