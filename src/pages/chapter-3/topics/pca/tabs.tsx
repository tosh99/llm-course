import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { PCADiagram, ScreePlot } from "./diagrams"
import type { TabId } from "../../types"

// ── PCA tabs ─────────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1901",
            title: "Karl Pearson — On Lines and Planes of Closest Fit",
            challenge: "Pearson was studying correlated biological measurements and needed a way to find the single line (or plane) through a cloud of points that best approximated all the data — minimising orthogonal (perpendicular) distances to the line rather than vertical residuals as in regression.",
            what: "Pearson derived the first principal component as the direction of maximum variance in the data, equivalent to the eigenvector corresponding to the largest eigenvalue of the data covariance matrix. He showed that successive perpendicular principal components capture decreasing fractions of the total variance.",
            impact: "Pearson's 1901 paper is the founding document of PCA. His derivation via orthogonal regression is geometrically elegant and shows PCA minimises reconstruction error — a fact that connected it to autoencoders nearly a century later.",
        },
        {
            year: "1933",
            title: "Harold Hotelling — Formalises PCA as Statistical Method",
            challenge: "Pearson's geometric construction lacked a statistical framework. Social scientists needed a rigorous method to reduce many correlated psychological test scores to a smaller number of interpretable 'factors' representing underlying constructs like intelligence or extroversion.",
            what: "Hotelling introduced PCA in the statistical literature as an eigendecomposition of the correlation matrix. He coined the term 'principal components' and developed the computational procedure for finding them via iterative power methods — the best available technique before computers.",
            impact: "Hotelling's formulation made PCA a core tool in the social sciences for the next 50 years. His use of PCA to discover 'latent factors' directly inspired factor analysis, which remains central to psychometrics and social science research.",
        },
        {
            year: "1965",
            title: "Golub — SVD and Numerical Stability",
            challenge: "Computing eigenvalues of the covariance matrix XᵀX is numerically unstable when features have very different scales or when there are many features. Direct eigendecomposition was prone to catastrophic cancellation errors on early computers.",
            what: "Gene Golub and William Kahan developed reliable numerical algorithms for the Singular Value Decomposition (SVD). Since PCA can be computed directly from SVD of the data matrix (without forming the covariance matrix XᵀX), this resolved the numerical stability problem. Golub's Golub-Reinsch algorithm is still used in LAPACK today.",
            impact: "SVD-based PCA is now the standard implementation in every numerical library. It is more numerically stable than eigendecomposition of XᵀX and, for tall-thin matrices (many samples, few features), also faster.",
        },
        {
            year: "2000",
            title: "Kernel PCA and the Rise of Nonlinear Methods",
            challenge: "Standard PCA only captures linear structure — it cannot find non-linear manifolds. A dataset of face images in different poses lies on a curved manifold in pixel space, which linear PCA cannot unfold.",
            what: "Schölkopf, Smola, and Müller extended PCA to non-linear settings using the kernel trick: replace the inner products in PCA with a kernel function k(xᵢ, xⱼ) that implicitly maps data into a high-dimensional feature space. The principal components in that feature space are non-linear in the original input space.",
            impact: "Kernel PCA opened the door to non-linear dimensionality reduction. It directly inspired t-SNE (2008), UMAP (2018), and the manifold learning methods used today to visualise embeddings from deep learning models.",
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
            <h2>Finding the best angle to photograph a cloud of data</h2>

            <Analogy label="The core problem">
                Imagine you have data with 100 measurements per person — height, weight, shoe size, arm span, leg length... all correlated. You want to summarise each person with just 2 numbers. Which 2 numbers best capture the most information?
            </Analogy>

            <Analogy label="Spreading out vs squishing together">
                Think of a long, thin cloud of points in 2D — like a cigar tilted at 45°. If you project all the points onto the horizontal axis, you lose a lot of information (the cloud smears into a narrow blob). But if you project onto the long axis of the cigar, you preserve most of the variation. <strong>PCA finds that "best angle"</strong> — the direction where the projected data spreads out the most.
            </Analogy>

            <DiagramBlock title="PCA — PC1 captures maximum variance, PC2 is perpendicular">
                <PCADiagram />
            </DiagramBlock>

            <Analogy label="Multiple components">
                The first direction (PC1) captures the most spread. The second direction (PC2) is <em>perpendicular</em> to the first and captures the next most spread. And so on. Together they are like the axes of the best-fitting ellipse around your data cloud.
            </Analogy>

            <Analogy label="How much do we need?">
                After computing all principal components, you can see how much of the total variation each one captures. A <strong>scree plot</strong> shows this. Usually the first 2–3 components capture 80–90% of all the variance, and you can safely throw away the rest.
            </Analogy>

            <DiagramBlock title="Scree plot — explained variance per component (dashed = cumulative)">
                <ScreePlot />
            </DiagramBlock>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Finding maximum-variance directions via eigendecomposition</h2>

            <p>
                Given n data points in ℝᵈ, PCA finds an ordered set of orthogonal directions (principal components) that maximise the projected variance. The first component captures the most variance; each subsequent component is perpendicular to all previous ones and captures the next most.
            </p>

            <h3>Algorithm</h3>
            <ol>
                <li><strong>Centre the data:</strong> X̃ = X − mean(X) (subtract the column means)</li>
                <li><strong>Compute the covariance matrix:</strong> C = (1/n) X̃ᵀX̃ ∈ ℝᵈˣᵈ</li>
                <li><strong>Eigendecompose C:</strong> C = VΛVᵀ where V has eigenvectors as columns and Λ = diag(λ₁ ≥ λ₂ ≥ ... ≥ λ_d)</li>
                <li><strong>Project:</strong> Z = X̃V_k where V_k contains the top-k eigenvectors</li>
            </ol>

            <h3>Explained Variance</h3>
            <p>
                Eigenvalue λᵢ equals the variance of the data projected onto the iᵗʰ principal component. Fraction of variance explained by the first k components:
            </p>
            <MathBlock tex="\text{Explained variance ratio}_k = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^d \lambda_i}" />

            <h3>SVD Approach (Preferred)</h3>
            <p>
                Equivalently, compute the SVD of the centred data matrix X̃ = UΣVᵀ. The right singular vectors (columns of V) are the principal components. The singular values σᵢ = √(nλᵢ). This approach avoids forming XᵀX and is numerically more stable.
            </p>

            <h3>Key Properties</h3>
            <ul>
                <li><strong>PCA minimises reconstruction error</strong> — the k-component reconstruction X̂ = Z·Vₖᵀ + mean has the smallest possible mean-squared reconstruction error among all linear projections to k dimensions</li>
                <li><strong>Decorrelates features</strong> — the projected features Z have zero covariance (they are uncorrelated)</li>
                <li><strong>Sensitive to scale</strong> — always standardise features to unit variance before PCA unless all features are in the same units</li>
                <li><strong>Linear only</strong> — PCA cannot capture non-linear structure; use t-SNE or UMAP for that</li>
            </ul>


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
            <h2>Formal Derivation</h2>

            <DefBlock label="PCA Optimisation Problem">
                Find unit vectors w₁,...,wₖ ∈ ℝᵈ (the principal components) that maximise the projected variance:
                <br /><br />
                w₁ = argmax_&#123;‖w‖=1&#125; Var(X̃w) = argmax_&#123;‖w‖=1&#125; wᵀCw
                <br /><br />
                subject to wᵢ ⊥ wⱼ for i ≠ j, where C = (1/n)X̃ᵀX̃ is the sample covariance matrix.
            </DefBlock>

            <h3>Solution via Lagrange Multipliers</h3>
            <p>
                Maximise wᵀCw subject to ‖w‖² = 1. The Lagrangian is:
            </p>
            <MathBlock tex="\mathcal{L}(w, \lambda) = w^\top C w - \lambda(w^\top w - 1)" />
            <p>
                Taking the gradient and setting to zero: Cw = λw. So the optimal w is an eigenvector of C, and the maximised variance equals the corresponding eigenvalue λ. To maximise wᵀCw, choose the eigenvector with the largest eigenvalue.
            </p>

            <h3>Full Spectral Decomposition</h3>
            <p>
                Since C is symmetric positive semi-definite, it has a full set of n real non-negative eigenvalues λ₁ ≥ λ₂ ≥ ... ≥ λ_d ≥ 0 with orthonormal eigenvectors V = [v₁,...,v_d]:
            </p>
            <MathBlock tex="C = V \Lambda V^\top = \sum_{i=1}^d \lambda_i v_i v_i^\top" />
            <p>
                Projecting onto the top-k eigenvectors gives the k-dimensional representation that minimises reconstruction error (Eckart-Young theorem).
            </p>

            <h3>Connection to Autoencoders</h3>
            <p>
                A linear autoencoder (encoder: ℝᵈ → ℝᵏ, decoder: ℝᵏ → ℝᵈ, both linear, trained to minimise MSE) converges to the same subspace as PCA. The encoder weights span the same column space as the top-k principal components. This connection — proved rigorously by Baldi & Hornik (1989) — motivated the development of deep, non-linear autoencoders.
            </p>
            <MathBlock tex="\min_{W_e, W_d} \|X - X W_e W_d\|_F^2 \iff \text{columns of } W_e \text{ span the top-}k\text{ PCA subspace}" />
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_digits

# ── Load high-dimensional data — 64D digit images ─────────────────
digits = load_digits()
X = digits.data   # (1797, 64)
y = digits.target

# Always standardise before PCA (here pixels are similar scale,
# but in general features may differ by orders of magnitude)
X_scaled = StandardScaler().fit_transform(X)

# ── Fit PCA ────────────────────────────────────────────────────────
pca = PCA(n_components=0.95, svd_solver="full")  # keep 95% variance
X_pca = pca.fit_transform(X_scaled)

print(f"Original: {X.shape}")
print(f"Reduced: {X_pca.shape}")
print(f"Components kept: {pca.n_components_}")
print(f"Variance explained: {pca.explained_variance_ratio_.sum():.3f}")

# Scree plot data
for i, ev in enumerate(pca.explained_variance_ratio_[:10]):
    bar = "█" * int(ev * 200)
    print(f"  PC{i+1:2d}: {ev:.3f}  {bar}")

# ── Reconstruction error ───────────────────────────────────────────
X_reconstructed = pca.inverse_transform(X_pca)
mse = np.mean((X_scaled - X_reconstructed) ** 2)
print(f"Reconstruction MSE: {mse:.4f}")

# ── Inspect principal components ───────────────────────────────────
# Each row of pca.components_ is a principal component in original space
# For digits, reshape to 8x8 image to visualise "eigendigits"
# plt.imshow(pca.components_[0].reshape(8, 8))`

function PythonContent() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="pca.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Practical tips:</strong> Use <code>n_components=0.95</code> to automatically keep enough components for 95% explained variance. For very large datasets (millions of samples), use <code>TruncatedSVD</code> (randomised SVD — no need to centre the data) or <code>IncrementalPCA</code> for out-of-core processing. Visualise embeddings with the first two PCs or combine with t-SNE for high-dimensional data.
            </div>
        </>
    )
}




export const PCA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
