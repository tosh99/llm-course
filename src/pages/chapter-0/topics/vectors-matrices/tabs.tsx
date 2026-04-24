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
                "Probability over many variables simultaneously — the joint distribution of height, weight, age, and income for a thousand people — requires tracking relationships between every pair of variables. Writing this out as separate equations is unworkable beyond three or four variables. By the mid-1800s, mathematicians applying linear transformations in mechanics, optics, and statistics desperately needed compact notation. Every transformation had to be spelled out as a full system of equations, making composition laborious and error-prone.",
            what:
                "Arthur Cayley published A Memoir on the Theory of Matrices (1858), defining matrices as first-class mathematical objects with their own addition and multiplication rules. He showed that composing two transformations corresponds exactly to multiplying their matrices, and proved the Cayley–Hamilton theorem: every matrix satisfies its own characteristic polynomial. He also established that matrix multiplication is associative but not commutative — AB ≠ BA in general — a fact with deep consequences for the order of operations in neural networks.",
            impact:
                "This is the moment linear algebra became a language. Once you can write Ax = b, AB, and Aⁿ as single expressions, the theory generalises cleanly to any dimension. The covariance matrix Σ from probability theory — encoding how every pair of features co-varies — is now a first-class object you can invert, multiply, decompose. Modern neural network notation (Wx + b for a layer) is a direct descendant of this notational leap.",
        },
        {
            year: "1888",
            title: "Peano — Abstract Vector Spaces",
            challenge:
                "By the late 1800s, mathematicians noticed that the same algebraic rules kept reappearing in wildly different settings: arrays of numbers, polynomial functions, spaces of continuous functions, and — from our previous topic — probability distributions over multiple variables. Each required separate theorems proved separately. The repetition was a sign of one underlying structure.",
            what:
                "Giuseppe Peano wrote down the eight axioms of a vector space — abstract rules about addition (commutativity, associativity, identity, inverses) and scalar multiplication (two distributivity laws). He showed that polynomials, functions, sequences, and ordinary Euclidean arrows all satisfy exactly these axioms, unifying them into a single mathematical object. Nothing more is needed: the axioms are intentionally minimal.",
            impact:
                "In ML, word embeddings, image patches, and audio spectrograms all live in different vector spaces, but because each satisfies Peano's axioms, the same algorithms — nearest-neighbour search, cosine similarity, linear classifiers — apply uniformly. This is why PyTorch can handle text, images, and audio with identical code. The data point you push through a network is a vector; the weights at each layer form a matrix; Peano's axioms guarantee the operations are well-defined.",
        },
        {
            year: "1879 – 1907",
            title: "Gram & Schmidt — Orthogonalization",
            challenge:
                "Probability theory gave us the covariance matrix Σ, encoding how features vary together. But to understand Σ — to find the 'natural axes' of variation in data — we need vectors that are mutually perpendicular (orthogonal). Most naturally arising sets of vectors are not orthogonal. Without a systematic method to construct an orthonormal basis from an arbitrary one, the geometric power of orthogonality was locked away.",
            what:
                "Jørgen Pedersen Gram (1879) and Erhard Schmidt (1907) independently described the algorithm: normalise the first vector to unit length; for each subsequent vector, subtract its projections onto all previously orthogonalised vectors and normalise the residual. The result is a set of orthonormal vectors spanning the same space as the originals. The algorithm is simple enough to apply by hand and numerically stable enough for large-scale computation.",
            impact:
                "Gram-Schmidt is the foundation of QR decomposition, the most numerically stable algorithm for solving least-squares problems. It avoids squaring the condition number that afflicts forming A^T A. QR also underlies the QR algorithm for computing eigenvalues. The eigenvectors of the covariance matrix — the 'natural axes' of the data — are orthogonal, and Gram-Schmidt is the computational tool that finds them. That eigenvalue story is our very next topic.",
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

            <p className="ch-story-intro">
                Probability gave us tools to reason about uncertain, many-variable situations — but writing out "the probability that height, weight, AND age are all in some range" for a thousand people quickly becomes unmanageable. We need a compact notation. Vectors pack many measurements into one object; matrices organise the relationships between them.
            </p>

            <Analogy label="Vectors = Arrows full of numbers">
                A <strong>vector</strong> is like an instruction: "walk 3 steps forward and 2 steps right." That arrow has two things — direction and distance. But you can have an arrow in 100 dimensions: "move this much on feature 1, this much on feature 2, ..., this much on feature 100."
                <br /><br />
                In AI, every data point is a vector. A photo is a vector of pixel values. A word is a vector of 768 numbers (its embedding). A patient's medical record is a vector of test results. Vectors are how AI sees the world.
            </Analogy>

            <Analogy label="Matrices = Arrow-reshaping machines">
                A <strong>matrix</strong> is like a machine: you put your arrow in, and a different arrow comes out — maybe stretched, rotated, or flipped. The numbers inside decide what happens. Stack two machines together and you get one combined machine: that is matrix multiplication.
                <br /><br />
                Every layer in a neural network is a matrix machine. The layer takes the previous layer's arrow (activations) and reshapes it. Training is adjusting the machine's settings until it reshapes arrows the way we want.
            </Analogy>

            <Analogy label="Dot Product = How much do two arrows agree?">
                If you and your friend both point arrows, the <strong>dot product</strong> tells you how much they agree. Same direction = big positive number. Opposite = negative. Right angles = zero.
                <br /><br />
                In a Transformer's attention mechanism, each query arrow and each key arrow are dot-producted together — measuring how relevant that token is. The entire attention mechanism is one giant collection of dot products.
            </Analogy>

            <Analogy label="Norm = How long is your arrow?">
                Every arrow has a length — a single number measuring how big the vector is. Square each component, add them, take the square root. That's the <strong>norm</strong> (Euclidean length).
                <br /><br />
                In AI, gradient norms tell you how large an update step is. If the norm is enormous, the model might take a wild step and training blows up. That's why "gradient clipping" exists — cap the norm so no single update is too large.
            </Analogy>

            <Analogy label="Covariance matrix = a table of 'go-together' scores">
                The covariance matrix from probability theory is a specific kind of matrix. Entry (i, j) says "how much do feature i and feature j tend to move together?" Tall people tend to be heavy — positive covariance. Unrelated things — near zero.
                <br /><br />
                This matrix has a hidden secret: certain directions in the data have high variance (lots of spread) and others have low variance. Finding those directions — the "natural axes" of the data — is the next topic: eigenvalues and eigenvectors.
            </Analogy>

            <Analogy label="What comes next — the special arrows that survive unchanged">
                When you apply the covariance matrix to a vector, most vectors come out pointing a completely different direction. But some special vectors come out pointing <em>exactly the same way</em> they went in — just longer or shorter. Those are <strong>eigenvectors</strong>: the natural axes of the data. Finding them is what PCA does, and it's the subject of our next topic.
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
            <MathBlock tex="\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 = |\vec{a}||\vec{b}|\cos\theta" />
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
            <MathBlock tex="\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix} \begin{pmatrix} 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}" />
            <p>
                This matrix stretched x by 2 and y by 3. Every neural network layer does something like
                this — projecting input into a new space where patterns are easier to see.
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
            <MathBlock tex="\|\mathbf{x}\|_p = \left(\sum_{i=1}^n |x_i|^p\right)^{1/p}" />
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
            <MathBlock tex="\langle \mathbf{a}, \mathbf{b} \rangle = \mathbf{a}^\top \mathbf{b} = \sum_{i=1}^n a_i b_i" />
            <p>
                It equals <InlineMath tex="\|\mathbf{a}\|\|\mathbf{b}\|\cos\theta" />, so dividing by both
                norms yields <strong>cosine similarity</strong> — a scale-invariant measure of directional
                agreement. This is used in: word embedding analogies, attention score computation in
                Transformers <InlineMath tex="(\mathbf{q}^\top \mathbf{k})" />, nearest-neighbour search
                in RAG systems, and contrastive learning objectives like CLIP.
            </p>
            <MathBlock tex="\cos\theta = \frac{\mathbf{a}^\top \mathbf{b}}{\|\mathbf{a}\|\|\mathbf{b}\|} \in [-1, 1]" />

            <DiagramBlock title="Dot product geometry — vectors a and b, angle theta, and projection">
                <DotProductDiagram />
            </DiagramBlock>

            <h3>Matrix Multiplication</h3>
            <p>
                For <InlineMath tex="A \in \mathbb{R}^{m\times k}" /> and
                <InlineMath tex="B \in \mathbb{R}^{k\times n}" />, their product
                <InlineMath tex="C = AB \in \mathbb{R}^{m\times n}" /> has entries:
            </p>
            <MathBlock tex="C_{ij} = \sum_{l=1}^k A_{il}\, B_{lj}" />
            <p>
                Think of C's (i,j) entry as the dot product of row i of A with column j of B. This
                operation is the engine of neural networks — a forward pass through a linear layer is
                <InlineMath tex="\mathbf{y} = W\mathbf{x} + \mathbf{b}" />. The entire reason GPUs exist
                in ML is that they can compute batches of matrix products in parallel using thousands of
                cores. Matrix multiplication is associative but <em>not commutative</em>: AB != BA in
                general.
            </p>

            <DiagramBlock title="Matrix transformation — how a linear map stretches the unit square">
                <MatTransformDiagram />
            </DiagramBlock>

            <h3>Gradient as a Vector</h3>
            <p>
                For a scalar loss function <InlineMath tex="\mathcal{L}: \mathbb{R}^n \to \mathbb{R}" />,
                the gradient <InlineMath tex="\nabla_\mathbf{x} \mathcal{L} \in \mathbb{R}^n" /> stacks
                all partial derivatives into a vector. It points in the direction of steepest ascent — so
                stepping opposite to it descends the loss:
            </p>
            <MathBlock tex="\mathbf{x}_{t+1} = \mathbf{x}_t - \eta\,\nabla_\mathbf{x} \mathcal{L}(\mathbf{x}_t)" />
            <p>
                For a neural network with millions of parameters, this is one giant high-dimensional vector
                update per step. The learning rate eta controls step size. The covariance matrix Σ of the
                data — encoding how features vary together — is a central object in the next topic.
                Its eigenvectors reveal the directions of maximum variance, and its eigenvalues measure how
                much variance each direction contains. That eigenvalue story is precisely what comes next.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── 1. Tensors — the PyTorch equivalent of NumPy arrays ───────────────────
W = torch.tensor([[0.5, -0.2, 0.8],
                  [0.1,  0.9, -0.3]])   # shape (2, 3)
x = torch.tensor([1.0, 2.0, 3.0])
b = torch.tensor([0.1, -0.1])

y = W @ x + b                    # linear layer: y = Wx + b
print(f"[Linear layer]  y = Wx + b: {y.tolist()}")

# ── 2. Norms and cosine similarity ────────────────────────────────────────
print("\\n[Norms & similarity]")

a = torch.tensor([1.0, 2.0, 3.0])
print(f"  L1 = {a.norm(p=1):.4f}  L2 = {a.norm(p=2):.4f}  L∞ = {a.norm(p=float('inf')):.4f}")

king  = torch.tensor([0.8, 0.2, 0.1])
queen = torch.tensor([0.7, 0.3, 0.2])

cos = F.cosine_similarity(king.unsqueeze(0), queen.unsqueeze(0))
print(f"  cosine_similarity(king, queen): {cos.item():.4f}")

# ── 3. Matrix operations ──────────────────────────────────────────────────
print("\\n[Matrix ops]")

A = torch.tensor([[1., 2.], [3., 4.]])
B = torch.tensor([[5., 6.], [7., 8.]])
print(f"  A @ B:\\n{A @ B}")
print(f"  A.T:\\n{A.T}")
print(f"  trace(A): {A.trace():.0f}  det(A): {torch.linalg.det(A):.0f}")

# ── 4. Batched matmul — 32-sample batch in one call ───────────────────────
print("\\n[Batched] linear layer over a full batch")

batch_x = torch.randn(32, 3)          # 32 inputs, 3 features
batch_y = batch_x @ W.T + b           # (32, 3) @ (3, 2) → (32, 2) — all at once
print(f"  batch_x: {list(batch_x.shape)}  →  batch_y: {list(batch_y.shape)}")

# ── 5. Attention — scaled dot-product similarity ──────────────────────────
print("\\n[Attention] scaled dot-product")

seq_len, d = 8, 64
Q = torch.randn(seq_len, d)     # queries
K = torch.randn(seq_len, d)     # keys
V = torch.randn(seq_len, d)     # values

scores = (Q @ K.T) / d**0.5             # (seq_len, seq_len)
attn   = torch.softmax(scores, dim=-1)  # normalise over keys
out    = attn @ V                       # weighted sum of values
print(f"  scores: {list(scores.shape)},  out: {list(out.shape)}")
print(f"  attn rows sum to 1: {attn.sum(dim=-1).allclose(torch.ones(seq_len))}")

# ── 6. nn.Linear — the canonical building block ───────────────────────────
print("\\n[nn.Linear] autograd through a linear layer")

layer = nn.Linear(3, 2)                  # W ∈ R^{2×3}, b ∈ R^2 — random init
x_g   = torch.randn(16, 3, requires_grad=False)
y_g   = layer(x_g)                       # forward
loss  = y_g.pow(2).mean()
loss.backward()                          # ∂loss/∂W and ∂loss/∂b computed
print(f"  W.grad shape: {list(layer.weight.grad.shape)}")
print(f"  b.grad shape: {list(layer.bias.grad.shape)}")`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch tensors are NumPy arrays with autograd. Every operation — dot products,
                norms, matrix multiply, cosine similarity — has a native API, works on batches
                of inputs at once, and flows gradients through for training.
            </p>
            <CodeBlock code={PY_CODE} filename="vectors_matrices.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The attention score <code>(Q @ K.T) / √d</code> is
                just a batched cosine similarity scaled to prevent softmax saturation. Every
                transformer in existence reduces to this one matrix multiply.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const VECTORS_MATRICES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
