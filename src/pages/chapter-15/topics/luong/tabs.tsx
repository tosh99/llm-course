import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Simpler, faster, and just as good</h2>
            <p>
                Bahdanau attention was transformative, but it used a relatively complex scoring function and applied attention at the input to the decoder RNN. In 2015, Minh-Thang Luong, Hieu Pham, and Christopher Manning at Stanford took a systematic look at attention design choices and found that several simplifications either matched or improved on the original. Their paper established the global and local attention distinction that still appears in modern efficient attention literature.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 Aug</div>
                    <div className="ch-tl-section-label">Systematic refinement</div>
                    <div className="ch-tl-title">Luong, Pham &amp; Manning — "Effective Approaches to Attention"</div>
                    <div className="ch-tl-body">
                        <p>
                            "Effective Approaches to Attention-based Neural Machine Translation" (EMNLP 2015) was explicitly designed as a systematic comparison of attention design choices, not as a proposal of one specific model. The authors identified two key architectural variables to study: where to plug in the attention mechanism (before or after the decoder RNN step) and what scoring function to use. They compared these choices rigorously on WMT14 English-German and English-French.
                        </p>
                        <p>
                            The first key contribution was a cleaner architectural ordering. In Bahdanau's model, the context vector c<sub>t</sub> is computed before the decoder RNN step and fed as an input to the RNN cell at step t. In Luong's model, the decoder RNN runs first at step t — producing hidden state h<sub>t</sub> from just the previous state and embedding — and then attention is computed using h<sub>t</sub> to produce the context vector. Finally, h<sub>t</sub> and the context are combined to produce the "attentional" hidden state h̃<sub>t</sub> from which the output is generated. This "attention after RNN" design was found to be cleaner and easier to implement at scale.
                        </p>
                        <p>
                            The second key contribution was the input-feeding approach: feed h̃<sub>t</sub> (not h<sub>t</sub>) as the input to the next decoder step. This means the previous attention decision influences the current RNN computation — the decoder is aware of its previous alignment choices when making the current one. This creates a form of attention continuity across decoding steps, helping the model maintain consistent alignments (e.g., not attending to the same source word twice when the translation has moved past it).
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Established cleaner attention architecture (attention after RNN); introduced input-feeding for alignment continuity; systematic scoring comparison</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Global attention</div>
                    <div className="ch-tl-title">Three Scoring Functions — Dot, General, Concat</div>
                    <div className="ch-tl-body">
                        <p>
                            Under the global attention framework (attend to all source positions at every decoder step), Luong et al. compared three scoring functions: dot (h<sub>t</sub><sup>T</sup>h̄<sub>s</sub>), general (h<sub>t</sub><sup>T</sup>W<sub>a</sub>h̄<sub>s</sub>), and concat (essentially Bahdanau's additive scoring). The dot and general functions required no additional MLP, just a matrix multiplication — far cheaper to compute than the tanh-based additive function.
                        </p>
                        <p>
                            The empirical results were surprising: dot and general scoring functions consistently outperformed concat across both language pairs and both small and large models. The simpler parameterizations worked better, possibly because the additive scoring's tanh saturation created optimization challenges, or because the reduced parameter count of dot and general acted as beneficial regularization. The concat (additive) function required more parameters and was harder to optimize at scale.
                        </p>
                        <p>
                            The paper also carefully analyzed the attention weights produced by each scoring function. Dot and general attention produced sharper, more consistent alignment patterns — the attention concentrated on specific source positions rather than diffusing evenly. This sharper alignment correlated with better translation quality, suggesting that the model was making cleaner alignment decisions with the simpler scoring functions.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Dot and general scoring outperformed additive empirically; reduced attention overhead; these functions remain standard in non-Transformer MT</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Local attention</div>
                    <div className="ch-tl-title">Local-m and Local-p — Monotonic and Predicted Windows</div>
                    <div className="ch-tl-body">
                        <p>
                            For language pairs with roughly monotonic alignment (like English-German in many regions), attending to all T<sub>x</sub> source positions at every decoder step is wasteful. If the decoder is at target position t, the relevant source position is almost certainly near position t (adjusted for average length ratio). Luong et al. proposed two variants of local attention that restrict the window of attended positions.
                        </p>
                        <p>
                            Local-m (monotonic) is the simplest: attend to source positions in the window [t−D, t+D] for a fixed window size D. This is fast and effective for monotonic language pairs but too rigid for pairs with significant reordering. Local-p (predicted) is more adaptive: a small feedforward network predicts an alignment position p<sub>t</sub> from the current decoder state h<sub>t</sub>, then applies Gaussian-weighted attention around p<sub>t</sub> within [p<sub>t</sub>−D, p<sub>t</sub>+D]. The Gaussian weighting gives higher attention to positions near p<sub>t</sub> and lower attention to positions at the window boundary.
                        </p>
                        <p>
                            Local-p attention was particularly effective on longer sentences where global attention's O(T<sub>x</sub>) cost became expensive and where much of the attention was wasted on clearly irrelevant source positions. For T<sub>x</sub> = 50 with D = 5, local-p computes 11 instead of 50 scores — a 4.5× reduction. On long English-German sentences (30+ words), local-p produced higher BLEU than global attention with less computation. This prefigured the local attention windows used in Longformer and BigBird for handling long documents.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Local-p attention introduced predicted windows that reduce computation by 4–5× for long sentences; conceptually related to modern efficient attention mechanisms</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 – 2017</div>
                    <div className="ch-tl-section-label">Legacy in production</div>
                    <div className="ch-tl-title">Luong Attention in Production Systems</div>
                    <div className="ch-tl-body">
                        <p>
                            Luong's global attention with general (bilinear) scoring became the default attention mechanism in most production MT systems of 2016–2017. Google's GNMT system (Wu et al., 2016) used an attention mechanism closely based on Luong's formulation. OpenNMT, the widely-used open-source neural MT toolkit, implemented Luong attention as its default. The simplicity and effectiveness of the dot/general scoring functions made them the practical choice for systems that needed to translate at scale.
                        </p>
                        <p>
                            The input-feeding approach from Luong's paper proved particularly valuable in production: by feeding h̃<sub>t</sub> back to the next decoder step, the model maintained contextual continuity across decoding steps. Without input-feeding, the decoder's attention at each step was independent, potentially leading to inconsistent alignments (attending to the same source word multiple times, or skipping important source words). With input-feeding, the model could implicitly track its alignment progress across the sequence.
                        </p>
                        <p>
                            When the Transformer (Vaswani et al., 2017) replaced LSTM encoder-decoders, it used scaled dot-product attention — a direct descendant of Luong's dot scoring with the addition of the √d<sub>k</sub> scaling factor. The Transformer's multi-head attention can be understood as running 8–16 independent global Luong dot-product attention heads simultaneously, each looking at a different aspect of the source. Luong's global attention was, in this sense, one head of what would become multi-head self-attention.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Luong attention was the standard in GNMT, OpenNMT, and production MT 2016–2017; its dot scoring directly influenced Transformer's scaled dot-product attention</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present</div>
                    <div className="ch-tl-section-label">Modern descendants</div>
                    <div className="ch-tl-title">Local Attention Windows in Long-Context Transformers</div>
                    <div className="ch-tl-body">
                        <p>
                            Luong's local-p attention anticipated a problem that would become central as Transformers scaled to handle long documents: quadratic attention cost. The O(n²) complexity of full self-attention becomes intractable for sequences of tens of thousands of tokens (genomic sequences, long documents, audio). The solution — restrict each position to attend to a local window — was exactly what Luong proposed for MT in 2015.
                        </p>
                        <p>
                            Longformer (Beltagy et al., 2020) implemented a combination of local window attention (each token attends to its w nearest neighbors) and global attention (certain "global" tokens like [CLS] attend to all positions). BigBird (Zaheer et al., 2020) added random attention to the local + global pattern, providing theoretical guarantees for full expressiveness. Both systems demonstrated that local attention with a small number of global tokens is computationally equivalent to full attention in terms of what can be expressed, while reducing complexity from O(n²) to O(n · w).
                        </p>
                        <p>
                            The ideas Luong introduced for MT in 2015 — a predicted alignment position, a Gaussian window, attending only to a local neighborhood — have evolved into a rich literature on efficient attention for long sequences. The fundamental insight is unchanged: not every source position is relevant to every decoding step, and restricting attention to the relevant window is both more efficient and sometimes more accurate.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Luong's local attention directly influenced Longformer, BigBird, and modern efficient attention for long-context LLMs</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Architectural difference from Bahdanau:</strong> In Bahdanau's model,
                context c<sub>t</sub> is an input to the decoder RNN cell at step t. In Luong's
                model, the decoder RNN runs first (h<sub>t</sub> = RNN(h<sub>t-1</sub>, y<sub>t-1</sub>)),
                then attention is computed, and the context is combined <em>after</em> the RNN step
                to form h̃<sub>t</sub>. The output is produced from h̃<sub>t</sub>, not h<sub>t</sub>.
                This means the attention acts as a "post-processing" step rather than an input —
                a subtle but architecturally important difference that affects gradient flow.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Two ways to look — everywhere or just nearby</h2>

            <Analogy label="Global vs Local Attention">
                Imagine you're reading a sentence in French and writing the translation word by
                word. Global attention says: for each word you write, look at every single French
                word and decide how relevant each one is. That's thorough, but for a 50-word
                sentence, you check 50 relevance scores for each output word — even when you
                know the French word you need is probably near the same position as your output.
                <br /><br />
                Local attention says: first predict roughly where in the French sentence the
                relevant word probably is, then only look at a small window of about 5–10 words
                around that position. Faster, and often just as accurate — because you're not
                wasting computation on positions you know are irrelevant.
            </Analogy>

            <Analogy label="Luong vs Bahdanau — Order of Operations">
                Bahdanau does attention <em>before</em> the decoder step: "First decide what
                to look at, then generate the next word." Luong does it <em>after</em>:
                "First take a step with the decoder, then look back at the source to refine
                the output."
                <br /><br />
                Think of it like writing an essay. Bahdanau: check your notes before writing
                each sentence. Luong: write the sentence first using your current memory, then
                check your notes to polish it. Both work; they just differ in when the attention
                happens relative to the generation step.
            </Analogy>

            <Analogy label="Input Feeding — Remembering What You Just Looked At">
                Luong introduced one more trick: after each decoder step, feed the "attentional
                hidden state" h̃<sub>t</sub> (which includes what you just attended to) back as
                the input to the next step.
                <br /><br />
                Why? Imagine translating without remembering what you just looked at. You might
                look at the same French word twice, or skip an important one. By feeding the
                attention result back, the decoder knows what it just focused on and can
                move its attention forward appropriately. It's like keeping a bookmark in the
                source text as you translate.
            </Analogy>

            <Analogy label="The Predicted Window (Local-p)">
                Local-p attention is like a smart spotlight. Instead of turning on all 50 bulbs
                in a row (global attention) or always illuminating the same fixed window (local-m),
                it first asks: "Based on where I am in the translation right now, where is the
                corresponding position in the source text likely to be?"
                <br /><br />
                A small network predicts this position p<sub>t</sub>, then the spotlight shines
                brightest at p<sub>t</sub> and fades toward the edges of the window — like a
                Gaussian bell curve centered at the predicted position. This is smart, adaptive,
                and efficient.
            </Analogy>

            <Analogy label="Dot Product Scoring — Why Simpler Won">
                Luong found that the simpler dot-product scoring often works better than Bahdanau's
                more complex MLP scoring. Why would simpler be better?
                <br /><br />
                Part of it is optimization: simpler functions have fewer parameters to go wrong
                during training. Part of it is that the dot product has a clear geometric meaning
                (vectors pointing in the same direction are similar), which aligns well with what
                attention needs to compute. And part of it is that when your model has enough
                capacity elsewhere (deep LSTM layers, large embeddings), the attention scoring
                function doesn't need to be the source of expressiveness — it just needs to
                rank positions correctly.
            </Analogy>

            <Analogy label="Connection to the Transformer">
                Luong's dot-product attention (h<sub>t</sub><sup>T</sup>h̄<sub>s</sub>) is
                almost exactly the Transformer's scaled dot-product attention
                (q<sup>T</sup>k / √d<sub>k</sub>). The only difference: the Transformer divides
                by √d<sub>k</sub> to prevent softmax from saturating at high dimensions,
                and it uses learned projections Q, K, V instead of using the raw hidden states.
                <br /><br />
                Luong's paper in 2015 was the direct precursor. The Transformer took his dot
                scoring, added the scaling and projection, and applied it in a self-attention
                setting (where encoder and decoder are the same). The result was the architecture
                that powers every modern language model.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Global attention, local-p attention, and the attentional hidden state</h2>

            <h3>Global Attention — Step by Step</h3>
            <p>
                At decoder step t, the decoder RNN produces h<sub>t</sub> first (Luong runs
                the RNN before attention, opposite to Bahdanau):
            </p>
            <MathBlock tex="\mathbf{h}_t = \text{RNN}\!\left(\mathbf{h}_{t-1},\; \mathbf{e}(y_{t-1})\right)" />
            <p>
                Compute alignment scores using one of three scoring functions:
            </p>
            <MathBlock tex="\text{score}(\mathbf{h}_t, \bar{\mathbf{h}}_s) = \begin{cases} \mathbf{h}_t^\top \bar{\mathbf{h}}_s & \text{dot} \\ \mathbf{h}_t^\top \mathbf{W}_a \bar{\mathbf{h}}_s & \text{general} \\ \mathbf{v}_a^\top \tanh\!\left(\mathbf{W}_a[\mathbf{h}_t;\bar{\mathbf{h}}_s]\right) & \text{concat} \end{cases}" />
            <p>
                Attention weights, context vector, and attentional hidden state:
            </p>
            <MathBlock tex="\boldsymbol{\alpha}_t = \text{softmax}\!\left(\text{score}(\mathbf{h}_t, \bar{\mathbf{H}})\right)" />
            <MathBlock tex="\mathbf{c}_t = \bar{\mathbf{H}}^\top \boldsymbol{\alpha}_t" />
            <MathBlock tex="\tilde{\mathbf{h}}_t = \tanh\!\left(\mathbf{W}_c\, [\mathbf{c}_t;\, \mathbf{h}_t]\right)" />
            <p>
                Output: P(y<sub>t</sub>) = softmax(W<sub>s</sub> h̃<sub>t</sub>). Input-feeding:
                h̃<sub>t</sub> is fed as the input to the next decoder step, not h<sub>t</sub>.
            </p>

            <h3>Local-p Attention — Predicted Window</h3>
            <p>
                Predict an alignment position p<sub>t</sub> ∈ [0, T<sub>x</sub>] from h<sub>t</sub>:
            </p>
            <MathBlock tex="p_t = T_x \cdot \text{sigmoid}\!\left(\mathbf{v}_p^\top \tanh\!\left(\mathbf{W}_p\, \mathbf{h}_t\right)\right)" />
            <p>
                Apply Gaussian-weighted attention around p<sub>t</sub> within window [p<sub>t</sub>−D, p<sub>t</sub>+D]:
            </p>
            <MathBlock tex="\alpha_{ts} = \text{align}(\mathbf{h}_t, \bar{\mathbf{h}}_s) \cdot \exp\!\left(-\frac{(s - p_t)^2}{2\sigma^2}\right), \quad \sigma = D/2" />

            <h3>Bahdanau vs Luong — Architectural Comparison</h3>
            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Bahdanau</th>
                        <th>Luong</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Attention timing</td>
                        <td>Before RNN step</td>
                        <td>After RNN step</td>
                    </tr>
                    <tr>
                        <td>Decoder input</td>
                        <td>h<sub>t</sub> computed from [y<sub>t-1</sub>; c<sub>t</sub>]</td>
                        <td>h<sub>t</sub> computed from y<sub>t-1</sub> only</td>
                    </tr>
                    <tr>
                        <td>Scoring function</td>
                        <td>Additive (MLP)</td>
                        <td>Dot, general, or concat</td>
                    </tr>
                    <tr>
                        <td>Output layer input</td>
                        <td>s<sub>t</sub></td>
                        <td>h̃<sub>t</sub> = tanh(W<sub>c</sub>[c<sub>t</sub>; h<sub>t</sub>])</td>
                    </tr>
                    <tr>
                        <td>Input feeding</td>
                        <td>No</td>
                        <td>Yes (h̃<sub>t</sub> fed back)</td>
                    </tr>
                    <tr>
                        <td>Window attention</td>
                        <td>No</td>
                        <td>Yes (local-m and local-p)</td>
                    </tr>
                </tbody>
            </table>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why input-feeding matters:</strong> Without input-feeding, each decoder step's
                attention decision is made without knowledge of previous attention decisions. The decoder
                might attend to the same source word twice or skip important source words. With
                input-feeding, h̃<sub>t</sub> carries information about what position was attended to
                at step t, allowing the decoder to implicitly track alignment progress and maintain
                monotonic or near-monotonic alignment across the sequence.
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
            <h2>Architecture comparison and local attention derivation</h2>

            <DefBlock label="Luong Global Attention — Formal Specification">
                Encoder states: H̄ ∈ ℝ<sup>T<sub>x</sub>×n</sup>.
                Decoder state: h<sub>t</sub> ∈ ℝ<sup>n</sup> (after RNN step, before attention).
                Score matrix W<sub>a</sub> ∈ ℝ<sup>n×n</sup> (for general scoring).
                Output projection W<sub>c</sub> ∈ ℝ<sup>n×2n</sup>, W<sub>s</sub> ∈ ℝ<sup>V×n</sup>.
            </DefBlock>

            <h3>Gradient Flow — Luong vs Bahdanau</h3>
            <p>
                In Bahdanau, the context c<sub>t</sub> flows into the RNN cell, so gradients
                pass through the recurrence. In Luong, c<sub>t</sub> enters only after the
                RNN step at the output layer via the projection W<sub>c</sub>. The gradient
                path to h<sub>j</sub> (encoder state) does not pass through the recurrent computation:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \bar{\mathbf{h}}_j} = \sum_t \alpha_{tj} \cdot \frac{\partial \mathcal{L}}{\partial \mathbf{c}_t}" />
            <p>
                This is a <em>shorter</em> gradient path from the loss to the encoder, which can
                speed up training and reduce gradient decay through the decoder depth.
            </p>

            <h3>Local-p — Differentiability of p<sub>t</sub></h3>
            <p>
                The alignment position p<sub>t</sub> is computed as a differentiable sigmoid:
            </p>
            <MathBlock tex="\frac{\partial p_t}{\partial \mathbf{h}_t} = T_x \cdot \sigma'(\cdot) \cdot \mathbf{v}_p^\top \bigl(\mathbf{I} - \tanh^2(\mathbf{W}_p \mathbf{h}_t)\bigr) \mathbf{W}_p" />
            <p>
                The Gaussian weight g<sub>ts</sub> = exp(−(s−p<sub>t</sub>)<sup>2</sup>/2σ<sup>2</sup>)
                introduces a gradient on p<sub>t</sub>: positions near p<sub>t</sub> get higher
                weight, so the model is incentivized to predict p<sub>t</sub> close to the true
                alignment — an implicit alignment supervision signal.
            </p>

            <h3>Computational Complexity</h3>
            <MathBlock tex="\text{Global:}\quad O(T_x) \text{ scores per step}" />
            <MathBlock tex="\text{Local-}p:\quad O(2D+1) \text{ scores per step, }D \ll T_x" />
            <p>
                For T<sub>x</sub> = 50 and D = 5, local-p computes 11 instead of 50 scores —
                a 4.5× reduction in attention computation.
            </p>

            <div className="ch-callout">
                <strong>Local attention foreshadows later work:</strong> The idea of restricting
                attention to a dynamic window around a predicted position predates and
                conceptually relates to the local attention windows used in Longformer (2020)
                and BigBird (2020), which extend Transformers to very long sequences by
                combining local window attention (each token attends to its w nearest neighbors)
                with a small number of global tokens (that attend to all positions). The
                computational savings are analogous: O(n · w) instead of O(n²).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

# ── Luong Global Attention ────────────────────────────────────────────────────
class LuongGlobalAttention:
    """h_t^T W_a h_s (general scoring)"""
    def __init__(self, enc_dim, dec_dim, seed=0):
        rng = np.random.default_rng(seed)
        self.W_a = rng.normal(0, 0.1, (dec_dim, enc_dim))   # general score matrix
        self.W_c = rng.normal(0, 0.1, (dec_dim, dec_dim + enc_dim))  # combine proj
        self.tanh = np.tanh

    def forward(self, h_t, H):
        """h_t: (dec_dim,)  H: (T_enc, enc_dim)  ->  h_tilde (dec_dim,), alphas (T_enc,)"""
        # General scoring: h_t^T W_a h_s for all s
        Wh = H @ self.W_a.T    # (T_enc, dec_dim)
        energies = Wh @ h_t    # (T_enc,)
        alphas   = softmax(energies)

        # Context vector
        c_t = alphas @ H       # (enc_dim,)

        # Attentional hidden state: tanh(W_c [c_t; h_t])
        h_tilde = self.tanh(self.W_c @ np.concatenate([c_t, h_t]))

        return h_tilde, alphas


# ── Luong Local-p Attention ───────────────────────────────────────────────────
class LuongLocalAttention:
    """Predict alignment position p_t, attend Gaussian window around it."""
    def __init__(self, enc_dim, dec_dim, window_D=3, seed=0):
        rng = np.random.default_rng(seed)
        self.W_a = rng.normal(0, 0.1, (dec_dim, enc_dim))
        self.W_c = rng.normal(0, 0.1, (dec_dim, dec_dim + enc_dim))
        self.W_p = rng.normal(0, 0.1, (dec_dim, dec_dim))
        self.v_p = rng.normal(0, 0.1, dec_dim)
        self.D   = window_D
        self.tanh = np.tanh

    def forward(self, h_t, H, T_x):
        """T_x: total source length"""
        # Predict alignment position p_t in [0, T_x]
        p_t_float = T_x * (1 / (1 + np.exp(-self.v_p @ self.tanh(self.W_p @ h_t))))
        p_t = int(round(p_t_float))

        # Window [max(0, p_t - D), min(T_x - 1, p_t + D)]
        lo = max(0, p_t - self.D)
        hi = min(T_x - 1, p_t + self.D)
        H_win = H[lo:hi+1]                            # (window, enc_dim)
        positions = np.arange(lo, hi + 1)

        # Compute alignment scores within window
        Wh = H_win @ self.W_a.T                       # (window, dec_dim)
        energies = Wh @ h_t                            # (window,)

        # Gaussian position weights
        sigma = self.D / 2.0
        gaussian = np.exp(-((positions - p_t_float) ** 2) / (2 * sigma ** 2))
        alphas_win = softmax(energies) * gaussian
        alphas_win /= alphas_win.sum() + 1e-10         # renormalize

        # Full alpha vector (zero outside window)
        alphas = np.zeros(T_x)
        alphas[lo:hi+1] = alphas_win

        c_t = alphas @ H
        h_tilde = self.tanh(self.W_c @ np.concatenate([c_t, h_t]))
        return h_tilde, alphas, p_t


# ── Demo ──────────────────────────────────────────────────────────────────────
T_enc, enc_dim, dec_dim = 8, 6, 6
rng = np.random.default_rng(99)
H   = rng.normal(0, 0.5, (T_enc, enc_dim))
h_t = rng.normal(0, 0.5, dec_dim)

# Global
global_attn = LuongGlobalAttention(enc_dim, dec_dim)
h_tilde, alphas_g = global_attn.forward(h_t, H)

print("Luong Global Attention")
print("=" * 45)
for j, a in enumerate(alphas_g):
    bar = "X" * int(a * 35)
    print(f"  pos {j}: {a:.4f}  {bar}")
print(f"  sum  : {alphas_g.sum():.6f}")
print(f"  ||h~|| = {np.linalg.norm(h_tilde):.4f}")
print()

# Local-p
local_attn = LuongLocalAttention(enc_dim, dec_dim, window_D=2)
h_tilde_l, alphas_l, p_t = local_attn.forward(h_t, H, T_enc)

print(f"Luong Local-p Attention  (D=2, predicted p_t={p_t})")
print("=" * 45)
for j, a in enumerate(alphas_l):
    bar = "X" * int(a * 35)
    marker = " <- window" if abs(j - p_t) <= 2 else ""
    print(f"  pos {j}: {a:.4f}  {bar}{marker}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of both Luong attention variants. Global attention uses
                the general (bilinear) scoring function and the attentional hidden state projection.
                Local-p predicts an alignment position and applies a Gaussian window, showing
                the sparse attention weights.
            </p>
            <CodeBlock code={PY_CODE} filename="luong_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LUONG_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
