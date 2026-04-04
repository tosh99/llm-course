import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { GMMDiagram, EMStepsDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── GMM / EM tabs ─────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1894",
            title: "Karl Pearson — Decomposing a Crab Population",
            challenge: "Pearson had a dataset of crab measurements from the Bay of Naples and suspected the population was actually a mixture of two distinct species whose measurements overlapped. Standard statistics assumed a single Gaussian distribution — how do you fit a model that is explicitly a mixture of two?",
            what: "Pearson derived the method of moments to fit a mixture of two Gaussians to the crab data — solving a system of equations relating the mixture parameters to the observed data moments. This required solving a ninth-degree polynomial, which he did by hand over many months.",
            impact: "Pearson's 1894 paper is the first rigorous treatment of mixture models. Although his method-of-moments approach was computationally brutal, it established that populations could be modelled as mixtures — a revolutionary idea that seeded the entire field of latent variable models.",
        },
        {
            year: "1977",
            title: "Dempster, Laird & Rubin — The EM Algorithm",
            challenge: "Many statistical problems involved 'missing data' — observations whose full specification was unknown. Fitting a Gaussian mixture was one such problem: the cluster assignment of each point was unknown (latent). Direct maximum likelihood had no closed form; iterative methods were ad hoc and lacked convergence guarantees.",
            what: "Arthur Dempster, Nan Laird, and Donald Rubin published a unified algorithm for maximum likelihood estimation with latent variables: the Expectation-Maximisation (EM) algorithm. The E-step computes the expected complete-data log-likelihood given current parameter estimates. The M-step maximises this expectation. Crucially, they proved the likelihood is non-decreasing at every iteration.",
            impact: "The EM paper is one of the most-cited papers in statistics history. It provided the first principled algorithm for GMMs, hidden Markov models, factor analysis, and dozens of other latent variable models. The E-step/M-step paradigm influenced the design of mean-field variational inference and even BERT's masked language modelling pre-training.",
        },
        {
            year: "1990s",
            title: "GMMs in Computer Vision and Speech",
            challenge: "Speech recognition and object recognition required density models that could represent multi-modal distributions — a speaker's voice might have different characteristics in quiet vs. noisy conditions. Single Gaussians were hopelessly inadequate.",
            what: "GMMs became the dominant generative model for acoustic features in speech recognition (replacing VQ codebooks) and for background modelling in video (fitting a GMM per pixel to model lighting variation). The E-step computed per-frame cluster responsibilities; the M-step updated means, covariances, and mixing weights.",
            impact: "GMM-based acoustic models dominated speech recognition from the mid-1990s until 2012, when deep neural networks surpassed them. Even modern systems often use GMMs as initialisation or for speaker adaptation. Background subtraction using GMMs is still widely used in video surveillance.",
        },
        {
            year: "2013",
            title: "Variational Autoencoders and the VAE–GMM Connection",
            challenge: "Researchers wanted a generative model that could both learn flexible latent representations (like autoencoders) and enable tractable sampling and density estimation. Standard autoencoders had no probabilistic interpretation.",
            what: "Kingma & Welling (2013) and Rezende et al. (2014) independently developed the Variational Autoencoder (VAE). The prior p(z) over the latent space is typically a standard Gaussian or a GMM. The encoder learns q(z|x) ≈ p(z|x) and the decoder learns p(x|z). Training maximises the ELBO — evidence lower bound — using reparameterised gradients.",
            impact: "VAEs unified the GMM probabilistic framework with the deep learning representation learning framework. They directly enabled controllable image generation, and the ELBO optimisation technique is now used across nearly all probabilistic deep learning.",
        },
    ]

    return (
        <div className="ch3-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch3-tl-item">
                    <div className="ch3-tl-year">{item.year}</div>
                    <div className="ch3-tl-title">{item.title}</div>
                    <div className="ch3-tl-section-label">The challenge</div>
                    <div className="ch3-tl-body">{item.challenge}</div>
                    <div className="ch3-tl-section-label">What was introduced</div>
                    <div className="ch3-tl-body">{item.what}</div>
                    <div className="ch3-tl-section-label">Why it mattered</div>
                    <div className="ch3-tl-body ch3-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Fitting overlapping bell curves to messy data</h2>

            <Analogy label="The problem with hard clusters">
                k-means makes every point belong to exactly one group — but what if a point is genuinely between two groups? A student who scores average on both maths and English might belong to either the "science" group or the "arts" group. Wouldn't it be better to say they're <em>30% in one group and 70% in the other</em>?
            </Analogy>

            <Analogy label="What a GMM is">
                A <strong>Gaussian Mixture Model</strong> says: "the data was generated by K different bell-curve-shaped groups, each with its own centre and spread." Each point might have come from any group — we don't know which — so we assign each point a <em>probability</em> of belonging to each group (called its responsibility).
            </Analogy>

            <DiagramBlock title="GMM — three Gaussian components with 1σ and 2σ ellipses">
                <GMMDiagram />
            </DiagramBlock>

            <Analogy label="How EM works — chicken and egg">
                We have a chicken-and-egg problem: to estimate the bell curve parameters, we need to know which group each point belongs to. But to know which group each point belongs to, we need the bell curve parameters!
                <br /><br />
                EM breaks this cycle by alternating:
                <br />
                <strong>E-step:</strong> Assume we know the parameters → compute each point's probability of belonging to each group.
                <br />
                <strong>M-step:</strong> Assume we know the group assignments (as soft probabilities) → re-estimate the bell curve parameters as weighted averages.
                <br /><br />
                Keep alternating until the parameters stop changing.
            </Analogy>

            <DiagramBlock title="EM algorithm — the iterative E-step/M-step cycle">
                <EMStepsDiagram />
            </DiagramBlock>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Maximum likelihood for latent variable models</h2>

            <p>
                A Gaussian Mixture Model assumes data xₙ was generated by: (1) choosing a component k ~ Categorical(π₁,...,πₖ), then (2) sampling xₙ ~ 𝒩(μₖ, Σₖ). The marginal density is:
            </p>
            <MathBlock tex="p(x \mid \theta) = \sum_{k=1}^K \pi_k\, \mathcal{N}(x \mid \mu_k, \Sigma_k)" />
            <p>
                where πₖ ≥ 0 are mixing weights with Σₖ πₖ = 1, and θ = &#123;πₖ, μₖ, Σₖ&#125;.
            </p>

            <h3>The EM Algorithm for GMMs</h3>
            <p>
                <strong>E-step:</strong> Compute the posterior responsibility of component k for data point n:
            </p>
            <MathBlock tex="r_{nk} = \frac{\pi_k\, \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j} \pi_j\, \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}" />
            <p>
                <strong>M-step:</strong> Update parameters using the responsibilities as soft weights. Let Nₖ = Σₙ r_&#123;nk&#125;:
            </p>
            <MathBlock tex="\mu_k^{\text{new}} = \frac{1}{N_k} \sum_n r_{nk}\, x_n" />
            <MathBlock tex="\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_n r_{nk}\, (x_n - \mu_k)(x_n - \mu_k)^\top" />
            <MathBlock tex="\pi_k^{\text{new}} = \frac{N_k}{N}" />

            <h3>Relationship to k-Means</h3>
            <p>
                GMM/EM is the soft version of k-means. When all Σₖ = σ²I and σ² → 0, the soft responsibilities rₙₖ → hard 0/1 assignments, and EM reduces to the k-means Lloyd algorithm. GMM/EM is strictly more general: it handles elliptical clusters and assigns fractional memberships.
            </p>

            <h3>Choosing K — BIC / AIC</h3>
            <p>
                Unlike k-means, GMMs have a proper likelihood, so you can use <strong>BIC</strong> or <strong>AIC</strong> to penalise model complexity:
            </p>
            <MathBlock tex="\text{BIC} = -2\ln\hat{L} + p\ln n \quad \text{(lower is better)}" />
            <p>
                where p = number of free parameters = K·(d + d(d+1)/2 + 1) − 1 for full covariance GMMs.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>EM as Coordinate Ascent on the ELBO</h2>

            <DefBlock label="Evidence Lower Bound (ELBO)">
                For any distribution q(z) over the latent variables, Jensen's inequality gives:
                <br /><br />
                ln p(X|θ) ≥ 𝔼_q[ln p(X,Z|θ)] − 𝔼_q[ln q(Z)] =: ℒ(q, θ)
                <br /><br />
                The ELBO ℒ lower-bounds the log-likelihood. EM maximises the ELBO by alternating between maximising over q (E-step) and over θ (M-step).
            </DefBlock>

            <h3>E-step: Maximise over q</h3>
            <p>
                The ELBO is maximised (tightly) when q(Z) = p(Z|X, θ_old). This is exactly the posterior, and in the GMM case it is the responsibility:
            </p>
            <MathBlock tex="q(z_n = k) = r_{nk} = p(z_n = k \mid x_n, \theta^{\text{old}})" />
            <p>
                At this point, the ELBO equals the log-likelihood: ℒ(q, θ_old) = ln p(X|θ_old). So the E-step closes the gap between the bound and the true likelihood.
            </p>

            <h3>M-step: Maximise over θ</h3>
            <p>
                With q fixed, maximise 𝔼_q[ln p(X,Z|θ)] — the expected complete-data log-likelihood:
            </p>
            <MathBlock tex="Q(\theta, \theta^{\text{old}}) = \sum_n \sum_k r_{nk} \ln [\pi_k\, \mathcal{N}(x_n|\mu_k, \Sigma_k)]" />
            <p>
                Setting ∂Q/∂μₖ = 0, ∂Q/∂Σₖ = 0, ∂Q/∂πₖ = 0 (with Lagrange multiplier for Σπₖ=1) gives the closed-form M-step updates. The EM monotone convergence theorem guarantees ln p(X|θ) is non-decreasing after each full E+M step.
            </p>

            <h3>Singularities and Practical Remedies</h3>
            <p>
                The GMM likelihood is unbounded: if a single-point cluster forms (μₖ = xₙ for some n), its Gaussian density diverges as Σₖ → 0. Remedies:
            </p>
            <ul>
                <li>Add a small diagonal regularisation: Σₖ ← Σₖ + εI</li>
                <li>Use full Bayesian treatment with a Wishart prior on Σₖ (variational Bayes GMM)</li>
                <li>Multiple random restarts — avoid degenerate initialisations</li>
            </ul>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# ── Generate data ──────────────────────────────────────────────────
np.random.seed(42)
X, y_true = make_blobs(
    n_samples=300, centers=[[1.5,4.7],[4.6,4.3],[3.1,1.5]],
    cluster_std=[0.7, 0.6, 0.5], random_state=42
)
X = StandardScaler().fit_transform(X)

# ── Fit GMM ────────────────────────────────────────────────────────
# covariance_type: "full", "tied", "diag", "spherical"
gmm = GaussianMixture(
    n_components=3,
    covariance_type="full",
    n_init=5,          # multiple restarts to avoid local optima
    random_state=42
)
gmm.fit(X)
labels = gmm.predict(X)
probs  = gmm.predict_proba(X)  # soft assignments (n_samples × K)

print(f"Log-likelihood: {gmm.score(X) * len(X):.1f}")
print(f"AIC: {gmm.aic(X):.1f}")
print(f"BIC: {gmm.bic(X):.1f}")
print(f"Converged: {gmm.converged_}, iterations: {gmm.n_iter_}")

# Mixing weights and means (in scaled space)
for k in range(3):
    print(f"Component {k}: π={gmm.weights_[k]:.3f}, μ={gmm.means_[k]}")

# ── Model selection: pick K by BIC ─────────────────────────────────
bics = []
for k in range(1, 8):
    gm = GaussianMixture(n_components=k, n_init=5, random_state=42)
    bics.append(gm.fit(X).bic(X))
best_k = range(1, 8)[np.argmin(bics)]
print(f"Best K by BIC: {best_k}")  # → 3

# ── Sample new data from the fitted GMM ────────────────────────────
X_new, y_new = gmm.sample(50)
print(f"Sampled {X_new.shape[0]} new points from the GMM")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="gmm_em.py" lang="python" langLabel="Python" />
            <div className="ch3-callout">
                <strong>Covariance types:</strong> <code>full</code> allows each component its own arbitrary ellipse (most flexible, most parameters); <code>diag</code> restricts to axis-aligned ellipses; <code>spherical</code> is equivalent to soft k-means; <code>tied</code> uses the same covariance for all components. Start with <code>full</code> and use BIC to trade off fit vs. complexity.
            </div>
        </>
    )
}

const TS_CODE = `// ── EM for 1D Gaussian Mixture Model ─────────────────────────────
// Simpler than full multivariate, but shows all EM mechanics

interface Component { pi: number; mu: number; sigma: number }

function gaussian(x: number, mu: number, sigma: number): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
}

/** One E-step: compute responsibilities r[n][k] */
function eStep(data: number[], comps: Component[]): number[][] {
  return data.map(x => {
    const raw = comps.map(c => c.pi * gaussian(x, c.mu, c.sigma))
    const sum = raw.reduce((s, v) => s + v, 0)
    return raw.map(v => v / (sum + 1e-300))
  })
}

/** One M-step: update parameters given responsibilities */
function mStep(data: number[], r: number[][]): Component[] {
  const K = r[0].length
  const n = data.length
  return Array.from({ length: K }, (_, k) => {
    const Nk = r.reduce((s, rn) => s + rn[k], 0)
    const mu = r.reduce((s, rn, i) => s + rn[k] * data[i], 0) / Nk
    const sigma = Math.sqrt(
      r.reduce((s, rn, i) => s + rn[k] * (data[i] - mu) ** 2, 0) / Nk
    )
    return { pi: Nk / n, mu, sigma: Math.max(sigma, 1e-6) }
  })
}

function logLikelihood(data: number[], comps: Component[]): number {
  return data.reduce((sum, x) => {
    const p = comps.reduce((s, c) => s + c.pi * gaussian(x, c.mu, c.sigma), 0)
    return sum + Math.log(p + 1e-300)
  }, 0)
}

export function fitGMM(
  data: number[],
  K: number,
  maxIter = 100,
  tol = 1e-6
): Component[] {
  // Initialise with k-means-like spread
  const sorted = [...data].sort((a, b) => a - b)
  let comps: Component[] = Array.from({ length: K }, (_, k) => ({
    pi: 1 / K,
    mu: sorted[Math.floor((k + 0.5) * data.length / K)],
    sigma: 1.0,
  }))

  let prevLL = -Infinity
  for (let iter = 0; iter < maxIter; iter++) {
    const r = eStep(data, comps)
    comps = mStep(data, r)
    const ll = logLikelihood(data, comps)
    if (Math.abs(ll - prevLL) < tol) break
    prevLL = ll
  }
  return comps
}

// ── Demo ──────────────────────────────────────────────────────────
const data = [
  ...Array.from({length:20}, () => 1.5 + Math.random()*0.5),
  ...Array.from({length:20}, () => 4.0 + Math.random()*0.6),
]
const comps = fitGMM(data, 2)
comps.forEach((c, k) =>
  console.log(\`Component \${k}: π=\${c.pi.toFixed(3)} μ=\${c.mu.toFixed(2)} σ=\${c.sigma.toFixed(2)}\`)
)`

function CodeTab() {
    return (
        <>
            <p>
                A complete 1D Gaussian Mixture Model trained with EM. The alternating E-step (computing responsibilities) and M-step (updating means, variances, mixing weights) is the core of the algorithm — all in about 40 lines.
            </p>
            <CodeBlock code={TS_CODE} filename="gmm_em.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch3-callout">
                <strong>Extension to multivariate:</strong> Replace the scalar Gaussian with the multivariate form (requires matrix inverse and determinant). The E-step formula is unchanged. The M-step adds the outer product sum for the covariance update: Σₖ = (1/Nₖ) Σₙ rₙₖ (xₙ−μₖ)(xₙ−μₖ)ᵀ.
            </div>
        </>
    )
}

export const GMM_EM_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
