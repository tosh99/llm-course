import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import { DiagramBlock } from "./diagrams"
import { PythonEcosystemDiagram, ArrayMemoryDiagram, BroadcastingDiagram } from "./diagrams"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
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
    const items: TimelineItem[] = [
        {
            year: "1991 — Guido van Rossum — Python 0.9.0",
            title: "A language optimised for readability",
            challenge: "C was fast but verbose and error-prone. Shell scripting was quick but limited to text. Perl could process data but its syntax grew unreadable for large programs. Researchers and educators needed a language that was both powerful enough for real work and simple enough to teach.",
            what:
                "Guido van Rossum released Python as a general-purpose language prioritising code readability: significant whitespace instead of braces, clear English keywords, and a batteries-included standard library. It supported multiple paradigms — procedural, object-oriented, and (later) functional — so it adapted to the problem rather than forcing the problem into a paradigm.",
            impact:
                "Python became the lingua franca of data science and machine learning. Its readability means researchers can share code that others can actually understand. Every major ML framework — PyTorch, TensorFlow, JAX, scikit-learn — is a Python library. When you call model.train() in Python, the heavy lifting happens in C++/CUDA underneath, but you express ideas in readable Python.",
        },
        {
            year: "2006 — Travis Oliphant — NumPy 1.0",
            title: "The array that changed scientific computing",
            challenge: "Scientific computing in Python was painfully slow. Lists of numbers required Python object overhead for every element — a list of a million floats used 8× more memory than raw C arrays and ran 100× slower. Scientists were forced to write C extensions or use proprietary tools like MATLAB.",
            what:
                "NumPy introduced the ndarray: a contiguous block of typed memory with a Python interface. Operations on arrays are dispatched to optimised C and Fortran routines (BLAS/LAPACK) — a single np.dot(A, B) call launches thousands of FLOPs with zero Python loop overhead. Broadcasting rules let arrays of different shapes combine without manual loops.",
            impact:
                "NumPy is the foundation of the entire ML ecosystem. PyTorch tensors and TensorFlow tensors mirror NumPy's API. The ndarray memory model — strides, shape, dtype — is how every framework represents data. Understanding NumPy broadcasting, indexing, and reduction operations is prerequisite to understanding tensor operations in any ML framework.",
        },
        {
            year: "2008 — Wes McKinney — Pandas",
            title: "Spreadsheets meet programming",
            challenge: "Real-world data arrives messy: missing values, inconsistent types, dates in five formats, merged column headers. NumPy handles clean numerical arrays, but data scientists spent 80% of their time on cleaning and wrangling with ad-hoc Python scripts. R had data frames; Python had nothing comparable.",
            what:
                "Wes McKinney built Pandas to bring the data frame — a table with labelled rows and columns — to Python. It added hierarchical indexing (MultiIndex), group-by operations, time-series handling, merge/join, and powerful missing-data handling. A 50-line data-cleaning script in raw Python became 5 lines of Pandas.",
            impact:
                "Pandas is the standard entry point for any ML dataset: load CSV → clean → transform → feed into a model. Even GPU-accelerated frameworks provide Pandas-compatible APIs (cuDF, Polars). The data frame abstraction — columns with types, rows with indices — is how every data scientist thinks about tabular data.",
        },
        {
            year: "2016 — The PyTorch Revolution",
            title: "When Python and tensors became one",
            challenge: "Early deep learning frameworks (Theano, TensorFlow 1.x) used static computation graphs: you defined the entire network first, then compiled it, then ran data through it. This was efficient but miserable for debugging — you couldn't print a tensor's value or use a Python if-statement inside the graph. Researchers hated it.",
            what:
                "PyTorch adopted a dynamic computation graph: operations execute immediately (eager mode), tensors behave like NumPy arrays that happen to track gradients, and you can mix regular Python control flow (loops, conditionals, print statements) with tensor operations. It felt like writing NumPy code that automatically differentiated.",
            impact:
                "PyTorch became the dominant framework for ML research. Its Python-first philosophy means the language you use for data loading (Pandas), numerical computing (NumPy), and model training (PyTorch) are the same. Autograd — automatic differentiation — tracks every operation on a tensor and computes gradients with .backward(). This is the engine that makes backpropagation automatic.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching computers with recipes</h2>

            <Analogy label="Python = A simple language for giving instructions">
                Imagine you're writing a recipe, but the person reading it is very literal — they follow
                every step exactly. <strong>Python</strong> is a language designed to be easy for humans
                to write and read. Instead of complicated symbols, it uses plain English words like
                <code>if</code>, <code>for</code>, and <code>def</code> (short for "define").
                <br /><br />
                In AI, Python is like the language scientists use to explain their ideas to the computer.
                Almost every AI program you'll ever see is written in Python.
            </Analogy>

            <Analogy label="NumPy = A super-fast calculator for lists of numbers">
                If you had to add two lists of a million numbers, you'd write a loop: take the first pair,
                add them, take the second pair, add them... a million times. That's slow.
                <br /><br />
                <strong>NumPy</strong> is like a magic calculator that can add all million pairs at the
                same time, in one step. It does this by storing numbers in a special way the computer's
                chip can process all at once. In AI, everything is lists of numbers — images are lists
                of pixel values, text is lists of word scores — so NumPy's speed matters a lot.
            </Analogy>

            <Analogy label="Arrays = Trays of organised numbers">
                A <strong>NumPy array</strong> is like a tray of ice cubes — every slot is the same size,
                neatly arranged in rows. Regular Python lists are more like a messy drawer where each thing
                is a different shape and size. The neat tray is faster because the computer knows exactly
                where to find each number.
                <br /><br />
                A 1D array is a row of numbers. A 2D array is a table (rows and columns).
                A 3D array is a stack of tables. In AI, a colour image is a 3D array:
                height × width × 3 (red, green, blue).
            </Analogy>

            <DiagramBlock title="Python list vs NumPy array — why arrays are faster">
                <ArrayMemoryDiagram />
            </DiagramBlock>

            <Analogy label="Broadcasting = Stretching numbers automatically">
                Say you have a table of temperatures in Fahrenheit, and you want to convert them all to
                Celsius. You could convert each one individually... or you could just give the formula
                and let NumPy "stretch" it across every cell. That's <strong>broadcasting</strong> — NumPy
                automatically expands small arrays to match bigger ones so you don't need loops.
            </Analogy>

            <DiagramBlock title="Broadcasting — shapes expand to fit">
                <BroadcastingDiagram />
            </DiagramBlock>

            <Analogy label="Why Python matters for AI">
                Python is the <em>language</em> of AI. When researchers discover a new technique, they
                write it in Python. When companies deploy AI models, they use Python. When you want to
                experiment with neural networks, you'll write Python. The three tools you'll use most —
                <strong>NumPy</strong> (numbers), <strong>Pandas</strong> (tables), and
                <strong>PyTorch</strong> (neural networks) — are all Python libraries.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Variables, arrays, and vectorised operations</h2>

            <p>
                You've used variables and maybe written loops. Python for ML adds one critical idea:
                <strong>vectorised operations</strong> — acting on entire collections of numbers at once,
                element by element, without writing a loop. This is what NumPy provides, and it's how every
                ML framework thinks about data.
            </p>

            <h3>Python basics — variables, types, and functions</h3>
            <p>
                Python is dynamically typed: you don't declare variable types. A variable is a name bound
                to an object. The core types for ML are <code>int</code>, <code>float</code>,
                <code>list</code>, <code>dict</code>, and <code>str</code>. Functions are defined with
                <code>def</code> and can return any type.
            </p>
            <p>
                What matters for ML is understanding <strong>mutable vs immutable</strong>: lists and dicts
                are mutable (you can change them in place), while numbers and strings are not. NumPy arrays
                are mutable — in-place operations modify the data without allocating new memory, which is
                crucial for performance.
            </p>

            <h3>NumPy — the ndarray</h3>
            <p>
                A NumPy <strong>ndarray</strong> is a grid of values, all of the same type, indexed by a
                tuple of non-negative integers. Its key properties:
            </p>
            <ul>
                <li><strong>shape</strong> — a tuple giving the size along each dimension, e.g. (3, 4) means 3 rows × 4 columns</li>
                <li><strong>dtype</strong> — the data type of every element (float64, int32, bool, etc.)</li>
                <li><strong>ndim</strong> — the number of dimensions (axes)</li>
            </ul>
            <p>
                Unlike Python lists, arrays are stored in a single contiguous block of memory. This means
                the CPU can load many values at once (cache efficiency) and the OS can dispatch operations
                to SIMD (Single Instruction, Multiple Data) units — performing the same operation on 4, 8,
                or 16 numbers simultaneously.
            </p>

            <DiagramBlock title="The Python ML stack — layers of abstraction">
                <PythonEcosystemDiagram />
            </DiagramBlock>

            <h3>Vectorisation — loops are the enemy</h3>
            <p>
                The golden rule of NumPy: <strong>never write a Python loop over array elements</strong>.
                Every operation — addition, multiplication, comparison, function application — works
                element-wise on entire arrays. A single <code>a + b</code> where both are arrays of length
                1,000,000 is 100× faster than a Python for-loop doing the same thing.
            </p>
            <MathBlock tex={`\\text{Element-wise:} \\quad \\mathbf{c}_i = \\mathbf{a}_i + \\mathbf{b}_i \\quad \\text{for all } i`} />
            <p>
                This isn't magic — it's C code operating on raw memory. NumPy delegates to BLAS (Basic
                Linear Algebra Subprograms) and LAPACK (Linear Algebra Package), the same libraries used
                by MATLAB and R, written in Fortran and optimised over 40 years.
            </p>

            <h3>Broadcasting — different shapes, no problem</h3>
            <p>
                When you combine arrays of different shapes, NumPy <strong>broadcasts</strong> the smaller
                one across the larger one. The rules: dimensions align from the right; dimensions of size 1
                are stretched to match; missing dimensions are treated as size 1.
            </p>

            <DiagramBlock title="Broadcasting — shape expansion rules">
                <BroadcastingDiagram />
            </DiagramBlock>

            <h3>Indexing and slicing</h3>
            <p>
                NumPy extends Python's slicing to N dimensions. <code>a[1:3, :]</code> selects rows 1–2 and
                all columns. <strong>Fancy indexing</strong> lets you pass arrays of indices:
                <code>a[[0, 2, 4]]</code> selects those specific rows. <strong>Boolean masking</strong>
                lets you filter: <code>{'a[a > 0]'}</code> returns all positive elements. These patterns appear
                constantly in ML — selecting batches, filtering predictions, masking padding tokens.
            </p>

            <h3>Reductions — collapsing dimensions</h3>
            <p>
                Operations like <code>sum()</code>, <code>mean()</code>, <code>max()</code> can operate
                along a specific axis. <code>a.sum(axis=0)</code> sums down the rows, producing one value
                per column. <code>a.mean(axis=1)</code> averages across columns, producing one value per
                row. In ML, computing loss over a batch is a reduction: you calculate per-example losses
                and then reduce them to a scalar with <code>.mean()</code>.
            </p>

            <div className="ch-callout">
                <strong>Connection to ML:</strong> PyTorch tensors are NumPy arrays with two extras:
                (1) they live on the GPU instead of the CPU, and (2) they track every operation for
                automatic differentiation. If you understand NumPy, you understand 80% of PyTorch.
                The API is nearly identical: <code>torch.from_numpy(a)</code> converts between them
                with zero copying.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Memory layout, computational complexity, and autograd</h2>
            <p>
                What follows is the computational theory behind why Python/NumPy is the right substrate
                for machine learning — and why vectorised code is not just convenient but mathematically
                necessary for performance.
            </p>

            <DefBlock label="Definition — ndarray memory model">
                An ndarray with shape (n₁, n₂, ..., nₖ) and dtype T occupies n₁ · n₂ · ... · nₖ · sizeof(T)
                contiguous bytes. Element (i₁, i₂, ..., iₖ) is at offset Σᵢ iᵢ · sᵢ where sᵢ = stride along
                axis i. Strides are computed from shape and memory order (C-order: row-major, Fortran-order:
                column-major). This contiguous layout is what enables SIMD vectorisation and cache-efficient access.
            </DefBlock>

            <h3>BLAS — the hidden engine</h3>
            <p>
                Every NumPy linear algebra operation delegates to BLAS (Basic Linear Algebra Subprograms).
                BLAS has three levels:
            </p>
            <ul>
                <li><strong>Level 1</strong> — vector-vector: dot product, axpy (y = αx + y). O(n) work, memory-bound.</li>
                <li><strong>Level 2</strong> — matrix-vector: y = Ax. O(n²) work, often memory-bound.</li>
                <li><strong>Level 3</strong> — matrix-matrix: C = AB. O(n³) work, compute-bound — this is where BLAS shines, achieving {'>'}90% of peak FLOPS by tiling for cache reuse.</li>
            </ul>
            <p>
                When you write <code>np.dot(A, B)</code>, NumPy calls GEMM (General Matrix-Matrix Multiply)
                from an optimised BLAS implementation (OpenBLAS, MKL, or Apple Accelerate). On a modern CPU,
                this achieves 50–100+ GFLOPS. The lesson: never implement matrix multiplication yourself —
                delegate to BLAS.
            </p>

            <h3>Computational graph — automatic differentiation</h3>
            <p>
                The key mathematical insight behind PyTorch is that every differentiable function can be
                represented as a node in a directed acyclic graph (DAG). The forward pass builds the graph;
                the backward pass traverses it in reverse, applying the chain rule:
            </p>
            <MathBlock tex="\frac{\partial f \circ g}{\partial x} = \frac{\partial f}{\partial g} \cdot \frac{\partial g}{\partial x}" />
            <p>
                PyTorch's autograd implements <strong>reverse-mode automatic differentiation</strong>.
                Each tensor stores a <code>grad_fn</code> — a closure that computes the local gradient.
                Calling <code>loss.backward()</code> traverses the graph from loss to every leaf parameter,
                accumulating gradients via the chain rule. This computes all ∂loss/∂θᵢ in a single backward
                pass — the same cost as one forward pass. This is far more efficient than finite differences,
                which would require n+1 forward passes for n parameters.
            </p>

            <h3>Strides and views — zero-copy slicing</h3>
            <p>
                When you slice an array <code>b = a[::2, :]</code> (every other row), NumPy does not copy
                data. Instead, it creates a <strong>view</strong> — a new array header with adjusted strides.
                The stride for axis 0 doubles (skip every other row), but the data pointer still references
                the original buffer. This makes slicing O(1) regardless of array size.
            </p>
            <MathBlock tex={`\\text{stride}_i = \\text{stride}_i^{\\text{original}} \\times \\text{step}_i \\quad \\text{(for slice with step)} \\quad \\Rightarrow \\quad O(1) \\text{ view creation}`} />
            <p>
                In ML, this matters because mini-batch selection, attention masking, and sequence truncation
                are all slicing operations that must be fast. PyTorch inherits the same view semantics.
            </p>

            <h3>Einsum — the universal contraction</h3>
            <p>
                <code>np.einsum</code> (Einstein summation) is a general-purpose tensor contraction notation.
                It subsumes matrix multiply, trace, diagonal extraction, batched outer products, and more:
            </p>
            <MathBlock tex="\text{einsum}('ij,jk \to ik', A, B) = AB \quad \text{(matrix multiply)}" />
            <MathBlock tex="\text{einsum}('ij \to ji', A) = A^\top \quad \text{(transpose)}" />
            <MathBlock tex="\text{einsum}('ii \to', A) = \text{tr}(A) \quad \text{(trace)}" />
            <p>
                In transformer architectures, the attention mechanism computes:
            </p>
            <MathBlock tex="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V" />
            <p>
                The QKᵀ contraction is a batched matrix multiply expressible as einsum:
                <code>{"np.einsum('bqd,bkd->bqk', Q, K)"}</code>. Understanding einsum means you can read and
                write any tensor operation in a single line.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> ML is numerical linear algebra at scale. Python provides the
                interface; C/Fortran/CUDA provide the speed. NumPy is the bridge. Every tensor operation in
                PyTorch — matmul, conv2d, softmax, layer_norm — is ultimately a C++ function operating on
                contiguous memory, called from Python. The mathematical abstraction (tensors, contractions,
                gradients) is the same whether the computation runs on CPU, GPU, or TPU.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import pandas as pd

# ── NumPy arrays ───────────────────────────────────────────
# The fundamental data structure for ML

a = np.array([1.0, 2.0, 3.0, 4.0])       # 1D array (vector)
b = np.array([[1, 2], [3, 4], [5, 6]])    # 2D array (matrix)

print(f"Shape:  {a.shape}")     # (4,)
print(f"dtype:  {a.dtype}")     # float64
print(f"ndim:   {a.ndim}")      # 1
print(f"Size:   {a.size}")      # 4

# ── Creating arrays ────────────────────────────────────────
zeros = np.zeros((3, 4))                   # 3×4 matrix of 0s
ones = np.ones((2, 3))                     # 2×3 matrix of 1s
randn = np.random.randn(3, 3)             # 3×3 from N(0, 1)
linspace = np.linspace(0, 1, 5)           # [0, 0.25, 0.5, 0.75, 1.0]
arange = np.arange(0, 10, 2)              # [0, 2, 4, 6, 8]

# ── Vectorised operations ──────────────────────────────────
# NO PYTHON LOOPS — NumPy does it all in C
x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([5.0, 6.0, 7.0, 8.0])

print(f"\\nx + y  = {x + y}")              # [6, 8, 10, 12]
print(f"x * y  = {x * y}")                # [5, 12, 21, 32]  (element-wise)
print(f"x @ y  = {x @ y}")                # 70.0  (dot product)
print(f"x ** 2 = {x ** 2}")               # [1, 4, 9, 16]

# ── Broadcasting ───────────────────────────────────────────
# (3,1) + (1,3) → (3,3) — auto-expansion
col = np.array([[1], [2], [3]])           # shape (3, 1)
row = np.array([[4, 5, 6]])              # shape (1, 3)
result = col + row                        # shape (3, 3)
print(f"\\nBroadcasting (3,1) + (1,3):\\n{result}")

# ── Indexing & slicing ─────────────────────────────────────
m = np.arange(12).reshape(3, 4)          # [[0,1,2,3],[4,5,6,7],[8,9,10,11]]
print(f"\\nMatrix:\\n{m}")
print(f"Row 0:    {m[0]}")                 # [0, 1, 2, 3]
print(f"Col 1:    {m[:, 1]}")              # [1, 5, 9]
print(f"Slice:    {m[0:2, 1:3]}")          # [[1,2],[5,6]]

# Boolean mask
mask = m > 5
print(f"m > 5:    {m[mask]}")              # [6, 7, 8, 9, 10, 11]

# Fancy indexing
print(f"Rows 0,2: {m[[0, 2]]}")            # [[0,1,2,3],[8,9,10,11]]

# ── Reductions ─────────────────────────────────────────────
print(f"\\nSum all:    {m.sum()}")          # 66
print(f"Sum axis=0: {m.sum(axis=0)}")     # [12, 15, 18, 21]  (down columns)
print(f"Sum axis=1: {m.sum(axis=1)}")     # [6, 22, 38]       (across rows)
print(f"Mean:       {m.mean():.2f}")      # 5.50

# ── Linear algebra ─────────────────────────────────────────
A = np.random.randn(3, 3)
B = np.random.randn(3, 3)

print(f"\\nA @ B shape: {(A @ B).shape}")   # (3, 3)
print(f"A^T shape:   {A.T.shape}")          # (3, 3)
print(f"det(A):      {np.linalg.det(A):.4f}")
print(f"inv(A) @ A ≈ I:\\n{np.round(A @ np.linalg.inv(A), 6)}")

# Eigenvalues
eigvals, eigvecs = np.linalg.eig(A)
print(f"Eigenvalues: {eigvals.round(3)}")

# ── Reshape & transpose ────────────────────────────────────
x = np.arange(6)
print(f"\\nx:         {x}")                 # [0, 1, 2, 3, 4, 5]
print(f"Reshape 2x3:\\n{x.reshape(2, 3)}")
print(f"Reshape 3x2:\\n{x.reshape(3, 2)}")

# ── Pandas basics ──────────────────────────────────────────
df = pd.DataFrame({
    "feature_1": [1.2, 2.3, 3.4, 4.5],
    "feature_2": [0.5, 1.1, 2.0, 2.8],
    "label": [0, 1, 1, 0],
})

print(f"\\nDataFrame:\\n{df}")
print(f"\\nDescribe:\\n{df.describe()}")
print(f"\\nMean per label:\\n{df.groupby('label').mean()}")

# Convert to NumPy for ML
X = df[["feature_1", "feature_2"]].values   # shape (4, 2)
y = df["label"].values                       # shape (4,)
print(f"\\nX shape: {X.shape}, y shape: {y.shape}")`

function PythonTab() {
    return (
        <>
            <p>
                A practical guide to the Python/NumPy/Pandas stack that underpins every ML workflow.
                From array creation to linear algebra to data frames — these are the building blocks
                you'll use daily.
            </p>
            <CodeBlock code={PY_CODE} filename="python_basics.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Every PyTorch operation mirrors a NumPy operation.
                <code>torch.tensor</code> ≈ <code>np.array</code>,
                <code>torch.matmul</code> ≈ <code>np.matmul</code>,
                <code>torch.randn</code> ≈ <code>np.random.randn</code>. Learn NumPy well and
                PyTorch feels natural. The main difference: PyTorch runs on GPU and tracks gradients.
            </div>
        </>
    )
}

const TS_CODE = `// ── Array & Linear Algebra primitives ─────────────────────
// What NumPy does in C, we can express in TypeScript

type Vec = number[];
type Mat = Vec[];  // row-major: mat[row][col]

// ── Vector operations ────────────────────────────────────

function vecAdd(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v + b[i]);
}

function vecScale(a: Vec, s: number): Vec {
  return a.map((v) => v * s);
}

function dot(a: Vec, b: Vec): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function vecMul(a: Vec, b: Vec): Vec {
  return a.map((v, i) => v * b[i]); // element-wise
}

// ── Matrix operations ────────────────────────────────────

function matMul(A: Mat, B: Mat): Mat {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  const C: Mat = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      for (let k = 0; k < inner; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}

function transpose(A: Mat): Mat {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

// ── Reductions ───────────────────────────────────────────

function sum(a: Vec): number {
  return a.reduce((s, v) => s + v, 0);
}

function mean(a: Vec): number {
  return sum(a) / a.length;
}

function max(a: Vec): number {
  return Math.max(...a);
}

function argmax(a: Vec): number {
  return a.indexOf(max(a));
}

// ── Broadcasting (simple 1D cases) ───────────────────────

function broadcastAdd(a: Vec, scalar: number): Vec {
  return a.map((v) => v + scalar);
}

function broadcastMul(mat: Mat, vec: Vec): Mat {
  // Each row of mat * vec (element-wise)
  return mat.map((row) => vecMul(row, vec));
}

// ── Softmax (the function that turns logits into probabilities) ─

function softmax(logits: Vec): Vec {
  const maxVal = max(logits);
  const exps = logits.map((x) => Math.exp(x - maxVal));
  const total = sum(exps);
  return exps.map((e) => e / total);
}

// ── Demo ─────────────────────────────────────────────────

const a: Vec = [1, 2, 3, 4];
const b: Vec = [5, 6, 7, 8];

console.log("Vector operations:");
console.log(\`  a + b   = [\${vecAdd(a, b)}]\`);
console.log(\`  a · b   = \${dot(a, b)}\`);
console.log(\`  a * b   = [\${vecMul(a, b)}]\`);

const A: Mat = [
  [1, 2],
  [3, 4],
];
const B: Mat = [
  [5, 6],
  [7, 8],
];

console.log("\\nMatrix multiply:");
console.log(\`  A @ B = \${JSON.stringify(matMul(A, B))}\`);
console.log(\`  A^T   = \${JSON.stringify(transpose(A))}\`);

const logits: Vec = [2.0, 1.0, 0.1];
console.log(\`\\nSoftmax([\${logits}]) = [\${softmax(logits).map((p) => p.toFixed(3))}]\`);
console.log(\`  argmax = \${argmax(logits)} (predicted class)\`);`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementations of the core array and linear algebra primitives that NumPy
                provides. Understanding these from scratch shows exactly what happens under the hood
                when you call <code>np.dot()</code> or <code>torch.matmul()</code>.
            </p>
            <CodeBlock code={TS_CODE} filename="array_basics.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Next step:</strong> In PyTorch, all of these operations are GPU-accelerated and
                autograd-tracked. <code>torch.matmul(A, B)</code> runs on GPU, and calling
                <code>loss.backward()</code> computes ∂loss/∂A and ∂loss/∂B automatically via reverse-mode
                autodiff. NumPy is the conceptual model; PyTorch is the production engine.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PYTHON_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
