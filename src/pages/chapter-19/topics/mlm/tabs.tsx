import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning language by filling in blanks</h2>
            <p>
                Before BERT, language models were trained autoregressively: predict the next word given
                all previous words. This forced models to be left-to-right (or right-to-left), preventing
                deep bidirectional fusion. Devlin et al. borrowed an idea from cloze tests in psychology:
                if you delete a word and ask the model to guess it from all surrounding context, the model
                must learn to use both directions simultaneously.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1953 — Taylor</div>
                    <div className="ch-tl-title">The Cloze Procedure — Blanks as a Reading Test</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Educational psychologists in the 1950s needed a practical way to assess reading comprehension without elaborate test design. Standardized tests with questions and answer choices were expensive to create and hard to calibrate. A simpler method was needed that naturally probed a reader's understanding of language structure, vocabulary, and discourse.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Psychologist W.L. Taylor invented the "cloze test" in 1953: delete every Nth word from a
                        passage and ask readers to fill in the blanks. The task requires understanding
                        grammar (what part of speech fits?), semantics (what meaning fits the context?), and discourse (what is the passage about?). To fill in a blank correctly, you must read both what came before and what came after — you cannot do it from context in a single direction alone.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The cloze procedure became a standard test of reading comprehension in linguistics and education research. It also provided the conceptual template for BERT's Masked Language Modeling, sixty-five years later. The insight that "filling in blanks tests deep language understanding" translated directly into a powerful self-supervised training objective: if a machine can fill in blanks well, it understands language well.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 – 2018 — Various</div>
                    <div className="ch-tl-title">The Unidirectionality Trap in Neural LMs</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Neural language models from Word2Vec through GPT-1 all shared the same objective: predict the next token from all previous tokens. This autoregressive formulation is convenient — it provides a clear probability distribution over sequences — but it imposes a directional constraint. The model's representation of any token can only incorporate left-context. For tasks that require understanding a word's meaning in context (word sense disambiguation, coreference resolution), this is a severe limitation.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ELMo attempted bidirectionality by training two separate LSTMs — one forward, one backward — and concatenating their outputs. This gave surface-level bidirectionality but the two directions never interacted internally. The representations at each layer were still computed independently in each direction. True deep bidirectionality required a different training objective entirely.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The directionality trap was a theoretical limitation, not just an engineering choice. Autoregressive LMs impose an ordering on token processing that fundamentally prevents each position from incorporating future context during pretraining. Understanding "The pilot landed the plane on the runway" requires knowing "runway" to interpret "landed" correctly — impossible if you process left-to-right and commit to "landed" before seeing "runway."
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">Masked Language Modeling — The Bidirectionality Solution</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        A Transformer encoder can attend to all positions simultaneously — it's naturally bidirectional. But training it to predict the next token would be cheating: the model could see the target token in its full bidirectional attention window. A new training objective was needed that (a) required bidirectional attention, (b) was self-supervised (no human labels), and (c) provided a rich enough signal to learn deep language representations.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        BERT replaced next-word prediction with masked-word prediction. 15% of input tokens are randomly selected; of those, 80% are replaced with the special [MASK] token, 10% with a random word from the vocabulary, and 10% left unchanged. The model must predict the original word at every selected position using full bidirectional context. The 80/10/10 split is crucial: always masking would create a mismatch between pretraining (with [MASK]) and fine-tuning (without [MASK]).
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        MLM enabled the first truly deep bidirectional Transformer pretraining. The model's representations for every token incorporate both left and right context — not as a post-hoc concatenation, but as a fundamental property of how attention was computed during every layer of pretraining. BERT's dramatic improvements on 11 NLP tasks were largely attributable to this deeper, richer bidirectional context.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 — Joshi et al.</div>
                    <div className="ch-tl-title">SpanBERT — Masking Contiguous Spans</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's token-level masking was good but left room for improvement on tasks requiring reasoning about multi-token entities and phrases. Coreference resolution requires understanding noun phrases as units. Extractive question answering requires finding an answer span — multiple consecutive tokens. If pretraining only masked individual tokens, the model never learned to reason about spans as coherent units.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        SpanBERT (Joshi et al. 2019) replaced BERT's token-level masking with span masking: mask contiguous sequences of tokens (average length 3.8 tokens, drawn from a geometric distribution). A "span boundary objective" also required the model to predict masked span tokens using only the boundary representations (the tokens just before and after the span), not the interior tokens. This forced the model to encode span-level information in boundary representations.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        SpanBERT significantly improved performance on span-selection tasks: extractive QA (SQuAD, NewsQA), coreference resolution, and relation extraction. The span boundary objective proved that task-specific structure in the pretraining objective matters — you get better at spans by practicing on spans. This principle influenced T5's span corruption objective and subsequent work on structured pretraining.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2021 — Various groups</div>
                    <div className="ch-tl-title">Whole-Word Masking and Multilingual Extensions</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT used WordPiece tokenization, which splits words into subword pieces. Masking worked at the subword level: the word "running" might be split into ["run", "##ning"], and only "##ning" might be masked. This meant the model often had easy partial cues (seeing "run" makes guessing "##ning" trivial) and wasn't learning to predict entire word forms as units.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Google's BERT-WWM (Whole Word Masking) extended masking to all subwords of a word simultaneously: if "##ning" was selected, "run" was also masked. Chinese BERT used character-level masking for Chinese text; mBERT (multilingual BERT) trained on 104 languages simultaneously. XLM-RoBERTa scaled multilingual pretraining to 2.5TB of data across 100 languages.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Whole-word masking consistently improved performance on downstream tasks, confirming that word-level granularity is more natural than subword-level masking. Multilingual models demonstrated that MLM could learn cross-lingual representations — the same model could solve tasks in languages it had never been explicitly fine-tuned on (zero-shot cross-lingual transfer), simply by sharing the masked prediction objective across languages.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 — Clark et al.</div>
                    <div className="ch-tl-title">ELECTRA — Replacing MLM with Replaced Token Detection</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        MLM's fundamental inefficiency: only 15% of tokens contribute to the loss per training step. The other 85% provide context but receive no gradient signal. For a 512-token sequence, only ~77 positions actually train the model per step. With the same computational budget, could a different objective provide training signal on every token?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ELECTRA used a generator-discriminator setup. A small generator BERT predicts replacements for 15% of tokens (as in MLM). The discriminator (the main model) sees the corrupted sequence and must predict for each token whether it was replaced by the generator or is the original token. This "replaced token detection" objective applies to every token — 100% training signal per step versus MLM's 15%.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ELECTRA achieved comparable accuracy to RoBERTa with 4x less compute. At the same compute budget, ELECTRA significantly outperformed BERT and approached RoBERTa. The 6.7x improvement in training signal efficiency was the most significant advance in pretraining efficiency since MLM itself. ELECTRA's replaced token detection objective became an important benchmark for understanding the tradeoffs between different masking-based objectives.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The 80/10/10 rule:</strong> If all selected tokens were always replaced with [MASK],
                the model would only ever see [MASK] tokens during pretraining but real tokens during
                fine-tuning — a train-test distribution mismatch. By keeping 10% unchanged, the model
                learns to produce good representations even for visible (non-masked) tokens. By replacing
                10% with random words, the model cannot rely on context alone; it must also trust its
                representation of the current token, even when it looks plausible.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The missing word game</h2>

            <Analogy label="Mad Libs Backward">
                <p>Have you ever played Mad Libs? Someone asks for a noun, a verb, an adjective, and you
                fill in the blanks without knowing the story. Masked Language Modeling is like that,
                but backward: the story is complete except for a few hidden words, and you have to
                guess what they are by reading the whole story.</p>
                <p>BERT hides about 15% of words in a sentence by replacing them with a special [MASK] token, and then tries to guess the original words. To guess well, it has to read every other word in the sentence — including words that appear after the blank. That's what makes it bidirectional.</p>
            </Analogy>

            <Analogy label="The Detective">
                <p>Imagine you're a detective and someone has blacked out a few words in a letter. You
                can read everything else — before and after each blacked-out spot. Using clues from
                both sides, you figure out the missing words. The more letters you solve, the better
                you get at understanding language, context, and even hidden meanings.</p>
                <p>BERT solved billions of these detective puzzles. After all that practice, it became an expert at understanding how every word fits into its context — which is exactly what you need for tasks like question answering, sentiment analysis, and language understanding.</p>
            </Analogy>

            <Analogy label="Why Not Just Read Forward?">
                <p>If you only read forward, you might think "bank" means money when you see "I went to the bank." But if you can peek ahead and see "to go fishing," you know it's the riverbank. Reading
                both ways at once makes you smarter about words with multiple meanings — and about everything else in language too.</p>
                <p>GPT-1 read only forward: by the time it processed "bank," it hadn't seen the words after it. BERT reads everything at once. For the task of understanding language deeply (not generating new text), bidirectional context is almost always better.</p>
            </Analogy>

            <Analogy label="The Tricky 10% Trick">
                <p>BERT doesn't always replace words with [MASK]. Sometimes it swaps in a completely random word (like replacing "cat" with "airplane" in "The cat sat on the mat"). And sometimes it doesn't change the word at all.</p>
                <p>Why the tricks? If BERT only ever saw [MASK] during training but real words during use, it would be confused. By occasionally keeping real words and using random replacements, BERT learns to handle all situations — including when the input looks normal and when it looks suspicious. It becomes a more robust reader.</p>
            </Analogy>

            <Analogy label="SpanBERT — Masking Whole Phrases">
                <p>Later researchers noticed that BERT sometimes had it too easy: if only "##ing" was hidden in "I'm walk[MASK]," seeing "walk" makes the answer obvious. SpanBERT fixed this by hiding whole phrases at once: instead of hiding one word, hide "walked to the store." Now you have to understand the entire surrounding context to figure out what happened in the middle.</p>
                <p>Masking whole phrases made BERT much better at finding answer spans in reading comprehension ("Who won the game?" &#8594; find the span "The home team") because the training task now matched the real task more closely.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>How Masked Language Modeling works</h2>

            <h3>The Masking Strategy — The 80/10/10 Rule</h3>
            <p>
                For each input sequence, 15% of non-special tokens are randomly selected as prediction
                targets. For each selected token, one of three operations is applied:
            </p>
            <ul>
                <li><strong>80% of selected tokens:</strong> Replace with the special [MASK] token (id 103)</li>
                <li><strong>10% of selected tokens:</strong> Replace with a random token sampled uniformly from the vocabulary</li>
                <li><strong>10% of selected tokens:</strong> Leave the token unchanged</li>
            </ul>
            <p>
                Only the selected 15% of positions contribute to the MLM loss. The remaining 85% serve
                as bidirectional context but receive no gradient signal from MLM (only from NSP).
                This creates an asymmetry: the model must learn from sparse prediction targets but
                benefits from dense bidirectional context.
            </p>

            <h3>Why Bidirectionality Emerges</h3>
            <p>
                In autoregressive LM, the prediction of position i uses only positions 1&#8230;i&#8722;1.
                In MLM, position i is masked, and its prediction uses all other positions — including
                j &gt; i. This means:
            </p>
            <ul>
                <li>The representation of "bank" in "river bank" incorporates "river" (left) AND the words after (right)</li>
                <li>Subject-verb agreement can use both the subject (left) and verb agreement markers (right)</li>
                <li>Pronoun resolution (coreference) can use distant antecedents from both directions</li>
                <li>Every layer of the Transformer encoder performs full bidirectional attention — left-to-right and right-to-left simultaneously, fused in a single attention matrix</li>
            </ul>

            <h3>Span Masking — SpanBERT Extension</h3>
            <p>
                SpanBERT masks contiguous spans rather than individual tokens. Span lengths are drawn
                from a geometric distribution (mean 3.8 tokens). A span boundary objective additionally
                requires predicting masked-span tokens using only the representations of the two boundary
                tokens (the tokens immediately before and after the span), preventing the model from using
                interior span context:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SBO}} = -\sum_{i \in \text{span}} \log P(x_i \mid \mathbf{h}_{s-1}, \mathbf{h}_{e+1}, \mathbf{p}_i)" />
            <p>
                where s and e are the span start and end positions, h&#8321;&#8325;&#8321; and h&#8337;&#8330;&#8321; are the boundary
                hidden states, and p&#8336; is a fixed position embedding indicating which span position is
                being predicted.
            </p>

            <h3>MLM vs. Autoregressive LM — Training Signal Density</h3>
            <ul>
                <li><strong>Autoregressive LM (GPT):</strong> Every token is a prediction target. Dense signal: 100% of positions contribute to the loss per step.</li>
                <li><strong>MLM (BERT):</strong> Only 15% of positions are prediction targets. Sparse signal: 6.7&#215; fewer learning signals per step.</li>
                <li><strong>Replaced Token Detection (ELECTRA):</strong> Every token is a binary discrimination target. Dense signal: 100% of positions, but a different (easier per-token) task.</li>
            </ul>
            <p>
                MLM's 15% masking rate was a deliberate choice: if too many tokens are masked, the
                model loses context needed for prediction; if too few, pretraining is slow. Empirically,
                15% was found to be near-optimal for BERT-scale models.
            </p>

            <h3>Train-Test Mismatch and the 80/10/10 Rationale</h3>
            <p>
                The [MASK] token never appears during fine-tuning — only during pretraining. This creates
                a distribution mismatch: the model was trained to handle [MASK] but must process normal
                tokens at inference time. The 80/10/10 strategy mitigates this:
            </p>
            <ul>
                <li><strong>80% [MASK]:</strong> Provides the strong bidirectional pretraining signal</li>
                <li><strong>10% random:</strong> Forces the model to build a representation for every token that is useful even when that token is visible (not masked), since it might be a random replacement</li>
                <li><strong>10% unchanged:</strong> The model learns that even when a token appears in its expected form, it should still be predicted from context — reducing over-reliance on the token identity itself</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key insight:</strong> MLM transforms language modeling from a generation task
                into a denoising task. The model learns not to predict sequences but to reconstruct
                corrupted ones — a paradigm that would later inspire BART, T5, and diffusion language
                models. The masking approach proved that the specific self-supervised objective shapes
                the learned representations as much as the architecture does.
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
            <h2>The mathematics of masked prediction</h2>

            <DefBlock label="Masked Language Modeling Objective">
                Given an input sequence <InlineMath tex="\mathbf{x} = (x_1, \dots, x_n)" />, let <InlineMath tex="\mathcal{M}" /> be a random
                subset of positions with <InlineMath tex="|\mathcal{M}| \approx 0.15n" />. The masked input
                <InlineMath tex="\mathbf{x}^{\text{masked}}" /> replaces each <InlineMath tex="x_i" /> for <InlineMath tex="i \in \mathcal{M}" />
                with a corrupted token <InlineMath tex="\tilde{x}_i" /> according to the 80/10/10 rule. The MLM objective is:
                <MathBlock tex="\mathcal{L}_{\text{MLM}} = -\mathbb{E}_{\mathbf{x}} \sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}^{\text{masked}};\, \Theta)" />
                Crucially, the conditioning is on the <em>full</em> masked input — all positions are visible to all others in the Transformer encoder attention.
            </DefBlock>

            <h3>Corruption Distribution</h3>
            <p>
                For each selected position <InlineMath tex="i \in \mathcal{M}" />, the corrupted token is sampled:
            </p>
            <MathBlock tex="\tilde{x}_i = \begin{cases} \text{[MASK]} & \text{with prob. } 0.8 \\ \text{Uniform}(\mathcal{V}) & \text{with prob. } 0.1 \\ x_i & \text{with prob. } 0.1 \end{cases}" />

            <h3>Output Layer and Tied Embeddings</h3>
            <p>
                The final hidden state <InlineMath tex="\mathbf{h}_i \in \mathbb{R}^d" /> for position i is projected to
                vocabulary logits via the output embedding matrix <InlineMath tex="\mathbf{E} \in \mathbb{R}^{V \times d}" />
                (tied with the input token embedding matrix) plus a bias vector:
            </p>
            <MathBlock tex="\mathbf{z}_i = \text{LayerNorm}(\mathbf{W}_{\text{out}} \mathbf{h}_i) \cdot \mathbf{E}^T + \mathbf{b}_{\text{out}}" />
            <MathBlock tex="P(x_i = v \mid \mathbf{x}^{\text{masked}}) = \frac{\exp(z_{i,v})}{\sum_{v'} \exp(z_{i,v'})}" />

            <h3>Gradient Signal Analysis</h3>
            <p>
                Only positions in <InlineMath tex="\mathcal{M}" /> have non-zero MLM loss gradients. The gradient with respect
                to the hidden state at a masked position i is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}_{\text{MLM}}}{\partial \mathbf{h}_i} = \mathbf{E}^T (\mathbf{p}_i - \mathbf{e}_{x_i})" />
            <p>
                where <InlineMath tex="\mathbf{p}_i" /> is the predicted probability distribution and <InlineMath tex="\mathbf{e}_{x_i}" /> is
                the one-hot vector for the true token. This gradient propagates through all 12 (or 24)
                self-attention layers, updating every parameter in the model.
            </p>

            <h3>Comparison with Autoregressive LM</h3>
            <p>
                For autoregressive LM, the loss is summed over all positions, giving a total gradient of:
            </p>
            <MathBlock tex="\mathbb{E}\left[\left|\frac{\partial \mathcal{L}_{\text{CLM}}}{\partial \Theta}\right|\right] = n \cdot g" />
            <p>
                For MLM with 15% masking:
            </p>
            <MathBlock tex="\mathbb{E}\left[\left|\frac{\partial \mathcal{L}_{\text{MLM}}}{\partial \Theta}\right|\right] = 0.15n \cdot g'" />
            <p>
                where g and g' are the per-position gradient magnitudes. MLM receives 6.7&#215; fewer gradient
                signals per step, but each signal is richer because it uses bidirectional context.
                ELECTRA's replaced token detection recovers the dense signal with a simpler per-token task.
            </p>

            <div className="ch-callout">
                <strong>Why tied embeddings work:</strong> BERT ties the input embedding matrix <InlineMath tex="\mathbf{E}" />
                with the output projection. This acts as a strong regularizer: the model must use the same
                geometric structure in embedding space for both encoding input tokens and predicting output
                tokens. Words that should be predicted in similar contexts will be pulled toward similar
                regions of embedding space, reinforcing semantic clustering.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── MLM Masking Strategy — NumPy ──────────────────────────────────────────────
def mlm_mask(token_ids, vocab_size=30522, mask_id=103, mask_prob=0.15,
             mask_ratio=0.80, random_ratio=0.10):
    """
    Apply BERT's 80/10/10 masking strategy.
    Returns (masked_ids, labels) where labels[i] = -100 for non-selected positions.
    """
    masked = np.array(token_ids, copy=True)
    labels = np.full_like(token_ids, -100)

    # Exclude CLS=101, SEP=102, PAD=0
    candidates = [i for i, t in enumerate(token_ids) if t not in (0, 101, 102)]
    n_mask = max(1, int(round(len(candidates) * mask_prob)))
    selected = np.random.choice(candidates, size=n_mask, replace=False)

    for i in selected:
        labels[i] = token_ids[i]
        r = np.random.rand()
        if r < mask_ratio:
            masked[i] = mask_id                            # 80%: [MASK]
        elif r < mask_ratio + random_ratio:
            masked[i] = np.random.randint(5, vocab_size)  # 10%: random
        # else: unchanged                                  # 10%: keep

    return masked, labels

# ── MLM Cross-Entropy Loss ────────────────────────────────────────────────────
def mlm_loss(logits, labels):
    """
    logits: (seq_len, vocab_size) - pre-softmax scores
    labels: (seq_len,)            - true token ids, -100 = ignore
    """
    active = labels != -100
    if not np.any(active):
        return 0.0
    act_logits = logits[active]
    act_labels = labels[active]

    # Numerically stable softmax + log
    act_logits -= np.max(act_logits, axis=1, keepdims=True)
    log_probs = act_logits - np.log(np.sum(np.exp(act_logits), axis=1, keepdims=True))
    nll = -log_probs[np.arange(len(act_labels)), act_labels]
    return float(np.mean(nll))

# ── Span Masking (SpanBERT style) ─────────────────────────────────────────────
def span_mask(token_ids, vocab_size=30522, mask_id=103, mask_prob=0.15,
              mean_span_len=3.8):
    """
    Geometric span masking: randomly select spans until ~15% of tokens are masked.
    """
    ids = np.array(token_ids, copy=True)
    labels = np.full_like(ids, -100)
    n = len(ids)
    target_masked = int(round(n * mask_prob))
    masked_count = 0
    special = {0, 101, 102}

    attempts = 0
    while masked_count < target_masked and attempts < 100:
        attempts += 1
        # Geometric span length
        span_len = max(1, int(np.random.geometric(1 / mean_span_len)))
        start = np.random.randint(0, max(1, n - span_len))
        end   = min(start + span_len, n)
        # Check no special tokens in span
        if any(ids[i] in special for i in range(start, end)):
            continue
        for i in range(start, end):
            if labels[i] == -100:   # not already masked
                labels[i] = ids[i]
                ids[i] = mask_id
                masked_count += 1

    return ids, labels

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
vocab_size = 30522

tokens = [101, 2023, 2003, 1037, 3231, 1997, 8953, 3128, 102, 0, 0, 0]

token_masked, token_labels = mlm_mask(tokens, vocab_size)
span_masked,  span_labels  = span_mask(tokens, vocab_size)

print("MLM Masking Comparison")
print("=" * 52)
print(f"Original : {tokens}")
print()
print(f"Token MLM masked : {token_masked}")
print(f"Token MLM labels : {token_labels.tolist()}")
print(f"  Active positions: {int(np.sum(token_labels != -100))}")
print()
print(f"Span MLM masked  : {span_masked.tolist()}")
print(f"Span MLM labels  : {span_labels.tolist()}")
print(f"  Active positions: {int(np.sum(span_labels != -100))}")
print()

# Loss with fake logits
n_active = int(np.sum(token_labels != -100))
fake_logits = np.random.randn(len(tokens), vocab_size)
loss = mlm_loss(fake_logits, token_labels)
print(f"MLM loss (random model):  {loss:.4f}")
print(f"Expected (log vocab_size): {np.log(vocab_size):.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of BERT's token-level MLM masking (80/10/10 rule), the MLM
                cross-entropy loss, and SpanBERT-style geometric span masking. The demo compares
                token-level and span-level masking on the same input.
            </p>
            <CodeBlock code={PY_CODE} filename="mlm_masking.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MLM_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
