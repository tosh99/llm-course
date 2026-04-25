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
                topics: ["Calculus", "Linear Algebra", "Probability", "Computing", "Python"],
                route: "/chapter/0",
            },
        ],
    },
    {
        label: "Part I",
        title: "Statistical Foundations",
        era: "1801 – 1958",
        chapters: [
            {
                num: "Ch. 1",
                title: "Statistical Learning Foundations",
                era: "1801 – 1958",
                topics: ["Linear Regression", "Correlation & PCA", "Statistical Inference", "Logistic Regression"],
                route: "/chapter/1",
            },
        ],
    },
    {
        label: "Part II",
        title: "Neural Origins & Information Theory",
        era: "1943 – 1969",
        chapters: [
            {
                num: "Ch. 2",
                title: "Neural Origins & Information Theory",
                era: "1943 – 1969",
                topics: ["McCulloch-Pitts Neuron", "Shannon's Information Theory", "Hebb's Rule", "Rosenblatt Perceptron", "XOR Problem"],
                route: "/chapter/2",
            },
        ],
    },
    {
        label: "Part III",
        title: "AI Winter & Parallel Algorithms",
        era: "1957 – 1984",
        chapters: [
            {
                num: "Ch. 3",
                title: "Unsupervised Learning",
                era: "1957 – 1977",
                topics: ["k-Means", "Hierarchical Clustering", "EM Algorithm", "Gaussian Mixtures"],
                route: "/chapter/3",
            },
            {
                num: "Ch. 4",
                title: "Decision Trees",
                era: "1979 – 1984",
                topics: ["ID3", "CART", "Gini vs Entropy Splitting", "Pruning"],
                route: "/chapter/4",
            },
        ],
    },
    {
        label: "Part IV",
        title: "Neural Renaissance",
        era: "1986 – 2001",
        chapters: [
            {
                num: "Ch. 5",
                title: "Backpropagation & MLPs",
                era: "1986",
                topics: ["Backpropagation", "Multi-layer Perceptrons", "Activation Functions", "Gradient Descent", "Vanishing Gradients", "Autoencoders"],
                route: "/chapter/5",
            },
            {
                num: "Ch. 6",
                title: "Recurrent Neural Networks",
                era: "1986 – 1997",
                topics: ["Jordan & Elman RNNs", "BPTT", "Vanishing Gradient", "LSTM", "Bidirectional RNN"],
                route: "/chapter/6",
            },
            {
                num: "Ch. 7",
                title: "Convolutional Neural Networks",
                era: "1989 – 1998",
                topics: ["Weight Sharing", "LeNet-5", "CNN Building Blocks", "Feature Hierarchies", "Why CNNs Stalled"],
                route: "/chapter/7",
            },
            {
                num: "Ch. 8",
                title: "Classical ML Maturation",
                era: "1992 – 2001",
                topics: ["SVM & Kernel Trick", "AdaBoost", "Random Forests", "Ridge & Lasso"],
                route: "/chapter/8",
            },
        ],
    },
    {
        label: "Part V",
        title: "Deep Learning Revolution",
        era: "2006 – 2014",
        chapters: [
            {
                num: "Ch. 9",
                title: "Deep Learning Reignition",
                era: "2006 – 2012",
                topics: ["Deep Belief Networks", "ReLU", "Weight Initialization", "Dropout", "AlexNet"],
                route: "/chapter/9",
            },
            {
                num: "Ch. 10",
                title: "CNN Architectures",
                era: "2012 – 2017",
                topics: ["AlexNet", "VGGNet", "GoogLeNet", "ResNet", "DenseNet"],
                route: "/chapter/10",
            },
            {
                num: "Ch. 11",
                title: "Generative Models",
                era: "2013 – 2014",
                topics: ["Variational Autoencoders", "GANs", "Conditional GANs"],
            },
            {
                num: "Ch. 12",
                title: "Optimization & Training Techniques",
                era: "2014 – 2018",
                topics: ["Momentum", "Adam", "Batch Normalization", "Layer Normalization", "LR Schedules"],
                route: "/chapter/12",
            },
            {
                num: "Ch. 13",
                title: "Word Representations",
                era: "2013 – 2017",
                topics: ["Word2Vec", "GloVe", "FastText", "Embeddings", "Language Modeling", "Perplexity"],
                route: "/chapter/13",
            },
        ],
    },
    {
        label: "Part VI",
        title: "Sequence Modeling & Attention",
        era: "2014 – 2017",
        chapters: [
            {
                num: "Ch. 14",
                title: "Seq2Seq & GRU",
                era: "2014",
                topics: ["Seq2Seq Architecture", "GRU", "LSTM Encoder-Decoder", "Teacher Forcing", "BLEU / ROUGE"],
                route: "/chapter/14",
            },
            {
                num: "Ch. 15",
                title: "Attention Mechanism",
                era: "2014 – 2015",
                topics: ["Bahdanau Attention", "Alignment Scores", "Luong Attention", "Soft vs Hard"],
                route: "/chapter/15",
            },
            {
                num: "Ch. 16",
                title: "Advanced RNNs",
                era: "2015 – 2017",
                topics: ["Pointer Networks", "Deep RNNs", "WaveNet", "Sequential Parallelism"],
                route: "/chapter/16",
            },
        ],
    },
    {
        label: "Part VII",
        title: "The Transformer",
        era: "2017",
        chapters: [
            {
                num: "Ch. 17",
                title: "The Transformer",
                era: "2017",
                topics: ["Scaled Dot-Product Attention", "Multi-Head Attention", "Positional Encoding", "Encoder / Decoder"],
                route: "/chapter/17",
            },
        ],
    },
    {
        label: "Part VIII",
        title: "The Pre-training Era",
        era: "2018 – 2019",
        chapters: [
            {
                num: "Ch. 18",
                title: "Transfer Learning & Pre-training",
                era: "2018",
                topics: ["ULMFiT", "ELMo", "GPT-1", "Pre-train → Fine-tune"],
                route: "/chapter/18",
            },
            {
                num: "Ch. 19",
                title: "BERT & Masked Language Modeling",
                era: "2018 – 2019",
                topics: ["BERT", "MLM", "NSP", "RoBERTa", "Encoder-Only"],
                route: "/chapter/19",
            },
            {
                num: "Ch. 20",
                title: "GPT-2 & T5",
                era: "2019",
                topics: ["GPT-2", "T5", "Scaling Preview", "Zero-Shot", "Text-to-Text"],
                route: "/chapter/20",
            },
        ],
    },
    {
        label: "Part IX",
        title: "The 2020 Inflection",
        era: "2020",
        chapters: [
            {
                num: "Ch. 21",
                title: "Vision Transformers",
                era: "2020 – 2021",
                topics: ["ViT", "Patch Embeddings", "DeiT", "ViT vs CNN"],
            },
            {
                num: "Ch. 22",
                title: "Scaling Laws & GPT-3",
                era: "2020",
                topics: ["Kaplan Scaling Laws", "Power Laws", "GPT-3 (175B)", "In-Context Learning", "Few-Shot"],
                route: "/chapter/22",
            },
        ],
    },
    {
        label: "Part X",
        title: "RLHF & Multimodal Era",
        era: "2021 – 2022",
        chapters: [
            {
                num: "Ch. 23",
                title: "LoRA & Efficient Adaptation",
                era: "2021",
                topics: ["LoRA", "Adapter Layers", "PEFT Taxonomy", "Prompt Tuning"],
            },
            {
                num: "Ch. 24",
                title: "Emergent Abilities & Chinchilla",
                era: "2022",
                topics: ["Emergent Abilities", "Chinchilla Scaling", "Phase Transitions"],
            },
            {
                num: "Ch. 25",
                title: "Instruction Tuning & RLHF",
                era: "2022",
                topics: ["InstructGPT", "SFT", "Reward Model", "PPO", "Constitutional AI"],
                route: "/chapter/25",
            },
            {
                num: "Ch. 26",
                title: "Multimodal Models — Vision & Language",
                era: "2021 – 2022",
                topics: ["CLIP", "DALL-E", "Flamingo"],
            },
            {
                num: "Ch. 27",
                title: "Retrieval-Augmented Generation",
                era: "2020 – 2022",
                topics: ["RAG", "Dense Passage Retrieval", "Vector Databases", "Chunking & Re-ranking"],
            },
        ],
    },
    {
        label: "Part XI",
        title: "Open LLMs & Efficiency",
        era: "2022 – 2023",
        chapters: [
            {
                num: "Ch. 28",
                title: "Transformer Architecture Advances",
                era: "2021 – 2023",
                topics: ["RoPE", "Flash Attention", "GQA / MQA", "Mixture of Experts", "KV Cache"],
            },
            {
                num: "Ch. 29",
                title: "Reasoning & Chain-of-Thought",
                era: "2022 – 2023",
                topics: ["Chain-of-Thought", "Self-Consistency", "Tree of Thoughts", "Process Rewards"],
            },
            {
                num: "Ch. 30",
                title: "Agents & Tool Use",
                era: "2022 – 2023",
                topics: ["ReAct", "Toolformer", "Function Calling", "Multi-Agent"],
            },
            {
                num: "Ch. 31",
                title: "Open LLMs",
                era: "2023",
                topics: ["LLaMA", "Llama 2", "Mistral 7B", "QLoRA", "Quantization"],
                route: "/chapter/31",
            },
            {
                num: "Ch. 32",
                title: "Long Context & Memory",
                era: "2023",
                topics: ["Positional Interpolation", "128K+ Context", "Needle-in-Haystack", "External Memory"],
            },
            {
                num: "Ch. 33",
                title: "Multimodal Models — GPT-4V & Gemini",
                era: "2023",
                topics: ["GPT-4V", "Gemini", "Multimodal Reasoning", "Audio & Video"],
            },
        ],
    },
    {
        label: "Part XII",
        title: "Alignment, Safety & Frontiers",
        era: "2020 – 2026",
        chapters: [
            {
                num: "Ch. 34",
                title: "Alignment, Safety & Evaluation",
                era: "2020 – present",
                topics: ["Red-Teaming", "Hallucination", "MMLU / BIG-Bench", "LLM-as-Judge", "Bias & Fairness"],
            },
            {
                num: "Ch. 35",
                title: "Test-Time Compute & Reasoning Models",
                era: "2024 – 2025",
                topics: ["OpenAI o1", "Process Reward Models", "DeepSeek-R1", "Test-Time Scaling"],
            },
            {
                num: "Ch. 36",
                title: "Frontier Open Models",
                era: "2024 – 2025",
                topics: ["Llama 3", "DeepSeek-V2 / V3", "Gemma", "MLA", "MoE at Frontier Scale"],
            },
            {
                num: "Ch. 37",
                title: "Agentic AI & Computer Use",
                era: "2024 – 2025",
                topics: ["Claude Computer Use", "SWE-agent", "Coding Agents", "Multi-Agent Orchestration"],
            },
            {
                num: "Ch. 38",
                title: "2025 – 2026 Horizon",
                era: "2025 – 2026",
                topics: ["o3 / o4", "Claude 3.7", "World Models", "Embodied AI", "Open Research Questions"],
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
        <main className="hp">
            {/* ── Header ── */}
            <header className="hp-header">
                <a href="#toc" className="hp-skip-link">Skip to curriculum</a>
                <span className="hp-header-title">DeepLearn</span>
                <div className="hp-header-sep" />
                <span className="hp-header-sub">ML → LLM Course</span>
                <span className="hp-header-badge">2025 Edition</span>
            </header>

            {/* ── Hero ── */}
            <section className="hp-hero" aria-labelledby="hp-hero-heading">
                <div className="hp-hero-eyebrow">Absolute Chronological Curriculum</div>
                <h1 id="hp-hero-heading" className="hp-hero-title">
                    Machine Learning to<br />Large Language Models
                </h1>
                <p className="hp-hero-desc">
                    A self-study curriculum tracing the historical development of ML, deep learning,
                    and modern LLMs — from Gauss's least squares in 1801 to reasoning models in 2025.
                    Every chapter follows strict chronological order.
                </p>
                <div className="hp-hero-stats" role="list" aria-label="Course statistics">
                    <div className="hp-stat" role="listitem">
                        <span className="hp-stat-num">{totalChapters}</span>
                        <span className="hp-stat-label">Chapters</span>
                    </div>
                    <div className="hp-stat" role="listitem">
                        <span className="hp-stat-num">12</span>
                        <span className="hp-stat-label">Parts</span>
                    </div>
                    <div className="hp-stat" role="listitem">
                        <span className="hp-stat-num">225</span>
                        <span className="hp-stat-label">Years of History</span>
                    </div>
                </div>
            </section>

            {/* ── Table of Contents ── */}
            <nav id="toc" className="hp-toc" aria-label="Curriculum">
                {CURRICULUM.map((part) => (
                    <section key={part.label} className="hp-part">
                        <div className="hp-part-header">
                            <span className="hp-part-num">{part.label}</span>
                            <h2 className="hp-part-title">{part.title}</h2>
                            {part.era && <span className="hp-part-era">{part.era}</span>}
                        </div>

                        {part.chapters.map((ch) =>
                            ch.route ? (
                                <Link key={ch.num} to={ch.route} className="hp-chapter available">
                                    <ChapterRow ch={ch} />
                                </Link>
                            ) : (
                                <div key={ch.num} className="hp-chapter" aria-disabled="true">
                                    <ChapterRow ch={ch} />
                                </div>
                            )
                        )}
                    </section>
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
            </nav>
        </main>
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
