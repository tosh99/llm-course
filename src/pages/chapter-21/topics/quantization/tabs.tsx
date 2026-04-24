import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Shrinking neural networks without breaking them</h2>
            <p>
                Quantization is the practice of representing model weights with fewer bits than
                the 32-bit floats used during training. While neural networks are trained in high
                precision, research going back to the 1990s showed that weights and activations
                are robust to aggressive precision reduction. Modern post-training quantization
                (PTQ) and quantization-aware training (QAT) enable running 175B models on laptops
                and phones.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1990s</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Early Neural Net Quantization</div>
                    <div className="ch-tl-body">
                        Researchers in digital signal processing showed that weights could be
                        quantized to 8-bit integers with minimal accuracy loss. Fixed-point
                        arithmetic was common in embedded DSP chips, but the deep learning
                        community initially ignored these results.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved low-precision inference was feasible</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Milestone</div>
                    <div className="ch-tl-title">TensorRT and INT8 Inference</div>
                    <div className="ch-tl-body">
                        NVIDIA introduced INT8 quantization support in TensorRT for CNN inference.
                        By calibrating on a small dataset to determine per-layer scale factors,
                        ResNet and VGG models could be compressed 4× with &lt;1% accuracy drop.
                        This was primarily for vision models; language models remained in FP16.
                    </div>
                    <div className="ch-tl-impact">Impact: Brought quantization to production deep learning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 – 2023</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">GPTQ, GGML, and llama.cpp</div>
                    <div className="ch-tl-body">
                        Frantar et al. introduced GPTQ, an approximate second-order method for
                        one-shot weight quantization. Simultaneously, Georgi Gerganov built
                        llama.cpp, demonstrating that LLaMA could run quantized to 4-bit on a
                        MacBook CPU in real time. The open-source community rushed to adopt these
                        tools, making local LLM inference ubiquitous.
                    </div>
                    <div className="ch-tl-impact">Impact: Local LLM inference on consumer hardware became mainstream</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Neural network weights have significant redundancy
                in their precision. The information content of a weight matrix is far lower than
                32 bits per parameter suggests. Quantization exploits this by mapping the continuous
                distribution of weights onto a small discrete codebook.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Shrinking a huge painting into a tiny thumbnail</h2>

            <Analogy label="The Museum Painting">
                Imagine a beautiful painting in a museum that is 10 meters wide and uses millions
                of colors. It's amazing, but you can't carry it in your pocket. Quantization is
                like making a tiny version that uses only 16 colors — but somehow still looks
                almost exactly the same.
            </Analogy>

            <Analogy label="The Compression Trick">
                The trick is choosing the right 16 colors. If the painting is mostly blue ocean,
                you pick many shades of blue and only a few others. You don't waste colors on
                details the human eye won't notice. Neural network quantization does the same —
                it spends precision where it matters and skips where it doesn't.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From 32-bit floats to 4-bit integers</h2>

            <h3>Why Quantization Works</h3>
            <p>
                Neural network weights follow smooth, often Gaussian distributions. Most values
                cluster near zero, with a long tail of outliers. This means you can represent
                the bulk of the distribution with coarse bins near zero and a few fine bins for
                outliers — exactly what non-uniform quantization does.
            </p>

            <h3>Post-Training Quantization (PTQ)</h3>
            <p>
                PTQ takes a trained model and converts weights to lower precision without retraining.
                Simple methods use a single scale factor per tensor:
            </p>
            <ul>
                <li><strong>Symmetric:</strong> scale = max|w| / q<sub>max</sub></li>
                <li><strong>Affine:</strong> scale = (max(w) − min(w)) / (q<sub>max</sub> − q<sub>min</sub>); zero-point offset</li>
            </ul>

            <h3>Quantization-Aware Training (QAT)</h3>
            <p>
                QAT inserts fake quantization operations during training so the model learns to
                be robust to quantization noise. This typically recovers more accuracy than PTQ,
                especially at aggressive bit widths (4-bit and below).
            </p>

            <h3>GPTQ: One-Shot Layer-wise Quantization</h3>
            <p>
                GPTQ treats quantization as an optimization problem: find quantized weights that
                minimize the change in layer output. It uses approximate second-order information
                (the OBS framework) to update remaining unquantized weights to compensate for
                quantization error in already-quantized weights.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Key result:</strong> GPTQ quantizes LLaMA-65B to 4-bit in ~4 GPU-hours with
                negligible perplexity degradation. llama.cpp runs LLaMA-7B at ~20 tokens/sec on
                a MacBook Air M2 using 4-bit quantized weights.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Quantization mathematics</h2>

            <DefBlock label="Uniform Affine Quantization">
                Given a real-valued tensor w and bit-width b, the quantized values are integers
                in [0, 2<sup>b</sup> − 1]:
                <MathBlock tex="q = \text{clamp}\left(\text{round}\left(\frac{w - z}{s}\right), 0, 2^b - 1\right)" />
                Where scale s = (max(w) − min(w)) / (2<sup>b</sup> − 1) and zero-point
                z = round(min(w)/s). Dequantization reverses the mapping:
                <MathBlock tex="\hat{w} = s \cdot (q - z)" />
            </DefBlock>

            <h3>Symmetric Quantization</h3>
            <p>
                When weights are approximately zero-centered, we can drop the zero-point:
            </p>
            <MathBlock tex="s = \frac{\max(|w|)}{2^{b-1} - 1}, \quad q = \text{round}\left(\frac{w}{s}\right), \quad \hat{w} = s \cdot q" />

            <h3>GPTQ Optimal Brain Surgeon</h3>
            <p>
                GPTQ minimizes the squared error of layer outputs. For layer input X and weight W,
                the objective is:
            </p>
            <MathBlock tex="\arg\min_{\hat{W}} \|X W - X \hat{W}\|^2 = \arg\min_{\hat{W}} \text{tr}\left[(W - \hat{W})^\top (X^\top X) (W - \hat{W})\right]" />
            <p>
                Using the Hessian H = 2X<sup>⊤</sup>X and quantizing weights one at a time, the
                optimal update to remaining weights compensates for the quantization error δ:
            </p>
            <MathBlock tex="w_j \leftarrow w_j - \delta \cdot \frac{H_{ij}^{-1}}{H_{ii}^{-1}}" />

            <h3>Quantization Error Bound</h3>
            <p>
                For a uniform quantizer with step size Δ, the mean squared quantization error
                for a uniformly distributed signal is:
            </p>
            <MathBlock tex="\mathbb{E}\left[(w - \hat{w})^2\right] = \frac{\Delta^2}{12}" />
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Uniform Affine Quantization — NumPy ───────────────────────────────────────
def quantize_affine(w, bits=8):
    """Symmetric quantization to signed integers."""
    max_val = np.max(np.abs(w))
    if max_val == 0:
        return np.zeros_like(w, dtype=np.int8), 1.0
    qmax = 2 ** (bits - 1) - 1
    scale = max_val / qmax
    q = np.round(w / scale).astype(np.int8)
    return q, scale

def dequantize_affine(q, scale):
    return q.astype(np.float32) * scale

# ── GPTQ-style greedy layer-wise quant (simplified) ───────────────────────────
def gptq_simple(W, X, bits=4):
    """
    W: weight matrix (out, in)
    X: calibration inputs (samples, in)
    Returns quantized W_hat
    """
    H = X.T @ X  # Hessian approx
    eps = 1e-3
    H += np.eye(H.shape[0]) * eps

    W_hat = W.copy()
    for col in range(W.shape[1]):
        w_col = W_hat[:, col]
        q, scale = quantize_affine(w_col, bits)
        w_q = dequantize_affine(q, scale)
        err = w_col - w_q

        # Update remaining columns with inverse Hessian compensation
        if col + 1 < W.shape[1]:
            H_inv_col = np.linalg.solve(H[col+1:, col+1:], H[col+1:, col])
            W_hat[:, col+1:] -= np.outer(err, H_inv_col)
    return W_hat

# ── Demo ──────────────────────────────────────────────────────────────────────
W = np.random.randn(128, 256).astype(np.float32)
X = np.random.randn(512, 256).astype(np.float32)

q, s = quantize_affine(W.flatten(), bits=8)
W_q = dequantize_affine(q, s).reshape(W.shape)
print("INT8 RMSE:", np.sqrt(np.mean((W - W_q)**2)).round(6))
`

function PythonTab() {
    return (
        <>
            <p>
                NumPy implementation of uniform symmetric quantization and a simplified GPTQ
                layer-wise quantization with Hessian compensation.
            </p>
            <CodeBlock code={PY_CODE} filename="quantization.py" lang="python" langLabel="Python" />
        </>
    )
}

const TS_CODE = `// ── Quantization Utilities — TypeScript ──────────────────────────────────────

function quantizeSymmetric(w: number[], bits: number): { q: number[]; scale: number } {
    const maxVal = Math.max(...w.map(Math.abs))
    if (maxVal === 0) return { q: w.map(() => 0), scale: 1 }
    const qmax = 2 ** (bits - 1) - 1
    const scale = maxVal / qmax
    const q = w.map(v => Math.round(v / scale))
    return { q, scale }
}

function dequantizeSymmetric(q: number[], scale: number): number[] {
    return q.map(v => v * scale)
}

function quantizeMSE(w: number[], bits: number): { q: number[]; scale: number; rmse: number } {
    const { q, scale } = quantizeSymmetric(w, bits)
    const wHat = dequantizeSymmetric(q, scale)
    const rmse = Math.sqrt(w.reduce((s, v, i) => s + (v - wHat[i]) ** 2, 0) / w.length)
    return { q, scale, rmse }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const weights = Array.from({ length: 256 }, () => (Math.random() - 0.5) * 0.5)

const int8 = quantizeMSE(weights, 8)
console.log("INT8 RMSE:", int8.rmse.toFixed(6))

const int4 = quantizeMSE(weights, 4)
console.log("INT4 RMSE:", int4.rmse.toFixed(6))
`

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of symmetric quantization with MSE evaluation.
            </p>
            <CodeBlock code={TS_CODE} filename="quantization.ts" lang="typescript" langLabel="TypeScript" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const QUANTIZATION_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
