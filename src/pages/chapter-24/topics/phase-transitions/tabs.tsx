import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Phase transitions in neural scaling</h2>
            <p>
                The most unsettling discovery in the scaling era was not that large models
                are more capable &mdash; it is that they become capable in the wrong way.
                Instead of a smooth, predictable ramp, capabilities arrive in sharp jumps:
                absent at one scale, suddenly present at another. This phenomenon, borrowing
                its name from thermodynamics, became one of the most contested empirical
                questions in machine learning: are emergent phase transitions real, or are
                they an illusion of how we measure?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Defining emergence</div>
                    <div className="ch-tl-title">Wei et al. &mdash; behavioral phase transitions at scale</div>
                    <div className="ch-tl-body">
                        Wei et al. formally defined emergence in large language models in terms of
                        behavioral phase transitions: a capability is <em>emergent</em> if it is
                        absent at model size N &lt; N* and present at N &ge; N*. The analogy to
                        physical phase transitions is direct &mdash; water freezes at exactly 0&deg;C,
                        not gradually over a range of temperatures. Even though the microscopic
                        physics (molecular motion slowing) is continuous, the macroscopic property
                        (solid vs. liquid) changes discontinuously at a critical threshold. Wei et al.
                        documented over 100 such emergent capabilities across tasks including
                        arithmetic, multi-step reasoning, and analogical reasoning, all appearing
                        sharply at particular scales.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided the canonical definition and empirical catalogue of emergent abilities in LLMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Theoretical model</div>
                    <div className="ch-tl-title">Arora &amp; Basu &mdash; percolation theory model of emergence</div>
                    <div className="ch-tl-body">
                        Arora and Basu (2023) offered the first principled theoretical account of
                        why emergence occurs. They modeled language understanding as a &ldquo;skill
                        tree&rdquo;: each high-level task requires a set of prerequisite sub-skills.
                        As model capacity N increases, each sub-skill is independently acquired with
                        probability p(N). A higher-level task &ldquo;percolates&rdquo; &mdash; becomes
                        possible &mdash; only when enough of its prerequisites have been acquired
                        simultaneously. This is mathematically identical to bond percolation in graph
                        theory, which has a provably sharp phase transition at a critical edge density.
                        The sharpness of the capability transition grows with the number of required
                        prerequisites K: requiring all K sub-skills simultaneously makes the overall
                        transition far sharper than any individual sub-skill acquisition.
                    </div>
                    <div className="ch-tl-impact">Impact: First rigorous theoretical model linking percolation theory to LLM emergence</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-title">Schaeffer, Miranda &amp; Koyejo &mdash; emergence as a metric artifact</div>
                    <div className="ch-tl-body">
                        Schaeffer, Miranda, and Koyejo (2023) mounted a fundamental challenge to the
                        emergence narrative. Their argument: the apparent discontinuity is not a
                        property of how models improve, but of how we measure them. Threshold metrics
                        such as exact-match accuracy produce floor/ceiling effects. A model that
                        improves from 2% to 5% correct on a hard task crosses a visible &ldquo;jump&rdquo;
                        in any binary metric, even if the underlying log-probability of the correct
                        answer improved smoothly throughout. Replacing exact-match with continuous
                        metrics &mdash; Brier score, calibration loss, log-probability &mdash; revealed
                        smooth, predictable power-law scaling for many supposedly emergent tasks. Their
                        conclusion: emergent abilities are real improvements, but the apparent
                        discontinuity is a property of the measurement instrument, not the model.
                    </div>
                    <div className="ch-tl-impact">Impact: Most-cited challenge to the emergence thesis; forced the field to distinguish metric artifacts from true discontinuities</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Rebuttal and resolution</div>
                    <div className="ch-tl-title">Compositional tasks retain true discontinuity</div>
                    <div className="ch-tl-body">
                        Multiple follow-up papers showed that Schaeffer et al.&rsquo;s critique does not
                        apply universally. For tasks requiring <em>compositional generalization</em>
                        &mdash; multi-step reasoning where ALL components must succeed simultaneously
                        &mdash; even continuous metrics show a genuinely non-analytic transition.
                        Arithmetic is the clearest case: a model that gets 95% of individual digits
                        correct still produces a wrong numerical answer. There is no graceful
                        degradation. When every step in a reasoning chain is a necessary condition
                        for the correct answer, the overall capability has an inherently step-function
                        structure, regardless of which metric is used to observe it. The community
                        consensus moved toward a distinction: smooth-metric emergence is a measurement
                        artifact, but compositional emergence is real.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that compositional structure is the key predictor of true (non-artifactual) emergence</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Laboratory model</div>
                    <div className="ch-tl-title">Power et al. &mdash; grokking as a controlled phase transition</div>
                    <div className="ch-tl-body">
                        Power et al.&rsquo;s grokking experiment &mdash; training a small two-layer
                        transformer on modular arithmetic &mdash; provided a laboratory-scale model
                        of phase transitions in learning dynamics. The model first memorized the
                        training data (training loss converging to near zero, test accuracy remaining
                        near chance). Then, after further training with no visible improvement in
                        training loss, test accuracy jumped sharply to near 100%: the model had
                        &ldquo;grokked&rdquo; the task. Mechanistic analysis revealed the cause:
                        during the grokking phase, the model abandoned its memorized lookup table
                        and learned a compressed, Fourier-basis representation of modular arithmetic
                        &mdash; an algebraically exact algorithm that generalizes perfectly. Weight
                        decay accelerated grokking by penalizing the high-norm memorization solution.
                        Critically, grokking shows that phase transitions can occur in <em>training
                        time</em> as well as model scale.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided a fully controlled, interpretable example of a phase transition; enabled mechanistic study of emergence</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Predictability research</div>
                    <div className="ch-tl-title">DeepMind, Google, Anthropic &mdash; can emergence be anticipated?</div>
                    <div className="ch-tl-body">
                        Multiple research groups began developing methods to predict emergent
                        capabilities at small scale &mdash; to avoid building a large model only
                        to discover it lacks a needed skill, or more dangerously, that it has
                        acquired an unanticipated one. Three main approaches emerged: (a) using
                        continuous proxy metrics to extrapolate the trajectory of smooth underlying
                        improvement; (b) identifying &ldquo;early warning&rdquo; precursor behaviors
                        at smaller scale that reliably precede a capability jump; (c) using mechanistic
                        interpretability to observe when the relevant computational circuits first
                        form and begin to cohere. Progress has been limited. Phase transitions remain
                        largely unpredictable in practice &mdash; the scale at which a given capability
                        emerges is often only determinable empirically.
                    </div>
                    <div className="ch-tl-impact">Impact: Opened the active research area of emergence prediction; highlighted the limits of current scaling theory</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Safety implications</div>
                    <div className="ch-tl-title">ARC Evals &mdash; evaluating emergent dangerous capabilities</div>
                    <div className="ch-tl-body">
                        Unpredictable capability emergence became a safety concern of the first order.
                        A model might develop dangerous capabilities &mdash; persuasion at scale,
                        deception, cyberattack reasoning &mdash; at a scale threshold that was not
                        anticipated and was not present at the previous checkpoint. The response from
                        leading labs, particularly through ARC Evals (now METR) and similar
                        organizations, was to institute &ldquo;evaluations before deployment&rdquo;:
                        systematic red-teaming for emergent dangerous capabilities at each major
                        scale-up, before the model is released. This practice institutionalized
                        emergence as not merely an empirical curiosity but a safety-critical
                        engineering problem. The unpredictability of emergence motivated a new
                        field: capability elicitation &mdash; the systematic search for latent
                        capabilities that are present in model weights but not surfaced by standard
                        evaluation.
                    </div>
                    <div className="ch-tl-impact">Impact: Made emergence a safety-critical concern; established pre-deployment capability evaluation as a lab-wide norm</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The organizing tension:</strong> Phase transitions reveal a fundamental
                asymmetry between the smoothness of training dynamics and the discontinuity of
                task performance. Whether the discontinuity is real or measured depends on the
                task structure &mdash; but from an engineering and safety perspective, the
                distinction may not matter. A capability that was absent yesterday and is present
                today, for any reason, demands the same response: evaluation, alignment, and
                deployment discipline.
            </div>

            <Analogy label="What comes next &mdash; Instruction Tuning &amp; RLHF">
                Phase transitions reveal an uncomfortable fact: a highly capable model is not
                automatically a helpful or safe one. A model might suddenly acquire the ability
                to generate persuasive misinformation just as easily as it acquires the ability
                to do arithmetic. Capability without alignment is dangerous. Chapter 25 covers
                the techniques developed to address this gap &mdash; Supervised Fine-Tuning (SFT),
                Reinforcement Learning from Human Feedback (RLHF), and Constitutional AI &mdash;
                the methods that transformed raw language model capabilities into the assistants
                people could actually use.
            </Analogy>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Why AI skills appear out of nowhere</h2>

            <Analogy label="The Freezing Point">
                Water is a liquid at 1&deg;C. At exactly 0&deg;C, it suddenly becomes solid ice.
                Nothing in between &mdash; no half-frozen mush that slowly hardens. Neural network
                capabilities work the same way. A skill is &ldquo;liquid&rdquo; (absent) until the
                model hits a critical size, then it &ldquo;freezes&rdquo; into place &mdash; suddenly
                present. The surprising part is that the model is improving smoothly the whole time,
                just like water is cooling continuously. But the visible result &mdash; can it do the
                task? &mdash; only changes at one specific moment, not gradually.
            </Analogy>

            <Analogy label="Prerequisite Trees">
                To understand a joke, you need vocabulary, cultural knowledge, and the ability to
                imagine what another person is thinking. If any one of those is missing, the joke
                just falls flat &mdash; you don&rsquo;t get partial credit for understanding 2 out
                of 3. When a model grows large enough to finally have ALL the prerequisites at once,
                it can suddenly understand jokes. Not because each part got a little better, but
                because it finally crossed the threshold of having every piece simultaneously. Like
                finishing a jigsaw puzzle &mdash; the picture doesn&rsquo;t gradually appear; it
                appears when the last piece clicks in.
            </Analogy>

            <Analogy label="Is the Jump Real?">
                Some scientists say the sudden jump is an illusion. If you could give the model
                partial credit &mdash; &ldquo;you got 7 out of 10 digits right&rdquo; instead of
                &ldquo;wrong answer&rdquo; &mdash; you&rsquo;d see steady, gradual improvement the
                whole time. Others say: in the real world, almost right IS wrong. A calculator that
                gets 95% of digits right is broken &mdash; it gives you the wrong number. So the
                jump IS real for practical purposes, even if underneath the hood the model is
                improving smoothly. Whether the jump is &ldquo;real&rdquo; depends on whether partial
                credit makes sense for the task you care about.
            </Analogy>

            <Analogy label="Grokking: The Late-Night Breakthrough">
                You&rsquo;ve studied for a test for weeks with no progress. Then one night, something
                clicks, and suddenly you understand everything perfectly. Grokking in neural networks
                is exactly like that. The model trains and trains, seeming to make no progress on the
                real test. Then, after even more training, test performance jumps to near perfect
                &mdash; as if the model suddenly &ldquo;got it.&rdquo; What actually happened: the
                model quietly built up a compressed, elegant understanding of the underlying rule,
                and the moment that understanding crossed a threshold, it worked perfectly.
            </Analogy>

            <Analogy label="Why This Keeps AI Safety Researchers Up at Night">
                Imagine a student who suddenly and unexpectedly develops the ability to pick locks
                &mdash; a skill nobody taught them and nobody expected. That&rsquo;s what researchers
                worry about with large AI models. If dangerous capabilities &mdash; like knowing how
                to write very convincing lies, or how to attack computer systems &mdash; appear
                suddenly at some size threshold, you can&rsquo;t test for them in advance by looking
                at a smaller model. The surprise is the problem. This is why labs now carefully test
                every new model for unexpected dangerous skills before releasing it, even if the
                previous version showed no signs of those skills.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of emergent phase transitions</h2>

            <h3>Phase Transitions: Formal Definition</h3>
            <p>
                In statistical physics, a phase transition occurs when a macroscopic property
                f changes discontinuously at a critical parameter value T<sub>c</sub>. A
                <em> first-order</em> phase transition satisfies:
            </p>
            <MathBlock tex="\lim_{T \to T_c^-} f(T) \ne \lim_{T \to T_c^+} f(T)" />
            <p>
                In neural scaling, we replace the physical temperature T with model size N
                (parameter count) or compute C (FLOPs). The emergence condition for a task
                with performance metric P(N) is that P exhibits a non-analytic discontinuity
                at a critical scale N*:
            </p>
            <MathBlock tex="P(N) \approx \begin{cases} P_{\text{chance}} & N < N^* \\ P_{\text{capable}} & N \ge N^* \end{cases}" />
            <p>
                where P<sub>chance</sub> is near-random performance and P<sub>capable</sub>
                is task-competent performance. The critical threshold N* is task-specific and
                currently not derivable from first principles for real tasks.
            </p>

            <h3>Percolation Model of Emergence</h3>
            <p>
                Arora and Basu modeled a language task as requiring k out of K prerequisite
                skills, each acquired independently. Let p(N) be the probability that a model
                of size N has acquired any individual prerequisite skill. Empirically, this
                follows a saturating curve:
            </p>
            <MathBlock tex="p(N) = 1 - e^{-\lambda N}" />
            <p>
                A task requiring that at least k of K prerequisites are simultaneously present
                has acquisition probability:
            </p>
            <MathBlock tex="P_{\text{task}}(N) = \sum_{j=k}^{K} \binom{K}{j} p(N)^j (1-p(N))^{K-j}" />
            <p>
                Near the critical threshold N* where p(N*) = k/K, the emergence rate scales
                as a power law in the deviation from criticality:
            </p>
            <MathBlock tex="\frac{dP_{\text{task}}}{dN} \bigg|_{N \approx N^*} \propto (N - N^*)^{\beta - 1}" />
            <p>
                where &beta; is the percolation critical exponent (approximately 0.5 in 2D
                systems, approximately 0.88 in 3D systems). As K increases, the transition
                sharpens &mdash; tasks requiring more prerequisites have more abrupt emergence,
                matching the empirical observation that compositional tasks show the sharpest
                capability jumps.
            </p>

            <h3>The Metric Sensitivity Result</h3>
            <p>
                Schaeffer et al. formalized why threshold metrics produce apparent
                discontinuities from smooth underlying functions. Consider a model with smooth,
                monotonically improving log-probability f(N) on a task, where f(N) &rarr; 0
                as N &rarr; &infin;. Define a threshold metric:
            </p>
            <MathBlock tex="M_{\text{thresh}}(f) = \mathbf{1}\bigl[f(N) > \tau\bigr]" />
            <p>
                If the probability of the correct answer improves as P(correct) = 1 - N<sup>-&gamma;</sup>,
                then for any finite threshold &tau;, there exists a finite N at which the metric
                jumps from 0 to 1, even if P(correct) is perfectly smooth:
            </p>
            <MathBlock tex="\exists\, N^* < \infty : M_{\text{thresh}}(N^* - \epsilon) = 0 \text{ and } M_{\text{thresh}}(N^* + \epsilon) = 1" />
            <p>
                The rebuttal to Schaeffer et al. is that for compositional tasks, the threshold
                is not an artifact of measurement &mdash; it is operationally meaningful. In
                arithmetic, exact match IS the correct metric. There is no sensible continuous
                relaxation of &ldquo;is the answer numerically correct.&rdquo; When the metric
                threshold is operationally justified, the apparent discontinuity is the real
                discontinuity.
            </p>

            <h3>Grokking Dynamics</h3>
            <p>
                Power et al. trained a two-layer transformer on the task (a + b) mod p,
                for prime p = 97, using the full (97 &times; 97) multiplication table. The
                grokking dynamic has two phases separated by a sharp transition:
            </p>
            <ul>
                <li>
                    <strong>Phase 1 (memorization):</strong> training loss &rarr; 0 while test
                    accuracy remains near 1/97 &asymp; 1%. The model has memorized the training
                    set as a lookup table.
                </li>
                <li>
                    <strong>Phase 2 (generalization):</strong> test accuracy jumps to ~100% after
                    additional training with no further change in training loss. The model has
                    discovered the algebraic structure.
                </li>
            </ul>
            <p>
                Mechanistic analysis showed that the model&rsquo;s generalizing solution uses
                a Fourier basis representation. For modular addition, the key identity is:
            </p>
            <MathBlock tex="\cos\!\left(\frac{2\pi k (a+b)}{p}\right) = \cos\!\left(\frac{2\pi k a}{p}\right)\cos\!\left(\frac{2\pi k b}{p}\right) - \sin\!\left(\frac{2\pi k a}{p}\right)\sin\!\left(\frac{2\pi k b}{p}\right)" />
            <p>
                The model learns to embed a and b into Fourier components, compute their
                interaction via the embedding product, and decode the result. This is an
                algebraically exact algorithm, not an approximation &mdash; it achieves 100%
                test accuracy because it implements the true mathematical structure. Weight decay
                accelerates grokking by adding a penalty proportional to &vert;&vert;W&vert;&vert;<sup>2</sup>,
                which penalizes the high-norm memorization solution and encourages the
                low-norm, generalizing Fourier solution.
            </p>

            <h3>Capability Elicitation and Safety</h3>
            <p>
                Shevlane et al. (DeepMind, 2023) distinguished two quantities: the capability
                a model exhibits in standard evaluation, and the capability it possesses but
                requires targeted elicitation to surface. Define the elicitation gap as:
            </p>
            <MathBlock tex="\Delta_{\text{elicit}}(N) = \sup_{\text{prompts } \pi} P(N, \pi) - P_{\text{standard}}(N)" />
            <p>
                where P(N, &pi;) is performance under prompt strategy &pi; and P<sub>standard</sub>(N)
                is performance under standard benchmark prompting. Empirically,
                &Delta;<sub>elicit</sub>(N) can be large &mdash; a model may appear harmless
                under standard evaluation while possessing latent dangerous capabilities that
                emerge under adversarial prompting. This motivates the practice of capability
                elicitation before deployment: systematically searching over prompt strategies
                to find the maximum achievable performance on safety-relevant tasks, treating
                that as the true capability estimate.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Percolation phase transition derivation &middot; Fourier basis analysis of grokking</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Grokking on modular arithmetic &middot; small transformer &middot; training vs. generalization accuracy</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths Deep Dive ───────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Percolation theory and Fourier analysis of grokking</h2>

            <DefBlock label="Bond Percolation Phase Transition">
                In bond percolation on a graph G = (V, E), each edge is independently present
                with probability p. The fraction of nodes in the largest connected component,
                S(p), satisfies: S(p) = 0 for p &lt; p<sub>c</sub> and S(p) &gt; 0 for
                p &gt; p<sub>c</sub>, where p<sub>c</sub> is the critical percolation
                threshold. Near p<sub>c</sub>, the order parameter scales as
                S(p) &sim; (p &minus; p<sub>c</sub>)<sup>&beta;</sup> for p &rarr; p<sub>c</sub><sup>+</sup>,
                with &beta; a universal critical exponent depending only on graph dimensionality.
            </DefBlock>

            <h3>Skill tree percolation: sharp threshold derivation</h3>
            <p>
                Consider a task T requiring all K prerequisite skills simultaneously (the
                &ldquo;AND&rdquo; model). Each skill is acquired with probability p(N). The task
                acquisition probability is:
            </p>
            <MathBlock tex="P_T(N) = p(N)^K" />
            <p>
                The emergence rate (derivative with respect to N) peaks at:
            </p>
            <MathBlock tex="\frac{dP_T}{dN} = K \, p(N)^{K-1} \, p'(N)" />
            <p>
                With p(N) = 1 &minus; e<sup>&minus;&lambda;N</sup>, we have p&prime;(N) = &lambda; e<sup>&minus;&lambda;N</sup>.
                At the critical scale N* where p(N*) = 1/2:
            </p>
            <MathBlock tex="N^* = \frac{\ln 2}{\lambda}" />
            <p>
                The peak emergence rate scales as:
            </p>
            <MathBlock tex="\left.\frac{dP_T}{dN}\right|_{N=N^*} = K \cdot \left(\tfrac{1}{2}\right)^{K-1} \cdot \frac{\lambda}{2} \sim K \cdot 2^{-(K-1)} \cdot \frac{\lambda}{2}" />
            <p>
                The transition width &mdash; the range of N over which P<sub>T</sub> goes
                from 10% to 90% &mdash; scales as 1/K. As K &rarr; &infin;, the transition
                becomes a true step function, establishing that compositional tasks with many
                prerequisites have arbitrarily sharp emergence.
            </p>

            <h3>Fourier basis analysis of grokking</h3>
            <p>
                The modular addition task (a + b) mod p can be solved exactly by any model
                that implements the trigonometric identity. The key insight is that the set of
                functions &#123;cos(2&pi;ka/p), sin(2&pi;ka/p)&#125; for k = 0, 1, &hellip;, (p&minus;1)/2
                forms a complete Fourier basis on Z<sub>p</sub>. The model learns to represent
                each input a via its embedding e(a) that encodes Fourier components:
            </p>
            <MathBlock tex="e(a) \approx \sum_{k \in K_{\text{used}}} \alpha_k \cos\!\left(\frac{2\pi k a}{p}\right) + \beta_k \sin\!\left(\frac{2\pi k a}{p}\right)" />
            <p>
                The attention layer computes bilinear interactions e(a)<sup>T</sup>We(b),
                which via the trig product identity equals:
            </p>
            <MathBlock tex="e(a)^T W e(b) \propto \cos\!\left(\frac{2\pi k(a+b)}{p}\right)" />
            <p>
                The output layer decodes this into logits for each possible result r via:
            </p>
            <MathBlock tex="\text{logit}(r) \propto \sum_{k} \cos\!\left(\frac{2\pi k(a+b-r)}{p}\right)" />
            <p>
                This sum is maximized exactly when r = (a + b) mod p, implementing the
                correct answer with 100% accuracy for all inputs. The grokking transition
                corresponds precisely to the model converging to this Fourier representation
                &mdash; abandoning a high-norm memorized solution for a low-norm, structured
                algorithm. The phase transition in test accuracy is the external signature of
                this internal representational transition.
            </p>

            <div className="ch-callout">
                <strong>Unified picture:</strong> Both the percolation model and the grokking
                analysis share a common structure. There is a continuous underlying process
                (skill acquisition probability increasing; Fourier representation quality
                improving) and a discrete threshold phenomenon (task emergence; generalization
                jump). The sharpness of the threshold is governed by a structural property
                &mdash; number of required prerequisites K, or the gap between the
                memorization and generalization solution norms. This is why emergence is not
                uniformly predictable: the structural properties that govern transition
                sharpness are task-specific and not readable off from the training curve alone.
            </div>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

# ── Configuration ─────────────────────────────────────────────────────────────
P = 97          # prime modulus for (a + b) mod P
D_MODEL = 128   # embedding dimension
N_HEADS = 4     # attention heads
N_LAYERS = 2    # transformer layers
LR = 1e-3
WEIGHT_DECAY = 1.0   # strong weight decay accelerates grokking
TRAIN_FRAC = 0.3     # 30% of data for training (forces memorization first)
N_EPOCHS = 10_000

# ── Dataset ───────────────────────────────────────────────────────────────────
all_pairs = [(a, b) for a in range(P) for b in range(P)]
targets = [(a + b) % P for a, b in all_pairs]

data = torch.tensor(all_pairs, dtype=torch.long)    # (P*P, 2)
labels = torch.tensor(targets, dtype=torch.long)    # (P*P,)

n_train = int(TRAIN_FRAC * len(data))
idx = torch.randperm(len(data))
train_idx = idx[:n_train]
test_idx  = idx[n_train:]

x_train, y_train = data[train_idx], labels[train_idx]
x_test,  y_test  = data[test_idx],  labels[test_idx]

# ── Model ─────────────────────────────────────────────────────────────────────
class ModularTransformer(nn.Module):
    def __init__(self):
        super().__init__()
        self.embed = nn.Embedding(P + 1, D_MODEL)  # +1 for equals token
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=D_MODEL, nhead=N_HEADS, dim_feedforward=512,
            dropout=0.0, batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=N_LAYERS)
        self.head = nn.Linear(D_MODEL, P)

    def forward(self, x):
        # x: (batch, 2) — pairs (a, b)
        # append equals token (index P) as the readout position
        eq = torch.full((x.size(0), 1), P, dtype=torch.long, device=x.device)
        tokens = torch.cat([x, eq], dim=1)          # (batch, 3)
        h = self.embed(tokens)                       # (batch, 3, D_MODEL)
        h = self.transformer(h)                      # (batch, 3, D_MODEL)
        return self.head(h[:, -1, :])               # (batch, P) — logits from equals position

model = ModularTransformer()
optimizer = optim.AdamW(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
criterion = nn.CrossEntropyLoss()

# ── Training loop ─────────────────────────────────────────────────────────────
train_accs, test_accs, losses = [], [], []

for epoch in range(N_EPOCHS):
    model.train()
    logits = model(x_train)
    loss = criterion(logits, y_train)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if epoch % 100 == 0:
        model.eval()
        with torch.no_grad():
            tr_acc = (model(x_train).argmax(dim=-1) == y_train).float().mean().item()
            te_acc = (model(x_test).argmax(dim=-1)  == y_test).float().mean().item()
        train_accs.append(tr_acc)
        test_accs.append(te_acc)
        losses.append(loss.item())
        if epoch % 1000 == 0:
            print(f"Epoch {epoch:5d} | loss {loss.item():.4f} | "
                  f"train {tr_acc:.2%} | test {te_acc:.2%}")

# ── Plot the grokking curve ───────────────────────────────────────────────────
epochs_logged = list(range(0, N_EPOCHS, 100))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)

ax1.plot(epochs_logged, train_accs, label="Train accuracy", color="#5ab98c")
ax1.plot(epochs_logged, test_accs,  label="Test accuracy",  color="#e8a838")
ax1.axhline(1.0, color="#252530", linewidth=0.8, linestyle="--")
ax1.set_ylabel("Accuracy")
ax1.set_ylim(-0.05, 1.05)
ax1.legend()
ax1.set_title(f"Grokking on modular addition (a + b) mod {P}")
ax1.annotate(
    "Grokking:\\ntest jumps to 100%",
    xy=(next(e for e, a in zip(epochs_logged, test_accs) if a > 0.9), 0.9),
    xytext=(N_EPOCHS * 0.5, 0.5),
    arrowprops=dict(arrowstyle="->", color="#e8a838"),
    color="#e8a838", fontsize=9,
)

ax2.semilogy(epochs_logged, losses, color="#9b7fc7", label="Training loss")
ax2.set_xlabel("Training epoch")
ax2.set_ylabel("Loss (log scale)")
ax2.legend()

plt.tight_layout()
plt.savefig("grokking_curve.png", dpi=150, bbox_inches="tight")
plt.show()
print("Saved grokking_curve.png")
`

function PythonContent() {
    return (
        <>
            <p>
                A minimal PyTorch implementation of the grokking experiment from Power et al.
                A small two-layer transformer is trained on (a&nbsp;+&nbsp;b)&nbsp;mod&nbsp;97.
                With only 30% of pairs available for training, the model first memorizes the
                training set (train accuracy &rarr; 100%, test accuracy &asymp; 0%). After
                further training with strong weight decay, test accuracy jumps sharply to near
                100% &mdash; the grokking transition. The plot shows both the sudden
                generalization jump and the training loss, which remains near zero throughout
                Phase 2 &mdash; demonstrating that the transition is invisible in the training
                signal.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="grokking_modular_arithmetic.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PHASE_TRANSITIONS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
