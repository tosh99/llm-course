import { Analogy, CodeBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                While fully-connected neural networks treat every pixel independently,
                <strong> Convolutional Neural Networks (CNNs)</strong> exploit the spatial structure
                of images. Inspired by Hubel and Wiesel's 1962 discovery of simple and complex
                cells in the cat visual cortex, CNNs use local receptive fields and weight sharing
                to efficiently process visual data.
            </p>

            <div className="ch6-timeline">
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">1980</div>
                    <div className="ch6-tl-title">Neocognitron</div>
                    <div className="ch6-tl-body">
                        Kunihiko Fukushima introduces the neocognitron — a hierarchical multi-layered network
                        with alternating simple and complex cells that could perform pattern recognition.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">1989</div>
                    <div className="ch6-tl-title">First CNN Application</div>
                    <div className="ch6-tl-body">
                        Yann LeCun applies backpropagation to train convolutional networks for handwritten digit
                        recognition at AT&T Bell Labs, demonstrating practical viability.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">1998</div>
                    <div className="ch6-tl-title">LeNet-5 Architecture</div>
                    <div className="ch6-tl-body">
                        LeCun et al. publish LeNet-5, which becomes the definitive CNN architecture for the
                        era and is deployed in ATMs for check recognition across the US.
                    </div>
                </div>
            </div>

            <div className="ch6-analogy">
                <div className="ch6-analogy-label">Analogy</div>
                <div className="ch6-analogy-text">
                    A fully-connected network reading an image is like examining a puzzle by randomly
                    scattering the pieces and memorizing each configuration. A CNN is like actually
                    looking at the picture — recognizing edges, textures, and patterns in their
                    spatial context.
                </div>
            </div>

            <hr className="ch6-sep" />

            <h2>Key Characteristics of CNNs</h2>
            <p>
                Convolutional networks derive their power from three fundamental architectural principles:
            </p>
            <ul>
                <li>
                    <strong>Sparse Interactions</strong> — Each neuron connects only to a small local region
                    (receptive field), not the entire input, reducing parameters exponentially.
                </li>
                <li>
                    <strong>Parameter Sharing</strong> — The same filter weights are applied across all spatial
                    positions, detecting features regardless of their location in the image.
                </li>
                <li>
                    <strong>Equivariant Representations</strong> — Translating the input translates the
                    output representation, preserving spatial relationships throughout the hierarchy.
                </li>
            </ul>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>CNNs for Kids: Finding Patterns in Pictures</h2>

            <Analogy label="The Detective Game">
                Imagine you're a detective looking at a photo to find clues. Instead of looking at every single
                tiny dot one by one, you use a magnifying glass to scan across the picture. At each spot, you
                look for specific things — like edges, corners, or colors — and write down what you find.
            </Analogy>

            <Analogy label="Sliding Windows">
                A CNN works just like that! It uses small "windows" (called filters) that slide across the image.
                Each window looks for a specific pattern — one might find horizontal lines, another finds diagonal
                edges, and another finds color changes. These windows are tiny, usually just 3×3 or 5×5 pixels.
            </Analogy>

            <Analogy label="Building Up">
                The really cool part is how CNNs build understanding layer by layer:
                <br /><br />
                <strong>Layer 1</strong> finds simple things like edges and dots.<br />
                <strong>Layer 2</strong> combines edges to find shapes like corners and curves.<br />
                <strong>Layer 3</strong> combines shapes to find parts like wheels or ears.<br />
                <strong>Layer 4+</strong> combines parts to recognize whole objects like cars or cats!
            </Analogy>

            <Analogy label="Why This Is Smart">
                The magic trick is <strong>weight sharing</strong> — the same window that finds an edge in the
                top-left corner also finds edges in the bottom-right! This means the network learns to find
                patterns <em>anywhere</em> in the image, not just where it saw them during training. Much
                smarter than memorizing pixel locations!
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>CNNs Explained for High School Students</h2>

            <p>
                You've learned about matrices in math class. A CNN applies <strong>convolution</strong> — a special
                kind of matrix operation where a small matrix (called a <em>kernel</em> or <em>filter</em>) slides
                over a larger matrix (the image), computing dot products at each position.
            </p>

            <h3>The Convolution Operation</h3>
            <p>
                Imagine a 3×3 filter sliding over an image:
            </p>
            <pre style={{ background: '#111115', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`Filter:          Image region:     Result (dot product):
┌─────┐         ┌─────┐
│ 1 0 -1│       │ 52 55 60│        1×52 + 0×55 + (-1)×60 +
│ 1 0 -1│   ⊙   │ 70 75 80│   =    1×70 + 0×75 + (-1)×80 +
│ 1 0 -1│       │ 90 95 100│       1×90 + 0×95 + (-1)×100
└─────┘         └─────┘        = 52 - 60 + 70 - 80 + 90 - 100 = -28`}
            </pre>

            <p>
                This particular filter is a <strong>vertical edge detector</strong>. It responds strongly when
                there's a bright area on the left and dark area on the right (or vice versa with negative values).
            </p>

            <h3>Why Convolution Instead of Regular Matrix Multiplication?</h3>
            <p>
                In a fully-connected layer connecting a 32×32 image to 100 neurons, there would be 102,400 weights
                (plus biases). That's <em>a lot</em> of parameters to learn!
            </p>
            <p>
                With convolution using 100 filters of size 5×5:
            </p>
            <ul>
                <li>Each filter has only 25 weights + 1 bias = 26 parameters</li>
                <li>100 filters × 26 parameters = 2,600 total parameters</li>
                <li><strong>97% fewer parameters!</strong></li>
            </ul>

            <h3>Pooling: Making Things Smaller</h3>
            <p>
                After finding features, CNNs use <strong>pooling</strong> to shrink the representation. The most
                common type is <strong>max pooling</strong> — it divides the image into regions and keeps only the
                maximum value from each region.
            </p>
            <p>
                This provides:
            </p>
            <ul>
                <li><strong>Translation invariance</strong> — if the cat moves slightly, we still recognize it</li>
                <li><strong>Computational efficiency</strong> — fewer calculations in later layers</li>
                <li><strong>Regularization</strong> — makes the network more robust to small variations</li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The Mathematics of Convolution</h2>

            <h3>2D Convolution Formula</h3>
            <p>
                For input matrix <strong>X</strong> and kernel <strong>K</strong>, the convolution at position (i, j) is:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                (X * K)[i, j] = Σ_m Σ_n X[i+m, j+n] · K[m, n]
            </div>

            <p>
                For a kernel of size k×k, the sums range from 0 to k-1. The kernel "slides" over the input,
                computing this dot product at every valid position.
            </p>

            <h3>Receptive Field Calculation</h3>
            <p>
                As you stack convolution layers, the <strong>receptive field</strong> — the area of the original
                image that each output neuron "sees" — grows. For a stack of n 3×3 convolutions with stride 1:
            </p>
            <ul>
                <li>1 layer: 3×3 receptive field</li>
                <li>2 layers: 5×5 receptive field</li>
                <li>3 layers: 7×7 receptive field</li>
                <li>n layers: (2n+1) × (2n+1) receptive field</li>
            </ul>

            <h3>Parameter Count</h3>
            <p>
                For a convolution layer with C_in input channels, C_out output channels, kernel size k×k:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Parameters = (k² × C_in + 1) × C_out
            </div>
            <p>
                The +1 accounts for the bias term. Compare this to a fully-connected layer:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                FC Parameters = (input_size + 1) × output_size
            </div>

            <h3>Output Size Formula</h3>
            <p>
                For input size N, kernel size k, stride s, padding p:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Output Size = ⌊(N - k + 2p) / s⌋ + 1
            </div>
            <p>
                With "same" padding (p = (k-1)/2 for odd k), the output size equals the input size when stride=1.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Basic Convolution Example ───────────────────────────────────────────────────

# Create a sample 28×28 grayscale image (like MNIST)
image = torch.randn(1, 1, 28, 28)  # (batch, channels, height, width)

# Define a convolution layer
# in_channels=1 (grayscale), out_channels=6, kernel_size=5
conv = nn.Conv2d(in_channels=1, out_channels=6, kernel_size=5)

# Apply convolution
output = conv(image)
print(f"Input shape:  {image.shape}")   # torch.Size([1, 1, 28, 28])
print(f"Output shape: {output.shape}")  # torch.Size([1, 6, 24, 24])
# 28 - 5 + 1 = 24 (no padding)

# ── Understanding Weights ──────────────────────────────────────────────────────
print(f"\\nWeight shape: {conv.weight.shape}")  # torch.Size([6, 1, 5, 5])
# 6 filters, each 1×5×5 (output_ch, input_ch, k, k)
print(f"Bias shape:   {conv.bias.shape}")    # torch.Size([6])

# Total parameters: (5×5×1 + 1) × 6 = 156

total = sum(p.numel() for p in conv.parameters())
print(f"Total params: {total}")  # 156

# ── Manual Calculation ─────────────────────────────────────────────────────────
# One output pixel = sum of 5×5 region * weights + bias

# ── Pooling ─────────────────────────────────────────────────────────────────────
pool = nn.MaxPool2d(kernel_size=2, stride=2)
pooled = pool(output)
print(f"\\nAfter pooling: {pooled.shape}")  # torch.Size([1, 6, 12, 12])
# 24 / 2 = 12 (dimensions halved)

# ── A Complete Layer Block ──────────────────────────────────────────────────────
class ConvBlock(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1)
        self.bn = nn.BatchNorm2d(out_ch)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
    
    def forward(self, x):
        x = self.conv(x)   # Convolve
        x = self.bn(x)     # Normalize
        x = self.relu(x)   # Activate
        x = self.pool(x)   # Pool
        return x

# Test it
block = ConvBlock(1, 32)
x = torch.randn(1, 1, 28, 28)
out = block(x)
print(f"\\nConvBlock:")
print(f"  Input:  {x.shape}")   # [1, 1, 28, 28]
print(f"  Output: {out.shape}")  # [1, 32, 14, 14]

# ── Parameter Efficiency Comparison ────────────────────────────────────────────
# Conv layer: 32 filters, 3×3 kernel, 1 input channel
conv_layer = nn.Conv2d(1, 32, 3, padding=1)
conv_params = sum(p.numel() for p in conv_layer.parameters())

# FC layer: 28×28 inputs to 32 outputs (same output size)
fc_layer = nn.Linear(28*28, 32)
fc_params = sum(p.numel() for p in fc_layer.parameters())

print(f"\\nConv params: {conv_params}")  # ~320
print(f"FC params:   {fc_params}")    # ~25,088
print(f"Savings:     {fc_params/conv_params:.1f}x")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch makes CNNs easy to build and understand. The key layer is{' '}
                <code>nn.Conv2d</code> — but understanding what happens under the hood is crucial
                for debugging and optimization.
            </p>
            <CodeBlock code={PY_CODE} filename="cnn_basics.py" lang="python" />
            <div className="ch6-callout">
                <strong>Key insight:</strong> The Conv2d layer automatically handles sliding the
                filter, computing dot products, and adding the bias. The weight shape is{' '}
                <code>(out_channels, in_channels, height, width)</code>.
            </div>
        </>
    )
}

const TS_CODE = `// ── Simple CNN in TypeScript ──────────────────────────────────────────────────

type Tensor4D = number[][][][];  // [batch, channels, height, width]
type Tensor2D = number[][];

// ── 2D Convolution Operation ────────────────────────────────────────────────────

function conv2d(
    input: Tensor4D,
    weights: Tensor4D,  // [out_ch, in_ch, k_h, k_w]
    bias: number[],     // [out_ch]
    stride: number = 1,
    padding: number = 0
): Tensor4D {
    const [batch, in_ch, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const [out_ch, _, k_h, k_w] = [weights.length, weights[0].length, weights[0][0].length, weights[0][0][0].length];
    
    // Calculate output dimensions
    const out_h = Math.floor((in_h - k_h + 2 * padding) / stride) + 1;
    const out_w = Math.floor((in_w - k_w + 2 * padding) / stride) + 1;
    
    // Initialize output
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(out_ch).fill(0).map(() =>
            Array(out_h).fill(0).map(() =>
                Array(out_w).fill(0)
            )
        )
    );
    
    // Apply convolution
    for (let b = 0; b < batch; b++) {
        for (let oc = 0; oc < out_ch; oc++) {
            for (let oh = 0; oh < out_h; oh++) {
                for (let ow = 0; ow < out_w; ow++) {
                    let sum = bias[oc];
                    
                    for (let ic = 0; ic < in_ch; ic++) {
                        for (let kh = 0; kh < k_h; kh++) {
                            for (let kw = 0; kw < k_w; kw++) {
                                const ih = oh * stride + kh;
                                const iw = ow * stride + kw;
                                sum += input[b][ic][ih][iw] * weights[oc][ic][kh][kw];
                            }
                        }
                    }
                    
                    output[b][oc][oh][ow] = sum;
                }
            }
        }
    }
    
    return output;
}

// ── Max Pooling ────────────────────────────────────────────────────────────────

function maxPool2d(
    input: Tensor4D,
    poolSize: number = 2,
    stride: number = 2
): Tensor4D {
    const [batch, channels, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const out_h = Math.floor((in_h - poolSize) / stride) + 1;
    const out_w = Math.floor((in_w - poolSize) / stride) + 1;
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(channels).fill(0).map(() =>
            Array(out_h).fill(0).map(() =>
                Array(out_w).fill(0)
            )
        )
    );
    
    for (let b = 0; b < batch; b++) {
        for (let c = 0; c < channels; c++) {
            for (let oh = 0; oh < out_h; oh++) {
                for (let ow = 0; ow < out_w; ow++) {
                    let maxVal = -Infinity;
                    
                    for (let ph = 0; ph < poolSize; ph++) {
                        for (let pw = 0; pw < poolSize; pw++) {
                            const ih = oh * stride + ph;
                            const iw = ow * stride + pw;
                            maxVal = Math.max(maxVal, input[b][c][ih][iw]);
                        }
                    }
                    
                    output[b][c][oh][ow] = maxVal;
                }
            }
        }
    }
    
    return output;
}

// ── Demo ────────────────────────────────────────────────────────────────────────

// 1×1×4×4 input
const input: Tensor4D = [[[
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
]]];

// 1×1×2×2 filter (edge detector)
const weights: Tensor4D = [[[[1, -1], [1, -1]]]];
const bias = [0];

console.log("Input:", input[0][0]);
// 2×2 filter, stride 2 → 2×2 output
const convOutput = conv2d(input, weights, bias, 1, 0);
console.log("\\nConvolution output:", convOutput[0][0]);
// [[-4, -4], [-4, -4]]

const pooled = maxPool2d(input, 2, 2);
console.log("\\nMax pooled (2x2, stride 2):", pooled[0][0]);
// [[6, 8], [14, 16]]`;

function CodeTab() {
    return (
        <>
            <p>
                Implementing convolution from scratch in TypeScript builds intuition for how
                the sliding window operation works. This is the same algorithm PyTorch uses,
                just slower!
            </p>
            <CodeBlock code={TS_CODE} filename="cnn.ts" lang="typescript" />
            <div className="ch6-callout">
                <strong>Note:</strong> Real implementations use highly optimized libraries
                (cuDNN, oneDNN) that run 100-1000× faster by exploiting parallelism on GPUs
                and vectorized CPU instructions.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const INTRODUCTION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
