import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 15's attention mechanism solved Seq2Seq's bottleneck — instead of compressing the entire input into one vector, the decoder could look back at every encoder state selectively. But attention didn't change the fundamental architecture: encoders and decoders were still LSTMs processing sequences step by step. Researchers in 2015–2017 pushed this recurrent paradigm in three directions: stacking more layers for greater abstraction, copying from the input directly rather than generating new tokens, and generating raw audio sample-by-sample. These are the final milestones of the recurrent era.
            </p>
            <h2>Depth in the time domain</h2>
            <p>
                Deep learning's success in computer vision came from stacking many convolutional
                layers to build hierarchical features. The natural question arose: can we do the
                same with recurrent networks? The answer is yes — but stacking RNNs introduces
                unique challenges because depth operates across two dimensions: time (sequence
                length) and layer (stacked depth).
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1996</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">El Hihi &amp; Bengio — Hierarchical Recurrent Neural Networks</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Single-layer RNNs passed information through a single hidden state, forcing the network to represent everything — phonemes, syllables, words, and phrases — in one vector. Researchers wanted the same kind of hierarchical abstraction that multi-layer feedforward networks provided for classification.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Salah El Hihi and Yoshua Bengio proposed hierarchical recurrent neural networks, where each layer operated at a different temporal granularity. Lower layers updated at every time step; higher layers updated less frequently, compressing information over larger windows. This created a coarse-to-fine processing chain mirroring the human auditory system.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The 1996 paper established the conceptual blueprint that Graves and Wu et al. would implement at scale two decades later. It demonstrated that recurrent depth and temporal hierarchy are distinct ideas that can be combined. Without this foundation, the jump from single-layer RNNs to 4- and 8-layer production systems would have lacked theoretical motivation.
                    </div>
                    <div className="ch-tl-impact">Impact: Established hierarchical RNNs as a principled architecture family, not just an ad-hoc stack</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">Pascanu, Mikolov &amp; Bengio — On the Difficulty of Training RNNs</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        By 2013, LSTMs had mitigated the vanishing gradient problem across time steps — but stacking multiple LSTM layers introduced a new, under-studied source of instability. Gradients flowing backward through multiple stacked layers experienced compounding attenuation or explosion, making 3-layer and deeper RNNs nearly impossible to train reliably.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Razvan Pascanu, Tomas Mikolov, and Yoshua Bengio conducted the first systematic analysis of gradient flow in deep RNNs, distinguishing two separate failure modes: vanishing/exploding gradients <em>across time steps</em> (partially solved by LSTM gating) and vanishing gradients <em>across stacked layers</em> (not solved by gating). They proposed gradient norm clipping as a practical remedy and studied how depth interacts with sequence length to make training exponentially harder.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        This paper gave practitioners a precise language for diagnosing training failures in deep RNNs and motivated the subsequent wave of regularization techniques — variational dropout, recurrent batch normalization, and highway connections — that made 4–6 layer RNNs routinely trainable. It also demonstrated that the temporal and spatial dimensions of gradient flow are mathematically distinct and must be addressed separately.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that deep RNN training requires fundamentally different techniques than deep feedforward networks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 – 2014</div>
                    <div className="ch-tl-section-label">Speech Recognition</div>
                    <div className="ch-tl-title">Graves — Deep Bidirectional LSTM for Speech and Sutskever — 4-Layer LSTM Seq2Seq</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Speech recognition and machine translation needed models that could understand both local acoustic detail and long-range linguistic context simultaneously. Single-layer RNNs excelled at one or the other but rarely both.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Alex Graves demonstrated that deep bidirectional LSTMs — stacking 5+ layers in both forward and backward directions — achieved state-of-the-art results on the TIMIT speech benchmark using Connectionist Temporal Classification (CTC). Independently, Ilya Sutskever, Oriol Vinyals, and Quoc Le showed that a 4-layer LSTM encoder paired with a 4-layer LSTM decoder dramatically outperformed shallower architectures on machine translation, achieving 34.8 BLEU on WMT English-French.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Both results established 4 layers as the empirical sweet spot for recurrent depth in production systems. Sutskever's Seq2Seq paper became one of the most influential NLP papers of the decade; its 4-layer design was replicated by Google Translate, Microsoft Translator, and dozens of academic systems. Graves's speech work directly inspired Deep Speech (Baidu, 2014), proving the pattern held across modalities.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that 4 recurrent layers substantially outperform 1–2 layers for complex sequence tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2016</div>
                    <div className="ch-tl-section-label">Regularization</div>
                    <div className="ch-tl-title">Variational Dropout — Gal &amp; Ghahramani 2016</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Naive dropout applied to RNNs — dropping random weights at every time step — destroyed the gradient signal through the recurrence. A hidden state zeroed at step t could not pass gradient back to step t−1, making dropout useless or harmful for recurrent connections. Without effective regularization, deep RNNs of 3+ layers consistently overfit on small-to-medium datasets.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Yarin Gal and Zoubin Ghahramani derived variational dropout from Bayesian theory: apply the <em>same dropout mask</em> across all time steps for a given sequence and sample a fresh mask per layer per batch. This preserves the recurrent signal (the same weights are dropped throughout time, so the gradient path is consistent) while providing effective regularization across stacked layers. Simultaneously, Cooijmans et al. introduced recurrent batch normalization — computing separate batch statistics per time step and normalizing pre-activations before the nonlinearity.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Variational dropout enabled reliable training of 3- to 6-layer RNNs on datasets as small as Penn Treebank (1M tokens). It reduced perplexity by 5–8 points compared to no regularization at the same depth, and is still the default regularization method in PyTorch's LSTM implementation. Without it, the GPU-era scaling of RNNs to 4+ layers would have been impractical outside of massive-data regimes like Google's.
                    </div>
                    <div className="ch-tl-impact">Impact: Made reliable training of 4–6 layer RNNs possible on datasets of any size</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Production Scale</div>
                    <div className="ch-tl-title">Wu et al. — Google's Neural Machine Translation System</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Google's production translation system processed hundreds of millions of sentence pairs. The 4-layer Sutskever baseline was already excellent, but larger and more complex systems kept improving. Could RNN depth be pushed beyond 4 layers without degradation? And could residual connections — borrowed from ResNet — stabilize training at 8 layers?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Yonghui Wu and colleagues described the Google NMT (GNMT) system: an 8-layer LSTM encoder and 8-layer LSTM decoder with residual connections between every pair of layers starting from the third. The bottom two layers were non-residual, allowing the model to learn its own low-level representations freely; residual connections above stabilized gradient flow through the remaining 6 layers. The system also introduced model parallelism across GPUs, splitting the 8-layer stack across 8 devices.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        GNMT was deployed to 100+ language pairs serving billions of users, marking the first time deep learning replaced a production statistical MT system at global scale. Its residual RNN design — layers 3–8 connected by skip paths — demonstrated that borrowing from the computer vision playbook (ResNets) was the key to pushing recurrent depth beyond 4 layers. The 8-layer ceiling GNMT hit also signaled that pure recurrent depth was approaching its limit, motivating the parallel architecture research that followed.
                    </div>
                    <div className="ch-tl-impact">Impact: First production deployment of deep RNNs at global scale; demonstrated residual connections as the path to 8-layer RNNs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 – 2017</div>
                    <div className="ch-tl-section-label">Ceiling</div>
                    <div className="ch-tl-title">The Depth Ceiling and the Rise of Attention-Only Models</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Empirically, the NLP community found that beyond 4–8 recurrent layers, further depth provided diminishing returns and increasing training instability. The representational bottleneck had shifted from depth to the sequential nature of the computation itself. Wider hidden states and attention mechanisms provided more gains than deeper stacks.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Multiple groups simultaneously discovered that if you add a feedforward sublayer after each recurrent layer — creating a "recurrent-feedforward" hybrid — you can get much of the capacity of depth without the compounding gradient problems. This insight, combined with the success of attention mechanisms, led directly to the question: if feedforward layers are doing most of the heavy lifting, do we need recurrence at all? Vaswani et al. answered this in June 2017 with the Transformer.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The depth ceiling of deep RNNs made the Transformer's abandonment of recurrence appear not as a radical departure but as the logical next step. Every team working on deep RNNs had independently discovered that depth was not the bottleneck — the sequential dependency was. Understanding this ceiling is what makes the Transformer's design choices comprehensible.
                    </div>
                    <div className="ch-tl-impact">Impact: Led to hybrid architectures and eventually the Transformer, which separates representational depth from sequential processing</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Key insight:</strong> In CNNs, depth creates spatial hierarchies
                (edges &#8594; textures &#8594; objects). In RNNs, depth creates <em>temporal</em> hierarchies
                (phonemes &#8594; syllables &#8594; words &#8594; phrases). But because each layer must wait for
                the layer below at every time step, deep RNNs are exponentially slower to train
                than equally deep CNNs. The solution — residual connections, variational dropout,
                and ultimately the Transformer — each addressed a different facet of this problem.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 15 gave neural networks attention — the ability to focus on any part of the input at will. Chapter 16 shows the next frontiers that researchers explored before Transformers arrived: stacking RNNs into deep towers, teaching networks to point back at and copy words from their input (pointer networks), and building WaveNet — a network that generates realistic speech one tiny audio sample at a time.
            </p>
            <h2>A tower of whispering rows</h2>

            <Analogy label="One Row (Single-Layer RNN)">
                Imagine a single row of 50 people. The first person reads a word, thinks about it,
                whispers a summary to the next person, who whispers to the next, and so on. By
                person 50, the summary has been passed through 50 minds. This is a single-layer
                RNN — one chain of thought running through time.
                <br /><br />
                The summary that reaches person 50 knows about each word, but it's a single
                blended memory — it doesn't separately remember the grammar and the meaning
                and the topic all at once.
            </Analogy>

            <Analogy label="Two Rows (2-Layer Deep RNN)">
                Now add a second row of 50 people standing behind the first row. Each person in
                the back row listens to the whisper from the person directly in front of them
                (same time step, lower layer), thinks about it, and whispers to their neighbor
                in the back row (next time step, same layer).
                <br /><br />
                The front row learns simple patterns: "this word is a verb." The back row learns
                complex patterns built from the front row: "this verb follows a subject, so we're
                in a complete sentence." Each row sees the sequence at a different level of
                abstraction. This is exactly what a 2-layer RNN does — layer 1 processes raw
                words, layer 2 processes the patterns in the patterns.
            </Analogy>

            <Analogy label="Why Too Many Rows Breaks">
                Adding a third, fourth, or fifth row sounds good, but there's a problem. By the
                time the whisper reaches the fifth row, it has been passed through so many minds
                that small errors have compounded into nonsense. It's like the telephone game:
                after 5 rows × 50 people, the original message is completely garbled.
                <br /><br />
                This is why deep RNNs are harder to train than deep CNNs — the telephone game runs
                both across time <em>and</em> across layers. Every new layer multiplies the chance
                of a message getting mangled. Special tricks — like "residual connections" that let
                the original whisper travel on a shortcut wire — are needed to fix this.
            </Analogy>

            <Analogy label="Residual Connections — The Shortcut Wire">
                Imagine each row now also has a direct wire that carries the original whisper
                from row 1 to row 4, bypassing rows 2 and 3. Each middle row still does its
                work, but it only needs to figure out the <em>difference</em> from the original
                message — not reconstruct it from scratch.
                <br /><br />
                Google's 8-layer GNMT system (2016) used exactly this trick. Without the shortcut
                wires, 8 layers of telephone-game whispering would have destroyed every signal.
                With them, the message survived intact through all 8 levels.
            </Analogy>

            <Analogy label="Variational Dropout — Keeping the Same Earplugs">
                Another trick researchers found: randomly block some channels in each row by
                giving certain people earplugs — so they can't hear the whisper and pass it on.
                This forces the other people to learn to carry the message without always relying
                on the same helpers.
                <br /><br />
                The key insight from Gal and Ghahramani (2016): use the <em>same</em> earplugs
                across all 50 positions in a row. If person 7 wears earplugs for this sentence,
                they wear them for every word in the sentence. This "variational dropout" lets
                the shortcut signal survive even when some channels are blocked.
            </Analogy>

            <Analogy label="The Ceiling — Why 4 Rows is Usually Enough">
                Researchers tested 1, 2, 3, 4, 6, 8 rows. The jump from 1 to 2 rows was huge.
                From 2 to 4, still big. From 4 to 6, smaller. From 6 to 8 with residual
                connections, a little more. Beyond 8 rows? Barely any improvement — and much
                harder to train. It's as if the telephone game hits a natural limit: once the
                message has been processed at enough levels of abstraction, adding more levels
                just creates more noise without adding understanding.
                <br /><br />
                This ceiling — the 4-layer rule of thumb — told researchers that the <em>serial
                nature</em> of recurrence was the real problem, not the lack of layers. That
                realization is what made the Transformer possible.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Stacking RNNs and the hierarchy of time</h2>

            <h3>Architecture: The 2-D Grid of Computation</h3>
            <p>
                A deep RNN stacks L recurrent layers. The output of layer &#8467; at time t becomes the
                input to layer &#8467;+1 at the same time t. Each layer has its own recurrence across
                time, creating a grid of computation with T columns (time steps) and L rows (layers):
            </p>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = f\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right)" />
            <p>
                where h<sub>t</sub><sup>(0)</sup> = x<sub>t</sub> (the input) and h<sub>t</sub><sup>(&#8467;)</sup>
                is the hidden state of layer &#8467; at time t. Each layer has its own weight matrices W<sup>(&#8467;)</sup>
                and U<sup>(&#8467;)</sup>, independently learned.
            </p>

            <h3>Temporal Hierarchies</h3>
            <p>
                Lower layers tend to capture short-range patterns (individual characters, phonemes,
                word fragments) because they directly receive the raw input. Higher layers capture
                longer-range patterns (morphemes, words, phrases) because they receive pre-processed
                representations from below. This is analogous to how early CNN layers detect edges
                and late layers detect objects — but in the temporal domain rather than the spatial one.
                Speech recognition experiments by Graves (2013) confirmed this empirically: layer 1
                activations correlated with phoneme identity, while layer 3–4 activations correlated
                with word boundaries and prosodic structure.
            </p>

            <h3>Training Challenges: Two Independent Gradient Problems</h3>
            <ul>
                <li><strong>Temporal gradient explosion/vanishing:</strong> Within each layer, gradients flow backward through T time steps via products of the recurrent Jacobian. LSTM gating partially solves this within a single layer.</li>
                <li><strong>Spatial gradient vanishing across layers:</strong> Gradients flowing from layer L back to layer 1 pass through L matrix multiplications at each time step. Even with LSTM gating, this spatial path can cause vanishing because each layer's weight matrix has independent eigenvalues.</li>
                <li><strong>Quadratic sequential dependency:</strong> Layer &#8467; at time t must wait for both layer &#8467;−1 at time t AND layer &#8467; at time t−1. Training a 4-layer RNN on a sequence of length 100 requires 400 sequential matrix multiplications — no parallelism is possible within a single training example.</li>
            </ul>

            <h3>Mitigations That Made Deep RNNs Practical</h3>
            <ul>
                <li><strong>Gradient clipping (Pascanu 2013):</strong> Cap the global gradient norm before the update step. If &#8214;g&#8214; &gt; threshold, scale g &#8592; g · threshold / &#8214;g&#8214;.</li>
                <li><strong>Variational dropout (Gal 2016):</strong> Sample one binary mask per layer per sequence; apply it identically across all time steps. This preserves recurrent gradient paths while regularizing feedforward connections.</li>
                <li><strong>Residual connections (Wu et al. 2016):</strong> Add skip connections between pairs of layers, so h<sub>t</sub><sup>(&#8467;)</sup> = f(…) + h<sub>t</sub><sup>(&#8467;−1)</sup>. The identity shortcut guarantees gradient magnitude &#8805; 1 even if the learned component vanishes.</li>
                <li><strong>Recurrent batch normalization (Cooijmans 2016):</strong> Normalize pre-activations per time step using separate running statistics, preventing activation drift across deep layers.</li>
            </ul>

            <h3>The Depth vs. Width Tradeoff</h3>
            <p>
                Given a fixed parameter budget, should you use 2 layers of width 512, or 4 layers
                of width 256? Empirically, the community found that 2–3 layers of full width
                outperformed 4+ layers of reduced width for most NLP tasks. Only with residual
                connections (as in GNMT) did 8-layer RNNs outperform 4-layer ones — and even
                then, the margin was small. This tradeoff contrasts sharply with CNNs, where depth
                consistently beats width up to hundreds of layers.
            </p>

            <h3>The 4-Layer Rule of Thumb</h3>
            <p>
                After hundreds of experiments across multiple research groups, a practical rule
                emerged: start with 1–2 recurrent layers, then add a third if validation loss
                clearly improves. More than 4 pure recurrent layers rarely help and often hurt.
                GNMT's 8 layers worked only because residual connections converted the problem
                from "8 recurrent layers" to effectively "2 recurrent layers + 6 nearly-linear
                layers."
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why Transformers replaced deep RNNs:</strong> In a Transformer, all
                depth is purely feedforward across layers. Time-dependence is handled by
                self-attention — a single large matrix operation, computable in O(n²d) total
                work with no sequential dependency. There is no recurrent matrix product across
                time, so gradient flow is O(1) per layer rather than O(T). This is why
                Transformers can be trained with 24, 48, or even 96 layers — something
                impossible for pure RNNs at any commercially viable training budget.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations · gradient analysis</span>
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
            <h2>Formal definition and gradient analysis through depth</h2>

            <DefBlock label="Deep RNN — Formal Specification">
                L layers. Layer &#8467; hidden state h<sub>t</sub><sup>(&#8467;)</sup> &#8712; &#8477;<sup>n&#8467;</sup>.
                Parameters per layer: W<sup>(&#8467;)</sup> &#8712; &#8477;<sup>n&#8467;&#215;n&#8467;&#8722;1</sup>, U<sup>(&#8467;)</sup> &#8712; &#8477;<sup>n&#8467;&#215;n&#8467;</sup>,
                b<sup>(&#8467;)</sup> &#8712; &#8477;<sup>n&#8467;</sup>. Input: h<sub>t</sub><sup>(0)</sup> = x<sub>t</sub> &#8712; &#8477;<sup>d</sup>.
                Total parameters: &#8721;<sub>&#8467;=1</sub><sup>L</sup> (n<sub>&#8467;</sub>·n<sub>&#8467;&#8722;1</sub> + n<sub>&#8467;</sub>&#178; + n<sub>&#8467;</sub>).
            </DefBlock>

            <h3>Forward Pass</h3>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = \sigma\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right) \qquad \ell = 1, \dots, L" />

            <h3>Gradient Through Depth and Time</h3>
            <p>
                Consider the gradient of the loss at time T with respect to parameters in layer 1.
                It must flow backward through all L layers and all T time steps. Define the local
                Jacobian at layer &#8467;, time t:
            </p>
            <MathBlock tex="\mathbf{J}_t^{(\ell)} = \text{diag}\bigl(\sigma'(\mathbf{z}_t^{(\ell)})\bigr) \mathbf{U}^{(\ell)}" />
            <p>
                where z<sub>t</sub><sup>(&#8467;)</sup> = W<sup>(&#8467;)</sup>h<sub>t</sub><sup>(&#8467;&#8722;1)</sup> + U<sup>(&#8467;)</sup>h<sub>t&#8722;1</sub><sup>(&#8467;)</sup> + b<sup>(&#8467;)</sup>.
                The full gradient from layer L at time T back to layer 1 at time 1 involves a
                product of L&#215;T such Jacobian matrices:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_1^{(1)}} = \frac{\partial \mathcal{L}}{\partial \mathbf{h}_T^{(L)}} \cdot \prod_{t=T}^{2} \mathbf{J}_t^{(L)} \cdots \prod_{t=T}^{2} \mathbf{J}_t^{(1)}" />
            <p>
                If the spectral radius &#961;(J) &gt; 1, this product explodes exponentially in L&#215;T.
                If &#961;(J) &lt; 1, it vanishes. Even with LSTM gating (which bounds the product across
                time within each layer), the product <em>across layers</em> can still explode or
                vanish because each layer has independent recurrent weights.
            </p>

            <h3>Variational Dropout — Formal Specification</h3>
            <p>
                Standard dropout samples a fresh mask &#949;<sub>t</sub> at every time step, which
                breaks the gradient path through the recurrence. Variational dropout samples one
                mask per sequence per layer:
            </p>
            <MathBlock tex="\tilde{\mathbf{h}}_t^{(\ell)} = \mathbf{h}_t^{(\ell)} \odot \boldsymbol{\epsilon}^{(\ell)}, \quad \boldsymbol{\epsilon}^{(\ell)} \sim \text{Bernoulli}(1 - p)^{n_\ell}" />
            <p>
                The same &#949;<sup>(&#8467;)</sup> is applied at every t. This preserves the recurrent
                gradient path (the mask is constant, so &#8706;h<sub>t</sub>/&#8706;h<sub>t&#8722;1</sub> is
                unaffected by the mask choice) while providing effective regularization across layers.
            </p>

            <h3>Residual Connections in Deep RNNs</h3>
            <p>
                Adding residual connections between layers changes the Jacobian:
            </p>
            <MathBlock tex="\mathbf{h}_t^{(\ell)} = \sigma\!\left(\mathbf{W}^{(\ell)} \mathbf{h}_t^{(\ell-1)} + \mathbf{U}^{(\ell)} \mathbf{h}_{t-1}^{(\ell)} + \mathbf{b}^{(\ell)}\right) + \mathbf{h}_t^{(\ell-1)}" />
            <p>
                The layer-to-layer Jacobian now includes an identity shortcut:
            </p>
            <MathBlock tex="\frac{\partial \mathbf{h}_t^{(\ell)}}{\partial \mathbf{h}_t^{(\ell-1)}} = \mathbf{J}_t^{(\ell)} + \mathbf{I}" />
            <p>
                This guarantees that even if J<sub>t</sub><sup>(&#8467;)</sup> shrinks toward zero, the
                identity term preserves gradient magnitude. Residual deep RNNs can therefore be
                trained with 6–8 layers, whereas plain deep RNNs struggle reliably beyond 3.
            </p>

            <h3>Computational Complexity</h3>
            <p>
                Training a single-layer RNN on a sequence of length T costs O(T&#183;d&#178;) in time
                and O(T&#183;d) in memory (for BPTT). A deep RNN with L layers costs O(L&#183;T&#183;d&#178;)
                in time but only O(L&#183;d) in memory if gradients are computed layer by layer.
                The L&#183;T multiplicative factor is why 8-layer RNNs on sequences of length 500
                required the model parallelism across 8 GPUs that GNMT used.
            </p>

            <div className="ch-callout">
                <strong>The decisive comparison:</strong> In a Transformer of depth L, the
                gradient from layer L back to layer 1 passes through L residual additions —
                not L matrix products. The gradient norm is bounded below by 1 regardless of
                depth. This is why Transformers can be trained reliably at L = 24, 48, or 96
                where recurrent networks failed at L = 8.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Deep RNN — NumPy ──────────────────────────────────────────────────────────
class DeepRNN:
    """L-layer stacked RNN with tanh and optional residual connections."""
    def __init__(self, input_dim, hidden_dims, residual=False, seed=42):
        rng = np.random.default_rng(seed)
        self.layers = len(hidden_dims)
        self.residual = residual
        dims = [input_dim] + list(hidden_dims)
        self.params = []
        for i in range(self.layers):
            scale = 0.01
            self.params.append({
                'W': rng.normal(0, scale, (dims[i+1], dims[i])),
                'U': rng.normal(0, scale, (dims[i+1], dims[i+1])),
                'b': np.zeros(dims[i+1]),
            })
        self.dims = dims

    def forward(self, X):
        """X: (T, input_dim) -> list of H arrays, one per layer"""
        T = X.shape[0]
        H_all = []
        h_prev_layer = X
        for l in range(self.layers):
            H = np.zeros((T, self.dims[l+1]))
            h = np.zeros(self.dims[l+1])
            p = self.params[l]
            for t in range(T):
                z = p['W'] @ h_prev_layer[t] + p['U'] @ h + p['b']
                h_new = np.tanh(z)
                # Residual: add input if dimensions match
                if self.residual and self.dims[l] == self.dims[l+1]:
                    h_new = h_new + h_prev_layer[t]
                h = h_new
                H[t] = h
            H_all.append(H)
            h_prev_layer = H
        return H_all


# ── Gradient norm analysis across layers ─────────────────────────────────────
def gradient_norm_estimate(rnn, X, n_samples=5):
    """
    Approximate how gradient magnitude changes through layers.
    Uses finite differences on random perturbations.
    """
    norms = []
    base = rnn.forward(X)
    for l in range(rnn.layers):
        eps = 1e-4
        delta = np.zeros_like(rnn.params[l]['U'])
        delta[0, 0] = eps
        rnn.params[l]['U'][0, 0] += eps
        perturbed = rnn.forward(X)
        rnn.params[l]['U'][0, 0] -= eps
        # Finite difference approximation of output sensitivity
        diff = perturbed[-1][-1] - base[-1][-1]
        norms.append(np.linalg.norm(diff) / eps)
    return norms


# ── Demo ──────────────────────────────────────────────────────────────────────
T, input_dim = 20, 8
hidden_dims   = [16, 16, 16, 16]   # 4 layers, matching GNMT philosophy
rng = np.random.default_rng(9)
X = rng.normal(0, 0.5, (T, input_dim))

print("Deep RNN Demo")
print("=" * 50)
print(f"Layers          : {len(hidden_dims)}")
print(f"Hidden dims     : {hidden_dims}")
print(f"Sequence length : {T}")
print()

for use_residual in [False, True]:
    model = DeepRNN(input_dim, hidden_dims, residual=use_residual, seed=42)
    H_all = model.forward(X)
    label = "Residual" if use_residual else "Plain"
    print(f"Layer output norms ({label} deep RNN):")
    for l, H in enumerate(H_all):
        avg_norm = np.mean([np.linalg.norm(H[t]) for t in range(T)])
        print(f"  Layer {l+1}: avg ||h_t|| = {avg_norm:.4f}")
    print()
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a multi-layer stacked RNN with optional residual
                connections. The demo compares hidden state norms across a 4-layer plain
                deep RNN vs. a 4-layer residual RNN, illustrating how residual connections
                stabilize the signal through depth.
            </p>
            <CodeBlock code={PY_CODE} filename="deep_rnn.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const DEEP_RNNS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
