// ── Helper components ─────────────────────────────────────────────────────────

export function CodeBlock({
    code,
    filename,
    lang = "python",
}: {
    code: string
    filename: string
    lang?: string
}) {
    return (
        <div className="ch6-code-wrap">
            <div className="ch6-code-header">
                <span className="ch6-code-dot" style={{ background: "#ff5f56" }} />
                <span className="ch6-code-dot" style={{ background: "#ffbd2e" }} />
                <span className="ch6-code-dot" style={{ background: "#27ca40" }} />
                <span className="ch6-code-filename">{filename}</span>
                <span className="ch6-code-lang">{lang}</span>
            </div>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    )
}

export function Analogy({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ch6-analogy">
            <div className="ch6-analogy-label">{label}</div>
            <div className="ch6-analogy-text">{children}</div>
        </div>
    )
}

export function DefBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="ch6-def-block">
            <div className="ch6-def-label">{label}</div>
            <p>{children}</p>
        </div>
    )
}

export function Callout({ children }: { children: React.ReactNode }) {
    return (
        <div className="ch6-callout">
            {children}
        </div>
    )
}

export function DiagramBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="ch6-diagram-block">
            <div className="ch6-diagram-title">{title}</div>
            {children}
        </div>
    )
}
