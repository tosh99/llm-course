import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Predictability at scale</h2>
            <p className="ch-story-intro">
                Chapter 21 settled a fundamental question in computer vision: the Transformer architecture,
                given enough data, can outperform CNNs even without their built-in spatial inductive biases.
                But this raised a harder follow-on question that applied to every architecture &mdash; language
                models, vision models, and everything in between. How much data is &ldquo;enough&rdquo;?
                How large must the model be? Is there a formula for predicting the return on a billion-dollar
                training run <em>before</em> you spend it? In 2020, Jared Kaplan and colleagues at OpenAI
                published a set of empirical findings &mdash; the scaling laws &mdash; that answered these
                questions with surprising precision and changed how every major AI lab planned its experiments.
            </p>
            <p>
                Before 2020, training large language models was an art form. Researchers would
                guess hyperparameters, train for a while, and hope the loss went down. There was
                no reliable way to predict whether a 10&times; larger model would be worth the cost.
                Then Jared Kaplan and his colleagues at OpenAI showed something remarkable: the
                test loss of language models follows precise, predictable curves as a function
                of model size, dataset size, and compute.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2019</div>
                    <div className="ch-tl-section-label">Predecessors</div>
                    <div className="ch-tl-title">Hints from smaller-scale experiments</div>
                    <div className="ch-tl-body">
                        Early work on scaling neural networks showed that wider and deeper models
                        tended to perform better, but the relationship was murky. Hestness et al.
                        (2017) observed power-law scaling in vision and translation tasks, but
                        no one had systematically characterized language model scaling across
                        orders of magnitude.
                    </div>
                    <div className="ch-tl-impact">Impact: Suggested that predictable scaling might be universal</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Discovery</div>
                    <div className="ch-tl-title">Kaplan et al. — Scaling Laws for Neural Language Models</div>
                    <div className="ch-tl-body">
                        Kaplan and colleagues at OpenAI trained models ranging from 1.5M to 1.5B
                        parameters on web text. They discovered that cross-entropy loss scales as
                        a power law in each of three factors — model parameters N, dataset size D,
                        and training compute C — when the other factors are not bottlenecking. The
                        key insight: you can predict the final loss of a large model by fitting a
                        curve on small models, then extrapolating.
                    </div>
                    <div className="ch-tl-impact">Impact: Made billion-dollar training runs economically justifiable</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2022</div>
                    <div className="ch-tl-section-label">Validation</div>
                    <div className="ch-tl-title">GPT-3, Gopher, and Megatron-Turing validate the curves</div>
                    <div className="ch-tl-body">
                        GPT-3 (175B parameters) landed almost exactly on the loss predicted by
                        Kaplan's scaling laws. Google's Gopher (280B) and NVIDIA's Megatron-Turing
                        (530B) further confirmed the trends, though subtle deviations began to
                        appear at the largest scales. The laws were not perfect, but they were
                        good enough to guide billion-dollar decisions.
                    </div>
                    <div className="ch-tl-impact">Impact: Scaling laws became the central planning tool of the LLM industry</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – Present</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Chinchilla and beyond</div>
                    <div className="ch-tl-body">
                        DeepMind's Chinchilla paper (2022) showed that Kaplan's laws had
                        systematically under-estimated the value of training data. Modern models
                        like GPT-4, Claude, and Gemini are trained with far more tokens per
                        parameter than Kaplan recommended, following the Chinchilla-optimal
                        compute budget instead.
                    </div>
                    <div className="ch-tl-impact">Impact: A 70B model trained on 1.4T tokens can beat a 280B model trained on 300B</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Language model performance is not magic. It is
                a smooth, deterministic function of resources. If you know the power-law exponents,
                you can answer questions like "Should I double my model size or my dataset?" before
                spending a dime on GPUs.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Building taller towers with Lego</h2>

            <Analogy label="The Mystery">
                Imagine you are building a tower out of Lego bricks. You have a big bucket of
                bricks, but you do not know how tall your tower will get. Every time you add
                bricks, the tower gets taller — but will doubling the bricks double the height?
                Before 2020, nobody knew the rule.
            </Analogy>

            <Analogy label="The Discovery">
                A group of scientists at OpenAI built hundreds of tiny towers and measured them
                carefully. They discovered a secret pattern: if you write down the height and the
                number of bricks on graph paper, the dots form a perfectly straight line on a
                special kind of graph (a log-log plot). That means you can predict how tall a
                <em> giant</em> tower will be just by looking at the tiny ones.
            </Analogy>

            <Analogy label="Why It Matters">
                Giant towers cost millions of dollars to build. Before this discovery, people
                built giant towers and <em>hoped</em> they would be tall enough. After the
                discovery, they could draw the line on graph paper and say, "If we use this many
                bricks, the tower will be exactly this tall." No more guessing.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Loss as a function of size, data, and compute</h2>

            <h3>What is being predicted?</h3>
            <p>
                Kaplan's team wanted to predict the <strong>cross-entropy loss</strong> on a
                held-out test set. Lower loss means the model is better at guessing the next word.
                They found that loss depends on three main factors:
            </p>
            <ul>
                <li><strong>N</strong> — the number of parameters in the model</li>
                <li><strong>D</strong> — the number of training tokens (dataset size)</li>
                <li><strong>C</strong> — the total training compute (roughly 6ND FLOPs for Transformers)</li>
            </ul>

            <h3>The power-law finding</h3>
            <p>
                When you are not bottlenecked by the other factors, loss follows a power law:
            </p>
            <MathBlock tex="L(N) = \left(\frac{N_c}{N}\right)^{\alpha_N} + L_\infty" />
            <MathBlock tex="L(D) = \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty" />
            <p>
                Here L<sub>∞</sub> is the irreducible entropy of natural language (the best
                possible loss), and N<sub>c</sub>, D<sub>c</sub> are constants. The exponents
                α<sub>N</sub> ≈ 0.076 and α<sub>D</sub> ≈ 0.095 mean that loss improves
                <em> faster</em> with more data than with more parameters.
            </p>

            <h3>Joint scaling</h3>
            <p>
                When both N and D are varied together, the combined law is approximately:
            </p>
            <MathBlock tex="L(N, D) = \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty" />

            <div className="ch-callout">
                <strong>Key takeaway:</strong> Because α<sub>D</sub> &gt; α<sub>N</sub>, data is
                slightly more valuable than parameters per FLOP. However, Kaplan's original paper
                recommended training models with roughly 20 tokens per parameter, which was later
                shown to be far too little.
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
            <h2>Derivation and functional forms</h2>

            <DefBlock label="Kaplan Scaling Law — Parameter Scaling">
                For a non-parametrically-bottlenecked model trained on ample data, the test loss
                scales with parameter count N as:
                <MathBlock tex="L(N) = \left(\frac{N_c}{N}\right)^{\!\alpha_N} + L_\infty" />
                where <InlineMath tex="\alpha_N \approx 0.073\text{–}0.076" />, <InlineMath tex="N_c \approx 8.8 \times 10^{13}" />, and
                <InlineMath tex="L_\infty \approx 1.69" /> nats/token for WebText2.
            </DefBlock>

            <h3>Data scaling</h3>
            <MathBlock tex="L(D) = \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty" />
            <p>
                With α<sub>D</sub> ≈ 0.095 and D<sub>c</sub> ≈ 5.4 × 10<sup>13</sup> tokens.
                This is steeper than parameter scaling, suggesting data efficiency is higher.
            </p>

            <h3>Compute-optimal frontier</h3>
            <p>
                Given a fixed compute budget C ≈ 6ND FLOPs (the standard estimate for training
                a decoder-only Transformer with one forward and one backward pass per token),
                what is the optimal trade-off between N and D?
            </p>
            <p>
                Kaplan et al. derived that under their laws, the compute-optimal ratio is
                approximately:
            </p>
            <MathBlock tex="D_{\text{opt}} \approx \frac{C^{0.73}}{6^{0.73} \, N_c^{0.27}} \quad \text{and} \quad N_{\text{opt}} \approx \frac{C^{0.27}}{6^{0.27} \, D_c^{0.73}}" />
            <p>
                This implies that for a given compute budget, you should scale parameters much
                faster than data — specifically, D ∝ N<sup>0.74</sup>. For a 1B parameter model,
                this recommends roughly 20B tokens. Chinchilla later showed this was wrong: the
                true optimal ratio is closer to D ≈ 20N (20 tokens per parameter).
            </p>

            <h3>Why the discrepancy?</h3>
            <p>
                Kaplan's fits were based on models where data was often the bottleneck. When data
                is abundant, the parameter-scaling term dominates, making parameters look more
                valuable than they are in practice. Hoffmann et al. (Chinchilla) re-fit the laws
                with models trained to convergence, finding that both N and D should be scaled
                <em>equally</em> — exponents near 0.5 for each.
            </p>

            <div className="ch-callout">
                <strong>Practical formula:</strong> The modern consensus is D ≈ 20N for
                compute-optimal training. A 7B parameter model should see ~140B tokens, and a 70B
                model should see ~1.4T tokens. Most early LLMs were severely under-trained.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib.pyplot as plt

# ── Kaplan Scaling Laws — NumPy ───────────────────────────────────────────────

# Empirically fitted constants from Kaplan et al. (2020)
N_c = 8.8e13       # parameter scaling constant
D_c = 5.4e13       # data scaling constant
L_inf = 1.69       # irreducible loss (nats/token)
alpha_N = 0.076    # parameter exponent
alpha_D = 0.095    # data exponent

def loss_from_params(N):
    """Predict loss given model size N (parameters)."""
    return (N_c / N) ** alpha_N + L_inf

def loss_from_data(D):
    """Predict loss given dataset size D (tokens)."""
    return (D_c / D) ** alpha_D + L_inf

def loss_joint(N, D):
    """Approximate joint scaling law."""
    return (N_c / N) ** alpha_N + (D_c / D) ** alpha_D + L_inf


# ── Demo ──────────────────────────────────────────────────────────────────────
Ns = np.logspace(6, 11, 50)   # 1M to 100B parameters
Ds = np.logspace(8, 13, 50)   # 100M to 10T tokens

print("Kaplan Scaling Law Predictions")
print("=" * 45)

for n, label in [(1e8, "100M"), (1e9, "1B"), (1e10, "10B"), (1e11, "100B")]:
    print(f"Loss @ {label:>4} params (ample data): {loss_from_params(n):.3f}")

print()
for d, label in [(1e9, "1B"), (1e10, "10B"), (1e11, "100B"), (1e12, "1T")]:
    print(f"Loss @ {label:>4} tokens (ample params): {loss_from_data(d):.3f}")

print()
# Compute-optimal point for C = 1e21 FLOPs (roughly GPT-3 scale)
C = 1e21
N_opt = (C ** 0.27) / (6 ** 0.27 * D_c ** 0.73)
D_opt = C / (6 * N_opt)
print(f"Compute-optimal for C={C:.0e} FLOPs:")
print(f"  N_opt ≈ {N_opt:.2e} params")
print(f"  D_opt ≈ {D_opt:.2e} tokens")
print(f"  Predicted loss: {loss_joint(N_opt, D_opt):.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of Kaplan's scaling laws with the empirically fitted
                constants. The demo computes predicted loss for various model sizes and
                derives the compute-optimal model size for a given FLOP budget.
            </p>
            <CodeBlock code={PY_CODE} filename="scaling_laws.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SCALING_LAWS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
