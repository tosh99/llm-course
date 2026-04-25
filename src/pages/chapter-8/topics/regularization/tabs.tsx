import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
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
            year: "1943",
            title: "Tikhonov — Regularisation as a Mathematical Principle",
            challenge:
                "Geophysicists and signal engineers were solving inverse problems: given noisy measurements at the surface, infer the underlying subsurface structure. These problems were ill-posed in Hadamard's sense: the solution was not unique, it did not depend continuously on the data, and small measurement perturbations could cause enormous changes in the inferred answer. Standard least squares amplified noise catastrophically when the measurement matrix was nearly singular — which it almost always was in real applications. The mathematical framework to make ill-posed problems well-posed did not yet exist.",
            what:
                "Andrey Nikolayevich Tikhonov, working at Moscow State University, introduced what is now called L2 regularisation or Tikhonov regularisation: add a penalty term lambda * ||x||^2 to the objective, where x is the unknown to be recovered. The regularised solution x* = (A^T A + lambda I)^{-1} A^T b is always unique (the lambda * I term makes the matrix invertible even when A^T A is singular), depends continuously on the data (stability), and shrinks toward zero as lambda increases. Tikhonov interpreted lambda as a trade-off parameter encoding the prior expectation that solutions with smaller norm are more plausible.",
            impact:
                "Tikhonov regularisation became the most widely deployed mathematical principle in applied science. Every ill-posed linear system in medical imaging (CT reconstruction), seismic inversion, MRI, GPS signal processing, and computational finance uses it. Ridge regression in statistics (Hoerl & Kennard, 1970) is the same idea applied to statistical overfitting. L2 weight decay in neural networks is the same idea applied to preventing large weights. The principle — add a penalty that encodes what you know about valid solutions being smooth or small — is universal and appears in every chapter of this curriculum.",
        },
        {
            year: "1970",
            title: "Hoerl & Kennard — Ridge Regression",
            challenge:
                "Ordinary least squares (OLS) for regression breaks down when predictors are correlated (multicollinearity). In economics, ecology, social science, and medical studies, predictors like income, education, and employment are always correlated. The OLS estimator beta_OLS = (X^T X)^{-1} X^T y requires inverting X^T X, which is nearly singular when predictors are correlated — producing coefficient estimates with enormous variances that change wildly across different samples of data from the same population.",
            what:
                "Arthur Hoerl and Robert Kennard at DuPont applied Tikhonov's idea to regression: add lambda * ||beta||^2 to the OLS objective. The ridge estimate beta_ridge = (X^T X + lambda I)^{-1} X^T y uniformly shrinks all coefficients toward zero. They introduced the 'ridge trace': plot each coefficient as a function of lambda from 0 to infinity. As lambda increases, the estimates stabilise, revealing which coefficients are genuinely informative and which are amplified by collinearity. Lambda is selected via cross-validation or the generalised cross-validation (GCV) criterion.",
            impact:
                "Ridge regression demonstrated that accepting a small controlled bias (shrinkage toward zero) dramatically reduces variance and reduces overall prediction error. This bias-variance tradeoff — the fundamental theorem of statistical prediction — was made concrete and computable. Ridge regression is the MAP estimator under a Gaussian prior on beta, showing that Bayesian regularisation (Chapter 1, Laplace and Bayes) and frequentist penalisation are the same operation viewed differently. Ridge is identical to L2 weight decay in SVMs (C = 1/(2*n*lambda)) and in neural networks.",
        },
        {
            year: "1996",
            title: "Tibshirani — The Lasso and Sparse Solutions",
            challenge:
                "Ridge regression shrinks all coefficients but never sets any exactly to zero. In genomics, text classification, and econometrics with thousands of predictors and hundreds of observations (p >> n), most features are irrelevant. Practitioners wanted a method that simultaneously predicted well AND identified which variables actually mattered — variable selection as automatic as the prediction itself. Ridge gave no help; it kept all variables at small non-zero values, providing no interpretability.",
            what:
                "Robert Tibshirani replaced the L2 penalty with L1: Lasso = argmin ||y − X beta||^2 + lambda * ||beta||_1. The L1 ball in p dimensions is a cross-polytope (a diamond in 2D, an octahedron in 3D) — its corners lie on the coordinate axes. When the loss function's elliptical contours expand outward from the unconstrained optimum and first touch the L1 ball, they almost always hit a corner where some coordinates are exactly zero. This produces sparse solutions: most coefficients are exactly zero, a small subset are non-zero, corresponding precisely to the selected features. The optimisation is convex but non-differentiable at zero — solved by coordinate descent using the soft-thresholding operator.",
            impact:
                "The Lasso unified variable selection and estimation into a single convex optimisation problem — principled, scalable, and interpretable. It revolutionised high-dimensional statistics and became standard in genomics (gene expression analysis), neuroimaging (voxel selection), NLP (sparse text features), and any domain where understanding which inputs matter is as important as the prediction itself. The geometric insight — L1 corners vs L2 sphere — later influenced attention sparsity and the lottery ticket hypothesis in neural networks.",
        },
        {
            year: "2005",
            title: "Zou & Hastie — Elastic Net, Unifying L1 and L2",
            challenge:
                "The Lasso had two weaknesses. First, when two features were highly correlated (like copies of the same gene, or two co-expressed proteins), it arbitrarily selected one and zeroed the other — even though both carry signal. Second, in p >> n settings (more features than examples), Lasso could select at most n features, leaving the rest zeroed regardless of their true relevance. Group selection and grouping effects were impossible with pure L1.",
            what:
                "Hui Zou and Trevor Hastie at Stanford proposed the Elastic Net: combine L1 and L2 penalties — alpha * ||beta||_1 + (1 − alpha) * ||beta||_2^2 / 2. The L2 term stabilises groups of correlated features (selecting them together rather than arbitrarily choosing one), while the L1 term drives overall sparsity. The mixing parameter alpha in [0, 1] interpolates between pure Lasso (alpha = 1) and pure Ridge (alpha = 0). The optimisation remains convex and is solved by coordinate descent with the update: beta_j &lt;— sign(r_j) * max(0, |r_j| − lambda_1/2) / (1 + lambda_2).",
            impact:
                "The Elastic Net became the standard regularisation choice when there are groups of correlated predictors. More broadly, it demonstrated that L1 and L2 are not competing methods but complementary penalties that can be mixed. This mixing principle directly influenced neural network regularisation: modern networks often use dropout (L1-like sparsity on activations) combined with L2 weight decay, the KL-divergence penalty in RLHF blends L1 and L2 concepts, and LoRA's rank constraint can be interpreted as an elastic net on the update matrix.",
        },
        {
            year: "2001 – present",
            title: "Cross-Validation for Lambda Selection",
            challenge:
                "Regularisation without a principled way to choose lambda is incomplete. Too small: overfitting returns. Too large: underfitting. The optimal lambda depends on the dataset, the true signal strength, the noise level, and the number of predictors — all unknown in practice. Bayesian approaches (empirical Bayes, marginal likelihood maximisation) offered one path; cross-validation offered a non-parametric alternative.",
            what:
                "K-fold cross-validation for lambda selection: split the data into K folds; for each candidate lambda, train on K − 1 folds and evaluate on the held-out fold; choose the lambda that minimises average validation loss. The 'one standard error rule' (Hastie, Tibshirani, Friedman): choose the largest lambda whose validation error is within one standard error of the minimum — selecting the simplest model that is statistically indistinguishable from the best. Coordinate descent path algorithms (LARS for Lasso) trace the full regularisation path from lambda = 0 to lambda = infinity in one efficient computation.",
            impact:
                "The cross-validation framework for regularisation selection became the standard model selection procedure for all ML algorithms — not just ridge and lasso. It applies to any hyperparameter: C in SVMs, depth in decision trees, number of trees in Random Forests, learning rate in gradient boosting. Every modern ML framework (scikit-learn's GridSearchCV, PyTorch's learning rate schedulers, Keras's callbacks) implements this principle. The one-standard-error rule embodies Occam's Razor as a statistical decision procedure.",
        },
        {
            year: "2012 – present",
            title: "Regularisation in Deep Learning — It Never Ends",
            challenge:
                "With the deep learning revolution (Chapter 9), the models grew from hundreds of parameters (ridge, lasso) to millions (AlexNet) to trillions (GPT-4). Standard L1 and L2 penalties remained relevant but were insufficient alone. Deep networks needed regularisation techniques that operated at the level of neurons, layers, and training dynamics, not just individual weights.",
            what:
                "Dropout (Srivastava et al. 2014, Chapter 9): randomly zero neurons during training — equivalent to adding multiplicative noise to activations, implicitly penalising large weights that dominate over many neurons. Batch normalisation (Ioffe & Szegedy 2015): normalise activations per mini-batch, acting as an adaptive regulariser. L2 weight decay remained standard throughout. Data augmentation (random crops, flips, colour jitter) extended the training distribution, reducing effective overfitting. DropConnect (Wan et al. 2013) dropped weights rather than neurons. The KL-divergence penalty in RLHF prevents a fine-tuned model from drifting far from its pre-trained prior. LoRA's rank constraint forces parameter updates into a low-dimensional subspace.",
            impact:
                "Regularisation in deep learning is not a solved problem — it is an active frontier. Every major architectural innovation from AlexNet to Transformers to diffusion models involves a new regularisation insight. The overarching principle — that every component of training either explicitly or implicitly constrains the model's complexity — is the thread connecting Tikhonov's 1943 inverse problem work to the alignment techniques used in GPT-4 training in 2023. Regularisation is not a technique; it is the fundamental mechanism by which learning systems generalise.",
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
            <h2>Teaching a model to be simple — the war against memorisation</h2>

            <p className="ch-story-intro">
                SVMs found the widest margin. Random Forests averaged out errors. Both were fighting the same enemy: overfitting — a model that memorises the training data instead of learning the underlying pattern. Regularisation is the third weapon in this fight, and it applies to every ML algorithm ever invented — from Gauss's linear regression (Chapter 1) to GPT-4 (Chapter 22). Understanding regularisation is understanding why any model generalises at all.
            </p>

            <Analogy label="The problem — a student who memorises instead of learns">
                A student who reads the same textbook ten times and memorises every sentence scores 100% on test questions that use the exact same wording. But if a question is paraphrased — or asks something the textbook did not cover — the student fails. They memorised, but did not learn.
                <br /><br />
                A model with too many parameters and too little data does the same. It memorises the training examples, including their noise and quirks. On new data from the same distribution, it fails. This is overfitting.
            </Analogy>

            <Analogy label="Ridge — penalise big weights">
                Tikhonov (1943) and Hoerl &amp; Kennard (1970) had the same idea: add a rule that says "your parameters must stay small." Add the penalty lambda * ||beta||^2 to the loss. The model now has two competing goals: explain the data well AND keep its parameters small. Bigger lambda means smaller parameters, a simpler model, and more regularisation.
                <br /><br />
                The mathematical beauty: ridge regression has a closed-form solution beta_ridge = (X^T X + lambda I)^{-1} X^T y. The lambda I term "adds a ridge" to the matrix, making it always invertible — even when the data has perfectly correlated features that would otherwise make the problem unsolvable.
            </Analogy>

            <Analogy label="Lasso — automatic feature selection via a diamond">
                Tibshirani (1996) swapped the penalty from ||beta||^2 (sum of squares) to ||beta||_1 (sum of absolute values). The mathematical consequence is striking: the optimal solution forces some parameters to exactly zero — complete elimination of the corresponding features.
                <br /><br />
                Imagine you have 1,000 genes but only 10 actually matter for predicting cancer risk. Ridge would keep all 1,000 with small non-zero values. Lasso would set 990 to exactly zero and give you a model with only the 10 relevant genes — performing feature selection automatically.
            </Analogy>

            <Analogy label="Why the geometry works — spheres vs diamonds">
                Ridge uses a sphere as its constraint region (||beta||^2 &lt;= t). Spheres are smooth with no corners. When the loss function's contours expand from the unconstrained minimum and first touch the sphere, they hit a generic point where no coordinate is zero.
                <br /><br />
                Lasso uses a diamond as its constraint region (||beta||_1 &lt;= t). Diamonds have corners on the coordinate axes. The expanding loss contours almost always first touch a corner, where some coordinates are exactly zero. That is the geometry behind sparse solutions — it is the shape of the constraint, not the data, that produces sparsity.
            </Analogy>

            <Analogy label="Regularisation in deep learning — it never ends">
                The same principle appears throughout the rest of this curriculum. L2 weight decay in neural networks (Chapter 5) prevents weights from growing large. Dropout (Chapter 9) randomly zeros neurons — equivalent to adding noise to effective weights. The KL-divergence penalty in RLHF (Chapter 25) prevents a fine-tuned language model from drifting too far from its pre-trained starting point. LoRA's rank constraint (Chapter 23) forces parameter updates into a small subspace. Regularisation is not a technique — it is the fundamental mechanism by which learning systems generalise from finite data to infinite possible inputs.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Ridge Regression — Eigenvalue Shrinkage</h3>
            <p>
                Let X = U D V^T be the SVD of the design matrix, where D has singular values d_1 &gt;= d_2 &gt;= ... &gt;= d_p. The OLS estimate in the rotated basis is V^T beta_OLS = D^{-1} U^T y. The ridge estimate:
            </p>
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = V \,\text{diag}\!\left(\frac{d_j^2}{d_j^2 + \lambda}\right) V^\top \hat{\beta}^{\text{OLS}}" />
            <p>
                Each coefficient along eigenvector j is shrunk by factor d_j^2 / (d_j^2 + lambda). Directions with small singular values (near-collinear, unstable) are shrunk most. Directions with large singular values (strongly supported by data) are shrunk least. Ridge is a form of diagonal shrinkage in PCA space.
            </p>

            <h3>Lasso — Soft Thresholding and Subdifferential Calculus</h3>
            <p>
                The coordinate descent update for Lasso (one variable at a time, cycling through all) solves the 1D sub-problem in closed form via the soft-thresholding operator:
            </p>
            <MathBlock tex="\hat{\beta}_j \leftarrow \text{sign}(r_j) \cdot \max(0,\, |r_j| - \lambda/2)" />
            <p>
                where r_j = (X^T (y - X_&#123;-j&#125; beta_&#123;-j&#125;))_j is the partial residual for variable j. The function max(0, |z| - lambda/2) produces exactly zero when |r_j| &lt;= lambda/2 — the variable is excluded. Above the threshold, it shrinks but does not zero. This is why L1 produces exact zeros: the subdifferential of |beta_j| at zero is the interval [-1, 1], which contains the required gradient value when |r_j| is small.
            </p>

            <h3>Bayesian Interpretation</h3>
            <MathBlock tex="\text{Ridge} \leftrightarrow \beta_j \sim \mathcal{N}(0,\, 1/\lambda) \qquad \text{MAP estimator under Gaussian prior}" />
            <MathBlock tex="\text{Lasso} \leftrightarrow \beta_j \sim \text{Laplace}(0,\, 1/\lambda) \qquad \text{MAP estimator under Laplace prior}" />
            <p>
                The Laplace prior has a spike at zero (exponential tails, high density near zero) — this prior encodes the belief that most coefficients are near zero, with a few that are large. The Gaussian prior is smooth at zero — it encodes the belief that all coefficients are small but non-zero. The prior choice determines whether the MAP solution is sparse or dense.
            </p>
        </>
    )
}

const PY_REG = `import numpy as np

# ── Ridge Regression — closed form ───────────────────────────────────────────
def ridge(X, y, lam):
    """
    Ridge: min ||y - X beta||^2 + lambda ||beta||^2
    Closed form: beta = (X'X + lambda I)^{-1} X'y
    """
    n, p = X.shape
    return np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)


# ── Soft-thresholding operator ────────────────────────────────────────────────
def soft_threshold(z, threshold):
    return np.sign(z) * np.maximum(np.abs(z) - threshold, 0)


# ── Lasso via coordinate descent ─────────────────────────────────────────────
def lasso_coordinate_descent(X, y, lam, n_iter=1000, tol=1e-6):
    """
    Tibshirani (1996) Lasso via coordinate descent.
    Solves: min ||y - X beta||^2 + lambda ||beta||_1
    """
    n, p = X.shape
    # Normalise columns for stability
    col_norms = np.sqrt((X**2).sum(axis=0))
    col_norms[col_norms == 0] = 1
    X_norm = X / col_norms

    beta = np.zeros(p)
    r = y.copy()   # Residuals

    for iteration in range(n_iter):
        beta_old = beta.copy()
        for j in range(p):
            # Add back column j contribution
            r_j = r + X_norm[:, j] * beta[j]
            # Partial correlation
            rho_j = X_norm[:, j] @ r_j
            # Soft threshold
            beta[j] = soft_threshold(rho_j, lam / 2) / (X_norm[:, j] @ X_norm[:, j])
            # Update residuals
            r = r_j - X_norm[:, j] * beta[j]

        if np.max(np.abs(beta - beta_old)) < tol:
            print(f"Converged at iteration {iteration}")
            break

    # Undo normalisation
    return beta / col_norms


# ── Elastic Net via coordinate descent ────────────────────────────────────────
def elastic_net(X, y, lam1, lam2, n_iter=1000, tol=1e-6):
    """
    Zou & Hastie (2005) Elastic Net.
    Penalty: lambda1 * ||beta||_1 + lambda2 * ||beta||_2^2
    Coordinate update: beta_j <- soft_threshold(r_j, lambda1/2) / (norm_j + lambda2)
    """
    n, p = X.shape
    col_norms_sq = (X**2).sum(axis=0)
    beta = np.zeros(p)
    r = y.copy()

    for iteration in range(n_iter):
        beta_old = beta.copy()
        for j in range(p):
            r_j = r + X[:, j] * beta[j]
            rho_j = X[:, j] @ r_j
            beta[j] = soft_threshold(rho_j, lam1 / 2) / (col_norms_sq[j] + lam2)
            r = r_j - X[:, j] * beta[j]

        if np.max(np.abs(beta - beta_old)) < tol:
            break

    return beta


# ── Demonstration on sparse data ──────────────────────────────────────────────
np.random.seed(42)
n, p = 100, 50
# True sparse signal: only 5 of 50 features are relevant
true_beta = np.zeros(p)
true_beta[[0, 5, 10, 20, 35]] = [3, -2, 1.5, -1, 2]

X = np.random.randn(n, p)
y = X @ true_beta + 0.5 * np.random.randn(n)

print("True non-zero features:", np.where(true_beta != 0)[0])
print(f"True beta values: {true_beta[true_beta != 0]}")

# Ridge — all features get small non-zero coefficients
b_ridge = ridge(X, y, lam=1.0)
print(f"\nRidge: non-zero coefs = {(np.abs(b_ridge) > 0.01).sum()} / {p}")
print(f"Ridge recovery error: {np.linalg.norm(b_ridge - true_beta):.3f}")

# Lasso — sparse solution
b_lasso = lasso_coordinate_descent(X, y, lam=0.5)
non_zero = np.where(np.abs(b_lasso) > 0.01)[0]
print(f"\nLasso: non-zero coefs = {len(non_zero)} / {p}")
print(f"Lasso selected features: {non_zero}")
print(f"Lasso recovery error: {np.linalg.norm(b_lasso - true_beta):.3f}")

# Elastic Net
b_en = elastic_net(X, y, lam1=0.3, lam2=0.1)
non_zero_en = np.where(np.abs(b_en) > 0.01)[0]
print(f"\nElastic Net: non-zero coefs = {len(non_zero_en)} / {p}")
print(f"Elastic Net recovery error: {np.linalg.norm(b_en - true_beta):.3f}")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of Ridge (closed form), Lasso (coordinate descent with soft-thresholding), and Elastic Net — applied to a sparse signal recovery problem to demonstrate how L1 selects the correct features while L2 keeps all features at small non-zero values.
            </p>
            <CodeBlock code={PY_REG} filename="regularization_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> With 5 true features out of 50, Lasso selects a sparse set close to the truth while Ridge assigns non-zero weights to all 50. This sparse recovery capability — not just shrinkage — is the critical innovation of L1 regularisation.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Ridge, Lasso, and the geometry of sparsity</h2>

            <h3>Ridge Regression — L2 Penalty</h3>
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = \arg\min_\beta \underbrace{\|y - X\beta\|^2}_{\text{fit}} + \underbrace{\lambda \|\beta\|_2^2}_{\text{penalty}}" />
            <p>
                Closed form: beta_ridge = (X^T X + lambda I)^{-1} X^T y. Effect on singular values: coefficients along eigenvector j are shrunk by factor d_j^2 / (d_j^2 + lambda). Weak directions (small d_j^2, caused by near-collinear predictors) shrink most — exactly removing the instability that made OLS unreliable.
            </p>

            <h3>Lasso — L1 Penalty and Sparsity</h3>
            <MathBlock tex="\hat{\beta}^{\text{lasso}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda \|\beta\|_1" />
            <p>
                No closed form (non-differentiable at beta_j = 0). Solved by coordinate descent: update each beta_j by the soft-thresholding operator: beta_j &lt;— sign(r_j) * max(0, |r_j| − lambda/2) where r_j is the partial residual. Produces exact zeros because the subdifferential of |beta_j| at 0 spans [-1, 1] — the gradient condition can be satisfied with beta_j = 0 when the partial residual is small.
            </p>

            <h3>Elastic Net — Combining Both</h3>
            <MathBlock tex="\hat{\beta}^{\text{EN}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda_1 \|\beta\|_1 + \lambda_2 \|\beta\|_2^2" />
            <p>
                Coordinate update: beta_j &lt;— sign(r_j) * max(0, |r_j| − lambda_1/2) / (||x_j||^2 + lambda_2). The L2 term stabilises correlated groups; the L1 term drives sparsity. Mixing parameter alpha = lambda_1 / (lambda_1 + lambda_2) in [0, 1].
            </p>

            <h3>Bayesian Interpretation of Regularisation</h3>
            <MathBlock tex="\underbrace{p(\beta | y)}_{\text{posterior}} \propto \underbrace{p(y | \beta)}_{\text{likelihood}} \cdot \underbrace{p(\beta)}_{\text{prior}}" />
            <p>
                Ridge is MAP estimation under Gaussian prior beta_j ~ N(0, 1/lambda): log prior contributes −lambda * ||beta||^2. Lasso is MAP under Laplace prior beta_j ~ Laplace(0, 1/lambda): log prior contributes −lambda * ||beta||_1. The Laplace prior has a sharp peak at zero, making MAP estimates exactly zero for small partial correlations. This Bayesian view makes regularisation principled: it encodes prior beliefs about solution structure.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Chapter 8 complete.</strong> SVMs (1992) found the maximum margin. AdaBoost (1996) combined weak learners. Random Forests (2001) reduced variance through decorrelated averaging. Ridge and Lasso (1970 / 1996) formalised the bias-variance tradeoff and introduced sparse solutions. This four-algorithm toolkit dominated applied ML from 1992 to 2012 — until Chapter 9, where Geoffrey Hinton's 2006 paper on deep belief networks begins the story of how neural networks came back, this time permanently.
            </div>

            <DefBlock label="The Generalisation Tradeoff — Expected Test MSE Decomposition">
                Expected test MSE = Bias^2 + Variance + Irreducible Noise^2<br /><br />
                OLS: zero bias, high variance (especially when p is near n or predictors are correlated)<br />
                Ridge: small bias (shrinks toward zero), much lower variance → lower total MSE<br />
                Lasso: sparse bias (zeros for irrelevant, near-correct for relevant), lowest variance among regularised methods → interpretable and accurate
            </DefBlock>

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

export const REGULARIZATION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
