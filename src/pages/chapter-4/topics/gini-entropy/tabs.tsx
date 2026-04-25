import { Analogy, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1948",
            title: "Shannon — Entropy as the Measure of Uncertainty",
            challenge:
                "Shannon (Chapter 2) defined entropy H(X) = −Σ p(x) log₂ p(x) to measure how much information a random variable carries. This was a communication-theory concept. No one had yet connected it to the problem of learning decision rules from data. The connection was implicit — information gain reduces uncertainty — but it took Quinlan to make it explicit and algorithmic.",
            what:
                "Shannon's entropy has a direct interpretation for a labelled dataset: H(S) measures the expected number of bits needed to describe the class label of a randomly chosen example from S. A pure set (all examples the same class) has H = 0. A perfectly balanced two-class set has H = 1 bit. Quinlan's information gain IG(S, A) = H(S) − E_A[H(S_v)] is the reduction in expected description length achieved by learning attribute A — exactly the concept of a 'useful question' formalised.",
            impact:
                "The ID3 information-gain criterion made the connection between Shannon's communication theory and supervised learning explicit. Learning a decision tree is equivalent to building a compression code: a good tree compresses the label description (few bits per example after the questions) by asking questions that maximally reduce uncertainty. This is why cross-entropy — Shannon's H(p, q) — is the loss function for every classification neural network.",
        },
        {
            year: "1912 / 1927",
            title: "Gini — Impurity from Economics to Statistics",
            challenge:
                "Corrado Gini, an Italian statistician, introduced his coefficient in 1912 to measure income inequality — the probability that two randomly selected people from a population have different incomes. Later applied to any distribution, it measures heterogeneity: how likely are two random draws to be different? This was a statistical concept with no connection to machine learning until Breiman's CART (1984) adopted it as the classification splitting criterion.",
            what:
                "Gini impurity for a node with proportions p₁, ..., pK: Gini(t) = 1 − Σ pₖ². This equals the probability of misclassifying a randomly selected example if you assigned it a class randomly according to the distribution pₖ. It is computationally simpler than entropy (no logarithms), always between 0 and (1 − 1/K), and its gradient exists everywhere (no logarithm singularity at p → 0).",
            impact:
                "The choice between Gini and entropy is one of the longest-running debates in decision tree literature, almost entirely settled by empirical comparisons: the two criteria agree on the winning split in over 97% of cases. The real differences are at edge cases with very unequal class distributions. Gini's computational advantage matters at scale (many thousands of splits evaluated per tree), making it the default in all production decision tree libraries including scikit-learn.",
        },
        {
            year: "1984 – 1986",
            title: "CART vs C4.5 — A Natural Experiment in Splitting Criteria",
            challenge:
                "CART (1984) used Gini impurity with binary splits. C4.5 (1986) used entropy with multi-way splits and gain ratio normalisation. Both were developed independently, both achieved excellent results, and both became heavily used. The ML community had an accidental natural experiment: two well-implemented algorithms, identical in spirit, differing mainly in their impurity criterion and branching factor.",
            what:
                "Empirical comparisons showed: (1) Gini and entropy produce nearly identical trees; (2) binary vs multi-way splits is more impactful — multi-way splits can lead to more interpretable trees but are more prone to data fragmentation; (3) gain ratio normalisation matters when features have very different cardinalities; (4) cross-validation for pruning threshold selection (CART) is more reliable than pessimistic error estimates (C4.5). These findings are still standard practice.",
            impact:
                "The CART vs C4.5 comparison taught the field a crucial lesson: the impurity criterion is secondary; the regularisation mechanism (pruning, gain ratio) is primary. This principle — that the choice of loss function matters less than the choice of regularisation — would later appear in neural networks as the observation that SGD noise acts as implicit regularisation regardless of whether the loss is cross-entropy or MSE. The next topic — pruning — examines this regularisation mechanism directly.",
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
                Before asking any question, the training data is a pile of mixed examples. We want to split this pile into two sub-piles that are each more organised — more pure. The splitting criterion is a number that measures how "messy" or "pure" a pile is. The lower the number after splitting, the better the question.
                <br /><br />
                Two different teams came up with two different numbers: Quinlan's team used <strong>entropy</strong>. Breiman's team used <strong>Gini impurity</strong>. Both measure the same thing — how mixed a pile is — using different formulas.
            </Analogy>

            <Analogy label="Entropy — measuring surprise">
                Entropy asks: if I pick a random example from this pile and you have to guess its label, how many bits of information would I need to tell you the answer?
                <br /><br />
                Pure pile (all cats): you already know the answer. 0 bits. 50/50 cats and dogs: you need 1 full bit to decide. Maximum entropy for 2 classes.
                <br /><br />
                It comes directly from Shannon's 1948 formula: H = −Σ p log₂(p). Shannon invented it to measure the information in a communication channel. Quinlan applied it to measure the information in a dataset.
            </Analogy>

            <Analogy label="Gini impurity — measuring disagreement">
                Gini asks: if I randomly pick two examples from this pile, what's the probability they have different labels?
                <br /><br />
                Pure pile (all cats): picking two cats → always the same. Gini = 0. 50/50 cats and dogs: half the time you'll pick a cat and a dog. Gini = 0.5. Maximum.
                <br /><br />
                Simpler to compute (no logarithms) and tells a cleaner story: how often would random labelling be wrong?
            </Analogy>

            <Analogy label="Why they almost always agree">
                Both entropy and Gini are largest at 50/50 and zero at pure. They're both symmetric and bowl-shaped curves. When you're searching for the best split — trying thousands of possible threshold values — both measures rank the candidates nearly identically.
                <br /><br />
                The rare cases where they disagree: when one class is extremely rare (1% vs 99%), entropy is slightly more sensitive to purity violations. In practice, the difference in final accuracy is almost always less than 0.1%. The choice between them is like choosing between two slightly different rulers — the measurement is nearly the same.
            </Analogy>

            <Analogy label="The real question — how much to split">
                Both Gini and entropy tell you the best split at each node. But they don't tell you when to stop splitting. A tree that splits until every leaf has exactly one training example will have perfect training accuracy — and terrible test accuracy.
                <br /><br />
                That is the problem of pruning — our next topic.
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
                H is maximised at uniform distribution (log₂K bits) and minimised at 0 for a pure node. Information gain of split (j, s) on set S:
            </p>
            <MathBlock tex="\text{IG} = H(S) - \frac{N_L}{N} H(L) - \frac{N_R}{N} H(R)" />

            <h3>Gini Impurity</h3>
            <MathBlock tex="\text{Gini}(t) = 1 - \sum_{k=1}^K p_k^2 = \sum_{k \neq j} p_k p_j \quad \in \left[0,\; 1 - \tfrac{1}{K}\right]" />
            <p>
                Gini impurity equals the probability that two randomly selected examples have different labels. Gini reduction of split (j, s):
            </p>
            <MathBlock tex="\Delta\text{Gini} = \text{Gini}(S) - \frac{N_L}{N}\text{Gini}(L) - \frac{N_R}{N}\text{Gini}(R)" />

            <h3>Mathematical Relationship</h3>
            <p>
                Both are concave, symmetric, zero at pure nodes. Via Taylor expansion of H around 0.5:
            </p>
            <MathBlock tex="H(p) \approx \log 2 - \frac{(\log 2)^2}{2}(2p-1)^2 + \cdots" />
            <p>
                Gini(p) = 2p(1−p). Both are maximised at p = 0.5 and zero at p = 0 or 1. Their optimal splits differ when one class strongly dominates: entropy is more sensitive in the tail (near pure nodes), Gini is more sensitive in the middle. Empirically (Raileanu & Stoffel 2004): they agree on the winning feature in 97.3% of splits.
            </p>

            <h3>Why Cross-Entropy Is Entropy</h3>
            <p>
                The cross-entropy loss used to train a K-class neural network:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{CE}} = -\sum_{k=1}^K y_k \log \hat{p}_k" />
            <p>
                For one-hot labels (y_k = 1 for the true class, 0 otherwise): L_CE = −log p̂_true. At a leaf, if the model assigns p̂_k = p_k (the class proportion), the average loss equals H(p₁,...,pK) — exactly the entropy of the node. Minimising cross-entropy loss in neural networks is exactly minimising entropy of the prediction distribution at each training example — the same as ID3, applied continuously instead of discretely.
            </p>

            <DefBlock label="Quick Reference">
                Entropy: H = −Σ pₖ log₂ pₖ. Gradient at p: −log₂ p − 1/ln(2)<br />
                Gini: G = 1 − Σ pₖ². Gradient at pₖ: −2pₖ<br />
                IG: IG = H(parent) − weighted mean H(children)<br />
                ΔGini: ΔG = G(parent) − weighted mean G(children)<br />
                Agreement rate: 97.3% of splits have the same winning feature
            </DefBlock>
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
