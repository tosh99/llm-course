// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python"
export type TopicId =
    | "seq2seq"
    | "gru"
    | "lstm-encoder-decoder"
    | "machine-translation"
    | "teacher-forcing"
    | "evaluation-metrics"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
