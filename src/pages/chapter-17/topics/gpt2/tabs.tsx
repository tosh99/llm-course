import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From GPT-1 to GPT-2</h2>
            <p>
                In June 2018, OpenAI released GPT-1, a 117-million-parameter decoder-only transformer
                pretrained on BookCorpus and fine-tuned on downstream tasks. It proved the "pretrain then
                fine-tune" recipe could work for NLP. But the team suspected the real story was scale.
                Less than a year later, in February 2019, they unveiled GPT-2: a 1.5-billion-parameter
                model trained on WebText, a dataset of 8 million web pages curated by outbound links
                from Reddit. The results were startling — and controversial.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2018</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">GPT-1</div>
                    <div className="ch-tl-body">
                        GPT-1 established that a transformer decoder, pretrained with language modeling
                        on a large corpus and fine-tuned with task-specific heads, could outperform
                        approaches trained from scratch. But it was still small by modern standards and
                        required supervised fine-tuning for every new task.
                    </div>
                    <div className="ch-tl-impact">Impact: Proof of concept for generative pretraining</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Late 2018</div>
                    <div className="ch-tl-section-label">Build</div>
                    <div className="ch-tl-title">WebText &amp; Scaling</div>
                    <div className="ch-tl-body">
                        OpenAI scraped outbound links from Reddit posts with at least 3 karma, yielding
                        roughly 40GB of diverse, human-written text. They trained progressively larger
                        models: 117M, 345M, 762M, and 1.5B parameters. Each increase in size produced
                        smoother, more coherent text — and unexpectedly strong performance on downstream
                        tasks <em>without any fine-tuning at all</em>.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that scale alone unlocks new capabilities</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Feb 2019</div>
                    <div className="ch-tl-section-label">Release</div>
                    <div className="ch-tl-title">GPT-2 and the Staged Rollout</div>
                    <div className="ch-tl-body">
                        OpenAI published "Language Models are Unsupervised Multitask Learners" but
                        initially withheld the full 1.5B model, citing concerns about misuse for
                        generating fake news, spam, and impersonation. They released the 124M and 355M
                        versions first, then 762M, and finally the full model over six months. The
                        decision sparked intense debate about responsible AI publication norms.
                    </div>
                    <div className="ch-tl-impact">Impact: First major "staged release" of a powerful generative model</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">Zero-Shot Becomes Real</div>
                    <div className="ch-tl-body">
                        GPT-2 achieved competitive or state-of-the-art results on language modeling,
                        reading comprehension, summarization, translation, and question answering —
                        all without task-specific training. The "zero-shot" paradigm was born: prompt
                        the model with a natural language instruction and let it generate the answer.
                        This directly inspired GPT-3 and the entire instruction-following era.
                    </div>
                    <div className="ch-tl-impact">Impact: Foundation for zero-shot and few-shot prompting</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> When a language model is trained at sufficient scale
                on diverse data, it learns to perform tasks implicitly. You don't need a separate classifier
                head — you just prompt the model in natural language and it figures out what you want.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A student who read the whole internet</h2>

            <Analogy label="The Library">
                Imagine a student who reads every book, blog, article, and conversation on the internet.
                Not just once, but over and over until they can predict the next word in any sentence
                with amazing accuracy. That's GPT-2. It didn't take any tests during training — it just
                practiced finishing sentences.
            </Analogy>

            <Analogy label="The Surprise Exam">
                One day, a teacher gives this student a test they've never seen: "Write a summary of
                this story" or "Translate this sentence to French." The student has never studied
                summarization or French class. But because they've read so much — including summaries
                and translations online — they can guess what a good answer looks like. That's
                <em>zero-shot</em> learning.
            </Analogy>

            <Analogy label="Why the Grown-Ups Worried">
                The problem is this student can also write fake news articles that look real, or pretend
                to be someone else in an email. OpenAI was worried bad actors might use this power to
                trick people. So they released the student slowly — first a younger version, then the
                full one later — while the world figured out how to handle such a powerful tool.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GPT-2 architecture and training</h2>

            <h3>Architecture</h3>
            <p>
                GPT-2 uses the same decoder-only transformer stack as GPT-1, but with several key
                modifications learned from training larger models:
            </p>
            <ul>
                <li><strong>Layer normalization moved to input:</strong> Instead of applying LayerNorm
                    after the residual, GPT-2 applies it <em>before</em> each sub-block (pre-norm).
                    This stabilizes training at scale.</li>
                <li><strong>Scaled residual weights:</strong> The residual connections are scaled by
                    a factor of 1/√N where N is the number of residual layers, preventing gradient
                    explosion in deep stacks.</li>
                <li><strong>Vocabulary:</strong> Byte Pair Encoding (BPE) with 50,257 tokens on
                    byte-level UTF-8, allowing the model to represent any Unicode text without
                    unknown-token issues.</li>
                <li><strong>Context window:</strong> 1,024 tokens (up from 512 in GPT-1), enabling
                    longer-range dependencies.</li>
            </ul>

            <h3>WebText Dataset</h3>
            <p>
                WebText was built by scraping outbound links from Reddit posts with ≥ 3 karma, under
                the assumption that upvoted links tend to point to high-quality, diverse content. After
                deduplication and filtering, it contains about 40GB of text (roughly 8 million documents).
                Importantly, WebText overlaps minimally with standard NLP benchmarks, making zero-shot
                results more credible.
            </p>

            <h3>Zero-Shot Task Performance</h3>
            <p>
                GPT-2 demonstrated that a sufficiently large language model can perform many NLP tasks
                without any parameter updates. The trick is <em>task conditioning via natural language
                prompts</em>. For example:
            </p>
            <ul>
                <li><strong>Summarization:</strong> Append "TL;DR:" to an article and let the model
                    generate the rest.</li>
                <li><strong>Translation:</strong> Prompt with "What is the French translation of
                    {'{English sentence}'}?"</li>
                <li><strong>Question Answering:</strong> Format as a reading comprehension passage
                    followed by "Q: {'{question}'} A:{'"'}"</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> GPT-2 (1.5B) achieved 63.2% F1 on CoQA reading
                comprehension without any fine-tuning — competitive with supervised baselines from
                just two years earlier. On language modeling, it set a new state-of-the-art on
                Penn Treebank, WikiText-2, and LAMBADA.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Scaling and loss estimation</h2>

            <DefBlock label="Perplexity">
                For a sequence of tokens w<sub>1</sub>, …, w<sub>T</sub>, perplexity measures how
                surprised the model is on average:
            </DefBlock>
            <MathBlock tex="\\text{PPL} = \\exp\\Bigl(-\\frac{1}{T} \\sum_{t=1}^{T} \\log P(w_t \\mid w_{&lt;t})\\Bigr)" />
            <p>
                Lower perplexity means the model assigns higher probability to the true next token.
                GPT-2 reduced Penn Treebank perplexity from 65.8 (GPT-1) to 35.8.
            </p>

            <h3>Cross-Entropy Loss for Language Modeling</h3>
            <p>
                The training objective is simply next-token prediction, minimizing the average
                negative log-likelihood:
            </p>
            <MathBlock tex="\\mathcal{L} = -\\frac{1}{T} \\sum_{t=1}^{T} \\log P_{\\theta}(w_t \\mid w_1, \\dots, w_{t-1})" />

            <h3>Parameter Count Scaling</h3>
            <p>
                For a transformer decoder with L layers, hidden size d, context length n, vocabulary
                size V, and feed-forward dimension 4d:
            </p>
            <MathBlock tex="N \\approx V \\cdot d + L \\cdot (12 d^2 + 2 d \\cdot n)" />
            <p>
                GPT-2 largest: L = 48, d = 1,600, n = 1,024, V = 50,257 → ~1.5B parameters.
                The dominant term is the 12Ld² from the attention and FFN weight matrices.
            </p>

            <h3>Top-k Sampling</h3>
            <p>
                At generation time, GPT-2 uses top-k sampling: restrict the sampling distribution to
                the k most likely next tokens and renormalize. Formally, let V<sub>k</sub> be the set
                of top-k tokens by probability. The sampled token is drawn from:
            </p>
            <MathBlock tex="P'(w) = \\frac{P(w)}{\\sum_{w' \\in V_k} P(w')} \\quad \\text{for } w \\in V_k, \\quad 0 \\text{ otherwise}" />

            <div className="ch-callout">
                <strong>Why pre-norm helps:</strong> In the post-norm formulation (original Transformer),
                the gradient path is LayerNorm'(x + F(x)) · (1 + F'(x)). At initialization F(x) ≈ 0
                and LayerNorm'(0) can vanish. Pre-norm computes x + F(LayerNorm(x)), keeping the
                identity gradient path clean.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── GPT-2 style top-k sampling ────────────────────────────────────────────────
def top_k_sample(logits, k=40, temperature=1.0):
    """Sample from the top-k logits with temperature scaling."""
    # Temperature scaling
    logits = logits / temperature
    # Select top-k
    top_k_idx = np.argpartition(logits, -k)[-k:]
    top_k_logits = logits[top_k_idx]
    # Softmax over top-k
    exp = np.exp(top_k_logits - np.max(top_k_logits))
    probs = exp / exp.sum()
    # Sample
    choice = np.random.choice(k, p=probs)
    return top_k_idx[choice]

# ── Perplexity ────────────────────────────────────────────────────────────────
def perplexity(log_probs):
    """log_probs: array of log P(w_t | w_<t) for each token."""
    return np.exp(-np.mean(log_probs))

# ── Demo ──────────────────────────────────────────────────────────────────────
logits = np.array([2.0, 1.5, 0.1, -0.5, 3.2, 0.8, -1.2, 1.0])

print("Top-k Sampling Demo")
print("=" * 40)
for _ in range(5):
    token = top_k_sample(logits, k=3, temperature=0.8)
    print(f"  Sampled token index: {token}")

print()
log_probs = np.array([-2.1, -1.8, -3.5, -2.0, -1.9])
print(f"Perplexity: {perplexity(log_probs):.2f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of GPT-2's top-k sampling strategy with temperature scaling,
                plus a simple perplexity calculator.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt2_sampling.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT2_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
