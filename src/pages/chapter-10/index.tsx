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

const TAB_IDS = TABS.map((t) => t.id)

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter10Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("word2vec")
    const [activeTab, setActiveTab] = useState<TabId>("history")
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)

    const topic = TOPIC_META[activeTopic]
    const activeTopicEntry = TOPICS.find((t) => t.id === activeTopic)
    const topicLabel = activeTopicEntry?.label ?? ""
    const isReady = activeTopicEntry?.ready ?? false

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

    const selectTopic = (id: TopicId) => {
        setActiveTopic(id)
        setActiveTab("history")
        setMobileNavOpen(false)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        const dy = e.changedTouches[0].clientY - touchStartY.current
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
        const idx = TAB_IDS.indexOf(activeTab)
        if (dx < 0 && idx < TAB_IDS.length - 1) setActiveTab(TAB_IDS[idx + 1])
        if (dx > 0 && idx > 0) setActiveTab(TAB_IDS[idx - 1])
    }

    const tabContent: Record<TopicId, React.ReactNode> = {
        word2vec:          WORD2VEC_TABS[activeTab],
        glove:             GLOVE_TABS[activeTab],
        fasttext:          FASTTEXT_TABS[activeTab],
        embeddings:        EMBEDDINGS_TABS[activeTab],
        "language-modeling": LANGUAGE_MODELING_TABS[activeTab],
        perplexity:        PERPLEXITY_TABS[activeTab],
    }

    return (
        <div className="ch">
            {/* ── Header ── */}
            <header className="ch-header">
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch-header-chapter">Ch. 10</span></Link>
                <div className="ch-header-sep" />
                <span className="ch-header-title">Word Representations</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch-header-badge">ML → LLM Course</span></Link>
            </header>
            {/* ── Sidebar ── */}
            <nav className="ch-sidebar" aria-label="Chapter topics">
                <button
                    className={`ch-mobile-toggle${mobileNavOpen ? " open" : ""}`}
                    onClick={() => setMobileNavOpen((v) => !v)}
                >
                    <span className="ch-nav-icon">{activeTopicEntry?.icon}</span>
                    <span>{topicLabel}</span>
                    <span className="ch-mobile-chevron">▾</span>
                </button>

                <div className={`ch-sidebar-items${mobileNavOpen ? " open" : ""}`}>
                    {categories.map((cat, ci) => (
                        <div key={cat}>
                            {ci > 0 && <div className="ch-sidebar-divider" />}
                            <div className="ch-sidebar-label">{cat}</div>
                            {TOPICS.filter((t) => t.category === cat).map((t) => (
                                <div
                                    key={t.id}
                                    className={`ch-nav-item${activeTopic === t.id ? " active" : ""}`}
                                    onClick={() => selectTopic(t.id)}
                                >
                                    <span className="ch-nav-icon">{t.icon}</span>
                                    {t.label}
                                    <span className="ch-nav-dot" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </nav>

            {/* ── Main ── */}
            <main className="ch-main">
                {/* Topic header */}
                <div className="ch-topic-header">
                    <div className="ch-eyebrow">{topic.eyebrow}</div>
                    <h1 className="ch-topic-title">{topicLabel}</h1>
                    <div className="ch-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <article className="ch-content ch-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </article>
            </main>
        </div>
    )
}
