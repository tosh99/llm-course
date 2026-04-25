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
        id: "introduction",
        label: "Introduction",
        icon: "◈",
        category: "Foundations",
        ready: true,
    },
    {
        id: "weight-sharing",
        label: "Weight Sharing",
        icon: "◦",
        category: "Foundations",
        ready: true,
    },
    {
        id: "lenet",
        label: "LeNet-5",
        icon: "◦",
        category: "Architecture",
        ready: true,
    },
    {
        id: "building-blocks",
        label: "CNN Building Blocks",
        icon: "◦",
        category: "Architecture",
        ready: true,
    },
    {
        id: "feature-hierarchies",
        label: "Feature Hierarchies",
        icon: "◦",
        category: "Concepts",
        ready: true,
    },
    {
        id: "why-cnns-stalled",
        label: "Why CNNs Stalled",
        icon: "◦",
        category: "Historical Context",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    introduction: {
        eyebrow: "Chapter 7 · Foundations",
        subtitle:
            "From biological inspiration to LeNet-5: how convolutions revolutionized visual recognition",
    },
    "weight-sharing": {
        eyebrow: "Chapter 7 · Foundations",
        subtitle:
            "Sparse interactions, parameter sharing, and the convolution operation",
    },
    lenet: {
        eyebrow: "Chapter 7 · Architecture",
        subtitle:
            "The landmark 1998 architecture that established the CNN blueprint",
    },
    "building-blocks": {
        eyebrow: "Chapter 7 · Architecture",
        subtitle:
            "Conv, Pool, Flatten, FC — the fundamental operations of CNNs",
    },
    "feature-hierarchies": {
        eyebrow: "Chapter 7 · Concepts",
        subtitle:
            "Edge detectors to object parts: emergent hierarchical representations",
    },
    "why-cnns-stalled": {
        eyebrow: "Chapter 7 · Historical Context",
        subtitle:
            "Compute limits, data scarcity, and why CNNs fell into obscurity through the 2000s",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
