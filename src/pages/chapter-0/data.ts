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
        id: "statistical-inference",
        label: "Statistical Inference",
        icon: "σ",
        category: "Mathematics",
        ready: true,
    },
    {
        id: "entropy-kl-divergence",
        label: "Entropy & KL Divergence",
        icon: "ℍ",
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
        id: "mutual-information",
        label: "Mutual Information",
        icon: "I",
        category: "Mathematics",
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
    "vectors-matrices": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Vectors, matrices, dot products, and transformations — the language of data",
    },
    "systems-equations": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Gaussian elimination, determinants, and solving linear systems",
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
    "derivatives-gradients": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Derivatives, chain rule, gradients, and the mechanics of learning",
    },
    "integral-calculus": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Areas, volumes, and the fundamental theorem of calculus",
    },
    "probability-foundations": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle: "Probability spaces, distributions, Bayes, and uncertainty",
    },
    "statistical-inference": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Estimation, hypothesis testing, and connecting statistics to ML",
    },
    "entropy-kl-divergence": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Entropy, cross-entropy, KL divergence, and measuring distributional distance",
    },
    "mutual-information": {
        eyebrow: "Prerequisites · Mathematics",
        subtitle:
            "Shared information, channel capacity, and applications in ML",
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

]
