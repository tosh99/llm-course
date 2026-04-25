import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The challenge</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1888",
            title: "Galton — Co-relations and the First Correlation Diagram",
            challenge:
                "Gauss's least squares gave the best line through two variables, but biologists studying heredity faced a deeper question. Francis Galton had been measuring hundreds of parents and their children, tracking heights, arm lengths, and skull measurements. He noticed that tall parents tended to have tall children — but not as tall as the parents. The relationship was real but imperfect. He needed a single number to describe how strongly two measurements moved together, independent of which one you called the predictor and which the outcome.",
            what:
                "Galton (1888) introduced the concept of 'co-relation' and drew the first correlation diagram — a scatter plot with an elliptical data cloud. He identified that the correlation was symmetric: the correlation of X with Y equals the correlation of Y with X. He also showed that the regression slope of Y on X equals r times the ratio of standard deviations, connecting correlation to least-squares regression. His measurement of correlation between a parent's height and a child's was approximately 0.5 — a number remarkably consistent with modern estimates.",
            impact:
                "Galton's co-relation established that relationships between variables could be quantified without postulating which caused which. This asymmetry-free measure was the first step toward the covariance matrix, which is the fundamental object of all multivariate statistics and the foundation of PCA. The insight that two measurements can 'move together' without one causing the other is the conceptual core of unsupervised learning.",
        },
        {
            year: "1896",
            title: "Pearson — The Product-Moment Correlation Coefficient",
            challenge:
                "Galton's co-relation was intuitive but lacked a precise formula with well-understood properties. Biometricians needed a quantity that was dimensionless (so height in inches and height in centimetres gave the same answer), bounded between -1 and +1 (so its magnitude was interpretable), and connected to the geometry of the data cloud. There was also no understanding of how the correlation coefficient related to the fraction of variance explained.",
            what:
                "Karl Pearson formalised the product-moment correlation coefficient r = Cov(X,Y) divided by (sigma-X times sigma-Y). He proved that r is bounded between -1 and +1, that r equals +1 iff Y is a perfectly increasing linear function of X, and crucially that r-squared equals the fraction of variance in Y explained by X — identical to R-squared in linear regression. He developed the sampling distribution of r under the null hypothesis of zero correlation, enabling significance testing.",
            impact:
                "Pearson's r is still the most widely used measure of linear association in science. Its connection to R-squared shows that correlation and regression are two faces of the same geometric object — the angle between vectors in the space of mean-centred data. More important for machine learning: it established covariance as the fundamental measure of joint variation. The covariance matrix — the generalisation to many variables — is the foundation of PCA, factor analysis, and the weight matrices of neural networks.",
        },
        {
            year: "1901",
            title: "Pearson — Principal Component Analysis as Low-Rank Approximation",
            challenge:
                "Biometricians were measuring dozens of variables per subject — skull dimensions, body proportions, reaction times. With 20 variables came 190 pairwise correlations: an incomprehensible tangle. Pearson asked: is there a small number of underlying 'causes' that explain most of the variation? And can we find them mathematically, without any prior knowledge about what those causes might be?",
            what:
                "Pearson's 1901 paper 'On Lines and Planes of Closest Fit to Systems of Points in Space' derived the first principal component as the direction in the high-dimensional data cloud that minimises the sum of squared perpendicular distances from each data point to the line. He showed this is equivalent to finding the direction that maximises the projected variance. He proved that this direction is the eigenvector of the covariance matrix corresponding to the largest eigenvalue, and that subsequent perpendicular components capture the next most variance.",
            impact:
                "PCA is the oldest dimensionality reduction technique and remains the most used. Pearson's framing — find the low-rank structure that best explains the data — directly prefigures the attention mechanism in Transformers (which computes low-rank projections of keys and values), the LoRA fine-tuning method (which approximates weight updates with low-rank matrices), and the Eckart-Young theorem (which proves SVD gives the best low-rank approximation to any matrix in Frobenius norm).",
        },
        {
            year: "1933",
            title: "Hotelling — Principal Components as a Statistical Method",
            challenge:
                "Pearson's derivation was geometric — it found the best-fitting line or plane — but it lacked a statistical framework. Psychologists measuring 'intelligence' needed a rigorous method to reduce many correlated test scores to a small number of interpretable factors, with clear criteria for how many components to retain and what fraction of variation each explained. Without a statistical framework, PCA was just a computational trick.",
            what:
                "Harold Hotelling reformulated PCA as the eigendecomposition of the sample covariance matrix, coined the term 'principal components', and developed the iterative power method for computing them numerically — the best algorithm available before digital computers. His 1933 paper introduced the concept of 'amount of variance explained' per component, enabling researchers to decide how many components to retain by looking at cumulative explained variance. He also showed that principal components are mutually uncorrelated and that their variances equal the eigenvalues.",
            impact:
                "Hotelling's formulation made PCA reproducible and statistically rigorous. The scree plot of explained variance per component — still used today to decide how many dimensions to keep — is a direct product of his framework. When a modern machine learning engineer uses PCA to visualise a word embedding space or compress a neural network's activations, they are implementing Hotelling's procedure on Pearson's geometric insight.",
        },
        {
            year: "1965",
            title: "Golub and Kahan — SVD as the Numerically Stable Foundation",
            challenge:
                "Computing eigenvalues of the covariance matrix X-transpose-X was numerically unstable on early computers when features had very different scales or when the data matrix was nearly rank-deficient. Forming X-transpose-X squares the condition number — a matrix with condition number 1000 has X-transpose-X with condition number 1,000,000 — making eigenvalues computed from X-transpose-X meaningless due to floating-point errors.",
            what:
                "Gene Golub and William Kahan developed a reliable numerical algorithm for the Singular Value Decomposition: X = U times Sigma times V-transpose. The right singular vectors (columns of V) are identical to the principal components, and the singular values equal the square root of n times each eigenvalue of the covariance matrix. SVD avoids forming X-transpose-X entirely, eliminating the squaring of condition numbers. Golub's bidiagonalisation algorithm (refined with Reinsch in 1970) is still the workhorse of LAPACK and every numerical linear algebra library.",
            impact:
                "SVD-based PCA is now the universal standard. Scikit-learn's PCA uses it. NumPy's linalg.svd uses it. The same SVD insight underlies matrix completion (Netflix Prize 2006), word embedding methods (Latent Semantic Analysis, GloVe), and LoRA fine-tuning for large language models — which explicitly decomposes weight update matrices into low-rank SVD factors with rank r much smaller than the matrix dimensions.",
        },
        {
            year: "1998 – present",
            title: "Kernel PCA, t-SNE, and Nonlinear Successors",
            challenge:
                "Standard PCA only captures linear structure. Images of a face rotating in space lie on a nonlinear manifold in pixel space — PCA cannot unroll it. Bioinformatics datasets with thousands of genes had variance structure that no linear projection could reveal. Researchers needed methods that could find curved low-dimensional structure in high-dimensional spaces.",
            what:
                "Scholkopf, Smola, and Muller (1998) extended PCA to nonlinear settings by replacing inner products with kernel functions k(x-i, x-j). This implicitly projects data into a potentially infinite-dimensional feature space and finds principal components there. Van der Maaten and Hinton (2008) developed t-SNE, which preserves neighbourhood structure rather than variance, giving clearer cluster separation. McInnes et al. (2018) developed UMAP, which runs much faster than t-SNE while preserving more global structure. Autoencoders learn nonlinear compressed representations, subsume PCA as the linear special case proved by Baldi and Hornik (1989).",
            impact:
                "These nonlinear methods are the standard tools for visualising the internal representations of neural networks. Every BERT embedding plot, every t-SNE visualisation of word vectors, every UMAP of biological single-cell data traces its intellectual lineage directly to Pearson's 1901 question: what is the most informative low-dimensional view of this data? The next step in our story is asking: how confident should we be in any pattern we find? That is the question of statistical inference.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>When one number isn't enough — finding hidden structure in many measurements</h2>

            <p className="ch-story-intro">
                Gauss gave us the best straight line through two variables. But what do you do when you have 50 measurements per person — height, weight, arm span, shoe size, reaction time — and you want to find the hidden structure? Pearson faced exactly this problem, and his answer became one of the most powerful ideas in all of data science.
            </p>

            <Analogy label="Correlation — do they move together?">
                Imagine you measure the height and shoe size of 1,000 people. Tall people tend to have bigger feet. Short people tend to have smaller feet. They <em>move together</em>. Pearson invented a number — the <strong>correlation coefficient r</strong> — to measure exactly how strongly two things move together.
                <br /><br />
                r = +1 means they move perfectly together (tall always means big feet). r = -1 means perfectly opposite (tall always means small feet). r = 0 means no relationship at all. In real data you rarely get exactly +1 or -1, but the closer to those extremes, the stronger the relationship. Crucially, r is the same whether you ask "does height predict shoe size?" or "does shoe size predict height?" — correlation is symmetric.
            </Analogy>

            <Analogy label="The problem with many variables">
                Now imagine measuring 50 things per person. That gives you 50 times 49 divided by 2 = 1,225 pairs to check. Most of them are correlated with each other (height correlates with arm span, which correlates with shoe size, which correlates with leg length...). How do you summarise all of this without going mad?
                <br /><br />
                Pearson's answer: find a <em>new direction</em> through the data cloud that captures the most variation. That direction is the <strong>first principal component</strong>. It is a weighted combination of all 50 original features — the single number that tells you the most about a person given everything you measured.
            </Analogy>

            <Analogy label="PCA — the best angle to photograph a data cloud">
                Imagine your data is a long cigar-shaped cloud of points floating in 50-dimensional space. If you photograph it from the side, it looks like a flat oval — you lose the length. If you photograph it from the long end, it looks like a tiny dot — you lose everything.
                <br /><br />
                PCA finds the <strong>best angle</strong> — the one that shows the cloud stretched out the longest. That direction is PC1. PC2 is the next-best direction, perpendicular to PC1. Together, just two directions can often summarise 80-90% of everything interesting about 50-dimensional data — turning a problem with 50 numbers into one with 2.
            </Analogy>

            <Analogy label="The mathematics — eigenvectors of the covariance matrix">
                Here is where Pearson's geometric insight becomes precise. Build a 50-by-50 table where entry (i, j) is the correlation between feature i and feature j. This is the <strong>covariance matrix</strong>. Its most important direction — the eigenvector with the largest eigenvalue — is PC1. The eigenvalue tells you how much variance that direction captures.
                <br /><br />
                Eigenvalues and eigenvectors are the exact tools from linear algebra (Chapter 0) that describe a matrix's most important directions. PCA uses them to compress a 50-dimensional cloud into its 2 or 3 most important directions.
            </Analogy>

            <Analogy label="What does this have to do with AI?">
                When a neural network learns to understand images, each layer creates a representation of the image in a high-dimensional space — thousands of numbers. To understand what the network has learned, researchers use PCA and its successors (t-SNE, UMAP) to project this down to 2D and visualise it. It's how we know that networks group visually similar pictures near each other — even though they were never told what "similar" means.
                <br /><br />
                PCA also shows up in LoRA — the technique used to fine-tune large language models cheaply. LoRA works precisely because the important changes to a model's weights live in a low-dimensional subspace, just as Pearson guessed in 1901.
            </Analogy>

            <Analogy label="What comes next — is this pattern real?">
                We can now measure relationships (correlation) and compress data (PCA). But there is a dangerous trap: if you measure enough things, some will appear correlated by chance. A study with 50 variables has 1,225 correlations to check — even if all variables are completely independent, roughly 61 of those correlations will look significant just by random luck at the 5% level. Statistical inference is the branch of mathematics that tells us how to distinguish real patterns from lucky coincidences.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Covariance, correlation, and principal components</h2>

            <h3>The Covariance Matrix</h3>
            <p>
                For a data matrix X in R-to-the-n-by-p (n samples, p features), first centre: X-tilde = X minus mean(X). The <strong>sample covariance matrix</strong> is:
            </p>
            <MathBlock tex="C = \frac{1}{n-1} \tilde{X}^\top \tilde{X} \in \mathbb{R}^{p \times p}" />
            <p>
                Entry C-ij = Cov(X-i, X-j): the covariance between features i and j. The diagonal contains variances. The <strong>Pearson correlation</strong> normalises by standard deviations to give a dimensionless quantity:
            </p>
            <MathBlock tex="r_{ij} = \frac{C_{ij}}{\sqrt{C_{ii} \cdot C_{jj}}} \in [-1, 1]" />

            <h3>PCA — Maximising Projected Variance</h3>
            <p>
                Find the unit vector w<sub>1</sub> that maximises the variance of the projection X-tilde times w:
            </p>
            <MathBlock tex="w_1 = \arg\max_{\|w\|=1} \text{Var}(\tilde{X}w) = \arg\max_{\|w\|=1} w^\top C w" />
            <p>
                By Lagrange multipliers, the solution satisfies Cw = lambda-w. So w<sub>1</sub> is the eigenvector of C with the largest eigenvalue lambda<sub>1</sub>. Each subsequent component w<sub>k</sub> is the eigenvector with the k-th largest eigenvalue, subject to orthogonality with the previous components.
            </p>

            <DefBlock label="PCA Algorithm">
                Step 1: Centre — X-tilde = X minus mean(X, axis=0)<br />
                Step 2: Compute covariance — C = X-tilde-transpose times X-tilde divided by (n minus 1)<br />
                Step 3: Eigendecompose — C = V times Lambda times V-transpose (eigenvalues in descending order)<br />
                Step 4: Project — Z = X-tilde times V-k (top-k eigenvectors)<br />
                <br />
                Equivalently (numerically stable): compute SVD of X-tilde = U times Sigma times V-transpose directly. Principal components = columns of V. Eigenvalues lambda-i = sigma-i-squared divided by (n minus 1).
            </DefBlock>

            <h3>Explained Variance and the Scree Plot</h3>
            <p>
                The fraction of total variance captured by the top-k components:
            </p>
            <MathBlock tex="\text{Explained variance ratio} = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^p \lambda_i}" />
            <p>
                Plot this on a "scree plot" to choose k: look for the "elbow" where adding more components gives diminishing returns. A common heuristic is to retain enough components to explain 80-95% of total variance.
            </p>

            <h3>PCA Minimises Reconstruction Error</h3>
            <p>
                The k-component reconstruction X-hat = Z times V-k-transpose + mean has the smallest possible mean-squared reconstruction error among all linear projections to k dimensions (Eckart-Young theorem). This is why PCA is optimal for linear compression.
            </p>
            <MathBlock tex="\min_{\text{rank-}k\; A} \|X - A\|_F^2 = \sum_{i=k+1}^p \sigma_i^2" />
            <p>
                The minimum reconstruction error equals the sum of the discarded singular values squared. SVD is the unique solution.
            </p>

            <h3>Key Assumptions and Limitations</h3>
            <ul>
                <li><strong>Linear only:</strong> PCA captures linear correlations. Non-linear manifolds require kernel PCA, t-SNE, or UMAP</li>
                <li><strong>Scale sensitive:</strong> always standardise features to unit variance before PCA unless all features share the same units</li>
                <li><strong>Interpretability:</strong> principal components are mixtures of all original features and may not have clear real-world meaning</li>
                <li><strong>Unsupervised:</strong> PCA ignores the output label — it may not find the dimensions most useful for prediction</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Connection to deep learning:</strong> A linear autoencoder (encoder W<sub>e</sub> from R-to-the-p to R-to-the-k, decoder W<sub>d</sub> from R-to-the-k to R-to-the-p, trained to minimise MSE) learns the same subspace as PCA — proved by Baldi &amp; Hornik (1989). Deep nonlinear autoencoders generalise this to curved manifolds. LoRA fine-tuning represents weight updates as W = W<sub>0</sub> + BA where B is in R-to-the-m-by-r and A is in R-to-the-r-by-n — explicitly forcing updates to live in a low-rank (PCA-like) subspace with r much less than the minimum of m and n.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Eckart-Young theorem · SVD · kernel PCA</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">NumPy SVD · sklearn PCA · t-SNE visualisation</span>
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
            <h2>PCA: Formal Derivation and Optimality</h2>

            <DefBlock label="PCA as Variance Maximisation">
                Given centred data X-tilde in R-to-the-n-by-p, find unit vector w to maximise the variance of the projection: Var(X-tilde times w) = w-transpose times C times w, where C = X-tilde-transpose times X-tilde divided by (n minus 1) is the sample covariance matrix. By Lagrange multipliers (subject to w-transpose w = 1), the solution is an eigenvector of C. The maximum variance achievable is the largest eigenvalue lambda<sub>1</sub>.
            </DefBlock>

            <h3>The Eckart-Young Theorem</h3>
            <p>
                Given SVD X = U times Sigma times V-transpose, the best rank-k approximation in Frobenius norm is:
            </p>
            <MathBlock tex="\hat{X}_k = U_k \Sigma_k V_k^\top = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top" />
            <MathBlock tex="\|X - \hat{X}_k\|_F^2 = \sum_{i=k+1}^{\min(n,p)} \sigma_i^2" />
            <p>
                This is the minimum possible error over all rank-k matrices. The PCA projection is exactly this best rank-k approximation — the k directions that capture the most variance are the k directions that minimise reconstruction error.
            </p>

            <h3>Kernel PCA</h3>
            <p>
                Standard PCA computes the linear kernel matrix K = X-tilde times X-tilde-transpose (entries k-ij = x-i-dot-x-j). Kernel PCA replaces this with a general kernel: k-ij = k(x-i, x-j) for any positive definite kernel. The eigenvectors of K in the feature space give nonlinear principal components. Examples:
            </p>
            <MathBlock tex="k_{\text{poly}}(x_i, x_j) = (x_i^\top x_j + c)^d \quad k_{\text{RBF}}(x_i, x_j) = \exp\!\left(-\frac{\|x_i - x_j\|^2}{2\sigma^2}\right)" />
            <p>
                Kernel PCA can unfold nonlinear manifolds that standard PCA cannot represent. However, the kernel matrix is n-by-n, so kernel PCA has computational cost O(n<sup>3</sup>) — prohibitive for large n.
            </p>

            <h3>PCA and the Autoencoder</h3>
            <p>
                A linear autoencoder with encoder W<sub>e</sub> and decoder W<sub>d</sub> trained to minimise:
            </p>
            <MathBlock tex="\min_{W_e, W_d} \|X - X W_e W_d\|_F^2" />
            <p>
                The optimal solution has W<sub>e</sub> = V<sub>k</sub> (top-k eigenvectors) and W<sub>d</sub> = V<sub>k</sub>-transpose. The learned representation Z = X times W<sub>e</sub> is exactly the PCA projection. Deep nonlinear autoencoders generalise this: they learn curved manifolds, not just linear subspaces — the fundamental reason autoencoders are more powerful than PCA for complex data.
            </p>

            <div className="ch-callout">
                <strong>LoRA connection:</strong> LoRA (Hu et al., 2021) fine-tunes a pretrained weight matrix W<sub>0</sub> by adding a low-rank update: W = W<sub>0</sub> + B times A, where B is m-by-r and A is r-by-n with r much less than both m and n. This is exactly the Eckart-Young claim: important weight changes live in a low-rank subspace. Empirically, r = 4 or r = 8 suffices for many tasks — meaning the relevant update has only 4-8 independent directions in a matrix with millions of entries.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

# ── Synthetic data: 3D cloud with clear structure ────────────────────────────
# True structure: 2D plane embedded in 3D with noise
n = 200
# Two latent factors
z1 = np.random.randn(n)
z2 = np.random.randn(n)
# Observed features: linear combinations of latent factors + noise
X = np.column_stack([
    2*z1 + 0.5*z2 + 0.1*np.random.randn(n),
    1*z1 - 1*z2 + 0.1*np.random.randn(n),
    0.5*z1 + 2*z2 + 0.1*np.random.randn(n),
])
print(f"Data shape: {X.shape}")

# ── PCA via numpy SVD ────────────────────────────────────────────────────────
X_centred = X - X.mean(axis=0)
U, sigma, Vt = np.linalg.svd(X_centred, full_matrices=False)

# Principal components (rows of Vt)
print("\\nPrincipal component directions (rows = PCs):")
print(Vt.round(3))

# Explained variance
eigenvalues = sigma**2 / (n - 1)
explained = eigenvalues / eigenvalues.sum()
print("\\nExplained variance per PC:", explained.round(3))
print(f"Top 2 PCs explain {explained[:2].sum():.1%} of variance")

# Project onto top 2 PCs
Z = X_centred @ Vt[:2].T   # (n, 2) projected data
print(f"Reduced data shape: {Z.shape}")

# ── sklearn PCA for comparison ───────────────────────────────────────────────
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)
Z_sk = pca.fit_transform(X_scaled)
print("\\nsklearn explained variance ratios:", pca.explained_variance_ratio_.round(3))

# ── Reconstruction error ────────────────────────────────────────────────────
k = 2
X_reconstructed = Z @ Vt[:k] + X.mean(axis=0)
mse = np.mean((X - X_reconstructed)**2)
print(f"\\nReconstruction MSE (k={k}): {mse:.6f}")

# Eckart-Young: should equal sum of discarded sigma^2
ey_error = (sigma[k:]**2).sum() / X_centred.size
print(f"Eckart-Young bound:        {ey_error:.6f}")

# ── Correlation matrix ────────────────────────────────────────────────────────
C = np.corrcoef(X.T)
print("\\nCorrelation matrix:")
print(C.round(3))`

function PythonContent() {
    return (
        <>
            <p>
                NumPy SVD gives PCA directly without forming the covariance matrix — more numerically stable and efficient. The Eckart-Young bound confirms the reconstruction error equals the sum of discarded singular values squared.
            </p>
            <CodeBlock code={PY_CODE} filename="correlation_pca.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Always standardise features to unit variance before PCA when they have different units or scales — otherwise variables with larger numerical ranges dominate the first principal component regardless of their actual importance.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const CORRELATION_PCA_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
