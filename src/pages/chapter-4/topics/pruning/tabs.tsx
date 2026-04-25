import { Analogy, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1984",
            title: "CART — Cost-Complexity Pruning",
            challenge:
                "Growing a tree until every leaf is pure produces perfect training accuracy but extreme overfitting. The tree memorises noise in the training data. The challenge: how much tree is the right amount? Cutting at a fixed depth is arbitrary. Requiring a minimum number of samples per leaf is also arbitrary. What was needed was a principled, data-driven method for choosing tree complexity.",
            what:
                "CART introduced cost-complexity pruning. Grow the full tree T_max. For each internal node t, compute the cost-complexity: α = ΔError(t) / ΔLeaves(t) — the increase in training error per leaf removed if you collapse subtree t. Collapse the subtree with the smallest α (the one that costs the least error per complexity reduction). Repeat until you reach the root, generating a sequence of nested subtrees T_max ⊃ T₁ ⊃ T₂ ⊃ ... ⊃ T_root. Use cross-validation to choose the right tree from this sequence by evaluating each on held-out data.",
            impact:
                "Cost-complexity pruning was the first principled regularisation mechanism for decision trees. The sequence of nested subtrees is equivalent to regularisation paths in linear models: as α increases from 0 to ∞, the selected tree shrinks from T_max to a single leaf, tracing a bias-variance curve exactly analogous to the ridge regression path as λ increases. This connection between tree pruning and linear regularisation unified two apparently separate statistical traditions.",
        },
        {
            year: "1979 / 1986",
            title: "C4.5 — Pessimistic Error Estimate for Pruning",
            challenge:
                "CART's cost-complexity pruning requires cross-validation — running the full tree-building algorithm multiple times on different subsets. For small datasets or time-constrained applications, this was expensive. Quinlan needed a single-pass pruning method that used only the training data but still produced realistic out-of-sample error estimates.",
            what:
                "C4.5 used a pessimistic error estimate: for a leaf with N examples and E errors, estimate the true error rate using the upper bound of a confidence interval rather than the raw training error E/N. Specifically, use the upper bound of a binomial confidence interval: p̂ + z√(p̂(1−p̂)/N) where z = 0.69 for the default 25% confidence level. Then compare: does collapsing the subtree under node t to a leaf, using this pessimistic estimate, improve the estimated error? If yes, collapse it.",
            impact:
                "C4.5's pessimistic pruning was faster than cross-validation and worked well in practice. It also revealed a deep insight: regularisation is about correcting for the optimism bias in training error estimates. When a model is fit to data, training error is systematically too optimistic — smaller than the true expected error on new data. Pruning, regularisation, and dropout all correct for this same bias in different ways.",
        },
        {
            year: "1990s – present",
            title: "Ensemble Methods as an Alternative to Pruning",
            challenge:
                "Both cost-complexity pruning and pessimistic error estimates required careful tuning and added algorithmic complexity. Breiman (1994-2001) discovered a different approach: instead of pruning a single tree to the right size, grow many full (unpruned) trees and average their predictions. The variance of the individual trees cancels out in the average without any need to prune.",
            what:
                "Random Forests grow hundreds of full, unpruned CART trees — each on a bootstrap sample and with a random subset of features at each split. The predictions are averaged. The averaging reduces variance without increasing bias. No pruning is required because the variance is controlled by the aggregation step rather than by limiting individual tree complexity. Gradient Boosting instead grows shallow pruned trees (max depth 3-6) sequentially, each correcting the previous ensemble's errors.",
            impact:
                "Ensemble methods replaced pruning as the primary tool for controlling decision tree variance in practice. However, the theoretical understanding developed through studying pruning — the bias-variance tradeoff, regularisation paths, optimism correction — directly informed the development of regularisation in neural networks. Dropout (2014) is equivalent to averaging over an exponential number of neural network 'subtrees', exactly as Random Forests average over CART subtrees. This is why the Chapter 4 story directly connects to Chapter 5 and beyond: the principles discovered for trees re-appear in every generation of ML algorithms.",
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
                Imagine a game show contestant who memorised every question and answer from the last 10 seasons of the show. They score 100% on reruns — but fail completely on new episodes. A decision tree that grows until every leaf has exactly one training example does the same thing: perfect on the training data, useless on anything new. This is called <strong>overfitting</strong>.
            </Analogy>

            <Analogy label="Pruning — cutting back to what matters">
                Imagine you grew a huge tree in your garden, then went back and cut off every branch that wasn't producing fruit. You keep the main structure but remove the dead wood. Decision tree pruning works the same way: grow the full tree, then remove the branches that add complexity without meaningfully improving accuracy.
                <br /><br />
                CART's method: for each branch, ask "if I removed this branch, how much would my training accuracy decrease, and how many leaves would I eliminate?" Remove the branch with the best trade-off — removes the most complexity for the least accuracy cost.
            </Analogy>

            <Analogy label="Cross-validation — trying different levels of pruning">
                After pruning, you have a family of trees, from very detailed to very simple. How do you choose the right one? Cross-validation: hide some training examples, train on the rest, and test on the hidden examples. The tree that gets the best score on the hidden examples — not the training examples — is the right size.
                <br /><br />
                This is the same principle as train/test splits in modern ML: we choose models based on how well they generalise, not how well they memorise.
            </Analogy>

            <Analogy label="The deeper lesson — complexity is the enemy">
                Pruning taught ML researchers a fundamental principle: the simplest model that fits the data well is usually the best model. This principle — known as Occam's Razor or the bias-variance tradeoff — reappears everywhere:
                <br /><br />
                Ridge and Lasso regularisation (Chapter 8) penalise large weights in linear models. Dropout (Chapter 9) randomly removes neurons during training. Early stopping terminates training before the network memorises noise. L2 weight decay prevents weights from growing too large. All of these are different implementations of the same idea that pruning demonstrated for decision trees in 1984.
            </Analogy>

            <Analogy label="What comes next — teaching neurons to learn">
                Decision trees ask one question at a time and follow rigid if-then rules. They can only draw axis-aligned boundaries in the data. The same year CART was published, a team at UCSD was working on something fundamentally different: networks of artificial neurons that learn by flowing error signals backwards through layers of computation. That 1986 paper on backpropagation marks the beginning of Chapter 5 — and the start of the path that leads, 40 years later, to ChatGPT.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Regularisation for trees — cost-complexity pruning</h2>

            <h3>The Overfitting Problem</h3>
            <p>
                A fully grown tree T_max achieves zero training error (if no two training examples have identical features but different labels). But its test error is high — it has memorised noise. We need to find the subtree T ⊆ T_max that minimises true generalisation error.
            </p>

            <h3>Cost-Complexity Pruning (CART)</h3>
            <p>
                Define the regularised objective for a tree T with α ≥ 0:
            </p>
            <MathBlock tex="R_\alpha(T) = R(T) + \alpha \cdot |T|" />
            <p>
                where R(T) is the training error rate and |T| is the number of leaves. For any α, the optimal subtree T*(α) = argmin R_α(T). As α increases from 0 to ∞, T*(α) traces a path: T_max → T₁ → T₂ → ... → T_root (single leaf). This is exactly analogous to the ridge regression regularisation path as λ increases.
            </p>

            <h3>Finding the Path Efficiently</h3>
            <p>
                At each pruning step, find the weakest link — the internal node t whose subtree, when collapsed to a leaf, causes the minimum increase in cost per leaf removed:
            </p>
            <MathBlock tex="\alpha^*(t) = \frac{R(t) - R(T_t)}{|T_t| - 1}" />
            <p>
                where R(t) is the error of the leaf replacing the subtree, and R(T_t) is the error of the full subtree T_t. Collapse t when α reaches α*(t). This produces the complete regularisation path in O(|T_max|²) time.
            </p>

            <h3>Selecting the Right Tree via Cross-Validation</h3>
            <p>
                Evaluate each tree in the sequence T*(α₁), T*(α₂), ... on k-fold cross-validation. Select the α (and corresponding tree) with minimum cross-validation error, or the largest tree within one standard error of the minimum (the "1-SE rule" — choose the simplest model that is not significantly worse than the best).
            </p>

            <DefBlock label="Pruning vs Regularisation — the Deep Connection">
                Cost-complexity pruning with parameter α is structurally identical to L2 regularisation with parameter λ:<br /><br />
                Decision tree: min R(T) + α·|T| — penalises number of leaves<br />
                Ridge regression: min ‖y − Xβ‖² + λ‖β‖² — penalises coefficient magnitude<br />
                Neural network dropout: randomly prune neurons at rate p — penalises joint co-activation<br /><br />
                All three control model complexity by adding a term that penalises the model for being "too large", with a tunable strength (α, λ, p). The optimal strength is found by cross-validation in all three cases.
            </DefBlock>

            <div className="ch-callout">
                <strong>Chapter 4 complete.</strong> Decision trees gave machine learning its first interpretable supervised learning algorithm (ID3, 1979), its first statistically rigorous formulation (CART, 1984), and its first explicit connection between regularisation and generalisation (pruning, 1984). The three core ideas — entropy/Gini as splitting criteria, binary recursive partitioning, cost-complexity regularisation — reappear in every generation of ML algorithms. Chapter 5 introduces the next paradigm: instead of asking yes/no questions, learn a smooth non-linear function by propagating error gradients through layers of connected units. That algorithm — backpropagation — was published in 1986, two years after CART.
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
