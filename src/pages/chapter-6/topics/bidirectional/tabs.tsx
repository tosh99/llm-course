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
            year: "1997",
            title: "Schuster &amp; Paliwal — Reading the Sequence in Both Directions",
            challenge:
                "Standard RNNs process sequences left-to-right, meaning the representation at time t depends only on the inputs at positions 1 through t. For many tasks, this is a significant limitation: understanding why a word was used requires knowing both what came before it and what comes after. In phoneme recognition, the pronunciation of a sound depends on its phonetic context in both directions. In named entity recognition, determining whether 'Washington' is a city or a person often depends on words both before and after. A unidirectional RNN sees only half the available context.",
            what: "Mike Schuster and Kuldip K. Paliwal at NTT published 'Bidirectional Recurrent Neural Networks' in IEEE Transactions on Signal Processing (1997). The architecture is elegantly simple: run two independent RNNs over the same sequence — one left-to-right, one right-to-left — and concatenate their hidden states at each position. The forward RNN h&#8594;&#8329; captures all context to the left of position t; the backward RNN h&#8592;&#8329; captures all context to the right. Together, h&#8329; = [h&#8594;&#8329;; h&#8592;&#8329;] provides full bidirectional context at every position, with twice the hidden dimension. Both RNNs are trained jointly by backpropagation through time, with a shared loss function over the concatenated representations.",
            impact:
                "The paper immediately demonstrated accuracy gains on phoneme classification using the TIMIT dataset. The bidirectional architecture outperformed the unidirectional LSTM on nearly every phoneme in the dataset. This proved the intuition: for offline sequence tasks where the full sequence is available before prediction begins, using context from both directions is almost always better than using only past context.",
        },
        {
            year: "2005",
            title: "Graves &amp; Schmidhuber — Bidirectional LSTM (BLSTM)",
            challenge:
                "Schuster and Paliwal's original bidirectional RNN used simple recurrent cells. But simple RNNs suffered from the vanishing gradient — they couldn't capture long-range dependencies. Combining bidirectionality with long-range memory required pairing the bidirectional architecture with LSTM cells, creating a system with four information pathways: forward-left, forward-right, backward-left, backward-right (where 'left' and 'right' refer to left-to-right vs. right-to-left processing, and 'forward' and 'backward' refer to the forward and backward RNN in BPTT).",
            what: "Alex Graves and Jürgen Schmidhuber published 'Framewise Phoneme Classification with Bidirectional LSTM Networks' (2005). The Bidirectional LSTM (BLSTM) replaces the simple RNN cells in Schuster-Paliwal's architecture with LSTM cells. Each direction has its own cell state and hidden state, its own set of gate weights, and its own BPTT gradient. The only interaction between the two directions is at the output layer, where the concatenated hidden states are combined. This design allows the two LSTMs to specialise: the forward LSTM learns what prefix context is relevant; the backward LSTM learns what suffix context is relevant.",
            impact:
                "BLSTM became the dominant architecture for sequence labelling throughout the late 2000s and early 2010s. It achieved state-of-the-art on handwriting recognition (IAM dataset), phoneme recognition (TIMIT), and various sequence tagging tasks. The combination of bidirectionality and LSTM gating proved especially powerful for tasks where both long-range and bidirectional context mattered simultaneously — reading entire words before deciding how to pronounce each phoneme, or reading entire sentences before labelling each token.",
        },
        {
            year: "2013–2016",
            title: "Bidirectional LSTMs Dominate NLP — Tagging, Translation, and Attention",
            challenge:
                "As neural NLP matured from research to production, bidirectional encoders became standard components. The key insight was that for any task where the full input sequence is available before prediction begins — translation, summarisation, named entity recognition, sentiment analysis, question answering over a document — a bidirectional encoder strictly dominates a unidirectional one. The only tasks where unidirectional encoders are mandatory are streaming and generation tasks, where future tokens haven't arrived yet.",
            what: "Bahdanau, Cho, and Bengio (2014) used a bidirectional encoder (BiRNN with GRU cells) in their landmark attention model for neural machine translation. The attention mechanism computed weights over all source positions at each decoding step, allowing the decoder to 'look back' at any part of the source. The source encoder was bidirectional: each source position carried both left and right context, making the attended representations richer. Lample et al. (2016) used BLSTM with CRF output for named entity recognition, achieving state-of-the-art across multiple languages without hand-crafted features.",
            impact:
                "Bidirectional LSTM became the default encoder in every competitive sequence-labelling and sequence-to-sequence system from 2014 through 2017. The architecture was so effective and so standardised that it appeared as a near-universal component in winning systems at shared tasks for NER, parsing, coreference resolution, and machine translation. Its conceptual influence continues in the Transformer era: BERT's encoder is inherently bidirectional, attending from every position to every other position simultaneously — the logical extension of the bidirectional RNN principle.",
        },
        {
            year: "2017–2018",
            title: "The Bridge to BERT — From Bi-LSTM to Bidirectional Pre-training",
            challenge:
                "The Transformer architecture (Vaswani et al., 2017) eliminated the sequential processing bottleneck of RNNs. But the choice of training objective — whether to pre-train left-to-right (GPT style) or bidirectionally (BERT style) — directly inherited the debate from the RNN era. GPT used a unidirectional left-to-right language model. BERT's masked language model required a bidirectional encoder. The same conceptual divide — unidirectional generation vs. bidirectional understanding — that separated simple RNNs from bidirectional LSTMs resurfaced in the Transformer era.",
            what: "BERT (Devlin et al., 2018) pre-trained a Transformer encoder using masked language modelling: randomly masking tokens in the input and training the encoder to predict the masked tokens from bidirectional context. This is a direct descendant of the bidirectional RNN principle — every position sees context from both directions. The Transformer encoder's self-attention is inherently bidirectional: at each position, the attention query attends to all other positions, left and right. BERT's bidirectionality is what makes it superior to GPT at understanding tasks (reading comprehension, NLI, NER) while GPT's directionality is what makes it suitable for generation.",
            impact:
                "The bidirectional vs. unidirectional debate from the RNN era resolved in the Transformer era into a simple rule: use bidirectional encoding for understanding tasks, unidirectional decoding for generation. This is exactly the rule that the bidirectional RNN literature established. BERT-style models dominate classification, tagging, and extraction tasks; GPT-style models dominate text generation. The conceptual architecture of BERT traces directly to Schuster-Paliwal 1997.",
        },
        {
            year: "2018–Present",
            title: "Limitations and the End of the Bi-LSTM Era",
            challenge:
                "Despite their dominance, bidirectional LSTMs had inherent limitations that became increasingly apparent as tasks scaled and compute expanded. Processing sequences was fundamentally serial: even with bidirectionality, each time step must be computed after the previous one, preventing parallelism across the sequence dimension. For very long sequences (entire documents, long audio files), both the forward and backward LSTM had to process every token before producing any output — quadratic in the worst case if stacked many layers deep.",
            what: "The Transformer's self-attention replaced the bidirectional LSTM's sequential processing with fully parallel attention: every position could attend to every other position in a single computation. This made training on long sequences dramatically more efficient (parallelisable across positions) and made fine-grained context dependencies (not just the running hidden state, but direct attention to any previous token) more accessible. By 2019, BERT-based Transformers had surpassed bidirectional LSTMs on all major NLP benchmarks.",
            impact:
                "The bidirectional LSTM is no longer the state of the art for most tasks. But it remains important in four contexts: (1) low-resource and edge-device settings where Transformer attention's quadratic memory cost is prohibitive; (2) streaming audio processing where the sequence must be processed in real time with bounded latency; (3) theoretical analysis, where the bidirectional RNN's well-understood gradient properties make it easier to study formally; and (4) as a historical reference point — understanding why bidirectionality matters, and what it costs, is essential for understanding modern architecture design choices in Transformers. Looking ahead: while this chapter covered temporal patterns in sequences, the next chapter turns to spatial patterns in images — a completely different structure that demanded a completely different architecture.",
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
            <h2>Two friends reading a book from opposite ends</h2>

            <Analogy label="The One-Way Reader (Vanilla RNN)">
                Imagine reading a mystery novel with a strange rule: you can only read from page 1 forward, one page at a time, and you're not allowed to peek ahead. When you reach chapter 5, you have no idea who the villain is because that reveal happens in chapter 20.
                <br /><br />
                Your understanding of chapter 5 is incomplete — you're working with only half the story. This is a standard (unidirectional) RNN: it processes the sequence left to right and can only use past context, never future context, when computing the representation at each position.
            </Analogy>

            <Analogy label="The Two-Way Reader (Bidirectional RNN)">
                Now imagine you have two copies of the book and two friends. One friend reads normally from page 1 forward. The other friend starts at the last page and reads backward toward page 1. At every chapter, they compare notes — what have you seen up to here, what will come later?
                <br /><br />
                When they meet in the middle, they each have a full picture of the book from their direction. Combining their notes gives you complete context at every chapter: everything that came before AND everything that comes after. That's exactly what a bidirectional RNN does — the forward RNN covers the past, the backward RNN covers the future, and you combine both.
            </Analogy>

            <Analogy label="Real-World Example — Is Washington a City or a Person?">
                Suppose you see the word "Washington" in a sentence. Reading left-to-right only, if you see "visited Washington yesterday," you'd guess it's a city. But "George Washington was..." makes it a person.
                <br /><br />
                A bidirectional reader sees both sides: "The president visited Washington yesterday for a summit." The forward context ("The president visited") and backward context ("for a summit") together confirm it's the city, not the person. The bidirectional RNN makes this use of full context automatic and learned from data.
            </Analogy>

            <Analogy label="The Big Trade-Off — When You Can't Look Ahead">
                Bidirectional RNNs have one critical limitation: you need the <em>entire</em> sequence before you can start processing. The backward RNN has to start at the end and work backward — so you must have the end before you begin.
                <br /><br />
                This is fine for translation (you have the full source sentence before generating the target), sentiment analysis (you have the full review), and named entity recognition (you have the full document). But it's impossible for text generation: you can't read the next word before you've written it. And it's impractical for real-time speech recognition: you can't wait for someone to finish their entire sentence before transcribing the first word.
                <br /><br />
                Unidirectional for generation; bidirectional for understanding. This trade-off — which the bidirectional RNN made explicit — directly shaped the GPT vs. BERT split in modern language models.
            </Analogy>

            <Analogy label="What comes next — a completely different way to see">
                RNNs and bidirectional RNNs process sequences step by step through time. But a completely separate tradition was developing in parallel: networks that processed <em>space</em> rather than time — looking at local patches of an image and combining them into a hierarchy of features. That tradition, beginning with Fukushima's Neocognitron in 1980 and Hubel-Wiesel's 1962 neuroscience discoveries, reached its landmark with LeCun's LeNet-5 in 1998. That is Chapter 7: Convolutional Neural Networks — where spatial structure, not temporal sequence, is the fundamental inductive bias.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Forward and backward passes combined — the bidirectional architecture</h2>

            <h3>Architecture</h3>
            <p>
                A bidirectional RNN (Bi-RNN) consists of two independent RNN layers processing the
                same input sequence in opposite directions:
            </p>
            <ul>
                <li><strong>Forward RNN</strong> <InlineMath tex="\overrightarrow{h}_t" />: processes x&#8329; for t = 1, ..., T left-to-right. At time t, it has seen x&#8330;, ..., x&#8329;.</li>
                <li><strong>Backward RNN</strong> <InlineMath tex="\overleftarrow{h}_t" />: processes x&#8329; for t = T, ..., 1 right-to-left. At time t, it has seen x&#8329;, ..., x&#8338;.</li>
            </ul>

            <h3>Forward Pass Equations</h3>
            <MathBlock tex="\overrightarrow{h}_t = f\!\left(\overrightarrow{W}\,x_t + \overrightarrow{U}\,\overrightarrow{h}_{t-1} + \overrightarrow{b}\right) \qquad t = 1, \dots, T" />
            <MathBlock tex="\overleftarrow{h}_t = f\!\left(\overleftarrow{W}\,x_t + \overleftarrow{U}\,\overleftarrow{h}_{t+1} + \overleftarrow{b}\right) \qquad t = T, \dots, 1" />
            <p>
                The function f is typically tanh or, for BiLSTM, the full LSTM cell computation.
                Both RNNs share the same loss function and are trained jointly.
            </p>

            <h3>Output Representation</h3>
            <p>
                At each position t, the two directional hidden states are concatenated:
            </p>
            <MathBlock tex="h_t = \left[\overrightarrow{h}_t;\; \overleftarrow{h}_t\right] \in \mathbb{R}^{2n}" />
            <p>
                This doubles the hidden dimension. Alternatives include summing or averaging:
                <InlineMath tex="h_t = \overrightarrow{h}_t + \overleftarrow{h}_t" /> (preserves dimension but
                conflates directions). Concatenation is standard because it preserves all directional information.
            </p>

            <h3>Training Considerations</h3>
            <p>
                The forward and backward RNNs do not interact during the forward pass (only at the output).
                Their gradients are therefore computed independently via separate BPTT passes:
                the forward RNN's BPTT goes from T to 1; the backward RNN's BPTT goes from 1 to T.
                The two gradient computations can be parallelised on separate GPU streams and synchronised
                only when computing the gradient w.r.t. the input embeddings.
            </p>

            <h3>Why Double Parameters Is Worth It</h3>
            <p>
                In a unidirectional RNN, information from position t+1 must travel through the
                recurrence to reach position t — attenuating at every step and requiring the network
                to encode all future-relevant information into a compressed state. In a BiRNN,
                position t receives direct, unattenuated information from both t&#8722;1 (forward)
                and t+1 (backward). For NER, part-of-speech tagging, and phoneme classification,
                this typically improves accuracy by 3–8 absolute percentage points.
            </p>

            <h3>The Streaming Limitation</h3>
            <p>
                The backward RNN requires the entire input sequence before computing h&#8592;&#8329; for any position t.
                This means:
            </p>
            <ul>
                <li>Bi-RNNs cannot be used for real-time streaming tasks (speech generation, interactive text completion)</li>
                <li>They require O(T) memory for storing all forward activations before the backward pass</li>
                <li>Latency is proportional to sequence length — you must process the whole sequence before producing any output</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>GPT vs. BERT:</strong> This trade-off — unidirectional for generation, bidirectional for understanding — directly explains the modern split between GPT-style models and BERT-style models. GPT's autoregressive decoder must be unidirectional (it generates left-to-right and cannot see future tokens). BERT's encoder is bidirectional (it sees the full input sequence and uses masked language modelling to learn from both directions). The bidirectional RNN was the first neural architecture to make this trade-off explicit.
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
            <h2>Formal specification and gradient independence</h2>

            <DefBlock label="Bidirectional RNN — Formal Specification">
                Input sequence: X = (x&#8329;, ..., x&#8338;), each x&#8329; &#8712; &#8477;&#7496;.
                Forward parameters: <InlineMath tex="\overrightarrow{W} \in \mathbb{R}^{n \times d}" />,
                <InlineMath tex="\overrightarrow{U} \in \mathbb{R}^{n \times n}" />,
                <InlineMath tex="\overrightarrow{b} \in \mathbb{R}^n" />.
                Backward parameters: <InlineMath tex="\overleftarrow{W} \in \mathbb{R}^{n \times d}" />,
                <InlineMath tex="\overleftarrow{U} \in \mathbb{R}^{n \times n}" />,
                <InlineMath tex="\overleftarrow{b} \in \mathbb{R}^n" />.
                The two RNNs have independent weights — they do not share parameters.
            </DefBlock>

            <h3>Forward Computation</h3>
            <MathBlock tex="\overrightarrow{h}_t = f\bigl(\overrightarrow{W}\,x_t + \overrightarrow{U}\,\overrightarrow{h}_{t-1} + \overrightarrow{b}\bigr), \quad \overrightarrow{h}_0 = \mathbf{0}" />
            <MathBlock tex="\overleftarrow{h}_t = f\bigl(\overleftarrow{W}\,x_t + \overleftarrow{U}\,\overleftarrow{h}_{t+1} + \overleftarrow{b}\bigr), \quad \overleftarrow{h}_{T+1} = \mathbf{0}" />
            <MathBlock tex="h_t = \bigl[\overrightarrow{h}_t;\; \overleftarrow{h}_t\bigr] \in \mathbb{R}^{2n}" />

            <h3>Gradient Decomposition</h3>
            <p>
                The forward and backward RNNs do not share hidden states, so the gradient
                with respect to the input embeddings decomposes cleanly:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_t} = \overrightarrow{W}^\top \frac{\partial \mathcal{L}}{\partial \overrightarrow{h}_t} + \overleftarrow{W}^\top \frac{\partial \mathcal{L}}{\partial \overleftarrow{h}_t}" />
            <p>
                The two terms are computed independently via separate BPTT passes. This means the
                Bi-RNN gradient computation is trivially parallelisable across directions.
            </p>

            <h3>Information Content at Each Position</h3>
            <p>
                At position t, the forward state <InlineMath tex="\overrightarrow{h}_t" /> is a
                function of (x&#8330;, ..., x&#8329;), while the backward state <InlineMath tex="\overleftarrow{h}_t" />
                is a function of (x&#8329;, ..., x&#8338;). The concatenated representation h&#8329; therefore
                depends on the entire sequence:
            </p>
            <MathBlock tex="h_t = [\overrightarrow{h}_t;\, \overleftarrow{h}_t] = g(x_1, \dots, x_T)" />
            <p>
                This is the fundamental advantage over unidirectional models: h&#8329; encodes full sequence
                context at every position, without requiring all information to flow through a bottleneck
                hidden state.
            </p>

            <h3>Computational Complexity</h3>
            <MathBlock tex="\text{Time}:\quad O(2 \cdot T \cdot n^2) = O(T \cdot n^2) \;\text{(2× constant factor)}" />
            <MathBlock tex="\text{Memory}:\quad O(2 \cdot T \cdot n) = O(T \cdot n) \;\text{(must store both directional states)}" />
            <p>
                The time complexity is the same asymptotic as a unidirectional RNN with 2n hidden units.
                The memory cost is the practical bottleneck for long sequences: all forward states must
                be stored before the backward pass can begin. Gradient checkpointing (recomputing h
                during backward instead of storing it) trades compute for memory.
            </p>

            <h3>BiLSTM — Parameter Count</h3>
            <p>
                For input dimension d, hidden dimension n per direction, two directions:
            </p>
            <MathBlock tex="2 \times 4n(n + d + 1) = 8n^2 + 8nd + 8n" />
            <p>
                With n = 256, d = 50: 8&#215;65,536 + 8&#215;12,800 + 2,048 = 628,736 parameters —
                roughly 10&#215; the simple RNN with equivalent hidden dimension.
            </p>

            <div className="ch-callout">
                <strong>Bidirectional masking in Transformers:</strong> BERT uses a "masked language
                model" because a Transformer encoder is fully bidirectional — every position attends
                to every other position. GPT is autoregressive and therefore strictly unidirectional
                (each position attends only to positions at or before it, enforced by a causal mask).
                This architectural choice — bidirectional vs. unidirectional — is the single biggest
                design difference between BERT-style and GPT-style models, and it traces directly to
                the bidirectional RNN literature from 1997.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Bidirectional RNN — NumPy ──────────────────────────────────────────────────
class BiRNN:
    """Simple bidirectional RNN with tanh activation."""

    def __init__(self, input_dim, hidden_dim, seed=42):
        rng = np.random.default_rng(seed)
        self.hidden_dim = hidden_dim
        # Forward RNN parameters
        self.Wf = rng.normal(0, 0.1, (hidden_dim, input_dim))   # input->hidden
        self.Uf = rng.normal(0, 0.1, (hidden_dim, hidden_dim))  # hidden->hidden
        self.bf = np.zeros(hidden_dim)
        # Backward RNN parameters (independent weights)
        self.Wb = rng.normal(0, 0.1, (hidden_dim, input_dim))
        self.Ub = rng.normal(0, 0.1, (hidden_dim, hidden_dim))
        self.bb = np.zeros(hidden_dim)

    def _rnn_forward(self, X, W, U, b):
        """Standard left-to-right RNN. X: (T, d) -> H: (T, n)"""
        T = X.shape[0]
        H = np.zeros((T, self.hidden_dim))
        h = np.zeros(self.hidden_dim)
        for t in range(T):
            h = np.tanh(W @ X[t] + U @ h + b)
            H[t] = h
        return H

    def forward(self, X):
        """
        Returns concatenated hidden states: (T, 2*hidden_dim).
        The backward RNN processes X in reverse, then the outputs are
        reversed back so index t corresponds to position t in the sequence.
        """
        Hf = self._rnn_forward(X,           self.Wf, self.Uf, self.bf)
        Hb = self._rnn_forward(X[::-1],     self.Wb, self.Ub, self.bb)[::-1]
        return np.concatenate([Hf, Hb], axis=1)


# ── Demo: Comparing unidirectional vs bidirectional context ───────────────────
T, input_dim, hidden_dim = 8, 4, 6
rng = np.random.default_rng(3)
X = rng.normal(0, 0.5, (T, input_dim))

birnn = BiRNN(input_dim, hidden_dim)
H = birnn.forward(X)

print("Bidirectional RNN Demo")
print("=" * 55)
print(f"Sequence length : {T}")
print(f"Input dim       : {input_dim}")
print(f"Hidden dim      : {hidden_dim} (each direction)")
print(f"Output dim      : {H.shape[1]} (forward + backward concatenated)")
print()
print("Position  ||h_fwd||  ||h_bwd||  interpretation")
print("-" * 55)
for t in range(T):
    fwd_norm = np.linalg.norm(H[t, :hidden_dim])
    bwd_norm = np.linalg.norm(H[t, hidden_dim:])
    # Forward state grows as it sees more left context
    # Backward state grows as it sees more right context (from right to left)
    interp = "left ctx" if t < T//2 else "right ctx"
    print(f"  t={t:2d}    {fwd_norm:.3f}      {bwd_norm:.3f}    {interp}")

# ── PyTorch BiLSTM ─────────────────────────────────────────────────────────────
print()
print("PyTorch BiLSTM API:")
print()
print("  import torch.nn as nn")
print("  bilstm = nn.LSTM(input_size=50,")
print("                   hidden_size=256,")
print("                   num_layers=2,")
print("                   batch_first=True,")
print("                   bidirectional=True)   # <- one flag!")
print()
print("  # x: (batch, seq_len, input_size)")
print("  # output: (batch, seq_len, 2*hidden_size)  <- both directions concatenated")
print("  # h_n: (2*num_layers, batch, hidden_size) <- all final hidden states")
print("  output, (h_n, c_n) = bilstm(x)")
print()
print("  # To get per-direction final states:")
print("  # Forward final:  h_n[0::2]   (even indices)")
print("  # Backward final: h_n[1::2]   (odd indices)")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a bidirectional RNN showing the key trick: run the standard
                forward function on the reversed input to get the backward direction, then reverse
                the backward outputs so that index t aligns with position t. PyTorch's
                <code>bidirectional=True</code> flag does this transparently.
            </p>
            <CodeBlock code={PY_CODE} filename="birnn.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Memory note:</strong> Bidirectional processing requires the entire sequence
                to be in memory before the backward pass begins. For very long sequences (T &#62; 10,000),
                gradient checkpointing reduces memory at the cost of recomputing forward activations
                during backprop. PyTorch's <code>torch.utils.checkpoint</code> provides this.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const BIDIRECTIONAL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
