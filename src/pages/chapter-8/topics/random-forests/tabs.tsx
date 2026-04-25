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
            year: "1994",
            title: "Breiman — Bagging, Bootstrap Aggregating",
            challenge:
                "Decision trees (Chapter 4) were powerful and interpretable but had one critical flaw: high variance. Small changes in training data produced wildly different trees. In Breiman's own experiments, removing a single training example could completely restructure the top three levels of a CART tree. This instability made individual trees unreliable in practice — especially in medical and financial applications where consistency mattered.",
            what:
                "Breiman introduced Bagging (Bootstrap Aggregating): train B independent copies of the same base learner (typically CART), each on a bootstrap sample — n examples drawn with replacement from the n-example training set. Average the predictions (regression) or take majority vote (classification). The bootstrap samples introduce diversity: each tree sees roughly 63.2% of the original examples (the rest are 'out-of-bag'), so the B trees are diverse and their individual errors are less correlated.",
            impact:
                "Bagging was the first demonstration that combining unstable learners systematically reduces variance. The mathematical intuition: if each tree has variance σ² and the trees are uncorrelated, the average of B trees has variance σ²/B. Even with some correlation ρ between trees, the average variance is ρσ² + (1−ρ)σ²/B — which approaches ρσ² as B grows. So reducing correlation between trees is as important as the number of trees.",
        },
        {
            year: "1998 / 2001",
            title: "Ho & Breiman — Random Subspace Method and Random Forests",
            challenge:
                "Bagged trees were better than individual trees but still correlated. The problem: all B trees tended to use the same feature at the root (the most predictive feature in the dataset). Trees with correlated root splits made correlated errors — limiting the variance reduction from averaging.",
            what:
                "Tin Kam Ho (1998) introduced the random subspace method: at each split, consider only a random subset of m features rather than all p features. This de-correlates the trees. Leo Breiman (2001) combined bootstrap sampling (bagging) with random feature selection into the algorithm now called Random Forests: B trees, each trained on a bootstrap sample, each split considering m = √p features at random. The out-of-bag examples (not used for each tree) provide a free cross-validation estimate of generalisation error.",
            impact:
                "Random Forests became the dominant algorithm in ML competitions from 2001 to 2012 — 11 years. They require almost no tuning (the main hyperparameter, m, is set to √p by default), handle missing data naturally, provide built-in feature importance scores, run embarrassingly in parallel, and almost never overfit when B is large. They remain a strong baseline against which every new algorithm is compared, and they outperform deep learning on most tabular datasets today.",
        },
        {
            year: "2001 – 2016",
            title: "Random Forests in Biology, Finance, and Vision",
            challenge:
                "Random Forests had proven their accuracy. But their most important property turned out to be their versatility: they worked on radically different data types with no modification. Genomics datasets had p ≫ n (thousands of genes, hundreds of patients). Financial datasets had complex non-linear interactions. Computer vision systems (before deep learning) needed handcrafted features that Random Forests could aggregate.",
            what:
                "Random Forests excelled across domains: genomics (Breiman 2001), used to find gene-disease associations in high-dimensional data; face detection (Viola-Jones 2001, though using AdaBoost); Microsoft Kinect (Shotton et al. 2011), which used Random Forests trained on synthetic data to do real-time body-part segmentation from depth images; CERN particle physics (Baldi et al. 2014), where they matched neural networks on collision data; drug discovery (Dahl et al. 2014).",
            impact:
                "The Kinect application (2011) was particularly significant: it showed that Random Forests could achieve near-real-time human pose estimation on the original Xbox 360 hardware. This was a critical demonstration that powerful ML could run on consumer devices — foreshadowing the on-device inference (LoRA, quantization) story of Chapter 31. The Microsoft Kinect also proved that synthetic training data — millions of rendered human body images — could substitute for real data, a principle later central to robotics and self-driving car research.",
        },
        {
            year: "2016 – present",
            title: "Gradient Boosting vs Random Forests — The Tabular Data Wars",
            challenge:
                "XGBoost (Chen & Guestrin, 2016) brought gradient boosting to competitive efficiency with Random Forests. Both claimed state-of-the-art on tabular data. Practitioners needed guidance: which should be used when?",
            what:
                "The empirical consensus that emerged: Random Forests are more robust to hyperparameter choices (m, max_depth, n_estimators), harder to overfit, faster to train (parallel), and excellent on noisy datasets. Gradient boosted trees (XGBoost, LightGBM) achieve higher accuracy on clean, large datasets with careful tuning but require more care around learning rate, number of rounds, and depth. Shwartz-Ziv & Arpit (2022) showed that both consistently outperform neural networks on tabular data — a finding that sparked the 'why do neural networks struggle on tables' research thread.",
            impact:
                "The Random Forest vs XGBoost comparison established that classical ensemble methods remain unbeaten on structured tabular data — financial records, medical databases, user behaviour logs — even as deep learning conquered images, text, and audio. This is why Chapter 8 sits between the neural chapters (5-7) and the deep learning revolution (Chapter 9): classical ML didn't die in 1986 or 1998 or 2012. It matured in parallel, found its niche, and remains dominant in that niche today.",
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
            <h2>A thousand trees that disagree with each other — on purpose</h2>

            <Analogy label="Why one tree is not enough">
                A single decision tree is like one very opinionated friend. Show them a slightly different set of examples, and they might give you completely different advice. They're brilliant but inconsistent.
                <br /><br />
                What if instead of one friend, you could ask 500 friends — each of whom studied from a slightly different set of examples, and each choosing which questions to focus on at random? Even if each friend is inconsistent, the average of their advice is remarkably stable and accurate. That is a Random Forest.
            </Analogy>

            <Analogy label="Bootstrap sampling — giving each tree different data">
                You have 1,000 training examples. To build one tree in the forest, randomly pick 1,000 examples from your dataset — but <em>with replacement</em> (the same example can be picked multiple times). Some examples appear twice or three times; others not at all.
                <br /><br />
                Each tree in the forest gets a different random sample. The examples that were never picked for that tree are called <strong>out-of-bag</strong> — and they serve as that tree's private test set.
            </Analogy>

            <Analogy label="Random feature selection — forcing diversity">
                Here's the clever part: at every branch in every tree, instead of looking at all features to find the best split, each tree randomly selects just a few features (usually the square root of the total number) and picks the best split among those.
                <br /><br />
                Why? Because all 500 trees would otherwise use the same feature at the root — the most informative one. Then they'd all make similar errors. By randomly restricting which features each tree can see, you force the trees to be diverse — to use different features, draw different boundaries, make different mistakes — so the mistakes cancel out when you average.
            </Analogy>

            <Analogy label="The final answer — majority vote">
                For classification: each tree votes for a class. The majority wins. For regression: each tree gives a number. The average is the prediction.
                <br /><br />
                A remarkable fact: you can compute the generalisation error (how well the forest will do on new data) for free, using the out-of-bag examples — the ones each tree never saw. No separate test set needed.
            </Analogy>

            <Analogy label="Feature importance — which inputs mattered most?">
                Random Forests give you a bonus: for each feature, measure how much accuracy drops when that feature is randomly scrambled across the out-of-bag examples. Features that matter a lot cause big accuracy drops; irrelevant features cause none.
                <br /><br />
                This was the first widely-used method for feature importance in ML. Today, similar ideas power SHAP values, attention visualisations in Transformers, and interpretability research in deep learning.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Variance reduction through decorrelated averaging</h2>

            <h3>Bias-Variance Decomposition for Random Forests</h3>
            <p>
                For a single CART tree T: high variance, low bias (a deep tree fits the training data well but is sensitive to which examples are included). For B trees averaged: if each has variance σ² and pairwise correlation ρ:
            </p>
            <MathBlock tex="\text{Var}\!\left(\frac{1}{B}\sum_{b=1}^B T_b(x)\right) = \rho \sigma^2 + \frac{1-\rho}{B} \sigma^2" />
            <p>
                As B → ∞, variance approaches ρσ². So reducing correlation ρ (by random feature selection) is as important as increasing B. This is why random feature selection is the key innovation in Random Forests over plain bagging.
            </p>

            <h3>Algorithm</h3>
            <ol>
                <li>For b = 1, ..., B: draw bootstrap sample D_b (n samples with replacement)</li>
                <li>Grow a deep CART tree on D_b, at each split considering only m = √p random features</li>
                <li>Aggregate: ŷ_RF(x) = (1/B) Σ_b T_b(x) for regression; majority vote for classification</li>
            </ol>

            <h3>Out-of-Bag Error</h3>
            <p>
                Each example xᵢ is out-of-bag (OOB) for roughly 37% of trees (probability of never being drawn in n samples is (1−1/n)^n → 1/e ≈ 0.368). OOB error estimate: predict each xᵢ using only the trees for which it was OOB; compare to yᵢ. This is approximately equivalent to leave-one-out cross-validation but computed for free during training.
            </p>

            <h3>Permutation Feature Importance</h3>
            <MathBlock tex="\text{FI}(j) = \text{OOB Error}_{\text{permuted}_j} - \text{OOB Error}_{\text{baseline}}" />
            <p>
                For feature j: compute OOB error, then randomly shuffle feature j across the OOB examples and re-compute error. The increase is the importance of feature j. Features with FI ≈ 0 are irrelevant; high FI features are critical.
            </p>

            <DefBlock label="Key Hyperparameters">
                B (n_estimators): more trees = lower variance, diminishing returns after ~200. Never hurts, just costs time.<br />
                m (max_features): √p for classification, p/3 for regression (defaults). Lower m = more diverse trees = lower correlation ρ.<br />
                max_depth: None (fully grown) by default. Shallower trees = lower variance per tree but higher correlation.<br />
                min_samples_leaf: prevents splits on very small groups; controls bias-variance.
            </DefBlock>

            <div className="ch-callout">
                <strong>Bridge to Chapter 9:</strong> Random Forests (2001) reached their performance ceiling around 2006 — the same year Hinton published the deep belief network paper. The two approaches occupied different niches: Random Forests excelled on tabular data with engineered features; deep networks excelled on raw images and audio. The decade 2001–2012 was a genuine competition between the two traditions. Chapter 9 tells the story of how deep learning broke through — and why Random Forests didn't disappear but retreated to their stronghold (structured tables) where they remain dominant today.
            </div>
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
