import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { GradientDescentDiagram, PartialDerivativeDiag } from "../calculus/diagrams"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The challenge</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "Archimedes (c. 250 BCE) — The Seeds of Differentiation",
            title: "Tangent lines before algebra existed",
            challenge: "The previous topic showed how Archimedes measured accumulated areas. But accumulated totals raise an immediate question: at any given point, how fast is the area growing? That rate-of-change question stumped Greek mathematicians. The tangent line to a curve — the line that just barely touches it at one point — captures this rate, but no general method existed to find it.",
            what: "Archimedes computed tangent lines to spirals using a geometric construction: he showed that the tangent at any point on the Archimedean spiral is perpendicular to the line from the origin to the point, offset by a specific distance derived from the rate of rotation. This is not a formula — it was a one-off geometric proof — but it reveals the core concept: a tangent is determined by the curve's instantaneous rate of change at that point.",
            impact: "Archimedes' tangent to the spiral is the earliest documented computation of what we would now call a derivative. The geometric construction he used — measuring how far a curve moves per unit of a parameter — is conceptually identical to the difference quotient [f(x+h) − f(x)]/h that defines the modern derivative. This conceptual thread runs unbroken from 250 BCE to every backward() call in PyTorch.",
        },
        {
            year: "Fermat (1629–1638) — Finding Maxima Before Calculus",
            title: "The method of adequality",
            challenge: "Merchants, architects, and military engineers of the 17th century routinely needed optimal designs — maximum enclosure for a fixed fence, the cannon angle for maximum range, the bridge arch that best distributes weight. Without a general method, each problem required a clever geometric argument invented from scratch. There was no systematic way to find where a function stops increasing and starts decreasing.",
            what: "Pierre de Fermat developed 'adequality': to find the maximum of f(x), treat f(x) ≈ f(x + e) for small e, expand, cancel the non-e terms, then let e → 0. The surviving condition is exactly f'(x) = 0. He applied this to find the refraction angle satisfying Snell's law (maximising light speed through a medium), extreme values of polynomials, and optimal areas — all without the formal derivative.",
            impact: "Fermat's adequality is the direct ancestor of the first-order optimality condition. Every gradient-based optimiser today — gradient descent, Adam, RMSProp — is searching for (or descending toward) a point where the gradient is zero. Fermat also understood that zero gradient identifies local optima but doesn't distinguish minima from maxima from saddle points — the same challenge that makes nonconvex optimisation of neural networks difficult today.",
        },
        {
            year: "Newton & Leibniz (1665–1687) — The Unified System",
            title: "Calculus as a language, not a collection of tricks",
            challenge: "Fermat could find tangents; Archimedes could find areas. But these were separate techniques with no known connection. No one understood that differentiation and integration were the same operation seen from opposite sides. Without this unification, calculus was a bag of clever tricks rather than a general theory, and mathematicians couldn't systematically extend it to new problems.",
            what: "Newton and Leibniz independently proved the Fundamental Theorem — integrals are antiderivatives — and introduced the chain rule for compositions. Leibniz's notation (dy/dx, ∫) was designed so that algebraic manipulation of symbols produces correct calculus results automatically: d(uv) = u dv + v du, d(f ∘ g)/dx = (df/dg)(dg/dx). This turned ad-hoc methods into a general system that anyone who could learn the rules could apply.",
            impact: "The chain rule is backpropagation. In a neural network, the output depends on weights through a chain of compositions: loss → activation → linear layer → activation → input. The chain rule computes d(loss)/d(weight) for any weight at any layer by multiplying local derivatives along the chain. Leibniz invented the abstract rule in 1675; Rumelhart, Hinton, and Williams realised in 1986 that it applied to neural computation graphs, and modern deep learning became possible.",
        },
        {
            year: "Cauchy (1823) — Limits Without Infinitesimals",
            title: "Rigorous foundations, practical consequences",
            challenge: "For 150 years, calculus rested on 'infinitesimals' — quantities simultaneously nonzero (to divide by them and form a ratio) and zero (to discard error terms). Bishop Berkeley's 1734 attack 'The Analyst' correctly identified this contradiction. Mathematicians could compute, but couldn't prove their results were formally correct. Convergence proofs and error analyses were impossible without rigorous foundations.",
            what: "Cauchy defined the limit using ε-δ arguments: f(x) → L means that for any ε > 0 there exists δ > 0 such that |f(x) − L| < ε whenever |x − a| < δ. This eliminates infinitesimals entirely — they are replaced by the challenge of making the error smaller than any pre-specified bound. The derivative f'(x) = lim_{h→0} [f(x+h) − f(x)]/h is now precisely this limit, not a ratio of ghosts.",
            impact: "Rigorous limits underpin every convergence proof in ML. The statement 'gradient descent converges at rate O(1/t) for L-Lipschitz gradients' is a theorem about ε-δ limits, not an observation. The learning rate η is choosing how large a step approximates the infinitesimal step — too large and the limit argument breaks, divergence occurs. The entire mathematical analysis of optimiser behaviour depends on Cauchy's foundation.",
        },
        {
            year: "Weierstrass (1872) — Pathologies and the Smoothness Assumption",
            title: "Not every continuous function has a derivative",
            challenge: "Early calculus assumed that any 'nice' continuous function had derivatives — a tangent line existed at every point. Mathematicians thought differentiability was automatic for curves you could draw without lifting your pen. This assumption was natural but completely untested for pathological cases.",
            what: "Karl Weierstrass constructed a continuous function that is nowhere differentiable: W(x) = Σ aⁿ cos(bⁿπx), with 0 < a < 1 and ab > 1 + 3π/2. This function is fractal-like — it has infinitely many oscillations at every scale. No matter how far you zoom in, you never see a straight line, so no tangent ever exists anywhere on the curve. Continuity and differentiability are genuinely different properties.",
            impact: "Weierstrass's function is a warning that gradient computation cannot be taken for granted. Modern ML sidesteps this through deliberate design: ReLU is not differentiable at exactly one point (zero measure), handled by defining a subgradient. GELU and SiLU are chosen to be smooth almost everywhere. The deeper lesson is that smoothness is a privilege, not a default — and the fact that neural network loss surfaces are smooth enough for gradient descent to work is a non-trivial consequence of careful architecture design. Solving the Ceres orbit problem and computing the normal equations also required solving a system of linear equations — the bridge to our next topic.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Slopes, speed, and climbing hills</h2>

            <p className="ch-story-intro">
                We just learned how to measure accumulated totals — areas under curves, total probabilities. But there's an immediate follow-up question: at any given moment, <em>how fast</em> is that total growing? That rate-of-change is the derivative, and it turns out to be the single most important concept in all of machine learning.
            </p>

            <Analogy label="Derivative = Speed on a speedometer">
                Imagine you're driving a car. Your <strong>speedometer</strong> shows how fast you're going at this exact moment — not how far you've driven, but how <em>quickly</em> your position is changing. A derivative is exactly that: it measures <strong>how fast something is changing right now</strong>.
                <br /><br />
                If you drive 60 miles in one hour, your average speed is 60 mph. But your actual speed at each moment — what the speedometer shows — is the instantaneous rate of change: the derivative. The integral of speed gives you distance. The derivative of distance gives you speed. They are inverses.
            </Analogy>

            <Analogy label="Derivative = Steepness of a hill">
                Picture yourself walking up a hill. The <strong>steeper</strong> the hill, the harder it is to climb. The derivative tells you exactly how steep the hill is at each point: a big derivative means steep, zero derivative means flat, negative derivative means going downhill.
                <br /><br />
                In machine learning, our "hill" is the <strong>loss function</strong> — a measure of how wrong the model's predictions are. We want to find the bottom of this hill (the minimum loss). The derivative tells us which direction is downhill at each step.
            </Analogy>

            <Analogy label="Partial derivative = Looking in one direction at a time">
                Imagine you're on a mountain and you can move in any direction — north, east, northeast, and so on. The <strong>partial derivative</strong> is like asking: "if I only move due north, how fast does the height change?" Then ask the same for east, west, south.
                <br /><br />
                A neural network has millions of parameters — millions of directions to move in. Computing the partial derivative for each direction tells you how much each parameter contributes to the loss. All partial derivatives together form the <strong>gradient</strong>.
            </Analogy>

            <Analogy label="Chain rule = Nested machines">
                Think about a factory assembly line. Station A feeds into Station B, which feeds into Station C. If you speed up Station A, how does that change the final output? You multiply: (effect of A on B) × (effect of B on C). That's the <strong>chain rule</strong>.
                <br /><br />
                In a neural network, each layer feeds into the next. Weights at layer 1 affect activations at layer 2, which affect activations at layer 3, which affect the final loss. The chain rule tells us how to trace this chain of influence backwards — that's what <strong>backpropagation</strong> does.
            </Analogy>

            <Analogy label="Gradient = The arrow pointing uphill">
                The <strong>gradient</strong> is a single arrow that points in the direction of steepest <em>uphill</em> on the loss surface. The <em>negative</em> gradient points downhill — the direction that reduces the loss the fastest.
                <br /><br />
                Gradient descent is beautifully simple: compute this arrow, take a small step in the downhill direction, and repeat. Millions of times. That is what "training a neural network" means.
            </Analogy>

            <DiagramBlock title="Gradient descent on a loss surface">
                <GradientDescentDiagram />
            </DiagramBlock>

            <Analogy label="What comes next — setting the derivative to zero">
                Gradient descent follows the slope until it's nearly flat — until the gradient is nearly zero. When the gradient is exactly zero, we're at a minimum (or a saddle point). But finding the exact zero of a gradient often means solving a system of equations: one equation per parameter. When Gauss minimised his least-squares sum in 1809, setting the gradient to zero gave him exactly this — a system of linear equations to solve. That's our next topic.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From algebraic change to instantaneous rates</h2>

            <p>
                You've computed slopes of straight lines:{" "}
                <strong>slope = rise / run = (y₂ − y₁) / (x₂ − x₁)</strong>. That's an average rate of
                change. Calculus asks: what's the rate <em>at a single point</em>?
            </p>

            <h3>The Derivative — instantaneous slope</h3>
            <p>
                For a function f(x), the derivative f'(x) is the limit of the difference quotient as the
                interval shrinks to zero:
            </p>
            <MathBlock tex="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
            <p>
                Geometrically, it's the slope of the tangent line — the line that "just touches" the
                curve at one point. When h is very small, (f(x+h) − f(x))/h approximates the true derivative
                very closely. This is how computers actually compute numerical derivatives.
            </p>

            <h3>Basic Derivative Rules</h3>
            <p>
                Power rule: if f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹. For example, if f(x) = x³, then f'(x) =
                3x².
            </p>
            <p>
                Linearity: the derivative of a sum is the sum of derivatives. Constants pull out: (af +
                bg)' = af' + bg'.
            </p>

            <h3>Partial Derivatives — derivatives with multiple variables</h3>
            <p>
                For a function f(x, y) that depends on multiple inputs, we compute partial derivatives by
                pretending only one variable changes and treating the others as constants:
            </p>
            <MathBlock tex="\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}" />
            <p>
                The notation ∂ (curly d) instead of d signals that there are other variables we're holding
                constant. For example, if f(x, y) = x²y + y³:
            </p>
            <ul>
                <li>∂f/∂x = 2xy (treat y as a constant)</li>
                <li>∂f/∂y = x² + 3y² (treat x as a constant)</li>
            </ul>

            <DiagramBlock title="Partial derivatives — slopes in each direction on a surface">
                <PartialDerivativeDiag />
            </DiagramBlock>

            <h3>The Chain Rule — the engine of backpropagation</h3>
            <p>
                Suppose y = f(u) and u = g(x). How does y change with respect to x? The chain rule says:
            </p>
            <MathBlock tex="\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}" />
            <p>
                Read: "the derivative of y with respect to x equals the derivative of y with respect to u,
                times the derivative of u with respect to x." This works for any composition depth:
            </p>
            <MathBlock tex="\frac{dy}{dx} = \frac{dy}{dz_3} \frac{dz_3}{dz_2} \frac{dz_2}{dz_1} \frac{dz_1}{dx}" />
            <p>
                This is exactly what neural networks do. Each layer computes a transformation z = f(θ, x).
                To find how the loss changes with respect to a weight in an early layer, we multiply a chain
                of derivatives through every intermediate layer. That's backpropagation.
            </p>

            <h3>The Gradient — a vector of partial derivatives</h3>
            <p>
                For a scalar function f(x₁, x₂, ..., xₙ), the gradient collects all partial derivatives into
                a vector:
            </p>
            <MathBlock tex="\nabla f = \begin{pmatrix} \frac{\partial f}{\partial x_1} \\ \frac{\partial f}{\partial x_2} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{pmatrix}" />
            <p>
                The gradient points in the direction of steepest <strong>ascent</strong> — uphill. The
                negative gradient −∇f points downhill, toward minimum values.
            </p>

            <h3>Gradient Descent — climbing down the loss mountain</h3>
            <p>
                To minimise f(x), start somewhere and repeatedly step opposite to the gradient:
            </p>
            <MathBlock tex="x_{t+1} = x_t - \eta\,\nabla f(x_t)" />
            <p>
                Here η (eta) is the <strong>learning rate</strong> — how big a step we take. Too large, and
                we overshoot or diverge. Too small, and learning is painfully slow. Every modern neural
                network optimiser (SGD, Adam, RMSProp) is a gradient descent algorithm with adaptive
                learning rates.
            </p>

            <div className="ch-callout">
                <strong>Connection to ML:</strong> The loss function L(θ) has thousands to billions of
                parameters θ. We compute ∇θL using backpropagation (the chain rule applied through the
                network), then update θ ← θ − η·∇θL. Repeating this millions of times is what "training a
                neural network" means. Setting ∇L = 0 and solving for θ analytically is only possible for simple
                linear models — it produces the <em>normal equations</em> A^⊤Ax = A^⊤b, a linear system.
                Solving that system efficiently is the subject of our next topic: systems of equations.
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
            <h2>Differentiation and gradients</h2>
            <p>
                What follows is the calculus that powers every optimiser in machine learning. All
                gradients, automatic differentiation, and backpropagation are consequences of these
                definitions.
            </p>

            <DefBlock label="Definition — Derivative">
                For a function f: ℝ → ℝ, the derivative f'(x) at point x is the limit (if it exists):
            </DefBlock>
            <MathBlock tex="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />
            <p>
                If the limit exists, f is <strong>differentiable</strong> at x. Geometrically, this is the
                slope of the tangent line. The derivative is a function f': ℝ → ℝ defined wherever the limit
                exists.
            </p>

            <h3>Jacobian Matrix — derivative for vector-valued functions</h3>
            <p>
                For f: ℝⁿ → ℝᵐ, the generalisation of the derivative is the <strong>Jacobian</strong>
                matrix J ∈ ℝᵐˣⁿ:
            </p>
            <MathBlock tex="J_{ij} = \frac{\partial f_i}{\partial x_j}" />
            <p>
                Each row is the gradient of one output component with respect to all inputs. For m = 1
                (scalar output), the Jacobian reduces to the gradient vector (∇f)ᵀ.
            </p>

            <h3>Chain Rule (univariate)</h3>
            <p>
                For compositions y = f(g(x)), the derivative relates as:
            </p>
            <MathBlock tex="\frac{dy}{dx} = \frac{dy}{dg} \cdot \frac{dg}{dx}" />
            <p>
                This extends recursively to arbitrarily deep compositions. In neural networks, applying this
                repeatedly through the computation graph yields <strong>backpropagation</strong>.
            </p>

            <h3>Chain Rule (multivariate) — the engine of backpropagation</h3>
            <p>
                For f: ℝᵏ → ℝᵐ and g: ℝⁿ → ℝᵏ, the composition h = f ◦ g: ℝⁿ → ℝᵐ has Jacobian:
            </p>
            <MathBlock tex="J_h(x) = J_f(g(x)) \cdot J_g(x)" />
            <p>
                The Jacobian of the composition is the product of Jacobians. This matrix multiplication
                is exactly what modern autodiff frameworks (PyTorch, JAX, TensorFlow) compute efficiently,
                using computational graphs and forward/reverse accumulation.
            </p>

            <h3>Hessian Matrix — second derivatives and curvature</h3>
            <p>
                For f: ℝⁿ → ℝ, the Hessian H ∈ ℝⁿˣⁿ collects second partial derivatives:
            </p>
            <MathBlock tex="H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}" />
            <p>
                When second derivatives exist and are continuous, H is symmetric (by Schwarz's theorem).
                The Hessian encodes the <strong>curvature</strong> of f:
            </p>
            <ul>
                <li>Positive eigenvalues → locally convex (bowl-shaped, minimum nearby)</li>
                <li>Negative eigenvalues → locally concave (hill-shaped, maximum nearby)</li>
                <li>Mixed signs → saddle point (saddle geometry, tricky for optimisation)</li>
            </ul>
            <p>
                In ML, the Hessian's eigenvalues determine optimisation dynamics. Large eigenvalues mean
                sharp curvature — gradient descent needs small steps. Adaptive methods like Adam implicitly
                rescale gradients to compensate for this curvature spectrum.
            </p>

            <h3>Gradient Vector — direction of steepest ascent</h3>
            <p>
                For f: ℝⁿ → ℝ, the gradient ∇f(x) ∈ ℝⁿ is the vector of partial derivatives:
            </p>
            <MathBlock tex="\nabla f(x) = \begin{pmatrix} \frac{\partial f}{\partial x_1} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{pmatrix}" />
            <p>
                The gradient points in the direction of greatest local increase. This follows from the
                direction derivative identity:
            </p>
            <MathBlock tex="D_u f = \lim_{h \to 0} \frac{f(x + h\mathbf{u}) - f(x)}{h} = \nabla f(x) \cdot \mathbf{u}" />
            <p>
                This dot product is maximised when u aligns with ∇f. Therefore, −∇f points toward the
                greatest local decrease — the optimal direction for minimisation.
            </p>

            <h3>Gradient Descent — first-order optimisation</h3>
            <p>
                Given an initial point x₀, gradient descent iterates:
            </p>
            <MathBlock tex="x_{t+1} = x_t - \eta\,\nabla f(x_t)" />
            <p>
                Under Lipschitz continuity and appropriate η, this converges to a local minimum. In
                machine learning, f is the loss function L(θ) and x are model parameters θ. Modern
                variants include momentum, adaptive learning rates (Adam, RMSProp), and second-order
                approximations (Newton's method, quasi-Newton).
            </p>

            <DiagramBlock title="Gradient descent — stepping opposite to downhill">
                <GradientDescentDiagram />
            </DiagramBlock>

            <h3>Automatic Differentiation — computing gradients systematically</h3>
            <p>
                Autodiff computes gradients exactly (not numerically approximated) by decomposing
                functions into elementary operations and applying the chain rule. Two modes:
            </p>
            <ul>
                <li>
                    <strong>Forward mode</strong>: compute derivative alongside forward pass. Efficient for
                    functions with few outputs.
                </li>
                <li>
                    <strong>Reverse mode</strong> (backpropagation): store computational graph during
                    forward pass, propagate derivatives backward. Efficient for functions with many inputs
                    and few outputs — which is exactly neural networks (millions of parameters, single loss
                    value).
                </li>
            </ul>

            <div className="ch-callout">
                <strong>Key insight:</strong> Backpropagation is just reverse-mode automatic differentiation
                applied to a neural network's computation graph. It's not a special trick — it's the chain
                rule, organised efficiently on a graph. Modern frameworks (PyTorch, JAX) build this graph
                and compute gradients automatically, letting you write forward passes and get gradients
                for free.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn
import time

# ── 1. NumPy baseline — finite differences (O(n) evals, approximate) ─────
def f(x):        return x**3 + 2*x + 1
def df_true(x):  return 3*x**2 + 2

x0 = 2.0
df_approx = (f(x0 + 1e-5) - f(x0 - 1e-5)) / (2e-5)
print(f"[NumPy]  f'(2) ≈ {df_approx:.8f}  true = {df_true(x0)}")
# Scales poorly: needs n+1 forward passes for n parameters

# ── 2. PyTorch autograd — reverse-mode AD, exact in one backward pass ─────
print("\\n[Autograd] exact derivatives via computation graph")

x = torch.tensor(2.0, requires_grad=True)
y = x**3 + 2*x + 1       # forward pass builds the graph
y.backward()              # reverse: chain rule applied automatically
print(f"  dy/dx at x=2:  {x.grad.item():.8f}  (true: {df_true(x0)})")

# Chain rule across arbitrary composition depth — no manual bookkeeping
x = torch.tensor(1.0, requires_grad=True)
z = torch.exp(torch.sin(x**2))      # d/dx exp(sin(x²))
z.backward()
print(f"  d/dx exp(sin(x²)) at x=1:  {x.grad.item():.6f}")

# Both partial derivatives in one backward pass
x = torch.tensor([1.0, 2.0], requires_grad=True)
L = x[0]**2 + 2*x[0]*x[1] + 3*x[1]**2    # L = x²+2xy+3y²
L.backward()
print(f"  ∇L at (1,2):  {x.grad.tolist()}  (true: [6, 14])")

# ── 3. Jacobian & Hessian ─────────────────────────────────────────────────
print("\\n[Higher-order] Jacobian and Hessian")

def f_vec(x):
    return torch.stack([x[0]**2 + x[1], x[1]**3 - x[0]])

J = torch.autograd.functional.jacobian(f_vec, torch.tensor([1.0, 2.0]))
print(f"  Jacobian at [1,2]:\\n{J.numpy()}")

def loss_bowl(x):
    return x[0]**2 + 2*x[0]*x[1] + 3*x[1]**2

H = torch.autograd.functional.hessian(loss_bowl, torch.tensor([1.0, 2.0]))
print(f"  Hessian:\\n{H.numpy()}")
# λ_max of H bounds the safe learning rate: η < 2 / λ_max

# ── 4. Parallel gradient descent — 4096 starts, no Python loop over batch ─
print("\\n[Parallel] GD over 4096 starting points")

N      = 4096
starts = torch.randn(N) * 4.0

# Sequential baseline — Python loop, one start at a time
t0 = time.perf_counter()
seq_results = []
for x0 in starts:
    x = x0.item()
    for _ in range(30):
        x = x - 0.1 * (2 * x)   # GD step on f(x) = x²
    seq_results.append(x)
seq_ms = (time.perf_counter() - t0) * 1000

# Batched — all 4096 points are one tensor; each step is a single BLAS call
x = starts.clone()
t0 = time.perf_counter()
for _ in range(30):          # 30 outer steps, NOT 4096 × 30 inner iterations
    x = x - 0.1 * (2 * x)
batch_ms = (time.perf_counter() - t0) * 1000

print(f"  Sequential:  {seq_ms:7.1f} ms")
print(f"  Batched:     {batch_ms:7.1f} ms   ({seq_ms/batch_ms:.0f}× faster)")
print(f"  mean|x| after 30 steps: {x.abs().mean():.6f}  (→ 0.0)")

# ── 5. Autograd through a full network — one backward for all weights ─────
print("\\n[Network] gradients via loss.backward()")

torch.manual_seed(0)
net  = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 1))
x    = torch.randn(32, 4)    # batch of 32 samples, 4 features each
y    = torch.randn(32, 1)
loss = nn.MSELoss()(net(x), y)
loss.backward()              # ∂loss/∂every-weight in one pass

for name, p in net.named_parameters():
    print(f"  {name:25s}  {str(list(p.shape)):14s}  grad_norm={p.grad.norm():.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                From finite differences to autograd: PyTorch builds a computation graph on the
                forward pass and traverses it backwards — exact chain-rule gradients for every
                parameter in a single pass, then scaled to any batch size via vectorised tensor ops.
            </p>
            <CodeBlock code={PY_CODE} filename="derivatives_gradients.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Finite differences need n+1 forward passes and
                accumulate floating-point error. Reverse-mode autograd builds a graph during the
                forward pass and applies the chain rule backwards — exact gradients for all
                parameters in a single backward pass. That is why <code>loss.backward()</code>{" "}
                costs the same as one forward pass regardless of model size.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const DERIVATIVES_GRADIENTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
