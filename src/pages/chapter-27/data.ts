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
        id: "rag",
        label: "RAG",
        icon: "⟳",
        category: "Architecture",
        ready: true,
    },
    {
        id: "dense-passage-retrieval",
        label: "Dense Passage Retrieval",
        icon: "⊡",
        category: "Retrieval",
        ready: true,
    },
    {
        id: "vector-databases",
        label: "Vector Databases",
        icon: "∷",
        category: "Infrastructure",
        ready: true,
    },
    {
        id: "chunking-reranking",
        label: "Chunking & Re-ranking",
        icon: "≋",
        category: "Infrastructure",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    "rag": {
        eyebrow: "Chapter 27 · Architecture",
        subtitle:
            "Lewis et al.'s 2020 framework that combines a neural retriever with a generative language model — grounding generation in external knowledge",
    },
    "dense-passage-retrieval": {
        eyebrow: "Chapter 27 · Retrieval",
        subtitle:
            "Karpukhin et al.'s 2020 bi-encoder model that learns dense vector representations for retrieval, outperforming BM25 on open-domain QA",
    },
    "vector-databases": {
        eyebrow: "Chapter 27 · Infrastructure",
        subtitle:
            "Approximate nearest-neighbor search systems — FAISS, Pinecone, Weaviate, Chroma — that make billion-scale embedding retrieval fast and practical",
    },
    "chunking-reranking": {
        eyebrow: "Chapter 27 · Infrastructure",
        subtitle:
            "The engineering decisions that determine RAG quality: how to split documents, how to embed chunks, and how to re-rank retrieved passages before generation",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
