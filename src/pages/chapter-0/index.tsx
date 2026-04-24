import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import "./chapter-0.css"
import { TABS, TOPIC_META, TOPICS } from "./data"
import { COMPUTING_TABS } from "./topics/computing/tabs"
import { MUTUAL_INFORMATION_TABS } from "./topics/mutual-information/tabs"
import { PYTHON_TABS } from "./topics/python/tabs"
import { VECTORS_MATRICES_TABS } from "./topics/vectors-matrices/tabs"
import { SYSTEMS_EQUATIONS_TABS } from "./topics/systems-equations/tabs"
import { EIGENVALUES_TABS } from "./topics/eigenvalues/tabs"
import { SVD_DECOMPOSITIONS_TABS } from "./topics/svd-decompositions/tabs"
import { DERIVATIVES_GRADIENTS_TABS } from "./topics/derivatives-gradients/tabs"
import { INTEGRAL_CALCULUS_TABS } from "./topics/integral-calculus/tabs"
import { PROBABILITY_FOUNDATIONS_TABS } from "./topics/probability-foundations/tabs"
import { STATISTICAL_INFERENCE_TABS } from "./topics/statistical-inference/tabs"
import { ENTROPY_KL_DIVERGENCE_TABS } from "./topics/entropy-kl-divergence/tabs"
import type { TabId, TopicId } from "./types"

const TAB_IDS = TABS.map((t) => t.id)

// ── Main component ────────────────────────────────────────────────────────────

export function Chapter0Page() {
    const [activeTopic, setActiveTopic] = useState<TopicId>("vectors-matrices")
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
        "vectors-matrices": VECTORS_MATRICES_TABS[activeTab],
        "systems-equations": SYSTEMS_EQUATIONS_TABS[activeTab],
        "eigenvalues": EIGENVALUES_TABS[activeTab],
        "svd-decompositions": SVD_DECOMPOSITIONS_TABS[activeTab],
        "derivatives-gradients": DERIVATIVES_GRADIENTS_TABS[activeTab],
        "integral-calculus": INTEGRAL_CALCULUS_TABS[activeTab],
        "probability-foundations": PROBABILITY_FOUNDATIONS_TABS[activeTab],
        "statistical-inference": STATISTICAL_INFERENCE_TABS[activeTab],
        "entropy-kl-divergence": ENTROPY_KL_DIVERGENCE_TABS[activeTab],
        "mutual-information": MUTUAL_INFORMATION_TABS[activeTab],
        python: PYTHON_TABS[activeTab],
        computing: COMPUTING_TABS[activeTab],
    }

    return (
        <div className="ch">
            {/* ── Header ── */}
            <header className="ch-header">
                <Link to="/" style={{ textDecoration: 'none' }}><span className="ch-header-chapter">Ch. 0</span></Link>
                <div className="ch-header-sep" />
                <span className="ch-header-title">Prerequisites &amp; Foundations</span>
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
