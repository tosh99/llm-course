import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Dense vectors that capture meaning</h2>
            <p>
                Word2Vec is one of the most consequential papers in the history of natural language
                processing. Published by Tomáš Mikolov and colleagues at Google in 2013, it
                demonstrated that neural networks could learn word representations so rich that
                you could perform arithmetic on them: king − man + woman ≈ queen. This single
                demonstration changed the trajectory of NLP forever.
            </p>

            <div className="ch10-timeline">
                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">1957</div>
                    <div className="ch10-tl-section-label">Theoretical Foundation</div>
                    <div className="ch10-tl-title">The Distributional Hypothesis — Harris</div>
                    <div className="ch10-tl-body">
                        Zellig Harris articulated the distributional hypothesis in 1954: "words that
                        occur in the same contexts tend to have similar meanings." John Firth later
                        rephrased it as "you shall know a word by the company it keeps." This principle
                        is the foundation of every word embedding method — Word2Vec, GloVe, and FastText
                        all operationalize the idea that context encodes meaning.
                    </div>
                    <div className="ch10-tl-impact">Impact: The theoretical basis for all distributional word representations</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2003</div>
                    <div className="ch10-tl-section-label">Neural Precursor</div>
                    <div className="ch10-tl-title">Bengio et al. Neural Language Model</div>
                    <div className="ch10-tl-body">
                        Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin published
                        "A Neural Probabilistic Language Model," which jointly learned word embeddings
                        and a language model. The embeddings were a byproduct — the main goal was a
                        better language model. But Bengio et al. showed that the network learned
                        meaningful vector representations: similar words had similar vectors.
                        The training was far too slow for large vocabulary (weeks on millions of words).
                    </div>
                    <div className="ch10-tl-impact">Impact: First neural word embeddings; demonstrated the concept but not yet at scale</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2013 Jan</div>
                    <div className="ch10-tl-section-label">Breakthrough</div>
                    <div className="ch10-tl-title">Word2Vec — Mikolov et al.</div>
                    <div className="ch10-tl-body">
                        Tomáš Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean published "Efficient
                        Estimation of Word Representations in Vector Space." The key insight: train a
                        shallow (not deep) neural network with a simplified objective — either predict
                        context words from a center word (Skip-gram) or predict the center word from
                        context words (CBOW). Remove the hidden layer nonlinearity. The result: training
                        was 100× faster than Bengio's LM, and on a corpus of 1 billion words. The
                        famous semantic arithmetic demo (king−man+woman≈queen) captured the world's
                        imagination.
                    </div>
                    <div className="ch10-tl-impact">Impact: Made word embeddings practical at scale; king−man+woman=queen became iconic</div>
                </div>

                <div className="ch10-tl-item">
                    <div className="ch10-tl-year">2013 Oct</div>
                    <div className="ch10-tl-section-label">Scaling</div>
                    <div className="ch10-tl-title">Negative Sampling — Mikolov et al.</div>
                    <div className="ch10-tl-body">
                        A second paper "Distributed Representations of Words and Phrases" introduced
                        negative sampling — replacing the expensive softmax over the entire vocabulary
                        (50,000+ words) with a binary classification task: is this (word, context)
                        pair real or not? Train against k randomly sampled "negative" words.
                        This reduced computation from O(V) to O(k) per update (k ≈ 5–20).
                        Also introduced subsampling of frequent words and phrase detection.
                    </div>
                    <div className="ch10-tl-impact">Impact: Made billion-word training feasible; negative sampling is now universal in embedding training</div>
                </div>
            </div>

            <div className="ch10-callout">
                <strong>Why it mattered beyond NLP:</strong> Word2Vec established the paradigm of
                <em>representation learning</em> — letting the model discover structure in data
                rather than hand-engineering features. The same principle of learning dense embeddings
                from co-occurrence statistics now underlies knowledge graph embeddings, molecular
                representations, recommendation systems, and most applications of Transformers.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching a computer that king minus man plus woman equals queen</h2>

            <Analogy label="The Problem with One-Hot Vectors">
                Before Word2Vec, computers represented words as giant lists of zeros with a single
                1. For a vocabulary of 50,000 words, "cat" might be word number 7,423 — so its
                vector is all zeros except position 7,423.
                <br /><br />
                These one-hot vectors have a terrible property: every word is equally far from
                every other word. "cat" and "kitten" are just as different from each other as
                "cat" and "democracy." The computer has no idea that cats and kittens are related.
            </Analogy>

            <Analogy label="The Word2Vec Idea: Learn from Context">
                Word2Vec's insight: instead of assigning words arbitrary numbers, give each word
                a short list of real numbers (say, 300 numbers) that captures its meaning.
                <br /><br />
                How do you learn what these numbers should be? By looking at which words appear
                near each other in text. If "cat" and "kitten" often appear in the same sentences
                (next to "meow," "pet," "fur"), they should get similar vectors. If "king" and
                "queen" appear in similar royal contexts (next to "throne," "crown," "reign"),
                they get similar vectors too.
            </Analogy>

            <Analogy label="Why King − Man + Woman = Queen">
                Here's the magic. Word2Vec learned that "king" and "queen" are similar except
                for gender. It also learned that "man" and "woman" encode gender.
                <br /><br />
                So: take the "king" vector, subtract the "man" vector (remove the gender=male
                information), add the "woman" vector (add gender=female information). The result
                points almost exactly to "queen." The vectors have learned to separate meaning
                from gender, royalty from commoner status.
                <br /><br />
                This works for hundreds of analogies: Paris−France+Germany≈Berlin,
                walked−walk+run≈ran, biggest−big+tall≈tallest.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Skip-gram, CBOW, and negative sampling</h2>

            <h3>Two Model Architectures</h3>

            <h3>Skip-Gram: Predict Context from Center</h3>
            <p>
                Given a center word w<sub>c</sub>, predict surrounding context words within
                a window of size m:
            </p>
            <MathBlock tex="\text{maximize} \prod_{t=1}^{T} \prod_{-m \leq j \leq m,\, j \neq 0} P(w_{t+j} \mid w_t)" />
            <p>
                The probability of context word w<sub>o</sub> given center word w<sub>c</sub>:
            </p>
            <MathBlock tex="P(w_o \mid w_c) = \frac{\exp(\mathbf{v}_{w_o}^\top \mathbf{v}_{w_c})}{\sum_{w=1}^{V} \exp(\mathbf{v}_w^\top \mathbf{v}_{w_c})}" />
            <p>
                Each word has two vectors: an "input" embedding v and an "output" embedding ũ.
                After training, usually only v is kept.
            </p>

            <h3>CBOW: Predict Center from Context</h3>
            <p>
                Average the context word embeddings, then predict the center word:
            </p>
            <MathBlock tex="P(w_c \mid \text{ctx}) = \frac{\exp\!\left(\mathbf{v}_{w_c}^\top \cdot \frac{1}{2m}\sum_{j=-m}^{m} \mathbf{v}_{w_{t+j}}\right)}{\text{normalizer}}" />
            <p>
                CBOW is faster but Skip-gram gives better representations for rare words.
            </p>

            <h3>Negative Sampling: Approximate the Softmax</h3>
            <p>
                The full softmax over V = 50,000 words is expensive. Negative sampling turns it
                into a binary classification: is this (w<sub>c</sub>, w<sub>o</sub>) pair real?
            </p>
            <MathBlock tex="\mathcal{L} = \log\sigma(\mathbf{v}_{w_o}^\top \mathbf{v}_{w_c}) + \sum_{k=1}^{K} \mathbb{E}_{w_k \sim P_n}\!\left[\log\sigma(-\mathbf{v}_{w_k}^\top \mathbf{v}_{w_c})\right]" />
            <p>
                K negative samples per positive pair (typically 5–20). The noise distribution
                P<sub>n</sub>(w) ∝ f(w)<sup>3/4</sup> (unigram frequency raised to 3/4 power)
                samples frequent words more but less than their raw frequency.
            </p>

            <hr className="ch10-sep" />
            <div className="ch10-callout">
                <strong>What the network actually learns:</strong> The "input" embedding matrix W
                (V × d) and "output" embedding matrix W' (V × d) are both trained. Each row of
                W is the embedding for a word as a center word; each row of W' is its embedding
                as a context word. In practice we discard W' and use W as the final embeddings.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Objective, gradient, noise contrastive estimation</h2>

            <DefBlock label="Skip-Gram Objective (Mikolov et al., 2013)">
                Let T = corpus length, m = context window, V = vocabulary.
                Center word embedding: v<sub>c</sub> ∈ ℝ<sup>d</sup>; context word embedding: u<sub>o</sub> ∈ ℝ<sup>d</sup>.
                <br /><br />
                Maximize:
                J(θ) = (1/T) Σ<sub>t=1</sub><sup>T</sup> Σ<sub>-m≤j≤m, j≠0</sub> log P(w<sub>t+j</sub> | w<sub>t</sub>; θ)
                <br /><br />
                P(w<sub>o</sub> | w<sub>c</sub>) = exp(u<sub>o</sub>·v<sub>c</sub>) / Σ<sub>w</sub> exp(u<sub>w</sub>·v<sub>c</sub>)
            </DefBlock>

            <h3>Gradients of the Softmax Objective</h3>
            <MathBlock tex="\frac{\partial \log P(w_o \mid w_c)}{\partial \mathbf{v}_{w_c}} = \mathbf{u}_{w_o} - \sum_{w=1}^{V} P(w \mid w_c)\, \mathbf{u}_w" />
            <p>
                This is "observed context word" minus "expected context word" — the update pulls
                v<sub>wc</sub> toward u<sub>wo</sub> and away from all other context embeddings
                weighted by their current predicted probabilities.
            </p>

            <h3>Negative Sampling Loss</h3>
            <MathBlock tex="\mathcal{L}_\text{NEG} = -\left[\log\sigma(\mathbf{u}_{w_o}^\top \mathbf{v}_{w_c}) + \sum_{k=1}^{K} \log\sigma(-\mathbf{u}_{w_k}^\top \mathbf{v}_{w_c})\right]" />
            <p>
                Gradient w.r.t. v<sub>wc</sub>:
            </p>
            <MathBlock tex="\nabla_{\mathbf{v}_{w_c}} \mathcal{L} = -\left[\left(1 - \sigma(\mathbf{u}_{w_o}^\top \mathbf{v}_{w_c})\right)\mathbf{u}_{w_o} - \sum_{k=1}^{K}\sigma(\mathbf{u}_{w_k}^\top \mathbf{v}_{w_c})\, \mathbf{u}_{w_k}\right]" />
            <p>
                O(K) instead of O(V) — e.g., 10 vs 50,000 operations per update.
            </p>

            <h3>Why Noise Distribution P<sub>n</sub>(w) ∝ f(w)<sup>3/4</sup>?</h3>
            <p>
                Raw unigram frequency oversamples "the," "a," "of." Squared frequency undersamples
                rare words. The 3/4 power is an empirical compromise that gives rare words a
                higher chance of being selected as negatives, providing better learning signal
                for infrequent vocabulary.
            </p>
            <MathBlock tex="P_n(w) = \frac{f(w)^{3/4}}{\sum_{w'} f(w')^{3/4}}" />

            <div className="ch10-callout">
                <strong>The PMI connection:</strong> Levy & Goldberg (2014) showed that Skip-gram
                with negative sampling implicitly factorizes the pointwise mutual information (PMI)
                matrix: PMI(w, c) = log(P(w,c) / P(w)P(c)). This connects Word2Vec to classical
                distributional semantics methods and explains why it captures semantic relationships.
            </div>
        </>
    )
}

const PY_CODE = `from gensim.models import Word2Vec
import numpy as np

# ── Toy corpus ────────────────────────────────────────────────────────────────
corpus = [
    ["the", "king", "rules", "the", "kingdom"],
    ["the", "queen", "rules", "the", "kingdom"],
    ["the", "man", "went", "to", "the", "market"],
    ["the", "woman", "went", "to", "the", "market"],
    ["the", "prince", "is", "the", "son", "of", "the", "king"],
    ["the", "princess", "is", "the", "daughter", "of", "the", "queen"],
    ["paris", "is", "the", "capital", "of", "france"],
    ["berlin", "is", "the", "capital", "of", "germany"],
    ["london", "is", "the", "capital", "of", "england"],
    ["cats", "and", "dogs", "are", "pets"],
    ["kittens", "grow", "into", "cats"],
    ["puppies", "grow", "into", "dogs"],
]

# ── Train Word2Vec (Skip-gram) ────────────────────────────────────────────────
model = Word2Vec(
    corpus,
    vector_size=50,    # embedding dimension
    window=3,          # context window size
    min_count=1,       # include all words
    sg=1,              # 1=Skip-gram, 0=CBOW
    negative=5,        # negative samples
    epochs=200,
    seed=42,
)

print("=" * 60)
print("Word2Vec — Skip-gram (gensim)")
print("=" * 60)

# ── Semantic similarity ───────────────────────────────────────────────────────
vocab = list(model.wv.key_to_index.keys())
print(f"Vocabulary ({len(vocab)} words): {vocab}")
print()

# Most similar words
for query in ["king", "cat", "paris"]:
    if query in model.wv:
        similar = model.wv.most_similar(query, topn=3)
        print(f"Most similar to '{query}': {similar}")

print()

# ── Semantic arithmetic ───────────────────────────────────────────────────────
def analogy(model, pos, neg, topn=1):
    """pos - neg analogy: e.g. king - man + woman"""
    result = model.wv.most_similar(positive=pos, negative=neg, topn=topn)
    return result

print("Semantic arithmetic:")
pairs = [
    (["king", "woman"], ["man"]),      # king - man + woman = ?
    (["queen", "man"],  ["woman"]),    # queen - woman + man = ?
    (["berlin", "france"], ["germany"]),  # berlin - germany + france = ?
]
for pos, neg in pairs:
    result = analogy(model, pos, neg)
    print(f"  {'+'.join(pos)} - {'+'.join(neg)} ≈ {result[0][0]} ({result[0][1]:.3f})")

print()

# ── Manual negative sampling (NumPy) ──────────────────────────────────────────
print("Manual negative sampling step:")
print("-" * 40)

def neg_sampling_loss(v_c, u_o, u_neg, sigma=lambda x: 1/(1+np.exp(-x))):
    """
    Negative sampling loss for one (center, context, negatives) triple.
    v_c:   (d,) center word embedding
    u_o:   (d,) positive context embedding
    u_neg: (k, d) negative sample embeddings
    """
    pos_score = sigma(u_o @ v_c)               # want this → 1
    neg_scores = sigma(-u_neg @ v_c)            # want these → 1 (equivalently: u·v → -inf)
    loss = -np.log(pos_score) - np.sum(np.log(neg_scores))
    return loss, pos_score, neg_scores

d, k = 10, 5
v_c   = np.random.randn(d) * 0.1
u_o   = np.random.randn(d) * 0.1   # positive
u_neg = np.random.randn(k, d) * 0.1  # k negatives

loss, pos, negs = neg_sampling_loss(v_c, u_o, u_neg)
print(f"Loss:           {loss:.4f}")
print(f"Pos P(real):    {pos:.4f}  (want → 1.0)")
print(f"Neg P(noise):   {negs.mean():.4f}  (want → 1.0 i.e. u·v → -inf)")
`

function PythonTab() {
    return (
        <>
            <p>
                Gensim Word2Vec training on a small corpus demonstrating similarity queries and
                semantic arithmetic. Followed by a manual NumPy negative sampling loss computation
                showing the core learning objective.
            </p>
            <CodeBlock code={PY_CODE} filename="word2vec_demo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Word2Vec utilities — cosine similarity and nearest neighbor ───────────────

type Vec = number[]
type Embeddings = Map<string, Vec>

// ── Cosine similarity ─────────────────────────────────────────────────────────
function dot(a: Vec, b: Vec): number {
  return a.reduce((s, ai, i) => s + ai * b[i], 0)
}

function norm(v: Vec): number {
  return Math.sqrt(dot(v, v))
}

function cosineSimilarity(a: Vec, b: Vec): number {
  const denom = norm(a) * norm(b)
  if (denom === 0) return 0
  return dot(a, b) / denom
}

// ── Vector arithmetic ─────────────────────────────────────────────────────────
function vecAdd(a: Vec, b: Vec): Vec { return a.map((v, i) => v + b[i]) }
function vecSub(a: Vec, b: Vec): Vec { return a.map((v, i) => v - b[i]) }

// ── Nearest neighbor search ───────────────────────────────────────────────────
function nearestNeighbors(
  query: Vec,
  embeddings: Embeddings,
  topN = 5,
  exclude: string[] = []
): { word: string; similarity: number }[] {
  const scores = Array.from(embeddings.entries())
    .filter(([word]) => !exclude.includes(word))
    .map(([word, vec]) => ({
      word,
      similarity: cosineSimilarity(query, vec),
    }))
    .sort((a, b) => b.similarity - a.similarity)

  return scores.slice(0, topN)
}

// ── Analogy solver: positive - negative ───────────────────────────────────────
function analogy(
  embeddings: Embeddings,
  positive: string[],
  negative: string[],
  topN = 3
): { word: string; similarity: number }[] {
  // Compute: sum(positive vectors) - sum(negative vectors)
  const dim = embeddings.values().next().value.length
  let queryVec = new Array(dim).fill(0)

  for (const word of positive) {
    const v = embeddings.get(word)
    if (v) queryVec = vecAdd(queryVec, v)
  }
  for (const word of negative) {
    const v = embeddings.get(word)
    if (v) queryVec = vecSub(queryVec, v)
  }

  return nearestNeighbors(queryVec, embeddings, topN, [...positive, ...negative])
}

// ── Demo with toy embeddings ──────────────────────────────────────────────────
// Manually crafted 4D embeddings encoding: [royal, gender, human, geographic]
const embeddings: Embeddings = new Map([
  ["king",    [1.0,  1.0, 1.0, 0.0]],
  ["queen",   [1.0, -1.0, 1.0, 0.0]],
  ["man",     [0.0,  1.0, 1.0, 0.0]],
  ["woman",   [0.0, -1.0, 1.0, 0.0]],
  ["prince",  [0.8,  1.0, 1.0, 0.0]],
  ["princess",[0.8, -1.0, 1.0, 0.0]],
  ["france",  [0.0,  0.0, 0.0, 1.0]],
  ["germany", [0.0,  0.0, 0.0, 1.0]],
  ["paris",   [0.0,  0.0, 0.1, 1.2]],
  ["berlin",  [0.0,  0.0, 0.1, 1.1]],
])

console.log("Cosine Similarity Examples:")
console.log("─".repeat(45))

const pairs = [
  ["king",  "queen"],
  ["king",  "man"],
  ["man",   "woman"],
  ["paris", "berlin"],
  ["king",  "paris"],
]
for (const [a, b] of pairs) {
  const va = embeddings.get(a)!
  const vb = embeddings.get(b)!
  const sim = cosineSimilarity(va, vb)
  console.log(\`  sim(\${a}, \${b}) = \${sim.toFixed(4)}\`)
}

console.log()
console.log("Analogy: king − man + woman = ?")
const result = analogy(embeddings, ["king", "woman"], ["man"])
result.forEach(({ word, similarity }) => {
  console.log(\`  \${word}: \${similarity.toFixed(4)}\`)
})
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript cosine similarity, nearest neighbor search, and analogy solver over
                word embeddings. Demonstrated on manually crafted 4D vectors encoding gender,
                royalty, humanity, and geography — showing how the analogy arithmetic works
                geometrically.
            </p>
            <CodeBlock code={TS_CODE} filename="word2vec_utils.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const WORD2VEC_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
