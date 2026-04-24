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
            year: "2012",
            title: "ImageNet Challenge Breakthrough",
            context:
                "The ImageNet Large Scale Visual Recognition Challenge (ILSVRC) was the definitive computer vision benchmark. The 2012 competition featured 1.2 million training images across 1000 categories.",
            what:
                "Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton trained a deep convolutional neural network with 60 million parameters on two GTX 580 GPUs. The network was 8 layers deep—deeper than anything that had been successfully trained before.",
            impact:
                "AlexNet achieved 15.3% top-5 error—more than 10 percentage points better than the second-place entry (26.2%). This victory marked the beginning of the deep learning revolution in computer vision.",
        },
        {
            year: "2012–2014",
            title: "The Deep Learning Explosion",
            context:
                "Researchers had known about CNNs since LeCun's LeNet-5 in 1998, but deep networks were considered impossible to train. AlexNet's victory proved otherwise.",
            what:
                "Within two years, every ImageNet entry used deep CNNs. Research labs at Google, Facebook, Microsoft, and Baidu scrambled to build GPU clusters and hire deep learning experts.",
            impact:
                "GPU manufacturers realized their hardware was perfect for deep learning. NVIDIA's stock began its decade-long rise. Deep learning became the hottest area in all of computer science.",
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
            <h2>AlexNet: The Super-Smart Computer Eyes</h2>

            <Analogy label="A Detective with a Magnifying Glass">
                Imagine you're playing a guessing game with millions of photos. The computer needs to
                figure out what's in each picture—a dog, a car, a pizza, or a flower. In 2012,
                AlexNet became the world's best photo-guesser!
            </Analogy>

            <Analogy label="Five Magic Tricks">
                AlexNet used five special tricks that are still used today:
                <br /><br />
                <strong>1. ReLU:</strong> Like a light switch—neurons are either ON or OFF, no "maybe" states!
                This made learning super fast.<br />
                <strong>2. Two Graphics Cards:</strong> The network was so big, it needed TWO gaming GPUs
                to work. Each GPU handled half the work.<br />
                <strong>3. Dropout:</strong> During practice, some neurons randomly take a nap. This
                prevents the network from memorizing and forces it to actually learn.<br />
                <strong>4. Picture Jumbling:</strong> During training, the computer randomly flips and
                crops pictures. More practice examples without needing more photos!<br />
                <strong>5. Normalization:</strong> Like making sure everyone on a team gets the same
                amount of attention, so no single part becomes too bossy.
            </Analogy>

            <Analogy label="Why Deep Networks Were Impossible Before">
                Before 2012, smart people tried to build deep networks but failed. The problem was
                like trying to whisper a message through a long chain of friends—by the end, the
                message was too quiet to hear! AlexNet's ReLU trick was like using megaphones
                instead of whispers.
            </Analogy>

            <DefBlock label="What Made AlexNet Win">
                AlexNet is 8 layers deep—5 convolution layers that find patterns in photos, followed
                by 3 fully-connected layers that make the final guess. It's like having 5 different
                detectives look at clues, then 3 bosses making the final decision!
            </DefBlock>

            <div className="ch-callout">
                <strong>Cool fact:</strong> AlexNet was trained on two GTX 580 graphics cards, each with
                only 3GB of memory (less than some phones today!). The network had to be split across
                both cards because it was too big to fit on just one.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>AlexNet: Breaking Through with Smart Choices</h2>

            <p>
                By 2012, researchers knew that deeper neural networks should be able to learn more
                complex patterns. But there was a problem: networks deeper than a few layers simply
                wouldn't train. The gradients (signals telling weights how to improve) became
                smaller and smaller as they traveled backward through the network—almost like a
                message getting lost in a game of telephone.
            </p>

            <h3>The Vanishing Gradient Problem</h3>
            <p>
                Traditional activation functions like sigmoid and tanh squish large values into
                a small range (0 to 1, or -1 to 1). When you take the derivative, you get very
                small numbers. Multiply many small numbers together, and they become nearly zero.
            </p>

            <DefBlock label="ReLU to the Rescue">
                ReLU (Rectified Linear Unit) is simple: f(x) = max(0, x). For positive numbers,
                it returns the number unchanged. For negative numbers, it returns 0.
                <br /><br />
                The derivative is either 1 (for x &gt; 0) or 0 (for x &lt; 0). This means gradients
                can flow freely through active neurons—no more vanishing gradients!
            </DefBlock>

            <h3>Architecture Overview</h3>
            <p>
                AlexNet processes 224×224 pixel images through this pipeline:
            </p>
            <ul>
                <li><strong>Conv1:</strong> 96 filters, 11×11 kernel, stride 4 → detects basic edges</li>
                <li><strong>Conv2:</strong> 256 filters, 5×5 kernel → combines edges into textures</li>
                <li><strong>Conv3-5:</strong> 384, 384, and 256 filters, all 3×3 → complex patterns</li>
                <li><strong>FC6-7:</strong> 4096 neurons each → high-level reasoning</li>
                <li><strong>FC8:</strong> 1000 neurons → one for each ImageNet class</li>
            </ul>

            <h3>Dropout: Preventing Co-Adaptation</h3>
            <p>
                With 60 million parameters, AlexNet could easily memorize the training data instead
                of learning general patterns. Dropout randomly sets 50% of neurons to zero during
                training. This forces the network to learn redundant representations—if one path
                is blocked, others must compensate.
            </p>

            <div className="ch-callout">
                <strong>Test time:</strong> At test time, all neurons are active, but weights are
                scaled by the dropout probability (0.5). This approximates averaging predictions
                from many "thinned" networks.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>AlexNet: Mathematical Details</h2>

            <DefBlock label="ReLU Activation">
                The Rectified Linear Unit eliminated the vanishing gradient problem:
                <MathBlock tex="\text{ReLU}(x) = \max(0, x)" />
                Gradient: ∇ReLU(x) = 1 for x &gt; 0, 0 otherwise. No saturation for positive inputs.
            </DefBlock>

            <h3>Dropout Regularization</h3>
            <p>
                During training, each neuron is kept active with probability p (typically 0.5 for fully connected layers):
            </p>
            <MathBlock tex="y = f(W \cdot \text{mask} \odot x + b)" />
            <p>
                where maskᵢ ~ Bernoulli(p). At test time, weights are scaled by p (or equivalently, activations are scaled by 1/p during training).
                This prevents neurons from co-adapting and forces robust feature learning.
            </p>

            <h3>Convolution Dimensions</h3>
            <p>Output size formula for convolution layers:</p>
            <MathBlock tex="W_{out} = \left\lfloor \frac{W_{in} - K + 2P}{S} \right\rfloor + 1" />
            <p>
                Where K = kernel size, P = padding, S = stride. AlexNet used aggressive strides (4 in first layer)
                to quickly reduce spatial dimensions while increasing depth.
            </p>

            <h3>Local Response Normalization</h3>
            <p>
                Though later superseded by BatchNorm, LRN was used in AlexNet:
            </p>
            <MathBlock tex="b_{x,y}^i = a_{x,y}^i \Big/ \left( k + \alpha \sum_{j=\max(0,i-n/2)}^{\min(N-1,i+n/2)} (a_{x,y}^j)^2 \right)^\beta" />
            <p>
                This creates competition among nearby feature maps, inspired by lateral inhibition in biological neurons.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── AlexNet Architecture ──────────────────────────────────────────────────────

class AlexNet(nn.Module):
    """
    AlexNet implementation with the original 8-layer architecture.
    Designed for 224×224 RGB images (ImageNet).
    """
    def __init__(self, num_classes=1000):
        super(AlexNet, self).__init__()

        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 96, kernel_size=11, stride=4, padding=2)
        self.conv2 = nn.Conv2d(96, 256, kernel_size=5, padding=2)
        self.conv3 = nn.Conv2d(256, 384, kernel_size=3, padding=1)
        self.conv4 = nn.Conv2d(384, 384, kernel_size=3, padding=1)
        self.conv5 = nn.Conv2d(384, 256, kernel_size=3, padding=1)

        # Fully connected layers
        self.fc1 = nn.Linear(256 * 6 * 6, 4096)
        self.fc2 = nn.Linear(4096, 4096)
        self.fc3 = nn.Linear(4096, num_classes)

        # Dropout for regularization
        self.dropout = nn.Dropout(p=0.5)

    def forward(self, x):
        # Conv block 1: 224x224 -> 55x55 -> 27x27 (after pool)
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Conv block 2: 27x27 -> 13x13 (after pool)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Conv blocks 3-5 (no pooling)
        x = F.relu(self.conv3(x))
        x = F.relu(self.conv4(x))
        x = F.relu(self.conv5(x))
        # Final pool: 13x13 -> 6x6
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Flatten: 256 * 6 * 6 = 9216
        x = x.view(x.size(0), -1)

        # Fully connected layers with dropout
        x = F.relu(self.fc1(x))
        x = self.dropout(x)

        x = F.relu(self.fc2(x))
        x = self.dropout(x)

        x = self.fc3(x)
        return x


# ── Simplified modern AlexNet ─────────────────────────────────────────────────
class AlexNetModern(nn.Module):
    """
    Modern AlexNet with BatchNorm (replacing LRN) and cleaner structure.
    """
    def __init__(self, num_classes=1000):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(kernel_size=3, stride=2),

            nn.Conv2d(64, 192, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.BatchNorm2d(192),
            nn.MaxPool2d(kernel_size=3, stride=2),

            nn.Conv2d(192, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),

            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),

            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )

        self.classifier = nn.Sequential(
            nn.Dropout(p=0.5),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),

            nn.Dropout(p=0.5),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),

            nn.Linear(4096, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x


# ── Test forward pass ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    model = AlexNet(num_classes=1000)
    x = torch.randn(4, 3, 224, 224)  # Batch of 4 images

    y = model(x)
    print(f"Input shape: {x.shape}")
    print(f"Output shape: {y.shape}")

    # Count parameters
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Total parameters: {total:,}")
    print(f"Trainable parameters: {trainable:,}")  # ~60M

    # Modern version
    modern = AlexNetModern()
    modern_total = sum(p.numel() for p in modern.parameters())
    print(f"\nModern version parameters: {modern_total:,}")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of the original AlexNet architecture with ReLU,
                dropout, and the 5 convolutional + 3 fully connected layer structure.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="alexnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Note:</strong> The modern version uses BatchNorm instead of LRN
                and is cleaner to implement. Both achieve similar performance.
            </div>
        </>
    )
}

const TS_CODE = `// ── AlexNet in TypeScript ─────────────────────────────────────────────────────
// Educational implementation showing forward pass from scratch

type Tensor4D = number[][][][];

interface AlexNetLayer {
    weights: Tensor4D;
    bias: number[];
}

// ── Utility Functions ──────────────────────────────────────────────────────────

function relu(x: number): number {
    return Math.max(0, x);
}

function maxPool2d(
    input: Tensor4D,
    poolSize: number = 3,
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

// ── 2D Convolution Operation ────────────────────────────────────────────────────

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
                    
                    output[b][oc][oh][ow] = relu(sum);  // ReLU activation
                }
            }
        }
    }
    
    return output;
}

// ── Fully Connected Layer ─────────────────────────────────────────────────────

function fullyConnected(input: number[][], weights: number[][], bias: number[]): number[][] {
    const [batch, in_features] = [input.length, input[0].length];
    const out_features = weights.length;
    
    const output: number[][] = Array(batch).fill(0).map(() => Array(out_features).fill(0));
    
    for (let b = 0; b < batch; b++) {
        for (let o = 0; o < out_features; o++) {
            let sum = bias[o];
            for (let i = 0; i < in_features; i++) {
                sum += input[b][i] * weights[o][i];
            }
            output[b][o] = relu(sum);
        }
    }
    
    return output;
}

// ── Simplified AlexNet Forward Pass ────────────────────────────────────────────

function alexnetForward(
    input: Tensor4D,
    convLayers: AlexNetLayer[],
    fcLayers: { weights: number[][]; bias: number[] }[],
    dropoutRate: number = 0.5
): number[][] {
    let x: Tensor4D = input;
    
    // Conv1: 3 -> 96, 11x11, stride 4
    x = conv2d(x, convLayers[0].weights, convLayers[0].bias, 4, 2);
    x = maxPool2d(x, 3, 2);
    console.log("After Conv1:", [x.length, x[0].length, x[0][0].length, x[0][0][0].length]);
    
    // Conv2: 96 -> 256, 5x5, padding 2
    x = conv2d(x, convLayers[1].weights, convLayers[1].bias, 1, 2);
    x = maxPool2d(x, 3, 2);
    
    // Conv3: 256 -> 384, 3x3, padding 1
    x = conv2d(x, convLayers[2].weights, convLayers[2].bias, 1, 1);
    
    // Conv4: 384 -> 384, 3x3, padding 1
    x = conv2d(x, convLayers[3].weights, convLayers[3].bias, 1, 1);
    
    // Conv5: 384 -> 256, 3x3, padding 1
    x = conv2d(x, convLayers[4].weights, convLayers[4].bias, 1, 1);
    x = maxPool2d(x, 3, 2);
    
    // Flatten: batch x (256 * 6 * 6 = 9216)
    const batch = x.length;
    const flattened: number[][] = [];
    for (let b = 0; b < batch; b++) {
        const flat: number[] = [];
        for (let c = 0; c < x[b].length; c++) {
            for (let h = 0; h < x[b][c].length; h++) {
                for (let w = 0; w < x[b][c][h].length; w++) {
                    flat.push(x[b][c][h][w]);
                }
            }
        }
        flattened.push(flat);
    }
    
    // FC6: 9216 -> 4096
    let fc = fullyConnected(flattened, fcLayers[0].weights, fcLayers[0].bias);
    // Apply dropout (simplified: randomly zero out neurons)
    for (let b = 0; b < batch; b++) {
        for (let i = 0; i < fc[b].length; i++) {
            if (Math.random() < dropoutRate) fc[b][i] = 0;
            else fc[b][i] *= 2;  // Scale to maintain expected value
        }
    }
    
    // FC7: 4096 -> 4096
    fc = fullyConnected(fc, fcLayers[1].weights, fcLayers[1].bias);
    for (let b = 0; b < batch; b++) {
        for (let i = 0; i < fc[b].length; i++) {
            if (Math.random() < dropoutRate) fc[b][i] = 0;
            else fc[b][i] *= 2;
        }
    }
    
    // FC8: 4096 -> 1000 (no ReLU for output)
    const output: number[][] = Array(batch).fill(0).map(() => Array(1000).fill(0));
    for (let b = 0; b < batch; b++) {
        for (let o = 0; o < 1000; o++) {
            let sum = fcLayers[2].bias[o];
            for (let i = 0; i < 4096; i++) {
                sum += fc[b][i] * fcLayers[2].weights[o][i];
            }
            output[b][o] = sum;  // Raw logits
        }
    }
    
    return output;
}

// ── Demo ─────────────────────────────────────────────────────────────────────────

// Create random input: 1 image, 3 channels (RGB), 224x224
const input: Tensor4D = [[
    Array(224).fill(0).map(() => Array(224).fill(0).map(() => Math.random())),
    Array(224).fill(0).map(() => Array(224).fill(0).map(() => Math.random())),
    Array(224).fill(0).map(() => Array(224).fill(0).map(() => Math.random()))
]];

console.log("Input shape: [1, 3, 224, 224]");
console.log("AlexNet has ~60M parameters spread across:");
console.log("- 5 convolutional layers with decreasing spatial dims");
console.log("- 3 fully connected layers (9216→4096→4096→1000)");
console.log("- ReLU activations throughout");
console.log("- Max pooling between conv groups");
console.log("- Dropout (0.5) in fully connected layers");`;

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation showing AlexNet's forward pass from scratch.
                This demonstrates convolution, pooling, and the fully-connected pipeline
                without any external libraries.
            </p>
            <CodeBlock code={TS_CODE} filename="alexnet.ts" lang="typescript" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The same algorithm PyTorch uses, just slower!
                Notice how spatial dimensions shrink while channel depth grows through
                the convolutional layers: 224×224×3 → 55×55×96 → 27×27×256 → ... → 6×6×256.
            </div>
        </>
    )
}

export const ALEXNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
