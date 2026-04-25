import { Analogy, CodeBlock, DefBlock, MathBlock, InlineMath } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Chapter 13 solved the word representation problem: embeddings gave words meaningful numeric addresses in a shared geometric space, and language modeling gave researchers a way to measure how well a model understood sequential text. But embeddings represent individual words, not sequences. Translating "The cat sat on the mat" into French requires encoding the meaning of the entire sentence — not each word in isolation. Sutskever, Vinyals, and Le's 2014 paper "Sequence to Sequence Learning with Neural Networks" answered this challenge with the encoder-decoder architecture.
            </p>

            <h2>The architecture that taught machines to translate</h2>
            <p>
                Sequence-to-sequence learning emerged from two concurrent research threads in 2014 — one at Google Brain, one at Yoshua Bengio's lab in Montreal — and immediately reshaped how the field thought about language, speech, and structured prediction. The unifying insight was simple but powerful: you can compress any variable-length sequence into a fixed-size vector, then expand that vector into a different variable-length sequence.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Precursor</div>
                    <div className="ch-tl-title">Kalchbrenner &amp; Blunsom — Recurrent Continuous Translation Models</div>
                    <div className="ch-tl-body">
                        <p>
                            The story of seq2seq begins a year before the landmark papers, in a quieter contribution from Nal Kalchbrenner and Phil Blunsom at Oxford. Their 2013 EMNLP paper "Recurrent Continuous Translation Models" proposed a fully neural architecture for machine translation — one that encoded a source sentence into a sequence of vectors and decoded them into a target sequence. The model used a convolutional encoder over the source and a recurrent decoder over the target.
                        </p>
                        <p>
                            The proposal was visionary but the empirical results were modest — the system needed to be integrated with phrase-based SMT components to be competitive, and training was unstable. What it established was the conceptual template: two neural networks working in series, the first reading, the second writing. This template would be refined and weaponized the following year.
                        </p>
                        <p>
                            The paper showed that a continuous representation of the full source sentence could be learned from data alone — no alignment models, no phrase tables, no hand-crafted features. This directness was radical at the time and planted a seed that Cho and Sutskever would grow into a revolution twelve months later.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Established the conceptual template of encode-then-decode for MT</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2014</div>
                    <div className="ch-tl-section-label">First paper</div>
                    <div className="ch-tl-title">Cho et al. — RNN Encoder-Decoder (GRU-based)</div>
                    <div className="ch-tl-body">
                        <p>
                            Kyunghyun Cho, Bart van Merriënboer, Caglar Gulcehre, Dzmitry Bahdanau, Fethi Bougares, Holger Schwenk, and Yoshua Bengio published "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation" at EMNLP 2014. The paper's stated goal was not to replace phrase-based SMT but to help it — to learn better phrase representations that SMT's re-ranking step could exploit.
                        </p>
                        <p>
                            In pursuing this goal, the Montreal group defined the encoder-decoder architecture formally for the first time. The encoder reads the source sequence and compresses it into a fixed-size vector c; the decoder takes c and generates the target sequence one token at a time, each step conditioned on both c and the previously generated token. Crucially, they also introduced a new recurrent cell to implement this architecture: the Gated Recurrent Unit (GRU), a simplified alternative to LSTM with two gates instead of four.
                        </p>
                        <p>
                            The results were striking even for this auxiliary role. The encoder-decoder phrase representations boosted the SMT system's BLEU score by several points on English-French translation. The architecture itself had demonstrated a key capability: a recurrent network could learn to compress arbitrary-length phrase representations into fixed vectors while retaining enough information for meaningful downstream use. This was a proof of concept that Sutskever would dramatically extend three months later.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Coined "encoder-decoder"; introduced GRU; first quantitative results for neural phrase compression</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">Landmark result</div>
                    <div className="ch-tl-title">Sutskever, Vinyals &amp; Le — Seq2Seq with deep LSTM</div>
                    <div className="ch-tl-body">
                        <p>
                            Three months after Cho's paper, Ilya Sutskever, Oriol Vinyals, and Quoc V. Le at Google Brain posted "Sequence to Sequence Learning with Neural Networks" to arXiv (published at NeurIPS 2014). Unlike Cho's system — which was designed to assist phrase-based SMT — this paper built a fully standalone neural MT system and benchmarked it directly against phrase-based SMT on the WMT14 English-to-French task.
                        </p>
                        <p>
                            The technical differences from Cho's architecture were deliberate and important. First, they used a 4-layer stacked LSTM rather than a shallow GRU encoder-decoder — depth that the Montreal group had not tried at scale. Second, they discovered that reversing the source sentence (feeding it last-word-first into the encoder) improved BLEU by more than 5 points. The intuition: after reversing, the first source word is the last to be encoded, leaving it fresh in the hidden state when the decoder begins — minimizing the "minimum time lag" between corresponding source and target words. Third, they passed both the LSTM hidden state and cell state to initialize the decoder, preserving the full LSTM memory rather than just the output.
                        </p>
                        <p>
                            A 5-model ensemble achieved 34.8 BLEU on WMT14 En-Fr — directly competitive with heavily tuned phrase-based SMT systems that had a decade of engineering behind them. The result stunned the field. Here was a system with no alignment model, no phrase table, no linguistic rules, no hand-crafted features — just parallel text, gradient descent, and a 4-layer LSTM — matching the best statistical systems of the era. The deep learning era of machine translation had begun.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: First pure neural MT competitive with phrase-based SMT at WMT scale; defined the standard seq2seq architecture</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">The bottleneck solved</div>
                    <div className="ch-tl-title">Bahdanau, Cho &amp; Bengio — Attention mechanism</div>
                    <div className="ch-tl-body">
                        <p>
                            Even as Sutskever's results were celebrated, the Montreal group had already identified seq2seq's core weakness: the fixed context vector. Cho et al. noted in their June 2014 paper that model performance degraded sharply for sentences longer than about 20 words. The problem was fundamental — compressing 50 words of meaning into a 1000-dimensional vector is lossy, and the longer the sentence the worse the loss.
                        </p>
                        <p>
                            Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio responded with "Neural Machine Translation by Jointly Learning to Align and Translate," posted to arXiv in September 2014 and published at ICLR 2015. Instead of one fixed context vector, they proposed computing a different context vector at each decoding step — a weighted sum of all encoder hidden states, where the weights were computed by a learned alignment model. The decoder could now "attend" to any part of the source at any decoding step.
                        </p>
                        <p>
                            The results on long sentences were dramatic: whereas the vanilla seq2seq BLEU score dropped steeply as sentence length increased beyond 20 words, the attention model maintained high performance across all lengths. More surprisingly, the attention weight matrices were interpretable — visualizing them revealed near-diagonal structure for language pairs with similar word order, and off-diagonal patterns exactly where the two languages reordered words. The model had learned linguistically meaningful alignments without any alignment supervision. This became the direct ancestor of the Transformer architecture.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Solved the fixed-context bottleneck; seq2seq + attention became the dominant MT paradigm 2015–2017</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Production deployment</div>
                    <div className="ch-tl-title">Google Neural Machine Translation (GNMT)</div>
                    <div className="ch-tl-body">
                        <p>
                            Google deployed GNMT across its production translation systems, replacing the phrase-based SMT pipeline that had served billions of users for nearly a decade. The Wu et al. 2016 paper "Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation" described the architecture: an 8-layer LSTM encoder and 8-layer LSTM decoder with attention, residual connections between LSTM layers to enable stable training at that depth, and a hybrid word/wordpiece vocabulary to handle rare words and morphology.
                        </p>
                        <p>
                            The scale was unprecedented for a neural system: trained on hundreds of millions of sentence pairs, evaluated on dozens of language pairs, and serving over a hundred billion words of translation per day. For Chinese-to-English translation, GNMT reduced translation errors by more than 60% compared to the phrase-based baseline in side-by-side human evaluations — effectively bridging most of the gap between machine and professional human translation for everyday text.
                        </p>
                        <p>
                            The deployment of GNMT marked the practical end of phrase-based SMT as a research and industrial priority. Within a year, every major MT vendor had switched to neural architectures. The academic MT community pivoted almost entirely to neural methods. What had taken decades to engineer in the statistical paradigm was surpassed in two years by end-to-end neural learning.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Marked the practical end of phrase-based SMT at industrial scale; validated the seq2seq paradigm for production use</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Further innovations</div>
                    <div className="ch-tl-title">ConvSeq2Seq — Gehring et al.</div>
                    <div className="ch-tl-body">
                        <p>
                            Even as attention-based LSTM seq2seq models dominated production MT, researchers at Facebook AI Research explored a radically different backbone: convolutional networks instead of recurrences. Gehring et al.'s 2017 "Convolutional Sequence to Sequence Learning" replaced both encoder and decoder LSTMs with stacked convolutional layers, each operating over a fixed window of tokens. Multi-step attention was used to connect encoder and decoder.
                        </p>
                        <p>
                            The convolutional approach offered a key practical advantage: parallelism. Recurrent networks process one token at a time, making training inherently sequential. Convolutional layers over sequences can be fully parallelized across positions, yielding 9× faster training compared to LSTM seq2seq on standard MT benchmarks while matching or exceeding BLEU scores. The work foreshadowed the Transformer's insight that recurrence is not essential — position-parallel operations over the full sequence are both faster and empirically effective.
                        </p>
                        <p>
                            ConvSeq2Seq remained competitive for about a year before the Transformer (Vaswani et al., 2017) demonstrated that attention alone — without convolutions or recurrence — was sufficient to surpass all previous architectures. But it established the template for non-recurrent seq2seq and validated the argument that the field's reliance on RNNs was historical rather than principled.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated 9× training speedup over LSTM seq2seq; helped motivate the Transformer's elimination of recurrence</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – present</div>
                    <div className="ch-tl-section-label">Modern era</div>
                    <div className="ch-tl-title">Transformer Seq2Seq — Attention Is All You Need</div>
                    <div className="ch-tl-body">
                        <p>
                            Vaswani et al.'s 2017 "Attention Is All You Need" replaced both RNNs and convolutions with pure self-attention layers. The Transformer encoder-decoder is still a seq2seq architecture in the same sense as Sutskever's LSTM system — it reads a source sequence and produces a target sequence — but the internal mechanism is entirely different: multi-head self-attention layers replace recurrent cells, positional encodings replace sequential order, and the full source and target can be processed in parallel during training.
                        </p>
                        <p>
                            The Transformer achieved state-of-the-art BLEU on WMT14 English-German and English-French, training in a fraction of the time required by LSTM seq2seq. More importantly, it scaled far more easily to larger datasets and models. The architecture became the foundation for every major language model that followed: BERT, GPT-2, GPT-3, T5, mT5, BART, and ultimately the GPT-4 class of models used today.
                        </p>
                        <p>
                            Seq2seq as a concept — encode then decode — survived the transition from LSTM to Transformer intact. What changed was the mechanism of encoding and decoding. The fixed context vector of vanilla seq2seq became the dynamic attention of Bahdanau, which became the self-attention of the Transformer, which scaled to produce systems like GPT-4 capable of translation, summarization, code generation, and reasoning across hundreds of languages and domains simultaneously.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Replaced recurrent seq2seq with attention-only architecture; became the foundation of all modern LLMs</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The context vector bottleneck</strong> — the core limitation of vanilla seq2seq — is what motivates attention (Ch. 15) and ultimately the Transformer (Ch. 16). Understanding seq2seq as a constrained architecture helps explain why attention was such a decisive improvement: instead of forcing the decoder to recover everything from one fixed vector, attention lets the decoder dynamically consult any encoder state, turning a lossy compression problem into a flexible memory lookup.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                Chapter 13 gave every word its own address in math space — Word2Vec, GloVe, FastText. But sentences are more than bags of words: they have order, grammar, and meaning that flows from start to finish. Chapter 14 shows how Sutskever's Seq2Seq architecture taught networks to translate whole sentences by compressing their meaning into a single vector, then expanding it back out in another language.
            </p>

            <h2>The listening-then-speaking machine</h2>

            <Analogy label="The Conference Interpreter">
                Imagine a conference interpreter who translates speeches. A bad interpreter tries to
                translate every word as it's spoken — they get confused when the sentence structure
                differs between languages (which it always does). A good interpreter <em>listens to
                the whole sentence</em>, builds a mental understanding, then speaks the translation.
                <br /><br />
                The seq2seq model is the good interpreter. The <strong>encoder</strong> listens to
                the whole input sentence. The <strong>decoder</strong> uses the understanding to
                produce the output. The two phases — encode first, decode second — are what makes
                variable-length-to-variable-length translation possible.
            </Analogy>

            <Analogy label="The Compressed Notes">
                When you study for an exam, you don't memorise your textbook word for word.
                You write a page of compressed notes that captures the key ideas. The notes are
                much shorter than the textbook, but contain enough information to write a full essay.
                <br /><br />
                The context vector is those compressed notes. The encoder reads the input
                sequence and writes compressed notes (a vector of floating-point numbers). The
                decoder reads only those notes — not the original input — and produces the output.
                The question seq2seq asks: <em>can a neural network learn to take useful notes?</em> Yes.
            </Analogy>

            <Analogy label="The Bottleneck Problem">
                Here's the catch: the notes have a fixed size. Whether the input is 3 words
                or 300 words, the context vector always has, say, 512 numbers. For short sentences,
                that's plenty. For very long paragraphs, you start to lose information.
                <br /><br />
                That's the bottleneck problem. It's the reason attention (Ch. 15) was invented:
                instead of squeezing everything into one fixed notecard, attention lets the decoder
                go back and read specific parts of the original text whenever it needs them.
            </Analogy>

            <Analogy label="Special Tokens — Start and Stop Signals">
                How does the decoder know when to start and stop? Special tokens! Before generating
                the translation, the decoder receives a &lt;SOS&gt; (start-of-sequence) token —
                like a whistle at the start of a race. When it decides the translation is complete,
                it outputs &lt;EOS&gt; (end-of-sequence) — the finish line ribbon.
                <br /><br />
                Without these signals, the decoder wouldn't know whether to start writing or stop.
                The &lt;PAD&gt; token is used to fill batches to the same length during training,
                and &lt;UNK&gt; replaces words that never appeared in the training vocabulary.
                Four simple tokens that hold the whole system together.
            </Analogy>

            <Analogy label="Why Variable Length Works">
                The beautiful thing about seq2seq is that the input and output don't have to be
                the same length. "I go" (2 English words) translates to "Je vais" (2 French words),
                but "I am going to the store" (6 words) might translate to 7 French words or 5.
                <br /><br />
                Seq2seq handles this naturally: the encoder always produces one fixed-size vector
                regardless of input length, and the decoder runs until it generates &lt;EOS&gt;
                regardless of how many words that takes. The architecture doesn't care if input
                and output lengths are different — they almost always are.
            </Analogy>

            <Analogy label="Autoregressive Generation — One Word at a Time">
                The decoder generates its translation one word at a time, and each new word
                depends on all the words it has already written. This is called autoregressive
                generation. It's like a writer who can't delete what they've already written —
                every new word must follow naturally from all previous words.
                <br /><br />
                This dependency chain means that one wrong word early in the translation
                can push all subsequent words in the wrong direction. Managing this cascading
                error problem is one of the central challenges of training seq2seq models,
                and teacher forcing (another topic in this chapter) is the main solution.
            </Analogy>

            <Analogy label="The Reversed Source Trick">
                Sutskever discovered something surprising: feeding the source sentence
                <em> backwards</em> — last word first — made translations much better. Why?
                Think about how translation often works: the first word of the source often
                corresponds to the first word of the target. If you feed the source forward,
                the memory of the first source word gets overwritten many times before the
                decoder sees it. Feed it backwards, and the first source word is the last
                thing the encoder sees — its memory is still fresh when decoding starts.
                One clever trick, 5+ BLEU points gained.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Two-phase architecture: encoding and decoding</h2>

            <h3>Phase 1 — The Encoder</h3>
            <p>
                The encoder is a recurrent network (usually LSTM or GRU) that reads the input
                sequence x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>T</sub> one token at a time.
                At each step it updates a hidden state. After reading all tokens, the final
                hidden state h<sub>T</sub> becomes the <strong>context vector c</strong> — a
                fixed-size summary of the entire input sequence that the decoder will use.
            </p>
            <MathBlock tex="h_t = f(h_{t-1},\, x_t), \qquad c = h_T" />

            <h3>Phase 2 — The Decoder</h3>
            <p>
                The decoder is also a recurrent network, initialized with the context vector.
                It generates one output token per step, and its own output feeds back as input
                at the next step. This is autoregressive generation:
            </p>
            <MathBlock tex="s_t = g(s_{t-1},\, y_{t-1},\, c), \qquad \hat{y}_t = \operatorname{softmax}(\mathbf{W}_s\, s_t + \mathbf{b}_s)" />
            <p>
                The decoder starts with the special &lt;SOS&gt; token and stops when it predicts &lt;EOS&gt;.
                Both the encoder and decoder are trained jointly — the gradients from the decoder's
                cross-entropy loss flow back through the context vector into the encoder weights.
            </p>

            <h3>Special Tokens and Vocabulary</h3>
            <ul>
                <li><code>&lt;SOS&gt;</code> — start-of-sequence, fed as the first decoder input to trigger generation</li>
                <li><code>&lt;EOS&gt;</code> — end-of-sequence, model predicts this when done; generation stops</li>
                <li><code>&lt;PAD&gt;</code> — padding token fills batches to uniform length during training</li>
                <li><code>&lt;UNK&gt;</code> — replaces out-of-vocabulary words at training and inference time</li>
            </ul>

            <h3>Why Variable-Length I/O Works</h3>
            <p>
                The encoder always produces the same-size context vector regardless of input length.
                The decoder always starts fresh from that vector and runs until it outputs &lt;EOS&gt;.
                This makes it natural for T &#8800; T' — a 10-word English sentence can become an 8-word
                French sentence, and the model handles it without any special engineering. The model
                must learn to compress varying amounts of information into a fixed-size vector, which
                is exactly the learning challenge.
            </p>

            <h3>The Source Reversal Trick</h3>
            <p>
                Sutskever et al. found that reversing the source sequence (feeding it last-word-first)
                improved BLEU by over 5 points on WMT14 English-French. The explanation: in many
                language pairs, early source words align to early target words. In a forward encoder,
                the first source word must survive T − 1 RNN steps before the decoder starts. In a
                reversed encoder, the first source word is encoded last and its information is "fresh"
                in the hidden state when the decoder generates the first target word. This reduces
                the average lag between corresponding source and target positions.
            </p>

            <h3>Multi-Layer Stacking for Depth</h3>
            <p>
                The Sutskever et al. paper used 4 LSTM layers, each receiving the hidden state
                of the layer below as its input. Depth allows lower layers to capture local
                surface patterns while higher layers build abstract semantic representations.
                Google's production GNMT system extended this to 8 layers with residual connections
                to stabilize training — borrowing the technique from ResNets (Ch. 8).
            </p>
            <MathBlock tex="h_t^{(l)},\; c_t^{(l)} = \text{LSTM}^{(l)}\!\left(h_t^{(l-1)},\; h_{t-1}^{(l)},\; c_{t-1}^{(l)}\right)" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Autoregressive decoding:</strong> the decoder's output at step t (&#375;<sub>t</sub>)
                feeds back as its input at step t+1. This creates a dependency chain — each word
                depends on all previously generated words. During training this is managed with
                teacher forcing (see the Teacher Forcing topic). During inference the model is
                fully autoregressive. One consequence: decoding cannot be fully parallelized —
                each token must wait for the previous one, unlike the Transformer's parallel training.
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
            <h2>Formal definition of sequence-to-sequence learning</h2>

            <DefBlock label="Seq2Seq Probabilistic Model">
                Given a source sequence x = (x<sub>1</sub>, ..., x<sub>T</sub>) and target
                sequence y = (y<sub>1</sub>, ..., y<sub>T'</sub>), the model estimates the
                conditional probability by factoring it auto-regressively:
                P(y | x) = &#8719;<sub>t=1</sub><sup>T'</sup> P(y<sub>t</sub> | y<sub>1</sub>, ..., y<sub>t-1</sub>, c)
                where c is the context vector produced by the encoder.
            </DefBlock>

            <h3>Encoder</h3>
            <MathBlock tex="h_t = f(h_{t-1},\, x_t), \quad c = h_T" />
            <p>
                The function f is an RNN cell (LSTM or GRU). The context vector c is the final
                hidden state. For an LSTM, c = (h<sub>T</sub>, cell<sub>T</sub>) — both the
                hidden state and the cell state are passed to the decoder, preserving the full
                long-range memory that the LSTM accumulated while reading the source.
            </p>

            <h3>Decoder</h3>
            <MathBlock tex="s_t = g(s_{t-1},\, y_{t-1},\, c), \quad P(y_t \mid y_{<t},\, c) = \operatorname{softmax}(W_s\, s_t + b_s)" />
            <p>
                The decoder recurrence g takes the previous hidden state, the previous output token,
                and the context vector. In the original Sutskever formulation, c is used only to
                initialize the decoder state. In Cho's formulation, c is concatenated to the decoder
                input at every step — a subtle but important difference.
            </p>

            <h3>Training Objective</h3>
            <MathBlock tex="\mathcal{L} = -\sum_{t=1}^{T'} \log P(y_t \mid y_1,\dots,y_{t-1},\, c)" />
            <p>
                This is the standard cross-entropy loss, summed over all target tokens in the sequence.
                During training, <InlineMath tex="y_{t-1}" /> is the true target token (teacher forcing),
                not the model's prediction. The gradients flow from the decoder loss, through the
                context vector, and back into both encoder and decoder parameters.
            </p>

            <h3>The Information Bottleneck</h3>
            <p>
                The mutual information between the source x and the context vector c is bounded
                by the dimensionality of c. Formally, the encoder must solve a lossy compression
                problem: map T tokens to a fixed-size vector that preserves enough information for
                the decoder to reconstruct T' tokens. The capacity of a d-dimensional real-valued
                vector is unbounded in theory but finite in practice for gradient-trained networks.
                For long sequences, this compression is lossy — which is why attention (Ch. 15)
                replaces the fixed context vector with a dynamic weighted combination of all encoder states.
            </p>
            <MathBlock tex="I(x;\, c) \leq H(c) \leq d \log(1 + \text{SNR})" />

            <h3>Beam Search Decoding</h3>
            <MathBlock tex="\hat{y} = \arg\max_y \log P(y \mid x) = \arg\max_y \sum_{t=1}^{T'} \log P(y_t \mid y_{<t},\, c)" />
            <p>
                Greedy decoding picks the highest-probability token at each step but is suboptimal.
                Beam search maintains the top-k partial sequences ("beams") at each step, expanding
                all k beams by each vocabulary token and keeping only the top-k by cumulative
                log-probability. Beam size k = 4–10 gives the best quality-speed tradeoff.
            </p>

            <div className="ch-callout">
                <strong>Connection to variational autoencoders:</strong> The encoder-decoder structure
                directly inspired VAEs (Kingma &amp; Welling, 2013), where a probabilistic encoder maps
                inputs to a latent distribution rather than a deterministic vector. The seq2seq
                context vector is a deterministic latent code — the VAE generalization makes it
                stochastic and adds a KL regularizer to keep the latent space well-structured.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import random

# ── Encoder ───────────────────────────────────────────────────────────────────

class Encoder(nn.Module):
    def __init__(self, input_dim, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(input_dim, emb_dim)
        self.rnn = nn.LSTM(emb_dim, hidden_dim, n_layers, dropout=dropout)
        self.dropout = nn.Dropout(dropout)

    def forward(self, src):
        # src: [src_len, batch_size]
        embedded = self.dropout(self.embedding(src))
        # embedded: [src_len, batch_size, emb_dim]
        outputs, (hidden, cell) = self.rnn(embedded)
        # hidden, cell: [n_layers, batch_size, hidden_dim]
        return hidden, cell  # context = final (hidden, cell)

# ── Decoder ───────────────────────────────────────────────────────────────────

class Decoder(nn.Module):
    def __init__(self, output_dim, emb_dim, hidden_dim, n_layers, dropout=0.5):
        super().__init__()
        self.output_dim = output_dim
        self.embedding = nn.Embedding(output_dim, emb_dim)
        self.rnn = nn.LSTM(emb_dim, hidden_dim, n_layers, dropout=dropout)
        self.fc_out = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, token, hidden, cell):
        # token: [batch_size]  — one token at a time
        token = token.unsqueeze(0)           # [1, batch_size]
        embedded = self.dropout(self.embedding(token))
        output, (hidden, cell) = self.rnn(embedded, (hidden, cell))
        pred = self.fc_out(output.squeeze(0))  # [batch_size, output_dim]
        return pred, hidden, cell

# ── Seq2Seq ───────────────────────────────────────────────────────────────────

class Seq2Seq(nn.Module):
    def __init__(self, encoder, decoder, sos_idx, device):
        super().__init__()
        self.encoder = encoder
        self.decoder = decoder
        self.sos_idx = sos_idx
        self.device  = device

    def forward(self, src, trg, teacher_forcing_ratio=0.5):
        # src: [src_len, batch]  trg: [trg_len, batch]
        trg_len, batch_size = trg.shape
        trg_vocab = self.decoder.output_dim

        outputs = torch.zeros(trg_len, batch_size, trg_vocab, device=self.device)
        hidden, cell = self.encoder(src)

        dec_input = trg[0]   # <SOS> token for every item in batch

        for t in range(1, trg_len):
            out, hidden, cell = self.decoder(dec_input, hidden, cell)
            outputs[t] = out
            use_teacher = random.random() < teacher_forcing_ratio
            dec_input = trg[t] if use_teacher else out.argmax(dim=1)

        return outputs

# ── Quick smoke test ──────────────────────────────────────────────────────────

SRC_VOCAB, TRG_VOCAB = 200, 150
EMB, HID, LAYERS = 64, 128, 2
SOS_IDX = 0

enc = Encoder(SRC_VOCAB, EMB, HID, LAYERS)
dec = Decoder(TRG_VOCAB, EMB, HID, LAYERS)
model = Seq2Seq(enc, dec, SOS_IDX, device=torch.device('cpu'))

src = torch.randint(1, SRC_VOCAB, (12, 8))  # [src_len=12, batch=8]
trg = torch.randint(0, TRG_VOCAB, (10, 8))  # [trg_len=10, batch=8]
trg[0] = SOS_IDX                            # first token is always <SOS>

out = model(src, trg, teacher_forcing_ratio=0.5)
print(f"src  shape: {src.shape}")       # [12, 8]
print(f"trg  shape: {trg.shape}")       # [10, 8]
print(f"out  shape: {out.shape}")       # [10, 8, 150]
print(f"params:     {sum(p.numel() for p in model.parameters()):,}")`

function PythonContent() {
    return (
        <>
            <p>
                A complete PyTorch implementation of the seq2seq architecture: separate
                <code>Encoder</code> and <code>Decoder</code> LSTM modules, a <code>Seq2Seq</code>
                wrapper that manages the forward pass with optional teacher forcing, and a
                smoke test verifying shapes.
            </p>
            <CodeBlock code={PY_CODE} filename="seq2seq.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SEQ2SEQ_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
