import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>When capabilities appear out of nowhere</h2>
            <p className="ch-story-intro">
                Chapter 23&rsquo;s LoRA and PEFT methods made adapting large models economically
                viable &mdash; but they assumed the base model already had the capabilities needed
                for the target task. Chapter 24 asks: what capabilities does a model actually have,
                and when do they appear? In 2022, two papers from Google and DeepMind fundamentally
                changed how the field thought about these questions.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Early Hints</div>
                    <div className="ch-tl-title">GPT-3 and the First Discontinuities</div>
                    <div className="ch-tl-body">
                        GPT-3&rsquo;s few-shot performance on some benchmarks appeared to jump
                        discontinuously compared to smaller models. But this was not systematically
                        documented &mdash; researchers assumed smooth scaling. The prevailing view was
                        that more parameters simply produced quantitatively better outputs along a
                        predictable curve. Nobody had yet looked carefully at the shape of that curve
                        for individual capabilities rather than for aggregate loss. The absence of a
                        dedicated benchmark for hard reasoning tasks made the phenomenon invisible.
                    </div>
                    <div className="ch-tl-impact">Impact: Hinted at discontinuity without yet documenting it systematically</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">The Benchmark</div>
                    <div className="ch-tl-title">BIG-Bench: 204 Tasks, 400+ Researchers</div>
                    <div className="ch-tl-body">
                        The Beyond the Imitation Game Benchmark (BIG-Bench) was a collaboration of
                        more than 400 researchers who designed 204 tasks covering arithmetic, logic,
                        language translation, social reasoning, code generation, and more. The design
                        philosophy was explicit: include tasks where small models perform at chance,
                        so that any improvement from scale would be visible as a clean break from
                        random performance. Many tasks showed exactly this &mdash; flat near-random
                        performance on small models, then sudden jumps to well-above-chance accuracy
                        as model scale crossed certain thresholds. BIG-Bench was the dataset that made
                        emergence visible to the research community.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided the benchmark dataset that revealed emergence as a systematic phenomenon</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Core Paper</div>
                    <div className="ch-tl-title">Wei et al. (Google Brain) &mdash; Emergent Abilities of Large Language Models</div>
                    <div className="ch-tl-body">
                        The central Google Brain paper documented 8 tasks where performance jumped
                        discontinuously: multi-step arithmetic (multi-digit addition and subtraction),
                        word unscrambling, IPA transcription, Persian question answering, and
                        chain-of-thought reasoning. The jump occurred at roughly 10<sup>22</sup> FLOPs
                        &mdash; corresponding to approximately 100B parameters on standard training
                        data volumes. Below that threshold: random or near-random performance. Above:
                        suddenly functional at well-above-chance accuracy. The paper formally defined
                        &ldquo;emergence&rdquo; as a capability that is not present in smaller models
                        and is not simply a quantitative improvement of something smaller models could
                        already do. It distinguished emergence from smooth scaling: emergence is
                        specifically the appearance of qualitatively new abilities, not the gradual
                        improvement of existing ones.
                    </div>
                    <div className="ch-tl-impact">Impact: Gave emergence a formal definition and documented it across 8 distinct task types</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">The Controversy</div>
                    <div className="ch-tl-title">Schaeffer et al. &mdash; Are Emergent Abilities a Mirage?</div>
                    <div className="ch-tl-body">
                        Schaeffer et al. (published 2023) challenged the emergence narrative
                        directly. Their argument: if you replace discontinuous evaluation metrics
                        like exact-match accuracy with continuous metrics like token-level
                        log-probability, the sudden jumps disappear &mdash; performance improves
                        smoothly throughout training and scaling. The apparent discontinuity is an
                        artifact of the evaluation metric&rsquo;s sensitivity near a threshold, not
                        a property of the model. A model that is 90% of the way to solving a
                        hard arithmetic problem scores zero on exact-match, the same as a model
                        that is 0% of the way there. When the model crosses the threshold to correct
                        answers, it appears as a jump even though continuous-metric performance was
                        rising the whole time. This generated intense debate about whether emergence
                        is a real phenomenon or a measurement artifact.
                    </div>
                    <div className="ch-tl-impact">Impact: Challenged whether emergent jumps reflect model properties or metric sensitivity</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Chain-of-Thought</div>
                    <div className="ch-tl-title">Wei et al. &mdash; Chain-of-Thought as an Emergent Capability</div>
                    <div className="ch-tl-body">
                        A second paper by Wei et al. showed that chain-of-thought prompting &mdash;
                        appending &ldquo;Let&rsquo;s think step by step&rdquo; to a question &mdash;
                        only works above approximately 10<sup>22</sup> FLOPs (around 100B parameters).
                        Below this threshold, adding chain-of-thought prompts actually hurts
                        performance: the model attempts to reason step-by-step but makes errors that
                        cascade, producing worse outputs than direct answering. Above the threshold:
                        chain-of-thought prompting produces large gains of 20&ndash;40 percentage
                        points absolute accuracy on the GSM8K arithmetic benchmark. This made
                        multi-step reasoning itself an emergent capability &mdash; not just a useful
                        prompting trick, but a qualitatively new mode of computation that requires
                        sufficient model scale to function at all.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed reasoning itself is emergent &mdash; CoT hurts small models and helps large ones</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">The Planning Problem</div>
                    <div className="ch-tl-title">Unpredictable Emergence and the Limits of Small-Scale Experiments</div>
                    <div className="ch-tl-body">
                        Perhaps the most practically alarming finding of the emergent abilities
                        literature: emergent capabilities could not be predicted from smaller-scale
                        experiments. A capability absent at 7B parameters would still appear absent
                        at 13B and 30B, then suddenly work at 65B. This made planning expensive
                        training runs genuinely risky &mdash; you could not test whether a
                        capability would emerge at small scale and project it to large scale. The
                        normal engineering practice of prototyping at small scale and extrapolating
                        broke down for emergent abilities. A team deciding whether to invest in a
                        500B-parameter training run had no reliable way to predict whether the
                        capability they needed would be present in the resulting model. Emergence
                        meant the capability map had uncharted territory that only appeared at scale.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that emergence cannot be reliably predicted from small-scale experiments</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022&ndash;2023</div>
                    <div className="ch-tl-section-label">Phase Transitions in Training</div>
                    <div className="ch-tl-title">Power et al. &mdash; Grokking: Generalization Long After Memorization</div>
                    <div className="ch-tl-body">
                        Power et al. (2022) documented a related phenomenon at the training dynamics
                        level: a small transformer trained on modular arithmetic (computing a + b
                        mod 97) would appear to memorize the training examples (near-zero training
                        loss) long before it generalized to held-out examples. Generalization accuracy
                        stayed near zero for thousands of training steps, then suddenly jumped to
                        nearly 100% around step 40,000 &mdash; long after training loss had
                        essentially converged. They called this &ldquo;grokking.&rdquo; The
                        mechanism: the model learns a compressed, generalizing algorithm only after
                        sufficient optimization, even though the memorization-based solution already
                        achieves near-zero training loss. Weight decay (L2 regularization) accelerates
                        grokking by penalizing the high-norm memorization solutions and encouraging
                        the more parsimonious generalizing solution. Grokking showed that emergence
                        can occur in training dynamics, not just across scale.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed phase-transition emergence in training time, not just model scale</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core tension:</strong> Emergent abilities pose a genuine dilemma for
                the field. If they are real &mdash; capabilities that appear discontinuously at
                scale thresholds &mdash; then extrapolating from small models to large ones is
                fundamentally unreliable for capability prediction, making frontier model
                development a game of expensive surprises. If Schaeffer et al. are right and
                emergence is a measurement artifact, then continuous metrics provide a better
                picture &mdash; but practitioners still care about threshold accuracy for deployment,
                so the &ldquo;artifact&rdquo; remains consequential regardless of its ontological
                status. Either way, the emergence debate permanently changed how the field thinks
                about scaling, evaluation, and the relationship between model size and capability.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>When a model suddenly learns to do something it couldn&rsquo;t do before</h2>

            <Analogy label="The Light Switch">
                Some abilities are light switches, not dimmers. A small model (7 billion parameters)
                cannot do multi-step arithmetic &mdash; not badly, but literally cannot. A medium
                model (30 billion) still cannot. Then a large model (65 billion) can suddenly do it
                correctly. Not a little better: OFF, then ON. Nobody knows exactly why the switch
                flips at that scale, or how to predict in advance which scale will flip it.
            </Analogy>

            <Analogy label="The Invisible Stairs">
                If you measure progress on a hard test using &ldquo;did it get full marks?&rdquo;,
                small improvements are invisible. A model that gets 90% of the way to the right
                answer still scores zero. When the model finally crosses the threshold to being
                fully correct, it looks like a sudden leap &mdash; zero to 80% accuracy in one
                model-size jump. But if you could measure partial credit throughout, you&rsquo;d
                see steady improvement the whole time. The big question: is the jump in the model,
                or just in how we&rsquo;re measuring it?
            </Analogy>

            <Analogy label="Chain-of-Thought: A Skill That Requires Being Big Enough">
                Imagine asking a child who doesn&rsquo;t know multiplication to show their work:
                &ldquo;3 &times; 4&hellip; umm&hellip; 3 + 3 + 3 + 3&hellip; I lost track.&rdquo;
                Asking for reasoning makes things worse, not better. Small language models do
                exactly this &mdash; asking them to reason step-by-step makes their answers worse
                because their reasoning contains errors that compound. Big models suddenly flip:
                showing their work makes their answers much better. You have to be big enough for
                reasoning to work at all.
            </Analogy>

            <Analogy label="Grokking: The Delayed Aha Moment">
                Imagine memorizing a multiplication table by rote: 2&times;3=6, 4&times;5=20,
                7&times;8=56. You can answer questions from the table perfectly, but if someone
                asks 11&times;13 you&rsquo;re stuck. Then one day &mdash; weeks later, with no
                new studying &mdash; you suddenly understand multiplication itself and can compute
                any product. Neural networks do something similar. They memorize training examples
                first (scoring perfectly on those), then thousands of steps later suddenly
                &ldquo;grok&rdquo; the underlying pattern and generalize to new examples they&rsquo;ve
                never seen. The capability appears long after training looks finished.
            </Analogy>

            <Analogy label="Why This Scared Researchers">
                Normally in engineering, you build a small prototype, test it, and project the
                results to the full-scale version. Emergence breaks this. A capability absent at
                7B parameters, 13B parameters, and 30B parameters might suddenly appear at 65B
                &mdash; with no warning from the smaller experiments. If you&rsquo;re spending
                $10 million on a training run, you want to know in advance whether it will produce
                the capability you need. Emergence means you often can&rsquo;t know.
            </Analogy>

            <Analogy label="The Benchmark Problem">
                Most benchmarks score answers as right or wrong. A model that is 90% of the way to
                solving a hard math problem looks identical to a model that is 0% of the way
                &mdash; both score zero. This means gradual improvement is invisible until the
                model finally crosses the threshold to correctness, at which point it looks like
                an overnight jump. Whether that jump is &ldquo;real&rdquo; emergence or a trick
                of how we&rsquo;re keeping score is still debated.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Emergence: formal definitions, evidence, and the metric debate</h2>

            <h3>Defining Emergence</h3>
            <p>
                Wei et al. (2022) gave the following operational definition: a capability is
                <em> emergent</em> if it is not present in smaller models and is not simply a
                quantitative improvement of something smaller models could already do. The formal
                operationalization: if capability C has performance near random chance
                (accuracy &asymp; 1/k for k classes) for all model sizes N &lt; N* and substantially
                above random for N &gt; N*, then C is emergent with threshold N*:
            </p>
            <MathBlock tex="\text{Emergent}(C) \iff \exists\, N^*:\; \forall N < N^*,\; \text{acc}(C, N) \approx \frac{1}{k} \;\;\text{and}\;\; \text{acc}(C, N^*) \gg \frac{1}{k}" />
            <p>
                The key distinction from smooth scaling: if performance at N* can be predicted by
                extrapolating a smooth curve from performance at N &lt; N*, the capability is not
                emergent by this definition. Emergence requires a discontinuous jump &mdash; a
                break in the scaling curve that is not predicted by the pre-threshold behavior.
            </p>

            <DefBlock label="Emergent Ability (Wei et al., 2022)">
                An ability is emergent if it is not present in smaller models and cannot be predicted
                by extrapolating the performance curve of smaller models. It appears as a phase
                transition: near-chance performance below a compute/scale threshold, and substantially
                above-chance performance above that threshold, with no smooth intermediate state.
            </DefBlock>

            <h3>BIG-Bench Emergence Examples</h3>
            <p>
                Three tasks with documented emergence across the PaLM model family (8B, 62B, 540B
                parameters), evaluated on BIG-Bench:
            </p>
            <ul>
                <li>
                    <strong>Multi-digit addition:</strong> near-random performance (&lt; 10% accuracy)
                    at 8B and 62B parameters; above 80% accuracy at 540B parameters.
                </li>
                <li>
                    <strong>IPA transcription:</strong> near-random (&lt; 5%) at 8B and 62B;
                    above 70% at 540B.
                </li>
                <li>
                    <strong>Persian question answering:</strong> near-random at 8B and 62B;
                    approximately 60% at 540B.
                </li>
            </ul>
            <p>
                The approximate compute threshold for these tasks is 10<sup>22</sup> FLOPs,
                corresponding to 540B parameters trained on roughly 780B tokens. The FLOPs
                estimate follows the standard approximation:
            </p>
            <MathBlock tex="C \approx 6 \cdot N \cdot D" />
            <p>
                where N is parameter count and D is training token count. At 540B parameters and
                780B tokens, C &asymp; 6 &times; 5.4&times;10<sup>11</sup> &times; 7.8&times;10<sup>11</sup>
                &asymp; 2.5&times;10<sup>24</sup> FLOPs (PaLM-scale training). The jump appears
                between 10<sup>22</sup> and 10<sup>23</sup> FLOPs depending on the task.
            </p>

            <h3>The Metric Sensitivity Argument (Schaeffer et al.)</h3>
            <p>
                Schaeffer et al. demonstrated that choosing a continuous evaluation metric instead
                of a threshold metric eliminates the apparent discontinuity. For a given task, let
                p(y | x, N) be the token-level log-probability of the correct answer sequence y
                given input x at model scale N. The continuous metric is:
            </p>
            <MathBlock tex="\text{Score}_{\text{cont}}(N) = \frac{1}{|y|} \sum_{t} \log p(y_t \mid y_{<t}, x, N)" />
            <p>
                The threshold metric (exact-match accuracy) is:
            </p>
            <MathBlock tex="\text{Score}_{\text{EM}}(N) = \mathbf{1}\!\left[\arg\max p(y \mid x, N) = y^*\right]" />
            <p>
                Schaeffer et al. showed that Score<sub>cont</sub>(N) increases smoothly with N
                on the same tasks where Score<sub>EM</sub>(N) appears to jump. Their interpretation:
                the model is improving continuously; exact-match is a nonlinear, threshold-sensitive
                transformation of that continuous improvement that makes it look discontinuous.
                The rebuttal from the emergence camp: Score<sub>EM</sub> is what matters for
                real deployment &mdash; a model that cannot produce the exact correct answer is
                not useful for arithmetic, regardless of its partial-credit score.
            </p>

            <h3>Chain-of-Thought Emergence</h3>
            <p>
                The emergent nature of chain-of-thought prompting was documented by Wei et al.
                (2022b). Define the CoT gain at scale N as the difference in accuracy between
                CoT-prompted and direct-answer prompting on a multi-step reasoning benchmark:
            </p>
            <MathBlock tex="\Delta_{\text{CoT}}(N) = \text{acc}_{\text{CoT}}(N) - \text{acc}_{\text{direct}}(N)" />
            <p>
                Empirically, &Delta;<sub>CoT</sub>(N) is negative for N below the emergence
                threshold (CoT hurts) and positive &mdash; by 20&ndash;40 percentage points on
                GSM8K &mdash; for N above it. The proposed mechanism: multi-step reasoning requires
                a minimum effective &ldquo;working memory&rdquo; capacity. Below the threshold,
                the model generates intermediate reasoning steps but accumulates errors; the
                cascade of errors leads to worse final answers than skipping reasoning entirely.
                Above the threshold, the intermediate steps are reliable enough that they actually
                help &mdash; the model can keep track of a multi-step chain without losing the
                thread.
            </p>

            <h3>Grokking: Phase Transitions in Training Dynamics</h3>
            <p>
                Power et al. (2022) trained a small Transformer on the modular arithmetic task
                (a + b mod 97 for a, b &isin; &#123;0, &hellip;, 96&#125;). They observed the
                following training dynamics:
            </p>
            <ul>
                <li>Training loss converges to near zero by roughly step 1,000.</li>
                <li>Validation (generalization) accuracy remains near 1/97 &asymp; 1% until roughly step 40,000.</li>
                <li>At step ~40,000, validation accuracy jumps to ~100% in fewer than 5,000 steps.</li>
            </ul>
            <p>
                The mechanism for grokking involves the interplay between weight decay and
                solution complexity. Memorization solutions have high weight norms (they encode
                each training example individually). Generalizing solutions have lower weight norms
                (they encode the modular arithmetic algorithm compactly). Weight decay penalizes
                high norms, making the generalizing solution progressively more attractive. Grokking
                occurs when weight decay has sufficiently suppressed the memorization solution that
                the generalizing algorithm becomes the lower-loss option:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{CE}} + \lambda \|W\|^2 \;\;\Rightarrow\;\; \text{grokking occurs when } \lambda > \lambda^*" />
            <p>
                where &lambda;* is a task-dependent critical weight decay value. Below &lambda;*,
                the model memorizes permanently. Above &lambda;*, grokking eventually occurs.
                This is a phase transition in the optimization landscape, not in model scale &mdash;
                demonstrating that emergence-like phenomena appear in training dynamics as well as
                in the scale dimension.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Phase transition analysis &middot; percolation theory connection &middot; information-theoretic threshold</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">BIG-Bench-style evaluation &middot; simulated emergence curve</span>
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
            <h2>Phase transitions, percolation, and information-theoretic thresholds</h2>

            <DefBlock label="Statistical Physics Connection">
                The discontinuous jumps in capability across scale resemble phase transitions in
                statistical physics: systems that undergo abrupt, qualitative changes in behavior
                at a critical parameter value, with no smooth interpolation through the transition
                point. The analogy motivates applying phase-transition mathematics to emergence.
            </DefBlock>

            <h3>Percolation Theory and Capability Thresholds</h3>
            <p>
                In percolation theory, a lattice of nodes is connected with independent probability
                p. Below a critical probability p<sub>c</sub>, connections form only small isolated
                clusters. Above p<sub>c</sub>, a &ldquo;giant connected component&rdquo; spanning
                the entire lattice suddenly appears. The transition is sharp: the probability of
                a spanning cluster jumps discontinuously at p<sub>c</sub>:
            </p>
            <MathBlock tex="P(\text{spanning cluster}) \approx \begin{cases} 0 & p < p_c \\ (p - p_c)^\beta & p > p_c \end{cases}" />
            <p>
                where &beta; &asymp; 5/36 in 2D. The analogy to neural networks: individual
                capabilities (sub-computations) are the nodes; scale (parameter count or compute)
                is the connection probability. Below a critical scale, no sub-computation chain
                is long enough to implement a complex capability. Above critical scale, a
                &ldquo;spanning&rdquo; chain of sub-computations suddenly connects, making the
                capability functional. The sharpness of the percolation transition explains why
                capability emergence is sudden rather than gradual.
            </p>

            <h3>Loss Landscape Geometry and Double Descent</h3>
            <p>
                The loss landscape perspective on grokking: at small scale or early training, the
                loss landscape has many local minima corresponding to memorization solutions. As
                model scale or training duration increases, regularization pressure (weight decay)
                reshapes the landscape. At a critical threshold, the global minimum shifts from a
                memorization basin to a generalization basin:
            </p>
            <MathBlock tex="\min_W \left[\mathcal{L}_{\text{CE}}(W) + \lambda \|W\|^2\right] \xrightarrow{\lambda \nearrow \lambda^*} W_{\text{generalize}}" />
            <p>
                Below &lambda;*, gradient descent converges to W<sub>memorize</sub>. Above
                &lambda;*, the generalization basin has lower total loss and gradient descent
                eventually finds it &mdash; but only after escaping the memorization basin, which
                requires extended training. The latency of grokking (thousands of steps between
                memorization and generalization) corresponds to the time needed to escape
                W<sub>memorize</sub>.
            </p>

            <h3>Information-Theoretic Lower Bound on Threshold Compute</h3>
            <p>
                An information-theoretic argument for why emergence has a minimum compute threshold:
                to implement a capability that requires representing k-bit information (e.g., a
                lookup table with k-bit keys), a model must have at least k bits of effective
                capacity in the weights trained on the relevant examples. The effective capacity
                scales approximately as:
            </p>
            <MathBlock tex="\text{Capacity}(N, D) \approx N \cdot H(p_{\text{data}}) \cdot \min\!\left(1,\, \frac{D}{N}\right)" />
            <p>
                where H(p<sub>data</sub>) is the entropy of the data distribution and D is the
                number of training tokens. For a fixed capability requiring K bits, the minimum
                compute threshold follows as:
            </p>
            <MathBlock tex="C^* = 6 N^* D^* \;\;\text{s.t.}\;\; N^* \cdot H \cdot \min\!\left(1,\, \frac{D^*}{N^*}\right) \ge K" />
            <p>
                This provides a theoretical lower bound: no amount of optimization below C* can
                produce the capability, because the model lacks the information-theoretic capacity
                to represent it given the training data volume. The bound does not predict exact
                thresholds &mdash; it only establishes that thresholds exist and grow with
                capability complexity K.
            </p>

            <div className="ch-callout">
                <strong>Open question:</strong> None of these frameworks fully predicts emergence.
                Percolation gives the right shape of transition but wrong quantitative thresholds.
                The information-theoretic bound gives a lower bound but not a tight one. The loss
                landscape geometry explains grokking but not cross-scale emergence. A unified
                theory of emergence in neural networks remains an open research problem as of 2024.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `# ── BIG-Bench-style emergence evaluation (simulated) ─────────────────────────
# Demonstrates how to measure accuracy at different "model scales" and
# plot the emergence curve showing a sudden jump from near-chance to high accuracy.

import math
import random

# ── Simulate model accuracy at different FLOPs ────────────────────────────────
# In practice you would run actual model checkpoints; here we simulate the
# sigmoid-like jump that characterises emergence.

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def simulated_accuracy(log10_flops, threshold_log10=22.0, sharpness=3.0, chance=0.1):
    """
    Returns accuracy for a model trained with a given compute budget.
    Below threshold: near chance.  Above threshold: rapid rise toward 1.0.
    sharpness controls how abrupt the transition is.
    """
    x = sharpness * (log10_flops - threshold_log10)
    base = sigmoid(x)
    # Scale from chance level up to ~0.95 at large compute
    return chance + (0.95 - chance) * base

# Exact-match (threshold) metric vs continuous (log-prob proxy) metric
def exact_match_accuracy(log10_flops, noise=0.04):
    acc = simulated_accuracy(log10_flops)
    # Add realistic noise
    return max(0.0, min(1.0, acc + random.gauss(0, noise)))

def continuous_metric(log10_flops, noise=0.015):
    # Continuous metric rises more smoothly -- Schaeffer et al. argument
    x = (log10_flops - 20.0) / 3.0
    smooth = 0.1 + 0.85 * sigmoid(x)
    return max(0.0, min(1.0, smooth + random.gauss(0, noise)))

# ── Evaluate across a range of compute budgets ────────────────────────────────
random.seed(42)

compute_budgets = [19.0, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 24.0]
tasks = ["Multi-digit addition", "IPA transcription", "Persian QA"]
# Different tasks have slightly different thresholds
thresholds = {"Multi-digit addition": 22.2, "IPA transcription": 22.0, "Persian QA": 21.8}

print("=" * 72)
print("BIG-Bench Emergence Simulation")
print("Columns: log10(FLOPs) | Exact-match acc | Continuous metric")
print("=" * 72)

for task, thresh in thresholds.items():
    print(f"\\nTask: {task}  (threshold ~ 10^{thresh} FLOPs)")
    print(f"  {'log10(C)':>10}  {'Exact-match':>12}  {'Continuous':>12}  Status")
    print(f"  {'-'*10}  {'-'*12}  {'-'*12}  {'-'*15}")
    for log_c in compute_budgets:
        em = simulated_accuracy(log_c, threshold_log10=thresh, sharpness=4.0)
        cont = continuous_metric(log_c)
        status = "EMERGED" if em > 0.3 else "below-chance"
        print(f"  {log_c:>10.1f}  {em:>12.3f}  {cont:>12.3f}  {status}")

# ── Detect emergence threshold ────────────────────────────────────────────────
print("\\n" + "=" * 72)
print("Threshold Detection (first log10(C) where acc > 3x chance)")
print("=" * 72)
chance_level = 0.10
for task, thresh in thresholds.items():
    for log_c in [x / 10 for x in range(190, 250)]:
        acc = simulated_accuracy(log_c, threshold_log10=thresh, sharpness=4.0, noise=0.0 if True else 0.0)
        if acc > 3 * chance_level:
            print(f"  {task}: threshold detected at log10(C) = {log_c:.1f}  "
                  f"(true: {thresh})")
            break

# ── Grokking simulation ───────────────────────────────────────────────────────
print("\\n" + "=" * 72)
print("Grokking: training accuracy vs validation accuracy over steps")
print("=" * 72)

def grokking_val_acc(step, grok_step=40000, sharpness=0.0003):
    # Sudden jump in validation accuracy long after training loss converged
    return sigmoid(sharpness * (step - grok_step))

print(f"  {'Step':>8}  {'Train acc':>10}  {'Val acc':>10}  Status")
print(f"  {'-'*8}  {'-'*10}  {'-'*10}  {'-'*12}")
for step in [1000, 5000, 10000, 20000, 30000, 40000, 45000, 50000]:
    train_acc = 0.99 if step >= 1000 else step / 1000
    val_acc = grokking_val_acc(step)
    status = "generalized" if val_acc > 0.5 else "memorized"
    print(f"  {step:>8,}  {train_acc:>10.3f}  {val_acc:>10.3f}  {status}")

print("\\nNote: training accuracy reaches ~1.0 at step 1,000 (memorization).")
print("      Generalization (grokking) only appears at step ~40,000.")
`

function PythonContent() {
    return (
        <>
            <p>
                This simulation demonstrates BIG-Bench-style evaluation across a range of compute
                budgets, measuring both a threshold metric (exact-match accuracy) and a continuous
                metric (log-probability proxy). The emergence curve shows the sudden jump from
                near-chance to high accuracy. A second section simulates grokking: training accuracy
                reaching near-perfect long before validation accuracy jumps.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="emergence_eval.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const EMERGENT_ABILITIES_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
