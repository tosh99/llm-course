import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The spectrum from zero to few-shot</h2>
            <p>
                GPT-3 introduced a clean taxonomy for evaluating large language models based on how
                many examples they are given at test time: <strong>zero-shot</strong> (task description
                only), <strong>one-shot</strong> (one example), and <strong>few-shot</strong> (multiple
                examples). This framework became the standard for measuring emergent abilities.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Vinyals et al. — Matching Networks</div>
                    <div className="ch-tl-body">
                        Matching Networks proposed learning to learn from a small support set,
                        using attention to compare query examples against labeled prototypes.
                        This was an early formalization of few-shot learning in deep learning.
                    </div>
                    <div className="ch-tl-impact">Impact: Established few-shot learning as a distinct paradigm</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Radford et al. — GPT-2 Zero-Shot</div>
                    <div className="ch-tl-body">
                        GPT-2 showed that large language models could perform some tasks with zero
                        task-specific examples, but results were generally weak. The question remained:
                        how many examples were needed to reach competitive performance?
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated the zero-shot potential of language models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Brown et al. — The Few-Shot Taxonomy</div>
                    <div className="ch-tl-body">
                        The GPT-3 paper systematically compared zero-shot, one-shot, and few-shot
                        performance across dozens of tasks. The results revealed a consistent trend:
                        more examples almost always improved performance, with few-shot often matching
                        or exceeding fine-tuned baselines.
                    </div>
                    <div className="ch-tl-impact">Impact: Created the standard evaluation framework for LLMs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Analysis</div>
                    <div className="ch-tl-title">Min et al. — Rethinking the Role of Demonstrations</div>
                    <div className="ch-tl-body">
                        Min et al. shocked the field by showing that even <em>random labels</em> in
                        few-shot examples improved performance over zero-shot. This suggested that
                        much of few-shot gains come from revealing the <em>label space</em> and
                        <em>input distribution</em>, not from true learning of input-label mappings.
                    </div>
                    <div className="ch-tl-impact">Impact: Revealed that few-shot prompting is partly about task specification</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The spectrum:</strong> Zero-shot requires the model to infer the task from
                a description alone. One-shot adds a single example, grounding the description in
                concrete behavior. Few-shot provides multiple examples, allowing the model to average
                over patterns and generalize more robustly.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>How many examples do you need?</h2>

            <Analogy label="Zero-Shot: The Instruction Manual">
                Imagine you're given a brand new board game with only the rulebook. No one has shown
                you how to play. You read the rules and try your best. Sometimes you do well; sometimes
                you miss a subtle rule. That's zero-shot: the model gets instructions but no examples.
            </Analogy>

            <Analogy label="One-Shot: The Demo Round">
                Now imagine someone plays one full turn in front of you. You watch carefully: they
                roll the dice, move their piece, draw a card. Suddenly the rules make sense. One
                example is often enough to clarify what the instructions meant. That's one-shot learning.
            </Analogy>

            <Analogy label="Few-Shot: The Practice Games">
                Finally, imagine you play three practice rounds with a friend coaching you. By the
                third round, you've got the hang of it. You know the common mistakes, the tricks,
                the strategy. Few-shot learning gives the model several examples so it can see the
                pattern from multiple angles and perform much better.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Evaluating models without gradient updates</h2>

            <h3>The Three Settings</h3>
            <p>
                GPT-3 introduced a rigorous taxonomy for evaluating large language models that remains
                the standard today:
            </p>
            <ul>
                <li>
                    <strong>Zero-shot:</strong> The model receives only a natural language task
                    description and must generate the answer. No examples are provided.
                </li>
                <li>
                    <strong>One-shot:</strong> The model receives the task description plus exactly
                    one labeled example before the query. This grounds the abstract instructions.
                </li>
                <li>
                    <strong>Few-shot:</strong> The model receives the task description plus k labeled
                    examples (typically 10–100, bounded by context length). Performance generally
                    improves monotonically with k.
                </li>
            </ul>

            <h3>What Drives Few-Shot Gains?</h3>
            <p>
                Research has decomposed few-shot prompting into several distinct mechanisms:
            </p>
            <ul>
                <li><strong>Label space specification:</strong> Examples reveal the possible outputs</li>
                <li><strong>Input distribution calibration:</strong> Examples show the style and format of inputs</li>
                <li><strong>Pattern completion:</strong> The model copies the input-output mapping</li>
                <li><strong>Task location:</strong> The model retrieves the relevant latent task from pretraining</li>
            </ul>

            <h3>Scaling with k</h3>
            <p>
                GPT-3 showed that, across most tasks, accuracy improves log-linearly with the number
                of in-context examples. However, diminishing returns set in after ~20–50 examples,
                and performance is eventually bounded by context length.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Surprising finding (Min et al., 2022):</strong> Even when example labels are
                replaced with random labels, few-shot performance often remains well above zero-shot.
                This implies that a significant portion of few-shot improvement comes from surfacing
                the label space and input distribution, not from learning the correct mapping.
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
            <h2>Formalizing the few-shot objective</h2>

            <DefBlock label="Zero-Shot Prediction">
                Given a task description d and a query x, the zero-shot prediction is simply the
                most likely completion under the model's pre-trained distribution:
                <MathBlock tex="\hat{y} = \arg\max_{y} P(y \mid d, x; \Theta)" />
                The model must infer the task entirely from the description.
            </DefBlock>

            <DefBlock label="k-Shot Prediction">
                Given k examples {'{'}(x<sup>(i)</sup>, y<sup>(i)</sup>){'}'}<sub>i=1..k</sub>, a description d,
                and a query x, the few-shot prediction conditions on all examples:
                <MathBlock tex="\hat{y} = \arg\max_{y} P(y \mid d, x^{(1)}, y^{(1)}, \dots, x^{(k)}, y^{(k)}, x; \Theta)" />
                No gradient steps are performed on Θ.
            </DefBlock>

            <h3>Expected Performance as a Function of k</h3>
            <p>
                Empirically, few-shot accuracy A(k) often follows a logarithmic scaling law:
            </p>
            <MathBlock tex="A(k) = A_{\infty} - \frac{c}{\sqrt{k + 1}}" />
            <p>
                where A<sub>∞</sub> is the asymptotic accuracy and c is a task-dependent constant.
                This suggests that each additional example provides diminishing returns, and the
                model approaches a ceiling set by its pre-trained knowledge and context capacity.
            </p>

            <h3>Bayesian View</h3>
            <p>
                From a Bayesian perspective, each example updates the model's belief about the latent
                task τ. The posterior after k examples is:
            </p>
            <MathBlock tex="P(\tau \mid \text{examples}) \propto P(\text{examples} \mid \tau) \, P(\tau)" />
            <p>
                The prior P(τ) is encoded in the model's pre-trained parameters. Few-shot examples
                provide likelihood evidence that shifts the posterior toward the correct task.
            </p>

            <div className="ch-callout">
                <strong>Calibration:</strong> Few-shot prompting also improves calibration — the
                alignment between model confidence and accuracy. Zero-shot models are often
                overconfident; conditioning on examples grounds the model's predictions in observed
                frequencies, reducing overconfidence on out-of-distribution inputs.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Few-Shot Prompt Formatter — NumPy ─────────────────────────────────────────

def format_few_shot_prompt(description, examples, query, k=None):
    """
    Formats a few-shot prompt from examples and a query.
    
    description: str, task instruction
    examples:    list of (input, output) tuples
    query:       str, the test input
    k:           int, number of examples to include (None = all)
    """
    if k is not None:
        examples = examples[:k]
    
    prompt_parts = [description.strip(), ""]
    for inp, out in examples:
        prompt_parts.append(f"Input: {inp}")
        prompt_parts.append(f"Output: {out}")
        prompt_parts.append("")
    prompt_parts.append(f"Input: {query}")
    prompt_parts.append("Output:")
    
    return "\\n".join(prompt_parts)

# ── Demo ──────────────────────────────────────────────────────────────────────
description = "Translate English to French."
examples = [
    ("Hello", "Bonjour"),
    ("Thank you", "Merci"),
    ("Good night", "Bonne nuit"),
]
query = "How are you?"

for k in [0, 1, 2, 3]:
    prompt = format_few_shot_prompt(description, examples, query, k=k)
    print(f"--- {k}-shot prompt ---")
    print(prompt)
    print()
`

function PythonContent() {
    return (
        <>
            <p>
                A simple Python prompt formatter that constructs zero-shot, one-shot, and few-shot
                prompts by concatenating a task description, labeled examples, and the query. This
                is the exact formatting pipeline used to evaluate large language models in-context.
            </p>
            <CodeBlock code={PY_CODE} filename="fewshot_prompt.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const FEWSHOT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
