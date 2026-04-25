import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Rotary Position Embedding</h2>
            <p className="ch-story-intro">
                Chapter 27&rsquo;s RAG systems exposed a practical scaling bottleneck: longer
                context windows meant more retrieved passages could be included, dramatically
                improving generation quality &mdash; but the quadratic cost of attention and the
                memory demands of caching key&ndash;value pairs made long contexts expensive.
                Chapter 28 covers the engineering innovations developed between 2021 and 2023
                that addressed these constraints from multiple angles: new positional encodings
                that extrapolate to longer sequences, IO-aware attention algorithms that reduce
                memory, grouped-query attention that cuts KV cache size, sparse expert
                architectures that scale model capacity without scaling compute, and the KV cache
                optimization itself.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Sinusoidal PE &mdash; Vaswani et al.</div>
                    <div className="ch-tl-body">
                        The original Transformer used fixed sinusoidal positional encodings added
                        to token embeddings: PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>),
                        PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>). These allowed the model
                        to attend to relative positions via subtraction, but only approximately.
                        Learned absolute positional embeddings (GPT, BERT) replaced sinusoidal
                        encodings in practice but shared the same ceiling: they could not
                        generalise to sequences longer than those seen during training, and
                        absolute position information was baked into embeddings rather than into
                        attention scores.
                    </div>
                    <div className="ch-tl-impact">Impact: Established positional encoding as a first-class problem; exposed the inability to extrapolate beyond trained length</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 &ndash; 2019</div>
                    <div className="ch-tl-section-label">Improvement</div>
                    <div className="ch-tl-title">Relative Position Encodings &mdash; Shaw et al., Transformer-XL</div>
                    <div className="ch-tl-body">
                        Shaw et al. (2018) introduced relative position encodings by modifying
                        the attention logit: a<sub>ij</sub> = (x<sub>i</sub>W<sub>Q</sub>)(x<sub>j</sub>W<sub>K</sub>
                        + r<sub>ij</sub>)<sup>T</sup>, where r<sub>ij</sub> is a clipped relative
                        position embedding. Transformer-XL (Dai et al., 2019) extended this to
                        recurrent-style segment-level memory, enabling effective context beyond a
                        single window. These approaches worked better on long documents but were
                        architecturally complex and offered limited long-context extrapolation
                        because the relative embedding table had a fixed maximum distance.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved relative positions outperform absolute encodings on long documents; raised the extrapolation bar</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">ALiBi &mdash; Press et al.</div>
                    <div className="ch-tl-body">
                        Attention with Linear Biases removed positional embeddings entirely.
                        Instead, a scalar bias proportional to the distance between tokens is
                        subtracted from each attention logit before softmax: score<sub>ij</sub>
                        &minus; m|i &minus; j|, where m is a head-specific slope. Training is
                        faster (no embedding table) and the model extrapolates modestly beyond
                        the training length. ALiBi was adopted by BLOOM (176B) and BigScience
                        models. However, extrapolation quality degrades at long distances because
                        the linear bias was never seen during training.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that zero positional parameters can still encode distance; used in BLOOM (176B)</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 &ndash; 2022</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">RoPE &mdash; Su et al.</div>
                    <div className="ch-tl-body">
                        Rotary Position Embedding (preprint 2021, published RoFormer 2022) introduced
                        a fundamentally different approach: encode position by <em>rotating</em> the
                        query and key vectors in 2D subspaces. For a d-dimensional vector, partition
                        into d/2 pairs and rotate each pair by m&theta;<sub>i</sub>, where m is the
                        absolute token position and &theta;<sub>i</sub> = 10000<sup>&minus;2i/d</sup>.
                        The key algebraic identity: Q<sub>m</sub><sup>T</sup>K<sub>n</sub>
                        = q<sup>T</sup>R((n&minus;m)&Theta;)k &mdash; the dot product depends only on
                        the relative offset (n&minus;m), not on m and n independently. No positional
                        information is added to value vectors. RoPE adds zero parameters, zero
                        inference latency, and handles relative positions in a mathematically
                        exact &mdash; not approximate &mdash; way.
                    </div>
                    <div className="ch-tl-impact">Impact: Exactly encodes relative positions in the dot product; became the de-facto standard for open-source frontier models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">LLaMA Adopts RoPE &mdash; Propagates to the Ecosystem</div>
                    <div className="ch-tl-body">
                        Meta&rsquo;s LLaMA (Touvron et al., 2023) adopted RoPE as its positional
                        encoding. Because LLaMA weights were released and became the base for most
                        open-source development, RoPE propagated through nearly every major
                        open-source model: Mistral, Falcon, Qwen, Baichuan, Yi, DeepSeek, Gemma,
                        and their derivatives. Within a year, RoPE became the positional encoding
                        of record for any new model &mdash; the same role that Adam plays for
                        optimisers and LayerNorm plays for normalisation.
                    </div>
                    <div className="ch-tl-impact">Impact: RoPE cemented as the universal positional encoding of the open-source LLM ecosystem</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Context Length Extension via RoPE Scaling</div>
                    <div className="ch-tl-body">
                        The original LLaMA was trained on 2 048-token contexts. To extend to 4 096,
                        8 192, or 128 000+ tokens without full retraining:
                        <br /><br />
                        <strong>Linear scaling (Chen et al., 2023):</strong> divide all position
                        indices by a scale factor s, effectively compressing the seen range
                        [0, s&sdot;L] into the trained range [0, L]. Cheap but degrades beyond
                        4&ndash;8&times; extrapolation.
                        <br /><br />
                        <strong>YaRN (Peng et al., 2023):</strong> apply a ramp function that scales
                        high-wavelength (low-frequency, large i) RoPE components more aggressively
                        than low-wavelength components. Empirically achieves 128K+ context with
                        minimal perplexity increase using only continued pre-training on a small
                        long-context corpus.
                        <br /><br />
                        <strong>LongRoPE (2024):</strong> further refinements based on searching for
                        non-uniform per-dimension rescaling factors, enabling 2M-token contexts.
                    </div>
                    <div className="ch-tl-impact">Impact: Unlocked long-context LLMs without training from scratch; now standard practice for extending open models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Universality</div>
                    <div className="ch-tl-title">RoPE in Frontier Closed Models</div>
                    <div className="ch-tl-body">
                        While architectural details of GPT-4, Claude, and Gemini are not publicly
                        confirmed, architectural analyses and leaked information strongly suggest that
                        all three use RoPE or a RoPE variant. The universality of the approach across
                        both open and closed frontier models reflects its clean theoretical properties:
                        zero parameters, zero overhead, exact relative-position semantics, and
                        post-hoc extendability.
                    </div>
                    <div className="ch-tl-impact">Impact: Confirmed RoPE as the dominant positional encoding across all classes of frontier LLMs</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why RoPE won:</strong> Every competing method made trade-offs &mdash;
                sinusoidal encodings cannot extrapolate, learned absolute embeddings have fixed
                capacity, relative encodings add architectural complexity, ALiBi degrades at long
                range. RoPE is the first approach that achieves exact relative-position semantics
                in the dot product without any of those penalties. When LLaMA chose it, the
                question of &ldquo;which positional encoding?&rdquo; was effectively settled for
                the open-source era.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Spinning clocks for every word</h2>

            <Analogy label="Spinning Clocks for Every Word">
                Instead of giving each word a number tag (position 1, 2, 3&hellip;), RoPE
                gives each word a spinning clock face. Word 1&rsquo;s clock has rotated a
                little. Word 5&rsquo;s clock has rotated much more. When the model compares two
                words, the angle <em>between</em> their clocks tells it exactly how far apart
                they are &mdash; not where they are on the page.
            </Analogy>

            <Analogy label="The Relative Position Trick">
                The original Transformer knew word 3 and word 7 were at positions 3 and
                7 &mdash; absolute positions. RoPE makes the score between two words naturally
                depend on their <em>difference</em> (7&minus;3 = 4) rather than on their raw
                numbers. The model learns &ldquo;these two words are 4 apart&rdquo; rather than
                &ldquo;one is at 3 and one is at 7.&rdquo; That is much more useful, because
                the meaning of a 4-word gap is the same whether you are near the start or the
                end of a document.
            </Analogy>

            <Analogy label="Why the Old Way Could Not Stretch">
                Learned positional embeddings had a fixed number of slots: one embedding for
                position 1, one for position 2, all the way up to position 2 048. Position
                2 049 simply did not exist. Like a measuring tape that stops at 2 metres &mdash;
                you cannot measure anything longer, no matter how important it is. RoPE has
                no such hard limit because it is a formula, not a lookup table.
            </Analogy>

            <Analogy label="Rotation in 2D Space">
                For two numbers (a, b), rotating them by angle &theta; gives
                (a&middot;cos&theta; &minus; b&middot;sin&theta;, &nbsp; a&middot;sin&theta; + b&middot;cos&theta;).
                RoPE does exactly this rotation on <em>pairs</em> of dimensions of the query
                and key vectors. Each pair gets its own rotation angle, and the angle grows
                with the token&rsquo;s position. After rotation, the dot product between a
                query and a key automatically encodes how far apart the two tokens are.
            </Analogy>

            <Analogy label="YaRN: The Stretchy Tape">
                To extend a model trained at 2 048 tokens to 128 000 tokens, YaRN stretches
                the position clocks. But it does not stretch them all equally &mdash; it slows
                the slow hands (low-frequency rotations, which track long-range relationships)
                more than the fast hands (high-frequency rotations, which track nearby words).
                This is like adjusting a clock so the hour hand moves correctly even when the
                dial is stretched to ten times its original size, without touching the second
                hand at all.
            </Analogy>

            <Analogy label="Why Every Open Model Uses RoPE">
                RoPE adds zero extra numbers to learn, zero extra time at inference, handles
                relative positions exactly, and can be stretched post-hoc to longer contexts.
                It is the obvious choice for any new model &mdash; the same reason all new
                phones use USB-C. When Meta chose it for LLaMA and released the weights, the
                rest of the open-source world simply followed.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Position by rotation: the mathematics of RoPE</h2>

            <h3>Sinusoidal PE Recap</h3>
            <p>
                The original Transformer adds a fixed vector to each token embedding before
                the first attention layer:
            </p>
            <MathBlock tex="x'_m = x_m + \mathrm{PE}_m, \quad \mathrm{PE}_{m,2i} = \sin\!\left(\frac{m}{10000^{2i/d}}\right), \quad \mathrm{PE}_{m,2i+1} = \cos\!\left(\frac{m}{10000^{2i/d}}\right)" />
            <p>
                Two problems: (1) absolute positions are baked into embeddings, not into
                attention scores, so the model must <em>learn</em> to recover relative
                distances from absolute values. (2) Position embeddings only exist up to the
                training length; longer sequences hit undefined positions.
            </p>

            <h3>RoPE Definition</h3>
            <p>
                Instead of modifying embeddings, RoPE multiplies the query Q<sub>m</sub> and
                key K<sub>n</sub> by a rotation matrix before the dot product. For dimension
                pair i, the 2&times;2 rotation block is:
            </p>
            <MathBlock tex="R_i(m\theta_i) = \begin{pmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \cos(m\theta_i) \end{pmatrix}, \quad \theta_i = 10000^{-2i/d}" />
            <p>
                The full d&times;d rotation matrix R(m&Theta;) is block-diagonal over all
                d/2 pairs:
            </p>
            <MathBlock tex="R(m\Theta) = \mathrm{block\text{-}diag}\!\left(R_0(m\theta_0),\; R_1(m\theta_1),\; \ldots,\; R_{d/2-1}(m\theta_{d/2-1})\right)" />

            <h3>Relative Position in the Dot Product</h3>
            <p>
                The key algebraic identity that makes RoPE work: when you form the attention
                logit between position m and position n,
            </p>
            <MathBlock tex="Q_m^T K_n = \bigl(R(m\Theta)\,q_m\bigr)^T \bigl(R(n\Theta)\,k_n\bigr) = q_m^T\, R(m\Theta)^T R(n\Theta)\, k_n = q_m^T\, R\!\bigl((n-m)\Theta\bigr)\, k_n" />
            <p>
                The rotation matrices cancel except for their difference. The attention score
                depends only on the relative offset (n&minus;m) &mdash; <em>not</em> on the
                absolute positions m and n independently. This is exact, not approximate:
                no learnable relative embedding table, no fixed maximum distance.
            </p>

            <h3>Long-Context Extension: Linear Scaling and YaRN</h3>
            <p>
                A model trained on context length L with base &theta;<sub>i</sub> = 10000<sup>&minus;2i/d</sup>
                can be extended by rescaling position indices:
            </p>
            <MathBlock tex="\text{Linear scaling: replace } m \text{ with } m/s \implies \text{effective context} = s \cdot L" />
            <p>
                YaRN (Peng et al., 2023) applies a dimension-dependent ramp function
                &gamma;(i) that scales high-wavelength (small &theta;<sub>i</sub>, large i)
                components more aggressively than low-wavelength components:
            </p>
            <MathBlock tex="\theta'_i = \theta_i \cdot \gamma(i), \quad \gamma(i) = \begin{cases} 1 & i < \alpha \\ \frac{1}{s} & i > \beta \\ \text{ramp} & \text{otherwise} \end{cases}" />
            <p>
                Low-frequency components (large wavelength, tracks long-range dependencies)
                are scaled by 1/s; high-frequency components (short wavelength, tracks
                nearby words) are left unchanged. Empirically achieves 128K+ context at
                minimal perplexity cost with a small continued pre-training step.
            </p>

            <h3>Efficient Implementation via Complex Multiplication</h3>
            <p>
                Constructing the full d&times;d block-diagonal matrix costs O(d<sup>2</sup>)
                per token. The efficient alternative: treat each dimension pair as a complex
                number and multiply by the unit complex e<sup>im&theta;<sub>i</sub></sup>:
            </p>
            <MathBlock tex="\tilde{q}_i = (q_r + i\,q_i)\cdot(\cos(m\theta_i) + i\sin(m\theta_i)) = (q_r\cos m\theta_i - q_i\sin m\theta_i) + i(q_r\sin m\theta_i + q_i\cos m\theta_i)" />
            <p>
                This requires only O(d) FLOPs per token instead of O(d<sup>2</sup>) for
                the full matrix multiplication. In PyTorch, cos/sin caches are precomputed
                and the operation reduces to two element-wise multiplications and an addition.
                RoPE adds negligible overhead to the forward pass.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>The frequency spectrum of RoPE:</strong> Small i (small &theta;<sub>i</sub>
                close to 1) means fast rotation &mdash; these dimensions change quickly with
                position and encode short-range (nearby) relationships. Large i (&theta;<sub>i</sub>
                close to 0) means slow rotation &mdash; these dimensions change slowly and
                encode long-range relationships across thousands of tokens. This hierarchical
                frequency structure is why YaRN&rsquo;s selective scaling works: the slow
                dimensions are the ones that need rescaling for long contexts.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Derivations &middot; frequency analysis &middot; extrapolation theory</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch RoPE implementation &middot; relative position verification</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Deep Dive ─────────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Deriving relative-position invariance and the frequency spectrum</h2>

            <DefBlock label="Rotation Matrix Identity">
                For any angle &alpha; and &beta;, R(&alpha;)<sup>T</sup>R(&beta;) = R(&beta;&minus;&alpha;).
                Proof: R(&alpha;)<sup>T</sup> = R(&minus;&alpha;) (rotation matrices are
                orthogonal), and R(&minus;&alpha;)R(&beta;) = R(&beta;&minus;&alpha;) (rotation
                group is closed under composition). Applying to RoPE with &alpha; = m&Theta;
                and &beta; = n&Theta; gives R((n&minus;m)&Theta;) directly.
            </DefBlock>

            <h3>Formal Proof of Relative-Position Property</h3>
            <p>
                Let q<sub>m</sub> = R(m&Theta;)q and k<sub>n</sub> = R(n&Theta;)k be the
                rotated query and key at positions m and n. The attention score is:
            </p>
            <MathBlock tex="\langle q_m, k_n \rangle = q^T R(m\Theta)^T R(n\Theta) k = q^T R\bigl((n-m)\Theta\bigr) k" />
            <p>
                This depends on the content vectors q and k, and on the offset
                (n&minus;m), but not on m or n individually. Swapping m &rarr; m + c and
                n &rarr; n + c leaves the score unchanged for any constant c.
            </p>

            <h3>Frequency Spectrum Analysis</h3>
            <p>
                For dimension pair i, the rotation angle at position m is
                m&theta;<sub>i</sub> = m &sdot; 10000<sup>&minus;2i/d</sup>. Define the
                wavelength &lambda;<sub>i</sub> = 2&pi;/&theta;<sub>i</sub> = 2&pi; &sdot;
                10000<sup>2i/d</sup>. Then:
            </p>
            <MathBlock tex="\lambda_0 = 2\pi \quad\text{(fast: period of 6 tokens)}" />
            <MathBlock tex="\lambda_{d/2-1} = 2\pi \cdot 10000 \approx 62{,}832 \quad\text{(slow: period of 62k tokens)}" />
            <p>
                Dimension pairs with small i track short-range (nearby) structure; pairs
                with large i track long-range (document-level) structure. This mirrors the
                multi-scale structure of natural language: syntax operates over
                word-to-word distances, discourse operates over paragraph-to-paragraph
                distances.
            </p>

            <h3>Why Linear Scaling Fails at Large Extensions</h3>
            <p>
                Linear scaling replaces m with m/s, compressing position m into the
                trained range [0, L]. For low-frequency dimensions (&lambda;<sub>i</sub>
                &gt; s&sdot;L), the compressed angle m&theta;<sub>i</sub>/s is always
                small and the cosine is nearly 1 &mdash; the model sees essentially no
                rotation signal for long-range pairs. YaRN solves this by selectively
                scaling only the dimensions whose wavelengths would otherwise be compressed
                into the sub-period regime.
            </p>
            <MathBlock tex="\text{YaRN condition: scale dimension } i \text{ iff } \lambda_i < s \cdot L" />

            <div className="ch-callout">
                <strong>Connection to Fourier analysis:</strong> RoPE is essentially a
                Fourier feature map: it maps integer positions to points on the unit circle
                at d/2 different frequencies. The attention dot product then computes a
                weighted sum of cosines of position differences &mdash; exactly the form
                of a discrete Fourier transform. This connection gives theoretical grounding
                to its expressive power and its relationship to sinusoidal PE.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import math

# ── RoPE Implementation ───────────────────────────────────────────────────────

def build_rope_cache(seq_len: int, dim: int, base: float = 10000.0) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Precompute cos and sin tables for RoPE.
    Returns cos, sin each of shape (seq_len, dim // 2).
    """
    # theta_i = base^(-2i/d), shape (dim//2,)
    i = torch.arange(0, dim // 2, dtype=torch.float32)
    theta = 1.0 / (base ** (2 * i / dim))          # (dim//2,)

    # Outer product: m * theta_i, shape (seq_len, dim//2)
    positions = torch.arange(seq_len, dtype=torch.float32)
    angles = torch.outer(positions, theta)           # (seq_len, dim//2)

    return angles.cos(), angles.sin()


def apply_rope(x: torch.Tensor, cos: torch.Tensor, sin: torch.Tensor) -> torch.Tensor:
    """
    Apply rotary embeddings to x via complex multiplication.
    x:   (batch, seq_len, n_heads, head_dim)
    cos: (seq_len, head_dim // 2)
    sin: (seq_len, head_dim // 2)
    """
    # Split x into even/odd pairs along last dimension
    x1 = x[..., 0::2]   # (batch, seq, heads, dim//2)  -- "real" part
    x2 = x[..., 1::2]   # (batch, seq, heads, dim//2)  -- "imag" part

    # Broadcast cos/sin: (1, seq, 1, dim//2)
    cos = cos.unsqueeze(0).unsqueeze(2)
    sin = sin.unsqueeze(0).unsqueeze(2)

    # Complex rotation: (a + ib)(cos + i sin) = (a cos - b sin) + i(a sin + b cos)
    x_rot_1 = x1 * cos - x2 * sin
    x_rot_2 = x1 * sin + x2 * cos

    # Interleave back: [x_rot_1[0], x_rot_2[0], x_rot_1[1], x_rot_2[1], ...]
    out = torch.stack([x_rot_1, x_rot_2], dim=-1)   # (..., dim//2, 2)
    return out.flatten(-2)                           # (..., dim)


# ── Demonstration ─────────────────────────────────────────────────────────────

def demo_relative_position_property():
    """
    Verify: attention_score(q@m, k@n) == attention_score(q@(m+c), k@(n+c))
    i.e., the score depends only on (n - m), not on absolute positions.
    """
    torch.manual_seed(42)
    seq_len, dim = 32, 64
    cos, sin = build_rope_cache(seq_len, dim)

    # Random query and key content vectors
    q = torch.randn(1, seq_len, 1, dim)
    k = torch.randn(1, seq_len, 1, dim)

    q_rot = apply_rope(q, cos, sin)
    k_rot = apply_rope(k, cos, sin)

    # Score at positions m=4, n=10  (offset = 6)
    score_original = (q_rot[0, 4, 0] * k_rot[0, 10, 0]).sum().item()

    # Score at positions m=4+c, n=10+c for c=8  (same offset = 6)
    c = 8
    cos2, sin2 = build_rope_cache(seq_len + c, dim)
    q_rot2 = apply_rope(q, cos2[:seq_len], sin2[:seq_len])
    k_rot2 = apply_rope(k, cos2[:seq_len], sin2[:seq_len])

    # Rebuild with shifted positions
    q_shifted = apply_rope(q[:, :1], cos2[4+c:5+c], sin2[4+c:5+c])
    k_shifted = apply_rope(k[:, :1], cos2[10+c:11+c], sin2[10+c:11+c])
    score_shifted = (q_shifted[0, 0, 0] * k_shifted[0, 0, 0]).sum().item()

    print("RoPE Relative Position Property")
    print("=" * 40)
    print(f"Score(m=4,  n=10):       {score_original:.6f}")
    print(f"Score(m=12, n=18):       {score_shifted:.6f}")
    print(f"Difference:              {abs(score_original - score_shifted):.2e}")
    print(f"Property holds:          {math.isclose(score_original, score_shifted, rel_tol=1e-5)}")


if __name__ == "__main__":
    demo_relative_position_property()
`

function PythonContent() {
    return (
        <>
            <p>
                A complete PyTorch RoPE implementation: precomputing cos/sin caches, applying
                rotary embeddings via efficient complex multiplication (O(d) not O(d<sup>2</sup>)),
                and verifying the relative-position property &mdash; confirming that the attention
                score depends only on the offset (n&minus;m), not on absolute positions m and n.
            </p>
            <CodeBlock code={PY_CODE} filename="rope.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ROPE_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
