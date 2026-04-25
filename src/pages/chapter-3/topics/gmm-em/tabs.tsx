import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { GMMDiagram, EMStepsDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── GMM / EM tabs ─────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1894",
            title: "Karl Pearson — Decomposing a Crab Population",
            challenge: "Pearson received a dataset of crab measurements from the Bay of Naples and suspected the population was actually a mixture of two distinct sub-species whose measurements overlapped. Standard statistics assumed a single Gaussian distribution — what happens when the data is clearly not unimodal? Fitting a single bell curve to a bimodal dataset produces meaningless parameter estimates. Pearson needed a principled way to fit a model that was explicitly a mixture of two Gaussians.",
            what: "Pearson derived the method of moments to fit a mixture of two Gaussians to the crab data — solving a system of equations relating the mixture parameters (means, variances, mixing weight) to the observed data moments. The computation required solving a ninth-degree polynomial, which he carried out by hand over many months of calculation. The result: two distinct sub-populations identified purely from the shape of the measurement distribution.",
            impact: "Pearson's 1894 paper is the first rigorous treatment of mixture models in the statistical literature. Although his method-of-moments approach was computationally brutal, it established that populations could be modelled as weighted superpositions of simpler distributions — a revolutionary idea that seeded the entire field of latent variable models, from hidden Markov models to variational autoencoders.",
        },
        {
            year: "1977",
            title: "Dempster, Laird &amp; Rubin — The EM Algorithm",
            challenge: "Many statistical estimation problems involved 'missing data' — observations whose complete specification was unknown. Fitting a Gaussian mixture was one such problem: the cluster assignment of each point was unknown (latent). Direct maximum likelihood had no closed form; iterative methods existed but were ad hoc and lacked convergence guarantees. The missing-data framework unified dozens of apparently unrelated problems, but no general algorithm had been derived.",
            what: "Arthur Dempster, Nan Laird, and Donald Rubin published a unified algorithm for maximum likelihood estimation with latent variables: the Expectation-Maximisation algorithm. The E-step computes the expected complete-data log-likelihood given current parameter estimates — filling in the missing data with their posterior expectations. The M-step maximises this expectation over the parameters. Crucially, they proved the marginal likelihood is non-decreasing at every full E+M step — the first convergence guarantee for any general latent variable fitting algorithm.",
            impact: "The 1977 EM paper became one of the most-cited papers in statistics history. It provided the first principled algorithm for Gaussian mixture models, hidden Markov models, factor analysis, mixture of experts, and dozens of other latent variable models. The E-step/M-step paradigm influenced the design of mean-field variational inference, the forward-backward algorithm, and even BERT's masked language modelling pre-training, which can be understood as a discrete E-step.",
        },
        {
            year: "1990s",
            title: "GMMs in Speech Recognition and Computer Vision",
            challenge: "Speech recognition and object recognition required density models that could represent multi-modal distributions. A speaker's voice might cluster differently in quiet versus noisy conditions; a pixel's colour in a surveillance video background might follow one distribution on sunny days and another on cloudy days. Single Gaussians were hopelessly inadequate for modelling such distributions. Vector quantisation (k-means) was better but could not model the full probability density.",
            what: "GMMs became the dominant generative model for acoustic features in speech recognition, replacing the simpler VQ codebook approach. Each phoneme was modelled by a mixture of Gaussians over the MFCC feature space. For video background modelling, a GMM was fit per pixel to model lighting variation — the E-step computed per-frame component responsibilities; the M-step updated means, covariances, and mixing weights as new frames arrived online.",
            impact: "GMM-based acoustic models dominated speech recognition from the mid-1990s until 2012, when Hinton's group showed that deep neural networks dramatically outperformed them. Even modern systems often use GMMs for speaker adaptation and diarisation. Background subtraction using Stauffer and Grimson's per-pixel GMM (1999) remains a standard baseline in video surveillance and is still used in production systems today.",
        },
        {
            year: "1999–2006",
            title: "Speaker Diarisation — 'Who Spoke When?'",
            challenge: "Telephone transcription and broadcast media indexing required answering a question that k-means alone could not: given a recording of multiple speakers, which speaker is talking at each moment? The problem was unsupervised — no speaker identities were known in advance — and the number of speakers was unknown. Each speaker's voice had a different acoustic distribution; the task was to segment and cluster audio into homogeneous speaker regions.",
            what: "Speaker diarisation systems of the early 2000s used GMMs for each speaker cluster (with 16–64 Gaussian components per speaker model), BIC-based merge criteria for determining the number of speakers, and the Bayesian Information Criterion to penalise model complexity. The EM algorithm fit each speaker's GMM; a Viterbi-like segmentation step determined speaker boundaries. Agglomerative hierarchical clustering merged speaker clusters bottom-up.",
            impact: "GMM-based diarisation systems set the state of the art for over a decade and remain competitive baselines today. The x-vector neural network systems (2018) that eventually surpassed them still use a backend GMM or PLDA model on the extracted embeddings. The speaker diarisation pipeline is a direct descendant of the GMM/EM framework applied to the temporal structure of audio — a bridge between clustering and sequence modelling.",
        },
        {
            year: "2006",
            title: "Variational Bayes EM — Automatic Model Order Selection",
            challenge: "Standard EM requires specifying K (the number of Gaussian components) in advance. Choosing K by BIC or AIC requires fitting many models and is computationally expensive. Researchers wanted an algorithm that could automatically infer the effective number of components from the data — pruning away unnecessary Gaussians without requiring manual model selection.",
            what: "Variational Bayesian EM (VB-EM) placed a Dirichlet prior on the mixing weights and conjugate priors on the means and covariances. The VB-E step computed approximate posterior responsibilities using a factorised variational distribution q(Z, &theta;) = q(Z)q(&theta;). The VB-M step updated the variational parameters. As the algorithm converged, components with no assigned data shrank to zero mixing weight — effectively pruning themselves. Beal and Ghahramani (2003) provided the full derivation.",
            impact: "VB-EM made automatic model selection practical for Gaussian mixtures and influenced the development of variational autoencoders (VAEs) a decade later. The ELBO objective maximised by VB-EM is the same evidence lower bound that VAEs optimise using reparameterised gradients — making VB-EM the direct intellectual ancestor of modern deep generative models. The next chapter moves forward to 1979, where a completely different tradition was maturing: learning decision rules from labeled examples, one question at a time.",
        },
        {
            year: "2013",
            title: "Variational Autoencoders — GMMs Meet Deep Networks",
            challenge: "Researchers wanted a generative model that could learn flexible, high-dimensional latent representations — like autoencoders — while enabling tractable density estimation and controllable sampling. Standard autoencoders had no probabilistic interpretation; their latent spaces were arbitrary and could not be sampled meaningfully. GMMs could model distributions but could not learn compact representations of high-dimensional data like images.",
            what: "Kingma and Welling (2013) and Rezende et al. (2014) independently developed the Variational Autoencoder. The prior p(z) over the latent space is typically a standard Gaussian or a Gaussian mixture. The encoder learns an approximate posterior q(z|x) &approx; p(z|x); the decoder learns p(x|z). Training maximises the ELBO using reparameterised gradients — enabling backpropagation through the stochastic sampling step. The EM algorithm for GMMs is precisely the special case where the encoder is a linear Gaussian and the decoder is also Gaussian.",
            impact: "VAEs unified the GMM probabilistic framework with deep learning representation learning. They directly enabled controllable image generation, latent space interpolation, and semi-supervised learning. The ELBO optimisation technique is now used across nearly all probabilistic deep learning, from diffusion models to large language model alignment. But VAEs belong to 2013 — far ahead in the story. The next chapter returns to 1979, where a completely different tradition was maturing: algorithms that learned decision rules from labeled data, one question at a time. Decision trees.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch-tl-item">
                    <div className="ch-tl-year">{item.year}</div>
                    <div className="ch-tl-title">{item.title}</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">{item.challenge}</div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">{item.what}</div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
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
                k-Means makes every point belong to exactly one group — but what if a point is genuinely between two groups? A student who scores average on both mathematics and English might belong to either the "science" group or the "arts" group. Wouldn't it be better to say they're <em>30% in one group and 70% in the other</em>? Hard assignment throws away this uncertainty. Soft assignment keeps it.
            </Analogy>

            <Analogy label="What a Gaussian Mixture Model is">
                A <strong>Gaussian Mixture Model</strong> says: the data was generated by K different bell-curve-shaped groups (Gaussians), each with its own centre and spread. Each data point might have come from any group — we don't know which — so we assign each point a <em>probability</em> of belonging to each group. These probabilities are called <strong>responsibilities</strong>: how responsible is each Gaussian for producing this point?
            </Analogy>

            <DiagramBlock title="GMM — three Gaussian components with 1&sigma; and 2&sigma; ellipses">
                <GMMDiagram />
            </DiagramBlock>

            <Analogy label="The chicken-and-egg problem">
                We have a circular problem: to estimate where each bell curve is, we need to know which group each point belongs to. But to know which group each point belongs to, we need to know where the bell curves are!
                <br /><br />
                Dempster, Laird, and Rubin's 1977 insight: break the cycle by alternating. Start with a guess. Then:
                <br />
                <strong>E-step (Expectation):</strong> Assume the bell curves are correct &rarr; compute each point's probability of belonging to each group.
                <br />
                <strong>M-step (Maximisation):</strong> Assume the probabilities are correct &rarr; re-estimate each bell curve's centre and spread as a weighted average, where the weights are the probabilities from the E-step.
                <br /><br />
                Keep alternating. The key theorem: the total likelihood of the data never decreases. The algorithm always improves, and eventually stabilises.
            </Analogy>

            <DiagramBlock title="EM algorithm — the iterative E-step/M-step cycle">
                <EMStepsDiagram />
            </DiagramBlock>

            <Analogy label="How GMM differs from k-Means">
                k-Means is like painting each point with a single solid colour — it belongs to exactly one group. GMM is like painting each point with a mixture of colours — 70% red, 20% blue, 10% yellow. Points near the boundary between clusters get partial memberships instead of being forced into one camp.
                <br /><br />
                GMM also handles ellipse-shaped clusters, not just round blobs. The covariance matrix of each Gaussian captures the orientation and elongation of its cluster — much more flexible than the spherical assumption k-means makes.
            </Analogy>

            <Analogy label="Choosing K — using proper probability">
                Unlike k-means, a GMM has a proper probability model — you can evaluate the likelihood of the data given the model. This means you can use formal model selection criteria: BIC (Bayesian Information Criterion) penalises models with more parameters, automatically trading off fit vs complexity. Pick the K with the lowest BIC.
            </Analogy>

            <Analogy label="What comes next — learning with labels">
                k-Means and GMM-EM work with unlabeled data — no one tells the algorithm which group is which. But many real problems come with labels: this email is spam, this patient survived, this loan defaulted. Starting in 1979, a new generation of algorithms learned to discover decision rules from labeled examples, one yes/no question at a time. That is Chapter 4: Decision Trees.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Maximum likelihood for latent variable models</h2>

            <p>
                A Gaussian Mixture Model assumes each observation x<sub>n</sub> was generated by: (1) choosing a component k ~ Categorical(&pi;<sub>1</sub>,...,&pi;<sub>K</sub>), then (2) sampling x<sub>n</sub> ~ &Nscr;(&mu;<sub>k</sub>, &Sigma;<sub>k</sub>). The marginal density integrates out the hidden component assignment:
            </p>
            <MathBlock tex="p(x \mid \theta) = \sum_{k=1}^K \pi_k\, \mathcal{N}(x \mid \mu_k, \Sigma_k)" />
            <p>
                where &pi;<sub>k</sub> &ge; 0 are mixing weights with &sum;<sub>k</sub> &pi;<sub>k</sub> = 1, and &theta; = &#123;&pi;<sub>k</sub>, &mu;<sub>k</sub>, &Sigma;<sub>k</sub>&#125;<sub>k=1..K</sub>.
            </p>

            <h3>The EM Algorithm for GMMs</h3>
            <p>
                <strong>E-step:</strong> Compute the posterior responsibility of component k for data point n, using Bayes' rule:
            </p>
            <MathBlock tex="r_{nk} = \frac{\pi_k\, \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j\, \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}" />
            <p>
                <strong>M-step:</strong> Update parameters as weighted sufficient statistics. Let N<sub>k</sub> = &sum;<sub>n</sub> r<sub>nk</sub> (the effective number of points assigned to component k):
            </p>
            <MathBlock tex="\mu_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk}\, x_n" />
            <MathBlock tex="\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk}\, (x_n - \mu_k)(x_n - \mu_k)^\top" />
            <MathBlock tex="\pi_k^{\text{new}} = \frac{N_k}{N}" />

            <h3>Relationship to k-Means</h3>
            <p>
                GMM/EM is the soft-assignment generalisation of k-means. When all &Sigma;<sub>k</sub> = &sigma;<sup>2</sup>I and &sigma;<sup>2</sup> &rarr; 0, the responsibilities r<sub>nk</sub> converge to hard 0/1 assignments, and the M-step means update becomes the k-means centroid update. GMM handles elliptical clusters and fractional memberships; k-means is the special case of equal-spherical covariances with hard assignment.
            </p>

            <h3>Model Selection — BIC and AIC</h3>
            <p>
                Unlike k-means, GMMs have a proper likelihood, enabling formal model selection:
            </p>
            <MathBlock tex="\text{BIC} = -2\ln\hat{L} + p\ln N \qquad \text{AIC} = -2\ln\hat{L} + 2p" />
            <p>
                where p = number of free parameters = K&middot;(d + d(d+1)/2 + 1) &minus; 1 for full-covariance GMMs, and N is the number of data points. BIC penalises complexity more heavily than AIC and is preferred when the goal is model identification. Choose the K with the lowest BIC.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Covariance constraints:</strong> Full covariance (&Sigma;<sub>k</sub> arbitrary) is most flexible but requires O(Kd<sup>2</sup>) parameters. Diagonal (&Sigma;<sub>k</sub> = diag(&sigma;<sub>k1</sub><sup>2</sup>,...)) restricts to axis-aligned ellipses. Tied (all components share one &Sigma;) reduces parameters dramatically. Spherical (&Sigma;<sub>k</sub> = &sigma;<sub>k</sub><sup>2</sup>I) is equivalent to soft k-means. Start with full covariance and use BIC to determine whether constraints are justified.
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
                    <span className="ch-expandable-desc">Implementation · scikit-learn · NumPy</span>
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
            <h2>EM as Coordinate Ascent on the ELBO</h2>

            <DefBlock label="Evidence Lower Bound (ELBO)">
                For any distribution q(Z) over the latent cluster assignments, Jensen's inequality gives:
                <br /><br />
                ln p(X|&theta;) &ge; &Escr;<sub>q</sub>[ln p(X,Z|&theta;)] &minus; &Escr;<sub>q</sub>[ln q(Z)] =: &Lscr;(q, &theta;)
                <br /><br />
                The ELBO &Lscr; lower-bounds the log-likelihood. EM maximises &Lscr; by alternating coordinate ascent: E-step maximises over q; M-step maximises over &theta;.
            </DefBlock>

            <h3>E-step: Maximise over q</h3>
            <p>
                The ELBO is maximised (tightly) when q(Z) = p(Z|X, &theta;<sup>old</sup>) — the posterior over assignments. At this point the bound is tight: &Lscr;(q, &theta;<sup>old</sup>) = ln p(X|&theta;<sup>old</sup>). In the GMM case the posterior factorises:
            </p>
            <MathBlock tex="q(z_n = k) = r_{nk} = p(z_n = k \mid x_n, \theta^{\text{old}})" />
            <p>
                After the E-step, there is no gap between the ELBO and the true log-likelihood. The next M-step can only increase the ELBO, which simultaneously increases the log-likelihood — this is the proof that EM never decreases the likelihood.
            </p>

            <h3>M-step: Maximise over &theta;</h3>
            <p>
                With q fixed, maximise the expected complete-data log-likelihood:
            </p>
            <MathBlock tex="Q(\theta, \theta^{\text{old}}) = \sum_n \sum_k r_{nk} \ln \bigl[\pi_k\, \mathcal{N}(x_n \mid \mu_k, \Sigma_k)\bigr]" />
            <p>
                Setting &part;Q/&part;&mu;<sub>k</sub> = 0 gives the weighted mean update. Setting &part;Q/&part;&Sigma;<sub>k</sub> = 0 (using the matrix derivative of log det) gives the weighted outer-product update. Setting &part;Q/&part;&pi;<sub>k</sub> = 0 with Lagrange multiplier for the constraint &sum;&pi;<sub>k</sub> = 1 gives &pi;<sub>k</sub> = N<sub>k</sub>/N. All three updates are closed-form — EM for GMMs never requires an inner optimisation loop.
            </p>

            <h3>Monotone Convergence Theorem</h3>
            <MathBlock tex="\ln p(X \mid \theta^{t+1}) \geq \ln p(X \mid \theta^t) \quad \forall\, t \geq 0" />
            <p>
                Proof sketch: After the E-step, &Lscr;(q<sup>t+1</sup>, &theta;<sup>t</sup>) = ln p(X|&theta;<sup>t</sup>). After the M-step, &theta;<sup>t+1</sup> = argmax<sub>&theta;</sub> &Lscr;(q<sup>t+1</sup>, &theta;) &ge; &Lscr;(q<sup>t+1</sup>, &theta;<sup>t</sup>) = ln p(X|&theta;<sup>t</sup>). Since ln p(X|&theta;<sup>t+1</sup>) &ge; &Lscr;(q<sup>t+1</sup>, &theta;<sup>t+1</sup>), the chain of inequalities gives the result.
            </p>

            <h3>Singularities and Practical Remedies</h3>
            <p>
                The GMM likelihood is unbounded: if a single-point cluster forms (&mu;<sub>k</sub> = x<sub>n</sub> for some n), its Gaussian density diverges as &Sigma;<sub>k</sub> &rarr; 0. Practical remedies:
            </p>
            <ul>
                <li>Regularise covariances: &Sigma;<sub>k</sub> &larr; &Sigma;<sub>k</sub> + &epsilon;I with &epsilon; ~ 10<sup>&minus;6</sup></li>
                <li>Use multiple restarts — degenerate initialisations usually fail fast</li>
                <li>Apply a Wishart prior on &Sigma;<sub>k</sub> (variational Bayes GMM) for automatic regularisation</li>
                <li>Detect collapsed components (N<sub>k</sub> &lt; d) and reinitialise them during optimisation</li>
            </ul>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# ── Generate synthetic data ────────────────────────────────────────
np.random.seed(42)
X, y_true = make_blobs(
    n_samples=300,
    centers=[[1.5, 4.7], [4.6, 4.3], [3.1, 1.5]],
    cluster_std=[0.7, 0.6, 0.5],
    random_state=42
)
X = StandardScaler().fit_transform(X)

# ── Fit GMM ────────────────────────────────────────────────────────
# covariance_type: "full", "tied", "diag", "spherical"
gmm = GaussianMixture(
    n_components=3,
    covariance_type="full",
    n_init=5,           # multiple restarts to avoid local optima
    reg_covar=1e-6,     # diagonal regularisation for stability
    random_state=42
)
gmm.fit(X)

labels = gmm.predict(X)             # hard assignments (argmax r_nk)
probs  = gmm.predict_proba(X)       # soft responsibilities (N x K)

print(f"Log-likelihood: {gmm.score(X) * len(X):.1f}")
print(f"AIC: {gmm.aic(X):.1f}")
print(f"BIC: {gmm.bic(X):.1f}")
print(f"Converged: {gmm.converged_},  iterations: {gmm.n_iter_}")

for k in range(3):
    print(f"Component {k}: pi={gmm.weights_[k]:.3f}, mu={gmm.means_[k].round(2)}")

# ── Model selection — pick K by BIC ───────────────────────────────
bics = []
for k in range(1, 9):
    gm = GaussianMixture(n_components=k, n_init=5, random_state=42)
    bics.append(gm.fit(X).bic(X))
best_k = 1 + int(np.argmin(bics))
print(f"Best K by BIC: {best_k}")  # -> 3

# ── Sampling from the fitted GMM ──────────────────────────────────
X_new, component_ids = gmm.sample(50)
print(f"Sampled 50 new points from {len(np.unique(component_ids))} components")

# ── NumPy from-scratch EM for GMMs ────────────────────────────────
def gmm_em(X, K, n_iter=100, reg=1e-6, seed=0):
    rng = np.random.default_rng(seed)
    N, D = X.shape

    # Initialise using k-means-like random assignment
    idx = rng.choice(N, K, replace=False)
    mu = X[idx].copy()
    Sigma = [np.eye(D) for _ in range(K)]
    pi = np.ones(K) / K

    def gauss_pdf(X, mu, Sigma):
        diff = X - mu
        L = np.linalg.cholesky(Sigma + reg * np.eye(D))
        alpha = np.linalg.solve(L, diff.T)   # (D, N)
        log_det = 2 * np.sum(np.log(np.diag(L)))
        log_p = -0.5 * (D * np.log(2 * np.pi) + log_det + np.sum(alpha**2, axis=0))
        return np.exp(log_p)

    for _ in range(n_iter):
        # E-step: responsibilities
        R = np.stack([pi[k] * gauss_pdf(X, mu[k], Sigma[k]) for k in range(K)], axis=1)
        R /= R.sum(axis=1, keepdims=True)

        # M-step: update parameters
        Nk = R.sum(axis=0)
        mu = [(R[:, k] @ X) / Nk[k] for k in range(K)]
        Sigma = [
            sum(R[n, k] * np.outer(X[n] - mu[k], X[n] - mu[k]) for n in range(N)) / Nk[k]
            for k in range(K)
        ]
        pi = Nk / N

    return R, mu, Sigma, pi

R, mu_np, _, pi_np = gmm_em(X, K=3)
print(f"NumPy GMM mixing weights: {np.round(pi_np, 3)}")`

function PythonContent() {
    return (
        <>
            <p>
                The code demonstrates GMM fitting with scikit-learn (including BIC model selection and sampling), followed by a from-scratch NumPy implementation of the full EM algorithm to illustrate the E-step and M-step concretely.
            </p>
            <CodeBlock code={PY_CODE} filename="gmm_em.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Covariance types:</strong> <code>full</code> allows each component its own arbitrary covariance ellipse (most flexible, most parameters); <code>diag</code> restricts to axis-aligned ellipses; <code>spherical</code> is equivalent to soft k-means (one variance per component); <code>tied</code> shares one covariance matrix across all components. Start with <code>full</code> and use BIC to determine whether simpler constraints are justified. The <code>reg_covar</code> parameter adds a small diagonal term to prevent singular covariance matrices.
            </div>
        </>
    )
}


export const GMM_EM_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
