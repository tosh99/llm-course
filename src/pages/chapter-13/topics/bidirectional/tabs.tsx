import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Reading the future to understand the present</h2>
            <p>
                Standard RNNs process sequences left-to-right, meaning the representation at time t
                only depends on words 1 through t. But in many tasks — speech recognition, machine
                translation, named entity recognition — knowing what comes <em>after</em> a word is
                just as important as knowing what came before. Bidirectional RNNs solve this by
                running two RNNs in opposite directions and concatenating their hidden states.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1997</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Schuster &amp; Paliwal — Bidirectional Recurrent Neural Networks</div>
                    <div className="ch-tl-body">
                        Mike Schuster and Kuldip K. Paliwal at NTT published "Bidirectional Recurrent
                        Neural Networks" in IEEE Transactions on Signal Processing. They proposed
                        running one RNN forward over the input sequence and another backward, then
                        combining the two hidden states at each position. The forward layer captures
                        prefix context; the backward layer captures suffix context. Both are trained
                        jointly by backpropagation through time.
                    </div>
                    <div className="ch-tl-impact">Impact: Instant accuracy gains on phoneme classification and speech recognition</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2005</div>
                    <div className="ch-tl-section-label">Generalization</div>
                    <div className="ch-tl-title">Bidirectional LSTM</div>
                    <div className="ch-tl-body">
                        Alex Graves and Jürgen Schmidhuber combined bidirectional processing with
                        LSTM cells to create Bidirectional LSTM (BLSTM). This became the dominant
                        architecture for handwriting recognition (IAM dataset) and phoneme recognition
                        (TIMIT) throughout the 2000s. The forward and backward LSTMs each had their
                        own cell states, creating four parallel information highways through time.
                    </div>
                    <div className="ch-tl-impact">Impact: BLSTM became the go-to architecture for sequence labeling before CNNs and Transformers</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 – 2015</div>
                    <div className="ch-tl-section-label">NLP Adoption</div>
                    <div className="ch-tl-title">Bidirectional RNNs in Neural MT and Tagging</div>
                    <div className="ch-tl-body">
                        As neural NLP matured, bidirectional encoders became standard. Bahdanau's
                        2014 attention model used a bidirectional encoder to give each source position
                        context from both directions. Named entity recognition systems (Lample et al.,
                        2016) used bidirectional LSTMs with CRF output layers. The principle was
                        simple and universal: if you can see the whole sentence, use both directions.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default encoder design in every seq2seq and tagging system</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – Present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">From Bi-RNN to Bidirectional Transformer</div>
                    <div className="ch-tl-body">
                        The Transformer is inherently bidirectional in its encoder (every position
                        attends to every other position). BERT's masked language model pre-training
                        is a direct descendant of the bidirectional principle — reading the full
                        context to predict a masked word. The bidirectional RNN was the first
                        practical neural architecture to operationalize this idea.
                    </div>
                    <div className="ch-tl-impact">Impact: Conceptual ancestor of BERT and all bidirectional pre-training</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The fundamental trade-off:</strong> Bidirectional RNNs require the entire
                input sequence before producing any output. This makes them unsuitable for
                real-time streaming tasks but ideal for offline tasks like translation, sentiment
                analysis, and entity recognition where latency is less critical than accuracy.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Two friends reading a book from opposite ends</h2>

            <Analogy label="The One-Way Reader (Vanilla RNN)">
                Imagine reading a mystery novel but with a strange rule: you can only read from
                page 1 forward. When you reach chapter 5, you have no idea who the villain is
                because that reveal happens in chapter 20. Your understanding of chapter 5 is
                incomplete because you haven't seen the future yet.
            </Analogy>

            <Analogy label="The Two-Way Reader (Bidirectional RNN)">
                Now imagine you have two copies of the book and two friends. One friend reads
                normally from page 1. The other friend starts at the last page and reads backward.
                At every chapter, they compare notes. The forward-reading friend tells you what
                clues have been set up. The backward-reading friend tells you which clues will
                become important later.
                <br /><br />
                When they meet in the middle, they have the complete picture. Every chapter is
                understood in the context of the entire book, not just what came before it.
            </Analogy>

            <Analogy label="Real-World Example: Name Recognition">
                Suppose you see the word "Washington" in a sentence. If the sentence starts with
                "George Washington was..." you know it's a person. But what if you only see
                "...visited Washington yesterday"? Reading forward, you just see a place name.
                Reading backward from "yesterday" doesn't help either. But a bidirectional reader
                sees both sides: "The president visited Washington yesterday for a summit." Now
                the forward context ("The president") and backward context ("for a summit") both
                confirm it's the city, not the person.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Forward and backward passes combined</h2>

            <h3>Architecture</h3>
            <p>
                A bidirectional RNN (Bi-RNN) consists of two independent RNN layers processing the
                same input sequence in opposite directions:
            </p>
            <ul>
                <li><strong>Forward RNN</strong> (h⃗): processes x<sub>1</sub>, x<sub>2</sub>, …, x<sub>T</sub> left-to-right</li>
                <li><strong>Backward RNN</strong> (h⃖): processes x<sub>T</sub>, x<sub>T-1</sub>, …, x<sub>1</sub> right-to-left</li>
            </ul>

            <h3>Forward Pass Equations</h3>
            <MathBlock tex="\overrightarrow{\mathbf{h}}_t = f\!\left(\overrightarrow{\mathbf{W}} \mathbf{x}_t + \overrightarrow{\mathbf{U}} \overrightarrow{\mathbf{h}}_{t-1} + \overrightarrow{\mathbf{b}}\right) \qquad t = 1, \dots, T" />
            <MathBlock tex="\overleftarrow{\mathbf{h}}_t = f\!\left(\overleftarrow{\mathbf{W}} \mathbf{x}_t + \overleftarrow{\mathbf{U}} \overleftarrow{\mathbf{h}}_{t+1} + \overleftarrow{\mathbf{b}}\right) \qquad t = T, \dots, 1" />

            <h3>Output Representation</h3>
            <p>
                At each position t, the two directional hidden states are concatenated to form
                the bidirectional representation:
            </p>
            <MathBlock tex="\mathbf{h}_t = \left[\overrightarrow{\mathbf{h}}_t;\; \overleftarrow{\mathbf{h}}_t\right] \in \mathbb{R}^{2n}" />
            <p>
                Alternatively, they can be summed or averaged: h<sub>t</sub> = h⃗<sub>t</sub> + h⃖<sub>t</sub>.
                Concatenation is the most common choice because it preserves all information from
                both directions.
            </p>

            <h3>Training</h3>
            <p>
                Both RNNs share the same loss function and are trained jointly. Backpropagation
                through time runs separately for each direction. The forward RNN's gradients flow
                backward in time from T to 1; the backward RNN's gradients flow "forward in reverse"
                from 1 to T. Because the two RNNs do not interact during the forward pass (except
                at the output layer), their gradients are independent until the final concatenation.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Why doubling the parameters is worth it:</strong> In a unidirectional RNN,
                information from position t+1 must travel through the recurrence to reach position t,
                attenuating at every step. In a Bi-RNN, position t receives direct, unattenuated
                information from both t−1 and t+1. For tasks like part-of-speech tagging, this
                typically improves accuracy by 3–8 absolute percentage points.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal specification and gradient independence</h2>

            <DefBlock label="Bidirectional RNN — Formal Specification">
                Input sequence: X = (x<sub>1</sub>, …, x<sub>T</sub>), each x<sub>t</sub> ∈ ℝ<sup>d</sup>.
                Forward parameters: W⃗ ∈ ℝ<sup>n×d</sup>, U⃗ ∈ ℝ<sup>n×n</sup>, b⃗ ∈ ℝ<sup>n</sup>.
                Backward parameters: W⃖ ∈ ℝ<sup>n×d</sup>, U⃖ ∈ ℝ<sup>n×n</sup>, b⃖ ∈ ℝ<sup>n</sup>.
                Activation f is typically tanh. Output function g combines the two states.
            </DefBlock>

            <h3>Forward Computation</h3>
            <MathBlock tex="\overrightarrow{\mathbf{h}}_t = f\bigl(\overrightarrow{\mathbf{W}} \mathbf{x}_t + \overrightarrow{\mathbf{U}} \overrightarrow{\mathbf{h}}_{t-1} + \overrightarrow{\mathbf{b}}\bigr)" />
            <MathBlock tex="\overleftarrow{\mathbf{h}}_t = f\bigl(\overleftarrow{\mathbf{W}} \mathbf{x}_t + \overleftarrow{\mathbf{U}} \overleftarrow{\mathbf{h}}_{t+1} + \overleftarrow{\mathbf{b}}\bigr)" />
            <MathBlock tex="\mathbf{h}_t = g\bigl(\overrightarrow{\mathbf{h}}_t, \overleftarrow{\mathbf{h}}_t\bigr) = \bigl[\overrightarrow{\mathbf{h}}_t;\; \overleftarrow{\mathbf{h}}_t\bigr]" />

            <h3>Gradient Decomposition</h3>
            <p>
                Because the forward and backward RNNs do not share hidden states, the gradient
                with respect to the input decomposes cleanly:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{x}_t} = \overrightarrow{\mathbf{W}}^\top \frac{\partial \mathcal{L}}{\partial \overrightarrow{\mathbf{h}}_t} + \overleftarrow{\mathbf{W}}^\top \frac{\partial \mathcal{L}}{\partial \overleftarrow{\mathbf{h}}_t}" />
            <p>
                The two terms are computed independently. This means Bi-RNN training is trivially
                parallelizable across directions: you can compute the forward BPTT and backward
                BPTT on separate GPU streams and synchronize only at the input gradient.
            </p>

            <h3>Computational Complexity</h3>
            <MathBlock tex="\text{Time:}\quad O(2 \cdot T \cdot n^2) = O(T \cdot n^2) \text{ (same asymptotic, 2× constant)}" />
            <MathBlock tex="\text{Memory:}\quad O(2 \cdot T \cdot n) = O(T \cdot n) \text{ (must store both directional hidden states)}" />
            <p>
                The memory cost is the practical bottleneck. For T = 1000 and n = 1024, storing
                both directions requires ~8MB of hidden-state memory per layer per sample. In
                practice, gradient checkpointing (recomputing h during backward instead of storing
                it) is often used to trade compute for memory.
            </p>

            <div className="ch-callout">
                <strong>Bidirectional masking in Transformers:</strong> BERT uses a "masked language
                model" because a Transformer encoder is fully bidirectional — every position attends
                to every other position. GPT, being autoregressive, is strictly unidirectional.
                This architectural choice (bidirectional vs unidirectional) is the single biggest
                difference between BERT-style and GPT-style pre-training.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Bidirectional RNN — NumPy ─────────────────────────────────────────────────
class BiRNN:
    """Simple bidirectional RNN with tanh activation."""
    def __init__(self, input_dim, hidden_dim, seed=42):
        rng = np.random.default_rng(seed)
        self.hidden_dim = hidden_dim
        # Forward params
        self.Wf = rng.normal(0, 0.01, (hidden_dim, input_dim))
        self.Uf = rng.normal(0, 0.01, (hidden_dim, hidden_dim))
        self.bf = np.zeros(hidden_dim)
        # Backward params
        self.Wb = rng.normal(0, 0.01, (hidden_dim, input_dim))
        self.Ub = rng.normal(0, 0.01, (hidden_dim, hidden_dim))
        self.bb = np.zeros(hidden_dim)

    def _rnn_forward(self, X, W, U, b):
        """Standard left-to-right RNN. X: (T, d) → H: (T, n)"""
        T = X.shape[0]
        H = np.zeros((T, self.hidden_dim))
        h = np.zeros(self.hidden_dim)
        for t in range(T):
            h = np.tanh(W @ X[t] + U @ h + b)
            H[t] = h
        return H

    def forward(self, X):
        """Returns concatenated hidden states: (T, 2*hidden_dim)"""
        Hf = self._rnn_forward(X, self.Wf, self.Uf, self.bf)
        Hb = self._rnn_forward(X[::-1], self.Wb, self.Ub, self.bb)[::-1]
        return np.concatenate([Hf, Hb], axis=1)


# ── Demo ──────────────────────────────────────────────────────────────────────
T, input_dim, hidden_dim = 10, 4, 6
rng = np.random.default_rng(3)
X = rng.normal(0, 0.5, (T, input_dim))

bi = BiRNN(input_dim, hidden_dim)
H = bi.forward(X)

print("Bidirectional RNN Demo")
print("=" * 45)
print(f"Sequence length : {T}")
print(f"Input dim       : {input_dim}")
print(f"Hidden dim      : {hidden_dim} (each direction)")
print(f"Output dim      : {H.shape[1]}")
print()
print("Concatenated hidden states (first 4 dims = forward, last 4 = backward):")
for t in range(T):
    fwd_norm = np.linalg.norm(H[t, :hidden_dim])
    bwd_norm = np.linalg.norm(H[t, hidden_dim:])
    print(f"  t={t:2d}: ||h→||={fwd_norm:.3f}  ||h←||={bwd_norm:.3f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of a simple bidirectional RNN. The backward pass is
                implemented by reversing the input sequence, running the same RNN forward
                function, then reversing the output back. States are concatenated at each step.
            </p>
            <CodeBlock code={PY_CODE} filename="birnn.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BIDIRECTIONAL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
