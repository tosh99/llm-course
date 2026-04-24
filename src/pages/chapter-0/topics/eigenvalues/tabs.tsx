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
            <MathBlock tex="A\\mathbf{v} = \\lambda\\mathbf{v}" />
            <p>
                Read this as: "applying matrix A to vector <strong>v</strong> is the same as just scaling
                <strong>v</strong> by the number lambda." The direction is preserved; only the magnitude
                changes.
            </p>

            <h3>Finding Eigenvalues — the characteristic equation</h3>
            <p>
                To find the eigenvalues, rearrange <InlineMath tex="A\\mathbf{v} = \\lambda\\mathbf{v}" /> as
                <InlineMath tex="(A - \\lambda I)\\mathbf{v} = \\mathbf{0}" />. For this to have a non-zero
                solution, the matrix <InlineMath tex="(A - \\lambda I)" /> must be singular — meaning its
                determinant is zero:
            </p>
            <MathBlock tex="\\det(A - \\lambda I) = 0" />
            <p>
                This is the <strong>characteristic equation</strong>. For a 2x2 matrix it gives a
                quadratic in lambda. The roots are the eigenvalues. For example:
            </p>
            <MathBlock tex="A = \\begin{pmatrix} 3 & 1 \\ 0 & 2 \\end{pmatrix} \\implies \\det\\begin{pmatrix} 3-\\lambda & 1 \\ 0 & 2-\\lambda \\end{pmatrix} = (3-\\lambda)(2-\\lambda) = 0" />
            <p>
                So lambda_1 = 3 and lambda_2 = 2. Then for each eigenvalue, solve
                <InlineMath tex="(A - \\lambda I)\\mathbf{v} = \\mathbf{0}" /> to find the corresponding
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
                <InlineMath tex="\\Sigma \\in \\mathbb{R}^{d \\times d}" />. Its eigenvectors point in the
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
            <MathBlock tex="\\Sigma = \\frac{1}{n} X^\\top X \\in \\mathbb{R}^{d \\times d}" />
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
                For a square matrix A in <InlineMath tex="\\mathbb{R}^{n \\times n}" />, a non-zero vector <strong>v</strong> is an{" "}
                <strong>eigenvector</strong> with corresponding <strong>eigenvalue</strong> lambda if{" "}
                A<strong>v</strong> = lambda<strong>v</strong>. Geometrically, A transforms all of space,
                but eigenvectors are the special axes that do not rotate — they just stretch{" "}
                (lambda &gt; 1), shrink (0 &lt; lambda &lt; 1), or flip (lambda &lt; 0).
            </DefBlock>

            <h3>The Characteristic Equation</h3>
            <p>
                To find eigenvalues, solve the <strong>characteristic equation</strong>:
            </p>
            <MathBlock tex="\\det(A - \\lambda I) = 0" />
            <p>
                This yields a degree-n polynomial in lambda whose n roots are the eigenvalues. For each
                eigenvalue lambda_i, the corresponding eigenvector solves
                <InlineMath tex="(A - \\lambda_i I)\\mathbf{v}_i = \\mathbf{0}" />.
            </p>

            <h3>Eigendecomposition</h3>
            <p>
                When A is symmetric (A = A^T) — as covariance matrices always are — its eigenvectors are
                orthogonal and its eigenvalues are real. This enables the clean decomposition:
            </p>
            <MathBlock tex="A = Q\\,\\Lambda\\,Q^\\top" />
            <p>
                Here Q in <InlineMath tex="\\mathbb{R}^{n \\times n}" /> has orthonormal eigenvectors as columns, and
                <InlineMath tex="\\Lambda = \\text{diag}(\\lambda_1,\\ldots,\\lambda_n)" /> holds the
                eigenvalues sorted largest-first. This is the mathematical engine of
                <strong>PCA</strong>: eigendecompose the sample covariance matrix
                <InlineMath tex="\\Sigma = \\frac{1}{n}X^\\top X" />, project data onto the top-k
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
                <InlineMath tex="\\nabla^2 \\mathcal{L}" /> govern training dynamics. Large eigenvalues
                mean sharp curvature — learning rate must be small or training diverges. Small eigenvalues
                mean flat directions — training is slow. Adaptive optimisers like Adam implicitly rescale
                gradients to compensate for this spectrum.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Eigenvalues &amp; Eigenvectors ────────────────────────────
# Used in PCA to find directions of maximum variance

cov = np.array([[3.0, 1.0],           # 2x2 covariance matrix
                [1.0, 2.0]])

eigenvalues, eigenvectors = np.linalg.eig(cov)
print("Eigenvalues:",  eigenvalues)   # -> [3.618  1.382]
print("Eigenvectors:", eigenvectors)  # columns are the eigenvectors

# Verify: A @ v == lambda * v
v0 = eigenvectors[:, 0]               # first eigenvector
lam0 = eigenvalues[0]
print(np.allclose(cov @ v0, lam0 * v0))  # -> True

# ── PCA via Eigendecomposition ────────────────────────────
# Simulated data: 100 samples, 3 features
np.random.seed(42)
X = np.random.randn(100, 3)
X -= X.mean(axis=0)                   # center the data

# Compute covariance matrix and eigendecompose
Sigma = (X.T @ X) / (X.shape[0] - 1)
eigvals, eigvecs = np.linalg.eigh(Sigma)   # eigh for symmetric matrices

# Sort by eigenvalue descending
idx = np.argsort(eigvals)[::-1]
eigvals = eigvals[idx]
eigvecs = eigvecs[:, idx]

k = 2                                 # keep top-2 components
X_reduced = X @ eigvecs[:, :k]       # project: (100, 3) -> (100, 2)
print("Variance explained:",
      (eigvals[:k] / eigvals.sum()).round(3))  # e.g. -> [0.381 0.347]`

function PythonTab() {
    return (
        <>
            <p>
                NumPy makes eigendecomposition a single function call. Prefer
                <code>np.linalg.eigh</code> for symmetric matrices (like covariance matrices) — it is
                faster and numerically stabler than <code>np.linalg.eig</code>.
            </p>
            <CodeBlock code={PY_CODE} filename="eigenvalues.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The covariance matrix is always symmetric positive
                semi-definite, so its eigenvalues are real and non-negative. This guarantees that PCA
                always finds meaningful principal components with real variances.
            </div>
        </>
    )
}

const TS_CODE = `// ── Types ────────────────────────────────────────────────
type Vec = number[];
type Mat = number[][];

// ── Matrix * Vector ───────────────────────────────────────
function matVecMul(W: Mat, x: Vec): Vec {
  return W.map(row => row.reduce((s, v, i) => s + v * x[i], 0));
}

// ── Power Iteration (finds dominant eigenvector) ──────────
// Repeatedly apply A to a random vector and normalise.
// The result converges to the eigenvector with the largest |lambda|.

function powerIteration(A: Mat, steps = 40): { eigenvalue: number; eigenvector: Vec } {
  let v = A[0].map(() => Math.random());
  const norm = (x: Vec) => Math.sqrt(x.reduce((s, a) => s + a * a, 0));

  for (let i = 0; i < steps; i++) {
    v = matVecMul(A, v);
    const n = norm(v);
    v = v.map(x => x / n);
  }

  // Rayleigh quotient gives the eigenvalue: v^T A v / (v^T v)
  const Av = matVecMul(A, v);
  const eigenvalue = v.reduce((s, vi, i) => s + vi * Av[i], 0);
  return { eigenvalue, eigenvector: v };
}

// ── Demo ──────────────────────────────────────────────────
const cov: Mat = [
  [3.0, 1.0],
  [1.0, 2.0],
];

const { eigenvalue, eigenvector } = powerIteration(cov);
console.log("Dominant eigenvalue:", eigenvalue.toFixed(4));       // -> ~3.618
console.log("Dominant eigenvector:", eigenvector.map(v => v.toFixed(4)));
// -> [0.8507, 0.5257]  (direction of maximum variance)`

function CodeTab() {
    return (
        <>
            <p>
                Power iteration is the simplest iterative algorithm for finding the dominant eigenvector.
                Modern libraries use the QR algorithm or divide-and-conquer methods, but power iteration
                builds intuition and is the basis for algorithms like PageRank.
            </p>
            <CodeBlock code={TS_CODE} filename="eigenvalues.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Next step:</strong> In production, always use <code>numpy.linalg.eigh</code> or
                <code>torch.linalg.eigh</code>. These call optimised LAPACK routines that handle numerical
                edge cases (close eigenvalues, ill-conditioned matrices) far better than hand-rolled code.
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
    code: <CodeTab />,
}
