import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-17.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { GPT2_TABS } from "./topics/gpt2/tabs"
import { SCALING_LAWS_TABS } from "./topics/scaling-laws/tabs"
import { T5_TABS } from "./topics/t5/tabs"
import { ZERO_SHOT_TABS } from "./topics/zero-shot/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter17Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("gpt2")
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
        gpt2:         GPT2_TABS[activeTab],
        "scaling-laws": SCALING_LAWS_TABS[activeTab],
        t5:           T5_TABS[activeTab],
        "zero-shot":  ZERO_SHOT_TABS[activeTab],
    }

    return (
        <div className="ch17">
            {/* ── Header ── */}
            <header className="ch17-header">
                <span className="ch17-header-chapter">Ch. 17</span>
                <div className="ch17-header-sep" />
                <span className="ch17-header-title">Scaling Up: GPT-2 &amp; T5</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch17-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch17-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch17-sidebar-divider" />}
                        <div className="ch17-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch17-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch17-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch17-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch17-main">
                {/* Topic header */}
                <div className="ch17-topic-header">
                    <div className="ch17-eyebrow">{topic.eyebrow}</div>
                    <div className="ch17-topic-title">{topicLabel}</div>
                    <div className="ch17-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch17-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch17-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch17-content ch17-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch17-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch17-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
