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
        id: "lora",
        label: "LoRA",
        icon: "△",
        category: "Parameter-Efficient Fine-Tuning",
        ready: true,
    },
    {
        id: "adapter-layers",
        label: "Adapter Layers",
        icon: "⊕",
        category: "Parameter-Efficient Fine-Tuning",
        ready: true,
    },
    {
        id: "peft-taxonomy",
        label: "PEFT Taxonomy",
        icon: "⊚",
        category: "Landscape",
        ready: true,
    },
    {
        id: "prompt-tuning",
        label: "Prompt Tuning",
        icon: "✎",
        category: "Landscape",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "lora": {
        eyebrow: "Chapter 23 · Parameter-Efficient Fine-Tuning",
        subtitle:
            "Hu et al.'s 2021 insight that large weight updates during fine-tuning lie in a low-rank subspace — enabling adaptation with as little as 0.1% of a model's parameters",
    },
    "adapter-layers": {
        eyebrow: "Chapter 23 · Parameter-Efficient Fine-Tuning",
        subtitle:
            "Small bottleneck modules inserted into frozen Transformer layers — the 2019 precursor that showed PEFT was viable at task performance parity with full fine-tuning",
    },
    "peft-taxonomy": {
        eyebrow: "Chapter 23 · Landscape",
        subtitle:
            "A structured map of the parameter-efficient fine-tuning landscape: additive, selective, reparameterization-based, and hybrid methods",
    },
    "prompt-tuning": {
        eyebrow: "Chapter 23 · Landscape",
        subtitle:
            "Learning a small set of continuous prompt embeddings prepended to the input — adapting a frozen model through gradient updates to the prompt alone",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
