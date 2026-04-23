import type { TabId, TopicId } from "./types"

// ── Data ─────────────────────────────────────────────────────────────────────

export const TOPICS: { id: TopicId; label: string; icon: string; category: string; ready: boolean }[] = [
    { id: "gpt2",         label: "GPT-2",         icon: "▦", category: "Scaling Up",      ready: true },
    { id: "scaling-laws", label: "Scaling Laws",  icon: "↗", category: "Scaling Up",      ready: true },
    { id: "t5",           label: "T5",            icon: "⇄", category: "Text-to-Text",    ready: true },
    { id: "zero-shot",    label: "Zero-Shot",     icon: "◉", category: "Capabilities",    ready: true },
]

export const TOPIC_META: Record<TopicId, { eyebrow: string; subtitle: string }> = {
    gpt2: {
        eyebrow: "Chapter 17 · Scaling Up",
        subtitle: "1.5 billion parameters, zero-shot task performance, and the beginning of the scaling era",
    },
    "scaling-laws": {
        eyebrow: "Chapter 17 · Scaling Up",
        subtitle: "Predictable power laws that govern how loss improves with model size, data, and compute",
    },
    t5: {
        eyebrow: "Chapter 17 · Text-to-Text",
        subtitle: "A unified encoder-decoder framework that casts every NLP task as text-to-text translation",
    },
    "zero-shot": {
        eyebrow: "Chapter 17 · Capabilities",
        subtitle: "Emergent ability to perform tasks without any task-specific training or gradient updates",
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
