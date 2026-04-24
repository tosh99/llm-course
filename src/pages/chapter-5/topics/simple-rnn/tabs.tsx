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
            year: "1986",
            title: "Rumelhart, Hinton & Williams — Backpropagation",
            challenge:
                "After Minsky & Papert's 1969 result, neural network research stalled for nearly two decades. Researchers knew multilayer networks could theoretically solve XOR and represent non-linear functions, but there was no efficient algorithm to train them.",
            what: "Rumelhart, Hinton & Williams published their landmark paper on backpropagation in Nature (1986). They showed that by applying the chain rule of calculus backwards through a multilayer network, gradients could be computed efficiently — making training deep networks practical for the first time.",
            impact:
                "Backpropagation unlocked multilayer neural networks. Combined with non-linear activation functions (sigmoid, tanh), networks could now learn arbitrary non-linear mappings. This revived neural network research and set the stage for everything that followed.",
        },
        {
            year: "1990",
            title: "Elman & Jordan Networks — Adding Memory to Neural Nets",
            challenge:
                "Standard feedforward networks treat each input independently — they have no memory of what came before. For sequences like sentences, stock prices, or speech, context from previous steps is essential. How could a neural network remember past inputs?",
            what: "Jeffrey Elman (1990) proposed the Simple Recurrent Network (SRN), also called the Elman network: a hidden layer's activations are fed back as input at the next time step, giving the network a simple form of memory. Jordan (1990) independently proposed a similar architecture with additional context units.",
            impact:
                "Elman networks were the first practical recurrent architectures. They introduced the core idea that has defined sequence modeling ever since: hidden states carry information forward in time. The architecture is simple but foundational — every modern RNN, LSTM, and even Transformer was conceived relative to this primitive.",
        },
        {
            year: "1991",
            title: "Sepp Hochreiter's Diploma Thesis — The Vanishing Gradient",
            challenge:
                "As researchers tried to train RNNs on long sequences, they found that gradients from distant time steps were vanishing to nearly zero — the network simply couldn't learn long-range dependencies. This wasn't a software bug; it was a fundamental mathematical property of backpropagation through time.",
            what: "In his 1991 diploma thesis (published 1991 in Neuromorphic Information Processing), Hochreiter identified and mathematically characterized the vanishing gradient problem: when backpropagating errors through many time steps, the gradient is repeatedly multiplied by the same Jacobian matrix. If the dominant eigenvalue of that matrix is less than 1, gradients decay exponentially with distance. If greater than 1, they explode.",
            impact:
                "This diagnosis was precise and devastating. It showed that standard RNNs were fundamentally incapable of learning long-range dependencies — no amount of clever engineering within the existing framework would fix it. A new architecture with a mechanism to preserve gradients over long sequences was needed.",
        },
        {
            year: "1997",
            title: "Hochreiter & Schmidhuber — Long Short-Term Memory (LSTM)",
            challenge:
                "With the vanishing gradient problem precisely characterized, the question became: how do you build a recurrent network that can preserve gradient flow over arbitrarily long sequences? The answer required rethinking what information should flow through time.",
            what: "Hochreiter and Schmidhuber published their LSTM paper in Neural Computation (1997). The key innovation was the constant error carousel (CEC): a special linear unit (the cell state) with self-recurrent connection of weight 1.0, combined with input and forget gates that decide what information enters and leaves. Because the cell state's recurrent weight is fixed at 1, gradients flow unchanged through time — no vanishing, no explosion.",
            impact:
                "LSTM was the breakthrough that made RNNs useful in practice. It became the dominant architecture for sequence modeling for nearly two decades — speech recognition, language modeling, machine translation, time series. The original 1997 formulation has been refined many times, but the core intuition (learned gating of information flow) remains unchanged.",
        },
        {
            year: "2014",
            title: "Cho et al. — Gated Recurrent Units (GRU)",
            challenge:
                "LSTM worked beautifully, but its original formulation had many moving parts: input gate, forget gate, output gate, cell state, peephole connections. Researchers wanted something simpler that captured the essential gating intuition.",
            what: "Cho, Chung, Graves et al. (2014) introduced the Gated Recurrent Unit at COLING 2014. The GRU merged the input and forget gates into update and reset gates, producing a simpler architecture with fewer parameters. GRUs achieved comparable performance to LSTMs on many tasks while being more computationally efficient.",
            impact:
                "The GRU demonstrated that the gating mechanism — not the specific LSTM formulation — was the key to solving the vanishing gradient. It also accelerated research by giving practitioners a simpler alternative. Today, both LSTMs and GRUs are widely used, with Transformer attention replacing both for many language tasks.",
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
            <h2>How do you make a neural network remember?</h2>

            <Analogy label="The Reading a Story Analogy">
                Imagine reading a sentence: <em>"The cat sat on the mat."</em> Your brain doesn't just look at each word in isolation — it remembers the words that came before. When you see "sat," you know it's the cat that sat, not something else.
                <br /><br />
                A <strong>feedforward neural network</strong> is like reading each word with your eyes closed, one at a time, without remembering any previous words. An <strong>RNN</strong> is like actually reading the sentence — each word gets processed while remembering the ones before it.
            </Analogy>

            <Analogy label="Simple RNN — A Robot with Short-Term Memory">
                Think of a robot that watches a video one frame at a time. It has a little notepad (the hidden state) where it writes down what it thinks is important. When the next frame comes, it looks at the new frame AND reads its old notepad, then writes a new summary.
                <br /><br />
                This is the Elman network: the notepad's contents get mixed with new information at every step. But there's a problem: the notepad has limited space, and old information gets overwritten by new information. After about 7-10 steps, the robot usually forgets what happened at the beginning. This is the <strong>vanishing gradient problem</strong>.
            </Analogy>

            <Analogy label="LSTM — A Robot with a Long-Term Diary">
                Hochreiter and Schmidhuber had a brilliant idea: instead of one notepad, give the robot <strong>two</strong> notebooks.
                <br /><br />
                One is a <em>short-term notepad</em> (the hidden state) that gets updated at each step. But there's also a <strong>long-term diary</strong> (the cell state) that's very hard to change. The robot has two decisions at each step:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li><strong>What should I remember from right now?</strong> (input gate)</li>
                    <li><strong>What should I forget from the diary?</strong> (forget gate)</li>
                </ol>
                Because the diary is connected to itself with a weight of exactly 1.0, anything written there stays there — the robot can keep information for as long as it needs.
            </Analogy>

            <Analogy label="The Gates — Learned Decisions">
                The gates in an LSTM are like little on/off switches that the network learns. The <strong>forget gate</strong> decides: "Should I erase this memory?" The <strong>input gate</strong> decides: "Should I write something new?"
                <br /><br />
                Think of it like editing a document: before adding new text, you decide what old text to delete, and then you write new text in its place. But unlike a human editor, the LSTM learns these decisions automatically from data — no programmer tells it what to remember.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Neural networks that read sequences, not just single inputs</h2>

            <h3>The Simple RNN Forward Pass</h3>
            <p>
                An RNN processes a sequence one element at a time. At each time step t, it takes
                an input <strong>x<sub>t</sub></strong> and a previous hidden state <strong>h<sub>t-1</sub></strong>,
                and produces a new hidden state <strong>h<sub>t</sub></strong>:
            </p>
            <MathBlock tex="h_t = \tanh(W_{xh}\,x_t + W_{hh}\,h_{t-1} + b_h)" />
            <p>
                The hidden state <strong>h<sub>t</sub></strong> is essentially a compressed summary of
                everything the network has seen so far. For sequence classification, a final output
                is computed from the last hidden state: <InlineMath tex="y = \text{softmax}(W_{hy}\,h_T + b_y)" />.
            </p>

            <h3>Elman vs. Jordan Networks</h3>
            <ul>
                <li><strong>Elman network</strong>: hidden state h<sub>t</sub> feeds back to itself at the next step. Simple and widely used.</li>
                <li><strong>Jordan network</strong>: the output y<sub>t</sub> feeds back as input to the hidden layer at the next step. This provides a stronger memory signal but is less general.</li>
            </ul>

            <h3>Why the Hidden State Collapses Over Time</h3>
            <p>
                Consider what happens when we unroll an RNN through time. To compute the gradient
                with respect to an early weight, we must backpropagate through every intermediate
                time step. The gradient is multiplied by the same Jacobian matrix <strong>W<sub>hh</sub></strong> at each step:
            </p>
            <MathBlock tex="\frac{\partial h_t}{\partial h_{t-k}} = (W_{hh}^\top)^{k} \cdot \prod_{i=t-k}^{t-1} \text{diag}(\sigma'(z_i))" />
            <p>
                If the largest eigenvalue of <strong>W<sub>hh</sub></strong> is less than 1, and the
                sigmoid derivative is bounded by 0.25, the gradient decays exponentially with
                the number of steps k. After 20 steps, the gradient might be on the order of 10<sup>-12</sup> — effectively zero.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The geometric picture:</strong> The hidden state space in a simple RNN is like a room with echoes. Information you inject at step 1 echoes louder and louder as it bounces off the walls — but every bounce also distorts it. After too many bounces, the echo becomes pure noise. LSTMs solve this by building a hallway (the cell state) where echoes travel unchanged — they just pass through.
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
            <h2>Formal analysis of RNN dynamics and the vanishing gradient</h2>

            <DefBlock label="Simple RNN Recurrence">
                Given input sequence <InlineMath tex="(x_1, x_2, \ldots, x_T)" /> and initial hidden state
                <InlineMath tex="h_0 = 0" />, the hidden state at time t is:
                <InlineMath tex="h_t = \sigma(W_{xh}x_t + W_{hh}h_{t-1} + b_h)" />,
                where <InlineMath tex="\sigma(z) = \tanh(z)" /> is the non-linear activation.
            </DefBlock>

            <h3>Gradient Flow Through Time</h3>
            <p>
                The gradient of the loss at time T with respect to a weight at time t is obtained
                by backpropagating through the intermediate steps. For a weight <strong>W<sub>hh</sub></strong>:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}}{\partial h_T} \cdot \frac{\partial h_T}{\partial h_t} \cdot \frac{\partial h_t}{\partial W_{hh}}" />
            <p>
                The term <InlineMath tex="\frac{\partial h_T}{\partial h_t}" /> is the product of Jacobians:
            </p>
            <MathBlock tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} \frac{\partial h_i}{\partial h_{i-1}} = \prod_{i=t+1}^{T} W_{hh}^\top \cdot \text{diag}(\tanh'(z_i))" />
            <p>
                Each factor <InlineMath tex="\frac{\partial h_i}{\partial h_{i-1}}" /> has spectral radius
                bounded by <InlineMath tex="\|W_{hh}^\top\| \cdot 0.25" /> (since tanh' ≤ 1 and at tanh saturation = 0).
                If <InlineMath tex="\|W_{hh}\| &lt; 4" />, gradients vanish exponentially in the lag k = T − t.
            </p>

            <h3>Eigenvalue Analysis</h3>
            <p>
                Decompose <InlineMath tex="W_{hh} = Q\Lambda Q^{-1}" />. Then:
                <InlineMath tex="(W_{hh}^\top)^k = Q\Lambda^k Q^{-1}" />.
                If the largest eigenvalue <InlineMath tex="|\lambda_1| &lt; 1" />, then
                <InlineMath tex="\lambda_1^k \to 0" /> exponentially as k grows. The network cannot
                retain information from steps where <InlineMath tex="|\lambda_1|^k \approx 0" />.
            </p>

            <h3>LSTM: Constant Error Carousel</h3>
            <p>
                The LSTM cell state update is:
                <InlineMath tex="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" />,
                where f<sub>t</sub>, i<sub>t</sub> &#8712; [0,1]<sup>n</sup> are gate values.
                If f<sub>t</sub> = 1 and i<sub>t</sub> = 0 for all t, then c<sub>t</sub> = c<sub>t-1</sub> —
                errors propagate unchanged: <InlineMath tex="\frac{\partial c_t}{\partial c_{t-k}} = 1" />.
            </p>
            <p>
                Gates are computed with sigmoid activations to keep values in [0,1]:
                <InlineMath tex="f_t = \sigma(W_f h_{t-1} + U_f x_t + b_f)" />.
                The network learns to set f<sub>t</sub> ≈ 1 for relevant long-term information
                and f<sub>t</sub> ≈ 0 for discarded information.
            </p>

            <div className="ch-callout">
                <strong>Key theorem (Hochreiter, 1991):</strong> A standard RNN with sigmoid or tanh activations
                cannot learn long-range dependencies because the gradient of the loss with respect to
                early parameters decays exponentially in the distance between that parameter's time step
                and the output time step. LSTM and GRU architectures circumvent this by providing
                a linear path (the cell state / reset mechanism) through which gradients can flow unchanged.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Simple RNN Forward Pass ───────────────────────────────────────────────────
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def tanh(z):
    return np.tanh(z)

def rnn_step(x_t, h_prev, Whh, Wxh, bh):
    """
    Single step of a simple RNN.
    x_t:  (input_dim,)   — input at time t
    h_prev: (hidden_dim,) — hidden state from previous step
    Returns: hidden state at time t
    """
    z = Wxh @ x_t + Whh @ h_prev + bh
    h_t = tanh(z)
    return h_t

def rnn_forward(X, Whh, Wxh, bh):
    """
    Forward pass through a simple RNN for a sequence.
    X:     (seq_len, input_dim)
    Returns: all hidden states
    """
    T = len(X)
    hidden_dim = Whh.shape[0]
    H = np.zeros((T + 1, hidden_dim))   # H[0] = h_0 = 0
    for t in range(T):
        H[t+1] = rnn_step(X[t], H[t], Whh, Wxh, bh)
    return H

# ── Backpropagation Through Time (BPTT) ───────────────────────────────────────
def rnn_bptt(X, y_target, Whh, Wxh, bh, Why, by, lr=0.01, epochs=100):
    """
    Train an RNN with truncated BPTT on a sequence classification task.
    X: (seq_len, input_dim), y_target: (seq_len, output_dim)
    """
    seq_len = len(X)
    hidden_dim = Whh.shape[0]
    output_dim = y_target.shape[1]

    for epoch in range(epochs):
        # Forward pass
        H = rnn_forward(X, Whh, Wxh, bh)
        # Output from last hidden state
        y_pred = softmax(H[-1] @ Why + by)

        # Backward pass: output layer
        delta_out = y_pred - y_target[-1]    # cross-entropy gradient
        dWhy = np.outer(H[-1], delta_out)
        dby = delta_out

        # Backward pass: truncated BPTT (only go back seq_len steps)
        delta_h = Why @ delta_out            # error flowing back to hidden
        dWhh = np.zeros_like(Whh)
        dWxh = np.zeros_like(Wxh)
        dbh  = np.zeros_like(bh)

        for t in reversed(range(seq_len)):
            delta_h = delta_h * (1 - H[t+1]**2)   # tanh' derivative
            dWhh += np.outer(H[t], delta_h)
            dWxh += np.outer(X[t], delta_h)
            dbh  += delta_h
            delta_h = Whh.T @ delta_h             # flow error one step back

        # Gradient clipping to prevent explosion
        for d in [dWhh, dWxh, dbh, dWhy, dby]:
            np.clip(d, -5, 5, out=d)

        # Gradient step
        Whh -= lr * dWhh
        Wxh -= lr * dWxh
        bh  -= lr * dbh
        Why -= lr * dWhy
        by  -= lr * dby

    return Whh, Wxh, bh, Why, by

# ── Simple LSTM Cell ────────────────────────────────────────────────────────────
def lstm_cell(x_t, h_prev, c_prev, params):
   Wf, Wi, Wc, Wo, Wy, bf, bi, bc, bo, by = params

    # Gates: sigmoid activations → values in [0, 1]
    f = sigmoid(Wf @ h_prev + bf)   # forget gate
    i = sigmoid(Wi @ h_prev + bi)   # input gate
    o = sigmoid(Wo @ h_prev + bo)   # output gate

    # Candidate cell state
    c_tilde = np.tanh(Wc @ h_prev + bc)

    # Cell state update — the constant error carousel
    c = f * c_prev + i * c_tilde    # linear self-loop (gradient flows unchanged!)

    # Hidden state
    h = o * np.tanh(c)

    return h, c

def softmax(z):
    e = np.exp(z - np.max(z))
    return e / e.sum()

print("Simple RNN and LSTM implementations ready.")
print("Key insight: LSTM's c = f*c_prev + i*c_tilde has self-loop weight = 1")
print("→ gradients flow unchanged: ∂c_t/∂c_{t-k} = 1 → no vanishing!")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of the Simple RNN forward pass, BPTT training,
                and the LSTM cell. These are the foundational algorithms — everything
                in modern PyTorch/TensorFlow traces back to these equations.
            </p>
            <CodeBlock code={PY_CODE} filename="rnn_numpy.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Note:</strong> In production, you would use <code>torch.nn.RNN</code> or
                <code>torch.nn.LSTM</code> which handle gradient clipping, cuDNN acceleration,
                and variable-length sequences. But the equations above are exactly what those
                implementations compute.
            </div>
        </>
    )
}



// ── Tab content map ───────────────────────────────────────────────────────────

export const SIMPLE_RNN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
