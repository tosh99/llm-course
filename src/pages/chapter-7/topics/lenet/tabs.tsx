import { Analogy, CodeBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>LeNet-5: The CNN That Changed Everything</h2>
            <p>
                Published by LeCun, Bottou, Bengio, and Haffner in 1998, LeNet-5 established the blueprint
                for convolutional networks that persists today. It processed 32×32 grayscale images through
                a series of convolutions, subsampling (pooling), and fully-connected layers.
            </p>

            <h3>Architecture Details</h3>
            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">C1</div>
                    <div className="ch-tl-title">Convolutional Layer</div>
                    <div className="ch-tl-body">
                        6 feature maps, each 28×28. 5×5 kernels with stride 1. Each unit connected to
                        25 inputs from the 32×32 input. Parameters: (5×5+1)×6 = 156
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">S2</div>
                    <div className="ch-tl-title">Subsampling (Pooling)</div>
                    <div className="ch-tl-body">
                        6 feature maps, each 14×14. 2×2 averaging with learnable weights and sigmoid.
                        Reduces spatial dimensions by half, providing translation invariance.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">C3</div>
                    <div className="ch-tl-title">Convolutional Layer</div>
                    <div className="ch-tl-body">
                        16 feature maps, each 10×10. Each unit connects to multiple 5×5 receptive fields
                        from S2 using a <em>partial connection scheme</em> to break symmetry.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">S4</div>
                    <div className="ch-tl-title">Subsampling (Pooling)</div>
                    <div className="ch-tl-body">
                        16 feature maps, each 5×5. Another 2×2 pooling layer, continuing the progressive
                        spatial reduction and feature extraction hierarchy.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">C5</div>
                    <div className="ch-tl-title">Convolution → Fully-Connected</div>
                    <div className="ch-tl-body">
                        120 units. Each unit connects to all 16×5×5=400 units from S4. Operates as
                        a convolution but produces 1×1 spatial output (effectively FC).
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">F6</div>
                    <div className="ch-tl-title">Fully-Connected</div>
                    <div className="ch-tl-body">
                        84 units. Each connected to all 120 C5 units. Uses tanh activation. The 84 outputs
                        were designed to match a specific character encoding format.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Output</div>
                    <div className="ch-tl-title">RBF Classifier</div>
                    <div className="ch-tl-body">
                        10 units (for digits 0-9). Used radial basis function (RBF) units rather than
                        softmax, computing distance to "ideal" digit representations.
                    </div>
                </div>
            </div>

            <div className="ch-analogy">
                <div className="ch-analogy-label">Key Innovation</div>
                <div className="ch-analogy-text">
                    LeNet-5 demonstrated that hierarchies of simple operations — convolution for feature
                    detection, pooling for spatial aggregation — could learn increasingly abstract
                    representations: from edges → simple shapes → digit parts → full digits.
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>LeNet-5: A Robot That Reads Numbers</h2>

            <Analogy label="The Puzzle Solver">
                Imagine you have a robot that needs to read handwritten numbers on checks at the bank.
                Here's how LeNet-5 taught the robot to "see":
                <br /><br />
                First, it looks at the picture with 6 different magnifying glasses (Layer 1). One glass
                looks for vertical lines, another for horizontal, another for circles, etc. This
                creates 6 "feature maps" showing where each pattern appears!
            </Analogy>

            <Analogy label="Making Things Smaller">
                Then the robot squints — it looks at each feature map and keeps only the brightest
                spot in every 2×2 square (Layer 2: Pooling). This makes the pictures smaller but keeps
                the important information. The robot now has 6 smaller maps, each 14×14.
            </Analogy>

            <Analogy label="Getting Smarter">
                Now comes the magic! The robot combines what it learned (Layer 3). The 16 new maps
                aren't just looking for edges anymore — they're looking for shapes that edges make!
                Some neurons look for curves, others for corners, others for specific patterns.
                <br /><br />
                Pool again (Layer 4) — now everything is tiny 5×5 maps. But wait — at this small size,
                16 different patterns can only mean one thing: specific parts of numbers! A loop might
                be a 0, 6, 8, or 9. A diagonal might be a 1, 4, or 7!
            </Analogy>

            <Analogy label="The Final Answer">
                Finally, the robot connects everything (Layers 5-6) and looks at all 84 clues together.
                It matches them to "perfect" versions of each digit stored in its memory (Layer 7: RBF).
                Whichever perfect digit matches best is the answer!
            </Analogy>

            <div className="ch-callout">
                <strong>LeNet-5 Fun Fact:</strong> This exact system was used in ATMs across the US
                to read the handwritten amounts on checks. It processed millions of checks and was
                incredibly accurate — over 99% on clean digits!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>LeNet-5: The Architecture That Started It All</h2>

            <p>
                LeNet-5 (1998) is the first successful CNN architecture. Its design principles are
                still used today in modern networks like ResNet and DenseNet. Let's break down why
                it works.
            </p>

            <h3>The Layer-by-Layer Transformation</h3>
            <p>
                Input: 32×32 grayscale image (1,024 pixels)
            </p>

            <h4>C1: Convolution (5×5 → 28×28)</h4>
            <p>
                6 filters, each 5×5. Output: 6 × 28 × 28 = 4,704 values.
                <br />
                Calculations: 28×28×6×(5×5+1) ≈ 122k ops per forward pass.
            </p>

            <h4>S2: Subsampling (2×2 pooling → 14×14)</h4>
            <p>
                Output: 6 × 14 × 14 = 1,176 values (75% reduction).
                <br />
                This provides translation invariance — if a digit shifts slightly, recognition still works.
            </p>

            <h4>C3: Convolution with Partial Connections</h4>
            <p>
                Here's where LeNet-5 gets clever. Not every C3 unit connects to all 6 S2 feature maps.
                This <em>partial connection scheme</em> forces the network to learn diverse features
                and breaks symmetry that could stall training.
            </p>

            <h4>C5-F6: The Transition to Classification</h4>
            <p>
                After spatial features are extracted, the network transitions to fully-connected
                layers for actual classification. 120 → 84 → 10 neurons, with the final 84 matching
                a specific "bitmap" encoding of digits (not softmax — they used RBF distance).
            </p>

            <h3>Total Parameters</h3>
            <p>
                C1: 156 | S2: 12 | C3: 1,516 | S4: 32 | C5: 48,120 | F6: 10,164 | RBF: 840
                <br />
                <strong>Total: ~60,840 parameters</strong>
            </p>


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
            <h2>LeNet-5: Mathematical Analysis</h2>

            <h3>Network Dimensions</h3>
            <p>
                The dimension progression through LeNet-5:
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', background: '#111115' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #252530' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Layer</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Input</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Output</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Parameters</th>
                    </tr>
                </thead>
                <tbody style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>C1</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>32×32×1</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>28×28×6</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>(5×5×1+1)×6 = 156</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>S2</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>28×28×6</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>14×14×6</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>(1+1)×6 = 12</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>C3</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>14×14×6</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>10×10×16</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>∑(nᵢ×25+1) = 1,516</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>S4</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>10×10×16</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>5×5×16</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>(1+1)×16 = 32</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>C5</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>5×5×16</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>1×1×120</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>(400+1)×120 = 48,120</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1a1a25' }}>
                        <td style={{ padding: '10px 12px' }}>F6</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>120</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>84</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>(120+1)×84 = 10,164</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px 12px' }}>RBF</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>84</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>10</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>84×10 = 840</td>
                    </tr>
                </tbody>
            </table>

            <p style={{ textAlign: 'right', fontWeight: 600, color: '#e8a838' }}>
                Total: 60,840 parameters
            </p>

            <h3>RBF Loss Function</h3>
            <p>
                The original LeNet-5 used Radial Basis Functions instead of softmax:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                RBF(yᵢ) = exp(-β||yᵢ - wⱼ||²)
            </div>
            <p>
                Where wⱼ is a "template" for digit j. The network learns to match inputs to these
                templates. Modern implementations typically use softmax with cross-entropy instead.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet5(nn.Module):
    """
    LeNet-5 implementation following LeCun et al. 1998.
    
    Architecture:
    Input: 1x32x32 grayscale image
    C1: Conv(1→6, 5x5) → 6x28x28
    S2: AvgPool(2x2, stride 2) → 6x14x14
    C3: Conv(6→16, 5x5) → 16x10x10
    S4: AvgPool(2x2, stride 2) → 16x5x5
    C5: Conv(16→120, 5x5) → 120x1x1
    F6: FC(120→84) → 84
    Output: FC(84→10) → 10
    """

    def __init__(self, num_classes=10):
        super(LeNet5, self).__init__()

        # Feature extraction layers
        self.C1 = nn.Conv2d(1, 6, kernel_size=5, stride=1, padding=0)
        self.S2 = nn.AvgPool2d(kernel_size=2, stride=2)
        self.C3 = nn.Conv2d(6, 16, kernel_size=5, stride=1, padding=0)
        self.S4 = nn.AvgPool2d(kernel_size=2, stride=2)

        # Fully-connected classifier
        self.C5 = nn.Conv2d(16, 120, kernel_size=5, stride=1, padding=0)
        self.F6 = nn.Linear(120, 84)
        self.output = nn.Linear(84, num_classes)

    def forward(self, x):
        # C1 + activation (tanh historically, ReLU modern)
        x = F.tanh(self.C1(x))
        x = self.S2(x)

        # C3 + activation
        x = F.tanh(self.C3(x))
        x = self.S4(x)

        # C5 + flatten
        x = F.tanh(self.C5(x))
        x = x.view(x.size(0), -1)

        # F6
        x = F.tanh(self.F6(x))

        # Output
        x = self.output(x)
        return x


# Modern variant with improvements
class ModernLeNet5(nn.Module):
    """LeNet-5 with modern training techniques."""

    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 6, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(6, 16, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 120, 5),
            nn.ReLU(),
        )
        self.classifier = nn.Sequential(
            nn.Linear(120, 84),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(84, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x


if __name__ == "__main__":
    model = LeNet5(num_classes=10)
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Total parameters: {total_params:,}")
    # Output: ~60,840 parameters

    x = torch.randn(1, 1, 32, 32)
    logits = model(x)
    print(f"Output shape: {logits.shape}")`;

function PythonContent() {
    return (
        <>
            <p>
                This PyTorch implementation stays true to the original 1998 paper while using
                modern conveniences. Note the use of <code>AvgPool2d</code> for S2 and S4 layers
                (historical choice) and <code>tanh</code> activations.
            </p>
            <CodeBlock code={PY_CODE} filename="lenet5.py" lang="python" />
            <div className="ch-callout">
                <strong>Modern improvements:</strong> ReLU instead of tanh, MaxPool instead of AvgPool,
                Dropout, and softmax instead of RBF. These changes make training faster and more stable.
            </div>
        </>
    )
}




// ── Tab content map ─────────────────────────────────────────────────────────────

export const LENET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
