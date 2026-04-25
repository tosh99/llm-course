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
            year: "1991",
            title: "Hochreiter's Diploma Thesis — The First Rigorous Diagnosis",
            challenge:
                "Through the late 1980s and early 1990s, researchers trying to train RNNs on tasks requiring long-range dependencies consistently failed. A network trained to count how many times a word appeared in a paragraph, or to remember the subject of a sentence until the verb appeared 20 words later, would simply not learn. The failure wasn't random — it was systematic. No amount of hyperparameter tuning helped. But the reason was not understood.",
            what: "Sepp Hochreiter's 1991 diploma thesis at the Technische Universität München, supervised by Jürgen Schmidhuber, provided the first mathematically precise diagnosis. Hochreiter showed that when BPTT unrolls an RNN through k time steps, the gradient is multiplied by the Jacobian matrix of the hidden state transition at every step. If the spectral radius of this Jacobian is less than 1, the gradient decays exponentially in k. If it is greater than 1, the gradient explodes. He calculated that for typical sigmoid-activated RNNs with random initialisation, the spectral radius is almost certainly less than 1, making the vanishing gradient mathematically inevitable rather than a lucky accident.",
            impact:
                "Hochreiter's diagnosis was devastating in the best possible way: it transformed a vague engineering frustration into a precisely stated theorem. It showed that the vanishing gradient was not a software bug, not a hyperparameter problem, and not a failure of the training algorithm — it was a structural property of the architecture. No fix within the framework of standard RNNs could solve it. A fundamentally different mechanism was needed.",
        },
        {
            year: "1994",
            title: "Bengio, Simard & Frasconi — Formalising the Theorem",
            challenge:
                "Hochreiter's 1991 diagnosis was in German and remained relatively obscure. The English-language ML community needed its own systematic treatment. Additionally, the 1991 analysis was specific to RNNs; researchers needed to understand whether the vanishing gradient was a general problem for deep networks or specific to the temporal feedback in RNNs.",
            what: "Yoshua Bengio, Patrice Simard, and Paolo Frasconi published 'Learning Long-Term Dependencies with Gradient Descent Is Difficult' in IEEE Transactions on Neural Networks (1994). The paper proved formally that for an RNN to capture a dependency at lag T, the gradient must not vanish, which requires the spectral radius of the recurrent Jacobian to be at least 1. But maintaining spectral radius &#8805; 1 causes gradient explosion. The paper showed this is a fundamental tension — there is no initialisation scheme or activation function for a standard RNN that avoids both vanishing and explosion simultaneously for arbitrary T.",
            impact:
                "The 1994 paper established the vanishing gradient problem as a theorem in the English-language literature. It was widely read and cited, and explicitly motivated the search for gating mechanisms — architectural changes that would allow the gradient to flow through time without passing through the squashing non-linearity at every step. The paper effectively set the agenda for the next decade of sequence modelling research and directly motivated the LSTM.",
        },
        {
            year: "1991–1997",
            title: "Sigmoid vs. Tanh — Why Activation Choice Amplifies the Problem",
            challenge:
                "Early RNNs used sigmoid activations &#963;(z) = 1/(1+e&#8315;&#7611;) following the biological neuron model (output in [0, 1]). Later networks switched to tanh. But both suffer from vanishing gradients — and the reason is the same: both functions saturate, meaning their derivatives approach zero for large |z|. Understanding why saturation causes exponential gradient decay required careful analysis.",
            what: "The derivative of sigmoid is &#963;'(z) = &#963;(z)(1-&#963;(z)), which is maximised at z=0 with value 0.25 and approaches 0 as |z| increases. The derivative of tanh is tanh'(z) = 1 - tanh&#178;(z), maximised at z=0 with value 1.0 and approaching 0 at saturation. In a network where many units are saturated (common with random initialisation or after a few training steps), the effective per-step gradient multiplier is much less than 1. After k steps: if the multiplier is 0.25 per step (pure sigmoid), the gradient magnitude after 20 steps is 0.25&#178;&#176; &#8776; 10&#8315;&#185;&#178;. Even with tanh and a near-optimal initialisation keeping the multiplier near 0.8: 0.8&#178;&#176; &#8776; 0.01.",
            impact:
                "This analysis made clear that the choice of activation function matters enormously for gradient flow, but neither sigmoid nor tanh can fix the vanishing gradient for long sequences. The solution required either: (1) a skip connection that bypasses the non-linearity for gradient flow (ResNets in feedforward networks, cell state in LSTMs), or (2) a gating mechanism that adaptively controls the gradient multiplier. The contrast between sigmoid (max derivative 0.25) and tanh (max derivative 1.0) also explained why tanh-RNNs could handle somewhat longer sequences — but not fundamentally longer ones.",
        },
        {
            year: "1997",
            title: "Hochreiter & Schmidhuber — LSTM as the Solution",
            challenge:
                "After six years of analysis, the problem was precisely understood: RNNs cannot learn long-range dependencies because BPTT gradients decay exponentially with sequence length. The needed fix was an architectural mechanism that provided a gradient pathway through time where the gradient multiplier at each step was exactly 1 — not approximately 1, but exactly. This would require a linear self-connection with unit weight, which was anathema to the standard thinking that all connections should be learned and flexible.",
            what: "Hochreiter and Schmidhuber published 'Long Short-Term Memory' in Neural Computation (1997). The key innovation was the cell state C&#8329; — a linear recurrence with a self-connection of weight 1 (mediated by the forget gate). The gradient of the loss with respect to C&#8329; is simply the product of forget gate values f&#8329; along the path, not a product of Jacobians involving W&#8330;&#8331; and the non-linearity derivative. When the forget gate is open (f &#8776; 1), the gradient flows unchanged through arbitrarily many time steps. The cell state is the Constant Error Carousel — a gradient highway through time.",
            impact:
                "LSTM provided the first practical solution to the vanishing gradient problem for sequential data. Unlike earlier partial fixes (gradient clipping, careful initialisation, truncated BPTT), LSTM addressed the root cause: it replaced the multiplicative gradient decay with a controlled, learnable gradient pathway. LSTM remained the dominant sequence model for nearly two decades, until Transformer attention provided an even more direct solution by allowing any token to directly attend to any other token, eliminating the sequential bottleneck entirely.",
        },
        {
            year: "2014",
            title: "The GRU — Simplifying LSTM's Solution",
            challenge:
                "LSTM's original formulation had many components: three gates (forget, input, output), a cell state, a hidden state, and optional peephole connections. While powerful, this complexity made it harder to analyse theoretically and slower to train. Researchers wanted to know: what is the minimal gating mechanism that solves the vanishing gradient? Could the cell state and hidden state be merged? Could the input and forget gates be combined?",
            what: "Cho, Chung, Bahdanau, Boulanger-Lewandowski, Bengio, and Courville introduced the Gated Recurrent Unit (GRU) at COLING 2014. The GRU merges the cell state and hidden state into a single state vector, and replaces the three gates with two: an update gate (controls how much of the previous state to carry forward) and a reset gate (controls how much past context to use for computing new content). With fewer parameters and simpler dynamics, GRUs often match LSTM performance on benchmark tasks.",
            impact:
                "The GRU demonstrated that the minimal solution to the vanishing gradient does not require a separate cell state — the gating mechanism itself (learnable interpolation between old and new content) is what matters. This theoretical insight confirmed that LSTM's power came from its gating, not its specific architecture. GRUs are now widely used for time series, audio, and any task where LSTM performance matches but a smaller model is desired.",
        },
        {
            year: "2015–Present",
            title: "Gradient Flow and the Legacy in Modern Architectures",
            challenge:
                "Even after LSTM and GRU solved the vanishing gradient for RNNs, the problem reappeared in deeper feedforward networks. Training networks with 20, 50, or 100 layers suffered from the same exponential gradient decay. The solution in that context was different — skip connections rather than gating — but the underlying mathematics was identical.",
            what: "ResNets (He et al., 2015) provided skip connections h&#8329; = F(h&#8329;&#8331;&#8321;) + h&#8329;&#8331;&#8321; for feedforward networks, where the identity term h&#8329;&#8331;&#8321; guarantees a gradient of at least 1 regardless of the non-linearity. Transformer attention (Vaswani et al., 2017) eliminated the sequential bottleneck entirely by allowing each position to attend to all others simultaneously — no temporal Jacobian chain needed. Both ResNets and Transformers are solutions to the same vanishing gradient problem that Hochreiter identified in 1991, applied in different architectural contexts.",
            impact:
                "The vanishing gradient is arguably the central technical problem in deep learning history. Every major architectural innovation from the 1990s to the present — LSTM gating, GRU gating, ResNet skip connections, dense connections in DenseNet, layer normalisation, Transformer attention — is at least partly motivated by the need to maintain gradient flow through deep computation graphs. Hochreiter's 1991 diagnosis set the agenda for thirty years of architecture design.",
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
            <h2>Why your RNN has the memory of a goldfish</h2>

            <Analogy label="The Whisper Game — Why Messages Fade">
                Stand in a line of 20 kids. The first kid whispers a sentence to the second, the second whispers it to the third, and so on. By the time the 20th kid says it out loud, the message is barely recognisable — words got changed, dropped, or blurred together.
                <br /><br />
                That's exactly what happens with gradients in a simple RNN. The error signal from the last time step whispers back through each previous step, and by the time it reaches the first step, it's almost nothing. The network literally can't learn from what happened at the beginning of a long sequence — the learning signal disappears before it arrives.
            </Analogy>

            <Analogy label="The Photocopier with Fading Ink">
                Imagine you photocopy a document, then photocopy the copy, then copy that copy, twenty times in a row. Even if each copy loses only a little quality, after 20 generations the image is blurry and washed out — all the fine details are gone.
                <br /><br />
                In an RNN, the hidden state is "copied" from step to step, but each copy is filtered through a tanh function that squashes values toward zero. After enough steps, the signal from the beginning is gone — not because of any bug, but because of the fundamental mathematics of repeated squashing. This is the vanishing gradient problem.
            </Analogy>

            <Analogy label="Why Sigmoid Makes It Even Worse">
                The sigmoid activation function has a maximum "slope" of 0.25 at its center. At the edges, the slope is nearly zero — the function is almost flat. This means even the best-case gradient multiplier at each step is 0.25.
                <br /><br />
                If you multiply 0.25 by itself 20 times, you get roughly 0.000000000001. After just 20 steps, a gradient that started at 1.0 has become one trillionth of its original size. The network can't use this to learn anything meaningful.
                <br /><br />
                The tanh function is better — its maximum slope is 1.0, not 0.25 — but it still saturates at the edges, and in practice most neurons don't sit right at the center. The vanishing gradient still happens, just a bit more slowly.
            </Analogy>

            <Analogy label="LSTM to the Rescue — A Protected Diary">
                Instead of copying and re-squashing information at every step, the LSTM writes information into a special <strong>protected diary</strong> (the cell state). The diary doesn't get squashed at each step — it just carries information forward unchanged unless you deliberately erase or overwrite it.
                <br /><br />
                The gradient of the loss with respect to the diary's contents can travel backward through 100 or 1000 steps without shrinking, because the diary's self-connection has weight exactly 1.0. This is the Constant Error Carousel: a gradient highway that runs alongside the squashy hidden state pathway, giving important information a safe route through time.
            </Analogy>

            <Analogy label="The Gradient as a Learning Signal">
                Here's the key insight: the gradient is the network's <em>teaching signal</em>. It says "you made an error, and here's how much each parameter contributed to it." When the gradient vanishes, the teaching signal disappears. Parameters at early time steps receive no update signal — the network can't learn that what it did at step 1 was wrong, because by the time the error travels back to step 1, the signal is essentially zero.
                <br /><br />
                The vanishing gradient doesn't mean the network forgets — it means the network <em>can't learn</em> long-range dependencies in the first place. The solution requires giving the gradient a path that doesn't multiply by a shrinking number at every step.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Exponential gradient decay through repeated matrix multiplication</h2>

            <h3>The Intuition: What Repeated Multiplication Does to Numbers</h3>
            <p>
                Consider a simple scalar recurrence: a&#8330;&#8331;&#8321; = 0.5 &#215; a&#8329;.
                Starting from a&#8330; = 1, after 10 steps: a&#8321;&#8320; = 0.5&#185;&#176; &#8776; 0.001.
                After 20 steps: 0.5&#178;&#176; &#8776; 10&#8315;&#8310;. The sequence forgets its starting value exponentially fast.
            </p>
            <p>
                RNNs do this with matrices. The eigenvalues of W&#8330;&#8331; determine how fast information decays:
            </p>
            <ul>
                <li>If all eigenvalues |&#955;| &#60; 1: information decays to zero &#8594; <strong>vanishing gradient</strong></li>
                <li>If any eigenvalue |&#955;| &#62; 1: information grows without bound &#8594; <strong>exploding gradient</strong></li>
                <li>If all eigenvalues |&#955;| = 1 exactly: information propagates unchanged — but this is unstable under training</li>
            </ul>

            <h3>The Sigmoid Activation Compounds the Problem</h3>
            <p>
                The derivative of sigmoid &#963;(z) = 1/(1+e&#8315;&#7611;) is:
            </p>
            <MathBlock tex="\sigma'(z) = \sigma(z)(1 - \sigma(z)) \leq 0.25" />
            <p>
                The maximum of 0.25 is achieved only at z = 0; at saturation (|z| &#62; 3), &#963;'(z) &#8776; 0.
                In a vanilla sigmoid RNN with spectral radius &#961;(W&#8330;&#8331;) = 1:
            </p>
            <MathBlock tex="\left\|\prod_{i=t+1}^{T} J_i\right\| \leq (0.25 \cdot \rho(W_{hh}))^{T-t} = 0.25^{T-t}" />
            <p>
                After 20 steps: 0.25&#178;&#176; &#8776; 10&#8315;&#185;&#178;. The gradient from step 1 to step T=21 is
                one hundred-billionth of its original size.
            </p>

            <h3>Tanh Is Better, but Not Enough</h3>
            <p>
                Tanh has a maximum derivative of 1.0 (at z = 0), making it strictly better than sigmoid.
                But in practice, hidden units don't all sit at zero. After training begins, weights push
                units toward saturation. If the average effective derivative is 0.8 per step:
            </p>
            <MathBlock tex="0.8^{50} \approx 0.000 \quad (< 10^{-4})" />
            <p>
                The vanishing gradient remains for sequences longer than ~20-30 steps, just at a slightly
                slower rate than sigmoid.
            </p>

            <h3>Empirical Evidence from Hochreiter (1991)</h3>
            <p>
                Hochreiter trained simple RNNs on tasks requiring various lag lengths between cause and effect:
            </p>
            <ul>
                <li>Add two randomly chosen integers (requiring memory of the first value across the sequence)</li>
                <li>Count the number of 1s in a sequence with variable delay before the query</li>
                <li>Context-sensitive grammar tasks (XOR patterns at arbitrary distances)</li>
            </ul>
            <p>
                Simple RNNs failed on all tasks where the required dependency was longer than
                ~7-10 steps, regardless of hidden layer size. Gradient magnitudes at early time steps
                were measured at 10&#8315;&#8310; to 10&#8315;&#185;&#178; times smaller than gradients at later steps.
            </p>

            <h3>Why the Problem Is Worse in RNNs than Feedforward Nets</h3>
            <p>
                In a feedforward network, the "depth" (number of layers) is a design choice — you can
                choose 5 layers instead of 50. In an RNN, the effective depth equals the sequence length,
                which is determined by the data. A 100-word sentence requires backpropagation through 100
                "layers." You cannot control this without truncating the gradient (truncated BPTT), which
                introduces bias. RNNs are feedforward networks where depth is adversarially chosen by the data.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Real-world consequence:</strong> An early RNN language model trained on English text
                can predict common function words based on recent context (last 3-5 words), but cannot
                capture subject-verb agreement across intervening clauses ("The cats that the dog chased
                <em> were</em> hungry" — the plural "were" depends on "cats" which may be 10+ tokens earlier).
                This is the concrete effect of the vanishing gradient: the network's effective memory is
                approximately the last 7-10 steps, regardless of what happened before that window.
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
            <h2>Formal characterisation of the vanishing and exploding gradient</h2>

            <DefBlock label="RNN Hidden State Jacobian">
                The Jacobian matrix of the hidden state transition
                <MathBlock tex="h_t = \tanh(W_{hh}\,h_{t-1} + W_{xh}\,x_t + b)" />
                with respect to the previous hidden state is:
                <MathBlock tex="J_t = \frac{\partial h_t}{\partial h_{t-1}} = \operatorname{diag}(\tanh'(z_t)) \cdot W_{hh}^\top" />
                This is an n &#215; n matrix. The spectral norm of J&#8329; is bounded by
                <InlineMath tex="\|J_t\| \leq \|\operatorname{diag}(\tanh'(z_t))\| \cdot \|W_{hh}\| \leq \|W_{hh}\|" />
                since tanh' &#8804; 1.
            </DefBlock>

            <h3>The Long-range Gradient Product</h3>
            <p>
                The gradient of h&#8338; with respect to h&#8329; (for t &#60; T) requires multiplying T &#8722; t Jacobians:
            </p>
            <MathBlock tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} J_i = \prod_{i=t+1}^{T} \operatorname{diag}(\tanh'(z_i)) \cdot W_{hh}^\top" />
            <p>
                The norm of this product is bounded by:
            </p>
            <MathBlock tex="\left\|\frac{\partial h_T}{\partial h_t}\right\| \leq \prod_{i=t+1}^{T}\|J_i\| \leq \|W_{hh}\|^{T-t}" />

            <h3>Precise Eigenvalue Condition (Bengio et al., 1994)</h3>
            <p>
                Using SVD of W&#8330;&#8331; = U&#931;V&#7488;, the product (W&#8330;&#8331;&#7488;)&#1085; = U&#8315;&#7488;&#931;&#1085;V&#7488;.
                The largest singular value &#963;&#8321; = &#61026;W&#8330;&#8331;&#61026; controls the decay rate.
            </p>
            <MathBlock tex="\|W_{hh}^k\| = \sigma_1^k" />
            <p>
                Bengio et al. proved formally: if &#963;&#8321; &#60; 1, the RNN cannot learn dependencies
                at lag T &#8722; t &#8811; log(&#949;) / log(&#963;&#8321;) for any &#949; &#62; 0.
                For &#963;&#8321; = 0.9 and &#949; = 0.01: maximum learnable lag &#8776;
                log(0.01)/log(0.9) &#8776; 43 steps.
            </p>

            <h3>The Stable Region Is a Set of Measure Zero</h3>
            <p>
                For gradients to propagate without vanishing or exploding, we need &#961;(W&#8330;&#8331;) = 1 exactly.
                But the set of matrices with spectral radius exactly 1 is a manifold of measure zero in the
                space of all n &#215; n matrices. Random initialisation rarely lands on it, and gradient updates
                perturb W&#8330;&#8331; away from it at every training step. Maintaining &#961; = 1 requires
                orthogonal constraints on W&#8330;&#8331; at all times — impractical for unconstrained gradient descent.
            </p>

            <h3>The LSTM Fix: Controlled Linear Recurrence</h3>
            <p>
                The LSTM cell state update c&#8329; = f&#8329; &#9651; c&#8329;&#8331;&#8321; + i&#8329; &#9651; c&#771;&#8329; has a different Jacobian:
            </p>
            <MathBlock tex="\frac{\partial c_t}{\partial c_{t-1}} = \operatorname{diag}(f_t)" />
            <p>
                Unlike the RNN Jacobian (which involves W&#8330;&#8331; and the non-linearity derivative), the
                cell state Jacobian is <em>just</em> the forget gate — a diagonal matrix with values
                in [0, 1]. The long-range gradient through the cell state is:
            </p>
            <MathBlock tex="\frac{\partial c_T}{\partial c_t} = \prod_{i=t+1}^{T} \operatorname{diag}(f_i)" />
            <p>
                When the network learns f&#8329; &#8776; 1 for steps where information should persist:
                <InlineMath tex="\|\partial c_T / \partial c_t\| \approx 1" /> — no vanishing.
                When f&#8329; &#8776; 0 for irrelevant steps, the gradient is deliberately cut — a
                learned form of gradient control.
            </p>

            <div className="ch-callout">
                <strong>Bengio et al. (1994) conclusion:</strong> The vanishing gradient problem cannot
                be fixed by better initialisation, better optimisers, or different activation functions
                within the standard RNN framework. The only solutions are: (1) architectural skip connections
                that bypass the multiplicative Jacobian chain (LSTM cell state, ResNet skip connections),
                or (2) attention mechanisms that allow tokens to interact directly without sequential
                propagation (Transformer). These insights, stated in 1994, defined the agenda for
                deep learning architecture research through 2017 and beyond.
            </div>
        </>
    )
}

const PY_CODE = `# ── Demonstrating the Vanishing Gradient Empirically ──────────────────────────
import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def sigmoid_prime(z):
    s = sigmoid(z)
    return s * (1 - s)

def tanh(z):
    return np.tanh(z)

def tanh_prime_from_h(h):
    """Given h = tanh(z), compute tanh'(z) = 1 - h^2"""
    return 1 - h ** 2

# ── Experiment 1: Gradient norm decay vs lag ───────────────────────────────────
print("=" * 60)
print("Experiment 1: How fast do gradients vanish?")
print("=" * 60)

np.random.seed(42)
n = 16    # hidden dimension

def simulate_gradient_decay(Whh, act, n_steps):
    """Simulate the effect of multiplying Jacobians through n_steps."""
    # Start gradient at identity (magnitude 1 in all directions)
    grad = np.eye(n)
    for _ in range(n_steps):
        if act == "tanh":
            deriv = 1.0         # worst case: tanh'(0) = 1
        else:
            deriv = 0.25        # worst case: sigmoid'(0) = 0.25
        # J_i = diag(tanh'(z_i)) * W_hh^T; norm bounded by deriv * ||W_hh||
        J = deriv * Whh.T
        grad = J @ grad
    return np.linalg.norm(grad, ord=2)

# Small spectral radius (stable training init)
Whh_small = np.random.randn(n, n) * 0.5
spec_rad = max(np.abs(np.linalg.eigvals(Whh_small)))
print(f"Spectral radius: {spec_rad:.3f}")
print()
print(f"{'Steps':>6}  {'sigmoid':>12}  {'tanh':>12}")
for k in [1, 5, 10, 20, 50, 100]:
    norm_sig  = simulate_gradient_decay(Whh_small, "sigmoid", k)
    norm_tanh = simulate_gradient_decay(Whh_small, "tanh",    k)
    print(f"{k:6d}  {norm_sig:12.2e}  {norm_tanh:12.2e}")

print()
print("Observation: sigmoid vanishes ~5x faster than tanh!")

# ── Experiment 2: Spectral radius controls vanishing/exploding ──────────────────
print()
print("=" * 60)
print("Experiment 2: How spectral radius determines gradient behaviour")
print("=" * 60)

for scale in [0.3, 0.5, 0.9, 1.0, 1.1, 1.5]:
    W_s = np.random.randn(n, n) * scale
    spec_rad = max(np.abs(np.linalg.eigvals(W_s)))
    norm_after_20 = simulate_gradient_decay(W_s, "tanh", 20)
    if norm_after_20 < 1e-6:
        status = "VANISHING"
    elif norm_after_20 > 1e3:
        status = "EXPLODING"
    else:
        status = "OK"
    print(f"  scale={scale:.1f}, rho={spec_rad:.3f}, norm@20={norm_after_20:.2e} -> {status}")

print()
print("Key: spectral radius < 1 -> vanishing, > 1 -> exploding!")
print("The 'OK' region is extremely narrow and unstable.")

# ── Experiment 3: LSTM cell state has no vanishing ─────────────────────────────
print()
print("=" * 60)
print("Experiment 3: LSTM constant error carousel")
print("=" * 60)

# LSTM: d(c_t)/d(c_{t-1}) = f_t (forget gate)
# With f_t = 1 (open): gradient flows unchanged
forget_gate_open   = 0.98   # learned value close to 1
forget_gate_closed = 0.02   # learned value close to 0

grad_open   = forget_gate_open   ** 100    # after 100 steps
grad_closed = forget_gate_closed ** 100

print(f"Cell state gradient after 100 steps:")
print(f"  forget gate = 0.98 (open):  {grad_open:.4f}  <- GRADIENT PRESERVED!")
print(f"  forget gate = 0.02 (closed): {grad_closed:.2e} <- GRADIENT CUT (by design)")
print()
print("LSTM learns which dependencies to preserve (f->1) and discard (f->0).")
print("This is gradient control, not just gradient flow.")`

function PythonContent() {
    return (
        <>
            <p>
                Three experiments demonstrating the vanishing gradient problem empirically:
                (1) gradient norm decay vs. sequence length for sigmoid vs. tanh, (2) the
                effect of spectral radius on gradient behaviour, and (3) why LSTM's cell state
                eliminates vanishing by replacing the Jacobian chain with a forget-gate product.
            </p>
            <CodeBlock code={PY_CODE} filename="vanishing_gradient.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const VANISHING_GRADIENT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
