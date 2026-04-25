import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>When word vectors became a lens for understanding language</h2>
            <p>
                After Word2Vec and GloVe, researchers began probing what was actually encoded in these vector spaces. The results were both astonishing and troubling — astonishing because of the rich semantic structure they revealed, troubling because that structure also captured and amplified human biases. The story of embeddings is the story of representation learning maturing from a technique into a field.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986</div>
                    <div className="ch-tl-section-label">Theoretical Foundation</div>
                    <div className="ch-tl-title">Distributed Representations — Hinton</div>
                    <div className="ch-tl-body">
                        Geoffrey Hinton introduced the concept of distributed representations in "Learning distributed representations of concepts" (1986). The key idea: rather than representing a concept as a single node in a symbolic network (localist representation), encode it as a pattern of activation across many neurons — where each neuron participates in representing many concepts and each concept is represented by many neurons.
                        <br /><br />
                        Distributed representations are inherently dense and low-dimensional compared to one-hot encodings. They allow generalization: two concepts with similar representations will produce similar outputs. This theoretical insight, proposed thirty years before Word2Vec, is the foundation of all modern embeddings — every word vector, image embedding, and protein representation is a realization of Hinton's distributed representation idea.
                    </div>
                    <div className="ch-tl-impact">Impact: Theoretical foundation for all dense vector representations; identified the key advantage over localist symbolic representations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013–2014</div>
                    <div className="ch-tl-section-label">Discovery</div>
                    <div className="ch-tl-title">Geometric Structure in Embedding Space</div>
                    <div className="ch-tl-body">
                        Mikolov et al.'s analogy demonstrations showed that embedding differences encode semantic relationships: king−man+woman≈queen. Researchers then found this structure is pervasive: capital−country (Paris−France+Germany≈Berlin), verb tenses (walked−walk+run≈ran), superlatives (biggest−big+tall≈tallest).
                        <br /><br />
                        The embedding space has geometric structure that mirrors human linguistic categories — not by design, but as an emergent property of the training objective. The linear structure arises because the PMI matrix (which Word2Vec implicitly factorizes) has a near-linear relationship between semantic relationships and co-occurrence ratios. Directions in embedding space correspond to systematic variations in meaning.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated embeddings encode structured semantic knowledge; launched the analogy evaluation paradigm</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Concern</div>
                    <div className="ch-tl-title">Bias in Word Embeddings — Bolukbasi et al.</div>
                    <div className="ch-tl-body">
                        Tolga Bolukbasi and colleagues published "Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings" (NeurIPS 2016). They showed that standard word embeddings encode human gender stereotypes: the analogy "man:computer programmer::woman:?" resolves to "homemaker." The same biases present in text — reflecting historical gender roles — are absorbed into the vector space.
                        <br /><br />
                        They proposed a geometric debiasing method: identify the "gender direction" in embedding space and project out the gender component from gender-neutral words. This approach sparked a large research area examining bias in all forms of representation learning — racial bias, age bias, occupational stereotypes. The fundamental question remains unresolved: you cannot remove bias from embeddings trained on biased text without losing some true semantic information.
                    </div>
                    <div className="ch-tl-impact">Impact: Launched the field of embedding bias; fundamental question for all representation learning; debiasing methods became a research area</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2018</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Domain-Specific Embeddings and Isotropy</div>
                    <div className="ch-tl-body">
                        The Word2Vec paradigm expanded beyond words. Item2Vec (Barkan and Koenigstein, 2016) applied the Skip-gram idea to recommendation systems: treat user purchase sequences as "sentences" and items as "words." Items that appear in similar purchase contexts get similar embeddings — capturing collaborative filtering signal without explicit user-item matrices. Node2Vec (Grover and Leskovec, 2016) extended this to graphs: random walks on a graph produce "sentences" of node sequences, and Skip-gram on these sequences gives node embeddings that capture network structure.
                        <br /><br />
                        Mu and Viswanath (2018) discovered that word embedding spaces are anisotropic — most of the variance is concentrated in a few directions, and the average cosine similarity between random word pairs is high (≈0.6). This means cosine similarity is not as discriminative as it seems. Post-processing (removing the mean vector, whitening) substantially improves embedding quality.
                    </div>
                    <div className="ch-tl-impact">Impact: Embedding paradigm generalized to items, nodes, and molecules; isotropy discovery improved downstream task performance through post-processing</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Contextual Era</div>
                    <div className="ch-tl-title">ELMo — Context-Dependent Embeddings</div>
                    <div className="ch-tl-body">
                        Matthew Peters et al. published "Deep Contextualized Word Representations" (ELMo, ACL 2018). Word2Vec and GloVe assign each word a single fixed vector regardless of context — "bank" has the same embedding whether it means a financial institution or a river bank. ELMo generates context-dependent embeddings using a bidirectional LSTM language model: the word's embedding is a function of the entire sentence, different uses of "bank" get different vectors.
                        <br /><br />
                        ELMo achieved state-of-the-art on six NLP benchmarks by simply using the LSTM's hidden states as features in existing models. It was a bridge between static embeddings and the Transformer era (BERT, GPT). The idea that the same word token should have different representations depending on context became the defining feature of all subsequent language models.
                    </div>
                    <div className="ch-tl-impact">Impact: Context-dependent embeddings outperform static; direct precursor to BERT; established contextualization as the key missing ingredient</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The isotropy problem:</strong> Mu and Viswanath (2018) discovered that word embedding spaces are anisotropic — most variance is concentrated in a few directions, and average cosine similarity between random word pairs is ≈0.6. This inflates similarity scores and reduces discriminability. Post-processing (removing the mean and top PCA directions) substantially improves embedding quality for retrieval and similarity tasks.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A map where similar meanings live close together</h2>

            <Analogy label="The Embedding Space as a Library">
                Imagine a magical library where books are placed not on shelves alphabetically, but in a 3D room where similar books are close together. Cookbooks are in one corner; science fiction is in another; philosophy is in the middle. Books about food and cooking are near each other even if they were written centuries apart.
                <br /><br />
                Word embeddings work the same way, but with 300 dimensions instead of 3. Words about the same topic cluster together. Words with similar grammatical roles are in similar positions relative to their nouns. The geometry encodes meaning.
            </Analogy>

            <Analogy label="Directions Encode Relationships">
                In this library-space, you can draw an arrow from any book to another related book. The arrow from "biology textbook" to "chemistry textbook" is roughly the same as the arrow from "history of biology" to "history of chemistry" — because both arrows point in the "same academic domain, different topic" direction.
                <br /><br />
                Word embeddings have the same property. The arrow from "king" to "queen" is roughly parallel to the arrow from "man" to "woman." The arrow from "dog" to "puppy" is roughly parallel to "cat" to "kitten." These parallel arrows are the famous analogy arithmetic.
            </Analogy>

            <Analogy label="Embeddings Beyond Words — Items, Nodes, Molecules">
                The same idea works far beyond words. Online shops use "item embeddings" — each product gets a vector based on which other products customers tend to buy together. Similar products end up near each other in item space, even if they have completely different names.
                <br /><br />
                Social networks use "node embeddings" — each person or page gets a vector based on who they're connected to. People with similar social circles end up near each other. Drug companies use "molecule embeddings" — each compound gets a vector based on its chemical properties, so similar-acting drugs are near each other. The word2vec trick turned out to be a universal recipe for representation learning.
            </Analogy>

            <Analogy label="Why Embeddings Encode Bias">
                The library has a troubling property: it reflects the books it learned from. If most books describe nurses as women and engineers as men, then "nurse" will sit closer to "woman" and "engineer" closer to "man" in the library-space — even though there's no reason for this beyond historical imbalance.
                <br /><br />
                The embedding space is a mirror of human language as it was written, with all its biases intact. Researchers have to actively work to remove these biases, or they get passed on to every AI system that uses these embeddings.
            </Analogy>

            <Analogy label="ELMo — The Same Word Can Have Multiple Addresses">
                Word2Vec gives "bank" one fixed address in the library. But "bank" means different things in "river bank" and "savings bank." With one address, a system using embeddings will always confuse these meanings.
                <br /><br />
                ELMo (2018) gave words context-dependent addresses: "bank" in a financial context gets one vector, and "bank" in a geographic context gets a different vector. The address changes based on the surrounding sentence. This was a breakthrough — and it led directly to BERT and GPT, which use the same idea with a much more powerful Transformer architecture.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Cosine similarity, analogy arithmetic, and semantic subspaces</h2>

            <h3>One-Hot Encoding and Its Failure</h3>
            <p>
                Before embeddings, words were represented as one-hot vectors: a binary vector of dimension |V| (vocabulary size) with exactly one 1. Word i has a 1 at position i, zeros everywhere else.
            </p>
            <MathBlock tex="\text{sim}(e_{\text{cat}}, e_{\text{dog}}) = e_{\text{cat}}^\top e_{\text{dog}} = 0" />
            <p>
                All one-hot pairs are orthogonal — every word is equidistant from every other word. No semantic similarity is encoded. The model must learn all semantic relationships from scratch in every task.
            </p>

            <h3>Cosine Similarity</h3>
            <p>
                Two vectors are similar if they point in the same direction — regardless of their magnitude. Cosine similarity measures the angle between vectors:
            </p>
            <MathBlock tex="\text{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \cdot \|\mathbf{v}\|} = \cos\theta" />
            <p>
                Range: [−1, 1]. sim = 1: identical direction. sim = 0: orthogonal (unrelated). sim = −1: opposite. For word embeddings, most similarities are in [0, 0.9].
            </p>

            <h3>Analogy via Vector Arithmetic</h3>
            <p>
                The classic analogy task: a:b::c:? (a is to b as c is to d). Solution:
            </p>
            <MathBlock tex="d = \arg\max_{w \notin \{a,b,c\}} \text{sim}(e_w,\; e_b - e_a + e_c)" />
            <p>
                This works because the vector e<sub>b</sub> − e<sub>a</sub> encodes the "relationship" from a to b. Adding it to e<sub>c</sub> points toward a word with the same relationship to c.
            </p>

            <h3>The Gender Direction (Bolukbasi et al., 2016)</h3>
            <p>
                Identify the gender direction by taking differences of gendered word pairs:
            </p>
            <MathBlock tex="g = \frac{1}{|S|}\sum_{(w_m, w_f) \in S} (e_{w_m} - e_{w_f})" />
            <p>
                where S = &#123;(man, woman), (he, she), (king, queen), ...&#125;. To debias a gender-neutral word w: project out the gender component:
            </p>
            <MathBlock tex="e_w^{\text{debiased}} = e_w - \frac{e_w \cdot g}{\|g\|^2} g" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Intrinsic vs extrinsic evaluation:</strong> Intrinsic evaluation measures cosine similarity against human-rated word pairs (WordSim-353) or analogy accuracy (Google Analogy Test). Extrinsic evaluation tests embeddings as features in downstream tasks (POS tagging, NER, sentiment). The two don't always agree — good intrinsic scores don't guarantee good extrinsic performance.
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
            <h2>Linear structure, probing classifiers, and isotropy</h2>

            <DefBlock label="Linear Substructure Theorem (informal)">
                For embedding function e: V → ℝ<sup>d</sup>, a relationship R holds linearly if there exists a direction r ∈ ℝ<sup>d</sup> such that for all (a, b) ∈ R: e(b) − e(a) ≈ r. Equivalently: e(b) ≈ e(a) + r.
                <br /><br />
                In practice, this approximation holds with cosine similarity ≈ 0.8–0.95 for well-defined relationships (gender, nationality, verb tense).
            </DefBlock>

            <h3>Why Does Linear Structure Emerge?</h3>
            <p>
                Skip-gram with negative sampling approximately factorizes the PPMI matrix:
            </p>
            <MathBlock tex="e_{w_i} \cdot e_{w_j} \approx \text{PPMI}(w_i, w_j) = \max(0, \log\frac{P(w_i, w_j)}{P(w_i)P(w_j)})" />
            <p>
                The pointwise mutual information has a linear relationship with co-occurrence ratios. For a relationship R (e.g., gender), the co-occurrence patterns of (king, man, history, ...) shift systematically to (queen, woman, history, ...) — because the contexts are similar except for gendered words. This systematic shift produces a consistent direction in PPMI space, which the embedding inherits.
            </p>

            <h3>Isotropy and Anisotropy</h3>
            <p>
                Let Σ = (1/|V|)Σ<sub>w</sub> e<sub>w</sub>e<sub>w</sub><sup>T</sup> be the covariance of word embeddings. An isotropic distribution has Σ = σ²I. In practice:
            </p>
            <MathBlock tex="\mathbb{E}[\text{sim}(e_u, e_v)] = \frac{1}{|V|^2} \sum_{u,v} \frac{e_u^\top e_v}{\|e_u\|\|e_v\|} \approx 0.6" />
            <p>
                Much higher than the expected 0 for an isotropic distribution. This means random word pairs appear "related" — the similarity score is inflated across the board.
            </p>

            <h3>Post-Processing: All-but-the-Top (Mu and Viswanath, 2018)</h3>
            <MathBlock tex="e_w \leftarrow e_w - \mu - \sum_{i=1}^{D} (e_w \cdot u_i) u_i" />
            <p>
                where μ is the mean embedding, and u<sub>1</sub>, ..., u<sub>D</sub> are the top-D principal components. Removing the mean and top D=1–5 PCA directions substantially improves downstream task performance.
            </p>

            <div className="ch-callout">
                <strong>Probing classifiers:</strong> To test what information is encoded in embeddings, train a linear classifier f(e<sub>w</sub>) to predict a linguistic property (POS tag, word frequency, semantic category). If a simple linear classifier achieves high accuracy, the property is linearly encoded in the embedding. This probing methodology was developed during 2018–2019 to understand both static and contextual embeddings (BERT probing became a major research direction).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Toy embeddings encoding semantic structure ─────────────────────────────────
# 8D vectors: [royal, male, female, human, country, capital, animate, abstract]

words = {
    "king":     np.array([1.0,  0.9, -0.1, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "queen":    np.array([1.0, -0.1,  0.9, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "man":      np.array([0.0,  0.9, -0.1, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "woman":    np.array([0.0, -0.1,  0.9, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "prince":   np.array([0.8,  0.9,  0.0, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "princess": np.array([0.8,  0.0,  0.9, 1.0, 0.0, 0.0, 1.0, 0.0]),
    "france":   np.array([0.0,  0.0,  0.0, 0.0, 1.0, 0.0, 0.0, 0.0]),
    "germany":  np.array([0.0,  0.0,  0.0, 0.0, 1.0, 0.0, 0.0, 0.0]),
    "paris":    np.array([0.0,  0.0,  0.0, 0.1, 1.0, 1.0, 0.0, 0.0]),
    "berlin":   np.array([0.0,  0.0,  0.0, 0.1, 1.0, 1.0, 0.0, 0.0]),
    "democracy":np.array([0.0,  0.0,  0.0, 0.0, 0.0, 0.0, 0.0, 1.0]),
    "cat":      np.array([0.0,  0.0,  0.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
    "dog":      np.array([0.0,  0.0,  0.0, 0.0, 0.0, 0.0, 1.0, 0.0]),
}
vocab = list(words.keys())
embeddings = np.array([words[w] for w in vocab])

def cosine_sim(a, b):
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return float(a @ b / denom) if denom > 0 else 0.0

def nearest_neighbors(query_vec, topn=3, exclude=[]):
    sims = [(w, cosine_sim(query_vec, words[w])) for w in vocab if w not in exclude]
    sims.sort(key=lambda x: -x[1])
    return sims[:topn]

def analogy(pos_words, neg_words, topn=3):
    query = sum(words[w] for w in pos_words) - sum(words[w] for w in neg_words)
    return nearest_neighbors(query, topn, exclude=pos_words + neg_words)

# ── Cosine similarities ────────────────────────────────────────────────────────
print("=" * 60)
print("Cosine Similarities")
print("=" * 60)
pairs = [("king", "queen"), ("king", "man"), ("man", "woman"), ("paris", "berlin"),
         ("king", "cat"), ("king", "democracy"), ("france", "germany")]
for a, b in pairs:
    sim = cosine_sim(words[a], words[b])
    print(f"  sim({a:12s}, {b:12s}) = {sim:.4f}")

# ── Analogy arithmetic ────────────────────────────────────────────────────────
print()
print("Analogy Arithmetic")
print("=" * 60)
analogies = [
    (["king", "woman"], ["man"]),
    (["paris", "germany"], ["france"]),
    (["queen", "man"], ["woman"]),
]
for pos, neg in analogies:
    result = analogy(pos, neg)
    eq = " + ".join(pos) + " - " + " - ".join(neg)
    print(f"  {eq:30s} ~ {result[0][0]} ({result[0][1]:.4f})")

# ── Gender direction and debiasing ────────────────────────────────────────────
print()
print("Gender Direction Analysis")
print("=" * 60)
gender_pairs = [("king", "queen"), ("man", "woman"), ("prince", "princess")]
gender_dir = np.mean([words[m] - words[f] for m, f in gender_pairs], axis=0)
gender_dir /= np.linalg.norm(gender_dir)
for word in ["king", "queen", "man", "woman", "france", "cat", "democracy"]:
    proj = float(words[word] @ gender_dir)
    label = "male-leaning" if proj > 0.1 else ("female-leaning" if proj < -0.1 else "neutral")
    print(f"  {word:12s}: proj={proj:+.4f}  ({label})")

# ── Isotropy analysis ─────────────────────────────────────────────────────────
print()
print("Isotropy: Average Cosine Similarity Between Random Pairs")
print("=" * 60)
all_sims = []
for i in range(len(vocab)):
    for j in range(i+1, len(vocab)):
        all_sims.append(cosine_sim(embeddings[i], embeddings[j]))
print(f"Mean similarity: {np.mean(all_sims):.4f} (0=isotropic, higher=anisotropic)")
print(f"Std similarity:  {np.std(all_sims):.4f}")

# ── Embedding lookup in PyTorch ────────────────────────────────────────────────
import torch
import torch.nn as nn

print()
print("PyTorch nn.Embedding usage:")
print("-" * 40)
vocab_size = 10000
embed_dim  = 300
embedding_layer = nn.Embedding(vocab_size, embed_dim)
word_ids = torch.tensor([0, 5, 42, 999])
embeds = embedding_layer(word_ids)
print(f"Input word IDs: {word_ids.tolist()}")
print(f"Output shape:   {embeds.shape}  (4 words x {embed_dim} dims)")
print(f"Embedding[0] norm: {embeds[0].norm().item():.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Analysis of embedding geometry: cosine similarity, analogy arithmetic, gender direction extraction and debiasing, and isotropy measurement. Demonstrated on a crafted 8-dimensional toy embedding space, plus a PyTorch embedding lookup layer example.
            </p>
            <CodeBlock code={PY_CODE} filename="embedding_geometry.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const EMBEDDINGS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
