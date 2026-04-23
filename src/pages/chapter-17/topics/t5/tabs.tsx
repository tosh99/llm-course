import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>One framework to rule them all</h2>
            <p>
                By 2019, the NLP landscape was fragmented. BERT excelled at classification and
                span prediction. GPT-2 generated coherent text. Seq2Seq models handled translation
                and summarization. Each architecture required custom output layers, loss functions,
                and training procedures. Researchers at Google asked a radical question: what if
                every NLP task could be cast as a text-to-text problem?
            </p>

            <div className="ch17-timeline">
                <div className="ch17-tl-item">
                    <div className="ch17-tl-year">2018</div>
                    <div className="ch17-tl-section-label">Problem</div>
                    <div className="ch17-tl-title">The Architecture Zoo</div>
                    <div className="ch17-tl-body">
                        The field had splintered into encoder-only (BERT), decoder-only (GPT), and
                        encoder-decoder (Transformer) camps. A researcher moving from sentiment
                        classification to translation had to switch frameworks, loss functions, and
                        even tokenizers. There was no universal recipe.
                    </div>
                    <div className="ch17-tl-impact">Impact: High barrier to entry and duplicated engineering effort</div>
                </div>

                <div className="ch17-tl-item">
                    <div className="ch17-tl-year">Oct 2019</div>
                    <div className="ch17-tl-section-label">Breakthrough</div>
                    <div className="ch17-tl-title">Exploring the Limits of Transfer Learning</div>
                    <div className="ch17-tl-body">
                        Colin Raffel and colleagues at Google published the T5 paper, introducing
                        the Text-to-Text Transfer Transformer. The core idea: feed the model an
                        input string like "translate English to German: {'{sentence}'}" and train it
                        to generate the target text. Classification becomes "sentiment: {'{review}'}" →
                        "positive". QA becomes "question: {'{q}'} context: {'{c}'}" → "{'{answer}'}". One model,
                        one objective, every task.
                    </div>
                    <div className="ch17-tl-impact">Impact: Unified NLP under a single generative framework</div>
                </div>

                <div className="ch17-tl-item">
                    <div className="ch17-tl-year">2019</div>
                    <div className="ch17-tl-section-label">Dataset</div>
                    <div className="ch17-tl-title">The Colossal Clean Crawled Corpus (C4)</div>
                    <div className="ch17-tl-body">
                        T5 introduced C4, a cleaned version of the April 2019 Common Crawl snapshot.
                        Heuristic filters removed non-natural language (boilerplate, code, markup),
                        deduplication removed near-duplicates, and language detection kept only
                        English. The result: 750GB of high-quality, diverse text — roughly 170B tokens.
                    </div>
                    <div className="ch17-tl-impact">Impact: A public, reproducible pretraining corpus at web scale</div>
                </div>

                <div className="ch17-tl-item">
                    <div className="ch17-tl-year">2019 – 2022</div>
                    <div className="ch17-tl-section-label">Legacy</div>
                    <div className="ch17-tl-title">T5 Becomes a Family</div>
                    <div className="ch17-tl-body">
                        Google released T5 in five sizes (Small to 11B) and later variants: T5v1.1
                        (improved pretraining), mT5 (multilingual), UL2 (mixture of denoisers), and
                        FLAN-T5 (instruction-tuned). The text-to-text paradigm influenced PaLM,
                        BLOOM, and many instruction-following models that treat all tasks as
                        conditional generation.
                    </div>
                    <div className="ch17-tl-impact">Impact: Text-to-text is now the default paradigm for generative NLP</div>
                </div>
            </div>

            <div className="ch17-callout">
                <strong>The core insight:</strong> By adding a textual prefix to every input, you turn
                any supervised learning problem into a sequence-to-sequence translation problem. The
                model doesn't need to know it's doing "classification" or "NER" — it just learns to
                translate one string into another.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The universal translator</h2>

            <Analogy label="The Swiss Army Knife">
                Imagine you have a pocket knife that can do everything — cut, screw, open bottles,
                file nails — but instead of different blades, it just has one really smart blade
                that changes shape based on what you ask. T5 is like that. You tell it what job
                to do by starting your sentence with a special phrase, and it figures out the rest.
            </Analogy>

            <Analogy label="The Homework Machine">
                Suppose you have a machine that can do any homework assignment. For math, you write
                "solve:" before the problem. For English, you write "summarize:" before the story.
                For Spanish class, you write "translate to Spanish:". The machine never took a math
                class or a Spanish class — it just learned from reading so much that it can guess
                what a good answer looks like for any prompt.
            </Analogy>

            <Analogy label="Why It Matters">
                Before T5, you needed a different machine for each subject. That meant more parts,
                more breaking, more confusion. T5 showed that one well-trained machine can handle
                everything if you just speak to it clearly. That's why modern AI assistants like
                ChatGPT can answer questions, write poems, and help code — they all inherited
                T5's text-to-text philosophy.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>T5 architecture and the text-to-text framework</h2>

            <h3>Architecture</h3>
            <p>
                T5 uses a standard encoder-decoder transformer (like the original "Attention Is All
                You Need" paper), with the following specifics:
            </p>
            <ul>
                <li><strong>Encoder-decoder:</strong> The encoder processes the input prefix and
                    text; the decoder autoregressively generates the output. This differs from GPT-2
                    (decoder-only) and BERT (encoder-only).</li>
                <li><strong>Relative positional embeddings:</strong> Instead of absolute sinusoidal
                    or learned position embeddings, T5 uses relative positional biases in each
                    attention layer, allowing better generalization to sequence lengths not seen
                    during training.</li>
                <li><strong>Simplified LayerNorm:</strong> No additive bias, and placed outside the
                    residual path (pre-norm style).</li>
                <li><strong>Model sizes:</strong> Small (60M), Base (220M), Large (770M), 3B, 11B
                    parameters.</li>
            </ul>

            <h3>The Text-to-Text Prefix Convention</h3>
            <p>
                Every task is reformulated as text generation by prepending a task-specific prefix:
            </p>
            <ul>
                <li><strong>Translation:</strong> "translate English to German: The house is blue."</li>
                <li><strong>Summarization:</strong> "summarize: {'{long article}'}"</li>
                <li><strong>Classification:</strong> "cola sentence: {'{sentence}'}" → "acceptable" / "unacceptable"</li>
                <li><strong>QA:</strong> "question: {'{question}'} context: {'{paragraph}'}" → "{'{answer}'}"</li>
                <li><strong>Regression (STS-B):</strong> "stsb sentence1: {'{a}'} sentence2: {'{b}'}" → "3.8"</li>
            </ul>

            <h3>Pretraining Objective: Span Corruption</h3>
            <p>
                T5 is pretrained with a "span corruption" denoising objective: randomly sample spans
                of tokens from the input and replace each with a unique sentinel token (e.g., &lt;X&gt;).
                The model must reconstruct the missing spans. This is more flexible than BERT's
                masked-language modeling (which predicts single tokens) because it learns to generate
                multi-token coherent sequences.
            </p>

            <h3>C4 Dataset Construction</h3>
            <p>
                C4 was built by downloading the April 2019 Common Crawl dump (~20TB), then applying:
            </p>
            <ol>
                <li><strong>Language filtering:</strong> Keep only pages scored as English with high confidence.</li>
                <li><strong>Deduplication:</strong> Remove near-duplicate lines across documents.</li>
                <li><strong>Heuristic cleaning:</strong> Remove lines with no terminal punctuation,
                    pages with fewer than 3 sentences, and anything containing offensive words.</li>
            </ol>

            <hr className="ch17-sep" />
            <div className="ch17-callout">
                <strong>Key result:</strong> T5-11B achieved state-of-the-art on GLUE, SuperGLUE,
                SQuAD, and CNN/DailyMail summarization. On SuperGLUE, it was the first model to
                surpass the average human baseline (though not on every task individually).
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Encoder-decoder attention and span corruption</h2>

            <DefBlock label="Cross-Attention">
                In the T5 decoder, each layer performs two attention operations: self-attention over
                previously generated tokens (masked, causal), and cross-attention over the encoder's
                final hidden states. The cross-attention scores are:
            </DefBlock>
            <MathBlock tex="\\text{CrossAttn}(Q, K, V) = \\text{softmax}\\Bigl(\\frac{Q K^T}{\\sqrt{d_k}}\\Bigr) V" />
            <p>
                Where Q comes from the decoder's previous layer, and K, V come from the encoder output.
                This allows every decoder position to attend to every input position, enabling the
                "translation" from input text to output text.
            </p>

            <h3>Span Corruption Objective</h3>
            <p>
                Given an input sequence x, sample a set of token spans S = {'{'}(s<sub>i</sub>, ℓ<sub>i</sub>){'}'}.
                Replace each span with a unique sentinel token &lt;X<sub>i</sub>&gt; to create the
                corrupted input. The target is the concatenation of all sentinel-span pairs:
            </p>
            <MathBlock tex="\\text{Input}: x_{1:s_1} \\; \\text{&lt;X_1&gt;} \\; x_{s_1+\\ell_1:s_2} \\; \\text{&lt;X_2&gt;} \\; \\dots" />
            <MathBlock tex="\\text{Target}: \\text{&lt;X_1&gt;} \\; x_{s_1:s_1+\\ell_1} \\; \\text{&lt;X_2&gt;} \\; x_{s_2:s_2+\\ell_2} \\; \\dots" />
            <p>
                The model is trained to maximize the likelihood of the target given the corrupted
                input. Mean span length is typically 3 tokens, with 15% of tokens masked total.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For an encoder-decoder with L encoder + L decoder layers, hidden size d, and FFN
                dimension 4d:
            </p>
            <MathBlock tex="N \\approx 2L \\cdot (12 d^2 + 2 d \\cdot n_{\\text{rel}}) + V \\cdot d" />
            <p>
                The factor of 2 accounts for both encoder and decoder stacks. T5-11B uses L = 24,
                d = 1,024 in the attention layers but a larger d in the FFN, plus factorized
                embeddings, bringing the total to ~11B parameters.
            </p>

            <div className="ch17-callout">
                <strong>Why encoder-decoder for text-to-text?</strong> The bidirectional encoder can
                freely attend to the entire input prefix, capturing all contextual cues. The
                autoregressive decoder then generates the output one token at a time, conditioned on
                both the encoder state and its own past outputs. This separation of "understanding"
                and "generation" is natural for translation-style tasks.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── T5-style Span Corruption ──────────────────────────────────────────────────
def span_corruption(tokens, mean_span_len=3, mask_rate=0.15):
    """
    Corrupt spans of tokens and build input/target for T5-style pretraining.
    tokens: list of token strings
    """
    n = len(tokens)
    num_masked = int(n * mask_rate)
    spans = []
    covered = 0
    sentinel_id = 0

    while covered < num_masked:
        span_len = max(1, np.random.poisson(mean_span_len))
        start = np.random.randint(0, n - span_len + 1)
        spans.append((sentinel_id, start, span_len))
        sentinel_id += 1
        covered += span_len

    # Build corrupted input and target
    input_parts = []
    target_parts = []
    prev = 0
    for sid, start, length in sorted(spans, key=lambda x: x[1]):
        input_parts.extend(tokens[prev:start])
        input_parts.append(f"<X{sid}>")
        target_parts.append(f"<X{sid}>")
        target_parts.extend(tokens[start:start+length])
        prev = start + length
    input_parts.extend(tokens[prev:])

    return input_parts, target_parts

# ── Demo ──────────────────────────────────────────────────────────────────────
tokens = "The quick brown fox jumps over the lazy dog".split()
inp, tgt = span_corruption(tokens, mean_span_len=2, mask_rate=0.3)

print("Original:", " ".join(tokens))
print("Input:   ", " ".join(inp))
print("Target:  ", " ".join(tgt))
`

function PythonTab() {
    return (
        <>
            <p>
                Python implementation of T5's span corruption pretraining objective: sample random
                spans, replace them with sentinel tokens in the input, and reconstruct them in the
                target sequence.
            </p>
            <CodeBlock code={PY_CODE} filename="t5_span_corruption.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── T5 Span Corruption — TypeScript ──────────────────────────────────────────

function spanCorruption(
    tokens: string[],
    meanSpanLen = 3,
    maskRate = 0.15
): { input: string[]; target: string[] } {
    const n = tokens.length
    const numMasked = Math.floor(n * maskRate)
    const spans: { sid: number; start: number; len: number }[] = []
    let covered = 0
    let sentinelId = 0

    while (covered < numMasked) {
        const spanLen = Math.max(1, Math.round(meanSpanLen)) // simplified poisson
        const start = Math.floor(Math.random() * (n - spanLen + 1))
        spans.push({ sid: sentinelId, start, len: spanLen })
        sentinelId++
        covered += spanLen
    }

    spans.sort((a, b) => a.start - b.start)

    const inputParts: string[] = []
    const targetParts: string[] = []
    let prev = 0
    for (const { sid, start, len } of spans) {
        inputParts.push(...tokens.slice(prev, start))
        inputParts.push(\`<X\${sid}>\`)
        targetParts.push(\`<X\${sid}>\`)
        targetParts.push(...tokens.slice(start, start + len))
        prev = start + len
    }
    inputParts.push(...tokens.slice(prev))

    return { input: inputParts, target: targetParts }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const tokens = "The quick brown fox jumps over the lazy dog".split(" ")
const { input, target } = spanCorruption(tokens, 2, 0.3)

console.log("Original:", tokens.join(" "))
console.log("Input:   ", input.join(" "))
console.log("Target:  ", target.join(" "))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of T5 span corruption, showing how input and target
                sequences are constructed for the denoising pretraining objective.
            </p>
            <CodeBlock code={TS_CODE} filename="t5_span_corruption.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const T5_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
