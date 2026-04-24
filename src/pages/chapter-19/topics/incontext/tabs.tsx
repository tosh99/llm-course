import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning without gradient descent</h2>
            <p>
                The most surprising finding of GPT-3 was not its scale, but its ability to learn new
                tasks from examples embedded in the prompt. This phenomenon — dubbed <strong>in-context
                learning</strong> — meant the model could adapt to new distributions, formats, and
                reasoning patterns without a single parameter update.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">GPT-2 Zero-Shot Transfer</div>
                    <div className="ch-tl-body">
                        GPT-2 demonstrated that language models could perform some tasks without any
                        task-specific training, but performance was far below supervised baselines.
                        The model needed to be fine-tuned for competitive results.
                    </div>
                    <div className="ch-tl-impact">Impact: Hinted that models were learning implicit task representations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Discovery</div>
                    <div className="ch-tl-title">GPT-3 Few-Shot Learning</div>
                    <div className="ch-tl-body">
                        Brown et al. showed that conditioning GPT-3 on 10–100 examples in the prompt
                        yielded performance competitive with fine-tuned models. The model appeared to
                        "read" the pattern from the examples and generalize to new inputs within the
                        same forward pass.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that gradient-free adaptation was possible at scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">Xie et al. — An Explanation of In-Context Learning</div>
                    <div className="ch-tl-body">
                        Researchers proposed that in-context learning occurs because the pretraining
                        distribution contains a mixture of latent tasks. When shown examples in a prompt,
                        the Bayesian model implicitly locates the relevant task concept and applies it
                        to the query.
                    </div>
                    <div className="ch-tl-impact">Impact: Framed in-context learning as implicit Bayesian inference</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – 2024</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">Chain-of-Thought &amp; Beyond</div>
                    <div className="ch-tl-body">
                        Wei et al. showed that including reasoning steps in few-shot examples dramatically
                        improved performance on math and logic tasks. This "chain-of-thought prompting"
                        leverages in-context learning not just for task recognition, but for step-by-step
                        reasoning patterns.
                    </div>
                    <div className="ch-tl-impact">Impact: Extended in-context learning from pattern matching to algorithmic reasoning</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The puzzle:</strong> In-context learning is not the same as gradient-based
                learning. The model does not update its weights. Instead, it appears to use the
                attention mechanism to compare the query against the provided examples and infer
                the underlying transformation — all within a single forward pass.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Copying the pattern</h2>

            <Analogy label="The Copycat Game">
                Imagine you show a friend three examples: "cat → kitten," "dog → puppy," "horse → foal."
                Then you ask "cow → ?" Your friend instantly says "calf" — not because they were
                taught this exact rule, but because they noticed the pattern. In-context learning is
                exactly that: the model sees examples, notices the pattern, and applies it.
            </Analogy>

            <Analogy label="No Homework Needed">
                Normally, if you wanted a computer to learn a new game, you'd have to teach it with
                thousands of practice rounds (this is fine-tuning). But in-context learning is like
                giving the computer the rulebook and three example turns right before its turn. It
                reads the examples, understands the game, and plays — all in one go.
            </Analogy>

            <Analogy label="The Attention Spotlight">
                Inside the model, attention heads act like spotlights. When the model reads the prompt,
                some spotlights focus on the examples, others on the question. The model compares them,
                finds what changed, and applies the same change to the new question. It's like solving
                a puzzle by looking at the solved pieces first.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Implicit learning from prompt conditioning</h2>

            <h3>What Is In-Context Learning?</h3>
            <p>
                In-context learning (ICL) is the phenomenon where a language model improves its
                performance on a task simply by including task demonstrations in the input prompt,
                without updating any model parameters. The model "learns" the task from the context
                window alone.
            </p>

            <h3>Mechanism</h3>
            <p>
                During the forward pass, self-attention allows every token in the query to attend to
                all tokens in the demonstration examples. The model can therefore:
            </p>
            <ul>
                <li>Compare the query structure to example structures</li>
                <li>Identify input-output mappings and transformations</li>
                <li>Copy relevant patterns, formats, and reasoning steps</li>
                <li>Retrieve relevant factual associations from its pre-trained knowledge</li>
            </ul>

            <h3>Why It Works</h3>
            <p>
                ICL likely emerges because the pretraining corpus contains countless implicit task
                demonstrations. News articles summarize events; FAQs map questions to answers; code
                repositories contain input-output pairs. The model learns to recognize these patterns
                and generalize from small samples.
            </p>

            <h3>Limitations</h3>
            <ul>
                <li><strong>Context window:</strong> Limited to the model's maximum sequence length (~2k for GPT-3)</li>
                <li><strong>Sensitivity:</strong> Performance varies significantly with prompt formatting and example ordering</li>
                <li><strong>Surface patterns:</strong> Models may exploit spurious correlations in the examples</li>
                <li><strong>No true retention:</strong> The "learning" is ephemeral — it vanishes with the next prompt</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key insight:</strong> In-context learning is not generalization in the
                traditional sense. The model does not update its parameters. Instead, it performs
                <em> task inference</em>: given examples, it infers the latent task and applies it
                to the query, much like a Bayesian learner with a strong prior.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Bayesian interpretations and attention dynamics</h2>

            <DefBlock label="In-Context Learning as Implicit Bayesian Inference">
                Xie et al. (2021) model in-context learning as Bayesian inference over a latent
                task variable θ. The pretraining distribution is a mixture over tasks:
                <MathBlock tex="P(x_{1:n}) = \int P(x_{1:n} \mid \theta) \, P(\theta) \, d\theta" />
                Given few-shot examples, the model implicitly computes the posterior over tasks
                and generates the query answer under the most likely task.
            </DefBlock>

            <h3>Attention as Implicit Comparison</h3>
            <p>
                For a query token at position q and example tokens at positions E, the attention
                score measures similarity between the query representation and each example token:
            </p>
            <MathBlock tex="\alpha_{q,e} = \frac{\exp(\mathbf{Q}_q \cdot \mathbf{K}_e / \sqrt{d_k})}{\sum_{e'} \exp(\mathbf{Q}_q \cdot \mathbf{K}_{e'} / \sqrt{d_k})}" />
            <p>
                High attention weights on example tokens indicate the model is referencing them
                to determine the output distribution. This is the computational substrate of
                in-context learning.
            </p>

            <h3>Task Recognition as Latent Variable Inference</h3>
            <p>
                Let the prompt consist of k examples {'{'}(x<sup>(i)</sup>, y<sup>(i)</sup>){'}'} and a query
                x<sup>*</sup>. The model's output distribution can be viewed as:
            </p>
            <MathBlock tex="P(y^* \mid x^*, \text{examples}) = \sum_{\tau} P(y^* \mid x^*, \tau) \, P(\tau \mid \text{examples})" />
            <p>
                where τ ranges over latent task concepts. The model does not explicitly represent
                τ; instead, the attention mechanism computes a soft, implicit mixture over tasks.
            </p>

            <h3>Length Generalization</h3>
            <p>
                A surprising capability of ICL is length generalization: models trained on short
                sequences can, via prompting, generalize to longer reasoning chains. This suggests
                that the model learns compositional rules from the examples rather than memorizing
                surface patterns.
            </p>

            <div className="ch-callout">
                <strong>Attention visualization studies</strong> show that specific attention heads
                specialize in "induction heads" — attending to previous tokens that match the current
                token, enabling pattern completion. These heads are critical for in-context learning
                and emerge primarily in larger models.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Simulated In-Context Learning — NumPy ─────────────────────────────────────

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def in_context_predict(query, examples, temperature=1.0):
    """
    Simulates in-context learning via similarity-weighted averaging.
    
    query:    d-dimensional vector
    examples: list of (input_vec, output_vec) pairs
    """
    inputs = np.stack([ex[0] for ex in examples])
    outputs = np.stack([ex[1] for ex in examples])
    
    # Compute similarities between query and example inputs
    sims = np.array([cosine_sim(query, inp) for inp in inputs])
    
    # Convert to attention-like weights
    scores = sims / temperature
    scores = scores - np.max(scores)  # stability
    weights = np.exp(scores)
    weights = weights / weights.sum()
    
    # Weighted combination of example outputs
    prediction = weights @ outputs
    return prediction, weights

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
dim = 64

# Synthetic examples: each maps a pattern direction to a target direction
examples = [
    (np.random.randn(dim), np.random.randn(dim)),
    (np.random.randn(dim), np.random.randn(dim)),
    (np.random.randn(dim), np.random.randn(dim)),
]

query = np.random.randn(dim)
pred, weights = in_context_predict(query, examples, temperature=0.5)

print("In-Context Learning Simulation")
print("=" * 40)
print(f"Example weights: {weights.round(3).tolist()}")
print(f"Prediction norm: {np.linalg.norm(pred):.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                A simplified NumPy simulation of in-context learning: the query is compared against
                example inputs via cosine similarity, and the output is computed as a weighted average
                of the corresponding example outputs — mimicking how attention aggregates information
                from in-context demonstrations.
            </p>
            <CodeBlock code={PY_CODE} filename="incontext_learning.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const INCONTEXT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
