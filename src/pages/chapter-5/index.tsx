import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-5.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { SIMPLE_RNN_TABS } from "./topics/simple-rnn/tabs"
import { BPTT_TABS } from "./topics/bptt/tabs"
import { VANISHING_GRADIENT_TABS } from "./topics/vanishing-gradient/tabs"
import { LSTM_TABS } from "./topics/lstm/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter5Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("simple-rnn")
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
        "simple-rnn": SIMPLE_RNN_TABS[activeTab],
        bptt: BPTT_TABS[activeTab],
        "vanishing-gradient": VANISHING_GRADIENT_TABS[activeTab],
        lstm: LSTM_TABS[activeTab],
    }

    return (
        <div className="ch5">
            {/* ── Header ── */}
            <header className="ch5-header">
                <span className="ch5-header-chapter">Ch. 5</span>
                <div className="ch5-header-sep" />
                <span className="ch5-header-title">Recurrent Neural Networks</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch5-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch5-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch5-sidebar-divider" />}
                        <div className="ch5-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch5-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch5-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch5-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch5-main">
                {/* Topic header */}
                <div className="ch5-topic-header">
                    <div className="ch5-eyebrow">{topic.eyebrow}</div>
                    <div className="ch5-topic-title">{topicLabel}</div>
                    <div className="ch5-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch5-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch5-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch5-content ch5-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch5-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch5-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
