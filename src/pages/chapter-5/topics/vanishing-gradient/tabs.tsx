import { Analogy, CodeBlock, DefBlock, InlineMath } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Why RNNs forget: the mathematical inevitability of gradient decay</h2>
            <div className="ch-callout">
                <strong>Building on Ch. 4:</strong> Vanishing gradients in deep feedforward networks were introduced in Ch. 4. This topic covers the <em>same phenomenon as it specifically manifests in RNNs</em> — where sequence length, not layer count, determines depth. The problem is structurally identical but exponentially worse because the unrolled network can be hundreds of steps deep.
            </div>
            <p>
                The vanishing gradient problem is not a bug in any particular implementation — it is
                a mathematical consequence of how RNNs are structured. It was precisely identified and
                proven by Hochreiter in 1991, and later formalised by Bengio, Simard, and Frasconi
                (1994). Understanding it is essential for understanding why LSTMs and GRUs were
                necessary and why Transformers eventually replaced RNNs.
            </p>
            <h3>The Core Problem</h3>
            <p>
                When training an RNN via BPTT, the gradient of the loss with respect to an early
                time step must travel backwards through every intermediate time step. Each step
                multiplies by the Jacobian of the hidden state transition:
                <InlineMath tex="\frac{\partial h_{t+1}}{\partial h_t} = W_{hh}^\top \cdot \text{diag}(\sigma'(z_t))" />.
                When this product is repeatedly applied, gradients either explode or vanish — there
                is no stable middle ground for repeated matrix multiplication.
            </p>
            <h3>Why Sigmoid Makes It Worse</h3>
            <p>
                The sigmoid activation function has a maximum derivative of only 0.25 (at z = 0),
                and approaches 0 at both extremes. In a vanilla RNN with sigmoid activations,
                the effective multiplier at each step is bounded by 0.25 × ||W<sub>hh</sub>||.
                If ||W<sub>hh</sub>|| &lt; 4, gradients shrink by at least 75% per step. After
                20 steps, the signal is typically below machine precision.
            </p>
            <div className="ch-callout">
                <strong>Intuition:</strong> BPTT through T time steps is equivalent to training a
                T-layer feedforward network. Training very deep networks is hard (vanishing/exploding
                gradients were known problems in feedforward nets since the 1990s). RNNs are even
                harder because the depth grows with the sequence length — there's no limit to how
                deep the unrolled network can get.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why your RNN has the memory of a goldfish</h2>

            <Analogy label="The Whisper Game">
                Stand in a line of 20 kids. The first kid whispers a sentence to the second,
                the second to the third, and so on. By the time the 20th kid says it out loud,
                the message is barely recognisable — words got changed, dropped, or distorted.
                <br /><br />
                That's exactly what happens with gradients in a simple RNN: the error signal from
                the last step whispers back through each time step, and by the time it reaches the
                first step, it's barely a whisper. The network can't learn from what happened at
                the beginning of the sequence.
            </Analogy>

            <Analogy label="The Photo Copier with Faded Ink">
                Imagine you make a copy of a photo, then make a copy of that copy, then a copy of
                that copy... After 20 generations, the image is blurry and washed out — all the
                fine details are lost.
                <br /><br />
                In an RNN, the hidden state is copied from step to step. With each copy (the
                matrix multiplication at each time step), a little bit of information is lost or
                distorted. After enough steps, the original information is completely gone. The
                tanh squashes everything to [-1, 1], so details blur together.
            </Analogy>

            <Analogy label="LSTM to the Rescue">
                Instead of copying the photo and losing quality, the LSTM writes information into
                a special notebook (the cell state) that doesn't change when you read it. The
                notebook stays exactly the same — the information you wrote at step 1 is still
                there at step 100, unchanged. This is the constant error carousel: the gradient
                has a straight path back through time without being multiplied at every step.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Exponential gradient decay through repeated matrix multiplication</h2>

            <h3>The Intuition: What Repeated Multiplication Does to Numbers</h3>
            <p>
                Consider a simple scalar recurrence: a<sub>t+1</sub> = 0.5 × a<sub>t</sub>.
                Starting from a<sub>0</sub> = 1, after 10 steps: a<sub>10</sub> = 0.5<sup>10</sup> ≈ 0.001.
                After 20 steps: 0.5<sup>20</sup> ≈ 0.000001. The sequence "forgets" its starting value exponentially fast.
            </p>
            <p>
                RNNs do exactly this, but with matrices instead of scalars. The eigenvalues of
                W<sub>hh</sub> determine how fast information decays:
            </p>
            <ul>
                <li>If all eigenvalues |λ| &lt; 1: information decays to zero → <strong>vanishing gradient</strong></li>
                <li>If all eigenvalues |λ| &gt; 1: information grows without bound → <strong>exploding gradient</strong></li>
                <li>If eigenvalues straddle |λ| = 1: information neither decays nor grows (unstable)</li>
            </ul>

            <h3>Singular Value Decomposition</h3>
            <p>
                Any matrix W can be written as W = UΣV<sup>T</sup> (SVD), where Σ is diagonal with
                singular values σ<sub>1</sub> ≥ σ<sub>2</sub> ≥ ... ≥ σ<sub>n</sub> ≥ 0.
                The spectral norm ||W|| = σ<sub>1</sub>.
                When we multiply by W repeatedly: W<sup>k</sup> = UΣ<sup>k</sup>V<sup>T</sup>.
                If σ<sub>1</sub> &lt; 1, then σ<sub>1</sub><sup>k</sup> → 0 exponentially.
            </p>

            <h3>Empirical Evidence</h3>
            <p>
                Hochreiter (1991) trained RNNs on tasks requiring long-range dependencies:
            </p>
            <ul>
                <li>Add two randomly chosen integers (requires remembering the first number across the sequence)</li>
                <li>Count the number of 1s in a sequence with variable delay</li>
                <li>Context-sensitive grammar tasks (XOR patterns at arbitrary distances)</li>
            </ul>
            <p>
                Simple RNNs failed on all tasks where the required dependency was longer than
                ~7-10 steps, regardless of hidden layer size. The gradient magnitude at early
                time steps was measured to be 10<sup>-6</sup> to 10<sup>-12</sup> times smaller
                than gradients at later steps.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Real-world consequence:</strong> If you try to use a simple RNN to predict
                the next word in a long sentence, it will effectively only "remember" the last ~7-10
                words. This is why early RNN language models struggled with long-range dependencies
                like subject-verb agreement across clauses ("The cars that the woman who lives in
                the house bought...").
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal characterisation of the vanishing and exploding gradient</h2>

            <DefBlock label="RNN Hidden State Jacobian">
                The Jacobian matrix of the hidden state transition
                <InlineMath tex="h_t = \tanh(W_{hh}h_{t-1} + W_{xh}x_t + b)" />
                with respect to the previous hidden state is:
                <InlineMath tex="J_t = \frac{\partial h_t}{\partial h_{t-1}} = \text{diag}(\tanh'(z_t)) \cdot W_{hh}^\top" />.
                This is an n × n matrix (n = hidden dimension).
            </DefBlock>

            <h3>The Long-range Gradient</h3>
            <p>
                For the loss at time T and a parameter at time t, the gradient must travel
                through the product of T − t Jacobians:
                <InlineMath tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} J_i = \prod_{i=t+1}^{T} \text{diag}(\tanh'(z_i)) \cdot W_{hh}^\top" />.
            </p>

            <h3>Bound on the Gradient Norm</h3>
            <p>
                Since <InlineMath tex="0 &lt; \tanh'(z) \leq 1" />, we have
                <InlineMath tex="\|J_i\| \leq \|W_{hh}\|" />.
                Therefore:
                <InlineMath tex="\left\|\frac{\partial h_T}{\partial h_t}\right\| \leq \|W_{hh}\|^{T-t}" />.
                If <InlineMath tex="\|W_{hh}\| &lt; 1" />, the bound decays exponentially in the lag k = T − t.
            </p>

            <h3>Precise Eigenvalue Condition</h3>
            <p>
                Using SVD of W<sub>hh</sub> = UΣV<sup>T</sup>, we have
                <InlineMath tex="W_{hh}^k = U\Sigma^k V^\top" />.
                The largest singular value σ<sub>1</sub> = ||W<sub>hh</sub>|| determines the decay rate.
                If σ<sub>1</sub> &lt; 1, then:
                <InlineMath tex="\|W_{hh}^k\| \leq \sigma_1^k \to 0 \text{ exponentially as } k \to \infty" />.
            </p>

            <h3>The Sigmoid Makes It Even Worse</h3>
            <p>
                Sigmoid (σ) has <InlineMath tex="\sigma'(z) \leq 0.25" /> with equality only at z=0.
                At saturation (|z| → ∞), σ'(z) → 0. This means even if ||W<sub>hh</sub>|| = 4 (the
                maximum before explosion), the effective multiplier per step is at most 4 × 0.25 = 1.0.
                In practice, hidden units saturate, making the effective multiplier <InlineMath tex="\ll 1" />.
            </p>

            <h3>Consequences for Learning</h3>
            <p>
                The gradient of the loss with respect to a weight at time t is:
                <InlineMath tex="\frac{\partial \mathcal{L}}{\partial W_{hh}^{(t)}} = \delta_T \cdot \left(\prod_{i=t+1}^{T} J_i\right) \cdot h_{t-1}^\top" />.
                If <InlineMath tex="\left\|\prod_{i=t+1}^{T} J_i\right\| \approx 0" />, then
                <InlineMath tex="\frac{\partial \mathcal{L}}{\partial W_{hh}^{(t)}} \approx 0" />.
                The weight barely changes — the network cannot learn the long-range dependency.
            </p>

            <div className="ch-callout">
                <strong>Bengio et al. (1994)</strong> showed that the vanishing gradient problem
                is not specific to RNNs — it affects any deep network with shared weights across
                many layers. The fundamental fix requires either: (1) skip connections that bypass
                the multiplicative effect (ResNet, LSTM cell state), or (2) gating mechanisms that
                allow the network to choose when to preserve and when to discard information.
            </div>
        </>
    )
}

const PY_CODE = `# ── Demonstrating the Vanishing Gradient ──────────────────────────────────────
import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def tanh(z):
    return np.tanh(z)

def sigmoid_prime(z):
    s = sigmoid(z)
    return s * (1 - s)

# ── Experiment 1: Vanishing Gradient with Small W ─────────────────────────────
print("=" * 60)
print("Experiment 1: How gradients vanish with small W")
print("=" * 60)

def compute_gradient_product(W, n_steps, act='tanh', x0=0.5):
    """Simulate the effect of multiplying by J = diag(σ'(z)) * W^T at each step"""
    grad = np.eye(W.shape[0])   # Start with identity
    for _ in range(n_steps):
        # In practice, z varies, but for simplicity use constant activations
        # With tanh and typical z ≈ 0: tanh'(0) = 1
        if act == 'tanh':
            J = W.T   # worst case: tanh' = 1
        else:
            J = 0.25 * W.T  # worst case: sigmoid' = 0.25
        grad = J @ grad
    return grad

# Random weight matrix with spectral radius < 1
np.random.seed(42)
n = 10
W = np.random.randn(n, n) * 0.3   # Small entries → spectral radius < 1

for k in [1, 5, 10, 20, 50]:
    prod = compute_gradient_product(W, k, act='tanh')
    norm = np.linalg.norm(prod, ord=2)
    print(f"  After {k:3d} steps: gradient norm = {norm:.2e}")

print()
print("Observation: gradient norm decays exponentially with distance!")
print()

# ── Experiment 2: Spectral Radius Controls Decay/Growth ────────────────────────
print("=" * 60)
print("Experiment 2: Effect of spectral radius on gradient magnitude")
print("=" * 60)

for scale in [0.3, 0.5, 0.8, 1.0, 1.5]:
    W_s = np.random.randn(n, n) * scale
    spec_rad = max(np.abs(np.linalg.eigvals(W_s)))
    prod = compute_gradient_product(W_s, 20, act='tanh')
    norm = np.linalg.norm(prod, ord=2)
    status = "VANISHING" if norm < 1e-6 else "OK" if norm < 1e3 else "EXPLODING"
    print(f"  Scale={scale:.1f}, spectral_radius={spec_rad:.2f}, norm@20={norm:.2e} → {status}")

print()
print("Key insight: spectral radius < 1 → vanishing, > 1 → exploding!")
print("There is no stable middle ground for unconstrained W.")

# ── Experiment 3: LSTM cell state has NO vanishing ──────────────────────────────
print()
print("=" * 60)
print("Experiment 3: LSTM constant error carousel")
print("=" * 60)

# LSTM cell state: c_t = f_t * c_{t-1} + i_t * c_tilde
# If f_t=1.0, i_t=0.0 → c_t = c_{t-1} → gradient = 1 at every step
print("LSTM cell state: c_t = f_t * c_{t-1} + i_t * c_tilde")
print("If f_t=1.0, i_t=0.0:")
print("  → c_10 = c_0 (no decay!)")
print("  → ∂c_10/∂c_0 = 1.0 (gradient = 1 always!)")
print()
print("This is why LSTM can learn dependencies of arbitrary length:")
print("gradients flow through the cell state unchanged (weight = 1.0 by design)")`

function PythonTab() {
    return (
        <>
            <p>
                Three experiments demonstrating the vanishing gradient problem empirically:
                (1) exponential decay of gradient norm with distance, (2) the effect of spectral
                radius on gradient behaviour, and (3) why LSTM's cell state eliminates vanishing.
            </p>
            <CodeBlock code={PY_CODE} filename="vanishing_gradient.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Vanishing Gradient Experiments in TypeScript ────────────────────────────

/** Multiply two n×n matrices */
function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length
  const C: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        C[i][j] += A[i][k] * B[k][j]
  return C
}

/** Spectral radius = largest absolute eigenvalue (power iteration) */
function spectralRadius(W: number[][], steps = 100): number {
  const n = W.length
  let v = new Array(n).fill(1 / Math.sqrt(n))  // unit vector
  for (let i = 0; i < steps; i++) {
    // wv = W @ v
    const wv = W.map(row => row.reduce((s, wij, j) => s + wij * v[j], 0))
    const norm = Math.sqrt(wv.reduce((s, vi) => s + vi * vi, 0))
    v = wv.map(vi => vi / norm)
  }
  const wv = W.map(row => row.reduce((s, wij, j) => s + wij * v[j], 0))
  return Math.sqrt(wv.reduce((s, vi, i) => s + vi * v[i], 0))
}

/** Compute the norm of the product of k Jacobian matrices */
function jacobianProductNorm(W: number[][], k: number): number {
  // Simplified: J = W^T (tanh' ≈ 1 near origin)
  const JT = W[0].map((_, i) => W.map(row => row[i]))
  let P = JT  // Start with J
  for (let i = 1; i < k; i++) {
    P = matMul(JT, P)
  }
  // Return spectral norm of P (approximated by largest singular value)
  return spectralRadius(P)
}

// ── Experiment 1: Vanishing with distance ─────────────────────────────────────
console.log("Experiment 1: Gradient norm decays with lag k")
console.log("─".repeat(50))

const n = 8
// Random W with spectral radius < 1
const W = Array.from({ length: n }, () =>
  Array.from({ length: n }, () => (Math.random() - 0.5) * 0.6))

const sr = spectralRadius(W)
console.log(\`W spectral radius: \${sr.toFixed(3)}\`)
for (const k of [1, 5, 10, 20, 50]) {
  const norm = jacobianProductNorm(W, k)
  console.log(\`  k=\${k.toString().padStart(2)}: ‖∂hₜ₊ₖ/∂hₜ‖ = \${norm.toExponential(3)}\`)
}

console.log()
console.log("Result: norm decays exponentially with k!")
console.log()

// ── Experiment 2: Spectral radius determines fate ───────────────────────────────
console.log("Experiment 2: Spectral radius controls gradient behavior")
console.log("─".repeat(50))

for (const scale of [0.3, 0.6, 0.9, 1.1, 1.5]) {
  const Ws = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => (Math.random() - 0.5) * scale))
  const sr2 = spectralRadius(Ws)
  const norm20 = jacobianProductNorm(Ws, 20)
  const label = norm20 < 1e-6 ? "VANISH" : norm20 > 1e3 ? "EXPLODE" : "OK"
  console.log(\`scale=\${scale}: ρ(W)=\${sr2.toFixed(3)}, ‖J²⁰‖=\${norm20.toExponential(3)} → \${label}\`)
}

console.log()
console.log("Conclusion: ρ(W) < 1 → vanish; ρ(W) > 1 → explode")
console.log()

// ── Experiment 3: LSTM constant error carousel ────────────────────────────────
console.log("Experiment 3: LSTM constant error carousel")
console.log("─".repeat(50))
console.log("LSTM cell state: c_t = f·c_{t-1} + i·c̃")
console.log("If f=1, i=0:")
console.log("  c_10 = c_0")
console.log("  ∂c_10/∂c_0 = 1.0 (gradient = 1.0, no vanishing!)")
console.log()
console.log("This is the key innovation: a linear path (weight=1) through time")
console.log("bypasses the multiplicative dynamics that cause vanishing gradients.");`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript experiments demonstrating vanishing gradients empirically: computing
                gradient norm decay with lag k, the effect of spectral radius on gradient
                behaviour, and confirming that the LSTM cell state's linear self-loop
                produces a constant gradient of 1.0.
            </p>
            <CodeBlock code={TS_CODE} filename="vanishing_gradient.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Historical note:</strong> Hochreiter's 1991 identification of the vanishing
                gradient was remarkable because he diagnosed the problem mathematically before
                building a solution. The LSTM was designed specifically to address each mathematical
                failure mode he identified. This is a template for good engineering: understand the
                root cause precisely, then design to fix it.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const VANISHING_GRADIENT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
