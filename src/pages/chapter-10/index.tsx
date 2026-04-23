import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-10.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { WORD2VEC_TABS } from "./topics/word2vec/tabs"
import { GLOVE_TABS } from "./topics/glove/tabs"
import { FASTTEXT_TABS } from "./topics/fasttext/tabs"
import { EMBEDDINGS_TABS } from "./topics/embeddings/tabs"
import { LANGUAGE_MODELING_TABS } from "./topics/language-modeling/tabs"
import { PERPLEXITY_TABS } from "./topics/perplexity/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter10Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("word2vec")
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
        word2vec:          WORD2VEC_TABS[activeTab],
        glove:             GLOVE_TABS[activeTab],
        fasttext:          FASTTEXT_TABS[activeTab],
        embeddings:        EMBEDDINGS_TABS[activeTab],
        "language-modeling": LANGUAGE_MODELING_TABS[activeTab],
        perplexity:        PERPLEXITY_TABS[activeTab],
    }

    return (
        <div className="ch10">
            {/* ── Header ── */}
            <header className="ch10-header">
                <span className="ch10-header-chapter">Ch. 10</span>
                <div className="ch10-header-sep" />
                <span className="ch10-header-title">Word Representations</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch10-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch10-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch10-sidebar-divider" />}
                        <div className="ch10-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch10-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch10-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch10-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch10-main">
                {/* Topic header */}
                <div className="ch10-topic-header">
                    <div className="ch10-eyebrow">{topic.eyebrow}</div>
                    <div className="ch10-topic-title">{topicLabel}</div>
                    <div className="ch10-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch10-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch10-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch10-content ch10-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch10-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch10-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
