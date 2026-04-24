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
                "Eigendecomposition (Σ = QΛQ^T) works beautifully for square symmetric matrices like covariance matrices. But most real data matrices are rectangular — m samples and n features, with m ≠ n. These matrices have no eigenvalues in the traditional sense, because eigenvectors must live in the same space as their images and rectangular matrices map between two different spaces. The 'natural axes' story had no rectangular analogue.",
            what:
                "Eugenio Beltrami (1873) and Camille Jordan (1874) independently discovered that any matrix A — even rectangular — can be written as A = UΣV^T: a rotation U of the output space, a diagonal scaling Σ stretching each axis by a non-negative singular value, and a rotation V^T of the input space. The singular values are the square roots of the eigenvalues of A^T A. Every linear transformation, regardless of shape, does exactly these three things.",
            impact:
                "SVD is the Swiss Army knife of numerical linear algebra. It works for any matrix shape, is more numerically stable than eigendecomposition, and applies everywhere eigendecomposition does — plus everywhere it doesn't. In ML: PCA via SVD of the centred data matrix (more stable than forming X^T X), image compression (keep top-k singular values), recommendation systems (matrix factorisation), and LoRA fine-tuning (constraining weight updates to a low-rank subspace). The next question — how good is a truncated SVD approximation? — is what Eckart and Young answered.",
        },
        {
            year: "1936",
            title: "Eckart & Young — The Optimal Low-Rank Approximation",
            challenge:
                "Once you have an SVD, you can zero out small singular values and reconstruct an approximation of the original matrix — but is this actually the best possible rank-k approximation? Could some other rank-k matrix be closer to the original? There are infinitely many rank-k matrices to search over, and without a theorem, truncated SVD was just a heuristic.",
            what:
                "Carl Eckart and Gale Young proved that the truncated SVD — keeping only the top k singular values — gives the best possible rank-k approximation of A, in both the spectral norm and the Frobenius norm. No other rank-k matrix is closer. The approximation error is exactly: ||A − A_k||²_F = σ²_{k+1} + σ²_{k+2} + ... The singular values themselves tell you precisely how much information you lose at each truncation level.",
            impact:
                "The Eckart-Young theorem justifies every matrix compression technique in ML. PCA is optimal linear dimensionality reduction. LoRA's claim that weight updates live in a low-rank subspace is validated by Eckart-Young — it guarantees the SVD approximation is the best you can do for a given rank budget. The theorem also reveals when low-rank approximation is appropriate: if singular values decay rapidly, a few components capture almost everything.",
        },
        {
            year: "1965",
            title: "Golub & Reinsch — A Stable Algorithm for Computing SVD",
            challenge:
                "Beltrami, Jordan, and Eckart-Young gave the theory of SVD, but computing it reliably for large matrices was numerically treacherous. Early implementations often failed to converge or produced inaccurate results due to floating-point cancellation. There was no algorithm that a practitioner could apply to any matrix and trust.",
            what:
                "Gene Golub and Christian Reinsch developed the algorithm that is still the default in every numerical library. Their two-phase approach: first reduce A to bidiagonal form using numerically stable Householder reflections; then apply an iterative QR algorithm to the bidiagonal matrix, converging rapidly to the diagonal Σ. The algorithm runs in O(m·n·min(m,n)) time with rigorous numerical stability guarantees.",
            impact:
                "Every call to torch.linalg.svd() or np.linalg.svd() uses Golub-Reinsch under the hood. The algorithm's reliability made SVD the practical workhorse of numerical computing. This brings us to an important question: given a best-fit matrix decomposition, how do we know if the decomposition is statistically meaningful — are those singular values real signal or just noise? That question of statistical significance is the subject of our next topic.",
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

            <p className="ch-story-intro">
                Eigenvectors reveal the natural axes of square matrices. But most real data is rectangular — more examples than features, or vice versa. SVD is the generalisation: it finds the natural axes of <em>any</em> matrix, regardless of shape.
            </p>

            <Analogy label="SVD = disassemble, scale, reassemble">
                Imagine a complicated LEGO machine. Instead of trying to understand all the bricks at once, take it apart into three simpler steps: first rotate the whole thing (V^T), then stretch or squish each axis independently (Σ), then rotate it again (U). That is what SVD does to any matrix — even a rectangular one with more rows than columns.
                <br /><br />
                The three steps together can reproduce any linear transformation exactly — and they make the structure of the transformation transparent.
            </Analogy>

            <Analogy label="Singular values = a ranking of importance">
                The stretch factors in the middle step are called <strong>singular values</strong> — σ₁ ≥ σ₂ ≥ ... ≥ 0. The first direction gets stretched the most (most important). The second gets stretched less (second most important). And so on, all the way down to near-zero (almost meaningless).
                <br /><br />
                In Netflix's recommendation system, the largest singular values capture dominant patterns: "people who like action" and "people who like romance." The tiny ones capture rare, idiosyncratic preferences affecting very few users. Keeping only the big ones gives a compact, useful summary of millions of ratings.
            </Analogy>

            <Analogy label="Low-rank approximation = keep only the important bricks">
                If your LEGO machine has 1000 bricks but only 10 do all the interesting work, throw away the other 990. SVD tells you exactly which 10 matter most. Eckart and Young (1936) proved this is not just convenient — it's the <em>best possible</em> approximation for any given number of bricks you want to keep.
            </Analogy>

            <Analogy label="LoRA = fine-tuning with only the important directions">
                A giant AI model has billions of parameters — like a LEGO machine with billions of bricks. When you want to teach it a new skill (like writing medical reports), you don't retrain everything. LoRA adds two small matrices (a few hundred bricks) that capture the most important update directions. SVD's Eckart-Young theorem guarantees you're keeping the right ones.
                <br /><br />
                Result: 1–2% of the parameters, 90%+ of the performance.
            </Analogy>

            <Analogy label="What comes next — is this pattern real or just noise?">
                SVD gives us the best possible decomposition. But here's a nagging worry: what if the top singular values we found are just random noise — a coincidence of the specific data we happened to see? How do we know our patterns are <em>real</em> and not just lucky? That question of distinguishing signal from noise is exactly what <strong>statistical inference</strong> — our next topic — is designed to answer.
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
                    update ΔW = BA where B in <InlineMath tex="\mathbb{R}^{m \times r}" />, A in <InlineMath tex="\mathbb{R}^{r \times n}" />, r much less than min(m,n)
                </li>
                <li>
                    <strong>Matrix factorisation for recommendations</strong> — decompose a sparse
                    user-item rating matrix R ≈ UV^T where U and V have few columns
                </li>
                <li>
                    <strong>Statistical interpretation</strong> — which singular values represent real signal
                    versus sampling noise? This is a statistical inference question, and it is the subject of our next topic.
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

function PythonContent() {
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
    maths:      null,
    python:     null,
}