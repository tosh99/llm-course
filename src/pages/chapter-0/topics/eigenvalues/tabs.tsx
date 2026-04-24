import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import { CovarianceDiagram, DiagramBlock, EigenvectorDiagram } from "./diagrams"
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
            year: "1843 – 1858",
            title: "Cayley & Hamilton — The Characteristic Equation",
            challenge:
                "For centuries, geometers had known that some geometric transformations have 'special directions' — lines that the transformation maps onto themselves. A scaling transformation has every direction as a special direction; a shear keeps the x-axis fixed. But identifying these invariant directions for an arbitrary matrix required solving ad-hoc polynomial equations with no unifying method. Every new matrix was a fresh puzzle.",
            what:
                "Cayley showed that for any square matrix A, the equation det(A − λI) = 0 yields a degree-n polynomial whose n roots are exactly the eigenvalues — the scale factors of the invariant directions. Hamilton then proved the Cayley–Hamilton theorem: every matrix satisfies its own characteristic polynomial. That is, if p(λ) = det(A − λI), then substituting A for λ gives p(A) = 0. This remarkable identity means you can always express A^n as a polynomial in A of degree at most n−1.",
            impact:
                "This turned eigenvalue hunting from an art into an algorithm. The characteristic polynomial gives a computable procedure for finding all n eigenvalues of any n×n matrix. In ML, eigenvalues appear constantly: the eigenvalues of the Hessian matrix govern training stability (gradient descent diverges if step size exceeds 2/λ_max), the eigenvalues of an attention weight matrix reveal the 'modes' a head has learned, and the eigenvalue of 1 in a Markov chain's transition matrix defines the stationary distribution — the foundation of PageRank.",
        },
        {
            year: "1901 – 1933",
            title: "Pearson & Hotelling — Principal Component Analysis",
            challenge:
                "In the early 20th century, fields like anthropology, economics, and psychology were accumulating multi-variable datasets. An anthropologist measuring 20 skull dimensions on hundreds of specimens had no way to ask: how many genuinely independent patterns of variation are there in this data? Are 20 measurements really 20 independent dimensions, or do most of the variation live in just 3 or 4 'natural' directions? There was no mathematical language for this question.",
            what:
                "Karl Pearson (1901) and Harold Hotelling (1933) developed PCA in two independent streams. Pearson approached it geometrically: find the line that minimises the sum of squared distances from each data point — the direction of maximum variance. Hotelling formalised the algebraic connection: form the covariance matrix Σ = X^T X / n, find its eigendecomposition Σ = QΛQ^T, and project data onto the top-k eigenvectors. The eigenvectors are the directions of maximum variance; the eigenvalues measure how much variance each direction contains.",
            impact:
                "PCA is one of the most widely used dimensionality-reduction techniques in all of data science: used to visualise high-dimensional data, initialise neural network weights, and extract features before clustering. The 'eigenfaces' algorithm (Turk & Pentland, 1991) — PCA on face images — was a landmark in facial recognition and directly inspired autoencoders, which learn nonlinear generalisations of PCA. LoRA fine-tuning (2022) is conceptually PCA applied to weight-update matrices: find the low-dimensional subspace where important changes live.",
        },
        {
            year: "1907 – 1912",
            title: "Perron & Frobenius — The Dominant Eigenvalue",
            challenge:
                "Mathematicians studying systems that evolved over time — disease spreading in populations, heat diffusing through materials, money flowing through an economy — modelled them as matrices applied repeatedly: x_{t+1} = Ax_t. But with n variables and n² matrix entries, predicting the long-run behaviour directly seemed intractable. Would repeated multiplication always converge, or could it cycle endlessly?",
            what:
                "Oskar Perron (1907) proved that any matrix with all strictly positive entries has a unique largest real eigenvalue (the Perron root) with a corresponding eigenvector of all-positive components. Georg Frobenius extended this to irreducible non-negative matrices (1908–1912). The theorem guarantees that repeated application of such a matrix always converges to a direction proportional to this dominant eigenvector — regardless of where you start.",
            impact:
                "The Perron-Frobenius theorem is the mathematical foundation of Google's PageRank: the web's link matrix is non-negative and irreducible, so a unique dominant eigenvector exists and power iteration (repeatedly multiplying by the matrix) converges to it. In ML, any recurrent process — Markov chains, diffusion models, RNNs — has long-run behaviour governed by its dominant eigenvalue. A dominant eigenvalue greater than 1 means the system diverges; less than 1 means it contracts to a fixed point. Understanding this is why careful weight initialisation matters: if the initial recurrent weight matrix has spectral radius > 1, gradients explode.",
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
            <h2>Special arrows that do not change direction</h2>

            <p className="ch-story-intro">
                Matrices are arrow-reshaping machines. Most arrows change direction when they go through a matrix. But some very special arrows come out pointing exactly the same way — they only get stretched or shrunk. These are eigenvectors, and they reveal the hidden structure of the matrix.
            </p>

            <Analogy label="Eigenvectors = arrows that survive unchanged in direction">
                Most arrows change direction when they go through a matrix machine. But some very special arrows come out <em>pointing exactly the same way</em> — they only get longer or shorter. These are called <strong>eigenvectors</strong> (from the German word <em>eigen</em>, meaning "own" or "characteristic"). The stretch factor is the <strong>eigenvalue</strong>.
                <br /><br />
                Think of a rubber band stretched along a diagonal. If you compress the whole sheet, most diagonal directions will be distorted. But one direction — the axis of compression — will just shrink straight down. That axis is an eigenvector.
            </Analogy>

            <Analogy label="The Covariance Matrix — a friendship table with hidden axes">
                The covariance matrix from probability theory records, for every pair of measurements, whether they tend to go up together (positive), opposite ways (negative), or not at all (zero). Tall kids tend to have bigger feet — positive covariance between height and shoe size.
                <br /><br />
                Now here's the key question: what are the <em>eigenvectors</em> of this covariance matrix? They point in the directions where the data is most spread out — the "natural axes" of the data cloud.
            </Analogy>

            <DiagramBlock title="Covariance — data points and their natural axes">
                <CovarianceDiagram compact />
            </DiagramBlock>

            <Analogy label="PCA = finding the best angle to look at your data">
                The <strong>amber arrow</strong> in the scatter plot above points in the direction of maximum spread — the "main direction" the data runs along. The <strong>blue arrow</strong> is perpendicular: the direction of least spread. These two arrows are the eigenvectors of the covariance matrix.
                <br /><br />
                <strong>PCA</strong> (Principal Component Analysis) finds these arrows automatically. It shrinks a dataset with 1000 measurements per person down to just 10 numbers — keeping the most important directions and discarding the rest. This is the single most widely-used dimensionality reduction technique in all of data science.
            </Analogy>

            <Analogy label="Eigenvalue = how important is this direction?">
                Each eigenvector comes with an <strong>eigenvalue</strong> — the stretch factor. A large eigenvalue means the data is spread out a lot in that direction (important direction). A small eigenvalue means very little spread (possibly just noise). Sort eigenvectors by their eigenvalues from largest to smallest, and you've ranked the directions of a dataset from most important to least.
            </Analogy>

            <Analogy label="Dominant eigenvector = the 'favourite direction' after many multiplications">
                If you apply a matrix over and over again — multiply a vector by A, then by A again, and again — what happens? Eventually, the result gets dominated by one special direction: the <strong>dominant eigenvector</strong>. This is exactly how Google's PageRank works. The web's link structure is a matrix, and after multiplying by it thousands of times, you end up at the dominant eigenvector — which ranks every webpage by importance.
            </Analogy>

            <Analogy label="What comes next — when the matrix is rectangular">
                Eigenvectors work perfectly when the matrix is square. But most real data matrices are rectangular — many rows (examples) and many columns (features). Extending the 'natural axes' idea to rectangular matrices requires a new tool: <strong>Singular Value Decomposition (SVD)</strong>. That's our next topic.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Eigenvalues, eigenvectors, and principal components</h2>

            <h3>Eigenvalues &amp; Eigenvectors — what does not change direction?</h3>
            <p>
                Most vectors get rotated and stretched when you apply a matrix. But for every square
                matrix A, there exist special vectors <strong>v</strong> that only get stretched — they
                do not change direction at all. These are called <strong>eigenvectors</strong>, and the
                stretch factor is the <strong>eigenvalue</strong> lambda:
            </p>
            <MathBlock tex="A\mathbf{v} = \lambda\mathbf{v}" />
            <p>
                Read this as: "applying matrix A to vector <strong>v</strong> is the same as just scaling
                <strong>v</strong> by the number lambda." The direction is preserved; only the magnitude
                changes.
            </p>

            <h3>Finding Eigenvalues — the characteristic equation</h3>
            <p>
                To find the eigenvalues, rearrange <InlineMath tex="A\mathbf{v} = \lambda\mathbf{v}" /> as
                <InlineMath tex="(A - \lambda I)\mathbf{v} = \mathbf{0}" />. For this to have a non-zero
                solution, the matrix <InlineMath tex="(A - \lambda I)" /> must be singular — meaning its
                determinant is zero:
            </p>
            <MathBlock tex="\det(A - \lambda I) = 0" />
            <p>
                This is the <strong>characteristic equation</strong>. For a 2x2 matrix it gives a
                quadratic in lambda. The roots are the eigenvalues. For example:
            </p>
            <MathBlock tex="A = \begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix} \implies \det\begin{pmatrix} 3-\lambda & 1 \\ 0 & 2-\lambda \end{pmatrix} = (3-\lambda)(2-\lambda) = 0" />
            <p>
                So lambda_1 = 3 and lambda_2 = 2. Then for each eigenvalue, solve
                <InlineMath tex="(A - \lambda I)\mathbf{v} = \mathbf{0}" /> to find the corresponding
                eigenvector. For lambda_1 = 3: the eigenvector is (1, 0) — the x-axis is preserved. For
                lambda_2 = 2: the eigenvector is (1, -1).
            </p>

            <h3>Geometric Intuition</h3>
            <p>
                Picture a matrix that stretches space along two axes. The eigenvectors point along those
                stretch axes — they are the "natural axes" of the transformation. Everything else is a
                combination of those special directions getting scaled differently.
            </p>
            <p>
                A matrix with eigenvalues lambda_1 = 3 and lambda_2 = 0.5 stretches space 3x in one direction and
                squishes it by half in another. Vectors along the first eigenvector grow; vectors along the
                second shrink. Every other vector does a mix of both.
            </p>

            <h3>Why Eigenvalues Matter in Machine Learning</h3>
            <p>
                <strong>PCA (Principal Component Analysis)</strong> is built entirely on eigendecomposition.
                Given a dataset of n samples with d features, form the covariance matrix
                <InlineMath tex="\Sigma \in \mathbb{R}^{d \times d}" />. Its eigenvectors point in the
                directions of greatest variance in the data; its eigenvalues tell you
                <em>how much</em> variance lies along each direction.
            </p>
            <p>
                Sort eigenvectors by their eigenvalues (largest first). Keep the top k. You have just found
                the k dimensions that explain the most variation in your data — discarding the rest as
                noise. A dataset with 1000 features might be compressed to 20 meaningful dimensions this
                way, with almost no information loss.
            </p>

            <h3>The Covariance Matrix</h3>
            <p>
                The covariance matrix is one of the most important matrices in data science. Suppose you
                have a dataset of <em>n</em> samples, each with <em>d</em> features. First centre the
                data by subtracting the mean of each feature. Then the <strong>sample covariance
                matrix</strong> is:
            </p>
            <MathBlock tex="\Sigma = \frac{1}{n} X^\top X \in \mathbb{R}^{d \times d}" />
            <p>
                The entry Sigma_ij captures how features i and j vary together across your samples:
            </p>
            <ul>
                <li><strong>Sigma_ij &gt; 0</strong> — features i and j tend to increase together (e.g. height and weight)</li>
                <li><strong>Sigma_ij &lt; 0</strong> — when feature i goes up, feature j tends to go down</li>
                <li><strong>Sigma_ij approx 0</strong> — the two features are unrelated</li>
                <li><strong>Sigma_ii</strong> — the diagonal: variance of feature i on its own</li>
            </ul>
            <p>
                The covariance matrix is always symmetric (Sigma = Sigma^T) and positive semi-definite — its
                eigenvalues are always &gt;= 0. Its eigendecomposition Sigma = Q Lambda Q^T gives:
            </p>
            <ul>
                <li><strong>Eigenvectors (columns of Q)</strong> — the principal axes of the data ellipsoid, the directions of greatest spread</li>
                <li><strong>Eigenvalues (lambda_i)</strong> — the variance of the data along each principal axis</li>
            </ul>
            <p>
                Sorting by eigenvalue largest-to-smallest and keeping the top k eigenvectors is exactly
                <strong>PCA</strong>. The diagram below shows a 2D dataset — the amber arrow (PC_1) points
                in the direction of maximum variance, and the blue arrow (PC_2) is perpendicular to it.
            </p>

            <DiagramBlock title="Scatter plot — eigenvectors of the covariance matrix = principal axes">
                <CovarianceDiagram />
            </DiagramBlock>

            <div className="ch-callout">
                <strong>Connection to ML — and what comes next:</strong> Eigenvalues appear everywhere.
                The learning dynamics of gradient descent are governed by the eigenvalues of the loss Hessian.
                Transformer attention heads implicitly learn low-rank structure. LoRA fine-tuning exploits
                this by learning only the high-eigenvalue directions of weight updates. But eigendecomposition
                requires a <em>square</em> matrix. Most real data matrices — m samples × n features —
                are rectangular. The tool that generalises eigendecomposition to any matrix shape is
                Singular Value Decomposition (SVD), our next topic.
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
            <h2>Formal Definitions</h2>

            <DefBlock label="Definition — Eigenvalue &amp; Eigenvector">
                For a square matrix A in <InlineMath tex="\mathbb{R}^{n \times n}" />, a non-zero vector <strong>v</strong> is an{" "}
                <strong>eigenvector</strong> with corresponding <strong>eigenvalue</strong> lambda if{" "}
                A<strong>v</strong> = lambda<strong>v</strong>. Geometrically, A transforms all of space,
                but eigenvectors are the special axes that do not rotate — they just stretch{" "}
                (lambda &gt; 1), shrink (0 &lt; lambda &lt; 1), or flip (lambda &lt; 0).
            </DefBlock>

            <h3>The Characteristic Equation</h3>
            <p>
                To find eigenvalues, solve the <strong>characteristic equation</strong>:
            </p>
            <MathBlock tex="\det(A - \lambda I) = 0" />
            <p>
                This yields a degree-n polynomial in lambda whose n roots are the eigenvalues. For each
                eigenvalue lambda_i, the corresponding eigenvector solves
                <InlineMath tex="(A - \lambda_i I)\mathbf{v}_i = \mathbf{0}" />.
            </p>

            <h3>Eigendecomposition</h3>
            <p>
                When A is symmetric (A = A^T) — as covariance matrices always are — its eigenvectors are
                orthogonal and its eigenvalues are real. This enables the clean decomposition:
            </p>
            <MathBlock tex="A = Q\,\Lambda\,Q^\top" />
            <p>
                Here Q in <InlineMath tex="\mathbb{R}^{n \times n}" /> has orthonormal eigenvectors as columns, and
                <InlineMath tex="\Lambda = \text{diag}(\lambda_1,\ldots,\lambda_n)" /> holds the
                eigenvalues sorted largest-first. This is the mathematical engine of
                <strong>PCA</strong>: eigendecompose the sample covariance matrix
                <InlineMath tex="\Sigma = \frac{1}{n}X^\top X" />, project data onto the top-k
                eigenvectors (principal components), and you have found the k directions of maximum
                variance. The eigenvalue lambda_i tells you exactly how much variance the i-th component
                explains.
            </p>

            <DiagramBlock title="Eigenvectors — the axes that survive a transformation unchanged in direction">
                <EigenvectorDiagram />
            </DiagramBlock>

            <DiagramBlock title="Covariance matrix — eigenvectors reveal the natural axes of the data cloud">
                <CovarianceDiagram />
            </DiagramBlock>

            <h3>Eigenvalues in Optimisation</h3>
            <p>
                In optimisation, the eigenvalues of the <strong>loss Hessian</strong>
                <InlineMath tex="\nabla^2 \mathcal{L}" /> govern training dynamics. Large eigenvalues
                mean sharp curvature — learning rate must be small or training diverges. Small eigenvalues
                mean flat directions — training is slow. Adaptive optimisers like Adam implicitly rescale
                gradients to compensate for this spectrum.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import time

# ── 1. NumPy baseline — eigh for symmetric matrices ──────────────────��───
np.random.seed(42)
X_np = np.random.randn(100, 4).astype(np.float32)
X_np -= X_np.mean(axis=0)
Sigma_np = (X_np.T @ X_np) / (X_np.shape[0] - 1)

eigvals_np, eigvecs_np = np.linalg.eigh(Sigma_np)    # ascending order
eigvals_np = eigvals_np[::-1];  eigvecs_np = eigvecs_np[:, ::-1]
var = (eigvals_np[:2] / eigvals_np.sum()).round(3)
print(f"[NumPy]  variance explained by top-2 PCs: {var}")

# ── 2. PyTorch eigh — same guarantees, GPU-ready ─────────────────────────
print("\\n[PyTorch] torch.linalg.eigh")

X = torch.from_numpy(X_np)
Sigma = (X.T @ X) / (X.shape[0] - 1)

eigvals, eigvecs = torch.linalg.eigh(Sigma)   # ascending; symmetric → real
eigvals = eigvals.flip(0);  eigvecs = eigvecs.flip(1)

print(f"  eigenvalues: {eigvals.tolist()}")
print(f"  Av = λv check: {torch.allclose(Sigma @ eigvecs[:, 0], eigvals[0] * eigvecs[:, 0])}")

# ── 3. torch.pca_lowrank — randomised PCA, scales to large datasets ──────
print("\\n[Randomised PCA] torch.pca_lowrank")

torch.manual_seed(0)
X_big = torch.randn(10_000, 256)
X_big -= X_big.mean(dim=0)
k = 16

t0 = time.perf_counter()
_, S_r, Vh_r = torch.pca_lowrank(X_big, q=k)   # randomised; avoids forming XᵀX
pca_ms = (time.perf_counter() - t0) * 1000

X_pca = X_big @ Vh_r                            # project: (10k, 256) → (10k, 16)
var_r  = (S_r**2 / (S_r**2).sum() * 100).round(1)
print(f"  10k × 256 dataset  →  {list(X_pca.shape)}  in {pca_ms:.1f} ms")
print(f"  top-4 components explain {var_r[:4].tolist()} % variance each")

# ── 4. Hessian eigenvalues — they bound the safe learning rate ────────────
print("\\n[Hessian] curvature spectrum")

A_mat = torch.tensor([[3., 1.], [1., 2.]])   # loss is L(x) = ½xᵀAx; H = A

def quad_loss(x):
    return 0.5 * x @ A_mat @ x

H = torch.autograd.functional.hessian(quad_loss, torch.tensor([1.0, 2.0]))
eigvals_H = torch.linalg.eigvalsh(H)
print(f"  Hessian eigenvalues: {eigvals_H.tolist()}")
print(f"  Safe learning rate η < 2/λ_max = {(2/eigvals_H.max()).item():.4f}")

# ── 5. Batched eigendecomposition — many matrices in parallel ─────────────
print("\\n[Parallel] batched eigh over 32 covariance matrices")

# 32 independent (10×10) symmetric positive-definite matrices
M = torch.randn(32, 64, 10)
batch_covs = M.transpose(-2, -1) @ M   # XᵀX → symmetric PSD, shape (32, 10, 10)
eigvals_b, eigvecs_b = torch.linalg.eigh(batch_covs)
print(f"  input:   {list(batch_covs.shape)}")
print(f"  eigvals: {list(eigvals_b.shape)}  (32 decompositions, one LAPACK call)")`

function PythonContent() {
    return (
        <>
            <p>
                From exact eigendecomposition to randomised PCA on 10 k-sample datasets —
                PyTorch's <code>torch.linalg.eigh</code> and <code>torch.pca_lowrank</code>{" "}
                handle every scale, and batched decomposition processes many matrices in parallel.
            </p>
            <CodeBlock code={PY_CODE} filename="eigenvalues.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The eigenvalues of the loss Hessian directly
                control training stability — gradient descent diverges if η &gt; 2/λ<sub>max</sub>.
                Adaptive optimisers like Adam implicitly rescale gradients to compensate for the
                uneven curvature spectrum.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const EIGENVALUES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
