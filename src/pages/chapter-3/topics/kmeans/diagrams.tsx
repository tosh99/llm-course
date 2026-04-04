import { pt } from "../../shared"

// ── k-Means diagrams ─────────────────────────────────────────────────────────

/** k-Means scatter plot with 3 clusters and centroids */
export function KMeansDiagram() {
    const w = 480, h = 230

    // Three cluster centers (in data coords)
    const centers: [number, number, string, string][] = [
        [1.8, 4.8, "#5a9ab9", "μ₁"],
        [4.5, 4.2, "#5ab98c", "μ₂"],
        [3.0, 1.6, "#e8a838", "μ₃"],
    ]

    // Points per cluster [cx, cy, spread, color]
    const clusterPts: [number, number][][] = [
        // Cluster 1 — blue
        [[1.0,4.0],[1.4,5.3],[2.2,5.1],[1.6,4.2],[0.9,5.0],[2.0,4.5],[1.3,3.8],[2.4,5.4]],
        // Cluster 2 — green
        [[4.0,3.6],[5.0,4.8],[4.8,3.9],[3.9,4.7],[5.2,4.1],[4.6,5.2],[5.0,3.5],[4.2,4.0]],
        // Cluster 3 — amber
        [[2.5,1.0],[3.4,2.2],[2.8,1.8],[3.8,1.3],[3.2,2.5],[2.6,2.0],[3.6,1.6],[2.9,0.9]],
    ]
    const colors = ["#5a9ab9","#5ab98c","#e8a838"]

    const sx = 36, sy = 210, s = 34
    const p = pt(sx, sy, s)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <defs>
                <marker id="km-arr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#252535" />
                </marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">K-MEANS — THREE CLUSTERS (K=3)</text>

            {/* Axes */}
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(6.2,0).x} y2={p(6.2,0).y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#km-arr)" />
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(0,6.2).x} y2={p(0,6.2).y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#km-arr)" />

            {/* Soft Voronoi-like regions */}
            {clusterPts.map((pts, ci) =>
                pts.map(([xi, yi], pi) => (
                    <circle key={`${ci}-${pi}`} cx={p(xi, yi).x} cy={p(xi, yi).y} r="5.5"
                        fill={colors[ci]} opacity="0.55" />
                ))
            )}

            {/* Lines from points to centroids */}
            {clusterPts.map((pts, ci) =>
                pts.map(([xi, yi], pi) => {
                    const [cx, cy] = centers[ci]
                    return (
                        <line key={`l-${ci}-${pi}`}
                            x1={p(xi,yi).x} y1={p(xi,yi).y}
                            x2={p(cx,cy).x} y2={p(cx,cy).y}
                            stroke={colors[ci]} strokeWidth="0.6" opacity="0.2" />
                    )
                })
            )}

            {/* Centroids */}
            {centers.map(([cx, cy, color, label]) => {
                const pos = p(cx, cy)
                return (
                    <g key={label}>
                        <circle cx={pos.x} cy={pos.y} r="9" fill={color} opacity="0.2" />
                        <circle cx={pos.x} cy={pos.y} r="5" fill={color} />
                        <polygon
                            points={`${pos.x},${pos.y-9} ${pos.x+8},${pos.y+5} ${pos.x-8},${pos.y+5}`}
                            fill="none" stroke={color} strokeWidth="1.5" opacity="0.8"
                        />
                        <text x={pos.x + 12} y={pos.y + 4} fill={color} fontSize="7"
                            fontFamily="JetBrains Mono,monospace" fontWeight="600">{label}</text>
                    </g>
                )
            })}

            {/* Legend */}
            <circle cx={310} cy={28} r="5" fill="#5a9ab9" opacity="0.7" />
            <text x={320} y={32} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Cluster 1</text>
            <circle cx={310} cy={42} r="5" fill="#5ab98c" opacity="0.7" />
            <text x={320} y={46} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Cluster 2</text>
            <circle cx={310} cy={56} r="5" fill="#e8a838" opacity="0.7" />
            <text x={320} y={60} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Cluster 3</text>
            <polygon points="310,67 318,76 302,76" fill="none" stroke="#e8a838" strokeWidth="1.5" opacity="0.8" />
            <text x={320} y={75} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Centroid μₖ</text>

            {/* Axis labels */}
            <text x={p(6.3,0).x+4} y={p(0,0).y+4} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₁</text>
            <text x={p(0,0).x-6} y={p(0,6.3).y-3} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₂</text>
        </svg>
    )
}

/** Elbow method — inertia vs K */
export function ElbowDiagram() {
    const w = 480, h = 180
    // Inertia values for K = 1..7
    const ks = [1, 2, 3, 4, 5, 6, 7]
    const inertias = [4800, 2600, 980, 820, 770, 740, 720]
    const maxI = 5000

    const margin = { l: 50, r: 30, t: 30, b: 40 }
    const pw = w - margin.l - margin.r
    const ph = h - margin.t - margin.b

    const px = (k: number) => margin.l + ((k - 1) / 6) * pw
    const py = (i: number) => margin.t + ph - (i / maxI) * ph

    const points = ks.map((k, idx) => `${px(k)},${py(inertias[idx])}`).join(" ")

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">ELBOW METHOD — CHOOSING K</text>

            {/* Grid lines */}
            {[1000,2000,3000,4000].map(v => (
                <line key={v} x1={margin.l} y1={py(v)} x2={margin.l+pw} y2={py(v)}
                    stroke="#1e1e28" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1={margin.l} y1={margin.t} x2={margin.l} y2={margin.t+ph} stroke="#3a3a50" strokeWidth="1.5" />
            <line x1={margin.l} y1={margin.t+ph} x2={margin.l+pw} y2={margin.t+ph} stroke="#3a3a50" strokeWidth="1.5" />

            {/* Y axis labels */}
            {[0,1000,2000,3000,4000].map(v => (
                <text key={v} x={margin.l-6} y={py(v)+3} textAnchor="end" fill="#3a3a50"
                    fontSize="5.5" fontFamily="JetBrains Mono,monospace">{v===0?'0':`${v/1000}k`}</text>
            ))}
            {/* X axis labels */}
            {ks.map(k => (
                <text key={k} x={px(k)} y={margin.t+ph+12} textAnchor="middle" fill="#5e5b56"
                    fontSize="6" fontFamily="JetBrains Mono,monospace">{k}</text>
            ))}
            <text x={margin.l+pw/2} y={h-4} textAnchor="middle" fill="#3a3a50"
                fontSize="5.5" fontFamily="JetBrains Mono,monospace">Number of clusters (K)</text>
            <text x={10} y={margin.t+ph/2} fill="#3a3a50" fontSize="5.5"
                fontFamily="JetBrains Mono,monospace" transform={`rotate(-90,10,${margin.t+ph/2})`}>Inertia</text>

            {/* Curve */}
            <polyline points={points} fill="none" stroke="#5a9ab9" strokeWidth="2" />
            {ks.map((k, idx) => (
                <circle key={k} cx={px(k)} cy={py(inertias[idx])} r="4"
                    fill={k === 3 ? "#e8a838" : "#5a9ab9"} />
            ))}

            {/* Elbow annotation */}
            <line x1={px(3)} y1={py(inertias[2])-8} x2={px(3)} y2={py(inertias[2])-20}
                stroke="#e8a838" strokeWidth="1" strokeDasharray="3,2" />
            <text x={px(3)} y={py(inertias[2])-24} textAnchor="middle" fill="#e8a838"
                fontSize="6" fontFamily="JetBrains Mono,monospace">Elbow at K=3</text>
        </svg>
    )
}
