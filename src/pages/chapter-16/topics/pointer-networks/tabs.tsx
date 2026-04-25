import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning to copy: the birth of pointer networks</h2>
            <p>
                Standard Seq2Seq models generate output tokens from a fixed vocabulary — they
                cannot produce words that only appear in the input. For tasks like text
                summarization, reading comprehension, or sorting, the correct output often
                requires copying directly from the input. Pointer Networks (2015) introduced
                an attention-based mechanism that could select positions in the input rather
                than generating vocabulary tokens, opening a family of architectures that
                bridges generation and retrieval.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Origin</div>
                    <div className="ch-tl-title">Pointer Networks — Vinyals, Fortunato &amp; Jaitly</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Seq2Seq models could only generate tokens from a fixed output vocabulary.
                        This was catastrophic for combinatorial problems — sorting, convex hull,
                        and the travelling salesman problem — where the output is a permutation
                        of the input, and the output vocabulary changes size and identity with
                        every input. An encoder-decoder LSTM trying to sort 10 numbers would need
                        to somehow learn all possible orderings as output classes, which is
                        fundamentally intractable.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Oriol Vinyals, Meire Fortunato, and Navdeep Jaitly at Google Brain published
                        "Pointer Networks" at NeurIPS 2015. Their key insight: use attention weights
                        not to compute a weighted sum of encoder outputs, but to directly select
                        one encoder position as the output token. The softmax over attention scores
                        becomes a probability distribution over input positions — the model "points"
                        to which input element to emit next. The output vocabulary is the input
                        itself, which adapts automatically to input size. Demonstrated on convex
                        hull computation, Delaunay triangulation, and TSP.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Pointer Networks were the first neural model to generalize across variable-
                        length output spaces defined entirely by the input. They solved TSP
                        instances of size 5–20 with near-optimal tour lengths, and sorted sequences
                        of up to 50 elements with 99.9% accuracy — tasks where standard Seq2Seq
                        completely failed. The architecture proved that attention could serve as a
                        selection mechanism, not just a soft-retrieval mechanism.
                    </div>
                    <div className="ch-tl-impact">Impact: First mechanism allowing neural networks to generalize to variable-length output spaces defined by the input</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Copy for Language</div>
                    <div className="ch-tl-title">Gu et al. — Incorporating Copying Mechanism in Seq2Seq</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Dialogue and summarization models kept generating wrong names, numbers, and
                        entities because these words were rare in the training vocabulary — the
                        model could not reliably generate "Bartholomew Wiggins-Smith" if it had
                        only seen that name once. The out-of-vocabulary (OOV) problem was especially
                        severe in summarization and question answering, where faithfulness to source
                        text names and numbers is critical.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Jiatao Gu and colleagues from the University of Hong Kong proposed a
                        "copy mechanism" that allowed decoder at each step to either generate from
                        the vocabulary or copy a token from the source sequence. The copy probability
                        was computed from the encoder hidden states via a learned scoring function,
                        and the final output distribution was a mixture of generate-probability and
                        copy-probability over all source positions. This directly extended pointer
                        networks to the open-vocabulary language generation setting.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The copy mechanism reduced OOV errors in dialogue by 40–60% and in
                        summarization significantly. It also established the "copy vs. generate"
                        framing that would become standard: at each decoding step, the model
                        decides whether to retrieve an existing string or compose a new one from
                        internal knowledge.
                    </div>
                    <div className="ch-tl-impact">Impact: First copy mechanism for open-vocabulary language generation, directly addressing OOV errors</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Abstractive Summarization</div>
                    <div className="ch-tl-title">See, Liu &amp; Manning — Pointer-Generator with Coverage</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Abstractive summarization models would confidently generate factually
                        incorrect outputs — hallucinating names, swapping numbers, or inventing
                        events — because generation from vocabulary had no mechanism to verify
                        faithfulness to the source. Additionally, models often generated repetitive
                        summaries by repeatedly attending to the same source sentences.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Abigail See, Peter Liu, and Christopher Manning at Stanford introduced
                        the Pointer-Generator Network, which combined the Bahdanau attention
                        mechanism with a soft switch p<sub>gen</sub> controlling whether to generate
                        (from vocab) or copy (from source). They also added a <em>coverage mechanism</em>:
                        a running sum of past attention distributions that penalizes attending to
                        already-covered positions. The coverage loss &#8721;<sub>i</sub> min(&#945;<sub>i</sub>, c<sub>i</sub>)
                        discouraged repetition explicitly.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        On CNN/DailyMail summarization, Pointer-Generator + Coverage reduced
                        repetition from 14.7% to 2.8% and improved ROUGE-L by 2+ points over
                        the baseline. The paper became the standard reference implementation for
                        neural summarization for several years, and the coverage mechanism
                        influenced later work on attention monotonicity and faithfulness constraints.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the standard approach for faithful neural summarization; introduced coverage to reduce repetition</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – 2018</div>
                    <div className="ch-tl-section-label">Reading Comprehension</div>
                    <div className="ch-tl-title">SQuAD and Span-Based Answer Extraction</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        The Stanford Question Answering Dataset (SQuAD) required models to extract
                        answer spans from passages — the answer was always a contiguous substring
                        of the passage. This is exactly a pointer problem: the model must select
                        a start position and an end position in the context rather than generating
                        arbitrary text.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Models like BiDAF (Seo et al., 2017) and R-Net (Wang et al., 2017) formalized
                        reading comprehension as a two-pointer problem: predict a softmax distribution
                        over passage tokens for the answer start, and another distribution for the
                        answer end. The pointer mechanism made this natural — attention over the
                        passage produced the start distribution, and a second attention conditioned
                        on the start produced the end distribution. These "pointer span" models
                        achieved near-human performance on SQuAD 1.1.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Pointer span prediction became the standard architecture for extractive
                        question answering, and is still used in BERT-based QA (the BERT fine-tuning
                        paper outputs start and end logits over the context — a direct descendant
                        of the pointer mechanism). The idea that "extraction is better than
                        generation" for factual QA persists in modern retrieval-augmented systems.
                    </div>
                    <div className="ch-tl-impact">Impact: Established pointer span extraction as the standard QA architecture, directly inspiring BERT-based QA fine-tuning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – Present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">Retrieval-Augmented Generation and Modern Grounding</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Large language models generate fluently but hallucinate facts — they
                        cannot reliably distinguish what they know from what they confabulate.
                        The fundamental problem is the same one Gu et al. (2016) identified:
                        generation from internal parameters is unreliable for rare or time-sensitive
                        facts.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Retrieval-Augmented Generation (RAG, Lewis et al. 2020) combined a dense
                        retriever (which selects relevant passages from a corpus) with a generator
                        (which reads the passages and produces an answer). The generator's attention
                        over retrieved passages is a scaled-up pointer mechanism: instead of pointing
                        to individual tokens, the model points to retrieved documents. Modern
                        systems like Perplexity, ChatGPT with browsing, and Bing Chat are direct
                        descendants of this retrieve-then-generate architecture.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        RAG showed that the copy-vs-generate tension never went away — it just
                        scaled. The insight that faithfulness to source requires explicit copying
                        rather than implicit memorization is now the foundation of all production
                        grounded generation systems. Every time a chatbot cites a webpage, it is
                        executing a pointer operation.
                    </div>
                    <div className="ch-tl-impact">Impact: The pointer/copy principle is the foundation of modern retrieval-augmented generation and grounded LLM systems</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The enduring insight:</strong> Some outputs should be generated from
                parametric knowledge; others should be copied from the available context. The
                pointer network made this distinction explicit and learnable. Every subsequent
                advance — coverage, span extraction, RAG — is a refinement of this single idea.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A network that can point, not just speak</h2>

            <Analogy label="The Missing Word Problem">
                Imagine a student summarizing a news article. Sometimes they need to use the
                exact name "Bartholomew Wiggins-Smith" — a name they've never seen before and
                definitely isn't in their personal vocabulary. A regular Seq2Seq model would
                fail here, because "Bartholomew Wiggins-Smith" is not in its dictionary.
                <br /><br />
                A pointer network can simply point to where "Bartholomew Wiggins-Smith" appears
                in the article and copy it directly. Instead of generating from its vocabulary,
                it generates by selecting a position in the input — no matter how rare or unusual
                that word is.
            </Analogy>

            <Analogy label="The Highlighter">
                Instead of always writing new words, a pointer network has two modes: a
                <em> pen</em> (for generating vocabulary words) and a <em>highlighter</em>
                (for copying source words). It reads the input, and when it needs to output
                something, it can either:
                <br /><br />
                (1) Write a word from its own vocabulary — good for common words like "the", "is", "and."
                <br /><br />
                (2) Highlight a word in the input and copy it — good for rare names, numbers,
                or specific facts that the model has never learned to generate on its own.
                <br /><br />
                The model learns to decide which mode to use at each step — a soft switch called
                p<sub>gen</sub> in the Pointer-Generator paper.
            </Analogy>

            <Analogy label="Solving the Traveling Salesman">
                Vinyals tested pointer networks on the traveling salesman problem: given 10 cities
                plotted on a map, find the shortest route that visits all of them exactly once.
                <br /><br />
                The network learns to point to cities one by one, selecting each as the next
                stop. At each step, the attention mechanism highlights one city from the list
                and says "go here next." Regular neural networks couldn't do this at all —
                they would need a fixed output vocabulary that listed all possible orderings of
                all possible cities, which is impossibly large.
            </Analogy>

            <Analogy label="The Repetition Problem — Covering Your Tracks">
                Early pointer networks had a bad habit: they kept pointing to the same parts of
                the source text over and over. A summary might say "The president announced
                the plan. The announcement was made by the president. The president made the
                announcement." — pointlessly repetitive.
                <br /><br />
                See, Liu, and Manning (2017) fixed this with a "coverage" memory. They kept a
                running record of everywhere the model had already pointed. If position 7 had
                already received lots of attention, a penalty made the model less likely to
                point there again. Like a tour guide who keeps track of which exhibits the
                group has already visited.
            </Analogy>

            <Analogy label="Reading Comprehension — Two Fingers on a Page">
                The SQuAD reading comprehension task asked: "Here's a passage. Here's a
                question. Where in the passage is the answer?" The answer was always a
                contiguous chunk of the passage — a span.
                <br /><br />
                Models solved this with two pointer distributions: one to find where the
                answer starts, and one to find where it ends. Like placing your left finger
                on the start of the answer and your right finger on the end. This two-pointer
                trick — a direct descendant of Vinyals' pointer networks — became the standard
                architecture for QA, and BERT still uses it today.
            </Analogy>

            <Analogy label="Modern RAG — Pointing at the Internet">
                Today's chatbots with web access use a scaled-up version of exactly this idea.
                When you ask "What did the Prime Minister say yesterday?", the chatbot
                retrieves relevant web pages and then points to the relevant sentences within
                those pages. The retrieved passages play the role of the encoder's hidden
                states; the chatbot plays the role of the pointer network.
                <br /><br />
                The fundamental insight from 2015 — "for faithful output, select from context
                rather than generate from memory" — is the foundation of retrieval-augmented
                generation. Every time a chatbot cites a source, it's executing a pointer.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Attention as a selection mechanism</h2>

            <h3>The Core Idea: Selection vs. Aggregation</h3>
            <p>
                In standard Bahdanau attention, the context vector is a weighted sum of all
                encoder hidden states — a soft, continuous aggregation:
            </p>
            <MathBlock tex="c_t = \sum_{i=1}^{n} \alpha_{ti} h_i" />
            <p>
                This context vector is then used to predict the next output token from the
                vocabulary. In a pointer network, instead of summing, the attention distribution
                &#945; is treated as the output distribution directly:
            </p>
            <MathBlock tex="P(\text{output}_t = \text{input}_i) = \alpha_{ti}" />
            <p>
                The network "points" to input position i with probability &#945;<sub>ti</sub>. The
                encoder computes a representation of every input element; the decoder uses
                attention to select which one to emit next. No vocabulary is needed because
                the output space is the input itself.
            </p>

            <h3>Attention Energy Computation</h3>
            <p>
                The pointer attention energy between decoder state d<sub>t</sub> and encoder
                state h<sub>i</sub> is computed with a learned scoring function:
            </p>
            <MathBlock tex="e_{ti} = \mathbf{v}^\top \tanh(\mathbf{W}_1 \mathbf{h}_i + \mathbf{W}_2 \mathbf{d}_t)" />
            <MathBlock tex="\alpha_{ti} = \frac{\exp(e_{ti})}{\sum_{j=1}^{n} \exp(e_{tj})}" />
            <p>
                W<sub>1</sub>, W<sub>2</sub>, and v are learned parameters. The softmax
                distribution &#945;<sub>t</sub> &#8712; &#8710;<sup>n</sup> (the n-simplex) is both the
                attention distribution and the output distribution — a single computation
                serves two purposes.
            </p>

            <h3>Pointer-Generator Network</h3>
            <p>
                The Pointer-Generator (See et al. 2017) combines generation and copying via a
                soft switch p<sub>gen</sub> &#8712; [0, 1] learned at each decoding step:
            </p>
            <MathBlock tex="P(w) = p_{\text{gen}} \cdot P_{\text{vocab}}(w) + (1 - p_{\text{gen}}) \cdot \sum_{i:\, x_i = w} \alpha_{ti}" />
            <p>
                p<sub>gen</sub> is computed from the context vector c<sub>t</sub>, decoder state d<sub>t</sub>,
                and decoder input x<sub>t</sub> via a sigmoid:
            </p>
            <MathBlock tex="p_{\text{gen}} = \sigma\!\left(\mathbf{w}_c^\top c_t + \mathbf{w}_d^\top d_t + \mathbf{w}_x^\top x_t + b\right)" />
            <p>
                When w appears at multiple source positions, their copy probabilities sum. This
                allows the extended vocabulary to grow dynamically with any OOV word that appears
                in the source.
            </p>

            <h3>Coverage Mechanism</h3>
            <p>
                The coverage vector c<sub>t</sub> accumulates all past attention distributions
                to track which source positions have been attended to:
            </p>
            <MathBlock tex="\mathbf{c}^t = \sum_{t'=0}^{t-1} \boldsymbol{\alpha}^{t'}" />
            <p>
                The coverage vector is incorporated into the attention energy computation:
            </p>
            <MathBlock tex="e_{ti} = \mathbf{v}^\top \tanh(\mathbf{W}_1 \mathbf{h}_i + \mathbf{W}_2 \mathbf{d}_t + \mathbf{W}_c \mathbf{c}^t_i)" />
            <p>
                A coverage loss penalizes re-attending to already-covered positions:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{cov}} = \sum_i \min(\alpha_{ti},\; c^t_i)" />
            <p>
                This discourages the model from generating repetitive summaries by attending
                repeatedly to the same source sentence.
            </p>

            <h3>Span-Based QA: Two Pointers</h3>
            <p>
                For extractive QA (SQuAD), the answer is a span [start, end] in the passage.
                The pointer mechanism is applied twice: once to predict the start position,
                and once to predict the end position conditioned on the start:
            </p>
            <MathBlock tex="P_{\text{start}}(i) = \text{softmax}(\mathbf{h}_i^\top \mathbf{w}_s)" />
            <MathBlock tex="P_{\text{end}}(j) = \text{softmax}(\mathbf{h}_j^\top \mathbf{w}_e)" />
            <p>
                The answer span is the pair (i*, j*) that maximizes P<sub>start</sub>(i) &#183; P<sub>end</sub>(j)
                subject to j &#8805; i. BERT fine-tuning for QA adds exactly two linear layers on
                top of the encoder to produce these two distributions — direct descendants of
                the pointer mechanism.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Modern relevance:</strong> Copy mechanisms appear in open-book QA
                (copying answers from context), summarization (copying key facts), code
                generation (copying variable names and API calls), and retrieval-augmented
                generation (copying from retrieved documents). The fundamental insight — that
                faithfulness requires selection from context, not generation from parameters —
                remains the primary tool for grounding LLM outputs to verifiable sources.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations · coverage loss derivation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · PyTorch</span>
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
            <h2>Pointer Networks: Formal definitions and coverage analysis</h2>

            <DefBlock label="Pointer Network — Formal Specification">
                Let (x<sub>1</sub>, …, x<sub>n</sub>) be an input sequence and (y<sub>1</sub>, …, y<sub>m</sub>)
                the output sequence where each y<sub>i</sub> &#8712; &#123;1, …, n&#125; is an index into the input.
                The encoder maps each x<sub>i</sub> to a hidden state h<sub>i</sub> &#8712; &#8477;<sup>d</sup>.
                The decoder maintains state d<sub>t</sub> &#8712; &#8477;<sup>d</sup>.
                The pointer network defines a distribution over input positions at each step.
            </DefBlock>

            <h3>Output Distribution</h3>
            <MathBlock tex="p(y_t \mid y_1, \ldots, y_{t-1}, \mathbf{x}) = \text{softmax}(\mathbf{e}_t)" />
            <p>where the attention energy vector e<sub>t</sub> &#8712; &#8477;<sup>n</sup> has components:</p>
            <MathBlock tex="e_{ti} = \mathbf{v}^\top \tanh(\mathbf{W}_1 \mathbf{h}_i + \mathbf{W}_2 \mathbf{d}_t),\quad i = 1,\dots,n" />
            <p>
                Parameters W<sub>1</sub>, W<sub>2</sub> &#8712; &#8477;<sup>d&#215;d</sup> and v &#8712; &#8477;<sup>d</sup>
                are learned. The argmax of this distribution selects the output position;
                during training, cross-entropy loss is applied directly over input positions.
            </p>

            <h3>Comparison: Standard Attention vs. Pointer</h3>
            <MathBlock tex="\begin{array}{ll} \textbf{Standard attention} & c_t = \sum_i \alpha_{ti} h_i \;\; \text{(context vector, then generate)} \\ \textbf{Pointer} & \hat{y}_t = \arg\max_i \alpha_{ti} \;\; \text{(input position as output)} \end{array}" />

            <h3>Coverage Loss Derivation</h3>
            <p>
                Define the coverage vector at step t as the cumulative attention:
                c<sup>t</sup> = &#8721;<sub>t'&lt;t</sub> &#945;<sup>t'</sup>.
                The coverage loss at step t is:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{cov}}^t = \sum_{i=1}^{n} \min(\alpha_{ti},\; c_i^t)" />
            <p>
                This is bounded by min(1, c<sup>t</sup><sub>i</sub>) from above. The intuition:
                if position i has already received &#947; units of attention (c<sub>i</sub> = &#947;),
                then attending to it again with &#945;<sub>ti</sub> &#8804; &#947; costs &#945;<sub>ti</sub>
                (full penalty); attending with &#945;<sub>ti</sub> &gt; &#947; costs only &#947;
                (partial penalty). Total training loss:
            </p>
            <MathBlock tex="\mathcal{L} = -\log p(y^* \mid x) + \lambda \sum_t \mathcal{L}_{\text{cov}}^t" />
            <p>
                where &#955; &#8776; 1 was used in the See et al. experiments.
            </p>

            <h3>Pointer-Generator: Information-Theoretic View</h3>
            <p>
                The Pointer-Generator output distribution is a mixture model with learned
                mixing coefficient p<sub>gen</sub>:
            </p>
            <MathBlock tex="P(w) = p_{\text{gen}} P_{\text{vocab}}(w) + (1 - p_{\text{gen}}) P_{\text{copy}}(w)" />
            <p>
                where P<sub>copy</sub>(w) = &#8721;<sub>i: x<sub>i</sub>=w</sub> &#945;<sub>ti</sub>.
                The model learns to maximize log P(y<sub>t</sub>) at each step, which gives a
                gradient incentive to set p<sub>gen</sub> high when y<sub>t</sub> is in the
                vocabulary and to maximize &#945;<sub>ti</sub> for the correct position when copying.
            </p>

            <div className="ch-callout">
                <strong>Why copy and generate rather than just copy?</strong> Purely extractive
                models (copy only) cannot perform abstraction, paraphrase, or sentence fusion —
                essential for high-quality summarization. Purely generative models hallucinate
                rare facts. The mixture model allocates generation to common, abstractable
                content and copying to rare, faithful content, achieving the best of both.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class PointerNetwork(nn.Module):
    """
    Simplified pointer network for sequence selection tasks.
    At each step, computes a distribution over encoder positions.
    """

    def __init__(self, input_dim: int, hidden_dim: int):
        super().__init__()
        self.encoder = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.decoder = nn.LSTMCell(input_dim, hidden_dim)

        # Pointer attention: W1 (encoder), W2 (decoder), v (score)
        self.W1 = nn.Linear(hidden_dim, hidden_dim, bias=False)
        self.W2 = nn.Linear(hidden_dim, hidden_dim, bias=False)
        self.v  = nn.Linear(hidden_dim, 1, bias=False)

    def _point(self, enc_out: torch.Tensor, dec_h: torch.Tensor) -> torch.Tensor:
        """
        enc_out : (batch, seq_len, hidden)
        dec_h   : (batch, hidden)
        Returns : (batch, seq_len) pointer distribution
        """
        enc_proj = self.W1(enc_out)                      # (B, T, H)
        dec_proj = self.W2(dec_h).unsqueeze(1)           # (B, 1, H)
        energy = self.v(torch.tanh(enc_proj + dec_proj)) # (B, T, 1)
        return F.softmax(energy.squeeze(-1), dim=-1)     # (B, T)

    def forward(self, inputs: torch.Tensor, n_steps: int) -> torch.Tensor:
        """
        inputs  : (batch, seq_len, input_dim)
        n_steps : how many pointers to emit
        Returns : (batch, n_steps, seq_len) pointer distributions
        """
        B, T, _ = inputs.shape
        enc_out, (h, c) = self.encoder(inputs)
        h, c = h.squeeze(0), c.squeeze(0)

        # Start token: soft mean of encoder outputs
        dec_input = inputs.mean(dim=1)
        pointers = []
        for _ in range(n_steps):
            h, c = self.decoder(dec_input, (h, c))
            ptr = self._point(enc_out, h)          # (B, T)
            pointers.append(ptr)
            # Soft-select next decoder input via weighted sum
            dec_input = (ptr.unsqueeze(-1) * inputs).sum(dim=1)  # (B, input_dim)

        return torch.stack(pointers, dim=1)        # (B, n_steps, T)


# ── Pointer-Generator switch p_gen ────────────────────────────────────────────
class PointerGeneratorSwitch(nn.Module):
    """Computes p_gen from context, decoder state, and decoder input."""
    def __init__(self, hidden_dim: int, input_dim: int):
        super().__init__()
        self.linear = nn.Linear(hidden_dim * 2 + input_dim, 1)

    def forward(self, context: torch.Tensor, dec_h: torch.Tensor,
                dec_input: torch.Tensor) -> torch.Tensor:
        combined = torch.cat([context, dec_h, dec_input], dim=-1)
        return torch.sigmoid(self.linear(combined))  # (B, 1)


# ── Test ──────────────────────────────────────────────────────────────────────
model = PointerNetwork(input_dim=4, hidden_dim=64)
x = torch.randn(2, 8, 4)  # batch=2, seq=8, dim=4
ptrs = model(x, n_steps=4)
print(f"Input:              {tuple(x.shape)}")
print(f"Pointer dists:      {tuple(ptrs.shape)}  (batch, steps, positions)")
print(f"Row sums (should=1): {ptrs[0].sum(dim=-1).detach().numpy().round(4)}")

switch = PointerGeneratorSwitch(64, 4)
context = torch.randn(2, 64)
dec_h   = torch.randn(2, 64)
dec_inp = torch.randn(2, 4)
p_gen = switch(context, dec_h, dec_inp)
print(f"p_gen range: [{p_gen.min():.3f}, {p_gen.max():.3f}]")
`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of a pointer network with soft-selection decoder input
                and a Pointer-Generator switch module. The demo shows that each step outputs
                a valid probability distribution over input positions, and illustrates how
                p<sub>gen</sub> would control the copy/generate mixture.
            </p>
            <CodeBlock code={PY_CODE} filename="pointer_network.py" lang="python" langLabel="Python" />
        </>
    )
}

export const POINTER_NETWORKS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
