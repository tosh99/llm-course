import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-0.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { INFORMATION_THEORY_TABS } from "./topics/information-theory/tabs"
import { PYTHON_TABS } from "./topics/python/tabs"
import { LINEAR_ALGEBRA_TABS } from "./topics/linear-algebra/tabs"
import { CALCULUS_TABS } from "./topics/calculus/tabs"
import { PROBABILITY_TABS } from "./topics/probability/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter0Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("linear-algebra")
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
        "linear-algebra": LINEAR_ALGEBRA_TABS[activeTab],
        calculus: CALCULUS_TABS[activeTab],
        probability: PROBABILITY_TABS[activeTab],
        "information-theory": INFORMATION_THEORY_TABS[activeTab],
        python: PYTHON_TABS[activeTab],
        computing: null,
    }

    return (
        <div className="ch0">
            {/* ── Header ── */}
            <header className="ch0-header">
                <span className="ch0-header-chapter">Ch. 0</span>
                <div className="ch0-header-sep" />
                <span className="ch0-header-title">Prerequisites &amp; Foundations</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch0-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch0-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch0-sidebar-divider" />}
                        <div className="ch0-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch0-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch0-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch0-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch0-main">
                {/* Topic header */}
                <div className="ch0-topic-header">
                    <div className="ch0-eyebrow">{topic.eyebrow}</div>
                    <div className="ch0-topic-title">{topicLabel}</div>
                    <div className="ch0-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch0-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch0-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch0-content ch0-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch0-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch0-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
