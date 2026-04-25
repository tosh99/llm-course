import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Why LSTM — and why reversing the source worked</h2>
            <p>
                The choice of LSTM as the encoder-decoder cell was deliberate. A simple RNN cannot
                reliably compress a long sentence into a fixed vector — the vanishing gradient problem
                means information from early tokens is lost by the time the encoder finishes reading.
                LSTM's cell state provides a highway for information to persist across hundreds of steps,
                making it the natural choice.
            </p>
            <p>
                The most surprising contribution of Sutskever et al. (2014) was not the LSTM encoder-decoder
                itself — it was reversing the source sequence. Feeding the source sentence backwards
                (last word first) into the encoder improved BLEU by more than 5 points on WMT14
                English→French. The reason is subtle and worth understanding precisely.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1997</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">LSTM invented — Hochreiter & Schmidhuber</div>
                    <div className="ch-tl-body">
                        The Long Short-Term Memory architecture was designed explicitly to solve the
                        vanishing gradient problem in RNNs. Its cell state — a linear pathway with
                        multiplicative gating — enables information to persist across hundreds of steps.
                        For 17 years it remained an academic curiosity; its full potential emerged only
                        when applied at scale.
                    </div>
                    <div className="ch-tl-impact">Impact: Created the memory mechanism that made long-range sequence modeling possible</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">Sutskever et al. — Deep LSTM encoder-decoder</div>
                    <div className="ch-tl-body">
                        The paper used a 4-layer LSTM encoder and 4-layer LSTM decoder. The key technical
                        contributions were: (1) using both h<sub>T</sub> and c<sub>T</sub> (not just the
                        hidden state) as the initial decoder state; (2) reversing the source sequence;
                        (3) stacking 4 LSTM layers for both encoder and decoder. On WMT14 En→Fr, a
                        5-model ensemble achieved 34.8 BLEU — a result previously thought impossible
                        for a pure neural approach.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved deep LSTMs alone, with no linguistic features, could achieve SMT-level MT</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Industry deployment</div>
                    <div className="ch-tl-title">Google NMT — LSTM enc-dec at production scale</div>
                    <div className="ch-tl-body">
                        Google's production NMT system used an 8-layer LSTM encoder and 8-layer LSTM
                        decoder with attention and residual connections between layers. It processed
                        100 million translation pairs. The system reduced translation errors by 60% on
                        some language pairs compared to phrase-based SMT. This marked the industry-wide
                        transition to neural MT.
                    </div>
                    <div className="ch-tl-impact">Impact: End of phrase-based SMT in production systems at scale</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why reversal helps:</strong> In English→French translation, the first English
                word often aligns to the first French word. In a forward encoder, the first English
                word is processed earliest and its information must survive the full encoding of
                the sentence. In a reversed encoder, the first English word is processed <em>last</em>,
                leaving its information fresh in the hidden state when the decoder starts. This
                reduces the "minimum time lag" between corresponding source and target words.
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
                <br /><br />
                The LSTM encoder-decoder works exactly this way. The encoder is the Reader, the
                decoder is the Writer, and the (h, c) state is the notebook.
            </Analogy>

            <Analogy label="Why LSTM Has Two Types of Memory">
                A simple RNN only has one type of memory — a single number for each thing it
                remembers. If it learns something new, it partially forgets the old.
                <br /><br />
                LSTM has two: a <strong>working memory</strong> (hidden state h, used to make
                predictions) and a <strong>long-term memory</strong> (cell state c, preserved across
                many steps). The cell state acts like a sticky note on the wall — you can write on it,
                erase parts, or keep it perfectly intact, independently of what you're currently
                thinking about. This is why LSTM can remember information from step 1 even at step 200.
            </Analogy>

            <Analogy label="The Reversal Trick — Reading Backwards">
                Here's a curious trick: Sutskever found that feeding the source sentence <em>backwards</em>
                (last word first) made the model much better.
                <br /><br />
                Why? Think about translating "The cat sat on the mat." Usually the first word "The"
                maps to the first word of the translation. But if you encode "The cat sat on the mat"
                forwards, by the time the encoder finishes, the memory of "The" has been overwritten
                many times. If you encode it backwards as "mat the on sat cat The", then "The" is
                encoded last — and its memory is still fresh when the decoder starts writing the
                translation's first word.
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
                to initialize the decoder:
            </p>
            <ul>
                <li>Decoder hidden state s<sub>0</sub> = h<sub>T</sub><sup>enc</sup></li>
                <li>Decoder cell state m<sub>0</sub> = c<sub>T</sub><sup>enc</sup></li>
            </ul>
            <p>
                Passing the cell state is important: it carries the long-range memory accumulated
                by the encoder's forget and input gates over the entire source sequence.
            </p>

            <h3>Multi-Layer LSTM Stacking</h3>
            <p>
                The original paper used 4 LSTM layers. In a stacked LSTM, the hidden state of
                layer l at time t feeds as the input to layer l+1 at the same time step:
            </p>
            <ul>
                <li>Layer 1 receives the token embedding as input</li>
                <li>Layer 2 receives the output (hidden state) of Layer 1</li>
                <li>Layer 3 receives the output of Layer 2, and so on</li>
                <li>The top layer's final state is used as context</li>
            </ul>
            <p>
                Depth allows the network to build progressively more abstract representations —
                lower layers capture local patterns, higher layers capture global meaning.
            </p>

            <h3>The Source Reversal Trick</h3>
            <p>
                Feed the source as x<sub>T</sub>, x<sub>T-1</sub>, ..., x<sub>1</sub> instead of
                x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>T</sub>. The decoder starts from x<sub>1</sub>'s
                (now freshly encoded) representation and typically aligns early source words to early
                target words. Reversing minimizes the average "time lag" between a source word entering
                the encoder and the corresponding target word being generated by the decoder.
            </p>

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
                Forget gate: f<sub>t</sub> = σ(W<sub>f</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>f</sub>)
                <br />
                Input gate: i<sub>t</sub> = σ(W<sub>i</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>i</sub>)
                <br />
                Candidate: g<sub>t</sub> = tanh(W<sub>g</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>g</sub>)
                <br />
                Output gate: o<sub>t</sub> = σ(W<sub>o</sub>[h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>o</sub>)
                <br /><br />
                Cell: c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t-1</sub> + i<sub>t</sub> ⊙ g<sub>t</sub>
                <br />
                Hidden: h<sub>t</sub> = o<sub>t</sub> ⊙ tanh(c<sub>t</sub>)
            </DefBlock>

            <h3>Multi-Layer Encoder</h3>
            <MathBlock tex="h_t^{(l)},\, c_t^{(l)} = \text{LSTM}^{(l)}\!\left(h_t^{(l-1)},\; h_{t-1}^{(l)},\; c_{t-1}^{(l)}\right)" />
            <p>
                The input to each layer l is the hidden state of layer l−1 at the same timestep.
                Layer 1 receives the token embedding. The top layer (L) produces the context:
            </p>
            <MathBlock tex="\text{context} = \bigl(h_T^{(L)},\; c_T^{(L)}\bigr)" />

            <h3>Decoder Initialization</h3>
            <MathBlock tex="s_0^{(l)} = h_T^{(l,\text{enc})}, \quad m_0^{(l)} = c_T^{(l,\text{enc})} \quad \forall\, l \in \{1,\dots,L\}" />
            <p>
                Each decoder layer is initialized from the corresponding encoder layer's final state.
                This ensures the full depth of the encoder's representation is available to the decoder.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For a single LSTM layer with hidden dimension n and input dimension d,
                there are 4(n² + nd + n) parameters (four weight matrices of size n×(n+d) plus four bias vectors).
                For the 4-layer system in Sutskever et al. with n = 1000, d = 1000:
            </p>
            <MathBlock tex="4 \times 4 \times (1000^2 + 1000 \times 1000 + 1000) = 4 \times 4 \times 2{,}001{,}000 \approx 32\text{M parameters per model}" />

            <div className="ch-callout">
                <strong>Why passing c<sub>T</sub> matters:</strong> The hidden state h<sub>T</sub>
                has been transformed through the output gate (tanh squeeze + sigmoid mask), losing
                information. The cell state c<sub>T</sub> preserves the unfiltered long-range memory.
                Giving the decoder both h<sub>T</sub> and c<sub>T</sub> provides complementary
                information: h is the "what to attend to now," c is "what has been accumulated over
                the whole input."
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
    maths:      null,
    python:     null,
}
