import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The explosion of efficient adaptation methods</h2>
            <p>
                Between 2021 and 2023, the field produced a rapid proliferation of
                parameter-efficient fine-tuning strategies &mdash; each with a fundamentally
                different answer to the question of <em>where</em> and <em>how</em> to insert
                task-specific information into a frozen pre-trained model. Additive methods
                attached new modules. Selective methods updated only a chosen slice of existing
                weights. Reparameterization methods constrained the weight update to a structured
                form. Hybrid methods combined several strategies with learned gating. Together,
                these families constitute the PEFT taxonomy that now underpins production fine-tuning
                across every major lab.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Additive methods</div>
                    <div className="ch-tl-title">Houlsby et al. &mdash; Adapters: the additive approach</div>
                    <div className="ch-tl-body">
                        Houlsby et al. proved that PEFT was viable by inserting small bottleneck
                        modules (adapters) between the frozen layers of BERT. The model's existing
                        parameters were left entirely untouched; the adapter parameters were the
                        complete "fine-tuning delta." Additive methods share this property: the
                        task-specific knowledge lives exclusively in newly introduced components
                        &mdash; whether those are bottleneck modules, prefix tokens, or learned
                        bias vectors &mdash; while the backbone remains frozen. This makes them
                        trivially multi-task: swap the adapter, swap the task, with zero
                        interference between tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved PEFT was possible; defined the additive family</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Selective methods</div>
                    <div className="ch-tl-title">Ben Zaken et al. &mdash; BitFit: fine-tuning only bias terms</div>
                    <div className="ch-tl-body">
                        Ben Zaken et al. asked an extreme question: what if you only updated the
                        bias terms of a pre-trained model and froze everything else? BERT contains
                        roughly 0.1% of its parameters in biases. BitFit showed that updating
                        only these biases achieved approximately 95% of full fine-tuning accuracy
                        across the GLUE benchmark. The result was surprising: biases encode a
                        disproportionate amount of task-specific signal because they shift
                        activation distributions in task-relevant directions, re-routing information
                        flow without altering the weight structure. BitFit defined the
                        <em>selective</em> family: choose a small subset of existing parameters
                        and fine-tune those alone.
                    </div>
                    <div className="ch-tl-impact">Impact: Revealed that 0.1% of parameters captures 95% of fine-tuning gain</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Additive &mdash; prefix</div>
                    <div className="ch-tl-title">Li &amp; Liang &mdash; Prefix-Tuning: prepending virtual tokens to every layer</div>
                    <div className="ch-tl-body">
                        Li and Liang inserted trainable prefix vectors into the keys and values of
                        every attention layer, not just the input. Unlike prompt tuning (which
                        prepends only to the input sequence), prefix-tuning injects task-specific
                        steering at every depth of the Transformer &mdash; providing a "virtual
                        context" that continuously biases what each layer attends to. Parameter
                        count scales as prefix&#8209;length &times; layers &times; 2d. For a prefix
                        of length 10 over 12 layers with d&nbsp;=&nbsp;768, that is approximately
                        92K parameters, or about 0.1% of BERT. The method generalizes well but
                        adds attention cost proportional to the prefix length.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that injecting context at every layer is substantially more powerful than input-only prompting</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Reparameterization methods</div>
                    <div className="ch-tl-title">Hu et al. &mdash; LoRA: the low-rank reparameterization</div>
                    <div className="ch-tl-body">
                        Hu et al.'s LoRA reparameterized the weight update &Delta;W as a low-rank
                        product BA, rather than storing &Delta;W explicitly or adding new
                        architectural components. Reparameterization methods share this
                        distinguishing property: they constrain <em>how existing weights can
                        change</em>, rather than adding new modules or selecting a subset of old
                        ones. This structural constraint makes the update mergeable at inference
                        time &mdash; W = W&#8320; + BA is folded back into W&#8320; with zero
                        overhead. LoRA became the dominant PEFT method because it combined
                        near-zero inference latency with strong task performance.
                    </div>
                    <div className="ch-tl-impact">Impact: Defined the reparameterization family; became the industry standard PEFT method</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Reparameterization &mdash; adaptive</div>
                    <div className="ch-tl-title">Zhang et al. &mdash; AdaLoRA: adaptive rank allocation via SVD</div>
                    <div className="ch-tl-body">
                        Zhang et al. observed that different weight matrices benefit from different
                        ranks. LoRA with a fixed rank r applies the same budget uniformly, but
                        the actual intrinsic dimensionality of the update varies by layer and
                        matrix type. AdaLoRA parameterized &Delta;W = P&Sigma;Q&#7488; and
                        measured the importance of each singular value triplet by |&sigma;&#8321;|.
                        During training, singular values with low importance were pruned to zero,
                        automatically concentrating the rank budget on weight matrices where
                        low-rank structure genuinely helps. This adaptive allocation consistently
                        improved over fixed-rank LoRA, especially on tasks requiring uneven
                        adaptation across layers.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that rank should be treated as a learned resource, not a fixed hyperparameter</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Hybrid methods</div>
                    <div className="ch-tl-title">Mao et al. &mdash; UniPELT: gated combination of PEFT families</div>
                    <div className="ch-tl-body">
                        Mao et al. combined LoRA, prefix-tuning, and adapters within a single
                        framework, adding a learned gating scalar per method per layer. During
                        training, the gate weights determined how much each PEFT method
                        contributed to each layer's transformation. UniPELT consistently
                        outperformed any single PEFT method across diverse tasks &mdash;
                        suggesting that the three families capture complementary kinds of
                        task-specific adaptation, and that no single strategy is universally
                        optimal. Hybrid methods pay a parameter and compute premium but gain
                        robustness across task types.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that different PEFT families are complementary, not competing</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">PEFT at scale</div>
                    <div className="ch-tl-title">QLoRA, GaLore &mdash; blurring the boundary with full fine-tuning</div>
                    <div className="ch-tl-body">
                        Dettmers et al.'s QLoRA applied LoRA on top of 4-bit quantized models,
                        reducing memory sufficiently to fine-tune 65B+ parameter models on a
                        single consumer GPU. GaLore (Zhao et al., 2024) took a different approach:
                        rather than constraining the weight update, it applied low-rank projection
                        to the <em>gradient</em> itself during full fine-tuning, enabling full
                        parameter updates at LoRA-like memory cost. As gradient compression
                        techniques matured, the conceptual boundary between PEFT and full
                        fine-tuning began to dissolve &mdash; the real axis became memory
                        efficiency, not the binary of frozen vs. unfrozen parameters.
                    </div>
                    <div className="ch-tl-impact">Impact: Pushed PEFT to extreme scales; reframed the field around memory efficiency rather than parameter count</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The organizing principle:</strong> PEFT methods differ in where they
                insert task knowledge &mdash; in new parameters (additive), in chosen existing
                parameters (selective), in the structure of weight updates (reparameterization),
                or in a combination (hybrid). Each choice implies different trade-offs in
                latency, memory, and adaptation expressivity. Understanding the taxonomy is the
                first step to choosing the right method for a given task.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Four ways to customize something without breaking it</h2>

            <Analogy label="Four Ways to Customize a Book">
                Imagine you have a giant textbook and you want to make it useful for a brand new
                subject. You have four strategies. <strong>Additive:</strong> stick extra pages in
                between the existing pages &mdash; the old pages are untouched, and the new pages
                carry all the new subject's knowledge. <strong>Selective:</strong> only rewrite a
                tiny handful of existing pages (say, just the margin notes). <strong>Reparameterization:</strong>{" "}
                instead of copying all the changed pages, write a short formula that describes
                exactly what changed &mdash; then reconstruct the changed pages from the formula
                when needed. <strong>Hybrid:</strong> do a bit of all three, and let the book
                decide which strategy helps most for each chapter. Each approach has different
                costs: extra pages take extra space; formulas are compact but harder to write;
                margin-note-only editing is cheapest but limited.
            </Analogy>

            <Analogy label="BitFit: The Bias Trick">
                Imagine the textbook has tiny margin notes on every page &mdash; small pencil
                scribbles that nudge the reader in certain directions. The margin notes are less
                than 1% of all the words. BitFit says: what if you only changed the margin notes
                and left every sentence unchanged? Surprisingly, that tiny edit captures 95% of
                the benefit of rewriting the whole book for a new subject. The margin notes are
                small but surprisingly powerful &mdash; they shift the reader's attention in
                exactly the right directions.
            </Analogy>

            <Analogy label="Prefix-Tuning: Whispering in Every Room">
                A regular prompt is like whispering instructions to the model once at the front
                door. Prefix-tuning is like having a helper whisper a secret message in every
                room of the building as you walk through it. At every floor (every Transformer
                layer), the prefix injects task-specific steering into what the model is paying
                attention to. This is more powerful than just a front-door whisper, but it costs
                extra memory for every room you whisper in.
            </Analogy>

            <Analogy label="Why There Is No Single Best Method">
                Different tasks need different kinds of changes. A task that requires the model
                to remember new facts works best with additive methods (extra pages with the
                facts). A task that requires the model to attend to different parts of a sentence
                works best with prefix-tuning. A task that just needs the model's output style
                adjusted works best with LoRA on the projection matrices. Choosing the right
                PEFT method is like choosing the right tool from a toolbox &mdash; hammers and
                screwdrivers are not in competition; they handle different jobs.
            </Analogy>

            <Analogy label="The PEFT Zoo: LoRA vs. Adapters vs. Prefix">
                <strong>LoRA</strong> changes how information is projected through the weight
                matrices. At inference it disappears entirely &mdash; it merges back into the
                weights, adding zero extra time. <strong>Adapters</strong> insert extra
                processing steps between frozen layers &mdash; they stay visible at inference and
                add a small latency cost. <strong>Prefix-tuning</strong> changes what each
                attention layer "sees" as context &mdash; it adds memory cost proportional to
                the prefix length. Three different places to inject task knowledge; three
                different cost profiles.
            </Analogy>

            <Analogy label="UniPELT: Let the Model Decide">
                UniPELT trains all three methods simultaneously and adds a small gating weight
                per layer that controls how much each method contributes. During training, the
                model learns to rely on LoRA for some layers, adapters for others, and prefix
                for others. It is like giving the model a full toolbox and letting it pick the
                right tool for each layer automatically &mdash; more expensive than using one
                tool, but almost always better across diverse tasks.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The parameter-efficient fine-tuning landscape</h2>

            <h3>Taxonomy: Four Method Families</h3>
            <p>
                PEFT methods partition cleanly into four families based on their relationship
                to the pre-trained weights:
            </p>
            <ul>
                <li>
                    <strong>Additive</strong> &mdash; new parameters are appended to the frozen
                    model. The frozen weights are never touched. Examples: adapter bottlenecks,
                    prefix tokens, IA&#179;.
                </li>
                <li>
                    <strong>Selective</strong> &mdash; a subset of existing parameters is chosen
                    and fine-tuned while the rest remain frozen. Examples: BitFit (biases only),
                    last-N-layers, specific weight types (LayerNorm only).
                </li>
                <li>
                    <strong>Reparameterization</strong> &mdash; the weight update &Delta;W is
                    constrained to a structured form rather than being a free dense matrix.
                    Examples: LoRA (low-rank), AdaLoRA (SVD with pruning), Kronecker
                    decomposition.
                </li>
                <li>
                    <strong>Hybrid</strong> &mdash; two or more families are combined, often
                    with a learned gating mechanism that controls the contribution of each.
                    Example: UniPELT.
                </li>
            </ul>
            <p>
                The general additive update rule is:
            </p>
            <MathBlock tex="h' = f_{\text{frozen}}(h) + g_{\text{new}}(h)" />
            <p>
                where g&#8203;&#8203;<sub>new</sub> is the trainable additive component (an
                adapter module, a prefix contribution, or a LoRA delta) and f&#8203;<sub>frozen</sub>
                is the frozen layer's transformation.
            </p>

            <h3>Prefix-Tuning in Detail</h3>
            <p>
                At layer l, standard self-attention computes keys and values from the input
                hidden states alone. Prefix-tuning prepends p trainable vectors to both K and
                V before the attention operation:
            </p>
            <MathBlock tex="K_l = \bigl[\,P^K_l \;\|\; W_K h_l\,\bigr], \quad V_l = \bigl[\,P^V_l \;\|\; W_V h_l\,\bigr]" />
            <p>
                The real tokens then attend over both the prefix virtual tokens and each other.
                The prefix acts as a "virtual context" that steers attention patterns without
                occupying real sequence positions. Total parameter count for prefix length p
                over L layers with hidden dimension d:
            </p>
            <MathBlock tex="\text{params}_{\text{prefix}} = 2 \times L \times p \times d" />
            <p>
                For p&nbsp;=&nbsp;10, L&nbsp;=&nbsp;12, d&nbsp;=&nbsp;768 (BERT-base): 2 &times; 12 &times; 10 &times; 768 &asymp; 184K
                parameters &mdash; about 0.1% of BERT's 110M weights.
            </p>

            <h3>IA&#179;: Rescaling Activations</h3>
            <p>
                Liu et al. (2022) introduced IA&#179; (Infused Adapter by Inhibiting and Amplifying
                Inner Activations). Rather than adding or reparameterizing, IA&#179; multiplies
                certain activations by learned element-wise scaling vectors:
            </p>
            <MathBlock tex="\text{Attention:} \quad K \leftarrow l_k \odot K, \quad V \leftarrow l_v \odot V" />
            <MathBlock tex="\text{FFN:} \quad \text{act}(x W_1) \leftarrow l_{ff} \odot \text{act}(x W_1)" />
            <p>
                Only three vectors per layer &mdash; l&#8203;<sub>k</sub>, l&#8203;<sub>v</sub> &#8712; &#8477;<sup>d</sup>
                and l&#8203;<sub>ff</sub> &#8712; &#8477;<sup>4d</sup> &mdash; giving roughly 3d parameters per
                Transformer layer. For BERT-base (d&nbsp;=&nbsp;768, L&nbsp;=&nbsp;12), that is
                approximately 28K parameters, or 0.03% of the model. IA&#179; achieves few-shot
                learning performance at a fraction of LoRA's parameter count, and like LoRA,
                the scaling vectors can be merged into the weight matrices at inference time with
                zero overhead.
            </p>

            <h3>AdaLoRA: SVD-based Rank Budgeting</h3>
            <p>
                Standard LoRA applies the same rank r to every weight matrix. AdaLoRA instead
                represents each weight update as a full singular value decomposition:
            </p>
            <MathBlock tex="\Delta W = P \,\Lambda\, Q^\top, \quad \Lambda = \operatorname{diag}(\lambda_1, \ldots, \lambda_r)" />
            <p>
                The importance of each singular value triplet is measured by its magnitude:
            </p>
            <MathBlock tex="s_i = |\lambda_i|" />
            <p>
                During training, triplets with low importance scores are pruned (their
                &lambda;&#8203;<sub>i</sub> is masked to zero). A global rank budget B
                = &Sigma;<sub>matrices</sub> rank<sub>i</sub> is maintained throughout
                training. The result is that rank-hungry weight matrices &mdash; typically
                the query and value projections in early-to-middle layers &mdash; automatically
                receive more capacity, while less critical matrices are compressed. AdaLoRA
                consistently outperforms fixed-rank LoRA at the same total parameter budget.
            </p>

            <h3>Trade-offs: Latency, Memory, and Accuracy</h3>
            <p>
                Each PEFT family has a distinct profile across the three key axes:
            </p>
            <ul>
                <li>
                    <strong>Full fine-tuning:</strong> 100% of parameters trainable; optimizer
                    states for every weight (3&ndash;4&times; model size in memory for Adam);
                    best achievable accuracy; inference latency = base model.
                </li>
                <li>
                    <strong>Adapters (additive):</strong> 3&ndash;5% of parameters; memory
                    overhead roughly proportional to adapter size; accuracy &asymp; full
                    fine-tuning; inference latency +10&ndash;15% due to extra sequential
                    operations.
                </li>
                <li>
                    <strong>Prefix-tuning (additive):</strong> 0.1&ndash;1% of parameters;
                    memory overhead proportional to prefix&#8209;length &times; L &times; d;
                    accuracy &asymp; full fine-tuning on most tasks; attention cost increases
                    with prefix length.
                </li>
                <li>
                    <strong>LoRA (reparameterization):</strong> 0.1&ndash;1% of parameters;
                    minimal memory overhead; accuracy &asymp; full fine-tuning; <em>zero</em>{" "}
                    inference latency after weight merging.
                </li>
                <li>
                    <strong>BitFit (selective):</strong> ~0.1% of parameters; minimal memory;
                    ~95% of full fine-tuning accuracy; zero inference latency.
                </li>
                <li>
                    <strong>IA&#179; (selective-multiplicative):</strong> &lt;0.1% of parameters;
                    minimal memory; few-shot level accuracy; zero inference latency after merging.
                </li>
            </ul>
            <p>
                Memory during training is dominated by the optimizer states for trainable
                parameters. For Adam with a PEFT method updating M parameters:
            </p>
            <MathBlock tex="\text{Memory}_{\text{optimizer}} \approx 8M \text{ bytes} \quad (\text{fp32 momentum + variance})" />
            <p>
                compared to 8N bytes for full fine-tuning of an N-parameter model. At
                M&nbsp;=&nbsp;0.001N, this reduces optimizer memory by 1000&times;, which
                typically dominates the total GPU memory budget during fine-tuning.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Formal proofs &middot; gradient derivations &middot; expressivity bounds</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">HuggingFace PEFT &middot; LoRA vs. adapters vs. prefix-tuning &middot; parameter counts</span>
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
            <h2>Formal foundations of the PEFT taxonomy</h2>

            <DefBlock label="Low-Rank Universality (LoRA)">
                For any rank-r matrix &Delta;W &#8712; &#8477;<sup>d&times;k</sup> with rank(&Delta;W)&nbsp;=&nbsp;r,
                there exist matrices B &#8712; &#8477;<sup>d&times;r</sup> and A &#8712; &#8477;<sup>r&times;k</sup>
                such that &Delta;W = BA. This follows directly from the rank factorization theorem:
                every rank-r matrix admits a decomposition into a product of a full-column-rank
                d&times;r matrix and a full-row-rank r&times;k matrix. LoRA's parameterization
                therefore covers the entire space of rank-r updates &mdash; it introduces no
                approximation at a given rank, only a constraint on the <em>maximum</em> rank of
                the update.
            </DefBlock>

            <h3>LoRA covers all rank-r updates</h3>
            <MathBlock tex="\forall\, \Delta W \text{ with } \operatorname{rank}(\Delta W) \le r, \quad \exists\, B \in \mathbb{R}^{d \times r},\, A \in \mathbb{R}^{r \times k} \text{ s.t. } \Delta W = BA" />
            <p>
                The set of matrices expressible as BA with B &#8712; &#8477;<sup>d&times;r</sup>
                and A &#8712; &#8477;<sup>r&times;k</sup> is exactly the set of d&times;k matrices
                of rank at most r. LoRA's initialization (A Gaussian, B zero, so &Delta;W = 0
                at initialization) ensures that fine-tuning starts from the pre-trained solution
                and drifts only as much as the data requires &mdash; a form of implicit
                regularization toward low-rank updates.
            </p>

            <h3>IA&#179; gradient update</h3>
            <p>
                For the key rescaling l&#8203;<sub>k</sub> &#8712; &#8477;<sup>d</sup> applied as
                K' = l&#8203;<sub>k</sub> &#8857; K, the attention output for a single head is:
            </p>
            <MathBlock tex="\text{Attn}(Q, K', V) = \operatorname{softmax}\!\left(\frac{Q (l_k \odot K)^\top}{\sqrt{d}}\right) V" />
            <p>
                Let A = softmax(Q(l&#8203;<sub>k</sub> &#8857; K)&#7488; / &radic;d). The gradient
                of the loss with respect to l&#8203;<sub>k</sub> is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial l_k} = \frac{1}{\sqrt{d}} \left( A^\top \frac{\partial \mathcal{L}}{\partial \text{Attn}} V^\top \right) \odot K^\top \mathbf{1}" />
            <p>
                Because l&#8203;<sub>k</sub> is a d-dimensional vector (not a matrix), the
                gradient is cheap to compute and store &mdash; O(d) rather than O(d&#178;) for
                a full weight matrix gradient. This is why IA&#179; achieves such extreme
                parameter efficiency.
            </p>

            <h3>BitFit expressivity: bias shift as activation rerouting</h3>
            <p>
                A linear layer with bias computes h = Wx + b. After BitFit fine-tuning with
                bias update &delta;b, the output is:
            </p>
            <MathBlock tex="h' = W x + (b + \delta b) = h + \delta b" />
            <p>
                The bias shift &delta;b is a constant offset applied to all tokens uniformly.
                Through a non-linear activation function &sigma;, this induces a non-uniform
                shift in the activated output:
            </p>
            <MathBlock tex="\sigma(h + \delta b) \ne \sigma(h) + \sigma(\delta b)" />
            <p>
                The effect is that &delta;b re-routes the flow of information through the
                subsequent layers: neurons that were sub-threshold for the pre-trained task
                may become active for the new task (and vice versa). The surprising expressivity
                of BitFit arises because biases are applied before non-linearities &mdash;
                a small additive shift in pre-activation space creates a large change in
                post-activation distributions when the non-linearity is in the transition
                region of its input range.
            </p>

            <div className="ch-callout">
                <strong>Unified view:</strong> All three results share a common theme &mdash;
                small structured perturbations to a large frozen representation can redirect
                the model's computation effectively, because the pre-trained representation
                is already high-quality and the fine-tuning task only needs to <em>steer</em>
                it, not rebuild it from scratch.
            </div>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `from transformers import GPT2LMHeadModel, GPT2Tokenizer
from peft import (
    LoraConfig, PrefixTuningConfig, IA3Config,
    get_peft_model, TaskType
)
import torch

model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

def count_params(model):
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    return total, trainable

# ── Baseline: full model parameter count ─────────────────────────────────────
base_model = GPT2LMHeadModel.from_pretrained(model_name)
total, _ = count_params(base_model)
print(f"Base GPT-2 parameters: {total:,}")
print()

# ── LoRA ─────────────────────────────────────────────────────────────────────
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                        # rank
    lora_alpha=32,               # scaling: alpha/r = 2.0
    target_modules=["c_attn"],   # apply to QKV projection
    lora_dropout=0.05,
    bias="none",
)
lora_model = get_peft_model(
    GPT2LMHeadModel.from_pretrained(model_name),
    lora_config
)
_, lora_trainable = count_params(lora_model)
print(f"LoRA  (r=16) trainable: {lora_trainable:,}  ({lora_trainable/total*100:.2f}%)")

# ── Prefix-Tuning ─────────────────────────────────────────────────────────────
prefix_config = PrefixTuningConfig(
    task_type=TaskType.CAUSAL_LM,
    num_virtual_tokens=20,       # prefix length p = 20
    prefix_projection=False,
)
prefix_model = get_peft_model(
    GPT2LMHeadModel.from_pretrained(model_name),
    prefix_config
)
_, prefix_trainable = count_params(prefix_model)
print(f"Prefix (p=20) trainable: {prefix_trainable:,}  ({prefix_trainable/total*100:.2f}%)")

# ── IA3 ───────────────────────────────────────────────────────────────────────
ia3_config = IA3Config(
    task_type=TaskType.CAUSAL_LM,
    target_modules=["c_attn", "c_proj"],
    feedforward_modules=["c_proj"],
)
ia3_model = get_peft_model(
    GPT2LMHeadModel.from_pretrained(model_name),
    ia3_config
)
_, ia3_trainable = count_params(ia3_model)
print(f"IA3          trainable: {ia3_trainable:,}  ({ia3_trainable/total*100:.2f}%)")

print()
print("Summary:")
print(f"  Full fine-tuning : {total:,} params (100.00%)")
print(f"  LoRA r=16        : {lora_trainable:,} params")
print(f"  Prefix p=20      : {prefix_trainable:,} params")
print(f"  IA3              : {ia3_trainable:,} params")

# ── Quick forward pass check ──────────────────────────────────────────────────
input_ids = tokenizer("Hello, PEFT world!", return_tensors="pt").input_ids
with torch.no_grad():
    lora_out  = lora_model(input_ids).logits
    prefix_out = prefix_model(input_ids).logits
    ia3_out   = ia3_model(input_ids).logits
print()
print("All three methods produce valid outputs.")
print(f"  LoRA output shape   : {tuple(lora_out.shape)}")
print(f"  Prefix output shape : {tuple(prefix_out.shape)}")
print(f"  IA3 output shape    : {tuple(ia3_out.shape)}")
`

function PythonContent() {
    return (
        <>
            <p>
                HuggingFace PEFT comparison applying LoRA, prefix-tuning, and IA&#179; to
                the same GPT-2 model. Parameter counts are printed for each method so you can
                see the efficiency difference concretely.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="peft_taxonomy_compare.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PEFT_TAXONOMY_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
