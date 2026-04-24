import { pt } from "../../shared"

// Simple gradient descent visualization on a 3D bowl
export function GradientDescentDiagram() {
    const cx = 180, cy = 105, s = 36
    const p = pt(cx, cy, s)

    return (
        <svg viewBox="0 0 360 220" className="ch-diagram-svg">
            <defs>
                <marker id="gda" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#e8a838" /></marker>
                <marker id="gdb" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#5a9ab9" /></marker>
            </defs>
            <rect width="360" height="220" fill="#0f0f14" rx="4" />

            {/* Grid lines */}
            {[-2, -1, 0, 1, 2].map(i => (
                <g key={i} stroke="#18181f" strokeWidth="1">
                    <line x1={p(i, -2.5).x} y1={p(-2.5, 2).y} x2={p(i, 0).x} y2={p(0, 0).y} />
                    <line x1={p(-2.5, i).x} y1={p(0, 2).y} x2={p(0, i).x} y2={p(0, 0).y} />
                </g>
            ))}

            {/* Contour lines (bowl shape) */}
            <ellipse cx={cx} cy={cy + 10} rx={120} ry={48} fill="none" stroke="#252535" strokeWidth="1" />
            <ellipse cx={cx} cy={cy + 10} rx={90} ry={36} fill="none" stroke="#252535" strokeWidth="1" />
            <ellipse cx={cx} cy={cy + 10} rx={60} ry={24} fill="none" stroke="#252535" strokeWidth="1" />
            <ellipse cx={cx} cy={cy + 10} rx={30} ry={12} fill="none" stroke="#252535" strokeWidth="1" />

            {/* Gradient descent path */}
            <polyline
                points={`${p(-2, -2).x},${p(-2, -2).y} ${p(-1.5, -1).x},${p(-1.5, -1).y} ${p(-0.8, -0.3).x},${p(-0.8, -0.3).y} ${p(0, 0).x},${p(0, 0).y}`}
                fill="none"
                stroke="#e8a838"
                strokeWidth="2"
                strokeDasharray="6,3"
            />

            {/* Start point */}
            <circle cx={p(-2, -2).x} cy={p(-2, -2).y} r="4" fill="#5a9ab9" />
            <text x={p(-2, -2).x + 8} y={p(-2, -2).y - 8} fill="#5a9ab9" fontSize="6" fontFamily="JetBrains Mono,monospace">x₀</text>

            {/* Middle points */}
            <circle cx={p(-1.5, -1).x} cy={p(-1.5, -1).y} r="3" fill="#e8a838" opacity="0.6" />
            <circle cx={p(-0.8, -0.3).x} cy={p(-0.8, -0.3).y} r="3" fill="#e8a838" opacity="0.8" />

            {/* End point (minimum) */}
            <circle cx={p(0, 0).x} cy={p(0, 0).y} r="5" fill="#5ab98c" />
            <text x={p(0, 0).x + 10} y={p(0, 0).y - 8} fill="#5ab98c" fontSize="6" fontFamily="JetBrains Mono,monospace">x* (min)</text>

            {/* Gradient arrow */}
            <line x1={p(-2, -2).x} y1={p(-2, -2).y} x2={p(-1.2, -1.2).x} y2={p(-1.2, -1.2).y} stroke="#e8a838" strokeWidth="2" markerEnd="url(#gda)" />
            <text x={p(-1.7, -1.7).x - 12} y={p(-1.7, -1.7).y - 8} fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">−∇f</text>

            <text x="270" y="30" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace">Gradient descent</text>
            <text x="270" y="50" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">xₜ₊₁ = xₜ − η∇f(xₜ)</text>
            <text x="270" y="72" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Step opposite to</text>
            <text x="270" y="86" fill="#e8a838" fontSize="4.5" fontFamily="JetBrains Mono,monospace">gradient direction</text>
        </svg>
    )
}

export function PartialDerivativeDiag() {
    const cx = 130, cy = 100, s = 36
    const p = pt(cx, cy, s)
    const mx = 0.5, my = 0.3
    const px = p(mx, my).x, py = p(mx, my).y

    return (
        <svg viewBox="0 0 360 210" className="ch-diagram-svg">
            <defs>
                <marker id="pda" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#e8a838" /></marker>
                <marker id="pdb" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto"><polygon points="0 0,5 2.5,0 5" fill="#5a9ab9" /></marker>
            </defs>
            <rect width="360" height="210" fill="#0f0f14" rx="4" />

            <text x="130" y="20" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">PARTIAL DERIVATIVES</text>

            {/* 3D Surface (simplified) */}
            <path d={`M${p(-2, -1).x},${p(-2, -1).y} L${p(2, -1.5).x},${p(2, -1.5).y} L${p(2, 1).x},${p(2, 1).y} L${p(-2, 0.5).x},${p(-2, 0.5).y} Z`}
                fill="rgba(232,168,56,0.08)" stroke="#e8a838" strokeWidth="1.5" />

            {/* Point on surface */}
            <circle cx={px} cy={py} r="5" fill="#5ab98c" />
            <text x={px + 10} y={py - 8} fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">f(x,y)</text>

            {/* Partial x - tangent line */}
            <line x1={p(-0.5, 0.3).x} y1={p(0.1, 0.3).y} x2={p(1.5, 0.3).x} y2={p(-0.6, 0.3).y}
                stroke="#e8a838" strokeWidth="2" markerEnd="url(#pda)" />
            <text x={p(1.5, 0.3).x - 35} y={p(1.5, 0.3).y + 20} fill="#e8a838" fontSize="4.5" fontFamily="JetBrains Mono,monospace">∂f/∂x</text>
            <text x={p(1.5, 0.3).x - 35} y={p(1.5, 0.3).y + 28} fill="#5e5b56" fontSize="3.5" fontFamily="JetBrains Mono,monospace">(y fixed)</text>

            {/* Partial y - tangent line */}
            <line x1={p(0.5, -0.8).x} y1={p(0.5, -0.8).y} x2={p(0.5, 1.2).x} y2={p(0.5, 1.2).y}
                stroke="#5a9ab9" strokeWidth="2" markerEnd="url(#pdb)" />
            <text x={p(0.5, 1.2).x + 10} y={p(0.5, 1.2).y - 4} fill="#5a9ab9" fontSize="4.5" fontFamily="JetBrains Mono,monospace">∂f/∂y</text>
            <text x={p(0.5, 1.2).x + 10} y={p(0.5, 1.2).y + 4} fill="#5e5b56" fontSize="3.5" fontFamily="JetBrains Mono,monospace">(x fixed)</text>

            {/* Info panel */}
            <rect x="240" y="45" width="110" height="150" rx="3" fill="#141420" stroke="#252535" strokeWidth="1" />
            <text x="250" y="67" fill="#cdc9c0" fontSize="5" fontFamily="JetBrains Mono,monospace">∇f = (∂f/∂x, ∂f/∂y)</text>
            <line x1="245" y1="77" x2="345" y2="77" stroke="#252535" strokeWidth="1" />
            <text x="250" y="95" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Each partial holds</text>
            <text x="250" y="109" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">other vars constant</text>
            <line x1="245" y1="119" x2="345" y2="119" stroke="#252535" strokeWidth="1" />
            <text x="250" y="137" fill="#e8a838" fontSize="4.5" fontFamily="JetBrains Mono,monospace">∂f/∂x: slope in x-dir</text>
            <text x="250" y="151" fill="#5a9ab9" fontSize="4.5" fontFamily="JetBrains Mono,monospace">∂f/∂y: slope in y-dir</text>
            <line x1="245" y1="161" x2="345" y2="161" stroke="#252535" strokeWidth="1" />
            <text x="250" y="179" fill="#5ab98c" fontSize="4.5" fontFamily="JetBrains Mono,monospace">Extend to ℝⁿ</text>
        </svg>
    )
}