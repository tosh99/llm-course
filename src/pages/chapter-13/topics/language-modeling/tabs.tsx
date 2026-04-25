import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The objective that unified NLP and led to GPT</h2>
            <p>
                The language modeling objective — predict the next word given all previous words — is one of the oldest tasks in computational linguistics, and one of the most profound. From n-gram frequency tables to the most powerful AI systems ever built, this single self-supervised objective has driven the entire trajectory of natural language processing. It requires no labeled data; text itself is both input and label.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1948–1980s</div>
                    <div className="ch-tl-section-label">Classical Era</div>
                    <div className="ch-tl-title">Shannon's Information Theory and N-gram Language Models</div>
                    <div className="ch-tl-body">
                        Claude Shannon's information theory (1948) established the probabilistic framework: a language model is a probability distribution over sequences. The chain rule of probability naturally decomposes this: P(w<sub>1</sub>, ..., w<sub>T</sub>) = ∏P(w<sub>t</sub> | w<sub>1</sub>, ..., w<sub>t-1</sub>). N-gram models approximate the full conditional with just the last n−1 words (the Markov assumption): P(w<sub>t</sub> | w<sub>t-n+1</sub>, ..., w<sub>t-1</sub>) from corpus count statistics.
                        <br /><br />
                        Unigrams count individual words; bigrams count pairs; trigrams count triples. Kneser-Ney smoothing (1995) made trigram models competitive for decades by elegantly handling unseen word combinations. N-grams dominated speech recognition and machine translation from the 1970s through the 2000s. Their fundamental limitation: they cannot generalize — "the cat sat" and "the feline rested" share no 3-grams, so the model cannot know they mean similar things.
                    </div>
                    <div className="ch-tl-impact">Impact: Dominated speech recognition and machine translation 1970–2010; Kneser-Ney smoothing remains a strong baseline</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2003</div>
                    <div className="ch-tl-section-label">Neural Era Begins</div>
                    <div className="ch-tl-title">Neural Language Model — Bengio et al.</div>
                    <div className="ch-tl-body">
                        Bengio's neural probabilistic language model jointly learned word embeddings and an LM in one model. The neural model could generalize across synonyms — "cat" and "kitten" share similar embeddings, so sentences about one inform predictions about the other. The cross-entropy loss for training is: L = −(1/T)Σlog P(w<sub>t</sub> | w<sub>1</sub>, ..., w<sub>t-1</sub>).
                        <br /><br />
                        The model used a fixed context window of n−1 words, learned word embeddings, and a neural network to map the concatenated context embeddings to a probability distribution over the next word. It demonstrated lower perplexity than n-gram models on the same data — the first clear evidence that neural models could outperform statistical methods on language modeling. But training was slow (weeks on millions of words) and the fixed-window architecture couldn't model long-range dependencies.
                    </div>
                    <div className="ch-tl-impact">Impact: First demonstration that neural LMs could outperform n-grams; introduced the LM pre-training concept; bottlenecked by O(V) softmax</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2010–2015</div>
                    <div className="ch-tl-section-label">RNN Language Models</div>
                    <div className="ch-tl-title">Mikolov's RNN-LM and LSTM Dominance</div>
                    <div className="ch-tl-body">
                        Tomáš Mikolov (before Word2Vec) published "Recurrent Neural Network Based Language Model" (Interspeech 2010), showing that RNNs could process sequences without the fixed-window restriction. The model maintains a hidden state h<sub>t</sub> = tanh(W<sub>xh</sub>x<sub>t</sub> + W<sub>hh</sub>h<sub>t-1</sub> + b) that implicitly captures unbounded context. RNN-LMs dramatically reduced perplexity on Penn Treebank: from ~140 (n-gram) to ~78 (RNN).
                        <br /><br />
                        Zaremba et al. (2014) showed that regularized LSTM LMs achieved Penn Treebank perplexity of 78.4 with dropout, then 68.7 with further tuning — establishing LSTMs as the state of the art for language modeling. The Penn Treebank benchmark became the primary evaluation standard: from 141 (n-gram) → 78 (vanilla LSTM) → 58 (regularized LSTM) → 21 (Transformer).
                    </div>
                    <div className="ch-tl-impact">Impact: LSTM became the standard language model; set records on Penn Treebank; established recurrent architectures as the path to better LMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Universal Pretraining</div>
                    <div className="ch-tl-title">ELMo and GPT-1 — LM as Universal Pretraining</div>
                    <div className="ch-tl-body">
                        Two papers transformed NLP in 2018. ELMo (Peters et al.) used bidirectional LSTM LMs to produce contextual word representations, achieving state-of-the-art on six NLP tasks by simply using the LM's hidden states as features. The LM objective proved sufficient to learn representations that transfer across tasks.
                        <br /><br />
                        GPT-1 (Radford et al., OpenAI) went further: pretrain a Transformer LM on BookCorpus (800M words), then fine-tune on downstream tasks with minimal task-specific layers. The LM objective proved sufficient to learn rich enough representations to transfer across every NLP task — question answering, textual entailment, sentiment analysis, commonsense reasoning. This moment redefined NLP: language modeling was not a task, it was a universal pretraining objective. The path to GPT-3, GPT-4, and Claude was now visible.
                    </div>
                    <div className="ch-tl-impact">Impact: Language modeling became the foundation of all modern NLP; direct predecessor to GPT-3, GPT-4, Claude, and all LLMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020–present</div>
                    <div className="ch-tl-section-label">Scaling Era</div>
                    <div className="ch-tl-title">Scaling Laws and the LLM Revolution</div>
                    <div className="ch-tl-body">
                        Kaplan et al. (OpenAI, 2020) showed that LM cross-entropy loss scales predictably as a power law in model parameters, dataset size, and compute. This "scaling laws" finding gave researchers a roadmap: bigger models trained on more data always improve, and the rate of improvement is predictable. GPT-3 (175B parameters, 300B tokens) leveraged this to demonstrate few-shot learning — language models could perform new tasks with just a few examples in the prompt, without any gradient updates.
                        <br /><br />
                        The language modeling objective — predict the next token — remained unchanged from 1948. What changed was scale: from Shannon's entropy estimates to trillion-token training runs. The self-supervised nature of the objective (text itself is both input and label) made this scaling possible: every webpage, book, and conversation on the internet became free training data.
                    </div>
                    <div className="ch-tl-impact">Impact: Scaling laws enable predictable improvement; GPT-3 demonstrated few-shot learning; the LM objective became the foundation of AI</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why LM is self-supervised:</strong> No human labeling needed. Every sentence in every book, webpage, or conversation is training data: the model sees words 1 through t−1, and word t is the label. At 1 trillion tokens of training data, that's 1 trillion free supervision signals — extracted from text that humans wrote for humans, not for AI.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Predicting the next word — the game that taught AI to write</h2>

            <Analogy label="Fill in the Blank — Over and Over">
                Imagine learning a language by playing a fill-in-the-blank game with every sentence ever written. Someone shows you "The cat sat on the ___" and asks what comes next. You guess "mat," "floor," "chair." You get points for how likely your answer was.
                <br /><br />
                Now imagine playing this game with every sentence in every book, every website, every news article ever written — trillions of words. To get good at this game, you have to learn: grammar (word order rules), facts (cats sit on things), style (formal vs casual writing), and meaning (what words are related to what).
                <br /><br />
                That's language modeling. No human labels needed — the text itself tells the model what words should come next.
            </Analogy>

            <Analogy label="N-grams: Counting What Follows What">
                The simplest language model counts which words tend to follow which other words. In a huge collection of text, "cat" is followed by "sat" some percentage of the time, by "food" another percentage, by "video" another percentage.
                <br /><br />
                This "n-gram" model can predict reasonably well for common phrases — but it has no idea that "feline rested" means the same thing as "cat sat." It only knows about words it's seen together before. If it never saw "feline rested" in training, it assigns zero probability to that phrase.
                <br /><br />
                Neural language models (and eventually LLMs) solve this by learning meaning, not just counting. "Feline" and "cat" get similar embeddings, so predictions about one generalize to the other.
            </Analogy>

            <Analogy label="Perplexity: How Confused Is the Model?">
                If a model assigns probability 0.5 to the correct next word, it's fairly confident. If it assigns probability 0.001, it was very surprised — it had no idea this word was coming.
                <br /><br />
                Perplexity is the average amount of surprise across an entire test dataset. A perplexity of 10 means the model is about as confused as if it had to guess among 10 equally likely options at each step. A perplexity of 1000 means it's choosing from 1000 equally plausible words — essentially random.
                <br /><br />
                Good language models have perplexities in the 20–50 range on news text.
            </Analogy>

            <Analogy label="Why LM Pretraining Works for Everything">
                To predict the next word well, the model must understand enormous amounts about language and the world. It must know grammar, semantics, facts, styles, and conventions. All of this knowledge is encoded in the model's weights — for free, as a byproduct of the LM objective.
                <br /><br />
                Then, for any other NLP task — translating, summarizing, answering questions, classifying sentiment — instead of starting from scratch, you start from a model that already understands language. This transfer is why GPT-4 can do tasks its creators never explicitly trained it for.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Probability chain rule, perplexity, and the cross-entropy loss</h2>

            <h3>The Language Modeling Objective</h3>
            <p>
                The probability of a sequence of T words w<sub>1</sub>, ..., w<sub>T</sub> via the chain rule of probability:
            </p>
            <MathBlock tex="P(w_1, w_2, \ldots, w_T) = \prod_{t=1}^{T} P(w_t \mid w_1, \ldots, w_{t-1})" />
            <p>
                Training: given a corpus, maximize the log-probability of the corpus (equivalent to minimizing cross-entropy loss):
            </p>
            <MathBlock tex="\mathcal{L}_{\text{CE}} = -\frac{1}{T} \sum_{t=1}^{T} \log P(w_t \mid w_1, \ldots, w_{t-1})" />

            <h3>N-gram Approximation (Markov Assumption)</h3>
            <p>
                N-gram models approximate the full history with just the last n−1 words:
            </p>
            <MathBlock tex="P(w_t \mid w_1, \ldots, w_{t-1}) \approx P(w_t \mid w_{t-n+1}, \ldots, w_{t-1}) = \frac{\text{count}(w_{t-n+1}, \ldots, w_t)}{\text{count}(w_{t-n+1}, \ldots, w_{t-1})}" />

            <h3>Neural Language Model (RNN or Transformer)</h3>
            <p>
                An RNN or Transformer computes h<sub>t</sub> from the entire history (implicitly for Transformers, explicitly for RNNs):
            </p>
            <MathBlock tex="P(w_t \mid w_1,\ldots,w_{t-1}) = \text{softmax}(W_o h_t + b)_{w_t}" />

            <h3>Perplexity</h3>
            <p>
                Perplexity (PP) is the exponent of the cross-entropy loss — the geometric mean of the reciprocal probabilities:
            </p>
            <MathBlock tex="\text{PP}(W) = \exp\!\left(-\frac{1}{T}\sum_{t=1}^{T} \log P(w_t \mid w_1, \ldots, w_{t-1})\right)" />
            <p>
                PP = 1: perfect prediction. PP = |V|: uniform random guessing over vocabulary. A PP of 100 means the model is as uncertain as if choosing uniformly among 100 words.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Autoregressive generation:</strong> At inference time, the LM generates text by sampling from P(w<sub>t</sub> | w<sub>1</sub>,...,w<sub>t-1</sub>), appending the sampled word to the context, then generating the next word. This autoregressive process is how GPT models generate text — one token at a time, conditioning on everything generated so far.
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
            <h2>Information theory, perplexity bounds, and the cross-entropy gap</h2>

            <DefBlock label="Language Model as a Distribution">
                A language model p<sub>θ</sub> defines a probability distribution over sequences Σ* over vocabulary Σ. It must satisfy:
                <br /><br />
                Σ<sub>w∈Σ</sub> p<sub>θ</sub>(w | ctx) = 1 for all contexts ctx.
                <br /><br />
                Training: minimize negative log-likelihood (NLL) = cross-entropy between model and empirical corpus distribution p̂:
                <br /><br />
                H(p̂, p<sub>θ</sub>) = −Σ<sub>w</sub> p̂(w | ctx) log p<sub>θ</sub>(w | ctx)
            </DefBlock>

            <h3>Shannon's Entropy and Perplexity Bound</h3>
            <p>
                The Shannon entropy of the true distribution p* gives the minimum achievable cross-entropy for any model:
            </p>
            <MathBlock tex="H(p^*) = -\sum_w p^*(w \mid \text{ctx}) \log p^*(w \mid \text{ctx}) \leq H(p^*, p_\theta)" />
            <p>
                This is the information-theoretic lower bound on perplexity. By Gibbs' inequality, cross-entropy ≥ entropy with equality iff p<sub>θ</sub> = p*. For natural language, estimated entropy ≈ 1–1.5 bits/character ≈ 6–10 bits/word → minimum perplexity ≈ 64–1024.
            </p>

            <h3>The Bits-Per-Character / Bits-Per-Byte Metric</h3>
            <MathBlock tex="\text{BPC} = \frac{\text{NLL}}{\ln 2 \cdot T_\text{chars}} \qquad \text{BPB} = \frac{\text{NLL}}{\ln 2 \cdot T_\text{bytes}}" />
            <p>
                Modern LMs report perplexity on word-level tokenization, but large models often use subword tokenization (BPE). Bits-per-byte (BPB) is tokenizer-agnostic and allows comparison across different vocabularies.
            </p>

            <h3>Teacher Forcing vs Autoregressive Inference</h3>
            <p>
                During training: teacher forcing uses ground-truth tokens as context, even if the model's own prediction would have been wrong. At inference: autoregressive generation uses the model's own sampled tokens. This training/inference mismatch is "exposure bias" — the model never learns to recover from its own errors. Scheduled sampling (Bengio et al., 2015) addresses this by gradually replacing teacher-forced tokens with model predictions during training.
            </p>

            <div className="ch-callout">
                <strong>Scaling laws (Kaplan et al., 2020):</strong> LM cross-entropy loss scales as a power law in model parameters N, dataset size D, and compute C: L(N, D) ≈ (N<sub>c</sub>/N)<sup>α</sup> + (D<sub>c</sub>/D)<sup>β</sup>. This scaling law means bigger models trained on more data always improve — and gave OpenAI the roadmap for GPT-3, GPT-4, and beyond.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
import math
from collections import defaultdict

# ── N-gram Language Model (bigram) ────────────────────────────────────────────

class BigramLM:
    def __init__(self, smoothing=1.0):
        self.counts = defaultdict(lambda: defaultdict(int))
        self.context_counts = defaultdict(int)
        self.vocab = set()
        self.smoothing = smoothing  # Laplace smoothing

    def fit(self, corpus):
        """corpus: list of tokenized sentences (list of list of str)"""
        for sent in corpus:
            tokens = ["<s>"] + sent + ["</s>"]
            self.vocab.update(tokens)
            for i in range(len(tokens) - 1):
                self.counts[tokens[i]][tokens[i+1]] += 1
                self.context_counts[tokens[i]] += 1

    def prob(self, word, context):
        """P(word | context) with Laplace smoothing"""
        V = len(self.vocab)
        num   = self.counts[context][word] + self.smoothing
        denom = self.context_counts[context] + self.smoothing * V
        return num / denom

    def perplexity(self, corpus):
        """Compute perplexity on test corpus"""
        log_prob_sum = 0.0
        total_tokens = 0
        for sent in corpus:
            tokens = ["<s>"] + sent + ["</s>"]
            for i in range(len(tokens) - 1):
                p = self.prob(tokens[i+1], tokens[i])
                log_prob_sum += math.log(p)
                total_tokens += 1
        nll = -log_prob_sum / total_tokens
        return math.exp(nll)

# ── Toy corpus ─────────────────────────────────────────────────────────────────
corpus = [
    "the cat sat on the mat".split(),
    "the dog ran in the park".split(),
    "the cat ran on the mat".split(),
    "the dog sat in the park".split(),
    "a cat and a dog played together".split(),
]

lm = BigramLM(smoothing=0.1)
lm.fit(corpus)

print("=" * 60)
print("Bigram Language Model")
print("=" * 60)

queries = [("cat", "the"), ("dog", "the"), ("sat", "cat"), ("mat", "the")]
for word, ctx in queries:
    p = lm.prob(word, ctx)
    print(f"  P({word:10s} | {ctx:10s}) = {p:.4f}")

print()
print(f"Vocabulary size: {len(lm.vocab)}")
print(f"Train perplexity: {lm.perplexity(corpus):.2f}")

# ── Historical Penn Treebank perplexity progression ───────────────────────────
print()
print("=" * 60)
print("Penn Treebank Word-Level Perplexity -- Historical Progress")
print("=" * 60)
milestones = [
    ("N-gram (Kneser-Ney, 3-gram)", 141),
    ("RNNLM (Mikolov, 2010)",        78),
    ("LSTM (Zaremba et al., 2014)",   68),
    ("AWD-LSTM (Merity, 2018)",       58),
    ("Transformer-XL (2019)",         21),
    ("GPT-2 (OpenAI, 2019)",          18),
]
for name, ppl in milestones:
    bar = "#" * (ppl // 5)
    print(f"  {name:40s}: {ppl:3d}  {bar}")

# ── RNN Language Model (simplified one step) ─────────────────────────────────
print()
print("=" * 60)
print("RNN Language Model -- one forward step")
print("=" * 60)

def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

np.random.seed(42)
V, H = 5, 4
Wx = np.random.randn(H, V) * 0.1
Wh = np.random.randn(H, H) * 0.1
Wy = np.random.randn(V, H) * 0.1
bh = np.zeros(H)
by = np.zeros(V)

def rnn_step(x_onehot, h_prev):
    h = np.tanh(Wx @ x_onehot + Wh @ h_prev + bh)
    logits = Wy @ h + by
    probs = softmax(logits)
    return h, probs

sequence = [0, 1, 2]  # the, cat, sat
word_list = ["the", "cat", "sat", "on", "mat"]
h = np.zeros(H)
loss = 0.0

print(f"{'Step':>5} {'Input':>8} {'Target':>8} {'P(target)':>12} {'Log-P':>10}")
print("-" * 50)
for t, word_id in enumerate(sequence[:-1]):
    x = np.eye(V)[word_id]
    h, probs = rnn_step(x, h)
    target = sequence[t+1]
    p_target = probs[target]
    loss += -np.log(p_target)
    print(f"{t:>5} {word_list[word_id]:>8} {word_list[target]:>8} {p_target:>12.6f} {np.log(p_target):>10.4f}")

avg_loss = loss / (len(sequence)-1)
perplexity = np.exp(avg_loss)
print()
print(f"Cross-entropy loss: {avg_loss:.4f}")
print(f"Perplexity:         {perplexity:.4f}")
print(f"(With random weights, PP ~ V = {V}; after training PP should be much lower)")
`

function PythonContent() {
    return (
        <>
            <p>
                Bigram language model with Laplace smoothing and perplexity computation; historical Penn Treebank perplexity milestones; and a step-by-step RNN language model forward pass showing how cross-entropy loss and perplexity are computed at each step.
            </p>
            <CodeBlock code={PY_CODE} filename="language_model.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LANGUAGE_MODELING_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
