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
        id: "svm",
        label: "SVM & Kernel Trick",
        icon: "⊥",
        category: "Supervised Learning",
        ready: true,
    },
    {
        id: "adaboost",
        label: "AdaBoost",
        icon: "⬆",
        category: "Ensemble Methods",
        ready: true,
    },
    {
        id: "random-forests",
        label: "Random Forests",
        icon: "⋃",
        category: "Ensemble Methods",
        ready: true,
    },
    {
        id: "regularization",
        label: "Regularization",
        icon: "∥∥",
        category: "Generalization",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    svm: {
        eyebrow: "Chapter 8 · Supervised Learning",
        subtitle:
            "Vapnik & Boser (1963 / 1992) — maximum-margin classification and the kernel trick",
    },
    adaboost: {
        eyebrow: "Chapter 8 · Ensemble Methods",
        subtitle:
            "Freund & Schapire (1996) — boosting weak learners into a strong classifier by reweighting mistakes",
    },
    "random-forests": {
        eyebrow: "Chapter 8 · Ensemble Methods",
        subtitle:
            "Breiman (2001) — averaging many decorrelated trees to slash variance without sacrificing accuracy",
    },
    regularization: {
        eyebrow: "Chapter 8 · Generalization",
        subtitle:
            "Ridge, Lasso & Elastic Net — the bias-variance tradeoff made operational through penalty terms",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
