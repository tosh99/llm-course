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
        id: "chain-of-thought",
        label: "Chain-of-Thought",
        icon: "⊶",
        category: "Prompting",
        ready: true,
    },
    {
        id: "self-consistency",
        label: "Self-Consistency",
        icon: "⊙",
        category: "Prompting",
        ready: true,
    },
    {
        id: "tree-of-thoughts",
        label: "Tree of Thoughts",
        icon: "⊤",
        category: "Search",
        ready: true,
    },
    {
        id: "process-rewards",
        label: "Process Rewards",
        icon: "★",
        category: "Training",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "chain-of-thought": {
        eyebrow: "Chapter 29 · Prompting",
        subtitle:
            "Wei et al.'s 2022 discovery that prompting language models with step-by-step reasoning examples dramatically improves performance on multi-step arithmetic and commonsense tasks",
    },
    "self-consistency": {
        eyebrow: "Chapter 29 · Prompting",
        subtitle:
            "Wang et al.'s 2022 technique of sampling multiple diverse reasoning chains and taking the majority-vote answer — improving over greedy chain-of-thought by a wide margin",
    },
    "tree-of-thoughts": {
        eyebrow: "Chapter 29 · Search",
        subtitle:
            "Yao et al.'s 2023 framework for deliberate problem solving — using the LLM as both a thought generator and evaluator within a tree search over reasoning paths",
    },
    "process-rewards": {
        eyebrow: "Chapter 29 · Training",
        subtitle:
            "Lightman et al.'s 2023 finding that rewarding each reasoning step (process supervision) substantially outperforms rewarding only the final answer for mathematical reasoning",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
