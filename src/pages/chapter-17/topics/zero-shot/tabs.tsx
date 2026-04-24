import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning without studying</h2>
            <p>
                For decades, machine learning meant collecting labeled examples and training a model
                to map inputs to outputs. But GPT-2 revealed something unexpected: a language model
                trained only to predict the next word could perform translation, summarization,
                question answering, and sentiment analysis — all without ever seeing a single labeled
                example for those tasks. This phenomenon, called <em>zero-shot learning</em>, became
                the defining capability of the large model era.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Pre-2019</div>
                    <div className="ch-tl-section-label">Norm</div>
                    <div className="ch-tl-title">Supervised Fine-Tuning</div>
                    <div className="ch-tl-body">
                        Every NLP task required a dedicated dataset of input-output pairs. Want sentiment
                        analysis? Collect 10,000 movie reviews with star ratings. Want translation?
                        Gather parallel sentences. Models were narrow specialists, and generalization
                        came from architecture, not from the pretraining data.
                    </div>
                    <div className="ch-tl-impact">Impact: High cost and long timelines for every new application</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Feb 2019</div>
                    <div className="ch-tl-section-label">Surprise</div>
                    <div className="ch-tl-title">GPT-2's Emergent Zero-Shot</div>
                    <div className="ch-tl-body">
                        OpenAI discovered that GPT-2 could answer reading comprehension questions,
                        translate between languages, and summarize articles simply by formatting the
                        input as a natural language prompt. No gradient updates, no labeled data —
                        just the knowledge compressed into the model's parameters from pretraining.
                        The field realized that "unsupervised multitask learning" was not just a
                        theoretical possibility but a practical reality.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that scale unlocks implicit task learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">GPT-3 and Few-Shot Prompting</div>
                    <div className="ch-tl-body">
                        GPT-3 scaled the idea further with <em>in-context learning</em>: instead of
                        zero examples, provide a few input-output demonstrations directly in the
                        prompt. Performance improved dramatically. The model wasn't learning during
                        inference (weights are frozen), but it was "reading" the examples and inferring
                        the task pattern — a kind of implicit meta-learning.
                    </div>
                    <div className="ch-tl-impact">Impact: Prompt engineering became a core ML skill</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – 2024</div>
                    <div className="ch-tl-section-label">Maturation</div>
                    <div className="ch-tl-title">Instruction Tuning</div>
                    <div className="ch-tl-body">
                        Pure zero-shot via prompting was brittle: small changes in wording could
                        drastically change outputs. Researchers at Google (FLAN), OpenAI (InstructGPT),
                        and Stanford (Alpaca) showed that fine-tuning on collections of natural
                        language instructions makes zero-shot behavior far more reliable. The model
                        learns to follow the <em>format</em> of instructions, not just infer tasks
                        from examples.
                    </div>
                    <div className="ch-tl-impact">Impact: ChatGPT and modern assistants are built on instruction-tuned zero-shot</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> During pretraining on vast and diverse text, a
                large model encounters millions of implicit task demonstrations. Summarization
                appears in TL;DRs, translation in bilingual text, QA in FAQs. Zero-shot capability
                emerges from this accidental multitask training — the model has effectively "seen"
                the task before, just without explicit labels.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Taking a test you never studied for</h2>

            <Analogy label="The Trivia Night">
                Imagine walking into a trivia contest about movies, history, and science. You never
                specifically studied for this contest. But you've read thousands of books, watched
                documentaries, and listened to podcasts your whole life. When the question comes up,
                you piece together what you know and give a pretty good answer. That's zero-shot
                learning — solving a task using general knowledge, not task-specific practice.
            </Analogy>

            <Analogy label="The Demo Class">
                Now imagine the trivia host gives you three example questions with answers before
                the real round starts. "Movie from 1994: Forrest Gump. Director of Inception:
                Christopher Nolan." You quickly figure out the pattern — name movies and directors.
                That's few-shot learning. You didn't study movies before arriving, but a few examples
                in the moment let you guess the rules.
            </Analogy>

            <Analogy label="The Teacher's Manual">
                Finally, imagine the host hands you a little instruction card: "For each question,
                answer with just the name, no extra words." You follow the format exactly. That's
                instruction tuning — learning to follow directions makes your answers reliable even
                when the task is new.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Zero-shot, few-shot, and in-context learning</h2>

            <h3>Zero-Shot Prompting</h3>
            <p>
                In zero-shot prompting, the model is given a natural language description of the
                task and asked to produce the answer directly. No examples are provided, and no
                model weights are updated. The prompt itself must contain enough information for the
                model to infer the desired behavior.
            </p>
            <ul>
                <li><strong>Example:</strong> "Translate to French: The cat sat on the mat."</li>
                <li><strong>Mechanism:</strong> The model has seen enough bilingual text during
                    pretraining to associate English phrases with French equivalents.</li>
                <li><strong>Limitation:</strong> Highly sensitive to prompt wording. "Translate to
                    French:" may work better than "What is the French for:" depending on what the
                    model saw during training.</li>
            </ul>

            <h3>Few-Shot (In-Context) Learning</h3>
            <p>
                Few-shot prompting prepends a small number (k = 1–64) of input-output demonstrations
                before the actual query. The model's weights are frozen; it "learns" the task pattern
                purely from the context window.
            </p>
            <ul>
                <li><strong>Example:</strong><br />
                    "A terrible movie → negative<br />
                    A masterpiece → positive<br />
                    It was okay →"</li>
                <li><strong>Mechanism:</strong> Attention layers match patterns between the query
                    and the demonstrations, biasing the output distribution toward the demonstrated
                    format.</li>
                <li><strong>Observation:</strong> Performance often improves log-linearly with k up
                    to a point, then saturates.</li>
            </ul>

            <h3>Task Reformulation</h3>
            <p>
                A key technique for zero-shot is casting tasks into language modeling. For multiple
                choice, the model computes the likelihood of each answer choice conditioned on the
                question, then selects the highest. For classification, you can frame it as:
            </p>
            <ul>
                <li>"Review: {'{text}'} Sentiment: {'{label}'}" and score each candidate label.</li>
            </ul>

            <h3>Limitations and Biases</h3>
            <p>
                Zero-shot models inherit and often amplify biases from their training data. They may
                perform poorly on underrepresented languages, cultural contexts, or demographic groups.
                They are also vulnerable to <em>prompt injection</em>: adversarially crafted inputs
                that override the intended task. Reliability remains a major research challenge.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key distinction:</strong> In zero-shot and few-shot prompting, the model's
                weights are never updated. All "learning" happens inside the forward pass through
                the attention mechanism. This is fundamentally different from fine-tuning, where
                gradients modify the parameters.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Likelihood-based zero-shot classification</h2>

            <DefBlock label="Zero-Shot Classification via LM Scoring">
                For a classification task with candidate labels Y = {'{'}y₁, …, y<sub>k</sub>{'}'},
                the zero-shot approach formats the input x and each label as a string s(x, y) and
                selects the label maximizing the conditional log-probability:
            </DefBlock>
            <MathBlock tex="\\hat{y} = \\arg\\max_{y \\in Y} \\log P_{\\theta}(y \\mid x) = \\arg\\max_{y \\in Y} \\sum_{t=1}^{|y|} \\log P_{\\theta}(y_t \\mid x, y_{&lt;t})" />
            <p>
                For autoregressive models like GPT-2, this is natural: we concatenate "x → y" and
                score the likelihood of the continuation y. For encoder-decoder models like T5, we
                feed x to the encoder and score the decoder's generation of y.
            </p>

            <h3>Calibrated Likelihoods</h3>
            <p>
                A naive problem: some labels are inherently more probable under the language model
                (e.g., "positive" may appear more often than "negative" in pretraining data). To
                correct for this, one can use length-normalized or prior-calibrated scores:
            </p>
            <MathBlock tex="\\text{score}(y \\mid x) = \\frac{1}{|y|} \\sum_{t=1}^{|y|} \\log P(y_t \\mid x, y_{&lt;t}) - \\frac{1}{|y|} \\sum_{t=1}^{|y|} \\log P(y_t)" />
            <p>
                The second term subtracts the unconditional log-probability of the label, removing
                the prior bias. This simple calibration often improves zero-shot accuracy by 5–15%.
            </p>

            <h3>Multiple-Choice Ranking</h3>
            <p>
                For multiple choice, concatenate the question and each answer choice, then rank by
                the average per-token log-probability of the full sequence. Formally, for choices
                {'{'}c₁, …, c<sub>k</sub>{'}'}:
            </p>
            <MathBlock tex="\\hat{c} = \\arg\\max_{c_i} \\frac{1}{|s_i|} \\sum_{t=1}^{|s_i|} \\log P(w_t^{(i)} \\mid w_{&lt;t}^{(i)})" />
            <p>
                Where s<sub>i</sub> = [question; c<sub>i</sub>] is the concatenated sequence. This
                is how GPT-2 and early GPT-3 were evaluated on tasks like StoryCloze and RACE.
            </p>

            <div className="ch-callout">
                <strong>Why it works:</strong> During pretraining, the model learns a rich conditional
                distribution P(text) over natural language. Any task that can be expressed as text
                generation can therefore be reduced to querying this distribution. The model isn't
                "solving" the task in a structured way — it's asking "which completion looks most
                like the text I've seen?"
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Zero-Shot Classification via LM Scoring ───────────────────────────────────

def zero_shot_classify(prompt, choices, score_fn):
    """
    prompt: input text (string)
    choices: list of candidate label strings
    score_fn: callable that takes (prompt, choice) -> log-prob score
    Returns the highest-scoring choice.
    """
    scores = [score_fn(prompt, c) for c in choices]
    best = np.argmax(scores)
    return choices[best], scores

# ── Dummy language model scorer (replace with real model) ──────────────────────
def dummy_score(prompt, choice):
    """Toy scorer: prefer choices that share more words with prompt."""
    prompt_words = set(prompt.lower().split())
    choice_words = set(choice.lower().split())
    overlap = len(prompt_words & choice_words)
    return overlap + np.random.normal(0, 0.1)

# ── Demo ──────────────────────────────────────────────────────────────────────
prompt = "The movie was absolutely wonderful and inspiring."
choices = ["positive", "negative", "neutral"]

best, scores = zero_shot_classify(prompt, choices, dummy_score)

print("Zero-Shot Classification Demo")
print("=" * 40)
print(f"Prompt: {prompt}")
for c, s in zip(choices, scores):
    marker = " <--" if c == best else ""
    print(f"  {c:10s} score={s:.3f}{marker}")
`

function PythonTab() {
    return (
        <>
            <p>
                Python skeleton for zero-shot classification via likelihood scoring: score each
                candidate label against the input prompt and return the highest-scoring choice.
            </p>
            <CodeBlock code={PY_CODE} filename="zero_shot.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Zero-Shot Classification — TypeScript ────────────────────────────────────

function zeroShotClassify(
    prompt: string,
    choices: string[],
    scoreFn: (prompt: string, choice: string) => number
): { best: string; scores: number[] } {
    const scores = choices.map((c) => scoreFn(prompt, c))
    const bestIdx = scores.indexOf(Math.max(...scores))
    return { best: choices[bestIdx], scores }
}

// Dummy scorer for demo
function dummyScore(prompt: string, choice: string): number {
    const pWords = new Set(prompt.toLowerCase().split(/\\s+/))
    const cWords = new Set(choice.toLowerCase().split(/\\s+/))
    let overlap = 0
    for (const w of cWords) if (pWords.has(w)) overlap++
    return overlap + (Math.random() - 0.5) * 0.2
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const prompt = "The movie was absolutely wonderful and inspiring."
const choices = ["positive", "negative", "neutral"]

const { best, scores } = zeroShotClassify(prompt, choices, dummyScore)

console.log("Zero-Shot Classification Demo")
console.log("=".repeat(40))
console.log(\`Prompt: \${prompt}\`)
choices.forEach((c, i) => {
    const marker = c === best ? " <--" : ""
    console.log(\`  \${c.padEnd(10)} score=\${scores[i].toFixed(3)}\${marker}\`)
})
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of zero-shot classification via prompt scoring, with a
                pluggable scoring function that can be swapped for a real language model inference
                call.
            </p>
            <CodeBlock code={TS_CODE} filename="zero_shot.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ZERO_SHOT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
