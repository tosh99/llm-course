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
            year: "1989 – 1990",
            title: "Kearns & Valiant — The Boosting Hypothesis",
            challenge:
                "PAC learning theory (Valiant, 1984) defined two classes of learnable functions: those learnable by a 'weak' learner — barely better than random — and those learnable by a 'strong' learner — reliably accurate. Kearns and Valiant (1989) posed the question: are these two classes the same? Can any weak learner, given enough examples, be 'boosted' into an arbitrarily accurate strong learner?",
            what:
                "Kearns and Valiant conjectured the answer was yes, and Schapire (1990) proved it constructively: he showed that any weak learning algorithm could be combined with resampling to produce an accurate classifier, by training three copies of the weak learner on different data splits and combining their votes. The proof was non-constructive and the resulting algorithm was slow — but the existence of boosting was established.",
            impact:
                "Schapire's proof was the theoretical seed that would blossom into AdaBoost. The key insight: accuracy is not a fixed property of an algorithm — it can be amplified by combining many weak predictions. This was deeply counterintuitive, and it shaped how ML practitioners thought about ensemble methods: the whole is not just greater than the sum of its parts; it can be arbitrarily greater.",
        },
        {
            year: "1996",
            title: "Freund & Schapire — AdaBoost",
            challenge:
                "Schapire's 1990 boosting algorithm required training on three separate data splits and didn't adapt to the difficulty of individual training examples. It also required knowing in advance how many rounds to run. A practical boosting algorithm needed to work adaptively — spending more effort on the examples that were hard to classify.",
            what:
                "Yoav Freund and Robert Schapire introduced AdaBoost (Adaptive Boosting). Train a sequence of weak classifiers h₁, h₂, ..., h_T. After each round, increase the weight of misclassified examples (so the next classifier focuses on the hard cases) and decrease the weight of correctly classified ones. The final classifier is a weighted vote: H(x) = sign(Σ αt ht(x)), where αt = ½ log((1−εt)/εt) gives more weight to more accurate classifiers. The whole algorithm requires only a weak learner that performs slightly better than chance.",
            impact:
                "AdaBoost won the Gödel Prize (2003) for theoretical importance. Empirically, it was remarkably effective: Viola and Jones used it to build the first real-time face detector (2001), which ran on a Pentium III and was deployed in millions of digital cameras. AdaBoost also revealed its loss function: it minimises the exponential loss exp(−y·H(x)), a connection discovered by Friedman, Hastie, and Tibshirani (2000) that enabled the statistical interpretation and led directly to gradient boosting.",
        },
        {
            year: "2001",
            title: "Friedman — Gradient Boosting Machines",
            challenge:
                "AdaBoost minimised exponential loss, which made it sensitive to noisy labels and worked only for binary classification. Extending boosting to regression and multi-class problems required reinterpreting it more generally.",
            what:
                "Jerome Friedman reframed boosting as gradient descent in function space. The prediction F(x) is a function built iteratively: at each step, fit a new tree to the negative gradient of the loss function (the pseudo-residuals) and add it to the ensemble with a small weight η (learning rate / shrinkage). For squared error loss, the pseudo-residuals are just the ordinary residuals yᵢ − Fₘ₋₁(xᵢ). For classification, they are the deviance residuals. Any differentiable loss function becomes a valid boosting algorithm.",
            impact:
                "Gradient Boosted Trees became the foundation for XGBoost (2016), LightGBM (2017), and CatBoost (2018) — the dominant algorithms in tabular ML competitions. XGBoost won hundreds of Kaggle competitions. On structured data (medical records, financial transactions, user behaviour logs), gradient boosted trees consistently outperform neural networks while being orders of magnitude cheaper to train. The next topic — Random Forests — takes a different approach to the same goal: parallel rather than sequential, decorrelated rather than boosted.",
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
            <h2>A committee of wrong experts that somehow gets it right</h2>

            <p className="ch-story-intro">
                SVMs found the single best boundary with the most margin. AdaBoost took a completely different approach: instead of one great classifier, use hundreds of terrible ones — each barely better than guessing — and combine them in a clever way that amplifies their collective accuracy. The result is one of the most elegant algorithms in all of machine learning.
            </p>

            <Analogy label="The weak learner — a barely useful expert">
                Imagine you're trying to figure out if an email is spam. A simple rule might be: "if the word FREE appears, guess spam." This rule is barely better than guessing — it's right maybe 60% of the time. Machine learning calls this a <strong>weak learner</strong>: better than random, but not reliable.
                <br /><br />
                AdaBoost's key insight: you don't need one great rule. You need many bad rules, combined the right way.
            </Analogy>

            <Analogy label="Round 1 — focus on what's easy">
                Start with all training emails equally important. Train the weak learner (one simple rule). It gets 60% right. Now: upweight the 40% it got wrong. Make them "more important" for the next round.
            </Analogy>

            <Analogy label="Round 2 — focus on what the first rule missed">
                Now train a new weak learner on the re-weighted data — it's forced to focus on the hard cases the first rule struggled with. Maybe it learns a different rule: "if the email mentions a lottery, guess spam." This new rule might only get 58% right overall — but it's good at the specific cases the first rule missed.
            </Analogy>

            <Analogy label="The final vote — weighted by accuracy">
                After 100 rounds, you have 100 simple rules. AdaBoost combines them into a final decision: each rule gets a vote, but accurate rules get louder votes. A rule that was 70% accurate gets more weight than one that was 51% accurate.
                <br /><br />
                The surprising mathematical result: even though each individual rule is barely better than guessing, the combined classifier can be arbitrarily accurate — as long as each individual rule is at least slightly better than chance.
            </Analogy>

            <Analogy label="Gradient Boosting — the statistical version">
                Friedman (2001) reinterpreted AdaBoost as gradient descent. Instead of upweighting misclassified examples, you directly fit the next tree to the errors (residuals) of the current ensemble. This way: each tree corrects exactly where the previous ensemble was wrong. After 100 trees, you have a cumulative prediction that has reduced its error round by round — just like a human learning from mistakes.
                <br /><br />
                This sequential, mistake-correcting approach became XGBoost — the algorithm that won more ML competitions than any other before the deep learning era.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Adaptive boosting — sequential error correction</h2>

            <h3>AdaBoost Algorithm</h3>
            <p>
                Initialise sample weights: wᵢ = 1/n. For t = 1, ..., T:
            </p>
            <ol>
                <li>Train weak classifier hₜ on weighted sample {"{(xᵢ, yᵢ, wᵢ)}"}</li>
                <li>Compute weighted error: εₜ = Σᵢ wᵢ · 𝟙[hₜ(xᵢ) ≠ yᵢ]</li>
                <li>Compute classifier weight: αₜ = ½ ln((1−εₜ)/εₜ) &gt; 0 when εₜ &lt; 0.5</li>
                <li>Update sample weights: wᵢ ← wᵢ · exp(−αₜ yᵢ hₜ(xᵢ)), then normalise</li>
            </ol>
            <p>
                Final classifier: H(x) = sign(Σₜ αₜ hₜ(x))
            </p>

            <h3>Loss Function Interpretation</h3>
            <p>
                AdaBoost minimises the exponential loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\exp} = \sum_{i=1}^n \exp(-y_i \cdot F(x_i)) \quad \text{where } F = \sum_t \alpha_t h_t" />
            <p>
                The weight update rule wᵢ ← wᵢ · exp(−αₜ yᵢ hₜ(xᵢ)) is exactly the gradient of L_exp with respect to each sample's contribution — greedy gradient descent in function space.
            </p>

            <h3>Gradient Boosting — Generalisation</h3>
            <p>
                For any differentiable loss L(y, F(x)), the pseudo-residual of the m-th iteration is:
            </p>
            <MathBlock tex="r_{im} = -\left[\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}\right]_{F=F_{m-1}}" />
            <p>
                Fit tree hₘ to the pseudo-residuals. Update: Fₘ(x) = F&#123;m−1&#125;(x) + η·hₘ(x). Shrinkage η (learning rate) prevents any single tree from overfitting. For MSE loss, rᵢₘ = yᵢ − Fₘ₋₁(xᵢ) — the ordinary residual.
            </p>

            <DefBlock label="AdaBoost vs Gradient Boosting">
                AdaBoost: re-weights training examples; minimises exp loss; binary classification only; no learning rate<br />
                Gradient Boosting: fits residuals; any differentiable loss; regression and multi-class; learning rate η controls shrinkage<br />
                XGBoost: adds L2 regularisation on leaf weights, second-order Taylor approximation of loss, column subsampling, hardware parallelism — the production version
            </DefBlock>

            <div className="ch-callout">
                <strong>Training error bound:</strong> AdaBoost's training error decreases exponentially in T (number of rounds): Training error ≤ exp(−2Σₜ γₜ²) where γₜ = 0.5 − εₜ is the edge of each weak classifier above chance. Even with weak classifiers (γₜ = 0.01), training error reaches zero in O(1/γ²) rounds. This theoretical guarantee was unprecedented in ML and made AdaBoost the first algorithm with explicit convergence guarantees tied to the quality of weak learners.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const ADABOOST_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
