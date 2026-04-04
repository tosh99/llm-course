import { DiagramBlock, pt } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function DotProductDiagram() {
    const cx = 82, cy = 178, s = 48
    const p = pt(cx, cy, s)

    const a = { mx: 2, my: 1 }
    const b = { mx: 0.5, my: 2.5 }
    const pa = p(a.mx, a.my), pb = p(b.mx, b.my), po = p(0, 0)

    const dotAB = a.mx * b.mx + a.my * b.my
    const aMag2 = a.mx ** 2 + a.my ** 2
    const t = dotAB / aMag2
    const pp = p(t * a.mx, t * a.my)

    const ra = 36
    const angA = Math.atan2(a.my, a.mx)
    const angB = Math.atan2(b.my, b.mx)
    const asx = po.x + ra * Math.cos(angA), asy = po.y - ra * Math.sin(angA)
    const aex = po.x + ra * Math.cos(angB), aey = po.y - ra * Math.sin(angB)
    const angM = (angA + angB) / 2
    const lx = po.x + 52 * Math.cos(angM), ly = po.y - 52 * Math.sin(angM)

    return (
        <svg viewBox="0 0 360 225" className="ch0-diagram-svg">
            <defs>
                <marker id="dpa" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#e8a838" /></marker>
                <marker id="dpb" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5a9ab9" /></marker>
                <marker id="dps" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#2a2a38" /></marker>
            </defs>
            <rect width="360" height="225" fill="#0f0f14" rx="4" />
            {[0, 1, 2, 3].map(i => (
                <g key={i} stroke="#18181f" strokeWidth="1">
                    <line x1={p(i, 0).x} y1={p(0, 3.2).y} x2={p(i, 0).x} y2={po.y + 6} />
                    <line x1={po.x - 6} y1={p(0, i).y} x2={p(3.2, 0).x} y2={p(0, i).y} />
                </g>
            ))}
            <line x1={po.x} y1={po.y} x2={p(3.2, 0).x} y2={po.y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#dps)" />
            <line x1={po.x} y1={po.y} x2={po.x} y2={p(0, 3.2).y} stroke="#252535" strokeWidth="1.5" markerEnd="url(#dps)" />
            <line x1={pb.x} y1={pb.y} x2={pp.x} y2={pp.y} stroke="#5a9ab9" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" markerEnd="url(#dps)" />
            <circle cx={pp.x} cy={pp.y} r="3.5" fill="#e8a838" opacity="0.7" />
            <path d={`M${asx},${asy} A${ra},${ra} 0 0,0 ${aex},${aey}`} fill="none" stroke="#3a3a50" strokeWidth="1.5" />
            <text x={lx - 4} y={ly + 5} fill="#7a7a95" fontSize="6.5" fontFamily="serif" fontStyle="italic">θ</text>
            <line x1={po.x} y1={po.y} x2={pa.x} y2={pa.y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#dpa)" />
            <line x1={po.x} y1={po.y} x2={pb.x} y2={pb.y} stroke="#5a9ab9" strokeWidth="2.5" markerEnd="url(#dpb)" />
            <text x={pa.x + 7} y={pa.y + 5} fill="#e8a838" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">a</text>
            <text x={pb.x - 12} y={pb.y - 6} fill="#5a9ab9" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">b</text>
            <text x={pp.x + 6} y={pp.y - 6} fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace" opacity="0.7">proj</text>
            <rect x="210" y="18" width="138" height="190" rx="4" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="220" y="40" fill="#cdc9c0" fontSize="6" fontFamily="JetBrains Mono,monospace">a·b = Σ aᵢbᵢ</text>
            <text x="220" y="58" fill="#7a7a90" fontSize="5.5" fontFamily="JetBrains Mono,monospace">= |a||b| cosθ</text>
            <line x1="217" y1="67" x2="342" y2="67" stroke="#252535" strokeWidth="1" />
            <text x="220" y="83" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">cosθ = 1  → parallel</text>
            <text x="220" y="100" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">cosθ = 0  → orthog.</text>
            <text x="220" y="117" fill="#b95a5a" fontSize="5" fontFamily="JetBrains Mono,monospace">cosθ =-1  → opposite</text>
            <line x1="217" y1="127" x2="342" y2="127" stroke="#252535" strokeWidth="1" />
            <text x="220" y="144" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">Transformers:</text>
            <text x="220" y="160" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">score = qᵀk / √dₖ</text>
            <text x="220" y="177" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">Word2Vec, CLIP,</text>
            <text x="220" y="192" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">RAG retrieval ↑</text>
        </svg>
    )
}

export function MatTransformDiagram() {
    const pb = pt(72, 145, 52)
    const pa = pt(248, 145, 52)
    const A = [[1.5, 0.5], [0.3, 1.3]]
    const Av = (x: number, y: number) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y]

    const [ax1, ay1] = Av(1, 0), [ax2, ay2] = Av(0, 1), [ax3, ay3] = Av(1, 1)
    const pAe1 = pa(ax1, ay1), pAe2 = pa(ax2, ay2), pAe3 = pa(ax3, ay3)
    const pAo = pa(0, 0)

    const sqPts = `${pb(0, 0).x},${pb(0, 0).y} ${pb(1, 0).x},${pb(1, 0).y} ${pb(1, 1).x},${pb(1, 1).y} ${pb(0, 1).x},${pb(0, 1).y}`
    const trPts = `${pAo.x},${pAo.y} ${pAe1.x},${pAe1.y} ${pAe3.x},${pAe3.y} ${pAe2.x},${pAe2.y}`

    return (
        <svg viewBox="0 0 360 210" className="ch0-diagram-svg">
            <defs>
                <marker id="mta" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#e8a838" /></marker>
                <marker id="mtb" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5a9ab9" /></marker>
                <marker id="mtg" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#5ab98c" /></marker>
            </defs>
            <rect width="360" height="210" fill="#0f0f14" rx="4" />

            <text x="72" y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">BEFORE</text>
            {[-1, 0, 1, 2].map(i => (
                <g key={i} stroke="#18181f" strokeWidth="1">
                    <line x1={pb(i, 0).x} y1={pb(0, 2).y} x2={pb(i, 0).x} y2={pb(0, -1).y} />
                    <line x1={pb(-1, 0).x} y1={pb(0, i).y} x2={pb(2, 0).x} y2={pb(0, i).y} />
                </g>
            ))}
            <polygon points={sqPts} fill="#e8a83812" stroke="#e8a83840" strokeWidth="1" />
            <line x1={pb(0, 0).x} y1={pb(0, 0).y} x2={pb(1, 0).x} y2={pb(1, 0).y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#mta)" />
            <line x1={pb(0, 0).x} y1={pb(0, 0).y} x2={pb(0, 1).x} y2={pb(0, 1).y} stroke="#5a9ab9" strokeWidth="2.5" markerEnd="url(#mtb)" />
            <text x={pb(1, 0).x + 5} y={pb(1, 0).y + 5} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">e₁</text>
            <text x={pb(0, 1).x - 20} y={pb(0, 1).y} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">e₂</text>

            <line x1="145" y1="115" x2="180" y2="115" stroke="#3a3a50" strokeWidth="2" markerEnd="url(#mtg)" />
            <text x="148" y="108" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">A ×</text>
            <text x="140" y="130" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace">[[1.5, 0.5]</text>
            <text x="140" y="143" fill="#3a3a50" fontSize="4.5" fontFamily="JetBrains Mono,monospace"> [0.3, 1.3]]</text>

            <text x="248" y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">AFTER</text>
            {[-1, 0, 1, 2, 3].map(i => (
                <g key={i} stroke="#18181f" strokeWidth="1">
                    <line x1={pa(i, 0).x} y1={pa(0, 2.2).y} x2={pa(i, 0).x} y2={pa(0, -1).y} />
                    <line x1={pa(-1, 0).x} y1={pa(0, i).y} x2={pa(3, 0).x} y2={pa(0, i).y} />
                </g>
            ))}
            <polygon points={trPts} fill="#e8a83812" stroke="#e8a83840" strokeWidth="1" />
            <line x1={pAo.x} y1={pAo.y} x2={pAe1.x} y2={pAe1.y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#mta)" />
            <line x1={pAo.x} y1={pAo.y} x2={pAe2.x} y2={pAe2.y} stroke="#5a9ab9" strokeWidth="2.5" markerEnd="url(#mtb)" />
            <text x={pAe1.x + 5} y={pAe1.y + 5} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">Ae₁</text>
            <text x={pAe2.x - 26} y={pAe2.y} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">Ae₂</text>
        </svg>
    )
}

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
        <svg viewBox="0 0 360 220" className="ch0-diagram-svg">
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
        <svg viewBox={`0 0 ${w} ${h}`} className="ch0-diagram-svg">
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

export function SVDDiagram() {
    return (
        <svg viewBox="0 0 460 170" className="ch0-diagram-svg">
            <defs>
                <marker id="svda" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#3a3a55" /></marker>
            </defs>
            <rect width="460" height="170" fill="#0f0f14" rx="4" />

            <text x="230" y="20" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">A = U Σ Vᵀ</text>

            <circle cx="52" cy="95" r="34" fill="rgba(90,155,185,0.08)" stroke="#5a9ab9" strokeWidth="1.5" />
            <line x1="18" y1="95" x2="86" y2="95" stroke="#5a9ab9" strokeWidth="1" opacity="0.3" />
            <line x1="52" y1="61" x2="52" y2="129" stroke="#5a9ab9" strokeWidth="1" opacity="0.3" />
            <text x="52" y="143" textAnchor="middle" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">input</text>
            <text x="52" y="156" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">unit circle</text>

            <line x1="96" y1="95" x2="128" y2="95" stroke="#3a3a55" strokeWidth="1.5" markerEnd="url(#svda)" />
            <text x="112" y="86" textAnchor="middle" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">Vᵀ</text>
            <text x="112" y="113" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">rotate</text>

            <circle cx="160" cy="95" r="34" fill="rgba(155,127,199,0.06)" stroke="#9b7fc7" strokeWidth="1.5" />
            <line x1="126" y1="95" x2="194" y2="95" stroke="#9b7fc7" strokeWidth="1" opacity="0.3" transform="rotate(-35,160,95)" />
            <line x1="160" y1="61" x2="160" y2="129" stroke="#9b7fc7" strokeWidth="1" opacity="0.3" transform="rotate(-35,160,95)" />
            <text x="160" y="143" textAnchor="middle" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">rotated</text>

            <line x1="204" y1="95" x2="236" y2="95" stroke="#3a3a55" strokeWidth="1.5" markerEnd="url(#svda)" />
            <text x="220" y="86" textAnchor="middle" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">Σ</text>
            <text x="220" y="113" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">scale</text>

            <ellipse cx="284" cy="95" rx="52" ry="24" fill="rgba(232,168,56,0.06)" stroke="#e8a838" strokeWidth="1.5" transform="rotate(-35,284,95)" />
            <text x="284" y="143" textAnchor="middle" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">scaled</text>

            <line x1="328" y1="95" x2="386" y2="95" stroke="#3a3a55" strokeWidth="1.5" markerEnd="url(#svda)" />
            <text x="357" y="86" textAnchor="middle" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">U</text>
            <text x="357" y="113" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">rotate</text>

            <ellipse cx="422" cy="95" rx="16" ry="34" fill="rgba(90,185,140,0.07)" stroke="#5ab98c" strokeWidth="1.5" />
            <text x="422" y="143" textAnchor="middle" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">output</text>
            <text x="422" y="156" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Av</text>
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
