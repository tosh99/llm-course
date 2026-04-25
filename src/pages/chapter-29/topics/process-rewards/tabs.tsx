import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    context: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">Context</div>
            <div className="ch-tl-body">{item.context}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "2022 — Outcome Reward Models (ORM)",
            title: "Standard RLHF: one reward for one complete response",
            context:
                "Standard RLHF trains a reward model to score complete responses. For mathematical reasoning tasks, the reward is binary: 1 if the final answer matches the ground truth, 0 if it does not. The training signal is maximally sparse: a single bit of feedback for a reasoning chain that may contain a dozen distinct steps. The model receives no information about which steps were correct and which introduced errors.",
            what:
                "Outcome reward models (ORMs) map a problem x and a complete solution y to a scalar: r(x, y) &#8712; &#123;0, 1&#125;. The reward is determined entirely by the final answer. Two failure modes follow directly: (1) correct reasoning with a final arithmetic error receives reward 0, penalising valid reasoning chains; (2) incorrect reasoning that happens to reach the right answer by coincidence receives reward 1, rewarding flawed logic. The ORM cannot distinguish these cases &#8212; it sees only the endpoint, not the path.",
            impact:
                "RLHF with outcome supervision produced models that generated plausible-sounding reasoning but could not be trusted to reason correctly. The sparse reward signal made training inefficient: the model had to discover, through many rollouts, which reasoning patterns tended to produce correct final answers, with no guidance about which intermediate steps were the source of error. This bottleneck motivated the search for denser supervision signals.",
        },
        {
            year: "2022 — Cobbe et al., Training Verifiers to Solve Math Word Problems",
            title: "Systematic study of outcome-supervised verifiers for math",
            context:
                "Karl Cobbe and colleagues at OpenAI published the first systematic study of outcome-supervised verifiers for multi-step mathematical reasoning. They introduced the GSM8K benchmark (grade-school math word problems) and trained a GPT-3-scale verifier to score complete solutions as correct or incorrect. The verifier was used in a best-of-N selection procedure: generate N candidate solutions, score all with the verifier, return the highest-scoring one.",
            what:
                "The verifier was a fine-tuned language model with a classification head appended after the final token. Given a problem and a complete solution, the head predicted P(correct). Best-of-N with this verifier achieved 69.7% on GSM8K compared to 32.7% for greedy generation from the same underlying model &#8212; a doubling of accuracy from the selection procedure alone. The paper established that verification is a tractable and powerful complement to generation, even with outcome-only supervision.",
            impact:
                "Cobbe et al. proved that the gap between what a model can generate (greedy) and what it can verify (best-of-N) is large and exploitable. This split &#8212; generation vs. verification &#8212; became a foundational concept in the reasoning literature. The limitation was clear: outcome supervision provided no signal about which steps caused failures. A verifier trained on outcomes could rank solutions but not diagnose errors, motivating step-level supervision.",
        },
        {
            year: "May 2023 — Lightman et al., Let's Verify Step by Step (OpenAI)",
            title: "Process Reward Models: dense supervision at every reasoning step",
            context:
                "Hunter Lightman and colleagues at OpenAI asked whether rewarding intermediate steps rather than only final answers would improve the quality of mathematical reasoning. They built PRM800K: a dataset of 800,000 step-level human preference labels collected from crowdworkers annotating GPT-4 reasoning chains on MATH benchmark problems. Each step in each chain was labelled positive (correct and valid) or negative (incorrect or introduces an error).",
            what:
                "A Process Reward Model (PRM) was trained to predict the correctness of each step given the problem and all preceding steps: r_i = P(step i is correct | x, s_1, ..., s_i). The overall solution score for best-of-N selection was the minimum step score across the chain: score(y) = min_i r_i. On the MATH benchmark with N = 1860 candidate solutions: PRM best-of-1860 reached 78.2% accuracy vs. ORM 72.4% vs. no verifier 59.4%. The PRM also localised the first erroneous step in a chain &#8212; a capability the ORM entirely lacked.",
            impact:
                "Let's Verify Step by Step established that process supervision substantially and consistently outperforms outcome supervision for mathematical reasoning across all values of N tested. The 5.8-point gap over ORM at N=1860 confirmed that denser reward signal &#8212; one label per step rather than one per solution &#8212; translates directly to better selection. PRM800K was released publicly, becoming the reference dataset for process supervision research. The paper's methods directly informed the training of OpenAI's o1.",
        },
        {
            year: "2023 — Why PRMs outperform ORMs: the dense signal advantage",
            title: "Signal density, lucky wrong chains, and step-level diagnosis",
            context:
                "Following Lightman et al., the community analysed exactly why process supervision outperformed outcome supervision. Three distinct mechanisms emerged, each reflecting a fundamental asymmetry between step-level and solution-level reward.",
            what:
                "First, density: for a reasoning chain with n steps, a PRM provides n reward signals per training example, while an ORM provides 1. For n = 8 steps, the PRM has 8&#215; denser supervision. Second, lucky wrong chains: a reasoning chain that uses an invalid step but happens to reach the correct final answer receives reward 1 from an ORM but low intermediate rewards from a PRM at the erroneous step. The ORM inadvertently reinforces flawed reasoning; the PRM does not. Third, unlucky correct chains: valid reasoning that makes a final transcription error receives reward 0 from an ORM but high intermediate rewards from a PRM. The ORM penalises correct reasoning; the PRM does not. These three factors accumulate to a large performance gap at inference time.",
            impact:
                "This analysis formalised the intuition that outcome supervision creates a misaligned learning signal: the model is trained to produce correct final answers, not to reason correctly. Process supervision directly aligns the reward with reasoning quality. The dense signal also makes PRMs more data-efficient: fewer training examples are needed to achieve the same level of verifier performance because each example contributes far more signal.",
        },
        {
            year: "2023 — PRMs as search heuristics in tree-of-thoughts and beam search",
            title: "Scoring partial chains: from best-of-N to guided tree search",
            context:
                "Outcome reward models have a fundamental limitation as search heuristics: they can only score complete solutions. In beam search or Monte Carlo tree search over reasoning chains, the search procedure needs to evaluate partial chains &#8212; chains where only steps 1 through i have been generated. An ORM is undefined on partial chains; it requires the final answer. PRMs, by contrast, score each step as it is generated.",
            what:
                "With PRMs as the value function, beam search over reasoning steps becomes tractable: generate the next step, score it with the PRM, prune low-scoring beams, continue. The PRM value at step i is V(x, s_1, ..., s_i) = P(chain will ultimately be correct | steps generated so far). Beam search with PRM scoring finds solutions with fewer total generation calls than flat best-of-N, because promising paths are expanded and unpromising paths are pruned early. MCTS over reasoning trees (Luo et al., 2024) used PRMs as the value function in the UCB selection criterion, achieving state-of-the-art on MATH with dramatically fewer rollouts than best-of-N.",
            impact:
                "PRMs transformed from verification tools into search engines. The step-level score allows the model to prune obviously wrong reasoning paths before completing them, concentrating compute on promising partial chains. This is the mechanism underlying the deliberate, multi-step reasoning in inference-time compute scaling: more compute at inference time, guided by a PRM, produces better answers.",
        },
        {
            year: "September 2023 — OpenAI o1 and process-level reinforcement learning",
            title: "Training the internal reasoning process, not just the output",
            context:
                "OpenAI released o1 in September 2023, a model explicitly designed to reason via internal chain-of-thought before producing a final answer. Unlike standard instruction-tuned models that generate chain-of-thought as a prompted behaviour, o1's reasoning tokens are trained, not merely elicited. The training process reportedly uses reinforcement learning with process-level rewards rather than outcome-level rewards.",
            what:
                "In o1, the model generates a hidden reasoning trace (the thinking tokens) and then a final visible response. Reinforcement learning optimises the policy over the space of reasoning traces, not just final answers. Process supervision during RL means the reward signal evaluates each step of the internal chain, encouraging the model to produce coherent and correct intermediate reasoning rather than simply to output correct final answers. The result is a model whose internal reasoning traces are structured, step-by-step, and auditable &#8212; rather than verbose text that superficially resembles reasoning.",
            impact:
                "o1 demonstrated that process supervision scales: models trained with step-level rewards on internal reasoning chains achieve substantially higher performance on difficult reasoning benchmarks (AIME, Codeforces, graduate-level science) than models trained with outcome supervision alone. The reasoning compute can also be scaled at inference time: longer thinking traces produce better answers, consistent with PRMs enabling effective search over the reasoning space.",
        },
        {
            year: "2024 — Scalable process supervision: automating step-level annotation",
            title: "Monte Carlo estimation, Math-Shepherd, and outcome-supervised PRMs",
            context:
                "Building PRM800K required approximately 2,000 annotator-hours of expert human labour for step-level labels on 800,000 steps. This cost is prohibitive for scaling to larger datasets or new domains. The 2024 research agenda focused on automating process annotation without human labels.",
            what:
                "Three approaches emerged: (1) Monte Carlo rollout estimation: for each partial chain (x, s_1, ..., s_i), run K complete rollouts from that state and compute p&#770;(s_i correct) &#8776; (number of rollouts reaching the correct answer) / K. Steps with p&#770; &#62; &#964; (typically 0.5) are labelled positive. No human annotation is required &#8212; only a verifiable final answer. (2) Math-Shepherd (Wang et al., 2024): automated process annotation via symbolic verification of each step's algebraic validity, achieving PRM-quality labels at near-zero human cost. (3) Outcome-supervised PRM training: train a model on outcome labels to predict per-step probabilities, bootstrapping process supervision from outcome supervision. These methods expanded PRM training data by 10&#8211;100&#215; over human-annotated baselines.",
            impact:
                "Automatic process annotation broke the human-annotation bottleneck. PRMs could now be trained on any domain with verifiable answers &#8212; mathematics, code, formal proofs &#8212; without expert human labour. This opened the path to process supervision at scale: training frontier models with step-level feedback on billions of reasoning steps rather than hundreds of thousands.",
        },
    ]

    return (
        <>
            <div className="ch-timeline">
                {items.map((item) => (
                    <TlItem key={item.year} item={item} />
                ))}
            </div>
            <div className="ch-callout">
                <strong>The trajectory in one sentence:</strong> Process reward models
                began as an expensive research intervention requiring thousands of
                human-annotated step labels, proved they substantially outperform outcome
                supervision on the MATH benchmark, became the presumed training mechanism
                behind OpenAI&#8217;s o1, and by 2024 could be constructed automatically
                via Monte Carlo rollouts &#8212; making dense step-level supervision
                available at the scale required to train frontier reasoning models.
            </div>
            <Analogy label="What comes next &#8212; Agents &amp; Tool Use">
                Process reward models represent one frontier of reasoning improvement:
                teaching models to value each step of their reasoning, not just the final
                answer. But the reasoning examined in Chapter 29 has been largely
                self-contained &#8212; the model thinks within its own context window,
                drawing on memorised knowledge. The next step was enabling models to act:
                to call external tools (calculators, search engines, code interpreters),
                to plan sequences of actions across multiple steps, and to perceive the
                results of those actions to inform the next step. Chapter 30 covers the
                emergence of LLM agents &#8212; systems where a language model is not
                just a reasoner but a controller that can interact with the world.
            </Analogy>
        </>
    )
}

function KidTab() {
    return (
        <>
            <Analogy label="The Math Teacher Who Grades Each Step">
                An ORM is like a teacher who only looks at your final answer: right or
                wrong, full marks or zero. A PRM is like a teacher who grades every step
                of your working: &#8220;Step 1: correct. Step 2: incorrect &#8212; you
                multiplied instead of divided here. Step 3: follows from Step 2 so also
                wrong.&#8221; The step-by-step feedback catches errors the moment they
                occur and gives precise information about where the reasoning went wrong
                &#8212; not just that it did.
            </Analogy>

            <Analogy label="The Lucky Wrong Answer Problem">
                Sometimes a wrong reasoning chain accidentally arrives at the right
                answer. Perhaps two errors cancel out, or the problem has only one
                plausible numerical answer and the model guesses it. An ORM rewards this:
                correct answer &#8594; full marks. A PRM catches it: Step 3 used an
                invalid shortcut &#8212; low reward there, regardless of the final
                answer. PRMs do not reward getting lucky. They reward reasoning correctly,
                which is a much harder and more useful thing to learn.
            </Analogy>

            <Analogy label="Best-of-N: The Verification Lottery">
                Generate 1,860 different reasoning chains for the same problem. Score
                every step of every chain with the PRM. Pick the chain where every step
                looks most correct &#8212; measured by the minimum step score across the
                whole chain. That single best chain reaches 78% accuracy on the hardest
                math benchmark in the study. The model &#8220;knew&#8221; how to reason
                correctly &#8212; it just did not always do it first. The PRM lets you
                find the best reasoning among many attempts, reliably.
            </Analogy>

            <Analogy label="Why Dense Feedback Wins">
                An ORM produces one bit of feedback per complete solution: correct or
                incorrect. A PRM produces one reward per step &#8212; typically five to
                ten steps per solution. That is five to ten times more training signal
                per example, and each signal points directly to where in the reasoning
                chain something went right or wrong. More signal, more precisely located,
                means faster and more reliable learning. Dense feedback wins because it
                wastes less information.
            </Analogy>

            <Analogy label="PRMs as Search Guides">
                In tree-of-thoughts style search, the model explores many reasoning paths
                at once. The PRM scores each partial path after every new step:
                &#8220;This path looks very promising after three steps.&#8221; Without a
                PRM, you would need to complete every path before knowing which was best
                &#8212; enormously expensive. With a PRM, you can prune bad branches
                early and focus your compute on the paths that look most likely to
                succeed. The PRM turns verification into navigation.
            </Analogy>

            <Analogy label="o1: Training on How to Think">
                OpenAI&#8217;s o1 was not just trained to give right answers &#8212; it
                was trained to reason correctly step by step using process rewards. The
                model generates a hidden chain of reasoning (its &#8220;thinking
                tokens&#8221;) and is rewarded at each step of that chain for reasoning
                validly. That is why o1&#8217;s thinking traces are coherent, structured
                arguments rather than verbose text generated before the answer. The
                process reward shaped how the model thinks, not just what it outputs.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Process supervision: formalising step-level reward</h2>

            <h3>ORM vs. PRM: Formal Comparison</h3>
            <p>
                An outcome reward model maps a complete problem-solution pair to a scalar.
                A process reward model maps a problem and a partial or complete chain of
                steps to a vector of per-step rewards.
            </p>
            <p>ORM formulation:</p>
            <MathBlock tex="r_{\mathrm{ORM}}(x, y) \in \{0, 1\}, \quad \text{one label per solution}" />
            <p>PRM formulation:</p>
            <MathBlock tex="r_{\mathrm{PRM}}(x, s_1, \ldots, s_n) = [r_1, r_2, \ldots, r_n], \quad r_i \in \{0,1\}" />
            <p>
                For a chain with n = 8 steps, the PRM provides 8&#215; denser supervision
                per training example. The PRM training objective is a sum of binary
                cross-entropy losses over all steps:
            </p>
            <MathBlock tex="\mathcal{L}_{\mathrm{PRM}} = -\sum_{i=1}^{n} \left[ r_i \log p(r_i{=}1 \mid x, s_1, \ldots, s_i) + (1 - r_i) \log p(r_i{=}0 \mid x, s_1, \ldots, s_i) \right]" />
            <p>
                The model sees all steps up to and including s_i when predicting whether
                step i is correct &#8212; a causal, left-to-right scoring procedure
                compatible with autoregressive language models.
            </p>

            <h3>Best-of-N Selection with ORM and PRM</h3>
            <p>
                Generate N candidate solutions &#123;y&#8321;, ..., y_N&#125; for problem x.
            </p>
            <p>ORM selection: return the solution with the highest outcome score.</p>
            <MathBlock tex="\hat{y}_{\mathrm{ORM}} = \arg\max_{i} \; r_{\mathrm{ORM}}(x, y_i)" />
            <p>
                PRM selection: score each solution as the minimum step reward across the
                chain (the weakest-link principle &#8212; a chain is only as strong as its
                worst step).
            </p>
            <MathBlock tex="\mathrm{score}_{\mathrm{PRM}}(y) = \min_{j} \; r_j(x, y)" />
            <MathBlock tex="\hat{y}_{\mathrm{PRM}} = \arg\max_{i} \; \mathrm{score}_{\mathrm{PRM}}(y_i)" />
            <p>
                Alternatively, use the geometric mean of step scores for a smoother
                aggregation:
            </p>
            <MathBlock tex="\mathrm{score}_{\mathrm{PRM}}^{\mathrm{geo}}(y) = \left(\prod_{j=1}^{n} r_j\right)^{1/n}" />
            <p>
                Lightman et al. results on MATH with N = 1860: PRM min-score 78.2%, ORM
                72.4%, no verifier 59.4%. The 5.8-point gap between PRM and ORM is
                consistent across all values of N tested.
            </p>

            <h3>Monte Carlo Process Annotation</h3>
            <p>
                Automated PRM labelling without human annotators uses Monte Carlo
                rollouts. For each partial chain (x, s_1, ..., s_i), sample K complete
                continuations from the policy and check whether each reaches the correct
                final answer. The estimated correctness of step i is:
            </p>
            <MathBlock tex="\hat{p}(s_i \text{ correct}) \approx \frac{1}{K} \sum_{k=1}^{K} \mathbf{1}\!\left[\text{rollout } k \text{ from } (x, s_1, \ldots, s_i) \text{ reaches correct answer}\right]" />
            <p>
                Step i is labelled positive if &#960;&#770; &#62; &#964; (typically &#964;
                = 0.5). This requires only a verifiable final answer &#8212; no
                step-level human annotation. Total annotation cost: K rollouts &#215; n
                steps &#215; N solutions. For K = 16, n = 8, N = 10,000: approximately
                1.28M model calls to annotate 10K training problems, compared to 2,000
                human-hours for PRM800K (800K human labels).
            </p>
            <MathBlock tex="\text{Cost}_{\mathrm{MC}} = K \cdot n \cdot N \quad \text{(model rollouts, no human labour)}" />

            <h3>PRMs in Monte Carlo Tree Search</h3>
            <p>
                Use the PRM as the value function V for MCTS over reasoning steps. At
                node (x, s_1, ..., s_i), the value estimate is:
            </p>
            <MathBlock tex="V(x, s_1, \ldots, s_i) = p_{\mathrm{PRM}}(s_i \text{ correct} \mid x, s_1, \ldots, s_i)" />
            <p>
                The UCB selection criterion for expanding a node s from parent p is:
            </p>
            <MathBlock tex="\mathrm{UCB}(s) = Q(s) + c \cdot \sqrt{\frac{\ln N(p)}{N(s)}}" />
            <p>
                where Q(s) is the mean PRM-backed value estimate from all rollouts through
                s, N(s) is the visit count for s, N(p) is the visit count for the parent,
                and c is an exploration constant. After each rollout, backpropagate the
                final PRM reward through the path. MCTS + PRM (Luo et al., 2024) achieves
                state-of-the-art on MATH with far fewer total samples than flat best-of-N,
                because the tree search concentrates rollouts on high-value partial chains.
            </p>

            <h3>Training PRMs: Data Collection and Annotation Quality</h3>
            <p>
                PRM800K collected step-level labels from crowdworkers on GPT-4 reasoning
                chains for MATH benchmark problems. Each step was labelled by three
                independent annotators; disagreements were resolved by majority vote.
                Inter-annotator agreement &#964;&#770; over a set of K annotated steps is
                defined as:
            </p>
            <MathBlock tex="\hat{\tau} = \frac{1}{K} \sum_{k=1}^{K} \mathbf{1}\!\left[\text{majority label}_k = \text{annotator}_1\text{ label}_k\right]" />
            <p>
                Lightman et al. report &#964;&#770; &#8776; 0.80: annotators agree on 80%
                of step labels. The 20% disagreement rate reflects genuine ambiguity in
                mathematical reasoning steps &#8212; some steps are partially correct,
                use non-standard methods, or contain errors that cancel downstream.
                Approximate annotation cost: 2,000 annotator-hours for 800,000 labels,
                or roughly 9 seconds per step label. Alternative automatic methods (Monte
                Carlo, Math-Shepherd) reduce this cost by orders of magnitude at some
                accuracy cost on ambiguous steps.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Rule of thumb:</strong> For best-of-N selection, use the
                minimum step score as the PRM aggregation function. The weakest-link
                principle works because a single bad step invalidates the entire chain &#8212;
                a chain with nine perfect steps and one wrong step is incorrect. The
                geometric mean is a softer alternative that is more robust to noise in
                individual step scores when the PRM is imperfectly calibrated.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &#8212; Mathematics</span>
                    <span className="ch-expandable-desc">
                        Optimal PRM aggregation under independence &#183; sample efficiency of process vs. outcome supervision
                    </span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">
                        PRM-guided best-of-N selector &#183; step scoring &#183; min-score aggregation
                    </span>
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
            <h2>Optimal aggregation and sample efficiency</h2>

            <DefBlock label="Optimal Aggregation Under Step Independence">
                Assume step correctness indicators r_1, ..., r_n are independent Bernoulli
                random variables with P(r_i = 1) = p_i. The probability that a complete
                chain is correct equals the probability that all steps are correct:
            </DefBlock>
            <MathBlock tex="P(\text{chain correct}) = \prod_{i=1}^{n} p_i" />
            <p>
                Under this independence assumption, the optimal aggregation function for
                ranking solutions by expected correctness is the product of step
                probabilities &#8212; equivalently, the sum of log-probabilities:
            </p>
            <MathBlock tex="\mathrm{score}^*(y) = \sum_{i=1}^{n} \log p_i = \log \prod_{i=1}^{n} p_i" />
            <p>
                The minimum step score is a conservative lower bound on this product:
                min_i p_i &#8804; (&#8719;_i p_i)^(1/n). When one step has p_i &#8776; 0
                (clearly wrong), min_i p_i &#8776; 0 and the product &#8776; 0: both
                correctly rank the chain near the bottom. The minimum is more robust to
                PRM miscalibration on individual steps than the product because it does
                not accumulate small errors multiplicatively across n steps. In the limit
                of perfectly calibrated PRMs, the product is optimal; in practice, the
                minimum is preferred for robustness.
            </p>
            <MathBlock tex="\min_i p_i \leq \left(\prod_{i=1}^{n} p_i\right)^{1/n} \leq \frac{1}{n}\sum_{i=1}^{n} p_i" />
            <p>
                This is the AM-GM inequality applied to per-step probabilities. The
                geometric mean lies between the minimum and the arithmetic mean, making
                it a principled intermediate aggregation: less sensitive to a single bad
                step than the arithmetic mean, more stable than the minimum under PRM
                noise.
            </p>

            <h3>Sample Efficiency: PRM vs. ORM</h3>
            <p>
                Consider training a verifier from M labelled training examples, each
                consisting of a problem x and a solution y. Under ORM, each example
                contributes 1 binary label. Under PRM, each example contributes n binary
                labels (one per step). The total supervision signal is:
            </p>
            <MathBlock tex="\text{ORM signal} = M \cdot 1 = M" />
            <MathBlock tex="\text{PRM signal} = M \cdot n" />
            <p>
                To achieve equivalent verifier performance, ORM requires n&#215; more
                training examples than PRM. Equivalently, for a fixed annotation budget
                of L labels: ORM can train on L solutions (one label each); PRM can train
                on L/n solutions (n labels each) while receiving the same total signal.
                However, PRM labels require more annotator effort per example (n decisions
                rather than 1), so the annotation cost per label may differ. Lightman et
                al. found PRM800K achieves strong performance with approximately 75,000
                solutions labelled at n &#8776; 10 steps each (750K step labels total),
                suggesting the dense signal from fewer examples outperforms sparse signal
                from many examples at equal total label counts.
            </p>
            <MathBlock tex="\text{label efficiency ratio} = \frac{\text{PRM accuracy at budget } L}{\text{ORM accuracy at budget } L} > 1 \quad \text{(empirically)}" />

            <div className="ch-callout">
                <strong>Independence assumption caveat:</strong> The independence
                assumption (r_i are independent) is violated in practice &#8212; an
                error in step i increases the probability of errors in steps i+1, ..., n
                because later steps build on earlier ones. This makes the product
                aggregation pessimistic (overcounts correlated errors). The minimum
                aggregation is less sensitive to this violation because it only depends
                on the single worst step, not on the correlation structure across steps.
                This is a second reason why the minimum is preferred empirically despite
                being suboptimal under independence.
            </div>
        </>
    )
}

const PY_CODE = `import random
from dataclasses import dataclass

# ── Mock PRM-guided best-of-N selector ───────────────────────────────────────

@dataclass
class ReasoningChain:
    """A candidate solution consisting of discrete reasoning steps."""
    steps: list[str]
    final_answer: str


def mock_generate_solutions(problem: str, n: int) -> list[ReasoningChain]:
    """
    Generate N candidate reasoning chains for a problem.
    In a real system this would call a language model.
    """
    templates = [
        # Correct reasoning chain
        [
            "Let x be the unknown quantity. The problem states 3x + 7 = 22.",
            "Subtract 7 from both sides: 3x = 15.",
            "Divide both sides by 3: x = 5.",
        ],
        # Chain with an error in step 2
        [
            "Let x be the unknown quantity. The problem states 3x + 7 = 22.",
            "Add 7 to both sides: 3x = 29.",        # Error: should subtract
            "Divide both sides by 3: x = 9.67.",
        ],
        # Chain with a lucky correct answer despite wrong intermediate step
        [
            "The answer to this type of problem is usually a small integer.",
            "Let me try x = 5 by substitution: 3(5) + 7 = 22. Yes!",
            "Therefore x = 5.",
        ],
        # Chain with correct steps but arithmetic error at the end
        [
            "Let x be the unknown quantity. The problem states 3x + 7 = 22.",
            "Subtract 7 from both sides: 3x = 15.",
            "Divide both sides by 3: x = 6.",        # Error: 15/3 = 5, not 6
        ],
    ]

    solutions = []
    for i in range(n):
        template = templates[i % len(templates)]
        # Slightly vary the steps to simulate diverse generation
        steps = [s + (f" [variant {i // len(templates)}]" if i >= len(templates) else "")
                 for s in template]
        answer = template[-1].split("x = ")[-1].rstrip(".")
        solutions.append(ReasoningChain(steps=steps, final_answer=answer))

    return solutions


def mock_prm_score(problem: str, steps: list[str]) -> list[float]:
    """
    Mock PRM: assigns a score in [0, 1] to each step.
    In a real system this would be a fine-tuned language model
    predicting P(step is correct | problem, all preceding steps).
    """
    # Hardcoded heuristic scores matching the templates above
    step_scores_by_pattern = {
        "Subtract 7": 0.97,    # Correct algebraic step
        "Add 7 to":   0.08,    # Wrong direction
        "try x = 5":  0.45,    # Lucky guess, not rigorous reasoning
        "x = 5.":     0.96,    # Correct final answer
        "x = 9.67":   0.09,    # Wrong answer
        "x = 6.":     0.11,    # Wrong arithmetic
        "x = 15.":    0.94,    # Correct intermediate result
        "Let x":      0.93,    # Standard setup
        "Let me":     0.38,    # Non-standard approach
        "answer to":  0.35,    # Vague reasoning
        "Divide both sides by 3: x = 5": 0.97,
    }

    scores = []
    for step in steps:
        score = 0.5  # default
        for pattern, s in step_scores_by_pattern.items():
            if pattern.lower() in step.lower():
                score = s
                break
        # Add small noise to simulate model uncertainty
        score = min(1.0, max(0.0, score + random.gauss(0, 0.03)))
        scores.append(round(score, 3))
    return scores


def prm_min_score(step_scores: list[float]) -> float:
    """Aggregate step scores using the weakest-link (minimum) principle."""
    return min(step_scores) if step_scores else 0.0


def prm_geometric_mean(step_scores: list[float]) -> float:
    """Aggregate step scores using the geometric mean."""
    if not step_scores:
        return 0.0
    product = 1.0
    for s in step_scores:
        product *= max(s, 1e-9)     # avoid log(0)
    return product ** (1.0 / len(step_scores))


def orm_score(problem: str, chain: ReasoningChain) -> float:
    """
    Mock ORM: binary score based only on the final answer.
    1.0 if the final answer matches ground truth, 0.0 otherwise.
    """
    ground_truth = "5"
    return 1.0 if chain.final_answer.strip() == ground_truth else 0.0


def select_best_of_n(
    problem: str,
    solutions: list[ReasoningChain],
    use_prm: bool = True,
) -> tuple[ReasoningChain, list[float]]:
    """
    Select the best solution from N candidates using PRM or ORM scoring.

    Returns the selected solution and its per-step scores (empty for ORM).
    """
    best_solution = solutions[0]
    best_score = -1.0
    best_step_scores: list[float] = []

    for chain in solutions:
        if use_prm:
            step_scores = mock_prm_score(problem, chain.steps)
            score = prm_min_score(step_scores)
        else:
            step_scores = []
            score = orm_score(problem, chain)

        if score > best_score:
            best_score = score
            best_solution = chain
            best_step_scores = step_scores

    return best_solution, best_step_scores


# ── Demo ──────────────────────────────────────────────────────────────────────

def run_demo():
    random.seed(42)
    problem = "Solve for x: 3x + 7 = 22"
    n_solutions = 8

    print(f"Problem: {problem}")
    print(f"Generating {n_solutions} candidate solutions...\\n")

    solutions = mock_generate_solutions(problem, n_solutions)

    # Score all solutions and display step-level scores
    print("PRM step-level scores for each candidate:\\n")
    for i, chain in enumerate(solutions):
        step_scores = mock_prm_score(problem, chain.steps)
        min_score = prm_min_score(step_scores)
        geo_score = prm_geometric_mean(step_scores)
        orm = orm_score(problem, chain)
        print(f"  Solution {i+1} (answer={chain.final_answer}):")
        for j, (step, score) in enumerate(zip(chain.steps, step_scores)):
            bar = "=" * int(score * 20)
            print(f"    Step {j+1}: [{score:.3f}] {bar}")
        print(f"    PRM min-score: {min_score:.3f}  |  geo-mean: {geo_score:.3f}  |  ORM: {orm:.1f}")
        print()

    # Compare PRM vs ORM selection
    prm_best, prm_scores = select_best_of_n(problem, solutions, use_prm=True)
    orm_best, _ = select_best_of_n(problem, solutions, use_prm=False)

    print("=" * 60)
    print("Selection results:")
    print(f"  PRM selected: answer={prm_best.final_answer}")
    print(f"    Step scores: {prm_scores}")
    print(f"  ORM selected: answer={orm_best.final_answer}")
    print()
    print("Ground truth answer: 5")
    print(f"PRM correct: {prm_best.final_answer.strip() == '5'}")
    print(f"ORM correct: {orm_best.final_answer.strip() == '5'}")


if __name__ == "__main__":
    run_demo()
`

function PythonContent() {
    return (
        <>
            <p>
                A self-contained Python implementation of PRM-guided best-of-N selection.
                A mock PRM assigns step-level correctness scores; a mock ORM assigns
                binary outcome scores. The demo generates eight candidate solutions,
                displays per-step PRM scores for each, and compares which solution PRM
                min-score selection vs. ORM selection chooses &#8212; illustrating how
                PRM catches lucky-wrong and unlucky-correct chains that ORM cannot
                distinguish.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="prm_best_of_n.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PROCESS_REWARDS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
