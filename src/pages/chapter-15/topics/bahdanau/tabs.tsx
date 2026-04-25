import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 14's Seq2Seq architecture demonstrated that neural networks could translate entire sentences — but it had a fundamental flaw. The encoder compressed every input sentence into a single fixed-size vector, regardless of length. A short sentence fit well; a 40-word sentence lost critical details in the compression. Dzmitry Bahdanau noticed this bottleneck in 2014 and proposed a solution: instead of a single compressed summary, let the decoder dynamically look back at all encoder states and choose what to focus on at each output step.
            </p>

            <h2>Breaking the information bottleneck</h2>
            <p>
                In 2014, the seq2seq model from Sutskever, Vinyals, and Le showed that two RNNs connected in series could translate sentences. But there was a problem baked into its design: the entire source sentence had to be compressed into a single fixed-dimensional vector — the last hidden state of the encoder — before the decoder could begin generating. For short sentences this worked. For long sentences it catastrophically failed. Bahdanau attention was the direct response.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2014</div>
                    <div className="ch-tl-section-label">The Problem</div>
                    <div className="ch-tl-title">Cho et al. — Encoder-Decoder for MT Reveals the Bottleneck</div>
                    <div className="ch-tl-body">
                        <p>
                            Kyunghyun Cho, Bart van Merriënboer, and Yoshua Bengio published the encoder-decoder architecture for neural machine translation in June 2014. The encoder RNN reads the source sentence and produces a context vector c — the final hidden state. The decoder RNN generates the translation conditioned on c. The model worked and was competitive with phrase-based SMT on some metrics — but the authors themselves noted in the paper that "performance of a fixed-length vector degrades rapidly as the length of an input sentence increases."
                        </p>
                        <p>
                            The paper included a key graph: BLEU score as a function of source sentence length. For sentences under 20 words, the encoder-decoder performed well. For sentences of 30–40 words, performance dropped sharply — the fixed-size context vector was not large enough to preserve all the information from a long sentence. This was not a minor limitation: real-world text contains many sentences longer than 20 words, and the bottleneck became severe exactly where translation is hardest.
                        </p>
                        <p>
                            The paper's authors were already working on the solution. Dzmitry Bahdanau had joined Cho's lab and immediately saw the bottleneck as the central problem to solve. The question was not whether to fix it but how: how do you give the decoder access to all encoder states without blowing up the computational complexity or breaking end-to-end differentiability?
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Established encoder-decoder for MT; immediately revealed the fixed-context bottleneck that Bahdanau would solve three months later</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">The Solution</div>
                    <div className="ch-tl-title">Bahdanau, Cho, Bengio — "Jointly Learning to Align and Translate"</div>
                    <div className="ch-tl-body">
                        <p>
                            Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio posted "Neural Machine Translation by Jointly Learning to Align and Translate" to arXiv in September 2014 (published at ICLR 2015). The core idea was radical in its simplicity: instead of compressing the source into one vector, let the decoder attend to all encoder hidden states at every decoding step, with learned weights that vary per step.
                        </p>
                        <p>
                            The mechanism works in three phases per decoder step. First, compute alignment scores e<sub>tj</sub> between the current decoder state s<sub>t-1</sub> and each encoder state h<sub>j</sub> using a small feedforward network (the "alignment model"). Second, normalize these scores with softmax to get attention weights α<sub>tj</sub> — a probability distribution over source positions. Third, compute the context vector c<sub>t</sub> as a weighted sum of all encoder states: c<sub>t</sub> = Σ<sub>j</sub> α<sub>tj</sub> h<sub>j</sub>. The decoder now uses this dynamic context vector instead of a fixed one.
                        </p>
                        <p>
                            The results on WMT14 English-to-French were striking. The attention model matched the vanilla seq2seq on short sentences and dramatically outperformed it on long sentences — the length degradation problem was largely solved. More importantly, the performance on long sentences continued to improve with model capacity, unlike the fixed-context model which hit a hard ceiling determined by the context vector dimensionality. The attention mechanism had removed a fundamental architectural constraint.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Removed the fixed-context constraint; BLEU improved especially on long sentences; introduced soft attention as the dominant paradigm</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Interpretability surprise</div>
                    <div className="ch-tl-title">Alignment Matrices — The Model Discovered Linguistics</div>
                    <div className="ch-tl-body">
                        <p>
                            One of the most striking results of the Bahdanau paper was the visualization of attention weight matrices. For each translated sentence, the paper plotted α<sub>tj</sub> as a grid — rows are target positions, columns are source positions, and cell brightness represents attention weight. For English-to-French translation, these matrices showed near-diagonal structure: when generating French word t, the model attended most strongly to English word t (or nearby words).
                        </p>
                        <p>
                            More remarkably, the off-diagonal patterns were linguistically meaningful. In English-to-French, adjective-noun order is often reversed ("the big house" → "la grande maison", but French uses "grande maison" literally "house big"). The attention matrices showed exactly this reversal: when generating "grande," the model attended to "big"; when generating "maison," it attended to "house." These alignments were learned without any alignment supervision — purely from translation pairs with no word-level labels.
                        </p>
                        <p>
                            The alignment matrices became the first interpretability tool in neural NLP. Researchers could look at them and see that the model had discovered which source words correspond to which target words — information that traditional statistical MT alignment models required thousands of lines of code and specialized EM algorithms to compute. The neural model discovered it as a side effect of learning to translate. This interpretability result influenced years of subsequent work on understanding neural networks via their attention patterns.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Attention weights became the first interpretability tool in neural NLP; alignment matrices showed linguistically meaningful structure learned without supervision</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Image captioning extension</div>
                    <div className="ch-tl-title">Xu et al. — "Show, Attend and Tell"</div>
                    <div className="ch-tl-body">
                        <p>
                            Kelvin Xu, Jimmy Ba, Ryan Kiros, Kyunghyun Cho, Aaron Courville, Ruslan Salakhutdinov, Richard Zemel, and Yoshua Bengio extended Bahdanau attention to image captioning (ICML 2015). The encoder was a CNN (VGG) producing a grid of feature vectors — one per spatial region of the image. The decoder was an LSTM that generated captions word by word while attending to different image regions via soft attention over the feature grid.
                        </p>
                        <p>
                            The paper demonstrated that the same attention mechanism that had worked for text could work for vision-language tasks. When the model generated the word "bird," it attended to the bird region of the image. When it generated "sky," it attended to the sky. The attention weights provided visualizable evidence that the model was looking at the right parts of the image for each generated word — a striking demonstration of the mechanism's generality.
                        </p>
                        <p>
                            "Show, Attend and Tell" also introduced the formal distinction between soft attention (differentiable weighted sum — the Bahdanau approach) and hard attention (discrete selection of one feature vector — trained with REINFORCE). This distinction would become foundational for subsequent work on attention mechanisms and is covered in depth in the Soft vs Hard Attention topic.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Extended attention to vision-language; formalized soft vs hard attention; showed attention mechanism generalized across modalities</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2017</div>
                    <div className="ch-tl-section-label">Proliferation</div>
                    <div className="ch-tl-title">Attention Everywhere — Reading, Speech, Q&amp;A</div>
                    <div className="ch-tl-body">
                        <p>
                            Within two years of the Bahdanau paper, attention appeared in every major NLP and speech task. Chan et al.'s Listen Attend Spell (2015) applied attention to speech recognition, attending over acoustic features while generating text. Hermann et al.'s "Teaching Machines to Read and Comprehend" (2015) used attention for reading comprehension — attending over a document to answer questions. Neural summarization models used attention to select important sentences. Every task with a variable-length input and variable-length output adopted attention as its connection mechanism.
                        </p>
                        <p>
                            Luong, Pham, and Manning (2015) systematically compared and refined attention mechanisms (covered in the Luong Attention topic), finding that simpler scoring functions (dot product, bilinear) often matched or exceeded the original additive scoring while being faster to compute. This simplification was essential for scaling attention to larger models and longer sequences.
                        </p>
                        <p>
                            Vaswani et al.'s 2017 "Attention Is All You Need" took the logical extreme: if attention is this powerful, why keep the RNN at all? They built a model from attention alone — the Transformer — eliminating recurrence entirely and replacing it with multi-head self-attention applied to the full sequence simultaneously. The Transformer achieved state-of-the-art MT with significantly faster training. Every modern LLM is built on this architecture. Bahdanau's 2014 mechanism is the direct ancestor of the attention that powers GPT-4.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Attention became the universal connection mechanism; direct ancestor of self-attention and the Transformer that underlies all modern LLMs</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why it mattered beyond MT:</strong> Bahdanau attention established that
                neural networks could learn <em>where to look</em> rather than being told where to
                look. The alignment is end-to-end differentiable — no hand-engineered rules, no
                separate alignment model, no supervision beyond translation pairs. This principle —
                differentiable selection over a set of representations — is the conceptual core of
                every Transformer, from BERT to GPT-4.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 14's Seq2Seq was remarkable — it could translate whole sentences for the first time. But it had one serious flaw: it had to cram the entire input into a single vector, like writing a whole chapter summary on a sticky note. Important words got lost. Bahdanau's attention mechanism (2014) gave the decoder a magnifying glass instead — it could focus on any word in the input, exactly when it needed to, without losing anything.
            </p>

            <h2>The translator who looks back</h2>

            <Analogy label="The Old Way — Memorize Everything">
                Imagine you're translating a long paragraph from French to English. But there's
                a strange rule: you must read the entire French text, close your eyes, and then
                translate from memory — without looking back.
                <br /><br />
                For a short sentence like "Le chat est rouge" ("The cat is red"), this works fine.
                But for a paragraph with 50 words? By the time you're translating the last sentence,
                you've forgotten the details from the first sentence. This is exactly the problem
                with the original seq2seq model — it squeezed the whole source into one memory slot.
            </Analogy>

            <Analogy label="The New Way — Look Back Freely">
                Now imagine a different rule: you can look back at the original French text as
                much as you want while translating. And here's the clever part — the model
                <em> learns which French words to look at</em> when generating each English word.
                <br /><br />
                When you're generating the word for "house," you look mostly at "maison."
                When you're generating the word for "red," you look mostly at "rouge." The model
                figures this out automatically, just by practicing on millions of translation pairs.
                No one told it which word to look at — it learned the alignment from data.
            </Analogy>

            <Analogy label="The Spotlight Analogy">
                Think of it like a spotlight in a theater. The old model had only one spotlight
                position it had to choose before the play started. Bahdanau attention lets the
                spotlight move at every moment of the performance, shining on different actors
                depending on what's happening right now.
                <br /><br />
                The model doesn't just pick <em>one</em> source word either — it spreads the
                spotlight over several, with different brightness levels. When generating a French
                verb that depends on both the subject and the tense marker, the spotlight shines
                on both, with brightness proportional to relevance. The context it uses at
                each step is a weighted blend of all the source words. The weights are what
                we call "attention weights."
            </Analogy>

            <Analogy label="The Bidirectional Reader">
                Bahdanau made the encoder bidirectional: it reads the source sentence left-to-right,
                then right-to-left, combining both directions. Why? Because the meaning of a word
                depends on both what comes before and after it.
                <br /><br />
                "I saw the man with the telescope" — does "with the telescope" modify "man" or "saw"?
                A left-to-right reader has to decide before it sees "telescope." A bidirectional
                reader sees both directions and can combine them. This richer representation of
                each word gives the attention mechanism better material to work with.
            </Analogy>

            <Analogy label="Reading the Alignment Matrix">
                One of the coolest things about Bahdanau attention: it produces interpretable output.
                After translating a sentence, you can draw a grid where rows are English words
                and columns are French words. Each cell shows how much attention the model paid
                to a French word when generating the corresponding English word.
                <br /><br />
                For simple pairs, the grid is almost diagonal — the first French word aligns to
                the first English word, the second to the second, and so on. When French and English
                reorder words (like adjective-noun order reversal), the grid shows exactly the
                off-diagonal pattern you'd expect. The model discovered word alignment — a task
                that statistical MT had to engineer specially — as a side effect of learning to translate.
            </Analogy>

            <Analogy label="From Attention to the Transformer">
                Bahdanau's attention gave the decoder a way to consult the encoder at each step.
                But the encoder and decoder were still recurrent networks — sequential, slow to train.
                What if you applied attention everywhere, including inside the encoder and decoder,
                replacing the recurrence entirely?
                <br /><br />
                That's exactly what Vaswani et al. did in 2017 with the Transformer: "Attention is
                All You Need." The Transformer is built entirely from attention layers, with no RNNs.
                It can process the entire sequence in parallel, trains much faster, and scales far
                better. Every modern LLM — GPT-4, Claude, Gemini — is a Transformer. Bahdanau's
                2014 insight is the direct ancestor of all of them.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Alignment scores, context vectors, and the decoder</h2>

            <h3>Setup — Bidirectional Encoder</h3>
            <p>
                Bahdanau used a bidirectional RNN encoder. For each source position j, two hidden
                states are computed — a forward pass reading left to right and a backward pass
                reading right to left. These are concatenated to give a richer representation of
                each position:
            </p>
            <MathBlock tex="h_j = \left[\overrightarrow{h}_j;\; \overleftarrow{h}_j\right] \in \mathbb{R}^{2n}" />
            <p>
                This gives each position context from both its left and right neighbors. A word
                like "bank" has very different meaning depending on whether "river" comes before or
                after it — the bidirectional encoder can represent this difference in h<sub>j</sub>.
            </p>

            <h3>Step 1 — Alignment Scores</h3>
            <p>
                For decoding step t, compute an alignment score e<sub>tj</sub> for each source
                position j. This score measures how well the decoder's current state
                s<sub>t-1</sub> "matches" the encoder state h<sub>j</sub>:
            </p>
            <MathBlock tex="e_{tj} = \mathbf{v}_a^\top \tanh\!\left(\mathbf{W}_a\, \mathbf{s}_{t-1} + \mathbf{U}_a\, \mathbf{h}_j\right)" />
            <p>
                W<sub>a</sub>, U<sub>a</sub>, and v<sub>a</sub> are learned weight matrices. The
                tanh maps to (-1, 1) and the dot with v<sub>a</sub> collapses to a scalar score.
                This is called <em>additive attention</em> or an <em>alignment model</em>. Note
                that U<sub>a</sub>h<sub>j</sub> can be precomputed once for all decoder steps —
                only W<sub>a</sub>s<sub>t-1</sub> changes per decoder step.
            </p>

            <h3>Step 2 — Attention Weights</h3>
            <p>
                Normalize the scores over all source positions using softmax to get
                attention weights α<sub>tj</sub>:
            </p>
            <MathBlock tex="\alpha_{tj} = \frac{\exp(e_{tj})}{\sum_{k=1}^{T_x} \exp(e_{tk})}" />
            <p>
                The α<sub>tj</sub> sum to 1 across j — they form a probability distribution
                over source positions representing "how much to attend to each source word"
                when generating target word t.
            </p>

            <h3>Step 3 — Context Vector</h3>
            <p>
                Compute the context vector c<sub>t</sub> as a weighted sum of encoder states.
                This is the key departure from vanilla seq2seq: c<sub>t</sub> is different at
                every decoder step, adapting to what the decoder needs at that moment:
            </p>
            <MathBlock tex="\mathbf{c}_t = \sum_{j=1}^{T_x} \alpha_{tj}\, \mathbf{h}_j" />

            <h3>Step 4 — Decoder Update</h3>
            <p>
                The decoder GRU produces its new hidden state using the previous state,
                previous output, and the dynamic context vector:
            </p>
            <MathBlock tex="\mathbf{s}_t = f\!\left(\mathbf{s}_{t-1},\; y_{t-1},\; \mathbf{c}_t\right)" />
            <p>
                The output distribution is then: P(y<sub>t</sub>) = softmax(W<sub>o</sub>[s<sub>t</sub>; c<sub>t</sub>; Ey<sub>t-1</sub>])
                where E is the target-word embedding matrix.
            </p>

            <h3>Computational Cost</h3>
            <p>
                The attention mechanism adds O(T<sub>x</sub>) computation per decoder step —
                one alignment score per source position. For a sentence pair of lengths T<sub>x</sub>
                and T<sub>y</sub>, the total attention cost is O(T<sub>x</sub> · T<sub>y</sub>).
                This is the quadratic complexity that the Transformer inherits and that motivates
                sparse attention variants for long documents.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key difference from standard seq2seq:</strong> In vanilla seq2seq, the
                context vector c is constant — the final encoder state used for all decoder steps.
                In Bahdanau attention, c<sub>t</sub> is recomputed at every step, attending
                to the full encoder output sequence. This adds O(T<sub>x</sub>) computation
                per decoder step but completely solves the long-sentence bottleneck and makes
                the model's alignment decisions interpretable.
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
            <h2>Full derivation and gradient analysis</h2>

            <DefBlock label="Bahdanau Attention — Formal Specification">
                Source sequence: x = (x<sub>1</sub>, …, x<sub>Tx</sub>).
                Encoder hidden states: H = (h<sub>1</sub>, …, h<sub>Tx</sub>), each h<sub>j</sub> ∈ ℝ<sup>2n</sup> (bidirectional).
                Decoder state at step t: s<sub>t</sub> ∈ ℝ<sup>n</sup>.
                Attention parameters: W<sub>a</sub> ∈ ℝ<sup>d×n</sup>, U<sub>a</sub> ∈ ℝ<sup>d×2n</sup>, v<sub>a</sub> ∈ ℝ<sup>d</sup>.
                d is the attention dimensionality (hyperparameter, typically n or n/2).
            </DefBlock>

            <h3>Scoring Function (Additive / MLP)</h3>
            <MathBlock tex="e_{tj} = \mathbf{v}_a^\top \tanh\!\bigl(\mathbf{W}_a \mathbf{s}_{t-1} + \mathbf{U}_a \mathbf{h}_j\bigr)" />
            <p>
                Note: W<sub>a</sub>s<sub>t-1</sub> does not depend on j, so it can be precomputed
                once per decoder step. The U<sub>a</sub>H product is precomputed over all positions
                once before decoding begins — reducing computation from O(T<sub>x</sub> · n · d)
                per step to O(d) per (step, position) pair.
            </p>

            <h3>Attention Weights and Context</h3>
            <MathBlock tex="\boldsymbol{\alpha}_t = \text{softmax}(\mathbf{e}_t) \in \Delta^{T_x - 1}" />
            <MathBlock tex="\mathbf{c}_t = \mathbf{H}\boldsymbol{\alpha}_t = \sum_{j=1}^{T_x} \alpha_{tj}\, \mathbf{h}_j" />

            <h3>Gradient Through Attention</h3>
            <p>
                The entire attention mechanism is differentiable. Backprop through c<sub>t</sub>
                gives each encoder state h<sub>j</sub> a gradient contribution at every decoder step,
                weighted by the attention it received:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{h}_j} = \sum_{t} \frac{\partial \mathcal{L}}{\partial \mathbf{c}_t} \cdot \alpha_{tj}" />
            <p>
                Positions that received high attention get larger gradient signals — the encoder
                is incentivized to put relevant information in positions the decoder can easily
                attend to. This joint learning of alignment and translation gives the mechanism
                its name.
            </p>

            <h3>Gradient w.r.t. Attention Parameters</h3>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{v}_a} = \sum_t \sum_j \frac{\partial \mathcal{L}}{\partial e_{tj}} \tanh\!\bigl(\mathbf{W}_a \mathbf{s}_{t-1} + \mathbf{U}_a \mathbf{h}_j\bigr)" />

            <div className="ch-callout">
                <strong>Why additive attention has O(d) parameters vs O(d²) for bilinear:</strong>
                The additive formulation projects s and h into a shared d-dimensional space via two
                separate matrices, then combines them with a scalar projection. The bilinear form
                s<sup>T</sup>Wh requires a full d<sub>s</sub> × d<sub>h</sub> matrix W. For
                d<sub>s</sub> = d<sub>h</sub> = 512, that's 262K parameters vs 2 × 512 × d for
                additive. Additive is more parameter-efficient at the cost of an extra nonlinearity.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Utilities ─────────────────────────────────────────────────────────────────
def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()

# ── Bahdanau Attention ────────────────────────────────────────────────────────
class BahdanauAttention:
    """Additive (MLP) attention: score(s, h) = v^T tanh(W s + U h)"""
    def __init__(self, enc_dim, dec_dim, attn_dim, seed=42):
        rng = np.random.default_rng(seed)
        self.W_a = rng.normal(0, 0.1, (attn_dim, dec_dim))   # (d, dec_dim)
        self.U_a = rng.normal(0, 0.1, (attn_dim, enc_dim))   # (d, enc_dim)
        self.v_a = rng.normal(0, 0.1, attn_dim)              # (d,)
        # Precompute U_a @ H after encoder finishes (H shape: T_enc x enc_dim)
        self._UH_cache = None

    def precompute(self, H):
        """Cache U_a H -- only depends on encoder output, not decoder state."""
        self._UH_cache = H @ self.U_a.T   # (T_enc, d)

    def score(self, s_prev):
        """Compute all alignment scores for one decoder step.
        s_prev: (dec_dim,)  ->  returns energies: (T_enc,)
        """
        Ws = self.W_a @ s_prev                           # (d,)
        combined = np.tanh(self._UH_cache + Ws)          # (T_enc, d)  broadcast
        return combined @ self.v_a                       # (T_enc,)

    def forward(self, s_prev, H):
        """Full attention step.
        Returns: context (enc_dim,), alphas (T_enc,)
        """
        if self._UH_cache is None or self._UH_cache.shape[0] != H.shape[0]:
            self.precompute(H)
        energies = self.score(s_prev)    # (T_enc,)
        alphas   = softmax(energies)     # (T_enc,)
        context  = alphas @ H            # (enc_dim,)
        return context, alphas


# ── Demo ──────────────────────────────────────────────────────────────────────
T_enc, enc_dim, dec_dim, attn_dim = 6, 8, 8, 4
rng = np.random.default_rng(0)

# Encoder hidden states (bidirectional RNN: enc_dim = 2 * hidden)
H      = rng.normal(0, 0.5, (T_enc, enc_dim))
s_prev = rng.normal(0, 0.5, dec_dim)

attn = BahdanauAttention(enc_dim, dec_dim, attn_dim)
context, alphas = attn.forward(s_prev, H)

print("Bahdanau Attention Demo")
print("=" * 50)
print(f"Source length : {T_enc}  Enc dim: {enc_dim}  Attn dim: {attn_dim}")
print()
print("Alignment weights alpha (should sum to 1):")
for j, a in enumerate(alphas):
    bar = "X" * int(a * 40)
    print(f"  pos {j}: {a:.4f}  {bar}")
print(f"  sum  : {alphas.sum():.6f}")
print()
print(f"Context vector  : {context.round(4)}")
print(f"Context norm    : {np.linalg.norm(context):.4f}")
print()

# ── Simulate 3 decoder steps to show context adapts ─────────────────────────
print("Context vectors across decoder steps:")
print("-" * 50)
for step in range(3):
    s = rng.normal(0, 0.5, dec_dim)
    ctx, alp = attn.forward(s, H)
    top_pos = alp.argmax()
    print(f"  step {step}: peak attention at pos {top_pos}"
          f"  (alpha={alp[top_pos]:.3f})  ||c|| = {np.linalg.norm(ctx):.3f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of Bahdanau additive attention with precomputed
                encoder projections. The demo runs a single attention step and then simulates
                three decoder steps to show how context adapts across steps.
            </p>
            <CodeBlock code={PY_CODE} filename="bahdanau_attention.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const BAHDANAU_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
