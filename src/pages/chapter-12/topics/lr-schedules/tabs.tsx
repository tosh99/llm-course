import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From constant step sizes to carefully tuned schedules</h2>
            <p>
                The learning rate is the single most important hyperparameter in deep learning. The same model with the same data can converge beautifully or diverge catastrophically depending entirely on how the learning rate changes over training. Learning rate scheduling — the art and science of varying η over time — evolved from simple rules of thumb to precisely designed schedules that are themselves hyperparameters of every major training run.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1951–1980s</div>
                    <div className="ch-tl-section-label">Classical Methods</div>
                    <div className="ch-tl-title">Constant LR, 1/t Decay, and Step Decay</div>
                    <div className="ch-tl-body">
                        Early neural network training used constant learning rates or simple polynomial decay schedules from numerical optimization theory. Stochastic approximation theory (Robbins-Monro, 1951) established that SGD converges if Ση = ∞ and Ση² &lt; ∞ — satisfied by 1/t decay: η<sub>t</sub> = η₀/t. This theoretical requirement was the first principled argument for learning rate decay.
                        <br /><br />
                        In practice, 1/t decay is too aggressive for neural networks — the learning rate drops too fast in early training, before the model has explored the loss landscape. The dominant practical approach was step decay: multiply the learning rate by γ (typically 0.1 or 0.5) every N epochs. Step decay creates sharp discontinuities in the training curve, but its simplicity made it the standard for ImageNet training through the 2010s (e.g., VGGNet and early ResNets used step decay at epochs 30, 60, 90).
                        <br /><br />
                        The fundamental challenge: high learning rates help explore the loss landscape broadly in early training, while low learning rates help converge precisely to a minimum later. A single constant learning rate cannot be optimal for both phases.
                    </div>
                    <div className="ch-tl-impact">Context: Step decay dominated practical training 1980s–2016; theoretical basis established by Robbins-Monro convergence conditions</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015–2016</div>
                    <div className="ch-tl-section-label">Cyclical Learning Rates</div>
                    <div className="ch-tl-title">Smith — Cyclical LR and the LR Range Test</div>
                    <div className="ch-tl-body">
                        Leslie Smith's 2015 paper "No More Pesky Learning Rate Guessing Games" and its 2017 expansion "Cyclical Learning Rates for Training Neural Networks" challenged the orthodoxy of monotonically decreasing learning rates. His cyclical LR policy triangularly oscillates the LR between a minimum and maximum over a fixed cycle. The key insight: periodically increasing the LR acts as a form of simulated annealing, helping escape sharp minima and saddle points rather than settling into the nearest sub-optimal minimum.
                        <br /><br />
                        Smith also introduced the LR range test: train for one epoch with LR increasing exponentially from 1e-7 to 10 while recording the loss. The optimal maximum LR is roughly 1 decade below where the loss starts to increase sharply. This simple diagnostic became one of the most practical tools in the deep learning practitioner's toolkit — providing a principled way to set the learning rate without extensive grid search.
                    </div>
                    <div className="ch-tl-impact">Impact: First principled argument for increasing LR during training; LR range test became a standard diagnostic; influenced fast.ai curriculum</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Warmup Formalized</div>
                    <div className="ch-tl-title">Vaswani et al. and Goyal et al. — Warmup Rationale</div>
                    <div className="ch-tl-body">
                        "Attention Is All You Need" (Vaswani et al., 2017) introduced the now-canonical warmup-then-decay schedule for Transformers: LR increases linearly for warmup_steps steps, then decreases proportionally to 1/√step. The warmup is critical: at the start of training, the model's parameters are random, gradients are unstable, and Adam's second-moment estimate v<sub>t</sub> is based on only a few gradient observations — making the adaptive scaling unreliable.
                        <br /><br />
                        Concurrently, Goyal et al. (2017) "Accurate, Large Minibatch SGD" provided a theoretical basis for warmup in large-batch training. Their "linear scaling rule" states that to maintain training dynamics when multiplying batch size by k, the learning rate must also be multiplied by k. But this requires gradual LR warmup to avoid instability at the start of training. Modern LLM training routinely uses warmup durations of 1–5% of total training steps.
                    </div>
                    <div className="ch-tl-impact">Impact: Warmup became mandatory for Transformer and LLM training; linear scaling rule enabled distributed large-batch training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2018</div>
                    <div className="ch-tl-section-label">Cosine Annealing</div>
                    <div className="ch-tl-title">Loshchilov and Hutter — SGDR and Cosine Annealing</div>
                    <div className="ch-tl-body">
                        Ilya Loshchilov and Frank Hutter published "SGDR: Stochastic Gradient Descent with Warm Restarts" (ICLR 2017), proposing cosine annealing with periodic restarts. The LR follows a cosine curve from η<sub>max</sub> to η<sub>min</sub>, then resets ("warm restarts") — cycling through the cosine shape repeatedly, optionally with increasing period.
                        <br /><br />
                        The cosine shape has a key property: it decays slowly at both extremes (near η<sub>max</sub> and η<sub>min</sub>) and fast in the middle. This means the model spends more time at high and low learning rates — corresponding to more time in exploration and fine convergence modes, and less in the intermediate "transition" phase. Cosine annealing became the default schedule for ImageNet training (replacing step decay) and is now the standard for LLM training — GPT-3, LLaMA, and Chinchilla all use warmup + cosine decay.
                    </div>
                    <div className="ch-tl-impact">Impact: Cosine schedule is the most common LR schedule in large model training; SGDR with restarts improved ResNet performance on CIFAR and ImageNet</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">One-Cycle Policy</div>
                    <div className="ch-tl-title">Smith and Tobin — Super-Convergence</div>
                    <div className="ch-tl-body">
                        Leslie Smith and Nicholay Tobin published "Super-Convergence: Very Fast Training of Neural Networks Using Large Learning Rates" (2018). The one-cycle policy: increase LR from a small value to η<sub>max</sub> over the first 30% of training, then decrease to near zero over the remaining 70%. Simultaneously cycle the momentum in reverse — high momentum when LR is low, low momentum when LR is high.
                        <br /><br />
                        "Super-convergence" refers to the surprising result that this schedule can achieve the same final accuracy in 5–10× fewer epochs than standard training — not by cutting corners, but by more efficiently traversing the loss landscape. The one-cycle policy became the default in fast.ai and is widely used for training ResNets and image classifiers where fast experimentation matters more than squeezing every last percentage point of accuracy.
                    </div>
                    <div className="ch-tl-impact">Impact: Super-convergence enables 5–10× faster training; one-cycle policy became standard in fast.ai; cyclical momentum (inverse to LR) introduced</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020–present</div>
                    <div className="ch-tl-section-label">LLM Era</div>
                    <div className="ch-tl-title">Modern LLM Training Schedules</div>
                    <div className="ch-tl-body">
                        Large language model training standardized on a specific combination: short linear warmup (1–2% of total steps) followed by cosine decay to 10% of the peak learning rate. GPT-3 used this for 300 billion tokens of training; LLaMA-1 used warmup over 2,000 steps (out of 1M total) with cosine to 10% of peak LR; Chinchilla's scaling law analysis included the LR schedule as a fixed variable to ensure comparability.
                        <br /><br />
                        The Chinchilla ratio η<sub>min</sub>/η<sub>max</sub> ≈ 0.1 has become a community standard: the cosine minimum is 10% of the peak learning rate. This prevents the model from converging to an excessively sharp minimum (too small η<sub>min</sub>) while ensuring full convergence (too large η<sub>min</sub>). The total training budget and schedule shape are now considered together as joint hyperparameters.
                    </div>
                    <div className="ch-tl-impact">Impact: Warmup + cosine decay is the universal LLM training schedule; LR schedule is now a fixed component of reproducible training configurations</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> With learning rate schedules providing reliable convergence, the field turned to a new frontier: language. Text posed a unique challenge — unlike image pixels, words have no natural numeric representation. Chapter 13 follows the quest to embed words as vectors, beginning with Mikolov's Word2Vec in 2013.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How fast to learn — and why the speed should change</h2>

            <Analogy label="The Learning Rate as Step Size">
                Imagine you're hiking down a mountain in the dark, using only a compass that points downhill. Your "learning rate" is how big a step you take each time the compass points somewhere.
                <br /><br />
                If you take huge steps: you might step off a cliff, overshoot valleys, or bounce between walls. If you take tiny steps: you'll get there eventually, but it'll take forever.
                <br /><br />
                The perfect strategy: start with medium steps to get into the right valley, then take smaller and smaller steps as you get closer to the bottom — that's learning rate decay.
            </Analogy>

            <Analogy label="Warmup: Don't Run Before You Can Walk">
                At the very start of training, the neural network's weights are random noise. The gradients are chaotic and unreliable. If you start with a large learning rate, you'll take huge steps in random directions and break everything.
                <br /><br />
                Warmup says: start very small, gradually increase to the target learning rate over the first few thousand steps. By then, the model has settled into a reasonable region of parameter space, gradients are informative, and it's safe to learn fast.
                <br /><br />
                It's like warming up your muscles before a sprint — starting slow prevents injury.
            </Analogy>

            <Analogy label="Cosine Annealing: A Smooth Gentle Slowdown">
                Step decay (halving every N epochs) creates sudden jumps in learning rate — the training loss suddenly drops after each halving, then plateaus until the next halving.
                <br /><br />
                Cosine annealing smoothly curves the learning rate down, following the shape of a cosine curve. This smooth slowdown is gentler and often finds better final solutions because it never suddenly changes how fast it's learning.
            </Analogy>

            <Analogy label="The LR Range Test: How to Find the Right Speed">
                How do you pick the right learning rate without guessing? Leslie Smith's answer: try all of them in one training run.
                <br /><br />
                Start with a tiny learning rate (1e-7). Every few steps, multiply it by a small amount, so it grows exponentially. Keep going until the learning rate is huge (10). Plot the loss at each step against the learning rate.
                <br /><br />
                The plot will show: loss decreasing (learning rate is helping), then loss increasing (learning rate is too large). The optimal maximum learning rate is about 10× below where the loss starts to increase. This takes one epoch to run — much faster than a full grid search.
            </Analogy>

            <Analogy label="What comes next — Words need addresses too">
                Just as a good optimizer finds the right path through number-space, Chapter 13 shows how researchers gave each word its own address in number-space — so neural networks could understand language and meaning. Word2Vec, GloVe, FastText: each a different way to map words to useful vectors.
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
                Example: η₀=0.1, γ=0.1, N=30 epochs → LR drops to 0.01 at epoch 30, 0.001 at epoch 60. Simple but creates discontinuities in the training curve.
            </p>

            <h3>Cosine Annealing (Loshchilov and Hutter, 2017)</h3>
            <p>
                Smoothly decay from η<sub>max</sub> to η<sub>min</sub> over T steps:
            </p>
            <MathBlock tex="\eta_t = \eta_{\min} + \frac{1}{2}(\eta_{\max} - \eta_{\min})\left(1 + \cos\!\left(\frac{\pi t}{T}\right)\right)" />
            <p>
                At t=0: η = η<sub>max</sub>. At t=T: η = η<sub>min</sub>. Smooth, monotone decay. With warm restarts (SGDR): repeat the cosine cycle periodically, doubling the period each time.
            </p>

            <h3>Warmup + Decay (Transformer Schedule)</h3>
            <p>
                Linear warmup for warmup_steps, then inverse-square-root decay:
            </p>
            <MathBlock tex="\eta_t = d_{\text{model}}^{-0.5} \cdot \min\!\left(t^{-0.5},\; t \cdot \text{warmup\_steps}^{-1.5}\right)" />
            <p>
                LR increases linearly for the first warmup_steps steps, then decreases as 1/√t. Peak LR occurs at t = warmup_steps. Used in the original Transformer and many LLMs.
            </p>

            <h3>Linear Warmup + Cosine Decay (LLM Standard)</h3>
            <MathBlock tex="\eta_t = \begin{cases} \eta_{\max} \cdot t / T_{\text{warm}} & t \leq T_{\text{warm}} \\ \eta_{\min} + \frac{\eta_{\max}-\eta_{\min}}{2}\!\left(1 + \cos\!\left(\frac{\pi(t-T_{\text{warm}})}{T-T_{\text{warm}}}\right)\right) & t > T_{\text{warm}} \end{cases}" />

            <h3>One-Cycle Policy</h3>
            <ul>
                <li>Phase 1 (0→30%): LR increases from η<sub>min</sub> to η<sub>max</sub> (cosine up)</li>
                <li>Phase 2 (30%→100%): LR decreases from η<sub>max</sub> to ~0 (cosine down)</li>
                <li>Momentum cycles in reverse: high at start, low in the middle, high at end</li>
            </ul>

            <hr className="ch-sep" />

            <h3>LR Range Test (Smith, 2015)</h3>
            <p>
                A practical diagnostic: train for one epoch with LR increasing exponentially from 1e-7 to 10. Plot loss vs LR. The optimal LR is roughly 1 decade below where loss starts to increase sharply.
            </p>

            <div className="ch-callout">
                <strong>Rule of thumb for modern training:</strong> Use cosine annealing with linear warmup for Transformer-based models. The warmup duration is typically 1–5% of total training steps. The cosine minimum is typically 10% of the peak LR. This combination — warmup + cosine — is used by GPT-3, LLaMA, and most modern LLMs.
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
            <h2>Convergence theory, warmup necessity, and cosine properties</h2>

            <DefBlock label="Convergence Conditions (Robbins-Monro, 1951)">
                For SGD to converge to the minimum of a convex function, the learning rate sequence η<sub>t</sub> must satisfy:
                <br /><br />
                Σ<sub>t=1</sub><sup>∞</sup> η<sub>t</sub> = ∞ &emsp; (LR must not decay too fast — enough total progress)
                <br />
                Σ<sub>t=1</sub><sup>∞</sup> η<sub>t</sub>² &lt; ∞ &emsp; (LR must decay — variance must go to zero)
            </DefBlock>
            <p>
                Schedule η<sub>t</sub> = η₀/t satisfies both. But 1/t decay is too aggressive for neural networks — the LR drops too fast in early training.
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
                Recall Adam's second moment: v<sub>t</sub> = β₂v<sub>t-1</sub> + (1−β₂)g<sub>t</sub>². At t=1: v<sub>1</sub> = (1−β₂)g<sub>1</sub>². The bias-corrected estimate:
            </p>
            <MathBlock tex="\hat{v}_1 = \frac{v_1}{1 - \beta_2} = g_1^2" />
            <p>
                This is a reliable estimate only if the first gradient is representative. In large Transformers, the first gradient can be orders of magnitude larger than typical gradients (due to random initialization). Using a large LR at t=1 produces a huge update in a random direction. Warmup uses a tiny LR for the first steps while v<sub>t</sub> accumulates enough history to be a reliable gradient scale estimate.
            </p>

            <h3>Linear Warmup + Cosine Decay (Combined)</h3>
            <MathBlock tex="\eta_t = \begin{cases} \eta_{\max} \cdot t / T_{\text{warm}} & t \leq T_{\text{warm}} \\ \eta_{\min} + \frac{\eta_{\max}-\eta_{\min}}{2}\!\left(1 + \cos\!\left(\frac{\pi(t-T_{\text{warm}})}{T-T_{\text{warm}}}\right)\right) & t > T_{\text{warm}} \end{cases}" />

            <div className="ch-callout">
                <strong>Empirical finding:</strong> For large language models, warmup and cosine decay together are crucial. The cosine minimum ratio η<sub>min</sub>/η<sub>max</sub> ≈ 0.1 significantly impacts final model quality — too small and the model converges to a sharper minimum; too large and it doesn't converge fully. This 10% ratio is now a community standard for LLM training.
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
for step in [1, 50, 100, 500, 1000]:
    lam_lr = 1e-3 * lr_lambda(step)
    print(f"  step={step:>5}: warmup+cosine LR = {lam_lr:.6f}")

# ── LR Range Test simulation ───────────────────────────────────────────────────
print()
print("LR Range Test simulation:")
print("Train 1 epoch with LR increasing from 1e-7 to 10")
print("Log the loss at each step; find LR just before loss starts rising")
print()
lrs = np.logspace(-7, 1, 50)
# Simulate: loss decreases until lr~0.01, then increases
simulated_loss = [1.0 / (1 + np.exp(-(np.log10(lr) + 2) * 2)) + 0.1 * np.random.randn()
                  for lr in lrs]
best_idx = np.argmin(simulated_loss)
optimal_lr = lrs[max(0, best_idx - 5)]  # 1 decade below minimum
print(f"Simulated optimal max LR: {optimal_lr:.2e}")
print(f"Recommended starting LR:  {optimal_lr/10:.2e} (1 decade below)")
`

function PythonContent() {
    return (
        <>
            <p>
                Manual implementations of step decay, cosine annealing, warmup+cosine, and the original Transformer schedule. Tabular comparison across training steps, followed by PyTorch's built-in scheduler usage and an LR range test simulation.
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
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
