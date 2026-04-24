import { DiagramBlock, pt } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function EigenvectorDiagram() {
    const cx = 148, cy = 112, s = 48
    const rx = 2 * s, ry = 1 * s

    const ev1x = cx + rx * Math.cos(-Math.PI / 4)
    const ev1y = cy + rx * Math.sin(-Math.PI / 4)
    const ev2x = cx + ry * Math.cos(Math.PI / 4)
    const ev2y = cy + ry * Math.sin(Math.PI / 4)

    const others = [
        { math: [1, 0], transformed: [1.5, 0.5] },
        { math: [0, 1], transformed: [0.5, 1.5] },
    ]
    const mp = pt(cx, cy, s)

    return (
        <svg viewBox="0 0 360 220" className="ch-diagram-svg">
            <defs>
                <marker id="eva" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#e8a838" /></marker>
                <marker id="evb" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#5a9ab9" /></marker>
                <marker id="evd" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#5ab98c" /></marker>
            </defs>
            <rect width="360" height="220" fill="#0f0f14" rx="4" />

            <circle cx={cx} cy={cy} r={s} fill="none" stroke="#252535" strokeWidth="1.5" strokeDasharray="5,4" />
            <text x={cx + s + 4} y={cy + 4} fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">unit circle</text>

            {others.map((o, i) => {
                const [bx, by_] = [mp(o.math[0], o.math[1]).x, mp(o.math[0], o.math[1]).y]
                const [ax, ay] = [mp(o.transformed[0], o.transformed[1]).x, mp(o.transformed[0], o.transformed[1]).y]
                return (
                    <g key={i}>
                        <line x1={cx} y1={cy} x2={bx} y2={by_} stroke="#252535" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#evb)" />
                        <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#5a9ab9" strokeWidth="2" markerEnd="url(#evb)" opacity="0.7" />
                    </g>
                )
            })}

            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(232,168,56,0.05)" stroke="#e8a838" strokeWidth="1.5" opacity="0.6"
                transform={`rotate(-45,${cx},${cy})`} />

            <line x1={cx} y1={cy} x2={ev1x} y2={ev1y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#eva)" />
            <line x1={cx} y1={cy} x2={2 * cx - ev1x} y2={2 * cy - ev1y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#eva)" opacity="0.4" />
            <line x1={cx} y1={cy} x2={ev2x} y2={ev2y} stroke="#5ab98c" strokeWidth="2.5" markerEnd="url(#evd)" />
            <line x1={cx} y1={cy} x2={2 * cx - ev2x} y2={2 * cy - ev2y} stroke="#5ab98c" strokeWidth="2.5" markerEnd="url(#evd)" opacity="0.4" />

            <text x={ev1x + 6} y={ev1y + 4} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">v₁</text>
            <text x={ev1x + 6} y={ev1y + 18} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace" opacity="0.75">λ₁ = 2</text>
            <text x={ev2x + 6} y={ev2y + 4} fill="#5ab98c" fontSize="6" fontFamily="JetBrains Mono,monospace">v₂</text>
            <text x={ev2x + 6} y={ev2y + 18} fill="#5ab98c" fontSize="5.5" fontFamily="JetBrains Mono,monospace" opacity="0.75">λ₂ = 1</text>

            <rect x="262" y="16" width="88" height="100" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="306" y="34" textAnchor="middle" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1.5">LEGEND</text>
            <line x1="270" y1="52" x2="295" y2="52" stroke="#e8a838" strokeWidth="2" markerEnd="url(#eva)" />
            <text x="300" y="56" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">eigenvec</text>
            <line x1="270" y1="72" x2="295" y2="72" stroke="#5ab98c" strokeWidth="2" markerEnd="url(#evd)" />
            <text x="300" y="76" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">eigenvec</text>
            <line x1="270" y1="92" x2="295" y2="92" stroke="#5a9ab9" strokeWidth="2" markerEnd="url(#evb)" opacity="0.7" />
            <text x="300" y="96" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">other vec</text>
            <text x="270" y="108" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">(rotates)</text>

            <text x="180" y="200" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">
                Eigenvectors only stretch — they never rotate
            </text>
        </svg>
    )
}

const COV_POINTS = [
    [-1.8, -1.2], [-1.5, -1.4], [-1.3, -0.9], [-1.0, -0.8], [-0.8, -1.1],
    [-0.6, -0.4], [-0.4, -0.6], [-0.2, -0.1], [0.1, 0.2], [0.3, 0.4],
    [0.5, 0.3], [0.7, 0.8], [0.9, 0.6], [1.1, 1.0], [1.3, 1.2],
    [1.5, 1.1], [-0.5, 0.5], [0.4, -0.3], [0.8, 1.3], [-0.9, 0.2],
]

export function CovarianceDiagram({ compact = false }: { compact?: boolean }) {
    const w = 340, h = compact ? 210 : 240
    const s = compact ? 38 : 44
    const cx = 168, cy = compact ? 112 : 118

    const rx = 1.55 * s, ry = 0.48 * s

    const v1x = cx + rx * Math.cos(-Math.PI / 4), v1y = cy + rx * Math.sin(-Math.PI / 4)
    const v2x = cx + ry * Math.cos(Math.PI / 4), v2y = cy + ry * Math.sin(Math.PI / 4)

    const p = pt(cx, cy, s)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="cva" markerWidth="3.5" markerHeight="3.5" refX="2.5" refY="1.75" orient="auto"><polygon points="0 0,3.5 1.75,0 3.5" fill="#e8a838" /></marker>
                <marker id="cvb" markerWidth="3.5" markerHeight="3.5" refX="2.5" refY="1.75" orient="auto"><polygon points="0 0,3.5 1.75,0 3.5" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <line x1={p(-2.5, 0).x} y1={cy} x2={p(2.5, 0).x} y2={cy} stroke="#1e1e2a" strokeWidth="1" />
            <line x1={cx} y1={p(0, 2.5).y} x2={cx} y2={p(0, -2.5).y} stroke="#1e1e2a" strokeWidth="1" />

            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(232,168,56,0.08)"
                stroke="#e8a838" strokeWidth="2" strokeDasharray="8,5"
                transform={`rotate(-45,${cx},${cy})`} />

            {COV_POINTS.map(([mx, my], i) => {
                const { x, y } = p(mx, my)
                return <circle key={i} cx={x} cy={y} r="3" fill="#5ab98c" opacity="0.8" />
            })}

            <line x1={cx} y1={cy} x2={v1x} y2={v1y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#cva)" />
            <line x1={cx} y1={cy} x2={v2x} y2={v2y} stroke="#5a9ab9" strokeWidth="2.5" markerEnd="url(#cvb)" />

            <text x={v1x + 5} y={v1y + 4} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace" fontWeight="600">PC₁  λ₁{'>'}λ₂</text>
            <text x={v2x + 5} y={v2y + 4} fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace" fontWeight="600">PC₂</text>

            {compact ? null : (
                <>
                    <text x="12" y={h - 28} fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">Eigenvectors of Σ = principal axes of the data cloud</text>
                    <text x="12" y={h - 12} fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">Eigenvalues = variance along each axis</text>
                </>
            )}
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
