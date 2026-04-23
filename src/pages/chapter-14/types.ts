// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python" | "code"
export type TopicId =
    | "scaled-dot-product"
    | "multi-head"
    | "positional-encoding"
    | "encoder-decoder"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
