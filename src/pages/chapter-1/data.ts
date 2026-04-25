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
        id: "linear-regression",
        label: "Linear Regression",
        icon: "≈",
        category: "Statistical Learning",
        ready: true,
    },
    {
        id: "correlation-pca",
        label: "Correlation & PCA",
        icon: "↗",
        category: "Statistical Learning",
        ready: true,
    },
    {
        id: "statistical-inference",
        label: "Statistical Inference",
        icon: "σ",
        category: "Statistical Learning",
        ready: true,
    },
    {
        id: "logistic-regression",
        label: "Logistic Regression",
        icon: "S",
        category: "Statistical Learning",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "linear-regression": {
        eyebrow: "Chapter 1 · Statistical Learning",
        subtitle:
            "Gauss's method of least squares — the origin of every regression model in machine learning",
    },
    "correlation-pca": {
        eyebrow: "Chapter 1 · Statistical Learning",
        subtitle:
            "Pearson's correlation and principal component analysis — finding structure in high-dimensional data",
    },
    "statistical-inference": {
        eyebrow: "Chapter 1 · Statistical Learning",
        subtitle:
            "Gosset, Fisher, and Neyman-Pearson — how statistics decides whether a learned pattern is real",
    },
    "logistic-regression": {
        eyebrow: "Chapter 1 · Statistical Learning",
        subtitle:
            "The sigmoid function and maximum likelihood — bridging regression to classification",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
