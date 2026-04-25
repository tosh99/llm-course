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
            year: "1984",
            title: "Breiman, Friedman, Olshen & Stone — Classification and Regression Trees",
            challenge:
                "ID3 handled categorical features and classification. But statisticians working on survival analysis, medical diagnosis, and economic forecasting needed trees that worked with continuous predictors (age, blood pressure, income), that predicted continuous outcomes (not just classes), and that had rigorous statistical justification rather than heuristic information gain. The existing decision-tree algorithms from the AI community were ad hoc from a statistical perspective — they lacked confidence intervals, sampling theory, or connections to the bias-variance tradeoff.",
            what:
                "Leo Breiman, Jerome Friedman, Richard Olshen, and Charles Stone published Classification and Regression Trees (CART) — a 408-page monograph and a new algorithm. CART's key decisions: (1) Always binary splits. Every node splits into exactly two children, making the tree structure a binary tree that is easier to analyse mathematically. (2) Gini impurity for classification: Σᵢ pᵢ(1−pᵢ) — easier to compute than entropy, differentiable, and produces nearly the same splits. (3) Variance reduction for regression: choose the split minimising the weighted sum of within-child variances. (4) Cost-complexity pruning: grow the full tree, then prune by removing the subtrees whose removal least increases error per leaf removed.",
            impact:
                "CART became the foundation of the entire modern tree ensemble family. Random Forests (Chapter 8) and gradient boosting both use CART trees as their base learners. The cost-complexity pruning framework — trading off accuracy against model complexity — is the same principle as regularisation in linear models, and directly influenced dropout and weight decay in neural networks. Breiman and Friedman would go on to develop bagging (1994), Random Forests (2001), and gradient boosting (2001), respectively.",
        },
        {
            year: "1984 — Concurrent",
            title: "The Regression Tree — A Decision Tree for Continuous Outputs",
            challenge:
                "Before CART, decision trees could only predict categorical labels (spam/not-spam, survived/died). But many problems — house prices, blood pressure, yield predictions — required continuous predictions. Regression required a completely different formulation of the impurity criterion.",
            what:
                "CART's regression tree replaces impurity with variance reduction: at each node, find the split (feature j, threshold t) that minimises the total within-child mean-squared error. The prediction for a leaf is the mean of the training examples in that leaf. The algorithm is identical to the classification case — only the splitting criterion changes.",
            impact:
                "Regression trees made decision trees applicable to the full range of supervised learning problems. They also revealed a key weakness that motivated ensemble methods: a single regression tree produces a step-function approximation — constant within each leaf — which is very rough. Averaging many trees (Random Forests) or fitting trees sequentially to residuals (gradient boosting) dramatically smooth this approximation.",
        },
        {
            year: "1996 — Emergence",
            title: "Breiman — Bagging Discovers That Trees Are Highly Unstable",
            challenge:
                "Breiman observed something alarming about decision trees: small changes to the training data — removing a handful of examples — could produce completely different trees. This high variance made trees unreliable in practice, even though their bias (systematic error) was low. The question was: what causes this instability, and can it be fixed without sacrificing the interpretability of the tree structure?",
            what:
                "Breiman's 1996 bootstrap aggregating (bagging) paper showed: grow B CART trees on B bootstrap samples (resample with replacement), then average their predictions. The key finding was that averaging dramatically reduced variance while leaving bias almost unchanged. For unstable learners like decision trees, bagging almost always outperformed any single tree. This was the first empirical demonstration of the bias-variance decomposition at scale.",
            impact:
                "Bagging was the immediate predecessor of Random Forests. More importantly, it established that decision trees are the ideal base learner for ensembles precisely because of their high variance — the instability that made individual trees unreliable became a feature when many diverse trees were averaged. This insight — that a good ensemble member should be diverse, not accurate — restructured how ML practitioners thought about model selection. Pruning is the subject of our next topic.",
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
            <h2>The statistician's answer to decision trees — binary splits and numbers</h2>

            <p className="ch-story-intro">
                Quinlan's ID3 came from the AI tradition: it loved multiple branches, categorical variables, and readable rules. Four statisticians — Breiman, Friedman, Olshen, and Stone — came to decision trees from a completely different direction. They wanted trees that could handle numbers, predict continuous outcomes, and connect to the mathematical theory of estimation. Their 1984 answer, CART, became the foundation of every tree ensemble used in machine learning today.
            </p>

            <Analogy label="Always binary — why always two branches?">
                ID3 might split a colour attribute into red / blue / green / yellow — four branches at once. CART always asks yes/no questions: "Is the value above 3.5? Yes or no." Always two branches.
                <br /><br />
                Why? Because any multi-way split can be built up from a sequence of binary splits. And binary trees are much easier to analyse mathematically — you can prove things about them that you can't prove about arbitrary multi-way trees. This connects CART to the binary decision-making studied in information theory.
            </Analogy>

            <Analogy label="Gini impurity — measuring the mess">
                Instead of Shannon's entropy, CART uses Gini impurity: if you picked two examples at random from a node and they have different classes, how often would that happen?
                <br /><br />
                In a node that's 90% cats and 10% dogs: if you pick two, the chance they disagree is 2 × 0.9 × 0.1 = 18%. In a node that's 50/50: it's 2 × 0.5 × 0.5 = 50% — maximally messy. CART finds the split that reduces this mess the most.
                <br /><br />
                Gini and entropy almost always choose the same split — but Gini is faster to compute (no logarithms) and its gradient exists everywhere (useful for mathematical analysis).
            </Analogy>

            <Analogy label="Regression trees — predicting numbers">
                If the label is a number (house price, temperature, blood pressure), CART uses a different rule: find the split that makes each child's numbers as close to their average as possible. The "mess" is now the spread (variance) of the numbers in a node.
                <br /><br />
                For any new house, follow the tree down to a leaf, then predict the average price of all training houses that ended up in that leaf. Simple — but very rough, like a staircase approximation to a smooth curve. The roughness is why you want many trees averaged together.
            </Analogy>

            <Analogy label="Bagging — when a crowd beats a genius">
                Breiman noticed something strange: change just a few training examples and the tree changes completely. A small child who memorises one textbook and fails when the exam changes just one word — that's a CART tree. High variance.
                <br /><br />
                His fix: grow 100 trees, each on a slightly different random sample of the data. Combine their predictions by voting or averaging. The random sampling means each tree makes different mistakes — and when you average, the mistakes cancel. This is <strong>bagging</strong>, and it is the direct ancestor of Random Forests (Chapter 8).
            </Analogy>

            <Analogy label="What comes next — the right amount of tree">
                CART grows a full tree until every leaf is pure — but a pure leaf on the training set often means overfitting. The next topic is pruning: the art of cutting back a tree to exactly the right size — not so large that it memorises noise, not so small that it misses the pattern.
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
                For a node containing class proportions p₁, ..., p_K:
            </p>
            <MathBlock tex="\text{Gini}(t) = \sum_{k=1}^K p_k(1 - p_k) = 1 - \sum_{k=1}^K p_k^2" />
            <p>
                Gini = 0 for a pure node (one class), maximum of 1 − 1/K for a perfectly mixed node. CART chooses the binary split (j, s) — feature j, threshold s — that minimises the weighted Gini of the two children:
            </p>
            <MathBlock tex="\text{Gini}_{\text{split}} = \frac{N_L}{N}\,\text{Gini}(L) + \frac{N_R}{N}\,\text{Gini}(R)" />

            <h3>Regression Tree — Variance Reduction</h3>
            <p>
                For continuous targets y, the splitting criterion is the total within-child MSE:
            </p>
            <MathBlock tex="\text{MSE}_{\text{split}} = \frac{N_L}{N} \text{Var}(L) + \frac{N_R}{N} \text{Var}(R)" />
            <p>
                where Var(S) = (1/|S|) Σᵢ (yᵢ − ȳ_S)². The leaf prediction is ȳ_leaf (sample mean). The full tree minimises within-leaf variance; any unseen point is predicted with the mean of its training co-inhabitants.
            </p>

            <h3>CART Algorithm</h3>
            <ol>
                <li>For each feature j, for each unique value v in that feature: evaluate the split (j, v)</li>
                <li>Choose (j*, v*) = argmin Gini_split (or MSE_split)</li>
                <li>Split node into left ({"{x : x_j ≤ v*}"}) and right ({"{x : x_j > v*}"})</li>
                <li>Recurse until stopping criterion: max depth, min samples per leaf, or all leaves pure</li>
            </ol>

            <h3>Connection to Random Forests and Gradient Boosting</h3>
            <p>
                The key property of CART that makes it ideal for ensembles: it is a <strong>high-variance, low-bias learner</strong>. A deep tree approximates the true function well (low bias) but is very sensitive to training data (high variance). Averaging many trees (Random Forests, Ch.8) reduces variance without increasing bias. Fitting trees sequentially to residuals (Gradient Boosting, Ch.8) reduces bias without inflating variance. Both are only possible because CART produces the right kind of "wrong" — systematic error that can be corrected.
            </p>

            <DefBlock label="Gini vs Entropy — Are They Different?">
                The Gini split and the entropy split choose the same feature in ~97% of cases (Raileanu & Stoffel, 2004). The differences are at the margins: entropy slightly prefers splits that balance class counts; Gini slightly favours the largest class. In practice, the choice of max_depth, min_samples_leaf, and the number of ensemble trees matters far more than Gini vs entropy.
            </DefBlock>

            <div className="ch-callout">
                <strong>Chapter 4 connects forward:</strong> CART (1984) was published in the same year that Rumelhart, Hinton, and Williams were working on backpropagation (published 1986). Both approaches — decision trees and neural networks — were solving the same problem: learning a mapping from inputs to outputs. Decision trees partition the input space into axis-aligned boxes. Neural networks learn smooth non-linear boundaries. The comparison between these two paradigms dominated ML for the next 30 years.
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
