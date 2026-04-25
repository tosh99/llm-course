import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From physics intuition to deep learning necessity</h2>
            <p>
                Momentum in optimization borrows directly from classical mechanics: a ball rolling
                downhill accelerates in the dominant direction and resists being deflected by
                minor bumps. Applied to gradient descent, this intuition solves one of the most
                persistent problems in training neural networks — the zig-zagging trajectory caused
                by noisy, high-curvature loss surfaces.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1964</div>
                    <div className="ch-tl-section-label">Origin</div>
                    <div className="ch-tl-title">Polyak's Heavy Ball Method</div>
                    <div className="ch-tl-body">
                        Boris Polyak introduced the <em>heavy ball method</em> in his 1964 paper
                        "Some methods of speeding up the convergence of iteration methods." The update
                        rule v<sub>t</sub> = γv<sub>t-1</sub> + η∇L(θ) accumulates gradient history,
                        allowing the optimizer to build up speed in consistent directions and dampen
                        oscillations in inconsistent ones. The momentum coefficient γ was typically
                        set to 0.9 — meaning 90% of the previous velocity is retained at each step.
                    </div>
                    <div className="ch-tl-impact">Impact: First rigorous formulation of momentum for numerical optimization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1983</div>
                    <div className="ch-tl-section-label">Theoretical Advance</div>
                    <div className="ch-tl-title">Nesterov Accelerated Gradient</div>
                    <div className="ch-tl-body">
                        Yurii Nesterov published "A method for solving convex programming problem with
                        convergence rate O(1/k²)," achieving the optimal convergence rate for first-order
                        methods on smooth convex functions. His key insight: instead of computing the
                        gradient at the current position, compute it at the <em>anticipated</em> next
                        position — where momentum will carry the parameters to. This "look-ahead"
                        gradient is more informative because it evaluates the gradient after the momentum
                        step, allowing the optimizer to correct course before it overshoots.
                    </div>
                    <div className="ch-tl-impact">Impact: Optimal O(1/k²) convergence — theoretical gold standard for convex optimization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986</div>
                    <div className="ch-tl-section-label">Neural Networks</div>
                    <div className="ch-tl-title">Momentum in Backpropagation — Rumelhart et al.</div>
                    <div className="ch-tl-body">
                        Rumelhart, Hinton, and Williams' famous backpropagation paper "Learning
                        representations by back-propagating errors" included momentum as a standard
                        part of the training recipe. Momentum was essential for navigating the
                        non-convex, high-dimensional loss surfaces of even small neural networks —
                        plain SGD would zig-zag uncontrollably in the presence of ill-conditioned
                        curvature, while momentum damped these oscillations and accelerated progress
                        toward flat minima.
                    </div>
                    <div className="ch-tl-impact">Impact: Established momentum as standard practice in neural network training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Deep Learning Validation</div>
                    <div className="ch-tl-title">Sutskever et al. — Nesterov is crucial for deep nets</div>
                    <div className="ch-tl-body">
                        Ilya Sutskever, James Martens, George Dahl, and Geoffrey Hinton published
                        "On the importance of initialization and momentum in deep learning," which
                        demonstrated that with careful initialization, Nesterov momentum could match
                        or exceed second-order methods (like Hessian-free optimization) on deep networks.
                        This paper established Nesterov momentum as the preferred choice for deep
                        learning — and made a strong case that the choice of momentum type (classical
                        vs. Nesterov) matters significantly in non-convex settings.
                    </div>
                    <div className="ch-tl-impact">Impact: Validated Nesterov as the momentum of choice for modern deep learning</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Legacy:</strong> Momentum remains the foundation of every modern optimizer.
                Adam, AdaGrad, RMSProp — all incorporate momentum in their first-moment estimate.
                Even when practitioners use Adam, they are implicitly using a variant of momentum
                with adaptive scaling per parameter.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Rolling a ball down a bumpy hill</h2>

            <Analogy label="Why Plain Steps Zig-Zag">
                Imagine you're trying to find the bottom of a valley in the dark, and all you can
                do is feel which direction is downhill and take one step. But the valley is shaped
                like a long narrow canyon — wide in one direction, narrow in the other.
                <br /><br />
                Every step, you feel a huge "downhill" push sideways (across the canyon) and a tiny
                push forward (along the canyon floor). So you keep bouncing back and forth across
                the canyon while barely moving forward. That's <strong>plain gradient descent</strong>
                — it zig-zags because the gradient always pulls toward the steep walls.
            </Analogy>

            <Analogy label="Momentum: You're a Rolling Ball">
                Now imagine you're not taking steps — you're a ball rolling down the same canyon.
                <br /><br />
                Each bounce sideways loses energy, but your forward motion builds up.
                By the 10th bounce, the sideways motion has mostly cancelled out, but
                the forward momentum has accumulated — you're rolling faster toward the bottom.
                <br /><br />
                That's exactly what momentum does for gradient descent. The sideways gradients
                (the inconsistent ones) cancel each other. The forward gradients (the consistent ones)
                add up. You converge much faster.
            </Analogy>

            <Analogy label="Nesterov: Look Before You Leap">
                Classic momentum computes the gradient where you <em>are</em>, then adds it to
                your existing velocity. But you could be smarter: use your velocity to predict
                where you'll <em>end up</em>, and compute the gradient <em>there</em> instead.
                <br /><br />
                If you're about to overshoot the bottom of a hill, computing the gradient at your
                predicted future position will warn you to slow down — before you overshoot.
                Classic momentum only realizes it overshot after it lands. That's the Nesterov
                advantage: it's forward-looking.
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
                At each step, the direction is determined entirely by the local gradient, with no
                memory of previous steps. On curved loss surfaces, this causes oscillations.
            </p>

            <h3>SGD with Momentum (Polyak, 1964)</h3>
            <p>
                Introduce a velocity vector v<sub>t</sub> that accumulates gradient history:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + \eta \nabla_\theta \mathcal{L}(\theta_{t-1})" />
            <MathBlock tex="\theta_t = \theta_{t-1} - v_t" />
            <p>
                γ is the momentum coefficient (typically 0.9). The velocity is an exponential
                moving average of all past gradients — consistent gradients accumulate, inconsistent
                ones cancel.
            </p>

            <h3>What Does γ = 0.9 Mean?</h3>
            <ul>
                <li>The current gradient contributes η · ∇L to the velocity</li>
                <li>The gradient from 2 steps ago contributes γ · η · ∇L = 0.9 × η · ∇L</li>
                <li>From 10 steps ago: γ<sup>10</sup> · η · ∇L = 0.9<sup>10</sup> · η · ∇L ≈ 0.35 · η · ∇L</li>
                <li>From 50 steps ago: 0.9<sup>50</sup> ≈ 0.005 · η · ∇L (nearly zero)</li>
            </ul>
            <p>
                Momentum has an effective window of roughly 1/(1-γ) = 1/0.1 = 10 gradient steps.
            </p>

            <h3>Nesterov Accelerated Gradient</h3>
            <p>
                Nesterov's improvement: compute the gradient at the <em>lookahead position</em>
                (where momentum would carry us) rather than the current position:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + \eta \nabla_\theta \mathcal{L}(\theta_{t-1} - \gamma v_{t-1})" />
            <MathBlock tex="\theta_t = \theta_{t-1} - v_t" />
            <p>
                The term θ<sub>t-1</sub> − γv<sub>t-1</sub> is the "lookahead" position — where
                the parameter would be after the momentum step alone. The gradient there is more
                informative for the actual update direction.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why Nesterov is better:</strong> On a convex function, Nesterov achieves
                O(1/k²) convergence compared to O(1/k) for plain gradient descent.
                Intuitively: if you know you're about to overshoot a minimum, computing the
                gradient at the overshoot point warns you to slow down — before it happens.
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
                Let η &gt; 0 be the learning rate, γ ∈ [0,1) the momentum coefficient,
                ∇L(θ) the gradient of loss at θ. Define velocity v<sub>0</sub> = 0. Then:
                <br /><br />
                v<sub>t</sub> = γ · v<sub>t-1</sub> + η · ∇L(θ<sub>t-1</sub>)
                <br />
                θ<sub>t</sub> = θ<sub>t-1</sub> − v<sub>t</sub>
            </DefBlock>

            <h3>Expanding the Velocity</h3>
            <p>
                Unrolling the recurrence for v<sub>t</sub>:
            </p>
            <MathBlock tex="v_t = \eta \sum_{k=0}^{t} \gamma^k \nabla \mathcal{L}(\theta_{t-k})" />
            <p>
                The velocity is a geometric series weighted sum of all past gradients.
                The effective learning rate in the direction of a consistent gradient g is:
            </p>
            <MathBlock tex="\eta_{\text{eff}} = \eta \sum_{k=0}^{\infty} \gamma^k = \frac{\eta}{1 - \gamma}" />
            <p>
                With γ = 0.9 and η = 0.01: η<sub>eff</sub> = 0.01 / 0.1 = 0.1 — a 10× speedup
                in the consistent direction.
            </p>

            <h3>Nesterov Accelerated Gradient (NAG)</h3>
            <MathBlock tex="\begin{aligned} v_t &= \gamma v_{t-1} + \eta \nabla \mathcal{L}(\theta_{t-1} - \gamma v_{t-1}) \\ \theta_t &= \theta_{t-1} - v_t \end{aligned}" />
            <p>
                Equivalently, defining θ̃<sub>t</sub> = θ<sub>t</sub> − γv<sub>t</sub>
                (the "lookahead" parameter):
            </p>
            <MathBlock tex="\theta_t = \theta_{t-1} - \eta \nabla \mathcal{L}(\theta_{t-1} - \gamma v_{t-1}) - \gamma(v_{t-1} - v_{t-2})" />
            <p>
                Nesterov includes a correction term proportional to the velocity change — it
                anticipates and partially reverses the momentum step when the gradient direction
                changes.
            </p>

            <h3>Convergence Rates</h3>
            <MathBlock tex="\begin{array}{ll} \textbf{Method} & \textbf{Convex convergence} \\ \hline \text{Gradient Descent} & O(1/k) \\ \text{Polyak Momentum} & O(1/k) \text{ (same class)} \\ \text{Nesterov NAG} & O(1/k^2) \text{ (optimal for first-order)} \end{array}" />

            <h3>Practical Implementation Note: PyTorch's Nesterov</h3>
            <p>
                PyTorch implements NAG in a slightly different (but equivalent) form. Defining
                the update as:
            </p>
            <MathBlock tex="v_t = \gamma v_{t-1} + g_t \quad \theta_t = \theta_{t-1} - \eta(g_t + \gamma v_t)" />
            <p>
                where g<sub>t</sub> = ∇L(θ<sub>t-1</sub>). This avoids the extra forward pass
                through the loss at the lookahead position while achieving mathematically
                equivalent updates.
            </p>

            <div className="ch-callout">
                <strong>Non-convex setting:</strong> In deep learning, loss surfaces are highly
                non-convex. The theoretical guarantees above apply to convex functions, but
                momentum still empirically helps by: (1) dampening gradient noise through
                averaging, (2) escaping shallow local minima by carrying inertia through small
                barriers, (3) accelerating convergence in low-curvature directions.
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
print("Effective LR with momentum:")
for gamma in [0.5, 0.9, 0.95, 0.99]:
    eta_eff = 0.01 / (1 - gamma)
    print(f"  gamma={gamma}: eta_eff = 0.01 / {1-gamma} = {eta_eff:.3f} (x{eta_eff/0.01:.0f} speedup)")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of plain SGD, SGD with momentum, and Nesterov accelerated
                gradient. Run on a narrow valley loss function (ill-conditioned quadratic) that
                causes SGD to zig-zag — demonstrating why momentum is essential for such landscapes.
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
    maths:      null,
    python:     null,
}
