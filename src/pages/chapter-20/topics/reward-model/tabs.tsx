import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning preferences from human judgments</h2>
            <p>
                The Reward Model is the bridge between human intuition and machine optimization.
                Humans are excellent at comparing things ("A is better than B") but terrible at
                assigning absolute scores. The reward model learns to predict these comparative
                judgments, creating a differentiable proxy for human preference.
            </p>

            <div className="ch20-timeline">
                <div className="ch20-tl-item">
                    <div className="ch20-tl-year">1952</div>
                    <div className="ch20-tl-section-label">Foundation</div>
                    <div className="ch20-tl-title">Bradley-Terry Model</div>
                    <div className="ch20-tl-body">
                        Ralph Bradley and Milton Terry introduced a probabilistic model for paired
                        comparisons. The probability that item i beats item j depends on their
                        underlying "strength" parameters. This model would later become the
                        theoretical foundation for learning from human preference rankings.
                    </div>
                    <div className="ch20-tl-impact">Impact: Mathematical framework for pairwise preference learning</div>
                </div>

                <div className="ch20-tl-item">
                    <div className="ch20-tl-year">2012</div>
                    <div className="ch20-tl-section-label">Application</div>
                    <div className="ch20-tl-title">Learning to Rank in Information Retrieval</div>
                    <div className="ch20-tl-body">
                        RankSVM, LambdaMART, and other learning-to-rank algorithms used pairwise
                        preferences to train ranking models. The insight: relative judgments are
                        more reliable and easier to collect than absolute ratings. This preceded
                        the application to language models by nearly a decade.
                    </div>
                    <div className="ch20-tl-impact">Impact: Proved pairwise ranking scales better than absolute scoring</div>
                </div>

                <div className="ch20-tl-item">
                    <div className="ch20-tl-year">2017</div>
                    <div className="ch20-tl-section-label">Breakthrough</div>
                    <div className="ch20-tl-title">Christiano et al. — Deep RL from Human Preferences</div>
                    <div className="ch20-tl-body">
                        OpenAI researchers showed that a reward model trained on human comparisons
                        could guide deep reinforcement learning for complex tasks like Atari games
                        and robot manipulation. The key innovation was scale: collecting thousands
                        of human judgments and training a neural network to generalize preferences.
                    </div>
                    <div className="ch20-tl-impact">Impact: Extended preference learning from linear models to deep neural networks</div>
                </div>

                <div className="ch20-tl-item">
                    <div className="ch20-tl-year">2022</div>
                    <div className="ch20-tl-section-label">Standardization</div>
                    <div className="ch20-tl-title">InstructGPT Reward Model</div>
                    <div className="ch20-tl-body">
                        InstructGPT trained a reward model on ~100K comparisons of model outputs.
                        Labelers ranked multiple completions for the same prompt. The RM — initialized
                        from the SFT model with a regression head — learned to predict these rankings
                        with high accuracy. This scalar reward signal became the objective for PPO.
                    </div>
                    <div className="ch20-tl-impact">Impact: Established the reward model as the standard RLHF component</div>
                </div>
            </div>

            <div className="ch20-callout">
                <strong>The comparison advantage:</strong> Human labelers agree much more consistently
                on "A is better than B" than on "A is a 7.5/10." Pairwise comparisons reduce
                inter-annotator variance and enable scalable data collection.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The taste-tester robot</h2>

            <Analogy label="The Cookie Contest">
                Imagine two bakers make cookies from the same recipe. You taste both and say,
                "Cookie A is better — it's crunchier and has more chocolate chips." Now imagine
                doing this thousands of times with different recipes. A smart robot watches all
                your choices and learns: "Oh, this person likes crunchy cookies with lots of
                chocolate." That's a reward model — it learns your preferences from comparisons.
            </Analogy>

            <Analogy label="The Scorekeeper">
                Once the robot knows your tastes, it can look at any new cookie and predict your
                score — even cookies you've never tasted! It becomes a "taste scorekeeper." When
                the baker (the language model) makes a new batch, the scorekeeper gives it a number.
                Higher number = you'll probably like it more. The baker uses this score to improve.
            </Analogy>

            <Analogy label="The Blind Spot">
                But the scorekeeper can be fooled! If the baker discovers a trick — like adding
                way too much salt that somehow makes the score high — the scorekeeper might give
                a good score to terrible cookies. That's why we need guardrails (the KL penalty)
                to keep the baker from going crazy trying to game the score.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From pairwise rankings to scalar rewards</h2>

            <h3>Data Collection</h3>
            <p>
                For each prompt, the SFT model generates K ≥ 2 completions. Human labelers rank
                these from best to worst. Rather than asking for absolute scores, we collect
                relative rankings — which is faster and more consistent.
            </p>
            <ul>
                <li><strong>Prompt sampling:</strong> Diverse instructions, questions, and conversations</li>
                <li><strong>Generation:</strong> K completions from the SFT model with temperature &gt; 0</li>
                <li><strong>Ranking:</strong> Labelers order completions by overall quality</li>
                <li><strong>Guidelines:</strong> Detailed rubrics for helpfulness, accuracy, safety, verbosity</li>
            </ul>

            <h3>Reward Model Architecture</h3>
            <p>
                The reward model is initialized from the SFT model. The final unembedding layer is
                replaced with a scalar regression head that outputs a single real-valued score:
            </p>
            <ul>
                <li><strong>Input:</strong> Prompt x + completion y</li>
                <li><strong>Output:</strong> Scalar r<sub>θ</sub>(x, y) ∈ ℝ</li>
                <li><strong>Training:</strong> Bradley-Terry pairwise loss on ranked completions</li>
            </ul>

            <h3>Training Objective</h3>
            <p>
                For a prompt x with winning completion y<sub>w</sub> and losing completion y<sub>l</sub>:
            </p>
            <MathBlock tex="\mathcal{L}_R(\theta) = -\mathbb{E}\left[ \log \sigma\big(r_\theta(x, y_w) - r_\theta(x, y_l)\big) \right]" />
            <p>
                The sigmoid of the score difference gives the probability that the model correctly
                predicts the human preference. Minimizing this loss trains the RM to assign higher
                scores to preferred outputs.
            </p>

            <hr className="ch20-sep" />
            <div className="ch20-callout">
                <strong>Reward hacking:</strong> The reward model is not perfect — it is a learned
                approximation of human preferences. The RL policy can exploit RM weaknesses to
                achieve high scores while producing low-quality text. This is the fundamental
                challenge of RLHF and why KL regularization is essential.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mathematics of reward modeling</h2>

            <DefBlock label="Bradley-Terry Preference Model">
                The probability that completion y<sub>w</sub> is preferred over y<sub>l</sub> given
                prompt x is modeled as:
                <MathBlock tex="P(y_w \succ y_l \mid x) = \sigma\big(r_\theta(x, y_w) - r_\theta(x, y_l)\big) = \frac{1}{1 + \exp\big(-(r_\theta(x, y_w) - r_\theta(x, y_l))\big)}" />
                Where σ is the logistic sigmoid and r<sub>θ</sub> is the reward model parameterized by θ.
                This assumes transitive preferences and models comparison probability as a function
                of score difference.
            </DefBlock>

            <h3>Cross-Entropy Loss</h3>
            <p>
                Given a dataset of comparisons D<sub>pref</sub> = {'('}x, y<sub>w</sub>, y<sub>l</sub>{')'},
                the negative log-likelihood is:
            </p>
            <MathBlock tex="\mathcal{L}_R(\theta) = -\frac{1}{|D_{\text{pref}}|} \sum_{(x, y_w, y_l)} \log \sigma\big(r_\theta(x, y_w) - r_\theta(x, y_l)\big)" />

            <h3>Gradient</h3>
            <p>
                The gradient with respect to the reward model parameters is:
            </p>
            <MathBlock tex="\nabla_\theta \mathcal{L}_R = -\frac{1}{|D_{\text{pref}}|} \sum_{(x, y_w, y_l)} \big[1 - \sigma(\Delta r)\big] \cdot \nabla_\theta \big(r_\theta(x, y_w) - r_\theta(x, y_l)\big)" />
            <p>
                Where Δr = r<sub>θ</sub>(x, y<sub>w</sub>) - r<sub>θ</sub>(x, y<sub>l</sub>). When the
                model is confident (σ(Δr) ≈ 1), the gradient is small. When uncertain, the gradient
                is large — naturally focusing learning on difficult comparisons.
            </p>

            <h3>Generalization to Multiple Comparisons</h3>
            <p>
                For K-way rankings, the Plackett-Luce model generalizes Bradley-Terry:
            </p>
            <MathBlock tex="P(y_1 \succ y_2 \succ \dots \succ y_K \mid x) = \prod_{k=1}^{K} \frac{\exp(r_\theta(x, y_k))}{\sum_{j=k}^{K} \exp(r_\theta(x, y_j))}" />
            <p>
                In practice, most implementations use pairwise decomposition (all pairs from a ranking)
                rather than the full Plackett-Luce likelihood for computational simplicity.
            </p>

            <div className="ch20-callout">
                <strong>RM calibration:</strong> The reward model learns relative preferences, not
                absolute utilities. Adding a constant to all rewards doesn't change the preference
                probabilities. This means the RM is only defined up to an additive constant — the
                scale matters for RL, but the offset does not.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Bradley-Terry Reward Model Loss — NumPy ───────────────────────────────────
def bt_loss_scalar(r_w, r_l):
    """Single pairwise Bradley-Terry loss."""
    diff = r_w - r_l
    return -np.log(1 / (1 + np.exp(-diff)))

# ── Batch Bradley-Terry Loss ──────────────────────────────────────────────────
def bt_loss_batch(rewards, winners, losers):
    """
    rewards: (batch_size,) predicted scores
    winners: (batch_size,) indices of preferred completions
    losers:  (batch_size,) indices of rejected completions
    """
    r_w = rewards[winners]
    r_l = rewards[losers]
    diffs = r_w - r_l
    return -np.mean(np.log(1 / (1 + np.exp(-diffs))))

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)
batch_size = 8
rewards = np.random.randn(batch_size)
winners = np.array([0, 2, 3, 1, 5, 6, 4, 7])
losers  = np.array([1, 0, 2, 3, 4, 5, 6, 7])

loss = bt_loss_batch(rewards, winners, losers)
print(f"Batch BT Loss: {loss:.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of batch Bradley-Terry loss for reward model training.
            </p>
            <CodeBlock code={PY_CODE} filename="reward_model.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Reward Model Utilities — TypeScript ─────────────────────────────────────

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x))
}

function btLossScalar(rW: number, rL: number): number {
    return -Math.log(sigmoid(rW - rL))
}

function btLossBatch(rewards: number[], winners: number[], losers: number[]): number {
    let total = 0
    for (let i = 0; i < winners.length; i++) {
        total += btLossScalar(rewards[winners[i]], rewards[losers[i]])
    }
    return total / winners.length
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const rewards = Array.from({ length: 8 }, () => (Math.random() - 0.5) * 2)
const winners = [0, 2, 3, 1, 5, 6, 4, 7]
const losers  = [1, 0, 2, 3, 4, 5, 6, 7]

console.log("Batch BT Loss:", btLossBatch(rewards, winners, losers).toFixed(4))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of reward model Bradley-Terry loss.
            </p>
            <CodeBlock code={TS_CODE} filename="reward_model.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const REWARD_MODEL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
