import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From GPT-2 to GPT-3: the scale explosion</h2>
            <p>
                In May 2020, OpenAI published "Language Models are Few-Shot Learners," introducing GPT-3:
                a 175-billion-parameter autoregressive language model trained on hundreds of billions of tokens.
                The paper's central claim was shocking: at sufficient scale, language models could perform
                downstream tasks <em>without any gradient updates</em> — simply by conditioning on a few examples
                in the prompt.
            </p>

            <div className="ch19-timeline">
                <div className="ch19-tl-item">
                    <div className="ch19-tl-year">Feb 2019</div>
                    <div className="ch19-tl-section-label">Precedent</div>
                    <div className="ch19-tl-title">GPT-2 (1.5B parameters)</div>
                    <div className="ch19-tl-body">
                        OpenAI released GPT-2, demonstrating that scaling up Transformer decoders improved
                        zero-shot task performance. The model showed rudimentary summarization, translation,
                        and question-answering abilities without explicit fine-tuning.
                    </div>
                    <div className="ch19-tl-impact">Impact: Proved that scale alone unlocks emergent capabilities</div>
                </div>

                <div className="ch19-tl-item">
                    <div className="ch19-tl-year">Oct 2019</div>
                    <div className="ch19-tl-section-label">Theory</div>
                    <div className="ch19-tl-title">Kaplan et al. — Scaling Laws for Neural LMs</div>
                    <div className="ch19-tl-body">
                        OpenAI researchers derived power-law relationships between model size, dataset size,
                        compute budget, and test loss. The laws predicted that models 10–100× larger than
                        GPT-2 would yield dramatic qualitative improvements.
                    </div>
                    <div className="ch19-tl-impact">Impact: Provided the theoretical justification for training GPT-3</div>
                </div>

                <div className="ch19-tl-item">
                    <div className="ch19-tl-year">May 2020</div>
                    <div className="ch19-tl-section-label">Invention</div>
                    <div className="ch19-tl-title">Brown et al. — GPT-3 (175B)</div>
                    <div className="ch19-tl-body">
                        GPT-3 was trained on ~300B tokens of filtered Common Crawl, WebText2, Books1,
                        Books2, and Wikipedia. It used the same decoder-only architecture as GPT-2 but
                        with 96 layers, 12,288 hidden dimensions, and 96 attention heads. The key finding:
                        at 175B parameters, the model could perform many NLP tasks competitively simply
                        by reading a few examples in its context window.
                    </div>
                    <div className="ch19-tl-impact">Impact: Redefined the paradigm from fine-tuning to prompt engineering</div>
                </div>

                <div className="ch19-tl-item">
                    <div className="ch19-tl-year">2020 – 2022</div>
                    <div className="ch19-tl-section-label">Legacy</div>
                    <div className="ch19-tl-title">The API Era Begins</div>
                    <div className="ch19-tl-body">
                        OpenAI launched the GPT-3 API, spawning an entire industry of prompt-based
                        applications. Copywriting, code generation, chatbots, and creative tools emerged
                        almost overnight. The model's few-shot capabilities meant developers could build
                        NLP products without training custom models.
                    </div>
                    <div className="ch19-tl-impact">Impact: Democratized access to state-of-the-art NLP</div>
                </div>
            </div>

            <div className="ch19-callout">
                <strong>The core insight:</strong> As model capacity grows, the "knowledge" stored in
                its parameters becomes sufficiently rich and compositional that conditioning on a prompt
                — a sequence of instructions and examples — is enough to elicit complex behaviors that
                previously required supervised fine-tuning.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A library that has read every book</h2>

            <Analogy label="The Giant Library">
                Imagine a library so vast it has read almost every book, article, and website on the
                internet. Not just scanned — <em>understood</em>. When you ask this library a question,
                it doesn't look up an answer in an index. Instead, it imagines what would come next
                if someone were writing the answer.
            </Analogy>

            <Analogy label="Learning from Examples">
                Now imagine you want the library to write poems. Instead of retraining the entire
                library (which would take years), you simply show it three poems and say "write one
                like these." The library looks at the pattern, the rhythm, the rhymes — and writes
                a brand new poem in the same style. It learned <em>just from those three examples</em>.
            </Analogy>

            <Analogy label="The Magic Trick">
                The magic is that the library is so big — 175 billion pieces of information connected
                together — that it can do this for almost anything: translate languages, solve math
                problems, write computer programs, or tell jokes. All you have to do is give it the
                right hint at the beginning.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Autoregressive language modeling at massive scale</h2>

            <h3>Architecture</h3>
            <p>
                GPT-3 is a decoder-only Transformer with the same fundamental design as GPT-2, scaled
                up by two orders of magnitude. It uses alternating dense and sparse (factorized)
                attention patterns in larger variants.
            </p>
            <ul>
                <li><strong>Parameters:</strong> 175 billion (largest variant; 125M to 13B also trained)</li>
                <li><strong>Layers:</strong> 96 Transformer blocks</li>
                <li><strong>Hidden size:</strong> 12,288</li>
                <li><strong>Attention heads:</strong> 96 (128 dims each)</li>
                <li><strong>Context length:</strong> 2,048 tokens</li>
                <li><strong>Vocabulary:</strong> 50,257 BPE tokens</li>
                <li><strong>Training data:</strong> ~300 billion tokens (filtered Common Crawl + curated datasets)</li>
            </ul>

            <h3>Training Objective</h3>
            <p>
                Like GPT-2, GPT-3 is trained with standard left-to-right language modeling: predict
                each token given all previous tokens. The loss is the sum of log-probabilities across
                the training sequence.
            </p>
            <MathBlock tex="\mathcal{L} = -\sum_{i} \log P(x_i \mid x_{1}, \dots, x_{i-1}; \Theta)" />
            <p>
                There is no task-specific fine-tuning. The model is evaluated in three settings:
                <strong> zero-shot</strong> (task description only), <strong>one-shot</strong> (one
                example + description), and <strong>few-shot</strong> (10–100 examples + description).
            </p>

            <h3>Key Results</h3>
            <ul>
                <li>75% on LAMBADA (reading comprehension) — surpassing fine-tuned SOTA</li>
                <li>81.5% zero-shot on COPA (commonsense reasoning)</li>
                <li>Competitive translation without bilingual training data</li>
                <li>Could generate coherent multi-paragraph essays and simple code</li>
            </ul>

            <hr className="ch19-sep" />
            <div className="ch19-callout">
                <strong>Key result:</strong> GPT-3's few-shot performance often matched or exceeded
                fine-tuned models, particularly on tasks requiring broad world knowledge, reading
                comprehension, and open-ended generation. On TriviaQA, few-shot GPT-3 outperformed
                fine-tuned models by a wide margin.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Scaling laws and the autoregressive objective</h2>

            <DefBlock label="Power-Law Scaling">
                Kaplan et al. showed that test loss L scales as a power law in model parameters N,
                dataset size D, and compute C (in FLOPs):
                <MathBlock tex="L(N) = \left(\frac{N_c}{N}\right)^{\alpha_N} \quad L(D) = \left(\frac{D_c}{D}\right)^{\alpha_D} \quad L(C) = \left(\frac{C_c}{C}\right)^{\alpha_C}" />
                where typical values are α<sub>N</sub> ≈ 0.076, α<sub>D</sub> ≈ 0.095, and
                α<sub>C</sub> ≈ 0.050. This predicts that loss decreases predictably as you scale
                any of the three factors.
            </DefBlock>

            <h3>Autoregressive Factorization</h3>
            <p>
                GPT-3 models the joint probability of a sequence by factorizing it as a product of
                conditionals:
            </p>
            <MathBlock tex="P(x_1, \dots, x_n) = \prod_{i=1}^{n} P(x_i \mid x_{<i})" />
            <p>
                Each conditional is computed by the Transformer decoder, which outputs logits
                z<sub>i</sub> ∈ ℝ<sup>V</sup> and applies softmax:
            </p>
            <MathBlock tex="P(x_i = v \mid x_{<i}) = \frac{\exp(z_{i,v})}{\sum_{v'} \exp(z_{i,v'})}" />

            <h3>Parameter Count</h3>
            <p>
                For a decoder-only Transformer with L layers, hidden size d, vocabulary V, and
                feed-forward dimension d<sub>ff</sub> = 4d:
            </p>
            <MathBlock tex="\text{Params} \approx V \cdot d + L \cdot (4 d^2 + 2 d \cdot d_{\text{ff}}) = V \cdot d + 12 L d^2" />
            <p>
                With V ≈ 50,000, d = 12,288, and L = 96, this yields approximately 175 billion
                parameters. The embedding matrix alone contributes ~615M parameters.
            </p>

            <h3>Few-Shot Loss</h3>
            <p>
                In few-shot evaluation, the model is conditioned on k labeled examples
                {'{'}(x<sup>(j)</sup>, y<sup>(j)</sup>){'}'}<sub>j=1..k</sub> concatenated with a query x.
                The predicted label is the argmax over the vocabulary at the final position:
            </p>
            <MathBlock tex="\hat{y} = \arg\max_{v \in \mathcal{V}} P(v \mid x^{(1)}, y^{(1)}, \dots, x^{(k)}, y^{(k)}, x)" />

            <div className="ch19-callout">
                <strong>Why no fine-tuning?</strong> Gradient updates on a 175B parameter model are
                prohibitively expensive for most practitioners. More importantly, the in-context
                learning mechanism allows the model to adapt to a new task in a single forward pass,
                using only the examples provided in the prompt.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Softmax Sampling for Autoregressive Generation ────────────────────────────

def softmax(x, temperature=1.0):
    """Stable softmax with temperature scaling."""
    x = np.array(x) / temperature
    e = np.exp(x - np.max(x))
    return e / e.sum()

def top_p_filter(logits, p=0.9):
    """Nucleus (top-p) sampling filter."""
    sorted_idx = np.argsort(logits)[::-1]
    sorted_logits = logits[sorted_idx]
    probs = softmax(sorted_logits)
    cumsum = np.cumsum(probs)
    cutoff = np.searchsorted(cumsum, p) + 1
    mask = np.zeros_like(logits, dtype=bool)
    mask[sorted_idx[:cutoff]] = True
    return np.where(mask, logits, -1e9)

def sample_token(logits, temperature=1.0, top_p_val=0.9):
    """Sample a single token from logits."""
    filtered = top_p_filter(logits, p=top_p_val)
    probs = softmax(filtered, temperature)
    return np.random.choice(len(probs), p=probs)

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
vocab_size = 50257

# Simulated logits from a forward pass
logits = np.random.randn(vocab_size)

# Greedy decoding
greedy_id = int(np.argmax(logits))

# Nucleus sampling with T=0.8
sampled_id = sample_token(logits, temperature=0.8, top_p_val=0.9)

print("Autoregressive Sampling Demo")
print("=" * 40)
print(f"Greedy token ID: {greedy_id}")
print(f"Sampled token ID: {sampled_id}")
print(f"Top-5 greedy IDs: {np.argsort(logits)[-5:][::-1].tolist()}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of nucleus (top-p) sampling and temperature-scaled softmax,
                the standard decoding strategies used with GPT-3 for autoregressive text generation.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt3_sampling.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Nucleus (Top-p) Sampling — TypeScript ───────────────────────────────────

function softmax(x: number[], temperature = 1.0): number[] {
    const scaled = x.map(v => v / temperature)
    const maxVal = Math.max(...scaled)
    const exp = scaled.map(v => Math.exp(v - maxVal))
    const sum = exp.reduce((a, b) => a + b, 0)
    return exp.map(v => v / sum)
}

function topPFilter(logits: number[], p = 0.9): number[] {
    const indexed = logits.map((v, i) => ({ v, i }))
    indexed.sort((a, b) => b.v - a.v)
    const probs = softmax(indexed.map(x => x.v))
    let cumsum = 0
    let cutoff = 0
    for (let i = 0; i < probs.length; i++) {
        cumsum += probs[i]
        if (cumsum > p) { cutoff = i + 1; break }
    }
    const keep = new Set(indexed.slice(0, cutoff).map(x => x.i))
    return logits.map((v, i) => keep.has(i) ? v : -1e9)
}

function sampleToken(logits: number[], temperature = 1.0, topP = 0.9): number {
    const filtered = topPFilter(logits, topP)
    const probs = softmax(filtered, temperature)
    const r = Math.random()
    let acc = 0
    for (let i = 0; i < probs.length; i++) {
        acc += probs[i]
        if (r < acc) return i
    }
    return probs.length - 1
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const vocabSize = 50257
const logits = Array.from({ length: vocabSize }, () => (Math.random() - 0.5) * 4)

const greedyId = logits.indexOf(Math.max(...logits))
const sampledId = sampleToken(logits, 0.8, 0.9)

console.log("Autoregressive Sampling Demo")
console.log("─".repeat(40))
console.log(\`Greedy ID: \${greedyId}\`)
console.log(\`Sampled ID: \${sampledId}\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of nucleus sampling for GPT-style autoregressive generation.
                The algorithm filters the probability distribution to the smallest set of tokens whose
                cumulative probability exceeds p, then samples from that truncated distribution.
            </p>
            <CodeBlock code={TS_CODE} filename="gpt3_sampling.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT3_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
