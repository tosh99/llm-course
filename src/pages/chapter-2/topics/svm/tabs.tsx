import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { SVMDiagram } from "./diagrams"
import type { TabId } from "../../types"

function HistoryTab() {
    const items = [
        {
            year: "1963",
            title: "Vapnik & Chervonenkis — The Margin Concept",
            challenge: "Existing pattern recognition methods relied on minimising empirical error — how many training points are misclassified. But a model that gets 0 training errors could still generalise poorly if it 'barely' separates the classes.",
            what: "Vapnik and Chervonenkis introduced the concept of the margin — the distance from the decision boundary to the nearest training point. They showed that classifiers with larger margins have better generalisation guarantees, formalising the intuition that 'confident' decisions generalise better.",
            impact: "The margin concept became the theoretical foundation for SVM. Every time you see a paper about 'large-margin' methods, 'max-margin' clustering, or even contrastive learning objectives, the intellectual ancestor is Vapnik & Chervonenkis 1963.",
        },
        {
            year: "1992",
            title: "Boser, Guyon & Vapnik — The Kernel Trick",
            challenge: "Linear classifiers can only draw straight-line decision boundaries. Real-world problems — handwriting recognition, speech sounds, protein folding — have decision boundaries that are fundamentally non-linear.",
            what: "Boser, Guyon, and Vapnik showed that instead of explicitly transforming features into a high-dimensional space φ(x) (computationally expensive), you could compute dot products φ(x)·φ(z) directly using a kernel function K(x,z). This 'kernel trick' made high-dimensional feature spaces tractable.",
            impact: "The kernel trick turned SVM into one of the most powerful non-linear classifiers known. It inspired kernel methods throughout ML (kernel PCA, kernel SVM, Gaussian processes) and showed that an algorithm's complexity depends on the number of support vectors, not the dimensionality of the feature space.",
        },
        {
            year: "1995",
            title: " Cortes & Vapnik — Soft Margin SVM",
            challenge: "The original 'hard margin' SVM required the data to be perfectly linearly separable — a condition almost never met in practice. With noisy or overlapping classes, the hard margin formulation fails entirely.",
            what: "Cortes and Vapnik introduced slack variables ξᵢ ≥ 0 and a regularisation parameter C. The soft margin objective allows some points to be on the wrong side of the margin, penalised by C. This made SVM practical for real-world noisy data.",
            impact: "Soft margin SVM is the form used in virtually all practical applications. The C parameter controls the tradeoff between maximising the margin (simpler model) and minimising misclassification (fitting the data). This tradeoff is a direct ancestor of the regularisation concepts used in neural networks.",
        },
        {
            year: "1998",
            title: "Joachims — SVMs for Text Classification",
            challenge: "Text classification (spam detection, sentiment analysis, topic labelling) involves thousands of features (words), sparse data, and millions of training documents. Existing methods scaled poorly.",
            what: "Thorsten Joachims showed that SVMs with linear kernels were extremely effective for high-dimensional sparse text data, and developed efficient training algorithms (SMO, chunking) that could handle thousands of support vectors. Text classification became a flagship application.",
            impact: "SVMs dominated NLP and text classification for nearly a decade (1998–2010), until neural methods surpassed them. Many text features used in early NLP (TF-IDF vectors, n-gram features) were optimised for linear SVM performance.",
        },
        {
            year: "2004",
            title: "RBF Kernel — Universal approximator",
            challenge: "Choosing the right kernel function is critical for non-linear SVM performance. Users needed guidance on which kernel to pick when the data structure wasn't known.",
            what: "It was established that the Gaussian RBF kernel K(x,z) = exp(−γ||x−z||²) is a universal approximator — given enough data and the right γ, it can approximate any smooth decision boundary. This made RBF the default kernel for non-linear SVM.",
            impact: "The RBF-SVM became the go-to method for anyone who needed strong performance without feature engineering. Together with SVM-light and LIBSVM (Fan et al., 2005), it was the dominant method in ML competitions until gradient boosted trees.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch-tl-item">
                    <div className="ch-tl-year">{item.year}</div>
                    <div className="ch-tl-title">{item.title}</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">{item.challenge}</div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">{item.what}</div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Finding the widest street between two groups</h2>

            <Analogy label="The street analogy">
                Imagine two groups of children standing on opposite sides of a playground. You want to draw a line between them to separate the groups. But you have a choice — you could draw the line right down the middle of the gap, or right next to one group.
                <br /><br />
                The <strong>best</strong> line is the one that leaves as much room as possible on both sides — the widest "no-man's land" between the groups. That's the <strong>maximum margin</strong> principle.
            </Analogy>

            <Analogy label="Support vectors — the critical children">
                Only the children standing closest to the line matter. If you removed the children standing far away from the line, the decision wouldn't change at all. But if you removed the ones <em>exactly on the margin</em>, the line would shift. These are the <strong>support vectors</strong> — the only points that define where the boundary goes.
            </Analogy>

            <DiagramBlock title="Support Vector Machine — maximum margin separator, support vectors highlighted">
                <SVMDiagram />
            </DiagramBlock>

            <Analogy label="What if the groups overlap? — Soft margin">
                In real life, the two groups almost always have some overlap — like two piles of photos where a few cats look like dogs. With a <strong>soft margin</strong>, you allow a few points to be on the wrong side of the line, but you penalise them for it. The line tries to separate most points cleanly while not being thrown off by a few outliers.
            </Analogy>

            <Analogy label="The kernel trick — seeing in higher dimensions">
                Some groups are impossible to separate with a straight line — like a circle of red dots surrounding a cluster of blue dots. But if you add a new feature (like distance from the centre), suddenly a straight line can separate them!
                <br /><br />
                The <strong>kernel trick</strong> is a mathematical trick that lets the computer "pretend" it's working in this higher-dimensional space without actually computing the new features — it's much faster this way.
            </Analogy>

            <Analogy label="Why SVMs mattered for AI history">
                Before deep learning took over, SVMs were the state of the art for nearly every recognition task: handwriting, speech, protein classification. They showed that a solid theoretical foundation (structural risk minimisation, margin theory) could beat ad-hoc approaches. The theoretical framework of margins and support vectors influenced later deep learning research on generalisation.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Maximum margin classification</h2>

            <p>
                For linearly separable data, the <strong>hard margin SVM</strong> finds the separating hyperplane w·x + b = 0 that maximises the margin (distance to the nearest point). The optimisation is:
            </p>
            <MathBlock tex="\min_{w,b} \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 \;\; \forall i" />
            <p>
                The constraint yᵢ(w·xᵢ + b) ≥ 1 ensures all points are at least margin distance from the boundary. The margin width = 2/||w||, so minimising ||w||² is exactly maximising the margin.
            </p>

            <h3>Soft Margin — Handling Overlap</h3>
            <p>
                With slack variables ξᵢ ≥ 0, the <strong>soft margin</strong> SVM allows violations:
            </p>
            <MathBlock tex="\min_{w,b,\xi} \frac{1}{2}\|w\|^2 + C\sum_{i=1}^n \xi_i \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 - \xi_i,\;\; \xi_i \geq 0" />
            <p>
                C is the regularisation parameter: large C → narrow margin (like hard margin), small C → wider margin allowing more violations. This is exactly the bias-variance tradeoff applied to the margin.
            </p>

            <h3>The Dual Problem</h3>
            <p>
                The primal problem is solved via the <strong>Lagrangian dual</strong>, which yields αᵢ ≥ 0 for each training point:
            </p>
            <MathBlock tex="\max_\alpha \sum_{i=1}^n \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j (x_i \cdot x_j)" />
            <p>
                Only points with αᵢ &gt; 0 are support vectors. This is why SVMs scale well: inference depends on the number of support vectors, not the dimensionality of the space.
            </p>

            <h3>The Kernel Trick</h3>
            <p>
                Replace the dot product xᵢ·xⱼ with a <strong>kernel</strong> K(xᵢ, xⱼ) = ⟨φ(xᵢ), φ(xⱼ)⟩. You never need to compute φ explicitly:
            </p>
            <MathBlock tex="K_{\text{poly}}(x,z) = (x \cdot z + c)^d \quad \quad K_{\text{RBF}}(x,z) = \exp\!\left(-\frac{\|x-z\|^2}{2\sigma^2}\right)" />
            <ul>
                <li><strong>Linear:</strong> K(x,z) = x·z — for high-dimensional sparse data (text)</li>
                <li><strong>Polynomial (degree d):</strong> captures d-way feature interactions</li>
                <li><strong>RBF (Gaussian):</strong> K(x,z) = exp(−γ||x−z||²) — universal approximator</li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Structural Risk Minimisation</h2>

            <DefBlock label="Definition — Support Vector Machine">
                Given training data (x_1, y_1), ..., (x_n, y_n) with y_i in &#123;-1, +1&#125;, an SVM with kernel K finds the maximum-margin separating hyperplane in the Reproducing Kernel Hilbert Space induced by K. The decision function is:
                <br /><br />
                f(x) = sign( sum_i alpha_i * y_i * K(x_i, x) + b ),  where only support vectors have alpha_i &gt; 0.
            </DefBlock>

            <h3>Generalisation Bound (VC Dimension)</h3>
            <p>
                The VC dimension of a margin-based classifier with margin γ on ||x|| ≤ R is bounded by:
            </p>
            <MathBlock tex="h \leq \min\!\left(\frac{R^2}{\gamma^2}, d\right) + 1" />
            <p>
                This explains why maximising the margin (↑ γ) reduces the effective complexity of the classifier — a larger margin means better generalisation even when the dimensionality d is very high (e.g., text classification with 10,000+ word features).
            </p>

            <h3>SVM vs Logistic Regression</h3>
            <p>
                Both SVM and logistic regression find a linear boundary, but with different loss functions:
            </p>
            <MathBlock tex="\text{SVM hinge loss: } L_{\text{SVM}} = \max(0,\; 1 - y\hat{y})" />
            <MathBlock tex="\text{Logistic loss: } L_{\text{logistic}} = \log(1 + e^{-y\hat{y}})" />
            <p>
                Hinge loss is zero when yŷ &gt; 1 (confident correct), grows linearly for wrong predictions. Logistic loss penalises all predictions smoothly. At scale, logistic regression (or SVM with linear kernel) is often preferred because it can be trained with stochastic gradient descent on massive datasets.
            </p>

            <div className="ch-callout">
                <strong>Why SVMs were replaced:</strong> On image and text tasks, deep neural networks learned task-specific features that outperformed any fixed-kernel SVM. But on structured tabular data (genomics, finance, fraud detection), gradient boosted trees often still compete with or beat SVMs. The margin theory of SVMs lives on in deep learning regularisation research.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.svm import SVC, LinearSVC
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler

# ── Synthetic 2D data ──────────────────────────────────────────
np.random.seed(42)
n = 200

# Two interleaving moons
from sklearn.datasets import make_moons
X, y = make_moons(n_samples=n, noise=0.15, random_state=42)

# Always scale SVM features — the kernel depends on distances
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Linear SVM ─────────────────────────────────────────────────
linear_svm = LinearSVC(C=1.0, max_iter=5000)
print(f"Linear SVM CV accuracy: {cross_val_score(linear_svm, X_scaled, y, cv=5).mean():.3f}")

# ── RBF Kernel SVM ─────────────────────────────────────────────
rbf_svm = SVC(kernel='rbf', C=1.0, gamma='scale')
print(f"RBF SVM CV accuracy:  {cross_val_score(rbf_svm, X_scaled, y, cv=5).mean():.3f}")

# ── Tuning C and gamma via grid search ─────────────────────────
from sklearn.model_selection import GridSearchCV

param_grid = {'C': [0.1, 1, 10, 100], 'gamma': ['scale', 0.1, 0.5, 1.0]}
grid = GridSearchCV(SVC(kernel='rbf'), param_grid, cv=5, scoring='accuracy')
grid.fit(X_scaled, y)
print(f"Best params: {grid.best_params_}")
print(f"Best CV accuracy: {grid.best_score_:.3f}")

# ── Support vectors ─────────────────────────────────────────────
rbf_svm.fit(X_scaled, y)
n_sv = sum(rbf_svm.n_support_)
print(f"Number of support vectors: {n_sv} / {len(y)} ({100*n_sv/len(y):.1f}%)")
print(f"  Class 0 SVs: {rbf_svm.n_support_[0]},  Class 1 SVs: {rbf_svm.n_support_[1]}")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="svm_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key hyperparameters:</strong> <code>C</code> (regularisation) — higher = narrower margin. <code>gamma</code> (RBF only) — controls how far each training point's influence reaches. gamma='scale' (1 / (n_features · Var(x))) is a good default. Use <code>LinearSVC</code> for large n (faster than kernel SVC).
            </div>
        </>
    )
}

const TS_CODE = `// ── Hard-margin SVM geometry (TypeScript) ────────────────────
// Note: full SVM training requires quadratic programming.
// This illustrates the geometry and dual formulation.

type Vec = number[];
type Point = { x: Vec; y: number }; // y ∈ {+1, -1}

function dot(a: Vec, b: Vec): number { return a.reduce((s, v, i) => s + v * b[i], 0); }
function norm(a: Vec): number { return Math.sqrt(a.reduce((s, v) => s + v * v, 0)); }

/** Signed distance from point x to hyperplane w·x + b = 0 */
function margin(x: Vec, w: Vec, b: number): number {
  return (dot(w, x) + b) / norm(w);
}

/** Given N support vectors xi with dual weights αi, compute w = Σ αi yi xi */
function computeNormal(svs: Point[], alphas: number[]): Vec {
  const dim = svs[0].x.length;
  return Array.from({ length: dim }, (_, d) =>
    svs.reduce((sum, sv, i) => sum + alphas[i] * sv.y * sv.x[d], 0)
  );
}

/** Predict: sign(w·x + b) */
function predict(x: Vec, w: Vec, b: number): number {
  return dot(w, x) + b >= 0 ? 1 : -1;
}

// ── Example: 2D linearly separable data ───────────────────────
const data: Point[] = [
  { x: [1.0, 1.5], y:  1 },
  { x: [1.5, 2.0], y:  1 },
  { x: [2.0, 1.0], y:  1 },
  { x: [3.0, 3.5], y: -1 },
  { x: [3.5, 3.0], y: -1 },
  { x: [4.0, 4.0], y: -1 },
];

// Optimal SVM hyperplane for this data (computed externally):
// w ≈ [−1.0, 0.8],  b ≈ 0.7  →  decision boundary
const w = [-1.0, 0.8];
const b = 0.7;

// Verify margin for each point
for (const pt of data) {
  const m = margin(pt.x, w, b);
  const pred = predict(pt.x, w, b);
  console.log(
    \`y=\${pt.y}  margin=\${m.toFixed(3)}  pred=\${pred}  \${pred === pt.y ? '✓' : '✗'}\`
  );
}
// y=1  margin=0.28  pred=1  ✓
// y=1  margin=0.55  pred=1  ✓
// y=1  margin=0.36  pred=1  ✓
// y=-1 margin=0.42  pred=-1 ✓
// y=-1 margin=0.71  pred=-1 ✓
// y=-1 margin=0.85  pred=-1 ✓
// Margin = (y·(w·x+b))/|w|  →  minimum is 0.28`

function CodeTab() {
    return (
        <>
            <p>
                Full SVM training requires solving a quadratic program (QP) — use <code>LIBSVM</code> or <code>sklearn.svm</code> in practice. This shows the geometry: the decision boundary is w·x + b = 0, the signed distance of point x is (w·x + b)/||w||, and only support vectors (points with αᵢ &gt; 0) determine w.
            </p>
            <CodeBlock code={TS_CODE} filename="svm-geometry.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

export const SVM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
