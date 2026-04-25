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
            year: "1991–1997",
            title: "The Six-Year Gap — From Diagnosis to Solution",
            challenge:
                "By 1994, Bengio, Simard, and Frasconi had proven that the vanishing gradient problem was a mathematical inevitability for standard RNNs — not a bug but a theorem. The field understood the problem precisely. What it lacked was an architectural solution. The solution had to satisfy two contradictory requirements simultaneously: provide a path for gradients to flow unchanged over arbitrary distances (requiring linear, unit-weight self-connections) while still allowing the network to selectively update its memory (requiring non-linear, learnable operations). No one knew how to satisfy both at once.",
            what: "Sepp Hochreiter, now a doctoral student at TU Munich, had been working on the problem since his 1991 diploma thesis. Together with his supervisor Jürgen Schmidhuber, he developed the Long Short-Term Memory architecture. The key insight — which took six years to fully crystallise — was to separate the network's memory (the cell state) from its working representation (the hidden state), and to control information flow between them with learned, differentiable gates.",
            impact:
                "The six-year gap between the problem and the solution reflects how genuinely difficult the design challenge was. It required abandoning the assumption that all connections should be trained by backpropagation in the usual way, and instead introducing a fixed-weight linear self-connection (weight = 1) that was not learned — an unusual move in a field defined by learned representations. The delay also suggests that the solution required a conceptual shift, not just technical refinement.",
        },
        {
            year: "1997",
            title: "Hochreiter & Schmidhuber — The LSTM Paper",
            challenge:
                "The specific challenge was to design an architecture where: (1) the gradient could flow from time T to time t without decaying, regardless of T &#8722; t; (2) the network could nevertheless learn what to remember and what to forget adaptively; and (3) the entire system, including the gating decisions, could be trained end-to-end by gradient descent without any special-casing.",
            what: "Hochreiter and Schmidhuber published 'Long Short-Term Memory' in Neural Computation (1997). The architecture introduced the cell state C&#8329; — a linear recurrence with self-connection weight 1, called the Constant Error Carousel (CEC). Unlike the hidden state h&#8329;, which passes through tanh and W&#8330;&#8331; at every step, the cell state update is: c&#8329; = f&#8329; &#9651; c&#8329;&#8331;&#8321; + i&#8329; &#9651; c&#771;&#8329;. The forget gate f&#8329; &#8712; [0,1] and input gate i&#8329; &#8712; [0,1] are learned sigmoid functions of the current input and previous hidden state. The output gate o&#8329; controls how much of c&#8329; is exposed as h&#8329;.",
            impact:
                "The 1997 LSTM paper is among the most cited in machine learning history. Its impact was not immediate — the paper was ahead of its time, and the field lacked the compute and data to fully exploit LSTMs for nearly a decade. But as both improved, LSTM became the dominant architecture for every sequential modelling task: speech recognition, language modelling, machine translation, time series forecasting, music generation, handwriting recognition, and protein sequence analysis.",
        },
        {
            year: "2000",
            title: "Gers & Schmidhuber — The Forget Gate",
            challenge:
                "The original 1997 LSTM did not include a forget gate. The cell state could accumulate information indefinitely, but had no mechanism to actively clear it when it was no longer needed. For tasks where the network must reset its memory between independent sub-sequences — for example, processing multiple sentences in sequence, where context from one sentence should not contaminate the next — the original LSTM was suboptimal.",
            what: "Felix Gers, Jürgen Schmidhuber, and Fred Cummins published 'Learning to Forget: Continual Prediction with LSTM' (1999/2000), introducing the forget gate f&#8329; = &#963;(W&#8330;h&#8329;&#8331;&#8321; + U&#8330;x&#8329; + b&#8330;). The forget gate multiplies the old cell state before adding new content: c&#8329; = f&#8329; &#9651; c&#8329;&#8331;&#8321; + i&#8329; &#9651; c&#771;&#8329;. When f&#8329; &#8776; 0, old memory is erased. When f&#8329; &#8776; 1, old memory is preserved unchanged. The gate is learned from data — the network discovers what should be remembered and what should be cleared.",
            impact:
                "The forget gate became a standard component of all subsequent LSTM implementations. It is essential for tasks with natural reset points (document boundaries, sentence ends, music phrase boundaries) and for tasks where the network must track multiple independent state variables simultaneously. Without the forget gate, LSTM can accumulate irrelevant state that degrades performance on long sequences. The forget gate also improved the gradient analysis: with f&#8329; learned close to 1 for important memories, the gradient through the cell state pathway can be approximately 1 for arbitrarily long durations.",
        },
        {
            year: "2005–2010",
            title: "Graves & Schmidhuber — LSTM Conquers Handwriting and Speech",
            challenge:
                "Despite theoretical promise, LSTMs in the early 2000s were largely confined to small synthetic benchmarks. The field needed demonstrations on real, large-scale sequential tasks to convince practitioners that LSTMs were worth the additional complexity over simple RNNs or HMMs. Handwriting recognition and speech recognition were the key challenges — both required long-range temporal dependencies and both had large competitive benchmarks.",
            what: "Alex Graves and Jürgen Schmidhuber published 'Framewise Phoneme Classification with Bidirectional LSTM Networks' (2005) and subsequent work on connectionist temporal classification (CTC, 2006) — a loss function for sequence-to-sequence learning without pre-segmentation. Graves demonstrated LSTM with CTC on the TIMIT phoneme recognition benchmark, achieving state-of-the-art results. In 2009, he won the ICDAR connected handwriting recognition competition using a multidimensional LSTM. These were the first convincing large-scale demonstrations of LSTM superiority.",
            impact:
                "Graves's 2005-2009 results established LSTM as a serious competitor to HMMs for speech recognition. This created a path to the 2012 breakthrough at Google Brain, where a deep LSTM trained on 3 million hours of speech audio achieved a 30% relative error rate reduction over the best HMM system — a result that shocked the speech recognition community and began the transition of the entire field to neural sequence models.",
        },
        {
            year: "2012–2015",
            title: "LSTM Goes Industrial — Google, Apple, and Neural Machine Translation",
            challenge:
                "After Graves's demonstrations, industry labs began serious LSTM projects. Google Brain's Geoffrey Hinton, with Ilya Sutskever and Dario Amodei, applied deep LSTMs to large-scale speech recognition. Apple deployed LSTMs in Siri. But the biggest challenge was machine translation — converting a sentence in one language to another. This required not just encoding the source sequence (any LSTM could do that) but also generating the target sequence step by step, attending to the right parts of the source at each step.",
            what: "Sutskever, Vinyals, and Le published 'Sequence to Sequence Learning with Neural Networks' (NeurIPS 2014), showing that a stack of LSTMs could encode an entire source sentence into a fixed-length vector and then decode it into a target-language sentence — achieving near state-of-the-art on English-French translation without any phrase tables or linguistic features. Bahdanau, Cho, and Bengio (2014) extended this with an attention mechanism over the source LSTM hidden states, allowing the decoder to focus on different source positions at each output step — the architectural precursor to Transformer attention.",
            impact:
                "The sequence-to-sequence LSTM (with attention) became Google's neural machine translation system by 2016, serving billions of translations per day. This was the highest-profile industrial deployment of deep learning to date and proved that learned representations could match and surpass decades of hand-crafted linguistic engineering. The attention mechanism Bahdanau introduced over LSTM hidden states would later be generalised, removing the LSTM entirely, to produce the Transformer architecture in 2017.",
        },
        {
            year: "2017–Present",
            title: "From LSTM to Transformer — The Legacy",
            challenge:
                "LSTMs had a fundamental bottleneck: they processed sequences sequentially, one step at a time. For long sequences, this meant (1) the hidden state at any time t was a compressed representation of all previous inputs — a fixed-size bottleneck for potentially very long histories; and (2) training was inherently serial, preventing parallelisation across sequence positions. As sequences grew longer (full documents, long audio files, entire genomes) and compute resources expanded, the sequential bottleneck became a critical limitation.",
            what: "The Transformer (Vaswani et al., 2017) replaced the sequential LSTM with parallel self-attention: every position in the sequence directly attends to every other position in a single computation step. This eliminated the sequential bottleneck and the fixed-size memory limitation. BERT (2018) and GPT (2018) demonstrated that pre-trained Transformer models could achieve state-of-the-art on virtually every NLP benchmark, and LSTMs rapidly lost ground. However, LSTMs retained advantages in streaming, low-latency, and resource-constrained settings where Transformers' quadratic attention cost was prohibitive.",
            impact:
                "LSTM's legacy is profound: it proved that learned gating mechanisms can solve the vanishing gradient and enable long-range sequential learning. The gating principle lives on in Transformer architectures through layer normalisation (which provides gradient-flow benefits similar to the cell state), residual connections (which provide skip-gradient paths like the cell state), and the learned attention weights (which select what to attend to, analogous to what LSTM gates select to remember). The 1997 paper is the intellectual ancestor of modern large language models.",
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
            <h2>The robot that knows what to remember and what to forget</h2>

            <Analogy label="Two Notebooks, Not One">
                The simple RNN had one notebook (the hidden state) that it constantly rewrote. Every step, old information was mixed with new information, and over time the early stuff got diluted and forgotten.
                <br /><br />
                The LSTM has <strong>two</strong> notebooks. One is a <em>short-term working notepad</em> (the hidden state h&#8329;) that gets updated at every step in the usual messy way. The other is a <em>long-term protected diary</em> (the cell state c&#8329;) that is very hard to change. Information in the diary stays there unless the network explicitly decides to erase or update it.
                <br /><br />
                The key is how the diary gets updated: it's not a copy-and-squash operation. Instead, the network <em>decides</em> what to add and what to erase — using learned switches called gates.
            </Analogy>

            <Analogy label="The Editor's Desk — Three Decisions">
                Imagine you're an editor with a big desk (the cell state). Every time you receive a new document (the input x&#8329;), you make three decisions:
                <ol style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li><strong>Forget gate</strong>: "What old notes on my desk should I throw away?" Slide a delete button for each piece of information: 0 = delete it, 1 = keep it, anything in between = partially keep it.</li>
                    <li><strong>Input gate</strong>: "What from this new document should I add to my desk?" Write selected new notes.</li>
                    <li><strong>Output gate</strong>: "When someone asks me a question, what from my desk should I show them?" Expose selected parts of the cell state as the hidden state.</li>
                </ol>
                All three decisions are made by sigmoid functions — so they output values between 0 and 1, acting as soft on/off switches. And all three are <em>learned from data</em> — the network discovers what deserves to be remembered for each task it's trained on.
            </Analogy>

            <Analogy label="Why Gradients Don't Vanish in the Diary">
                In a simple RNN, the hidden state is repeatedly multiplied by the weight matrix W and squashed by tanh. These two operations, repeated 50 times, make any early gradient nearly zero.
                <br /><br />
                In an LSTM, the cell state is updated by a simpler rule: new_diary = (forget &#215; old_diary) + (input &#215; new_content). There's no big matrix multiplication, no tanh squashing — just a multiplication by the forget gate (which the network learns to keep near 1.0 for important memories) and an addition.
                <br /><br />
                When you backpropagate through this addition, the gradient for old_diary is just the forget gate value — not a product of matrix multiplications and non-linear derivatives. If forget &#8776; 1 throughout the sequence, the gradient flows back unchanged over 100 or 1000 steps. This is the Constant Error Carousel: a direct gradient highway through time.
            </Analogy>

            <Analogy label="The Superpower — Learning to Forget">
                The most surprising part of LSTM is the forget gate. You'd think the goal is to remember everything. But Hochreiter and Schmidhuber realised that <em>knowing what to forget</em> is equally important.
                <br /><br />
                For a sentence like "The cake was delicious. I ate it all.", the LSTM learns to forget "cake" after processing "all." — it's no longer needed. For a long novel, the network learns which characters are still in the story and which have left the scene. For a stock price prediction, it learns to forget seasonal patterns when predicting short-term volatility.
                <br /><br />
                The forget gate is a learned decision, not a fixed rule. This is what makes LSTM adaptive: it adjusts its memory strategy based on the task it's trained to perform.
            </Analogy>

            <Analogy label="Applications — Where LSTMs Changed Everything">
                LSTMs became the dominant tool for sequential data from 1997 through 2017:
                <br /><br />
                <strong>Speech recognition</strong> — Google's voice assistant used LSTMs that reduced error rates by 30% over the previous best systems. Every time you talk to Google Assistant, you're using LSTM descendants.
                <br /><br />
                <strong>Machine translation</strong> — Google Translate switched to neural machine translation based on LSTMs in 2016. The quality improvement was dramatic — years of painstaking rule-based work was surpassed in one step.
                <br /><br />
                <strong>Text generation</strong> — Generating Shakespeare-like text, writing code, composing music — all demonstrated with LSTMs years before GPT existed.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The gating mechanism that makes long-term memory possible</h2>

            <h3>The Cell State: A Conveyor Belt Through Time</h3>
            <p>
                The central innovation of LSTM is the <strong>cell state</strong> C&#8329;,
                a vector that runs through the entire sequence. Unlike the hidden state h&#8329;,
                which is passed through tanh and multiplied by the recurrent weight matrix at each step,
                the cell state update is a controlled linear operation:
            </p>
            <MathBlock tex="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" />
            <p>
                This is an element-wise operation: no matrix multiplication involving W&#8330;&#8331;,
                no squashing non-linearity on the entire state. The gradient of c&#8329; with respect
                to c&#8329;&#8331;&#8321; is simply diag(f&#8329;) — the forget gate values.
            </p>

            <h3>The Three Gates — Full LSTM Equations</h3>
            <MathBlock tex="\begin{aligned} f_t &= \sigma(W_f\,h_{t-1} + U_f\,x_t + b_f) & \text{(forget gate)} \\ i_t &= \sigma(W_i\,h_{t-1} + U_i\,x_t + b_i) & \text{(input gate)} \\ \tilde{c}_t &= \tanh(W_c\,h_{t-1} + U_c\,x_t + b_c) & \text{(candidate cell)} \\ c_t &= f_t \odot c_{t-1} + i_t \odot \tilde{c}_t & \text{(cell state)} \\ o_t &= \sigma(W_o\,h_{t-1} + U_o\,x_t + b_o) & \text{(output gate)} \\ h_t &= o_t \odot \tanh(c_t) & \text{(hidden state)} \end{aligned}" />
            <p>
                All gate activations (f, i, o) use sigmoid &#963; &#8712; (0,1). The candidate cell state uses
                tanh &#8712; (-1,1). The cell state update is purely linear (no non-linearity on c&#8329; itself).
            </p>

            <h3>Why the Cell State Prevents Vanishing Gradients</h3>
            <p>
                The gradient of the total loss with respect to the cell state at time t is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial c_t} = \frac{\partial \mathcal{L}}{\partial c_T} \cdot \prod_{i=t+1}^{T} \frac{\partial c_i}{\partial c_{i-1}} = \frac{\partial \mathcal{L}}{\partial c_T} \odot \prod_{i=t+1}^{T} f_i" />
            <p>
                Each f&#8329; &#8712; [0,1]. If the network learns f&#8329; &#8776; 1 for relevant steps,
                the product remains close to 1 regardless of T &#8722; t. This is the
                <strong> Constant Error Carousel</strong> — a direct gradient highway through time.
            </p>

            <h3>Parameter Count vs. Simple RNN</h3>
            <p>
                For input dimension d and hidden dimension n, the LSTM has four weight matrices (one
                per gate/candidate) for each of the h&#8329;&#8331;&#8321; and x&#8329; inputs:
            </p>
            <MathBlock tex="4 \times (n \times n + n \times d + n) = 4n(n + d + 1)" />
            <p>
                Compared to the simple RNN's n&#178; + nd + n. With n = 256, d = 50: LSTM has
                4&#215;256&#215;307 = 314,368 parameters vs. simple RNN's 65,536 parameters — about 5&#215; more.
                This cost is worth paying for the gradient-stability benefits.
            </p>

            <h3>Peephole Connections (Gers &amp; Schmidhuber, 2000)</h3>
            <p>
                The original LSTM's gates could only "see" h&#8329;&#8331;&#8321; and x&#8329;, not c&#8329;&#8331;&#8321; directly.
                Peephole connections extend each gate to also observe the cell state:
            </p>
            <MathBlock tex="f_t = \sigma(W_f\,h_{t-1} + U_f\,x_t + V_f\,c_{t-1} + b_f)" />
            <p>
                This allows more precise timing decisions — the gate can base its decision on exactly
                how much is currently stored in the cell, not just on the compressed hidden state.
                Peepholes improve performance on tasks requiring precise timing, such as processing
                time series with regular event intervals.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Key contrast with simple RNN:</strong> A simple RNN's hidden state transition
                is non-linear (tanh after matrix multiplication). Small changes in early weights get
                squashed and multiplied at every step, leading to exponential gradient decay. LSTM's
                cell state update is controlled linear: the network learns the best f&#8329; and i&#8329; values
                for the task, giving it the expressiveness of a non-linear model with the gradient
                stability of a linear recurrence. The hidden state h&#8329; = o&#8329; &#9651; tanh(c&#8329;) remains
                non-linear, but its gradient pathway is secondary to the cell state's direct highway.
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

            <DefBlock label="LSTM Cell Equations (Hochreiter &amp; Schmidhuber, 1997)">
                Given input x&#8329; and previous state (h&#8329;&#8331;&#8321;, c&#8329;&#8331;&#8321;):
                <MathBlock tex="f_t = \sigma(W_f\,h_{t-1} + U_f\,x_t + b_f) \in (0,1)^n" />
                <MathBlock tex="i_t = \sigma(W_i\,h_{t-1} + U_i\,x_t + b_i) \in (0,1)^n" />
                <MathBlock tex="\tilde{c}_t = \tanh(W_c\,h_{t-1} + U_c\,x_t + b_c) \in (-1,1)^n" />
                <MathBlock tex="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" />
                <MathBlock tex="o_t = \sigma(W_o\,h_{t-1} + U_o\,x_t + b_o) \in (0,1)^n" />
                <MathBlock tex="h_t = o_t \odot \tanh(c_t)" />
            </DefBlock>

            <h3>The Constant Error Carousel</h3>
            <p>
                The key mathematical property: the cell state Jacobian is diagonal:
            </p>
            <MathBlock tex="\frac{\partial c_t}{\partial c_{t-1}} = \operatorname{diag}(f_t)" />
            <p>
                The long-range gradient through the cell state is:
            </p>
            <MathBlock tex="\frac{\partial c_T}{\partial c_t} = \prod_{i=t+1}^{T} \operatorname{diag}(f_i) = \operatorname{diag}\!\left(\prod_{i=t+1}^{T} f_i\right)" />
            <p>
                Each f&#8329; &#8712; (0,1)&#8319;. If the network learns f&#8329; = 1 for all i in [t+1, T]:
            </p>
            <MathBlock tex="\frac{\partial c_T}{\partial c_t} = I_n \quad \text{(identity — gradient flows unchanged)}" />
            <p>
                This is the <strong>Constant Error Carousel</strong>: errors propagate through the cell state
                without any attenuation, regardless of the number of time steps.
            </p>

            <h3>Comparing Gradient Pathways</h3>
            <p>
                <strong>Simple RNN:</strong> gradient of h&#8338; w.r.t. h&#8329;:
            </p>
            <MathBlock tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T} \operatorname{diag}(\tanh'(z_i)) \cdot W_{hh}^\top \quad \Rightarrow \quad \|\cdot\| \leq \rho(W_{hh})^{T-t}" />
            <p>
                <strong>LSTM cell state:</strong> gradient of c&#8338; w.r.t. c&#8329;:
            </p>
            <MathBlock tex="\frac{\partial c_T}{\partial c_t} = \prod_{i=t+1}^{T} \operatorname{diag}(f_i) \quad \Rightarrow \quad \|\cdot\| = \prod_{i=t+1}^{T} f_i \approx 1 \text{ when } f_i \approx 1" />
            <p>
                The contrast is stark: the RNN gradient involves W&#8330;&#8331; (a learnable n&#215;n matrix)
                and non-linearity derivatives at every step. The LSTM cell gradient involves only
                forget gates (scalars in [0,1]) — a much more stable product.
            </p>

            <h3>Gradient Flow Analysis for All Parameters</h3>
            <p>
                The gradient of the loss with respect to W&#8330; (one of the weight matrices) at time t
                involves the product of cell-state Jacobians:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial W_f} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}}{\partial c_T} \cdot \frac{\partial c_T}{\partial c_t} \cdot \frac{\partial c_t}{\partial f_t} \cdot \frac{\partial f_t}{\partial W_f}" />
            <p>
                The middle term <InlineMath tex="\frac{\partial c_T}{\partial c_t}" /> is the product of
                forget gates — approximately 1 when gates are open. The outer terms involve local
                computations at time t only — no product over steps needed for those. This is why
                LSTM can learn the forget gate weights themselves from very long sequences.
            </p>

            <h3>GRU — The Simplified Alternative (Cho et al., 2014)</h3>
            <p>
                The Gated Recurrent Unit merges the cell state and hidden state, using two gates:
            </p>
            <MathBlock tex="\begin{aligned} z_t &= \sigma(W_z h_{t-1} + U_z x_t) & \text{(update gate)} \\ r_t &= \sigma(W_r h_{t-1} + U_r x_t) & \text{(reset gate)} \\ \tilde{h}_t &= \tanh(W(r_t \odot h_{t-1}) + Ux_t) & \text{(candidate)} \\ h_t &= (1-z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t & \text{(hidden state)} \end{aligned}" />
            <p>
                The update gate z&#8329; interpolates between old and new content. When z&#8329; = 0:
                h&#8329; = h&#8329;&#8331;&#8321; (perfect memory). When z&#8329; = 1: h&#8329; = h&#771;&#8329; (full update).
                The gradient through the hidden state is:
                <InlineMath tex="\frac{\partial h_T}{\partial h_t} = \prod_{i=t+1}^{T}(1 - z_i)" />.
                When z&#8329; &#8776; 0 (strong memory), the gradient product is &#8776; 1 — the same CEC property as LSTM, achieved with fewer parameters.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> The LSTM's success is not that it prevents gradients from
                vanishing — it's that it gives the network <em>control</em> over when to preserve and
                when to discard gradient information. The forget gate is a learned gradient valve:
                the network decides, from data, when to maintain the gradient highway and when to close it.
                This is fundamentally different from the simple RNN, where the gradient flow is determined
                entirely by the fixed weight matrix W&#8330;&#8331; and the non-linearity — both of which
                conspire to make the gradient vanish.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-np.clip(z, -500, 500)))

def tanh(z):
    return np.tanh(z)

# ── LSTM Cell — Full Forward Pass ──────────────────────────────────────────────
def lstm_cell(x_t, h_prev, c_prev, params):
    """
    Single LSTM cell forward pass (Hochreiter & Schmidhuber, 1997).

    x_t:    (input_dim,)   — input at time t
    h_prev: (hidden_dim,)  — previous hidden state
    c_prev: (hidden_dim,)  — previous cell state
    params: dict with keys Wf,Wi,Wc,Wo (hidden×hidden),
                           Uf,Ui,Uc,Uo (hidden×input),
                           bf,bi,bc,bo (hidden,)
    Returns: (h_t, c_t)
    """
    Wf,Wi,Wc,Wo = params["Wf"],params["Wi"],params["Wc"],params["Wo"]
    Uf,Ui,Uc,Uo = params["Uf"],params["Ui"],params["Uc"],params["Uo"]
    bf,bi,bc,bo = params["bf"],params["bi"],params["bc"],params["bo"]

    # Gates: sigmoid -> (0, 1)
    f = sigmoid(Wf @ h_prev + Uf @ x_t + bf)   # forget gate
    i = sigmoid(Wi @ h_prev + Ui @ x_t + bi)   # input gate
    o = sigmoid(Wo @ h_prev + Uo @ x_t + bo)   # output gate

    # Candidate cell state: tanh -> (-1, 1)
    c_tilde = tanh(Wc @ h_prev + Uc @ x_t + bc)

    # Cell state update — the Constant Error Carousel
    # d(c_t)/d(c_{t-1}) = f_t  (not W_hh * tanh'!)
    c_t = f * c_prev + i * c_tilde

    # Hidden state — squeezed through output gate
    h_t = o * tanh(c_t)

    return h_t, c_t, {"f": f, "i": i, "o": o, "c_tilde": c_tilde}

# ── Full Sequence Forward Pass ─────────────────────────────────────────────────
def lstm_forward(X, params, h0=None, c0=None):
    """
    Forward pass through an LSTM for a full sequence.
    X: (T, input_dim)
    Returns: H (T, hidden_dim), C (T, hidden_dim), gate_cache list
    """
    T, _ = X.shape
    hidden_dim = params["Wf"].shape[0]
    h = np.zeros(hidden_dim) if h0 is None else h0
    c = np.zeros(hidden_dim) if c0 is None else c0

    H, C, cache = [], [], []
    for t in range(T):
        h, c, gates = lstm_cell(X[t], h, c, params)
        H.append(h); C.append(c); cache.append(gates)

    return np.array(H), np.array(C), cache

# ── Demo: Constant Error Carousel ──────────────────────────────────────────────
print("=" * 60)
print("LSTM Constant Error Carousel — Gradient Flow Demo")
print("=" * 60)

# Simulate a cell with open forget gate (strong memory)
n_steps = 50
forget_open  = 0.97   # near 1: memory preserved
forget_closed = 0.05  # near 0: memory erased

grad_open   = forget_open  ** n_steps
grad_closed = forget_closed ** n_steps
grad_rnn    = 0.85 ** n_steps   # typical RNN gradient decay

print(f"After {n_steps} steps:")
print(f"  LSTM (f=0.97, open):  gradient = {grad_open:.4f}  <- preserved!")
print(f"  LSTM (f=0.05, closed): gradient = {grad_closed:.2e} <- cut (by design!)")
print(f"  Simple RNN (rho=0.85): gradient = {grad_rnn:.2e} <- vanished")

# ── PyTorch LSTM comparison ────────────────────────────────────────────────────
print()
print("PyTorch LSTM API:")
print()
print("  import torch.nn as nn")
print("  lstm = nn.LSTM(input_size=50, hidden_size=256, num_layers=2,")
print("                 batch_first=True, dropout=0.2)")
print()
print("  # Forward pass:")
print("  # x: (batch, seq_len, input_size)")
print("  # output: (batch, seq_len, hidden_size)")
print("  # h_n, c_n: final hidden and cell states")
print("  output, (h_n, c_n) = lstm(x)")
print()
print("  # GRU (simpler alternative):")
print("  gru = nn.GRU(input_size=50, hidden_size=256, batch_first=True)")
print("  output, h_n = gru(x)   # no separate cell state")`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of the full LSTM cell and sequence forward pass, plus a
                demo of the Constant Error Carousel comparing gradient magnitudes for LSTM
                (open forget gate), LSTM (closed forget gate, learned erasure), and a simple RNN.
            </p>
            <CodeBlock code={PY_CODE} filename="lstm_numpy.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>In production:</strong> <code>torch.nn.LSTM</code> implements the same equations
                with cuDNN acceleration, handling batches, variable-length sequences (via
                <code>pack_padded_sequence</code>), and multiple stacked layers. For many tasks,
                the simpler <code>torch.nn.GRU</code> matches LSTM performance with fewer parameters.
            </div>
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
