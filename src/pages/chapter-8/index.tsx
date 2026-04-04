import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-8.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { ALEXNET_TABS } from "./topics/alexnet/tabs"
import { VGGNET_TABS } from "./topics/vggnet/tabs"
import { GOOGLENET_TABS } from "./topics/googlenet/tabs"
import { RESNET_TABS } from "./topics/resnet/tabs"
import { DENSENET_TABS } from "./topics/densenet/tabs"
import type { TabId } from "./types"

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter8Page() {
    const [activeTopic, setActiveTopic] = useState<string>("alexnet")
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

    const tabContent: Record<string, React.ReactNode> = {
        alexnet: ALEXNET_TABS[activeTab],
        vggnet: VGGNET_TABS[activeTab],
        googlenet: GOOGLENET_TABS[activeTab],
        resnet: RESNET_TABS[activeTab],
        densenet: DENSENET_TABS[activeTab],
    }

    return (
        <div className="ch8">
            {/* ── Header ── */}
            <header className="ch8-header">
                <span className="ch8-header-chapter">Ch. 8</span>
                <div className="ch8-header-sep" />
                <span className="ch8-header-title">CNN Architectures</span>
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch8-header-badge">ML → LLM Course</span></Link>
            </header>

            {/* ── Sidebar ── */}
            <nav className="ch8-sidebar">
                {categories.map((cat, ci) => (
                    <div key={cat}>
                        {ci > 0 && <div className="ch8-sidebar-divider" />}
                        <div className="ch8-sidebar-label">{cat}</div>
                        {TOPICS.filter((t) => t.category === cat).map((topic) => (
                            <div
                                key={topic.id}
                                className={`ch8-nav-item${activeTopic === topic.id ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTopic(topic.id)
                                    setActiveTab("history")
                                }}
                            >
                                <span className="ch8-nav-icon">{topic.icon}</span>
                                {topic.label}
                                <span className="ch8-nav-dot" />
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* ── Main ── */}
            <main className="ch8-main">
                {/* Topic header */}
                <div className="ch8-topic-header">
                    <div className="ch8-eyebrow">{topic.eyebrow}</div>
                    <div className="ch8-topic-title">{topicLabel}</div>
                    <div className="ch8-topic-subtitle">{topic.subtitle}</div>

                    {/* Tabs */}
                    <div className="ch8-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`ch8-tab-btn${activeTab === tab.id ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="ch8-content ch8-fade" ref={contentRef} key={`${activeTopic}-${activeTab}`}>
                    {isReady ? (
                        tabContent[activeTopic] ?? (
                            <div className="ch8-coming-soon">
                                Content for <strong>{topicLabel}</strong> is coming soon.
                            </div>
                        )
                    ) : (
                        <div className="ch8-coming-soon">
                            Content for <strong>{topicLabel}</strong> is coming soon.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
