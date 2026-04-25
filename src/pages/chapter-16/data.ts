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
        id: "deep-rnns",
        label: "Deep RNNs",
        icon: "▦",
        category: "Architectures",
        ready: true,
    },
    {
        id: "sequential-parallelism",
        label: "Sequential Parallelism",
        icon: "⧉",
        category: "Architectures",
        ready: true,
    },
    { id: "pointer-networks", label: "Pointer Networks", icon: "→", category: "Advanced Architectures", ready: true },
    { id: "wavenet",          label: "WaveNet",           icon: "∿", category: "Advanced Architectures", ready: true },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "deep-rnns": {
        eyebrow: "Chapter 16 · Architectures",
        subtitle:
            "Stacking recurrent layers for hierarchical representations — depth in the time domain",
    },
    "sequential-parallelism": {
        eyebrow: "Chapter 16 · Architectures",
        subtitle:
            "Techniques for training and inference parallelism in inherently sequential models",
    },
    "pointer-networks": { eyebrow: "Chapter 16 · Advanced Architectures", subtitle: "Vinyals et al. (2015) — attention over the input to produce variable-length outputs" },
    "wavenet":          { eyebrow: "Chapter 16 · Advanced Architectures", subtitle: "van den Oord et al. (2016) — dilated causal convolutions for autoregressive audio generation" },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
