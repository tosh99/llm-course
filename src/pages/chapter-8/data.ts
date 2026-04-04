import type { TabId } from "./types"

// ── Topics Data ──────────────────────────────────────────────────────────────

export interface TopicMeta {
    id: string
    label: string
    icon: string
    category: string
    eyebrow: string
    subtitle: string
    ready: boolean
}

export const TOPICS: TopicMeta[] = [
    { id: "alexnet", label: "AlexNet", icon: "🎯", category: "Breakthrough Architectures", eyebrow: "2012 · ImageNet Winner", subtitle: "The deep learning revolution begins", ready: true },
    { id: "vggnet", label: "VGGNet", icon: "📚", category: "Breakthrough Architectures", eyebrow: "2014 · Simplicity", subtitle: "Depth through repetition", ready: true },
    { id: "googlenet", label: "GoogLeNet", icon: "🔬", category: "Efficiency", eyebrow: "2014 · Inception", subtitle: "Multi-scale processing", ready: true },
    { id: "resnet", label: "ResNet", icon: "⛓️", category: "Efficiency", eyebrow: "2015 · Residual Learning", subtitle: "Skip connections enable 152+ layers", ready: true },
    { id: "densenet", label: "DenseNet", icon: "🕸️", category: "Advanced Architectures", eyebrow: "2017 · Dense Connections", subtitle: "Extreme feature reuse", ready: true },
]

export const TOPIC_META: Record<string, { eyebrow: string; subtitle: string }> = {
    alexnet: {
        eyebrow: "2012 · ImageNet Winner",
        subtitle: "The deep learning revolution begins",
    },
    vggnet: {
        eyebrow: "2014 · Simplicity",
        subtitle: "Depth through repetition",
    },
    googlenet: {
        eyebrow: "2014 · Inception",
        subtitle: "Multi-scale processing",
    },
    resnet: {
        eyebrow: "2015 · Residual Learning",
        subtitle: "Skip connections enable 152+ layers",
    },
    densenet: {
        eyebrow: "2017 · Dense Connections",
        subtitle: "Extreme feature reuse",
    },
}

export const TABS: { id: TabId; label: string }[] = [
    { id: "history", label: "History" },
    { id: "kid", label: "Kid Explanation" },
    { id: "highschool", label: "High School" },
    { id: "maths", label: "Maths" },
    { id: "python", label: "Python / NumPy" },
    { id: "code", label: "TypeScript" },
]
