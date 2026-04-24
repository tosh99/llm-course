import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

function HistoryTab() {
    return (
        <div className="ch-timeline">
            <div className="ch-tl-item">
                <div className="ch-tl-year">2017</div>
                <div className="ch-tl-title">Bojanowski, Grave, Joulin & Mikolov — Enriching Word Vectors with Subword Information</div>
                <div className="ch-tl-section-label">The limitation of whole-word embeddings</div>
                <div className="ch-tl-body">Word2Vec and GloVe treat each word as an atomic unit. "play", "playing", and "played" are three unrelated vectors with no shared parameters, despite being morphologically related. Worse, any word not seen during training — a typo, a new product name, a rare technical term — gets no representation at all. For morphologically rich languages (Finnish, Turkish, Arabic, Hungarian), this is catastrophic: a typical word may have dozens of valid inflected forms.</div>
                <div className="ch-tl-section-label">What was introduced</div>
                <div className="ch-tl-body">Facebook AI Research (Piotr Bojanowski, Edouard Grave, Armand Joulin, Tomas Mikolov) represented each word as the sum of its character n-gram vectors. The word "where" (n=3) decomposes into: &lt;wh, whe, her, ere, re&gt; with boundary markers. Each n-gram has its own vector. The word vector is the sum of all its n-gram vectors.</div>
                <div className="ch-tl-section-label">Why it mattered</div>
                <div className="ch-tl-body ch-tl-impact">FastText improved on Word2Vec for morphologically rich languages, handled OOV words gracefully (sum n-gram vectors for any word), and influenced tokenization design. The subword idea directly shaped Byte-Pair Encoding (BPE) — the tokenizer used by GPT, BERT, and all modern LLMs.</div>
            </div>
            <div className="ch-tl-item">
                <div className="ch-tl-year">2018</div>
                <div className="ch-tl-title">BPE Tokenization Replaces Character N-grams in LLMs</div>
                <div className="ch-tl-section-label">The evolution</div>
                <div className="ch-tl-body">FastText used fixed character n-gram ranges (3-6). Byte-Pair Encoding (Sennrich et al., 2016) learned data-driven subword units by iteratively merging the most frequent character pairs in the training corpus. This produced variable-length subword tokens that are more efficient and principled than fixed n-grams.</div>
                <div className="ch-tl-section-label">Why it mattered</div>
                <div className="ch-tl-body ch-tl-impact">BPE tokenization is now universal in LLMs: GPT-2 uses BPE, BERT uses WordPiece (similar), T5 uses SentencePiece. FastText's insight — represent words as sub-unit combinations — lives on in every tokenizer, and thus in every modern language model.</div>
            </div>
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Reading words by their parts</h2>
            <Analogy label="The OOV problem">
                Word2Vec is like a dictionary: if a word is not listed, you get nothing. FastText is like knowing how to read phonetically: even if you have never seen "supercalifragilistic" before, you recognise familiar syllables — "super", "fragile", "istic". FastText represents words as combinations of their letter-chunks, so any new word can be approximated.
            </Analogy>
            <Analogy label="N-grams as Lego bricks">
                Break the word "playing" into 3-letter chunks: "pla", "lay", "ayi", "yin", "ing". Each chunk has its own vector (a location in meaning-space). "Playing" is the sum of all those chunk-locations. "Played" shares "pla", "lay" with "playing" — so they end up nearby automatically, with no special rule needed.
            </Analogy>
            <Analogy label="Bridge to modern AI">
                This idea — that words are made of meaningful sub-parts — is now used in every major AI language model. When you type into ChatGPT, your text is broken into "tokens" (subwords) before the model ever sees it. FastText was an early, simple version of this idea.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Subword representations</h2>
            <p>For word w, let G_w be the set of character n-grams of w (with n in [n_min, n_max]) including boundary markers. Each n-gram g has a vector z_g. The score between word w and context word c is:</p>
            <MathBlock tex="s(w, c) = \sum_{g \in \mathcal{G}_w} z_g^\top v_c" />
            <p>This replaces the simple dot product w · v_c in skip-gram. Training optimises the same negative sampling objective as Word2Vec, but gradients flow into each n-gram vector for every word containing that n-gram.</p>

            <h3>OOV handling</h3>
            <p>For a word not in the training vocabulary, compute its n-grams and sum their trained vectors:</p>
            <MathBlock tex="v_{\text{OOV}} = \frac{1}{|\mathcal{G}_w|}\sum_{g \in \mathcal{G}_w} z_g" />
            <p>This always produces a meaningful representation based on morphological similarity to known words. "Microwave" unseen? "micro" and "wave" and "rave" n-grams are known.</p>

            <h3>Typical settings</h3>
            <div className="ch-callout">
                <strong>n_min = 3, n_max = 6</strong>: covers most meaningful morphemes without explosion in n-gram count.<br /><br />
                <strong>Bucket size = 2M</strong>: n-grams are hashed into 2M buckets to cap memory. Hash collisions are acceptable — rare n-grams share a bucket with an occasional false match.<br /><br />
                <strong>Final vector = v_w + mean(z_g)</strong>: word and n-gram vectors are trained jointly; the final representation combines both.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>FastText objective and hash-based vocabulary</h2>
            <DefBlock label="Hashed N-gram Table">
                With n_min=3 and n_max=6, a word of length L has Σ_{"{n=3}"}^6 (L−n+1) n-grams. For a vocabulary of 1M words, this could be billions of unique n-grams. FastText hashes all n-grams into a fixed bucket table of size B (typically 2M): h(g) = hash(g) mod B. Multiple n-grams share buckets, but memory is bounded regardless of vocabulary size.
            </DefBlock>

            <MathBlock tex="\text{score}(w, c) = \sum_{g \in \mathcal{G}_w} z_{h(g)}^\top v_c" />

            <h3>Negative sampling loss</h3>
            <MathBlock tex="\mathcal{L} = \log \sigma(s(w,c)) + \sum_{k=1}^K \mathbb{E}_{n_k \sim P_n}[\log \sigma(-s(n_k, c))]" />
            <p>Identical in form to Word2Vec negative sampling; the only change is that s(w,c) now sums over n-gram vectors instead of using a single word vector.</p>

            <h3>Implicit parameter sharing</h3>
            <p>Words sharing a suffix (e.g. "-ing", "-tion", "-ness") share the gradient updates from all those n-gram positions. This creates implicit regularisation: rare words with familiar morphology benefit from the statistics of their morphological relatives.</p>
        </>
    )
}

const PY_CODE = `import numpy as np

def get_ngrams(word: str, min_n: int = 3, max_n: int = 6) -> list:
    w = f"<{word}>"
    ngrams = []
    for n in range(min_n, max_n + 1):
        for i in range(len(w) - n + 1):
            ngrams.append(w[i:i+n])
    return ngrams

# Demonstrate morphological overlap
words = ["play", "playing", "played", "player", "replay", "display"]
print("N-gram sets (n=3,4):")
ngram_sets = {}
for w in words:
    ngram_sets[w] = set(get_ngrams(w, 3, 4))
    print(f"  {w:10s}: {sorted(ngram_sets[w])}")

print("\\nShared n-gram counts:")
for i, w1 in enumerate(words):
    for w2 in words[i+1:]:
        shared = len(ngram_sets[w1] & ngram_sets[w2])
        if shared > 0:
            print(f"  {w1} ∩ {w2}: {shared} shared n-grams")

# ── OOV representation ────────────────────────────────────────────────────────
DIM     = 16
BUCKETS = 1000
np.random.seed(42)
ngram_table = np.random.randn(BUCKETS, DIM) * 0.01  # trained vectors

def hash_ngram(s: str, buckets: int = BUCKETS) -> int:
    h = 5381
    for c in s:
        h = ((h * 33) ^ ord(c)) & 0xFFFFFFFF
    return h % buckets

def get_word_vector(word: str) -> np.ndarray:
    ngrams = get_ngrams(word)
    vecs   = [ngram_table[hash_ngram(g)] for g in ngrams]
    return np.mean(vecs, axis=0) if vecs else np.zeros(DIM)

# OOV words get vectors based on their n-grams
oov_words = ["microservices", "unplayable", "anticlimactic"]
print("\\nOOV word vectors (first 4 dims):")
for w in oov_words:
    v = get_word_vector(w)
    print(f"  {w:20s}: [{', '.join(f'{x:.3f}' for x in v[:4])}...]")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="fasttext.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>FastText to BPE:</strong> FastText uses fixed-width character n-grams. BPE (Byte-Pair Encoding) learns data-driven variable-length subword merges. BPE is more efficient and is now the standard tokenizer for GPT, BERT, and LLaMA.
            </div>
        </>
    )
}



export const FASTTEXT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
