import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The optimizer that became the default</h2>
            <p>
                Adam (Adaptive Moment Estimation) was introduced by Diederik Kingma and Jimmy Ba at ICLR 2015. Within two years of its publication, it had become the default optimizer for the majority of deep learning research — and it remains so today. Understanding Adam requires tracing the line of adaptive learning rate methods it synthesized, each solving a specific failure mode of the one before it.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1964–1988</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Momentum — The First Moment</div>
                    <div className="ch-tl-body">
                        Boris Polyak's heavy ball method (1964) and Rumelhart et al.'s application to neural networks (1986) established momentum as the standard training technique. Momentum accumulates gradient history via an exponential moving average — the first moment. This is the foundation of Adam's first component: m<sub>t</sub> = β₁m<sub>t-1</sub> + (1−β₁)g<sub>t</sub>. Adam's first moment is exactly this core momentum mechanism, with a specific bias-correction twist added later.
                        <br /><br />
                        However, momentum alone uses the same effective learning rate for every parameter. A parameter whose gradient is consistently large gets the same step size as one whose gradient is consistently small — the scaling is not adapted to each parameter's behavior. This is the gap that Adagrad would fill.
                    </div>
                    <div className="ch-tl-impact">Impact: First moment estimate — the foundation of Adam's momentum term; established that gradient history should inform updates</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2011</div>
                    <div className="ch-tl-section-label">Per-Parameter Adaptive LR</div>
                    <div className="ch-tl-title">AdaGrad — Duchi, Hazan, and Singer</div>
                    <div className="ch-tl-body">
                        John Duchi, Elad Hazan, and Yoram Singer published "Adaptive Subgradient Methods for Online Learning and Stochastic Optimization" at JMLR 2011. AdaGrad's insight: parameters that receive rare large gradients (e.g., embedding weights for unusual words) should receive larger steps to catch up; parameters that receive frequent large gradients should receive smaller steps because they are already being updated aggressively.
                        <br /><br />
                        The AdaGrad update: θ<sub>t</sub> = θ<sub>t-1</sub> − η/√(G<sub>t</sub> + ε) · g<sub>t</sub>, where G<sub>t</sub> = Σ<sub>k=1</sub><sup>t</sup>g<sub>k</sub>² accumulates all squared gradients. This was revolutionary for NLP tasks (sparse embeddings) but had a fatal flaw: G<sub>t</sub> grows monotonically — the effective learning rate shrinks to zero during long training, making AdaGrad unusable for deep networks that require thousands of epochs.
                    </div>
                    <div className="ch-tl-impact">Impact: Established adaptive per-parameter learning rates; revealed the vanishing LR problem; excellent for sparse data</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2012</div>
                    <div className="ch-tl-section-label">Fix for AdaGrad</div>
                    <div className="ch-tl-title">RMSProp — Hinton (Unpublished)</div>
                    <div className="ch-tl-body">
                        Geoffrey Hinton introduced RMSProp in his Coursera lecture notes — one of the most influential unpublished methods in the history of deep learning. The fix for AdaGrad's vanishing learning rate was elegant: replace the cumulative sum of squared gradients with an exponential moving average.
                        <br /><br />
                        v<sub>t</sub> = β₂v<sub>t-1</sub> + (1−β₂)g<sub>t</sub>². This decaying average "forgets" old gradients — if the gradient magnitude changes, the second moment adapts rather than accumulating forever. The step size θ<sub>t</sub> = θ<sub>t-1</sub> − η/√(v<sub>t</sub> + ε) · g<sub>t</sub> remains non-zero throughout training. Adam's second moment estimate is exactly RMSProp's v<sub>t</sub>, with the addition of bias correction.
                    </div>
                    <div className="ch-tl-impact">Impact: Fixed AdaGrad's monotonic decay; became Adam's second moment; first practical adaptive optimizer for deep learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Synthesis</div>
                    <div className="ch-tl-title">Adam — Kingma and Ba (ICLR 2015)</div>
                    <div className="ch-tl-body">
                        Diederik Kingma and Jimmy Ba combined momentum (first moment, from SGD+momentum) and RMSProp (second moment, from Hinton), adding a crucial insight: <em>bias correction</em>. Because both moments are initialized at zero, the early estimates are biased toward zero. Without correction, the first update step would use nearly-zero estimates and produce garbage results.
                        <br /><br />
                        Adam's bias correction divides by (1−β₁<sup>t</sup>) and (1−β₂<sup>t</sup>), making the early estimates unbiased approximations of the true moments. The defaults β₁=0.9, β₂=0.999, ε=1e-8, α=0.001 were chosen to work reliably across an extraordinary range of architectures and datasets — and they have proved remarkably robust. The paper was cited over 100,000 times within a decade of publication.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default optimizer in deep learning within 2 years; 100,000+ citations; used in virtually every major AI system</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2018</div>
                    <div className="ch-tl-section-label">Convergence Fix</div>
                    <div className="ch-tl-title">AMSGrad — Reddi, Kale, and Kumar</div>
                    <div className="ch-tl-body">
                        Sashank Reddi, Satyen Kale, and Sanjiv Kumar published "On the Convergence of Adam and Beyond" at ICLR 2018, providing the first theoretical blow to Adam: they constructed a simple convex problem on which Adam fails to converge. The issue is that Adam's second moment v<sub>t</sub> can decrease over time (if gradients become smaller), making recent large gradient steps larger than they should be.
                        <br /><br />
                        The fix, AMSGrad, replaces v<sub>t</sub> with v̂<sub>t</sub> = max(v̂<sub>t-1</sub>, v<sub>t</sub>) — a monotonically non-decreasing second moment. This guarantees convergence theoretically. In practice, the difference between Adam and AMSGrad is often small on real tasks, which is why Adam remains dominant despite the theoretical gap.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved Adam's theoretical failure mode; proposed AMSGrad convergence fix; sparked theoretical analysis of adaptive methods</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2019</div>
                    <div className="ch-tl-section-label">Weight Decay Fix</div>
                    <div className="ch-tl-title">AdamW — Loshchilov and Hutter</div>
                    <div className="ch-tl-body">
                        Ilya Loshchilov and Frank Hutter published "Decoupled Weight Decay Regularization" (ICLR 2019), identifying a subtle but critical bug in how Adam handles L2 regularization. In standard Adam, L2 regularization adds λθ to the gradient, which then gets divided by √v̂ — making weight decay weaker for parameters with large gradient variance. This is not what weight decay is supposed to do.
                        <br /><br />
                        AdamW applies weight decay directly to the parameter before the gradient step: θ ← θ(1−αλ). This decoupled weight decay is mathematically correct and prevents large-gradient parameters from receiving disproportionately weak regularization. BERT, GPT, LLaMA, and virtually every large Transformer model is trained with AdamW rather than Adam.
                    </div>
                    <div className="ch-tl-impact">Impact: AdamW is the standard optimizer for Transformers and LLMs; decoupled weight decay is now considered the correct implementation</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why Adam dominates:</strong> Adam combines the best of two worlds — the directional smoothing of momentum (first moment) and the parameter-wise scaling of RMSProp (second moment). The result is an optimizer that works well with minimal hyperparameter tuning across vastly different tasks. The default settings (β₁=0.9, β₂=0.999, α=1e-3) often work with no adjustment — a property that no other optimizer class has matched at the same scale.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A smart optimizer that learns from its own history</h2>

            <Analogy label="The Problem: Every Parameter Is Different">
                Imagine you're training a neural network with millions of parameters. Some parameters get updated a lot (like embedding weights for common words), some get updated rarely (like weights for rare words). Should they all use the same step size?
                <br /><br />
                Plain SGD uses the same learning rate for everything — like driving at the same speed whether you're on a highway or navigating a narrow alley. Adam uses a different speed for each parameter, based on its own history.
            </Analogy>

            <Analogy label="AdaGrad — Smart but Forgetful in the Wrong Direction">
                Before Adam, AdaGrad tried to fix the "same step size for everything" problem. It gave rare parameters bigger steps and common parameters smaller steps. For tasks like word embeddings, this was brilliant — a rare word's embedding would get a big update when it appeared, and a common word like "the" would get smaller updates to prevent overshooting.
                <br /><br />
                But AdaGrad had a fatal flaw: it never forgot. It kept adding up all past squared gradients forever. So after a million steps, every parameter's step size had shrunk nearly to zero — the model stopped learning. Adam's second moment fixed this by using a decaying average that "forgets" old gradients.
            </Analogy>

            <Analogy label="Two Running Averages — Momentum plus Memory">
                Adam keeps two memories for each parameter:
                <br /><br />
                <strong>m (first moment)</strong>: The recent average direction of the gradient. This is momentum — it smooths out gradient noise and keeps moving in the right direction.
                <br /><br />
                <strong>v (second moment)</strong>: The recent average of the squared gradient. This tells Adam how "confident" the gradient has been recently. Large v means the gradient has been big and noisy — take a smaller step. Small v means the gradient has been small and consistent — take a larger step.
                <br /><br />
                Adam divides the momentum by the square root of this confidence measure. If a parameter's gradient has been consistently small, Adam gives it a bigger effective learning rate. If it has been erratic, Adam slows down.
            </Analogy>

            <Analogy label="Bias Correction — A Clean Start">
                There's one more trick. At the start of training, both m and v are zero. The very first update would use almost-zero estimates of the moments, giving garbage results.
                <br /><br />
                Adam corrects for this initialization bias by dividing by (1 − β<sup>t</sup>), which is close to 0 at the start (making the correction large) and close to 1 after many steps (making the correction negligible). It's a warm-up mechanism built directly into the math.
            </Analogy>

            <Analogy label="AdamW — Getting Weight Decay Right">
                When you add L2 regularization to Adam, there's a subtle problem: the regularization term (which penalizes large weights) gets mixed up with the adaptive scaling. A weight that receives large gradients gets weaker regularization than one that receives small gradients — even if both weights are equally large and should be equally penalized.
                <br /><br />
                AdamW fixes this by applying weight decay separately from the gradient update. Every weight shrinks by a small factor each step (e.g., multiply by 0.9999), completely independently of how large its gradient was. This "decoupled" weight decay is now how every major language model — GPT, BERT, LLaMA — is trained.
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
                With β₁ = 0.9, this is 90% previous direction + 10% new gradient. Initialized m<sub>0</sub> = 0.
            </p>

            <h3>Step 3 — Update Second Moment (Adaptive Scale)</h3>
            <p>Exponential moving average of squared gradient — the variance estimate:</p>
            <MathBlock tex="v_t = \beta_2 v_{t-1} + (1 - \beta_2) g_t^2" />
            <p>
                With β₂ = 0.999. Large v<sub>t</sub> → parameter has had large/noisy gradients → take smaller steps. Initialized v<sub>0</sub> = 0.
            </p>

            <h3>Step 4 — Bias Correction</h3>
            <p>
                Because m<sub>0</sub> = v<sub>0</sub> = 0, early estimates are biased toward zero. The corrected estimates:
            </p>
            <MathBlock tex="\hat{m}_t = \frac{m_t}{1 - \beta_1^t} \qquad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}" />
            <p>
                At t=1: 1−β₁¹ = 0.1, so m̂<sub>1</sub> = m<sub>1</sub>/0.1 = 10·m<sub>1</sub>. By t=100, correction ≈ 1.0 (no longer needed).
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
                In the long run, Adam's updates are approximately ±α for each parameter — the adaptive second moment normalizes the step to have unit scale.
            </p>

            <h3>AdamW: Decoupled Weight Decay</h3>
            <p>
                Standard Adam applies L2 regularization as part of the gradient, which then gets divided by √v̂. AdamW separates the two:
            </p>
            <MathBlock tex="\theta_t = \theta_{t-1}(1 - \alpha\lambda) - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}" />
            <p>
                The weight decay term (1−αλ) shrinks weights uniformly, independent of gradient history. This is mathematically correct and critical for Transformers.
            </p>

            <div className="ch-callout">
                <strong>AdamW vs Adam:</strong> In Adam, L2 regularization adds λθ to the gradient, which then gets divided by √v̂ — making weight decay weaker for parameters with large gradients. AdamW applies weight decay directly to the parameter: θ ← θ(1−αλ) before the gradient step. This is mathematically correct and critical for Transformers.
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
            <h2>Bias correction derivation, convergence, and AdamW</h2>

            <DefBlock label="Adam Algorithm (Kingma and Ba, 2014)">
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
                where ζ accounts for the difference between past and current gradients (small for slowly varying gradients). The bias factor (1−β₁<sup>t</sup>) shrinks m toward zero — dividing by it corrects the bias:
            </p>
            <MathBlock tex="\mathbb{E}[\hat{m}_t] = \frac{\mathbb{E}[m_t]}{1 - \beta_1^t} \approx \mu" />

            <h3>Second Moment and Adaptive Scale</h3>
            <MathBlock tex="\mathbb{E}[v_t] = (1 - \beta_2^t) \cdot \mathbb{E}[g_t^2]" />
            <MathBlock tex="\hat{v}_t = \frac{v_t}{1-\beta_2^t} \approx \mathbb{E}[g_t^2]" />
            <p>
                The update is thus approximately: α · 𝔼[g] / √𝔼[g²]. By Jensen's inequality, 𝔼[g²] ≥ 𝔼[g]², so √𝔼[g²] ≥ |𝔼[g]|. The effective step size is always ≤ α.
            </p>

            <h3>AMSGrad: Monotone Second Moment</h3>
            <p>Reddi et al. (2018) showed Adam can fail on this simple convex example and proposed keeping a running maximum of v̂:</p>
            <MathBlock tex="\hat{v}_t^{\max} = \max(\hat{v}_{t-1}^{\max},\, \hat{v}_t)" />
            <MathBlock tex="\theta_t = \theta_{t-1} - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t^{\max}} + \varepsilon}" />
            <p>The non-decreasing denominator guarantees convergence but may slow adaptation in practice.</p>

            <h3>AdamW: Decoupled Weight Decay</h3>
            <p>Standard Adam with L2 regularization (L(θ) = L₀(θ) + λ||θ||²) mixes weight decay into the gradient:</p>
            <MathBlock tex="\theta_t = \theta_{t-1} - \alpha \cdot \frac{\hat{m}_t + \lambda\theta_{t-1} / \sqrt{\hat{v}_t + \varepsilon}}{1}" />
            <p>Problem: λθ<sub>t-1</sub> gets divided by √v̂ — weight decay is not uniform. AdamW decouples weight decay from the adaptive gradient update:</p>
            <MathBlock tex="\theta_t = \theta_{t-1}(1 - \alpha\lambda) - \alpha \cdot \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \varepsilon}" />

            <div className="ch-callout">
                <strong>Why ε matters:</strong> ε = 1e-8 prevents division by zero. But its choice affects behavior: larger ε (e.g. 1e-4) makes Adam more like SGD with momentum (the denominator dominates). Smaller ε makes it more fully adaptive. Transformers sometimes use ε = 1e-6 for better gradient signal in early training.
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

# ── PyTorch AdamW ──────────────────────────────────────────────────────────────
import torch
import torch.nn as nn

print()
print("PyTorch AdamW (the standard for Transformers):")
model = nn.Linear(10, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

for step in range(5):
    optimizer.zero_grad()
    x = torch.randn(8, 10)
    y = torch.randn(8, 1)
    loss = ((model(x) - y)**2).mean()
    loss.backward()
    optimizer.step()
    print(f"  step={step+1}: loss={loss.item():.6f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Manual Adam implementation from scratch, applied to the Beale function (a non-convex benchmark with a global minimum at (3, 0.5)). Compared against SGD with momentum. Also shows the bias correction factor over time — demonstrating why early steps need correction — and a PyTorch AdamW demo.
            </p>
            <CodeBlock code={PY_CODE} filename="adam_demo.py" lang="python" langLabel="Python" />
        </>
    )
}



// ── Tab content map ───────────────────────────────────────────────────────────

export const ADAM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
