import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>One head is never enough</h2>
            <p>
                The original Bahdanau attention used a single scalar score for each
                encoder-decoder pair. But human attention is not one-dimensional: when reading
                a sentence, you simultaneously track syntax, semantics, coreference, and
                sentiment — different types of relationships require different "lenses." Multi-head
                attention was designed to let the Transformer learn multiple such lenses in parallel,
                without increasing computational cost.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014 – 2016</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Single-Score Attention in RNNs</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Bahdanau and Luong attention computed a single relevance score per
                        source-target pair. This single score had to simultaneously capture
                        alignment (which source word am I translating?), meaning (which source
                        word is semantically relevant?), and syntax (which source word governs
                        this position grammatically?). A single weighted average cannot decompose
                        these different aspects of relevance.
                        <div className="ch-tl-section-label">What was introduced</div>
                        The single-score attention frameworks of Bahdanau (additive) and Luong
                        (dot-product) demonstrated that one scalar per pair was sufficient for
                        strong translation results. But researchers noticed systematic failure
                        modes: the model would "forget" long-distance syntactic dependencies
                        while handling nearby semantic ones, suggesting that one attention
                        distribution was insufficient to capture all relevant linguistic structure.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Single-head attention established the baseline and the vocabulary:
                        query, key, value, attention weight. It proved the mechanism works.
                        The limitation — one distribution trying to capture all structure — was
                        clear, and the fix was obvious in retrospect: run multiple attention
                        distributions in parallel, one per "relationship type."
                    </div>
                    <div className="ch-tl-impact">Impact: Established attention as a mechanism; demonstrated the one-head bottleneck</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — Multi-Head Attention</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Could you run multiple independent attention computations and combine
                        them without multiplying the parameter count? The naive approach — h
                        independent full-dimension attention layers — would cost h times as much
                        compute and parameters. A smarter factorization was needed.
                        <div className="ch-tl-section-label">What was introduced</div>
                        The Transformer paper introduced multi-head attention: split the
                        d<sub>model</sub>-dimensional representation into h subspaces of dimension
                        d<sub>k</sub> = d<sub>model</sub>/h each. Each head performs scaled
                        dot-product attention independently in its subspace, then the outputs
                        are concatenated and projected back with W<sup>O</sup>. The total
                        parameter count is identical to a single attention layer with dimension
                        d<sub>model</sub> — h heads attend in parallel for free by slicing
                        the representation.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Multi-head attention enabled the model to jointly attend to information
                        from different positions and different representation subspaces simultaneously.
                        The original paper used h = 8 heads with d<sub>model</sub> = 512, giving
                        d<sub>k</sub> = 64 per head. Empirically, 8 heads consistently outperformed
                        1, 2, or 4 heads with the same parameter budget on translation, demonstrating
                        that representational diversity — not just capacity — is essential.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled the model to jointly attend to multiple types of relationships without increasing computational cost</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">Voita et al. — Analyzing Multi-Head Self-Attention: Specialized Heads and Head Pruning</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Do different attention heads actually learn different things, or do they
                        all learn roughly the same patterns? If most heads are redundant, one
                        could prune them to reduce inference cost without accuracy loss. The
                        question required both interpretability analysis and a pruning methodology.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Elena Voita and colleagues at the University of Edinburgh classified
                        attention heads into functional roles through extensive probing. They found
                        that heads consistently specialized: "positional heads" attended to adjacent
                        tokens (syntactic dependency tracking); "syntactic heads" attended to
                        dependency-linked tokens regardless of distance; "rare-word heads" attended
                        to rare or surprising tokens. They then pruned heads one at a time using
                        an L0 regularization approach, finding that 38 of 48 heads in a base model
                        could be removed with less than 0.15 BLEU degradation.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Head specialization validated the original motivation for multi-head
                        attention: different heads do learn qualitatively different structural
                        relationships. Head pruning opened the field of Transformer compression
                        through attention pruning — a technique now used in production LLMs to
                        reduce inference cost. It also showed that the "diversity" of multi-head
                        attention comes at modest cost — most heads can be removed, but the few
                        specialized ones are critical.
                    </div>
                    <div className="ch-tl-impact">Impact: Empirically validated head specialization; launched the field of attention-based Transformer compression</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Memory Efficiency</div>
                    <div className="ch-tl-title">Multi-Query Attention — Shazeer</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        During autoregressive inference, the KV cache — storing past K and V
                        matrices for all heads at all past positions — grows as O(n&#183;h&#183;d<sub>k</sub>).
                        For a 70B parameter model with h = 64 heads and sequence length n = 32,768,
                        the KV cache alone requires gigabytes of GPU memory per batch, severely
                        limiting inference throughput.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Noam Shazeer proposed Multi-Query Attention (MQA): all h query heads attend
                        to a single shared set of K and V projections — reducing the KV cache by
                        h&#215;. Quality degraded slightly compared to full multi-head, but inference
                        throughput improved dramatically. Grouped-Query Attention (GQA, Ainslie et al.
                        2023) is a middle ground: G groups of h/G heads each share one KV projection.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        GQA with G = 8 groups (used in LLaMA 2 70B) reduced the KV cache size 8&#215;
                        with less than 0.1% accuracy loss. GQA is now the standard in production
                        LLMs: LLaMA 2/3, Mistral 7B, Falcon, and Gemini all use variants of GQA
                        or MQA. Understanding MQA requires understanding why the full multi-head
                        KV cache is the bottleneck — and that requires understanding multi-head attention.
                    </div>
                    <div className="ch-tl-impact">Impact: MQA and GQA are now standard in production LLMs; reduced KV cache by 8–64&#215; enabling practical long-context inference</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – Present</div>
                    <div className="ch-tl-section-label">Scale</div>
                    <div className="ch-tl-title">Scaling Laws for Attention Heads</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        As Transformers scaled from millions to billions of parameters, how should
                        the number of attention heads scale? Should h grow with d<sub>model</sub>,
                        or should d<sub>k</sub> be held constant while h grows?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Empirically, successful large models settled on keeping d<sub>k</sub>
                        roughly constant at 64–128 while scaling h with d<sub>model</sub>:
                        GPT-3 uses h = 96 heads with d<sub>k</sub> = 128; LLaMA 7B uses h = 32
                        heads with d<sub>k</sub> = 128; Falcon 40B uses h = 64. This pattern
                        suggests that the number of distinct "relationship detectors" needed
                        scales with model capacity, not with the per-head representational
                        dimension.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The practical heuristic "keep d<sub>k</sub> around 64–128" guides
                        architecture decisions for new model families. It also motivated the
                        theoretical investigation of whether attention heads are interchangeable
                        (answer: no — specialized heads emerge at any scale) and how many distinct
                        types of linguistic relationships a given model learns (scales with depth,
                        not head count).
                    </div>
                    <div className="ch-tl-impact">Impact: Established practical scaling heuristics for head count in large Transformers</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> A single attention distribution is a
                bottleneck. By splitting the model's representational space into h subspaces
                and attending independently in each, the model learns diverse relational
                features — syntax, semantics, position, coreference — without increasing the
                asymptotic compute cost. The h cancels: multi-head attention costs the same
                as single-head attention at the same d<sub>model</sub>.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Asking the same question through different lenses</h2>

            <Analogy label="One Friend Group (Single-Head Attention)">
                Imagine you need advice on three things at once: what to wear to a job interview,
                what to order for dinner, and how to solve a tricky math problem. If you ask a
                single group of friends, they have to juggle all three topics simultaneously.
                The fashion expert tries to answer the math question. The foodie gives clothing
                advice. Everyone's advice gets muddled because no one can focus on their
                specialty.
            </Analogy>

            <Analogy label="Multiple Expert Groups (Multi-Head Attention)">
                Now imagine you split into three separate group chats. Group A is exclusively
                with fashion experts. Group B is with foodies. Group C is with mathematicians.
                Each group gives you sharp, focused advice on exactly their topic.
                <br /><br />
                Multi-head attention does exactly this. It takes the model's "brain" and splits
                it into h parallel groups. Each group learns to pay attention to a different
                kind of relationship between words. Head 1 might specialize in grammar: "this
                verb and this subject are linked." Head 2 might specialize in meaning: "this
                pronoun refers to that noun three sentences ago." Head 3 might track position:
                "this word is always attended to by the next word." Each head focuses on what
                it learned to find most useful.
            </Analogy>

            <Analogy label="The Same Cost — Slicing the Budget">
                Here's the beautiful efficiency trick: you don't need a bigger budget to have
                8 expert groups. Instead of each person having 512 numbers to describe themselves,
                you give each of the 8 groups 64 numbers (512 ÷ 8 = 64). Each group works in
                a 64-dimensional space instead of the full 512.
                <br /><br />
                At the end, you collect the 64-number answers from all 8 groups and concatenate
                them back into a 512-number answer (8 &#215; 64 = 512). The total size is the same;
                you've just organized the computation into 8 specialized subspaces instead of
                one general one.
            </Analogy>

            <Analogy label="The W_O Projection — Synthesizing the Groups">
                After collecting all 8 groups' answers into a 512-number concatenated vector,
                you still need one more step: synthesizing. The 8 groups gave you advice in
                8 different "languages" (different coordinate systems). The W<sup>O</sup>
                matrix — a learned 512&#215;512 projection — learns how to translate and mix all
                8 groups' contributions into one coherent final answer.
                <br /><br />
                It's the difference between just stacking advice papers on your desk (concatenating)
                and actually reading them and writing a single integrated plan (multiplying by W<sup>O</sup>).
            </Analogy>

            <Analogy label="What Each Head Actually Learns">
                Researchers have probed what different heads in trained Transformers actually do.
                The results are striking:
                <br /><br />
                Some heads are "positional" — they always attend to the token immediately before
                or after, tracking local word order. Some heads are "syntactic" — they link verbs
                to their subjects even when they're far apart. Some heads track coreference —
                linking "she" back to "Marie" mentioned two sentences earlier. A few heads attend
                to rare or unusual words, giving them extra weight.
                <br /><br />
                And crucially: most heads can be removed from a trained model with almost no
                quality loss. Only a handful of heads are truly critical — and those are the
                specialized ones that do unique jobs no other head does.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Parallel attention in learned subspaces</h2>

            <h3>Motivation: Why One Head Is Insufficient</h3>
            <p>
                A single attention head computes one weighted average of Values. But language
                encodes multiple simultaneous relationships: a pronoun must attend to its antecedent,
                a verb to its subject, an adjective to its noun — all within the same sentence
                and often within the same layer. A single attention distribution must either
                pick one relationship type or compromise between them, losing precision for all.
                Multi-head attention gives the model h separate "channels" to learn different
                relationships without increasing parameter count.
            </p>

            <h3>Projection into Subspaces</h3>
            <p>
                For each head i (i = 1, …, h), learn separate linear projections of the input X:
            </p>
            <MathBlock tex="Q_i = XW_i^{Q} \in \mathbb{R}^{n \times d_k}, \quad K_i = XW_i^{K} \in \mathbb{R}^{n \times d_k}, \quad V_i = XW_i^{V} \in \mathbb{R}^{n \times d_v}" />
            <p>
                where W<sub>i</sub><sup>Q</sup>, W<sub>i</sub><sup>K</sup> &#8712; &#8477;<sup>d<sub>model</sub>&#215;d<sub>k</sub></sup>
                and W<sub>i</sub><sup>V</sup> &#8712; &#8477;<sup>d<sub>model</sub>&#215;d<sub>v</sub></sup>.
                The projected dimensions satisfy d<sub>k</sub> = d<sub>v</sub> = d<sub>model</sub>/h.
            </p>

            <h3>Per-Head Scaled Dot-Product Attention</h3>
            <p>
                Each head runs scaled dot-product attention independently in its subspace:
            </p>
            <MathBlock tex="\text{head}_i = \text{softmax}\!\left(\frac{Q_i K_i^{\top}}{\sqrt{d_k}}\right)V_i \in \mathbb{R}^{n \times d_v}" />
            <p>
                The h heads produce h independent output matrices, each n&#215;d<sub>v</sub>.
            </p>

            <h3>Concatenation and Output Projection</h3>
            <p>
                Concatenate the h head outputs along the feature dimension, then project back
                to d<sub>model</sub> using a learned output matrix W<sup>O</sup>:
            </p>
            <MathBlock tex="\text{MultiHead}(Q, K, V) = \bigl[\text{head}_1 \;\|\; \cdots \;\|\; \text{head}_h\bigr] W^{O}" />
            <p>
                where W<sup>O</sup> &#8712; &#8477;<sup>(h&#183;d<sub>v</sub>) &#215; d<sub>model</sub></sup>
                = &#8477;<sup>d<sub>model</sub> &#215; d<sub>model</sub></sup> (since h&#183;d<sub>v</sub> = d<sub>model</sub>).
            </p>

            <h3>Dimension Budget: Multi-Head Costs the Same as Single-Head</h3>
            <p>
                With h = 8 heads and d<sub>model</sub> = 512: d<sub>k</sub> = d<sub>v</sub> = 64.
                Total parameters:
            </p>
            <MathBlock tex="\underbrace{h \cdot d_{\text{model}} \cdot d_k \cdot 3}_{\text{W}_Q, W_K, W_V \text{ for all heads}} + \underbrace{d_{\text{model}}^2}_{W^O} = 3d_{\text{model}}^2 + d_{\text{model}}^2 = 4d_{\text{model}}^2" />
            <p>
                This is identical to a single attention layer with Q, K, V projections of size
                d<sub>model</sub> &#215; d<sub>model</sub> plus an output projection. Multi-head
                attention increases <em>representational diversity</em>, not capacity.
            </p>

            <h3>Multi-Query and Grouped-Query Attention (MQA / GQA)</h3>
            <p>
                During inference, the KV cache stores K and V for all past positions and all
                h heads. For h = 32, n = 32,768, d<sub>v</sub> = 128: cache size = 2&#183;32&#183;32768&#183;128 &#215; 2 bytes
                &#8776; 500 MB per layer. Multi-Query Attention (MQA) uses one shared K and V for
                all h query heads — reducing cache by h&#215;. Grouped-Query Attention (GQA) is
                a middle ground with G groups:
            </p>
            <MathBlock tex="\text{GQA cache size} = \frac{1}{G} \text{ of MHA cache size}" />
            <p>
                LLaMA 2 70B uses G = 8 groups; the GQA cache is 8&#215; smaller than full MHA
                with &lt;0.1% quality loss on standard benchmarks.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Head specialization in practice:</strong> Voita et al. (2019) showed that
                in a trained Transformer, different heads consistently specialize. Some attend
                broadly to the next or previous token (local syntax). Others attend to specific
                semantic relationships such as subject-verb agreement or coreference. A few attend
                to fixed positions regardless of content, acting as positional bias. And most
                (38 of 48 in their study) can be pruned without significant quality loss —
                only the specialized ones are truly critical.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Parameter count · complexity · GQA derivation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · NumPy with explicit head reshaping</span>
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
            <h2>Full multi-head specification and parameter analysis</h2>

            <DefBlock label="Multi-Head Attention — Formal Specification">
                Input: X &#8712; &#8477;<sup>n&#215;d<sub>model</sub></sup>. Number of heads: h.
                Dimensions per head: d<sub>k</sub> = d<sub>v</sub> = d<sub>model</sub> / h.
                Weight matrices: W<sup>Q</sup><sub>i</sub>, W<sup>K</sup><sub>i</sub> &#8712; &#8477;<sup>d<sub>model</sub>&#215;d<sub>k</sub></sup>;
                W<sup>V</sup><sub>i</sub> &#8712; &#8477;<sup>d<sub>model</sub>&#215;d<sub>v</sub></sup> for i = 1..h.
                Output projection: W<sup>O</sup> &#8712; &#8477;<sup>h&#183;d<sub>v</sub>&#215;d<sub>model</sub></sup>.
                Total parameter count: 4d<sub>model</sub><sup>2</sup>.
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="Q_i = XW_i^{Q},\quad K_i = XW_i^{K},\quad V_i = XW_i^{V} \quad \text{for } i = 1,\dots,h" />
            <MathBlock tex="\text{head}_i = \text{softmax}\!\left(\frac{Q_i K_i^{\top}}{\sqrt{d_k}}\right)V_i \in \mathbb{R}^{n \times d_v}" />
            <MathBlock tex="\text{MultiHead}(X) = \bigl[\text{head}_1 \;|\; \cdots \;|\; \text{head}_h\bigr] W^{O} \in \mathbb{R}^{n \times d_{\text{model}}}" />

            <h3>Parameter Count Derivation</h3>
            <p>
                Each head contributes 3 projection matrices of size d<sub>model</sub> &#215; d<sub>k</sub>:
            </p>
            <MathBlock tex="\text{Params per head} = 3 \cdot d_{\text{model}} \cdot d_k = 3 \cdot d_{\text{model}} \cdot \frac{d_{\text{model}}}{h} = \frac{3 d_{\text{model}}^2}{h}" />
            <p>
                Across h heads, plus W<sup>O</sup> of size d<sub>model</sub> &#215; d<sub>model</sub>:
            </p>
            <MathBlock tex="\text{Total params} = h \cdot \frac{3 d_{\text{model}}^2}{h} + d_{\text{model}}^2 = 3d_{\text{model}}^2 + d_{\text{model}}^2 = 4 d_{\text{model}}^2" />
            <p>
                For d<sub>model</sub> = 512: 4 &#215; 512<sup>2</sup> = 1,048,576 parameters. This is
                identical to a single full-dimension attention layer with no heads.
            </p>

            <h3>Computational Complexity</h3>
            <p>
                Each head computes attention on a sequence of length n with dimension d<sub>k</sub>.
                The cost per head is O(n<sup>2</sup>d<sub>k</sub>). With h heads:
            </p>
            <MathBlock tex="\text{Total cost} = h \cdot O(n^2 d_k) = h \cdot O\!\left(\frac{n^2 d_{\text{model}}}{h}\right) = O(n^2 d_{\text{model}})" />
            <p>
                The h cancels. Multi-head attention has the same asymptotic complexity as
                single-head attention with full dimension d<sub>model</sub>. In practice, the
                h parallel heads can be computed as a single batched matrix multiplication
                using tensor reshaping — no sequential dependency between heads.
            </p>

            <h3>Why Concatenate Rather Than Sum?</h3>
            <p>
                If we summed head outputs instead of concatenating:
                &#8721;<sub>i</sub>head<sub>i</sub>W<sub>i</sub><sup>O</sup> — this would allow
                heads to destructively interfere. Each head would need to coordinate its output
                with all others to avoid cancellation, preventing specialization. Concatenation
                places each head's contribution in distinct dimensions, allowing W<sup>O</sup>
                to learn to trust different heads for different tasks independently.
            </p>

            <h3>GQA Parameter Reduction</h3>
            <p>
                In Grouped-Query Attention with G groups (G &lt; h), each group of h/G query
                heads shares one K and V projection of size d<sub>model</sub> &#215; d<sub>k</sub>:
            </p>
            <MathBlock tex="\text{GQA KV params} = 2 \cdot G \cdot d_{\text{model}} \cdot d_k = \frac{2Gd_{\text{model}}^2}{h}" />
            <p>
                For G = h (full MHA): 2d<sub>model</sub><sup>2</sup> (standard).
                For G = 1 (MQA): 2d<sub>model</sub><sup>2</sup>/h — h&#215; reduction.
                KV cache at inference scales identically, giving the same h/G&#215; memory reduction.
            </p>

            <div className="ch-callout">
                <strong>Why concatenate and not add?</strong> Concatenation preserves the
                information from each head in distinct dimensions. The output projection W<sup>O</sup>
                learns to mix these dimensions, effectively learning how much to trust head 1's
                syntactic analysis vs. head 3's coreference tracking for each output position.
                If heads were summed, they would interfere, preventing specialization.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Multi-Head Attention — NumPy ──────────────────────────────────────────────

def softmax(x: np.ndarray, axis: int = -1) -> np.ndarray:
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)

def scaled_dot_product_attention(
    Q: np.ndarray, K: np.ndarray, V: np.ndarray
) -> np.ndarray:
    d_k = Q.shape[-1]
    scores = Q @ K.swapaxes(-2, -1) / np.sqrt(d_k)   # (..., n, n)
    attn   = softmax(scores, axis=-1)
    return attn @ V                                    # (..., n, d_v)


class MultiHeadAttention:
    """
    Multi-head self-attention implemented as a single batched matrix multiply
    followed by explicit head reshaping — exactly as PyTorch does internally.
    """
    def __init__(self, d_model: int, num_heads: int, seed: int = 42):
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        rng = np.random.default_rng(seed)
        scale = np.sqrt(2.0 / (d_model + d_model))   # Glorot

        self.h  = num_heads
        self.dk = d_model // num_heads
        self.d  = d_model

        # Single fused projection for Q, K, V (more GPU-efficient)
        self.W_q = rng.normal(0, scale, (d_model, d_model))
        self.W_k = rng.normal(0, scale, (d_model, d_model))
        self.W_v = rng.normal(0, scale, (d_model, d_model))
        self.W_o = rng.normal(0, scale, (d_model, d_model))

    def forward(self, X: np.ndarray) -> np.ndarray:
        """
        X: (n, d_model)
        Returns: (n, d_model)
        """
        n = X.shape[0]

        # Project to Q, K, V: (n, d_model) each
        Q = X @ self.W_q
        K = X @ self.W_k
        V = X @ self.W_v

        # Reshape to (h, n, d_k) — one slice per head
        Q = Q.reshape(n, self.h, self.dk).transpose(1, 0, 2)  # (h, n, dk)
        K = K.reshape(n, self.h, self.dk).transpose(1, 0, 2)
        V = V.reshape(n, self.h, self.dk).transpose(1, 0, 2)

        # Batched attention: (h, n, dk) -> (h, n, dk)
        heads = scaled_dot_product_attention(Q, K, V)

        # Concatenate heads: (h, n, dk) -> (n, h*dk) = (n, d_model)
        concat = heads.transpose(1, 0, 2).reshape(n, self.d)

        # Output projection
        return concat @ self.W_o


# ── Head specialization demo ──────────────────────────────────────────────────
def head_diversity(mha: MultiHeadAttention, X: np.ndarray):
    """Compute pairwise cosine similarity between heads' weight matrices."""
    heads_W = mha.W_q.reshape(mha.d, mha.h, mha.dk).transpose(1, 0, 2)  # (h, d, dk)
    heads_flat = heads_W.reshape(mha.h, -1)
    norms = np.linalg.norm(heads_flat, axis=1, keepdims=True)
    sim = (heads_flat @ heads_flat.T) / (norms @ norms.T)
    return sim


# ── Demo ──────────────────────────────────────────────────────────────────────
n, d_model, num_heads = 12, 64, 8
rng = np.random.default_rng(7)
X = rng.normal(0, 0.5, (n, d_model))

mha = MultiHeadAttention(d_model, num_heads)
out = mha.forward(X)

total_params = sum(w.size for w in [mha.W_q, mha.W_k, mha.W_v, mha.W_o])

print("Multi-Head Attention Demo")
print("=" * 50)
print(f"Sequence length : {n}")
print(f"Model dim       : {d_model}")
print(f"Heads           : {num_heads}")
print(f"Dim per head    : {mha.dk}")
print(f"Output shape    : {out.shape}")
print(f"Total params    : {total_params:,}  (= 4 x {d_model}^2 = {4*d_model**2:,})")
print()

sim = head_diversity(mha, X)
avg_off_diag = (sim.sum() - sim.trace()) / (num_heads * (num_heads - 1))
print(f"Head W_Q diversity (avg pairwise cosine sim): {avg_off_diag:.4f}")
print("(Lower = more diverse; random init produces near-0 similarity)")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of multi-head self-attention with explicit reshaping
                into per-head tensors using a single batched GEMM (the GPU-efficient approach).
                Demonstrates the parameter count identity (4d<sub>model</sub>&#178;) and a simple
                head diversity measure.
            </p>
            <CodeBlock code={PY_CODE} filename="multi_head_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MULTI_HEAD_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
