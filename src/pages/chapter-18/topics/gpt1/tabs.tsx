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
                    <div className="ch-tl-year">2017 — Vaswani et al.</div>
                    <div className="ch-tl-title">The Transformer — Architecture Without Recurrence</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        LSTM language models were slow to train — they processed tokens sequentially and could not be parallelized across the sequence length. Long-range dependencies were unstable despite gating mechanisms. As datasets and model sizes grew, the recurrent bottleneck became the primary obstacle to scaling.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Vaswani et al.'s "Attention Is All You Need" (2017) replaced recurrence entirely with multi-head self-attention. Every token could attend to every other token in a single layer, enabling full parallelization during training. The original Transformer used an encoder-decoder architecture for machine translation — the encoder read the source language, the decoder generated the target. But the decoder stack alone, with its causal masking, could function as a powerful language model.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The Transformer's parallel training enabled unprecedented scale. Models that previously took weeks on LSTMs could be trained in days. Long-range dependencies that LSTMs struggled with were handled in a single attention layer. The architecture provided the substrate for GPT's decoder-only design.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Early 2018 — Howard, Peters et al.</div>
                    <div className="ch-tl-title">ULMFiT and ELMo Prove the Paradigm</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        ULMFiT and ELMo had established that language model pretraining transferred to downstream tasks. But both used LSTMs, which were slower and less powerful than Transformers. Both also required task-specific modifications — ELMo extracted layer-weighted embeddings as external features, while ULMFiT required careful hyperparameter tuning per task. Could a single Transformer model be designed to handle arbitrary tasks with minimal modification?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ULMFiT's key insight was full model fine-tuning (not just feature extraction). ELMo's key insight was that large LMs captured rich linguistic knowledge. GPT-1 combined both: full Transformer fine-tuning on a large LM pretrained corpus. The question was whether a Transformer decoder could match or exceed LSTM-based approaches at both pretraining and transfer.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        By mid-2018, the field had strong evidence for LM pretraining but lacked a Transformer-native version. OpenAI's GPT-1 filled this gap — applying the Transformer's scale advantages to the pretraining paradigm and demonstrating that decoder-only models were as versatile as encoder-based approaches.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jun 2018 — Radford et al.</div>
                    <div className="ch-tl-title">GPT-1 — Generative Pre-Training at Scale</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        OpenAI's team, led by Alec Radford, aimed to create a task-agnostic NLP model: one that could be fine-tuned to any task with minimal architectural changes. The challenge was designing an input representation flexible enough to handle classification (single input), entailment (premise + hypothesis), similarity (two texts), and question answering (context + question + multiple choices) without adding task-specific components.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        "Improving Language Understanding by Generative Pre-Training" presented a 12-layer Transformer decoder (117M parameters) trained on BooksCorpus (7,000 unpublished books, 800M words) with causal language modeling. Task-specific fine-tuning used structured input templates: special delimiter tokens ([Start], [Delim], [Extract]) packed all task inputs into a single linear sequence, so the same decoder architecture handled every task. A linear layer on the final hidden state at the [Extract] position produced task outputs.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        GPT-1 outperformed task-specific architectures on 9 of 12 NLP tasks it was evaluated on, improving GLUE by 5.5 points. Natural language inference improved by 1.5% over the previous SoTA. Most striking: GPT-1 used the same architecture for all tasks — demonstrating that a single pretrained model could serve as a universal NLP backbone. This was qualitatively different from LSTM-based pretraining, which required task-specific adaptation of the recurrent structure.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Late 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">GPT vs. BERT — Two Philosophies Diverge</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's release in October 2018 immediately outperformed GPT-1 on most NLP benchmarks by a significant margin. BERT's bidirectional training allowed richer representations for understanding tasks. Many researchers concluded that GPT's unidirectional approach was inferior and that the future of NLP was encoder-based bidirectional models.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        GPT-2 (February 2019) scaled the GPT architecture to 1.5B parameters trained on 40GB of internet text (WebText). It produced remarkably fluent text generation — long enough that OpenAI initially declined to release the full model over misuse concerns. GPT-3 (2020) scaled further to 175B parameters, demonstrating in-context learning: the ability to perform tasks from a few examples in the prompt without any gradient updates.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The GPT vs. BERT debate resolved differently from early expectations. BERT won on NLU benchmarks; GPT won on generation and scalability. As models grew past 1B parameters, generation became central — and GPT's autoregressive decoder was the only architecture that naturally handled it. GPT-3's in-context learning showed that fine-tuning was unnecessary at sufficient scale. GPT-1's modest beginning led directly to ChatGPT and the modern LLM era.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 — Analysis papers</div>
                    <div className="ch-tl-title">What Does GPT Actually Learn?</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        GPT-1's impressive results on diverse NLP tasks raised an interpretability question: was the model actually learning general linguistic and world knowledge, or was it finding task-specific shortcuts? If fine-tuning on entailment just taught the model to recognize surface-level patterns (premise and hypothesis sharing many words = entailment), the pretraining wouldn't be doing useful work.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Probing studies (Tenney et al., Jawahar et al.) showed that GPT's representations encoded rich linguistic structure: lower Transformer layers captured POS and morphology, middle layers captured syntax (constituency and dependency), and upper layers captured semantic and discourse information. Ablation studies showed that removing pretraining caused dramatic performance drops, confirming that the model's general knowledge was essential, not incidental.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        These analyses confirmed that large language models genuinely learn hierarchical linguistic representations, not surface statistics. The same hierarchy was later found in BERT, establishing that Transformer language models — whether encoder or decoder — learn to organize linguistic knowledge in a consistent, interpretable layered structure. This understanding guided architecture design for all subsequent models.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 — Brown et al.</div>
                    <div className="ch-tl-title">GPT-3 and In-Context Learning — The Paradigm Shift Completes</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Even with GPT-1's success, fine-tuning remained expensive: you needed labeled data, GPU time, and a trained ML engineer for every new task. For many real-world applications — especially in low-resource settings — this was prohibitive. Could a sufficiently large model perform tasks without any fine-tuning at all?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        GPT-3's 175B parameters enabled "few-shot learning in context": by providing a few examples in the prompt (no gradient updates), the model could perform arithmetic, code generation, translation, and complex reasoning. In-context learning meant that the same GPT-3 model served as the few-shot learner for any task — the paradigm that GPT-1 pointed toward but could not achieve at 117M parameters.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        GPT-3 proved that GPT-1's architectural choice — decoder-only, causal language modeling — was not a limitation but a strength at scale. The autoregressive structure that "missed" right-context compared to BERT turned out to be essential for fluent generation and in-context learning. GPT-1 was the prototype; GPT-3 was the destination. Every commercial LLM product since 2022 traces its lineage directly to GPT-1's 2018 architecture.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> A left-to-right language model must learn to condition
                on all previous context to predict the next token. This forces it to learn a rich, general
                representation of language, world knowledge, and reasoning — all from a single simple
                objective. Task-specific fine-tuning then steers this general capability toward a target.
                At sufficient scale, even fine-tuning becomes unnecessary.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning to finish stories</h2>

            <Analogy label="The Story Game">
                <p>Imagine a game where someone starts a story and you have to finish the next sentence.
                "Once upon a time, there was a dragon who loved..." You might guess "ice cream" or
                "gold" or "flying." To get good at this game, you have to learn everything: grammar,
                facts about dragons, story structure, what makes sense, and what doesn't.</p>
                <p>GPT-1 played this game on 7,000 unpublished books — 800 million words. Not once or twice, but over and over, predicting every word from all the words before it. After enough practice, something remarkable happened.</p>
            </Analogy>

            <Analogy label="The Secret Skill">
                <p>Here's the trick: after playing this game with millions of stories, the model discovered
                it had accidentally become an expert at <em>everything</em>. It could summarize stories,
                answer questions about them, sort them by mood, and even write new ones. All because
                it practiced finishing sentences.</p>
                <p>To predict the next word in "The defendant was found not guilty because the jury..." the model had to understand legal concepts, sentence structure, and narrative logic. The next-word game secretly teaches everything about language and the world.</p>
            </Analogy>

            <Analogy label="The One-Way Street">
                <p>GPT-1 reads only left-to-right. When it sees "I went to the bank to..." it predicts the next word before knowing whether bank means money or river. This seems like a weakness — but it's also what makes the model good at generating new text. You can't write a story backwards.</p>
                <p>BERT (coming next chapter) fixed this for understanding tasks. But GPT's left-to-right approach turned out to be essential for generation. The two approaches served different purposes, and both became important.</p>
            </Analogy>

            <Analogy label="The Chameleon">
                <p>The really clever part of GPT-1 is that the same model can do any language task with almost
                no extra training. Want it to classify emails? Just say "Email: [text] Label:" and
                it fills in "spam" or "not spam." Want it to answer questions? Write
                "Question: [question] Answer:" and it fills in the answer.</p>
                <p>The model is the same; only the prompt format changes. This "prompting" idea — which seemed like a minor trick in 2018 — became the dominant way to use language models by 2020.</p>
            </Analogy>

            <Analogy label="The GPT Family Tree">
                <p>GPT-1 had 117 million parameters. It was impressive but not extraordinary. Then OpenAI scaled up: GPT-2 (1.5 billion parameters, 2019) wrote such convincing news articles that OpenAI was afraid to release it. GPT-3 (175 billion parameters, 2020) could write code, translate languages, and solve logic puzzles with just a few examples in the prompt.</p>
                <p>GPT-4 (2023) powered ChatGPT and became the most widely used AI product in history. Every step traced back to GPT-1's simple 2018 insight: train a Transformer decoder to predict the next word, and everything else follows.</p>
            </Analogy>

            <Analogy label="Why Left-to-Right Won">
                <p>In 2018, most people thought BERT's bidirectional reading was smarter than GPT's one-directional reading. And for understanding tasks, BERT was indeed better. But as models got bigger, a surprising thing happened: one-directional models could generate text, and generation turned out to be the key to everything.</p>
                <p>Asking a model to "complete" a task is much more flexible than asking it to classify something. You can complete essays, write code, answer questions, translate, summarize — all with the same left-to-right completion model, just by changing what you write before the answer. GPT-1 pointed the way.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Generative pre-training with task-agnostic fine-tuning</h2>

            <h3>Architecture — Transformer Decoder Stack</h3>
            <p>
                GPT-1 is a 12-layer Transformer <em>decoder</em>. Unlike the original Transformer which
                had both encoder and decoder, GPT-1 uses only the decoder stack with masked self-attention
                (each position can only attend to previous positions). This enforces the left-to-right
                autoregressive property needed for language modeling:
            </p>
            <ul>
                <li><strong>Layers:</strong> 12 Transformer blocks</li>
                <li><strong>Hidden size:</strong> 768</li>
                <li><strong>Attention heads:</strong> 12 (64 dims each)</li>
                <li><strong>Parameters:</strong> ~117 million</li>
                <li><strong>Context length:</strong> 512 tokens</li>
                <li><strong>Vocabulary:</strong> 40,000 Byte-Pair Encoding (BPE) tokens</li>
                <li><strong>Training corpus:</strong> BooksCorpus — 7,000 unpublished fiction books, 800M words</li>
                <li><strong>Positional embeddings:</strong> Learned (not sinusoidal)</li>
            </ul>

            <h3>Pretraining Objective — Causal Language Modeling</h3>
            <p>
                Given a sequence of tokens (u&#8321;, &#8230;, u&#8319;), maximize the likelihood
                of each token conditioned on all previous tokens using a context window of size k:
            </p>
            <MathBlock tex="\mathcal{L}_1(\mathcal{U}) = \sum_{i} \log P(u_i \mid u_{i-k}, \dots, u_{i-1};\, \Theta)" />
            <p>
                This is standard causal language modeling. The model learns to predict the next word
                given all previous words, implicitly requiring understanding of syntax, semantics,
                facts, and reasoning patterns. Every token prediction is a training signal — unlike MLM
                which only trains on 15% of positions.
            </p>

            <h3>Task-Specific Input Transformations</h3>
            <p>
                For fine-tuning, GPT-1 converts structured inputs into token sequences using special
                delimiter tokens ([Start], [Delim], [Extract]). A linear + softmax layer is added on
                top of the final hidden state at the [Extract] position:
            </p>
            <ul>
                <li><strong>Classification:</strong> [Start] + Text + [Extract]</li>
                <li><strong>Textual Entailment:</strong> [Start] + Premise + [Delim] + Hypothesis + [Extract]</li>
                <li><strong>Semantic Similarity:</strong> [Start] + Text&#8321; + [Delim] + Text&#8322; + [Extract] (and reversed, averaged)</li>
                <li><strong>Multiple Choice:</strong> [Start] + Context + [Delim] + Answer&#8336; + [Extract] (one input per answer candidate)</li>
            </ul>

            <h3>Fine-Tuning Objective — Auxiliary LM Loss</h3>
            <p>
                During fine-tuning, the auxiliary language modeling objective is added alongside the task
                loss to improve generalization and prevent forgetting:
            </p>
            <MathBlock tex="\mathcal{L}(\mathcal{C}) = \mathcal{L}_{\text{task}}(\mathcal{C}) + \lambda \cdot \mathcal{L}_1(\mathcal{C})" />
            <p>
                With &#955; = 0.5, the combined objective trains the model to both perform the downstream
                task and maintain language modeling ability. This prevents catastrophic forgetting of the
                general knowledge acquired during pretraining — similar to the dual objective in standard
                multi-task learning.
            </p>

            <h3>GPT-1 vs. ELMo — Architecture Comparison</h3>
            <p>
                GPT-1 and ELMo appeared in the same year but took very different approaches:
            </p>
            <ul>
                <li><strong>Architecture:</strong> GPT uses a Transformer decoder; ELMo uses a biLSTM</li>
                <li><strong>Directionality:</strong> GPT is unidirectional (left-to-right); ELMo is bidirectional (two separate LSTMs)</li>
                <li><strong>Integration:</strong> GPT fine-tunes all parameters end-to-end; ELMo freezes the LM and extracts features</li>
                <li><strong>Task adaptation:</strong> GPT uses input formatting with special tokens; ELMo adds learnable layer weights</li>
                <li><strong>Scalability:</strong> GPT's Transformer scales better than biLSTMs — this became decisive as model sizes grew</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> GPT-1 achieved 72.8% on GLUE (improving SoTA by 5.5 points
                average), beat previous SoTA on commonsense reasoning, and outperformed task-specific
                architectures on natural language inference. On 9 of 12 tasks evaluated, GPT-1 was the
                new state of the art — all with the same pretrained model and minimal task modifications.
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
            <h2>Masked self-attention and the generative objective</h2>

            <DefBlock label="Causal (Masked) Self-Attention">
                For a sequence of length n, the attention matrix A &#8712; &#8477;&#8319;&#215;&#8319; is masked so that
                each position can only attend to previous positions. Positions j &gt; i receive &#8722;&#8734; before softmax:
                <MathBlock tex="A_{ij} = \begin{cases} \dfrac{\mathbf{Q}_i \cdot \mathbf{K}_j}{\sqrt{d_k}} & j \leq i \\[6pt] -\infty & j > i \end{cases}" />
                After softmax, the attention weights form a lower-triangular matrix. This enforces the
                autoregressive property: the prediction for position i cannot depend on positions j &gt; i.
            </DefBlock>

            <h3>Transformer Block (Decoder)</h3>
            <p>
                Each decoder block consists of masked multi-head self-attention followed by a
                position-wise feed-forward network, with layer normalization and residual connections:
            </p>
            <MathBlock tex="\mathbf{H}^{(0)} = \mathbf{E}_{\text{token}} + \mathbf{E}_{\text{pos}}" />
            <MathBlock tex="\mathbf{A}^{(\ell)} = \text{MHA}_{\text{masked}}(\text{LN}(\mathbf{H}^{(\ell-1)})) + \mathbf{H}^{(\ell-1)}" />
            <MathBlock tex="\mathbf{H}^{(\ell)} = \text{FFN}(\text{LN}(\mathbf{A}^{(\ell)})) + \mathbf{A}^{(\ell)}" />
            <p>
                E&#95;token is the learned token embedding matrix and E&#95;pos is the learned positional
                embedding matrix. Unlike the original Transformer, GPT-1 uses pre-norm (LayerNorm before
                attention/FFN) rather than post-norm, which improves training stability.
            </p>

            <h3>Language Modeling Objective</h3>
            <p>
                The model outputs logits z&#8336; &#8712; &#8477;&#8548; for each position i. The loss is
                the cross-entropy between the predicted distribution and the true next-token:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{LM}} = -\sum_{i=1}^{n} \log \frac{\exp(z_{i,\, u_i})}{\sum_{v=1}^{V} \exp(z_{i,\, v})}" />

            <h3>Fine-Tuning with Auxiliary Loss</h3>
            <p>
                Let &#967; = (x&#185;, &#8230;, x&#7504;, y) be a labeled sequence. The fine-tuning loss
                combines the supervised task loss with the pretraining language modeling loss:
            </p>
            <MathBlock tex="\mathcal{L}(\mathcal{C}) = \mathcal{L}_{\text{task}}(y, f(x^1, \dots, x^m)) + \lambda \cdot \mathcal{L}_{\text{LM}}(x^1, \dots, x^m)" />
            <p>
                With &#955; = 0.5 in practice. The language modeling auxiliary acts as a regularizer,
                preventing the model from forgetting its pretrained knowledge during task-specific adaptation.
            </p>

            <h3>Parameter Count and Scaling</h3>
            <p>
                For a model with L layers, hidden size d, vocabulary V, context length n, and FFN dimension
                d&#95;ff = 4d:
            </p>
            <MathBlock tex="\text{Params} \approx V \cdot d + n \cdot d + L \cdot \bigl(4d^2 + 2d \cdot d_{\text{ff}}\bigr)" />
            <p>
                With V = 40,000, d = 768, d&#95;ff = 3072, L = 12, and n = 512, this gives approximately
                117 million parameters. GPT-2 scaled to d = 1600, L = 48 (1.5B); GPT-3 to d = 12288, L = 96 (175B).
            </p>

            <div className="ch-callout">
                <strong>Why decoder-only scales better:</strong> Encoder-decoder models must attend to
                the full source and target sequences. Decoder-only models have O(n&#178;) self-attention
                complexity but train with simple next-token prediction, which is trivially parallelizable
                and scales to much larger datasets. The training signal density (every token is predicted)
                is also 6&#215; higher than BERT's 15% MLM masking.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Causal Mask for Self-Attention — NumPy ────────────────────────────────────
def causal_mask(seq_len):
    """Lower-triangular mask: True = attend, False = masked out."""
    return np.tril(np.ones((seq_len, seq_len), dtype=bool))

def masked_softmax(scores, mask):
    """Apply causal mask then softmax."""
    scores = np.where(mask, scores, -1e9)
    scores -= np.max(scores, axis=-1, keepdims=True)   # numerical stability
    exp_s = np.exp(scores)
    return exp_s / np.sum(exp_s, axis=-1, keepdims=True)

def causal_attention(Q, K, V):
    """
    Q, K, V: (seq_len, d_k) — single head, no batch dim.
    Returns attended output (seq_len, d_k).
    """
    seq_len, d_k = Q.shape
    mask = causal_mask(seq_len)
    scores = (Q @ K.T) / np.sqrt(d_k)
    attn = masked_softmax(scores, mask)
    return attn @ V, attn

# ── LM Cross-Entropy Loss (simplified) ───────────────────────────────────────
def lm_loss(logits, targets):
    """
    logits : (seq_len, vocab_size)
    targets: (seq_len,) next-token ids
    """
    seq_len = len(targets)
    # Softmax + log
    logits -= np.max(logits, axis=-1, keepdims=True)
    log_probs = logits - np.log(np.sum(np.exp(logits), axis=-1, keepdims=True))
    return -np.mean(log_probs[np.arange(seq_len), targets])

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
seq_len, d_k, vocab_size = 6, 8, 40000

Q = np.random.randn(seq_len, d_k)
K = np.random.randn(seq_len, d_k)
V = np.random.randn(seq_len, d_k)

out, attn = causal_attention(Q, K, V)
mask = causal_mask(seq_len)

print("GPT-1 Causal Attention Demo")
print("=" * 45)
print(f"Input shape: Q=K=V=({seq_len}, {d_k})")
print(f"Output shape: {out.shape}")
print()
print("Causal attention mask (lower-triangular):")
print(mask.astype(int))
print()
print("Attention weight matrix (row = query, col = key):")
np.set_printoptions(precision=3, suppress=True)
print(attn)
print()

# LM loss demo
fake_logits = np.random.randn(seq_len, vocab_size)
targets = np.random.randint(0, vocab_size, seq_len)
loss = lm_loss(fake_logits, targets)
print(f"LM cross-entropy loss (random model): {loss:.4f}")
print(f"Expected (random baseline): {np.log(vocab_size):.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of causal (masked) self-attention and the language modeling cross-entropy
                loss — the two core mechanisms of GPT-1. The demo shows the lower-triangular attention mask,
                the resulting attention matrix, and how the LM loss compares to the random baseline.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt1_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT1_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
