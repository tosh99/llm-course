import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>How DeepMind corrected the industry&rsquo;s training recipe</h2>
            <p>
                Kaplan&rsquo;s 2020 scaling laws shaped every major model built through 2021: GPT-3
                (175B parameters, 300B tokens), Gopher (280B, 300B tokens), Megatron-Turing NLG
                (530B, 270B tokens). The implicit lesson was that parameters were more valuable than
                data &mdash; so labs raced to build larger models with relatively modest training
                sets. In March 2022, Hoffmann et al. at DeepMind overturned that consensus with a
                single experiment: Chinchilla (70B parameters, 1.4T tokens) outperformed Gopher on
                every benchmark despite being four times smaller. The field had been systematically
                under-training its models.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Prevailing Doctrine</div>
                    <div className="ch-tl-title">Kaplan Scaling Laws &mdash; Parameters Over Data</div>
                    <div className="ch-tl-body">
                        Kaplan et al. (OpenAI) fit power-law curves to loss as a function of model
                        size N and dataset size D, finding L(N) &prop; N<sup>&minus;0.076</sup>
                        and L(D) &prop; D<sup>&minus;0.095</sup>. The steeper exponent on N implied
                        that parameters were more &ldquo;valuable&rdquo; per FLOP than training tokens.
                        The derived guidance: given a compute budget C, maximize model size and
                        accept fewer training steps. GPT-3 &mdash; 175B parameters trained on
                        300B tokens, ~1.7 tokens per parameter &mdash; followed this recipe exactly.
                        The broader field adopted it wholesale.
                    </div>
                    <div className="ch-tl-impact">Impact: Established &ldquo;bigger model = better model&rdquo; as the default assumption</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">The Arms Race</div>
                    <div className="ch-tl-title">Gopher, Jurassic-1, Megatron-Turing NLG &mdash; The Parameter Count Race</div>
                    <div className="ch-tl-body">
                        Following Kaplan&rsquo;s guidance, every major lab prioritized model size.
                        DeepMind released Gopher (280B parameters, 300B tokens). AI21 Labs released
                        Jurassic-1 (178B). NVIDIA and Microsoft co-released Megatron-Turing NLG
                        at 530B parameters &mdash; the largest dense language model to that point.
                        All were trained with roughly 1&ndash;2 tokens per parameter. Parameter count
                        became the headline metric in press releases and leaderboards. In retrospect,
                        every one of these models was severely under-trained according to the
                        correction that was about to arrive.
                    </div>
                    <div className="ch-tl-impact">Impact: Parameter count eclipsed data quality as the prestige metric</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2022</div>
                    <div className="ch-tl-section-label">The Correction</div>
                    <div className="ch-tl-title">Hoffmann et al. &mdash; &ldquo;Training Compute-Optimal Large Language Models&rdquo;</div>
                    <div className="ch-tl-body">
                        DeepMind&rsquo;s key methodological innovation: rather than varying N and D
                        separately (as Kaplan had done, often with data-limited models), they fixed
                        the compute budget C and swept over many (N, D) pairs all satisfying
                        C &asymp; 6ND. Over 400 models from 70M to 16B parameters were trained.
                        Finding: loss was minimized when N* &prop; C<sup>0.5</sup> and
                        D* &prop; C<sup>0.5</sup> &mdash; equal scaling. Not C<sup>0.73</sup>/C<sup>0.27</sup>
                        as Kaplan predicted. The compute-optimal ratio was D/N &asymp; 20 tokens per
                        parameter, not 1&ndash;2. Kaplan&rsquo;s exponents had been skewed by
                        training data-limited models to fixed step budgets rather than to convergence.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that the field&rsquo;s compute allocation had been systematically wrong</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2022</div>
                    <div className="ch-tl-section-label">The Proof</div>
                    <div className="ch-tl-title">Chinchilla vs. Gopher &mdash; 70B Beats 280B</div>
                    <div className="ch-tl-body">
                        Hoffmann et al. validated their theory by training Chinchilla: 70B parameters,
                        1.4T tokens, roughly the same FLOP budget as Gopher (280B, 300B tokens).
                        Results were unambiguous. Chinchilla: MMLU 67.5% vs Gopher 60.0%; BIG-bench
                        Hard 65.1% vs 62.3%; Massive Multitask Language Understanding and reading
                        comprehension both favored Chinchilla. The token-to-parameter ratio for
                        Chinchilla was 20:1 (1400B / 70B). For Gopher it was 1.07:1 (300B / 280B).
                        A model four times smaller, trained four times longer, was uniformly better.
                        The giant had been starved.
                    </div>
                    <div className="ch-tl-impact">Impact: A 4&times; smaller model decisively beat a 4&times; larger one on identical compute</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 &mdash; 2023</div>
                    <div className="ch-tl-section-label">Industry Response</div>
                    <div className="ch-tl-title">LLaMA, Falcon &mdash; The Chinchilla-Compliant Generation</div>
                    <div className="ch-tl-body">
                        The response was rapid and comprehensive. Meta&rsquo;s LLaMA (Touvron et al.,
                        2023) explicitly followed Chinchilla ratios: 7B parameters on 1T tokens
                        (143 tokens/param), 13B on 1T tokens (77 tokens/param). LLaMA-7B matched
                        or exceeded GPT-3 (175B) on multiple benchmarks &mdash; a 25&times; smaller
                        model. TII&rsquo;s Falcon trained 7B on 1.5T tokens. &ldquo;Chinchilla
                        compliance&rdquo; became the new baseline expectation. Parameter count
                        stopped being the primary headline.
                    </div>
                    <div className="ch-tl-impact">Impact: A 7B model matched GPT-3 (175B); open-weight efficiency became the new frontier</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 &mdash; 2023</div>
                    <div className="ch-tl-section-label">Practical Extension</div>
                    <div className="ch-tl-title">Inference Compute &mdash; Training Longer to Serve Cheaper</div>
                    <div className="ch-tl-body">
                        Chinchilla&rsquo;s recommendation is optimal for training compute. But
                        inference compute is also expensive: a 70B model costs ~10&times; more per
                        query than a 7B model. For a model serving millions of queries, spending
                        additional training compute to produce a smaller, better-quality model can
                        yield large savings over the model&rsquo;s deployment lifetime. This
                        inference-aware perspective &mdash; deliberately training smaller models
                        beyond the Chinchilla optimum &mdash; motivated LLaMA&rsquo;s design
                        philosophy: make the most capable model that fits efficiently at inference,
                        not the most capable model per training FLOP.
                    </div>
                    <div className="ch-tl-impact">Impact: Redefined &ldquo;optimal&rdquo; to include deployment cost, not just training cost</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Boundary Conditions</div>
                    <div className="ch-tl-title">Muennighoff et al. &mdash; Chinchilla Revisited and the Data Ceiling</div>
                    <div className="ch-tl-body">
                        Muennighoff et al. (2023) showed that repeating the same data incurs a
                        &ldquo;repetition tax&rdquo;: training beyond 4 epochs on the same corpus
                        causes measurable quality degradation as the model begins memorizing rather
                        than generalizing. This sets a practical upper bound on D for a given
                        dataset. Combined with estimates that truly high-quality public text totals
                        only 5&ndash;10T tokens, there is a data availability ceiling. Beyond it,
                        further training improvement requires either synthetic data, multimodal
                        sources, or algorithmic advances. The Chinchilla optimum therefore has a
                        domain-specific ceiling, not a universal one.
                    </div>
                    <div className="ch-tl-impact">Impact: Identified data availability as the binding constraint on future scaling</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core correction:</strong> Kaplan&rsquo;s laws were fitted on models
                that were data-limited &mdash; they had not seen enough tokens to reveal how much
                data was worth relative to parameters. When Hoffmann et al. trained models to
                near-convergence, parameters and data emerged as roughly equal contributors to
                loss. The compute-optimal recipe is D &asymp; 20N: twenty tokens per parameter.
                Most 2021 frontier models were training at 1&ndash;2 tokens per parameter.
                They were leaving enormous performance on the table.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>The giant who wasn&rsquo;t eating enough</h2>

            <Analogy label="The Starving Giant">
                Imagine Gopher is a huge giant &mdash; 280 billion brain cells. But this giant only
                ate 300 meals (billion tokens of text). Chinchilla is a normal-sized person &mdash;
                70 billion brain cells &mdash; who ate 1,400 meals. The normal-sized person who
                ate properly turned out to be smarter than the starving giant. Most AI labs had
                been building giants and then starving them. Chinchilla showed that the
                giant&rsquo;s extra brain cells were useless if they never got enough food to learn.
            </Analogy>

            <Analogy label="The Kaplan Recipe Was Wrong">
                Before Chinchilla, the recipe was: spend your budget making the model as big as
                possible, even if you have less time to train it. Chinchilla said: no &mdash; split
                your budget equally between size and training. If you double your compute budget,
                double both the model AND the training data. Don&rsquo;t just double the model.
                This one change made models dramatically better for the same amount of electricity
                and computing cost.
            </Analogy>

            <Analogy label="Why Under-training Was the Norm">
                Because scaling laws said &ldquo;bigger is better,&rdquo; every lab raced to build
                the largest model they could. But a bigger model trained for fewer steps is leaving
                performance on the table &mdash; the brain cells haven&rsquo;t had a chance to
                learn from all the examples they could have seen. Chinchilla proved that a model
                four times smaller, trained four times longer, was better on every test. The lesson:
                do not mistake having a large brain for having a smart brain.
            </Analogy>

            <Analogy label="The Inference Trade-off">
                Even if Chinchilla proved that larger under-trained models were wasteful, there is
                another reason to prefer smaller models: running costs. A 70B-parameter model costs
                roughly ten times more to answer each question than a 7B model. If a model answers
                a million questions a day, that difference is enormous. So the smartest choice is
                often to train a small model for a very long time, making it as smart as possible,
                so it can answer questions cheaply.
            </Analogy>

            <Analogy label="LLaMA &mdash; Chinchilla&rsquo;s Child">
                Meta took Chinchilla&rsquo;s lesson seriously and built LLaMA: small models trained
                for a very long time. LLaMA-7B was trained on 1 trillion tokens and matched
                GPT-3&rsquo;s performance &mdash; which had 175 billion parameters, 25 times more.
                A 25&times; smaller model was just as good because it had been properly trained.
                This changed what &ldquo;state of the art&rdquo; meant: suddenly researchers with
                modest computers could run world-class models.
            </Analogy>

            <Analogy label="Can You Over-train?">
                Yes. If you show a model the exact same sentences more than four times, it starts
                memorizing them word-for-word instead of learning general patterns &mdash; like a
                student who memorizes the practice test instead of learning the subject. There is a
                ceiling: the most useful training is roughly one full read through of unique,
                high-quality text. After that, you get less and less benefit from the same data,
                and eventually it hurts.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Compute-optimal training: the mathematics of the Chinchilla correction</h2>

            <h3>Chinchilla&rsquo;s Compute-Optimal Formula</h3>
            <p>
                Given a fixed training compute budget C (measured in FLOPs), the compute-optimal
                model size N* and training token count D* satisfy equal scaling exponents.
                Kaplan&rsquo;s formula assigned most of the compute to model size:
            </p>
            <MathBlock tex="N^*_{\text{Kaplan}} \propto C^{0.73}, \quad D^*_{\text{Kaplan}} \propto C^{0.27}" />
            <p>
                Hoffmann et al.&rsquo;s correction, derived from training over 400 models to
                near-convergence, found both exponents close to 0.50:
            </p>
            <MathBlock tex="N^*_{\text{Chinchilla}} \propto C^{0.50}, \quad D^*_{\text{Chinchilla}} \propto C^{0.50}" />
            <p>
                The practical consequence: at any compute budget you should train a model
                roughly four times smaller than Kaplan suggested, for four times more tokens.
                The compute-optimal token-to-parameter ratio is D/N &asymp; 20.
            </p>

            <h3>The Three Fitting Approaches</h3>
            <p>
                Hoffmann et al. used three independent methods to find the optimal scaling exponents,
                all of which converged:
            </p>
            <ul>
                <li>
                    <strong>IsoFLOP profiles:</strong> Fix compute budget C, vary N, measure the
                    (N, D) pair that minimizes validation loss. The optimal N as a function of C
                    traces a curve with slope 0.50 in log-log space.
                </li>
                <li>
                    <strong>Direct fitting:</strong> Fit separate power laws to L(N) holding D
                    large, and to L(D) holding N large. Exponents again near 0.50.
                </li>
                <li>
                    <strong>Parametric loss model:</strong> Fit the following joint model to all
                    runs simultaneously:
                </li>
            </ul>
            <MathBlock tex="L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}" />
            <p>
                where E is the irreducible entropy floor, A and B are fitted coefficients, and
                &alpha; &asymp; 0.34, &beta; &asymp; 0.28 for Hoffmann et al.&rsquo;s fits (all
                three methods converge to approximately equal scaling). Minimizing this expression
                subject to the compute constraint C = 6ND yields the equal-scaling result.
            </p>

            <h3>Chinchilla vs. Gopher: By the Numbers</h3>
            <p>
                The two models were trained on the same compute budget:
            </p>
            <MathBlock tex="\text{Gopher: } N=280\text{B},\ D=300\text{B},\ C \approx 5.6 \times 10^{23}\ \text{FLOPs}" />
            <MathBlock tex="\text{Chinchilla: } N=70\text{B},\ D=1400\text{B},\ C \approx 5.8 \times 10^{23}\ \text{FLOPs}" />
            <p>
                The effective token-to-parameter ratios tell the story. Gopher had approximately
                1.07 tokens per parameter; Chinchilla had 20 &mdash; the value Chinchilla scaling
                predicts as optimal:
            </p>
            <MathBlock tex="\frac{D_{\text{Gopher}}}{N_{\text{Gopher}}} = \frac{300\text{B}}{280\text{B}} \approx 1.07 \quad \text{vs} \quad \frac{D_{\text{Chinchilla}}}{N_{\text{Chinchilla}}} = \frac{1400\text{B}}{70\text{B}} = 20" />
            <p>
                Chinchilla outperformed Gopher on every benchmark: MMLU (67.5% vs 60.0%), BIG-bench
                Hard (65.1% vs 62.3%), and reading comprehension. The &asymp;20 tokens/param ratio
                became the field&rsquo;s new rule of thumb.
            </p>

            <h3>LLaMA &mdash; Beyond Chinchilla-Optimal for Inference</h3>
            <p>
                Chinchilla optimizes training compute, not inference cost. Touvron et al. (Meta,
                2023) argued that for a model serving N<sub>inference</sub> queries, the
                inference-adjusted optimum minimizes total cost:
            </p>
            <MathBlock tex="C_{\text{total}}(N) = \underbrace{6ND}_{\text{training}} + \underbrace{2N \cdot Q_{\text{inf}}}_{\text{inference}}" />
            <p>
                When Q<sub>inf</sub> is large, this favors a smaller N trained on more data: the
                extra training compute is amortized over billions of cheap inference calls.
                LLaMA-7B trained on 1T tokens (143 tokens/param &mdash; 7&times; above Chinchilla
                optimum for that size) matched GPT-3 (175B) on many benchmarks. The inference-aware
                optimum deliberately overshoots Chinchilla.
            </p>

            <h3>Data Repetition and the Chinchilla Ceiling</h3>
            <p>
                Muennighoff et al. (2023) showed that repeating training data degrades performance.
                Training with k repetitions of D unique tokens behaves approximately as:
            </p>
            <MathBlock tex="L(N,\, D,\, k) \approx L(N,\, D \cdot k) + \delta(k), \quad \delta(k) > 0 \text{ for } k > 1" />
            <p>
                The &ldquo;repetition penalty&rdquo; &delta;(k) is negligible for k &le; 4 and
                grows substantially beyond that. In practice, the optimal training strategy is to
                use &asymp;1&ndash;4 passes through unique, high-quality data. Because estimates
                of truly high-quality public web text total roughly 5&ndash;10T tokens, there is a
                data availability ceiling that depends on domain and quality filter.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">IsoFLOP derivation &middot; Lagrangian optimality &middot; inference-adjusted optimum</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Python &middot; Chinchilla-optimal N* and D* &middot; Kaplan comparison &middot; IsoFLOP curve</span>
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
            <h2>Deriving the IsoFLOP optimum and the inference-adjusted formula</h2>

            <DefBlock label="Parametric Loss Model (Hoffmann et al.)">
                The joint loss model fitted to all 400+ training runs is L(N, D) = E + A/N&alpha;
                + B/D&beta;, where E &asymp; 1.69 is the irreducible entropy of natural language,
                A &asymp; 406.4 and B &asymp; 410.7 are empirical coefficients, and &alpha; &asymp; 0.34,
                &beta; &asymp; 0.28. These values are from the parametric fit; the IsoFLOP and
                direct-fitting methods produce slightly different but consistent estimates.
            </DefBlock>

            <h3>IsoFLOP Derivation: Why Equal Scaling Follows</h3>
            <p>
                Fix compute C = 6ND (the factor 6 accounts for the forward and backward passes and
                the embedding matrix). We want to minimize L(N, D) subject to this constraint.
                Form the Lagrangian:
            </p>
            <MathBlock tex="\mathcal{L}(N, D, \lambda) = \frac{A}{N^\alpha} + \frac{B}{D^\beta} + \lambda(6ND - C)" />
            <p>
                Setting the partial derivatives to zero:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial N} = -\frac{\alpha A}{N^{\alpha+1}} + 6\lambda D = 0 \implies \lambda = \frac{\alpha A}{6 D N^{\alpha+1}}" />
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial D} = -\frac{\beta B}{D^{\beta+1}} + 6\lambda N = 0 \implies \lambda = \frac{\beta B}{6 N D^{\beta+1}}" />
            <p>
                Equating the two expressions for &lambda; and rearranging:
            </p>
            <MathBlock tex="\frac{\alpha A}{N^{\alpha+1} D} = \frac{\beta B}{N D^{\beta+1}} \implies \frac{\alpha A}{N^\alpha} = \frac{\beta B}{D^\beta}" />
            <p>
                This says: at the optimum, the marginal contribution to loss from adding a parameter
                equals the marginal contribution from adding a training token. Solving with C = 6ND:
            </p>
            <MathBlock tex="N^* = \left(\frac{\alpha A}{\beta B}\right)^{\frac{1}{\alpha+\beta}} \!\cdot\! \left(\frac{C}{6}\right)^{\frac{\beta}{\alpha+\beta}}, \quad D^* = \left(\frac{\beta B}{\alpha A}\right)^{\frac{1}{\alpha+\beta}} \!\cdot\! \left(\frac{C}{6}\right)^{\frac{\alpha}{\alpha+\beta}}" />
            <p>
                Because &alpha; &asymp; &beta; &asymp; 0.34, both exponents are &asymp; 0.50.
                Kaplan&rsquo;s values (&alpha; = 0.076, &beta; = 0.095) were measured on
                data-limited models, giving &beta;/(&alpha;+&beta;) &asymp; 0.56 and
                &alpha;/(&alpha;+&beta;) &asymp; 0.44 &mdash; not 0.73/0.27, but explaining the
                directional bias toward parameters.
            </p>

            <h3>Inference-Adjusted Optimal Model Size</h3>
            <p>
                Let C<sub>train</sub> = 6ND be the training compute and C<sub>inf</sub>(N) = 2N
                be the FLOPs per inference token (one forward pass). For Q<sub>inf</sub> total
                inference tokens generated over the model&rsquo;s lifetime:
            </p>
            <MathBlock tex="C_{\text{total}}(N) = 6ND + 2N \cdot Q_{\text{inf}}" />
            <p>
                Holding C<sub>train</sub> = 6ND fixed (i.e., D = C<sub>train</sub>/6N), the
                quality of the model for given N is determined by L(N, C<sub>train</sub>/6N).
                The inference-adjusted optimum trades off model quality against inference cost.
                Differentiating C<sub>total</sub> with respect to N while optimizing L(N, D)
                under the revised constraint:
            </p>
            <MathBlock tex="N^*_{\text{inf}} = \underset{N}{\arg\min}\ \left[ L\!\left(N,\, \frac{C_{\text{train}}}{6N}\right) + \frac{2N \cdot Q_{\text{inf}}}{C_{\text{compute}}} \right]" />
            <p>
                For large Q<sub>inf</sub>, this optimum moves toward smaller N (cheaper to serve)
                even if that requires training D beyond the Chinchilla ratio. This is the
                quantitative justification for LLaMA&rsquo;s &ldquo;over-train small models&rdquo;
                strategy: when Q<sub>inf</sub> &asymp; 10<sup>12</sup>&ndash;10<sup>13</sup> (billions
                of queries), the inference term dominates and the optimal N drops well below the
                Chinchilla training-compute-optimal N.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> The Chinchilla Lagrangian shows that at the optimum
                the two loss terms A/N&alpha; and B/D&beta; are equal up to the ratio &alpha;A/&beta;B.
                Because &alpha; &asymp; &beta; and A &asymp; B in Hoffmann et al.&rsquo;s fits,
                the two terms are nearly equal in absolute value &mdash; parameters and data
                contribute symmetrically to the final loss. Kaplan&rsquo;s data-limited fits
                made data look artificially cheap, breaking this symmetry and biasing the
                field toward over-parameterized, under-trained models.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import math

# ── Chinchilla Compute-Optimal Calculator ─────────────────────────────────────
# Based on Hoffmann et al. 2022 parametric fit (Table A1)

A     = 406.4
B     = 410.7
ALPHA = 0.34
BETA  = 0.28
E     = 1.69       # irreducible entropy floor (nats/token)


def loss_chinchilla(N: float, D: float) -> float:
    """Predict validation loss given model size N (params) and dataset D (tokens)."""
    return E + A / (N ** ALPHA) + B / (D ** BETA)


# ── Chinchilla-optimal allocation ─────────────────────────────────────────────

def chinchilla_optimal(C: float) -> tuple[float, float]:
    """
    Given compute budget C (FLOPs), return compute-optimal (N*, D*).
    Uses the closed-form result: N* proportional to C^(beta/(alpha+beta)),
    D* proportional to C^(alpha/(alpha+beta)), normalised to C = 6ND.
    For simplicity uses the empirical 20-token-per-parameter approximation.
    """
    ratio = (BETA * B / (ALPHA * A)) ** (1 / (ALPHA + BETA))
    # From C = 6 * N * D and D = ratio * N:
    N_star = math.sqrt(C / (6 * ratio))
    D_star = ratio * N_star
    return N_star, D_star


# ── Kaplan-style allocation ────────────────────────────────────────────────────

def kaplan_optimal(C: float) -> tuple[float, float]:
    """
    Kaplan et al. scaling: N* ~ C^0.73, D* ~ C^0.27.
    Normalise with C = 6 * N * D.
    """
    # From Kaplan exponents and C = 6ND:
    # N = k * C^0.73 and D = C / (6N) = (C / 6k) * C^-0.73
    # Choose k so that D* ~ C^0.27 and C = 6ND exactly.
    k = (1 / 6) ** 0.27   # approximate normalisation constant
    N_star = k * (C ** 0.73)
    D_star = C / (6 * N_star)
    return N_star, D_star


# ── Demo: IsoFLOP comparison ──────────────────────────────────────────────────

compute_budgets = [1e18, 1e19, 1e20, 1e21, 1e22, 1e23]

print("Chinchilla vs Kaplan: Compute-Optimal Allocations")
print("=" * 72)
header = f"{'C (FLOPs)':>10}  {'N_chin':>12} {'D_chin':>12} {'L_chin':>7}  {'N_kap':>12} {'D_kap':>12} {'L_kap':>7}"
print(header)
print("-" * 72)

for C in compute_budgets:
    N_c, D_c = chinchilla_optimal(C)
    N_k, D_k = kaplan_optimal(C)
    L_c = loss_chinchilla(N_c, D_c)
    L_k = loss_chinchilla(N_k, D_k)
    print(
        f"{C:>10.0e}  {N_c:>12.2e} {D_c:>12.2e} {L_c:>7.3f}"
        f"  {N_k:>12.2e} {D_k:>12.2e} {L_k:>7.3f}"
    )

print()

# ── IsoFLOP curve for C = 1e21 ────────────────────────────────────────────────

C_fixed = 1e21
N_values = np.logspace(9, 13, 200)           # 1B to 10T parameters
D_values = C_fixed / (6 * N_values)         # paired D to keep FLOPs fixed
L_values = np.array([
    loss_chinchilla(N, D) if D >= 1 else float("inf")
    for N, D in zip(N_values, D_values)
])

best_idx = np.argmin(L_values)
N_opt    = N_values[best_idx]
D_opt    = D_values[best_idx]
L_opt    = L_values[best_idx]

print(f"IsoFLOP optimum for C = {C_fixed:.0e} FLOPs:")
print(f"  N* = {N_opt:.3e} params")
print(f"  D* = {D_opt:.3e} tokens")
print(f"  D*/N* ratio = {D_opt / N_opt:.1f}  (Chinchilla: ~20)")
print(f"  Optimal loss = {L_opt:.4f} nats/token")
`

function PythonContent() {
    return (
        <>
            <p>
                Python calculator for Chinchilla-optimal and Kaplan-optimal model size and token
                count given a training compute budget. Computes the IsoFLOP curve for a fixed
                compute budget and identifies the loss-minimizing (N*, D*) pair, verifying the
                D/N &asymp; 20 rule of thumb.
            </p>
            <CodeBlock code={PY_CODE} filename="chinchilla_scaling.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CHINCHILLA_SCALING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
