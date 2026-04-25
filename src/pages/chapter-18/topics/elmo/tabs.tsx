import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Words that change their meaning</h2>
            <p>
                Word2Vec and GloVe gave every word a single vector. But "bank" in "river bank" and
                "bank" in "investment bank" are not the same word. Contextualized embeddings — vectors
                that change based on surrounding words — were the holy grail. Matthew Peters and
                colleagues at the Allen Institute for AI solved it with ELMo: Embeddings from Language Models.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1957 — Firth</div>
                    <div className="ch-tl-title">"You Shall Know a Word by the Company It Keeps"</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Linguist J.R. Firth articulated what every language teacher knows instinctively: words do not have fixed, context-independent meanings. "Crane" means a bird or a construction machine depending on the surrounding sentence. "Light" means illumination, small weight, or pale color. Traditional dictionaries handled this with numbered definitions, but computational systems had no way to select the right definition automatically.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Firth's distributional hypothesis proposed that a word's meaning can be inferred from the contexts in which it appears. Words that appear in similar contexts have similar meanings. This became the theoretical foundation for all word embedding methods — from LSA in the 1990s to Word2Vec in 2013. But Firth's insight went further: a word's meaning in a specific context is determined by that specific context, not by some fixed average meaning.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Firth's principle implied that a truly good word representation must be dynamic: different for each context, computed from all surrounding words. Static embeddings like Word2Vec learned the average meaning across all contexts, which worked better than nothing but fundamentally could not capture polysemy. The goal of contextualized embeddings was implicit in Firth's 1957 observation — it would take six decades of computation to realize it.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 — Mikolov et al.</div>
                    <div className="ch-tl-title">Word2Vec — Powerful but Static</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Representing words as dense vectors had been studied since the 1990s, but training was slow and representations were weak. Neural language models (Bengio et al. 2003) improved quality but required days to train on moderate corpora. The field needed an efficient way to train high-quality word vectors on billions of words.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Mikolov et al.'s Word2Vec trained a shallow neural network on a window-based prediction objective — predict surrounding words (skip-gram) or predict the center word from surrounding words (CBOW) — using negative sampling for efficiency. The resulting 300-dimensional vectors encoded semantic relationships as arithmetic: king &#8722; man + woman &#8776; queen. GloVe (Pennington et al. 2014) followed, fitting word co-occurrence statistics with similar results.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        Word embeddings became the universal first layer of every NLP model. But the static nature was a fundamental limitation: "bank" had a single vector that was the average of its financial and geographical uses. Systems making downstream decisions — sentiment analysis, question answering, coreference resolution — had to work around this ambiguity with task-specific architectures. Contextualization remained unsolved.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 — McCann et al.</div>
                    <div className="ch-tl-title">CoVe — Contextualized Vectors from Translation</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Researchers at Salesforce recognized that a translation encoder, trained to read English and produce a meaning representation for translation, would naturally produce context-dependent representations. "Bank" in a financial sentence would be encoded differently from "bank" in a geographical sentence — because a translator must capture this distinction. Could translation encoders serve as a general source of contextualized word features?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        CoVe used a trained neural machine translation encoder (English to German) to produce contextual word representations. The encoder's hidden states, one per input word, were extracted and concatenated with GloVe embeddings for downstream tasks. Improvements were seen across multiple NLP benchmarks when CoVe was added, proving that contextual representations from one task could transfer to others.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        CoVe proved that contextualized representations transferred across tasks. But it had a critical limitation: it was tied to a specific translation dataset and encoder architecture. If you didn't have a translation system, you couldn't use CoVe. It also only used the top layer of the encoder, discarding the hierarchical features in lower layers. The search was on for a more general approach.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Feb 2018 — Peters et al.</div>
                    <div className="ch-tl-title">ELMo — Deep Contextualized Word Representations</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        Matthew Peters and the AllenNLP team at the Allen Institute for Artificial Intelligence had been studying word representations intensively. Their key observation was that different NLP tasks seemed to prefer representations from different depths of a neural network: syntactic tasks like part-of-speech tagging benefited from lower layers, while semantic tasks like coreference resolution benefited from higher layers. A single-layer representation couldn't serve all tasks well.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        "Deep contextualized word representations" (NAACL 2018, Best Paper Award) introduced ELMo: a bidirectional LSTM language model trained on 1 billion words (1B Word Benchmark). The forward LM reads left-to-right; the backward LM reads right-to-left; both share a character CNN for word encoding. The radical innovation: instead of using only the top layer, ELMo computes a task-specific weighted combination of ALL layer representations (character CNN output + all biLSTM layers), with weights learned for each downstream task.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ELMo improved six major NLP benchmarks simultaneously: SQuAD (reading comprehension +4.7 F1), SNLI (textual entailment +0.5%), SRL (semantic role labeling +3.2 F1), Coreference (+3.2 F1), NER (+0.5 F1), and SST-5 (sentiment +3.3%). It was the first method that worked out-of-the-box across such a diverse set of tasks. More importantly, it demonstrated that different layers of an LM encode qualitatively different linguistic properties — a finding that guided all subsequent work on interpretability and representation learning.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 — Community</div>
                    <div className="ch-tl-title">ELMo as Drop-In Replacement — Instant Adoption</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        For ELMo to have widespread impact, it needed to be easy to use. Researchers couldn't be expected to retrain large biLSTM models from scratch. AllenNLP released pretrained ELMo weights alongside a simple API: pass in a sentence, receive contextualized embeddings for each word. The embeddings were designed to be a drop-in replacement for GloVe — concatenate ELMo vectors to your existing embeddings and watch accuracy go up.
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        The AllenNLP team released three ELMo model sizes (small, medium, original) with pretrained weights on 1B words, along with integration guides for TensorFlow and PyTorch. Dozens of NLP papers in late 2018 reported new state-of-the-art results simply by adding ELMo to existing architectures. The paper's GitHub repository became one of the most-cited in NLP that year.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        ELMo demonstrated that large-scale language model pretraining produced representations that were immediately useful for the entire NLP field. It validated the general paradigm that ULMFiT, GPT-1, and BERT were simultaneously exploring. It also established that character-level encoding (handling out-of-vocabulary words via character CNN) was preferable to fixed vocabularies — an insight carried into subsequent models.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Late 2018 — Peters et al., others</div>
                    <div className="ch-tl-title">Layer Analysis — Understanding What LMs Learn</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">
                        ELMo's task-specific layer weights were a powerful feature, but they raised a deeper question: what exactly did each layer encode? If lower layers were better for syntax and upper layers for semantics, was that a stable result? And could understanding the layer-by-layer structure help practitioners make better choices about where to extract representations?
                    </div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">
                        Peters et al. published extensive probing experiments showing that ELMo's first biLSTM layer encoded syntax-heavy information (part-of-speech, phrase structure), while the second encoded semantic information (word sense, coreference). The character CNN layer captured morphological features. These results were replicated and extended by dozens of subsequent "probing" papers, establishing a whole subfield of interpretability research on what language models learn.
                    </div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">
                        This analysis became foundational for the field of BERTology — the study of what information is encoded in pretrained language models. The insight that learned task weights reflect qualitatively different linguistic properties (syntax-heavy tasks weight lower layers; semantics-heavy tasks weight upper layers) guided architecture choices for BERT, XLNet, and all subsequent models. ELMo did not just improve benchmarks — it gave the field a new lens for understanding neural language models.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Different layers of a deep language model encode different
                kinds of information. A weighted sum of all layers, with task-specific weights, produces
                richer representations than any single layer alone. This principle of hierarchical representation
                extraction became central to all subsequent pretrained language models.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A word with many costumes</h2>

            <Analogy label="The Paper Doll (Static Embedding)">
                <p>Imagine every word is a paper doll with one outfit. "Bank" always wears a gray suit,
                whether you're talking about a river or money. Sometimes the outfit sort of fits, but
                often it's completely wrong. That's a static embedding — one look for every situation.</p>
                <p>If a machine sees "I walked along the bank," it uses the same "bank" vector as "I deposited money at the bank." The machine is confused because the word looks identical to it, even though the meanings are completely different.</p>
            </Analogy>

            <Analogy label="The Actor (ELMo)">
                <p>ELMo is like a brilliant actor who reads the whole script before deciding how to play
                each line. When the actor sees "bank" in a sentence about rivers, they wear hiking boots
                and carry a fishing rod. When they see "bank" in a sentence about money, they wear a
                business suit and carry a briefcase.</p>
                <p>The costume changes based on the entire scene, not just the one word. ELMo reads the sentence in both directions — forwards and backwards — so it sees every clue before deciding how to represent each word.</p>
            </Analogy>

            <Analogy label="The Director's Cut — All the Layers">
                <p>But ELMo doesn't just pick one costume. It tries on outfits from every layer of its
                experience — childhood memories, teenage training, adult wisdom — and blends them together
                for each specific job. Some tasks need more childhood innocence (basic grammar), while
                others need adult wisdom (deep meaning). The blending is learned for each task separately.</p>
                <p>Lower layers remember grammar rules ("this word is a noun"). Higher layers remember meanings ("this noun refers to a place for swimming"). ELMo lets each task pick how much grammar versus meaning it needs.</p>
            </Analogy>

            <Analogy label="The Character CNN — Reading Letter by Letter">
                <p>Here's a cool trick: ELMo doesn't just look up words in a dictionary. It reads each word letter by letter first, like a child sounding out a new word. This means ELMo can handle words it has never seen before — like "COVID" or "Instagramming" — by recognizing familiar letter patterns.</p>
                <p>A word like "running" shares letters with "runs" and "runner." ELMo's character reader notices this family resemblance and gives them similar starting representations. Then the context adjusts from there.</p>
            </Analogy>

            <Analogy label="The Improvement in Practice">
                <p>How good was ELMo? On a question-answering test (SQuAD), ELMo improved the score by 4.7 points — that's like a student going from a B+ to an A. On understanding whether two sentences agree or disagree (textual entailment), it cut errors by about 20%.</p>
                <p>And you didn't have to redesign your entire system. You just added ELMo vectors alongside your existing word vectors, and the system automatically got smarter. It was like giving your model X-ray vision for word meaning.</p>
            </Analogy>

            <Analogy label="ELMo's Lasting Lesson">
                <p>ELMo taught the field something important: you don't have to throw away your existing NLP model to benefit from large language model pretraining. You can add it on top. The model learns which layer of ELMo to trust for your specific task, automatically finding the right level of linguistic abstraction.</p>
                <p>This "mix the layers" idea showed up again in BERT, GPT, and every major model that followed. ELMo proved the concept; the others scaled it up.</p>
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Bidirectional language modeling with deep representations</h2>

            <h3>Architecture — biLSTM with Character CNN</h3>
            <p>
                ELMo uses a <em>bidirectional language model</em> built from two stacked LSTMs. The forward
                LM predicts the next word left-to-right; the backward LM predicts the previous word
                right-to-left. Both share the same character CNN word encoder but have
                separate LSTM parameters. This makes the model parameter-efficient while allowing both
                directions to develop independent contextual representations.
            </p>
            <p>
                The character CNN converts each word into a fixed-size vector regardless of vocabulary.
                Filters of widths 1-7 characters capture morphological features (prefixes, suffixes, stems).
                A highway network then projects the concatenated filter outputs to the model's hidden dimension.
                This architecture naturally handles out-of-vocabulary words — essential for robustness to
                domain shift and rare word forms.
            </p>

            <h3>The Two Language Model Objectives</h3>
            <p>
                For a sequence of N tokens (t&#8321;, &#8230;, t&#8319;), ELMo maximizes the joint log-likelihood of
                both directions simultaneously. The forward LM predicts each token from its left context;
                the backward LM predicts each token from its right context. Both share the character CNN
                embedding parameters &#920;&#120297; but have separate LSTM parameters:
            </p>
            <MathBlock tex="\sum_{j=1}^{N} \bigl( \log p(t_j \mid t_1, \dots, t_{j-1};\, \Theta_x, \overrightarrow{\Theta}) + \log p(t_j \mid t_{j+1}, \dots, t_N;\, \Theta_x, \overleftarrow{\Theta}) \bigr)" />

            <h3>Layer Representations and Task-Specific Weighting</h3>
            <p>
                For word j at LSTM layer k, ELMo concatenates forward and backward hidden states:
            </p>
            <MathBlock tex="\mathbf{h}_{j,k} = [\overrightarrow{\mathbf{h}}_{j,k};\; \overleftarrow{\mathbf{h}}_{j,k}]" />
            <p>
                For a downstream task, ELMo computes a weighted combination across all L layers plus
                the character CNN layer (k=0), scaled by a task-specific scalar &#947;:
            </p>
            <MathBlock tex="\mathbf{ELMo}_j^{\text{task}} = \gamma^{\text{task}} \sum_{k=0}^{L} s_k^{\text{task}} \mathbf{h}_{j,k}" />
            <p>
                The weights s&#8336; are softmax-normalized over raw parameters w&#8336;, and both &#947; and w&#8336; are
                learned during task fine-tuning while all LM parameters remain frozen. This allows each
                task to discover which layer contains the most useful information.
            </p>

            <h3>Integration with Downstream Models</h3>
            <p>
                ELMo vectors are concatenated with existing word representations (typically GloVe):
            </p>
            <MathBlock tex="\mathbf{x}_j^{\text{enhanced}} = [\mathbf{GloVe}_j;\; \mathbf{ELMo}_j^{\text{task}}]" />
            <p>
                This concatenation strategy requires minimal changes to existing model architectures. The ELMo
                embedding can also be added to the output of the downstream model (late fusion), or both
                early and late fusion can be combined. In all configurations, ELMo improvements were
                consistent across the six benchmarks tested.
            </p>

            <h3>Layer Specialization — Empirical Evidence</h3>
            <p>
                Peters et al. analyzed which layers ELMo tasks preferred by examining the learned s&#8336; weights:
            </p>
            <ul>
                <li><strong>Part-of-speech tagging (syntax):</strong> Strongly prefers the first biLSTM layer, which captures linear syntactic structure</li>
                <li><strong>Word sense disambiguation (semantics):</strong> Strongly prefers the second biLSTM layer, which captures contextual meaning</li>
                <li><strong>Coreference resolution:</strong> Uses lower layers more — anaphora resolution requires tracking which noun phrases co-refer, a syntactic/structural task</li>
                <li><strong>Textual entailment (NLI):</strong> Uses upper layers more — determining whether one sentence logically follows from another requires deep semantic reasoning</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key difference from CoVe:</strong> CoVe used a translation encoder and only the top
                layer. ELMo trains a <em>pure language model</em> on any text corpus and uses <em>all layers</em> with learned
                task-specific weights. This makes ELMo more general (any language, any corpus) and more expressive
                (hierarchical feature extraction). The task-specific weighting is the critical innovation.
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
            <h2>Formal specification and layer combination</h2>

            <DefBlock label="Bidirectional Language Model Objective">
                Given a sequence of N tokens (t&#8321;, &#8230;, t&#8319;), a forward language model
                computes the probability by factorizing left-to-right:
                <MathBlock tex="p(t_1, \dots, t_N) = \prod_{j=1}^{N} p(t_j \mid t_1, \dots, t_{j-1})" />
                A backward language model factorizes right-to-left:
                <MathBlock tex="p(t_1, \dots, t_N) = \prod_{j=1}^{N} p(t_j \mid t_{j+1}, \dots, t_N)" />
                The bidirectional LM objective maximizes the sum of log-likelihoods of both directions jointly.
            </DefBlock>

            <h3>Character CNN Encoding</h3>
            <p>
                Let C&#8336; be the matrix of character embeddings for word j, where each character is mapped
                to a d&#8338;-dimensional vector. A narrow convolution with filters of width w produces
                feature maps, which are max-pooled and passed through highway layers to produce x&#8336;:
            </p>
            <MathBlock tex="\mathbf{x}_j = \text{Highway}\bigl(\text{MaxPool}(\text{Conv1D}(\mathbf{C}_j))\bigr)" />
            <p>
                The highway network uses a transform gate T and carry gate C = 1 &#8722; T. For input h:
            </p>
            <MathBlock tex="\text{Highway}(\mathbf{h}) = T(\mathbf{h}) \cdot f(\mathbf{h}) + (1 - T(\mathbf{h})) \cdot \mathbf{h}" />
            <p>
                where T(h) = &#963;(W&#84;h + b&#84;) is the learned gate and f(h) = ReLU(Wh + b) is the
                transformation. Highway networks allow deep architectures to selectively pass information
                through without transformation.
            </p>

            <h3>ELMo Representation</h3>
            <p>
                For each position j and layer k, concatenating forward and backward states gives:
            </p>
            <MathBlock tex="\mathbf{h}_{j,k}^{LM} = [\overrightarrow{\mathbf{h}}_{j,k}^{LM};\; \overleftarrow{\mathbf{h}}_{j,k}^{LM}]" />
            <p>
                The task-specific ELMo vector is a softmax-weighted sum scaled by &#947;:
            </p>
            <MathBlock tex="\mathbf{ELMo}_j^{\text{task}} = \gamma^{\text{task}} \sum_{k=0}^{L} s_k^{\text{task}} \mathbf{h}_{j,k}^{LM}" />
            <p>
                where the weights s&#8336; are softmax-normalized over learned parameters w&#8336;:
            </p>
            <MathBlock tex="s_k^{\text{task}} = \frac{\exp(w_k^{\text{task}})}{\sum_{k'=0}^{L} \exp(w_{k'}^{\text{task}})}" />
            <p>
                Both &#947; and all w&#8336; are learned during task fine-tuning while the LM parameters
                remain frozen. The scalar &#947; provides an additional degree of freedom to rescale the
                entire ELMo vector relative to other input features.
            </p>

            <h3>Information-Theoretic View of Layer Selection</h3>
            <p>
                The learned layer weights can be interpreted through the lens of mutual information.
                Each layer h&#8336; contains different amounts of information about linguistic properties.
                For a task with target labels Y, the optimal layer weight allocation maximizes:
            </p>
            <MathBlock tex="I\!\left(Y;\, \sum_k s_k \mathbf{h}_{j,k}\right)" />
            <p>
                Since I(Y; h&#8336;) varies by layer and task, the task-specific weights s&#8336; learned by
                gradient descent approximate the optimal information-theoretic allocation.
            </p>

            <div className="ch-callout">
                <strong>Empirical observation:</strong> On coreference resolution, lower ELMo layers
                contribute more (syntax-heavy task — tracking noun phrase co-reference requires structural
                understanding). On textual entailment, upper layers contribute more (semantics-heavy task —
                logical entailment requires deep semantic reasoning). The learned weights s&#8336; automatically
                discover these preferences without human supervision.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── ELMo-style Layer Weighting — NumPy ────────────────────────────────────────
def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()

def elmo_vector(layer_reps, task_weights, gamma=1.0):
    """
    layer_reps : list of L+1 arrays (layer 0 = char CNN, 1..L = biLSTM)
    task_weights: raw logits w_k for softmax normalization
    gamma       : task-specific scale factor
    Returns the weighted ELMo representation for one word position.
    """
    s = softmax(np.array(task_weights))
    combined = sum(s_k * h_k for s_k, h_k in zip(s, layer_reps))
    return gamma * combined

# ── Character CNN simulation ──────────────────────────────────────────────────
def char_cnn(word_chars, vocab_size=128, embed_dim=16, out_dim=64):
    """Simplified char-CNN: embed chars, max-pool over positions."""
    np.random.seed(hash(word_chars) % 2**31)
    char_embeds = np.random.randn(len(word_chars), embed_dim)
    # Simulate a filter of width 3 with max-pool
    if len(word_chars) >= 3:
        windows = np.stack([char_embeds[i:i+3].mean(axis=0)
                            for i in range(len(word_chars)-2)])
        pooled = windows.max(axis=0)
    else:
        pooled = char_embeds.mean(axis=0)
    # Project to out_dim
    W = np.random.randn(embed_dim, out_dim) * 0.1
    return pooled @ W

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# Simulate 3-layer representation: char-CNN + 2 biLSTM layers
hidden = 256  # biLSTM concatenation: 2 * 128
layer_reps_bank_river  = [char_cnn("bank", out_dim=64),
                           np.random.randn(hidden),   # LSTM-1 (river context)
                           np.random.randn(hidden)]   # LSTM-2
layer_reps_bank_money  = [char_cnn("bank", out_dim=64),
                           np.random.randn(hidden),   # LSTM-1 (money context)
                           np.random.randn(hidden)]   # LSTM-2

# Task A: syntax-heavy (favors lower layers)
weights_syntax   = np.array([1.0, 2.0, 0.2])
# Task B: semantics-heavy (favors upper layers)
weights_semantic = np.array([0.2, 0.5, 2.5])

elmo_river_syn  = elmo_vector(layer_reps_bank_river,  weights_syntax,   gamma=0.8)
elmo_money_syn  = elmo_vector(layer_reps_bank_money,  weights_syntax,   gamma=0.8)
elmo_river_sem  = elmo_vector(layer_reps_bank_river,  weights_semantic, gamma=1.2)
elmo_money_sem  = elmo_vector(layer_reps_bank_money,  weights_semantic, gamma=1.2)

cos = lambda a, b: np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)

print("ELMo Layer Weighting Demo")
print("=" * 55)
print(f"Softmax weights (syntax   task): {softmax(weights_syntax).round(3)}")
print(f"Softmax weights (semantic task): {softmax(weights_semantic).round(3)}")
print()
print("Cosine similarity of 'bank' in river vs money context:")
print(f"  Syntax   task: {cos(elmo_river_syn,  elmo_money_syn):.4f}  (lower = more distinct)")
print(f"  Semantic task: {cos(elmo_river_sem,  elmo_money_sem):.4f}  (lower = more distinct)")
print()
print("Lower similarity means the model better distinguishes word senses.")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy demonstration of ELMo's task-specific layer weighting and a simplified character CNN.
                The demo shows how the same word "bank" receives more distinct representations (lower cosine
                similarity) when the upper semantic layers are weighted more heavily.
            </p>
            <CodeBlock code={PY_CODE} filename="elmo_weights.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ELMO_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
