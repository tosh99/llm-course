import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The paradigm that changed everything</h2>
            <p>
                Before 2018, every NLP system was built from scratch for its specific task. Need a sentiment
                classifier? Collect 10,000 labeled reviews and train a model. Need a question-answering system?
                Collect 100,000 question-answer pairs and train another model. The "pre-train then fine-tune"
                paradigm destroyed this workflow: train one powerful model on unlabeled text, then adapt it
                to any task with a tiny amount of labeled data.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Pre-2013</div>
                    <div className="ch-tl-title">Task-Specific Training — The Annotated Data Bottleneck</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Every NLP task required its own labeled dataset, feature engineering, and model architecture. A named entity recognizer used CRFs with hand-crafted features. A dependency parser used graph-based algorithms with linguistic rules. A sentiment classifier used bag-of-words with SVMs. There was almost no transfer of knowledge between tasks. Labeled data was the limiting factor: expensive to collect, slow to annotate, and specific to each task.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Task-specific architectures became increasingly sophisticated — bidirectional LSTMs with CRF layers for sequence labeling, memory networks for QA, tree-LSTMs for sentiment. Each improvement required task-specific design and more labeled data. The implicit assumption was that NLP tasks were fundamentally different from one another and required separate systems.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Progress was directly gated by the cost and time of manual annotation. Building a state-of-the-art NLP system for a new language or domain required months of data collection, annotation, and system design. Small languages, specialized domains, and under-resourced settings were left behind. The "labeled data bottleneck" was a fundamental constraint on democratizing NLP.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 — Mikolov, Pennington et al.</div>
                    <div className="ch-tl-title">Word Embeddings — Shallow Transfer Begins</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Neural network-based NLP models learned word representations from scratch alongside the task, requiring large labeled datasets to get the embeddings right. Words that were rare in the labeled dataset received poor representations. Synonyms that appeared in different contexts were not recognized as similar. The input layer was being reinvented for every task.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Word2Vec and GloVe introduced the first form of transfer in NLP: pretrained word vectors that could be reused across tasks. The embedding layer was initialized with weights from unsupervised pretraining on billions of words, giving every model a head start. "Excellent" and "outstanding" already shared similar vector neighborhoods before any labeled examples were seen.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Pretrained word embeddings consistently improved accuracy across NLP tasks — usually by several percent. They became universal: every serious NLP model initialized with Word2Vec or GloVe. But the transfer was shallow: only the input layer benefited. The entire model architecture (LSTM, CNN) was still trained from scratch. The principle was correct; the implementation was incomplete.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2012 – 2015 — Zeiler, Donahue et al.</div>
                    <div className="ch-tl-title">ImageNet Transfer Learning — The Template from Vision</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Computer vision researchers faced the same problem: training CNNs from scratch on domain-specific datasets (medical images, satellite photos, industrial defects) was expensive and required large labeled datasets. Yet ImageNet-trained models had learned rich general visual features — edges, textures, shapes, objects — that seemed relevant to many other visual tasks.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Zeiler and Fergus (2014) visualized what AlexNet's layers learned and showed that early layers captured generic features (edges, colors) while later layers captured task-specific features (object parts, whole objects). Donahue et al. and others showed that features extracted from ImageNet-pretrained models transferred beautifully to other vision tasks — with the rule: freeze early layers, fine-tune later layers on the target task.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The vision transfer learning recipe became the template: pretrain on a large general dataset, fine-tune only what's needed for the target task. NLP researchers watched this success and began asking: why doesn't the same approach work for language? The answer — it does, but only with the right fine-tuning discipline — was discovered in 2018 by ULMFiT, ELMo, and GPT-1.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 — Howard, Peters, Radford et al.</div>
                    <div className="ch-tl-title">The Paradigm Shift — Deep NLP Transfer Arrives</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Naive fine-tuning of pretrained language models had failed due to catastrophic forgetting. The challenge was not finding a pretrained model to fine-tune — it was fine-tuning without destroying the general knowledge that made pretraining valuable. The solution required rethinking learning rate scheduling, layer freezing strategies, and the relationship between pretraining and fine-tuning objectives.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Three approaches in rapid succession — ULMFiT's disciplined fine-tuning recipe (discriminative LRs, gradual unfreezing), ELMo's frozen feature extraction with task-specific layer weighting, and GPT-1's structured input formatting with full model fine-tuning — all demonstrated that deep NLP transfer worked at scale. Each captured a different aspect of the paradigm. Together, they proved the paradigm comprehensively.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The paradigm shift reduced labeled data requirements by 10-100x for many tasks. NLP practitioners could achieve competitive results with dozens of examples rather than thousands. Small teams without annotation budgets could build production NLP systems. The "labeled data bottleneck" was broken — at least partially. BERT would break it further in October 2018.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2021 — Various</div>
                    <div className="ch-tl-title">Fine-Tuning Variants — Adapters, Prompt Tuning, LoRA</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        As pretrained models grew larger (BERT-Large: 340M params; GPT-3: 175B params), full fine-tuning became computationally expensive. For every new task, a complete copy of the model needed to be stored and served. Organizations deploying dozens of task-specific models faced storage and inference costs that scaled linearly with the number of tasks. Parameter-efficient fine-tuning was needed.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Adapter layers (Houlsby et al. 2019) inserted small bottleneck modules (&#60;1% of parameters) into each Transformer layer, training only those while freezing the pretrained backbone. Prefix tuning (Li and Liang 2021) prepended learnable "soft prompt" vectors. LoRA (Hu et al. 2022) decomposed weight updates into low-rank matrices. All achieved near-full-fine-tuning performance with 0.1-1% of the parameters updated.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Parameter-efficient fine-tuning made large model deployment practical: one frozen pretrained backbone served all tasks, with tiny task-specific modules added at inference time. LoRA in particular became standard for fine-tuning 7B-70B parameter models on consumer hardware. The fine-tuning paradigm matured from "full model fine-tuning" to "surgical parameter updates" — more efficient and often more effective.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2023 — Brown et al., OpenAI, Anthropic</div>
                    <div className="ch-tl-title">From Fine-Tuning to Prompting — The Next Paradigm</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Even parameter-efficient fine-tuning required some task-specific data and computation. For truly zero-shot applications — where no examples are available for a new task — fine-tuning was not an option. And as models grew to hundreds of billions of parameters, in-context learning (providing examples in the prompt) became competitive with fine-tuning in terms of accuracy.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        GPT-3 demonstrated that sufficiently large models could perform tasks with in-context learning — no gradient updates, just a carefully written prompt with a few examples. Instruction tuning (FLAN, InstructGPT) fine-tuned models on diverse task instructions, creating general instruction followers. RLHF (Reinforcement Learning from Human Feedback) aligned models to human preferences, producing ChatGPT (2022).
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The fundamental insight of 2018 remains: pretrain once on unlabeled data, then use the model for everything. What changed was how "use the model" is defined — from gradient-based fine-tuning to prompt engineering to RLHF alignment. The pretrain-then-finetune paradigm naturally evolved into pretrain-then-prompt at scale. BERT's encoder-only successors and GPT's decoder-only successors both trace their roots to the 2018 convergence.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Unsupervised pretraining on raw text forces a model
                to learn the full structure of language — syntax, semantics, facts, and reasoning —
                without any human labels. Task-specific fine-tuning then acts as a lightweight steering
                mechanism, aligning the model's general knowledge to a specific objective.
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> GPT-1 and ULMFiT proved that unidirectional language model pre-training transferred effectively to downstream tasks. But reading text only left-to-right misses context from the right side: understanding "bank" in "I went to the bank to deposit my check" requires seeing both sides of the sentence simultaneously. Google's BERT (October 2018) solved this by masking random words and predicting them from both directions at once — the first truly bidirectional pre-trained language model. Chapter 19 follows BERT's architecture, training objectives, and the cascade of improvements it inspired.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learn once, use everywhere</h2>

            <Analogy label="The Art School (Old Way)">
                <p>Imagine every time you wanted to draw something new — a cat, a car, a tree — you had to
                go to a special art school just for that thing. You'd spend months learning to draw cats,
                then months learning to draw cars, starting from zero each time. That's how NLP used to
                work: every task needed its own training from scratch.</p>
                <p>And the biggest problem was finding teachers. Each art school needed thousands of labeled examples — annotated images, tagged sentences, question-answer pairs. Annotation is expensive, slow, and often wrong. Progress was gated by how fast humans could label data.</p>
            </Analogy>

            <Analogy label="The Master Artist (Pre-training)">
                <p>Now imagine a different path: you spend ten years at a general art school, drawing
                everything — people, animals, buildings, landscapes. You learn light, shadow, perspective,
                color theory. You become a master artist. Then someone asks you to draw a specific cat.
                You don't need to relearn art; you just apply your general skills to this one request.</p>
                <p>The general art school is trained on unlabeled data — no one has to annotate anything. The model just predicts the next word, or fills in missing words, and learns language naturally. Billions of words of books, Wikipedia, and web text provide the curriculum for free.</p>
            </Analogy>

            <Analogy label="The Gentle Nudge (Fine-tuning)">
                <p>Fine-tuning is like someone saying "I love your style, but can you make the cats a bit
                fluffier?" You don't forget how to draw everything else. You just adjust your cat-drawing
                slightly. And because you're already a master, you only need to see a few fluffy cats
                to get it right.</p>
                <p>In NLP, fine-tuning means showing the pretrained model a few hundred or thousand labeled examples of the target task. The model adjusts its last few layers while keeping its deep language knowledge intact. The result: near-expert performance with a fraction of the labeled data.</p>
            </Analogy>

            <Analogy label="The Head — The Task-Specific Add-On">
                <p>When fine-tuning for different tasks, you add a tiny extra component called a "head" on top of the pretrained model. For sentiment classification, the head is a simple decision layer that says "positive" or "negative." For question answering, the head picks the start and end of the answer span. For named entity recognition, the head labels every word.</p>
                <p>The pretrained body does all the heavy lifting. The tiny head just tells it what kind of output is needed. It's like hiring a master chef (pretrained model) and telling them "today we're making dessert" — they don't need a cooking lesson; they just need the menu.</p>
            </Analogy>

            <Analogy label="Catastrophic Forgetting — The Danger of Moving Too Fast">
                <p>There's one trap: if you change the pretrained model too aggressively during fine-tuning, it forgets what it learned. It's like forcing the master artist to paint only cats for a month — they might forget how to paint anything else. Researchers call this "catastrophic forgetting."</p>
                <p>The solution: use a very small learning rate (change the weights slowly), train for only a few epochs, and sometimes freeze the early layers entirely. This preserves the deep general knowledge while allowing the top layers to specialize for the new task.</p>
            </Analogy>

            <Analogy label="What comes next — Reading both ways">
                <p>GPT-1 learned to read text left to right and got remarkably good at language tasks. But reading only one direction misses information. Chapter 19 shows how BERT fixed this: it masked random words in sentences and learned to predict them using context from BOTH the left and the right simultaneously — like solving a fill-in-the-blank puzzle where you can see the whole sentence except the blank word.</p>
                <p>BERT's bidirectionality made it dramatically better at understanding tasks — reading comprehension, named entity recognition, sentence classification. While GPT scaled generation toward ChatGPT, BERT scaled understanding toward Google Search. Both trace back to the same pretrain-then-finetune paradigm introduced in 2018.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The two-stage recipe and its variants</h2>

            <h3>Stage 1 — Unsupervised Pretraining</h3>
            <p>
                Train a large neural network on a massive corpus of unlabeled text using a self-supervised
                objective. The most common objectives are:
            </p>
            <ul>
                <li><strong>Causal Language Modeling (CLM):</strong> Predict the next word given all previous words (GPT family). Dense training signal: every token is predicted.</li>
                <li><strong>Masked Language Modeling (MLM):</strong> Randomly mask 15% of tokens and predict them from bidirectional context (BERT, RoBERTa). Richer context but sparser signal.</li>
                <li><strong>Span Corruption:</strong> Mask contiguous spans and replace them with sentinel tokens; predict the original spans (T5). Combines advantages of both.</li>
                <li><strong>Replaced Token Detection:</strong> Corrupt tokens with a small generator model; discriminator predicts which tokens are fake (ELECTRA). Training signal on every token, no decoder needed.</li>
            </ul>
            <p>
                All objectives force the model to learn the full structure of language without human labels.
                This stage is amortized across all downstream tasks: train once, deploy everywhere.
            </p>

            <h3>Stage 2 — Supervised Fine-Tuning</h3>
            <p>
                Take the pretrained model and train it on labeled data for a specific task. Critical
                techniques prevent catastrophic forgetting and maximize transfer:
            </p>
            <ul>
                <li><strong>Small learning rate:</strong> Typically 1e-5 to 3e-5 (vs. 1e-3 for training from scratch). The pretrained weights are close to optimal; large updates destroy their structure.</li>
                <li><strong>Few epochs:</strong> Usually 2-5 epochs suffice. More leads to overfitting on the small labeled dataset and catastrophic forgetting of pretrained knowledge.</li>
                <li><strong>Task-specific head:</strong> A minimal layer is added above the pretrained body. For classification: a linear layer on the [CLS] token. For span extraction: two linear layers predicting start and end positions. For token labeling: a linear layer on every token.</li>
                <li><strong>Warm-up schedule:</strong> Linear warm-up for the first 10% of steps, then linear or cosine decay. This prevents large, destabilizing gradient steps early in fine-tuning.</li>
            </ul>

            <h3>Learning Rate Ratios — A Practical Guide</h3>
            <p>
                A key practical insight: the pretrained backbone and the new task-specific head require
                very different learning rates. The backbone holds valuable pretrained knowledge; the head
                starts from random initialization:
            </p>
            <ul>
                <li><strong>Pretrained backbone:</strong> Use LR = 1e-5 to 5e-5. Small enough to preserve pretrained features while allowing domain adaptation.</li>
                <li><strong>New task head:</strong> Use LR = 1e-4 to 1e-3. The head starts random and needs to converge quickly to useful task-specific outputs.</li>
                <li><strong>Ratio:</strong> Typically 10-100x difference between head and backbone LRs. ULMFiT's discriminative fine-tuning extended this principle to every layer individually.</li>
            </ul>

            <h3>Variants and Parameter-Efficient Fine-Tuning</h3>
            <p>
                As models grew to hundreds of billions of parameters, full fine-tuning became impractical.
                Parameter-efficient fine-tuning (PEFT) methods solve this:
            </p>
            <ul>
                <li><strong>Adapter layers (Houlsby 2019):</strong> Insert small bottleneck networks (d &#8594; r &#8594; d, r &#8810; d) after each attention and FFN layer. Freeze all original parameters; train only adapters. Achieves &#62;95% of full fine-tuning performance with &#60;1% of parameters updated.</li>
                <li><strong>Prefix tuning (Li &amp; Liang 2021):</strong> Prepend learnable "soft prompt" vectors to the key and value matrices of every attention layer. Freeze the model; train only the prefix vectors.</li>
                <li><strong>LoRA (Hu et al. 2022):</strong> Decompose weight updates as &#916;W = BA where B &#8712; &#8477;&#7496;&#215;&#691;, A &#8712; &#8477;&#691;&#215;&#8342; with r &#8810; d. Only B and A are trained. Rank r = 4-64 typically suffices.</li>
                <li><strong>Instruction tuning:</strong> Fine-tune on thousands of tasks formatted as natural language instructions. Creates general instruction followers without task-specific heads.</li>
            </ul>

            <h3>Multi-Task Fine-Tuning</h3>
            <p>
                Instead of separate fine-tuned models for each task, multi-task fine-tuning trains the
                pretrained backbone simultaneously on multiple labeled datasets:
            </p>
            <ul>
                <li><strong>Shared backbone, separate heads:</strong> The pretrained Transformer body is shared; each task adds its own classification head. Gradients from all tasks update the backbone jointly.</li>
                <li><strong>MT-DNN (Liu et al. 2019):</strong> Applied this to BERT across all GLUE tasks, achieving SoTA on 7 of 9 tasks while also improving on low-resource tasks by sharing examples across related tasks.</li>
                <li><strong>Benefit:</strong> Tasks that share linguistic structure (e.g., NLI and sentiment) help each other. Low-resource tasks benefit from shared signal with high-resource tasks.</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why it works:</strong> Language is a universal proxy for intelligence. To predict
                the next word well, a model must understand grammar, logic, facts, and even social norms.
                Pretraining on raw text is therefore a form of <em>unsupervised multi-task learning</em>,
                where the single task of language modeling implicitly covers all other language tasks.
                Fine-tuning simply makes this implicit knowledge explicit for a specific application.
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
            <h2>Information-theoretic foundations of transfer</h2>

            <DefBlock label="Pretraining as Representation Learning">
                Let p(x) be the true distribution over natural language sequences. A language model
                q&#952;(x) trained to minimize the cross-entropy learns a compressed representation
                of the data distribution:
                <MathBlock tex="\min_\theta \; \mathbb{E}_{x \sim p}\bigl[-\log q_\theta(x)\bigr] = H(p) + D_{\text{KL}}(p \,\|\, q_\theta)" />
                The optimal model satisfies q&#952; = p, at which point the learned representations
                contain all information needed to generate natural language — including syntax, semantics,
                and world knowledge.
            </DefBlock>

            <h3>Transfer as Regularized Fine-Tuning</h3>
            <p>
                Fine-tuning on a downstream task with distribution p&#95;task(x, y) can be viewed as
                regularizing the task model toward the pretrained parameters &#952;&#95;pre:
            </p>
            <MathBlock tex="\min_\theta \; \mathcal{L}_{\text{task}}(\theta) + \lambda \|\theta - \theta_{\text{pre}}\|^2" />
            <p>
                When &#955; &#8594; &#8734;, the model stays at &#952;&#95;pre (zero-shot). When &#955; &#8594; 0, the model is free
                to diverge (risking catastrophic forgetting). In practice, a small learning rate and few
                epochs implement an implicit &#955; that preserves general knowledge while adapting to the task.
            </p>

            <h3>LoRA — Low-Rank Weight Updates</h3>
            <p>
                For a pretrained weight matrix W&#8320; &#8712; &#8477;&#7496;&#215;&#8342;, full fine-tuning learns &#916;W &#8712; &#8477;&#7496;&#215;&#8342;.
                LoRA constrains &#916;W to be low rank:
            </p>
            <MathBlock tex="\Delta W = B A \quad \text{where } B \in \mathbb{R}^{d \times r},\; A \in \mathbb{R}^{r \times k},\; r \ll \min(d, k)" />
            <p>
                The modified forward pass becomes:
            </p>
            <MathBlock tex="h = W_0 x + \frac{\alpha}{r} B A x" />
            <p>
                where &#945; is a scaling hyperparameter. Only B and A are trained; W&#8320; is frozen. For
                BERT-Large with d = 1024, k = 1024, and r = 8, this reduces the parameters in each
                attention matrix from 1,048,576 to 16,384 — a 64x reduction.
            </p>

            <h3>Sample Efficiency of Transfer</h3>
            <p>
                Let N&#95;pre be the number of labeled examples needed with pretraining and N&#95;scratch without.
                The mutual information I(Y; &#920;&#95;pre | X) between the pretrained parameters and the task label
                governs the sample complexity reduction:
            </p>
            <MathBlock tex="\frac{N_{\text{pre}}}{N_{\text{scratch}}} \leq \frac{H(Y \mid X)}{H(Y \mid X) + I(Y;\, \Theta_{\text{pre}} \mid X)}" />
            <p>
                When the pretrained model already "knows" a lot about the task structure, I(Y; &#920;&#95;pre | X)
                is large and N&#95;pre &#8810; N&#95;scratch. This formalizes why pretraining on language tasks related
                to the fine-tuning task yields the largest sample efficiency gains.
            </p>

            <h3>Catastrophic Forgetting and Elastic Weight Consolidation</h3>
            <p>
                Catastrophic forgetting occurs when gradient updates for the new task destroy parameters
                critical to the pretrained knowledge. Kirkpatrick et al.'s EWC penalizes changes to
                important parameters:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{EWC}}(\theta) = \mathcal{L}_{\text{task}}(\theta) + \frac{\lambda}{2} \sum_i F_i (\theta_i - \theta_{\text{pre},i})^2" />
            <p>
                where F&#8336; is the Fisher information diagonal — an approximation of how important parameter
                &#952;&#8336; is to the pretrained task. High Fisher information means the parameter is critical;
                EWC protects it with a stronger quadratic penalty. In practice, low LR and early stopping
                achieve similar effects without requiring Fisher computation.
            </p>

            <div className="ch-callout">
                <strong>Scaling perspective:</strong> As model size grows, the gap between pretraining and
                from-scratch training widens. For GPT-3 (175B parameters), fine-tuning is often unnecessary;
                in-context learning with a prompt achieves comparable results. The pretrain-then-finetune
                paradigm naturally evolves into pretrain-then-prompt as scale increases, with the pretrained
                model becoming increasingly autonomous.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── LoRA — Low-Rank Adaptation — NumPy ───────────────────────────────────────
class LoRALayer:
    """
    Simulates a single LoRA-adapted linear layer.
    W0: frozen pretrained weight (d_out, d_in).
    B, A: trainable low-rank factors (d_out x r) and (r x d_in).
    """
    def __init__(self, d_in, d_out, rank=4, alpha=1.0, seed=42):
        rng = np.random.default_rng(seed)
        self.W0 = rng.standard_normal((d_out, d_in)) * 0.02   # frozen
        self.A  = rng.standard_normal((rank, d_in))  * 0.01   # trainable
        self.B  = np.zeros((d_out, rank))                      # trainable, init 0
        self.alpha = alpha
        self.rank  = rank

    def forward(self, x):
        # x: (batch, d_in)
        original  = x @ self.W0.T
        lora_part = x @ self.A.T @ self.B.T
        return original + (self.alpha / self.rank) * lora_part

    @property
    def lora_params(self):
        return self.A.size + self.B.size

    @property
    def total_params(self):
        return self.W0.size

# ── Pretrain / Finetune Loss Curves ──────────────────────────────────────────
def pretrain_loss(steps, noise=0.02):
    base = 4.0 * np.exp(-steps / 8000) + 1.2
    return base + noise * np.random.randn(len(steps))

def finetune_loss(steps, pretrained=True, noise=0.03):
    if pretrained:
        base = 0.9 * np.exp(-steps / 100) + 0.15
    else:
        base = 3.5 * np.exp(-steps / 600) + 0.4
    return base + noise * np.random.randn(len(steps))

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# LoRA efficiency
layer = LoRALayer(d_in=768, d_out=768, rank=8, alpha=16)
x = np.random.randn(4, 768)   # batch of 4, hidden size 768
out = layer.forward(x)

param_reduction = 1 - layer.lora_params / layer.total_params
print("LoRA Parameter Efficiency")
print("=" * 45)
print(f"Full W0 params     : {layer.total_params:,}")
print(f"LoRA trainable (A+B): {layer.lora_params:,}")
print(f"Parameter reduction: {param_reduction*100:.1f}%")
print(f"Output shape       : {out.shape}")
print()

# Loss curve comparison
pt_steps = np.arange(0, 10000, 200)
ft_steps = np.arange(0, 1000, 20)

pt_loss   = pretrain_loss(pt_steps)
ft_pre    = finetune_loss(ft_steps, pretrained=True)
ft_scratch= finetune_loss(ft_steps, pretrained=False)

print("Fine-Tuning Advantage")
print("=" * 45)
print(f"Pretraining final loss       : {pt_loss[-1]:.3f}")
print()
for steps in [50, 200, 500]:
    idx = steps // 20
    print(f"Step {steps:4d} — pretrained: {ft_pre[idx]:.3f}  |  scratch: {ft_scratch[idx]:.3f}")
print()
print("Pretrained model starts ~4x closer to the optimum")
print("and converges 5-10x faster than training from scratch.")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of LoRA (low-rank adaptation) and simulated pre-train vs. fine-tune
                loss curves. The demo quantifies LoRA's parameter efficiency and shows the head-start
                advantage of a pretrained initialization over random initialization.
            </p>
            <CodeBlock code={PY_CODE} filename="pretrain_finetune.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const PRETRAIN_FINETUNE_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
