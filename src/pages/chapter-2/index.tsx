import { useEffect, useRef, useState } from "react"
import "./chapter-2.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { LINEAR_REGRESSION_TABS } from "./topics/linear-regression/tabs"
import { DECISION_TREES_TABS } from "./topics/decision-trees/tabs"
import { SVM_TABS } from "./topics/svm/tabs"
import { ENSEMBLES_TABS } from "./topics/ensembles/tabs"
import { REGULARIZATION_TABS } from "./topics/regularization/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter2Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("linear-regression")
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
        "linear-regression": LINEAR_REGRESSION_TABS[activeTab],
        "decision-trees": DECISION_TREES_TABS[activeTab],
        svm: SVM_TABS[activeTab],
        ensembles: ENSEMBLES_TABS[activeTab],
        regularization: REGULARIZATION_TABS[activeTab],
    }

    return (
        <div className="ch2">
            {/* ── Header ── */}
            <header className="ch2-header">
                <span className="ch2-header-chapter">Ch. 2</span>
                <div className="ch2-header-sep" />
                <span className="ch2-header-title">Classical ML Algorithms</span>
                <span className="ch2-header-badge">ML → LLM Course</span>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch2-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch2-sidebar-divider" />}
                        <div className="ch2-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch2-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch2-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch2-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch2-main">
                {/* Topic header */}
                <div className="ch2-topic-header">
                    <div className="ch2-eyebrow">{topic.eyebrow}</div>
                    <div className="ch2-topic-title">{topicLabel}</div>
                    <div className="ch2-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch2-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch2-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch2-content ch2-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch2-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch2-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
