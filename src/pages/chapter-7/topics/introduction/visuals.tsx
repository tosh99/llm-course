import { DiagramBlock } from "../../shared"

// ── Introduction Topic: Visuals Tab ───────────────────────────────────────────

export function VisualsTab() {
    return (
        <>
            <h3>LeNet-5 Architecture Diagram</h3>
            <DiagramBlock title="Layer Dimensions and Connections">
                <svg viewBox="0 0 800 320" style={{ display: "block", width: "100%", height: "auto" }}>
                    <rect width="800" height="320" fill="#0d0d10" />

                    {/* Input */}
                    <g transform="translate(20, 160)">
                        <rect x="0" y="-32" width="32" height="32" fill="#1a1a25" stroke="#252530" strokeWidth="1" />
                        <text x="16" y="20" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">32×32</text>
                        <text x="16" y="45" textAnchor="middle" fill="#cdc9c0" fontSize="11" fontFamily="JetBrains Mono">Input</text>
                    </g>

                    <path d="M55 160 L70 160" stroke="#e8a838" strokeWidth="1.5" />

                    {/* C1 */}
                    <g transform="translate(80, 160)">
                        {[0, 1, 2].map((i) => (
                            <rect key={i} x={i * 3} y={-28 - i * 4} width="28" height="28" fill="#1a1a25" stroke="#e8a838" strokeWidth="1" opacity={0.6 + i * 0.2} />
                        ))}
                        <text x="14" y="25" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">6×28×28</text>
                        <text x="14" y="50" textAnchor="middle" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">C1</text>
                    </g>

                    <path d="M132 160 L145 160" stroke="#e8a838" strokeWidth="1.5" />

                    {/* S2 */}
                    <g transform="translate(155, 160)">
                        {[0, 1, 2].map((i) => (
                            <rect key={i} x={i * 2} y={-14 - i * 3} width="14" height="14" fill="#1a1a25" stroke="#5a9ab9" strokeWidth="1" opacity={0.6 + i * 0.2} />
                        ))}
                        <text x="7" y="25" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">6×14×14</text>
                        <text x="7" y="50" textAnchor="middle" fill="#5a9ab9" fontSize="11" fontFamily="JetBrains Mono">S2</text>
                    </g>

                    <path d="M187 160 L200 160" stroke="#5a9ab9" strokeWidth="1.5" />

                    {/* C3 */}
                    <g transform="translate(210, 160)">
                        <rect x="0" y="-20" width="20" height="20" fill="#1a1a25" stroke="#e8a838" strokeWidth="1" />
                        <rect x="4" y="-24" width="20" height="20" fill="#1a1a25" stroke="#e8a838" strokeWidth="1" />
                        <rect x="8" y="-28" width="20" height="20" fill="#1a1a25" stroke="#e8a838" strokeWidth="1" />
                        <text x="14" y="10" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">16×10×10</text>
                        <text x="14" y="35" textAnchor="middle" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">C3</text>
                    </g>

                    <path d="M250 160 L265 160" stroke="#e8a838" strokeWidth="1.5" />

                    {/* S4 */}
                    <g transform="translate(275, 160)">
                        <rect x="0" y="-10" width="10" height="10" fill="#1a1a25" stroke="#5a9ab9" strokeWidth="1" />
                        <rect x="3" y="-13" width="10" height="10" fill="#1a1a25" stroke="#5a9ab9" strokeWidth="1" />
                        <rect x="6" y="-16" width="10" height="10" fill="#1a1a25" stroke="#5a9ab9" strokeWidth="1" />
                        <text x="8" y="10" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">16×5×5</text>
                        <text x="8" y="35" textAnchor="middle" fill="#5a9ab9" fontSize="11" fontFamily="JetBrains Mono">S4</text>
                    </g>

                    <path d="M302 160 L325 160" stroke="#5a9ab9" strokeWidth="1.5" />

                    {/* C5 */}
                    <g transform="translate(335, 150)">
                        {[...Array(5)].map((_, i) => (
                            <circle key={i} cx={i * 6} cy="0" r="3" fill="#1a1a25" stroke="#9b7fc7" strokeWidth="1" />
                        ))}
                        <text x="12" y="25" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">120</text>
                        <text x="12" y="50" textAnchor="middle" fill="#9b7fc7" fontSize="11" fontFamily="JetBrains Mono">C5</text>
                    </g>

                    <path d="M375 150 L400 150" stroke="#9b7fc7" strokeWidth="1.5" />

                    {/* F6 */}
                    <g transform="translate(410, 145)">
                        {[...Array(4)].map((_, i) => (
                            <circle key={i} cx={i * 7} cy="0" r="3" fill="#1a1a25" stroke="#5ab98c" strokeWidth="1" />
                        ))}
                        <text x="10" y="30" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">84</text>
                        <text x="10" y="50" textAnchor="middle" fill="#5ab98c" fontSize="11" fontFamily="JetBrains Mono">F6</text>
                    </g>

                    <path d="M445 145 L470 150" stroke="#5ab98c" strokeWidth="1.5" />

                    {/* Output */}
                    <g transform="translate(485, 150)">
                        <rect x="0" y="-15" width="30" height="30" rx="4" fill="#1a1a25" stroke="#e8a838" strokeWidth="1.5" />
                        <text x="15" y="5" textAnchor="middle" fill="#e8a838" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">10</text>
                        <text x="15" y="35" textAnchor="middle" fill="#cdc9c0" fontSize="11" fontFamily="JetBrains Mono">Output</text>
                    </g>

                    <text x="400" y="30" textAnchor="middle" fill="#ede9e0" fontSize="14" fontFamily="Playfair Display">LeNet-5 (1998)</text>
                    <text x="400" y="50" textAnchor="middle" fill="#5e5b56" fontSize="10" fontFamily="JetBrains Mono">60,840 parameters</text>
                </svg>
            </DiagramBlock>

            <h3>Feature Hierarchy Visualization</h3>
            <DiagramBlock title="What CNNs Learn at Each Layer">
                <svg viewBox="0 0 800 200" style={{ display: "block", width: "100%", height: "auto" }}>
                    <rect width="800" height="200" fill="#0d0d10" />

                    {/* Layer 1: Edges */}
                    <g transform="translate(50, 100)">
                        <text x="0" y="-60" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">Layer 1</text>
                        <text x="0" y="-45" fill="#5e5b56" fontSize="9" fontFamily="JetBrains Mono">3×3 filters</text>
                        {[0, 1, 2, 3].map((i) => (
                            <g key={i} transform={`translate(${i * 35}, 0)`}>
                                <rect x="-15" y="-15" width="30" height="30" fill="#111115" stroke="#252530" />
                                <line x1="-10" y1={i * 5 - 7} x2="10" y2={i * 5 - 7} stroke="#cdc9c0" strokeWidth="2" opacity="0.7" />
                            </g>
                        ))}
                        <text x="52" y="45" textAnchor="middle" fill="#cdc9c0" fontSize="10" fontFamily="Crimson Pro" fontStyle="italic">Edge detectors</text>
                    </g>

                    <path d="M220 100 L250 100" stroke="#252530" strokeWidth="2" strokeDasharray="4" />

                    {/* Layer 2-3 */}
                    <g transform="translate(280, 100)">
                        <text x="0" y="-60" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">Layer 2-3</text>
                        <text x="0" y="-45" fill="#5e5b56" fontSize="9" fontFamily="JetBrains Mono">3×3 conv</text>
                        {[0, 1, 2].map((i) => (
                            <g key={i} transform={`translate(${i * 40}, 0)`}>
                                <rect x="-18" y="-18" width="36" height="36" fill="#111115" stroke="#252530" />
                                <g stroke="#cdc9c0" strokeWidth="1" opacity="0.5">
                                    <line x1="-12" y1="-12" x2="-12" y2="12" />
                                    <line x1="0" y1="-12" x2="0" y2="12" />
                                    <line x1="12" y1="-12" x2="12" y2="12" />
                                    <line x1="-12" y1={-12 + i * 8} x2="12" y2={-12 + i * 8} />
                                </g>
                            </g>
                        ))}
                        <text x="40" y="45" textAnchor="middle" fill="#cdc9c0" fontSize="10" fontFamily="Crimson Pro" fontStyle="italic">Textures</text>
                    </g>

                    <path d="M410 100 L440 100" stroke="#252530" strokeWidth="2" strokeDasharray="4" />

                    {/* Layer 4-5 */}
                    <g transform="translate(500, 100)">
                        <text x="0" y="-60" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">Layer 4-5</text>
                        <text x="0" y="-45" fill="#5e5b56" fontSize="9" fontFamily="JetBrains Mono">higher conv</text>
                        {[0, 1].map((i) => (
                            <g key={i} transform={`translate(${i * 50}, 0)`}>
                                <rect x="-22" y="-22" width="44" height="44" fill="#111115" stroke="#5a9ab9" strokeWidth="1" />
                                <circle cx="0" cy="0" r="10" fill="none" stroke="#5a9ab9" strokeWidth="2" opacity="0.6" />
                                <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#5a9ab9" strokeWidth="1" opacity="0.4" />
                            </g>
                        ))}
                        <text x="25" y="45" textAnchor="middle" fill="#cdc9c0" fontSize="10" fontFamily="Crimson Pro" fontStyle="italic">Object parts</text>
                    </g>

                    <path d="M600 100 L630 100" stroke="#252530" strokeWidth="2" strokeDasharray="4" />

                    {/* Layer 6+ */}
                    <g transform="translate(700, 100)">
                        <text x="0" y="-60" fill="#e8a838" fontSize="11" fontFamily="JetBrains Mono">Layer 6+</text>
                        <text x="0" y="-45" fill="#5e5b56" fontSize="9" fontFamily="JetBrains Mono">FC layers</text>
                        <rect x="-30" y="-30" width="60" height="60" fill="#111115" stroke="#9b7fc7" strokeWidth="1.5" rx="8" />
                        <text x="0" y="8" textAnchor="middle" fill="#9b7fc7" fontSize="24" fontFamily="Playfair Display">8</text>
                        <text x="0" y="45" textAnchor="middle" fill="#cdc9c0" fontSize="10" fontFamily="Crimson Pro" fontStyle="italic">Full objects</text>
                    </g>
                </svg>
            </DiagramBlock>
        </>
    )
}
