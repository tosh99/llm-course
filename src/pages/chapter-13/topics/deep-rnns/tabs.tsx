import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Depth in the time domain</h2>
            <p>
                Deep learning's success in computer vision came from stacking many convolutional
                layers to build hierarchical features. The natural question arose: can we do the
                same with recurrent networks? The answer is yes — but stacking RNNs introduces
                unique challenges because depth operates across two dimensions: time (sequence
                length) and layer (stacked depth).
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Pascanu, Mikolov, Bengio — On the Difficulty of Training RNNs</div>
                    <div className="ch-tl-body">
                        Razvan Pascanu and colleagues analyzed why deep RNNs are harder to train
                        than deep feedforward networks. They identified two distinct sources of
                        gradient difficulty: the <em>temporal</em> explosion/vanishing across time
                        steps (solved by LSTM/GRU gating) and the <em>spatial</em> vanishing across
                        stacked layers. They proposed gradient clipping as a partial remedy and
                        suggested that depth beyond 3–4 recurrent layers yielded diminishing returns
                        without careful initialization.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that deep RNN training requires different techniques than deep CNNs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Architecture</div>
                    <div className="ch-tl-title">Deep Speech — 5+ Layer Bidirectional RNNs</div>
                    <div className="ch-tl-body">
                        Baidu's Deep Speech system (Hannun et al., 2014) used a 5-layer bidirectional
                        RNN with clipped ReLU activations for end-to-end speech recognition. This was
                        one of the first production systems to demonstrate that very deep recurrent
                        stacks could work at scale — but only with aggressive gradient clipping,
                        Batch Normalization (later), and massive datasets.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved deep RNNs are viable for industrial speech recognition</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Regularization</div>
                    <div className="ch-tl-title">Recurrent Batch Normalization &amp; Variational Dropout</div>
                    <div className="ch-tl-body">
                        Cooijmans et al. (2016) introduced Batch Normalization for RNNs by
                        normalizing the pre-activations at each time step, using separate statistics
                        per time step during training. Gal and Ghahramani (2015) proposed
                        <em> variational dropout</em> — applying the same dropout mask across all
                        time steps for a given sample, preserving the recurrent signal while
                        regularizing the feedforward connections. Both techniques made 4–6 layer
                        RNNs trainable where they had previously exploded or collapsed.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled reliable training of deep recurrent stacks up to 6–8 layers</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 – 2017</div>
                    <div className="ch-tl-section-label">Limit</div>
                    <div className="ch-tl-title">The 4-Layer Ceiling and the Rise of Attention</div>
                    <div className="ch-tl-body">
                        Empirically, the NLP community discovered a ceiling: RNNs rarely benefited
                        from more than 4 recurrent layers, even with all regularization tricks.
                        The representational bottleneck shifted from depth to breadth — wider hidden
                        states and attention mechanisms provided more gains than deeper stacks.
                        Google's Neural Machine Translation (Wu et al., 2016) used 8 layers but
                        only the bottom layer was recurrent; upper layers were purely feedforward.
                        This hybrid approach acknowledged that pure depth in recurrence was
                        fundamentally limited.
                    </div>
                    <div className="ch-tl-impact">Impact: Led to hybrid architectures and eventually the Transformer, which separates depth from recurrence</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Key insight:</strong> In CNNs, depth creates spatial hierarchies
                (edges → textures → objects). In RNNs, depth creates <em>temporal</em> hierarchies
                (phonemes → syllables → words → phrases). But because each layer must wait for
                the layer below at every time step, deep RNNs are exponentially slower to train
                than equally deep CNNs.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A tower of whispering rows</h2>

            <Analogy label="One Row (Single-Layer RNN)">
                Imagine a single row of 50 people. The first person reads a word, thinks about it,
                whispers a summary to the next person, who whispers to the next, and so on. By
                person 50, the summary has been passed through 50 minds. This is a single-layer
                RNN — one chain of thought running through time.
            </Analogy>

            <Analogy label="Two Rows (2-Layer Deep RNN)">
                Now add a second row of 50 people standing behind the first row. Each person in
                the back row listens to the whisper from the person directly in front of them
                (same time step, lower layer), thinks about it, and whispers to their neighbor
                in the back row (next time step, same layer).
                <br /><br />
                The front row learns simple patterns: "this word is a verb." The back row learns
                complex patterns built from the front row: "this verb follows a subject, so we're
                in a complete sentence." Each row sees the sequence at a different level of
                abstraction.
            </Analogy>

            <Analogy label="Why Too Many Rows Breaks">
                Adding a third, fourth, or fifth row sounds good, but there's a problem. By the
                time the whisper reaches the fifth row, it has been passed through so many minds
                that small errors have compounded into nonsense. It's like the telephone game:
                after 5 rows × 50 people, the original message is completely garbled. This is
                why deep RNNs are harder to train than deep CNNs — the telephone game runs both
                across time <em>and</em> across layers.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Stacking RNNs and the hierarchy of time</h2>

            <h3>Architecture</h3>
            <p>
                A deep RNN stacks L recurrent layers. The output of layer ℓ at time t becomes the
                input to layer ℓ+1 at the same time t. Each layer has its own recurrence across
                time, creating a grid of computation:
            </p>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = f\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right)" />
            <p>
                where h<sub>t</sub><sup>(0)</sup> = x<sub>t</sub> (the input) and h<sub>t</sub><sup>(ℓ)</sup>
                is the hidden state of layer ℓ at time t.
            </p>

            <h3>Temporal Hierarchies</h3>
            <p>
                Lower layers tend to capture short-range patterns (individual characters, phonemes,
                word fragments). Higher layers capture longer-range patterns (morphemes, words,
                phrases) because they receive pre-processed representations from below. This is
                analogous to how early CNN layers detect edges and late layers detect objects.
            </p>

            <h3>Training Challenges</h3>
            <ul>
                <li><strong>Gradient explosion through depth:</strong> Each layer multiplies gradients by U<sup>(ℓ)</sup>. With 4 layers, the Jacobian involves 4 matrix products, amplifying any eigenvalue &gt; 1.</li>
                <li><strong>Temporal + spatial compounding:</strong> A gradient flowing from layer 4 at time T back to layer 1 at time 1 passes through T×4 matrix multiplications — far more than in a feedforward network of equal depth.</li>
                <li><strong>Slow training:</strong> Layer ℓ cannot compute h<sub>t</sub><sup>(ℓ)</sup> until layer ℓ−1 has computed h<sub>t</sub><sup>(ℓ−1)</sup>, creating a sequential dependency across layers at each step.</li>
            </ul>

            <h3>Mitigations</h3>
            <ul>
                <li><strong>Gradient clipping:</strong> Cap the norm of gradients before the update step (Pascanu et al., 2013)</li>
                <li><strong>Recurrent batch normalization:</strong> Normalize pre-activations per time step (Cooijmans et al., 2016)</li>
                <li><strong>Residual connections:</strong> h<sub>t</sub><sup>(ℓ)</sup> = f(…) + h<sub>t</sub><sup>(ℓ−1)</sup> or h<sub>t</sub><sup>(ℓ)</sup> = f(…) + h<sub>t−1</sub><sup>(ℓ)</sup></li>
                <li><strong>Highway connections:</strong> Learnable gating between layer input and output (Zhang et al., 2016)</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Practical rule of thumb:</strong> Start with 1–2 recurrent layers. Add a
                third only if validation loss clearly improves. More than 4 pure recurrent layers
                rarely help and often hurt due to training instability. If you need more capacity,
                increase hidden size or add feedforward layers on top.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal definition and gradient analysis through depth</h2>

            <DefBlock label="Deep RNN — Formal Specification">
                L layers. Layer ℓ hidden state h<sub>t</sub><sup>(ℓ)</sup> ∈ ℝ<sup>nℓ</sup>.
                Parameters per layer: W<sup>(ℓ)</sup> ∈ ℝ<sup>nℓ×nℓ−1</sup>, U<sup>(ℓ)</sup> ∈ ℝ<sup>nℓ×nℓ</sup>,
                b<sup>(ℓ)</sup> ∈ ℝ<sup>nℓ</sup>. Input: h<sub>t</sub><sup>(0)</sup> = x<sub>t</sub> ∈ ℝ<sup>d</sup>.
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = \sigma\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right) \qquad \ell = 1, \dots, L" />

            <h3>Gradient Through Depth and Time</h3>
            <p>
                Consider the gradient of the loss at time T with respect to parameters in layer 1.
                It must flow backward through all L layers and all T time steps. Define the local
                Jacobian at layer ℓ, time t:
            </p>
            <MathBlock tex="\mathbf{J}_t^{(\ell)} = \text{diag}\bigl(\sigma'(\mathbf{z}_t^{(\ell)})\bigr) \mathbf{U}^{(\ell)}" />
            <p>
                where z<sub>t</sub><sup>(ℓ)</sup> = W<sup>(ℓ)</sup>h<sub>t</sub><sup>(ℓ−1)</sup> + U<sup>(ℓ)</sup>h<sub>t−1</sub><sup>(ℓ)</sup> + b<sup>(ℓ)</sup>.
                The full gradient from layer L at time T back to layer 1 at time 1 involves a
                product of LT such matrices:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_1^{(1)}} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_T^{(L)}} \cdot \prod_{t=T}^{2} \mathbf{J}_t^{(L)} \cdots \prod_{t=T}^{2} \mathbf{J}_t^{(1)}" />
            <p>
                If the spectral radius ρ(J) &gt; 1, this product explodes exponentially in LT.
                If ρ(J) &lt; 1, it vanishes. Even with LSTM gating (which bounds the product across
                time within each layer), the product <em>across layers</em> can still explode or
                vanish because each layer has independent recurrent weights.
            </p>

            <h3>Residual Connections in Deep RNNs</h3>
            <p>
                Adding residual connections between layers changes the gradient path:
            </p>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = \sigma\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right) + \mathbf{h}_t^{(\ell-1)}" />
            <p>
                The Jacobian now includes an identity shortcut:
            </p>
            <MathBlock tex="\frac{\partial \mathbf{h}_t^{(\ell)}}{\partial \mathbf{h}_t^{(\ell-1)}} = \mathbf{J}_t^{(\ell)} \frac{\partial \mathbf{h}_t^{(\ell-1)}}{\partial \mathbf{h}_t^{(\ell-1)}} + \mathbf{I} = \mathbf{J}_t^{(\ell)} \mathbf{K} + \mathbf{I}" />
            <p>
                This guarantees that even if J<sub>t</sub><sup>(ℓ)</sup> shrinks to near-zero, the
                identity term preserves gradient magnitude. Residual deep RNNs can therefore be
                trained with 6–8 layers, whereas plain deep RNNs struggle beyond 3.
            </p>

            <div className="ch-callout">
                <strong>Why Transformers replaced deep RNNs:</strong> In a Transformer, depth is
                purely feedforward across layers, while time-dependence is handled by self-attention
                (a single large matrix operation). There is no recurrent matrix product across time,
                so gradient flow is O(1) per layer rather than O(T). This is why Transformers can
                be trained with 24, 48, or even 96 layers — something impossible for pure RNNs.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Deep RNN — NumPy ──────────────────────────────────────────────────────────
class DeepRNN:
    """L-layer stacked RNN with tanh and optional residual connections."""
    def __init__(self, input_dim, hidden_dims, residual=False, seed=42):
        rng = np.random.default_rng(seed)
        self.layers = len(hidden_dims)
        self.residual = residual
        dims = [input_dim] + list(hidden_dims)
        self.params = []
        for i in range(self.layers):
            self.params.append({
                'W': rng.normal(0, 0.01, (dims[i+1], dims[i])),
                'U': rng.normal(0, 0.01, (dims[i+1], dims[i+1])),
                'b': np.zeros(dims[i+1]),
            })
        self.dims = dims

    def forward(self, X):
        """X: (T, input_dim) → list of H arrays, one per layer"""
        T = X.shape[0]
        H_all = []
        h_prev_layer = X
        for l in range(self.layers):
            H = np.zeros((T, self.dims[l+1]))
            h = np.zeros(self.dims[l+1])
            p = self.params[l]
            for t in range(T):
                z = p['W'] @ h_prev_layer[t] + p['U'] @ h + p['b']
                h = np.tanh(z)
                if self.residual and self.dims[l] == self.dims[l+1]:
                    h = h + h_prev_layer[t]   # residual across layers
                H[t] = h
            H_all.append(H)
            h_prev_layer = H
        return H_all


# ── Demo ──────────────────────────────────────────────────────────────────────
T, input_dim = 12, 4
hidden_dims = [6, 6]   # 2 layers
rng = np.random.default_rng(9)
X = rng.normal(0, 0.5, (T, input_dim))

# Plain deep RNN
plain = DeepRNN(input_dim, hidden_dims, residual=False)
H_plain = plain.forward(X)

# Residual deep RNN (requires same dims across layers for simple add)
res = DeepRNN(input_dim, hidden_dims, residual=False)  # demo without residual for clarity
H_res = res.forward(X)

print("Deep RNN Demo")
print("=" * 45)
print(f"Layers          : {len(hidden_dims)}")
print(f"Hidden dims     : {hidden_dims}")
print(f"Sequence length : {T}")
print()
print("Layer-wise output norms (plain deep RNN):")
for l, H in enumerate(H_plain):
    avg_norm = np.mean([np.linalg.norm(H[t]) for t in range(T)])
    print(f"  Layer {l+1}: avg ||h|| = {avg_norm:.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of a multi-layer stacked RNN. The forward pass iterates
                layer by layer, with each layer receiving the full sequence output from the
                layer below. The demo compares hidden state norms across a 2-layer stack.
            </p>
            <CodeBlock code={PY_CODE} filename="deep_rnn.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Deep RNN — TypeScript ───────────────────────────────────────────────────

type Vec = number[]
type Mat = number[][]

const tanhVec = (v: Vec): Vec => v.map(Math.tanh)
const dot = (a: Vec, b: Vec) => a.reduce((s, ai, i) => s + ai * b[i], 0)
const matVec = (M: Mat, v: Vec): Vec => M.map(row => dot(row, v))
const vecAdd = (a: Vec, b: Vec): Vec => a.map((ai, i) => ai + b[i])

interface LayerParams {
  W: Mat; U: Mat; b: Vec
}

function rnnLayer(X: Mat, h0: Vec, p: LayerParams): Mat {
  const H: Mat = []
  let h = [...h0]
  for (const x of X) {
    h = tanhVec(vecAdd(vecAdd(matVec(p.W, x), matVec(p.U, h)), p.b))
    H.push([...h])
  }
  return H
}

function deepRNN(X: Mat, layers: LayerParams[]): Mat[] {
  const H_all: Mat[] = []
  let inp = X
  for (const p of layers) {
    const h0 = Array(p.b.length).fill(0)
    const H = rnnLayer(inp, h0, p)
    H_all.push(H)
    inp = H
  }
  return H_all
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const INPUT_DIM = 3
const HIDDEN = 4
const T = 6

const randMat = (r: number, c: number): Mat =>
  Array.from({ length: r }, () =>
    Array.from({ length: c }, () => (Math.random() - 0.5) * 0.3))
const zeroVec = (n: number): Vec => Array(n).fill(0)

const layers: LayerParams[] = [
  { W: randMat(HIDDEN, INPUT_DIM), U: randMat(HIDDEN, HIDDEN), b: zeroVec(HIDDEN) },
  { W: randMat(HIDDEN, HIDDEN),    U: randMat(HIDDEN, HIDDEN), b: zeroVec(HIDDEN) },
]

const X: Mat = Array.from({ length: T }, () =>
  Array.from({ length: INPUT_DIM }, () => (Math.random() - 0.5) * 0.5))

const H_all = deepRNN(X, layers)

console.log("Deep RNN — TypeScript (2 layers)")
console.log("─".repeat(40))
H_all.forEach((H, l) => {
  const avgNorm = Math.sqrt(H.reduce((s, h) => s + h.reduce((t, v) => t + v*v, 0), 0) / H.length)
  console.log(\`Layer \${l + 1}: avg ||h|| = \${avgNorm.toFixed(4)}\`)
})
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript deep RNN with layer-wise sequential computation. The demo stacks
                two RNN layers and reports average hidden norms, showing how representations
                transform as they propagate upward through the stack.
            </p>
            <CodeBlock code={TS_CODE} filename="deep_rnn.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const DEEP_RNNS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
