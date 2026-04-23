// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python" | "code"
export type TopicId =
    | "word2vec"
    | "glove"
    | "fasttext"
    | "embeddings"
    | "language-modeling"
    | "perplexity"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
