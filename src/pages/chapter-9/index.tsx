import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-9.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { MOMENTUM_TABS } from "./topics/momentum/tabs"
import { ADAM_TABS } from "./topics/adam/tabs"
import { BATCH_NORMALIZATION_TABS } from "./topics/batch-normalization/tabs"
import { LAYER_NORMALIZATION_TABS } from "./topics/layer-normalization/tabs"
import { LR_SCHEDULES_TABS } from "./topics/lr-schedules/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter9Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("momentum")
    const [activeTab, setActiveTab] = useState<TabId>("history")
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

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

    const tabContent: Record<TopicId, React.ReactNode> = {
        momentum:             MOMENTUM_TABS[activeTab],
        adam:                 ADAM_TABS[activeTab],
        "batch-normalization": BATCH_NORMALIZATION_TABS[activeTab],
        "layer-normalization": LAYER_NORMALIZATION_TABS[activeTab],
        "lr-schedules":       LR_SCHEDULES_TABS[activeTab],
    }

    return (
        <div className="ch">
            {/* ── Header ── */}
            <header className="ch-header">
                <span className="ch-header-chapter">Ch. 9</span>
                <div className="ch-header-sep" />
                <span className="ch-header-title">Optimization &amp; Training</span>
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
                <article className="ch-content ch-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
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
