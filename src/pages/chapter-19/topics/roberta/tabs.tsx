import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Optimizing BERT to its full potential</h2>
            <p>
                BERT was a breakthrough, but its training recipe was under-optimized. The original paper
                used a small batch size (256 sequences), trained for only 1 million steps, and included
                the controversial Next Sentence Prediction task. In 2019, Yinhan Liu and colleagues at
                Facebook AI asked a simple question: what if we trained BERT properly?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">BERT — Remarkable Results, Conservative Training</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's authors were understandably cautious: pretraining a 340M parameter model on 3.3 billion words was already an enormous engineering undertaking for 2018. They settled on conservative hyperparameters — batch size 256, 1M training steps, static masking (each example gets one fixed mask for all epochs), and training on 16GB of text. The question left unanswered was: was this enough compute, data, and training time?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        BERT-Base (12 layers, 110M params) and BERT-Large (24 layers, 340M params) were released with weights and a fine-tuning recipe. The model set new SoTA on 11 tasks and became the default starting point for NLP practitioners worldwide. Within months, hundreds of papers built on BERT's foundation — but few questioned whether the pretraining itself was optimal.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        BERT's dominance masked a fundamental question: how much of its success was due to the bidirectional Transformer architecture, and how much was due to training scale? If BERT was significantly undertrained, then the architecture was even better than its results suggested — and more compute/data would yield dramatic improvements without any architectural changes.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Mar 2019 — Facebook AI Research</div>
                    <div className="ch-tl-title">The Ablation Study That Changed Pretraining</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Yinhan Liu and the Facebook AI team spent months training hundreds of BERT variants with systematically varied hyperparameters. Each training run took days on 64-1024 V100 GPUs. Their goal was not to invent a new architecture but to rigorously understand which aspects of BERT's training recipe actually mattered — and which were incidental choices made under compute constraints.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        "RoBERTa: A Robustly Optimized BERT Pretraining Approach" (July 2019) systematically tested six design choices: (1) training time and batch size, (2) NSP removal, (3) longer sequences, (4) dynamic masking, (5) more data, and (6) byte-pair encoding. Every change was tested in isolation and in combination. The cumulative result was RoBERTa — identical architecture to BERT-Large, dramatically better performance.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        RoBERTa-Large achieved 88.5 on GLUE (vs. BERT-Large's 80.5), 86.8 EM on SQuAD (vs. 84.1), and 83.2 on RACE — all without any architectural change. The results proved that BERT was massively undertrained: the architecture was sound but the training budget was insufficient. This realization redirected research attention from architecture innovation toward training recipe optimization and scaling.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jul 2019 — Liu et al.</div>
                    <div className="ch-tl-title">Dynamic Masking and Longer Training — The Key Improvements</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT used static masking: each training example was pre-processed once, with one fixed mask pattern that was reused across all epochs. For 40 epochs of training on 16GB of text, each example might be seen with the same mask dozens of times — potentially causing the model to overfit to specific mask patterns rather than learning general linguistic representations.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        RoBERTa generated a fresh random mask every time a sequence was fed to the model — called dynamic masking. Combined with a larger batch size (8,192 vs. 256) and longer training (500K steps vs. BERT's 1M steps at 256 batch, equivalent to 16x more tokens), this provided dramatically more diverse training signal per token. The batch size increase also allowed higher learning rates via linear scaling.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Dynamic masking alone improved performance measurably. Larger batches and longer training combined with more data provided the largest gains. The result demonstrated that self-supervised pretraining was far from saturated at BERT's scale — models continued to improve with more compute, larger batches, and more diverse masking, consistent with neural scaling laws that would be formally studied in 2020.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jul 2019 — Liu et al.</div>
                    <div className="ch-tl-title">Data Scale — 160GB vs. 16GB Changes Everything</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT trained on BooksCorpus (800M words) and Wikipedia (2.5B words) — approximately 16GB of text. This seemed like an enormous corpus in 2018. But the web contained orders of magnitude more text, and web-scale data might contain more diverse vocabulary, topics, and writing styles that would make representations more general.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        RoBERTa augmented BERT's training data with CC-News (63M news articles, 76GB), OpenWebText (38GB, a Reddit-curated web text clone of GPT-2's WebText dataset), and Stories (31GB of story-format web text). Total training data: ~160GB — 10x BERT's 16GB. Models were trained on this combined corpus for 500K steps at batch size 8,192, equivalent to approximately 4 trillion training tokens (vs. BERT's ~250 billion).
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Data scale was the single largest contributor to RoBERTa's improvements. Ablations showed that simply training BERT-Large longer on more data, without any other changes, accounted for much of RoBERTa's gain. This foreshadowed the Chinchilla scaling laws (Hoffmann et al. 2022): for a given compute budget, there is an optimal ratio of model size to training tokens — and BERT was dramatically under-trained relative to its parameter count.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020 — Community</div>
                    <div className="ch-tl-title">BPE Tokenization and Language-Specific Variants</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT used WordPiece tokenization with a vocabulary of 30,522 tokens built from the English training corpus. For multilingual models or specialized domains, this vocabulary was suboptimal — many subwords in medical, legal, or non-English text were unknown and had to be approximated with fragments. A more flexible tokenization scheme was needed.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        RoBERTa replaced WordPiece with Byte-Pair Encoding (BPE) operating on raw bytes — a character-level fallback that guarantees every Unicode character can be encoded without unknown tokens. With a vocabulary of 50,265 tokens (vs. BERT's 30,522), RoBERTa's tokenizer handled any text without out-of-vocabulary issues. Subsequent models (XLM-RoBERTa, DeBERTa) adopted byte-level BPE as the standard.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Byte-level BPE became the standard tokenization for most subsequent large language models, including GPT-2, GPT-3, and modern open-source models. It eliminated vocabulary-related failures on specialized text and enabled true multilingual training without language-specific vocabulary design. RoBERTa's tokenization choice proved more consequential than its training recipe changes for long-term impact on the field.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present — Community</div>
                    <div className="ch-tl-title">RoBERTa as the Encoder Baseline — Long-Lasting Impact</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        With BERT superseded by RoBERTa on benchmarks, practitioners needed guidance on which model to use in production. RoBERTa-Large weights were released on HuggingFace and immediately became the most-downloaded encoder model for text classification, NER, and extractive QA. The question was whether RoBERTa would itself be superseded quickly by new architectures.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        RoBERTa-Large remained competitive against DeBERTa variants for years on GLUE and SQuAD. Domain-specific variants appeared rapidly: SciBERT (scientific text), BioBERT (biomedical), LegalBERT (legal), FinBERT (finance) — all following RoBERTa's pretraining recipe on domain-specific corpora. The recipe (large batch, long training, dynamic masking, no NSP, BPE) became the standard template for pretraining encoder models.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        RoBERTa's lasting contribution was methodological: it established that pretraining recipe optimization is a first-class research contribution, not just engineering. The paper's core message — "evaluate your baseline honestly before inventing new methods" — became a principle of rigorous ML research. Its ablation methodology was cited as a model for how to evaluate pretraining improvements.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The key lesson:</strong> RoBERTa matched or exceeded every BERT result without
                changing the architecture at all. The only changes were in the training process: more data,
                bigger batches, longer training, dynamic masking, and removing a harmful auxiliary task.
                Sometimes the best innovation is doing the simple thing right — and measuring carefully
                enough to know what "right" means.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Doing BERT's homework better</h2>

            <Analogy label="The Same Student, Better Study Habits">
                <p>Imagine two identical students with exactly the same brain capacity. One studies for one hour a day with distractions, using old textbooks, and taking lots of breaks. The other studies for four hours a day with full focus, using the best books, and never skipping hard problems. Same brain — wildly different results.</p>
                <p>RoBERTa is the second student. Same architecture as BERT, same size, same structure. But it trained longer, on more books, with better study techniques. The result: dramatically better understanding of language, across every test it took.</p>
            </Analogy>

            <Analogy label="The Pointless Exercise">
                <p>BERT had a weird homework assignment: "guess if these two paragraphs come from the same document." But the paragraphs were so obviously different — one about dinosaurs, one about cooking — that the student learned to cheat by checking if they were about the same topic.</p>
                <p>RoBERTa said: drop that useless assignment. Spend the time instead reading full, long paragraphs and practicing fill-in-the-blank on those. More useful practice, no cheating shortcuts. Performance immediately improved on the real tests.</p>
            </Analogy>

            <Analogy label="More Books, Better Practice">
                <p>BERT read about 16 gigabytes of text — roughly 11 billion words. Impressive! But RoBERTa read 160 gigabytes — 10 times as much. News articles, books, Reddit discussions, web pages. The diversity and volume made a massive difference.</p>
                <p>And RoBERTa studied in bigger study groups: instead of 256 examples per lesson, it processed 8,192 at once. Bigger study groups make the lessons more stable and reliable — each lesson covers more ground and averages out random noise.</p>
            </Analogy>

            <Analogy label="Fresh Flashcards Every Time">
                <p>BERT made one set of flashcards (masked sentences) and used them over and over. If you study the same flashcards 40 times, you start memorizing the specific cards rather than learning the underlying language patterns.</p>
                <p>RoBERTa made fresh flashcards every time — a different set of words masked each epoch, from the same sentences. This "dynamic masking" forced the model to actually learn language rather than memorize specific training examples. More generalization, less memorization.</p>
            </Analogy>

            <Analogy label="A Better Alphabet — Byte-Pair Encoding">
                <p>BERT had a fixed vocabulary of 30,000 word pieces. If a word wasn't in the vocabulary, it got split into awkward fragments. RoBERTa switched to byte-level BPE: it could represent any text by starting with individual bytes (letters, punctuation, symbols) and combining them up.</p>
                <p>This means RoBERTa never encounters an "unknown" word. Even a word in a completely unfamiliar language or a new internet slang term gets represented cleanly. This flexibility became the standard for all major language models that followed.</p>
            </Analogy>

            <Analogy label="The Recipe That Stuck">
                <p>RoBERTa's pretraining recipe — large batches, long training, more data, dynamic masking, no NSP — became the template for all subsequent encoder models. Domain-specific BERTs (BioBERT for medicine, LegalBERT for law, SciBERT for science) all used the same recipe, just on different corpora.</p>
                <p>The lesson RoBERTa taught the research community: before inventing a new architecture, make sure your baseline is actually trained correctly. Test every assumption. Measure carefully. The best new idea might be doing the existing idea right.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The RoBERTa training recipe</h2>

            <h3>Key Changes from BERT — A Systematic Ablation</h3>
            <p>
                RoBERTa kept BERT's architecture identical (same layer count, hidden size, attention heads)
                but made six critical changes to the training process, each tested independently:
            </p>
            <ul>
                <li><strong>Dynamic masking:</strong> Instead of precomputing a single static mask per
                    example (used for all 40 epochs), RoBERTa generates a new random mask every time a
                    sequence is fed to the model. This provides more diverse training signals and reduces
                    overfitting to specific mask patterns.</li>
                <li><strong>Full sentences without NSP:</strong> Inputs are packed with full sentences
                    sampled contiguously from documents, up to the 512-token limit, without the sentence-pair
                    structure and NSP loss. This allows longer sequences and removes the NSP shortcut.</li>
                <li><strong>Larger batches:</strong> Batch size increased from 256 to 8,192 sequences.
                    Larger batches provide more stable gradient estimates and allow higher effective
                    learning rates via the linear scaling rule.</li>
                <li><strong>More data:</strong> 160GB total — 10× BERT's 16GB. CC-News (76GB) + OpenWebText
                    (38GB) + Stories (31GB) + BERT's original data (BooksCorpus + Wikipedia).</li>
                <li><strong>Longer training:</strong> 500K steps at batch size 8K ≈ 4B training examples.
                    BERT trained on ~256M examples.</li>
                <li><strong>Byte-pair encoding (BPE):</strong> 50,265 byte-level BPE tokens instead of
                    30,522 WordPiece tokens. No unknown-token failures on any Unicode text.</li>
            </ul>

            <h3>Ablation Results — Each Change Contributes</h3>
            <p>
                The RoBERTa paper's ablations showed that each of the six changes contributed independently.
                On MNLI accuracy:
            </p>
            <ul>
                <li>BERT-Large baseline: 86.6%</li>
                <li>+ Dynamic masking: 86.9% (+0.3)</li>
                <li>+ Full sentences, no NSP: 87.0% (+0.1)</li>
                <li>+ Larger batches (8K): 87.7% (+0.7)</li>
                <li>+ More data (160GB): 88.1% (+0.4)</li>
                <li>+ Longer training: 88.5% (+0.4)</li>
            </ul>
            <p>
                No single change was transformative — but together they added 1.9 MNLI points over
                BERT-Large with zero architectural change.
            </p>

            <h3>Batch Size and Learning Rate Scaling</h3>
            <p>
                RoBERTa's 32x batch size increase (256 &#8594; 8,192) required careful learning rate adjustment.
                The linear scaling rule: LR &#8770; batch_size. But direct linear scaling from BERT's 1e-4
                would give 3.2e-3 — too high. RoBERTa used 4e-4 with a 6% warmup fraction and
                polynomial decay, finding a practical sweet spot empirically.
            </p>

            <h3>Data Composition and Mixture</h3>
            <ul>
                <li><strong>BooksCorpus + Wikipedia:</strong> BERT's original 16GB — diverse books and
                    encyclopedic facts</li>
                <li><strong>CC-News:</strong> 76GB of news articles from CommonCrawl. Adds contemporary
                    events, named entities, and news writing style</li>
                <li><strong>OpenWebText:</strong> 38GB of web pages linked from Reddit posts with high
                    upvote counts — a proxy for human-curated, high-quality writing</li>
                <li><strong>Stories:</strong> 31GB of story-format CommonCrawl text — narrative
                    structure and creative writing style</li>
            </ul>
            <p>
                Total: ~160GB / 3.3 trillion bytes of text, processed with byte-level BPE tokenization.
            </p>

            <h3>Why "Robustly Optimized" Matters</h3>
            <p>
                The word "Robustly" in RoBERTa's title refers to ablation rigor. Each design choice was
                varied independently while holding others constant, measuring performance on multiple
                downstream tasks (not just one). This prevents reporting bias (cherry-picking the
                dataset where a change helps). The result: every claimed improvement was reproducible
                and contributed across tasks.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Surprising finding:</strong> BERT-Large, trained with RoBERTa's recipe (more data,
                larger batches, no NSP), matched or exceeded the original BERT results on every benchmark.
                The architecture was never the bottleneck — the training process was. This finding became
                a call for more rigorous ablation studies in NLP research, influencing how papers report
                improvements for years.
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
            <h2>Optimization dynamics at scale</h2>

            <DefBlock label="Dynamic Masking">
                Let <InlineMath tex="\mathbf{x}" /> be a training sequence. In static masking, a single mask pattern
                <InlineMath tex="\mathcal{M}(\mathbf{x})" /> is sampled once and reused for all passes. In dynamic masking,
                a fresh mask is sampled on each forward pass:
                <MathBlock tex="\mathcal{L}_{\text{dynamic}} = -\mathbb{E}_{\mathcal{M}} \sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}^{\text{masked}};\, \Theta)" />
                The expectation over masks reduces the variance of gradient estimates and increases effective
                data diversity — equivalent to a form of dropout applied at the input level.
            </DefBlock>

            <h3>Batch Size and Learning Rate Scaling</h3>
            <p>
                For SGD with learning rate <InlineMath tex="\eta" /> and batch size B, gradient variance scales as
                <InlineMath tex="1/B" />. RoBERTa increased B from 256 to 8,192 (32&#215;). The linear scaling rule
                states that learning rate should scale proportionally:
            </p>
            <MathBlock tex="\eta_{\text{new}} = \eta_{\text{base}} \cdot \frac{B_{\text{new}}}{B_{\text{base}}}" />
            <p>
                This keeps the "effective step size" (learning rate &#215; gradient magnitude) constant
                across batch sizes. In practice, direct linear scaling is often too aggressive; RoBERTa
                used a conservative empirical value with an extended warmup period.
            </p>

            <h3>Training Compute — Tokens Seen</h3>
            <p>
                Total training tokens for BERT vs. RoBERTa, given steps S, batch size B, and sequence
                length L:
            </p>
            <MathBlock tex="T = S \cdot B \cdot L" />
            <p>
                BERT-Large: S = 1M, B = 256, L = 128/512 &#8776; 250B tokens.<br />
                RoBERTa-Large: S = 500K, B = 8192, L = 512 &#8776; 2.1T tokens — 8.4&#215; more.
            </p>

            <h3>Scaling Law Interpretation</h3>
            <p>
                Kaplan et al. (2020) showed that language model loss follows a power law in compute C:
            </p>
            <MathBlock tex="L(C) = \left(\frac{C_0}{C}\right)^{\alpha_C}" />
            <p>
                With &#945;&#95;C &#8776; 0.057 (for autoregressive LM). The 8.4&#215; compute increase from BERT to
                RoBERTa predicts a loss reduction of:
            </p>
            <MathBlock tex="\Delta L = L_{\text{BERT}} \cdot \left(1 - 8.4^{-\alpha_C}\right) \approx 0.10 \cdot L_{\text{BERT}}" />
            <p>
                A 10% reduction in perplexity is substantial and consistent with the observed ~8-point
                GLUE improvement. RoBERTa's empirical results were later understood as early confirmation
                of the scaling law framework.
            </p>

            <h3>Data Mixture and Domain Shift</h3>
            <p>
                RoBERTa sampled documents from a mixture of corpora with frequencies &#960;&#8336; (set empirically).
                For each training step, a document is sampled from corpus j with probability &#960;&#8336;:
            </p>
            <MathBlock tex="P(\text{document}) = \sum_{j} \pi_j \cdot P_j(\text{document})" />
            <p>
                The mixture proportions were tuned so that no single corpus dominated. News and web text
                were given higher weights than Wikipedia and books, reflecting the diversity benefit of
                contemporary and conversational writing styles.
            </p>

            <div className="ch-callout">
                <strong>Scaling insight:</strong> RoBERTa's results foreshadowed the Kaplan scaling laws
                (2020) and the Chinchilla optimal training laws (2022). The consistent message: for a given
                compute budget, train on more tokens with proportionally sized models rather than training
                smaller models too long or larger models too briefly. BERT's under-training was an early
                data point in this understanding.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Dynamic vs Static Masking ─────────────────────────────────────────────────
def static_mask(tokens, mask_id=103, mask_prob=0.15, seed=42):
    """Static masking: one mask pattern per example, reused every epoch."""
    rng = np.random.default_rng(seed)
    ids    = np.array(tokens, copy=True)
    labels = np.full_like(ids, -100)
    special = {0, 101, 102}
    cands  = [i for i, t in enumerate(ids) if t not in special]
    n_mask = max(1, int(round(len(cands) * mask_prob)))
    chosen = rng.choice(cands, size=n_mask, replace=False)
    for i in chosen:
        labels[i] = ids[i]
        ids[i]    = mask_id
    return ids, labels

def dynamic_mask(tokens, mask_id=103, mask_prob=0.15):
    """Dynamic masking: fresh random mask on each call."""
    ids    = np.array(tokens, copy=True)
    labels = np.full_like(ids, -100)
    special = {0, 101, 102}
    cands  = [i for i, t in enumerate(ids) if t not in special]
    n_mask = max(1, int(round(len(cands) * mask_prob)))
    chosen = np.random.choice(cands, size=n_mask, replace=False)
    for i in chosen:
        labels[i] = ids[i]
        r = np.random.rand()
        if r < 0.80:
            ids[i] = mask_id
        elif r < 0.90:
            ids[i] = np.random.randint(5, 30522)
    return ids, labels

# ── Linear Learning Rate Scaling Rule ────────────────────────────────────────
def scaled_lr(base_lr, base_batch, new_batch, conservative=0.5):
    """
    Linear scaling rule with a conservative factor (< 1.0).
    Full linear: new_lr = base_lr * (new_batch / base_batch).
    Conservative: apply a dampening factor.
    """
    linear_lr = base_lr * (new_batch / base_batch)
    return base_lr + conservative * (linear_lr - base_lr)

# ── Training Token Count ──────────────────────────────────────────────────────
def training_tokens(steps, batch_size, seq_len):
    """Total tokens seen during training."""
    return steps * batch_size * seq_len

# ── Scaling Law Prediction ────────────────────────────────────────────────────
def scaling_law_loss(compute, C0=1e21, alpha=0.057):
    """Kaplan et al. power-law: L(C) = (C0/C)^alpha."""
    return (C0 / compute) ** alpha

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

tokens = [101, 2023, 2003, 1037, 3231, 1997, 4083, 102, 0, 0, 0, 0]

# Static mask: same pattern every time
static_m1, _ = static_mask(tokens, seed=42)
static_m2, _ = static_mask(tokens, seed=42)   # identical to m1!

# Dynamic mask: different pattern each call
dynamic_m1, _ = dynamic_mask(tokens)
dynamic_m2, _ = dynamic_mask(tokens)           # different from m1

print("Static vs Dynamic Masking")
print("=" * 55)
print(f"Original    : {tokens}")
print(f"Static  (e1): {static_m1.tolist()}")
print(f"Static  (e2): {static_m2.tolist()}   <- identical!")
print(f"Dynamic (e1): {dynamic_m1.tolist()}")
print(f"Dynamic (e2): {dynamic_m2.tolist()}   <- different!")
print()

# Learning rate scaling
bert_lr  = 1e-4
roberta_lr = scaled_lr(bert_lr, 256, 8192, conservative=0.4)
print(f"BERT learning rate (batch=256):    {bert_lr:.2e}")
print(f"RoBERTa LR (batch=8192, cons=0.4): {roberta_lr:.2e}")
print()

# Training token counts
bert_tokens = training_tokens(steps=1_000_000, batch_size=256, seq_len=512)
rbt_tokens  = training_tokens(steps=500_000,  batch_size=8192, seq_len=512)
print(f"BERT training tokens:    {bert_tokens/1e9:.1f}B")
print(f"RoBERTa training tokens: {rbt_tokens /1e9:.1f}B  ({rbt_tokens/bert_tokens:.1f}x more)")
print()

# Scaling law estimate
# FLOPs ≈ 6 * N * T (N=params, T=tokens)
N = 340e6   # BERT/RoBERTa Large
bert_flops = 6 * N * bert_tokens
rbt_flops  = 6 * N * rbt_tokens
loss_ratio = (bert_flops / rbt_flops) ** 0.057
print(f"Predicted loss ratio (BERT / RoBERTa): {1/loss_ratio:.3f}")
print(f"(>1 means RoBERTa should have lower perplexity)")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of static vs. dynamic masking, the linear learning rate scaling rule,
                training token calculation, and Kaplan scaling law predictions. The demo shows that static
                masking produces identical mask patterns across epochs while dynamic masking varies, and
                quantifies the compute gap between BERT and RoBERTa.
            </p>
            <CodeBlock code={PY_CODE} filename="roberta_ablation.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ROBERTA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
