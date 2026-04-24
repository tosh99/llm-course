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
                "Ancient Chinese administrators needed to divide land, allocate grain, and settle trade disputes involving multiple simultaneous unknowns — for instance, finding the price of each of three different grades of rice given only their mixed totals.",
            what:
                "The text laid out a method of arranging coefficients in a rectangular grid of counting rods and systematically eliminating unknowns row by row — the same procedure we now call Gaussian elimination. It even handled what we would call overdetermined and underdetermined systems.",
            impact:
                "This is arguably the first recorded algorithm for solving systems of linear equations. It predates the European rediscovery by nearly two thousand years and demonstrates that linear algebra was born from commerce and administration, not abstraction.",
        },
        {
            year: "1683 – 1693",
            title: "Leibniz & the Idea of Determinants",
            challenge:
                "When trying to solve systems of two or three equations algebraically, mathematicians kept running into the same structural question: is there a single compact quantity that tells you immediately whether a unique solution exists, without actually solving the system?",
            what:
                "Gottfried Wilhelm Leibniz introduced arrays of coefficients and a quantity derived from them — what we now call the determinant — that collapses the entire solvability question to a single number. If that number is zero, the system either has no solution or infinitely many; otherwise, exactly one.",
            impact:
                "The determinant became the first example of a function that takes an entire matrix as input and returns meaningful structural information about it. This idea — distilling a matrix into a scalar — reappears constantly in ML: the determinant of a covariance matrix measures the volume of the data's spread in feature space.",
        },
        {
            year: "1750",
            title: "Cramer's Rule",
            challenge:
                "Leibniz had the concept of a determinant, but no clean formula that others could readily apply. Solving three equations in three unknowns still meant pages of algebraic substitution, with no systematic pattern a practitioner could follow.",
            what:
                "Gabriel Cramer published an explicit formula expressing each unknown as a ratio of two determinants. Given Ax = b, the i-th variable equals the determinant of A with column i replaced by b, divided by the determinant of A itself.",
            impact:
                "Cramer's Rule made linear systems approachable to anyone who could compute determinants — a major step toward treating linear algebra as a calculational tool rather than an art. It also crystallised the idea that matrices encode structure, and that you can extract information by surgically modifying them.",
        },
        {
            year: "1801 – 1809",
            title: "Gauss — Elimination & Least Squares",
            challenge:
                "Astronomers of the early 1800s had a problem that no prior mathematics could cleanly handle: they had more observations than unknowns. When trying to compute the orbit of the dwarf planet Ceres from noisy telescope measurements, any two data points gave a slightly different orbit.",
            what:
                "Carl Friedrich Gauss formalised the method of systematic row elimination (now named after him) and independently invented the method of least squares — choosing the solution that minimises the sum of squared differences between observed and predicted values. He used it to successfully predict where Ceres would reappear after passing behind the Sun.",
            impact:
                "Least squares is the direct ancestor of linear regression, and linear regression is the direct ancestor of neural networks. Every gradient descent step in a modern LLM is chasing the same fundamental idea: minimise a sum of squared errors. Gauss's 1809 work is the conceptual origin of the loss function.",
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

            <Analogy label="A system of equations = a locked chest">
                Imagine a treasure chest with three numbered locks. You have three clues:
                <em>"Lock A plus Lock B equals 10"</em>, <em>"Lock B minus Lock C equals 2"</em>, and
                <em>"Lock A plus Lock C equals 8"</em>. To open the chest, you need to find all three
                numbers at once. That is a <strong>system of equations</strong>.
            </Analogy>

            <Analogy label="Gaussian elimination = simplifying clues">
                Instead of guessing, you can <strong>eliminate</strong> one lock at a time. If you know
                A + B = 10, you can rewrite everything else in terms of just B and C. Then you eliminate
                B, leaving only C. Once you know C, you work backwards to find B and A. This step-by-step
                elimination is exactly what Gaussian elimination does.
            </Analogy>

            <Analogy label="The determinant = a magic test">
                Before solving, you can do a quick magic test. Multiply certain numbers together in a
                special pattern — this gives you the <strong>determinant</strong>. If it is zero, the
                locks are broken: either no combination works, or infinitely many do. If it is not zero,
                there is exactly one secret combination.
            </Analogy>

            <Analogy label="Least squares = the best guess">
                What if you have <em>four</em> clues but only <em>three</em> locks? The clues might
                contradict each other. Instead of giving up, you find the numbers that make <strong>most</strong>
                of the clues <strong>almost</strong> happy — minimising the total error. That is least
                squares, and it is how AI finds the best line through messy data.
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
        </>
    )
}

function MathsTab() {
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

# ── Solving a linear system ───────────────────────────────
A = np.array([[2, 3],
              [1, -1]], dtype=float)
b = np.array([8, 1], dtype=float)

x = np.linalg.solve(A, b)
print("Solution:", x)          # -> [2.2  1.2]

# Verify: A @ x should equal b
print("Residual:", A @ x - b)   # -> [0. 0.]

# ── Determinants ──────────────────────────────────────────
print("det(A):", np.linalg.det(A))   # -> -5.0

# Singular matrix -> determinant is (near) zero
S = np.array([[1, 2],
              [2, 4]], dtype=float)
print("det(S):", np.linalg.det(S))   # -> 0.0 (singular)

# ── Least squares (overdetermined system) ─────────────────
# Generate noisy linear data: y = 2x + 1 + noise
np.random.seed(0)
x_data = np.random.rand(50)
y_data = 2 * x_data + 1 + 0.1 * np.random.randn(50)

# Build design matrix A = [x  1] and solve min ||A @ [m, c] - y||^2
A_ls = np.column_stack([x_data, np.ones_like(x_data)])
m, c = np.linalg.lstsq(A_ls, y_data, rcond=None)[0]
print(f"Best fit line: y = {m:.3f}x + {c:.3f}")
# -> y = 1.965x + 1.023 (close to the true 2x + 1)`

function PythonTab() {
    return (
        <>
            <p>
                NumPy's linear algebra routines handle everything from small 2x2 systems to large
                least-squares problems that arise when fitting models to data.
            </p>
            <CodeBlock code={PY_CODE} filename="systems_equations.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Production tip:</strong> For least squares, prefer <code>np.linalg.lstsq</code>
                over manually computing <code>(A.T @ A)^{-1} @ A.T @ b</code>. The built-in routine uses
                SVD under the hood, which is numerically stable even when A.T @ A would be ill-conditioned.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SYSTEMS_EQUATIONS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
