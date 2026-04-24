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
        id: "instructgpt",
        label: "InstructGPT",
        icon: "◈",
        category: "Alignment",
        ready: true,
    },
    { id: "sft", label: "SFT", icon: "▤", category: "Alignment", ready: true },
    {
        id: "reward-model",
        label: "Reward Model",
        icon: "★",
        category: "RLHF",
        ready: true,
    },
    { id: "ppo", label: "PPO", icon: "↯", category: "RLHF", ready: true },
    {
        id: "constitutional-ai",
        label: "Constitutional AI",
        icon: "⚖",
        category: "Safety",
        ready: true,
    },
]

export const TOPIC_META: Record<
    TopicId,
    { eyebrow: string; subtitle: string }
> = {
    instructgpt: {
        eyebrow: "Chapter 20 · Alignment",
        subtitle:
            "Training language models to follow instructions with human feedback — the InstructGPT recipe",
    },
    sft: {
        eyebrow: "Chapter 20 · Alignment",
        subtitle:
            "Supervised Fine-Tuning — teaching the model the shape of helpful, honest, harmless responses",
    },
    "reward-model": {
        eyebrow: "Chapter 20 · RLHF",
        subtitle:
            "Learning to rank model outputs by training a reward model on human preferences",
    },
    ppo: {
        eyebrow: "Chapter 20 · RLHF",
        subtitle:
            "Proximal Policy Optimization — stabilizing reinforcement learning for language model updates",
    },
    "constitutional-ai": {
        eyebrow: "Chapter 20 · Safety",
        subtitle:
            "Self-supervised alignment through constitutional principles and AI feedback",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
]
