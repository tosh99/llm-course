import { pt } from "../../shared"

// ── PCA diagrams ─────────────────────────────────────────────────────────────

/** PCA — data cloud with principal component arrows */
export function PCADiagram() {
    const w = 480, h = 230
    const sx = 50, sy = 200, s = 34
    const p = pt(sx, sy, s)

    // Correlated data points (elongated cloud, tilted ~45°)
    const rawPts: [number, number][] = [
        [1.0,1.2],[1.3,1.6],[1.6,1.8],[1.9,2.1],[2.2,2.3],[2.5,2.6],
        [2.8,2.9],[3.1,3.1],[3.4,3.3],[1.4,1.4],[1.8,2.0],[2.0,1.9],
        [2.3,2.5],[2.6,2.7],[2.9,3.0],[3.2,3.4],[1.7,2.2],[2.4,2.4],
        [1.2,1.8],[3.6,3.6],[1.5,1.0],[3.0,2.6],[2.7,3.2],[1.1,1.5],
    ]

    // Mean
    const mx = rawPts.reduce((s, [x]) => s + x, 0) / rawPts.length
    const my = rawPts.reduce((s, [,y]) => s + y, 0) / rawPts.length

    // PC1 direction (roughly 45° = [1,1]/√2), PC2 (perpendicular = [-1,1]/√2)
    const pc1 = [0.707, 0.707]
    const pc2 = [-0.707, 0.707]

    const ctr = p(mx, my)
    const pc1end = p(mx + pc1[0] * 1.5, my + pc1[1] * 1.5)
    const pc2end = p(mx + pc2[0] * 0.6, my + pc2[1] * 0.6)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <defs>
                <marker id="pca-arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#e8a838" />
                </marker>
                <marker id="pca-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#9b7fc7" />
                </marker>
                <marker id="pca-ax" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#252535" />
                </marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">PCA — PRINCIPAL COMPONENT DIRECTIONS</text>

            {/* Axes */}
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(5.2,0).x} y2={p(5.2,0).y}
                stroke="#252535" strokeWidth="1.5" markerEnd="url(#pca-ax)" />
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(0,5.2).x} y2={p(0,5.2).y}
                stroke="#252535" strokeWidth="1.5" markerEnd="url(#pca-ax)" />
            <text x={p(5.3,0).x+4} y={p(0,0).y+4} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₁</text>
            <text x={p(0,0).x-6} y={p(0,5.3).y-3} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₂</text>

            {/* Data points */}
            {rawPts.map(([xi, yi], i) => (
                <circle key={i} cx={p(xi,yi).x} cy={p(xi,yi).y} r="4"
                    fill="#5a9ab9" opacity="0.5" />
            ))}

            {/* Projection lines onto PC1 (light) */}
            {rawPts.map(([xi, yi], i) => {
                // Project onto PC1
                const dx = xi - mx, dy = yi - my
                const t = dx * pc1[0] + dy * pc1[1]
                const projX = mx + t * pc1[0], projY = my + t * pc1[1]
                const proj = p(projX, projY)
                const orig = p(xi, yi)
                return (
                    <line key={i} x1={orig.x} y1={orig.y} x2={proj.x} y2={proj.y}
                        stroke="#e8a838" strokeWidth="0.6" opacity="0.18" />
                )
            })}

            {/* PC1 arrow */}
            <line x1={p(mx - pc1[0]*1.5, my - pc1[1]*1.5).x}
                  y1={p(mx - pc1[0]*1.5, my - pc1[1]*1.5).y}
                  x2={pc1end.x} y2={pc1end.y}
                stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#pca-arr1)" />
            <text x={pc1end.x+6} y={pc1end.y+4} fill="#e8a838"
                fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">PC1</text>
            <text x={pc1end.x+6} y={pc1end.y+13} fill="#5e5b56"
                fontSize="5" fontFamily="JetBrains Mono,monospace">max variance</text>

            {/* PC2 arrow */}
            <line x1={ctr.x} y1={ctr.y} x2={pc2end.x} y2={pc2end.y}
                stroke="#9b7fc7" strokeWidth="2" markerEnd="url(#pca-arr2)" />
            <text x={pc2end.x-36} y={pc2end.y-6} fill="#9b7fc7"
                fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">PC2</text>
            <text x={pc2end.x-36} y={pc2end.y+4} fill="#5e5b56"
                fontSize="5" fontFamily="JetBrains Mono,monospace">⊥ to PC1</text>

            {/* Mean point */}
            <circle cx={ctr.x} cy={ctr.y} r="5" fill="#e8a838" opacity="0.9" />
            <text x={ctr.x+8} y={ctr.y+4} fill="#e8a838" fontSize="5.5"
                fontFamily="JetBrains Mono,monospace">x̄ (mean)</text>
        </svg>
    )
}

/** Scree plot — explained variance per component */
export function ScreePlot() {
    const w = 480, h = 175
    const variances = [62, 20, 9, 5, 2, 1, 1] // % explained
    const labels = ["PC1","PC2","PC3","PC4","PC5","PC6","PC7"]

    const margin = { l: 50, r: 30, t: 30, b: 40 }
    const pw = w - margin.l - margin.r
    const ph = h - margin.t - margin.b
    const barW = pw / variances.length

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">SCREE PLOT — EXPLAINED VARIANCE PER COMPONENT</text>

            {/* Grid */}
            {[20,40,60].map(v => (
                <line key={v} x1={margin.l} y1={margin.t + ph*(1-v/70)} x2={margin.l+pw} y2={margin.t + ph*(1-v/70)}
                    stroke="#1e1e28" strokeWidth="1" />
            ))}

            {/* Bars */}
            {variances.map((v, i) => {
                const bh = (v / 70) * ph
                const bx = margin.l + i * barW + barW * 0.15
                const by = margin.t + ph - bh
                const bw = barW * 0.7
                return (
                    <g key={i}>
                        <rect x={bx} y={by} width={bw} height={bh} rx="2"
                            fill={i < 2 ? "#e8a838" : i < 4 ? "#5a9ab9" : "#3a3a55"} opacity="0.85" />
                        <text x={bx+bw/2} y={by-4} textAnchor="middle" fill="#8e8a82"
                            fontSize="5.5" fontFamily="JetBrains Mono,monospace">{v}%</text>
                        <text x={bx+bw/2} y={margin.t+ph+12} textAnchor="middle" fill="#5e5b56"
                            fontSize="5.5" fontFamily="JetBrains Mono,monospace">{labels[i]}</text>
                    </g>
                )
            })}

            {/* Cumulative line */}
            {(() => {
                let cum = 0
                const pts = variances.map((v, i) => {
                    cum += v
                    const cx = margin.l + i * barW + barW * 0.5
                    const cy = margin.t + ph * (1 - cum / 100)
                    return `${cx},${cy}`
                })
                return <polyline points={pts.join(" ")} fill="none" stroke="#9b7fc7" strokeWidth="1.5" strokeDasharray="4,3" />
            })()}

            {/* Axes */}
            <line x1={margin.l} y1={margin.t} x2={margin.l} y2={margin.t+ph} stroke="#3a3a50" strokeWidth="1" />
            <line x1={margin.l} y1={margin.t+ph} x2={margin.l+pw} y2={margin.t+ph} stroke="#3a3a50" strokeWidth="1" />

            <text x={10} y={margin.t+ph/2} fill="#3a3a50" fontSize="5.5"
                fontFamily="JetBrains Mono,monospace" transform={`rotate(-90,10,${margin.t+ph/2})`}>Variance %</text>

            {/* Legend */}
            <rect x={380} y={34} width={8} height={8} rx="1" fill="#e8a838" opacity="0.85" />
            <text x={392} y={41} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Top components</text>
            <line x1={380} y1={50} x2={388} y2={50} stroke="#9b7fc7" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={392} y={54} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Cumulative</text>
        </svg>
    )
}
