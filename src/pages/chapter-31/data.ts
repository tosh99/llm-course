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
        id: "llama",
        label: "LLaMA",
        icon: "◈",
        category: "Open Models",
        ready: true,
    },
    {
        id: "mistral",
        label: "Mistral 7B",
        icon: "▤",
        category: "Open Models",
        ready: true,
    },
    {
        id: "lora",
        label: "LoRA",
        icon: "★",
        category: "Efficiency",
        ready: true,
    },
    {
        id: "qlora",
        label: "QLoRA",
        icon: "↯",
        category: "Efficiency",
        ready: true,
    },
    {
        id: "quantization",
        label: "Quantization",
        icon: "⚖",
        category: "Efficiency",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    llama: {
        eyebrow: "Chapter 31 · Open Models",
        subtitle:
            "Meta's open release of large language models that sparked the open-source LLM revolution",
    },
    mistral: {
        eyebrow: "Chapter 31 · Open Models",
        subtitle:
            "A compact 7B model that punched above its weight with sparse attention and sliding windows",
    },
    lora: {
        eyebrow: "Chapter 31 · Efficiency",
        subtitle:
            "Low-Rank Adaptation — fine-tuning billion-parameter models with trainable matrices smaller than a thumbnail",
    },
    qlora: {
        eyebrow: "Chapter 31 · Efficiency",
        subtitle:
            "Quantized LoRA — fitting 65B model fine-tuning on a single consumer GPU",
    },
    quantization: {
        eyebrow: "Chapter 31 · Efficiency",
        subtitle:
            "Shrinking model weights from 32-bit floats to 4-bit integers without catastrophic collapse",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
