import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Retrieval-Augmented Generation</h2>
            <p className="ch-story-intro">
                Chapter 26&rsquo;s multimodal models showed that frozen LLMs could be extended to new
                modalities through lightweight bridges &mdash; images, audio, and video could all be
                converted to token sequences the language model could process. But all these models
                shared a deeper limitation: their knowledge was frozen at training time. A model
                trained on data through 2021 cannot answer questions about 2022 events; it cannot
                access a private company database; it cannot cite the specific paragraph in a
                document that justifies its answer. Retrieval-Augmented Generation &mdash; introduced
                in 2020 by Lewis et al. &mdash; addressed this by giving the generator access to a
                dynamic, searchable knowledge store at inference time.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 &ndash; 2019</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Open-Domain QA and Retrieval Baselines</div>
                    <div className="ch-tl-body">
                        DrQA (Chen et al., 2017) established the retrieve-then-read paradigm: sparse
                        TF-IDF retrieval over Wikipedia passages, followed by a reading comprehension
                        model that extracted the answer from the top retrieved document. The pipeline
                        was effective for factoid questions but brittle for semantic queries &mdash;
                        TF-IDF keyword matching failed whenever the question used different vocabulary
                        than the answer passage. BM25 (Robertson &amp; Zaragoza, 2009), an improved
                        sparse retrieval method, became the standard baseline that dense methods would
                        need to surpass.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the two-stage retrieve-then-read paradigm; exposed the ceiling of sparse retrieval</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Dense Passage Retrieval &mdash; Karpukhin et al.</div>
                    <div className="ch-tl-body">
                        Dense Passage Retrieval (DPR) replaced sparse TF-IDF with a learned
                        bi-encoder: a query encoder Q(&sdot;) and a passage encoder P(&sdot;), both
                        fine-tuned BERT models, producing dense vector representations in the same
                        embedding space. Retrieval became maximum inner product search (MIPS): find
                        the passage whose vector is most similar to the query vector. The encoders
                        were trained on (question, positive passage, negative passage) triples using
                        in-batch negatives. DPR achieved Recall@20 of 79.4% on Natural Questions,
                        compared to 59.1% for BM25 &mdash; a 20-point leap purely from switching
                        from keyword matching to learned dense representations.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that learned dense retrieval decisively outperforms sparse retrieval on semantic QA benchmarks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">RAG &mdash; Lewis et al. (Facebook AI Research)</div>
                    <div className="ch-tl-body">
                        &ldquo;Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.&rdquo;
                        Lewis et al. combined DPR with BART-Large in a unified end-to-end model.
                        The knowledge base was 21 million Wikipedia passages indexed with FAISS.
                        Two variants were proposed: <strong>RAG-Sequence</strong> retrieves once
                        per query and generates the full answer conditioned on retrieved passages;
                        <strong>RAG-Token</strong> retrieves documents for each generated token,
                        allowing different tokens to draw from different passages for maximum
                        flexibility. Training treated retrieved passages as latent variables and
                        marginalized over the top-k passages during the forward pass. The model was
                        trained end-to-end &mdash; updating both the generator parameters and the
                        retriever encoder &mdash; without requiring separate supervision for the
                        retrieval step.
                    </div>
                    <div className="ch-tl-impact">Impact: First end-to-end trainable model combining neural retrieval with seq2seq generation; set new SotA on open-domain QA and knowledge-intensive NLP</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 &ndash; 2021</div>
                    <div className="ch-tl-section-label">Extensions</div>
                    <div className="ch-tl-title">REALM, FiD, and Long-Context Retrieval</div>
                    <div className="ch-tl-body">
                        REALM (Guu et al., Google, 2020) pre-trained the retriever and language
                        model jointly using masked language modeling with a retrieval step embedded
                        in the pre-training objective, propagating gradients through retrieval during
                        pre-training rather than only fine-tuning. Fusion-in-Decoder (FiD, Izacard
                        &amp; Grave, 2021) introduced a more scalable alternative: encode each of
                        the k retrieved passages independently with the encoder, concatenate all k
                        encoded representations, then feed a single decoder that attends over all
                        encoded passages simultaneously. FiD with k&nbsp;=&nbsp;100 passages
                        substantially outperformed RAG with k&nbsp;=&nbsp;5, revealing that scaling
                        the number of retrieved passages consistently improves generation quality
                        &mdash; more retrieved context is almost always better.
                    </div>
                    <div className="ch-tl-impact">Impact: FiD demonstrated that 100 retrieved passages outperform 5; established scaling retrieval breadth as a core RAG lever</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">Commercial RAG Systems and Framework Abstractions</div>
                    <div className="ch-tl-body">
                        The LLM boom of 2022 made RAG a core production pattern. Enterprise
                        applications proliferated: customer support chatbots retrieving from company
                        knowledge bases, legal research tools retrieving relevant case law, code
                        generation tools retrieving relevant code snippets before completing a
                        function. LangChain (Harrison Chase, 2022) and LlamaIndex (Jerry Liu, 2022)
                        emerged as open-source frameworks abstracting the RAG pipeline into
                        composable components: document loaders, text splitters, embedding models,
                        vector stores, and retriever interfaces. These frameworks made RAG
                        accessible to engineers without ML expertise and accelerated deployment
                        across virtually every industry vertical.
                    </div>
                    <div className="ch-tl-impact">Impact: LangChain and LlamaIndex made RAG a standard engineering pattern; RAG became the default architecture for LLM applications touching private data</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Advanced RAG: FLARE, Self-RAG, HyDE</div>
                    <div className="ch-tl-body">
                        A wave of advanced retrieval strategies addressed the limitations of
                        naive single-shot RAG. <strong>FLARE</strong> (Jiang et al.): the
                        generator identifies tokens it is uncertain about mid-generation and
                        triggers an additional retrieval step on-the-fly, interleaving generation
                        and retrieval dynamically. <strong>Self-RAG</strong> (Asai et al.): the
                        model learns special reflection tokens to decide <em>when</em> to retrieve
                        (retrieval is not always necessary), which passages are relevant, and
                        whether its own output is supported by the retrieved evidence.
                        <strong>HyDE</strong> (Gao et al.): generate a hypothetical answer first,
                        then retrieve documents similar to the hypothetical &mdash; substantially
                        improving retrieval recall for abstract or complex queries where the
                        question alone is a poor retrieval signal.
                    </div>
                    <div className="ch-tl-impact">Impact: Established adaptive retrieval as the next frontier; Self-RAG introduced retrieval self-critique as a learned behavior</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023 &ndash; 2024</div>
                    <div className="ch-tl-section-label">Debate</div>
                    <div className="ch-tl-title">RAG vs. Long Context Windows</div>
                    <div className="ch-tl-body">
                        The arrival of 100K+ context windows (Claude 2, Gemini 1.5) raised the
                        question: can you simply stuff the entire knowledge base into the context
                        and skip retrieval? Empirical studies settled this for different regimes.
                        For large corpora (millions of documents), RAG remains essential &mdash;
                        no context window can hold 1M documents. For small curated document sets
                        (&lt;&nbsp;100 documents), long context is simpler and avoids retrieval
                        errors. For mid-size corpora, hybrid approaches &mdash; retrieve a
                        relevant subset with RAG, then process with a long-context model &mdash;
                        became the dominant production pattern. The debate clarified that RAG and
                        long context are complementary, not competing, technologies.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that RAG and long-context models are complementary; hybrid retrieval + long-context became the production standard for large corpora</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> A language model&rsquo;s parametric knowledge is fixed
                at training time and cannot be updated without retraining. RAG decouples
                knowledge from model parameters &mdash; the generator holds reasoning ability
                while the knowledge base holds facts. Updating the knowledge base costs nothing
                in model compute; the generator stays frozen. This separation of concerns is why
                RAG became the dominant architecture for production LLM systems that need
                access to current, private, or domain-specific information.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>How AI learned to look things up before answering</h2>

            <Analogy label="The Open-Book Exam">
                Traditional language models are closed-book: the model must answer every question
                from memory. Whatever it learned during training is all it has. RAG is an open-book
                exam &mdash; before writing an answer, the model looks up relevant pages in a
                textbook. The textbook (the knowledge base) can be updated, swapped out, or
                expanded at any time, without ever changing or retraining the model.
            </Analogy>

            <Analogy label="The Library Research Assistant">
                Imagine a brilliant researcher. You ask them a question. Instead of answering
                immediately from memory, they walk to the library, search the catalog, pull three
                relevant books off the shelf, read the key passages, then write you an answer that
                cites exactly which page in which book supports each claim. That is RAG &mdash;
                the retriever is the library search, the passages are the books, and the generator
                is the researcher writing the answer.
            </Analogy>

            <Analogy label="Why Memory Alone Fails">
                LLMs can&rsquo;t remember everything &mdash; especially things that happened after
                they were trained. And when they don&rsquo;t know something, they often make up
                a plausible-sounding answer (hallucination). RAG gives the model a reference to
                check before answering. Instead of guessing, it looks up the answer in a real
                document. Answers become grounded in actual sources, not in confident invention.
            </Analogy>

            <Analogy label="The Knowledge Base Can Be Anything">
                The &ldquo;library&rdquo; in RAG doesn&rsquo;t have to be Wikipedia. It can be a company&rsquo;s
                internal documentation, a collection of medical research papers, a database of
                legal contracts, a set of customer emails, or a repository of code. By swapping
                the knowledge base, you get a completely different domain expert &mdash; all
                using the same underlying language model. One model, infinite specializations.
            </Analogy>

            <Analogy label="Dense vs. Sparse Retrieval">
                Old-fashioned retrieval (like Google in the 1990s) matched keywords: searching
                &ldquo;diabetes treatment&rdquo; only finds documents containing those exact words. Dense
                retrieval encodes <em>meaning</em>: a query about &ldquo;managing blood sugar&rdquo; finds
                documents about &ldquo;diabetes treatment&rdquo; because they mean the same thing in the
                embedding space &mdash; even though no word is shared. This is why DPR was such a
                leap over BM25.
            </Analogy>

            <Analogy label="Grounding and Citations">
                Because RAG retrieved specific documents before generating its answer, it can show
                you exactly which passages it used. This &ldquo;grounding&rdquo; lets users verify the
                answer by reading the source material &mdash; a critical advantage in high-stakes
                domains like medicine, law, and finance, where a hallucinated fact can cause
                real harm. The retrieved passages are the receipts.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of grounded generation</h2>

            <h3>RAG Architecture</h3>
            <p>
                RAG consists of three learned components working in sequence at inference time.
                Given a query q and a corpus D of passages, the retriever R maps the query to the
                top-k most relevant passages. The optional reranker &#961; reorders those passages by
                relevance. The generator G conditions on the query and all retrieved passages to
                produce the answer a:
            </p>
            <MathBlock tex="R(q, D) \;\to\; \{d_1, \ldots, d_k\} \subseteq D" />
            <MathBlock tex="\rho\!\left(\{d_1,\ldots,d_k\},\, q\right) \;\to\; \{d'_1,\ldots,d'_k\}" />
            <MathBlock tex="G\!\left(q,\, d'_1,\, d'_2,\, \ldots,\, d'_k\right) \;\to\; a" />
            <p>
                In practice the generator receives a single concatenated context string
                {" ["}q{"; "}d&#8321;{"; "}d&#8322;{"; "}&#8230;{"; "}d&#8342;{"]"} prepended to the generation prompt. The
                critical insight is that this is done entirely at <em>inference time</em> &mdash;
                no retraining of the generator is required to update the knowledge base.
            </p>

            <h3>RAG-Token vs. RAG-Sequence</h3>
            <p>
                Lewis et al. proposed two factorizations of the joint probability p(y|x) over
                the retrieved document distribution. <strong>RAG-Sequence</strong> retrieves once
                per query and generates the entire output sequence conditioned on a single
                retrieved document z, marginalizing over the top-k documents:
            </p>
            <MathBlock tex="p_{\text{RAG-Seq}}(y \mid x) \;\approx\; \sum_{z \in \text{top-}k} p_\eta(z \mid x) \cdot p_\theta(y \mid x, z)" />
            <p>
                <strong>RAG-Token</strong> re-retrieves at each generation step, allowing each
                output token y&#7522; to attend to a different document than the previous token:
            </p>
            <MathBlock tex="p_{\text{RAG-Token}}(y \mid x) \;\approx\; \prod_{i=1}^{|y|} \sum_{z \in \text{top-}k} p_\eta(z \mid x) \cdot p_\theta(y_i \mid y_{<i}, x, z)" />
            <p>
                RAG-Token is more expressive &mdash; it can draw different facts from different
                passages for different tokens &mdash; but requires k separate generator forward
                passes per output token, making it substantially more expensive at inference time.
                RAG-Sequence is the dominant form used in production systems.
            </p>

            <h3>Training: Marginalizing Over Retrieved Documents</h3>
            <p>
                Retrieved documents are treated as latent variables. The training loss marginalizes
                over the top-k retrieved passages, computing a weighted sum of per-document
                generation log-likelihoods where the weights are the retriever&rsquo;s passage scores:
            </p>
            <MathBlock tex="\mathcal{L} \;=\; -\log \sum_{j=1}^{k} p_\eta(d_j \mid q) \cdot p_\theta(y \mid q,\, d_j)" />
            <p>
                Gradients flow through both p&#945; (the generator, updated at every step) and
                p&#951; (the retriever encoder, updated by gradient ascent through the marginalization).
                The FAISS index over passage embeddings is <em>not</em> differentiable &mdash; it
                is rebuilt periodically (every few hundred steps) using the updated retriever
                encoder, providing an approximate gradient signal through retrieval.
            </p>

            <h3>Fusion-in-Decoder (FiD)</h3>
            <p>
                FiD (Izacard &amp; Grave, 2021) provides a more scalable alternative to RAG-Token.
                Each retrieved passage d&#7522; is prepended with the query and encoded
                <em>independently</em> by the encoder: h&#7522;&nbsp;=&nbsp;Encoder([q; d&#7522;]). All k
                encoded representations are then concatenated and fed to a single decoder that
                attends over the full concatenated sequence:
            </p>
            <MathBlock tex="\text{Attn}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V" />
            <p>
                where K and V are projected from the concatenation [h&#8321;; h&#8322;; &#8230;; h&#8342;] of all
                k encoder outputs. The decoder cross-attention dynamically weights contributions
                from all k passages for each output token, with no fixed ranking. FiD with
                k&nbsp;=&nbsp;100 passages outperforms RAG with k&nbsp;=&nbsp;5 because: (a) more
                retrieved context supplies more potential evidence, and (b) the cross-attention
                learns to ignore irrelevant passages and focus on the key supporting evidence
                regardless of its retrieval rank.
            </p>

            <h3>Retrieval Quality and Recall@k</h3>
            <p>
                The generator is fundamentally limited by what the retriever surfaces: if the
                correct answer passage is not in the top-k retrieved documents, the generator
                has no access to it and must hallucinate or refuse. The primary retrieval metric
                is Recall@k &mdash; the fraction of queries for which the gold passage appears
                among the top-k retrieved results:
            </p>
            <MathBlock tex="\text{Recall}@k \;=\; \frac{1}{|Q|} \sum_{q \in Q} \mathbf{1}\!\left[d^*_q \in \text{top-}k(q)\right]" />
            <p>
                On Natural Questions open-domain QA: BM25 Recall@20&nbsp;&asymp;&nbsp;59%, DPR
                Recall@20&nbsp;&asymp;&nbsp;79%. End-to-end exact-match accuracy correlates nearly
                linearly with retrieval recall across all systems studied in the DPR paper.
                This linear relationship has a decisive practical implication: for most
                production RAG systems, improving the retriever yields larger accuracy gains
                than improving the generator at equivalent engineering cost.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">ELBO derivation &middot; FAISS gradient analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">LangChain RAG pipeline &middot; PDF &rarr; FAISS &rarr; LLM</span>
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
            <h2>ELBO derivation and the non-differentiable retriever</h2>

            <DefBlock label="RAG as a Latent Variable Model">
                Let x be the query, y the target output, and z the retrieved document (a latent
                variable). The joint likelihood of observing y given x, marginalizing over z, is:
            </DefBlock>
            <MathBlock tex="p_{\eta,\theta}(y \mid x) = \sum_{z} p_\eta(z \mid x) \cdot p_\theta(y \mid x, z)" />
            <p>
                Direct maximization is intractable because the sum is over all passages in the
                corpus D. The approximation used in RAG is to restrict the sum to the top-k
                passages under the current retriever p&#951;(z|x), giving the tractable objective:
            </p>
            <MathBlock tex="\log p_{\eta,\theta}(y \mid x) \;\geq\; \log \sum_{j=1}^{k} p_\eta(d_j \mid x) \cdot p_\theta(y \mid x, d_j)" />
            <p>
                This is a lower bound on the true marginal log-likelihood, valid because the
                top-k passages assigned the highest probability mass by p&#951; approximate the
                full sum. The bound tightens as k increases and as the retriever improves its
                concentration on the gold passage.
            </p>

            <h3>The Non-Differentiable FAISS Index</h3>
            <p>
                The retriever score p&#951;(z|x) is defined as the softmax over inner products
                between the query embedding and all passage embeddings in the index:
            </p>
            <MathBlock tex="p_\eta(z \mid x) \;=\; \frac{\exp\!\left( E_Q(x)^\top E_P(z) \right)}{\sum_{z' \in D} \exp\!\left( E_Q(x)^\top E_P(z') \right)}" />
            <p>
                Gradients with respect to the passage encoder parameters E&#8346; flow through
                p&#951;(d&#11785;|x) for the top-k retrieved passages. However, the FAISS approximate
                nearest neighbor index stores a <em>static snapshot</em> of passage embeddings
                computed before training begins. As E&#8346; updates, the index becomes stale &mdash;
                the set of top-k passages it returns no longer corresponds to the updated passage
                embeddings. This creates a gradient approximation:
            </p>
            <MathBlock tex="\nabla_{\eta} \mathcal{L} \;\approx\; \nabla_{\eta} \log \sum_{j \in \text{top-}k^{\text{(stale)}}} p_\eta(d_j \mid x) \cdot p_\theta(y \mid x, d_j)" />
            <p>
                The stale index introduces a bias: the top-k set was correct at the last index
                refresh but may miss passages that have become more relevant under the updated
                retriever. The Lewis et al. paper found empirically that refreshing the index
                every 700 training steps was sufficient &mdash; the retriever parameters change
                slowly enough that staleness is tolerable for the duration between refreshes.
                This is a pragmatic, approximate solution to an otherwise intractable exact
                gradient computation.
            </p>

            <h3>Information-Theoretic View of Recall@k</h3>
            <p>
                Define the retrieval success indicator for query q as:
            </p>
            <MathBlock tex="\delta_k(q) = \mathbf{1}\!\left[ d^*_q \in \operatorname{top-}k(q) \right]" />
            <p>
                The expected generator loss decomposes into two terms: the loss given correct
                retrieval, weighted by Recall@k; and the loss given missed retrieval, weighted
                by (1 &minus; Recall@k):
            </p>
            <MathBlock tex="\mathbb{E}_q\!\left[\mathcal{L}_{\text{gen}}\right] = \text{Recall}@k \cdot \mathbb{E}\!\left[\mathcal{L}_{\text{gen}} \mid \delta_k = 1\right] + (1 - \text{Recall}@k) \cdot \mathbb{E}\!\left[\mathcal{L}_{\text{gen}} \mid \delta_k = 0\right]" />
            <p>
                Since the generator has no access to d&#42; when &#948;&#8342;(q)&nbsp;=&nbsp;0, the
                conditional loss in the second term is bounded below by the entropy of the answer
                distribution H(y|x) &mdash; the generator must rely solely on parametric
                knowledge. This formalizes the intuition that improving Recall@k directly reduces
                the fraction of queries where the generator is forced to hallucinate.
            </p>

            <div className="ch-callout">
                <strong>Practical takeaway:</strong> The retriever is the bottleneck. For any
                RAG system where Recall@k is below 90%, engineering effort spent improving
                the retriever &mdash; better embedding models, hybrid BM25+dense retrieval,
                query expansion, HyDE &mdash; yields larger accuracy gains than improving the
                generator. The mathematics confirms what practitioners discovered empirically.
            </div>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

# ── Step 1: Load and chunk a PDF ──────────────────────────────────────────────
loader = PyPDFLoader("attention_is_all_you_need.pdf")
raw_pages = loader.load()                       # list of Document objects

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,           # characters per chunk
    chunk_overlap=64,         # overlap to preserve context across chunk boundaries
    separators=["\n\n", "\n", ".", " "],
)
chunks = splitter.split_documents(raw_pages)
print(f"Split into {len(chunks)} chunks")

# ── Step 2: Embed chunks and build FAISS index ────────────────────────────────
embed_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

# This encodes all chunks and stores them in a FAISS flat L2 index
vectorstore = FAISS.from_documents(chunks, embed_model)
vectorstore.save_local("faiss_index")          # persist to disk

# ── Step 3: Set up the retriever ──────────────────────────────────────────────
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5},                    # retrieve top-5 passages
)

# Inspect what the retriever returns for a sample query
query = "What is the scaled dot-product attention formula?"
retrieved_docs = retriever.get_relevant_documents(query)
for i, doc in enumerate(retrieved_docs):
    print(f"\\n--- Passage {i+1} (page {doc.metadata.get('page', '?')}) ---")
    print(doc.page_content[:300])

# ── Step 4: Set up a local LLM generator ─────────────────────────────────────
hf_pipeline = pipeline(
    "text2text-generation",
    model="google/flan-t5-base",               # small seq2seq model for demo
    max_new_tokens=256,
    do_sample=False,
)
llm = HuggingFacePipeline(pipeline=hf_pipeline)

# ── Step 5: Assemble the RAG chain ────────────────────────────────────────────
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",                        # concatenate all passages into context
    retriever=retriever,
    return_source_documents=True,              # include retrieved passages in output
)

# ── Step 6: Query the RAG system ──────────────────────────────────────────────
result = rag_chain({"query": query})

print("\\n=== Answer ===")
print(result["result"])

print("\\n=== Source Documents ===")
for i, doc in enumerate(result["source_documents"]):
    print(f"[{i+1}] Page {doc.metadata.get('page', '?')}: {doc.page_content[:120]}...")

# ── Manual FAISS retrieval (without LangChain) ────────────────────────────────
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Build index from scratch
passages = [doc.page_content for doc in chunks]
embeddings = encoder.encode(passages, convert_to_numpy=True, normalize_embeddings=True)

dim = embeddings.shape[1]                       # 384 for MiniLM-L6-v2
index = faiss.IndexFlatIP(dim)                  # inner product = cosine sim (normalized)
index.add(embeddings)

# Retrieve top-k for a query
q_vec = encoder.encode([query], normalize_embeddings=True)
D, I = index.search(q_vec, k=5)               # D=distances, I=indices

print("\\n=== Manual FAISS retrieval ===")
for rank, (dist, idx) in enumerate(zip(D[0], I[0])):
    print(f"Rank {rank+1} | Score: {dist:.4f}")
    print(f"  {passages[idx][:150]}...")
`

function PythonContent() {
    return (
        <>
            <p>
                A complete RAG pipeline using LangChain: load a PDF, chunk it with overlap,
                embed chunks with a sentence transformer, store in a FAISS index, retrieve the
                top-5 passages for a query, and generate an answer with a seq2seq LLM. Includes
                a manual FAISS retrieval section showing the raw inner-product search without
                the framework abstraction.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="rag_pipeline.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const RAG_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
