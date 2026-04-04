import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch7-tl-item">
            <div className="ch7-tl-year">{item.year}</div>
            <div className="ch7-tl-title">{item.title}</div>
            <div className="ch7-tl-section-label">The context</div>
            <div className="ch7-tl-body">{item.challenge}</div>
            <div className="ch7-tl-section-label">What was introduced</div>
            <div className="ch7-tl-body">{item.what}</div>
            <div className="ch7-tl-section-label">Why it mattered</div>
            <div className="ch7-tl-body ch7-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2009–2011",
            title: "The ImageNet Project—Large-Scale Visual Recognition",
            challenge:
                "Existing computer vision datasets were too small (Caltech-101: 9,000 images) to test the limits of recognition systems. Researchers needed a challenging benchmark to push the field forward.",
            what:
                "Fei-Fei Li's team at Stanford and Princeton created ImageNet: 15 million labeled images across 22,000 categories. The annual ImageNet Large Scale Visual Recognition Challenge (ILSVRC) used a subset of 1,000 classes to benchmark classification accuracy.",
            impact:
                "ImageNet became the de facto benchmark for computer vision. The 2012 competition results would announce the deep learning revolution to the world.",
        },
        {
            year: "2012",
            title: "AlexNet—Krizhevsky, Sutskever, Hinton",
            challenge:
                "Previous ImageNet winners used handcrafted features (SIFT, HOG) and shallow classifiers. The 2011 winner had a top-5 error rate of 25.8%. Deep networks were considered too slow and impractical for such large-scale tasks.",
            what:
                "Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton trained a deep convolutional neural network with 5 convolutional + 3 fully-connected layers, 60 million parameters. Key innovations: ReLU activations for faster training, GPU training on two GTX 580s, data augmentation (crops, flips, PCA on RGB), dropout regularization, and local response normalization.",
            impact:
                "AlexNet achieved 15.3% top-5 error — crushing the next competitor at 26.2%. This single result proved deep learning worked at scale and ignited the entire modern AI revolution. Within 5 years, every major tech company had deep learning research teams.",
        },
        {
            year: "2012–2015",
            title: "The Deep Learning Revolution Takes Hold",
            challenge:
                "The computer vision community, dominated by feature engineering methods, was skeptical of neural network 'black boxes.' They needed to be convinced.",
            what:
                "Following AlexNet's success, researchers rapidly adopted CNNs. 2013: ZFNet improved architecture visualization. 2014: VGGNet deepened to 16-19 layers. 2014: GoogLeNet added 22 layers with inception modules. 2015: ResNet reached 152 layers with skip connections.",
            impact:
                "Error rates on ImageNet plummeted: 15.3% → 11.7% → 7.3% → 3.6% (below human performance). Deep learning became the dominant paradigm in computer vision, speech recognition, and soon all of AI.",
        },
    ]

    return (
        <div className="ch7-timeline">
            {items.map((item) => (
                <TimelineItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>AlexNet: The moment everything changed</h2>

            <Analogy label="The Quiet Revolution">
                Imagine a world where everyone rides horses, and suddenly someone shows up with a car. That's what AlexNet did to computer vision in 2012.
                <br /><br />
                Before AlexNet, computers "looked" at images by detecting edges and corners manually crafted by smart people. AlexNet learned to see—on its own—by looking at millions of images.
            </Analogy>

            <Analogy label="The Recipe for Success">
                AlexNet didn't just have one good idea—it had several:
                <br /><br />
                • <strong>Deep</strong>: 8 layers (previous winners had hand-tuned shallow features)
                <br />
                • <strong>Fast</strong>: ReLU activation made training 6× faster
                <br />
                • <strong>Big</strong>: 60 million parameters learned from data
                <br />
                • <strong>Two GPUs</strong>: Trained on gaming graphics cards (GTX 580)
            </Analogy>

            <Analogy label="The Competition">
                In 2012, AlexNet got 15% error on ImageNet. The next best got 26%! That's like winning a race by a lap when everyone else thought they were doing well.
                <br /><br />
                It wasn't just better—it was a different species of solution.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>AlexNet: The breakthrough architecture</h2>

            <h3>ImageNet Challenge 2012</h3>
            <p>
                ImageNet contains 1.2 million training images across 1,000 categories.
                The challenge: classify unseen images into the correct category.
                Top-5 error measures whether the true label is in the top 5 predictions.
            </p>

            <h3>AlexNet Architecture</h3>
            <p>
                AlexNet had 8 layers: 5 convolutional + 3 fully-connected:
            </p>
            <ul>
                <li><strong>Input</strong>: 227×227 RGB image</li>
                <li><strong>Conv1</strong>: 96 filters, 11×11, stride 4 → 55×55</li>
                <li><strong>Pool1</strong>: 3×3 max pool, stride 2 → 27×27</li>
                <li><strong>Conv2</strong>: 256 filters, 5×5, pad 2 → 27×27</li>
                <li><strong>Pool2</strong>: 3×3 max pool, stride 2 → 13×13</li>
                <li><strong>Conv3</strong>: 384 filters, 3×3, pad 1 → 13×13</li>
                <li><strong>Conv4</strong>: 384 filters, 3×3, pad 1 → 13×13</li>
                <li><strong>Conv5</strong>: 256 filters, 3×3, pad 1 → 13×13</li>
                <li><strong>Pool3</strong>: 3×3 max pool, stride 2 → 6×6</li>
                <li><strong>FC6</strong>: 4096 units with ReLU + Dropout</li>
                <li><strong>FC7</strong>: 4096 units with ReLU + Dropout</li>
                <li><strong>FC8</strong>: 1000-way softmax (output)</li>
            </ul>

            <h3>Key innovations</h3>
            <ol>
                <li><strong>ReLU</strong>: First major network to use ReLU. Training was 6× faster than tanh equivalents.</li>
                <li><strong>GPU training</strong>: Split across two GTX 580 GPUs. Each GPU handled half the feature maps.</li>
                <li><strong>Local Response Normalization</strong>: Competitive normalization across neighboring feature maps (improved accuracy, though later architectures used BatchNorm instead).</li>
                <li><strong>Overlapping pooling</strong>: 3×3 pooling with stride 2 (instead of 2×2 with stride 2) reduced overfitting.</li>
                <li><strong>Data augmentation</strong>: Random crops, horizontal flips, and PCA-based color jittering.</li>
                <li><strong>Dropout</strong>: 0.5 dropout on FC layers prevented overfitting.</li>
            </ol>

            <hr className="ch7-sep" />

            <div className="ch7-callout">
                <strong>Top-5 error results (ImageNet 2012):</strong><br />
                AlexNet: 15.3% → Previous best: 26.2% → The gap was unprecedented.<br />
                By 2015, deep nets achieved 3.6% — below human error rate (5.1%).
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>AlexNet: Technical details</h2>

            <DefBlock label="Architecture Statistics">
                • Total parameters: ~60 million<br />
                • Conv layers: 5 (253K parameters total)<br />
                • FC layers: 3 (58.6M parameters)<br />
                • Input: 224×224×3 (or 227×227×3 in the paper)<br />
                • Output: 1000-way softmax for classification<br />
                • Training: 5-6 days on 2× GTX 580 GPUs
            </DefBlock>

            <h3>Convolution dimensions</h3>
            <p>For a convolution with kernel size k, stride s, padding p:</p>
            <MathBlock tex="H_{out} = \\lfloor \\frac{H_{in} + 2p - k}{s} \\rfloor + 1" />

            <h3>Local Response Normalization (LRN)</h3>
            <p>
                AlexNet used a normalization scheme (now largely superseded by BatchNorm):
            </p>
            <MathBlock tex="b_{x,y}^i = \\frac{a_{x,y}^i}{\\left(1 + \\frac{\\alpha}{n} \\sum_{j=\\max(0,i-n/2)}^{\\min(N-1,i+n/2)} (a_{x,y}^j)^2 \\right)^\\beta}" />
            <p>
                where a is the activation, n is the neighborhood size (5), and α=10⁻⁴, β=0.75.<br />
                This creates competition between adjacent feature maps.
            </p>

            <h3>Training details</h3>
            <ul>
                <li><strong>Optimizer</strong>: SGD with momentum 0.9</li>
                <li><strong>Learning rate</strong>: Started at 0.01, divided by 10 when error plateaued</li>
                <li><strong>Weight decay</strong>: 0.0005 (L2 regularization)</li>
                <li><strong>Batch size</strong>: 128</li>
                <li><strong>Data augmentation</strong>: 224×224 random crops from 256×256 images</li>
                <li><strong>Color augmentation</strong>: PCA on RGB values across ImageNet</li>
            </ul>

            <h3>Multi-GPU training</h3>
            <p>
                AlexNet was split across two GPUs. Conv1, Conv2, Conv4, Conv5 had no cross-GPU communication.
                Conv3 and FC layers communicated between GPUs. This was necessary because a single GTX 580 only had 3GB of memory.
            </p>

            <div className="ch7-callout">
                <strong>Historical significance:</strong> AlexNet proved that deep learning,
                ReLU, GPU training, and data augmentation together could achieve breakthrough
                results. Every subsequent architecture built on these foundations.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── AlexNet Architecture in PyTorch ──────────────────────────────────────────
class AlexNet(nn.Module):
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

        # Dropout
        self.dropout = nn.Dropout(0.5)

        # Local Response Norm (simplified - modern code uses BatchNorm)
        self.lrn = nn.LocalResponseNorm(size=5, alpha=1e-4, beta=0.75, k=1)

    def forward(self, x):
        # Layer 1: Conv + ReLU + LRN + Pool
        x = F.relu(self.conv1(x))
        x = self.lrn(x)
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Layer 2: Conv + ReLU + LRN + Pool
        x = F.relu(self.conv2(x))
        x = self.lrn(x)
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Layer 3: Conv + ReLU
        x = F.relu(self.conv3(x))

        # Layer 4: Conv + ReLU
        x = F.relu(self.conv4(x))

        # Layer 5: Conv + ReLU + Pool
        x = F.relu(self.conv5(x))
        x = F.max_pool2d(x, kernel_size=3, stride=2)

        # Flatten for FC layers
        x = x.view(x.size(0), -1)

        # Layer 6: FC + ReLU + Dropout
        x = F.relu(self.fc1(x))
        x = self.dropout(x)

        # Layer 7: FC + ReLU + Dropout
        x = F.relu(self.fc2(x))
        x = self.dropout(x)

        # Layer 8: Output (no softmax - included in CrossEntropyLoss)
        x = self.fc3(x)
        return x

# ── Create model and count parameters ───────────────────────────────────────
model = AlexNet(num_classes=1000)

# Count parameters
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)

print(f"AlexNet Parameter Statistics:")
print(f"  Total parameters: {total_params:,}")
print(f"  Trainable parameters: {trainable_params:,}")
print(f"  Model size: ~{total_params * 4 / 1e6:.1f} MB (float32)")

# Breakdown by layer
print("\nParameter breakdown:")
for name, module in model.named_modules():
    params = sum(p.numel() for p in module.parameters(recurse=False))
    if params > 0:
        print(f"  {name:15s}: {params:>12,} params")

# ── Test with random input ───────────────────────────────────────────────────
batch_size = 4
x = torch.randn(batch_size, 3, 224, 224)
output = model(x)
print(f"\nInput shape: {x.shape}")
print(f"Output shape: {output.shape}")
print(f"Output means (per sample): {output.mean(dim=1).detach()}")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of AlexNet, demonstrating the full architecture
                with ~60 million parameters.
            </p>
            <CodeBlock code={PY_CODE} filename="alexnet.py" lang="python" langLabel="Python" />
            <div className="ch7-callout">
                <strong>Architecture insight:</strong> Most parameters (58.6M out of 60M)
                are in the fully-connected layers. Modern architectures (ResNet, EfficientNet)
                reduce this with global average pooling.
            </div>
        </>
    )
}

const TS_CODE = `// ── AlexNet-inspired Architecture in TypeScript ────────────────────────────
// Pure TypeScript implementation (no ML libraries)

type Tensor3D = number[][][];  // [channels][height][width]
type Tensor1D = number[];

// ── Convolution operation (simplified) ───────────────────────────────────────
function conv2d(
  input: Tensor3D,
  filters: number[][][][],  // [out_channels][in_channels][k][k]
  bias: number[],
  stride = 1,
  padding = 0
): Tensor3D {
  const outC = filters.length;
  const inC = input.length;
  const inH = input[0].length;
  const inW = input[0][0].length;
  const k = filters[0][0].length;

  const outH = Math.floor((inH + 2 * padding - k) / stride) + 1;
  const outW = Math.floor((inW + 2 * padding - k) / stride) + 1;

  const output: Tensor3D = Array.from({ length: outC }, () =>
    Array.from({ length: outH }, () => Array(outW).fill(0))
  );

  for (let oc = 0; oc < outC; oc++) {
    for (let oh = 0; oh < outH; oh++) {
      for (let ow = 0; ow < outW; ow++) {
        let sum = bias[oc];
        for (let ic = 0; ic < inC; ic++) {
          for (let kh = 0; kh < k; kh++) {
            for (let kw = 0; kw < k; kw++) {
              const ih = oh * stride + kh - padding;
              const iw = ow * stride + kw - padding;
              if (ih >= 0 && ih < inH && iw >= 0 && iw < inW) {
                sum += input[ic][ih][iw] * filters[oc][ic][kh][kw];
              }
            }
          }
        }
        output[oc][oh][ow] = sum;
      }
    }
  }
  return output;
}

// ── ReLU activation ──────────────────────────────────────────────────────────
function relu3d(x: Tensor3D): Tensor3D {
  return x.map(channel =>
    channel.map(row => row.map(v => Math.max(0, v)))
  );
}

function relu1d(x: Tensor1D): Tensor1D {
  return x.map(v => Math.max(0, v));
}

// ── Max pooling ─────────────────────────────────────────────────────────────
function maxPool2d(x: Tensor3D, k = 3, stride = 2): Tensor3D {
  const C = x.length;
  const H = x[0].length;
  const W = x[0][0].length;

  const outH = Math.floor((H - k) / stride) + 1;
  const outW = Math.floor((W - k) / stride) + 1;

  const output: Tensor3D = Array.from({ length: C }, () =>
    Array.from({ length: outH }, () => Array(outW).fill(0))
  );

  for (let c = 0; c < C; c++) {
    for (let oh = 0; oh < outH; oh++) {
      for (let ow = 0; ow < outW; ow++) {
        let maxVal = -Infinity;
        for (let kh = 0; kh < k; kh++) {
          for (let kw = 0; kw < k; kw++) {
            const h = oh * stride + kh;
            const w = ow * stride + kw;
            if (h < H && w < W) {
              maxVal = Math.max(maxVal, x[c][h][w]);
            }
          }
        }
        output[c][oh][ow] = maxVal;
      }
    }
  }
  return output;
}

// ── Flatten 3D to 1D ────────────────────────────────────────────────────────
function flatten(x: Tensor3D): Tensor1D {
  return x.flat(2);
}

// ── Linear layer ────────────────────────────────────────────────────────────
function linear(x: Tensor1D, W: number[][], b: Tensor1D): Tensor1D {
  return W.map((row, i) =>
    row.reduce((sum, w, j) => sum + w * x[j], 0) + b[i]
  );
}

// ── AlexNet Forward Pass (simplified, single-GPU version) ────────────────────
function alexnetForward(input: Tensor3D): Tensor1D {
  // Note: In practice, you would use pre-trained weights
  // Here we use random weights for demonstration

  // Layer 1: Conv(3, 96, 11, stride=4, padding=2) -> ReLU -> Pool
  // Simplified: assume filters are already defined
  // Output: 96 x 55 x 55 -> 96 x 27 x 27 after pool

  // Layer 2: Conv(96, 256, 5, padding=2) -> ReLU -> Pool
  // Output: 256 x 27 x 27 -> 256 x 13 x 13 after pool

  // Layers 3-5: Conv layers -> ReLU -> Pool
  // Layer 5 output: 256 x 6 x 6 = 9216

  // Flatten for FC layers
  const flattened = new Array(9216).fill(0).map(() => Math.random());

  // FC layers with ReLU
  // FC6: 9216 -> 4096
  const fc6Weights = Array.from({ length: 4096 }, () =>
    Array.from({ length: 9216 }, () => (Math.random() - 0.5) * 0.01)
  );
  const fc6Bias = new Array(4096).fill(0);
  const fc6 = relu1d(linear(flattened, fc6Weights, fc6Bias));

  // FC7: 4096 -> 4096
  const fc7Weights = Array.from({ length: 4096 }, () =>
    Array.from({ length: 4096 }, () => (Math.random() - 0.5) * 0.01)
  );
  const fc7Bias = new Array(4096).fill(0);
  const fc7 = relu1d(linear(fc6, fc7Weights, fc7Bias));

  // FC8: 4096 -> 1000 (output scores)
  const fc8Weights = Array.from({ length: 1000 }, () =>
    Array.from({ length: 4096 }, () => (Math.random() - 0.5) * 0.01)
  );
  const fc8Bias = new Array(1000).fill(0);
  const output = linear(fc7, fc8Weights, fc8Bias);

  return output;
}

// ── Demonstration ───────────────────────────────────────────────────────────
console.log("AlexNet-inspired Forward Pass (TypeScript)");
console.log("=" .repeat(50));

// Create a random input image (3 x 224 x 224)
const inputImage: Tensor3D = Array.from({ length: 3 }, () =>
  Array.from({ length: 224 }, () =>
    Array.from({ length: 224 }, () => Math.random())
  )
);

console.log("Input shape: [3, 224, 224]");
console.log("(RGB image with 224x224 resolution)");

// Forward pass
const output = alexnetForward(inputImage);

console.log(\`\\nOutput shape: [\${output.length}]\`);
console.log("(1000 class scores for ImageNet classification)");

// Show statistics
const mean = output.reduce((a, b) => a + b, 0) / output.length;
const maxVal = Math.max(...output);
const minVal = Math.min(...output);
console.log(\`\\nOutput statistics:\`);
console.log(\`  Mean: \${mean.toFixed(4)}\`);
console.log(\`  Min: \${minVal.toFixed(4)}\`);
console.log(\`  Max: \${maxVal.toFixed(4)}\`);

// Softmax to get probabilities
const expScores = output.map(x => Math.exp(x - maxVal)); // subtract max for stability
const sumExp = expScores.reduce((a, b) => a + b, 0);
const probs = expScores.map(x => x / sumExp);

const top5Idx = probs
  .map((p, i) => ({ p, i }))
  .sort((a, b) => b.p - a.p)
  .slice(0, 5);

console.log("\\nTop 5 predicted classes (example indices):");
top5Idx.forEach(({ p, i }, rank) => {
  console.log(\`  \${rank + 1}. Class \${i}: \${(p * 100).toFixed(2)}%\`);
});

console.log("\\nNote: This uses random weights for demonstration.");
console.log("Real AlexNet requires ~240MB of trained parameters.");`;

function CodeTab() {
    return (
        <>
            <p>
                Pure TypeScript implementation of AlexNet operations showing the
                forward pass logic without external ML libraries.
            </p>
            <CodeBlock code={TS_CODE} filename="alexnet.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch7-callout">
                <strong>The legacy:</strong> AlexNet's 2012 breakthrough established
                the template for modern CNNs: depth + ReLU + dropout + GPU training.
                The entire computer vision field shifted in months.
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
