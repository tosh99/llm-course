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
        id: "clip",
        label: "CLIP",
        icon: "⊗",
        category: "Vision-Language",
        ready: true,
    },
    {
        id: "dall-e",
        label: "DALL-E",
        icon: "◧",
        category: "Vision-Language",
        ready: true,
    },
    {
        id: "flamingo",
        label: "Flamingo",
        icon: "◈",
        category: "Vision-Language",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "clip": {
        eyebrow: "Chapter 26 · Vision-Language",
        subtitle:
            "Radford et al.'s 2021 contrastive pretraining of image and text encoders on 400M image-text pairs — enabling zero-shot transfer to any visual classification task",
    },
    "dall-e": {
        eyebrow: "Chapter 26 · Vision-Language",
        subtitle:
            "OpenAI's 2021 autoregressive image generation model that combined a dVAE image tokenizer with a Transformer trained on text-image pairs",
    },
    "flamingo": {
        eyebrow: "Chapter 26 · Vision-Language",
        subtitle:
            "DeepMind's 2022 few-shot multimodal model that bridged a frozen vision encoder and a frozen language model through cross-attention layers",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
