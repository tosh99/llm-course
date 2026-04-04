import { DiagramBlock } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function PythonEcosystemDiagram() {
    const w = 360, h = 200

    const layers = [
        { y: 32, label: "Application", color: "#5ab98c", items: ["Jupyter", "Scripts", "Web APIs"] },
        { y: 72, label: "ML Framework", color: "#e8a838", items: ["PyTorch", "TensorFlow", "JAX"] },
        { y: 112, label: "Scientific", color: "#5a9ab9", items: ["NumPy", "Pandas", "Matplotlib"] },
        { y: 152, label: "Python", color: "#9b7fc7", items: ["Interpreter", "Stdlib", "pip"] },
    ]

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch0-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="180" y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">THE PYTHON ML STACK</text>

            {layers.map((layer, i) => (
                <g key={i}>
                    <rect x="12" y={layer.y} width={w - 24} height="30" rx="3"
                        fill={`${layer.color}12`} stroke={layer.color} strokeWidth="1" />
                    <text x="24" y={layer.y + 18} fill={layer.color} fontSize="6" fontFamily="JetBrains Mono,monospace" fontWeight="600">{layer.label}</text>
                    {layer.items.map((item, j) => (
                        <text key={j} x={120 + j * 80} y={layer.y + 18} fill="#cdc9c0" fontSize="5" fontFamily="JetBrains Mono,monospace">{item}</text>
                    ))}
                    {i < layers.length - 1 && (
                        <>
                            <line x1="180" y1={layer.y + 30} x2="180" y2={layer.y + 38} stroke="#252535" strokeWidth="1" />
                            <polygon points="176,36 180,40 184,36" fill="#252535" transform={`translate(0,${layer.y})`} />
                        </>
                    )}
                </g>
            ))}
        </svg>
    )
}

export function ArrayMemoryDiagram() {
    const w = 360, h = 180

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch0-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="180" y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">PYTHON LIST vs NUMPY ARRAY</text>

            {/* Python list */}
            <text x="20" y="42" fill="#e8a838" fontSize="5.5" fontFamily="JetBrains Mono,monospace">Python list</text>
            {["3.14", "obj*", "obj*", "obj*", "2.71"].map((val, i) => (
                <g key={i}>
                    <rect x={20 + i * 58} y="50" width="52" height="24" rx="2" fill="#17171d" stroke="#252535" strokeWidth="1" />
                    <text x={46 + i * 58} y="66" textAnchor="middle" fill="#cdc9c0" fontSize="5" fontFamily="JetBrains Mono,monospace">{val}</text>
                </g>
            ))}
            <text x="20" y="90" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">scattered in memory · boxed objects · slow loops</text>

            {/* NumPy array */}
            <text x="20" y="112" fill="#5ab98c" fontSize="5.5" fontFamily="JetBrains Mono,monospace">NumPy array (float64)</text>
            {["3.14", "1.62", "0.58", "2.23", "2.71"].map((val, i) => (
                <g key={i}>
                    <rect x={20 + i * 58} y="120" width="52" height="24" rx="2" fill="rgba(90,185,140,0.1)" stroke="#5ab98c" strokeWidth="1" />
                    <text x={46 + i * 58} y="136" textAnchor="middle" fill="#cdc9c0" fontSize="5" fontFamily="JetBrains Mono,monospace">{val}</text>
                </g>
            ))}
            <text x="20" y="160" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">contiguous memory · raw floats · SIMD vectorised</text>
        </svg>
    )
}

export function BroadcastingDiagram() {
    const w = 360, h = 200

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch0-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="180" y="18" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">BROADCASTING — SHAPE EXPANSION</text>

            {/* (3,1) + (1,3) → (3,3) */}
            <text x="58" y="46" textAnchor="middle" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">(3,1)</text>
            {[1, 2, 3].map((_, i) => (
                <rect key={i} x="38" y={54 + i * 24} width="40" height="20" rx="2" fill="rgba(232,168,56,0.12)" stroke="#e8a838" strokeWidth="1" />
            ))}
            {[1, 2, 3].map((v, i) => (
                <text key={i} x="58" y={68 + i * 24} textAnchor="middle" fill="#cdc9c0" fontSize="6" fontFamily="JetBrains Mono,monospace">{v}</text>
            ))}

            <text x="108" y="78" textAnchor="middle" fill="#5e5b56" fontSize="8" fontFamily="JetBrains Mono,monospace">+</text>

            <text x="170" y="46" textAnchor="middle" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">(1,3)</text>
            {[4, 5, 6].map((_, i) => (
                <rect key={i} x={130 + i * 28} y="54" width="24" height="20" rx="2" fill="rgba(90,155,185,0.12)" stroke="#5a9ab9" strokeWidth="1" />
            ))}
            {[4, 5, 6].map((v, i) => (
                <text key={i} x={142 + i * 28} y="68" textAnchor="middle" fill="#cdc9c0" fontSize="6" fontFamily="JetBrains Mono,monospace">{v}</text>
            ))}

            <text x="220" y="78" textAnchor="middle" fill="#5e5b56" fontSize="8" fontFamily="JetBrains Mono,monospace">=</text>

            <text x="290" y="46" textAnchor="middle" fill="#5ab98c" fontSize="5" fontFamily="JetBrains Mono,monospace">(3,3)</text>
            {
                // Result matrix: [[5,6,7],[6,7,8],[7,8,9]]
                [[5, 6, 7], [6, 7, 8], [7, 8, 9]].map((row, i) =>
                    row.map((_, j) => (
                        <rect key={`${i}-${j}`} x={248 + j * 28} y={54 + i * 24} width="24" height="20" rx="2" fill="rgba(90,185,140,0.1)" stroke="#5ab98c" strokeWidth="1" />
                    ))
                )
            }
            {
                [[5, 6, 7], [6, 7, 8], [7, 8, 9]].map((row, i) =>
                    row.map((v, j) => (
                        <text key={`t-${i}-${j}`} x={260 + j * 28} y={68 + i * 24} textAnchor="middle" fill="#cdc9c0" fontSize="6" fontFamily="JetBrains Mono,monospace">{v}</text>
                    ))
                )
            }

            <text x="180" y="178" textAnchor="middle" fill="#5e5b56" fontSize="4.5" fontFamily="JetBrains Mono,monospace">NumPy auto-expands shapes — no loops needed</text>
        </svg>
    )
}

// Re-export DiagramBlock so topic files only need one import
export { DiagramBlock }
