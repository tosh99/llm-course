import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import random
import math
from collections import Counter

# ── Mock LLM ──────────────────────────────────────────────────────────────────
# In production replace this with a real API call (e.g. OpenAI, Anthropic).
# The mock simulates a model that gets the right answer with probability p_correct
# and otherwise returns a random wrong integer.

def mock_llm(question: str, temperature: float, correct_answer: int, p_correct: float) -> str:
    """Return a simulated chain-of-thought + answer string."""
    if random.random() < p_correct:
        # Correct chain — many different phrasings all reach the right answer
        styles = [
            f"Let me work through this step by step.\\n"
            f"First I compute the initial quantity, then apply the operation.\\n"
            f"Result: {correct_answer}",
            f"Breaking the problem into parts:\\n"
            f"Part A + Part B = {correct_answer // 2} + {correct_answer - correct_answer // 2}\\n"
            f"Total = {correct_answer}",
            f"Working backwards from the constraints:\\n"
            f"The answer must satisfy the given conditions.\\nAnswer: {correct_answer}",
        ]
        chain = random.choice(styles)
    else:
        # Wrong answer — random value near the correct one
        wrong = correct_answer + random.randint(-15, 15)
        while wrong == correct_answer:
            wrong = correct_answer + random.randint(-15, 15)
        chain = f"I think the answer is around {wrong}.\\nFinal: {wrong}"
    return chain


def extract_answer(chain: str) -> int | None:
    """Extract the last integer from a chain-of-thought string."""
    import re
    matches = re.findall(r"-?\\d+", chain)
    return int(matches[-1]) if matches else None


# ── Self-Consistency ──────────────────────────────────────────────────────────

def self_consistency(
    question: str,
    correct_answer: int,
    n: int = 40,
    temperature: float = 0.7,
    p_correct: float = 0.6,
    early_stop_k: int | None = None,
    confidence_threshold: float = 0.95,
) -> dict:
    """
    Sample N reasoning chains and return the majority-vote answer.

    Parameters
    ----------
    question          : the question string (passed to the LLM)
    correct_answer    : ground-truth answer (for simulation only)
    n                 : maximum number of chains to sample
    temperature       : sampling temperature (higher = more diverse)
    p_correct         : per-chain accuracy (simulation parameter)
    early_stop_k      : if not None, use adaptive stopping with binomial test
    confidence_threshold: confidence level for early stopping

    Returns
    -------
    dict with keys: answer, confidence, n_used, votes
    """
    answers = []

    for i in range(1, n + 1):
        chain = mock_llm(question, temperature, correct_answer, p_correct)
        ans   = extract_answer(chain)
        if ans is not None:
            answers.append(ans)

        # ── Adaptive early stopping ────────────────────────────────────────────
        if early_stop_k is not None and i >= early_stop_k:
            counts      = Counter(answers)
            plurality   = counts.most_common(1)[0]
            m           = plurality[1]           # plurality count
            n_so_far    = len(answers)

            # Binomial test: P(Bin(n_so_far, 0.5) < m) > threshold
            # Using normal approximation for speed
            mu    = n_so_far * 0.5
            sigma = math.sqrt(n_so_far * 0.5 * 0.5)
            if sigma > 0:
                z     = (m - 0.5 - mu) / sigma   # continuity correction
                # Φ(z) approximation (logistic): P(Z < z)
                p_val = 1.0 / (1.0 + math.exp(-1.7 * z))
                if p_val > confidence_threshold:
                    break   # confident enough — stop early

    counts     = Counter(answers)
    best_ans, best_count = counts.most_common(1)[0]
    confidence = best_count / len(answers) if answers else 0.0

    return {
        "answer":     best_ans,
        "confidence": confidence,
        "n_used":     len(answers),
        "votes":      dict(counts.most_common(5)),
    }


# ── Demonstration ─────────────────────────────────────────────────────────────

QUESTION = "A bakery makes 73 loaves of bread each morning. If they sell 28 before noon and 19 in the afternoon, how many remain?"
CORRECT  = 73 - 28 - 19   # = 26

print("=" * 60)
print("Question:", QUESTION)
print(f"Correct answer: {CORRECT}")
print()

# Greedy (N=1, temperature~0)
greedy = self_consistency(QUESTION, CORRECT, n=1, p_correct=0.6)
print(f"Greedy decoding (N=1):")
print(f"  Answer: {greedy['answer']}  | correct: {greedy['answer'] == CORRECT}")

print()

# Standard self-consistency (N=40)
sc = self_consistency(QUESTION, CORRECT, n=40, temperature=0.7, p_correct=0.6)
print(f"Self-consistency (N=40, tau=0.7):")
print(f"  Answer:     {sc['answer']}")
print(f"  Confidence: {sc['confidence']:.2%}  ({sc['n_used']} chains used)")
print(f"  Vote dist:  {sc['votes']}")
print(f"  Correct:    {sc['answer'] == CORRECT}")

print()

# Adaptive self-consistency
asc = self_consistency(
    QUESTION, CORRECT,
    n=40, temperature=0.7, p_correct=0.6,
    early_stop_k=10, confidence_threshold=0.95,
)
print(f"Adaptive self-consistency (max N=40, early stop at 95% confidence):")
print(f"  Answer:     {asc['answer']}")
print(f"  Confidence: {asc['confidence']:.2%}")
print(f"  Chains used: {asc['n_used']} / 40  (saved {40 - asc['n_used']} calls)")
print(f"  Correct:    {asc['answer'] == CORRECT}")

print()

# ── Accuracy simulation over many questions ────────────────────────────────────
random.seed(42)
N_TRIALS  = 500
p_correct = 0.55   # per-chain accuracy (challenging setting)

greedy_correct = 0
sc_correct     = 0

for _ in range(N_TRIALS):
    g = self_consistency("sim", 1, n=1,  p_correct=p_correct)
    s = self_consistency("sim", 1, n=40, p_correct=p_correct, temperature=0.7)
    if g["answer"] == 1: greedy_correct += 1
    if s["answer"] == 1: sc_correct     += 1

print(f"Simulation over {N_TRIALS} trials (p_per_chain = {p_correct}):")
print(f"  Greedy accuracy:           {greedy_correct / N_TRIALS:.1%}")
print(f"  Self-consistency accuracy: {sc_correct / N_TRIALS:.1%}")
`

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Self-Consistency</h2>
            <p className="ch-story-intro">
                Chain-of-thought prompting gave language models a path to multi-step reasoning
                &mdash; but it exposed a new fragility. A single reasoning chain, decoded greedily,
                was deterministic and brittle: one wrong turn early in the chain cascaded into a
                confidently wrong answer. In March 2022, Wang et al. at Google asked a simple
                question: what if instead of trusting one chain, you sampled dozens and took a
                vote? The answer, self-consistency, turned out to be the most reliable prompting
                improvement discovered that year, boosting GSM8K accuracy by 27 percentage
                points with no additional training.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">The Problem</div>
                    <div className="ch-tl-title">Greedy CoT&rsquo;s Brittleness</div>
                    <div className="ch-tl-body">
                        Chain-of-thought prompting (Wei et al., 2022) decoded reasoning chains with
                        temperature&nbsp;=&nbsp;0 &mdash; deterministic, greedy, one chain per question.
                        The result was brittle in a specific way: if the model made one logical error
                        early in the chain, every subsequent step was conditioned on that error, and
                        the final answer compounded it. The model would arrive at a wrong answer with
                        high confidence because its internal reasoning was internally consistent with
                        the wrong premise. Standard error correction had no foothold: there was no
                        signal that anything had gone wrong.
                    </div>
                    <div className="ch-tl-impact">Impact: Identified the core failure mode of greedy chain-of-thought &mdash; error propagation with no recovery mechanism</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2022</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Self-Consistency &mdash; Wang et al. (Google)</div>
                    <div className="ch-tl-body">
                        &ldquo;Self-Consistency Improves Chain of Thought Reasoning in Language
                        Models&rdquo; (Wang et al., ICLR 2023, arXiv March 2022). The algorithm
                        is three steps: (1)&nbsp;sample N&nbsp;=&nbsp;40 independent reasoning
                        chains from the model using temperature&nbsp;&gt;&nbsp;0 (diverse
                        sampling); (2)&nbsp;extract the final answer from each chain; (3)&nbsp;return
                        the most frequent answer (majority vote). No new model. No fine-tuning.
                        No architectural change. GSM8K: CoT greedy 46.9%&nbsp;&rarr;&nbsp;self-consistency
                        74.4% (+27.5 pp). The MATH benchmark showed comparable gains. This was
                        the largest improvement from any pure prompting method to date.
                    </div>
                    <div className="ch-tl-impact">Impact: +27.5 pp on GSM8K with no additional training; established sampling + voting as a core reasoning primitive</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Why It Works</div>
                    <div className="ch-tl-title">Correct Answers Concentrate; Wrong Answers Spread</div>
                    <div className="ch-tl-body">
                        The intuition behind self-consistency is a distributional argument. Many
                        different valid reasoning paths lead to the same correct answer&nbsp;&mdash;
                        they may differ in order, framing, or intermediate steps, but they converge
                        on the same final value. Wrong answers, by contrast, are fragmented: one
                        error produces 68, a different error produces 81, a third gives 72. When
                        you sample 40 chains, the correct answer accumulates votes from all the
                        diverse correct paths; each wrong answer collects only the votes from the
                        narrow set of chains that made that specific error. Majority vote finds
                        the concentrated answer. This is precisely the variance-reduction logic
                        of ensemble methods in supervised learning: diversity plus aggregation
                        reduces the probability of collective error.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided the theoretical grounding that connected self-consistency to classical ensemble learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Sampling Strategy</div>
                    <div className="ch-tl-title">Temperature Calibration: Diversity vs. Coherence</div>
                    <div className="ch-tl-body">
                        The sampling temperature &tau; controls the diversity-quality trade-off.
                        At &tau;&nbsp;=&nbsp;0: all chains are identical, no benefit from voting.
                        At &tau;&nbsp;&rarr;&nbsp;&infin;: chains are random token sequences,
                        individually incoherent. Wang et al. systematically evaluated
                        &tau;&nbsp;&isin;&nbsp;&#123;0.3, 0.5, 0.7, 1.0&#125; and found
                        &tau;&nbsp;=&nbsp;0.5&ndash;0.7 optimal across arithmetic and commonsense
                        reasoning benchmarks. The optimal temperature is one where chains are
                        diverse enough to take genuinely different reasoning paths, but coherent
                        enough that each individual chain still reaches a sensible conclusion.
                    </div>
                    <div className="ch-tl-impact">Impact: Established tau = 0.5&ndash;0.7 as the empirical optimum; showed that temperature is the key hyperparameter for self-consistency</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Efficiency</div>
                    <div className="ch-tl-title">Adaptive Self-Consistency &mdash; Early Stopping</div>
                    <div className="ch-tl-body">
                        Self-consistency&rsquo;s main cost is inference: N&nbsp;=&nbsp;40 LLM
                        calls per question is 40&times; the cost of greedy decoding. Aggarwal
                        et al. (2023) introduced adaptive self-consistency: run chains in
                        batches; after each batch, apply a binomial test to the current
                        plurality answer. If the probability that the plurality answer has
                        a true majority exceeds a confidence threshold (e.g., 95%), stop
                        sampling. When the first 10 chains all agree, there is no reason to
                        run 30 more. Empirically: adaptive stopping reduces the average
                        inference cost by 50&ndash;70% while achieving accuracy within 0.5 pp
                        of full N&nbsp;=&nbsp;40 self-consistency.
                    </div>
                    <div className="ch-tl-impact">Impact: 50&ndash;70% inference cost reduction; made self-consistency practical for production deployment</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Universal Self-Consistency &mdash; Chen et al.</div>
                    <div className="ch-tl-body">
                        Standard self-consistency requires extractable answers &mdash; numbers,
                        labels, multiple-choice options &mdash; so majority vote can be applied.
                        Chen et al. (2023) extended the idea to open-ended tasks: generate N
                        responses as before, then prompt the LLM itself as an aggregator.
                        The aggregation prompt is: &ldquo;Here are N responses to the following
                        question. What is the most consistent answer across these
                        responses?&rdquo; The LLM synthesizes the responses rather than
                        counting votes. Universal self-consistency demonstrated gains on code
                        generation, long-form summarization, and open-ended question answering
                        &mdash; tasks where exact answer matching is impossible.
                    </div>
                    <div className="ch-tl-impact">Impact: Extended self-consistency beyond classification to generation tasks; established LLM-as-aggregator as a viable pattern</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023&ndash;2024</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">Self-Consistency as Standard Baseline and o1 Precursor</div>
                    <div className="ch-tl-body">
                        Self-consistency became the standard baseline for reasoning evaluations:
                        any new prompting strategy must outperform self-consistency at the same
                        inference budget to be considered competitive. Its deeper influence was
                        on training methodology. Self-consistency demonstrated that sampling many
                        reasoning paths at test time and aggregating them reliably improved
                        accuracy &mdash; the same principle that underlies o1-style models, which
                        learn to search over reasoning paths internally during training using
                        process reward models. Self-consistency showed that the reasoning-path
                        ensemble signal was strong enough to be worth scaling, and that observation
                        informed the design of reinforcement-learning-from-reasoning-feedback
                        approaches that produced o1, DeepSeek-R1, and their successors.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the standard reasoning baseline; its test-time compute insight directly informed o1-style model training</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Self-consistency is not an approximation
                &mdash; it samples the same model with the same prompt and aggregates exact
                outputs. Its power comes from a distributional asymmetry: correct reasoning
                paths are more numerous and more diverse than any single wrong reasoning path.
                Majority voting exploits this asymmetry without any knowledge of which specific
                paths are correct. The method is simple enough to implement in five lines of
                code, yet it outperformed every competing prompting strategy of 2022 on
                arithmetic reasoning benchmarks.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Self-Consistency: ask 40 people and take the vote</h2>

            <Analogy label="Ask 40 People, Take the Vote">
                Instead of asking one person for the answer and hoping they get it right,
                ask 40 people to work through the problem on their own. Each person might make
                a different mistake &mdash; one misreads a number, another rounds too early,
                a third skips a step. But most people will reach the right answer, and the
                right answer is the one that comes up most often. Wrong answers spread across
                many different wrong values; the right answer concentrates. Majority vote
                finds the concentrated answer.
            </Analogy>

            <Analogy label="Different Roads to the Same City">
                There are many different correct ways to reach &ldquo;26&rdquo;: work
                left-to-right, group the subtractions, draw a number line, use mental
                arithmetic. But there are also many different wrong paths: someone gives 68,
                someone else 81, a third gives 72. When you sample 40 chains, most paths
                arrive at 26 while the wrong answers are spread across dozens of different
                incorrect values. Majority vote finds 26 without knowing in advance which
                chains were correct.
            </Analogy>

            <Analogy label="Temperature: How Random to Be">
                Temperature controls how random each chain is. At temperature&nbsp;=&nbsp;0
                the model always picks the most likely next word &mdash; every chain is
                identical, so taking a vote gives you nothing. At temperature&nbsp;=&nbsp;0.7
                the model adds just enough randomness that each chain takes different
                logical detours. High enough to make the chains genuinely different; low
                enough that each chain still makes sense. That is the sweet spot
                where self-consistency works best.
            </Analogy>

            <Analogy label="The Confidence Signal">
                If 38 out of 40 chains give the same answer, you can be very confident.
                If the chains give 10 different answers with 4 votes each, the model is
                uncertain and you should not trust any single answer. Self-consistency
                automatically produces a confidence score: the fraction of chains that
                agree with the plurality answer. High agreement means high confidence;
                scattered votes mean low confidence.
            </Analogy>

            <Analogy label="Adaptive Sampling: Stop When Sure">
                If the first 10 chains all give the same answer, you probably do not need
                to run 30 more. Adaptive self-consistency checks after each batch: if enough
                chains already agree, stop early and save the remaining inference calls.
                This cuts the average cost by 50&ndash;70% while getting nearly identical
                accuracy &mdash; you only pay for the extra chains when the answer is
                genuinely uncertain.
            </Analogy>

            <Analogy label="Universal Self-Consistency: Vote on Open-Ended Answers">
                Majority vote works when answers are numbers or labels you can count.
                For essays, code, or summaries there is no single &ldquo;most common
                answer&rdquo; to count. Universal self-consistency handles this by asking
                the model itself to read all 40 responses and write the most consistent
                one. The model becomes the aggregator, synthesizing the agreement across
                all the responses instead of counting identical strings.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of majority-vote reasoning</h2>

            <h3>Self-Consistency Algorithm</h3>
            <p>
                Generate N independent reasoning chains by sampling from the model at
                temperature &tau;&nbsp;&gt;&nbsp;0. Each chain i produces a reasoning
                trace c&#7522; and an extracted final answer a&#7522;. The self-consistency
                estimate is:
            </p>
            <MathBlock tex="\hat{y} = \underset{a}{\arg\max} \;\left|\{i : a_i = a\}\right|" />
            <p>
                Let y* be the correct answer and p&nbsp;=&nbsp;P(a&#7522;&nbsp;=&nbsp;y*)
                the per-chain accuracy. Each chain is an independent Bernoulli(p) trial.
                The majority vote is correct whenever the binomial count exceeds N/2:
            </p>
            <MathBlock tex="P(\hat{y} = y^*) = P\!\left(\operatorname{Bin}(N,\, p) > \tfrac{N}{2}\right) = \sum_{k=\lceil N/2 \rceil}^{N} \binom{N}{k} p^k (1-p)^{N-k}" />
            <p>
                For p&nbsp;=&nbsp;0.6 and N&nbsp;=&nbsp;40: P(majority correct)&nbsp;&asymp;&nbsp;0.97.
                For p&nbsp;=&nbsp;0.55 and N&nbsp;=&nbsp;40: P(majority correct)&nbsp;&asymp;&nbsp;0.85.
                The gain over greedy (which has accuracy p) is largest when p is just above 0.5.
            </p>

            <h3>Why Majority Voting Works: Variance Reduction</h3>
            <p>
                View each chain as a random variable X&#7522;&nbsp;=&nbsp;1[a&#7522;&nbsp;=&nbsp;y*]
                &sim;&nbsp;Bernoulli(p). The single-chain estimator has variance:
            </p>
            <MathBlock tex="\operatorname{Var}(X_1) = p(1-p)" />
            <p>
                The majority-vote estimator is an indicator that the sample mean exceeds 0.5.
                By the law of large numbers, the sample mean converges to p as N grows. For
                any p&nbsp;&gt;&nbsp;0.5:
            </p>
            <MathBlock tex="\lim_{N \to \infty} P\!\left(\frac{1}{N}\sum_{i=1}^{N} X_i > \tfrac{1}{2}\right) = 1" />
            <p>
                Self-consistency is an ensemble method applied to reasoning: diversity (from
                temperature sampling) plus aggregation (majority vote) reduces the probability
                of collective error, exactly as bagging reduces variance in supervised learning.
            </p>

            <h3>Optimal Temperature</h3>
            <p>
                Define chain quality q(&tau;) as the probability that a chain sampled at
                temperature &tau; reaches the correct answer, and chain diversity d(&tau;)
                as one minus the expected pairwise similarity between chains:
            </p>
            <MathBlock tex="d(\tau) = 1 - \mathbb{E}\!\left[\operatorname{cos\_sim}(c_1,\, c_2)\right]" />
            <p>
                At &tau;&nbsp;=&nbsp;0: d(&tau;)&nbsp;=&nbsp;0 (all chains identical, no benefit
                from voting). At &tau;&nbsp;&rarr;&nbsp;&infin;: q(&tau;)&nbsp;&rarr;&nbsp;0
                (random token sequences, no correct chains). The effective accuracy of
                self-consistency is maximized at:
            </p>
            <MathBlock tex="\tau^* = \arg\max_{\tau}\; q(\tau) \cdot d(\tau)" />
            <p>
                Wang et al. found &tau;*&nbsp;&asymp;&nbsp;0.5&ndash;0.7 for arithmetic
                reasoning benchmarks. Higher temperatures improved diversity but hurt individual
                chain quality faster than diversity helped the vote.
            </p>

            <h3>Adaptive Self-Consistency</h3>
            <p>
                Rather than always sampling N&nbsp;=&nbsp;40 chains, adaptive self-consistency
                stops early when the current plurality answer is statistically confident. After
                n&nbsp;&lt;&nbsp;N chains, let m be the plurality count. Apply a one-sided
                binomial test with null hypothesis p&nbsp;=&nbsp;0.5 (random):
            </p>
            <MathBlock tex="\text{Stop if}\quad P\!\left(\operatorname{Bin}(n,\; 0.5) < m\right) > 0.95" />
            <p>
                The expected stopping time n&#770; when the true per-chain accuracy is
                p&nbsp;=&nbsp;0.7 satisfies n&#770;&nbsp;&asymp;&nbsp;N/3 &mdash; meaning roughly
                two-thirds of the inference budget is saved. Cost savings as a fraction of N:
            </p>
            <MathBlock tex="\text{Savings} \approx \frac{N - \mathbb{E}[n_{\text{stop}}]}{N} \approx 0.66 \quad \text{when } p = 0.7" />

            <h3>Self-Consistency vs. Beam Search</h3>
            <p>
                Beam search keeps the top-B partial sequences at each decoding step, exploring
                the high-probability region of the model&rsquo;s distribution. Self-consistency
                independently samples from the model&rsquo;s full distribution. For multi-step
                reasoning, beam search tends to produce locally similar chains &mdash; all
                exploring slight variations of the same high-probability path. Self-consistency
                samples globally diverse paths. The diversity gap can be measured by the
                average pairwise KL divergence of the reasoning distributions:
            </p>
            <MathBlock tex="\text{Diversity} = \mathbb{E}_{i \neq j}\!\left[D_{\mathrm{KL}}\!\left(P(c_i) \,\|\, P(c_j)\right)\right]" />
            <p>
                Empirically, self-consistency achieves higher diversity and higher accuracy
                than beam search at the same number of LLM calls for arithmetic and commonsense
                reasoning tasks. Beam search excels when the goal is the single most likely
                sequence; self-consistency excels when the goal is the most robust answer.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Minimum N derivation &middot; temperature and KL divergence &middot; accuracy target analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Self-consistency with majority vote &middot; confidence scoring &middot; adaptive early stopping</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Minimum N for a target accuracy and temperature&ndash;diversity analysis</h2>

            <DefBlock label="Problem: Minimum N Given Per-Chain Accuracy p and Target A">
                Given per-chain accuracy p&nbsp;&gt;&nbsp;0.5 and a desired majority-vote
                accuracy A (e.g., A&nbsp;=&nbsp;0.95), what is the minimum N such that
                P(majority correct)&nbsp;&ge;&nbsp;A?
            </DefBlock>

            <p>
                The exact expression is the binomial tail sum, but for practical estimates
                use the normal approximation. The majority-vote accuracy is:
            </p>
            <MathBlock tex="P(\hat{y} = y^*) \approx \Phi\!\left(\frac{(p - 0.5)\sqrt{N}}{\sqrt{p(1-p)}}\right)" />
            <p>
                where &Phi; is the standard normal CDF. Setting this equal to A and solving
                for N:
            </p>
            <MathBlock tex="N \geq \left(\frac{z_A \sqrt{p(1-p)}}{p - 0.5}\right)^2" />
            <p>
                where z&#8336; is the A-th quantile of the standard normal (e.g.,
                z&#8320;&#8331;&#8325;&nbsp;=&nbsp;1.645, z&#8320;&#8331;&#8329;&nbsp;=&nbsp;2.326).
                Worked example: p&nbsp;=&nbsp;0.6, A&nbsp;=&nbsp;0.95:
            </p>
            <MathBlock tex="N \geq \left(\frac{1.645 \cdot \sqrt{0.6 \cdot 0.4}}{0.6 - 0.5}\right)^2 = \left(\frac{1.645 \cdot 0.490}{0.1}\right)^2 \approx 65" />
            <p>
                For p&nbsp;=&nbsp;0.7, A&nbsp;=&nbsp;0.99: N&nbsp;&ge;&nbsp;17. The required
                N drops rapidly as p increases above 0.5 &mdash; self-consistency is most
                valuable when individual chains are only slightly better than random.
            </p>

            <h3>Temperature and Chain Diversity via KL Divergence</h3>
            <p>
                Let P&#120591;(c) denote the distribution over reasoning chains at temperature
                &tau;. The diversity of a set of N chains sampled from P&#120591; can be
                measured by the expected pairwise KL divergence between individual token
                distributions. For an autoregressive model with logits z&#7522;&#7511;
                at position t:
            </p>
            <MathBlock tex="P_\tau(\text{token} = k \mid \text{context}) = \frac{\exp(z_k / \tau)}{\sum_j \exp(z_j / \tau)}" />
            <p>
                As &tau;&nbsp;&rarr;&nbsp;0, this distribution concentrates on the argmax
                token &mdash; all chains are identical. The pairwise KL between two
                temperatures &tau;&#8321; and &tau;&#8322; at a single position is:
            </p>
            <MathBlock tex="D_{\mathrm{KL}}\!\left(P_{\tau_1} \,\|\, P_{\tau_2}\right) = \sum_k P_{\tau_1}(k)\log\frac{P_{\tau_1}(k)}{P_{\tau_2}(k)}" />
            <p>
                Integrating this over all positions in the chain gives the total diversity
                contributed by temperature. The quality&ndash;diversity trade-off is:
                higher &tau; increases the pairwise KL (more diverse chains) but also
                increases the entropy of each individual chain, degrading the probability
                that any single chain follows a coherent reasoning path. The optimal &tau;*
                balances these two effects, and this balance is task-dependent &mdash; tasks
                with more stereotyped correct reasoning paths (e.g., arithmetic) prefer
                lower &tau;; tasks with genuinely diverse correct approaches prefer higher &tau;.
            </p>

            <div className="ch-callout">
                <strong>The broader lesson &mdash; test-time compute scaling:</strong>{" "}
                The mathematics of self-consistency shows that accuracy scales as
                &Phi;((p&nbsp;&minus;&nbsp;0.5)&radic;N / &radic;(p(1&minus;p))). This
                is a square-root law: doubling N improves the accuracy gap from 0.5 by a
                factor of &radic;2. This diminishing return suggests that self-consistency
                is most efficient in the moderate-N regime (N&nbsp;=&nbsp;20&ndash;40)
                for tasks where p&nbsp;&isin;&nbsp;[0.55, 0.75]. The same square-root
                scaling law recurs throughout test-time compute research: more compute
                always helps, but with diminishing returns that must be weighed against
                the linear cost increase.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                Self-consistency implemented from scratch: a mock LLM sampler,
                majority-vote aggregation, confidence scoring, and adaptive early
                stopping via a binomial test. Replace the mock LLM with a real API
                call to use in production. Includes a simulation comparing greedy
                decoding vs. self-consistency accuracy over 500 trials.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="self_consistency.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const SELF_CONSISTENCY_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
