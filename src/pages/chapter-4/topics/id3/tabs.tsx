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
            year: "1963",
            title: "Morgan &amp; Sonquist — CHAID, the First Decision Tree",
            challenge: "The EM algorithm (Dempster 1977) had shown that unlabeled data contained learnable structure. But social scientists at the University of Michigan faced a different problem: they had labels. Survey respondents had been categorised as high or low income, satisfied or dissatisfied, healthy or sick. They needed a machine that could discover which survey questions — out of dozens — best predicted the outcome, without being told which questions to examine. No algorithm existed that could discover interpretable decision rules from labeled categorical data automatically.",
            what: "James Morgan and John Sonquist built CHAID (Chi-squared Automatic Interaction Detection): a program that recursively split survey respondents into groups using chi-squared statistical tests to find the predictor variable that most strongly differentiated subgroups. It was a tree of if-then rules, grown automatically from labeled data — the first decision tree algorithm. Each node asked the question that produced the most statistically significant split; the tree kept growing until no remaining question met the significance threshold.",
            impact: "CHAID proved that a machine could discover interpretable decision rules from labeled data — a fundamentally different paradigm from regression or clustering. Its output was human-readable: a flowchart of questions that any analyst could follow. Its limitation: chi-squared tests only handle categorical predictors, and it couldn't process continuous data like age or income without manual binning. That limitation motivated everything that followed in the decision tree family.",
        },
        {
            year: "1979",
            title: "Quinlan at Sydney — ID3 is Born",
            challenge: "Ross Quinlan was working at the New South Wales Institute of Technology (later at Stanford and UNSW) on machine induction — teaching computers to discover rules from examples. His test domain was board game strategy: given examples of chess positions labelled as good or bad, learn a classifier that could advise on moves. The features were categorical (piece positions, material balance), the labels were strategic choices, and samples were small — a few hundred positions. CHAID's chi-squared tests required large samples to reach significance thresholds; they were too conservative for small datasets.",
            what: "Quinlan's ID3 (Iterative Dichotomiser 3, named after its use of binary iteration on trinary features) replaced chi-squared tests with information gain — the reduction in Shannon entropy achieved by splitting on a given attribute. At each node, compute IG(S, A) = H(S) &minus; &sum;<sub>v</sub> (|S<sub>v</sub>|/|S|)&middot;H(S<sub>v</sub>) for each attribute A, where S is the current set and S<sub>v</sub> is the subset with attribute value v. Choose the attribute with the highest information gain. Grow the tree recursively until all leaves are pure or no attributes remain.",
            impact: "ID3 was the first algorithm to connect Shannon's 1948 information theory directly to supervised learning. The information-gain criterion gave splitting a principled interpretation: you are literally minimising the expected number of bits needed to describe the class label after the split. Quinlan circulated ID3 as a technical report in 1979; it spread rapidly through the AI community and was formally published in 1986, becoming one of the most-cited ML papers of the decade.",
        },
        {
            year: "1986",
            title: "Quinlan — C4.5, the Descendant That Dominated a Decade",
            challenge: "ID3 had three well-known weaknesses exposed by half a decade of use. First, it was biased toward attributes with many possible values: a unique identifier (email address, timestamp) always scored highest on information gain — because splitting 300 examples into 300 groups of 1 gives zero entropy — but was completely useless for generalisation. Second, it could only handle categorical features, not continuous ones like age or temperature. Third, it grew trees until every leaf was pure, producing extreme overfitting on any dataset with noise.",
            what: "C4.5 fixed all three problems in a single published algorithm. For the many-valued attribute bias: it normalised information gain by the attribute's own entropy — the gain ratio — penalising splits that created many tiny groups. For continuous features: it sorted values and tested all candidate midpoint thresholds, selecting the threshold t that maximised information gain when splitting x &le; t vs x &gt; t. For overfitting: it applied post-pruning — grow the full tree, then use pessimistic error estimates (upper confidence bound on the leaf error rate) to collapse branches that are unlikely to improve out-of-sample accuracy.",
            impact: "C4.5 became the workhorse of practical machine learning in the late 1980s and 1990s. A 2008 poll of the ACM SIGKDD Data Mining community named C4.5 the most influential data mining algorithm of the 20th century. Its output — human-readable if-then decision rules — made it a preferred tool in medicine, law, and any domain where decisions needed to be audited. The commercial C5.0 extension is still available today.",
        },
        {
            year: "1979–1984",
            title: "The ID3-CART Fork — Two Schools of Thought",
            challenge: "By 1984, two competing decision tree frameworks existed: ID3/C4.5 from the AI community (information gain, multi-way categorical splits, post-pruning) and CART from the statistics community (Gini impurity, strictly binary splits, cost-complexity pruning with cross-validation). Both produced interpretable trees, both handled classification, but their mathematical foundations, default behaviours, and theoretical justifications differed sharply. Neither camp fully understood why the other's approach worked.",
            what: "The difference was more than technical. ID3 came from Quinlan's machine learning tradition: multi-branch trees matched human reasoning about categories, information gain had an information-theoretic interpretation, and gain ratio controlled overfitting at the feature selection stage. CART came from Breiman's statistics tradition: binary trees could be analysed with the bias-variance decomposition, Gini impurity was differentiable, and cost-complexity pruning connected directly to regularisation theory. Both grew into major lineages: C4.5 &rarr; C5.0 (commercial); CART &rarr; Random Forests &rarr; Gradient Boosting &rarr; XGBoost.",
            impact: "The fork created two intellectual traditions in ML: the symbolic AI tradition (interpretable rules, categorical reasoning, human-readable output) and the statistics tradition (mathematical optimisation, variance reduction, prediction accuracy). The tension between these traditions drove the field forward for two decades and is still visible today in the debate between interpretable models and black-box neural networks.",
        },
        {
            year: "1993",
            title: "Quinlan — C5.0 and Rule Extraction",
            challenge: "Even C4.5 trees could grow large — hundreds of nodes — for complex domains. Large trees were difficult to interpret despite being technically readable. Analysts in regulated industries (insurance, medicine, credit scoring) needed not just a tree but a small set of simple rules that could be audited, explained to regulators, and implemented in business logic without running software.",
            what: "Quinlan's C5.0 (also released as See5) added rule induction on top of the tree: after building the tree, extract one rule per path from root to leaf, then simplify each rule by dropping conditions that do not meaningfully reduce its accuracy. Rules are then ordered by their estimated accuracy and coverage. The final output is a small ranked list of if-then rules, not a tree — often 10–30 rules instead of a tree with hundreds of nodes.",
            impact: "Rule extraction from decision trees became a standard technique for model compression and explainability. The idea — train a complex model, then distil it into a smaller interpretable form — directly prefigures the model distillation techniques used in modern NLP: training a large neural network and then distilling it into a smaller, faster, more interpretable model. C5.0 remains commercially available and is used in financial and medical applications where regulatory compliance requires auditable decision logic.",
        },
        {
            year: "2000s–present",
            title: "ID3's Legacy — Entropy Splitting Across All of ML",
            challenge: "As ensemble methods (Random Forests, Gradient Boosting) surpassed single decision trees in prediction accuracy, the interpretability advantage of individual trees was reduced. The question became whether the theoretical foundations ID3 established — information gain, entropy as impurity — could survive into the ensemble era, or whether they would be replaced by purely empirical splitting criteria.",
            what: "Information gain and entropy splitting survived as the theoretical backbone of the entire tree family. The cross-entropy loss used to train neural network classifiers is exactly Shannon entropy applied to the predicted probability distribution. The mutual information splitting criterion in modern Extremely Randomised Trees (ExtraTrees) is ID3's information gain applied with random thresholds. The KL divergence used in knowledge distillation is the difference between two entropy values. ID3's 1979 insight — that Shannon entropy measures the uncertainty in a label distribution — became a universal primitive in ML theory.",
            impact: "The connection ID3 established between information theory and supervised learning is now the theoretical foundation of classification across all paradigms. Logistic regression minimises cross-entropy. Neural networks are trained with cross-entropy loss. Decision trees split on entropy reduction. Reinforcement learning agents maximise information gain about the environment. Shannon's 1948 entropy formula, adapted by Quinlan in 1979 for supervised learning, underlies every classification algorithm in modern ML.",
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
            <h2>Teaching a computer to play 20 Questions</h2>

            <p className="ch-story-intro">
                Dempster's EM algorithm (1977) could find hidden clusters in unlabeled data. But many real problems come with labels — past examples with known outcomes: this patient recovered, this email was spam, this loan defaulted. How do you build a machine that discovers rules from labeled examples without being told which rules to look for? Ross Quinlan's answer, developed at Sydney in 1979, was ID3: teach the computer to play 20 Questions, but have it figure out the best questions itself.
            </p>

            <Analogy label="The game of 20 Questions">
                You're thinking of an animal. I ask yes/no questions: Is it a mammal? Does it fly? Is it bigger than a dog? I want to guess the animal using as few questions as possible.
                <br /><br />
                The key insight: a good question dramatically narrows the possibilities. "Does it have a backbone?" eliminates half of all known species. "Is it named Bob?" eliminates almost nothing. ID3 finds the questions that eliminate the most uncertainty — mathematically, the questions that most reduce Shannon entropy.
            </Analogy>

            <Analogy label="Information gain — measuring how useful a question is">
                Imagine sorting emails into spam and not-spam. Before asking anything, the pile is 60% spam — moderately uncertain. You ask: "Does the subject line contain FREE?"
                <br /><br />
                YES pile: 95% spam, 5% not-spam — nearly pure. NO pile: 20% spam, 80% not-spam — also nearly pure.
                <br /><br />
                That question dramatically reduced uncertainty. Quinlan called this reduction <strong>information gain</strong> — borrowing directly from Shannon's 1948 entropy formula. At each node, ID3 asks: which question reduces entropy the most? That question gets asked first.
            </Analogy>

            <Analogy label="Growing the tree — ask, split, repeat">
                ID3 works like this:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li>Start with all training examples in one pile</li>
                    <li>Try every possible question (feature). Compute the information gain for each one</li>
                    <li>Ask the question with the highest gain. Split the pile into groups based on the answer</li>
                    <li>Repeat steps 2–3 for each new group, using the remaining questions</li>
                    <li>Stop when each group contains only one class (all spam, or all not-spam)</li>
                </ol>
                The result is a tree of questions. Any new email can be classified in milliseconds by following the tree from root to leaf.
            </Analogy>

            <Analogy label="The problem — ID3 loves questions with many answers">
                ID3 had a flaw: it loved attributes with many possible values. "What is the exact timestamp of this email?" has millions of possible values — each creating its own tiny pure leaf. It scores extremely high on information gain but is useless for new emails, which will have different timestamps.
                <br /><br />
                C4.5 fixed this with the <strong>gain ratio</strong>: divide the information gain by the attribute's own entropy. Questions with many values get penalised proportionally — the computer learns to prefer questions that are both informative AND general enough to apply to new examples.
            </Analogy>

            <Analogy label="What comes next — the statistics tradition">
                ID3 came from the AI tradition: interpretable rules, categorical features, multi-branch trees. At almost the same time, four statisticians — Breiman, Friedman, Olshen, and Stone — were developing CART from a completely different starting point. They wanted trees that could handle continuous numbers, worked for regression as well as classification, and connected to the mathematical theory of estimation error. Their approach used a different splitting criterion — Gini impurity — and became the foundation of every tree ensemble used in ML today.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Information gain as the splitting criterion</h2>

            <h3>Shannon Entropy as Impurity</h3>
            <p>
                At a node containing set S with class proportions p<sub>1</sub>, ..., p<sub>K</sub>, the Shannon entropy measures the expected number of bits needed to encode a randomly chosen label:
            </p>
            <MathBlock tex="H(S) = -\sum_{k=1}^K p_k \log_2 p_k \quad \in [0,\, \log_2 K]" />
            <p>
                H(S) = 0 when the node is pure (one class has probability 1). H(S) = log<sub>2</sub>K when all classes are equally probable — maximum uncertainty.
            </p>

            <h3>Information Gain</h3>
            <p>
                For attribute A with discrete values &#123;v<sub>1</sub>, ..., v<sub>m</sub>&#125;, splitting S on A produces subsets S<sub>v</sub> = &#123;x &isin; S : x<sub>A</sub> = v&#125;. The information gain:
            </p>
            <MathBlock tex="\text{IG}(S, A) = H(S) - \sum_{v} \frac{|S_v|}{|S|}\, H(S_v)" />
            <p>
                ID3 greedily selects A* = argmax<sub>A</sub> IG(S, A) at each node — the attribute that maximally reduces the expected entropy of the child nodes.
            </p>

            <h3>The Gain Ratio Fix (C4.5)</h3>
            <p>
                IG is biased toward high-cardinality attributes: an attribute with m unique values can achieve IG close to H(S) by creating m singleton leaves. C4.5 corrects this with the split information:
            </p>
            <MathBlock tex="\text{SplitInfo}(S, A) = -\sum_v \frac{|S_v|}{|S|} \log_2 \frac{|S_v|}{|S|}" />
            <MathBlock tex="\text{GainRatio}(S, A) = \frac{\text{IG}(S, A)}{\text{SplitInfo}(S, A)}" />
            <p>
                GainRatio penalises attributes that split data into many small groups — SplitInfo is large when the split is highly fragmented, which suppresses the GainRatio. C4.5 uses a hybrid: select by GainRatio only among attributes whose IG exceeds the average IG across all attributes.
            </p>

            <h3>Handling Continuous Attributes (C4.5)</h3>
            <p>
                For a continuous attribute X with sorted values x<sub>(1)</sub> &le; x<sub>(2)</sub> &le; ... &le; x<sub>(n)</sub>, C4.5 evaluates all candidate thresholds t<sub>j</sub> = (x<sub>(j)</sub> + x<sub>(j+1)</sub>)/2 where adjacent examples have different labels. The binary split X &le; t vs X &gt; t is scored by information gain; the best threshold is chosen. This converts any continuous attribute into a binary split without pre-discretisation.
            </p>

            <h3>ID3 / C4.5 Algorithm</h3>
            <DefBlock label="Recursive Tree Building">
                1. If all examples have the same class &rarr; return leaf with that class<br />
                2. If no attributes remain &rarr; return leaf with majority class<br />
                3. A* &larr; argmax<sub>A</sub> GainRatio(S, A)<br />
                4. Create internal node splitting on A*<br />
                5. For each value v of A*: recurse on S<sub>v</sub> with A* removed from available attributes<br />
                6. Return the node
            </DefBlock>

            <h3>ID3's Known Limitations</h3>
            <ul>
                <li><strong>No pruning:</strong> The original ID3 grew until pure, producing extreme overfitting. C4.5 added pessimistic post-pruning.</li>
                <li><strong>Categorical only:</strong> ID3 cannot handle continuous features. C4.5 added threshold-based binary splits.</li>
                <li><strong>High-cardinality bias:</strong> Fixed by gain ratio in C4.5.</li>
                <li><strong>Missing values:</strong> ID3 ignored them. C4.5 distributed fractional examples across branches.</li>
                <li><strong>Greedy:</strong> The tree is built top-down without backtracking. A globally suboptimal split at the root cannot be corrected later.</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Connection to Shannon (Ch. 2):</strong> ID3 takes Shannon's 1948 entropy formula — designed to measure the average information content of a message — and applies it to the uncertainty in a label distribution. A pure node (one class) has entropy 0 — a message about its label carries 0 bits of surprise. This is precisely the connection Shannon and McCulloch were discussing at the Macy Conferences. The same formula underlies the cross-entropy loss used in every neural network classifier trained today — making ID3's 1979 insight foundational to the entire modern ML stack.
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
                    <span className="ch-expandable-desc">Implementation · NumPy · scikit-learn</span>
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
            <h2>Information Theory Foundations of ID3</h2>

            <DefBlock label="Shannon Entropy — Formal Definition">
                For a discrete random variable X with distribution P, the Shannon entropy is:
                <br /><br />
                H(X) = &minus;&sum;<sub>x</sub> P(x) log<sub>2</sub> P(x)
                <br /><br />
                H measures the expected number of bits required to encode a sample from X under an optimal code (Shannon's source coding theorem). H = 0 iff P is a point mass; H = log<sub>2</sub>|&Xscr;| iff P is uniform.
            </DefBlock>

            <h3>Mutual Information as Splitting Criterion</h3>
            <p>
                Information gain IG(S, A) is the mutual information between the class label Y and the attribute value A, estimated from the empirical distribution of the training set S:
            </p>
            <MathBlock tex="\text{IG}(S, A) = I(Y; A) = H(Y) - H(Y \mid A) = \sum_{v} p(A=v)\, \text{KL}(p(Y|A=v) \,\|\, p(Y))" />
            <p>
                where KL is the Kullback-Leibler divergence. This shows IG is always &ge; 0 (by non-negativity of KL), and IG = 0 iff Y and A are statistically independent given the current node's distribution.
            </p>

            <h3>Greedy Optimality and Its Limits</h3>
            <p>
                Finding the optimal decision tree (minimising expected misclassification error) is NP-hard. ID3's greedy approach approximates this by maximising a myopic single-step criterion. The connection to submodularity provides some guarantee: the function f(A) = H(Y) &minus; H(Y|A) is submodular in the set of attributes A (diminishing returns as more attributes are observed), and greedy maximisation of submodular functions achieves a (1 &minus; 1/e) approximation of the optimal subset selection. This is the theoretical justification for greedy feature selection in decision trees.
            </p>

            <h3>Gain Ratio — Bias Correction Derivation</h3>
            <MathBlock tex="\text{GainRatio}(S, A) = \frac{H(Y) - H(Y|A)}{H(A)}" />
            <p>
                SplitInfo = H(A) is the entropy of the attribute A itself under the empirical distribution. An attribute A that creates m equal-sized leaves has H(A) = log<sub>2</sub>m — growing with cardinality. Dividing IG by H(A) normalises information gain to lie in [0, 1] regardless of attribute cardinality, penalising high-cardinality attributes proportionally to their self-entropy.
            </p>

            <h3>Connection to Cross-Entropy Loss</h3>
            <p>
                The cross-entropy loss used to train a K-class neural network on one example (x, y*):
            </p>
            <MathBlock tex="\mathcal{L}_{\text{CE}}(y^*, \hat{p}) = -\log \hat{p}_{y^*}" />
            <p>
                Averaged over a training set S, this equals the empirical cross-entropy H(P<sub>true</sub>, P<sub>model</sub>) = H(P<sub>true</sub>) + KL(P<sub>true</sub> || P<sub>model</sub>). Minimising cross-entropy loss is equivalent to minimising the KL divergence from the model distribution to the true class distribution — exactly the same objective as ID3's information gain, applied continuously via gradient descent rather than discretely via greedy attribute selection.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ── Load data ──────────────────────────────────────────────────────
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── ID3-style tree (entropy criterion) ────────────────────────────
dt_entropy = DecisionTreeClassifier(
    criterion="entropy",    # information gain = entropy reduction
    max_depth=None,         # grow full tree (like original ID3)
    random_state=42
)
dt_entropy.fit(X_train, y_train)
print("Full tree (entropy):")
print(f"  Depth:         {dt_entropy.get_depth()}")
print(f"  Leaves:        {dt_entropy.get_n_leaves()}")
print(f"  Train acc:     {dt_entropy.score(X_train, y_train):.3f}")
print(f"  Test acc:      {dt_entropy.score(X_test, y_test):.3f}")

# ── C4.5-style: depth-limited to prevent overfitting ──────────────
dt_c45 = DecisionTreeClassifier(
    criterion="entropy",
    max_depth=4,            # post-pruning equivalent: depth limit
    min_samples_leaf=3,
    random_state=42
)
dt_c45.fit(X_train, y_train)
print("\\nDepth-limited tree (C4.5 approximation):")
print(f"  Depth:    {dt_c45.get_depth()}")
print(f"  Leaves:   {dt_c45.get_n_leaves()}")
print(f"  Test acc: {dt_c45.score(X_test, y_test):.3f}")

# ── Print human-readable rules (like C4.5 rule output) ────────────
rules = export_text(dt_c45, feature_names=iris.feature_names)
print("\\nDecision rules:")
print(rules[:600] + "...")

# ── Compute information gain manually ─────────────────────────────
def entropy(y):
    probs = np.bincount(y) / len(y)
    probs = probs[probs > 0]
    return -np.sum(probs * np.log2(probs))

def info_gain(X_col, y, threshold):
    left  = y[X_col <= threshold]
    right = y[X_col >  threshold]
    if len(left) == 0 or len(right) == 0:
        return 0.0
    wl = len(left) / len(y)
    wr = len(right) / len(y)
    return entropy(y) - wl * entropy(left) - wr * entropy(right)

# Best split on petal length (feature index 2)
petal_len = X_train[:, 2]
thresholds = np.unique(petal_len)
gains = [info_gain(petal_len, y_train, t) for t in thresholds]
best_t = thresholds[np.argmax(gains)]
print(f"\\nBest petal-length threshold: {best_t:.2f} cm")
print(f"Information gain: {max(gains):.4f} bits")`

function PythonContent() {
    return (
        <>
            <p>
                The code demonstrates both full ID3-style trees (entropy criterion, no depth limit) and depth-limited C4.5-style trees in scikit-learn, alongside a manual calculation of information gain to make the splitting criterion concrete.
            </p>
            <CodeBlock code={PY_CODE} filename="id3_tree.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>scikit-learn and ID3:</strong> scikit-learn's <code>DecisionTreeClassifier</code> uses a CART-style binary-split implementation regardless of the <code>criterion</code> setting — so setting <code>criterion="entropy"</code> gives you information gain with binary splits, not the original multi-way ID3. The closest approximation to C4.5's post-pruning is cost-complexity pruning via <code>ccp_alpha</code> (see the Pruning topic). For a true multi-way ID3, use the <code>id3</code> pip package or implement from scratch.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const ID3_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
