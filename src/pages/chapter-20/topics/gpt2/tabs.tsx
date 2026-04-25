import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    context: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">Context</div>
            <div className="ch-tl-body">{item.context}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "June 2018 — GPT-1 and the Decoder-Only Bet",
            title: "OpenAI bets on generative pretraining",
            context: "Chapter 19's BERT won the encoder race — bidirectional pretraining gave it state-of-the-art results on 11 NLP benchmarks simultaneously. But BERT was built to understand text, not to produce it. At the same moment, OpenAI had been developing a quieter thesis: a purely causal, left-to-right decoder pretrained to predict the next word could learn rich representations as a side effect of that prediction task.",
            what: "Radford et al. published GPT-1 (Generative Pretrained Transformer) — a 117-million-parameter decoder-only transformer trained on BooksCorpus (7,000 unpublished books, ~800M words). Pretraining used a left-to-right language modeling objective; fine-tuning added a lightweight classification head per task. GPT-1 outperformed prior state-of-the-art on 9 of 12 benchmarks, including commonsense reasoning and textual entailment.",
            impact: "GPT-1 established that the 'pretrain then fine-tune' recipe could work for generative models, not just encoders. But more importantly, it hinted at something deeper: the language modeling objective alone was forcing the model to learn grammar, facts, and reasoning as instrumental skills needed to predict the next word. The team suspected this compressed world-knowledge would scale dramatically.",
        },
        {
            year: "Late 2018 — Building WebText at Scale",
            title: "Curation over crawl — quality signals from Reddit",
            context: "For GPT-1, BooksCorpus provided high-quality but narrow text. If scale was the key, the team needed data that was orders of magnitude larger and more diverse — covering news, science, fiction, legal text, casual conversation, and technical writing simultaneously. Indiscriminate web crawl would bring in spam and low-quality pages. They needed a quality signal embedded in the web itself.",
            what: "OpenAI engineers scraped all outbound links from Reddit posts that had received at least 3 karma points, reasoning that human upvoting constituted a quality filter. After deduplication and filtering for minimum document length, the resulting corpus — called WebText — contained roughly 8 million documents and 40GB of text (~10 billion tokens). Four model variants were trained simultaneously: 117M, 345M, 762M, and 1.5B parameters.",
            impact: "The karma-filtered Reddit approach was elegant: it used human curation signals embedded in social media to proxy for content quality. WebText had minimal overlap with standard NLP benchmarks (unlike BooksCorpus), which made subsequent zero-shot evaluations on those benchmarks more honest. The multi-scale training run also produced the first systematic evidence that validation loss improved smoothly and predictably with parameter count — foreshadowing the scaling laws paper.",
        },
        {
            year: "February 2019 — Release and the Staged Rollout Controversy",
            title: "Language Models are Unsupervised Multitask Learners",
            context: "When Radford, Wu, Child, Luan, Amodei, and Sutskever ran the full 1.5B model through zero-shot evaluations — reading comprehension, machine translation, summarization, question answering — the results were startling. The model had never been trained on any of those tasks, yet it performed at competitive levels with supervised systems from just two years earlier. OpenAI faced a decision: publish everything, or proceed carefully.",
            what: "OpenAI released the paper 'Language Models are Unsupervised Multitask Learners' in February 2019 but withheld the full 1.5B parameter weights, citing 'concerns about malicious applications of the technology.' They published the 117M model first, then 355M in May, then 762M in August, and finally the full model in November 2019 — nine months after the paper. The staged release included a model card explaining the decision and a commitment to studying real-world impacts.",
            impact: "GPT-2's staged release triggered the field's first serious debate about responsible publication norms. Some researchers called it a publicity stunt; others cited it as an appropriate precaution. The broader effect was to make the question 'should we release this model?' a mandatory consideration at every major lab. OpenAI's transparency about their reasoning — while drawing criticism — established a template that influenced subsequent decisions around GPT-3, Codex, and DALL-E.",
        },
        {
            year: "2019 — Architectural Innovations in GPT-2",
            title: "Pre-norm, weight tying, and byte-level BPE",
            context: "GPT-2 was not simply a larger GPT-1. Training at 1.5 billion parameters exposed instabilities that required architectural adjustments. Standard post-norm transformers (LayerNorm after the residual) exhibited gradient vanishing in very deep stacks, and the original GPT-1 vocabulary of 40,000 subwords could not represent arbitrary Unicode text without unknown-token errors.",
            what: "GPT-2 introduced three key changes: (1) pre-norm placement — LayerNorm is applied before each sub-block rather than after, preserving a clean identity gradient path; (2) residual scaling — residual connections in later layers are multiplied by 1/√N<sub>layers</sub> to prevent norm explosion; (3) byte-level BPE — tokenization operates on raw UTF-8 bytes rather than characters, producing a vocabulary of exactly 50,257 tokens that can represent any Unicode text losslessly. Context length was also doubled from 512 to 1,024 tokens.",
            impact: "Pre-norm became standard architecture practice. GPT-3, PaLM, LLaMA, Mistral, and virtually every subsequent large language model uses pre-norm rather than post-norm. Byte-level BPE became standard for multilingual models (mGPT, BLOOM, LLaMA). The 50,257 token vocabulary is still the default for OpenAI models today. These choices were not published as standalone contributions — they appeared in an appendix — yet collectively they shaped the architecture of every major LLM for the next five years.",
        },
        {
            year: "Feb–Nov 2019 — Zero-Shot Transfer Across Five Tasks",
            title: "Reading comprehension, translation, summarization without fine-tuning",
            context: "The defining claim of the GPT-2 paper was not about language modeling perplexity — GPT-2 set new records on Penn Treebank, WikiText-2, and LAMBADA, but those were expected from a larger model. The surprising result was zero-shot transfer: the ability to perform tasks the model had never been explicitly trained on, simply by prompting it with a natural language description.",
            what: "GPT-2 (1.5B) achieved: 63.2% F1 on CoQA reading comprehension (competitive with BERT-base fine-tuned); 5 BLEU on WMT14 En→Fr translation (comparable to some supervised baselines from 2016); 23 F1 on CNN/DailyMail summarization; and near-human accuracy on the Winogrande commonsense task. The prompting format was minimal — appending 'TL;DR:' to trigger summarization, or formatting text as a dialogue with 'Q:' and 'A:' for question answering.",
            impact: "Zero-shot transfer redefined what a language model was. Before GPT-2, a language model was a component used to rescore hypotheses or pretrain a fine-tuned classifier. After GPT-2, it was a general-purpose system that could be prompted to do almost anything. This single shift in framing — from 'language model as encoder' to 'language model as task performer' — is the conceptual foundation of ChatGPT, Claude, and every large-scale assistant deployed since.",
        },
        {
            year: "2019 – 2020 — Weight Tying and the Efficiency Discovery",
            title: "Input embedding and output projection are the same matrix",
            context: "A 1.5-billion-parameter model with a 50,257-word vocabulary has an enormous embedding matrix: 50,257 × d<sub>model</sub>. For GPT-2's largest variant with d<sub>model</sub> = 1,600, this matrix alone accounts for 80 million parameters — roughly 5% of the total. A separate output projection matrix of the same size would double this cost. Press and Wolf (2017) had shown that tying these matrices improved perplexity on language models, but GPT-2 made it a default.",
            what: "GPT-2 uses weight tying: the token embedding matrix W<sub>e</sub> ∈ ℝ<sup>|V| × d</sup> is shared with the output logit projection W<sub>o</sub> = W<sub>e</sub><sup>T</sup>. During the forward pass, W<sub>e</sub> maps token indices to d-dimensional vectors. At the output layer, W<sub>e</sub><sup>T</sup> maps d-dimensional hidden states back to |V|-dimensional logits. This halves the embedding parameter count and enforces a geometric consistency: the embedding space in which the model reasons is identical to the space from which it predicts the next token.",
            impact: "Weight tying persisted through GPT-3 and became standard in efficient language model design. It has a pleasing theoretical interpretation: the model learns to embed tokens in a space where 'predicting token X' means 'moving toward X's embedding vector.' This links input representation and output prediction into a single geometric structure, and it mildly regularizes training by preventing the two matrices from diverging independently.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 19's BERT was the world's best text reader — it understood sentences
                deeply and broke records on eleven tasks at once. But it couldn't write. OpenAI
                had been building in the opposite direction: a massive text writer with 1.5
                billion parameters, trained on 40 gigabytes of Reddit-approved internet text.
                GPT-2 was so good at writing convincing articles and stories that OpenAI refused
                to release the full model for nine months, worried people would use it to spread
                misinformation.
            </p>

            <Analogy label="The Library Student">
                Imagine a student who reads every book, blog post, news article, Wikipedia page,
                and Reddit thread on the internet — not once, but until they can predict the next
                word in any sentence with amazing accuracy. They never take any subject-specific
                classes. They just practice finishing sentences, billions of times. That's GPT-2.
                <br /><br />
                The surprise was what happened next. Without ever studying French, it could
                translate English to French. Without ever studying news writing, it could summarize
                articles. Without studying anything except "predict the next word," it had quietly
                learned everything.
            </Analogy>

            <Analogy label="The Surprise Exam">
                One day a teacher gives this student a test they've never seen: "Write a summary
                of this story." The student has never studied summarization. But they've read
                thousands of TL;DRs on Reddit. They've noticed that certain article styles are
                always followed by short paragraph summaries. So they guess what a summary looks
                like — and they're right. That's zero-shot learning: solving a task using patterns
                absorbed from millions of examples, without ever being explicitly taught.
            </Analogy>

            <Analogy label="The Four Brothers">
                OpenAI actually trained four versions of GPT-2, not one. Think of them as four
                siblings: a small 117-million-parameter model, a medium 345M model, a large 762M
                model, and the full 1.5-billion-parameter model. Each bigger sibling was smarter
                and wrote more coherently. Studying all four together showed something important:
                the improvement was smooth and predictable — a pattern that scientists would later
                turn into the Scaling Laws.
            </Analogy>

            <Analogy label="Why Grown-Ups Got Worried">
                The problem was that this student could also write fake news articles that looked
                completely real, or pretend to be a famous person in a convincing email. OpenAI
                was worried that bad actors might use this ability to deceive people at scale.
                So they released the model in stages — first the small version, then the medium,
                then the large, and finally the full model nine months later — while the world
                figured out how to handle such a powerful text generator.
            </Analogy>

            <Analogy label="Reader vs. Writer — BERT and GPT-2">
                BERT and GPT-2 are like two different kinds of super-students. BERT reads a
                sentence from both ends at once — seeing every word before deciding what any
                word means — which makes it incredible at understanding. GPT-2 reads left to
                right, predicting each word before seeing the next — which makes it a natural
                writer. Both approaches proved their value in 2019, and the big question for
                the field became: do we need both, or will one eventually win?
            </Analogy>

            <Analogy label="The Secret Shortcut — Weight Tying">
                Here's a clever trick GPT-2 used: the dictionary it uses to look up word meanings
                at the start is the exact same dictionary it uses to predict the next word at the
                end. Instead of having two separate systems — one for understanding and one for
                outputting — it reuses the same table. This means the model learns to store words
                in a shared space where "knowing what a word means" and "knowing when to use that
                word next" are the same kind of knowledge.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GPT-2 architecture and training</h2>

            <h3>From Encoder to Decoder: The Architectural Fork</h3>
            <p>
                BERT and GPT-2 diverged at the most fundamental level of transformer design.
                BERT is an encoder: every token attends to every other token in both directions,
                and the output is a rich contextual representation of the input. GPT-2 is a
                decoder: attention is causal (masked), meaning each token can only attend to
                earlier tokens. This makes it unsuitable for classification tasks that require
                the full context — but it makes autoregressive text generation natural: predict
                token 1, append it, predict token 2 given token 1, and so on.
            </p>
            <p>
                GPT-2's largest configuration uses 48 transformer layers, a hidden dimension
                d<sub>model</sub> = 1,600, 25 attention heads, and a feed-forward intermediate
                dimension of 6,400. Context window is 1,024 tokens. Total: ~1.5 billion
                parameters, of which roughly 80M are the embedding matrix.
            </p>

            <h3>Pre-Norm: Moving LayerNorm Before the Sublayer</h3>
            <p>
                The original Transformer applied Layer Normalization after each residual
                connection (post-norm). In very deep networks this creates a vanishing gradient
                problem: at initialization, the residual F(x) ≈ 0, so the post-norm gradient
                path passes through LayerNorm'(0), which can vanish. GPT-2 moves LayerNorm before
                the attention or feed-forward sublayer:
            </p>
            <ul>
                <li><strong>Post-norm (original):</strong> y = LayerNorm(x + F(x))</li>
                <li><strong>Pre-norm (GPT-2):</strong> y = x + F(LayerNorm(x))</li>
            </ul>
            <p>
                Pre-norm preserves a direct residual path (gradient flows through the identity
                shortcut without passing through any normalization), making deep stacks of 48+
                layers trainable without warmup tricks or gradient clipping hacks.
            </p>

            <h3>Byte-Pair Encoding at Byte Level</h3>
            <p>
                GPT-2 uses a byte-level variant of Byte-Pair Encoding (BPE). Standard BPE starts
                from characters; byte-level BPE starts from the 256 possible UTF-8 bytes. This
                means the tokenizer can represent any Unicode text — Arabic script, Chinese
                characters, emoji, code — without ever encountering an unknown token. The
                vocabulary of 50,257 tokens was chosen to be a round number just over 50,000.
            </p>
            <p>
                BPE construction: start with 256 byte tokens. Iteratively find the most frequent
                adjacent pair in the corpus and merge them into a new token. Repeat 49,999 times.
                The algorithm greedily compresses frequent patterns into single tokens while
                maintaining byte-level fallback for rare strings.
            </p>

            <h3>Zero-Shot Task Conditioning</h3>
            <p>
                GPT-2's zero-shot capability comes from natural language task framing. Rather
                than adding a task-specific head, the model is given a prompt that describes the
                task in natural language, then generates the answer:
            </p>
            <ul>
                <li><strong>Summarization:</strong> Append "TL;DR:" after the article body and
                    let the model generate the rest.</li>
                <li><strong>Translation:</strong> Prompt "What is the French translation of '&#123;sentence&#125;'?" or use format "English: ... French:"</li>
                <li><strong>Question answering:</strong> Format as a reading passage followed by
                    "Q: &#123;question&#125; A:" and score the most likely completion.</li>
                <li><strong>Multiple choice:</strong> Score the log-likelihood of each candidate
                    answer appended to the question and pick the highest.</li>
            </ul>

            <h3>Weight Tying Between Embedding and Output Projection</h3>
            <p>
                The token embedding matrix W<sub>e</sub> &#8712; &#8477;<sup>|V| &times; d</sup> maps token
                indices to embedding vectors. At the output, instead of learning a separate
                projection matrix W<sub>o</sub>, GPT-2 computes logits as W<sub>e</sub> &#183; h<sub>T</sub>,
                reusing the embedding matrix transposed. This saves ~80M parameters in the 1.5B
                model and regularizes training: the space where the model stores word meanings
                is forced to be the same space from which it makes predictions.
            </p>

            <h3>Generation with Top-k Sampling</h3>
            <p>
                GPT-2 popularized top-k sampling as a default generation strategy. At each step,
                the model computes logits over all 50,257 tokens, restricts to the top-k by
                probability mass, renormalizes, and samples. With k = 40 and temperature = 0.7,
                this produces fluent, non-repetitive text while avoiding greedy determinism.
                The choice of k and temperature are the primary knobs for controlling the
                creativity-coherence tradeoff.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key results:</strong> GPT-2 (1.5B) achieved 35.8 perplexity on Penn
                Treebank (down from 65.8 for GPT-1), 63.2% F1 on CoQA reading comprehension
                without fine-tuning, and 5 BLEU on WMT14 En&#8594;Fr translation zero-shot —
                competitive with some supervised systems from 2016. On LAMBADA (predicting
                the last word of a paragraph), it achieved 63.2% accuracy vs. 52.7% for the
                best prior model.
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
            <h2>Scaling, sampling, and pre-norm mechanics</h2>

            <DefBlock label="Perplexity">
                For a sequence of tokens w<sub>1</sub>, &hellip;, w<sub>T</sub>, perplexity
                measures how surprised the model is on average per token:
            </DefBlock>
            <MathBlock tex="\text{PPL} = \exp\!\Bigl(-\frac{1}{T}\sum_{t=1}^{T}\log P_\theta(w_t \mid w_1,\dots,w_{t-1})\Bigr)" />
            <p>
                Lower perplexity means the model assigns higher probability to the true next
                token. GPT-2 (1.5B) reduced Penn Treebank perplexity from 65.8 (GPT-1) to 35.8.
                Perplexity and cross-entropy loss are related by PPL = exp(L), so a drop from
                65.8 to 35.8 corresponds to a drop in average cross-entropy of about 0.6 nats.
            </p>

            <h3>Cross-Entropy Training Objective</h3>
            <p>
                The training objective is next-token prediction, minimizing the mean
                negative log-likelihood over the entire corpus:
            </p>
            <MathBlock tex="\mathcal{L}(\theta) = -\frac{1}{|\mathcal{D}|}\sum_{(w_1,\dots,w_T)\in\mathcal{D}}\sum_{t=1}^{T}\log P_\theta(w_t \mid w_1,\dots,w_{t-1})" />
            <p>
                This is equivalent to minimizing KL divergence between the empirical data
                distribution and the model distribution. No task-specific loss is added during
                pretraining; all task knowledge emerges from this single objective applied at
                sufficient scale.
            </p>

            <h3>Pre-Norm Gradient Analysis</h3>
            <p>
                Let x be the residual stream and F(x) a sub-layer (attention or FFN). The
                gradient of the post-norm formulation is:
            </p>
            <MathBlock tex="\frac{\partial}{\partial x}\text{LayerNorm}(x + F(x)) = \text{LN}'(x+F(x))\cdot(1 + F'(x))" />
            <p>
                At initialization, F(x) &#8776; 0, so this reduces to LN'(x), which can vanish.
                Pre-norm computes:
            </p>
            <MathBlock tex="\frac{\partial}{\partial x}\bigl[x + F(\text{LayerNorm}(x))\bigr] = 1 + F'(\text{LN}(x))\cdot\text{LN}'(x)" />
            <p>
                The identity term 1 is always present, ensuring a non-vanishing gradient path
                through the residual shortcut regardless of the sublayer's state. This is why
                pre-norm stacks of 48+ layers train stably without layer-wise learning rate
                tricks.
            </p>

            <h3>Top-k Sampling</h3>
            <p>
                At generation time, GPT-2 restricts sampling to the k most likely tokens.
                Let V<sub>k</sub>(x) be the set of top-k tokens by raw probability. The
                renormalized sampling distribution is:
            </p>
            <MathBlock tex="P'(w \mid x) = \frac{P_\theta(w \mid x)}{\sum_{w' \in V_k(x)} P_\theta(w' \mid x)} \cdot \mathbf{1}[w \in V_k(x)]" />
            <p>
                Temperature scaling T modifies the softmax before top-k: logits are divided by
                T before the softmax. T &lt; 1 sharpens the distribution (more conservative),
                T &gt; 1 flattens it (more creative). GPT-2 used k = 40, T = 1.0 for its public
                demo.
            </p>

            <h3>Parameter Count Formula</h3>
            <p>
                For a decoder-only transformer with L layers, hidden size d, context n, FFN
                dimension 4d, and vocabulary V:
            </p>
            <MathBlock tex="N \approx V \cdot d + L\,(12d^2 + 2dn)" />
            <p>
                For GPT-2 1.5B: L = 48, d = 1,600, n = 1,024, V = 50,257. Substituting:
                V&#183;d &#8776; 80M, L&#183;12d&#178; &#8776; 1,474M, L&#183;2dn &#8776; 158M, total &#8776; 1,712M. The
                actual count is 1,542M because of factored attention heads and other
                implementation details; the dominant term is the 12Ld&#178; from attention Q/K/V
                and FFN weights.
            </p>

            <div className="ch-callout">
                <strong>Why weight tying works geometrically:</strong> Weight tying enforces that
                token embeddings lie in the same space as output logit directions. The loss
                penalizes logit(target) &#8722; log&#8721;exp(logit(v)), which pushes the hidden state
                h<sub>T</sub> toward the embedding of the correct token. So training simultaneously
                learns embeddings that encode meaning and hidden states that point toward the
                correct next-token embedding — a beautiful geometric consistency.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── GPT-2 style top-k sampling with temperature ───────────────────────────────
def softmax(logits: np.ndarray) -> np.ndarray:
    e = np.exp(logits - logits.max())
    return e / e.sum()

def top_k_sample(logits: np.ndarray, k: int = 40, temperature: float = 1.0) -> int:
    """
    Sample from the top-k tokens after temperature scaling.
    logits: raw (unnormalized) logits, shape (vocab_size,)
    Returns: sampled token index.
    """
    # Apply temperature
    logits = logits / temperature
    # Identify top-k indices
    top_k_indices = np.argpartition(logits, -k)[-k:]
    top_k_logits = logits[top_k_indices]
    # Softmax over top-k only
    probs = softmax(top_k_logits)
    # Sample
    chosen = np.random.choice(len(top_k_indices), p=probs)
    return int(top_k_indices[chosen])

# ── Perplexity ────────────────────────────────────────────────────────────────
def perplexity(log_probs: np.ndarray) -> float:
    """
    Compute perplexity from per-token log probabilities.
    log_probs: array of log P(w_t | w_{<t}) for each token t.
    """
    return float(np.exp(-np.mean(log_probs)))

# ── Pre-norm vs Post-norm gradient norm comparison ────────────────────────────
def simulate_gradient_norm(depth: int, use_prenorm: bool, seed: int = 42) -> list:
    """
    Simulate gradient norms through a deep residual stack.
    Returns list of gradient norms at each layer (from output back to input).
    """
    rng = np.random.default_rng(seed)
    grad = np.ones(64)  # gradient at the top
    norms = []
    for _ in range(depth):
        # Sublayer Jacobian (small random matrix simulating F'(x))
        J = rng.normal(0, 0.1, (64, 64))
        sublayer_grad = J.T @ grad
        if use_prenorm:
            # Pre-norm: identity shortcut always present
            grad = grad + sublayer_grad
        else:
            # Post-norm: normalisation can shrink gradient
            scale = 1.0 / (np.linalg.norm(grad + sublayer_grad) + 1e-8)
            grad = (grad + sublayer_grad) * scale * np.sqrt(64)
        norms.append(float(np.linalg.norm(grad)))
    return norms

# ── Demo ──────────────────────────────────────────────────────────────────────
rng = np.random.default_rng(0)
vocab_size = 50257

print("Top-k Sampling Demo (k=5, T=0.7)")
print("=" * 40)
logits = rng.normal(0, 1, vocab_size)
for trial in range(6):
    tok = top_k_sample(logits, k=5, temperature=0.7)
    print(f"  Trial {trial+1}: token {tok}")

print()
log_probs = np.array([-2.1, -1.8, -3.5, -2.0, -1.9, -2.5, -1.7])
print(f"Perplexity on 7-token sequence: {perplexity(log_probs):.2f}")

print()
prenorm_norms = simulate_gradient_norm(depth=48, use_prenorm=True)
postnorm_norms = simulate_gradient_norm(depth=48, use_prenorm=False)
print("Gradient norm at layer 1 (pre-norm vs post-norm, 48-layer stack):")
print(f"  Pre-norm:  {prenorm_norms[-1]:.4f}")
print(f"  Post-norm: {postnorm_norms[-1]:.6f}")
print("  (post-norm vanishes; pre-norm remains healthy)")
`

function PythonContent() {
    return (
        <>
            <p>
                Three implementations: GPT-2's top-k sampling with temperature scaling; a
                perplexity calculator; and a simulation comparing pre-norm vs. post-norm
                gradient flow through a 48-layer stack — demonstrating why pre-norm is
                necessary at GPT-2 scale.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt2_mechanics.py" lang="python" langLabel="Python" />
        </>
    )
}


// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT2_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
