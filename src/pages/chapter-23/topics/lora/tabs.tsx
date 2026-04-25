import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Adapting giants without rebuilding them</h2>
            <p className="ch-story-intro">
                Chapter 22&rsquo;s GPT-3 and scaling laws established that larger models generalize
                better &mdash; but fine-tuning a 175-billion-parameter model requires storing and
                updating 175 billion gradients, consuming hundreds of gigabytes of GPU memory and
                costing millions of dollars. Deploying a separately fine-tuned copy for each
                downstream task was economically impossible. LoRA &mdash; Low-Rank Adaptation,
                introduced by Hu et al. in 2021 &mdash; solved this by observing that the weight
                changes needed for fine-tuning are intrinsically low-rank: the same task-specific
                adaptation can be expressed as the product of two small matrices, without touching
                the original weights at all.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Standard Practice</div>
                    <div className="ch-tl-title">Full Fine-Tuning as the Default Pipeline</div>
                    <div className="ch-tl-body">
                        After BERT demonstrated the power of pretrained Transformers, the standard
                        pipeline became: download a 340M-parameter pretrained model, then run gradient
                        descent on all parameters for the downstream task. This worked well, but
                        required storing full gradients and optimizer states &mdash; roughly 3&ndash;4&times;
                        the model size in memory. At 340M parameters this was manageable. By 2020,
                        with GPT-3 at 175B parameters, full fine-tuning demanded roughly 700 GB of
                        GPU memory for Adam optimizer states alone &mdash; far beyond the reach of
                        any single machine or most organizations.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the need for parameter-efficient alternatives at scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">First PEFT Method</div>
                    <div className="ch-tl-title">Houlsby et al. &mdash; Adapter Layers</div>
                    <div className="ch-tl-body">
                        Houlsby et al. inserted small bottleneck modules &mdash; adapters &mdash;
                        into frozen Transformer layers. Each adapter consisted of two linear
                        projections: a down-projection (d &rarr; r) and an up-projection (r &rarr; d)
                        with a residual connection, where r &lt;&lt; d. Only the adapter weights were
                        trained. This was the first demonstration that less than 1% of a model&rsquo;s
                        parameters could match full fine-tuning accuracy on GLUE benchmarks.
                        The key limitation: adapters add extra layers to every forward pass,
                        introducing inference latency proportional to the number of adapter modules.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved &lt;1% of parameters suffice, but at an inference cost</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Theoretical Foundation</div>
                    <div className="ch-tl-title">Aghajanyan et al. &mdash; Intrinsic Dimensionality of Fine-Tuning</div>
                    <div className="ch-tl-body">
                        Aghajanyan et al. measured the &ldquo;intrinsic dimensionality&rdquo; of
                        fine-tuning: the minimum number of parameters in a random subspace that, when
                        optimized, reaches 90% of full fine-tuning performance. For many NLP tasks,
                        this number was strikingly small &mdash; as few as 200&ndash;1000 parameters
                        even for models with hundreds of millions of weights. The finding suggested
                        that fine-tuning does not explore a high-dimensional region of parameter
                        space &mdash; it navigates a tiny, task-relevant subspace embedded within it.
                        This gave the theoretical motivation for low-rank adaptation.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that fine-tuning is intrinsically low-dimensional</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2021</div>
                    <div className="ch-tl-section-label">Core Invention</div>
                    <div className="ch-tl-title">Hu et al. (Microsoft) &mdash; LoRA: Low-Rank Adaptation of Large Language Models</div>
                    <div className="ch-tl-body">
                        The central insight: for a pretrained weight matrix W&#8320; &isin; R<sup>d&times;k</sup>,
                        the fine-tuning update &Delta;W can be decomposed as &Delta;W = BA where
                        B &isin; R<sup>d&times;r</sup> and A &isin; R<sup>r&times;k</sup> with
                        rank r &lt;&lt; min(d, k). B is initialized to zero and A to random Gaussian,
                        so &Delta;W = 0 at the start of training &mdash; preserving the pretrained
                        model&rsquo;s behavior. Only A and B are updated; W&#8320; is completely frozen.
                        After training, W = W&#8320; + BA can be merged into a single weight matrix,
                        adding zero inference latency. For GPT-3 (175B), LoRA with rank r = 4 reduced
                        trainable parameters by 10,000&times; while achieving comparable performance
                        to full fine-tuning on SuperGLUE benchmarks.
                    </div>
                    <div className="ch-tl-impact">Impact: Zero-latency PEFT that matched full fine-tuning quality at 0.01% of the parameters</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022&ndash;2023</div>
                    <div className="ch-tl-section-label">Variants and Extensions</div>
                    <div className="ch-tl-title">QLoRA, AdaLoRA, LoftQ &mdash; Expanding the LoRA Family</div>
                    <div className="ch-tl-body">
                        QLoRA (Dettmers et al., 2023) combined LoRA with 4-bit quantization of the
                        frozen base model using the NF4 (Normal Float 4) data type, enabling
                        fine-tuning of a 65B-parameter model on a single 48 GB GPU. AdaLoRA
                        (Zhang et al., 2023) made rank r adaptive, allocating more capacity to
                        weight matrices with higher &ldquo;importance&rdquo; as measured by singular
                        value magnitude &mdash; spending the parameter budget where it matters most.
                        LoftQ initialized LoRA matrices to compensate for quantization error,
                        improving the quality of QLoRA fine-tunes. Together, these variants extended
                        LoRA from a research technique to a practical toolkit.
                    </div>
                    <div className="ch-tl-impact">Impact: Extended LoRA to consumer hardware and adaptive rank allocation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Democratization</div>
                    <div className="ch-tl-title">HuggingFace PEFT and the Open-Source Fine-Tuning Ecosystem</div>
                    <div className="ch-tl-body">
                        HuggingFace&rsquo;s PEFT (Parameter-Efficient Fine-Tuning) library made LoRA
                        applicable to any Transformer model with a single API call. Alpaca (Stanford),
                        Vicuna, and the majority of open-source LLM fine-tunes used LoRA because the
                        adapter weights fit in consumer GPU VRAM while the quantized base model ran
                        from CPU RAM or a modest GPU. This created an open-source fine-tuning ecosystem
                        where individuals &mdash; not just corporations &mdash; could adapt LLaMA-65B
                        to domain-specific tasks in hours rather than days on expensive GPU clusters.
                    </div>
                    <div className="ch-tl-impact">Impact: Democratized LLM fine-tuning from institutions to individuals</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023&ndash;2024</div>
                    <div className="ch-tl-section-label">Theoretical Refinement</div>
                    <div className="ch-tl-title">LoRA+ and the Mathematics of Rank Choice</div>
                    <div className="ch-tl-body">
                        Hayou et al. (2024) showed that LoRA performs measurably better when the A
                        and B matrices use different learning rates &mdash; specifically, a higher
                        learning rate for B than for A (LoRA+). Theoretical analysis clarified why:
                        the gradient dynamics of A and B are asymmetric because B is initialized to
                        zero. Separately, work on LoRA&rsquo;s expressivity showed that a rank-r
                        adapter cannot represent updates that require rank &gt; r, explaining why
                        r = 4 suffices for stylistic fine-tuning but r = 64 may be needed for
                        teaching genuinely new capabilities. Rank is a task-dependent hyperparameter,
                        not a fixed constant.
                    </div>
                    <div className="ch-tl-impact">Impact: Grounded LoRA in theory and identified rank as a principled hyperparameter</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Fine-tuning a large model navigates a surprisingly
                small subspace of its full parameter space. LoRA makes this explicit: instead of
                searching for &Delta;W in R<sup>d&times;k</sup>, it restricts the search to matrices
                of rank &le; r. For most tasks, the optimal &Delta;W is close to rank-deficient
                &mdash; and the rank-r approximation captures nearly all of the task-relevant signal
                at a fraction of the cost.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>The frozen giant and the tiny sticky notes</h2>

            <Analogy label="The Frozen Giant and the Tiny Sticky Notes">
                The pretrained model &mdash; 175 billion numbers &mdash; is like a giant textbook
                that took years to write. LoRA doesn&rsquo;t rewrite the textbook. Instead, it
                sticks tiny notes in the margins. The notes are the only thing that changes.
                When you use the textbook for a specific task, you read the text plus the notes
                together. The original book stays completely untouched.
            </Analogy>

            <Analogy label="Why You Can't Rewrite the Whole Book">
                Fine-tuning all 175 billion numbers requires 700 gigabytes of GPU memory just to
                store the gradients &mdash; that&rsquo;s like filling a hundred gaming computers.
                LoRA&rsquo;s tiny sticky notes take up only 0.1% of that space. Suddenly,
                fine-tuning fits on a single GPU that most researchers can afford.
            </Analogy>

            <Analogy label="The Low-Rank Trick: Two Small Rulers Instead of a Big Map">
                Instead of storing a huge change-map (say 4,096 &times; 4,096 = 16 million numbers),
                LoRA uses two small rectangles multiplied together: one 4,096 &times; 4 rectangle
                and one 4 &times; 4,096 rectangle &mdash; only 32,784 numbers total. Like drawing a
                map with two thin rulers instead of one enormous sheet. Less information stored,
                but enough to capture everything the task needs.
            </Analogy>

            <Analogy label="Zero Inference Cost: The Sticky Notes Merge">
                After training is done, LoRA&rsquo;s two small rectangles are multiplied together
                and added directly into the original weights. The merged model behaves exactly like
                a fully fine-tuned model at inference time, with no extra computation. The sticky
                notes are printed permanently into the book, then the original note-paper is thrown
                away.
            </Analogy>

            <Analogy label="QLoRA: Fine-Tuning on a Gaming PC">
                QLoRA compressed the frozen base model to 4 bits (from 16), shrinking a 130 GB
                model down to about 35 GB &mdash; small enough to fit on a single gaming GPU.
                LoRA adapters then run on top in full precision. The result: a 65-billion-parameter
                model that one person with one GPU could fine-tune at home in an afternoon. This
                turned fine-tuning from something only big companies could do into something any
                researcher could try.
            </Analogy>

            <Analogy label="Why LoRA Works: The Intrinsic Dimension">
                Experiments showed that even for enormous models, the &ldquo;interesting&rdquo; changes
                during fine-tuning live in a tiny corner of the parameter space &mdash; as few as
                200 dimensions out of billions. LoRA captures exactly that tiny corner. Full
                fine-tuning is like drawing on every page of a 1,000-page encyclopedia; LoRA is
                drawing on three pages that happen to contain everything important for the task.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Low-Rank Adaptation: the mathematics and engineering</h2>

            <h3>The LoRA Decomposition</h3>
            <p>
                LoRA freezes the pretrained weight matrix W&#8320; &isin; R<sup>d&times;k</sup>
                and adds a trainable low-rank perturbation. The modified forward pass becomes:
            </p>
            <MathBlock tex="h = W_0 x + \Delta W x = W_0 x + B A x" />
            <p>
                where B &isin; R<sup>d&times;r</sup> and A &isin; R<sup>r&times;k</sup> with
                r &lt;&lt; min(d, k). Initialization: A &sim; N(0, &sigma;&sup2;) and B = 0,
                so &Delta;W = BA = 0 at the start of training &mdash; the pretrained behavior is
                perfectly preserved. A scaling factor &alpha;/r is applied to the update to
                decouple the rank hyperparameter from the effective learning rate:
            </p>
            <MathBlock tex="h = W_0 x + \frac{\alpha}{r} B A x" />

            <h3>Parameter Count</h3>
            <p>
                Full fine-tuning trains d &times; k parameters per weight matrix. LoRA trains only
                (d + k) &times; r. For a typical Transformer projection layer with d = k = 4,096:
            </p>
            <MathBlock tex="\text{Full: } d \times k = 4096^2 \approx 16.8\text{M} \quad \text{LoRA (r=4): } (d+k) \times r = 8192 \times 4 = 32{,}768" />
            <p>
                That is a 512&times; reduction for a single matrix. Applied across all attention
                projections in GPT-3&rsquo;s 96 layers, LoRA with r = 4 trains approximately
                35 million parameters out of 175 billion &mdash; about 0.02%.
            </p>

            <h3>Which Matrices to Apply LoRA To</h3>
            <p>
                Hu et al. applied LoRA to the query and value projection matrices (W<sub>Q</sub>,
                W<sub>V</sub>) in each attention layer. Importantly, they found that spreading
                LoRA across more matrices with a smaller rank outperformed concentrating it on fewer
                matrices with a larger rank, for the same total parameter budget. If r<sub>total</sub>
                is fixed, applying rank r/2 to four matrices is better than applying rank r to two:
            </p>
            <MathBlock tex="\text{Budget: } B = (d+k) \cdot r_{\text{total}} \quad \Rightarrow \quad \text{prefer many matrices at low } r \text{ over few at high } r" />
            <p>
                This suggests the task-relevant signal is distributed across all projection matrices,
                not concentrated in a subset.
            </p>

            <h3>QLoRA: 4-Bit Quantization + LoRA</h3>
            <p>
                QLoRA (Dettmers et al., 2023) quantizes the frozen base model weights to NF4
                (Normal Float 4), a 4-bit data type optimized for weights that follow a normal
                distribution. The LoRA adapters are kept in BF16. During the forward pass, NF4
                weights are dequantized on-the-fly to BF16; gradients flow only through the LoRA
                parameters A and B. Memory per parameter drops dramatically:
            </p>
            <MathBlock tex="\text{BF16: } 2 \text{ bytes/param} \quad \text{NF4: } 0.5 \text{ bytes/param} \quad \Rightarrow \quad \text{65B params} \approx 33\text{ GB (NF4)} + \text{LoRA} \approx 35\text{ GB total}" />
            <p>
                A 65B-parameter model that previously required four 80 GB A100s for full
                fine-tuning now fits on a single 48 GB consumer GPU.
            </p>

            <h3>Merging and Multi-Task LoRA</h3>
            <p>
                After training, the LoRA matrices are merged directly into the base weight:
            </p>
            <MathBlock tex="W_{\text{merged}} = W_0 + \frac{\alpha}{r} B A" />
            <p>
                This eliminates all inference overhead &mdash; the merged model is indistinguishable
                from a conventionally fine-tuned model. Multiple LoRA adapters can also be combined
                for task arithmetic: given adapters (B<sub>1</sub>, A<sub>1</sub>), (B<sub>2</sub>, A<sub>2</sub>)
                trained on different tasks, a blended model is:
            </p>
            <MathBlock tex="W = W_0 + \sum_i \lambda_i B_i A_i" />
            <p>
                LoRA Switch routes tokens to different adapters based on task identity, enabling
                multi-task serving with a single base model and multiple lightweight adapter sets
                &mdash; each a few hundred megabytes compared to the base model&rsquo;s tens of gigabytes.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Gradient derivations &middot; SVD connection &middot; rank analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">HuggingFace PEFT &middot; manual PyTorch implementation</span>
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
            <h2>Gradient flow, SVD, and the expressivity of low-rank updates</h2>

            <DefBlock label="LoRA Loss and Gradients">
                Let L be the scalar training loss. The LoRA forward pass is h = W&#8320;x + (&#945;/r)BAx.
                The gradients with respect to A and B follow from the chain rule applied to this
                expression with W&#8320; frozen (no gradient for W&#8320;):
            </DefBlock>

            <MathBlock tex="\frac{\partial L}{\partial A} = \frac{\alpha}{r} B^\top \frac{\partial L}{\partial h} x^\top" />
            <MathBlock tex="\frac{\partial L}{\partial B} = \frac{\alpha}{r} \frac{\partial L}{\partial h} (Ax)^\top" />

            <p>
                At initialization B = 0, so &part;L/&part;A = 0 as well &mdash; neither matrix
                receives a gradient at step zero. This is intentional: the very first gradient
                step is determined entirely by the pretrained path W&#8320;x, ensuring training
                begins from the pretrained model&rsquo;s behavior. After a few steps B becomes
                non-zero and A begins to receive signal through B&rsquo;s gradient.
            </p>
            <p>
                This asymmetry is why Hayou et al. (LoRA+) recommend a higher learning rate for
                B than for A: in early training B&rsquo;s signal is weak (it starts at zero and
                grows slowly), while A accumulates gradient faster once B has non-trivial values.
                Setting &eta;<sub>B</sub> &gt;&gt; &eta;<sub>A</sub> corrects this imbalance.
            </p>

            <h3>Effective Rank of &Delta;W = BA</h3>
            <p>
                The product &Delta;W = BA has rank at most r regardless of d and k, because:
            </p>
            <MathBlock tex="\text{rank}(BA) \le \min(\text{rank}(B),\, \text{rank}(A)) \le r" />
            <p>
                In practice, after training, rank(BA) &lt; r because gradient descent on a
                random initialization does not generally produce full-rank solutions. The effective
                rank (measured by the ratio of nuclear norm to spectral norm) tends to be even
                smaller than r &mdash; most of the update energy concentrates in one or two
                singular directions.
            </p>

            <h3>Connection to Singular Value Decomposition</h3>
            <p>
                For any target update &Delta;W* &isin; R<sup>d&times;k</sup>, the best rank-r
                approximation in Frobenius norm is given by the truncated SVD:
            </p>
            <MathBlock tex="\Delta W^* \approx U_r \Sigma_r V_r^\top = \sum_{i=1}^{r} \sigma_i u_i v_i^\top" />
            <p>
                where &sigma;<sub>1</sub> &ge; &sigma;<sub>2</sub> &ge; &hellip; are the singular
                values of &Delta;W* and u<sub>i</sub>, v<sub>i</sub> are the corresponding
                left/right singular vectors. The Eckart&ndash;Young theorem guarantees this
                decomposition minimizes the approximation error:
            </p>
            <MathBlock tex="\min_{\text{rank}(M) \le r} \| \Delta W^* - M \|_F = \sqrt{\sum_{i=r+1}^{\min(d,k)} \sigma_i^2}" />
            <p>
                LoRA with rank r is therefore the best possible rank-r approximation to whatever
                the true fine-tuning update &Delta;W* would have been. If the true update has
                rapidly decaying singular values (low intrinsic dimensionality), a small r
                captures almost all of it. This is why r = 4 suffices for stylistic tasks
                (strongly low-rank &Delta;W*) but r = 64 may be needed for learning new skills
                (higher-rank &Delta;W*).
            </p>

            <div className="ch-callout">
                <strong>The spectral picture:</strong> AdaLoRA directly parameterizes the update
                as &Delta;W = P &Lambda; Q&rsquo; where &Lambda; is diagonal (explicit singular
                values). It prunes singular values below a threshold during training &mdash; rank
                allocation becomes a learned quantity, not a fixed hyperparameter.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `# ── LoRA with HuggingFace PEFT ───────────────────────────────────────────────
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model, TaskType

model_name = "gpt2"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,                          # LoRA rank
    lora_alpha=32,                # scaling = alpha / r = 4
    target_modules=["c_attn"],    # GPT-2: combined QKV projection
    lora_dropout=0.05,
    bias="none",
)

peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
# trainable params: 294,912 || all params: 124,734,720 || trainable%: 0.2364

# ── Manual LoRA layer in PyTorch ──────────────────────────────────────────────
import torch
import torch.nn as nn
import math


class LoRALinear(nn.Module):
    """Drop-in replacement for nn.Linear with LoRA adaptation."""

    def __init__(
        self,
        in_features: int,
        out_features: int,
        r: int = 4,
        lora_alpha: float = 1.0,
        lora_dropout: float = 0.0,
    ):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.r = r
        self.scale = lora_alpha / r

        # Frozen base weight
        self.weight = nn.Parameter(
            torch.empty(out_features, in_features), requires_grad=False
        )
        self.bias = nn.Parameter(torch.zeros(out_features), requires_grad=False)

        # Trainable LoRA matrices
        self.lora_A = nn.Parameter(torch.empty(r, in_features))
        self.lora_B = nn.Parameter(torch.zeros(out_features, r))

        self.dropout = nn.Dropout(lora_dropout) if lora_dropout > 0 else nn.Identity()

        # Initialise base weight (Kaiming) and LoRA A (Gaussian)
        nn.init.kaiming_uniform_(self.weight, a=math.sqrt(5))
        nn.init.normal_(self.lora_A, mean=0.0, std=0.02)
        # lora_B already zero: delta_W = 0 at init

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        base_out = nn.functional.linear(x, self.weight, self.bias)
        lora_out = self.dropout(x) @ self.lora_A.T @ self.lora_B.T
        return base_out + self.scale * lora_out

    def merge_weights(self) -> None:
        """Absorb LoRA into base weight for zero-overhead inference."""
        with torch.no_grad():
            self.weight += self.scale * (self.lora_B @ self.lora_A)
        del self.lora_A, self.lora_B

    def trainable_parameters(self) -> int:
        return self.lora_A.numel() + self.lora_B.numel()


# ── Demo ──────────────────────────────────────────────────────────────────────
torch.manual_seed(0)
layer = LoRALinear(in_features=4096, out_features=4096, r=4, lora_alpha=16)

x = torch.randn(2, 16, 4096)   # (batch, seq_len, d_model)
out = layer(x)
print(f"Output shape:        {tuple(out.shape)}")
print(f"Trainable params:    {layer.trainable_parameters():,}")
print(f"Total params:        {layer.weight.numel():,}")
print(f"Compression ratio:   {layer.weight.numel() / layer.trainable_parameters():.0f}x")

# Merge and verify output is unchanged
out_before = layer(x).detach()
layer.merge_weights()
out_after = nn.functional.linear(x, layer.weight, layer.bias)
max_err = (out_before - out_after).abs().max().item()
print(f"Max merge error:     {max_err:.2e}  (should be ~0)")
`

function PythonContent() {
    return (
        <>
            <p>
                Two implementations: first, applying LoRA to GPT-2 using HuggingFace PEFT in
                four lines. Second, a manual PyTorch <code>nn.Module</code> that replicates the
                full LoRA logic &mdash; frozen base weight, trainable A and B matrices, scaling,
                dropout, and weight merging for zero-overhead inference.
            </p>
            <CodeBlock code={PY_CODE} filename="lora_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const LORA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
