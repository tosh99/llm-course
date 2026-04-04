import { Analogy, CodeBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>CNN Building Blocks: From LeNet to Modern Architectures</h2>

            <p>
                Modern CNNs, like their LeNet-5 predecessor, are constructed from a small set of fundamental
                operations. Understanding these building blocks is essential for reading architectures like
                ResNet and DenseNet.
            </p>

            <div className="ch6-timeline">
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">Conv</div>
                    <div className="ch6-tl-title">The Core Operation</div>
                    <div className="ch6-tl-body">
                        The sliding dot product that detects local patterns. Introduced by Fukushima's
                        Neocognitron (1980), perfected by LeCun (1989). Still the workhorse of modern CNNs.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">Pool</div>
                    <div className="ch6-tl-title">Spatial Aggregation</div>
                    <div className="ch6-tl-body">
                        Subsampling for translation invariance. LeNet used average pooling; modern
                        networks prefer max pooling. Stride is key — typically 2× to halve dimensions.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">Activation</div>
                    <div className="ch6-tl-title">Non-linearity</div>
                    <div className="ch6-tl-body">
                        Tanh and sigmoid in early architectures, replaced by ReLU (2010) for vanishing
                        gradient resistance. Now includes BatchNorm and ResNet-style activations.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">Flatten → FC</div>
                    <div className="ch6-tl-title">Classification</div>
                    <div className="ch6-tl-body">
                        Converting spatial features to class probabilities. Modern networks often
                        use Global Average Pooling instead to reduce parameters.
                    </div>
                </div>
            </div>

            <div className="ch6-callout">
                <strong>The Modern Pattern:</strong> [Conv → BN → ReLU → Conv → BN → ReLU → Pool] × N →
                [GlobalAvgPool → FC] — a pattern you'll see in ResNet, DenseNet, and EfficientNet.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>CNN Building Blocks: LEGO for AI</h2>

            <Analogy label="The Magnifying Glass (Convolution)">
                Imagine you're looking through a magnifying glass at a picture. The glass slides
                across the image, and at each spot, you check for specific things — stripes, dots,
                edges. This is <strong>convolution</strong>! The magnifying glass is like a filter,
                and it finds patterns wherever they appear.
            </Analogy>

            <Analogy label="The Biggest Spot (Pooling)">
                After sliding your magnifying glass, imagine you have a smaller piece of paper.
                On each section of your feature map, you pick the brightest or most active spot
                and write that down. This makes your picture smaller but keeps the important parts!
                This is called <strong>pooling</strong>.
            </Analogy>

            <Analogy label="The Magic Trick (Activation)">
                Sometimes finding a pattern is exciting, and sometimes it's just "meh". Activation
                functions decide! <strong>ReLU (Rectified Linear Unit)</strong> is like saying:
                "If you found something cool, keep it! If not, forget about it (set to zero)." This
                helps the network focus on what matters.
            </Analogy>

            <Analogy label="The Big List (Flatten → FC)">
                After all that searching, you have lots of little maps showing where patterns appear.
                You flatten all of that into one big list (like making a long line of clues). Then
                the fully-connected layer looks at ALL the clues together to make a final decision!
            </Analogy>

            <Analogy label="Putting It All Together">
                Here's the recipe: Slide magnifying glasses to find patterns → Squint to keep only
                the brightest spots → Decide what's exciting → Look at all evidence together →
                Make a guess! In code: Conv → Pool → ReLU → Flatten → FC → Done!
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>CNN Building Blocks Explained</h2>

            <h3>1. Convolution (Conv)</h3>
            <p>
                The foundational operation. A filter (kernel) slides over the input, computing the
                dot product at each position. This produces a <strong>feature map</strong> showing where
                the pattern appears.
            </p>
            <p>
                Key hyperparameters:
            </p>
            <ul>
                <li><strong>Kernel size (k)</strong> — Dimensions of the filter (typically 3×3 or 5×5)</li>
                <li><strong>Stride (s)</strong> — Step size (s=2 halves spatial dimensions)</li>
                <li><strong>Padding (p)</strong> — Zeros added to preserve dimensions (typically (k-1)/2)</li>
                <li><strong>Output channels</strong> — Number of distinct filters learned (depth of output)</li>
            </ul>

            <h3>2. Pooling</h3>
            <p>
                Reduces spatial dimensions while preserving the strongest activations:
            </p>
            <ul>
                <li><strong>Max Pooling</strong> — Takes the maximum value in each k×k window (preserves peaks)</li>
                <li><strong>Average Pooling</strong> — Takes the mean (smoother, used in early networks)</li>
                <li><strong>Global Average Pooling</strong> — Averages entire feature map to 1 value per channel</li>
            </ul>

            <h3>3. Activation Functions</h3>
            <p>
                Introduces non-linearity after convolutions:
            </p>
            <ul>
                <li><strong>ReLU (Rectified Linear Unit)</strong> — f(x) = max(0, x). Fast, avoids vanishing gradients</li>
                <li><strong>Tanh</strong> — f(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ). Smooth, but suffers from vanishing gradients</li>
            </ul>

            <h3>4. Flatten + Fully-Connected</h3>
            <p>
                After extracting spatial features, the 3D tensor (H × W × C) is flattened to a 1D
                vector and passed through fully-connected layers for classification. Modern networks
                use <strong>Global Average Pooling</strong> to reduce parameters.
            </p>

            <h3>The Classic Pattern</h3>
            <div style={{ background: '#111115', padding: '12px', borderRadius: '4px', marginTop: '16px', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
                [Conv → ReLU → Conv → ReLU → Pool] × N → Flatten → [FC → ReLU → Dropout] × M → Output
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The Mathematics of CNN Building Blocks</h2>

            <h3>Convolution Formula</h3>
            <p>
                For input matrix <strong>X</strong>, kernel <strong>K</strong> of size k×k:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                (X * K)[i, j] = Σ_m Σ_n X[i+m, j+n] · K[m, n] + b
            </div>

            <h3>Output Size Formula</h3>
            <p>
                For input size N, kernel size k, stride s, padding p:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Output Size = ⌊(N - k + 2p) / s⌋ + 1
            </div>
            <p>
                With "same" padding (p = ⌊(k-1)/2⌋), output size equals input size when stride=1.
            </p>

            <h3>Parameter Count</h3>
            <p>
                For a conv layer with C_in input channels, C_out output channels, kernel k×k:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Parameters = (k² · C_in + 1) × C_out
            </div>

            <h3>Receptive Field Growth</h3>
            <p>
                Each layer sees progressively more of the input. For stacked 3×3 convs:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                RF(n) = 2n + 1
            </div>
            <ul>
                <li>1 layer: 3×3 receptive field</li>
                <li>2 layers: 5×5 receptive field</li>
                <li>3 layers: 7×7 receptive field</li>
            </ul>

            <h3>Activation Functions</h3>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                ReLU: f(x) = max(0, x)<br/>
                Derivative: f'(x) = 1 if x {`>`} 0, else 0
            </div>
            <p>
                ReLU's derivative is simple (0 or 1), avoiding vanishing gradients that plagued
                sigmoid and tanh.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── CNN Building Blocks in PyTorch ─────────────────────────────────────────────

class CNNBlock(nn.Module):
    """Standard Conv-BN-ReLU block."""
    
    def __init__(self, in_ch, out_ch, kernel=3, stride=1, padding=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel, stride, padding)
        self.bn = nn.BatchNorm2d(out_ch)  # Modern addition
        self.relu = nn.ReLU(inplace=True)
    
    def forward(self, x):
        x = self.conv(x)
        x = self.bn(x)
        x = self.relu(x)
        return x


class PoolingBlock(nn.Module):
    """Max pooling with optional dropout."""
    
    def __init__(self, kernel=2, stride=2, dropout=0.0):
        super().__init__()
        self.pool = nn.MaxPool2d(kernel, stride)
        self.dropout = nn.Dropout2d(dropout) if dropout > 0 else None
    
    def forward(self, x):
        x = self.pool(x)
        if self.dropout:
            x = self.dropout(x)
        return x


class ModernCNN(nn.Module):
    """Example CNN using building blocks."""
    
    def __init__(self, num_classes=10):
        super().__init__()
        
        # Block 1: 32×32 → 16×16
        self.block1 = nn.Sequential(
            CNNBlock(1, 32, 3, 1, 1),   # 32×32
            CNNBlock(32, 32, 3, 1, 1),  # 32×32
            PoolingBlock(2, 2),          # 16×16
        )
        
        # Block 2: 16×16 → 8×8
        self.block2 = nn.Sequential(
            CNNBlock(32, 64, 3, 1, 1),  # 16×16
            CNNBlock(64, 64, 3, 1, 1),  # 16×16
            PoolingBlock(2, 2),          # 8×8
        )
        
        # Block 3: 8×8 → 4×4
        self.block3 = nn.Sequential(
            CNNBlock(64, 128, 3, 1, 1), # 8×8
            PoolingBlock(2, 2),           # 4×4
        )
        
        # Classifier: Global Average Pooling instead of Flatten + FC
        self.global_pool = nn.AdaptiveAvgPool2d(1)  # 4×4 → 1×1
        self.fc = nn.Linear(128, num_classes)
    
    def forward(self, x):
        # Feature extraction
        x = self.block1(x)    # [B, 32, 16, 16]
        x = self.block2(x)    # [B, 64, 8, 8]
        x = self.block3(x)    # [B, 128, 4, 4]
        
        # Classification
        x = self.global_pool(x)  # [B, 128, 1, 1]
        x = x.view(x.size(0), -1)  # Flatten: [B, 128]
        x = self.fc(x)  # [B, 10]
        
        return x


# Test
cnn = ModernCNN(10)
x = torch.randn(4, 1, 32, 32)
out = cnn(x)
print(f"Input:  {x.shape}")
print(f"Output: {out.shape}")

total = sum(p.numel() for p in cnn.parameters())
print(f"\\nParameters: {total:,}")`;

function PythonTab() {
    return (
        <>
            <p>
                Modern CNNs use standardized blocks. The key pattern is Conv→BN→ReLU, often
                repeated before pooling. Notice how <code>AdaptiveAvgPool2d</code> replaces
                flattening, reducing parameters significantly.
            </p>
            <CodeBlock code={PY_CODE} filename="building_blocks.py" lang="python" />
            <div className="ch6-callout">
                <strong>Modern pattern:</strong> BatchNorm after conv, ReLU after BN, Global Average
                Pooling before FC. Fewer parameters, faster training, better generalization.
            </div>
        </>
    )
}

const TS_CODE = `// ── CNN Building Blocks in TypeScript ─────────────────────────────────────────

type Tensor4D = number[][][][];
type Vec = number[];

// ── Block Functions ───────────────────────────────────────────────────────────

function relu(x: number): number {
    return Math.max(0, x);
}

function convBlock(
    input: Tensor4D,
    weight: number[][][],
    bias: number[],
    stride: number = 1
): Tensor4D {
    const [batch, in_ch, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const [out_ch, _, k, _] = [weight.length, weight[0].length, weight[0][0].length, weight[0][0][0].length];
    
    const out_h = Math.floor((in_h - k) / stride) + 1;
    const out_w = Math.floor((in_w - k) / stride) + 1;
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(out_ch).fill(0).map(() =>
            Array(out_h).fill(0).map(() => Array(out_w).fill(0))
        )
    );
    
    for (let b = 0; b < batch; b++) {
        for (let oc = 0; oc < out_ch; oc++) {
            for (let oh = 0; oh < out_h; oh++) {
                for (let ow = 0; ow < out_w; ow++) {
                    let sum = bias[oc];
                    for (let ic = 0; ic < in_ch; ic++) {
                        for (let kh = 0; kh < k; kh++) {
                            for (let kw = 0; kw < k; kw++) {
                                const ih = oh * stride + kh;
                                const iw = ow * stride + kw;
                                sum += input[b][ic][ih][iw] * weight[oc][ic][kh][kw];
                            }
                        }
                    }
                    output[b][oc][oh][ow] = relu(sum);
                }
            }
        }
    }
    
    return output;
}

function maxPoolBlock(input: Tensor4D, poolSize: number = 2, stride: number = 2): Tensor4D {
    const [batch, ch, h, w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const out_h = Math.floor((h - poolSize) / stride) + 1;
    const out_w = Math.floor((w - poolSize) / stride) + 1;
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(ch).fill(0).map(() =>
            Array(out_h).fill(0).map(() => Array(out_w).fill(0))
        )
    );
    
    for (let b = 0; b < batch; b++) {
        for (let c = 0; c < ch; c++) {
            for (let oh = 0; oh < out_h; oh++) {
                for (let ow = 0; ow < out_w; ow++) {
                    let max = -Infinity;
                    for (let ph = 0; ph < poolSize; ph++) {
                        for (let pw = 0; pw < poolSize; pw++) {
                            const val = input[b][c][oh * stride + ph][ow * stride + pw];
                            max = Math.max(max, val);
                        }
                    }
                    output[b][c][oh][ow] = max;
                }
            }
        }
    }
    
    return output;
}

// ── Chain Blocks Together ─────────────────────────────────────────────────────

function cnnForward(input: Tensor4D, layers: any[]): Tensor4D {
    let x = input;
    for (const layer of layers) {
        if (layer.type === 'conv') {
            x = convBlock(x, layer.weight, layer.bias, layer.stride);
        } else if (layer.type === 'pool') {
            x = maxPoolBlock(x, layer.size, layer.stride);
        }
    }
    return x;
}

// ── Example Block Configuration ───────────────────────────────────────────────

const layers = [
    { type: 'conv', weight: [], bias: [], stride: 1 },   // Block 1
    { type: 'conv', weight: [], bias: [], stride: 1 },   // Block 1
    { type: 'pool', size: 2, stride: 2 },               // Block 1
    { type: 'conv', weight: [], bias: [], stride: 1 },   // Block 2
    { type: 'pool', size: 2, stride: 2 },               // Block 2
];

// This modular design matches PyTorch nn.Sequential!`;

function CodeTab() {
    return (
        <>
            <p>
                Building CNNs from blocks in TypeScript shows the modularity clearly.
                Each block transforms dimensions predictably, making network design
                systematic.
            </p>
            <CodeBlock code={TS_CODE} filename="building-blocks.ts" lang="typescript" />
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const BUILDING_BLOCKS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
