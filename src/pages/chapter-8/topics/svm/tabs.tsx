import { Analogy, CodeBlock, MathBlock } from "../../shared"
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
            year: "1963",
            title: "Vapnik & Chervonenkis — VC Dimension and Statistical Learning Theory",
            challenge:
                "Chapter 7 had ended with LeNet-5 (1998) demonstrating convolutional networks on digit recognition. But by then, deep neural networks had already stalled: training anything beyond two layers was unreliable, and the field lacked a mathematical framework to explain why one classifier generalised better than another. Practitioners selected models by intuition rather than theory. Vladimir Vapnik and Alexey Chervonenkis, working at Moscow's Institute of Control Sciences, began developing a rigorous answer to the question: what properties of a classifier guarantee low error on unseen data?",
            what:
                "Vapnik and Chervonenkis introduced the concept of VC dimension — a measure of a hypothesis class's expressive capacity. A classifier with VC dimension h can shatter h points (correctly classify all 2^h label assignments). They proved the fundamental theorem of statistical learning: the generalisation error of any classifier is bounded by its empirical training error plus a complexity term that grows with h and shrinks with n (number of training examples). Separately, they showed that a linear classifier with a large margin has lower VC dimension and hence tighter generalisation bounds — the theoretical seed of the SVM.",
            impact:
                "Structural Risk Minimisation (SRM), their resulting framework, unified the bias-variance tradeoff into a single principled theory. For the first time, ML had a mathematical reason to prefer classifiers with larger margins: they have smaller VC dimension and hence better generalisation guarantees regardless of input dimensionality. Every paper that discusses 'large-margin methods' — from SVMs to contrastive learning to RLHF penalty terms — traces its intellectual lineage to this 1963 work.",
        },
        {
            year: "1992",
            title: "Boser, Guyon & Vapnik — The Kernel Trick and Nonlinear SVM",
            challenge:
                "The hard-margin SVM found the widest linear separator. But most real problems — handwriting recognition, protein folding, image classification — are not linearly separable. The obvious remedy was to map data into a high-dimensional feature space where it becomes separable. The problem: if you had 100 original features and wanted all pairwise products, you created 10,000 new features. Computing pairwise similarities across thousands of training points in that space was computationally prohibitive — and the feature map itself was never written down explicitly.",
            what:
                "Bernhard Boser, Isabelle Guyon, and Vladimir Vapnik observed that the SVM's dual optimisation problem involves training data only through pairwise dot products x_i · x_j. Replacing each dot product with a kernel function K(x_i, x_j) = phi(x_i) · phi(x_j) computes the inner product in the high-dimensional feature space without ever materialising phi. The Gaussian RBF kernel K(x, z) = exp(−gamma ||x − z||^2) corresponds to an infinite-dimensional feature space and still costs only O(d) per evaluation. A valid kernel must satisfy Mercer's condition: it must be a symmetric positive semi-definite function.",
            impact:
                "The kernel trick transformed SVM into the most powerful non-linear classifier of its era. It also generalised to kernel PCA, Gaussian process regression, kernel regression, and any algorithm expressible in terms of dot products. The deeper insight — that you can implicitly work in infinite-dimensional spaces via kernel evaluations — shaped how researchers thought about feature engineering for the next 20 years and later influenced attention mechanisms in Transformers (the attention matrix is a kernel matrix between query and key vectors).",
        },
        {
            year: "1995",
            title: "Cortes & Vapnik — Soft-Margin SVM and the C Parameter",
            challenge:
                "The 1992 hard-margin SVM required perfect linear separability in the kernel space — a condition almost never met with real noisy data. Even a single mislabelled example or outlier could make the problem infeasible. A practical classifier needed a principled way to allow some violations while still favouring large margins.",
            what:
                "Corinna Cortes and Vladimir Vapnik introduced slack variables xi_i >= 0. The objective became: minimise (1/2)||w||^2 + C * sum(xi_i), where C is a hyperparameter controlling the tradeoff between margin width and training accuracy. Each slack variable measures how far a point is inside or on the wrong side of the margin. The total penalty C * sum(xi_i) is exactly the hinge loss summed across examples — so soft-margin SVM is equivalent to L2-regularised hinge loss minimisation. Large C: narrow margin (penalise violations heavily); small C: wide margin (accept more violations).",
            impact:
                "Soft-margin SVM is the form used in virtually every practical application. The hyperparameter C is the reciprocal of the L2 regularisation strength lambda — it controls the same bias-variance tradeoff from the opposite direction. SVMs with RBF kernels dominated NLP (1998–2010), bioinformatics (2000–2010), and computer vision feature classification (2005–2012) before deep learning surpassed them on large-scale raw-input tasks.",
        },
        {
            year: "1999",
            title: "Platt — Sequential Minimal Optimisation and Probabilistic Outputs",
            challenge:
                "The quadratic programming problem underlying SVM training had O(n^3) time complexity and O(n^2) memory. For datasets with tens of thousands of examples — common in text classification and bioinformatics — this was intractable. Additionally, SVMs output a decision value (signed distance from the hyperplane), not a probability. Applications like medical diagnosis and risk scoring required calibrated probability estimates.",
            what:
                "John Platt introduced two complementary contributions. Sequential Minimal Optimisation (SMO) decomposed the quadratic program into a sequence of 2-variable subproblems, each solvable analytically without any external QP solver. This reduced training from hours to minutes on mid-size datasets. Separately, Platt proposed calibrating SVM outputs with a sigmoid function: P(y=1 | f(x)) = 1 / (1 + exp(Af(x) + B)), fitting A and B by maximum likelihood on a validation set. This sigmoid calibration became the standard way to convert any classifier's scores into probabilities.",
            impact:
                "SMO made SVMs practical at scale. LIBSVM (Fan et al., 2005), which implemented SMO with careful numerical engineering, became the default SVM implementation used in over 100,000 research papers. Platt scaling was generalised to any binary classifier and remains the standard calibration method for SVMs, Random Forests, and even neural networks — appearing in production systems at Google, Facebook, and virtually every ad-ranking platform.",
        },
        {
            year: "1998 – 2005",
            title: "Joachims & LIBSVM — Text Classification and the SVM Era",
            challenge:
                "With SMO making medium-scale SVM training practical, practitioners rushed to apply SVMs to real problems. Text classification was particularly attractive: documents could be represented as sparse bag-of-words vectors in high-dimensional space (vocabulary size 50,000+), where linear separability was often achievable without any kernel. But the theoretical question remained: did SVMs actually generalise better on text than competing methods like Naive Bayes and decision trees?",
            what:
                "Thorsten Joachims's SVMlight implementation (1998) demonstrated that linear SVMs with efficient solvers could train on millions of text documents. His systematic evaluation showed SVMs outperforming Naive Bayes on most text classification benchmarks — particularly on small training sets, where the margin principle provided better generalisation. Simultaneously, Jaakola, Diekhans, and Haussler (1999) introduced string kernels for biological sequence comparison, enabling SVMs to classify protein families and predict secondary structure by operating directly on amino acid sequences.",
            impact:
                "The SVM era (1998–2012) showed that a mathematically principled classical method with solid generalisation theory could outperform neural networks across nearly all benchmarks — given sufficient domain knowledge to engineer good features. Text classification used TF-IDF features; image classification used HOG and SIFT; genomics used k-mer frequency counts. The bottleneck was always human feature engineering — the skill that deep learning would eliminate in 2012 by learning features from raw data automatically.",
        },
        {
            year: "2003 – 2005",
            title: "Hsu, Chang & Lin — LIBSVM and the Practitioner Revolution",
            challenge:
                "Despite theoretical appeal, using SVMs required expertise in kernel selection, C tuning, and numerical optimisation. Most practitioners outside of academic ML found them inaccessible. The gap between SVM theory and practical deployment was wide enough that many domain scientists (biologists, chemists, engineers) reverted to simpler logistic regression or decision trees.",
            what:
                "Chih-Jen Lin's group at National Taiwan University released LIBSVM with extensive documentation, cross-validation utilities, automatic C and gamma selection via grid search, and multi-class extensions via one-vs-one classification. Their companion guide 'A Practical Guide to Support Vector Classification' (Hsu, Chang, Lin 2003) provided step-by-step tuning recipes for new users. LIBSVM's clean C library with Python, Java, and MATLAB bindings made SVM accessible to non-specialists.",
            impact:
                "LIBSVM was downloaded over 500,000 times and became the most cited SVM software in history. It standardised SVM practice across domains and collected the empirical evidence that C = 1 and gamma = 1/n_features is a reasonable starting point for RBF kernels. The software engineering lessons — clean APIs, robust defaults, comprehensive documentation — directly influenced how scikit-learn, PyTorch, and modern ML libraries are designed.",
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

// ── Kid Tab ──────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Finding the widest street between two neighbourhoods</h2>

            <p className="ch-story-intro">
                LeNet-5 (1998, Chapter 7) had shown that CNNs could read digits — but the data and computing power needed to scale them did not yet exist. While neural networks waited, a completely different approach reached its peak: one built not on biology but on geometry and mathematical optimisation theory. Vladimir Vapnik's Support Vector Machine became the dominant classification method from 1992 to 2012, winning benchmarks across text, biology, and vision.
            </p>

            <Analogy label="The problem — drawing the best line">
                Imagine two groups of points on a map: red dots on the east side, blue dots on the west. You want to draw a line separating them. Many lines would work — near the reds, near the blues, or right down the middle. Which is best?
                <br /><br />
                Vapnik's answer: the line with the most empty space on both sides — the <strong>maximum margin</strong>. A line crammed against one group will misclassify new points that arrive near it. A line with a wide buffer zone is more confident and more robust to noise and measurement errors.
            </Analogy>

            <Analogy label="Support vectors — the only points that matter">
                After you draw the best line, most training points could be moved without changing it. Only the points touching the edge of the empty buffer zone matter — the ones on the margin boundary. If you moved them, the line would shift. Vapnik called these the <strong>support vectors</strong>.
                <br /><br />
                This is why SVMs are robust and efficient: they ignore the "easy" points entirely and focus on the hardest cases — the ones right at the decision boundary. A trained SVM might have thousands of training examples but only 50 support vectors.
            </Analogy>

            <Analogy label="The kernel trick — seeing in more dimensions">
                Some problems cannot be separated by any straight line — like a ring of red points surrounding a cluster of blue points. You cannot draw a straight line between a ring and its interior.
                <br /><br />
                The kernel trick: add a new dimension (for example, distance from the centre). Now what was an inseparable ring on a flat surface becomes two separate groups in 3D space — and a flat plane can separate them perfectly. The clever part: the kernel function computes similarities between points in this higher-dimensional space without ever computing the coordinates explicitly. It is a mathematical shortcut that makes infinite-dimensional feature spaces computationally affordable.
            </Analogy>

            <Analogy label="Soft margin — handling real, messy data">
                The original SVM required perfectly separable data — impossible in practice. Cortes and Vapnik's 1995 refinement added a tolerance: allow some points to be on the wrong side, but penalise them. The hyperparameter C controls this tolerance. Large C: strict, narrow margin, few mistakes allowed. Small C: relaxed, wide margin, accepts more violations.
                <br /><br />
                This is the same bias-variance tradeoff that appears in every ML algorithm, just expressed through the geometry of margins and slack variables.
            </Analogy>

            <Analogy label="What SVMs could not do — and what comes next">
                SVMs were unbeatable on well-engineered features. The catch: you had to design those features yourself — convert pixels into colour histograms, convert text into word counts, convert proteins into amino acid patterns. Human feature engineering was both the source of SVMs' power and their fundamental bottleneck.
                <br /><br />
                That bottleneck — human feature engineering — is exactly what deep neural networks eliminated in 2012. They learned the features automatically from raw data. Chapter 9 tells the story of how that became possible, starting with Geoffrey Hinton's 2006 paper that restarted the deep learning clock.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Lagrangian Dual Formulation</h3>
            <p>
                The primal SVM is a constrained quadratic program. Introducing Lagrange multipliers alpha_i &gt;= 0 for each constraint y_i(w · x_i + b) &gt;= 1, the Lagrangian is:
            </p>
            <MathBlock tex="L(w, b, \alpha) = \frac{1}{2}\|w\|^2 - \sum_{i=1}^n \alpha_i \bigl[y_i(w \cdot x_i + b) - 1\bigr]" />
            <p>
                Setting dL/dw = 0 gives w = sum(alpha_i y_i x_i). Setting dL/db = 0 gives sum(alpha_i y_i) = 0. Substituting back gives the dual:
            </p>
            <MathBlock tex="\max_\alpha \sum_{i=1}^n \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j (x_i \cdot x_j) \quad \text{s.t.} \quad 0 \le \alpha_i \le C,\;\sum_i \alpha_i y_i = 0" />
            <p>
                The dual depends on data only through dot products x_i · x_j — so replacing with K(x_i, x_j) gives the kernel SVM without ever computing the feature map. KKT conditions: alpha_i = 0 for non-support-vectors, 0 &lt; alpha_i &lt; C for support vectors on the margin, alpha_i = C for margin violations.
            </p>

            <h3>VC Dimension Generalisation Bound</h3>
            <MathBlock tex="R(f) \le \hat{R}(f) + \sqrt{\frac{h\bigl(\ln(2n/h) + 1\bigr) - \ln(\delta/4)}{n}}" />
            <p>
                where R(f) is the true risk, hat-R(f) is the empirical training risk, h is the VC dimension, n is the number of training examples, and delta is the confidence level. For a maximum-margin classifier with margin rho, h is bounded by min(R^2/rho^2, d) + 1 — so large margin implies small h and tighter bounds.
            </p>

            <h3>Connection to Regularised Regression</h3>
            <p>
                The SVM primal is equivalent to minimising regularised hinge loss:
            </p>
            <MathBlock tex="\min_w \frac{\lambda}{2}\|w\|^2 + \frac{1}{n}\sum_{i=1}^n \max(0,\, 1 - y_i(w \cdot x_i + b))" />
            <p>
                where lambda = 1/(Cn). Ridge regression replaces hinge with squared loss and logistic regression replaces it with log loss — same L2 penalty, different loss function. This shows SVMs, ridge, and logistic regression are all instances of regularised ERM.
            </p>
        </>
    )
}

const PY_SVM = `import numpy as np

# ── Minimal SVM via SGD (Pegasos algorithm) ───────────────────────────────────
# Shalev-Shwartz et al. 2007: Pegasos = Primal Estimated sub-GrAdient SOlver

class LinearSVM:
    """
    Linear SVM trained via Pegasos SGD.
    Minimises: (lambda/2)||w||^2 + (1/n) * sum(hinge loss)
    """
    def __init__(self, C=1.0, n_iter=1000, lr=0.01):
        self.C = C          # regularisation (inverse of lambda)
        self.n_iter = n_iter
        self.lr = lr
        self.w = None
        self.b = 0.0

    def fit(self, X, y):
        n, d = X.shape
        self.w = np.zeros(d)
        lam = 1.0 / (self.C * n)

        for t in range(1, self.n_iter + 1):
            # Random sample
            i = np.random.randint(n)
            xi, yi = X[i], y[i]

            # Compute margin
            margin = yi * (self.w @ xi + self.b)

            # Pegasos update
            if margin < 1:
                self.w = (1 - self.lr * lam) * self.w + self.lr * yi * xi
                self.b += self.lr * yi
            else:
                self.w = (1 - self.lr * lam) * self.w

        return self

    def decision_function(self, X):
        return X @ self.w + self.b

    def predict(self, X):
        return np.sign(self.decision_function(X))


# ── Kernel SVM via dual (SMO-like, 2-variable updates) ───────────────────────
def rbf_kernel(X, Y, gamma=0.1):
    """K(x, z) = exp(-gamma * ||x - z||^2)"""
    # Pairwise squared distances
    sq_dists = (
        np.sum(X**2, axis=1, keepdims=True)
        - 2 * X @ Y.T
        + np.sum(Y**2, axis=1)
    )
    return np.exp(-gamma * sq_dists)


class KernelSVM:
    """Dual-form SVM with RBF kernel (simplified training via projected gradient)."""
    def __init__(self, C=1.0, gamma=0.1, n_iter=500):
        self.C = C
        self.gamma = gamma
        self.n_iter = n_iter

    def fit(self, X, y):
        n = len(y)
        K = rbf_kernel(X, X, self.gamma)   # (n, n) kernel matrix
        alpha = np.zeros(n)
        lr = 0.01

        # Projected gradient ascent on dual
        for _ in range(self.n_iter):
            # Gradient of dual objective
            grad = np.ones(n) - (K * (y[:, None] * y[None, :])) @ alpha
            alpha += lr * grad
            # Project onto feasible set: 0 <= alpha_i <= C, sum(alpha_i * y_i) = 0
            alpha = np.clip(alpha, 0, self.C)
            # Enforce equality constraint via simple correction
            alpha -= np.dot(alpha, y) / (np.dot(y, y) + 1e-9) * y

        # Support vectors: alpha > threshold
        sv_mask = alpha > 1e-4
        self.alpha_sv = alpha[sv_mask]
        self.X_sv = X[sv_mask]
        self.y_sv = y[sv_mask]

        # Compute bias from support vectors on the margin
        K_sv = rbf_kernel(X[sv_mask], self.X_sv, self.gamma)
        decision = K_sv @ (self.alpha_sv * self.y_sv)
        self.b = np.mean(self.y_sv - decision)

        print(f"Support vectors: {sv_mask.sum()} / {n}")

    def predict(self, X):
        K = rbf_kernel(X, self.X_sv, self.gamma)
        decision = K @ (self.alpha_sv * self.y_sv) + self.b
        return np.sign(decision)


# ── Demo: Linearly separable data ─────────────────────────────────────────────
np.random.seed(42)
X_pos = np.random.randn(50, 2) + np.array([1.5, 0])
X_neg = np.random.randn(50, 2) + np.array([-1.5, 0])
X = np.vstack([X_pos, X_neg])
y = np.array([1]*50 + [-1]*50)

svm = LinearSVM(C=1.0, n_iter=2000, lr=0.1)
svm.fit(X, y)
acc = (svm.predict(X) == y).mean()
print(f"Linear SVM accuracy: {acc*100:.1f}%")
print(f"Weight vector: {svm.w.round(3)}")

# ── Demo: Non-linear data (concentric circles) ────────────────────────────────
theta = np.linspace(0, 2*np.pi, 50)
X_inner = np.column_stack([0.5*np.cos(theta), 0.5*np.sin(theta)])
X_outer = np.column_stack([2.0*np.cos(theta), 2.0*np.sin(theta)])
X_nl = np.vstack([X_inner, X_outer])
y_nl = np.array([1]*50 + [-1]*50)

ksvm = KernelSVM(C=10.0, gamma=0.5, n_iter=1000)
ksvm.fit(X_nl, y_nl)
acc_nl = (ksvm.predict(X_nl) == y_nl).mean()
print(f"\nKernel SVM (RBF) accuracy on circles: {acc_nl*100:.1f}%")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of a linear SVM (Pegasos SGD) and a kernel SVM (dual projected gradient), demonstrating both the primal and dual formulations.
            </p>
            <CodeBlock code={PY_SVM} filename="svm_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> The kernel SVM uses the RBF kernel to separate concentric circles — data that is completely non-separable in the original 2D space but separable in the induced infinite-dimensional feature space.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Maximum-margin classification and the kernel trick</h2>

            <h3>Hard-Margin SVM — The Primal Problem</h3>
            <p>
                Find the separating hyperplane w · x + b = 0 that maximises the margin (distance between the two class boundaries). The margin equals 2 / ||w||. Equivalently, minimise ||w||^2 / 2 subject to all points being correctly classified at unit distance:
            </p>
            <MathBlock tex="\min_{w,b} \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 \;\; \forall i" />
            <p>
                This is a convex quadratic program with linear constraints — always has a unique global minimum. Only feasible when data is linearly separable.
            </p>

            <h3>Soft-Margin SVM — Handling Noise</h3>
            <MathBlock tex="\min_{w,b,\xi} \frac{1}{2}\|w\|^2 + C\sum_{i=1}^n \xi_i \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 - \xi_i,\;\; \xi_i \geq 0" />
            <p>
                Each slack variable xi_i = max(0, 1 − y_i(w · x_i + b)) is the hinge loss for point i. The full objective is (1/2)||w||^2 + C · sum(hinge losses): L2-regularised hinge loss, which is convex and solvable via quadratic programming. C = 1/lambda links to L2 regularisation strength.
            </p>

            <h3>Kernel Functions</h3>
            <p>
                Replace every dot product x_i · x_j in the dual with a kernel K(x_i, x_j). A kernel must be symmetric positive semi-definite (Mercer's condition). Common choices:
            </p>
            <MathBlock tex="K_{\text{RBF}}(x, z) = \exp\!\left(-\gamma\|x - z\|^2\right) \qquad \text{(universal approximator, infinite-dimensional)}" />
            <MathBlock tex="K_{\text{poly}}(x, z) = (x \cdot z + c)^d \qquad \text{(degree-}d\text{ interactions, finite-dimensional)}" />
            <p>
                Decision function: f(x) = sign(sum_i alpha_i y_i K(x_i, x) + b). The prediction depends only on kernel evaluations with support vectors (alpha_i &gt; 0).
            </p>

            <h3>SVM vs Logistic Regression — Loss Function Perspective</h3>
            <p>
                Both minimise regularised empirical risk. The difference is the loss function:
            </p>
            <MathBlock tex="\text{SVM: } \ell(y, f) = \max(0,\, 1 - yf) \qquad \text{Logistic: } \ell(y, f) = \log(1 + e^{-yf})" />
            <p>
                Hinge loss is zero for correctly classified points beyond the margin — making SVM sparse: only support vectors contribute to the solution. Logistic loss is non-zero everywhere — making logistic regression non-sparse but yielding calibrated probability outputs.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Bridge to Chapter 9:</strong> SVMs dominated classification from 1992–2012 because human-engineered features (HOG, SIFT, TF-IDF) gave the kernel a rich space to work in. AlexNet (2012) showed that features could be learned automatically from raw pixels — eliminating feature engineering and the main advantage SVMs held over neural networks on large-scale tasks.
            </div>

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

// ── Tab content map ─────────────────────────────────────────────────────────

export const SVM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
