import { Analogy, CodeBlock, DefBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Abilities that appear suddenly</h2>
            <p>
                For decades, AI capabilities improved gradually. A model that could solve 30% of
                grade-school math problems might, with more training, solve 35%. But starting
                around 2022, researchers noticed something strange: certain abilities seemed to
                appear out of nowhere. A model would fail a task completely at one scale, then
                suddenly succeed at a slightly larger scale. Jason Wei and colleagues at Google
                named this phenomenon <em>emergent abilities</em> and showed that it was
                widespread across benchmarks.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2021</div>
                    <div className="ch-tl-section-label">Precursors</div>
                    <div className="ch-tl-title">GPT-3 exhibits few-shot learning</div>
                    <div className="ch-tl-body">
                        GPT-3 (175B) could perform tasks it was never explicitly trained on, simply
                        by reading a few examples in the prompt. Smaller models could not do this.
                        However, few-shot learning was still a gradual improvement: performance
                        scaled smoothly with model size, even if the absolute capability felt
                        "magical" compared to earlier systems.
                    </div>
                    <div className="ch-tl-impact">Impact: First hint that scale unlocks qualitatively new behaviors</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Definition</div>
                    <div className="ch-tl-title">Wei et al. — Emergent Abilities of Large Language Models</div>
                    <div className="ch-tl-body">
                        Wei and colleagues systematically evaluated models from 70M to 540B
                        parameters on dozens of benchmarks. They defined an emergent ability as
                        one that is <em>not present</em> in small models but <em>is present</em> in
                        large models — specifically, where performance rises sharply above random
                        chance only after a critical scale threshold. Examples include multi-step
                        arithmetic, word unscrambling, and answering questions in low-resource
                        languages.
                    </div>
                    <div className="ch-tl-impact">Impact: Framed scaling as a path to unpredictable new capabilities</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – 2023</div>
                    <div className="ch-tl-section-label">Debate</div>
                    <div className="ch-tl-title">Schaeffer et al. — Are Emergent Abilities a Mirage?</div>
                    <div className="ch-tl-body">
                        Schaeffer and colleagues at Stanford argued that emergence is largely an
                        artifact of <em>discontinuous metrics</em>. If you measure accuracy (which
                        jumps from 0% to 100% in discrete steps), abilities look emergent. But if
                        you measure token-level cross-entropy or Brier score, the underlying
                        improvement is smooth. They showed that emergence disappears when using
                        continuous metrics, suggesting it is a measurement illusion rather than a
                        deep property of scaling.
                    </div>
                    <div className="ch-tl-impact">Impact: Sparked a major debate about the nature of AI progress</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023 – Present</div>
                    <div className="ch-tl-section-label">Synthesis</div>
                    <div className="ch-tl-title">Chain-of-Thought and structured reasoning</div>
                    <div className="ch-tl-body">
                        Regardless of the metric debate, one form of emergence is hard to dispute:
                        large models can use <em>chain-of-thought prompting</em> to decompose
                        complex problems into steps, while small models cannot. This is not just
                        a metric artifact — it is a qualitative shift in problem-solving strategy
                        that appears only above a certain scale. Similar thresholds exist for
                        tool use, multi-turn planning, and in-context learning of novel algorithms.
                    </div>
                    <div className="ch-tl-impact">Impact: Led to specialized reasoning models (o1, o3, DeepSeek-R1)</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Whether or not emergence is "real" depends on
                your metric. Under the hood, model behavior changes smoothly. But from a user's
                perspective — measured by task accuracy — the difference between "cannot solve"
                and "can solve" is binary. The practical implication is the same: scale can
                unlock capabilities that are invisible in smaller models.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>When the light bulb turns on</h2>

            <Analogy label="Learning to Ride a Bike">
                Imagine you are helping a child learn to ride a bike. For weeks, they wobble and
                fall. Then one day, something clicks — they pedal three whole blocks without
                falling. They did not get gradually better; they went from "cannot" to "can" in
                what felt like a single afternoon. Of course, their muscles were strengthening
                the whole time, but the <em>ability</em> appeared suddenly.
            </Analogy>

            <Analogy label="The Jigsaw Puzzle">
                Now imagine a jigsaw puzzle with 1000 pieces. With only 10 pieces, you cannot see
                the picture at all. With 100 pieces, you start to guess — maybe it is a beach?
                With 500 pieces, you suddenly <em>know</em> it is a sunset over the ocean. The
                picture did not gradually become clearer; your <em>certainty</em> jumped. AI
                models work similarly: below a certain size, they are just guessing. Above it,
                they suddenly "see" the pattern.
            </Analogy>

            <Analogy label="The Debate">
                Some scientists say: "The puzzle pieces were always adding up smoothly. You just
                did not notice because you were only looking for the final picture." Others say:
                "But from the outside, the jump is what matters. A self-driving car that is 99%
                safe is very different from one that is 100% safe." Both sides are right — it
                depends on whether you care about the inside or the outside.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Sharp transitions in capability space</h2>

            <h3>What does "emergent" mean?</h3>
            <p>
                In physics and biology, <em>emergence</em> refers to properties of a system that
                are not present in its individual parts. Wetness emerges from water molecules;
                consciousness (maybe) emerges from neurons. In AI, an emergent ability is a task
                that a model cannot perform at all below a certain size, but performs well above
                it.
            </p>

            <h3>Examples of emergent abilities</h3>
            <ul>
                <li>
                    <strong>Multi-digit arithmetic:</strong> Small models fail; large models
                    (GPT-3 175B+) succeed when given chain-of-thought prompts
                </li>
                <li>
                    <strong>Word unscrambling:</strong> Rearranging scrambled letters to form
                    valid words
                </li>
                <li>
                    <strong>Code generation from natural language:</strong> Writing functions
                    that compile and run correctly
                </li>
                <li>
                    <strong>Theory of mind:</strong> Inferring beliefs and intentions of
                    characters in stories (evaluated on false-belief tasks)
                </li>
                <li>
                    <strong>In-context learning of algorithms:</strong> Learning to sort a list
                    or reverse a string from a few examples in the prompt
                </li>
            </ul>

            <h3>The metric controversy</h3>
            <p>
                Schaeffer et al. showed that if you use a continuous metric (like token-level
                perplexity), the improvement is smooth across all scales. Emergence only appears
                when you use a <em>discrete</em> metric (like exact-match accuracy) because the
                metric itself has a threshold. A model that improves from 45% to 55% accuracy
                looks the same as one that improves from 0% to 10% — both are "gradual" in the
                continuous space but "sudden" in the binary space.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Practical implication:</strong> Even if emergence is partially a metric
                artifact, the thresholds are real and important. A model that scores 49% on a
                medical licensing exam is useless; one that scores 51% is transformative. The
                steepness of the curve near the threshold means that small improvements in scale
                can have outsized real-world impact.
            </div>


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

function MathsContent() {
    return (
        <>
            <h2>Formal definitions and the metric-dependence argument</h2>

            <DefBlock label="Emergent Ability — Wei et al. Definition">
                An ability is emergent if it is not present in small models but is present in
                large models. Formally, let f(N) be the performance of a model with N parameters
                on a task T. Then T is emergent if there exists a threshold N* such that f(N) ≈
                random_chance for N &lt; N* and f(N) &gt;&gt; random_chance for N ≥ N*.
            </DefBlock>

            <h3>Why metrics matter</h3>
            <p>
                Let p be the model's probability of generating the correct token sequence for a
                task. Under a continuous metric like negative log-likelihood, performance is
                L = −log(p), which varies smoothly with p. Under a discrete metric like exact
                accuracy, performance is:
            </p>
            <p>
                accuracy = 1 if p &gt; threshold, else 0
            </p>
            <p>
                This creates a step function. If p(N) increases smoothly from 0.01 to 0.99 as N
                grows, the accuracy metric will show a sharp jump at the threshold — even though
                the underlying model improved smoothly.
            </p>

            <h3>Schaeffer's argument</h3>
            <p>
                Schaeffer et al. proved that for <em>any</em> smooth family of models and
                <em>any</em> task, you can construct a metric that makes the task look emergent.
                Conversely, for any apparently emergent task, you can construct a metric that
                makes it look gradual. Therefore, emergence is not an intrinsic property of the
                model family; it is a property of the (model family, task, metric) triple.
            </p>

            <h3>But some emergence is structural</h3>
            <p>
                Even if accuracy emergence is artifactual, there are structural forms of emergence
                that are harder to dismiss:
            </p>
            <ul>
                <li>
                    <strong>Phase transitions in optimization:</strong> Gradient descent on
                    certain loss landscapes exhibits bifurcations where the solution manifold
                    changes topology at a critical parameter count.
                </li>
                <li>
                    <strong>Compositional reasoning:</strong> A model must first learn constituent
                    skills (arithmetic, logic, syntax) before it can compose them. The composition
                    operator may only become reliable above a scale where each constituent is
                    individually mastered.
                </li>
                <li>
                    <strong>In-context learning:</strong> The ability to learn from examples in
                    the prompt requires the model to implement an implicit learning algorithm.
                    This may require a minimum circuit complexity that is only achievable above a
                    certain size.
                </li>
            </ul>

            <div className="ch-callout">
                <strong>Open problem:</strong> Can we predict <em>which</em> abilities will emerge
                and at what scale? Current theory cannot. If we could, it would transform AI
                safety (we could foresee dangerous capabilities) and AI economics (we could plan
                training budgets with certainty).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Emergence Simulation — NumPy ──────────────────────────────────────────────

# Simulate smooth underlying skill p(N) and show how different metrics behave

def smooth_skill(N, N_star=1e10, steepness=2.0):
    """Sigmoid-like smooth skill curve."""
    return 1 / (1 + np.exp(-steepness * (np.log(N / N_star))))

def exact_match_accuracy(p, threshold=0.5):
    """Binary metric: 1 if p > threshold, else 0."""
    return (p > threshold).astype(float)

def brier_score(p):
    """Continuous metric: (1-p)^2."""
    return (1 - p) ** 2

def token_perplexity(p):
    """Cross-entropy proxy."""
    return -np.log(np.clip(p, 1e-10, 1.0))


# ── Demo ──────────────────────────────────────────────────────────────────────
Ns = np.logspace(8, 12, 100)       # 100M to 10T parameters
p = smooth_skill(Ns, N_star=5e10, steepness=3.0)

print("Emergence Simulation")
print("=" * 40)
print(f"{'Params':>12} {'p':>8} {'Accuracy':>10} {'Brier':>10} {'Perplex':>10}")
print("-" * 55)

for i in [20, 40, 60, 80, 99]:
    n = Ns[i]
    acc = exact_match_accuracy(p[i])
    bri = brier_score(p[i])
    perp = token_perplexity(p[i])
    print(f"{n:>12.2e} {p[i]:>8.3f} {acc:>10.1f} {bri:>10.4f} {perp:>10.3f}")

# Show that accuracy "emerges" around the threshold
threshold_idx = np.argmin(np.abs(p - 0.5))
print(f"\\nAccuracy 'emerges' near {Ns[threshold_idx]:.2e} parameters")
print(f"But underlying skill p(N) is perfectly smooth!")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy simulation showing how a smooth underlying skill curve produces
                "emergent" behavior under discrete metrics (accuracy) but smooth behavior
                under continuous metrics (Brier score, perplexity).
            </p>
            <CodeBlock code={PY_CODE} filename="emergence_demo.py" lang="python" langLabel="Python" />
        </>
    )
}



// ── Tab content map ───────────────────────────────────────────────────────────

export const EMERGENT_ABILITIES_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
