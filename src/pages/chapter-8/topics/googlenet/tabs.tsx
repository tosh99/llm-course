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
        <div className="ch8-tl-item">
            <div className="ch8-tl-year">{item.year}</div>
            <div className="ch8-tl-title">{item.title}</div>
            <div className="ch8-tl-section-label">Context</div>
            <div className="ch8-tl-body">{item.context}</div>
            <div className="ch8-tl-section-label">What Changed</div>
            <div className="ch8-tl-body">{item.what}</div>
            <div className="ch8-tl-section-label">Impact</div>
            <div className="ch8-tl-body ch8-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2014",
            title: "GoogLeNet: Efficiency First",
            context:
                "VGGNet showed depth matters, but at 138M parameters, it was computationally expensive. Researchers at Google asked: could deep CNNs be more efficient?",
            what:
                'GoogLeNet (Szegedy et al., 2014) introduced the "Inception" module—computing 1×1, 3×3, and 5×5 convolutions in parallel, then concatenating results. The network was 22 layers deep but had only 6.7M parameters—20× fewer than AlexNet.',
            impact:
                "GoogLeNet proved that architectural innovation could match depth. Efficiency mattered just as much as accuracy. This led to modern mobile-optimized networks like MobileNet and EfficientNet.",
        },
        {
            year: "2015–2017",
            title: "Inception Evolves",
            context:
                "The original Inception module was computationally expensive. Google iterated rapidly, improving efficiency while maintaining accuracy.",
            what:
                "Inception-v2 (2015) added BatchNorm. Inception-v3 (2015) introduced factorized convolutions (7×7 = 7×1 + 1×7) and auxiliary classifiers. Inception-v4 (2017) combined Inception with ResNet's skip connections.",
            impact:
                "Inception became a family of architectures optimized for production. Google deployed them across products. The philosophy—multi-scale processing with efficiency—remains influential.",
        },
    ]

    return (
        <div className="ch8-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>GoogLeNet: Looking at Pictures Many Ways at Once</h2>

            <Analogy label="A Detective Squad">
                Imagine you're trying to find clues in a mystery photo. Some detectives use
                magnifying glasses to look at tiny details. Others use wide-angle lenses to see
                the big picture. Some look for specific shapes, while others check colors and
                textures.
                <br /><br />
                What if ALL these detectives looked at the photo at the same time, then shared
                what they found? That's the Inception idea—use different "windows" on the image
                simultaneously!
            </Analogy>

            <Analogy label="Four Teams Working Together">
                The Inception module has four detective teams working in parallel:
                <br /><br />
                <strong>Team 1×1:</strong> Quick summaries—like scanning a book's table of contents.<br />
                <strong>Team 3×3:</strong> Looking at small neighborhoods—finding local patterns.<br />
                <strong>Team 5×5:</strong> Looking at bigger patches—seeing larger structures.<br />
                <strong>Team Pool:</strong> Looking at the "average" of each area—finding dominant features.<br />
                <br />
                Each team writes down what they found, and all notes are combined into one big report!
            </Analogy>

            <DefBlock label="The 1×1 Bottleneck Trick">
                Here's the clever part: Before the 3×3 and 5×5 teams start, we use the 1×1 team
                to make a compressed summary. This reduces the amount of work needed!
                <br /><br />
                Imagine having 256 different colored crayons, but you know you'll only use the
                most important ones. The 1×1 convolution says: "Let me pick the 64 most useful
                colors first, then you only need to work with those!"
            </DefBlock>

            <Analogy label="Why No Big Final Layers?">
                Previous networks had giant "boss layers" at the end (fully-connected layers)
                with millions of connections. GoogLeNet said: "We don't need those!"
                <br /><br />
                Instead, it uses "average pooling"—take the average of each feature map at the
                end. This is like asking each detective team: "Give me one overall summary of
                what you found." Much simpler and faster!
            </Analogy>

            <div className="ch8-callout">
                <strong>Amazing fact:</strong> GoogLeNet has 22 layers but only 6.7 million
                parameters—less than AlexNet! The 1×1 bottlenecks and removing giant layers
                made it super efficient while being super deep.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GoogLeNet: Multi-Scale Processing</h2>

            <p>
                After VGGNet proved that depth matters through stacking simple 3×3 convolutions,
                researchers at Google asked a different question: can we process features at
                multiple scales simultaneously? Objects in images appear at different sizes—a
                distant bird vs. a close-up cat. Traditional CNNs must learn size-specific
                patterns at different layers. GoogLeNet's Inception module handles all scales
                in parallel.
            </p>

            <h3>The Inception Module Design</h3>
            <p>
                An Inception module runs four operations in parallel on the same input:
            </p>
            <ol>
                <li><strong>1×1 convolution:</strong> Point-wise feature mixing and dimensionality reduction</li>
                <li><strong>1×1 → 3×3:</strong> Small receptive field features with bottleneck</li>
                <li><strong>1×1 → 5×5:</strong> Larger receptive field features with bottleneck</li>
                <li><strong>3×3 max pool → 1×1:</strong> Pooling features with projection</li>
            </ol>

            <DefBlock label="The Bottleneck Principle">
                The 1×1 convolutions before 3×3 and 5×5 operations are crucial. Consider processing
                256 channels:
                <br /><br />
                • <strong>Naive 3×3:</strong> 256 input × 128 output × 3² = 294,912 operations<br />
                • <strong>With 1×1 bottleneck (64):</strong> (256×64×1²) + (64×128×3²) = 16,384 + 73,728 = 90,112 ops<br />
                • <strong>Savings:</strong> 69% reduction in computation!
                <br /><br />
                The 1×1 projects 256 channels down to 64, the 3×3 operates on the compressed
                representation, then outputs expand back to 128.
            </DefBlock>

            <h3>Global Average Pooling</h3>
            <p>
                Traditional CNNs use fully-connected layers at the end, which contain most
                parameters. GoogLeNet replaces them with global average pooling—take the average
                of each feature map across spatial dimensions, then feed those values directly
                to the classifier.
            </p>
            <ul>
                <li>VGG-16 FC layers: ~123M parameters (89% of total!)</li>
                <li>GoogLeNet with GAP: Eliminates nearly all FC parameters</li>
                <li>Total GoogLeNet parameters: only 6.7M (vs 138M for VGG)</li>
            </ul>

            <div className="ch8-callout">
                <strong>Auxiliary Classifiers:</strong> GoogLeNet adds extra classification
                branches at intermediate layers (Inception 4a and 4d). These provide additional
                gradient signal during training, combating vanishing gradients in deep networks.
                They're discarded at test time.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>GoogLeNet: Mathematical Analysis</h2>

            <h3>Inception Module Computation</h3>
            <p>For input with H×W spatial dims and C_in channels:</p>

            <p><strong>1×1 branch (producing O₁ outputs):</strong></p>
            <MathBlock tex="FLOPs = H \times W \times C_{in} \times O_1" />

            <p><strong>3×3 branch (with 1×1 reduction to R₃):</strong></p>
            <MathBlock tex="FLOPs = H \times W \times (C_{in} \times R_3 + 3^2 \times R_3 \times O_3)" />

            <p><strong>5×5 branch (with 1×1 reduction to R₅):</strong></p>
            <MathBlock tex="FLOPs = H \times W \times (C_{in} \times R_5 + 5^2 \times R_5 \times O_5)" />

            <p><strong>Pool branch:</strong></p>
            <MathBlock tex="FLOPs_{pool} \approx H \times W \times C_{in} \text{ (pooling is cheap)}" />

            <h3>Total Output Channels</h3>
            <MathBlock tex="C_{out} = O_1 + O_3 + O_5 + O_{pool}" />
            <p>
                The concatenation preserves spatial dimensions but concatenates channel outputs.
                Each branch can use different padding to maintain the same spatial resolution.
            </p>

            <h3>Parameter Efficiency</h3>
            <p>
                Compare naive Inception (no bottlenecks) vs with 1×1 reductions:
            </p>
            <p>
                Naive 3×3: (256 × 9 × 128) = 294,912 params<br />
                With 1×1→64 then 3×3→128: (256 × 1 × 64) + (64 × 9 × 128) = 16,384 + 73,728 = 90,112 params<br />
                <strong>Savings: 69%</strong>
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── GoogLeNet: Inception Module ────────────────────────────────────────────────

class InceptionModule(nn.Module):
    """
    Naive Inception module: 1×1, 3×3, 5×5 convs + pooling in parallel.
    Uses 1×1 bottlenecks to reduce computation.
    """
    def __init__(self, in_channels, out_1x1, red_3x3, out_3x3, red_5x5, out_5x5, out_pool):
        super().__init__()

        # 1×1 convolution branch
        self.branch1 = nn.Sequential(
            nn.Conv2d(in_channels, out_1x1, kernel_size=1),
            nn.ReLU(inplace=True),
        )

        # 1×1 → 3×3 branch
        self.branch2 = nn.Sequential(
            nn.Conv2d(in_channels, red_3x3, kernel_size=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(red_3x3, out_3x3, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
        )

        # 1×1 → 5×5 branch
        self.branch3 = nn.Sequential(
            nn.Conv2d(in_channels, red_5x5, kernel_size=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(red_5x5, out_5x5, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
        )

        # 3×3 pool → 1×1 branch
        self.branch4 = nn.Sequential(
            nn.MaxPool2d(kernel_size=3, stride=1, padding=1),
            nn.Conv2d(in_channels, out_pool, kernel_size=1),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        b1 = self.branch1(x)
        b2 = self.branch2(x)
        b3 = self.branch3(x)
        b4 = self.branch4(x)

        # Concatenate along channel dimension
        return torch.cat([b1, b2, b3, b4], dim=1)


class GoogLeNet(nn.Module):
    """Simplified GoogLeNet with Inception modules."""

    def __init__(self, num_classes=1000):
        super().__init__()

        # Initial conv layers (before Inception modules)
        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
        )

        self.conv2 = nn.Sequential(
            nn.Conv2d(64, 64, kernel_size=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 192, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
        )

        # Inception modules (3a, 3b)
        self.inception3a = InceptionModule(192, 64, 96, 128, 16, 32, 32)
        self.inception3b = InceptionModule(256, 128, 128, 192, 32, 96, 64)
        self.maxpool3 = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        # Inception modules (4a-4e) - simplified: just 4a, 4d
        self.inception4a = InceptionModule(480, 192, 96, 208, 16, 48, 64)
        self.inception4b = InceptionModule(512, 160, 112, 224, 24, 64, 64)
        self.inception4c = InceptionModule(512, 128, 128, 256, 24, 64, 64)
        self.inception4d = InceptionModule(508, 112, 144, 288, 32, 64, 64)
        self.maxpool4 = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        # Inception modules (5a, 5b)
        self.inception5a = InceptionModule(528, 256, 160, 320, 32, 128, 128)
        self.inception5b = InceptionModule(832, 384, 192, 384, 48, 128, 128)

        # Global average pooling + classifier (no FC layers!)
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.dropout = nn.Dropout(p=0.4)
        self.fc = nn.Linear(1024, num_classes)

    def forward(self, x):
        x = self.conv1(x)      # 112×112
        x = self.conv2(x)      # 56×56

        x = self.inception3a(x)  # 28×28
        x = self.inception3b(x)
        x = self.maxpool3(x)

        x = self.inception4a(x)  # 14×14
        x = self.inception4b(x)
        x = self.inception4c(x)
        x = self.inception4d(x)
        x = self.maxpool4(x)

        x = self.inception5a(x)  # 7×7
        x = self.inception5b(x)

        x = self.avgpool(x)    # 1×1×1024
        x = x.view(x.size(0), -1)
        x = self.dropout(x)
        x = self.fc(x)
        return x


# ── Compare parameter counts ──────────────────────────────────────────────────
if __name__ == "__main__":
    model = GoogLeNet(num_classes=1000)
    x = torch.randn(2, 3, 224, 224)
    y = model(x)

    print(f"Input shape:  {x.shape}")
    print(f"Output shape: {y.shape}")

    total = sum(p.numel() for p in model.parameters())
    print(f"\nTotal parameters: {total:,}")

    # Compare with naive Inception (no 1x1 bottlenecks)
    print("\nKey insight: 1x1 bottlenecks reduce parameters dramatically!")
    print("Without them, inception would be ~4x larger.")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of the Inception module with 1×1 bottlenecks.
                The branches operate in parallel and concatenate outputs.
                Notice the global average pooling—no fully connected layers!
            </p>
            <CodeBlock code={PYTHON_CODE} filename="googlenet.py" lang="python" langLabel="Python" />
            <div className="ch8-callout">
                <strong>Key observations:</strong> 1) 1×1 convolutions dramatically reduce
                compute. 2) Global average pooling replaces expensive FC layers. 3) Multi-scale
                processing captures features at all resolutions.
            </div>
        </>
    )
}

const TS_CODE = `// ── GoogLeNet in TypeScript ───────────────────────────────────────────────────
// Educational implementation of Inception module and parallel branches

type Tensor4D = number[][][][];

// ── 2D Convolution (general) ──────────────────────────────────────────────────

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
                    
                    output[b][oc][oh][ow] = Math.max(0, sum);  // ReLU
                }
            }
        }
    }
    
    return output;
}

// ── Max Pooling ─────────────────────────────────────────────────────────────────

function maxPool2d(input: Tensor4D, size: number = 3, stride: number = 1, padding: number = 1): Tensor4D {
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

// ── Concatenate along channel dimension ────────────────────────────────────────

function concatChannels(tensors: Tensor4D[]): Tensor4D {
    const batch = tensors[0].length;
    const spatial_h = tensors[0][0][0].length;
    const spatial_w = tensors[0][0][0][0].length;
    
    // Total channels = sum of all tensor channels
    const totalChannels = tensors.reduce((sum, t) => sum + t[0].length, 0);
    
    const output: Tensor4D = Array(batch).fill(0).map(() =>
        Array(totalChannels).fill(0).map(() =>
            Array(spatial_h).fill(0).map(() =>
                Array(spatial_w).fill(0)
            )
        )
    );
    
    for (let b = 0; b < batch; b++) {
        let channelOffset = 0;
        for (const tensor of tensors) {
            const ch = tensor[0].length;
            for (let c = 0; c < ch; c++) {
                for (let h = 0; h < spatial_h; h++) {
                    for (let w = 0; w < spatial_w; w++) {
                        output[b][channelOffset + c][h][w] = tensor[b][c][h][w];
                    }
                }
            }
            channelOffset += ch;
        }
    }
    
    return output;
}

// ── Inception Module (Simplified) ───────────────────────────────────────────────

interface InceptionWeights {
    branch1_conv: Tensor4D;      // 1×1
    branch1_bias: number[];
    branch2_reduce: Tensor4D;   // 1×1
    branch2_reduce_bias: number[];
    branch2_conv: Tensor4D;     // 3×3
    branch2_conv_bias: number[];
    branch3_reduce: Tensor4D;   // 1×1
    branch3_reduce_bias: number[];
    branch3_conv: Tensor4D;     // 5×5
    branch3_conv_bias: number[];
    branch4_proj: Tensor4D;     // 1×1 after pool
    branch4_proj_bias: number[];
}

function inceptionModule(input: Tensor4D, weights: InceptionWeights): Tensor4D {
    // Branch 1: 1×1 convolution
    const b1 = conv2d(input, weights.branch1_conv, weights.branch1_bias, 1, 0);
    
    // Branch 2: 1×1 reduction → 3×3 convolution
    let b2 = conv2d(input, weights.branch2_reduce, weights.branch2_reduce_bias, 1, 0);
    b2 = conv2d(b2, weights.branch2_conv, weights.branch2_conv_bias, 1, 1);  // padding=1 for 3×3
    
    // Branch 3: 1×1 reduction → 5×5 convolution
    let b3 = conv2d(input, weights.branch3_reduce, weights.branch3_reduce_bias, 1, 0);
    b3 = conv2d(b3, weights.branch3_conv, weights.branch3_conv_bias, 1, 2);  // padding=2 for 5×5
    
    // Branch 4: 3×3 max pool → 1×1 projection
    let b4 = maxPool2d(input, 3, 1, 1);  // stride=1, padding=1
    b4 = conv2d(b4, weights.branch4_proj, weights.branch4_proj_bias, 1, 0);
    
    // Concatenate all branches along channel dimension
    return concatChannels([b1, b2, b3, b4]);
}

// ── Fully Connected (final classifier) ──────────────────────────────────────────

function fullyConnected(input: number[][], weights: number[][], bias: number[]): number[][] {
    const [batch, inFeatures] = [input.length, input[0].length];
    const outFeatures = weights.length;
    
    const output: number[][] = Array(batch).fill(0).map(() => Array(outFeatures).fill(0));
    
    for (let b = 0; b < batch; b++) {
        for (let o = 0; o < outFeatures; o++) {
            let sum = bias[o];
            for (let i = 0; i < inFeatures; i++) {
                sum += input[b][i] * weights[o][i];
            }
            output[b][o] = sum;  // No ReLU for final layer (raw logits)
        }
    }
    
    return output;
}

// ── Simplified GoogLeNet Forward Pass ───────────────────────────────────────────

function googlenetForward(
    input: Tensor4D,
    params: {
        initial_conv: { conv: Tensor4D; bias: number[] }[];  // 7×7, 1×1, 3×3
        inception_modules: InceptionWeights[];
        final_fc: { weights: number[][]; bias: number[] };
    }
): number[][] {
    // Initial stem: 7×7 conv → 1×1 conv → 3×3 conv
    let x = input;
    for (const conv of params.initial_conv) {
        x = conv2d(x, conv.conv, conv.bias, 
            conv.conv[0][0].length === 7 ? 2 : 1,  // stride 2 for 7×7
            conv.conv[0][0].length === 7 ? 3 : 0    // padding for 7×7
        );
        // Max pooling between certain convs (omitted for clarity)
    }
    
    // Stack of Inception modules
    for (const inception of params.inception_modules) {
        x = inceptionModule(x, inception);
        // Max pooling between some modules (omitted)
    }
    
    // Global average pooling: spatial dims → 1×1
    const pooled = globalAvgPool2d(x);
    
    // Final FC layer (only one needed!)
    return fullyConnected(pooled, params.final_fc.weights, params.final_fc.bias);
}

// ── Why Global Average Pooling is Efficient ────────────────────────────────────

console.log("GoogLeNet Efficiency Analysis:");
console.log("===============================");
console.log("");
console.log("Traditional VGG-16 approach:");
console.log("  - Last conv: 512 channels × 7×7 spatial");
console.log("  - Flatten to: 25,088 features");
console.log("  - FC1: 25,088 → 4,096 (102.8M params)");
console.log("  - FC2: 4,096 → 4,096 (16.8M params)");
console.log("  - FC3: 4,096 → 1,000 (4.1M params)");
console.log("  Total FC params: ~123.7M");
console.log("");
console.log("GoogLeNet approach:");
console.log("  - Last Inception: ~1024 channels × 7×7 spatial");
console.log("  - Global average pool: each channel → 1 number");
console.log("  - Direct: 1024 → 1,000 (1M params)");
console.log("  - ~99% reduction in final layer parameters!");
console.log("");
console.log("The insight: Each feature map already encodes 'where X appears'.");
console.log("Averaging asks: 'How strongly does X appear overall?'");
console.log("This is sufficient for classification—no need for giant FC layers!");`;

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of the Inception module with parallel branches
                and concatenation. Demonstrates global average pooling replacing expensive
                fully-connected layers.
            </p>
            <CodeBlock code={TS_CODE} filename="googlenet.ts" lang="typescript" />
            <div className="ch8-callout">
                <strong>Efficiency insight:</strong> GoogLeNet reduces final layer parameters
                by 99% compared to VGG by using global average pooling instead of giant
                fully-connected layers. Each feature map is reduced to a single number
                representing "how much this feature appears."
            </div>
        </>
    )
}

export const GOOGLENET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
