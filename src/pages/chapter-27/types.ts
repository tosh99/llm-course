// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool"
export type TopicId =
    | "rag"
    | "dense-passage-retrieval"
    | "vector-databases"
    | "chunking-reranking"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
