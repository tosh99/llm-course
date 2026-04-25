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
        id: "emergent-abilities",
        label: "Emergent Abilities",
        icon: "✦",
        category: "Phenomena",
        ready: true,
    },
    {
        id: "chinchilla-scaling",
        label: "Chinchilla Scaling",
        icon: "🐭",
        category: "Optimal Training",
        ready: true,
    },
    {
        id: "phase-transitions",
        label: "Phase Transitions",
        icon: "◉",
        category: "Theory",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "emergent-abilities": {
        eyebrow: "Chapter 24 · Phenomena",
        subtitle:
            "Jason Wei et al.'s 2022 finding that certain language model capabilities appear suddenly and discontinuously as scale crosses a threshold",
    },
    "chinchilla-scaling": {
        eyebrow: "Chapter 24 · Optimal Training",
        subtitle:
            "Hoffmann et al.'s 2022 discovery that most frontier models are dramatically under-trained — and the compute-optimal training formula that followed",
    },
    "phase-transitions": {
        eyebrow: "Chapter 24 · Theory",
        subtitle:
            "The mathematical analysis of why capabilities emerge discontinuously — percolation theory, loss landscape geometry, and the debate over whether emergence is real",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
