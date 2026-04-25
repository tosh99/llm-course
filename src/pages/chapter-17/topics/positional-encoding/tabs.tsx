import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Teaching order to a permutation-blind model</h2>
            <p>
                Attention, by itself, is permutation-equivariant. If you shuffle the words in a
                sentence, the self-attention output changes only because the word vectors themselves
                change — the operation has no inherent concept of "word 3 comes before word 7."
                Positional encoding was invented to inject sequence order into the Transformer
                without reintroducing recurrence, and the choice of <em>how</em> to inject
                position has evolved from fixed sinusoids through learned embeddings to the
                rotary representations now standard in all major LLMs.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Vaswani et al. — Sinusoidal Positional Encoding</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Self-attention is a set function — it treats its inputs as an unordered
                        set and is insensitive to permutations. For language, word order carries
                        critical meaning: "dog bites man" vs. "man bites dog" would produce
                        identical attention outputs without positional information. The positional
                        signal had to be injected without reintroducing any recurrent dependency.
                        <div className="ch-tl-section-label">What was introduced</div>
                        The original Transformer used fixed sinusoidal functions to encode each
                        position. For position pos and dimension i, the encoding is
                        PE<sub>(pos, 2i)</sub> = sin(pos / 10000<sup>2i/d</sup>) and
                        PE<sub>(pos, 2i+1)</sub> = cos(pos / 10000<sup>2i/d</sup>). This vector
                        is added to the token embedding before the first layer. The choice of
                        sine and cosine at different frequencies was deliberate: the authors
                        hypothesized that for any fixed offset k, PE<sub>pos+k</sub> could be
                        written as a linear function of PE<sub>pos</sub>, allowing the model
                        to learn relative position relationships via learned linear transformations.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Sinusoidal encoding required no training parameters, extrapolated to
                        sequences longer than seen during training (in principle), and produced
                        encodings that varied smoothly with position. The model could learn to
                        use the periodic structure to detect relative distances. Ablation studies
                        in the original paper showed that positional encoding was essential —
                        removing it collapsed translation quality dramatically.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled the first fully parallel sequence model; established positional encoding as a required Transformer component</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">GPT-1 and BERT — Learned Positional Embeddings</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Sinusoidal encoding is a fixed function, not learned from data. For
                        language modeling, where the position distribution of training data is
                        highly non-uniform (common sentence structures repeat), a learned
                        embedding might better capture the actual statistics of where words
                        appear and what context they expect at each position.
                        <div className="ch-tl-section-label">What was introduced</div>
                        OpenAI's GPT-1 (and Google's BERT shortly after) replaced sinusoidal
                        encodings with learned embedding vectors E<sub>pos</sub> &#8712; &#8477;<sup>d</sup>
                        for each absolute position pos &#8712; &#123;1, …, n<sub>max</sub>&#125;. For
                        n<sub>max</sub> = 512, this adds 512&#215;d parameters — learned from scratch
                        by gradient descent like any other parameter. The encoding is still
                        added to token embeddings: x<sub>t</sub> = e<sub>token</sub> + E<sub>t</sub>.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Learned embeddings performed equivalently to sinusoids on standard
                        benchmarks while being simpler to implement. They became the default
                        for BERT, RoBERTa, and most encoder-only models. The critical limitation:
                        learned embeddings cannot generalize beyond the maximum training length —
                        a model trained with n<sub>max</sub> = 512 will produce garbage for
                        position 513, since that embedding was never trained.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the standard for BERT and GPT; simpler but limited to training-length sequences</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Relative Position</div>
                    <div className="ch-tl-title">Shaw et al. — Relative Position Representations</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Both sinusoidal and learned absolute position encodings encode position
                        0, 1, 2, … as distinct vectors, but natural language is largely
                        translation-invariant: the relationship between a verb and its subject
                        is the same whether they appear at positions 3–5 or 43–45. Absolute
                        encoding wastes capacity learning that positions 43 and 45 behave like
                        3 and 5, rather than directly learning the relative distance.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Peter Shaw, Jakob Uszkoreit, and Ashish Vaswani introduced relative
                        position representations: instead of adding positional information to
                        token embeddings, inject it directly into the attention score computation.
                        The modified attention score for query i and key j becomes:
                        e<sub>ij</sub> = (xW<sub>Q</sub>)(xW<sub>K</sub> + a<sub>ij</sub><sup>K</sup>)<sup>T</sup>/&#8730;d<sub>k</sub>,
                        where a<sub>ij</sub><sup>K</sup> is a learned embedding for relative
                        distance clip(i&#8722;j, &#8722;k, k). T5's relative position bias followed
                        a similar philosophy with a learned scalar bias per distance bucket.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Relative position encodings gave models an explicit inductive bias for
                        translation-invariant language structure. T5 (Raffel et al., 2019)
                        adopted a simplified version as its default, and it became one of the
                        two main branches of positional encoding research (the other being
                        rotary embeddings). Relative encodings also facilitate length generalization
                        because relative distances between nearby tokens look the same at any
                        absolute position.
                    </div>
                    <div className="ch-tl-impact">Impact: Established relative position as a principled alternative to absolute encoding; adopted by T5</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Modern Standard</div>
                    <div className="ch-tl-title">RoPE — Rotary Position Embedding (Su et al.)</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Additive positional encodings (both absolute and relative) required the
                        attention mechanism to "disentangle" positional information from content
                        information after addition — an indirect approach. Could position be
                        incorporated into the attention score computation directly, so that
                        relative distance naturally emerged in QK<sup>T</sup> without any
                        additional learned parameters?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Jianlin Su and colleagues proposed Rotary Position Embedding (RoPE):
                        instead of adding position to token embeddings, multiply Q and K vectors
                        by a rotation matrix R<sub>&#952;, m</sub> that depends on position m.
                        The key property: (R<sub>&#952;, m</sub>q)<sup>T</sup>(R<sub>&#952;, n</sub>k) =
                        q<sup>T</sup>R<sub>&#952;, n&#8722;m</sub>k — the attention score depends only on
                        the <em>relative</em> distance (n&#8722;m), not on absolute positions.
                        RoPE required no additional parameters and naturally encoded relative
                        position in every attention score.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        RoPE combined the zero-parameter advantage of sinusoidal encoding with
                        the relative-position inductive bias of Shaw's approach. It was adopted
                        by LLaMA (all versions), PaLM, Falcon, Mistral, Gemma, and most modern
                        open LLMs. Extensions (NTK-aware scaling, YaRN) allow RoPE models to
                        generalize to 4&#215;–8&#215; longer sequences than trained, making RoPE + YaRN
                        the current standard for long-context LLMs.
                    </div>
                    <div className="ch-tl-impact">Impact: Adopted as the default positional encoding in LLaMA, PaLM, Falcon, Mistral, and most modern open LLMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – 2022</div>
                    <div className="ch-tl-section-label">Length Extrapolation</div>
                    <div className="ch-tl-title">ALiBi — Attention with Linear Biases (Press et al.)</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        All positional encoding methods struggled with length generalization:
                        training on sequences of length 2048 and testing on length 8192 produced
                        quality degradation for sinusoidal and complete failure for learned
                        embeddings. Could a positional method work at lengths 2&#215;–8&#215; longer
                        than training without any fine-tuning?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Ofir Press, Noah Smith, and Mike Lewis proposed ALiBi (Attention with
                        Linear Biases): instead of adding positional vectors to embeddings, add
                        a constant negative bias &#8722;m|i&#8722;j| to attention score (i, j), where m
                        is a head-specific slope. The further two positions are, the more negative
                        their attention score — discouraging very long-range attention without
                        using learned parameters. This bias function extends naturally to any
                        sequence length.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        ALiBi allowed models trained on 1024 tokens to generalize to 4096 tokens
                        with better performance than models trained directly on 4096. It was
                        adopted in MPT (MosaicML), BLOOM, and several other production models.
                        While RoPE has become more popular for cutting-edge models, ALiBi remains
                        the clearest demonstration that positional encoding is fundamentally a
                        prior over attention patterns, not just a positional signal.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated robust length extrapolation without fine-tuning; adopted in MPT and BLOOM</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core tension:</strong> Because attention treats its inputs as an
                unordered set, you must explicitly tell it where each token sits in the sequence.
                The encoding method — sinusoidal, learned, rotary, or bias-based — is a design
                choice with major consequences for length generalization, relative-position
                reasoning, and parameter efficiency. Modern LLMs universally use RoPE because
                it combines no extra parameters with strong relative-position inductive bias
                and reasonable length extrapolation.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Giving every word a unique numbered ticket</h2>

            <Analogy label="The Amusement Park Without Numbers">
                Imagine an amusement park where every ride is identical and there are no signs,
                no lines, and no numbers. You show up with a group of friends, but nobody knows
                who arrived first. The park owner asks: "Who was fifth in line?" Nobody can answer,
                because there is no record of arrival order.
                <br /><br />
                That is what self-attention is like without positional encoding. It sees all the
                words, but has no idea which one came first. "The cat sat on the mat" and "the
                mat sat on the cat" would look identical — same words, same attention patterns,
                same output. The order is completely lost.
            </Analogy>

            <Analogy label="Numbered Tickets — Sinusoidal Encoding">
                Now the park gives every visitor a numbered ticket with a special color pattern
                as they arrive. The pattern is designed mathematically: ticket 1 is a certain
                mix of red and blue; ticket 2 is a slightly different mix; ticket 10 is a very
                different mix; ticket 100 is different again. But the differences between
                adjacent tickets always look similar — ticket 5 vs. 6 has the same "color distance"
                as ticket 105 vs. 106.
                <br /><br />
                Sinusoidal positional encoding works exactly like this. Each position gets a
                unique vector of sine and cosine values at different frequencies. Close positions
                have similar vectors; distant positions have different vectors. The rides
                (attention heads) learn to read these color patterns and figure out which words
                are near each other — without any explicit programming for it.
            </Analogy>

            <Analogy label="Learned Tickets — GPT and BERT">
                Some parks tried a different approach: let the rides learn their own color
                scheme through experience. After serving thousands of visitors, the rides learned
                that "visitor number 7 always wants the roller coaster, visitor number 3 always
                wants the merry-go-round" and designed ticket colors accordingly.
                <br /><br />
                This is what GPT and BERT do with "learned positional embeddings." Instead of
                using a mathematical formula, they simply learn the best vector for each position
                from the training data. It works great — as long as the ticket numbers don't go
                beyond what they've seen. A visitor with ticket 600 in a park that only trained
                on tickets 1–512 gets a completely random color that nobody knows how to read.
            </Analogy>

            <Analogy label="Rotary Tickets (RoPE) — What Modern LLMs Use">
                The cleverest approach is called RoPE. Instead of adding a positional pattern
                to each ticket, RoPE rotates the ticket (the Q and K vectors) by an angle that
                depends on the position. Position 1 gets a small clockwise rotation; position 2
                gets twice as much; position 100 gets 100 times as much.
                <br /><br />
                The magic: when two rotated tickets are compared (dot product), the rotation
                angles cancel out and only the <em>difference</em> in rotation matters. So what
                the ride "sees" is always just the relative distance between two positions, not
                their absolute positions. Position 5 vs. 8 looks exactly the same as position
                105 vs. 108. This is what linguists call translation-invariance — word
                relationships are the same wherever they appear in a sentence.
            </Analogy>

            <Analogy label="ALiBi — The Distance Penalty">
                ALiBi takes the simplest possible approach: just subtract points from the
                attention score based on how far apart two words are. Words close together
                are barely penalized. Words far apart get a big penalty, making the model
                focus more on nearby context.
                <br /><br />
                The genius: this penalty works for <em>any</em> distance, even distances the
                model has never trained on. A model trained on sentences up to 1,000 words
                can handle sentences up to 4,000 words using ALiBi — the distance penalty
                function just keeps extending. No extra training needed.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Sinusoids, learned embeddings, and rotary encodings</h2>

            <h3>Why Position Matters: The Permutation Problem</h3>
            <p>
                Self-attention computes output position i as:
                o<sub>i</sub> = &#8721;<sub>j</sub>A<sub>ij</sub>v<sub>j</sub>,
                where A<sub>ij</sub> = softmax(q<sub>i</sub>&#183;k<sub>j</sub>/&#8730;d<sub>k</sub>).
                If you permute the input sequence x<sub>&#960;(1)</sub>, …, x<sub>&#960;(n)</sub>,
                the output is o<sub>&#960;(1)</sub>, …, o<sub>&#960;(n)</sub> — identically permuted.
                The model is <strong>permutation-equivariant</strong>: without positional encoding,
                "cat bites dog" and "dog bites cat" produce the same representations (just
                in different slots). Positional encoding breaks this symmetry.
            </p>

            <h3>Sinusoidal Positional Encoding</h3>
            <p>
                For model dimension d, position pos &#8712; &#123;0, …, n&#8722;1&#125;, and dimension index
                i &#8712; &#123;0, …, d/2&#8722;1&#125;:
            </p>
            <MathBlock tex="PE_{(pos,\, 2i)} = \sin\!\left(\frac{pos}{10000^{2i/d}}\right)" />
            <MathBlock tex="PE_{(pos,\, 2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d}}\right)" />
            <p>
                Even dimensions use sine; odd dimensions use cosine. The base frequency for
                dimension i is &#969;<sub>i</sub> = 10000<sup>&#8722;2i/d</sup>. Low i &#8594; high frequency
                (fine-grained local position); high i &#8594; low frequency (coarse global position).
                Wavelengths span from 2&#960; &#8776; 6 to 10000&#183;2&#960; &#8776; 62,832 positions.
            </p>

            <h3>The Relative Position Property</h3>
            <p>
                For any fixed offset k and frequency &#969;, the addition formula gives:
            </p>
            <MathBlock tex="\sin(\omega (pos + k)) = \sin(\omega \cdot pos)\cos(\omega k) + \cos(\omega \cdot pos)\sin(\omega k)" />
            <p>
                This means PE<sub>pos+k</sub> is a linear function of PE<sub>pos</sub>:
                the model can learn to detect "k positions forward" by applying a fixed linear
                transformation to the position encoding. This is the theoretical justification
                for sinusoidal encoding's relative-position capability.
            </p>

            <h3>Rotary Position Embedding (RoPE)</h3>
            <p>
                RoPE encodes position m by rotating the Q and K vectors. For a 2D subspace
                (dimensions 2i, 2i+1) with angle &#952;<sub>i</sub> = 10000<sup>&#8722;2i/d</sup>:
            </p>
            <MathBlock tex="R_{\theta_i, m} = \begin{pmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \phantom{-}\cos(m\theta_i) \end{pmatrix}" />
            <p>
                Apply R<sub>&#952;, m</sub> to query at position m and R<sub>&#952;, n</sub> to key
                at position n. Their dot product:
            </p>
            <MathBlock tex="(R_{\theta,m}\,\mathbf{q})^\top (R_{\theta,n}\,\mathbf{k}) = \mathbf{q}^\top R_{\theta,\, n-m}\,\mathbf{k}" />
            <p>
                The attention score depends only on the relative distance (n&#8722;m) — absolute
                positions cancel. RoPE is the standard in LLaMA, Mistral, PaLM, Falcon, and
                most modern open models.
            </p>

            <h3>ALiBi: Attention with Linear Biases</h3>
            <p>
                ALiBi adds a constant negative bias to attention scores based on distance:
            </p>
            <MathBlock tex="S_{ij} = \frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d_k}} - m_{\text{head}} \cdot |i - j|" />
            <p>
                where m<sub>head</sub> is a head-specific slope (geometric series from 1/8 to 1).
                The further apart two tokens, the more negative the bias — discouraging long-range
                attention. Unlike learned embeddings, this bias function extends naturally to
                any sequence length, enabling length extrapolation at inference without fine-tuning.
            </p>

            <h3>Comparison Across Methods</h3>
            <ul>
                <li><strong>Sinusoidal:</strong> No parameters, smooth extrapolation, relative-position property. Limited by the model's ability to use the sinusoidal structure.</li>
                <li><strong>Learned:</strong> Adaptive to training distribution, simple. Catastrophically fails beyond training length.</li>
                <li><strong>RoPE:</strong> No parameters, relative distance emerges naturally in QK<sup>T</sup>, strong extrapolation with YaRN scaling. Current standard.</li>
                <li><strong>ALiBi:</strong> No parameters, robust extrapolation, simple. Somewhat weaker on tasks requiring very long-range attention.</li>
                <li><strong>T5 relative bias:</strong> Learned scalar per distance bucket, strong relative-position inductive bias. Used in T5, mT5.</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why RoPE won:</strong> RoPE combines zero parameters (unlike learned
                embeddings), relative-position awareness baked into the attention score (unlike
                additive encodings), and practical length extrapolation via scaling (unlike
                sinusoidal). LLaMA, Mistral, PaLM, Falcon, and Gemma all use RoPE, making it
                the de facto standard for decoder-only LLMs as of 2024.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">RoPE derivation · frequency analysis · extrapolation theory</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Sinusoidal PE · RoPE · NumPy</span>
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
            <h2>Formal definitions and RoPE derivation</h2>

            <DefBlock label="Sinusoidal PE — Formal Specification">
                For model dimension d, position pos &#8712; &#123;0, …, n&#8722;1&#125;, dimension i &#8712; &#123;0, …, d/2&#8722;1&#125;:
                <br />
                PE<sub>(pos, 2i)</sub> = sin(pos / 10000<sup>2i/d</sup>),
                PE<sub>(pos, 2i+1)</sub> = cos(pos / 10000<sup>2i/d</sup>).
                <br />
                The full encoding PE<sub>pos</sub> &#8712; &#8477;<sup>d</sup> is added to the token embedding
                before the first Transformer layer. It is fixed (not learned) and requires zero parameters.
            </DefBlock>

            <h3>Frequency Spectrum Analysis</h3>
            <p>
                The angular frequency for dimension pair i is:
            </p>
            <MathBlock tex="\omega_i = 10000^{-2i/d}" />
            <p>
                For i = 0: &#969;<sub>0</sub> = 1, period = 2&#960; &#8776; 6.3 positions.
                For i = d/2&#8722;1: &#969;<sub>d/2&#8722;1</sub> &#8776; 10000<sup>&#8722;1</sup>, period = 2&#960;&#183;10000 &#8776; 62,832 positions.
                Low-index dimensions encode fine-grained local position; high-index dimensions
                encode global position over thousands of tokens.
            </p>

            <h3>RoPE: Rotary Position Embedding Derivation</h3>
            <p>
                RoPE seeks a function f<sub>q</sub>(x, m) such that the dot product
                f<sub>q</sub>(x<sub>m</sub>, m)<sup>T</sup>f<sub>k</sub>(x<sub>n</sub>, n) = g(x<sub>m</sub>, x<sub>n</sub>, m&#8722;n)
                depends only on relative position. The rotation formulation satisfies this:
            </p>
            <MathBlock tex="f_{q,k}(\mathbf{x}, m) = \mathbf{W}_{q,k} \mathbf{x} \cdot e^{im\theta}" />
            <p>
                In complex notation, where d/2 pairs are treated as d/2 complex numbers. The
                rotation matrix for the full d-dimensional vector is block-diagonal:
            </p>
            <MathBlock tex="\mathbf{R}_{m} = \text{diag}\!\left(R_{\theta_1, m}, R_{\theta_2, m}, \ldots, R_{\theta_{d/2}, m}\right)" />
            <p>
                where each 2&#215;2 block R<sub>&#952;<sub>i</sub>, m</sub> rotates the i-th pair of
                dimensions by angle m&#952;<sub>i</sub>. The key property:
            </p>
            <MathBlock tex="(R_m \mathbf{q})^\top (R_n \mathbf{k}) = \mathbf{q}^\top R_m^\top R_n \mathbf{k} = \mathbf{q}^\top R_{n-m} \mathbf{k}" />
            <p>
                Since R<sub>m</sub><sup>T</sup>R<sub>n</sub> = R<sub>n&#8722;m</sub> (rotation matrices
                compose by addition), the score depends only on relative distance n&#8722;m. This is
                the exact relative-position property that sinusoidal encoding approximates through
                a linear projection.
            </p>

            <h3>NTK-Aware Scaling for Length Extrapolation</h3>
            <p>
                For a model trained with RoPE frequencies &#952;<sub>i</sub> = 10000<sup>&#8722;2i/d</sup>
                to generalize from length L<sub>train</sub> to L<sub>test</sub> &#62; L<sub>train</sub>,
                scale the base from 10000 to 10000&#183;(L<sub>test</sub>/L<sub>train</sub>)<sup>d/(d&#8722;2)</sup>.
                This is the NTK-aware RoPE scaling used in "SuperHOT" and extended by YaRN,
                enabling 4k&#8594;32k extrapolation with minimal fine-tuning.
            </p>

            <div className="ch-callout">
                <strong>Why absolute vs. relative position matters:</strong> Absolute positional
                encodings tell the model "you are at position 42." Relative encodings tell it
                "you are 7 tokens after position 35." For language tasks where the same
                syntactic relationship (subject-verb agreement) appears at any absolute position,
                relative encoding provides a stronger inductive bias. RoPE encodes relativity
                directly into the QK dot product — no extra computation needed.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Sinusoidal Positional Encoding ────────────────────────────────────────────
def sinusoidal_pe(n: int, d: int) -> np.ndarray:
    """
    Returns PE matrix of shape (n, d).
    PE[pos, 2i]   = sin(pos / 10000^(2i/d))
    PE[pos, 2i+1] = cos(pos / 10000^(2i/d))
    """
    pos = np.arange(n)[:, None]          # (n, 1)
    i   = np.arange(d)[None, :]          # (1, d)
    angles = pos / np.power(10000, (2 * (i // 2)) / d)

    pe = np.zeros((n, d))
    pe[:, 0::2] = np.sin(angles[:, 0::2])
    pe[:, 1::2] = np.cos(angles[:, 1::2])
    return pe


# ── Rotary Position Embedding (RoPE) ─────────────────────────────────────────
def rope_rotate(x: np.ndarray, pos: int, base: float = 10000.0) -> np.ndarray:
    """
    Apply RoPE rotation to vector x at position pos.
    x: (d,) — will be treated as d/2 complex pairs.
    """
    d = x.shape[0]
    assert d % 2 == 0
    half = d // 2
    theta = np.array([1.0 / (base ** (2 * i / d)) for i in range(half)])
    angles = pos * theta                # (d/2,)
    cos_a = np.cos(angles)
    sin_a = np.sin(angles)

    x1, x2 = x[:half], x[half:]
    # Rotate each pair (x1_i, x2_i) by angle angles_i
    x1_rot = x1 * cos_a - x2 * sin_a
    x2_rot = x1 * sin_a + x2 * cos_a
    return np.concatenate([x1_rot, x2_rot])


def rope_batch(X: np.ndarray, base: float = 10000.0) -> np.ndarray:
    """Apply RoPE to each position in X: (n, d) -> (n, d)"""
    n, d = X.shape
    return np.stack([rope_rotate(X[pos], pos, base) for pos in range(n)])


# ── Demo ──────────────────────────────────────────────────────────────────────
n, d = 16, 32
rng  = np.random.default_rng(42)

pe_sin = sinusoidal_pe(n, d)
print("Sinusoidal PE Demo")
print("=" * 50)
print(f"Shape: {pe_sin.shape}")

# Relative position property: sim(PE[i], PE[j]) depends on |i-j|
def cos_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9)

print()
print("Cosine similarities at same relative distances (offset=3):")
for anchor in [2, 7, 12]:
    if anchor + 3 < n:
        s = cos_sim(pe_sin[anchor], pe_sin[anchor + 3])
        print(f"  PE[{anchor}] vs PE[{anchor+3}]: {s:.4f}")

# RoPE: verify relative position property
print()
print("RoPE relative position check:")
q = rng.normal(0, 1, d)
k = rng.normal(0, 1, d)
for m, n_pos in [(0, 5), (10, 15), (100, 105)]:
    q_rot = rope_rotate(q, m)
    k_rot = rope_rotate(k, n_pos)
    score = q_rot @ k_rot
    print(f"  positions ({m},{n_pos}), distance={n_pos-m}: score={score:.4f}")

# All have distance 5 -> scores should be similar
print("  (Similar scores confirm relative-position invariance)")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of sinusoidal positional encoding and Rotary Position
                Embedding (RoPE). The demo verifies the relative-position property: cosine
                similarities between sinusoidal vectors at equal offsets are similar,
                and RoPE dot products with the same relative distance produce similar scores
                regardless of absolute position.
            </p>
            <CodeBlock code={PY_CODE} filename="positional_encoding.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const POSITIONAL_ENCODING_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
