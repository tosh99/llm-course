import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-18.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { SCALING_LAWS_TABS } from "./topics/scaling-laws/tabs"
import { POWER_LAWS_TABS } from "./topics/power-laws/tabs"
import { EMERGENT_ABILITIES_TABS } from "./topics/emergent-abilities/tabs"
import { CHINCHILLA_TABS } from "./topics/chinchilla/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter18Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("scaling-laws")
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
        "scaling-laws":      SCALING_LAWS_TABS[activeTab],
        "power-laws":        POWER_LAWS_TABS[activeTab],
        "emergent-abilities": EMERGENT_ABILITIES_TABS[activeTab],
        "chinchilla":        CHINCHILLA_TABS[activeTab],
    }

    return (
        <div className="ch18">
            {/* ── Header ── */}
            <header className="ch18-header">
                <span className="ch18-header-chapter">Ch. 18</span>
                <div className="ch18-header-sep" />
                <span className="ch18-header-title">The Scaling Hypothesis</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch18-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch18-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch18-sidebar-divider" />}
                        <div className="ch18-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch18-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch18-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch18-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch18-main">
                {/* Topic header */}
                <div className="ch18-topic-header">
                    <div className="ch18-eyebrow">{topic.eyebrow}</div>
                    <div className="ch18-topic-title">{topicLabel}</div>
                    <div className="ch18-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch18-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch18-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch18-content ch18-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch18-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch18-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
