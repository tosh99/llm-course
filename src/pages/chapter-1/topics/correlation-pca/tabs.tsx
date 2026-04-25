import { Analogy, DefBlock, MathBlock } from "../../shared"
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
            year: "1888 – 1896",
            title: "Galton & Pearson — The Birth of Correlation",
            challenge:
                "Gauss's least squares gave us the best line through two variables. But biologists studying heredity faced a deeper question: how do you quantify the strength of a relationship between two measurements — not just fit a line, but measure whether they move together at all? Francis Galton had noticed that tall fathers tend to have shorter sons — the 'regression to mediocrity'. He needed a number for this tendency.",
            what:
                "Francis Galton (1888) coined 'co-relation' and drew the first correlation diagram. Karl Pearson formalised it in 1896 as the product-moment correlation coefficient r = Cov(X,Y) / (σ_X · σ_Y), ranging from −1 (perfect inverse) to +1 (perfect positive). He showed r² equals the fraction of variance in Y explained by X — connecting correlation directly to Gauss's least squares.",
            impact:
                "Pearson's r is still the most widely used measure of linear association in science. More important for machine learning: it established covariance as the fundamental measure of joint variation. The covariance matrix — the generalisation to many variables — is the foundation of PCA, factor analysis, and the weight matrices of neural networks.",
        },
        {
            year: "1901",
            title: "Pearson — Principal Component Analysis",
            challenge:
                "Biometricians were measuring dozens of variables per subject — skull dimensions, body proportions, reaction times. With 20 variables came 190 pairwise correlations: an incomprehensible tangle. Pearson asked: is there a small number of underlying 'causes' that explain most of the variation? And can we find them mathematically, not by guessing?",
            what:
                "Pearson's 1901 paper 'On Lines and Planes of Closest Fit' derived the first principal component: the direction in the high-dimensional data cloud that maximises the projected variance. He showed it is the eigenvector of the covariance matrix corresponding to the largest eigenvalue. Subsequent perpendicular components capture the next most variance, and so on. Projecting data onto the top-k components compresses it while preserving the most information.",
            impact:
                "PCA is the oldest dimensionality reduction technique and remains the most used. It directly prefigures the attention mechanism in transformers (which computes low-rank projections of keys and values), the LoRA fine-tuning method (which approximates weight updates with low-rank matrices), and the Eckart-Young theorem (which proves SVD gives the best low-rank approximation to any matrix).",
        },
        {
            year: "1933",
            title: "Hotelling — PCA as a Statistical Method",
            challenge:
                "Pearson's derivation was geometric and lacked a statistical framework. Psychologists measuring 'intelligence' needed a rigorous method to reduce many correlated test scores to a small number of interpretable factors — not just a geometric construction but a method with sampling distributions and tests of significance.",
            what:
                "Harold Hotelling reformulated PCA as the eigendecomposition of the sample correlation matrix, coined the term 'principal components', and developed computational procedures using iterative power methods — the best available before digital computers. His paper made PCA a standard tool of the social sciences and introduced the concept of 'amount of variance explained' as a criterion for how many components to retain.",
            impact:
                "Hotelling's formulation made PCA reproducible and computable. The 'scree plot' of explained variance per component — still used today to decide how many dimensions to keep — is a direct product of his framework. When a modern engineer trains a neural network and uses PCA to visualise the embedding space, they are using Hotelling's procedure.",
        },
        {
            year: "1965",
            title: "Golub — SVD as the Numerically Stable PCA",
            challenge:
                "Computing eigenvalues of the covariance matrix XᵀX was numerically unstable when features had very different scales or when the data matrix was nearly rank-deficient. Early computers introduced catastrophic rounding errors that made the results meaningless.",
            what:
                "Gene Golub and William Kahan developed a reliable numerical algorithm for the Singular Value Decomposition (SVD): X = UΣVᵀ. The right singular vectors (columns of V) are identical to the principal components, and the singular values equal √(n·λᵢ) where λᵢ are the eigenvalues of the covariance matrix. SVD avoids forming XᵀX entirely, eliminating the squaring of condition numbers that caused numerical instability. Golub's algorithm (refined with Reinsch in 1970) is still the workhorse of LAPACK.",
            impact:
                "SVD-based PCA is now the universal standard. sklearn's PCA uses it. NumPy's linalg.svd uses it. The same SVD insight underlies matrix completion (Netflix Prize 2006), word embedding methods (LSA, GloVe), and the LoRA fine-tuning technique for large language models — which explicitly decomposes weight update matrices into low-rank SVD factors.",
        },
        {
            year: "2000 – present",
            title: "Kernel PCA and Nonlinear Successors",
            challenge:
                "Standard PCA only captures linear structure. Images of a face rotating in space lie on a nonlinear manifold in pixel space — PCA unfolds the wrong shape. Bioinformatics datasets with thousands of genes and hundreds of samples had variance structure that no linear projection could reveal.",
            what:
                "Schölkopf, Smola, and Müller (1998) extended PCA to nonlinear settings by replacing inner products with kernel functions k(xᵢ, xⱼ). This implicitly projects data into a potentially infinite-dimensional feature space and finds principal components there. Later, t-SNE (van der Maaten & Hinton, 2008) and UMAP (McInnes et al., 2018) used neighbourhood preservation rather than variance maximisation, giving better separation of natural clusters. In deep learning, autoencoders learn nonlinear compressed representations that subsume PCA as the linear special case.",
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
            <h2>When one number isn't enough — finding patterns in many measurements</h2>

            <p className="ch-story-intro">
                Gauss gave us the best straight line through two variables. But what do you do when you have 50 measurements per person — height, weight, arm span, shoe size, reaction time — and you want to find the hidden structure? Pearson faced exactly this problem, and his answer became one of the most powerful ideas in all of data science.
            </p>

            <Analogy label="Correlation — do they move together?">
                Imagine you measure the height and shoe size of 1,000 people. Tall people tend to have bigger feet. Short people tend to have smaller feet. They <em>move together</em>. Pearson invented a number — the <strong>correlation coefficient r</strong> — to measure exactly how strongly two things move together.
                <br /><br />
                r = +1 means they move perfectly together (tall → big feet, always). r = −1 means perfectly opposite. r = 0 means no relationship at all. In real data, you rarely get exactly +1 or −1, but the closer to those extremes, the stronger the relationship.
            </Analogy>

            <Analogy label="The problem with many variables">
                Now imagine measuring 50 things per person. That gives you 50×49/2 = 1,225 pairs to check. Most of them are correlated with each other (height correlates with arm span, which correlates with shoe size, which correlates with leg length...). How do you summarise all of this?
                <br /><br />
                Pearson's answer: find a <em>new direction</em> through the data cloud that captures the most variation. He called this the <strong>first principal component</strong>.
            </Analogy>

            <Analogy label="PCA — the best angle to photograph a data cloud">
                Imagine your data is a long cigar-shaped cloud of points floating in space. If you photograph it from the side, it looks like a flat oval — you lose the length. If you photograph it from the end-on direction, it looks like a tiny dot — you lose everything.
                <br /><br />
                PCA finds the <strong>best angle</strong> — the one that shows the cloud stretched out longest. That direction is PC1 (first principal component). PC2 is the next-best direction, perpendicular to PC1. Together, just two directions can often summarise 80-90% of everything interesting about 50-dimensional data.
            </Analogy>

            <Analogy label="What does this have to do with AI?">
                When a neural network learns to understand images, each layer creates a representation of the image in a high-dimensional space (thousands of numbers). To understand what the network has learned, researchers use PCA and its successors (t-SNE, UMAP) to project this down to 2D and visualise it. It's how we know that networks trained on images group visually similar pictures near each other — even though they were never told what 'similar' means.
                <br /><br />
                PCA also shows up in LoRA — the technique used to fine-tune large language models cheaply, which works precisely because the important changes live in a low-dimensional subspace, just as Pearson guessed in 1901.
            </Analogy>

            <Analogy label="What comes next — is this pattern real?">
                We can now measure relationships (correlation) and compress data (PCA). But there's a dangerous trap: if you measure enough things, some will appear correlated by chance. A study with 50 variables has 1,225 correlations to check — even if all variables are completely independent, roughly 61 of those correlations will look significant just by random luck (at the 5% significance level). Statistical inference is the branch of mathematics that tells us how to tell the difference between real patterns and lucky coincidences.
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
                For a data matrix X ∈ ℝⁿˣᵖ (n samples, p features), first centre: X̃ = X − mean(X). The <strong>sample covariance matrix</strong> is:
            </p>
            <MathBlock tex="C = \frac{1}{n-1} \tilde{X}^\top \tilde{X} \in \mathbb{R}^{p \times p}" />
            <p>
                Entry Cᵢⱼ = Cov(Xᵢ, Xⱼ): the covariance between features i and j. The diagonal contains variances. The <strong>Pearson correlation</strong> normalises by standard deviations:
            </p>
            <MathBlock tex="r_{ij} = \frac{C_{ij}}{\sqrt{C_{ii} \cdot C_{jj}}} \in [-1, 1]" />

            <h3>PCA — Maximising Projected Variance</h3>
            <p>
                Find unit vector w₁ that maximises the variance of the projection X̃w:
            </p>
            <MathBlock tex="w_1 = \arg\max_{\|w\|=1} \text{Var}(\tilde{X}w) = \arg\max_{\|w\|=1} w^\top C w" />
            <p>
                By Lagrange multipliers: Cw = λw. So w₁ is the eigenvector of C with the largest eigenvalue λ₁. Each subsequent component wₖ is the eigenvector with the kᵗʰ largest eigenvalue, subject to orthogonality with w₁,...,wₖ₋₁.
            </p>

            <DefBlock label="PCA Algorithm">
                1. Centre: X̃ = X − mean(X, axis=0)<br />
                2. Compute: C = X̃ᵀX̃ / (n−1)<br />
                3. Eigendecompose: C = VΛVᵀ (eigenvalues in descending order)<br />
                4. Project: Z = X̃ · V_k (top-k eigenvectors)<br />
                <br />
                Equivalently (more stable): compute SVD of X̃ = UΣVᵀ directly. Principal components = columns of V. Eigenvalues λᵢ = σᵢ²/(n−1).
            </DefBlock>

            <h3>Explained Variance</h3>
            <p>
                The fraction of total variance captured by the top-k components:
            </p>
            <MathBlock tex="\text{Explained variance ratio} = \frac{\sum_{i=1}^k \lambda_i}{\sum_{i=1}^p \lambda_i}" />
            <p>
                Plot this on a "scree plot" to choose k: look for the "elbow" where adding more components gives diminishing returns.
            </p>

            <h3>PCA Minimises Reconstruction Error</h3>
            <p>
                The k-component reconstruction X̂ = ZVₖᵀ + mean has the smallest possible mean-squared reconstruction error among all linear projections to k dimensions (Eckart-Young theorem). This is why PCA is optimal for compression.
            </p>

            <h3>Geometric Intuition</h3>
            <ul>
                <li>PC1 is the long axis of the best-fitting ellipse around the data cloud</li>
                <li>PC2 is the short axis of that ellipse (perpendicular to PC1)</li>
                <li>The singular values σᵢ are proportional to the lengths of the ellipse axes</li>
                <li>Projecting onto the top-k PCs is equivalent to slicing the ellipse along its longest axes</li>
            </ul>

            <h3>Key Assumptions and Limitations</h3>
            <ul>
                <li><strong>Linear only:</strong> PCA captures linear correlations. Non-linear manifolds require kernel PCA, t-SNE, or UMAP</li>
                <li><strong>Scale sensitive:</strong> Always standardise features to unit variance before PCA unless all features share the same units</li>
                <li><strong>Interpretability:</strong> Principal components are mixtures of all original features — they may not have clear real-world meaning</li>
            </ul>

            <div className="ch-callout">
                <strong>Connection to deep learning:</strong> A linear autoencoder (encoder W_e : ℝᵖ → ℝᵏ, decoder W_d : ℝᵏ → ℝᵖ, trained to minimise MSE) learns the same subspace as PCA — proved by Baldi &amp; Hornik (1989). Deep nonlinear autoencoders generalise this to curved manifolds. LoRA fine-tuning represents weight updates as W = W₀ + BA where B ∈ ℝᵐˣʳ, A ∈ ℝʳˣⁿ — explicitly forcing updates to live in a low-rank (PCA-like) subspace with r ≪ min(m,n).
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
