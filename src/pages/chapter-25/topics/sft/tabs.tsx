import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Teaching models the shape of helpful responses</h2>
            <p>
                Supervised Fine-Tuning (SFT) is the first and most intuitive step in the alignment
                pipeline. Before reinforcement learning or preference modeling, you need a model that
                at least knows what a good response looks like. SFT provides this foundation by
                training the model to imitate high-quality human demonstrations.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2020</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Task-Specific Fine-Tuning</div>
                    <div className="ch-tl-body">
                        ULMFiT, BERT, and GPT-1 all demonstrated that fine-tuning pretrained models
                        on labeled task data dramatically improved performance. However, these were
                        single-task adaptations (sentiment, NLI, QA). The idea of general-purpose
                        instruction following through SFT had not yet been systematically explored.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved fine-tuning works, but only for narrow tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Insight</div>
                    <div className="ch-tl-title">Wei et al. — Fine-Tuned Language Models are Zero-Shot Learners</div>
                    <div className="ch-tl-body">
                        FLAN showed that training on a mixture of tasks phrased as instructions
                        enabled zero-shot generalization to unseen tasks. The key was scale: using
                        thousands of task templates created a model that understood the <em>meta-task</em>
                        of following instructions. This was pure SFT — no RLHF yet.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated instruction tuning as a generalization strategy</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 – 2022</div>
                    <div className="ch-tl-section-label">Standardization</div>
                    <div className="ch-tl-title">SFT Becomes the Alignment Baseline</div>
                    <div className="ch-tl-body">
                        InstructGPT, Claude, and later ChatGPT all used SFT as Stage 1. Researchers
                        discovered that even SFT alone — without RLHF — produced surprisingly capable
                        assistants. Alpaca (2023) famously replicated ChatGPT-quality behavior with
                        just 52K SFT examples and OpenAI's text-davinci-003 outputs. SFT became the
                        "poor man's alignment" and the essential first step for every major model.
                    </div>
                    <div className="ch-tl-impact">Impact: SFT established as the universal starting point for alignment</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The SFT paradox:</strong> SFT alone can produce helpful assistants, but the
                model is limited by the quality and diversity of human demonstrations. It cannot
                exceed human performance and may inherit human biases. This is why RLHF follows —
                to scale beyond imitation.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning by example</h2>

            <Analogy label="The Art Class">
                Imagine you're in an art class. The teacher shows you a picture of a cat and says,
                "Draw a cat like this." You copy the teacher's style — the colors, the shapes, the
                way the whiskers curve. After copying hundreds of drawings, you start to get really
                good at drawing cats, dogs, and houses in that same style.
            </Analogy>

            <Analogy label="The Conversation Game">
                Now imagine the teacher plays a conversation game. She says, "If someone asks you
                'What's the weather?' you should answer like this: 'Today it's sunny and 72 degrees.'"
                You practice thousands of these conversations, learning not just facts but how to be
                polite, helpful, and clear. That's SFT — the model learns by copying good conversations.
            </Analogy>

            <Analogy label="The Limit">
                But there's a catch: you can only be as good as the teacher's examples. If the teacher
                never showed you how to draw a dragon, you won't draw good dragons. And if the teacher
                sometimes makes mistakes, you'll copy those too. That's why we need the next steps —
                to go beyond just copying examples.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Behavioral cloning via maximum likelihood</h2>

            <h3>The SFT Dataset</h3>
            <p>
                SFT requires a dataset of (prompt, response) pairs where responses represent the
                desired behavior. These are typically collected from human labelers who follow
                detailed guidelines about helpfulness, honesty, and harmlessness.
            </p>
            <ul>
                <li><strong>Prompts:</strong> Diverse user instructions, questions, and tasks</li>
                <li><strong>Responses:</strong> Human-written demonstrations of ideal behavior</li>
                <li><strong>Guidelines:</strong> Labeling rubrics ensuring consistency across annotators</li>
            </ul>

            <h3>Training Objective</h3>
            <p>
                Given a prompt x and human-written response y* = (y*<sub>1</sub>, …, y*<sub>n</sub>),
                maximize the likelihood of the human response under the model:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SFT}}(\phi) = -\sum_{i=1}^{n} \log P_\phi(y^*_i \mid x, y^*_1, \dots, y^*_{i-1})" />
            <p>
                This is standard next-token prediction, but conditioned on high-quality demonstrations
                rather than raw internet text. The model learns the conditional distribution of
                "good responses" given prompts.
            </p>

            <h3>Hyperparameters and Tricks</h3>
            <ul>
                <li><strong>Learning rate:</strong> Much smaller than pretraining (typically 1e-5 to 1e-6)</li>
                <li><strong>Epochs:</strong> Often just 1–3 epochs to avoid overfitting</li>
                <li><strong>Packaging:</strong> Multiple short examples packed into one context window</li>
                <li><strong>Masking:</strong> Loss computed only on response tokens, not prompt tokens</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>SFT-only models:</strong> Models like Alpaca, Vicuna, and Zephyr-β demonstrated
                that high-quality SFT data alone can produce surprisingly capable assistants. However,
                they often struggle with nuanced reasoning and can be more easily jailbroken than
                models with additional RLHF training.
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
            <h2>The mathematics of supervised fine-tuning</h2>

            <DefBlock label="Maximum Likelihood on Demonstrations">
                Let D<sub>SFT</sub> = {'{'}x<sup>(i)</sup>, y<sup>(i)</sup>{'}'} be the SFT dataset. The
                objective is to maximize the log-likelihood of the human demonstrations:
                <MathBlock tex="\mathcal{L}_{\text{SFT}}(\phi) = -\frac{1}{|D_{\text{SFT}}|} \sum_{i=1}^{|D_{\text{SFT}}|} \sum_{t=1}^{|y^{(i)}|} \log P_\phi\big(y_t^{(i)} \mid x^{(i)}, y_{<t}^{(i)}\big)" />
                Where ϕ are the model parameters. In practice, this is implemented with the standard
                cross-entropy loss on the response tokens.
            </DefBlock>

            <h3>Token-Level Masking</h3>
            <p>
                To prevent the model from learning to predict prompts (which would hurt instruction
                following), a mask m<sub>t</sub> is applied so loss is computed only on response tokens:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{SFT}}(\phi) = -\sum_{t} m_t \cdot \log P_\phi(y_t \mid x, y_{<t})" />
            <p>
                Where m<sub>t</sub> = 1 if token t is in the response, and 0 if it is in the prompt.
                This ensures gradients flow only through the generated answer.
            </p>

            <h3>Behavioral Cloning Perspective</h3>
            <p>
                SFT can be viewed as behavioral cloning from an expert policy π<sub>E</sub> (the human
                labeler). The goal is to learn a policy π<sub>ϕ</sub> that matches the expert:
            </p>
            <MathBlock tex="\min_\phi \, \mathbb{D}_{\text{KL}}\big( \pi_E(\cdot \mid x) \,\|\, \pi_\phi(\cdot \mid x) \big) = \min_\phi \, \mathbb{E}_{y \sim \pi_E}\left[ -\log \pi_\phi(y \mid x) \right] + \text{const}" />
            <p>
                This is exactly maximum likelihood estimation. The limitation: if the expert is
                suboptimal, the cloned policy cannot exceed expert performance.
            </p>

            <div className="ch-callout">
                <strong>Distribution shift:</strong> SFT trains on human demonstrations but deploys
                on model-generated outputs. This train-test mismatch means the model may enter
                regions of its own output space it never saw during training — a key motivation
                for RL-based methods.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── SFT Loss with Prompt Masking — NumPy ──────────────────────────────────────
def sft_loss(logits, targets, mask):
    """
    logits: (seq_len, vocab_size) raw model outputs
    targets: (seq_len,) integer token ids
    mask: (seq_len,) 1 for response tokens, 0 for prompt tokens
    """
    # Softmax cross-entropy
    exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
    probs = exp_logits / exp_logits.sum(axis=-1, keepdims=True)

    # Gather probabilities of target tokens
    seq_len = len(targets)
    target_probs = probs[np.arange(seq_len), targets]

    # Apply mask and compute mean
    masked_log_probs = mask * np.log(target_probs + 1e-10)
    return -masked_log_probs.sum() / (mask.sum() + 1e-10)

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
seq_len, vocab_size = 10, 1000
logits = np.random.randn(seq_len, vocab_size)
targets = np.random.randint(0, vocab_size, size=seq_len)
mask = np.array([0, 0, 0, 1, 1, 1, 1, 1, 1, 1])  # 3 prompt + 7 response

loss = sft_loss(logits, targets, mask)
print(f"SFT Loss: {loss:.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of the SFT loss with prompt masking, computing cross-entropy
                only on response tokens.
            </p>
            <CodeBlock code={PY_CODE} filename="sft_loss.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const SFT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
