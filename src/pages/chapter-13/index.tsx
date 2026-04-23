import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-13.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { GRU_TABS } from "./topics/gru/tabs"
import { BIDIRECTIONAL_TABS } from "./topics/bidirectional/tabs"
import { DEEP_RNNS_TABS } from "./topics/deep-rnns/tabs"
import { SEQUENTIAL_PARALLELISM_TABS } from "./topics/sequential-parallelism/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter13Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("gru")
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
        gru:                   GRU_TABS[activeTab],
        bidirectional:         BIDIRECTIONAL_TABS[activeTab],
        "deep-rnns":           DEEP_RNNS_TABS[activeTab],
        "sequential-parallelism": SEQUENTIAL_PARALLELISM_TABS[activeTab],
    }

    return (
        <div className="ch13">
            {/* ── Header ── */}
            <header className="ch13-header">
                <span className="ch13-header-chapter">Ch. 13</span>
                <div className="ch13-header-sep" />
                <span className="ch13-header-title">Gated Units &amp; Advanced RNNs</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch13-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch13-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch13-sidebar-divider" />}
                        <div className="ch13-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch13-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch13-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch13-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch13-main">
                {/* Topic header */}
                <div className="ch13-topic-header">
                    <div className="ch13-eyebrow">{topic.eyebrow}</div>
                    <div className="ch13-topic-title">{topicLabel}</div>
                    <div className="ch13-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch13-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch13-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch13-content ch13-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch13-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch13-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
