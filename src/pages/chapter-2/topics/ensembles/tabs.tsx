import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { TreeDiagram, EnsembleDiagram, BiasVarianceDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1994",
            title: "Bagging — Bootstrap Aggregating",
            challenge: "Decision trees and other high-variance learners were notoriously unstable: small changes in training data would produce completely different trees. Practitioners had no principled way to reduce this variance without sacrificing model flexibility.",
            what: "Leo Breiman introduced Bagging: train B copies of the same learner on B different bootstrap samples (sampling N points with replacement from the training set), then average their predictions (regression) or take majority vote (classification). The key insight was that bootstrap sampling introduces diversity while averaging cancels out idiosyncratic errors.",
            impact: "Bagging was the first practical variance-reduction technique for unstable learners. It showed that combining weak models is strictly better than any single model — and required no algorithmic changes to the base learner, making it immediately applicable.",
        },
        {
            year: "1996",
            title: "AdaBoost — Adaptive Boosting",
            challenge: "There was a theoretical result (Kearns & Valiant, 1989) that 'weak learners' — models barely better than random chance — could in principle be boosted into arbitrarily accurate classifiers. But no practical algorithm existed to do this.",
            what: "Yoav Freund and Robert Schapire introduced AdaBoost: iteratively train weak classifiers, then upweight the training examples that were misclassified (so the next classifier focuses on hard examples). The final prediction is a weighted vote of all classifiers, with more accurate classifiers getting higher weight.",
            impact: "AdaBoost won the 1995 Gödel Prize. It was remarkably effective on image and text classification, and its theoretical analysis (AdaBoost minimises exponential loss) inspired the entire field of boosting. It was the dominant practical ML algorithm in computer vision before deep learning.",
        },
        {
            year: "1999",
            title: "Random Forests — Randomised Feature Selection",
            challenge: "Bagged trees, while effective, were still correlated — they all tended to put the most informative feature at the root of the tree. Averaging correlated predictions gives diminishing variance reduction compared to averaging independent predictions.",
            what: "Tin Kam Ho and then Leo Breiman (2001) introduced Random Forests: at each split, consider only a random subset of √p features (rather than all p features). This de-correlates the trees while retaining most of their accuracy, so the average of B trees reduces variance much more than standard bagging.",
            impact: "Random Forests became the default algorithm for tabular data for 15 years. They require minimal tuning, naturally estimate feature importance and out-of-bag error, handle mixed feature types, and parallelise trivially. Still a strong baseline today.",
        },
        {
            year: "2001",
            title: "Gradient Boosting Machines (GBM)",
            challenge: "AdaBoost worked well for binary classification with exponential loss, but extending it to regression and multi-class problems was ad hoc. The algorithmic framework was not understood well enough to derive new boosting algorithms from first principles.",
            what: "Jerome Friedman reframed boosting as gradient descent in function space: at each stage, fit a new tree to the negative gradient of the loss (pseudo-residuals). Choosing different loss functions gives different boosting algorithms — squared error gives regression, deviance gives classification. A shrinkage parameter η multiplies each tree's contribution.",
            impact: "GBM became the theoretical foundation for the entire boosted-tree family. Friedman's paper also introduced stochastic gradient boosting (subsampling rows at each stage), which further reduces overfitting and speeds training.",
        },
        {
            year: "2014–2017",
            title: "XGBoost, LightGBM, CatBoost — Industrial Boosting",
            challenge: "GBM was powerful but slow and memory-hungry on large datasets. Kaggle competitions showed that ensemble methods consistently won on tabular data, creating demand for highly optimised implementations.",
            what: "Chen & Guestrin (XGBoost, 2016) added second-order Taylor approximation of the loss, regularisation terms on leaf weights, and distributed computing. Microsoft's LightGBM (2017) introduced leaf-wise (best-first) tree growth and histogram-based split finding for 20× speedup. Yandex's CatBoost (2018) handled categorical features natively without target encoding leakage.",
            impact: "XGBoost won hundreds of Kaggle competitions. It remains the go-to algorithm for structured/tabular data in production ML — outperforming deep learning on most tabular benchmarks while being orders of magnitude faster to train.",
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
            <h2>Asking many experts and combining their answers</h2>

            <Analogy label="Why one person is not enough">
                Imagine asking a single person to guess how many sweets are in a jar. They might be way off. But if you ask 100 people and average their guesses, the average is usually much closer. This is the idea behind <strong>ensemble methods</strong> — combine many imperfect models to get a better one.
            </Analogy>

            <Analogy label="Bagging — the parallel crowd">
                Imagine a quiz show where 500 different contestants each study from a slightly different subset of the textbook (some pages accidentally missing). They each answer every question, and you take the majority vote. Because each person's mistakes are different (they missed different pages), the mistakes tend to cancel out. This is <strong>Bagging</strong> (Bootstrap Aggregating).
            </Analogy>

            <DiagramBlock title="Decision tree — the individual expert each ensemble member is based on">
                <TreeDiagram />
            </DiagramBlock>

            <Analogy label="Boosting — the team that learns from mistakes">
                Now imagine a different game: you have a team of students taking a test one at a time. After each student finishes, you look at which questions they got wrong, and the next student focuses extra hard on those hard questions. Over time, the team gets better and better at all the hard parts. This is <strong>Boosting</strong> — each model focuses on where the previous models failed.
            </Analogy>

            <DiagramBlock title="Bagging vs Boosting — how the two strategies differ">
                <EnsembleDiagram />
            </DiagramBlock>

            <Analogy label="Random Forests — trees that disagree">
                A Random Forest is like bagging, but with an extra twist: each tree only gets to use a random selection of the clues (features). This forces different trees to find different patterns, making the crowd even more diverse — and even better at voting correctly.
            </Analogy>

            <Analogy label="Why ensembles win competitions">
                In most machine learning competitions, the winners use ensembles. The average of many good-but-different models is hard to beat with any single model, no matter how well you tune it.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Variance reduction by aggregation and sequential error correction</h2>

            <h3>Bagging</h3>
            <p>
                Draw B bootstrap samples D₁, …, D_B (each of size N, sampled with replacement from D). Train a model f̂_b on each D_b. Aggregate:
            </p>
            <ul>
                <li><strong>Regression:</strong> f̂_bag(x) = (1/B) Σ f̂_b(x)</li>
                <li><strong>Classification:</strong> majority vote of f̂_b(x)</li>
            </ul>
            <p>
                Why does this help? Each bootstrap sample omits about 37% of points (on average e⁻¹ ≈ 0.368 are never chosen). Trees trained on different samples make different errors. Averaging reduces variance without significantly increasing bias.
            </p>

            <h3>Random Forests</h3>
            <p>
                Like bagging, but at each split only consider m = √p randomly chosen features (for classification) or m = p/3 (for regression). This de-correlates the trees: if one feature dominates, standard bagged trees all put it at the root and become correlated. Limiting features forces them to find different splits.
            </p>
            <p>
                <strong>Out-of-bag (OOB) error:</strong> each tree can be evaluated on the ~37% of training points not in its bootstrap sample — a free cross-validation estimate, no hold-out set needed.
            </p>

            <h3>AdaBoost</h3>
            <p>
                Initialise uniform weights w_i = 1/N. For each round t = 1…T:
            </p>
            <ol>
                <li>Train weak classifier h_t on weighted data</li>
                <li>Compute weighted error ε_t = Σ w_i · 𝟙[h_t(x_i) ≠ y_i]</li>
                <li>Set α_t = ½ ln((1 − ε_t) / ε_t)  — weight proportional to accuracy</li>
                <li>Update: increase weights for misclassified, decrease for correct; renormalise</li>
            </ol>
            <p>
                Final prediction: H(x) = sign(Σ α_t h_t(x)). Misclassified points get up to e^(2α_t) times their current weight, so successive classifiers focus on the hardest examples.
            </p>

            <h3>Gradient Boosting</h3>
            <p>
                Gradient boosting builds an additive model F_M(x) = Σ η · h_m(x). At each step, fit h_m to the <em>pseudo-residuals</em> — the negative gradient of the loss L with respect to the current prediction F_{'{m-1}'}(x). For squared-error loss, pseudo-residuals are just ordinary residuals y_i − F_{'{m-1}'}(x_i).
            </p>

            <DiagramBlock title="Bias-variance tradeoff — how complexity relates to error">
                <BiasVarianceDiagram />
            </DiagramBlock>

            <h3>Stacking (Stacked Generalisation)</h3>
            <p>
                Train several diverse base models (level-0 learners). Collect their out-of-fold predictions and use those as features for a meta-learner (level-1). This is more flexible than voting but requires careful cross-validation to avoid leakage between levels.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Analysis</h2>

            <DefBlock label="Theorem — Bagging reduces variance">
                For B i.i.d. estimators each with variance σ² and pairwise correlation ρ, the variance of their average is:
                <br /><br />
                Var(average) = ρσ² + (1 − ρ)σ²/B
                <br /><br />
                As B → ∞ this approaches ρσ². Random Forests reduce ρ by forcing trees to use different features, pushing the asymptotic variance toward zero. Perfectly independent trees (ρ = 0) achieve Var → 0 as B → ∞.
            </DefBlock>

            <h3>AdaBoost Minimises Exponential Loss</h3>
            <p>
                AdaBoost is equivalent to forward stagewise additive modelling with exponential loss L(y, f) = e^(−yf(x)). At each step it computes the greedy minimiser of the empirical risk:
            </p>
            <MathBlock tex="\min_{\alpha, h} \sum_{i=1}^N e^{-y_i(F_{m-1}(x_i) + \alpha h(x_i))}" />
            <p>
                This yields the update rule above. The exponential loss is sensitive to outliers (downside of AdaBoost): mislabelled points receive exponentially growing weights and dominate late rounds.
            </p>

            <h3>Gradient Boosting — Functional Gradient Descent</h3>
            <MathBlock tex="F_m(x) = F_{m-1}(x) + \eta \cdot h_m(x)" />
            <p>
                where h_m is fit to the pseudo-residuals:
            </p>
            <MathBlock tex="r_{im} = -\left[\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}\right]_{F = F_{m-1}}" />
            <p>
                For L = squared error: r_im = y_i − F_{'{m-1}'}(x_i) (ordinary residuals).
                For L = log-loss (Bernoulli deviance): r_im = y_i − p_{'{m-1}'}(x_i) (response residuals).
                For L = absolute error: r_im = sign(y_i − F_{'{m-1}'}(x_i)) (sign of residuals).
            </p>

            <h3>XGBoost — Second-Order Boosting</h3>
            <p>
                XGBoost uses a second-order Taylor expansion of the loss at each step:
            </p>
            <MathBlock tex="\mathcal{L}^{(m)} \approx \sum_i \left[ g_i f_m(x_i) + \tfrac{1}{2} h_i f_m(x_i)^2 \right] + \Omega(f_m)" />
            <p>
                where g_i = ∂L/∂F and h_i = ∂²L/∂F² are the first and second gradients, and Ω(f) = γ|leaves| + ½λ‖w‖² regularises tree complexity. This closed-form solution for optimal leaf weights and exact gain calculation makes XGBoost faster and more accurate than standard GBM.
            </p>

            <DefBlock label="Feature Importance in Random Forests">
                For feature j, the total importance is the sum of information-gain reductions at all splits using j, weighted by the number of samples passing through each split, averaged over all B trees. Permutation importance (more reliable) permutes feature j's values on OOB samples and measures accuracy degradation.
            </DefBlock>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.ensemble import (
    RandomForestClassifier, AdaBoostClassifier,
    GradientBoostingClassifier, StackingClassifier
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.datasets import make_classification

# ── Dataset ─────────────────────────────────────────────────────
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=10,
    n_redundant=5, random_state=42
)

# ── Bagging (via Random Forest) ──────────────────────────────────
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,      # let trees grow fully (bagging handles overfitting)
    max_features="sqrt", # random feature selection at each split
    oob_score=True,      # free cross-validation estimate
    n_jobs=-1,
    random_state=42
)
rf.fit(X, y)
print(f"Random Forest OOB score:  {rf.oob_score_:.3f}")
print(f"Random Forest CV score:   {cross_val_score(rf, X, y, cv=5).mean():.3f}")

# Feature importance
top_features = np.argsort(rf.feature_importances_)[::-1][:5]
print(f"Top 5 features by importance: {top_features}")

# ── AdaBoost ─────────────────────────────────────────────────────
ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),  # decision stumps
    n_estimators=200,
    learning_rate=0.5,
    random_state=42
)
print(f"AdaBoost CV score:        {cross_val_score(ada, X, y, cv=5).mean():.3f}")

# ── Gradient Boosted Trees ───────────────────────────────────────
gbm = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.05,  # small η → more trees needed, better generalisation
    max_depth=3,
    subsample=0.8,       # stochastic GBM — use 80% of data per tree
    random_state=42
)
print(f"GBM CV score:             {cross_val_score(gbm, X, y, cv=5).mean():.3f}")

# ── Stacking ─────────────────────────────────────────────────────
base_learners = [
    ("rf",  RandomForestClassifier(n_estimators=100, random_state=42)),
    ("gbm", GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ("ada", AdaBoostClassifier(n_estimators=100, random_state=42)),
]
stack = StackingClassifier(
    estimators=base_learners,
    final_estimator=LogisticRegression(C=0.1),
    cv=5,
    passthrough=False,
)
print(f"Stacking CV score:        {cross_val_score(stack, X, y, cv=3).mean():.3f}")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="ensembles.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Tuning tips:</strong> For Random Forests, increase <code>n_estimators</code> until OOB error plateaus (never hurts to add more trees, just slower). For GBM, lower <code>learning_rate</code> and increase <code>n_estimators</code> proportionally — more, smaller steps generalise better. Use <code>early_stopping_rounds</code> in XGBoost/LightGBM to avoid over-boosting.
            </div>
        </>
    )
}




export const ENSEMBLES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
