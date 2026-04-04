import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-7.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { DEEP_BELIEF_NETWORKS_TABS } from "./topics/deep-belief-networks/tabs"
import { RELU_TABS } from "./topics/relu/tabs"
import { DROPOUT_TABS } from "./topics/dropout/tabs"
import { INITIALIZATION_TABS } from "./topics/initialization/tabs"
import { ALEXNET_TABS } from "./topics/alexnet/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter7Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("deep-belief-networks")
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
        "deep-belief-networks": DEEP_BELIEF_NETWORKS_TABS[activeTab],
        "relu": RELU_TABS[activeTab],
        "dropout": DROPOUT_TABS[activeTab],
        "initialization": INITIALIZATION_TABS[activeTab],
        "alexnet": ALEXNET_TABS[activeTab],
    }

    return (
        <div className="ch7">
            {/* ── Header ── */}
            <header className="ch7-header">
                <span className="ch7-header-chapter">Ch. 7</span>
                <div className="ch7-header-sep" />
                <span className="ch7-header-title">Deep Learning Reignition</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch7-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch7-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch7-sidebar-divider" />}
                        <div className="ch7-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch7-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch7-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch7-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch7-main">
                {/* Topic header */}
                <div className="ch7-topic-header">
                    <div className="ch7-eyebrow">{topic.eyebrow}</div>
                    <div className="ch7-topic-title">{topicLabel}</div>
                    <div className="ch7-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch7-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch7-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch7-content ch7-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch7-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch7-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
