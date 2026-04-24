import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

function HistoryTab() {
    return (
        <>
            <h2>The training instability that stalled deep networks</h2>

            <h3>1986 – 2006: The dark age of deep networks</h3>
            <p>
                After backpropagation was demonstrated in 1986, researchers naturally tried training deeper networks. They found that networks with more than ~2–3 layers would simply stop learning: early layers' gradients became vanishingly small (or would explode), making them essentially untrainable. No amount of data or compute fixed it.
            </p>

            <h3>Hochreiter's diploma thesis (1991)</h3>
            <p>
                Sepp Hochreiter's undergraduate thesis (TU Munich) identified and formalised the vanishing/exploding gradient problem in recurrent networks. He showed experimentally that deep networks with sigmoid activations suffered from exponentially decaying or growing gradients through the chain rule. This was the key insight that later motivated his LSTM (1997).
            </p>

            <h3>1997: LSTM and the first partial fix</h3>
            <p>
                Hochreiter & Schmidhuber's Long Short-Term Memory introduced gating mechanisms and a constant error carousel to allow gradients to flow unchanged across long sequences. LSTM solved the vanishing gradient problem <em>for sequential data</em>, but the problem in feedforward networks remained.
            </p>

            <h3>2006 – 2012: Greedy layer-wise pretraining</h3>
            <p>
                Hinton et al. (2006) introduced Deep Belief Networks trained with greedy layer-wise unsupervised pretraining: each layer was trained as an autoencoder before being fine-tuned with backprop. This gave early layers a meaningful initialization, partially circumventing the vanishing gradient. Bengio et al. (2007) formalized why this worked.
            </p>

            <h3>2010: ReLU ends the crisis</h3>
            <p>
                Nair & Hinton (2010) showed that ReLU activations don't saturate in the positive region — their gradient is exactly 1 for any positive input. This simple change made training deep networks straightforward for the first time. By the time AlexNet won ImageNet in 2012, ReLU + careful initialization (Xavier/He) had made the vanishing gradient problem a historical curiosity rather than an active research problem.
            </p>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>When backprop runs out of steam halfway through</h2>

            <Analogy label="The Blame Game Gets Too Quiet">
                Remember backpropagation: the output layer sends blame signals backwards, each layer adjusting its weights slightly. Now imagine a chain of 10 layers. Each layer only passes a <em>quarter</em> of the blame it receives to the layer before it.
                <br /><br />
                By the time the blame signal reaches layer 1, it's been diluted by 0.25 × 0.25 × 0.25 × ... (10 times) — that's 0.25<sup>10</sup> ≈ one-millionth of the original! Layer 1 barely knows it made a mistake.
            </Analogy>

            <Analogy label="The Exploding Version — Too Much Blame">
                Sometimes weights are set too large, and the gradient signal <em>grows</em> as it passes back. Each layer amplifies the blame by a factor of 3×. After 10 layers: 3<sup>10</sup> = 59,000×. The weights shift wildly, and the network becomes unstable — numbers overflow, training diverges.
            </Analogy>

            <Analogy label="ReLU: A Bypass for the Vanishing">
                ReLU fixes this because for positive inputs, its gradient is exactly 1. No dilution, no explosion. Each layer passes the blame signal unchanged (for active neurons).
                <br /><br />
                The catch: ReLU can "kill" neurons (output 0 for all inputs), which is a different problem — but at least it's fixable (use Leaky ReLU, or careful initialization).
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Why gradients vanish or explode in deep networks</h2>

            <h3>The chain rule in deep networks</h3>
            <p>
                For a network with <em>L</em> layers and sigmoid activations, the gradient of the loss w.r.t. the first layer's pre-activation is:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial z^{(1)}} = \frac{\partial L}{\partial a^{(L)}} \prod_{l=1}^{L} \big( W^{(l+1)\top} \odot \sigma'(z^{(l)}) \big)" />
            <p>
                Each term <InlineMath tex="\sigma'(z^{(l)})" /> has maximum value 0.25 (for sigmoid). If all weight matrices are approximately identity, the product <InlineMath tex="0.25^L" /> shrinks exponentially with depth.
            </p>

            <h3>Numerical example</h3>
            <table className="ch-truth-table" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", borderCollapse: "collapse", marginBottom: "18px" }}>
                <thead>
                    <tr>
                        {["Layers", "Gradient factor", "Relative magnitude"].map(h => (
                            <th key={h} style={{ padding: "8px 14px", border: "1px solid #252530", background: "#111115", color: "#e8a838", textAlign: "center" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[[1, "0.25", "25%"], [3, "0.25³", "1.6%"], [5, "0.25⁵", "0.1%"], [10, "0.25¹⁰", "0.0001%"], [20, "0.25²⁰", "10⁻¹²%"]].map(([l, f, m]) => (
                        <tr key={String(l)}>
                            {[String(l), f, m].map((v, i) => (
                                <td key={i} style={{ padding: "7px 14px", border: "1px solid #252530", textAlign: "center", color: "#cdc9c0" }}>{v}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>The exploding gradient case</h3>
            <p>
                If weight magnitudes are &gt; 2.0 (rather than ~1.0), the product grows exponentially: a 10-layer network with weights of magnitude 2.5 would amplify gradients by 2.5<sup>10</sup> ≈ 9500×. Updates become chaotic and training diverges.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Fixes:</strong> careful weight initialization (Xavier: <InlineMath tex="W \sim \mathcal{N}(0, \sqrt{2/n_{in}})" />; He init for ReLU), batch normalization (Ioffe & Szegedy, 2015), residual connections (ResNet, 2015), and using ReLU instead of sigmoid/tanh.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal analysis of gradient flow</h2>

            <DefBlock label="Gradient norm propagation (Pascanu et al., 2013)">
                Let <InlineMath tex="\|A\|" /> denote the spectral norm (largest singular value) of matrix A. The expected factor by which the gradient norm changes through one layer is approximately <InlineMath tex="\|W\| \cdot \|\sigma'\|" />. If <InlineMath tex="\|W\| \cdot \|\sigma'\| < 1" />, gradients vanish exponentially; if &gt; 1, they explode.
            </DefBlock>

            <h3>Singular value analysis of weight matrices</h3>
            <p>
                The singular values of <em>W</em> determine gradient amplification. If the largest singular value <InlineMath tex="\bar\sigma(W) > 1" />, gradients can grow. If <InlineMath tex="\bar\sigma(W) < 1" />, they shrink. The ratio of the largest to smallest singular value (the <em>condition number</em>) determines how distorted the gradient signal becomes.
            </p>

            <h3>Exploding: a concrete bound</h3>
            <MathBlock tex="\big\| \frac{\partial L}{\partial W^{(1)}} \big\| \leq \big\| \frac{\partial L}{\partial a^{(L)}} \big\| \prod_{l=1}^{L} \|W^{(l+1)}\| \cdot \max_x |\sigma'(x)|" />
            <p>
                If <InlineMath tex="\|W^{(l)}\| = \gamma > 1" /> and <InlineMath tex="\max |\sigma'(x)| = 0.25" />, then for L=10 layers: factor = (0.25γ)<sup>10</sup>. With γ=4, this is (1.0)<sup>10</sup> = 1. With γ=5, it's 5<sup>10</sup> ≈ 10<sup>7</sup> — gradients explode.
            </p>

            <h3>Why residual connections help (He et al., 2016)</h3>
            <p>
                A residual block adds the identity: <InlineMath tex="y = F(x) + x" />. The gradient through the block is:
                <InlineMath tex="\frac{\partial(y)}{\partial(x)} = I + \frac{\partial F}{\partial x}" />
                Even if <InlineMath tex="\frac{\partial F}{\partial x}" /> is very small, the identity term I ensures at least gradient norm 1 flows through — solving vanishing entirely.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Simulate gradient flow through N sigmoid layers ──────────────────────────
def simulate_gradient_flow(n_layers, weight_mag, activation="sigmoid"):
    """Track gradient magnitude as it propagates backward."""
    grad = 1.0  # start at output layer with gradient 1.0
    grads = [grad]

    for l in range(n_layers):
        if activation == "sigmoid":
            # sigmoid derivative max is 0.25 at x=0
            sat = 0.25
        elif activation == "relu":
            # ReLU: gradient = 1 for active, 0 for dead
            # assume 50% of neurons are active on average
            sat = 0.5
        elif activation == "tanh":
            sat = 1.0  # max derivative of tanh

        grad *= weight_mag * sat
        grads.append(grad)

    return grads

# ── Table of results ─────────────────────────────────────────────────────────
activations = ["sigmoid", "relu", "tanh"]
weight_mags = [0.5, 1.0, 2.0, 4.0]
layers = [1, 3, 5, 10, 20]

print("Gradient magnitude after N layers (starting from 1.0):")
print(f"{'Layers':>6} | {'Act':>8} | " + " | ".join(f"W={w}" for w in weight_mags))
print("-".repeat(70))

for n in layers:
    for act in activations:
        row = [f"{n:>6}", f"{act:>8}"]
        for w in weight_mags:
            final = simulate_gradient_flow(n, w, act)[-1]
            if abs(final) < 1e-10:
                row.append(f"{'~0':>6}")
            elif abs(final) > 1e10:
                row.append(f"{'>1e10':>6}")
            else:
                row.append(f"{final:>6.2g}")
        print(" | ".join(row))
    print()

print("Key insight: with sigmoid (max grad=0.25) and W≈1, gradients vanish")
print("exponentially. With ReLU (active neurons) and W=2.0, gradients flow")
print("normally. With W=4.0 and sigmoid, gradients EXPLODE (see W=4.0 column).")`

function PythonTab() {
    return (
        <>
            <p>
                Numerical simulation of gradient flow through N layers for different
                activation functions and weight initializations. This makes the vanishing/exploding
                trade-off concrete.
            </p>
            <CodeBlock code={PY_CODE} filename="vanishing_gradients.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Simulate gradient flow through deep networks ────────────────────────────
type Act = "sigmoid" | "relu" | "tanh";

function satMax(act: Act): number {
  if (act === "sigmoid") return 0.25;
  if (act === "relu")    return 0.5;   // assume 50% active neurons on average
  if (act === "tanh")    return 1.0;
  return 1;
}

function gradientFlow(nLayers: number, wMag: number, act: Act): number {
  let grad = 1.0;
  const sat = satMax(act);
  for (let l = 0; l < nLayers; l++)
    grad *= wMag * sat;
  return grad;
}

const layers = [1, 3, 5, 10, 20];
const wMags   = [0.5, 1.0, 2.0, 4.0];
const acts: Act[] = ["sigmoid", "relu", "tanh"];

const fmt = (v: number) =>
  Math.abs(v) < 1e-10 ? "     ~0" :
  Math.abs(v) > 1e10  ? "  >1e10" :
  \`\${v.toFixed(2).padStart(6)}\`;

console.log("Layers | Act      |" + wMags.map(w => \` W=\${w}\`.padStart(7)).join(""));
console.log("-".repeat(50));

for (const n of layers) {
  for (const act of acts) {
    const vals = wMags.map(w => fmt(gradientFlow(n, w, act)));
    console.log(\`  \${String(n).padStart(5)} | \${act.padEnd(8)} | \${vals.join(" ")}\`);
  }
  console.log();
}

console.log("Sigmoid+W~1 : gradients VANISH (×0.25 per layer)");
console.log("ReLU+W~2    : gradients FLOW normally (×1.0 per layer)");
console.log("Sigmoid+W~4 : gradients EXPLODE (×1.0 or more per layer)");`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript simulation of gradient flow through deep networks.
                Shows exactly which combinations of activation and weight scale cause vanishing
                (sigmoid + W≈1) vs normal flow (ReLU + W=2) vs explosion (sigmoid + W≥4).
            </p>
            <CodeBlock code={TS_CODE} filename="vanishing_gradients.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const VANISHING_GRADIENTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
