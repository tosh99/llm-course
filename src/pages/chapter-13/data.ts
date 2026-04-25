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
        id: "word2vec",
        label: "Word2Vec",
        icon: "⊙",
        category: "Word Representations",
        ready: true,
    },
    {
        id: "glove",
        label: "GloVe",
        icon: "⋯",
        category: "Word Representations",
        ready: true,
    },
    {
        id: "fasttext",
        label: "FastText",
        icon: "⊂",
        category: "Word Representations",
        ready: true,
    },
    {
        id: "embeddings",
        label: "Geometry of Meaning",
        icon: "↗",
        category: "Geometry of Meaning",
        ready: true,
    },
    {
        id: "language-modeling",
        label: "Language Modeling",
        icon: "→",
        category: "Language Models",
        ready: true,
    },
    {
        id: "perplexity",
        label: "Perplexity",
        icon: "?",
        category: "Evaluation",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    word2vec: {
        eyebrow: "Chapter 13 · Word Representations",
        subtitle:
            "Skip-gram and CBOW — learning dense word vectors from distributional context at scale",
    },
    glove: {
        eyebrow: "Chapter 13 · Word Representations",
        subtitle:
            "Global co-occurrence statistics meet local context — the Stanford approach to word vectors",
    },
    fasttext: {
        eyebrow: "Chapter 13 · Word Representations",
        subtitle:
            "Subword character n-grams — representations for morphologically rich languages and OOV words",
    },
    embeddings: {
        eyebrow: "Chapter 13 · Geometry of Meaning",
        subtitle:
            "Analogy arithmetic, semantic subspaces, and the geometry of learned representation spaces",
    },
    "language-modeling": {
        eyebrow: "Chapter 13 · Language Models",
        subtitle:
            "Predicting the next word — the objective that unifies RNNs, Transformers, and GPT",
    },
    perplexity: {
        eyebrow: "Chapter 13 · Evaluation",
        subtitle:
            "Measuring how surprised a language model is by real text — the standard metric for LM benchmarking",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
