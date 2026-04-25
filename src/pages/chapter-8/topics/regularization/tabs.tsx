import { Analogy, DefBlock, MathBlock } from "../../shared"
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
                "Geophysicists and signal engineers were solving inverse problems: given noisy measurements of the surface, infer the underlying subsurface structure. These problems were ill-posed in the sense of Hadamard: the solution was not unique, and small changes in the measurements led to enormous changes in the inferred structure. Standard least squares amplified noise catastrophically when the measurement matrix was nearly singular.",
            what:
                "Andrey Tikhonov introduced what is now called L2 regularisation or Tikhonov regularisation: add a penalty term λ||x||² to the objective, where x is the unknown to be recovered. The regularised solution x* = (AᵀA + λI)⁻¹Aᵀb is always unique (λI makes the matrix invertible), stable (bounded by the data), and shrinks toward zero as λ increases. The parameter λ controls the balance between fitting the data and keeping the solution small.",
            impact:
                "Tikhonov regularisation is the most widely deployed mathematical principle in applied science. Every ill-posed linear system in geodesy, medical imaging (CT reconstruction), signal processing, and finance uses it. Ridge regression in statistics (Hoerl & Kennard, 1970) is the same idea applied to overfitting. L2 weight decay in neural networks is the same idea applied to preventing large weights. The principle — add a penalty that encodes what you know about the solution being smooth or small — is universal.",
        },
        {
            year: "1970",
            title: "Hoerl & Kennard — Ridge Regression",
            challenge:
                "Ordinary least squares (OLS) for regression breaks down when the design matrix X is ill-conditioned — when two or more predictors are strongly correlated (multicollinearity). In economics, ecology, and social sciences, predictors like income, education, and employment are heavily correlated. OLS produces coefficient estimates with enormous standard errors that are unstable across samples.",
            what:
                "Hoerl and Kennard introduced Ridge Regression: add a penalty λ||β||² to the OLS objective. The ridge estimate β_ridge = (XᵀX + λI)⁻¹Xᵀy uniformly shrinks all coefficients toward zero. A 'ridge trace' — plotting coefficients as a function of λ — shows the estimates stabilising as λ increases from 0. Choose λ via cross-validation or generalised cross-validation (GCV).",
            impact:
                "Ridge regression showed that accepting a small controlled bias (the shrinkage toward zero) dramatically reduces variance and overall prediction error. This bias-variance tradeoff is one of the most important concepts in statistics. The ridge estimate is the MAP estimator under a Gaussian prior on β — exactly the Bayesian regularisation framework developed by Wald (Chapter 1). Ridge is the L2 penalty in SVMs (the C parameter is 1/(2nλ)) and weight decay in neural networks.",
        },
        {
            year: "1996",
            title: "Tibshirani — The Lasso and Sparse Solutions",
            challenge:
                "Ridge regression shrinks all coefficients but never sets any to exactly zero. In genomics, text classification, and econometrics, practitioners often dealt with p >> n settings (thousands of genes, thousands of words) where most features were irrelevant. Identifying which predictors actually matter — variable selection — was as important as accurate prediction. Ridge gave no help here.",
            what:
                "Robert Tibshirani replaced the L2 penalty with L1: Lasso = argmin ||y − Xβ||² + λ||β||₁. The L1 ball is a diamond — its corners lie on the coordinate axes. When the loss function's elliptical contours first touch the diamond, they almost always hit a corner, where some coordinates are exactly zero. This produces sparse solutions: most coefficients are zero, a small subset are non-zero. The non-zero coefficients correspond to the selected features.",
            impact:
                "The Lasso unified variable selection and estimation into a single convex optimisation problem — elegant, principled, and scalable. It revolutionised high-dimensional statistics and became the standard tool in genomics and any domain where interpretation of selected variables matters. The geometric insight — L1's diamond corners vs L2's sphere — directly influenced subsequent work on attention sparsity and the lottery ticket hypothesis in neural networks.",
        },
        {
            year: "2005",
            title: "Zou & Hastie — Elastic Net, Unifying L1 and L2",
            challenge:
                "The Lasso had a weakness: when two features are highly correlated (like copies of the same gene), it arbitrarily picks one and discards the other. In settings where correlated features all carry signal (grouped variables), this instability was undesirable. Also, Lasso selects at most n variables when p >> n.",
            what:
                "Hui Zou and Trevor Hastie proposed the Elastic Net: combine L1 and L2 penalties, α||β||₁ + (1−α)||β||²/2. The L2 component stabilises correlated groups (selecting them together), while the L1 component drives sparsity. The mixing parameter α ∈ [0,1] interpolates between pure Lasso (α=1) and pure Ridge (α=0). The optimisation remains convex and is solved efficiently by coordinate descent.",
            impact:
                "The Elastic Net became the standard regularisation choice when there are correlated predictors. More broadly, it resolved the apparent tension between L1 and L2: they are not competing methods but complementary penalties that can be mixed. This principle — that different regularisations can be combined — directly influenced dropout + weight decay in neural networks, and the penalty terms in fine-tuning (RLHF's KL penalty, LoRA's rank constraint). The regularisation story does not end in 2005; it continues in every chapter of this course.",
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
            <h2>Teaching a model to be simple — the war against memorisation</h2>

            <p className="ch-story-intro">
                SVMs found the widest possible margin. Random Forests averaged out errors. Both were fighting the same enemy: overfitting — a model that memorises the training data instead of learning the underlying pattern. Regularisation is the third weapon in this fight, and it applies to every ML algorithm ever invented, from Gauss's linear regression (Chapter 1) to GPT-4 (Chapter 22).
            </p>

            <Analogy label="The problem — memorising noise">
                A student who reads the same textbook ten times and memorises every sentence scores 100% on test questions that use the exact same wording — but fails the moment the question is paraphrased. That student has memorised, not learned.
                <br /><br />
                A model with too many parameters and too little data does the same: it learns the specific training examples, including their noise and quirks. On new data, it fails.
            </Analogy>

            <Analogy label="Ridge — penalise big weights">
                Tikhonov (1943) and Hoerl & Kennard (1970) had the same idea: add a rule that says "your parameters must stay small." Formally, add λ||β||² to the loss. The model now has two goals that it must balance: explain the data well AND keep its parameters small. Bigger λ → smaller parameters → simpler model → more regularised.
                <br /><br />
                The beauty: the parameter β_ridge = (XᵀX + λI)⁻¹Xᵀy has a closed-form solution. The λI term "adds a ridge" to the matrix, making it always invertible — even when the data is nearly singular.
            </Analogy>

            <Analogy label="Lasso — automatic feature selection">
                Tibshirani (1996) swapped the penalty from ||β||² (sum of squares) to ||β||₁ (sum of absolute values). The mathematical consequence is surprising: the optimal solution forces some parameters to exactly zero — complete elimination of the corresponding features.
                <br /><br />
                Imagine you have 1,000 genes but only 10 actually matter for predicting cancer. Ridge would keep all 1,000 with small values. Lasso would set 990 to exactly zero and give you a model with only the 10 relevant genes. It performs feature selection automatically.
            </Analogy>

            <Analogy label="Why the geometry works">
                Ridge: the constraint region (||β||² ≤ t) is a sphere — smooth, no corners. When the loss function's contours expand outward from the optimal point, they hit the sphere at a generic point where no coordinate is zero.
                <br /><br />
                Lasso: the constraint region (||β||₁ ≤ t) is a diamond — with corners on the axes. The expanding loss contours almost always first touch a corner, where some coordinates are exactly zero. That's the geometry behind sparse solutions.
            </Analogy>

            <Analogy label="Regularisation in deep learning — it never ends">
                The same principle appears throughout the rest of this course: L2 weight decay in neural networks (Chapter 5) prevents weights from growing large. Dropout (Chapter 9) randomly zeros neurons — equivalent to adding noise to the effective weight. The KL-divergence penalty in RLHF (Chapter 25) prevents a fine-tuned language model from drifting too far from its pre-trained starting point. LoRA's rank constraint (Chapter 23) forces parameter updates to live in a small subspace. Regularisation is not a technique — it is a principle.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Ridge, Lasso, and the geometry of sparsity</h2>

            <h3>Ridge Regression — L2 Penalty</h3>
            <MathBlock tex="\hat{\beta}^{\text{ridge}} = \arg\min_\beta \underbrace{\|y - X\beta\|^2}_{\text{fit}} + \underbrace{\lambda \|\beta\|_2^2}_{\text{penalty}}" />
            <p>Closed form: β_ridge = (XᵀX + λI)⁻¹Xᵀy. Effect on singular values: if XᵀX has eigenvalues d₁²,...,dₚ², ridge shrinks coefficient along eigenvector j by factor dⱼ²/(dⱼ² + λ). Weak directions (small dⱼ²) shrink most — exactly the instability that caused trouble in OLS.</p>

            <h3>Lasso — L1 Penalty</h3>
            <MathBlock tex="\hat{\beta}^{\text{lasso}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda \|\beta\|_1" />
            <p>No closed form (non-differentiable at βⱼ = 0). Solved by coordinate descent: update each βⱼ by the soft-thresholding operator: βⱼ ← sign(rⱼ) · max(0, |rⱼ| − λ/2) where rⱼ is the partial residual. Produces exact zeros because the subdifferential of |βⱼ| at 0 contains all values in [−1, 1].</p>

            <h3>Elastic Net</h3>
            <MathBlock tex="\hat{\beta}^{\text{EN}} = \arg\min_\beta \|y - X\beta\|^2 + \lambda_1 \|\beta\|_1 + \lambda_2 \|\beta\|_2^2" />
            <p>Coordinate update: βⱼ ← sign(rⱼ) · max(0, |rⱼ| − λ₁/2) / (1 + λ₂). The L2 term stabilises correlated groups; the L1 term drives sparsity.</p>

            <h3>Bayesian Interpretation</h3>
            <p>All three penalties correspond to MAP estimation with different priors on β:</p>
            <MathBlock tex="\text{Ridge} \leftrightarrow \beta \sim \mathcal{N}(0, 1/\lambda \cdot I_p)" />
            <MathBlock tex="\text{Lasso} \leftrightarrow \beta_j \sim \text{Laplace}(0, 1/\lambda)" />
            <p>Ridge (Gaussian prior) is smooth, doesn't produce exact zeros. Lasso (Laplace prior) has a spike at zero — its density is large near zero, encouraging sparsity. This Bayesian view makes regularisation principled: it encodes your prior belief about the solution.</p>

            <DefBlock label="The Generalisation Tradeoff">
                Expected test MSE = Bias² + Variance + Noise²<br /><br />
                OLS: zero bias, high variance (especially when p ≈ n or multicollinear)<br />
                Ridge: small bias (toward zero), much lower variance → lower total MSE<br />
                Lasso: sparse bias (toward zero for most, less for selected), lowest variance → interpretable + accurate
            </DefBlock>

            <div className="ch-callout">
                <strong>Chapter 8 complete.</strong> SVMs (1992) found the maximum margin. AdaBoost (1996) combined weak learners. Random Forests (2001) reduced variance through decorrelated averaging. Ridge and Lasso (1970/1996) formalised the bias-variance tradeoff. This four-algorithm toolkit dominated applied ML from 1992 to 2012 — until Chapter 9, where Geoffrey Hinton's 2006 paper on deep belief networks begins the story of how neural networks came back, this time for good.
            </div>
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
