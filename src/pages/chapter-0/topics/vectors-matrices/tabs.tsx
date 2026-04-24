import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import { DiagramBlock, DotProductDiagram, MatTransformDiagram } from "./diagrams"
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
            title: "Cayley & Hamilton — Matrix Algebra as an Object",
            challenge:
                "By the mid-1800s, mathematicians were applying linear transformations constantly — in mechanics, optics, and abstract algebra. But they had no unified notation. Every transformation had to be spelled out as a full system of equations, making composition laborious and error-prone.",
            what:
                "Arthur Cayley published A Memoir on the Theory of Matrices (1858), defining matrices as first-class mathematical objects with their own addition and multiplication rules. He showed that composing two transformations corresponds exactly to multiplying their matrices, and proved the Cayley–Hamilton theorem.",
            impact:
                "This is the moment linear algebra became a language rather than a technique. Once you can write Ax = b, AB, and Aⁿ as single expressions, the theory becomes both concise and general. Modern neural network notation — forward pass as Wx + b — is a direct descendant of this notational leap.",
        },
        {
            year: "1888",
            title: "Peano — Abstract Vector Spaces",
            challenge:
                "By the late 1800s, mathematicians noticed that the same algebraic rules kept reappearing in wildly different settings: arrays of numbers, sets of polynomials, spaces of continuous functions. Each required separate theorems proved separately.",
            what:
                "Giuseppe Peano wrote down the eight axioms of a vector space — abstract rules about addition and scalar multiplication. He showed that polynomials, functions, and sequences all fit the same mould as ordinary Euclidean vectors.",
            impact:
                "In ML, word embeddings, image patches, and audio spectrograms all live in different spaces, but because each is a vector space, the same algorithms (nearest-neighbour search, PCA, linear classifiers) apply uniformly. Peano's axioms are why one framework like PyTorch can handle text, images, and audio with the same code.",
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
            <h2>Let's talk about arrows and grids</h2>

            <Analogy label="Vectors = Arrows">
                Imagine you are standing in your bedroom. A <strong>vector</strong> is like an instruction:
                <em>"walk 3 steps forward and 2 steps to the right."</em> That arrow has two things — how
                far and which way. You can add two arrows together by following them one after the other.
            </Analogy>

            <Analogy label="Matrices = Magic Machines">
                A <strong>matrix</strong> is like a machine with buttons. You put your arrow in, and out
                comes a <em>different</em> arrow — maybe stretched, rotated, or flipped. The numbers inside
                the matrix decide exactly what the machine does to your arrow.
            </Analogy>

            <Analogy label="Dot Product = How Similar?">
                If you and your friend both point arrows, the <strong>dot product</strong> tells you how
                much your arrows "agree." Same direction = big number. Opposite directions = negative.
                Pointing at right angles = zero. Totally different directions!
            </Analogy>

            <Analogy label="Why does all this matter for AI?">
                In a neural network, every word, image, and sound is turned into an arrow (a vector of
                numbers). The network uses matrix machines to slowly bend and reshape those arrows until
                <strong>similar things end up pointing in similar directions</strong>. That is how it learns
                to tell a cat from a dog!
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From coordinate geometry to transformations</h2>

            <p>
                You already know that a point (3, 2) lives on a 2D grid. A <strong>vector</strong> is just
                that point thought of as an arrow from the origin — go 3 units right, 2 units up.
            </p>

            <h3>Adding Vectors</h3>
            <p>
                Adding two vectors is like taking two trips back-to-back. You have seen this in physics as
                combining forces or velocities: (3, 2) + (1, 4) = (4, 6).
            </p>

            <h3>Scalar Multiplication</h3>
            <p>
                Multiplying by a number just stretches or shrinks the arrow: 2 * (3, 2) = (6, 4). Same
                direction, twice as long.
            </p>

            <h3>The Dot Product — your new best friend</h3>
            <p>
                Given two vectors <strong>a</strong> = (a_1, a_2) and <strong>b</strong> = (b_1, b_2):
            </p>
            <MathBlock tex="\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 = |\\vec{a}||\\vec{b}|\\cos\\theta" />
            <p>
                The dot product measures how much two vectors "point the same way." When theta = 90 degrees,
                cos theta = 0 — orthogonal vectors have zero dot product. In ML this is used constantly to measure
                similarity between embeddings.
            </p>

            <h3>Matrices as Transformations</h3>
            <p>
                A 2x2 matrix A applied to vector <strong>x</strong> produces a new vector
                <strong>y</strong> = A<strong>x</strong> — a coordinate transformation, like the same shape
                seen in a distorted mirror.
            </p>
            <MathBlock tex="\\begin{pmatrix} 2 & 0 \\ 0 & 3 \\end{pmatrix} \\begin{pmatrix} 1 \\ 1 \\end{pmatrix} = \\begin{pmatrix} 2 \\ 3 \\end{pmatrix}" />
            <p>
                This matrix stretched x by 2 and y by 3. Every neural network layer does something like
                this — projecting input into a new space where patterns are easier to see.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Definitions</h2>
            <p>
                What follows is the rigorous foundation underlying every operation in a neural network.
                Each definition is paired with its practical meaning in ML.
            </p>

            <DefBlock label="Definition — Vector Space">
                A set V over field F with operations +: VxV -&gt; V and *: FxV -&gt; V satisfying 8 axioms:
                commutativity and associativity of addition, distributivity of scalars, existence of a
                zero vector (additive identity), and additive inverses. Every point in activation space,
                every weight tensor, every embedding lives in some vector space.
            </DefBlock>

            <h3>Vectors &amp; Norms</h3>
            <p>
                A vector <strong>x</strong> in R^n is an ordered n-tuple of real numbers. The
                <strong>norm</strong> measures its "size." The general L^p norm family is:
            </p>
            <MathBlock tex="\\|\\mathbf{x}\\|_p = \\left(\\sum_{i=1}^n |x_i|^p\\right)^{1/p}" />
            <p>
                The choice of p matters. <strong>L^2 (p=2)</strong> is Euclidean distance — it is the
                natural notion of "length" and appears in MSE loss and weight decay. <strong>L^1 (p=1)</strong>
                sums absolute values and appears in MAE loss and LASSO regularisation, which encourages
                sparse solutions.
            </p>

            <h3>Inner Product &amp; Cosine Similarity</h3>
            <p>
                The <strong>inner product</strong> (dot product) is the fundamental operation that
                measures alignment between two vectors:
            </p>
            <MathBlock tex="\\langle \\mathbf{a}, \\mathbf{b} \\rangle = \\mathbf{a}^\\top \\mathbf{b} = \\sum_{i=1}^n a_i b_i" />
            <p>
                It equals <InlineMath tex="\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|\\cos\\theta" />, so dividing by both
                norms yields <strong>cosine similarity</strong> — a scale-invariant measure of directional
                agreement. This is used in: word embedding analogies, attention score computation in
                Transformers <InlineMath tex="(\\mathbf{q}^\\top \\mathbf{k})" />, nearest-neighbour search
                in RAG systems, and contrastive learning objectives like CLIP.
            </p>
            <MathBlock tex="\\cos\\theta = \\frac{\\mathbf{a}^\\top \\mathbf{b}}{\\|\\mathbf{a}\\|\\|\\mathbf{b}\\|} \\in [-1, 1]" />

            <DiagramBlock title="Dot product geometry — vectors a and b, angle theta, and projection">
                <DotProductDiagram />
            </DiagramBlock>

            <h3>Matrix Multiplication</h3>
            <p>
                For <InlineMath tex="A \\in \\mathbb{R}^{m\\times k}" /> and
                <InlineMath tex="B \\in \\mathbb{R}^{k\\times n}" />, their product
                <InlineMath tex="C = AB \\in \\mathbb{R}^{m\\times n}" /> has entries:
            </p>
            <MathBlock tex="C_{ij} = \\sum_{l=1}^k A_{il}\\, B_{lj}" />
            <p>
                Think of C's (i,j) entry as the dot product of row i of A with column j of B. This
                operation is the engine of neural networks — a forward pass through a linear layer is
                <InlineMath tex="\\mathbf{y} = W\\mathbf{x} + \\mathbf{b}" />. The entire reason GPUs exist
                in ML is that they can compute batches of matrix products in parallel using thousands of
                cores. Matrix multiplication is associative but <em>not commutative</em>: AB != BA in
                general.
            </p>

            <DiagramBlock title="Matrix transformation — how a linear map stretches the unit square">
                <MatTransformDiagram />
            </DiagramBlock>

            <h3>Gradient as a Vector</h3>
            <p>
                For a scalar loss function <InlineMath tex="\\mathcal{L}: \\mathbb{R}^n \\to \\mathbb{R}" />,
                the gradient <InlineMath tex="\\nabla_\\mathbf{x} \\mathcal{L} \\in \\mathbb{R}^n" /> stacks
                all partial derivatives into a vector. It points in the direction of steepest ascent — so
                stepping opposite to it descends the loss:
            </p>
            <MathBlock tex="\\mathbf{x}_{t+1} = \\mathbf{x}_t - \\eta\\,\\nabla_\\mathbf{x} \\mathcal{L}(\\mathbf{x}_t)" />
            <p>
                For a neural network with millions of parameters, this is one giant high-dimensional vector
                update per step. The learning rate eta controls step size.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Creating vectors and matrices ─────────────────────────
v = np.array([1.0, 2.0, 3.0])        # 1-D array = vector
W = np.array([[0.5, -0.2,  0.8],     # 2D array = matrix
              [0.1,  0.9, -0.3]])

# ── Vector operations ─────────────────────────────────────
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0, 6.0])

print(a + b)                          # element-wise add  -> [5. 7. 9.]
print(a * 2)                          # scalar multiply   -> [2. 4. 6.]
print(np.dot(a, b))                   # dot product       -> 32.0

# L2 norm — two equivalent ways
print(np.linalg.norm(a))              # -> 3.7417
print(np.sqrt(np.dot(a, a)))          # -> 3.7417

# Cosine similarity — used everywhere in ML (attention, retrieval)
def cosine_sim(x, y):
    return np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

king  = np.array([0.8, 0.2, 0.1])
queen = np.array([0.7, 0.3, 0.2])
print(f"cosine similarity: {cosine_sim(king, queen):.4f}")  # -> 0.9984

# ── Matrix operations ─────────────────────────────────────
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A @ B)          # matrix multiply (@ is matmul)   -> [[19 22] [43 50]]
print(A @ v[:2])      # matrix * vector                 -> [ 5. 11.]
print(A.T)            # transpose                       -> [[1 3] [2 4]]

# ── Linear layer: y = Wx + b ──────────────────────────────
# This is exactly what nn.Linear does in PyTorch
x = np.array([1.0, 2.0, 3.0])        # input (3-dim)
b = np.array([0.1, -0.1])            # bias (2-dim)

y = W @ x + b                        # output (2-dim)
print(y)                              # -> [2.5  1.9]`

function PythonTab() {
    return (
        <>
            <p>
                NumPy is the foundation of scientific Python. Under the hood, every operation dispatches
                to optimised BLAS/LAPACK routines written in C and Fortran — the same code powering
                PyTorch's CPU path.
            </p>
            <CodeBlock code={PY_CODE} filename="vectors_matrices.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The <code>@</code> operator is matrix multiplication.
                Cosine similarity appears everywhere in ML: attention scores, word embeddings, and
                retrieval systems all rely on the same dot-product calculation.
            </div>
        </>
    )
}

const TS_CODE = `// ── Types ────────────────────────────────────────────────
type Vec = number[];
type Mat = number[][];  // row-major: Mat[row][col]

// ── Vector Operations ─────────────────────────────────────

/** Element-wise addition */
function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v + b[i]);
}

/** Scale a vector by a scalar */
function vecScale(a: Vec, s: number): Vec {
  return a.map(v => v * s);
}

/** Dot product: Sigma a_i * b_i  — the workhorse of neural networks */
function dot(a: Vec, b: Vec): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

/** L2 (Euclidean) norm */
function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}

/** Cosine similarity — measures direction, ignores magnitude */
function cosineSim(a: Vec, b: Vec): number {
  return dot(a, b) / (norm(a) * norm(b));
}

// ── Matrix Operations ─────────────────────────────────────

/** Matrix * Vector  ->  the core of a neural network layer */
function matVecMul(W: Mat, x: Vec): Vec {
  return W.map(row => dot(row, x));
}

/** Matrix * Matrix — O(n^3), but GPUs do this in parallel */
function matMul(A: Mat, B: Mat): Mat {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) =>
      Array.from({ length: inner }, (_, k) => A[i][k] * B[k][j])
           .reduce((s, v) => s + v, 0)
    )
  );
}

/** Transpose: flip rows <-> columns */
function transpose(A: Mat): Mat {
  return A[0].map((_, j) => A.map(row => row[j]));
}

// ── Linear Layer (y = Wx + b) ─────────────────────────────
// The atomic operation of every dense layer.
// In PyTorch: nn.Linear(in_features, out_features)

function linearLayer(W: Mat, b: Vec, x: Vec): Vec {
  return vecAdd(matVecMul(W, x), b);
}

// ── Demo ──────────────────────────────────────────────────

const W: Mat = [           // 2x3 weight matrix
  [0.5, -0.2, 0.8],
  [0.1,  0.9, -0.3],
];
const b: Vec = [0.1, -0.1];    // bias
const x: Vec = [1.0, 2.0, 3.0]; // input (3-dim)

console.log(linearLayer(W, b, x));
// -> [2.5, 1.9]  — projected from 3D to 2D

// Cosine similarity — used in attention, retrieval, embeddings
const king: Vec  = [0.8, 0.2, 0.1];
const queen: Vec = [0.7, 0.3, 0.2];
console.log(cosineSim(king, queen).toFixed(4));
// -> 0.9984 — very similar directions (semantically related words)`

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript with no libraries. These implementations build intuition before reaching for
                NumPy or PyTorch.
            </p>
            <CodeBlock code={TS_CODE} filename="vectors-matrices.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Next step:</strong> Replace these loops with <code>numpy</code> in Python, which
                calls optimised BLAS routines — the same operations, 100-1000x faster due to SIMD and
                cache-aware memory layouts.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const VECTORS_MATRICES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
