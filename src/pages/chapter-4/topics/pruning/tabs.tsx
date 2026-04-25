import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1979–1984",
            title: "The Overfitting Problem — Why Trees Needed Pruning",
            challenge: "ID3 (1979) grew trees until every leaf was pure — until every training example was classified correctly. On paper this sounds ideal. In practice it was catastrophic: a tree grown to purity on 500 training examples with 50 features would easily have 200+ leaves, each containing only 1–2 examples. Such trees achieved 100% training accuracy but failed on test sets because they had memorised noise — random variations in the training sample that would not appear in new data. The problem was not the algorithm; it was the criterion for stopping.",
            what: "The early decision tree community recognised overfitting empirically but had no principled solution. Various ad hoc stopping rules were tried: stop splitting when fewer than 10 examples remain in a node, stop when the information gain falls below a threshold. These worked but required manual tuning for each dataset and had no theoretical justification. What was needed was a principled way to choose tree complexity — not to stop early, but to grow fully and then prune back using generalisation error estimates.",
            impact: "The failure of ad hoc stopping rules to control overfitting created the motivation for the two major pruning methods: CART's cost-complexity pruning (Breiman et al. 1984) and C4.5's pessimistic error pruning (Quinlan 1987). Both emerged from the same empirical observation — that fully-grown trees overfit — but approached the problem from completely different theoretical traditions, producing different algorithmic solutions with different strengths.",
        },
        {
            year: "1984",
            title: "CART — Cost-Complexity Pruning",
            challenge: "Breiman and colleagues needed a pruning method that was (1) principled — derived from a statistical criterion, not a heuristic threshold; (2) data-driven — the complexity of the final tree should be chosen based on the data, not pre-specified; (3) efficient — it should not require re-training the algorithm from scratch for each complexity level. The existing approaches to model selection (AIC, BIC, Mallows' C<sub>p</sub>) required analytical degrees-of-freedom calculations that were intractable for tree models.",
            what: "CART introduced cost-complexity pruning. Grow the full tree T<sub>max</sub>. For each non-leaf internal node t, define the weakest link cost: &alpha;(t) = [R(t) &minus; R(T<sub>t</sub>)] / [|T<sub>t</sub>| &minus; 1] — the increase in training error per leaf eliminated if you replace subtree T<sub>t</sub> with a leaf. Starting from T<sub>max</sub>, iteratively collapse the node with the smallest &alpha;(t). This generates a nested sequence T<sub>max</sub> &supe; T<sub>1</sub> &supe; T<sub>2</sub> &supe; ... &supe; T<sub>root</sub>, parameterised by increasing &alpha;. Use k-fold cross-validation to select the &alpha; with the lowest generalisation error.",
            impact: "Cost-complexity pruning was the first principled regularisation mechanism for decision trees. The sequence of nested subtrees parameterised by &alpha; is structurally identical to the regularisation path in ridge regression (parameterised by &lambda;) or lasso (parameterised by the penalty strength). As &alpha; increases from 0 to &infin;, the tree shrinks from T<sub>max</sub> to a single leaf — a continuous path from memorisation to constant prediction, exactly analogous to regularisation paths in linear models.",
        },
        {
            year: "1987–1993",
            title: "Quinlan — C4.5 Pessimistic Error Pruning",
            challenge: "CART's cross-validation pruning required running the full tree-building algorithm multiple times — once per fold, per candidate &alpha;. For small datasets or time-constrained applications (early 1980s mainframe computing), this was prohibitively expensive. Quinlan needed a single-pass pruning method that used only the training data but still produced realistic out-of-sample error estimates. The challenge: training error is systematically optimistic — the model is evaluated on the same data it was fit to.",
            what: "C4.5 used pessimistic error estimation: for a leaf with N examples and E errors, the naive training error rate is E/N. But this is too optimistic because the tree was fit to exactly this data. Quinlan estimated the true error rate using the upper bound of a binomial confidence interval: E/N + z&radic;(E/N &middot; (1&minus;E/N) / N), where z = 0.69 for the default 25% confidence level. A subtree is collapsed to a leaf if the pessimistic error of the leaf is not significantly worse than the pessimistic error of the subtree. This runs in a single backward pass over the tree.",
            impact: "C4.5's pessimistic pruning was fast and worked well in practice. It also revealed a deep statistical insight: all regularisation methods correct for the optimism bias in training error estimates. When a model is fit to data, training error is systematically too small — it doesn't account for the variance introduced by fitting to a particular sample. Pruning, regularisation, and dropout all correct for this same bias through different mechanisms.",
        },
        {
            year: "1976–1993",
            title: "Reduced Error Pruning — Simplest Correct Approach",
            challenge: "Both cost-complexity pruning and pessimistic error pruning involved subtle statistical arguments. Researchers wanted a simpler baseline: could you just evaluate each potential pruning step directly on a held-out validation set, without any statistical correction? The concern was that validation-set pruning would itself overfit the validation set if performed aggressively.",
            what: "Reduced error pruning (Quinlan 1987, based on earlier work by Maron 1965 and others): hold out a validation set (typically 20–30% of training data). Grow the full tree on the remaining data. Traverse the tree bottom-up. For each internal node t, if replacing subtree T<sub>t</sub> with a leaf (labelled with the majority class) does not increase validation error, make the replacement. Repeat until no further improvement is possible. The final tree is the smallest tree that achieves the best validation accuracy.",
            impact: "Reduced error pruning is the simplest correct approach and produces competitive results compared to more complex methods. It also directly demonstrates the fundamental principle: model selection should be based on held-out data, not training data. This principle — that model selection and training are separate concerns requiring separate data — underlies train/validation/test splitting, k-fold cross-validation, and early stopping in neural networks. All of these are instantiations of the same idea that decision tree pruning demonstrated in the 1970s.",
        },
        {
            year: "1990s–2000s",
            title: "Minimum Description Length — Pruning as Data Compression",
            challenge: "Both cross-validation and pessimistic error estimate approaches evaluated trees by their prediction accuracy. But a tree is both a model and a code — it can be used to compress a dataset by replacing labels with decision paths. Researchers asked: is there a more fundamental criterion for tree complexity than prediction accuracy — one grounded in information theory rather than statistical estimation?",
            what: "The Minimum Description Length (MDL) principle (Rissanen 1978, applied to trees by Quinlan and Rivest 1989) formalises Occam's Razor information-theoretically: the best model minimises the total description length of (1) the model itself and (2) the data given the model. A tree's description length = code length of the tree structure + code length of the mislabelled examples. Pruning a subtree reduces the model complexity cost but increases the mislabelling cost. The MDL-optimal tree balances these.",
            impact: "MDL pruning provided an information-theoretic grounding for the bias-variance tradeoff. It connected decision tree regularisation to Kolmogorov complexity and the broader theory of statistical learning. The MDL principle also influenced Bayesian model selection (the marginal likelihood penalises model complexity similarly), and the concept of model description length influenced the development of structural risk minimisation in Support Vector Machines (Ch. 11). The framework that pruning established — balancing fit against complexity — is the universal template for regularisation.",
        },
        {
            year: "1994–2001",
            title: "Ensemble Methods as the Alternative to Pruning",
            challenge: "By the early 1990s, practitioners had three well-tested pruning methods (cost-complexity, pessimistic error, reduced error) but still found individual pruned trees fragile — their accuracy varied substantially with the particular training sample. Pruning reduced variance compared to full trees, but not enough for competitive prediction accuracy. The question: was there a fundamentally different way to control variance in decision trees, without the complexity of pruning algorithms?",
            what: "Breiman's bagging (1994) provided the answer: instead of pruning one tree, grow many full (unpruned) trees, each on a bootstrap resample, and average predictions. Random Forests (2001) extended this with random feature subsets at each split. The variance of the individual trees was not reduced — each tree was still high-variance — but the variance of the ensemble prediction decreased as 1/B for uncorrelated trees, where B is the number of trees. No pruning was required because the aggregation step controlled variance.",
            impact: "Ensemble methods replaced pruning as the primary variance-control tool for decision trees in practice. However, the theoretical framework developed for pruning — bias-variance decomposition, regularisation paths, optimism correction — directly informed the design of regularisation in neural networks. Dropout (2014) is equivalent to averaging over 2<sup>n</sup> neural network submodels, exactly as Random Forests average over pruned subtrees. Weight decay in neural networks is structurally identical to ridge regression and cost-complexity pruning. The principles discovered in the decision tree pruning era re-appear in every generation of ML algorithms.",
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
            <h2>The art of knowing when to stop asking questions</h2>

            <Analogy label="The overfit tree">
                Imagine a game show contestant who memorised every question and answer from the last 10 seasons of the show. They score 100% on reruns — but fail completely on new episodes. A decision tree that grows until every leaf contains exactly one training example does the same thing: perfect on the training data, useless on anything new. This is called <strong>overfitting</strong> — the model has learned the noise, not the signal.
            </Analogy>

            <Analogy label="Pruning — cutting back to what matters">
                Imagine you grew a huge tree in your garden, then went back and cut off every branch that wasn't producing fruit — the dead wood, the weak branches, the ones that barely contributed. You keep the main structure that captures the real pattern but remove the noise.
                <br /><br />
                Decision tree pruning works the same way: grow the full tree until every leaf is pure, then remove branches that add complexity without meaningfully improving accuracy on <em>new</em> data. The key phrase is "new data" — pruning is always evaluated on examples the tree hasn't seen during training.
            </Analogy>

            <Analogy label="Cost-complexity pruning — the best trade-off">
                CART's pruning asks: for each internal node in the tree, "If I removed this entire branch and replaced it with a single leaf, how much training accuracy would I lose — and how many leaves would I eliminate?"
                <br /><br />
                Remove the branch with the best trade-off: the one that costs the least accuracy per leaf removed. Repeat this process until you have just one leaf. This gives you a family of trees, from very detailed to very simple. Then use held-out data (cross-validation) to pick the tree from this family that generalises best.
            </Analogy>

            <Analogy label="Cross-validation — trying different levels of pruning">
                To choose the right amount of pruning, use cross-validation: hide 20% of your training examples, train on the remaining 80%, test on the hidden 20%. Do this 5 times with different hidden sets. The tree complexity that gets the best average score on the hidden examples — not the training examples — is the right amount of pruning.
                <br /><br />
                This is exactly how modern ML practitioners choose hyperparameters: never evaluate on the training set, always on held-out validation data. Pruning introduced this principle to decision trees in 1984.
            </Analogy>

            <Analogy label="The deeper lesson — complexity is the enemy">
                Pruning taught ML researchers a fundamental principle: the simplest model that fits the data well is almost always the best model for prediction. This principle — Occam's Razor applied to statistics — appears everywhere in modern ML:
                <br /><br />
                Ridge and Lasso regularisation penalise large weights in linear models. Dropout randomly removes neurons during neural network training. Early stopping halts training before the network memorises noise. L2 weight decay prevents weights from growing too large. All of these are different implementations of the same idea that pruning demonstrated for decision trees in 1984: control complexity, control variance, control overfitting.
            </Analogy>

            <Analogy label="What comes next — teaching neurons to learn">
                Decision trees ask one question at a time and follow rigid if-then rules. They can only draw axis-aligned boundaries in the data — straight lines parallel to the feature axes. The same year CART was published, a team at UCSD and Toronto was working on something fundamentally different: networks of artificial neurons that learn by flowing error signals backwards through layers of computation. That 1986 paper on backpropagation marks the beginning of Chapter 5 — and the start of the path that leads, 40 years later, to large language models.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Regularisation for trees — cost-complexity pruning</h2>

            <h3>Why Fully-Grown Trees Overfit</h3>
            <p>
                A fully grown tree T<sub>max</sub> achieves zero training error (if no two training examples share identical features but different labels). But its test error is high — it has memorised the noise in the training sample. A tree with n leaves can classify any dataset with n distinct feature vectors perfectly, regardless of whether those classifications generalise to new data.
            </p>

            <h3>The Cost-Complexity Objective (CART)</h3>
            <p>
                Define the regularised error for a tree T with complexity parameter &alpha; &ge; 0:
            </p>
            <MathBlock tex="R_\alpha(T) = R(T) + \alpha \cdot |T|" />
            <p>
                where R(T) is the training error rate and |T| is the number of leaves. This penalises the tree for having many leaves — more leaves = more complexity. For any value of &alpha;, the optimal tree T*(&alpha;) = argmin R<sub>&alpha;</sub>(T). As &alpha; increases from 0 to &infin;, T*(&alpha;) traces a path from T<sub>max</sub> to a single leaf.
            </p>

            <h3>The Weakest Link — Finding the Pruning Path Efficiently</h3>
            <p>
                At each pruning step, find the internal node t whose subtree, when collapsed to a leaf, causes the minimum increase in error per leaf removed:
            </p>
            <MathBlock tex="\alpha^*(t) = \frac{R(t) - R(T_t)}{|T_t| - 1}" />
            <p>
                where R(t) is the error of a leaf replacing the subtree, and R(T<sub>t</sub>) is the error of the full subtree T<sub>t</sub>. Collapse node t when &alpha; reaches &alpha;*(t). This generates the complete sequence T<sub>max</sub> &supe; T<sub>1</sub> &supe; ... &supe; T<sub>root</sub> in O(|T<sub>max</sub>|<sup>2</sup>) time — no re-training required.
            </p>

            <h3>C4.5 Pessimistic Error Estimate</h3>
            <p>
                For a leaf with N examples and E errors, the binomial confidence upper bound on the true error rate (at confidence level z):
            </p>
            <MathBlock tex="\hat{e}_{\text{upper}} = \frac{E + z^2/2 + z\sqrt{E - E^2/N + z^2/4}}{N + z^2}" />
            <p>
                C4.5 uses z = 0.69 (25% confidence level). A subtree is pruned if the pessimistic error of the collapsed leaf is no worse than the pessimistic error of the subtree. This runs in a single backward pass — no cross-validation required.
            </p>

            <h3>Selecting the Right Tree via Cross-Validation</h3>
            <p>
                Evaluate each tree T*(&alpha;<sub>k</sub>) from the pruning sequence using k-fold cross-validation. Select the &alpha; with the lowest cross-validation error. A conservative alternative — the <strong>1-SE rule</strong> (Breiman et al. 1984): choose the largest (most complex) tree whose cross-validation error is within one standard error of the minimum. This systematically selects simpler models when they are not significantly worse than the best.
            </p>

            <hr className="ch-sep" />

            <DefBlock label="Pruning vs Regularisation — the Deep Connection">
                Cost-complexity pruning with parameter &alpha; is structurally identical to L2 regularisation with parameter &lambda;:
                <br /><br />
                Decision tree: min R(T) + &alpha;&middot;|T| — penalises number of leaves<br />
                Ridge regression: min &Vert;y &minus; X&beta;&Vert;<sup>2</sup> + &lambda;&Vert;&beta;&Vert;<sup>2</sup> — penalises coefficient magnitude<br />
                Lasso: min &Vert;y &minus; X&beta;&Vert;<sup>2</sup> + &lambda;&Vert;&beta;&Vert;<sub>1</sub> — penalises number of non-zero coefficients (analogous to |T|)<br />
                Neural dropout: randomly zero out activations at rate p — penalises co-activation<br /><br />
                All control model complexity by adding a term that penalises the model for being "too large", with a tunable strength chosen by cross-validation.
            </DefBlock>

            <div className="ch-callout">
                <strong>Chapter 4 complete.</strong> Decision trees gave machine learning its first interpretable supervised learning algorithm (ID3, 1979), its first statistically rigorous formulation (CART, 1984), and its first explicit connection between regularisation and generalisation (pruning, 1984). The three core ideas — entropy/Gini as splitting criteria, binary recursive partitioning, cost-complexity regularisation — reappear in every generation of ML algorithms that followed. Chapter 5 introduces the next paradigm: instead of asking yes/no questions, learn a smooth non-linear function by propagating error gradients backwards through layers of connected units. That algorithm — backpropagation — was published in 1986, two years after CART.
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
                    <span className="ch-expandable-desc">Cost-complexity pruning · cross-validation</span>
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
            <h2>Cost-Complexity Pruning — Formal Derivation</h2>

            <DefBlock label="Regularisation Path for Decision Trees">
                Define the cost-complexity measure: R<sub>&alpha;</sub>(T) = R(T) + &alpha;&middot;|T|. For any &alpha;, there exists a unique smallest subtree T*(&alpha;) &sube; T<sub>max</sub> minimising R<sub>&alpha;</sub>. As &alpha; increases monotonically, T*(&alpha;) decreases through a nested sequence:
                <br /><br />
                T<sub>max</sub> = T*(&alpha;<sub>0</sub>) &supe; T*(&alpha;<sub>1</sub>) &supe; ... &supe; T*(&alpha;<sub>M</sub>) = &#123;root&#125;
                <br /><br />
                This regularisation path is the tree-model analogue of the ridge regression path parameterised by &lambda;, or the lasso path parameterised by the penalty strength.
            </DefBlock>

            <h3>Weakest Link Pruning Algorithm</h3>
            <p>
                <strong>Theorem (Breiman et al. 1984):</strong> For any internal node t of T<sub>max</sub>, define:
            </p>
            <MathBlock tex="\tilde{\alpha}(t) = \frac{R(t) - R(T_t)}{|T_t| - 1}" />
            <p>
                The transition point &alpha;<sub>k+1</sub> = min<sub>t</sub> &tilde;&alpha;(t) is the smallest &alpha; at which it becomes beneficial to prune subtree T<sub>t</sub> from T*(&alpha;<sub>k</sub>). Collapsing the minimising node generates T*(&alpha;<sub>k+1</sub>). This can be computed without re-evaluating the full tree at each step — only the &tilde;&alpha; values of affected ancestor nodes need updating.
            </p>

            <h3>Bias-Variance Decomposition Along the Path</h3>
            <p>
                For a fixed input x, the expected test MSE of the tree T*(&alpha;) decomposes:
            </p>
            <MathBlock tex="\mathbb{E}[(y - \hat{f}_{T^*(\alpha)}(x))^2] = \text{Bias}^2(\hat{f}) + \text{Var}(\hat{f}) + \sigma^2" />
            <p>
                As &alpha; &rarr; 0: T*(&alpha;) &rarr; T<sub>max</sub>, Bias &rarr; 0, Var &rarr; large.<br />
                As &alpha; &rarr; &infin;: T*(&alpha;) &rarr; root leaf, Bias &rarr; large, Var &rarr; 0.<br />
                The optimal &alpha;* minimises the sum Bias<sup>2</sup> + Var, achieved when the marginal reduction in squared bias from one more split equals the marginal increase in variance.
            </p>

            <h3>MDL Interpretation — Pruning as Compression</h3>
            <p>
                Under the Minimum Description Length principle, the optimal model minimises:
            </p>
            <MathBlock tex="L(T, \mathcal{D}) = L(T) + L(\mathcal{D} \mid T)" />
            <p>
                where L(T) is the description length of the tree structure (in bits) and L(&Dscr;|T) is the description length of the mislabelled training examples given the tree. Rissanen (1978) showed this is equivalent to the cost-complexity objective with &alpha; = log<sub>2</sub>(n) / (2n) — the same scaling as the BIC penalty in GMM model selection. Pruning and BIC are two instances of the same information-theoretic principle.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score

# ── Data ───────────────────────────────────────────────────────────
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Full tree — expected to overfit ───────────────────────────────
full_tree = DecisionTreeClassifier(random_state=42)
full_tree.fit(X_train, y_train)
print(f"Full tree: depth={full_tree.get_depth()}, leaves={full_tree.get_n_leaves()}")
print(f"  Train acc: {full_tree.score(X_train, y_train):.3f}")
print(f"  Test acc:  {full_tree.score(X_test, y_test):.3f}")

# ── Cost-complexity pruning path ───────────────────────────────────
# cost_complexity_pruning_path returns all alpha values and
# the corresponding training impurities along the pruning path
path = full_tree.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas  = path.ccp_alphas[:-1]   # drop the last (root) alpha
impurities  = path.impurities[:-1]

print(f"\\nPruning path: {len(ccp_alphas)} candidate alpha values")
print(f"  Alpha range: {ccp_alphas.min():.6f} — {ccp_alphas.max():.4f}")

# ── Evaluate each tree along the path via cross-validation ────────
cv_scores, train_scores = [], []

for alpha in ccp_alphas:
    dt = DecisionTreeClassifier(ccp_alpha=alpha, random_state=42)
    # 5-fold CV on training data to estimate generalisation error
    cv = cross_val_score(dt, X_train, y_train, cv=5, scoring="accuracy")
    cv_scores.append(cv.mean())
    dt.fit(X_train, y_train)
    train_scores.append(dt.score(X_train, y_train))

# Best alpha by CV accuracy
best_alpha = ccp_alphas[np.argmax(cv_scores)]
print(f"\\nBest alpha by 5-fold CV: {best_alpha:.6f}")
print(f"Best CV accuracy:         {max(cv_scores):.3f}")

# ── Fit and evaluate the pruned tree ──────────────────────────────
pruned_tree = DecisionTreeClassifier(ccp_alpha=best_alpha, random_state=42)
pruned_tree.fit(X_train, y_train)
print(f"\\nPruned tree: depth={pruned_tree.get_depth()}, leaves={pruned_tree.get_n_leaves()}")
print(f"  Train acc: {pruned_tree.score(X_train, y_train):.3f}")
print(f"  Test acc:  {pruned_tree.score(X_test, y_test):.3f}")

# ── 1-SE rule — choose simplest tree within 1 std error of best ───
cv_means = np.array(cv_scores)
cv_stds  = []
for alpha in ccp_alphas:
    dt = DecisionTreeClassifier(ccp_alpha=alpha, random_state=42)
    cv = cross_val_score(dt, X_train, y_train, cv=5, scoring="accuracy")
    cv_stds.append(cv.std())

best_idx = np.argmax(cv_means)
threshold = cv_means[best_idx] - cv_stds[best_idx]
# Largest alpha (simplest tree) with mean >= threshold
valid = np.where(cv_means >= threshold)[0]
se1_idx = valid[-1]   # largest alpha index in valid set
se1_alpha = ccp_alphas[se1_idx]

se1_tree = DecisionTreeClassifier(ccp_alpha=se1_alpha, random_state=42)
se1_tree.fit(X_train, y_train)
print(f"\\n1-SE rule tree: depth={se1_tree.get_depth()}, leaves={se1_tree.get_n_leaves()}")
print(f"  Test acc: {se1_tree.score(X_test, y_test):.3f}")`

function PythonContent() {
    return (
        <>
            <p>
                The code walks through the full CART cost-complexity pruning workflow: computing the pruning path, evaluating each candidate &alpha; via 5-fold cross-validation, and selecting both the best-accuracy tree and the 1-SE rule (simplest tree within one standard error of the best).
            </p>
            <CodeBlock code={PY_CODE} filename="pruning.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The pruned tree usually has similar or better test accuracy than the full tree, despite being much smaller. <code>ccp_alpha=0</code> gives the full unpruned tree; increasing &alpha; removes subtrees one by one. The 1-SE rule is the standard recommendation — it picks the simplest model not significantly worse than the best, favouring interpretability without sacrificing accuracy. For most real datasets, the pruned tree will have 5–20 leaves vs. 50–200 for the full tree.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const PRUNING_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
