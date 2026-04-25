import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Bridging a frozen vision encoder and a frozen language model</h2>
            <p>
                Flamingo, introduced by Alayrac et al. at DeepMind in April 2022, solved a
                fundamental problem: how do you give an already-trained, 70B-parameter language
                model the ability to see images &mdash; without retraining it? The answer was
                gated cross-attention layers: thin bridging modules inserted between the LLM&rsquo;s
                existing layers, trained from scratch while every original LLM weight stays frozen.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019&ndash;2021</div>
                    <div className="ch-tl-section-label">Context</div>
                    <div className="ch-tl-title">Connecting Vision and Language &mdash; the Joint-Training Era</div>
                    <div className="ch-tl-body">
                        ViLBERT, OSCAR, UNITER, and similar models jointly trained on paired
                        image-text data. They achieved strong performance on tasks like VQA and
                        image captioning, but shared a critical bottleneck: every new task required
                        full fine-tuning. More importantly, you could not take a powerful
                        already-trained language model &mdash; like GPT-3 &mdash; and bolt vision
                        onto it without expensive joint retraining from scratch.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the landscape of vision-language models, exposed the retraining bottleneck</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021&ndash;2022</div>
                    <div className="ch-tl-section-label">Precursor</div>
                    <div className="ch-tl-title">The Frozen LLM Insight &mdash; ClipCap and Frozen</div>
                    <div className="ch-tl-body">
                        Several works discovered that a large LLM&rsquo;s knowledge could be repurposed
                        for new modalities if the LLM itself was kept frozen. ClipCap (Mokady et al.)
                        trained a small MLP to map CLIP image embeddings to prefix tokens for GPT-2.
                        Frozen (Tsimpoukelli et al., 2021) went further: freeze the LLM entirely,
                        train only a vision encoder to produce &ldquo;visual prefix&rdquo; embeddings that
                        the LLM interprets as if they were text tokens. These proofs-of-concept showed
                        the direction, but lacked the scale and architectural depth to match
                        joint-trained models.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved a frozen LLM could be steered by a trained visual prefix, at small scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Apr 2022</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Flamingo &mdash; Alayrac et al., DeepMind</div>
                    <div className="ch-tl-body">
                        Flamingo introduced a three-component architecture operating on top of a
                        frozen Chinchilla-70B LLM. (1) <strong>Vision encoder</strong>: an NFNet-F6
                        (Normalizer-Free ResNet) pretrained with CLIP-like contrastive training on
                        image-text pairs; (2) <strong>Perceiver Resampler</strong>: a cross-attention
                        module that takes the variable-length grid of visual features and produces a
                        fixed set of 64 visual tokens, regardless of image resolution; (3){" "}
                        <strong>Gated cross-attention layers</strong>: inserted every 4 layers of
                        the frozen LLM, each allowing the LLM to attend over the 64 visual tokens.
                        A learnable scalar &alpha; with tanh gating initializes at zero, so the
                        LLM&rsquo;s behavior is unchanged at the start of training &mdash; visual
                        information is introduced gradually as &alpha; grows.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that frozen LLMs could be given vision capabilities at scale with lightweight adapters</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Results</div>
                    <div className="ch-tl-title">Few-Shot Multimodal Performance</div>
                    <div className="ch-tl-body">
                        Flamingo&rsquo;s headline results were striking. Given just 4 (image, question,
                        answer) pairs as in-context examples &mdash; no task-specific fine-tuning
                        &mdash; Flamingo-80B achieved state-of-the-art on VQAv2 (82.0%), OK-VQA
                        (57.8%), and TextVQA (54.1%). On COCO captioning, 4-shot Flamingo matched
                        a fully fine-tuned ResNet-based system. This demonstrated that the same
                        in-context learning (ICL) mechanism that made GPT-3 powerful for text could
                        be extended to interleaved image-text sequences &mdash; enabling multimodal
                        few-shot learning without any gradient updates at test time.
                    </div>
                    <div className="ch-tl-impact">Impact: Set new few-shot state-of-the-art on 6 out of 16 multimodal benchmarks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022&ndash;2023</div>
                    <div className="ch-tl-section-label">Open Source</div>
                    <div className="ch-tl-title">OpenFlamingo and IDEFICS</div>
                    <div className="ch-tl-body">
                        The open-source community rapidly reproduced Flamingo&rsquo;s architecture.
                        OpenFlamingo (Awadalla et al., 2023) used a CLIP ViT-L vision encoder and
                        either OPT or LLaMA as the frozen LLM, trained on LAION-2B and
                        Multimodal-C4. IDEFICS (Laurençon et al., 2023) was HuggingFace&rsquo;s open
                        reproduction trained on LAION-5B and Wikipedia image-text pairs. Both
                        closely followed Flamingo&rsquo;s gated cross-attention design and democratized
                        multimodal model research by making weights and code publicly available.
                    </div>
                    <div className="ch-tl-impact">Impact: Democratized multimodal model research; enabled the open-source ecosystem</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">LLaVA &mdash; A Linear Projection Suffices</div>
                    <div className="ch-tl-body">
                        Liu et al. (2023) showed that Flamingo&rsquo;s elaborate Perceiver Resampler
                        and gated cross-attention could be replaced with a single linear projection
                        layer between CLIP ViT-L features and a Vicuna (LLaMA fine-tune) LLM.
                        Paired with a small but carefully curated visual instruction-following
                        dataset of 158K examples, LLaVA matched or exceeded Flamingo&rsquo;s performance
                        on several benchmarks &mdash; and could be trained in hours on a single
                        8-GPU machine. This revealed that the key ingredient was less architectural
                        complexity and more the quality of multimodal instruction data.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that a simpler bridge + instruction data could match Flamingo&rsquo;s full architecture</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023&ndash;2024</div>
                    <div className="ch-tl-section-label">Next Generation</div>
                    <div className="ch-tl-title">GPT-4V, Gemini, and Native Multimodal Pretraining</div>
                    <div className="ch-tl-body">
                        GPT-4V (OpenAI, 2023) and Gemini (Google DeepMind, 2023) represented the
                        next generation: natively multimodal at the pretraining level, not
                        retrofitted onto a frozen text LLM. Rather than adapting a language model
                        to see images, they trained from the start on interleaved text, image,
                        audio, and video data at massive scale. Yet the Flamingo insight remains
                        foundational: for efficient multimodal adaptation of an existing LLM
                        &mdash; when you cannot afford to pretrain from scratch &mdash; gated
                        cross-attention with a frozen backbone is still the reference architecture.
                    </div>
                    <div className="ch-tl-impact">Impact: Established natively multimodal pretraining as the frontier; Flamingo&rsquo;s adapter approach remained the efficient alternative</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core Flamingo insight:</strong> A frozen large language model is not
                a dead end &mdash; it is a foundation. By keeping the LLM&rsquo;s weights unchanged
                and only training lightweight cross-attention bridges, Flamingo showed that
                billions of parameters of learned language knowledge could be repurposed for
                multimodal tasks at a fraction of the cost of joint pretraining. The tanh gating
                that initializes to zero is a small technical choice with a large conceptual
                implication: you can add new capabilities to a model without disturbing the
                capabilities it already has.
            </div>

            <Analogy label="What comes next &mdash; Retrieval-Augmented Generation">
                Flamingo showed that large models could be extended to new modalities without
                retraining their core knowledge. But both language and multimodal models share a
                fundamental limitation: their knowledge is frozen at training time. They can&rsquo;t
                look up yesterday&rsquo;s news, access a private company database, or cite a specific
                document they haven&rsquo;t memorized. Retrieval-Augmented Generation &mdash; RAG
                &mdash; solves this by giving models access to an external knowledge store at
                inference time. Chapter 27 covers how retrieval and generation combine into a
                system that knows both what it learned and what it can look up.
            </Analogy>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Teaching a word-brain to see &mdash; without erasing what it knows</h2>

            <Analogy label="The Translator Between Eyes and Words">
                Imagine a genius who knows every language ever written &mdash; but was born blind.
                Instead of teaching them everything all over again from scratch with pictures,
                you hire a small team of translators who sit between their eyes and their brain.
                The translators watch what the eyes see and whisper descriptions in a language
                the genius already understands. That&rsquo;s exactly what Flamingo does: the frozen
                language model is the genius, and the gated cross-attention layers are the
                whispering translators inserted at every floor of their mind.
            </Analogy>

            <Analogy label="Why Not Retrain the Whole Brain?">
                Training a 70-billion-parameter language model from scratch costs millions of
                dollars and months of computer time. Flamingo&rsquo;s big idea: don&rsquo;t touch the
                language model at all. Keep every single one of its 70 billion weights frozen
                &mdash; locked, unchanged. Only train the small bridging layers that connect
                vision to language. It&rsquo;s like teaching someone who already speaks perfect
                French to understand sign language &mdash; you don&rsquo;t make them forget French
                and re-learn everything. You just teach them to silently translate signs into
                French words inside their head before they answer.
            </Analogy>

            <Analogy label="The Perceiver Resampler: Summarizing What You See">
                A single photograph contains millions of pixels. That&rsquo;s far too much
                information for a language model to look at all at once. The Perceiver
                Resampler is Flamingo&rsquo;s compression expert: it takes all those visual
                details and squeezes them down into exactly 64 &ldquo;visual tokens&rdquo; &mdash;
                64 little packets of summarized information. It&rsquo;s like writing a
                64-word summary of everything in a photograph: enough for the language model
                to understand the scene without being overwhelmed by every single pixel.
            </Analogy>

            <Analogy label="The Gated Door">
                There&rsquo;s a clever trick in how Flamingo starts training: the gate that lets
                visual information into the language model begins completely shut &mdash; at
                zero. At the very start, the language model ignores all images entirely and
                behaves exactly as it always did. As training progresses, the gate slowly
                opens, letting more and more visual signal through. This means the language
                model&rsquo;s linguistic knowledge is never disrupted &mdash; you only introduce
                images gradually, once the model has started to learn how to make use of them.
            </Analogy>

            <Analogy label="Few-Shot Multimodal: Teaching by Example">
                One of Flamingo&rsquo;s superpowers is few-shot learning with images. Show it
                three examples: (photo of a golden retriever &rarr; &ldquo;a golden retriever&rdquo;),
                (photo of a tabby cat &rarr; &ldquo;a tabby&rdquo;), (photo of a parrot &rarr;
                &ldquo;a parrot&rdquo;). Now show a new photo and ask &ldquo;what is this?&rdquo; &mdash;
                Flamingo answers correctly, having learned the pattern from just those three
                examples. No extra training, no gradient updates. Just like GPT-3 learns a
                new text task from a few examples in the prompt, Flamingo learns a new
                multimodal task from a few image-caption pairs in context.
            </Analogy>

            <Analogy label="LLaVA: The Shortcut">
                After Flamingo, researchers at Microsoft asked: do we really need the Perceiver
                Resampler and the gated cross-attention? What if we just used a single straight
                line &mdash; one linear projection &mdash; to connect the image features to the
                language model? With a small but carefully chosen set of training examples,
                LLaVA achieved similar multimodal ability at a tiny fraction of Flamingo&rsquo;s
                complexity. Sometimes a simpler bridge works just as well, especially when
                the training data is well-chosen. Flamingo proved the concept; LLaVA proved
                it didn&rsquo;t have to be complicated.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Gated cross-attention adapters for frozen multimodal language models</h2>

            <h3>1. Perceiver Resampler</h3>
            <p>
                The NFNet vision encoder produces a variable-length grid of spatial features
                depending on the input image resolution. Let{" "}
                <strong>X<sub>v</sub> &isin; &#8477;<sup>T<sub>v</sub> &times; d<sub>v</sub></sup></strong>{" "}
                denote these T<sub>v</sub> visual feature vectors (T<sub>v</sub> varies with
                resolution). Passing a variable number of tokens directly into the LLM would
                be architecturally incompatible with fixed sequence budgets and computationally
                expensive. The Perceiver Resampler resolves this with a set of{" "}
                <strong>Q = 64 learned query vectors</strong> that attend over X<sub>v</sub>
                via cross-attention, producing a fixed 64-token output regardless of image size:
            </p>
            <MathBlock tex="\mathbf{Y} = \mathrm{CrossAttn}\!\left(\mathbf{Q}_{\mathrm{learned}},\; \mathbf{K} = \mathbf{X}_v,\; \mathbf{V} = \mathbf{X}_v\right) \;\in\; \mathbb{R}^{64 \times d}" />
            <p>
                The 64 query vectors Q<sub>learned</sub> are the only parameters in the
                Perceiver Resampler that need to be learned (along with the attention projection
                matrices). The resulting 64 visual tokens Y are then passed as the key-value
                pairs into every gated cross-attention layer inside the frozen LLM.
            </p>

            <h3>2. Gated Cross-Attention Layer</h3>
            <p>
                A new cross-attention sub-layer is inserted every k = 4 transformer blocks in
                the frozen Chinchilla-70B LLM. Let <strong>h</strong> denote the LLM&rsquo;s hidden
                state at a given layer and <strong>Y</strong> the 64 Perceiver output tokens.
                The gated cross-attention update is:
            </p>
            <MathBlock tex="\mathbf{h}' = \mathbf{h} + \tanh(\alpha) \cdot \mathrm{CrossAttn}(\mathbf{h},\; \mathbf{Y})" />
            <p>
                where &alpha; is a <strong>trainable scalar initialized to 0</strong>. At
                initialization: tanh(0) = 0, so h&prime; = h &mdash; the frozen LLM is
                completely unperturbed. As training proceeds, &alpha; grows, and visual
                information is gradually introduced into the LLM&rsquo;s hidden states. This
                &ldquo;tanh gating&rdquo; acts as a soft trust-region: the model never has to unlearn its
                existing language capability in order to incorporate visual signals.
            </p>

            <h3>3. Interleaved Image-Text Sequences</h3>
            <p>
                Flamingo processes multimodal sequences of the form:
            </p>
            <MathBlock tex="s = \bigl[\mathrm{Image}_1\bigr]\,[\mathrm{Text}_1]\,\bigl[\mathrm{Image}_2\bigr]\,[\mathrm{Text}_2]\;\cdots\;\bigl[\mathrm{Image}_q\bigr]\,[\mathrm{Text}_q]" />
            <p>
                Each image is replaced by its 64 Perceiver Resampler output tokens. The LLM
                generates the missing text autoregressively, conditioned on all preceding
                image and text tokens. In <strong>few-shot mode</strong>, the first k triplets
                serve as in-context examples (like GPT-3&rsquo;s few-shot prompting), and the
                model generates the answer for the final image:
            </p>
            <MathBlock tex="\mathcal{L} = -\sum_{t} \log p_\theta\!\left(y_t \;\middle|\; y_{<t},\; \mathrm{Image}_1, \ldots, \mathrm{Image}_q\right)" />
            <p>
                This unified autoregressive objective with interleaved visual tokens enables
                zero-shot and few-shot multimodal learning within a single architecture, with
                no task-specific fine-tuning at inference time.
            </p>

            <h3>4. Training and Parameter Efficiency</h3>
            <p>
                Flamingo-80B parameter breakdown: the NFNet-F6 vision encoder (~800M params,
                frozen after visual pretraining), the Perceiver Resampler (~10M params,
                trained), the gated cross-attention layers (~1.5B params total, trained), and
                the Chinchilla-70B LLM (~70B params, completely frozen). Only the
                ~1.5B bridging parameters are updated during multimodal training on 312M
                (image, text) pairs plus 27B text tokens from the web. The parameter
                efficiency ratio &mdash; trainable adapter parameters relative to total
                model parameters &mdash; is:
            </p>
            <MathBlock tex="\eta = \frac{N_{\mathrm{adapter}}}{N_{\mathrm{total}}} = \frac{1.5\,\mathrm{B}}{72.3\,\mathrm{B}} \approx 2.1\%" />
            <p>
                Training only 2.1% of the total parameter count while achieving competitive
                multimodal performance is the key efficiency argument for the frozen-adapter
                paradigm.
            </p>

            <h3>5. Architectural Comparison</h3>
            <p>
                Flamingo&rsquo;s adapter approach sits on a spectrum between full joint pretraining
                and minimal probe-style adaptation:
            </p>
            <div className="ch-table">
                <table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Trainable params</th>
                            <th>Image-text training pairs</th>
                            <th>Approach</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Flamingo-80B</td>
                            <td>~1.5B</td>
                            <td>312M</td>
                            <td>Gated cross-attention adapter</td>
                        </tr>
                        <tr>
                            <td>LLaVA</td>
                            <td>~0.5M&ndash;7M</td>
                            <td>158K (instruction)</td>
                            <td>Single linear projection</td>
                        </tr>
                        <tr>
                            <td>GPT-4V</td>
                            <td>All (joint training)</td>
                            <td>Undisclosed (very large)</td>
                            <td>Native multimodal pretraining</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                The adapter efficiency metric &mdash; few-shot VQAv2 accuracy per billion
                trainable parameters &mdash; strongly favors Flamingo over full joint
                pretraining, though native multimodal models surpass it on absolute performance.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Gradient flow &middot; tanh gating analysis &middot; cross-attention derivation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch pseudocode &middot; PerceiverResampler &middot; GatedCrossAttention</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Gradient flow and the tanh gating mechanism</h2>

            <DefBlock label="Cross-Attention in the Frozen LLM">
                Let W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>, W<sub>O</sub> be the weight
                matrices of the gated cross-attention layer (all trainable). The hidden state{" "}
                <strong>h &isin; &#8477;<sup>d</sup></strong> attends over the 64 Perceiver
                tokens <strong>Y &isin; &#8477;<sup>64 &times; d</sup></strong>:
            </DefBlock>
            <MathBlock tex="\mathrm{CrossAttn}(\mathbf{h}, \mathbf{Y}) = \mathbf{W}_O \cdot \mathrm{softmax}\!\left(\frac{(\mathbf{h}\mathbf{W}_Q)(\mathbf{Y}\mathbf{W}_K)^\top}{\sqrt{d_k}}\right)(\mathbf{Y}\mathbf{W}_V)" />

            <h3>Gradient Flow Through Frozen Layers</h3>
            <p>
                Because the LLM weights are frozen, gradients from the multimodal loss
                backpropagate through the gated cross-attention output but are{" "}
                <strong>blocked</strong> from flowing into the LLM&rsquo;s self-attention and
                feed-forward weights. The gradient with respect to the gated layer&rsquo;s
                output is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}'} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}'} \cdot \mathbf{I} \quad\text{(identity, flows to both h and the cross-attn branch)}" />
            <p>
                The gradient reaching the cross-attention branch is scaled by the gate:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{W}_Q} = \tanh(\alpha) \cdot \frac{\partial \mathcal{L}}{\partial \mathbf{h}'} \cdot \frac{\partial\, \mathrm{CrossAttn}}{\partial \mathbf{W}_Q}" />
            <p>
                At initialization (&alpha; = 0), tanh(0) = 0 and the gradient is zero &mdash;
                the cross-attention weights receive no update on the first step. This is the
                &ldquo;zero-initialization&rdquo; trick: training begins from a point where the model
                is exactly the frozen LLM, and the adapter grows from there.
            </p>

            <h3>Tanh Gating as a Trust-Region Mechanism</h3>
            <p>
                The tanh gating can be interpreted as a soft trust-region constraint. Define
                the effective visual weight as g(&alpha;) = tanh(&alpha;) &isin; (-1, 1).
                The update to h is bounded:
            </p>
            <MathBlock tex="\|\mathbf{h}' - \mathbf{h}\|_2 = |g(\alpha)| \cdot \|\mathrm{CrossAttn}(\mathbf{h}, \mathbf{Y})\|_2 \leq \|\mathrm{CrossAttn}(\mathbf{h}, \mathbf{Y})\|_2" />
            <p>
                The cross-attention output is the maximum perturbation magnitude; the gate
                g(&alpha;) scales it between 0 and 1. This prevents the visual signal from
                overwhelming the LLM&rsquo;s hidden states early in training.
            </p>

            <h3>Perceiver Resampler: Complexity Analysis</h3>
            <p>
                Standard full cross-attention between T<sub>v</sub> image tokens and the
                LLM&rsquo;s sequence of length T<sub>L</sub> text tokens would cost
                O(T<sub>v</sub> &times; T<sub>L</sub>) per layer. The Perceiver Resampler
                reduces this in two steps: first, attend the 64 learned queries over T<sub>v</sub>
                visual tokens (cost O(64 &times; T<sub>v</sub>)); then, in the LLM layers,
                attend text tokens over just 64 visual tokens (cost O(T<sub>L</sub> &times; 64)).
                Total cost per layer:
            </p>
            <MathBlock tex="\mathcal{O}(64 \cdot T_v + T_L \cdot 64) = \mathcal{O}(64 \cdot (T_v + T_L))" />
            <p>
                For a 1024-pixel image (T<sub>v</sub> ~ 256) and a 2048-token context
                (T<sub>L</sub> = 2048), this is ~149K operations per layer compared to
                ~524K for full cross-attention &mdash; a 3.5&times; reduction from the
                compression bottleneck.
            </p>

            <div className="ch-callout">
                <strong>Key theoretical property:</strong> The zero-initialized tanh gate
                guarantees that the multimodal model is a strict generalization of the
                original LLM at initialization. Any function computable by the frozen LLM
                alone is also computable by the Flamingo model with &alpha; = 0. Training
                can only add multimodal capability &mdash; it cannot (in principle) degrade
                the base language capability below the frozen baseline.
            </div>
        </>
    )
}

// ── Python pseudocode ─────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Perceiver Resampler ───────────────────────────────────────────────────────
class PerceiverResampler(nn.Module):
    """
    Compress variable-length visual features into exactly num_queries tokens.
    Input:  x_v  shape (B, T_v, d_v)   — variable number of visual features
    Output: y    shape (B, num_queries, d)  — fixed 64 visual tokens
    """
    def __init__(self, d_v: int, d: int, num_queries: int = 64, num_heads: int = 8):
        super().__init__()
        self.queries = nn.Parameter(torch.randn(num_queries, d))  # learned queries
        self.proj_in = nn.Linear(d_v, d)
        self.cross_attn = nn.MultiheadAttention(d, num_heads, batch_first=True)
        self.norm = nn.LayerNorm(d)

    def forward(self, x_v: torch.Tensor) -> torch.Tensor:
        B = x_v.shape[0]
        x_v = self.proj_in(x_v)                          # (B, T_v, d)
        q = self.queries.unsqueeze(0).expand(B, -1, -1)  # (B, 64, d)
        y, _ = self.cross_attn(q, x_v, x_v)              # (B, 64, d)
        return self.norm(y)

# ── Gated Cross-Attention Layer ───────────────────────────────────────────────
class GatedCrossAttention(nn.Module):
    """
    h' = h + tanh(alpha) * CrossAttn(h, visual_tokens)
    alpha is a scalar initialized to 0 — gate starts fully closed.
    """
    def __init__(self, d: int, num_heads: int = 8):
        super().__init__()
        self.cross_attn = nn.MultiheadAttention(d, num_heads, batch_first=True)
        self.norm = nn.LayerNorm(d)
        self.alpha = nn.Parameter(torch.zeros(1))  # tanh gate — init at 0

    def forward(
        self,
        h: torch.Tensor,           # (B, T_L, d) — LLM hidden states
        visual_tokens: torch.Tensor  # (B, 64, d)  — Perceiver output
    ) -> torch.Tensor:
        attn_out, _ = self.cross_attn(h, visual_tokens, visual_tokens)
        attn_out = self.norm(attn_out)
        gate = torch.tanh(self.alpha)
        return h + gate * attn_out   # frozen h passes through; gate scales visual signal

# ── Frozen LLM Block (stub) ───────────────────────────────────────────────────
class FrozenLLMBlock(nn.Module):
    """Stub representing one transformer block of the frozen LLM."""
    def __init__(self, d: int):
        super().__init__()
        self.self_attn = nn.MultiheadAttention(d, 8, batch_first=True)
        self.ffn = nn.Sequential(nn.Linear(d, 4 * d), nn.GELU(), nn.Linear(4 * d, d))
        self.norm1 = nn.LayerNorm(d)
        self.norm2 = nn.LayerNorm(d)
        # Freeze all weights
        for p in self.parameters():
            p.requires_grad = False

    def forward(self, h: torch.Tensor) -> torch.Tensor:
        h = h + self.self_attn(h, h, h)[0]
        h = self.norm1(h)
        h = h + self.ffn(h)
        return self.norm2(h)

# ── Flamingo Forward Pass (simplified) ───────────────────────────────────────
class FlamingoLayer(nn.Module):
    """
    One Flamingo unit: frozen LLM block + gated cross-attention.
    Inserted every k=4 LLM layers in the full model.
    """
    def __init__(self, d: int):
        super().__init__()
        self.llm_block = FrozenLLMBlock(d)
        self.gated_cross_attn = GatedCrossAttention(d)

    def forward(
        self,
        h: torch.Tensor,
        visual_tokens: torch.Tensor
    ) -> torch.Tensor:
        h = self.llm_block(h)
        h = self.gated_cross_attn(h, visual_tokens)
        return h

# ── Demo: interleaved image-text forward pass ─────────────────────────────────
B, T_v, d_v, d, T_L = 2, 256, 1536, 1024, 128

# Vision encoder output (e.g., NFNet spatial features)
x_v = torch.randn(B, T_v, d_v)

# Perceiver Resampler: compress to 64 fixed visual tokens
resampler = PerceiverResampler(d_v=d_v, d=d, num_queries=64)
visual_tokens = resampler(x_v)  # (B, 64, d)

# Text token embeddings (from the LLM's embedding layer)
h = torch.randn(B, T_L, d)  # (B, T_L, d)

# Three Flamingo layers (in full model: 70B LLM has many more, gate every 4)
layers = [FlamingoLayer(d) for _ in range(3)]
for layer in layers:
    h = layer(h, visual_tokens)

print(f"Input visual features:  {x_v.shape}")
print(f"Perceiver output tokens: {visual_tokens.shape}")
print(f"LLM hidden states out:  {h.shape}")
# Input visual features:   torch.Size([2, 256, 1536])
# Perceiver output tokens: torch.Size([2, 64, 1024])
# LLM hidden states out:   torch.Size([2, 128, 1024])
`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch pseudocode implementing the three core Flamingo components: the
                Perceiver Resampler (variable visual features &rarr; 64 fixed tokens), the
                Gated Cross-Attention layer (tanh gate initialized at zero), and a simplified
                forward pass over an interleaved image-text sequence.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="flamingo_architecture.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const FLAMINGO_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
