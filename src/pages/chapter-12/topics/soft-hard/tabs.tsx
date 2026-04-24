import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Two ways to attend: blend or commit</h2>
            <p>
                Bahdanau and Luong attention both produce a <em>soft</em> context vector —
                a weighted average of all encoder positions, differentiable end-to-end.
                But there's a philosophically different interpretation: what if attention
                should <em>select</em> a single position rather than blend many? This question
                was posed formally in 2015, in the context of image captioning.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 Feb</div>
                    <div className="ch-tl-section-label">Image Captioning</div>
                    <div className="ch-tl-title">Xu et al. — Show, Attend and Tell</div>
                    <div className="ch-tl-body">
                        Kelvin Xu, Jimmy Ba, Ryan Kiros, Kyunghyun Cho, Aaron Courville, Ruslan
                        Salakhutdinov, Richard Zemel, and Yoshua Bengio published "Show, Attend and
                        Tell: Neural Image Caption Generation with Visual Attention" (ICML 2015).
                        They applied attention to image captioning: the encoder was a CNN producing
                        a grid of feature vectors (one per image region), and the decoder generated
                        captions word by word while attending to different image regions. The paper
                        introduced and compared <em>soft</em> (deterministic) and <em>hard</em>
                        (stochastic) attention formally.
                    </div>
                    <div className="ch-tl-impact">Impact: First formal comparison of soft vs hard attention; soft attention became the standard</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Soft Attention</div>
                    <div className="ch-tl-title">Deterministic, Differentiable, End-to-End</div>
                    <div className="ch-tl-body">
                        Soft attention computes a weighted mixture of all feature vectors: context
                        = Σ α<sub>i</sub> f<sub>i</sub>. Because α is produced by softmax
                        (differentiable), the entire computation graph is differentiable and
                        can be trained with standard backpropagation. The context is a "soft"
                        blend rather than a hard selection. In practice, soft attention usually
                        converges faster and is easier to tune, at the cost of slightly less
                        interpretable alignments (you see weights, not selections).
                    </div>
                    <div className="ch-tl-impact">Impact: Used in virtually all modern attention systems including the Transformer</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Hard Attention</div>
                    <div className="ch-tl-title">Stochastic, Non-Differentiable, REINFORCE</div>
                    <div className="ch-tl-body">
                        Hard attention samples a single location z<sub>t</sub> ~ Categorical(α<sub>t</sub>)
                        and uses only f<sub>zt</sub> as the context. This is not differentiable —
                        the sampling operation has no useful gradient. Xu et al. trained it with the
                        REINFORCE algorithm (Williams, 1992): treat the caption log-likelihood as a
                        reward, use the policy gradient theorem to estimate gradients of the discrete
                        sampling decision. Hard attention produced sharper, more interpretable
                        attention maps but was harder to train and more sensitive to reward variance.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved hard attention was possible; motivated Gumbel-Softmax and ST estimators</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Bridge</div>
                    <div className="ch-tl-title">Gumbel-Softmax — Differentiable Discrete Relaxation</div>
                    <div className="ch-tl-body">
                        Jang et al. and Maddison et al. (independently, 2017) introduced the
                        Gumbel-Softmax trick: add Gumbel noise to the logits before softmax
                        and control a temperature τ. At τ→0, this approximates a one-hot
                        categorical sample; at τ→∞ it approximates a uniform distribution.
                        With the Straight-Through Estimator, gradients can flow through
                        approximately-discrete selections. This bridged soft and hard attention
                        and enabled differentiable discrete latent variables.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled discrete bottlenecks (VQ-VAE, discrete VAEs) and improved training of hard attention</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why soft attention won in practice:</strong> Soft attention is
                differentiable, stable, and yields competitive or better performance on most tasks.
                Hard attention's interpretability benefit (a single attended location per step)
                is outweighed by the variance and instability of REINFORCE for most applications.
                The Transformer uses soft (scaled dot-product) attention exclusively. Hard attention
                survives in memory-efficient architectures and discrete representation learning.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Blend everything vs pick one thing</h2>

            <Analogy label="Soft Attention — The Average Student">
                Imagine you have 5 textbooks and you need to answer a question. Soft attention
                says: look at all 5 books, figure out how relevant each one is (0%–100%), and
                combine the information from all of them in proportion. Book 1 is 60% relevant,
                Book 3 is 30% relevant, the others are 10% combined. Your answer is a blend.
                <br /><br />
                The nice thing: you can always improve your relevance scores by a little, and
                your answer improves smoothly. Gradients can flow.
            </Analogy>

            <Analogy label="Hard Attention — The Decisive Student">
                Hard attention says: no blending allowed. You <em>pick</em> one book and
                read only that. The probability of picking each book is proportional to
                how relevant it seems, but you actually flip a biased coin and commit to
                one choice. Your context is sharper and more interpretable — but training
                is tricky, because "pick book 3 instead of book 1" is not a smooth change
                you can nudge with gradients. You have to use reinforcement learning tricks.
            </Analogy>

            <Analogy label="Gumbel-Softmax — A Middle Ground">
                What if you added a little randomness to softmax, and dialed down the
                temperature? At very low temperature, softmax becomes almost one-hot —
                it practically picks one book, but still through a smooth operation that
                has gradients. This is the Gumbel-Softmax trick: approximate hard
                attention with differentiable noise.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Soft attention, hard attention, and the Gumbel-Softmax bridge</h2>

            <h3>Soft Attention</h3>
            <p>
                Given feature vectors f<sub>1</sub>,…,f<sub>L</sub> and attention weights
                α<sub>1</sub>,…,α<sub>L</sub> from softmax:
            </p>
            <MathBlock tex="\hat{\mathbf{z}} = \sum_{i=1}^{L} \alpha_i\, \mathbf{f}_i \qquad \alpha_i = \text{softmax}(e_i)" />
            <p>
                The context ẑ is a differentiable function of all parameters. Gradients
                flow through ẑ to the scoring network and to the features f<sub>i</sub>.
                Training: standard backpropagation + Adam.
            </p>

            <h3>Hard Attention</h3>
            <p>
                Instead of weighting all features, sample a location: z<sub>t</sub> ~ Categorical(α).
                The context is just the selected feature:
            </p>
            <MathBlock tex="\hat{\mathbf{z}} = \mathbf{f}_{z_t} \qquad z_t \sim \text{Categorical}(\boldsymbol{\alpha})" />
            <p>
                This is not differentiable. Training uses REINFORCE: treat the log-likelihood
                of the generated sequence as a reward R and estimate the policy gradient:
            </p>
            <MathBlock tex="\nabla_\theta \mathbb{E}[R] \approx \mathbb{E}\!\left[R \cdot \nabla_\theta \log p_\theta(z_t)\right]" />
            <p>
                High variance — often needs a baseline b to subtract from R: (R−b) ∇ log p.
            </p>

            <h3>Gumbel-Softmax</h3>
            <p>
                Sample Gumbel noise g<sub>i</sub> ~ Gumbel(0,1), add to logits, and apply
                softmax with temperature τ:
            </p>
            <MathBlock tex="y_i = \frac{\exp\!\left((e_i + g_i)/\tau\right)}{\sum_j \exp\!\left((e_j + g_j)/\tau\right)}" />
            <p>
                As τ → 0 this approaches one-hot; as τ → ∞ it approaches uniform.
                Gradients flow through y via the reparameterization trick.
                The Straight-Through Estimator uses the one-hot forward pass but the
                Gumbel-Softmax backward pass for gradients.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>REINFORCE derivation and the Gumbel-Softmax reparameterization</h2>

            <DefBlock label="Soft Attention — Objective and Gradient">
                Objective: L = log p(y|x) = Σ<sub>t</sub> log p(y<sub>t</sub> | y<sub>&lt;t</sub>, ẑ<sub>t</sub>)
                where ẑ<sub>t</sub> = H<sup>T</sup>α<sub>t</sub> is the soft context vector.
                Gradient ∂L/∂θ flows through ẑ<sub>t</sub> via chain rule. No special
                treatment needed — standard autodiff handles everything.
            </DefBlock>

            <h3>Hard Attention — Marginal Likelihood</h3>
            <p>
                Define the joint model over sequences and locations:
            </p>
            <MathBlock tex="p(y \mid x) = \sum_{\mathbf{z}} p(y \mid \mathbf{z}, x)\, p(\mathbf{z} \mid x)" />
            <p>
                This sum is intractable (exponentially many location sequences z). Use
                Monte Carlo with T samples:
            </p>
            <MathBlock tex="\log p(y \mid x) \approx \log \frac{1}{T} \sum_{s=1}^{T} p(y \mid \mathbf{z}^{(s)}, x)" />

            <h3>REINFORCE Gradient Estimator</h3>
            <p>
                For a single discrete variable z<sub>t</sub>:
            </p>
            <MathBlock tex="\nabla_\theta \mathbb{E}_{z_t \sim p_\theta}\!\left[f(z_t)\right] = \mathbb{E}_{z_t}\!\left[f(z_t) \nabla_\theta \log p_\theta(z_t)\right]" />
            <p>
                Estimator with baseline b (e.g., exponential moving average of f):
            </p>
            <MathBlock tex="\hat{g} = \frac{1}{S}\sum_{s=1}^{S}\!\left(f(z_t^{(s)}) - b\right)\nabla_\theta \log p_\theta(z_t^{(s)})" />
            <p>
                b is a control variate: E[b ∇ log p] = 0, so subtracting b does not bias
                the estimator but can dramatically reduce its variance.
            </p>

            <h3>Gumbel-Softmax — Reparameterization</h3>
            <p>
                The key property: if z* = argmax<sub>i</sub>(e<sub>i</sub> + g<sub>i</sub>)
                where g<sub>i</sub> ~ Gumbel(0,1), then z* ~ Categorical(softmax(e)).
                This reparameterizes the categorical as a deterministic function of a
                continuous noise variable — enabling gradients via the chain rule.
            </p>
            <MathBlock tex="g_i = -\log(-\log u_i), \quad u_i \sim \text{Uniform}(0,1)" />
            <MathBlock tex="y_i^\tau = \frac{\exp\!\left((e_i + g_i)/\tau\right)}{\sum_j \exp\!\left((e_j + g_j)/\tau\right)} \xrightarrow{\tau\to 0} \text{one-hot}(\arg\max_i\!(e_i + g_i))" />

            <div className="ch-callout">
                <strong>Practical guidance:</strong> Use soft attention for most tasks —
                it's differentiable, stable, and nearly always matches or outperforms hard
                attention in BLEU/accuracy metrics. Use hard attention (or Gumbel-Softmax)
                when you need discrete latent variables (VQ-VAE), interpretable selections,
                or computation savings by truly skipping positions. The Transformer uses
                soft attention; modern sparse attention methods (e.g., Longformer, BigBird)
                approximate hard selection while keeping differentiability.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Soft Attention ────────────────────────────────────────────────────────────
def softmax(e):
    e = e - e.max()
    ex = np.exp(e)
    return ex / ex.sum()

def soft_attention(query, features, score_fn):
    """Differentiable weighted average over features."""
    energies = np.array([score_fn(query, f) for f in features])
    alphas   = softmax(energies)
    context  = alphas @ features
    return context, alphas


# ── Hard Attention ────────────────────────────────────────────────────────────
def hard_attention(query, features, score_fn, rng=None):
    """Sample one feature according to attention distribution."""
    if rng is None:
        rng = np.random.default_rng()
    energies = np.array([score_fn(query, f) for f in features])
    probs    = softmax(energies)
    selected = rng.choice(len(features), p=probs)
    return features[selected], selected, probs


# ── Gumbel-Softmax ────────────────────────────────────────────────────────────
def gumbel_sample(shape, rng):
    """Sample from Gumbel(0, 1)."""
    u = rng.uniform(1e-10, 1.0, shape)
    return -np.log(-np.log(u))

def gumbel_softmax(logits, tau, rng):
    """Differentiable approximation to categorical sample."""
    g = gumbel_sample(logits.shape, rng)
    return softmax((logits + g) / tau)


# ── Comparison demo ───────────────────────────────────────────────────────────
rng  = np.random.default_rng(42)
dim  = 6
L    = 7   # number of feature vectors (e.g. image regions)

features = rng.normal(0, 1, (L, dim))
query    = rng.normal(0, 1, dim)
score_fn = lambda q, f: np.dot(q, f)   # dot-product scoring

print("Soft vs Hard Attention Comparison")
print("=" * 50)

# Soft
ctx_soft, alpha_soft = soft_attention(query, features, score_fn)
print("Soft attention weights (continuous):")
for i, a in enumerate(alpha_soft):
    bar = "█" * int(a * 35)
    print(f"  f_{i}: {a:.4f}  {bar}")
print(f"  Entropy: {-(alpha_soft * np.log(alpha_soft + 1e-10)).sum():.4f}")
print()

# Hard — run 5 times to show stochasticity
print("Hard attention selections (stochastic, 5 trials):")
for trial in range(5):
    _, sel, probs = hard_attention(query, features, score_fn, rng=rng)
    print(f"  trial {trial}: selected f_{sel}  (p={probs[sel]:.4f})")
print()

# Gumbel-Softmax at different temperatures
print("Gumbel-Softmax at different temperatures:")
logits = np.array([score_fn(query, f) for f in features])
for tau in [5.0, 1.0, 0.1, 0.01]:
    y = gumbel_softmax(logits, tau, rng)
    peak = y.argmax()
    entropy = -(y * np.log(y + 1e-10)).sum()
    print(f"  tau={tau:4.2f}  peak=f_{peak}  max_weight={y.max():.4f}  entropy={entropy:.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementations of all three variants: soft (weighted average), hard
                (categorical sample with REINFORCE-style selection), and Gumbel-Softmax at
                varying temperatures. The entropy comparison shows how temperature controls
                the sharpness of the attention distribution.
            </p>
            <CodeBlock code={PY_CODE} filename="soft_hard_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SOFT_HARD_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
