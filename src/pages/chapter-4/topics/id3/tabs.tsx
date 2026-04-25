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
            year: "1963",
            title: "Morgan & Sonquist — CHAID, the First Decision Tree",
            challenge:
                "The EM algorithm (Dempster 1977) had shown that unlabeled data contained learnable structure. But social scientists at the University of Michigan faced a different problem: they had labels. Survey respondents had been categorised as high or low income, satisfied or dissatisfied, healthy or sick. They needed a machine that could discover which questions — out of dozens — best predicted the answer, without being told which ones to look at.",
            what:
                "James Morgan and John Sonquist built CHAID (Chi-squared Automatic Interaction Detection): a program that recursively split survey respondents into groups using chi-squared tests to find the predictor variable that most strongly differentiated subgroups. It was a tree of if-then rules, grown automatically from data — the first decision tree algorithm.",
            impact:
                "CHAID proved that a machine could discover interpretable decision rules from labeled data — a fundamentally different paradigm from regression or clustering. Its limitation: chi-squared tests only handle categorical predictors, and it couldn't handle continuous data like age or income without binning. That limitation motivated everything that came next.",
        },
        {
            year: "1979 / 1986",
            title: "Quinlan — ID3 and the Information-Gain Criterion",
            challenge:
                "CHAID was limited to categorical features and used chi-squared statistics that required large samples. Ross Quinlan, working at Stanford and later in Australia, needed a system that could learn rules for board games from examples of good moves. The features were categorical (piece positions), the labels were strategic choices, and the sample sizes were small. He needed something faster and more principled than CHAID.",
            what:
                "Quinlan's ID3 (Iterative Dichotomiser 3, 1979; published widely 1986) replaced chi-squared tests with information gain — the reduction in Shannon entropy achieved by splitting on a given attribute. At each node, compute H(S) − Σ (|Sv|/|S|)·H(Sv) for each attribute, where S is the current set and Sv is the subset with attribute value v. Choose the attribute with the highest information gain. Grow the tree recursively until all leaves are pure or no attributes remain.",
            impact:
                "ID3 was the first algorithm to connect Shannon's 1948 information theory (covered in Chapter 2) directly to supervised learning. The information-gain criterion made the splitting decision principled: you are literally minimising the expected number of bits needed to describe the outcome after the split. This connection — entropy reduction equals information gain equals optimal feature selection — became the theoretical basis of the entire decision tree family.",
        },
        {
            year: "1986",
            title: "Quinlan — C4.5, the Descendant That Dominated a Decade",
            challenge:
                "ID3 had three weaknesses: (1) it was biased toward attributes with many possible values (a unique identifier would always score highest but be useless for generalisation); (2) it could only handle categorical features, not continuous ones; (3) it grew trees until all leaves were pure, severely overfitting small datasets.",
            what:
                "C4.5 fixed all three problems. For bias: it used the gain ratio (information gain divided by the attribute's own entropy), penalising splits that created many tiny subgroups. For continuous features: it found the threshold t that maximised gain when splitting x ≤ t vs x > t. For overfitting: it applied post-pruning — grow the full tree, then collapse branches that do not improve accuracy on a held-out validation set, using a pessimistic error estimate based on the upper bound of a confidence interval.",
            impact:
                "C4.5 became the workhorse of early machine learning. It was named the most influential data mining algorithm of the 20th century in a 2008 poll of the IEEE Data Mining community. Its decision rules were printed as readable if-then statements, making it a preferred tool in medicine, law, and any domain where decisions had to be justified. CART (1984), developed independently, solved the same problems differently — and that comparison is the subject of the next topic.",
        },
        {
            year: "1986 — Parallel",
            title: "The ID3-CART Split — Two Schools of Thought",
            challenge:
                "By the mid-1980s, two competing decision tree frameworks existed: ID3/C4.5 (from the AI and machine learning community, favoured information gain, multi-way splits, categorical focus) and CART (from the statistics community, favoured Gini impurity, strictly binary splits, handled both regression and classification). They produced different trees and had different theoretical justifications.",
            what:
                "The difference was more than technical. ID3 came from Quinlan's machine learning tradition — favouring interpretable multi-branch trees that matched human reasoning about categories. CART came from Breiman's statistics tradition — favouring binary trees that could be analysed mathematically and connected to the bias-variance framework. Both grew into major lineages: C4.5 → C5.0 (commercial); CART → Random Forests → Gradient Boosting → XGBoost.",
            impact:
                "This fork created two intellectual traditions in ML: the AI tradition (symbolic rules, human readability, categorical reasoning) and the statistics tradition (mathematical optimisation, variance reduction, prediction accuracy). The tension between these traditions drove the field forward for two decades and is still visible today in the debate between interpretable models and black-box neural networks. The next topic — CART — examines the statistical tradition in detail.",
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
                Dempster's EM algorithm (1977) could find hidden clusters in unlabeled data. But many real problems have labels — past examples with known outcomes: this patient recovered, this email was spam, this loan defaulted. How do you build a machine that discovers rules from labeled examples without being told which rules to look for? Ross Quinlan's answer was ID3: teach the computer to play 20 Questions, but have it figure out the questions itself.
            </p>

            <Analogy label="The game of 20 Questions">
                You're thinking of an animal. I can ask yes/no questions: Is it a mammal? Does it fly? Is it bigger than a dog? I want to guess the animal using as few questions as possible.
                <br /><br />
                The key insight: a good question is one that dramatically narrows the possibilities. "Does it have a backbone?" eliminates half of all animals. "Is it called Bob?" eliminates almost nothing. A decision tree algorithm asks the same thing mathematically: which question eliminates the most uncertainty about the answer?
            </Analogy>

            <Analogy label="Information gain — measuring how useful a question is">
                Imagine you're sorting emails into spam and not-spam. Before asking any question, the pile is 60% spam / 40% not-spam — somewhat mixed. You ask: "Does the subject line contain the word FREE?"
                <br /><br />
                YES pile: 95% spam, 5% not-spam — nearly pure. NO pile: 20% spam, 80% not-spam — also nearly pure.
                <br /><br />
                That question dramatically reduced uncertainty. Quinlan called this <strong>information gain</strong> — borrowing directly from Shannon's 1948 entropy formula. The question that reduces entropy the most gets asked first.
            </Analogy>

            <Analogy label="Growing the tree — ask, split, repeat">
                ID3 works like this:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li>Start with all your training examples in one pile</li>
                    <li>Try every possible question (feature). Compute the information gain for each</li>
                    <li>Ask the question with the highest gain. Split the pile into groups based on the answer</li>
                    <li>Repeat steps 2–3 for each new group, asking different questions each time</li>
                    <li>Stop when each group contains only one class (all spam, or all not-spam)</li>
                </ol>
                The result is a tree of questions that can classify any new email in milliseconds.
            </Analogy>

            <Analogy label="The problem — too many branches">
                ID3 had a flaw: it loved questions with many possible answers. A question like "What is the exact time the email was sent?" has thousands of possible values — each creating its own tiny pure leaf. It scores extremely high on information gain but is completely useless for new emails.
                <br /><br />
                C4.5 fixed this with the <strong>gain ratio</strong>: divide the information gain by the entropy of the attribute itself. Questions with many values get penalised — the computer learns to prefer questions that are both informative AND general.
            </Analogy>

            <Analogy label="What comes next — the statistics tradition">
                ID3 came from the AI tradition: interpretable rules, categorical features, human-readable trees. At almost the same time, four statisticians — Breiman, Friedman, Olshen, and Stone — were developing CART from a completely different starting point. They wanted trees that could handle continuous numbers, worked for both classification and regression, and had a rigorous mathematical foundation. Their approach used a different splitting criterion: Gini impurity.
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
                At a node containing set S with class proportions p₁, ..., p_K, the Shannon entropy measures disorder:
            </p>
            <MathBlock tex="H(S) = -\sum_{k=1}^K p_k \log_2 p_k" />
            <p>
                H = 0 when the node is pure (one class dominates). H = log₂K when all classes are equally probable (maximum disorder).
            </p>

            <h3>Information Gain</h3>
            <p>
                For attribute A with values {"{v₁, ..., vₙ}"}, the information gain of splitting on A:
            </p>
            <MathBlock tex="\text{IG}(S, A) = H(S) - \sum_{v} \frac{|S_v|}{|S|} H(S_v)" />
            <p>
                ID3 greedily chooses the attribute A* = argmax IG(S, A) at each node. This is the expected reduction in entropy after learning the value of A.
            </p>

            <h3>The Gain Ratio Fix (C4.5)</h3>
            <p>
                IG is biased toward high-cardinality attributes. The split information of attribute A:
            </p>
            <MathBlock tex="\text{SplitInfo}(S, A) = -\sum_v \frac{|S_v|}{|S|} \log_2 \frac{|S_v|}{|S|}" />
            <MathBlock tex="\text{GainRatio}(S, A) = \frac{\text{IG}(S, A)}{\text{SplitInfo}(S, A)}" />
            <p>
                GainRatio penalises attributes that split data into many small groups. C4.5 uses a hybrid: compute GainRatio only for attributes whose IG exceeds the average IG across all attributes.
            </p>

            <h3>Handling Continuous Attributes</h3>
            <p>
                For a continuous attribute X, C4.5 sorts the values and tests all candidate thresholds {"{t₁, ..., tₙ₋₁}"}. For each threshold t, the split is X ≤ t vs X &gt; t. The threshold t* = argmax IG(S, X ≤ t) is chosen. This converts continuous attributes into binary splits without discretisation.
            </p>

            <DefBlock label="ID3 / C4.5 Algorithm">
                1. If all examples have the same class → return leaf with that class<br />
                2. If no attributes remain → return leaf with majority class<br />
                3. A* ← argmax_A GainRatio(S, A)<br />
                4. Create node splitting on A*<br />
                5. For each value v of A*: recurse on S_v with A* removed from attributes<br />
                6. Return node
            </DefBlock>

            <div className="ch-callout">
                <strong>Connection to Shannon (Ch. 2):</strong> ID3 takes Shannon's 1948 entropy formula — designed to measure the average information content of a message — and applies it to measure the uncertainty in a label distribution. A pure node (one class) has entropy 0 — a message about its label carries 0 bits of surprise. This is precisely the connection Shannon and McCulloch were discussing at the Macy Conferences. The next topic — CART — replaces entropy with Gini impurity and arrives at nearly the same trees through a completely different mathematical path.
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
