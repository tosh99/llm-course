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
        id: "kmeans",
        label: "k-Means Clustering",
        icon: "✦",
        category: "Clustering",
        ready: true,
    },
    {
        id: "hierarchical",
        label: "Hierarchical Clustering",
        icon: "⋈",
        category: "Clustering",
        ready: true,
    },
    {
        id: "gmm-em",
        label: "Gaussian Mixtures & EM",
        icon: "≋",
        category: "Density Estimation",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    kmeans: {
        eyebrow: "Chapter 3 · Clustering",
        subtitle:
            "Partition data into K groups by iteratively moving centroids toward cluster means",
    },
    hierarchical: {
        eyebrow: "Chapter 3 · Clustering",
        subtitle:
            "Build a tree of nested clusters — no need to specify K in advance",
    },
    "gmm-em": {
        eyebrow: "Chapter 3 · Density Estimation",
        subtitle:
            "Model data as a mixture of Gaussians and learn them with the EM algorithm",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
