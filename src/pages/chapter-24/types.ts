// ── Types ─────────────────────────────────────────────────────────────────────

export type TabId = "history" | "kid" | "highschool"
export type TopicId =
    | "emergent-abilities"
    | "chinchilla-scaling"
    | "phase-transitions"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderMathInElement?: (el: HTMLElement, opts: any) => void
    }
}
