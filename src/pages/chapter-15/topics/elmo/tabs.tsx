import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
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
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">Word2Vec &amp; Static Embeddings</div>
                    <div className="ch-tl-body">
                        Mikolov's Word2Vec proved that words could be represented as dense vectors where
                        semantic relationships became arithmetic (king - man + woman ≈ queen). But each word
                        had exactly one vector. Homonyms, polysemes, and words with context-dependent meanings
                        were forced into a single point in space.
                    </div>
                    <div className="ch-tl-impact">Impact: Powerful but fundamentally limited by context independence</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Predecessor</div>
                    <div className="ch-tl-title">CoVe — Contextualized Vectors</div>
                    <div className="ch-tl-body">
                        McCann et al. used a neural machine translation encoder to produce context-dependent
                        vectors. The idea was sound, but the approach was tied to a specific translation
                        dataset and encoder architecture. The embeddings were not easily portable to arbitrary
                        NLP tasks.
                    </div>
                    <div className="ch-tl-impact">Impact: Proof of concept, but not a general-purpose solution</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Peters et al. — ELMo</div>
                    <div className="ch-tl-body">
                        In "Deep contextualized word representations" (NAACL 2018), Peters introduced a
                        bidirectional language model trained on a large corpus. The key insight: instead of
                        using the top layer, ELMo takes a <em>weighted combination of all layer representations</em>,
                        learned task-specifically. Lower layers capture syntax; upper layers capture semantics.
                        The task-specific weights let downstream models decide which layers matter most.
                    </div>
                    <div className="ch-tl-impact">Impact: Massive improvements on NLP benchmarks; the foundation for all contextualized embeddings</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2019</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">ELMo Becomes the New Baseline</div>
                    <div className="ch-tl-body">
                        ELMo embeddings were adopted across the NLP community. On SQuAD, ELMo improved the
                        state-of-the-art by 4.7 points. On sentiment analysis, it cut error by 20-25%. The
                        approach was simple: replace your static embeddings with ELMo, keep the rest of your
                        model the same. It worked because ELMo's representations were deep, bidirectional,
                        and character-based — capturing morphology and syntax without a fixed vocabulary.
                    </div>
                    <div className="ch-tl-impact">Impact: ELMo became the default embedding method before BERT superseded it</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Different layers of a deep language model encode different
                kinds of information. A weighted sum of all layers, with task-specific weights, produces
                richer representations than any single layer alone.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A word with many costumes</h2>

            <Analogy label="The Paper Doll (Static Embedding)">
                Imagine every word is a paper doll with one outfit. "Bank" always wears a gray suit,
                whether you're talking about a river or money. Sometimes the outfit sort of fits, but
                often it's completely wrong. That's a static embedding — one look for every situation.
            </Analogy>

            <Analogy label="The Actor (ELMo)">
                ELMo is like a brilliant actor who reads the whole script before deciding how to play
                each line. When the actor sees "bank" in a sentence about rivers, they wear hiking boots
                and carry a fishing rod. When they see "bank" in a sentence about money, they wear a
                business suit. The costume changes based on the entire scene, not just the one word.
            </Analogy>

            <Analogy label="The Director's Cut">
                But ELMo doesn't just pick one costume. It tries on outfits from every layer of its
                experience — childhood memories, teenage training, adult wisdom — and blends them together
                for each specific job. Some tasks need more childhood innocence (basic grammar), while
                others need adult wisdom (deep meaning). The blending is learned for each task separately.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Bidirectional language modeling with deep representations</h2>

            <h3>Architecture</h3>
            <p>
                ELMo uses a <em>bidirectional language model</em> built from two stacked LSTMs. The forward
                LM predicts the next word left-to-right; the backward LM predicts the previous word
                right-to-left. Both share the same character CNN and token embedding layer but have
                separate LSTM parameters.
            </p>

            <h3>Character CNN</h3>
            <p>
                Instead of a fixed word vocabulary, ELMo represents words as sequences of characters.
                A character-level CNN with highway layers converts each word into a fixed-size vector.
                This means ELMo handles out-of-vocabulary words naturally — it has never seen "supercalifragilistic"
                but can construct a reasonable embedding from its character composition.
            </p>

            <h3>Layer Representations</h3>
            <p>
                For word j at layer k, we have a forward hidden state <InlineMath tex="\overrightarrow{\mathbf{h}}_{j,k}" /> and
                a backward hidden state <InlineMath tex="\overleftarrow{\mathbf{h}}_{j,k}" />. These are concatenated:
            </p>
            <MathBlock tex="\mathbf{h}_{j,k} = [\overrightarrow{\mathbf{h}}_{j,k}; \overleftarrow{\mathbf{h}}_{j,k}]" />

            <h3>Task-Specific Weighting</h3>
            <p>
                For a downstream task, ELMo computes a weighted combination across all L layers plus
                a scalar parameter for task-specific scaling:
            </p>
            <MathBlock tex="\mathbf{ELMo}_j^{\text{task}} = \gamma^{\text{task}} \sum_{k=0}^{L} s_k^{\text{task}} \mathbf{h}_{j,k}" />
            <p>
                Here s<sub>k</sub> are softmax-normalized weights learned for the task, and γ is a scalar
                that lets the task scale the entire ELMo vector up or down. k=0 is the character CNN layer.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key difference from CoVe:</strong> CoVe used a translation encoder and only the top
                layer. ELMo trains a <em>pure language model</em> and uses <em>all layers</em> with learned
                weights. This makes ELMo more general (any language, any corpus) and more expressive
                (hierarchical feature extraction).
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal specification and layer combination</h2>

            <DefBlock label="Bidirectional Language Model">
                Given a sequence of N tokens (t<sub>1</sub>, …, t<sub>N</sub>), a forward language model
                computes the probability by factorizing left-to-right:
                <MathBlock tex="p(t_1, \dots, t_N) = \prod_{j=1}^{N} p(t_j \mid t_1, \dots, t_{j-1})" />
                A backward language model factorizes right-to-left:
                <MathBlock tex="p(t_1, \dots, t_N) = \prod_{j=1}^{N} p(t_j \mid t_{j+1}, \dots, t_N)" />
                The bidirectional LM objective maximizes the log-likelihood of both directions:
                <MathBlock tex="\sum_{j=1}^{N} \bigl( \log p(t_j \mid t_1, \dots, t_{j-1}; \Theta_x, \overrightarrow{\Theta}_{\text{LSTM}}, \Theta_s) + \log p(t_j \mid t_{j+1}, \dots, t_N; \Theta_x, \overleftarrow{\Theta}_{\text{LSTM}}, \Theta_s) \bigr)" />
            </DefBlock>

            <h3>Character CNN Encoding</h3>
            <p>
                Let C<sub>j</sub> be the matrix of character embeddings for word j. A narrow convolution
                with filters of width w produces feature maps, which are max-pooled and passed through
                highway layers to produce the word representation x<sub>j</sub>:
            </p>
            <MathBlock tex="\mathbf{x}_j = \text{Highway}(\text{MaxPool}(\text{Conv1D}(\mathbf{C}_j)))" />

            <h3>ELMo Representation</h3>
            <p>
                For each position j and layer k, we concatenate forward and backward LSTM states. The
                task-specific ELMo vector is:
            </p>
            <MathBlock tex="\mathbf{ELMo}_j^{\text{task}} = \gamma^{\text{task}} \sum_{k=0}^{L} s_k^{\text{task}} \mathbf{h}_{j,k}" />
            <p>
                The weights s<sub>k</sub> are softmax-normalized:
            </p>
            <MathBlock tex="s_k^{\text{task}} = \frac{\exp(w_k^{\text{task}})}{\sum_{k'=0}^{L} \exp(w_{k'}^{\text{task}})}" />
            <p>
                Both γ and w<sub>k</sub> are learned during task fine-tuning while the LM parameters
                remain frozen.
            </p>

            <h3>Downstream Integration</h3>
            <p>
                For a task with input (x<sub>1</sub>, …, x<sub>N</sub>), the baseline model produces
                context-independent token representations x<sub>k</sub>. ELMo enhances these by
                concatenation:
            </p>
            <MathBlock tex="[\mathbf{x}_k; \mathbf{ELMo}_k^{\text{task}}]" />
            <p>
                Alternatively, ELMo can be added (x<sub>k</sub> + ELMo<sub>k</sub>) or interpolated.
                The concatenation approach is most common and consistently outperforms static embeddings.
            </p>

            <div className="ch-callout">
                <strong>Empirical observation:</strong> On coreference resolution, lower ELMo layers
                contribute more (syntax-heavy task). On textual entailment, upper layers contribute
                more (semantics-heavy). The learned weights s<sub>k</sub> automatically discover these
                preferences without human supervision.
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
    layer_reps: list of L+1 vectors, one per layer
    task_weights: raw weights w_k for each layer
    gamma: task-specific scale
    """
    s = softmax(task_weights)
    elmo = gamma * sum(s_k * h_k for s_k, h_k in zip(s, layer_reps))
    return elmo

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

# Simulate 3-layer BiLSTM: layer 0 = char CNN, 1-2 = LSTM layers
layer_reps = [
    np.random.randn(128),  # char CNN
    np.random.randn(256),  # LSTM layer 1 (bidirectional -> 2*128)
    np.random.randn(256),  # LSTM layer 2
]

# Task A: syntax-heavy (favors lower layers)
weights_syntax = np.array([2.0, 0.5, 0.1])
elmo_syntax = elmo_vector(layer_reps, weights_syntax, gamma=0.8)

# Task B: semantics-heavy (favors upper layers)
weights_semantic = np.array([0.1, 0.8, 2.0])
elmo_semantic = elmo_vector(layer_reps, weights_semantic, gamma=1.2)

print("ELMo Layer Weighting Demo")
print("=" * 45)
print(f"Syntax task weights (softmax): {softmax(weights_syntax).round(3)}")
print(f"Semantic task weights (softmax): {softmax(weights_semantic).round(3)}")
print()
print(f"ELMo vector norm (syntax) : {np.linalg.norm(elmo_syntax):.4f}")
print(f"ELMo vector norm (semantic): {np.linalg.norm(elmo_semantic):.4f}")
print()
print("Lower layers dominate for syntax; upper layers for semantics.")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy demonstration of ELMo's task-specific layer weighting. The demo shows how different
                tasks can learn to emphasize different layers of a bidirectional language model.
            </p>
            <CodeBlock code={PY_CODE} filename="elmo_weights.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── ELMo-style Layer Weighting — TypeScript ──────────────────────────────────

type Vec = number[]

function softmax(x: number[]): number[] {
    const maxVal = Math.max(...x)
    const exp = x.map(v => Math.exp(v - maxVal))
    const sum = exp.reduce((a, b) => a + b, 0)
    return exp.map(v => v / sum)
}

function vecScale(v: Vec, s: number): Vec {
    return v.map(x => x * s)
}

function vecAdd(a: Vec, b: Vec): Vec {
    return a.map((ai, i) => ai + b[i])
}

function elmoVector(
    layerReps: Vec[],
    taskWeights: number[],
    gamma = 1.0
): Vec {
    const s = softmax(taskWeights)
    let result = Array(layerReps[0].length).fill(0)
    for (let k = 0; k < layerReps.length; k++) {
        result = vecAdd(result, vecScale(layerReps[k], s[k] * gamma))
    }
    return result
}

function vecNorm(v: Vec): number {
    return Math.sqrt(v.reduce((s, x) => s + x * x, 0))
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const rng = () => (Math.random() - 0.5) * 2

const layerReps: Vec[] = [
    Array.from({ length: 128 }, rng),  // char CNN
    Array.from({ length: 256 }, rng),  // LSTM 1
    Array.from({ length: 256 }, rng),  // LSTM 2
]

const weightsSyntax = [2.0, 0.5, 0.1]
const weightsSemantic = [0.1, 0.8, 2.0]

const elmoSyntax = elmoVector(layerReps, weightsSyntax, 0.8)
const elmoSemantic = elmoVector(layerReps, weightsSemantic, 1.2)

console.log("ELMo Layer Weighting Demo")
console.log("─".repeat(45))
console.log(\`Syntax weights:    [\${softmax(weightsSyntax).map(v => v.toFixed(3)).join(", ")}]\`)
console.log(\`Semantic weights:  [\${softmax(weightsSemantic).map(v => v.toFixed(3)).join(", ")}]\`)
console.log(\`Syntax norm:       \${vecNorm(elmoSyntax).toFixed(4)}\`)
console.log(\`Semantic norm:     \${vecNorm(elmoSemantic).toFixed(4)}\`)
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of ELMo's weighted layer combination. The demo generates random
                layer representations and shows how syntax-favoring vs. semantics-favoring tasks produce
                different weighted combinations.
            </p>
            <CodeBlock code={TS_CODE} filename="elmo_weights.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ELMO_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
