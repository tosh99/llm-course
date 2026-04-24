import { DiagramBlock, pt } from "../../shared"

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
        <svg viewBox="0 0 360 225" className="ch-diagram-svg">
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
            <path d={"M" + asx + "," + asy + " A" + ra + "," + ra + " 0 0,0 " + aex + "," + aey} fill="none" stroke="#3a3a50" strokeWidth="1.5" />
            <text x={lx - 4} y={ly + 5} fill="#7a7a95" fontSize="6.5" fontFamily="serif" fontStyle="italic">theta</text>
            <line x1={po.x} y1={po.y} x2={pa.x} y2={pa.y} stroke="#e8a838" strokeWidth="2.5" markerEnd="url(#dpa)" />
            <line x1={po.x} y1={po.y} x2={pb.x} y2={pb.y} stroke="#5a9ab9" strokeWidth="2.5" markerEnd="url(#dpb)" />
            <text x={pa.x + 7} y={pa.y + 5} fill="#e8a838" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="600">a</text>
            <text x={pb.x - 12} y={pb.y - 6} fill="#5a9ab9" fontSize="7" fontFamily="JetBrains Mono,monospace">b</text>
            <text x={pp.x + 6} y={pp.y - 6} fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace" opacity="0.7">proj</text>
            <rect x="210" y="18" width="138" height="190" rx="4" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="220" y="40" fill="#cdc9c0" fontSize="6" fontFamily="JetBrains Mono,monospace">a.b = Sigma a_i b_i</text>
            <text x="220" y="58" fill="#7a7a90" fontSize="5.5" fontFamily="JetBrains Mono,monospace">= |a||b| cos(theta)</text>
            <line x1="217" y1="67" x2="342" y2="67" stroke="#252535" strokeWidth="1" />
            <text x="220" y="83" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">cos(theta) = 1  -&gt; parallel</text>
            <text x="220" y="100" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">cos(theta) = 0  -&gt; orthog.</text>
            <text x="220" y="117" fill="#b95a5a" fontSize="5" fontFamily="JetBrains Mono,monospace">cos(theta) =-1  -&gt; opposite</text>
            <line x1="217" y1="127" x2="342" y2="127" stroke="#252535" strokeWidth="1" />
            <text x="220" y="144" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">Transformers:</text>
            <text x="220" y="160" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">score = q^T k / sqrt(d_k)</text>
            <text x="220" y="177" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">Word2Vec, CLIP,</text>
            <text x="220" y="192" fill="#7a7a90" fontSize="5" fontFamily="JetBrains Mono,monospace">RAG retrieval</text>
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
    const sqPts = pb(0, 0).x + "," + pb(0, 0).y + " " + pb(1, 0).x + "," + pb(1, 0).y + " " + pb(1, 1).x + "," + pb(1, 1).y + " " + pb(0, 1).x + "," + pb(0, 1).y
    const trPts = pAo.x + "," + pAo.y + " " + pAe1.x + "," + pAe1.y + " " + pAe3.x + "," + pAe3.y + " " + pAe2.x + "," + pAe2.y
    return (
        <svg viewBox="0 0 360 210" className="ch-diagram-svg">
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
            <text x={pb(1, 0).x + 5} y={pb(1, 0).y + 5} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">e1</text>
            <text x={pb(0, 1).x - 20} y={pb(0, 1).y} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">e2</text>
            <line x1="145" y1="115" x2="180" y2="115" stroke="#3a3a50" strokeWidth="2" markerEnd="url(#mtg)" />
            <text x="148" y="108" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">A *</text>
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
            <text x={pAe1.x + 5} y={pAe1.y + 5} fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace">Ae1</text>
            <text x={pAe2.x - 26} y={pAe2.y} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">Ae2</text>
        </svg>
    )
}

export { DiagramBlock }
