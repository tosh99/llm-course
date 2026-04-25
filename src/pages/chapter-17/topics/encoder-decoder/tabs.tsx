import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The stack that launched the modern era</h2>
            <p>
                The Transformer is not a single innovation but an architectural stack: an encoder
                that reads and understands, a decoder that generates, and a set of engineering
                decisions — residual connections, layer normalization, feedforward sublayers,
                and dropout — that make it reliably trainable at depth. Every major language
                model since 2018 is a specialization or extension of this stack.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986 – 2014</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Encoder-Decoder RNNs for Sequence Transduction</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Sequence-to-sequence tasks — machine translation, summarization, question
                        answering — required mapping variable-length inputs to variable-length
                        outputs. RNN-based encoder-decoders (Sutskever 2014, Bahdanau 2015)
                        worked but had two fundamental limitations: sequential training O(T)
                        per example, and difficulty maintaining context over long sequences
                        even with LSTM gating.
                        <div className="ch-tl-section-label">What was introduced</div>
                        The standard RNN encoder-decoder: an LSTM encoder reads the source
                        sequence and produces a sequence of hidden states; an LSTM decoder
                        generates the target sequence, attending (after Bahdanau 2014) to all
                        encoder states. Adding attention improved quality dramatically but
                        preserved the O(T) sequential bottleneck — the encoder could be trained
                        in parallel batches, but within each sequence, steps were strictly
                        sequential.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The RNN encoder-decoder established the encoder-decoder paradigm for
                        sequence transduction — a paradigm the Transformer preserved while
                        eliminating its sequential bottleneck. Understanding why the Transformer
                        keeps the encoder-decoder split requires understanding what each half
                        contributes: the encoder builds a rich, bidirectional representation
                        of the source; the decoder generates autoregressively using that
                        representation.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the encoder-decoder paradigm; set the benchmark the Transformer had to beat</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — The Full Transformer Architecture</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Could a model built entirely from attention — no recurrence — match
                        the best LSTM-based systems on WMT 2014 English-German, a competitive
                        machine translation benchmark where 4-layer LSTM ensembles with attention
                        were the state of the art? And could it train faster?
                        <div className="ch-tl-section-label">What was introduced</div>
                        The Transformer: N = 6 encoder layers, each with multi-head self-attention
                        + FFN, each wrapped in residual + LayerNorm. N = 6 decoder layers, each
                        with masked self-attention + cross-attention + FFN, each wrapped in
                        residual + LayerNorm. d<sub>model</sub> = 512, h = 8 attention heads,
                        d<sub>ff</sub> = 2048, d<sub>k</sub> = d<sub>v</sub> = 64. Dropout p = 0.1.
                        Label smoothing &#949; = 0.1. Warmup steps 4000 with square-root learning rate schedule.
                        Total parameters: ~65M (Base) or ~213M (Big).
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The Transformer Base achieved 27.3 BLEU on WMT 2014 EN-DE, surpassing
                        all prior single models. The Transformer Big achieved 28.4 BLEU,
                        surpassing all prior ensembles. Training took 3.5 days on 8 P100 GPUs —
                        faster than the 4-layer LSTM baselines it beat. Every architectural
                        decision was ablated: removing any one component (residual connections,
                        LayerNorm, multi-head, FFN sublayers) degraded quality significantly.
                    </div>
                    <div className="ch-tl-impact">Impact: Beat all prior translation systems; established the exact architectural recipe that all subsequent models follow</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Fork</div>
                    <div className="ch-tl-title">GPT (Decoder-Only) and BERT (Encoder-Only)</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        The full encoder-decoder Transformer was designed for conditional
                        generation (translation: source &#8594; target). But the research community
                        quickly recognized that each half could be used independently for
                        different tasks: the encoder half for understanding (classification,
                        NER, QA), the decoder half for generation (language modeling, summarization).
                        <div className="ch-tl-section-label">What was introduced</div>
                        OpenAI's GPT (June 2018): decoder-only Transformer trained on
                        language modeling with causal attention. 12 layers, d = 768, h = 12,
                        BooksCorpus 800M words. Google's BERT (October 2018): encoder-only
                        Transformer trained with masked language modeling (MLM) and next-sentence
                        prediction. 12 or 24 layers, d = 768/1024, h = 12/16, Wikipedia +
                        BooksCorpus 3.3B words. BERT's bidirectional context proved transformative
                        for understanding tasks; GPT's left-to-right generation proved transformative
                        for generative tasks.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        GPT and BERT established the two dominant paradigms of large-scale
                        pre-training. BERT set state-of-the-art on 11 NLP benchmarks simultaneously.
                        GPT proved that left-to-right language modeling could generalize with
                        few-shot prompting. Their divergence — encoder-only vs. decoder-only —
                        defined the primary taxonomy of LLMs that persists to this day.
                    </div>
                    <div className="ch-tl-impact">Impact: Established encoder-only (BERT) and decoder-only (GPT) as the two primary Transformer specializations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020</div>
                    <div className="ch-tl-section-label">Third Branch</div>
                    <div className="ch-tl-title">T5 — Encoder-Decoder at Scale</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        BERT excelled at classification but struggled at generation. GPT excelled
                        at generation but lacked bidirectional context. Could the full
                        encoder-decoder design outperform both on a unified text-to-text
                        framework where every NLP task is a generation task?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Google's T5 (Raffel et al., 2020) trained an encoder-decoder Transformer
                        on a cleaned version of Common Crawl (C4, 745 GB), framing every NLP
                        task as "Text-to-Text": translation, classification, QA, and summarization
                        all became "read input, generate output" tasks. T5's architecture was
                        identical to the original Transformer but with T5 relative position bias,
                        pre-norm, and GeGLU activations. Sizes ranged from 60M to 11B parameters.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        T5 demonstrated that encoder-decoder models could be competitive with
                        encoder-only models on understanding tasks and outperform them on
                        generation tasks. The "text-to-text" framing unified disparate NLP
                        tasks under one training objective. T5's descendants (T5-v1.1, mT5,
                        Flan-T5, UL2) remain state-of-the-art for many generation and reasoning
                        tasks, demonstrating that the full encoder-decoder design has not
                        been made obsolete by decoder-only LLMs.
                    </div>
                    <div className="ch-tl-impact">Impact: Established encoder-decoder as the third major Transformer variant; demonstrated text-to-text transfer learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2024</div>
                    <div className="ch-tl-section-label">Scale</div>
                    <div className="ch-tl-title">GPT-3, LLaMA, and the Dominance of Decoder-Only</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        As compute budgets grew to allow training on trillions of tokens,
                        which Transformer variant — encoder-only, decoder-only, or encoder-decoder —
                        scaled most effectively? And could decoder-only models achieve
                        understanding tasks without an explicit encoder?
                        <div className="ch-tl-section-label">What was introduced</div>
                        GPT-3 (175B parameters, 2020) demonstrated that decoder-only Transformers
                        could achieve few-shot performance on classification, reasoning, and
                        code generation without any task-specific fine-tuning — purely through
                        in-context learning. LLaMA (Meta, 2023) democratized 7B–65B decoder-only
                        models with open weights. Mixtral, Mistral, Gemma, Phi, and dozens of
                        other decoder-only models followed, establishing decoder-only as the
                        dominant production architecture.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        At trillion-token scale, decoder-only models with instruction tuning
                        (RLHF, DPO) achieved capabilities that made explicit encoders unnecessary
                        for most tasks. The architectural simplicity of decoder-only (one stack
                        instead of two, one type of attention instead of three) proved advantageous
                        as scale increased. As of 2024, GPT-4, Claude, Gemini, and LLaMA 3 are
                        all believed to be decoder-only or decoder-dominant architectures.
                    </div>
                    <div className="ch-tl-impact">Impact: Established decoder-only Transformers as the dominant architecture for generative LLMs at scale</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> The Transformer's parallel attention architecture
                made one thing newly possible: training on truly enormous text corpora at a
                reasonable wall-clock time. When sequence processing is parallel rather than
                sequential, more data requires more GPUs but not more calendar time. This
                unlocked pre-training on all of Wikipedia and billions of web pages. Chapter 18
                follows 2018 — when ULMFiT, ELMo, and GPT-1 independently demonstrated that
                large-scale pre-training followed by task-specific fine-tuning was the new
                paradigm for NLP, achieving state-of-the-art on nearly every benchmark and
                displacing all hand-engineered feature pipelines.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A reading team and a writing team</h2>

            <Analogy label="The Reading Team (Encoder)">
                Imagine a team of six readers sitting in a room with a book. Each reader reads
                the entire book, but they focus on different things. Reader 1 looks for characters.
                Reader 2 looks for places. Reader 3 looks for feelings. Reader 4 looks for
                cause-and-effect. After one round of reading, they all share notes — and each
                reader updates their understanding based on what everyone else found.
                <br /><br />
                After six rounds of reading, sharing, and updating, they have a deep, layered
                understanding of the book — every character's relationship to every other
                character, every event's connection to every other event. This is the encoder:
                six layers of self-attention that build an increasingly rich representation
                of the input.
            </Analogy>

            <Analogy label="The Writing Team (Decoder)">
                Now imagine a separate team of six writers in another room. Their job is to
                write a new version of the book in a different language, one word at a time.
                Each writer can see everything the reading team produced.
                <br /><br />
                But the writers have a strict rule: when choosing word 5, they can only look
                at words 1 through 4 they've already written. They cannot peek at word 6. This
                forces them to write one step at a time, in order — just like a person speaks
                one word at a time without knowing the future. This constraint is enforced by
                the causal mask: future positions are blocked.
            </Analogy>

            <Analogy label="The Messengers (Cross-Attention)">
                Between the two rooms are messengers. At every step, each writer sends a
                question to the reading team: "What does the original say about this person
                right here?" The readers answer based on their deep understanding of the source.
                <br /><br />
                This back-and-forth is called cross-attention. The writer's Query goes to the
                reading room; the readers' Keys and Values come back as the answer. Without
                cross-attention, the writers would have to guess the entire translation from
                memory — there would be no way to check facts against the original.
            </Analogy>

            <Analogy label="The Residual Highway — Why Layers Don't Break">
                Here's a problem: after six rounds of updating, information can get distorted.
                Each layer transforms the representation, and after six transformations, the
                original signal might be unrecognizable.
                <br /><br />
                The fix: residual connections. Each layer's output is added to its input —
                the new representation is "what we learned" plus "what we started with." This
                creates a highway that carries the original signal alongside the learned updates.
                Even if one layer learns something wrong, the other layers can "correct" it
                through the residual path. Without residual connections, training a 6-layer
                Transformer would be nearly impossible.
            </Analogy>

            <Analogy label="What comes next — Learning to read before learning the subject">
                The Transformer showed how to process language in parallel — reading all words
                simultaneously, writing all words simultaneously (during training). The next
                insight: instead of training from scratch for every new task, train once on
                all of Wikipedia and billions of web pages, then specialize for each task.
                Chapter 18 shows how ULMFiT, ELMo, and GPT-1 proved this worked, dramatically
                outperforming task-specific models trained from scratch on every benchmark
                they touched.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Encoder stack, decoder stack, and the masked autoregressive trick</h2>

            <h3>Encoder Stack</h3>
            <p>
                The encoder consists of N = 6 identical layers. Each layer has two sub-layers:
            </p>
            <ol>
                <li><strong>Multi-head self-attention (unmasked):</strong> Every source position
                attends to every other source position. This is bidirectional — the encoder
                sees the full context in both directions, building rich contextual representations.</li>
                <li><strong>Position-wise feed-forward network (FFN):</strong> Applied independently
                to each position — a 2-layer MLP with hidden dimension d<sub>ff</sub> = 2048.
                Processes attended representations into a richer feature space.</li>
            </ol>
            <p>
                Each sub-layer is wrapped in a residual connection followed by layer normalization:
            </p>
            <MathBlock tex="\mathbf{x} \leftarrow \text{LayerNorm}(\mathbf{x} + \text{Sublayer}(\mathbf{x}))" />

            <h3>Decoder Stack</h3>
            <p>
                The decoder consists of N = 6 identical layers, each with three sub-layers:
            </p>
            <ol>
                <li><strong>Masked multi-head self-attention:</strong> Identical to encoder
                self-attention but with a causal mask — position i can only attend to positions
                &#8804; i. Future positions are set to &#8722;&#8734; before softmax, producing weight 0.</li>
                <li><strong>Encoder-decoder cross-attention:</strong> Query comes from the decoder;
                Key and Value come from the encoder's final output. This lets the decoder look
                up source information at each generation step.</li>
                <li><strong>Position-wise FFN:</strong> Same as encoder FFN.</li>
            </ol>

            <h3>Feed-Forward Sublayer</h3>
            <p>
                The FFN is applied identically at each position with a two-layer MLP that
                expands to d<sub>ff</sub> = 2048 and contracts back to d<sub>model</sub> = 512:
            </p>
            <MathBlock tex="\text{FFN}(\mathbf{x}) = \max(0,\, \mathbf{x}\mathbf{W}_1 + \mathbf{b}_1)\,\mathbf{W}_2 + \mathbf{b}_2" />
            <p>
                The inner dimension d<sub>ff</sub> = 4&#215;d<sub>model</sub> provides additional
                capacity beyond the attention sublayer. Modern variants replace ReLU with GeLU,
                SwiGLU (LLaMA), or GeGLU (T5-v1.1) for improved performance at scale.
            </p>

            <h3>Layer Normalization</h3>
            <p>
                LayerNorm normalizes each position's representation independently:
            </p>
            <MathBlock tex="\text{LayerNorm}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \varepsilon}} + \beta" />
            <p>
                &#956; and &#963;<sup>2</sup> are the mean and variance of x computed across the feature
                dimension. &#947; and &#946; are learned per-feature scale and shift. The original
                Transformer used Post-Norm (LayerNorm after the residual addition). Modern
                implementations use Pre-Norm: LayerNorm applied before the sublayer, inside
                the residual branch: x + Sublayer(LayerNorm(x)). Pre-Norm trains more stably
                at depth and is used in GPT-3, LLaMA, and all major open models.
            </p>

            <h3>Encoder-Only, Decoder-Only, and Full Architectures</h3>
            <ul>
                <li><strong>Encoder-only (BERT, RoBERTa):</strong> No causal mask — bidirectional
                self-attention. Trained with masked language modeling. Ideal for understanding
                tasks: classification, NER, QA (as span extraction).</li>
                <li><strong>Decoder-only (GPT, LLaMA, Mistral):</strong> Causal mask throughout —
                left-to-right attention only. Trained with language modeling. Ideal for
                generation: text completion, instruction following, reasoning.</li>
                <li><strong>Encoder-decoder (T5, BART):</strong> Full architecture. Encoder processes
                source with bidirectional attention; decoder generates target with causal
                self-attention + cross-attention. Ideal for transduction: translation, summarization.</li>
            </ul>

            <h3>Why Causal Masking Enables Parallel Training</h3>
            <p>
                During training, the decoder sees the full target sequence simultaneously.
                The causal mask enforces that loss at position t uses only tokens 1..t&#8722;1.
                This means all T positions' losses can be computed in a single forward pass —
                unlike teacher-forced RNN training, which required a sequential loop. At
                inference, the model generates token by token, so the mask is trivially satisfied.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Residual connections are critical for depth:</strong> Without them, a
                6-layer Transformer would be nearly impossible to train. The residual path
                creates a direct gradient highway from output layer back to input embedding.
                Layer normalization stabilizes the distribution of activations across layers.
                Together, they allow training stacks of 100+ layers — something impossible for
                plain feedforward or recurrent networks of comparable depth.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Full stack equations · parameter accounting · pre-norm vs. post-norm</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Transformer encoder layer · NumPy · pre-norm</span>
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
            <h2>Full stack equations, parameter accounting, and pre/post-norm analysis</h2>

            <DefBlock label="Transformer Encoder Layer — Formal Specification">
                Input: X &#8712; &#8477;<sup>n&#215;d</sup>. Sub-layer 1: MHA with unmasked attention.
                Sub-layer 2: FFN(x) = max(0, xW<sub>1</sub> + b<sub>1</sub>)W<sub>2</sub> + b<sub>2</sub>.
                Post-Norm: A = LayerNorm(X + MHA(X)), O = LayerNorm(A + FFN(A)).
                Pre-Norm: A = X + MHA(LayerNorm(X)), O = A + FFN(LayerNorm(A)).
            </DefBlock>

            <h3>Encoder Layer (Post-Norm)</h3>
            <MathBlock tex="\mathbf{A} = \text{LayerNorm}\!\left(\mathbf{X} + \text{MultiHead}(\mathbf{X}, \mathbf{X}, \mathbf{X})\right)" />
            <MathBlock tex="\mathbf{O} = \text{LayerNorm}\!\left(\mathbf{A} + \text{FFN}(\mathbf{A})\right)" />

            <h3>Decoder Layer (Post-Norm)</h3>
            <MathBlock tex="\mathbf{B} = \text{LayerNorm}\!\left(\mathbf{X} + \text{MaskedMHA}(\mathbf{X}, \mathbf{X}, \mathbf{X})\right)" />
            <MathBlock tex="\mathbf{C} = \text{LayerNorm}\!\left(\mathbf{B} + \text{MHA}(\mathbf{B}, \mathbf{E}, \mathbf{E})\right)" />
            <MathBlock tex="\mathbf{O} = \text{LayerNorm}\!\left(\mathbf{C} + \text{FFN}(\mathbf{C})\right)" />
            <p>
                where E &#8712; &#8477;<sup>m&#215;d</sup> is the encoder output used as Keys and Values in
                cross-attention. Q comes from the decoder state B.
            </p>

            <h3>Pre-Norm vs. Post-Norm</h3>
            <p>
                The original paper uses Post-Norm (normalize after residual addition). Modern
                LLMs use Pre-Norm (normalize before the sublayer, inside the residual branch):
            </p>
            <MathBlock tex="\text{Pre-Norm: } \mathbf{O} = \mathbf{X} + \text{Sublayer}(\text{LayerNorm}(\mathbf{X}))" />
            <p>
                Pre-Norm advantages at depth: the gradient flows through the residual path
                without passing through LayerNorm. At initialization, Sublayer(LayerNorm(X)) &#8776; 0,
                so the output &#8776; X — identity initialization. This makes the loss well-behaved
                from step 1, enabling training of 96-layer models (GPT-3) without instability.
                Post-Norm requires warm-up learning rates and careful initialization to avoid
                gradient explosion in early training.
            </p>

            <h3>Parameter Count (Base Transformer)</h3>
            <p>
                Configuration: d<sub>model</sub> = 512, d<sub>ff</sub> = 2048, h = 8, N = 6
                encoder + 6 decoder layers. Shared embedding/softmax weights of size
                V&#215;512 (not included in layer count).
            </p>
            <ul>
                <li>Per encoder layer: 4d<sup>2</sup> (MHA) + 2d&#183;d<sub>ff</sub> + 2&#183;2d (LayerNorm &#947;,&#946;) &#8776; 4&#183;262k + 2&#183;1048k &#8776; 3.15M</li>
                <li>Per decoder layer: 8d<sup>2</sup> (2 MHA) + 2d&#183;d<sub>ff</sub> &#8776; 6.3M (two attention sub-layers)</li>
                <li>6 encoder + 6 decoder layers: 6&#183;3.15M + 6&#183;6.3M &#8776; 56M (sub-layer params only)</li>
            </ul>
            <MathBlock tex="\text{Total (Base)} \approx 65\text{M params}, \quad \text{Total (Big: } d=1024, d_{ff}=4096\text{)} \approx 213\text{M params}" />

            <h3>FFN Variants</h3>
            <p>
                Modern models replace ReLU with more expressive activations:
            </p>
            <MathBlock tex="\text{SwiGLU: } \text{FFN}(x) = \bigl(\text{SiLU}(xW_1) \odot xW_2\bigr) W_3" />
            <p>
                SwiGLU (LLaMA, PaLM) adds a third weight matrix and a gating term, but reduces
                d<sub>ff</sub> to (8/3)&#183;d to keep parameter count constant. Empirically,
                SwiGLU outperforms ReLU FFN by 1–2 points on language modeling perplexity at
                the same parameter count.
            </p>

            <div className="ch-callout">
                <strong>Pre-Norm vs. Post-Norm — the practical difference:</strong> Pre-Norm
                makes training stable from step 1 by ensuring each layer is approximately an
                identity function at initialization. Post-Norm requires the model to learn
                to use the residual connections rather than defaulting to them, which can
                cause early training instability. GPT-3, LLaMA, Mistral, and most modern
                open models use Pre-Norm; the original BERT used Post-Norm with careful learning
                rate warm-up to compensate.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Transformer Encoder Layer — NumPy (Pre-Norm) ──────────────────────────────

def softmax(x: np.ndarray, axis: int = -1) -> np.ndarray:
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)

def layer_norm(x: np.ndarray, gamma: np.ndarray, beta: np.ndarray,
               eps: float = 1e-6) -> np.ndarray:
    """Layer norm over the last dimension."""
    mean = x.mean(axis=-1, keepdims=True)
    var  = x.var(axis=-1, keepdims=True)
    return gamma * (x - mean) / np.sqrt(var + eps) + beta

def gelu(x: np.ndarray) -> np.ndarray:
    """Approximate GeLU: used in BERT, GPT."""
    return 0.5 * x * (1.0 + np.tanh(np.sqrt(2.0 / np.pi) * (x + 0.044715 * x**3)))


class TransformerEncoderLayer:
    """
    Pre-norm Transformer encoder layer.
    Sub-layers: multi-head self-attention + FFN.
    Wrapped in residual connections: x = x + Sublayer(LayerNorm(x)).
    """

    def __init__(self, d_model: int, num_heads: int, d_ff: int, seed: int = 42):
        assert d_model % num_heads == 0
        rng = np.random.default_rng(seed)
        scale = np.sqrt(2.0 / (d_model + d_model))

        self.h  = num_heads
        self.dk = d_model // num_heads
        self.d  = d_model

        # Multi-head attention projections (fused Q/K/V)
        self.W_q = rng.normal(0, scale, (d_model, d_model))
        self.W_k = rng.normal(0, scale, (d_model, d_model))
        self.W_v = rng.normal(0, scale, (d_model, d_model))
        self.W_o = rng.normal(0, scale, (d_model, d_model))

        # Layer norm 1 (before attention)
        self.ln1_g = np.ones(d_model)
        self.ln1_b = np.zeros(d_model)

        # FFN: expand to d_ff, contract back
        self.W1 = rng.normal(0, scale, (d_model, d_ff))
        self.b1 = np.zeros(d_ff)
        self.W2 = rng.normal(0, scale, (d_ff, d_model))
        self.b2 = np.zeros(d_model)

        # Layer norm 2 (before FFN)
        self.ln2_g = np.ones(d_model)
        self.ln2_b = np.zeros(d_model)

    def _mha(self, X: np.ndarray) -> np.ndarray:
        """Multi-head self-attention: (n, d) -> (n, d)"""
        n = X.shape[0]
        Q = X @ self.W_q
        K = X @ self.W_k
        V = X @ self.W_v

        # Reshape: (n, d) -> (h, n, dk)
        Q = Q.reshape(n, self.h, self.dk).transpose(1, 0, 2)
        K = K.reshape(n, self.h, self.dk).transpose(1, 0, 2)
        V = V.reshape(n, self.h, self.dk).transpose(1, 0, 2)

        # Per-head attention
        scores = Q @ K.swapaxes(-2, -1) / np.sqrt(self.dk)  # (h, n, n)
        attn   = softmax(scores, axis=-1)
        heads  = attn @ V                                     # (h, n, dk)

        # Concat and project
        concat = heads.transpose(1, 0, 2).reshape(n, self.d)
        return concat @ self.W_o

    def _ffn(self, X: np.ndarray) -> np.ndarray:
        """Position-wise FFN with GeLU: (n, d) -> (n, d)"""
        return gelu(X @ self.W1 + self.b1) @ self.W2 + self.b2

    def forward(self, X: np.ndarray) -> np.ndarray:
        """Pre-norm forward pass: (n, d) -> (n, d)"""
        # Sub-layer 1: Multi-head self-attention
        X = X + self._mha(layer_norm(X, self.ln1_g, self.ln1_b))
        # Sub-layer 2: Feed-forward network
        X = X + self._ffn(layer_norm(X, self.ln2_g, self.ln2_b))
        return X


# ── Stack of 6 encoder layers ─────────────────────────────────────────────────
class TransformerEncoder:
    def __init__(self, d_model: int, num_heads: int, d_ff: int,
                 n_layers: int = 6, seed: int = 42):
        self.layers = [
            TransformerEncoderLayer(d_model, num_heads, d_ff, seed + l)
            for l in range(n_layers)
        ]

    def forward(self, X: np.ndarray) -> np.ndarray:
        for layer in self.layers:
            X = layer.forward(X)
        return X


# ── Demo ──────────────────────────────────────────────────────────────────────
n, d_model, num_heads, d_ff, n_layers = 8, 64, 8, 256, 6
rng = np.random.default_rng(42)
X   = rng.normal(0, 0.5, (n, d_model))

encoder = TransformerEncoder(d_model, num_heads, d_ff, n_layers)
out     = encoder.forward(X)

print("Transformer Encoder Stack Demo (Pre-Norm)")
print("=" * 50)
print(f"Input shape     : {X.shape}")
print(f"Output shape    : {out.shape}")
print(f"Layers          : {n_layers}")
print(f"Heads           : {num_heads}")
print(f"d_model / d_ff  : {d_model} / {d_ff}")
print()

# Parameter count
params_per_layer = 4 * d_model**2 + 2 * d_model * d_ff + 2 * d_model
print(f"Params per layer: {params_per_layer:,}")
print(f"Total params    : {n_layers * params_per_layer:,}  (excl. embeddings)")
print()

print("Per-position L2 norms (input vs. output):")
for i in range(min(4, n)):
    print(f"  pos {i}: in={np.linalg.norm(X[i]):.3f}  out={np.linalg.norm(out[i]):.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a pre-norm Transformer encoder layer and a 6-layer
                encoder stack. Includes multi-head self-attention, GeLU feedforward, and
                layer normalization. The demo computes parameter counts and verifies that
                output shape matches input shape (residual connections preserve dimensionality).
            </p>
            <CodeBlock code={PY_CODE} filename="transformer_layer.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ENCODER_DECODER_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
