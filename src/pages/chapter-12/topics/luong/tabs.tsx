import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Simpler, faster, and just as good</h2>
            <p>
                Bahdanau attention was transformative, but it used a relatively complex scoring
                function and applied attention at the input to the decoder RNN. In 2015, Minh-Thang
                Luong, Hieu Pham, and Christopher Manning at Stanford took a systematic look at
                attention design choices and found that several simplifications either matched
                or improved on the original.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 Aug</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Luong, Pham, Manning — Effective Approaches to Attention</div>
                    <div className="ch-tl-body">
                        "Effective Approaches to Attention-based Neural Machine Translation" (EMNLP 2015)
                        introduced two key contributions. First: a cleaner architecture that computes
                        attention using the <em>current</em> decoder hidden state h<sub>t</sub> (not
                        the previous s<sub>t-1</sub> as in Bahdanau), then combines the context
                        vector with h<sub>t</sub> to produce an "attentional" hidden state h̃<sub>t</sub>
                        before the output layer. Second: two types of attention — global (over all
                        source positions) and local (over a window around a predicted alignment point).
                    </div>
                    <div className="ch-tl-impact">Impact: Cleaner formulation; global attention became the default for many systems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Global Attention</div>
                    <div className="ch-tl-title">Three Scoring Functions — Dot, General, Concat</div>
                    <div className="ch-tl-body">
                        Luong et al. compared three scoring functions under the global attention
                        framework: <em>dot</em> (h<sub>t</sub><sup>T</sup>h̄<sub>s</sub>),
                        <em>general</em> (h<sub>t</sub><sup>T</sup>W<sub>a</sub>h̄<sub>s</sub>), and
                        <em>concat</em> (essentially Bahdanau's additive). Dot and general
                        consistently outperformed concat across language pairs and were
                        faster to compute. This result was surprising — the simpler parameterizations
                        worked better, perhaps because they were less prone to overfitting.
                    </div>
                    <div className="ch-tl-impact">Impact: Established dot and general as go-to scoring functions</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Local Attention</div>
                    <div className="ch-tl-title">Local-p: Predict the Alignment Position</div>
                    <div className="ch-tl-body">
                        For monotonic or near-monotonic language pairs (like English↔German in some
                        regions), attending to all T<sub>x</sub> source positions is wasteful and
                        potentially noisy. Local attention predicts an alignment position p<sub>t</sub>
                        for each decoder step using a small feedforward network, then applies
                        Gaussian-windowed attention around p<sub>t</sub>. This reduces computation
                        from O(T<sub>x</sub>) to O(2D+1) per step (D is the window half-width).
                        On long sentences, this led to improved BLEU scores.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed attention can be restricted to a dynamic window, foreshadowing local attention in later work</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Architectural difference from Bahdanau:</strong> In Bahdanau's model,
                context c<sub>t</sub> is an input to the decoder RNN cell at step t. In Luong's
                model, the decoder RNN runs first (h<sub>t</sub> = RNN(h<sub>t-1</sub>, y<sub>t-1</sub>)),
                then attention is computed, and the context is combined <em>after</em> the RNN step
                to form h̃<sub>t</sub>. The output is produced from h̃<sub>t</sub>, not h<sub>t</sub>.
                This means the attention acts as a "post-processing" step rather than an input
                — a subtle but important architectural choice.
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
                around that position. Faster, and often just as accurate.
            </Analogy>

            <Analogy label="Luong vs Bahdanau — Order of Operations">
                Bahdanau does attention <em>before</em> the decoder step: "First decide what
                to look at, then generate the next word." Luong does it <em>after</em>:
                "First take a step with the decoder, then look back at the source to refine
                the output." Both work; they just differ in when the attention happens.
                <br /><br />
                Think of it like writing an essay. Bahdanau: check your notes before writing
                each sentence. Luong: write the sentence first, then check your notes to
                polish it.
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
                At decoder step t, the decoder RNN produces h<sub>t</sub> from the previous
                state and embedding (no context yet):
            </p>
            <MathBlock tex="\mathbf{h}_t = \text{RNN}\!\left(\mathbf{h}_{t-1},\; \mathbf{e}(y_{t-1})\right)" />
            <p>
                Compute alignment scores using one of the three scoring functions:
            </p>
            <MathBlock tex="\text{score}(\mathbf{h}_t, \bar{\mathbf{h}}_s) = \begin{cases} \mathbf{h}_t^\top \bar{\mathbf{h}}_s & \text{dot} \\ \mathbf{h}_t^\top \mathbf{W}_a \bar{\mathbf{h}}_s & \text{general} \\ \mathbf{v}_a^\top \tanh\!\left(\mathbf{W}_a[\mathbf{h}_t;\bar{\mathbf{h}}_s]\right) & \text{concat} \end{cases}" />
            <p>
                Attention weights and context vector:
            </p>
            <MathBlock tex="\boldsymbol{\alpha}_t = \text{softmax}\!\left(\text{score}(\mathbf{h}_t, \bar{\mathbf{H}})\right)" />
            <MathBlock tex="\mathbf{c}_t = \bar{\mathbf{H}}^\top \boldsymbol{\alpha}_t" />
            <p>
                Produce the attentional hidden state h̃<sub>t</sub> by combining h<sub>t</sub> and c<sub>t</sub>:
            </p>
            <MathBlock tex="\tilde{\mathbf{h}}_t = \tanh\!\left(\mathbf{W}_c\, [\mathbf{c}_t;\, \mathbf{h}_t]\right)" />
            <p>
                Output: P(y<sub>t</sub>) = softmax(W<sub>s</sub> h̃<sub>t</sub>)
            </p>

            <h3>Local-p Attention</h3>
            <p>
                Predict an alignment position p<sub>t</sub> ∈ [0, T<sub>x</sub>]:
            </p>
            <MathBlock tex="p_t = T_x \cdot \text{sigmoid}\!\left(\mathbf{v}_p^\top \tanh\!\left(\mathbf{W}_p\, \mathbf{h}_t\right)\right)" />
            <p>
                Apply Gaussian-weighted attention around p<sub>t</sub> within a window [p<sub>t</sub>−D, p<sub>t</sub>+D]:
            </p>
            <MathBlock tex="\alpha_{ts} = \text{align}(\mathbf{h}_t, \bar{\mathbf{h}}_s) \cdot \exp\!\left(-\frac{(s - p_t)^2}{2\sigma^2}\right)" />
            <p>
                where σ = D/2 and align is the same softmax-normalized scoring. Only positions
                within the window are computed; all others get weight 0.
            </p>
        </>
    )
}

function MathsTab() {
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
                path to h<sub>j</sub> (encoder state) does not pass through the recurrent
                computation:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \bar{\mathbf{h}}_j} = \sum_t \alpha_{tj} \cdot \frac{\partial \mathcal{L}}{\partial \mathbf{c}_t}" />
            <p>
                This is a <em>shorter</em> gradient path from the loss to the encoder, which can
                speed up training and reduce vanishing gradient issues through the decoder.
            </p>

            <h3>Local-p — Differentiability</h3>
            <p>
                The alignment position p<sub>t</sub> is computed as a differentiable sigmoid:
            </p>
            <MathBlock tex="\frac{\partial p_t}{\partial \mathbf{h}_t} = T_x \cdot \sigma'(\cdot) \cdot \mathbf{v}_p^\top \bigl(\mathbf{I} - \tanh^2(\mathbf{W}_p \mathbf{h}_t)\bigr) \mathbf{W}_p" />
            <p>
                The Gaussian weight g<sub>ts</sub> = exp(−(s−p<sub>t</sub>)<sup>2</sup>/2σ<sup>2</sup>)
                introduces a gradient on p<sub>t</sub>: positions near p<sub>t</sub> get higher
                weight, so the model is incentivized to predict p<sub>t</sub> close to the
                true alignment. Combined with the cross-entropy loss, this creates an implicit
                alignment supervision signal.
            </p>

            <h3>Computational Complexity Comparison</h3>
            <MathBlock tex="\text{Global:}\quad O(T_x) \text{ scores per step}" />
            <MathBlock tex="\text{Local-}p:\quad O(2D+1) \text{ scores per step, }D \ll T_x" />
            <p>
                For T<sub>x</sub> = 50 and D = 5, local-p computes 11 instead of 50 scores —
                a 4.5× reduction in attention computation. For machine translation with long
                sentences, this becomes increasingly significant.
            </p>

            <div className="ch-callout">
                <strong>Local attention foreshadows later work:</strong> The idea of restricting
                attention to a dynamic window around a predicted position predates and
                conceptually relates to the local attention windows used in LongFormer (2020)
                and BigBird (2020), which extend Transformers to very long sequences by
                combining local window attention with global tokens.
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
        """h_t: (dec_dim,)  H: (T_enc, enc_dim)  →  h_tilde (dec_dim,), alphas (T_enc,)"""
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
        # Predict alignment position p_t ∈ [0, T_x]
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
    bar = "█" * int(a * 35)
    print(f"  pos {j}: {a:.4f}  {bar}")
print(f"  sum  : {alphas_g.sum():.6f}")
print(f"  ||h̃|| = {np.linalg.norm(h_tilde):.4f}")
print()

# Local-p
local_attn = LuongLocalAttention(enc_dim, dec_dim, window_D=2)
h_tilde_l, alphas_l, p_t = local_attn.forward(h_t, H, T_enc)

print(f"Luong Local-p Attention  (D=2, predicted p_t={p_t})")
print("=" * 45)
for j, a in enumerate(alphas_l):
    bar = "█" * int(a * 35)
    marker = " ← window" if abs(j - p_t) <= 2 else ""
    print(f"  pos {j}: {a:.4f}  {bar}{marker}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementations of both Luong attention variants. Global attention uses
                the general (bilinear) scoring function. Local-p predicts an alignment position
                and applies a Gaussian window, showing the sparse attention weights.
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
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
