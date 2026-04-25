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
        id: "id3",
        label: "ID3 Algorithm",
        icon: "↬",
        category: "Decision Trees",
        ready: true,
    },
    {
        id: "cart",
        label: "CART",
        icon: "⿿",
        category: "Decision Trees",
        ready: true,
    },
    {
        id: "gini-entropy",
        label: "Gini vs Entropy Splitting",
        icon: "ℍ",
        category: "Decision Trees",
        ready: true,
    },
    {
        id: "pruning",
        label: "Pruning",
        icon: "✂",
        category: "Decision Trees",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    id3: {
        eyebrow: "Chapter 4 · Decision Trees",
        subtitle:
            "Quinlan (1979 / 1986) — learning rules from labeled examples using information gain",
    },
    cart: {
        eyebrow: "Chapter 4 · Decision Trees",
        subtitle:
            "Breiman, Friedman, Olshen & Stone (1984) — binary recursive partitioning for classification and regression",
    },
    "gini-entropy": {
        eyebrow: "Chapter 4 · Decision Trees",
        subtitle:
            "Shannon's entropy and Gini impurity — the information-theoretic basis of every splitting criterion",
    },
    pruning: {
        eyebrow: "Chapter 4 · Decision Trees",
        subtitle:
            "Cost-complexity pruning — how decision trees escape overfitting by learning to forget",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
