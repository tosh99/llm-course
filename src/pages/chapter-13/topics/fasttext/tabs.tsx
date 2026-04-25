import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Subword information and the OOV problem</h2>
            <p>
                FastText was developed by Facebook AI Research (FAIR) between 2016 and 2017. It addressed a fundamental limitation of both Word2Vec and GloVe: both treat each word as an atomic, indivisible unit, assigning it a single vector regardless of the word's internal structure. This means "play," "playing," "played," and "player" are four completely separate entities with no shared parameters — and any word not seen during training (a typo, a rare technical term, a proper noun) gets no representation at all.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013–2016</div>
                    <div className="ch-tl-section-label">The Problem</div>
                    <div className="ch-tl-title">Whole-Word Embeddings and Their Failure Modes</div>
                    <div className="ch-tl-body">
                        Word2Vec and GloVe had two related failure modes. First: morphological blindness. "Play," "plays," "playing," "played," "player," "replay," and "display" are represented as seven completely independent vectors with no shared parameters, despite sharing morphological roots that carry semantic relationships. For morphologically rich languages — Turkish, Finnish, Arabic, Hungarian — this is catastrophic. A Turkish verb may have hundreds of valid inflected forms, most of which will never appear in training data.
                        <br /><br />
                        Second: the out-of-vocabulary (OOV) problem. Any word not seen during training gets no representation at all. In practice, technical documents, social media, and code are full of words that don't appear in standard training corpora: product names, abbreviations, new scientific terminology, slang, and misspellings. A word embedding system that fails silently on 10–20% of real-world text is fundamentally limited.
                    </div>
                    <div className="ch-tl-impact">Context: Morphological richness and OOV words were unsolvable with whole-word embeddings; affected all downstream NLP tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Text Classification</div>
                    <div className="ch-tl-title">FastText Classifier — Joulin et al.</div>
                    <div className="ch-tl-body">
                        Armand Joulin, Edouard Grave, Piotr Bojanowski, and Tomas Mikolov published "Bag of Tricks for Efficient Text Classification" (2016), introducing a simple but highly effective text classifier built on top of averaged word embeddings. The FastText classifier achieved competitive accuracy with deep CNNs and LSTMs at a fraction of the computational cost — often training in seconds rather than hours.
                        <br /><br />
                        The key trick: represent each text as an average of its n-gram embeddings (not just word embeddings). Character n-grams at the word level capture morphological and phonetic similarity. The classifier could handle millions of classes (useful for large-scale product categorization, language identification) and trained 10,000× faster than complex neural architectures while achieving 1–2% lower accuracy — a favorable trade-off for many production applications.
                    </div>
                    <div className="ch-tl-impact">Impact: Made text classification practical at scale; n-gram features in averaging established the value of subword information for classification</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Enriching Word Vectors with Subword Information — Bojanowski et al.</div>
                    <div className="ch-tl-body">
                        Piotr Bojanowski, Edouard Grave, Armand Joulin, and Tomas Mikolov published "Enriching Word Vectors with Subword Information" (TACL 2017), extending the Skip-gram model to use character n-gram embeddings. Each word is represented as the sum of its character n-gram vectors, where n-grams include boundary markers (&lt;, &gt;) to distinguish word-initial, word-internal, and word-final positions.
                        <br /><br />
                        For "where" (n=3): decompose into &lt;wh, whe, her, ere, re&gt;, plus the whole-word token &lt;where&gt;. The word embedding is the sum of all these n-gram embeddings. Each n-gram is a vector trained jointly with the rest. Words sharing morphological structure (share, sharing, shared, shareholder) share n-gram vectors, providing implicit parameter sharing and regularization.
                        <br /><br />
                        The results: large improvements over Word2Vec and GloVe on morphologically rich languages (Czech, German, Turkish) and competitive performance on English. OOV words are handled naturally: compute the n-grams of any unseen word and sum their trained vectors. The resulting embedding is semantically meaningful based on morphological similarity to known words.
                    </div>
                    <div className="ch-tl-impact">Impact: Solved OOV problem; major gains for morphologically rich languages; n-gram hashing enabled efficient memory-bounded training</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">BPE Tokenization Replaces Fixed N-grams in LLMs</div>
                    <div className="ch-tl-body">
                        FastText used fixed character n-gram ranges (3–6 characters). Byte-Pair Encoding (Sennrich et al., 2016), originally developed for neural machine translation, learned data-driven subword units by iteratively merging the most frequent character pairs in the training corpus. The resulting vocabulary of variable-length subword tokens is more efficient than fixed n-grams — common words remain whole tokens, rare words are split into meaningful pieces.
                        <br /><br />
                        GPT-2 uses BPE, BERT uses WordPiece (a similar algorithm), and T5 uses SentencePiece. FastText's insight — represent words as combinations of subunits — lives on in every modern tokenizer. The key difference is that BPE learns the subword vocabulary from data rather than using all possible fixed-length character substrings. This produces a more compact and semantically meaningful vocabulary.
                    </div>
                    <div className="ch-tl-impact">Impact: FastText's subword idea directly shaped all modern LLM tokenizers; BPE superseded fixed n-grams but inherited the same core insight</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016–present</div>
                    <div className="ch-tl-section-label">Multilingual Impact</div>
                    <div className="ch-tl-title">FastText for 157 Languages</div>
                    <div className="ch-tl-body">
                        Facebook AI Research released pre-trained FastText word vectors for 157 languages, trained on Wikipedia. For many languages with limited NLP resources, these were the first available word embeddings of any quality. The subword approach meant that FastText could produce reasonable embeddings even for languages where individual words are rarely seen — particularly important for agglutinative languages (Turkish, Finnish, Hungarian, Swahili) where morphological productivity generates enormous vocabularies.
                        <br /><br />
                        FastText also released a language identification model that identifies 176 languages in a single character n-gram model — achieving state-of-the-art accuracy in milliseconds. This became the de facto standard for language identification in production NLP pipelines.
                    </div>
                    <div className="ch-tl-impact">Impact: Pre-trained vectors for 157 languages; enabled NLP research in low-resource languages; language identification model widely adopted in production</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>FastText to modern tokenizers:</strong> FastText used fixed character n-gram ranges (3–6). BPE learned data-driven variable-length subword merges. BPE is more efficient and is now the standard tokenizer for GPT, BERT, and LLaMA. But the fundamental insight — that words are made of meaningful sub-parts that should share representations — originated with FastText and shapes every modern NLP system.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Reading words by their parts</h2>

            <Analogy label="The OOV Problem — When the Dictionary Fails">
                Word2Vec is like a dictionary: if a word is not listed, you get nothing. FastText is like knowing how to read phonetically: even if you have never seen "supercalifragilistic" before, you recognize familiar syllables — "super," "fragile," "istic." FastText represents words as combinations of their letter-chunks, so any new word can be approximated.
                <br /><br />
                This matters enormously in practice. Social media is full of misspellings and abbreviations. Scientific papers introduce new terminology. Product catalogs have brand names. All of these are "unknown words" to Word2Vec — but FastText can still produce a meaningful embedding based on the familiar pieces they contain.
            </Analogy>

            <Analogy label="N-grams as Lego Bricks">
                Break the word "playing" into 3-letter chunks: "pla," "lay," "ayi," "yin," "ing." Each chunk has its own vector (a location in meaning-space). "Playing" is the sum of all those chunk-locations.
                <br /><br />
                "Played" shares "pla," "lay" with "playing" — so they end up nearby automatically, with no special rule needed. "Replay" shares "lay" and "pla" with "play" — again, nearby. The model doesn't need to be told that play/playing/played are related; it discovers this automatically through the shared n-gram vectors.
            </Analogy>

            <Analogy label="Morphologically Rich Languages — Turkish is Extreme">
                In English, a verb has a handful of forms: play, plays, playing, played. In Turkish, a single verb root can generate hundreds of valid forms through suffixes that encode tense, person, negation, possibility, causation, and more. For Word2Vec, each Turkish word form is a separate entity — most will never appear in training data.
                <br /><br />
                FastText handles this elegantly: all those Turkish verb forms share character n-grams from the root. Even if a specific form appears only once (or never) in training, its embedding is meaningful because the root n-grams have been seen thousands of times in other word forms.
            </Analogy>

            <Analogy label="Bridge to Modern AI">
                This idea — that words are made of meaningful sub-parts — is now used in every major AI language model. When you type into ChatGPT, your text is broken into "tokens" (subwords) before the model ever sees it. FastText was an early, simple version of this idea.
                <br /><br />
                The modern version (Byte-Pair Encoding, used by GPT-4) learns which sub-parts to use from data, rather than using fixed-length character chunks. But the core insight is the same: represent words by their parts, not as atomic wholes.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Subword representations and hashed n-gram vocabularies</h2>

            <h3>The FastText Extension of Skip-gram</h3>
            <p>
                For word w, let G<sub>w</sub> be the set of character n-grams of w (with n in [n_min, n_max]) including boundary markers &lt; and &gt;. Each n-gram g has a vector z<sub>g</sub>. The score between word w and context word c is:
            </p>
            <MathBlock tex="s(w, c) = \sum_{g \in \mathcal{G}_w} z_g^\top v_c" />
            <p>This replaces the simple dot product v<sub>w</sub>·v<sub>c</sub> in Skip-gram. Training optimizes the same negative sampling objective as Word2Vec, but gradients flow into each n-gram vector for every word containing that n-gram.</p>

            <h3>OOV Handling</h3>
            <p>For a word not in the training vocabulary, compute its n-grams and average their trained vectors:</p>
            <MathBlock tex="v_{\text{OOV}} = \frac{1}{|\mathcal{G}_w|}\sum_{g \in \mathcal{G}_w} z_g" />
            <p>This always produces a meaningful representation based on morphological similarity to known words. "Microwave" unseen? The n-grams "micro," "wave," "icro," "cro," "rav," "ave" and others are likely known from related words.</p>

            <h3>Hashed N-gram Table</h3>
            <p>With n_min=3 and n_max=6, a word of length L has Σ(L−n+1) n-grams. For a vocabulary of 1M words, this could be billions of unique n-grams. FastText hashes all n-grams into a fixed bucket table of size B (typically 2M):</p>
            <MathBlock tex="\text{score}(w, c) = \sum_{g \in \mathcal{G}_w} z_{h(g)}^\top v_c \quad \text{where } h(g) = \text{hash}(g) \bmod B" />
            <p>Multiple n-grams may share buckets (hash collisions), but memory is bounded regardless of vocabulary size — a crucial property for production use.</p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Typical settings: n_min = 3, n_max = 6, Bucket size = 2M.</strong> Covers most meaningful morphemes without explosion in n-gram count. Hash collisions are acceptable — rare n-grams share a bucket with an occasional false match, which acts as light regularization. Final embedding = word vector + mean(n-gram vectors), combining whole-word and subword signals.
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
            <h2>FastText objective, hash-based vocabulary, and implicit sharing</h2>

            <DefBlock label="FastText N-gram Hashing (Bojanowski et al., 2017)">
                With n_min=3 and n_max=6, a word of length L has Σ<sub>n=3</sub><sup>6</sup>(L−n+1) n-grams. For a vocabulary of 1M words, this could be billions of unique n-grams. FastText hashes all n-grams into a fixed bucket table of size B (typically 2M): h(g) = hash(g) mod B. Multiple n-grams share buckets, but memory is bounded regardless of vocabulary size.
            </DefBlock>

            <MathBlock tex="\text{score}(w, c) = \sum_{g \in \mathcal{G}_w} z_{h(g)}^\top v_c" />

            <h3>Negative Sampling Loss</h3>
            <MathBlock tex="\mathcal{L} = \log \sigma(s(w,c)) + \sum_{k=1}^K \mathbb{E}_{n_k \sim P_n}[\log \sigma(-s(n_k, c))]" />
            <p>Identical in form to Word2Vec negative sampling; the only change is that s(w,c) now sums over n-gram vectors instead of using a single word vector. Gradients flow back to each n-gram vector in G<sub>w</sub>.</p>

            <h3>Implicit Parameter Sharing</h3>
            <p>Words sharing a suffix (e.g., "-ing," "-tion," "-ness") share gradient updates from all those n-gram positions. This creates implicit regularization: rare words with familiar morphology benefit from the statistics of their morphological relatives. Formally, the gradient update for n-gram g is:</p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial z_g} = \sum_{w : g \in \mathcal{G}_w} \frac{\partial \mathcal{L}_w}{\partial s(w,c)} \cdot v_c" />
            <p>The sum is over all words containing n-gram g — so every occurrence of the suffix "-ing" in any word contributes to the gradient of the "-ing" n-gram vector.</p>

            <div className="ch-callout">
                <strong>FastText vs BPE:</strong> FastText uses fixed-width character n-grams (3–6). BPE (Byte-Pair Encoding) learns data-driven variable-length subword merges. BPE is more efficient and is now the standard tokenizer for GPT, BERT, and LLaMA. But the foundational insight — that words should be represented as compositions of sub-units — originated with FastText and shapes every modern NLP system.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def get_ngrams(word: str, min_n: int = 3, max_n: int = 6) -> list:
    """Get character n-grams with boundary markers."""
    w = f"<{word}>"
    ngrams = []
    for n in range(min_n, max_n + 1):
        for i in range(len(w) - n + 1):
            ngrams.append(w[i:i+n])
    return ngrams

# ── Demonstrate morphological overlap ─────────────────────────────────────────
words = ["play", "playing", "played", "player", "replay", "display"]
print("=" * 60)
print("N-gram sets (n=3,4) showing morphological overlap:")
print("=" * 60)
ngram_sets = {}
for w in words:
    ngram_sets[w] = set(get_ngrams(w, 3, 4))
    print(f"  {w:10s}: {sorted(ngram_sets[w])[:6]}...")  # show first 6

print()
print("Shared n-gram counts:")
for i, w1 in enumerate(words):
    for w2 in words[i+1:]:
        shared = len(ngram_sets[w1] & ngram_sets[w2])
        if shared > 0:
            common = sorted(ngram_sets[w1] & ngram_sets[w2])[:3]
            print(f"  {w1} intersect {w2}: {shared} shared -> e.g. {common}")

# ── OOV representation ────────────────────────────────────────────────────────
print()
print("OOV handling via n-gram composition:")
print("-" * 40)

DIM     = 16
BUCKETS = 1000
np.random.seed(42)
ngram_table = np.random.randn(BUCKETS, DIM) * 0.01  # would be trained in practice

def hash_ngram(s: str, buckets: int = BUCKETS) -> int:
    h = 5381
    for c in s:
        h = ((h * 33) ^ ord(c)) & 0xFFFFFFFF
    return h % buckets

def get_word_vector(word: str) -> np.ndarray:
    ngrams = get_ngrams(word)
    if not ngrams:
        return np.zeros(DIM)
    vecs = [ngram_table[hash_ngram(g)] for g in ngrams]
    return np.mean(vecs, axis=0)

# OOV words get vectors based on their n-grams
oov_words = ["microservices", "unplayable", "anticlimactic", "bioengineering"]
print("OOV word vectors (first 4 dims) -- computed from n-gram hashes:")
for w in oov_words:
    v = get_word_vector(w)
    print(f"  {w:22s}: [{', '.join(f'{x:.3f}' for x in v[:4])}...]")

# ── Cosine similarity between morphologically related OOV words ─────────────
print()
print("Cosine similarity between OOV word pairs:")
def cosine(a, b):
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(a @ b / (na * nb))

pairs = [
    ("playing", "played"),
    ("playing", "display"),
    ("playing", "elephant"),
    ("microservice", "microservices"),
]
for w1, w2 in pairs:
    v1, v2 = get_word_vector(w1), get_word_vector(w2)
    sim = cosine(v1, v2)
    print(f"  sim({w1:15s}, {w2:15s}) = {sim:.4f}")

# ── N-gram count statistics ────────────────────────────────────────────────────
print()
print("N-gram count per word (n=3..6):")
for w in ["go", "going", "playing", "antiestablishment"]:
    ngrams = get_ngrams(w)
    print(f"  {w:20s}: {len(ngrams)} n-grams")
`

function PythonContent() {
    return (
        <>
            <p>
                Character n-gram extraction showing morphological overlap between related words, OOV representation via n-gram composition, cosine similarity between OOV word pairs, and n-gram count statistics. Demonstrates the core FastText idea without requiring a trained model.
            </p>
            <CodeBlock code={PY_CODE} filename="fasttext_demo.py" lang="python" langLabel="Python" />
        </>
    )
}



export const FASTTEXT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
