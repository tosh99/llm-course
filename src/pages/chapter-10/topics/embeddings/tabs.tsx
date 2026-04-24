import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>When word vectors became a lens for understanding language</h2>
            <p>
                After Word2Vec and GloVe, researchers began probing what was actually encoded in
                these vector spaces. The results were both astonishing and troubling — astonishing
                because of the rich semantic structure they revealed, troubling because that structure
                also captured and amplified human biases.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013–2014</div>
                    <div className="ch-tl-section-label">Discovery</div>
                    <div className="ch-tl-title">Geometric structure in embedding space</div>
                    <div className="ch-tl-body">
                        Mikolov et al.'s famous analogy demonstrations showed that embedding differences
                        encode semantic relationships: king−man+woman≈queen. Researchers then found
                        this structure is pervasive: capital−country (Paris−France+Germany≈Berlin),
                        verb tenses (walked−walk+run≈ran), superlatives (biggest−big+tall≈tallest).
                        The embedding space has geometric structure that mirrors human linguistic
                        categories — not by design, but as an emergent property of the training objective.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated embeddings encode structured semantic knowledge</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Concern</div>
                    <div className="ch-tl-title">Bias in word embeddings — Bolukbasi et al.</div>
                    <div className="ch-tl-body">
                        Tolga Bolukbasi and colleagues published "Man is to Computer Programmer as
                        Woman is to Homemaker? Debiasing Word Embeddings." They showed that standard
                        word embeddings encode human gender stereotypes: the analogy "man:computer
                        programmer::woman:?" resolves to "homemaker." The same biases present in text
                        — reflecting historical gender roles — are absorbed into the vector space.
                        They proposed a geometric debiasing method: identify the "gender direction"
                        in embedding space and project out the gender component from gender-neutral words.
                    </div>
                    <div className="ch-tl-impact">Impact: Launched the field of embedding bias; fundamental question for all representation learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017–2018</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">From static to contextual embeddings — ELMo</div>
                    <div className="ch-tl-body">
                        Word2Vec and GloVe assign each word a single fixed vector regardless of context.
                        "Bank" has the same vector whether it means a financial institution or a river
                        bank. Peters et al. (2018) introduced ELMo (Embeddings from Language Models),
                        which generates context-dependent embeddings using a bidirectional LSTM language
                        model. The word's embedding is a function of the entire sentence — different
                        uses of "bank" get different vectors. ELMo was a bridge between static
                        embeddings and the Transformer era (BERT, GPT).
                    </div>
                    <div className="ch-tl-impact">Impact: Showed contextual embeddings outperform static; direct precursor to BERT</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The isotropy problem:</strong> Mu & Viswanath (2018) discovered that
                word embedding spaces are anisotropic — most of the variance is concentrated in
                a few directions, and the average cosine similarity between random word pairs is
                high (≈0.6). This means cosine similarity is not as discriminative as it seems.
                Post-processing (like removing the mean vector, whitening) substantially improves
                embedding quality. This matters for downstream tasks and similarity search.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A map where similar meanings live close together</h2>

            <Analogy label="The Embedding Space as a Library">
                Imagine a magical library where books are placed not on shelves alphabetically,
                but in a 3D room where similar books are close together. Cookbooks are in one
                corner; science fiction is in another; philosophy is in the middle. Books about
                food and cooking are near each other even if they were written centuries apart.
                <br /><br />
                Word embeddings work the same way, but with 300 dimensions instead of 3. Words
                about the same topic cluster together. Words with similar grammatical roles are
                in similar positions relative to their nouns. The geometry encodes meaning.
            </Analogy>

            <Analogy label="Directions Encode Relationships">
                In this library-space, you can draw an arrow from any book to another related
                book. The arrow from "biology textbook" to "chemistry textbook" is roughly the
                same as the arrow from "history of biology" to "history of chemistry" — because
                both arrows point in the "same academic domain, different topic" direction.
                <br /><br />
                Word embeddings have the same property. The arrow from "king" to "queen" is
                roughly parallel to the arrow from "man" to "woman." The arrow from "dog" to "puppy"
                is roughly parallel to "cat" to "kitten." These parallel arrows are the famous
                analogy arithmetic.
            </Analogy>

            <Analogy label="Why Embeddings Encode Bias">
                The library has a troubling property: it reflects the books it learned from.
                If most books describe nurses as women and engineers as men, then "nurse" will
                sit closer to "woman" and "engineer" closer to "man" in the library-space —
                even though there's no reason for this beyond historical imbalance.
                <br /><br />
                The embedding space is a mirror of human language as it was written, with all
                its biases intact. Researchers have to actively work to remove these biases,
                or they get passed on to every AI system that uses these embeddings.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Cosine similarity, analogy arithmetic, and semantic subspaces</h2>

            <h3>Cosine Similarity</h3>
            <p>
                Two vectors are similar if they point in the same direction — regardless of
                their magnitude (length). Cosine similarity measures the angle between vectors:
            </p>
            <MathBlock tex="\text{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \cdot \|\mathbf{v}\|} = \cos\theta" />
            <p>
                Range: [−1, 1]. sim = 1: identical direction. sim = 0: orthogonal (unrelated).
                sim = −1: opposite. For word embeddings, most similarities are in [0, 0.9].
            </p>

            <h3>Nearest Neighbor Search</h3>
            <p>
                Given a query vector q, find the k words with highest cosine similarity:
            </p>
            <MathBlock tex="\text{NN}_k(q) = \arg\max_{w \neq q} \text{sim}(q, e_w)" />
            <p>
                For large vocabularies (100K+ words), approximate nearest neighbor methods
                (FAISS, HNSW) are used instead of exact search.
            </p>

            <h3>Analogy via Vector Arithmetic</h3>
            <p>
                The classic analogy task: a:b::c:? (a is to b as c is to d). Solution:
            </p>
            <MathBlock tex="d = \arg\max_{w \notin \{a,b,c\}} \text{sim}(e_w,\; e_b - e_a + e_c)" />
            <p>
                This works because the vector e<sub>b</sub> − e<sub>a</sub> encodes the
                "relationship" from a to b. Adding it to e<sub>c</sub> points toward
                a word with the same relationship to c.
            </p>

            <h3>The Gender Direction (Bolukbasi et al., 2016)</h3>
            <p>
                Identify the gender direction by taking differences of gendered word pairs:
            </p>
            <MathBlock tex="g = \frac{1}{|S|}\sum_{(w_m, w_f) \in S} (e_{w_m} - e_{w_f})" />
            <p>
                where S = {'{'}(man, woman), (he, she), (king, queen), ...{'}'}. To debias a
                gender-neutral word w: project out the gender component:
            </p>
            <MathBlock tex="e_w^{\text{debiased}} = e_w - \frac{e_w \cdot g}{\|g\|^2} g" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Intrinsic vs extrinsic evaluation:</strong> Intrinsic evaluation measures
                cosine similarity against human-rated word pairs (WordSim-353) or analogy accuracy
                (Google Analogy Test). Extrinsic evaluation tests embeddings as features in downstream
                tasks (POS tagging, NER, sentiment). The two don't always agree — good intrinsic
                scores don't guarantee good extrinsic performance.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Linear structure, probing classifiers, and isotropy</h2>

            <DefBlock label="Linear Substructure Theorem (informal)">
                For embedding function e: V → ℝ<sup>d</sup>, a relationship R holds linearly if
                there exists a direction r ∈ ℝ<sup>d</sup> such that for all (a, b) ∈ R:
                e(b) − e(a) ≈ r. Equivalently: e(b) ≈ e(a) + r.
                <br /><br />
                In practice, this approximation holds with cosine similarity ≈ 0.8–0.95 for
                well-defined relationships (gender, nationality, verb tense).
            </DefBlock>

            <h3>Why Does Linear Structure Emerge?</h3>
            <p>
                Skip-gram with negative sampling approximately factorizes the PPMI matrix:
            </p>
            <MathBlock tex="e_{w_i} \cdot e_{w_j} \approx \text{PPMI}(w_i, w_j) = \max(0, \log\frac{P(w_i, w_j)}{P(w_i)P(w_j)})" />
            <p>
                The pointwise mutual information has a linear relationship with co-occurrence ratios.
                For a relationship R (e.g., gender), the co-occurrence patterns of (king, man, history, ...)
                shift systematically to (queen, woman, history, ...) — because the contexts are
                similar except for gendered words. This systematic shift produces a consistent
                direction in PPMI space, which the embedding inherits.
            </p>

            <h3>Isotropy and Anisotropy</h3>
            <p>
                Let Σ = (1/|V|)Σ<sub>w</sub> e<sub>w</sub>e<sub>w</sub><sup>T</sup> be the
                covariance of word embeddings. An isotropic distribution has Σ = σ²I. In practice:
            </p>
            <MathBlock tex="\mathbb{E}[\text{sim}(e_u, e_v)] = \frac{1}{|V|^2} \sum_{u,v} \frac{e_u^\top e_v}{\|e_u\|\|e_v\|} \approx 0.6" />
            <p>
                Much higher than the expected 0 for an isotropic distribution. This means random
                word pairs appear "related" — the similarity score is inflated across the board.
            </p>

            <h3>Post-Processing: All-but-the-Top (Mu & Viswanath, 2018)</h3>
            <MathBlock tex="e_w \leftarrow e_w - \mu - \sum_{i=1}^{D} (e_w \cdot u_i) u_i" />
            <p>
                where μ is the mean embedding, and u<sub>1</sub>, ..., u<sub>D</sub> are the top-D
                principal components. Removing the mean and top D=1–5 PCA directions substantially
                improves downstream task performance.
            </p>

            <div className="ch-callout">
                <strong>Probing classifiers:</strong> To test what information is encoded in
                embeddings, train a linear classifier f(e<sub>w</sub>) to predict a linguistic
                property (POS tag, word frequency, semantic category). If a simple linear classifier
                achieves high accuracy, the property is linearly encoded in the embedding.
                This probing methodology was developed during 2018–2019 to understand both static
                and contextual embeddings (BERT probing became a major research direction).
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.decomposition import PCA

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
    return a @ b / denom if denom > 0 else 0.0

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
    print(f"  {eq:30s} ≈ {result[0][0]} ({result[0][1]:.4f})")

# ── Gender direction and debiasing ────────────────────────────────────────────
print()
print("Gender Direction Analysis")
print("=" * 60)
gender_pairs = [("king", "queen"), ("man", "woman"), ("prince", "princess")]
gender_dir = np.mean([words[m] - words[f] for m, f in gender_pairs], axis=0)
gender_dir /= np.linalg.norm(gender_dir)
print(f"Gender direction (male - female): {gender_dir.round(3)}")
print()
for word in ["king", "queen", "man", "woman", "france", "cat", "democracy"]:
    proj = words[word] @ gender_dir
    print(f"  {word:12s}: projection onto gender dir = {proj:.4f} "
          f"({'male-leaning' if proj > 0.1 else 'female-leaning' if proj < -0.1 else 'neutral'})")

# ── Isotropy analysis ─────────────────────────────────────────────────────────
print()
print("Isotropy: Average Cosine Similarity Between Random Pairs")
print("=" * 60)
all_sims = []
for i in range(len(vocab)):
    for j in range(i+1, len(vocab)):
        all_sims.append(cosine_sim(embeddings[i], embeddings[j]))
print(f"Mean similarity: {np.mean(all_sims):.4f} (0 = isotropic, high = anisotropic)")
print(f"Std similarity:  {np.std(all_sims):.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                Analysis of embedding geometry: cosine similarity, analogy arithmetic, gender
                direction extraction and debiasing, and isotropy measurement. All demonstrated
                on a carefully crafted 8-dimensional toy embedding space.
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
    maths: <MathsTab />,
    python: <PythonTab />,
}
