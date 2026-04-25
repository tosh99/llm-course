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
            title: "The Bridge from Autoencoders — Sequences Need Memory",
            challenge:
                "Chapter 5 showed that backpropagation could train networks to compress and reconstruct fixed-size inputs: autoencoders learned compact hidden representations of images and data vectors. But language, speech, music, and biological signals are fundamentally different — they are sequences where meaning is temporal. The word 'not' reverses everything that follows it; a musical note only makes sense in the rhythmic and harmonic context of what came before. Feedforward networks, even with multiple layers, had no mechanism to carry information from one time step to the next. Each input was processed in isolation.",
            what: "The year 1986 was dominated by the landmark backpropagation paper: Rumelhart, Hinton, and Williams published 'Learning Representations by Back-propagating Errors' in Nature. While primarily establishing the general algorithm, the paper also hinted at recurrent extensions. Simultaneously, researchers began exploring how to extend the differentiable computation graph into the time dimension — the first conceptual step toward recurrent networks.",
            impact:
                "Backpropagation itself was the prerequisite. Without an efficient gradient-computation method for multi-layer networks, recurrent architectures could not be trained at all. The 1986 paper planted the seed: if you can backpropagate through layers, you should be able to backpropagate through time steps — a network unrolled through time is just a very deep feedforward network with shared weights.",
        },
        {
            year: "1986–1989",
            title: "Jordan Networks — Output-to-Hidden Feedback",
            challenge:
                "Standard feedforward networks treat each input independently. For sequence tasks like predicting the next phoneme in speech or the next word in a sentence, this is a crippling limitation: the network cannot use what it just produced to influence what it produces next. Speech recognition in particular suffered because phonemes carry strong dependencies on the phoneme sequence that preceded them.",
            what: "Michael I. Jordan (1986) proposed what became known as the Jordan network: instead of simple feedforward computation, the network fed its output y&#8329; back as an additional input at the next time step. Context units stored the previous output and were concatenated with the new input before being processed by the hidden layer. Williams and Zipser (1989) extended this with a general formulation of real-time recurrent learning (RTRL), showing how gradients could be computed efficiently in online settings where the sequence is processed one step at a time.",
            impact:
                "Jordan networks introduced the fundamental idea that a network's own outputs could serve as contextual input for future steps. This created the first explicit model of sequential context in neural networks. Though simple — the feedback was from the output, not the hidden state — Jordan networks could capture short-range dependencies and performed well on rhythm-learning and speech-timing tasks. They also laid the conceptual foundation for distinguishing output feedback (Jordan) from hidden-state feedback (Elman), which would prove the more powerful design.",
        },
        {
            year: "1990",
            title: "Elman Networks — Hidden-State Feedback and 'Finding Structure in Time'",
            challenge:
                "Jordan's output feedback was a useful trick, but it had a serious limitation: the output is typically a simplified, low-dimensional signal (e.g., a probability over a vocabulary). Feeding back only the output discards the rich internal representation computed by the hidden layer. What researchers really wanted was for the hidden state — the network's full internal 'belief' about what it had seen — to persist across time steps.",
            what: "Jeffrey Elman published 'Finding Structure in Time' in Cognitive Science (1990), proposing the Simple Recurrent Network (SRN), now called the Elman network. The key innovation was to feed back the hidden layer's own activations from the previous time step: at step t, the hidden layer receives both the current input x&#8329; and a copy of h&#8330;&#8331;&#8321; (called context units). The resulting recurrence h&#8329; = tanh(W&#8330;&#8331;h&#8330;&#8331;&#8321; + W&#8330;&#8331;x&#8329; + b) creates a genuine memory: the hidden state is a function of the entire history of inputs processed so far.",
            impact:
                "Elman's paper was transformative for cognitive science and neural networks alike. It showed experimentally that SRNs could learn grammatical structure from sequences of words, discovering syntactic regularities without explicit grammar rules. For neural networks, it established the simple RNN as the canonical recurrent architecture. Every modern RNN, LSTM, GRU, and even the sequence processing in Transformers descends from Elman's insight: maintain a hidden state that summarises the sequence so far and update it at each step using both new input and old context.",
        },
        {
            year: "1989–1991",
            title: "Werbos, Williams-Zipser — Backpropagation Through Time Formalised",
            challenge:
                "Jordan and Elman networks could be trained, but the theoretical foundations of gradient computation through time were not yet rigorous. How exactly should gradients flow backward through a network with temporal self-connections? For a feedforward network, backpropagation was well understood. For a recurrent network processing a length-T sequence, the gradient of a loss at time T with respect to a weight used at time t required tracing through all intermediate time steps — a process not fully systematised.",
            what: "Paul Werbos had actually sketched the idea of backpropagation through time as early as his 1974 PhD thesis, but the full formulation appeared in his 1990 paper 'Backpropagation Through Time: What It Does and How to Do It.' The key insight is conceptual: an RNN processing a length-T sequence can be unrolled into a T-layer feedforward network where all layers share the same weights. Standard backpropagation on this unrolled network gives gradients for every time step. Williams and Zipser (1989) also formalised the related online algorithm RTRL, which computes gradients incrementally without unrolling.",
            impact:
                "Formalising BPTT made recurrent networks trainable with standard gradient-based optimisers. The shared-weight constraint — the same W&#8330;&#8331; is used at every time step — introduces a subtle complication: the gradient for W&#8330;&#8331; is the sum of contributions from all T time steps, not just the last. This accumulation is one reason early recurrent networks were slow to train and prone to instability. It also planted the seed of the next great problem: gradients accumulated over many time steps tend to either vanish or explode.",
        },
        {
            year: "1991",
            title: "Hochreiter's Diploma Thesis — The Vanishing Gradient Identified",
            challenge:
                "As researchers tried to train RNNs on tasks requiring long-range dependencies — remembering a word from 20 steps earlier, detecting patterns separated by long gaps — they found the networks consistently failed. The training loss might decrease, but the network couldn't capture the relevant structure. This wasn't a hyperparameter issue: no amount of tuning made simple RNNs reliable for long sequences.",
            what: "In his 1991 diploma thesis (published in German, later formalised with Schmidhuber in 1997), Sepp Hochreiter provided the mathematical diagnosis. When BPTT unrolls an RNN over k time steps, the gradient is multiplied by the same matrix W&#8330;&#8331; at each step. If the dominant eigenvalue of W&#8330;&#8331; is less than 1, gradients decay exponentially with k — after 20 steps, a gradient of magnitude 1 becomes 10&#8315;&#8305;&#178;. If greater than 1, gradients explode. There is no stable middle ground for a fixed weight matrix.",
            impact:
                "Hochreiter's diagnosis was precise and devastating: the vanishing gradient problem is a mathematical inevitability for simple RNNs processing long sequences. No clever weight initialisation or activation function could fully avoid it within the existing architecture. A fundamentally different mechanism was needed — one that provided a gradient path through time that did not multiply by the same Jacobian at every step. This motivated the invention of LSTM six years later.",
        },
        {
            year: "1997–Present",
            title: "Simple RNNs in Practice — Enduring Role Despite Limitations",
            challenge:
                "With LSTM introduced in 1997 and GRU in 2014, simple RNNs might seem obsolete. Yet they persisted in research and practice for specific reasons: they are computationally cheaper, easier to analyse theoretically, and for short sequences (fewer than 20 steps) their performance is comparable to gated networks. Understanding them remains prerequisite knowledge for understanding every architecture that followed.",
            what: "Simple RNNs are still used today in settings where sequence lengths are short, compute is constrained, or theoretical tractability is valued. They appear in echo state networks (reservoir computing), where only the output weights are trained and the recurrent weights are fixed at random — a setting that avoids the vanishing gradient by not training W&#8330;&#8331; at all. They also appear as components in larger architectures and in educational settings as the clearest illustration of temporal computation.",
            impact:
                "The simple RNN is to sequence modelling what the perceptron is to classification: the minimal, instructive baseline against which everything more powerful is measured. Every advancement — LSTM gating, GRU simplification, Transformer attention — is precisely a solution to a failure mode of the simple RNN. Studying its limits is the most efficient way to understand why modern architectures are designed the way they are.",
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

            <p className="ch-story-intro">
                Chapter 5 gave neural networks the ability to learn — backpropagation, multilayer perceptrons, autoencoders that compressed information into a hidden code. But every input was independent. Feed in an image, get a label. Feed in another image, the network doesn't remember the first. For sequences — sentences, speech, music, time-series data — this is a fatal flaw. Chapter 6 fixes it by giving the network a loop: each step's output or hidden state feeds back as input to the next step, creating memory across time.
            </p>

            <Analogy label="The Reading a Story Analogy">
                Imagine reading a sentence: <em>"The cat sat on the mat."</em> Your brain doesn't just look at each word in isolation — it remembers the words that came before. When you see "sat," you know it's the cat that sat, because "cat" is still in your working memory from two words earlier.
                <br /><br />
                A <strong>feedforward neural network</strong> is like reading each word with your eyes closed, one at a time, without remembering any previous words. An <strong>RNN</strong> is like actually reading the sentence — each word gets processed while you remember what came before. The network carries a little "notebook" (the hidden state) that it updates with each new word.
            </Analogy>

            <Analogy label="Jordan vs Elman — Two Ways to Have Memory">
                Michael Jordan and Jeffrey Elman each came up with a way to add memory to a neural network, but they chose different things to remember.
                <br /><br />
                <strong>Jordan's idea:</strong> remember what you just <em>said</em>. After the network produces an output (for example, a phoneme in speech), that output gets fed back in as extra input at the next step. It's like a radio presenter who keeps a running script of what they just announced.
                <br /><br />
                <strong>Elman's idea:</strong> remember what you just <em>thought</em>. Instead of feeding back the output, feed back the hidden layer — the network's internal summary of everything it's seen so far. This is richer, because the hidden state captures more than just the final answer. Elman's idea won out and became the foundation of all modern RNNs.
            </Analogy>

            <Analogy label="Simple RNN — A Robot with a Sticky Note">
                Think of a robot that watches a video one frame at a time. It has a sticky note (the hidden state) where it writes down what it thinks is important. When the next frame arrives, it looks at the new frame AND reads its old sticky note, then writes a new updated note.
                <br /><br />
                This is the Elman network in a nutshell. At every step, the robot combines: (1) what it sees right now (x&#8329;) and (2) its memory from the last step (h&#8330;&#8331;&#8321;), to produce a new memory (h&#8329;). The formula is simple: h&#8329; = tanh(W times h&#8330;&#8331;&#8321; plus W times x&#8329;).
                <br /><br />
                But there's a problem: the sticky note has limited space, and old information gets slowly overwritten by new information. After about 7-10 steps, the robot usually can't remember what happened at the beginning. This is the <strong>vanishing gradient problem</strong> — the subject of the next two topics.
            </Analogy>

            <Analogy label="Why the Notepad Gets Blurry Over Time">
                Every time the robot copies its old note onto a new one, it doesn't copy perfectly — it blends the old note with new information using the tanh function, which squashes everything into the range -1 to +1. After 20 blending operations, the original message is barely visible — like copying a photocopy of a photocopy 20 times. The ink gets fainter with each generation.
                <br /><br />
                This blurring doesn't just affect the network's memory — it also affects how it <em>learns</em>. When we try to teach the network what it did wrong, we have to send the error signal back through all those blending operations. By the time the signal reaches the early steps, it's too faint to teach the network anything useful.
            </Analogy>

            <Analogy label="What Comes Next — Giving the Network a Better Notebook">
                The simple RNN's problem is that it uses one notepad and keeps rewriting it. What if the network had a special <strong>protected diary</strong> — a long-term memory that information could be <em>written into</em> without constantly overwriting what was there before?
                <br /><br />
                That's exactly what Hochreiter and Schmidhuber invented in 1997: the LSTM, with its "cell state" that acts like a protected diary. Before we get there, we need to understand exactly what goes wrong with the simple RNN — starting with backpropagation through time.
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
                an input x&#8329; and a previous hidden state h&#8330;&#8331;&#8321;,
                and produces a new hidden state h&#8329;:
            </p>
            <MathBlock tex="h_t = \tanh(W_{hh}\,h_{t-1} + W_{xh}\,x_t + b_h)" />
            <p>
                The hidden state h&#8329; is a compressed summary of everything the network has seen up to
                time t. For sequence classification, a final output is computed from the last hidden state:
            </p>
            <MathBlock tex="\hat{y} = \text{softmax}(W_{hy}\,h_T + b_y)" />
            <p>
                The weight matrices W&#8330;&#8331;, W&#8330;&#8331;, and the output matrix W&#8330;&#8331;
                are shared across all time steps — a single set of parameters processes the entire sequence.
            </p>

            <h3>Elman vs. Jordan Networks</h3>
            <ul>
                <li><strong>Elman network (hidden-to-hidden):</strong> h&#8329; depends on h&#8330;&#8331;&#8321;. The full richness of the hidden representation persists into the next step. More expressive — dominates modern use.</li>
                <li><strong>Jordan network (output-to-hidden):</strong> h&#8329; depends on y&#8330;&#8331;&#8321;. Only the network's prediction from the previous step is fed back. Simpler but discards internal representation.</li>
            </ul>

            <h3>Hidden State as Compressed Memory</h3>
            <p>
                The hidden state h&#8329; must compress the entire prefix (x&#8330;, x&#8330;, ..., x&#8329;) into a fixed-size vector
                (typically 100–1024 dimensions). This compression is the source of both the power and the
                weakness of simple RNNs. The power: the hidden state can in principle represent any function
                of past inputs. The weakness: fixed-size compression means information is inevitably lost,
                especially for early time steps in long sequences.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For an RNN with input dimension d, hidden dimension n, and output dimension c:
            </p>
            <MathBlock tex="\underbrace{n \times n}_{W_{hh}} + \underbrace{n \times d}_{W_{xh}} + \underbrace{n}_{b_h} + \underbrace{c \times n}_{W_{hy}} + \underbrace{c}_{b_y}" />
            <p>
                A typical setting of d = 50, n = 256, c = 10 gives 256&#215;256 + 256&#215;50 + 256 + 10&#215;256 + 10 = 65,536 + 12,800 + 256 + 2,560 + 10 = 81,162 parameters — regardless of sequence length T. The same parameters process a sequence of 5 tokens or 500 tokens.
            </p>

            <h3>Why Hidden States Collapse Over Time</h3>
            <p>
                Consider what happens when we unroll the RNN through time. The gradient of the loss at T
                with respect to an early hidden state h&#8329; requires backpropagating through every
                intermediate step. The gradient is repeatedly multiplied by the Jacobian of the hidden
                state transition:
            </p>
            <MathBlock tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} \frac{\partial h_i}{\partial h_{i-1}} = \prod_{i=t+1}^{T} W_{hh}^\top \cdot \operatorname{diag}(\tanh'(z_i))" />
            <p>
                If the spectral radius of W&#8330;&#8331; is less than 1 (which is common for stable training),
                the gradient decays exponentially with the lag k = T &#8722; t. After 20 steps, the gradient
                magnitude is typically on the order of 10&#8315;&#8311; to 10&#8315;&#185;&#178; — effectively zero.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The geometric picture:</strong> Imagine the hidden state as a point in a high-dimensional space. At each step, the recurrent matrix W&#8330;&#8331; applies a linear transformation, and tanh compresses the result back toward zero. Over many steps, any information from early time steps gets compressed toward the origin of the hidden state space — not erased suddenly, but faded exponentially. This is why simple RNNs can remember what happened 5 steps ago but not 50 steps ago.
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

            <DefBlock label="Simple RNN Recurrence (Elman, 1990)">
                Given input sequence <InlineMath tex="(x_1, x_2, \ldots, x_T)" /> and initial hidden
                state <InlineMath tex="h_0 = \mathbf{0}" />, the hidden state at time t is:
                <MathBlock tex="h_t = \tanh(W_{hh}\,h_{t-1} + W_{xh}\,x_t + b_h)" />
                where <InlineMath tex="W_{hh} \in \mathbb{R}^{n \times n}" /> is the recurrent weight
                matrix and <InlineMath tex="W_{xh} \in \mathbb{R}^{n \times d}" /> maps inputs to
                hidden dimension. The network output is:
                <MathBlock tex="\hat{y} = \text{softmax}(W_{hy}\,h_T + b_y)" />
            </DefBlock>

            <h3>Gradient Flow Through Time</h3>
            <p>
                The gradient of the loss with respect to W&#8330;&#8331; is the sum of contributions
                from all T time steps:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_{hh}} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}}{\partial h_T} \cdot \frac{\partial h_T}{\partial h_t} \cdot \frac{\partial h_t}{\partial W_{hh}}" />
            <p>
                The term <InlineMath tex="\frac{\partial h_T}{\partial h_t}" /> is a product of
                T &#8722; t Jacobian matrices:
            </p>
            <MathBlock tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} \frac{\partial h_i}{\partial h_{i-1}} = \prod_{i=t+1}^{T} \operatorname{diag}(\tanh'(z_i)) \cdot W_{hh}^\top" />
            <p>
                Each factor has spectral norm bounded by <InlineMath tex="\rho(W_{hh}) \cdot \max_i \tanh'(z_i) \leq \rho(W_{hh})" />
                since <InlineMath tex="\tanh'(z) \leq 1" />. If <InlineMath tex="\rho(W_{hh}) &lt; 1" />,
                the norm of the product decays as <InlineMath tex="\rho^{T-t}" /> — exponential vanishing.
            </p>

            <h3>Eigenvalue Analysis of the Recurrent Matrix</h3>
            <p>
                Decompose <InlineMath tex="W_{hh} = Q\Lambda Q^{-1}" /> (eigendecomposition). Then:
            </p>
            <MathBlock tex="(W_{hh}^\top)^k = Q^{-\top}\Lambda^k Q^\top" />
            <p>
                If the largest eigenvalue <InlineMath tex="|\lambda_1| &lt; 1" />, then
                <InlineMath tex="\lambda_1^k \to 0" /> exponentially in k. For a hidden dimension
                of n = 100, even if all eigenvalues are exactly 0.9:
            </p>
            <MathBlock tex="0.9^{20} \approx 0.12, \quad 0.9^{50} \approx 0.005, \quad 0.9^{100} \approx 2.7 \times 10^{-5}" />
            <p>
                The network is effectively blind to anything that happened more than ~50 steps ago.
            </p>

            <h3>The Jordan Network Difference</h3>
            <p>
                In the Jordan formulation, the context is the output rather than the hidden state:
            </p>
            <MathBlock tex="h_t = \sigma(W_{hc}\,y_{t-1} + W_{xh}\,x_t + b_h), \quad y_t = \text{softmax}(W_{hy}\,h_t + b_y)" />
            <p>
                The gradient path from the loss at T to a weight at time t must pass through the
                output y&#8330;&#8331;&#8321; at each step. Since y is typically low-dimensional (number of classes),
                this bottleneck restricts the amount of context that can be carried forward compared
                to the hidden-state feedback of Elman networks.
            </p>

            <h3>Stable Region for W&#8330;&#8331;</h3>
            <p>
                For an RNN to be both trainable and stable, the spectral radius of W&#8330;&#8331; must
                satisfy a delicate condition:
            </p>
            <MathBlock tex="\rho(W_{hh}) \approx 1 \implies \text{edge of chaos — neither vanishing nor exploding}" />
            <p>
                In practice, this is impossible to maintain reliably during training. Standard initialisation
                (e.g., orthogonal initialisation) sets <InlineMath tex="\rho(W_{hh}) = 1" />,
                but gradient updates move it away from this point. Echo state networks (Jaeger, 2001)
                exploit this by fixing W&#8330;&#8331; randomly and only training the output weights,
                keeping <InlineMath tex="\rho(W_{hh}) &lt; 1" /> by design.
            </p>

            <div className="ch-callout">
                <strong>Key theorem (implicit in Hochreiter 1991):</strong> For any tanh-RNN with fixed
                weight matrix W&#8330;&#8331;, the gradient of the loss at time T with respect to the
                hidden state at time t decays as <InlineMath tex="O(\rho(W_{hh})^{T-t})" />.
                If <InlineMath tex="\rho(W_{hh}) &lt; 1" />, learning long-range dependencies is
                impossible; if <InlineMath tex="\rho(W_{hh}) &gt; 1" />, gradients explode.
                There is no fixed W&#8330;&#8331; that works for arbitrary sequence lengths — hence
                the need for gating mechanisms.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Simple RNN Forward Pass (Elman Network) ───────────────────────────────────
def tanh(z):
    return np.tanh(z)

def tanh_prime(h):
    """tanh'(z) = 1 - tanh^2(z). If h = tanh(z), then tanh'(z) = 1 - h^2"""
    return 1 - h ** 2

def softmax(z):
    e = np.exp(z - np.max(z))
    return e / e.sum()

def rnn_step(x_t, h_prev, Whh, Wxh, bh):
    """
    Single step of a simple Elman RNN.
    x_t:   (input_dim,)  — input at time t
    h_prev:(hidden_dim,) — hidden state from previous step
    Returns: h_t (hidden_dim,)
    """
    z = Wxh @ x_t + Whh @ h_prev + bh
    h_t = tanh(z)
    return h_t

def rnn_forward(X, Whh, Wxh, bh):
    """
    Forward pass through a simple RNN for a full sequence.
    X: (seq_len, input_dim)
    Returns: H (seq_len+1, hidden_dim) — H[0] = h_0 = 0
    """
    T = len(X)
    hidden_dim = Whh.shape[0]
    H = np.zeros((T + 1, hidden_dim))   # H[0] = h_0 = zeros
    for t in range(T):
        H[t+1] = rnn_step(X[t], H[t], Whh, Wxh, bh)
    return H

# ── Demo: Vanishing gradient experiment ────────────────────────────────────────
print("=" * 60)
print("Gradient decay experiment: how fast does memory fade?")
print("=" * 60)

np.random.seed(42)
hidden_dim = 8
input_dim  = 4

# Small W_hh (spectral radius < 1): typical stable init
Whh = np.random.randn(hidden_dim, hidden_dim) * 0.5
spec_rad = np.max(np.abs(np.linalg.eigvals(Whh)))
print(f"Spectral radius of W_hh: {spec_rad:.3f}")

# Simulate gradient norm decay over increasing lags
grad = np.eye(hidden_dim)      # gradient starts at identity
print("\\nGradient norm at step 0: 1.000")
for k in [1, 5, 10, 20, 50]:
    # Worst case: tanh'(z) = 1 everywhere (at z=0), so Jacobian = W_hh^T
    for _ in range(k - (0 if k == 1 else k-1)):
        grad = Whh.T @ grad
    norm = np.linalg.norm(grad, ord=2)
    print(f"Gradient norm after {k:3d} steps: {norm:.3e}")

# ── Jordan vs Elman: code comparison ──────────────────────────────────────────
print("\\n" + "=" * 60)
print("Jordan vs Elman network")
print("=" * 60)

def jordan_step(x_t, y_prev, Whc, Wxh, bh, Why, by):
    """Jordan: context = previous OUTPUT"""
    z = Wxh @ x_t + Whc @ y_prev + bh
    h = tanh(z)
    y = softmax(Why @ h + by)
    return h, y

def elman_step(x_t, h_prev, Whh, Wxh, bh):
    """Elman: context = previous HIDDEN STATE"""
    z = Wxh @ x_t + Whh @ h_prev + bh
    h = tanh(z)
    return h

output_dim = 3
T = 5

# Random params for both
Whh_e  = np.random.randn(hidden_dim, hidden_dim) * 0.5
Whc_j  = np.random.randn(hidden_dim, output_dim) * 0.5
Wxh    = np.random.randn(hidden_dim, input_dim) * 0.5
bh     = np.zeros(hidden_dim)
Why    = np.random.randn(output_dim, hidden_dim) * 0.5
by     = np.zeros(output_dim)

X = np.random.randn(T, input_dim) * 0.5

# Jordan
h_j, y_prev = np.zeros(hidden_dim), np.ones(output_dim) / output_dim
print("\\nJordan (output-to-hidden) hidden state norms:")
for t in range(T):
    h_j, y_prev = jordan_step(X[t], y_prev, Whc_j, Wxh, bh, Why, by)
    print(f"  t={t}: ||h|| = {np.linalg.norm(h_j):.4f}")

# Elman
h_e = np.zeros(hidden_dim)
print("\\nElman (hidden-to-hidden) hidden state norms:")
for t in range(T):
    h_e = elman_step(X[t], h_e, Whh_e, Wxh, bh)
    print(f"  t={t}: ||h|| = {np.linalg.norm(h_e):.4f}")

print("\\nKey: Elman hidden state is higher-dimensional context")
print("than Jordan's output feedback → more expressive memory")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementations of Elman and Jordan RNN steps, a full sequence forward pass,
                and an experiment demonstrating how gradient norms decay exponentially over time steps.
                These are the foundational algorithms — every modern RNN traces back to these equations.
            </p>
            <CodeBlock code={PY_CODE} filename="simple_rnn.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>In production:</strong> use <code>torch.nn.RNN</code>, which handles gradient
                clipping, cuDNN acceleration, and variable-length sequences via packed sequences.
                But the forward pass equations above are exactly what it computes, and understanding
                them is essential for debugging and architecture design.
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
