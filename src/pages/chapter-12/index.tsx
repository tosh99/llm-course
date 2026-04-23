import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-12.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { BAHDANAU_TABS } from "./topics/bahdanau/tabs"
import { ALIGNMENT_SCORES_TABS } from "./topics/alignment-scores/tabs"
import { LUONG_TABS } from "./topics/luong/tabs"
import { SOFT_HARD_TABS } from "./topics/soft-hard/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter12Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("bahdanau")
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
        bahdanau:          BAHDANAU_TABS[activeTab],
        "alignment-scores": ALIGNMENT_SCORES_TABS[activeTab],
        luong:             LUONG_TABS[activeTab],
        "soft-hard":       SOFT_HARD_TABS[activeTab],
    }

    return (
        <div className="ch12">
            {/* ── Header ── */}
            <header className="ch12-header">
                <span className="ch12-header-chapter">Ch. 12</span>
                <div className="ch12-header-sep" />
                <span className="ch12-header-title">Attention Mechanism</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch12-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch12-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch12-sidebar-divider" />}
                        <div className="ch12-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch12-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch12-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch12-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch12-main">
                {/* Topic header */}
                <div className="ch12-topic-header">
                    <div className="ch12-eyebrow">{topic.eyebrow}</div>
                    <div className="ch12-topic-title">{topicLabel}</div>
                    <div className="ch12-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch12-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch12-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch12-content ch12-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch12-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch12-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
