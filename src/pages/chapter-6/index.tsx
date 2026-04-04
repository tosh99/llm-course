import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-6.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import type { TabId, TopicId } from "./types"

// ── Topic Tab Imports ─────────────────────────────────────────────────────────

import { INTRODUCTION_TABS } from "./topics/introduction/tabs"
import { WEIGHT_SHARING_TABS } from "./topics/weight-sharing/tabs"
import { LENET_TABS } from "./topics/lenet/tabs"
import { BUILDING_BLOCKS_TABS } from "./topics/building-blocks/tabs"
import { FEATURE_HIERARCHIES_TABS } from "./topics/feature-hierarchies/tabs"
import { WHY_CNNS_STALLED_TABS } from "./topics/why-cnns-stalled/tabs"

// ── Main component ─────────────────────────────────────────────────────────────

export function Chapter6Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("introduction")
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
        introduction: INTRODUCTION_TABS[activeTab],
        "weight-sharing": WEIGHT_SHARING_TABS[activeTab],
        lenet: LENET_TABS[activeTab],
        "building-blocks": BUILDING_BLOCKS_TABS[activeTab],
        "feature-hierarchies": FEATURE_HIERARCHIES_TABS[activeTab],
        "why-cnns-stalled": WHY_CNNS_STALLED_TABS[activeTab],
    }

    return (
        <div className="ch6">
            {/* ── Header ── */}
            <header className="ch6-header">
                <span className="ch6-header-chapter">Ch. 6</span>
                <div className="ch6-header-sep" />
                <span className="ch6-header-title">Convolutional Neural Networks</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch6-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch6-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch6-sidebar-divider" />}
                        <div className="ch6-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch6-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch6-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch6-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch6-main">
                {/* Topic header */}
                <div className="ch6-topic-header">
                    <div className="ch6-eyebrow">{topic.eyebrow}</div>
                    <div className="ch6-topic-title">{topicLabel}</div>
                    <div className="ch6-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch6-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch6-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch6-content ch6-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch6-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch6-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
