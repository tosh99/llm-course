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
            year: "2017 — Early Empirical Hints",
            title: "Power laws appear before anyone names them",
            context: "By 2017, deep learning practitioners had accumulated an informal rule of thumb: bigger models trained on more data consistently performed better. But 'consistently' was doing a lot of work. There was no quantitative framework — no equation predicting exactly how much better, or how the three resources of parameters, data, and compute traded off against each other. Hestness et al. (2017) at Baidu collected evidence across domains including image, language, and speech that neural network test error followed power-law functions of dataset size: double the data, and error fell by a fixed multiplicative factor. This was suggestive, but limited to the data dimension alone.",
            what: "Hestness et al. published 'Deep Learning Scaling is Predictable, Empirically,' documenting power-law behavior in neural test error across six domains. Their key finding: for a fixed architecture, test error scales as D^(-α) where α is architecture-dependent but remarkably stable within a domain. They also showed that the power law breaks down if the model is too small to utilize the data — the model becomes the bottleneck.",
            impact: "This was the first systematic empirical evidence that scaling behavior was law-like rather than incidental. It motivated researchers to search for a unified framework covering all three resources simultaneously — the work that would become the 2020 scaling laws paper. Hestness et al. also introduced the idea of 'bottleneck regimes': conditions where one resource limits performance regardless of the others.",
        },
        {
            year: "2019–2020 — Kaplan et al. and the OpenAI Scaling Laws",
            title: "Scaling Laws for Neural Language Models",
            context: "While training GPT-2, Jared Kaplan, Sam McCandlish, Tom Henighan, and colleagues at OpenAI ran dozens of smaller experiments varying model size, dataset size, and training duration systematically. They noticed that validation loss plotted against any of these three variables on a log-log scale fell on remarkably straight lines — power laws — spanning seven orders of magnitude, from a million to a hundred billion parameters. The relationships held regardless of whether the transformer was wide or narrow, shallow or deep, as long as it had sufficient capacity.",
            what: "The paper 'Scaling Laws for Neural Language Models' (January 2020) formalized three power laws: L(N) ∝ N^(-0.076) for parameters, L(D) ∝ D^(-0.095) for tokens, and L(C) ∝ C^(-0.050) for compute. It also identified the compute-optimal allocation: given a fixed compute budget C, the Kaplan et al. analysis suggested spending most of it on model size rather than data — specifically N ∝ C^(0.73) and D ∝ C^(0.27). This implied that the compute-efficient frontier was dominated by large undertrained models.",
            impact: "The paper gave the field its first quantitative roadmap. Labs could now estimate the loss they would achieve before running a multi-million-dollar training job. It directly justified GPT-3: if the power law held, a 175B model should achieve a specific predicted loss, and it did. The compute-optimal prescription — prioritize parameters over data — influenced every large model from GPT-3 through PaLM, until Chinchilla upended it two years later.",
        },
        {
            year: "2020–2021 — Three Bottleneck Regimes",
            title: "Compute-limited, data-limited, parameter-limited",
            context: "A key implication of the scaling laws framework was that at any given compute budget, performance is constrained by whichever resource is most scarce relative to the power-law optimum. Kaplan et al. identified three qualitatively distinct regimes, each requiring a different strategy for the practitioner who wants to maximize model quality per dollar.",
            what: "In the compute-limited regime (most practical training runs), the model is not trained to convergence — more compute directly buys lower loss. In the parameter-limited regime, the model is so small that it cannot represent the patterns in the data regardless of training time — increasing parameters helps most. In the data-limited regime, the model has enough capacity but the dataset is too small; more data or regularization is needed. The Kaplan analysis showed that for very large compute budgets (C &gt; 10^23 FLOPs), models in 2020 were almost universally in the compute-limited and parameter-limited regimes simultaneously — they were both too small and undertrained.",
            impact: "This framework gave practitioners a diagnosis tool. Running an ablation on small models and plotting loss versus compute immediately revealed which regime the large run would occupy. It also highlighted the underappreciated role of data: by 2021, GPT-3 had been trained on 300B tokens with 175B parameters, but the Kaplan analysis suggested this was suboptimal — the model was undertrained relative to its size. DeepMind's team at Chinchilla set out to test this directly.",
        },
        {
            year: "2021 — The Compute-Optimal Recipe (Kaplan Version)",
            title: "Grow model size faster than dataset size",
            context: "The practical prescription from the Kaplan et al. paper was seductive in its simplicity: if you have a compute budget C, allocate roughly 73% of its scaling power to model size and 27% to data. Equivalently, for every 10× increase in compute, multiply parameters by about 5× and tokens by about 2×. This is because the power-law exponent for parameters (0.076) was smaller than for data (0.095), meaning each additional parameter bought slightly less loss reduction than each additional token — but the compute cost of adding parameters (amortized over many tokens) was still cheaper.",
            what: "This recipe drove the design of every major model of 2020–2021: GPT-3 (175B params, 300B tokens — approximately the Kaplan-optimal point for its compute budget), Google's LaMDA (137B params), and early versions of PaLM. The field had converged on a consensus training recipe: scale up parameters aggressively, keep the dataset at roughly 10 tokens per parameter, and use the remaining compute on longer training within the stable loss regime.",
            impact: "The Kaplan recipe turned out to be wrong in a specific and important way: it was calibrated on short training runs that had not reached convergence. When Hoffmann et al. at DeepMind ran much longer training runs to true convergence, the optimal ratio shifted dramatically — toward equal scaling of parameters and data. But the Kaplan prescription was not useless; it correctly identified the qualitative direction (scale both) and gave the field confidence that trillion-parameter models were worthwhile to pursue.",
        },
        {
            year: "March 2022 — Chinchilla and the Correction",
            title: "Training Compute-Optimal Large Language Models",
            context: "Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, and colleagues at DeepMind ran a decisive experiment: they trained over 400 language models ranging from 70M to 16B parameters, each trained to full convergence on datasets ranging from 5B to 500B tokens. Crucially, they measured the loss at convergence rather than at a fixed compute budget — this eliminated the confound that had skewed Kaplan's analysis toward undertrained large models.",
            what: "The Chinchilla paper (March 2022) showed that the Kaplan compute-optimal recipe was wrong: the true optimal allocation is approximately equal scaling of parameters and tokens — for every doubling of model size, double the training data. The fitted optimal: N ∝ C^(0.49) and D ∝ C^(0.51). Concretely, GPT-3 (175B params, 300B tokens) should have been trained on roughly 3.5T tokens to be compute-optimal; alternatively, a 70B model trained on 1.4T tokens (Chinchilla itself) matched or exceeded GPT-3 on most benchmarks while using the same compute and being four times smaller at inference time.",
            impact: "Chinchilla immediately became the design target for the next generation of models. LLaMA (Meta, 2023) was explicitly trained to the Chinchilla-optimal point. LLaMA-2 pushed beyond it toward data-efficiency (65B params, 2T tokens). Google's Gemini and Anthropic's Claude models all incorporated Chinchilla-style compute allocation. The secondary effect was equally large: inference cost matters as much as training cost, and a smaller, better-trained model is cheaper to deploy — an asymmetry that Kaplan's training-centric analysis had ignored.",
        },
        {
            year: "2022–2023 — Emergence: Where Power Laws Break Down",
            title: "Sudden capabilities that scaling laws cannot predict",
            context: "The scaling laws described smooth, continuous improvement in language modeling loss as a function of scale. But researchers began noticing a disturbing pattern: certain capabilities — multi-step arithmetic, multilingual translation, chain-of-thought reasoning, few-shot learning on abstract tasks — did not improve smoothly. They appeared absent below a threshold scale and then appeared rapidly, as if a phase transition had occurred. This phenomenon, named 'emergence' by Wei et al. (2022), posed a fundamental challenge to the power-law worldview.",
            what: "Wei et al. surveyed 137 tasks across the BIG-Bench benchmark and found over 100 where performance was near-random below a threshold and then jumped sharply. For example, arithmetic on 5-digit numbers was effectively unsolvable by models below 10^23 training FLOPs and then suddenly achievable. The 'let's think step by step' chain-of-thought prompt was ineffective below 100B parameters and then dramatically effective. These emergent capabilities were not predicted by extrapolating the smooth power-law loss curve — the loss improved smoothly, but the task metric did not.",
            impact: "Emergence complicated the clean story of scaling laws. It suggested that measuring loss is insufficient for predicting capability — what matters may be qualitative phase transitions rather than quantitative loss reductions. It also raised safety concerns: if large models can suddenly acquire capabilities that small models lack, a training run might cross a threshold unexpectedly. The debate about whether emergence is a real phenomenon or a measurement artifact (using discontinuous task metrics rather than continuous ones) remains active as of 2024, but it has permanently enriched the scaling laws conversation.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <Analogy label="The Garden with Predictable Rules">
                Imagine you're growing a magical plant. You notice that every time you add more
                water, it grows taller — and the relationship is incredibly regular. Double the
                water, and it doesn't double in height, but it grows by exactly the same fraction
                every time. Scientists call this a power law. The beautiful thing is that once you
                know the rule, you can plan: "If I want a plant this tall, I need exactly this
                much water — no guessing."
                <br /><br />
                Scaling laws say AI brains work the same way. Bigger brain, more reading material,
                more study time — each one makes the AI smarter in a perfectly predictable,
                power-law pattern. Before 2020, AI researchers were just guessing. After scaling
                laws, they could plan exactly.
            </Analogy>

            <Analogy label="The Three Ingredients">
                Building a smart AI needs three ingredients: the size of the brain (how many
                numbers it stores — called parameters), the library of books it reads during
                school (the dataset), and the total hours it studies (the compute budget). Scaling
                laws say: if you know any two of these, you can predict the third with surprising
                accuracy.
                <br /><br />
                And here is the kicker — no matter how clever your teaching method, you cannot
                cheat the curve. You cannot make a tiny brain as smart as a big one just by
                teaching it better tricks. You need more of all three ingredients to get smarter,
                and the power law tells you exactly how much more.
            </Analogy>

            <Analogy label="The Undertrained Genius">
                Imagine hiring the smartest person in the world but only giving them a shelf of
                ten books to read before the exam. They will be smarter than someone with a
                smaller brain who read the same ten books — but much dumber than a medium-smart
                person who read the whole library. That is what DeepMind's Chinchilla paper showed
                in 2022: AI labs had been building giant brains but starving them of reading
                material.
                <br /><br />
                The fix was counterintuitive: build a smaller brain, but give it far more books.
                Chinchilla (70 billion parameters, 1.4 trillion words) beat Gopher (280 billion
                parameters, 300 billion words) at the same total cost. Smaller and better-read
                won.
            </Analogy>

            <Analogy label="The Study Budget">
                Suppose you have exactly ten hours to prepare for an exam covering five subjects.
                The old advice (Kaplan 2020) was: spend 7 hours on the hardest subject and 3
                hours on the others. The new advice (Chinchilla 2022) was: split your time roughly
                equally between all subjects — 2 hours each. Both used the same ten hours.
                Chinchilla just used them more wisely.
                <br /><br />
                This is the compute-optimal recipe. Given a fixed budget, the smart move is not
                to pour everything into the biggest possible brain — it is to balance brain size
                and reading time in a roughly equal ratio.
            </Analogy>

            <Analogy label="The Surprise Jumps — Emergence">
                Here is where things get strange. Scaling laws predict that as you add more
                brainpower, the AI gets smoothly and gradually smarter — like a plant growing
                taller by the same fraction each day. But for some skills, that is not what
                happens. Below a certain brain size, the AI is completely hopeless at a task.
                Then suddenly — as if a switch flipped — it can do it perfectly.
                <br /><br />
                Researchers call this "emergence." Doing multi-step arithmetic, reasoning through
                a logic puzzle, translating rare languages — these abilities appear suddenly at a
                threshold, without warning from the smooth loss curve. The power law describes
                the loss number, but it does not predict when a new ability will suddenly appear.
                Scientists are still arguing about whether emergence is real or a trick of how
                we measure things.
            </Analogy>

            <Analogy label="Why This Changed Everything">
                Before scaling laws, AI research felt like alchemy — mix ingredients, hope
                something works. After scaling laws, it felt like engineering. You could write
                down an equation, plug in your compute budget, and get a prediction for how good
                your model would be. You could decide in advance whether a training run was worth
                running.
                <br /><br />
                The Chinchilla correction made this even more practical. Because smaller models
                are cheaper to run after training, labs discovered that a Chinchilla-optimal model
                was not just better during training — it was cheaper to use forever afterward.
                Scaling laws were the scientific foundation that turned AI from a creative art into
                a predictable engineering discipline.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of predictable scale</h2>

            <h3>Power Law for Model Size</h3>
            <p>
                When training data is held plentiful and model size N (non-embedding parameters)
                varies, test loss follows a power law across at least seven orders of magnitude.
                The Kaplan et al. (2020) fit:
            </p>
            <MathBlock tex="L(N) = \Bigl(\frac{N_c}{N}\Bigr)^{\alpha_N} + L_{\infty}" />
            <p>
                Where N<sub>c</sub> &#8776; 8.8 &#215; 10<sup>13</sup> non-embedding parameters,
                &#945;<sub>N</sub> &#8776; 0.076, and L<sub>&#8734;</sub> &#8776; 1.69 nats is the
                estimated irreducible entropy of English text. The law holds as long as N is much
                smaller than the data (so the model is the bottleneck). As N grows, the power-law
                term shrinks and performance asymptotes toward L<sub>&#8734;</sub>.
            </p>

            <h3>Power Law for Dataset Size</h3>
            <p>
                With model size fixed and training tokens D varied:
            </p>
            <MathBlock tex="L(D) = \Bigl(\frac{D_c}{D}\Bigr)^{\alpha_D} + L_{\infty}" />
            <p>
                Where &#945;<sub>D</sub> &#8776; 0.095. Because &#945;<sub>D</sub> &gt;
                &#945;<sub>N</sub>, each doubling of training tokens reduces loss more than each
                doubling of parameters (per FLOP invested). Eventually the model becomes the
                bottleneck: below a capacity threshold, adding data no longer helps.
            </p>

            <h3>Compute-Optimal Allocation</h3>
            <p>
                A training run with N parameters over D tokens costs approximately C &#8776; 6ND
                FLOPs (forward plus backward pass). Minimizing L subject to the constraint C =
                6ND gives the optimal split. Kaplan et al. found:
            </p>
            <MathBlock tex="N_{\text{opt}}(C) \propto C^{0.73} \qquad D_{\text{opt}}(C) \propto C^{0.27}" />
            <p>
                This prescription says: for every 10&times; increase in compute budget, multiply
                parameters by &#8776;5&times; but only multiply training tokens by &#8776;2&times;.
                It implied large, undertrained models were the compute-efficient frontier. Chinchilla
                (2022) showed this was wrong because Kaplan's runs had not reached convergence —
                the corrected exponents are approximately 0.49 and 0.51, close to equal scaling.
            </p>

            <h3>The Chinchilla Correction</h3>
            <p>
                Hoffmann et al. (2022) refit the scaling laws using runs trained to convergence.
                The result was a dramatically different optimal ratio:
            </p>
            <MathBlock tex="N_{\text{opt}} \approx \frac{C}{120} \qquad D_{\text{opt}} \approx 20 \cdot N_{\text{opt}}" />
            <p>
                The "20 tokens per parameter" rule of thumb encodes Chinchilla's finding: compute-
                optimal models need roughly 20 training tokens for every parameter, not the
                &#8776;1.7 tokens-per-parameter that GPT-3 used. At 175B parameters, GPT-3
                would need &#8776;3.5T training tokens to be Chinchilla-optimal; it was trained
                on 300B.
            </p>

            <h3>Emergence: When the Power Law Misleads</h3>
            <p>
                The power laws predict smooth improvement in cross-entropy loss. But many
                downstream task metrics are discontinuous: accuracy on arithmetic is 0% until the
                model can reliably carry digits, then jumps toward 100%. Wei et al. (2022) found
                137 tasks in BIG-Bench with emergent behavior — near-random below a compute
                threshold, then suddenly near-human. The threshold for most emergent tasks
                corresponds to roughly 10<sup>22</sup>–10<sup>23</sup> training FLOPs.
            </p>
            <p>
                One explanation: the loss curve is smooth, but capabilities require multiple
                sub-skills to all reach threshold simultaneously. Each sub-skill improves smoothly,
                but their conjunction — the task — improves as a step function when the last
                sub-skill crosses its individual threshold.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Practical rule of thumb:</strong> For any new training run, estimate your
                compute budget C in FLOPs (C &#8776; 6 &#215; params &#215; tokens). Apply
                Chinchilla: set N &#8776; C / 120 and D &#8776; 20N. If you need the model to
                be small for inference, train a smaller N on proportionally more D — you trade
                training efficiency for inference efficiency, and data is cheap relative to
                compute.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations &middot; proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation &middot; NumPy</span>
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
            <h2>Power-law derivations and compute budgeting</h2>

            <DefBlock label="The Joint Scaling Law">
                Kaplan et al. fit a joint function for loss as a function of both parameters N
                and data D simultaneously, not just individually:
            </DefBlock>
            <MathBlock tex="L(N, D) = \Bigl[\Bigl(\frac{N_c}{N}\Bigr)^{\frac{\alpha_N}{\alpha_D}} + \frac{D_c}{D}\Bigr]^{\alpha_D}" />
            <p>
                This formula reduces correctly to L(N) as D &#8594; &#8734; and to L(D) as N
                &#8594; &#8734;. It predicts that there is a specific N for which adding more data
                is useless (the model saturates), and vice versa. The joint form allows one to
                read off the bottleneck: if &#8706;L/&#8706;N &lt; &#8706;L/&#8706;D at current
                N and D, add more parameters; otherwise add more data.
            </p>

            <h3>Compute Cost Identity</h3>
            <p>
                For a decoder-only transformer, the dominant compute cost is the matrix
                multiplications in attention and feed-forward layers. Per token, the FLOPs are
                approximately 2N (forward) + 4N (backward) = 6N. Total training cost:
            </p>
            <MathBlock tex="C \approx 6 N D" />
            <p>
                This identity links the three resources. Given any two, the third is determined.
                It also bounds inference cost: generating one token from an N-parameter model
                costs &#8776;2N FLOPs, making inference proportional to parameter count.
            </p>

            <h3>Lagrangian Derivation of Compute-Optimal Split</h3>
            <p>
                To minimize L(N, D) subject to C = 6ND, form the Lagrangian:
            </p>
            <MathBlock tex="\mathcal{L}(N, D, \lambda) = L(N, D) + \lambda(6ND - C)" />
            <p>
                Setting &#8706;&#8466;/&#8706;N = 0 and &#8706;&#8466;/&#8706;D = 0 and solving
                the resulting power-law equations gives:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial N} / \frac{\partial L}{\partial D} = \frac{D}{N}" />
            <p>
                Substituting the power-law gradients and solving yields the Kaplan exponents
                (0.73 / 0.27) or the Chinchilla exponents (0.49 / 0.51) depending on which
                dataset of training runs is used to estimate &#945;<sub>N</sub> and &#945;<sub>D</sub>.
                The difference traces entirely to whether the training runs reached convergence.
            </p>

            <h3>Chinchilla Regression</h3>
            <p>
                Hoffmann et al. fitted three approaches to the convergence data. Approach 3 (IsoFLOP
                profiles) gave the tightest estimates. For each fixed C, they found the N that
                minimized L, then fit a power law through those optima:
            </p>
            <MathBlock tex="N_{\text{opt}} = a \cdot C^{b} \quad \text{with } a \approx 0.003 \text{ and } b \approx 0.49" />
            <p>
                The result: optimal tokens-per-parameter ratio grows very slowly with scale, but
                is approximately 20 across the range C = 10<sup>19</sup> to 10<sup>24</sup> FLOPs.
                The 20-tokens-per-parameter rule is thus an approximation that is useful for
                practical planning within roughly one order of magnitude of current frontier models.
            </p>

            <div className="ch-callout">
                <strong>Why the exponent matters:</strong> The difference between Kaplan's
                &#945;<sub>N</sub> = 0.076 and &#945;<sub>D</sub> = 0.095 is small but decisive.
                It means data is &#8776;25% more efficient per FLOP than parameters at the margin.
                The Chinchilla correction amplified this: when runs were trained to convergence,
                the data exponent grew relative to the parameter exponent, flipping the compute-
                optimal allocation from "mostly parameters" to "equally both." Measurement
                methodology — specifically whether training runs reach convergence — can change
                the scientific conclusion entirely.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Kaplan Scaling Law Estimates ──────────────────────────────────────────────

def loss_from_params(N, Nc=8.8e13, alpha_N=0.076, L_inf=1.69):
    """Estimate cross-entropy test loss from non-embedding parameter count."""
    return (Nc / N) ** alpha_N + L_inf

def loss_from_data(D, Dc=5.4e13, alpha_D=0.095, L_inf=1.69):
    """Estimate cross-entropy test loss from training token count."""
    return (Dc / D) ** alpha_D + L_inf

# ── Chinchilla Compute-Optimal Allocation ────────────────────────────────────

def chinchilla_optimal(C, a=0.003, b=0.49, tokens_per_param=20):
    """
    Given a compute budget C (FLOPs), return Chinchilla-optimal N and D.
    C ≈ 6 * N * D  =>  D ≈ C / (6 * N)
    """
    N_opt = a * (C ** b)
    D_opt = tokens_per_param * N_opt
    return N_opt, D_opt

def kaplan_optimal(C, tau=6):
    """Kaplan 2020 prescription: N grows faster than D."""
    # N_opt ∝ C^0.73, D_opt ∝ C^0.27
    # From C = tau * N * D:
    # We parameterize as N = k * C^0.73 for some constant k
    # Here we just return ratio for illustration
    N_opt = (C / tau) ** 0.73 * 0.01  # approximate constant
    D_opt = C / (tau * N_opt)
    return N_opt, D_opt

# ── Demo: Compare Kaplan vs Chinchilla for GPT-3 compute budget ───────────────
C_gpt3 = 3.14e23  # approximate FLOPs for GPT-3

N_chinchilla, D_chinchilla = chinchilla_optimal(C_gpt3)
N_actual_gpt3 = 175e9
D_actual_gpt3 = 300e9

print("Scaling Law Comparison for GPT-3 Compute Budget")
print("=" * 50)
print(f"Compute budget: {C_gpt3:.2e} FLOPs")
print()
print(f"Actual GPT-3:           N = {N_actual_gpt3:.2e}, D = {D_actual_gpt3:.2e}")
print(f"Chinchilla-optimal:     N = {N_chinchilla:.2e}, D = {D_chinchilla:.2e}")
print()

print("Loss vs Model Size (Kaplan power law)")
print("-" * 40)
for N in [1e9, 7e9, 70e9, 175e9, 540e9]:
    L = loss_from_params(N)
    print(f"  N = {N:.0e}  =>  L ~ {L:.3f} nats")

print()
print("Loss vs Dataset Size (Kaplan power law)")
print("-" * 40)
for D in [1e10, 1e11, 3e11, 1e12, 3e12]:
    L = loss_from_data(D)
    print(f"  D = {D:.0e}  =>  L ~ {L:.3f} nats")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of the Kaplan and Chinchilla scaling law formulas: estimate
                test loss from model size or dataset size, compute the Chinchilla-optimal parameter
                and token allocation for a given FLOP budget, and compare GPT-3's actual training
                configuration against the compute-optimal prescription.
            </p>
            <CodeBlock code={PY_CODE} filename="scaling_laws.py" lang="python" langLabel="Python" />
        </>
    )
}


// ── Tab content map ───────────────────────────────────────────────────────────

export const SCALING_LAWS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
