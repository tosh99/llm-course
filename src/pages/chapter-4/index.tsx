import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-4.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { BACKPROPAGATION_TABS } from "./topics/backpropagation/tabs"
import { MLP_TABS } from "./topics/mlp/tabs"
import { ACTIVATION_FUNCTIONS_TABS } from "./topics/activation-functions/tabs"
import { GRADIENT_DESCENT_TABS } from "./topics/gradient-descent/tabs"
import { VANISHING_GRADIENTS_TABS } from "./topics/vanishing-gradients/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter4Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("backpropagation")
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
        backpropagation: BACKPROPAGATION_TABS[activeTab],
        mlp: MLP_TABS[activeTab],
        "activation-functions": ACTIVATION_FUNCTIONS_TABS[activeTab],
        "gradient-descent": GRADIENT_DESCENT_TABS[activeTab],
        "vanishing-gradients": VANISHING_GRADIENTS_TABS[activeTab],
    }

    return (
        <div className="ch4">
            {/* ── Header ── */}
            <header className="ch4-header">
                <span className="ch4-header-chapter">Ch. 4</span>
                <div className="ch4-header-sep" />
                <span className="ch4-header-title">Backpropagation &amp; MLPs</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch4-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch4-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch4-sidebar-divider" />}
                        <div className="ch4-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch4-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch4-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch4-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch4-main">
                {/* Topic header */}
                <div className="ch4-topic-header">
                    <div className="ch4-eyebrow">{topic.eyebrow}</div>
                    <div className="ch4-topic-title">{topicLabel}</div>
                    <div className="ch4-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch4-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch4-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch4-content ch4-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch4-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch4-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
