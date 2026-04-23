import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-9.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { MOMENTUM_TABS } from "./topics/momentum/tabs"
import { ADAM_TABS } from "./topics/adam/tabs"
import { BATCH_NORMALIZATION_TABS } from "./topics/batch-normalization/tabs"
import { LAYER_NORMALIZATION_TABS } from "./topics/layer-normalization/tabs"
import { LR_SCHEDULES_TABS } from "./topics/lr-schedules/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter9Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("momentum")
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
        momentum:             MOMENTUM_TABS[activeTab],
        adam:                 ADAM_TABS[activeTab],
        "batch-normalization": BATCH_NORMALIZATION_TABS[activeTab],
        "layer-normalization": LAYER_NORMALIZATION_TABS[activeTab],
        "lr-schedules":       LR_SCHEDULES_TABS[activeTab],
    }

    return (
        <div className="ch9">
            {/* ── Header ── */}
            <header className="ch9-header">
                <span className="ch9-header-chapter">Ch. 9</span>
                <div className="ch9-header-sep" />
                <span className="ch9-header-title">Optimization &amp; Training</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch9-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch9-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch9-sidebar-divider" />}
                        <div className="ch9-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch9-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch9-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch9-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch9-main">
                {/* Topic header */}
                <div className="ch9-topic-header">
                    <div className="ch9-eyebrow">{topic.eyebrow}</div>
                    <div className="ch9-topic-title">{topicLabel}</div>
                    <div className="ch9-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch9-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch9-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch9-content ch9-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch9-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch9-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
