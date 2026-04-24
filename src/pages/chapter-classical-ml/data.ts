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
        category: "Supervised Learning",
        ready: true,
    },
    {
        id: "decision-trees",
        label: "Decision Trees",
        icon: "⿿",
        category: "Supervised Learning",
        ready: true,
    },
    {
        id: "svm",
        label: "Support Vector Machines",
        icon: "⊥",
        category: "Supervised Learning",
        ready: true,
    },
    {
        id: "ensembles",
        label: "Ensemble Methods",
        icon: "⋃",
        category: "Meta-Algorithms",
        ready: true,
    },
    {
        id: "regularization",
        label: "Regularization",
        icon: "∥∥",
        category: "Meta-Algorithms",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "linear-regression": {
        eyebrow: "Classical ML · Supervised Learning",
        subtitle:
            "Fitting a line through noise — the origin of nearly every model in this chapter",
    },
    "decision-trees": {
        eyebrow: "Classical ML · Supervised Learning",
        subtitle:
            "Recursive partitioning that learns interpretable decision rules from data",
    },
    svm: {
        eyebrow: "Classical ML · Supervised Learning",
        subtitle:
            "Maximum-margin classification and the kernel trick that unlocked non-linear boundaries",
    },
    ensembles: {
        eyebrow: "Classical ML · Meta-Algorithms",
        subtitle:
            "Wisdom of the crowd — combining many weak learners into one powerful model",
    },
    regularization: {
        eyebrow: "Classical ML · Meta-Algorithms",
        subtitle:
            "Taming overfitting by penalising complexity — bias-variance tradeoff made explicit",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
