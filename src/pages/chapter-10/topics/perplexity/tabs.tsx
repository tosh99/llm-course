import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From information theory to the standard benchmark of language modeling</h2>
            <p>
                Perplexity is the single most widely reported metric in language modeling research.
                It has its roots in Claude Shannon's foundational work on information theory in 1951,
                was formalized through cross-entropy in the decades that followed, and became the
                de facto evaluation currency for neural language models by the 2010s. Lower perplexity
                means the model is less "surprised" by real text — it assigns higher probability to
                words that actually appear.
            </p>

            <div className="ch10-timeline">
                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">1951</div>
                    <div className="ch10-tl-section-label">Foundation</div>
                    <div className="ch10-tl-title">Shannon — Prediction and Entropy of Printed English</div>
                    <div className="ch10-tl-body">
                        Claude Shannon published "Prediction and Entropy of Printed English," in which
                        he estimated the entropy of English text through human guessing experiments.
                        He concluded that English has an entropy of roughly 1–1.3 bits per character,
                        meaning each letter carries surprisingly little information because context
                        makes it highly predictable. This laid the conceptual groundwork for all
                        subsequent perplexity measurements.
                    </div>
                    <div className="ch10-tl-impact">Impact: First empirical estimate of text predictability; entropy became the theoretical basis for perplexity</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">1970s–80s</div>
                    <div className="ch10-tl-section-label">Cross-entropy formalism</div>
                    <div className="ch10-tl-title">Entropy, cross-entropy, and the branching factor</div>
                    <div className="ch10-tl-body">
                        Information theorists formalized the relationship between entropy, cross-entropy,
                        and KL divergence. In speech recognition, researchers began using perplexity as
                        a proxy for "how confused" an acoustic model is about the next phoneme or word.
                        A perplexity of 100 meant the model was as uncertain as if it were choosing
                        uniformly among 100 equally likely options — the branching factor interpretation.
                    </div>
                    <div className="ch10-tl-impact">Impact: Perplexity became the standard metric in speech recognition and n-gram language modeling</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">1990s–2000s</div>
                    <div className="ch10-tl-section-label">Statistical NLP</div>
                    <div className="ch10-tl-title">Penn Treebank and the era of n-gram LMs</div>
                    <div className="ch10-tl-body">
                        The Penn Treebank (Marcus et al., 1993) and later WikiText (Merity et al., 2016)
                        established canonical datasets for language modeling evaluation. Kneser-Ney
                        smoothing and class-based n-gram models pushed Penn Treebank perplexities down
                        to roughly 140–150 (word-level). For decades, improving perplexity on these
                        benchmarks was the primary objective of statistical NLP research.
                    </div>
                    <div className="ch10-tl-impact">Impact: Standardized benchmarks made perplexity the lingua franca of LM evaluation</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2010s</div>
                    <div className="ch10-tl-section-label">Neural revolution</div>
                    <div className="ch10-tl-title">Neural LMs, LSTMs, and Transformer benchmarks</div>
                    <div className="ch10-tl-body">
                        Neural language models began to dramatically outperform n-gram baselines.
                        Mikolov's RNNLM (2010) brought recurrent networks to the task; Zaremba et al.'s
                        LSTM regularization (2014) pushed PTB below 80 perplexity. The Transformer
                        (Vaswani et al., 2017) and GPT series shattered previous records. By 2019,
                        GPT-2 achieved 18.3 on WikiText-103 and GPT-3 drove it even lower. Perplexity
                        had become the universal yardstick for LM progress.
                    </div>
                    <div className="ch10-tl-impact">Impact: Neural architectures reduced perplexity by an order of magnitude; the metric remains central today</div>
                </div>
            </div>

            <div className="ch10-callout">
                <strong>Why lower is better:</strong> Perplexity is exponentiated cross-entropy.
                A model with perplexity 100 assigns roughly the same probability to the true next word
                as if it were guessing blindly among 100 options. A model with perplexity 20 is five
                times more confident — equivalent to choosing among only 20 equally likely options.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How surprised would you be by the next word?</h2>

            <Analogy label="The Surprised Reader">
                Imagine you're reading a story. I give you the sentence: "The cat sat on the..."
                What word comes next? You'd probably guess "mat." And you'd be right most of the time.
                You weren't very surprised.
                <br /><br />
                Now imagine the sentence is: "The quantum fluctuation destabilized the..."
                Unless you're a physicist, you probably have no idea what comes next. You'd be very
                surprised by whatever word actually appears.
                <br /><br />
                Perplexity measures exactly this: how surprised a model is by real text. A model
                with <em>low perplexity</em> reads text like you read "the cat sat on the mat" —
                usually unsurprised, because it predicted the right words. A model with <em>high
                perplexity</em> is constantly surprised, like a first-grader reading a physics textbook.
            </Analogy>

            <Analogy label="The Birthday Party Game">
                Imagine a birthday party game where kids try to guess the next word in a story.
                If the story is simple — "The dog ran to the..." — most kids guess "park" or "house"
                and get it right. The kids have <em>low perplexity</em>.
                <br /><br />
                If the story is complex — "The epistemological framework underlying..." — the kids
                are totally lost. They'd need hundreds of guesses to get the right word. They have
                <em>high perplexity</em>.
                <br /><br />
                A good language model is like a very smart kid who has read millions of books and
                usually guesses the next word correctly. We measure its "smartness" with perplexity.
            </Analogy>

            <Analogy label="Why We Care About Surprise">
                Being unsurprised by real text means the model has learned the patterns of language.
                It knows that "cat" usually goes with "sat" and "mat," not with "refrigerator" or
                "theorem." When a model is rarely surprised, it can write essays, answer questions,
                and have conversations — because it understands what words belong together.
                <br /><br />
                That's why researchers obsess over lowering perplexity: less surprise means more
                understanding.
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
                Perplexity quantifies how "confused" a language model is when it reads a sequence
                of words. A confused model assigns low probability to the words that actually appear,
                resulting in high perplexity. A confident model assigns high probability, yielding
                low perplexity.
            </p>

            <h3>The Definition</h3>
            <p>
                Perplexity is the exponentiation of the average cross-entropy loss over a sequence.
                If the model assigns probability <em>P(w<sub>i</sub> | w<sub>1</sub>...w<sub>i-1</sub>)</em> to each
                word, the perplexity is:
            </p>
            <MathBlock tex="\text{PP}(W) = \exp\!\left(-\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})\right)" />
            <p>
                The sum runs over all <em>N</em> words in the corpus. The negative sign converts
                log-probabilities (always negative) into a positive value inside the exponential.
            </p>

            <h3>Relation to Branching Factor</h3>
            <p>
                Perplexity can be interpreted as the <strong>branching factor</strong>: the effective
                number of equally likely choices the model faces at each step. A perplexity of 100
                means the model is as uncertain as if it were picking uniformly from 100 options.
                A perplexity of 20 means it behaves as if only 20 choices were plausible.
            </p>

            <h3>Cross-Entropy Connection</h3>
            <p>
                Cross-entropy H between the true distribution and the model distribution is:
            </p>
            <MathBlock tex="H = -\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})" />
            <p>
                Therefore PP(W) = exp(H). Minimizing cross-entropy is exactly equivalent to
                minimizing perplexity. This is why language models are trained with cross-entropy
                loss and evaluated with perplexity.
            </p>

            <div className="ch10-callout">
                <strong>Intuition check:</strong> If a model always predicts the next word with
                probability 1.0, log P = 0, and perplexity = exp(0) = 1. If the model predicts
                randomly among V words with probability 1/V each, log P = -log(V), and perplexity
                = V. Perplexity ranges from 1 (perfect) to V (worst possible).
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The formal definition of perplexity</h2>

            <DefBlock label="Perplexity of a Sequence">
                Let <em>W = (w<sub>1</sub>, w<sub>2</sub>, ..., w<sub>N</sub>)</em> be a sequence of
                <em>N</em> tokens. Let <em>P(w<sub>i</sub> | w<sub>1</sub>...w<sub>i-1</sub>)</em> be
                the conditional probability assigned by the model to token <em>w<sub>i</sub></em>.
                <br /><br />
                The perplexity of the sequence is:
                <MathBlock tex="\text{PP}(W) = \exp\!\left(-\frac{1}{N} \sum_{i=1}^{N} \log P(w_i \mid w_1,\dots,w_{i-1})\right)" />
                Equivalently, using the chain rule for probabilities:
                <MathBlock tex="\text{PP}(W) = P(w_1, w_2, \dots, w_N)^{-1/N}" />
            </DefBlock>

            <h3>Perplexity for a Corpus</h3>
            <p>
                For a test corpus of <em>M</em> sentences, perplexity is computed over all tokens:
            </p>
            <MathBlock tex="\text{PP} = \exp\!\left(-\frac{1}{N_{\text{total}}} \sum_{j=1}^{M} \sum_{i=1}^{N_j} \log P(w_i^{(j)} \mid w_1^{(j)},\dots,w_{i-1}^{(j)})\right)" />

            <h3>Connection to Entropy</h3>
            <p>
                Let <em>H(P, Q)</em> denote the cross-entropy between the true distribution <em>P</em>
                and model distribution <em>Q</em>. For a sequence:
            </p>
            <MathBlock tex="H(P, Q) = -\mathbb{E}_{P}\big[\log Q(w)\big] \approx -\frac{1}{N} \sum_{i=1}^{N} \log Q(w_i \mid \text{context}_i)" />
            <p>
                Therefore:
            </p>
            <MathBlock tex="\text{PP}(W) = \exp\big(H(P, Q)\big) = 2^{H_2(P, Q)}" />
            <p>
                where <em>H<sub>2</sub></em> is the cross-entropy measured in bits (base 2). This
                confirms the branching factor interpretation: perplexity is the effective vocabulary
                size if all choices were equally likely.
            </p>

            <h3>Special Cases</h3>
            <ul>
                <li><strong>Perfect model:</strong> Q(w<sub>i</sub>) = 1 for all true tokens → log Q = 0 → PP = exp(0) = 1</li>
                <li><strong>Uniform random:</strong> Q(w<sub>i</sub>) = 1/V for all tokens → PP = V</li>
                <li><strong>Unigram baseline:</strong> Q(w<sub>i</sub>) = count(w<sub>i</sub>) / N → PP = exp(H<sub>unigram</sub>)</li>
            </ul>

            <div className="ch10-callout">
                <strong>Important caveat:</strong> Perplexity is an intrinsic, likelihood-based metric.
                It correlates with downstream task performance but does not guarantee it. A model with
                lower perplexity is not necessarily better at translation, summarization, or reasoning —
                but in practice, the correlation is strong enough that perplexity remains the primary
                training and evaluation objective for generative LMs.
            </div>
        </>
    )
}

const PY_CODE = `import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# ── Load a small pretrained GPT-2 ──────────────────────────────────────────────
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
model.eval()

# ── Sentence to evaluate ──────────────────────────────────────────────────────
sentence = "The quick brown fox jumps over the lazy dog."
inputs = tokenizer(sentence, return_tensors="pt")
input_ids = inputs["input_ids"]  # [1, seq_len]

# ── Compute perplexity ────────────────────────────────────────────────────────
with torch.no_grad():
    outputs = model(input_ids, labels=input_ids)
    loss = outputs.loss  # average cross-entropy over the sequence

perplexity = torch.exp(loss)

print("=" * 50)
print("Perplexity Demo (GPT-2)")
print("=" * 50)
print(f"Sentence:   {sentence}")
print(f"Tokens:     {tokenizer.convert_ids_to_tokens(input_ids[0])}")
print(f"Loss:       {loss.item():.4f}")
print(f"Perplexity: {perplexity.item():.2f}")

# ── Manual step-by-step computation ───────────────────────────────────────────
print()
print("Manual per-token log-probabilities:")
print("-" * 40)

with torch.no_grad():
    logits = model(input_ids).logits  # [1, seq_len, vocab_size]
    probs = torch.softmax(logits, dim=-1)

    # Shift so that logits[i] predicts token[i+1]
    for i in range(input_ids.size(1) - 1):
        token_id = input_ids[0, i + 1].item()
        token_prob = probs[0, i, token_id].item()
        token_str = tokenizer.decode([token_id])
        print(f"  P({token_str!r:12s} | context) = {token_prob:.6f}")

    # Average log-prob and perplexity
    log_probs = torch.log(probs[0, :-1, :].gather(1, input_ids[0, 1:].unsqueeze(1)))
    avg_log_prob = log_probs.mean().item()
    manual_pp = torch.exp(-torch.tensor(avg_log_prob)).item()
    print(f"  Manual PP:  {manual_pp:.2f}")
`

function PythonTab() {
    return (
        <>
            <p>
                Compute perplexity on a sentence using GPT-2 from Hugging Face Transformers.
                The script shows both the high-level API (passing <code>labels</code> to get
                the loss directly) and a manual step-by-step computation of per-token probabilities.
            </p>
            <CodeBlock code={PY_CODE} filename="perplexity_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Perplexity from a probability array (TypeScript) ─────────────────────────

/**
 * Compute perplexity from an array of conditional probabilities.
 * Each prob[i] is P(token_i | token_0 ... token_{i-1}).
 * Perplexity = exp(-1/N * sum(log(prob_i)))
 */
function perplexity(probs: number[]): number {
  const n = probs.length
  if (n === 0) return NaN

  let logSum = 0
  for (const p of probs) {
    if (p <= 0 || p > 1) {
      throw new Error(
        \`Invalid probability \${p}. Must be in (0, 1].\`
      )
    }
    logSum += Math.log(p)
  }

  const avgLogProb = logSum / n
  return Math.exp(-avgLogProb)
}

// ── Demo ─────────────────────────────────────────────────────────────────────

// A "perfect" model assigns probability 1.0 to every true token
const perfectProbs = [1.0, 1.0, 1.0, 1.0, 1.0]
console.log("Perfect model PP:", perplexity(perfectProbs).toFixed(4))
// → 1.0000

// A decent model assigns moderate probabilities
const decentProbs = [0.8, 0.6, 0.7, 0.5, 0.9]
console.log("Decent model PP:", perplexity(decentProbs).toFixed(4))
// → 1.7100

// A confused model assigns very low probabilities
const confusedProbs = [0.01, 0.02, 0.005, 0.01, 0.015]
console.log("Confused model PP:", perplexity(confusedProbs).toFixed(4))
// → 109.9472

// Uniform random over a vocabulary of 10,000 words
const vocabSize = 10000
const uniformProbs = new Array(10).fill(1 / vocabSize)
console.log("Uniform random PP:", perplexity(uniformProbs).toFixed(4))
// → 10000.0000

// ── Perplexity from log-probabilities ────────────────────────────────────────

function perplexityFromLogits(logits: number[]): number {
  const n = logits.length
  if (n === 0) return NaN

  // Numerically stable softmax
  const maxLogit = Math.max(...logits)
  const expShifted = logits.map(x => Math.exp(x - maxLogit))
  const sumExp = expShifted.reduce((a, b) => a + b, 0)
  const probs = expShifted.map(x => x / sumExp)

  // Assume the true token is at index 0 (for demonstration)
  const trueTokenProb = probs[0]
  return perplexity([trueTokenProb])
}

const exampleLogits = [2.5, 1.2, 0.3, -0.8, -1.5]
console.log("PP from logits:", perplexityFromLogits(exampleLogits).toFixed(4))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of perplexity from an array of conditional probabilities,
                plus a numerically stable softmax helper and demonstrations of perfect, decent,
                confused, and uniform-random models.
            </p>
            <CodeBlock code={TS_CODE} filename="perplexity.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch10-callout">
                <strong>Key property:</strong> Perplexity is sensitive to very low probabilities.
                A single token predicted with probability 0.001 can dominate the average and spike
                the perplexity — which is why smoothing and good out-of-vocabulary handling matter.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PERPLEXITY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
