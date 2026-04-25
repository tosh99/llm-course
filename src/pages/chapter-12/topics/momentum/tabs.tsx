import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 11 introduced generative models — Variational Autoencoders (2013) and Generative Adversarial Networks (2014) — that required training complex competing networks simultaneously. GANs oscillated wildly; VAEs were sensitive to hyperparameters. These failures exposed a deeper truth: the training algorithm itself was a bottleneck. The optimization tools assembled in Chapter 12 were developed in parallel with everything in Chapters 5 through 11, providing the training infrastructure the entire deep learning revolution depended on.
            </p>
            <h2>From physics intuition to deep learning necessity</h2>
            <p>
                Momentum in optimization borrows directly from classical mechanics: a ball rolling downhill accelerates in the dominant direction and resists being deflected by minor bumps. Applied to gradient descent, this intuition solves one of the most persistent problems in training neural networks — the zig-zagging trajectory caused by noisy, high-curvature loss surfaces. The history of momentum is a sixty-year arc from a Soviet mathematician's numerical analysis paper to the inner workings of every major language model trained today.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1964</div>
                    <div className="ch-tl-section-label">Origin</div>
                    <div className="ch-tl-title">Polyak's Heavy Ball Method</div>
                    <div className="ch-tl-body">
                        Boris Polyak introduced the <em>heavy ball method</em> in his 1964 paper "Some methods of speeding up the convergence of iteration methods." The core idea came directly from classical mechanics: a heavy ball rolling down a frictionless surface accumulates velocity and doesn't stop at every small dip. Polyak's update rule v<sub>t</sub> = γv<sub>t-1</sub> + η∇L(θ) accumulates gradient history as a velocity vector, allowing the optimizer to build up speed in consistent directions and dampen oscillations in inconsistent ones.
                        <br /><br />
                        The momentum coefficient γ was typically set to 0.9 — meaning 90% of the previous velocity is retained at each step. This seemingly small change had a dramatic effect on convergence speed: on a quadratic with condition number κ, the heavy ball method reduces the number of steps from O(κ) to O(√κ). For ill-conditioned problems (large κ), this is a massive improvement.
                        <br /><br />
                        However, Polyak's heavy ball method had known failure modes on non-convex functions — the very type of loss surface that neural networks present. It could overshoot dramatically and oscillate. The theoretical understanding of when momentum helps and when it hurts took decades to develop.
                    </div>
                    <div className="ch-tl-impact">Impact: First rigorous formulation of momentum for numerical optimization; introduced the velocity accumulation concept</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1983</div>
                    <div className="ch-tl-section-label">Theoretical Advance</div>
                    <div className="ch-tl-title">Nesterov Accelerated Gradient — Optimal First-Order Method</div>
                    <div className="ch-tl-body">
                        Yurii Nesterov published "A method for solving convex programming problem with convergence rate O(1/k²)," a paper that would eventually be recognized as one of the most important results in optimization theory. His key insight was simple but profound: instead of computing the gradient at the current position, compute it at the <em>anticipated next position</em> — where momentum will carry the parameters to.
                        <br /><br />
                        The look-ahead gradient is more informative because it evaluates the landscape after the momentum step, allowing the optimizer to correct course before it overshoots. If the loss is increasing in the direction momentum is carrying you, the look-ahead gradient warns you to slow down. Classic momentum only discovers the overshoot after it lands.
                        <br /><br />
                        Nesterov proved his method achieves O(1/k²) convergence on smooth convex functions, compared to O(1/k) for plain gradient descent. This rate is provably optimal for any first-order method — meaning no gradient-only algorithm can do better in the worst case. Though Nesterov's original proof applied to convex functions, the practical impact on neural networks would not be understood until nearly thirty years later.
                    </div>
                    <div className="ch-tl-impact">Impact: Optimal O(1/k²) convergence — theoretical gold standard for first-order methods; proved no gradient algorithm can do better</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986</div>
                    <div className="ch-tl-section-label">Neural Networks</div>
                    <div className="ch-tl-title">Momentum in Backpropagation — Rumelhart, Hinton, Williams</div>
                    <div className="ch-tl-body">
                        Rumelhart, Hinton, and Williams' famous backpropagation paper "Learning representations by back-propagating errors" included momentum as a standard component of the training recipe — not as an optional enhancement, but as a necessary ingredient for reliable training. For neural networks, momentum solved a problem that went beyond convergence speed: it made training qualitatively possible.
                        <br /><br />
                        Neural network loss surfaces are not smooth quadratics — they are high-dimensional, non-convex, riddled with narrow valleys and saddle points. Plain SGD would zig-zag uncontrollably in the presence of ill-conditioned curvature (steep in one direction, flat in another), making progress along the shallow direction impossibly slow while oscillating across the steep direction. Momentum damped these oscillations and accelerated progress toward flat minima.
                        <br /><br />
                        The practical effect was dramatic: networks that took thousands of epochs to converge with plain gradient descent would converge in hundreds with momentum at γ = 0.9. This is not a marginal improvement — it was the difference between tractable and intractable training for even small networks by 1986 standards.
                    </div>
                    <div className="ch-tl-impact">Impact: Established momentum as standard practice in neural network training; made deep network training qualitatively feasible</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Deep Learning Validation</div>
                    <div className="ch-tl-title">Sutskever et al. — Nesterov Is Crucial for Deep Nets</div>
                    <div className="ch-tl-body">
                        Ilya Sutskever, James Martens, George Dahl, and Geoffrey Hinton published "On the importance of initialization and momentum in deep learning," a systematic empirical and theoretical study that settled a long-standing question: does the choice of momentum type (classical Polyak vs. Nesterov) matter for deep learning?
                        <br /><br />
                        The answer was yes. With careful initialization, Nesterov momentum could match or exceed second-order methods (like Hessian-free optimization) on deep networks — a class of methods that use curvature information and are far more expensive to compute. More importantly, the paper demonstrated that Nesterov's look-ahead gradient provides a meaningfully better learning signal in the non-convex setting, not just the convex one that Nesterov's theory covers.
                        <br /><br />
                        This paper also introduced the "momentum schedule" idea: starting with low momentum (γ = 0.5) and gradually increasing it to γ = 0.99 over training, analogous to simulated annealing but for the optimizer state. This schedule prevents early oscillations while achieving high effective learning rates later in training.
                    </div>
                    <div className="ch-tl-impact">Impact: Validated Nesterov as the momentum of choice for deep learning; introduced momentum scheduling; matched second-order methods</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014–2017</div>
                    <div className="ch-tl-section-label">Synthesis</div>
                    <div className="ch-tl-title">Momentum Inside Adam and Cyclical Momentum</div>
                    <div className="ch-tl-body">
                        Kingma and Ba's Adam optimizer (2014) incorporated momentum as its "first moment estimate" — the exponential moving average m<sub>t</sub> = β₁m<sub>t-1</sub> + (1−β₁)g<sub>t</sub>. With default β₁ = 0.9, this is essentially Polyak momentum with a specific bias-correction enhancement. Adam's success meant that momentum became universal: even practitioners who never explicitly used SGD+momentum were using it implicitly via Adam.
                        <br /><br />
                        Leslie Smith (2017) introduced cyclical momentum in his one-cycle policy: momentum cycles in reverse to the learning rate. When the learning rate is high (early training), momentum is kept low (0.85) to prevent overshooting. When the learning rate decreases (late training), momentum rises (0.95) to stabilize convergence. This inverse relationship captures an empirical truth: high momentum and high learning rate together cause instability, but cycling them out of phase provides the benefits of both.
                    </div>
                    <div className="ch-tl-impact">Impact: Momentum became universal through Adam; cyclical momentum (Smith 2017) further refined the concept for practical training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Modern Era</div>
                    <div className="ch-tl-title">Lion — Pure Momentum Sign Updates</div>
                    <div className="ch-tl-body">
                        Google Brain's Chen et al. introduced Lion (EvoLved Sign Momentum) in 2023, discovered by an evolutionary search algorithm rather than designed by hand. Lion reduces the Adam update to its essential core: update = sign(β₁·m + (1−β₁)·g), then update momentum m ← β₁·m + (1−β₁)·g. The sign operation means every parameter takes a step of exactly ±η — the adaptive scaling of Adam is replaced by pure sign momentum.
                        <br /><br />
                        Lion uses 2–3× less memory than Adam (no second moment), converges faster on vision and language tasks, and achieves competitive performance despite its simplicity. Its design underscores that the core value of momentum — accumulated gradient direction — remains the foundation of optimization, even as the specific update rule continues to evolve.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed pure sign momentum can match Adam; memory-efficient alternative for large model training</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Legacy:</strong> Momentum remains the foundation of every modern optimizer. Adam, AdaGrad, RMSProp — all incorporate momentum in their first-moment estimate. Even when practitioners use Adam, they are implicitly using a variant of momentum with adaptive scaling per parameter. The effective learning rate formula η/(1−γ) shows that γ = 0.9 already multiplies the learning rate by 10× in the consistent gradient direction — momentum is not a minor enhancement but a fundamental change to how fast a network learns.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 11 showed that neural networks could generate images — but getting them to learn reliably was still a struggle. One wrong step size and the network zig-zagged for thousands of steps without improving. Chapter 12 is the story of how researchers built smarter learning algorithms — so networks could find good solutions faster, more reliably, and at greater depth.
            </p>
            <h2>Rolling a ball down a bumpy hill</h2>

            <Analogy label="Why Plain Steps Zig-Zag">
                Imagine you're trying to find the bottom of a valley in the dark, and all you can do is feel which direction is downhill and take one step. But the valley is shaped like a long narrow canyon — wide in one direction, narrow in the other.
                <br /><br />
                Every step, you feel a huge "downhill" push sideways (across the canyon) and a tiny push forward (along the canyon floor). So you keep bouncing back and forth across the canyon while barely moving forward. That's <strong>plain gradient descent</strong> — it zig-zags because the gradient always pulls toward the steep walls.
            </Analogy>

            <Analogy label="Momentum: You're a Rolling Ball">
                Now imagine you're not taking steps — you're a ball rolling down the same canyon.
                <br /><br />
                Each bounce sideways loses energy, but your forward motion builds up. By the 10th bounce, the sideways motion has mostly cancelled out, but the forward momentum has accumulated — you're rolling faster toward the bottom.
                <br /><br />
                That's exactly what momentum does for gradient descent. The sideways gradients (the inconsistent ones) cancel each other. The forward gradients (the consistent ones) add up. You converge much faster.
            </Analogy>

            <Analogy label="Nesterov: Look Before You Leap">
                Classic momentum computes the gradient where you <em>are</em>, then adds it to your existing velocity. But you could be smarter: use your velocity to predict where you'll <em>end up</em>, and compute the gradient <em>there</em> instead.
                <br /><br />
                If you're about to overshoot the bottom of a hill, computing the gradient at your predicted future position will warn you to slow down — before you overshoot. Classic momentum only realizes it overshot after it lands. That's the Nesterov advantage: it's forward-looking.
            </Analogy>

            <Analogy label="The Effective Speed-Up: Why γ = 0.9 Matters So Much">
                Here's the surprising math. With momentum γ = 0.9, a gradient direction that keeps pushing in the same direction eventually accumulates a velocity that's 10 times the raw learning rate. If your learning rate is 0.01, your effective speed in a consistent direction becomes 0.01 / (1 − 0.9) = 0.1 — ten times faster.
                <br /><br />
                With γ = 0.99, it's one hundred times faster. With γ = 0.999, one thousand times. The ball keeps speeding up with each consistent push, which is exactly how a physical ball accelerates under a constant force. Momentum doesn't just smooth out zig-zags — it dramatically amplifies progress in the right direction.
            </Analogy>

            <Analogy label="Adam: Momentum That Knows Its Own Scale">
                The Adam optimizer — used in almost every major AI system — includes momentum as its "first moment": a running average of recent gradients that tells the optimizer which direction is consistently downhill. But Adam adds a second ingredient: a running average of how <em>large</em> the gradients have been, to scale the step size appropriately.
                <br /><br />
                Think of it as a ball that remembers both the direction it's been rolling (momentum) and how steep the slope has been (scaling). Steep slopes get smaller steps; flat slopes get bigger steps. The result is an optimizer that is both fast and stable — which is why it became the default for training everything from image classifiers to large language models.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Velocity accumulation and look-ahead gradients</h2>

            <h3>Plain SGD — The Baseline</h3>
            <p>
                Standard stochastic gradient descent updates parameters directly by the gradient:
            </p>
            <MathBlock tex="\theta_t = \theta_{t-1} - \eta \nabla_\theta \mathcal{L}(\theta_{t-1})" />
            <p>
                At each step, the direction is determined entirely by the local gradient, with no memory of previous steps. On curved loss surfaces, this causes oscillations.
            </p>

            <h3>SGD with Momentum (Polyak, 1964)</h3>
            <p>
                Introduce a velocity vector v<sub>t</sub> that accumulates gradient history:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + \eta \nabla_\theta \mathcal{L}(\theta_{t-1})" />
            <MathBlock tex="\theta_t = \theta_{t-1} - v_t" />
            <p>
                γ is the momentum coefficient (typically 0.9). The velocity is an exponential moving average of all past gradients — consistent gradients accumulate, inconsistent ones cancel.
            </p>

            <h3>What Does γ = 0.9 Mean?</h3>
            <ul>
                <li>The current gradient contributes η · ∇L to the velocity</li>
                <li>The gradient from 2 steps ago contributes γ · η · ∇L = 0.9 × η · ∇L</li>
                <li>From 10 steps ago: γ<sup>10</sup> · η · ∇L = 0.9<sup>10</sup> · η · ∇L ≈ 0.35 · η · ∇L</li>
                <li>From 50 steps ago: 0.9<sup>50</sup> ≈ 0.005 · η · ∇L (nearly zero)</li>
            </ul>
            <p>
                Momentum has an effective window of roughly 1/(1−γ) = 1/0.1 = 10 gradient steps. The effective learning rate in a consistent gradient direction is η/(1−γ) = 10η — a 10× speedup.
            </p>

            <h3>Nesterov Accelerated Gradient</h3>
            <p>
                Nesterov's improvement: compute the gradient at the <em>lookahead position</em> (where momentum would carry us) rather than the current position:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + \eta \nabla_\theta \mathcal{L}(\theta_{t-1} - \gamma v_{t-1})" />
            <MathBlock tex="\theta_t = \theta_{t-1} - v_t" />
            <p>
                The term θ<sub>t-1</sub> − γv<sub>t-1</sub> is the "lookahead" position — where the parameter would be after the momentum step alone. The gradient there is more informative for the actual update direction.
            </p>

            <h3>EMA Interpretation and Effective Learning Rate</h3>
            <p>
                Unrolling the velocity recurrence, the velocity is a geometric series of all past gradients:
            </p>
            <MathBlock tex="v_t = \eta \sum_{k=0}^{t} \gamma^k \nabla \mathcal{L}(\theta_{t-k})" />
            <p>
                For a constant gradient g, the steady-state velocity is η · g · Σγ<sup>k</sup> = η · g / (1−γ). This is the effective learning rate formula: a consistent gradient direction sees an amplified step of size η/(1−γ).
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why Nesterov is better:</strong> On a convex function, Nesterov achieves O(1/k²) convergence compared to O(1/k) for plain gradient descent. Intuitively: if you know you're about to overshoot a minimum, computing the gradient at the overshoot point warns you to slow down — before it happens.
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
            <h2>Convergence theory, effective step size, and implementation</h2>

            <DefBlock label="SGD with Momentum (Polyak, 1964)">
                Let <InlineMath tex="\eta > 0" /> be the learning rate, <InlineMath tex="\gamma \in [0,1)" /> the momentum coefficient,
                <InlineMath tex="\nabla L(\theta)" /> the gradient of loss at θ. Define velocity <InlineMath tex="v_0 = 0" />. Then:
                <MathBlock tex="v_t = \gamma\, v_{t-1} + \eta\, \nabla L(\theta_{t-1})" />
                <MathBlock tex="\theta_t = \theta_{t-1} - v_t" />
            </DefBlock>

            <h3>Expanding the Velocity</h3>
            <p>
                Unrolling the recurrence for v<sub>t</sub>:
            </p>
            <MathBlock tex="v_t = \eta \sum_{k=0}^{t} \gamma^k \nabla \mathcal{L}(\theta_{t-k})" />
            <p>
                The velocity is a geometric series weighted sum of all past gradients. The effective learning rate in the direction of a consistent gradient g is:
            </p>
            <MathBlock tex="\eta_{\text{eff}} = \eta \sum_{k=0}^{\infty} \gamma^k = \frac{\eta}{1 - \gamma}" />
            <p>
                With γ = 0.9 and η = 0.01: η<sub>eff</sub> = 0.01 / 0.1 = 0.1 — a 10× speedup in the consistent direction.
            </p>

            <h3>Nesterov Accelerated Gradient (NAG)</h3>
            <MathBlock tex="\begin{aligned} v_t &= \gamma v_{t-1} + \eta \nabla \mathcal{L}(\theta_{t-1} - \gamma v_{t-1}) \\ \theta_t &= \theta_{t-1} - v_t \end{aligned}" />
            <p>
                Equivalently, defining θ̃<sub>t</sub> = θ<sub>t</sub> − γv<sub>t</sub> (the "lookahead" parameter):
            </p>
            <MathBlock tex="\theta_t = \theta_{t-1} - \eta \nabla \mathcal{L}(\theta_{t-1} - \gamma v_{t-1}) - \gamma(v_{t-1} - v_{t-2})" />
            <p>
                Nesterov includes a correction term proportional to the velocity change — it anticipates and partially reverses the momentum step when the gradient direction changes.
            </p>

            <h3>Convergence Rates</h3>
            <MathBlock tex="\begin{array}{ll} \textbf{Method} & \textbf{Convex convergence} \\ \hline \text{Gradient Descent} & O(1/k) \\ \text{Polyak Momentum} & O(1/k) \text{ (same class)} \\ \text{Nesterov NAG} & O(1/k^2) \text{ (optimal for first-order)} \end{array}" />

            <h3>Practical Implementation Note: PyTorch's Nesterov</h3>
            <p>
                PyTorch implements NAG in a slightly different (but equivalent) form. Defining the update as:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + g_t \quad \theta_t = \theta_{t-1} - \eta(g_t + \gamma v_t)" />
            <p>
                where g<sub>t</sub> = ∇L(θ<sub>t-1</sub>). This avoids the extra forward pass through the loss at the lookahead position while achieving mathematically equivalent updates.
            </p>

            <div className="ch-callout">
                <strong>Non-convex setting:</strong> In deep learning, loss surfaces are highly non-convex. The theoretical guarantees above apply to convex functions, but momentum still empirically helps by: (1) dampening gradient noise through averaging, (2) escaping shallow local minima by carrying inertia through small barriers, (3) accelerating convergence in low-curvature directions.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# ── Quadratic loss landscape ───────────────────────────────────────────────────
# f(x, y) = 0.1*x^2 + 10*y^2
# A narrow valley: high curvature in y, low in x
# SGD will zig-zag; momentum converges smoothly

def loss(params):
    x, y = params
    return 0.1 * x**2 + 10.0 * y**2

def grad(params):
    x, y = params
    return np.array([0.2 * x, 20.0 * y])

# ── SGD (no momentum) ─────────────────────────────────────────────────────────
def sgd(lr=0.09, steps=50):
    theta = np.array([10.0, 1.0])
    path = [theta.copy()]
    for _ in range(steps):
        g = grad(theta)
        theta = theta - lr * g
        path.append(theta.copy())
    return np.array(path)

# ── SGD with Momentum ─────────────────────────────────────────────────────────
def sgd_momentum(lr=0.09, gamma=0.9, steps=50):
    theta = np.array([10.0, 1.0])
    v = np.zeros(2)
    path = [theta.copy()]
    for _ in range(steps):
        g = grad(theta)
        v = gamma * v + lr * g
        theta = theta - v
        path.append(theta.copy())
    return np.array(path)

# ── Nesterov Momentum ─────────────────────────────────────────────────────────
def nesterov(lr=0.09, gamma=0.9, steps=50):
    theta = np.array([10.0, 1.0])
    v = np.zeros(2)
    path = [theta.copy()]
    for _ in range(steps):
        # Lookahead position
        lookahead = theta - gamma * v
        g = grad(lookahead)
        v = gamma * v + lr * g
        theta = theta - v
        path.append(theta.copy())
    return np.array(path)

# ── Run and compare ────────────────────────────────────────────────────────────
path_sgd  = sgd()
path_mom  = sgd_momentum()
path_nest = nesterov()

print("=" * 60)
print("Convergence Comparison on Narrow Valley f(x,y) = 0.1x^2 + 10y^2")
print("=" * 60)
print(f"{'Steps':>6} | {'SGD loss':>12} | {'Momentum':>12} | {'Nesterov':>12}")
print("-" * 50)
for step in [0, 5, 10, 20, 30, 49]:
    l_sgd  = loss(path_sgd[step])
    l_mom  = loss(path_mom[step])
    l_nest = loss(path_nest[step])
    print(f"{step:>6} | {l_sgd:>12.6f} | {l_mom:>12.6f} | {l_nest:>12.6f}")

print()
print(f"Final loss SGD:      {loss(path_sgd[-1]):.2e}")
print(f"Final loss Momentum: {loss(path_mom[-1]):.2e}")
print(f"Final loss Nesterov: {loss(path_nest[-1]):.2e}")

# ── Effective learning rate analysis ──────────────────────────────────────────
print()
print("Effective LR with momentum (eta_eff = eta / (1 - gamma)):")
for gamma in [0.5, 0.9, 0.95, 0.99]:
    eta_eff = 0.01 / (1 - gamma)
    print(f"  gamma={gamma}: eta_eff = 0.01 / {1-gamma:.2f} = {eta_eff:.3f}  (x{eta_eff/0.01:.0f} speedup)")

# ── PyTorch: SGD with Nesterov momentum ───────────────────────────────────────
import torch
import torch.nn as nn
import torch.optim as optim

print()
print("PyTorch Nesterov momentum demo:")
model = nn.Linear(2, 1, bias=False)
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9, nesterov=True)

# Show the optimizer state after a few steps
for step in range(5):
    optimizer.zero_grad()
    x = torch.tensor([[1.0, 2.0]])
    y = torch.tensor([[3.0]])
    loss_val = ((model(x) - y)**2).mean()
    loss_val.backward()
    optimizer.step()
    print(f"  step={step+1}: loss={loss_val.item():.6f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of plain SGD, SGD with momentum, and Nesterov accelerated gradient. Run on a narrow valley loss function (ill-conditioned quadratic) that causes SGD to zig-zag — demonstrating why momentum is essential for such landscapes. Also includes effective learning rate analysis and a PyTorch Nesterov demo.
            </p>
            <CodeBlock code={PY_CODE} filename="momentum_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MOMENTUM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
