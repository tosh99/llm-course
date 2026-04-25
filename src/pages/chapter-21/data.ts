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
        id: "vit",
        label: "Vision Transformers (ViT)",
        icon: "◈",
        category: "Transformers for Vision",
        ready: true,
    },
    {
        id: "patch-embeddings",
        label: "Patch Embeddings",
        icon: "⊞",
        category: "Transformers for Vision",
        ready: true,
    },
    {
        id: "deit",
        label: "DeiT",
        icon: "⚡",
        category: "Efficient ViT",
        ready: true,
    },
    {
        id: "vit-vs-cnn",
        label: "ViT vs CNN",
        icon: "⇌",
        category: "Analysis",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "vit": {
        eyebrow: "Chapter 21 · Transformers for Vision",
        subtitle:
            "Dosovitskiy et al.'s 2020 demonstration that a pure Transformer — no convolutions — can match CNNs on image classification at scale",
    },
    "patch-embeddings": {
        eyebrow: "Chapter 21 · Transformers for Vision",
        subtitle:
            "How images are divided into fixed-size patches and linearly projected into token sequences that Transformers can process",
    },
    "deit": {
        eyebrow: "Chapter 21 · Efficient ViT",
        subtitle:
            "Facebook AI's 2021 technique for training competitive Vision Transformers on ImageNet alone — without JFT-300M — through knowledge distillation",
    },
    "vit-vs-cnn": {
        eyebrow: "Chapter 21 · Analysis",
        subtitle:
            "A systematic comparison of inductive biases, data efficiency, scaling behavior, and practical trade-offs between CNNs and Vision Transformers",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
