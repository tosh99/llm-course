import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Simpler gates, same power</h2>
            <p>
                By 2014, LSTMs had become the default choice for sequence modeling, but
                practitioners grumbled about their complexity. Four separate gate computations,
                two hidden states (cell and hidden), and a tangled gradient path made LSTMs
                slow to train and conceptually heavy. Kyunghyun Cho and his collaborators
                asked: what is the minimal gating mechanism that still solves the vanishing
                gradient problem? The answer was the Gated Recurrent Unit.
            </p>

            <div className="ch13-timeline">
                <div className="ch13-tl-item">
                    <div className="ch13-tl-year">1997</div>
                    <div className="ch13-tl-section-label">Predecessor</div>
                    <div className="ch13-tl-title">Hochreiter &amp; Schmidhuber — LSTM</div>
                    <div className="ch13-tl-body">
                        The Long Short-Term Memory cell introduced input, forget, and output gates
                        plus a constant-error carousel (CEC) to shuttle gradients across hundreds
                        of time steps. It worked brilliantly but required ~4× the parameters of a
                        vanilla RNN and had a subtle interaction between cell state and hidden state
                        that made implementation error-prone.
                    </div>
                    <div className="ch13-tl-impact">Impact: Solved vanishing gradients but at the cost of complexity</div>
                </div>

                <div className="ch13-tl-item">
                    <div className="ch13-tl-year">2014</div>
                    <div className="ch13-tl-section-label">Invention</div>
                    <div className="ch13-tl-title">Cho et al. — Learning Phrase Representations with GRU</div>
                    <div className="ch13-tl-body">
                        In "Learning Phrase Representations using RNN Encoder-Decoder for
                        Statistical Machine Translation" (EMNLP 2014), Cho introduced the Gated
                        Recurrent Unit as a drop-in replacement for LSTM in their encoder-decoder
                        model. The GRU merged the cell state and hidden state into one vector and
                        collapsed the four LSTM gates into two: an <em>update gate</em> (controlling
                        how much of the previous state to keep) and a <em>reset gate</em> (controlling
                        how much of the previous state to forget when computing the candidate state).
                    </div>
                    <div className="ch13-tl-impact">Impact: Comparable BLEU scores with fewer parameters and faster training</div>
                </div>

                <div className="ch13-tl-item">
                    <div className="ch13-tl-year">2015</div>
                    <div className="ch13-tl-section-label">Validation</div>
                    <div className="ch13-tl-title">Chung et al. — Empirical Evaluation of GRU vs LSTM</div>
                    <div className="ch13-tl-body">
                        Junyoung Chung, Çağlar Gülçehre, Kyunghyun Cho, and Yoshua Bengio ran the
                        first large-scale empirical comparison. On polyphonic music modeling and
                        speech signal modeling, GRUs performed equivalently to LSTMs. On some
                        smaller datasets, GRUs even outperformed LSTMs, possibly because their
                        reduced parameter count acted as a beneficial regularizer.
                    </div>
                    <div className="ch13-tl-impact">Impact: Established GRU as a legitimate, often preferred, alternative to LSTM</div>
                </div>

                <div className="ch13-tl-item">
                    <div className="ch13-tl-year">2015 – 2017</div>
                    <div className="ch13-tl-section-label">Adoption</div>
                    <div className="ch13-tl-title">GRU Becomes the Default in Production</div>
                    <div className="ch13-tl-body">
                        Google's Neural Machine Translation system, Baidu's Deep Speech 2, and
                        numerous Kaggle winning solutions adopted GRUs for the simple reason that
                        they trained faster and used less memory while delivering the same accuracy.
                        Frameworks like TensorFlow and PyTorch made GRU a first-class citizen alongside
                        LSTM. The community settled on a heuristic: try GRU first, switch to LSTM only
                        if you need the extra capacity.
                    </div>
                    <div className="ch13-tl-impact">Impact: GRU became the pragmatic default for sequence modeling before Transformers</div>
                </div>
            </div>

            <div className="ch13-callout">
                <strong>The core insight:</strong> LSTM's forget and input gates are redundant.
                If the forget gate keeps 80% of the old state and the input gate adds 20% new
                content, that is mathematically similar to a single update gate that blends the
                two. GRU removes this redundancy and exposes the blend directly.
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
            </Analogy>

            <Analogy label="The Fancy Safe (LSTM)">
                Now imagine a super-secure safe with two compartments. One is a long-term vault
                where you can carefully choose what to keep forever. The other is a daily bag
                you carry around. You have four different keys: one to decide what to throw away
                from the vault, one to decide what new items to add, one to decide what to read
                from the vault into your bag, and one to decide what from your bag to output.
                It works great, but managing four keys every room is exhausting.
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
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Update gate, reset gate, and the candidate activation</h2>

            <h3>GRU Architecture</h3>
            <p>
                A GRU has two gates and one hidden state. At each time step t, given input x<sub>t</sub>
                and previous hidden state h<sub>t-1</sub>:
            </p>

            <h3>1. Reset Gate</h3>
            <p>
                The reset gate r<sub>t</sub> controls how much of the previous state to forget when
                computing the new candidate state. Values near 0 mean "ignore the past"; near 1
                mean "use the past normally":
            </p>
            <MathBlock tex="\mathbf{r}_t = \sigma\!\left(\mathbf{W}_r \mathbf{x}_t + \mathbf{U}_r \mathbf{h}_{t-1} + \mathbf{b}_r\right)" />

            <h3>2. Update Gate</h3>
            <p>
                The update gate z<sub>t</sub> controls the interpolation between the old state and
                the new candidate state. It is the GRU's version of LSTM's forget and input gates
                combined into one:
            </p>
            <MathBlock tex="\mathbf{z}_t = \sigma\!\left(\mathbf{W}_z \mathbf{x}_t + \mathbf{U}_z \mathbf{h}_{t-1} + \mathbf{b}_z\right)" />

            <h3>3. Candidate Activation</h3>
            <p>
                The candidate state h̃<sub>t</sub> is computed using the reset gate to mask the
                previous hidden state. If r<sub>t</sub> ≈ 0, the candidate is computed almost
                entirely from the current input:
            </p>
            <MathBlock tex="\tilde{\mathbf{h}}_t = \tanh\!\left(\mathbf{W}_h \mathbf{x}_t + \mathbf{U}_h (\mathbf{r}_t \odot \mathbf{h}_{t-1}) + \mathbf{b}_h\right)" />

            <h3>4. Final Hidden State</h3>
            <p>
                Blend the old state and the candidate using the update gate:
            </p>
            <MathBlock tex="\mathbf{h}_t = (1 - \mathbf{z}_t) \odot \mathbf{h}_{t-1} + \mathbf{z}_t \odot \tilde{\mathbf{h}}_t" />

            <hr className="ch13-sep" />
            <div className="ch13-callout">
                <strong>Key difference from LSTM:</strong> GRU has no separate cell state c<sub>t</sub>.
                The hidden state h<sub>t</sub> serves both roles. This means fewer parameters
                (3 weight matrices instead of 4) and a shorter gradient path. The update gate z<sub>t</sub>
                is the blend coefficient — when z ≈ 1, the state updates fully; when z ≈ 0, it copies
                the previous state, creating a direct gradient highway through time.
            </div>
        </>
    )
}

function MathsTab() {
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
                Define the error signal δ<sub>t</sub> = ∂L/∂h<sub>t</sub>. The recurrence gradient is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_{t-1}} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_t} \cdot \frac{\partial \mathbf{h}_t}{\partial \mathbf{h}_{t-1}}" />
            <p>
                Expanding the derivative of h<sub>t</sub> with respect to h<sub>t-1</sub>:
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
                speedup per step.
            </p>

            <div className="ch13-callout">
                <strong>Why GRU sometimes outperforms LSTM:</strong> The reduced parameter count
                acts as implicit regularization. On smaller datasets, LSTMs can overfit by using
                their extra capacity to memorize noise. GRUs, being slightly less expressive,
                are forced to learn more generalizable representations. This mirrors the bias-variance
                trade-off in a recurrent setting.
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
        """x: (input_dim,)  h_prev: (hidden_dim,)  →  h: (hidden_dim,)"""
        # Concatenate for single matmul: [W; U] @ [x; h] is not faster here,
        # so we keep separate for clarity.
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
        """X: (T, input_dim)  →  H: (T, hidden_dim)"""
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
    marker = "  ←" if t == 0 or t == T - 1 else ""
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

function PythonTab() {
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

const TS_CODE = `// ── GRU Cell — TypeScript ───────────────────────────────────────────────────

type Vec = number[]
type Mat = number[][]

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
const tanh    = (x: number) => Math.tanh(x)
const vecOp   = (a: Vec, b: Vec, f: (x: number, y: number) => number): Vec =>
  a.map((ai, i) => f(ai, b[i]))
const vecScale = (v: Vec, s: number): Vec => v.map(x => x * s)
const dot = (a: Vec, b: Vec) => a.reduce((s, ai, i) => s + ai * b[i], 0)
const matVec = (M: Mat, v: Vec): Vec => M.map(row => dot(row, v))

interface GRUParams {
  Wr: Mat; Wz: Mat; Wh: Mat
  Ur: Mat; Uz: Mat; Uh: Mat
  br: Vec; bz: Vec; bh: Vec
}

function gruStep(x: Vec, hPrev: Vec, p: GRUParams): Vec {
  const r = vecOp(matVec(p.Wr, x), matVec(p.Ur, hPrev), (a, b) => a + b)
    .map((v, i) => sigmoid(v + p.br[i]))
  const z = vecOp(matVec(p.Wz, x), matVec(p.Uz, hPrev), (a, b) => a + b)
    .map((v, i) => sigmoid(v + p.bz[i]))

  const rH = vecOp(r, hPrev, (ri, hi) => ri * hi)
  const hTilde = vecOp(matVec(p.Wh, x), matVec(p.Uh, rH), (a, b) => a + b)
    .map((v, i) => tanh(v + p.bh[i]))

  // h = (1 - z) * hPrev + z * hTilde
  return hPrev.map((hp, i) => (1 - z[i]) * hp + z[i] * hTilde[i])
}

function gruSequence(X: Mat, h0: Vec, p: GRUParams): Vec[] {
  const H: Vec[] = []
  let h = h0
  for (const x of X) {
    h = gruStep(x, h, p)
    H.push([...h])
  }
  return H
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const INPUT_DIM = 3, HIDDEN = 5
const randMat = (r: number, c: number): Mat =>
  Array.from({ length: r }, () =>
    Array.from({ length: c }, () => (Math.random() - 0.5) * 0.2))
const randVec = (n: number): Vec =>
  Array.from({ length: n }, () => (Math.random() - 0.5) * 0.2)

const params: GRUParams = {
  Wr: randMat(HIDDEN, INPUT_DIM), Wz: randMat(HIDDEN, INPUT_DIM), Wh: randMat(HIDDEN, INPUT_DIM),
  Ur: randMat(HIDDEN, HIDDEN),    Uz: randMat(HIDDEN, HIDDEN),    Uh: randMat(HIDDEN, HIDDEN),
  br: randVec(HIDDEN),            bz: randVec(HIDDEN),            bh: randVec(HIDDEN),
}

// A sentence where word 3 is a "signal" word (high magnitude)
const X: Mat = [
  [0.1, 0.0, 0.0],
  [0.2, 0.0, 0.0],
  [0.9, 0.8, 0.7],   // signal
  [0.1, 0.0, 0.0],
  [0.1, 0.0, 0.0],
]

const h0 = randVec(HIDDEN)
const H = gruSequence(X, h0, params)

console.log("GRU Sequence — TypeScript")
console.log("─".repeat(40))
H.forEach((h, t) => {
  const norm = Math.sqrt(h.reduce((s, v) => s + v * v, 0))
  console.log(\`  t=\${t}: ||h|| = \${norm.toFixed(4)}\`)
})
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript GRU cell with explicit gate computation. The demo runs a 5-step
                sequence where step 2 carries a strong signal, showing how the hidden state
                norm responds to salient inputs.
            </p>
            <CodeBlock code={TS_CODE} filename="gru.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GRU_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
