import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Timeline ──────────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The context</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1986 – 1990",
            title: "The Dream of Deep Networks — and the First Failures",
            challenge:
                "Rumelhart, Hinton, and Williams demonstrated backpropagation on networks with one or two hidden layers. The obvious next step was to go deeper — more layers should mean more expressive representations, better performance on complex tasks. Researchers immediately tried training networks with 4, 6, 8 or more layers. They found that performance consistently failed to improve, and sometimes got dramatically worse, compared to shallower networks. Early layers simply stopped learning.",
            what: "The empirical observation was consistent but poorly understood: gradient signals passed backward from the loss through each layer, and by the time they reached the first few layers, they were vanishingly small — too small to produce any meaningful weight update. The networks were not converging to bad local minima; the early layers were simply not learning at all. The loss would decrease for the last few layers and plateau entirely for the first few.",
            impact:
                "This failure was deeply frustrating because the theoretical motivation for depth was strong — universal approximation theorems, biological analogy with cortical hierarchies, and the intuition that complex concepts are compositions of simpler ones. Depth was theoretically compelling but practically impossible. Understanding why became one of the central problems of neural network research for the next 25 years.",
        },
        {
            year: "1991",
            title: "Hochreiter's Diploma Thesis — The Problem Formalised",
            challenge:
                "Sepp Hochreiter, an undergraduate student at TU Munich working under Jürgen Schmidhuber, undertook a systematic analysis of why deep networks failed to train. Previous researchers had noticed the phenomenon empirically but had not identified the precise mathematical mechanism. Was it local minima? Poor initialisation? Too many parameters? Or something more fundamental about how backpropagation worked?",
            what: "Hochreiter's 1991 diploma thesis (written in German, largely unknown to the English-language research community for years) gave the first rigorous mathematical treatment of what he called the vanishing gradient problem. He showed that for deep sigmoid networks, the gradient of the loss with respect to early layer parameters shrinks exponentially with the number of layers — as a product of sigmoid derivatives, each bounded by 0.25. The same analysis showed the complementary exploding gradient problem: if weight matrices had spectral norm above a certain threshold, gradients grew exponentially instead of shrinking.",
            impact:
                "Hochreiter's analysis was the key intellectual breakthrough. The problem was not local minima, not initialisation, not the loss landscape — it was the fundamental mathematical structure of gradient propagation through compositions of saturating functions. The analysis also pointed directly toward the solution: a recurrent architecture that allowed gradients to flow across time without passing through non-linear activations at every step. This motivated the LSTM (1997).",
        },
        {
            year: "1994",
            title: "Bengio, Simard, Frasconi — Confirming the Crisis",
            challenge:
                "Hochreiter's 1991 diagnosis was largely in the German AI community and had not yet reached the broader connectionist world. Yoshua Bengio, Paolo Simard, and Patrice Frasconi independently arrived at the same conclusion from a different angle: they were studying recurrent networks and the difficulty of learning long-range dependencies. They traced the failure directly to vanishing gradients during backpropagation through time (BPTT).",
            what: "Bengio, Simard, and Frasconi published 'Learning Long-Term Dependencies with Gradient Descent is Difficult' (IEEE Transactions on Neural Networks, 1994). They gave a mathematical treatment of the problem and showed experimentally that the difficulty scaled exponentially with the time span of the dependency. The paper also argued that alternative approaches — non-gradient methods, special architectures — might be needed because the problem was intrinsic to gradient flow through long sequences.",
            impact:
                "The 1994 paper brought vanishing gradients to the attention of the English-language research community. It established the problem as a fundamental limitation of standard gradient methods for sequential tasks. Combined with Hochreiter's analysis, it created intellectual pressure that motivated a decade of architectural innovations: LSTMs (1997), gating mechanisms, skip connections, and eventually the residual and highway networks of the 2010s.",
        },
        {
            year: "1997",
            title: "Hochreiter and Schmidhuber — LSTM as the First Solution",
            challenge:
                "If the problem was that gradients decayed exponentially as they flowed through non-linear activations, the solution required a pathway through which gradients could flow without being subjected to non-linear squashing. For recurrent networks — which unrolled into very deep feedforward networks across time — this was particularly acute. A network trying to learn that the first word in a sentence affected the meaning of the last word would have to propagate gradients across hundreds of steps, losing them completely.",
            what: "Hochreiter and Schmidhuber's Long Short-Term Memory paper (Neural Computation, 1997) introduced the constant error carousel: a memory cell c that updated as <InlineMath tex='c_t = f_t \\odot c_{t-1} + i_t \\odot g_t' />, where <InlineMath tex='f_t' /> was the forget gate. When <InlineMath tex='f_t = 1' /> (forget gate open), gradients flowed through the cell state unchanged — no sigmoid saturation, no shrinking. The gates themselves were learned, allowing the network to decide when to let gradients flow and when to block them.",
            impact:
                "LSTM solved the vanishing gradient problem for sequential data and became the dominant architecture for language modelling, speech recognition, and machine translation from the late 1990s through 2017. Chapter 6 covers LSTM in detail. But the feedforward vanishing gradient problem — in deep non-recurrent networks — remained unsolved. The architectural solutions to that problem came much later.",
        },
        {
            year: "2006 – 2010",
            title: "Hinton, Bengio — Pretraining as a Partial Fix",
            challenge:
                "The vanishing gradient problem was not just about gradients being small — it was about early layers receiving no useful learning signal. Even if the gradient was non-zero, it was too small relative to the noise in the optimisation to produce productive updates. One approach: give early layers a better starting point, so they didn't need to be trained from scratch. If early layers started near a good solution, the small gradients from fine-tuning might be enough.",
            what: "Hinton, Osindero, and Teh (2006) introduced deep belief networks trained with greedy layer-wise pretraining: each layer was first trained as an unsupervised model (restricted Boltzmann machine), then stacked and fine-tuned end-to-end with backpropagation. Bengio et al. (2007) confirmed the same principle with stacked autoencoders. Pretraining gave early layers a meaningful initialisation, bypassing the need for the vanishing gradient to train them from scratch.",
            impact:
                "Pretraining temporarily revived interest in deep networks and demonstrated that depth was genuinely beneficial when the initialisation was good. But pretraining was slow, complicated, and task-specific. It was a workaround, not a solution. The definitive solution — which made pretraining obsolete — came from a different direction: changing the activation function.",
        },
        {
            year: "2010 – 2015",
            title: "ReLU, Xavier Init, Batch Norm — The Definitive Fixes",
            challenge:
                "Three independent breakthroughs in the early 2010s collectively solved the vanishing gradient problem for feedforward networks. Each addressed a different aspect of the problem: the activation function (sigmoid's saturation), the weight initialisation (initial gradient magnitudes), and the training dynamics (gradient flow through layers during training).",
            what: "Nair and Hinton (2010) showed that ReLU's non-saturating positive half kept gradients at magnitude 1 for active neurons. Glorot and Bengio (2010) derived 'Xavier initialisation' — set weights with variance <InlineMath tex='2/(n_{in} + n_{out})' /> to keep gradient magnitudes near 1 at initialisation. He et al. (2015) extended this for ReLU networks. Ioffe and Szegedy (2015) introduced batch normalisation — normalise pre-activations to zero mean and unit variance at each layer, keeping gradient magnitudes stable throughout training.",
            impact:
                "With ReLU, good initialisation, and batch normalisation, researchers could train networks with 50, 100, even 1000 layers. ResNet (He et al., 2015) trained a 152-layer network — something that would have been impossible with sigmoid networks. The vanishing gradient problem, which had paralysed deep network research for 25 years, was solved. The modern deep learning era — defined by depth as a central design axis — became possible.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>When backprop runs out of steam halfway through</h2>

            <Analogy label="The Blame Game Gets Too Quiet">
                Remember backpropagation: the output layer sends blame signals backwards, each layer adjusting its weights based on how much it contributed to the error. Now imagine a chain of 10 layers.
                <br /><br />
                Each sigmoid neuron passes on only a fraction of the blame it receives — the maximum it can pass is 25% of what it got (that's the maximum gradient of the sigmoid function). So layer 10 gets 100% of the blame signal. Layer 9 gets 25%. Layer 8 gets 6.25%. By layer 1, the blame signal is 0.25<sup>10</sup> = 0.000001 of the original — one-millionth!
                <br /><br />
                Layer 1's weights update by one-millionth of what they should. It effectively doesn't learn at all. This is the vanishing gradient problem.
            </Analogy>

            <Analogy label="The Exploding Version — Too Much Blame">
                The opposite can also happen. If the weight matrices are large (values greater than 1), each layer amplifies the blame signal rather than shrinking it. A factor of 2× per layer × 10 layers = 1024× amplification. With a factor of 3×: 3<sup>10</sup> = 59,049×.
                <br /><br />
                The weights shift by an enormous amount — far too much. Numbers overflow, the network becomes chaotic, and training diverges. This is the exploding gradient problem. It's solved by gradient clipping: simply cap the gradient if it exceeds a threshold. Vanishing is harder to fix.
            </Analogy>

            <Analogy label="Why Sigmoid Is the Culprit">
                The sigmoid function saturates — for very large or very small inputs, it gets almost perfectly flat. A flat function has near-zero gradient. When you multiply many near-zero gradients together (one per layer in the chain rule), the product shrinks to nothing.
                <br /><br />
                ReLU doesn't saturate for positive inputs. Its gradient is exactly 1 for any positive input — no matter how large. Multiplying ten 1s together still gives 1. This is why switching from sigmoid to ReLU in 2010 essentially solved the vanishing gradient problem for feedforward networks.
            </Analogy>

            <Analogy label="LSTM — A Bypass Highway for the Gradient">
                For recurrent networks (networks that process sequences step by step), vanishing gradients are even worse — the network is like a feedforward network unrolled across 100 or 1000 time steps. The gradient has to flow backward through all of them.
                <br /><br />
                The LSTM (Long Short-Term Memory) solves this with a special "cell state" — a dedicated memory lane that runs in parallel to the main network. Gradients can flow backward along this highway without passing through sigmoid squashing, keeping them alive across hundreds of steps.
                <br /><br />
                Chapter 6 covers LSTMs in detail. They are backpropagation's answer to time — the same way the skip connections in ResNets (Chapter 10) are backpropagation's answer to depth.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Why gradients vanish or explode in deep networks</h2>

            <h3>The chain rule in deep networks</h3>
            <p>
                For a network with <em>L</em> layers, the gradient of the loss w.r.t. the first layer's pre-activation is a product of <em>L</em> terms:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial z^{(1)}} = \frac{\partial L}{\partial a^{(L)}} \prod_{l=1}^{L} \left(W^{(l+1)\top}\, \text{diag}\!\left(\sigma'(z^{(l)})\right)\right)" />
            <p>
                Each factor contains <InlineMath tex="\sigma'(z^{(l)})" /> — the local gradient of the activation function. For sigmoid, <InlineMath tex="\sigma'(x) \leq 0.25" /> everywhere. For <InlineMath tex="L = 10" /> layers: the gradient is bounded by <InlineMath tex="0.25^{10} \approx 10^{-6}" /> of the output gradient — effectively zero.
            </p>

            <h3>Numerical consequences by depth</h3>
            <table className="ch-truth-table" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", borderCollapse: "collapse", marginBottom: "18px" }}>
                <thead>
                    <tr>
                        {["Layers", "Sigmoid factor", "Gradient magnitude"].map(h => (
                            <th key={h} style={{ padding: "8px 14px", border: "1px solid #252530", background: "#111115", color: "#e8a838", textAlign: "center" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[["1", "0.25¹", "25%"], ["3", "0.25³", "1.6%"], ["5", "0.25⁵", "0.10%"], ["10", "0.25¹⁰", "0.00010%"], ["20", "0.25²⁰", "10⁻¹² %"]].map(([l, f, m]) => (
                        <tr key={l}>
                            {[l, f, m].map((v, i) => (
                                <td key={i} style={{ padding: "7px 14px", border: "1px solid #252530", textAlign: "center", color: "#cdc9c0" }}>{v}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>The exploding gradient case</h3>
            <p>
                If weight matrices have spectral norm <InlineMath tex="\|W^{(l)}\| = \gamma > 1" />, the product of weight matrices amplifies the gradient. For <InlineMath tex="L = 10" /> layers with <InlineMath tex="\gamma = 2" />: amplification = <InlineMath tex="2^{10} = 1024" />. With <InlineMath tex="\gamma = 3" />: 59,049×. Weight updates become chaotic and training diverges.
            </p>

            <h3>Solutions that emerged</h3>
            <ul>
                <li><strong>ReLU (2010):</strong> gradient = 1 for active neurons, no saturation in the positive half</li>
                <li><strong>Xavier initialisation (2010):</strong> variance <InlineMath tex="\text{Var}(W) = 2/(n_{in} + n_{out})" /> to keep gradient magnitudes near 1 at initialisation</li>
                <li><strong>Batch normalisation (2015):</strong> normalise activations during training, keeping gradient magnitudes stable</li>
                <li><strong>Residual connections (2015):</strong> add identity shortcuts so gradients can bypass non-linear layers entirely</li>
                <li><strong>LSTM gates (1997):</strong> constant error carousel for recurrent networks — see Chapter 6</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Gradient clipping:</strong> a simple fix for exploding gradients — if <InlineMath tex="\|\nabla L\| > \text{threshold}" />, rescale the gradient so <InlineMath tex="\|\nabla L\| = \text{threshold}" />. Standard for RNNs (threshold ≈ 1–5) where exploding gradients remain a concern even with LSTMs. Does not fix vanishing gradients — clipping a near-zero gradient still leaves it near zero.
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

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Formal analysis of gradient flow</h2>

            <DefBlock label="Gradient norm propagation (Pascanu et al., 2013)">
                Let <InlineMath tex="\rho(A)" /> denote the spectral radius (largest singular value) of matrix <em>A</em>. The expected change in gradient norm through one layer is governed by:
                <MathBlock tex="\mathbb{E}\!\left[\left\|\frac{\partial L}{\partial z^{(l)}}\right\|\right] \approx \rho(W^{(l+1)}) \cdot \mathbb{E}\!\left[|\sigma'(z^{(l)})|\right] \cdot \mathbb{E}\!\left[\left\|\frac{\partial L}{\partial z^{(l+1)}}\right\|\right]" />
                If <InlineMath tex="\rho(W) \cdot \mathbb{E}[|\sigma'|] < 1" />, gradients vanish; if &gt; 1, they explode.
            </DefBlock>

            <h3>Xavier initialisation derivation (Glorot &amp; Bengio, 2010)</h3>
            <p>
                For a linear layer with <InlineMath tex="n_{in}" /> inputs and <InlineMath tex="n_{out}" /> outputs, if inputs have variance <InlineMath tex="\text{Var}(x) = 1" /> and weights are i.i.d. with mean 0 and variance <InlineMath tex="\text{Var}(w)" />, then the output variance is:
            </p>
            <MathBlock tex="\text{Var}(y_j) = n_{in} \cdot \text{Var}(w) \cdot \text{Var}(x)" />
            <p>
                To preserve variance across layers (both forward and backward), set:
            </p>
            <MathBlock tex="\text{Var}(w) = \frac{2}{n_{in} + n_{out}}" />
            <p>
                This is the Xavier uniform or normal initialisation. For ReLU networks, He et al. (2015) derived <InlineMath tex="\text{Var}(w) = 2/n_{in}" /> — the extra factor of 2 compensates for ReLU's zero output on the negative half, which halves the effective variance.
            </p>

            <h3>Residual connections eliminate vanishing gradients</h3>
            <p>
                A residual block computes <InlineMath tex="y = F(x) + x" /> where <InlineMath tex="F" /> is a stack of layers. The gradient through the block is:
            </p>
            <MathBlock tex="\frac{\partial y}{\partial x} = I + \frac{\partial F}{\partial x}" />
            <p>
                The identity term <em>I</em> ensures the gradient is always at least 1 in spectral norm, regardless of how small <InlineMath tex="\partial F / \partial x" /> becomes. In a ResNet with <em>L</em> residual blocks, the gradient at block 1 is approximately:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial x^{(1)}} = \sum_{k=1}^{L} \prod_{j=1}^{k} \left(I + \frac{\partial F^{(j)}}{\partial x^{(j)}}\right)" />
            <p>
                This is a sum of path products — even if individual <InlineMath tex="\partial F / \partial x" /> terms are small, the identity terms keep the sum from vanishing. This is the mathematical reason ResNets with 152 layers trained successfully in 2015, when 10-layer sigmoid networks had failed in 1990.
            </p>

            <DefBlock label="Batch Normalisation (Ioffe &amp; Szegedy, 2015)">
                For a mini-batch <InlineMath tex="\{x_i\}_{i=1}^B" />, batch normalisation computes:
                <MathBlock tex="\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \qquad y_i = \gamma \hat{x}_i + \beta" />
                where <InlineMath tex="\mu_B, \sigma_B^2" /> are the batch mean and variance, and <InlineMath tex="\gamma, \beta" /> are learned scale and shift parameters. By keeping activations near zero mean and unit variance, batch norm keeps sigmoid and tanh activations in their high-gradient region (near 0), preventing saturation.
            </DefBlock>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── Simulate gradient flow through N layers ───────────────────────────────────
def simulate_gradient_flow(n_layers, weight_scale, activation="sigmoid"):
    """Track gradient magnitude as it propagates backward."""
    grad = 1.0
    grads = [grad]
    for _ in range(n_layers):
        if activation == "sigmoid":
            act_grad = 0.25          # max sigmoid derivative
        elif activation == "relu":
            act_grad = 0.5           # ~50% neurons active on average
        elif activation == "tanh":
            act_grad = 0.8           # typical tanh gradient magnitude
        grad *= weight_scale * act_grad
        grads.append(grad)
    return grads

print("Gradient magnitude after N layers (start=1.0, weight_scale=1.0):")
print(f"{'Layers':>6} | {'sigmoid':>10} | {'tanh':>10} | {'relu':>10}")
print("-" * 48)
for n in [1, 3, 5, 10, 20]:
    s = simulate_gradient_flow(n, 1.0, "sigmoid")[-1]
    t = simulate_gradient_flow(n, 1.0, "tanh")[-1]
    r = simulate_gradient_flow(n, 1.0, "relu")[-1]
    print(f"{n:>6} | {s:>10.2e} | {t:>10.2e} | {r:>10.2e}")

# ── PyTorch: measure actual gradients in deep networks ────────────────────────
def build_network(depth, activation_fn):
    layers = []
    for _ in range(depth):
        layers.append(nn.Linear(32, 32))
        layers.append(activation_fn())
    layers.append(nn.Linear(32, 1))
    return nn.Sequential(*layers)

def measure_first_layer_grad(model, depth):
    x = torch.randn(16, 32)
    y = torch.randn(16, 1)
    pred = model(x)
    loss = nn.functional.mse_loss(pred, y)
    loss.backward()
    # Gradient of the first Linear layer's weights
    first_layer = [m for m in model.modules() if isinstance(m, nn.Linear)][0]
    return first_layer.weight.grad.abs().mean().item()

print("\\nActual first-layer gradient magnitudes (PyTorch):")
print(f"{'Depth':>6} | {'Sigmoid':>10} | {'Tanh':>10} | {'ReLU':>10}")
print("-" * 48)
for depth in [2, 5, 10, 20]:
    results = []
    for act in [nn.Sigmoid, nn.Tanh, nn.ReLU]:
        torch.manual_seed(0)
        model = build_network(depth, act)
        # Xavier init
        for m in model.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
        g = measure_first_layer_grad(model, depth)
        results.append(g)
    print(f"{depth:>6} | {results[0]:>10.2e} | {results[1]:>10.2e} | {results[2]:>10.2e}")

# ── Residual connections: gradient highway ────────────────────────────────────
class ResidualBlock(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.linear = nn.Linear(dim, dim)
        self.act    = nn.ReLU()

    def forward(self, x):
        return x + self.act(self.linear(x))   # identity shortcut

class ResNet(nn.Module):
    def __init__(self, depth, dim=32):
        super().__init__()
        self.blocks = nn.Sequential(*[ResidualBlock(dim) for _ in range(depth)])
        self.head   = nn.Linear(dim, 1)

    def forward(self, x):
        return self.head(self.blocks(x))

print("\\nResidual vs plain network (depth=20, first-layer gradient):")
for name, model_cls in [("Plain (ReLU)", lambda: build_network(20, nn.ReLU)),
                         ("ResNet",       lambda: ResNet(20))]:
    torch.manual_seed(0)
    model = model_cls()
    g = measure_first_layer_grad(model, 20)
    print(f"  {name:>20}: {g:.2e}")`

function PythonContent() {
    return (
        <>
            <p>
                Three experiments in one file: (1) theoretical simulation of gradient decay by depth
                and activation, (2) actual PyTorch gradient measurements confirming the simulation,
                and (3) a comparison of plain vs. residual networks showing how skip connections
                keep gradients alive at depth 20.
            </p>
            <CodeBlock code={PY_CODE} filename="vanishing_gradients.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Expected output:</strong> at depth 20, sigmoid first-layer gradients will be
                near 10<sup>-12</sup> — numerically zero. ReLU gradients will be orders of magnitude
                larger. The ResNet at depth 20 will have gradients comparable to a depth-2 plain
                network — the residual connections completely solve the vanishing gradient problem.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const VANISHING_GRADIENTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
