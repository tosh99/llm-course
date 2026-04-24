import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Speeding up the inherently sequential</h2>
            <p>
                RNNs process sequences one time step at a time — h<sub>t</sub> depends on h<sub>t-1</sub>,
                so step t cannot begin until step t−1 finishes. This serial dependency makes RNNs
                notoriously difficult to parallelize on modern hardware designed for matrix
                multiplication. Yet the demand for faster training and longer sequences drove
                researchers to find clever ways to introduce parallelism into recurrent models.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1990s</div>
                    <div className="ch-tl-section-label">Prehistory</div>
                    <div className="ch-tl-title">The Inherent Serial Bottleneck</div>
                    <div className="ch-tl-body">
                        From Elman (1990) through LSTM (1997), RNNs were trained on CPUs with
                        single sequences. The unrolled computation graph is a long chain —
                        inherently sequential, inherently slow. No one worried much because
                        datasets were small and sequences were short (hundreds of time steps).
                    </div>
                    <div className="ch-tl-impact">Impact: Established RNNs as the "slow but powerful" model class</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014 – 2015</div>
                    <div className="ch-tl-section-label">Batching</div>
                    <div className="ch-tl-title">Minibatch Parallelism &amp; cuDNN</div>
                    <div className="ch-tl-body">
                        NVIDIA's cuDNN library introduced highly optimized batched RNN kernels.
                        While time steps within a single sequence are still sequential, multiple
                        sequences in a minibatch can be processed in parallel. A batch of 64
                        sequences yields a 64× throughput increase — not algorithmic speedup, but
                        hardware utilization. cuDNN fused the matrix multiplications for all gates
                        into single large GEMM calls, giving 5–10× speedups over naive loops.
                    </div>
                    <div className="ch-tl-impact">Impact: Made RNNs practical for large-scale training via data parallelism</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 – 2017</div>
                    <div className="ch-tl-section-label">Algorithm</div>
                    <div className="ch-tl-title">Parallel Scan &amp; Quasi-Recurrent Networks</div>
                    <div className="ch-tl-body">
                        Bradbury et al. (2016) proposed Quasi-Recurrent Neural Networks (QRNNs),
                        which decouple the convolutional "forget" computation (parallelizable across
                        time via convolutions) from the cumulative product (a parallel scan, or
                        prefix sum, operation). The parallel scan algorithm reduces the serial
                        dependency from O(T) to O(log T) using a tree reduction, though with
                        increased memory. Independently, Martin &amp; Cundy (2017) explored parallel
                        scan for LSTM-style recurrences, showing that prefix-sum algorithms on GPUs
                        can achieve near-linear speedup for sufficiently long sequences.
                    </div>
                    <div className="ch-tl-impact">Impact: First algorithmic parallelization of recurrence, not just batching</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 – Present</div>
                    <div className="ch-tl-section-label">Modern Era</div>
                    <div className="ch-tl-title">Linear Attention &amp; State Space Models</div>
                    <div className="ch-tl-body">
                        The ultimate parallelization is to remove nonlinear interactions across
                        time. Katharopoulos et al. (2020) showed that if attention weights are
                        decomposed into feature maps, the attention computation becomes a cumulative
                        sum — parallelizable via prefix scan. More radically, Gu et al. (2021)
                        introduced Structured State Space Models (S4, Mamba), which use linear
                        state transitions that can be computed either as a recurrence (O(T) sequential)
                        or as a global convolution (O(T log T) parallel). These models retain
                        RNN-like memory usage at inference while training with Transformer-like
                        parallelization — the best of both worlds.
                    </div>
                    <div className="ch-tl-impact">Impact: SSMs are the modern successors to RNNs, solving the parallelism problem at the architectural level</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The fundamental tension:</strong> Nonlinear recurrence across time is
                what gives RNNs their expressive power — the ability to selectively remember and
                forget. But nonlinearity destroys parallelizability. Every technique for RNN
                parallelism (batching, QRNN, SSM) makes some sacrifice in selectivity to gain
                speed. The Transformer sidesteps this entirely by making time-dependence explicit
                through position embeddings rather than recurrence.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>An assembly line with prep work</h2>

            <Analogy label="The Serial Factory (Vanilla RNN)">
                Imagine a factory with 100 work stations in a row. Each station can only start
                after the previous station finishes. Station 1 wraps a box. Station 2 puts a label
                on it. Station 3 tapes it shut. If station 1 takes 1 minute, the whole line takes
                100 minutes, no matter how many workers you hire. You can't parallelize the line
                because each step depends on the step before it.
            </Analogy>

            <Analogy label="The Batch Factory (Minibatch Parallelism)">
                Now imagine you have 50 identical assembly lines side by side. Each line still
                takes 100 minutes, but you're producing 50 boxes at once. This is minibatch
                training — you don't make any single line faster, but you get more throughput.
                GPUs love this because they can run all 50 lines simultaneously using the same
                instructions.
            </Analogy>

            <Analogy label="The Smart Factory (Parallel Scan)">
                A clever engineer redesigns the factory. Instead of each station waiting for the
                previous one, they use a "running total" system. Station 1 adds 5. Station 2 sees
                the running total (5) and adds 3 to get 8. Station 3 sees 8 and adds 7 to get 15.
                But here's the trick: with a tree-like communication pattern, all stations can
                compute their contributions in log(100) rounds instead of 100 sequential steps.
                <br /><br />
                This is the parallel scan algorithm — it only works when the operation is
                associative (like addition or multiplication), which is why it works for simple
                linear recurrences but not for complex nonlinear gates.
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
                time step t, we stack all N inputs into a matrix X<sub>t</sub> ∈ ℝ<sup>N×d</sup> and
                all N hidden states into H<sub>t</sub> ∈ ℝ<sup>N×n</sup>, then compute:
            </p>
            <MathBlock tex="\mathbf{H}_t = f\!\left(\mathbf{H}_{t-1} \mathbf{U}^\top + \mathbf{X}_t \mathbf{W}^\top + \mathbf{b}\right)" />
            <p>
                The matrix multiplication H<sub>t−1</sub>U<sup>T</sup> is a single large GEMM call,
                fully utilizing the GPU. The speedup is roughly N× (for N up to the GPU's capacity),
                but the <em>per-sequence</em> latency remains O(T).
            </p>

            <h3>Parallel Scan (Prefix Sum)</h3>
            <p>
                For a <em>linear</em> recurrence of the form h<sub>t</sub> = a<sub>t</sub> ⊙ h<sub>t−1</sub> + b<sub>t</sub>,
                the solution over T steps is:
            </p>
            <MathBlock tex="\mathbf{h}_T = \left(\prod_{k=1}^{T} \mathbf{a}_k\right) \odot \mathbf{h}_0 + \sum_{j=1}^{T} \left(\prod_{k=j+1}^{T} \mathbf{a}_k\right) \odot \mathbf{b}_j" />
            <p>
                This can be computed via parallel prefix scan in O(log T) parallel steps using
                a tree reduction. Each "up-sweep" combines adjacent pairs; each "down-sweep"
                distributes prefix results. The algorithm requires O(T) memory and O(T) total
                work, but only O(log T) sequential steps.
            </p>

            <h3>Quasi-Recurrent Networks (QRNN)</h3>
            <p>
                QRNNs factor the RNN computation into two phases:
            </p>
            <ol>
                <li><strong>Convolutional phase (parallel across time):</strong> Compute candidate, forget gate, and output gate for all time steps simultaneously using 1D convolutions.</li>
                <li><strong>Pool phase (sequential but simple):</strong> Apply a cumulative pooling operation: c<sub>t</sub> = f<sub>t</sub> ⊙ c<sub>t−1</sub> + (1 − f<sub>t</sub>) ⊙ z<sub>t</sub>, where f<sub>t</sub> is the forget gate and z<sub>t</sub> is the candidate.</li>
            </ol>
            <p>
                The pool phase is a simple linear recurrence solvable by parallel scan. QRNNs
                achieved 10× training speedups over LSTMs on long sequences with minimal accuracy
                loss on sentiment analysis tasks.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why parallel scan doesn't solve everything:</strong> LSTM and GRU gates
                involve nonlinear interactions between the input and the previous hidden state
                (e.g., z<sub>t</sub> = σ(W<sub>z</sub>x<sub>t</sub> + U<sub>z</sub>h<sub>t−1</sub>)).
                The previous state h<sub>t−1</sub> appears inside a sigmoid, making the recurrence
                non-linear and non-associative. Parallel scan only applies when the recurrence
                is linear in h<sub>t−1</sub>.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Associative operators and parallel prefix algorithms</h2>

            <DefBlock label="Parallel Scan (Prefix Sum)">
                Given a sequence of associative operator applications:
                h<sub>t</sub> = h<sub>t−1</sub> ⊕ x<sub>t</sub>, where ⊕ is associative:
                (a ⊕ b) ⊕ c = a ⊕ (b ⊕ c). The prefix sum computes all partial results
                (h<sub>1</sub>, h<sub>2</sub>, …, h<sub>T</sub>) in O(log T) parallel depth.
            </DefBlock>

            <h3>Blelloch Scan Algorithm</h3>
            <p>
                The classic parallel prefix scan operates in two phases:
            </p>
            <ul>
                <li><strong>Up-sweep (reduce):</strong> Build a binary tree where each node stores the sum of its children. Depth: O(log T).</li>
                <li><strong>Down-sweep (distribute):</strong> Propagate prefix sums from the root to leaves, using the stored partial sums. Depth: O(log T).</li>
            </ul>
            <p>
                Total work: O(T). Total depth: O(log T). Parallel speedup on P processors:
                O(T/log T) in the ideal case.
            </p>

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
                The operator ∘ is associative, so Blelloch scan applies directly. This is the
                mathematical foundation of S4 and Mamba: their state transitions are designed
                to be linear and time-invariant (or nearly so), making them parallelizable via
                FFT-based convolution during training while retaining the recurrent form for
                efficient autoregressive inference.
            </p>

            <h3>Computational Complexity Comparison</h3>
            <table style={{ color: 'var(--ch-text)', borderCollapse: 'collapse', marginBottom: '18px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Model</th>
                        <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Training Parallelism</th>
                        <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>Inference Memory</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px 16px' }}>LSTM / GRU</td>
                        <td style={{ padding: '8px 16px' }}>O(1) — sequential</td>
                        <td style={{ padding: '8px 16px' }}>O(n)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--ch-border)' }}>
                        <td style={{ padding: '8px 16px' }}>Transformer</td>
                        <td style={{ padding: '8px 16px' }}>O(1) — fully parallel</td>
                        <td style={{ padding: '8px 16px' }}>O(T²)</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px 16px' }}>S4 / Mamba</td>
                        <td style={{ padding: '8px 16px' }}>O(log T) — scan/conv</td>
                        <td style={{ padding: '8px 16px' }}>O(n)</td>
                    </tr>
                </tbody>
            </table>

            <div className="ch-callout">
                <strong>S4/Mamba's dual mode:</strong> During training, S4 uses the convolutional
                representation (parallel FFT) because the full sequence is known. During inference,
                it switches to the recurrent representation (single step update) because only the
                current token is known. This gives Transformer-like training speed with RNN-like
                inference memory — the best trade-off discovered so far.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Parallel Scan (Prefix Sum) — NumPy ────────────────────────────────────────
def parallel_scan(a: np.ndarray, b: np.ndarray):
    """
    Solve h_t = a_t * h_{t-1} + b_t with h_0 = 0 using Blelloch scan.
    a, b: (T,) vectors. Returns h: (T,) vector.
    """
    T = a.shape[0]
    if T == 0:
        return np.array([])

    # Pad to next power of 2
    n = 1
    while n < T:
        n *= 2
    a_pad = np.concatenate([a, np.ones(n - T)])
    b_pad = np.concatenate([b, np.zeros(n - T)])

    # Up-sweep: build tree of (A, B) pairs where result = A * prev + B
    # Store as two arrays
    A = a_pad.copy()
    B = b_pad.copy()

    # Up-sweep
    d = n // 2
    while d > 0:
        for i in range(0, n, 2 * d):
            if i + 2 * d - 1 < n:
                A[i + 2 * d - 1] = A[i + 2 * d - 1] * A[i + d - 1]
                B[i + 2 * d - 1] = A[i + 2 * d - 1] * B[i + d - 1] + B[i + 2 * d - 1]
        d //= 2

    # Down-sweep
    A[-1] = 1
    B[-1] = 0
    d = 1
    while d < n:
        for i in range(0, n, 2 * d):
            if i + 2 * d - 1 < n:
                left_A = A[i + d - 1]
                left_B = B[i + d - 1]
                A[i + d - 1] = A[i + 2 * d - 1]
                B[i + d - 1] = B[i + 2 * d - 1]
                A[i + 2 * d - 1] = A[i + 2 * d - 1] * left_A
                B[i + 2 * d - 1] = A[i + 2 * d - 1] * left_B + B[i + 2 * d - 1]
        d *= 2

    h = B[:T]
    return h


# ── Demo: compare parallel scan with sequential recurrence ────────────────────
T = 16
rng = np.random.default_rng(42)
a = rng.uniform(0.3, 0.9, T)
b = rng.normal(0, 1.0, T)

# Sequential
h_seq = np.zeros(T)
for t in range(T):
    h_seq[t] = a[t] * (h_seq[t-1] if t > 0 else 0) + b[t]

# Parallel
h_par = parallel_scan(a, b)

print("Parallel Scan Demo")
print("=" * 45)
print(f"Sequence length : {T}")
print(f"Max abs diff    : {np.max(np.abs(h_seq - h_par)):.2e}")
print()
print("Step-by-step comparison:")
for t in range(T):
    match = "✓" if np.isclose(h_seq[t], h_par[t]) else "✗"
    print(f"  t={t:2d}: seq={h_seq[t]:+.4f}  par={h_par[t]:+.4f}  {match}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of the Blelloch parallel prefix scan for a linear recurrence.
                The demo compares the parallel result against a sequential loop, verifying exact
                numerical equivalence.
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
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
