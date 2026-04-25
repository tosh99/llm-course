import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Unrolling time: turning sequences into feedforward networks</h2>
            <p>
                Backpropagation Through Time (BPTT) is the natural extension of the backpropagation
                algorithm to sequences. The key idea is elegant: an RNN processing a sequence of length T
                can be <em>unrolled</em> into a deep feedforward network with T layers — one layer per
                time step — where each layer shares the same weights.
            </p>
            <p>
                This unrolling converts the temporal dependency into a spatial one, allowing the standard
                backpropagation algorithm to compute gradients with respect to all time steps simultaneously.
            </p>
            <h3>The Two Phases</h3>
            <ul>
                <li><strong>Forward pass:</strong> Unroll the network through time, computing and caching
                    all activations (x<sub>t</sub>, h<sub>t</sub>, y<sub>t</sub>) for each time step.</li>
                <li><strong>Backward pass:</strong> Apply the chain rule backwards through the unrolled
                    graph, computing gradients at each time step and accumulating them across all steps.</li>
            </ul>
            <h3>Truncated BPTT</h3>
            <p>
                Full BPTT on long sequences is computationally expensive and causes vanishing gradients
                (since you're backpropagating through many layers). In practice, <strong>truncated BPTT</strong>{" "}
                is used: the error is only backpropagated k time steps (e.g., k=35 for modern language
                models), after which the gradient is cut. This trades off between capturing long-range
                dependencies and computational tractability.
            </p>
            <div className="ch-callout">
                <strong>Note:</strong> Truncated BPTT doesn't solve the vanishing gradient problem — it
                merely avoids it by never asking the network to backpropagate through very long sequences.
                Transformers (Chapter 14) address the long-range dependency problem in an entirely
                different way: by attending to all positions simultaneously.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How does the network learn from its mistakes?</h2>

            <Analogy label="Checking Your Math Homework">
                Imagine you're doing a long division problem with 20 steps. Your teacher marks it wrong
                at the end. To figure out where you went wrong, you trace back: <em>"Why was my final
                answer wrong? Because step 19 was wrong. Why was step 19 wrong? Because step 18 was
                wrong..."</em>
                <br /><br />
                <strong>BPTT</strong> is exactly this: starting from the final error, tracing backwards
                through every step to find out how each earlier decision contributed.
            </Analogy>

            <Analogy label="The Chain Rule for Time">
                In school, you learn the chain rule: if y depends on u, and u depends on x,
                then dy/dx = (dy/du) × (du/dx). BPTT applies this through time:
                <br /><br />
                The error at time T depends on h<sub>T</sub>, which depends on h<sub>T-1</sub>,
                which depends on h<sub>T-2</sub>, ... which depends on h<sub>0</sub>.
                <br /><br />
                So the gradient has to be multiplied by the derivative at each step going backwards.
                This is exactly like tracing back through your math homework — except some of the
                multiplication steps make the gradient smaller and smaller until it practically disappears.
            </Analogy>

            <Analogy label="Why We Truncate">
                Going back through 100 steps of math homework to find every small mistake is
                overwhelming — the early steps barely affect your final answer. <strong>Truncated BPTT</strong>{" "}
                is like only checking the last 10 steps: it's faster, but you might miss important
                mistakes from much earlier. For some problems (like reading a sentence), that's fine.
                For others (like writing a long story), you need a different approach — like LSTMs
                that can remember things without needing to backpropagate through every step.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mechanics of training recurrent networks</h2>

            <h3>The Unrolled Network Picture</h3>
            <p>
                An RNN processing sequence (x<sub>1</sub>, ..., x<sub>T</sub>) is equivalent to
                a T-layer feedforward network, where layer t has weights W<sub>xh</sub>, W<sub>hh</sub>
                shared across all layers:
            </p>
            <MathBlock tex="h_t = \tanh(W_{xh}\,x_t + W_{hh}\,h_{t-1} + b_h)" />
            <p>
                The loss at time T is L<sub>T</sub> = loss(y<sub>T</sub>, ŷ<sub>T</sub>).
                The gradient of L<sub>T</sub> with respect to W<sub>hh</sub> accumulates contributions
                from every time step where W<sub>hh</sub> appears in the forward computation:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}_T}{\partial W_{hh}} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}_T}{\partial h_T} \cdot \frac{\partial h_T}{\partial h_t} \cdot \frac{\partial h_t}{\partial W_{hh}}" />

            <h3>Gradient Clipping</h3>
            <p>
                A practical necessity in BPTT: gradients can <em>explode</em> as well as vanish.
                If the largest eigenvalue of W<sub>hh</sub> exceeds 4, gradients grow exponentially
                and cause NaN losses. <strong>Gradient clipping</strong> (Pascanu et al., 2012) is a simple fix:
            </p>
            <MathBlock tex="\mathbf{g} \leftarrow \begin{cases} \mathbf{g} \cdot \frac{threshold}{\|\mathbf{g}\|} & \text{if } \|\mathbf{g}\| &gt; threshold \\ \mathbf{g} & \text{otherwise} \end{cases}" />
            <p>
                A threshold of 5.0 is common. This prevents NaN gradients without changing the
                gradient's direction — it simply rescales when the magnitude gets too large.
            </p>

            <h3>Truncated BPTT Algorithm</h3>
            <ul>
                <li>Pick a sequence of length T and a truncation window k (e.g., k = 35).</li>
                <li>Run forward pass through all T steps, caching activations.</li>
                <li>Run backward pass only for the last k steps, accumulating gradients.</li>
                <li>Discard gradients from earlier steps and update weights.</li>
            </ul>


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
            <h2>Formal derivation of BPTT and its limitations</h2>

            <DefBlock label="Forward Pass (cached)">
                For each time step t = 1, ..., T:
                <InlineMath tex="z_t = W_{xh}x_t + W_{hh}h_{t-1} + b_h" />
                <InlineMath tex="h_t = \tanh(z_t)" />
                <InlineMath tex="y_t = \text{softmax}(W_{hy}h_t + b_y)" />
                Cache z<sub>t</sub> and h<sub>t</sub> for the backward pass.
            </DefBlock>

            <h3>Backward Pass</h3>
            <p>
                Define <InlineMath tex="\delta_t^h = \frac{\partial \mathcal{L}}{\partial h_t}" />.
                At the final time T:
                <InlineMath tex="\delta_T^h = \frac{\partial \mathcal{L}}{\partial y_T} \cdot \frac{\partial y_T}{\partial h_T}" />.
            </p>
            <p>
                For t &lt; T, the error flows to the previous time step:
                <InlineMath tex="\delta_t^h = \frac{\partial \mathcal{L}}{\partial h_{t+1}} \cdot \frac{\partial h_{t+1}}{\partial h_t} = \delta_{t+1}^h \cdot W_{hh}^\top \cdot \text{diag}(\tanh'(z_t))" />.
            </p>
            <p>
                This is the recurrence that causes vanishing/exploding gradients: each step multiplies
                by W<sub>hh</sub><sup>⊤</sup>. If <InlineMath tex="|\lambda_{max}(W_{hh})| &gt; 1" />,
                gradients explode. If <InlineMath tex="|\lambda_{max}(W_{hh})| &lt; 1" />, they vanish.
            </p>

            <h3>Weight Gradient Accumulation</h3>
            <p>
                The gradient for shared weights is the sum of contributions at each time step:
                <InlineMath tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T-1} (\delta_{t+1}^h)^\top \cdot \frac{\partial h_{t+1}}{\partial W_{hh}} = \sum_{t=1}^{T-1} \delta_{t+1}^h \cdot h_t^\top" />.
            </p>
            <p>
                Similarly:
                <InlineMath tex="\frac{\partial \mathcal{L}}{\partial W_{xh}} = \sum_{t=1}^{T} \delta_t^h \cdot x_t^\top" />.
            </p>

            <h3>Exploding Gradient Proof</h3>
            <p>
                Let <InlineMath tex="\|\cdot\|" /> denote the spectral norm. Since
                <InlineMath tex="\tanh'(z) \leq 1" />, we have:
                <InlineMath tex="\|\delta_t^h\| \leq \|W_{hh}^\top\| \cdot \|\delta_{t+1}^h\|" />.
                If <InlineMath tex="\|W_{hh}\| = \sigma &gt; 1" />, then
                <InlineMath tex="\|\delta_{T-k}^h\| \geq \sigma^k \cdot \|\delta_T^h\|" />.
                After k = 20 steps with <InlineMath tex="\sigma = 1.5" />:
                <InlineMath tex="1.5^{20} \approx 3325" /> — gradients grow ~3,000× in 20 steps!
            </p>

            <div className="ch-callout">
                <strong>Pascanu et al. (2012)</strong> introduced gradient clipping specifically for RNNs.
                Their key insight: the problem with exploding gradients isn't the gradient's magnitude per se —
                it's that large updates destabilize learning. Clipping prevents destabilization while
                preserving the correct gradient direction.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def tanh(z):
    return np.tanh(z)

def tanh_prime(h):
    """tanh'(z) = 1 - tanh²(z). If h = tanh(z), then tanh'(z) = 1 - h²"""
    return 1 - h ** 2

def softmax(z):
    e = np.exp(z - np.max(z))
    return e / e.sum()

# ── Full BPTT for one sequence ────────────────────────────────────────────────
def bptt(X, y_target, Whh, Wxh, bh, Why, by, seq_len=None):
    """
    Full BPTT for a sequence. Returns gradients for all parameters.
    X: (T, input_dim), y_target: (T, output_dim) — one-hot targets
    """
    T = seq_len if seq_len else len(X)
    hidden_dim = Whh.shape[0]

    # ── Forward pass — cache activations ──────────────────────────────────────
    H = np.zeros((T + 1, hidden_dim))   # H[0] = h_0 = 0
    Z = []                              # pre-activation values
    for t in range(T):
        z_t = Wxh @ X[t] + Whh @ H[t] + bh
        H[t+1] = tanh(z_t)
        Z.append(z_t)

    # Output from final hidden state
    y_pred = softmax(H[T] @ Why + by)

    # ── Backward pass ─────────────────────────────────────────────────────────
    delta_out = y_pred - y_target[T-1]      # cross-entropy derivative
    dWhy = np.outer(H[T], delta_out)
    dby = delta_out

    # δ_T^h: error at final hidden state from loss and output projection
    delta_h = Why @ delta_out               # (hidden_dim,)

    dWhh = np.zeros_like(Whh)
    dWxh = np.zeros_like(Wxh)
    dbh  = np.zeros_like(bh)

    # Backpropagate through time — from T-1 down to 0
    for t in reversed(range(T)):
        # δ_t^h = (W_hh^T @ δ_{t+1}^h) * tanh'(z_t)
        delta_h = (Whh.T @ delta_h) * tanh_prime(H[t+1])

        dWhh += np.outer(H[t], delta_h)     # ∂h_t / ∂W_hh = h_{t-1}^T
        dWxh += np.outer(X[t], delta_h)      # ∂h_t / ∂W_xh = x_t^T
        dbh  += delta_h

    # ── Gradient clipping ─────────────────────────────────────────────────────
    clip_val = 5.0
    for d in [dWhh, dWxh, dbh, dWhy, dby]:
        np.linalg.norm(d, ord=2)             # just for inspection
        d /= max(1, np.linalg.norm(d) / clip_val)

    return dWhh, dWxh, dbh, dWhy, dby

# ── Truncated BPTT ────────────────────────────────────────────────────────────
def truncated_bptt(X, y_target, Whh, Wxh, bh, Why, by, k=20):
    """
    Truncated BPTT: only backprop through k steps.
    Suitable for very long sequences.
    """
    T = len(X)
    hidden_dim = Whh.shape[0]

    H = np.zeros((T + 1, hidden_dim))
    for t in range(T):
        H[t+1] = tanh(Wxh @ X[t] + Whh @ H[t] + bh)

    delta_h = np.zeros(hidden_dim)
    delta_out = softmax(H[T] @ Why + by) - y_target[T-1]
    delta_h = Why @ delta_out

    dWhh = np.zeros_like(Whh)
    dWxh = np.zeros_like(Wxh)
    dbh  = np.zeros_like(bh)

    # Only go back k steps
    for t in reversed(range(max(0, T - k), T)):
        delta_h = (Whh.T @ delta_h) * tanh_prime(H[t+1])
        dWhh += np.outer(H[t], delta_h)
        dWxh += np.outer(X[t], delta_h)
        dbh  += delta_h

    return dWhh, dWxh, dbh

print("BPTT and Truncated BPTT implementations ready.")
print("Full BPTT: O(T) memory, backprops through entire sequence")
print("Truncated BPTT: O(k) memory, backprops through k most recent steps")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of full BPTT (backprops through the entire sequence) and
                truncated BPTT (backprops through only the last k steps). Gradient clipping is
                included to prevent NaN gradients from exploding updates.
            </p>
            <CodeBlock code={PY_CODE} filename="bptt.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Memory consideration:</strong> Full BPTT requires storing all hidden states
                for a sequence (O(T × hidden_dim) memory). For GPT-3 with 2048 context length and
                12288 hidden dimensions, this is 2048 × 12288 ≈ 25M activations per layer, per sample.
                Truncated BPTT trades off long-range gradient quality for bounded memory.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BPTT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
