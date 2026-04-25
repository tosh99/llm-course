import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 16 showed recurrent networks being pushed to their limits — deep stacked
                LSTMs, pointer networks for copying from input, WaveNet's dilated convolutions
                for audio generation. All shared the same bottleneck: sequential processing.
                You could not compute step t before finishing step t&#8722;1, making training on long
                sequences inherently slow. Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez,
                Kaiser, and Polosukhin published "Attention Is All You Need" in June 2017 —
                proposing that attention alone, with no recurrence and no convolution, was
                sufficient for sequence modeling. The core operation at the heart of this claim
                is scaled dot-product attention.
            </p>
            <h2>From recurrence to direct comparison</h2>
            <p>
                By 2017, LSTMs and GRUs had dominated sequence modeling for three years, but
                their sequential nature made them fundamentally slow to train. Researchers began
                asking: what if every position attended to every other position directly, without
                any intermediate hidden states?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Bahdanau et al. — Neural Machine Translation by Jointly Learning to Align and Translate</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Seq2Seq models compressed entire source sentences into a single fixed-length
                        vector before decoding. For long sentences, this bottleneck caused
                        catastrophic information loss. The model had no mechanism to "go back" and
                        check specific source words when generating each target word.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio introduced the first
                        neural attention mechanism for sequence models. At each decoding step,
                        the decoder computed a weighted sum over all encoder hidden states using
                        a learned alignment score: e<sub>ti</sub> = v<sup>T</sup>tanh(W<sub>1</sub>h<sub>i</sub> + W<sub>2</sub>s<sub>t</sub>).
                        The softmax of these scores gave attention weights &#945;<sub>ti</sub>; the
                        context vector was c<sub>t</sub> = &#8721;<sub>i</sub>&#945;<sub>ti</sub>h<sub>i</sub>.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Bahdanau attention proved that soft alignment via weighted averaging works
                        — BLEU scores improved dramatically, especially on long sentences. But
                        attention was still "bolted on" to a recurrent backbone: the RNN did the
                        heavy lifting across time; attention merely improved decoder memory access.
                        The question remained: what if attention replaced the RNN entirely?
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that soft alignment via weighted averaging works for machine translation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2016</div>
                    <div className="ch-tl-section-label">Intermediate Steps</div>
                    <div className="ch-tl-title">Luong Attention, Self-Attention, and Memory Networks</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Bahdanau's attention used a two-layer MLP to compute alignment scores,
                        which was expressive but slow. Researchers explored dot-product scoring
                        (faster, GPU-friendly) and the novel idea of applying attention to a
                        single sequence — attending to yourself to build context-aware representations.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Minh-Thang Luong et al. (2015) simplified attention to dot products:
                        e<sub>ti</sub> = h<sub>i</sub><sup>T</sup>s<sub>t</sub>, or with a learned matrix:
                        e<sub>ti</sub> = h<sub>i</sub><sup>T</sup>W<sub>a</sub>s<sub>t</sub>. Cheng et al.
                        (2016) introduced self-attention for machine reading. Memory Networks
                        (Weston 2015) used attention over an external memory bank. Each of these
                        used query-key-value terminology and dot-product scoring — the exact
                        vocabulary that the Transformer would formalize.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        These intermediate works established that dot-product attention was both
                        faster and often equally accurate compared to MLP-based scoring. They also
                        suggested that self-attention — a sequence attending to itself — could
                        build richer representations than an RNN hidden state. The Transformer
                        took this to its logical conclusion: attention is not a supplement to
                        recurrence, it is its replacement.
                    </div>
                    <div className="ch-tl-impact">Impact: Established dot-product scoring as the standard and introduced self-attention as an architectural primitive</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — Attention Is All You Need</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Could a model trained entirely with attention — no recurrence, no
                        convolution — match or beat the best RNN-based models on machine
                        translation? The theoretical argument for yes was strong (O(1) path
                        length between any two positions vs. O(n) for RNNs), but no one had
                        demonstrated it conclusively on a competitive benchmark with a full
                        training recipe.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones,
                        Aidan Gomez, Lukasz Kaiser, and Illia Polosukhin at Google Brain and
                        Google Research introduced the Transformer. The core operation: scaled
                        dot-product attention. Given learned projections Q = XW<sup>Q</sup>,
                        K = XW<sup>K</sup>, V = XW<sup>V</sup>, the attention output is:
                        Attention(Q,K,V) = softmax(QK<sup>T</sup>/&#8730;d<sub>k</sub>)V.
                        The &#8730;d<sub>k</sub> scaling was new — absent in prior dot-product attention
                        work — and proved essential for training stability at standard model sizes.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The Transformer achieved 28.4 BLEU on WMT 2014 English-to-German —
                        surpassing all previous models including ensembles — while training in
                        3.5 days on 8 P100 GPUs, faster than the RNN baselines it beat. The
                        research community reproduced the results within weeks and found that
                        Transformers scaled far better with data and compute than LSTMs.
                    </div>
                    <div className="ch-tl-impact">Impact: Replaced RNNs in NLP within 18 months; enabled GPT, BERT, and all modern LLMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – 2018</div>
                    <div className="ch-tl-section-label">Three Types of Attention</div>
                    <div className="ch-tl-title">Encoder Self-Attention, Masked Decoder Self-Attention, and Cross-Attention</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        The Transformer uses the same scaled dot-product attention formula in three
                        different configurations within a single model. Understanding how the same
                        operation serves three distinct roles required careful analysis of what
                        changes between configurations.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Encoder self-attention: Q, K, V all come from the encoder input — every
                        source token attends to every other source token, bidirectionally. Decoder
                        masked self-attention: same, but with a causal mask so position i only
                        attends to positions &#8804;i (preventing future-token leakage during training).
                        Cross-attention: Q comes from the decoder, K and V come from the encoder
                        — the decoder queries the encoder's representations.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Recognizing these three roles clarified how encoder-only models (BERT:
                        only encoder self-attention), decoder-only models (GPT: only masked
                        self-attention), and encoder-decoder models (T5: all three) are all
                        specializations of the same fundamental operation. The three-way split
                        became the organizing principle of Transformer taxonomy.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the three-way taxonomy of attention types that organizes the entire LLM landscape</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – Present</div>
                    <div className="ch-tl-section-label">Efficiency</div>
                    <div className="ch-tl-title">Flash Attention and Efficient Attention Variants</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Standard scaled dot-product attention materializes the full n&#215;n attention
                        matrix in GPU memory. For n = 16,384, this is 1 GB at float32 — the primary
                        bottleneck for long-context Transformers. GPU memory bandwidth (not FLOPS)
                        became the binding constraint.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Flash Attention (Dao et al., 2022) reordered the attention computation
                        using tiling to keep data in fast SRAM rather than slow HBM. By computing
                        the softmax incrementally and never materializing the full attention matrix,
                        Flash Attention reduced memory complexity from O(n²) to O(n) and achieved
                        2–4&#215; wall-clock speedups on standard benchmarks. Flash Attention 2 and 3
                        further optimized for modern GPU architectures.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Flash Attention made long-context training practical, directly enabling
                        models with 32k–1M token context windows. It is now the standard
                        implementation of scaled dot-product attention in PyTorch (via
                        F.scaled_dot_product_attention) and all major training frameworks.
                    </div>
                    <div className="ch-tl-impact">Impact: Made long-context training practical; now the default implementation of scaled dot-product attention</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Recurrence forces information to travel one
                step at a time — the path length between positions i and j is O(|i&#8722;j|).
                Scaled dot-product attention creates a complete graph: every token is directly
                connected to every other token in a single layer. The path length between any
                two positions is O(1), solving the long-range dependency problem structurally
                rather than with gates. This is why Transformers learn syntax, coreference, and
                world knowledge that RNNs struggled to capture.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 16 took recurrent networks as far as they could go — stacking them deeper,
                teaching them to point at inputs, generating audio one sample at a time. But they
                all had one fundamental weakness: they had to read text one word at a time, like
                a person reading with one finger on the page. The Transformer in Chapter 17 reads
                everything simultaneously — like seeing the whole page at once and immediately
                knowing which words belong together.
            </p>
            <h2>A classroom where everyone raises their hand at once</h2>

            <Analogy label="The Old Way (RNN / LSTM)">
                Imagine a game of telephone. You whisper a message to the person next to you,
                they whisper to the next, and so on. By the time the message reaches the 50th
                person, it is garbled. Worse, everyone must wait for the person before them;
                you cannot whisper to two people at the same time. The more people in the chain,
                the slower and less accurate the final message. That is what recurrence feels
                like for a computer — 500 words means 500 sequential whispers.
            </Analogy>

            <Analogy label="The New Way (Attention)">
                Now imagine a classroom where the teacher asks: "Who can help Alice understand
                math?" Every student holds up two cards: one saying how much they know about math
                (their <em>Key</em>), another saying what they'd contribute to Alice (their <em>Value</em>).
                Alice holds up a card saying what she needs (her <em>Query</em>).
                <br /><br />
                The teacher compares Alice's Query card to every student's Key card, scores them,
                and takes a weighted blend of everyone's Value cards — weighted by the scores.
                Alice now has a custom answer assembled from the most relevant students. And the
                whole room did this <em>simultaneously</em>. Every student's question was answered
                in parallel, in a single round.
            </Analogy>

            <Analogy label="Query, Key, Value — What Each Word Broadcasts">
                In the Transformer, every word in a sentence plays all three roles at once.
                The word "bank" broadcasts:
                <br /><br />
                &#8226; Its <strong>Query</strong>: "What context do I need to understand what type of bank I am?"
                <br />
                &#8226; Its <strong>Key</strong>: "Here's what I know about myself — I could be a river bank or a money bank."
                <br />
                &#8226; Its <strong>Value</strong>: "Here's the information I'll contribute if someone's Query matches my Key."
                <br /><br />
                When "river" appears nearby, its Key matches "bank's" Query well — high score.
                "River's" Value gets a large weight in the blended answer for "bank." The word
                "bank" now has a representation that incorporates its context: it knows it's a
                river bank, not a financial institution.
            </Analogy>

            <Analogy label="Why Scale by Square Root?">
                If each word is described by 64 numbers (the key dimension d<sub>k</sub> = 64),
                the dot product between a Query and a Key is a sum of 64 multiplications.
                With random vectors, this sum has a standard deviation of &#8730;64 = 8 — already
                quite large. After softmax, a score of +8 might get weight near 1.0 while
                everything else gets near 0.0: the model collapses to "only one student can speak."
                <br /><br />
                Dividing by &#8730;64 = 8 brings the scores back to a range where the softmax is
                gentle — multiple students contribute meaningfully to the answer. This is why
                the formula has &#8730;d<sub>k</sub> in the denominator.
            </Analogy>

            <Analogy label="Causal Masking — No Peeking at Future Words">
                When a language model generates text, it can only look at what has come before —
                it cannot cheat by reading ahead. During training, the model sees the whole
                sentence at once (for efficiency), but we use a "mask" to pretend it doesn't.
                <br /><br />
                The mask sets the score for any future position to negative infinity before
                the softmax, so its weight becomes exactly 0. Position 5 cannot attend to
                position 6, 7, or 8. This is how the Transformer learns to generate text
                left-to-right even though it processes all positions in parallel during training.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Query, Key, Value, and the softmax attention map</h2>

            <h3>The Search Engine Analogy</h3>
            <p>
                Think of scaled dot-product attention as a differentiable search engine. You type
                a <strong>Query</strong> (what you want). The engine compares your Query to every
                document's <strong>Key</strong> (what the document is about). It returns a weighted
                blend of the documents' <strong>Values</strong> (the actual content). In the
                Transformer, every word in a sentence plays all three roles simultaneously.
            </p>

            <h3>The Core Formula</h3>
            <p>
                Given a Query matrix Q &#8712; &#8477;<sup>n&#215;d<sub>k</sub></sup>, Key matrix K &#8712; &#8477;<sup>n&#215;d<sub>k</sub></sup>,
                and Value matrix V &#8712; &#8477;<sup>n&#215;d<sub>v</sub></sup>:
            </p>
            <MathBlock tex="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V" />
            <p>
                Each row of Q corresponds to one query token; each row of K and V corresponds
                to one key/value token. Entry (i, j) of the score matrix QK<sup>T</sup>/&#8730;d<sub>k</sub>
                measures how much token i should attend to token j.
            </p>

            <h3>Step-by-Step Computation</h3>
            <ol>
                <li>
                    <strong>Compute scores S = QK<sup>T</sup>/&#8730;d<sub>k</sub>:</strong> Entry S<sub>ij</sub>
                    measures similarity between query i and key j. Dividing by &#8730;d<sub>k</sub>
                    prevents variance from growing with dimension. S &#8712; &#8477;<sup>n&#215;n</sup>.
                </li>
                <li>
                    <strong>Apply optional mask:</strong> For causal (autoregressive) attention,
                    set S<sub>ij</sub> = &#8722;&#8734; for all j &gt; i. After softmax, these positions
                    get weight exactly 0.
                </li>
                <li>
                    <strong>Softmax row-wise:</strong> A = softmax(S), so each row A<sub>i</sub> &#8712; &#8710;<sup>n</sup>
                    (a probability distribution). A<sub>ij</sub> = "how much does query i attend to key j."
                </li>
                <li>
                    <strong>Weighted sum:</strong> O = AV. Output row i is &#8721;<sub>j</sub>A<sub>ij</sub>V<sub>j</sub> —
                    a convex combination of Value vectors weighted by attention scores.
                </li>
            </ol>

            <h3>Why Scale by &#8730;d<sub>k</sub>?</h3>
            <p>
                Assume q<sub>m</sub>, k<sub>m</sub> &#8764; i.i.d. N(0, 1). The dot product q&#183;k = &#8721;<sub>m=1</sub><sup>d<sub>k</sub></sup>q<sub>m</sub>k<sub>m</sub>
                has variance d<sub>k</sub> (sum of d<sub>k</sub> unit-variance products). With d<sub>k</sub> = 64,
                the standard deviation is 8. The softmax of numbers with std 8 is nearly
                one-hot — a single key dominates. Dividing by &#8730;d<sub>k</sub> normalizes variance
                to 1, keeping the softmax in a "soft" regime where gradients flow healthily.
            </p>

            <h3>The Three Roles of Attention in a Transformer</h3>
            <ul>
                <li><strong>Encoder self-attention:</strong> Q = K = V = encoder input. Every source position attends to every other — full bidirectional context.</li>
                <li><strong>Decoder masked self-attention:</strong> Q = K = V = decoder input, with causal mask. Position i only attends to positions &#8804; i — prevents future-leakage.</li>
                <li><strong>Cross-attention:</strong> Q = decoder state; K = V = encoder output. Decoder "looks up" information from the encoder — the translation alignment step.</li>
            </ul>

            <h3>Computational Complexity</h3>
            <p>
                QK<sup>T</sup> costs O(n<sup>2</sup>&#183;d<sub>k</sub>). The attention matrix A is n&#215;n.
                AV costs O(n<sup>2</sup>&#183;d<sub>v</sub>). Total: O(n<sup>2</sup>&#183;d). For n = 2048
                and d = 64, the attention matrix is 16M entries — 64 MB at float32. This quadratic
                memory cost is why long-context Transformers require Flash Attention, sparse attention,
                or other approximations.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why no RNN?</strong> In an RNN, the hidden state at time t is a function
                of the hidden state at t&#8722;1. In attention, the output at position i is a function
                of <em>all</em> positions in a single matrix multiplication. The entire layer can be
                computed with highly optimized linear algebra — no loops, no sequential dependency,
                O(1) sequential depth regardless of sequence length.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Variance analysis · gradient flow · complexity</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · NumPy · causal mask demo</span>
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
            <h2>Full specification, variance analysis, and complexity</h2>

            <DefBlock label="Scaled Dot-Product Attention — Formal Specification">
                Inputs: Q &#8712; &#8477;<sup>n&#215;d<sub>k</sub></sup>, K &#8712; &#8477;<sup>m&#215;d<sub>k</sub></sup>,
                V &#8712; &#8477;<sup>m&#215;d<sub>v</sub></sup>. Optional mask M &#8712; &#123;0, &#8722;&#8734;&#125;<sup>n&#215;m</sup>.
                Output: O &#8712; &#8477;<sup>n&#215;d<sub>v</sub></sup>.
                The score matrix S = QK<sup>T</sup>/&#8730;d<sub>k</sub> &#8712; &#8477;<sup>n&#215;m</sup>.
                Attention weights A = softmax(S + M, axis=&#8722;1) &#8712; [0,1]<sup>n&#215;m</sup>.
                Output O = AV.
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="S_{ij} = \frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d_k}} \in \mathbb{R}" />
            <MathBlock tex="A_{ij} = \frac{\exp(S_{ij} + M_{ij})}{\sum_{k=1}^{m} \exp(S_{ik} + M_{ik})} \in [0, 1]" />
            <MathBlock tex="\mathbf{o}_i = \sum_{j=1}^{m} A_{ij} \mathbf{v}_j \in \mathbb{R}^{d_v}" />

            <h3>Variance Analysis for the Scaling Factor</h3>
            <p>
                Let q<sub>m</sub>, k<sub>m</sub> &#8764; i.i.d. (0, 1). The dot product score:
            </p>
            <MathBlock tex="s = \mathbf{q} \cdot \mathbf{k} = \sum_{m=1}^{d_k} q_m k_m" />
            <p>
                Each term q<sub>m</sub>k<sub>m</sub> has E[q<sub>m</sub>k<sub>m</sub>] = 0 and
                Var[q<sub>m</sub>k<sub>m</sub>] = E[q<sub>m</sub><sup>2</sup>]E[k<sub>m</sub><sup>2</sup>] = 1.
                By independence: Var[s] = d<sub>k</sub>. Scaling by 1/&#8730;d<sub>k</sub> gives
                Var[s/&#8730;d<sub>k</sub>] = 1 regardless of d<sub>k</sub>. This is critical:
            </p>
            <MathBlock tex="\text{softmax}\!\left(\frac{s}{\sqrt{d_k}}\right) \text{ has gradient } A(1-A) \approx 0.25 \text{ when } A \approx 0.5" />
            <p>
                Without scaling, with d<sub>k</sub> = 64, std(s) = 8, and softmax outputs approach
                the one-hot limit: A<sub>max</sub> &#8776; 1, gradient &#8776; 0. Training stalls.
            </p>

            <h3>Causal Masking</h3>
            <p>
                For autoregressive generation, set M<sub>ij</sub> = &#8722;&#8734; for j &gt; i (upper triangle):
            </p>
            <MathBlock tex="M = \begin{pmatrix} 0 & -\infty & -\infty \\ 0 & 0 & -\infty \\ 0 & 0 & 0 \end{pmatrix}" />
            <p>
                After softmax: A<sub>ij</sub> = 0 for all j &gt; i, so o<sub>i</sub> is a function
                only of v<sub>1</sub>, …, v<sub>i</sub>. The model cannot "cheat" by accessing
                future positions. During training, the causal mask enables parallel computation
                of all positions' losses in a single forward pass — the key efficiency advantage
                over teacher-forced RNN training.
            </p>

            <h3>Gradient Flow Through Attention</h3>
            <p>
                The gradient of the output o<sub>i</sub> with respect to value v<sub>j</sub> is
                simply A<sub>ij</sub>. For queries and keys, the gradient flows through the softmax
                Jacobian:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{q}_i} = \frac{1}{\sqrt{d_k}} \sum_j \frac{\partial \mathcal{L}}{\partial A_{ij}} A_{ij}(1 - A_{ij}) \mathbf{k}_j" />
            <p>
                Crucially, this gradient is O(1) — it does not depend on sequence length n.
                Compare to RNN BPTT, where the gradient from time T back to time 1 involves
                a product of T Jacobians. Attention eliminates this T-dependent gradient path,
                which is why Transformers can be trained on sequences of length 8,192 without
                vanishing gradients.
            </p>

            <div className="ch-callout">
                <strong>Memory complexity and Flash Attention:</strong> The attention matrix A
                is n&#215;m. For self-attention n = m, so A is n&#215;n. For n = 16,384, this is 268M
                entries — 1 GB at float32. Flash Attention avoids materializing A by computing
                attention in tiles that fit in GPU SRAM, reducing memory to O(n) at the cost
                of recomputing tiles during the backward pass. This is the key innovation
                enabling 100k+ context window models.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Scaled Dot-Product Attention — NumPy ──────────────────────────────────────

def softmax(x: np.ndarray, axis: int = -1) -> np.ndarray:
    """Numerically stable softmax."""
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)


def scaled_dot_product_attention(
    Q: np.ndarray,
    K: np.ndarray,
    V: np.ndarray,
    mask: np.ndarray | None = None
):
    """
    Q : (n, d_k)
    K : (m, d_k)   — m = n for self-attention
    V : (m, d_v)
    mask : (n, m) optional — additive mask (0 or -inf)
    Returns: output (n, d_v), attention_weights (n, m)
    """
    d_k = Q.shape[1]
    scores = Q @ K.T / np.sqrt(d_k)          # (n, m)
    if mask is not None:
        scores = scores + mask                 # -inf positions become 0 after softmax
    attn   = softmax(scores, axis=-1)         # (n, m)
    output = attn @ V                          # (n, d_v)
    return output, attn


def make_causal_mask(n: int) -> np.ndarray:
    """Returns (n, n) causal mask: 0 on lower triangle, -inf on upper triangle."""
    mask = np.triu(np.full((n, n), -np.inf), k=1)
    return mask


# ── Demo ──────────────────────────────────────────────────────────────────────
rng = np.random.default_rng(42)
n, d_k, d_v = 6, 8, 8

# Self-attention: Q = K = V = same sequence
X = rng.normal(0, 1.0, (n, d_k))
# In practice, Q/K/V are computed by linear projections:
# Q = X @ W_Q, K = X @ W_K, V = X @ W_V
# Here we use X directly for clarity.
Q = K = X
V = rng.normal(0, 1.0, (n, d_v))

print("Scaled Dot-Product Attention Demo")
print("=" * 50)
print(f"Sequence length n : {n}")
print(f"Key dimension d_k : {d_k}")
print(f"Value dimension d_v: {d_v}")
print(f"Scaling factor    : 1/sqrt({d_k}) = {1/np.sqrt(d_k):.4f}")
print()

# Full (bidirectional) attention
out_full, attn_full = scaled_dot_product_attention(Q, K, V)
print("Bidirectional attention weights (first 4x4):")
print(np.round(attn_full[:4, :4], 3))
print(f"Row sums: {attn_full.sum(axis=-1).round(4)}")
print()

# Causal (masked) attention
mask = make_causal_mask(n)
out_causal, attn_causal = scaled_dot_product_attention(Q, K, V, mask=mask)
print("Causal (masked) attention weights:")
print(np.round(attn_causal, 3))
print()

# Verify output shape
print(f"Output shape (full):   {out_full.shape}")
print(f"Output shape (causal): {out_causal.shape}")
print()

# Demonstrate effect of scaling
scores_unscaled = Q @ K.T
scores_scaled   = Q @ K.T / np.sqrt(d_k)
print(f"Score std (unscaled): {scores_unscaled.std():.3f}")
print(f"Score std (scaled)  : {scores_scaled.std():.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of scaled dot-product attention with optional causal masking.
                The demo verifies that attention weights sum to 1, shows the causal masking
                pattern, and demonstrates the effect of the &#8730;d<sub>k</sub> scaling factor
                on score variance.
            </p>
            <CodeBlock code={PY_CODE} filename="attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SCALED_DOT_PRODUCT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
