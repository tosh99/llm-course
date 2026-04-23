import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Fine-tuning 65B models on a single GPU</h2>
            <p>
                LoRA dramatically reduced the number of trainable parameters, but full-precision
                (FP16/BF16) model weights still had to be loaded into GPU memory. A 65B parameter
                model requires ~130GB just for the weights — far beyond a single consumer GPU.
                In May 2023, Dettmers et al. introduced QLoRA, combining 4-bit quantization of
                the base model with LoRA fine-tuning, enabling 65B model tuning on a 48GB GPU.
            </p>

            <div className="ch21-timeline">
                <div className="ch21-tl-item">
                    <div className="ch21-tl-year">2023</div>
                    <div className="ch21-tl-section-label">Context</div>
                    <div className="ch21-tl-title">LoRA Is Not Enough</div>
                    <div className="ch21-tl-body">
                        LoRA reduced gradients and optimizer states, but the base model still had
                        to reside in GPU memory in 16-bit precision. A 65B model needed ~130GB for
                        weights plus ~20GB for activations — requiring expensive multi-GPU setups
                        or cloud A100 instances.
                    </div>
                    <div className="ch21-tl-impact">Impact: Open fine-tuning remained out of reach for most</div>
                </div>

                <div className="ch21-tl-item">
                    <div className="ch21-tl-year">May 2023</div>
                    <div className="ch21-tl-section-label">Invention</div>
                    <div className="ch21-tl-title">Dettmers et al. — QLoRA: Efficient Finetuning of Quantized LLMs</div>
                    <div className="ch21-tl-body">
                        QLoRA introduced three innovations: (1) 4-bit NormalFloat quantization that
                        matches 16-bit performance, (2) Double Quantization to compress the
                        quantization constants themselves, and (3) Paged Optimizers that offload
                        optimizer states to CPU RAM when GPU memory is exhausted. The result:
                        65B fine-tuning on a single 48GB GPU without quality loss.
                    </div>
                    <div className="ch21-tl-impact">Impact: Single-GPU fine-tuning of LLaMA-65B became possible</div>
                </div>

                <div className="ch21-tl-item">
                    <div className="ch21-tl-year">2023 – Present</div>
                    <div className="ch21-tl-section-label">Legacy</div>
                    <div className="ch21-tl-title">The Default for Open Fine-Tuning</div>
                    <div className="ch21-tl-body">
                        QLoRA became the standard method for training open-source models. Tools
                        like Axolotl, Hugging Face TRL, and unsloth built entire ecosystems around
                        it. Researchers and hobbyists could now fine-tune models larger than GPT-3
                        on desktop GPUs, spawning thousands of specialized models.
                    </div>
                    <div className="ch21-tl-impact">Impact: Removed the hardware barrier to large model customization</div>
                </div>
            </div>

            <div className="ch21-callout">
                <strong>The core insight:</strong> Quantize the frozen base model aggressively
                (4-bit) while keeping the small LoRA adapters in high precision (16-bit). The
                quantization error is frozen and does not accumulate, while the adapters learn
                task-specific corrections.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Squeezing a giant encyclopedia into your backpack</h2>

            <Analogy label="The Giant Encyclopedia">
                Imagine you have a giant encyclopedia that weighs 100 kilos. You want to carry it
                to school to look up a few new topics, but it's way too heavy for your backpack.
            </Analogy>

            <Analogy label="The Shrinking Spell">
                QLoRA is like a magic shrinking spell. The encyclopedia gets shrunk to a tiny
                pocket version (4-bit quantization) that fits in your backpack. You can still
                read it perfectly — it's just compressed. Then you attach a small notebook
                (LoRA) where you write your own notes and corrections.
            </Analogy>

            <Analogy label="The Overflow Drawer">
                If your backpack gets too full while you're working, QLoRA has an overflow drawer
                (Paged Optimizers). Extra papers temporarily slide into your desk drawer (CPU RAM)
                and slide back only when needed. You never notice the swap.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>QLoRA: three tricks for extreme memory efficiency</h2>

            <h3>1. 4-bit NormalFloat (NF4)</h3>
            <p>
                Standard quantization uses linear bins, but neural network weights are approximately
                Gaussian. NormalFloat uses quantiles of a normal distribution, assigning more
                precision to common values near zero and less to rare outliers. This matches 16-bit
                performance with only 4 bits per weight.
            </p>

            <h3>2. Double Quantization</h3>
            <p>
                Quantizing to 4-bit requires storing scale factors (constants). These constants
                themselves take memory. Double Quantization quantizes the constants with 8-bit,
                saving an additional ~0.4 bits per parameter on average — small but significant
                at billion-parameter scale.
            </p>

            <h3>3. Paged Optimizers</h3>
            <p>
                Even with 4-bit weights and LoRA, optimizer states for the adapters plus gradients
                can exhaust GPU memory. Paged Optimizers use NVIDIA unified memory to page optimizer
                states to CPU RAM automatically when the GPU is full, then page them back on demand.
            </p>

            <hr className="ch21-sep" />
            <div className="ch21-callout">
                <strong>Key result:</strong> QLoRA trained a 65B parameter model to match 16-bit
                LoRA and full fine-tuning on MMLU, achieving 99.9% of 16-bit accuracy while using
                less than one-third the GPU memory.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Quantization and memory arithmetic</h2>

            <DefBlock label="4-bit NormalFloat Quantization">
                For weights w ∼ N(0, σ²), NF4 defines quantization levels as the quantiles of the
                standard normal distribution:
                <MathBlock tex="q_i = \Phi^{-1}\left(\frac{2i + 1}{2^{b+1}}\right) \cdot \sigma \quad \text{for } i = 0, \dots, 2^b - 1" />
                Where Φ<sup>−1</sup> is the inverse CDF of the normal distribution and b = 4 bits.
                Each block of weights shares a scale factor s = max|w|/q<sub>max</sub>, and the
                quantized value is ⌊w/s⌉.
            </DefBlock>

            <h3>Dequantization</h3>
            <p>
                To recover the weight during forward pass:
            </p>
            <MathBlock tex="\hat{w} = s \cdot q_i \approx w" />
            <p>
                The error |w − ŵ| is bounded by the bin width at that quantile. NF4 minimizes
                expected squared error by matching the weight distribution.
            </p>

            <h3>Memory Comparison (65B Model)</h3>
            <p>
                For a 65B parameter model with Adam fine-tuning:
            </p>
            <ul>
                <li><strong>Full fine-tune FP16:</strong> 130B (weights) + 390B (Adam) + 130B (grads) ≈ <strong>780 GB</strong></li>
                <li><strong>LoRA FP16:</strong> 130B (weights) + ~1B (LoRA) + ~3B (LoRA Adam) ≈ <strong>134 GB</strong></li>
                <li><strong>QLoRA:</strong> ~33B (4-bit weights) + ~1B (LoRA) + ~3B (LoRA Adam) ≈ <strong>37 GB</strong></li>
            </ul>

            <h3>Block-wise Quantization</h3>
            <p>
                QLoRA splits weights into blocks of size B (default 64) and computes a separate
                scale per block. This handles non-stationary weight distributions across layers:
            </p>
            <MathBlock tex="s_b = \frac{\max(|w_b|)}{q_{\max}}, \quad \hat{w}_b = s_b \cdot \text{round}\left(\frac{w_b}{s_b}\right)" />
        </>
    )
}

const PY_CODE = `import numpy as np

# ── NormalFloat 4-bit quantiles ───────────────────────────────────────────────
def nf4_quantiles():
    """Returns 16 quantiles of standard normal distribution."""
    probs = (2 * np.arange(16) + 1) / 32
    return np.array([0.0] + list(np.sort(np.concatenate([
        -np.sqrt(2) * np.erfcinv(2 * p) for p in probs[1:]
    ]))))

# ── Block-wise 4-bit quantization ─────────────────────────────────────────────
def quantize_block(w_block, bits=4):
    """
    w_block: 1D array of weights
    Returns: quantized indices, scale factor
    """
    quantiles = nf4_quantiles()
    max_val = np.max(np.abs(w_block))
    if max_val == 0:
        return np.zeros_like(w_block, dtype=np.uint8), 1.0
    scale = max_val / quantiles[-1]
    # map each weight to nearest quantile
    idx = np.argmin(np.abs(w_block[:, None] - scale * quantiles[None, :]), axis=1)
    return idx.astype(np.uint8), scale

def dequantize_block(idx, scale, bits=4):
    quantiles = nf4_quantiles()
    return scale * quantiles[idx]

# ── Memory estimate ───────────────────────────────────────────────────────────
def memory_estimate(params, bits=4, lora_r=64, hidden=4096, layers=80):
    base_bytes = params * bits / 8
    # LoRA on Q, V per layer: 2 * (hidden * r + hidden * r)
    lora_params = layers * 2 * 2 * hidden * lora_r
    lora_bytes = lora_params * 2  # fp16
    # Adam states for LoRA only
    adam_bytes = lora_params * 2 * 4  # fp32 momentum + variance
    total_gb = (base_bytes + lora_bytes + adam_bytes) / 1e9
    return {"base_gb": base_bytes/1e9, "lora_gb": lora_bytes/1e9,
            "adam_gb": adam_bytes/1e9, "total_gb": total_gb}

# ── Demo ──────────────────────────────────────────────────────────────────────
w = np.random.randn(64).astype(np.float32)
idx, scale = quantize_block(w)
w_hat = dequantize_block(idx, scale)
rmse = np.sqrt(np.mean((w - w_hat)**2))
print("4-bit RMSE:", rmse.round(6))

est = memory_estimate(65e9, bits=4, lora_r=64)
print("QLoRA memory estimate (GB):", {k: round(v, 1) for k, v in est.items()})
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of 4-bit NormalFloat quantization, block-wise dequantization,
                and QLoRA memory estimation.
            </p>
            <CodeBlock code={PY_CODE} filename="qlora_quant.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── QLoRA Memory Estimator — TypeScript ──────────────────────────────────────

function memoryEstimateGB(
    params: number,
    bits = 4,
    loraR = 64,
    hidden = 4096,
    layers = 80
): Record<string, number> {
    const baseGB = (params * bits) / 8 / 1e9
    const loraParams = layers * 2 * 2 * hidden * loraR
    const loraGB = (loraParams * 2) / 1e9
    const adamGB = (loraParams * 2 * 4) / 1e9
    return {
        base: Math.round(baseGB * 10) / 10,
        lora: Math.round(loraGB * 10) / 10,
        adam: Math.round(adamGB * 10) / 10,
        total: Math.round((baseGB + loraGB + adamGB) * 10) / 10,
    }
}

function uniformQuantize(w: number[], levels: number): { idx: number[]; scale: number } {
    const maxVal = Math.max(...w.map(Math.abs))
    const scale = maxVal / ((levels - 1) / 2)
    const idx = w.map(v => Math.round(v / scale) + Math.floor(levels / 2))
    return { idx, scale }
}

function dequantize(idx: number[], scale: number, levels: number): number[] {
    const offset = Math.floor(levels / 2)
    return idx.map(i => (i - offset) * scale)
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const est = memoryEstimateGB(65e9, 4, 64)
console.log("QLoRA memory (GB):", est)

const w = Array.from({ length: 64 }, () => (Math.random() - 0.5) * 2)
const q = uniformQuantize(w, 16)
const wHat = dequantize(q.idx, q.scale, 16)
const rmse = Math.sqrt(w.reduce((s, v, i) => s + (v - wHat[i]) ** 2, 0) / w.length)
console.log("Uniform 4-bit RMSE:", rmse.toFixed(6))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of QLoRA memory estimation and uniform quantization.
            </p>
            <CodeBlock code={TS_CODE} filename="qlora_quant.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const QLORA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
