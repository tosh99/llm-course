import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "momentum",           label: "Momentum & Nesterov",    icon: "∇", category: "First-Order Methods", ready: true },
    { id: "adam",               label: "Adam Optimizer",          icon: "∂", category: "First-Order Methods", ready: true },
    { id: "batch-normalization",label: "Batch Normalization",     icon: "μ", category: "Normalization",       ready: true },
    { id: "layer-normalization",label: "Layer Normalization",     icon: "σ", category: "Normalization",       ready: true },
    { id: "lr-schedules",       label: "LR Schedules",            icon: "↝", category: "Schedules",           ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    momentum: {
        eyebrow: "Chapter 9 · First-Order Methods",
        subtitle: "Accumulate past gradients to accelerate through ravines and dampen oscillations",
    },
    adam: {
        eyebrow: "Chapter 9 · First-Order Methods",
        subtitle: "Adaptive per-parameter learning rates via first and second moment estimates",
    },
    "batch-normalization": {
        eyebrow: "Chapter 9 · Normalization",
        subtitle: "Normalize layer inputs per mini-batch — enabling higher learning rates and stable deep training",
    },
    "layer-normalization": {
        eyebrow: "Chapter 9 · Normalization",
        subtitle: "Normalize over the feature dimension — the standard for Transformers and RNNs",
    },
    "lr-schedules": {
        eyebrow: "Chapter 9 · Schedules",
        subtitle: "Warmup, cosine annealing, and cyclical rates — how learning rate shapes convergence",
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
