import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 12's optimization advances — Momentum, Adam, Batch Normalization, and learning rate schedules — made training large, deep networks reliable and fast. With a solid training infrastructure in place, the field could tackle a new problem: language. Unlike images (continuous pixel grids) or structured data (number tables), words resist numeric representation. Assigning random numbers to words destroys all semantic information — 'king' and 'queen' should be neighbors; 'cat' and 'refrigerator' should be distant. Mikolov's Word2Vec (2013) introduced the first scalable solution.
            </p>
            <h2>Dense vectors that capture meaning</h2>
            <p>
                Word2Vec is one of the most consequential papers in the history of natural language processing. Published by Tomáš Mikolov and colleagues at Google in 2013, it demonstrated that neural networks could learn word representations so rich that you could perform arithmetic on them: king − man + woman ≈ queen. This single demonstration changed the trajectory of NLP forever.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1954–1957</div>
                    <div className="ch-tl-section-label">Theoretical Foundation</div>
                    <div className="ch-tl-title">The Distributional Hypothesis — Harris and Firth</div>
                    <div className="ch-tl-body">
                        Zellig Harris articulated the distributional hypothesis in 1954: "words that occur in the same contexts tend to have similar meanings." John Rupert Firth later rephrased it memorably as "you shall know a word by the company it keeps" (1957). This principle is the theoretical foundation of every word embedding method — Word2Vec, GloVe, and FastText all operationalize the idea that context encodes meaning.
                        <br /><br />
                        The hypothesis was not just a linguistic observation — it was a computational prescription. If you could measure which words appear in similar contexts across a large corpus, you would have a basis for computing word similarity without any human-defined lexicon. The challenge was doing this at scale and in a form that neural networks could use.
                    </div>
                    <div className="ch-tl-impact">Impact: The theoretical basis for all distributional word representations; context as proxy for meaning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2003</div>
                    <div className="ch-tl-section-label">Neural Precursor</div>
                    <div className="ch-tl-title">Bengio et al. — Neural Probabilistic Language Model</div>
                    <div className="ch-tl-body">
                        Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin published "A Neural Probabilistic Language Model" (JMLR 2003), which jointly learned word embeddings and a language model. The embeddings were initially a byproduct — the main goal was a better language model — but Bengio et al. showed that the network learned meaningful vector representations: similar words had similar vectors, and the model could generalize to unseen word combinations by interpolating in embedding space.
                        <br /><br />
                        The model was far ahead of its time but had a critical practical limitation: training was too slow for large vocabularies. On 1 million words of training data it took weeks, making billion-word training effectively impossible. The architecture used a full softmax over the vocabulary at each prediction step — scaling as O(V) per training example. A vocabulary of 50,000 words meant 50,000 output neurons computed at every step.
                    </div>
                    <div className="ch-tl-impact">Impact: First neural word embeddings; demonstrated the concept and semantic structure; bottlenecked by O(V) softmax computation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 Jan</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Word2Vec — Mikolov, Chen, Corrado, Dean</div>
                    <div className="ch-tl-body">
                        Tomáš Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean published "Efficient Estimation of Word Representations in Vector Space" (arXiv January 2013). The key insight: train a <em>shallow</em> (not deep) neural network with a simplified objective — either predict context words from a center word (Skip-gram) or predict the center word from context words (CBOW). Remove the hidden layer nonlinearity. The result: training was 100× faster than Bengio's LM, enabling training on 1 billion words in a day.
                        <br /><br />
                        The famous semantic arithmetic demo (king − man + woman ≈ queen, Paris − France + Germany ≈ Berlin) captured the world's imagination. The embedding space had geometric structure that mirrored human linguistic intuition — not because the model was told this, but as an emergent property of learning to predict context. Window size and vector dimension were found to matter: larger windows captured more topical similarity; higher dimensions captured more structure but diminished returns past 300.
                    </div>
                    <div className="ch-tl-impact">Impact: Made word embeddings practical at scale; king−man+woman=queen became iconic; enabled NLP research on massive corpora</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 Oct</div>
                    <div className="ch-tl-section-label">Scaling</div>
                    <div className="ch-tl-title">Negative Sampling and Phrases — Mikolov et al.</div>
                    <div className="ch-tl-body">
                        A second paper "Distributed Representations of Words and Phrases and Their Compositionality" introduced negative sampling — replacing the expensive softmax over the entire vocabulary (50,000+ words) with a binary classification task: is this (word, context) pair real or noise? Training against k randomly sampled "negative" words reduced computation from O(V) to O(k) per update (k ≈ 5–20).
                        <br /><br />
                        This paper also introduced phrase detection (treating "New York" and "Air Force One" as single tokens), subsampling of frequent words (randomly skipping "the," "a," etc.), and showed that Google News embeddings (100B words, 300 dimensions) could solve 8,869 semantic and syntactic analogy questions at 65% accuracy — far exceeding any previous method. The model was made publicly available, enabling thousands of follow-on experiments.
                    </div>
                    <div className="ch-tl-impact">Impact: Made billion-word training feasible; negative sampling is now universal in embedding training; public release drove adoption</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Theoretical Understanding</div>
                    <div className="ch-tl-title">PMI Connection — Levy and Goldberg</div>
                    <div className="ch-tl-body">
                        Omer Levy and Yoav Goldberg published "Neural Word Embedding as Implicit Matrix Factorization" (NeurIPS 2014), providing a theoretical explanation for why Word2Vec works. They proved that Skip-gram with negative sampling implicitly factorizes the Pointwise Mutual Information (PMI) matrix: PMI(w, c) = log(P(w,c) / P(w)P(c)). This connected Word2Vec to decades of distributional semantics research and explained its semantic properties from first principles.
                    </div>
                    <div className="ch-tl-impact">Impact: Unified Word2Vec with classical distributional semantics; PMI factorization became the theoretical foundation for understanding embeddings</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013–2017</div>
                    <div className="ch-tl-section-label">Limitations</div>
                    <div className="ch-tl-title">The OOV Problem and Context Independence</div>
                    <div className="ch-tl-body">
                        Word2Vec had two significant limitations that became apparent as NLP matured. First: out-of-vocabulary (OOV) words — any word not seen during training gets no representation. Typos, rare technical terms, and new vocabulary are completely unhandled. Second: context independence — "bank" has the same embedding whether it refers to a financial institution or a river bank. The same vector must represent all uses of a word, regardless of context.
                        <br /><br />
                        These limitations motivated FastText (character n-grams for OOV, 2017), and eventually ELMo and BERT (context-dependent embeddings, 2018). Word2Vec's static embeddings dominated NLP from 2013 to 2018 before being largely superseded by contextualized representations.
                    </div>
                    <div className="ch-tl-impact">Impact: Identified the OOV and polysemy problems; motivated FastText, ELMo, and BERT; defined the research agenda for the following five years</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why it mattered beyond NLP:</strong> Word2Vec established the paradigm of <em>representation learning</em> — letting the model discover structure in data rather than hand-engineering features. The same principle of learning dense embeddings from co-occurrence statistics now underlies knowledge graph embeddings, molecular representations, recommendation systems (item2vec), graph embeddings (node2vec), and most applications of Transformers.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 12 gave neural networks better learning engines — faster, more stable optimizers. Now a new challenge: how do you teach a computer what words mean? You can't just number them 1 through 50,000 — that would make 'king' and 'queen' as unrelated as 'cat' and 'refrigerator'. Word2Vec (2013) solved this by giving every word its own address in a mathematical space, where similar words live near each other.
            </p>
            <h2>Teaching a computer that king minus man plus woman equals queen</h2>

            <Analogy label="The Problem with One-Hot Vectors">
                Before Word2Vec, computers represented words as giant lists of zeros with a single 1. For a vocabulary of 50,000 words, "cat" might be word number 7,423 — so its vector is all zeros except position 7,423.
                <br /><br />
                These one-hot vectors have a terrible property: every word is equally far from every other word. "Cat" and "kitten" are just as different from each other as "cat" and "democracy." The computer has no idea that cats and kittens are related. All 50,000 words are equally near and equally far from each other — the representation carries zero information about meaning.
            </Analogy>

            <Analogy label="The Word2Vec Idea: Learn from Context">
                Word2Vec's insight: instead of assigning words arbitrary numbers, give each word a short list of real numbers (say, 300 numbers) that captures its meaning.
                <br /><br />
                How do you learn what these numbers should be? By looking at which words appear near each other in text. If "cat" and "kitten" often appear in the same sentences (next to "meow," "pet," "fur"), they should get similar vectors. If "king" and "queen" appear in similar royal contexts (next to "throne," "crown," "reign"), they get similar vectors too.
                <br /><br />
                The model trains by playing a game: given a word, predict which words typically appear around it. Words that appear in similar contexts will develop similar vectors — because the model must use similar patterns to make similar predictions.
            </Analogy>

            <Analogy label="Skip-Gram vs CBOW — Two Ways to Play the Game">
                Word2Vec comes in two flavors. Skip-gram says: "Given the word 'cat,' predict that 'meow,' 'fur,' 'pet,' and 'kitten' are probably nearby." It learns from one word and predicts many.
                <br /><br />
                CBOW (Continuous Bag of Words) works backwards: "Given the words 'meow,' 'fur,' 'pet,' 'kitten,' predict that the center word is probably 'cat.'" It averages many words to predict one.
                <br /><br />
                Skip-gram is better for rare words (it gets more training signal per word) but slower. CBOW is faster and works well for common words.
            </Analogy>

            <Analogy label="Why King − Man + Woman = Queen">
                Here's the magic. Word2Vec learned that "king" and "queen" are similar except for gender. It also learned that "man" and "woman" encode gender.
                <br /><br />
                So: take the "king" vector, subtract the "man" vector (remove the gender=male information), add the "woman" vector (add gender=female information). The result points almost exactly to "queen." The vectors have learned to separate meaning from gender, royalty from commoner status.
                <br /><br />
                This works for hundreds of analogies: Paris−France+Germany≈Berlin, walked−walk+run≈ran, biggest−big+tall≈tallest.
            </Analogy>

            <Analogy label="Negative Sampling — Making Training 1000× Faster">
                The original problem with word embeddings was speed. To predict which words appear near "cat," you have to assign probabilities to all 50,000 words in the vocabulary — which is expensive.
                <br /><br />
                Negative sampling is a shortcut: instead of asking "what's the probability of every word?", just ask a simpler question: "Is this particular word ('meow') really near 'cat', or is it a random word I just picked?" Then do this for 5–20 randomly chosen "negative" words that are definitely not near "cat."
                <br /><br />
                This reduces the computation from comparing against 50,000 words to comparing against just 5–20. It's 1000× faster and produces embeddings that are just as good.
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
                Given a center word w<sub>c</sub>, predict surrounding context words within a window of size m:
            </p>
            <MathBlock tex="\text{maximize} \prod_{t=1}^{T} \prod_{-m \leq j \leq m,\, j \neq 0} P(w_{t+j} \mid w_t)" />
            <p>
                The probability of context word w<sub>o</sub> given center word w<sub>c</sub>:
            </p>
            <MathBlock tex="P(w_o \mid w_c) = \frac{\exp(\mathbf{u}_{w_o}^\top \mathbf{v}_{w_c})}{\sum_{w=1}^{V} \exp(\mathbf{u}_w^\top \mathbf{v}_{w_c})}" />
            <p>
                Each word has two vectors: an "input" embedding v (as center word) and an "output" embedding u (as context word). After training, usually only v is kept.
            </p>

            <h3>CBOW: Predict Center from Context</h3>
            <p>
                Average the context word embeddings, then predict the center word:
            </p>
            <MathBlock tex="P(w_c \mid \text{ctx}) = \frac{\exp\!\left(\mathbf{u}_{w_c}^\top \cdot \frac{1}{2m}\sum_{j=-m, j\neq 0}^{m} \mathbf{v}_{w_{t+j}}\right)}{\text{normalizer}}" />
            <p>
                CBOW is faster but Skip-gram gives better representations for rare words (more gradient updates per rare word occurrence).
            </p>

            <h3>Negative Sampling: Approximate the Softmax</h3>
            <p>
                The full softmax over V = 50,000 words is expensive. Negative sampling turns it into a binary classification: is this (w<sub>c</sub>, w<sub>o</sub>) pair real?
            </p>
            <MathBlock tex="\mathcal{L} = \log\sigma(\mathbf{u}_{w_o}^\top \mathbf{v}_{w_c}) + \sum_{k=1}^{K} \mathbb{E}_{w_k \sim P_n}\!\left[\log\sigma(-\mathbf{u}_{w_k}^\top \mathbf{v}_{w_c})\right]" />
            <p>
                K negative samples per positive pair (typically 5–20). The noise distribution P<sub>n</sub>(w) ∝ f(w)<sup>3/4</sup> samples frequent words more but less than their raw frequency.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>What the network actually learns:</strong> The "input" embedding matrix W (V × d) and "output" embedding matrix W' (V × d) are both trained. Each row of W is the embedding for a word as a center word; each row of W' is its embedding as a context word. In practice we discard W' and use W as the final embeddings. The fact that two separate matrices are learned — and that using their average sometimes improves performance — hints at the dual role each word plays in co-occurrence.
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
            <h2>Objective, gradient, noise contrastive estimation</h2>

            <DefBlock label="Skip-Gram Objective (Mikolov et al., 2013)">
                Let T = corpus length, m = context window, V = vocabulary.
                Center word embedding: <InlineMath tex="v_c \in \mathbb{R}^d" />; context word embedding: <InlineMath tex="u_o \in \mathbb{R}^d" />.
                <MathBlock tex="J(\theta) = \frac{1}{T}\sum_{t=1}^{T}\sum_{\substack{-m \le j \le m \\ j \neq 0}} \log P(w_{t+j} \mid w_t;\,\theta)" />
                <MathBlock tex="P(w_o \mid w_c) = \frac{\exp(\mathbf{u}_{w_o}^\top \mathbf{v}_{w_c})}{\sum_{w=1}^{V}\exp(\mathbf{u}_w^\top \mathbf{v}_{w_c})}" />
            </DefBlock>

            <h3>Gradients of the Softmax Objective</h3>
            <MathBlock tex="\frac{\partial \log P(w_o \mid w_c)}{\partial \mathbf{v}_{w_c}} = \mathbf{u}_{w_o} - \sum_{w=1}^{V} P(w \mid w_c)\, \mathbf{u}_w" />
            <p>
                This is "observed context word" minus "expected context word" — the update pulls v<sub>wc</sub> toward u<sub>wo</sub> and away from all other context embeddings weighted by their current predicted probabilities.
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
                Raw unigram frequency oversamples "the," "a," "of." Squared frequency undersamples rare words. The 3/4 power is an empirical compromise that gives rare words a higher chance of being selected as negatives, providing better learning signal for infrequent vocabulary.
            </p>
            <MathBlock tex="P_n(w) = \frac{f(w)^{3/4}}{\sum_{w'} f(w')^{3/4}}" />

            <div className="ch-callout">
                <strong>The PMI connection:</strong> Levy and Goldberg (2014) showed that Skip-gram with negative sampling implicitly factorizes the pointwise mutual information (PMI) matrix: PMI(w, c) = log(P(w,c) / P(w)P(c)). This connects Word2Vec to classical distributional semantics methods and explains why it captures semantic relationships.
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
print("Word2Vec -- Skip-gram (gensim)")
print("=" * 60)

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
    return model.wv.most_similar(positive=pos, negative=neg, topn=topn)

print("Semantic arithmetic:")
pairs = [
    (["king", "woman"], ["man"]),      # king - man + woman = ?
    (["queen", "man"],  ["woman"]),    # queen - woman + man = ?
    (["berlin", "france"], ["germany"]),
]
for pos, neg in pairs:
    result = analogy(model, pos, neg)
    print(f"  {'+'.join(pos)} - {'+'.join(neg)} ~ {result[0][0]} ({result[0][1]:.3f})")

print()

# ── Manual negative sampling (NumPy) ──────────────────────────────────────────
print("Manual negative sampling step:")
print("-" * 40)

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def neg_sampling_loss(v_c, u_o, u_neg):
    """
    Negative sampling loss for one (center, context, negatives) triple.
    v_c:   (d,) center word embedding
    u_o:   (d,) positive context embedding
    u_neg: (k, d) negative sample embeddings
    """
    pos_score = sigmoid(u_o @ v_c)        # want this -> 1
    neg_scores = sigmoid(-u_neg @ v_c)    # want these -> 1
    loss = -np.log(pos_score) - np.sum(np.log(neg_scores))
    return loss, pos_score, neg_scores

d, k = 10, 5
np.random.seed(42)
v_c   = np.random.randn(d) * 0.1
u_o   = np.random.randn(d) * 0.1
u_neg = np.random.randn(k, d) * 0.1

loss, pos, negs = neg_sampling_loss(v_c, u_o, u_neg)
print(f"Loss:          {loss:.4f}")
print(f"Pos P(real):   {pos:.4f}  (want -> 1.0)")
print(f"Neg P(noise):  {negs.mean():.4f}  (want -> 1.0 i.e. u.v -> -inf)")

# ── Noise distribution: unigram^(3/4) ─────────────────────────────────────────
print()
print("Unigram vs ^(3/4) noise distribution:")
freqs = np.array([1000, 500, 100, 50, 10, 1])  # word frequencies
p_unigram = freqs / freqs.sum()
p_noise   = freqs**(3/4) / (freqs**(3/4)).sum()
print(f"  {'freq':>6}  {'unigram':>10}  {'f^(3/4)':>10}")
for f, u, n in zip(freqs, p_unigram, p_noise):
    print(f"  {f:>6}  {u:>10.4f}  {n:>10.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Gensim Word2Vec training on a small corpus demonstrating similarity queries and semantic arithmetic. Followed by a manual NumPy negative sampling loss computation showing the core learning objective, and a comparison of unigram vs. ³⁄₄-power noise distributions.
            </p>
            <CodeBlock code={PY_CODE} filename="word2vec_demo.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const WORD2VEC_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
