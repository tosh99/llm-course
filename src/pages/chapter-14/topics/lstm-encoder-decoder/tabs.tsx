import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Why LSTM — and why reversing the source worked</h2>
            <p>
                The choice of LSTM as the encoder-decoder cell was deliberate. A simple RNN cannot reliably compress a long sentence into a fixed vector — the vanishing gradient problem means information from early tokens is lost by the time the encoder finishes reading. LSTM's cell state provides a highway for information to persist across hundreds of steps, making it the natural choice for the seq2seq backbone.
            </p>
            <p>
                The most surprising contribution of Sutskever et al. (2014) was not the LSTM encoder-decoder itself — it was reversing the source sequence. Feeding the source sentence backwards (last word first) into the encoder improved BLEU by more than 5 points on WMT14 English-French. The reason is subtle and worth understanding precisely.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1997</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">LSTM invented — Hochreiter &amp; Schmidhuber</div>
                    <div className="ch-tl-body">
                        <p>
                            The Long Short-Term Memory architecture was designed explicitly to solve the vanishing gradient problem in RNNs — the tendency for error signals to shrink exponentially as they backpropagate through long sequences, making it impossible for the network to learn that a subject noun 40 tokens back determines the verb agreement right now. The solution was structural: a cell state c<sub>t</sub> that flows through the network connected by additive (not multiplicative) interactions, gated by learned sigmoid functions.
                        </p>
                        <p>
                            Three gates control the LSTM cell: the forget gate f<sub>t</sub> decides how much of the old cell state to keep; the input gate i<sub>t</sub> decides how much of the new candidate state to write; the output gate o<sub>t</sub> decides how much of the cell state to expose as the hidden state. The resulting architecture could, in principle, maintain arbitrary information across thousands of time steps — demonstrated on synthetic tasks designed to test exactly this capability.
                        </p>
                        <p>
                            For 17 years the LSTM remained largely an academic curiosity, outperforming vanilla RNNs on toy tasks but not yet applied to the large-scale sequence problems where its advantages would be decisive. It was not until 2012–2014, when GPU compute made large-scale training feasible and deep learning had demonstrated its potential on vision and speech, that LSTM found its moment. When Sutskever reached for a recurrent cell to build an encoder-decoder, LSTM was the only credible option.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Created the memory mechanism that made long-range sequence modeling possible; waited 17 years for sufficient scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">Application to MT</div>
                    <div className="ch-tl-title">Sutskever et al. — Deep LSTM encoder-decoder</div>
                    <div className="ch-tl-body">
                        <p>
                            Sutskever, Vinyals, and Le used a 4-layer LSTM encoder and 4-layer LSTM decoder. The layering was deliberate and important: a single LSTM layer could compress an input sentence, but four layers allowed the network to build progressively more abstract representations. Lower layers captured local syntactic patterns; higher layers captured global semantic meaning. The output of each LSTM layer fed as the input to the layer above it at the same time step.
                        </p>
                        <p>
                            The key technical contributions beyond simply using deep LSTM were: (1) using both h<sub>T</sub> and c<sub>T</sub> (not just the hidden state) as the initial decoder state — the cell state carries the long-range memory that h<sub>T</sub> has partially discarded through the output gate; (2) reversing the source sequence before encoding; (3) using a vocabulary of 160,000 words and handling OOV words via a special unknown token. On WMT14 En-Fr, a 5-model ensemble achieved 34.8 BLEU — directly competitive with phrase-based SMT systems requiring years of engineering and hand-crafted linguistic features.
                        </p>
                        <p>
                            The reversal trick deserves special emphasis because it seems counterintuitive. The intuition: translation is broadly monotonic — the first English word often aligns to the first French word, the second to the second, and so on. In a forward encoder, the first English word is processed at step 1 and its memory must survive 3, 4, ... T further LSTM steps before being used by the decoder. In a reversed encoder, the first English word is processed last — it is the freshest information in the encoder's state when the decoder begins. The minimum "time lag" between the first source word and first target word drops from T to near 1.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Proved deep LSTMs alone could achieve SMT-level MT; established source reversal and cell-state transfer as standard techniques</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">The thought vector</div>
                    <div className="ch-tl-title">Vinyals — The "Thought Vector" Concept</div>
                    <div className="ch-tl-body">
                        <p>
                            Oriol Vinyals and colleagues articulated a broader vision for the context vector: it was not just a compressed sentence representation for translation, but a universal "thought vector" — a fixed-size encoding of any sequence's meaning that could be decoded into any other sequence type. This framing positioned the encoder-decoder as a general-purpose sequence transformer, not just a translation architecture.
                        </p>
                        <p>
                            Vinyals demonstrated this generality through several papers: "Pointer Networks" (2015) used an encoder-decoder to solve combinatorial optimization problems (traveling salesman, convex hull) by treating them as sequence transduction tasks. "Grammar as a Foreign Language" (2015) parsed sentences by treating the parse tree as a sequence to be generated. "Show and Tell" (2015) encoded images (via CNN) and decoded captions (via LSTM) — the same encoder-decoder paradigm but with a visual encoder instead of a textual one.
                        </p>
                        <p>
                            The thought vector concept was inspirational but also highlighted the bottleneck problem: a single fixed-size vector cannot efficiently represent all possible input semantics. For short sentences, the thought vector worked well. For long texts, it was lossy in ways that attention would solve. But the conceptual generalization — any encoder produces a thought vector that any decoder can consume — laid the groundwork for multi-modal and multi-task models.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Generalized encoder-decoder to image captioning, parsing, optimization; framed the context vector as a universal "thought vector"</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Industry deployment</div>
                    <div className="ch-tl-title">Google NMT — LSTM enc-dec at production scale</div>
                    <div className="ch-tl-body">
                        <p>
                            Wu et al.'s "Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation" (2016) described the architecture deployed across Google Translate for over a hundred billion words of daily translation. The system used an 8-layer LSTM encoder and 8-layer LSTM decoder with attention and residual connections between LSTM layers — the residual connections (borrowed from ResNets, Ch. 8) were essential for training 8-layer recurrent networks stably.
                        </p>
                        <p>
                            The production system added several engineering innovations beyond the research prototype: wordpiece vocabularies (splitting rare words into subword units to handle morphological richness without explosion of vocabulary size), quantized weights for efficient inference on Google's TPU hardware, and a novel RL-based fine-tuning step that optimized BLEU directly rather than just per-token cross-entropy. The result reduced translation errors by 60% for Chinese-to-English compared to the previous phrase-based system.
                        </p>
                        <p>
                            GNMT's deployment marked the practical end of phrase-based SMT. Not because the NMT system was categorically superior on all metrics — phrase-based SMT was more reliable for rare terminology and domain-specific translation — but because the NMT system was good enough on the vast majority of everyday text, and its path to improvement was through more data and compute rather than through laborious hand-engineering. The learning-based paradigm had conclusively won.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: End of phrase-based SMT in production; LSTM encoder-decoder at industrial scale; wordpiece vocabulary as lasting contribution</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Successor</div>
                    <div className="ch-tl-title">Transformer — Attention replaces recurrence</div>
                    <div className="ch-tl-body">
                        <p>
                            Vaswani et al.'s "Attention Is All You Need" replaced both encoder and decoder LSTM cells with multi-head self-attention layers. The LSTM encoder-decoder remained a valid architecture for another two to three years on many tasks, but the Transformer's training parallelism (the full sequence can be processed in one forward pass during training, not step by step) and its superior scaling properties eventually made LSTM encoder-decoders obsolete for most applications.
                        </p>
                        <p>
                            The conceptual debt to the LSTM encoder-decoder is total: the Transformer is still an encoder-decoder architecture in the exact sense of Sutskever's model — it reads a source sequence and produces a target sequence. What changed was the internal mechanism: self-attention replaced the sequential recurrent computation, enabling parallelism during training and better modeling of long-range dependencies. The "thought vector" became the set of all encoder hidden states attended to by the decoder at each step.
                        </p>
                        <p>
                            Modern LLMs like GPT-4 are decoder-only Transformers — they have no separate encoder, using only the decoder half of the seq2seq architecture applied to the concatenation of prompt and generation. But encoder-decoder Transformers (T5, BART, mT5) remain competitive for tasks with a natural source-to-target structure: translation, summarization, and document question answering. The LSTM encoder-decoder, invented in 2014, still describes the fundamental structure of the most powerful generative models in existence.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: LSTM enc-dec superseded by Transformer, but the encoder-decoder paradigm itself survives in T5, BART, and modern LLMs</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why reversal helps:</strong> In English-to-French translation, the first English
                word often aligns to the first French word. In a forward encoder, the first English
                word is processed earliest and its information must survive the full encoding of
                the sentence. In a reversed encoder, the first English word is processed <em>last</em>,
                leaving its information fresh in the hidden state when the decoder starts. This
                reduces the "minimum time lag" between corresponding source and target words
                from T steps to approximately 1 step.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Two memory robots: Reader and Writer</h2>

            <Analogy label="The Reader and the Writer">
                Imagine two robots working together to translate a book. The <strong>Reader</strong> robot
                reads the entire source book from start to finish. As it reads, it takes notes in a
                special notebook — both quick notes (the hidden state h) and deep memories (the cell
                state c). When it's done, it hands the notebook to the Writer robot.
                <br /><br />
                The <strong>Writer</strong> robot opens the notebook and starts writing the translation.
                It never sees the original book — only the notes. But the notes are so well-organized
                that the Writer can reconstruct the full meaning and write a perfect translation.
                The LSTM encoder-decoder works exactly this way. The encoder is the Reader, the
                decoder is the Writer, and the (h, c) state is the notebook.
            </Analogy>

            <Analogy label="Why LSTM Has Two Types of Memory">
                A simple RNN only has one type of memory — a single number for each thing it
                remembers. If it learns something new, it partially forgets the old.
                <br /><br />
                LSTM has two: a <strong>working memory</strong> (hidden state h, used to make
                predictions right now) and a <strong>long-term memory</strong> (cell state c, preserved
                carefully across many steps). The cell state acts like a sticky note on the wall —
                you can write on it, erase parts, or keep it perfectly intact, independently of
                what you're currently thinking about. This is why LSTM can remember information
                from step 1 even at step 200.
            </Analogy>

            <Analogy label="The Reversal Trick — Reading Backwards">
                Here's a curious trick: Sutskever found that feeding the source sentence <em>backwards</em>
                (last word first) made the model much better. Why?
                <br /><br />
                Think about translating "The cat sat on the mat." Usually the first word "The"
                maps to the first word of the translation. But if you encode "The cat sat on the mat"
                forwards, by the time the encoder finishes, the memory of "The" has been overwritten
                many times. Feed it backwards as "mat the on sat cat The," and "The" is
                encoded last — its memory is still fresh when the decoder starts writing the
                translation's first word. One trick, five BLEU points.
            </Analogy>

            <Analogy label="Stacking LSTM Layers for Depth">
                Reading a sentence has multiple levels. Level 1 notices individual words.
                Level 2 notices phrases and short patterns. Level 3 notices the whole sentence
                structure. Level 4 notices the overall meaning and intent.
                <br /><br />
                Stacking 4 LSTM layers captures these levels. Each layer reads the output of
                the layer below, building a progressively more abstract understanding. Layer 1
                sees raw words. Layer 4 sees meaning. When the decoder starts, it begins with
                the deepest, most abstract representation of the source sentence.
            </Analogy>

            <Analogy label="Why Pass Both h and c to the Decoder">
                Imagine the encoder hands the decoder not one notebook but two. The first notebook
                (h, the hidden state) contains quick surface notes — what the encoder was thinking
                about at the very end of reading. The second notebook (c, the cell state) contains
                the carefully preserved deep memory — key facts that were written down and protected
                across all the reading steps.
                <br /><br />
                If the decoder only gets the first notebook, it misses all the carefully protected
                long-range memory. Sutskever's insight was to pass both — giving the decoder both
                the recent context and the accumulated long-range knowledge simultaneously.
            </Analogy>

            <Analogy label="Beam Search — Not Always Taking the First Guess">
                When the decoder generates a translation, it doesn't always pick the single most
                likely word at each step (called greedy decoding). Instead, it keeps track of
                several possible translation paths simultaneously — like a chess player thinking
                ahead: "if I say word A next, then word B becomes very likely... but if I say
                word C next, then word D becomes even more likely overall."
                <br /><br />
                Beam search keeps the top 4–10 partial translations at each step and expands
                all of them. At the end, it picks the complete translation with the highest
                overall probability. This often produces better results than always picking the
                single best word at each step, because a locally good choice can lead to a
                globally bad translation.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mechanics of LSTM-based encoder-decoder</h2>

            <h3>What Gets Passed Between Encoder and Decoder</h3>
            <p>
                A standard RNN encoder-decoder passes only the final hidden state h<sub>T</sub>
                as the context. An LSTM encoder has two states at every step: the hidden state
                h<sub>t</sub> and the cell state c<sub>t</sub>. Sutskever et al. passed <em>both</em>
                to initialize every decoder layer, preserving the full accumulated long-range memory:
            </p>
            <ul>
                <li>Decoder hidden state s<sub>0</sub><sup>(l)</sup> = h<sub>T</sub><sup>(l,enc)</sup></li>
                <li>Decoder cell state m<sub>0</sub><sup>(l)</sup> = c<sub>T</sub><sup>(l,enc)</sup></li>
            </ul>
            <p>
                Passing c<sub>T</sub> is crucial: it carries the long-range memory accumulated
                by the encoder's forget and input gates over the entire source sequence. The hidden
                state h<sub>T</sub> has been filtered through the output gate (a sigmoid squash plus
                tanh), losing some information. The cell state c<sub>T</sub> is the unfiltered
                long-range memory.
            </p>

            <h3>Multi-Layer LSTM Stacking</h3>
            <p>
                In a stacked LSTM with L layers, the hidden state of layer l at time t feeds as
                the input to layer l+1 at the same time step:
            </p>
            <MathBlock tex="h_t^{(l)},\; c_t^{(l)} = \text{LSTM}^{(l)}\!\left(h_t^{(l-1)},\; h_{t-1}^{(l)},\; c_{t-1}^{(l)}\right)" />
            <p>
                Layer 1 receives the token embedding as input. The top layer L produces the context vectors
                used to initialize the decoder. Depth allows progressive abstraction: lower layers
                capture local surface patterns, higher layers capture global meaning.
            </p>

            <h3>The Source Reversal Trick</h3>
            <p>
                Feed the source as x<sub>T</sub>, x<sub>T-1</sub>, ..., x<sub>1</sub> instead of
                x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>T</sub>. The decoder typically aligns early
                target words to early source words. Reversing minimizes the average "time lag" between
                a source word entering the encoder and the corresponding target word being generated.
                For a sentence of length T, the average lag drops from ~T/2 steps to ~1–T/2 steps
                depending on alignment structure.
            </p>

            <h3>Residual Connections for Deep Networks</h3>
            <p>
                Google's GNMT used 8 LSTM layers with residual connections — the output of layer
                l is added to the input of layer l+2. This gave gradients a direct path to lower
                layers, borrowing the technique from ResNets (Ch. 8) and enabling stable training
                at depths that would otherwise suffer from vanishing gradients through the depth
                dimension (separate from the temporal vanishing gradient that LSTM solves):
            </p>
            <MathBlock tex="\text{input}^{(l+2)}_t = h_t^{(l+1)} + \text{input}^{(l)}_t" />

            <h3>Beam Search Decoding</h3>
            <p>
                During inference, the decoder generates tokens one at a time. Greedy decoding
                (argmax at each step) is fast but suboptimal — a locally good choice can lead
                to a globally bad translation. Beam search maintains the top-k partial sequences:
            </p>
            <ul>
                <li>Expand each of the k beams by every vocabulary token: k × V candidates</li>
                <li>Keep the k candidates with the highest cumulative log-probability</li>
                <li>Continue until all beams have generated &lt;EOS&gt;</li>
                <li>Return the highest-scoring complete sequence</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Residual connections in GNMT:</strong> Google's 2016 production system added
                residual connections between LSTM layers — the output of layer l is added to the input
                of layer l+2. This allowed stable training of 8-layer LSTMs by giving gradients a
                direct path to lower layers, borrowing the technique from ResNets (Ch. 8).
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
            <h2>LSTM equations in the encoder-decoder context</h2>

            <DefBlock label="LSTM Cell — Single Layer">
                Given input x<sub>t</sub> and previous state (h<sub>t-1</sub>, c<sub>t-1</sub>):
                <br /><br />
                Forget gate: f<sub>t</sub> = σ(W<sub>f</sub>[h<sub>t-1</sub>; x<sub>t</sub>] + b<sub>f</sub>)
                <br />
                Input gate: i<sub>t</sub> = σ(W<sub>i</sub>[h<sub>t-1</sub>; x<sub>t</sub>] + b<sub>i</sub>)
                <br />
                Candidate: g<sub>t</sub> = tanh(W<sub>g</sub>[h<sub>t-1</sub>; x<sub>t</sub>] + b<sub>g</sub>)
                <br />
                Output gate: o<sub>t</sub> = σ(W<sub>o</sub>[h<sub>t-1</sub>; x<sub>t</sub>] + b<sub>o</sub>)
                <br /><br />
                Cell: c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t-1</sub> + i<sub>t</sub> ⊙ g<sub>t</sub>
                <br />
                Hidden: h<sub>t</sub> = o<sub>t</sub> ⊙ tanh(c<sub>t</sub>)
            </DefBlock>

            <h3>Multi-Layer Encoder</h3>
            <MathBlock tex="h_t^{(l)},\, c_t^{(l)} = \text{LSTM}^{(l)}\!\left(h_t^{(l-1)},\; h_{t-1}^{(l)},\; c_{t-1}^{(l)}\right)" />
            <p>
                The input to each layer l is the hidden state of layer l−1 at the same timestep.
                Layer 1 receives the token embedding. The top layer L produces the context vectors:
            </p>
            <MathBlock tex="\text{context} = \bigl(h_T^{(L)},\; c_T^{(L)}\bigr)" />

            <h3>Decoder Initialization</h3>
            <MathBlock tex="s_0^{(l)} = h_T^{(l,\text{enc})}, \quad m_0^{(l)} = c_T^{(l,\text{enc})} \quad \forall\, l \in \{1,\dots,L\}" />
            <p>
                Each decoder layer is initialized from the corresponding encoder layer's final state.
                This ensures the full depth of the encoder's representation is available to the decoder,
                including the long-range memory in the cell states.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For a single LSTM layer with hidden dimension n and input dimension d,
                there are 4(n(n+d) + n) = 4(n² + nd + n) parameters. For the 4-layer system
                in Sutskever et al. with n = 1000, d = 1000, for encoder + decoder combined:
            </p>
            <MathBlock tex="2 \times 4 \times 4 \times (1000^2 + 1000 \times 1000 + 1000) \approx 64\text{M parameters}" />

            <div className="ch-callout">
                <strong>Why passing c<sub>T</sub> matters:</strong> The hidden state h<sub>T</sub>
                has been transformed through the output gate (tanh squeeze + sigmoid mask), losing
                information. The cell state c<sub>T</sub> preserves the unfiltered long-range memory.
                Giving the decoder both h<sub>T</sub> and c<sub>T</sub> provides complementary
                information: h is the "what to attend to right now," c is "what has been accumulated
                and carefully preserved over the whole input sequence."
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn

# ── Multi-layer LSTM Encoder ──────────────────────────────────────────────────

class LSTMEncoder(nn.Module):
    def __init__(self, vocab_size, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_dim)
        self.lstm = nn.LSTM(
            input_size=emb_dim,
            hidden_size=hidden_dim,
            num_layers=n_layers,
            dropout=dropout if n_layers > 1 else 0.0,
            batch_first=False,
        )
        self.dropout = nn.Dropout(dropout)

    def forward(self, src):
        # src: [src_len, batch_size]
        emb = self.dropout(self.embedding(src))
        # emb: [src_len, batch, emb_dim]
        outputs, (h_n, c_n) = self.lstm(emb)
        # h_n: [n_layers, batch, hidden_dim]
        # c_n: [n_layers, batch, hidden_dim]

        # Optionally reverse the source: feed reversed for Sutskever trick
        # (In practice, flip src before passing: src = torch.flip(src, [0]))
        return h_n, c_n

# ── Multi-layer LSTM Decoder ──────────────────────────────────────────────────

class LSTMDecoder(nn.Module):
    def __init__(self, vocab_size, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.vocab_size = vocab_size
        self.embedding = nn.Embedding(vocab_size, emb_dim)
        self.lstm = nn.LSTM(
            input_size=emb_dim,
            hidden_size=hidden_dim,
            num_layers=n_layers,
            dropout=dropout if n_layers > 1 else 0.0,
            batch_first=False,
        )
        self.fc = nn.Linear(hidden_dim, vocab_size)
        self.dropout = nn.Dropout(dropout)

    def step(self, token, h, c):
        # token: [batch_size]  — single token
        emb = self.dropout(self.embedding(token.unsqueeze(0)))  # [1, batch, emb]
        out, (h, c) = self.lstm(emb, (h, c))                   # [1, batch, hidden]
        pred = self.fc(out.squeeze(0))                           # [batch, vocab]
        return pred, h, c

# ── Comparing normal vs. reversed encoding ────────────────────────────────────

def encode_and_compare():
    vocab, emb, hid, layers = 50, 16, 32, 2
    enc = LSTMEncoder(vocab, emb, hid, layers, dropout=0.0)
    enc.eval()

    src = torch.randint(1, vocab, (10, 1))      # sequence of 10 tokens
    src_rev = torch.flip(src, dims=[0])          # reversed version

    with torch.no_grad():
        h_fwd, c_fwd = enc(src)
        h_rev, c_rev = enc(src_rev)

    # Compare how much the final hidden states differ
    diff_h = (h_fwd - h_rev).abs().mean().item()
    diff_c = (c_fwd - c_rev).abs().mean().item()
    print(f"Normal encoding  — h_T norm: {h_fwd.norm().item():.3f}")
    print(f"Reversed encoding — h_T norm: {h_rev.norm().item():.3f}")
    print(f"Mean absolute diff in h_T: {diff_h:.4f}")
    print(f"Mean absolute diff in c_T: {diff_c:.4f}")
    print("Different context vectors — reversing changes what information is 'fresh'.")

encode_and_compare()`

function PythonContent() {
    return (
        <>
            <p>
                Multi-layer LSTM encoder and decoder, showing how the encoder's final
                (h<sub>n</sub>, c<sub>n</sub>) state initializes the decoder. Also demonstrates
                the reversal trick by encoding the same sequence forwards and backwards and
                comparing the resulting context vectors.
            </p>
            <CodeBlock code={PY_CODE} filename="lstm_encoder_decoder.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LSTM_ENCODER_DECODER_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
