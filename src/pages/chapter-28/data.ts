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
        id: "rope",
        label: "RoPE",
        icon: "↻",
        category: "Positional Encoding",
        ready: true,
    },
    {
        id: "flash-attention",
        label: "Flash Attention",
        icon: "⚡",
        category: "Attention Efficiency",
        ready: true,
    },
    {
        id: "gqa-mqa",
        label: "GQA / MQA",
        icon: "⊳",
        category: "Attention Efficiency",
        ready: true,
    },
    {
        id: "mixture-of-experts",
        label: "Mixture of Experts",
        icon: "⊛",
        category: "Architecture",
        ready: true,
    },
    {
        id: "kv-cache",
        label: "KV Cache",
        icon: "▣",
        category: "Inference",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "rope": {
        eyebrow: "Chapter 28 · Positional Encoding",
        subtitle:
            "Su et al.'s 2021 Rotary Position Embedding — encoding position by rotating query and key vectors rather than adding fixed vectors to embeddings",
    },
    "flash-attention": {
        eyebrow: "Chapter 28 · Attention Efficiency",
        subtitle:
            "Dao et al.'s 2022 IO-aware exact attention algorithm that reduces memory from O(N²) to O(N) and runs 2–4× faster by tiling computation to fit GPU SRAM",
    },
    "gqa-mqa": {
        eyebrow: "Chapter 28 · Attention Efficiency",
        subtitle:
            "Grouped-Query and Multi-Query Attention — reducing the number of key-value heads to cut memory bandwidth and KV cache size without sacrificing output quality",
    },
    "mixture-of-experts": {
        eyebrow: "Chapter 28 · Architecture",
        subtitle:
            "Sparsely-gated Transformer layers that activate only a subset of expert FFN networks per token — enabling very large models at constant inference compute",
    },
    "kv-cache": {
        eyebrow: "Chapter 28 · Inference",
        subtitle:
            "Caching the key and value matrices from previous tokens to avoid redundant recomputation during autoregressive generation — the critical optimization enabling practical LLM inference",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
