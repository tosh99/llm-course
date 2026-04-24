import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The decoder-only pretraining revolution</h2>
            <p>
                In 2018, while the world was obsessing over bidirectional encoders and translation models,
                Alec Radford and colleagues at OpenAI took a radically different path. What if the simplest
                possible architecture — a left-to-right Transformer decoder — trained on the simplest possible
                objective (predict the next word), could learn representations powerful enough to solve
                arbitrary NLP tasks? GPT-1 proved that it could.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Vaswani et al. — Attention Is All You Need</div>
                    <div className="ch-tl-body">
                        The Transformer architecture introduced multi-head self-attention and position-wise
                        feed-forward networks, enabling unprecedented parallelization during training. The
                        original paper used an encoder-decoder architecture for machine translation.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided the architectural substrate for GPT</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">ULMFiT &amp; ELMo</div>
                    <div className="ch-tl-body">
                        Both ULMFiT and ELMo demonstrated that language model pretraining followed by task-specific
                        fine-tuning was a viable paradigm. However, both used LSTM-based architectures and required
                        task-specific architectural modifications. The question remained: could a single,
                        general-purpose architecture handle all tasks?
                    </div>
                    <div className="ch-tl-impact">Impact: Proved the pretrain-then-finetune paradigm but left room for a unified architecture</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2018</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Radford et al. — GPT-1</div>
                    <div className="ch-tl-body">
                        "Improving Language Understanding by Generative Pre-Training" introduced a 12-layer
                        Transformer decoder (117M parameters) trained on the BooksCorpus (7,000 unpublished
                        books). The key innovation was <em>task-agnostic architecture</em>: the same model,
                        with only an input transformation, could handle classification, entailment, similarity,
                        and multiple-choice tasks. No task-specific layers were needed.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that a single decoder-only model could be a universal NLP solver</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2019</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">The GPT Lineage Begins</div>
                    <div className="ch-tl-body">
                        GPT-1's architecture and training recipe became the template for GPT-2 (1.5B params),
                        GPT-3 (175B params), and eventually ChatGPT. The decoder-only, left-to-right,
                        next-token-prediction approach — initially seen as inferior to bidirectional methods —
                        turned out to be the most scalable path to general intelligence. BERT won 2018's
                        benchmarks, but GPT won the war.
                    </div>
                    <div className="ch-tl-impact">Impact: The architectural foundation of modern large language models</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> A left-to-right language model must learn to condition
                on all previous context to predict the next token. This forces it to learn a rich, general
                representation of language, world knowledge, and reasoning — all from a single simple
                objective. Task-specific fine-tuning then steers this general capability toward a target.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning to finish stories</h2>

            <Analogy label="The Story Game">
                Imagine a game where someone starts a story and you have to finish the next sentence.
                "Once upon a time, there was a dragon who loved..." You might guess "ice cream" or
                "gold" or "flying." To get good at this game, you have to learn everything: grammar,
                facts about dragons, story structure, what makes sense, and what doesn't.
            </Analogy>

            <Analogy label="The Secret Skill">
                Now here's the trick: after playing this game with millions of stories, you discover
                you've accidentally become an expert at <em>everything</em>. You can summarize stories,
                answer questions about them, sort them by mood, and even write new ones. All because
                you practiced finishing sentences. GPT-1 is like a child who became a genius just by
                playing the story-finish game over and over.
            </Analogy>

            <Analogy label="The Chameleon">
                The really clever part is that the same child can do any language task with almost
                no extra training. Want them to classify emails? Just say "Email: ... Label:" and
                they'll finish with "spam" or "not spam." Want them to answer questions? Write
                "Question: ... Answer:" and they'll fill in the blank. The child is the same;
                only the prompt changes.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Generative pre-training with task-agnostic fine-tuning</h2>

            <h3>Architecture</h3>
            <p>
                GPT-1 is a 12-layer Transformer <em>decoder</em>. Unlike the original Transformer which
                had both encoder and decoder, GPT-1 uses only the decoder stack with masked self-attention
                (each position can only attend to previous positions). This enforces the left-to-right
                autoregressive property needed for language modeling.
            </p>
            <ul>
                <li><strong>Layers:</strong> 12 Transformer blocks</li>
                <li><strong>Hidden size:</strong> 768</li>
                <li><strong>Attention heads:</strong> 12 (64 dims each)</li>
                <li><strong>Parameters:</strong> ~117 million</li>
                <li><strong>Context length:</strong> 512 tokens</li>
                <li><strong>Vocabulary:</strong> 40,000 Byte-Pair Encoding tokens</li>
            </ul>

            <h3>Pretraining Objective</h3>
            <p>
                Given a sequence of tokens (u<sub>1</sub>, …, u<sub>n</sub>), maximize the likelihood
                of each token conditioned on all previous tokens:
            </p>
            <MathBlock tex="\mathcal{L}_1(\mathcal{U}) = \sum_{i} \log P(u_i \mid u_{i-k}, \dots, u_{i-1}; \Theta)" />
            <p>
                This is standard causal language modeling. The model learns to predict the next word
                given all previous words, which implicitly requires understanding syntax, semantics,
                facts, and reasoning.
            </p>

            <h3>Task-Specific Input Transformations</h3>
            <p>
                For fine-tuning, GPT-1 converts structured inputs into token sequences. A linear
                + softmax layer is added on top of the final hidden state at the delimiter position:
            </p>
            <ul>
                <li><strong>Classification:</strong> Start + Text + Extract</li>
                <li><strong>Entailment:</strong> Start + Premise + Delim + Hypothesis + Extract</li>
                <li><strong>Similarity:</strong> Start + Text1 + Delim + Text2 + Extract (and reversed)</li>
                <li><strong>Multiple Choice:</strong> Start + Context + Delim + Answer + Extract</li>
            </ul>
            <p>
                The auxiliary language modeling objective is added during fine-tuning to improve
                generalization and accelerate convergence:
            </p>
            <MathBlock tex="\mathcal{L}_2(\mathcal{C}) = \mathcal{L}_1(\mathcal{C}) + \lambda \cdot \mathcal{L}_{\text{task}}(\mathcal{C})" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> GPT-1 achieved 72.8% on the GLUE benchmark, improving the
                state-of-the-art by 5.5 absolute points on average across 12 NLP tasks. On natural
                language inference, it outperformed task-specific architectures with 10× more parameters.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Masked self-attention and the generative objective</h2>

            <DefBlock label="Causal (Masked) Self-Attention">
                For a sequence of length n, the attention matrix A ∈ ℝ<sup>n×n</sup> is masked so that
                each position can only attend to previous positions:
                <MathBlock tex="A_{ij} = \begin{cases} \frac{\mathbf{Q}_i \cdot \mathbf{K}_j}{\sqrt{d_k}} & j \leq i \\ -\infty & j > i \end{cases}" />
                After softmax, the attention weights form a lower-triangular matrix. This enforces the
                autoregressive property: the prediction for position i cannot depend on positions &gt; i.
            </DefBlock>

            <h3>Transformer Block (Decoder)</h3>
            <p>
                Each decoder block consists of masked multi-head self-attention followed by a
                position-wise feed-forward network, with layer normalization and residual connections:
            </p>
            <MathBlock tex="\mathbf{H}^{(0)} = \mathbf{E} + \mathbf{P}" />
            <MathBlock tex="\mathbf{H}^{(\ell)} = \text{DecoderBlock}(\mathbf{H}^{(\ell-1)})" />
            <MathBlock tex="\text{DecoderBlock}(\mathbf{X}) = \text{FFN}(\text{LayerNorm}(\text{MHA}(\mathbf{X}) + \mathbf{X})) + \text{MHA}(\mathbf{X}) + \mathbf{X}" />
            <p>
                Here E is the token embedding matrix and P is the learned positional embedding matrix.
            </p>

            <h3>Language Modeling Objective</h3>
            <p>
                The model outputs logits z<sub>i</sub> ∈ ℝ<sup>V</sup> for each position i. The loss is
                the cross-entropy between the predicted distribution and the true next-token distribution:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{LM}} = -\sum_{i=1}^{n} \log \frac{\exp(z_{i, u_i})}{\sum_{v=1}^{V} \exp(z_{i, v})}" />

            <h3>Fine-Tuning Objective</h3>
            <p>
                Let C = (x<sup>1</sup>, …, x<sup>m</sup>, y) be a labeled dataset. The fine-tuning loss
                combines the task loss with the language modeling loss:
            </p>
            <MathBlock tex="\mathcal{L}(\mathcal{C}) = \mathcal{L}_{\text{task}}(y, f(x^1, \dots, x^m)) + \lambda \cdot \mathcal{L}_{\text{LM}}(x^1, \dots, x^m)" />
            <p>
                The hyperparameter λ controls the trade-off. In practice, λ = 0.5 works well for most tasks.
                The language modeling auxiliary acts as a regularizer, preventing the model from forgetting
                its pretrained knowledge during task-specific adaptation.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For a model with L layers, hidden size d, vocabulary V, and context length n:
            </p>
            <MathBlock tex="\text{Params} = V \cdot d + n \cdot d + L \cdot (4 d^2 + 2 d \cdot d_{\text{ff}}) + d_{\text{ff}} \cdot d" />
            <p>
                With V = 40,000, d = 768, d<sub>ff</sub> = 3072, L = 12, and n = 512, this gives
                approximately 117 million parameters.
            </p>

            <div className="ch-callout">
                <strong>Why decoder-only scales better:</strong> Encoder-decoder models must attend to
                the full source and target sequences, creating O(n·m) complexity. Decoder-only models
                have O(n²) complexity but can be trained with simple next-token prediction, which is
                easier to parallelize and scales to much larger datasets and model sizes.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Causal Mask for Self-Attention — NumPy ────────────────────────────────────
def causal_mask(seq_len):
    """Lower-triangular mask: True = attend, False = mask out."""
    return np.tril(np.ones((seq_len, seq_len)), k=0).astype(bool)

def masked_attention(Q, K, V, mask):
    """
    Q, K, V: (seq_len, d_k)
    mask: (seq_len, seq_len) boolean
    """
    scores = Q @ K.T / np.sqrt(Q.shape[1])
    scores = np.where(mask, scores, -1e9)
    attn = np.exp(scores - np.max(scores, axis=1, keepdims=True))
    attn = attn / attn.sum(axis=1, keepdims=True)
    return attn @ V

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
seq_len, d_k = 5, 8

Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)
mask = causal_mask(seq_len)

out = masked_attention(Q, K, V, mask)

print("Causal Self-Attention Demo")
print("=" * 40)
print(f"Mask (lower-triangular):")
print(mask.astype(int))
print()
print(f"Output shape: {out.shape}")
print(f"Output norms per position:")
for i in range(seq_len):
    print(f"  pos {i}: ||out|| = {np.linalg.norm(out[i]):.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of causal (masked) self-attention, the core mechanism that enables
                GPT's left-to-right autoregressive training. The demo shows the lower-triangular mask
                and the resulting attention output.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT1_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
