import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-15.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { ULMFIT_TABS } from "./topics/ulmfit/tabs"
import { ELMO_TABS } from "./topics/elmo/tabs"
import { GPT1_TABS } from "./topics/gpt1/tabs"
import { PRETRAIN_FINETUNE_TABS } from "./topics/pretrain-finetune/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter15Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("ulmfit")
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
        ulmfit:            ULMFIT_TABS[activeTab],
        elmo:              ELMO_TABS[activeTab],
        gpt1:              GPT1_TABS[activeTab],
        "pretrain-finetune": PRETRAIN_FINETUNE_TABS[activeTab],
    }

    return (
        <div className="ch15">
            {/* ── Header ── */}
            <header className="ch15-header">
                <span className="ch15-header-chapter">Ch. 15</span>
                <div className="ch15-header-sep" />
                <span className="ch15-header-title">Transfer Learning &amp; Pre-training</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch15-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch15-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch15-sidebar-divider" />}
                        <div className="ch15-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch15-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch15-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch15-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch15-main">
                {/* Topic header */}
                <div className="ch15-topic-header">
                    <div className="ch15-eyebrow">{topic.eyebrow}</div>
                    <div className="ch15-topic-title">{topicLabel}</div>
                    <div className="ch15-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch15-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch15-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch15-content ch15-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch15-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch15-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
