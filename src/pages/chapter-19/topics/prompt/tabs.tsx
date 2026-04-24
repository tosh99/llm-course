import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The art of talking to large models</h2>
            <p>
                Prompt engineering emerged as a discipline when practitioners realized that the
                <em> way</em> you phrase a question to GPT-3 dramatically affects the answer. Unlike
                traditional software where inputs are rigidly structured, language models respond
                to nuance, tone, format, and context. Prompt engineering is the craft of designing
                inputs that reliably elicit desired outputs.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Jiang et al. — How Can We Know What LMs Know?</div>
                    <div className="ch-tl-body">
                        Researchers showed that the phrasing of a query to a language model significantly
                        impacted its ability to retrieve factual knowledge. Different paraphrases of the
                        same question yielded different accuracy scores.
                    </div>
                    <div className="ch-tl-impact">Impact: Revealed that LMs are highly sensitive to input phrasing</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Birth</div>
                    <div className="ch-tl-title">GPT-3 API &amp; the Rise of Prompting</div>
                    <div className="ch-tl-body">
                        As developers began building on the GPT-3 API, they discovered empirically that
                        adding instructions like "Explain step by step" or formatting prompts as
                        conversations yielded dramatically better results. A cottage industry of prompt
                        design tips, templates, and libraries emerged.
                    </div>
                    <div className="ch-tl-impact">Impact: Prompt engineering became a practical skill for building LLM apps</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Systematization</div>
                    <div className="ch-tl-title">Reynolds &amp; McDonell — Prompt Programming</div>
                    <div className="ch-tl-body">
                        Researchers formalized prompt engineering as "prompt programming," identifying
                        patterns like priming, few-shot exemplars, and output format specification.
                        They argued that prompts are a new kind of program that executes on a language model.
                    </div>
                    <div className="ch-tl-impact">Impact: Established prompt engineering as a first-class programming paradigm</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – 2024</div>
                    <div className="ch-tl-section-label">Automation</div>
                    <div className="ch-tl-title">Automatic Prompt Engineering (APE)</div>
                    <div className="ch-tl-body">
                        Zhou et al. proposed using LLMs themselves to generate and refine prompts,
                        creating a meta-learning loop. Later work introduced gradient-based prompt
                        optimization (soft prompts) and discrete search methods to automate the craft.
                    </div>
                    <div className="ch-tl-impact">Impact: Moved prompt engineering from manual art toward automated science</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The central tension:</strong> Prompt engineering is powerful because language
                models understand natural language, but fragile because small changes in wording can
                produce large changes in behavior. The field is evolving from trial-and-error toward
                principled methods for prompt design and optimization.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Asking questions the right way</h2>

            <Analogy label="The Genie Problem">
                Imagine you have a genie who is incredibly smart but very literal. If you say
                "Make me a sandwich," the genie might build a wooden sandwich sculpture. But if you
                say "Please make me a tasty turkey sandwich with lettuce and tomato on wheat bread,
                cut in half," you get exactly what you want. Prompt engineering is learning how to
                talk to the genie.
            </Analogy>

            <Analogy label="The Role-Play Trick">
                Sometimes the genie acts better if you give it a role first. "You are a helpful
                science teacher explaining to a 10-year-old" gets very different answers than
                "Explain photosynthesis." The genie tries to stay in character. This is called
                role prompting, and it's one of the most powerful prompt engineering techniques.
            </Analogy>

            <Analogy label="Showing Your Work">
                If you ask the genie a hard math question, it might guess wrong. But if you say
                "Solve this step by step and show your work," the genie thinks more carefully and
                gets the right answer much more often. This is chain-of-thought prompting — asking
                the model to explain its reasoning before giving the final answer.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Techniques for steering language model outputs</h2>

            <h3>Core Techniques</h3>
            <ul>
                <li>
                    <strong>Zero-shot prompting:</strong> Directly instruct the model with a clear,
                    specific task description. Best for simple, well-defined tasks.
                </li>
                <li>
                    <strong>Few-shot prompting:</strong> Include 2–5 examples of desired input-output
                    behavior. Best for tasks where the format or style matters.
                </li>
                <li>
                    <strong>Role prompting:</strong> Prefix the prompt with a persona ("You are an
                    expert physicist..."). Shifts the model's output distribution toward expert-level
                    responses.
                </li>
                <li>
                    <strong>Chain-of-thought (CoT):</strong> Append "Let's think step by step" or
                    include reasoning steps in few-shot examples. Dramatically improves arithmetic,
                    logic, and multi-step reasoning.
                </li>
                <li>
                    <strong>Self-consistency:</strong> Generate multiple CoT reasoning paths and take
                    the majority-vote answer. Reduces errors from any single spurious reasoning chain.
                </li>
            </ul>

            <h3>Prompt Formatting Tips</h3>
            <ul>
                <li>Be specific and explicit about the desired output format</li>
                <li>Use delimiters (###, """, XML tags) to separate instructions from context</li>
                <li>Place the most important instructions at the end (recency bias in attention)</li>
                <li>Avoid negative instructions when possible; state what to do, not what to avoid</li>
                <li>Iterate: small wording changes can have outsized effects</li>
            </ul>

            <h3>Prompt Hacking &amp; Safety</h3>
            <p>
                Because models are so sensitive to input phrasing, they are vulnerable to <strong>prompt
                injection</strong> — malicious inputs designed to override system instructions or
                extract harmful outputs. Defenses include input filtering, output moderation, and
                instruction hierarchy (prioritizing system prompts over user prompts).
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key principle:</strong> Language models are conditional probability
                distributions over text. Prompt engineering is the art of conditioning that
                distribution on a prefix that places high probability on the desired completion.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Optimization and probabilistic foundations</h2>

            <DefBlock label="Prompt Engineering as Optimization">
                Let P(y | x; Θ) be the model's output distribution given prompt x. Prompt engineering
                searches for a prompt x* that maximizes the probability of a correct answer y* across
                a set of queries Q:
                <MathBlock tex="x^* = \arg\max_{x} \sum_{(q, y^*) \in Q} P(y^* \mid x, q; \Theta)" />
                In practice, x is a discrete text string, making this a combinatorial optimization
                problem over the vocabulary.
            </DefBlock>

            <h3>Soft Prompts (Prefix Tuning)</h3>
            <p>
                Instead of optimizing discrete text tokens, prefix tuning (Li &amp; Liang, 2021)
                prepends a trainable continuous vector to each layer's input. The objective is:
            </p>
            <MathBlock tex="\mathcal{L} = -\sum_{i} \log P(y_i \mid [\mathbf{P}; \mathbf{x}]; \Theta)" />
            <p>
                where P ∈ ℝ<sup>L×d</sup> is the prefix matrix and [·;·] denotes concatenation.
                Only P is updated; the base model parameters Θ remain frozen. This makes tuning
                efficient while preserving the model's general knowledge.
            </p>

            <h3>Automatic Prompt Engineering (APE)</h3>
            <p>
                Zhou et al. proposed using an LLM to propose candidate prompts, then scoring them
                on a validation set. The meta-objective is:
            </p>
            <MathBlock tex="\hat{x} = \arg\max_{x \in \mathcal{M}(q)} \mathbb{E}_{(q, y) \sim \mathcal{D}_{\text{val}}} \mathbf{1}[\arg\max_{y'} P(y' \mid x, q) = y]" />
            <p>
                where M(q) is the set of prompts generated by a proposal model. This treats prompt
                engineering as a search problem over natural language.
            </p>

            <h3>Recency and Primacy Bias</h3>
            <p>
                Attention mechanisms exhibit recency bias: tokens closer to the query receive higher
                average attention weights. Therefore, instructions placed near the end of the prompt
                often have stronger influence than those at the beginning.
            </p>

            <div className="ch-callout">
                <strong>Discrete vs. continuous:</strong> Discrete prompt engineering operates in
                the space of human-readable text. Continuous (soft) prompting operates in embedding
                space. The latter is more expressive and optimizable but loses interpretability and
                portability across models.
            </div>
        </>
    )
}

const PY_CODE = `import re

# ── Prompt Engineering Utilities — Python ─────────────────────────────────────

def role_prompt(role, instruction):
    """Wrap an instruction in a role-playing prefix."""
    return f"You are {role}.\\n\\n{instruction}"

def chain_of_thought_prompt(question):
    """Append step-by-step reasoning instruction."""
    return f"{question}\\n\\nLet's work through this step by step."

def few_shot_prompt(description, examples, query):
    """Build a few-shot prompt with clear delimiters."""
    parts = [f"### Instruction\\n{description}", "### Examples"]
    for inp, out in examples:
        parts.append(f"Input: {inp}\\nOutput: {out}")
    parts.append("### Query")
    parts.append(f"Input: {query}\\nOutput:")
    return "\\n\\n".join(parts)

def self_consistency_prompt(question, n_samples=5):
    """Generate multiple reasoning paths for self-consistency."""
    return [
        f"{question}\\nReasoning path {i+1}: Let's think step by step."
        for i in range(n_samples)
    ]

# ── Demo ──────────────────────────────────────────────────────────────────────
print(role_prompt("an expert mathematician", "Solve: 15 * 24"))
print()
print(chain_of_thought_prompt("What is 15 multiplied by 24?"))
print()
print(few_shot_prompt(
    "Classify the sentiment as positive or negative.",
    [("I love this!", "positive"), ("Terrible experience.", "negative")],
    "It was okay, nothing special."
))
`

function PythonTab() {
    return (
        <>
            <p>
                Python utilities for common prompt engineering patterns: role prompting,
                chain-of-thought scaffolding, few-shot formatting with delimiters, and self-consistency
                path generation. These are the building blocks used in production LLM applications.
            </p>
            <CodeBlock code={PY_CODE} filename="prompt_engineering.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Prompt Engineering Utilities — TypeScript ────────────────────────────────

function rolePrompt(role: string, instruction: string): string {
    return \`You are \${role}.\\n\\n\${instruction}\`
}

function chainOfThoughtPrompt(question: string): string {
    return \`\${question}\\n\\nLet's work through this step by step.\`
}

function fewShotPrompt(
    description: string,
    examples: [string, string][],
    query: string
): string {
    const parts = [\`### Instruction\\n\${description}\`, "### Examples"]
    for (const [inp, out] of examples) {
        parts.push(\`Input: \${inp}\\nOutput: \${out}\`)
    }
    parts.push("### Query")
    parts.push(\`Input: \${query}\\nOutput:\`)
    return parts.join("\\n\\n")
}

function selfConsistencyPrompt(question: string, nSamples = 5): string[] {
    return Array.from({ length: nSamples }, (_, i) =>
        \`\${question}\\nReasoning path \${i + 1}: Let's think step by step.\`
    )
}

// ── Demo ──────────────────────────────────────────────────────────────────────
console.log(rolePrompt("an expert mathematician", "Solve: 15 * 24"))
console.log()
console.log(chainOfThoughtPrompt("What is 15 multiplied by 24?"))
console.log()
console.log(fewShotPrompt(
    "Classify the sentiment as positive or negative.",
    [["I love this!", "positive"], ["Terrible experience.", "negative"]],
    "It was okay, nothing special."
))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementations of core prompt engineering utilities. These functions
                demonstrate how production systems construct structured prompts for role-based
                reasoning, chain-of-thought elicitation, and few-shot classification.
            </p>
            <CodeBlock code={TS_CODE} filename="prompt_engineering.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PROMPT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
