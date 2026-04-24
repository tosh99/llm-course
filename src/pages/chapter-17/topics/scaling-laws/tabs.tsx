import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The predictable power of scale</h2>
            <p>
                Before 2020, most AI researchers treated model training as an art: carefully tuned
                learning rates, architectures, and regularization tricks. But a small team at OpenAI
                noticed something strange while training GPT-2. As they increased model size, data,
                and compute, the test loss improved in a remarkably predictable pattern — a straight
                line on a log-log plot. This observation became the "scaling laws" paper, and it
                changed how the entire field thought about building AI.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Observation</div>
                    <div className="ch-tl-title">The Smooth Curves</div>
                    <div className="ch-tl-body">
                        While training GPT-2 variants, OpenAI researchers Jared Kaplan, Sam McCandlish,
                        and colleagues noticed that validation loss followed smooth, predictable curves
                        as a function of model size and training time. There was no sudden phase
                        transition — just steady, power-law improvement.
                    </div>
                    <div className="ch-tl-impact">Impact: Hinted that capability might be predictable from scale alone</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jan 2020</div>
                    <div className="ch-tl-section-label">Publication</div>
                    <div className="ch-tl-title">Scaling Laws for Neural Language Models</div>
                    <div className="ch-tl-body">
                        The paper formalized three key relationships: loss scales as a power law with
                        model size (N), dataset size (D), and compute (C). Crucially, the relationships
                        hold across multiple orders of magnitude and appear to be <em>independent of
                        architecture details</em> — LSTM, transformer, wide vs. deep — as long as the
                        model has enough capacity.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided a quantitative roadmap for building better models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2022</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">GPT-3 and Beyond</div>
                    <div className="ch-tl-body">
                        OpenAI used the scaling laws to justify GPT-3: if a 1.5B model behaves
                        predictably, a 175B model should too. It did. The laws also informed Google's
                        PaLM, Anthropic's models, and Meta's LLaMA. Researchers could now estimate
                        the compute budget needed to reach a target loss before training even began.
                    </div>
                    <div className="ch-tl-impact">Impact: Scaling became the dominant model improvement strategy</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Chinchilla</div>
                    <div className="ch-tl-body">
                        DeepMind's Chinchilla paper argued that previous models were severely
                        <em>undertrained</em>. The optimal compute-efficient strategy is to scale
                        model size and data <em>in equal proportions</em> — for every doubling of
                        parameters, double the training tokens. A 70B-parameter model trained on
                        1.4T tokens (Chinchilla) outperformed a 280B model trained on only 300B tokens
                        (Gopher) while using the same compute.
                    </div>
                    <div className="ch-tl-impact">Impact: Data size, not just model size, became a first-class citizen</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Language model performance is constrained by a
                budget of compute, data, and parameters. Within wide ranges, these three factors
                obey power laws, allowing practitioners to trade them off predictably. The
                corollary: if you want better models, the most reliable strategy is simply to scale
                all three together.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why bigger brains get smarter in predictable ways</h2>

            <Analogy label="The Garden">
                Imagine you're growing plants. You notice that when you give them more water, they
                grow taller — and the relationship is surprisingly regular. Double the water, and
                they don't double in height, but they do grow by a predictable amount every time.
                That's a power law. It lets you plan: "If I want a 6-foot plant, I need about X liters."
            </Analogy>

            <Analogy label="The Three Ingredients">
                For language models, there are three ingredients: the size of the brain (parameters),
                the number of books it reads (data), and the total studying effort (compute). The
                scaling laws say: if you know any two, you can predict the third. And no matter how
                clever your study techniques are, you can't cheat the curve — you just need more
                of all three to get smarter.
            </Analogy>

            <Analogy label="The Undertrained Student">
                DeepMind noticed that many AI labs were building giant brains but only giving them
                a small library to read. It's like hiring a genius and only letting them read 10 books.
                Chinchilla showed that a medium-sized brain that reads the whole library beats a giant
                brain that only reads a shelf. Data matters just as much as size.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The three scaling relationships</h2>

            <h3>1. Loss vs Model Size (with fixed data)</h3>
            <p>
                When training data is held constant and model size N increases, test loss L follows
                a power law:
            </p>
            <ul>
                <li>L(N) = (N<sub>c</sub> / N)<sup>α<sub>N</sub></sup> where α<sub>N</sub> ≈ 0.076</li>
                <li>N<sub>c</sub> is a constant representing the "irreducible" loss floor</li>
                <li>The law holds over six orders of magnitude, from 1M to 100B+ parameters</li>
            </ul>

            <h3>2. Loss vs Dataset Size (with fixed model)</h3>
            <p>
                When model size is fixed and training tokens D increase, loss follows a similar law:
            </p>
            <ul>
                <li>L(D) = (D<sub>c</sub> / D)<sup>α<sub>D</sub></sup> where α<sub>D</sub> ≈ 0.095</li>
                <li>Importantly, the exponent for data is larger than for parameters — data is
                    slightly more efficient per FLOP</li>
                <li>Eventually the model saturates: beyond a certain dataset size, a small model
                    cannot improve further no matter how much data you feed it</li>
            </ul>

            <h3>3. Loss vs Compute (with optimal allocation)</h3>
            <p>
                When both N and D are optimized jointly for a given compute budget C (measured in
                FLOPs), loss scales as:
            </p>
            <ul>
                <li>L(C) = (C<sub>c</sub> / C)<sup>α<sub>C</sub></sup> where α<sub>C</sub> ≈ 0.050</li>
                <li>The optimal allocation for compute-efficient training is N ∝ C<sup>0.50</sup>
                    and D ∝ C<sup>0.50</sup> — model size and data should grow in equal proportion</li>
            </ul>

            <h3>Chinchilla's Correction</h3>
            <p>
                Earlier work (including GPT-3) assumed N should grow faster than D — roughly
                N ∝ C<sup>0.73</sup> and D ∝ C<sup>0.27</sup>. Chinchilla re-estimated the exponents
                and found the optimal split is closer to 1:1. This means many "large" models were
                trained on far too little data. For example, GPT-3 (175B params, 300B tokens) was
                severely undertrained by Chinchilla standards; a 70B model on 1.4T tokens would have
                been more compute-efficient.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Practical implication:</strong> Before Chinchilla, if you had a compute budget
                for 100B FLOPs, you might train a 10B model on 10B tokens. After Chinchilla, you'd
                train a 3B model on 60B tokens — same compute, better performance.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Power-law equations for scaling</h2>

            <DefBlock label="Power Law for Model Size">
                For a model with N non-embedding parameters, trained with ample data, the
                cross-entropy loss on a test set is approximately:
            </DefBlock>
            <MathBlock tex="L(N) = \\Bigl(\\frac{N_c}{N}\\Bigr)^{\\alpha_N} + L_{\\infty}" />
            <p>
                Where N<sub>c</sub> ≈ 1.4 × 10<sup>14</sup> (fitted constant), α<sub>N</sub> ≈ 0.076,
                and L<sub>∞</sub> ≈ 1.69 nats is the irreducible entropy of natural language. The
                power law holds as long as N ≪ D (model is smaller than the dataset).
            </p>

            <h3>Power Law for Dataset Size</h3>
            <p>
                With model size held fixed and dataset size D varied:
            </p>
            <MathBlock tex="L(D) = \\Bigl(\\frac{D_c}{D}\\Bigr)^{\\alpha_D} + L_{\\infty}" />
            <p>
                Where D<sub>c</sub> ≈ 5.4 × 10<sup>13</sup> and α<sub>D</sub> ≈ 0.095. Because
                α<sub>D</sub> {'>'} α<sub>N</sub>, data efficiency dominates parameter efficiency
                per FLOP.
            </p>

            <h3>Joint Compute-Optimal Scaling</h3>
            <p>
                Training to convergence on D tokens with an N-parameter model requires approximately
                C ≈ 6ND FLOPs (each parameter is used once per forward and twice per backward pass,
                plus attention overhead). Minimizing loss subject to a compute budget C yields the
                Chinchilla-optimal allocation:
            </p>
            <MathBlock tex="N_{\\text{opt}}(C) \\propto C^{0.5} \\quad\\quad D_{\\text{opt}}(C) \\propto C^{0.5}" />

            <h3>FLOPs Estimation</h3>
            <p>
                For a decoder-only transformer, the approximate training FLOPs are:
            </p>
            <MathBlock tex="C \\approx \\tau \\cdot N \\cdot D" />
            <p>
                Where τ ≈ 6 for standard mixed-precision training. For inference, FLOPs ≈ 2ND per
                generated token (one forward pass, no backward). This simple formula is remarkably
                accurate for planning cluster budgets.
            </p>

            <div className="ch-callout">
                <strong>Why power laws?</strong> The empirical power-law scaling likely reflects the
                hierarchical, self-similar structure of language. As models grow, they capture
                progressively longer-range and more abstract patterns. Each decade of scale unlocks
                a new "layer" of linguistic structure, producing the smooth log-linear trend.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Scaling Laws Estimates ────────────────────────────────────────────────────

def loss_from_params(N, Nc=1.4e14, alpha_N=0.076, L_inf=1.69):
    """Estimate test loss from model size (non-embedding params)."""
    return (Nc / N) ** alpha_N + L_inf

def loss_from_data(D, Dc=5.4e13, alpha_D=0.095, L_inf=1.69):
    """Estimate test loss from dataset size (tokens)."""
    return (Dc / D) ** alpha_D + L_inf

def compute_optimal(C, tau=6):
    """Chinchilla-optimal N and D for a compute budget C (FLOPs)."""
    # N_opt ~ D_opt, and C = tau * N * D
    # So N_opt = sqrt(C / tau), D_opt = sqrt(C / tau)
    N_opt = np.sqrt(C / tau)
    D_opt = np.sqrt(C / tau)
    return N_opt, D_opt

# ── Demo ──────────────────────────────────────────────────────────────────────
sizes = [1e6, 1e8, 1e9, 1e10, 1.5e9]
print("Loss vs Model Size")
print("=" * 40)
for N in sizes:
    print(f"  N = {N:.0e}  →  L ≈ {loss_from_params(N):.3f}")

print()

data_sizes = [1e8, 1e9, 1e10, 1e11, 1e12]
print("Loss vs Dataset Size")
print("=" * 40)
for D in data_sizes:
    print(f"  D = {D:.0e}  →  L ≈ {loss_from_data(D):.3f}")

print()

C = 1e21  # FLOPs
N_opt, D_opt = compute_optimal(C)
print(f"Compute Budget: {C:.0e} FLOPs")
print(f"  Optimal N ≈ {N_opt:.2e} params")
print(f"  Optimal D ≈ {D_opt:.2e} tokens")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementations of Kaplan scaling laws: estimate test loss from model size or
                dataset size, and compute the Chinchilla-optimal parameter/token allocation for a
                given FLOP budget.
            </p>
            <CodeBlock code={PY_CODE} filename="scaling_laws.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Scaling Laws — TypeScript ────────────────────────────────────────────────

function lossFromParams(N: number, Nc = 1.4e14, alphaN = 0.076, Linf = 1.69): number {
    return (Nc / N) ** alphaN + Linf
}

function lossFromData(D: number, Dc = 5.4e13, alphaD = 0.095, Linf = 1.69): number {
    return (Dc / D) ** alphaD + Linf
}

function computeOptimal(C: number, tau = 6): { N: number; D: number } {
    const opt = Math.sqrt(C / tau)
    return { N: opt, D: opt }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const sizes = [1e6, 1e8, 1e9, 1e10, 1.5e9]
console.log("Loss vs Model Size")
console.log("=".repeat(40))
for (const N of sizes) {
    console.log(\`  N = \${N.toExponential(0)}  →  L ≈ \${lossFromParams(N).toFixed(3)}\`)
}

console.log("\\nLoss vs Dataset Size")
console.log("=".repeat(40))
const dataSizes = [1e8, 1e9, 1e10, 1e11, 1e12]
for (const D of dataSizes) {
    console.log(\`  D = \${D.toExponential(0)}  →  L ≈ \${lossFromData(D).toFixed(3)}\`)
}

const C = 1e21
const { N, D } = computeOptimal(C)
console.log(\`\\nCompute Budget: \${C.toExponential(0)} FLOPs\`)
console.log(\`  Optimal N ≈ \${N.toExponential(2)} params\`)
console.log(\`  Optimal D ≈ \${D.toExponential(2)} tokens\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementations of the Kaplan scaling laws and Chinchilla-optimal compute
                allocation. Useful for back-of-the-envelope training budgets.
            </p>
            <CodeBlock code={TS_CODE} filename="scaling_laws.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const SCALING_LAWS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
