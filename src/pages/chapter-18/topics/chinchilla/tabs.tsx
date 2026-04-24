import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Training smarter, not just bigger</h2>
            <p>
                Kaplan's 2020 scaling laws told the industry to build enormous models and train
                them on modest amounts of data. GPT-3 (175B parameters, 300B tokens) followed
                this recipe. So did Gopher (280B, 300B tokens), Megatron-Turing (530B, 270B
                tokens), and many others. But in 2022, DeepMind's Hoffmann and colleagues asked
                a simple question: are these models actually training-optimal? Their answer,
                published in the Chinchilla paper, was a resounding <em>no</em>. Most models
                were severely under-trained — and a smaller model trained on more data could
                beat a giant trained on less.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2021</div>
                    <div className="ch-tl-section-label">Status quo</div>
                    <div className="ch-tl-title">The "Kaplan recipe" dominates</div>
                    <div className="ch-tl-body">
                        Following Kaplan's laws, the major labs built progressively larger models
                        with roughly 1–2 tokens per parameter. GPT-3 used ~1.7 tokens/parameter.
                        Gopher used ~1.1. The implicit assumption: parameters are more valuable
                        than data, so you should max out model size within your compute budget.
                        This created a culture where parameter count became the headline metric.
                    </div>
                    <div className="ch-tl-impact">Impact: An arms race for parameter count, with data as an afterthought</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Correction</div>
                    <div className="ch-tl-title">Hoffmann et al. — Training Compute-Optimal Large Language Models</div>
                    <div className="ch-tl-body">
                        DeepMind trained over 400 models ranging from 70M to 16B parameters, with
                        varying training lengths, and re-fit the scaling laws. They discovered
                        that Kaplan had systematically under-estimated the value of data because
                        his models were often data-limited. When both N and D are varied freely,
                        the compute-optimal ratio is roughly <strong>D ≈ 20N</strong> — twenty
                        tokens per parameter. Their 70B-parameter Chinchilla model, trained on
                        1.4 trillion tokens, outperformed the 280B-parameter Gopher and the
                        530B-parameter Megatron-Turing on nearly every benchmark.
                    </div>
                    <div className="ch-tl-impact">Impact: Flipped the industry from "bigger is better" to "balance size and data"</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – 2023</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">LLaMA, Mistral, and the data-centric turn</div>
                    <div className="ch-tl-body">
                        Meta's LLaMA-1 (65B parameters, 1.4T tokens) and LLaMA-2 (70B, 2T tokens)
                        followed the Chinchilla recipe. Mistral 7B, trained on an unknown but
                        clearly large corpus, demonstrated that a modestly sized model could match
                        or exceed much larger competitors when trained with enough data and
                        careful architecture. The community shifted from counting parameters to
                        counting tokens — and to curating higher-quality data.
                    </div>
                    <div className="ch-tl-impact">Impact: Opened the era of efficient, open-weight models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023 – Present</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Over-training and the data wall</div>
                    <div className="ch-tl-body">
                        Recent models like LLaMA-3 (8B trained on 15T tokens, ~1800 tokens/param)
                        go <em>beyond</em> Chinchilla optimality. Why? Because inference cost
                        matters: a smaller model is cheaper to deploy, even if training it is
                        slightly less compute-optimal. Additionally, the world's high-quality
                        text is finite. Estimates suggest there are only 5–10T tokens of truly
                        high-quality public text, creating a "data wall" that may force future
                        gains to come from synthetic data, multimodal sources, or algorithmic
                        improvements.
                    </div>
                    <div className="ch-tl-impact">Impact: Data curation, synthetic data, and multi-epoch training are now central research topics</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Kaplan's laws were fitted on models that were
                often data-limited. When you lift the data constraint and train to convergence,
                data and parameters become equally important. The optimal strategy is to scale
                them together — roughly 20 tokens per parameter — rather than maxing out one at
                the expense of the other.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The right amount of practice</h2>

            <Analogy label="The Piano Student">
                Imagine two piano students. One has a huge piano with 88 keys but only practices
                five songs. The other has a smaller piano but practices one hundred songs. At the
                recital, the student with the smaller piano plays better — because they have
                seen more music. Before 2022, AI companies were building giant pianos but only
                practicing a few songs. Chinchilla said: "Get a reasonably sized piano and
                practice way more songs."
            </Analogy>

            <Analogy label="The Recipe">
                Kaplan's original recipe said: for every brick you add to the piano, practice
                one note. Chinchilla's recipe says: for every brick, practice <em>twenty</em>
                notes. A 70-billion-brick piano practiced on 1.4 trillion notes beat a
                280-billion-brick piano practiced on only 300 billion notes. The giant piano
                was wasting most of its bricks because it had not practiced enough to know how
                to use them.
            </Analogy>

            <Analogy label="Running Out of Songs">
                Today, there is a new problem: we are running out of good songs to practice.
                The internet has a lot of text, but not all of it is high-quality music. Some
                scientists are writing new songs with computers (synthetic data). Others are
                making the piano listen to pictures and videos too (multimodal training). The
                piano lesson is still evolving.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The compute-optimal training recipe</h2>

            <h3>What did Chinchilla find?</h3>
            <p>
                Hoffmann et al. re-examined the scaling laws by training models where <em>neither</em>
                N nor D was the bottleneck. They found that when you optimize loss under a fixed
                compute budget C ≈ 6ND, the optimal allocation satisfies:
            </p>
            <MathBlock tex="N_{\text{opt}} \propto C^{0.5}, \quad D_{\text{opt}} \propto C^{0.5}" />
            <p>
                In other words, model size and dataset size should grow <em>equally</em> as you
                increase compute. The ratio D/N ≈ 20 tokens per parameter is approximately
                constant across compute budgets. This is dramatically different from Kaplan's
                recommendation of D/N ≈ 1–2.
            </p>

            <h3>Why was Kaplan wrong?</h3>
            <p>
                Kaplan's models were often trained for a fixed number of steps, meaning many of
                his large models were data-limited. When a model is data-limited, adding more
                parameters looks artificially valuable because the model has not yet overfit.
                Chinchilla trained each model to convergence (or near-convergence), revealing
                that data and parameters contribute more symmetrically to the final loss.
            </p>

            <h3>Practical implications</h3>
            <ul>
                <li>
                    <strong>For a fixed compute budget:</strong> Train a smaller model on more
                    data. You will get better performance than a giant model trained briefly.
                </li>
                <li>
                    <strong>For a fixed model size:</strong> Train on ~20× more tokens than
                    parameters. Do not stop at 1–2 tokens per parameter.
                </li>
                <li>
                    <strong>For inference cost:</strong> A smaller, well-trained model is much
                    cheaper to serve at scale, even if training it is slightly less
                    compute-optimal.
                </li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>The Chinchilla trade-off:</strong> Chinchilla-optimal training minimizes
                <em>training</em> loss for a given <em>training</em> compute. But in practice,
                you often care about <em>inference</em> compute too. A 7B model trained on 140B
                tokens (20×) might be Chinchilla-optimal, but a 7B model trained on 1T tokens
                (140×) will be even better at serving time — even though the extra training was
                not "compute-optimal" in the strict sense.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The Chinchilla scaling laws</h2>

            <DefBlock label="Chinchilla Joint Scaling Law">
                Hoffmann et al. proposed a parametric loss model:
                <br /><br />
                L(N, D) = E + A/N<sup>α</sup> + B/D<sup>β</sup>
                <br /><br />
                where E is the irreducible entropy, A and B are coefficients, and α ≈ 0.34,
                β ≈ 0.28 for their fits. Under a compute constraint C = 6ND, minimizing L with
                respect to N and D yields the optimal ratio D/N ≈ 20.
            </DefBlock>

            <h3>Deriving the optimal ratio</h3>
            <p>
                Set up the Lagrangian with constraint C = 6ND:
            </p>
            <MathBlock tex="\mathcal{L}(N, D, \lambda) = \frac{A}{N^\alpha} + \frac{B}{D^\beta} + \lambda (6ND - C)" />
            <p>
                Taking partial derivatives and setting to zero:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial N} = -\frac{\alpha A}{N^{\alpha+1}} + 6\lambda D = 0" />
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial D} = -\frac{\beta B}{D^{\beta+1}} + 6\lambda N = 0" />
            <p>
                Dividing the two equations eliminates λ:
            </p>
            <MathBlock tex="\frac{\alpha A}{N^{\alpha+1}} \cdot \frac{D^{\beta+1}}{\beta B} = \frac{D}{N}" />
            <p>
                Rearranging and using C = 6ND:
            </p>
            <MathBlock tex="\frac{D}{N} \approx \left(\frac{\beta B}{\alpha A}\right)^{\frac{1}{\alpha+\beta+1}} \cdot \left(\frac{C}{6}\right)^{\frac{\alpha-\beta}{\alpha+\beta+1}}" />
            <p>
                Because α ≈ β ≈ 0.3, the exponent on C is near zero, making D/N approximately
                constant across compute budgets. The fitted value is D/N ≈ 20.
            </p>

            <h3>Comparison with Kaplan</h3>
            <table style={{ marginBottom: '18px', color: 'var(--ch-text)', fontSize: '16px', maxWidth: '70ch' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <th style={{ textAlign: 'left', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--ch-amber)' }}>Property</th>
                        <th style={{ textAlign: 'left', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--ch-amber)' }}>Kaplan</th>
                        <th style={{ textAlign: 'left', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--ch-amber)' }}>Chinchilla</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px' }}>Optimal D/N ratio</td>
                        <td style={{ padding: '8px' }}>~1–2</td>
                        <td style={{ padding: '8px' }}>~20</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px' }}>N scaling with C</td>
                        <td style={{ padding: '8px' }}>C<sup>0.73</sup></td>
                        <td style={{ padding: '8px' }}>C<sup>0.50</sup></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px' }}>D scaling with C</td>
                        <td style={{ padding: '8px' }}>C<sup>0.27</sup></td>
                        <td style={{ padding: '8px' }}>C<sup>0.50</sup></td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px' }}>Key reason</td>
                        <td style={{ padding: '8px' }}>Data-limited fits</td>
                        <td style={{ padding: '8px' }}>Convergence-aware fits</td>
                    </tr>
                </tbody>
            </table>

            <h3>Inference-aware training</h3>
            <p>
                The Chinchilla optimum minimizes <em>training</em> compute. But if you plan to
                serve the model for Q inference tokens, the total cost is:
            </p>
            <MathBlock tex="C_{\text{total}} = 6ND + 2NQ_{\text{inference}}" />
            <p>
                When Q<sub>inference</sub> is large, the optimal N is <em>smaller</em> than the
                Chinchilla optimum because inference costs dominate. This explains why models
                like LLaMA-3 are trained "over-Chinchilla" — the extra training cost is
                amortized over billions of inference calls.
            </p>

            <div className="ch-callout">
                <strong>Bottom line:</strong> Chinchilla taught the field that data is at least
                as important as parameters. The modern recipe is D ≈ 20N for training-optimal
                models, and often much more for inference-optimal ones.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Chinchilla Compute-Optimal Calculator — NumPy ─────────────────────────────

# Chinchilla-fitted constants (simplified from Hoffmann et al.)
A = 406.4
B = 410.7
alpha = 0.34
beta = 0.28
E = 1.69

def loss_chinchilla(N, D):
    """Predict loss given model size N and dataset size D."""
    return E + A / (N ** alpha) + B / (D ** beta)

def optimal_nd(C, ratio=20):
    """
    Compute-optimal N and D for training compute C (FLOPs).
    C ≈ 6 * N * D. If D = ratio * N, then C ≈ 6 * ratio * N^2.
    """
    N = np.sqrt(C / (6 * ratio))
    D = ratio * N
    return N, D


# ── Demo ──────────────────────────────────────────────────────────────────────
compute_budgets = [1e18, 1e19, 1e20, 1e21, 1e22]

print("Chinchilla Compute-Optimal Training Plans")
print("=" * 55)
print(f"{'C (FLOPs)':>12} {'N (params)':>14} {'D (tokens)':>14} {'Loss':>8}")
print("-" * 55)

for C in compute_budgets:
    N, D = optimal_nd(C)
    L = loss_chinchilla(N, D)
    print(f"{C:>12.0e} {N:>14.2e} {D:>14.2e} {L:>8.3f}")

print()

# Compare: Kaplan-style (D=N) vs Chinchilla-style (D=20N) for fixed C=1e21
C = 1e21
N_kaplan = (C ** 0.73) / (6 ** 0.73)
D_kaplan = C / (6 * N_kaplan)
L_kaplan = loss_chinchilla(N_kaplan, D_kaplan)

N_chin, D_chin = optimal_nd(C)
L_chin = loss_chinchilla(N_chin, D_chin)

print(f"Fixed compute C = {C:.0e} FLOPs:")
print(f"  Kaplan-style:    N={N_kaplan:.2e}, D={D_kaplan:.2e}, Loss={L_kaplan:.3f}")
print(f"  Chinchilla-style: N={N_chin:.2e}, D={D_chin:.2e}, Loss={L_chin:.3f}")
print(f"  Improvement: {(L_kaplan - L_chin):.3f} nats/token")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy calculator for Chinchilla-optimal model size and dataset size given a
                training compute budget. Compares Kaplan-style and Chinchilla-style allocations.
            </p>
            <CodeBlock code={PY_CODE} filename="chinchilla.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Chinchilla Compute-Optimal Calculator — TypeScript ──────────────────────

interface ChinchillaConstants {
  A: number
  B: number
  alpha: number
  beta: number
  E: number
}

const CHINCHILLA: ChinchillaConstants = {
  A: 406.4,
  B: 410.7,
  alpha: 0.34,
  beta: 0.28,
  E: 1.69,
}

function lossChinchilla(N: number, D: number, c: ChinchillaConstants = CHINCHILLA): number {
  return c.E + c.A / N ** c.alpha + c.B / D ** c.beta
}

function optimalND(C: number, ratio = 20): { N: number; D: number } {
  const N = Math.sqrt(C / (6 * ratio))
  const D = ratio * N
  return { N, D }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
console.log("Chinchilla Compute-Optimal Plans")
console.log("-".repeat(55))

const budgets = [1e18, 1e19, 1e20, 1e21, 1e22]
for (const C of budgets) {
  const { N, D } = optimalND(C)
  const L = lossChinchilla(N, D)
  console.log(\`C=\${C.toExponential(0)}  N=\${N.toExponential(2)}  D=\${D.toExponential(2)}  L=\${L.toFixed(3)}\`)
}

// Comparison
const C = 1e21
const N_kaplan = C ** 0.73 / 6 ** 0.73
const D_kaplan = C / (6 * N_kaplan)

const { N: N_chin, D: D_chin } = optimalND(C)

console.log(\`\\nComparison @ C=1e21:\`)
console.log(\`  Kaplan:     N=\${N_kaplan.toExponential(2)} D=\${D_kaplan.toExponential(2)} L=\${lossChinchilla(N_kaplan, D_kaplan).toFixed(3)}\`)
console.log(\`  Chinchilla: N=\${N_chin.toExponential(2)} D=\${D_chin.toExponential(2)} L=\${lossChinchilla(N_chin, D_chin).toFixed(3)}\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of the Chinchilla compute-optimal calculator with
                typed constants and comparison against Kaplan-style allocation.
            </p>
            <CodeBlock code={TS_CODE} filename="chinchilla.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CHINCHILLA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
