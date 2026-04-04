import { pt } from "../../shared"

// ── GMM / EM diagrams ─────────────────────────────────────────────────────────

/** GMM — scatter plot with Gaussian ellipses */
export function GMMDiagram() {
    const w = 480, h = 230
    const sx = 40, sy = 205, s = 36
    const p = pt(sx, sy, s)

    // Three Gaussian blobs
    const pts: [number, number, number][] = [
        // (x, y, cluster-index)
        [1.0,4.2,0],[1.4,5.0,0],[1.8,4.6,0],[1.2,3.9,0],[2.0,4.9,0],[0.9,4.7,0],[1.6,5.3,0],
        [4.2,4.0,1],[5.0,4.6,1],[4.7,3.5,1],[4.0,4.8,1],[5.2,4.2,1],[4.5,5.1,1],[4.9,3.8,1],
        [2.8,1.3,2],[3.4,2.0,2],[3.0,1.0,2],[3.8,1.6,2],[2.6,1.8,2],[3.6,0.9,2],[3.2,2.2,2],
    ]
    const colors = ["#5a9ab9","#5ab98c","#e8a838"]
    const centers: [number, number][] = [[1.5, 4.7],[4.6, 4.3],[3.1, 1.5]]
    // Ellipse radii (rx in x-dir, ry in y-dir) in data coords
    const radii: [number, number][] = [[0.7,0.9],[0.8,0.7],[0.8,0.7]]

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <defs>
                <marker id="gmm-ax" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#252535" />
                </marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">GAUSSIAN MIXTURE MODEL — THREE COMPONENTS</text>

            {/* Axes */}
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(6.0,0).x} y2={p(6.0,0).y}
                stroke="#252535" strokeWidth="1.5" markerEnd="url(#gmm-ax)" />
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(0,6.0).x} y2={p(0,6.0).y}
                stroke="#252535" strokeWidth="1.5" markerEnd="url(#gmm-ax)" />

            {/* Gaussian ellipses (1σ and 2σ) */}
            {centers.map(([cx, cy], i) => {
                const pos = p(cx, cy)
                const [erx, ery] = radii[i]
                // scale radii to SVG coords
                const srx = erx * s
                const sry = ery * s
                return (
                    <g key={i}>
                        <ellipse cx={pos.x} cy={pos.y} rx={srx*2} ry={sry*2}
                            fill={colors[i]} opacity="0.05" stroke={colors[i]} strokeWidth="0.8" strokeDasharray="4,3" />
                        <ellipse cx={pos.x} cy={pos.y} rx={srx} ry={sry}
                            fill={colors[i]} opacity="0.08" stroke={colors[i]} strokeWidth="1.2" />
                    </g>
                )
            })}

            {/* Data points */}
            {pts.map(([xi, yi, ci], i) => (
                <circle key={i} cx={p(xi,yi).x} cy={p(xi,yi).y} r="4.5"
                    fill={colors[ci]} opacity="0.7" />
            ))}

            {/* Centroids */}
            {centers.map(([cx, cy], i) => {
                const pos = p(cx, cy)
                return (
                    <g key={i}>
                        <line x1={pos.x-7} y1={pos.y} x2={pos.x+7} y2={pos.y} stroke={colors[i]} strokeWidth="2" />
                        <line x1={pos.x} y1={pos.y-7} x2={pos.x} y2={pos.y+7} stroke={colors[i]} strokeWidth="2" />
                        <text x={pos.x+10} y={pos.y+4} fill={colors[i]} fontSize="7"
                            fontFamily="JetBrains Mono,monospace" fontWeight="600">μ{i+1}</text>
                    </g>
                )
            })}

            {/* Legend */}
            <text x={330} y={28} fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">● Component 1</text>
            <text x={330} y={40} fill="#5ab98c" fontSize="5.5" fontFamily="JetBrains Mono,monospace">● Component 2</text>
            <text x={330} y={52} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">● Component 3</text>
            <text x={330} y={64} fill="#3a3a55" fontSize="5" fontFamily="JetBrains Mono,monospace">— 1σ ellipse</text>
            <text x={330} y={74} fill="#3a3a55" fontSize="5" fontFamily="JetBrains Mono,monospace">- - 2σ ellipse</text>

            <text x={p(6.1,0).x+4} y={p(0,0).y+4} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₁</text>
            <text x={p(0,0).x-6} y={p(0,6.1).y-3} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₂</text>
        </svg>
    )
}

/** EM iteration — responsibility update visualisation */
export function EMStepsDiagram() {
    const w = 480, h = 160
    const steps = [
        { label: "Initialise", sub: "Random μ, Σ, π", color: "#3a3a55" },
        { label: "E-step", sub: "Compute responsibilities\nr(z_nk) ∝ πₖ 𝒩(xₙ|μₖ,Σₖ)", color: "#5a9ab9" },
        { label: "M-step", sub: "Update μ, Σ, π\nusing weighted MLE", color: "#e8a838" },
        { label: "Converged?", sub: "Check log-likelihood\nchange < ε", color: "#9b7fc7" },
    ]

    const bw = (w - 60) / steps.length
    const by = 50

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch3-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">EM ALGORITHM — ITERATIVE STEPS</text>

            {steps.map(({ label, sub, color }, i) => {
                const bx = 20 + i * bw
                const lines = sub.split("\n")
                return (
                    <g key={i}>
                        {/* Arrow between boxes */}
                        {i > 0 && (
                            <line x1={bx-4} y1={by+28} x2={bx+4} y2={by+28}
                                stroke="#3a3a55" strokeWidth="1.5" />
                        )}
                        <rect x={bx+4} y={by} width={bw-8} height={56} rx="4"
                            fill="#141420" stroke={color} strokeWidth="1.2" />
                        <text x={bx+bw/2} y={by+14} textAnchor="middle"
                            fill={color} fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">
                            {label}
                        </text>
                        <line x1={bx+8} y1={by+18} x2={bx+bw-8} y2={by+18} stroke={color} strokeWidth="0.5" opacity="0.4" />
                        {lines.map((line, li) => (
                            <text key={li} x={bx+bw/2} y={by+28+li*11} textAnchor="middle"
                                fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">
                                {line}
                            </text>
                        ))}
                    </g>
                )
            })}

            {/* Loop arrow back from "Converged?" to E-step */}
            <path d="M 460 80 Q 470 130 350 140 Q 180 148 130 130 Q 100 120 100 106"
                fill="none" stroke="#5e5b56" strokeWidth="1.2" strokeDasharray="4,3" />
            <polygon points="100,106 96,116 104,116" fill="#5e5b56" />
            <text x={280} y={154} textAnchor="middle" fill="#3a3a50"
                fontSize="5" fontFamily="JetBrains Mono,monospace">if not converged → repeat E+M steps</text>
        </svg>
    )
}
