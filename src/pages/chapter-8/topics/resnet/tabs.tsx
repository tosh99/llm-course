import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

interface TlItem {
    year: string
    title: string
    context: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">Context</div>
            <div className="ch-tl-body">{item.context}</div>
            <div className="ch-tl-section-label">What Changed</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Impact</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2015",
            title: "ResNet Solves the Degradation Problem",
            context:
                "By 2015, researchers knew deeper networks should perform better, but attempts to train very deep networks (30+ layers) actually did worse than shallow ones. Training error increased with depth—a paradox.",
            what:
                "Kaiming He et al. at Microsoft Research introduced ResNet. Instead of learning H(x), each layer learns F(x) = H(x) - x—the residual. The output is F(x) + x via skip connections. This is always at least as easy as learning H(x) directly.",
            impact:
                "ResNet-152 won ILSVRC 2015 with 3.57% error, better than human performance. But more importantly: ResNet made networks of 1000+ layers possible. Every modern architecture uses skip connections now.",
        },
        {
            year: "2015–2020",
            title: "Residual Connections Become Universal",
            context:
                "ResNet's skip connections were initially seen as a CNN trick. But the principle proved much more general.",
            what:
                "Residual connections appeared in RNNs, GANs, and eventually Transformers. The Transformer architecture is essentially self-attention layers with residual connections and layer normalization.",
            impact:
                "Residual learning is now a fundamental technique in deep learning. From computer vision to NLP to speech synthesis, skip connections enable training of the deepest, most powerful models.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>ResNet: The Highway Around Problems</h2>

            <Analogy label="The Telephone Game Problem">
                Imagine playing a game where you whisper a message through 100 friends in a row.
                By the end, the message is garbled, right? The more people (layers), the worse it gets.
                <br /><br />
                That's what was happening with deep neural networks. By the time training signals
                traveled back through 30+ layers, they became so tiny ("vanishing gradients") that
                early layers couldn't learn properly. Deeper networks were actually performing WORSE!
            </Analogy>

            <Analogy label="The Highway Solution">
                ResNet's brilliant idea: build a highway that goes AROUND each layer!
                <br /><br />
                Imagine a city with roads between buildings. If a road is blocked, traffic can
                still flow on the highway. In ResNet, information can either take the "normal road"
                (through the layer) or the "highway" (skip connection) that bypasses it entirely.
            </Analogy>

            <DefBlock label="Learning the Difference">
                Instead of learning "make this picture into a cat picture," each layer learns
                "what small changes would help improve this picture?" — the residual or difference.
                <br /><br />
                This is MUCH easier! If the picture is already mostly correct, the residual
                is nearly zero. If it's very wrong, the residual learns what to fix.
                Learning small changes is easier than learning everything from scratch!
            </DefBlock>

            <Analogy label="Two Types of Blocks">
                ResNet uses two building blocks:
                <br /><br />
                <strong>Basic Block (ResNet-18/34):</strong> Two 3×3 convolutions with a highway around them.<br />
                <strong>Bottleneck Block (ResNet-50/101/152):</strong> Three convolutions (1×1, 3×3, 1×1) with a highway.
                The bottleneck saves computation by first reducing channels, processing, then expanding back.
            </Analogy>

            <Analogy label="Why Skip Connections Matter">
                Think of the highway as a "gradient superhighway." When the network makes a mistake,
                it needs to send error signals backward to fix it. With skip connections, these
                signals can zoom straight back without getting weaker at each layer.
                <br /><br />
                This made training 152-layer networks possible—deeper than anything before!
                It also made 1000+ layer networks possible (though they're rarely needed).
            </Analogy>

            <div className="ch-callout">
                <strong>Everywhere now:</strong> The skip connection idea is used in EVERY modern
                AI—from GPT writing text to DALL-E creating images! It started with ResNet but
                became a universal building block.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>ResNet: Solving the Degradation Problem</h2>

            <p>
                By 2015, a paradox had emerged: deeper neural networks should be more expressive
                and perform better, but in practice, networks beyond ~20 layers had <em>higher</em>
                training error than shallower ones. This wasn't overfitting—the deep networks
                couldn't even learn the training data well.
            </p>

            <h3>The Degradation Problem</h3>
            <p>
                Intuitively, if a 20-layer network works, a 30-layer version should work at least
                as well: the extra 10 layers could just learn the identity mapping (output = input)
                and preserve the previous solution. But gradient descent couldn't find this solution.
            </p>

            <DefBlock label="Residual Learning Formulation">
                Instead of having layers learn the desired mapping H(x), ResNet has them learn
                the residual F(x) = H(x) - x. The layer output is:
                <br /><br />
                <strong>y = F(x) + x</strong>
                <br /><br />
                If the optimal mapping is close to identity, F(x) just needs to learn values near
                zero—much easier than learning identity through multiple non-linear transformations.
                The skip connection provides a "gradient highway" allowing information to flow
                freely during both forward and backward passes.
            </DefBlock>

            <h3>Two Block Architectures</h3>
            <p>
                <strong>Basic Block (ResNet-18/34):</strong> Two 3×3 convolutions with BatchNorm and ReLU.
                Skip connection simply adds input to output. Used for shallower networks.
            </p>
            <p>
                <strong>Bottleneck Block (ResNet-50/101/152):</strong> Three convolutions in a
                1×1→3×3→1×1 pattern. The first 1×1 reduces channels (bottleneck), the 3×3 processes
                efficiently, and the final 1×1 restores channel depth. This reduces computation
                while maintaining representational power.
            </p>

            <h3>Dimension Matching</h3>
            <p>
                When input and output have different dimensions (e.g., when spatial downsampling
                occurs), the skip connection uses a 1×1 convolution with stride 2 to project the
                input to the correct dimensions. This "projection shortcut" preserves the
                residual learning principle.
            </p>

            <div className="ch-callout">
                <strong>BatchNorm is crucial:</strong> ResNet pairs skip connections with BatchNorm
                to normalize activations. This combination enables training networks with 1000+
                layers. Without BatchNorm, gradients would still destabilize during training.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>ResNet: Mathematical Analysis</h2>

            <h3>Residual Learning Formulation</h3>
            <p>
                Let H(x) be the desired mapping. In standard networks, we learn:
            </p>
            <MathBlock tex="y = H(x) = F(x, W)" />
            <p>
                In residual networks, the layer computes:
            </p>
            <MathBlock tex="y = F(x, W) + x" />
            <p>
                where F(x, W) is the residual function to be learned.
            </p>

            <h3>Backward Pass—Gradient Flow</h3>
            <p>
                During backpropagation, the gradient through a residual block:
            </p>
            <MathBlock tex="\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial x} = \frac{\partial L}{\partial y} \cdot \left(1 + \frac{\partial F}{\partial x}\right)" />
            <p>
                Even if ∂F/∂x ≈ 0 (the residual path vanishes), the gradient can still flow
                through the identity term: ∂L/∂y · 1. This prevents vanishing gradients
                even in networks with 100+ layers.
            </p>

            <h3>Dimension Matching</h3>
            <p>
                When input and output have different dimensions, we use a linear projection W_s:
            </p>
            <MathBlock tex="y = F(x, W) + W_s x" />
            <p>
                Typically implemented via 1×1 convolutions when spatial dimensions match
                but channel counts differ, or via strided convolutions when spatial
                downsampling is needed.
            </p>

            <h3>Bottleneck Block FLOPs</h3>
            <p>For a bottleneck block with input C, intermediate C/4 (the "bottleneck"):</p>
            <MathBlock tex="\text{FLOPs} = H \times W \times (1^2 \cdot C \cdot \tfrac{C}{4} + 3^2 \cdot \tfrac{C}{4} \cdot \tfrac{C}{4} + 1^2 \cdot \tfrac{C}{4} \cdot C)" />
            <p>
                ≈ H×W×(C²/4 + 9C²/16 + C²/4) = H×W×(17C²/16)
            </p>
            <p>
                Compare to two 3×3 convs (basic block): 2 × 9 × H×W×C² = 18H×W×C².
                Bottleneck is nearly the same compute but with more non-linearities
                and better gradient flow.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── ResNet: Identity & Bottleneck Blocks ────────────────────────────────────────

class BasicBlock(nn.Module):
    """
    Basic residual block for ResNet-18/34.
    Two 3×3 convolutions with skip connection.
    """
    expansion = 1

    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()

        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3,
                               stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3,
                               stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)

        # Shortcut connection
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            # Projection shortcut when dimensions don't match
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=1,
                         stride=stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )

    def forward(self, x):
        identity = x

        out = torch.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))

        # Add residual: F(x) + x
        out += self.shortcut(identity)
        out = torch.relu(out)

        return out


class BottleneckBlock(nn.Module):
    """
    Bottleneck block for ResNet-50/101/152.
    1×1 → 3×3 → 1×1 with skip connection.
    """
    expansion = 4  # Output channels are 4× input

    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()

        # 1×1 reduce
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)

        # 3×3 process
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3,
                               stride=stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)

        # 1×1 expand
        self.conv3 = nn.Conv2d(out_channels, out_channels * self.expansion,
                               kernel_size=1, bias=False)
        self.bn3 = nn.BatchNorm2d(out_channels * self.expansion)

        # Shortcut
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels * self.expansion:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels * self.expansion,
                         kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(out_channels * self.expansion)
            )

    def forward(self, x):
        identity = x

        out = torch.relu(self.bn1(self.conv1(x)))
        out = torch.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))

        # F(x) + x
        out += self.shortcut(identity)
        out = torch.relu(out)

        return out


class ResNet(nn.Module):
    """ResNet architecture."""

    def __init__(self, block, layers, num_classes=1000):
        super().__init__()

        self.in_channels = 64

        # Initial conv
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        # Residual layers
        self.layer1 = self._make_layer(block, 64, layers[0], stride=1)
        self.layer2 = self._make_layer(block, 128, layers[1], stride=2)
        self.layer3 = self._make_layer(block, 256, layers[2], stride=2)
        self.layer4 = self._make_layer(block, 512, layers[3], stride=2)

        # Classifier
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512 * block.expansion, num_classes)

        self._initialize_weights()

    def _make_layer(self, block, out_channels, num_blocks, stride):
        layers = []
        layers.append(block(self.in_channels, out_channels, stride))
        self.in_channels = out_channels * block.expansion

        for _ in range(1, num_blocks):
            layers.append(block(self.in_channels, out_channels, stride=1))

        return nn.Sequential(*layers)

    def forward(self, x):
        x = torch.relu(self.bn1(self.conv1(x)))
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)

        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)


# Factory functions for standard ResNets
def resnet18(num_classes=1000):
    return ResNet(BasicBlock, [2, 2, 2, 2], num_classes)

def resnet34(num_classes=1000):
    return ResNet(BasicBlock, [3, 4, 6, 3], num_classes)

def resnet50(num_classes=1000):
    return ResNet(BottleneckBlock, [3, 4, 6, 3], num_classes)

def resnet101(num_classes=1000):
    return ResNet(BottleneckBlock, [3, 4, 23, 3], num_classes)

def resnet152(num_classes=1000):
    return ResNet(BottleneckBlock, [3, 8, 36, 3], num_classes)


# ── Usage ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    models = [
        ('ResNet-18', resnet18()),
        ('ResNet-34', resnet34()),
        ('ResNet-50', resnet50()),
        ('ResNet-101', resnet101()),
        ('ResNet-152', resnet152()),
    ]

    x = torch.randn(2, 3, 224, 224)

    for name, model in models:
        y = model(x)
        params = sum(p.numel() for p in model.parameters())
        print(f"{name}: {params:,} params, output shape: {y.shape}")

    print("\nResNet made 152-layer networks possible—thanks to skip connections!")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of ResNet with both BasicBlock (for ResNet-18/34)
                and BottleneckBlock (for ResNet-50/101/152). The key is the identity
                shortcut with proper dimension matching.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="resnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key implementation details:</strong> 1) BatchNorm is crucial for
                ResNet training. 2) Projection shortcuts handle dimension changes.
                3) Bottleneck blocks use 1×1→3×3→1×1 structure for efficiency.
            </div>
        </>
    )
}

const TS_CODE = `// ── ResNet in TypeScript ──────────────────────────────────────────────────────
// Educational implementation showing residual blocks and skip connections

type Tensor4D = number[][][][];

// ── 2D Convolution with BatchNorm (simplified) ────────────────────────────────────

function conv2d(
    input: Tensor4D,
    weights: Tensor4D,
    bias: number[],
    stride: number = 1,
    padding: number = 0
): Tensor4D {
    const [batch, in_ch, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const [out_ch, _, k_h, k_w] = [weights.length, weights[0].length, weights[0][0].length, weights[0][0][0].length];
    
    const out_h = Math.floor((in_h - k_h + 2 * padding) / stride) + 1;
    const out_w = Math.floor((in_w - k_w + 2 * padding) / stride) + 1;
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(out_ch).fill(0).map(() =>
            Array(out_h).fill(0).map(() =>
                Array(out_w).fill(0)
            )
        )
    );
    
    for (let b = 0; b < batch; b++) {
        for (let oc = 0; oc < out_ch; oc++) {
            for (let oh = 0; oh < out_h; oh++) {
                for (let ow = 0; ow < out_w; ow++) {
                    let sum = bias[oc];
                    
                    for (let ic = 0; ic < in_ch; ic++) {
                        for (let kh = 0; kh < k_h; kh++) {
                            for (let kw = 0; kw < k_w; kw++) {
                                const ih = oh * stride + kh - padding;
                                const iw = ow * stride + kw - padding;
                                if (ih >= 0 && ih < in_h && iw >= 0 && iw < in_w) {
                                    sum += input[b][ic][ih][iw] * weights[oc][ic][kh][kw];
                                }
                            }
                        }
                    }
                    
                    // No ReLU yet - will apply after skip connection
                    output[b][oc][oh][ow] = sum;
                }
            }
        }
    }
    
    return output;
}

// ── Batch Normalization (simplified) ───────────────────────────────────────────

function batchNorm(input: Tensor4D, gamma: number[], beta: number[], eps: number = 1e-5): Tensor4D {
    const [batch, channels, height, width] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(channels).fill(0).map(() =>
            Array(height).fill(0).map(() =>
                Array(width).fill(0)
            )
        )
    );
    
    for (let c = 0; c < channels; c++) {
        // Calculate mean across batch and spatial dims
        let mean = 0;
        for (let b = 0; b < batch; b++) {
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    mean += input[b][c][h][w];
                }
            }
        }
        mean /= batch * height * width;
        
        // Calculate variance
        let variance = 0;
        for (let b = 0; b < batch; b++) {
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    variance += (input[b][c][h][w] - mean) ** 2;
                }
            }
        }
        variance /= batch * height * width;
        
        // Normalize and scale
        for (let b = 0; b < batch; b++) {
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    const normalized = (input[b][c][h][w] - mean) / Math.sqrt(variance + eps);
                    output[b][c][h][w] = gamma[c] * normalized + beta[c];
                }
            }
        }
    }
    
    return output;
}

// ── ReLU Activation ─────────────────────────────────────────────────────────────

function relu(input: Tensor4D): Tensor4D {
    return input.map(batch => 
        batch.map(channel => 
            channel.map(row => 
                row.map(val => Math.max(0, val))
            )
        )
    );
}

// ── Max Pooling ─────────────────────────────────────────────────────────────────

function maxPool2d(input: Tensor4D, size: number = 3, stride: number = 2, padding: number = 1): Tensor4D {
    const [batch, channels, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const out_h = Math.floor((in_h - size + 2 * padding) / stride) + 1;
    const out_w = Math.floor((in_w - size + 2 * padding) / stride) + 1;
    
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
                    
                    for (let ph = 0; ph < size; ph++) {
                        for (let pw = 0; pw < size; pw++) {
                            const ih = oh * stride + ph - padding;
                            const iw = ow * stride + pw - padding;
                            if (ih >= 0 && ih < in_h && iw >= 0 && iw < in_w) {
                                maxVal = Math.max(maxVal, input[b][c][ih][iw]);
                            }
                        }
                    }
                    
                    output[b][c][oh][ow] = maxVal;
                }
            }
        }
    }
    
    return output;
}

// ── Global Average Pooling ──────────────────────────────────────────────────────

function globalAvgPool2d(input: Tensor4D): number[][] {
    const [batch, channels, height, width] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    
    const output: number[][] = Array(batch).fill(0).map(() => Array(channels).fill(0));
    
    for (let b = 0; b < batch; b++) {
        for (let c = 0; c < channels; c++) {
            let sum = 0;
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    sum += input[b][c][h][w];
                }
            }
            output[b][c] = sum / (height * width);
        }
    }
    
    return output;
}

// ── Basic Block (ResNet-18/34) ───────────────────────────────────────────────────

interface BasicBlockWeights {
    conv1: Tensor4D;
    bias1: number[];
    bn1_gamma: number[];
    bn1_beta: number[];
    conv2: Tensor4D;
    bias2: number[];
    bn2_gamma: number[];
    bn2_beta: number[];
    shortcut_conv?: Tensor4D;  // For projection when dimensions change
    shortcut_bias?: number[];
    shortcut_bn_gamma?: number[];
    shortcut_bn_beta?: number[];
}

function basicBlock(input: Tensor4D, weights: BasicBlockWeights, stride: number = 1): Tensor4D {
    const identity = input;
    
    // Conv1 → BN → ReLU
    let out = conv2d(input, weights.conv1, weights.bias1, stride, 1);  // padding=1 for 3×3
    out = batchNorm(out, weights.bn1_gamma, weights.bn1_beta);
    out = relu(out);
    
    // Conv2 → BN (no ReLU yet)
    out = conv2d(out, weights.conv2, weights.bias2, 1, 1);
    out = batchNorm(out, weights.bn2_gamma, weights.bn2_beta);
    
    // Shortcut connection
    let shortcut = identity;
    if (stride !== 1 || weights.shortcut_conv) {
        // Projection shortcut when dimensions don't match
        shortcut = conv2d(identity, weights.shortcut_conv!, weights.shortcut_bias!, stride, 0);
        shortcut = batchNorm(shortcut, weights.shortcut_bn_gamma!, weights.shortcut_bn_beta!);
    }
    
    // F(x) + x (element-wise addition)
    for (let b = 0; b < out.length; b++) {
        for (let c = 0; c < out[b].length; c++) {
            for (let h = 0; h < out[b][c].length; h++) {
                for (let w = 0; w < out[b][c][h].length; w++) {
                    out[b][c][h][w] += shortcut[b][c][h][w];
                }
            }
        }
    }
    
    // Final ReLU
    return relu(out);
}

// ── Bottleneck Block (ResNet-50/101/152) ────────────────────────────────────────

interface BottleneckBlockWeights {
    conv1: Tensor4D;  // 1×1 reduce
    bias1: number[];
    bn1_gamma: number[];
    bn1_beta: number[];
    conv2: Tensor4D;  // 3×3 process
    bias2: number[];
    bn2_gamma: number[];
    bn2_beta: number[];
    conv3: Tensor4D;  // 1×1 expand
    bias3: number[];
    bn3_gamma: number[];
    bn3_beta: number[];
    shortcut_conv?: Tensor4D;
    shortcut_bias?: number[];
    shortcut_bn_gamma?: number[];
    shortcut_bn_beta?: number[];
}

function bottleneckBlock(input: Tensor4D, weights: BottleneckBlockWeights, stride: number = 1, expansion: number = 4): Tensor4D {
    const identity = input;
    
    // 1×1 → BN → ReLU
    let out = conv2d(input, weights.conv1, weights.bias1, 1, 0);
    out = batchNorm(out, weights.bn1_gamma, weights.bn1_beta);
    out = relu(out);
    
    // 3×3 → BN → ReLU
    out = conv2d(out, weights.conv2, weights.bias2, stride, 1);
    out = batchNorm(out, weights.bn2_gamma, weights.bn2_beta);
    out = relu(out);
    
    // 1×1 → BN (no ReLU)
    out = conv2d(out, weights.conv3, weights.bias3, 1, 0);
    out = batchNorm(out, weights.bn3_gamma, weights.bn3_beta);
    
    // Shortcut
    let shortcut = identity;
    if (stride !== 1 || weights.shortcut_conv) {
        shortcut = conv2d(identity, weights.shortcut_conv!, weights.shortcut_bias!, stride, 0);
        shortcut = batchNorm(shortcut, weights.shortcut_bn_gamma!, weights.shortcut_bn_beta!);
    }
    
    // F(x) + x
    for (let b = 0; b < out.length; b++) {
        for (let c = 0; c < out[b].length; c++) {
            for (let h = 0; h < out[b][c].length; h++) {
                for (let w = 0; w < out[b][c][h].length; w++) {
                    out[b][c][h][w] += shortcut[b][c][h][w];
                }
            }
        }
    }
    
    return relu(out);
}

// ── ResNet Layer Builder ─────────────────────────────────────────────────────────

function makeResNetLayer(
    input: Tensor4D,
    blocks: BasicBlockWeights[] | BottleneckBlockWeights[],
    in_channels: number,
    out_channels: number,
    stride: number,
    isBottleneck: boolean
): Tensor4D {
    let x = input;
    
    for (let i = 0; i < blocks.length; i++) {
        const block_stride = i === 0 ? stride : 1;  // Only first block may downsample
        
        if (isBottleneck) {
            x = bottleneckBlock(x, blocks[i] as BottleneckBlockWeights, block_stride);
        } else {
            x = basicBlock(x, blocks[i] as BasicBlockWeights, block_stride);
        }
    }
    
    return x;
}

// ── Full ResNet Forward Pass ────────────────────────────────────────────────────

console.log("ResNet Architecture Overview:");
console.log("=============================");
console.log("");
console.log("ResNet-18 (BasicBlock):");
console.log("  Layer1: 2 blocks, 64 channels, stride 1");
console.log("  Layer2: 2 blocks, 128 channels, stride 2 (downsample)");
console.log("  Layer3: 2 blocks, 256 channels, stride 2");
console.log("  Layer4: 2 blocks, 512 channels, stride 2");
console.log("  Total: 8 blocks + 1 initial conv = ~18 learnable layers");
console.log("  Parameters: ~11.7M");
console.log("");
console.log("ResNet-50 (BottleneckBlock):");
console.log("  Layer1: 3 blocks, 64→256 channels, stride 1");
console.log("  Layer2: 4 blocks, 128→512 channels, stride 2");
console.log("  Layer3: 6 blocks, 256→1024 channels, stride 2");
console.log("  Layer4: 3 blocks, 512→2048 channels, stride 2");
console.log("  Total: 16 blocks × 3 convs + 1 initial = ~50 layers");
console.log("  Parameters: ~25.6M");
console.log("");
console.log("Key insight: Bottleneck uses 1×1→3×3→1×1 to reduce computation.");
console.log("Despite more layers, ResNet-50 is only ~2× ResNet-18's parameters!");`;

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of ResNet's residual blocks showing skip connections,
                batch normalization, and the identity/projection shortcut logic.
            </p>
            <CodeBlock code={TS_CODE} filename="resnet.ts" lang="typescript" />
            <div className="ch-callout">
                <strong>Skip connection math:</strong> The residual formulation y = F(x) + x
                means gradients flow through both paths during backprop. Even if F(x) has
                near-zero gradients, ∂y/∂x includes the identity term (1), preventing
                vanishing gradients in deep networks.
            </div>
        </>
    )
}

export const RESNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
