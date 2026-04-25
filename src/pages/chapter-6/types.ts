// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python"
export type TopicId =
    | "simple-rnn"
    | "bptt"
    | "vanishing-gradient"
    | "lstm"
    | "bidirectional"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
