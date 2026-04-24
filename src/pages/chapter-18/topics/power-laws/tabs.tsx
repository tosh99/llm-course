import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The universality of power laws</h2>
            <p>
                Power laws are one of the most common patterns in nature. They describe the
                distribution of city sizes, earthquake frequencies, and metabolic rates. In
                2020, Kaplan et al. showed that neural language models obey power laws too:
                test loss is proportional to (size)<sup>−α</sup> for some constant α. This
                is not an artifact of language modeling — similar laws appear in vision,
                speech, and protein folding.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Hestness et al. — Deep Learning Scaling is Predictable</div>
                    <div className="ch-tl-body">
                        Before language models, Hestness and colleagues at Baidu showed that
                        image classifiers, speech recognizers, and machine translation systems
                        all followed power-law scaling with training set size. Their key finding:
                        error rate ∝ D<sup>−β</sup> over multiple orders of magnitude, with β
                        depending on the task but not on model architecture.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that power-law scaling is a general deep-learning phenomenon</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Characterization</div>
                    <div className="ch-tl-title">Kaplan et al. — Three Interacting Power Laws</div>
                    <div className="ch-tl-body">
                        Kaplan showed that language model loss is governed by three distinct
                        power laws — one for parameters N, one for data D, and one for compute
                        C — with exponents α<sub>N</sub> ≈ 0.076, α<sub>D</sub> ≈ 0.095, and
                        α<sub>C</sub> ≈ 0.057. The exponents are small, meaning returns diminish
                        slowly: every 10× increase in resources yields only modest loss
                        improvements, but those improvements compound across enough orders of
                        magnitude to produce transformative capabilities.
                    </div>
                    <div className="ch-tl-impact">Impact: Quantified the "bitter lesson" — scale beats architecture</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Henighan et al. — Scaling Laws for Transfer</div>
                    <div className="ch-tl-body">
                        OpenAI researchers extended scaling laws to the transfer setting. They
                        found that fine-tuning loss on a downstream task also follows a power law
                        in pre-training compute, with a steeper exponent than the pre-training
                        loss itself. This means transfer is <em>more</em> efficient than training
                        from scratch — a small amount of pre-training compute yields
                        disproportionately large downstream gains.
                    </div>
                    <div className="ch-tl-impact">Impact: Justified massive pre-training budgets even for narrow applications</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The deeper pattern:</strong> Power-law scaling suggests that neural
                networks are approximating some underlying structure of natural data distributions.
                The exponent may reflect the intrinsic dimensionality or smoothness of the data
                manifold — a connection that remains an active area of theoretical research.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How fast do toys get better?</h2>

            <Analogy label="The Birthday Party">
                Imagine you are blowing up a balloon. At first, every breath makes it much
                bigger. But as the balloon grows, each breath adds less and less volume. The
                balloon still gets bigger — just more slowly. Scientists call this a
                <em> power law</em>: the balloon's size is related to the number of breaths by a
                simple formula with an exponent.
            </Analogy>

            <Analogy label="The Toy Factory">
                Now imagine a toy factory that makes robots smarter. If they double the number
                of robot brains, the robots get a little smarter — but not twice as smart. If
                they double the training books, same thing. The scientists at OpenAI measured
                this exactly. They found that every time you make the robot 10× bigger, its
                "test score" goes down by a predictable amount. This means you can draw a line
                on special graph paper and <em>see the future</em>.
            </Analogy>

            <Analogy label="Why Power Laws Are Special">
                Most things in life do not follow simple rules. If you plant a tree, its height
                does not follow a power law — it grows fast, then slows, then stops. But AI
                models keep improving across a huge range, from tiny models you can run on a
                phone to giants that fill a warehouse. The fact that one simple formula describes
                <em> all</em> of them is why the scaling hypothesis is so powerful.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Log-log plots and straight lines</h2>

            <h3>What is a power law?</h3>
            <p>
                A power law is a relationship of the form y = A · x<sup>−α</sup>, where A and α
                are constants. If you plot log(y) versus log(x), a power law becomes a straight
                line with slope −α. This is why power laws are easy to spot and fit: you just
                take logs and draw a line.
            </p>

            <h3>Why do neural networks follow power laws?</h3>
            <p>
                No one knows for sure, but there are clues. One theory comes from statistical
                physics: natural language has a hierarchical, self-similar structure (words form
                phrases, phrases form sentences, sentences form paragraphs). Self-similar systems
                often produce power laws. Another theory is that gradient descent on
                high-dimensional data manifolds naturally produces power-law eigenvalue spectra,
                which translate into power-law learning curves.
            </p>

            <h3>The three exponents</h3>
            <p>
                Kaplan measured three exponents:
            </p>
            <ul>
                <li><strong>α<sub>N</sub> ≈ 0.076</strong> — how fast loss improves with model size</li>
                <li><strong>α<sub>D</sub> ≈ 0.095</strong> — how fast loss improves with data</li>
                <li><strong>α<sub>C</sub> ≈ 0.057</strong> — how fast loss improves with compute</li>
            </ul>
            <p>
                Because α<sub>D</sub> &gt; α<sub>N</sub> &gt; α<sub>C</sub>, data gives the
                biggest bang per resource, followed by parameters, followed by raw compute.
                However, you cannot just use more data without also scaling the model, because
                an undersized model will underfit no matter how much data you feed it.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Diminishing returns:</strong> A power law with exponent 0.07 means that
                to cut the loss in half, you need to increase resources by 2<sup>1/0.07</sup> ≈
                1000×. That is why GPT-3 is 100× larger than GPT-2, but its loss only improved
                by a modest factor. The magic happens when you stack many such improvements
                across tasks and modalities.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Functional forms and theoretical interpretations</h2>

            <DefBlock label="Power Law — General Form">
                A quantity y scales as a power law in x if:
                <br /><br />
                y = A · x<sup>−α</sup> + y<sub>∞</sub>
                <br /><br />
                where A &gt; 0 is a prefactor, α &gt; 0 is the exponent, and y<sub>∞</sub> is
                an asymptotic floor. In log-log space:
                <br /><br />
                log(y − y<sub>∞</sub>) = log(A) − α · log(x)
                <br /><br />
                which is a straight line with slope −α.
            </DefBlock>

            <h3>Parameter scaling</h3>
            <MathBlock tex="L(N) = \left(\frac{N_c}{N}\right)^{\alpha_N} + L_\infty" />
            <p>
                For decoder-only Transformers on language modeling, Kaplan found α<sub>N</sub> ≈
                0.076 and N<sub>c</sub> ≈ 8.8 × 10<sup>13</sup>. This form is empirical — it
                fits data over 4–5 orders of magnitude in N. Theoretical work by Bahri et al.
                (2024) derives similar forms from neural tangent kernel (NTK) theory under
                assumptions about data manifold dimensionality.
            </p>

            <h3>Data scaling</h3>
            <MathBlock tex="L(D) = \left(\frac{D_c}{D}\right)^{\alpha_D} + L_\infty" />
            <p>
                With α<sub>D</sub> ≈ 0.095. Notably, this is larger than α<sub>N</sub>, meaning
                data is more efficient per token than parameters are per weight. However, data
                and parameters are coupled: a model with N parameters can only extract so much
                information from D tokens. The effective number of "learnable bits" is bounded
                by both.
            </p>

            <h3>Compute scaling</h3>
            <p>
                If compute C ≈ 6ND (for standard Transformer training), and we substitute the
                optimal N(D) relationship, we obtain:
            </p>
            <MathBlock tex="L(C) = \left(\frac{C_c}{C}\right)^{\alpha_C} + L_\infty" />
            <p>
                Kaplan found α<sub>C</sub> ≈ 0.057. The shallower exponent reflects the fact
                that compute must be split between parameters and data; neither can be scaled
                alone.
            </p>

            <h3>Connection to statistical mechanics</h3>
            <p>
                Some researchers interpret power-law scaling through the lens of critical
                phenomena. Near a phase transition, physical systems exhibit power laws with
                universal exponents. If neural network training is viewed as a disordered system
                approaching a "learning phase transition," the exponents might reflect universal
                properties of high-dimensional optimization. This remains speculative but
                motivates ongoing work at the intersection of physics and machine learning.
            </p>

            <div className="ch-callout">
                <strong>Breaking the power law:</strong> Power laws cannot continue forever.
                Eventually, you run out of data, hit hardware limits, or reach the irreducible
                entropy of the task. The key question for the 2020s is: where does the power law
                break, and what happens after it does?
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import matplotlib.pyplot as plt

# ── Power-Law Visualization — NumPy ───────────────────────────────────────────

# Simulate scaling data with noise
np.random.seed(42)
N = np.logspace(6, 11, 30)          # 1M to 100B parameters
alpha = 0.076
Nc = 8.8e13
L_inf = 1.69

# True loss + small log-normal noise
loss_true = (Nc / N) ** alpha + L_inf
noise = np.random.normal(0, 0.015, size=N.shape)
loss_noisy = loss_true * np.exp(noise)

# Fit power law in log space
logN = np.log(N)
logL = np.log(loss_noisy - L_inf)
coeffs = np.polyfit(logN, logL, 1)
alpha_fit = -coeffs[0]
logA_fit = coeffs[1]

print("Power-Law Fit Results")
print("=" * 35)
print(f"True exponent:     {alpha:.4f}")
print(f"Fitted exponent:   {alpha_fit:.4f}")
print(f"Fitted prefactor:  {np.exp(logA_fit):.2e}")

# Predict loss for a 1T parameter model
N_giant = 1e12
loss_pred = np.exp(logA_fit) * N_giant ** (-alpha_fit) + L_inf
print(f"\\nPredicted loss @ 1T params: {loss_pred:.3f}")

# Compare: what N is needed to reach loss = 1.8?
target = 1.8
N_needed = (np.exp(logA_fit) / (target - L_inf)) ** (1 / alpha_fit)
print(f"Params needed for loss={target}: {N_needed:.2e}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy demonstration of fitting a power law to noisy scaling data. The script
                generates synthetic loss measurements, fits the exponent in log-log space, and
                extrapolates to future model sizes.
            </p>
            <CodeBlock code={PY_CODE} filename="power_law_fit.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Power-Law Utilities — TypeScript ────────────────────────────────────────

interface PowerLawFit {
  alpha: number
  A: number
  L_inf: number
}

function fitPowerLaw(
  xs: number[],
  ys: number[],
  L_inf: number
): PowerLawFit {
  const n = xs.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0

  for (let i = 0; i < n; i++) {
    const lx = Math.log(xs[i])
    const ly = Math.log(ys[i] - L_inf)
    sumX += lx
    sumY += ly
    sumXY += lx * ly
    sumX2 += lx * lx
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return {
    alpha: -slope,
    A: Math.exp(intercept),
    L_inf,
  }
}

function predictLoss(x: number, fit: PowerLawFit): number {
  return fit.A * x ** (-fit.alpha) + fit.L_inf
}

function requiredX(targetLoss: number, fit: PowerLawFit): number {
  return (fit.A / (targetLoss - fit.L_inf)) ** (1 / fit.alpha)
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const sizes = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11]
const losses = sizes.map(n => 1.69 + 0.5 * (8.8e13 / n) ** 0.076)

const fit = fitPowerLaw(sizes, losses, 1.69)
console.log("Fitted power law:")
console.log(\`  α = \${fit.alpha.toFixed(4)}\`)
console.log(\`  A = \${fit.A.toExponential(2)}\`)

console.log(\`\\nPredicted @ 1T params: \${predictLoss(1e12, fit).toFixed(3)}\`)
console.log(\`Needed for loss=1.80:  \${requiredX(1.80, fit).toExponential(2)} params\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of log-log linear regression for power-law fitting,
                with prediction and inverse-prediction utilities.
            </p>
            <CodeBlock code={TS_CODE} filename="power_law.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const POWER_LAWS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
