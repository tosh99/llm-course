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
            year: "Archimedes (c. 250 BCE) — The Method of Exhaustion",
            title: "Finding areas without limits",
            challenge: "Ancient Greek mathematicians could compute exact areas of polygons using geometry. But curves like circles and parabolas were fundamentally different — they had no straight edges, so polygon formulas didn't apply. No one knew how to rigorously compute the area bounded by a curve.",
            what:
                "Archimedes invented the 'method of exhaustion': inscribe a polygon inside a curve, circumscribe one around it, and keep increasing the number of sides. The true area is 'exhausted' — squeezed between two polygons that converge to the same value. Using this, he computed π to extraordinary precision and proved formulas for the area of a parabola.",
            impact:
                "This is the conceptual ancestor of the integral. Even without a formal notion of 'limit', Archimedes demonstrated that you can approach curved problems with straight-line approximations that converge to the truth. Neural network training today does exactly the same: it approximates complex loss landscapes with tiny straight steps.",
        },
        {
            year: "Fermat (1601–1665) — The Method of Ad-Equality",
            title: "Finding maxima before calculus existed",
            challenge: "Mathematicians and merchants of the 17th century needed to solve optimization problems without calculus. How do you find the maximum area of a field given fixed fencing, or the optimal trajectory of a projectile? Without derivative formulas, these were ad-hoc geometric puzzles.",
            what:
                "Pierre de Fermat developed a method he called 'ad-equality': treat two values as 'approximately equal' and set them equal to each other, then later let the approximation become exact. This is essentially setting derivatives to zero — finding where the slope is flat, which identifies maxima and minima.",
            impact:
                "Fermat's method is the geometric precursor to the derivative f'(x) = 0. Every neural network optimizer today — gradient descent, Adam, RMSProp — is a direct descendant of the insight that zero gradient indicates optimum. The chain rule, discovered later, gave this approach compositional power.",
        },
        {
            year: "Newton & Leibniz (1665–1687) — The Fundamental Theorem",
            title: "Calculus as a unified system",
            challenge: "Fermat and Descartes had methods for finding tangents and areas, but they were separate techniques. No one understood that these were two sides of the same coin. This meant calculus was a bag of tricks, not a general theory, and mathematicians couldn't confidently extend it to new problems.",
            what:
                "Isaac Newton and Gottfried Wilhelm Leibniz independently created a unified calculus framework. They introduced the notation (dx, ∫), the fundamental theorem of calculus (integrals are anti-derivatives), and the chain rule for composition. This turned ad-hoc methods into a general-purpose tool that could solve problems in physics, astronomy, and engineering.",
            impact:
                "The fundamental theorem made it possible to compute integrals by finding derivatives rather than doing geometric exhaustion. This is why automatic differentiation in modern ML works: we can compute gradients at scale because calculus is a single, unified system. Backpropagation is just the chain rule applied repeatedly through a computation graph.",
        },
        {
            year: "Cauchy (1823) — Rigorous Foundations of Limits",
            title: "Calculus without ghosts",
            challenge: "For 150 years, calculus had been built on intuition about 'infinitely small' quantities — infinitesimals, 'ghosts of departed quantities' as Berkeley called them. Mathematicians could compute, but they couldn't prove their results were formally correct. In analysis and physics, this was becoming unacceptable.",
            what:
                "Augustin-Louis Cauchy defined the limit rigorously using ε-δ arguments: a sequence approaches a value if you can bound its error with an arbitrarily small epsilon. This removed infinitesimals entirely and grounded calculus in the language of real analysis. The derivative became a limit of difference quotients, not a ratio of infinitesimals.",
            impact:
                "Rigorous limits are essential for understanding gradient-based optimization. The 'learning rate' is choosing how small our epsilon is — we can't literally take an infinitesimal step, so we approximate the derivative with a finite difference. The entire analysis of convergence proofs in machine learning rests on Cauchy's foundation.",
        },
        {
            year: "Weierstrass (1872) — The Smoothness Illusion",
            title: "Not every function is differentiable",
            challenge: "Early calculus assumed that continuous functions had derivatives — you could always compute a slope at every point. Mathematicians thought differentiability was guaranteed for 'nice' functions. This assumption was unex- amined and mostly untested.",
            what:
                "Karl Weierstrass shocked the mathematical community by constructing a continuous function that is nowhere differentiable — it's a fractal-like curve with wiggles at every scale. No matter how far you zoom in, you never see a straight line, so no tangent exists.",
            impact:
                "This changed how we think about optimization. Most modern neural network optimizers assume smoothness (twice-differentiable, even). The Weierstrass function tells us that pathologies exist and that smoothness is a privileged property, not a default. This is why we use activation functions like ReLU (smooth almost everywhere) instead of pathological ones.",
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

            <Analogy label="Derivative = Speed on a speedometer">
                Imagine you're driving a car. Your <strong>speedometer</strong>

                shows how fast you're going at this exact moment — not how far you've driven, but how{" "}
                <em>quickly</em> your position is changing. A derivative is exactly that: it measures{" "}
                <strong>how fast something is changing</strong> right now.
                <br />
                <br />
                If you drive 60 miles in one hour, your average speed is 60 mph. Your instantaneous
                speed at any moment is what the speedometer shows — that's the derivative.
            </Analogy>

            <Analogy label="Derivative = Steepness of a hill">
                Picture yourself walking up a hill. The <strong>steeper</strong> the hill, the harder it
                is to climb. The derivative tells you exactly how steep the hill is at each point: a big
                derivative means a steep hill, a zero derivative means flat ground (no change), and a
                negative derivative means you're going downhill.
                <br />
                <br />
                In machine learning, our "hill" is the loss function. We want to find the bottom. The{" "}
                derivative tells us which way is downhill, so we know which direction to step.
            </Analogy>

            <Analogy label="Partial derivative = Looking in one direction">
                Imagine you're playing a game where you can move left-right, forward-backward, and up-down
                (like a bird). The <strong>partial derivative</strong>

                is like turning your head in one
                direction and asking: "if I only move THIS way, how fast does the height change?"
                <br />
                <br />
                You compute the slope in the x-direction, then the y-direction, then the z-direction.
                Together, they tell you the steepness in every possible direction.
            </Analogy>

            <Analogy label="Chain rule = Nested machines">
                Think about baking a cake. The <strong>chain rule</strong>

                handles nested changes: the oven
                temperature affects the batter consistency, which affects how long it bakes, which affects
                whether it burns. To know how changing the thermostat affects burning, you multiply each
                link's effect together.
                <br />
                <br />
                In neural networks, weights affect outputs, outputs affect loss, loss affects everything.
                The chain rule tells us how to trace this chain of influence backward — that's what{" "}
                <strong>backpropagation</strong> does.
            </Analogy>

            <Analogy label="Gradient = The arrow pointing downhill">
                The <strong>gradient</strong>

                is like a compass needle that always points toward the steepest
                uphill. The negative gradient points downhill — exactly the direction we want to step to
                reduce our loss.
                <br />
                <br />
                Gradient descent is simple: compute this arrow, take a step that way, and repeat. It's
                how every modern neural network learns.
            </Analogy>

            <Analogy label="Why calculus matters for AI">
                Imagine you're trying to teach a computer to recognize cats in photos. The computer has
                millions of tiny "knobs" (parameters) that it can adjust. Calculus tells us{" "}
                <em>which knobs to turn, and by how much</em>, to make the computer better at spotting
                cats. The derivative is the signal that guides every learning step.
            </Analogy>

            <DiagramBlock title="Gradient descent on a loss surface">
                <GradientDescentDiagram />
            </DiagramBlock>

            <Analogy label="The gradient compass">
                The gradient is like a compass that always points uphill. The negative gradient points
                downhill — the direction that reduces the loss. Gradient descent follows that compass,
                taking small steps downhill until it reaches the bottom (minimum).
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
                neural network" means.
            </div>
        </>
    )
}

function MathsTab() {
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

function PythonTab() {
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
    maths: <MathsTab />,
    python: <PythonTab />,
}
