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
            year: "1847",
            title: "Cauchy — Steepest Descent Formalised",
            challenge:
                "By 1847, mathematicians had the theory of partial derivatives and could describe the gradient of a multi-variable function. The Newtonian tradition had focused on finding exact solutions — closed-form expressions for minima by setting the derivative to zero. But most real-world optimisation problems had no closed-form solution. An iterative numerical method was needed: one that could descend toward a minimum without requiring an analytic expression for it.",
            what: "Augustin-Louis Cauchy published 'Méthode générale pour la résolution des systèmes d'équations simultanées' in 1847, describing the method of steepest descent: at any point, move in the direction of the negative gradient — the direction of most rapid decrease. Iterate until convergence. Cauchy applied this to systems of linear equations, but the principle was general.",
            impact:
                "Cauchy's steepest descent is mathematically identical to gradient descent as used in neural network training. The step <InlineMath tex='\\theta \\leftarrow \\theta - \\eta \\nabla L(\\theta)' /> is precisely his method. Every optimiser from vanilla SGD to Adam is a refinement of this 1847 idea — adding momentum, adaptive step sizes, or second-order information to the same core: follow the gradient downhill.",
        },
        {
            year: "1951",
            title: "Robbins and Monro — Stochastic Approximation",
            challenge:
                "For any non-trivial dataset, batch gradient descent required computing the gradient of the loss over every training example before taking one step. For datasets with millions of examples, this made each update astronomically expensive. A method that could make progress by looking at just a few examples at a time — without sacrificing convergence guarantees — was urgently needed.",
            what: "Herbert Robbins and Sutton Monro published 'A Stochastic Approximation Method' in the Annals of Mathematical Statistics (1951). They proved that you could optimise a function by taking gradient steps based on noisy, stochastic estimates of the true gradient — as long as the learning rate schedule decays appropriately: <InlineMath tex='\\sum_t \\eta_t = \\infty' /> (steps large enough to reach the minimum) and <InlineMath tex='\\sum_t \\eta_t^2 < \\infty' /> (steps small enough to settle). This framework became known as stochastic approximation.",
            impact:
                "The Robbins-Monro conditions are the theoretical foundation for all stochastic gradient methods. Every convergence proof for SGD — from the basic algorithm to Adam — relies on some form of this framework. The key insight was that noisy gradient estimates are not a problem to be eliminated but a property to be exploited: with the right schedule, convergence is guaranteed despite per-step error.",
        },
        {
            year: "1964 – 1983",
            title: "Polyak and Nesterov — Momentum Makes SGD Smarter",
            challenge:
                "Vanilla gradient descent (and SGD) suffers from a fundamental limitation: in regions where the loss surface has different curvature in different directions, gradient steps oscillate. In a narrow ravine, each step goes mostly sideways rather than forward — like a ball bouncing between the ravine walls instead of rolling down. Learning rate must be kept small to avoid diverging in the steep directions, which means extremely slow progress in the shallow direction.",
            what: "Boris Polyak introduced momentum (1964): maintain a velocity vector <InlineMath tex='v' /> that accumulates past gradients exponentially, and move by the velocity rather than the raw gradient. This dampens oscillations (velocity in oscillating directions cancels out) and accelerates progress in consistent directions (velocity builds up). Yurii Nesterov (1983) improved this with a look-ahead: compute the gradient at where momentum will take you, not where you are now — the 'Nesterov Accelerated Gradient' that achieves the theoretically optimal convergence rate for convex functions.",
            impact:
                "Momentum is a standard component of almost every modern optimiser. PyTorch's SGD with momentum (β = 0.9) is a first-line choice for many tasks. Nesterov momentum is theoretically optimal for convex problems and practically useful for deep networks. Adam (2014) incorporates a form of momentum as one of its two adaptive components. The idea that gradient descent should accumulate a sense of direction — not just react to each step's local gradient — is foundational to all high-performance optimisation.",
        },
        {
            year: "1986",
            title: "Mini-Batch SGD — The Workhorse of Deep Learning",
            challenge:
                "Rumelhart, Hinton, and Williams' 1986 backpropagation paper initially presented batch gradient descent — compute gradients over all training examples, then update weights. For small toy problems this was fine, but for real applications (LeCun's digit recognition, speech recognition at CMU) datasets were large enough that waiting for a full-batch gradient was impractical. Online (single-sample) SGD was too noisy. A middle ground was needed.",
            what: "Bottou and LeCun formalised mini-batch stochastic gradient descent through the late 1980s and 1990s: compute the gradient over a small random subset (batch) of examples, update weights, repeat. Batch size became a hyperparameter: small batches (1–16) gave noisy but fast updates; large batches (256–2048) gave more accurate but expensive updates. The batch size also affected the implicit regularisation of training — small batches found flatter minima that generalised better.",
            impact:
                "Mini-batch SGD is the universal training algorithm. Every major neural network ever trained — from LeNet to GPT-4 — used mini-batch SGD or a variant. The batch size choice interacts with learning rate (linear scaling rule: double the batch, double the LR), GPU memory, and generalisation in subtle ways that active research is still unravelling. Modern training pipelines are built around the mini-batch loop: sample a batch, forward pass, backward pass, update, repeat.",
        },
        {
            year: "1995 – 2012",
            title: "Learning Rate Sensitivity — The Art and Science of Tuning",
            challenge:
                "As neural networks grew deeper and datasets larger, the learning rate became the most critical and fragile hyperparameter. Too large: training diverges — weights explode, loss goes to infinity. Too small: training converges to a poor local minimum or takes thousands of hours. The optimal learning rate changed during training (high early on, lower later) and varied between different layers (early layers often needed different rates than later ones). Finding the right rate was more art than science.",
            what: "A succession of techniques addressed learning rate sensitivity: learning rate schedules (step decay, cosine annealing, warmup), per-parameter adaptive rates (AdaGrad 2011, which accumulated gradient squares to set individual rates), and eventually fully adaptive optimisers (RMSProp 2012, Adam 2014). The learning rate warmup heuristic — start from near-zero, ramp up over the first few epochs, then decay — was introduced for very deep networks and later became standard for Transformers.",
            impact:
                "Adaptive optimisers (Adam, RMSProp, AdaGrad) dramatically reduced the sensitivity of training to learning rate choice by automatically adjusting the effective step size for each parameter. This made deep learning more accessible — researchers spent less time on learning rate search and more on architecture. But adaptive methods sometimes generalise slightly worse than carefully tuned SGD with momentum, creating an ongoing debate about when to use which.",
        },
        {
            year: "2014 – present",
            title: "Adam and the Adaptive Methods Era",
            challenge:
                "By 2014, deep learning researchers had accumulated a proliferation of optimiser choices: SGD, SGD with momentum, Nesterov momentum, AdaGrad, RMSProp, each with its own strengths. AdaGrad's accumulated gradient squares grew unboundedly, causing the learning rate to shrink to zero prematurely on long training runs. A unified, reliable optimiser that combined momentum with adaptive rates — and was robust enough for practitioners to use without deep expertise in optimisation theory — was needed.",
            what: "Diederik Kingma and Jimmy Ba published 'Adam: A Method for Stochastic Optimisation' (2014, ICLR 2015). Adam maintained two exponentially decaying moving averages: the first moment (mean of gradients, like momentum) and the second moment (mean of squared gradients, like RMSProp). Bias correction made these estimates accurate in the first few steps. The effective step size was <InlineMath tex='\\eta / \\sqrt{\\hat{v} + \\epsilon}' /> where <InlineMath tex='\\hat{v}' /> was the bias-corrected second moment.",
            impact:
                "Adam became the default optimiser for deep learning research within a year of its publication — and remains so a decade later. Its combination of momentum, adaptive rates, and bias correction made it robust across a wide range of architectures, tasks, and hyperparameter choices. The paper is one of the most cited in all of computer science. Its variants (AdaW, AdamW, RAdam, Lamb) power the training of every large language model built since 2018.",
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
            <h2>How does a network know which way is downhill?</h2>

            <Analogy label="The Loss Landscape — An Invisible Mountain Range">
                Training a neural network means finding the set of weights that makes the network's predictions as close as possible to the true answers. Imagine every possible combination of weights as a point in a vast, high-dimensional landscape. The height at each point is the <em>loss</em> — how wrong the network currently is.
                <br /><br />
                You start somewhere random (the initialisation), and you want to get to the lowest valley — the minimum loss. You can't see the whole landscape at once. You can only feel the slope under your feet — the gradient. Gradient descent means: always step in the downhill direction.
            </Analogy>

            <Analogy label="Batch GD — Consult the Whole Class Before Deciding">
                Imagine you're a teacher trying to improve your lesson. Batch gradient descent means: ask every student in the class how the lesson went, average all their feedback, then make one change.
                <br /><br />
                The feedback you get is very accurate — the average of many students is a reliable signal. But it takes a long time to collect, and you only make one change per round. If you have 10,000 students, collecting all their feedback before each change is exhausting.
            </Analogy>

            <Analogy label="SGD — Ask One Student, Adjust Immediately">
                Stochastic gradient descent is the opposite: ask just one student, immediately adjust based on what they say, then ask the next student.
                <br /><br />
                This is very fast — one question, one change. But the feedback is noisy: maybe this particular student had a bad day and their comment doesn't represent the class. You'll zig-zag a lot. But on average, across thousands of adjustments, you'll move in the right direction.
                <br /><br />
                The noise is actually sometimes helpful — it can bounce you out of local dead-ends (sharp minima) that a more careful method would get stuck in.
            </Analogy>

            <Analogy label="Mini-Batch — Ask a Small Group">
                Mini-batch SGD is the practical middle ground: ask a group of 32–256 students, average their feedback, then adjust. This is fast (you don't wait for the whole class), accurate enough (averaging 32 responses is reasonably reliable), and still noisy enough to avoid getting stuck.
                <br /><br />
                This is exactly how every modern neural network is trained. The "batch size" is how many students you ask each round. Bigger batch = more accurate gradient but more time per step. Smaller batch = faster but noisier.
            </Analogy>

            <Analogy label="Momentum — Building Up Speed">
                Plain gradient descent treats each step independently — it only knows the current slope, not where it's been. Momentum adds a sense of direction and inertia: instead of reacting purely to the current slope, the step also includes a fraction of the previous step's direction.
                <br /><br />
                Think of a ball rolling down a hill: it doesn't just move in the direction the hill is sloping right now — it carries its previous momentum. On a curvy path, the ball naturally smooths out the curves and goes faster in the consistent downhill direction.
                <br /><br />
                In neural network training: momentum accumulates a moving average of past gradients, allowing the optimiser to accelerate in consistent directions and slow down in oscillating ones.
            </Analogy>

            <Analogy label="Adam — The Adaptive Teacher">
                Adam (Adaptive Moment Estimation) goes further: it keeps track of both the average gradient direction (momentum) and how much each weight has been changing (the gradient's variance). Weights that have been changing a lot get a smaller step size; weights that haven't changed much get a larger one.
                <br /><br />
                It's like a teacher who notices which aspects of the lesson students consistently complain about (high variance) and which they're consistently happy about (low variance), and adjusts those parts accordingly. Adam's sensitivity makes it robust to different learning rate choices — which is why it became the default optimiser for deep learning research.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The gradient descent family</h2>

            <h3>The core update rule</h3>
            <p>
                Given parameters <InlineMath tex="\theta" />, loss <InlineMath tex="L(\theta)" />, and learning rate <InlineMath tex="\eta > 0" />, gradient descent moves parameters in the direction of steepest descent:
            </p>
            <MathBlock tex="\theta \leftarrow \theta - \eta \cdot \nabla_\theta L(\theta)" />
            <p>
                The three variants differ only in how the gradient is estimated:
            </p>

            <h3>Batch, stochastic, and mini-batch</h3>
            <MathBlock tex="\text{Batch:}\quad \nabla_\theta L = \frac{1}{N} \sum_{i=1}^{N} \nabla_\theta \ell(x_i, y_i; \theta)" />
            <MathBlock tex="\text{Mini-batch:}\quad \nabla_\theta \hat{L} = \frac{1}{B} \sum_{i \in \mathcal{B}} \nabla_\theta \ell(x_i, y_i; \theta)" />
            <p>
                where <InlineMath tex="\mathcal{B}" /> is a randomly sampled batch of size <InlineMath tex="B" />. As <InlineMath tex="B \to N" /> this approaches batch GD; as <InlineMath tex="B \to 1" /> it approaches single-sample SGD. The gradient variance scales as <InlineMath tex="\text{Var}[\hat{g}] = \text{Var}[g] / B" /> — doubling the batch halves the variance.
            </p>

            <h3>Momentum</h3>
            <MathBlock tex="v \leftarrow \beta v + (1 - \beta) \nabla_\theta L(\theta), \qquad \theta \leftarrow \theta - \eta v" />
            <p>
                where <InlineMath tex="v" /> is the velocity (exponentially weighted moving average of past gradients) and <InlineMath tex="\beta \in [0, 1)" /> (typically 0.9). Momentum damps oscillations and accelerates convergence in low-curvature directions.
            </p>

            <h3>Adam — adaptive moment estimation</h3>
            <MathBlock tex="m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t, \quad v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2" />
            <MathBlock tex="\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}, \quad \theta \leftarrow \theta - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}" />
            <p>
                where <InlineMath tex="g_t" /> is the gradient at step <em>t</em>, <InlineMath tex="\beta_1 = 0.9" />, <InlineMath tex="\beta_2 = 0.999" />, and <InlineMath tex="\epsilon = 10^{-8}" /> prevents division by zero. The bias-correction terms <InlineMath tex="\hat{m}_t" /> and <InlineMath tex="\hat{v}_t" /> correct for the zero-initialised running averages being biased toward zero in early steps.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Saddle points vs. local minima:</strong> in high-dimensional loss landscapes (millions of parameters), true local minima are rare — a point that is a minimum in every direction simultaneously is exponentially unlikely. Most stationary points are <em>saddle points</em>: minima in some directions, maxima in others. SGD's gradient noise and momentum together help escape saddle points; second-order methods (Newton's method) converge to saddle points exactly, which is one reason first-order methods dominate in practice.
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
            <h2>Convergence theory</h2>

            <DefBlock label="Convergence of SGD (Robbins-Monro, 1951)">
                If the stochastic gradient estimates <InlineMath tex="g_t" /> are unbiased (<InlineMath tex="\mathbb{E}[g_t] = \nabla L(\theta_t)" />) and have bounded variance (<InlineMath tex="\mathbb{E}[\|g_t - \nabla L\|^2] \leq \sigma^2" />), and if the learning rate schedule satisfies:
                <MathBlock tex="\sum_{t=0}^{\infty} \eta_t = \infty \quad \text{and} \quad \sum_{t=0}^{\infty} \eta_t^2 < \infty" />
                then SGD converges to a stationary point almost surely. A common schedule: <InlineMath tex="\eta_t = \eta_0 / (1 + \gamma t)" /> satisfies both conditions.
            </DefBlock>

            <h3>Convergence rate for convex functions</h3>
            <p>
                For an <em>L-smooth</em> (<InlineMath tex="\|\nabla L(x) - \nabla L(y)\| \leq L\|x-y\|" />) convex loss with batch GD and constant learning rate <InlineMath tex="\eta = 1/L" />:
            </p>
            <MathBlock tex="L(\theta_T) - L(\theta^*) \leq \frac{\|\theta_0 - \theta^*\|^2}{2\eta T} = \frac{L \|\theta_0 - \theta^*\|^2}{2T}" />
            <p>
                This is an O(1/T) convergence rate — to get a solution within ε of optimal requires O(1/ε) gradient steps. SGD achieves O(1/T) in expectation with decaying learning rates.
            </p>

            <h3>The generalisation mystery</h3>
            <p>
                Large-batch SGD (B = 8192 or more) typically finds <em>sharp minima</em> — regions where the loss curvature is high, meaning small perturbations in weights cause large increases in loss. Small-batch SGD (B = 32–256) tends to find <em>flat minima</em> — where the loss surface is gently curved. Hochreiter and Schmidhuber (1997) argued that flat minima generalise better because they are less sensitive to the difference between the training distribution and the test distribution.
            </p>
            <MathBlock tex="\text{Sharpness} = \lambda_{\max}(\nabla^2 L(\theta^*))" />
            <p>
                where <InlineMath tex="\lambda_{\max}" /> is the largest Hessian eigenvalue. Keskar et al. (2017) confirmed empirically that large-batch training consistently produces sharper minima. This is why batch size is not just a computational choice but a regularisation one.
            </p>

            <h3>Adam's bias correction</h3>
            <p>
                Adam initialises <InlineMath tex="m_0 = 0" /> and <InlineMath tex="v_0 = 0" />. At step <em>t</em>, the raw moving average <InlineMath tex="m_t = (1-\beta_1^t) \mathbb{E}[g]" /> is biased toward zero. The bias correction <InlineMath tex="\hat{m}_t = m_t / (1-\beta_1^t)" /> removes this bias, ensuring accurate moment estimates even in the first few steps — which is where the learning rate is most critical.
            </p>

            <div className="ch-callout">
                <strong>Learning rate and batch size:</strong> Goyal et al. (2017, Facebook AI) demonstrated the <em>linear scaling rule</em> — when multiplying batch size by <em>k</em>, multiply the learning rate by <em>k</em> to maintain similar convergence behaviour. Coupled with a 5-epoch warmup (start from η/k, ramp to η linearly), this enabled training ResNet-50 on ImageNet in one hour instead of the standard 29 hours.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn

# ── 1D loss landscape to compare optimisers visually ─────────────────────────
def loss_fn(theta):
    # Non-convex: multiple local minima
    return theta**4 - 14*theta**3 + 60*theta**2 - 70*theta

def grad_fn(theta):
    return 4*theta**3 - 42*theta**2 + 120*theta - 70

theta_range = np.linspace(-1, 7, 400)
minimum_idx = np.argmin(loss_fn(theta_range))
print(f"Global minimum near theta={theta_range[minimum_idx]:.2f}")

# ── Implement optimisers from scratch ─────────────────────────────────────────
def run_gd(start, lr, steps, noise_std=0.0):
    """Generic gradient descent with optional SGD-style noise."""
    theta = float(start)
    history = [theta]
    v = 0.0   # momentum velocity (unused if beta=0)
    for _ in range(steps):
        g = grad_fn(theta) + noise_std * np.random.randn()
        theta -= lr * g
        history.append(theta)
    return history

def run_momentum(start, lr, beta, steps):
    theta = float(start)
    v = 0.0
    history = [theta]
    for _ in range(steps):
        g = grad_fn(theta)
        v = beta * v + (1 - beta) * g
        theta -= lr * v
        history.append(theta)
    return history

np.random.seed(42)
start = 6.0   # start in a local minimum region

h_batch   = run_gd(start, lr=0.001, steps=2000)
h_sgd     = run_gd(start, lr=0.001, steps=2000, noise_std=0.5)
h_momentum = run_momentum(start, lr=0.001, beta=0.9, steps=2000)

for name, h in [("Batch GD", h_batch), ("SGD", h_sgd), ("Momentum", h_momentum)]:
    print(f"{name:>10}: converged to theta={h[-1]:.3f}, loss={loss_fn(h[-1]):.3f}")

# ── Adam from scratch ─────────────────────────────────────────────────────────
def run_adam(start, lr=0.1, b1=0.9, b2=0.999, eps=1e-8, steps=500):
    theta = float(start)
    m, v = 0.0, 0.0
    history = [theta]
    for t in range(1, steps + 1):
        g = grad_fn(theta)
        m = b1 * m + (1 - b1) * g
        v = b2 * v + (1 - b2) * g**2
        m_hat = m / (1 - b1**t)   # bias correction
        v_hat = v / (1 - b2**t)
        theta -= lr * m_hat / (np.sqrt(v_hat) + eps)
        history.append(theta)
    return history

h_adam = run_adam(start)
print(f"     Adam: converged to theta={h_adam[-1]:.3f}, loss={loss_fn(h_adam[-1]):.3f}")

# ── PyTorch: compare on XOR ───────────────────────────────────────────────────
X = torch.tensor([[0,0],[0,1],[1,0],[1,1]], dtype=torch.float32)
y = torch.tensor([[0],[1],[1],[0]], dtype=torch.float32)

def train_xor(optimiser_cls, **kw):
    torch.manual_seed(0)
    model = nn.Sequential(nn.Linear(2,8), nn.ReLU(), nn.Linear(8,1), nn.Sigmoid())
    opt = optimiser_cls(model.parameters(), **kw)
    for _ in range(5000):
        loss = nn.functional.binary_cross_entropy(model(X), y)
        opt.zero_grad(); loss.backward(); opt.step()
    return nn.functional.binary_cross_entropy(model(X), y).item()

print("\\nXOR final loss comparison:")
print(f"  SGD (lr=0.1):           {train_xor(torch.optim.SGD, lr=0.1):.5f}")
print(f"  SGD+momentum (lr=0.1):  {train_xor(torch.optim.SGD, lr=0.1, momentum=0.9):.5f}")
print(f"  Adam (lr=0.01):         {train_xor(torch.optim.Adam, lr=0.01):.5f}")
print(f"  AdamW (lr=0.01):        {train_xor(torch.optim.AdamW, lr=0.01):.5f}")`

function PythonContent() {
    return (
        <>
            <p>
                From-scratch implementations of batch GD, SGD, momentum, and Adam on a non-convex
                1D loss landscape, followed by a comparison of PyTorch optimisers on XOR. The 1D
                landscape shows how SGD noise and momentum interact with local minima; the XOR
                comparison shows Adam's practical superiority on small-scale deep networks.
            </p>
            <CodeBlock code={PY_CODE} filename="gradient_descent.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>What to observe:</strong> batch GD and momentum often converge to the same local
                minimum they started near. SGD's noise sometimes escapes to a better minimum — at the
                cost of noisier convergence. Adam finds a good solution fastest on XOR, typically
                converging in 200–500 steps versus 3000+ for vanilla SGD.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const GRADIENT_DESCENT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
