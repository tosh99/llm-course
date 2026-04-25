import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From rule books to neural networks: 70 years of machine translation</h2>
            <p>
                Machine translation is the oldest applied AI problem — predating the term "artificial intelligence" itself. Its history is a series of paradigm shifts, each overturning the previous approach. Understanding that history makes the 2014 seq2seq revolution legible: it was not just an improvement, it was the culmination of decades of failed attempts to engineer what a neural network would simply learn.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1949</div>
                    <div className="ch-tl-section-label">Origins</div>
                    <div className="ch-tl-title">Warren Weaver's Memorandum — First MT Proposal</div>
                    <div className="ch-tl-body">
                        <p>
                            Warren Weaver, director of the Rockefeller Foundation's Natural Sciences Division, circulated a visionary memo to 200 colleagues proposing that translation could be solved by analogy with cryptography. A foreign language, he argued, was like a cipher of English — decode the substitution and rearrangement rules and you had the translation. He also noted Shannon's new information theory as a potential mathematical foundation for the problem.
                        </p>
                        <p>
                            The memo attracted substantial US government funding during the Cold War, when translating Soviet scientific and military documents at scale was a national security priority. Georgetown University and IBM ran the first public machine translation demonstration in 1954: 49 carefully chosen Russian sentences were "automatically" translated into English using 250 vocabulary rules and 6 grammar rules. The demonstration was staged — the sentences were selected to work — but it generated enormous press coverage and funding enthusiasm.
                        </p>
                        <p>
                            Over the next decade, the gap between the demo's promises and reality became apparent. Natural language is enormously more complex than cryptography. Words have multiple meanings depending on context. Grammar rules have hundreds of exceptions. Idioms are not compositional. Every solution revealed new layers of complexity beneath. Machine translation proved far harder than it looked.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Founded the machine translation field and attracted the Cold War funding that sustained it through the 1950s and 60s</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1966</div>
                    <div className="ch-tl-section-label">First winter</div>
                    <div className="ch-tl-title">ALPAC Report — US Government Cuts MT Funding</div>
                    <div className="ch-tl-body">
                        <p>
                            The Automatic Language Processing Advisory Committee published a report commissioned by the US government to evaluate MT progress after a decade of investment. The conclusion was damning: MT was twice as expensive as human translation and far less accurate; the field had made insufficient progress; further funding was not justified. The report recommended cutting all support for machine translation and redirecting funds to basic computational linguistics research.
                        </p>
                        <p>
                            The ALPAC report nearly killed the field for a decade. In hindsight, its criticism was fair: rule-based MT systems of the 1960s were genuinely inadequate for real-world translation. They worked well on the narrow domains and carefully chosen sentences used to develop them, but broke down completely on realistic texts with diverse vocabulary, idioms, and domain-specific terminology. The honest lesson was that handcrafted rules could not cover the breadth of natural language.
                        </p>
                        <p>
                            The report inadvertently set the stage for the statistical revolution: it redirected researchers toward studying language properties empirically, building corpora, and thinking probabilistically about linguistic phenomena. The tools and conceptual frameworks developed in this "wilderness period" would power the statistical MT revolution two decades later.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Triggered a decade-long winter for MT research; inadvertently motivated the shift toward statistical and corpus-based methods</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">1988 – 1993</div>
                    <div className="ch-tl-section-label">Statistical revolution</div>
                    <div className="ch-tl-title">IBM Models — Brown et al. — Statistical Word Alignment</div>
                    <div className="ch-tl-body">
                        <p>
                            Peter Brown, Vincent Della Pietra, Stephen Della Pietra, and Robert Mercer at IBM Watson Research built the statistical foundation for modern MT. Their 1993 paper introduced IBM Models 1 through 5: a sequence of probabilistic alignment models of increasing complexity, each specifying how a source sentence "generates" a target sentence through a combination of word translation probabilities and alignment probabilities. The models were trained on parallel corpora (translated document pairs) using the EM algorithm.
                        </p>
                        <p>
                            The key insight was the noisy channel model: instead of directly modeling P(target | source), they decomposed it as P(source | target) × P(target) / P(source). The translation model P(source | target) captures how the target "generates" the observed source (word-by-word alignment), and the language model P(target) ensures the output is fluent. This decomposition made the problem tractable using statistical estimation over large corpora.
                        </p>
                        <p>
                            IBM Model 1 is the simplest: it models each target word as independently generated from any source word with learned probabilities. Models 2–5 add increasingly sophisticated position-aware alignment and fertility models. These became the workhorse of statistical MT alignment for over a decade, and GIZA++ — the open-source implementation of IBM Models — was used in virtually every phrase-based SMT system from 2000 to 2016.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Founded statistical MT with the noisy channel model; GIZA++ alignment was used in nearly every phrase-based SMT system for 15+ years</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2002 – 2007</div>
                    <div className="ch-tl-section-label">Phrase-based SMT</div>
                    <div className="ch-tl-title">Moses, BLEU, and the Phrase-Based Era</div>
                    <div className="ch-tl-body">
                        <p>
                            Word-by-word statistical MT produced fluent-sounding but often grammatically broken output because word translation is too local — it doesn't capture that "I will" becomes "je vais" in French as a phrase, not "je" + "vais" separately. Phrase-based SMT fixed this by extracting phrase translation probabilities from aligned corpora: entire phrases (contiguous word sequences) were aligned and their translation probabilities estimated. This dramatically improved fluency.
                        </p>
                        <p>
                            Philipp Koehn's Moses system became the open-source standard for phrase-based SMT, enabling academic groups worldwide to build competitive MT systems. The WMT (Workshop on Machine Translation) annual shared task standardized evaluation on held-out test sets, creating a reproducible benchmark. BLEU (Papineni et al., 2002) provided the automatic evaluation metric. The combination of Moses, BLEU, and WMT created the research infrastructure that would eventually host the neural MT competitions of 2014–2016.
                        </p>
                        <p>
                            Google Translate launched in 2006 built on phrase-based SMT, processing 640 language pairs using vast parallel corpora collected from the web. The PBSMT pipeline was a carefully engineered system: tokenization, alignment (GIZA++), phrase extraction, language model (SRILM or KenLM), log-linear decoder, and minimum error rate training (MERT) for tuning feature weights. Each component represented years of research. By 2012, PBSMT was mature enough that incremental improvements took years of effort for small BLEU gains.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Phrase-based SMT dominated commercial MT for a decade; Moses + BLEU + WMT created the research ecosystem that neural MT inherited</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">September 2014</div>
                    <div className="ch-tl-section-label">Neural revolution</div>
                    <div className="ch-tl-title">Sutskever et al. — Neural MT Competitive with PBSMT</div>
                    <div className="ch-tl-body">
                        <p>
                            On WMT14 English-to-French, the LSTM seq2seq model achieved 34.8 BLEU (5-model ensemble), directly competitive with a heavily-tuned phrase-based SMT system that had benefited from years of engineering. The neural model used no hand-crafted features, no alignment model, no phrase table — just raw parallel text and gradient descent. The result stunned the MT community, which had expected neural approaches to be a useful component of hybrid systems rather than a standalone replacement.
                        </p>
                        <p>
                            The 2014–2016 period was one of rapid transition. At WMT 2014, PBSMT systems were still dominant. At WMT 2015, NMT systems with attention began to compete seriously. At WMT 2016, NMT systems outperformed all PBSMT baselines across most language pairs. The transition happened faster than almost anyone anticipated because NMT systems improved dramatically with scale — more data, more parameters, more compute — while PBSMT improvements had flattened.
                        </p>
                        <p>
                            Back-translation (Sennrich et al., 2016) accelerated the transition by solving NMT's data hunger problem. Neural MT performs poorly with limited parallel data; back-translation generates synthetic parallel data by translating monolingual target-language text into the source language using an existing MT system. The resulting noisy synthetic source sentences paired with original target sentences dramatically improved NMT quality on low-resource language pairs, enabling neural methods to dominate even where parallel data was scarce.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: Proved neural MT could reach PBSMT performance; triggered the 2014–2016 paradigm shift that ended the phrase-based era</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Industry transition</div>
                    <div className="ch-tl-title">Google Neural MT — PBSMT Retired in Production</div>
                    <div className="ch-tl-body">
                        <p>
                            Google deployed its Neural Machine Translation system (GNMT), replacing PBSMT for most language pairs in production. GNMT used an 8-layer LSTM encoder-decoder with attention, residual connections, and a mixed word/wordpiece vocabulary. For Chinese-to-English, translation errors dropped by 60% compared to the phrase-based system in human side-by-side evaluations. Similar gains were seen across other high-volume language pairs.
                        </p>
                        <p>
                            The business impact was immediate: Google Translate became significantly more useful for everyday use across all supported languages. Users noticed — feedback and usage metrics improved sharply. The transition validated the neural approach not just scientifically but commercially, convincing every major MT vendor (Microsoft, DeepL, Amazon, Baidu) to shift their production systems to neural architectures.
                        </p>
                        <p>
                            Academic MT research pivoted almost entirely to neural methods within a year of GNMT's deployment. The ACL, EMNLP, and NAACL conference programs show the shift clearly: phrase-based SMT papers dominated through 2015, then nearly disappeared in 2017. Research energy moved to NMT-specific problems: handling low-resource languages, domain adaptation, controlling output style, multilingual models that share parameters across dozens of languages simultaneously.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: End of the PBSMT era; neural MT became the industry standard; academic MT research pivoted entirely to neural approaches</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017 – present</div>
                    <div className="ch-tl-section-label">Transformer and beyond</div>
                    <div className="ch-tl-title">Zero-Shot, Multilingual, and LLM-based MT</div>
                    <div className="ch-tl-body">
                        <p>
                            The Transformer (Vaswani et al., 2017) replaced LSTM encoder-decoders as the backbone for NMT and has since extended MT to unprecedented scales. Multilingual models like mT5, M2M-100 (Facebook, 2020), and NLLB (Meta, 2022) support translation between hundreds of language pairs in a single model, with zero-shot translation (between language pairs never seen during training) emerging as a side effect of multilingual training.
                        </p>
                        <p>
                            Large language models like GPT-4 achieve competitive translation quality through in-context learning, with no task-specific training — just a prompt specifying the source language, target language, and the text to translate. This represents yet another paradigm: rather than training a dedicated translation model, translation becomes one capability of a general-purpose model trained on vast multilingual text. The engineering effort moves from model training to prompt engineering and evaluation.
                        </p>
                        <p>
                            The remaining challenges in MT are precisely where the history predicts they would be: low-resource languages (the 6,000+ languages with little parallel data), domain-specific terminology, cultural and pragmatic nuance, and the correlation problem between automatic metrics and human judgment. BLEU, despite its flaws, remains the most widely reported metric 20+ years after its introduction — a monument to the inertia of research benchmarks.
                        </p>
                    </div>
                    <div className="ch-tl-impact">Impact: MT now embedded in general-purpose LLMs; zero-shot multilingual translation across 200+ languages; remaining challenges are low-resource and cultural nuance</div>
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching computers to speak every language</h2>

            <Analogy label="The Dictionary Approach (Old Way)">
                Old translation software worked like a dictionary plus a grammar book. For every word in
                English, it had a list of possible French words. For "cat" → "chat". For "the" → "le/la/les".
                Then it used grammar rules to reorder and conjugate everything.
                <br /><br />
                The problem: language doesn't work like a dictionary. "I have a cold" means I'm sick,
                not that I possess a cold object. You can't translate idioms word-by-word. Engineers
                spent years writing rule after rule — and still made embarrassing mistakes on sentences
                they hadn't anticipated.
            </Analogy>

            <Analogy label="Statistical MT — Learning from Examples">
                The next approach was smarter: instead of writing rules, look at millions of human
                translations and count patterns. If "je suis" appears after "I am" a million times,
                that's probably the right translation. IBM researchers in the early 1990s built
                mathematical models that estimated translation probabilities from huge collections of
                parallel texts — the same documents translated by humans into multiple languages.
                <br /><br />
                This worked better than rules, but it was still phrase-by-phrase. And phrases have
                to be reassembled — language doesn't always have the same word order across languages.
                The resulting system was a complicated pipeline of many separate components.
            </Analogy>

            <Analogy label="The Learning Approach (Neural MT)">
                Neural MT doesn't use a dictionary or grammar rules. Instead, it trains on millions of
                pairs of translated sentences written by human translators: every EU Parliament speech
                in 23 languages, every UN document in 6 languages, every translated Wikipedia article.
                <br /><br />
                From these examples, the neural network figures out the rules by itself. It learns
                what "I have a cold" should translate to by seeing hundreds of examples where a native
                speaker chose those words. It learns word order by seeing thousands of sentence pairs
                where French and English differ. No one programs the rules — the network discovers them.
            </Analogy>

            <Analogy label="Back-Translation — Making More Training Data">
                Neural MT needs lots of parallel text (same sentence in two languages). But for rare
                language pairs, there's not much parallel text available. Back-translation is a clever
                trick: take a million French sentences from the internet, run them through a rough
                French-to-English translation, and use those (rough-English, real-French) pairs as
                extra training data.
                <br /><br />
                The English side is noisy — it's from a machine, not a human. But the French side is
                real and natural. Training on this noisy synthetic data still helps the English-to-French
                model learn better French generation. It's like practicing with imperfect study materials
                — better than nothing, and the real test is on clean data anyway.
            </Analogy>

            <Analogy label="How Good Does It Get?">
                Neural MT is now remarkably good for common language pairs — the kind of thing you use
                Google Translate for every day. For rare language pairs with less training data, it still
                struggles. And it makes mistakes that no human would make: missing cultural nuance,
                translating domain-specific terminology wrong, or producing fluent but semantically wrong
                output. But for everyday use? It went from embarrassing to genuinely useful between
                2014 and 2018 — purely because of neural MT.
            </Analogy>

            <Analogy label="BLEU — How Do You Score a Translation?">
                How do you know if a translation is good? You could ask a human judge — but that's
                expensive. Instead, researchers use BLEU: compare the machine's translation to one or
                more reference translations written by humans and count how many word sequences match.
                <br /><br />
                BLEU is like a strict English teacher: if you write "big dog" but the answer key says
                "large dog," you get zero credit — even though they mean the same thing. It's a rough
                approximation of quality, but it's fast, cheap, and consistent, which is why it's been
                the standard metric for 20+ years despite its well-known flaws.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The MT pipeline: data, training, decoding, evaluation</h2>

            <h3>Parallel Corpora — The Raw Ingredient</h3>
            <p>
                Neural MT requires parallel corpora: datasets of sentence pairs in source and target
                language. Common sources include:
            </p>
            <ul>
                <li><strong>WMT datasets:</strong> Annual shared task with standardized train/test splits. WMT14 En-Fr has ~36M sentence pairs from Common Crawl, Europarl, News Commentary, and UN data.</li>
                <li><strong>Europarl:</strong> EU Parliament proceedings in 21 European languages — ~60M sentence pairs total, highly clean and aligned.</li>
                <li><strong>UN Parallel Corpus:</strong> 6 official UN languages, ~11M sentences per language pair, formal register.</li>
                <li><strong>CCAligned:</strong> Web-crawled parallel text in 100+ languages — large but noisy; requires aggressive filtering.</li>
            </ul>
            <p>
                Data quality matters enormously. A million clean sentence pairs typically outperforms
                ten million noisy pairs. Preprocessing: deduplication, language identification, length
                filtering, alignment scoring, and removal of misaligned pairs are all standard.
            </p>

            <h3>The IBM Models — Statistical Foundation</h3>
            <p>
                IBM Model 1 (the simplest) estimates word-level translation probabilities P(target_word | source_word)
                by expectation-maximization over aligned sentence pairs. The model assumes each target word
                is independently generated from some source word. The likelihood objective:
            </p>
            <MathBlock tex="P(\mathbf{f} \mid \mathbf{e}) = \sum_{\mathbf{a}} \prod_{j=1}^{J} t(f_j \mid e_{a_j})" />
            <p>
                where a is an alignment vector mapping each target word f<sub>j</sub> to a source word e<sub>a_j</sub>.
                The EM algorithm iterates: E-step computes expected alignments, M-step updates t(f|e).
            </p>

            <h3>Beam Search Decoding</h3>
            <p>
                During inference, the decoder generates tokens one at a time. Greedy decoding (always pick
                the highest-probability token) is fast but suboptimal — a locally good choice may lead
                to a globally bad sequence. Beam search maintains the top-k partial sequences:
            </p>
            <ul>
                <li>Start with one beam: &lt;SOS&gt;</li>
                <li>At each step, expand all k beams by considering every vocabulary token</li>
                <li>Keep the k candidates with highest cumulative log-probability</li>
                <li>Stop when all beams have generated &lt;EOS&gt;</li>
                <li>Apply length normalization: divide score by T'<sup>α</sup> (typically α = 0.6–0.8)</li>
                <li>Return the highest-scoring complete beam</li>
            </ul>

            <h3>Back-Translation for Low-Resource Settings</h3>
            <p>
                Sennrich et al. (2016) showed that monolingual target-language text can be used to augment
                parallel training data. A backward model (target → source) is trained on available parallel
                data, then used to translate target-side monolingual text into synthetic source sentences.
                The (synthetic_source, real_target) pairs augment training data:
            </p>
            <ul>
                <li>Backward model: train target → source on existing parallel data</li>
                <li>Translate monolingual target text using backward model to get synthetic source</li>
                <li>Add (synthetic source, real target) pairs to the training corpus</li>
                <li>Train the forward model on combined real + synthetic data</li>
            </ul>

            <h3>BLEU Score Evaluation</h3>
            <p>
                Bilingual Evaluation Understudy (BLEU) is the standard automatic MT metric.
                It measures how much the model's output overlaps with human reference translations,
                using n-gram precision (1-gram through 4-gram overlap) weighted geometrically and
                multiplied by a brevity penalty.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>BLEU limitations:</strong> BLEU measures surface n-gram overlap, not meaning.
                A translation can be semantically correct but use different synonyms and score poorly.
                Modern MT evaluation increasingly uses neural metrics (BERTScore, COMET) that
                measure semantic similarity rather than exact word overlap. But BLEU remains the
                dominant metric for historical comparability — research results from 2002 to present
                can be compared on the same scale.
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
            <h2>Formal MT objective, beam search, and BLEU</h2>

            <DefBlock label="Statistical MT Objective">
                Given a source sentence x, find the target sentence y* that maximises the conditional
                probability: y* = argmax<sub>y</sub> P(y | x). This is approximated via beam search
                since exact search over all possible translations is intractable.
            </DefBlock>

            <h3>Log-Probability Scoring</h3>
            <MathBlock tex="\log P(y \mid x) = \sum_{t=1}^{T'} \log P(y_t \mid y_{<t},\, x)" />
            <p>
                Beam search maximises this log-probability sum. Length normalization prevents preference
                for shorter sequences:
            </p>
            <MathBlock tex="\text{score}(y) = \frac{1}{T'^\alpha} \sum_{t=1}^{T'} \log P(y_t \mid y_{<t},\, x), \quad \alpha \in [0.6, 0.8]" />

            <h3>IBM Model 1 — EM Alignment</h3>
            <MathBlock tex="t^{(k+1)}(f \mid e) = \frac{\sum_{(\mathbf{f},\mathbf{e})} \sum_{j} \delta(f_j = f) \cdot \frac{t^{(k)}(f_j \mid e_{a_j})}{\sum_{i} t^{(k)}(f_j \mid e_i)}}{\sum_{(\mathbf{f},\mathbf{e})} \sum_{j} \sum_i \delta(e_i = e) \cdot \frac{t^{(k)}(f_j \mid e_i)}{\sum_{i'} t^{(k)}(f_j \mid e_{i'})}}" />
            <p>
                The EM update re-estimates translation probabilities based on soft alignment posteriors from the
                previous iteration. After convergence, the Viterbi alignment extracts the single best
                alignment a* = argmax<sub>a</sub> P(a | f, e).
            </p>

            <h3>BLEU Score</h3>
            <MathBlock tex="\text{BLEU} = \text{BP} \cdot \exp\!\left(\sum_{n=1}^{N} w_n \log p_n\right)" />
            <p>Where:</p>
            <ul>
                <li><strong>p<sub>n</sub></strong> = modified n-gram precision with clipping</li>
                <li><strong>w<sub>n</sub></strong> = 1/N (uniform, usually N=4)</li>
                <li><strong>BP</strong> = exp(1 − r/c) if c &lt; r, else 1</li>
            </ul>
            <MathBlock tex="p_n = \frac{\sum_{\mathbf{s}} \sum_{g \in \text{ngrams}(\mathbf{s})} \min\!\left(C_n(g, \mathbf{s}),\; \max_{\mathbf{r}} C_n(g, \mathbf{r})\right)}{\sum_{\mathbf{s}} \sum_{g \in \text{ngrams}(\mathbf{s})} C_n(g, \mathbf{s})}" />

            <div className="ch-callout">
                <strong>Why geometric mean?</strong> BLEU uses the geometric mean of n-gram precisions
                (equivalent to exp(∑ w_n log p_n)) rather than the arithmetic mean. This ensures that
                if any n-gram precision is zero (common for 4-grams on short or bad translations), the
                entire BLEU score is zero. The geometric mean is a harsher penalty for complete misses
                than the arithmetic mean, preventing models from gaming the metric on low-order n-grams.
            </div>
        </>
    )
}

const PY_CODE = `from collections import Counter
import math

# ── BLEU Score Implementation ─────────────────────────────────────────────────

def get_ngrams(tokens, n):
    """Return Counter of n-grams in token list."""
    return Counter(tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1))

def modified_precision(candidate, references, n):
    """Compute clipped n-gram precision p_n."""
    cand_ngrams = get_ngrams(candidate, n)
    if not cand_ngrams:
        return 0.0

    # For each n-gram in candidate, max count across all references
    max_ref_counts = Counter()
    for ref in references:
        ref_ngrams = get_ngrams(ref, n)
        for ngram in cand_ngrams:
            max_ref_counts[ngram] = max(max_ref_counts[ngram], ref_ngrams[ngram])

    # Clipped count: min(candidate count, max reference count)
    clipped = sum(min(cnt, max_ref_counts[ng]) for ng, cnt in cand_ngrams.items())
    total   = sum(cand_ngrams.values())
    return clipped / total

def brevity_penalty(candidate, references):
    """Compute brevity penalty BP."""
    c = len(candidate)
    # Reference length: closest length to candidate
    r = min((abs(len(ref) - c), len(ref)) for ref in references)[1]
    return 1.0 if c >= r else math.exp(1 - r / c)

def bleu(candidate, references, max_n=4, weights=None):
    """Compute corpus BLEU score (sentence-level for simplicity)."""
    if weights is None:
        weights = [1.0 / max_n] * max_n

    precisions = []
    for n in range(1, max_n + 1):
        p = modified_precision(candidate, references, n)
        precisions.append(p)
        status = f"{p:.4f}"
        if p == 0:
            print(f"  p_{n} = {status}  <- zero! (no {n}-gram overlap)")
        else:
            print(f"  p_{n} = {status}")

    bp = brevity_penalty(candidate, references)
    print(f"  BP   = {bp:.4f}")

    # Geometric mean via log sum
    if any(p == 0 for p in precisions):
        return 0.0
    log_avg = sum(w * math.log(p) for w, p in zip(weights, precisions))
    return bp * math.exp(log_avg)

# ── Examples ──────────────────────────────────────────────────────────────────

print("=" * 60)
print("Example 1: Perfect translation")
print("=" * 60)
ref  = "the cat sat on the mat".split()
cand = "the cat sat on the mat".split()
score = bleu(cand, [ref])
print(f"BLEU = {score:.4f}\\n")

print("=" * 60)
print("Example 2: Near-perfect (one word different)")
print("=" * 60)
ref  = "the cat sat on the mat".split()
cand = "the cat sat on a mat".split()
score = bleu(cand, [ref])
print(f"BLEU = {score:.4f}\\n")

print("=" * 60)
print("Example 3: Wrong translation")
print("=" * 60)
ref  = "the cat sat on the mat".split()
cand = "the dog runs fast near house".split()
score = bleu(cand, [ref])
print(f"BLEU = {score:.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                A from-scratch BLEU score implementation showing modified n-gram precision,
                clipping, and brevity penalty — three examples ranging from perfect to wrong
                translations to build intuition for what the metric measures.
            </p>
            <CodeBlock code={PY_CODE} filename="bleu_score.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const MACHINE_TRANSLATION_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
