import { Analogy, CodeBlock, DefBlock, MathBlock, InlineMath } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The architecture that taught machines to translate</h2>
            <p>
                Sequence-to-sequence learning emerged from two concurrent research threads in 2014 — one
                at Google Brain, one at Yoshua Bengio's lab in Montreal — and immediately reshaped how
                the field thought about language, speech, and structured prediction. The unifying insight
                was simple but powerful: you can compress any variable-length sequence into a fixed-size
                vector, then expand that vector into a different variable-length sequence.
            </p>

            <div className="ch11-timeline">
                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">June 2014</div>
                    <div className="ch11-tl-section-label">First paper</div>
                    <div className="ch11-tl-title">Cho et al. — RNN Encoder-Decoder (GRU-based)</div>
                    <div className="ch11-tl-body">
                        Kyunghyun Cho, Bart van Merriënboer, and colleagues at the University of Montreal
                        published "Learning Phrase Representations using RNN Encoder-Decoder for Statistical
                        Machine Translation." The paper introduced both the encoder-decoder architecture
                        and the GRU cell in the same contribution. The architecture was designed to learn
                        phrase representations for phrase-based SMT — not as a standalone MT system.
                    </div>
                    <div className="ch11-tl-impact">Impact: Coined "encoder-decoder"; introduced GRU as a side contribution</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">September 2014</div>
                    <div className="ch11-tl-section-label">Landmark result</div>
                    <div className="ch11-tl-title">Sutskever, Vinyals & Le — Seq2Seq with deep LSTM</div>
                    <div className="ch11-tl-body">
                        Three months later, Ilya Sutskever, Oriol Vinyals, and Quoc V. Le at Google Brain
                        published "Sequence to Sequence Learning with Neural Networks." This paper used a
                        4-layer deep LSTM as a standalone MT system, reversing the source sequence as an
                        additional trick. On WMT14 English→French, it achieved 34.8 BLEU — competitive
                        with phrase-based SMT systems that had years of engineering behind them. The result
                        stunned the field.
                    </div>
                    <div className="ch11-tl-impact">Impact: First pure neural MT competitive with phrase-based SMT on large-scale data</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">2015</div>
                    <div className="ch11-tl-section-label">The bottleneck solved</div>
                    <div className="ch11-tl-title">Bahdanau, Cho & Bengio — Attention mechanism</div>
                    <div className="ch11-tl-body">
                        The context vector bottleneck — compressing all source information into a single
                        fixed-size vector — was identified as the main limitation of seq2seq. Bahdanau
                        et al. replaced the fixed context vector with a dynamic one computed at each
                        decoding step (attention). This dramatically improved performance on long sentences
                        and became the seed for the Transformer (Ch. 14).
                    </div>
                    <div className="ch11-tl-impact">Impact: Seq2seq + attention became the dominant MT paradigm 2015–2017</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">2016</div>
                    <div className="ch11-tl-section-label">Production deployment</div>
                    <div className="ch11-tl-title">Google Neural Machine Translation (GNMT)</div>
                    <div className="ch11-tl-body">
                        Google deployed GNMT — a large multi-layer LSTM encoder-decoder with attention and
                        a hybrid word/character vocabulary — replacing their decade-old phrase-based system.
                        For some language pairs, GNMT reduced translation errors by more than 60% compared
                        to the phrase-based baseline. Phrase-based SMT effectively ceased to be a research
                        priority overnight.
                    </div>
                    <div className="ch11-tl-impact">Impact: Marked the practical end of phrase-based SMT at industrial scale</div>
                </div>
            </div>

            <div className="ch11-callout">
                <strong>The context vector bottleneck</strong> — the core limitation of vanilla seq2seq —
                is what motivates attention (Ch. 12) and ultimately the Transformer (Ch. 14). Understanding
                seq2seq as a constrained architecture helps explain why attention was such a decisive
                improvement: instead of forcing the decoder to recover everything from one vector, it
                can directly attend to any encoder state.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The listening-then-speaking machine</h2>

            <Analogy label="The Conference Interpreter">
                Imagine a conference interpreter who translates speeches. A bad interpreter tries to
                translate every word as it's spoken — they get confused when the sentence structure
                differs between languages (which it always does). A good interpreter <em>listens to
                the whole sentence</em>, builds a mental understanding, then speaks the translation.
                <br /><br />
                The seq2seq model is the good interpreter. The <strong>encoder</strong> listens to
                the whole input sentence. The <strong>decoder</strong> uses the understanding to
                produce the output. The two phases — encode first, decode second — are what makes
                variable-length-to-variable-length translation possible.
            </Analogy>

            <Analogy label="The Compressed Notes">
                When you study for an exam, you don't memorise your textbook word for word.
                You write a page of compressed notes that captures the key ideas. The notes are
                much shorter than the textbook, but contain enough information to write a full essay.
                <br /><br />
                The context vector is those compressed notes. The encoder reads the input
                sequence and writes compressed notes (a vector of floating-point numbers). The
                decoder reads only those notes — not the original input — and produces the output.
                The question seq2seq asks: <em>can a neural network learn to take useful notes?</em> Yes.
            </Analogy>

            <Analogy label="The Bottleneck Problem">
                Here's the catch: the notes have a fixed size. Whether the input is 3 words
                or 300 words, the context vector always has, say, 512 numbers. For short sentences,
                that's plenty. For very long paragraphs, you start to lose information.
                <br /><br />
                That's the bottleneck problem. It's the reason attention (Ch. 12) was invented:
                instead of squeezing everything into one fixed notecard, attention lets the decoder
                go back and read specific parts of the original text whenever it needs them.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Two-phase architecture: encoding and decoding</h2>

            <h3>Phase 1 — The Encoder</h3>
            <p>
                The encoder is a recurrent network (usually LSTM or GRU) that reads the input
                sequence x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>T</sub> one token at a time.
                At each step it updates a hidden state:
            </p>
            <ul>
                <li>h<sub>0</sub> = zeros (initial hidden state)</li>
                <li>h<sub>t</sub> = f(h<sub>t-1</sub>, x<sub>t</sub>) for t = 1 ... T</li>
                <li>After reading all tokens, the final hidden state h<sub>T</sub> is the <strong>context vector c</strong></li>
            </ul>
            <p>
                The context vector is meant to encode the full meaning of the input sequence.
                Everything the decoder will produce must come from this vector.
            </p>

            <h3>Phase 2 — The Decoder</h3>
            <p>
                The decoder is also a recurrent network, initialized with the context vector.
                It generates one output token per step, and its own output feeds back as input:
            </p>
            <ul>
                <li>s<sub>0</sub> = c (decoder hidden state starts as context vector)</li>
                <li>Input at step 1: special &lt;SOS&gt; (start-of-sequence) token</li>
                <li>At each step t: s<sub>t</sub> = g(s<sub>t-1</sub>, y<sub>t-1</sub>), then ŷ<sub>t</sub> = softmax(W·s<sub>t</sub>)</li>
                <li>Decoding stops when the model predicts &lt;EOS&gt; (end-of-sequence)</li>
            </ul>

            <h3>Why Variable-Length I/O Works</h3>
            <p>
                The encoder always produces the same-size context vector, regardless of input length.
                The decoder always starts fresh from that vector and runs until it outputs &lt;EOS&gt;,
                regardless of how long the output is. This makes T ≠ T' natural — a sentence of
                10 French words can become 8 English words, and the model handles it without any
                special engineering.
            </p>

            <h3>Special Tokens</h3>
            <ul>
                <li><code>&lt;SOS&gt;</code> — fed as the first decoder input to "start" generation</li>
                <li><code>&lt;EOS&gt;</code> — when the decoder predicts this token, generation stops</li>
                <li><code>&lt;PAD&gt;</code> — used to fill batches to uniform length during training</li>
                <li><code>&lt;UNK&gt;</code> — replaces words not in the vocabulary</li>
            </ul>

            <div className="ch11-callout">
                <strong>Autoregressive decoding:</strong> the decoder's output at step t (ŷ<sub>t</sub>)
                feeds back as its input at step t+1. This creates a dependency chain — each word
                depends on all previously generated words. During training this is managed with
                teacher forcing (see the Teacher Forcing topic). During inference the model is
                fully autoregressive.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal definition of sequence-to-sequence learning</h2>

            <DefBlock label="Seq2Seq Probabilistic Model">
                Given a source sequence x = (x<sub>1</sub>, ..., x<sub>T</sub>) and target
                sequence y = (y<sub>1</sub>, ..., y<sub>T'</sub>), the model estimates the
                conditional probability by factoring it auto-regressively:
                P(y | x) = ∏<sub>t=1</sub><sup>T'</sup> P(y<sub>t</sub> | y<sub>1</sub>, ..., y<sub>t-1</sub>, c)
                where c is the context vector produced by the encoder.
            </DefBlock>

            <h3>Encoder</h3>
            <MathBlock tex="h_t = f(h_{t-1},\, x_t), \quad c = h_T" />
            <p>
                The function f is an RNN cell (LSTM or GRU). The context vector c is the final
                hidden state. For an LSTM, c = (h<sub>T</sub>, cell<sub>T</sub>) — both the
                hidden state and the cell state are passed to the decoder.
            </p>

            <h3>Decoder</h3>
            <MathBlock tex="s_t = g(s_{t-1},\, y_{t-1},\, c), \quad P(y_t \mid y_{<t},\, c) = \operatorname{softmax}(W_s\, s_t + b_s)" />
            <p>
                The decoder recurrence g takes the previous hidden state, the previous output token,
                and the context vector. In the original formulation, c is concatenated to the decoder
                input at every step, not just used as initialization.
            </p>

            <h3>Training Objective</h3>
            <MathBlock tex="\mathcal{L} = -\sum_{t=1}^{T'} \log P(y_t \mid y_1,\dots,y_{t-1},\, c)" />
            <p>
                This is the standard cross-entropy loss, summed over all target tokens in the sequence.
                During training, <InlineMath tex="y_{t-1}" /> is the true target token (teacher forcing),
                not the model's prediction.
            </p>

            <h3>The Information Bottleneck</h3>
            <p>
                The mutual information between the source x and the context vector c is bounded
                by the dimensionality of c. Formally, the encoder must solve a lossy compression
                problem: map T tokens to a fixed-size vector that preserves enough information for
                the decoder to reconstruct T' tokens. For long sequences, this compression is lossy —
                which is why attention (Ch. 12) replaces the fixed context vector with a dynamic
                weighted combination of all encoder states.
            </p>

            <div className="ch11-callout">
                <strong>Connection to variational autoencoders:</strong> The encoder-decoder structure
                directly inspired VAEs (Kingma & Welling, 2013), where a probabilistic encoder maps
                inputs to a latent distribution rather than a deterministic vector. The seq2seq
                context vector is a deterministic latent code — the VAE generalization makes it
                stochastic.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import random

# ── Encoder ───────────────────────────────────────────────────────────────────

class Encoder(nn.Module):
    def __init__(self, input_dim, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(input_dim, emb_dim)
        self.rnn = nn.LSTM(emb_dim, hidden_dim, n_layers, dropout=dropout)
        self.dropout = nn.Dropout(dropout)

    def forward(self, src):
        # src: [src_len, batch_size]
        embedded = self.dropout(self.embedding(src))
        # embedded: [src_len, batch_size, emb_dim]
        outputs, (hidden, cell) = self.rnn(embedded)
        # hidden, cell: [n_layers, batch_size, hidden_dim]
        return hidden, cell  # context = final (hidden, cell)

# ── Decoder ───────────────────────────────────────────────────────────────────

class Decoder(nn.Module):
    def __init__(self, output_dim, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.output_dim = output_dim
        self.embedding = nn.Embedding(output_dim, emb_dim)
        self.rnn = nn.LSTM(emb_dim, hidden_dim, n_layers, dropout=dropout)
        self.fc_out = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, token, hidden, cell):
        # token: [batch_size]  — one token at a time
        token = token.unsqueeze(0)           # [1, batch_size]
        embedded = self.dropout(self.embedding(token))
        output, (hidden, cell) = self.rnn(embedded, (hidden, cell))
        pred = self.fc_out(output.squeeze(0))  # [batch_size, output_dim]
        return pred, hidden, cell

# ── Seq2Seq ───────────────────────────────────────────────────────────────────

class Seq2Seq(nn.Module):
    def __init__(self, encoder, decoder, sos_idx, device):
        super().__init__()
        self.encoder = encoder
        self.decoder = decoder
        self.sos_idx = sos_idx
        self.device  = device

    def forward(self, src, trg, teacher_forcing_ratio=0.5):
        # src: [src_len, batch]  trg: [trg_len, batch]
        trg_len, batch_size = trg.shape
        trg_vocab = self.decoder.output_dim

        outputs = torch.zeros(trg_len, batch_size, trg_vocab, device=self.device)
        hidden, cell = self.encoder(src)

        dec_input = trg[0]   # <SOS> token for every item in batch

        for t in range(1, trg_len):
            out, hidden, cell = self.decoder(dec_input, hidden, cell)
            outputs[t] = out
            use_teacher = random.random() < teacher_forcing_ratio
            dec_input = trg[t] if use_teacher else out.argmax(dim=1)

        return outputs

# ── Quick smoke test ──────────────────────────────────────────────────────────

SRC_VOCAB, TRG_VOCAB = 200, 150
EMB, HID, LAYERS = 64, 128, 2
SOS_IDX = 0

enc = Encoder(SRC_VOCAB, EMB, HID, LAYERS)
dec = Decoder(TRG_VOCAB, EMB, HID, LAYERS)
model = Seq2Seq(enc, dec, SOS_IDX, device=torch.device('cpu'))

src = torch.randint(1, SRC_VOCAB, (12, 8))  # [src_len=12, batch=8]
trg = torch.randint(0, TRG_VOCAB, (10, 8))  # [trg_len=10, batch=8]
trg[0] = SOS_IDX                            # first token is always <SOS>

out = model(src, trg, teacher_forcing_ratio=0.5)
print(f"src  shape: {src.shape}")       # [12, 8]
print(f"trg  shape: {trg.shape}")       # [10, 8]
print(f"out  shape: {out.shape}")       # [10, 8, 150]
print(f"params:     {sum(p.numel() for p in model.parameters()):,}")`

function PythonTab() {
    return (
        <>
            <p>
                A complete PyTorch implementation of the seq2seq architecture: separate
                <code>Encoder</code> and <code>Decoder</code> LSTM modules, a <code>Seq2Seq</code>
                wrapper that manages the forward pass with optional teacher forcing, and a
                smoke test verifying shapes.
            </p>
            <CodeBlock code={PY_CODE} filename="seq2seq.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Minimal Seq2Seq Forward Pass (TypeScript) ───────────────────────────────
// Demonstrates the encode → context vector → decode pipeline.

type Vec = number[]

// Simplified GRU step (random weights baked in for demo)
function gruStep(h: Vec, x: Vec): Vec {
  const n = h.length
  const z = h.map((hi, i) => 1 / (1 + Math.exp(-(0.3 * hi + 0.4 * (x[i % x.length] ?? 0)))))
  const r = h.map((hi, i) => 1 / (1 + Math.exp(-(0.4 * hi + 0.2 * (x[i % x.length] ?? 0)))))
  const hc = h.map((hi, i) => Math.tanh(r[i] * hi * 0.5 + 0.6 * (x[i % x.length] ?? 0)))
  return h.map((hi, i) => (1 - z[i]) * hi + z[i] * hc[i])
}

function softmax(v: Vec): Vec {
  const max = Math.max(...v)
  const exp = v.map(x => Math.exp(x - max))
  const sum = exp.reduce((a, b) => a + b, 0)
  return exp.map(x => x / sum)
}

function embed(token: number, dim: number): Vec {
  const v = new Array(dim).fill(0)
  v[token % dim] = 1.0
  return v
}

// ── Encoder ──────────────────────────────────────────────────────────────────
function encode(tokens: number[], hiddenDim: number): Vec {
  let h: Vec = new Array(hiddenDim).fill(0)
  for (const tok of tokens) {
    h = gruStep(h, embed(tok, hiddenDim))
  }
  return h  // context vector
}

// ── Decoder ──────────────────────────────────────────────────────────────────
function decode(context: Vec, vocabSize: number, maxLen = 8): number[] {
  const SOS = 0, EOS = 1
  let h = context
  let prev = SOS
  const output: number[] = []

  for (let t = 0; t < maxLen; t++) {
    h = gruStep(h, embed(prev, h.length))
    const logits = h.map((hi, i) => hi * (1 + 0.2 * i))
    const probs = softmax(logits.slice(0, vocabSize))
    prev = probs.indexOf(Math.max(...probs))
    output.push(prev)
    if (prev === EOS) break
  }
  return output
}

// ── Demo ─────────────────────────────────────────────────────────────────────
const HIDDEN_DIM = 8
const VOCAB_SIZE = 12

const source = [3, 7, 2, 9, 5]  // simulated source sentence
console.log("Source tokens:  ", source)

const ctx = encode(source, HIDDEN_DIM)
console.log("Context vector: ", ctx.map(v => v.toFixed(3)))

const output = decode(ctx, VOCAB_SIZE)
console.log("Decoded tokens: ", output)

console.log()
console.log("Observations:")
console.log("  The context vector has fixed size", HIDDEN_DIM, "regardless of source length.")
console.log("  Source had", source.length, "tokens; output has", output.length, "tokens.")
console.log("  Different lengths — that is the key property of seq2seq.")`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript simulation of the encode → context vector → autoregressive decode pipeline.
                Uses simplified GRU cells with baked-in weights to show the data flow without
                the full matrix algebra.
            </p>
            <CodeBlock code={TS_CODE} filename="seq2seq.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch11-callout">
                <strong>The key property:</strong> the context vector has a fixed dimensionality
                regardless of source length. <code>encode([3,7,2,9,5])</code> and
                <code>encode([1,2,3,4,5,6,7,8,9,10,11,12])</code> both produce an 8-dimensional
                vector. This is the power — and the bottleneck — of plain seq2seq.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const SEQ2SEQ_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
