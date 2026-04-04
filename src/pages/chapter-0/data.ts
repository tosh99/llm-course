import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "linear-algebra", label: "Linear Algebra", icon: "⟨⟩", category: "Mathematics", ready: true },
    { id: "calculus", label: "Calculus", icon: "∂", category: "Mathematics", ready: true },
    { id: "probability", label: "Probability & Statistics", icon: "∼", category: "Mathematics", ready: true },
    { id: "information-theory", label: "Information Theory", icon: "ℍ", category: "Mathematics", ready: true },
    { id: "python", label: "Python", icon: "🐍", category: "Programming", ready: true },
    { id: "computing", label: "Computing", icon: "⚙", category: "Computing", ready: false },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    "linear-algebra": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Vectors, matrices, transformations — the language of data and models",
    },
    calculus: {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Derivatives, gradients, and the mechanics of learning",
    },
    probability: {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Distributions, Bayes, and uncertainty — the foundation of inference",
    },
    "information-theory": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Entropy, KL divergence, and how information is measured",
    },
    python: {
        eyebrow: "Prerequisites · Programming",
        subtitle: "NumPy, Pandas, Matplotlib — the scientific stack",
    },
    computing: {
        eyebrow: "Prerequisites · Computing",
        subtitle: "CPU vs GPU, vectorised operations, memory layout",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Python / NumPy" },
    { id: "code", label: "TypeScript" },
]
