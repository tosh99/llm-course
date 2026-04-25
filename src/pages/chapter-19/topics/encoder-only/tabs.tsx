import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The encoder-only family tree</h2>
            <p>
                BERT's success spawned an entire lineage of encoder-only Transformer models, each
                optimizing for a different goal: smaller size, faster inference, lower memory, better
                performance, or more efficient training. Understanding this family helps practitioners
                choose the right model for their constraints.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">BERT — The Ancestor of the Encoder Family</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        NLP tasks required diverse capabilities: some needed to classify single sentences, others to reason about sentence pairs, others to label individual tokens. No single pretrained model had handled all of these simultaneously. BERT's goal was to pretrain a model general enough to fine-tune for any NLP understanding task with minimal additional architecture.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        BERT-Base (12 layers, 768 hidden, 12 heads, 110M params) and BERT-Large (24 layers, 1024 hidden, 16 heads, 340M params) established the encoder-only paradigm. The models were pretrained with MLM + NSP and fine-tuned for any task by adding a minimal task-specific head. BERT's weights were released publicly, enabling the research community to build on a shared foundation.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        BERT became the default starting point for every NLP understanding task. Its public release democratized access to large pretrained models — research groups without Google-scale compute could fine-tune BERT on their own tasks. Within six months, BERT variants were being adapted for biomedical text, scientific papers, legal documents, and dozens of languages.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2019 — Sanh et al. (HuggingFace)</div>
                    <div className="ch-tl-title">DistilBERT — Knowledge Distillation for Production</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT-Base was already 110M parameters — too slow for many production applications where latency mattered. Mobile apps, real-time APIs, and edge devices needed models that could run in tens of milliseconds, not hundreds. But smaller randomly-initialized models performed much worse than BERT on most tasks. Was there a way to compress BERT's knowledge into a smaller, faster model?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Victor Sanh and the HuggingFace team distilled BERT-Base into a 6-layer model with 66M parameters (40% smaller). DistilBERT used three training objectives simultaneously: MLM (standard masked prediction), soft-label distillation from BERT's softmax outputs (the student learns to mimic the teacher's confidence scores, not just the argmax), and cosine embedding loss on the student and teacher hidden states. This transferred BERT's knowledge at multiple levels.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        DistilBERT retained 97% of BERT's performance on GLUE while running 60% faster with 40% fewer parameters. It became the most popular model for production NLP APIs and edge deployments. More importantly, DistilBERT proved that knowledge distillation was a general recipe for model compression — any large pretrained model could in principle be compressed into a smaller, faster version with minimal performance loss.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Sep 2019 — Lan et al. (Google)</div>
                    <div className="ch-tl-title">ALBERT — Parameter Sharing for Extreme Efficiency</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Increasing BERT's size improved performance, but GPU memory limited how large models could be. BERT-Large at 340M parameters was already pushing the limits of single-GPU training. Was there a way to create effectively deeper models without proportionally increasing parameter count? ALBERT's authors hypothesized that much of BERT's parameters were redundant — the same operations were being learned independently in different layers.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ALBERT (A Lite BERT) introduced two parameter reduction techniques. First, factorized embedding decomposition: the large V&#215;H embedding matrix was replaced by two smaller matrices V&#215;E and E&#215;H, with E &#8810; H. Second, cross-layer parameter sharing: all Transformer layers shared the same weight matrices — only one set of parameters was learned and applied at each layer. These two techniques reduced ALBERT-xxlarge to 235M unique parameters while enabling the equivalent of a 12-layer, 4096-hidden-size model.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ALBERT-xxlarge (235M unique params) outperformed BERT-Large (340M) on GLUE, SQuAD, and RACE. It showed that parameter redundancy in BERT was significant: the same weights, applied 12 times with cross-layer sharing, performed better than 12 independent weight sets. ALBERT also replaced NSP with SOP, providing the first systematic evidence that NSP was harmful. The factorized embedding idea influenced subsequent model designs including DeBERTa.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2019 — Clark et al. (Google Brain)</div>
                    <div className="ch-tl-title">ELECTRA — Replaced Token Detection for Training Efficiency</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's MLM objective trained on only 15% of tokens per step. With the same compute budget, could a different objective provide signal on every token? Clark et al. at Google Brain recognized that the specific tokens that were masked mattered less than the density of training signal — and designed a new objective that trained on every position simultaneously.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ELECTRA used a generator-discriminator setup. A small generator BERT (1/4 the size of the discriminator) was trained with MLM to produce plausible token replacements. The discriminator — the main model — saw the corrupted sequence and predicted for each token whether it was original or replaced. This "replaced token detection" (RTD) provided binary classification signal on every single token per step, not just 15%.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ELECTRA matched RoBERTa's performance with 4&#215; less compute, and significantly outperformed BERT with the same compute budget. The 6.7&#215; improvement in training signal density (100% vs. 15% of tokens) was the key mechanism. ELECTRA-Small (14M params, trained in 4 days on a single GPU) outperformed BERT-Base (110M params, trained for weeks on 64 TPUs). This compute efficiency made state-of-the-art pretraining accessible to smaller research groups.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jun 2020 — He et al. (Microsoft)</div>
                    <div className="ch-tl-title">DeBERTa — Disentangled Attention Surpasses Humans</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Standard self-attention conflates word content and position information in a single vector for each query and key. The content of a word and its position in the sentence contribute different kinds of information — a noun at position 5 is different from the same noun at position 15 — but standard attention cannot disentangle these contributions. Could explicitly separating content and position attention improve language understanding?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        DeBERTa (Decoding-enhanced BERT with Disentangled Attention) maintained separate vectors for word content and relative position at each layer, computing four attention terms: content-to-content, content-to-position, position-to-content, and position-to-position. An enhanced mask decoder added absolute position embeddings only at the output layer (when predicting masked tokens), giving the model clean position information at prediction time without confusing pretraining representations. DeBERTa-XXL (1.5B params) achieved 90.3 on SuperGLUE, surpassing the human baseline of 89.8 in 2021.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        DeBERTa demonstrated that architectural innovation in encoder-only models was not exhausted — even years after BERT, careful attention mechanism design could yield significant improvements. Its superhuman performance on SuperGLUE confirmed that encoder-only models could match or exceed human performance on complex language understanding benchmarks, a milestone that had seemed unreachable when BERT was first released.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2022 — GLUE, SuperGLUE, MTEB</div>
                    <div className="ch-tl-title">Benchmarks Saturate — The End of the BERT Era</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        GLUE (9 tasks) was saturated by early 2020 — models exceeded the human baseline. SuperGLUE (8 harder tasks) was proposed as a successor; DeBERTa exceeded its human baseline by 2021. The benchmark saturation problem: if models exceed humans on curated benchmarks, how do we measure whether models are actually understanding language versus exploiting dataset artifacts?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        MTEB (Massive Text Embedding Benchmark, 2022) evaluated sentence embeddings across 56 datasets — a far broader and more realistic evaluation than GLUE. The Sentence-BERT family (2019-2022) developed encoder models specifically optimized for producing sentence-level representations via Siamese fine-tuning on NLI data and contrastive learning. BM25+encoder retrievers became the standard for RAG (retrieval-augmented generation) systems.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The encoder-only paradigm found its long-term niche not in raw GLUE/SuperGLUE scores but in production NLP: text classification, named entity recognition, coreference, semantic search, and dense retrieval. While decoder-only models (GPT, LLaMA) came to dominate generation and reasoning tasks, encoder-only models remained the best choice for embedding-based tasks where representation quality — not generation fluency — was the goal.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>How to choose:</strong> Use DistilBERT for latency-sensitive production APIs.
                Use ALBERT when memory is constrained. Use ELECTRA when you have limited training compute.
                Use DeBERTa when you need maximum accuracy on classification or NLU tasks. For embeddings
                and retrieval, Sentence-BERT or a contrastively fine-tuned encoder remains the go-to.
                For generation tasks, use decoder-only models (GPT family).
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> BERT's encoder-only architecture excelled at understanding — reading text, extracting meaning, and classifying. But generation was BERT's weakness: it could analyze existing text but not write new text fluently. OpenAI continued scaling decoder-only models: GPT-2 (February 2019) reached 1.5 billion parameters and demonstrated astonishingly fluent text generation. Meanwhile, Google's T5 unified both understanding and generation under a single text-to-text framework. Chapter 20 follows both competing visions for what a language model should be.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The BERT family</h2>

            <Analogy label="The Original Chef (BERT)">
                <p>BERT is like a master chef who can cook anything. But the chef is slow and expensive
                to hire — it takes a lot of computing time and memory to run BERT for every customer.
                What if we want a faster, cheaper, or smaller cook who can still make great food? That's what the BERT family provides: variations designed for different kitchens with different budgets.</p>
            </Analogy>

            <Analogy label="The Apprentice (DistilBERT)">
                <p>DistilBERT is the apprentice who learned by watching the master. During training, DistilBERT wasn't just learning to cook — it was specifically learning to cook the same dishes the master would cook, in the same proportions. It even tried to match the master's confidence levels ("I'm 80% sure this dish needs more salt"), not just the final verdict ("add salt").</p>
                <p>The apprentice is 40% smaller and 60% faster, but still 97% as good. Perfect for busy restaurants that need quick meals without compromising too much on quality.</p>
            </Analogy>

            <Analogy label="The Shared Uniform (ALBERT)">
                <p>ALBERT noticed something wasteful about BERT: each of its 12 layers was learning its own separate set of skills. But many of those skills were very similar across layers. What if every layer shared the exact same "uniform" — the same weights — applied repeatedly?</p>
                <p>ALBERT shares weights across all its layers, making it much smaller without losing much skill. It's like one super-cook who puts on different stations' uniforms sequentially, rather than having 12 different cooks at 12 different stations. Dramatically fewer unique parameters, but the depth of processing remains the same.</p>
            </Analogy>

            <Analogy label="The Detective (ELECTRA)">
                <p>Instead of filling in blanks, ELECTRA plays "spot the fake." A tiny forger model changes some words in a sentence — replacing real words with plausible alternatives. ELECTRA has to examine every word and decide: "Is this original or was it swapped by the forger?"</p>
                <p>Because it practices on every word instead of just 15%, ELECTRA learns faster and becomes sharper. With the same training budget, ELECTRA outperforms BERT significantly — because it's always paying full attention, not ignoring the 85% of words that weren't masked.</p>
            </Analogy>

            <Analogy label="The Content vs. Location Expert (DeBERTa)">
                <p>Standard attention asks: "How relevant is word A to word B?" But DeBERTa asks two separate questions: "How relevant is the meaning of A to the meaning of B?" and "How relevant is the position of A to the position of B?" By keeping these two questions separate, DeBERTa builds richer understanding of how words relate to each other.</p>
                <p>This disentangled attention is what pushed DeBERTa past human performance on SuperGLUE — the hardest English language understanding benchmark. A machine surpassing average human performance on language understanding was a milestone that BERT's creators would have considered impossible in 2018.</p>
            </Analogy>

            <Analogy label="What comes next — Bigger generators and unified frameworks">
                <p>BERT was the world's best text reader — it could understand anything. But it couldn't write. OpenAI's GPT-2 in Chapter 20 scaled generation to near-human fluency: 1.5 billion parameters, trained on 40 gigabytes of internet text, able to write convincing articles and stories. Meanwhile, Google's T5 unified reading AND writing under a single text-in, text-out framework — the architecture that underpins today's large language models.</p>
                <p>The split between understanding (encoder-only, BERT family) and generation (decoder-only, GPT family) dominated NLP from 2018 to 2020. Chapter 20 follows the generation side of the story, tracing how GPT-2 and T5 expanded what language models could do beyond understanding into creation.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Encoder-only model comparison</h2>

            <h3>Architecture Overview — What They Share</h3>
            <p>
                All models in the BERT family share the same core structure: a stack of Transformer encoder
                blocks, each with multi-head self-attention and feed-forward networks, layer normalization,
                and residual connections. The unmasked self-attention (every position attends to every
                other) is the defining property. What differs is how these blocks are parameterized,
                how many unique parameters exist, and what pretraining objective is used:
            </p>
            <ul>
                <li><strong>BERT:</strong> 12 or 24 independent layers. MLM + NSP. 110M or 340M params.</li>
                <li><strong>RoBERTa:</strong> Same architecture as BERT. MLM only (no NSP). More data, larger batches, dynamic masking. 125M or 355M params.</li>
                <li><strong>DistilBERT:</strong> 6 layers, distilled from BERT-Base. Triple loss (MLM + soft-label + cosine). 66M params.</li>
                <li><strong>ALBERT:</strong> Factorized embeddings (V&#215;E + E&#215;H) + cross-layer parameter sharing. MLM + SOP. 12M to 235M unique params.</li>
                <li><strong>ELECTRA:</strong> Generator-discriminator. RTD (replaced token detection) on every token. Same effective size as BERT.</li>
                <li><strong>DeBERTa:</strong> Disentangled attention (content + position vectors). Enhanced mask decoder. MLM. 80M to 1.5B params.</li>
            </ul>

            <h3>Sentence Embeddings — Sentence-BERT</h3>
            <p>
                BERT's [CLS] representation is not a good sentence embedding directly — it was trained for
                classification, not similarity. Sentence-BERT (SBERT, Reimers &amp; Gurevych 2019) fine-tuned
                BERT with a Siamese architecture: two sentences are encoded separately and compared via
                cosine similarity. Training on NLI data (entailment = similar; contradiction = dissimilar)
                produced sentence embeddings where cosine similarity correlates with semantic similarity.
                SBERT enabled practical semantic search for the first time.
            </p>

            <h3>Knowledge Distillation — DistilBERT's Triple Loss</h3>
            <p>
                Knowledge distillation trains a small student model to mimic a large teacher. DistilBERT
                used three losses jointly:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{DistilBERT}} = \alpha \mathcal{L}_{\text{MLM}} + \beta \mathcal{L}_{\text{soft}} + \gamma \mathcal{L}_{\text{cosine}}" />
            <p>
                where &#8466;&#95;soft is cross-entropy between student and teacher softmax distributions (soft labels),
                and &#8466;&#95;cosine is cosine embedding loss between student and teacher hidden states. Soft labels
                carry more information than hard labels (one-hot) because they reveal the teacher's uncertainty
                and which alternative tokens were nearly predicted.
            </p>

            <h3>ELECTRA's Training Signal Density</h3>
            <p>
                ELECTRA's key advantage is training on every token vs. BERT's 15%:
            </p>
            <MathBlock tex="\frac{\text{ELECTRA signal density}}{\text{BERT signal density}} = \frac{1.0}{0.15} \approx 6.7\times" />
            <p>
                This means ELECTRA effectively trains on 6.7&#215; more gradient signal per step.
                At equivalent compute (same number of steps and model size), ELECTRA significantly
                outperforms BERT. ELECTRA-Small (14M params) matches BERT-Base (110M params) on GLUE
                despite being 8&#215; smaller — purely due to training signal efficiency.
            </p>

            <h3>Practical Task Selection Guide</h3>
            <ul>
                <li><strong>Text classification (production):</strong> DistilBERT or ELECTRA-Small for speed; DeBERTa for accuracy</li>
                <li><strong>Named entity recognition:</strong> RoBERTa-Base fine-tuned (best speed/accuracy tradeoff)</li>
                <li><strong>Extractive question answering:</strong> DeBERTa-Large or RoBERTa-Large</li>
                <li><strong>Semantic search / embeddings:</strong> Sentence-BERT, E5-Large, or SimCSE</li>
                <li><strong>Low-resource (&#60;1K labeled examples):</strong> ELECTRA (better sample efficiency) or DistilBERT</li>
                <li><strong>Mobile / edge:</strong> MobileBERT (24M params), SqueezeGPT, or DistilBERT quantized</li>
                <li><strong>Multilingual:</strong> XLM-RoBERTa (trained on 100 languages, 2.5TB text)</li>
                <li><strong>Domain-specific:</strong> BioBERT (biomedical), LegalBERT (legal), SciBERT (scientific)</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key trend:</strong> The encoder-only family shows that both architectural innovation
                (ALBERT's sharing, ELECTRA's detection, DeBERTa's disentanglement) and training optimization
                (RoBERTa's scaling) matter. No single model dominates every task; the best choice
                depends on accuracy requirements, inference latency, memory budget, and whether the
                task requires understanding or generation.
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
            <h2>Parameter sharing, distillation, and replaced token detection</h2>

            <DefBlock label="ALBERT Factorized Embeddings">
                BERT's token embedding matrix is <InlineMath tex="\mathbf{E} \in \mathbb{R}^{V \times H}" /> where V is vocabulary
                size and H is hidden size. ALBERT factorizes into two smaller matrices:
                <MathBlock tex="\mathbf{E}_{\text{ALBERT}} = \mathbf{E}_1 \mathbf{E}_2 \quad \text{where } \mathbf{E}_1 \in \mathbb{R}^{V \times E},\; \mathbf{E}_2 \in \mathbb{R}^{E \times H}" />
                With <InlineMath tex="E \ll H" /> (e.g., E=128, H=4096), parameters drop from <InlineMath tex="V \cdot H" /> to
                <InlineMath tex="V \cdot E + E \cdot H" />. For V=30,522, H=4096, E=128:
                <MathBlock tex="\text{BERT}: 30{,}522 \times 4096 = 124{,}977{,}152 \quad \text{vs.} \quad \text{ALBERT}: 30{,}522 \times 128 + 128 \times 4096 = 4{,}434{,}432" />
                A 28x reduction in embedding parameters alone.
            </DefBlock>

            <h3>Cross-Layer Parameter Sharing</h3>
            <p>
                ALBERT applies the same Transformer block parameters &#920; at every layer:
            </p>
            <MathBlock tex="\mathbf{H}^{(\ell)} = \text{TransformerBlock}(\mathbf{H}^{(\ell-1)};\, \Theta) \quad \forall\, \ell \in \{1, \dots, L\}" />
            <p>
                Unlike BERT where each layer has unique parameters &#920;&#8336;, ALBERT uses a single shared &#920;.
                With L=12 layers each of size proportional to H&#178;, this reduces parameters by 12&#215;
                for the transformer weights. The model depth (number of processing steps) is preserved;
                only the parameter uniqueness is reduced.
            </p>

            <h3>ELECTRA Replaced Token Detection</h3>
            <p>
                Let the generator G produce a corrupted sequence &#967;&#770; from the original x. The discriminator D
                predicts for every position i whether x&#770;&#8336; = x&#8336; (original) or x&#770;&#8336; &#8800; x&#8336; (replaced):
            </p>
            <MathBlock tex="P(D_i = \text{original} \mid \hat{\mathbf{x}}) = \sigma(\mathbf{w}_{\text{RTD}}^T \mathbf{h}_i^{(D)} + b)" />
            <p>
                The discriminator loss over all positions:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{RTD}} = -\sum_{i=1}^{n} \bigl[\mathbb{1}[x_i = \hat{x}_i] \log P(D_i=1) + \mathbb{1}[x_i \neq \hat{x}_i] \log P(D_i=0)\bigr]" />

            <h3>DeBERTa Disentangled Attention</h3>
            <p>
                Standard attention computes QK&#7488; where each row encodes both content and position.
                DeBERTa maintains separate content vectors Q&#95;c, K&#95;c and position vectors Q&#95;r, K&#95;r
                (r for relative position), computing four interaction terms:
            </p>
            <MathBlock tex="\text{Attention}(i, j) = Q_c^i K_c^{j\top} + Q_c^i K_r^{(i-j)\top} + Q_r^{(i-j)} K_c^{j\top}" />
            <p>
                (The position-to-position term is omitted as it does not contribute significantly.)
                This disentanglement allows the model to separately learn how content relates to content
                and how relative position relates to content — a finer-grained attention mechanism.
            </p>

            <h3>DistilBERT Knowledge Distillation</h3>
            <p>
                The soft-label loss uses temperature T=2 to soften the teacher's probability distribution,
                making it more informative:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{soft}} = T^2 \cdot \text{KL}\!\left(\text{softmax}\!\left(\frac{z_s}{T}\right) \,\Big\|\, \text{softmax}\!\left(\frac{z_t}{T}\right)\right)" />
            <p>
                where z&#95;s and z&#95;t are student and teacher logits. At T=1, this reduces to standard
                cross-entropy against teacher's argmax. At T=2, the teacher's top-k probabilities all
                become meaningful training signal, teaching the student which alternative predictions
                the teacher considered plausible.
            </p>

            <div className="ch-callout">
                <strong>DeBERTa's insight:</strong> Standard attention conflates content and position
                in a single vector, forcing the model to entangle "what" and "where" at every layer.
                Disentangled attention separates these, allowing the model to learn that "cat" and "dog"
                are content-similar regardless of position, while "subject" and "verb" are positionally
                related (subject precedes verb) regardless of content. This finer granularity is what
                pushed DeBERTa past human performance on SuperGLUE.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── ALBERT Factorized Embedding Parameter Count ───────────────────────────────
def embedding_params(vocab_size, hidden_size, embedding_size=None):
    """
    BERT: V * H parameters.
    ALBERT: V * E + E * H parameters (E << H).
    """
    if embedding_size is None:   # BERT style
        return vocab_size * hidden_size
    else:                         # ALBERT style
        return vocab_size * embedding_size + embedding_size * hidden_size

# ── ELECTRA Replaced Token Detection Loss ─────────────────────────────────────
def rtd_loss(disc_logits, is_original):
    """
    disc_logits : (seq_len,) pre-sigmoid logits (positive = original)
    is_original : (seq_len,) bool
    """
    probs  = 1 / (1 + np.exp(-disc_logits))
    labels = is_original.astype(float)
    loss   = -(labels * np.log(probs + 1e-10) +
               (1 - labels) * np.log(1 - probs + 1e-10))
    return float(np.mean(loss))

# ── DistilBERT Soft-Label Distillation Loss ───────────────────────────────────
def kl_divergence(p, q, eps=1e-10):
    """KL(p || q) where p, q are probability distributions over vocab."""
    return np.sum(p * np.log((p + eps) / (q + eps)))

def soft_label_loss(student_logits, teacher_logits, temperature=2.0):
    """
    Soft-label distillation loss with temperature scaling.
    student_logits, teacher_logits: (seq_len, vocab_size)
    """
    def soft_softmax(x, T):
        x_T = x / T
        e = np.exp(x_T - np.max(x_T, axis=-1, keepdims=True))
        return e / e.sum(axis=-1, keepdims=True)

    s_probs = soft_softmax(student_logits, temperature)
    t_probs = soft_softmax(teacher_logits, temperature)
    # Scale by T^2 to compensate for softmax temperature scaling
    kl = np.mean([kl_divergence(t_probs[i], s_probs[i])
                  for i in range(len(s_probs))])
    return float(temperature ** 2 * kl)

# ── Model Comparison Summary ──────────────────────────────────────────────────
models = {
    "BERT-Base"      : {"params": 110e6, "layers": 12, "hidden": 768},
    "BERT-Large"     : {"params": 340e6, "layers": 24, "hidden": 1024},
    "DistilBERT"     : {"params":  66e6, "layers":  6, "hidden": 768},
    "ALBERT-Base"    : {"params":  12e6, "layers": 12, "hidden": 768},
    "ALBERT-xxLarge" : {"params": 235e6, "layers": 12, "hidden": 4096},
    "ELECTRA-Small"  : {"params":  14e6, "layers": 12, "hidden": 256},
    "DeBERTa-Base"   : {"params":  86e6, "layers": 12, "hidden": 768},
}

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# Embedding parameter comparison
bert_emb  = embedding_params(30522, 4096)
albert_emb = embedding_params(30522, 4096, embedding_size=128)

print("ALBERT Factorized Embedding Savings")
print("=" * 50)
print(f"BERT   (V=30522, H=4096): {bert_emb:>15,} params")
print(f"ALBERT (V=30522, H=4096, E=128): {albert_emb:>10,} params")
print(f"Reduction: {(1 - albert_emb/bert_emb)*100:.1f}%")
print()

# ELECTRA signal density
seq_len  = 32
disc_logits = np.random.randn(seq_len)
is_orig     = np.random.rand(seq_len) > 0.15   # ~85% original
loss_rtd    = rtd_loss(disc_logits, is_orig)
print(f"ELECTRA RTD loss (seq_len={seq_len}): {loss_rtd:.4f}")
print(f"Signal density: 100% (all {seq_len} positions trained)")
print(f"vs. BERT MLM:   15%  (~{int(seq_len*0.15)} positions trained)")
print()

# DistilBERT soft-label loss
vocab = 30522
s_logits = np.random.randn(4, vocab)
t_logits = np.random.randn(4, vocab)
loss_soft = soft_label_loss(s_logits, t_logits, temperature=2.0)
print(f"DistilBERT soft-label KL loss: {loss_soft:.4f}")
print()

# Model comparison table
print("Encoder Family — Parameters and Layers")
print("=" * 55)
print(f"{'Model':<18} {'Params':>10} {'Layers':>8} {'Hidden':>8}")
print("-" * 55)
for name, info in models.items():
    print(f"{name:<18} {info['params']/1e6:>8.0f}M {info['layers']:>8} {info['hidden']:>8}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations comparing ALBERT's factorized embedding parameter savings,
                ELECTRA's replaced token detection loss, and DistilBERT's soft-label distillation.
                Includes a model comparison table showing the full encoder-only family.
            </p>
            <CodeBlock code={PY_CODE} filename="encoder_family.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ENCODER_ONLY_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
