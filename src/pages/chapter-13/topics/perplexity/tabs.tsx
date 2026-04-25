import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From information theory to the standard benchmark of language modeling</h2>
            <p>
                Perplexity is the single most widely reported metric in language modeling research. It has its roots in Claude Shannon's foundational work on information theory in 1948 and 1951, was formalized through cross-entropy in the decades that followed, and became the de facto evaluation currency for neural language models by the 2010s. Lower perplexity means the model is less "surprised" by real text — it assigns higher probability to words that actually appear.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1948–1951</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Shannon — Information Theory and Entropy of English</div>
                    <div className="ch-tl-body">
                        Claude Shannon published "A Mathematical Theory of Communication" (1948) establishing information theory and defining entropy as the average unpredictability of a random variable: H(X) = −Σ P(x) log P(x). In "Prediction and Entropy of Printed English" (1951), Shannon estimated the entropy of English text through human guessing experiments — asking subjects to guess each successive letter while tracking how many guesses were needed.
                        <br /><br />
                        His conclusion: English has an entropy of roughly 1–1.3 bits per character, meaning each letter carries surprisingly little information because context makes it highly predictable. The 26-letter alphabet would suggest 4.7 bits of entropy per character in the maximum-entropy case, but human predictive structure reduces this dramatically. This laid the conceptual groundwork for all subsequent perplexity measurements: perplexity is 2<sup>H</sup>, the exponentiated entropy in bits.
                    </div>
                    <div className="ch-tl-impact">Impact: First empirical estimate of text predictability; entropy became the theoretical basis for perplexity; established the information-theoretic framework</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1970s–80s</div>
                    <div className="ch-tl-section-label">Cross-Entropy Formalism</div>
                    <div className="ch-tl-title">Perplexity as Branching Factor in Speech Recognition</div>
                    <div className="ch-tl-body">
                        Information theorists formalized the relationship between entropy, cross-entropy, and KL divergence. In speech recognition, researchers began using perplexity as a proxy for "how confused" an acoustic model is about the next phoneme or word. A perplexity of 100 meant the model was as uncertain as if it were choosing uniformly among 100 equally likely options — the branching factor interpretation.
                        <br /><br />
                        This branching factor interpretation made perplexity intuitive for practitioners: if a language model has perplexity 50, it's as if there are only 50 plausible words at each position on average. A telephone speech recognizer with PP=200 would make far more errors than one with PP=50, because it must discriminate among far more competing hypotheses. Perplexity became the primary comparative metric in the speech recognition community.
                    </div>
                    <div className="ch-tl-impact">Impact: Perplexity became the standard metric in speech recognition and n-gram language modeling; branching factor interpretation established</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1993–2000s</div>
                    <div className="ch-tl-section-label">Canonical Benchmarks</div>
                    <div className="ch-tl-title">Penn Treebank and the N-gram Era</div>
                    <div className="ch-tl-body">
                        The Penn Treebank (Marcus et al., 1993) established a canonical dataset for language modeling evaluation: 929,000 words of Wall Street Journal text, split into standard train/validation/test sets. Kneser-Ney smoothing and class-based n-gram models pushed Penn Treebank perplexities down to roughly 140–150 (word-level). For decades, improving perplexity on this benchmark was the primary objective of statistical NLP research.
                        <br /><br />
                        WikiText-2 and WikiText-103 (Merity et al., 2016) extended the benchmark to larger, more diverse text while maintaining the same evaluation protocol. These datasets enabled comparison across a decade of model improvements — from n-grams (PP≈140) through LSTMs (PP≈58) to Transformers (PP≈21) — with a single number capturing the progress.
                    </div>
                    <div className="ch-tl-impact">Impact: Standardized benchmarks made perplexity the lingua franca of LM evaluation; enabled decade-long progress tracking</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2010s</div>
                    <div className="ch-tl-section-label">Neural Revolution</div>
                    <div className="ch-tl-title">Neural LMs and the Perplexity Collapse</div>
                    <div className="ch-tl-body">
                        Mikolov's RNNLM (2010) brought Penn Treebank perplexity from ~140 (n-gram) to ~78 (RNN) — a 44% improvement, the largest single improvement in years. Zaremba et al.'s regularized LSTM (2014) pushed it to ~68. Merity et al.'s AWD-LSTM (2018) used weight dropout, DropConnect, and neural architecture search to reach ~58.
                        <br /><br />
                        The Transformer (Vaswani et al., 2017) and GPT series then shattered previous records. GPT-2 (2019) achieved 18.3 on WikiText-103. Each architecture advance produced a step-change in perplexity, demonstrating that architectural design choices could be objectively compared through this single number. Perplexity had become the universal yardstick for LM progress.
                    </div>
                    <div className="ch-tl-impact">Impact: Neural architectures reduced perplexity by an order of magnitude; metric remains central today</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020–present</div>
                    <div className="ch-tl-section-label">Limitations and Complements</div>
                    <div className="ch-tl-title">When Perplexity Isn't Enough</div>
                    <div className="ch-tl-body">
                        As LLMs became highly capable, perplexity's limitations became apparent. BLEU, ROUGE, and human evaluation emerged as complements for generation tasks. BIG-Bench and HELM established capability benchmarks that measure task performance directly, not just next-token prediction probability. The GPT-4 technical report showed that perplexity alone cannot capture capabilities like reasoning, coding, or following complex instructions.
                        <br /><br />
                        Calibration issues add another dimension: a model may assign high probability (low perplexity) to fluent but factually wrong text. Perplexity measures linguistic fluency and statistical regularity, not factual accuracy or reasoning quality. Modern LLM evaluation uses perplexity as one signal among many: human preference ratings (RLHF training signal), task accuracy on structured benchmarks (MMLU, HumanEval), and safety metrics.
                    </div>
                    <div className="ch-tl-impact">Impact: Perplexity remains the training objective for generative LMs but is insufficient for evaluation; supplemented by human eval, BLEU, task benchmarks</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why lower is better:</strong> Perplexity is exponentiated cross-entropy. A model with perplexity 100 assigns roughly the same probability to the true next word as if it were guessing blindly among 100 options. A model with perplexity 20 is five times more confident — equivalent to choosing among only 20 equally likely options.
            </div>
            <div className="ch-callout">
                <strong>What comes next:</strong> Perplexity provided a reliable metric for language model quality. With meaningful word embeddings and a way to measure performance, the field could now tackle a bigger challenge: encoding meaning across entire sentences, not just individual words. In 2014, Sutskever et al.'s Seq2Seq architecture proposed compressing a full sentence into a single vector and reconstructing it in another language — the beginning of neural machine translation. Chapter 14 follows that story.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How surprised would you be by the next word?</h2>

            <Analogy label="The Surprised Reader">
                Imagine you're reading a story. I give you the sentence: "The cat sat on the..." What word comes next? You'd probably guess "mat." And you'd be right most of the time. You weren't very surprised.
                <br /><br />
                Now imagine the sentence is: "The quantum fluctuation destabilized the..." Unless you're a physicist, you probably have no idea what comes next. You'd be very surprised by whatever word actually appears.
                <br /><br />
                Perplexity measures exactly this: how surprised a model is by real text. A model with <em>low perplexity</em> reads text like you read "the cat sat on the mat" — usually unsurprised, because it predicted the right words. A model with <em>high perplexity</em> is constantly surprised, like a first-grader reading a physics textbook.
            </Analogy>

            <Analogy label="The Birthday Party Game">
                Imagine a birthday party game where kids try to guess the next word in a story. If the story is simple — "The dog ran to the..." — most kids guess "park" or "house" and get it right. The kids have <em>low perplexity</em>.
                <br /><br />
                If the story is complex — "The epistemological framework underlying..." — the kids are totally lost. They'd need hundreds of guesses to get the right word. They have <em>high perplexity</em>.
                <br /><br />
                A good language model is like a very smart kid who has read millions of books and usually guesses the next word correctly. We measure its "smartness" with perplexity.
            </Analogy>

            <Analogy label="Why We Care About Surprise">
                Being unsurprised by real text means the model has learned the patterns of language. It knows that "cat" usually goes with "sat" and "mat," not with "refrigerator" or "theorem." When a model is rarely surprised, it can write essays, answer questions, and have conversations — because it understands what words belong together.
                <br /><br />
                That's why researchers obsess over lowering perplexity: less surprise means more understanding.
            </Analogy>

            <Analogy label="Penn Treebank Numbers — Seeing the Progress">
                For decades, researchers compared language models on the Penn Treebank dataset using perplexity. Here's what the numbers mean in plain terms:
                <br /><br />
                N-gram model (1995): perplexity ~141. On average, the model was as confused as if it were choosing uniformly from 141 equally likely words.
                <br /><br />
                LSTM (2014): perplexity ~68. The model got 2× better — now only as confused as choosing from 68 equally likely words.
                <br /><br />
                Transformer (2019): perplexity ~21. Another 3× improvement — now choosing from just 21 equally likely words on average.
                <br /><br />
                Each generation of architecture roughly cut perplexity in half. The metric made this progress visible and comparable.
            </Analogy>

            <Analogy label="What comes next — From words to sentences">
                Perplexity measures how surprised a language model is by new text. With that measuring stick in hand, Chapter 14 asks: can we build a network that translates whole sentences — not word by word, but meaning by meaning? The Seq2Seq architecture tried exactly that, compressing an entire sentence into a single vector before expanding it into another language.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Perplexity as exponentiated average cross-entropy</h2>

            <h3>What Perplexity Measures</h3>
            <p>
                Perplexity quantifies how "confused" a language model is when it reads a sequence of words. A confused model assigns low probability to the words that actually appear, resulting in high perplexity. A confident model assigns high probability, yielding low perplexity.
            </p>

            <h3>The Definition</h3>
            <p>
                Perplexity is the exponentiation of the average cross-entropy loss over a sequence. If the model assigns probability P(w<sub>i</sub> | w<sub>1</sub>...w<sub>i-1</sub>) to each word, the perplexity is:
            </p>
            <MathBlock tex="\text{PP}(W) = \exp\!\left(-\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})\right)" />
            <p>
                The sum runs over all N words in the corpus. The negative sign converts log-probabilities (always negative) into a positive value inside the exponential.
            </p>

            <h3>Relation to Branching Factor</h3>
            <p>
                Perplexity can be interpreted as the <strong>branching factor</strong>: the effective number of equally likely choices the model faces at each step. A perplexity of 100 means the model is as uncertain as if it were picking uniformly from 100 options. A perplexity of 20 means it behaves as if only 20 choices were plausible.
            </p>

            <h3>Cross-Entropy Connection</h3>
            <p>
                Cross-entropy H between the true distribution and the model distribution is:
            </p>
            <MathBlock tex="H = -\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})" />
            <MathBlock tex="\text{PP}(W) = \exp(H) = 2^{H_2}" />
            <p>
                where H<sub>2</sub> is cross-entropy in bits (base-2 logarithm). Minimizing cross-entropy is exactly equivalent to minimizing perplexity.
            </p>

            <h3>Historical Benchmarks — Penn Treebank</h3>
            <p>
                Progress on the Penn Treebank test set (word-level perplexity, lower is better):
            </p>
            <MathBlock tex="\begin{array}{ll} \textbf{Model} & \textbf{PP} \\ \hline \text{N-gram (Kneser-Ney)} & 141 \\ \text{RNNLM (Mikolov, 2010)} & 78 \\ \text{LSTM (Zaremba, 2014)} & 68 \\ \text{AWD-LSTM (2018)} & 58 \\ \text{Transformer-XL (2019)} & 21 \\ \end{array}" />

            <div className="ch-callout">
                <strong>Intuition check:</strong> If a model always predicts the next word with probability 1.0, log P = 0, and perplexity = exp(0) = 1. If the model predicts randomly among V words with probability 1/V each, log P = −log(V), and perplexity = V. Perplexity ranges from 1 (perfect) to V (worst possible).
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
            <h2>The formal definition of perplexity</h2>

            <DefBlock label="Perplexity of a Sequence">
                Let W = (w<sub>1</sub>, w<sub>2</sub>, ..., w<sub>N</sub>) be a sequence of N tokens. Let P(w<sub>i</sub> | w<sub>1</sub>...w<sub>i-1</sub>) be the conditional probability assigned by the model to token w<sub>i</sub>.
                <br /><br />
                The perplexity of the sequence is:
                <MathBlock tex="\text{PP}(W) = \exp\!\left(-\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})\right)" />
                Equivalently, using the chain rule for probabilities:
                <MathBlock tex="\text{PP}(W) = P(w_1, w_2, \dots, w_N)^{-1/N}" />
            </DefBlock>

            <h3>Perplexity for a Corpus</h3>
            <p>
                For a test corpus of M sentences, perplexity is computed over all tokens:
            </p>
            <MathBlock tex="\text{PP} = \exp\!\left(-\frac{1}{N_{\text{total}}} \sum_{j=1}^{M} \sum_{i=1}^{N_j} \log P(w_i^{(j)} \mid w_1^{(j)},\dots,w_{i-1}^{(j)})\right)" />

            <h3>Connection to Entropy and KL Divergence</h3>
            <p>
                Let H(P, Q) denote the cross-entropy between the true distribution P and model distribution Q:
            </p>
            <MathBlock tex="H(P, Q) = -\mathbb{E}_{P}\big[\log Q(w)\big] \approx -\frac{1}{N} \sum_{i=1}^{N} \log Q(w_i \mid \text{context}_i)" />
            <p>
                Therefore PP(W) = exp(H(P, Q)) = 2<sup>H₂(P,Q)</sup>. The KL divergence D<sub>KL</sub>(P||Q) = H(P,Q) − H(P) represents the perplexity gap between model Q and the theoretical minimum.
            </p>

            <h3>Special Cases</h3>
            <ul>
                <li><strong>Perfect model:</strong> Q(w<sub>i</sub>) = 1 for all true tokens → log Q = 0 → PP = exp(0) = 1</li>
                <li><strong>Uniform random:</strong> Q(w<sub>i</sub>) = 1/V for all tokens → PP = V</li>
                <li><strong>Unigram baseline:</strong> Q(w<sub>i</sub>) = count(w<sub>i</sub>) / N → PP = exp(H<sub>unigram</sub>)</li>
            </ul>

            <h3>Bits-per-Character and Bits-per-Byte</h3>
            <MathBlock tex="\text{BPC} = \frac{H}{\ln 2 \cdot \bar{L}_{\text{chars}}} \qquad \text{BPB} = \frac{H}{\ln 2 \cdot \bar{L}_{\text{bytes}}}" />
            <p>
                These tokenizer-agnostic metrics allow comparison across models with different vocabularies. GPT-4 achieves approximately 0.7 BPB on standard English text.
            </p>

            <div className="ch-callout">
                <strong>Important caveat:</strong> Perplexity is an intrinsic, likelihood-based metric. It correlates with downstream task performance but does not guarantee it. A model with lower perplexity is not necessarily better at translation, summarization, or reasoning — but in practice, the correlation is strong enough that perplexity remains the primary training and evaluation objective for generative LMs. For generation quality, BLEU, ROUGE, and human evaluation serve as complements.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import math

# ── Manual perplexity computation ──────────────────────────────────────────────

def perplexity_from_probs(true_probs):
    """
    true_probs: list of P(correct_word | context) at each step.
    Returns perplexity = exp(-mean(log(p))).
    """
    log_probs = [math.log(p) for p in true_probs]
    nll = -sum(log_probs) / len(log_probs)
    return math.exp(nll)

# ── Illustrate with different model quality levels ─────────────────────────────

print("=" * 60)
print("Perplexity: effect of probability assignments")
print("=" * 60)

scenarios = [
    ("Perfect model: always P=1.0",   [1.0] * 10),
    ("Excellent:     always P=0.9",   [0.9] * 10),
    ("Good model:    always P=0.5",   [0.5] * 10),
    ("Mediocre:      always P=0.1",   [0.1] * 10),
    ("Uniform guess: V=50000",        [1/50000] * 10),
    ("Mixed quality",                  [0.8, 0.6, 0.3, 0.9, 0.05, 0.7, 0.4, 0.8, 0.2, 0.6]),
]

for name, probs in scenarios:
    pp = perplexity_from_probs(probs)
    print(f"  {name:40s}: PP = {pp:10.2f}")

# ── Penn Treebank historical progress ─────────────────────────────────────────
print()
print("=" * 60)
print("Penn Treebank Word-Level Perplexity -- Historical Progress")
print("=" * 60)

milestones = [
    ("N-gram (Kneser-Ney, 3-gram)", 141, 1995),
    ("RNNLM (Mikolov, 2010)",        78,  2010),
    ("LSTM (Zaremba et al., 2014)",   68,  2014),
    ("AWD-LSTM (Merity, 2018)",       58,  2018),
    ("Transformer-XL (2019)",         21,  2019),
    ("GPT-2 (OpenAI, 2019)",          18,  2019),
]
print(f"{'Year':>6}  {'PP':>5}  {'Model':40s}  {'BranchFactor'}  {'Rel. to N-gram'}")
print("-" * 80)
baseline = 141
for name, ppl, year in milestones:
    rel = ppl / baseline
    print(f"{year:>6}  {ppl:>5}  {name:40s}  {ppl:>12.0f}x  {rel:.2f}x")

# ── Cross-entropy and perplexity relationship ─────────────────────────────────
print()
print("=" * 60)
print("Cross-entropy <-> Perplexity relationship")
print("=" * 60)
print(f"{'Cross-entropy H':>18}  {'Perplexity exp(H)':>18}  {'Bits-per-word H/ln2':>22}")
print("-" * 65)
for h in [0.0, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0]:
    pp = math.exp(h)
    bpw = h / math.log(2)
    print(f"{h:>18.2f}  {pp:>18.2f}  {bpw:>22.2f}")

# ── PyTorch: computing perplexity from a language model ───────────────────────
print()
print("=" * 60)
print("PyTorch: LM perplexity from cross-entropy loss")
print("=" * 60)

import torch
import torch.nn.functional as F

# Simulate a 3-step LM prediction (vocab_size=5)
# logits[i] predicts the distribution over next token
torch.manual_seed(42)
vocab_size = 5
logits = torch.randn(3, vocab_size)            # 3 steps, 5 classes
targets = torch.tensor([2, 0, 4])              # correct next tokens

# Cross-entropy loss (per token average)
loss = F.cross_entropy(logits, targets)
perplexity = torch.exp(loss)

print(f"Logits shape:  {logits.shape}")
print(f"Targets:       {targets.tolist()}")
print(f"CE loss:       {loss.item():.4f}")
print(f"Perplexity:    {perplexity.item():.4f}")
print(f"  (random model on V=5 -> expected PP = {vocab_size})")

# Per-token probabilities
probs = F.softmax(logits, dim=-1)
for i in range(3):
    p_correct = probs[i, targets[i]].item()
    print(f"  step {i}: P(correct={targets[i].item()}) = {p_correct:.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Manual perplexity computation from probability assignments; Penn Treebank historical progress table; cross-entropy to perplexity conversion table; and PyTorch cross-entropy loss to perplexity demonstration with per-token probability inspection.
            </p>
            <CodeBlock code={PY_CODE} filename="perplexity_demo.py" lang="python" langLabel="Python" />
        </>
    )
}



// ── Tab content map ───────────────────────────────────────────────────────────

export const PERPLEXITY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
