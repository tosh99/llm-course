import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-19.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { GPT3_TABS } from "./topics/gpt3/tabs"
import { INCONTEXT_TABS } from "./topics/incontext/tabs"
import { FEWSHOT_TABS } from "./topics/fewshot/tabs"
import { PROMPT_TABS } from "./topics/prompt/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter19Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("gpt3")
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
        gpt3:      GPT3_TABS[activeTab],
        incontext: INCONTEXT_TABS[activeTab],
        fewshot:   FEWSHOT_TABS[activeTab],
        prompt:    PROMPT_TABS[activeTab],
    }

    return (
        <div className="ch19">
            {/* ── Header ── */}
            <header className="ch19-header">
                <span className="ch19-header-chapter">Ch. 19</span>
                <div className="ch19-header-sep" />
                <span className="ch19-header-title">GPT-3 &amp; Few-Shot Learning</span>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="ch19-header-badge">ML → LLM Course</span>
                </Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch19-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch19-sidebar-divider" />}
                        <div className="ch19-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((t) => (
                            <div
                                key={t.id}
                                className={`ch19-nav-item${activeTopic === t.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(t.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch19-nav-icon">{t.icon}</span>
                                {t.label}
                                <span className="ch19-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch19-main">
                {/* Topic header */}
                <div className="ch19-topic-header">
                    <div className="ch19-eyebrow">{topic.eyebrow}</div>
                    <div className="ch19-topic-title">{topicLabel}</div>
                    <div className="ch19-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch19-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch19-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="ch19-content ch19-fade"
                    ref={contentRef}
                    key={`${activeTopic}-${activeTab}`}
                >
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch19-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch19-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
