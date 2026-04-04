import { DiagramBlock, pt } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

/** Decision tree — 3-level binary split */
export function TreeDiagram() {
    const w = 480, h = 220
    // Node positions
    const nodes = {
        root: { x: 240, y: 28, label: "x₁ ≤ 2.5?" },
        l1:   { x: 120, y: 88, label: "x₂ ≤ 1.5?" },
        r1:   { x: 360, y: 88, label: "x₂ ≤ 3.0?" },
        ll:   { x:  60, y: 150, label: "Class A", leaf: true, color: "#5ab98c" },
        lr:   { x: 180, y: 150, label: "Class B", leaf: true, color: "#b95a5a" },
        rl:   { x: 300, y: 150, label: "Class B", leaf: true, color: "#b95a5a" },
        rr:   { x: 420, y: 150, label: "Class A", leaf: true, color: "#5ab98c" },
    }
    const edges: [keyof typeof nodes, keyof typeof nodes, string, string][] = [
        ["root", "l1", "Yes", "left"],
        ["root", "r1", "No",  "right"],
        ["l1",   "ll", "Yes", "left"],
        ["l1",   "lr", "No",  "right"],
        ["r1",   "rl", "Yes", "left"],
        ["r1",   "rr", "No",  "right"],
    ]
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={16} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">DECISION TREE — BINARY SPLITS</text>
            {edges.map(([from, to, label, side], i) => {
                const a = nodes[from], b = nodes[to]
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
                return (
                    <g key={i}>
                        <line x1={a.x} y1={a.y + 13} x2={b.x} y2={b.y - 13} stroke="#252535" strokeWidth="1.5" />
                        <text x={mx + (side === "left" ? -10 : 8)} y={my - 2} fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">{label}</text>
                    </g>
                )
            })}
            {Object.entries(nodes).map(([key, n]) => (
                <g key={key}>
                    {(n as {leaf?: boolean}).leaf ? (
                        <>
                            <rect x={n.x - 28} y={n.y - 13} width={56} height={26} rx="4" fill="#141420" stroke={(n as {color?: string}).color ?? "#252535"} strokeWidth="1.5" />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill={(n as {color?: string}).color ?? "#cdc9c0"} fontSize="6" fontFamily="JetBrains Mono,monospace">{n.label}</text>
                        </>
                    ) : (
                        <>
                            <rect x={n.x - 36} y={n.y - 13} width={72} height={26} rx="4" fill="#141420" stroke="#e8a838" strokeWidth="1.5" />
                            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">{n.label}</text>
                        </>
                    )}
                </g>
            ))}
            {/* Sample partition visualisation */}
            <rect x="20" y="182" width={w - 40} height="30" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="240" y="196" textAnchor="middle" fill="#3a3a50" fontSize="5" fontFamily="JetBrains Mono,monospace">Each split partitions the feature space into axis-aligned rectangles</text>
            <text x="240" y="208" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">Impurity measure (Gini / entropy) chooses the best (feature, threshold) pair at each node</text>
        </svg>
    )
}

/** Ensemble — bagging (Random Forest) vs boosting */
export function EnsembleDiagram() {
    const w = 480, h = 200
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={16} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">BAGGING vs BOOSTING</text>

            {/* ── Bagging (left) ── */}
            <rect x="16" y="24" width="210" height="148" rx="3" fill="#111118" stroke="#252535" strokeWidth="1" />
            <text x="121" y="40" textAnchor="middle" fill="#5a9ab9" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">BAGGING</text>
            <text x="121" y="52" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">(e.g. Random Forest)</text>

            {/* Data → 3 bootstrap samples → 3 trees → vote */}
            <rect x="84" y="60" width="74" height="18" rx="3" fill="#141420" stroke="#5a9ab9" strokeWidth="1" />
            <text x="121" y="73" textAnchor="middle" fill="#5a9ab9" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Training Data</text>

            {[40, 84, 128].map((x, i) => (
                <g key={i}>
                    <line x1={121} y1={78} x2={x + 22} y2={98} stroke="#252535" strokeWidth="1" strokeDasharray="3,2" />
                    <rect x={x} y={98} width={44} height={18} rx="3" fill="#141420" stroke="#3a3a55" strokeWidth="1" />
                    <text x={x + 22} y={111} textAnchor="middle" fill="#8e8a82" fontSize="5" fontFamily="JetBrains Mono,monospace">Tree {i + 1}</text>
                    <line x1={x + 22} y1={116} x2={121} y2={136} stroke="#252535" strokeWidth="1" strokeDasharray="3,2" />
                </g>
            ))}
            <rect x="84" y="136" width="74" height="18" rx="3" fill="#141420" stroke="#5ab98c" strokeWidth="1.5" />
            <text x="121" y="149" textAnchor="middle" fill="#5ab98c" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Majority Vote</text>
            <text x="121" y="165" textAnchor="middle" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace">parallel, independent, ↓variance</text>

            {/* ── Boosting (right) ── */}
            <rect x="254" y="24" width="210" height="148" rx="3" fill="#111118" stroke="#252535" strokeWidth="1" />
            <text x="359" y="40" textAnchor="middle" fill="#e8a838" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">BOOSTING</text>
            <text x="359" y="52" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">(e.g. AdaBoost / GBM)</text>

            {[62, 94, 126].map((y, i) => (
                <g key={i}>
                    <rect x={320} y={y} width={78} height={18} rx="3"
                        fill="#141420" stroke={i === 2 ? "#e8a838" : "#3a3a55"} strokeWidth={i === 2 ? 1.5 : 1} />
                    <text x={359} y={y + 13} textAnchor="middle" fill={i === 2 ? "#e8a838" : "#8e8a82"}
                        fontSize="5.5" fontFamily="JetBrains Mono,monospace">
                        Weak Learner {i + 1}
                    </text>
                    {i < 2 && (
                        <g>
                            <line x1={359} y1={y + 18} x2={359} y2={y + 24} stroke="#9b7fc7" strokeWidth="1.5" markerEnd="url(#boost-arrow)" />
                            <text x={370} y={y + 22} fill="#9b7fc7" fontSize="4.5" fontFamily="JetBrains Mono,monospace">reweight errors</text>
                        </g>
                    )}
                </g>
            ))}
            <line x1={359} y1={144} x2={359} y2={152} stroke="#252535" strokeWidth="1" />
            <rect x={320} y={152} width={78} height={18} rx="3" fill="#141420" stroke="#5ab98c" strokeWidth="1.5" />
            <text x={359} y={165} textAnchor="middle" fill="#5ab98c" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Weighted Sum</text>
            <text x="359" y="181" textAnchor="middle" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace">sequential, ↓bias</text>

            <defs>
                <marker id="boost-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                    <polygon points="0 0,5 2.5,0 5" fill="#9b7fc7" />
                </marker>
            </defs>
        </svg>
    )
}

/** SVM — maximum-margin hyperplane with support vectors */
export function SVMDiagram() {
    const w = 480, h = 230
    const sx = 40, sy = 200, s = 42
    const p = pt(sx, sy, s)

    // Class A (circles, y=+1): above the margin
    const classA: [number, number][] = [
        [0.6, 3.8], [1.0, 4.2], [1.5, 4.8], [2.0, 5.3], [0.8, 5.0],
        [2.5, 4.6], [1.3, 5.5], [3.0, 5.0],
    ]
    // Class B (squares, y=-1): below the margin
    const classB: [number, number][] = [
        [1.5, 1.2], [2.0, 1.8], [2.5, 2.4], [3.0, 1.6], [3.5, 2.8],
        [4.0, 2.2], [2.8, 1.0], [3.8, 1.5],
    ]
    // Decision boundary: y = x + 0.5, margin width ~1.2 in data units
    // w·x + b = 0  ↔  -x + y = 0.5
    // Margin lines: -x + y = 0.5 ± 0.6
    const boundary = (x: number) => x + 0.5
    const marginHi = (x: number) => x + 1.1
    const marginLo = (x: number) => x - 0.1

    // Support vectors (closest to margin)
    const svA: [number, number][] = [[0.6, 1.8], [1.0, 2.1]] // won't render as SVs for class A
    // True support vectors
    const svApts: [number, number][] = [[0.8, 2.0], [1.3, 2.4]]
    const svBpts: [number, number][] = [[2.5, 2.4], [2.0, 1.8]]
    void svA; void svApts; // unused

    const x0 = 0, x1 = 4.5
    const bd0 = p(x0, boundary(x0)), bd1 = p(x1, boundary(x1))
    const mh0 = p(x0, marginHi(x0)), mh1 = p(x1, marginHi(x1))
    const ml0 = p(x0, marginLo(x0)), ml1 = p(x1, marginLo(x1))

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch2-diagram-svg">
            <defs>
                <marker id="svm-arr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#252535" />
                </marker>
            </defs>
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">SVM — MAXIMUM MARGIN HYPERPLANE</text>

            {/* Axes */}
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(x1+0.3,0).x} y2={p(x1+0.3,0).y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#svm-arr)" />
            <line x1={p(0,0).x} y1={p(0,0).y} x2={p(0,6.5).x} y2={p(0,6.5).y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#svm-arr)" />

            {/* Margin band fill */}
            <polygon
                points={`${ml0.x},${ml0.y} ${ml1.x},${ml1.y} ${mh1.x},${mh1.y} ${mh0.x},${mh0.y}`}
                fill="rgba(232,168,56,0.05)" stroke="none"
            />

            {/* Margin lines */}
            <line x1={mh0.x} y1={mh0.y} x2={mh1.x} y2={mh1.y} stroke="#e8a838" strokeWidth="1.2" strokeDasharray="6,4" opacity="0.7" />
            <line x1={ml0.x} y1={ml0.y} x2={ml1.x} y2={ml1.y} stroke="#e8a838" strokeWidth="1.2" strokeDasharray="6,4" opacity="0.7" />

            {/* Decision boundary */}
            <line x1={bd0.x} y1={bd0.y} x2={bd1.x} y2={bd1.y} stroke="#e8a838" strokeWidth="2.2" />

            {/* Class A — filled circles */}
            {classA.map(([xi, yi], i) => (
                <circle key={i} cx={p(xi, yi).x} cy={p(xi, yi).y} r="5" fill="#5a9ab9" opacity="0.85" />
            ))}
            {/* Class B — filled squares */}
            {classB.map(([xi, yi], i) => (
                <rect key={i} x={p(xi, yi).x - 5} y={p(xi, yi).y - 5} width="10" height="10" fill="#b95a5a" opacity="0.85" />
            ))}

            {/* Support vectors (circled) */}
            {svBpts.map(([xi, yi], i) => (
                <circle key={i} cx={p(xi, yi).x} cy={p(xi, yi).y} r="8" fill="none" stroke="#e8a838" strokeWidth="1.5" />
            ))}

            {/* Margin brace */}
            {(() => {
                const mx = 3.2
                const a = p(mx, marginHi(mx)), b = p(mx, marginLo(mx))
                return (
                    <g>
                        <line x1={a.x + 6} y1={a.y} x2={b.x + 6} y2={b.y} stroke="#e8a838" strokeWidth="1" />
                        <line x1={a.x + 3} y1={a.y} x2={a.x + 9} y2={a.y} stroke="#e8a838" strokeWidth="1" />
                        <line x1={b.x + 3} y1={b.y} x2={b.x + 9} y2={b.y} stroke="#e8a838" strokeWidth="1" />
                        <text x={a.x + 10} y={(a.y + b.y) / 2 + 2} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">2/‖w‖</text>
                    </g>
                )
            })()}

            {/* Legend */}
            <circle cx={310} cy={25} r="5" fill="#5a9ab9" opacity="0.85" />
            <text x={320} y={29} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Class +1</text>
            <rect x={306} y={36} width="10" height="10" fill="#b95a5a" opacity="0.85" />
            <text x={320} y={45} fill="#8e8a82" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Class −1</text>
            <circle cx={313} cy={56} r="5" fill="none" stroke="#e8a838" strokeWidth="1.5" />
            <text x={320} y={60} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Support vector</text>
            <line x1={306} y1={70} x2={330} y2={70} stroke="#e8a838" strokeWidth="2" />
            <text x={320} y={74} fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Decision boundary</text>

            {/* Axis labels */}
            <text x={p(x1 + 0.4, 0).x + 4} y={p(0, 0).y + 4} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₁</text>
            <text x={p(0, 0).x - 6} y={p(0, 6.5).y - 3} fill="#3a3a55" fontSize="6" fontFamily="JetBrains Mono,monospace">x₂</text>
        </svg>
    )
}

export { DiagramBlock }
