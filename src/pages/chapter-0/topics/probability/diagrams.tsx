import { DiagramBlock, pt } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function NormalDistributionDiagram() {
    const w = 360, h = 180
    const cx = 150, cy = 145, s = 55

    const p = pt(cx, cy, s)

    const gaussPoints: string[] = []
    for (let i = -30; i <= 30; i++) {
        const x = i / 10
        const y = Math.exp(-0.5 * x * x)
        const { x: px, y: py } = p(x, y)
        gaussPoints.push(`${px},${py}`)
    }

    const sigma1 = p(1, Math.exp(-0.5))
    const sigmaN1 = p(-1, Math.exp(-0.5))

    const areaPoints = `M${p(-1, 0).x},${p(-1, 0).y} `
        + gaussPoints.slice(10, 21).map(pt => `L${pt}`).join(" ")
        + ` L${sigma1.x},${sigma1.y + (cy - sigma1.y)} L${sigmaN1.x},${sigmaN1.y + (cy - sigmaN1.y)} Z`

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="nda" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#e8a838" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <line x1={p(-3, 0).x} y1={cy} x2={p(3, 0).x} y2={cy} stroke="#252535" strokeWidth="1.5" />
            <line x1={cx} y1={cy} x2={cx} y2={p(0, 1.1).y} stroke="#252535" strokeWidth="1" strokeDasharray="4,3" />

            <polygon points={areaPoints} fill="rgba(232,168,56,0.12)" />
            <polyline points={gaussPoints.join(" ")} fill="none" stroke="#e8a838" strokeWidth="2" />

            <line x1={sigmaN1.x} y1={sigmaN1.y} x2={sigmaN1.x} y2={cy} stroke="#e8a838" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
            <line x1={sigma1.x} y1={sigma1.y} x2={sigma1.x} y2={cy} stroke="#e8a838" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

            <circle cx={p(0, 1).x} cy={p(0, 1).y} r="3" fill="#5ab98c" />
            <text x={p(0, 1).x + 8} y={p(0, 1).y - 2} fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">μ</text>

            <text x={sigmaN1.x} y={cy + 14} fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace" textAnchor="middle">-σ</text>
            <text x={sigma1.x} y={cy + 14} fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace" textAnchor="middle">+σ</text>

            <text x={cx} y={cy + 10} fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace" textAnchor="middle">68.3%</text>

            <rect x="245" y="20" width="105" height="140" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="255" y="40" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">Normal (Gaussian)</text>
            <line x1="250" y1="50" x2="345" y2="50" stroke="#252535" strokeWidth="1" />
            <text x="255" y="68" fill="#cdc9c0" fontSize="4.5" fontFamily="JetBrains Mono,monospace">f(x) = (1/σ√2π)</text>
            <text x="255" y="82" fill="#cdc9c0" fontSize="4.5" fontFamily="JetBrains Mono,monospace">  · e^(-(x-μ)²/2σ²)</text>
            <line x1="250" y1="92" x2="345" y2="92" stroke="#252535" strokeWidth="1" />
            <text x="255" y="110" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">μ  = mean (centre)</text>
            <text x="255" y="126" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">σ  = spread</text>
            <line x1="250" y1="136" x2="345" y2="136" stroke="#252535" strokeWidth="1" />
            <text x="255" y="152" fill="#5ab98c" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Weight init: N(0,1)</text>
        </svg>
    )
}

export function BayesDiagram() {
    const w = 360, h = 200
    const cx = 140, cy = 100, s = 50
    const p = pt(cx, cy, s)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="bya" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#e8a838" /></marker>
                <marker id="byb" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="140" y="22" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">BAYES' THEOREM</text>

            <ellipse cx={p(-0.6, 0.4).x} cy={p(-0.6, 0.4).y} rx={52} ry={38}
                fill="rgba(232,168,56,0.12)" stroke="#e8a838" strokeWidth="1.5" />
            <ellipse cx={p(0.6, 0.4).x} cy={p(0.6, 0.4).y} rx={52} ry={38}
                fill="rgba(90,155,185,0.12)" stroke="#5a9ab9" strokeWidth="1.5" />

            <ellipse cx={p(0, 0.4).x} cy={p(0, 0.4).y} rx={22} ry={30}
                fill="rgba(155,127,199,0.15)" stroke="#9b7fc7" strokeWidth="1.5" />

            <text x={p(-1.2, 1.2).x} y={p(-1.2, 1.2).y} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">P(A)</text>
            <text x={p(1.2, 1.2).x} y={p(1.2, 1.2).y} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">P(B)</text>
            <text x={p(0, 1.2).x - 16} y={p(0, 1.2).y} fill="#9b7fc7" fontSize="5.5" fontFamily="JetBrains Mono,monospace">P(A∩B)</text>

            <rect x="228" y="35" width="122" height="150" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="238" y="55" fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">P(A|B) =</text>
            <text x="238" y="72" fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">  P(B|A)·P(A)</text>
            <text x="238" y="86" fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">  ──────────</text>
            <text x="238" y="100" fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">     P(B)</text>
            <line x1="233" y1="110" x2="348" y2="110" stroke="#252535" strokeWidth="1" />
            <text x="238" y="128" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">P(A|B) = posterior</text>
            <text x="238" y="144" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">P(B|A) = likelihood</text>
            <text x="238" y="160" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">P(A)  = prior</text>
            <text x="238" y="176" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">P(B)  = evidence</text>
        </svg>
    )
}

export function VarianceDiagram() {
    const w = 360, h = 180
    const cx = 150, cy = 100, s = 50
    const p = pt(cx, cy, s)

    const points = [
        [-1.8, 0.1], [-1.3, -0.15], [-0.8, 0.2], [-0.3, -0.1], [0.1, 0.15],
        [0.5, -0.05], [0.9, 0.1], [1.3, -0.2], [1.7, 0.05],
    ]
    const mean = points.reduce((s, pt) => s + pt[0], 0) / points.length

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="vda" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><polygon points="0 0,4 2,0 4" fill="#e8a838" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="150" y="20" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">VARIANCE & STANDARD DEVIATION</text>

            <line x1={p(-2.5, 0).x} y1={cy} x2={p(2.5, 0).x} y2={cy} stroke="#252535" strokeWidth="1.5" />

            <line x1={p(mean, 0).x} y1={cy - 30} x2={p(mean, 0).x} y2={cy + 20} stroke="#5ab98c" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={p(mean, 0).x} y={cy + 32} textAnchor="middle" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">μ (mean)</text>

            {points.map(([mx], i) => {
                const pp = p(mx, 0)
                const pm = p(mean, 0)
                return (
                    <g key={i}>
                        <circle cx={pp.x} cy={cy - 8 - i * 4} r="3.5" fill="#e8a838" opacity="0.8" />
                        <line x1={pp.x} y1={cy - 8 - i * 4} x2={pm.x} y2={cy - 8 - i * 4}
                            stroke="#e8a838" strokeWidth="1" opacity="0.3" strokeDasharray="3,2" />
                    </g>
                )
            })}

            <rect x="245" y="35" width="105" height="130" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="255" y="55" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">Variance</text>
            <text x="255" y="72" fill="#cdc9c0" fontSize="4.5" fontFamily="JetBrains Mono,monospace">σ² = Σ(xᵢ-μ)²/n</text>
            <line x1="250" y1="82" x2="345" y2="82" stroke="#252535" strokeWidth="1" />
            <text x="255" y="100" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">Std Deviation</text>
            <text x="255" y="117" fill="#cdc9c0" fontSize="4.5" fontFamily="JetBrains Mono,monospace">σ = √(σ²)</text>
            <line x1="250" y1="127" x2="345" y2="127" stroke="#252535" strokeWidth="1" />
            <text x="255" y="145" fill="#5ab98c" fontSize="4.5" fontFamily="JetBrains Mono,monospace">ML: measures how</text>
            <text x="255" y="160" fill="#5ab98c" fontSize="4.5" fontFamily="JetBrains Mono,monospace">spread predictions are</text>
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
