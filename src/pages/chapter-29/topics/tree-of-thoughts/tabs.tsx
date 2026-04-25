import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From linear chains to deliberate tree search</h2>
            <p>
                Chain-of-thought prompting exposed a fundamental limitation: a language model that
                commits to a reasoning path has no mechanism to backtrack. Tree of Thoughts reframes
                problem solving as a search process — the model explores a tree of intermediate
                steps, evaluating each branch and pruning dead ends before they waste computation.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">CoT&apos;s linear structure</div>
                    <div className="ch-tl-body">
                        Chain-of-thought produces a single linear sequence t&#x2081; &#x2192; t&#x2082; &#x2192; &#x2026; &#x2192;
                        answer. If the model makes a wrong turn at step 3, it continues down a
                        wrong path without any mechanism to backtrack. This is fundamentally a
                        greedy, left-to-right search — ill-suited for tasks where early decisions
                        have large downstream effects. Self-consistency mitigated this by sampling
                        many chains and voting, but each chain remained linear and the model had
                        no internal evaluation signal to guide exploration.
                    </div>
                    <div className="ch-tl-impact">Impact: Identified the structural limitation that ToT would solve</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2023</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Tree of Thoughts — Yao et al. (Princeton / Google)</div>
                    <div className="ch-tl-body">
                        "Tree of Thoughts: Deliberate Problem Solving with Large Language Models."
                        The framework represents problem solving as a tree where nodes are
                        &quot;thoughts&quot; — coherent language sequences constituting an intermediate
                        reasoning step — and edges are transitions between thoughts. The LLM plays
                        two roles: (a) thought generator, proposing k candidate next steps given
                        the current state; (b) evaluator, scoring each state as sure / likely /
                        impossible. A search algorithm — BFS, DFS, or beam search — selects which
                        branches to expand. This gives the model a global view of the problem.
                    </div>
                    <div className="ch-tl-impact">Impact: Introduced principled tree search into language model inference</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Benchmark</div>
                    <div className="ch-tl-title">Game of 24 — 74% vs. 4%</div>
                    <div className="ch-tl-body">
                        The Game of 24 requires combining four numbers (e.g., 4, 9, 10, 13) with
                        arithmetic operators to reach exactly 24. The task demands systematic
                        exploration — which numbers to combine first and which operator to use
                        first both matter. Results: CoT (greedy) 4% success; CoT with
                        self-consistency (5 samples) 9%; Tree of Thoughts with BFS (branching
                        factor b = 5) 74%. ToT succeeds by exploring multiple combination orders
                        and pruning branches where the partial result cannot reach 24.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated a 17&#xd7; improvement over CoT on a planning-heavy task</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">Creative writing with constraints</div>
                    <div className="ch-tl-body">
                        Constrained writing tasks require producing a coherent passage that ends
                        with specific words. ToT with DFS explores multiple opening-sentence
                        candidates, evaluates their coherence and likelihood of satisfying the
                        ending constraints, and backtracks from branches where those constraints
                        appear unreachable. Human evaluators preferred ToT outputs over CoT
                        outputs on coherence and constraint satisfaction — a domain where
                        backtracking provides a qualitative advantage.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed ToT&apos;s benefits extend beyond arithmetic to open-ended generation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">Mini-crossword — constraint propagation via backtracking</div>
                    <div className="ch-tl-body">
                        Fill a 5&#xd7;5 crossword given across and down clue words. CoT attempts words
                        linearly and cannot correct earlier placements that violate crossing
                        constraints. ToT explores word candidates for each slot, checks consistency
                        with crossing letters, and backtracks on violations — a classic
                        constraint-satisfaction approach. Result: ToT solved 20% of crosswords vs.
                        16% for CoT, a substantial relative gain given the task&apos;s difficulty.
                    </div>
                    <div className="ch-tl-impact">Impact: Connected tree search to classical constraint satisfaction</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Reasoning via Planning — MCTS (Hao et al.)</div>
                    <div className="ch-tl-body">
                        "Reasoning via Planning" (RAP) combined ToT&apos;s thought-tree framework with
                        Monte Carlo Tree Search: the LLM acts as a world model simulating future
                        states, and value estimates are computed via rollouts. Node selection uses
                        the UCB1 formula to balance exploration and exploitation. RAP outperforms
                        greedy ToT on harder planning tasks but requires 5&#x2013;10&#xd7; more LLM calls,
                        illustrating the accuracy-cost tradeoff in tree-based reasoning.
                    </div>
                    <div className="ch-tl-impact">Impact: Unified ToT with MCTS for principled planning under uncertainty</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Industry</div>
                    <div className="ch-tl-title">o1 and AlphaCode 2 — internal tree search at scale</div>
                    <div className="ch-tl-body">
                        OpenAI&apos;s o1 model (released September 2024) appears to implement a form of
                        internal tree search during inference — exploring multiple reasoning paths,
                        evaluating intermediate states, and selecting the most promising
                        continuation before producing its visible answer. This &quot;thinking&quot; is
                        invisible to users but reflected in extended generation time. AlphaCode 2
                        uses MCTS over code generation decisions to dramatically improve
                        competitive programming performance. Both systems validate the core ToT
                        insight at production scale.
                    </div>
                    <div className="ch-tl-impact">Impact: Tree search became a core inference strategy in frontier models</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The key inversion:</strong> CoT makes the LLM a passive transcriber of
                reasoning steps. Tree of Thoughts makes it an active agent that proposes, evaluates,
                and selects among alternatives — mimicking the deliberate, exploratory reasoning
                humans use for hard problems. The cost is more LLM calls; the benefit is access to
                solution spaces that greedy generation cannot reach.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Thinking ahead instead of guessing and hoping</h2>

            <Analogy label="Chess Player vs. Chain of Thought">
                A chess player doesn&apos;t move their first idea. They think ahead: &quot;If I move here,
                then they can go there, then I can go there...&quot; — exploring a whole tree of
                possibilities before committing to anything. Chain-of-thought is the player who
                always plays their first idea. Tree of Thoughts is the player who explores multiple
                moves, imagines what might happen next, and only then makes a choice.
            </Analogy>

            <Analogy label="The Maze with Dead Ends">
                Chain-of-thought is like walking a maze without being able to backtrack. If you
                hit a dead end, you&apos;re stuck — you have to start over from scratch. Tree of
                Thoughts lets you backtrack: try the left corridor, hit a wall, go back to the
                fork, try the right corridor. The model remembers where it came from and can
                undo a bad decision before it gets too costly.
            </Analogy>

            <Analogy label="The Judge and the Explorer">
                Tree of Thoughts has the model play two different roles at once. The Explorer
                says: &quot;Here are three ways I could continue from here — option A, option B, option C.&quot;
                Then the Judge says: &quot;Option A looks promising, option B leads nowhere useful,
                option C is too risky.&quot; The Judge stops the Explorer from wasting time on bad
                paths. Chain-of-thought has no Judge — only an Explorer who commits to the very
                first idea.
            </Analogy>

            <Analogy label="Game of 24: Why You Need to Explore">
                You have the numbers 4, 9, 10, 13 and must combine them with +, &#x2212;, &#xd7;, &#xf7;
                to make exactly 24. Try 13 &#x2212; 9 = 4, then 4 &#xd7; 4 = 16 &#x2026; nope. Try 10 &#x2212; 9 = 1,
                then 1 &#xd7; 4 = 4, then 4 &#xd7; 13 = 52 &#x2026; nope. Try 13 &#x2212; 4 = 9, then 9 + 10 + 9 &#x2026;
                wait, you can&apos;t reuse 9. Chain-of-thought picks one order and gets stuck. Tree of
                Thoughts explores all starting combinations, keeps the ones that look promising,
                and discards the ones that obviously can&apos;t work.
            </Analogy>

            <Analogy label="How Many Branches?">
                BFS with branching factor b = 5 explores 5 thoughts at each step. After 3 steps
                that&apos;s up to 5&#xb3; = 125 possible paths being considered. Too many branches and
                the search becomes expensive — the model has to evaluate hundreds of states. Too
                few branches and you miss the solution. The branching factor is a dial that
                trades accuracy for cost: turn it up to solve harder problems, turn it down to
                save money.
            </Analogy>

            <Analogy label="o1: The AI That Thinks Before Answering">
                OpenAI&apos;s o1 model appears to run an internal tree search before giving you an
                answer. You can see it &quot;thinking&quot; for longer than usual — that extra time is the
                model exploring many reasoning paths, evaluating which one is most likely to be
                correct, and selecting the best continuation before it shows you anything. This
                internal tree search is why o1 is dramatically better at hard math and coding
                problems: it&apos;s exploring the solution space rather than greedily writing down
                the first thing that comes to mind.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Tree search as an inference-time algorithm</h2>

            <h3>ToT Framework Formalization</h3>
            <p>
                The problem-solving state after k steps is the tuple s = (problem, t&#x2081;, &#x2026;, t&#x2096;),
                where each t&#x1d62; is a coherent intermediate thought. Three components must be
                specified for each task:
            </p>
            <ul>
                <li><strong>Thought granularity:</strong> what constitutes one thought — a single equation, a sentence, a candidate word.</li>
                <li>
                    <strong>Thought generator G(&#x3b8;, s, k):</strong> produces k candidate next thoughts from the current
                    state. Either independent samples or a single proposal listing k alternatives.
                </li>
                <li>
                    <strong>Evaluator V(&#x3b8;, S):</strong> scores each state in a set S. Either a value prompt
                    (&quot;rate this path: sure / likely / impossible&quot;) or a vote across k independent
                    evaluations.
                </li>
            </ul>
            <p>
                The search algorithm then decides which states to expand. The generation distribution
                for independent samples is:
            </p>
            <MathBlock tex="t^{(i)} \sim p_\theta\!\left(t \mid s\right), \quad i = 1, \ldots, k" />

            <h3>Thought Generator Strategies</h3>
            <p>
                Independent sampling draws k thoughts from p&#x3b8;(t | s) separately. Each sample is
                unconditioned on the others, maximising diversity but missing sequential
                dependencies between candidates. The proposal strategy generates all k alternatives
                in one pass:
            </p>
            <MathBlock tex="\{t_1, \ldots, t_k\} \sim p_\theta\!\left(t_1, \ldots, t_k \mid s,\, \text{``list } k \text{ next steps''}\right)" />
            <p>
                Independent sampling is more reliable for tasks where each candidate thought must
                be self-consistent. Proposals are cheaper in API calls but the model may repeat
                similar candidates. The choice of strategy affects both diversity and cost.
            </p>

            <h3>Evaluator — Value and Vote</h3>
            <p>
                The value evaluator prompts the model to rate the current state as{" "}
                <em>sure</em> (1.0), <em>likely</em> (0.5), or <em>impossible</em> (0.0). The
                vote evaluator samples k independent evaluations and aggregates them:
            </p>
            <MathBlock tex="V(s) = \frac{1}{k} \sum_{i=1}^{k} \mathbf{1}\!\left[E^{(i)}(s) = \text{``best''}\right]" />
            <p>
                Empirical calibration matters: LLMs are overconfident — paths rated &quot;likely&quot;
                succeed only ~40% of the time. Calibrated vote scores can be weighted by
                empirical precision to reduce this bias. The evaluator acts as the pruning signal
                that prevents exponential blowup.
            </p>

            <h3>BFS vs. DFS vs. Beam Search</h3>
            <p>
                Three search strategies differ in how they allocate the evaluation budget:
            </p>
            <ul>
                <li>
                    <strong>BFS:</strong> expand all states at depth d, select the top-b by value,
                    expand to d + 1. Complete — finds a solution if one exists within depth D.
                    Memory cost grows as O(b<sup>D</sup>).
                </li>
                <li>
                    <strong>DFS:</strong> commit to the highest-value child, backtrack on failure
                    (value below a threshold). Incomplete — may miss solutions far from the greedy
                    path. Per-path cost is O(D &#xd7; k).
                </li>
                <li>
                    <strong>Beam search:</strong> keep the top-b candidates at each depth and
                    expand all simultaneously. A middle ground between BFS completeness and DFS
                    efficiency.
                </li>
            </ul>
            <p>BFS memory requirement for branching factor b at depth D:</p>
            <MathBlock tex="\text{States}(b, D) = \sum_{d=0}^{D} b^d = \frac{b^{D+1} - 1}{b - 1} = O(b^D)" />

            <h3>MCTS for Reasoning — RAP</h3>
            <p>
                Hao et al.&apos;s Reasoning via Planning uses the LLM as a world model
                p&#x3b8;(s&#x2019; | s, a) and reward model r(s, a). MCTS alternates four phases — select,
                expand, simulate, backpropagate — with node selection by UCB1:
            </p>
            <MathBlock tex="\text{UCB}_1(s) = Q(s) + c \cdot \sqrt{\frac{\ln N(\text{parent})}{N(s)}}" />
            <p>
                where Q(s) is the average rollout reward from s, N(s) is its visit count, and c
                controls exploration vs. exploitation. High-Q states are exploited; rarely visited
                states are explored. This is more principled than BFS / DFS but requires 5&#x2013;10&#xd7;
                more LLM calls per problem — each rollout is a full generation pass.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Design choice:</strong> every component of ToT — thought granularity,
                generator strategy, evaluator type, and search algorithm — is task-specific and
                must be manually specified. This is both the framework&apos;s strength (it is fully
                general) and its weakness (it requires significant prompt engineering effort per
                problem domain).
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#x25b6;</span>
                    <span className="ch-expandable-label">Deep Dive &#x2014; Mathematics</span>
                    <span className="ch-expandable-desc">BFS memory vs. DFS time &#xb7; MCTS convergence</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#x25b6;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Python &#xb7; Game of 24 &#xb7; BFS tree search</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths deep-dive ───────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>BFS memory, DFS time, and MCTS value convergence</h2>

            <DefBlock label="BFS memory vs. DFS time complexity">
                BFS must hold all frontier nodes in memory simultaneously. At depth D with
                branching factor b the frontier has b<sup>D</sup> nodes, each storing a full
                thought sequence of length O(D):
            </DefBlock>
            <MathBlock tex="\text{Memory}_{\text{BFS}} = O(b^D \cdot D)" />
            <p>
                DFS holds only the current path and a stack of unexplored siblings. At each depth
                level it keeps at most k &#x2212; 1 unexplored siblings, so stack depth is O(D) and
                memory is linear:
            </p>
            <MathBlock tex="\text{Memory}_{\text{DFS}} = O(D \cdot k)" />
            <p>
                DFS time cost per path is O(D &#xd7; k) evaluations. In the worst case DFS explores
                all b<sup>D</sup> leaves (full backtracking), matching BFS. In practice backtracking
                is triggered early by the evaluator, making DFS far cheaper on average while BFS
                guarantees finding the shallowest solution.
            </p>

            <h3>Beam search as the practical middle ground</h3>
            <p>
                Beam search of width b expands the top-b states at each depth simultaneously,
                pruning all others. Memory is O(b &#xd7; D) — far better than full BFS. The cost
                is incompleteness: if the optimal path has a low intermediate value score it is
                pruned and never recovered. The beam width b is the key hyperparameter:
            </p>
            <MathBlock tex="\text{LLM calls}_{\text{beam}} = D \cdot b \cdot k" />
            <p>
                where k is the number of thoughts generated per expansion. For Game of 24 with
                D = 4 steps, b = 5, k = 5 this yields 100 LLM calls — a fixed, predictable budget.
            </p>

            <h3>MCTS value convergence under the LLM world model</h3>
            <p>
                Under MCTS, the Q-value estimate for state s converges as visit count N(s) grows.
                By the law of large numbers over rollouts:
            </p>
            <MathBlock tex="Q(s) = \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_i(s) \xrightarrow{N \to \infty} \mathbb{E}[G \mid s]" />
            <p>
                where G&#x1d62;(s) is the rollout return from state s on the i-th visit. The UCB1
                bonus shrinks as N(s) grows, steering the algorithm toward exploitation once a
                state is sufficiently characterised:
            </p>
            <MathBlock tex="\text{UCB}_1(s) = Q(s) + c\sqrt{\frac{\ln N_{\text{parent}}}{N(s)}} \;\xrightarrow{N(s)\to\infty}\; Q(s)" />
            <p>
                The convergence guarantee assumes the world model p&#x3b8;(s&#x2019; | s, a) is faithful.
                When the LLM world model is inaccurate — as is common for long-horizon tasks —
                the estimated Q values may be systematically biased, and MCTS may explore high-value
                but unreachable states. This is the core risk of using an LLM as its own evaluator.
            </p>

            <div className="ch-callout">
                <strong>Practical implication:</strong> BFS is preferred when the solution is
                shallow (D small) and the budget allows exponential node expansion. DFS is
                preferred when solutions are deep and the evaluator reliably prunes bad branches
                early. MCTS is preferred when per-step simulation quality is high and exploration
                of diverse paths is more valuable than exhaustive coverage.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `from itertools import permutations, product
from fractions import Fraction

# ── Thought generator: enumerate arithmetic combinations ──────────────────────
def generate_thoughts(numbers: list[Fraction]) -> list[tuple[Fraction, list[Fraction]]]:
    """
    Given a list of remaining numbers, return all possible results of applying
    one binary operation to any two of them, paired with the remaining numbers.
    """
    thoughts = []
    ops = [
        (lambda a, b: a + b, "+"),
        (lambda a, b: a - b, "-"),
        (lambda a, b: b - a, "-"),   # reversed subtraction
        (lambda a, b: a * b, "*"),
        (lambda a, b: a / b if b != 0 else None, "/"),
        (lambda a, b: b / a if a != 0 else None, "/"),
    ]
    n = len(numbers)
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            a, b = numbers[i], numbers[j]
            remaining = [numbers[k] for k in range(n) if k != i and k != j]
            for fn, _ in ops:
                result = fn(a, b)
                if result is not None:
                    thoughts.append((result, remaining))
    return thoughts

# ── Evaluator: is it possible to reach 24 from this state? ────────────────────
def evaluate(numbers: list[Fraction], target: Fraction = Fraction(24)) -> bool:
    """
    Returns True if target is reachable from numbers using any combination of
    binary arithmetic operations. Uses exhaustive search (brute-force oracle).
    """
    if len(numbers) == 1:
        return numbers[0] == target
    for result, remaining in generate_thoughts(numbers):
        if evaluate([result] + remaining, target):
            return True
    return False

# ── BFS Tree of Thoughts for Game of 24 ──────────────────────────────────────
def tree_of_thoughts_bfs(start: list[int], target: int = 24, beam_width: int = 5) -> bool:
    """
    BFS over thought states, pruning states where 24 is unreachable.
    Each state is a list of remaining Fractions.
    """
    TARGET = Fraction(target)
    # Initial state: all four numbers as Fractions
    frontier = [[Fraction(n) for n in start]]

    while frontier:
        next_frontier = []
        for state in frontier:
            if len(state) == 1:
                if state[0] == TARGET:
                    return True
                continue
            for result, remaining in generate_thoughts(state):
                new_state = [result] + remaining
                # Evaluator: prune if target is definitely unreachable
                if evaluate(new_state, TARGET):
                    next_frontier.append(new_state)
        # Beam: keep at most beam_width states (BFS without beam = full expansion)
        frontier = next_frontier[:beam_width]

    return False

# ── Demo ──────────────────────────────────────────────────────────────────────
test_cases = [
    ([4, 9, 10, 13], True),   # 13 - 9 = 4; 4 * 4 * ... wait: (13-9)*(10-4)=24
    ([1, 1, 1, 1],  False),   # impossible
    ([3, 3, 8, 8],  True),    # 8 / (3 - 8/3) = 24
]

for nums, expected in test_cases:
    result = tree_of_thoughts_bfs(nums, beam_width=10)
    status = "PASS" if result == expected else "FAIL"
    print(f"[{status}] {nums}: solvable={result} (expected={expected})")
`

function PythonContent() {
    return (
        <>
            <p>
                A miniature Tree of Thoughts for the Game of 24. The thought generator enumerates
                all valid binary arithmetic operations on the remaining numbers. The evaluator
                checks via exhaustive search whether the target 24 is reachable from the current
                state — acting as the pruning oracle that prevents BFS from expanding hopeless
                branches. Beam width controls the search budget.
            </p>
            <CodeBlock code={PY_CODE} filename="tree_of_thoughts_game24.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const TREE_OF_THOUGHTS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
