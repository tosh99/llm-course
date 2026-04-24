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
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Motivation</div>
                    <div className="ch-tl-title">Sentence Pair Tasks</div>
                    <div className="ch-tl-body">
                        NLP benchmarks like Natural Language Inference (NLI) and question answering require
                        understanding how two sentences relate. A model trained only on single-sentence
                        word prediction has no explicit incentive to learn inter-sentence coherence. BERT
                        needed a pretraining task that created this incentive.
                    </div>
                    <div className="ch-tl-impact">Impact: NSP was designed to bootstrap sentence-level reasoning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2018</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Next Sentence Prediction</div>
                    <div className="ch-tl-body">
                        BERT's pretraining samples pairs of sentences (A, B) from a corpus. 50% of the
                        time, B is the actual sentence that follows A. 50% of the time, B is a random
                        sentence from elsewhere in the corpus. The model must predict which case it is,
                        using the <code>[CLS]</code> token's representation after processing both
                        sentences separated by <code>[SEP]</code>.
                    </div>
                    <div className="ch-tl-impact">Impact: Gave BERT an initial edge on NLI and QA tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Controversy</div>
                    <div className="ch-tl-title">Is NSP Necessary?</div>
                    <div className="ch-tl-body">
                        Liu et al. (RoBERTa) found that removing NSP and training on full sentences
                        without the 50/50 pairing actually improved downstream performance. The task was
                        arguably too easy — models achieved ~97% accuracy quickly, suggesting it taught
                        surface-level topic matching rather than deep discourse understanding.
                    </div>
                    <div className="ch-tl-impact">Impact: Sparked debate about whether NSP was helpful or harmful</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020</div>
                    <div className="ch-tl-section-label">Alternatives</div>
                    <div className="ch-tl-title">ALBERT and Sentence Order</div>
                    <div className="ch-tl-body">
                        ALBERT replaced NSP with Sentence Order Prediction (SOP): given two consecutive
                        sentences, predict whether they appear in the correct order or are swapped. SOP
                        is strictly harder than NSP (you can't cheat with topic matching) and consistently
                        improved performance on multi-sentence reasoning tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: SOP replaced NSP as the preferred sentence-level objective</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The verdict:</strong> NSP was well-intentioned but flawed. Its ease made it a
                weak signal, and the topic-matching shortcut meant models weren't learning true discourse.
                Modern encoder models use SOP, span prediction, or skip sentence-level objectives entirely,
                relying on large-scale pretraining to implicitly learn coherence.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Does this sentence follow?</h2>

            <Analogy label="The Story Continues">
                Imagine someone tells you the beginning of a story, then gives you two possible next
                paragraphs. One really continues the story; the other is from a completely different book.
                NSP is like training a model to tell which paragraph is the real continuation just by
                reading both.
            </Analogy>

            <Analogy label="The Easy Shortcut">
                But here's the problem: the model got too good at cheating. If paragraph A is about
                dinosaurs and paragraph B is about baking cookies, the model knows they're unrelated
                without actually understanding either paragraph. It just matched topics. That's why
                smarter people invented harder games like "did I swap the order of these two paragraphs?"
            </Analogy>

            <Analogy label="Why It Matters">
                Real questions like "Does this answer make sense for this question?" need deep understanding,
                not topic matching. NSP was a first step, but it wasn't strong enough to teach real reasoning.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Next Sentence Prediction and its limitations</h2>

            <h3>How NSP Works</h3>
            <p>
                During pretraining, BERT constructs input pairs from contiguous document segments:
            </p>
            <ul>
                <li><strong>Positive samples (50%):</strong> Sentence B is the actual next sentence after A</li>
                <li><strong>Negative samples (50%):</strong> Sentence B is randomly sampled from the corpus</li>
            </ul>
            <p>
                Both sentences are packed into one input: <code>[CLS] A [SEP] B [SEP]</code>. The final
                hidden state of <code>[CLS]</code> is fed into a binary classifier that predicts
                <code>IsNext</code> or <code>NotNext</code>.
            </p>

            <h3>Why It Underperformed</h3>
            <p>
                Research revealed several problems with NSP:
            </p>
            <ul>
                <li><strong>Topic matching shortcut:</strong> Negative samples often came from different
                    documents with unrelated topics. The model learned to detect topic mismatch rather
                    than true discourse coherence.</li>
                <li><strong>Too easy:</strong> NSP accuracy reached ~97% early in training, suggesting
                    the task was not providing a strong learning signal.</li>
                <li><strong>Single-document negatives:</strong> When negatives were sampled from the
                    <em>same</em> document (harder negatives), NSP became more useful — but BERT's
                    original implementation used corpus-wide random sampling.</li>
            </ul>

            <h3>Sentence Order Prediction (SOP)</h3>
            <p>
                ALBERT's SOP task addresses these flaws. Given two consecutive sentences:
            </p>
            <ul>
                <li><strong>Positive (50%):</strong> The sentences appear in the correct original order</li>
                <li><strong>Negative (50%):</strong> The sentences are swapped</li>
            </ul>
            <p>
                Because both sentences come from the same document and share a topic, the model cannot
                rely on topic mismatch. It must actually understand sentence-level coherence and
                anaphora resolution to detect swapped order.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Modern practice:</strong> RoBERTa removed NSP entirely and outperformed BERT.
                Many subsequent models (DeBERTa, ELECTRA) also dropped sentence-level pretraining tasks.
                The consensus: large-scale MLM on long contiguous text is sufficient; explicit sentence
                objectives add little.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The mathematics of sentence-level objectives</h2>

            <DefBlock label="Next Sentence Prediction">
                Let <InlineMath tex="(A, B)" /> be a sentence pair and <InlineMath tex="y \\in \\{0, 1\\}" /> indicate whether <InlineMath tex="B" /> actually follows
                <InlineMath tex="A" /> (<InlineMath tex="y=1" />) or is a random sentence (<InlineMath tex="y=0" />). The model computes the <code>[CLS]</code>
                representation <InlineMath tex="\\mathbf{h}_{\\text{CLS}} \\in \\mathbb{R}^d" /> and predicts:
                <MathBlock tex="\hat{y} = \sigma(\mathbf{w}_{\text{NSP}}^T \mathbf{h}_{\text{CLS}} + b_{\text{NSP}})" />
                <MathBlock tex="\mathcal{L}_{\text{NSP}} = -\big[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \big]" />
            </DefBlock>

            <h3>Sentence Order Prediction</h3>
            <p>
                SOP uses the same architecture but different labels. Let <InlineMath tex="A" /> and <InlineMath tex="B" /> be consecutive
                sentences. The binary label <InlineMath tex="y" /> indicates whether they appear in original order (<InlineMath tex="y=1" />)
                or swapped order (<InlineMath tex="y=0" />):
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SOP}} = -\big[ y \log \hat{y} + (1-y) \log(1-\hat{y}) \big]" />
            <p>
                The critical difference is in the negative sampling: SOP negatives are semantically
                coherent (same document, swapped), forcing the model to attend to discourse structure
                rather than surface topic.
            </p>

            <h3>Combined Objective</h3>
            <p>
                BERT's full pretraining loss combines MLM and NSP with equal weighting:
            </p>
            <MathBlock tex="\mathcal{L} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{NSP}}" />
            <p>
                In ALBERT, NSP is replaced with SOP:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{ALBERT}} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{SOP}}" />

            <h3>Why SOP is Harder</h3>
            <p>
                Consider the mutual information between label and input:
            </p>
            <MathBlock tex="I(Y; X) = H(Y) - H(Y \mid X)" />
            <p>
                For NSP with random corpus negatives, <InlineMath tex="H(Y \\mid X)" /> is small because topic mismatch
                gives the answer away. For SOP, <InlineMath tex="H(Y \\mid X)" /> is larger because both orders are
                semantically plausible, requiring deeper understanding to discriminate.
            </p>

            <div className="ch-callout">
                <strong>Empirical result:</strong> ALBERT with SOP achieved 89.4% on SQuAD 2.0 versus
                86.5% with NSP — a 2.9 point improvement from simply making the sentence task harder.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── NSP / SOP Pair Construction — NumPy ───────────────────────────────────────
def build_sentence_pairs(sentences, task="nsp"):
    """
    Build pretraining pairs from a list of sentences.
    task: 'nsp' -> Next Sentence Prediction
          'sop' -> Sentence Order Prediction
    Returns list of (input_a, input_b, label).
    """
    pairs = []
    for i in range(len(sentences) - 1):
        a = sentences[i]
        b_true = sentences[i + 1]

        # Positive sample
        pairs.append((a, b_true, 1))

        # Negative sample
        if task == "nsp":
            # Random sentence from corpus
            j = np.random.randint(0, len(sentences))
            while j == i or j == i + 1:
                j = np.random.randint(0, len(sentences))
            pairs.append((a, sentences[j], 0))
        else:  # sop
            # Swap order
            pairs.append((b_true, a, 0))
    return pairs

# ── Binary Cross-Entropy ──────────────────────────────────────────────────────
def bce_loss(logits, labels):
    """logits: (batch,), labels: (batch,) binary"""
    probs = 1 / (1 + np.exp(-logits))
    return -np.mean(labels * np.log(probs + 1e-10) +
                    (1 - labels) * np.log(1 - probs + 1e-10))

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
sentences = [f"Sentence number {i} about topic {i % 3}."
             for i in range(10)]

nsp_pairs = build_sentence_pairs(sentences, task="nsp")
sop_pairs = build_sentence_pairs(sentences, task="sop")

print("Next Sentence Prediction Pairs")
print("=" * 50)
for a, b, label in nsp_pairs[:4]:
    marker = "IsNext" if label == 1 else "NotNext"
    print(f"[{marker}] A: {a[:30]:30} | B: {b[:30]:30}")

print()
print("Sentence Order Prediction Pairs")
print("=" * 50)
for a, b, label in sop_pairs[:4]:
    marker = "Correct" if label == 1 else "Swapped"
    print(f"[{marker}] A: {a[:30]:30} | B: {b[:30]:30}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of NSP and SOP pair construction. The demo shows how negative
                samples differ: NSP uses random sentences, while SOP swaps consecutive sentences.
            </p>
            <CodeBlock code={PY_CODE} filename="nsp_sop_pairs.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── NSP / SOP Pair Construction — TypeScript ─────────────────────────────────

type SentencePair = [string, string, number]

function buildSentencePairs(
    sentences: string[],
    task: "nsp" | "sop" = "nsp"
): SentencePair[] {
    const pairs: SentencePair[] = []
    for (let i = 0; i < sentences.length - 1; i++) {
        const a = sentences[i]
        const bTrue = sentences[i + 1]
        pairs.push([a, bTrue, 1])

        if (task === "nsp") {
            let j = Math.floor(Math.random() * sentences.length)
            while (j === i || j === i + 1) {
                j = Math.floor(Math.random() * sentences.length)
            }
            pairs.push([a, sentences[j], 0])
        } else {
            pairs.push([bTrue, a, 0])
        }
    }
    return pairs
}

function bceLoss(logits: number[], labels: number[]): number {
    let total = 0
    for (let i = 0; i < logits.length; i++) {
        const prob = 1 / (1 + Math.exp(-logits[i]))
        total += -(labels[i] * Math.log(prob + 1e-10) +
                   (1 - labels[i]) * Math.log(1 - prob + 1e-10))
    }
    return total / logits.length
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const sentences = Array.from({ length: 10 },
    (_, i) => \`Sentence number \<InlineMath tex="{i} about topic \\" />{i % 3}.\`)

const nspPairs = buildSentencePairs(sentences, "nsp")
const sopPairs = buildSentencePairs(sentences, "sop")

console.log("NSP Pairs")
console.log("─".repeat(50))
nspPairs.slice(0, 4).forEach(([a, b, label]) => {
    const marker = label === 1 ? "IsNext" : "NotNext"
    console.log(\`[\<InlineMath tex="{marker}] A: \\" />{a.slice(0, 30).padEnd(30)} | B: \${b.slice(0, 30)}\`)
})

console.log("\nSOP Pairs")
console.log("─".repeat(50))
sopPairs.slice(0, 4).forEach(([a, b, label]) => {
    const marker = label === 1 ? "Correct" : "Swapped"
    console.log(\`[\<InlineMath tex="{marker}] A: \\" />{a.slice(0, 30).padEnd(30)} | B: \${b.slice(0, 30)}\`)
})
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of NSP and SOP pair construction. The comparison shows
                why SOP is a harder task: both sentences in a negative pair are semantically related.
            </p>
            <CodeBlock code={TS_CODE} filename="nsp_sop_pairs.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const NSP_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
