import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Stabilizing policy optimization for language models</h2>
            <p>
                Proximal Policy Optimization (PPO) is the algorithm that turns reward model scores
                into actual policy improvements. Invented for robotics and game playing, PPO was
                adapted for language models in InstructGPT. Its key advantage: stability. Unlike
                earlier policy gradient methods, PPO prevents overly aggressive updates that could
                collapse the model's language capabilities.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1992</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Williams — REINFORCE</div>
                    <div className="ch-tl-body">
                        Ronald Williams introduced the REINFORCE algorithm, a Monte Carlo policy
                        gradient method. While elegant, REINFORCE suffered from high variance and
                        unstable updates — a small change in parameters could lead to wildly
                        different policies.
                    </div>
                    <div className="ch-tl-impact">Impact: Established policy gradients but revealed instability problems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015 – 2016</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">TRPO and Trust Regions</div>
                    <div className="ch-tl-body">
                        Schulman et al. introduced Trust Region Policy Optimization (TRPO), which
                        constrained policy updates using KL divergence to prevent destructive steps.
                        TRPO was theoretically sound but computationally expensive, requiring second-order
                        methods and conjugate gradient optimization.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved trust regions stabilize policy optimization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Schulman et al. — Proximal Policy Optimization</div>
                    <div className="ch-tl-body">
                        PPO replaced TRPO's complex constrained optimization with a simple clipped
                        surrogate objective. By clipping the probability ratio, PPO achieved similar
                        stability with first-order methods. It became the default RL algorithm across
                        OpenAI, DeepMind, and the broader research community.
                    </div>
                    <div className="ch-tl-impact">Impact: Made stable policy optimization practical at scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">PPO Meets Language Models</div>
                    <div className="ch-tl-body">
                        InstructGPT applied PPO to fine-tune GPT-3 using the reward model as the
                        environment. Key adaptations: KL penalty to stay close to the SFT model,
                        value function initialization from the RM, and careful tuning of the clipping
                        parameter ε. The result was the first broadly capable aligned language model.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated PPO as the go-to RL algorithm for LLM alignment</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why not standard gradient descent?</strong> The reward model is non-differentiable
                with respect to the language model's outputs (it's a separate network). We need RL
                because we can only observe rewards for completed sequences, not for individual tokens
                in isolation. PPO handles this credit assignment problem gracefully.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning with training wheels</h2>

            <Analogy label="The Tightrope Walker">
                Imagine walking a tightrope. If you take a huge step, you might fall off. PPO is
                like having a coach who says, "You can adjust your step, but don't change too much
                at once." The "clip" in PPO is like a safety harness — it prevents the model from
                making wild changes that could break its language abilities.
            </Analogy>

            <Analogy label="The Video Game">
                Think of training the language model like teaching someone to play a video game.
                After each level, you get a score (from the reward model). PPO looks at how much
                better the new strategy is compared to the old one. If the new strategy is only
                a little better, it gets full credit. If it claims to be <em>way</em> better, PPO
                says "I'm skeptical" and only gives partial credit. This stops the player from
                cheating or getting overconfident.
            </Analogy>

            <Analogy label="The Anchor">
                PPO also keeps the model tethered to its starting point (the SFT model) with a KL
                penalty. It's like an anchor — the model can explore and improve, but it can't
                drift so far that it forgets how to speak properly. Without this anchor, the model
                might discover weird tricks that get high reward scores but produce gibberish.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Policy gradients with a safety clip</h2>

            <h3>The RL Setup</h3>
            <p>
                In the RLHF context, the "environment" is the reward model. The policy π<sub>ϕ</sub>
                (the language model) generates a completion y given prompt x. The reward r<sub>θ</sub>(x, y)
                is the scalar score from the trained reward model. The goal is to find a policy that
                maximizes expected reward.
            </p>
            <ul>
                <li><strong>State:</strong> The prompt x and generated tokens so far</li>
                <li><strong>Action:</strong> Sampling the next token from the vocabulary</li>
                <li><strong>Reward:</strong> r<sub>θ</sub>(x, y) at sequence end (sparse reward)</li>
                <li><strong>Policy:</strong> The language model π<sub>ϕ</sub></li>
            </ul>

            <h3>Advantage Estimation</h3>
            <p>
                PPO uses Generalized Advantage Estimation (GAE) to reduce variance. The advantage
                A<sub>t</sub> measures how much better an action is than the average action at that state:
            </p>
            <MathBlock tex="A_t = \sum_{l=0}^{\infty} (\gamma \lambda)^l \cdot \delta_{t+l}" />
            <p>
                Where δ<sub>t</sub> = r<sub>t</sub> + γV(s<sub>t+1</sub>) - V(s<sub>t</sub>) is the
                temporal difference error. GAE interpolates between high-bias (λ = 0) and high-variance
                (λ = 1) estimates.
            </p>

            <h3>Clipped Surrogate Objective</h3>
            <p>
                Let r<sub>t</sub>(ϕ) = π<sub>ϕ</sub>(a<sub>t</sub>|s<sub>t</sub>) / π<sub>ϕ<sub>old</sub></sub>(a<sub>t</sub>|s<sub>t</sub>)
                be the probability ratio. PPO clips this ratio to prevent overly large updates:
            </p>
            <MathBlock tex="L^{\text{CLIP}}(\phi) = \mathbb{E}_t \left[ \min\left( r_t(\phi) A_t, \; \text{clip}(r_t(\phi), 1-\epsilon, 1+\epsilon) A_t \right) \right]" />

            <h3>Full PPO Objective</h3>
            <p>
                The complete objective combines the clipped surrogate with value function loss and
                entropy regularization:
            </p>
            <MathBlock tex="L^{\text{PPO}}(\phi) = L^{\text{CLIP}}(\phi) - c_1 L^{\text{VF}}(\psi) + c_2 H(\pi_\phi)" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Implementation tip:</strong> In language models, each token generation step
                is an action, but the reward is only received at the end of the sequence. This
                sparse reward setting makes advantage estimation particularly important — without
                good value function estimates, credit assignment across long sequences fails.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mathematical details of PPO for LLMs</h2>

            <DefBlock label="Generalized Advantage Estimation (GAE)">
                For a trajectory with rewards r<sub>t</sub> and value estimates V(s<sub>t</sub>),
                the TD residual is δ<sub>t</sub> = r<sub>t</sub> + γV(s<sub>t+1</sub>) - V(s<sub>t</sub>).
                GAE computes advantages as an exponentially weighted average of TD residuals:
                <MathBlock tex="\hat{A}_t^{(\text{GAE})} = \sum_{l=0}^{\infty} (\gamma \lambda)^l \delta_{t+l}" />
                Where γ is the discount factor and λ controls the bias-variance tradeoff. For language
                models with sparse end-of-sequence rewards, most r<sub>t</sub> = 0 and δ<sub>t</sub> ≈
                γV(s<sub>t+1</sub>) - V(s<sub>t</sub>).
            </DefBlock>

            <h3>Clipped Objective Derivative</h3>
            <p>
                The clipped objective creates a piecewise function. For each time step t:
            </p>
            <MathBlock tex="L_t(\phi) = \begin{cases} r_t(\phi) A_t & \text{if } |r_t(\phi) - 1| < \epsilon \text{ or } \text{sgn}(A_t) = \text{sgn}(r_t(\phi) - 1) \\ (1 + \epsilon \cdot \text{sgn}(A_t)) A_t & \text{otherwise} \end{cases}" />
            <p>
                This means: if the update is small or moves in the "right" direction, use the
                standard policy gradient. If it's large and moves in the "wrong" direction, clamp
                the ratio. The min operator in the original formulation handles both cases elegantly.
            </p>

            <h3>KL-Regularized Objective</h3>
            <p>
                The full RLHF objective includes a KL penalty to prevent drift from the SFT model:
            </p>
            <MathBlock tex="\mathcal{J}(\phi) = \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\phi} \big[ r_\theta(x, y) \big] - \beta \, \mathbb{D}_{\text{KL}}(\pi_\phi \,\|\, \pi_{\text{SFT}})" />
            <p>
                Where β controls the strength of the penalty. In practice, this is implemented either
                as an explicit KL term in the loss or by early stopping when KL exceeds a threshold.
            </p>

            <h3>Value Function Loss</h3>
            <p>
                The critic V<sub>ψ</sub> is trained to predict the discounted return:
            </p>
            <MathBlock tex="\mathcal{L}_V(\psi) = \mathbb{E}_t \left[ \big( V_\psi(s_t) - R_t \big)^2 \right]" />
            <p>
                Where R<sub>t</sub> is the Monte Carlo return or the TD(λ) target. For language models,
                the value function is typically initialized from the reward model and shares the same
                transformer backbone with a scalar head.
            </p>

            <div className="ch-callout">
                <strong>Why PPO over REINFORCE:</strong> REINFORCE has variance O(T) where T is sequence
                length. PPO's advantage estimation reduces this to O(1) by subtracting a baseline.
                The clipping further stabilizes training in the high-dimensional action space of
                language generation, where a single bad update can collapse coherence.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── PPO Clipped Surrogate Objective — NumPy ───────────────────────────────────
def ppo_loss(ratios, advantages, epsilon=0.2):
    """
    ratios: (T,) pi_new / pi_old
    advantages: (T,) estimated advantages
    """
    clipped = np.clip(ratios, 1 - epsilon, 1 + epsilon)
    surrogate1 = ratios * advantages
    surrogate2 = clipped * advantages
    return np.mean(np.minimum(surrogate1, surrogate2))

# ── Generalized Advantage Estimation — NumPy ──────────────────────────────────
def gae(rewards, values, gamma=0.99, lam=0.95):
    """
    rewards: (T,) sparse rewards (mostly 0, reward at end)
    values:  (T+1,) value estimates including bootstrap at T
    """
    T = len(rewards)
    advantages = np.zeros(T)
    gae_t = 0

    for t in reversed(range(T)):
        delta = rewards[t] + gamma * values[t + 1] - values[t]
        gae_t = delta + gamma * lam * gae_t
        advantages[t] = gae_t

    return advantages

# ── Demo ──────────────────────────────────────────────────────────────────────
T = 20
ratios = np.random.uniform(0.8, 1.2, size=T)
advantages = np.random.randn(T)
rewards = np.zeros(T)
rewards[-1] = 1.0  # sparse end-of-sequence reward
values = np.random.randn(T + 1)

ppo_obj = ppo_loss(ratios, advantages)
adv = gae(rewards, values)

print(f"PPO Objective: {ppo_obj:.4f}")
print(f"GAE mean: {adv.mean():.4f}, std: {adv.std():.4f}")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of PPO clipped surrogate objective and Generalized Advantage
                Estimation for sparse-reward language model training.
            </p>
            <CodeBlock code={PY_CODE} filename="ppo.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── PPO Core Functions — TypeScript ───────────────────────────────────────────

function clip(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
}

function ppoLoss(ratios: number[], advantages: number[], epsilon = 0.2): number {
    let total = 0
    for (let i = 0; i < ratios.length; i++) {
        const clipped = clip(ratios[i], 1 - epsilon, 1 + epsilon)
        total += Math.min(ratios[i] * advantages[i], clipped * advantages[i])
    }
    return total / ratios.length
}

function gae(rewards: number[], values: number[], gamma = 0.99, lambda = 0.95): number[] {
    const T = rewards.length
    const advantages = new Array(T).fill(0)
    let gae_t = 0

    for (let t = T - 1; t >= 0; t--) {
        const delta = rewards[t] + gamma * values[t + 1] - values[t]
        gae_t = delta + gamma * lambda * gae_t
        advantages[t] = gae_t
    }

    return advantages
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const T = 20
const ratios = Array.from({ length: T }, () => 0.8 + Math.random() * 0.4)
const advantages = Array.from({ length: T }, () => (Math.random() - 0.5) * 2)
const rewards = new Array(T).fill(0)
rewards[T - 1] = 1.0
const values = Array.from({ length: T + 1 }, () => (Math.random() - 0.5) * 2)

console.log("PPO Objective:", ppoLoss(ratios, advantages).toFixed(4))
console.log("GAE:", gae(rewards, values).map(v => v.toFixed(2)))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of PPO clipped loss and GAE for language model alignment.
            </p>
            <CodeBlock code={TS_CODE} filename="ppo.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PPO_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
