import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The encoder-only family tree</h2>
            <p>
                BERT's success spawned an entire lineage of encoder-only Transformer models, each
                optimizing for a different goal: smaller size, faster inference, lower memory, better
                performance, or more efficient training. Understanding this family helps practitioners
                choose the right model for their constraints.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">BERT</div>
                    <div className="ch-tl-body">
                        The original bidirectional encoder. BERT-Base (110M params) and BERT-Large (340M).
                        Trained with MLM + NSP on BooksCorpus + Wikipedia. Set the template for all
                        encoder-only models.
                    </div>
                    <div className="ch-tl-impact">Impact: The ancestor of the encoder family</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Feb 2019</div>
                    <div className="ch-tl-section-label">Distillation</div>
                    <div className="ch-tl-title">DistilBERT</div>
                    <div className="ch-tl-body">
                        Sanh et al. distilled BERT-Base into a 6-layer model with 40% fewer parameters
                        (66M) that retains 97% of BERT's language understanding and runs 60% faster.
                        Used a triple loss: MLM distillation, supervised distillation from BERT's softmax,
                        and cosine embedding loss on hidden states.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that large encoders can be compressed for production</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Sep 2019</div>
                    <div className="ch-tl-section-label">Compression</div>
                    <div className="ch-tl-title">ALBERT</div>
                    <div className="ch-tl-body">
                        Lan et al. introduced two parameter-sharing techniques: (1) factorized embeddings
                        that decompose the large vocabulary embedding matrix, and (2) cross-layer parameter
                        sharing where all Transformer layers share the same weights. ALBERT-xxlarge has
                        only 235M unique parameters but outperforms BERT-Large with 340M. Replaced NSP
                        with SOP.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that parameter efficiency can match or exceed raw scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2019</div>
                    <div className="ch-tl-section-label">Efficiency</div>
                    <div className="ch-tl-title">ELECTRA</div>
                    <div className="ch-tl-body">
                        Clark et al. replaced MLM with "replaced token detection": a small generator
                        model corrupts input tokens, and the discriminator (the main model) predicts
                        which tokens were replaced. This means <em>every token</em> is a training signal,
                        not just 15%. ELECTRA trains faster and outperforms BERT at the same compute budget.
                    </div>
                    <div className="ch-tl-impact">Impact: Replaced masking with a more sample-efficient pretraining task</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jun 2020</div>
                    <div className="ch-tl-section-label">Disentanglement</div>
                    <div className="ch-tl-title">DeBERTa</div>
                    <div className="ch-tl-body">
                        He et al. disentangled content and position in self-attention, using separate
                        vectors for word content and relative position. An enhanced mask decoder also
                        improved MLM by decoding masked tokens with absolute positions. DeBERTa surpassed
                        human performance on the SuperGLUE benchmark in 2021.
                    </div>
                    <div className="ch-tl-impact">Impact: Pushed encoder-only performance to superhuman levels</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>How to choose:</strong> Use DistilBERT for latency-sensitive production APIs.
                Use ALBERT when memory is constrained. Use ELECTRA when you have limited training compute.
                Use DeBERTa when you need maximum accuracy on classification or NLU tasks. For embeddings
                and retrieval, Sentence-BERT (a siamese BERT variant) remains the go-to.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The BERT family</h2>

            <Analogy label="The Original Chef (BERT)">
                BERT is like a master chef who can cook anything. But the chef is slow and expensive
                to hire. What if we want a faster, cheaper, or smaller cook who can still make great food?
            </Analogy>

            <Analogy label="The Apprentice (DistilBERT)">
                DistilBERT is the apprentice who learned by watching the master. The apprentice is
                almost as good but works much faster and costs less. Perfect for busy restaurants that
                need quick meals.
            </Analogy>

            <Analogy label="The Shared Uniform (ALBERT)">
                Imagine a kitchen where every cook wears the exact same uniform. They share everything!
                ALBERT shares weights across all its layers, making it much smaller without losing much
                skill. It's like one super-cook wearing many hats.
            </Analogy>

            <Analogy label="The Detective (ELECTRA)">
                Instead of filling in blanks, ELECTRA plays "spot the fake." A tiny forger changes words
                in a sentence, and ELECTRA has to catch every forgery. Because it practices on every word
                instead of just 15%, it learns faster and becomes sharper.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Encoder-only model comparison</h2>

            <h3>Architecture Overview</h3>
            <p>
                All models in the BERT family share the same core architecture: a Transformer encoder
                with self-attention, feed-forward networks, and layer normalization. The differences lie
                in training objectives, parameter sharing, and model size:
            </p>
            <ul>
                <li><strong>BERT:</strong> MLM + NSP. No parameter sharing. 110M (Base) / 340M (Large).</li>
                <li><strong>DistilBERT:</strong> 6 layers (half of BERT-Base), distilled from BERT.
                    66M parameters. 60% faster inference.</li>
                <li><strong>ALBERT:</strong> Factorized embeddings (V×H → V×E + E×H) and cross-layer
                    parameter sharing. 12M (Base) / 235M (xxLarge, but only 235M <em>unique</em> params).</li>
                <li><strong>ELECTRA:</strong> Generator-discriminator architecture. Generator is a small
                    masked LM; discriminator classifies every token as original or replaced. Same size
                    as BERT but trains more efficiently.</li>
                <li><strong>DeBERTa:</strong> Disentangled attention (content + position vectors),
                    enhanced mask decoder, virtual adversarial training. 80M (Base) / 304M (Large).</li>
            </ul>

            <h3>Training Objectives Compared</h3>
            <ul>
                <li><strong>BERT / RoBERTa:</strong> Masked Language Modeling (15% of tokens)</li>
                <li><strong>ALBERT:</strong> MLM + Sentence Order Prediction</li>
                <li><strong>ELECTRA:</strong> Replaced Token Detection (100% of tokens)</li>
                <li><strong>DeBERTa:</strong> MLM with enhanced mask decoder</li>
            </ul>

            <h3>When to Use Which</h3>
            <ul>
                <li><strong>Classification / NLI:</strong> DeBERTa or RoBERTa for accuracy; DistilBERT for speed</li>
                <li><strong>Embeddings / Semantic Search:</strong> Sentence-BERT (siamese fine-tuned BERT)</li>
                <li><strong>Low-resource training:</strong> ELECTRA (more sample-efficient) or DistilBERT</li>
                <li><strong>Mobile / edge:</strong> DistilBERT, TinyBERT, or MobileBERT</li>
                <li><strong>Multilingual:</strong> XLM-RoBERTa (trained on 100 languages)</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key trend:</strong> The encoder-only family shows that architectural innovation
                (ALBERT's sharing, ELECTRA's detection, DeBERTa's disentanglement) and training optimization
                (RoBERTa's scaling) both matter. No single model dominates every task; the best choice
                depends on accuracy, latency, and memory constraints.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Parameter sharing and replaced token detection</h2>

            <DefBlock label="ALBERT Factorized Embeddings">
                BERT's embedding matrix is <InlineMath tex="\\mathbf{E} \\in \\mathbb{R}^{V \\times H}" /> where <InlineMath tex="V" /> is vocabulary
                size and <InlineMath tex="H" /> is hidden size. ALBERT factorizes this into two smaller matrices:
                <MathBlock tex="\mathbf{E}_{\text{ALBERT}} = \mathbf{E}_1 \mathbf{E}_2 \quad \text{where } \mathbf{E}_1 \in \mathbb{R}^{V \times E}, \; \mathbf{E}_2 \in \mathbb{R}^{E \times H}" />
                With <InlineMath tex="E \\ll H" /> (e.g., <InlineMath tex="E=128" />, <InlineMath tex="H=4096" />), parameters drop from <InlineMath tex="V \\cdot H" /> to
                <InlineMath tex="V \\cdot E + E \\cdot H" /> — a huge saving when <InlineMath tex="V=30,522" /> and <InlineMath tex="H=4096" />.
            </DefBlock>

            <h3>Cross-Layer Parameter Sharing</h3>
            <p>
                ALBERT shares all parameters across <InlineMath tex="L" /> layers:
            </p>
            <MathBlock tex="\mathbf{H}^{(\ell)} = \text{TransformerBlock}(\mathbf{H}^{(\ell-1)}; \Theta) \quad \forall \ell \in \{1, \dots, L\}" />
            <p>
                Unlike BERT where each layer has unique parameters <InlineMath tex="\\Theta_\\ell" />, ALBERT uses a single
                <InlineMath tex="\\Theta" />. This dramatically reduces parameters but increases depth capacity. Empirically,
                ALBERT-xxlarge (L=12, H=4096) with sharing outperforms BERT-Large (L=24, H=1024) without it.
            </p>

            <h3>ELECTRA Replaced Token Detection</h3>
            <p>
                ELECTRA uses a generator <InlineMath tex="G" /> (small masked LM) and discriminator <InlineMath tex="D" /> (the main model).
                For input <InlineMath tex="\\mathbf{x}" />, the generator produces corrupted positions <InlineMath tex="\\mathcal{M}" /> and
                replacements <InlineMath tex="\\hat{\\mathbf{x}}_{\\mathcal{M}}" />. The discriminator predicts whether each
                token is original:
            </p>
            <MathBlock tex="P(D_i = 1 \mid \mathbf{x}) = \sigma(\mathbf{w}^T \mathbf{h}_i^{(D)} + b)" />
            <p>
                The discriminator loss is binary cross-entropy over <em>all</em> positions:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{RTD}} = -\sum_{i=1}^{n} \big[ \mathbb{1}[x_i = \hat{x}_i] \log P(D_i=1) + \mathbb{1}[x_i \neq \hat{x}_i] \log P(D_i=0) \big]" />

            <h3>Sample Efficiency</h3>
            <p>
                BERT learns from 15% of positions per step. ELECTRA learns from 100%. The effective
                training signal ratio is:
            </p>
            <MathBlock tex="\frac{\text{ELECTRA signal}}{\text{BERT signal}} = \frac{1.0}{0.15} \approx 6.7\text{×}" />
            <p>
                This is why ELECTRA achieves comparable accuracy to RoBERTa with significantly less
                compute — every token contributes to learning.
            </p>

            <div className="ch-callout">
                <strong>DeBERTa's disentangled attention:</strong> Standard attention computes
                <InlineMath tex="\\mathbf{Q}\\mathbf{K}^T" /> where each vector contains both content and position. DeBERTa
                separates them: <InlineMath tex="\\mathbf{Q}_c, \\mathbf{Q}_r" /> and <InlineMath tex="\\mathbf{K}_c, \\mathbf{K}_r" />, computing
                four interaction terms (content-to-content, content-to-position, position-to-content,
                position-to-position). This yields finer-grained contextual representations.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── ALBERT Factorized Embedding Size ──────────────────────────────────────────
def factorized_embedding_params(vocab_size, hidden_size, embedding_size):
    """Compare BERT vs ALBERT embedding parameters."""
    bert = vocab_size * hidden_size
    albert = vocab_size * embedding_size + embedding_size * hidden_size
    return bert, albert

# ── ELECTRA Replaced Token Detection Loss ─────────────────────────────────────
def rtd_loss(discriminator_logits, is_original):
    """
    discriminator_logits: (seq_len,) pre-sigmoid logits
    is_original: (seq_len,) bool, True if token was not replaced
    """
    probs = 1 / (1 + np.exp(-discriminator_logits))
    labels = is_original.astype(float)
    loss = -(labels * np.log(probs + 1e-10) +
             (1 - labels) * np.log(1 - probs + 1e-10))
    return np.mean(loss)

# ── Effective Signal Ratio ────────────────────────────────────────────────────
def effective_signal_ratio(masked_ratio=0.15):
    """ELECTRA sees all tokens; BERT sees only masked_ratio."""
    return 1.0 / masked_ratio

# ── Demo ──────────────────────────────────────────────────────────────────────
vocab_size = 30522
hidden_size = 4096
embedding_size = 128

bert_emb, albert_emb = factorized_embedding_params(vocab_size, hidden_size, embedding_size)

# Fake discriminator outputs
seq_len = 16
disc_logits = np.random.randn(seq_len)
is_orig = np.random.rand(seq_len) > 0.15  # ~85% original

loss = rtd_loss(disc_logits, is_orig)
ratio = effective_signal_ratio()

print("Encoder Family Comparison")
print("=" * 40)
print(f"BERT embedding params:   {bert_emb:,}")
print(f"ALBERT embedding params: {albert_emb:,}")
print(f"Reduction: {(1 - albert_emb/bert_emb)*100:.1f}%")
print()
print(f"ELECTRA RTD loss: {loss:.4f}")
print(f"Signal ratio (ELECTRA/BERT): {ratio:.1f}x")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation comparing ALBERT's factorized embeddings with BERT, and ELECTRA's
                replaced token detection loss. The demo quantifies parameter savings and training signal
                advantages.
            </p>
            <CodeBlock code={PY_CODE} filename="encoder_family.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Encoder Family Comparisons — TypeScript ─────────────────────────────────

function factorizedEmbeddingParams(
    vocabSize: number,
    hiddenSize: number,
    embeddingSize: number
): { bert: number; albert: number } {
    return {
        bert: vocabSize * hiddenSize,
        albert: vocabSize * embeddingSize + embeddingSize * hiddenSize,
    }
}

function rtdLoss(logits: number[], isOriginal: boolean[]): number {
    let total = 0
    for (let i = 0; i < logits.length; i++) {
        const prob = 1 / (1 + Math.exp(-logits[i]))
        const label = isOriginal[i] ? 1 : 0
        total += -(label * Math.log(prob + 1e-10) +
                   (1 - label) * Math.log(1 - prob + 1e-10))
    }
    return total / logits.length
}

function effectiveSignalRatio(maskedRatio = 0.15): number {
    return 1.0 / maskedRatio
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const vocabSize = 30522
const hiddenSize = 4096
const embeddingSize = 128

const { bert, albert } = factorizedEmbeddingParams(vocabSize, hiddenSize, embeddingSize)

const discLogits = Array.from({ length: 16 }, () => (Math.random() - 0.5) * 2)
const isOrig = Array.from({ length: 16 }, () => Math.random() > 0.15)

console.log("Encoder Family Comparison")
console.log("─".repeat(40))
console.log(\`BERT embedding params:   \${bert.toLocaleString()}\`)
console.log(\`ALBERT embedding params: \${albert.toLocaleString()}\`)
console.log(\`Reduction: \${((1 - albert / bert) * 100).toFixed(1)}%\`)
console.log()
console.log(\`ELECTRA RTD loss: \${rtdLoss(discLogits, isOrig).toFixed(4)}\`)
console.log(\`Signal ratio (ELECTRA/BERT): \${effectiveSignalRatio().toFixed(1)}x\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation comparing ALBERT's parameter savings and ELECTRA's training
                efficiency. The code quantifies why each variant improves on the original BERT design.
            </p>
            <CodeBlock code={TS_CODE} filename="encoder_family.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ENCODER_ONLY_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
