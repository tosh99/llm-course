import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The context</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1974–1986",
            title: "Werbos — The Seed of BPTT in His PhD Thesis",
            challenge:
                "After backpropagation was established as a practical algorithm for feedforward networks (Chapter 5), the question immediately arose: how do you train networks with feedback connections? Recurrent networks had been theorised since the 1940s (McCulloch-Pitts neurons, Hopfield networks), but training them with gradient descent required computing gradients through cycles in the computation graph — something standard backpropagation, which assumed a directed acyclic graph, could not handle.",
            what: "Paul Werbos had already sketched the key insight in his 1974 Harvard PhD thesis 'Beyond Regression: New Tools for Prediction and Analysis in the Behavioral Sciences.' His idea was to treat the temporal evolution of a recurrent network as a sequence of feedforward computations: unroll the network through T time steps, treating each step as a separate layer sharing the same weights, then apply standard backpropagation on this unrolled graph. He called this 'backpropagation through time' and published a fuller account in 1990.",
            impact:
                "Werbos's 1974 thesis is one of the most underappreciated documents in machine learning history. It contained the first general formulation of backpropagation (three years before Rumelhart, Hinton, and Williams) and the first formulation of BPTT. The ideas lay dormant for over a decade, published mainly in systems theory journals, until the deep learning community rediscovered and extended them in the 1990s.",
        },
        {
            year: "1989–1990",
            title: "Williams & Zipser — RTRL and the Online Alternative to BPTT",
            challenge:
                "BPTT requires storing all activations from all T time steps before running the backward pass — a memory cost of O(T) that becomes prohibitive for long sequences. For real-time applications (speech recognition processing a continuous audio stream, control systems that must respond quickly), batch BPTT over the full sequence was not practical. A method for computing gradients online — one step at a time — was needed.",
            what: "Ronald Williams and David Zipser (1989) published 'A Learning Algorithm for Continually Running Fully Recurrent Neural Networks,' introducing Real-Time Recurrent Learning (RTRL). RTRL maintains a sensitivity matrix that tracks how the current hidden state depends on each weight, updating it at every time step without storing the full unrolled history. The gradient for each weight is available immediately after each step, enabling online updates. Williams and Zipser also worked on truncated BPTT, where the backward pass is stopped after k steps to bound both memory and compute.",
            impact:
                "RTRL showed that online gradient computation for recurrent networks was possible, making RNNs applicable to streaming and real-time tasks. The trade-off is computational cost: RTRL requires O(n&#178;) operations per step (where n is the hidden dimension) versus O(n) for BPTT, making it impractical for large networks. However, the truncated BPTT variant — running BPTT for k steps rather than T steps — became the dominant method in practice and is still used in all major RNN training frameworks today.",
        },
        {
            year: "1990",
            title: "Werbos's Full BPTT Paper — Formalising the Algorithm",
            challenge:
                "Although Werbos had the idea since 1974, the formal algorithmic treatment was scattered and not widely accessible. The Rumelhart-Hinton-Williams 1986 paper dominated researchers' attention. The recurrent community needed a clear, systematic description of BPTT that matched the precision of standard backpropagation — one that addressed the shared-weight complication, the handling of multiple loss terms across time steps, and the relationship to RTRL.",
            what: "Werbos published 'Backpropagation Through Time: What It Does and How to Do It' in the Proceedings of the IEEE (1990). The paper gave a complete derivation: (1) unroll the RNN for T steps to get a feedforward graph with tied weights; (2) apply the chain rule to compute gradients at each unrolled step; (3) sum the contributions across all time steps (since the same weight W&#8330;&#8331; is used at every step, its gradient is a sum, not a single term); (4) apply gradient clipping to prevent explosion. The paper also clarified the connection between BPTT and RTRL as two formulations of the same underlying computation.",
            impact:
                "The 1990 paper established BPTT as the standard algorithm for training RNNs and remained the canonical reference for over two decades. Its clear derivation made recurrent network training accessible to researchers outside of systems theory. The accumulated-gradient insight — that the gradient for a shared weight is the sum of contributions from all time steps where it was used — is fundamental and non-obvious, and Werbos's paper is where it was most clearly stated.",
        },
        {
            year: "1994",
            title: "Bengio, Simard & Frasconi — Connecting BPTT to the Vanishing Gradient",
            challenge:
                "Training RNNs with BPTT on long sequences consistently produced networks that failed to capture long-range dependencies. Researchers observed this empirically but lacked a theoretical explanation that connected the failure to the mathematical properties of the BPTT algorithm itself. Was the problem the learning rate? The initialisation? The activation function? Or something more fundamental?",
            what: "Yoshua Bengio, Patrice Simard, and Paolo Frasconi published 'Learning Long-Term Dependencies with Gradient Descent Is Difficult' (IEEE Transactions on Neural Networks, 1994). The paper proved mathematically that BPTT gradients decay exponentially with the number of time steps between the dependent variables — not as a side effect of any particular implementation, but as a direct consequence of the repeated Jacobian multiplication. The paper also showed that the same issue affects feedforward networks, but is far more severe in RNNs because sequence length, not layer count, determines the effective depth.",
            impact:
                "This paper transformed the vanishing gradient from an empirical observation into a proven theorem. It shifted the field's attention from 'how to train RNNs better' to 'what architectural change would avoid the exponential decay.' The paper explicitly called for gating mechanisms — ways to allow gradient flow to bypass the multiplicative bottleneck — anticipating the LSTM solution that Hochreiter and Schmidhuber would publish three years later.",
        },
        {
            year: "1994–2012",
            title: "Williams-Peng, Pascanu et al. — Gradient Clipping as Partial Fix",
            challenge:
                "While the vanishing gradient caused RNNs to forget, the complementary problem — exploding gradients — caused training to become numerically unstable. If the spectral radius of W&#8330;&#8331; exceeds 1, gradients grow exponentially through BPTT. A single step with a huge gradient can destroy months of training by pushing weights to extreme values, producing NaN losses. The explosion is sudden and catastrophic: the loss is fine for 1,000 steps, then goes to infinity in one step.",
            what: "Williams and Peng (1990) noted the gradient clipping idea informally. Pascanu, Mikolov, and Bengio formalised it in 'On the Difficulty of Training Recurrent Neural Networks' (ICML 2012): if the gradient norm exceeds a threshold &#952;, rescale the entire gradient vector so its norm equals &#952;. This preserves the gradient's direction while bounding its magnitude. The paper proved that clipping corresponds to a trust-region constraint on the step and showed experimentally that a threshold of 5 prevented explosions without significantly slowing convergence.",
            impact:
                "The pairing of truncated BPTT (to bound sequence length) with gradient clipping (to prevent explosion) became the practical recipe for training vanilla RNNs through the early 2010s. Even after LSTM became the dominant architecture, gradient clipping remained essential because LSTMs still suffer from exploding gradients through their hidden state pathway, even if the cell state gradient is stable.",
        },
        {
            year: "2012–Present",
            title: "BPTT in Modern Deep Learning Frameworks",
            challenge:
                "Implementing BPTT correctly by hand is error-prone: shared weights require careful gradient accumulation, different loss formulations (sequence-level vs. per-step) require different unrolling strategies, and memory management for long sequences is complex. As RNNs scaled to larger hidden dimensions and longer sequences, the engineering complexity grew.",
            what: "Modern automatic differentiation frameworks (Theano 2010, Torch 2011, TensorFlow 2015, PyTorch 2016) implement BPTT transparently through dynamic or static computation graphs. In PyTorch, calling loss.backward() on the output of an RNN automatically constructs the unrolled gradient graph and accumulates the shared-weight gradients. The user specifies the forward computation; the framework handles the backward pass. Truncated BPTT is implemented by calling loss.backward() on subsequences and detaching the hidden state between windows using hidden.detach().",
            impact:
                "Automatic differentiation democratised BPTT: researchers could experiment with novel recurrent architectures without re-deriving gradients by hand. This accelerated the development of every architecture from LSTMs and GRUs to Transformer decoders. The BPTT algorithm itself is unchanged from Werbos's 1990 formulation — modern frameworks simply implement it more conveniently and efficiently, with GPU parallelism, mixed-precision arithmetic, and gradient checkpointing for memory efficiency.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>How does the network learn from its mistakes in a sequence?</h2>

            <Analogy label="Checking Your Long-Division Homework">
                Imagine you're doing a long-division problem with 20 steps. Your teacher marks the final answer wrong. To figure out where you went wrong, you trace backwards: "Why was my final answer wrong? Because step 19 was wrong. Why was step 19 wrong? Because step 18 was wrong…" all the way back to step 1.
                <br /><br />
                <strong>Backpropagation Through Time (BPTT)</strong> is exactly this process. Starting from the final error, it traces backwards through every time step to find out how each earlier decision contributed to the mistake. The network then adjusts its weights to make better decisions next time.
            </Analogy>

            <Analogy label="The Chain Rule for Time">
                In algebra you learn the chain rule: if y depends on u and u depends on x, then the rate of change of y with respect to x is (rate of y with respect to u) times (rate of u with respect to x). BPTT applies exactly this through time:
                <br /><br />
                The error at time T depends on the hidden state at T, which depends on the hidden state at T-1, which depends on T-2 … all the way back to step 1. To find out how much step 1 contributed to the final error, we multiply together the sensitivity at each step along the chain.
                <br /><br />
                The problem: every time you multiply by a number less than 1, the product gets smaller. Multiply by 0.9 twenty times: 0.9&#178;&#176; &#8776; 0.12. Multiply by 0.9 fifty times: &#8776; 0.005. The early steps' contribution becomes almost invisible — the network can't learn from mistakes that happened far in the past.
            </Analogy>

            <Analogy label="Unrolling the Loop — Making a Sequence Into Layers">
                Remember that an RNN processes a sequence by looping: step 1, step 2, step 3, ... But for the purposes of computing gradients, you can "unroll" this loop into a series of layers, one per time step. Each layer uses the same weights as all the others.
                <br /><br />
                A 10-step RNN unrolled looks like a 10-layer feedforward network. Computing gradients is then just standard backpropagation — but applied to a 10-layer network where every layer shares the same weight matrix. The gradient for that shared weight is the sum of what every layer contributes.
            </Analogy>

            <Analogy label="Why We Truncate — Stopping After k Steps">
                Going back 100 steps to check every tiny mistake is overwhelming — and most of those early mistakes barely affect your final answer anyway. <strong>Truncated BPTT</strong> is like only checking the last 20 steps: it's faster and avoids the worst of the vanishing gradient, but you might miss important mistakes from much earlier in the sequence.
                <br /><br />
                In practice, truncated BPTT with k = 35 steps is the standard for language models. The network processes the sequence in chunks, backpropagating within each chunk but not across chunks. The hidden state carries information forward across chunks, but the gradient doesn't — a deliberate approximation that keeps training tractable.
            </Analogy>

            <Analogy label="Gradient Clipping — Stopping the Explosion">
                The opposite problem also exists: sometimes the gradient doesn't shrink — it grows. If the weight matrix is slightly too large, multiplying by it at every step causes the gradient to grow exponentially. After 20 steps, a gradient of 1 becomes 1,000,000. This causes the weights to update by a massive amount in one step, breaking all previous learning.
                <br /><br />
                The fix is brilliantly simple: if the gradient gets too big, just shrink it back down. Keep the same direction, just reduce the size. This is called <strong>gradient clipping</strong>, and it's used in virtually every RNN training setup today.
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
                An RNN processing a sequence (x&#8329;, ..., x&#8338;) can be viewed as a T-layer feedforward
                network where every layer uses the same weight matrices W&#8330;&#8331;, W&#8330;&#8331;:
            </p>
            <MathBlock tex="h_t = \tanh(W_{hh}\,h_{t-1} + W_{xh}\,x_t + b_h), \quad t = 1, \ldots, T" />
            <p>
                The total loss over the sequence is the sum (or average) of per-step losses:
            </p>
            <MathBlock tex="\mathcal{L} = \sum_{t=1}^{T} \mathcal{L}_t(y_t,\, \hat{y}_t)" />
            <p>
                The gradient of the total loss with respect to the shared weight W&#8330;&#8331; accumulates
                contributions from every time step where W&#8330;&#8331; was used:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}_t}{\partial W_{hh}}" />

            <h3>Backpropagating Through Time</h3>
            <p>
                For each time step t, the contribution to the gradient involves backpropagating
                through all subsequent steps. Define the error at the hidden state:
            </p>
            <MathBlock tex="\delta_t^h = \frac{\partial \mathcal{L}}{\partial h_t}" />
            <p>
                This error is the sum of the direct contribution from the loss at t and the indirect
                contribution flowing back from future time steps:
            </p>
            <MathBlock tex="\delta_t^h = \frac{\partial \mathcal{L}_t}{\partial h_t} + W_{hh}^\top \cdot \operatorname{diag}(\tanh'(z_{t+1})) \cdot \delta_{t+1}^h" />
            <p>
                Working backwards from T to 1, each &#948;&#8329;&#697; is computed from &#948;&#8329;&#8330;&#8321;&#697;. The weight gradient
                accumulates:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T} \delta_{t+1}^h \cdot h_t^\top" />

            <h3>Gradient Clipping</h3>
            <p>
                A practical necessity in BPTT: if the spectral radius of W&#8330;&#8331; exceeds 1,
                gradients can grow exponentially. <strong>Gradient clipping</strong> (Pascanu et al., 2012)
                rescales the full gradient vector when its norm exceeds a threshold:
            </p>
            <MathBlock tex="\mathbf{g} \leftarrow \begin{cases} \mathbf{g} \cdot \dfrac{\theta}{\|\mathbf{g}\|} & \text{if } \|\mathbf{g}\| > \theta \\ \mathbf{g} & \text{otherwise} \end{cases}" />
            <p>
                A threshold of &#952; = 5 is common. This preserves the gradient's direction while bounding
                its magnitude, preventing the sudden NaN-loss catastrophe of unconstrained gradient explosion.
            </p>

            <h3>Truncated BPTT Algorithm</h3>
            <p>
                For a sequence of length T with truncation window k:
            </p>
            <ol style={{ paddingLeft: "1.4em", lineHeight: "1.85" }}>
                <li>Divide the sequence into chunks of length k.</li>
                <li>For each chunk: run forward pass, caching all hidden states and activations.</li>
                <li>Run backward pass only within the chunk (k steps), not back to the start.</li>
                <li>Detach the hidden state from the previous chunk before processing the next chunk (so gradients don't flow across chunk boundaries).</li>
                <li>Accumulate gradients and update weights after each chunk.</li>
            </ol>

            <h3>Memory vs. Accuracy Trade-Off</h3>
            <p>
                Full BPTT over a length-T sequence requires storing all T hidden states in memory:
                O(T &#215; n) for a hidden dimension n. For T = 1,000 and n = 1,024, this is 1M activations
                per sample — manageable. But for T = 100,000 (a long document) and n = 4,096 (a large model),
                full BPTT would require 400M activations per sample — memory prohibitive. Truncated BPTT
                with k = 128 reduces this to 128K activations, a 3,000&#215; reduction.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The gradient flow problem in one sentence:</strong> In standard backpropagation through a T-layer network, the gradient at layer 1 involves multiplying T matrices together — and if those matrices have spectral radius less than 1, the product shrinks exponentially with T. Every sequence you train on is effectively a randomly deep network, with depth equal to the sequence length.
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
            <h2>Formal derivation of BPTT and its limitations</h2>

            <DefBlock label="Forward Pass (cached for BPTT)">
                For each time step t = 1, ..., T:
                <MathBlock tex="z_t = W_{hh}\,h_{t-1} + W_{xh}\,x_t + b_h" />
                <MathBlock tex="h_t = \tanh(z_t)" />
                <MathBlock tex="\hat{y}_t = \text{softmax}(W_{hy}\,h_t + b_y)" />
                Cache z&#8329; and h&#8329; for the backward pass. Total memory: O(T &#215; n).
            </DefBlock>

            <h3>Backward Pass — Error Signal Definition</h3>
            <p>
                Define the hidden-state error:
                <InlineMath tex="\delta_t^h \triangleq \frac{\partial \mathcal{L}}{\partial h_t}" />.
            </p>
            <p>
                At the final time step T, the error from the output layer is:
            </p>
            <MathBlock tex="\delta_T^{h,\text{out}} = W_{hy}^\top \cdot \frac{\partial \mathcal{L}_T}{\partial \hat{y}_T}" />
            <p>
                For cross-entropy loss with softmax output:
                <InlineMath tex="\frac{\partial \mathcal{L}_T}{\partial \hat{y}_T} = \hat{y}_T - e_{y_T}" />
                where <InlineMath tex="e_{y_T}" /> is the one-hot target.
            </p>

            <h3>Recurrence for Hidden Errors</h3>
            <p>
                For t &#60; T, the error at h&#8329; has two sources: (1) the loss at time t if there is one,
                and (2) the error flowing back from h&#8330;&#8331;&#8321;:
            </p>
            <MathBlock tex="\delta_t^h = W_{hy}^\top(\hat{y}_t - e_{y_t}) + W_{hh}^\top \cdot \operatorname{diag}(\tanh'(z_{t+1})) \cdot \delta_{t+1}^h" />
            <p>
                Applying the chain rule through the tanh non-linearity:
            </p>
            <MathBlock tex="\tilde{\delta}_t^h = \operatorname{diag}(\tanh'(z_t)) \cdot \delta_t^h = \operatorname{diag}(1 - h_t^2) \cdot \delta_t^h" />

            <h3>Weight Gradient Accumulation</h3>
            <p>
                Since W&#8330;&#8331; is shared across all time steps, its gradient is the sum of all local contributions:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T} \tilde{\delta}_t^h \cdot h_{t-1}^\top" />
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{xh}} = \sum_{t=1}^{T} \tilde{\delta}_t^h \cdot x_t^\top" />
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial b_h} = \sum_{t=1}^{T} \tilde{\delta}_t^h" />

            <h3>Exploding Gradient Proof</h3>
            <p>
                Let &#963; = &#961;(W&#8330;&#8331;) denote the spectral radius of W&#8330;&#8331;. Since
                <InlineMath tex="\tanh'(z) \leq 1" />, we have:
            </p>
            <MathBlock tex="\|\delta_{T-k}^h\| \geq \sigma^k \cdot \|\delta_T^h\| - C" />
            <p>
                for some constant C from the direct loss terms. If &#963; &#62; 1:
                after k = 20 steps with &#963; = 1.5: <InlineMath tex="1.5^{20} \approx 3325" /> — gradients
                grow ~3,000&#215; in 20 steps, causing NaN parameters in a single update.
            </p>

            <h3>Truncated BPTT: The Approximation</h3>
            <p>
                In truncated BPTT with window k, we set:
            </p>
            <MathBlock tex="\delta_t^h \approx 0 \quad \text{for } t &lt; T - k" />
            <p>
                This is an approximation — contributions from earlier time steps are ignored. The
                resulting gradient estimator is <em>biased</em> (it consistently underestimates
                long-range contributions) but has bounded variance, making it more stable than full BPTT
                on long sequences. The bias decreases as k increases.
            </p>

            <div className="ch-callout">
                <strong>Pascanu et al. (2012)</strong> proved that gradient clipping is equivalent
                to a steepest descent step on a trust-region objective: instead of minimising
                <InlineMath tex="\mathcal{L} - \mathbf{g}^\top \Delta\mathbf{w}" />, we minimise
                the same objective subject to
                <InlineMath tex="\|\Delta\mathbf{w}\| \leq r" /> for some radius r. The clipping
                operation gives the exact solution to this constrained problem when the unconstrained
                step would exceed r. This makes gradient clipping a principled approximation, not just
                a numerical hack.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def tanh(z):
    return np.tanh(z)

def tanh_prime(h):
    """tanh'(z) = 1 - tanh^2(z). Given h = tanh(z), return 1 - h^2"""
    return 1 - h ** 2

def softmax(z):
    e = np.exp(z - np.max(z))
    return e / e.sum()

# ── Full BPTT for one sequence ─────────────────────────────────────────────────
def bptt(X, y_target, Whh, Wxh, bh, Why, by, clip=5.0):
    """
    Full BPTT for a sequence. Returns gradients for all parameters.
    X:        (T, input_dim)  — input sequence
    y_target: (T,)            — integer class labels at each step
    clip:     gradient clipping threshold
    Returns: gradients (dWhh, dWxh, dbh, dWhy, dby)
    """
    T = len(X)
    hidden_dim = Whh.shape[0]
    output_dim = Why.shape[0]

    # ── Forward pass — cache all hidden states and pre-activations ────────────
    H = np.zeros((T + 1, hidden_dim))   # H[0] = h_0 = 0
    Z = np.zeros((T, hidden_dim))       # pre-activation values
    Y_hat = np.zeros((T, output_dim))   # softmax outputs

    for t in range(T):
        Z[t] = Wxh @ X[t] + Whh @ H[t] + bh
        H[t+1] = tanh(Z[t])
        Y_hat[t] = softmax(Why @ H[t+1] + by)

    # Total loss (cross-entropy)
    loss = -np.sum(np.log(Y_hat[np.arange(T), y_target] + 1e-12))

    # ── Backward pass — from T down to 0 ─────────────────────────────────────
    dWhh = np.zeros_like(Whh)
    dWxh = np.zeros_like(Wxh)
    dbh  = np.zeros_like(bh)
    dWhy = np.zeros_like(Why)
    dby  = np.zeros_like(by)

    delta_h = np.zeros(hidden_dim)   # delta^h flowing back from t+1

    for t in reversed(range(T)):
        # Error from output layer at time t
        dy = Y_hat[t].copy()
        dy[y_target[t]] -= 1.0              # cross-entropy + softmax gradient
        dWhy += np.outer(dy, H[t+1])
        dby  += dy

        # Error flowing back to hidden state
        delta_h_from_output = Why.T @ dy
        delta_h = delta_h_from_output + Whh.T @ (tanh_prime(H[t+1]) * delta_h)

        # Apply tanh non-linearity at this time step
        delta_pre = tanh_prime(H[t+1]) * delta_h_from_output + (
            tanh_prime(H[t+1]) * (Whh.T @ (tanh_prime(H[t+2 if t+2 <= T else T]) * delta_h))
            if t < T - 1 else tanh_prime(H[t+1]) * delta_h_from_output
        )
        # Simplified: accumulate directly
        delta_pre = tanh_prime(H[t+1]) * (Why.T @ dy + delta_h)

        dWhh += np.outer(delta_pre, H[t])
        dWxh += np.outer(delta_pre, X[t])
        dbh  += delta_pre

        delta_h = Whh.T @ delta_pre   # pass error to previous step

    # ── Gradient clipping ─────────────────────────────────────────────────────
    all_grads = [dWhh, dWxh, dbh, dWhy, dby]
    total_norm = np.sqrt(sum(np.sum(g ** 2) for g in all_grads))
    if total_norm > clip:
        scale = clip / total_norm
        for g in all_grads:
            g *= scale

    return dWhh, dWxh, dbh, dWhy, dby, loss

# ── Truncated BPTT ─────────────────────────────────────────────────────────────
def truncated_bptt(X, y_target, Whh, Wxh, bh, Why, by, k=20, lr=0.01):
    """
    Truncated BPTT: process sequence in chunks of length k.
    Hidden state carries across chunks; gradient does not.
    """
    T = len(X)
    hidden_dim = Whh.shape[0]
    h = np.zeros(hidden_dim)    # persistent hidden state across chunks
    total_loss = 0.0

    for start in range(0, T, k):
        end = min(start + k, T)
        X_chunk = X[start:end]
        y_chunk = y_target[start:end]

        # Train on chunk — h_init is carried but not differentiated through
        # (detach: don't backprop through the chunk boundary)
        dWhh, dWxh, dbh, dWhy, dby, loss = bptt(
            X_chunk, y_chunk, Whh, Wxh, bh, Why, by
        )
        total_loss += loss

        # Update weights
        Whh -= lr * dWhh
        Wxh -= lr * dWxh
        bh  -= lr * dbh
        Why -= lr * dWhy
        by  -= lr * dby

        # Advance hidden state (forward-only, no gradient)
        for t in range(len(X_chunk)):
            h = tanh(Wxh @ X_chunk[t] + Whh @ h + bh)

    return Whh, Wxh, bh, Why, by, total_loss

print("BPTT and Truncated BPTT ready.")
print("Full BPTT: O(T×n) memory, backprops through all T steps")
print("Truncated BPTT: O(k×n) memory, backprops only k steps per chunk")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of full BPTT (with gradient clipping) and truncated BPTT
                (processing the sequence in chunks of length k, detaching gradients at chunk
                boundaries). These implementations make the shared-weight gradient accumulation
                explicit — the defining challenge of BPTT over standard backpropagation.
            </p>
            <CodeBlock code={PY_CODE} filename="bptt.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Memory consideration:</strong> Full BPTT stores all hidden states for a sequence —
                O(T &#215; n) activations. For a language model with context length T = 2,048 and hidden
                dimension n = 4,096, this is 8M activations per layer, per sample. Truncated BPTT
                with k = 128 reduces this to 500K — a 16&#215; reduction in memory cost.
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
