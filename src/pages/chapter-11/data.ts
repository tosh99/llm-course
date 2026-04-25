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
        id: "variational-autoencoders",
        label: "Variational Autoencoders",
        icon: "λ",
        category: "Latent Variable Models",
        ready: true,
    },
    {
        id: "gans",
        label: "Generative Adversarial Networks",
        icon: "⚔",
        category: "Adversarial Training",
        ready: true,
    },
    {
        id: "conditional-gans",
        label: "Conditional GANs",
        icon: "≡",
        category: "Adversarial Training",
        ready: true,
    },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    "variational-autoencoders": {
        eyebrow: "Chapter 11 · Latent Variable Models",
        subtitle:
            "Learn a structured latent space that enables smooth interpolation and generation",
    },
    gans: {
        eyebrow: "Chapter 11 · Adversarial Training",
        subtitle:
            "Train a generator and discriminator in a minimax game to produce realistic samples",
    },
    "conditional-gans": {
        eyebrow: "Chapter 11 · Adversarial Training",
        subtitle:
            "Guide generation by conditioning on class labels, sketches, or segmentation maps",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
