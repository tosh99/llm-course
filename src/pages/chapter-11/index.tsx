import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-11.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import type { TabId, TopicId } from "./types"

// ── Topic Tab Imports ─────────────────────────────────────────────────────────

import { SEQ2SEQ_TABS } from "./topics/seq2seq/tabs"
import { LSTM_ENCODER_DECODER_TABS } from "./topics/lstm-encoder-decoder/tabs"
import { MACHINE_TRANSLATION_TABS } from "./topics/machine-translation/tabs"
import { TEACHER_FORCING_TABS } from "./topics/teacher-forcing/tabs"
import { EVALUATION_METRICS_TABS } from "./topics/evaluation-metrics/tabs"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter11Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("seq2seq")
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
        "seq2seq":              SEQ2SEQ_TABS[activeTab],
        "lstm-encoder-decoder": LSTM_ENCODER_DECODER_TABS[activeTab],
        "machine-translation":  MACHINE_TRANSLATION_TABS[activeTab],
        "teacher-forcing":      TEACHER_FORCING_TABS[activeTab],
        "evaluation-metrics":   EVALUATION_METRICS_TABS[activeTab],
    }

    return (
        <div className="ch11">
            {/* ── Header ── */}
            <header className="ch11-header">
                <span className="ch11-header-chapter">Ch. 11</span>
                <div className="ch11-header-sep" />
                <span className="ch11-header-title">Encoder-Decoder &amp; Seq2Seq</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch11-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch11-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch11-sidebar-divider" />}
                        <div className="ch11-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch11-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch11-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch11-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch11-main">
                {/* Topic header */}
                <div className="ch11-topic-header">
                    <div className="ch11-eyebrow">{topic.eyebrow}</div>
                    <div className="ch11-topic-title">{topicLabel}</div>
                    <div className="ch11-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch11-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch11-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch11-content ch11-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch11-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch11-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
