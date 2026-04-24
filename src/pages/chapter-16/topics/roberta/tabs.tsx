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
                    <div className="ch-tl-year">Oct 2018</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">BERT Release</div>
                    <div className="ch-tl-body">
                        Google released BERT-Base and BERT-Large with their pretraining recipe: BooksCorpus
                        (800M words) + English Wikipedia (2,500M words), batch size 256, 1M steps, MLM + NSP.
                        The world was amazed by the results — but the training was expensive and the hyperparameters
                        seemed conservative.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the pretraining paradigm but left headroom for optimization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jul 2019</div>
                    <div className="ch-tl-section-label">Optimization</div>
                    <div className="ch-tl-title">Liu et al. — RoBERTa</div>
                    <div className="ch-tl-body">
                        "A Robustly Optimized BERT Pretraining Approach" systematically tested design choices.
                        Key changes: (1) dynamic masking instead of static, (2) full sentences without NSP,
                        (3) larger batch sizes (8K sequences), (4) longer training (500K steps with 10× data),
                        (5) longer sequences, and (6) a new dataset: CC-News, OpenWebText, and Stories.
                        The result: every metric improved, often dramatically.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that BERT was undertrained; recipe optimization rivals architectural innovation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – 2020</div>
                    <div className="ch-tl-section-label">Validation</div>
                    <div className="ch-tl-title">The Importance of Data Scale</div>
                    <div className="ch-tl-body">
                        RoBERTa's ablations revealed that training on 160GB of text (vs BERT's 16GB) with
                        larger batches was the single biggest improvement. NSP removal helped, but data
                        scale and training time dominated. This foreshadowed the scaling laws that would
                        later define the GPT era: more data + more compute = better models.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that training recipe and data scale are first-class citizens in model design</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">RoBERTa as the New Default</div>
                    <div className="ch-tl-body">
                        RoBERTa-Large became the go-to pretrained encoder for practitioners. Its weights
                        were released by Hugging Face and Facebook, and it remains competitive years later.
                        The paper's message — optimize your baseline before inventing new architectures —
                        became a mantra in the research community.
                    </div>
                    <div className="ch-tl-impact">Impact: Established robust optimization as a core research contribution</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The key lesson:</strong> RoBERTa matched or exceeded every BERT result without
                changing the architecture at all. The only changes were in the training process: more data,
                bigger batches, longer training, and removing a harmful auxiliary task. Sometimes the
                best innovation is doing the simple thing right.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Doing BERT's homework better</h2>

            <Analogy label="The Same Student, Better Study Habits">
                Imagine two identical students. One studies for one hour a day with distractions, using
                old textbooks, and taking lots of breaks. The other studies for four hours a day with
                focus, using the best books, and never skipping hard problems. Same brain — wildly
                different results. RoBERTa is the second student.
            </Analogy>

            <Analogy label="The Pointless Exercise">
                BERT had a weird homework assignment: "guess if these two paragraphs go together." But
                the paragraphs were so obviously different that the student learned to cheat by checking
                if they were about the same topic. RoBERTa said: drop that assignment and spend more
                time on the useful stuff.
            </Analogy>

            <Analogy label="More Books, More Practice">
                BERT read a library. RoBERTa read a city's worth of libraries — ten times as many books.
                And RoBERTa read them in bigger study groups (larger batches), which made learning more
                stable. More practice, better organization, no wasted time.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The RoBERTa training recipe</h2>

            <h3>Key Changes from BERT</h3>
            <p>
                RoBERTa kept BERT's architecture identical but made six critical changes to the training
                process:
            </p>
            <ul>
                <li><strong>Dynamic masking:</strong> Instead of precomputing a single static mask per
                    example, RoBERTa generates a new random mask every time a sequence is fed to the model.
                    This provides more diverse training signals and reduces overfitting to specific mask
                    patterns.</li>
                <li><strong>Full sentences without NSP:</strong> RoBERTa removed Next Sentence Prediction
                    entirely. Inputs are packed with full sentences sampled contiguously from documents,
                    up to the 512-token limit. Packs may cross document boundaries, but no special
                    sentence-pair logic is used.</li>
                <li><strong>Larger batches:</strong> Batch size increased from 256 to 8,192 sequences.
                    Larger batches provide more stable gradient estimates and allow higher learning rates.</li>
                <li><strong>More data:</strong> RoBERTa trained on 160GB of text — 10× BERT's 16GB.
                    Sources: BookCorpus + Wikipedia (BERT data) + CC-News (63M articles) + OpenWebText
                    (38GB, a Reddit-outbound clone) + Stories (31GB).</li>
                <li><strong>Longer training:</strong> 500,000 steps at batch size 8K, equivalent to
                    4 billion training examples. BERT trained on 256M examples.</li>
                <li><strong>Longer sequences:</strong> Initially trained with shorter sequences, then
                    switched to full 512-length sequences for the final 10% of training.</li>
            </ul>

            <h3>Results</h3>
            <p>
                RoBERTa-Large achieved state-of-the-art on GLUE (88.5), SQuAD (86.8 EM), and RACE (83.2).
                Critically, an ablation study showed that <em>each</em> of the six changes contributed;
                there was no single silver bullet.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Surprising finding:</strong> Even BERT-Large, when trained with the RoBERTa recipe
                (more data, larger batches, no NSP), matched or exceeded the original BERT numbers.
                The architecture was not the bottleneck — the training process was.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Optimization dynamics at scale</h2>

            <DefBlock label="Dynamic Masking">
                Let <InlineMath tex="\\mathbf{x}" /> be a training sequence. In static masking, a single mask pattern
                <InlineMath tex="\\mathcal{M}(\\mathbf{x})" /> is sampled once and fixed for all epochs. In dynamic masking,
                a fresh mask is sampled for each visit:
                <MathBlock tex="\mathcal{L}_{\text{dynamic}} = -\mathbb{E}_{\mathcal{M}} \sum_{i \in \mathcal{M}} \log P(x_i \mid \mathbf{x}^{\text{masked}}; \Theta)" />
                The expectation over masks reduces variance and increases effective data diversity.
            </DefBlock>

            <h3>Batch Size Scaling</h3>
            <p>
                For SGD with learning rate <InlineMath tex="\\eta" /> and batch size <InlineMath tex="B" />, the gradient variance scales as
                <InlineMath tex="1/B" />. RoBERTa increased <InlineMath tex="B" /> from 256 to 8,192 (32×), which allows proportional scaling
                of the learning rate without destabilizing training. The linear scaling rule suggests:
            </p>
            <MathBlock tex="\eta_{\text{new}} = \eta_{\text{base}} \cdot \frac{B_{\text{new}}}{B_{\text{base}}}" />
            <p>
                RoBERTa used <InlineMath tex="\\eta = 1\\text{e-}4" /> with the larger batch, while BERT used <InlineMath tex="\\eta = 1\\text{e-}4" />
                with the smaller batch — but the increased stability from larger batches allowed more
                aggressive warmup and longer training.
            </p>

            <h3>Training Compute</h3>
            <p>
                Total training compute (in floating-point operations) scales roughly as:
            </p>
            <MathBlock tex="C \approx 6 \cdot N \cdot D" />
            <p>
                Where <InlineMath tex="N" /> is the number of parameters and <InlineMath tex="D" /> is the number of training tokens. BERT-Large
                trained on <InlineMath tex="D \\approx 256\\text{B}" /> tokens; RoBERTa-Large on <InlineMath tex="D \\approx 4\\text{TB}" /> tokens
                (16× more). With <InlineMath tex="N \\approx 340\\text{M}" />, RoBERTa consumed roughly <InlineMath tex="8 \\times 10^{21}" /> FLOPs.
            </p>

            <h3>Data Distribution</h3>
            <p>
                RoBERTa sampled documents from a mixture of corpora with weights <InlineMath tex="\\{\\pi_1, \\dots, \\pi_k\\}" />:
            </p>
            <MathBlock tex="P(\text{document}) = \sum_{j=1}^{k} \pi_j \cdot P_j(\text{document})" />
            <p>
                The mixture was tuned empirically; CC-News and OpenWebText were upweighted relative to
                Wikipedia because their linguistic diversity improved downstream generalization.
            </p>

            <div className="ch-callout">
                <strong>Scaling insight:</strong> RoBERTa's results foreshadowed the Kaplan scaling laws
                (2020): loss improves predictably with more compute, data, and parameters. The recipe
                optimization was an early empirical demonstration that data scale and training time
                matter as much as architecture.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Dynamic Masking — NumPy ───────────────────────────────────────────────────
def dynamic_mask_batch(batch, vocab_size, mask_id=103, mask_prob=0.15):
    """
    Apply a fresh random mask to each sequence in a batch.
    batch: (batch_size, seq_len) array of token ids.
    """
    masked = batch.copy()
    labels = np.full_like(batch, -100)
    bsz, seq_len = batch.shape

    for b in range(bsz):
        candidates = [i for i in range(seq_len)
                      if batch[b, i] not in (0, 101, 102)]
        n_mask = max(1, int(round(len(candidates) * mask_prob)))
        selected = np.random.choice(candidates, size=n_mask, replace=False)
        for i in selected:
            labels[b, i] = batch[b, i]
            r = np.random.rand()
            if r < 0.8:
                masked[b, i] = mask_id
            elif r < 0.9:
                masked[b, i] = np.random.randint(0, vocab_size)
    return masked, labels

# ── Linear LR Scaling Rule ────────────────────────────────────────────────────
def scaled_lr(base_lr, base_batch, new_batch):
    """Linear scaling rule for learning rate with batch size."""
    return base_lr * (new_batch / base_batch)

# ── Compute Estimate ──────────────────────────────────────────────────────────
def training_flops(num_params, num_tokens):
    """Approximate training FLOPs: 6 * N * D."""
    return 6 * num_params * num_tokens

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# Simulate a batch of 8 sequences, length 16
batch = np.random.randint(103, 30522, size=(8, 16))
batch[:, 0] = 101  # [CLS]
batch[:, -1] = 102  # [SEP]

masked, labels = dynamic_mask_batch(batch, vocab_size=30522)
active = np.sum(labels != -100)

bert_lr = 1e-4
roberta_lr = scaled_lr(bert_lr, 256, 8192)

bert_flops = training_flops(340e6, 256e9)
roberta_flops = training_flops(340e6, 4e12)

print("Dynamic Masking & Scaling Demo")
print("=" * 40)
print(f"Batch shape: {batch.shape}")
print(f"Active mask positions: {active}")
print(f"BERT LR: {bert_lr:.0e}")
print(f"RoBERTa scaled LR: {roberta_lr:.2e}")
print(f"BERT FLOPs: {bert_flops:.2e}")
print(f"RoBERTa FLOPs: {roberta_flops:.2e}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of dynamic masking, linear LR scaling, and training FLOP estimation.
                The demo contrasts BERT and RoBERTa training configurations.
            </p>
            <CodeBlock code={PY_CODE} filename="roberta_scaling.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Dynamic Masking & Scaling — TypeScript ───────────────────────────────────

function dynamicMaskBatch(
    batch: number[][],
    vocabSize: number,
    maskId = 103,
    maskProb = 0.15
): { masked: number[][]; labels: number[][] } {
    const bsz = batch.length
    const seqLen = batch[0].length
    const masked: number[][] = batch.map(row => [...row])
    const labels: number[][] = Array.from({ length: bsz }, () => Array(seqLen).fill(-100))

    for (let b = 0; b < bsz; b++) {
        const candidates = batch[b]
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t !== 0 && t !== 101 && t !== 102)
            .map(({ i }) => i)

        const nMask = Math.max(1, Math.round(candidates.length * maskProb))
        const selected = candidates.sort(() => Math.random() - 0.5).slice(0, nMask)

        for (const i of selected) {
            labels[b][i] = batch[b][i]
            const r = Math.random()
            if (r < 0.8) {
                masked[b][i] = maskId
            } else if (r < 0.9) {
                masked[b][i] = Math.floor(Math.random() * vocabSize)
            }
        }
    }
    return { masked, labels }
}

function scaledLR(baseLR: number, baseBatch: number, newBatch: number): number {
    return baseLR * (newBatch / baseBatch)
}

function trainingFLOPs(numParams: number, numTokens: number): number {
    return 6 * numParams * numTokens
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const batch = Array.from({ length: 8 }, () =>
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 30522)))

batch.forEach(row => { row[0] = 101; row[row.length - 1] = 102 })

const { masked, labels } = dynamicMaskBatch(batch, 30522)
const active = labels.flat().filter(l => l !== -100).length

console.log("Dynamic Masking & Scaling Demo")
console.log("─".repeat(40))
console.log(\`Batch shape: \<InlineMath tex="{batch.length}x\\" />{batch[0].length}\`)
console.log(\`Active mask positions: \${active}\`)
console.log(\`BERT LR: \${(1e-4).toExponential()}\`)
console.log(\`RoBERTa scaled LR: \${scaledLR(1e-4, 256, 8192).toExponential(2)}\`)
console.log(\`BERT FLOPs: \${trainingFLOPs(340e6, 256e9).toExponential(2)}\`)
console.log(\`RoBERTa FLOPs: \${trainingFLOPs(340e6, 4e12).toExponential(2)}\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of dynamic masking, learning rate scaling, and compute estimation.
                The demo shows how RoBERTa's larger scale translates to more training FLOPs.
            </p>
            <CodeBlock code={TS_CODE} filename="roberta_scaling.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ROBERTA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
