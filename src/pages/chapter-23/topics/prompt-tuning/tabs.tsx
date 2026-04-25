import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning what to ask, not how to answer</h2>
            <p className="ch-story-intro">
                By mid-2021, researchers had established that enormous language models could be
                steered with remarkably few trainable parameters &mdash; adapter layers and LoRA
                had demonstrated this conclusively. But both methods still required access to the
                model&rsquo;s internal weight matrices. A parallel line of work asked a more
                radical question: what if you didn&rsquo;t touch the model at all, not even to
                insert thin bottleneck modules, and instead learned only what to prepend to the
                input? This idea &mdash; prompt tuning &mdash; pushed parameter efficiency to its
                logical extreme, training a handful of continuous embedding vectors while keeping
                every single weight in the model completely frozen.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">The Status Quo</div>
                    <div className="ch-tl-title">Hard Prompt Engineering as a Workaround</div>
                    <div className="ch-tl-body">
                        The first approach to zero-parameter adaptation was manual prompt engineering:
                        craft the right natural language instruction and hope the frozen model performs
                        the intended task. Brown et al.&rsquo;s GPT-3 paper demonstrated that models
                        could be steered by prepending a few examples in natural language &mdash;
                        few-shot in-context learning. But hard prompts were brittle: replacing a word
                        with a synonym could swing accuracy by 30 percentage points. Finding a good
                        hard prompt required domain expertise in &ldquo;model whispering&rdquo; rather
                        than machine learning, and the optimal English phrasing was constrained by the
                        vocabulary &mdash; the model could only be asked things expressible in human
                        language, not things expressible in the full continuous space of its embeddings.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the need for continuous, gradient-optimized prompts</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2021</div>
                    <div className="ch-tl-section-label">Precursor Method</div>
                    <div className="ch-tl-title">Li &amp; Liang &mdash; Prefix-Tuning</div>
                    <div className="ch-tl-body">
                        Li and Liang (June 2021) introduced prefix-tuning: trainable continuous prefix
                        vectors inserted into the key and value matrices of every Transformer attention
                        layer. For each layer l, the effective key and value matrices were augmented:
                        K<sub>l</sub> = concat(P<sub>K,l</sub>, W<sub>K</sub>h<sub>l</sub>) and
                        V<sub>l</sub> = concat(P<sub>V,l</sub>, W<sub>V</sub>h<sub>l</sub>). Unlike
                        hard prompts &mdash; discrete tokens constrained to English words &mdash;
                        prefix vectors were continuous and could be optimized directly by gradient
                        descent. Prefix-tuning outperformed hard prompts significantly because the
                        prefix injected task-specific bias at every Transformer layer, not just the
                        input, giving it expressive power proportional to model depth. The cost was
                        2 &times; L &times; k &times; d parameters, where L is the number of layers,
                        k the prefix length, and d the embedding dimension.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved continuous prompts can be gradient-optimized; inspired the simpler prompt tuning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2021</div>
                    <div className="ch-tl-section-label">Core Invention</div>
                    <div className="ch-tl-title">Lester et al. (Google) &mdash; The Power of Scale for Parameter-Efficient Prompt Tuning</div>
                    <div className="ch-tl-body">
                        Lester et al. simplified prefix-tuning to its absolute minimum. Instead of
                        inserting trainable vectors at every Transformer layer, they prepended a
                        small number of trainable &ldquo;soft tokens&rdquo; &mdash; k tokens, typically
                        k = 100 &mdash; only at the input embedding layer. No modifications to any
                        internal Transformer layer. No modifications to the model&rsquo;s weights.
                        The only trainable component was a soft prompt matrix P &isin; R<sup>k&times;d</sup>.
                        For T5-XXL with 11 billion parameters and embedding dimension d = 1,024: 100
                        soft tokens added 100 &times; 1,024 = 102,400 trainable parameters &mdash;
                        roughly 0.001% of the full model. On the SuperGLUE benchmark, this tiny
                        parameter set matched the accuracy of full model fine-tuning of T5-XXL, a
                        result that held only because the model was large enough to decode the
                        task-specific signal propagated from the input layer through all 24 Transformer
                        layers.
                    </div>
                    <div className="ch-tl-impact">Impact: 0.001% of parameters matches full fine-tuning at 11B scale &mdash; the efficiency frontier</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021&ndash;2022</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">What Do Soft Prompts Learn?</div>
                    <div className="ch-tl-body">
                        Lester et al. showed that initialization strategy significantly affected
                        convergence. Initializing soft prompt tokens from the embeddings of task-related
                        vocabulary words &mdash; for example, initializing a sentiment classifier&rsquo;s
                        soft tokens from the embeddings of &ldquo;positive&rdquo;, &ldquo;negative&rdquo;,
                        and &ldquo;review&rdquo; &mdash; converged faster and reached higher final accuracy
                        than random initialization, especially for small k. Qin &amp; Eisner (2021)
                        extended the interpretability analysis, showing that learned soft prompts encode
                        syntactic and semantic information about the task that can be decoded via nearest-
                        neighbor lookup in the embedding vocabulary &mdash; even though the soft tokens
                        are not themselves valid vocabulary entries and don&rsquo;t map to readable words.
                        The prompts were not arbitrary noise; they were structured representations of
                        the task.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that soft prompts are interpretable, structured task representations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Critical Finding</div>
                    <div className="ch-tl-title">Scale Dependence: Prompt Tuning Only Matches Fine-Tuning at Very Large Models</div>
                    <div className="ch-tl-body">
                        The most consequential finding from Lester et al.&rsquo;s experiments was a
                        sharp scale dependence. At 250 million parameters, prompt tuning achieved
                        roughly 72% of full fine-tuning accuracy on SuperGLUE. At 1 billion parameters,
                        the gap narrowed but remained significant. Only at 11 billion parameters did
                        prompt tuning become statistically indistinguishable from full fine-tuning.
                        The explanation: a soft prompt must communicate task identity through only
                        k &times; d dimensions prepended to the input. A small model lacks the capacity
                        to amplify and propagate this signal through its layers; a large model has
                        sufficient depth and width that even a subtle input-layer bias reaches all
                        parts of the computation fully resolved. This scale dependence directly
                        foreshadowed the emergent abilities discussion in Chapter 24: certain
                        capabilities exist only above a threshold model size, and the threshold is
                        determined by the capacity required to decode the relevant signal.
                    </div>
                    <div className="ch-tl-impact">Impact: Linked parameter-efficient adaptation directly to the science of model scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Wang et al. &mdash; Multi-Task Prompt Tuning (MPT)</div>
                    <div className="ch-tl-body">
                        Wang et al. asked how to support hundreds of tasks simultaneously with a
                        single frozen model. Their Multi-Task Prompt Tuning approach decomposed each
                        task&rsquo;s soft prompt into a shared meta-prompt plus a small task-specific
                        delta: p<sub>task</sub> = p<sub>shared</sub> + &Delta;p<sub>task</sub>. The
                        shared component captured cross-task knowledge common to all tasks; the delta
                        was a low-rank correction specific to each task. This reduced per-task storage
                        from k &times; d to only the delta &Delta;p<sub>task</sub>, enabling hundreds
                        of tasks to share a single frozen 11B-parameter model efficiently. Training
                        was multi-task from the start, with the shared prompt acting as a meta-
                        representation of general language capabilities, and task deltas fine-tuning
                        the direction of attention within that space.
                    </div>
                    <div className="ch-tl-impact">Impact: Extended prompt tuning to multi-task serving with shared frozen backbone</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Practical Reality</div>
                    <div className="ch-tl-title">Prompt Tuning in the API Era</div>
                    <div className="ch-tl-body">
                        As GPT-3 and GPT-4 moved to API-only access &mdash; where users can send
                        tokens but cannot touch embedding layers or inject activation-level prefixes
                        &mdash; traditional prompt tuning became impractical for proprietary models.
                        The concept, however, influenced how practitioners structured system prompts
                        and few-shot demonstration blocks: carefully chosen fixed text that steers
                        the model&rsquo;s behavior at inference time is the hard-prompt analogue of
                        what soft tokens accomplish in the continuous space. For open-weight models
                        such as LLaMA and Mistral, prompt tuning remained a viable option, particularly
                        when model weights needed to be kept frozen for compliance or deployment
                        constraints and the per-task budget allowed only embedding-level storage.
                    </div>
                    <div className="ch-tl-impact">Impact: Shaped API prompt design patterns; remains viable for open-weight models</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Prompt tuning shows that the entire task-specific
                signal can be compressed into the initial token positions. A frozen 11B-parameter
                model is powerful enough to amplify 102,400 trainable numbers prepended to its
                input into full task competence &mdash; but only because it has sufficient depth to
                propagate that signal without losing it. This is not a trick; it is evidence that
                language model representations are extraordinarily information-dense at large scales.
            </div>

            <Analogy label="What comes next &mdash; Emergent Abilities &amp; Chinchilla">
                The PEFT methods in this chapter &mdash; LoRA, adapters, prefix-tuning, prompt
                tuning &mdash; all share a common assumption: that the base model&rsquo;s capabilities
                are fixed, and adaptation only needs to steer existing knowledge. But Chapter 24
                raises a deeper question about what capabilities large models actually have and when
                they appear. Jason Wei and colleagues at Google discovered that certain abilities
                emerge suddenly as model scale increases &mdash; they are absent at 7B parameters
                and fully functional at 70B, with no gradual transition in between. And DeepMind&rsquo;s
                Chinchilla showed that most frontier models are dramatically under-trained for their
                size. Understanding when and why capabilities emerge changes how you think about
                which models to adapt and how much training data they actually need.
            </Analogy>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Teaching a frozen robot the right question to ask itself</h2>

            <Analogy label="Asking the Right Question Without Knowing the Answer">
                Prompt tuning doesn&rsquo;t teach the model new skills &mdash; it teaches the
                model to remember which skills to use for a given task. It&rsquo;s like writing
                a perfect opening sentence for a conversation that puts the model in exactly the
                right mindset before any real words are spoken. The &ldquo;opening sentence&rdquo;
                is just numbers, not words, but it works better than any English sentence could,
                because it&rsquo;s not constrained by what human language can say &mdash; it lives
                directly in the mathematical space the model thinks in.
            </Analogy>

            <Analogy label="100 Magic Tokens">
                The soft prompt is 100 extra &ldquo;words&rdquo; stuck in front of every input.
                These 100 words are not real words &mdash; they&rsquo;re vectors of numbers that
                gradient descent discovered by trial and error over thousands of training examples.
                They&rsquo;re invisible to humans (you can&rsquo;t read them like a sentence) but
                serve as powerful instructions to the model at the mathematical level, nudging
                it toward the correct behavior before a single real token is processed.
            </Analogy>

            <Analogy label="Why It Works Only on Giant Models">
                A small model can&rsquo;t decode the task from 100 numerical tokens alone &mdash;
                there isn&rsquo;t enough capacity to read such subtle hints and amplify them
                through many layers. But an 11-billion-parameter model has so much depth and width
                that even a tiny nudge from the soft prompt is enough to perfectly align every
                layer of computation to the new task. It&rsquo;s like whispering instructions at
                the start of a concert: only a musician with extremely sharp hearing and years of
                practice can incorporate a whispered cue into a perfect performance without missing
                a beat.
            </Analogy>

            <Analogy label="Hard vs. Soft Prompts">
                A hard prompt is written in English: &ldquo;Translate the following sentence to
                French: ...&rdquo; A soft prompt is 100 numbers that the model processes directly
                without converting to words first. The soft prompt can encode information that no
                English sentence can express &mdash; it isn&rsquo;t constrained by human vocabulary.
                It can say things like &ldquo;pay attention to the third word in every clause and
                compare it to the second-to-last token in the context&rdquo; in a single mathematical
                vector, something no natural language phrase could capture so precisely.
            </Analogy>

            <Analogy label="Why You Don't Change the Model's Brain">
                All 11 billion parameters of T5-XXL are frozen during training. You only adjust
                102,400 numbers &mdash; the soft tokens. The model&rsquo;s &ldquo;brain&rdquo;
                stays exactly the same for every task. You&rsquo;re changing the question, not the
                answerer. This means one copy of the 11B model can serve hundreds of different tasks
                simultaneously; each task just needs its own tiny soft prompt file to load before
                inference begins.
            </Analogy>

            <Analogy label="Multi-Task Prompting: One Model, Many Personalities">
                With different soft prompts, the same frozen model behaves like a translator, a
                summarizer, a question-answerer, and a code generator. One model, many soft prompts,
                each stored in a tiny file (a few hundred kilobytes). Like one actor playing many
                roles by wearing different small costume accessories, without changing who they
                fundamentally are &mdash; the same voice, the same skill, just a different hat that
                signals to everyone in the room which character is on stage.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Prompt tuning: mathematics and engineering</h2>

            <h3>The Prompt Tuning Setup</h3>
            <p>
                Consider a frozen language model f with embedding dimension d. The soft prompt is
                a matrix P &isin; R<sup>k&times;d</sup> of k learnable token vectors. An input
                sequence of n real tokens is embedded to X &isin; R<sup>n&times;d</sup>. The
                effective input passed to the Transformer is the row-concatenation:
            </p>
            <MathBlock tex="\tilde{X} = [P;\, X] \in \mathbb{R}^{(k+n) \times d}" />
            <p>
                The training objective minimizes the task loss with respect to P only &mdash; all
                model parameters are frozen:
            </p>
            <MathBlock tex="\min_{P \in \mathbb{R}^{k \times d}} \mathcal{L}\!\left(f_{\text{frozen}}\!\left([P;\, X]\right),\; y\right)" />
            <p>
                For T5-XXL with d = 1,024 and k = 100: the soft prompt contains 100 &times; 1,024
                = 102,400 trainable parameters. The full model has approximately 11 billion
                parameters. The fraction of parameters that are trained is:
            </p>
            <MathBlock tex="\frac{k \times d}{N_{\text{model}}} = \frac{102{,}400}{11 \times 10^9} \approx 9.3 \times 10^{-6} \quad (0.00093\%)" />
            <p>
                Despite this extreme compression, Lester et al. reported that prompt tuning matches
                full fine-tuning accuracy on SuperGLUE at this scale &mdash; an 11B frozen model
                has sufficient capacity to amplify the input-level signal through all layers.
            </p>

            <h3>Prefix-Tuning vs. Prompt Tuning</h3>
            <p>
                Prefix-tuning (Li &amp; Liang, 2021) inserts virtual tokens at every Transformer
                layer l. The augmented key and value computations at each attention head become:
            </p>
            <MathBlock tex="K_l = \text{concat}(P_{K,l},\; W_K h_l) \qquad V_l = \text{concat}(P_{V,l},\; W_V h_l)" />
            <p>
                Prompt tuning inserts only at the embedding layer &mdash; the single operation
                [P; X]. The parameter counts reflect this difference directly. For a Transformer
                with L layers, embedding dimension d, and k prefix tokens:
            </p>
            <MathBlock tex="\text{Prefix-tuning: } 2 \times L \times k \times d \qquad \text{Prompt tuning: } k \times d" />
            <p>
                Prefix-tuning is strictly more expressive because it injects task-specific bias
                at every attention layer. Prompt tuning is strictly more efficient. Lester et al.
                showed that for very large models (&ge;11B), the simpler prompt tuning closes the
                accuracy gap because the model has sufficient depth to propagate the input-layer
                signal to every computation without loss.
            </p>

            <h3>Initialization Strategies</h3>
            <p>
                The choice of how to initialize P significantly affects convergence. Three
                strategies were compared empirically:
            </p>
            <MathBlock tex="\text{Random: } p_i \sim \mathcal{N}(0,\, \sigma^2)" />
            <MathBlock tex="\text{Label-word: } p_i = E[w_i] \text{ for task-relevant words } w_i" />
            <MathBlock tex="\text{Vocabulary sample: } p_i = E[w_i],\; w_i \sim \text{Uniform(vocab by frequency)}" />
            <p>
                Empirically, label-word initialization converges faster and achieves higher final
                accuracy for small k (k &lt; 20). The gradient at the first step for label
                initialization already points in a semantically meaningful direction, because the
                initial P is close to the manifold of task-relevant embeddings. For k &ge; 100,
                the advantage diminishes &mdash; there are enough tokens that even random
                initialization explores the relevant subspace within a few hundred gradient steps.
                The loss gradient with respect to the soft prompt P is:
            </p>
            <MathBlock tex="\nabla_P \mathcal{L} = \frac{\partial \mathcal{L}}{\partial \tilde{X}} \bigg|_{\tilde{X}=[P;\,X]}" />
            <p>
                where the Jacobian &part;L/&part;X&#771; is computed by backpropagating through the
                frozen model without accumulating gradients for any model parameter &mdash; only
                the rows of P corresponding to the k soft tokens receive updates.
            </p>

            <h3>Scale Dependence: Why Prompt Tuning Needs Big Models</h3>
            <p>
                Lester et al.&rsquo;s main empirical result was a non-linear relationship between
                model size and prompt tuning effectiveness. Let &eta;(N) denote the ratio of prompt
                tuning accuracy to full fine-tuning accuracy as a function of model size N:
            </p>
            <MathBlock tex="\eta(N) = \frac{\text{Acc}_{\text{prompt-tune}}(N)}{\text{Acc}_{\text{fine-tune}}(N)}" />
            <p>
                Lester et al. measured approximately &eta;(250M) &approx; 0.72 and
                &eta;(11B) &approx; 1.00. The capacity argument formalizes this: the soft
                prompt must communicate task identity through k &times; d dimensions. The signal-
                to-noise ratio at layer L &mdash; how much of the input-level task signal survives
                after L Transformer operations &mdash; scales with the model&rsquo;s representational
                capacity:
            </p>
            <MathBlock tex="\text{SNR}(N, k, d) \propto \frac{k \cdot d}{N^{1/L}}" />
            <p>
                At N = 11B, the denominator is large enough that even k &times; d = 102,400
                constitutes a relatively loud signal. At N = 250M, the same absolute number
                of dimensions is overwhelmed by the model&rsquo;s prior &mdash; the soft prompt
                is too small a perturbation to redirect the model&rsquo;s behavior reliably.
            </p>

            <h3>Prompt Tuning Robustness vs. Hard Prompt Sensitivity</h3>
            <p>
                Hard prompts are notoriously sensitive to exact wording. Replacing &ldquo;Classify
                the sentiment of the following review&rdquo; with &ldquo;Determine the emotional
                tone of the text below&rdquo; can swing accuracy by &plusmn;30 percentage points
                on the same model. This sensitivity can be formalized as the directional derivative
                of accuracy with respect to a token substitution:
            </p>
            <MathBlock tex="\Delta \text{Acc} \approx \nabla_{\text{token}} \text{Acc} \cdot \delta_{\text{token}}" />
            <p>
                where &delta;<sub>token</sub> is the embedding difference between the original and
                substituted token. Because the token grid is discrete and irregularly spaced in
                embedding space, small semantic changes (synonyms) can cause large jumps in the
                gradient direction. Soft prompts avoid this entirely: they are optimized over the
                full continuous space R<sup>k&times;d</sup> and converge to a local optimum where
                small perturbations cause only small accuracy changes by the first-order optimality
                conditions &nabla;<sub>P</sub>L = 0. The trade-off is transferability: hard prompts
                can be copied between models with different tokenizers and embedding matrices; soft
                prompts are model-specific and cannot be transferred without re-optimization.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Gradient derivation &middot; expressivity bounds &middot; hard vs. soft token capacity</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch soft prompt wrapper &middot; frozen T5 with trainable prefix embeddings</span>
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
            <h2>Gradient derivation, expressivity bounds, and the continuous prompt landscape</h2>

            <DefBlock label="Backpropagation Through a Frozen Model">
                In standard fine-tuning, gradients flow through all parameters. In prompt tuning,
                the model f is frozen: no parameter &theta; in f receives a gradient update. The
                only trainable object is the soft prompt matrix P &isin; R<sup>k&times;d</sup>.
                Backpropagation still runs through the full model to compute &part;L/&part;P, but
                the gradient is discarded for all parameters except P.
            </DefBlock>

            <p>
                Let the model output be y&#770; = f([P; X]) and the loss be L(y&#770;, y). The
                chain rule for the gradient of L with respect to the i-th soft token row p<sub>i</sub>
                (the i-th row of P, a vector in R<sup>d</sup>) is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial p_i} = \sum_j \frac{\partial \mathcal{L}}{\partial \hat{y}_j} \cdot \frac{\partial \hat{y}_j}{\partial [\tilde{X}]_i} \cdot \frac{\partial [\tilde{X}]_i}{\partial p_i}" />
            <p>
                The last Jacobian &part;[X&#771;]<sub>i</sub>/&part;p<sub>i</sub> is the identity
                matrix in R<sup>d&times;d</sup> because [X&#771;]<sub>i</sub> = p<sub>i</sub> for
                the first k rows. So the gradient simplifies to:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial p_i} = \left.\frac{\partial \mathcal{L}}{\partial \tilde{X}_i}\right|_{\tilde{X}=[P;\,X]} \quad \text{for } i = 1, \ldots, k" />
            <p>
                This is simply the activation gradient at the i-th position of the input sequence
                &mdash; the same quantity computed during standard backpropagation, but only
                materialized for the first k positions (the soft tokens) and discarded for all
                model parameters.
            </p>

            <h3>Expressivity Upper Bound: k Soft Tokens vs. k Hard Tokens</h3>
            <p>
                A hard prompt of k tokens constrains each token to the vocabulary embedding matrix
                E &isin; R<sup>|V|&times;d</sup>: each token p<sub>i</sub> must equal E[w] for
                some word w. The set of reachable hard prompts of length k is:
            </p>
            <MathBlock tex="\mathcal{H}_k = \{ (E[w_1], \ldots, E[w_k]) : w_i \in \mathcal{V} \} \subset \mathbb{R}^{k \times d}" />
            <p>
                The set of reachable soft prompts of length k is the full continuous space:
            </p>
            <MathBlock tex="\mathcal{S}_k = \mathbb{R}^{k \times d}" />
            <p>
                Clearly H<sub>k</sub> &sub; S<sub>k</sub>, and the inclusion is strict: the
                vocabulary embedding grid |V| covers only a finite subset of the continuous space.
                For GPT-family models with |V| = 50,257 and d = 1,024, the ratio of the
                volume covered by H<sub>k</sub> to S<sub>k</sub> is effectively zero &mdash; the
                hard prompt constraint is an astronomically tight restriction on the available
                search space. The quality gap between the optimal hard prompt and the optimal soft
                prompt is therefore bounded below by the distance from the vocabulary grid to the
                true optimum:
            </p>
            <MathBlock tex="\text{Acc}(\hat{P}^*_{\text{soft}}) - \text{Acc}(\hat{P}^*_{\text{hard}}) \ge 0" />
            <p>
                with equality only if the optimal soft prompt happens to coincide with a sequence
                of vocabulary embeddings &mdash; an event with probability zero under any continuous
                distribution.
            </p>

            <h3>Rank of the Soft Prompt Gradient</h3>
            <p>
                The per-step gradient update to P is a matrix in R<sup>k&times;d</sup>. Its rank
                is determined by the batch gradient &mdash; for a batch of B sequences, the
                accumulated gradient is:
            </p>
            <MathBlock tex="\nabla_P \mathcal{L}_{\text{batch}} = \frac{1}{B} \sum_{b=1}^{B} \nabla_P \mathcal{L}^{(b)}" />
            <p>
                Each per-example gradient &nabla;<sub>P</sub>L<sup>(b)</sup> is a rank-1 update in
                the direction of the activation gradient at the k soft-token positions. The batch
                gradient has rank at most min(B, k, d). For typical batch sizes B &lt; k &lt; d,
                the rank is at most B &mdash; each training step makes a low-rank update to P. This
                means soft prompt optimization is implicitly regularized toward low-rank solutions
                by the minibatch stochasticity, even without explicit regularization.
            </p>

            <div className="ch-callout">
                <strong>Practical consequence:</strong> Because each gradient step is low-rank, the
                final soft prompt matrix P often has low effective rank measured by its singular
                value spectrum. Compressing P further &mdash; for example, by keeping only the top
                r singular vectors &mdash; loses little accuracy. This connects soft prompt storage
                to the multi-task delta decomposition: p<sub>task</sub> = p<sub>shared</sub> + U<sub>r</sub>&Sigma;<sub>r</sub>V<sub>r</sub>&rsquo; is a natural low-rank
                factorization of the task-specific soft prompt.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `# ── Soft Prompt Tuning: frozen T5 with trainable prefix embeddings ───────────
import torch
import torch.nn as nn
from transformers import T5ForConditionalGeneration, T5Tokenizer


class PromptTuning(nn.Module):
    """
    Wraps a frozen encoder-decoder model (T5) with a trainable soft prompt.
    Only the soft_prompt parameter is updated during training.
    """

    def __init__(
        self,
        model_name: str = "t5-small",
        n_tokens: int = 20,
        init_from_vocab: bool = True,
    ):
        super().__init__()
        # Load and freeze the base model
        self.model = T5ForConditionalGeneration.from_pretrained(model_name)
        for param in self.model.parameters():
            param.requires_grad = False

        d_model = self.model.config.d_model  # embedding dimension

        # Trainable soft prompt: shape (n_tokens, d_model)
        if init_from_vocab:
            # Sample n_tokens rows from the embedding table
            vocab_size = self.model.config.vocab_size
            indices = torch.randperm(vocab_size)[:n_tokens]
            with torch.no_grad():
                init_val = self.model.shared.weight[indices].clone()
            self.soft_prompt = nn.Parameter(init_val)
        else:
            self.soft_prompt = nn.Parameter(
                torch.randn(n_tokens, d_model) * 0.02
            )

        self.n_tokens = n_tokens

    def _prepend_prompt(self, input_ids: torch.Tensor) -> torch.Tensor:
        """Embed input_ids and prepend the soft prompt embeddings."""
        # (batch, seq_len, d_model)
        token_embeds = self.model.shared(input_ids)
        # (batch, n_tokens, d_model)
        prompt = self.soft_prompt.unsqueeze(0).expand(token_embeds.size(0), -1, -1)
        # (batch, n_tokens + seq_len, d_model)
        return torch.cat([prompt, token_embeds], dim=1)

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor,
        labels: torch.Tensor,
    ) -> torch.Tensor:
        inputs_embeds = self._prepend_prompt(input_ids)
        # Extend attention mask to cover the soft prompt positions
        prompt_mask = torch.ones(
            attention_mask.size(0), self.n_tokens,
            device=attention_mask.device,
        )
        extended_mask = torch.cat([prompt_mask, attention_mask], dim=1)

        outputs = self.model(
            inputs_embeds=inputs_embeds,
            attention_mask=extended_mask,
            labels=labels,
        )
        return outputs.loss

    def trainable_parameters(self) -> int:
        return self.soft_prompt.numel()

    def total_model_parameters(self) -> int:
        return sum(p.numel() for p in self.model.parameters())


# ── Training loop ─────────────────────────────────────────────────────────────
def train_soft_prompt(
    model_name: str = "t5-small",
    n_tokens: int = 20,
    lr: float = 0.3,
    n_steps: int = 5,
) -> None:
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = PromptTuning(model_name=model_name, n_tokens=n_tokens)

    print(f"Trainable params:  {model.trainable_parameters():,}")
    print(f"Total model params:{model.total_model_parameters():,}")
    fraction = model.trainable_parameters() / model.total_model_parameters()
    print(f"Fraction trained:  {fraction:.6%}")

    # Only the soft prompt is passed to the optimizer
    optimizer = torch.optim.AdamW([model.soft_prompt], lr=lr)

    # Toy batch (sentiment classification framed as seq2seq)
    texts = [
        "sst2 sentence: The film is a masterpiece .",
        "sst2 sentence: Boring and utterly forgettable .",
    ]
    labels_text = ["positive", "negative"]

    enc = tokenizer(texts, return_tensors="pt", padding=True, truncation=True)
    label_enc = tokenizer(labels_text, return_tensors="pt", padding=True)
    label_ids = label_enc.input_ids
    label_ids[label_ids == tokenizer.pad_token_id] = -100

    model.train()
    for step in range(n_steps):
        optimizer.zero_grad()
        loss = model(enc.input_ids, enc.attention_mask, label_ids)
        loss.backward()
        optimizer.step()
        print(f"Step {step + 1}/{n_steps}  loss={loss.item():.4f}")

    print("Soft prompt shape:", model.soft_prompt.shape)
    print("Training complete. Only the soft prompt was updated.")


if __name__ == "__main__":
    train_soft_prompt()
`

function PythonContent() {
    return (
        <>
            <p>
                A PyTorch <code>PromptTuning</code> wrapper around a frozen T5 model. The class
                prepends k trainable embedding vectors to every input, extends the attention mask
                to cover them, and passes <code>inputs_embeds</code> instead of <code>input_ids</code>
                to the underlying model so T5 processes the combined sequence. Only
                <code>soft_prompt</code> is passed to the optimizer &mdash; all T5 weights have
                <code>requires_grad=False</code>. Initialization uses random vocabulary-sampled
                rows from the embedding table, following Lester et al.&rsquo;s recommended strategy.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="prompt_tuning.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PROMPT_TUNING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
