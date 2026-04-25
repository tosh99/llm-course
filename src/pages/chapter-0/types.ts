// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python"
export type TopicId =
    | "integral-calculus"
    | "derivatives-gradients"
    | "systems-equations"
    | "probability-foundations"
    | "vectors-matrices"
    | "eigenvalues"
    | "svd-decompositions"
    | "computing"
    | "python"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
