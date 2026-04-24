import { DiagramBlock } from "../../shared"

// ── Diagrams ─────────────────────────────────────────────────────────────────

export function CpuGpuDiagram() {
    const w = 400, h = 200

    const cpuCores = Array.from({ length: 6 }, (_, i) => ({
        x: 22 + (i % 2) * 80,
        y: 38 + Math.floor(i / 2) * 48,
    }))

    const gpuCores = Array.from({ length: 80 }, (_, i) => ({
        x: 217 + (i % 10) * 17,
        y: 38 + Math.floor(i / 10) * 15,
    }))

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="200" y="14" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">CPU vs GPU — ARCHITECTURE</text>

            <text x="97" y="26" textAnchor="middle" fill="#e8a838" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="700">CPU</text>
            <text x="97" y="34" textAnchor="middle" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">4–12 cores · 3–5 GHz each</text>

            {cpuCores.map((c, i) => (
                <g key={i}>
                    <rect x={c.x} y={c.y} width="70" height="38" rx="3"
                        fill="rgba(232,168,56,0.1)" stroke="#e8a838" strokeWidth="1.2" />
                    <text x={c.x + 35} y={c.y + 20} textAnchor="middle" fill="#e8a838" fontSize="6" fontFamily="JetBrains Mono,monospace" fontWeight="600">Core</text>
                    <text x={c.x + 35} y={c.y + 31} textAnchor="middle" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">cache + ctrl</text>
                </g>
            ))}

            <line x1="200" y1="22" x2="200" y2="182" stroke="#252535" strokeWidth="1" strokeDasharray="4 3" />

            <text x="302" y="26" textAnchor="middle" fill="#5ab98c" fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="700">GPU</text>
            <text x="302" y="34" textAnchor="middle" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">1000–16384 cores · ~1–2 GHz each</text>

            {gpuCores.map((c, i) => (
                <rect key={i} x={c.x} y={c.y} width="12" height="11" rx="1"
                    fill="rgba(90,185,140,0.18)" stroke="#5ab98c" strokeWidth="0.5" />
            ))}

            <text x="97" y="188" textAnchor="middle" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">few, powerful, general-purpose</text>
            <text x="302" y="188" textAnchor="middle" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">many, simple, parallel — 80 of thousands shown</text>
        </svg>
    )
}

export function MemoryHierarchyDiagram() {
    const w = 400, h = 210

    const levels = [
        { label: "Registers", size: "bytes", latency: "~1 ns", color: "#9b7fc7", barW: 40 },
        { label: "L1 Cache", size: "32–64 KB", latency: "~4 ns", color: "#e8a838", barW: 85 },
        { label: "L2 Cache", size: "256 KB–1 MB", latency: "~12 ns", color: "#5ab98c", barW: 140 },
        { label: "L3 Cache", size: "4–64 MB", latency: "~40 ns", color: "#5a9ab9", barW: 195 },
        { label: "RAM / VRAM", size: "8–80 GB", latency: "~100 ns", color: "#8e8a82", barW: 250 },
        { label: "NVMe SSD", size: "≥ 1 TB", latency: "~100 μs", color: "#5e5b56", barW: 295 },
    ]

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />

            <text x="200" y="14" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">MEMORY HIERARCHY — SIZE vs SPEED</text>

            <text x="10" y="26" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">↑ fastest / smallest</text>
            <text x="390" y="26" textAnchor="end" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">bar width ∝ relative size</text>

            {levels.map((level, i) => {
                const y = 32 + i * 29
                return (
                    <g key={i}>
                        <text x="86" y={y + 15} textAnchor="end" fill={level.color} fontSize="5" fontFamily="JetBrains Mono,monospace" fontWeight="600">{level.label}</text>
                        <rect x="90" y={y} width={level.barW} height="21" rx="2"
                            fill={`${level.color}18`} stroke={level.color} strokeWidth="1" />
                        <text x="395" y={y + 9} textAnchor="end" fill="#cdc9c0" fontSize="4.5" fontFamily="JetBrains Mono,monospace">{level.size}</text>
                        <text x="395" y={y + 19} textAnchor="end" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">{level.latency}</text>
                    </g>
                )
            })}

            <text x="10" y="202" fill="#5e5b56" fontSize="4" fontFamily="JetBrains Mono,monospace">↓ slowest / largest</text>
        </svg>
    )
}

export { DiagramBlock }
