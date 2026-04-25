import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Teaching models to understand sentence relationships</h2>
            <p>
                While Masked Language Modeling teaches word-level understanding, many NLP tasks require
                reasoning about relationships between sentences: Does sentence B follow from A? Does B
                contradict A? Are they unrelated? BERT's creators introduced Next Sentence Prediction (NSP)
                to teach the model sentence-level coherence and discourse structure.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2018 — Various</div>
                    <div className="ch-tl-title">Sentence Pair Tasks — A Persistent NLP Challenge</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        NLP benchmarks increasingly required models to reason about pairs of sentences: Natural Language Inference (entailment/contradiction/neutral), paraphrase detection (do these sentences mean the same thing?), and question answering (does this passage answer this question?). Models trained on single-sentence word prediction had no inherent incentive to learn the relationship between two sentences — they processed each independently.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Task-specific models for sentence pair tasks used specialized architectures: decomposable attention for NLI (Parikh et al. 2016), BiMPM for sentence matching (Wang et al. 2017), and various cross-attention mechanisms. Each required task-specific labeled data and architecture design. A general-purpose pretrained model for sentence pairs needed a sentence-level pretraining objective.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Sentence pair tasks were central to many practical NLP applications: fact verification, answer extraction, semantic search. Training specialized models for each was expensive and brittle. If a single pretrained model could develop sentence-level discourse understanding, it could be fine-tuned for all these tasks with minimal additional data.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">NSP — Next Sentence Prediction in BERT</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        BERT's MLM objective trained word-level understanding but provided no explicit incentive for sentence-level reasoning. Devlin et al. wanted the model to develop discourse understanding — knowing that "I was hungry, so I went to the restaurant" is coherent but "I was hungry. The sky is blue." is not. Without a pretraining signal for this, the model would need to learn it from scratch during fine-tuning on sentence pair tasks.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        NSP was a simple binary classification task trained jointly with MLM. 50% of training examples used a genuine sentence pair (B follows A in the original document), labeled IsNext. 50% used a random sentence B from elsewhere in the corpus, labeled NotNext. The [CLS] token's final hidden state was fed to a linear classifier. Both positive and negative examples were processed with [CLS] A [SEP] B [SEP] formatting.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        NSP reached 97-98% accuracy quickly during BERT's pretraining, suggesting strong learning of sentence coherence. On downstream tasks, BERT with NSP outperformed ablations without NSP on several sentence pair tasks including QA and NLI. Devlin et al. claimed NSP was responsible for some of BERT's improvements on multi-sentence tasks.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jul 2019 — Liu et al. (RoBERTa)</div>
                    <div className="ch-tl-title">The RoBERTa Ablation — NSP Hurts Performance</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Facebook AI's RoBERTa team systematically re-evaluated every aspect of BERT's training recipe. One of their most surprising findings concerned NSP: when they removed NSP entirely and trained on single contiguous sequences of up to 512 tokens (sampled from full documents without sentence-pair structure), performance improved across almost all downstream tasks, including the sentence pair tasks NSP was designed to help.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        The RoBERTa paper tested four input formats: BERT-style NSP pairs, no NSP with document sentences, no NSP with full sentences crossing document boundaries, and no NSP with doc-sentences. The full-sentences (no NSP) format — long contiguous sequences without sentence-pair structure — consistently outperformed the NSP variants. The team concluded that NSP's negative effect came from shorter sequences (pairs must fit in 512 tokens) rather than its classification signal.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        RoBERTa's NSP ablation was one of the most important "negative results" in NLP: a carefully designed pretraining objective, included in the most influential NLP paper, turned out to be counterproductive. The result taught the community that benchmark performance is a poor proxy for the true cause of improvements — longer sequences provided richer context that outweighed any benefits from sentence-level pretraining. All subsequent encoder models (ALBERT-SOP excepted) dropped NSP.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Sep 2019 — Lan et al. (ALBERT)</div>
                    <div className="ch-tl-title">Sentence Order Prediction — A Better Sentence Objective</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        ALBERT's authors analyzed why NSP failed. Their diagnosis: NSP was too easy because random negative examples came from different documents, allowing the model to discriminate positive from negative pairs by topic matching alone — without learning anything about discourse coherence or sentence ordering. The task needed to be harder.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ALBERT replaced NSP with Sentence Order Prediction (SOP). Given two consecutive sentences from the same document: 50% of pairs appear in their original order (positive), 50% are swapped (negative). Because both orderings are semantically coherent and share a topic, the model cannot rely on topic mismatch to discriminate. It must understand discourse structure — temporal ordering, causal relationships, narrative flow — to detect the swap.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        SOP improved ALBERT's performance on multi-sentence tasks including SQuAD and RACE. Crucially, SOP was also shown to solve NSP (an ALBERT model trained with SOP achieved high NSP accuracy), while NSP models failed to solve SOP. This confirmed the diagnosis: NSP's positive/negative discrimination was captured by a simpler signal (topic), while SOP required genuine discourse understanding.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2021 — Various</div>
                    <div className="ch-tl-title">The Consensus — Long Context, Not Sentence Tasks</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        With RoBERTa (no NSP) and ALBERT (SOP) both outperforming original BERT, the field needed to settle on best practices. Multiple ablation studies from different groups tested combinations: NSP vs. SOP vs. no sentence task, document-level vs. cross-document sampling, and fixed vs. full 512-token sequences. The results were consistent but the reasons were debated.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        The consensus that emerged: sentence-level objectives are not inherently harmful, but NSP's specific implementation (random cross-document negatives) introduced a topic discrimination shortcut that prevented genuine discourse learning and wasted model capacity on a trivial task. Long contiguous sequences packed with full sentences provided richer context for MLM, outweighing any benefit from NSP's binary classification signal.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The NSP controversy contributed to a broader lesson about self-supervised pretraining: the quality of the pretraining signal matters as much as the quantity of data. A poor pretraining objective can actively hurt downstream performance by directing model capacity toward easy shortcuts. Subsequent pretraining objectives (MLM on long contexts, permuted LM in XLNet, replaced token detection in ELECTRA) all benefited from this lesson.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – present — Sentence transformers research</div>
                    <div className="ch-tl-title">Contrastive Pretraining — The Modern Sentence Objective</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Even if NSP and SOP were suboptimal, the underlying goal — teaching models to understand sentence relationships — remained important. Semantic search, retrieval, and embedding tasks all required models that could represent sentences as comparable vectors. MLM alone produced good token representations but poor sentence representations.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Contrastive learning objectives (SimCSE, Sentence-BERT) trained models to produce similar representations for semantically similar sentences. SBERT fine-tuned BERT with a Siamese network architecture on NLI data, producing [CLS] representations suitable for cosine similarity computation. SimCSE used dropout noise to create positive pairs (the same sentence passed through the model twice with different dropout masks = similar embeddings).
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Sentence-level pretraining and fine-tuning objectives matured from NSP's binary classification to rich contrastive learning, producing models purpose-built for semantic similarity, dense retrieval, and embedding. The progression from NSP to SOP to contrastive learning shows how a flawed original idea can still point toward a valuable research direction — better techniques emerged by understanding why NSP failed.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The verdict:</strong> NSP was well-intentioned but flawed. Its ease made it a
                weak signal, and the topic-matching shortcut meant models weren't learning true discourse.
                Modern encoder models use SOP, span prediction, or skip sentence-level objectives entirely,
                relying on large-scale MLM on long contiguous text to implicitly learn coherence.
                The NSP story is a valuable lesson: pretraining objective design requires careful analysis
                of what shortcuts the model can exploit.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Does this sentence follow?</h2>

            <Analogy label="The Story Continues">
                <p>Imagine someone tells you the beginning of a story, then gives you two possible next
                paragraphs. One really continues the story; the other is from a completely different book.
                NSP is like training a model to tell which paragraph is the real continuation just by
                reading both.</p>
                <p>BERT was shown 50% real continuations (IsNext) and 50% random paragraphs from anywhere in the corpus (NotNext). Over millions of examples, BERT learned to recognize when sentences naturally followed each other in a document.</p>
            </Analogy>

            <Analogy label="The Easy Shortcut">
                <p>But here's the problem: the model got too good at cheating. If paragraph A is about
                dinosaurs and paragraph B is about baking cookies, the model knows they're unrelated
                without actually understanding either paragraph. It just matched topics. That's why
                the model reached 97% accuracy very quickly — it wasn't actually learning about sentence flow.</p>
                <p>Researchers later discovered that models trained without NSP actually did better on most tasks. The task was so easy that it wasn't teaching the model anything useful — it was just wasting training capacity on a trivial topic-matching game.</p>
            </Analogy>

            <Analogy label="The Harder Game — Sentence Order Prediction">
                <p>ALBERT (2019) invented a better version called Sentence Order Prediction (SOP). Instead of "does this random paragraph follow?", it asked "are these two consecutive paragraphs in the correct order, or have they been swapped?"</p>
                <p>Now the model couldn't cheat with topic matching — both paragraphs were from the same document about the same topic. It had to actually understand the flow of ideas: what comes first? What causes what? What's the setup and what's the punchline? This harder task taught genuine discourse understanding.</p>
            </Analogy>

            <Analogy label="Why It Matters — Sentence Pair Tasks">
                <p>Real questions like "Does this answer make sense for this question?" need deep understanding, not topic matching. Question answering, logical entailment, and reading comprehension all require a model to reason about how two pieces of text relate to each other — not just whether they share the same topic.</p>
                <p>NSP was a first attempt to build this capability into pretraining. It wasn't quite right, but it pointed in the correct direction. SOP and modern contrastive learning objectives refined the idea into something genuinely useful.</p>
            </Analogy>

            <Analogy label="The Modern Solution — Sentence Embeddings">
                <p>Today, researchers build sentence similarity models by fine-tuning BERT with a "Siamese" setup: pass two sentences through the same model, and train the representations to be close if the sentences mean the same thing and far apart if they don't. This is called Sentence-BERT.</p>
                <p>The result is a model that can compare any two sentences by their vector cosine similarity — perfect for semantic search ("find articles about X"), duplicate question detection, and recommendation systems. NSP was the crude ancestor; Sentence-BERT is the refined descendant.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Next Sentence Prediction and its alternatives</h2>

            <h3>How NSP Works</h3>
            <p>
                During pretraining, BERT constructs input pairs from document segments:
            </p>
            <ul>
                <li><strong>Positive samples (50%):</strong> Sentence B is the actual next sentence after A in the same document</li>
                <li><strong>Negative samples (50%):</strong> Sentence B is randomly sampled from a different document in the corpus</li>
            </ul>
            <p>
                Both are packed into: [CLS] A [SEP] B [SEP]. The final hidden state of [CLS] is fed into
                a binary classifier predicting IsNext or NotNext. The binary cross-entropy loss is added
                to the MLM loss during pretraining.
            </p>

            <h3>Why NSP Underperformed — The Shortcut Problem</h3>
            <p>
                Research revealed NSP suffered from a fundamental design flaw:
            </p>
            <ul>
                <li><strong>Topic matching shortcut:</strong> Negative samples came from different documents with unrelated topics. Models learned to detect topic mismatch (dinosaurs vs. cookies) rather than discourse coherence (does B follow A logically?).</li>
                <li><strong>Too easy:</strong> NSP accuracy reached ~97% early in training — far too high for a task that should be challenging. A task that's trivially solvable provides trivial learning signal.</li>
                <li><strong>Sequence length cost:</strong> Packing two sentences into 512 tokens meant each input was shorter than a single full 512-token document. Shorter sequences hurt MLM by providing less context for each masked token prediction.</li>
                <li><strong>RoBERTa finding:</strong> Removing NSP entirely and training on full 512-token single sequences improved performance on all 9 GLUE tasks, including NLI and QA tasks NSP was designed to help.</li>
            </ul>

            <h3>Sentence Order Prediction (SOP) — ALBERT's Alternative</h3>
            <p>
                ALBERT fixed NSP's design flaw by using the same document for both positive and negative pairs:
            </p>
            <ul>
                <li><strong>Positive (50%):</strong> Two consecutive sentences A, B from the same document, in original order</li>
                <li><strong>Negative (50%):</strong> Same two sentences, but with B presented first and A second (swapped)</li>
            </ul>
            <p>
                Because both orderings are semantically coherent and share a topic, the model cannot rely
                on topic mismatch. It must understand discourse structure (temporal ordering, causal flow,
                narrative logic) to detect swaps. SOP is strictly harder than NSP.
            </p>

            <h3>Contrastive Learning — The Modern Successor</h3>
            <p>
                Sentence-BERT (SBERT, Reimers &amp; Gurevych 2019) fine-tuned BERT with a Siamese network
                for semantic similarity. SimCSE (Gao et al. 2021) used dropout-based data augmentation:
                pass the same sentence through BERT twice with different dropout masks; the two resulting
                [CLS] representations should be similar (positive pair). All other sentences in the batch
                serve as negatives. Training with InfoNCE loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SimCSE}} = -\log \frac{e^{\text{sim}(h_i, h_i^+) / \tau}}{\sum_{j=1}^{N} e^{\text{sim}(h_i, h_j^+) / \tau}}" />
            <p>
                where h&#8336; and h&#8336;&#8314; are the two dropout-augmented representations of the same sentence,
                and &#964; is a temperature hyperparameter.
            </p>

            <h3>Practical Impact — When NSP Helps and When It Doesn't</h3>
            <p>
                The research consensus on NSP:
            </p>
            <ul>
                <li><strong>NSP hurts:</strong> On single-sentence tasks (MNLI, QQP, QNLI) — because sentence-pair structure wastes input length on shorter sequences</li>
                <li><strong>NSP is neutral:</strong> On some sentence-pair tasks — because topic-matching is not useful for genuine inference</li>
                <li><strong>SOP helps:</strong> On multi-sentence reasoning tasks (RACE, SQuAD 2.0) — because it genuinely teaches discourse structure</li>
                <li><strong>Modern practice:</strong> Use full-sentence MLM without NSP (RoBERTa style) for general-purpose encoders; use SBERT or SimCSE fine-tuning for sentence embedding applications</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Modern practice:</strong> RoBERTa removed NSP entirely and outperformed BERT.
                Many subsequent models (DeBERTa, ELECTRA) also dropped sentence-level pretraining tasks.
                The consensus: large-scale MLM on long contiguous text is sufficient for general language
                understanding; explicit sentence objectives add little unless carefully designed (SOP) or
                replaced with contrastive learning (SimCSE, Sentence-BERT).
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
            <h2>The mathematics of sentence-level objectives</h2>

            <DefBlock label="Next Sentence Prediction">
                Let (A, B) be a sentence pair and <InlineMath tex="y \in \{0, 1\}" /> indicate whether B actually follows
                A (<InlineMath tex="y=1" />) or is a random sentence (<InlineMath tex="y=0" />). The model computes the [CLS]
                representation <InlineMath tex="\mathbf{h}_{\text{CLS}} \in \mathbb{R}^d" /> and predicts:
                <MathBlock tex="\hat{y} = \sigma(\mathbf{w}_{\text{NSP}}^T \mathbf{h}_{\text{CLS}} + b_{\text{NSP}})" />
                <MathBlock tex="\mathcal{L}_{\text{NSP}} = -\bigl[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \bigr]" />
            </DefBlock>

            <h3>Sentence Order Prediction</h3>
            <p>
                SOP uses the same architecture but different labels. Let A and B be consecutive
                sentences. The binary label y indicates whether they appear in original order (<InlineMath tex="y=1" />)
                or swapped order (<InlineMath tex="y=0" />). The critical difference is in sampling:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SOP}} = -\bigl[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \bigr]" />
            <p>
                NSP negatives: B is sampled uniformly from the entire corpus (across documents).<br />
                SOP negatives: B is the sentence that precedes A in the same document (swap within document).
            </p>

            <h3>Why SOP is Harder — Mutual Information Analysis</h3>
            <p>
                For binary classification, the model's effective learning signal is the mutual information between label and the features it can exploit:
            </p>
            <MathBlock tex="I(Y;\, X) = H(Y) - H(Y \mid X)" />
            <p>
                For NSP with random cross-document negatives, the topic signal provides large I(Y; X&#95;topic) —
                the model can nearly solve the task from topic features alone. The true discourse signal
                I(Y; X&#95;discourse) is masked by the easy topic shortcut. For SOP, topic features provide
                no information (H(Y | X&#95;topic) ≈ H(Y)), forcing the model to exploit genuine discourse signal.
            </p>

            <h3>Combined Pretraining Objective</h3>
            <p>
                BERT's full pretraining loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{BERT}} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{NSP}}" />
            <p>
                ALBERT's improved pretraining loss:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{ALBERT}} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{SOP}}" />

            <h3>SimCSE — Contrastive Sentence Embedding</h3>
            <p>
                SimCSE maximizes agreement between two dropout-augmented views of the same sentence while
                pushing apart representations of different sentences. With temperature &#964; and batch size N:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SimCSE}} = -\frac{1}{N} \sum_{i=1}^{N} \log \frac{e^{\text{sim}(\mathbf{h}_i,\, \mathbf{h}_i^+)/\tau}}{\sum_{j=1}^{N} e^{\text{sim}(\mathbf{h}_i,\, \mathbf{h}_j^+)/\tau}}" />
            <p>
                where sim(u, v) = u&#7488;v / (&#8214;u&#8214;&#8214;v&#8214;) is cosine similarity. This InfoNCE loss is equivalent
                to maximizing a lower bound on the mutual information between the two augmented views.
            </p>

            <div className="ch-callout">
                <strong>Empirical result:</strong> ALBERT with SOP achieved 89.4% on SQuAD 2.0 versus
                86.5% with NSP — a 2.9 point improvement from simply making the sentence task harder.
                On RACE (multi-sentence reading comprehension), SOP added 2.4 points over NSP.
                The harder task taught more, confirming that pretraining signal quality determines
                what the model learns.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── NSP / SOP Pair Construction — NumPy ───────────────────────────────────────
def build_pairs(sentences, task="nsp", seed=42):
    """
    Build sentence-level pretraining pairs.
    task='nsp': positive=consecutive, negative=random from corpus
    task='sop': positive=original order, negative=swapped order
    Returns list of (sent_a, sent_b, label).
    """
    rng = np.random.default_rng(seed)
    pairs = []
    n = len(sentences)

    for i in range(n - 1):
        a = sentences[i]
        b_next = sentences[i + 1]

        # Positive sample
        pairs.append((a, b_next, 1))

        if task == "nsp":
            # Negative: random sentence from *anywhere* in corpus
            j = int(rng.integers(0, n))
            while j in (i, i + 1):
                j = int(rng.integers(0, n))
            pairs.append((a, sentences[j], 0))
        else:   # sop
            # Negative: same two sentences, SWAPPED
            pairs.append((b_next, a, 0))

    return pairs

# ── Cosine Similarity ─────────────────────────────────────────────────────────
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)

# ── SimCSE Contrastive Loss ───────────────────────────────────────────────────
def simcse_loss(embeddings_a, embeddings_b, temperature=0.05):
    """
    InfoNCE loss for a batch of (anchor, positive) pairs.
    embeddings_a, embeddings_b: (batch_size, embed_dim)
    Diagonals are the positive pairs; off-diagonals are negatives.
    """
    n = embeddings_a.shape[0]
    # Normalize
    a_norm = embeddings_a / (np.linalg.norm(embeddings_a, axis=1, keepdims=True) + 1e-8)
    b_norm = embeddings_b / (np.linalg.norm(embeddings_b, axis=1, keepdims=True) + 1e-8)
    # Similarity matrix
    sim = (a_norm @ b_norm.T) / temperature   # (n, n)
    # Cross-entropy: correct label for row i is column i
    sim -= np.max(sim, axis=1, keepdims=True)
    log_probs = sim - np.log(np.sum(np.exp(sim), axis=1, keepdims=True))
    loss = -np.mean(log_probs[np.arange(n), np.arange(n)])
    return float(loss)

# ── Binary Cross-Entropy ──────────────────────────────────────────────────────
def bce_loss(logits, labels):
    probs = 1 / (1 + np.exp(-logits))
    return float(-np.mean(
        labels * np.log(probs + 1e-10) +
        (1 - labels) * np.log(1 - probs + 1e-10)))

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

sentences = [
    "The train arrived at the station.",
    "Passengers rushed to board before the doors closed.",
    "The conductor checked tickets in the first car.",
    "Outside, the city skyline disappeared into fog.",
    "Weather forecasters predicted rain for the whole week.",
]

nsp_pairs = build_pairs(sentences, task="nsp")
sop_pairs = build_pairs(sentences, task="sop")

print("NSP vs SOP Pair Construction")
print("=" * 60)
print("NSP pairs (random negatives can be off-topic):")
for a, b, label in nsp_pairs[:4]:
    print(f"  [{'IsNext' if label else 'NotNext':7s}] {a[:35]} | {b[:35]}")
print()
print("SOP pairs (negatives are swapped, same topic):")
for a, b, label in sop_pairs[:4]:
    print(f"  [{'Correct' if label else 'Swapped':7s}] {a[:35]} | {b[:35]}")
print()

# SimCSE contrastive loss demo
embed_dim = 64
# Simulate two dropout-augmented views of 4 sentences
emb_a = np.random.randn(4, embed_dim)
emb_b = emb_a + 0.05 * np.random.randn(4, embed_dim)   # small dropout noise
loss_simcse = simcse_loss(emb_a, emb_b, temperature=0.05)
print(f"SimCSE contrastive loss (similar pairs): {loss_simcse:.4f}")

# Fake NSP logits and labels
nsp_logits = np.random.randn(8)
nsp_labels = np.array([1, 0, 1, 0, 1, 0, 1, 0], dtype=float)
print(f"NSP binary cross-entropy loss:          {bce_loss(nsp_logits, nsp_labels):.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of NSP and SOP pair construction, SimCSE contrastive loss (InfoNCE),
                and binary cross-entropy for NSP classification. The demo contrasts how NSP random negatives
                can be off-topic while SOP negatives are always same-topic swapped pairs.
            </p>
            <CodeBlock code={PY_CODE} filename="nsp_sop_simcse.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const NSP_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
