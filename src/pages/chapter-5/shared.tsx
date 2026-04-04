import { useEffect, useRef } from "react"
import hljs from "highlight.js/lib/core"
import typescript from "highlight.js/lib/languages/typescript"
import python from "highlight.js/lib/languages/python"

hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("python", python)

// ── Helper components ─────────────────────────────────────────────────────────

export function MathBlock({ tex }: { tex: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return
        ref.current.textContent = `$$${tex}$$`
        if (window.renderMathInElement) {
            window.renderMathInElement(ref.current, {
                delimiters: [{ left: "$$", right: "$$", display: true }],
                throwOnError: false,
            })
        }
    }, [tex])

    return <div className="ch5-math-block" ref={ref} />
}

export function InlineMath({ tex }: { tex: string }) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (!ref.current) return
        ref.current.textContent = `$${tex}$`
        if (window.renderMathInElement) {
            window.renderMathInElement(ref.current, {
                delimiters: [{ left: "$", right: "$", display: false }],
                throwOnError: false,
            })
        }
    }, [tex])

    return <span ref={ref} />
}

export function CodeBlock({
    code,
    filename,
    lang = "typescript",
    langLabel,
}: {
    code: string
    filename: string
    lang?: string
    langLabel?: string
}) {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (ref.current) {
            delete ref.current.dataset.highlighted
            ref.current.removeAttribute("data-highlighted")
            ref.current.textContent = code
            hljs.highlightElement(ref.current)
        }
    }, [code, lang])

    return (
        <div className="ch5-code-wrap">
            <div className="ch5-code-header">
                <span className="ch5-code-dot" style={{ background: "#b95a5a" }} />
                <span className="ch5-code-dot" style={{ background: "#e8a838" }} />
                <span className="ch5-code-dot" style={{ background: "#5ab98c" }} />
                <span className="ch5-code-filename">{filename}</span>
                <span className="ch5-code-lang">{langLabel ?? lang}</span>
            </div>
            <pre>
                <code ref={ref} className={`language-${lang}`}>
                    {code}
                </code>
            </pre>
        </div>
    )
}

export function Analogy({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ch5-analogy">
            <div className="ch5-analogy-label">{label}</div>
            <div className="ch5-analogy-text">{children}</div>
        </div>
    )
}

export function DefBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ch5-def-block">
            <div className="ch5-def-label">{label}</div>
            <p>{children}</p>
        </div>
    )
}

export function DiagramBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="ch5-diagram-block">
            <div className="ch5-diagram-title">{title}</div>
            {children}
        </div>
    )
}

/** Maps math coords (y-up) → SVG pixel coords (y-down) */
export function pt(cx: number, cy: number, s: number) {
    return (mx: number, my: number) => ({ x: cx + mx * s, y: cy - my * s })
}
