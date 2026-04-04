import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-3.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { KMEANS_TABS } from "./topics/kmeans/tabs"
import { HIERARCHICAL_TABS } from "./topics/hierarchical/tabs"
import { PCA_TABS } from "./topics/pca/tabs"
import { GMM_EM_TABS } from "./topics/gmm-em/tabs"
import { AUTOENCODERS_TABS } from "./topics/autoencoders/tabs"
import type { TabId, TopicId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter3Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("kmeans")
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
        kmeans:       KMEANS_TABS[activeTab],
        hierarchical: HIERARCHICAL_TABS[activeTab],
        pca:          PCA_TABS[activeTab],
        "gmm-em":     GMM_EM_TABS[activeTab],
        autoencoders: AUTOENCODERS_TABS[activeTab],
    }

    return (
        <div className="ch3">
            {/* ── Header ── */}
            <header className="ch3-header">
                <span className="ch3-header-chapter">Ch. 3</span>
                <div className="ch3-header-sep" />
                <span className="ch3-header-title">Unsupervised Learning</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch3-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch3-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch3-sidebar-divider" />}
                        <div className="ch3-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch3-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch3-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch3-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch3-main">
                {/* Topic header */}
                <div className="ch3-topic-header">
                    <div className="ch3-eyebrow">{topic.eyebrow}</div>
                    <div className="ch3-topic-title">{topicLabel}</div>
                    <div className="ch3-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch3-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch3-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch3-content ch3-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch3-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch3-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
