import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 17's Transformer resolved the fundamental limitations of recurrent architectures — parallel processing, long-range attention, stable gradients across thousands of positions. But the Transformer was also computationally expensive to train from scratch for every new NLP task. Jeremy Howard and Sebastian Ruder's ULMFiT (2018) applied an insight from computer vision — pre-train on a large general dataset, then fine-tune on specific tasks — to NLP at practical scale for the first time.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2012 — Donahue, Jia et al.</div>
                    <div className="ch-tl-title">Transfer Learning Takes Root in Computer Vision</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Training deep convolutional networks required enormous labeled datasets. ImageNet had 1.2 million labeled images and took months to annotate. Most computer vision tasks in medicine, satellite imaging, or industrial inspection had nowhere near that scale. The field needed a way to leverage the investment already made in large-scale labeled data.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Donahue, Jia and colleagues at UC Berkeley showed systematically that features extracted from a network pretrained on ImageNet transferred remarkably well to dozens of vision tasks. The AlexNet revolution had trained on 1.2M images; researchers found that freezing most of the network and fine-tuning only the final classifier for a new task outperformed models trained from scratch on domain-specific data. The 2014 paper "DeCAF" named and formalized the approach, showing layer-by-layer which features transferred best.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Transfer learning became the default workflow in computer vision within two years. The principle — pretrain on a large general dataset, fine-tune on the target task — was now proven by experiment. But NLP practitioners watched from afar, believing their domain was fundamentally different: unlike images, which share edges, textures, and shapes across all photographs, language tasks seemed to require task-specific architectures and labeled data at every level.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 – 2017 — Mikolov, Pennington et al.</div>
                    <div className="ch-tl-title">Word Embeddings as Shallow Transfer</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        NLP models trained from scratch needed to learn basic vocabulary semantics from scratch on every new task. A sentiment classifier trained on 10,000 labeled reviews had to learn from those 10,000 examples that "excellent" and "outstanding" are synonyms. This was wasteful — the information was latent in billions of words of unlabeled text. Some form of transfer was clearly possible, but nobody had found a practical recipe.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Word2Vec (2013) and GloVe (2014) provided the first practical transfer mechanism: pretrain dense word embeddings on billions of words of unlabeled text, then initialize the embedding layer of any NLP model with these vectors. This gave every model a head start: "excellent" and "outstanding" already lived near each other in vector space before a single labeled example was seen.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The approach worked — consistently. But it only transferred the bottom layer. The LSTM or CNN that processed sequences, the layers that learned syntax, discourse structure, and reasoning — those were still trained from scratch on every new task. More fundamentally, each word got exactly one embedding regardless of context: "bank" had the same vector whether it appeared in a financial document or a geography text. Shallow transfer had raised the ceiling, but the ceiling was still low.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2017 — Various groups</div>
                    <div className="ch-tl-title">Failed Attempts at Deep NLP Transfer</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        If word embeddings could transfer the bottom layer, why not pretrain entire LSTM language models and fine-tune them? Several groups tried exactly this between 2015 and 2017. The results were consistently disappointing: fine-tuning a pretrained LM with standard learning rates on a small labeled dataset destroyed the model's general linguistic knowledge within a few gradient steps. Researchers called this catastrophic forgetting and concluded that NLP models were fundamentally too fragile for transfer learning.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Multiple papers proposed partial fixes — freezing early layers, reducing the learning rate — but none provided a principled, generalizable recipe. McCann et al.'s CoVe (2017) used a translation encoder to produce contextualized vectors, showing improvement on benchmarks. But CoVe was tied to a translation dataset and couldn't be trained on arbitrary unlabeled text. The community remained skeptical that general-purpose LM transfer was possible.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        The failures identified the real problem: catastrophic forgetting was not an intrinsic limitation of language models, but a consequence of naive fine-tuning. The question was not "can we fine-tune language models?" but "how do we fine-tune them without destroying what they've learned?" This reframing set the stage for ULMFiT.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Jan 2018 — Howard &amp; Ruder</div>
                    <div className="ch-tl-title">ULMFiT — Universal Language Model Fine-Tuning</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Jeremy Howard, a practitioner and co-founder of fast.ai, and Sebastian Ruder, then a PhD student at the Insight Centre, asked: what would principled fine-tuning of a language model look like? The key insight was borrowed from the computer vision playbook: different layers encode different levels of abstraction, and each level requires different treatment during transfer.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        "Universal Language Model Fine-Tuning for Text Classification" (ACL 2018) introduced a three-stage recipe using a pretrained AWD-LSTM. Stage 1: pretrain on WikiText-103 (103 million words). Stage 2: fine-tune the language model on target-domain unlabeled text using discriminative fine-tuning (different LRs per layer, decaying as ξ&#8319;⁻ᴸ from top to bottom) and slanted triangular learning rates (short warm-up, long decay). Stage 3: attach a classifier head and gradually unfreeze one layer per epoch starting from the top, using BPTT for long documents.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ULMFiT achieved state-of-the-art on six text classification benchmarks with 100x less labeled data than previous methods. On IMDb sentiment, it matched the then-SoTA using only 100 labeled examples. The paper proved that language models were as transferable as ImageNet CNNs — the key was not the architecture but the fine-tuning discipline. Howard immediately built the approach into fast.ai's library, bringing it to tens of thousands of practitioners.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Mid 2018 — Peters, Radford et al.</div>
                    <div className="ch-tl-title">ELMo and GPT-1 Converge on the Same Paradigm</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        While Howard and Ruder worked on classification, two other groups tackled the same fundamental question from different angles. Allen AI's Peters et al. wanted contextualized word representations that captured word sense. OpenAI's Radford et al. wanted a single model that could handle all NLP tasks with minimal modification. Both groups independently arrived at language model pretraining as the answer.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        ELMo (Peters et al., NAACL 2018) trained a bidirectional LSTM language model on 1 billion words and extracted task-specific weighted combinations of all layers as contextualized embeddings. GPT-1 (Radford et al., June 2018) trained a 12-layer Transformer decoder on BooksCorpus and fine-tuned the entire model end-to-end with task-specific input formatting. Both appeared in the same six-month window as ULMFiT.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Three independent groups, working with different architectures (LSTM, LSTM, Transformer) and different philosophical approaches (feature extraction, feature extraction, full fine-tuning), all arrived at the same conclusion: language model pretraining on large unlabeled corpora transfers to downstream tasks. This convergence was the clearest possible signal that a paradigm shift was underway.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Late 2018 — Devlin et al.</div>
                    <div className="ch-tl-title">BERT Synthesizes and Supersedes — The Template Is Set</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        ULMFiT, ELMo, and GPT-1 had proved the paradigm, but each had limitations. ULMFiT used LSTMs, which were slower than Transformers and struggled with very long contexts. ELMo's bidirectionality was shallow — two independent LSTMs concatenated, not deeply fused. GPT-1 read only left-to-right, missing right-context for word-level tasks. Could a single model combine deep bidirectionality with Transformer efficiency and the full fine-tuning approach?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Google Brain's BERT (October 2018) used a Transformer encoder with masked language modeling to achieve deep bidirectional pretraining. It trained on BooksCorpus plus all of Wikipedia — three times more text than GPT-1 — and set new state-of-the-art on 11 NLP tasks simultaneously. BERT adopted ULMFiT's full fine-tuning approach (not ELMo's frozen feature extraction) but replaced the LSTM with the Transformer's more powerful attention mechanism.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        BERT's release crystallized the pretrain-then-fine-tune paradigm as the dominant NLP methodology. ULMFiT's techniques — discriminative learning rates, gradual unfreezing, slanted triangular schedules — were recognized as foundational contributions even as BERT's architecture superseded the LSTM backbone. The fine-tuning discipline Howard and Ruder invented in early 2018 remained standard practice years later.
                    </div>
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
            <p className="ch-story-intro">
                Chapter 17's Transformer was a magnificent reading machine — but training it from scratch for every new language task was expensive. Howard and Ruder's ULMFiT (2018) had a smarter idea: train once on all of Wikipedia, then quickly specialize for any task. Like a student who reads broadly for years and then focuses on one subject — they learn that subject far faster than someone starting from zero.
            </p>
            <h2>Learning to read, then learning to judge</h2>

            <Analogy label="The Library (Pretraining)">
                <p>Imagine you spend ten years reading every book in a massive library. You don't just memorize
                words — you learn grammar, facts about the world, how stories work, and how arguments are built.
                You become a master reader. You know that "the bank closed early" and "the bank of the river flooded" mean completely different things, and you understand why without being told.</p>
                <p>This is the language model pretraining stage. The model reads Wikipedia — hundreds of millions of words — and learns to predict the next word. To predict well, it must absorb enormous amounts of knowledge about how English works.</p>
            </Analogy>

            <Analogy label="The Bad Librarian (Naive Fine-tuning)">
                <p>Now someone asks you to become a movie critic. A bad teacher would hand you 50 movie reviews
                and say "forget everything else, just memorize these." You'd quickly become great at those 50
                reviews but forget how to read anything else. That's what happens when you fine-tune a language
                model with a high learning rate on a tiny dataset.</p>
                <p>Researchers called this catastrophic forgetting — the model's general linguistic knowledge gets overwritten by the noisy signal from a small task-specific dataset. For years, people thought this was unavoidable.</p>
            </Analogy>

            <Analogy label="The Good Teacher (Discriminative Learning Rates)">
                <p>ULMFiT's first trick is that different parts of the model get different speeds of change. The deep foundational knowledge — basic grammar, word meanings, sentence structure — lives in the early layers. Those layers should change very slowly, if at all. The surface-level task knowledge lives in the top layers. Those can change faster.</p>
                <p>It's like a good music teacher: they won't ask a concert pianist to relearn how to press keys when learning a new piece. They only adjust high-level interpretation. The fundamental technique stays intact.</p>
            </Analogy>

            <Analogy label="The Good Teacher (Gradual Unfreezing)">
                <p>ULMFiT is like a good teacher in another way too. First, they let you read movie reviews at a gentle pace, keeping your general reading skills intact. Then they introduce the critic job slowly: first they let you practice judging just the endings, then the plots, then everything together.</p>
                <p>And they never ask you to change your deep understanding of language — only to apply it to movies. That's gradual unfreezing: start by training only the top classifier layer, then unlock one more layer each epoch, working your way down carefully so earlier knowledge isn't disrupted.</p>
            </Analogy>

            <Analogy label="The Triangular Schedule (Finding the Right Pace)">
                <p>There's one more trick: the learning rate starts small, ramps up quickly to a peak, then slowly descends back down. It's like running a race: you sprint to get up to speed, then pace yourself carefully for the long middle, then slow at the end to avoid a crash.</p>
                <p>This slanted triangular schedule lets the model rapidly adapt to the new domain at first — absorbing the general style of movie reviews — and then carefully refine its weights without overshooting. It's the difference between stumbling into a new subject and gliding smoothly into it.</p>
            </Analogy>

            <Analogy label="The 100-Review Miracle">
                <p>Here's how good ULMFiT was: on IMDb sentiment classification, it matched the performance of models trained on 25,000 labeled reviews — using only 100 labeled reviews. That's a 250x reduction in the amount of expensive human annotation needed.</p>
                <p>The secret was that ULMFiT brought everything it learned from Wikipedia — millions of movies, books, articles — to the task. Those 100 reviews were enough to steer its vast general knowledge toward the specific question of "thumbs up or thumbs down?"</p>
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
                Train a language model (AWD-LSTM: LSTM with Averaged Stochastic Gradient Descent, DropConnect,
                and other regularization) on WikiText-103, a curated subset of Wikipedia containing 103 million
                tokens. The model learns to predict the next word, which forces it to internalize grammar,
                syntax, world knowledge, and discourse structure. This stage is expensive but done once and
                the weights are shared for all downstream tasks.
            </p>
            <p>
                AWD-LSTM specifically applies: weight tying (input and output embeddings share parameters),
                variational dropout (same dropout mask across timesteps), DropConnect (random weight dropout),
                and AR/TAR regularization (activation and temporal activation regularization). These push
                the LM to generalize rather than memorize.
            </p>

            <h3>Stage 2 — Target Task LM Fine-tuning</h3>
            <p>
                Fine-tune the pretrained LM on the <em>unlabeled</em> text of the target task (e.g., all IMDB
                reviews, not just the labeled ones). This step adapts the model's vocabulary and linguistic
                style to the target domain without requiring any labeled data. Two key techniques prevent
                catastrophic forgetting:
            </p>
            <ul>
                <li><strong>Discriminative fine-tuning:</strong> Use a different learning rate for each layer.
                    Early layers (embeddings, first LSTM layers) get a very small LR; later layers
                    get a larger LR. This preserves low-level linguistic features while allowing high-level
                    features to adapt.</li>
                <li><strong>Slanted triangular learning rates (STLR):</strong> The LR first linearly increases
                    to a peak over a short warm-up window, then linearly decays over the remaining training.
                    This helps the model quickly converge to the task domain and then refine its weights
                    with increasing precision.</li>
            </ul>

            <h3>Stage 3 — Target Task Classifier Fine-tuning</h3>
            <p>
                Add two linear layers on top of the LM's final hidden state and fine-tune the entire model
                on the labeled task data. The classifier head concatenates max-pooled and mean-pooled
                representations across all hidden states for robustness to document length. Two additional
                techniques are used:
            </p>
            <ul>
                <li><strong>Gradual unfreezing:</strong> At epoch 1, train only the classifier head. At
                    epoch 2, unfreeze the last LSTM layer. At epoch 3, unfreeze the second-to-last, and so on.
                    This prevents early-layer disruption while allowing the top layers to adapt quickly.</li>
                <li><strong>BPTT for text classification:</strong> For long documents, feed fixed-length
                    chunks (typically 70 tokens) with hidden state propagated forward between chunks. The
                    final document representation is a concatenation of max-pooling and mean-pooling across
                    all chunk hidden states.</li>
            </ul>

            <h3>The Training Corpus — WikiText-103</h3>
            <p>
                WikiText-103 was curated by Salesforce Research: all Wikipedia articles with at least 100
                tokens, totaling 103 million tokens across 28,595 articles. It includes natural
                punctuation, capitalization, and section structure — making it a richer training corpus
                than plain text dumps. The model trained on WikiText-103 is available for download and
                serves as the starting point for any domain adaptation.
            </p>

            <h3>Benchmark Results</h3>
            <p>
                ULMFiT was evaluated on six text classification datasets: IMDb (sentiment), TREC-6
                (question type), DBpedia (topic), AGNews (news), Yelp-Full, and Yelp-Binary:
            </p>
            <ul>
                <li><strong>IMDb:</strong> 94.3% accuracy — best published result at time of release, using only 100 labeled examples (vs. 25,000 for the competing method)</li>
                <li><strong>TREC-6:</strong> 96.4% — new SoTA with only 400 labeled examples</li>
                <li><strong>AG News &amp; DBpedia:</strong> Competitive with models trained on 120,000+ examples, using 100 examples with ULMFiT</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> On IMDb sentiment classification, ULMFiT achieved 94.3% accuracy
                with only 100 labeled examples — matching the previous state-of-the-art that used 25,000 labeled
                examples. The three-stage recipe proved that language models, fine-tuned correctly, are as
                transferable as ImageNet CNNs.
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
                Let the model have L layers with parameters &#952;&#8321;, &#8230;, &#952;&#8466; where &#952;&#8321;
                is the embedding layer and &#952;&#8466; is the final LSTM layer. Instead of a single learning
                rate &#951;, assign layer-specific rates with a geometric decay factor &#958; &#8712; (0, 1), typically 2.6:
                <MathBlock tex="\eta_\ell = \frac{\eta_L}{\xi^{L - \ell}}" />
                Earlier layers update more slowly than later ones.
            </DefBlock>

            <h3>Slanted Triangular Learning Rates</h3>
            <p>
                Let T be the total number of training iterations and cut_frac be the fraction of steps
                used for warm-up (typically 0.1). The STLR schedule ramps up linearly, then decays linearly:
            </p>
            <MathBlock tex="\eta_t = \eta_{\max} \cdot \frac{t}{T \cdot \text{cut\_frac}} \quad \text{if } t \leq T \cdot \text{cut\_frac}" />
            <MathBlock tex="\eta_t = \eta_{\max} \cdot \frac{T - t}{T \cdot (1 - \text{cut\_frac})} \quad \text{if } t > T \cdot \text{cut\_frac}" />
            <p>
                Typical values: cut_frac = 0.1, &#951;&#95;max = 0.01. This creates a sharp rise and gradual
                fall. The asymmetry (short warm-up, long decay) is intentional: rapid adaptation to the
                new domain is followed by careful fine-tuning without overshooting.
            </p>

            <h3>Gradual Unfreezing</h3>
            <p>
                At epoch e, unfreeze all layers &#8467; &#8805; L &#8722; e + 1. The classifier head is always trainable.
                Formally, the effective parameter set at epoch e is:
            </p>
            <MathBlock tex="\Theta_e = \{\theta_{\text{head}}\} \cup \bigcup_{\ell = L-e+1}^{L} \{\theta_\ell\}" />
            <p>
                For a 3-layer LSTM, epoch 1 trains only the head; epoch 2 adds layer 3; epoch 3 adds layer 2;
                epoch 4 adds layer 1 (the embeddings). This schedule prevents the early layers — which encode
                general syntax and morphology — from being corrupted by noisy target-task gradients.
            </p>

            <h3>BPTT Text Classification Pooling</h3>
            <p>
                For a document of length N, split into chunks of size bptt (typically 70 tokens). Process
                chunk c&#8336; with initial hidden state h&#8336;&#8331;&#8321; (carried from the previous chunk).
                The final document representation concatenates max-pooling and mean-pooling across all chunk
                hidden states:
            </p>
            <MathBlock tex="\mathbf{h}_{\text{doc}} = [\max(\mathbf{h}_1, \dots, \mathbf{h}_k); \; \text{mean}(\mathbf{h}_1, \dots, \mathbf{h}_k)]" />
            <MathBlock tex="\hat{y} = \text{softmax}(\mathbf{W}_c \mathbf{h}_{\text{doc}} + \mathbf{b}_c)" />

            <h3>AWD-LSTM Regularization</h3>
            <p>
                The AWD-LSTM adds three regularization terms to the language modeling cross-entropy loss.
                Let h&#8336; be the hidden activation at time t, and W be the recurrent weight matrix:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{LM}} + \alpha \|\mathbf{h}_t\|_2^2 + \beta \|\mathbf{h}_t - \mathbf{h}_{t-1}\|_2^2" />
            <p>
                The first term (AR: activation regularization) prevents large activations. The second term
                (TAR: temporal activation regularization) encourages smooth temporal transitions. Together
                they act as a strong regularizer for the recurrent hidden state trajectory.
            </p>

            <div className="ch-callout">
                <strong>Why it works:</strong> The layer-wise LR decay exploits the hierarchical structure
                of neural language models. Embeddings encode surface features (characters, morphemes); middle
                layers encode syntax; top layers encode task-relevant semantics. Gradual unfreezing respects
                this hierarchy during adaptation. The combination prevents catastrophic forgetting by design,
                not by luck.
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
        return eta_max * (t / cut) if cut > 0 else eta_max
    else:
        return eta_max * ((T - t) / (T - cut))

# ── Discriminative LR per layer ───────────────────────────────────────────────
def discriminative_lrs(base_lr, num_layers, decay_factor=2.6):
    """Return LR for each layer: highest for top layer, decays downward."""
    # layer 0 = embeddings (lowest LR), layer L-1 = top (highest LR)
    return [base_lr / (decay_factor ** (num_layers - 1 - i))
            for i in range(num_layers)]

# ── Gradual Unfreezing mask ───────────────────────────────────────────────────
def unfreezing_mask(epoch, num_layers):
    """
    Return boolean mask: True = trainable at this epoch.
    Epoch 1: only head (index -1 conceptually, all False here).
    Epoch 2: top layer unfrozen. Epoch 3: top 2, etc.
    """
    mask = [False] * num_layers
    layers_to_unfreeze = min(epoch - 1, num_layers)
    for i in range(num_layers - layers_to_unfreeze, num_layers):
        mask[i] = True
    return mask

# ── BPTT Pooling ──────────────────────────────────────────────────────────────
def bptt_pool(chunk_hiddens):
    """Max-pool and mean-pool across chunk hidden states, then concatenate."""
    stack = np.stack(chunk_hiddens, axis=0)   # (num_chunks, hidden_dim)
    max_pool = np.max(stack, axis=0)
    mean_pool = np.mean(stack, axis=0)
    return np.concatenate([max_pool, mean_pool])

# ── Demo ──────────────────────────────────────────────────────────────────────
T = 1000
lrs = [slanted_triangular_lr(t, T) for t in range(T)]

layer_lrs = discriminative_lrs(base_lr=1e-3, num_layers=4)
print("Discriminative Learning Rates (embeddings -> top LSTM)")
print("=" * 50)
for i, lr in enumerate(layer_lrs):
    label = "embed" if i == 0 else f"LSTM-{i}"
    print(f"  Layer {i} ({label:8s}): lr = {lr:.2e}")
print()

print("Gradual Unfreezing Schedule")
print("=" * 50)
for epoch in range(1, 6):
    mask = unfreezing_mask(epoch, num_layers=4)
    status = "".join("T" if m else "F" for m in mask)
    print(f"  Epoch {epoch}: [{status}]  (T=trainable, F=frozen)")
print()

np.random.seed(42)
chunks = [np.random.randn(128) for _ in range(5)]
doc_repr = bptt_pool(chunks)
print(f"BPTT pooled doc repr shape: {doc_repr.shape} (max+mean of 5 chunks x 128)")
print(f"STLR peak at t={np.argmax(lrs)}: lr={max(lrs):.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of the four core ULMFiT techniques: slanted triangular learning
                rates, discriminative layer-wise learning rates, gradual unfreezing masks, and BPTT
                max+mean pooling for document classification.
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
