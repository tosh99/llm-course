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
            year: "1989 – 1990",
            title: "Kearns & Valiant — The Boosting Hypothesis",
            challenge:
                "PAC learning theory (Valiant, 1984) defined two classes of learnable functions: those learnable by a weak learner — barely better than random — and those learnable by a strong learner — reliably accurate to any desired precision. Michael Kearns and Leslie Valiant posed the fundamental question: are these two classes the same? Can any algorithm that performs slightly better than random guessing be 'boosted' into an arbitrarily accurate strong learner, given enough examples?",
            what:
                "Kearns and Valiant conjectured the answer was yes. Robert Schapire (1990) proved it constructively in his Stanford PhD thesis: he showed that any weak learning algorithm could be combined with resampling to produce an accurate strong classifier. The construction trained three copies of the weak learner — one on the original data, one on examples where the first disagreed with random guessing, and one as a tiebreaker — and combined their majority votes. The proof was existence-theoretic; the resulting algorithm was not yet practical. But the result was astonishing: accuracy is not a fixed property of an algorithm — it can be amplified without limit.",
            impact:
                "Schapire's proof reshaped how the theoretical ML community thought about learning. It showed that the complexity gap between 'barely useful' and 'arbitrarily accurate' was illusory — bridgeable by combining multiple weak predictions. This was the theoretical seed that would blossom into AdaBoost, gradient boosting, and eventually Random Forests. The boosting paradigm also influenced the attention mechanism in Transformers: the weighted combination of multiple weak attention patterns to form a strong global representation is philosophically analogous to boosting.",
        },
        {
            year: "1996 – 1997",
            title: "Freund & Schapire — AdaBoost",
            challenge:
                "Schapire's 1990 boosting algorithm required training on three separate fixed data splits and didn't adapt to the difficulty of individual examples. It also required knowing the number of rounds in advance and assumed the weak learner's error rate was known. A practical algorithm needed to work adaptively — spending more effort on the examples that the current ensemble was getting wrong — without requiring any knowledge of the weak learner's performance in advance.",
            what:
                "Yoav Freund and Robert Schapire introduced AdaBoost (Adaptive Boosting), first presented at COLT 1996 and published in the Journal of Computer and System Sciences in 1997. The algorithm maintains a weight distribution over training examples. After each round: (1) train a weak classifier h_t on the weighted sample; (2) compute its weighted error epsilon_t; (3) set its voting weight alpha_t = (1/2) ln((1 − epsilon_t) / epsilon_t); (4) increase the weight of misclassified examples by a factor exp(alpha_t) and decrease correctly classified ones, then renormalise. The final classifier is H(x) = sign(sum_t alpha_t h_t(x)). The algorithm requires only that each weak learner performs better than chance — epsilon_t &lt; 0.5.",
            impact:
                "AdaBoost won the Gödel Prize in 2003 for its theoretical importance. Empirically, it was remarkably effective: Viola and Jones used AdaBoost to build the first real-time face detector (2001), which ran on a Pentium III and was deployed in millions of digital cameras and webcams. AdaBoost also revealed its underlying loss function — it minimises the exponential loss exp(−y · F(x)) — a connection discovered by Friedman, Hastie, and Tibshirani (2000) that opened the door to the statistical interpretation and gradient boosting.",
        },
        {
            year: "2001",
            title: "Viola & Jones — Real-Time Face Detection",
            challenge:
                "Face detection from images — finding the bounding boxes of all faces in an arbitrary photograph — was a solved problem in principle but impossibly slow in practice. Exhaustive sliding-window approaches evaluated thousands of window positions and scales per image, each requiring a heavy classifier. Running a neural network at every position was computationally intractable for real-time use on consumer hardware.",
            what:
                "Paul Viola and Michael Jones combined three ideas into a practical detector. First, Haar-like features (differences of rectangular region sums) computed instantly via integral images in O(1) per feature. Second, AdaBoost to select a small cascade of features (200 from 160,000 candidates) that together achieved high accuracy. Third, an attentional cascade: simple stages reject most windows immediately; only promising windows pass to later, harder stages. On a 384x288 image, the cascade evaluated an average of 10 features per window position — 300x fewer than a single-stage classifier.",
            impact:
                "The Viola-Jones detector ran at 15 frames per second on a Pentium III and had an 80% detection rate with 1 false alarm per 500 windows. It was so far ahead of competing methods that it became the standard face detector and was shipped in Canon, Nikon, Fuji, and Sony digital cameras from 2005 to 2015. The cascade architecture — reject easy negatives early, scrutinise hard positives later — directly influenced modern neural architectures: early exit networks, the encoder layers that gate which tokens receive full attention, and cascade detectors in production vision systems.",
        },
        {
            year: "2001",
            title: "Friedman — Gradient Boosting Machines",
            challenge:
                "AdaBoost's exponential loss made it sensitive to outliers and noisy labels, and the algorithm was limited to binary classification. Extending boosting to regression, multi-class classification, and robust loss functions required reinterpreting boosting more generally, as an optimisation problem rather than a resampling trick.",
            what:
                "Jerome Friedman reframed boosting as gradient descent in function space. The prediction F(x) is a function built iteratively: at each step, compute the negative gradient of the loss function at the current predictions — the 'pseudo-residuals' — then fit a new regression tree to these pseudo-residuals, and add it to the ensemble with a small weight eta (the learning rate / shrinkage factor). For mean squared error loss, pseudo-residuals are ordinary residuals y_i − F(x_i). For cross-entropy, they are deviance residuals. Any differentiable loss function yields a valid boosting algorithm. Friedman also introduced stochastic gradient boosting: fit each tree on a random subsample of training data, which reduced variance and improved generalisation.",
            impact:
                "Gradient Boosted Trees became the foundation for XGBoost (Chen & Guestrin, 2016), LightGBM (Microsoft, 2017), and CatBoost (Yandex, 2018). XGBoost won hundreds of Kaggle competitions between 2014 and 2018 and remains the dominant algorithm on structured tabular data. On medical records, financial transactions, and user behaviour logs, gradient boosted trees consistently outperform neural networks while being orders of magnitude cheaper to train and requiring no GPU. The next topic — Random Forests — takes a parallel rather than sequential approach to the same goal of combining many trees.",
        },
        {
            year: "2016",
            title: "Chen & Guestrin — XGBoost and the Modern Boosting Stack",
            challenge:
                "Friedman's gradient boosting was powerful but slow and memory-intensive. Standard implementations loaded the entire dataset into memory, evaluated all features at all split points, and ran sequentially. As datasets grew to millions of rows and thousands of features, gradient boosting became impractical for real-time ML pipelines.",
            what:
                "Tianqi Chen and Carlos Guestrin published XGBoost (eXtreme Gradient Boosting), adding a second-order Taylor approximation of the loss (using both gradient and Hessian), L1 and L2 regularisation on leaf weights, column subsampling (like Random Forests), cache-aware block storage for fast split finding, and out-of-core computation for datasets that don't fit in memory. The result trained 10x faster than naive gradient boosting on equivalent hardware. XGBoost also added a built-in missing value handler and native support for GPU training.",
            impact:
                "XGBoost became the most cited ML software paper in history for several years. Its success validated that the engineering details of a well-known algorithm matter as much as the mathematical novelty. This engineering-first lesson influenced the development of PyTorch (vs the mathematically equivalent Theano), efficient Transformer implementations (Flash Attention), and the entire MLOps movement: production ML systems are optimised systems, not research prototypes.",
        },
        {
            year: "2001 – present",
            title: "Bias-Variance Decomposition of Boosting",
            challenge:
                "Boosting was empirically effective, but for years its theoretical properties were puzzling. Unlike Random Forests which clearly reduced variance, boosting appeared to reduce bias — adding more weak learners kept improving test accuracy even after training error reached zero. Conventional wisdom said more complex models should overfit; boosting seemed to defy this.",
            what:
                "Analysis by Friedman, Hastie, and Tibshirani (2000) and Schapire et al. (1998) showed that boosting primarily reduces bias — it incrementally corrects systematic errors of the current ensemble — while Random Forests primarily reduce variance. The margin theory (Schapire et al.) showed that AdaBoost continues improving test error by increasing the margin even after zero training error, explaining resistance to overfitting. Bias decomposition: each new tree corrects where F_&#123;m-1&#125;(x) was wrong; variance is controlled by the shrinkage (learning rate eta) and the number of trees.",
            impact:
                "The bias-variance analysis of boosting unified the theoretical understanding of ensembles. Random Forests and gradient boosting are complementary tools for the two components of prediction error: Random Forests for high-variance problems (noisy data, small n), gradient boosting for high-bias problems (complex patterns, large n). This framework remains the primary theoretical lens for understanding when to use which ensemble method today.",
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
            <h2>A committee of slightly-wrong experts that somehow gets it right</h2>

            <p className="ch-story-intro">
                SVMs found the single best boundary with the most margin. AdaBoost took a completely different approach: instead of one great classifier, use hundreds of terrible ones — each barely better than guessing — and combine them in a way that amplifies their collective accuracy. The result is one of the most elegant algorithms in all of machine learning, and it launched the entire ensemble learning era.
            </p>

            <Analogy label="The weak learner — a barely useful rule">
                Imagine trying to identify spam emails. A simple rule: "if the word FREE appears, guess spam." This rule is right maybe 60% of the time. Machine learning calls this a <strong>weak learner</strong>: better than random guessing (50%), but nowhere near reliable.
                <br /><br />
                AdaBoost's core insight: you do not need one great rule. You need hundreds of bad rules, combined the right way. Each rule only has to be slightly better than guessing — even 51% correct is enough to build an arbitrarily accurate classifier from.
            </Analogy>

            <Analogy label="Round 1 — learn from everyone equally">
                Start with all training examples equally important. Train your weak learner (one simple rule). It gets 60% right. Now identify which 40% it got wrong — and make those more important for the next round.
                <br /><br />
                The key: you are not throwing out the wrong examples. You are making the algorithm pay more attention to them in the next round.
            </Analogy>

            <Analogy label="Round 2 — focus on what the first rule missed">
                Train a new weak learner on the re-weighted data. It is forced to focus on the hard cases the first rule missed. Maybe it learns a different rule: "if the email mentions a lottery, guess spam." This rule might only be 58% accurate overall — but it is good at the specific cases the first rule struggled with.
                <br /><br />
                Each round, the new rule is specialised at correcting the previous round's mistakes. After 100 rounds you have 100 rules, each patching a different gap.
            </Analogy>

            <Analogy label="The final vote — weighted by how accurate each rule was">
                AdaBoost combines all 100 rules into a final decision: each rule gets a vote, but more accurate rules get louder votes. A rule that was 70% accurate gets a bigger say than one that was 51% accurate.
                <br /><br />
                The remarkable mathematical guarantee: even though every individual rule is barely better than random, the combined classifier can be made arbitrarily accurate — as long as each rule beats random by even a tiny margin.
            </Analogy>

            <Analogy label="Gradient Boosting — the statistical upgrade">
                Jerome Friedman (2001) reinterpreted AdaBoost as gradient descent. Instead of upweighting misclassified examples, you directly fit the next tree to the errors (residuals) of the current ensemble. Each tree corrects exactly where the previous ensemble was wrong — like a student who reviews only the problems they got wrong rather than re-studying everything.
                <br /><br />
                After 100 trees, each correcting the previous 99's mistakes, you get a cumulative predictor that has reduced its error round by round. This sequential, mistake-correcting approach became XGBoost — the algorithm that won more Kaggle competitions than any other before the deep learning era, and still dominates on tabular data today.
            </Analogy>
        </>
    )
}

// ── High School Tab ──────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>AdaBoost Convergence — Training Error Bound</h3>
            <p>
                Let gamma_t = 0.5 − epsilon_t be the "edge" of weak classifier t above chance. AdaBoost's training error satisfies:
            </p>
            <MathBlock tex="\text{Train error} \leq \prod_{t=1}^T 2\sqrt{\varepsilon_t(1-\varepsilon_t)} = \prod_{t=1}^T \sqrt{1 - 4\gamma_t^2} \leq \exp\!\left(-2\sum_{t=1}^T \gamma_t^2\right)" />
            <p>
                If each classifier has edge gamma (same edge every round), the bound is exp(−2T*gamma^2). Even with very weak classifiers (gamma = 0.01), training error reaches near-zero in about 5,000 rounds. The bound is tight: this exponential decrease is achieved in practice.
            </p>

            <h3>Exponential Loss and the Functional Gradient</h3>
            <p>
                The weight update rule is equivalent to greedy minimisation of exponential loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\exp}(F) = \sum_{i=1}^n \exp(-y_i F(x_i)) \quad \text{where } F = \sum_t \alpha_t h_t" />
            <p>
                The functional gradient of L_exp with respect to F(x_i) is −y_i exp(−y_i F(x_i)) = −w_i y_i (up to normalisation). Fitting the next h_t to minimise the weighted error is equivalent to taking a functional gradient step.
            </p>

            <h3>Gradient Boosting — General Loss Functions</h3>
            <MathBlock tex="r_{im} = -\left[\frac{\partial L(y_i,\, F(x_i))}{\partial F(x_i)}\right]_{F = F_&#123;m-1&#125;}" />
            <p>
                Fit regression tree h_m to pseudo-residuals r_im. Update F_m(x) = F_&#123;m-1&#125;(x) + eta * h_m(x). The learning rate eta controls shrinkage. For MSE loss L = (y − F)^2 / 2: pseudo-residuals are exactly y_i − F_&#123;m-1&#125;(x_i). For log-loss (binary classification): r_im = y_i − sigma(F_&#123;m-1&#125;(x_i)).
            </p>

            <h3>XGBoost — Second-Order Taylor Approximation</h3>
            <MathBlock tex="\mathcal{L}^{(m)} \approx \sum_{i=1}^n \left[g_i h(x_i) + \frac{1}{2} \text{Hess}_i\, h(x_i)^2\right] + \Omega(h)" />
            <p>
                where g_i = dL/dF_&#123;m-1&#125;(x_i) (gradient), Hess_i = d²L/dF_&#123;m-1&#125;(x_i)² (Hessian), and Omega(h) = (lambda/2) sum(leaf_weights^2) + gamma * T (L2 + complexity regularisation). This second-order approximation enables computing the optimal leaf weight analytically: w_j* = −(sum_&#123;i in leaf j&#125; g_i) / (sum_&#123;i in leaf j&#125; Hess_i + lambda).
            </p>
        </>
    )
}

const PY_ADABOOST = `import numpy as np

# ── Decision Stump — the canonical weak learner ───────────────────────────────
class DecisionStump:
    """Depth-1 decision tree: split on a single feature at a threshold."""

    def __init__(self):
        self.feature = None
        self.threshold = None
        self.polarity = 1

    def fit(self, X, y, weights):
        n, d = X.shape
        best_err = float("inf")

        for feat in range(d):
            thresholds = np.unique(X[:, feat])
            for thresh in thresholds:
                for polarity in [1, -1]:
                    pred = polarity * np.where(X[:, feat] >= thresh, 1, -1)
                    # Weighted error
                    err = np.sum(weights * (pred != y))
                    if err < best_err:
                        best_err = err
                        self.feature = feat
                        self.threshold = thresh
                        self.polarity = polarity
        return self

    def predict(self, X):
        return self.polarity * np.where(
            X[:, self.feature] >= self.threshold, 1, -1
        )


# ── AdaBoost ──────────────────────────────────────────────────────────────────
class AdaBoost:
    """
    Freund & Schapire (1997) AdaBoost algorithm.
    Weak learner: DecisionStump (decision tree of depth 1).
    """

    def __init__(self, n_estimators=50):
        self.n_estimators = n_estimators
        self.classifiers = []
        self.alphas = []

    def fit(self, X, y):
        n = len(y)
        weights = np.ones(n) / n   # Uniform initial weights

        for t in range(self.n_estimators):
            # Train weak learner on weighted sample
            clf = DecisionStump().fit(X, y, weights)
            pred = clf.predict(X)

            # Weighted error
            eps = np.sum(weights * (pred != y))
            eps = np.clip(eps, 1e-10, 1 - 1e-10)  # avoid log(0)

            # Classifier weight
            alpha = 0.5 * np.log((1 - eps) / eps)

            # Update sample weights: increase for misclassified
            weights *= np.exp(-alpha * y * pred)
            weights /= weights.sum()   # Renormalise

            self.classifiers.append(clf)
            self.alphas.append(alpha)

            if t % 10 == 0:
                train_pred = self.predict(X)
                train_err = (train_pred != y).mean()
                print(f"Round {t:3d} | eps={eps:.3f} | alpha={alpha:.3f} "
                      f"| train_err={train_err:.3f}")

        return self

    def predict(self, X):
        # Weighted vote: sum(alpha_t * h_t(x))
        F = sum(a * clf.predict(X) for a, clf in zip(self.alphas, self.classifiers))
        return np.sign(F)


# ── Demo on binary classification ─────────────────────────────────────────────
np.random.seed(42)
X_pos = np.random.randn(100, 2) + np.array([1, 0])
X_neg = np.random.randn(100, 2) + np.array([-1, 0])
X = np.vstack([X_pos, X_neg])
y = np.array([1]*100 + [-1]*100)

print("Training AdaBoost with 50 decision stumps:")
print("=" * 55)
model = AdaBoost(n_estimators=50).fit(X, y)
final_acc = (model.predict(X) == y).mean()
print(f"\nFinal training accuracy: {final_acc*100:.1f}%")
print(f"Number of classifiers: {len(model.classifiers)}")
print(f"Alpha range: [{min(model.alphas):.3f}, {max(model.alphas):.3f}]")`

function PythonContent() {
    return (
        <>
            <p>
                Pure NumPy implementation of AdaBoost with decision stumps as weak learners. Demonstrates weight updating, alpha computation, and the weighted majority vote.
            </p>
            <CodeBlock code={PY_ADABOOST} filename="adaboost_demo.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observation:</strong> Watch the training error collapse exponentially as rounds increase — even though each individual stump is barely better than 50% accuracy. This is the boosting phenomenon: accuracy amplified from weak learners without any increase in model complexity per learner.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Adaptive boosting — sequential error correction</h2>

            <h3>The AdaBoost Algorithm</h3>
            <p>
                Initialise sample weights w_i = 1/n. For t = 1, ..., T:
            </p>
            <ol>
                <li>Train weak classifier h_t on the weighted training set &#123;(x_i, y_i, w_i)&#125;</li>
                <li>Compute weighted error: epsilon_t = sum_i w_i * 1[h_t(x_i) != y_i]</li>
                <li>Compute classifier weight: alpha_t = (1/2) * ln((1 − epsilon_t) / epsilon_t)</li>
                <li>Update weights: w_i &lt;— w_i * exp(−alpha_t * y_i * h_t(x_i)), then normalise</li>
            </ol>
            <p>
                Final classifier: H(x) = sign(sum_t alpha_t h_t(x)). Note alpha_t &gt; 0 when epsilon_t &lt; 0.5 — only classifiers that beat random get positive weight.
            </p>

            <h3>Loss Function Interpretation</h3>
            <p>
                AdaBoost minimises the exponential loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\exp} = \sum_{i=1}^n \exp(-y_i \cdot F(x_i)) \quad \text{where } F = \sum_t \alpha_t h_t" />
            <p>
                The weight update w_i &lt;— w_i * exp(−alpha_t y_i h_t(x_i)) is exactly the gradient of L_exp: examples with y_i F(x_i) small (near the decision boundary) get the highest weights. This is greedy coordinate descent in function space.
            </p>

            <h3>Gradient Boosting — Generalisation to Any Loss</h3>
            <p>
                For any differentiable loss L(y, F(x)), the pseudo-residual at iteration m is the negative gradient of the loss:
            </p>
            <MathBlock tex="r_{im} = -\left[\frac{\partial L(y_i, F(x_i))}{\partial F(x_i)}\right]_{F=F_&#123;m-1&#125;}" />
            <p>
                Fit tree h_m to pseudo-residuals. Update: F_m(x) = F_&#123;m-1&#125;(x) + eta * h_m(x). Shrinkage eta prevents any single tree from overfitting. For MSE loss, r_im = y_i − F_&#123;m-1&#125;(x_i) — the ordinary residual.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Training error bound:</strong> AdaBoost's training error decreases exponentially in T: Train error &lt;= exp(−2 * sum_t gamma_t^2) where gamma_t = 0.5 − epsilon_t is the edge of each weak classifier above chance. Even with weak classifiers (gamma_t = 0.01), training error reaches zero in O(1/gamma^2) rounds. This theoretical guarantee was unprecedented in ML and made AdaBoost the first algorithm with explicit convergence guarantees tied to weak learner quality — winning the Gödel Prize in 2003.
            </div>

            <DefBlock label="AdaBoost vs Gradient Boosting vs XGBoost">
                AdaBoost: re-weights examples; exponential loss; binary only; no learning rate; no regularisation<br /><br />
                Gradient Boosting: fits residuals; any differentiable loss; regression and multi-class; learning rate eta<br /><br />
                XGBoost: adds L1+L2 leaf regularisation, second-order (Hessian) approximation, column subsampling, GPU support, missing value handling — the production version that won hundreds of Kaggle competitions
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

export const ADABOOST_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
