import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Two ways to attend: blend or commit</h2>
            <p>
                Bahdanau and Luong attention both produce a <em>soft</em> context vector — a weighted average of all encoder positions, differentiable end-to-end. But there's a philosophically different interpretation: what if attention should <em>select</em> a single position rather than blend many? This question was posed formally in 2015, in the context of image captioning, and the answer shaped the subsequent development of discrete latent variable models.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 Feb</div>
                    <div className="ch-tl-section-label">Image captioning</div>
                    <div className="ch-tl-title">Xu et al. — "Show, Attend and Tell"</div>
                    <div className="ch-tl-body">
                        <p>
                            Kelvin Xu, Jimmy Ba, Ryan Kiros, Kyunghyun Cho, Aaron Courville, Ruslan Salakhutdinov, Richard Zemel, and Yoshua Bengio published "Show, Attend and Tell: Neural Image Caption Generation with Visual Attention" at ICML 2015. The setup: encode an image with a VGG convolutional network to produce a 14×14 grid of feature vectors (one per image region), then decode a caption word by word while attending to different image regions.
                        </p>
                        <p>
                            The paper was the first to formally define and compare <em>soft</em> (deterministic) and <em>hard</em> (stochastic) attention in the same framework. Soft attention computes the context as a weighted sum of all feature vectors — differentiable, trainable by standard backpropagation. Hard attention samples a single feature vector according to the attention distribution — discrete, not differentiable, requiring reinforcement learning to train.
                        </p>
                        <p>
                            Results on the MS COCO image captioning benchmark showed that both variants improved over a no-attention baseline. Soft attention was easier to train and converged more reliably. Hard attention produced slightly sharper visualizations (each word was associated with exactly one image region) and achieved marginally better BLEU scores on some metrics when the reinforcement learning training succeeded. The paper reported BLEU-4 scores and showed qualitative attention maps that demonstrated the model was indeed looking at the correct image regions for each generated word.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: First formal comparison of soft vs hard attention; demonstrated visual attention for image captioning; the paper's visualizations made attention mechanisms intuitive to the broader community</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Soft attention mechanics</div>
                    <div className="ch-tl-title">Deterministic, Differentiable, Dominant</div>
                    <div className="ch-tl-body">
                        <p>
                            Soft attention (the Bahdanau-style weighted sum) became the dominant form precisely because of its key property: the entire computation from input features through attention weights to context vector is differentiable. Every parameter — the scoring network weights, the encoder weights, the decoder weights — can be updated by gradient descent through the attention mechanism. No special training algorithms, no variance reduction tricks, no sampling.
                        </p>
                        <p>
                            The differentiability comes from the softmax: attention weights are produced by softmax over alignment scores, and softmax is differentiable everywhere. The weighted sum is a linear operation, also differentiable. The scoring function (additive, dot-product, or bilinear) is differentiable. Backpropagation flows through the entire computation graph without any modifications to the standard algorithm.
                        </p>
                        <p>
                            In practice, soft attention converges faster, requires less hyperparameter tuning, and achieves competitive or better performance than hard attention in nearly all benchmarks. The Transformer uses exclusively soft attention — all modern LLMs (GPT-4, Claude, Gemini) use soft scaled-dot-product attention. The clean mathematical formulation of soft attention (softmax + weighted sum) made it the natural foundation for the self-attention generalization that powers the Transformer.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Soft attention became universal; its differentiability is the key property that enables end-to-end training of all modern sequence models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Hard attention mechanics</div>
                    <div className="ch-tl-title">Stochastic Selection and REINFORCE</div>
                    <div className="ch-tl-body">
                        <p>
                            Hard attention samples a single location z<sub>t</sub> ~ Categorical(α<sub>t</sub>) and uses only the feature at that location as the context. This discrete sampling operation has no useful gradient — the loss function's gradient with respect to the sampling decision is undefined in the standard sense. To train hard attention, Xu et al. used the REINFORCE policy gradient algorithm (Williams, 1992): treat the caption log-likelihood as a reward signal, and estimate the gradient of the expected reward with respect to the attention policy parameters.
                        </p>
                        <p>
                            The REINFORCE estimator is unbiased but has high variance — the gradient estimate for any single sample is noisy, and the model needs many samples to get a reliable gradient signal. Xu et al. used variance reduction via a moving-average baseline: subtract a running estimate of the mean reward from each sample's reward before computing the gradient. This reduces variance while maintaining unbiasedness, but training hard attention still required careful tuning and was generally slower and less stable than soft attention.
                        </p>
                        <p>
                            Despite the training difficulty, hard attention has appealing properties: it produces crisp, interpretable alignment (each decoding step uses exactly one feature vector), it can be more computationally efficient (no need to compute all feature vectors' contributions), and in some theoretical frameworks it provides better guarantees about what information can be transmitted. But these advantages rarely outweighed the training stability benefits of soft attention in practice.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Established REINFORCE as the training algorithm for non-differentiable attention; motivated research into better gradient estimators for discrete variables</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Differentiable discrete relaxation</div>
                    <div className="ch-tl-title">Gumbel-Softmax — Jang et al. and Maddison et al.</div>
                    <div className="ch-tl-body">
                        <p>
                            Eric Jang, Shixiang Gu, and Ben Poole (Google Brain), and Chris Maddison, Andriy Mnih, and Yee Whye Teh (DeepMind), independently introduced the Gumbel-Softmax (also called Concrete distribution) in early 2017 — a differentiable relaxation of the categorical distribution. The key insight: drawing a sample from a categorical distribution is equivalent to adding Gumbel noise to the logits and taking the argmax. If you replace the argmax with a softmax, the operation becomes differentiable.
                        </p>
                        <p>
                            The temperature parameter τ controls the sharpness: at τ → 0, Gumbel-Softmax approaches a one-hot categorical sample (hard, but not differentiable). At τ → ∞, it approaches a uniform distribution (soft, very differentiable). At intermediate τ (0.5–1.0), it provides a soft approximation to the categorical that is both differentiable and relatively sharp. The Straight-Through Estimator variant uses the one-hot sample in the forward pass but the Gumbel-Softmax gradient in the backward pass — approximating discrete selection with biased but lower-variance gradients.
                        </p>
                        <p>
                            Gumbel-Softmax enabled a range of architectures that needed discrete latent variables: VQ-VAE (van den Oord et al., 2017) used a related vector quantization scheme to learn discrete codebooks; discrete VAEs for images and text (Ramesh et al., 2021, DALL-E) used Gumbel-Softmax for their discrete image tokens; discrete tokens in modern multimodal models use similar ideas. The Gumbel-Softmax bridged the gap between soft attention's differentiability and hard attention's interpretability.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled differentiable discrete latent variables; critical for VQ-VAE, DALL-E image tokens, and modern multimodal discrete representations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present</div>
                    <div className="ch-tl-section-label">Modern sparse attention</div>
                    <div className="ch-tl-title">Hard Selection Without Reinforcement — Sparse Attention</div>
                    <div className="ch-tl-body">
                        <p>
                            Modern efficient attention for long sequences takes a different approach to "hard selection": instead of sampling one position, it zeroes out attention weights below a threshold or restricts each position to attend to a fixed set of neighbors. This is not hard attention in the REINFORCE sense — the selection is deterministic and differentiable (top-k operations have subgradients) — but it achieves similar computational benefits.
                        </p>
                        <p>
                            Sparse Transformers (Child et al., 2019) apply attention only to a structured subset of positions (local window + periodic stride). Longformer and BigBird use local window attention with global tokens. Reformer (Kitaev et al., 2020) uses locality-sensitive hashing to group similar queries and keys, attending only within buckets. Each approach trades the full expressiveness of soft attention for computational efficiency, using structured sparsity rather than stochastic hard selection.
                        </p>
                        <p>
                            Hard attention's legacy is visible in the motivation for all these approaches: the intuition that "not every position needs to attend to every other position" is exactly what hard attention proposed in 2015. The difference is that modern sparse attention achieves this sparsity via structured deterministic patterns or learned gating rather than REINFORCE, avoiding the training instability that plagued hard attention. Xu et al.'s question — "should attention select or blend?" — was ultimately answered as "selectively blend, deterministically."
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Hard attention's selective principle survived in modern sparse attention for long sequences; deterministic sparse patterns replaced stochastic sampling</div>
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

            <div className="ch-callout">
                <strong>What comes next:</strong> Attention transformed Seq2Seq from a compression problem into a dynamic lookup — the decoder consults the encoder at every step. But researchers kept pushing the RNN paradigm further: could networks learn to copy elements directly from the input (pointer networks)? Could RNNs generate raw audio waveforms sample-by-sample (WaveNet)? Chapter 16 captures these advanced recurrent capabilities, pushed to their limits in 2015–2017, just before the Transformer made recurrence obsolete.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Blend everything vs pick one thing</h2>

            <Analogy label="Soft Attention — The Weighted Average">
                Imagine you have 5 textbooks and you need to answer a question. Soft attention
                says: look at all 5 books, figure out how relevant each one is (0%–100%), and
                combine the information from all of them in proportion. Book 1 is 60% relevant,
                Book 3 is 30% relevant, the others are 10% combined. Your answer is a blend.
                <br /><br />
                The nice thing: you can always improve your relevance scores by a little, and
                your answer improves smoothly. Gradients flow through softmax (the relevance
                calculator) and through the weighted sum, all the way back to the encoder.
                Standard backpropagation handles everything.
            </Analogy>

            <Analogy label="Hard Attention — The Decisive Pick">
                Hard attention says: no blending allowed. You <em>pick</em> one book and
                read only that. The probability of picking each book is proportional to
                how relevant it seems, but you actually flip a biased coin and commit to
                one choice. Your context is sharper and more interpretable — but training
                is tricky, because "pick book 3 instead of book 1" is not a smooth change
                you can nudge with gradients. You have to use reinforcement learning tricks.
                <br /><br />
                REINFORCE says: when a good translation comes out, give more credit to
                the attention decisions that led to it. When a bad translation comes out,
                discourage those decisions. It works, but it's slow and noisy — the feedback
                signal is the whole translation quality, not a per-step error.
            </Analogy>

            <Analogy label="Gumbel-Softmax — A Middle Ground">
                What if you added a little randomness to softmax, and dialed down the
                temperature? At very low temperature, softmax becomes almost one-hot —
                it practically picks one book, but still through a smooth operation that
                has gradients. This is the Gumbel-Softmax trick.
                <br /><br />
                Add Gumbel noise (a specific random distribution) to the relevance scores,
                then apply softmax with a temperature. At temperature = 0.1, the result is
                almost one-hot. At temperature = 5, the result is nearly uniform. You train
                with temperature = 0.5–1.0, getting approximate gradients through the
                approximately-discrete selection. As training progresses, you can lower the
                temperature to make the selection sharper.
            </Analogy>

            <Analogy label="The Interpretability Trade-Off">
                Hard attention is more interpretable: you can point to exactly which image
                region the model looked at when it generated the word "dog." Soft attention
                produces a blurry heat map where all regions contributed something. For a
                human trying to understand the model, hard attention is cleaner.
                <br /><br />
                But interpretability doesn't always win in practice. Soft attention trains faster,
                converges more reliably, and gets higher scores on benchmarks. So the field
                chose performance over interpretability — soft attention became universal,
                and interpretability researchers learned to work with the heat maps.
            </Analogy>

            <Analogy label="Modern Sparse Attention — Selective but Deterministic">
                The debate between soft and hard attention led to a third path: sparse attention.
                Instead of blending everything (soft) or sampling one thing (hard), modern
                systems use structured rules to decide what to attend to — each token attends
                to its local neighbors plus a few global tokens, deterministically.
                <br /><br />
                This is not truly "hard" (it doesn't use sampling or REINFORCE), but it's also
                not full soft attention (it zeros out many positions). It captures the computational
                benefits of hard attention (fewer scores to compute) without the training
                instability. Systems like Longformer, BigBird, and FlashAttention use this approach
                to handle documents with millions of tokens efficiently.
            </Analogy>

            <Analogy label="What comes next — RNNs at their limit">
                Attention made Seq2Seq much more powerful by letting the decoder consult any part of the input. But researchers kept asking: what else can recurrent networks do? Chapter 16 shows pointer networks that copy words directly from input, WaveNet that generates audio one tiny sample at a time — the last great innovations of the recurrent era, just before Transformers replaced everything.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Soft attention, hard attention, and the Gumbel-Softmax bridge</h2>

            <h3>Soft Attention — Differentiable Weighted Sum</h3>
            <p>
                Given feature vectors f<sub>1</sub>,…,f<sub>L</sub> and alignment scores e<sub>1</sub>,…,e<sub>L</sub>:
            </p>
            <MathBlock tex="\hat{\mathbf{z}} = \sum_{i=1}^{L} \alpha_i\, \mathbf{f}_i \qquad \alpha_i = \frac{\exp(e_i)}{\sum_j \exp(e_j)}" />
            <p>
                The context ẑ is a differentiable function of all parameters. Gradients
                flow through ẑ to the scoring network and to the features f<sub>i</sub>.
                Training: standard backpropagation + Adam. No special algorithms required.
            </p>

            <h3>Hard Attention — Stochastic Selection</h3>
            <p>
                Instead of weighting all features, sample a location: z<sub>t</sub> ~ Categorical(α).
                The context is just the selected feature:
            </p>
            <MathBlock tex="\hat{\mathbf{z}} = \mathbf{f}_{z_t} \qquad z_t \sim \text{Categorical}(\boldsymbol{\alpha})" />
            <p>
                This is not differentiable. Training uses REINFORCE: treat the log-likelihood
                of the generated sequence as a reward R and estimate the policy gradient:
            </p>
            <MathBlock tex="\nabla_\theta \mathbb{E}[R] \approx \mathbb{E}\!\left[(R - b) \cdot \nabla_\theta \log p_\theta(z_t)\right]" />
            <p>
                where b is a baseline (e.g., exponential moving average of R) to reduce variance.
            </p>

            <h3>Gumbel-Softmax — Reparameterized Discrete Relaxation</h3>
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

            <h3>Xu et al. Image Captioning Results</h3>
            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>BLEU-1</th>
                        <th>BLEU-4</th>
                        <th>METEOR</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>No attention baseline</td>
                        <td>70.7</td>
                        <td>25.0</td>
                        <td>23.0</td>
                    </tr>
                    <tr>
                        <td>Soft attention</td>
                        <td>70.7</td>
                        <td>24.3</td>
                        <td>23.9</td>
                    </tr>
                    <tr>
                        <td>Hard attention (REINFORCE)</td>
                        <td>71.8</td>
                        <td>25.0</td>
                        <td>23.0</td>
                    </tr>
                </tbody>
            </table>
            <p>
                Results were competitive between soft and hard attention, with soft attention generally
                easier to train reliably and hard attention producing sharper alignment visualizations.
            </p>

            <h3>When to Use Hard Attention</h3>
            <ul>
                <li><strong>Discrete latent variables:</strong> VQ-VAE, DALL-E image tokens, discrete speech units — where you need a codebook selection</li>
                <li><strong>Computation savings:</strong> when you truly want to process only one feature, not a weighted combination of all</li>
                <li><strong>Interpretability requirements:</strong> when the application requires a crisp explanation of which input element was used</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Practical guidance:</strong> Use soft attention for most tasks —
                it's differentiable, stable, and nearly always matches or outperforms hard
                attention in accuracy metrics. Use hard attention (or Gumbel-Softmax) when
                you need discrete latent variables (VQ-VAE), interpretable selections, or are
                working in a reinforcement learning framework where rewards are naturally discrete.
                The Transformer uses soft attention; modern sparse attention (Longformer, BigBird)
                approximates hard selection while keeping differentiability.
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
            <h2>REINFORCE derivation and the Gumbel-Softmax reparameterization</h2>

            <DefBlock label="Soft Attention — Objective and Gradient">
                Objective: L = log p(y|x) = Σ<sub>t</sub> log p(y<sub>t</sub> | y<sub>&lt;t</sub>, ẑ<sub>t</sub>)
                where ẑ<sub>t</sub> = H<sup>T</sup>α<sub>t</sub> is the soft context vector.
                Gradient ∂L/∂θ flows through ẑ<sub>t</sub> via chain rule with no special treatment.
                The softmax Jacobian ∂α/∂e and the linear weighted sum ∂ẑ/∂α are both well-defined.
            </DefBlock>

            <h3>Hard Attention — Marginal Likelihood</h3>
            <p>
                Define the joint model over sequences and locations:
            </p>
            <MathBlock tex="p(y \mid x) = \sum_{\mathbf{z}} p(y \mid \mathbf{z}, x)\, p(\mathbf{z} \mid x)" />
            <p>
                This sum is intractable. Monte Carlo with S samples:
            </p>
            <MathBlock tex="\log p(y \mid x) \approx \log \frac{1}{S} \sum_{s=1}^{S} p(y \mid \mathbf{z}^{(s)}, x)" />

            <h3>REINFORCE Gradient Estimator</h3>
            <MathBlock tex="\nabla_\theta \mathbb{E}_{z_t \sim p_\theta}\!\left[f(z_t)\right] = \mathbb{E}_{z_t}\!\left[f(z_t) \nabla_\theta \log p_\theta(z_t)\right]" />
            <p>
                Estimator with baseline b (control variate, E[b ∇ log p] = 0):
            </p>
            <MathBlock tex="\hat{g} = \frac{1}{S}\sum_{s=1}^{S}\!\left(f(z_t^{(s)}) - b\right)\nabla_\theta \log p_\theta(z_t^{(s)})" />

            <h3>Gumbel-Softmax — Reparameterization</h3>
            <p>
                If z* = argmax<sub>i</sub>(e<sub>i</sub> + g<sub>i</sub>) where g<sub>i</sub> ~ Gumbel(0,1),
                then z* ~ Categorical(softmax(e)). The Gumbel sample is a deterministic function of
                uniform noise:
            </p>
            <MathBlock tex="g_i = -\log(-\log u_i), \quad u_i \sim \text{Uniform}(0,1)" />
            <MathBlock tex="y_i^\tau = \frac{\exp\!\left((e_i + g_i)/\tau\right)}{\sum_j \exp\!\left((e_j + g_j)/\tau\right)} \xrightarrow{\tau\to 0} \text{one-hot}(\arg\max_i\!(e_i + g_i))" />
            <p>
                Gradients flow through y<sup>τ</sup> via the chain rule since softmax is differentiable.
                The Straight-Through Estimator uses one-hot in the forward pass, y<sup>τ</sup> gradient in the backward pass.
            </p>

            <div className="ch-callout">
                <strong>Variance of REINFORCE vs reparameterization:</strong> The REINFORCE estimator's
                variance is Var[f(z) ∇ log p(z)]. For the Gumbel-Softmax reparameterization,
                the variance comes only from the Gumbel noise, which is much lower. This is why
                Gumbel-Softmax dramatically stabilizes training of discrete latent variable models
                compared to REINFORCE — lower variance means more reliable gradient estimates,
                which means faster convergence.
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
    bar = "X" * int(a * 35)
    print(f"  f_{i}: {a:.4f}  {bar}")
print(f"  Entropy: {-(alpha_soft * np.log(alpha_soft + 1e-10)).sum():.4f}")
print()

# Hard -- run 5 times to show stochasticity
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

function PythonContent() {
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
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
