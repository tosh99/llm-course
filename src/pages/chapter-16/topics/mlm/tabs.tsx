import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning language by filling in blanks</h2>
            <p>
                Before BERT, language models were trained autoregressively: predict the next word given
                all previous words. This forced models to be left-to-right (or right-to-left), preventing
                deep bidirectional fusion. Devlin et al. borrowed an idea from cloze tests in psychology:
                if you delete a word and ask the model to guess it from all surrounding context, the model
                must learn to use both directions simultaneously.
            </p>

            <div className="ch16-timeline">
                <div className="ch16-tl-item">
                    <div className="ch16-tl-year">1953</div>
                    <div className="ch16-tl-section-label">Precedent</div>
                    <div className="ch16-tl-title">The Cloze Procedure</div>
                    <div className="ch16-tl-body">
                        Psychologist W.L. Taylor invented the "cloze test": delete every Nth word from a
                        passage and ask readers to fill in the blanks. The task requires understanding
                        grammar, semantics, and discourse from both sides of each gap. It became a standard
                        measure of reading comprehension.
                    </div>
                    <div className="ch16-tl-impact">Impact: Provided the pedagogical inspiration for MLM</div>
                </div>

                <div className="ch16-tl-item">
                    <div className="ch16-tl-year">2013 – 2017</div>
                    <div className="ch16-tl-section-label">Problem</div>
                    <div className="ch16-tl-title">The Directionality Trap</div>
                    <div className="ch16-tl-body">
                        Word2Vec, LSTM language models, and GPT all processed text in one direction. A model
                        reading left-to-right sees "The bank of the river" and by the time it reaches "river,"
                        it has already fixed "bank" as a financial institution. True understanding requires
                        seeing "river" <em>before</em> committing to a sense for "bank."
                    </div>
                    <div className="ch16-tl-impact">Impact: Showed that unidirectional models suffer from premature disambiguation</div>
                </div>

                <div className="ch16-tl-item">
                    <div className="ch16-tl-year">Oct 2018</div>
                    <div className="ch16-tl-section-label">Breakthrough</div>
                    <div className="ch16-tl-title">Masked Language Modeling</div>
                    <div className="ch16-tl-body">
                        BERT replaced next-word prediction with masked-word prediction. 15% of input tokens
                        are randomly selected; 80% are replaced with <code>[MASK]</code>, 10% with random
                        tokens, and 10% left unchanged. The model must predict the original word using full
                        bidirectional context. This simple change forced the Transformer encoder to learn
                        deep, contextualized representations.
                    </div>
                    <div className="ch16-tl-impact">Impact: Enabled true deep bidirectionality in neural language models</div>
                </div>

                <div className="ch16-tl-item">
                    <div className="ch16-tl-year">2019 – present</div>
                    <div className="ch16-tl-section-label">Evolution</div>
                    <div className="ch16-tl-title">SpanBERT, ALBERT, and Beyond</div>
                    <div className="ch16-tl-body">
                        SpanBERT masked contiguous spans instead of single tokens, improving coreference
                        and question answering. ALBERT shared parameters across layers and used
                        sentence-order prediction instead of NSP. ELECTRA replaced MLM entirely with a
                        replaced-token detection task, training more efficiently.
                    </div>
                    <div className="ch16-tl-impact">Impact: MLM spawned an entire family of masked pretraining objectives</div>
                </div>
            </div>

            <div className="ch16-callout">
                <strong>The 80/10/10 rule:</strong> If we always replaced masked tokens with <code>[MASK]</code>,
                the model would only see <code>[MASK]</code> during pretraining but real words during
                fine-tuning. By keeping 10% unchanged and replacing 10% with random words, the model learns
                to handle non-masked inputs too, reducing the train-test mismatch.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The missing word game</h2>

            <Analogy label="Mad Libs">
                Have you ever played Mad Libs? Someone asks for a noun, a verb, an adjective, and you
                fill in the blanks without knowing the story. Masked Language Modeling is like that,
                but backward: the story is complete except for a few hidden words, and you have to
                guess what they are by reading the whole story.
            </Analogy>

            <Analogy label="The Detective">
                Imagine you're a detective and someone has blacked out a few words in a letter. You
                can read everything else — before and after each blacked-out spot. Using clues from
                both sides, you figure out the missing words. The more letters you solve, the better
                you get at understanding language, context, and even hidden meanings.
            </Analogy>

            <Analogy label="Why Not Just Read Forward?">
                If you only read forward, you might think "bank" means money. But if you can peek
                ahead and see "river" two words later, you know it's the edge of a river. Reading
                both ways at once makes you smarter about words that have multiple meanings.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>How Masked Language Modeling works</h2>

            <h3>The Masking Strategy</h3>
            <p>
                For each input sequence, 15% of tokens are randomly selected for prediction. For each
                selected token, one of three operations is applied:
            </p>
            <ul>
                <li><strong>80% of the time:</strong> Replace with the special <code>[MASK]</code> token</li>
                <li><strong>10% of the time:</strong> Replace with a random token from the vocabulary</li>
                <li><strong>10% of the time:</strong> Leave the token unchanged</li>
            </ul>
            <p>
                The model then predicts the <em>original</em> token at every selected position using
                the full bidirectional context. Only the selected positions contribute to the loss.
            </p>

            <h3>Why It Works</h3>
            <p>
                Unlike left-to-right language modeling, where the prediction for position <InlineMath tex="i" /> only
                uses positions <InlineMath tex="1 \\dots i-1" />, MLM allows the model to attend to every other token
                when predicting position <InlineMath tex="i" />. This means:
            </p>
            <ul>
                <li>The representation for "bank" in "river bank" is influenced by "river" on the right</li>
                <li>Subject-verb agreement can be resolved by looking at both subject and intervening clauses</li>
                <li>Pronoun resolution (coreference) can use distant antecedents in both directions</li>
            </ul>

            <h3>Trade-offs</h3>
            <ul>
                <li><strong>Only 15% of positions are predicted</strong> per step, so MLM converges slower
                    than autoregressive LM (which predicts every position).</li>
                <li><strong>The [MASK] token never appears during fine-tuning,</strong> creating a
                    pretrain-finetune mismatch. The 80/10/10 rule mitigates this.</li>
                <li><strong>MLM is not directly usable for generation</strong> because it requires
                    bidirectional context — it can only fill in blanks, not generate continuations.</li>
            </ul>

            <hr className="ch16-sep" />
            <div className="ch16-callout">
                <strong>Key insight:</strong> MLM transforms language modeling from a generation task
                into a denoising task. The model learns not to predict sequences but to reconstruct
                corrupted ones — a paradigm that would later inspire BART, T5, and diffusion language
                models.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The mathematics of masked prediction</h2>

            <DefBlock label="Masked Language Modeling">
                Given an input sequence <InlineMath tex="\\mathbf{x} = (x_1, \\dots, x_n)" />, let <InlineMath tex="\\mathcal{M}" /> be a random
                subset of positions with <InlineMath tex="|\\mathcal{M}| \\approx 0.15n" />. The masked input
                <InlineMath tex="\\mathbf{x}^{\\text{masked}}" /> is constructed by replacing each <InlineMath tex="x_i" /> for <InlineMath tex="i \\in \\mathcal{M}" />
                with a corrupted version <InlineMath tex="\\tilde{x}_i" />. The objective is:
                <MathBlock tex="\mathcal{L}_{\text{MLM}} = -\mathbb{E}_{\mathbf{x}} \sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}^{\text{masked}}; \Theta)" />
            </DefBlock>

            <h3>Corruption Distribution</h3>
            <p>
                For each selected position <InlineMath tex="i \\in \\mathcal{M}" />, the corrupted token <InlineMath tex="\\tilde{x}_i" /> is sampled:
            </p>
            <MathBlock tex="\tilde{x}_i = \begin{cases} \text{[MASK]} & \text{with prob. } 0.8 \\ \text{random word} & \text{with prob. } 0.1 \\ x_i & \text{with prob. } 0.1 \end{cases}" />

            <h3>Output Layer</h3>
            <p>
                The final hidden state <InlineMath tex="\\mathbf{h}_i \\in \\mathbb{R}^d" /> for position <InlineMath tex="i" /> is projected to
                vocabulary logits via the output embedding matrix <InlineMath tex="\\mathbf{E} \\in \\mathbb{R}^{V \\times d}" />
                (tied with input embeddings) plus a bias:
            </p>
            <MathBlock tex="\mathbf{z}_i = \mathbf{E} \, \mathbf{h}_i + \mathbf{b}_{\text{out}}" />
            <MathBlock tex="P(x_i = v \mid \mathbf{x}^{\text{masked}}) = \frac{\exp(z_{i,v})}{\sum_{v'} \exp(z_{i,v'})}" />

            <h3>Gradient Signal</h3>
            <p>
                Because only positions in <InlineMath tex="\\mathcal{M}" /> have labels, gradients flow through the full
                Transformer for every masked position. The gradient for a masked position <InlineMath tex="i" /> is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_i} = \mathbf{E}^T (\mathbf{p}_i - \mathbf{e}_{x_i})" />
            <p>
                Where <InlineMath tex="\\mathbf{p}_i" /> is the predicted probability distribution and <InlineMath tex="\\mathbf{e}_{x_i}" /> is
                the one-hot vector for the true token. This gradient then backpropagates through all
                self-attention layers, updating every parameter in the model.
            </p>

            <div className="ch16-callout">
                <strong>Why shared embeddings:</strong> BERT ties the input embedding matrix <InlineMath tex="\\mathbf{E}" />
                with the output projection. This acts as a strong regularizer and reduces parameters,
                since the model must use the same vector space for reading tokens and predicting them.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── MLM Masking Strategy — NumPy ──────────────────────────────────────────────
def mlm_mask(token_ids, vocab_size, mask_id=103, mask_prob=0.15,
             mask_token_ratio=0.8, random_ratio=0.1):
    """
    Apply BERT masking: mask_prob of tokens are selected.
    Of selected: mask_token_ratio -> [MASK],
                 random_ratio -> random token,
                 rest -> unchanged.
    Returns masked tokens and label array (-100 = ignore).
    """
    masked = np.array(token_ids, copy=True)
    labels = np.full_like(token_ids, -100)

    # Exclude special tokens [PAD]=0, [CLS]=101, [SEP]=102
    candidates = [i for i, t in enumerate(token_ids)
                  if t not in (0, 101, 102)]
    n_mask = max(1, int(round(len(candidates) * mask_prob)))
    selected = np.random.choice(candidates, size=n_mask, replace=False)

    for i in selected:
        labels[i] = token_ids[i]
        r = np.random.rand()
        if r < mask_token_ratio:
            masked[i] = mask_id
        elif r < mask_token_ratio + random_ratio:
            masked[i] = np.random.randint(0, vocab_size)
        # else: leave unchanged
    return masked, labels

# ── MLM Loss (simplified) ─────────────────────────────────────────────────────
def mlm_loss(logits, labels):
    """
    logits: (seq_len, vocab_size)
    labels: (seq_len,) with -100 for ignored positions
    """
    mask = labels != -100
    active_logits = logits[mask]
    active_labels = labels[mask]

    # softmax cross-entropy
    exps = np.exp(active_logits - np.max(active_logits, axis=1, keepdims=True))
    probs = exps / np.sum(exps, axis=1, keepdims=True)

    nll = -np.log(probs[np.arange(len(active_labels)), active_labels] + 1e-10)
    return np.mean(nll)

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
vocab_size = 30522

tokens = [101, 2023, 2003, 1037, 3231, 102, 0, 0]
masked, labels = mlm_mask(tokens, vocab_size)

# Fake logits for masked positions only
n_active = np.sum(labels != -100)
fake_logits = np.random.randn(n_active, vocab_size)

loss = mlm_loss(fake_logits, labels[labels != -100])

print("MLM Masking Demo")
print("=" * 40)
print(f"Original: {tokens}")
print(f"Masked:   {masked.tolist()}")
print(f"Labels:   {labels.tolist()}")
print(f"Active positions: {n_active}")
print(f"Fake loss: {loss:.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of the MLM masking strategy and a simplified cross-entropy loss.
                The demo masks tokens from a sample input and computes loss over the active positions.
            </p>
            <CodeBlock code={PY_CODE} filename="mlm_masking.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── MLM Masking Strategy — TypeScript ────────────────────────────────────────

function mlmMask(
    tokenIds: number[],
    vocabSize: number,
    maskId = 103,
    maskProb = 0.15
): { masked: number[]; labels: number[] } {
    const masked = [...tokenIds]
    const labels = Array(tokenIds.length).fill(-100)

    const candidates = tokenIds
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => t !== 0 && t !== 101 && t !== 102)
        .map(({ i }) => i)

    const nMask = Math.max(1, Math.round(candidates.length * maskProb))
    const shuffled = candidates.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, nMask)

    for (const i of selected) {
        labels[i] = tokenIds[i]
        const r = Math.random()
        if (r < 0.8) {
            masked[i] = maskId
        } else if (r < 0.9) {
            masked[i] = Math.floor(Math.random() * vocabSize)
        }
    }
    return { masked, labels }
}

function softmax(logits: number[]): number[] {
    const maxVal = Math.max(...logits)
    const exps = logits.map(v => Math.exp(v - maxVal))
    const sum = exps.reduce((a, b) => a + b, 0)
    return exps.map(v => v / sum)
}

function mlmLoss(logits: number[][], labels: number[]): number {
    const active = labels.map((l, i) => ({ l, i })).filter(({ l }) => l !== -100)
    let total = 0
    for (const { l, i } of active) {
        const probs = softmax(logits[i])
        total += -Math.log(probs[l] + 1e-10)
    }
    return total / active.length
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const tokens = [101, 2023, 2003, 1037, 3231, 102, 0, 0]
const { masked, labels } = mlmMask(tokens, 30522)

console.log("MLM Masking Demo")
console.log("─".repeat(40))
console.log("Original:", tokens.join(" "))
console.log("Masked:  ", masked.join(" "))
console.log("Labels:  ", labels.join(" "))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of BERT's MLM masking strategy. The function applies the
                80/10/10 rule and returns masked tokens with labels for the selected positions.
            </p>
            <CodeBlock code={TS_CODE} filename="mlm_masking.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const MLM_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
