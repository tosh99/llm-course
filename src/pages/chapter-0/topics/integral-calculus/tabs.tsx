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

# ── Riemann sum ──────────────────────────────────────────────
# Approximate ∫₀² x² dx = [x³/3]⁰₂ = 8/3 ≈ 2.667

def riemann_sum(f, a, b, n=10000):
    """Approximate integral via Riemann sum (midpoint rule)"""
    dx = (b - a) / n
    x_vals = np.linspace(a + dx/2, b - dx/2, n)  # midpoints
    return dx * np.sum(f(x_vals))

f = lambda x: x**2
approx = riemann_sum(f, 0, 2)
exact = 8/3
print(f"Riemann sum (n=10000): {approx:.6f}")
print(f"Exact integral:        {exact:.6f}")
print(f"Error:                  {abs(approx - exact):.8f}")

# ── Trapezoidal rule ──────────────────────────────────────────
# Better than Riemann sum: uses trapezoids instead of rectangles

def trapezoidal(f, a, b, n=1000):
    """Trapezoidal rule: approximates area with trapezoids"""
    x = np.linspace(a, b, n + 1)
    y = f(x)
    return np.trapz(y, x)  # numpy's optimised trapezoidal rule

approx_trap = trapezoidal(f, 0, 2)
print(f"\\nTrapezoidal (n=1000): {approx_trap:.6f}")

# ── Simpson's rule ────────────────────────────────────────────
# Uses parabolic arcs — even better convergence

from scipy.integrate import simpson

approx_simpson = simpson(f(np.linspace(0, 2, 1001)), np.linspace(0, 2, 1001))
print(f"Simpson (n=1000):      {approx_simpson:.6f}")

# ── Monte Carlo integration ───────────────────────────────────
# Dimension-independent convergence: O(1/sqrt(n))

def monte_carlo_integration(f, a, b, n=100000):
    """Monte Carlo: sample uniformly, average, scale by volume"""
    x = np.random.uniform(a, b, n)
    volume = b - a
    return volume * np.mean(f(x))

approx_mc = monte_carlo_integration(f, 0, 2, n=100000)
print(f"\\nMonte Carlo (n=100k): {approx_mc:.6f} ± {np.std(f(np.random.uniform(0, 2, n))) * (b-a) / np.sqrt(n):.4f}")

# ── High-dimensional Monte Carlo (why it matters in ML) ───────
# In d dimensions, grid-based methods have O(n^d) complexity
# Monte Carlo stays O(n) regardless of dimension!

def mc_expected_value(f, dim, n=10000):
    """Compute E[f(X)] where X ~ Uniform([-1,1]^dim)"""
    samples = np.random.uniform(-1, 1, (n, dim))
    return np.mean(f(samples))

# Example: integral of exp(-sum(x_i^2)) over [-1,1]^d
d = 10
f = lambda x: np.exp(-np.sum(x**2, axis=1))
integral_approx = 2**d * mc_expected_value(f, d, n=100000)
print(f"\\nMC integral in {d}D: {integral_approx:.4f} (exact is ≈ 11.64)")

# ── Analytic vs numerical: when each matters ─────────────────
# In ML, most integrals are intractable — no closed form exists.
# Examples: normalising constants, partition functions, posterior predictive

# Example: partition function of a 2D Gaussian
# Z = ∫∫ exp(-x²/2 - y²/2) dx dy = 2π (known)
# But for complex energy functions, Z is intractable

print(f"\\nKnown result: ∫∫ exp(-x²/2 - y²/2) dxdy = 2π = {2*np.pi:.4f}")`

function PythonTab() {
    return (
        <>
            <p>
                NumPy and SciPy for numerical integration. In ML, most integrals are
                intractable analytically, so numerical methods — especially Monte Carlo —
                are the workhorse for computing expectations over probability distributions.
            </p>
            <CodeBlock code={PY_CODE} filename="integral_calculus.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Monte Carlo integration's convergence rate
                O(1/√n) is independent of dimension — which is why it remains the dominant
                method for high-dimensional integrals in ML (parameter spaces, latent spaces,
                partition functions). No competing method has this property.
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
