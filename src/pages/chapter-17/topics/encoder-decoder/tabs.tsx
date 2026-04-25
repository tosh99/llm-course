import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The stack that launched the modern era</h2>
            <p>
                The Transformer is not a single innovation but an architectural stack: an
                encoder that reads and understands, a decoder that generates, and a set of
                training tricks — residual connections, layer normalization, and dropout —
                that make it trainable at depth. Every major language model since 2018 is a
                descendant of this stack.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986 – 2014</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Encoder-Decoder RNNs for Sequence Transduction</div>
                    <div className="ch-tl-body">
                        Sequence-to-sequence models used an RNN encoder to compress a source
                        sentence into a fixed-size context vector, and an RNN decoder to generate
                        the target sentence. Attention (Bahdanau 2014) improved this by letting
                        the decoder peek at all encoder states, but the encoder and decoder were
                        still recurrent. Training was slow, and long sentences still struggled.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the encoder-decoder paradigm for translation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — The Transformer Architecture</div>
                    <div className="ch-tl-body">
                        The paper "Attention Is All You Need" introduced an encoder-decoder
                        architecture where both sides are stacks of identical layers. Each
                        encoder layer has two sub-layers: multi-head self-attention and a
                        position-wise feed-forward network. Each decoder layer has three:
                        masked self-attention, encoder-decoder cross-attention, and a feed-forward
                        network. Residual connections and layer normalization surround every
                        sub-layer. No recurrence, no convolution — just attention.
                    </div>
                    <div className="ch-tl-impact">Impact: The foundational architecture of GPT, BERT, T5, and every modern LLM</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Fork</div>
                    <div className="ch-tl-title">GPT (Decoder-Only) and BERT (Encoder-Only)</div>
                    <div className="ch-tl-body">
                        Researchers quickly realized the encoder and decoder could be used
                        independently. OpenAI's GPT used only the decoder stack for left-to-right
                        language modeling. Google's BERT used only the encoder stack with
                        bidirectional masking. T5 kept the full encoder-decoder design for
                        text-to-text transfer. These three branches — decoder-only, encoder-only,
                        and encoder-decoder — remain the dominant paradigms today.
                    </div>
                    <div className="ch-tl-impact">Impact: Specialization proved each half of the Transformer is independently powerful</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 – 2024</div>
                    <div className="ch-tl-section-label">Scale</div>
                    <div className="ch-tl-title">GPT-3, PaLM, LLaMA, and the Rise of Decoders</div>
                    <div className="ch-tl-body">
                        At scale, decoder-only models became the dominant architecture for
                        generative LLMs. Stacking 12 to 96 decoder layers with billions of
                        parameters produced remarkable emergent abilities. The original
                        encoder-decoder design survives in T5, BART, and translation systems,
                        but the open-source explosion (LLaMA, Mistral, Falcon) solidified the
                        decoder-only stack as the default for general-purpose language models.
                    </div>
                    <div className="ch-tl-impact">Impact: Decoder-only Transformers are now synonymous with "LLM"</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> By unifying the encoder and decoder around
                the same primitive — multi-head attention — the Transformer created a modular,
                scalable architecture. You can remove the encoder to get GPT, remove the decoder
                to get BERT, or keep both to get T5. Every variant trains in parallel across
                the sequence dimension, unlocking the compute efficiency that made large-scale
                pre-training feasible.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A reading team and a writing team</h2>

            <Analogy label="The Reading Team (Encoder)">
                Imagine a team of six readers sitting in a room with a book. Each reader reads
                the entire book, but they focus on different things. Reader 1 looks for characters,
                Reader 2 looks for places, Reader 3 looks for feelings, and so on. After reading,
                they all share notes. Then they read the book again using the shared notes to
                understand it even better. After six rounds of reading and sharing, they have
                a deep, layered understanding of the book.
            </Analogy>

            <Analogy label="The Writing Team (Decoder)">
                Now imagine a separate team of six writers in another room. Their job is to
                write a summary of the book, one sentence at a time. Each writer can look at
                everything the reading team produced. But the writers have a strict rule: when
                writing sentence 5, they are only allowed to look at sentences 1 through 4.
                They cannot peek at sentence 6. This forces them to write one step at a time,
                just like you speak one word at a time without knowing the future.
            </Analogy>

            <Analogy label="The Messengers (Cross-Attention)">
                Between the two rooms are messengers. The writers can send questions to the
                readers: "What was the name of the villain?" "Where did the treasure hide?"
                The readers answer based on their deep understanding. This back-and-forth is
                called <em>cross-attention</em>. Without it, the writers would have to guess
                everything from memory. With it, they can look up facts in real time.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Encoder stack, decoder stack, and the masked autoregressive trick</h2>

            <h3>Encoder Stack</h3>
            <p>
                The encoder consists of N identical layers (N = 6 in the original paper). Each
                layer has two sub-layers:
            </p>
            <ol>
                <li><strong>Multi-head self-attention:</strong> Every position attends to every
                other position in the same sentence. This is bidirectional — the encoder can
                see the full context.</li>
                <li><strong>Position-wise feed-forward network:</strong> A fully connected layer
                applied independently to each position. It processes the attended representation
                into a richer feature space.</li>
            </ol>
            <p>
                Each sub-layer is surrounded by a residual connection followed by layer
                normalization: <code>LayerNorm(x + Sublayer(x))</code>.
            </p>

            <h3>Decoder Stack</h3>
            <p>
                The decoder also has N identical layers, but each layer has three sub-layers:
            </p>
            <ol>
                <li><strong>Masked multi-head self-attention:</strong> Like encoder self-attention,
                but positions are only allowed to attend to earlier positions (and themselves).
                This is enforced by setting future positions to −∞ before the softmax, producing
                a causal (lower-triangular) attention pattern.</li>
                <li><strong>Encoder-decoder cross-attention:</strong> The decoder's Queries attend
                to the encoder's Keys and Values. This lets the decoder "look up" information
                from the source sentence.</li>
                <li><strong>Position-wise feed-forward network:</strong> Same as the encoder.</li>
            </ol>

            <h3>Why Masking?</h3>
            <p>
                During training, the decoder is fed the entire target sequence, but it must not
                cheat by looking at future tokens. The causal mask ensures that predicting token
                t uses only tokens 1..t−1. At inference, the model generates one token at a time
                and appends it to the input, so the mask is never violated.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Residual connections are critical:</strong> Without them, a 6-layer
                Transformer would be nearly impossible to train. The residual path creates a
                direct gradient highway from output back to input. Layer normalization stabilizes
                the distribution of activations across layers. Together, they allow training
                stacks 100+ layers deep.
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
            <h2>Full stack equations and parameter accounting</h2>

            <DefBlock label="Transformer Layer — Formal Specification">
                Input: X ∈ ℝ<sup>n×d</sup>. For encoder layers, the self-attention is unmasked.
                For decoder layers, self-attention uses a causal mask M<sub>ij</sub> = −∞ if j &gt; i,
                else 0. Cross-attention uses encoder output E ∈ ℝ<sup>m×d</sup> as Keys and Values.
                FFN(x) = max(0, xW<sub>1</sub> + b<sub>1</sub>)W<sub>2</sub> + b<sub>2</sub>.
                LayerNorm is applied per feature across the batch/sequence dimensions.
            </DefBlock>

            <h3>Encoder Layer</h3>
            <MathBlock tex="\mathbf{A} = \text{LayerNorm}\bigl(\mathbf{X} + \text{MultiHead}(\mathbf{X}, \mathbf{X}, \mathbf{X})\bigr)" />
            <MathBlock tex="\mathbf{O} = \text{LayerNorm}\bigl(\mathbf{A} + \text{FFN}(\mathbf{A})\bigr)" />

            <h3>Decoder Layer</h3>
            <MathBlock tex="\mathbf{B} = \text{LayerNorm}\bigl(\mathbf{X} + \text{MaskedMultiHead}(\mathbf{X}, \mathbf{X}, \mathbf{X})\bigr)" />
            <MathBlock tex="\mathbf{C} = \text{LayerNorm}\bigl(\mathbf{B} + \text{MultiHead}(\mathbf{B}, \mathbf{E}, \mathbf{E})\bigr)" />
            <MathBlock tex="\mathbf{O} = \text{LayerNorm}\bigl(\mathbf{C} + \text{FFN}(\mathbf{C})\bigr)" />

            <h3>Feed-Forward Network</h3>
            <p>
                The FFN is applied identically to every position. It expands the dimension from
                d to d<sub>ff</sub> = 2048 (in the original paper) and then projects back:
            </p>
            <MathBlock tex="\text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2" />
            <p>
                The inner dimension d<sub>ff</sub> is typically 4× d. For d = 512, this is
                2,048. The ReLU nonlinearity introduces expressivity without recurrence.
            </p>

            <h3>Layer Normalization</h3>
            <MathBlock tex="\text{LayerNorm}(x) = \gamma \odot \frac{x - \mu}{\sqrt{\sigma^2 + \varepsilon}} + \beta" />
            <p>
                μ and σ are computed per feature across the layer input. γ and β are learned
                per-feature scale and shift parameters. LayerNorm stabilizes training by
                keeping the mean and variance of activations controlled at every layer.
            </p>

            <h3>Total Parameter Count (Original Transformer Base)</h3>
            <ul>
                <li>d<sub>model</sub> = 512, d<sub>ff</sub> = 2048, h = 8 heads, N = 6 layers</li>
                <li>Embeddings + softmax: 2 × 512 × vocab_size (shared weights in original)</li>
                <li>Each encoder layer: 4d<sup>2</sup> (MHA) + 2d·d<sub>ff</sub> (FFN) + 2d (LayerNorm)</li>
                <li>Each decoder layer: 4d<sup>2</sup> (self) + 4d<sup>2</sup> (cross) + 2d·d<sub>ff</sub> + 2d</li>
                <li>Total ≈ 65M parameters (Base) or 213M (Big: d=1024, d<sub>ff</sub>=4096, N=6)</li>
            </ul>

            <div className="ch-callout">
                <strong>Pre-Norm vs. Post-Norm:</strong> The original Transformer used Post-Norm
                (residual then normalize). Modern implementations often use Pre-Norm
                (normalize then residual), which trains more stably at depth: <code>X + Sublayer(LayerNorm(X))</code>.
                GPT-3, LLaMA, and most open models use Pre-Norm.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Simplified Transformer Encoder Layer — NumPy ──────────────────────────────

def softmax(x, axis=-1):
    e = np.exp(x - np.max(x, axis=axis, keepdims=True))
    return e / np.sum(e, axis=axis, keepdims=True)

def layer_norm(x, eps=1e-6):
    mean = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mean) / np.sqrt(var + eps)

def relu(x):
    return np.maximum(0, x)

class TransformerEncoderLayer:
    def __init__(self, d_model, num_heads, d_ff, seed=42):
        assert d_model % num_heads == 0
        rng = np.random.default_rng(seed)
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        # Multi-head projections (simplified: single W_qkv + W_o)
        self.W_qkv = rng.normal(0, 0.01, (3, d_model, d_model))
        self.W_o = rng.normal(0, 0.01, (d_model, d_model))

        # FFN
        self.W1 = rng.normal(0, 0.01, (d_model, d_ff))
        self.b1 = np.zeros(d_ff)
        self.W2 = rng.normal(0, 0.01, (d_ff, d_model))
        self.b2 = np.zeros(d_model)

    def _mha(self, X):
        n = X.shape[0]
        Q = X @ self.W_qkv[0]
        K = X @ self.W_qkv[1]
        V = X @ self.W_qkv[2]

        # Reshape to (num_heads, n, d_k)
        Q = Q.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)
        K = K.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)
        V = V.reshape(n, self.num_heads, self.d_k).transpose(1, 0, 2)

        heads = []
        for i in range(self.num_heads):
            scores = Q[i] @ K[i].T / np.sqrt(self.d_k)
            attn = softmax(scores, axis=-1)
            heads.append(attn @ V[i])

        concat = np.stack(heads, axis=1).transpose(1, 0, 2).reshape(n, self.d_model)
        return concat @ self.W_o

    def _ffn(self, X):
        return relu(X @ self.W1 + self.b1) @ self.W2 + self.b2

    def forward(self, X):
        # Pre-norm variant (modern)
        X = X + self._mha(layer_norm(X))
        X = X + self._ffn(layer_norm(X))
        return X


# ── Demo ─────────────────────────────────────────────────────────────────────-
n, d_model, num_heads, d_ff = 10, 64, 8, 256
rng = np.random.default_rng(7)
X = rng.normal(0, 0.5, (n, d_model))

layer = TransformerEncoderLayer(d_model, num_heads, d_ff)
out = layer.forward(X)

print("Transformer Encoder Layer Demo")
print("=" * 45)
print(f"Sequence length : {n}")
print(f"Model dim       : {d_model}")
print(f"Heads           : {num_heads}")
print(f"FFN dim         : {d_ff}")
print(f"Input shape     : {X.shape}")
print(f"Output shape    : {out.shape}")
print()
print("Input vs. output L2 norms:")
for i in range(min(5, n)):
    print(f"  pos {i}: in={np.linalg.norm(X[i]):.3f} out={np.linalg.norm(out[i]):.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a simplified Transformer encoder layer with pre-norm
                residual connections. Includes multi-head self-attention and a feed-forward
                network.
            </p>
            <CodeBlock code={PY_CODE} filename="transformer_layer.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ENCODER_DECODER_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
