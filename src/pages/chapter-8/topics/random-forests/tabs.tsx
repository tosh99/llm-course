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
            year: "1996",
            title: "Breiman — Bagging and Bootstrap Aggregating",
            challenge:
                "Decision trees (CART, Chapter 4) were powerful and interpretable, but suffered from high variance: small changes in training data produced wildly different trees. In Breiman's own experiments, removing a single training example could completely restructure the top three levels of a CART tree. This instability made individual trees unreliable in medical diagnosis, financial forecasting, and any application where consistency across data samples mattered.",
            what:
                "Leo Breiman introduced Bagging (Bootstrap AGGregating): train B independent copies of the same base learner (typically CART), each on a bootstrap sample — n examples drawn with replacement from the n-example training set. Average the predictions (regression) or take majority vote (classification). Bootstrap samples introduce diversity: each tree sees roughly 63.2% of the original examples (since the probability of a given example not being drawn in n trials is (1 − 1/n)^n → 1/e ≈ 0.368). The remaining 36.8% are 'out-of-bag' examples, never used to train that particular tree.",
            impact:
                "Bagging was the first demonstration that combining unstable learners systematically reduces variance. The key mathematical insight: if each tree has variance sigma^2 and the trees are uncorrelated, the average of B trees has variance sigma^2 / B. Even with some pairwise correlation rho between trees, the average variance is rho * sigma^2 + (1 − rho) * sigma^2 / B — which approaches rho * sigma^2 as B grows. This implies reducing correlation between trees is as important as increasing B.",
        },
        {
            year: "1998 – 2001",
            title: "Ho & Breiman — Random Subspace Method and Random Forests",
            challenge:
                "Bagged trees were better than individual trees but still correlated. All B trees tended to use the same feature at the root — the most globally predictive feature — making similar splits and similar errors. Averaging correlated trees still reduced variance, but not as much as averaging truly independent trees would. Practitioners needed a way to de-correlate the trees without hurting individual tree quality.",
            what:
                "Tin Kam Ho (1998) introduced the random subspace method: at each split in each tree, consider only a random subset of m features rather than all p features. This forces each tree to explore different parts of the feature space. Leo Breiman (2001) combined bootstrap sampling (bagging) with random feature selection into the algorithm now called Random Forests: B trees, each trained on a bootstrap sample, each split considering m = sqrt(p) features drawn at random from the full p features. Out-of-bag examples (not used to train each tree) provide a free estimate of generalisation error — no separate validation set required.",
            impact:
                "Random Forests became the dominant ML algorithm from 2001 to 2012 — an 11-year reign. They require almost no tuning (m = sqrt(p) is a reliable default), almost never overfit when B is large (more trees only helps), run embarrassingly in parallel, handle missing data and mixed feature types naturally, and provide built-in feature importance scores. They remain a strong baseline against which every new algorithm is compared on tabular datasets.",
        },
        {
            year: "2011",
            title: "Shotton et al. — Microsoft Kinect and Synthetic Training Data",
            challenge:
                "Human body-part segmentation from depth images — the core problem for the Kinect motion controller — required a classifier that could run in real time (25 fps), work across diverse body shapes and poses, and generalise to new users without per-user calibration. Neural networks were too slow; SVMs required feature engineering for each body configuration. No large annotated dataset of depth images with body-part labels existed.",
            what:
                "Jamie Shotton and colleagues at Microsoft Research trained Random Forests on millions of synthetic depth images rendered from 3D human body models in randomised poses and environments. Each pixel was labelled with a body part (head, left hand, right foot, etc.). The Random Forest learned to classify each pixel in real time by evaluating simple depth-comparison features — differences between two pixel depth values offset by learned displacements. Inference ran at 200 fps; the full pipeline met the Xbox 360's real-time requirements.",
            impact:
                "The Kinect application proved two things simultaneously. First, Random Forests could achieve near-real-time performance on structured prediction problems at scale — competing with and exceeding neural network approaches of the era. Second, synthetic training data could substitute for real data when real data was scarce or expensive to annotate — a principle later central to robotics, self-driving cars, and the modern synthetic data movement. The paper's technique of per-pixel body-part classification also directly influenced semantic segmentation in deep learning.",
        },
        {
            year: "2001 – 2016",
            title: "Random Forests in Genomics, Finance, and Drug Discovery",
            challenge:
                "The most important property of Random Forests turned out to be their versatility across radically different data types. Genomics datasets had p >> n (thousands of genes, hundreds of patients). Financial datasets had complex non-linear interactions between correlated predictors. Drug discovery required predicting molecular activity from structural features. Each domain had unique challenges that standard algorithms struggled with.",
            what:
                "Random Forests thrived across all three domains. In genomics (Breiman 2001, Diaz-Uriarte & Alvarez de Andres 2006): gene selection via permutation importance outperformed statistical testing approaches, and RF handled high-dimensional correlated features naturally. In finance: RF captured non-linear interactions between macroeconomic predictors without explicit feature engineering. In drug discovery (Dahl et al. 2014, the Merck Kaggle competition): RF outperformed SVMs and matched early deep networks on molecular activity prediction. CERN particle physics (Baldi et al. 2014) showed RF matching neural networks on collision data classification.",
            impact:
                "The cross-domain success of Random Forests established the principle that a single, well-engineered algorithm could generalise across problem types without modification. This 'one algorithm, many domains' property is shared by gradient boosting and later by Transformer architectures. The permutation importance scores from Random Forests also pioneered model interpretability — the idea that you can measure how much each input feature contributes to predictions without opening the black box.",
        },
        {
            year: "2016 – present",
            title: "Gradient Boosting vs Random Forests — The Tabular Data Benchmark",
            challenge:
                "XGBoost (2016) brought gradient boosting to competitive efficiency with Random Forests. Both claimed state-of-the-art on structured data. Deep learning advocates pushed the view that neural networks would eventually dominate all data types. Practitioners needed empirical evidence: which algorithm to use when, and whether neural networks had actually surpassed classical ensembles on tabular data.",
            what:
                "Large-scale empirical studies settled the question. Shwartz-Ziv & Arpit (2022) tested 45 datasets and showed both Random Forests and gradient boosted trees consistently outperformed neural networks on tabular data. The consensus: Random Forests are more robust to hyperparameter choices, harder to overfit, faster to train (parallel), and excellent on noisy datasets. Gradient boosted trees achieve higher accuracy on clean large datasets with careful tuning but require more care. Neural networks require substantial architecture search and hyperparameter tuning to compete on tabular data.",
            impact:
                "The tabular data benchmark established that classical ensemble methods remain unbeaten on structured data — financial records, medical databases, user behaviour logs — even as deep learning conquered images, text, and audio. This is why Random Forests never died: they found their niche (tabular, mixed-type, high-dimensional feature spaces) where they remain dominant today. The question of why neural networks struggle on tabular data became a research thread that is still active, influencing TabNet, FT-Transformer, and other table-specific architectures.",
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
            <h2>A thousand trees that disagree with each other — on purpose</h2>

            <Analogy label="Why one tree is not enough">
                A single decision tree is like one very opinionated friend. Show them a slightly different set of examples, and they might give you completely different advice. They are brilliant but inconsistent — a small change in the data can flip their entire reasoning.
                <br /><br />
                What if instead of one friend, you could ask 500 friends — each of whom studied from a slightly different set of examples, and each choosing which questions to focus on at random? Even if each friend is inconsistent, the average of their advice is remarkably stable and accurate. That is a Random Forest.
            </Analogy>

            <Analogy label="Bootstrap sampling — giving each tree different data">
                You have 1,000 training examples. To build one tree in the forest, you randomly pick 1,000 examples from your dataset — but <em>with replacement</em>, meaning the same example can be picked multiple times. Some appear twice or three times; others not at all.
                <br /><br />
                Each of the 500 trees gets a different random sample. The examples that were never picked for a particular tree are called <strong>out-of-bag</strong> examples — and they serve as that tree's private test set, giving you a free estimate of how the full forest will do on new data.
            </Analogy>

            <Analogy label="Random feature selection — forcing diversity">
                Here is the clever part. At every branch in every tree, instead of looking at all features to find the best split, the tree randomly selects just a few features (usually the square root of the total count) and picks the best split among only those.
                <br /><br />
                Why? Because all 500 trees would otherwise split on the same feature at the root — the most globally important one. They would all make similar errors. By randomly restricting which features each tree can see, you force the trees to be diverse — to draw different boundaries and make different mistakes — so the mistakes cancel out when you average.
            </Analogy>

            <Analogy label="The final answer — majority vote or average">
                For classification: each tree votes for a class. The majority wins. For regression: each tree gives a number. The average is the prediction.
                <br /><br />
                A remarkable bonus: you can estimate the forest's generalisation error for free using the out-of-bag examples — the ones each tree never saw. No separate test set needed. This out-of-bag error is approximately equivalent to leave-one-out cross-validation, but computed at training time with no extra cost.
            </Analogy>

            <Analogy label="Feature importance — which inputs mattered most?">
                Random Forests give you a bonus measurement. For each feature, compute the out-of-bag accuracy normally, then randomly scramble that feature's values across all examples and re-compute accuracy. The drop in accuracy is that feature's importance score. Features that matter cause big accuracy drops when scrambled; irrelevant features cause none.
                <br /><br />
                This permutation feature importance was the first widely-used method for explaining model predictions. Today, similar ideas power SHAP values, attention visualisations in Transformers, and the entire interpretability research field in deep learning.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Variance Decomposition for Correlated Trees</h3>
            <p>
                For B trees each with variance sigma^2 and pairwise correlation rho, the variance of their mean is:
            </p>
            <MathBlock tex="\text{Var}\!\left(\frac{1}{B}\sum_{b=1}^B T_b(x)\right) = \rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2" />
            <p>
                As B → infinity the variance converges to rho * sigma^2. Therefore: (1) adding more trees always helps but has diminishing returns, and (2) reducing pairwise correlation rho (through random feature selection) can reduce irreducible variance that more trees cannot remove. The optimal m (features per split) minimises rho at the cost of slightly increasing individual tree variance.
            </p>

            <h3>Permutation Feature Importance — Formal Definition</h3>
            <MathBlock tex="\text{FI}(j) = \frac{1}{|\mathcal{B}_j^c|}\sum_{i \in \mathcal{B}_j^c}\ell\!\left(y_i,\, \hat{y}_i^{\pi_j}\right) - \frac{1}{|\mathcal{B}_j^c|}\sum_{i \in \mathcal{B}_j^c}\ell\!\left(y_i,\, \hat{y}_i\right)" />
            <p>
                where B_j^c is the set of out-of-bag examples for tree j, y_hat_i is the OOB prediction, and y_hat_i^&#123;pi_j&#125; is the prediction after randomly permuting feature j across B_j^c. FI(j) is the increase in OOB loss caused by destroying feature j's information.
            </p>

            <h3>Out-of-Bag Error as Cross-Validation</h3>
            <p>
                Each example x_i is OOB for approximately (1 − 1/n)^n → 1/e ≈ 36.8% of trees. The OOB prediction aggregates only the trees for which x_i was OOB. This is asymptotically equivalent to leave-one-out cross-validation (LOO-CV), which requires n re-trainings — obtained for free here. For large B the OOB error closely approximates the test error, making Random Forests one of few algorithms where cross-validation is computed during training at no extra cost.
            </p>
        </>
    )
}

const PY_RF = `import numpy as np
from collections import Counter

# ── CART Decision Tree (simplified) ──────────────────────────────────────────
class DecisionNode:
    """A node in the decision tree."""
    def __init__(self, feature=None, threshold=None, left=None, right=None,
                 value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value  # Leaf: majority class label

    def is_leaf(self):
        return self.value is not None


class CARTTree:
    """
    CART classification tree with random feature selection.
    max_features: number of features to consider at each split (RF-style).
    """

    def __init__(self, max_depth=5, max_features=None):
        self.max_depth = max_depth
        self.max_features = max_features
        self.root = None

    def fit(self, X, y):
        self.root = self._build(X, y, depth=0)
        return self

    def _gini(self, y):
        if len(y) == 0:
            return 0
        counts = Counter(y)
        n = len(y)
        return 1 - sum((c/n)**2 for c in counts.values())

    def _best_split(self, X, y):
        n, d = X.shape
        best_gain = -np.inf
        best_feat, best_thresh = None, None

        # Random subset of features (Random Forests key step)
        n_feats = self.max_features or d
        feats = np.random.choice(d, size=min(n_feats, d), replace=False)

        gini_parent = self._gini(y)

        for feat in feats:
            thresholds = np.unique(X[:, feat])
            for thresh in thresholds:
                left_mask = X[:, feat] <= thresh
                right_mask = ~left_mask
                if left_mask.sum() == 0 or right_mask.sum() == 0:
                    continue
                # Weighted Gini
                gini_split = (
                    left_mask.sum() / n * self._gini(y[left_mask]) +
                    right_mask.sum() / n * self._gini(y[right_mask])
                )
                gain = gini_parent - gini_split
                if gain > best_gain:
                    best_gain = gain
                    best_feat = feat
                    best_thresh = thresh

        return best_feat, best_thresh

    def _build(self, X, y, depth):
        # Stopping conditions
        if depth >= self.max_depth or len(set(y)) == 1 or len(y) < 2:
            return DecisionNode(value=Counter(y).most_common(1)[0][0])

        feat, thresh = self._best_split(X, y)
        if feat is None:
            return DecisionNode(value=Counter(y).most_common(1)[0][0])

        left_mask = X[:, feat] <= thresh
        left = self._build(X[left_mask], y[left_mask], depth + 1)
        right = self._build(X[~left_mask], y[~left_mask], depth + 1)
        return DecisionNode(feature=feat, threshold=thresh, left=left, right=right)

    def predict_one(self, x):
        node = self.root
        while not node.is_leaf():
            node = node.left if x[node.feature] <= node.threshold else node.right
        return node.value

    def predict(self, X):
        return np.array([self.predict_one(x) for x in X])


# ── Random Forest ─────────────────────────────────────────────────────────────
class RandomForest:
    """
    Breiman (2001) Random Forest.
    B trees, each on a bootstrap sample, each split using sqrt(p) features.
    Includes out-of-bag (OOB) error estimation.
    """

    def __init__(self, n_estimators=100, max_depth=5, max_features="sqrt"):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.max_features = max_features
        self.trees = []
        self.oob_indices = []     # OOB indices per tree

    def fit(self, X, y):
        n, d = X.shape
        m = int(np.sqrt(d)) if self.max_features == "sqrt" else self.max_features

        for b in range(self.n_estimators):
            # Bootstrap sample
            idx = np.random.choice(n, size=n, replace=True)
            oob_idx = np.setdiff1d(np.arange(n), idx)

            X_boot, y_boot = X[idx], y[idx]
            tree = CARTTree(max_depth=self.max_depth, max_features=m)
            tree.fit(X_boot, y_boot)

            self.trees.append(tree)
            self.oob_indices.append(oob_idx)

        # Compute OOB error
        self.oob_error_ = self._oob_error(X, y, n)
        return self

    def _oob_error(self, X, y, n):
        oob_votes = [[] for _ in range(n)]
        for tree, oob_idx in zip(self.trees, self.oob_indices):
            if len(oob_idx) == 0:
                continue
            preds = tree.predict(X[oob_idx])
            for i, pred in zip(oob_idx, preds):
                oob_votes[i].append(pred)
        # Majority vote for each example that has at least 1 OOB prediction
        correct = 0
        total = 0
        for i, votes in enumerate(oob_votes):
            if votes:
                pred = Counter(votes).most_common(1)[0][0]
                correct += (pred == y[i])
                total += 1
        return 1 - correct / total if total > 0 else 1.0

    def predict(self, X):
        # Majority vote across all trees
        votes = np.array([tree.predict(X) for tree in self.trees])
        # votes shape: (n_estimators, n_samples)
        result = []
        for col in votes.T:
            result.append(Counter(col).most_common(1)[0][0])
        return np.array(result)


# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
# 4-class classification with 10 features
n = 500
X = np.random.randn(n, 10)
y = (X[:, 0] + X[:, 1] > 0).astype(int) + (X[:, 2] > 0.5).astype(int)

rf = RandomForest(n_estimators=50, max_depth=4)
rf.fit(X, y)

train_acc = (rf.predict(X) == y).mean()
print(f"Training accuracy: {train_acc*100:.1f}%")
print(f"OOB error estimate: {rf.oob_error_*100:.1f}%")
print(f"(OOB error approximates test error — computed for free during training)")`

function PythonContent() {
    return (
        <>
            <p>
                Pure NumPy implementation of a Random Forest: bootstrap sampling, CART trees with random feature selection at each split, majority vote, and out-of-bag error estimation.
            </p>
            <CodeBlock code={PY_RF} filename="random_forest_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> The OOB error estimate is computed for free during training — no separate validation set needed. This is one of the most practically useful properties of Random Forests and distinguishes them from nearly every other algorithm.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Variance reduction through decorrelated averaging</h2>

            <h3>Bias-Variance Decomposition for Random Forests</h3>
            <p>
                For a single deep CART tree: high variance, low bias (it fits the training data very well but is sensitive to which examples are included). For B averaged trees, if each has variance sigma^2 and pairwise correlation rho:
            </p>
            <MathBlock tex="\text{Var}\!\left(\frac{1}{B}\sum_{b=1}^B T_b(x)\right) = \rho \sigma^2 + \frac{1-\rho}{B} \sigma^2" />
            <p>
                As B → infinity, variance approaches rho * sigma^2. Reducing correlation rho (by random feature selection) is as important as increasing B. This is the key innovation in Random Forests over plain bagging.
            </p>

            <h3>The Random Forest Algorithm</h3>
            <ol>
                <li>For b = 1, ..., B: draw bootstrap sample D_b (n examples sampled with replacement)</li>
                <li>Grow a deep CART tree on D_b; at each split, consider only m = sqrt(p) randomly chosen features</li>
                <li>Aggregate: y_hat_RF(x) = (1/B) sum_b T_b(x) for regression; majority vote for classification</li>
            </ol>

            <h3>Out-of-Bag Error Estimation</h3>
            <p>
                Each example x_i is out-of-bag for approximately 36.8% of trees (probability of never being drawn is (1 − 1/n)^n → 1/e). OOB error: predict each x_i using only the trees for which it was OOB; compare predicted class to y_i. This approximates leave-one-out cross-validation but requires no additional training.
            </p>

            <h3>Permutation Feature Importance</h3>
            <MathBlock tex="\text{FI}(j) = \text{OOB Error}_{\text{permuted}_j} - \text{OOB Error}_{\text{baseline}}" />
            <p>
                For feature j: compute OOB accuracy, then randomly shuffle feature j values across OOB examples and recompute. The increase is feature j's importance. Features with FI near 0 are irrelevant; high FI features are critical. This is a model-agnostic importance measure — it measures the actual predictive contribution, not a proxy like split gain.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Bridge to Chapter 9:</strong> Random Forests (2001) reached their performance ceiling around 2006 — the same year Hinton published the deep belief network paper that restarted the neural network clock. The two approaches found different niches: Random Forests excel on tabular data with mixed feature types; deep networks excel on raw images, audio, and text. The decade 2001–2012 was a genuine competition. Chapter 9 tells how deep learning broke through — and why Random Forests did not disappear but retreated to their stronghold, where they remain dominant today.
            </div>

            <DefBlock label="Key Hyperparameters">
                B (n_estimators): more trees = lower variance; diminishing returns after ~200; never hurts, only costs time<br /><br />
                m (max_features): sqrt(p) for classification, p/3 for regression (Breiman's defaults); lower m = more diverse trees = lower correlation rho<br /><br />
                max_depth: None (fully grown) by default; shallower trees = lower variance per tree but higher correlation; rarely tuned<br /><br />
                min_samples_leaf: prevents splits on very small leaf nodes; controls bias-variance tradeoff
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

export const RANDOM_FORESTS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
