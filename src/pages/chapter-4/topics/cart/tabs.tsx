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
            year: "1963–1977",
            title: "The Statistics Community's Frustration with ID3",
            challenge: "While Quinlan's work was developing in the AI tradition, statisticians working on survival analysis, epidemiology, and clinical trials had been building their own partitioning methods since the early 1960s. AID (Automatic Interaction Detection, Morgan & Sonquist 1963) and its successors used F-tests and chi-squared tests to partition continuous data, but they lacked the clean recursive structure of ID3 and had no principled way to handle the bias-variance tradeoff. The AI community's information-gain criterion felt ad hoc to statisticians trained in hypothesis testing and confidence intervals.",
            what: "Throughout the 1970s, several independent research groups at Stanford, Berkeley, and RAND were exploring recursive data partitioning for medical data. They shared a common frustration: existing methods lacked (1) a unified treatment of classification and regression, (2) rigorous statistical theory connecting tree structure to prediction error, and (3) a principled method for choosing how large a tree to grow. These shared frustrations eventually converged into a single collaborative project.",
            impact: "The statistical community's critique of AI decision trees — that they lacked rigorous error analysis and overfitting control — directly motivated the CART project. The theoretical framework Breiman and colleagues developed — connecting tree size to the bias-variance tradeoff and regularisation — became the conceptual foundation for the entire modern ensemble learning field, two decades before ensemble methods were developed.",
        },
        {
            year: "1984",
            title: "Breiman, Friedman, Olshen &amp; Stone — Classification and Regression Trees",
            challenge: "Statisticians working on medical survival data, economic forecasting, and psychology experiments needed trees that worked with continuous predictors (age, blood pressure, income), that predicted continuous outcomes (not just class labels), and that had rigorous statistical justification — confidence intervals, sampling theory, connections to the bias-variance tradeoff. ID3's ad hoc chi-squared and information-gain criteria lacked these properties. An entirely new framework was needed.",
            what: "Leo Breiman, Jerome Friedman, Richard Olshen, and Charles Stone published Classification and Regression Trees — a 408-page monograph that defined a new algorithm. CART's key decisions: (1) Always binary splits. Every node produces exactly two children, making the tree a binary tree that is easier to analyse. (2) Gini impurity for classification: &sum;<sub>k</sub> p<sub>k</sub>(1&minus;p<sub>k</sub>) — computationally simpler than entropy. (3) Variance reduction for regression: choose the split minimising the weighted sum of within-child variances. (4) Cost-complexity pruning: grow the full tree, then prune by selecting the subtree minimising R(T) + &alpha;|T| on cross-validated data.",
            impact: "CART became the foundation of the entire modern tree ensemble family. Random Forests (Chapter 8) and gradient boosting both use CART trees as their base learner. The cost-complexity pruning framework — trading off accuracy against complexity — is structurally identical to ridge regression regularisation. Breiman and Friedman would go on to develop bagging (1994), Random Forests (2001), and gradient boosting (2001), respectively — the three most important contributions to practical ML in the decade before deep learning's dominance.",
        },
        {
            year: "1984 — Concurrent",
            title: "The Regression Tree — Supervised Learning for Continuous Outputs",
            challenge: "Before CART, decision trees were classification algorithms only — they predicted category labels. But many important real-world problems required predicting a continuous number: a house price, a patient's blood pressure response to medication, a crop yield given weather conditions. Regression models (linear regression, splines) handled this, but they assumed smooth relationships between inputs and outputs. A method was needed that could capture arbitrary, non-smooth relationships without any functional form assumption.",
            what: "CART's regression tree replaced the impurity criterion with variance reduction: at each node, find the feature j and threshold t that minimise the total within-child mean-squared error. The left and right child sets are L = &#123;x : x<sub>j</sub> &le; t&#125; and R = &#123;x : x<sub>j</sub> &gt; t&#125;. The prediction for each leaf is the mean of the training labels in that leaf. The algorithm structure is identical to the classification case — only the splitting metric changes from Gini to variance.",
            impact: "Regression trees made decision trees applicable to the full range of supervised learning problems. They also revealed a key weakness that motivated ensemble methods: a single regression tree produces a step-function approximation — constant within each rectangular leaf region. This piecewise-constant approximation is rough even when the true function is smooth. Averaging many trees (Random Forests) or fitting trees sequentially to residuals (gradient boosting) dramatically smooths this approximation and was the key insight that made ensemble methods dominate Kaggle competitions two decades later.",
        },
        {
            year: "1994",
            title: "Breiman — Bagging Reveals That Trees Are Unstable",
            challenge: "Practitioners working with CART in the early 1990s observed an alarming property: small changes to the training data — removing or adding a handful of examples — could produce completely different trees. A tree grown on 1000 samples might change dramatically if 10 samples were swapped. This high variance made individual trees unreliable despite their interpretability. The question: was this variance inherent to the tree structure, and could it be fixed without abandoning the tree framework entirely?",
            what: "Breiman's 1994 bootstrap aggregating (bagging) paper provided the answer. Grow B CART trees on B bootstrap samples (sample with replacement from the training set). Combine predictions by majority vote (classification) or averaging (regression). The key finding: averaging dramatically reduced variance while leaving bias nearly unchanged. The instability that made individual trees unreliable became an asset — diverse trees trained on slightly different data made different errors, and those errors cancelled in the average.",
            impact: "Bagging was the immediate predecessor of Random Forests. More importantly, it established the fundamental principle of ensemble learning: an ensemble member should be diverse and high-variance, not accurate individually. This insight — that a good ensemble requires diverse members, not individually strong ones — restructured how ML practitioners thought about model selection. Pruning, the topic explored next, is what controls variance in individual trees without the overhead of a full ensemble.",
        },
        {
            year: "2001",
            title: "Breiman — Random Forests and the End of the Single-Tree Era",
            challenge: "Bagged CART trees were a significant improvement over individual trees, but bagging alone left a key source of correlation between trees: all of them used the same set of features at each split. If one very strong predictor dominated, all trees would split on it early and produce similar (correlated) trees. Correlated predictions do not average as well as independent predictions — the variance reduction from averaging is limited by the correlation structure.",
            what: "Breiman's Random Forests added feature subsampling at each split: at every node, instead of choosing among all d features, choose only among a random subset of &lfloor;&radic;d&rfloor; features. This decorrelates the trees — each one uses a different subset of features at the most informative nodes, producing diverse hypotheses that agree on the signal but disagree on the noise. Combined with bagging, the result is an ensemble whose variance decreases as the number of trees increases, without a corresponding increase in bias.",
            impact: "Random Forests set the state of the art on tabular data benchmarks for nearly a decade and remain competitive today. They also gave ML practitioners their first model with built-in feature importance estimates (mean decrease in Gini impurity) and out-of-bag error estimates (using the bootstrap samples not used to train each tree). CART trees are the base learner — without the 1984 CART paper, Random Forests as Breiman designed them could not exist.",
        },
        {
            year: "2016",
            title: "XGBoost — CART Trees at Industrial Scale",
            challenge: "Gradient boosting (Friedman 2001) used CART trees as base learners but was slow to train — fitting trees sequentially meant no parallelisation across the boosting iterations. As datasets grew to millions of rows and hundreds of features (Kaggle competitions, click-through rate prediction, fraud detection), gradient boosting's training time became a bottleneck. A faster, scalable implementation was needed.",
            what: "Tianqi Chen and Carlos Guestrin's XGBoost (2016) introduced approximate greedy split-finding (pre-sorting features and using histogram-based thresholds), second-order Taylor expansion of the loss for more accurate leaf value computation, regularisation directly in the tree-building objective (L1 and L2 on leaf weights), and column and row subsampling per tree. The result was 10–100x faster than existing gradient boosting implementations while matching or exceeding accuracy.",
            impact: "XGBoost won more Kaggle competitions between 2015 and 2017 than any other method, including deep learning. LightGBM and CatBoost (both 2017) extended the same ideas further. All are built on CART trees as base learners — the 1984 Breiman et al. framework, operating at scales and speeds the original authors could not have imagined. CART's binary-split, variance-reduction framework proved to be the right abstraction for the ensemble era.",
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
            <h2>The statistician's answer to decision trees</h2>

            <p className="ch-story-intro">
                Quinlan's ID3 came from the AI tradition: it loved multiple branches, categorical variables, and readable rules. Four statisticians — Breiman, Friedman, Olshen, and Stone — came to decision trees from a completely different direction. They wanted trees that could handle numbers, predict continuous outcomes, and connect to the mathematical theory of estimation. Their 1984 answer, CART, became the foundation of every tree ensemble used in machine learning today — from Random Forests to XGBoost.
            </p>

            <Analogy label="Always binary — why always two branches?">
                ID3 might split a colour attribute into red / blue / green / yellow — four branches at once. CART always asks yes/no questions: "Is this value above 3.5?" Always two branches, always a threshold.
                <br /><br />
                Why? Because any multi-way split can be built from a sequence of binary splits. And binary trees are far easier to analyse mathematically — you can prove theorems about binary trees that don't hold for arbitrary multi-way trees. This also connects CART to binary decision-making in information theory and makes the tree structure uniform regardless of feature type.
            </Analogy>

            <Analogy label="Gini impurity — measuring the mess">
                Instead of Shannon's entropy, CART uses Gini impurity: if you picked two examples at random from a node, how often would they have different labels?
                <br /><br />
                In a node that's 90% cats and 10% dogs: if you pick two, the chance they disagree is 2 &times; 0.9 &times; 0.1 = 18%. In a 50/50 node: 2 &times; 0.5 &times; 0.5 = 50% — maximally messy. CART finds the split that reduces this disagreement probability the most.
                <br /><br />
                Gini and entropy almost always choose the same split. But Gini is faster to compute — no logarithms — and its derivative exists everywhere, making mathematical analysis cleaner.
            </Analogy>

            <Analogy label="Regression trees — predicting numbers">
                If the label is a continuous number (house price, blood pressure, temperature), CART uses a different rule: find the split that makes each child's numbers as close to their average as possible. The "mess" is now the spread — the variance — of the numbers in a node.
                <br /><br />
                For any new input, follow the tree down to a leaf, then predict the average of all training examples that landed in that leaf. Simple — but rough, like a staircase approximation to a smooth curve. This roughness is exactly why you need many trees averaged together.
            </Analogy>

            <Analogy label="Bagging — when a crowd beats an expert">
                Breiman noticed something alarming: change just a few training examples and the CART tree changes completely. A student who memorised one textbook fails completely when the exam uses a different edition. Decision trees have this same fragility — high variance.
                <br /><br />
                His fix: grow 100 trees, each on a slightly different random sample of the data. Average their predictions. The random sampling means each tree makes different mistakes — and when you average, the mistakes cancel. This is <strong>bagging</strong>, and it is the direct ancestor of Random Forests (Chapter 8).
            </Analogy>

            <Analogy label="What comes next — the right amount of tree">
                CART grows a full tree until every leaf is pure — but a pure leaf on the training set almost always means overfitting. The next topic is pruning: the art of cutting back a tree to exactly the right size — not so large it memorises noise, not so small it misses the pattern. Cost-complexity pruning is the first explicit connection between decision trees and the mathematical theory of regularisation.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Binary recursive partitioning — Gini impurity and variance reduction</h2>

            <h3>Gini Impurity</h3>
            <p>
                For a node with class proportions p<sub>1</sub>, ..., p<sub>K</sub>, Gini impurity equals the probability that two randomly selected examples have different labels:
            </p>
            <MathBlock tex="\text{Gini}(t) = \sum_{k=1}^K p_k(1 - p_k) = 1 - \sum_{k=1}^K p_k^2 \quad \in \left[0,\; 1 - \tfrac{1}{K}\right]" />
            <p>
                Gini = 0 for a pure node; maximum = 1 &minus; 1/K for a uniformly mixed node. CART searches over all (feature j, threshold s) pairs to find the binary split minimising the weighted Gini of the two children:
            </p>
            <MathBlock tex="\text{Gini}_{\text{split}} = \frac{N_L}{N}\,\text{Gini}(L) + \frac{N_R}{N}\,\text{Gini}(R)" />

            <h3>Regression Tree — Variance Reduction Criterion</h3>
            <p>
                For continuous targets y, CART minimises the weighted within-child mean-squared error:
            </p>
            <MathBlock tex="\text{MSE}_{\text{split}} = \frac{N_L}{N}\,\text{Var}(L) + \frac{N_R}{N}\,\text{Var}(R)" />
            <p>
                where Var(S) = (1/|S|) &sum;<sub>i&isin;S</sub> (y<sub>i</sub> &minus; ȳ<sub>S</sub>)<sup>2</sup>. The leaf prediction is ȳ<sub>leaf</sub> — the sample mean of training labels in that leaf.
            </p>

            <h3>CART Algorithm</h3>
            <ol>
                <li>For each feature j, for each unique value v in feature j: evaluate binary split (j, v)</li>
                <li>Choose (j*, v*) = argmin Gini<sub>split</sub> or MSE<sub>split</sub></li>
                <li>Split node into left &#123;x : x<sub>j</sub> &le; v*&#125; and right &#123;x : x<sub>j</sub> &gt; v*&#125;</li>
                <li>Recurse until stopping criterion: max depth, min samples per leaf, or all leaves pure</li>
            </ol>

            <h3>Gini vs Entropy — Are They Really Different?</h3>
            <p>
                Both Gini and entropy are concave, symmetric impurity measures, zero at pure nodes, maximum at uniform distributions. They select the same splitting feature in approximately 97% of cases (Raileanu &amp; Stoffel, 2004). The rare disagreements occur at very unequal class distributions. In practice, the choice of max_depth, min_samples_leaf, and ensemble size matters far more than the choice of impurity criterion.
            </p>

            <h3>Connection to Ensemble Methods</h3>
            <p>
                CART's key property for ensembles: it is a <strong>high-variance, low-bias learner</strong>. A deep tree approximates the training data well (low bias) but is extremely sensitive to its composition (high variance). Averaging many trees (Random Forests, Ch.8) reduces variance without increasing bias. Fitting trees sequentially to residuals (Gradient Boosting, Ch.8) reduces bias without inflating variance. Both are only possible because CART produces the right kind of approximation error — correctable by diversity and sequential refinement.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Chapter connections:</strong> CART (1984) was published the same year that Rumelhart, Hinton, and Williams were developing backpropagation (published 1986). Both solved the same problem — learning a mapping from inputs to outputs from examples — via completely different mechanisms. Decision trees partition the input space into axis-aligned rectangular regions; neural networks learn smooth non-linear boundaries via gradient descent. The comparison between these two paradigms dominated ML discussions for 30 years and is still unresolved: tabular data often favours tree ensembles; image and text data strongly favours neural networks.
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
                    <span className="ch-expandable-desc">Implementation · scikit-learn · NumPy</span>
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
            <h2>CART — Formal Optimisation Framework</h2>

            <DefBlock label="CART Splitting Objective">
                At a node t with training set S<sub>t</sub>, find the binary split (j, s) partitioning S<sub>t</sub> into left child S<sub>L</sub> = &#123;x &isin; S<sub>t</sub> : x<sub>j</sub> &le; s&#125; and right child S<sub>R</sub> = &#123;x &isin; S<sub>t</sub> : x<sub>j</sub> &gt; s&#125; that minimises:
                <br /><br />
                &phi;(j, s) = (|S<sub>L</sub>|/|S<sub>t</sub>|) &middot; Q(S<sub>L</sub>) + (|S<sub>R</sub>|/|S<sub>t</sub>|) &middot; Q(S<sub>R</sub>)
                <br /><br />
                where Q is the impurity measure: Gini for classification, variance for regression.
            </DefBlock>

            <h3>Gini Impurity — Taylor Approximation to Entropy</h3>
            <MathBlock tex="\text{Gini}(t) = 1 - \sum_k p_k^2, \qquad H(t) = -\sum_k p_k \log_2 p_k" />
            <p>
                For binary classification (K=2, p<sub>2</sub> = 1 &minus; p<sub>1</sub> = p):
            </p>
            <MathBlock tex="\text{Gini}(p) = 2p(1-p), \qquad H(p) = -p\log_2 p - (1-p)\log_2(1-p)" />
            <p>
                Via Taylor expansion of H(p) around p = 1/2: H(p) &asymp; 1 &minus; 2(p &minus; 1/2)<sup>2</sup>. Both functions are concave, zero at p = 0 and 1, maximum at p = 1/2. The Hessian of Gini is &minus;2; of H is &minus;1/(p(1&minus;p)ln2). The ratio of Hessians at p = 0.5 is 1/(2ln2) &asymp; 0.72, showing Gini and entropy have the same shape up to a constant scaling factor.
            </p>

            <h3>Variance Reduction for Regression — Equivalence to MSE Minimisation</h3>
            <p>
                For regression, the total within-child MSE of split (j, s):
            </p>
            <MathBlock tex="\text{MSE}(j, s) = \frac{1}{|S_t|}\left[\sum_{i \in S_L}(y_i - \bar{y}_L)^2 + \sum_{i \in S_R}(y_i - \bar{y}_R)^2\right]" />
            <p>
                This is equivalent to maximising the between-split variance explained — the reduction in RSS from the parent node. The regression tree at convergence implements a non-parametric piecewise-constant function estimator with data-adaptive partition boundaries, achieving the minimax optimal rate for functions with bounded variation under suitable conditions (Donoho 1997).
            </p>

            <h3>Bias-Variance Decomposition of CART</h3>
            <p>
                For a regression tree of depth d with n training samples, the expected test MSE decomposes:
            </p>
            <MathBlock tex="\mathbb{E}[(\hat{f}(x) - f(x))^2] = \underbrace{\text{Bias}^2(\hat{f}(x))}_{\text{decreases with depth}} + \underbrace{\text{Var}(\hat{f}(x))}_{\text{increases with depth}} + \sigma^2" />
            <p>
                Deep trees have low bias (they approximate f closely) but high variance (leaf means are estimated from few samples). Shallow trees have high bias but low variance. The optimal depth minimises the sum of the first two terms — this is the tradeoff that cost-complexity pruning exploits.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score

# ── Classification tree (Gini impurity) ───────────────────────────
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# CART with Gini (default in sklearn)
dt = DecisionTreeClassifier(criterion="gini", random_state=42)
dt.fit(X_train, y_train)
print(f"Full CART depth={dt.get_depth()}, leaves={dt.get_n_leaves()}")
print(f"Train acc: {dt.score(X_train, y_train):.3f}  (likely 1.000 — overfitting)")
print(f"Test acc:  {dt.score(X_test, y_test):.3f}")

# ── Feature importance (mean decrease in Gini) ────────────────────
fi = sorted(
    zip(cancer.feature_names, dt.feature_importances_),
    key=lambda x: -x[1]
)
print("\\nTop-5 features by Gini importance:")
for name, importance in fi[:5]:
    print(f"  {name[:30]:30s}: {importance:.4f}")

# ── Regression tree ───────────────────────────────────────────────
# Predict house prices (using sklearn's toy dataset)
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing()
Xr, yr = housing.data, housing.target

Xr_train, Xr_test, yr_train, yr_test = train_test_split(
    Xr, yr, test_size=0.2, random_state=42
)
reg_tree = DecisionTreeRegressor(max_depth=5, random_state=42)
reg_tree.fit(Xr_train, yr_train)
from sklearn.metrics import mean_squared_error
mse = mean_squared_error(yr_test, reg_tree.predict(Xr_test))
print(f"\\nRegression tree (depth=5): Test RMSE = {mse**0.5:.3f}")

# ── NumPy CART — from-scratch single split finder ─────────────────
def best_binary_split_gini(X, y, n_classes):
    """Find the best single binary split by Gini impurity."""
    n_samples, n_features = X.shape
    best_gini, best_j, best_s = np.inf, 0, 0.0

    def gini(labels):
        if len(labels) == 0:
            return 0.0
        probs = np.bincount(labels, minlength=n_classes) / len(labels)
        return 1.0 - np.sum(probs ** 2)

    for j in range(n_features):
        thresholds = np.unique(X[:, j])
        for s in thresholds:
            left  = y[X[:, j] <= s]
            right = y[X[:, j] >  s]
            g = (len(left) * gini(left) + len(right) * gini(right)) / n_samples
            if g < best_gini:
                best_gini, best_j, best_s = g, j, s

    return best_j, best_s, best_gini

j, s, g = best_binary_split_gini(X_train, y_train, n_classes=2)
print(f"\\nBest single split: feature {j} ({cancer.feature_names[j]})")
print(f"  Threshold: {s:.4f}, Gini: {g:.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                The code demonstrates CART classification (Gini criterion) and regression trees in scikit-learn, feature importance via mean Gini decrease, and a from-scratch NumPy implementation of the single-split search to make the Gini minimisation concrete.
            </p>
            <CodeBlock code={PY_CODE} filename="cart_tree.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>CART in scikit-learn:</strong> <code>DecisionTreeClassifier</code> uses CART's binary-split algorithm regardless of the <code>criterion</code> parameter. The default <code>criterion="gini"</code> exactly matches Breiman et al. 1984. Cost-complexity pruning is available via the <code>ccp_alpha</code> parameter — see the Pruning topic for a detailed walkthrough. Feature importances from <code>feature_importances_</code> are computed as the total Gini reduction weighted by the number of samples passing through each node, normalised to sum to 1.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const CART_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
