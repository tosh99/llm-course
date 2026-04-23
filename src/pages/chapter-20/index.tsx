import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-20.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { INSTRUCTGPT_TABS } from "./topics/instructgpt/tabs"
import { SFT_TABS } from "./topics/sft/tabs"
import { REWARD_MODEL_TABS } from "./topics/reward-model/tabs"
import { PPO_TABS } from "./topics/ppo/tabs"
import { CONSTITUTIONAL_AI_TABS } from "./topics/constitutional-ai/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter20Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("instructgpt")
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
        instructgpt:       INSTRUCTGPT_TABS[activeTab],
        sft:               SFT_TABS[activeTab],
        "reward-model":    REWARD_MODEL_TABS[activeTab],
        ppo:               PPO_TABS[activeTab],
        "constitutional-ai": CONSTITUTIONAL_AI_TABS[activeTab],
    }

    return (
        <div className="ch20">
            {/* ── Header ── */}
            <header className="ch20-header">
                <span className="ch20-header-chapter">Ch. 20</span>
                <div className="ch20-header-sep" />
                <span className="ch20-header-title">Instruction Tuning &amp; RLHF</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch20-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch20-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch20-sidebar-divider" />}
                        <div className="ch20-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch20-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch20-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch20-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch20-main">
                {/* Topic header */}
                <div className="ch20-topic-header">
                    <div className="ch20-eyebrow">{topic.eyebrow}</div>
                    <div className="ch20-topic-title">{topicLabel}</div>
                    <div className="ch20-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch20-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch20-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch20-content ch20-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch20-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch20-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
