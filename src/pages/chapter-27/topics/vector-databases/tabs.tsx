import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From brute-force search to billion-scale retrieval</h2>
            <p>
                Vector databases are the infrastructure layer that makes RAG systems production-ready.
                Before purpose-built vector databases existed, nearest-neighbor search was either
                exact and slow, or approximate and fragile. The history of this space is the story
                of algorithms and systems catching up to the demands of embedding-based retrieval.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1970 &ndash; 2000</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Exact Nearest-Neighbor Search</div>
                    <div className="ch-tl-body">
                        Early nearest-neighbor search required comparing every query against every
                        stored vector &mdash; O(N) per query. For N&nbsp;=&nbsp;1M and d&nbsp;=&nbsp;768,
                        this is roughly 1.5 billion floating-point operations per query: far too slow
                        for production. K-d trees and ball trees reduced query time in low dimensions,
                        but failed catastrophically in high dimensions. As dimensionality grew, every
                        point became roughly equidistant from the query &mdash; the &ldquo;curse of
                        dimensionality&rdquo; rendered index structures useless beyond d&nbsp;&#8776;&nbsp;20.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Exact search was the only option, but it did not scale
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">FAISS &mdash; Facebook AI Similarity Search</div>
                    <div className="ch-tl-body">
                        Johnson et al. at Meta released FAISS, a library for efficient approximate
                        nearest-neighbor (ANN) search at scale. FAISS combined three key algorithms:
                        IVF (inverted file index) partitions the vector space into Voronoi cells and
                        searches only the nearest cells; PQ (product quantization) compresses vectors
                        from 3&nbsp;KB to ~100 bytes while preserving relative distances; HNSW
                        (hierarchical navigable small world) navigates a multi-layer graph for
                        O(log N) retrieval. FAISS enabled billion-scale similarity search in seconds
                        on GPU and was deployed internally at Meta for image deduplication and
                        recommendation systems.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Proved billion-scale ANN search was feasible; became the reference implementation
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Productionization</div>
                    <div className="ch-tl-title">Purpose-Built Vector Databases: Pinecone &amp; Weaviate</div>
                    <div className="ch-tl-body">
                        Pinecone (2019) launched as a fully managed cloud vector database: it handled
                        indexing, scaling, filtering, and multi-tenancy as a hosted service. Weaviate
                        (2019) launched as an open-source vector database with built-in ML model
                        support, schema definitions, and hybrid search combining dense and sparse
                        signals. These were the first databases designed from the ground up for
                        embedding storage and retrieval &mdash; not file systems or relational
                        databases adapted for the purpose. Previously, teams had to glue FAISS to a
                        metadata store themselves.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Vector search became a managed infrastructure concern, not a research problem
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 &ndash; 2021</div>
                    <div className="ch-tl-section-label">Integration</div>
                    <div className="ch-tl-title">pgvector and SQL-Native Vector Search</div>
                    <div className="ch-tl-body">
                        pgvector added vector similarity search to PostgreSQL as a native extension.
                        For teams already running Postgres, this meant adding embedding search without
                        adopting a new database system. Key appeal: unified queries (SQL + vector
                        search in a single statement), familiar tooling, ACID transactions, and
                        referential integrity with existing relational data. Qdrant (2020) also
                        launched as a high-performance open-source alternative with Rust internals
                        and a REST/gRPC API designed for self-hosted production deployments.
                        Limitation: pgvector&rsquo;s HNSW performance trails purpose-built systems
                        at billion-vector scale.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Lowered the barrier to adoption; teams could add vector search to existing stacks
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Democratization</div>
                    <div className="ch-tl-title">Chroma and the RAG Wave</div>
                    <div className="ch-tl-body">
                        Chroma (2022) launched as an open-source, embeddable vector database designed
                        specifically for LLM applications. Unlike FAISS (a library requiring
                        integration work) or Pinecone (a managed cloud service), Chroma provided a
                        simple Python API that ran locally with zero infrastructure setup. A developer
                        could build a working RAG prototype in under 20 lines of Python. Its
                        simplicity made it the default choice for the flood of LLM developers who
                        entered the ecosystem after ChatGPT&rsquo;s release, and it became the most
                        commonly referenced vector database in RAG tutorials.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Lowered the floor for RAG prototyping; vector databases entered mainstream ML discourse
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Maturity</div>
                    <div className="ch-tl-title">Hybrid Search: Dense + Sparse</div>
                    <div className="ch-tl-body">
                        Production RAG deployments discovered that pure dense retrieval missed exact
                        keyword matches &mdash; BM25 still outperformed DPR on queries like
                        &ldquo;myocardial infarction&rdquo; where the exact term appeared in the
                        target document but not in semantically similar ones. Hybrid search addressed
                        this by combining dense and sparse signals: retrieve candidates from both
                        BM25 and FAISS, then merge rankings with reciprocal rank fusion (RRF) or a
                        learned interpolation weight. Weaviate, Qdrant, and Elasticsearch all
                        implemented hybrid search as their default recommended retrieval mode.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Hybrid became the production standard; pure dense retrieval was recognized as insufficient
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Sophistication</div>
                    <div className="ch-tl-title">Multi-Modal and Multi-Vector Indices</div>
                    <div className="ch-tl-body">
                        Vector databases extended beyond single-embedding-per-document: ColBERT-style
                        multi-vector indices stored one embedding per token and used MaxSim scoring
                        at retrieval time; parent-child chunking stored child chunk embeddings but
                        retrieved the parent passage for generation context; image and text
                        collections were co-indexed in shared embedding spaces. Qdrant added native
                        sparse vector support alongside dense. pgvector 0.5.0 added HNSW support,
                        narrowing the performance gap with purpose-built systems. The infrastructure
                        caught up with the algorithmic complexity of production RAG.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Vector databases became first-class ML infrastructure, not an afterthought
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The convergence point:</strong> By 2024, every major cloud provider (AWS,
                GCP, Azure) offered managed vector search. Every major database (Postgres, MongoDB,
                Redis, Elasticsearch) had a vector extension. The question was no longer whether to
                use a vector database &mdash; it was which one fit the team&rsquo;s existing stack
                and scale requirements.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The library that understands what things mean</h2>

            <Analogy label="The Library That Knows What Things Mean">
                A regular database finds things by their exact ID or keyword &mdash; like looking up
                a book by its ISBN number. A vector database finds things by their meaning. You can
                say &ldquo;find me documents similar to this idea&rdquo; and it returns the nearest
                neighbors in meaning-space. The library doesn&rsquo;t search the title &mdash; it
                searches the concept behind the words.
            </Analogy>

            <Analogy label="HNSW: The Shortcut Map">
                HNSW builds multiple layers of connections between vectors, like a map with highways
                and streets. The top layer has only a few connections between very distant points
                &mdash; the highway network. Lower layers add more and more local connections. To
                find the nearest neighbor, you start on the highway, drive toward the right region
                of the map, then zoom into the street layer for the final precise search. This
                shortcuts the search from checking every point to checking only
                log(N) &mdash; millions of points answered in milliseconds.
            </Analogy>

            <Analogy label="Why Exact Search Is Too Slow">
                Imagine 1 million documents, each turned into a list of 768 numbers (an embedding).
                That&rsquo;s 3 GB of numbers. Finding the most similar document to your query
                requires billions of multiplication and addition operations &mdash; too slow for a
                real-time application. Approximate search accepts 95% accuracy in exchange for doing
                1/100th of the work. For a search engine, that tradeoff is almost always worth it.
            </Analogy>

            <Analogy label="Metadata Filtering: The Librarian with a Filter">
                &ldquo;Find me documents similar to this query, but only from 2023, only in French,
                only with category = medical.&rdquo; Vector databases store metadata (date, language,
                category) alongside each embedding. A filter applies those conditions before or
                after the vector search. Without filtering, vector search returns similar content
                from any source &mdash; including ones you don&rsquo;t want. With filtering, you get
                the most relevant results within the allowed set.
            </Analogy>

            <Analogy label="Pinecone vs. Chroma vs. pgvector">
                Think of three tools for the same job: Chroma is a pocket knife &mdash; runs on
                your laptop, zero setup, great for building a prototype tonight. Pinecone is a
                professional workshop with a full-time mechanic &mdash; managed, infinitely scalable,
                pay-per-query, great for production apps serving millions of users. pgvector is an
                attachment for a tool you already own &mdash; if you already run Postgres, you can
                bolt on vector search without learning a new system. Qdrant is a high-performance
                self-hosted option for teams that need speed and control without sharing data with
                a cloud provider.
            </Analogy>

            <Analogy label="Hybrid Search: The Best of Both Worlds">
                Dense retrieval finds documents with similar meaning but can miss exact keywords.
                Sparse retrieval (BM25) finds exact keyword matches but misses semantic equivalents.
                Hybrid search runs both: retrieve candidates from each system, then combine the
                rankings. A query for &ldquo;myocardial infarction&rdquo; gets documents about
                heart attacks (dense match) and documents containing the exact medical term (sparse
                match). Hybrid gets both, while either alone would miss one category.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Index structures, quantization, and hybrid retrieval</h2>

            <h3>HNSW Index</h3>
            <p>
                Hierarchical Navigable Small World (HNSW) is the dominant index structure in modern
                vector databases. Construction assigns each inserted vector a maximum layer{" "}
                <em>l</em> drawn from a geometric distribution:
            </p>
            <MathBlock tex="l = \lfloor -\ln(U) \cdot m_L \rfloor, \quad U \sim \text{Uniform}(0,1)" />
            <p>
                Each vector is connected to its <em>M</em> nearest neighbors at layer <em>l</em>{" "}
                and at every layer below it. Search begins at the top layer, greedily descends to
                the nearest neighbor at each layer, and terminates at layer 0. Query complexity is
                O(log N) with high probability, and recall typically exceeds 95% at Recall@10.
                Memory cost is O(N &times; M &times; d) for M typically between 16 and 64.
            </p>
            <MathBlock tex="\text{Query complexity: } O\!\left(\log N\right)" />

            <h3>Product Quantization (PQ)</h3>
            <p>
                Product quantization compresses high-dimensional vectors into a compact code that
                fits in cache, enabling approximate distance computation from pre-computed lookup
                tables. A d-dimensional vector <strong>x</strong> is split into{" "}
                <em>m</em> sub-vectors of d/m dimensions each. Each sub-vector is assigned to the
                nearest centroid in a codebook of size k (typically k&nbsp;=&nbsp;256).
            </p>
            <MathBlock tex="\mathbf{x} \approx \left[ q_1(\mathbf{x}^{(1)}),\; q_2(\mathbf{x}^{(2)}),\; \ldots,\; q_m(\mathbf{x}^{(m)}) \right]" />
            <p>
                Storage cost is reduced from 32m bits (float32) to log&#8322;(k) &times; m bits.
                For d&nbsp;=&nbsp;768, m&nbsp;=&nbsp;96, k&nbsp;=&nbsp;256: 96 bytes per vector
                instead of 3,072 bytes &mdash; a 32&times; compression. Approximate distance
                between query <strong>q</strong> and database vector <strong>x</strong> is computed
                by summing sub-codebook distances from a pre-computed lookup table:
            </p>
            <MathBlock tex="\hat{d}(\mathbf{q}, \mathbf{x}) = \sum_{j=1}^{m} d\!\left(\mathbf{q}^{(j)},\; c_{q_j}^{(j)}\right)" />

            <h3>Reciprocal Rank Fusion (RRF)</h3>
            <p>
                Hybrid search merges dense and sparse retrieval result lists with RRF, a
                rank-aware fusion method that is robust to different score scales across retrievers.
                For each document d<sub>i</sub> across retrievers R&nbsp;=&nbsp;&#123;dense, sparse&#125;:
            </p>
            <MathBlock tex="\text{RRF}(d_i) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d_i)}, \quad k = 60" />
            <p>
                Documents are then re-ranked by descending RRF score. The constant k&nbsp;=&nbsp;60
                dampens the advantage of top-ranked documents and was empirically found to work well
                across retrieval benchmarks. A document ranked 1st in one list and absent from the
                other scores 1/61 &asymp; 0.016; a document ranked 1st in both scores 2/61 &asymp; 0.033.
            </p>

            <h3>Filtering Strategies: Pre-filter vs. Post-filter</h3>
            <p>
                Metadata filtering interacts with ANN index structures in non-obvious ways. Two
                main strategies exist, each with trade-offs:
            </p>
            <ul>
                <li>
                    <strong>Pre-filtering:</strong> apply the metadata filter first, then run ANN
                    search on the filtered subset. Problem: HNSW accuracy degrades on small subsets
                    because the graph structure was built over the full index. A 1% filter retains
                    too few inter-node edges for effective graph navigation.
                </li>
                <li>
                    <strong>Post-filtering:</strong> run ANN search on the full index, retrieve
                    a candidate set, then apply the filter. Problem: if the filter removes 90%
                    of candidates, you must retrieve 10&times; more candidates than you need.
                    The required oversampling ratio is:
                </li>
            </ul>
            <MathBlock tex="\text{candidates}_\text{fetch} = \frac{k_\text{target}}{1 - \text{filter\_rejection\_rate}}" />
            <p>
                The production compromise is index segmentation: partition the collection by
                high-selectivity metadata fields (e.g., language, tenant ID) and route each query
                to the appropriate segment. This avoids both pre-filter degradation and
                post-filter oversampling.
            </p>

            <h3>Scalability and Benchmarks</h3>
            <p>
                ANN Benchmarks (ann&#8209;benchmarks.com) is the standard comparison framework for
                approximate nearest-neighbor algorithms. At 10M vectors with d&nbsp;=&nbsp;768:
                HNSW achieves 98% Recall@10 at 1.2 ms per query; IVF-PQ achieves 90% Recall@10 at
                0.3 ms per query (lower latency, lower recall). At 1B vectors, IVF-PQ is preferred
                due to its smaller memory footprint. Qdrant&rsquo;s HNSW with int8 scalar
                quantization fits ~200M vectors in 50 GB RAM at 95% recall. The fundamental
                recall&ndash;latency trade-off follows a Pareto frontier:
            </p>
            <MathBlock tex="\text{Recall}@k \approx 1 - \exp\!\left(-\lambda \cdot t_\text{query}\right)" />
            <p>
                where &lambda; is index-dependent. More search time (larger candidate list or
                more graph entry points) monotonically improves recall up to the exact-search ceiling.
            </p>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">HNSW layer construction &middot; PQ quantization error &middot; recall analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">FAISS IVF-PQ &middot; Chroma RAG document store</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Deep dive content ─────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Vector index mathematics</h2>

            <DefBlock label="HNSW Layer Construction Probability">
                Each inserted vector v is assigned a maximum layer l drawn from a geometric
                distribution controlled by the level multiplier m<sub>L</sub>:
                <MathBlock tex="P(l = k) = e^{-k / m_L} \left(1 - e^{-1/m_L}\right), \quad k = 0, 1, 2, \ldots" />
                Setting m<sub>L</sub>&nbsp;=&nbsp;1/ln(M) ensures the expected number of vectors
                at layer l&nbsp;&gt;&nbsp;0 decays geometrically with base M, matching the
                branching factor of the graph. This construction guarantees that the top layer
                contains O(log N) vectors on average, which bounds the number of greedy steps
                during the descent phase.
            </DefBlock>

            <h3>PQ Quantization Error</h3>
            <p>
                Let <strong>x</strong> be the original vector and <strong>x&#771;</strong> its PQ
                approximation. The per-sub-vector quantization error for sub-vector j is the
                squared distance to the nearest centroid:
            </p>
            <MathBlock tex="\epsilon_j = \left\| \mathbf{x}^{(j)} - q_j\!\left(\mathbf{x}^{(j)}\right) \right\|^2" />
            <p>
                The total distortion is the sum across sub-spaces:
            </p>
            <MathBlock tex="\mathcal{E}(\mathbf{x}) = \sum_{j=1}^{m} \epsilon_j" />
            <p>
                For a well-trained codebook (k-means to convergence), the expected distortion
                decreases as k increases. The relationship between codebook size and distortion
                follows the rate&ndash;distortion bound:
            </p>
            <MathBlock tex="\mathbb{E}[\mathcal{E}] \leq \sigma^2 \cdot d \cdot 2^{-2B/d}" />
            <p>
                where B is the total number of bits allocated and &sigma;<sup>2</sup> is the
                per-dimension variance of the data. This shows that recall degrades predictably
                as compression increases: doubling B (one extra bit per dimension) reduces expected
                distortion by a factor of 4.
            </p>

            <h3>Effect of Quantization Error on Recall</h3>
            <p>
                Approximate distance d&#770;(<strong>q</strong>, <strong>x</strong>) differs from
                true distance d(<strong>q</strong>, <strong>x</strong>) by a perturbation bounded
                by the quantization errors of both vectors. For a query <strong>q</strong> (not
                quantized) and database vector <strong>x</strong> (quantized):
            </p>
            <MathBlock tex="\left| \hat{d}(\mathbf{q}, \mathbf{x}) - d(\mathbf{q}, \mathbf{x}) \right| \leq \sum_{j=1}^{m} \left\| \mathbf{q}^{(j)} \right\| \cdot \epsilon_j^{1/2}" />
            <p>
                This perturbation is small when the query norm is moderate and distortion &epsilon;
                is small. In practice, retrieval recall at k is empirically measured (not derived
                analytically) because the perturbation distribution depends on data geometry.
                The ANN Benchmarks recall curves characterize this empirically for standard datasets.
            </p>

            <div className="ch-callout">
                <strong>The approximate search guarantee:</strong> ANN indices offer no
                worst-case correctness guarantee &mdash; a query can theoretically return entirely
                wrong neighbors. In practice, Recall@10 above 95% is achievable with HNSW at
                production scale, and the tail failure rate is acceptable for retrieval applications
                where the LLM generation step can recover from imperfect context.
            </div>
        </>
    )
}

// ── Code ──────────────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np

# ── FAISS: IVF-PQ index construction and search ───────────────────────────────
try:
    import faiss

    d = 128          # embedding dimension
    n_vectors = 10_000
    n_query   = 5
    nlist     = 64   # number of Voronoi cells (IVF clusters)
    m_pq      = 16   # number of PQ sub-vectors (d must be divisible by m_pq)
    bits      = 8    # bits per sub-vector code (k = 256 centroids)

    # Generate random float32 embeddings
    rng      = np.random.default_rng(42)
    xb       = rng.standard_normal((n_vectors, d)).astype("float32")
    xq       = rng.standard_normal((n_query,   d)).astype("float32")

    # Build IVF-PQ index
    quantizer = faiss.IndexFlatL2(d)                    # coarse quantizer
    index     = faiss.IndexIVFPQ(quantizer, d, nlist, m_pq, bits)

    index.train(xb)          # train coarse quantizer + PQ codebooks
    index.add(xb)            # add vectors to the index

    index.nprobe = 8         # search 8 nearest cells per query (recall/speed trade-off)

    k = 5                    # retrieve top-5 nearest neighbors
    D, I = index.search(xq, k)

    print("IVF-PQ search results")
    print(f"  Index size  : {index.ntotal:,} vectors")
    print(f"  Query shape : {xq.shape}")
    print(f"  Distances   :\\n{D.round(3)}")
    print(f"  Indices     :\\n{I}")

except ImportError:
    print("faiss-cpu not installed — run: pip install faiss-cpu")


# ── Chroma: RAG document store with metadata filtering ────────────────────────
try:
    import chromadb

    client     = chromadb.Client()          # in-memory client (no persistence)
    collection = client.create_collection("research_docs")

    # Add documents with metadata
    collection.add(
        documents=[
            "HNSW achieves O(log N) nearest-neighbor search via hierarchical graph navigation.",
            "Product quantization compresses 768-dim vectors to 96 bytes with 32x compression.",
            "Reciprocal rank fusion merges dense and sparse retrieval rankings.",
            "pgvector extends PostgreSQL with native vector similarity search.",
            "Chroma is an embeddable vector database designed for LLM applications.",
        ],
        metadatas=[
            {"year": 2020, "category": "algorithms"},
            {"year": 2017, "category": "algorithms"},
            {"year": 2023, "category": "retrieval"},
            {"year": 2021, "category": "databases"},
            {"year": 2022, "category": "databases"},
        ],
        ids=["doc1", "doc2", "doc3", "doc4", "doc5"],
    )

    # Query with metadata filter: databases only, published 2021 or later
    results = collection.query(
        query_texts=["how do vector databases store embeddings?"],
        n_results=2,
        where={"$and": [{"category": "databases"}, {"year": {"$gte": 2021}}]},
    )

    print("\\nChroma filtered retrieval results")
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        print(f"  [{meta['year']} | {meta['category']}] {doc[:70]}...")

except ImportError:
    print("chromadb not installed — run: pip install chromadb")
`

function PythonContent() {
    return (
        <>
            <p>
                Two end-to-end examples: FAISS IVF-PQ index construction and approximate
                nearest-neighbor search, followed by a Chroma document store demonstrating
                RAG-style retrieval with metadata filtering.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="vector_db_demo.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const VECTOR_DATABASES_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
