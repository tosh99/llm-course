import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Timeline ──────────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    body: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-body">{item.body}</div>
        </div>
    )
}

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1972 &ndash; 2010",
            title: "Sparse Retrieval Era &mdash; TF-IDF and BM25",
            body:
                "TF-IDF (Term Frequency&ndash;Inverse Document Frequency) scored documents by keyword frequency weighted by rarity: common words like &ldquo;the&rdquo; received low weight; rare words like &ldquo;photosynthesis&rdquo; received high weight. BM25 (Robertson et al., 1994) improved TF-IDF with document length normalisation and a saturation term that dampened the benefit of repeated keywords beyond a threshold. BM25 remained the standard retrieval baseline for 30 years because it was fast, interpretable, and surprisingly effective for many queries. Its fundamental limitation: it can only find documents that share exact keywords with the query &mdash; synonyms, paraphrases, and semantic variation are invisible to it.",
        },
        {
            year: "2013 &ndash; 2019",
            title: "Neural IR &mdash; Learned Representations on Top of BM25",
            body:
                "Word2Vec embeddings were used to expand query terms by finding synonyms in embedding space, partially patching BM25&rsquo;s vocabulary mismatch problem. DeepRank (Pang et al., 2017) applied neural networks to re-rank the top-1000 BM25 candidates by modelling fine-grained query-passage interaction. BERT-based re-rankers (Nogueira &amp; Cho, 2019) fine-tuned BERT to score (query, passage) pairs as a binary relevance classification, achieving substantial improvements over BM25 re-ranking alone. These neural methods improved precision but shared a structural weakness: all relied on BM25 for first-stage retrieval. If the answer was not in BM25&rsquo;s top-1000 &mdash; because the passage used different vocabulary from the query &mdash; no amount of re-ranking could recover it.",
        },
        {
            year: "2020",
            title: "DPR &mdash; Karpukhin et al. (Facebook AI Research)",
            body:
                "&ldquo;Dense Passage Retrieval for Open-Domain Question Answering&rdquo; replaced the sparse-retrieval bottleneck with a fully learned approach. The key insight: train two separate BERT encoders &mdash; a query encoder E_Q and a passage encoder E_P &mdash; with contrastive loss. Positive (query, passage) pairs (where the passage contains the answer) are trained to have high inner product; hard negative pairs (passages retrieved by BM25 that look relevant but do not contain the answer) are trained to have low inner product. All 21 million Wikipedia passages were pre-encoded offline and stored in a FAISS flat index. At inference, the query is encoded in ~5ms and top-k passages retrieved via maximum inner product search (MIPS) in ~1ms. DPR achieved Recall@20 of 79.4% on NaturalQuestions vs. BM25&rsquo;s 59.1% &mdash; a 20-point improvement.",
        },
        {
            year: "2020",
            title: "Hard Negative Mining &mdash; The Critical Training Detail",
            body:
                "Not all negatives are equal. Random negatives &mdash; passages on unrelated topics &mdash; are trivially easy for the model to reject. Hard negatives are passages that seem relevant on the surface but do not contain the answer: a passage about Napoleon retrieved for the query &ldquo;Who led France in 1789?&rdquo; is a hard negative (the answer is Louis XVI). The DPR paper showed that training with in-batch negatives (other passages in the same mini-batch) plus BM25-mined hard negatives was essential: without hard negatives, DPR&rsquo;s advantage over BM25 largely disappeared. Hard negative mining is the single most impactful training decision in the DPR recipe.",
        },
        {
            year: "2021",
            title: "REALM &mdash; Joint Retriever&ndash;Reader Pre-Training",
            body:
                "REALM (Guu et al.) addressed a limitation of DPR: its retriever was trained on QA supervision, so it only learned to retrieve answer-containing passages for factoid questions. REALM pre-trained the retriever jointly with a masked language model reader: some masked tokens in the pre-training corpus required document retrieval to predict correctly. The joint training signal &mdash; &ldquo;retrieve documents that help predict masked tokens&rdquo; &mdash; produced a retriever that generalised to downstream QA tasks with less fine-tuning data. REALM demonstrated that retrieval could be integrated into pre-training itself, not just fine-tuning.",
        },
        {
            year: "2022",
            title: "ColBERT &mdash; Late Interaction and Per-Token Vectors",
            body:
                "ColBERT (Khattab &amp; Zaharia, 2020) replaced DPR&rsquo;s single 768-dimensional query and passage vectors with sets of per-token vectors. Scoring was via MaxSim: for each query token, find the most similar passage token; sum these maximum similarities across all query tokens. This &ldquo;late interaction&rdquo; is richer than DPR&rsquo;s single dot-product because it allows each query term to find its best-matching passage term independently. ColBERTv2 (2022) added denoised supervision and residual compression to address ColBERT&rsquo;s storage overhead (~28 bytes/token vs. one 768-dim vector per passage for DPR), achieving +5&ndash;8% Recall@10 over DPR at comparable storage.",
        },
        {
            year: "2023",
            title: "REPLUG &mdash; LLM Perplexity as Retriever Training Signal",
            body:
                "REPLUG (Shi et al., 2023) and similar work recognised that retrieval quality should ultimately be judged by whether retrieved passages help the language model generate correct answers &mdash; not by whether they contain the answer as a literal string. REPLUG used LLM perplexity as a training signal: passages that reduced the LLM&rsquo;s perplexity on the target answer (i.e., made the model more confident about the correct output) were treated as positive examples; others as negatives. This creates an end-to-end training signal that aligns retrieval quality with generation quality without requiring explicit QA supervision labels, enabling retriever fine-tuning for any generative task.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
            <div className="ch-callout">
                <strong>The trajectory:</strong> Retrieval evolved from exact keyword matching (BM25)
                to learned semantic similarity (DPR) to per-token late interaction (ColBERT) to
                end-to-end alignment with generation quality (REPLUG). Each step loosened the
                requirement that retrieval and generation share the same vocabulary &mdash; moving
                toward systems where the retriever learns what the generator needs.
            </div>
        </div>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Dense Passage Retrieval: Finding Answers by Meaning, Not Keywords</h2>

            <p className="ch-story-intro">
                Imagine a library with 21 million books. A question comes in. You have one second
                to find the right page. How do you do it? For 30 years, computers searched by
                matching words. DPR taught computers to search by meaning instead &mdash; and it
                made a difference of 20 percentage points on one of the hardest reading
                comprehension tests in AI.
            </p>

            <Analogy label="Meaning vs. Keywords">
                BM25 looks for the exact words you typed. DPR looks for the meaning. If you
                search for &ldquo;managing blood sugar,&rdquo; BM25 finds documents containing those
                words. DPR finds documents about &ldquo;diabetes treatment&rdquo; and &ldquo;insulin
                management&rdquo; &mdash; because they mean the same thing, even if the words are
                completely different. The shift from keywords to meaning is the entire story of
                DPR in one sentence.
            </Analogy>

            <Analogy label="Two Brains That Learn Together">
                DPR trains two &ldquo;brains&rdquo; simultaneously: one that understands questions,
                one that understands passages. They are trained to agree on which questions and
                passages belong together. After training, if you ask &ldquo;Who invented the
                telephone?&rdquo; and there is a passage saying &ldquo;Alexander Graham Bell
                patented his invention in 1876,&rdquo; the question&rsquo;s brain and the passage&rsquo;s
                brain will produce numbers that are very similar &mdash; close together in what
                researchers call &ldquo;meaning space.&rdquo; Wrong passages will produce numbers
                that are far apart.
            </Analogy>

            <Analogy label="The Encyclopedia Vector">
                Every Wikipedia passage gets compressed to a single list of 768 numbers &mdash;
                its &ldquo;meaning fingerprint.&rdquo; All 21 million passages. When you ask a
                question, your question also gets compressed to 768 numbers. Then the computer
                finds which of the 21 million fingerprints is most similar to your question&rsquo;s
                fingerprint &mdash; and returns that passage. The remarkable part: this entire
                search takes about one millisecond.
            </Analogy>

            <Analogy label="Hard Negatives: Learning from Mistakes">
                Easy negatives are obviously wrong: &ldquo;What color is the sky?&rdquo; is
                unrelated to &ldquo;The French Revolution.&rdquo; DPR already knows these are
                different &mdash; training on them teaches nothing. Hard negatives are the
                tricky ones: a passage about Napoleon retrieved for &ldquo;Who led France in
                1789?&rdquo; looks relevant but is wrong (the answer is Louis XVI). Training on
                these &ldquo;close but wrong&rdquo; examples is what forces DPR to learn real
                semantic distinctions, rather than just learning that random topics are different.
                Without hard negatives, DPR barely outperforms the old keyword search.
            </Analogy>

            <Analogy label="FAISS: The Ultrafast Nearest-Neighbor">
                You have 21 million fingerprints. Finding the 10 closest to your question
                normally requires comparing all 21 million &mdash; billions of arithmetic
                operations per query. FAISS uses approximation: it groups all fingerprints into
                clusters, and when a new question arrives, it only searches the few most
                promising clusters. This finds the approximate top-10 in milliseconds &mdash;
                missing the true nearest neighbor less than 10% of the time, which is an
                acceptable trade-off for a 1,000&times; speedup.
            </Analogy>

            <Analogy label="ColBERT: Every Word Gets Its Own Vector">
                DPR encodes an entire passage as ONE 768-number fingerprint. ColBERT gives
                every word in the passage its own 128-number fingerprint. To score a query
                against a passage, ColBERT finds the best-matching passage word for each
                query word and sums these scores. This is more expressive &mdash; the word
                &ldquo;bank&rdquo; in your query can match the word &ldquo;financial institution&rdquo;
                in the passage at the word level, not just at the document level. The cost:
                you need to store roughly 28 bytes per word rather than one fingerprint per
                passage.
            </Analogy>

            <div className="ch-callout">
                <strong>The punchline:</strong> BM25 had a Recall@20 of 59% on NaturalQuestions
                &mdash; meaning 41% of the time, the correct answer passage was not even in the
                top 20 retrieved documents. DPR raised this to 79%. That 20-point gap represents
                millions of questions where the old system&rsquo;s failure to match keywords made
                correct answers unreachable, no matter how good the reading model was.
            </div>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Dense Passage Retrieval: Architecture, Training, and Evaluation</h2>

            <p>
                DPR replaces sparse retrieval (BM25) with a learned bi-encoder that maps queries
                and passages into a shared dense embedding space. Retrieval is then maximum inner
                product search (MIPS) over pre-computed passage embeddings. The architecture is
                simple; the training details &mdash; particularly hard negative mining &mdash; are
                what make it work.
            </p>

            <h3>Bi-Encoder Architecture</h3>
            <p>
                Two independent BERT-base encoders produce d&thinsp;=&thinsp;768-dimensional
                representations from the [CLS] token:
            </p>
            <MathBlock tex="E_Q(q) \in \mathbb{R}^d, \quad E_P(p) \in \mathbb{R}^d" />
            <MathBlock tex="\text{sim}(q, p) = E_Q(q)^\top E_P(p)" />
            <p>
                Retrieval selects the top-k passages by maximum inner product:
            </p>
            <MathBlock tex="\hat{p}_1, \ldots, \hat{p}_k = \operatorname*{arg\,top\text{-}k}_{p \in \mathcal{P}}\; E_Q(q)^\top E_P(p)" />
            <p>
                All passages are pre-encoded offline and stored in a FAISS index. At inference:
                query encoding takes ~5ms; FAISS retrieval takes ~1ms. The two encoders are
                never applied jointly to a (query, passage) pair &mdash; this is what distinguishes
                a bi-encoder from a cross-encoder re-ranker (which is more accurate but cannot
                be pre-computed).
            </p>

            <h3>Contrastive Training Loss</h3>
            <p>
                For a mini-batch of B (query, positive passage) pairs &#123;(q_i, p_i&#x207A;)&#125;,
                in-batch negatives treat every other passage p_j (j &ne; i) as a negative for
                query q_i. The loss is a softmax cross-entropy over the B candidates:
            </p>
            <MathBlock tex="\mathcal{L}_\text{DPR} = -\sum_{i=1}^{B} \log \frac{\exp\!\bigl(\text{sim}(q_i, p_i^+)/\tau\bigr)}{\exp\!\bigl(\text{sim}(q_i, p_i^+)/\tau\bigr) + \displaystyle\sum_{j \neq i} \exp\!\bigl(\text{sim}(q_i, p_j)/\tau\bigr)}" />
            <p>
                Hard negatives (BM25-retrieved passages that do not contain the answer) are
                added to each row of the similarity matrix. Let p_i&#x207B; denote the hard
                negative for query i. The augmented loss adds a term penalising high similarity
                with hard negatives:
            </p>
            <MathBlock tex="\mathcal{L}_\text{hard} = \mathcal{L}_\text{DPR} + \lambda \sum_{i=1}^{B} \max\!\bigl(0,\; \text{sim}(q_i, p_i^-) - \text{sim}(q_i, p_i^+) + \Delta\bigr)" />
            <p>
                The DPR paper found that using one hard negative per question (in addition to
                in-batch negatives from a batch size of 128) gave the best Recall@k trade-off.
            </p>

            <h3>BM25 vs. DPR &mdash; Recall@k on Open-Domain QA</h3>
            <p>
                Recall@k measures whether the correct answer passage appears in the top-k
                retrieved documents:
            </p>
            <MathBlock tex="\text{Recall}@k = \frac{1}{|Q|} \sum_{q \in Q} \mathbf{1}\!\left[\exists\, p \in \text{top-}k(q) : \text{answer} \in p\right]" />
            <p>
                On NaturalQuestions (open-domain split): BM25 Recall@20 = 59.1%; DPR Recall@20 = 79.4%.
                On TriviaQA (open-domain split): BM25 Recall@20 = 66.9%; DPR Recall@20 = 79.4%.
                DPR gains are largest for paraphrased queries, where BM25 keyword matching fails
                but semantic similarity succeeds. DPR&rsquo;s advantage shrinks for exact-match
                queries where both methods work equally well.
            </p>

            <DefBlock label="Why Recall@k, Not Precision?">
                In open-domain QA, retrieval is a pipeline stage: retrieved passages are fed to
                a reader model (e.g., a BERT extractive reader or a generative LM). The reader
                can process k passages and find the answer within them. If the correct passage is
                not in the top-k, the reader cannot recover it. Recall@k directly measures the
                retriever&rsquo;s failure rate as a ceiling on downstream QA accuracy &mdash;
                which is why it is the primary evaluation metric.
            </DefBlock>

            <h3>FAISS Indexing &mdash; Approximate Nearest-Neighbor Search</h3>
            <p>
                Flat L2 index: exact search over all N&thinsp;=&thinsp;21M vectors, O(Nd) per
                query &mdash; too slow for production. Two approximation layers:
            </p>
            <ul>
                <li>
                    <strong>IVF (Inverted File Index):</strong> Cluster the N vectors into
                    C centroids (typically C = 4096). At query time, identify the nearest
                    &radic;C centroids and search only those clusters. Reduces effective
                    search space from N to ~N/&radic;C per query.
                </li>
                <li>
                    <strong>PQ (Product Quantization):</strong> Split each 768-dim vector
                    into M sub-vectors (e.g., M&thinsp;=&thinsp;96) and quantize each
                    sub-vector to one of 256 centroids using 8 bits. Compression ratio:
                </li>
            </ul>
            <MathBlock tex="\text{compression ratio} = \frac{d \cdot 32\text{ bits}}{M \cdot 8\text{ bits}} = \frac{768 \times 32}{96 \times 8} = 32\times" />
            <p>
                Combined IVF-PQ: 21M passages fit in ~3GB RAM (vs. ~64GB for the full
                float32 index) with less than 10% recall loss vs. exact search.
            </p>

            <h3>ColBERT &mdash; Late Interaction</h3>
            <p>
                ColBERT represents queries and passages as matrices of per-token vectors rather
                than single pooled vectors:
            </p>
            <MathBlock tex="Q = [q_1, \ldots, q_{|Q|}] \in \mathbb{R}^{|Q| \times d}, \quad P = [p_1, \ldots, p_{|P|}] \in \mathbb{R}^{|P| \times d}" />
            <p>
                The relevance score uses MaxSim aggregation &mdash; for each query token, find
                its best-matching passage token:
            </p>
            <MathBlock tex="S(Q, P) = \sum_{i=1}^{|Q|} \max_{j=1}^{|P|} \; q_i \cdot p_j" />
            <p>
                This &ldquo;late interaction&rdquo; is strictly richer than DPR&rsquo;s single
                dot-product: each query term independently finds its best match in the passage,
                allowing fine-grained token-level alignment. ColBERTv2 achieves +5&ndash;8%
                Recall@10 vs. DPR. Storage: ~28 bytes/token &times; ~100 tokens/passage &times;
                21M passages &asymp; 59GB, comparable to DPR&rsquo;s ~64GB for exact float32
                storage but using significantly smaller per-vector dimension (d&thinsp;=&thinsp;128
                in ColBERT vs. 768 in DPR).
            </p>

            <div className="ch-callout">
                <strong>The bi-encoder trade-off:</strong> Cross-encoders (BERT applied jointly
                to query + passage) are more accurate than bi-encoders because they model
                fine-grained interaction between query and passage tokens. But they cannot be
                pre-computed: every (query, passage) pair must be re-encoded at query time, making
                them O(N) per query. Bi-encoders sacrifice some accuracy for O(1) retrieval after
                pre-encoding. ColBERT&rsquo;s late interaction is a middle ground: passage vectors
                are pre-computed token-by-token, and only the MaxSim aggregation happens at query
                time.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Contrastive loss gradient &middot; hard negative mining &middot; FAISS IVF-PQ complexity</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Python &middot; minimal DPR system &middot; FAISS index &middot; Recall@k evaluation</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>DPR: Mathematical Details</h2>

            <h3>Gradient of the Contrastive Loss</h3>
            <p>
                Let s_i&#x207A;&thinsp;=&thinsp;sim(q_i, p_i&#x207A;) and s_ij&thinsp;=&thinsp;sim(q_i, p_j)
                for j&thinsp;&ne;&thinsp;i. The softmax probability of the correct passage is:
            </p>
            <MathBlock tex="P_i = \frac{\exp(s_i^+)}{\exp(s_i^+) + \sum_{j \neq i} \exp(s_{ij})}" />
            <p>The gradient with respect to the positive similarity s_i&#x207A; is:</p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial s_i^+} = -(1 - P_i)" />
            <p>
                The gradient pushes s_i&#x207A; upward in proportion to how far P_i is below 1
                (i.e., how uncertain the model is about the correct passage). For a hard negative
                p_i&#x207B; with similarity s_i&#x207B;, the gradient:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial s_i^-} = P_i^- = \frac{\exp(s_i^-)}{\exp(s_i^+) + \sum_{j \neq i} \exp(s_{ij}) + \exp(s_i^-)}" />
            <p>
                This is large when the hard negative is ranked high (s_i&#x207B;&thinsp;&asymp;&thinsp;s_i&#x207A;),
                giving the largest training signal precisely for the examples where the model is
                most confused &mdash; the intended behaviour of hard negative mining.
            </p>

            <h3>Asymptotic Complexity: FAISS IVF-PQ vs. Flat Search</h3>
            <p>
                Let N = number of passages, d = embedding dimension, C = number of IVF centroids,
                M = number of PQ sub-quantizers, k = number of retrieved passages.
            </p>
            <MathBlock tex="\text{Flat (exact): } O(Nd) \text{ per query}" />
            <MathBlock tex="\text{IVF (approximate): } O(Cd + \tfrac{N}{C} \cdot d) \approx O(\sqrt{N} \cdot d) \text{ for } C = \sqrt{N}" />
            <MathBlock tex="\text{IVF-PQ: } O(\sqrt{N} \cdot M) \text{ with PQ lookup tables}" />
            <p>
                For N&thinsp;=&thinsp;21M, d&thinsp;=&thinsp;768, C&thinsp;=&thinsp;4096:
                flat search requires ~16 billion multiplications per query. IVF reduces this
                to ~4M candidate vectors in the searched clusters. PQ further replaces each
                multiplication with a table lookup, reducing arithmetic cost by ~32&times;.
                Combined, IVF-PQ is approximately 4,000&times; faster than flat search for
                DPR&rsquo;s Wikipedia index.
            </p>

            <h3>Product Quantization: Compression and Distortion</h3>
            <p>
                A vector x&thinsp;&isin;&thinsp;&Ropf;^d is split into M sub-vectors x&thinsp;=&thinsp;[x_1,...,x_M],
                each x_m&thinsp;&isin;&thinsp;&Ropf;^(d/M). Each sub-vector is quantized to the nearest
                centroid in a codebook C_m of size K&thinsp;=&thinsp;256:
            </p>
            <MathBlock tex="\hat{x}_m = \operatorname*{arg\,min}_{c \in \mathcal{C}_m} \|x_m - c\|^2" />
            <p>
                The quantization distortion (expected squared error) is bounded by the within-cluster
                variance of each sub-codebook. The dot product between query q and compressed passage
                &hat;x is approximated using precomputed lookup tables:
            </p>
            <MathBlock tex="q \cdot \hat{x} \approx \sum_{m=1}^{M} q_m \cdot \hat{x}_m" />
            <p>
                where q_m&thinsp;&middot;&thinsp;&hat;x_m is looked up from a precomputed M&times;256 table of
                partial dot products. This reduces inner product computation from d multiplications
                to M table lookups &mdash; a factor-of-(d/M) = 8 arithmetic reduction for d&thinsp;=&thinsp;768,
                M&thinsp;=&thinsp;96.
            </p>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from dataclasses import dataclass
from typing import List, Tuple

# ── DPR System (minimal, using sentence-transformers as encoder) ───────────────

@dataclass
class Passage:
    id: int
    text: str

@dataclass
class QAPair:
    question: str
    answer: str          # substring that must appear in the correct passage

class DPRRetriever:
    """
    Minimal DPR-style retriever:
      - Encode passages offline into a FAISS index.
      - At query time, encode the question and retrieve top-k passages via MIPS.
    Uses 'multi-qa-mpnet-base-dot-v1' which was trained with a DPR-style
    contrastive objective on QA datasets.
    """

    def __init__(self, model_name: str = "multi-qa-mpnet-base-dot-v1"):
        self.model = SentenceTransformer(model_name)
        self.passages: List[Passage] = []
        self.index: faiss.IndexFlatIP | None = None   # Inner Product (MIPS)

    # ── Offline Indexing ──────────────────────────────────────────────────────

    def index_passages(self, passages: List[Passage]) -> None:
        """Encode all passages and build a FAISS flat inner-product index."""
        self.passages = passages
        texts = [p.text for p in passages]

        print(f"Encoding {len(texts)} passages...")
        embeddings = self.model.encode(
            texts,
            batch_size=64,
            show_progress_bar=True,
            normalize_embeddings=True,   # unit vectors: inner product == cosine sim
            convert_to_numpy=True,
        ).astype(np.float32)

        d = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(d)   # exact MIPS; replace with IVF-PQ for scale
        self.index.add(embeddings)
        print(f"Index built: {self.index.ntotal} vectors, dim={d}")

    # ── Online Retrieval ──────────────────────────────────────────────────────

    def retrieve(self, question: str, k: int = 20) -> List[Tuple[Passage, float]]:
        """Return top-k (passage, score) pairs for a question."""
        assert self.index is not None, "Call index_passages first."

        q_emb = self.model.encode(
            [question],
            normalize_embeddings=True,
            convert_to_numpy=True,
        ).astype(np.float32)

        scores, indices = self.index.search(q_emb, k)   # shape: (1, k)
        return [(self.passages[idx], float(scores[0][rank]))
                for rank, idx in enumerate(indices[0])]

    # ── Evaluation ────────────────────────────────────────────────────────────

    def recall_at_k(self, qa_pairs: List[QAPair], k: int = 20) -> float:
        """
        Recall@k: fraction of questions for which the correct passage
        (containing the answer substring) is in the top-k retrieved passages.
        """
        hits = 0
        for qa in qa_pairs:
            top_k = self.retrieve(qa.question, k=k)
            # A passage is considered correct if it contains the answer string
            if any(qa.answer.lower() in p.text.lower() for p, _ in top_k):
                hits += 1
        return hits / len(qa_pairs)


# ── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Toy corpus: 10 Wikipedia-style passages
    passages = [
        Passage(0, "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It was constructed from 1887 to 1889 as the centerpiece of the 1889 World's Fair."),
        Passage(1, "Alexander Graham Bell was awarded the first patent for the telephone on March 7, 1876. He made the first successful telephone call to his assistant Thomas Watson on the same day."),
        Passage(2, "The speed of light in vacuum is 299,792,458 metres per second, commonly denoted as c. It is a fundamental physical constant and plays a central role in Einstein's special theory of relativity."),
        Passage(3, "William Shakespeare was an English playwright and poet, widely regarded as the greatest writer in the English language. He was born in Stratford-upon-Avon in April 1564."),
        Passage(4, "The Amazon River is the largest river in the world by discharge volume, flowing through South America. The Amazon basin covers 40% of South America's land surface area."),
        Passage(5, "Insulin is a peptide hormone produced by the pancreatic beta cells. It regulates glucose metabolism by promoting cellular glucose uptake and is essential for managing diabetes."),
        Passage(6, "The Great Wall of China is a series of fortifications built across northern China from the 7th century BC. Its construction stretched over many dynasties and rulers."),
        Passage(7, "Marie Curie was a Polish-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize and remains the only person to win the award in two different sciences."),
        Passage(8, "The mitochondrion is a membrane-bound organelle found in eukaryotic cells. Often called the powerhouse of the cell, it generates most of the cell's supply of ATP through oxidative phosphorylation."),
        Passage(9, "The Python programming language was created by Guido van Rossum and was first released in 1991. It emphasises code readability and simplicity, making it widely used in data science and machine learning."),
    ]

    # NQ-style QA pairs
    qa_pairs = [
        QAPair("Who invented the telephone?", "Alexander Graham Bell"),
        QAPair("What is the speed of light?", "299,792,458"),
        QAPair("Where was Shakespeare born?", "Stratford-upon-Avon"),
        QAPair("What hormone manages blood sugar?", "Insulin"),   # paraphrase test
        QAPair("Who won two Nobel Prizes in different sciences?", "Marie Curie"),
    ]

    # Build index
    retriever = DPRRetriever()
    retriever.index_passages(passages)

    # Evaluate Recall@k
    for k in [1, 5, 10]:
        recall = retriever.recall_at_k(qa_pairs, k=k)
        print(f"Recall@{k}: {recall:.1%}")

    # Show retrieval for a paraphrased query (BM25 would fail: no keyword overlap)
    print("\\nQuery: 'What hormone manages blood sugar?'")
    print("(BM25 would miss this: no overlap with 'Insulin...glucose metabolism')")
    for passage, score in retriever.retrieve("What hormone manages blood sugar?", k=3):
        print(f"  score={score:.4f} | {passage.text[:80]}...")`

// ── Python Content ────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                A minimal DPR system using <code>sentence-transformers</code> (which provides a
                model pre-trained with DPR-style contrastive objectives) and FAISS for efficient
                inner product search. Demonstrates offline passage indexing, online retrieval, and
                Recall@k evaluation on NQ-style question&ndash;answer pairs including a paraphrased
                query that BM25 would fail on.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="dpr_retriever.py"
                lang="python"
                langLabel="Python"
            />
            <div className="ch-callout">
                <strong>The paraphrase test:</strong> The query &ldquo;What hormone manages blood
                sugar?&rdquo; contains no words from the correct passage (&ldquo;Insulin is a peptide
                hormone... regulates glucose metabolism...&rdquo;). BM25 would return zero for this
                query against that passage. DPR retrieves it correctly because &ldquo;manages blood
                sugar&rdquo; and &ldquo;regulates glucose metabolism&rdquo; map to nearby points in
                embedding space &mdash; the core capability that motivated the entire paper.
            </div>
        </>
    )
}

// ── Export ────────────────────────────────────────────────────────────────────

export const DENSE_PASSAGE_RETRIEVAL_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
}
