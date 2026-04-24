import { DiagramBlock } from "../../shared"

export function SVDDiagram() {
    return (
        <svg viewBox="0 0 460 170" className="ch-diagram-svg">
            <defs>
                <marker id="svda" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#3a3a55" /></marker>
            </defs>
            <rect width="460" height="170" fill="#0f0f14" rx="4" />

            <text x="230" y="20" textAnchor="middle" fill="#5e5b56" fontSize="5" fontFamily="JetBrains Mono,monospace" letterSpacing="2">A = U Sigma V^T</text>

            <circle cx="52" cy="95" r="34" fill="rgba(90,155,185,0.08)" stroke="#5a9ab9" strokeWidth="1.5" />
            <line x1="18" y1="95" x2="86" y2="95" stroke="#5a9ab9" strokeWidth="1" opacity="0.3" />
            <line x1="52" y1="61" x2="52" y2="129" stroke="#5a9ab9" strokeWidth="1" opacity="0.3" />
            <text x="52" y="143" textAnchor="middle" fill="#5a9ab9" fontSize="5" fontFamily="JetBrains Mono,monospace">input</text>
            <text x="52" y="156" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">unit circle</text>

            <line x1="96" y1="95" x2="128" y2="95" stroke="#3a3a55" strokeWidth="1.5" markerEnd="url(#svda)" />
            <text x="112" y="86" textAnchor="middle" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">V^T</text>
            <text x="112" y="113" textAnchor="middle" fill="#3a3a55" fontSize="4.5" fontFamily="JetBrains Mono,monospace">rotate</text>

            <circle cx="160" cy="95" r="34" fill="rgba(155,127,199,0.06)" stroke="#9b7fc7" strokeWidth="1.5" />
            <line x1="126" y1="95" x2="194" y2="95" stroke="#9b7fc7" strokeWidth="1" opacity="0.3" transform="rotate(-35,160,95)" />
            <line x1="160" y1="61" x2="160" y2="129" stroke="#9b7fc7" strokeWidth="1" opacity="0.3" transform="rotate(-35,160,95)" />
            <text x="160" y="143" textAnchor="middle" fill="#9b7fc7" fontSize="5" fontFamily="JetBrains Mono,monospace">rotated</text>

            <line x1="204" y1="95" x2="236" y2="95" stroke="#3a3a55" strokeWidth="1.5" markerEnd="url(#svda)" />
            <text x="220" y="86" textAnchor="middle" fill="#e8a838" fontSize="5" fontFamily="JetBrains Mono,monospace">Sigma</text>
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

export { DiagramBlock }
