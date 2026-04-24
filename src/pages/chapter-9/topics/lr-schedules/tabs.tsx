import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From constant step sizes to carefully tuned schedules</h2>
            <p>
                The learning rate is the single most important hyperparameter in deep learning.
                The same model with the same data can converge beautifully or diverge catastrophically
                depending entirely on how the learning rate changes over training. Learning rate
                scheduling — the art and science of varying η over time — evolved from simple
                rules of thumb to precisely designed schedules that are themselves hyperparameters.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1960s–1980s</div>
                    <div className="ch-tl-section-label">Classical Methods</div>
                    <div className="ch-tl-title">Constant LR and polynomial decay</div>
                    <div className="ch-tl-body">
                        Early neural network training used constant learning rates or simple
                        polynomial decay schedules from numerical optimization theory. Stochastic
                        approximation theory (Robbins-Monro, 1951) established that SGD converges
                        if Ση = ∞ and Ση² &lt; ∞ — satisfied by 1/t decay. In practice,
                        step decay (halving every N epochs) was the pragmatic standard.
                    </div>
                    <div className="ch-tl-impact">Context: Small networks trained with constant or step decay LR</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Cyclical Learning Rates</div>
                    <div className="ch-tl-title">Smith — Cyclical Learning Rates for Training Neural Networks</div>
                    <div className="ch-tl-body">
                        Leslie Smith's paper challenged the orthodoxy of monotonically decreasing
                        learning rates. His cyclical LR policy triangularly oscillates the LR between
                        a minimum and maximum. The key insight: periodically increasing the LR acts
                        as a form of simulated annealing, helping escape sharp minima and saddle points.
                        Smith also introduced the LR range test: train with exponentially increasing LR
                        and find the range where loss decreases fastest.
                    </div>
                    <div className="ch-tl-impact">Impact: First principled argument for increasing LR during training; LR range test became a standard tool</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Warmup</div>
                    <div className="ch-tl-title">Vaswani et al. — Transformer LR Schedule</div>
                    <div className="ch-tl-body">
                        "Attention Is All You Need" introduced the now-canonical warmup-then-decay
                        schedule for Transformers. LR increases linearly for warmup_steps steps,
                        then decreases proportionally to 1/√step. The warmup is critical: at the
                        start of training, the model's parameters are random, gradients are unstable,
                        and a large LR causes the Adam second-moment estimate to be unreliable.
                        Warmup prevents this cold-start instability.
                    </div>
                    <div className="ch-tl-impact">Impact: Warmup became mandatory for Transformer training; all LLMs use warmup</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2018</div>
                    <div className="ch-tl-section-label">Cosine Annealing</div>
                    <div className="ch-tl-title">Loshchilov & Hutter — SGDR and Cosine Annealing</div>
                    <div className="ch-tl-body">
                        "SGDR: Stochastic Gradient Descent with Warm Restarts" proposed cosine
                        annealing with periodic restarts. The LR follows a cosine curve from η<sub>max</sub>
                        to η<sub>min</sub>, then resets ("warm restarts"). Cosine annealing became
                        the default schedule for ImageNet training and large-scale language model
                        training — smooth, gradual decay that reaches a well-defined minimum.
                    </div>
                    <div className="ch-tl-impact">Impact: Cosine schedule is now the most common LR schedule in large model training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018–2019</div>
                    <div className="ch-tl-section-label">One-Cycle</div>
                    <div className="ch-tl-title">Smith & Tobin — The One-Cycle Policy</div>
                    <div className="ch-tl-body">
                        The one-cycle policy: increase LR from a small value to η<sub>max</sub> over
                        the first 30% of training, then decrease to near zero over the remaining 70%.
                        Also cycle the momentum in reverse. This "super-convergence" can achieve
                        the same final accuracy in 5–10× fewer epochs — making it popular for
                        fast experimentation.
                    </div>
                    <div className="ch-tl-impact">Impact: Standard in fast.ai; enables training in fraction of usual epochs</div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How fast to learn — and why the speed should change</h2>

            <Analogy label="The Learning Rate as Step Size">
                Imagine you're hiking down a mountain in the dark, using only a compass that
                points downhill. Your "learning rate" is how big a step you take each time
                the compass points somewhere.
                <br /><br />
                If you take huge steps: you might step off a cliff, overshoot valleys, or
                bounce between walls. If you take tiny steps: you'll get there eventually,
                but it'll take forever.
                <br /><br />
                The perfect strategy: start with medium steps to get into the right valley,
                then take smaller and smaller steps as you get closer to the bottom —
                that's learning rate decay.
            </Analogy>

            <Analogy label="Warmup: Don't Run Before You Can Walk">
                At the very start of training, the neural network's weights are random noise.
                The gradients are chaotic and unreliable. If you start with a large learning rate,
                you'll take huge steps in random directions and break everything.
                <br /><br />
                Warmup says: start very small, gradually increase to the target learning rate
                over the first few thousand steps. By then, the model has settled into a
                reasonable region of parameter space, gradients are informative, and it's safe
                to learn fast.
                <br /><br />
                It's like warming up your muscles before a sprint — starting slow prevents injury.
            </Analogy>

            <Analogy label="Cosine Annealing: A Smooth Gentle Slowdown">
                Step decay (halving every N epochs) creates sudden jumps in learning rate —
                the training loss suddenly drops after each halving, then plateaus until the
                next halving.
                <br /><br />
                Cosine annealing smoothly curves the learning rate down, following the shape
                of a cosine curve. This smooth slowdown is gentler and often finds better
                final solutions because it never suddenly changes how fast it's learning.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Common schedules and when to use each</h2>

            <h3>Step Decay</h3>
            <p>
                Multiply the learning rate by a factor γ every N epochs:
            </p>
            <MathBlock tex="\eta_t = \eta_0 \cdot \gamma^{\lfloor t / N \rfloor}" />
            <p>
                Example: η₀=0.1, γ=0.1, N=30 epochs → LR drops to 0.01 at epoch 30,
                0.001 at epoch 60. Simple but creates discontinuities in the training curve.
            </p>

            <h3>Cosine Annealing (Loshchilov & Hutter, 2017)</h3>
            <p>
                Smoothly decay from η<sub>max</sub> to η<sub>min</sub> over T steps:
            </p>
            <MathBlock tex="\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\!\left(\frac{\pi t}{T}\right)\right)" />
            <p>
                At t=0: η = η<sub>max</sub>. At t=T: η = η<sub>min</sub>. Smooth, monotone decay.
                With warm restarts (SGDR): repeat the cosine cycle periodically, doubling the
                period each time.
            </p>

            <h3>Warmup + Decay (Transformer Schedule)</h3>
            <p>
                Linear warmup for warmup_steps, then inverse-square-root decay:
            </p>
            <MathBlock tex="\eta_t = d_{\text{model}}^{-0.5} \cdot \min\!\left(t^{-0.5},\; t \cdot \text{warmup\_steps}^{-1.5}\right)" />
            <p>
                LR increases linearly for the first warmup_steps steps, then decreases as 1/√t.
                Peak LR occurs at t = warmup_steps. Used in the original Transformer and many LLMs.
            </p>

            <h3>One-Cycle Policy</h3>
            <ul>
                <li>Phase 1 (0→30%): LR increases from η<sub>min</sub> to η<sub>max</sub> (cosine up)</li>
                <li>Phase 2 (30%→100%): LR decreases from η<sub>max</sub> to ~0 (cosine down)</li>
                <li>Momentum cycles in reverse: high at start, low in the middle, high at end</li>
            </ul>

            <hr className="ch-sep" />

            <h3>LR Range Test (Smith, 2017)</h3>
            <p>
                A practical diagnostic: train for one epoch with LR increasing exponentially from
                1e-7 to 10. Plot loss vs LR. The optimal LR is roughly 1 decade below where loss
                starts to increase sharply.
            </p>

            <div className="ch-callout">
                <strong>Rule of thumb for modern training:</strong> Use cosine annealing with linear
                warmup for Transformer-based models. The warmup duration is typically 1-5% of total
                training steps. The cosine minimum is typically 10% of the peak LR. This combination
                — warmup + cosine — is used by GPT-3, LLaMA, and most modern LLMs.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Convergence theory, warmup necessity, and cosine properties</h2>

            <DefBlock label="Convergence Conditions (Robbins-Monro, 1951)">
                For SGD to converge to the minimum of a convex function, the learning rate
                sequence η<sub>t</sub> must satisfy:
                <br /><br />
                Σ<sub>t=1</sub><sup>∞</sup> η<sub>t</sub> = ∞ &emsp; (LR must not decay too fast — enough total progress)
                <br />
                Σ<sub>t=1</sub><sup>∞</sup> η<sub>t</sub>² &lt; ∞ &emsp; (LR must decay — variance must go to zero)
            </DefBlock>
            <p>
                Schedule η<sub>t</sub> = η₀/t satisfies both. But 1/t decay is too aggressive
                for neural networks — the LR drops too fast in early training.
            </p>

            <h3>Cosine Annealing: Properties</h3>
            <MathBlock tex="\eta_t = \eta_{\min} + \frac{\eta_{\max} - \eta_{\min}}{2}\left(1 + \cos\!\left(\frac{\pi t}{T}\right)\right)" />
            <p>Key properties:</p>
            <ul>
                <li>η<sub>0</sub> = η<sub>max</sub>, η<sub>T</sub> = η<sub>min</sub></li>
                <li>Derivative: dη/dt = −(π/2T)(η<sub>max</sub>−η<sub>min</sub>) sin(πt/T) — slow at extremes, fast in the middle</li>
                <li>The cosine shape decays slowly at first (keeping large LR for broad exploration) then accelerates toward the minimum</li>
            </ul>

            <h3>Why Warmup Is Necessary for Adam</h3>
            <p>
                Recall Adam's second moment: v<sub>t</sub> = β₂v<sub>t-1</sub> + (1−β₂)g<sub>t</sub>².
                At t=1: v<sub>1</sub> = (1−β₂)g<sub>1</sub>². The bias-corrected estimate:
            </p>
            <MathBlock tex="\hat{v}_1 = \frac{v_1}{1 - \beta_2} = g_1^2" />
            <p>
                This is a reliable estimate only if the first gradient is representative.
                In large Transformers, the first gradient can be orders of magnitude larger
                than typical gradients (due to random initialization). Using a large LR at t=1
                produces a huge update in a random direction.
                Warmup uses a tiny LR for the first steps while v<sub>t</sub> accumulates
                enough history to be a reliable gradient scale estimate.
            </p>

            <h3>Linear Warmup + Cosine Decay (Combined)</h3>
            <MathBlock tex="\eta_t = \begin{cases} \eta_{\max} \cdot t / T_{\text{warm}} & t \leq T_{\text{warm}} \\ \eta_{\min} + \frac{\eta_{\max}-\eta_{\min}}{2}\!\left(1 + \cos\!\left(\frac{\pi(t-T_{\text{warm}})}{T-T_{\text{warm}}}\right)\right) & t > T_{\text{warm}} \end{cases}" />

            <div className="ch-callout">
                <strong>Empirical finding:</strong> For large language models, warmup and cosine
                decay together are crucial. Chen et al. (2024) showed that the cosine minimum
                (η<sub>min</sub>/η<sub>max</sub> ratio) significantly impacts final model quality —
                too small and the model converges to a sharper minimum; too large and it doesn't
                converge fully. Typical ratio: 0.1 (η<sub>min</sub> = 10% of peak LR).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import torch.optim as optim
import torch.optim.lr_scheduler as sched

# ── Manual schedule implementations ───────────────────────────────────────────

def step_decay(step, lr0, gamma, drop_every):
    """Decay LR by gamma every drop_every steps."""
    return lr0 * (gamma ** (step // drop_every))

def cosine_annealing(step, lr_max, lr_min, T):
    """Cosine annealing from lr_max to lr_min over T steps."""
    return lr_min + 0.5 * (lr_max - lr_min) * (1 + np.cos(np.pi * step / T))

def warmup_cosine(step, lr_max, lr_min, T_warm, T_total):
    """Linear warmup then cosine decay."""
    if step <= T_warm:
        return lr_max * step / T_warm
    progress = (step - T_warm) / (T_total - T_warm)
    return lr_min + 0.5 * (lr_max - lr_min) * (1 + np.cos(np.pi * progress))

def transformer_schedule(step, d_model, warmup_steps):
    """Vaswani et al. (2017) schedule."""
    step = max(step, 1)
    return d_model**(-0.5) * min(step**(-0.5), step * warmup_steps**(-1.5))

# ── Compare schedules ─────────────────────────────────────────────────────────
T_total  = 1000
T_warm   = 100
lr_max   = 1e-3
lr_min   = 1e-4

print("=" * 70)
print("Learning Rate Schedule Comparison")
print("=" * 70)
print(f"{'Step':>6}  {'Step Decay':>12}  {'Cosine':>12}  {'Warmup+Cos':>12}  {'Transformer':>12}")
print("-" * 60)

for step in [0, 50, 100, 200, 400, 600, 800, 1000]:
    lr_step   = step_decay(step, lr_max, 0.5, 200)
    lr_cos    = cosine_annealing(step, lr_max, lr_min, T_total)
    lr_wc     = warmup_cosine(step, lr_max, lr_min, T_warm, T_total)
    lr_tr     = transformer_schedule(max(step, 1), 512, T_warm)
    print(f"{step:>6}  {lr_step:>12.6f}  {lr_cos:>12.6f}  {lr_wc:>12.6f}  {lr_tr:>12.6f}")

# ── PyTorch schedulers ─────────────────────────────────────────────────────────
print()
print("PyTorch built-in schedulers:")
print("-" * 40)

model = torch.nn.Linear(10, 1)
optimizer = optim.Adam(model.parameters(), lr=1e-3)

# CosineAnnealingLR
cos_sched = sched.CosineAnnealingLR(optimizer, T_max=1000, eta_min=1e-4)

# Linear warmup with LambdaLR
def lr_lambda(step):
    if step < T_warm:
        return step / T_warm
    progress = (step - T_warm) / (T_total - T_warm)
    return 0.1 + 0.9 * 0.5 * (1 + np.cos(np.pi * progress))

lambda_sched = sched.LambdaLR(optimizer, lr_lambda)

# Simulate a few steps
optimizer.param_groups[0]['lr'] = 1e-3
for step in [1, 50, 100, 500, 1000]:
    optimizer.param_groups[0]['lr'] = 1e-3
    lam_lr = 1e-3 * lr_lambda(step)
    print(f"  step={step:>5}: warmup+cosine LR = {lam_lr:.6f}")

# ── LR Range Test idea ─────────────────────────────────────────────────────────
print()
print("LR Range Test (find optimal LR):")
print("Train 1 epoch with LR increasing from 1e-7 to 10")
print("Find the LR where loss is decreasing fastest → use 10× below that as peak LR")
`

function PythonTab() {
    return (
        <>
            <p>
                Manual implementations of step decay, cosine annealing, warmup+cosine, and
                the original Transformer schedule. Tabular comparison across training steps,
                followed by PyTorch's built-in scheduler usage.
            </p>
            <CodeBlock code={PY_CODE} filename="lr_schedules.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LR_SCHEDULES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
