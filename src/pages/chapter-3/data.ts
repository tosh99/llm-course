import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "kmeans",       label: "k-Means Clustering",          icon: "✦", category: "Clustering",              ready: true },
    { id: "hierarchical", label: "Hierarchical Clustering",      icon: "⋈", category: "Clustering",              ready: true },
    { id: "pca",          label: "Principal Component Analysis", icon: "↗", category: "Dimensionality Reduction", ready: true },
    { id: "gmm-em",       label: "Gaussian Mixtures & EM",       icon: "≋", category: "Density Estimation",      ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    kmeans: {
        eyebrow: "Unsupervised Learning · Clustering",
        subtitle: "Partition data into K groups by iteratively moving centroids toward cluster means",
    },
    hierarchical: {
        eyebrow: "Unsupervised Learning · Clustering",
        subtitle: "Build a tree of nested clusters — no need to specify K in advance",
    },
    pca: {
        eyebrow: "Unsupervised Learning · Dimensionality Reduction",
        subtitle: "Find the directions of maximum variance to compress high-dimensional data",
    },
    "gmm-em": {
        eyebrow: "Unsupervised Learning · Density Estimation",
        subtitle: "Model data as a mixture of Gaussians and learn them with the EM algorithm",
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
