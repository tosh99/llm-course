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
                "Mathematicians knew that some directions survived matrix transformations unchanged, but there was no systematic way to find them. Every matrix required ad hoc guessing and checking.",
            what:
                "Cayley showed that for any square matrix A, the equation det(A - lambda I) = 0 yields a polynomial whose roots are exactly the scale factors (eigenvalues) of those special directions. Hamilton proved that every matrix satisfies its own characteristic equation: if p(lambda) = det(A - lambda I), then p(A) = 0.",
            impact:
                "This turned eigenvalue hunting from an art into an algorithm. The characteristic polynomial is why we can compute eigenvalues systematically, and it underpins everything from stability analysis in control theory to principal component analysis in machine learning.",
        },
        {
            year: "1900 – 1930",
            title: "Principal Component Analysis",
            challenge:
                "Statisticians working with multivariate data — measurements of many traits across many individuals — had no way to visualise or compress high-dimensional datasets. How do you summarise 20 measurements per person in a way that preserves the most important patterns?",
            what:
                "Karl Pearson and later Harold Hotelling developed PCA: form the covariance matrix of the data, find its eigenvectors and eigenvalues, and project the data onto the directions of maximum variance (the eigenvectors with largest eigenvalues).",
            impact:
                "PCA is one of the most widely used dimensionality-reduction techniques in all of data science. It is the ancestor of modern autoencoders and the conceptual foundation for understanding why neural networks can learn compressed representations. In computer vision, eigenfaces (PCA on face images) were an early landmark in facial recognition.",
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

            <Analogy label="Special Arrows — Eigenvectors">
                Most arrows change direction when they go through a matrix machine. But some very special
                arrows come out <em>pointing exactly the same way</em> — they only get longer or shorter.
                These are called <strong>eigenvectors</strong> (from the German word <em>eigen</em>,
                meaning "own" or "special"). The number that says <em>how much</em> it stretched is called
                the <strong>eigenvalue</strong>.
                <br />
                <br />
                Think of it like a bouncy ball thrown at a wall. Most balls bounce off at a weird angle.
                But if you throw it perfectly straight at the wall, it bounces straight back — same
                direction, just reversed. That "perfect direction" is like an eigenvector!
            </Analogy>

            <Analogy label="Why eigenvectors matter for AI">
                When a computer looks at a huge pile of data — say, 1000 photos — there are hidden
                "important directions" in all that information. <strong>PCA</strong> (Principal Component
                Analysis) finds the eigenvectors of that data to discover which directions carry the most
                useful information. It is like finding the best angle to look at a 3D sculpture so you can
                draw a flat picture that still shows everything important.
            </Analogy>

            <Analogy label="The Covariance Matrix — a friendship table">
                Imagine you measure two things about every kid in your school: their height and their shoe
                size. You will notice that <strong>tall kids tend to have bigger feet</strong>. They
                "go together." The <strong>covariance matrix</strong> is a table that records, for every
                pair of measurements you are tracking, whether they tend to go up together (positive), go
                opposite ways (negative), or just do not care about each other at all (zero).
                <br /><br />
                If you track three things — height, shoe size, and hair colour — the covariance matrix is
                a 3x3 table. The diagonal shows how "spread out" each measurement is on its own. The
                off-diagonals show how strongly each pair moves together.
            </Analogy>

            <DiagramBlock title="Covariance — data points and their natural axes">
                <CovarianceDiagram compact />
            </DiagramBlock>

            <Analogy label="The secret shape hiding in the data">
                The covariance matrix has its own eigenvectors. These eigenvectors point in the directions
                where the data is most spread out. In the scatter plot above, the <strong>amber arrow</strong>
                points in the direction of maximum spread — the "main direction" the data runs along. The
                <strong>blue arrow</strong> is perpendicular: the direction of least spread.
                <br /><br />
                This is exactly what <strong>PCA</strong> (Principal Component Analysis) does — it finds
                those arrows automatically. It is how AI shrinks a dataset with 1000 measurements per
                person down to just 10 numbers, keeping the most important information.
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
                <strong>Connection to ML:</strong> Eigenvalues appear everywhere. The learning dynamics
                of gradient descent are governed by the eigenvalues of the loss Hessian. Transformer
                attention heads implicitly learn low-rank structure that SVD (a generalisation of
                eigendecomposition) captures. LoRA fine-tuning exploits this by learning only the
                high-eigenvalue directions of weight updates.
            </div>
        </>
    )
}

function MathsTab() {
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

function PythonTab() {
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
    maths: <MathsTab />,
    python: <PythonTab />,
}
