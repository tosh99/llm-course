import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import { DiagramBlock, SVDDiagram } from "./diagrams"
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
            year: "1873 – 1874",
            title: "Beltrami & Jordan — The SVD Discovered",
            challenge:
                "Mathematicians had long known that symmetric matrices could be diagonalised (eigendecomposition), but most matrices in applications were rectangular — more rows than columns, or vice versa. There was no way to decompose a general matrix into simple, interpretable pieces.",
            what:
                "Eugenio Beltrami and Camille Jordan independently discovered that any matrix — even rectangular ones — can be written as a product of three special matrices: a rotation, a diagonal scaling matrix, and another rotation. This is the Singular Value Decomposition (SVD).",
            impact:
                "SVD is the Swiss Army knife of numerical linear algebra. It works for any matrix shape, unlike eigendecomposition which requires square matrices. In ML, it underpins PCA, recommendation systems (matrix factorisation), image compression, and modern parameter-efficient fine-tuning methods like LoRA.",
        },
        {
            year: "1936",
            title: "Eckart & Young — The Low-Rank Approximation Theorem",
            challenge:
                "Once you have an SVD, you can throw away small singular values and reconstruct an approximation of the original matrix. But how good is this approximation? Is there a better way to approximate a matrix with a lower-rank one?",
            what:
                "Carl Eckart and Gale Young proved that the truncated SVD — keeping only the top k singular values and vectors — yields the best possible rank-k approximation of the original matrix, as measured by either the spectral norm or the Frobenius norm.",
            impact:
                "This theorem justifies almost every matrix compression technique in ML. From compressing weight matrices in neural networks to building compact embeddings in recommendation systems, the Eckart-Young theorem tells us that SVD-based truncation is optimal. LoRA (2022) exploits this by learning only the top few singular directions of weight updates.",
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
            <h2>Breaking down big machines into simple parts</h2>

            <Analogy label="SVD = disassemble, scale, reassemble">
                Imagine a complicated LEGO machine. Instead of trying to understand all the bricks at once,
                you can take it apart into three simpler steps: first rotate the whole thing, then stretch
                or squish each axis independently, then rotate it again. That is what SVD does to a matrix.
            </Analogy>

            <Analogy label="Low-rank approximation = keep the important parts">
                If your LEGO machine has 1000 bricks but only 10 of them do all the interesting work, you
                can throw away the other 990 and still have a machine that behaves almost the same. SVD
                tells you exactly which 10 bricks matter most — the ones with the biggest stretch factors
                (singular values).
            </Analogy>

            <Analogy label="Why this matters for AI">
                Modern AI models have <strong>billions</strong> of numbers (parameters). Storing and
                training them is expensive. SVD lets us compress these models by keeping only the most
                important directions. It is also how Netflix recommends movies: they factorise a giant
                user-movie ratings matrix into two smaller matrices that capture hidden patterns.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Singular Value Decomposition</h2>

            <p>
                SVD is the generalisation of eigendecomposition to <strong>any</strong> matrix — square
                or rectangular. It is one of the most powerful tools in linear algebra because it reveals
                the intrinsic "shape" of a matrix.
            </p>

            <h3>The Decomposition</h3>
            <p>
                Any matrix A in <InlineMath tex="\mathbb{R}^{m \times n}" /> can be written as:
            </p>
            <MathBlock tex="A = U \Sigma V^T" />
            <p>
                where U in <InlineMath tex="\mathbb{R}^{m \times m}" /> and V in <InlineMath tex="\mathbb{R}^{n \times n}" /> are <strong>orthogonal matrices</strong> (their columns{" "}
                are unit vectors at right angles to each other), and Sigma in <InlineMath tex="\mathbb{R}^{m \times n}" /> is a diagonal matrix{" "}
                with non-negative entries sigma_1 &gt;= sigma_2 &gt;= ... &gt;= 0 called the{" "}
                <strong>singular values</strong>.
            </p>
            <p>
                Geometrically, any linear transformation can be decomposed into three steps:
            </p>
            <ol>
                <li><strong>V^T</strong> rotates the input space</li>
                <li><strong>Sigma</strong> stretches each axis by its singular value</li>
                <li><strong>U</strong> rotates the output space</li>
            </ol>

            <DiagramBlock title="SVD — any matrix decomposes into rotate -&gt; scale -&gt; rotate">
                <SVDDiagram />
            </DiagramBlock>

            <h3>Low-Rank Approximation</h3>
            <p>
                The <strong>rank</strong> of a matrix is the number of non-zero singular values. If we keep
                only the top k singular values and set the rest to zero, we get a rank-k approximation:
            </p>
            <MathBlock tex="A \approx U_k \Sigma_k V_k^T" />
            <p>
                The Eckart-Young theorem says this is the <strong>best possible</strong> rank-k approximation
                of A (in both spectral and Frobenius norm). This is incredibly useful:
            </p>
            <ul>
                <li><strong>Image compression</strong> — keep only the top 50 singular values of an image matrix</li>
                <li><strong>Recommendation systems</strong> — factorise a user-item ratings matrix into two low-rank matrices</li>
                <li><strong>Noise reduction</strong> — small singular values often represent noise; discarding them cleans the data</li>
            </ul>

            <h3>Connection to PCA</h3>
            <p>
                If you centre your data matrix X (subtract column means) and compute its SVD, the right
                singular vectors V are exactly the <strong>principal components</strong>, and the squared
                singular values divided by (n-1) are the eigenvalues of the covariance matrix. SVD avoids
                explicitly forming X^T X, which is numerically more stable.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Definitions</h2>

            <DefBlock label="Definition — Singular Value Decomposition">
                For any matrix A in <InlineMath tex="\mathbb{R}^{m \times n}" />, there exist orthogonal matrices U in <InlineMath tex="\mathbb{R}^{m \times m}" /> and{" "}
                V in <InlineMath tex="\mathbb{R}^{n \times n}" /> such that A = U Sigma V^T, where Sigma in <InlineMath tex="\mathbb{R}^{m \times n}" /> has non-negative{" "}
                diagonal entries sigma_1 &gt;= sigma_2 &gt;= ... &gt;= 0 (singular values) and zeros{" "}
                elsewhere. The columns of U are left singular vectors; the columns of V are right{" "}
                singular vectors.
            </DefBlock>

            <h3>Eckart-Young Theorem</h3>
            <p>
                Let A have rank r. For any k &lt; r, the best rank-k approximation of A in both spectral
                and Frobenius norm is given by the truncated SVD:
            </p>
            <MathBlock tex="A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^T = U_k \Sigma_k V_k^T" />
            <p>
                The approximation error is:
            </p>
            <MathBlock tex="\|A - A_k\|_F^2 = \sum_{i=k+1}^r \sigma_i^2" />
            <p>
                This means the singular values tell you exactly how much information you lose by keeping
                only k components. If the first few singular values are large and the rest are tiny, a
                low-rank approximation captures almost everything.
            </p>

            <h3>Applications in Machine Learning</h3>
            <ul>
                <li>
                    <strong>PCA</strong> — SVD of the centred data matrix X gives principal components
                    directly, without forming X^T X explicitly
                </li>
                <li>
                    <strong>Low-rank approximation</strong> — compress weight matrices while retaining
                    most of their "information"
                </li>
                <li>
                    <strong>LoRA (2022)</strong> — fine-tune LLMs efficiently by learning a low-rank{" "}
                    update Delta W = BA where B in <InlineMath tex="\mathbb{R}^{m \times r}" />, A in <InlineMath tex="\mathbb{R}^{r \times n}" />, r much less than min(m,n)
                </li>
                <li>
                    <strong>Matrix factorisation for recommendations</strong> — decompose a sparse
                    user-item rating matrix R approx U V^T where U and V have few columns
                </li>
            </ul>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import time

# ── 1. NumPy baseline — exact thin SVD ───────────────────────────────────
np.random.seed(42)
X_np = np.random.randn(100, 5).astype(np.float32)
X_np -= X_np.mean(axis=0)

U, S, Vt = np.linalg.svd(X_np, full_matrices=False)   # thin: U(100×5), S(5,), Vt(5×5)
var = (S**2 / (S**2).sum()).round(3)
print(f"[NumPy]  singular values: {S.round(2)}")
print(f"         variance explained: {var}")

k = 2
X_k = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
print(f"         rank-{k} Frobenius error: {np.linalg.norm(X_np - X_k):.4f}")

# ── 2. PyTorch — same SVD, GPU-ready ─────────────────────────────────────
print("\\n[PyTorch] torch.linalg.svd")

X = torch.from_numpy(X_np)
U_t, S_t, Vh_t = torch.linalg.svd(X, full_matrices=False)   # Vh = Vᵀ
X_k_t = U_t[:, :k] @ torch.diag(S_t[:k]) @ Vh_t[:k, :]
print(f"  rank-{k} error: {torch.linalg.norm(X - X_k_t):.4f}")
print(f"  PCA projection shape: {(X @ Vh_t[:k].T).shape}  (100 × {k})")

# ── 3. Randomised SVD — O(mnk) vs O(mn·min(m,n)) ─────────────────────────
print("\\n[Randomised] torch.svd_lowrank — fast for large sparse-ish matrices")

torch.manual_seed(0)
X_big = torch.randn(2000, 500)
k     = 20

t0 = time.perf_counter()
_, S_exact, _ = torch.linalg.svd(X_big, full_matrices=False)
exact_ms = (time.perf_counter() - t0) * 1000

t0 = time.perf_counter()
_, S_rand, _ = torch.svd_lowrank(X_big, q=k)   # rank-k randomised SVD
rand_ms = (time.perf_counter() - t0) * 1000

print(f"  Exact SVD (full):     {exact_ms:.1f} ms")
print(f"  Randomised SVD (k={k}): {rand_ms:.1f} ms  ({exact_ms/rand_ms:.1f}× faster)")
print(f"  Top singular values match: {torch.allclose(S_exact[:k], S_rand, atol=0.5)}")

# ── 4. LoRA — low-rank weight updates for fine-tuning ────────────────────
print("\\n[LoRA] low-rank weight updates (PEFT)")

d_out, d_in, rank = 768, 768, 8
W0 = torch.randn(d_out, d_in)      # frozen pre-trained weight
B  = torch.zeros(d_out, rank)      # trainable, init to zero
A  = torch.randn(rank,  d_in) * 0.02   # trainable, small init

x = torch.randn(d_in)
y = W0 @ x + B @ (A @ x)          # W₀x + ΔWx, ΔW = BA  never materialised

trainable = B.numel() + A.numel()
print(f"  Full matrix params:    {W0.numel():,}")
print(f"  LoRA trainable params: {trainable:,}  ({trainable/W0.numel()*100:.1f}% of full)")

# ── 5. Batched SVD — decompose many matrices in one call ─────────────────
print("\\n[Parallel] batched SVD over 64 matrices")

batch = torch.randn(64, 50, 20)
U_b, S_b, Vh_b = torch.linalg.svd(batch, full_matrices=False)
print(f"  input:  {list(batch.shape)}")
print(f"  U: {list(U_b.shape)}, S: {list(S_b.shape)}, Vh: {list(Vh_b.shape)}")
print(f"  64 independent SVDs computed as a single BLAS call")`

function PythonTab() {
    return (
        <>
            <p>
                From exact SVD to randomised low-rank approximation to LoRA — PyTorch's
                {" "}<code>torch.linalg.svd</code> and <code>torch.svd_lowrank</code> cover every
                scale, and batched decomposition parallelises across many matrices at once.
            </p>
            <CodeBlock code={PY_CODE} filename="svd.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> LoRA (Low-Rank Adaptation) is SVD applied to
                fine-tuning: instead of updating all W ∈ R<sup>d×d</sup>, learn only B ∈ R<sup>d×r</sup>{" "}
                and A ∈ R<sup>r×d</sup> with r ≪ d. The update ΔW = BA has rank at most r, so
                it is never materialised — just applied as two cheap matrix-vector products.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SVD_DECOMPOSITIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}