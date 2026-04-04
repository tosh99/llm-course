import { DiagramBlock, pt } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function RegressionDiagram() {
    const w = 420, h = 240
    const sx = 52, sy = 210, s = 44
    const p = pt(sx, sy, s)

    const pts: [number, number][] = [
        [0.5, 1.8], [0.9, 2.1], [1.3, 2.5], [1.7, 3.0], [2.0, 3.2],
        [2.4, 3.8], [2.8, 4.1], [3.1, 4.6], [3.5, 5.0], [3.9, 5.4],
        [1.0, 2.8], [2.2, 4.5], [3.3, 5.2],
    ]
    const m = 0.95, b = 1.1

    const px0 = p(0, 0), px1 = p(4.5, 0)
    const py0 = p(0, 0), py1 = p(0, 6.2)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <defs>
                <marker id="lr-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#5a9ab9" /></marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            {[-1, 0, 1, 2, 3, 4].map(i => (
                <g key={i} stroke="#18181f" strokeWidth="1">
                    <line x1={p(i, 0).x} y1={p(0, 6.5).y} x2={p(i, 0).x} y2={py0.y + 4} />
                    <line x1={px0.x - 4} y1={p(0, i).y} x2={px1.x} y2={p(0, i).y} />
                </g>
            ))}

            <line x1={px0.x} y1={py0.y} x2={px1.x} y2={py0.y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#lr-arrow)" />
            <line x1={px0.x} y1={py0.y} x2={px0.x} y2={py1.y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#lr-arrow)" />

            {/* Regression line ŷ = 0.95x + 1.1 */}
            {(() => {
                const y0 = m * 0 + b, y1 = m * 4.5 + b
                return (
                    <line
                        x1={p(0, y0).x} y1={p(0, y0).y}
                        x2={p(4.5, y1).x} y2={p(4.5, y1).y}
                        stroke="#e8a838" strokeWidth="2.5"
                    />
                )
            })()}

            {/* Residual lines */}
            {pts.map(([xi, yi], i) => {
                const yHat = m * xi + b
                return (
                    <g key={i}>
                        <line
                            x1={p(xi, yi).x} y1={p(xi, yi).y}
                            x2={p(xi, yHat).x} y2={p(xi, yHat).y}
                            stroke="#b95a5a" strokeWidth="1" strokeDasharray="3,3" opacity="0.7"
                        />
                        <circle cx={p(xi, yi).x} cy={p(xi, yi).y} r="4" fill="#5ab98c" opacity="0.9" />
                    </g>
                )
            })}

            {/* Axis labels */}
            <text x={px1.x + 5} y={py0.y + 4} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x</text>
            <text x={px0.x - 6} y={py1.y - 3} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">y</text>

            {/* Legend */}
            <circle cx={300} cy={22} r="4" fill="#5ab98c" opacity="0.9" />
            <text x={308} y={26} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">data point</text>
            <line x1={300} y1={36} x2={340} y2={36} stroke="#e8a838" strokeWidth="2" />
            <text x={308} y={40} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">regression line</text>
            <line x1={300} y1={50} x2={340} y2={50} stroke="#b95a5a" strokeWidth="1" strokeDasharray="3,3" opacity="0.7" />
            <text x={308} y={54} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">residual</text>

            <text x={28} y={22} fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">ŷ = 0.95x + 1.1</text>
        </svg>
    )
}

export function BiasVarianceDiagram() {
    const w = 480, h = 190
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x={12} y={16} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">BIAS-VARIANCE TRADE-OFF</text>

            {/* Underfit — high bias */}
            <rect x="20" y="32" width="120" height="80" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="80" y="52" textAnchor="middle" fill="#b95a5a" fontSize="6.5" fontFamily="JetBrains Mono,monospace">UNDERFITTING</text>
            <text x="80" y="66" textAnchor="middle" fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">High Bias</text>
            <text x="80" y="80" textAnchor="middle" fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Low Variance</text>
            {/* Simple line through scattered points */}
            <line x1="30" y1="105" x2="130" y2="95" stroke="#e8a838" strokeWidth="2" />
            <circle cx="45" cy="90" r="3.5" fill="#5ab98c" opacity="0.8" />
            <circle cx="65" cy="100" r="3.5" fill="#5ab98c" opacity="0.8" />
            <circle cx="85" cy="95" r="3.5" fill="#5ab98c" opacity="0.8" />
            <circle cx="105" cy="85" r="3.5" fill="#5ab98c" opacity="0.8" />
            <circle cx="115" cy="105" r="3.5" fill="#5ab98c" opacity="0.8" />
            {/* Target line (dashed) */}
            <line x1="30" y1="100" x2="130" y2="80" stroke="#5a9ab9" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="80" y={120} textAnchor="middle" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Too simple</text>

            {/* Good fit */}
            <rect x="170" y="32" width="120" height="80" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="230" y="52" textAnchor="middle" fill="#5ab98c" fontSize="6.5" fontFamily="JetBrains Mono,monospace">GOOD FIT</text>
            <text x="230" y="66" textAnchor="middle" fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">Balanced</text>
            <text x="230" y="80" textAnchor="middle" fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Balanced</text>
            {/* Data close to regression line */}
            {[45, 60, 75, 90, 105, 120].map((x, i) => {
                const y = 100 - (x - 80) * 0.18 + (i % 3 - 1) * 6
                return <circle key={i} cx={x} cy={y} r="3.5" fill="#5ab98c" opacity="0.8" />
            })}
            <line x1="30" y1="100" x2="130" y2="82" stroke="#e8a838" strokeWidth="2" />
            <line x1="30" y1="100" x2="130" y2="80" stroke="#5a9ab9" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="230" y={120} textAnchor="middle" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Just right</text>

            {/* Overfit — high variance */}
            <rect x="320" y="32" width="120" height="80" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="380" y="52" textAnchor="middle" fill="#9b7fc7" fontSize="6.5" fontFamily="JetBrains Mono,monospace">OVERFITTING</text>
            <text x="380" y="66" textAnchor="middle" fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">Low Bias</text>
            <text x="380" y="80" textAnchor="middle" fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">High Variance</text>
            {/* Wiggly line going through each point */}
            <polyline points="35,105 50,88 65,100 80,90 95,102 110,88 125,98"
                fill="none" stroke="#e8a838" strokeWidth="2" />
            {[45, 60, 75, 90, 105, 120].map((x, i) => {
                const y = i % 2 === 0 ? 90 : 100
                return <circle key={i} cx={x} cy={y} r="3.5" fill="#5ab98c" opacity="0.8" />
            })}
            <line x1="30" y1="100" x2="130" y2="80" stroke="#5a9ab9" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
            <text x="380" y={120} textAnchor="middle" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Too complex</text>

            {/* MSE decomposition */}
            <rect x="20" y="140" width={w - 40} height="38" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="240" y="157" textAnchor="middle" fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">MSE = Bias² + Variance + Irreducible Noise</text>
            <text x="240" y="172" textAnchor="middle" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">Reducing overfitting: ↑bias penalty (regularization), more data, simpler model</text>
        </svg>
    )
}

export function RidgeLassoDiagram() {
    const w = 480, h = 170
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x={12} y={16} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">L1 vs L2 PENALTY — CONSTRAINT REGIONS</text>

            {/* L1 (Lasso) */}
            <rect x="24" y="28" width="200" height="100" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="124" y="48" textAnchor="middle" fill="#9b7fc7" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">L1 (LASSO)</text>
            <text x="124" y="62" textAnchor="middle" fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">|w₁| + |w₂| ≤ t</text>

            {/* L1 diamond */}
            <polygon points="124,44 144,64 124,84 104,64" fill="rgba(155,127,199,0.06)" stroke="#9b7fc7" strokeWidth="1.5" />
            {/* Contour */}
            <ellipse cx="145" cy="58" rx="40" ry="22" fill="none" stroke="#e8a838" strokeWidth="1.5" strokeDasharray="5,4" />
            {/* Intersection on axis (sparsity) */}
            <circle cx="124" cy="64" r="4" fill="#5ab98c" />
            <text x="150" y={52} fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">sparse</text>
            <text x="124" y={96} textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">w₂ = 0  →  feature selection</text>

            {/* L2 (Ridge) */}
            <rect x="254" y="28" width="200" height="100" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="354" y="48" textAnchor="middle" fill="#5a9ab9" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">L2 (Ridge)</text>
            <text x="354" y="62" textAnchor="middle" fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">w₁² + w₂² ≤ t</text>

            {/* L2 circle */}
            <circle cx="354" cy="64" r="22" fill="rgba(90,155,185,0.06)" stroke="#5a9ab9" strokeWidth="1.5" />
            {/* Contour */}
            <ellipse cx="370" cy="60" rx="44" ry="26" fill="none" stroke="#e8a838" strokeWidth="1.5" strokeDasharray="5,4" />
            {/* Intersection not on axis */}
            <circle cx="360" cy="55" r="4" fill="#5ab98c" />
            <text x="370" y={48} fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">shrinks all</text>
            <text x="354" y={96} textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">no sparsity, all features used</text>

            {/* Arrow between */}
            <line x1="230" y1="80" x2="248" y2="80" stroke="#3a3a50" strokeWidth="1.5" />
            <text x="239" y="74" textAnchor="middle" fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">vs</text>

            {/* Comparison table */}
            <rect x="24" y={136} width={w - 48} height="26" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="44" y={154} fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">L1</text>
            <text x={80} y={154} fill="#8e8a82" fontSize="5" fontFamily="JetBrains Mono,monospace">Sparse solutions (w = 0)  →  feature selection</text>
            <text x="280" y={154} fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">L2</text>
            <text x="306" y={154} fill="#8e8a82" fontSize="5" fontFamily="JetBrains Mono,monospace">Shrinks weights uniformly, no sparsity</text>
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
