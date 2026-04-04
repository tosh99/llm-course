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
            title: "VGGNet: Depth Through Simplicity",
            context:
                "After AlexNet's success, researchers rushed to add complexity: irregular filters, parallel branches, hand-engineered features. The Oxford Visual Geometry Group took the opposite approach.",
            what:
                "VGGNet used ONLY 3×3 convolutions stacked repeatedly. VGG-16 has 13 convolutional + 3 FC layers. VGG-19 has 16 convolutional + 3 FC layers. Nothing else—no fancy connections, no branching.",
            impact:
                "VGGNet proved that depth alone, achieved through simple building blocks, is more important than clever architectural choices. It remains influential today—a testament to the power of simplicity.",
        },
        {
            year: "2014–2015",
            title: "The 3×3 Revolution",
            context:
                "Before VGGNet, researchers believed larger kernels (5×5, 7×7, 11×11) were needed to capture larger receptive fields. This required more parameters and made networks prone to overfitting.",
            what:
                "VGGNet showed that two stacked 3×3s have the same receptive field as one 5×5, but with fewer parameters (18 vs 25) and more non-linearities (2 ReLUs vs 1). Three stacked 3×3s match a 7×7 with only 27 vs 49 parameters.",
            impact:
                "The 3×3 convolution became the standard building block. Modern architectures (ResNet, DenseNet, EfficientNet) all use stacks of small filters. Large kernels are now rare exceptions.",
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
            <h2>VGGNet: Building Tall with Simple Bricks</h2>

            <Analogy label="Building a Skyscraper">
                Imagine you want to build the tallest LEGO tower possible. You could use big fancy
                pieces—arches, wings, wheels, decorative elements. Or you could use the simplest
                LEGO brick: the 2×4 block. Stack enough of them, and you'll have something
                incredibly tall and stable.
                <br /><br />
                VGGNet chose the simple approach. Every single convolution uses 3×3 filters.
                That's it. Nothing else. Just stack them as deep as you can!
            </Analogy>

            <Analogy label="The Stacking Secret">
                Here's the clever math trick: Two 3×3 filters stacked together can see the same
                area as one 5×5 filter. But they use fewer LEGO pieces (parameters) AND they
                have two "thinking steps" (ReLUs) instead of one.
                <br /><br />
                Three 3×3 filters can see the same area as one 7×7 filter, but with even more
                savings: only 27 parameters instead of 49! More thinking steps + fewer pieces = win!
            </Analogy>

            <DefBlock label="VGG-16: The Numbers Game">
                VGG-16 is like a staircase with 16 steps:
                <br /><br />
                • First 2 steps: Find 64 different patterns (edges, colors)<br />
                • Next 2 steps: Find 128 patterns (combining edges)<br />
                • Next 3 steps: Find 256 patterns (shapes emerging)<br />
                • Next 3 steps: Find 512 patterns (object parts)<br />
                • Last 3 steps: Find 512 more complex patterns<br />
                • Then 3 big steps at the end: Figure out what's in the picture!
            </DefBlock>

            <Analogy label="Why Deeper is Better">
                Think of learning like climbing a ladder:
                <br /><br />
                • Shallow networks (like AlexNet) take big jumps—they miss details.<br />
                • Deep networks (VGG) take many small steps—each step is gentle and clear.<br />
                <br />
                With 16 layers, VGG-16 gradually transforms a photo from raw pixels → edges →
                textures → shapes → parts → objects. Each layer specializes in one small task.
            </Analogy>

            <div className="ch8-callout">
                <strong>Trade-off:</strong> VGGNet is BIG—138 million parameters (2× more than AlexNet).
                Most are in the final 3 fully-connected layers. This inspired later networks
                to use smarter shortcuts instead of these giant layers!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>VGGNet: The Mathematics of Small Filters</h2>

            <p>
                After AlexNet won ImageNet 2012, researchers tried many complex approaches to
                go deeper. VGGNet's insight was counter-intuitive: <strong>simplicity wins</strong>.
                By using only 3×3 convolutions, they achieved unprecedented depth while
                actually <em>reducing</em> parameters compared to using larger filters.
            </p>

            <h3>The Receptive Field Equivalence</h3>
            <p>
                A 5×5 filter looks at a 5×5 patch of the image. But consider two 3×3 filters stacked:
            </p>
            <ul>
                <li>First 3×3 sees a 3×3 region and transforms it</li>
                <li>Second 3×3 looks at 3×3 of the <em>transformed</em> features</li>
                <li>Together, they can capture patterns spanning 5×5 of the original image</li>
            </ul>

            <DefBlock label="Parameter Comparison">
                For C input channels and C output channels:
                <br /><br />
                • <strong>One 5×5 filter:</strong> 5² × C² = 25C² parameters<br />
                • <strong>Two 3×3 filters:</strong> 2 × (3² × C²) = 18C² parameters<br />
                • <strong>Savings:</strong> 28% fewer parameters!
                <br /><br />
                Plus, two 3×3s have 2 ReLU activations vs 1, making the network more expressive.
            </DefBlock>

            <h3>VGG Architecture Strategy</h3>
            <p>
                VGG follows a consistent pattern:
            </p>
            <ol>
                <li>Start with 64 filters (capturing basic edges and colors)</li>
                <li>After each max-pool, <strong>double</strong> the filter count (64→128→256→512)</li>
                <li>Halve the spatial dimensions with each pool (224→112→56→28→14→7)</li>
                <li>Keep stacking 3×3 convolutions within each block</li>
            </ol>

            <h3>Spatial vs. Depth Trade-off</h3>
            <p>
                Notice what happens: as spatial resolution decreases, filter depth increases.
                This maintains roughly constant computation per layer while allowing the network
                to capture increasingly complex, abstract features.
            </p>

            <div className="ch8-callout">
                <strong>VGG-16 vs VGG-19:</strong> VGG-19 simply adds 3 more convolution layers in
                the middle blocks. Surprisingly, this small change often improves accuracy.
                Depth matters more than width!
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>VGGNet: Mathematical Analysis</h2>

            <h3>Receptive Field Calculation</h3>
            <p>
                The receptive field grows with each layer. For convolution with kernel k, stride 1, padding (k-1)/2,
                the receptive field expands by (k-1) at each layer.
            </p>
            <MathBlock tex="RF_{out} = RF_{in} + (k - 1) \times j_{in}" />
            <p>
                where j is the jump (cumulative stride). For VGG's first three layers:
            </p>
            <ul>
                <li>Layer 1: RF = 3×3, jump = 1</li>
                <li>Layer 2: RF = 3 + (3-1) = 5×5, jump = 1</li>
                <li>Layer 3: RF = 5 + (3-1) = 7×7, jump = 1</li>
            </ul>

            <h3>Parameter Count</h3>
            <p>For a convolution layer with C_in input channels, C_out output channels, kernel k:</p>
            <MathBlock tex="\text{Params} = (k^2 \times C_{in} + 1) \times C_{out}" />
            <p>
                The +1 accounts for bias. For 3×3×256→256: (9 × 256 + 1) × 256 = 590,080 parameters.

                Compare to 5×5×256→256: (25 × 256 + 1) × 256 = 1,638,656 parameters—2.8× more!
            </p>

            <h3>Why More Non-Linearities Help</h3>
            <p>
                Two stacked convolutions with ReLUs:
            </p>
            <MathBlock tex="y = \text{ReLU}(W_2 \cdot \text{ReLU}(W_1 \cdot x + b_1) + b_2)" />
            <p>
                This is more expressive than one convolution, even with the same receptive field:
            </p>
            <MathBlock tex="y = \text{ReLU}(W \cdot x + b)" />
            <p>
                The composition of two non-linearities can approximate more complex functions,
                while the parameter count is still lower than a larger single kernel.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── VGGNet: Depth Through Simplicity ──────────────────────────────────────────

class VGG(nn.Module):
    """
    VGGNet with configurable depth (16 or 19 layers).
    Uses only 3×3 convolutions—nothing else!
    """
    def __init__(self, num_classes=1000, config='D'):
        super(VGG, self).__init__()

        # Configurations: number of conv layers in each block
        configs = {
            'A': [1, 1, 2, 2, 2],      # VGG-11
            'B': [2, 2, 2, 2, 2],      # VGG-13
            'D': [2, 2, 3, 3, 3],      # VGG-16 (default)
            'E': [2, 2, 4, 4, 4],      # VGG-19
        }

        num_convs = configs[config]
        in_channels = 3
        channels = [64, 128, 256, 512, 512]

        layers = []
        for num_conv, out_channels in zip(num_convs, channels):
            # Add conv-relu blocks
            for _ in range(num_conv):
                layers.extend([
                    nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
                    nn.ReLU(inplace=True),
                ])
                in_channels = out_channels

            # Max pool after each block (halves spatial dims)
            layers.append(nn.MaxPool2d(kernel_size=2, stride=2))

        self.features = nn.Sequential(*layers)

        # Classifier (3 FC layers)
        self.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),

            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),

            nn.Linear(4096, num_classes),
        )

        self._initialize_weights()

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)  # Flatten
        x = self.classifier(x)
        return x

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)


# ── Helper function ───────────────────────────────────────────────────────────
def make_vgg(config='D', num_classes=1000, batch_norm=False):
    """Create VGG model with optional BatchNorm."""
    # For BatchNorm version (VGG-16-BN), add BN after each conv
    # This significantly improves training stability
    return VGG(num_classes=num_classes, config=config)


# ── Usage ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Create VGG-16 (config D)
    model = VGG(config='D', num_classes=1000)

    # Test forward pass
    x = torch.randn(2, 3, 224, 224)
    y = model(x)

    print(f"Input shape:  {x.shape}")
    print(f"Output shape: {y.shape}")

    # Count parameters
    total = sum(p.numel() for p in model.parameters())
    print(f"\nTotal parameters: {total:,}")  # ~138M for VGG-16

    # Feature extractor parameters vs classifier
    feat_params = sum(p.numel() for p in model.features.parameters())
    clf_params = sum(p.numel() for p in model.classifier.parameters())
    print(f"Features: {feat_params:,}")
    print(f"Classifier: {clf_params:,}")

    # Create VGG-19 for comparison
    vgg19 = VGG(config='E', num_classes=1000)
    vgg19_params = sum(p.numel() for p in vgg19.parameters())
    print(f"\nVGG-19 parameters: {vgg19_params:,}")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of VGGNet showing the clean, repetitive structure
                with configurable depth. The key insight: uniform 3×3 convolutions
                throughout enable unprecedented depth.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="vggnet.py" lang="python" langLabel="Python" />
            <div className="ch8-callout">
                <strong>Design principle:</strong> Notice how each block doubles channels
                while halving spatial dimensions. This maintains constant compute per layer
                (roughly) while building hierarchical representations.
            </div>
        </>
    )
}

const TS_CODE = `// ── VGGNet in TypeScript ────────────────────────────────────────────────────────
// Educational implementation showing stacked 3×3 convolutions

type Tensor4D = number[][][][];

// ── 3×3 Convolution (the only filter size in VGG!) ─────────────────────────────

function conv3x3(
    input: Tensor4D,
    weights: number[][][][],  // [out_ch, in_ch, 3, 3]
    bias: number[],
    padding: number = 1  // VGG always uses padding=1 to preserve spatial size
): Tensor4D {
    const [batch, in_ch, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const out_ch = weights.length;
    
    // With padding=1, output size equals input size (for 3×3 kernel, stride=1)
    const out_h = in_h;
    const out_w = in_w;
    
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
                        for (let kh = 0; kh < 3; kh++) {
                            for (let kw = 0; kw < 3; kw++) {
                                // Apply padding: shift by padding amount
                                const ih = oh + kh - padding;
                                const iw = ow + kw - padding;
                                
                                if (ih >= 0 && ih < in_h && iw >= 0 && iw < in_w) {
                                    sum += input[b][ic][ih][iw] * weights[oc][ic][kh][kw];
                                }
                            }
                        }
                    }
                    
                    // ReLU activation
                    output[b][oc][oh][ow] = Math.max(0, sum);
                }
            }
        }
    }
    
    return output;
}

// ── Max Pooling (halves spatial dimensions) ────────────────────────────────────

function maxPool2d(input: Tensor4D, size: number = 2, stride: number = 2): Tensor4D {
    const [batch, channels, in_h, in_w] = [input.length, input[0].length, input[0][0].length, input[0][0][0].length];
    const out_h = Math.floor((in_h - size) / stride) + 1;
    const out_w = Math.floor((in_w - size) / stride) + 1;
    
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
                            const ih = oh * stride + ph;
                            const iw = ow * stride + pw;
                            if (ih < in_h && iw < in_w) {
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

// ── VGG Block Builder ──────────────────────────────────────────────────────────

function vggBlock(
    input: Tensor4D,
    numConvs: number,
    inChannels: number,
    outChannels: number,
    weights: { conv: number[][][][]; bias: number[] }[]
): Tensor4D {
    let x = input;
    
    for (let i = 0; i < numConvs; i++) {
        const w = weights[i];
        // VGG always uses 3×3 convolutions with padding 1
        x = conv3x3(x, w.conv, w.bias, 1);
    }
    
    // Max pool after each block (halves dimensions)
    x = maxPool2d(x, 2, 2);
    
    return x;
}

// ── Fully Connected Layer ───────────────────────────────────────────────────────

function fullyConnected(input: number[][], weights: number[][], bias: number[], useReLU: boolean = true): number[][] {
    const [batch, inFeatures] = [input.length, input[0].length];
    const outFeatures = weights.length;
    
    const output: number[][] = Array(batch).fill(0).map(() => Array(outFeatures).fill(0));
    
    for (let b = 0; b < batch; b++) {
        for (let o = 0; o < outFeatures; o++) {
            let sum = bias[o];
            for (let i = 0; i < inFeatures; i++) {
                sum += input[b][i] * weights[o][i];
            }
            output[b][o] = useReLU ? Math.max(0, sum) : sum;
        }
    }
    
    return output;
}

// ── Dropout (simplified for inference) ───────────────────────────────────────────

function dropout(input: number[][], rate: number = 0.5, isTraining: boolean = false): number[][] {
    if (!isTraining) {
        // At test time, just scale by (1 - rate)
        return input.map(row => row.map(val => val * (1 - rate)));
    }
    // Training: randomly zero out neurons (omitted for brevity)
    return input;
}

// ── VGG-16 Forward Pass ────────────────────────────────────────────────────────

function vgg16Forward(
    input: Tensor4D,
    params: {
        conv1: { conv: number[][][][]; bias: number[] }[],  // 2 convs
        conv2: { conv: number[][][][]; bias: number[] }[],  // 2 convs
        conv3: { conv: number[][][][]; bias: number[] }[],  // 3 convs
        conv4: { conv: number[][][][]; bias: number[] }[],  // 3 convs
        conv5: { conv: number[][][][]; bias: number[] }[],  // 3 convs
        fc1: { weights: number[][]; bias: number[] },  // 25088 -> 4096
        fc2: { weights: number[][]; bias: number[] },  // 4096 -> 4096
        fc3: { weights: number[][]; bias: number[] },  // 4096 -> 1000
    }
): number[][] {
    // Block 1: 3 -> 64 channels, 2 convs, then pool: 224 -> 112
    let x = vggBlock(input, 2, 3, 64, params.conv1);
    
    // Block 2: 64 -> 128 channels, 2 convs, then pool: 112 -> 56
    x = vggBlock(x, 2, 64, 128, params.conv2);
    
    // Block 3: 128 -> 256 channels, 3 convs, then pool: 56 -> 28
    x = vggBlock(x, 3, 128, 256, params.conv3);
    
    // Block 4: 256 -> 512 channels, 3 convs, then pool: 28 -> 14
    x = vggBlock(x, 3, 256, 512, params.conv4);
    
    // Block 5: 512 -> 512 channels, 3 convs, then pool: 14 -> 7
    x = vggBlock(x, 3, 512, 512, params.conv5);
    
    // Flatten: batch x (512 * 7 * 7 = 25,088)
    const batch = x.length;
    const flattened: number[][] = [];
    for (let b = 0; b < batch; b++) {
        const flat: number[] = [];
        for (let c = 0; c < 512; c++) {
            for (let h = 0; h < 7; h++) {
                for (let w = 0; w < 7; w++) {
                    flat.push(x[b][c][h][w]);
                }
            }
        }
        flattened.push(flat);
    }
    
    // FC layers with dropout
    let fc = fullyConnected(flattened, params.fc1.weights, params.fc1.bias);
    fc = dropout(fc, 0.5, false);
    
    fc = fullyConnected(fc, params.fc2.weights, params.fc2.bias);
    fc = dropout(fc, 0.5, false);
    
    // Final FC (no ReLU)
    return fullyConnected(fc, params.fc3.weights, params.fc3.bias, false);
}

// ── Parameter Count ─────────────────────────────────────────────────────────────

console.log("VGG-16 Parameter Breakdown:");
console.log("============================");
console.log("");
console.log("Convolutional layers:");
console.log("  Block 1: 2 × (3×3×3×64)  = 3,456 +  3,712  = ~7K");
console.log("  Block 2: 2 × (3×3×64×128) = 73,728 + 147,584 = ~221K");
console.log("  Block 3: 3 × (3×3×128×256) = 294,912 + 589,824 + 590,080 = ~1.4M");
console.log("  Block 4: 3 × (3×3×256×512) = 1,179,648 + 2,359,296 + 2,360,064 = ~5.9M");
console.log("  Block 5: 3 × (3×3×512×512) = 2,359,296 × 3 = ~7.1M");
console.log("  Conv total: ~14.7M");
console.log("");
console.log("Fully connected layers:");
console.log("  FC1: 25,088 × 4,096 + 4,096 = ~102.8M");
console.log("  FC2: 4,096 × 4,096 + 4,096 = ~16.8M");
console.log("  FC3: 4,096 × 1,000 + 1,000 = ~4.1M");
console.log("  FC total: ~123.6M");
console.log("");
console.log("Total: ~138.3M parameters");
console.log("");
console.log("Key insight: 89% of parameters are in the FC layers!");
console.log("This motivated ResNet/DenseNet to use global average pooling instead.");`;

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of VGGNet emphasizing the repetitive 3×3
                convolution pattern. Shows how stacking small filters achieves the
                same receptive field with fewer parameters.
            </p>
            <CodeBlock code={TS_CODE} filename="vggnet.ts" lang="typescript" />
            <div className="ch8-callout">
                <strong>Architecture insight:</strong> Notice that 89% of VGG-16's
                ~138M parameters are in the fully-connected layers at the end.
                This inefficiency inspired later architectures to use global average
                pooling instead of giant FC layers.
            </div>
        </>
    )
}

export const VGGNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
