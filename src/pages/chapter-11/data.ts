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
        id: "seq2seq",
        label: "Sequence-to-Sequence",
        icon: "⇌",
        category: "Architecture",
        ready: true,
    },
    {
        id: "lstm-encoder-decoder",
        label: "LSTM Encoder-Decoder",
        icon: "⧖",
        category: "Architecture",
        ready: true,
    },
    {
        id: "machine-translation",
        label: "Machine Translation",
        icon: "◈",
        category: "Application",
        ready: true,
    },
    {
        id: "teacher-forcing",
        label: "Teacher Forcing",
        icon: "↵",
        category: "Training",
        ready: true,
    },
    {
        id: "evaluation-metrics",
        label: "BLEU / ROUGE",
        icon: "★",
        category: "Evaluation",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    seq2seq: {
        eyebrow: "Chapter 11 · Architecture",
        subtitle:
            "The 2014 breakthrough: mapping any-length input sequences to any-length output sequences",
    },
    "lstm-encoder-decoder": {
        eyebrow: "Chapter 11 · Architecture",
        subtitle:
            "LSTM cells as the encoder–decoder backbone — and Sutskever's source-reversal trick",
    },
    "machine-translation": {
        eyebrow: "Chapter 11 · Application",
        subtitle:
            "The task that drove seq2seq — and where neural MT first surpassed statistical baselines",
    },
    "teacher-forcing": {
        eyebrow: "Chapter 11 · Training",
        subtitle:
            "Feeding ground truth inputs during training and managing the resulting exposure bias",
    },
    "evaluation-metrics": {
        eyebrow: "Chapter 11 · Evaluation",
        subtitle:
            "Automatic n-gram metrics for machine translation and summarization — and their modern successors",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Sample Code" },
]
