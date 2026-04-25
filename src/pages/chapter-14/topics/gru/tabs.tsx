import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Simpler gates, same power</h2>
            <p>
                By 2014, LSTMs had become the default choice for sequence modeling, but practitioners grumbled about their complexity. Four separate gate computations, two hidden states (cell and hidden), and a tangled gradient path made LSTMs slow to train and conceptually heavy. Kyunghyun Cho and his collaborators asked: what is the minimal gating mechanism that still solves the vanishing gradient problem? The answer was the Gated Recurrent Unit.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1997</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Hochreiter &amp; Schmidhuber — LSTM</div>
                    <div className="ch-tl-body">
                        <p>
                            The Long Short-Term Memory cell was designed explicitly to solve the vanishing gradient problem in RNNs — the tendency for gradient signals to decay exponentially as they backpropagate through time steps, making it impossible to learn long-range dependencies. LSTM's solution was structural: a separate cell state (the "constant-error carousel") that could carry information across hundreds of time steps with near-zero multiplicative attenuation, controlled by three sigmoid gates.
                        </p>
                        <p>
                            The forget gate decides how much of the old cell state to preserve; the input gate decides how much of the new candidate to add; the output gate decides how much of the cell state to expose as the hidden state. Together these four parametric operations gave the LSTM remarkable capacity for long-range memory — it could remember the subject of a sentence 50 words back and still use it correctly when generating the verb.
                        </p>
                        <p>
                            But the power came at a cost. Four weight matrices per gate — W and U for input and recurrent connections plus biases — meant that for a hidden dimension of n, a single LSTM layer required 4(n² + nd + n) parameters. At n = 512, that is approximately 2.1 million parameters per layer. Training on long sequences with backpropagation through time was slow, and the interaction between cell state and hidden state made the dynamics subtle to debug and tune.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Solved vanishing gradients but at the cost of architectural complexity and training overhead</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2014</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Cho et al. — GRU in the Encoder-Decoder Paper</div>
                    <div className="ch-tl-body">
                        <p>
                            The Gated Recurrent Unit appeared as a practical contribution inside the encoder-decoder paper: Cho, van Merriënboer, Gulcehre, Bahdanau, Bougares, Schwenk, and Bengio introduced it not as a standalone architectural advance but as the cell type they chose for their encoder and decoder RNNs. The key insight was structural simplification: the cell state and hidden state of the LSTM are the same vector in the GRU, eliminating the separate memory compartment and its associated gate.
                        </p>
                        <p>
                            The GRU uses two gates where LSTM uses four. The <em>reset gate</em> r controls how much of the previous hidden state to use when computing the candidate new state — near zero means "ignore the past for this update," near one means "use the full past context." The <em>update gate</em> z controls the interpolation between the old hidden state and the candidate — it simultaneously acts as the forget gate and the input gate of LSTM, merged into a single blending operation.
                        </p>
                        <p>
                            On the English-French translation task that the paper was built around, the GRU encoder-decoder produced competitive BLEU scores with substantially fewer parameters and faster training compared to an equivalent LSTM. The paper's primary goal was MT, but the GRU quickly became recognized as an independent contribution of comparable importance.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Introduced GRU with comparable BLEU to LSTM and 25% fewer parameters; coined the two-gate gating vocabulary</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">Follow-up analysis</div>
                    <div className="ch-tl-title">Cho et al. — On the Properties of Neural Machine Translation</div>
                    <div className="ch-tl-body">
                        <p>
                            Two months after the encoder-decoder paper, Cho, van Merriënboer, Bahdanau, and Bengio published "On the Properties of Neural Machine Translation: Encoder-Decoder Approaches" — a dedicated analysis of the encoder-decoder model's behavior, focused on the GRU as the recurrent unit. This paper characterized the learned representations more carefully and showed how the context vector's quality degraded as source sentence length increased.
                        </p>
                        <p>
                            The analysis revealed a key property of the GRU: the update gate tends to learn to stay near 0 (old state preserved) for most time steps, only opening up when a genuinely new and important piece of information arrives. This "mostly forget, occasionally update" behavior mirrors what one would want from a language model processing a sentence — most words narrow the interpretation slightly rather than completely reorienting it.
                        </p>
                        <p>
                            The paper also quantified the long-sentence degradation that would motivate Bahdanau's attention mechanism — establishing a clear empirical benchmark that the attention model would need to beat. In this sense, the paper both validated the GRU's efficiency and inadvertently motivated the next major innovation.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Characterized GRU's learned dynamics and established the long-sentence degradation benchmark that attention needed to overcome</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Empirical validation</div>
                    <div className="ch-tl-title">Chung et al. — Empirical Evaluation of GRU vs LSTM</div>
                    <div className="ch-tl-body">
                        <p>
                            Junyoung Chung, Çağlar Gülçehre, Kyunghyun Cho, and Yoshua Bengio ran the first systematic large-scale comparison of GRU and LSTM on tasks with diverse sequence structures: polyphonic music modeling, speech signal modeling (Ubisoft dataset and TIMIT frames), and several text datasets. The paper was deliberately rigorous — matching model sizes by parameter count rather than hidden dimension, and using the same training procedure across all variants.
                        </p>
                        <p>
                            The main finding: GRUs performed equivalently to LSTMs on most tasks, and outperformed them on some smaller datasets. The performance parity was striking given that the GRU has one fewer gate and no separate cell state. On the larger tasks, LSTMs occasionally had a slight edge — consistent with the expectation that the extra capacity becomes useful at scale. On smaller datasets, the GRU's reduced parameter count appeared to act as beneficial regularization, preventing the kind of overfitting that LSTM's larger model was prone to.
                        </p>
                        <p>
                            The practical conclusion that emerged from this paper — and that has held broadly through subsequent years — is: try GRU first when compute efficiency matters or when the dataset is small; switch to LSTM when you have large data and need maximum capacity. The community adopted this heuristic widely, and frameworks like PyTorch and TensorFlow made both available as first-class options.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Established GRU as a legitimate, often preferred alternative to LSTM; codified the GRU-first heuristic for practitioners</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2017</div>
                    <div className="ch-tl-section-label">Adoption and production use</div>
                    <div className="ch-tl-title">GRU in Speech, NLP, and Production Systems</div>
                    <div className="ch-tl-body">
                        <p>
                            Google's Neural Machine Translation system, Baidu's Deep Speech 2, and numerous competition-winning NLP models adopted GRUs as their recurrent cell of choice. The adoption was driven by simple pragmatics: on hardware with limited memory bandwidth — which included nearly all production hardware in 2015–2016 — the 25% parameter reduction and faster per-step computation of GRU translated directly to lower latency and higher throughput.
                        </p>
                        <p>
                            In speech synthesis, GRUs powered several text-to-speech systems that became production quality. WaveNet (DeepMind, 2016) used a different architecture (dilated convolutions), but competing systems like Tacotron used GRU decoders to generate mel spectrograms from text. The consistent finding was that GRUs could match LSTM quality while training faster and using less memory — exactly what practitioners needed to scale to real-world data.
                        </p>
                        <p>
                            The community settled on a hierarchy: vanilla RNNs for trivial sequences, GRU for most sequence modeling tasks, LSTM for tasks requiring very long-range dependencies or when compute budget is not a constraint. This hierarchy was displaced when Transformers arrived in 2017 — self-attention was faster to train and more expressive than either cell type for most tasks — but GRU remains a standard option in modern frameworks and is still preferred over LSTM in many low-resource and embedded-deployment scenarios.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: GRU became the pragmatic default for sequence modeling in the 2015–2017 era before Transformers; survives in resource-constrained settings</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – present</div>
                    <div className="ch-tl-section-label">Modern revival</div>
                    <div className="ch-tl-title">Linear RNNs and GRU-inspired State Space Models</div>
                    <div className="ch-tl-body">
                        <p>
                            As Transformers scaled to hundreds of billions of parameters, their O(n²) attention cost in sequence length became a bottleneck for very long contexts. Researchers revisited linear recurrences — state space models like S4 (2021), Mamba (2023), and Griffin (2024) — which share the GRU's philosophy of a gated hidden state but linearize or restructure the recurrence for efficient parallel training.
                        </p>
                        <p>
                            Mamba in particular drew explicit inspiration from gating mechanisms similar to GRU, using input-dependent state transitions that selectively forget and update information. These architectures achieve near-Transformer quality on many benchmarks while scaling linearly with sequence length, making them attractive for genomics, audio, and long-document tasks. The core insight is the same as the GRU's: a well-designed gating mechanism can select what to remember and what to forget, enabling powerful sequence modeling without the quadratic cost of full attention.
                        </p>
                        <p>
                            This revival demonstrates that the GRU's fundamental idea — selective gated blending of old and new state — remains relevant and is being actively developed a decade after its introduction. The vocabulary Cho introduced (reset gate, update gate, hidden state) appears directly in the descriptions of these modern architectures.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: GRU's gating ideas survive in state space models (Mamba, Griffin) as efficient alternatives to full attention for long sequences</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> LSTM's forget and input gates are redundant.
                If the forget gate keeps 80% of the old state and the input gate adds 20% new
                content, that is mathematically similar to a single update gate that blends the
                two. GRU removes this redundancy and exposes the blend directly. The result: a
                model that is 25% smaller, 33% faster per step, and empirically competitive with
                LSTM across most practical tasks.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A backpack with a freshness dial</h2>

            <Analogy label="The Old Backpack (Vanilla RNN)">
                Imagine you have a backpack that you carry through a museum. Every room you enter,
                you must dump the entire contents of your backpack on the floor, mix in what you
                see in the new room, and stuff everything back in. By the time you reach room 50,
                your backpack is just a blurry mush of every room combined. You can't remember
                what was in room 3.
                <br /><br />
                This is the vanilla RNN: at each step it completely mixes the old state with the
                new input. Nothing is preserved carefully. Old information dissolves as new
                information arrives. That's why vanilla RNNs fail on long sequences.
            </Analogy>

            <Analogy label="The Fancy Safe (LSTM)">
                Now imagine a super-secure safe with two compartments. One is a long-term vault
                where you can carefully choose what to keep forever. The other is a daily bag
                you carry around. You have four different keys: one to decide what to throw away
                from the vault, one to decide what new items to add, one to decide what to read
                from the vault into your bag, and one to decide what from your bag to output.
                <br /><br />
                It works great, but managing four keys every room is exhausting — and the safe
                itself takes up more space and costs more to manufacture. That's LSTM: powerful,
                precise, but complex. Four gate computations per step means four times the math.
            </Analogy>

            <Analogy label="The Smart Backpack (GRU)">
                The GRU is like a smart backpack with only two dials. One dial says "how much of
                my old stuff do I keep?" (the update gate). The other says "how much of my old
                stuff do I consider when deciding what new things to add?" (the reset gate).
                <br /><br />
                If the update dial is turned to "keep almost everything," your backpack barely
                changes — perfect for walking through boring rooms. If it's turned to "refresh
                fully," you get a brand new backpack — perfect when something important happens.
                And there's only one backpack, not a separate vault and bag. Simpler, faster,
                and surprisingly just as good.
            </Analogy>

            <Analogy label="When to Choose GRU vs LSTM">
                If you are a museum curator trying to decide which bag to give visitors —
                the fancy four-key safe or the smart two-dial backpack — the answer depends
                on what they're doing.
                <br /><br />
                If the exhibits are complex and the visitor needs to remember very specific details
                from room 1 when they reach room 200, give them the safe (LSTM). If there are
                thousands of visitors and you need to be efficient, and most of them don't need
                that extreme precision, give them the backpack (GRU). It handles almost everything
                just as well at two-thirds of the cost.
            </Analogy>

            <Analogy label="The Update Gate in Action">
                Think of the update gate as a "freshness dial" for your memory. Turn it all the
                way to the right and your backpack gets completely refreshed at this room — old
                contents discarded, new contents loaded. Turn it all the way left and your
                backpack stays exactly as it was — the room you just walked through leaves no
                trace.
                <br /><br />
                In practice, for most words in a sentence, the update gate stays mostly to the
                left — small updates, preserving most of the context. When the model encounters
                a key word that changes the meaning (like "not", or a subject noun), the gate
                opens wider, making a bigger update. The gate learns when to pay attention and
                when to coast.
            </Analogy>

            <Analogy label="The Reset Gate in Action">
                The reset gate is subtler. It answers: "When I'm about to form a new thought,
                how much of my past memory should I bring into that thinking?"
                <br /><br />
                If the reset gate is near zero, the new candidate state is computed almost purely
                from the current input — ignoring the past. This is useful when the model needs
                to start fresh, like at the beginning of a new sentence inside a paragraph. If
                the reset gate is near one, the past fully participates in forming the new state.
                Together with the update gate, it gives the GRU its selective memory.
            </Analogy>

            <Analogy label="The Mamba Connection — GRU Ideas in 2024">
                Here's something cool: even though Transformers took over from GRUs in 2017,
                the GRU's ideas came back around. New architectures in 2023 and 2024 (like Mamba
                and Griffin) use very similar gating ideas — "selectively update a hidden state" —
                but make the recurrence faster by using linear operations. They're essentially
                high-speed GRUs that can handle sequences 10× longer than Transformers handle
                efficiently. The two-dial backpack from 2014 is still being improved today.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Update gate, reset gate, and the candidate activation</h2>

            <h3>GRU Architecture Overview</h3>
            <p>
                A GRU has two gates and one hidden state (no separate cell state). At each time
                step t, given input x<sub>t</sub> and previous hidden state h<sub>t-1</sub>, three
                computations occur: reset gate, update gate, and candidate state. The final hidden
                state h<sub>t</sub> is a blend of the old state and the candidate, controlled by
                the update gate.
            </p>

            <h3>1 — Reset Gate</h3>
            <p>
                The reset gate r<sub>t</sub> controls how much of the previous state to include
                when computing the new candidate state. Values near 0 mean "ignore the past"; near 1
                mean "use the past fully":
            </p>
            <MathBlock tex="\mathbf{r}_t = \sigma\!\left(\mathbf{W}_r \mathbf{x}_t + \mathbf{U}_r \mathbf{h}_{t-1} + \mathbf{b}_r\right)" />

            <h3>2 — Update Gate</h3>
            <p>
                The update gate z<sub>t</sub> controls the interpolation between the old state and
                the new candidate state. It simultaneously plays the role of LSTM's forget and
                input gates, blending them into a single convex combination:
            </p>
            <MathBlock tex="\mathbf{z}_t = \sigma\!\left(\mathbf{W}_z \mathbf{x}_t + \mathbf{U}_z \mathbf{h}_{t-1} + \mathbf{b}_z\right)" />

            <h3>3 — Candidate Activation</h3>
            <p>
                The candidate state h̃<sub>t</sub> is computed using the reset gate to mask the
                previous hidden state. If r<sub>t</sub> ≈ 0, the candidate is computed almost
                entirely from the current input, enabling "fresh start" updates:
            </p>
            <MathBlock tex="\tilde{\mathbf{h}}_t = \tanh\!\left(\mathbf{W}_h \mathbf{x}_t + \mathbf{U}_h (\mathbf{r}_t \odot \mathbf{h}_{t-1}) + \mathbf{b}_h\right)" />

            <h3>4 — Final Hidden State</h3>
            <p>
                Blend the old state and the candidate using the update gate. When z<sub>t</sub> = 1,
                the state fully updates; when z<sub>t</sub> = 0, the old state passes through unchanged —
                creating a gradient highway analogous to LSTM's cell state:
            </p>
            <MathBlock tex="\mathbf{h}_t = (1 - \mathbf{z}_t) \odot \mathbf{h}_{t-1} + \mathbf{z}_t \odot \tilde{\mathbf{h}}_t" />

            <h3>GRU vs LSTM — Structural Comparison</h3>
            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>GRU</th>
                        <th>LSTM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gates</td>
                        <td>2 (reset, update)</td>
                        <td>3 (forget, input, output)</td>
                    </tr>
                    <tr>
                        <td>Hidden states</td>
                        <td>1 (h<sub>t</sub>)</td>
                        <td>2 (h<sub>t</sub>, c<sub>t</sub>)</td>
                    </tr>
                    <tr>
                        <td>Weight matrices</td>
                        <td>3 pairs</td>
                        <td>4 pairs</td>
                    </tr>
                    <tr>
                        <td>Parameters (n=512)</td>
                        <td>~1.57M</td>
                        <td>~2.10M</td>
                    </tr>
                    <tr>
                        <td>Training speed</td>
                        <td>~33% faster per step</td>
                        <td>Baseline</td>
                    </tr>
                    <tr>
                        <td>Typical performance</td>
                        <td>Equal or better on small data</td>
                        <td>Slightly better on large data</td>
                    </tr>
                </tbody>
            </table>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key difference from LSTM:</strong> GRU has no separate cell state c<sub>t</sub>.
                The hidden state h<sub>t</sub> serves both roles. This means fewer parameters
                (3 weight matrix pairs instead of 4) and a shorter gradient path. The update gate z<sub>t</sub>
                is the blend coefficient — when z ≈ 1, the state updates fully; when z ≈ 0, it copies
                the previous state, creating a direct gradient highway through time that prevents
                vanishing gradients without LSTM's more complex memory architecture.
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
            <h2>Full specification and gradient analysis</h2>

            <DefBlock label="GRU — Formal Specification">
                Input: x<sub>t</sub> ∈ ℝ<sup>d</sup>. Previous hidden state: h<sub>t-1</sub> ∈ ℝ<sup>n</sup>.
                Weight matrices: W<sub>r</sub>, W<sub>z</sub>, W<sub>h</sub> ∈ ℝ<sup>n×d</sup>;
                U<sub>r</sub>, U<sub>z</sub>, U<sub>h</sub> ∈ ℝ<sup>n×n</sup>.
                Biases: b<sub>r</sub>, b<sub>z</sub>, b<sub>h</sub> ∈ ℝ<sup>n</sup>.
                σ is the logistic sigmoid; ⊙ is element-wise multiplication.
            </DefBlock>

            <h3>Forward Pass (Vector Form)</h3>
            <MathBlock tex="\mathbf{r}_t = \sigma\bigl(\mathbf{W}_r \mathbf{x}_t + \mathbf{U}_r \mathbf{h}_{t-1} + \mathbf{b}_r\bigr)" />
            <MathBlock tex="\mathbf{z}_t = \sigma\bigl(\mathbf{W}_z \mathbf{x}_t + \mathbf{U}_z \mathbf{h}_{t-1} + \mathbf{b}_z\bigr)" />
            <MathBlock tex="\tilde{\mathbf{h}}_t = \tanh\bigl(\mathbf{W}_h \mathbf{x}_t + \mathbf{U}_h(\mathbf{r}_t \odot \mathbf{h}_{t-1}) + \mathbf{b}_h\bigr)" />
            <MathBlock tex="\mathbf{h}_t = (1 - \mathbf{z}_t) \odot \mathbf{h}_{t-1} + \mathbf{z}_t \odot \tilde{\mathbf{h}}_t" />

            <h3>Gradient Through Time</h3>
            <p>
                Define the error signal δ<sub>t</sub> = ∂L/∂h<sub>t</sub>. Expanding the
                derivative of h<sub>t</sub> with respect to h<sub>t-1</sub>:
            </p>
            <MathBlock tex="\frac{\partial \mathbf{h}_t}{\partial \mathbf{h}_{t-1}} = \text{diag}(1 - \mathbf{z}_t) + \text{diag}(\mathbf{z}_t) \frac{\partial \tilde{\mathbf{h}}_t}{\partial \mathbf{h}_{t-1}} + \text{diag}(\tilde{\mathbf{h}}_t - \mathbf{h}_{t-1}) \frac{\partial \mathbf{z}_t}{\partial \mathbf{h}_{t-1}}" />
            <p>
                The first term, diag(1 − z<sub>t</sub>), is the gradient highway. When the update gate
                is near 0, this term is near the identity matrix, allowing gradients to flow
                backward through many time steps with almost no attenuation. This is the GRU's
                solution to the vanishing gradient problem — simpler than LSTM's constant-error
                carousel but equally effective in practice.
            </p>

            <h3>Parameter Count Comparison</h3>
            <MathBlock tex="\text{GRU params} = 3 \cdot (n^2 + n \cdot d + n) = 3n^2 + 3nd + 3n" />
            <MathBlock tex="\text{LSTM params} = 4 \cdot (n^2 + n \cdot d + n) = 4n^2 + 4nd + 4n" />
            <p>
                For n = d = 512, GRU has ~1.57M parameters vs LSTM's ~2.10M — a 25% reduction.
                During training, the reduction in matrix multiplications yields roughly a 33%
                speedup per step. At scale with mini-batches this advantage compounds: GRU
                can be trained on a 33% larger dataset in the same wall-clock time.
            </p>

            <div className="ch-callout">
                <strong>Why GRU sometimes outperforms LSTM:</strong> The reduced parameter count
                acts as implicit regularization. On smaller datasets, LSTMs can overfit by using
                their extra capacity to memorize noise. GRUs, being slightly less expressive,
                are forced to learn more generalizable representations. This mirrors the bias-variance
                trade-off in a recurrent setting — the optimal model complexity scales with dataset size.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── GRU Cell — NumPy ──────────────────────────────────────────────────────────
class GRUCell:
    """Single GRU cell with update gate z and reset gate r."""
    def __init__(self, input_dim, hidden_dim, seed=42):
        rng = np.random.default_rng(seed)
        self.input_dim  = input_dim
        self.hidden_dim = hidden_dim

        # Stack W_r, W_z, W_h vertically for efficient matmul
        self.W = rng.normal(0, 0.01, (3 * hidden_dim, input_dim))
        self.U = rng.normal(0, 0.01, (3 * hidden_dim, hidden_dim))
        self.b = np.zeros(3 * hidden_dim)

    def _slice(self, v):
        return v[0:self.hidden_dim], v[self.hidden_dim:2*self.hidden_dim], v[2*self.hidden_dim:3*self.hidden_dim]

    def forward(self, x, h_prev):
        """x: (input_dim,)  h_prev: (hidden_dim,)  ->  h: (hidden_dim,)"""
        pre = self.W @ x + self.U @ h_prev + self.b       # (3*hidden_dim,)
        r_pre, z_pre, h_pre = self._slice(pre)

        r = 1 / (1 + np.exp(-r_pre))                      # sigmoid
        z = 1 / (1 + np.exp(-z_pre))                      # sigmoid

        h_tilde = np.tanh(self.W[2*self.hidden_dim:3*self.hidden_dim] @ x
                        + self.U[2*self.hidden_dim:3*self.hidden_dim] @ (r * h_prev)
                        + self.b[2*self.hidden_dim:3*self.hidden_dim])

        h = (1 - z) * h_prev + z * h_tilde
        return h, (r, z, h_tilde)   # cache for backprop

    def sequence(self, X, h0=None):
        """X: (T, input_dim)  ->  H: (T, hidden_dim)"""
        T = X.shape[0]
        H = np.zeros((T, self.hidden_dim))
        h = h0 if h0 is not None else np.zeros(self.hidden_dim)
        for t in range(T):
            h, _ = self.forward(X[t], h)
            H[t] = h
        return H


# ── Demo ──────────────────────────────────────────────────────────────────────
T, input_dim, hidden_dim = 20, 4, 8
rng = np.random.default_rng(7)
X = rng.normal(0, 0.5, (T, input_dim))

gru = GRUCell(input_dim, hidden_dim)
H = gru.sequence(X)

print("GRU Sequence Demo")
print("=" * 45)
print(f"Sequence length : {T}")
print(f"Input dim       : {input_dim}")
print(f"Hidden dim      : {hidden_dim}")
print(f"Parameters      : {gru.W.size + gru.U.size + gru.b.size}")
print()
print("Hidden state norms across time steps:")
for t in range(T):
    marker = "  <-" if t == 0 or t == T - 1 else ""
    print(f"  t={t:2d}: ||h|| = {np.linalg.norm(H[t]):.4f}{marker}")
print()

# Show that gradients don't vanish: compute finite-difference sensitivity
# of final state to initial state
h0 = np.zeros(hidden_dim)
h0_fd = h0.copy()
h0_fd[0] += 1e-5
H1 = gru.sequence(X, h0)
H2 = gru.sequence(X, h0_fd)
sensitivity = np.linalg.norm(H1[-1] - H2[-1]) / 1e-5
print(f"Sensitivity of h_T to h_0 perturbation: {sensitivity:.4f}")
print("(Values >> 1 indicate healthy gradient flow)")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a single GRU cell and a full sequence forward pass.
                The demo shows hidden state norms across 20 time steps and a finite-difference
                sensitivity test demonstrating that gradients do not vanish.
            </p>
            <CodeBlock code={PY_CODE} filename="gru_cell.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const GRU_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
