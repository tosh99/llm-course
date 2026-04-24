import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
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
            year: "approx 200 BCE",
            title: "The Nine Chapters on the Mathematical Art",
            challenge:
                "Setting the derivative of a loss to zero — as calculus tells us to do — produces a set of equations that all must be satisfied simultaneously. Ancient Chinese administrators faced exactly this kind of multi-equation problem in their daily work: finding the price of each of three grades of rice given only their mixed purchase totals. These problems scaled to five or six unknowns, with no algebraic notation available. Every step had to be tracked physically on counting boards.",
            what:
                "The text arranged coefficients in a rectangular grid of counting rods and systematically eliminated unknowns row by row — the same procedure we now call Gaussian elimination. The key insight: combining rows (adding a multiple of one equation to another) eliminates one unknown without disturbing the solution. The text handled all three cases: a unique solution, no solution (inconsistent equations), and infinitely many solutions — the complete classification still used today.",
            impact:
                "This is the first recorded algorithm for solving linear systems — a deterministic, step-by-step procedure applicable to any system of the described type. The elimination structure is identical to the code that runs inside every call to torch.linalg.solve() today. Two thousand years of computational history, one algorithm.",
        },
        {
            year: "1683 – 1693",
            title: "Leibniz & the Idea of Determinants",
            challenge:
                "When solving systems of two or three equations, mathematicians kept encountering the same structural question: is there a single compact quantity that reveals whether a unique solution exists, without actually solving the system? Leibniz was systematically studying what information was encoded in a matrix's coefficients, independent of the right-hand side values.",
            what:
                "Leibniz introduced arrays of coefficients and a quantity derived from them — what we now call the determinant — that collapses the entire solvability question to a single number. If that number is zero, the system either has no solution or infinitely many; otherwise, exactly one. He also discovered the alternating-sign pattern of cofactor expansion, enabling recursive computation of determinants for large systems.",
            impact:
                "The determinant became the first function that takes an entire matrix as input and returns meaningful structural information. Geometrically, |det(A)| equals the volume-scaling factor of the transformation A — how much it stretches or compresses space. When det(A) = 0, the transformation collapses space to a lower dimension, explaining why no unique solution exists. In ML, a covariance matrix with det = 0 means the data has perfectly correlated features and PCA will fail.",
        },
        {
            year: "1750",
            title: "Cramer's Rule — A Formula, Not Just a Concept",
            challenge:
                "Leibniz's work on determinants was scattered across private manuscripts. Mathematicians knew the concept existed but had no portable formula they could teach or apply. Solving a 4×4 system meant pages of ad-hoc elimination, with every new problem requiring starting from scratch.",
            what:
                "Gabriel Cramer published an explicit formula: given Ax = b, the i-th variable xᵢ = det(Aᵢ)/det(A), where Aᵢ is A with its i-th column replaced by b. The geometric meaning is elegant — the ratio measures how much the volume changes when b replaces one column. This gave practitioners a mechanical recipe that required only computing determinants.",
            impact:
                "Cramer's Rule is almost never used computationally — it costs O(n!) naively versus O(n³) for Gaussian elimination. But it crystallised the key idea: matrices encode structure, and you can extract information by surgically modifying them. This is the conceptual origin of the pseudoinverse x = A⁺b = (A^T A)^{-1} A^T b — the matrix-level Cramer formula for overdetermined systems that appears in every linear regression.",
        },
        {
            year: "1801 – 1809",
            title: "Gauss — Elimination & Least Squares",
            challenge:
                "Astronomers faced a problem calculus created: setting the derivative of the squared-error sum to zero produced a system of equations, but with more observations than unknowns, the system was overdetermined. Any two telescope measurements of Ceres's position gave a slightly different orbit — the data contradicted itself, and no exact solution existed.",
            what:
                "Gauss formalised systematic row elimination and invented least squares: minimise the sum of squared differences between observed and predicted values. Setting the gradient of Σ(Ax − b)² to zero yields the normal equations A^T Ax = A^T b — a square, solvable linear system. He used it to predict where Ceres would reappear after passing behind the Sun — and was correct to within half a degree.",
            impact:
                "Least squares is the direct ancestor of linear regression, and linear regression is the direct ancestor of neural networks. Gauss also proved that least squares gives the most probable estimate when measurement errors follow a bell-shaped (Gaussian) distribution — the first rigorous connection between solving equations and modelling probability. This bridge — from algebra to uncertainty — leads directly to our next topic: probability itself.",
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
            <h2>Solving puzzles with equations</h2>

            <p className="ch-story-intro">
                In the last topic, we learned that setting a derivative to zero finds the minimum of a function. But when a model has multiple parameters — multiple "knobs" to adjust — setting all partial derivatives to zero gives us <em>multiple equations at once</em>. We need to solve them simultaneously. That's a system of equations.
            </p>

            <Analogy label="A system of equations = a locked chest">
                Imagine a treasure chest with three numbered locks. You have three clues:
                <em>"Lock A plus Lock B equals 10"</em>, <em>"Lock B minus Lock C equals 2"</em>, and
                <em>"Lock A plus Lock C equals 8"</em>. To open the chest, you need to find all three numbers at once — changing one changes everything. That is a <strong>system of equations</strong>, and it arises naturally any time a model has multiple unknowns.
            </Analogy>

            <Analogy label="Gaussian elimination = simplifying clues one at a time">
                Instead of guessing, you can <strong>eliminate</strong> one lock at a time. If you know A + B = 10, subtract it from another equation to cancel A. Then eliminate B, leaving only C. Once you know C, work backwards to find B, then A. This step-by-step simplification is exactly what Gaussian elimination does — and it's the algorithm inside every call to numpy.linalg.solve().
            </Analogy>

            <Analogy label="The determinant = a quick check before you start">
                Before solving, you can run a quick test. Multiply certain numbers together in a special criss-cross pattern — this gives you the <strong>determinant</strong>. If it's zero, something is wrong: either no combination of locks works, or infinitely many do. If it's not zero, there is exactly one secret combination. It's faster to check solvability first than to run elimination and discover midway that the system is broken.
            </Analogy>

            <Analogy label="Least squares = the best guess when clues contradict each other">
                What if you have <em>four</em> clues but only <em>three</em> locks — and the four clues slightly disagree? A noisy measurement from a different day gives a different answer. Instead of giving up, you find the numbers that make <em>most</em> of the clues <em>almost</em> happy — minimising the total error. That is <strong>least squares</strong>, and it is exactly how Gauss found Ceres's orbit — and how every linear regression model is trained.
            </Analogy>

            <Analogy label="Underdetermined systems = too many solutions">
                What if you only have <em>one</em> clue for three locks — "Lock A + Lock B + Lock C = 30"? That's not enough: infinitely many combinations work. The system is <strong>underdetermined</strong> — not enough equations to pin down a unique answer.
                <br /><br />
                Neural networks with billions of parameters and only millions of training examples are deeply underdetermined. Many parameter settings fit the training data equally well. That's why regularisation exists — it adds extra preferences (like "keep weights small") to select one solution from among the infinitely many.
            </Analogy>

            <Analogy label="What comes next — where do the numbers come from?">
                We've learned to solve systems of equations — but where do the coefficients come from? In Gauss's Ceres problem, they came from telescope measurements with random errors. Those errors followed a specific bell-shaped pattern. Understanding that pattern — and reasoning carefully about uncertainty — is the job of <strong>probability theory</strong>, our next topic.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Solving systems of linear equations</h2>

            <p>
                A <strong>system of linear equations</strong> is a set of equations with the same variables.
                For example, two equations in two unknowns:
            </p>
            <MathBlock tex="\begin{cases} 2x + 3y = 8 \\ x - y = 1 \end{cases}" />
            <p>
                The goal is to find values of x and y that satisfy <em>both</em> equations simultaneously.
                Geometrically, each equation represents a line, and the solution is their intersection point.
            </p>

            <h3>Gaussian Elimination</h3>
            <p>
                The idea is simple: use one equation to eliminate a variable from the others. Write the
                system as an <strong>augmented matrix</strong> — coefficients on the left, constants on the right:
            </p>
            <MathBlock tex="\left(\begin{array}{cc|c} 2 & 3 & 8 \\ 1 & -1 & 1 \end{array}\right)" />
            <p>
                Perform <strong>row operations</strong>: swap rows, multiply a row by a constant, or add a
                multiple of one row to another. The goal is <strong>row echelon form</strong> — a staircase
                of leading ones where each row has its first non-zero entry to the right of the row above.
                Once in this form, back-substitution gives the solution.
            </p>

            <h3>Determinants</h3>
            <p>
                The <strong>determinant</strong> of a square matrix is a single number that encodes whether
                the matrix is invertible. For a 2x2 matrix:
            </p>
            <MathBlock tex="\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc" />
            <p>
                For a 3x3 matrix, the determinant expands along a row or column using <strong>minors</strong>
                and <strong>cofactors</strong>. The general pattern: sum over permutations, each term being
                a product of entries with a sign determined by the permutation's parity.
            </p>
            <ul>
                <li><strong>det(A) != 0</strong> — A is invertible, Ax = b has a unique solution</li>
                <li><strong>det(A) = 0</strong> — A is singular: either no solution or infinitely many</li>
            </ul>
            <p>
                In ML, determinants appear when computing the volume change of transformations (change of
                variables in probability densities) and when testing if a covariance matrix is degenerate.
            </p>

            <h3>Cramer's Rule</h3>
            <p>
                If det(A) != 0, each variable x_i can be computed directly as a ratio of determinants:
            </p>
            <MathBlock tex="x_i = \frac{\det(A_i)}{\det(A)}" />
            <p>
                where A_i is A with its i-th column replaced by the vector b. Cramer's Rule is beautiful
                in theory but impractical for large systems — computing n+1 determinants of size n is
                O(n!) with naive methods, while Gaussian elimination is O(n^3).
            </p>

            <h3>Least Squares — when there is no exact solution</h3>
            <p>
                In real-world data, we often have <strong>more equations than unknowns</strong> (an
                overdetermined system). No exact solution exists because the data is noisy. Least squares
                finds the <strong>x</strong> that minimises the sum of squared residuals:
            </p>
            <MathBlock tex="\min_x \|Ax - b\|_2^2" />
            <p>
                Take the derivative with respect to x and set it to zero. This yields the <strong>normal
                equations</strong>:
            </p>
            <MathBlock tex="A^\top A \mathbf{x} = A^\top \mathbf{b}" />
            <p>
                If A^T A is invertible, the unique least-squares solution is:
            </p>
            <MathBlock tex="\mathbf{x} = (A^\top A)^{-1} A^\top \mathbf{b}" />
            <p>
                This is the mathematical foundation of <strong>linear regression</strong>. Every time you
                fit a line to scattered data points, you are solving a least-squares problem. Modern deep
                learning generalises this idea: instead of a linear model Ax, we use a neural network
                f(x; theta), and gradient descent minimises a loss function — conceptually the same as
                least squares, but with a vastly more complex model.
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

            <DefBlock label="Definition — Linear System">
                A system of m linear equations in n unknowns can be written as A<strong>x</strong> = <strong>b</strong>{" "}
                where A in <InlineMath tex="\mathbb{R}^{m \times n}" /> is the coefficient matrix, <strong>x</strong> in <InlineMath tex="\mathbb{R}^n" /> is the vector of unknowns,{" "}
                and <strong>b</strong> in <InlineMath tex="\mathbb{R}^m" /> is the constant vector. The system is:{" "}
                <em>consistent</em> if at least one solution exists; <em>inconsistent</em> otherwise.
            </DefBlock>

            <h3>Gaussian Elimination &amp; LU Decomposition</h3>
            <p>
                Gaussian elimination performs elementary row operations to reduce A to <strong>row echelon
                form</strong> (REF) or <strong>reduced row echelon form</strong> (RREF). The operations are:
            </p>
            <ul>
                <li>Swap two rows</li>
                <li>Multiply a row by a non-zero scalar</li>
                <li>Add a multiple of one row to another row</li>
            </ul>
            <p>
                Every matrix A can be decomposed as A = LU, where L is lower triangular with ones on the
                diagonal and U is upper triangular. Solving Ax = b then becomes two triangular solves:
                L<strong>y</strong> = <strong>b</strong> (forward substitution), then U<strong>x</strong> = <strong>y</strong>
                (back substitution). LU decomposition is the workhorse inside numerical libraries.
            </p>

            <h3>The Determinant</h3>
            <p>
                For A in <InlineMath tex="\mathbb{R}^{n \times n}" />, the determinant is defined as:
            </p>
            <MathBlock tex="\det(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma) \prod_{i=1}^n a_{i, \sigma(i)}" />
            <p>
                where S_n is the set of all permutations of {'{1, ..., n}'} and sgn(sigma) is the permutation's{" "}
                parity (+1 for even, -1 for odd). Key properties:
            </p>
            <ul>
                <li>det(AB) = det(A) det(B)</li>
                <li>det(A^T) = det(A)</li>
                <li>det(A^{-1}) = 1 / det(A)</li>
                <li>Swapping two rows flips the sign of the determinant</li>
                <li>Adding a multiple of one row to another leaves the determinant unchanged</li>
            </ul>

            <h3>Least Squares — Normal Equations</h3>
            <p>
                For an overdetermined system (m &gt; n) with full-rank A, the least-squares problem
                min ||Ax - b||_2^2 has the closed-form solution via the normal equations:
            </p>
            <MathBlock tex="\mathbf{x} = (A^\top A)^{-1} A^\top \mathbf{b}" />
            <p>
                The matrix (A^T A)^{-1} A^T is the <strong>Moore-Penrose pseudoinverse</strong> A^+.
                In practice, solving via QR decomposition or SVD is numerically stabler than forming
                A^T A explicitly, which squares the condition number.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
import torch
import time

# ── 1. NumPy baseline — solve and lstsq ──────────────────────────────────
A_np = np.array([[2., 3.], [1., -1.]])
b_np = np.array([8., 1.])
x_np = np.linalg.solve(A_np, b_np)
print(f"[NumPy]  x = {x_np}  residual = {np.linalg.norm(A_np @ x_np - b_np):.2e}")

np.random.seed(0)
x_d = np.random.rand(50);  y_d = 2*x_d + 1 + 0.1*np.random.randn(50)
A_ls_np = np.column_stack([x_d, np.ones_like(x_d)])
m_np, c_np = np.linalg.lstsq(A_ls_np, y_d, rcond=None)[0]
print(f"         lstsq: y = {m_np:.3f}x + {c_np:.3f}  (true: 2.000x + 1.000)")

# ── 2. PyTorch linalg.solve — GPU-ready ──────────────────────────────────
print("\\n[PyTorch] torch.linalg.solve")

A = torch.tensor([[2., 3.], [1., -1.]])
b = torch.tensor([8., 1.])
x = torch.linalg.solve(A, b)
print(f"  x = {x.tolist()}  residual = {(A @ x - b).norm():.2e}")
print(f"  det(A)={torch.linalg.det(A).item():.2f}  cond(A)={torch.linalg.cond(A).item():.2f}")

S = torch.tensor([[1., 2.], [2., 4.]])
print(f"  singular matrix det = {torch.linalg.det(S).item():.4f}  (near 0 → ill-posed)")

# ── 3. Batched solve — 256 systems in one LAPACK call ────────────────────
print("\\n[Batched] solve 256 systems simultaneously")

torch.manual_seed(0)
batch   = 256
A_batch, _ = torch.linalg.qr(torch.randn(batch, 4, 4))  # 256 orthogonal 4×4 matrices
b_batch    = torch.randn(batch, 4)

t0 = time.perf_counter()
x_batch = torch.linalg.solve(A_batch, b_batch)           # (256, 4) — all at once
ms = (time.perf_counter() - t0) * 1000

residuals = (A_batch @ x_batch.unsqueeze(-1) - b_batch.unsqueeze(-1)).norm(dim=1).max()
print(f"  {batch} systems (4×4) in {ms:.1f} ms  |  max residual = {residuals.item():.2e}")

# ── 4. Least squares via PyTorch ─────────────────────────────────────────
print("\\n[Least squares] torch.linalg.lstsq")

torch.manual_seed(1)
x_t = torch.rand(50);  y_t = 2*x_t + 1 + 0.1*torch.randn(50)
A_ls = torch.stack([x_t, torch.ones_like(x_t)], dim=1)   # design matrix (50×2)
sol  = torch.linalg.lstsq(A_ls, y_t.unsqueeze(1)).solution
print(f"  y = {sol[0].item():.3f}x + {sol[1].item():.3f}")

# ── 5. Linear regression via gradient descent ─────────────────────────────
print("\\n[Gradient descent] linear regression with autograd")

torch.manual_seed(0)
w = torch.zeros(2, requires_grad=True)
for _ in range(300):
    loss = ((A_ls @ w - y_t)**2).mean()
    loss.backward()
    with torch.no_grad():
        w -= 0.1 * w.grad
    w.grad.zero_()
print(f"  GD: y = {w[0].item():.3f}x + {w[1].item():.3f}  loss={loss.item():.6f}")`

function PythonContent() {
    return (
        <>
            <p>
                From scalar systems to batched solves over 256 matrices simultaneously —
                PyTorch's <code>torch.linalg</code> mirrors NumPy's API at any scale,
                and autograd turns least squares into a one-liner training loop.
            </p>
            <CodeBlock code={PY_CODE} filename="systems_equations.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Gradient descent on the least-squares objective
                converges to the same solution as <code>lstsq</code> — but GD generalises
                to any loss and any model architecture. Linear regression is the
                degenerate case where one step of Newton's method (the normal equations)
                gives the exact answer. Gauss also proved that least squares is the
                maximum-likelihood estimate when measurement errors are Gaussian —
                the first bridge between algebra and probability. That bridge is where our next
                topic, probability foundations, begins.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SYSTEMS_EQUATIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
