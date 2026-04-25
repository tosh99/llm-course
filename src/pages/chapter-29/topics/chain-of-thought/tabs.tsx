import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import re
import random

# ── Few-Shot CoT Prompt Construction ─────────────────────────────────────────
# Standard GSM8K-style few-shot: (question, answer)
# CoT few-shot: (question, reasoning_chain, answer)

FEW_SHOT_DIRECT = [
    {
        "question": "A store sells apples for $0.50 each. If Maria buys 8 apples and pays with a $5 bill, how much change does she receive?",
        "answer": "$1.00",
    },
    {
        "question": "A train travels 60 mph for 2 hours. How far does it travel?",
        "answer": "120 miles",
    },
]

FEW_SHOT_COT = [
    {
        "question": "A store sells apples for $0.50 each. If Maria buys 8 apples and pays with a $5 bill, how much change does she receive?",
        "reasoning": (
            "First, find the total cost: 8 apples × $0.50 = $4.00. "
            "Then find the change: $5.00 - $4.00 = $1.00."
        ),
        "answer": "$1.00",
    },
    {
        "question": "A train travels 60 mph for 2 hours. How far does it travel?",
        "reasoning": (
            "Distance = speed × time. "
            "Distance = 60 mph × 2 hours = 120 miles."
        ),
        "answer": "120 miles",
    },
]

def build_direct_prompt(test_question: str) -> str:
    """Standard few-shot: (Q, A) pairs with no reasoning shown."""
    lines = []
    for ex in FEW_SHOT_DIRECT:
        lines.append(f"Q: {ex['question']}")
        lines.append(f"A: {ex['answer']}")
        lines.append("")
    lines.append(f"Q: {test_question}")
    lines.append("A:")
    return "\\n".join(lines)

def build_cot_prompt(test_question: str) -> str:
    """CoT few-shot: (Q, reasoning, A) — model generates chain before answer."""
    lines = []
    for ex in FEW_SHOT_COT:
        lines.append(f"Q: {ex['question']}")
        lines.append(f"A: {ex['reasoning']} The answer is {ex['answer']}.")
        lines.append("")
    lines.append(f"Q: {test_question}")
    lines.append("A:")
    return "\\n".join(lines)

def build_zero_shot_cot_prompt(test_question: str) -> tuple[str, str]:
    """
    Zero-shot CoT (Kojima et al., 2022): two-stage.
    Stage 1: Append 'Let's think step by step' to elicit chain.
    Stage 2: Append 'Therefore, the answer is:' to commit to answer.
    Returns (stage1_prompt, stage2_template).
    """
    stage1 = f"Q: {test_question}\\nA: Let's think step by step."
    stage2_template = "{chain}\\nTherefore, the answer is:"
    return stage1, stage2_template

# ── Simulated Accuracy Comparison ─────────────────────────────────────────────
# Simulate per-step accuracy ε and chain accuracy for k-step chains.
# Chain accuracy ≈ (1 - ε)^k  for small ε.

def chain_accuracy(per_step_accuracy: float, num_steps: int) -> float:
    """Expected accuracy of a k-step chain given per-step accuracy."""
    return per_step_accuracy ** num_steps

print("Chain accuracy = (per-step accuracy)^k")
print(f"{'Model':>20}  {'ε (per step)':>14}  {'k=1':>8}  {'k=3':>8}  {'k=6':>8}")
models = [
    ("Small (7B)",  0.80),
    ("Medium (70B)", 0.92),
    ("Large (175B)", 0.97),
]
for name, acc in models:
    r1 = chain_accuracy(acc, 1)
    r3 = chain_accuracy(acc, 3)
    r6 = chain_accuracy(acc, 6)
    print(f"{name:>20}  {1-acc:>14.2f}  {r1:>8.3f}  {r3:>8.3f}  {r6:>8.3f}")

print()

# ── Faithfulness Test (Lanham et al., Anthropic 2023) ─────────────────────────
# Faithfulness metric: how much does perturbing the chain hurt accuracy?
# F = 1 - (accuracy_with_perturbed_chain / accuracy_with_correct_chain)
# F ≈ 0: chain is decorative (model ignores it)
# F ≈ 1: chain is faithfully used in computation

def faithfulness_metric(acc_correct: float, acc_perturbed: float) -> float:
    if acc_correct == 0:
        return 0.0
    return 1.0 - acc_perturbed / acc_correct

print("Faithfulness metric F = 1 - acc_perturbed / acc_correct")
print("F ≈ 0: chain is decorative.  F ≈ 1: chain is causally used.")
print()
results = [
    ("Small (7B) GPT-style",   0.35, 0.34),
    ("Large (175B) GPT-style", 0.62, 0.38),
    ("GPT-4 (est.)",           0.87, 0.41),
]
for name, acc_c, acc_p in results:
    f = faithfulness_metric(acc_c, acc_p)
    print(f"  {name:>28}: acc_correct={acc_c:.2f}  acc_perturbed={acc_p:.2f}  F={f:.3f}")

print()
print("--- Prompt examples ---")
test_q = "If a baker makes 48 rolls and packs them in bags of 6, how many bags does she fill?"
print("Direct prompt:")
print(build_direct_prompt(test_q))
print()
print("CoT few-shot prompt:")
print(build_cot_prompt(test_q))
print()
s1, s2t = build_zero_shot_cot_prompt(test_q)
print("Zero-shot CoT stage 1:")
print(s1)
print("Zero-shot CoT stage 2 template (filled after model returns chain):")
print(s2t.format(chain="<model-generated chain goes here>"))
`

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Chain-of-Thought Prompting</h2>
            <p className="ch-story-intro">
                The architectural advances of Chapter&nbsp;28 made large Transformer models
                faster, more memory-efficient, and capable of processing longer sequences.
                But these were engineering improvements on a fixed capability profile &mdash;
                they did not change what models could reason about. In January&nbsp;2022,
                Jason Wei and colleagues at Google published a finding that changed the
                field&rsquo;s understanding of what prompting alone could unlock: by showing
                language models examples where the answer was accompanied by explicit
                step-by-step reasoning, the models&rsquo; performance on hard arithmetic and
                logic tasks jumped dramatically &mdash; not through any weight update, but
                purely through how the prompt was structured. Chain-of-thought was a
                prompting discovery, not a training discovery, and it forced a reconsideration
                of what large models could already do.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Bottleneck Established</div>
                    <div className="ch-tl-title">GPT-3 and the Limits of Direct Answering</div>
                    <div className="ch-tl-body">
                        GPT-3 (Brown et al., 2020) demonstrated impressive few-shot
                        performance on many tasks &mdash; but struggled systematically on
                        multi-step arithmetic and logical reasoning. Prompting the model
                        with (question,&nbsp;answer) pairs without intermediate steps
                        led it to jump directly to an answer. For a problem like
                        &ldquo;If a train travels at 60&nbsp;mph for 3&nbsp;hours, then
                        at 40&nbsp;mph for 2&nbsp;hours, what is the total distance?&rdquo;
                        &mdash; GPT-3 would frequently output an incorrect number, having
                        conflated the two legs of the journey or misapplied the formula.
                        The model&rsquo;s few-shot format showed only end results; there
                        were no examples of working through a problem step by step.
                        The implicit assumption was that if the model knew the facts, it
                        could apply them &mdash; but multi-step inference requires more
                        than fact retrieval.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that few-shot prompting with direct (Q, A) pairs was insufficient for multi-step reasoning tasks, even at 175B parameters</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">January 2022</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Wei et al. &mdash; &ldquo;Chain-of-Thought Prompting Elicits Reasoning in Large Language Models&rdquo;</div>
                    <div className="ch-tl-body">
                        Jason Wei, Xuezhi Wang, Dale Schuurmans, and colleagues at Google
                        Brain published the defining chain-of-thought paper. The intervention
                        was conceptually simple: replace (Q,&nbsp;A) few-shot examples with
                        (Q,&nbsp;reasoning chain,&nbsp;A) triples, where the reasoning chain
                        is a natural-language walkthrough of the intermediate steps. The
                        model then generates its own reasoning chain for the test question
                        before producing the final answer. Results on benchmark tasks were
                        the most dramatic prompting improvements ever observed at the time.
                        On GSM8K (grade-school math, 8-step problems on average): GPT-3
                        (175B) with standard prompting achieved 17.9% accuracy; with CoT
                        prompting, 46.9% &mdash; a 2.6&times; improvement from prompt
                        format alone. On AQUA-RAT (algebraic word problems): 22.9% to
                        35.8%. On StrategyQA (commonsense reasoning): 63.9% to 65.4%.
                        The gains were not uniform, but on the hardest multi-step tasks
                        they were transformative.
                    </div>
                    <div className="ch-tl-impact">Impact: GSM8K: 17.9% &rarr; 46.9% with no weight updates; the largest prompting gain ever observed on multi-step reasoning tasks at that time</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">January 2022</div>
                    <div className="ch-tl-section-label">Scale Dependence</div>
                    <div className="ch-tl-title">CoT Only Emerges Above ~100B Parameters</div>
                    <div className="ch-tl-body">
                        The same Wei et al. paper contained a finding almost as important as
                        the technique itself: CoT prompting did not help &mdash; and sometimes
                        hurt &mdash; models below roughly 100 billion parameters. PaLM&nbsp;8B
                        with CoT prompting showed accuracy decreases on several benchmarks.
                        PaLM&nbsp;62B showed modest improvements on some tasks but not others.
                        PaLM&nbsp;540B with CoT showed large, consistent gains across all
                        reasoning benchmarks. The failure mode for small models was
                        diagnosable: their intermediate reasoning steps were incoherent. The
                        model would attempt to reason (&ldquo;Let me compute 63&nbsp;&divide;&nbsp;9...&rdquo;)
                        but make arithmetic or logical errors within the chain itself, and
                        those errors compounded. A chain of five steps, each with a 20%
                        error rate, has only a 33% chance of producing a correct final
                        answer. CoT requires sufficient model capacity to execute each
                        individual step reliably.
                    </div>
                    <div className="ch-tl-impact">Impact: Established scale-dependence as a fundamental property of CoT; below ~100B parameters, CoT prompting is counterproductive</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2022</div>
                    <div className="ch-tl-section-label">Zero-Shot Extension</div>
                    <div className="ch-tl-title">Kojima et al. &mdash; &ldquo;Large Language Models are Zero-Shot Reasoners&rdquo;</div>
                    <div className="ch-tl-body">
                        Takeshi Kojima and colleagues at Google showed that CoT reasoning
                        could be elicited without any few-shot examples at all. The
                        intervention: append the single phrase &ldquo;Let&rsquo;s think step
                        by step.&rdquo; to the prompt before generating the answer. On
                        GSM8K: the zero-shot baseline (no examples, no magic phrase)
                        scored 10.4% accuracy. Adding only &ldquo;Let&rsquo;s think step by
                        step.&rdquo; raised this to 40.7% &mdash; approaching the few-shot
                        CoT performance from the Wei et al. paper. On MultiArith: zero-shot
                        17.7% &rarr; 78.7%. The model already knew how to reason; it needed
                        a distributional trigger to activate the reasoning template it had
                        learned during pretraining on documents containing step-by-step
                        explanations. The result also implied that few-shot CoT gains may
                        partly reflect format signaling rather than information transfer.
                    </div>
                    <div className="ch-tl-impact">Impact: GSM8K: 10.4% &rarr; 40.7% from four words; zero-shot CoT showed the model already possessed latent reasoning capability</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2022</div>
                    <div className="ch-tl-section-label">Decomposition Strategy</div>
                    <div className="ch-tl-title">Least-to-Most Prompting &mdash; Zhou et al. (Google)</div>
                    <div className="ch-tl-body">
                        Denny Zhou and colleagues proposed an alternative decomposition
                        strategy: rather than writing out all steps in one chain, first
                        decompose the problem into an ordered list of subproblems, then
                        solve each subproblem sequentially, feeding the answer to each
                        subproblem as context for the next. For example, to solve
                        &ldquo;How many days until Christmas if today is Halloween?&rdquo;
                        &mdash; first ask the model to list the subproblems
                        (&ldquo;How many days remain in October?&rdquo;, &ldquo;How many
                        days in November?&rdquo;, &ldquo;How many days until Dec 25?&rdquo;),
                        then solve each in order. On the SCAN symbolic task (compositional
                        generalization): standard CoT achieved 16%; least-to-most prompting
                        achieved 99.7%. The difference was systematic: tasks requiring
                        the answer to one subproblem before the next can be solved benefit
                        from explicit subproblem sequencing. CoT writes out all steps at once;
                        least-to-most adaptively conditions on prior results.
                    </div>
                    <div className="ch-tl-impact">Impact: SCAN: CoT 16% &rarr; least-to-most 99.7%; demonstrated that decomposition strategy, not just step visibility, determines reasoning success</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Faithfulness Analysis</div>
                    <div className="ch-tl-title">Lanham et al. (Anthropic) &mdash; Faithful and Unfaithful Reasoning</div>
                    <div className="ch-tl-body">
                        Tamera Lanham and colleagues at Anthropic investigated whether
                        CoT chains are actually used by the model in its computation, or
                        are post-hoc rationalizations. The methodology: generate a CoT
                        chain C for a question; then perturb C (replace reasoning steps
                        with placeholders or incorrect content) to produce C&rsquo;;
                        measure model accuracy with C vs.&nbsp;C&rsquo;. If accuracy drops
                        significantly when the chain is perturbed, the model is faithfully
                        using the chain. If accuracy is unchanged, the chain is decorative.
                        Key findings: (1)&nbsp;Larger models are more faithful than smaller
                        models &mdash; their chains are more causally connected to their
                        outputs. (2)&nbsp;For some tasks and model sizes, significant
                        accuracy is preserved even with heavily perturbed chains, suggesting
                        the model reached the answer through statistical pattern matching
                        and generated the chain post-hoc. (3)&nbsp;The degree of faithfulness
                        is task- and model-dependent; mathematical reasoning shows higher
                        faithfulness than commonsense reasoning.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed CoT chains are not always faithful explanations; raised fundamental questions about interpretability and reasoning verification</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Production Deployment</div>
                    <div className="ch-tl-title">CoT in GPT-4, Claude, and Mathematical Benchmarks</div>
                    <div className="ch-tl-body">
                        By 2023, chain-of-thought prompting was deployed by default in
                        frontier AI systems. GPT-4 (OpenAI, March&nbsp;2023) uses CoT
                        internally for mathematical and logical queries; the model&rsquo;s
                        system prompt instructs it to show its work. Claude&rsquo;s
                        &ldquo;extended thinking&rdquo; mode makes the reasoning chain
                        visible and provides it as a separate output field. Progress on
                        mathematical reasoning benchmarks was dramatic: on MATH
                        (competition-level problems from AMC and AIME),
                        GPT-4 achieved 42.5% (compared to GPT-3.5&rsquo;s&nbsp;~28%).
                        Claude&nbsp;3 Opus reached 60.1%. OpenAI o1 (October&nbsp;2023),
                        which uses training-time process reward optimization rather than
                        pure prompting, achieved 83.3% on MATH and 90.0% on GSM8K &mdash;
                        demonstrating the gap between test-time CoT prompting and
                        training-time chain-of-thought optimization, a distinction that
                        would define the next era of reasoning research.
                    </div>
                    <div className="ch-tl-impact">Impact: MATH benchmark: GPT-4 42.5% &rarr; o1 83.3%; the trajectory from CoT prompting to process-reward training defined Reasoning Research 2023&ndash;2025</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The central insight:</strong> Chain-of-thought prompting revealed
                that large language models contain latent reasoning capability that standard
                (Q,&nbsp;A) prompting fails to activate. The model had been trained on
                millions of documents that include step-by-step explanations, proofs, and
                worked examples; CoT prompting signals the model to apply those learned
                templates to the current problem. This is not a training intervention &mdash;
                no weights change. It is a discovery about what was already there.
                The scale dependence (&gt;100B parameters) reflects a genuine requirement:
                each step in the chain must be executed reliably, and only large enough
                models have the per-step accuracy for multi-step chains to compound
                correctly rather than catastrophically.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Chain-of-Thought: show your work and the AI gets smarter</h2>

            <Analogy label="&ldquo;Show Your Work&rdquo;">
                Teachers always say &ldquo;show your work&rdquo; because the process
                matters, not just the final answer. Chain-of-thought does the same thing
                for AI. Instead of asking &ldquo;what is 3&nbsp;&times;&nbsp;17&nbsp;+&nbsp;22?&rdquo;
                and showing examples that only have answers, you include examples where
                the AI first writes &ldquo;3&nbsp;&times;&nbsp;17&nbsp;=&nbsp;51&rdquo; then
                &ldquo;51&nbsp;+&nbsp;22&nbsp;=&nbsp;73.&rdquo; Once it sees this pattern,
                it does the same thing for new problems &mdash; and gets the right
                answer far more often.
            </Analogy>

            <Analogy label="The Magic Phrase">
                Typing &ldquo;Let&rsquo;s think step by step&rdquo; at the end of a hard
                question makes the AI dramatically smarter at it. Not because those words
                are magic &mdash; but because the AI has seen millions of step-by-step
                explanations during training, and those words signal &ldquo;use that
                learned reasoning template now.&rdquo; It&rsquo;s like asking someone
                &ldquo;can you walk me through your thinking?&rdquo; &mdash; they may
                have arrived at an answer instinctively, but the prompt makes them slow
                down and reason more carefully.
            </Analogy>

            <Analogy label="Why Small Models Cannot Do It">
                A small AI (7B parameters) tries &ldquo;Let me reason step by step:
                63&nbsp;&divide;&nbsp;9&nbsp;=&nbsp;8, then 8&nbsp;&times;&nbsp;5&nbsp;=&nbsp;35...
                wait that&rsquo;s wrong because 63&nbsp;&divide;&nbsp;9&nbsp;=&nbsp;7...&rdquo;
                &mdash; the intermediate steps themselves have errors that cascade. A much
                larger model (70B+) is reliable enough at each individual step that the
                chain stays correct all the way through. Chain-of-thought needs a model
                big enough to actually follow multi-step logic reliably, not just attempt it.
            </Analogy>

            <Analogy label="Least-to-Most: Break It Down First">
                For a really hard problem, first ask &ldquo;what smaller problems do I
                need to solve?&rdquo; Then solve each small problem. Then combine. Like
                planning a road trip: first figure out which cities to stop at, then plan
                each leg of the trip. Each leg becomes easy when you tackle it one at a
                time. This is least-to-most prompting &mdash; and on some tasks it works
                dramatically better than writing out one long chain of steps.
            </Analogy>

            <Analogy label="CoT Does Not Rewrite the Model">
                Chain-of-thought is purely prompting &mdash; no training, no weight
                updates. The model already had reasoning capability baked in from
                training on millions of documents with worked solutions and explanations.
                CoT prompting unlocks it. Like a genius who performs much better when
                given scratch paper: the scratch paper doesn&rsquo;t make them smarter,
                it gives their existing intelligence somewhere to work.
            </Analogy>

            <Analogy label="The Faithfulness Problem">
                The model&rsquo;s explanation and its actual reasoning may differ.
                Sometimes a model arrives at the right answer through pattern-matching
                &mdash; statistical intuition built from training &mdash; and then
                generates a plausible-sounding step-by-step explanation afterward.
                The chain of thought is generated text, not a recording of internal
                computation. Researchers at Anthropic tested this by swapping out the
                reasoning with garbage and measuring whether accuracy dropped. For
                smaller models it often didn&rsquo;t &mdash; a sign the model was
                ignoring its own explanation.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Chain-of-Thought as latent variable inference</h2>

            <DefBlock label="Formal Setting">
                Let Q be a question and A the correct answer. In standard few-shot
                prompting, the model assigns probability p(A&nbsp;|&nbsp;Q,&nbsp;context).
                In CoT prompting, an intermediate reasoning chain R is introduced as a
                latent variable. The model generates R autoregressively, then generates
                A conditioned on both Q and R.
            </DefBlock>

            <MathBlock tex="p(A \mid Q, \text{ctx}) = \sum_{R} p(A \mid Q, R, \text{ctx})\; p(R \mid Q, \text{ctx})" />

            <p>
                CoT prompting is an implicit marginalization over reasoning chains.
                Rather than summing over all possible R (intractable), the model uses
                greedy or beam-search decoding to find a single high-probability chain
                R&nbsp;*, then conditions on it:
            </p>

            <MathBlock tex="R^* = \arg\max_R\; p(R \mid Q, \text{ctx}), \qquad \hat{A} = \arg\max_A\; p(A \mid Q, R^*, \text{ctx})" />

            <p>
                The few-shot CoT examples in the context shift the prior
                p(R&nbsp;|&nbsp;Q,&nbsp;ctx) toward chains that are step-by-step and
                methodical, steering generation away from the single-step &ldquo;direct
                answer&rdquo; pattern that (Q,&nbsp;A) examples would reinforce.
            </p>

            <h3>When Does CoT Help? The Per-Step Accuracy Condition</h3>
            <p>
                Let k be the number of reasoning steps required to solve the problem.
                Let &epsilon; be the probability that a single step is executed
                incorrectly by the model. Assuming steps are approximately independent,
                the probability that the entire chain is correct is:
            </p>

            <MathBlock tex="\Pr[\text{chain correct}] \approx (1 - \varepsilon)^k" />

            <p>
                For CoT to be beneficial over direct answering, the chain-guided accuracy
                must exceed the direct-answer accuracy p&nbsp;_direct. Denote by
                p&nbsp;_step&nbsp;=&nbsp;1&nbsp;&minus;&nbsp;&epsilon; the per-step
                accuracy. CoT is beneficial when:
            </p>

            <MathBlock tex="(1 - \varepsilon)^k > p_{\text{direct}} \implies \varepsilon < 1 - p_{\text{direct}}^{1/k}" />

            <p>
                For a 6-step problem with p&nbsp;_direct&nbsp;=&nbsp;0.18 (GPT-3
                baseline on GSM8K): CoT is beneficial when
                &epsilon;&nbsp;&lt;&nbsp;1&nbsp;&minus;&nbsp;0.18&rsquo;&nbsp;&asymp;&nbsp;0.29.
                A model achieving 71%+ per-step accuracy benefits from CoT; a model
                with 80% per-step error rate does not. This explains why CoT benefits
                only emerge above ~100B parameters: smaller models have
                &epsilon;&nbsp;&gt;&nbsp;threshold for typical multi-step tasks.
            </p>

            <h3>Zero-Shot CoT: Two-Stage Generation</h3>
            <MathBlock tex="\hat{R} \sim p(\,\cdot \mid Q,\; \text{``Let's think step by step''})" />
            <MathBlock tex="\hat{A} \sim p(\,\cdot \mid Q,\; \hat{R},\; \text{``Therefore, the answer is:''})" />

            <p>
                The two-stage formulation is important: without the extraction prompt in
                stage&nbsp;2, the model may generate additional reasoning rather than
                committing to an answer. The phrase &ldquo;Therefore, the answer is:&rdquo;
                steers the distribution toward a terminal answer token rather than a
                continuation token.
            </p>

            <h3>Faithfulness as Causal Effect</h3>
            <p>
                Define the faithfulness metric F as the normalized causal effect of the
                chain C on accuracy. Let acc(C) be accuracy when using the generated
                chain, and acc(C&rsquo;) be accuracy when C is replaced by a perturbed
                chain C&rsquo; (reasoning content swapped out while format is preserved):
            </p>

            <MathBlock tex="\mathcal{F} = 1 - \frac{\operatorname{acc}(C')}{\operatorname{acc}(C)}" />

            <p>
                F&nbsp;=&nbsp;0: chain is completely decorative (acc is unchanged by
                perturbation). F&nbsp;=&nbsp;1: chain is fully causally responsible for
                correct answers (all accuracy is lost when chain is perturbed).
                Lanham et al.&rsquo;s findings: larger models have higher F (their
                chains are more causally connected). Mathematical tasks have higher F
                than commonsense tasks. F increases with problem difficulty, suggesting
                that when problems are easy, models fall back on pattern matching.
            </p>
        </>
    )
}

function PythonContent() {
    return (
        <>
            <p>
                Python implementing few-shot CoT prompt construction for GSM8K-style
                problems; zero-shot CoT with the two-stage extraction method; per-step
                chain accuracy simulation; and the faithfulness metric from Lanham
                et&nbsp;al. (Anthropic, 2023).
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="chain_of_thought.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of chain-of-thought prompting</h2>

            <h3>CoT Few-Shot Format</h3>
            <p>
                Standard few-shot prompting presents k examples as (Q,&nbsp;A) pairs.
                CoT few-shot replaces each pair with a triple (Q,&nbsp;R,&nbsp;A) where
                R is a natural-language reasoning chain:
            </p>

            <MathBlock tex="\text{Standard: } \{(Q_1, A_1),\ldots,(Q_k, A_k),\, Q_{\text{test}}\}" />
            <MathBlock tex="\text{CoT: } \{(Q_1, R_1, A_1),\ldots,(Q_k, R_k, A_k),\, Q_{\text{test}}\}" />

            <p>
                The model generates the reasoning chain R&nbsp;_test for the test
                question autoregressively before generating the final answer A&nbsp;_test.
                The log-probability assigned to the correct answer is conditioned on
                the generated chain:
            </p>

            <MathBlock tex="\log p(A_{\text{test}} \mid Q_{\text{test}}, R_{\text{test}}, \text{ctx}_{\text{CoT}}) \;\geq\; \log p(A_{\text{test}} \mid Q_{\text{test}}, \text{ctx}_{\text{standard}})" />

            <p>
                The inequality holds empirically on multi-step tasks for large models:
                conditioning on a correct intermediate chain increases the probability
                of the correct answer because the answer token is directly predicted
                from a simpler residual given the chain, rather than from the question alone.
            </p>

            <h3>Scale Dependence: Empirical Analysis</h3>
            <p>
                Wei et al.&rsquo;s central empirical finding: the benefit of CoT
                prompting, measured as CoT accuracy minus standard accuracy, is
                essentially zero or negative for models below ~10&rsquo;&#8203; parameters,
                and grows with scale above that threshold. The theoretical explanation
                follows from the per-step accuracy condition. If a single reasoning
                step has error rate &epsilon;, and the problem requires k steps:
            </p>

            <MathBlock tex="\Pr[\text{chain correct}] = (1 - \varepsilon)^k" />

            <p>
                For k&nbsp;=&nbsp;6 (GSM8K average) and a small model with
                &epsilon;&nbsp;=&nbsp;0.35 per step:
            </p>

            <MathBlock tex="(1 - 0.35)^6 = 0.65^6 \approx 0.075" />

            <p>
                A 7.5% chain-correctness rate is worse than direct answering for most
                models. For a large model with &epsilon;&nbsp;=&nbsp;0.06:
            </p>

            <MathBlock tex="(1 - 0.06)^6 = 0.94^6 \approx 0.69" />

            <p>
                A 69% chain-correctness rate substantially exceeds the ~18% direct
                baseline. The 100B parameter threshold reflects the scale at which
                per-step error rate falls below the critical value
                1&nbsp;&minus;&nbsp;p&nbsp;_direct&nbsp;&#8319;&#8317;&#185;&#8260;&#7476;&#8318;
                for typical reasoning tasks.
            </p>

            <h3>Zero-Shot CoT Mechanism</h3>
            <p>
                Without few-shot examples, zero-shot CoT (Kojima et al., 2022) uses
                a two-stage generation process. Stage&nbsp;1 elicits the reasoning
                chain by appending a trigger phrase; Stage&nbsp;2 extracts the final
                answer by appending an extraction prompt:
            </p>

            <MathBlock tex="\text{Stage 1: } p\!\left(\hat{R} \;\Big|\; Q,\; \texttt{``Let's think step by step.''}\right)" />
            <MathBlock tex="\text{Stage 2: } p\!\left(\hat{A} \;\Big|\; Q,\; \hat{R},\; \texttt{``Therefore, the answer is:''}\right)" />

            <p>
                The two-stage design matters: without the stage-2 extraction prompt,
                the model continues generating reasoning rather than committing to a
                terminal answer. The trigger phrase in stage&nbsp;1 shifts the
                generating distribution toward reasoning-style text by priming the
                autoregressive context with a token sequence whose training-data
                continuations are predominantly step-by-step explanations.
            </p>

            <h3>Faithful vs. Unfaithful Reasoning</h3>
            <p>
                The faithfulness test (Lanham et al., Anthropic 2023) measures the
                causal contribution of the chain to the final answer. Define the
                faithfulness metric:
            </p>

            <MathBlock tex="\mathcal{F} = 1 - \frac{\operatorname{acc}(C')}{\operatorname{acc}(C)}" />

            <p>
                where C is the model-generated chain and C&rsquo; is a perturbed chain
                with reasoning content replaced by placeholders or incorrect content.
                F&nbsp;&isin;&nbsp;[0,&nbsp;1]: F&nbsp;=&nbsp;0 means the chain is
                decorative; F&nbsp;=&nbsp;1 means the chain fully accounts for all
                correct answers. Larger models are more faithful; mathematical tasks
                are more faithful than commonsense tasks; harder problems are more
                faithful than easy ones (easy problems are solved by pattern-matching
                before chain generation begins).
            </p>

            <h3>Mathematical Reasoning Benchmarks</h3>
            <p>
                Progress on mathematical reasoning since Wei et al. (2022):
            </p>

            <table className="ch-table">
                <thead>
                    <tr>
                        <th>Model / Method</th>
                        <th>GSM8K</th>
                        <th>MATH</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>GPT-3 175B, standard</td><td>17.9%</td><td>&mdash;</td></tr>
                    <tr><td>GPT-3 175B + CoT</td><td>46.9%</td><td>&mdash;</td></tr>
                    <tr><td>PaLM 540B + CoT</td><td>74.4%</td><td>&mdash;</td></tr>
                    <tr><td>GPT-4</td><td>87.1%</td><td>42.5%</td></tr>
                    <tr><td>Claude 3 Opus</td><td>&mdash;</td><td>60.1%</td></tr>
                    <tr><td>o1-mini</td><td>90.0%</td><td>&mdash;</td></tr>
                    <tr><td>o1 (Oct 2023)</td><td>&mdash;</td><td>83.3%</td></tr>
                </tbody>
            </table>

            <p>
                The gap between GPT-4 (CoT prompting at inference) and o1
                (process-reward training + extended thinking) reflects the difference
                between activating latent reasoning at test time and training the model
                to reason step-by-step as a first-class objective. The expected accuracy
                of a k-step chain, given per-step accuracy 1&nbsp;&minus;&nbsp;&epsilon;,
                provides a lower bound on achievable accuracy:
            </p>

            <MathBlock tex="\mathbb{E}[\text{acc}] \geq (1 - \varepsilon)^k \cdot \Pr[\text{correct answer given correct chain}]" />

            <p>
                Process reward models (Chapter&nbsp;29, topic&nbsp;4) directly optimize
                the per-step accuracy term &epsilon;, reducing it via supervision of
                intermediate steps rather than only the final answer &mdash; which is
                why training-time interventions so dramatically outperform prompting-only
                CoT on competition-level mathematics.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">CoT as latent variable inference &middot; per-step accuracy derivation &middot; faithfulness metric</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Few-shot CoT prompt construction &middot; zero-shot two-stage extraction &middot; faithfulness metric &middot; chain accuracy simulation</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CHAIN_OF_THOUGHT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
