import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `from sentence_transformers import SentenceTransformer, CrossEncoder
from langchain.text_splitter import RecursiveCharacterTextSplitter
import faiss
import numpy as np

# ── Step 1: Parent-child chunking ─────────────────────────────────────────────
raw_text = open("document.txt").read()

# Child splitter: fine-grained sentences for retrieval precision
child_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20,
    separators=["\\n\\n", "\\n", ". ", " "],
)
# Parent splitter: full paragraphs returned to the generator
parent_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    separators=["\\n\\n", "\\n"],
)

parent_chunks = parent_splitter.split_text(raw_text)
# Map each child chunk back to its parent index
child_to_parent: dict[int, int] = {}
child_chunks: list[str] = []

for p_idx, parent in enumerate(parent_chunks):
    children = child_splitter.split_text(parent)
    for child in children:
        child_to_parent[len(child_chunks)] = p_idx
        child_chunks.append(child)

print(f"Parents: {len(parent_chunks)}, Children: {len(child_chunks)}")

# ── Step 2: Embed child chunks with a bi-encoder ──────────────────────────────
bi_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
child_embeddings = bi_encoder.encode(
    child_chunks,
    convert_to_numpy=True,
    normalize_embeddings=True,
    show_progress_bar=True,
)

dim = child_embeddings.shape[1]              # 384
index = faiss.IndexFlatIP(dim)              # cosine sim via normalized inner product
index.add(child_embeddings)

# ── Step 3: Bi-encoder retrieval — fast top-100 ───────────────────────────────
query = "What is the effect of chunk overlap on retrieval recall?"
q_vec = bi_encoder.encode([query], normalize_embeddings=True)

# Retrieve top-100 child chunks via FAISS
k_retrieve = 100
D, I = index.search(q_vec, k_retrieve)
top_child_indices = I[0].tolist()

# Map children to their parent chunks (deduplicating parents)
seen_parents: set[int] = set()
retrieved_parents: list[tuple[int, str]] = []
for child_idx in top_child_indices:
    p_idx = child_to_parent[child_idx]
    if p_idx not in seen_parents:
        seen_parents.add(p_idx)
        retrieved_parents.append((p_idx, parent_chunks[p_idx]))

print(f"Unique parent chunks retrieved: {len(retrieved_parents)}")

# ── Step 4: Cross-encoder re-ranking — accurate top-10 ───────────────────────
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# Cross-encoder scores each (query, parent_chunk) pair jointly
pairs = [(query, parent_text) for _, parent_text in retrieved_parents]
ce_scores = cross_encoder.predict(pairs)

# Sort by cross-encoder score descending
ranked = sorted(
    zip(ce_scores, retrieved_parents),
    key=lambda x: x[0],
    reverse=True,
)
top_k_for_generation = [parent_text for _, (_, parent_text) in ranked[:10]]

print("\\n=== Top-10 Re-ranked Passages ===")
for i, passage in enumerate(top_k_for_generation):
    print(f"\\n[{i+1}] {passage[:200]}...")

# ── Step 5: Lost-in-the-middle mitigation (U-position ordering) ───────────────
# Place the most relevant chunks at the edges of the context, not the middle.
# With 10 passages, interleave: position 0 (most relevant), 9, 1, 8, 2, 7, ...
def u_position_order(passages: list[str]) -> list[str]:
    """Interleave from both ends so top-ranked passages appear at edges."""
    result = []
    left, right = 0, len(passages) - 1
    toggle = True
    while left <= right:
        if toggle:
            result.append(passages[left])
            left += 1
        else:
            result.append(passages[right])
            right -= 1
        toggle = not toggle
    return result

ordered_context = u_position_order(top_k_for_generation)
context_str = "\\n\\n---\\n\\n".join(ordered_context)
print(f"\\nFinal context length: {len(context_str)} chars")

# The generator would now receive:
# prompt = f"Answer the question using the context below.\\n\\n{context_str}\\n\\nQuestion: {query}\\nAnswer:"
`

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Chunking &amp; Re-ranking</h2>
            <p className="ch-story-intro">
                The original RAG paper gave engineers a powerful architecture but left a crucial
                question unanswered: how should documents be split before indexing? The quality
                of a RAG system is determined not just by the retrieval model or the generator
                &mdash; it is determined first and foremost by the granularity and coherence of
                the chunks being retrieved. A brilliant retriever cannot compensate for chunks
                that cut sentences in half. And even when retrieval surfaces the right chunks,
                the order in which they are presented to the generator turns out to matter
                critically. This is the story of how practitioners learned &mdash; through
                failures as much as research &mdash; to engineer RAG pipelines that actually work.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Baseline</div>
                    <div className="ch-tl-title">Fixed-Size Chunking &mdash; the RAG Paper&rsquo;s Default</div>
                    <div className="ch-tl-body">
                        The original DPR+BART RAG system (Lewis et al., 2020) split English
                        Wikipedia into 100-word non-overlapping chunks. This was simple, reproducible,
                        and completely agnostic to document structure. It was also crude: chunks
                        frequently cut mid-sentence, splitting a subject from its verb or a
                        claim from its supporting evidence. A question whose answer spanned two
                        adjacent chunks was nearly irrecoverable &mdash; neither chunk alone
                        contained the full answer, and the retriever had no way to know the two
                        should be read together.
                        <br /><br />
                        Fixed-size chunking became the universal baseline &mdash; and the source
                        of most early RAG quality complaints. Every practical failure mode of
                        naive RAG could be traced back to a chunking decision: chunks too short
                        (context lost), chunks too long (retrieval imprecise, relevant sentence
                        buried), chunks with no overlap (boundary answers missed), chunks that
                        ignore document structure (metadata stripped, tables broken, code split).
                    </div>
                    <div className="ch-tl-impact">Impact: Established fixed-size chunking as the baseline; exposed that chunking strategy is a primary determinant of RAG quality</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Overlap and Context Windows</div>
                    <div className="ch-tl-body">
                        The first practical fix was adding overlap between adjacent chunks. A
                        100-word chunk with a 20-word overlap means the last 20 words of chunk
                        k are repeated as the first 20 words of chunk k+1. Any sentence that
                        falls near a boundary now appears in at least one complete chunk, improving
                        the probability that the retriever surfaces the full relevant context.
                        Empirically, 15&ndash;25% overlap substantially improved retrieval recall
                        on QA benchmarks without requiring any changes to the retriever.
                        <br /><br />
                        The trade-off was explicit and quantifiable: overlap creates redundant
                        content. A 20-word overlap on 100-word chunks increases the index size
                        by a factor of 100/(100&minus;20)&nbsp;=&nbsp;1.25 and increases context
                        window usage when the retrieved chunks are concatenated for the generator.
                        For most use cases, this was an acceptable cost for substantially better
                        recall.
                    </div>
                    <div className="ch-tl-impact">Impact: Overlap became a standard RAG hyperparameter; practitioners learned to tune chunk size and overlap jointly against a retrieval recall benchmark</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Semantic Chunking</div>
                    <div className="ch-tl-title">Splitting at Natural Semantic Boundaries</div>
                    <div className="ch-tl-body">
                        Instead of splitting at fixed word counts, semantic chunking splits at
                        detected topical boundaries. The most common approach: encode each sentence
                        as an embedding, compute the cosine similarity between adjacent sentence
                        embeddings, and split wherever similarity drops below a threshold &mdash;
                        indicating a topic shift. This produces variable-size chunks that are
                        semantically coherent: each chunk contains one idea, not half of two.
                        <br /><br />
                        Alternative signals for semantic split points include paragraph breaks,
                        section headings, or dedicated topic segmentation models (TextTiling,
                        BERTopic). The improvement over fixed-size chunking was most pronounced
                        for long, multi-topic documents (research papers, legal contracts, books)
                        where fixed-size chunks frequently straddle topic changes. For short,
                        single-topic documents (FAQ entries, product descriptions), the benefit
                        was marginal.
                    </div>
                    <div className="ch-tl-impact">Impact: Semantic chunking improved retrieval precision for multi-topic documents; became the default in production pipelines for long-form content</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Re-ranking</div>
                    <div className="ch-tl-title">Cross-Encoder Re-ranking &mdash; MonoT5 and ColBERT</div>
                    <div className="ch-tl-body">
                        Bi-encoders (DPR) encode the query and each passage independently, then
                        score them by inner product. This enables O(1) per-pair scoring after
                        indexing but limits interaction between query and passage tokens to a
                        single dot product. Cross-encoders take the query and passage
                        <em>together</em> as a single sequence, allowing every query token to
                        attend to every passage token. This richer interaction substantially
                        improves scoring accuracy.
                        <br /><br />
                        MonoT5 (Nogueira et al., 2020): fine-tune T5 on (query, passage) pairs
                        to classify relevance. The cross-encoder scores passages one at a time,
                        so inference is ~100&times; slower than bi-encoder retrieval. The solution:
                        use the bi-encoder to retrieve the top-100 candidates in milliseconds
                        (fast but less accurate), then use the cross-encoder to re-rank only
                        those 100 (slow but accurate), returning the top-10 to the generator.
                        ColBERT (Khattab &amp; Zaharia, 2020) occupied a middle ground: late
                        interaction between per-token embeddings, more expressive than bi-encoder
                        but faster than cross-encoder. Both became standard production components.
                    </div>
                    <div className="ch-tl-impact">Impact: Two-stage retrieval (bi-encoder + cross-encoder re-ranking) became the standard architecture for high-quality RAG systems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Architecture</div>
                    <div className="ch-tl-title">Parent-Child Chunking and Sentence-Window Retrieval</div>
                    <div className="ch-tl-body">
                        A key insight: the optimal chunk size for retrieval is not the same as
                        the optimal chunk size for generation. Small chunks are better for retrieval
                        precision (each chunk contains one specific idea, making matching more
                        accurate). Large chunks are better for generation context (the generator
                        needs surrounding sentences to understand the retrieved fact in context).
                        <br /><br />
                        Parent-child chunking reconciles this: index fine-grained child chunks
                        (single sentences, 100&ndash;200 tokens) for retrieval. When a child chunk
                        is retrieved, return its parent chunk (the surrounding paragraph, 500&ndash;1000
                        tokens) to the generator. The retriever operates at the precision of
                        sentences; the generator receives the context of paragraphs.
                        Sentence-window retrieval is the simplest variant: retrieve the matched
                        sentence, then expand the returned context to include the surrounding
                        &plusmn;k sentences. LlamaIndex popularized both patterns as first-class
                        retriever abstractions in 2023.
                    </div>
                    <div className="ch-tl-impact">Impact: Parent-child chunking is now the default for production RAG over long documents; sentence-window retrieval is the go-to for simpler deployments</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Problem</div>
                    <div className="ch-tl-title">Lost in the Middle &mdash; Liu et al.</div>
                    <div className="ch-tl-body">
                        Liu et al. (2023) ran a controlled experiment: place a relevant document
                        at positions 1, 5, 10, 15, and 20 within a 20-document context, and
                        measure LLM accuracy across positions. The result was a U-shaped
                        performance curve: accuracy was highest when the relevant document was
                        at position 1 (beginning of context) or position 20 (end of context),
                        and dropped by as much as 30 percentage points when it was at positions
                        10&ndash;15 (buried in the middle).
                        <br /><br />
                        This had direct, urgent implications for RAG: re-ranking for relevance
                        was necessary but not sufficient. Even with a perfect re-ranker, the
                        presentation order to the generator determined whether the retrieved
                        information was actually used. Mitigation strategies included recency
                        ordering (most relevant chunk placed last, exploiting recency bias in
                        attention), U-position ordering (most relevant chunks placed at both
                        the start and end of context), and duplicate injection (copy the top-1
                        chunk at both positions).
                    </div>
                    <div className="ch-tl-impact">Impact: Established that context ordering is a first-class engineering concern in RAG; practitioners added position-aware ordering as a post-re-ranking step</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023 &ndash; 2024</div>
                    <div className="ch-tl-section-label">Advanced Strategies</div>
                    <div className="ch-tl-title">HyDE, Multi-Query, and Contextual Retrieval</div>
                    <div className="ch-tl-body">
                        <strong>HyDE</strong> (Hypothetical Document Embedding, Gao et al., 2022):
                        instead of embedding the raw query, prompt the LLM to generate a hypothetical
                        answer, then embed that. Hypothetical answers use the vocabulary and
                        phrasing of actual answers, making the retrieval vector more similar
                        to real answer passages than the question vector was. HyDE improved
                        recall particularly for abstract or underspecified queries.
                        <br /><br />
                        <strong>Multi-query retrieval</strong>: rewrite the query 3&ndash;5 different
                        ways (different vocabulary, different phrasing, different scope), retrieve
                        for each rewritten query, union the results. Reciprocal Rank Fusion (RRF)
                        combines the per-query rankings into a single ranking. Recall improves
                        because different phrasings surface documents with different vocabulary.
                        <br /><br />
                        <strong>Contextual retrieval</strong> (Anthropic, 2024): before embedding
                        each chunk, prepend a short, chunk-specific context generated by a
                        large model describing what document the chunk comes from and what its
                        role within that document is. This enriches each chunk&rsquo;s embedding
                        with document-level metadata, improving retrieval accuracy by 35&ndash;49%
                        on internal benchmarks. The additional cost is one LLM call per chunk
                        during indexing &mdash; a one-time cost amortized over many queries.
                    </div>
                    <div className="ch-tl-impact">Impact: HyDE and multi-query retrieval became standard retrieval augmentations; contextual retrieval became the state-of-the-art chunk preparation technique for production RAG in 2024</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The engineering lesson:</strong> In production RAG systems, the retriever
                architecture and generator choice are rarely the bottleneck. The bottleneck is
                almost always chunking quality, re-ranking, and context ordering &mdash; three
                components that require no ML training and no GPU, only careful engineering.
                A well-chunked, well-re-ranked, well-ordered RAG pipeline with a mediocre
                embedding model will outperform a poorly chunked pipeline with a state-of-the-art
                retriever.
            </div>

            <Analogy label="What comes next &mdash; Transformer Architecture Advances">
                RAG solved the knowledge staleness problem by connecting LLMs to external
                retrieval. But as RAG systems scaled to millions of documents and context
                windows grew to accommodate more retrieved passages, new engineering bottlenecks
                emerged inside the Transformer itself. Quadratic attention complexity made long
                contexts expensive; training instability at scale required new positional
                encoding schemes; memory bandwidth became the limiting factor for inference
                speed. Chapter 28 covers the architectural innovations that addressed these
                constraints &mdash; RoPE positional encoding, Flash Attention, grouped-query
                attention, and the Mixture-of-Experts architecture &mdash; the engineering
                advances that made modern frontier models both larger and faster to serve.
            </Analogy>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>How you cut the book matters</h2>

            <Analogy label="How You Cut the Book Matters">
                Imagine tearing a book into pieces so a friend can find the right passage
                quickly. If you rip the page in the middle of a sentence &mdash; &#x201C;The
                answer is&mdash;&#x201D; and the number is on the next torn piece &mdash;
                neither piece is useful on its own. Good chunking means cutting at natural
                breaks: end of a chapter, end of a paragraph, end of a thought. The AI can
                only answer a question if the relevant information sits in one coherent piece,
                not split across two fragments.
            </Analogy>

            <Analogy label="The Filing Cabinet with Folders">
                Parent-child chunking works like a filing cabinet with folders inside folders.
                Each document is split into tiny index cards &mdash; one sentence each (child
                chunks). Each group of index cards is stored inside a folder &mdash; the
                surrounding paragraph (parent chunk). When you search for something, you search
                through all the index cards to find the right one. Fast and precise. But when
                you pull the answer out to read it, you pull out the whole folder &mdash; the
                full paragraph &mdash; not just the tiny card. You get the precision of
                searching sentence-by-sentence with the context of reading paragraph-by-paragraph.
            </Analogy>

            <Analogy label="The Judge After the First Round">
                Imagine a talent competition with 10,000 contestants. You can&rsquo;t have the
                head judge carefully evaluate every single one &mdash; it would take forever.
                So you run a fast qualifying round: a simple test cuts it to the top 100.
                Then the head judge carefully watches and scores each of those 100.
                <br /><br />
                That is exactly how bi-encoder + cross-encoder re-ranking works. The bi-encoder
                is the fast qualifying round: it scores all chunks in milliseconds and picks
                the top 100. The cross-encoder is the careful final judging: it reads each
                (query, passage) pair together and picks the true top 10. You need both &mdash;
                speed for the first round, accuracy for the final.
            </Analogy>

            <Analogy label="Lost in the Middle">
                Tell someone a 20-sentence story, then ask them a question about one fact
                buried in sentences 10&ndash;12. They probably won&rsquo;t remember it well.
                The first sentence and the last sentence stick in memory; the middle fades.
                <br /><br />
                Language models have exactly the same bias. When given a long list of retrieved
                passages, they use information from the first and last passages much more
                reliably than information buried in the middle. The fix is simple once you know
                about it: always put the most relevant retrieved passage at the very beginning
                or the very end of the context, never buried in the middle.
            </Analogy>

            <Analogy label="HyDE: Ask First, Then Look It Up">
                Normally, you search by typing your question: &#x201C;How does aspirin
                reduce fever?&#x201D; But your question uses question-phrasing, and the
                answer documents use answer-phrasing. HyDE flips this: before searching,
                generate a fake answer first &mdash; &#x201C;Aspirin inhibits
                prostaglandin synthesis by blocking COX enzymes, which&#x2026;&#x201D;
                &mdash; then search for documents similar to that fake answer.
                <br /><br />
                The fake answer uses the same vocabulary, the same phrasing, the same
                concepts that the real answer would use. So it finds the real answer
                documents more reliably than the question alone would. You&rsquo;re
                searching for the answer by imagining what the answer looks like.
            </Analogy>

            <Analogy label="Multi-Query: Ask Five Different Ways">
                If you search a library catalog for &#x201C;how does aspirin work,&#x201D;
                you might miss books filed under &#x201C;mechanism of action of
                acetylsalicylic acid&#x201D; &mdash; same concept, completely different
                words. Multi-query retrieval solves this by automatically rephrasing your
                question five different ways and searching for all five. Then it combines
                all the results. The union of five searches is much more complete than
                any single search, because different phrasings unlock different vocabulary
                in the document collection.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of chunking, re-ranking, and context ordering</h2>

            <h3>Chunking Strategies Compared</h3>
            <p>
                Let c be chunk size (tokens) and o be overlap (tokens). The four main
                strategies differ in how they determine chunk boundaries:
            </p>
            <ul>
                <li><strong>Fixed-size:</strong> split every c tokens, slide by (c&nbsp;&minus;&nbsp;o) tokens. Simple but context-blind.</li>
                <li><strong>Semantic:</strong> split at sentence boundary i where cosine_sim(emb(s&#7522;), emb(s&#7522;&#8330;&#8321;))&nbsp;&lt;&nbsp;&theta;. Chunks are semantically coherent but variable-size.</li>
                <li><strong>Parent-child:</strong> index child chunks of size c&#x2080; for retrieval; return parent chunk of size c&#x2081;&nbsp;&gt;&nbsp;c&#x2080; to the generator. Decouples retrieval precision from generation context.</li>
                <li><strong>Sentence-window:</strong> retrieve matched sentence s&#x2a;, return context [s&#x2a;&minus;k,&nbsp;&hellip;, s&#x2a;, &hellip;, s&#x2a;&#x2b;k]. Simplest form of parent-child retrieval.</li>
            </ul>
            <p>
                The redundancy ratio from overlap quantifies the index storage overhead:
            </p>
            <MathBlock tex="\text{redundancy} \;=\; \frac{o}{c - o}" />
            <p>
                At o&nbsp;=&nbsp;20, c&nbsp;=&nbsp;100: redundancy&nbsp;=&nbsp;0.25 (25% more storage).
                At o&nbsp;=&nbsp;50, c&nbsp;=&nbsp;100: redundancy&nbsp;=&nbsp;1.0 (100% more storage &mdash;
                every token appears in two chunks on average). The optimal overlap is typically
                10&ndash;20% of chunk size; beyond 25%, diminishing returns on recall with
                rapidly growing storage cost.
            </p>

            <h3>Cross-Encoder Re-ranking</h3>
            <p>
                Bi-encoder scoring is an inner product in embedding space:
            </p>
            <MathBlock tex="\text{score}_{\text{bi}}(q, p) \;=\; E_Q(q)^\top E_P(p)" />
            <p>
                Cross-encoder scoring processes query and passage jointly, enabling every
                query token to attend to every passage token via full self-attention:
            </p>
            <MathBlock tex="\text{score}_{\text{cross}}(q, p) \;=\; \text{BERT}\!\left([\text{CLS}]\; q\; [\text{SEP}]\; p\; [\text{SEP}]\right)_{\![0]}" />
            <p>
                The first [CLS] token&rsquo;s final-layer representation is projected to a
                scalar relevance score. Cross-encoder MRR (Mean Reciprocal Rank) is
                substantially higher than bi-encoder, but inference cost scales as
                O((|q|+|p|)&#178;) per pair due to the full attention matrix. The practical
                solution: use the bi-encoder to shortlist the top-100, cross-encoder
                to re-rank only those 100, return top-10 to the generator.
            </p>
            <MathBlock tex="\text{MRR}@k \;=\; \frac{1}{|Q|} \sum_{q \in Q} \frac{1}{\text{rank}(d^*_q)}" />

            <h3>The Lost-in-the-Middle U-Shaped Curve</h3>
            <p>
                Liu et al. (2023) measured accuracy as a function of answer position within
                a fixed-length context window of N documents. Let pos(d&#x2a;) denote the
                position (1-indexed) of the gold document. Empirical accuracy followed
                approximately a U-shaped function:
            </p>
            <MathBlock tex="\text{Acc}(\text{pos}) \;\approx\; A_0 + A_1 \cdot \left(\frac{1}{\text{pos}} + \frac{1}{N - \text{pos} + 1}\right)" />
            <p>
                with accuracy 30+ percentage points higher at positions 1 and N than at
                position N/2. Mitigation: <strong>recency ordering</strong> places the most
                relevant chunk last (exploiting the model&rsquo;s recency bias in
                self-attention); <strong>U-position ordering</strong> places top-1 first
                and top-2 last, top-3 second and top-4 second-to-last, and so on.
            </p>

            <h3>Reciprocal Rank Fusion with Multi-Query</h3>
            <p>
                Multi-query retrieval generates Q&#x2019;&nbsp;=&nbsp;{"{q₁, …, qₘ}"} rewrites of the
                original query, retrieves top-k for each, and combines rankings with
                Reciprocal Rank Fusion. For a document d&#x1D35; appearing at rank r in
                retrieval result r for query q&#x2C7;:
            </p>
            <MathBlock tex="\text{RRF}(d_i) \;=\; \sum_{q' \in Q'} \frac{1}{k_{\text{rrf}} + \text{rank}_{q'}(d_i)}" />
            <p>
                where k&#x2090;&#x1D36;&#x1D3E;&nbsp;=&nbsp;60 is the standard smoothing constant that
                prevents any single top-1 result from dominating. Documents not retrieved
                by a particular query rewrite receive rank&nbsp;=&nbsp;&infin; (zero contribution
                from that query). With chunk deduplication, a chunk retrieved by three
                different query rewrites accumulates three RRF contributions, naturally
                boosting robust results and suppressing query-specific noise.
            </p>

            <h3>Contextual Retrieval (Anthropic, 2024)</h3>
            <p>
                For each chunk c extracted from document D, prepend a model-generated
                context description before embedding:
            </p>
            <MathBlock tex="c' \;=\; \text{LLM}_{\text{ctx}}(D,\, c)\; \oplus\; c" />
            <p>
                where &#x2295; denotes string concatenation and LLM&#x2093;&#x209C;&#x2093;(D,&nbsp;c) is a short
                paragraph (50&ndash;100 tokens) describing what document chunk c comes from,
                its position in the document, and its role. Example:
            </p>
            <DefBlock label="Contextual Retrieval Example">
                Original chunk: &#x201C;Revenue increased by 23% year-over-year.&#x201D;
                <br />
                Contextualized chunk: &#x201C;This passage is from the Q3 2023 earnings report
                of Acme Corp., in the Financial Highlights section. Revenue increased by 23%
                year-over-year.&#x201D;
                <br /><br />
                The embedding of the contextualized chunk captures both the content and the
                document context, so a query about &#x201C;Acme Corp. 2023 revenue&#x201D;
                retrieves the correct chunk even if &#x201C;Acme Corp.&#x201D; and &#x201C;2023&#x201D;
                do not appear in the original chunk. Anthropic reported 35&ndash;49% improvement
                in retrieval accuracy using contextual retrieval versus standard chunking.
            </DefBlock>
            <p>
                The embedding of c&#x2019; is used for indexing and retrieval; the
                original c (without the prepended context) is returned to the generator
                to avoid redundancy. Cost: one LLM call per chunk at indexing time, amortized
                over all subsequent queries.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Optimal chunk size derivation &middot; cross-encoder vs. bi-encoder accuracy&ndash;latency trade-off</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Parent-child chunking &middot; FAISS bi-encoder retrieval &middot; cross-encoder re-ranking &middot; U-position ordering</span>
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
            <h2>Optimal chunking and the accuracy&ndash;latency frontier</h2>

            <DefBlock label="Chunk Size and Answer Span Coverage">
                Let L be the average answer span length in tokens, and c the chunk size.
                The probability that a uniformly distributed answer span of length L
                is fully contained within a non-overlapping chunk of size c is:
            </DefBlock>
            <MathBlock tex="P(\text{span contained}) \;=\; \frac{c - L}{c} \;=\; 1 - \frac{L}{c}" />
            <p>
                This formula shows that for short answers (L&nbsp;&ll;&nbsp;c), almost
                every answer fits in a chunk; for longer answers (L&nbsp;&rarr;&nbsp;c),
                the probability approaches zero. With overlap o, the effective window
                per chunk becomes c&nbsp;+&nbsp;o from the perspective of boundary-crossing
                spans, improving containment probability to approximately:
            </p>
            <MathBlock tex="P_{\text{overlap}}(\text{contained}) \;\approx\; 1 - \frac{\max(0,\, L - o)}{c}" />
            <p>
                Setting overlap o&nbsp;=&nbsp;L&nbsp;&minus;&nbsp;1 guarantees that any
                answer span of exactly length L is fully contained in at least one chunk.
                This gives a principled lower bound for overlap: measure the median answer
                span length in your domain, and set overlap to at least that value.
            </p>

            <h3>Cross-Encoder vs. Bi-Encoder: Accuracy&ndash;Latency Trade-off</h3>
            <p>
                Let N be the total number of indexed chunks, k&#x2081; be the bi-encoder
                shortlist size, and k&#x2082;&nbsp;&le;&nbsp;k&#x2081; be the final number
                returned to the generator. The two-stage pipeline latency is:
            </p>
            <MathBlock tex="\tau_{\text{total}} \;=\; \underbrace{\tau_{\text{FAISS}}(N)}_{\text{bi-encoder retrieval}} + \underbrace{k_1 \cdot \tau_{\text{CE}}}_{\text{cross-encoder re-ranking}}" />
            <p>
                where &tau;&#x2098;&#x2090;&#x1D35;&#x1D38;&#x1D38;(N) scales sublinearly (O(N) for flat
                index, O(log N) for IVF index), and &tau;&#x2041;&#x1D39; is the per-pair
                cross-encoder forward pass. For BERT-base cross-encoder,
                &tau;&#x2041;&#x1D39;&nbsp;&asymp;&nbsp;10ms on CPU (512-token sequence);
                k&#x2081;&nbsp;=&nbsp;100 gives re-ranking latency of &asymp;&nbsp;1 second on
                CPU. GPU reduces this to &asymp;&nbsp;100ms. The accuracy gain from
                re-ranking (MRR improvement) follows a diminishing return as k&#x2081; grows:
            </p>
            <MathBlock tex="\Delta\text{MRR}(k_1) \;\approx\; \Delta\text{MRR}_{\max} \cdot \left(1 - e^{-k_1 / k^*}\right)" />
            <p>
                where k&#x2a;&nbsp;&asymp;&nbsp;50&ndash;100 is the saturation point empirically.
                The practical rule: k&#x2081;&nbsp;=&nbsp;100, k&#x2082;&nbsp;=&nbsp;5&ndash;10 captures
                nearly all accuracy benefit while keeping cross-encoder cost bounded.
            </p>

            <h3>Position-Weighted Attention and the Middle Problem</h3>
            <p>
                In self-attention over a sequence of N tokens, the attention weight from
                position i to position j is proportional to exp(q&#7522;&#x1D40;k&#11785;/&radic;d).
                Rotary position encodings (RoPE) and ALiBi both introduce a position-dependent
                bias that decays with distance |i&nbsp;&minus;&nbsp;j|. For a token at position
                i&nbsp;=&nbsp;N/2 (middle), the maximum distance to context is N/2, while for
                a token at i&nbsp;=&nbsp;1 or i&nbsp;=&nbsp;N, the maximum distance is only N.
                Aggregated attention mass reaching middle tokens is thus systematically lower,
                explaining the lost-in-the-middle phenomenon as a structural consequence of
                positional bias in attention.
            </p>
            <MathBlock tex="\mathbb{E}[\text{attn mass at pos } i] \;\propto\; \frac{1}{N} \sum_{j \neq i} e^{-\lambda |i - j|}" />
            <p>
                This expectation is minimized at i&nbsp;=&nbsp;N/2, confirming that the middle
                position receives least total attention on average, regardless of the specific
                positional encoding scheme. U-position ordering directly counters this by
                assigning the most relevant content to positions with highest expected attention.
            </p>

            <div className="ch-callout">
                <strong>The key insight:</strong> Chunking, re-ranking, and context ordering
                are not implementation details &mdash; they are first-order determinants of
                RAG quality with formal, analyzable properties. The optimal overlap follows
                from answer span statistics; the optimal shortlist size follows from the
                accuracy&ndash;latency trade-off curve; the optimal ordering follows directly
                from the structure of positional attention decay.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                A complete RAG pipeline with parent-child chunking, FAISS bi-encoder
                retrieval, cross-encoder re-ranking with sentence-transformers, and
                lost-in-the-middle mitigation via U-position ordering. No LLM call
                required to run the retrieval and ordering stages.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="chunking_reranking_pipeline.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CHUNKING_RERANKING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
