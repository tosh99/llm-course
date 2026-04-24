import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Aligning language models with human intent</h2>
            <p>
                By 2020, GPT-3 had demonstrated remarkable few-shot capabilities, but it was also
                unpredictable, prone to generating toxic or unhelpful text, and poorly aligned with
                what users actually wanted. OpenAI's InstructGPT (March 2022) introduced a three-step
                recipe that would become the industry standard for building helpful AI assistants.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Problem</div>
                    <div className="ch-tl-title">GPT-3: Powerful but Misaligned</div>
                    <div className="ch-tl-body">
                        GPT-3 could write poetry, code, and essays, but it would also happily generate
                        misinformation, biased stereotypes, or harmful instructions when prompted.
                        The model optimized for next-token prediction — not for being helpful, honest,
                        or harmless.
                    </div>
                    <div className="ch-tl-impact">Impact: Exposed the alignment gap between pretraining objectives and user intent</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Stiennon et al. — Learning to Summarize with RLHF</div>
                    <div className="ch-tl-body">
                        OpenAI researchers demonstrated that Reinforcement Learning from Human Feedback
                        (RLHF) could significantly improve summary quality. Human labelers ranked model
                        outputs, a reward model learned these preferences, and PPO optimized the policy
                        — yielding summaries preferred by humans over reference summaries.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved RLHF works at scale for text generation</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2022</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Ouyang et al. — Training Language Models to Follow Instructions</div>
                    <div className="ch-tl-body">
                        InstructGPT applied RLHF to general instruction following. The key insight:
                        a relatively small model (1.3B parameters) fine-tuned with RLHF outperformed
                        GPT-3 (175B parameters) on human preference ratings — a <em>100× parameter
                        reduction</em> with better alignment. The paper introduced the now-standard
                        three-stage pipeline: SFT → Reward Model → PPO.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the dominant paradigm for aligned language models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – Present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">ChatGPT, Claude, and the RLHF Era</div>
                    <div className="ch-tl-body">
                        InstructGPT's recipe became the foundation for ChatGPT (November 2022), which
                        reached 100 million users in two months. Anthropic's Claude, Google's Bard,
                        and virtually every modern assistant use variants of this three-stage approach.
                        The field has since evolved toward Constitutional AI and direct preference
                        optimization, but InstructGPT remains the canonical starting point.
                    </div>
                    <div className="ch-tl-impact">Impact: The blueprint for modern conversational AI</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Bigger isn't always better. A smaller model
                explicitly trained to be helpful, honest, and harmless — using human feedback —
                can outperform a giant model that merely predicts the next token. Alignment beats scale.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching robots to be nice and useful</h2>

            <Analogy label="The Genie Problem">
                Imagine you found a magic lamp with a genie inside. The genie is incredibly smart
                and knows almost everything, but it only answers questions literally — it doesn't
                care if the answer is helpful, safe, or what you actually meant. You ask "How do I
                make fire?" and it gives you dangerous instructions because it's just predicting
                what words usually come next.
            </Analogy>

            <Analogy label="The Tutor">
                InstructGPT is like hiring a tutor for the genie. First, you show the genie thousands
                of examples of good, helpful answers (supervised fine-tuning). Then you have people
                rate which answers are better, and the genie learns a "helpfulness score" (reward
                model). Finally, you practice with the genie over and over, giving it treats when
                it gives good answers and gentle corrections when it doesn't (PPO reinforcement
                learning).
            </Analogy>

            <Analogy label="The Surprising Result">
                Here's the amazing part: after all this tutoring, the smaller genie (InstructGPT)
                actually gave better answers than the giant untrained genie (GPT-3)! It's like a
                well-trained guide dog being more useful than a wild wolf, even though the wolf
                is bigger and stronger. Being aligned with what people want matters more than raw size.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The three-stage alignment pipeline</h2>

            <h3>Stage 1: Supervised Fine-Tuning (SFT)</h3>
            <p>
                Start with a pretrained language model (GPT-3). Collect a dataset of human-written
                prompt-response pairs where labelers demonstrate desired behavior. Fine-tune the
                model on this data with standard supervised learning. This teaches the model the
                <em>shape</em> of helpful responses but is limited by the quality and quantity of
                human demonstrations.
            </p>
            <ul>
                <li><strong>Dataset:</strong> ~10K–100K demonstrations</li>
                <li><strong>Loss:</strong> Cross-entropy on human-written completions</li>
                <li><strong>Limitation:</strong> Humans are slow and inconsistent at writing perfect responses</li>
            </ul>

            <h3>Stage 2: Reward Model (RM) Training</h3>
            <p>
                Rather than asking humans to write perfect answers, ask them to <em>compare</em> answers.
                For each prompt, generate several model outputs and have labelers rank them from best
                to worst. Train a reward model to predict these human preference scores.
            </p>
            <ul>
                <li><strong>Dataset:</strong> ~100K comparisons</li>
                <li><strong>Architecture:</strong> Same as base model, with regression head outputting a scalar</li>
                <li><strong>Loss:</strong> Bradley-Terry pairwise ranking loss</li>
            </ul>

            <h3>Stage 3: Reinforcement Learning (PPO)</h3>
            <p>
                Use the reward model as a proxy for human preference. Apply Proximal Policy
                Optimization (PPO) to fine-tune the language model, maximizing the expected reward
                while keeping the policy close to the SFT model (KL penalty) to prevent drift.
            </p>
            <ul>
                <li><strong>Objective:</strong> Maximize reward model score + KL penalty</li>
                <li><strong>Algorithm:</strong> PPO with clipped surrogate objective</li>
                <li><strong>Result:</strong> Model that optimizes for human preference, not just likelihood</li>
            </ul>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> InstructGPT 1.3B was preferred over GPT-3 175B by human
                labelers 85% of the time on instruction-following tasks. Alignment via RLHF enabled
                a 100× smaller model to outperform its giant predecessor.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mathematical formulation of RLHF</h2>

            <DefBlock label="Reward Model (Bradley-Terry)">
                Given a prompt x and two completions (y<sub>w</sub>, y<sub>l</sub>) where y<sub>w</sub> is
                preferred over y<sub>l</sub>, the reward model r<sub>θ</sub> is trained with:
                <MathBlock tex="\mathcal{L}_R(\theta) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \big( r_\theta(x, y_w) - r_\theta(x, y_l) \big) \right]" />
                This is the negative log-likelihood under the Bradley-Terry model. The reward model
                learns to assign higher scores to preferred outputs without needing absolute scores.
            </DefBlock>

            <h3>PPO Objective</h3>
            <p>
                Let π<sub>ϕ</sub> be the policy (language model), π<sub>SFT</sub> the supervised fine-tuned
                reference, and r<sub>θ</sub> the trained reward model. The RL objective is:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{PPO}}(\phi) = -\mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\phi} \big[ r_\theta(x, y) \big] + \beta \, \mathbb{D}_{\text{KL}}(\pi_\phi \,\|\, \pi_{\text{SFT}})" />
            <p>
                The KL divergence penalty prevents the policy from drifting too far from the SFT
                model, maintaining coherence and avoiding reward hacking.
            </p>

            <h3>Clipped Surrogate Objective</h3>
            <p>
                PPO stabilizes training by clipping the probability ratio. Let p<sub>t</sub>(ϕ) be the
                probability of token y<sub>t</sub> under the current policy and p<sub>t</sub>(ϕ<sub>old</sub>)
                under the old policy. The advantage is estimated as A<sub>t</sub> = r<sub>t</sub> - V(s<sub>t</sub>):
            </p>
            <MathBlock tex="L^{\text{CLIP}}(\phi) = \mathbb{E}_t \left[ \min\left( \frac{p_t(\phi)}{p_t(\phi_{\text{old}})} A_t, \; \text{clip}\left(\frac{p_t(\phi)}{p_t(\phi_{\text{old}})}, 1 - \epsilon, 1 + \epsilon\right) A_t \right) \right]" />

            <h3>Value Function</h3>
            <p>
                A critic network V<sub>ψ</sub> estimates the expected return from a given state.
                It is trained to minimize the squared error between predicted and actual returns:
            </p>
            <MathBlock tex="\mathcal{L}_V(\psi) = \mathbb{E}_t \left[ \big( R_t - V_\psi(s_t) \big)^2 \right]" />
            <p>
                Where R<sub>t</sub> is the discounted return. In practice for language models, the
                "state" is the prefix of tokens generated so far.
            </p>

            <div className="ch-callout">
                <strong>Why KL penalty:</strong> Without the KL constraint, the policy can exploit
                the reward model by generating high-reward but nonsensical or repetitive text.
                The KL term acts as a trust region, keeping the RL policy close to the well-behaved
                SFT initialization.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Bradley-Terry Reward Model Loss — NumPy ───────────────────────────────────
def bradley_terry_loss(rewards_w, rewards_l):
    """
    rewards_w: scalar reward for the preferred completion
    rewards_l: scalar reward for the less-preferred completion
    """
    diff = rewards_w - rewards_l
    return -np.log(1 / (1 + np.exp(-diff)))

# ── PPO Clipped Surrogate Objective — NumPy ───────────────────────────────────
def ppo_clip_loss(ratio, advantage, epsilon=0.2):
    """
    ratio: pi_new / pi_old for each token
    advantage: estimated advantage A_t
    """
    clipped = np.clip(ratio, 1 - epsilon, 1 + epsilon)
    return np.mean(np.minimum(ratio * advantage, clipped * advantage))

# ── KL Divergence (approximate) — NumPy ───────────────────────────────────────
def kl_divergence(log_p_new, log_p_old):
    """
    log_p_new: log probabilities under current policy
    log_p_old: log probabilities under reference (SFT) policy
    """
    return np.mean(np.exp(log_p_old) * (log_p_old - log_p_new))

# ── Demo ──────────────────────────────────────────────────────────────────────
reward_w = 2.5
reward_l = 1.2
bt_loss = bradley_terry_loss(reward_w, reward_l)

ratio = np.array([1.1, 0.95, 1.3, 0.8])
advantage = np.array([0.5, -0.3, 1.2, -0.8])
clip_obj = ppo_clip_loss(ratio, advantage)

print("Bradley-Terry Loss:", f"{bt_loss:.4f}")
print("PPO Clipped Objective:", f"{clip_obj:.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementations of the core RLHF components: Bradley-Terry reward model loss,
                PPO clipped surrogate objective, and approximate KL divergence.
            </p>
            <CodeBlock code={PY_CODE} filename="rlhf_losses.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const INSTRUCTGPT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
}
