import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    context: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">Context</div>
            <div className="ch-tl-body">{item.context}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "2018–2019 — The Architecture Proliferation Problem",
            title: "Every NLP task was its own bespoke engineering project",
            context: "By late 2018, the NLP landscape had fractured into incompatible architectures. BERT and its variants dominated classification, span-extraction, and natural language inference. Encoder-decoder seq2seq models (originally from Sutskever et al., 2014) handled translation and summarization. GPT-2 generated fluent text. And a growing zoo of task-specific heads, fine-tuning recipes, and specialized objectives — CRF layers for named entity recognition, pointer networks for extractive summarization, pairwise ranking losses for retrieval — had accumulated. A researcher who wanted to compare, say, BERT and a seq2seq model on the same task faced weeks of framework translation.",
            what: "The proliferation produced three concrete inefficiencies. First, engineering redundancy: every lab implemented its own version of tokenizers, attention masks, and training loops for each task family. Second, evaluation fragmentation: benchmarks used incompatible metrics (F1, ROUGE, BLEU, accuracy) that could not be meaningfully averaged. Third, architectural bias: performance comparisons were confounded by the architecture choice, so it was unclear whether a BERT model beat a seq2seq model because of the architecture or the fine-tuning details. There was no controlled framework for ablation.",
            impact: "This mess was the direct motivation for T5. Colin Raffel and colleagues at Google Brain asked: what if every NLP task could be cast as generating text from text? A single unified framework would eliminate the engineering fragmentation, make comparisons fair, and allow systematic ablation of architectural choices. Their answer — the text-to-text transfer transformer — would set the template for GPT-3's in-context prompting, instruction-tuned models, and the conversational AI systems that followed.",
        },
        {
            year: "October 2019 — The Text-to-Text Insight",
            title: "Every NLP task reframed as conditional text generation",
            context: "The key conceptual move in T5 was deceptively simple: add a short natural-language prefix to every input, and train a seq2seq model to generate the correct output as a string. Sentiment analysis: 'cola sentence: The quick brown fox' &#8594; 'acceptable'. Natural language inference: 'mnli premise: X hypothesis: Y' &#8594; 'entailment'. Summarization: 'summarize: &#123;article&#125;' &#8594; '&#123;summary&#125;'. Question answering: 'question: X context: Y' &#8594; '&#123;answer&#125;'. Regression (STS-B similarity): 'stsb sentence1: X sentence2: Y' &#8594; '3.8'.",
            what: "Raffel et al. published 'Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer' as a preprint in October 2019. The paper trained T5 in five sizes — Small (60M), Base (220M), Large (770M), 3B, and 11B parameters — all on the same C4 dataset, with the same tokenizer (SentencePiece, 32,000 tokens), the same span-corruption pretraining objective, and the same fine-tuning procedure. The only variable across tasks was the text prefix. This made ablations genuinely controlled: every configuration difference could be traced to a specific choice.",
            impact: "The text-to-text framing turned out to be not just an engineering convenience but a conceptual breakthrough. It forced researchers to think about tasks as translation problems — from one natural language string to another — rather than as classification or regression problems requiring specialized output layers. This shift in thinking anticipates in-context learning (GPT-3), instruction tuning (FLAN), and the chat interface of modern AI assistants, all of which treat user inputs as prompts and model outputs as generated text.",
        },
        {
            year: "2019 — C4: The Colossal Clean Crawled Corpus",
            title: "750 gigabytes of filtered web text as a reproducible pretraining dataset",
            context: "Previous large-scale pretraining datasets were either proprietary (WebText, used for GPT-2, was never released), narrow (BooksCorpus was 800M words of fiction), or noisy (raw Common Crawl contained enormous amounts of boilerplate, spam, and near-duplicates). BERT's training data — BooksCorpus plus English Wikipedia — totaled only about 16GB and had been shown to limit performance on tasks requiring broad world knowledge. T5 needed a dataset large enough to train an 11B model, diverse enough to cover all NLP task domains, and clean enough that pretraining signals were meaningful.",
            what: "The T5 team built C4 (Colossal Clean Crawled Corpus) from the April 2019 Common Crawl snapshot. The pipeline applied: (1) heuristic quality filters — keep only lines ending in terminal punctuation, pages with at least three sentences, and documents with at least 200 words; (2) language detection — retain only English text with high confidence; (3) deduplication — remove documents sharing three-sentence spans; (4) content filtering — remove pages containing words from a blocklist or with a very high fraction of repeated n-grams. The result was approximately 750GB of clean English text, &#8776;156 billion tokens.",
            impact: "C4 became the most widely used public pretraining corpus for years after its release. It was the standard pretraining data for T5 variants, the default in many academic experiments, and the basis for C4-200M (a 200-million-document sample used in downstream research). Its construction pipeline — filtering Common Crawl with heuristics and deduplication — became the template for subsequent datasets including the Pile (EleutherAI), RefinedWeb, and Dolma. The principle of publicly releasing both the data and the construction pipeline, rather than only the model, significantly accelerated reproducibility in NLP.",
        },
        {
            year: "2019 — Span Corruption: A Better Pretraining Objective",
            title: "Masking contiguous spans rather than individual tokens",
            context: "BERT's masked language modeling objective replaced 15% of individual tokens with [MASK] and asked the model to predict them. This worked well for encoder-style understanding tasks but had a structural mismatch with seq2seq generation: the decoder was trained to produce multi-token sequences, but the pretraining objective provided only single-token prediction targets. GPT-2's causal language modeling was better suited to generation but had no masking at all — it processed the entire input sequentially without any denoising challenge. T5 needed an objective that was native to seq2seq and that pushed the model to generate coherent multi-token spans.",
            what: "T5's span corruption objective worked as follows: (1) randomly sample 15% of tokens in the input; (2) group adjacent selected tokens into contiguous spans; (3) replace each span with a unique sentinel token &#x27e8;extra_id_0&#x27e9;, &#x27e8;extra_id_1&#x27e9;, etc.; (4) train the decoder to reconstruct each span, preceded by its sentinel. The mean span length was 3 tokens, producing an average of about 5 spans per 512-token example. The decoder output was the concatenation of all sentinel-span pairs: &#x27e8;extra_id_0&#x27e9; span_0 &#x27e8;extra_id_1&#x27e9; span_1 ...",
            impact: "Span corruption proved to be the strongest pretraining objective in the T5 ablation study, outperforming standard masked LM, prefix LM, and full causal LM by 1–3 points on most downstream tasks. The key advantage was efficiency: the decoder only had to predict the masked spans (&#8776;15% of input tokens), not the full sequence, so each training example was more information-dense. Span corruption also generalized better to generation tasks than single-token masking, because the model learned to produce multi-word completions coherently. It became the standard pretraining objective for encoder-decoder models through at least 2023.",
        },
        {
            year: "2019–2020 — The Systematic Ablation Study",
            title: "24 architecture experiments, 5 objectives, 4 data scales — the most thorough NLP ablation to date",
            context: "Ablation studies in NLP had historically been limited: change one hyperparameter, report the result on a single benchmark. T5 was designed from the ground up as an ablation framework. Because all tasks used identical input-output formats and identical models, it was possible to run dozens of controlled experiments and aggregate results across multiple benchmarks without architectural confounds. The full ablation encompassed architecture (encoder-decoder vs. decoder-only vs. encoder-only), pretraining objectives (BERT-style, GPT-style, prefix LM, span corruption, deshuffling), data size, vocabulary, and fine-tuning approaches.",
            what: "Raffel et al. compared 24 architectural and objective variants, each trained at Base (220M) scale on the same C4 data. Key findings: (1) encoder-decoder outperformed decoder-only on all tasks, even generation tasks; (2) span corruption outperformed all other objectives; (3) pretraining on diverse web text substantially outperformed pretraining on domain-specific corpora for most tasks; (4) scaling from Base to 11B improved performance on every benchmark, with superlinear gains on SuperGLUE; (5) greedy decoding performed comparably to beam search on most tasks when the model was large enough.",
            impact: "The ablation was the scientific foundation of T5's credibility. Whereas BERT had shown that pretraining worked, T5 showed exactly which choices mattered. The finding that encoder-decoder outperforms decoder-only — even for generation — was influential enough that many subsequent text generation models (Flan-T5, UL2, mT5) retained the encoder-decoder architecture. The finding that scale beats objective choice — a larger model with a mediocre objective often outperforms a smaller model with a better objective — foreshadowed the scaling laws paper and the shift toward data-and-parameter scaling as the primary lever.",
        },
        {
            year: "2020–2023 — T5's Legacy and the Text-to-Text Family",
            title: "Flan-T5, mT5, and the ancestor of modern chat models",
            context: "T5's text-to-text paradigm proved to be the most durable conceptual contribution of the 2019 wave. BERT's influence was primarily architectural (the encoder design) and methodological (the fine-tuning recipe). GPT-2's influence was primarily empirical (zero-shot transfer) and cultural (the responsible-release debate). T5's influence was conceptual: it established the text-to-text framework as the natural way to think about any language task, and that framing persisted through GPT-3, instruction tuning, and the chat era.",
            what: "The T5 family grew steadily: mT5 (2021) applied the text-to-text paradigm to 101 languages, using the mC4 corpus. Flan-T5 (2022) fine-tuned T5 on over 1,800 NLP tasks phrased as natural language instructions, dramatically improving zero-shot performance on held-out tasks and establishing instruction tuning as a systematic method. UL2 (2022) introduced a mixture-of-denoisers pretraining objective that unified span corruption, prefix LM, and causal LM. T5-11B held multiple state-of-the-art records on SuperGLUE, CNN/DailyMail summarization, and SQuAD for over a year after its release.",
            impact: "The deepest legacy of T5 is the recognition that the boundary between 'language modeling' and 'task solving' is artificial. When every task is a text-to-text translation, the model does not need to know it is doing classification or summarization — it just generates the most likely output string given the input. This framing is the exact ancestor of the prompt-based paradigm in ChatGPT, Claude, and Gemini. The text-in, text-out interface that billions of people use today was pioneered, at research scale, by T5 in 2019.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <Analogy label="The Swiss Army Knife">
                Imagine every homework assignment needs a different tool. Math needs a calculator.
                English essays need a word processor. French translation needs a dictionary. Spanish
                needs a completely different dictionary. Science needs a graphing program. Before T5,
                AI systems were like that: one specialized tool per subject, and moving between them
                required completely rebuilding everything.
                <br /><br />
                T5 said: what if there was just one very smart Swiss Army Knife that could handle
                everything? You would just have to tell it which blade to use. "Translate to French:"
                snaps out the translation blade. "Summarize:" snaps out the summary blade. One tool,
                every task.
            </Analogy>

            <Analogy label="The Prefix Magic Trick">
                Here is how T5's magic worked. Before T5, if you wanted AI to do translation, you
                built a translation machine. If you wanted sentiment analysis, you built a sentiment
                machine. Each machine was trained from scratch on its own special data.
                <br /><br />
                T5 had a simpler trick: just add a label at the start of every input. "translate
                English to German: The sky is blue." "summarize: Once upon a time there was a
                kingdom..." "sentiment: This movie was terrible." The same model learned to read
                that little label and do whatever it said. No special machinery, no different
                training. Just a label.
            </Analogy>

            <Analogy label="The Massive Cleaning Project">
                To train T5, Google needed a library — a huge one. The internet has a lot of text,
                but most of it is garbage: spam, broken links, copied articles, and weird characters.
                They spent months cleaning the April 2019 snapshot of the whole web, throwing away
                everything that looked like spam, removing near-identical copies, and keeping only
                clean English text.
                <br /><br />
                The result was called C4 — short for Colossal Clean Crawled Corpus — and it was
                750 gigabytes of good text. That is like reading about 750,000 novels. T5 was
                then trained to read all of that and learn to fill in the blanks.
            </Analogy>

            <Analogy label="The Blanks Game">
                T5 learned by playing a game called Span Corruption. Here is how you play: take a
                sentence, hide several words in a row (not just one word at a time, but whole phrases),
                replace each hidden chunk with a placeholder like &#x27e8;BLANK-1&#x27e9;, and give
                the sentence to T5. T5's job is to figure out what goes in each blank.
                <br /><br />
                This is harder than just guessing one word at a time. If you hide "jumped over" and
                "lazy", T5 has to generate the right multi-word phrase, not just pick from a list.
                By practicing this billions of times on 750 gigabytes of text, T5 got very, very
                good at predicting language.
            </Analogy>

            <Analogy label="The Science Fair Experiment">
                T5 is famous not just for being good — it is famous for being scientific. Before T5,
                researchers would change many things at once and not know which change made the model
                better. T5 ran 24 controlled experiments: change one thing, hold everything else
                exactly the same, measure the result.
                <br /><br />
                They tested different architectures, different ways of hiding words, different data
                sources, different amounts of training. It was like a giant science fair project,
                and the results settled many arguments that had been going on for years about the
                best way to train language AI.
            </Analogy>

            <Analogy label="The Family Tree">
                After T5, Google kept extending the idea. mT5 taught the same trick to 101 languages.
                Flan-T5 trained T5 to follow natural language instructions like "Write a poem about
                autumn" — making it much more useful as an assistant. UL2 combined three different
                learning games into one model.
                <br /><br />
                Most importantly, the text-to-text idea traveled to every major AI lab. When you
                type a message to an AI assistant today and it generates a reply, you are using a
                system built on T5's key insight: every task is just text going in and text coming
                out.
            </Analogy>

            <Analogy label="The Common Ancestor">
                BERT was the reading champion of 2018. GPT-2 was the writing champion of 2019. T5
                asked: why have separate champions? Can one model do both? The answer was yes, as
                long as you frame everything as translation — transforming one string into another.
                <br /><br />
                ChatGPT, Claude, Gemini, and every modern AI assistant you talk to descends from this
                insight. The friendly text box you type in and the response you get back are both
                just text. The model does not care whether you asked it to translate, summarize, or
                chat — it is always doing the same thing T5 demonstrated first: generating the most
                likely next sequence of words given what you wrote.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>T5 architecture and the text-to-text framework</h2>

            <h3>The Encoder-Decoder Architecture</h3>
            <p>
                T5 uses a standard encoder-decoder transformer, identical in spirit to the
                original "Attention Is All You Need" architecture. The encoder reads the input
                string (prefix + source text) and builds bidirectional contextual representations.
                The decoder then autoregressively generates the output token by token, attending
                to its own previous outputs (causal self-attention) and to the encoder's final
                hidden states (cross-attention). This two-stage design is natural for text-to-text
                translation: the encoder "understands" the input; the decoder "writes" the output.
            </p>
            <p>
                Key structural differences from BERT and GPT-2: T5's encoder is bidirectional
                (like BERT) but trained jointly with the decoder rather than standalone. T5's
                decoder is causal (like GPT-2) but receives encoder context at every layer. The
                parameter sharing between encoder and decoder embedding tables is optional and was
                not used in the original T5.
            </p>

            <h3>Relative Position Bias</h3>
            <p>
                T5 replaces absolute positional embeddings with relative positional biases added
                directly to attention logits. For a query at position i attending to a key at
                position j, the bias depends only on the offset (i &#8722; j):
            </p>
            <MathBlock tex="\text{Attention}_{ij} = \frac{Q_i K_j^T}{\sqrt{d_k}} + b_{i-j}" />
            <p>
                The biases b<sub>i&#8722;j</sub> are learned scalar values, bucketed into 32
                bins for large offsets (offsets beyond a threshold share the same bucket). This
                allows T5 to generalize to sequence lengths longer than those seen during training,
                because the model has never seen an absolute position 1,025 — but it has seen the
                relative offset of &#8722;1, &#8722;2, etc. at every position.
            </p>

            <h3>Span Corruption Pretraining Objective</h3>
            <p>
                T5 is pretrained with span corruption: 15% of tokens are selected, grouped into
                contiguous spans of mean length 3, and replaced with unique sentinel tokens in the
                input. The decoder reconstructs only the masked spans. Formally, given input
                x = x<sub>1</sub>, ..., x<sub>n</sub>, a masking function M produces:
            </p>
            <MathBlock tex="\tilde{x} = x_{1:s_1} \;\langle\text{X}_0\rangle\; x_{s_1+\ell_1:s_2} \;\langle\text{X}_1\rangle\; \cdots" />
            <p>
                And the decoder target is:
            </p>
            <MathBlock tex="\tilde{y} = \langle\text{X}_0\rangle\; x_{s_1:s_1+\ell_1} \;\langle\text{X}_1\rangle\; x_{s_2:s_2+\ell_2} \;\cdots" />
            <p>
                The model maximizes log P(&tilde;y | &tilde;x). Because the decoder only predicts
                about 15% of tokens (the masked spans), each training example is more efficient
                than full causal LM, which predicts every token including the easy ones.
            </p>

            <h3>The Text-to-Text Prefix Convention</h3>
            <p>
                Every task is reformulated by prepending a natural-language prefix that signals the
                task type. During fine-tuning, the model sees thousands of examples with these
                prefixes and learns to associate each prefix with its expected output format:
            </p>
            <ul>
                <li><strong>Translation:</strong> "translate English to German: The house is small."</li>
                <li><strong>Summarization:</strong> "summarize: &#123;article text&#125;"</li>
                <li><strong>NLI (MNLI):</strong> "mnli premise: &#123;p&#125; hypothesis: &#123;h&#125;" &#8594; "entailment" / "neutral" / "contradiction"</li>
                <li><strong>QA (SQuAD):</strong> "question: &#123;q&#125; context: &#123;passage&#125;" &#8594; "&#123;answer span&#125;"</li>
                <li><strong>Regression (STS-B):</strong> "stsb sentence1: &#123;a&#125; sentence2: &#123;b&#125;" &#8594; "3.8"</li>
                <li><strong>Grammar (CoLA):</strong> "cola sentence: &#123;text&#125;" &#8594; "acceptable" or "unacceptable"</li>
            </ul>

            <h3>Model Sizes and Parameter Counts</h3>
            <p>
                T5 was released in five sizes. For an encoder-decoder with L layers each in encoder
                and decoder, hidden size d, and FFN dimension 4d:
            </p>
            <MathBlock tex="N \approx 2L\,(12d^2) + V \cdot d" />
            <p>
                T5-Small: L=6, d=512, &#8776;60M params. T5-Base: L=12, d=768, &#8776;220M.
                T5-Large: L=24, d=1024, &#8776;770M. T5-3B: L=24, d=1024 with larger FFN,
                &#8776;3B. T5-11B: L=24, d=1024 with very large FFN, &#8776;11B. The factor of 2
                accounts for encoder and decoder stacks; cross-attention adds additional parameters
                equal to about one extra attention layer per decoder layer.
            </p>

            <h3>Results and State of the Art</h3>
            <p>
                T5-11B set state of the art on GLUE (88.9 average), SuperGLUE (89.3, surpassing
                human baseline of 89.8 on most tasks), SQuAD (90.1 EM), and CNN/DailyMail
                summarization (21.6 ROUGE-1). The ablation study confirmed that span corruption
                outperformed all other objectives, encoder-decoder outperformed decoder-only, and
                larger scale uniformly improved all tasks.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>The lasting insight:</strong> T5 showed that the choice of pretraining
                objective and architecture matters less than scale — but the text-to-text framing
                is what made scale transferable to any task. By eliminating task-specific heads and
                fine-tuning recipes, it made the trained model a general-purpose text transformer
                that could be adapted by changing only the input prefix. That design principle is
                the direct ancestor of in-context learning, instruction tuning, and the chat
                interface of modern AI assistants.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations &middot; proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation &middot; NumPy &middot; Python</span>
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
            <h2>Encoder-decoder attention, span corruption, and relative position bias</h2>

            <DefBlock label="Cross-Attention in the T5 Decoder">
                Each decoder layer performs two attention operations. Self-attention (causal masked)
                over previously generated tokens, and cross-attention over the encoder's final hidden
                states H<sub>enc</sub>. The cross-attention score matrix is:
            </DefBlock>
            <MathBlock tex="\text{CrossAttn}(Q, K, V) = \text{softmax}\!\Bigl(\frac{Q K^T}{\sqrt{d_k}}\Bigr) V" />
            <p>
                Where Q = H<sub>dec</sub> W<sub>Q</sub> comes from the previous decoder layer,
                and K = H<sub>enc</sub> W<sub>K</sub>, V = H<sub>enc</sub> W<sub>V</sub> come from
                the encoder output. Every decoder position can attend to every encoder position,
                enabling the output to draw on any part of the input when generating each token.
            </p>

            <h3>Relative Position Bias Derivation</h3>
            <p>
                Standard additive position embeddings add a position-specific vector to each token
                embedding before the first layer. Relative position biases instead add a scalar
                to each attention logit based on the query-key offset:
            </p>
            <MathBlock tex="a_{ij} = \frac{(x_i W_Q)(x_j W_K)^T}{\sqrt{d_k}} + \beta(i - j)" />
            <p>
                The function &#946;(i &#8722; j) maps offsets to scalar biases. T5 uses 32 learned
                bias values, with all offsets beyond a threshold (typically 128) sharing the last
                bucket. The biases are shared across all attention heads and all layers (though
                per-layer biases are also explored). Because &#946; depends only on the relative
                offset, the attention distribution is equivariant to translation of the sequence —
                the same pattern of attention weights is produced regardless of absolute position.
            </p>

            <h3>Span Corruption Objective: Formal Derivation</h3>
            <p>
                Let x = (x<sub>1</sub>, ..., x<sub>n</sub>) be the input sequence. Sample spans
                S = &#123;(s<sub>1</sub>, l<sub>1</sub>), ..., (s<sub>k</sub>, l<sub>k</sub>)&#125;
                where s<sub>i</sub> is the start position and l<sub>i</sub> the length of span i,
                l<sub>i</sub> &#8764; Poisson(&#956;=3). The corrupted input replaces each span
                with a unique sentinel:
            </p>
            <MathBlock tex="\tilde{x} = \text{concat}\bigl(x_{1:s_1},\;\langle X_1\rangle,\;x_{s_1+l_1:s_2},\;\langle X_2\rangle,\;\ldots\bigr)" />
            <p>
                The target is the concatenation of sentinels and their corresponding spans:
            </p>
            <MathBlock tex="\tilde{y} = \text{concat}\bigl(\langle X_1\rangle,\;x_{s_1:s_1+l_1},\;\langle X_2\rangle,\;x_{s_2:s_2+l_2},\;\ldots\bigr)" />
            <p>
                The model is trained to minimize the negative log-likelihood of &#7923; given
                &#x0303;x:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{span}} = -\sum_{t=1}^{|\tilde{y}|} \log P_\theta(\tilde{y}_t \mid \tilde{x},\; \tilde{y}_{1:t-1})" />
            <p>
                With 15% masking and mean span length 3, approximately 5% of the original tokens
                appear in the target (the sentinels themselves are not content), making this more
                compute-efficient than predicting every token in causal LM.
            </p>

            <h3>Parameter Count for Encoder-Decoder</h3>
            <p>
                For T5 with L layers each in encoder and decoder, hidden dim d, FFN dim d<sub>ff</sub>,
                and vocabulary size V:
            </p>
            <MathBlock tex="N \approx V\cdot d + L\bigl(4d^2 + 2d\cdot d_{ff}\bigr) + L\bigl(4d^2 + 2d\cdot d_{ff} + 2d^2\bigr)" />
            <p>
                The first L term covers the encoder (self-attention: 4d&#178; for Q,K,V,O plus
                FFN: 2d&#183;d<sub>ff</sub>). The second L term covers the decoder (same plus
                2d&#178; for cross-attention K,V projections from encoder). For T5-11B:
                L=24, d=1024, d<sub>ff</sub>=65536, V=32128, giving approximately 11B parameters.
            </p>

            <div className="ch-callout">
                <strong>Why encoder-decoder wins over decoder-only:</strong> The T5 ablation showed
                that encoder-decoder outperforms a comparably-sized decoder-only model on every task
                tested, including generation tasks. The intuition: the bidirectional encoder computes
                a full contextual representation of the entire input before the decoder generates a
                single output token. A decoder-only model processing the same input causallybuilds
                representations left-to-right, so early input positions have no information about
                later input positions when their representations are computed. For tasks where the
                output depends strongly on the entire input — translation, summarization, NLI — the
                encoder's bidirectionality is a strict advantage.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── T5-Style Span Corruption ──────────────────────────────────────────────────

def span_corruption(tokens: list, mask_rate: float = 0.15, mean_span_len: float = 3.0):
    """
    Apply T5 span corruption to a list of tokens.
    Returns (corrupted_input, target_output) as lists of strings.
    """
    n = len(tokens)
    num_to_mask = max(1, int(n * mask_rate))

    # Sample non-overlapping spans greedily
    spans = []
    masked_count = 0
    attempts = 0
    covered = set()
    sentinel_id = 0

    while masked_count < num_to_mask and attempts < 1000:
        attempts += 1
        span_len = max(1, np.random.poisson(mean_span_len))
        start = np.random.randint(0, max(1, n - span_len + 1))
        indices = set(range(start, min(start + span_len, n)))
        if not indices & covered:
            spans.append((start, span_len, sentinel_id))
            covered |= indices
            masked_count += span_len
            sentinel_id += 1

    spans.sort(key=lambda s: s[0])

    # Build corrupted input and target
    inp, tgt = [], []
    prev_end = 0
    for (start, length, sid) in spans:
        inp.extend(tokens[prev_end:start])
        inp.append(f"<extra_id_{sid}>")
        tgt.append(f"<extra_id_{sid}>")
        tgt.extend(tokens[start:start + length])
        prev_end = start + length
    inp.extend(tokens[prev_end:])

    return inp, tgt

# ── Relative Position Bucket (T5 style) ──────────────────────────────────────

def relative_position_bucket(relative_position: int, num_buckets: int = 32,
                              max_distance: int = 128) -> int:
    """
    Map a relative position offset to one of num_buckets bias buckets.
    Uses log-scale bucketing for large offsets.
    """
    ret = 0
    n = -relative_position
    is_small = n < num_buckets // 2
    if is_small:
        ret = n
    else:
        max_exact = num_buckets // 2
        val = max_exact + int(
            (np.log(n / max_exact) / np.log(max_distance / max_exact))
            * (num_buckets - max_exact)
        )
        ret = min(val, num_buckets - 1)
    return ret

# ── Demo ──────────────────────────────────────────────────────────────────────

np.random.seed(42)
sentence = "The quick brown fox jumps over the lazy dog near the river bank".split()
inp, tgt = span_corruption(sentence, mask_rate=0.20, mean_span_len=3)

print("T5 Span Corruption Demo")
print("=" * 50)
print(f"Original : {' '.join(sentence)}")
print(f"Input    : {' '.join(inp)}")
print(f"Target   : {' '.join(tgt)}")
print()

# Show relative position buckets
print("Relative Position Buckets (offset -> bucket)")
print("-" * 40)
for offset in [1, 2, 4, 8, 16, 32, 64, 128]:
    bucket = relative_position_bucket(-offset)
    print(f"  offset -{offset:3d}  ->  bucket {bucket}")
`

function PythonContent() {
    return (
        <>
            <p>
                Two implementations from the T5 paper: the span corruption pretraining objective
                (sample random spans, replace with sentinel tokens, reconstruct in the decoder)
                and T5's relative position bucketing function (map query-key offsets to bias
                bucket indices for the relative position bias attention mechanism).
            </p>
            <CodeBlock code={PY_CODE} filename="t5_mechanics.py" lang="python" langLabel="Python" />
        </>
    )
}


// ── Tab content map ───────────────────────────────────────────────────────────

export const T5_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
