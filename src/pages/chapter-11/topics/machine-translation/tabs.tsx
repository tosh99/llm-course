import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From rule books to neural networks: 70 years of machine translation</h2>
            <p>
                Machine translation is the oldest applied AI problem — predating the term "artificial
                intelligence" itself. Its history is a series of paradigm shifts, each overturning
                the previous approach. Understanding that history makes the 2014 seq2seq revolution
                legible: it was not just an improvement, it was the culmination of decades of failed
                attempts to engineer what a neural network would simply learn.
            </p>

            <div className="ch11-timeline">
                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">1949</div>
                    <div className="ch11-tl-section-label">Origins</div>
                    <div className="ch11-tl-title">Warren Weaver's memorandum — first MT proposal</div>
                    <div className="ch11-tl-body">
                        Weaver, a Rockefeller Foundation executive, circulated a memo proposing that
                        translation could be solved with cryptography techniques (decode foreign language
                        as a cipher of English) and information theory. The memo launched the field and
                        attracted US government funding during the Cold War, when translating Soviet
                        documents at scale was a national security priority.
                    </div>
                    <div className="ch11-tl-impact">Impact: Founded the machine translation research field</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">1966</div>
                    <div className="ch11-tl-section-label">Crisis</div>
                    <div className="ch11-tl-title">ALPAC Report — US government cuts MT funding</div>
                    <div className="ch11-tl-body">
                        The Automatic Language Processing Advisory Committee concluded that MT was slower,
                        less accurate, and twice as expensive as human translation. It recommended cutting
                        all MT research funding. The report nearly killed the field for a decade, but
                        motivated a shift away from rule-based systems toward statistical approaches —
                        eventually.
                    </div>
                    <div className="ch11-tl-impact">Impact: Triggered a decade-long winter for MT research</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">1993</div>
                    <div className="ch11-tl-section-label">Statistical MT</div>
                    <div className="ch11-tl-title">IBM Models — Brown et al. — statistical word alignment</div>
                    <div className="ch11-tl-body">
                        Peter Brown and colleagues at IBM published the IBM alignment models (Models 1–5),
                        framing MT as a statistical problem: given observed parallel text, estimate the
                        probability that each source word generates each target word. This introduced
                        the noisy-channel model: P(target | source) ∝ P(source | target) × P(target).
                        The era of statistical MT (SMT) had begun.
                    </div>
                    <div className="ch11-tl-impact">Impact: Founded statistical MT; the noisy-channel model dominated for two decades</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">2003–2006</div>
                    <div className="ch11-tl-section-label">Phrase-based SMT</div>
                    <div className="ch11-tl-title">Moses & phrase-based SMT — Koehn et al.</div>
                    <div className="ch11-tl-body">
                        Phrase-based SMT (PBSMT) replaced word-to-word alignment with phrase-to-phrase
                        translation, dramatically improving fluency. Philipp Koehn's Moses became the
                        open-source standard. Google Translate launched in 2006 on top of PBSMT, processing
                        hundreds of language pairs using vast parallel corpora collected from the web.
                        PBSMT was a carefully engineered pipeline: tokenization, alignment, phrase extraction,
                        language model, decoder, reranker.
                    </div>
                    <div className="ch11-tl-impact">Impact: PBSMT dominated commercial MT for a decade</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">September 2014</div>
                    <div className="ch11-tl-section-label">Neural revolution</div>
                    <div className="ch11-tl-title">Sutskever et al. — neural MT competitive with PBSMT</div>
                    <div className="ch11-tl-body">
                        On WMT14 English→French, the LSTM seq2seq model achieved 34.8 BLEU (5-model
                        ensemble), directly competitive with a heavily-tuned PBSMT system that had years
                        of engineering. The neural model used no hand-crafted features, no linguistic
                        rules, and no alignment model — just raw parallel text and gradient descent.
                    </div>
                    <div className="ch11-tl-impact">Impact: Proved neural MT could reach PBSMT performance; shifted the entire field</div>
                </div>

                <div className="ch11-tl-item">
                    <div className="ch11-tl-year">2016</div>
                    <div className="ch11-tl-section-label">Industry transition</div>
                    <div className="ch11-tl-title">Google Neural MT — PBSMT retired in production</div>
                    <div className="ch11-tl-body">
                        Google deployed its Neural Machine Translation system, replacing PBSMT for most
                        language pairs. GNMT used an 8-layer LSTM encoder-decoder with attention, residual
                        connections, and a mixed word/character vocabulary. For Chinese→English, translation
                        errors dropped by 60%. Academic MT research pivoted almost entirely to neural methods.
                    </div>
                    <div className="ch11-tl-impact">Impact: End of the PBSMT era; neural MT became the industry standard</div>
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
                Old translation software worked like a dictionary + grammar book. For every word in
                English, it had a list of possible French words. For "cat" → "chat". For "the" → "le/la/les".
                Then it used grammar rules to reorder and conjugate everything.
                <br /><br />
                The problem: language doesn't work like a dictionary. "I have a cold" means I'm sick,
                not that I possess a cold object. You can't translate idioms word-by-word. And grammar
                rules have hundreds of exceptions. Engineers spent years writing rule after rule — and
                still made embarrassing mistakes.
            </Analogy>

            <Analogy label="The Learning Approach (New Way)">
                Neural MT doesn't use a dictionary or grammar rules. Instead, it trains on millions of
                pairs of translated sentences written by human translators: every EU Parliament speech
                in 23 languages, every UN document in 6 languages, every translated Wikipedia article.
                <br /><br />
                From these examples, the neural network figures out the rules by itself. It learns
                what "I have a cold" should translate to by seeing hundreds of examples where a native
                speaker chose those words. It learns word order by seeing thousands of sentence pairs
                where French and English differ. No one programs the rules — the network discovers them.
            </Analogy>

            <Analogy label="How Good Does It Get?">
                Neural MT is now remarkably good for common language pairs — the kind of thing you use
                Google Translate for every day. For rare language pairs with less training data, it still
                struggles. And it still makes mistakes that no human would make: translating a specific
                technical term wrong, or missing cultural nuance. But for everyday use? It went from
                embarrassing to genuinely useful between 2014 and 2018 — purely because of neural MT.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The MT pipeline: data, training, decoding, evaluation</h2>

            <h3>Parallel Corpora</h3>
            <p>
                Neural MT requires parallel corpora: datasets of sentence pairs in source and target
                language. Common sources include:
            </p>
            <ul>
                <li><strong>WMT datasets:</strong> Annual shared task with standardized train/test splits. WMT14 En-Fr has ~36M sentence pairs.</li>
                <li><strong>UN Parallel Corpus:</strong> 6 official UN languages, ~11M sentences per language pair.</li>
                <li><strong>Europarl:</strong> EU Parliament proceedings in 21 European languages.</li>
                <li><strong>Common Crawl translations:</strong> Web-crawled parallel text (noisy but large).</li>
            </ul>
            <p>
                Data quality matters enormously. A million clean sentence pairs outperforms
                ten million noisy pairs. Data filtering — removing misaligned, too-short, or
                duplicate pairs — is a major preprocessing step.
            </p>

            <h3>Beam Search Decoding</h3>
            <p>
                During inference, the decoder generates tokens one at a time. Greedy decoding
                (always pick the highest-probability token) is fast but suboptimal — a locally
                good choice may lead to a globally bad sequence. Beam search maintains the top-k
                partial sequences ("beams") at each step:
            </p>
            <ul>
                <li>Start with one beam: &lt;SOS&gt;</li>
                <li>At each step, expand all k beams by considering every vocabulary token</li>
                <li>Keep the k candidates with highest cumulative log-probability</li>
                <li>Stop when all beams have generated &lt;EOS&gt;</li>
                <li>Return the highest-scoring complete beam</li>
            </ul>
            <p>
                Typical beam size k = 4 to 10. Larger k improves quality but increases compute
                linearly. k=1 is greedy decoding; k=∞ is exact search (intractable).
            </p>

            <h3>BLEU Score Evaluation</h3>
            <p>
                Bilingual Evaluation Understudy (BLEU) is the standard automatic MT metric.
                It measures how much the model's output overlaps with human reference translations,
                using n-gram precision (1-gram through 4-gram overlap):
            </p>
            <ul>
                <li>Higher BLEU = more similar to human translations</li>
                <li>Range: 0 (no overlap) to 100 (identical to reference)</li>
                <li>Typical good MT: 30–45 BLEU on standard benchmarks</li>
                <li>Perfect human-level: ~60+ BLEU (humans don't always agree either)</li>
            </ul>

            <div className="ch11-callout">
                <strong>BLEU limitations:</strong> BLEU measures surface n-gram overlap, not meaning.
                A translation can be semantically correct but use different synonyms and score poorly.
                Modern MT evaluation increasingly uses neural metrics (BERTScore, COMET) that
                measure semantic similarity rather than exact word overlap. But BLEU remains the
                dominant metric for historical comparability.
            </div>
        </>
    )
}

function MathsTab() {
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
                Beam search maximises this log-probability sum, subject to the constraint that only
                k candidates are kept at each step. Length normalization is often applied to prevent
                the search from preferring shorter sequences:
            </p>
            <MathBlock tex="\text{score}(y) = \frac{1}{T'^\alpha} \sum_{t=1}^{T'} \log P(y_t \mid y_{<t},\, x), \quad \alpha \in [0.6, 0.8]" />

            <h3>BLEU Score</h3>
            <MathBlock tex="\text{BLEU} = \text{BP} \cdot \exp\!\left(\sum_{n=1}^{N} w_n \log p_n\right)" />
            <p>
                Where:
            </p>
            <ul>
                <li><strong>p<sub>n</sub></strong> = modified n-gram precision: fraction of model's n-grams that appear in any reference, with clipping to prevent repetition gaming</li>
                <li><strong>w<sub>n</sub></strong> = 1/N (usually N=4, so w<sub>n</sub> = 0.25)</li>
                <li><strong>BP</strong> = brevity penalty = exp(1 − r/c) if c &lt; r, else 1 (penalises translations shorter than reference)</li>
                <li>r = reference length, c = candidate length</li>
            </ul>
            <MathBlock tex="p_n = \frac{\sum_{\mathbf{s} \in \text{cand}} \sum_{\text{ngram} \in \mathbf{s}} \min(\text{Count}(\text{ngram}, \mathbf{s}),\, \text{Count}_{\text{ref}}(\text{ngram}))}{\sum_{\mathbf{s} \in \text{cand}} \sum_{\text{ngram} \in \mathbf{s}} \text{Count}(\text{ngram}, \mathbf{s})}" />

            <div className="ch11-callout">
                <strong>Why geometric mean?</strong> BLEU uses the geometric mean of n-gram precisions
                (equivalent to exp(∑ w_n log p_n)) rather than the arithmetic mean. This ensures that
                if any n-gram precision is zero (common for 4-grams on short/bad translations), the
                entire score is zero. The geometric mean is a harsher penalty for complete misses.
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
            print(f"  p_{n} = {status}  ← zero! (no {n}-gram overlap)")
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

function PythonTab() {
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

const TS_CODE = `// ── BLEU Score — TypeScript ───────────────────────────────────────────────────

type Ngram = string

function getNgrams(tokens: string[], n: number): Map<Ngram, number> {
  const counts = new Map<Ngram, number>()
  for (let i = 0; i <= tokens.length - n; i++) {
    const key = tokens.slice(i, i + n).join(" ")
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function modifiedPrecision(candidate: string[], references: string[][], n: number): number {
  const candCounts = getNgrams(candidate, n)
  if (candCounts.size === 0) return 0

  // Max count of each n-gram across all references
  const maxRefCounts = new Map<Ngram, number>()
  for (const ref of references) {
    const refCounts = getNgrams(ref, n)
    for (const [ngram] of candCounts) {
      const prev = maxRefCounts.get(ngram) ?? 0
      maxRefCounts.set(ngram, Math.max(prev, refCounts.get(ngram) ?? 0))
    }
  }

  let clipped = 0
  let total = 0
  for (const [ngram, cnt] of candCounts) {
    clipped += Math.min(cnt, maxRefCounts.get(ngram) ?? 0)
    total += cnt
  }
  return total === 0 ? 0 : clipped / total
}

function brevityPenalty(candidate: string[], references: string[][]): number {
  const c = candidate.length
  const r = references.map(ref => ref.length).reduce((best, rLen) =>
    Math.abs(rLen - c) < Math.abs(best - c) ? rLen : best
  )
  return c >= r ? 1.0 : Math.exp(1 - r / c)
}

function bleu(candidate: string[], references: string[][], maxN = 4): number {
  const weights = Array(maxN).fill(1 / maxN)
  const precisions = Array.from({ length: maxN }, (_, i) =>
    modifiedPrecision(candidate, references, i + 1))

  if (precisions.some(p => p === 0)) return 0

  const logAvg = precisions.reduce((s, p, i) => s + weights[i] * Math.log(p), 0)
  return brevityPenalty(candidate, references) * Math.exp(logAvg)
}

// ── Examples ─────────────────────────────────────────────────────────────────

const ref = "the cat sat on the mat".split(" ")

const tests: Array<{ label: string; cand: string[] }> = [
  { label: "Perfect match",     cand: "the cat sat on the mat".split(" ") },
  { label: "One word different", cand: "the cat sat on a mat".split(" ") },
  { label: "Two words different",cand: "a cat sat on a rug".split(" ") },
  { label: "Wrong translation",  cand: "the dog runs fast near house".split(" ") },
]

for (const { label, cand } of tests) {
  const score = bleu(cand, [ref])
  console.log(\`\${label.padEnd(22)} BLEU = \${(score * 100).toFixed(1)}\`)
}`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript BLEU score implementation with modified n-gram precision, clipping,
                and brevity penalty. Run against four candidate translations to see how the
                score degrades as the translation quality decreases.
            </p>
            <CodeBlock code={TS_CODE} filename="bleu_score.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch11-callout">
                <strong>BLEU in context:</strong> A score of 30 BLEU on WMT14 En→Fr was roughly
                equivalent to a strong phrase-based system in 2014. By 2018, Transformer-based
                models exceeded 41 BLEU on the same benchmark. Human-level performance is estimated
                at around 60+ BLEU — but even this is uncertain since human translators often
                differ from each other by 5–10 BLEU points.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const MACHINE_TRANSLATION_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
