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
        id: "bert",
        label: "BERT",
        icon: "⇋",
        category: "Architecture",
        ready: true,
    },
    {
        id: "mlm",
        label: "Masked LM",
        icon: "◌",
        category: "Training",
        ready: true,
    },
    {
        id: "nsp",
        label: "Next Sentence",
        icon: "⇒",
        category: "Training",
        ready: true,
    },
    {
        id: "roberta",
        label: "RoBERTa",
        icon: "↻",
        category: "Improvements",
        ready: true,
    },
    {
        id: "encoder-only",
        label: "Encoder-Only",
        icon: "▦",
        category: "Family",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    bert: {
        eyebrow: "Chapter 19 · BERT",
        subtitle:
            "Bidirectional Encoder Representations from Transformers — the model that made context flow both ways",
    },
    mlm: {
        eyebrow: "Chapter 19 · Training",
        subtitle:
            "Masked Language Modeling — teaching a model to fill in the blanks by understanding all surrounding words",
    },
    nsp: {
        eyebrow: "Chapter 19 · Training",
        subtitle:
            "Next Sentence Prediction — learning discourse and logical coherence between sentence pairs",
    },
    roberta: {
        eyebrow: "Chapter 19 · Improvements",
        subtitle:
            "A Robustly Optimized BERT Pretraining Approach — removing NSP, training longer, and going bigger",
    },
    "encoder-only": {
        eyebrow: "Chapter 19 · Family",
        subtitle:
            "The encoder-only lineage — from BERT to DistilBERT, ALBERT, and ELECTRA",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
