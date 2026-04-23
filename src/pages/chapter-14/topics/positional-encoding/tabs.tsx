import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Teaching order to a permutation-blind model</h2>
            <p>
                Attention, by itself, is permutation-invariant. If you shuffle the words in a
                sentence, the self-attention output changes only because the word vectors
                themselves change — the operation does not know that "cat sat mat" is different
                from "mat sat cat." Positional encoding was invented to inject sequence order
                into the Transformer without reintroducing recurrence.
            </p>

            <div className="ch14-timeline">
                <div className="ch14-tl-item">
                    <div className="ch14-tl-year">2017</div>
                    <div className="ch14-tl-section-label">Invention</div>
                    <div className="ch14-tl-title">Vaswani et al. — Sinusoidal Positional Encoding</div>
                    <div className="ch14-tl-body">
                        The original Transformer used fixed sinusoidal functions of different
                        frequencies to encode position. The encoding is added directly to the
                        input embeddings. The choice of sine and cosine was deliberate: the
                        authors hypothesized that it would allow the model to learn to attend
                        by relative positions, because for any fixed offset k, PE<sub>pos+k</sub>
                        can be represented as a linear function of PE<sub>pos</sub>.
                    </div>
                    <div className="ch14-tl-impact">Impact: Enabled the first fully parallel sequence model</div>
                </div>

                <div className="ch14-tl-item">
                    <div className="ch14-tl-year">2018</div>
                    <div className="ch14-tl-section-label">Alternative</div>
                    <div className="ch14-tl-title">GPT-1 — Learned Positional Embeddings</div>
                    <div className="ch14-tl-body">
                        OpenAI's GPT-1 replaced the fixed sinusoids with learned embedding vectors
                        for each position, just like word embeddings. For a maximum sequence
                        length of 512, this adds 512 × d<sub>model</sub> parameters. The learned
                        approach performed equivalently to sinusoids on language modeling, and
                        became the default in BERT and subsequent encoder-only models.
                    </div>
                    <div className="ch14-tl-impact">Impact: Simpler to implement; became standard in GPT and BERT</div>
                </div>

                <div className="ch14-tl-item">
                    <div className="ch14-tl-year">2021</div>
                    <div className="ch14-tl-section-label">Evolution</div>
                    <div className="ch14-tl-title">RoPE — Rotary Position Embedding</div>
                    <div className="ch14-tl-body">
                        Su et al. proposed Rotary Position Embedding (RoPE), which multiplies
                        the Query and Key vectors by a rotation matrix that depends on position.
                        Unlike additive encodings, RoPE encodes position directly into the
                        dot-product attention score, making relative position naturally emerge
                        in the QK<sup>⊤</sup> computation. It also extrapolates to longer
                        sequences better than sinusoidal or learned embeddings.
                    </div>
                    <div className="ch14-tl-impact">Impact: Adopted in LLaMA, PaLM, and most modern open LLMs</div>
                </div>

                <div className="ch14-tl-item">
                    <div className="ch14-tl-year">2022 – 2024</div>
                    <div className="ch14-tl-section-label">Long Context</div>
                    <div className="ch14-tl-title">ALiBi, xPos, and Extrapolation Research</div>
                    <div className="ch14-tl-body">
                        To handle contexts far longer than training length, researchers developed
                        bias-based approaches. ALiBi (Attention with Linear Biases) adds a
                        negative bias to attention scores proportional to the distance between
                        tokens. This simple change allows models to extrapolate to sequences
                        2×–8× longer without any fine-tuning. xPos and other variants refine
                        this idea for better relative-position behavior.
                    </div>
                    <div className="ch14-tl-impact">Impact: ALiBi is used in MPT and BLOOM; critical for long-context inference</div>
                </div>
            </div>

            <div className="ch14-callout">
                <strong>The core insight:</strong> Because attention treats its inputs as an
                unordered set, you must explicitly tell it where each token sits in the
                sequence. The encoding method — sinusoidal, learned, or rotary — is a design
                choice that affects training stability, length extrapolation, and relative-position
                generalization.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Numbered tickets in a line</h2>

            <Analogy label="The Amusement Park (No Position)">
                Imagine an amusement park where every ride is identical and there are no signs,
                no lines, and no numbers. You show up with a group of friends, but nobody knows
                who got there first. The park owner asks: "Who was first in line?" No one can
                answer. That is what attention is like without positional encoding — it sees
                everyone but has no idea about order.
            </Analogy>

            <Analogy label="Numbered Tickets (Positional Encoding)">
                Now the park gives everyone a numbered ticket as they arrive. Ticket 1, Ticket 2,
                Ticket 3, and so on. But instead of just writing the number, the ticket has a
                special pattern of colors that repeats in a clever way. Ticket 1 might be mostly
                red. Ticket 2 is red-orange. Ticket 10 has a mix of many colors. The pattern is
                designed so that the difference between Ticket 5 and Ticket 6 looks mathematically
                similar to the difference between Ticket 105 and Ticket 106.
                <br /><br />
                The rides (attention heads) can now look at the ticket colors and know not just
                <em>who</em> you are, but <em>when</em> you arrived. And because the color pattern
                is smooth, the rides can guess what Ticket 1,000 might look like even if they've
                never seen anyone with a number that high.
            </Analogy>

            <Analogy label="Learned Tickets vs. Designed Tickets">
                Some parks let the rides learn their own ticket patterns over time (learned
                embeddings). Others use a pre-designed color formula (sinusoidal encoding).
                The designed tickets work instantly with no learning. The learned tickets can
                adapt to the specific park but struggle when someone shows up with Ticket 2,000
                and the rides have only ever seen up to Ticket 512.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Sinusoids, learned embeddings, and rotary encodings</h2>

            <h3>Why Position Matters</h3>
            <p>
                Self-attention computes its output for position i as a weighted sum over all
                positions j. The weights depend only on the content vectors (via dot products).
                If you swap two positions, their outputs swap identically — the model cannot
                distinguish "the cat sat" from "sat cat the." Positional encoding fixes this by
                adding a unique vector to each position before the first attention layer.
            </p>

            <h3>Sinusoidal Positional Encoding</h3>
            <p>
                The original Transformer defines the encoding for position <em>pos</em> and
                dimension <em>i</em> as:
            </p>
            <MathBlock tex="PE_{(pos, 2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" />
            <MathBlock tex="PE_{(pos, 2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" />
            <p>
                Even dimensions use sine; odd dimensions use cosine. The wavelength forms a
                geometric progression from 2π to 10000 · 2π. Low dimensions (small i) have
                high frequency and capture fine-grained local position. High dimensions
                (large i) have low frequency and capture coarse global position.
            </p>

            <h3>Relative Position Property</h3>
            <p>
                For any fixed offset k, there exist constants a and b (depending on k) such that:
            </p>
            <MathBlock tex="\sin(\omega \cdot (pos + k)) = a \sin(\omega \cdot pos) + b \cos(\omega \cdot pos)" />
            <p>
                This means the model can learn to attend by relative position using only
                linear transformations of the encoded inputs. The authors hypothesized this
                would make extrapolation easier, though in practice learned embeddings work
                just as well for in-distribution lengths.
            </p>

            <hr className="ch14-sep" />
            <div className="ch14-callout">
                <strong>Learned vs. sinusoidal:</strong> Sinusoidal encodings require no training,
                extrapolate to unseen lengths, and have a built-in relative-position bias.
                Learned embeddings are simpler to implement, can adapt to the data distribution,
                and often perform slightly better on fixed-length tasks. Modern models like
                LLaMA use RoPE, which combines the best of both worlds.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal definitions and extrapolation analysis</h2>

            <DefBlock label="Sinusoidal Positional Encoding — Formal Specification">
                For model dimension d<sub>model</sub>, sequence position pos ∈ &#123;0, ..., n−1&#125;,
                and dimension index i ∈ &#123;0, ..., d<sub>model</sub>/2 − 1&#125;:
                <br />
                PE<sub>(pos, 2i)</sub> = sin(pos / 10000<sup>2i/d<sub>model</sub></sup>)
                <br />
                PE<sub>(pos, 2i+1)</sub> = cos(pos / 10000<sup>2i/d<sub>model</sub></sup>)
                <br />
                The encoding vector PE<sub>pos</sub> ∈ ℝ<sup>d<sub>model</sub></sup> is added to
                the token embedding e<sub>pos</sub> before the first Transformer layer.
            </DefBlock>

            <h3>Frequency Analysis</h3>
            <p>
                Define the angular frequency for dimension i:
            </p>
            <MathBlock tex="\omega_i = \frac{1}{10000^{2i/d_{\text{model}}}} = 10000^{-2i/d_{\text{model}}}" />
            <p>
                For i = 0, ω<sub>0</sub> = 1, so the period is 2π ≈ 6.28 positions.
                For i = d<sub>model</sub>/2 − 1, the period is 2π · 10000 ≈ 62,832 positions.
                The full range of periods allows the model to attend by both local and global
                position simultaneously.
            </p>

            <h3>RoPE — Rotary Position Embedding</h3>
            <p>
                Instead of adding position to the input, RoPE rotates the Query and Key vectors
                by an angle that depends on position. For a 2D subspace (dimensions 2i, 2i+1):
            </p>
            <MathBlock tex="R_{\theta, m} = \begin{pmatrix} \cos(m\theta) & -\sin(m\theta) \\ \sin(m\theta) & \phantom{-}\cos(m\theta) \end{pmatrix}" />
            <p>
                The Query for token at position m is rotated by R<sub>θ, m</sub>; the Key for
                token at position n is rotated by R<sub>θ, n</sub>. Their dot product becomes:
            </p>
            <MathBlock tex="(R_{\theta, m}\,q)^{\top} (R_{\theta, n}\,k) = q^{\top} R_{\theta, n-m}\,k" />
            <p>
                The attention score depends only on the <em>relative</em> distance (n − m),
                not on absolute position. This is a powerful inductive bias for language,
                where syntactic relationships are largely translation-invariant.
            </p>

            <h3>Extrapolation Comparison</h3>
            <ul>
                <li><strong>Sinusoidal:</strong> Extrapolates gracefully because the functions are
                periodic and bounded. However, the model may not learn to use high periods effectively.</li>
                <li><strong>Learned:</strong> Fails catastrophically beyond training length because
                unseen positions have random embeddings.</li>
                <li><strong>RoPE:</strong> Extrapolates well for moderate length increases; can be
                further improved by scaling the rotation angles (NTK-aware scaling, YaRN).</li>
                <li><strong>ALiBi:</strong> Adds a distance penalty −m·|i−j| to attention scores.
                No encoding needed; extrapolation is built into the bias function.</li>
            </ul>

            <div className="ch14-callout">
                <strong>Why no positional encoding in the decoder output?</strong> The decoder
                generates tokens autoregressively. It only needs to know the positions of the
                tokens it has already generated, which are always 0..t−1. Positional encoding
                is added at every layer's input (or, in some implementations, only at the first
                layer), ensuring position information propagates through the network.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Positional Encoding — NumPy ───────────────────────────────────────────────

def sinusoidal_positional_encoding(n, d_model):
    """
    Returns PE matrix of shape (n, d_model).
    PE[pos, 2i]   = sin(pos / 10000^(2i/d_model))
    PE[pos, 2i+1] = cos(pos / 10000^(2i/d_model))
    """
    pos = np.arange(n)[:, np.newaxis]           # (n, 1)
    dim = np.arange(d_model)[np.newaxis, :]     # (1, d_model)
    angle_rates = 1 / np.power(10000, (2 * (dim // 2)) / d_model)
    angle_rads = pos * angle_rates              # (n, d_model)

    pe = np.zeros((n, d_model))
    pe[:, 0::2] = np.sin(angle_rads[:, 0::2])
    pe[:, 1::2] = np.cos(angle_rads[:, 1::2])
    return pe


# ── Demo ─────────────────────────────────────────────────────────────────────-
n, d_model = 16, 64
pe = sinusoidal_positional_encoding(n, d_model)

print("Sinusoidal Positional Encoding Demo")
print("=" * 45)
print(f"Sequence length : {n}")
print(f"Model dim       : {d_model}")
print(f"PE shape        : {pe.shape}")
print()

# Show that PE[pos] + PE[offset] is a linear function of PE[pos]
# by checking the dot-product similarity between distant positions
from numpy.linalg import norm
pos = 5
offsets = [1, 2, 3, 4]
print("Relative position similarities (dot product of PE[pos] and PE[pos+offset]):")
for off in offsets:
    sim = np.dot(pe[pos], pe[pos + off]) / (norm(pe[pos]) * norm(pe[pos + off]))
    print(f"  offset {off}: {sim:.4f}")
print()

# Verify that learned embeddings would just be random for unseen positions
print("Learned embedding extrapolation would produce random similarity for unseen positions.")
print("Sinusoidal encodings produce stable, predictable similarities.")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of sinusoidal positional encoding. The demo computes
                cosine similarities between position vectors to illustrate the relative-position
                property.
            </p>
            <CodeBlock code={PY_CODE} filename="positional_encoding.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Positional Encoding — TypeScript ────────────────────────────────────────

function sinusoidalPE(n: number, dModel: number): number[][] {
  const pe: number[][] = Array.from({ length: n }, () => Array(dModel).fill(0))
  for (let pos = 0; pos < n; pos++) {
    for (let i = 0; i < dModel; i++) {
      const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dModel)
      pe[pos][i] = i % 2 === 0 ? Math.sin(angle) : Math.cos(angle)
    }
  }
  return pe
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, v, i) => s + v * b[i], 0)
}

function norm(v: number[]): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0))
}

// ── Demo ─────────────────────────────────────────────────────────────────────-
const n = 16, dModel = 64
const pe = sinusoidalPE(n, dModel)

console.log("Positional Encoding — TypeScript")
console.log("─".repeat(40))
console.log("PE shape:", pe.length, "x", pe[0].length)

const pos = 5
console.log("Cosine similarities for offsets 1..4:")
for (let off = 1; off <= 4; off++) {
  const a = pe[pos], b = pe[pos + off]
  const sim = dot(a, b) / (norm(a) * norm(b))
  console.log(\`  offset \${off}: \${sim.toFixed(4)}\`)
}
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of sinusoidal positional encoding with cosine
                similarity analysis between position vectors.
            </p>
            <CodeBlock code={TS_CODE} filename="positional_encoding.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const POSITIONAL_ENCODING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
