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

            <div className="ch-callout">
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

            <div className="ch-callout">
                <strong>VGG-16 vs VGG-19:</strong> VGG-19 simply adds 3 more convolution layers in
                the middle blocks. Surprisingly, this small change often improves accuracy.
                Depth matters more than width!
            </div>


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

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of VGGNet showing the clean, repetitive structure
                with configurable depth. The key insight: uniform 3×3 convolutions
                throughout enable unprecedented depth.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="vggnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Design principle:</strong> Notice how each block doubles channels
                while halving spatial dimensions. This maintains constant compute per layer
                (roughly) while building hierarchical representations.
            </div>
        </>
    )
}




export const VGGNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
