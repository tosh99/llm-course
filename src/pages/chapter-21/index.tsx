import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-21.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { LLAMA_TABS } from "./topics/llama/tabs"
import { MISTRAL_TABS } from "./topics/mistral/tabs"
import { LORA_TABS } from "./topics/lora/tabs"
import { QLORA_TABS } from "./topics/qlora/tabs"
import { QUANTIZATION_TABS } from "./topics/quantization/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter21Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("llama")
    const [activeTab, setActiveTab] = useState<TabId>("history")
    const contentRef = useRef<HTMLDivElement>(null)

    const topic = TOPIC_META[activeTopic]
    const topicLabel = TOPICS.find((t) => t.id === activeTopic)?.label ?? ""
    const isReady = TOPICS.find((t) => t.id === activeTopic)?.ready ?? false

    useEffect(() => {
        if (!contentRef.current || !window.renderMathInElement) return
        window.renderMathInElement(contentRef.current, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
            ],
            throwOnError: false,
        })
    }, [activeTopic, activeTab])

    const categories = [...new Set(TOPICS.map((t) => t.category))]

    const tabContent: Record<TopicId, React.ReactNode> = {
        llama:         LLAMA_TABS[activeTab],
        mistral:       MISTRAL_TABS[activeTab],
        lora:          LORA_TABS[activeTab],
        qlora:         QLORA_TABS[activeTab],
        quantization:  QUANTIZATION_TABS[activeTab],
    }

    return (
        <div className="ch21">
            {/* ── Header ── */}
            <header className="ch21-header">
                <span className="ch21-header-chapter">Ch. 21</span>
                <div className="ch21-header-sep" />
                <span className="ch21-header-title">Open LLMs &amp; Efficiency</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch21-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch21-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch21-sidebar-divider" />}
                        <div className="ch21-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch21-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch21-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch21-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch21-main">
                {/* Topic header */}
                <div className="ch21-topic-header">
                    <div className="ch21-eyebrow">{topic.eyebrow}</div>
                    <div className="ch21-topic-title">{topicLabel}</div>
                    <div className="ch21-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch21-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch21-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch21-content ch21-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch21-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch21-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
