import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-1.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { MCCULLOCH_PITTS_TABS } from "./topics/mcculloch-pitts/tabs"
import { HEBBIAN_TABS } from "./topics/hebbian/tabs"
import { PERCEPTRON_TABS } from "./topics/perceptron/tabs"
import { XOR_TABS } from "./topics/xor/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter1Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("mcculloch-pitts")
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
        "mcculloch-pitts": MCCULLOCH_PITTS_TABS[activeTab],
        hebbian: HEBBIAN_TABS[activeTab],
        perceptron: PERCEPTRON_TABS[activeTab],
        "xor-problem": XOR_TABS[activeTab],
    }

    return (
        <div className="ch1">
            {/* ── Header ── */}
            <header className="ch1-header">
                <span className="ch1-header-chapter">Ch. 1</span>
                <div className="ch1-header-sep" />
                <span className="ch1-header-title">The Perceptron &amp; Early Neural Concepts</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch1-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch1-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch1-sidebar-divider" />}
                        <div className="ch1-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch1-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch1-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch1-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch1-main">
                {/* Topic header */}
                <div className="ch1-topic-header">
                    <div className="ch1-eyebrow">{topic.eyebrow}</div>
                    <div className="ch1-topic-title">{topicLabel}</div>
                    <div className="ch1-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch1-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch1-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch1-content ch1-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch1-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch1-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
