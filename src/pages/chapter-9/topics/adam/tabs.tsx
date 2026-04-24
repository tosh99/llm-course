import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The optimizer that became the default</h2>
            <p>
                Adam (Adaptive Moment Estimation) was introduced by Diederik Kingma and Jimmy Ba
                at ICLR 2015. Within two years of its publication, it had become the default
                optimizer for the majority of deep learning research. Understanding Adam requires
                tracing the line of adaptive learning rate methods it synthesized.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1988</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Momentum — Polyak, Rumelhart et al.</div>
                    <div className="ch-tl-body">
                        Momentum accumulates gradient history via an exponential moving average
                        (the first moment). This is the first step toward Adam: m<sub>t</sub> = β₁m<sub>t-1</sub> + (1−β₁)g<sub>t</sub>.
                        Adam's first moment is exactly this — the core momentum mechanism with a
                        specific bias-correction twist added later.
                    </div>
                    <div className="ch-tl-impact">Impact: First moment estimate — the foundation of Adam's momentum term</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2011</div>
                    <div className="ch-tl-section-label">Per-Parameter LR</div>
                    <div className="ch-tl-title">Adagrad — Duchi, Hazan, Singer</div>
                    <div className="ch-tl-body">
                        Adagrad introduced per-parameter learning rates: infrequently updated
                        parameters receive larger steps; frequently updated ones receive smaller steps.
                        Update rule: θ<sub>t</sub> = θ<sub>t-1</sub> − η/√(G<sub>t</sub> + ε) · g<sub>t</sub>,
                        where G<sub>t</sub> = Σg<sub>k</sub>² accumulates all past squared gradients.
                        Fatal flaw: G<sub>t</sub> grows monotonically → effective learning rate
                        shrinks to zero. Excellent for sparse data (NLP), unusable for long training.
                    </div>
                    <div className="ch-tl-impact">Impact: Established adaptive per-parameter learning rates; revealed the vanishing LR problem</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2012</div>
                    <div className="ch-tl-section-label">Fix for Adagrad</div>
                    <div className="ch-tl-title">RMSProp — Hinton (unpublished)</div>
                    <div className="ch-tl-body">
                        Geoffrey Hinton introduced RMSProp in his Coursera lecture notes (never
                        formally published). The fix: use an exponential moving average of squared
                        gradients instead of accumulating all of them.
                        v<sub>t</sub> = β₂v<sub>t-1</sub> + (1−β₂)g<sub>t</sub>².
                        This decaying average prevents the learning rate from shrinking to zero —
                        old gradients are gradually "forgotten." Adam's second moment is exactly
                        RMSProp's estimate.
                    </div>
                    <div className="ch-tl-impact">Impact: Fixed Adagrad's monotonic decay; became Adam's second moment</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Synthesis</div>
                    <div className="ch-tl-title">Adam — Kingma & Ba (ICLR 2015)</div>
                    <div className="ch-tl-body">
                        Kingma and Ba combined momentum (first moment) and RMSProp (second moment),
                        adding a crucial insight: <em>bias correction</em>. Because both moments are
                        initialized at zero, the early estimates are biased toward zero. Adam divides
                        by (1−β<sub>1</sub><sup>t</sup>) and (1−β<sub>2</sub><sup>t</sup>) to correct
                        this. Defaults β₁=0.9, β₂=0.999, ε=1e-8, α=0.001 work reliably across an
                        extraordinary range of architectures and datasets.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default optimizer in deep learning within 2 years; 100,000+ citations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–present</div>
                    <div className="ch-tl-section-label">Variants</div>
                    <div className="ch-tl-title">AMSGrad, AdamW, and beyond</div>
                    <div className="ch-tl-body">
                        <strong>AMSGrad</strong> (Reddi et al., 2018): proved Adam can fail to converge in
                        certain convex problems; proposed a fix with maximum of past second moments.
                        <strong>AdamW</strong> (Loshchilov & Hutter, 2019): decouples L2 regularization
                        from the adaptive learning rate, which is the theoretically correct way to do
                        weight decay. AdamW is now the default for Transformers (BERT, GPT, LLaMA all
                        use AdamW).
                    </div>
                    <div className="ch-tl-impact">Impact: AdamW is the standard optimizer for large language models</div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A smart optimizer that learns from its own history</h2>

            <Analogy label="The Problem: Every Parameter Is Different">
                Imagine you're training a neural network with millions of parameters. Some parameters
                get updated a lot (like embedding weights for common words), some get updated rarely
                (like weights for rare words). Should they all use the same step size?
                <br /><br />
                Plain SGD uses the same learning rate for everything — like driving at the same speed
                whether you're on a highway or navigating a narrow alley. Adam uses a different
                speed for each parameter, based on its own history.
            </Analogy>

            <Analogy label="Two Running Averages — Momentum + Memory">
                Adam keeps two memories for each parameter:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li><strong>m (first moment)</strong>: The recent average direction of the gradient.
                        This is momentum — it smooths out gradient noise and keeps moving in the right direction.</li>
                    <li><strong>v (second moment)</strong>: The recent average of the squared gradient.
                        This tells Adam how "confident" the gradient has been recently. Large v means
                        the gradient has been big and noisy → take a smaller step. Small v means the
                        gradient has been small and consistent → take a larger step.</li>
                </ol>
                Adam divides the momentum by the square root of this confidence measure. If a
                parameter's gradient has been consistently small, Adam gives it a bigger effective
                learning rate. If it has been erratic, Adam slows down.
            </Analogy>

            <Analogy label="Bias Correction — A Clean Start">
                There's one more trick. At the start of training, both m and v are zero. The very
                first update would use almost-zero estimates of the moments, giving garbage results.
                <br /><br />
                Adam corrects for this initialization bias by dividing by (1 − β<sup>t</sup>),
                which is close to 0 at the start (making the correction large) and close to 1
                after many steps (making the correction negligible). It's a warm-up mechanism
                built directly into the math.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>First moment, second moment, bias correction</h2>

            <h3>Step 1 — Compute Gradient</h3>
            <MathBlock tex="g_t = \nabla_\theta \mathcal{L}(\theta_{t-1})" />

            <h3>Step 2 — Update First Moment (Momentum)</h3>
            <p>Exponential moving average of the gradient — the direction estimate:</p>
            <MathBlock tex="m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t" />
            <p>
                With β₁ = 0.9, this is 90% previous direction + 10% new gradient.
                Initialized m<sub>0</sub> = 0.
            </p>

            <h3>Step 3 — Update Second Moment (Adaptive Scale)</h3>
            <p>Exponential moving average of squared gradient — the variance estimate:</p>
            <MathBlock tex="v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2" />
            <p>
                With β₂ = 0.999. Large v<sub>t</sub> → parameter has had large/noisy gradients
                → take smaller steps. Initialized v<sub>0</sub> = 0.
            </p>

            <h3>Step 4 — Bias Correction</h3>
            <p>
                Because m<sub>0</sub> = v<sub>0</sub> = 0, early estimates are biased toward zero.
                The corrected estimates:
            </p>
            <MathBlock tex="\hat{m}_t = \frac{m_t}{1 - \beta_1^t} \qquad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}" />
            <p>
                At t=1: 1−β₁¹ = 0.1, so m̂<sub>1</sub> = m<sub>1</sub>/0.1 = 10·m<sub>1</sub>.
                By t=100, correction ≈ 1.0 (no longer needed).
            </p>

            <h3>Step 5 — Parameter Update</h3>
            <MathBlock tex="\theta_t = \theta_{t-1} - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}" />
            <p>
                Defaults: α=0.001 (learning rate), β₁=0.9, β₂=0.999, ε=1e-8.
            </p>

            <hr className="ch-sep" />

            <h3>Effective Learning Rate Per Parameter</h3>
            <p>
                The effective step size for parameter θ<sub>i</sub> is approximately:
            </p>
            <MathBlock tex="\Delta\theta_i \approx \alpha \cdot \frac{m_i / (1-\beta_1^t)}{\sqrt{v_i / (1-\beta_2^t)} + \varepsilon} \approx \alpha \cdot \text{sign}(g_t) \quad \text{when } |g_t| \text{ is consistent}" />
            <p>
                In the long run, Adam's updates are approximately ±α for each parameter —
                the adaptive second moment normalizes the step to have unit scale.
            </p>

            <div className="ch-callout">
                <strong>AdamW vs Adam:</strong> In Adam, L2 regularization adds λθ to the gradient,
                which then gets divided by √v̂ — making weight decay weaker for parameters with
                large gradients. AdamW applies weight decay directly to the parameter: θ ← θ(1−αλ)
                before the gradient step. This is mathematically correct and critical for Transformers.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Bias correction derivation, convergence, and AdamW</h2>

            <DefBlock label="Adam Algorithm (Kingma & Ba, 2014)">
                Hyperparameters: α (step size), β₁, β₂ ∈ [0,1) (decay rates), ε &gt; 0 (numerical stability).
                Initialize m₀ = 0, v₀ = 0, θ₀.
                <br /><br />
                At each step t = 1, 2, ...:
                <br />
                g<sub>t</sub> = ∇<sub>θ</sub>L(θ<sub>t-1</sub>) — stochastic gradient
                <br />
                m<sub>t</sub> = β₁m<sub>t-1</sub> + (1−β₁)g<sub>t</sub>
                <br />
                v<sub>t</sub> = β₂v<sub>t-1</sub> + (1−β₂)g<sub>t</sub>²
                <br />
                m̂<sub>t</sub> = m<sub>t</sub>/(1−β₁<sup>t</sup>), v̂<sub>t</sub> = v<sub>t</sub>/(1−β₂<sup>t</sup>)
                <br />
                θ<sub>t</sub> = θ<sub>t-1</sub> − α · m̂<sub>t</sub>/(√v̂<sub>t</sub> + ε)
            </DefBlock>

            <h3>Bias Correction Derivation</h3>
            <p>Unrolling the first moment recurrence:</p>
            <MathBlock tex="m_t = (1-\beta_1)\sum_{i=1}^{t} \beta_1^{t-i} g_i" />
            <p>Taking expectation (assuming g<sub>i</sub> are i.i.d. with mean μ):</p>
            <MathBlock tex="\mathbb{E}[m_t] = \mu (1 - \beta_1^t) + \zeta" />
            <p>
                where ζ accounts for the difference between past and current gradients (small for
                slowly varying gradients). The bias factor (1−β₁<sup>t</sup>) shrinks m toward zero —
                dividing by it corrects the bias:
            </p>
            <MathBlock tex="\mathbb{E}[\hat{m}_t] = \frac{\mathbb{E}[m_t]}{1 - \beta_1^t} \approx \mu" />

            <h3>Second Moment and Adaptive Scale</h3>
            <MathBlock tex="\mathbb{E}[v_t] = (1 - \beta_2^t) \cdot \mathbb{E}[g_t^2]" />
            <MathBlock tex="\hat{v}_t = \frac{v_t}{1-\beta_2^t} \approx \mathbb{E}[g_t^2]" />
            <p>
                The update is thus approximately: α · 𝔼[g] / √𝔼[g²]. By Jensen's inequality,
                𝔼[g²] ≥ 𝔼[g]², so √𝔼[g²] ≥ |𝔼[g]|. The effective step size is always ≤ α.
            </p>

            <h3>AdamW: Decoupled Weight Decay</h3>
            <p>Standard Adam with L2 regularization (L(θ) = L₀(θ) + λ||θ||²):</p>
            <MathBlock tex="\theta_t = \theta_{t-1} - \alpha \cdot \frac{\hat{m}_t + \lambda\theta_{t-1} / \sqrt{\hat{v}_t + \varepsilon}}{1}" />
            <p>Problem: λθ<sub>t-1</sub> gets divided by √v̂ — weight decay is not uniform.</p>
            <p>AdamW decouples weight decay from the adaptive gradient update:</p>
            <MathBlock tex="\theta_t = \theta_{t-1}(1 - \alpha\lambda) - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}" />

            <div className="ch-callout">
                <strong>Why ε matters:</strong> ε = 1e-8 prevents division by zero. But its choice
                affects behavior: larger ε (e.g. 1e-4) makes Adam more like SGD with momentum
                (the denominator dominates). Smaller ε makes it more fully adaptive.
                Transformers sometimes use ε = 1e-6 for better gradient signal in early training.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Manual Adam implementation ────────────────────────────────────────────────

class AdamOptimizer:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
        self.lr    = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.eps   = eps
        self.m     = None   # first moment
        self.v     = None   # second moment
        self.t     = 0      # step counter

    def step(self, theta, grad):
        if self.m is None:
            self.m = np.zeros_like(theta)
            self.v = np.zeros_like(theta)

        self.t += 1
        b1, b2 = self.beta1, self.beta2

        # Update biased moment estimates
        self.m = b1 * self.m + (1 - b1) * grad
        self.v = b2 * self.v + (1 - b2) * grad**2

        # Bias-corrected estimates
        m_hat = self.m / (1 - b1**self.t)
        v_hat = self.v / (1 - b2**self.t)

        # Parameter update
        theta -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
        return theta

# ── Loss landscape: Beale function (non-convex, multi-modal) ──────────────────
# f(x,y) = (1.5 - x + xy)^2 + (2.25 - x + xy^2)^2 + (2.625 - x + xy^3)^2
# Global minimum at (3, 0.5)

def beale(p):
    x, y = p
    return ((1.5 - x + x*y)**2 +
            (2.25 - x + x*y**2)**2 +
            (2.625 - x + x*y**3)**2)

def beale_grad(p):
    x, y = p
    t1 = 1.5   - x + x*y
    t2 = 2.25  - x + x*y**2
    t3 = 2.625 - x + x*y**3
    dx = 2*t1*(y-1) + 2*t2*(y**2-1) + 2*t3*(y**3-1)
    dy = 2*t1*x + 2*t2*(2*x*y) + 2*t3*(3*x*y**2)
    return np.array([dx, dy])

# ── SGD with momentum ─────────────────────────────────────────────────────────
def run_sgd_momentum(steps=300, lr=0.001, gamma=0.9):
    theta = np.array([0.5, 0.5])
    v = np.zeros(2)
    losses = []
    for _ in range(steps):
        g = beale_grad(theta)
        v = gamma * v + lr * g
        theta -= v
        losses.append(beale(theta))
    return losses, theta

# ── Adam ──────────────────────────────────────────────────────────────────────
def run_adam(steps=300, lr=0.001):
    theta = np.array([0.5, 0.5])
    opt   = AdamOptimizer(lr=lr)
    losses = []
    for _ in range(steps):
        g     = beale_grad(theta)
        theta = opt.step(theta, g)
        losses.append(beale(theta))
    return losses, theta

# ── Compare ────────────────────────────────────────────────────────────────────
print("=" * 60)
print("Beale function optimization: SGD+Momentum vs Adam")
print("Global minimum at (3, 0.5) with f=0.0")
print("=" * 60)

sgd_losses, sgd_final = run_sgd_momentum()
adam_losses, adam_final = run_adam()

print(f"{'Steps':>6}  {'SGD+Mom loss':>14}  {'Adam loss':>14}")
print("-" * 40)
for step in [0, 50, 100, 200, 299]:
    print(f"{step:>6}  {sgd_losses[step]:>14.6f}  {adam_losses[step]:>14.6f}")

print()
print(f"SGD final position:  ({sgd_final[0]:.4f}, {sgd_final[1]:.4f})")
print(f"Adam final position: ({adam_final[0]:.4f}, {adam_final[1]:.4f})")
print(f"Target:              (3.0000, 0.5000)")

# ── Bias correction visualization ─────────────────────────────────────────────
print()
print("Bias correction factor (1 - beta^t):")
print(f"{'t':>6}  {'beta1=0.9':>12}  {'beta2=0.999':>12}")
for t in [1, 2, 5, 10, 50, 100]:
    bc1 = 1 - 0.9**t
    bc2 = 1 - 0.999**t
    print(f"{t:>6}  {bc1:>12.6f}  {bc2:>12.6f}")
`

function PythonTab() {
    return (
        <>
            <p>
                Manual Adam implementation from scratch, applied to the Beale function (a
                non-convex benchmark with a global minimum at (3, 0.5)). Compared against
                SGD with momentum. Also shows the bias correction factor over time — demonstrating
                why early steps need correction.
            </p>
            <CodeBlock code={PY_CODE} filename="adam_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Adam Optimizer — TypeScript ──────────────────────────────────────────────

type Vec = number[]

interface AdamState {
  m: Vec    // first moment
  v: Vec    // second moment
  t: number // step count
}

interface AdamConfig {
  lr?:    number  // default 0.001
  beta1?: number  // default 0.9
  beta2?: number  // default 0.999
  eps?:   number  // default 1e-8
}

function createAdam(dim: number, cfg: AdamConfig = {}): AdamState {
  return {
    m: new Array(dim).fill(0),
    v: new Array(dim).fill(0),
    t: 0,
  }
}

function adamStep(
  theta: Vec,
  grad: Vec,
  state: AdamState,
  cfg: AdamConfig = {}
): Vec {
  const lr    = cfg.lr    ?? 0.001
  const beta1 = cfg.beta1 ?? 0.9
  const beta2 = cfg.beta2 ?? 0.999
  const eps   = cfg.eps   ?? 1e-8

  state.t += 1
  const t = state.t

  // Update biased moment estimates
  state.m = state.m.map((mi, i) => beta1 * mi + (1 - beta1) * grad[i])
  state.v = state.v.map((vi, i) => beta2 * vi + (1 - beta2) * grad[i] ** 2)

  // Bias correction
  const bc1 = 1 - beta1 ** t
  const bc2 = 1 - beta2 ** t

  // Parameter update
  return theta.map((th, i) => {
    const mHat = state.m[i] / bc1
    const vHat = state.v[i] / bc2
    return th - lr * mHat / (Math.sqrt(vHat) + eps)
  })
}

// ── Quadratic test: f(x) = x² (minimum at x=0) ───────────────────────────────
function optimizeQuadratic(steps = 50): void {
  let theta = [10.0]   // start far from minimum
  const state = createAdam(1)

  console.log("Adam on f(x) = x²")
  console.log("─".repeat(45))
  console.log(\`\${"Step".padEnd(6)} | \${"x".padEnd(12)} | \${"f(x)".padEnd(12)} | bias_correction\`)
  console.log("─".repeat(45))

  for (let t = 1; t <= steps; t++) {
    const grad = [2 * theta[0]]   // ∇f = 2x
    theta = adamStep(theta, grad, state)

    if ([1, 2, 5, 10, 20, 50].includes(t)) {
      const bc = 1 - 0.9 ** t
      const loss = theta[0] ** 2
      console.log(
        \`\${String(t).padEnd(6)} | \${theta[0].toFixed(6).padEnd(12)} | \${loss.toFixed(6).padEnd(12)} | \${bc.toFixed(6)}\`
      )
    }
  }
}

optimizeQuadratic()

// ── Compare: Adam vs plain SGD ────────────────────────────────────────────────
console.log()
console.log("Effective step size analysis:")
console.log("Adam converges to ≈ ±α regardless of gradient scale")
console.log("This is why Adam works well across different parameter scales")

const scales = [0.001, 0.1, 1.0, 10.0, 1000.0]
console.log(\`\\n\${"Gradient":>12} | \${"SGD step (lr=0.01)":>20} | Adam step (α=0.01)\`)
for (const g of scales) {
  const sgdStep = 0.01 * g
  // Adam effective step ≈ α · sign(g) when |g| is consistent
  const adamEff = 0.01  // always ≈ α
  console.log(\`\${String(g).padEnd(12)} | \${sgdStep.toFixed(6).padEnd(20)} | \${adamEff.toFixed(6}\`)
}
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of Adam optimizer with full bias correction.
                Applied to a quadratic function to show convergence and how the bias
                correction factor evolves from near-zero at t=1 to ≈1.0 at t=100.
            </p>
            <CodeBlock code={TS_CODE} filename="adam.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ADAM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
