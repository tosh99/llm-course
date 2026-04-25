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
        id: "integral-calculus",
        label: "Integral Calculus",
        icon: "∫",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "derivatives-gradients",
        label: "Derivatives & Gradients",
        icon: "∂",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "systems-equations",
        label: "Systems of Equations",
        icon: "∑",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "probability-foundations",
        label: "Probability Foundations",
        icon: "∼",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "vectors-matrices",
        label: "Vectors & Matrices",
        icon: "⟨⟩",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "eigenvalues",
        label: "Eigenvalues & Eigenvectors",
        icon: "λ",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "svd-decompositions",
        label: "SVD & Decompositions",
        icon: "Σ",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "computing",
        label: "Computing",
        icon: "⚙",
        category: "Computing",
        ready: true,
    },
    {
        id: "python",
        label: "Python",
        icon: "🐍",
        category: "Programming",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "integral-calculus": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Areas, volumes, and the fundamental theorem of calculus",
    },
    "derivatives-gradients": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Derivatives, chain rule, gradients, and the mechanics of learning",
    },
    "systems-equations": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Gaussian elimination, determinants, and solving linear systems",
    },
    "probability-foundations": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Probability spaces, distributions, Bayes, and uncertainty",
    },
    "vectors-matrices": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Vectors, matrices, dot products, and transformations — the language of data",
    },
    eigenvalues: {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Eigenvalues, eigenvectors, and the geometry of linear maps",
    },
    "svd-decompositions": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Singular value decomposition and low-rank matrix approximations",
    },
    computing: {
        eyebrow: "Prerequisites · Computing",
        subtitle: "CPU vs GPU, vectorised operations, memory layout — the hardware story of deep learning",
    },
    python: {
        eyebrow: "Prerequisites · Programming",
        subtitle: "NumPy, PyTorch, Matplotlib — the scientific stack that runs every algorithm in this course",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
