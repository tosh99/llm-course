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

            <div className="ch-callout">
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

            <div className="ch-callout">
                <strong>Auxiliary Classifiers:</strong> GoogLeNet adds extra classification
                branches at intermediate layers (Inception 4a and 4d). These provide additional
                gradient signal during training, combating vanishing gradients in deep networks.
                They're discarded at test time.
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

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of the Inception module with 1×1 bottlenecks.
                The branches operate in parallel and concatenate outputs.
                Notice the global average pooling—no fully connected layers!
            </p>
            <CodeBlock code={PYTHON_CODE} filename="googlenet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key observations:</strong> 1) 1×1 convolutions dramatically reduce
                compute. 2) Global average pooling replaces expensive FC layers. 3) Multi-scale
                processing captures features at all resolutions.
            </div>
        </>
    )
}




export const GOOGLENET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
