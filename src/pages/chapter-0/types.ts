// ── Types ────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool" | "maths" | "python"
export type TopicId =
    | "vectors-matrices"
    | "systems-equations"
    | "eigenvalues"
    | "svd-decompositions"
    | "derivatives-gradients"
    | "integral-calculus"
    | "probability-foundations"
    | "statistical-inference"
    | "entropy-kl-divergence"
    | "mutual-information"
    | "python"
    | "computing"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
