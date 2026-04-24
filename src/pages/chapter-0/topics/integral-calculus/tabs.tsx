import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"

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
            title: "Squaring curves with polygons",
            challenge: "Greek mathematicians could find areas of polygons exactly, but curves — circles, parabolas, ellipses — had no straight edges. There was no method for computing the area enclosed by a curved boundary. Computing the area of a circle or parabola was an unsolved problem.",
            what: "Archimedes inscribed and circumscribed polygons around curves, doubling the number of sides to squeeze the true area between inner and outer approximations. He computed π ≈ 3.1416 and found exact areas of parabolas, spheres, and spirals — all without limits or calculus, using pure geometric reasoning.",
            impact: "Archimedes' method of exhaustion is the direct ancestor of the Riemann integral. He showed that curved problems can be approximated by straight ones, with the approximation improving without bound. Every numerical integration method — trapezoidal rule, Simpson's rule, Monte Carlo — is a descendant of this insight.",
        },
        {
            year: "Cavalieri (1635) — Indivisibles",
            title: "Curves as infinitely thin lines",
            challenge: "Archimedes' method worked but required clever geometric tricks for each new curve. Mathematicians wanted a more general principle: a way to treat curves as made up of infinitely many infinitely thin pieces that could be recombined into known shapes.",
            what: "Bonaventura Cavalieri argued that a solid could be decomposed into an infinite number of parallel cross-sectional 'indivisibles' (lices), and that comparing these collections of slices could give exact areas and volumes. His principle: figures of equal height with equal cross-sections at every height have equal area/volume.",
            impact: "Cavalieri's principle anticipated the fundamental theorem of calculus and the change-of-variables formula. In ML, the same idea appears in: computing the expected value of a function over a distribution (integrate over slices of the probability space), and in Monte Carlo integration where we sample 'indivisible' points.",
        },
        {
            year: "Newton & Leibniz (1665–1687) — The Fundamental Theorem",
            title: "Differentiation and integration as inverses",
            challenge: "For decades, finding areas (integration) and finding tangents (differentiation) were separate techniques with no known connection. The fundamental theorem of calculus — that these are exact inverses — was not yet proven or even suspected.",
            what: "Newton and Leibniz independently proved that differentiation and integration are inverse operations: if F'(x) = f(x), then the integral of f from a to b equals F(b) − F(a). This meant you could find areas by working backwards from derivatives, and find antiderivatives by working forwards from areas. The notation ∫ (sum) and d (difference) captured this duality.",
            impact: "The fundamental theorem turns the intractable problem of computing areas under arbitrary curves into a mechanical exercise of finding antiderivatives. In ML, this appears everywhere: the expected value E[f(X)] = ∫ f(x)p(x)dx is defined as an integral, and many analytical results (normalising constants, partition functions) rely on finding antiderivatives or their inverses.",
        },
        {
            year: "Cauchy (1823) — The Integral as a Limit",
            title: "Rigorising the integral",
            challenge: "Newton and Leibniz could compute, but their foundations were intuitive — Cavalieri's indivisibles and geometric intuition about 'infinitely small' quantities. A rigorous definition of the integral that didn't rely on metaphysics was needed.",
            what: "Augustin-Louis Cauchy gave the first rigorous definition: for a continuous function on [a, b], partition the interval into n subintervals, evaluate f at a sample point in each, sum f(xᵢ)·Δxᵢ, and take the limit as n → ∞ and the largest subinterval → 0. This 'Riemann sum' gives the exact integral.",
            impact: "Cauchy's definition made the integral a precise mathematical object. Every numerical integration algorithm — from trapezoidal rule to Gaussian quadrature to Monte Carlo — is an approximation of Cauchy's limit. In ML, we often can't compute integrals analytically, so we approximate them numerically using the same principle.",
        },
        {
            year: "Riemann (1854) — Generalising to Any Function",
            title: "When does the integral exist?",
            challenge: "Cauchy's integral worked for continuous functions, but mathematicians wanted to know exactly which functions could be integrated — and which couldn't. What happens when a function has infinitely many discontinuities?",
            what: "Bernhard Riemann extended Cauchy's construction to any bounded function on [a, b]. The integral exists (Riemann integrable) if the upper sum and lower sum converge to the same value as the partition gets infinitely fine. He showed that any function with a countable number of discontinuities is still integrable.",
            impact: "Riemann's framework covers nearly every function that engineers and scientists encounter. In ML, the functions we integrate over (probability density functions, loss landscapes, activation functions) are overwhelmingly Riemann-integrable. Only very pathological functions fail this test, and we never meet them in practice.",
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
            <h2>Adding up infinitely many infinitely small pieces</h2>

            <Analogy label="Integral = Area under a curve">
                Imagine drawing a mountain on graph paper. The <strong>integral</strong> of the mountain's height tells you the total area underneath it — the space it occupies on the ground. To find this area exactly, you'd need to cut the mountain into infinitely thin vertical slices, find the area of each slice, and add them all up. That's integration!
                <br />
                <br />
                In ML, if the curve represents a probability distribution, the integral tells you the probability of being in a range of values.
            </Analogy>

            <Analogy label="Integral = The opposite of derivative">
                Think of the derivative as a <em>speedometer</em> — it tells you how fast something is changing right now. The integral is like a <em>odometer</em> — it tells you the total distance travelled, even though the speed was changing the whole time. Knowing the speed at every moment (derivative) lets you recover the total distance (integral).
                <br />
                <br />
                This is the <strong>fundamental theorem of calculus</strong>: integration and differentiation are exact opposites.
            </Analogy>

            <Analogy label="Riemann sum = Stacking thin slices">
                Take a curve and slice it into very thin vertical strips. Each strip is almost a rectangle. The area of a thin rectangle is height × width. Add up all those areas — height of each strip times the strip width — and you get the total area. Make the strips thinner and thinner, and the answer gets more precise. In the limit of infinitely thin strips, you get the exact integral.
                <br />
                <br />
                This is exactly how neural networks approximate expected values: take many small samples, multiply each by its weight, and sum them up.
            </Analogy>

            <Analogy label="Integral calculus in AI">
                When a model predicts a probability distribution over outcomes, the integral of that distribution must equal 1 (total probability = 100%). Computing this normalisation constant — making sure probabilities sum to 1 — often requires integration. In Bayesian inference, we integrate over parameters to compute posterior predictive distributions.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From areas of rectangles to the fundamental theorem</h2>

            <h3>The Riemann Sum — approximating area</h3>
            <p>
                To find the area under a curve f(x) from a to b, divide the interval into n subintervals
                of width Δx = (b − a)/n. Pick one point in each subinterval, evaluate f there, and form
                the sum:
            </p>
            <MathBlock tex="\sum_{i=1}^{n} f(x_i^*)\,\Delta x \approx \int_a^b f(x)\,dx" />
            <p>
                As n → ∞ (infinitely many infinitely thin slices), this Riemann sum converges to the
                exact integral. In practice, numerical integration uses finite n with an
                intelligently chosen sample point in each slice.
            </p>

            <h3>The Definite Integral — a number</h3>
            <p>
                The <strong>definite integral</strong> ∫ᵃᵇ f(x) dx is a number — the signed area
                under the curve from x = a to x = b. Areas above the x-axis count positive; areas
                below count negative.
            </p>
            <MathBlock tex="\int_0^1 x^2\,dx = \left[\frac{x^3}{3}\right]_0^1 = \frac{1}{3}" />
            <p>
                In ML, expected values are definite integrals: E[f(X)] = ∫ f(x) p(x) dx, where
                p(x) is a probability density function.
            </p>

            <h3>The Fundamental Theorem of Calculus</h3>
            <p>
                If F'(x) = f(x), then:
            </p>
            <MathBlock tex="\int_a^b f(x)\,dx = F(b) - F(a)" />
            <p>
                This connects integration to differentiation. It means: to evaluate a definite integral,
                find an antiderivative F of f and compute F(b) − F(a). This turns an infinite process
                into a finite calculation.
            </p>

            <h3>The Indefinite Integral — a family of functions</h3>
            <p>
                The <strong>indefinite integral</strong> ∫ f(x) dx is the family of all antiderivatives:
            </p>
            <MathBlock tex="\int x^2\,dx = \frac{x^3}{3} + C" />
            <p>
                The constant C represents all the possible vertical shifts — F(x) + C for any constant
                C still has derivative f(x). In ML, when we compute partition functions or
                normalising constants, we often get these +C terms that must be resolved.
            </p>

            <h3>Integration Techniques</h3>
            <p>
                <strong>Substitution</strong> (reverse chain rule): if u = g(x), then du = g'(x)dx:
            </p>
            <MathBlock tex="\int f(g(x))\,g'(x)\,dx = \int f(u)\,du" />
            <p>
                <strong>Integration by parts</strong> (reverse product rule): derived from d(uv) = u dv + v du:
            </p>
            <MathBlock tex="\int u\,dv = uv - \int v\,du" />
            <p>
                These techniques appear in ML when computing expectations of complex functions under
                known distributions.
            </p>

            <div className="ch-callout">
                <strong>Connection to ML:</strong> Computing expected values E[f(X)] = ∫ f(x)p(x)dx
                over high-dimensional spaces is the core of probabilistic ML. In low dimensions we
                can use analytical antiderivatives. In high dimensions (like the parameter spaces of
                neural networks), we rely on numerical methods — Monte Carlo integration draws
                samples and averages them, which is just a finite Riemann sum.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Measure, integration, and the fundamental theorem</h2>

            <DefBlock label="Definition — Riemann Integral">
                A bounded function f: [a, b] → ℝ is Riemann integrable if the supremum of the lower
                sums and the infimum of the upper sums agree as the partition mesh → 0. The common
                value is ∫ᵃᵇ f(x) dx. Every continuous function on [a, b] is Riemann integrable.
            </DefBlock>

            <h3>The Fundamental Theorem of Calculus</h3>
            <p>
                Two parts that together establish the duality:
            </p>
            <p>
                <strong>Part I:</strong> If F(x) = ∫ᵃˣ f(t) dt, then F is differentiable and
                F'(x) = f(x). The integral accumulates the rate of change.
            </p>
            <MathBlock tex="\frac{d}{dx}\!\left(\int_a^x f(t)\,dt\right) = f(x)" />
            <p>
                <strong>Part II:</strong> If F'(x) = f(x), then ∫ᵃᵇ f(x) dx = F(b) − F(a).
            </p>
            <MathBlock tex="\int_a^b f(x)\,dx = F(b) - F(a)" />
            <p>
                Together: differentiation and integration are exact inverses. This is why
                antiderivatives solve definite integrals.
            </p>

            <h3>Improper Integrals — unbounded domains</h3>
            <p>
                When the interval is infinite or f is unbounded, we take limits:
            </p>
            <MathBlock tex="\int_a^\infty f(x)\,dx = \lim_{b\to\infty} \int_a^b f(x)\,dx" />
            <MathBlock tex="\int_{-\infty}^\infty f(x)\,dx = \lim_{a\to-\infty}\lim_{b\to\infty}\int_a^b f(x)\,dx" />
            <p>
                In probability, the normalising constant of a PDF p(x) often requires an improper
                integral over the entire real line: ∫₋∞°° p(x) dx = 1.
            </p>

            <h3>Change of Variables — substitution in integrals</h3>
            <p>
                If x = g(u) and dx = g'(u) du:
            </p>
            <MathBlock tex="\int_{x=a}^{x=b} f(x)\,dx = \int_{u=g^{-1}(a)}^{u=g^{-1}(b)} f(g(u))\,g'(u)\,du" />
            <p>
                This appears in ML when transforming variables under a change of distribution,
                computing partition functions, and in the reparameterisation trick for variational
                inference (transforming a simple base distribution through a learned function).
            </p>

            <h3>Multiple Integrals — volume under a surface</h3>
            <p>
                For f: ℝ² → ℝ, the double integral over a region R is:
            </p>
            <MathBlock tex="\iint_R f(x, y)\,dA = \int_{x=a}^{b}\int_{y=c}^{d} f(x, y)\,dy\,dx" />
            <p>
                Fubini's theorem: if f is continuous, the double integral equals either iterated
                integral. In ML, joint probability distributions p(x, y) are integrated over
                two variables. In variational inference, we might integrate over all latent
                dimensions.
            </p>

            <h3>Numerical Integration — when analytical solutions fail</h3>
            <p>
                For most real ML problems, the integral has no closed form. We approximate numerically:
            </p>
            <ul>
                <li>
                    <strong>Trapezoidal rule</strong>: approximate each slice as a trapezoid rather than
                    a rectangle. Error O(1/n²).
                </li>
                <li>
                    <strong>Simpson's rule</strong>: use quadratic polynomials over pairs of slices.
                    Error O(1/n⁴) — much better convergence.
                </li>
                <li>
                    <strong>Monte Carlo integration</strong>: draw n random samples {'{xᵢ}'} from the
                    domain, estimate ∫ f(x)dx ≈ V · (1/n) Σ f(xᵢ), where V is the domain volume.
                    Error O(1/√n) — dimension-independent convergence rate.
                </li>
            </ul>
            <p>
                Monte Carlo's dimension-independence is why it dominates in high-dimensional ML:
                an integral in 1000 dimensions still converges at O(1/√n).
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> The partition function Z in energy-based models (Boltzmann
                machines, Gibbs distributions) is Z = ∫ exp(−E(x)) dx — an intractable integral in
                high dimensions. Variational inference, contrastive divergence, and other approximate
                methods all exist because this integral can't be computed directly.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import time

# ── 1. NumPy baseline — grid-based (cost grows as O(nᵈ) in d dims) ───────
n = 10_000
x = np.linspace(1e-5, 2 - 1e-5, n)
riemann = (2.0 / n) * np.sum(x**2)
print(f"[NumPy]  ∫₀² x² dx  Riemann (n={n:,}): {riemann:.6f}  true: {8/3:.6f}")

# ── 2. PyTorch Monte Carlo — vectorised, GPU-scalable ─────────────────────
print("\\nPyTorch MC — vectorised sampling")

torch.manual_seed(0)
N  = 1_000_000
x  = torch.rand(N) * 2.0        # uniform on [0, 2]
mc = 2.0 * x.pow(2).mean()      # volume × E[f(X)]
print(f"  ∫₀² x² dx  MC (n={N:,}): {mc.item():.6f}  (true: {8/3:.6f})")

# ── 3. High-dimensional MC — O(1/√n) regardless of dimension ─────────────
print("\\nHigh-dim MC — O(1/√n) for any dimension")

def mc_integral_torch(dim, n=500_000):
    x   = torch.rand(n, dim) * 2 - 1      # uniform on [-1,1]^d
    vol = 2.0 ** dim
    return (vol * torch.exp(-x.pow(2).sum(dim=1)).mean()).item()

for d in [1, 5, 10, 20]:
    val = mc_integral_torch(d)
    print(f"  d={d:2d}  ∫_[-1,1]^d exp(-||x||²) dx ≈ {val:.4f}")

# ── 4. Parallel integration — 128 integrands in one shot ─────────────────
print("\\nParallel — integrate x^k for k=1..128 simultaneously")

torch.manual_seed(0)
N   = 200_000
x   = torch.rand(N)
ks  = torch.arange(1, 129, dtype=torch.float32)
estimates = x.unsqueeze(1).pow(ks.unsqueeze(0)).mean(dim=0)  # (N,128) → (128,)
true_vals  = 1.0 / (ks + 1)
max_err    = (estimates - true_vals).abs().max()
print(f"  128 integrals (∫₀¹ x^k dx) — max error: {max_err.item():.6f}  (N={N:,})")

# ── 5. Speed comparison ───────────────────────────────────────────────────
print("\\nSpeed — NumPy vs PyTorch at 5M samples")

N_big = 5_000_000
t0 = time.perf_counter()
val_np = float(2.0 * np.mean(np.random.rand(N_big)**2))
np_ms  = (time.perf_counter() - t0) * 1000

t0 = time.perf_counter()
val_pt = float(2.0 * torch.rand(N_big).pow(2).mean())
pt_ms  = (time.perf_counter() - t0) * 1000

print(f"  NumPy:   {np_ms:.1f} ms  →  {val_np:.6f}")
print(f"  PyTorch: {pt_ms:.1f} ms  →  {val_pt:.6f}")

# ── 6. E[softmax(z)₀] — an integral without a closed form ────────────────
print("\\nML context — E[p₀], z ~ N(0, I₁₀)")

torch.manual_seed(0)
z  = torch.randn(500_000, 10)
p0 = torch.softmax(z, dim=1)[:, 0].mean()
print(f"  E[p₀] ≈ {p0.item():.4f}  (exact = 0.1000)  — no closed form exists")`

function PythonTab() {
    return (
        <>
            <p>
                PyTorch's vectorised sampling makes Monte Carlo integration trivially
                parallel — swap NumPy arrays for tensors and the same code runs on GPU,
                or integrate 128 different functions simultaneously with a single outer product.
            </p>
            <CodeBlock code={PY_CODE} filename="integral_calculus.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Monte Carlo's O(1/√n) convergence is
                dimension-independent — grid methods need n<sup>d</sup> evaluations while MC
                stays at n regardless. Every high-dimensional expectation in ML (normalising
                constants, ELBO, posterior predictives) is estimated this way.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const INTEGRAL_CALCULUS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
