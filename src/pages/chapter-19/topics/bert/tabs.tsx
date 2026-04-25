import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The bidirectional breakthrough</h2>
            <p>
                In 2018, NLP was split between left-to-right language models (GPT) and shallow contextual
                embeddings (ELMo). Neither could deeply fuse context from both directions simultaneously.
                Jacob Devlin and colleagues at Google asked: what if we trained a Transformer encoder to
                attend to every word in both directions at once? The result was BERT — a paradigm shift
                that dominated NLP benchmarks for years.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">The Transformer</div>
                    <div className="ch-tl-body">
                        Vaswani et al. introduced self-attention, allowing every token to attend to every
                        other token in a single layer. The original paper used an encoder-decoder architecture
                        for translation, but the encoder stack alone held untapped potential.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided the architectural substrate for deep bidirectional models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">GPT-1 and ELMo</div>
                    <div className="ch-tl-body">
                        GPT-1 proved decoder-only pretraining worked; ELMo proved deep contextualized
                        representations worked. But GPT could only see left context, and ELMo's bidirectionality
                        was shallow — two independent LSTMs concatenated, not true fused attention.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed the need for deep, unified bidirectional context</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Devlin et al. — BERT</div>
                    <div className="ch-tl-body">
                        "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"
                        introduced two innovations: (1) a deep bidirectional Transformer encoder trained with
                        Masked Language Modeling, and (2) a simple fine-tuning recipe where the same pretrained
                        model handles classification, question answering, and NLI with minimal task-specific
                        architecture changes. BERT-Base: 12 layers, 110M params. BERT-Large: 24 layers, 340M params.
                    </div>
                    <div className="ch-tl-impact">Impact: Set new SOTA on 11 NLP benchmarks; the template for modern encoder models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2022</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">The BERT Era</div>
                    <div className="ch-tl-body">
                        BERT became the default starting point for NLP practitioners. Variants multiplied:
                        RoBERTa optimized the training recipe, ALBERT reduced parameters, DistilBERT compressed
                        for speed, ELECTRA replaced masking with token detection. Google's search ranking
                        began using BERT in 2019. Even today, encoder-only models dominate classification,
                        retrieval, and embedding tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: BERT established the encoder-only paradigm that still powers production NLP</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> True bidirectionality requires masking. If a model is
                allowed to see every word, it can trivially predict any target. By masking 15% of input
                tokens and forcing the model to reconstruct them from all surrounding context, BERT learns
                deep, fused representations that capture syntax, semantics, and world knowledge.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Reading with both eyes open</h2>

            <Analogy label="The Missing Word Game">
                Imagine you're reading a sentence but some words are covered with sticky notes:
                "The ___ chased the mouse around the house." You can look at every other word — before
                <em>and</em> after the blank — to figure out the missing word is "cat." BERT plays this
                game millions of times, learning to use clues from both sides.
            </Analogy>

            <Analogy label="The One-Way Street vs. the Intersection">
                GPT is like driving down a one-way street: you can only see what's behind you. BERT is
                like standing in the middle of an intersection: you can see traffic coming from every
                direction at once. That's why BERT is so good at understanding a word's meaning in context.
            </Analogy>

            <Analogy label="The Chameleon (Again)">
                Just like GPT, BERT learns by reading everything. But when you ask it a question, you don't
                retrain the whole model — you just add a tiny new layer on top and show it a few examples.
                The rest of BERT's giant brain stays exactly the same. It's like hiring a genius and just
                teaching them the rules of your specific quiz.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>BERT architecture and fine-tuning</h2>

            <h3>Architecture</h3>
            <p>
                BERT uses a <em>Transformer encoder</em> stack — no decoder, no causal masking. Every
                layer is a standard Transformer block: multi-head self-attention (unmasked), followed by
                a position-wise feed-forward network, with layer normalization and residuals.
            </p>
            <ul>
                <li><strong>BERT-Base:</strong> 12 layers, 768 hidden size, 12 attention heads, 110M parameters</li>
                <li><strong>BERT-Large:</strong> 24 layers, 1024 hidden size, 16 attention heads, 340M parameters</li>
                <li><strong>Context length:</strong> 512 tokens</li>
                <li><strong>Vocabulary:</strong> 30,522 WordPiece tokens</li>
                <li><strong>Positional encoding:</strong> Learned embeddings (not sinusoidal)</li>
            </ul>

            <h3>Pretraining Objectives</h3>
            <p>
                BERT is pretrained on two tasks simultaneously:
            </p>
            <ul>
                <li><strong>Masked Language Modeling (MLM):</strong> 15% of tokens are selected. Of those,
                    80% are replaced with <code>[MASK]</code>, 10% with random tokens, and 10% left unchanged.
                    The model predicts the original token using bidirectional context.</li>
                <li><strong>Next Sentence Prediction (NSP):</strong> Given two sentences (A, B), predict
                    whether B is the actual next sentence that follows A in the corpus (50% positive,
                    50% random negative). This teaches sentence-level discourse understanding.</li>
            </ul>

            <h3>Fine-Tuning</h3>
            <p>
                For downstream tasks, BERT adds a minimal task-specific head and fine-tunes all parameters
                end-to-end:
            </p>
            <ul>
                <li><strong>Classification:</strong> A linear layer on the <code>[CLS]</code> token's final hidden state</li>
                <li><strong>Sentence Pair:</strong> Concatenate A and B with a <code>[SEP]</code> token; predict from <code>[CLS]</code></li>
                <li><strong>Question Answering:</strong> Two linear layers predict start and end span positions</li>
                <li><strong>Tagging:</strong> A linear layer on every token's hidden state</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> BERT-Large achieved 93.2 F1 on SQuAD 1.1 (beating human
                performance), 86.7% on GLUE, and 80.5% on MultiNLI — all with the same pretrained model
                and minimal task-specific changes.
            </div>


            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations · proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · NumPy · PyTorch</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

function MathsContent() {
    return (
        <>
            <h2>Masked language modeling and attention</h2>

            <DefBlock label="Transformer Encoder Block">
                For input <InlineMath tex="\\mathbf{X} \\in \\mathbb{R}^{n \\times d}" />, each encoder block computes:
                <MathBlock tex="\mathbf{A} = \text{MHA}(\text{LayerNorm}(\mathbf{X})) + \mathbf{X}" />
                <MathBlock tex="\mathbf{H} = \text{FFN}(\text{LayerNorm}(\mathbf{A})) + \mathbf{A}" />
                Unlike the decoder, there is no causal mask: every position attends to every other position.
            </DefBlock>

            <h3>Masked Language Modeling Loss</h3>
            <p>
                Let <InlineMath tex="\\mathcal{M}" /> be the set of masked positions (typically 15% of tokens). For each
                masked position <InlineMath tex="i \\in \\mathcal{M}" />, the model outputs logits <InlineMath tex="\\mathbf{z}_i \\in \\mathbb{R}^V" />
                and we minimize the cross-entropy:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{MLM}} = -\sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}_{\setminus \mathcal{M}}; \Theta)" />
            <p>
                Where <InlineMath tex="\\mathbf{x}_{\\setminus \\mathcal{M}}" /> denotes the entire input sequence with some
                tokens corrupted. The model sees all non-masked tokens in both directions.
            </p>

            <h3>Next Sentence Prediction Loss</h3>
            <p>
                Given sentence pair <InlineMath tex="(A, B)" />, the <code>[CLS]</code> token's final hidden state
                <InlineMath tex="\\mathbf{h}_{\\text{CLS}} \\in \\mathbb{R}^d" /> is fed to a binary classifier:
            </p>
            <MathBlock tex="P(\text{IsNext} \mid A, B) = \sigma(\mathbf{w}^T \mathbf{h}_{\text{CLS}} + b)" />
            <MathBlock tex="\mathcal{L}_{\text{NSP}} = -\big[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \big]" />

            <h3>Total Pretraining Objective</h3>
            <MathBlock tex="\mathcal{L} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{NSP}}" />

            <h3>Fine-Tuning: Sentence Classification</h3>
            <p>
                For a C-way classification task, the prediction is:
            </p>
            <MathBlock tex="\hat{y} = \text{softmax}(\mathbf{W}_c \, \mathbf{h}_{\text{CLS}} + \mathbf{b}_c)" />
            <p>
                Where <InlineMath tex="\\mathbf{W}_c \\in \\mathbb{R}^{C \\times d}" /> and <InlineMath tex="\\mathbf{h}_{\\text{CLS}}" /> is the
                final hidden state of the special <code>[CLS]</code> token prepended to every input.
            </p>

            <div className="ch-callout">
                <strong>Why MLM works:</strong> By masking tokens randomly, the model cannot rely on
                positional shortcuts. It must build a rich contextual representation of every position
                that incorporates syntax (subject-verb agreement), semantics (word sense disambiguation),
                and world knowledge (factual reasoning).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── BERT Input Encoding — NumPy ───────────────────────────────────────────────
def encode_input(tokens_a, tokens_b=None, max_len=512):
    """
    Build BERT input: [CLS] tokens_a [SEP] tokens_b [SEP]
    Returns token_ids, segment_ids, and attention_mask.
    """
    cls_id, sep_id = 101, 102
    token_ids = [cls_id] + tokens_a + [sep_id]
    segment_ids = [0] * len(token_ids)

    if tokens_b is not None:
        token_ids += tokens_b + [sep_id]
        segment_ids += [1] * (len(tokens_b) + 1)

    # Pad or truncate
    pad_len = max_len - len(token_ids)
    if pad_len < 0:
        token_ids = token_ids[:max_len]
        segment_ids = segment_ids[:max_len]
    else:
        token_ids += [0] * pad_len
        segment_ids += [0] * pad_len

    attention_mask = [1 if t != 0 else 0 for t in token_ids]
    return np.array(token_ids), np.array(segment_ids), np.array(attention_mask)

# ── Masked Token Selection ────────────────────────────────────────────────────
def mask_tokens(token_ids, vocab_size, mask_id=103, mask_prob=0.15):
    """
    Mask 15% of tokens: 80% [MASK], 10% random, 10% unchanged.
    Returns masked_ids and labels (only for selected positions).
    """
    masked = token_ids.copy()
    labels = np.full_like(token_ids, -100)  # -100 = ignore in loss

    candidates = [i for i, t in enumerate(token_ids) if t not in (0, 101, 102)]
    n_mask = max(1, int(len(candidates) * mask_prob))
    selected = np.random.choice(candidates, size=n_mask, replace=False)

    for i in selected:
        labels[i] = token_ids[i]
        r = np.random.rand()
        if r < 0.8:
            masked[i] = mask_id
        elif r < 0.9:
            masked[i] = np.random.randint(0, vocab_size)
        # else: leave unchanged
    return masked, labels

# ── Demo ──────────────────────────────────────────────────────────────────────
vocab_size = 30522
np.random.seed(42)

tokens_a = [2023, 2003, 1037, 3231]  # "this is a test"
tokens_b = [2003, 1037, 3231]        # "is a test"

token_ids, seg_ids, mask = encode_input(tokens_a, tokens_b, max_len=16)
masked, labels = mask_tokens(token_ids, vocab_size)

print("BERT Input Encoding")
print("=" * 40)
print(f"Token IDs:  {token_ids}")
print(f"Segment IDs: {seg_ids}")
print(f"Masked IDs:  {masked}")
print(f"Labels:      {labels}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of BERT input encoding and the masked token selection strategy.
                The demo shows how sentence pairs are packed with <code>[CLS]</code> and <code>[SEP]</code>
                tokens, and how the 80/10/10 masking rule is applied.
            </p>
            <CodeBlock code={PY_CODE} filename="bert_encoding.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BERT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
