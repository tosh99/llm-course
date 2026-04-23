import { Link } from "react-router"
import "./home-page.css"

// ── Data ─────────────────────────────────────────────────────────────────────

interface Chapter {
    num: string
    title: string
    era?: string
    topics: string[]
    route?: string
}

interface Part {
    label: string
    title: string
    era?: string
    chapters: Chapter[]
}

const CURRICULUM: Part[] = [
    {
        label: "Prerequisites",
        title: "Mathematics & Programming Foundations",
        chapters: [
            {
                num: "Ch. 0",
                title: "Prerequisites & Foundations",
                topics: ["Linear Algebra", "Calculus", "Probability", "Information Theory", "Python", "Computing"],
                route: "/chapter/0",
            },
        ],
    },
    {
        label: "Part I",
        title: "Classical Machine Learning",
        era: "1950s – 2000s",
        chapters: [
            {
                num: "Ch. 1",
                title: "The Perceptron & Early Neural Concepts",
                era: "1943 – 1969",
                topics: ["McCulloch-Pitts Neuron", "Hebb's Rule", "Rosenblatt Perceptron", "XOR Problem"],
                route: "/chapter/1",
            },
            {
                num: "Ch. 2",
                title: "Classical ML Algorithms",
                era: "1960s – 1990s",
                topics: ["Linear Regression", "Decision Trees", "SVM", "Ensembles", "Regularization"],
                route: "/chapter/2",
            },
            {
                num: "Ch. 3",
                title: "Unsupervised Learning",
                era: "1960s – 2000s",
                topics: ["k-Means", "Hierarchical Clustering", "PCA", "Gaussian Mixtures", "EM Algorithm"],
                route: "/chapter/3",
            },
        ],
    },
    {
        label: "Part II",
        title: "The Backpropagation Era & Neural Network Revival",
        era: "1986 – 2005",
        chapters: [
            {
                num: "Ch. 4",
                title: "Backpropagation & MLPs",
                era: "1986",
                topics: ["Backprop", "MLP", "Activation Functions", "Gradient Descent", "Vanishing Gradients", "Autoencoders"],
                route: "/chapter/4",
            },
            {
                num: "Ch. 5",
                title: "Recurrent Neural Networks",
                era: "1986 – 1997",
                topics: ["Elman / Jordan RNN", "BPTT", "Vanishing Gradient", "LSTM"],
                route: "/chapter/5",
            },
            {
                num: "Ch. 6",
                title: "Convolutional Neural Networks",
                era: "1989 – 1998",
                topics: ["Weight Sharing", "LeNet-5", "Conv + Pool", "Feature Hierarchies"],
                route: "/chapter/6",
            },
        ],
    },
    {
        label: "Part III",
        title: "The Deep Learning Revolution",
        era: "2006 – 2014",
        chapters: [
            {
                num: "Ch. 7",
                title: "Deep Learning Reignition",
                era: "2006 – 2012",
                topics: ["Deep Belief Nets", "RBMs", "ReLU", "Dropout"],
                route: "/chapter/7",
            },
            {
                num: "Ch. 8",
                title: "CNN Architectures",
                era: "2012 – 2016",
                topics: ["AlexNet", "VGGNet", "GoogLeNet", "ResNet", "DenseNet", "GANs", "ViT"],
                route: "/chapter/8",
            },
            {
                num: "Ch. 9",
                title: "Optimization & Training Techniques",
                era: "2012 – 2018",
                topics: ["Momentum", "Adam", "Batch Norm", "Layer Norm", "LR Schedules"],
                route: "/chapter/9",
            },
            {
                num: "Ch. 10",
                title: "Word Representations",
                era: "2013 – 2017",
                topics: ["Word2Vec", "GloVe", "FastText", "Embeddings", "Language Modeling", "Perplexity"],
                route: "/chapter/10",
            },
        ],
    },
    {
        label: "Part IV",
        title: "Sequence Modeling & Attention",
        era: "2014 – 2017",
        chapters: [
            {
                num: "Ch. 11",
                title: "Encoder-Decoder & Seq2Seq",
                era: "2014",
                topics: ["Seq2Seq", "LSTM Encoder-Decoder", "Machine Translation", "Teacher Forcing", "BLEU / ROUGE"],
                route: "/chapter/11",
            },
            {
                num: "Ch. 12",
                title: "Attention Mechanism",
                era: "2015",
                topics: ["Bahdanau Attention", "Alignment Scores", "Luong Attention", "Soft vs Hard"],
                route: "/chapter/12",
            },
            {
                num: "Ch. 13",
                title: "Gated Units & Advanced RNNs",
                era: "2014 – 2017",
                topics: ["GRU", "Bidirectional RNN", "Deep RNNs", "Sequential Parallelism"],
                route: "/chapter/13",
            },
        ],
    },
    {
        label: "Part V",
        title: "The Transformer & Pre-training Era",
        era: "2017 – 2020",
        chapters: [
            {
                num: "Ch. 14",
                title: "The Transformer",
                era: "2017",
                topics: ["Scaled Dot-Product Attention", "Multi-Head Attention", "Positional Encoding", "Encoder / Decoder"],
                route: "/chapter/14",
            },
            {
                num: "Ch. 15",
                title: "Transfer Learning & Pre-training",
                era: "2018",
                topics: ["ULMFiT", "ELMo", "GPT-1", "Pre-train → Fine-tune"],
                route: "/chapter/15",
            },
            {
                num: "Ch. 16",
                title: "BERT & Masked Language Modeling",
                era: "2018 – 2019",
                topics: ["BERT", "MLM", "NSP", "RoBERTa", "Encoder-Only"],
                route: "/chapter/16",
            },
            {
                num: "Ch. 17",
                title: "Scaling Up: GPT-2 & T5",
                era: "2019",
                topics: ["GPT-2", "T5", "Scaling Laws", "Zero-Shot", "Text-to-Text"],
                route: "/chapter/17",
            },
        ],
    },
    {
        label: "Part VI",
        title: "Large Language Models",
        era: "2020 – present",
        chapters: [
            {
                num: "Ch. 18",
                title: "The Scaling Hypothesis",
                era: "2020",
                topics: ["Kaplan Scaling Laws", "Power Laws", "Emergent Abilities", "Chinchilla"],
                route: "/chapter/18",
            },
            {
                num: "Ch. 19",
                title: "GPT-3 & Few-Shot Learning",
                era: "2020",
                topics: ["GPT-3 (175B)", "In-Context Learning", "Zero / One / Few-Shot", "Prompt Engineering"],
                route: "/chapter/19",
            },
            {
                num: "Ch. 20",
                title: "Instruction Tuning & RLHF",
                era: "2021 – 2022",
                topics: ["InstructGPT", "SFT", "Reward Model", "PPO", "Constitutional AI"],
                route: "/chapter/20",
            },
            {
                num: "Ch. 21",
                title: "Open LLMs & Efficiency",
                era: "2022 – 2023",
                topics: ["LLaMA", "Mistral 7B", "LoRA", "QLoRA", "Quantization"],
                route: "/chapter/21",
            },
            {
                num: "Ch. 22",
                title: "Transformer Architecture Advances",
                era: "2020 – 2024",
                topics: ["Flash Attention", "GQA / MQA", "RoPE", "MoE", "KV Cache"],
            },
            {
                num: "Ch. 23",
                title: "Multimodal Models",
                era: "2021 – 2024",
                topics: ["CLIP", "DALL-E", "Flamingo", "GPT-4V", "Gemini"],
            },
            {
                num: "Ch. 24",
                title: "Retrieval-Augmented Generation",
                era: "2020 – 2024",
                topics: ["RAG", "DPR", "Vector Databases", "Chunking", "Re-ranking"],
            },
            {
                num: "Ch. 25",
                title: "Agents & Tool Use",
                era: "2022 – 2024",
                topics: ["ReAct", "Toolformer", "Function Calling", "Planning", "Multi-Agent"],
            },
        ],
    },
    {
        label: "Part VII",
        title: "Frontiers",
        era: "2024 – present",
        chapters: [
            {
                num: "Ch. 26",
                title: "Long Context & Memory",
                era: "2023 – present",
                topics: ["128K+ Context", "Positional Interpolation", "Needle-in-Haystack", "External Memory"],
            },
            {
                num: "Ch. 27",
                title: "Reasoning & Chain-of-Thought",
                era: "2022 – present",
                topics: ["CoT Prompting", "Self-Consistency", "Tree of Thoughts", "o1 / o3", "DeepSeek-R1"],
            },
            {
                num: "Ch. 28",
                title: "Alignment, Safety & Evaluation",
                era: "2020 – present",
                topics: ["Red-Teaming", "Hallucination", "MMLU / BIG-Bench", "LLM-as-Judge", "Bias & Fairness"],
            },
        ],
    },
]

const APPENDICES = [
    "A — Practical Tools & Ecosystem",
    "B — Key Papers Reading List",
    "C — Compute & Infrastructure",
]

// ── Component ─────────────────────────────────────────────────────────────────

export function HomePage() {
    const totalChapters = CURRICULUM.reduce((n, p) => n + p.chapters.length, 0)

    return (
        <div className="hp">
            {/* ── Header ── */}
            <header className="hp-header">
                <span className="hp-header-title">DeepLearn</span>
                <div className="hp-header-sep" />
                <span className="hp-header-sub">ML → LLM Course</span>
                <span className="hp-header-badge">2025 Edition</span>
            </header>

            {/* ── Hero ── */}
            <section className="hp-hero">
                <div className="hp-hero-eyebrow">Progressive Curriculum</div>
                <h1 className="hp-hero-title">
                    Machine Learning to<br />Large Language Models
                </h1>
                <p className="hp-hero-desc">
                    A self-study curriculum tracing the historical development of ML, deep learning,
                    and modern LLMs — from the 1943 perceptron to today's reasoning models.
                </p>
                <div className="hp-hero-stats">
                    <div className="hp-stat">
                        <span className="hp-stat-num">{totalChapters}</span>
                        <span className="hp-stat-label">Chapters</span>
                    </div>
                    <div className="hp-stat">
                        <span className="hp-stat-num">7</span>
                        <span className="hp-stat-label">Parts</span>
                    </div>
                    <div className="hp-stat">
                        <span className="hp-stat-num">80+</span>
                        <span className="hp-stat-label">Years of History</span>
                    </div>
                </div>
            </section>

            {/* ── Table of Contents ── */}
            <div className="hp-toc">
                {CURRICULUM.map((part) => (
                    <div key={part.label} className="hp-part">
                        <div className="hp-part-header">
                            <span className="hp-part-num">{part.label}</span>
                            <span className="hp-part-title">{part.title}</span>
                            {part.era && <span className="hp-part-era">{part.era}</span>}
                        </div>

                        {part.chapters.map((ch) =>
                            ch.route ? (
                                <Link key={ch.num} to={ch.route} className="hp-chapter available">
                                    <ChapterRow ch={ch} />
                                </Link>
                            ) : (
                                <div key={ch.num} className="hp-chapter">
                                    <ChapterRow ch={ch} />
                                </div>
                            )
                        )}
                    </div>
                ))}

                {/* ── Appendix ── */}
                <div className="hp-appendix">
                    <div className="hp-appendix-title">Appendix</div>
                    <div className="hp-appendix-items">
                        {APPENDICES.map((a) => (
                            <div key={a} className="hp-appendix-item">{a}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChapterRow({ ch }: { ch: Chapter }) {
    return (
        <>
            <span className="hp-ch-num">{ch.num}</span>
            <div className="hp-ch-body">
                <div className="hp-ch-title">{ch.title}</div>
                <div className="hp-ch-topics">
                    {ch.topics.map((t) => (
                        <span key={t} className="hp-ch-topic">{t}</span>
                    ))}
                </div>
            </div>
            <div className="hp-ch-right">
                {ch.era && <span className="hp-ch-era">{ch.era}</span>}
                <span className="hp-ch-status-dot" />
            </div>
        </>
    )
}
