import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1948",
            title: "Shannon — Entropy as the Measure of Uncertainty",
            challenge: "Shannon's 1948 paper defined entropy H(X) = &minus;&sum; p(x) log<sub>2</sub> p(x) to measure how much information a random variable carries — a concept from communication theory. No one had connected it to the problem of learning decision rules from labeled data. The connection was implicit in the mathematics — information gain obviously reduces uncertainty — but it took Quinlan's 1979 ID3 to make the connection explicit, algorithmic, and experimentally validated.",
            what: "Shannon's entropy has a direct interpretation for a labelled dataset: H(S) measures the expected number of bits needed to describe the class label of a randomly chosen example from S. A pure set (all examples the same class) has H = 0 — no information is needed to describe a label we already know. A perfectly balanced two-class set has H = 1 bit. Quinlan's information gain IG(S, A) = H(S) &minus; &sum;<sub>v</sub> (|S<sub>v</sub>|/|S|)H(S<sub>v</sub>) is the reduction in expected description length achieved by learning attribute A — exactly the concept of a 'useful question' formalised.",
            impact: "The ID3 information-gain criterion made the connection between Shannon's communication theory and supervised learning explicit for the first time. Learning a decision tree is equivalent to building a compression code: a good tree compresses the label description by asking questions that maximally reduce uncertainty. This is precisely why cross-entropy — Shannon's H(p, q) — is the loss function for every classification neural network trained today, 75 years after Shannon's paper.",
        },
        {
            year: "1912",
            title: "Corrado Gini — Measuring Inequality",
            challenge: "Corrado Gini, an Italian statistician working on income inequality, needed a measure of how unequally a resource (income) was distributed across a population. The existing measures — range, variance — were either scale-dependent or gave too much weight to extreme values. He wanted a measure that was intuitive (expressible as a probability), bounded between 0 and 1, and zero only when income was completely equal.",
            what: "Gini introduced his coefficient in 1912 as the mean absolute difference between all pairs of incomes, normalised by twice the mean income. For a categorical distribution over K classes with proportions p<sub>1</sub>, ..., p<sub>K</sub>, the Gini impurity (its adaptation for classification) is 1 &minus; &sum;<sub>k</sub> p<sub>k</sub><sup>2</sup> — the probability that two randomly selected examples belong to different classes. Corrado Gini had no idea this formula would end up in every decision tree algorithm 70 years later.",
            impact: "The Gini coefficient became the standard measure of income inequality worldwide — it is computed annually for every country by the World Bank and UNDP. Its adaptation as Gini impurity for classification by Breiman et al. (1984) was a natural extension: both measure heterogeneity. The CART algorithm's default use of Gini impurity made it computationally faster than entropy-based ID3 (no logarithms needed) and eventually the dominant splitting criterion in production ML systems.",
        },
        {
            year: "1984–1986",
            title: "CART vs C4.5 — A Natural Experiment in Splitting Criteria",
            challenge: "CART (1984) used Gini impurity with strictly binary splits. C4.5 (1986) used entropy with multi-way splits and gain ratio normalisation. Both were developed independently, both achieved excellent empirical results, and both became heavily used in the following decade. The ML community had an accidental natural experiment: two well-implemented algorithms, nearly identical in structure, differing primarily in their impurity criterion and branching strategy.",
            what: "Systematic empirical comparisons by Raileanu and Stoffel (2004) and others showed: (1) Gini and entropy produce the same winning split in approximately 97.3% of cases on benchmark datasets; (2) binary vs multi-way splits is far more impactful than the impurity criterion — multi-way splits can produce more interpretable trees but are more prone to data fragmentation in small samples; (3) gain ratio normalisation matters when features differ greatly in cardinality; (4) cross-validation for pruning threshold (CART) is more reliable than pessimistic error estimates (C4.5). These findings became standard ML folklore.",
            impact: "The CART vs C4.5 comparison taught the field a crucial meta-lesson: the impurity criterion is secondary; the regularisation mechanism (pruning, gain ratio, depth limits) is primary. This principle — that the choice of loss function matters less than the choice of regularisation — later reappeared in neural networks as the observation that SGD noise acts as implicit regularisation regardless of whether the loss is cross-entropy or MSE. The regularisation mechanism matters more than the loss.",
        },
        {
            year: "1990s–2000s",
            title: "Cross-Entropy Loss — Entropy Meets Neural Networks",
            challenge: "As neural networks re-emerged after backpropagation (1986), researchers needed a principled loss function for classification problems. Mean squared error (MSE) on one-hot labels was the obvious choice — it was already used for regression. But MSE had poor gradient properties for classification: the gradient of MSE w.r.t. the logits was small when predictions were confidently wrong (where learning should be fastest), leading to slow convergence. A better loss function was needed.",
            what: "Cross-entropy loss H(y, &hat;p) = &minus;&sum;<sub>k</sub> y<sub>k</sub> log &hat;p<sub>k</sub> was adopted as the standard classification loss. Combined with a softmax output layer, it gives a clean gradient: &part;L/&part;z<sub>k</sub> = &hat;p<sub>k</sub> &minus; y<sub>k</sub> — the prediction error — which is large when wrong and small when right. This is exactly the desirable gradient behaviour for fast learning. Cross-entropy is Shannon entropy applied to the divergence between the predicted and true distributions.",
            impact: "Cross-entropy loss is now universal for classification in deep learning — every neural network classifier from LeNet to GPT-4 is trained with it. The connection to ID3 is direct: minimising cross-entropy loss is equivalent to minimising the entropy of the label distribution at each training example. Shannon entropy designed as information theory in 1948, adapted for decision trees in 1979, and adopted as neural network loss in the late 1980s, is the single most influential formula in modern ML.",
        },
        {
            year: "2004",
            title: "Raileanu &amp; Stoffel — Systematic Comparison of Gini and Entropy",
            challenge: "After two decades of competing use, the ML community lacked a systematic, large-scale empirical comparison of Gini and entropy as splitting criteria. Practitioners debated which was better based on anecdote and tradition. A definitive empirical study on a large, diverse benchmark suite was needed to settle the debate — or at least characterise when the two criteria diverged.",
            what: "Raileanu and Stoffel's 2004 paper 'Theoretical comparison between the Gini Index and Information Gain criteria' analysed the two criteria theoretically (showing they are equivalent up to monotone transformations in most cases) and empirically (testing on 32 benchmark datasets from the UCI repository). Their key finding: agreement on the winning split in 97.3% of nodes across all datasets. Disagreements were concentrated at nodes with very unequal class distributions (one class below 5%).",
            impact: "The paper effectively settled the Gini vs entropy debate for practical purposes: the choice between them is negligible, and practitioners should focus on regularisation (depth limits, min_samples_leaf, pruning) rather than impurity criterion. This finding has been replicated many times since. The paper is cited whenever practitioners ask which criterion to use — the answer is now definitively: it almost never matters. What matters is regularisation.",
        },
        {
            year: "Present",
            title: "Entropy's Continued Relevance — KL Divergence and Beyond",
            challenge: "As ML moved beyond decision trees into probabilistic models, Bayesian methods, and information-theoretic learning frameworks, the question arose whether the entropy and Gini framework from decision trees had any relevance to the broader ML landscape, or whether it was a historical curiosity specific to tree algorithms.",
            what: "Shannon entropy is now ubiquitous across all ML paradigms. KL divergence KL(P||Q) = &sum; P(x) log(P(x)/Q(x)) = H(P, Q) &minus; H(P) measures the information lost when Q is used to approximate P — the fundamental measure of model quality in variational inference, VAEs, and language model perplexity. Mutual information I(X;Y) = H(X) &minus; H(X|Y) = ID3's information gain, applied to feature selection in modern neural networks (MINE, InfoNCE). Maximum entropy distributions (Boltzmann, softmax) emerge from Shannon's principle that, given constraints, the maximum-entropy distribution is the least-biased choice.",
            impact: "Shannon entropy is the fundamental currency of information in ML. Every impurity measure for trees (Gini, entropy, misclassification rate) is a measure of heterogeneity. Every loss function for classification is a measure of distributional divergence. Every regulariser penalises model complexity, which is measured by information. ID3's 1979 application of entropy to supervised learning was the first bridge — but entropy now underlies everything from generative model training to neural architecture search.",
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
            <h2>Two ways to measure mess — and why they almost always agree</h2>

            <Analogy label="What are we actually measuring?">
                Before asking any question, the training data is a mixed pile of examples. We want to split this pile into two sub-piles that are each more organised — more pure. A splitting criterion is a number measuring how "messy" or "pure" a pile is. The lower the number after a split, the better the question was.
                <br /><br />
                Two different teams independently invented two different numbers for this: Quinlan's AI team used <strong>entropy</strong>. Breiman's statistics team used <strong>Gini impurity</strong>. Both measure the same thing — how mixed a pile is — using different formulas with different mathematical origins.
            </Analogy>

            <Analogy label="Entropy — measuring surprise">
                Entropy asks: if I pick a random example from this pile and you have to guess its label, how much information do you need?
                <br /><br />
                Pure pile (all cats): you already know the answer — zero surprise, zero bits needed. 50/50 cats and dogs: you need 1 full bit to decide between two equally likely options. Maximum entropy for 2 classes.
                <br /><br />
                The formula comes directly from Shannon's 1948 information theory: H = &minus;&sum; p log<sub>2</sub>(p). Shannon invented it to measure the information in a telegraph signal. Quinlan applied it to measure the uncertainty in a dataset's labels.
            </Analogy>

            <Analogy label="Gini impurity — measuring disagreement">
                Gini asks: if I randomly pick two examples from this pile, how likely are they to have different labels?
                <br /><br />
                Pure pile (all cats): always the same — Gini = 0. 50/50 cats and dogs: half the time you'll pick one of each — Gini = 0.5. Maximum disagreement.
                <br /><br />
                Simpler to compute (no logarithms), tells a cleaner story: how often would random labelling disagree with itself? Corrado Gini invented this formula in 1912 to measure income inequality — the probability that two randomly chosen people have different income levels.
            </Analogy>

            <Analogy label="Why they almost always agree">
                Both entropy and Gini are largest at 50/50 and zero at pure. Both are symmetric, bowl-shaped curves that produce the same ranking of split candidates in 97% of real-world cases. When you're searching for the best split — evaluating thousands of possible thresholds — both measures produce virtually identical rankings.
                <br /><br />
                The rare disagreements happen when one class is extremely rare (1% vs 99%). In those cases, entropy is slightly more sensitive to small purity improvements, while Gini is slightly less sensitive. The practical difference in final tree accuracy is almost always less than 0.1%.
            </Analogy>

            <Analogy label="The misclassification rate — the third option">
                There's actually a third impurity measure: the misclassification rate. If a node is 90% cats and 10% dogs, and you predict "cat" for every example in the node, you'd be wrong 10% of the time. That 10% is the misclassification rate.
                <br /><br />
                It's the most intuitive measure — but it's rarely used for splitting. Why? It's too flat near pure nodes — it doesn't distinguish between a node that's 98% cats and one that's 90% cats, even though the first is much better. Both entropy and Gini are more sensitive to purity near the extremes, making them better guides for the splitting search.
            </Analogy>

            <Analogy label="The real question — how much to split">
                Both Gini and entropy tell you the best split at each node. But they don't tell you when to stop splitting. A tree that splits until every leaf has exactly one training example will have Gini = 0 everywhere — but terrible predictions on new data. That problem of knowing when to stop — the bias-variance tradeoff — is the subject of our next topic: pruning.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Entropy, Gini, and the information-theoretic basis of splitting</h2>

            <h3>Shannon Entropy</h3>
            <MathBlock tex="H(t) = -\sum_{k=1}^K p_k \log_2 p_k \quad \in [0,\, \log_2 K]" />
            <p>
                H is maximised at the uniform distribution (log<sub>2</sub>K bits) and zero for a pure node. Information gain of split (j, s):
            </p>
            <MathBlock tex="\text{IG}(S,\, j,\, s) = H(S) - \frac{N_L}{N}\,H(L) - \frac{N_R}{N}\,H(R)" />

            <h3>Gini Impurity</h3>
            <MathBlock tex="\text{Gini}(t) = 1 - \sum_{k=1}^K p_k^2 = \sum_{k \neq j} p_k p_j \quad \in \left[0,\; 1 - \tfrac{1}{K}\right]" />
            <p>
                Gini equals the probability that two randomly selected examples have different labels. Gini reduction of split (j, s):
            </p>
            <MathBlock tex="\Delta\text{Gini}(S,\, j,\, s) = \text{Gini}(S) - \frac{N_L}{N}\,\text{Gini}(L) - \frac{N_R}{N}\,\text{Gini}(R)" />

            <h3>Misclassification Rate</h3>
            <MathBlock tex="\text{Err}(t) = 1 - \max_k p_k" />
            <p>
                The error rate if you predict the majority class at node t. Not used for splitting (too flat near pure nodes) but used for pruning evaluation in some implementations.
            </p>

            <h3>Mathematical Relationship Between Gini and Entropy</h3>
            <p>
                For binary classification (K=2), let p = p<sub>1</sub>:
            </p>
            <MathBlock tex="\text{Gini}(p) = 2p(1-p), \qquad H(p) = -p\log_2 p - (1-p)\log_2(1-p)" />
            <p>
                Both functions are zero at p = 0 and 1, maximum at p = 0.5. Taylor expansion of H around 0.5:
            </p>
            <MathBlock tex="H(p) \approx 1 - \frac{(\ln 2)}{2}(2p-1)^2 + O\!\left((p-\tfrac12)^4\right)" />
            <p>
                Gini(p) = 2p(1&minus;p) = 1/2 &minus; 2(p&minus;1/2)<sup>2</sup> is the exact quadratic approximation of H, scaled by 1/(2ln2) &asymp; 0.72. They are the same function up to a near-constant scaling factor — which is why they rank splits nearly identically.
            </p>

            <h3>Why Cross-Entropy Loss Is Shannon Entropy</h3>
            <p>
                The cross-entropy loss for a K-class neural network prediction &hat;p vs true label y:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{CE}}(y, \hat{p}) = -\sum_{k=1}^K y_k \log \hat{p}_k = H(y,\, \hat{p})" />
            <p>
                For one-hot labels (y<sub>k*</sub> = 1, all others 0): L<sub>CE</sub> = &minus;log &hat;p<sub>k*</sub>. When the model assigns p̂<sub>k</sub> = p<sub>k</sub> (the empirical class proportions), the average loss equals H(p<sub>1</sub>,...,p<sub>K</sub>) — exactly the entropy of the node. Minimising cross-entropy in neural networks is identical in spirit to minimising entropy impurity in decision trees — the same information-theoretic objective, applied via gradient descent instead of greedy search.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Quick Reference — when do they differ?</strong> Gini and entropy select the same split in ~97% of cases. Disagreements are concentrated at nodes where one class has very low probability (p &lt; 0.05). In those cases, entropy is more sensitive to residual impurity (the log function grows rapidly near zero), while Gini is more conservative. For production use: choose <code>criterion="gini"</code> for speed (no log computation) and <code>criterion="entropy"</code> when theoretical interpretability (information gain) matters. The accuracy difference is negligible.
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
                    <span className="ch-expandable-desc">Comparing Gini vs entropy empirically</span>
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
            <h2>Information-Theoretic Derivations</h2>

            <DefBlock label="Impurity Measures — Unified View">
                All three standard impurity measures &phi;(p) for binary classification (p = probability of positive class) satisfy:
                <br /><br />
                &phi;(0) = &phi;(1) = 0 (pure nodes have zero impurity)<br />
                &phi;(1/2) = maximum (equal class distribution is maximally impure)<br />
                &phi;(p) = &phi;(1&minus;p) (symmetric in p and 1&minus;p)
                <br /><br />
                Entropy: &phi;(p) = &minus;p log<sub>2</sub> p &minus; (1&minus;p) log<sub>2</sub>(1&minus;p)<br />
                Gini: &phi;(p) = 2p(1&minus;p)<br />
                Misclassification: &phi;(p) = 1 &minus; max(p, 1&minus;p)
            </DefBlock>

            <h3>Axiomatic Characterisation of Entropy</h3>
            <p>
                Shannon (1948) showed that any impurity measure satisfying (1) continuity, (2) symmetry in the p<sub>k</sub>'s, (3) maximum at the uniform distribution, and (4) consistency under splitting (H(p<sub>1</sub>,...,p<sub>K</sub>) = H(p<sub>1</sub>+p<sub>2</sub>, p<sub>3</sub>,...) + (p<sub>1</sub>+p<sub>2</sub>)H(p<sub>1</sub>/(p<sub>1</sub>+p<sub>2</sub>), p<sub>2</sub>/(p<sub>1</sub>+p<sub>2</sub>))) must be of the form:
            </p>
            <MathBlock tex="H = -c \sum_k p_k \log p_k \quad \text{for some constant } c > 0" />
            <p>
                Entropy is the unique impurity measure satisfying these four natural axioms. Gini satisfies the first three but not the fourth — which is why Gini cannot be derived from information-theoretic first principles, only from the probabilistic interpretation of disagreement probability.
            </p>

            <h3>Concavity and Jensen's Inequality</h3>
            <p>
                Any concave impurity measure &phi; guarantees IG &ge; 0:
            </p>
            <MathBlock tex="\phi\!\left(\frac{N_L}{N} p_L + \frac{N_R}{N} p_R\right) \geq \frac{N_L}{N}\,\phi(p_L) + \frac{N_R}{N}\,\phi(p_R)" />
            <p>
                (Jensen's inequality, since &phi; is concave). This means the parent impurity is always &ge; the weighted child impurity — information gain (the difference) is always &ge; 0. Both entropy and Gini are strictly concave on (0,1), so IG &ge; 0 with equality iff the split is independent of the labels.
            </p>

            <h3>KL Divergence Connection</h3>
            <p>
                Information gain IG(S, A) is the mutual information I(Y; A) under the empirical distribution. For a binary split into L and R:
            </p>
            <MathBlock tex="\text{IG} = \frac{N_L}{N}\,\text{KL}(p_L \,\|\, p) + \frac{N_R}{N}\,\text{KL}(p_R \,\|\, p)" />
            <p>
                where p is the parent's class distribution. Information gain is a weighted average of KL divergences from the child distributions to the parent distribution — measuring how much the split makes the child distributions diverge from the base rate. This is the information-theoretic formalisation of what a "useful question" is.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler

# ── Dataset ────────────────────────────────────────────────────────
wine = load_wine()
X, y = wine.data, wine.target
# No scaling needed for trees — they are scale-invariant

# ── Compare Gini vs Entropy at multiple depths ─────────────────────
print("Depth  | Criterion | 5-fold CV Accuracy (mean ± std)")
print("-" * 55)
for depth in [2, 3, 4, 5, None]:
    for criterion in ["gini", "entropy"]:
        dt = DecisionTreeClassifier(
            criterion=criterion, max_depth=depth, random_state=42
        )
        scores = cross_val_score(dt, X, y, cv=5, scoring="accuracy")
        depth_str = str(depth) if depth else "None"
        print(f"  {depth_str:4s}  | {criterion:7s}   | {scores.mean():.3f} ± {scores.std():.3f}")

# ── Measure how often they agree on the same split ────────────────
from sklearn.tree import _tree

def get_split_features(tree):
    """Extract the feature index used at each internal node."""
    t = tree.tree_
    return [t.feature[i] for i in range(t.node_count) if t.feature[i] != _tree.TREE_UNDEFINED]

dt_gini = DecisionTreeClassifier(criterion="gini", max_depth=6, random_state=42).fit(X, y)
dt_entr = DecisionTreeClassifier(criterion="entropy", max_depth=6, random_state=42).fit(X, y)

# Agreement: do the two trees use the same feature at each depth level?
from sklearn.tree import export_text
rules_g = export_text(dt_gini, feature_names=wine.feature_names)
rules_e = export_text(dt_entr, feature_names=wine.feature_names)

n_nodes_g = dt_gini.tree_.node_count
n_nodes_e = dt_entr.tree_.node_count
print(f"\\nGini tree:   {n_nodes_g} nodes, depth {dt_gini.get_depth()}")
print(f"Entropy tree: {n_nodes_e} nodes, depth {dt_entr.get_depth()}")

# ── Manual entropy and Gini computation ───────────────────────────
def entropy(probs):
    probs = np.asarray(probs)
    probs = probs[probs > 0]
    return float(-np.sum(probs * np.log2(probs)))

def gini(probs):
    probs = np.asarray(probs)
    return float(1 - np.sum(probs ** 2))

# Compare at a specific node distribution
examples = [
    ("Pure node", [1.0, 0.0, 0.0]),
    ("2-class balanced", [0.5, 0.5, 0.0]),
    ("3-class uniform", [1/3, 1/3, 1/3]),
    ("90/10 split", [0.9, 0.1, 0.0]),
    ("99/1 split", [0.99, 0.01, 0.0]),
]
print("\\nDistribution         Entropy (bits)  Gini")
print("-" * 45)
for label, probs in examples:
    h = entropy(probs)
    g = gini(probs)
    print(f"{label:22s}  {h:.4f}          {g:.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                The code compares Gini and entropy trees across multiple depths using cross-validation, then manually computes both measures at specific node distributions to illustrate where they agree and where they differ.
            </p>
            <CodeBlock code={PY_CODE} filename="gini_vs_entropy.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Practical takeaway:</strong> For almost every real dataset, the choice between <code>criterion="gini"</code> and <code>criterion="entropy"</code> will change test accuracy by less than 0.5%. The factors that actually matter: <code>max_depth</code> (primary regularisation), <code>min_samples_leaf</code> (prevents tiny leaves), <code>min_impurity_decrease</code> (threshold for splitting), and <code>ccp_alpha</code> (cost-complexity pruning). Tune these before worrying about Gini vs entropy.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const GINI_ENTROPY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
