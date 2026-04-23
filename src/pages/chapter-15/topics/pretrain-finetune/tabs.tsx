import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The paradigm that changed everything</h2>
            <p>
                Before 2018, every NLP system was built from scratch for its specific task. Need a sentiment
                classifier? Collect 10,000 labeled reviews and train a model. Need a question-answering system?
                Collect 100,000 question-answer pairs and train another model. The "pre-train then fine-tune"
                paradigm destroyed this workflow: train one powerful model on unlabeled text, then adapt it
                to any task with a tiny amount of labeled data.
            </p>

            <div className="ch15-timeline">
                <div className="ch15-tl-item">
                    <div className="ch15-tl-year">Pre-2012</div>
                    <div className="ch15-tl-section-label">Old Paradigm</div>
                    <div className="ch15-tl-title">Task-Specific Training from Scratch</div>
                    <div className="ch15-tl-body">
                        Every NLP task required its own labeled dataset, feature engineering, and model
                        architecture. A part-of-speech tagger used HMMs or CRFs. A parser used PCFGs.
                        A sentiment classifier used bag-of-words with SVMs. There was almost no transfer
                        of knowledge between tasks. Labeled data was the bottleneck.
                    </div>
                    <div className="ch15-tl-impact">Impact: Progress was gated by the cost and time of manual annotation</div>
                </div>

                <div className="ch15-tl-item">
                    <div className="ch15-tl-year">2013</div>
                    <div className="ch15-tl-section-label">Stepping Stone</div>
                    <div className="ch15-tl-title">Word Embeddings as Weak Transfer</div>
                    <div className="ch15-tl-body">
                        Word2Vec and GloVe introduced the first form of transfer in NLP: pretrained word
                        vectors that could be reused across tasks. But the heavy model (LSTM, CNN) was
                        still trained from scratch. Transfer was limited to the input layer. The rest
                        of the model had to relearn syntax and semantics for every new task.
                    </div>
                    <div className="ch15-tl-impact">Impact: Proved that pretrained representations help, but only at the surface level</div>
                </div>

                <div className="ch15-tl-item">
                    <div className="ch15-tl-year">2018</div>
                    <div className="ch15-tl-section-label">Paradigm Shift</div>
                    <div className="ch15-tl-title">The Pre-train → Fine-tune Era</div>
                    <div className="ch15-tl-body">
                        Three papers in 2018 — ULMFiT, ELMo, and GPT — independently converged on the same
                        recipe: pretrain a deep language model on massive unlabeled text, then fine-tune
                        on the target task. The difference from word embeddings was profound: the <em>entire
                        model</em> was pretrained, not just the input layer. Syntax, semantics, reasoning,
                        and world knowledge were all transferred.
                    </div>
                    <div className="ch15-tl-impact">Impact: Reduced labeled data requirements by 100× and unified NLP under one paradigm</div>
                </div>

                <div className="ch15-tl-item">
                    <div className="ch15-tl-year">2019 – 2024</div>
                    <div className="ch15-tl-section-label">Evolution</div>
                    <div className="ch15-tl-title">From Fine-tuning to Prompting</div>
                    <div className="ch15-tl-body">
                        As models grew larger (GPT-2, GPT-3, PaLM, LLaMA), fine-tuning became expensive.
                        The community discovered that sufficiently large models could perform tasks with
                        <em>in-context learning</em> — no gradient updates, just a carefully written prompt.
                        Instruction tuning and RLHF refined this further. But the fundamental insight of
                        2018 remains: pretrain once on unlabeled data, then use the model for everything.
                    </div>
                    <div className="ch15-tl-impact">Impact: The dominant paradigm in modern NLP and the foundation of all LLMs</div>
                </div>
            </div>

            <div className="ch15-callout">
                <strong>The core insight:</strong> Unsupervised pretraining on raw text forces a model
                to learn the full structure of language — syntax, semantics, facts, and reasoning —
                without any human labels. Task-specific fine-tuning then acts as a lightweight steering
                mechanism, aligning the model's general knowledge to a specific objective.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learn once, use everywhere</h2>

            <Analogy label="The Art School (Old Way)">
                Imagine every time you wanted to draw something new — a cat, a car, a tree — you had to
                go to a special art school just for that thing. You'd spend months learning to draw cats,
                then months learning to draw cars, starting from zero each time. That's how NLP used to
                work: every task needed its own training from scratch.
            </Analogy>

            <Analogy label="The Master Artist (Pre-training)">
                Now imagine a different path: you spend ten years at a general art school, drawing
                everything — people, animals, buildings, landscapes. You learn light, shadow, perspective,
                color theory. You become a master artist. Then someone asks you to draw a specific cat.
                You don't need to relearn art; you just apply your general skills to this one request.
                That's pre-training.
            </Analogy>

            <Analogy label="The Gentle Nudge (Fine-tuning)">
                Fine-tuning is like someone saying "I love your style, but can you make the cats a bit
                fluffier?" You don't forget how to draw everything else. You just adjust your cat-drawing
                slightly. And because you're already a master, you only need to see a few fluffy cats
                to get it right. Pre-train then fine-tune means: become a master first, then make tiny
                adjustments for each specific job.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The two-stage recipe and its variants</h2>

            <h3>Stage 1 — Unsupervised Pretraining</h3>
            <p>
                Train a large neural network on a massive corpus of unlabeled text using a self-supervised
                objective. The most common objective is <em>causal language modeling</em> (predict the next
                word), but alternatives include masked language modeling (BERT), permuted language modeling
                (XLNet), and span corruption (T5). The model learns:
            </p>
            <ul>
                <li><strong>Syntax:</strong> Grammar, part-of-speech, constituency structure</li>
                <li><strong>Semantics:</strong> Word meanings, relations, entailment</li>
                <li><strong>World knowledge:</strong> Facts about science, history, culture</li>
                <li><strong>Reasoning:</strong> Patterns of logic, causation, comparison</li>
            </ul>
            <p>
                This stage is computationally expensive (days to months on hundreds of GPUs) but is
                amortized across all downstream tasks.
            </p>

            <h3>Stage 2 — Supervised Fine-tuning</h3>
            <p>
                Take the pretrained model and train it on labeled data for a specific task. The key
                techniques that make this work:
            </p>
            <ul>
                <li><strong>Smaller learning rate:</strong> Typically 1e-5 to 1e-4, vs 1e-3 for training
                    from scratch. This preserves pretrained knowledge.</li>
                <li><strong>Fewer epochs:</strong> Usually 2-5 epochs suffice; more leads to overfitting
                    and catastrophic forgetting.</li>
                <li><strong>Task-specific head:</strong> A small classification or regression layer is
                    added on top; the pretrained body provides features.</li>
                <li><strong>Freezing:</strong> Sometimes early layers are frozen to protect low-level
                    representations (as in ULMFiT's gradual unfreezing).</li>
            </ul>

            <h3>Variants and Extensions</h3>
            <p>
                The basic recipe has spawned many variants:
            </p>
            <ul>
                <li><strong>Multi-task fine-tuning:</strong> Fine-tune on multiple tasks simultaneously
                    to create a single model that handles diverse tasks (MT-DNN).</li>
                <li><strong>Adapter layers:</strong> Instead of updating all parameters, insert small
                    bottleneck layers and train only those (parameter-efficient transfer).</li>
                <li><strong>Prompt tuning:</strong> Freeze the entire model and only optimize a soft
                    prompt (continuous vectors prepended to the input).</li>
                <li><strong>Instruction tuning:</strong> Fine-tune on a mixture of tasks formatted as
                    natural language instructions, creating a general instruction-following model.</li>
            </ul>

            <hr className="ch15-sep" />
            <div className="ch15-callout">
                <strong>Why it works:</strong> Language is a universal proxy for intelligence. To predict
                the next word well, a model must understand grammar, logic, facts, and even social norms.
                Pretraining on raw text is therefore a form of <em>unsupervised multi-task learning</em>,
                where the single task of language modeling implicitly covers all other language tasks.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Information-theoretic foundations</h2>

            <DefBlock label="Pretraining as Representation Learning">
                Let p(x) be the true distribution over natural language sequences. A language model
                q<sub>θ</sub>(x) trained to minimize the cross-entropy learns a compressed representation
                of the data distribution:
                <MathBlock tex="\min_\theta \; \mathbb{E}_{x \sim p}\bigl[-\log q_\theta(x)\bigr] = H(p) + D_{\text{KL}}(p \,\|\, q_\theta)" />
                The optimal model satisfies q<sub>θ</sub> = p, at which point the learned representations
                contain all information needed to generate natural language — including syntax, semantics,
                and world knowledge.
            </DefBlock>

            <h3>Transfer as Inductive Bias</h3>
            <p>
                Fine-tuning on a downstream task with distribution p<sub>task</sub>(x, y) can be viewed as
                regularizing the task model with the pretrained parameters θ<sub>pre</sub>:
            </p>
            <MathBlock tex="\min_\theta \; \mathcal{L}_{\text{task}}(\theta) + \lambda \|\theta - \theta_{\text{pre}}\|^2" />
            <p>
                When λ → ∞, the model stays at θ<sub>pre</sub> (zero-shot). When λ → 0, the model is free
                to diverge (risking catastrophic forgetting). In practice, a small learning rate and few
                epochs implement an implicit λ that preserves general knowledge while adapting to the task.
            </p>

            <h3>Sample Efficiency</h3>
            <p>
                Let the sample complexity of learning a task from scratch be N<sub>scratch</sub> and with
                pretraining be N<sub>pre</sub>. The gain from pretraining can be bounded:
            </p>
            <MathBlock tex="N_{\text{pre}} \leq N_{\text{scratch}} \cdot \frac{I(Y; \Theta_{\text{pre}} \mid X)}{H(Y \mid X)}" />
            <p>
                Where I(Y; Θ<sub>pre</sub> | X) is the mutual information between the pretrained
                parameters and the label given the input. The more the pretrained model already knows
                about the task structure, the smaller N<sub>pre</sub> needs to be.
            </p>

            <h3>The Lottery Ticket Hypothesis for Transfer</h3>
            <p>
                Pretraining can be seen as searching the parameter space for a good initialization.
                The fine-tuning stage then finds a nearby minimum in the task loss landscape. Empirically,
                pretrained initializations land in wider, flatter minima that generalize better than
                random initializations. This explains why pretrained models require fewer samples and
                converge faster.
            </p>

            <div className="ch15-callout">
                <strong>Scaling perspective:</strong> As model size grows, the gap between pretraining and
                from-scratch training widens. For GPT-3 (175B parameters), fine-tuning is often unnecessary;
                in-context learning with a prompt achieves comparable results. The pretrain-then-finetune
                paradigm naturally evolves into pretrain-then-prompt as scale increases.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Pretrain / Finetune Simulation — NumPy ────────────────────────────────────
def pretrain_loss_curve(steps, noise=0.1):
    """Simulate pretraining: slow initial drop, then plateau."""
    base = 4.0 * np.exp(-steps / 5000) + 1.5
    return base + noise * np.random.randn(len(steps))

def finetune_loss_curve(steps, pretrained=True, noise=0.05):
    """Simulate fine-tuning: pretrained starts low; random starts high."""
    if pretrained:
        base = 1.5 * np.exp(-steps / 200) + 0.3
    else:
        base = 4.0 * np.exp(-steps / 800) + 0.5
    return base + noise * np.random.randn(len(steps))

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(42)

pretrain_steps = np.arange(0, 10000, 100)
pretrain_loss = pretrain_loss_curve(pretrain_steps)

finetune_steps = np.arange(0, 1000, 10)
loss_pretrained = finetune_loss_curve(finetune_steps, pretrained=True)
loss_scratch = finetune_loss_curve(finetune_steps, pretrained=False)

print("Pre-train → Fine-tune Simulation")
print("=" * 45)
print(f"Pretraining final loss:  {pretrain_loss[-1]:.3f}")
print()
print("Fine-tuning (100 steps):")
print(f"  Pretrained init loss:  {loss_pretrained[10]:.3f}")
print(f"  Random init loss:      {loss_scratch[10]:.3f}")
print()
print("Fine-tuning (500 steps):")
print(f"  Pretrained init loss:  {loss_pretrained[50]:.3f}")
print(f"  Random init loss:      {loss_scratch[50]:.3f}")
print()
print("Key observation: pretrained model starts near-optimal")
print("and converges 5-10x faster than training from scratch.")
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy simulation comparing fine-tuning from a pretrained initialization versus training
                from scratch. The demo shows how pretraining provides a massive head start in loss and
                convergence speed.
            </p>
            <CodeBlock code={PY_CODE} filename="pretrain_sim.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Pretrain / Finetune Simulation — TypeScript ──────────────────────────────

function pretrainLoss(steps: number[]): number[] {
    return steps.map(s => 4.0 * Math.exp(-s / 5000) + 1.5 + (Math.random() - 0.5) * 0.2)
}

function finetuneLoss(steps: number[], pretrained: boolean): number[] {
    return steps.map(s => {
        const base = pretrained
            ? 1.5 * Math.exp(-s / 200) + 0.3
            : 4.0 * Math.exp(-s / 800) + 0.5
        return base + (Math.random() - 0.5) * 0.1
    })
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const pretrainSteps = Array.from({ length: 100 }, (_, i) => i * 100)
const pretrainLosses = pretrainLoss(pretrainSteps)

const finetuneSteps = Array.from({ length: 100 }, (_, i) => i * 10)
const lossPretrained = finetuneLoss(finetuneSteps, true)
const lossScratch = finetuneLoss(finetuneSteps, false)

console.log("Pre-train → Fine-tune Simulation")
console.log("─".repeat(45))
console.log(\`Pretraining final loss: \${pretrainLosses[pretrainLosses.length - 1].toFixed(3)}\`)
console.log()
console.log("Fine-tuning (100 steps):")
console.log(\`  Pretrained init: \${lossPretrained[10].toFixed(3)}\`)
console.log(\`  Random init:     \${lossScratch[10].toFixed(3)}\`)
console.log()
console.log("Fine-tuning (500 steps):")
console.log(\`  Pretrained init: \${lossPretrained[50].toFixed(3)}\`)
console.log(\`  Random init:     \${lossScratch[50].toFixed(3)}\`)
console.log()
console.log("Pretraining provides a dramatic head start in convergence.")
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript simulation of pretraining and fine-tuning loss curves. The pretrained
                initialization starts at a much lower loss and converges significantly faster than
                random initialization.
            </p>
            <CodeBlock code={TS_CODE} filename="pretrain_sim.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const PRETRAIN_FINETUNE_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
