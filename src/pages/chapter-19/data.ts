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
        id: "gpt3",
        label: "GPT-3 (175B)",
        icon: "▦",
        category: "The Model",
        ready: true,
    },
    {
        id: "incontext",
        label: "In-Context Learning",
        icon: "⇄",
        category: "The Model",
        ready: true,
    },
    {
        id: "fewshot",
        label: "Zero / One / Few-Shot",
        icon: "⧉",
        category: "Paradigms",
        ready: true,
    },
    {
        id: "prompt",
        label: "Prompt Engineering",
        icon: "✎",
        category: "Paradigms",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    gpt3: {
        eyebrow: "Chapter 19 · The Model",
        subtitle:
            "A 175-billion-parameter autoregressive language model that demonstrated emergent few-shot capabilities at scale",
    },
    incontext: {
        eyebrow: "Chapter 19 · The Model",
        subtitle:
            "Learning from examples embedded directly in the prompt — no gradient updates required",
    },
    fewshot: {
        eyebrow: "Chapter 19 · Paradigms",
        subtitle:
            "The spectrum from zero-shot generalization to few-shot adaptation without parameter updates",
    },
    prompt: {
        eyebrow: "Chapter 19 · Paradigms",
        subtitle:
            "The art and science of crafting instructions and context to steer large language model behavior",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
