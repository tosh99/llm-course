import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import {
    CovarianceDiagram,
    DiagramBlock,
    DotProductDiagram,
    EigenvectorDiagram,
    MatTransformDiagram,
    SVDDiagram,
} from "./diagrams"
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
            year: "≈ 200 BCE",
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
                "Astronomers of the early 1800s had a problem that no prior mathematics could cleanly handle: they had more observations than unknowns. When trying to compute the orbit of the dwarf planet Ceres from noisy telescope measurements, any two data points gave a slightly different orbit. There was no exact solution — just a cloud of contradictory answers.",
            what:
                "Carl Friedrich Gauss formalised the method of systematic row elimination (now named after him) and independently invented the method of least squares — choosing the solution that minimises the sum of squared differences between observed and predicted values. He used it to successfully predict where Ceres would reappear after passing behind the Sun.",
            impact:
                "Least squares is the direct ancestor of linear regression, and linear regression is the direct ancestor of neural networks. Every gradient descent step in a modern LLM is chasing the same fundamental idea: minimise a sum of squared errors. Gauss's 1809 work is the conceptual origin of the loss function.",
        },
        {
            year: "1843 – 1858",
            title: "Cayley & Hamilton — Matrix Algebra as an Object",
            challenge:
                "By the mid-1800s, mathematicians were applying linear transformations constantly — in mechanics, optics, and the emerging field of abstract algebra. But they had no unified notation. Every transformation had to be spelled out as a full system of equations, making composition of transformations (applying one then another) laborious and error-prone.",
            what:
                "Arthur Cayley published A Memoir on the Theory of Matrices (1858), defining matrices as first-class mathematical objects with their own addition and multiplication rules. He showed that composing two transformations corresponds exactly to multiplying their matrices, and proved the Cayley–Hamilton theorem: every matrix satisfies its own characteristic equation.",
            impact:
                "This is the moment linear algebra became a language rather than a technique. Once you can write Ax = b, AB, and Aⁿ as single expressions, the theory becomes both concise and general. Modern neural network notation — forward pass as Wx + b, weight update as gradient descent on W — is a direct descendant of this notational leap.",
        },
        {
            year: "1888",
            title: "Peano — Abstract Vector Spaces",
            challenge:
                "By the late 1800s, mathematicians noticed that the same algebraic rules kept reappearing in wildly different settings: in arrays of numbers, in sets of polynomials, in spaces of continuous functions. Each required separate theorems proved separately. There was no framework that unified them.",
            what:
                "Giuseppe Peano wrote down the eight axioms of a vector space — abstract rules about addition and scalar multiplication that, when satisfied, guarantee an entire body of theorems applies. He showed that polynomials, functions, and sequences all fit the same mould as ordinary Euclidean vectors.",
            impact:
                "Abstraction here is not mathematical vanity — it is power. In ML, word embeddings, image patches, and audio spectrograms all live in different spaces, but because each is a vector space, the same algorithms (nearest-neighbour search, PCA, linear classifiers) apply uniformly to all of them. Peano's axioms are why one framework like PyTorch can handle text, images, and audio with the same code.",
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
                Imagine you're standing in your bedroom. A <strong>vector</strong> is like an instruction:{" "}
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
                much your arrows "agree." Same direction → big number. Opposite directions → negative.
                Pointing at right angles → zero. Totally different directions!
            </Analogy>

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
                useful information. It's like finding the best angle to look at a 3D sculpture so you can
                draw a flat picture that still shows everything important.
            </Analogy>

            <Analogy label="The Covariance Matrix — a friendship table">
                Imagine you measure two things about every kid in your school: their height and their shoe
                size. You'll notice that <strong>tall kids tend to have bigger feet</strong>. They
                "go together." The <strong>covariance matrix</strong> is a table that records, for every
                pair of measurements you're tracking, whether they tend to go up together (positive), go
                opposite ways (negative), or just don't care about each other at all (zero).
                <br /><br />
                If you track three things — height, shoe size, and hair colour — the covariance matrix is
                a 3×3 table. The diagonal shows how "spread out" each measurement is on its own. The
                off-diagonals show how strongly each pair moves together.
            </Analogy>

            <DiagramBlock title="Covariance — data points and their natural axes">
                <CovarianceDiagram compact />
            </DiagramBlock>

            <Analogy label="The secret shape hiding in the data">
                The covariance matrix has its own eigenvectors. These eigenvectors point in the directions
                where the data is most spread out. In the scatter plot above, the <strong>amber arrow</strong>{" "}
                points in the direction of maximum spread — the "main direction" the data runs along. The{" "}
                <strong>blue arrow</strong> is perpendicular: the direction of least spread.
                <br /><br />
                This is exactly what <strong>PCA</strong> (Principal Component Analysis) does — it finds
                those arrows automatically. It's how AI shrinks a dataset with 1000 measurements per
                person down to just 10 numbers, keeping the most important information.
            </Analogy>

            <Analogy label="Why does all this matter for AI?">
                In a neural network, every word, image, and sound is turned into an arrow (a vector of
                numbers). The network uses matrix machines to slowly bend and reshape those arrows until{" "}
                <strong>similar things end up pointing in similar directions</strong>. That's how it learns
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
                Adding two vectors is like taking two trips back-to-back. You've seen this in physics as
                combining forces or velocities: (3, 2) + (1, 4) = (4, 6).
            </p>

            <h3>Scalar Multiplication</h3>
            <p>
                Multiplying by a number just stretches or shrinks the arrow: 2 × (3, 2) = (6, 4). Same
                direction, twice as long.
            </p>

            <h3>The Dot Product — your new best friend</h3>
            <p>
                Given two vectors <strong>a</strong> = (a₁, a₂) and <strong>b</strong> = (b₁, b₂):
            </p>
            <MathBlock tex="\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 = |\vec{a}||\vec{b}|\cos\theta" />
            <p>
                The dot product measures how much two vectors "point the same way." When θ = 90°, cos θ = 0
                — orthogonal vectors have zero dot product. In ML this is used constantly to measure
                similarity between embeddings.
            </p>

            <h3>Matrices as Transformations</h3>
            <p>
                A 2×2 matrix A applied to vector <strong>x</strong> produces a new vector{" "}
                <strong>y</strong> = A<strong>x</strong> — a coordinate transformation, like the same shape
                seen in a distorted mirror.
            </p>
            <MathBlock tex="\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix} \begin{pmatrix} 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}" />
            <p>
                This matrix stretched x by 2 and y by 3. Every neural network layer does something like
                this — projecting input into a new space where patterns are easier to see.
            </p>

            <h3>Eigenvalues & Eigenvectors — what doesn't change direction?</h3>
            <p>
                Most vectors get rotated and stretched when you apply a matrix. But for every square
                matrix A, there exist special vectors <strong>v</strong> that only get stretched — they
                don't change direction at all. These are called <strong>eigenvectors</strong>, and the
                stretch factor is the <strong>eigenvalue</strong> λ:
            </p>
            <MathBlock tex="A\mathbf{v} = \lambda\mathbf{v}" />
            <p>
                Read this as: "applying matrix A to vector <strong>v</strong> is the same as just scaling{" "}
                <strong>v</strong> by the number λ." The direction is preserved; only the magnitude
                changes.
            </p>

            <h3>Finding Eigenvalues — the characteristic equation</h3>
            <p>
                To find the eigenvalues, rearrange <InlineMath tex="A\mathbf{v} = \lambda\mathbf{v}" /> as{" "}
                <InlineMath tex="(A - \lambda I)\mathbf{v} = \mathbf{0}" />. For this to have a non-zero
                solution, the matrix <InlineMath tex="(A - \lambda I)" /> must be singular — meaning its
                determinant is zero:
            </p>
            <MathBlock tex="\det(A - \lambda I) = 0" />
            <p>
                This is the <strong>characteristic equation</strong>. For a 2×2 matrix it gives a
                quadratic in λ. The roots are the eigenvalues. For example:
            </p>
            <MathBlock tex="A = \begin{pmatrix} 3 & 1 \\ 0 & 2 \end{pmatrix} \implies \det\begin{pmatrix} 3-\lambda & 1 \\ 0 & 2-\lambda \end{pmatrix} = (3-\lambda)(2-\lambda) = 0" />
            <p>
                So λ₁ = 3 and λ₂ = 2. Then for each eigenvalue, solve{" "}
                <InlineMath tex="(A - \lambda I)\mathbf{v} = \mathbf{0}" /> to find the corresponding
                eigenvector. For λ₁ = 3: the eigenvector is (1, 0) — the x-axis is preserved. For
                λ₂ = 2: the eigenvector is (1, −1).
            </p>

            <h3>Geometric Intuition</h3>
            <p>
                Picture a matrix that stretches space along two axes. The eigenvectors point along those
                stretch axes — they are the "natural axes" of the transformation. Everything else is a
                combination of those special directions getting scaled differently.
            </p>
            <p>
                A matrix with eigenvalues λ₁ = 3 and λ₂ = 0.5 stretches space 3× in one direction and
                squishes it by half in another. Vectors along the first eigenvector grow; vectors along the
                second shrink. Every other vector does a mix of both.
            </p>

            <h3>Why Eigenvalues Matter in Machine Learning</h3>
            <p>
                <strong>PCA (Principal Component Analysis)</strong> is built entirely on eigendecomposition.
                Given a dataset of n samples with d features, form the covariance matrix{" "}
                <InlineMath tex="\Sigma \in \mathbb{R}^{d \times d}" />. Its eigenvectors point in the
                directions of greatest variance in the data; its eigenvalues tell you{" "}
                <em>how much</em> variance lies along each direction.
            </p>
            <p>
                Sort eigenvectors by their eigenvalues (largest first). Keep the top k. You've just found
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
                The entry Σᵢⱼ captures how features i and j vary together across your samples:
            </p>
            <ul>
                <li><strong>Σᵢⱼ &gt; 0</strong> — features i and j tend to increase together (e.g. height and weight)</li>
                <li><strong>Σᵢⱼ &lt; 0</strong> — when feature i goes up, feature j tends to go down</li>
                <li><strong>Σᵢⱼ ≈ 0</strong> — the two features are unrelated</li>
                <li><strong>Σᵢᵢ</strong> — the diagonal: variance of feature i on its own</li>
            </ul>
            <p>
                The covariance matrix is always symmetric (Σ = Σᵀ) and positive semi-definite — its
                eigenvalues are always ≥ 0. Its eigendecomposition Σ = QΛQᵀ gives:
            </p>
            <ul>
                <li><strong>Eigenvectors (columns of Q)</strong> — the principal axes of the data ellipsoid, the directions of greatest spread</li>
                <li><strong>Eigenvalues (λᵢ)</strong> — the variance of the data along each principal axis</li>
            </ul>
            <p>
                Sorting by eigenvalue largest-to-smallest and keeping the top k eigenvectors is exactly{" "}
                <strong>PCA</strong>. The diagram below shows a 2D dataset — the amber arrow (PC₁) points
                in the direction of maximum variance, and the blue arrow (PC₂) is perpendicular to it.
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
            <p>
                What follows is the rigorous foundation underlying every operation in a neural network.
                Each definition is paired with its practical meaning in ML.
            </p>

            <DefBlock label="Definition — Vector Space">
                A set V over field 𝔽 with operations +: V×V → V and ·: 𝔽×V → V satisfying 8 axioms:
                commutativity and associativity of addition, distributivity of scalars, existence of a
                zero vector (additive identity), and additive inverses. Every point in activation space,
                every weight tensor, every embedding lives in some vector space.
            </DefBlock>

            <h3>Vectors & Norms</h3>
            <p>
                A vector <strong>x</strong> ∈ ℝⁿ is an ordered n-tuple of real numbers. The{" "}
                <strong>norm</strong> measures its "size." The general L<sup>p</sup> norm family is:
            </p>
            <MathBlock tex="\|\mathbf{x}\|_p = \left(\sum_{i=1}^n |x_i|^p\right)^{1/p}" />
            <p>
                The choice of p matters. <strong>L² (p=2)</strong> is Euclidean distance — it's the
                natural notion of "length" and appears in MSE loss and weight decay. <strong>L¹ (p=1)</strong>{" "}
                sums absolute values and appears in MAE loss and LASSO regularisation, which encourages
                sparse solutions. <InlineMath tex="L^\infty = \max_i|x_i|" /> measures the single largest
                component — useful for bounding worst-case error.
            </p>

            <h3>Inner Product & Cosine Similarity</h3>
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

            <DiagramBlock title="Dot product geometry — vectors a and b, angle θ, and projection">
                <DotProductDiagram />
            </DiagramBlock>

            <h3>Matrix Multiplication</h3>
            <p>
                For <InlineMath tex="A \in \mathbb{R}^{m\times k}" /> and{" "}
                <InlineMath tex="B \in \mathbb{R}^{k\times n}" />, their product{" "}
                <InlineMath tex="C = AB \in \mathbb{R}^{m\times n}" /> has entries:
            </p>
            <MathBlock tex="C_{ij} = \sum_{l=1}^k A_{il}\, B_{lj}" />
            <p>
                Think of C's (i,j) entry as the dot product of row i of A with column j of B. This
                operation is the engine of neural networks — a forward pass through a linear layer is{" "}
                <InlineMath tex="\mathbf{y} = W\mathbf{x} + \mathbf{b}" />. The entire reason GPUs exist
                in ML is that they can compute batches of matrix products in parallel using thousands of
                cores. Matrix multiplication is associative but <em>not commutative</em>: AB ≠ BA in
                general.
            </p>

            <DiagramBlock title="Matrix transformation — how a linear map stretches the unit square">
                <MatTransformDiagram />
            </DiagramBlock>

            <h3>Eigenvalues & Eigenvectors</h3>
            <p>
                A non-zero vector <strong>v</strong> is an <strong>eigenvector</strong> of square matrix A
                if applying A only scales it — preserving direction:
            </p>
            <MathBlock tex="A\mathbf{v} = \lambda\mathbf{v}" />
            <p>
                The scalar λ is the corresponding <strong>eigenvalue</strong>. Geometrically: A transforms
                all of space, but eigenvectors are the special axes that don't rotate — they just stretch
                (λ &gt; 1), shrink (0 &lt; λ &lt; 1), or flip (λ &lt; 0).
            </p>
            <p>
                To find eigenvalues, solve the <strong>characteristic equation</strong>:
            </p>
            <MathBlock tex="\det(A - \lambda I) = 0" />
            <p>
                This yields a degree-n polynomial in λ whose n roots are the eigenvalues. For each
                eigenvalue λᵢ, the corresponding eigenvector solves{" "}
                <InlineMath tex="(A - \lambda_i I)\mathbf{v}_i = \mathbf{0}" />.
            </p>

            <h3>Eigendecomposition</h3>
            <p>
                When A is symmetric (A = Aᵀ) — as covariance matrices always are — its eigenvectors are
                orthogonal and its eigenvalues are real. This enables the clean decomposition:
            </p>
            <MathBlock tex="A = Q\,\Lambda\,Q^\top" />
            <p>
                Here Q ∈ ℝⁿˣⁿ has orthonormal eigenvectors as columns, and{" "}
                <InlineMath tex="\Lambda = \text{diag}(\lambda_1,\ldots,\lambda_n)" /> holds the
                eigenvalues sorted largest-first. This is the mathematical engine of{" "}
                <strong>PCA</strong>: eigendecompose the sample covariance matrix{" "}
                <InlineMath tex="\Sigma = \frac{1}{n}X^\top X" />, project data onto the top-k
                eigenvectors (principal components), and you've found the k directions of maximum
                variance. The eigenvalue λᵢ tells you exactly how much variance the i-th component
                explains.
            </p>
            <p>
                In optimisation, the eigenvalues of the <strong>loss Hessian</strong>{" "}
                <InlineMath tex="\nabla^2 \mathcal{L}" /> govern training dynamics. Large eigenvalues
                mean sharp curvature — learning rate must be small or training diverges. Small eigenvalues
                mean flat directions — training is slow. Adaptive optimisers like Adam implicitly rescale
                gradients to compensate for this spectrum.
            </p>

            <DiagramBlock title="Eigenvectors — the axes that survive a transformation unchanged in direction">
                <EigenvectorDiagram />
            </DiagramBlock>

            <DiagramBlock title="Covariance matrix — eigenvectors reveal the natural axes of the data cloud">
                <CovarianceDiagram />
            </DiagramBlock>

            <h3>Singular Value Decomposition (SVD)</h3>
            <p>
                SVD is the generalisation of eigendecomposition to non-square matrices. Any{" "}
                <InlineMath tex="A \in \mathbb{R}^{m\times n}" /> decomposes as:
            </p>
            <MathBlock tex="A = U\,\Sigma\,V^\top" />
            <p>
                U ∈ ℝᵐˣᵐ (left singular vectors — output directions), Σ ∈ ℝᵐˣⁿ (diagonal, non-negative
                singular values σ₁ ≥ σ₂ ≥ … ≥ 0), V ∈ ℝⁿˣⁿ (right singular vectors — input
                directions). The singular values measure how much A "stretches" each direction.
            </p>
            <p>
                The rank-k approximation <InlineMath tex="\hat{A}_k = U_k \Sigma_k V_k^\top" /> is the
                best possible approximation of A using only k directions (Eckart–Young theorem). This
                underpins:
            </p>
            <ul>
                <li>
                    <strong>PCA</strong> — SVD of the centred data matrix X gives principal components
                    directly, without forming XᵀX explicitly
                </li>
                <li>
                    <strong>Low-rank approximation</strong> — compress weight matrices while retaining
                    most of their "information"
                </li>
                <li>
                    <strong>LoRA (2022)</strong> — fine-tune LLMs efficiently by learning a low-rank
                    update <InlineMath tex="\Delta W = BA" /> where B ∈ ℝᵐˣʳ, A ∈ ℝʳˣⁿ, r ≪ min(m,n)
                </li>
            </ul>

            <DiagramBlock title="SVD — any matrix decomposes into rotate → scale → rotate">
                <SVDDiagram />
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
                update per step. The learning rate η controls step size. The gradient itself is computed
                via backpropagation — repeated application of the chain rule, all of which reduces to
                matrix-vector products.
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

print(a + b)                          # element-wise add  → [5. 7. 9.]
print(a * 2)                          # scalar multiply   → [2. 4. 6.]
print(np.dot(a, b))                   # dot product       → 32.0

# L2 norm — two equivalent ways
print(np.linalg.norm(a))              # → 3.7417
print(np.sqrt(np.dot(a, a)))          # → 3.7417

# Cosine similarity — used everywhere in ML (attention, retrieval)
def cosine_sim(x, y):
    return np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

king  = np.array([0.8, 0.2, 0.1])
queen = np.array([0.7, 0.3, 0.2])
print(f"cosine similarity: {cosine_sim(king, queen):.4f}")  # → 0.9984

# ── Matrix operations ─────────────────────────────────────
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A @ B)          # matrix multiply (@ is matmul)   → [[19 22] [43 50]]
print(A @ v[:2])      # matrix × vector                 → [ 5. 11.]
print(A.T)            # transpose                       → [[1 3] [2 4]]

# ── Linear layer: y = Wx + b ──────────────────────────────
# This is exactly what nn.Linear does in PyTorch
x = np.array([1.0, 2.0, 3.0])        # input (3-dim)
b = np.array([0.1, -0.1])            # bias (2-dim)

y = W @ x + b                        # output (2-dim)
print(y)                              # → [2.5  1.9]

# ── Eigenvalues & Eigenvectors ────────────────────────────
# Used in PCA to find directions of maximum variance

cov = np.array([[3.0, 1.0],           # 2×2 covariance matrix
                [1.0, 2.0]])

eigenvalues, eigenvectors = np.linalg.eig(cov)
print("Eigenvalues:",  eigenvalues)   # → [3.618  1.382]
print("Eigenvectors:", eigenvectors)  # columns are the eigenvectors

# Verify: A @ v == λ * v
v0 = eigenvectors[:, 0]               # first eigenvector
lam0 = eigenvalues[0]
print(np.allclose(cov @ v0, lam0 * v0))  # → True

# ── PCA via SVD (the numerically stable way) ──────────────
# Simulated data: 100 samples, 3 features
np.random.seed(42)
X = np.random.randn(100, 3)
X -= X.mean(axis=0)                   # center the data

U, S, Vt = np.linalg.svd(X, full_matrices=False)
# S² / (n-1) are the eigenvalues of the covariance matrix
# Vt rows are the principal components (eigenvectors)

k = 2                                 # keep top-2 components
X_reduced = X @ Vt[:k].T             # project: (100, 3) → (100, 2)
print("Variance explained:",
      (S[:k]**2 / (S**2).sum()).round(3))  # e.g. → [0.381 0.347]`

function PythonTab() {
    return (
        <>
            <p>
                NumPy is the foundation of scientific Python. Under the hood, every operation dispatches
                to optimised BLAS/LAPACK routines written in C and Fortran — the same code powering
                PyTorch's CPU path.
            </p>
            <CodeBlock code={PY_CODE} filename="linear_algebra.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The <code>@</code> operator is matrix multiplication.{" "}
                <code>np.linalg.eig</code> returns eigenvalues and eigenvectors; prefer{" "}
                <code>np.linalg.eigh</code> for symmetric matrices (faster and numerically stable).{" "}
                <code>np.linalg.svd</code> is the numerically preferred way to do PCA — it avoids
                explicitly forming XᵀX which can amplify numerical errors.
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

/** Dot product: Σ aᵢ·bᵢ  — the workhorse of neural networks */
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

/** Matrix × Vector  →  the core of a neural network layer */
function matVecMul(W: Mat, x: Vec): Vec {
  return W.map(row => dot(row, x));
}

/** Matrix × Matrix — O(n³), but GPUs do this in parallel */
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

/** Transpose: flip rows ↔ columns */
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

const W: Mat = [           // 2×3 weight matrix
  [0.5, -0.2, 0.8],
  [0.1,  0.9, -0.3],
];
const b: Vec = [0.1, -0.1];    // bias
const x: Vec = [1.0, 2.0, 3.0]; // input (3-dim)

console.log(linearLayer(W, b, x));
// → [2.5, 1.9]  — projected from 3D to 2D

// Cosine similarity — used in attention, retrieval, embeddings
const king: Vec  = [0.8, 0.2, 0.1];
const queen: Vec = [0.7, 0.3, 0.2];
console.log(cosineSim(king, queen).toFixed(4));
// → 0.9984 — very similar directions (semantically related words)`

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript with no libraries. These implementations build intuition before reaching for
                NumPy or PyTorch.
            </p>
            <CodeBlock code={TS_CODE} filename="linear-algebra.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Next step:</strong> Replace these loops with <code>numpy</code> in Python, which
                calls optimised BLAS routines — the same operations, 100–1000× faster due to SIMD and
                cache-aware memory layouts.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const LINEAR_ALGEBRA_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
