import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From ImageNet to NLP</h2>
            <p>
                By 2017, transfer learning had transformed computer vision. Models pretrained on ImageNet
                could be fine-tuned for any visual task with a fraction of the data. Yet NLP remained
                stubbornly bespoke: every sentiment classifier, every named-entity tagger, every question-answering
                system was trained from scratch on tiny labeled datasets. Jeremy Howard and Sebastian Ruder
                asked a simple question: why can't language models do the same?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2012</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">ImageNet Transfer Learning</div>
                    <div className="ch-tl-body">
                        The AlexNet revolution showed that CNNs pretrained on ImageNet learned generic visual
                        features (edges, textures, shapes) that transferred beautifully to object detection,
                        segmentation, and medical imaging. The recipe was simple: pretrain on a large supervised
                        dataset, then fine-tune the last few layers on the target task.
                    </div>
                    <div className="ch-tl-impact">Impact: Transfer learning became the default in computer vision</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2017</div>
                    <div className="ch-tl-section-label">Problem</div>
                    <div className="ch-tl-title">The NLP Transfer Gap</div>
                    <div className="ch-tl-body">
                        Word vectors (Word2Vec, GloVe) offered <em>static</em> transfer: each word got one fixed
                        embedding regardless of context. But the heavy lifting — the LSTM or CNN that processed
                        sequences — was always trained from scratch. Attempts to fine-tune pretrained language
                        models directly led to catastrophic forgetting: the model lost its general linguistic
                        knowledge within a few gradient steps.
                    </div>
                    <div className="ch-tl-impact">Impact: NLP practitioners believed language models were too fragile to fine-tune</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Howard &amp; Ruder — ULMFiT</div>
                    <div className="ch-tl-body">
                        In "Universal Language Model Fine-tuning for Text Classification" (ACL 2018), Howard
                        and Ruder introduced a disciplined three-stage recipe: (1) pretrain a language model on
                        a massive general-domain corpus (WikiText-103), (2) fine-tune the language model on the
                        target task's <em>unlabeled</em> data using discriminative learning rates, and (3) attach
                        a classification head and fine-tune the whole model with gradual unfreezing. The result:
                        state-of-the-art on six benchmarks with 100× less labeled data.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that language models, handled correctly, are as transferable as ImageNet CNNs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2019</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">The Recipe Becomes Standard</div>
                    <div className="ch-tl-body">
                        ULMFiT's core ideas — pretrained LMs, task-specific fine-tuning, discriminative learning
                        rates, gradual unfreezing — became the template for ELMo, BERT, and GPT. Fast.ai built
                        an entire course and library around the approach. Even today, the "pretrain then fine-tune"
                        paradigm dominates NLP, with ULMFiT recognized as the paper that made it practical.
                    </div>
                    <div className="ch-tl-impact">Impact: The foundational recipe for modern NLP transfer learning</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Catastrophic forgetting is not inevitable. By using
                discriminative learning rates (lower LR for early layers) and gradual unfreezing (unfreezing
                one layer at a time from top to bottom), the model preserves its general knowledge while
                adapting to the target distribution.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning to read, then learning to judge</h2>

            <Analogy label="The Library (Pretraining)">
                Imagine you spend ten years reading every book in a massive library. You don't just memorize
                words — you learn grammar, facts about the world, how stories work, and how arguments are built.
                You become a master reader. This is the language model pretraining stage.
            </Analogy>

            <Analogy label="The Bad Librarian (Naive Fine-tuning)">
                Now someone asks you to become a movie critic. A bad teacher would hand you 50 movie reviews
                and say "forget everything else, just memorize these." You'd quickly become great at those 50
                reviews but forget how to read anything else. That's what happens when you fine-tune a language
                model with a high learning rate on a tiny dataset.
            </Analogy>

            <Analogy label="The Good Teacher (ULMFiT)">
                ULMFiT is like a good teacher. First, they let you read movie reviews at a gentle pace, keeping
                your general reading skills intact. Then they introduce the critic job slowly: first they let you
                practice judging just the endings, then the plots, then everything together. And they never
                ask you to change your deep understanding of language — only to apply it to movies. That's
                gradual unfreezing and discriminative learning rates.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The three-stage ULMFiT recipe</h2>

            <h3>Stage 1 — General-Domain LM Pretraining</h3>
            <p>
                Train a language model (AWD-LSTM) on a large corpus like WikiText-103. The model learns
                to predict the next word, which forces it to internalize grammar, syntax, and world knowledge.
                This stage is expensive but done once.
            </p>

            <h3>Stage 2 — Target Task LM Fine-tuning</h3>
            <p>
                Fine-tune the pretrained LM on the <em>unlabeled</em> text of the target task (e.g., all IMDB
                reviews, not just the labeled ones). Two key techniques prevent catastrophic forgetting:
            </p>
            <ul>
                <li><strong>Discriminative fine-tuning:</strong> Use a different learning rate for each layer.
                    Early layers (embeddings, first LSTM layers) get a very small LR (e.g., 1e-5); later layers
                    get a larger LR (e.g., 1e-3). This preserves low-level linguistic features.</li>
                <li><strong>Slanted triangular learning rates (STLR):</strong> The LR first linearly increases
                    to a peak, then linearly decays. This helps the model quickly converge to the task domain
                    and then refine its weights.</li>
            </ul>

            <h3>Stage 3 — Target Task Classification Fine-tuning</h3>
            <p>
                Add two linear layers on top of the LM's final hidden state and fine-tune the entire model
                on the labeled task data. Two more techniques are used:
            </p>
            <ul>
                <li><strong>Gradual unfreezing:</strong> Start by training only the classifier head. Then
                    unfreeze the last LSTM layer and train. Then the one before it. This prevents early-layer
                    disruption.</li>
                <li><strong>BPTT for text classification:</strong> For long documents, the model is fed
                    fixed-length chunks with hidden state propagated forward. Final predictions are pooled
                    across all chunks.</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> On IMDb sentiment classification, ULMFiT achieved 94.3% accuracy
                with only 100 labeled examples — matching the previous state-of-the-art that used 25,000 labeled
                examples. On TREC-6 question classification, it reached 96.7% with only 400 examples.
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
            <h2>Learning rate scheduling and layer-wise optimization</h2>

            <DefBlock label="Discriminative Fine-Tuning">
                Let the model have L layers with parameters θ<sub>1</sub>, …, θ<sub>L</sub> where θ<sub>1</sub>
                is the embedding layer and θ<sub>L</sub> is the final LSTM layer. Instead of a single learning
                rate η, assign layer-specific rates η<sub>ℓ</sub> = η<sub>base</sub> · ξ<sup>ℓ-L</sup> where
                ξ ∈ (0, 1) is a decay factor (typically 2.6). Earlier layers update more slowly.
            </DefBlock>

            <h3>Slanted Triangular Learning Rates</h3>
            <p>
                Let T be the total number of training iterations. The STLR schedule has a linear warm-up
                phase for the first <em>cut_frac</em> · T steps, followed by linear decay:
            </p>
            <MathBlock tex="\eta_t = \eta_{\max} \cdot \frac{t}{T \cdot \text{cut\_frac}} \quad \text{if } t \leq T \cdot \text{cut\_frac}" />
            <MathBlock tex="\eta_t = \eta_{\max} \cdot \frac{T - t}{T \cdot (1 - \text{cut\_frac})} \quad \text{if } t > T \cdot \text{cut\_frac}" />
            <p>
                Typical values: cut_frac = 0.1, η<sub>max</sub> = 0.01. This creates a sharp rise and gradual
                fall, mimicking the behavior of one-cycle policies but tailored to fine-tuning.
            </p>

            <h3>Gradual Unfreezing</h3>
            <p>
                At epoch e, unfreeze layers ℓ ≥ L - e + 1. All lower layers remain frozen. The classifier
                head is always trainable. Formally, the effective parameter set at epoch e is:
            </p>
            <MathBlock tex="\Theta_e = \{\theta_{\text{head}}\} \cup \bigcup_{\ell = L-e+1}^{L} \{\theta_\ell\}" />
            <p>
                For a 3-layer LSTM, epoch 1 trains only the head; epoch 2 adds layer 3; epoch 3 adds layer 2;
                epoch 4 adds layer 1 (the embeddings). This schedule prevents the early layers — which encode
                general syntax and morphology — from being corrupted by noisy target-task gradients.
            </p>

            <h3>BPTT Text Classification</h3>
            <p>
                For a document of length N, split into chunks of size bptt (typically 70 tokens). Process
                chunk c<sub>i</sub> with initial hidden state h<sub>i-1</sub> (carried from the previous chunk).
                The final hidden states {'{'}h<sub>1</sub>, …, h<sub>k</sub>{'}'} are max-pooled and mean-pooled,
                concatenated, and fed to the classifier:
            </p>
            <MathBlock tex="\mathbf{h}_{\text{doc}} = [\max(\mathbf{h}_1, \dots, \mathbf{h}_k); \; \text{mean}(\mathbf{h}_1, \dots, \mathbf{h}_k)]" />
            <MathBlock tex="\hat{y} = \text{softmax}(\mathbf{W}_c \mathbf{h}_{\text{doc}} + \mathbf{b}_c)" />

            <div className="ch-callout">
                <strong>Why it works:</strong> The layer-wise LR decay exploits the hierarchical structure
                of neural language models. Embeddings encode surface features (characters, morphemes); middle
                layers encode syntax; top layers encode task-relevant semantics. Gradual unfreezing respects
                this hierarchy during adaptation.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Slanted Triangular Learning Rate ──────────────────────────────────────────
def slanted_triangular_lr(t, T, eta_max=0.01, cut_frac=0.1):
    """STLR schedule: linear warm-up then linear decay."""
    cut = int(T * cut_frac)
    if t <= cut:
        return eta_max * (t / cut)
    else:
        return eta_max * ((T - t) / (T - cut))

# ── Discriminative LR per layer ───────────────────────────────────────────────
def discriminative_lrs(base_lr, num_layers, decay_factor=2.6):
    """Return LR for each layer, lowest for embeddings."""
    return [base_lr / (decay_factor ** (num_layers - 1 - i))
            for i in range(num_layers)]

# ── Gradual Unfreezing mask ───────────────────────────────────────────────────
def unfreezing_mask(epoch, num_layers):
    """Return boolean mask: True = trainable for this epoch."""
    # Epoch 1: only head (treat head as extra layer)
    # Epoch 2: head + last layer
    # ...
    mask = [False] * num_layers
    layers_to_unfreeze = min(epoch, num_layers)
    for i in range(num_layers - layers_to_unfreeze, num_layers):
        mask[i] = True
    return mask

# ── Demo ──────────────────────────────────────────────────────────────────────
T = 1000
lrs = [slanted_triangular_lr(t, T) for t in range(T)]

layer_lrs = discriminative_lrs(base_lr=1e-3, num_layers=4)
print("Discriminative Learning Rates")
print("=" * 40)
for i, lr in enumerate(layer_lrs):
    print(f"  Layer {i}: lr = {lr:.2e}")
print()

print("Gradual Unfreezing Schedule")
print("=" * 40)
for epoch in range(1, 6):
    mask = unfreezing_mask(epoch, num_layers=4)
    status = "".join("T" if m else "F" for m in mask)
    print(f"  Epoch {epoch}: {status}  (T=trainable, F=frozen)")
print()

print(f"STLR peak at t={np.argmax(lrs)}: lr={max(lrs):.4f}")
print(f"STLR final  at t={T-1}: lr={lrs[-1]:.6f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of the three core ULMFiT techniques: slanted triangular learning
                rates, discriminative layer-wise learning rates, and gradual unfreezing masks.
            </p>
            <CodeBlock code={PY_CODE} filename="ulmfit_schedules.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ULMFIT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
