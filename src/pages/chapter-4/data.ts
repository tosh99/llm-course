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
        id: "backpropagation",
        label: "Backpropagation",
        icon: "⇄",
        category: "Core Algorithm",
        ready: true,
    },
    {
        id: "mlp",
        label: "Multi-layer Perceptrons",
        icon: "◎",
        category: "Architecture",
        ready: true,
    },
    {
        id: "activation-functions",
        label: "Activation Functions",
        icon: "∿",
        category: "Architecture",
        ready: true,
    },
    {
        id: "gradient-descent",
        label: "Gradient Descent",
        icon: "∇",
        category: "Training",
        ready: true,
    },
    {
        id: "vanishing-gradients",
        label: "Vanishing / Exploding Gradients",
        icon: "↘",
        category: "Training",
        ready: true,
    },
    {
        id: "autoencoders",
        label: "Autoencoders",
        icon: "⊃",
        category: "Application",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    backpropagation: {
        eyebrow: "Chapter 4 · Core Algorithm",
        subtitle:
            "The chain rule of calculus applied recursively — how networks actually learn",
    },
    mlp: {
        eyebrow: "Chapter 4 · Architecture",
        subtitle: "Stacking hidden layers to break the perceptron's limits",
    },
    "activation-functions": {
        eyebrow: "Chapter 4 · Architecture",
        subtitle:
            "Sigmoid, tanh, and why non-linearity is the soul of deep networks",
    },
    "gradient-descent": {
        eyebrow: "Chapter 4 · Training",
        subtitle:
            "Batch, stochastic, and mini-batch — three ways to follow the slope downhill",
    },
    "vanishing-gradients": {
        eyebrow: "Chapter 4 · Training",
        subtitle:
            "The training instability that stalled deep networks for two decades",
    },
    autoencoders: {
        eyebrow: "Chapter 4 · Application",
        subtitle:
            "Train an MLP to compress and reconstruct its input — unsupervised representation learning",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Sample Code" },
]
