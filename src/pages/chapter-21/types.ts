// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool"
export type TopicId =
    | "vit"
    | "patch-embeddings"
    | "deit"
    | "vit-vs-cnn"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
