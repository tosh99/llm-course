// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python" | "code"

export type TopicId =
    | "introduction"
    | "weight-sharing"
    | "lenet"
    | "building-blocks"
    | "feature-hierarchies"
    | "why-cnns-stalled"

export interface Section {
    key: TopicId
    label: string
    icon: string
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
