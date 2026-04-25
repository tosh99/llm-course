import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Speeding up the inherently sequential</h2>
            <p>
                RNNs process sequences one time step at a time — h<sub>t</sub> depends on h<sub>t-1</sub>,
                so step t cannot begin until step t&#8722;1 finishes. This serial dependency makes RNNs
                notoriously difficult to parallelize on modern hardware designed for matrix
                multiplication. Yet the demand for faster training and longer sequences drove
                researchers to find clever ways to introduce parallelism into recurrent models.
                The search ultimately failed to save recurrence — but it revealed the mathematical
                structures that make modern linear recurrences (S4, Mamba) possible.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1990s</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">The Inherent Serial Bottleneck</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        From Elman (1990) through LSTM (1997), RNNs were trained on CPUs with
                        single sequences. The unrolled computation graph is a long chain —
                        inherently sequential, inherently slow. No one worried much because
                        datasets were small and sequences were short (hundreds of time steps).
                        But by 2012, when deep learning moved to GPUs with thousands of parallel
                        cores, RNNs became a glaring bottleneck: a GPU that could multiply a
                        4096×4096 matrix in milliseconds had to wait for 500 sequential RNN steps.
                        <div className="ch-tl-section-label">What was introduced</div>
                        The community recognized that the sequential dependency h<sub>t</sub> = f(h<sub>t-1</sub>, x<sub>t</sub>)
                        was not an implementation choice but a mathematical constraint. Any model
                        that carries state across time in a nonlinear way must compute step t
                        after step t&#8722;1. The first response was not to fight the dependency but
                        to exploit batch parallelism: process many independent sequences simultaneously.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Establishing the seriality problem precisely — distinguishing "serial within
                        a sequence" from "parallel across sequences" — was essential for framing
                        the subsequent research. It clarified that data parallelism (cuDNN batching)
                        and model parallelism (multi-GPU) were engineering solutions to throughput,
                        not algorithmic solutions to latency. The real challenge was reducing the
                        O(T) sequential depth to something smaller.
                    </div>
                    <div className="ch-tl-impact">Impact: Established RNNs as the "slow but stateful" model class and defined the parallelism problem precisely</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014 – 2015</div>
                    <div className="ch-tl-section-label">Engineering</div>
                    <div className="ch-tl-title">cuDNN Batched RNN Kernels — NVIDIA</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Training NLP models required processing thousands of sequences per training
                        step, but naive PyTorch RNN loops issued one CUDA kernel per time step per
                        sequence — thousands of small kernels that left most of the GPU idle. The
                        overhead of kernel launches dominated the actual computation.
                        <div className="ch-tl-section-label">What was introduced</div>
                        NVIDIA's cuDNN 5 introduced optimized batched RNN kernels that fused all
                        four gate matrix multiplications (i, f, g, o in LSTM) into a single large
                        GEMM call per time step. For a batch of N sequences, all N hidden states
                        could be updated simultaneously as one matrix-matrix multiplication. This
                        gave 5–10&#215; speedups over loop-based RNN implementations without any
                        algorithmic change.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        cuDNN batching made large-scale RNN training feasible on a single GPU,
                        enabling the Seq2Seq and attention results of 2014–2015. But it also
                        exposed the ceiling: even with perfect hardware utilization, an RNN on a
                        sequence of T = 1000 still required 1000 sequential batched GEMM calls.
                        No amount of engineering could reduce this below O(T).
                    </div>
                    <div className="ch-tl-impact">Impact: Made RNNs practical for large-scale training via data parallelism and hardware fusion</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Algorithm</div>
                    <div className="ch-tl-title">Quasi-Recurrent Neural Networks — Bradbury et al.</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        If the O(T) sequential depth was irreducible for nonlinear recurrences,
                        could the computation be factored so that the expensive, GPU-unfriendly
                        part was small and the cheap, parallelizable part was large? LSTM's gate
                        computation (four affine transforms of both x<sub>t</sub> and h<sub>t&#8722;1</sub>)
                        was the bottleneck — but not all of it needed to be sequential.
                        <div className="ch-tl-section-label">What was introduced</div>
                        James Bradbury and colleagues proposed Quasi-Recurrent Neural Networks (QRNNs),
                        which decouple the LSTM computation into two phases. Phase 1: compute
                        candidate activations and gate values for the <em>entire sequence</em> using
                        1D convolutions — a fully parallelizable operation. Phase 2: apply a simple
                        element-wise pooling recurrence c<sub>t</sub> = f<sub>t</sub> &#8857; c<sub>t&#8722;1</sub> + (1&#8722;f<sub>t</sub>) &#8857; z<sub>t</sub>,
                        which is a linear recurrence solvable in O(T) time but with very small
                        constant factors. QRNNs achieved 10&#215; training speedups over LSTMs on
                        classification and machine translation.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        QRNNs proved that factoring expensive nonlinear computation (the gate
                        interactions) from cheap linear recurrence (the state update) was a viable
                        architectural strategy. The QRNN pooling operation — a linear scalar
                        recurrence — is exactly the class of recurrence that parallel scan can
                        accelerate. This connection set the stage for the Simple Recurrent Unit
                        and eventually for structured state space models.
                    </div>
                    <div className="ch-tl-impact">Impact: First algorithmic factorization of RNN computation into a parallelizable phase and a lightweight sequential phase</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Hardware-Efficient RNN</div>
                    <div className="ch-tl-title">Simple Recurrent Unit — Lei et al.</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        QRNNs were fast in theory, but their convolution phase required careful
                        kernel-size tuning and did not interact with the GPU memory hierarchy as
                        efficiently as a well-fused LSTM kernel. Practitioners wanted an architecture
                        that was not just algorithmically parallel but also hardware-efficient:
                        cache-friendly, vectorization-friendly, and compilable to a single CUDA
                        kernel.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Tao Lei and colleagues at MIT proposed the Simple Recurrent Unit (SRU),
                        which eliminated the dependency on the previous hidden state in gate
                        computation entirely. SRU gates depend only on x<sub>t</sub> (not h<sub>t&#8722;1</sub>),
                        making all gate computations for the full sequence computable as a single
                        large matrix multiplication. Only the scalar highway recurrence — c<sub>t</sub> = f<sub>t</sub> &#8857; c<sub>t&#8722;1</sub> + (1&#8722;f<sub>t</sub>) &#8857; &#776;x<sub>t</sub> —
                        required sequential computation. SRU trained 5–10&#215; faster than LSTM
                        with competitive accuracy on language modeling and classification.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        SRU demonstrated that much of LSTM's expressivity came from the
                        input-dependent gating (x<sub>t</sub> → gates), not from the
                        hidden-state-dependent gating (h<sub>t&#8722;1</sub> → gates). This
                        observation — that selective state transitions can be fast if you
                        separate input-processing from state-updating — became central to the
                        design of Mamba (2023), which uses SRU-like input-dependent selection
                        with a structured linear state transition.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed that hardware-efficient linear recurrences could match LSTM quality while being 5–10&#215; faster</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Motivation</div>
                    <div className="ch-tl-title">The Parallelism Paradox and the Path to Transformers</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        QRNN and SRU could parallelize <em>training</em> by replacing the expensive
                        sequential gate computation with convolutions or matrix multiplications. But
                        <em>inference</em> remained irreducibly sequential: to generate token t+1,
                        you still had to finish token t first. For autoregressive generation — the
                        core use case for language models — the speedups from training parallelism
                        provided no benefit.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Vaswani et al. (2017) took the radical position that the correct response
                        to the parallelism problem was not to accelerate recurrence but to eliminate
                        it. Self-attention computes all output positions simultaneously via a single
                        batched matrix multiplication, with no sequential dependency. The cost is
                        O(n²d) memory — but training parallelism across all n positions means that
                        a 512-token sequence trains as fast as a 2-token sequence on sufficiently
                        wide hardware.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The Transformer's parallel training turned the data-efficiency problem into
                        a compute problem: instead of waiting for T sequential steps, you could
                        throw more GPUs at larger batches. This unlocked training on billions of
                        tokens within weeks rather than months, enabling GPT and BERT's large-scale
                        pre-training. QRNN and SRU solved the wrong half of the problem — training
                        speed — while the Transformer solved the right half: the O(T) sequential
                        depth itself.
                    </div>
                    <div className="ch-tl-impact">Impact: Established that eliminating recurrence was superior to accelerating it, motivating the Transformer's design</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – 2023</div>
                    <div className="ch-tl-section-label">Return</div>
                    <div className="ch-tl-title">Parallel Prefix Scan and State Space Models — S4, Mamba</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Transformers excel at training but their O(n²) attention memory made
                        very long sequences (books, genomes, audio) intractable. Researchers
                        returned to linear recurrences, now asking: can we train in parallel
                        (like a Transformer) while running inference in O(1) per step (like an RNN)?
                        <div className="ch-tl-section-label">What was introduced</div>
                        Albert Gu and colleagues introduced Structured State Space Models (S4),
                        which use a linear time-invariant state transition A that can be precomputed
                        as a global convolution kernel. Training uses FFT-based convolution — O(T log T),
                        fully parallel. Inference uses the recurrent form — O(1) per step. Mamba (2023)
                        extended S4 with input-dependent selection, recovering LSTM's selectivity while
                        retaining parallelizability via a specialized hardware-aware scan algorithm.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        S4 and Mamba completed the journey begun by QRNN: fully parallel training
                        with efficient sequential inference, no quadratic memory. They are the
                        modern successors to everything this topic covers — QRNN, SRU, parallel
                        scan — assembled into a coherent architecture that rivals Transformers
                        on long-sequence tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: SSMs are the modern resolution of the parallelism paradox — training speed of a Transformer, inference memory of an RNN</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The fundamental tension:</strong> Nonlinear recurrence across time is
                what gives RNNs their expressive power — the ability to selectively remember and
                forget. But nonlinearity destroys parallelizability. Every technique for RNN
                parallelism (QRNN, SRU, SSM) makes some sacrifice in nonlinearity to gain
                speed. The Transformer sidesteps this entirely by making time-dependence explicit
                through positional embeddings and attention, with no recurrence at all.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>An assembly line with clever prep work</h2>

            <Analogy label="The Serial Factory (Vanilla RNN)">
                Imagine a factory with 100 work stations in a row. Each station can only start
                after the previous station finishes. Station 1 wraps a box. Station 2 labels it.
                Station 3 tapes it shut. If each step takes 1 minute, the whole line takes 100 minutes,
                no matter how many workers you hire. You can't make any single box faster because
                each step literally requires the previous step to be done first.
                <br /><br />
                This is exactly how an RNN works. Step t cannot begin until step t&#8722;1 finishes.
                No matter how many GPUs you have, the sequence must be processed one step at a time.
            </Analogy>

            <Analogy label="The Batch Factory (Mini-Batch Parallelism)">
                Now imagine you have 64 identical assembly lines side by side. Each line still
                takes 100 minutes to make one box, but you're making 64 boxes at once. Your
                throughput is 64&#215; higher, even though no individual box is made faster.
                <br /><br />
                This is mini-batch training. You process 64 sequences simultaneously, which
                lets the GPU stay busy doing matrix multiplications on all 64 at once. The cuDNN
                library does this automatically. But if you need to process a single long sequence
                quickly — say, for real-time speech recognition — the batch trick doesn't help.
            </Analogy>

            <Analogy label="The Prep Station (QRNN / SRU)">
                A clever engineer redesigns the factory. Before the assembly line starts, a team
                does all the preparation work — sorting parts, pre-measuring, cutting materials —
                for all 100 steps at once. Then the actual assembly line only has to do the
                simple "assemble the pre-made parts" step at each station.
                <br /><br />
                Quasi-RNNs (QRNN) and Simple Recurrent Units (SRU) work exactly like this. They
                separate the expensive part (figuring out what to remember and forget at each
                step) from the cheap part (actually updating the memory). The expensive part
                can be done for all steps at once using convolutions. Only the cheap sequential
                part must go step by step — and it's just a simple multiply-add.
            </Analogy>

            <Analogy label="The Parallel Sorter (Parallel Scan)">
                Imagine you need to compute a running total of 16 numbers: 1, 2, 3, ..., 16.
                Sequentially: add them one by one — 16 steps. But with a tree: in the first
                round, add pairs (1+2, 3+4, 5+6, ...); in the second round, add those results;
                in the third round, add again. After just 4 rounds, every cumulative total is known.
                <br /><br />
                This "parallel scan" or "prefix sum" algorithm reduces the sequential depth
                from O(T) to O(log T). It works whenever the operation is just multiply-and-add
                — which is exactly what SRU's memory update does. That's why SRU can train
                in parallel even though it looks like a recurrence.
            </Analogy>

            <Analogy label="The Parallelism Paradox">
                Here's the cruel irony: QRNN and SRU could train much faster than LSTMs by
                parallelizing the training computation. But when it came time to actually
                generate text — one word at a time — they were just as slow as regular RNNs.
                The speedup only applied to training, not to the final use case.
                <br /><br />
                The Transformer solved this paradox differently: by removing recurrence entirely.
                During training, all positions are processed simultaneously. During inference,
                you still generate one token at a time — but the attention computation for
                each new token is fast because it just looks up a precomputed table (the
                KV cache). No sequential hidden state to drag around.
            </Analogy>

            <Analogy label="State Space Models — The Best of Both Worlds">
                Years later, researchers found a mathematical trick that QRNN had hinted at.
                If you design the recurrence to be perfectly linear (no nonlinear gates mixing
                h<sub>t&#8722;1</sub> and x<sub>t</sub> together), then the entire sequence can
                be computed as a single convolution during training — and as a single step
                during inference.
                <br /><br />
                These are called State Space Models (S4, Mamba). They train as fast as
                Transformers and run as efficiently as RNNs. They're the modern answer to the
                question QRNN first asked: "Can recurrence be parallelized?"
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Batching, scanning, and the QRNN factorization</h2>

            <h3>Minibatch Parallelism (Data Parallelism)</h3>
            <p>
                The simplest form of parallelism processes N sequences simultaneously. At each
                time step t, stack all N inputs into X<sub>t</sub> &#8712; &#8477;<sup>N&#215;d</sup> and
                all N hidden states into H<sub>t</sub> &#8712; &#8477;<sup>N&#215;n</sup>, then compute:
            </p>
            <MathBlock tex="\mathbf{H}_t = f\!\left(\mathbf{H}_{t-1} \mathbf{U}^\top + \mathbf{X}_t \mathbf{W}^\top + \mathbf{b}\right)" />
            <p>
                The matrix multiplication H<sub>t&#8722;1</sub>U<sup>T</sup> is a single large GEMM call,
                fully utilizing the GPU. The speedup is roughly N&#215; in throughput, but the
                <em> per-sequence</em> latency remains O(T). cuDNN fuses all gate computations
                into one call per time step, reducing kernel launch overhead significantly.
            </p>

            <h3>Quasi-Recurrent Networks (QRNN) Factorization</h3>
            <p>
                QRNNs factor the RNN computation into two phases:
            </p>
            <ol>
                <li>
                    <strong>Convolutional phase (parallel across all T time steps):</strong> For
                    kernel size k, compute candidate z, forget gate f, and output gate o for the
                    entire sequence simultaneously using 1D convolutions with causal masking.
                    Cost: O(T&#183;k&#183;d) with no sequential depth.
                </li>
                <li>
                    <strong>Pool phase (sequential but cheap):</strong> Apply a cumulative pooling
                    operation: c<sub>t</sub> = f<sub>t</sub> &#8857; c<sub>t&#8722;1</sub> + (1 &#8722; f<sub>t</sub>) &#8857; z<sub>t</sub>,
                    where f<sub>t</sub> is the forget gate and z<sub>t</sub> is the candidate.
                    This is a linear scalar recurrence — no interaction between x<sub>t</sub>
                    and h<sub>t&#8722;1</sub> inside a nonlinear function.
                </li>
            </ol>
            <p>
                The pool phase is a linear recurrence of the form h<sub>t</sub> = a<sub>t</sub> &#8857; h<sub>t&#8722;1</sub> + b<sub>t</sub>,
                solvable by parallel scan in O(log T) parallel depth instead of O(T).
            </p>

            <h3>Parallel Scan (Prefix Sum)</h3>
            <p>
                For a linear recurrence h<sub>t</sub> = a<sub>t</sub> &#8857; h<sub>t&#8722;1</sub> + b<sub>t</sub>
                with h<sub>0</sub> = 0, the closed form is:
            </p>
            <MathBlock tex="h_T = \sum_{j=1}^{T} \left(\prod_{k=j+1}^{T} a_k\right) b_j" />
            <p>
                This can be computed in O(log T) parallel steps using a tree reduction (Blelloch scan).
                Each "up-sweep" combines adjacent pairs; each "down-sweep" distributes prefix
                results. Total work is O(T) but sequential depth is only O(log T).
            </p>

            <h3>Simple Recurrent Unit (SRU)</h3>
            <p>
                SRU removes the dependency on h<sub>t&#8722;1</sub> from gate computation:
            </p>
            <MathBlock tex="\tilde{x}_t = \mathbf{W} x_t,\quad f_t = \sigma(W_f x_t + b_f),\quad r_t = \sigma(W_r x_t + b_r)" />
            <MathBlock tex="c_t = f_t \odot c_{t-1} + (1 - f_t) \odot \tilde{x}_t,\quad h_t = r_t \odot g(c_t) + (1 - r_t) \odot x_t" />
            <p>
                All gate values (f<sub>t</sub>, r<sub>t</sub>, &#x1D7DC;<sub>t</sub>) depend only on x<sub>t</sub>,
                not on h<sub>t&#8722;1</sub>. This means the entire matrix multiplication Wx can be
                computed for the full sequence in one large GEMM call. Only the scalar update
                c<sub>t</sub> = f<sub>t</sub>&#183;c<sub>t&#8722;1</sub> + (1&#8722;f<sub>t</sub>)&#183;&#x1D7DC;<sub>t</sub> remains sequential —
                and it involves no matrix multiplications, just element-wise operations.
            </p>

            <h3>The Parallelism Paradox</h3>
            <p>
                QRNN and SRU achieved 5–10&#215; training speedups over LSTMs. But autoregressive
                inference — generating one token at a time — remained O(T) sequential regardless.
                The Transformer's attention mechanism is also O(T) during inference (each new
                token attends to all previous ones), but with a KV-cache the cost per step is
                O(n&#183;d) rather than O(d²), making it faster in practice for common sequence lengths.
                More importantly, Transformer training is O(1) sequential depth — the whole
                reason it could scale to billions of parameters.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why parallel scan doesn't fully solve LSTM:</strong> LSTM and GRU gates
                involve nonlinear interactions between x<sub>t</sub> and h<sub>t&#8722;1</sub> —
                for example, z<sub>t</sub> = tanh(W<sub>z</sub>x<sub>t</sub> + U<sub>z</sub>h<sub>t&#8722;1</sub>).
                The previous state h<sub>t&#8722;1</sub> appears inside a tanh, making the recurrence
                non-linear and non-associative. Parallel scan only applies when the recurrence
                is linear in h<sub>t&#8722;1</sub>. QRNN and SRU work precisely because they eliminate
                the h<sub>t&#8722;1</sub> dependency from the expensive computation.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Associative operators · Blelloch scan · SSM duality</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Parallel scan · QRNN pooling · NumPy</span>
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
            <h2>Associative operators and parallel prefix algorithms</h2>

            <DefBlock label="Parallel Scan — Formal Definition">
                Given a sequence (x<sub>1</sub>, …, x<sub>T</sub>) and an associative binary
                operator &#8853;, the parallel prefix scan computes all partial results
                (x<sub>1</sub>, x<sub>1</sub>&#8853;x<sub>2</sub>, …, x<sub>1</sub>&#8853;…&#8853;x<sub>T</sub>)
                in O(log T) parallel depth and O(T) total work.
                Associativity is required: (a&#8853;b)&#8853;c = a&#8853;(b&#8853;c). It does not require commutativity.
            </DefBlock>

            <h3>Applying Scan to Linear Recurrence</h3>
            <p>
                Consider the linear recurrence:
            </p>
            <MathBlock tex="\mathbf{h}_t = \mathbf{A}_t \mathbf{h}_{t-1} + \mathbf{B}_t \mathbf{x}_t" />
            <p>
                This can be rewritten as an associative operation on tuples (A, B):
            </p>
            <MathBlock tex="(\mathbf{A}_2, \mathbf{B}_2) \circ (\mathbf{A}_1, \mathbf{B}_1) = \bigl(\mathbf{A}_2 \mathbf{A}_1,\; \mathbf{A}_2 \mathbf{B}_1 + \mathbf{B}_2\bigr)" />
            <p>
                The operator &#8728; is associative (matrix multiplication is associative), so
                Blelloch scan applies directly. After the scan, the prefix product
                (A<sub>t</sub>&#8943;A<sub>1</sub>, …) encodes the cumulative state transition,
                and h<sub>t</sub> can be read off in O(1) per position.
            </p>

            <h3>Blelloch Scan Algorithm</h3>
            <p>
                The classic work-efficient parallel prefix scan operates in two phases:
            </p>
            <ul>
                <li><strong>Up-sweep (reduce):</strong> Build a binary tree where each node stores
                the combined value of its subtree. Depth: O(log T). Work: O(T).</li>
                <li><strong>Down-sweep (distribute):</strong> Propagate prefix values from the root
                to leaves, using stored partial results. Depth: O(log T). Work: O(T).</li>
            </ul>
            <p>
                Total sequential depth: O(log T). Total work: O(T). On P processors, this gives
                speedup O(T / log T) in the ideal case — close to linear for large T.
            </p>

            <h3>SSM Training/Inference Duality</h3>
            <p>
                Structured State Space Models (S4) exploit the scan decomposition by designing
                A to be a structured matrix (diagonal plus low-rank) whose powers can be computed
                efficiently. This enables two equivalent computational forms:
            </p>
            <MathBlock tex="\underbrace{y = (K * x)}_{\text{Convolutional — O}(T \log T)\text{, fully parallel}}" />
            <MathBlock tex="\underbrace{h_t = A h_{t-1} + B x_t,\quad y_t = C h_t}_{\text{Recurrent — O}(1) \text{ per step}}" />
            <p>
                where K is the SSM's convolution kernel: K<sub>i</sub> = CA<sup>i</sup>B. During
                training, the convolutional form is used (FFT-based, parallel). During inference,
                the recurrent form is used (one matrix-vector multiply per step).
            </p>

            <h3>Computational Complexity Comparison</h3>
            <table style={{ color: 'var(--ch-text)', borderCollapse: 'collapse', marginBottom: '18px', width: '100%' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Model</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Train Depth</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Infer Memory</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px 12px' }}>LSTM / GRU</td>
                        <td style={{ padding: '8px 12px' }}>O(T) sequential</td>
                        <td style={{ padding: '8px 12px' }}>O(d)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px 12px' }}>QRNN / SRU</td>
                        <td style={{ padding: '8px 12px' }}>O(log T) scan</td>
                        <td style={{ padding: '8px 12px' }}>O(d)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px 12px' }}>Transformer</td>
                        <td style={{ padding: '8px 12px' }}>O(1) parallel</td>
                        <td style={{ padding: '8px 12px' }}>O(T²) KV-cache</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px 12px' }}>S4 / Mamba</td>
                        <td style={{ padding: '8px 12px' }}>O(T log T) conv</td>
                        <td style={{ padding: '8px 12px' }}>O(d)</td>
                    </tr>
                </tbody>
            </table>

            <div className="ch-callout">
                <strong>S4 / Mamba's dual mode:</strong> During training, S4 uses the convolutional
                representation (parallel FFT) because the full sequence is known. During inference,
                it switches to the recurrent representation (single-step update) because only the
                current token is known. This gives Transformer-like training throughput with
                RNN-like inference memory — the best trade-off discovered so far.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Parallel Scan for Linear Recurrence — NumPy ───────────────────────────────
def sequential_scan(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Solve h_t = a_t * h_{t-1} + b_t sequentially. O(T) depth."""
    T = len(a)
    h = np.zeros(T)
    for t in range(T):
        h[t] = a[t] * (h[t-1] if t > 0 else 0.0) + b[t]
    return h


def parallel_scan(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """
    Work-efficient parallel prefix scan for h_t = a_t * h_{t-1} + b_t.
    Operates on tuples (A, B) with associative combine: (A2,B2)o(A1,B1) = (A2*A1, A2*B1+B2).
    O(T) work, O(log T) sequential depth.
    """
    T = len(a)
    if T == 0:
        return np.array([])

    # Pad to next power of 2
    n = 1
    while n < T:
        n *= 2

    A = np.concatenate([a, np.ones(n - T)])
    B = np.concatenate([b, np.zeros(n - T)])

    # Up-sweep: combine pairs bottom-up
    step = 1
    while step < n:
        for i in range(n - 1, 0, -2 * step):
            if i - step >= 0:
                A[i] = A[i] * A[i - step]
                B[i] = A[i] * B[i - step] + B[i]  # note: A[i] already updated above
        step *= 2

    # Reset root (identity element)
    A[n - 1] = 1.0
    B[n - 1] = 0.0

    # Down-sweep: distribute prefix sums
    step = n // 2
    while step >= 1:
        for i in range(n - 1, 0, -2 * step):
            if i - step >= 0:
                save_A = A[i - step]
                save_B = B[i - step]
                A[i - step] = A[i]
                B[i - step] = B[i]
                A[i] = A[i] * save_A
                B[i] = A[i] * save_B + B[i]
        step //= 2

    return B[:T]


# ── QRNN pooling — simulating the sequential pool phase ───────────────────────
def qrnn_pool(z: np.ndarray, f: np.ndarray) -> np.ndarray:
    """
    QRNN fo-pool: c_t = f_t * c_{t-1} + (1 - f_t) * z_t
    z, f: (T,) arrays in [0,1]. Returns c: (T,).
    This is a linear recurrence: a_t = f_t, b_t = (1-f_t)*z_t.
    """
    return sequential_scan(f, (1 - f) * z)


# ── Demo ──────────────────────────────────────────────────────────────────────
T = 16
rng = np.random.default_rng(42)
a = rng.uniform(0.3, 0.9, T)   # forget gates
b = rng.normal(0, 1.0, T)      # candidates

h_seq = sequential_scan(a, b)
h_par = parallel_scan(a, b)

print("Parallel Scan vs. Sequential Demo")
print("=" * 50)
print(f"Sequence length : {T}")
print(f"Max abs error   : {np.max(np.abs(h_seq - h_par)):.2e}")
print()
print("Step-by-step comparison:")
for t in range(T):
    match = "OK" if np.isclose(h_seq[t], h_par[t], atol=1e-10) else "FAIL"
    print(f"  t={t:2d}: seq={h_seq[t]:+.4f}  par={h_par[t]:+.4f}  {match}")

print()
print("QRNN pool (fo-pool) example:")
z = rng.uniform(-1, 1, T)
f = rng.uniform(0.3, 0.9, T)
c = qrnn_pool(z, f)
print(f"  Pool output norm: {np.linalg.norm(c):.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a sequential scan and a parallel prefix scan for the
                linear recurrence h<sub>t</sub> = a<sub>t</sub>&#183;h<sub>t&#8722;1</sub> + b<sub>t</sub>.
                Also includes a QRNN fo-pool to show how the pool phase maps to a linear recurrence.
                The demo verifies numerical equivalence between the sequential and parallel outputs.
            </p>
            <CodeBlock code={PY_CODE} filename="parallel_scan.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SEQUENTIAL_PARALLELISM_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
