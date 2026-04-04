import { DiagramBlock } from "../../shared"

// ── Weight Sharing Topic: Visuals Tab ─────────────────────────────────────────

export function VisualsTab() {
    return (
        <>
            <h3>Convolution Operation Visualization</h3>
            <DiagramBlock title="Sliding a 3×3 Kernel Over a 5×5 Input">
                <svg viewBox="0 0 600 280" style={{ display: "block", width: "100%", height: "auto" }}>
                    <rect width="600" height="280" fill="#0d0d10" />

                    {/* Input grid 5x5 */}
                    <g transform="translate(60, 60)">
                        <text x="60" y="-30" textAnchor="middle" fill="#cdc9c0" fontSize="12" fontFamily="JetBrains Mono">Input (5×5)</text>
                        {[...Array(5)].map((_, row) =>
                            [...Array(5)].map((_, col) => (
                                <rect
                                    key={`${row}-${col}`}
                                    x={col * 25}
                                    y={row * 25}
                                    width="25"
                                    height="25"
                                    fill="#111115"
                                    stroke="#252530"
                                />
                            ))
                        )}
                        <rect x="25" y="25" width="75" height="75" fill="rgba(232,168,56,0.1)" stroke="#e8a838" strokeWidth="2" />
                    </g>

                    {/* Kernel */}
                    <g transform="translate(240, 100)">
                        <text x="20" y="-30" textAnchor="middle" fill="#e8a838" fontSize="12" fontFamily="JetBrains Mono">Kernel (3×3)</text>
                        {[...Array(3)].map((_, row) =>
                            [...Array(3)].map((_, col) => (
                                <rect
                                    key={`k-${row}-${col}`}
                                    x={col * 22}
                                    y={row * 22}
                                    width="22"
                                    height="22"
                                    fill="#1a1a25"
                                    stroke="#e8a838"
                                />
                            ))
                        )}
                        <text x="11" y="16" textAnchor="middle" fill="#cdc9c0" fontSize="10">1</text>
                        <text x="33" y="16" textAnchor="middle" fill="#cdc9c0" fontSize="10">0</text>
                        <text x="55" y="16" textAnchor="middle" fill="#cdc9c0" fontSize="10">-1</text>
                        <text x="11" y="38" textAnchor="middle" fill="#cdc9c0" fontSize="10">1</text>
                        <text x="33" y="38" textAnchor="middle" fill="#cdc9c0" fontSize="10">0</text>
                        <text x="55" y="38" textAnchor="middle" fill="#cdc9c0" fontSize="10">-1</text>
                        <text x="11" y="60" textAnchor="middle" fill="#cdc9c0" fontSize="10">1</text>
                        <text x="33" y="60" textAnchor="middle" fill="#cdc9c0" fontSize="10">0</text>
                        <text x="55" y="60" textAnchor="middle" fill="#cdc9c0" fontSize="10">-1</text>
                    </g>

                    <text x="320" y="130" textAnchor="middle" fill="#5e5b56" fontSize="16">→</text>

                    {/* Output grid */}
                    <g transform="translate(380, 72)">
                        <text x="50" y="-25" textAnchor="middle" fill="#5ab98c" fontSize="12" fontFamily="JetBrains Mono">Output (3×3)</text>
                        {[...Array(3)].map((_, row) =>
                            [...Array(3)].map((_, col) => (
                                <rect
                                    key={`o-${row}-${col}`}
                                    x={col * 35}
                                    y={row * 35}
                                    width="35"
                                    height="35"
                                    fill="#111115"
                                    stroke="#5ab98c"
                                />
                            ))
                        )}
                        <rect x="35" y="35" width="35" height="35" fill="rgba(90,185,140,0.2)" />
                    </g>

                    <text x="300" y="240" textAnchor="middle" fill="#8e8a82" fontSize="11" fontFamily="Crimson Pro" fontStyle="italic">
                        Output[i,j] = Σ_m Σ_n Input[i+m, j+n] × Kernel[m, n]
                    </text>
                </svg>
            </DiagramBlock>
        </>
    )
}
