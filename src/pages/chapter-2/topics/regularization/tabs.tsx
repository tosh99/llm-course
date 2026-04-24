import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { RidgeLassoDiagram, BiasVarianceDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1943",
            title: "Tikhonov Regularisation — The Mathematical Foundation",
            challenge: "Many linear systems are ill-posed: small changes in the data produce enormous changes in the solution. Geophysicists and mathematicians needed a way to stabilise the solution to inverse problems, where you infer a physical state (e.g., subsurface structure) from noisy observations.",
            what: "Andrey Tikhonov introduced what is now called L2 regularisation (or Tikhonov regularisation): add a penalty term λ‖w‖² to the objective. The closed-form solution to the regularised least squares problem is β = (XᵀX + λI)⁻¹Xᵀy — a small ridge added to XᵀX makes it invertible and shrinks the solution toward zero.",
            impact: "Tikhonov regularisation became the mathematical backbone of inverse problems across physics, geodesy, and signal processing. Ridge regression in statistics (Hoerl & Kennard, 1970) is the same idea applied to overfitting — one of the most fundamental tools in statistics.",
        },
        {
            year: "1970",
            title: "Ridge Regression — L2 Penalty in Statistics",
            challenge: "Ordinary least squares breaks down with multicollinear predictors: if two features are highly correlated, their coefficient estimates become huge and opposite in sign (variance explodes). Economic models often have many correlated predictors like income, education, and employment.",
            what: "Hoerl and Kennard introduced Ridge Regression: add λ‖β‖² to the OLS objective. The solution β_ridge = (XᵀX + λI)⁻¹Xᵀy uniformly shrinks all coefficients toward zero. A ridge trace (plotting coefficients vs λ) shows how the estimates stabilise as λ increases.",
            impact: "Ridge regression gave statisticians a principled way to handle multicollinearity and reduce prediction error, at the cost of introducing a small, controlled bias. This bias-variance trade-off framework became central to modern statistical learning theory.",
        },
        {
            year: "1996",
            title: "Lasso — L1 Penalty and Sparse Solutions",
            challenge: "Ridge regression shrinks all coefficients but never sets any to exactly zero. In genomics, text classification, and econometrics, practitioners often needed sparse models: most predictors are irrelevant, and identifying the small subset of important ones is as important as predicting accurately.",
            what: "Robert Tibshirani introduced the Lasso (Least Absolute Shrinkage and Selection Operator): replace the L2 penalty with an L1 penalty λ‖β‖₁ = λΣ|βⱼ|. The L1 constraint region is a diamond — its corners lie on the axes — so when the loss function's contours first touch the constraint, they almost always hit a corner, setting some βⱼ exactly to zero.",
            impact: "The Lasso unified variable selection and estimation into a single convex optimisation problem. It revolutionised high-dimensional statistics and is the standard tool in genomics (identifying genes among 20,000+ predictors) and any domain where interpretable sparse solutions matter.",
        },
        {
            year: "2005",
            title: "Elastic Net — L1 + L2 Combined",
            challenge: "The Lasso has a weakness with grouped features: if two features are highly correlated (like copies of a gene), Lasso arbitrarily picks one and drops the other. This instability is undesirable when correlated features each carry signal.",
            what: "Hui Zou and Trevor Hastie proposed the Elastic Net: combine L1 and L2 penalties, α‖β‖₁ + (1−α)‖β‖². The L2 component stabilises the solution among correlated predictors (selecting them as a group), while the L1 component still drives sparsity. The ratio α controls the balance.",
            impact: "The Elastic Net became the standard regularisation choice in practice: it inherits Lasso's sparsity and Ridge's grouping effect. Most modern regularisation implementations (scikit-learn's ElasticNetCV) expose α and λ as tunable hyperparameters selected by cross-validation.",
        },
        {
            year: "2014",
            title: "Dropout — Regularisation for Neural Networks",
            challenge: "Deep neural networks with millions of parameters overfit aggressively. Standard L1/L2 penalties applied to neural network weights were hard to tune and added training complexity. A more effective and scalable regularisation scheme was needed.",
            what: "Srivastava, Hinton, Krizhevsky, Sutskever, and Salakhutdinov introduced Dropout: randomly zero out each neuron's output with probability p (typically 0.5) during each training step. At test time, use all neurons but scale their outputs by (1−p). This forces the network to learn redundant representations and prevents co-adaptation of neurons.",
            impact: "Dropout became the default regularisation technique for deep learning, enabling the training of very large networks. It was instrumental in the deep learning revolution — every major network from AlexNet onward uses dropout. It's interpreted as approximately averaging over an exponential number of different thinned networks.",
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
            <h2>Stopping the model from memorising instead of learning</h2>

            <Analogy label="The problem — memorisation">
                Imagine a student who memorises every answer in the textbook word for word. When the exam uses the exact same questions, they get 100%. But if the exam changes even one word, they're lost. This is <strong>overfitting</strong> — the model memorised the training data instead of learning the underlying pattern.
            </Analogy>

            <Analogy label="The fix — regularisation">
                Regularisation is like a rule that says: "You can learn the answers, but your answers must stay simple." We add a penalty that punishes the model for having very large or complicated rules. The model has to find a balance — it must explain the data, but not by using wildly complicated rules.
            </Analogy>

            <Analogy label="Ridge — penalise big weights">
                <strong>Ridge (L2) regularisation</strong> says: every weight in your model must stay small. If you want a weight to be large, you'll be penalised. This spreads the blame around — all predictors shrink toward zero a little, but none is completely removed.
            </Analogy>

            <DiagramBlock title="L1 vs L2 penalty regions — why L1 creates sparsity">
                <RidgeLassoDiagram />
            </DiagramBlock>

            <Analogy label="Lasso — set useless weights to exactly zero">
                <strong>Lasso (L1) regularisation</strong> uses a different penalty — it's like a budget. If a weight isn't earning its keep, it gets cut to zero entirely. Lasso is a feature selector: it identifies which predictors matter and which don't.
            </Analogy>

            <DiagramBlock title="Bias-variance tradeoff — regularisation controls where you sit on this curve">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <Analogy label="Cross-validation — choosing how much to regularise">
                How much to regularise is controlled by a number λ. Too small: still overfitting. Too large: the model is too simple and misses real patterns. <strong>Cross-validation</strong> tries many values of λ and picks the one that performs best on held-out data.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Penalising model complexity to improve generalisation</h2>

            <h3>The Bias-Variance Trade-off</h3>
            <p>
                For any prediction model, the expected test error decomposes as:
            </p>
            <MathBlock tex="\text{MSE}(x) = \text{Bias}^2[\hat{f}(x)] + \text{Var}[\hat{f}(x)] + \sigma^2" />
            <p>
                Regularisation increases bias slightly but substantially reduces variance — moving the model away from the memorisation end toward genuine generalisation. The irreducible noise σ² is a floor no model can beat.
            </p>

            <h3>Ridge Regression (L2)</h3>
            <p>
                Minimise the penalised objective:
            </p>
            <MathBlock tex="\min_\beta \|y - X\beta\|^2 + \lambda \|\beta\|^2" />
            <p>
                Closed-form solution: β̂_ridge = (XᵀX + λI)⁻¹Xᵀy. All coefficients shrink toward zero by factor 1/(1 + λ/eigenvalue). No coefficient reaches exactly zero. Useful when all predictors carry some signal.
            </p>

            <h3>Lasso Regression (L1)</h3>
            <p>
                Minimise:
            </p>
            <MathBlock tex="\min_\beta \|y - X\beta\|^2 + \lambda \|\beta\|_1" />
            <p>
                No closed form — requires convex optimisation (coordinate descent). The L1 ball (diamond shape in 2D) has corners at the axes. Loss function contours tend to first touch the constraint at a corner → sparse solutions with βⱼ = 0 exactly.
            </p>

            <h3>Elastic Net</h3>
            <MathBlock tex="\min_\beta \|y - X\beta\|^2 + \lambda_1\|\beta\|_1 + \lambda_2\|\beta\|^2" />
            <p>
                Combines both penalties. The L2 term handles correlated features (groups them), the L1 term enforces sparsity. The mixing parameter α = λ₁/(λ₁ + λ₂) ∈ [0,1] interpolates between pure Ridge (α=0) and pure Lasso (α=1).
            </p>

            <h3>Choosing λ — Cross-Validation</h3>
            <p>
                Split training data into K folds. For each candidate λ, train on K−1 folds and evaluate on the held-out fold. Average across K folds. Pick λ with lowest validation error (often "λ_1se" — the largest λ within 1 standard error of the minimum, for more regularisation/sparsity).
            </p>

            <h3>Dropout (Neural Networks)</h3>
            <p>
                During training, zero each activation with probability p (independently per unit, per batch). This prevents co-adaptation — no single unit can rely on other specific units always being present. At test time, multiply weights by (1−p) to maintain expected activation magnitude.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Analysis of Regularised Estimators</h2>

            <DefBlock label="Ridge as Constrained Optimisation">
                Ridge regression solves the constrained problem: min_β ‖y − Xβ‖² subject to ‖β‖² ≤ t. Via Lagrangian duality, every value of t corresponds to a Lagrange multiplier λ — giving the unconstrained penalised form. The constraint ball is a sphere: no preferred directions, so all coefficients shrink uniformly.
            </DefBlock>

            <h3>SVD Analysis of Ridge</h3>
            <p>
                Let X = UDVᵀ be the SVD with singular values d₁ ≥ … ≥ d_p. Then:
            </p>
            <MathBlock tex="\hat{\beta}_{\text{ridge}} = \sum_{j=1}^p \frac{d_j^2}{d_j^2 + \lambda} \frac{u_j^T y}{d_j} v_j" />
            <p>
                Compare to OLS which uses factor 1. Ridge shrinks components with small singular values (near-collinear directions) toward zero — this is why it solves multicollinearity.
            </p>

            <h3>Lasso — Subdifferential and KKT Conditions</h3>
            <p>
                The Lasso objective is convex but non-differentiable at βⱼ = 0. The subdifferential of |βⱼ| is ∂|βⱼ| = sign(βⱼ) if βⱼ ≠ 0, and [−1,1] if βⱼ = 0.
                KKT conditions for the Lasso:
            </p>
            <MathBlock tex="-X_j^T(y - X\hat\beta) + \lambda\, \partial|\hat\beta_j| = 0" />
            <p>
                This gives the soft-thresholding operator: β̂ⱼ = sign(z_j)(|z_j| − λ)₊ where z_j = X_jᵀ(y − X_&#123;-j&#125;β̂_&#123;-j&#125;) is the partial residual. Feature j is exactly zero when |z_j| ≤ λ.
            </p>

            <h3>Effective Degrees of Freedom</h3>
            <p>
                For ridge regression with regularisation λ, the effective degrees of freedom are:
            </p>
            <MathBlock tex="\text{df}(\lambda) = \text{tr}\left(X(X^TX + \lambda I)^{-1}X^T\right) = \sum_{j=1}^p \frac{d_j^2}{d_j^2 + \lambda}" />
            <p>
                At λ=0, df = p (full model). As λ→∞, df→0 (intercept only). This is used in information criteria (AIC, BIC, GCV) to select λ without cross-validation.
            </p>

            <DefBlock label="Bayesian Interpretation">
                Ridge regression = MAP estimate under a Gaussian prior on β: β ~ N(0, σ²/λ · I). Lasso = MAP estimate under a Laplace prior: p(βⱼ) ∝ e^&#123;-λ|βⱼ|&#125;. The Laplace prior has heavier tails near zero → induces sparsity. Elastic Net corresponds to a prior that is a convex combination of Gaussian and Laplace.
            </DefBlock>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.linear_model import (
    Ridge, RidgeCV, Lasso, LassoCV, ElasticNet, ElasticNetCV
)
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_regression
from sklearn.model_selection import cross_val_score
import warnings; warnings.filterwarnings("ignore")

# ── Dataset: 100 features, 10 truly informative ─────────────────
X, y, true_coef = make_regression(
    n_samples=500, n_features=100, n_informative=10,
    noise=20.0, coef=True, random_state=42
)

# Always scale features before L1/L2 regularisation
scaler = StandardScaler()
X_sc = scaler.fit_transform(X)

# ── Ridge — L2 penalty ──────────────────────────────────────────
ridge_cv = RidgeCV(alphas=np.logspace(-3, 4, 50), cv=5)
ridge_cv.fit(X_sc, y)
print(f"Ridge best alpha:  {ridge_cv.alpha_:.3f}")
print(f"Ridge non-zero coefs: {np.sum(np.abs(ridge_cv.coef_) > 0.01)}")

# ── Lasso — L1 penalty + feature selection ─────────────────────
lasso_cv = LassoCV(cv=5, max_iter=10_000, random_state=42)
lasso_cv.fit(X_sc, y)
n_nonzero = np.sum(lasso_cv.coef_ != 0)
print(f"Lasso best alpha:  {lasso_cv.alpha_:.3f}")
print(f"Lasso non-zero coefs: {n_nonzero} / 100")

# Check if Lasso recovered the informative features
true_nonzero = np.where(true_coef != 0)[0]
lasso_nonzero = np.where(lasso_cv.coef_ != 0)[0]
overlap = np.intersect1d(true_nonzero, lasso_nonzero)
print(f"Lasso recovered {len(overlap)}/{len(true_nonzero)} true features")

# ── Elastic Net ─────────────────────────────────────────────────
enet_cv = ElasticNetCV(
    l1_ratio=[0.1, 0.5, 0.7, 0.9, 0.95, 1.0],
    cv=5, max_iter=10_000, random_state=42
)
enet_cv.fit(X_sc, y)
print(f"Elastic Net best l1_ratio: {enet_cv.l1_ratio_:.2f}")
print(f"Elastic Net best alpha:    {enet_cv.alpha_:.3f}")
print(f"Elastic Net non-zero coefs: {np.sum(enet_cv.coef_ != 0)}")

# ── Ridge trace (stability analysis) ───────────────────────────
alphas = np.logspace(-3, 4, 100)
coef_paths = []
for a in alphas:
    r = Ridge(alpha=a).fit(X_sc[:, :5], y)  # first 5 features only
    coef_paths.append(r.coef_)

print("\\nRidge trace (alpha vs max |coef|):")
for i, a in enumerate(alphas[::20]):
    max_c = max(abs(c) for c in coef_paths[i])
    print(f"  alpha={a:8.2f}  max|coef|={max_c:.3f}")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="regularization.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Practical rule:</strong> Always <code>StandardScaler</code> features before Lasso/Ridge — the penalty is applied to the raw coefficient values, so features with larger numeric scales get unfairly penalised. After scaling, the penalty is applied equally and the resulting λ is interpretable.
            </div>
        </>
    )
}

const TS_CODE = `// ── Ridge and Lasso Regression in TypeScript ─────────────────

type Vec = number[]
type Mat = number[][]

const dot  = (a: Vec, b: Vec): number => a.reduce((s, v, i) => s + v * b[i], 0)
const matT = (A: Mat): Mat => A[0].map((_, j) => A.map(r => r[j]))
const matMul = (A: Mat, B: Mat): Mat =>
  A.map(row => B[0].map((_, j) => dot(row, B.map(r => r[j]))))

/** Scalar * matrix */
const matScale = (A: Mat, s: number): Mat => A.map(r => r.map(v => v * s))

/** Add λI to matrix */
const addRidge = (A: Mat, lam: number): Mat =>
  A.map((row, i) => row.map((v, j) => v + (i === j ? lam : 0)))

/** Naive matrix inverse (2×2 only, for demo) */
function inv2(A: Mat): Mat {
  const det = A[0][0]*A[1][1] - A[0][1]*A[1][0]
  return matScale([[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]], 1/det)
}

/** Ridge regression: β = (XᵀX + λI)⁻¹ Xᵀy  (2-feature demo) */
function ridgeRegression(X: Mat, y: Vec, lambda: number): Vec {
  const Xt   = matT(X)
  const XtX  = matMul(Xt, X)
  const XtXr = addRidge(XtX, lambda)
  const XtXr_inv = inv2(XtXr)           // works for 2×2 only
  const Xty  = Xt.map(row => dot(row, y))
  return XtXr_inv.map(row => dot(row, Xty))
}

/** Soft-thresholding (Lasso update for one coordinate) */
const softThreshold = (z: number, lam: number): number =>
  Math.sign(z) * Math.max(0, Math.abs(z) - lam)

/** Lasso via coordinate descent */
function lassoCD(
  X: Mat, y: Vec, lambda: number, maxIter = 1000, tol = 1e-6
): Vec {
  const n = X.length, p = X[0].length
  let beta: Vec = Array(p).fill(0)

  for (let iter = 0; iter < maxIter; iter++) {
    const betaOld = [...beta]

    for (let j = 0; j < p; j++) {
      // Partial residual
      const r = y.map((yi, i) =>
        yi - X[i].reduce((s, xij, k) => s + (k !== j ? xij * beta[k] : 0), 0)
      )
      // Ordinary LS for this coordinate
      const Xj = X.map(row => row[j])
      const XjX = dot(Xj, Xj)
      const z = dot(Xj, r) / XjX
      beta[j] = softThreshold(z, lambda / XjX)
    }

    // Check convergence
    const delta = beta.reduce((s, b, i) => s + (b - betaOld[i])**2, 0)
    if (Math.sqrt(delta) < tol) break
  }
  return beta
}

// ── Demo ──────────────────────────────────────────────────────
const X: Mat = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]
const y: Vec = [1.5, 3.2, 4.8, 6.1, 8.2, 9.5]

for (const lam of [0, 0.5, 2.0, 10.0]) {
  const b = ridgeRegression(X, y, lam)
  console.log(\`Ridge λ=\${lam.toFixed(1)}: β = [\${b.map(v=>v.toFixed(3)).join(", ")}]\`)
}

for (const lam of [0, 0.3, 1.0, 3.0]) {
  const b = lassoCD(X, y, lam)
  console.log(\`Lasso λ=\${lam.toFixed(1)}: β = [\${b.map(v=>v.toFixed(3)).join(", ")}]\`)
}`

function CodeTab() {
    return (
        <>
            <p>
                Ridge regression has a closed-form solution via the normal equations. Lasso requires iterative coordinate descent — the soft-thresholding operator is the key step that sets small coefficients to exactly zero.
            </p>
            <CodeBlock code={TS_CODE} filename="regularization.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Why coordinate descent for Lasso?</strong> The L1 penalty makes the objective non-differentiable at zero, so gradient descent doesn't work directly. Coordinate descent cycles through each feature, optimising one coefficient at a time (holding others fixed) — and the single-coordinate update has a closed-form soft-threshold solution.
            </div>
        </>
    )
}

export const REGULARIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
