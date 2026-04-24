import { DiagramBlock } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function EntropyDiagram() {
    const w = 360, h = 220
    const cx = 180, cy = 110

    const fair = [
        { x: 0.2, h: 0.2 },
        { x: 0.4, h: 0.4 },
        { x: 0.6, h: 0.6 },
        { x: 0.8, h: 0.8 },
        { x: 1.0, h: 1.0 },
    ]

    const biased = [
        { x: 0.1, h: 0.9 },
        { x: 0.3, h: 0.9 },
        { x: 0.5, h: 0.9 },
        { x: 0.7, h: 0.9 },
        { x: 0.9, h: 0.9 },
    ]

    const maxBarH = 80

    const barW = 22
    const gap = 8

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="ita" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#e8a838" /></marker>
                <marker id="itb" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x={cx} y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">
                Shannon entropy H(X) = −Σ pᵢ log₂ pᵢ
            </text>

            {/* fair distribution label */}
            <text x="52" y="36" textAnchor="middle" fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Fair coin</text>
            <text x="52" y="48" textAnchor="middle" fill="#7a7a90" fontSize="4.5" fontFamily="JetBrains Mono,monospace">p=0.5, 0.5</text>
            <text x="52" y="60" textAnchor="middle" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">H = 1 bit</text>

            {/* biased distribution label */}
            <text x="308" y="36" textAnchor="middle" fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Biased coin</text>
            <text x="308" y="48" textAnchor="middle" fill="#7a7a90" fontSize="4.5" fontFamily="JetBrains Mono,monospace">p=0.9, 0.1</text>
            <text x="308" y="60" textAnchor="middle" fill="#b95a5a" fontSize="5" fontFamily="JetBrains Mono,monospace">H ≈ 0.47 bits</text>

            {/* fair bars */}
            {fair.map((b, i) => {
                const bx = 14 + i * (barW + gap)
                const bh = b.h * maxBarH
                const by = cy - bh / 2
                const byLabel = cy - bh / 2 - 5
                return (
                    <g key={`f-${i}`}>
                        <rect x={bx} y={by} width={barW} height={bh} fill="#e8a83818" stroke="#e8a83840" strokeWidth="1" rx="1" />
                        <text x={bx + barW / 2} y={byLabel} textAnchor="middle" fill="#e8a838" fontSize="4.5" fontFamily="JetBrains Mono,monospace">
                            {(b.h).toFixed(1)}
                        </text>
                    </g>
                )
            })}

            {/* baseline */}
            <line x1="10" y1={cy} x2="148" y2={cy} stroke="#252535" strokeWidth="1" strokeDasharray="4,4" />

            {/* biased bars */}
            {biased.map((b, i) => {
                const bx = 202 + i * (barW + gap)
                const bh = b.h * maxBarH
                const by = cy - bh / 2
                const byLabel = cy - bh / 2 - 5
                return (
                    <g key={`b-${i}`}>
                        <rect x={bx} y={by} width={barW} height={bh} fill="#5a9ab918" stroke="#5a9ab940" strokeWidth="1" rx="1" />
                        <text x={bx + barW / 2} y={byLabel} textAnchor="middle" fill="#5a9ab9" fontSize="4.5" fontFamily="JetBrains Mono,monospace">
                            {(b.h).toFixed(1)}
                        </text>
                    </g>
                )
            })}

            {/* baseline */}
            <line x1="198" y1={cy} x2="336" y2={cy} stroke="#252535" strokeWidth="1" strokeDasharray="4,4" />

            {/* annotation */}
            <line x1="150" y1="85" x2="178" y2="65" stroke="#3a3a50" strokeWidth="1" />
            <text x="100" y="92" fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">
                spread out → max entropy
            </text>
            <line x1="210" y1="85" x2="182" y2="65" stroke="#3a3a50" strokeWidth="1" />
            <text x="212" y="92" fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">
                peaked → low entropy
            </text>

            {/* arrow between */}
            <line x1="158" y1={h - 28} x2="202" y2={h - 28} stroke="#3a3a50" strokeWidth="1.5" markerEnd="url(#ita)" />
            <text x={cx} y={h - 14} textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">
                Information gain when surprise is highest
            </text>
        </svg>
    )
}

export function KLDiagram() {
    const w = 360, h = 200
    const cx = 180, cy = 100

    const xs = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]
    const sigma = 0.9

    const gauss = (x: number) => Math.exp(-(x ** 2) / (2 * sigma ** 2)) / (sigma * Math.sqrt(2 * Math.PI))
    const biased = (x: number) => Math.exp(-(x ** 2) / (2 * (sigma * 1.8) ** 2)) / (sigma * 1.8 * Math.sqrt(2 * Math.PI))

    const maxH = Math.max(...xs.map(gauss))
    const scale = 60

    const toY = (v: number) => cy - v * scale
    const toX = (x: number) => cx + x * scale * 1.4

    const ptsP = xs.map((x) => ({ x: toX(x), y: toY(gauss(x) / maxH * 0.9) }))
    const ptsQ = xs.map((x) => ({ x: toX(x), y: toY(biased(x) / maxH * 0.9) }))

    const toPath = (pts: { x: number; y: number }[]) =>
        "M" + pts.map((pt) => `${pt.x},${pt.y}`).join(" L")

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="kla" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#e8a838" /></marker>
                <marker id="klb" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x={cx} y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">
                KL(P‖Q) = Σ P(x) · log(P(x)/Q(x))  — how much P "loses" when approximated by Q
            </text>

            <line x1="12" y1={cy} x2={w - 12} y2={cy} stroke="#252535" strokeWidth="1" />

            <path d={toPath(ptsP)} fill="none" stroke="#e8a838" strokeWidth="2" />
            <path d={toPath(ptsQ)} fill="none" stroke="#5a9ab9" strokeWidth="2" strokeDasharray="6,4" />

            {/* shade region */}
            {xs.map((x, i) => {
                if (i === xs.length - 1) return null
                const x1 = toX(x), x2 = toX(xs[i + 1])
                const yp1 = ptsP[i].y, yp2 = ptsP[i + 1].y
                const yq1 = ptsQ[i].y, yq2 = ptsQ[i + 1].y
                const lo = Math.max(yp1, yp2, yq1, yq2)
                const hi = Math.min(yp1, yp2, yq1, yq2)
                if (hi <= lo) return null
                return (
                    <rect
                        key={i}
                        x={x1}
                        y={lo}
                        width={x2 - x1}
                        height={hi - lo}
                        fill="#e8a83808"
                    />
                )
            })}

            <text x={toX(-1.6)} y={toY(gauss(-1.6) / maxH * 0.9) - 8} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">P</text>
            <text x={toX(0.8)} y={toY(biased(0.8) / maxH * 0.9) - 8} fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Q</text>

            <rect x="218" y="38" width="128" height="72" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="228" y="56" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">P: true distribution</text>
            <text x="228" y="70" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">Q: model approximation</text>
            <line x1="225" y1="78" x2="342" y2="78" stroke="#252535" strokeWidth="1" />
            <text x="228" y="92" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">shaded = divergence</text>
            <text x="228" y="104" fill="#b95a5a" fontSize="4.5" fontFamily="JetBrains Mono,monospace">KL(P‖Q) ≥ 0, =0 only if P=Q</text>

            <line x1="20" y1={h - 18} x2={w - 20} y2={h - 18} stroke="#252535" strokeWidth="1" />
            <text x={cx} y={h - 8} textAnchor="middle" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace">
                Used as a loss: cross-entropy = H(P) + KL(P‖Q)
            </text>
        </svg>
    )
}

export function MutualInfoDiagram() {
    const w = 360, h = 220
    const cx = 180, cy = 110
    const r1 = 72, r2 = 72
    const dx = 22

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <defs>
                <marker id="mia" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#e8a838" /></marker>
                <marker id="mib" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x={cx} y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">
                I(X; Y) = H(X) + H(Y) − H(X, Y)  =  H(X) − H(X | Y)
            </text>

            {/* circles */}
            <circle cx={cx - dx} cy={cy} r={r1} fill="#e8a83808" stroke="#e8a838" strokeWidth="1.5" />
            <circle cx={cx + dx} cy={cy} r={r2} fill="#5a9ab908" stroke="#5a9ab9" strokeWidth="1.5" />

            {/* overlap region */}
            <path
                d={`M ${cx},${cy - r1}
                    A ${r1},${r1} 0 0,1 ${cx},${cy + r1}
                    A ${r2},${r2} 0 0,0 ${cx},${cy - r2} Z`}
                fill="#9b7fc715"
                stroke="#9b7fc7"
                strokeWidth="1.5"
            />

            {/* labels */}
            <text x={cx - dx - 52} y={cy - r1 + 12} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">H(X)</text>
            <text x={cx + dx + 6} y={cy - r2 + 12} fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">H(Y)</text>
            <text x={cx - 14} y={cy + 5} fill="#9b7fc7" fontSize="5.5" fontFamily="JetBrains Mono,monospace">I</text>

            {/* right panel */}
            <rect x="220" y="36" width="126" height="148" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="230" y="54" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">H(X) — entropy of X</text>
            <text x="230" y="68" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">H(Y) — entropy of Y</text>
            <line x1="227" y1="76" x2="342" y2="76" stroke="#252535" strokeWidth="1" />
            <text x="230" y="90" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">I(X;Y) — mutual info</text>
            <line x1="227" y1="98" x2="342" y2="98" stroke="#252535" strokeWidth="1" />
            <text x="230" y="112" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">H(X|Y) — X given Y</text>
            <text x="230" y="126" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">(what's left of X after</text>
            <text x="230" y="138" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">knowing Y)</text>
            <line x1="227" y1="148" x2="342" y2="148" stroke="#252535" strokeWidth="1" />
            <text x="230" y="162" fill="#5ab98c" fontSize="4.5" fontFamily="JetBrains Mono,monospace">I = 0: independent</text>
            <text x="230" y="174" fill="#b95a5a" fontSize="4.5" fontFamily="JetBrains Mono,monospace">I large: highly correlated</text>

            {/* bottom annotation */}
            <text x={cx} y={h - 10} textAnchor="middle" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace">
                Transformers maximise I between input tokens and attention outputs
            </text>
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
