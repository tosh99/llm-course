import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Fine-tuning giants without moving the giant</h2>
            <p>
                Full fine-tuning of large language models requires updating every parameter —
                billions of weights — which demands enormous GPU memory and compute. In 2021,
                Hu et al. introduced LoRA (Low-Rank Adaptation), a method that freezes the
                pre-trained model and injects small trainable rank-decomposition matrices into
                each layer. A model like GPT-3 can be fine-tuned with only 0.01% of its parameters
                trainable, while matching full fine-tuning quality.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Adapter Layers and Prefix Tuning</div>
                    <div className="ch-tl-body">
                        Earlier parameter-efficient methods inserted small bottleneck layers
                        (adapters) or prepended learned vectors (prefix tuning) to each layer.
                        These worked but added inference latency or reduced sequence capacity.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved you don't need all parameters, but had trade-offs</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Oct 2021</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Hu et al. — LoRA: Low-Rank Adaptation of Large Language Models</div>
                    <div className="ch-tl-body">
                        LoRA replaced full weight updates with a low-rank decomposition W' = W₀ + BA,
                        where W₀ is frozen and BA are small trainable matrices (rank r ≪ d). During
                        inference, the low-rank terms can be merged back into W₀ with zero overhead.
                        No additional latency, no sequence capacity lost.
                    </div>
                    <div className="ch-tl-impact">Impact: The dominant parameter-efficient fine-tuning method</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Adoption</div>
                    <div className="ch-tl-title">Hugging Face PEFT and the Ecosystem</div>
                    <div className="ch-tl-body">
                        Libraries like Hugging Face PEFT and lit-gpt made LoRA a one-line API call.
                        Thousands of open-source fine-tunes (Alpaca-LoRA, WizardLM-LoRA, etc.)
                        demonstrated that 7B–65B models could be adapted on consumer GPUs in hours,
                        not days on A100 clusters.
                    </div>
                    <div className="ch-tl-impact">Impact: Democratized model customization</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> The intrinsic rank of weight updates during
                fine-tuning is surprisingly low. Instead of updating a d×d matrix, two thin
                matrices (d×r and r×d) capture nearly all the task-specific signal.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching a giant robot a new trick without rewiring it</h2>

            <Analogy label="The Giant Robot">
                Imagine a giant robot with millions of wires inside its brain. You want to teach it
                to speak French, but re-wiring the whole brain would take years and a huge workshop.
            </Analogy>

            <Analogy label="The Tiny Patch">
                LoRA is like attaching a tiny notebook to the robot's brain. The notebook has only
                a few pages, but they're placed at exactly the right spots. The robot keeps its
                old brain completely unchanged; the notebook just nudges its thoughts in the right
                direction when speaking French.
            </Analogy>

            <Analogy label="The Magic Part">
                Once training is done, you can actually copy the notebook's notes directly into the
                robot's main brain wires — so there's no extra weight to carry around. It's like
                the notebook disappears but the knowledge stays.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Low-Rank Adaptation in plain language</h2>

            <h3>The Problem</h3>
            <p>
                Fine-tuning GPT-3 (175B parameters) requires storing optimizer states for every
                weight — roughly 3–4× the model size in GPU memory. For Adam, that's ~700GB for
                the 175B model alone, far beyond consumer hardware.
            </p>

            <h3>The LoRA Trick</h3>
            <p>
                LoRA freezes the pre-trained weight matrix W₀ and trains a low-rank update ΔW = BA,
                where B is d×r and A is r×d. During training, only A and B are updated:
            </p>
            <ul>
                <li><strong>Original weights:</strong> Frozen, no gradients stored</li>
                <li><strong>Rank r:</strong> Typically 4–64, regardless of layer dimension</li>
                <li><strong>Trainable params:</strong> 2 × r × d vs d × d (e.g., 0.1% for r=16, d=4096)</li>
                <li><strong>Inference:</strong> W = W₀ + BA, merged with zero overhead</li>
            </ul>

            <h3>Where to Apply LoRA</h3>
            <p>
                In practice, LoRA is applied to the query and value projection matrices in each
                attention layer. Some implementations also apply it to output projections and FFN
                layers for stronger adaptation.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> On GPT-3 175B, LoRA with rank r=4 matched full fine-tuning
                on multiple downstream tasks while training only 0.004% of parameters. At rank r=64,
                it exceeded full fine-tuning on some benchmarks.
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
            <h2>Low-rank decomposition of weight updates</h2>

            <DefBlock label="LoRA Weight Update">
                For a pre-trained weight matrix W₀ ∈ ℝ<sup>d×k</sup>, LoRA parameterizes the update
                as a product of two low-rank matrices:
                <MathBlock tex="W = W_0 + \Delta W = W_0 + B A" />
                Where B ∈ ℝ<sup>d×r</sup>, A ∈ ℝ<sup>r×k</sup>, and rank r ≪ min(d, k). During
                training W₀ is frozen and does not receive gradients. A is initialized with random
                Gaussian and B is initialized to zero, so ΔW = 0 at the start of training.
            </DefBlock>

            <h3>Forward Pass</h3>
            <p>
                Given input x, the modified layer computes:
            </p>
            <MathBlock tex="h = W_0 x + \Delta W x = W_0 x + B A x" />
            <p>
                The additional FLOPs are negligible for small r, and at inference the product BA
                can be pre-computed and absorbed into W₀.
            </p>

            <h3>Gradient Update</h3>
            <p>
                The gradients for A and B follow from the chain rule. Let L be the loss:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial A} = B^\top \frac{\partial L}{\partial h} x^\top, \quad \frac{\partial L}{\partial B} = \frac{\partial L}{\partial h} (A x)^\top" />

            <h3>Scaling Hyperparameter α</h3>
            <p>
                A scaling factor α/r controls the magnitude of the update relative to pre-trained
                weights. When changing r, α is typically adjusted proportionally to maintain a
                constant effective learning rate:
            </p>
            <MathBlock tex="h = W_0 x + \frac{\alpha}{r} B A x" />
        </>
    )
}

const PY_CODE = `import numpy as np

# ── LoRA Linear Layer — NumPy ─────────────────────────────────────────────────
class LoRALinear:
    def __init__(self, W0, r, alpha=1.0):
        """
        W0: pretrained weights (out_features, in_features)
        r: LoRA rank
        alpha: scaling factor
        """
        self.W0 = W0.copy()
        self.r = r
        self.alpha = alpha
        d, k = W0.shape
        # A: Gaussian init, B: zero init
        self.A = np.random.randn(r, k) * 0.01
        self.B = np.zeros((d, r))

    def forward(self, x):
        """x: (in_features,)"""
        return self.W0 @ x + (self.alpha / self.r) * (self.B @ (self.A @ x))

    def merge(self):
        """Merge LoRA weights into W0 for inference."""
        self.W0 += (self.alpha / self.r) * (self.B @ self.A)
        self.A = None
        self.B = None
        return self

# ── Gradient update (simplified SGD) ──────────────────────────────────────────
def lora_update(layer, grad_h, x, lr=1e-3):
    """
    grad_h: gradient w.r.t. output h
    x: input that produced h
    """
    r, alpha = layer.r, layer.alpha
    scale = alpha / r
    # grad_B = grad_h (A x)^T
    Ax = layer.A @ x
    grad_B = np.outer(grad_h, Ax) * scale
    # grad_A = B^T grad_h x^T
    grad_A = np.outer(layer.B.T @ grad_h, x) * scale
    layer.B -= lr * grad_B
    layer.A -= lr * grad_A

# ── Demo ──────────────────────────────────────────────────────────────────────
np.random.seed(0)
W0 = np.random.randn(512, 512)
layer = LoRALinear(W0, r=16, alpha=32)

x = np.random.randn(512)
h = layer.forward(x)
print("LoRA output shape:", h.shape)
print("Trainable params:", layer.A.size + layer.B.size, "vs full:", W0.size)

layer.merge()
print("Merged! Inference uses W0 only.")
`

function PythonContent() {
    return (
        <>
            <p>
                NumPy implementation of a LoRA linear layer with forward pass, gradient update,
                and weight merging for inference.
            </p>
            <CodeBlock code={PY_CODE} filename="lora_layer.py" lang="python" langLabel="Python" />
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const LORA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
