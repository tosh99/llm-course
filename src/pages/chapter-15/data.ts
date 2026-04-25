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
        id: "bahdanau",
        label: "Bahdanau Attention",
        icon: "α",
        category: "Attention Foundations",
        ready: true,
    },
    {
        id: "alignment-scores",
        label: "Alignment Scores",
        icon: "∝",
        category: "Attention Foundations",
        ready: true,
    },
    {
        id: "luong",
        label: "Luong Attention",
        icon: "⊙",
        category: "Attention Variants",
        ready: true,
    },
    {
        id: "soft-hard",
        label: "Soft vs Hard",
        icon: "⇒",
        category: "Attention Variants",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    bahdanau: {
        eyebrow: "Chapter 15 · Attention Foundations",
        subtitle:
            "Additive attention that jointly learns to align and translate — breaking the fixed-context bottleneck",
    },
    "alignment-scores": {
        eyebrow: "Chapter 15 · Attention Foundations",
        subtitle:
            "Scoring functions that measure compatibility — additive, dot-product, and general variants compared",
    },
    luong: {
        eyebrow: "Chapter 15 · Attention Variants",
        subtitle:
            "Multiplicative global and local attention — simpler formulations with competitive performance",
    },
    "soft-hard": {
        eyebrow: "Chapter 15 · Attention Variants",
        subtitle:
            "Soft attention blends all positions; hard attention samples one — differentiability vs interpretability",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
