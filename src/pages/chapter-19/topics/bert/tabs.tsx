import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 18 established the pre-train &#8594; fine-tune paradigm: ULMFiT, ELMo, and GPT-1 all demonstrated that training a language model on massive text, then fine-tuning for specific tasks, substantially outperformed training from scratch. But all three read text in a single direction — left-to-right. Reading left-to-right means the model never sees right-context when learning a word's meaning. Jacob Devlin and colleagues at Google Brain introduced BERT (Bidirectional Encoder Representations from Transformers) in October 2018, using masked language modeling to train bidirectionally for the first time.
            </p>
            <h2>The bidirectional breakthrough</h2>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 — Vaswani et al.</div>
                    <div className="ch-tl-title">The Transformer Encoder — A Bidirectional Building Block</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        The Transformer's attention mechanism allowed every token to attend to every other token in the sequence — a naturally bidirectional operation. But the original architecture used this encoder only for reading source text in translation. The encoder's bidirectional self-attention was not yet paired with a suitable self-supervised training objective for pretraining.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Vaswani et al.'s "Attention Is All You Need" stacked 6 encoder blocks, each with unmasked multi-head self-attention (every position attends to every other) and a position-wise feed-forward network. The encoder produced rich contextual representations of the source language for the decoder to cross-attend. The key technical property — truly bidirectional attention with no causal masking — was waiting to be applied to pretraining.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The Transformer encoder provided the architectural substrate for BERT. Its unmasked self-attention let every position see every other position in a single layer — richer than ELMo's biLSTM (which concatenated two independent directional passes) and more fundamental than GPT's causal masking. BERT simply needed to discover the right pretraining objective to exploit this bidirectionality.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Early 2018 — Peters, Radford et al.</div>
                    <div className="ch-tl-title">ELMo and GPT-1 — The Two Incomplete Halves</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        By mid-2018 the NLP community had two powerful pretraining paradigms, each with a critical limitation. ELMo achieved bidirectionality but with shallow concatenation of two separate LSTMs — the forward and backward passes never deeply interacted. GPT-1 achieved deep Transformer-based pretraining but was fundamentally unidirectional, which limited its ability to learn word-level representations that depended on right-context.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ELMo used a biLSTM trained with separate forward and backward LM objectives; the two directions were concatenated only at the output layer, never interacting internally. GPT-1 used causal (masked) self-attention, preventing any position from attending to future positions. The question was: could a Transformer encoder be pretrained with a bidirectional objective that allowed deep, fused bidirectional context?
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The gap between shallow biLSTM bidirectionality (ELMo) and deep unidirectional Transformer (GPT) created a clear research opportunity. BERT filled this gap by combining GPT's deep Transformer architecture with a training objective that forced true bidirectionality: Masked Language Modeling. The insight that "you can't just train a Transformer encoder autoregressively" led directly to BERT's masked prediction approach.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018 — Devlin, Chang, Lee &amp; Toutanova</div>
                    <div className="ch-tl-title">BERT — Bidirectional Encoder Representations from Transformers</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Google Brain's Jacob Devlin and colleagues recognized that a naive approach — training a Transformer encoder to predict the next word left-to-right — would just reproduce GPT's unidirectionality. A bidirectional model would be able to "see the answer" if asked to predict a word it could see from both sides. The training objective had to be redesigned to force bidirectional learning without trivializing the task.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" introduced two innovations simultaneously. First, Masked Language Modeling (MLM): randomly mask 15% of input tokens and predict them from all surrounding context — making the model attend to both left and right. Second, Next Sentence Prediction (NSP): given two sentences, predict whether the second follows the first in the original document. BERT-Base (12 layers, 110M params) and BERT-Large (24 layers, 340M params) were trained on BooksCorpus + Wikipedia (3.3 billion words).
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        BERT set new state-of-the-art on 11 NLP tasks simultaneously — a result unprecedented in NLP history. On the GLUE benchmark: 80.4% (BERT-Base) and 86.7% (BERT-Large), far above the previous SoTA of 72.8% (GPT-1). On SQuAD 1.1: 93.2 F1, beating human performance (91.2). On MultiNLI: 86.7%, up from 82.1%. The paper became the most cited NLP paper of all time within two years.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 — Devlin et al., Google</div>
                    <div className="ch-tl-title">BERT Deployed in Google Search</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Google's search system had relied on keyword matching and statistical language models for query understanding. But BERT's natural language understanding was dramatically better: it understood that "can you get medicine for someone pharmacy" meant the user needed to pick up a prescription for another person — a subtle conversational interpretation that keyword systems missed entirely.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        In October 2019, Google announced BERT-based query understanding for English searches — the biggest improvement to search quality in five years. BERT powered featured snippets (direct answer extraction), understanding of long conversational queries, and disambiguation of prepositions. The same pretrained BERT model was fine-tuned for the query understanding task; no fundamental architectural changes were needed.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        BERT's deployment in Google Search marked the moment when NLP research directly affected billions of daily users. It validated that encoder-only pretrained models were ready for large-scale production — not just research benchmarks. This adoption drove massive investment in BERT variants, optimization techniques, and deployment infrastructure across the industry.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2021 — Various</div>
                    <div className="ch-tl-title">The BERT Era — Variants and the BERTology Research Program</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's rapid adoption generated two parallel research programs: improving BERT's performance (RoBERTa, ALBERT, DeBERTa, SpanBERT) and understanding what BERT learned (BERTology). The understanding program asked: which layers encode what linguistic information? Does BERT know about syntax? Can it do arithmetic? Does it understand negation?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        RoBERTa (2019) showed BERT was undertrained; more data, larger batches, and no NSP improved results. DistilBERT (2019) compressed BERT to 40% smaller with 97% performance. ALBERT (2019) used parameter sharing for extreme efficiency. SpanBERT (2019) masked spans instead of tokens. Meanwhile, dozens of probing studies revealed that BERT's lower layers encoded syntax and POS; upper layers encoded coreference and semantic roles.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The BERT era established encoder-only pretraining as the dominant paradigm for NLP understanding tasks for several years. BERTology revealed that language model pretraining implicitly teaches linguistic structure — providing theoretical grounding for why transfer works. These results guided architectural choices for all subsequent models, including the encoder components of T5 and the understanding modules of modern retrieval-augmented systems.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – 2024 — He, Meng et al.</div>
                    <div className="ch-tl-title">DeBERTa Surpasses Human Performance on SuperGLUE</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        The GLUE benchmark was saturated by mid-2020 — models exceeded human performance on most tasks. SuperGLUE, a harder successor, included tasks requiring complex inference, multi-step reasoning, and commonsense understanding that even BERT-Large struggled with. The question was whether encoder-only models could reach human-level performance on genuinely hard language understanding tasks.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        DeBERTa (He et al. 2021) introduced disentangled attention: separate vectors for token content and relative position, with four attention interaction terms (content-to-content, content-to-position, position-to-content, position-to-position). An enhanced mask decoder added absolute position information at the output. DeBERTa-XXL (1.5B params) achieved 90.3 on SuperGLUE, surpassing the human baseline of 89.8.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        DeBERTa proved that encoder-only Transformer models could reach superhuman performance on complex language understanding benchmarks — a milestone comparable to AlphaGo for games. It also showed that architectural innovations (disentangled attention, enhanced decoding) still yielded significant gains even after years of BERT optimization. The encoder-only paradigm was not exhausted; it had simply been waiting for the right architectural refinements.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> True bidirectionality requires masking. If a model is
                allowed to see every word, it can trivially predict any target word that appears in its
                context. By masking 15% of input tokens and forcing the model to reconstruct them from
                all surrounding context — including right-context — BERT learns deep, fused representations
                that capture syntax, semantics, and world knowledge from both directions simultaneously.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 18 taught neural networks to pre-train on massive text and specialize afterward. But GPT-1 only read left to right — it never saw what came after a word when it was learning. BERT (October 2018) changed this: it masked random words in sentences and learned to predict them using both what came before AND what came after — like solving a fill-in-the-blank puzzle where you can see the whole sentence except the hidden word.
            </p>
            <h2>Reading with both eyes open</h2>

            <Analogy label="The Missing Word Game">
                <p>Imagine you're reading a sentence but some words are covered with sticky notes:
                "The ___ chased the mouse around the house." You can look at every other word — before
                <em> and</em> after the blank — to figure out the missing word is "cat." BERT plays this
                game millions of times, learning to use clues from both sides.</p>
                <p>This is called Masked Language Modeling. BERT covers about 15% of words in a sentence and has to guess each hidden word from all the surrounding context. After doing this with billions of sentences, BERT becomes an expert at understanding how language works — from both directions simultaneously.</p>
            </Analogy>

            <Analogy label="The One-Way Street vs. the Intersection">
                <p>GPT is like driving down a one-way street: you can only see what's behind you. ELMo was slightly better — it had two one-way streets going in opposite directions, but they never talked to each other. BERT is like standing in the middle of an intersection: you can see traffic coming from every direction at once.</p>
                <p>That's why BERT is so much better at understanding a word's meaning in context. To predict the hidden word in "The doctor gave the patient her ___," BERT can use "doctor," "patient," and "her" all at once — catching the grammar, the relationship between people, and the expected ending simultaneously.</p>
            </Analogy>

            <Analogy label="The Special Tokens — CLS and SEP">
                <p>BERT uses two special markers you won't find in normal text. The [CLS] token (short for "classification") is always placed at the very beginning of every input. By the time the full BERT model has processed the sentence, [CLS] has absorbed a summary of the entire input — it's used for classification tasks like "is this review positive or negative?"</p>
                <p>The [SEP] token (short for "separator") goes between two sentences and at the end. It tells BERT "this is where sentence A ends and sentence B begins." This lets BERT handle pairs of sentences — like question + passage for question answering, or premise + hypothesis for logical reasoning.</p>
            </Analogy>

            <Analogy label="The Chameleon (Fine-Tuning BERT)">
                <p>Just like GPT, BERT can be fine-tuned for almost any language task. Add a tiny classification layer on top, show it a few thousand examples, and BERT becomes a specialist. Need a spam detector? Fine-tune on emails. Need a medical question answerer? Fine-tune on medical documents. The same pretrained BERT body serves every purpose.</p>
                <p>The only difference for different tasks is the tiny "head" added on top and the format of the input. For answering questions about a passage, you feed [CLS] + question + [SEP] + passage + [SEP], and two simple layers predict where the answer starts and ends in the passage. The pretrained body does all the hard work.</p>
            </Analogy>

            <Analogy label="Eleven Tasks at Once">
                <p>When BERT was published in October 2018, it set new records on eleven different NLP tasks simultaneously — all with the same pretrained model. That had never happened before. Previous records were set by completely different specialized systems for each task.</p>
                <p>BERT beat human performance on SQuAD (a reading comprehension test) and dramatically improved sentiment analysis, sentence classification, coreference resolution, and natural language inference. Google's researchers called it "the most important paper in NLP in years." The most cited NLP paper of all time was being written by a team of four people at Google Brain.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>BERT architecture and fine-tuning</h2>

            <h3>Architecture — Transformer Encoder Stack</h3>
            <p>
                BERT uses a <em>Transformer encoder</em> stack — no decoder, no causal masking. Every
                layer is a standard Transformer encoder block: unmasked multi-head self-attention
                (every position attends to every other), followed by a position-wise feed-forward network,
                with layer normalization and residual connections:
            </p>
            <ul>
                <li><strong>BERT-Base:</strong> 12 layers, 768 hidden size, 12 attention heads, 110M parameters</li>
                <li><strong>BERT-Large:</strong> 24 layers, 1024 hidden size, 16 attention heads, 340M parameters</li>
                <li><strong>Context length:</strong> 512 tokens (WordPiece subword vocabulary)</li>
                <li><strong>Vocabulary:</strong> 30,522 WordPiece tokens (learned from training corpus)</li>
                <li><strong>Positional encoding:</strong> Learned position embeddings (not sinusoidal)</li>
                <li><strong>Segment embeddings:</strong> Separate learnable embeddings for sentence A and B</li>
                <li><strong>Input embedding:</strong> Sum of token + positional + segment embeddings</li>
            </ul>

            <h3>WordPiece Tokenization</h3>
            <p>
                BERT uses WordPiece tokenization rather than word-level or character-level. Words are split
                into common subword units: "running" might become ["run", "##ning"]; "unbelievable" might
                become ["un", "##believ", "##able"]. The "##" prefix indicates a continuation piece.
                This handles out-of-vocabulary words gracefully — even unseen words are represented by
                known subword pieces — while keeping the vocabulary compact (30K tokens covers most English).
            </p>

            <h3>Pretraining Objectives — MLM and NSP</h3>
            <p>
                BERT is pretrained on two tasks simultaneously using the same Transformer:
            </p>
            <ul>
                <li><strong>Masked Language Modeling (MLM):</strong> 15% of tokens are selected. Of those,
                    80% are replaced with [MASK], 10% with random tokens, and 10% left unchanged.
                    The model predicts the original token for all selected positions using bidirectional context.
                    The 80/10/10 split prevents train-test mismatch (the model never sees [MASK] at fine-tuning).</li>
                <li><strong>Next Sentence Prediction (NSP):</strong> Given two sentences (A, B), predict
                    whether B is the actual next sentence after A in the corpus (50% positive cases)
                    or a random sentence (50% negative). The [CLS] representation is used for binary classification.</li>
            </ul>
            <p>
                Both losses are summed: &#8466; = &#8466;&#95;MLM + &#8466;&#95;NSP. Pretraining ran for 1 million steps
                on BooksCorpus (800M words) + English Wikipedia (2.5B words).
            </p>

            <h3>Fine-Tuning Configurations</h3>
            <p>
                For downstream tasks, BERT adds a minimal task-specific head and fine-tunes all parameters
                end-to-end with a small learning rate (1e-5 to 5e-5):
            </p>
            <ul>
                <li><strong>Single-sentence classification:</strong> Linear layer on [CLS] &#8594; C-way softmax</li>
                <li><strong>Sentence pair classification (NLI, similarity):</strong> [CLS]+A+[SEP]+B+[SEP], linear on [CLS]</li>
                <li><strong>Extractive QA (SQuAD):</strong> Two linear layers predict start and end span positions over all tokens of the passage</li>
                <li><strong>Token-level tasks (NER, POS):</strong> Linear layer on every token's final hidden state</li>
            </ul>

            <h3>BERT vs. GPT-1 — The Key Differences</h3>
            <p>
                Despite similar scales (BERT-Base 110M vs. GPT-1 117M params), the two models differ fundamentally:
            </p>
            <ul>
                <li><strong>Attention masking:</strong> BERT uses unmasked (bidirectional) attention; GPT uses causal (left-to-right) masking</li>
                <li><strong>Pretraining objective:</strong> BERT uses MLM (predict masked tokens); GPT uses CLM (predict next token)</li>
                <li><strong>Training data:</strong> BERT trained on 3.3B words; GPT-1 on 800M words</li>
                <li><strong>Training signal density:</strong> BERT: 15% of tokens per step; GPT: 100% of tokens per step</li>
                <li><strong>Fine-tuning approach:</strong> Both fine-tune all parameters; BERT uses [CLS]/[SEP] formatting; GPT uses delimiter tokens</li>
                <li><strong>Generation:</strong> BERT cannot generate text natively (no causal structure); GPT is designed for generation</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> BERT-Large achieved 93.2 F1 on SQuAD 1.1 (beating human
                performance of 91.2), 86.7% on GLUE (far above GPT-1's 72.8%), and 80.5% on MultiNLI — all
                with the same pretrained model and minimal task-specific changes. Eleven tasks, one model,
                eleven new records simultaneously.
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
            <h2>Masked language modeling and the encoder attention block</h2>

            <DefBlock label="Transformer Encoder Block">
                For input <InlineMath tex="\mathbf{X} \in \mathbb{R}^{n \times d}" />, each encoder block computes
                (using pre-norm formulation):
                <MathBlock tex="\mathbf{A} = \text{MHA}(\text{LayerNorm}(\mathbf{X})) + \mathbf{X}" />
                <MathBlock tex="\mathbf{H} = \text{FFN}(\text{LayerNorm}(\mathbf{A})) + \mathbf{A}" />
                Unlike the decoder, there is <em>no</em> causal mask: every position attends to every other
                position with full attention weights. This is the key architectural difference from GPT.
            </DefBlock>

            <h3>Input Embedding</h3>
            <p>
                BERT's input embedding for token i is the sum of three learned embedding tables:
            </p>
            <MathBlock tex="\mathbf{e}_i = \mathbf{E}_{\text{token}}[x_i] + \mathbf{E}_{\text{pos}}[i] + \mathbf{E}_{\text{seg}}[s_i]" />
            <p>
                where x&#8336; is the token id, i is the position, and s&#8336; &#8712; &#123;0, 1&#125; is the segment
                id (0 for sentence A, 1 for sentence B). All three embedding matrices are learned
                during pretraining.
            </p>

            <h3>Masked Language Modeling Loss</h3>
            <p>
                Let <InlineMath tex="\mathcal{M}" /> be the set of masked positions (approximately 15% of tokens). For each
                masked position <InlineMath tex="i \in \mathcal{M}" />, the model outputs logits <InlineMath tex="\mathbf{z}_i \in \mathbb{R}^V" />
                and minimizes the cross-entropy:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{MLM}} = -\sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}_{\setminus \mathcal{M}};\, \Theta)" />
            <p>
                where <InlineMath tex="\mathbf{x}_{\setminus \mathcal{M}}" /> denotes the entire input sequence with some
                tokens corrupted. The model sees all non-masked tokens in both directions — left and right context
                jointly — when predicting each masked position.
            </p>

            <h3>Next Sentence Prediction Loss</h3>
            <p>
                Given sentence pair (A, B), the [CLS] token's final hidden state
                <InlineMath tex="\mathbf{h}_{\text{CLS}} \in \mathbb{R}^d" /> is fed to a binary classifier:
            </p>
            <MathBlock tex="P(\text{IsNext} \mid A, B) = \sigma(\mathbf{w}_{\text{NSP}}^T \mathbf{h}_{\text{CLS}} + b_{\text{NSP}})" />
            <MathBlock tex="\mathcal{L}_{\text{NSP}} = -\bigl[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \bigr]" />

            <h3>Total Pretraining Objective</h3>
            <MathBlock tex="\mathcal{L} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{NSP}}" />

            <h3>Fine-Tuning: Extractive Question Answering</h3>
            <p>
                For SQuAD-style extractive QA, the passage is encoded token by token. Two linear layers
                predict the probability of each token being the start or end of the answer span:
            </p>
            <MathBlock tex="P_{\text{start}}(i) = \frac{\exp(\mathbf{w}_s^T \mathbf{h}_i)}{\sum_j \exp(\mathbf{w}_s^T \mathbf{h}_j)}" />
            <MathBlock tex="P_{\text{end}}(i) = \frac{\exp(\mathbf{w}_e^T \mathbf{h}_i)}{\sum_j \exp(\mathbf{w}_e^T \mathbf{h}_j)}" />
            <p>
                The predicted answer span is (i*, j*) = argmax&#8336; argmax&#8337;&#8805;&#8336; P&#95;start(i) &#183; P&#95;end(j).
                Only two additional weight vectors w&#95;s and w&#95;e (2d parameters) are needed for the
                entire QA task.
            </p>

            <div className="ch-callout">
                <strong>Why MLM forces bidirectionality:</strong> In autoregressive LM, predicting position i
                from positions 1&#8230;i&#8722;1 is trivially unidirectional. In MLM, predicting masked position i
                from all other positions (including j &gt; i) requires the model to build representations that
                incorporate right-context. The masking objective is the key that unlocks bidirectional Transformer pretraining.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── BERT Input Encoding — NumPy ───────────────────────────────────────────────
CLS_ID, SEP_ID, PAD_ID, MASK_ID = 101, 102, 0, 103

def encode_bert_input(tokens_a, tokens_b=None, max_len=512):
    """
    Build BERT input: [CLS] tokens_a [SEP] (tokens_b [SEP])?
    Returns token_ids, segment_ids, attention_mask.
    """
    ids = [CLS_ID] + tokens_a + [SEP_ID]
    seg = [0] * len(ids)

    if tokens_b is not None:
        ids += tokens_b + [SEP_ID]
        seg += [1] * (len(tokens_b) + 1)

    # Truncate or pad to max_len
    ids  = ids[:max_len]
    seg  = seg[:max_len]
    pad_len = max_len - len(ids)
    attn = [1] * len(ids) + [0] * pad_len
    ids  = ids + [PAD_ID] * pad_len
    seg  = seg + [0]      * pad_len
    return np.array(ids), np.array(seg), np.array(attn)

# ── 80/10/10 Token Masking ────────────────────────────────────────────────────
def bert_mask(token_ids, vocab_size=30522, mask_prob=0.15):
    """
    Apply BERT's 80/10/10 masking:
      80% -> replace with [MASK] (id 103)
      10% -> replace with random token
      10% -> leave unchanged
    Returns masked_ids and labels (-100 = ignored in loss).
    """
    ids = token_ids.copy()
    labels = np.full_like(ids, -100)
    special = {CLS_ID, SEP_ID, PAD_ID}

    candidates = [i for i, t in enumerate(ids) if t not in special]
    n_mask = max(1, int(round(len(candidates) * mask_prob)))
    chosen = np.random.choice(candidates, size=n_mask, replace=False)

    for i in chosen:
        labels[i] = ids[i]
        r = np.random.rand()
        if r < 0.80:
            ids[i] = MASK_ID
        elif r < 0.90:
            ids[i] = np.random.randint(5, vocab_size)   # skip specials
        # else: unchanged (10%)
    return ids, labels

# ── Span QA Prediction ────────────────────────────────────────────────────────
def predict_span(hidden_states, w_start, w_end):
    """
    hidden_states: (seq_len, hidden_dim)
    w_start, w_end: (hidden_dim,) learned vectors
    Returns predicted start/end positions.
    """
    start_logits = hidden_states @ w_start   # (seq_len,)
    end_logits   = hidden_states @ w_end

    # Softmax for probabilities
    def softmax(x):
        e = np.exp(x - np.max(x))
        return e / e.sum()

    s_probs = softmax(start_logits)
    e_probs = softmax(end_logits)

    # Best valid span (end >= start)
    best_score = -1
    best_start, best_end = 0, 0
    for s in range(len(s_probs)):
        for e in range(s, min(s + 50, len(e_probs))):   # max span = 50 tokens
            score = s_probs[s] * e_probs[e]
            if score > best_score:
                best_score, best_start, best_end = score, s, e
    return best_start, best_end, best_score

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
vocab_size = 30522

tokens_a = [2023, 2003, 1037, 7378]   # "this is a sentence"
tokens_b = [2003, 2178, 3231]          # "is another test"

ids, seg, attn = encode_bert_input(tokens_a, tokens_b, max_len=20)
masked, labels = bert_mask(ids, vocab_size)

print("BERT Input Encoding")
print("=" * 50)
print(f"Token IDs    : {ids[:12].tolist()} ...")
print(f"Segment IDs  : {seg[:12].tolist()} ...")
print(f"Attention    : {attn[:12].tolist()} ...")
print(f"Masked IDs   : {masked[:12].tolist()} ...")
print(f"Labels       : {labels[:12].tolist()} ...")
print(f"Active positions masked: {np.sum(labels != -100)}")
print()

# QA span prediction
seq_len, hidden_dim = 20, 128
fake_hidden = np.random.randn(seq_len, hidden_dim)
w_s = np.random.randn(hidden_dim) * 0.02
w_e = np.random.randn(hidden_dim) * 0.02

start, end, score = predict_span(fake_hidden, w_s, w_e)
print(f"QA Span Prediction (random model):")
print(f"  Predicted span: [{start}, {end}], score={score:.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of BERT input encoding (token + segment + attention mask), the 80/10/10
                masked token selection strategy, and extractive span QA prediction. The demo shows how
                sentence pairs are packed and how span prediction works with learned start/end vectors.
            </p>
            <CodeBlock code={PY_CODE} filename="bert_encoding.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BERT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
