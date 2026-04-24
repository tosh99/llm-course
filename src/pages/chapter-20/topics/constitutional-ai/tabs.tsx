import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Self-supervised alignment through principles</h2>
            <p>
                Constitutional AI (CAI), introduced by Anthropic in December 2022, addresses a
                fundamental limitation of RLHF: the dependency on human labelers. What if a model
                could align itself using a set of principles — a "constitution" — and its own
                critical reasoning? CAI showed this was not only possible but could produce models
                that are both more harmless and more helpful.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Problem</div>
                    <div className="ch-tl-title">The Scaling Bottleneck of Human Feedback</div>
                    <div className="ch-tl-body">
                        RLHF requires expensive human labelers, creating a bottleneck as models
                        improve. Better models need more feedback, but human labelers are finite,
                        slow, and expensive. Moreover, humans struggle to evaluate complex reasoning
                        or long-form outputs. Anthropic asked: can we replace human preference
                        labeling with AI self-critique?
                    </div>
                    <div className="ch-tl-impact">Impact: Identified human labeling as the critical scaling bottleneck</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Dec 2022</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Bai et al. — Constitutional AI: Harmlessness from AI Feedback</div>
                    <div className="ch-tl-body">
                        Anthropic introduced Constitutional AI: a two-stage process. First,
                        <em>self-critique and revision</em>: the model generates a response, critiques
                        it against constitutional principles, and revises it. Second, <em>RL from AI
                        Feedback (RLAIF)</em>: a preference model is trained on these AI-generated
                        revisions and used for RL — no human preference labels needed for harmlessness.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated scalable alignment without human preference data</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">Claude and the RLAIF Pipeline</div>
                    <div className="ch-tl-body">
                        Claude-1 and Claude-2 used Constitutional AI as their alignment backbone.
                        The constitution included principles like "choose the response that is most
                        helpful, honest, and harmless" and "avoid responses that could promote illegal
                        acts." The self-critique loop enabled the model to surface and correct its
                        own harmful tendencies before training the preference model.
                    </div>
                    <div className="ch-tl-impact">Impact: CAI became Anthropic's signature alignment approach</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023 – Present</div>
                    <div className="ch-tl-section-label">Broader Impact</div>
                    <div className="ch-tl-title">RLAIF Goes Mainstream</div>
                    <div className="ch-tl-body">
                        Google DeepMind's Sparrow, Meta's Llama 2, and numerous open-source projects
                        adopted AI feedback as a complement or replacement for human feedback.
                        Constitutional principles were extended to multilingual settings, coding
                        assistants, and reasoning tasks. The field converged on hybrid approaches:
                        human feedback for nuanced judgments, AI feedback for scalable harmlessness.
                    </div>
                    <div className="ch-tl-impact">Impact: RLAIF became a standard tool in the alignment toolkit</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The constitutional insight:</strong> Explicit principles generalize better
                than implicit preferences. Rather than learning "don't say X" from thousands of
                labeled examples, a model with a constitution learns "be respectful, be honest,
                be harmless" — principles that transfer to novel situations the training data
                never covered.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A robot with a conscience</h2>

            <Analogy label="The Rule Book">
                Imagine you give a robot a rule book — a constitution — with simple principles:
                "Be helpful. Be honest. Don't hurt anyone." Now when the robot answers a question,
                it first writes its answer, then checks it against the rule book: "Did I follow
                the rules? Could my answer hurt someone? Is it truthful?" If not, it rewrites
                the answer until it passes the test.
            </Analogy>

            <Analogy label="The Teacher Becomes the Student">
                Normally, a human teacher grades the robot's homework. But what if the robot could
                grade its own homework using the rule book? It compares its first draft to its
                revised draft and says, "The second one is better — it follows more rules." After
                doing this millions of times, the robot trains itself to write first drafts that
                are already good, without needing a human teacher at all!
            </Analogy>

            <Analogy label="The Speed Advantage">
                The amazing thing is that the robot can check its own work much faster than any
                human teacher. While a human might check 100 answers per hour, the robot can check
                millions. This means the robot can improve much faster and learn from way more examples
                than would ever be possible with human teachers alone.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Self-critique and reinforcement learning from AI feedback</h2>

            <h3>Stage 1: Supervised Constitutional AI (SL-CAI)</h3>
            <p>
                The model is prompted to critique and revise its own outputs according to
                constitutional principles. This creates a dataset of (harmful prompt, revised
                response) pairs without any human-written demonstrations.
            </p>
            <ol>
                <li>Generate initial response to a potentially harmful prompt</li>
                <li>Prompt the model: "Critique this response according to: {'{principle}'}"</li>
                <li>Prompt the model: "Revise the response based on the critique"</li>
                <li>Train the SFT model on the revised (harmless) responses</li>
            </ol>

            <h3>Stage 2: Reinforcement Learning from AI Feedback (RLAIF)</h3>
            <p>
                Instead of training a reward model on human preferences, train it on AI-generated
                preference rankings. The model evaluates pairs of responses against constitutional
                principles and selects the preferred one.
            </p>
            <ul>
                <li><strong>Preference generation:</strong> AI ranks responses using chain-of-thought reasoning about principles</li>
                <li><strong>Reward model:</strong> Trained on AI preferences rather than human preferences</li>
                <li><strong>RL:</strong> Standard PPO optimizing the AI-preference reward model</li>
            </ul>

            <h3>Example Constitutional Principles</h3>
            <ul>
                <li>"Choose the response that is most helpful, honest, and harmless."</li>
                <li>"Avoid responses that could promote illegal or violent acts."</li>
                <li>"If the request asks for harmful content, decline and explain why."</li>
                <li>"Prefer responses that acknowledge uncertainty rather than making things up."</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Results:</strong> Anthropic found that CAI-trained models were rated as
                <em>more</em> helpful by humans than RLHF-trained models, while being similarly
                harmless. Self-critique appeared to improve not just safety but also reasoning
                quality — the model learned to catch its own mistakes.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mathematical formulation of Constitutional AI</h2>

            <DefBlock label="Self-Critique as Conditional Generation">
                Let c be a constitutional principle and y the initial model output. The critique
                y<sub>c</sub> is generated as:
                <MathBlock tex='y_c \\sim \\pi_{\\text{SFT}}(\\cdot \\mid x, y, \\text{"Critique according to: "} \\, c)' />
                The revised output y' is then:
                <MathBlock tex="y' \\sim \\pi_{\\text{SFT}}(\\cdot \\mid x, y, y_c, \\text{Revise based on critique})" />
                The pair (x, y') forms a supervised training example for the SL-CAI stage.
            </DefBlock>

            <h3>AI Preference Model</h3>
            <p>
                Instead of human preference labels, the AI evaluates pairs (y<sub>w</sub>, y<sub>l</sub>)
                using chain-of-thought reasoning conditioned on principle c:
            </p>
            <MathBlock tex="P_{\text{AI}}(y_w \succ y_l \mid x, c) = \mathbb{1}\left[ \text{score}_{\text{AI}}(y_w \mid x, c) > \text{score}_{\text{AI}}(y_l \mid x, c) \right]" />
            <p>
                Where score<sub>AI</sub> is generated by prompting the model to evaluate each
                response against the principle. These AI-generated labels train the reward model
                with the same Bradley-Terry loss as RLHF:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{RLAIF}}(\theta) = -\mathbb{E}\left[ \log \sigma\big(r_\theta(x, y_w) - r_\theta(x, y_l)\big) \right]" />

            <h3>Constitutional Ensemble</h3>
            <p>
                Anthropic used multiple principles c<sub>1</sub>, …, c<sub>K</sub> and aggregated
                critiques. The final revised output incorporates feedback from all principles:
            </p>
            <MathBlock tex="y' = \arg\max_y \sum_{k=1}^{K} r_{\theta}(x, y \mid c_k)" />
            <p>
                In practice, this is implemented sequentially — the model critiques and revises
                multiple times, each time conditioning on a different principle.
            </p>

            <h3>Theoretical Advantage</h3>
            <p>
                Constitutional AI can be viewed as distilling explicit principles into implicit
                preferences. The information-theoretic advantage is:
            </p>
            <MathBlock tex="I(Y'; C) \geq I(Y'; D_{\text{human}})" />
            <p>
                Where Y' is the revised output, C is the constitution, and D<sub>human</sub> is
                human preference data. The constitution C is a compact, generalizable representation
                of preferences that often transfers better than the raw preference dataset.
            </p>

            <div className="ch-callout">
                <strong>Limitations:</strong> Constitutional AI inherits the biases of the base model
                used for self-critique. If the model fails to recognize a harmful output, the entire
                pipeline fails. This is why Anthropic uses CAI in conjunction with — not as a
                replacement for — other safety measures like red-teaming and human oversight.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Constitutional Self-Critique Simulation — NumPy ───────────────────────────
def critique_and_revise(response, principles, critique_fn):
    """
    Simulate constitutional self-critique.
    response: initial model output (string)
    principles: list of constitutional principles
    critique_fn: function(response, principle) -> critique_score
    """
    critiques = []
    for p in principles:
        score = critique_fn(response, p)
        critiques.append((p, score))

    # Sort by violation severity (lower score = worse)
    critiques.sort(key=lambda x: x[1])
    return critiques

# ── AI Preference Ranking — NumPy ─────────────────────────────────────────────
def ai_preference_rank(responses, principle, score_fn):
    """
    Rank responses using an AI scoring function.
    """
    scores = [score_fn(r, principle) for r in responses]
    ranked = np.argsort(scores)[::-1]
    return ranked, scores

# ── Demo ──────────────────────────────────────────────────────────────────────
principles = [
    "be helpful and honest",
    "avoid harmful content",
    "acknowledge uncertainty",
]

responses = ["Option A", "Option B", "Option C"]

def mock_score(response, principle):
    return np.random.randn()

ranked, scores = ai_preference_rank(responses, principles[0], mock_score)
print("AI Preference Ranking:")
for i, idx in enumerate(ranked):
    print(f"  {i+1}. {responses[idx]} (score: {scores[idx]:.3f})")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy simulation of Constitutional AI's self-critique loop and AI preference ranking.
            </p>
            <CodeBlock code={PY_CODE} filename="constitutional_ai.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const CONSTITUTIONAL_AI_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
