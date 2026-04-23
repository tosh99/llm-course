import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-14.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { SCALED_DOT_PRODUCT_TABS } from "./topics/scaled-dot-product/tabs"
import { MULTI_HEAD_TABS } from "./topics/multi-head/tabs"
import { POSITIONAL_ENCODING_TABS } from "./topics/positional-encoding/tabs"
import { ENCODER_DECODER_TABS } from "./topics/encoder-decoder/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter14Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("scaled-dot-product")
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
        "scaled-dot-product": SCALED_DOT_PRODUCT_TABS[activeTab],
        "multi-head":         MULTI_HEAD_TABS[activeTab],
        "positional-encoding": POSITIONAL_ENCODING_TABS[activeTab],
        "encoder-decoder":    ENCODER_DECODER_TABS[activeTab],
    }

    return (
        <div className="ch14">
            {/* ── Header ── */}
            <header className="ch14-header">
                <span className="ch14-header-chapter">Ch. 14</span>
                <div className="ch14-header-sep" />
                <span className="ch14-header-title">The Transformer</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch14-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch14-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch14-sidebar-divider" />}
                        <div className="ch14-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch14-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch14-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch14-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch14-main">
                {/* Topic header */}
                <div className="ch14-topic-header">
                    <div className="ch14-eyebrow">{topic.eyebrow}</div>
                    <div className="ch14-topic-title">{topicLabel}</div>
                    <div className="ch14-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch14-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch14-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch14-content ch14-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch14-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch14-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
