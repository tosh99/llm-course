import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The architecture that saved recurrent networks</h2>
            <p>
                Long Short-Term Memory (LSTM) was introduced by Sepp Hochreiter and Jürgen Schmidhuber
                in their 1997 paper "Long Short-Term Memory" published in Neural Computation. It is one
                of the most cited papers in machine learning history, with thousands of citations and
                continuing impact decades later. Understanding LSTM is essential — not only is it still
                widely used, but every modern memory-based architecture inherits its core design principles.
            </p>
            <h3>The Key Innovations</h3>
            <ul>
                <li><strong>Cell state</strong>: a linear path (the "conveyor belt") through time that
                    carries information unchanged, with gradient = 1 at every step.</li>
                <li><strong>Forget gate</strong>: learns to reset long-term memory when no longer relevant.</li>
                <li><strong>Input gate</strong>: learns when to write new information to long-term memory.</li>
                <li><strong>Output gate</strong>: learns what parts of long-term memory to expose to the
                    next step.</li>
            </ul>
            <h3>Evolution Since 1997</h3>
            <ul>
                <li><strong>1997</strong>: Original LSTM with forget gate, input gate, output gate, peephole connections.</li>
                <li><strong>2000</strong>: Gers & Schmidhuber added peephole connections (1999/2000) to allow gates to see the cell state.</li>
                <li><strong>2014</strong>: Cho et al. introduced GRU, merging forget and input gates into update/reset gates.</li>
                <li><strong>2014</strong>: Sutskever et al. showed LSTMs could achieve state-of-the-art in sequence-to-sequence tasks.</li>
                <li><strong>2015–2020</strong>: LSTMs powered Google Translate, Apple's Siri, and early language models.</li>
            </ul>
            <div className="ch-callout">
                <strong>Legacy:</strong> LSTMs were eventually surpassed by Transformers for language modeling
                tasks (attention can directly "look back" at any previous token). However, LSTMs remain
                important for tasks where memory must be maintained over very long sequences with limited
                compute (e.g., time series, music generation, low-resource settings), and the gating
                mechanism itself lives on in modern architectures.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The robot that knows what to remember and what to forget</h2>

            <Analogy label="The Editor's Desk">
                Imagine you have a big desk (the <strong>cell state</strong>) where you keep all your notes.
                Every time you get new information, you make two decisions:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li><strong>Forget gate</strong>: "What old notes should I throw away?"</li>
                    <li><strong>Input gate</strong>: "What new notes should I add?"</li>
                </ol>
                After you've decided, you update your desk. The key is: the desk updates by adding
                and removing items — but the desk itself (the paper) doesn't change. Whatever was
                on the desk at step 10 is still there (unless you deleted it) — it doesn't get
                overwritten by the passage of time.
            </Analogy>

            <Analogy label="The Superpower: Learning to Forget">
                The most surprising part of LSTM is the <strong>forget gate</strong>. You'd think
                the goal is to remember everything. But Hochreiter &amp; Schmidhuber realised that
                <em>knowing what to forget</em> is equally important.
                <br /><br />
                For a sentence like "The cake was delicious. I ate it.", the LSTM learns to forget
                "cake" after processing "ate it." — it's no longer relevant. For a long story, the
                network learns which characters are still important and which have left the scene.
                The forget gate is a learned decision, not a fixed rule.
            </Analogy>

            <Analogy label="Why Gradients Don't Vanish">
                In a simple RNN, the hidden state is <em>replaced</em> at each step — old information
                is mixed with new, and after many steps the old information is diluted to near-zero.
                <br /><br />
                In an LSTM, the cell state is <em>updated</em> — you add new information to it, but
                the old information is still there (unless you chose to forget it). The gradient can
                flow backwards through this path unchanged because the self-connection has weight exactly 1.0.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The gating mechanism that makes long-term memory possible</h2>

            <h3>The Cell State: A Conveyer Belt Through Time</h3>
            <p>
                The central innovation of LSTM is the <strong>cell state</strong> C<sub>t</sub>,
                a vector that runs through the entire sequence. Information can be added to or removed
                from it, but it travels forward unchanged — until explicitly modified by a gate.
            </p>
            <MathBlock tex="c_t = c_{t-1}" />
            <p>
                (In the simplest case, when the forget gate f<sub>t</sub> = 1 and input gate i<sub>t</sub> = 0.)
            </p>

            <h3>The Three Gates</h3>
            <ul>
                <li><strong>Forget gate</strong> f<sub>t</sub>: A sigmoid that decides what to discard from C<sub>t-1</sub>. Outputs values in [0, 1].</li>
                <li><strong>Input gate</strong> i<sub>t</sub>: A sigmoid that decides what new information to add to C<sub>t</sub>.</li>
                <li><strong>Output gate</strong> o<sub>t</sub>: A sigmoid that decides what parts of C<sub>t</sub> to expose as the hidden state h<sub>t</sub>.</li>
            </ul>

            <h3>The Full LSTM Equations</h3>
            <MathBlock tex="\begin{aligned} f_t &= \sigma(W_f\,h_{t-1} + U_f\,x_t + b_f) \quad &\text{(forget gate)} \\ i_t &= \sigma(W_i\,h_{t-1} + U_i\,x_t + b_i) \quad &\text{(input gate)} \\ \tilde{c}_t &= \tanh(W_c\,h_{t-1} + U_c\,x_t + b_c) \quad &\text{(candidate)} \\ c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t \quad &\text{(cell state)} \\ o_t &= \sigma(W_o\,h_{t-1} + U_o\,x_t + b_o) \quad &\text{(output gate)} \\ h_t &= o_t \odot \tanh(c_t) \quad &\text{(hidden state)} \end{aligned}" />

            <h3>Why the Cell State Prevents Vanishing Gradients</h3>
            <p>
                The gradient of C<sub>t</sub> with respect to C<sub>t-1</sub> is simply f<sub>t</sub> — a
                learned value in [0, 1]. If the network learns f<sub>t</sub> = 1, then
                <InlineMath tex="\frac{\partial c_t}{\partial c_{t-1}} = 1" /> — the gradient flows
                unchanged through 1000 steps, 10000 steps, any distance. This is the
                <strong>constant error carousel</strong>: errors in the cell state don't decay or explode
                as they propagate backwards.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key contrast with simple RNN:</strong> A simple RNN's hidden state transition
                is <em>non-linear</em> (tanh applied after matrix multiplication). Small changes in
                early weights get squashed by tanh and multiplied by W<sub>hh</sub> repeatedly, leading
                to exponential decay. LSTM's cell state update is <em>controlled linear</em>: the network
                learns the best f<sub>t</sub> and i<sub>t</sub> values for the task, giving it the
                expressiveness of a non-linear model with the gradient stability of a linear one.
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
            <h2>The constant error carousel and learned gating</h2>

            <DefBlock label="LSTM Cell Equations (Hochreiter & Schmidhuber, 1997)">
                Given input x<sub>t</sub> and previous hidden state h<sub>t-1</sub>:
                <br /><br />
                Forget gate: <InlineMath tex="f_t = \sigma(W_f h_{t-1} + U_f x_t + b_f)" /> &#8712; [0,1]<sup>n</sup>
                <br />
                Input gate: <InlineMath tex="i_t = \sigma(W_i h_{t-1} + U_i x_t + b_i)" /> &#8712; [0,1]<sup>n</sup>
                <br />
                Candidate cell: <InlineMath tex="\tilde{c}_t = \tanh(W_c h_{t-1} + U_c x_t + b_c)" /> &#8712; [−1,1]<sup>n</sup>
                <br />
                Cell state: <InlineMath tex="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" />
                <br />
                Output gate: <InlineMath tex="o_t = \sigma(W_o h_{t-1} + U_o x_t + b_o)" /> &#8712; [0,1]<sup>n</sup>
                <br />
                Hidden state: <InlineMath tex="h_t = o_t \odot \tanh(c_t)" />
            </DefBlock>

            <h3>The Constant Error Carousel</h3>
            <p>
                The key mathematical property: the cell state is a <strong>controlled linear recurrence</strong>.
                Taking the partial derivative of c<sub>t</sub> with respect to c<sub>t-1</sub>:
                <InlineMath tex="\frac{\partial c_t}{\partial c_{t-1}} = \text{diag}(f_t)" />.
                If f<sub>t</sub> = 1 for all t, then:
                <InlineMath tex="\frac{\partial c_T}{\partial c_0} = I" /> — the identity matrix.
                This is the <strong>constant error carousel</strong>: errors propagate through the cell
                state without attenuation, regardless of the number of time steps.
            </p>

            <h3>Gradient Flow Analysis</h3>
            <p>
                For a loss ℒ at time T depending on h<sub>T</sub>:
                <InlineMath tex="\frac{\partial \mathcal{L}}{\partial c_t} = \frac{\partial \mathcal{L}}{\partial c_T} \cdot \prod_{i=t+1}^{T} \frac{\partial c_i}{\partial c_{i-1}} = \frac{\partial \mathcal{L}}{\partial c_T} \odot \prod_{i=t+1}^{T} f_i" />.
                Each f<sub>i</sub> is in [0, 1]. If the network learns f<sub>i</sub> ≈ 1 for relevant
                steps, the product remains close to 1. If f<sub>i</sub> ≈ 0 for irrelevant steps, the
                gradient is cut — the network actively chooses what to remember and what to forget.
            </p>

            <h3>Gated vs. Un gated Gradient Flow</h3>
            <p>
                In a simple RNN: <InlineMath tex="\frac{\partial h_T}{\partial h_t} \approx W^{T-t}" />.
                With spectral radius ρ(W) &lt; 1: <InlineMath tex="\|\partial h_T/\partial h_t\| \to 0" /> exponentially.
            </p>
            <p>
                In LSTM: <InlineMath tex="\frac{\partial c_T}{\partial c_t} = \prod_{i=t+1}^{T} f_i" />.
                With f<sub>i</sub> ≈ 1: <InlineMath tex="\|\partial c_T/\partial c_t\| = 1" /> exactly.
            </p>

            <h3>Peephole Connections (Gers & Schmidhuber, 2000)</h3>
            <p>
                The original LSTM was extended with peephole connections: the gates can "peek" at
                the cell state before deciding:
                <InlineMath tex="f_t = \sigma(W_f h_{t-1} + U_f c_{t-1} + b_f)" />.
                This allows the gates to make better decisions based on how much is currently stored.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> The LSTM's success is not that it prevents gradients from
                vanishing — it's that it gives the network <em>control</em> over when to preserve and
                when to discard gradient information. The gates learn what the right behaviour should be
                from data, making LSTM a self-regulating memory system.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def tanh(z):
    return np.tanh(z)

# ── LSTM Cell ─────────────────────────────────────────────────────────────────
def lstm_cell(x_t, h_prev, c_prev, params):
    """
    Single LSTM cell forward pass.

    params: dict with keys Wf, Wi, Wc, Wo, Uf, Ui, Uc, Uo, bf, bi, bc, bo
    All gate weights: (hidden_dim, hidden_dim) or (hidden_dim, input_dim)
    Returns: (h_t, c_t)
    """
    Wf, Wi, Wc, Wo = params['Wf'], params['Wi'], params['Wc'], params['Wo']
    Uf, Ui, Uc, Uo = params['Uf'], params['Ui'], params['Uc'], params['Uo']
    bf, bi, bc, bo = params['bf'], params['bi'], params['bc'], params['bo']

    # Gates: sigmoid activation → values in [0, 1]
    f = sigmoid(Uf @ x_t + Wf @ h_prev + bf)   # forget gate
    i = sigmoid(Ui @ x_t + Wi @ h_prev + bi)   # input gate
    o = sigmoid(Uo @ x_t + Wo @ h_prev + bo)   # output gate

    # Candidate cell state: tanh → [-1, 1]
    c_tilde = tanh(Uc @ x_t + Wc @ h_prev + bc)

    # Cell state update: the constant error carousel
    # f * c_prev → keep old memory   (forget gate)
    # i * c_tilde → add new memory  (input gate)
    c = f * c_prev + i * c_tilde

    # Hidden state: controlled by output gate
    h = o * tanh(c)

    return h, c

# ── Full LSTM Forward Pass ─────────────────────────────────────────────────────
def lstm_forward(X, params, h0=None, c0=None):
    """
    Forward pass through LSTM for a sequence.
    X: (seq_len, input_dim)
    Returns: all hidden states and cell states
    """
    seq_len = X.shape[0]
    hidden_dim = params['Wf'].shape[0]

    h0 = np.zeros(hidden_dim) if h0 is None else h0
    c0 = np.zeros(hidden_dim) if c0 is None else c0

    H = [h0]
    C = [c0]

    for t in range(seq_len):
        h_t, c_t = lstm_cell(X[t], H[-1], C[-1], params)
        H.append(h_t)
        C.append(c_t)

    return np.array(H[1:]), np.array(C[1:])  # (seq_len, hidden_dim)

# ── Demo: Cell state gradient stays constant ────────────────────────────────────
print("=" * 60)
print("LSTM Cell: Gradient Flow Comparison")
print("=" * 60)

hidden_dim = 4
h0 = np.zeros(hidden_dim)
c0 = np.zeros(hidden_dim)

# Simulate a cell with mostly-open forget gate
# (network learns this for important long-range dependencies)
x_t = np.random.randn(hidden_dim)
c_prev = np.ones(hidden_dim) * 0.8

# Learned params (simplified: U=0, W=0, b=forget_gate_bias)
# With b_f large → forget gate → 1.0
f = sigmoid(np.ones(hidden_dim) * 4.0)   # ~0.98 (forget gate open)
i = sigmoid(np.ones(hidden_dim) * -4.0)  # ~0.02 (input gate mostly closed)
c_tilde = np.tanh(np.zeros(hidden_dim))  # 0
c = f * c_prev + i * c_tilde

print(f"Forget gate f ≈ {f[0]:.4f} (mostly open → keep memory)")
print(f"Input gate  i ≈ {i[0]:.4f} (mostly closed → little new input)")
print(f"Cell state: c_t ≈ {c[0]:.4f} (≈ c_prev → gradient flows unchanged!)")
print()
print("∂c_t/∂c_{t-1} = f ≈ 1.0 → gradient does NOT vanish!")
print("After 100 steps with f≈1: gradient ≈ 1^100 = 1.0 (constant!)")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of the LSTM cell (forward pass) and full sequence
                forward pass. Includes a demo showing the constant error carousel in action:
                when the forget gate is open (f ≈ 1) and input gate is closed (i ≈ 0),
                the cell state preserves information across arbitrary sequence lengths.
            </p>
            <CodeBlock code={PY_CODE} filename="lstm_numpy.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LSTM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
