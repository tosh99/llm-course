import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-16.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { BERT_TABS } from "./topics/bert/tabs"
import { MLM_TABS } from "./topics/mlm/tabs"
import { NSP_TABS } from "./topics/nsp/tabs"
import { ROBERTA_TABS } from "./topics/roberta/tabs"
import { ENCODER_ONLY_TABS } from "./topics/encoder-only/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter16Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("bert")
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
        bert:          BERT_TABS[activeTab],
        mlm:           MLM_TABS[activeTab],
        nsp:           NSP_TABS[activeTab],
        roberta:       ROBERTA_TABS[activeTab],
        "encoder-only": ENCODER_ONLY_TABS[activeTab],
    }

    return (
        <div className="ch16">
            {/* ── Header ── */}
            <header className="ch16-header">
                <span className="ch16-header-chapter">Ch. 16</span>
                <div className="ch16-header-sep" />
                <span className="ch16-header-title">BERT &amp; Masked Language Modeling</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch16-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch16-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch16-sidebar-divider" />}
                        <div className="ch16-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch16-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch16-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch16-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch16-main">
                {/* Topic header */}
                <div className="ch16-topic-header">
                    <div className="ch16-eyebrow">{topic.eyebrow}</div>
                    <div className="ch16-topic-title">{topicLabel}</div>
                    <div className="ch16-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch16-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch16-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch16-content ch16-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch16-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch16-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
