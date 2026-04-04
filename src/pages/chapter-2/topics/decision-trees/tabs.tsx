import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { TreeDiagram, EnsembleDiagram } from "./diagrams"
import type { TabId } from "../../types"

function HistoryTab() {
    const items = [
        {
            year: "1963",
            title: "CHAID — The First Decision Tree",
            challenge: "Social scientists needed a way to automatically discover which survey questions best split respondents into distinct groups — without requiring them to pre-specify interaction effects or test every possible combination of variables.",
            what: "James Morgan and Gordon Sonquist at the University of Michigan developed CHAID (Chi-squared Automatic Interaction Detection), which used chi-squared tests to recursively partition data into homogeneous subgroups based on categorical predictors.",
            impact: "CHAID was the first algorithm to demonstrate that machines could discover decision rules automatically from data — a direct precursor to modern decision tree algorithms like CART and C4.5.",
        },
        {
            year: "1984",
            title: "CART — Classification and Regression Trees",
            challenge: "Existing statistical methods required either strict parametric assumptions (normality, linearity) or were computationally intractable on large datasets. Practitioners needed a flexible, assumption-free method that handled both classification and regression.",
            what: "Breiman, Friedman, Olshen, and Stone published CART — a unified algorithm that recursively splits data using the feature and threshold that minimises impurity (Gini for classification, MSE for regression). CART introduced the full binary tree structure, cross-validation for tree pruning, and the bias-variance analysis of tree complexity.",
            impact: "CART became one of the most widely used classifiers in practice. Its recursive partitioning idea directly inspired ensemble methods — Random Forests and Gradient Boosting both build on CART as their base learner.",
        },
        {
            year: "1986",
            title: "C4.5 — Information Gain and Continuous Features",
            challenge: "CHAID was limited to categorical features and required pre-pruning. CART could handle continuous features but used a greedy split-finding strategy that wasn't theoretically optimal for classification tasks.",
            what: "Ross Quinlan extended his earlier ID3 algorithm to create C4.5, introducing: normalised information gain ratio to prevent bias toward high-cardinality features; handling of continuous features by testing all split thresholds; handling of missing values; and post-pruning using a pessimistic error estimate.",
            impact: "C4.5 became the dominant algorithm in expert systems and medical diagnosis because its decision rules were directly interpretable — a doctor could read the tree and understand exactly why a patient was classified as high-risk.",
        },
        {
            year: "1995",
            title: "Random Forests — Bagging + Feature Randomness",
            challenge: "Decision trees have high variance — small changes in training data can produce very different trees. Ensembling methods (boosting) existed but were slow and required careful tuning.",
            what: "Leo Breiman proposed Random Forests: grow many independent CART trees on bootstrap samples, and at each split only consider a random subset of features (typically √p). Averaging predictions dramatically reduces variance while preserving the interpretability of individual trees.",
            impact: "Random Forests were the dominant method in ML competitions for over a decade (2000–2015). They require almost no tuning, handle missing data gracefully, and provide built-in out-of-bag error estimation. They remain a strong baseline today.",
        },
        {
            year: "2001",
            title: "Gradient Boosted Trees — Friedman",
            challenge: "Boosting (AdaBoost) had been shown to work empirically but lacked a clear optimisation interpretation. It was also sensitive to noisy labels in regression tasks.",
            what: "Jerome Friedman reformulated boosting as gradient descent in function space: each new tree fits the negative gradient (pseudo-residuals) of the loss function. This unified AdaBoost, LogitBoost, and regression boosting into a single framework — Gradient Boosting Machines (GBM).",
            impact: "GBM became the foundation for XGBoost, LightGBM, and CatBoost — the winningest algorithms in structured/tabular data competitions. On Kaggle, gradient boosted trees consistently beat neural networks on tabular data until recently.",
        },
    ]

    return (
        <div className="ch2-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch2-tl-item">
                    <div className="ch2-tl-year">{item.year}</div>
                    <div className="ch2-tl-title">{item.title}</div>
                    <div className="ch2-tl-section-label">The challenge</div>
                    <div className="ch2-tl-body">{item.challenge}</div>
                    <div className="ch2-tl-section-label">What was introduced</div>
                    <div className="ch2-tl-body">{item.what}</div>
                    <div className="ch2-tl-section-label">Why it mattered</div>
                    <div className="ch2-tl-body ch2-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Asking yes/no questions to sort things out</h2>

            <Analogy label="How a decision tree works">
                Imagine you want to guess whether a stranger likes a new movie. Instead of asking everything at once, you ask one question, then based on the answer, ask another, and another — each question narrowing down the answer. A <strong>decision tree</strong> is exactly this: a flowchart of questions.
            </Analogy>

            <Analogy label="The best question first">
                The key question is: which question should you ask first? You want the question that splits your group into the most <em>decisive</em> subgroups — where each group is as "pure" as possible (everyone in the group likes the movie, or everyone dislikes it).
                <br /><br />
                Think of sorting socks: if you start with "is it white?" you might still have a mixed pile. But "is it made of cotton?" might split into pure piles faster. The tree algorithm tries every possible question and picks the one that creates the purest subgroups.
            </Analogy>

            <DiagramBlock title="Decision tree — each node asks one question, splits into two branches">
                <TreeDiagram />
            </DiagramBlock>

            <Analogy label="How to measure 'purity' — Gini impurity">
                Gini impurity is a number between 0 and 0.5 that says how "mixed" a group is. If everyone in the group likes the movie (100% yes), the Gini is 0 — perfectly pure. If it's half yes and half no, Gini is 0.25 — maximally impure for a two-class problem.
                <br /><br />
                A good split makes both child groups purer than the parent. The <strong>information gain</strong> = parent's Gini − weighted average of children's Gini. We pick the split that maximises this.
            </Analogy>

            <Analogy label="When to stop — pruning">
                If you keep asking questions until every person is alone, you have a tree with 100% accuracy on the training data — but it'll be useless for new people (overfitting). You stop when: the group is small enough, or further splits wouldn't really help.
                <br /><br />
                <strong>Pruning</strong> is like going back and removing questions that weren't useful, to get a simpler tree that still works well.
            </Analogy>

            <Analogy label="Why ensemble of trees is better">
                One decision tree is like one person's opinion. A <strong>Random Forest</strong> asks 500 different people to each build their own slightly different tree (using different random subsets of questions), then votes. The crowd is smarter than any individual.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Recursive partitioning for classification and regression</h2>

            <p>
                A decision tree partitions the feature space into K disjoint regions R₁, …, R_K. For classification, the prediction in region R_k is the majority class. For regression, it's the mean of y values in that region.
            </p>

            <h3>Splitting — Gini Impurity</h3>
            <p>
                For a node with class proportions p₁, …, p_K, the <strong>Gini impurity</strong> is:
            </p>
            <MathBlock tex="\text{Gini}(t) = 1 - \sum_{k=1}^K p_k^2" />
            <p>
                After splitting on feature j at threshold s, the weighted Gini of the children is:
            </p>
            <MathBlock tex="\text{Gini}_{\text{split}} = \frac{N_{\text{left}}}{N} \text{Gini}(t_{\text{left}}) + \frac{N_{\text{right}}}{N} \text{Gini}(t_{\text{right}})" />
            <p>
                We choose (j*, s*) that maximises <strong>information gain</strong> = Gini(parent) − Gini_split.
            </p>

            <h3>Entropy and Information Gain</h3>
            <p>
                <strong>Entropy</strong> H(t) = −Σ pₖ log₂(pₖ). Maximum at 0.5/0.5 (pure randomness), minimum at 1.0/0.0 (pure certainty).
            </p>
            <MathBlock tex="\text{IG}(t) = H(t) - \frac{N_{\text{L}}}{N}H(t_{\text{L}}) - \frac{N_{\text{R}}}{N}H(t_{\text{R}})" />
            <p>
                C4.5 uses a <em>gain ratio</em> to prevent bias toward high-cardinality splits: divide IG by the split information. This normalisation factor penalises splits that divide data into many tiny subgroups.
            </p>

            <h3>Tree Pruning</h3>
            <p>
                Growing a full tree always reduces training error — but produces overfit. <strong>Cost-complexity pruning</strong> (CART) minimises:
            </p>
            <MathBlock tex="C_\alpha(T) = \text{Error}(T) + \alpha|T|" />
            <p>
                where |T| is the number of leaves and α is the complexity parameter. Cross-validation picks α to minimise estimated test error.
            </p>

            <h3>Strengths and Weaknesses</h3>
            <ul>
                <li><strong>✓ Interpretable</strong> — rules can be read and verified by domain experts</li>
                <li><strong>✓ Non-linear</strong> — captures interactions automatically (e.g., "age &gt; 30 AND income &lt; 40k")</li>
                <li><strong>✓ No feature scaling</strong> — works directly with raw values and categoricals</li>
                <li><strong>✗ High variance</strong> — small data changes → completely different trees</li>
                <li><strong>✗ Axis-aligned splits</strong> — can't capture diagonal decision boundaries efficiently</li>
                <li><strong>✗ Greedy</strong> — locally optimal splits may not be globally optimal</li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Framework</h2>

            <DefBlock label="Definition — Decision Tree Learner">
                A decision tree T : R^p -&gt; &#123;1,...,K&#125; maps feature vectors to class labels by recursively partitioning the input space. At node t, containing N_t samples, the algorithm selects split (j, s) to minimise:
                <br />
                Q(N_t, j, s) = (N_left/N_t) * Impurity(t_left) + (N_right/N_t) * Impurity(t_right)
                <br />
                where Impurity is Gini, entropy, or misclassification rate.
            </DefBlock>

            <h3>CART Algorithm</h3>
            <p>Grow a binary tree recursively:</p>
            <ol>
                <li>At node t with N_t samples, try all features j and all candidate thresholds s</li>
                <li>Pick (j*, s*) that minimises the weighted impurity of the two child nodes</li>
                <li>Repeat until stopping criteria met (min samples per leaf, max depth, etc.)</li>
                <li>Prune the tree using cost-complexity pruning with cross-validation</li>
            </ol>

            <h3>Connection to Ensemble Methods</h3>
            <p>
                A <strong>Random Forest</strong> builds B trees independently:
            </p>
            <MathBlock tex="\hat{y}_{\text{RF}} = \frac{1}{B} \sum_{b=1}^B T_b(x)" />
            <p>
                The variance of the average of B i.i.d. trees is Var(1/B Σ T_b) = (1/B) Var(T_b). So averaging B trees reduces variance by a factor of B. Random Forests also decorrelate trees by considering only √p random features at each split.
            </p>

            <p>
                <strong>Gradient Boosted Trees</strong> (GBM) fit trees sequentially, each correcting the residual errors of the previous ensemble:
            </p>
            <MathBlock tex="F_m(x) = F_{m-1}(x) + \eta \cdot h_m(x)" />
            <p>
                where h_m is a tree fit to the negative gradient of the loss ℒ(y, F_&#123;m-1&#125;(x)). The learning rate η (shrinkage) prevents each tree from overcorrecting.
            </p>

            <DiagramBlock title="Bagging vs Boosting — parallel vs sequential error correction">
                <EnsembleDiagram />
            </DiagramBlock>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt

# ── Simple dataset: 2D classification ────────────────────────────
np.random.seed(42)
n = 200

# Class 0: centered at (0,0)
X0 = np.random.randn(n, 2) + [-2, -2]
y0 = np.zeros(n)
# Class 1: centered at (2, 2)
X1 = np.random.randn(n, 2) + [2, 2]
y1 = np.ones(n)

X = np.vstack([X0, X1])
y = np.concatenate([y0, y1])

# ── Decision Tree ───────────────────────────────────────────────
dt = DecisionTreeClassifier(max_depth=3, min_samples_leaf=10, random_state=42)
dt.fit(X, y)
print(f"Decision Tree CV accuracy: {cross_val_score(dt, X, y, cv=5).mean():.3f}")

# Visualise (in notebook: plot_tree(dt))
# plot_tree(dt, feature_names=["x1", "x2"], class_names=["class 0", "class 1"])

# ── Random Forest ───────────────────────────────────────────────
rf = RandomForestClassifier(n_estimators=200, max_depth=5, random_state=42)
rf.fit(X, y)
print(f"Random Forest CV accuracy: {cross_val_score(rf, X, y, cv=5).mean():.3f}")

# Feature importance — how much did each feature contribute?
print("Feature importances:", rf.feature_importances_)

# ── Gradient Boosted Trees ──────────────────────────────────────
gbm = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42
)
gbm.fit(X, y)
print(f"GBM CV accuracy: {cross_val_score(gbm, X, y, cv=5).mean():.3f}")

# ── Feature importance comparison ───────────────────────────────
print("\\nFeature importances:")
print(f"  Decision Tree: {dt.feature_importances_}")
print(f"  Random Forest: {rf.feature_importances_}")
print(f"  GBM:           {gbm.feature_importances_}")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="decision_trees.py" lang="python" langLabel="Python" />
            <div className="ch2-callout">
                <strong>Key hyperparameters:</strong> <code>max_depth</code> controls tree complexity (deeper → more overfitting). <code>min_samples_leaf</code> prevents leaves with tiny, unreliable groups. In Random Forests, increase <code>n_estimators</code> until accuracy plateaus; <code>max_features</code> controls tree diversity.
            </div>
        </>
    )
}

const TS_CODE = `// ── Gini Impurity & Best Split (TypeScript) ─────────────────

type Vec = number[];

function giniImpurity(labels: Vec): number {
  const n = labels.length;
  if (n === 0) return 0;
  const counts: Record<number, number> = {};
  for (const l of labels) counts[l] = (counts[l] ?? 0) + 1;
  return 1 - Object.values(counts).reduce(
    (sum, c) => sum + (c / n) ** 2, 0
  );
}

/** Information Gain from splitting labels into left/right */
function infoGain(parent: Vec, left: Vec, right: Vec): number {
  const n = parent.length;
  const gParent = giniImpurity(parent);
  const gLeft   = giniImpurity(left);
  const gRight  = giniImpurity(right);
  return gParent - (left.length / n) * gLeft - (right.length / n) * gRight;
}

/** Find best split for a 1D feature */
function bestSplit(feature: Vec, labels: Vec): { threshold: number; gain: number } {
  const sorted = feature.map((v, i) => [v, labels[i]] as [number, number])
    .sort((a, b) => a[0] - b[0]);

  let best = { threshold: 0, gain: -Infinity };
  const uniqVals = [...new Set(feature)].sort((a, b) => a - b);

  for (let i = 0; i < uniqVals.length - 1; i++) {
    const t = (uniqVals[i] + uniqVals[i + 1]) / 2;
    const left  = sorted.filter(([v]) => v <= t).map(([, l]) => l);
    const right = sorted.filter(([v]) => v >  t).map(([, l]) => l);
    const gain  = infoGain(labels, left, right);
    if (gain > best.gain) best = { threshold: t, gain };
  }
  return best;
}

// ── Demo ──────────────────────────────────────────────────────
const features = [1.2, 1.8, 2.1, 2.5, 3.0, 3.8, 4.1, 4.5, 5.0, 5.5];
const labels   = [0,   0,   0,   0,   1,   1,   1,   1,   1,   1];

const result = bestSplit(features, labels);
console.log(\`Best threshold: x ≤ \${result.threshold.toFixed(2)}\`);
console.log(\`Information gain: \${result.gain.toFixed(4)}\`);
console.log(\`Gini before split: \${giniImpurity(labels).toFixed(4)}\`);
// Best threshold: x ≤ 4.55, Information gain: 0.4800`

function CodeTab() {
    return (
        <>
            <p>
                Gini impurity and information gain are the core splitting criteria used by CART, C4.5, and every decision tree variant. This implementation shows the mechanics — scikit-learn's <code>DecisionTreeClassifier</code> handles multi-dimensional features and recursive tree construction.
            </p>
            <CodeBlock code={TS_CODE} filename="decision-trees.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch2-callout">
                <strong>Next step:</strong> A full recursive tree builder would call <code>bestSplit</code> on every feature, pick the best (feature, threshold) pair, split the data, and recurse on each child. Stop when <code>max_depth</code> is reached, <code>giniImpurity</code> is zero, or <code>n_samples &lt; min_samples_leaf</code>.
            </div>
        </>
    )
}

export const DECISION_TREES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
