// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool"
export type TopicId =
    | "chain-of-thought"
    | "self-consistency"
    | "tree-of-thoughts"
    | "process-rewards"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
