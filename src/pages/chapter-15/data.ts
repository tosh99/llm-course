import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "ulmfit",            label: "ULMFiT",                icon: "↻", category: "Transfer Learning", ready: true },
    { id: "elmo",              label: "ELMo",                  icon: "⇄", category: "Transfer Learning", ready: true },
    { id: "gpt1",              label: "GPT-1",                 icon: "▦", category: "Pre-training",      ready: true },
    { id: "pretrain-finetune", label: "Pre-train → Fine-tune", icon: "⧉", category: "Pre-training",      ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    ulmfit: {
        eyebrow: "Chapter 15 · Transfer Learning",
        subtitle: "Universal Language Model Fine-tuning — a disciplined three-stage recipe for adapting LMs to any NLP task",
    },
    elmo: {
        eyebrow: "Chapter 15 · Transfer Learning",
        subtitle: "Deep contextualized word representations that change meaning based on surrounding context",
    },
    gpt1: {
        eyebrow: "Chapter 15 · Pre-training",
        subtitle: "Generative pre-training with unsupervised multi-task learning — the decoder-only revolution begins",
    },
    "pretrain-finetune": {
        eyebrow: "Chapter 15 · Pre-training",
        subtitle: "The paradigm shift: train once on massive unlabeled data, then adapt to any downstream task",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history",    label: "History" },
    { id: "kid",        label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths",      label: "Maths" },
    { id: "python",     label: "Python / NumPy" },
    { id: "code",       label: "TypeScript" },
]
