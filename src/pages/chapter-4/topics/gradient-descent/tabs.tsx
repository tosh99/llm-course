import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

function HistoryTab() {
    return (
        <>
            <h2>Three ways to follow the slope downhill</h2>

            <h3>Batch gradient descent (1788 – 1960s)</h3>
            <p>
                The concept of gradient descent traces to Cauchy (1847) and was applied to least squares by Legendre (1805). In neural networks, batch GD computes the gradient over the <em>entire training set</em> before taking a step. It converges reliably to a local minimum, but was prohibitively slow for large datasets.
            </p>

            <h3>Stochastic gradient descent (1951 – 1986)</h3>
            <p>
                Herbert Robbins and Monroe (1951) introduced stochastic approximation theory, which evolved into stochastic gradient descent (SGD). Instead of the full gradient, SGD approximates it with a single sample's gradient — noisy, but unbiased. It converges faster in practice because it escapes sharp local minima more easily.
            </p>

            <h3>Mini-batch SGD (late 1980s – present)</h3>
            <p>
                The modern standard: compute gradients over small batches (32–512 samples) rather than the full set or single samples. This balances gradient accuracy with computational efficiency (GPU parallelization) and provides regularization through noise. Every major deep learning framework uses mini-batch SGD as the default.
            </p>

            <div className="ch-callout">
                <strong>Momentum (Polyak, 1964):</strong> add a velocity term to accumulate gradient direction — helps SGD carry through flat regions and dampens oscillations. The Nesterov variant (1983) looks ahead to where momentum will carry the weight before computing the gradient there.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How does a network know which way is downhill?</h2>

            <Analogy label="Batch GD — Check Every Cliff Before Moving">
                Imagine standing on a mountain and wanting to get to the lowest valley. Batch gradient descent means: look at the slope from <em>every single point on the entire mountain</em>, figure out the combined downhill direction, then take one small step. Then repeat.
                <br /><br />
                This is very accurate, but it takes forever if the mountain is enormous (a massive dataset).
            </Analogy>

            <Analogy label="SGD — Look at One Pebble and Guess">
                Stochastic GD: pick one random pebble, see which way it rolls, and take a tiny step in that direction. Then pick another pebble. Repeat 10 million times.
                <br /><br />
                Each step is noisy (maybe that pebble rolled sideways), but on average you'll head downhill. And you're fast — no need to check the whole mountain for each step.
            </Analogy>

            <Analogy label="Mini-batch — Check a Handful of Pebbles">
                Mini-batch SGD is the middle ground: pick 32 random pebbles, see which way most of them roll, take a step. This is fast (parallel check), accurate enough, and noisy enough to avoid getting stuck in shallow dips.
            </Analogy>

            <Analogy label="Momentum — Rolling with Speed">
                Adding momentum is like rolling a ball down the mountain: it picks up speed going downhill and slows down going up. The gradient becomes a "force" pushing the ball, but the ball's velocity keeps it moving through flat regions instead of stopping.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The gradient descent family</h2>

            <h3>Gradient descent update rule</h3>
            <p>
                Given a loss <InlineMath tex="L(\theta)" /> and learning rate <InlineMath tex="\eta" />, the parameters are updated:
            </p>
            <MathBlock tex="\theta \leftarrow \theta - \eta \cdot \nabla_\theta L(\theta)" />

            <h3>Batch GD: use the full gradient</h3>
            <MathBlock tex="\nabla_\theta L(\theta) = \frac{1}{N} \sum_{i=1}^{N} \nabla_\theta \ell(x_i, y_i, \theta)" />
            <p>
                Accurate but slow: O(N) per step, where N is the dataset size.
            </p>

            <h3>SGD: use a single sample</h3>
            <MathBlock tex="\theta \leftarrow \theta - \eta \cdot \nabla_\theta \ell(x_i, y_i, \theta)" />
            <p>
                One sample at a time. Fast but noisy — the gradient is a very crude estimate of the true gradient.
            </p>

            <h3>Mini-batch SGD</h3>
            <MathBlock tex="\theta \leftarrow \theta - \eta \cdot \frac{1}{B} \sum_{i \in \mathcal{B}} \nabla_\theta \ell(x_i, y_i, \theta)" />
            <p>
                B is the batch size (typically 32–512). The gradient estimate has lower variance than SGD and is faster to compute than batch GD. Modern deep learning almost exclusively uses mini-batch SGD (or SGD with momentum).
            </p>

            <h3>Momentum</h3>
            <MathBlock tex="v \leftarrow \beta v + (1 - \beta) \nabla_\theta L(\theta), \qquad \theta \leftarrow \theta - \eta v" />
            <p>
                where <InlineMath tex="v" /> is the velocity (initially 0) and <InlineMath tex="\beta \in [0, 1)" /> (typically 0.9). Momentum accumulates an exponentially-weighted moving average of past gradients.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Learning rate schedule:</strong> start with a relatively high LR, then decrease it over time.
                Common schedules: step decay (drop by factor every N epochs), cosine annealing, or warmup + constant.
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
            <h2>Convergence theory</h2>

            <DefBlock label="Convergence of SGD (Robbins-Monro, 1951)">
                If the learning rate schedule satisfies:
                <InlineMath tex="\sum_{t=0}^{\infty} \eta_t = \infty \quad \text{and} \quad \sum_{t=0}^{\infty} \eta_t^2 < \infty" />
                then SGD converges to a local minimum almost surely, provided the noise in the gradient estimates has bounded variance. The first condition ensures the steps are large enough to eventually reach the minimum; the second prevents steps from becoming too noisy as we get close.
            </DefBlock>

            <h3>Variance of gradient estimates</h3>
            <p>
                For SGD with batch size B:
                <InlineMath tex="\text{Var}\big[\nabla_\theta \hat{L}\big] = \frac{1}{B}\text{Var}\big[\nabla_\theta \ell(x_i, y_i, \theta)\big]" />
                Doubling the batch size halves the gradient variance, but the compute cost doubles linearly. This is why batch size has a sweet spot (typically 32–512).
            </p>

            <h3>Learning rate scaling with batch size</h3>
            <p>
                Goyal et al. (2017) showed that for a fixed number of gradient updates, LR should scale linearly with batch size: if you double B, you can roughly double η to maintain similar convergence behavior.
            </p>

            <div className="ch-callout">
                <strong>Generalization mystery:</strong> large-batch SGD (thousands of samples per step) often converges to <em>sharp minima</em> with poor generalization, while small-batch SGD finds <em>flat minima</em> that generalize better. The noise in small-batch gradients acts as an implicit regularizer.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib.pyplot as plt

# ── Loss landscape: 1D example ─────────────────────────────────────────────────
def loss(theta):
    return theta**4 - 14*theta**3 + 60*theta**2 - 70*theta

def grad(theta):
    return 4*theta**3 - 42*theta**2 + 120*theta - 70

theta_bgd  = [3.0]   # batch GD
theta_sgd  = [3.0]  # SGD
theta_mbgd = [3.0]  # mini-batch GD

eta = 0.001
np.random.seed(42)

for step in range(2000):
    theta_bgd.append(theta_bgd[-1] - eta * grad(theta_bgd[-1]))

for step in range(2000):
    noise = np.random.randn()
    theta_sgd.append(theta_sgd[-1] - eta * (grad(theta_sgd[-1]) + 0.5*noise))

v = 0.0
beta = 0.9
for step in range(2000):
    g = grad(theta_mbgd[-1])
    v = beta * v + (1 - beta) * g
    theta_mbgd.append(theta_mbgd[-1] - eta * v)

# ── Plot ─────────────────────────────────────────────────────────────────────
theta_range = np.linspace(0, 4, 400)
fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(theta_range, loss(theta_range), color="#e8e0d0", linewidth=2, label="Loss L(θ)")
ax.plot(theta_bgd,  [loss(t) for t in theta_bgd],  "o-", color="#5a9ab9",  ms=3, lw=1.5, label="Batch GD", alpha=0.7)
ax.plot(theta_sgd,  [loss(t) for t in theta_sgd],  "o-", color="#e8a838",  ms=3, lw=1.5, label="SGD", alpha=0.4)
ax.plot(theta_mbgd, [loss(t) for t in theta_mbgd],"o-", color="#5ab98c",  ms=3, lw=1.5, label="Momentum SGD")
ax.set_xlabel("θ"); ax.set_ylabel("L(θ)")
ax.set_title("Gradient Descent Variants on a Non-Convex Landscape")
ax.legend(); ax.grid(True, alpha=0.2)
plt.tight_layout()
plt.savefig("gd_comparison.png", dpi=150, facecolor="#0d0d10")
print("Saved gd_comparison.png")`

function PythonContent() {
    return (
        <>
            <p>
                Visual comparison of batch GD, SGD, and momentum SGD on a non-convex
                1D loss landscape. SGD's noise is visible as oscillation; momentum
                smooths the trajectory while still escaping local minima.
            </p>
            <CodeBlock code={PY_CODE} filename="gradient_descent.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ──────────────────────────────────────────────────────────

export const GRADIENT_DESCENT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
