import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>A leaner solution to the same problem</h2>
            <p>
                The Gated Recurrent Unit (GRU) was introduced by Kyunghyun Cho and colleagues in 2014
                as part of their landmark sequence-to-sequence paper "Learning Phrase Representations
                using RNN Encoder–Decoder for Statistical Machine Translation." It was not the main
                subject of that paper — but it became one of the most influential side contributions
                in deep learning history.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1997</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">LSTM (Hochreiter & Schmidhuber)</div>
                    <div className="ch-tl-body">
                        The Long Short-Term Memory architecture introduced gating as a solution to
                        vanishing gradients. Three gates (forget, input, output) plus a separate cell
                        state gave the network explicit memory control — powerful, but with 4× the
                        parameters of a simple RNN.
                    </div>
                    <div className="ch-tl-impact">Impact: Solved vanishing gradients; became the dominant RNN</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">GRU introduced — Cho et al. (2014)</div>
                    <div className="ch-tl-body">
                        Cho et al. proposed the GRU as a simpler alternative: merge the forget and input
                        gates into a single <em>update gate</em>, and add a <em>reset gate</em> to
                        control how much past hidden state to use when computing the candidate. The cell
                        state is eliminated — the hidden state carries everything. Result: fewer parameters,
                        similar expressive power, faster training.
                    </div>
                    <div className="ch-tl-impact">Impact: GRU vs LSTM became a celebrated open question in the field</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014–2015</div>
                    <div className="ch-tl-section-label">Empirical Evaluation</div>
                    <div className="ch-tl-title">Performance parity — Chung et al. (2014)</div>
                    <div className="ch-tl-body">
                        Junyoung Chung et al. published "Empirical Evaluation of Gated Recurrent Neural
                        Networks on Sequence Modeling," directly comparing GRU and LSTM on music modeling
                        and speech signal tasks. Their conclusion: neither clearly wins — GRU slightly
                        faster, LSTM slightly better on some tasks. The choice became problem-dependent.
                    </div>
                    <div className="ch-tl-impact">Impact: Legitimized GRU as a first-class alternative to LSTM</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">GRU in the Transformer era</div>
                    <div className="ch-tl-body">
                        Even as Transformers displaced LSTMs and GRUs for language modeling, GRUs
                        remain the preferred RNN in settings with limited compute budgets — embedded
                        devices, streaming applications, time series forecasting, and audio processing.
                        Modern SSM architectures (like Mamba) explicitly draw on GRU's gating intuition.
                    </div>
                    <div className="ch-tl-impact">Impact: Lighter RNN of choice for resource-constrained applications</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Key insight:</strong> The GRU's contribution was not discovering something
                new, but proving that LSTM's three-gate design could be compressed into two gates
                without meaningful loss of performance. It established a crucial principle: the gating
                mechanism matters more than the exact number of gates.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The streamlined version of the memory robot</h2>

            <Analogy label="Two Controls Instead of Three">
                Remember how LSTM has three levers — forget, input, and output? GRU says: "What if
                we could do the same job with just two levers?"
                <br /><br />
                The <strong>update gate</strong> does two things at once: it decides how much to
                forget <em>and</em> how much new information to add. It's like a single slider
                that goes from "keep everything old" to "replace everything with new."
                <br /><br />
                The <strong>reset gate</strong> decides how much of the past to look at when
                computing the new candidate. If it's fully closed, the candidate is computed purely
                from the current input — as if the past never happened.
            </Analogy>

            <Analogy label="The Update Gate — A Balance Slider">
                Imagine a DJ mixing two tracks. The update gate z is the crossfader:
                <ul style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li><strong>z = 0</strong>: Play only the old track (keep previous hidden state exactly)</li>
                    <li><strong>z = 1</strong>: Play only the new track (completely replace with candidate)</li>
                    <li><strong>z = 0.5</strong>: Mix both equally</li>
                </ul>
                The network <em>learns</em> the right crossfader position for every situation.
                This single gate replaces both the forget gate and input gate from LSTM.
            </Analogy>

            <Analogy label="GRU vs LSTM — Which Is Better?">
                Scientists ran experiments comparing both architectures. The surprising result? It
                depends on the problem. For short sequences, GRU often wins because it's faster
                to train. For very long sequences with complex dependencies, LSTM sometimes wins
                because it has more flexibility.
                <br /><br />
                In practice, deep learning engineers often try both and pick whichever works better
                on their specific data. The best way to think about it: GRU is LSTM's more
                efficient sibling — lighter, faster, similarly capable.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Two gates, one hidden state, full memory control</h2>

            <h3>The Core Idea: Merge Forget and Input Gates</h3>
            <p>
                LSTM maintains a separate cell state C<sub>t</sub> alongside hidden state h<sub>t</sub>.
                GRU eliminates the cell state and folds its role into the hidden state, controlled
                by just two gates: <strong>reset</strong> and <strong>update</strong>.
            </p>

            <h3>Step 1 — Reset Gate</h3>
            <p>
                The reset gate r<sub>t</sub> controls how much of the previous hidden state to use
                when computing the candidate activation:
            </p>
            <MathBlock tex="r_t = \sigma(W_r [h_{t-1},\, x_t] + b_r)" />
            <p>
                When r<sub>t</sub> ≈ 0, the previous hidden state is ignored — the candidate is
                computed purely from the current input. When r<sub>t</sub> ≈ 1, the full previous
                hidden state is used (same as a standard RNN).
            </p>

            <h3>Step 2 — Update Gate</h3>
            <p>
                The update gate z<sub>t</sub> controls how much the hidden state should change:
            </p>
            <MathBlock tex="z_t = \sigma(W_z [h_{t-1},\, x_t] + b_z)" />

            <h3>Step 3 — Candidate Hidden State</h3>
            <p>
                The candidate h̃<sub>t</sub> is computed using the reset-gated previous hidden state:
            </p>
            <MathBlock tex="\tilde{h}_t = \tanh\!\left(W [r_t \odot h_{t-1},\, x_t] + b\right)" />
            <p>
                The element-wise product r<sub>t</sub> ⊙ h<sub>t-1</sub> selectively forgets parts of
                the past before computing the candidate.
            </p>

            <h3>Step 4 — Final Hidden State (The Interpolation)</h3>
            <MathBlock tex="h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t" />
            <p>
                This is the key equation. The update gate z<sub>t</sub> linearly interpolates between:
            </p>
            <ul>
                <li><strong>(1 − z<sub>t</sub>) ⊙ h<sub>t-1</sub></strong>: keep the previous state (like a forget gate keeping old memory)</li>
                <li><strong>z<sub>t</sub> ⊙ h̃<sub>t</sub></strong>: write the candidate (like an input gate adding new memory)</li>
            </ul>

            <hr className="ch-sep" />

            <h3>GRU vs LSTM: What's Missing?</h3>
            <ul>
                <li>No separate cell state C<sub>t</sub> — hidden state serves both roles</li>
                <li>No output gate — the full hidden state h<sub>t</sub> is always exposed</li>
                <li>Two gates instead of three → fewer parameters, faster to train</li>
            </ul>

            <div className="ch-callout">
                <strong>Why interpolation prevents vanishing gradients:</strong> When z<sub>t</sub> ≈ 0,
                h<sub>t</sub> ≈ h<sub>t-1</sub> exactly. The gradient ∂h<sub>t</sub>/∂h<sub>t-1</sub>
                ≈ 1. This is the same constant-error-carousel intuition from LSTM: the network learns
                to set z ≈ 0 at steps where memory should be preserved, keeping gradients from vanishing.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal equations, parameter count, and gradient analysis</h2>

            <DefBlock label="GRU Cell Equations (Cho et al., 2014)">
                Given input x<sub>t</sub> ∈ ℝ<sup>d</sup> and previous hidden state h<sub>t-1</sub> ∈ ℝ<sup>n</sup>:
                <br /><br />
                Reset gate: h<sub>t-1</sub> reset =  r<sub>t</sub> ⊙ h<sub>t-1</sub>
                <br />
                where r<sub>t</sub> = σ(W<sub>r</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>r</sub>) ∈ [0,1]<sup>n</sup>
                <br /><br />
                Update gate: z<sub>t</sub> = σ(W<sub>z</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>z</sub>) ∈ [0,1]<sup>n</sup>
                <br /><br />
                Candidate: h̃<sub>t</sub> = tanh(W[r<sub>t</sub> ⊙ h<sub>t-1</sub>, x<sub>t</sub>] + b) ∈ [-1,1]<sup>n</sup>
                <br /><br />
                Hidden state: h<sub>t</sub> = (1 − z<sub>t</sub>) ⊙ h<sub>t-1</sub> + z<sub>t</sub> ⊙ h̃<sub>t</sub>
            </DefBlock>

            <h3>Parameter Count Comparison</h3>
            <p>
                Let d = input dimension, n = hidden dimension. Weights [h<sub>t-1</sub>, x<sub>t</sub>]
                concatenate to form a vector of size (n + d).
            </p>
            <MathBlock tex="\begin{array}{lll} \textbf{Model} & \textbf{Weight matrices} & \textbf{Total params} \\ \hline \text{Simple RNN} & W_{hh} + W_{xh} + b & n^2 + nd + n \\ \text{GRU} & 3 \times (n(n+d) + n) & 3n^2 + 3nd + 3n \\ \text{LSTM} & 4 \times (n(n+d) + n) & 4n^2 + 4nd + 4n \\ \end{array}" />
            <p>
                GRU has 75% of LSTM's parameter count. For n = 512: GRU saves ~800K parameters per layer.
            </p>

            <h3>Gradient Flow Through the Update Gate</h3>
            <p>
                The critical gradient: ∂h<sub>t</sub>/∂h<sub>t-1</sub>. Differentiating the interpolation:
            </p>
            <MathBlock tex="\frac{\partial h_t}{\partial h_{t-1}} = \text{diag}(1 - z_t) + \text{diag}(z_t) \frac{\partial \tilde{h}_t}{\partial h_{t-1}} + \frac{\partial z_t}{\partial h_{t-1}}(\tilde{h}_t - h_{t-1})^\top" />
            <p>
                The dominant term when z<sub>t</sub> ≈ 0:
            </p>
            <MathBlock tex="\frac{\partial h_t}{\partial h_{t-1}} \approx \text{diag}(1 - z_t) \approx I" />
            <p>
                This is the GRU's constant error carousel. The gradient is exactly 1 when the network
                decides not to update (z<sub>t</sub> = 0), preserving information arbitrarily far back.
            </p>

            <h3>Limiting Cases of the Update Gate</h3>
            <MathBlock tex="\begin{aligned} z_t = 0 &\implies h_t = h_{t-1} \quad \text{(perfect copy, gradient = 1)} \\ z_t = 1 &\implies h_t = \tilde{h}_t \quad \text{(full replacement, gradient = 0 w.r.t. } h_{t-1}\text{)} \end{aligned}" />
            <p>
                The network learns these extremes: z ≈ 0 at irrelevant timesteps (preserve state),
                z ≈ 1 at important events (update state from input).
            </p>

            <h3>Reset Gate Role: Selective Context</h3>
            <MathBlock tex="r_t \approx 0 \implies \tilde{h}_t \approx \tanh(W_x x_t + b) \quad \text{(ignore past)}" />
            <MathBlock tex="r_t \approx 1 \implies \tilde{h}_t \approx \tanh(W[h_{t-1}, x_t] + b) \quad \text{(standard RNN candidate)}" />
            <p>
                The reset gate makes the GRU capable of learning short-range patterns (r ≈ 0)
                and long-range dependencies (r ≈ 1) within the same network.
            </p>

            <div className="ch-callout">
                <strong>LSTM vs GRU theoretical guarantee:</strong> Both architectures provably
                solve the vanishing gradient problem through gating. The key difference is that LSTM's
                separate cell state gives it an additional "write" pathway independent of the hidden
                state, which in theory enables richer memory structures. GRU unifies these into one
                pathway with fewer parameters but potentially less representational capacity for
                extremely long sequences.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import numpy as np

# ── Manual GRU cell (NumPy) ───────────────────────────────────────────────────

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def gru_cell_numpy(x_t, h_prev, Wr, Wz, W, br, bz, b):
    """
    Manual GRU cell forward pass.
    x_t:   (input_dim,)
    h_prev: (hidden_dim,)
    Wr, Wz, W: (hidden_dim, input_dim + hidden_dim)
    """
    xh = np.concatenate([h_prev, x_t])   # concatenate input and hidden

    r = sigmoid(Wr @ xh + br)            # reset gate
    z = sigmoid(Wz @ xh + bz)            # update gate

    xh_reset = np.concatenate([r * h_prev, x_t])
    h_tilde = np.tanh(W @ xh_reset + b)  # candidate hidden state

    h = (1 - z) * h_prev + z * h_tilde   # interpolation
    return h

# ── PyTorch comparison: nn.GRU vs nn.LSTM ────────────────────────────────────

batch_size  = 4
seq_len     = 20
input_dim   = 16
hidden_dim  = 32

x = torch.randn(seq_len, batch_size, input_dim)

# GRU
gru  = nn.GRU(input_dim, hidden_dim, batch_first=False)
lstm = nn.LSTM(input_dim, hidden_dim, batch_first=False)

gru_params  = sum(p.numel() for p in gru.parameters())
lstm_params = sum(p.numel() for p in lstm.parameters())

print("=" * 60)
print("GRU vs LSTM — Parameter Count Comparison")
print("=" * 60)
print(f"Input dim:   {input_dim}, Hidden dim: {hidden_dim}")
print(f"GRU params:  {gru_params:,}  (3 gate matrices)")
print(f"LSTM params: {lstm_params:,}  (4 gate matrices)")
print(f"GRU / LSTM:  {gru_params / lstm_params:.2f}  (GRU is 75% of LSTM size)")
print()

# Forward pass timing comparison
import time

gru_out,  gru_hn          = gru(x)
lstm_out, (lstm_hn, lstm_cn) = lstm(x)

print(f"GRU  output shape: {gru_out.shape}")   # (seq_len, batch, hidden)
print(f"LSTM output shape: {lstm_out.shape}")   # (seq_len, batch, hidden)
print()

# ── GRU update gate demonstration ─────────────────────────────────────────────
# Show z_t interpolation: z≈0 → keep h_prev; z≈1 → use candidate

print("Update gate interpolation demo:")
print("-" * 40)
h_prev   = torch.ones(hidden_dim) * 0.9    # strong existing memory
h_tilde  = torch.zeros(hidden_dim)          # new candidate is zero (no new info)

for z_val in [0.0, 0.1, 0.5, 0.9, 1.0]:
    z = torch.full((hidden_dim,), z_val)
    h_new = (1 - z) * h_prev + z * h_tilde
    print(f"  z={z_val:.1f}: h_new[0] = {h_new[0].item():.3f}  "
          f"({'preserves memory' if z_val < 0.3 else 'discards memory' if z_val > 0.7 else 'mixes'})")
`

function PythonTab() {
    return (
        <>
            <p>
                Manual NumPy GRU cell implementation followed by a PyTorch comparison of
                <code>nn.GRU</code> vs <code>nn.LSTM</code> — demonstrating the parameter
                count difference and showing the update gate interpolation behavior explicitly.
            </p>
            <CodeBlock code={PY_CODE} filename="gru_pytorch.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Manual GRU Cell — TypeScript ─────────────────────────────────────────────

type Vec = number[]
type Mat = number[][]

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))))
}

function matVec(W: Mat, x: Vec): Vec {
  return W.map(row => row.reduce((s, w, j) => s + w * x[j], 0))
}

function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v + b[i])
}

function concat(a: Vec, b: Vec): Vec {
  return [...a, ...b]
}

// ── GRU Cell ─────────────────────────────────────────────────────────────────
interface GRUWeights {
  Wr: Mat; Wz: Mat; W: Mat   // (hidden_dim × [hidden_dim + input_dim])
  br: Vec; bz: Vec; b: Vec   // (hidden_dim,)
}

function gruCell(xT: Vec, hPrev: Vec, weights: GRUWeights): Vec {
  const { Wr, Wz, W, br, bz, b } = weights

  // Concatenate [h_prev, x_t] for reset and update gates
  const xh = concat(hPrev, xT)

  // Reset gate: r = σ(W_r · [h_{t-1}, x_t] + b_r)
  const r = vecAdd(matVec(Wr, xh), br).map(sigmoid)

  // Update gate: z = σ(W_z · [h_{t-1}, x_t] + b_z)
  const z = vecAdd(matVec(Wz, xh), bz).map(sigmoid)

  // Candidate: h̃ = tanh(W · [r ⊙ h_{t-1}, x_t] + b)
  const rHPrev = hPrev.map((h, i) => r[i] * h)          // reset-gated past
  const xhReset = concat(rHPrev, xT)
  const hTilde = vecAdd(matVec(W, xhReset), b).map(Math.tanh)

  // Interpolation: h_t = (1-z) ⊙ h_{t-1} + z ⊙ h̃_t
  const h = z.map((zi, i) => (1 - zi) * hPrev[i] + zi * hTilde[i])

  return h
}

// ── Sequence Forward Pass ─────────────────────────────────────────────────────
function gruForward(X: Vec[], weights: GRUWeights, h0?: Vec): Vec[] {
  const hiddenDim = weights.br.length
  let h = h0 ?? new Array(hiddenDim).fill(0)
  const outputs: Vec[] = []

  for (const xT of X) {
    h = gruCell(xT, h, weights)
    outputs.push(h)
  }
  return outputs
}

// ── Update gate demo: z controls interpolation ────────────────────────────────
console.log("GRU Update Gate — Interpolation Demo")
console.log("─".repeat(50))

const hPrev = new Array(4).fill(0.9)          // strong existing memory
const hTilde = new Array(4).fill(0.0)          // candidate = zero

for (const zVal of [0.0, 0.1, 0.5, 0.9, 1.0]) {
  const hNew = hPrev.map((h, i) => (1 - zVal) * h + zVal * hTilde[i])
  const label = zVal < 0.3 ? "preserves past" : zVal > 0.7 ? "replaces with candidate" : "mixes both"
  console.log(\`z=\${zVal.toFixed(1)}: h_new[0]=\${hNew[0].toFixed(3)} (\${label})\`)
}

console.log()
console.log("Key: the network learns z values from data.")
console.log("z≈0 at timesteps where memory should persist.")
console.log("z≈1 at timesteps with important new information.")
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of the complete GRU cell forward pass and sequence
                forward pass. The demo explicitly shows how the update gate interpolates between
                preserving the previous hidden state and updating with the candidate.
            </p>
            <CodeBlock code={TS_CODE} filename="gru_cell.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Implementation note:</strong> In PyTorch's <code>nn.GRU</code>, the weight
                matrices W<sub>r</sub>, W<sub>z</sub>, and W are packed into two fused matrices
                (one for the input, one for the hidden state) for efficient BLAS operations.
                The computation is mathematically identical to the cell-by-cell formulation above.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GRU_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
