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
            year: "2017",
            title: "DenseNet: Extreme Feature Reuse",
            context:
                "ResNet's skip connections allowed gradients to flow through identity paths, but information still passed through relatively few direct connections. Researchers at Cornell, Tsinghua, and Facebook asked: what if layers were connected to everything?",
            what:
                "Dense Convolutional Networks (DenseNet) connect each layer to every other layer in a feed-forward fashion. In a dense block with L layers, there are L(L+1)/2 direct connections. The l-th layer receives feature maps from all preceding layers as input.",
            impact:
                "DenseNet achieved state-of-the-art with fewer parameters than ResNet. The extreme feature reuse meant less need to relearn redundant features. DenseNets are particularly parameter-efficient at smaller sizes, making them popular for mobile applications.",
        },
        {
            year: "2018–2020",
            title: "Dense Connections in Other Domains",
            context:
                "DenseNet's connectivity pattern proved applicable beyond image classification.",
            what:
                "DenseNet-inspired architectures appeared in semantic segmentation (dense skip connections in U-Nets), action recognition, and medical imaging. The principle—that feature reuse reduces parameters—influenced EfficientNet and other efficient architectures.",
            impact:
                "While pure DenseNets are less common today (memory overhead grows quadratically with depth), the principles of feature reuse persist. Modern architectures combine dense connectivity with efficient attention mechanisms.",
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
            <h2>DenseNet: Everyone Talks to Everyone</h2>

            <Analogy label="The Research Team">
                Imagine a research team working on a big project:
                <br /><br />
                • In a regular team, everyone works alone and submits to one boss at the end.<br />
                • In a ResNet team, each person talks to the person before them and shares quick notes.<br />
                • In a DenseNet team, EVERYONE is in the same room and can see EVERYONE else's work immediately!
            </Analogy>

            <Analogy label="A Growing Library">
                Imagine building a library where each new book (layer) gets added to the same shared shelf.
                <br /><br />
                <strong>Book 1:</strong> Basic ideas (k books)<br />
                <strong>Book 2:</strong> Adds k more books, but can read all previous books too<br />
                <strong>Book 3:</strong> Adds k more books, can read Books 1 AND 2<br />
                <strong>Book L:</strong> Adds k books, can read ALL L-1 previous books!
                <br /><br />
                By the 10th book, there are k₀ + 10k books total on the shared shelf.
                Every new author can access everything that came before!
            </Analogy>

            <DefBlock label="Growth Rate (k)">
                Each new layer only adds k new feature maps—the "growth rate." Typical values
                are k=12, 24, or 32. Even though the total number of feature maps grows,
                each individual layer stays small and manageable because it only produces k outputs.
            </DefBlock>

            <Analogy label="Why This Saves Work">
                Imagine learning to draw animals:
                <br /><br />
                • In a regular network, the 10th layer has to relearn "what are eyes?" even though
                the 2nd layer already figured that out.<br />
                • In DenseNet, the 10th layer can just look at the 2nd layer's notes and say
                "ah yes, eyes are circles with dots, I see that data right here!"
                <br /><br />
                Less relearning = fewer total parameters needed = more efficient!
            </Analogy>

            <Analogy label="Moving to New Libraries">
                DenseNet uses "transition layers" between blocks. It's like saying: "We've collected
                too many books at this library, let's move to a new branch!" The transition:
                <br /><br />
                1. Picks the most important books (1×1 convolution reduces channels)<br />
                2. Makes the library smaller (2×2 pooling reduces spatial size)<br />
                3. Starts fresh at the new branch with just the essentials
            </Analogy>

            <div className="ch-callout">
                <strong>Super efficient:</strong> DenseNet-121 uses only ~8 million parameters
                (vs ResNet-50's ~25 million) but achieves similar accuracy! The extreme feature
                reuse means less work is repeated.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>DenseNet: Maximum Feature Reuse</h2>

            <p>
                ResNet's skip connections were revolutionary, allowing gradients to flow through
                identity paths and enabling very deep networks. But ResNet only adds the
                previous layer's output—it doesn't preserve access to earlier features.
                DenseNet takes the connection idea to its extreme: every layer connects to
                every subsequent layer.
            </p>

            <h3>Dense Connectivity</h3>
            <p>
                In a dense block with L layers, the l-th layer receives feature maps from all
                preceding layers as input:
            </p>
            <p>
                <strong>xₗ = Hₗ([x₀, x₁, ..., xₗ₋₁])</strong>
            </p>
            <p>
                where [·] denotes concatenation along the channel dimension. Hₗ is a composite
                function: Batch Normalization → ReLU → 3×3 Convolution.
            </p>

            <DefBlock label="Growth Rate Concept">
                Each layer adds only k new feature maps (the "growth rate"). Unlike other
                architectures where each layer produces all output channels, DenseNet layers
                are narrow:
                <br /><br />
                • Layer 0: C₀ channels (input)<br />
                • Layer 1: C₀ + k channels (concatenated input + k new)<br />
                • Layer 2: C₀ + 2k channels<br />
                • Layer L: C₀ + Lk channels<br />
                <br />
                The total feature map count grows linearly, but each layer only produces k.
            </DefBlock>

            <h3>Transition Layers</h3>
            <p>
                Between dense blocks, DenseNet uses "transition layers" to control complexity:
            </p>
            <ol>
                <li><strong>1×1 convolution:</strong> Dimensionality reduction (compression)</li>
                <li><strong>2×2 average pooling:</strong> Spatial downsampling by half</li>
            </ol>
            <p>
                The compression factor θ (typically 0.5) reduces channel count: C_out = ⌊θ × C_in⌋.
                This prevents the channel explosion from becoming unmanageable.
            </p>

            <h3>Why Feature Reuse Matters</h3>
            <p>
                In traditional CNNs and even ResNets, each layer must "re-discover" features
                that earlier layers found. A layer at depth 20 might need to detect edges again,
                even though layer 2 already did so. DenseNet allows direct access: layer 20
                can see layer 2's edge detectors and focus on higher-level patterns instead.
            </p>

            <div className="ch-callout">
                <strong>Parameter efficiency:</strong> DenseNet-121 achieves ResNet-50-level
                accuracy with only 8M vs 25M parameters—roughly 3× fewer! This is achieved
                through aggressive feature reuse rather than learning redundant representations.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>DenseNet: Mathematical Analysis</h2>

            <h3>Feature Map Growth</h3>
            <p>
                In a dense block with growth rate k:
            </p>
            <MathBlock tex="C_\ell = k_0 + k \times \ell" />
            <p>
                where C_ℓ is the number of input channels to layer ℓ, k₀ is the input channel count,
                and k is the growth rate (new feature maps per layer).
            </p>

            <h3>Composite Function</h3>
            <p>
                Each layer applies three operations:
            </p>
            <MathBlock tex="x_\ell = H_\ell([x_0, x_1, \ldots, x_{\ell-1}])" />
            <p>
                where H_ℓ is the composite function: BatchNorm → ReLU → 3×3 Conv.
                The concatenation [·] is along the channel dimension.
            </p>

            <h3>Number of Connections</h3>
            <p>
                For a dense block with L layers, the number of direct connections:
            </p>
            <MathBlock tex="\text{Connections} = \frac{L(L+1)}{2}" />
            <p>
                Compare to ResNet with L layers: L skip connections (one per layer).
                DenseNet has O(L²) connections while ResNet has O(L).
            </p>

            <h3>Transition Layer Compression</h3>
            <p>
                After a dense block with output channels C_out:
            </p>
            <MathBlock tex="C_{trans} = \lfloor \theta \times C_{out} \rfloor" />
            <p>
                where θ is the compression factor (typically 0.5). This reduces channels
                by half between dense blocks, making deeper networks feasible.
            </p>

            <h3>Parameter Count Comparison</h3>
            <p>
                For a network with comparable accuracy to ResNet-50:
            </p>
            <ul>
                <li>ResNet-50: ~25.6M parameters</li>
                <li>DenseNet-121 (k=32): ~8.0M parameters</li>
            </ul>
            <p>
                DenseNet uses ~3× fewer parameters by reusing features instead of learning
                redundant patterns. However, memory usage can be higher during training
                due to storing all intermediate feature maps for concatenation.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── DenseNet: Dense Connections ────────────────────────────────────────────────

class DenseLayer(nn.Module):
    """
    Single layer in a dense block.
    BN -> ReLU -> 3×3 Conv, outputting k (growth rate) feature maps.
    """
    def __init__(self, in_channels, growth_rate, bn_size=4):
        super().__init__()

        # Bottleneck: 1×1 conv reduces computation
        self.bn1 = nn.BatchNorm2d(in_channels)
        self.conv1 = nn.Conv2d(in_channels, bn_size * growth_rate,
                               kernel_size=1, bias=False)

        # 3×3 conv produces growth_rate new feature maps
        self.bn2 = nn.BatchNorm2d(bn_size * growth_rate)
        self.conv2 = nn.Conv2d(bn_size * growth_rate, growth_rate,
                               kernel_size=3, padding=1, bias=False)

    def forward(self, x):
        # Input could be single tensor or list of tensors from prev layers
        if isinstance(x, list):
            x = torch.cat(x, dim=1)

        # Bottleneck
        out = self.conv1(torch.relu(self.bn1(x)))
        # 3×3 conv
        out = self.conv2(torch.relu(self.bn2(out)))

        return out


class DenseBlock(nn.Module):
    """
    Dense block: each layer receives all previous layers' outputs.
    """
    def __init__(self, num_layers, in_channels, growth_rate, bn_size=4):
        super().__init__()

        self.layers = nn.ModuleList()
        for i in range(num_layers):
            layer = DenseLayer(in_channels + i * growth_rate, growth_rate, bn_size)
            self.layers.append(layer)

    def forward(self, x):
        features = [x]

        for layer in self.layers:
            out = layer(features)
            features.append(out)

        # Concatenate all feature maps
        return torch.cat(features, dim=1)


class TransitionLayer(nn.Module):
    """
    Transition between dense blocks: BN -> 1×1 Conv -> 2×2 AvgPool.
    Reduces spatial dimensions and optionally compresses channels.
    """
    def __init__(self, in_channels, out_channels):
        super().__init__()

        self.bn = nn.BatchNorm2d(in_channels)
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False)
        self.pool = nn.AvgPool2d(kernel_size=2, stride=2)

    def forward(self, x):
        x = self.conv(torch.relu(self.bn(x)))
        x = self.pool(x)
        return x


class DenseNet(nn.Module):
    """DenseNet architecture."""

    def __init__(self, growth_rate=32, block_config=(6, 12, 24, 16),
                 num_init_features=64, bn_size=4, compression=0.5,
                 num_classes=1000):
        super().__init__()

        # Initial convolution
        self.features = nn.Sequential(
            nn.Conv2d(3, num_init_features, kernel_size=7,
                     stride=2, padding=3, bias=False),
            nn.BatchNorm2d(num_init_features),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
        )

        # Dense blocks
        num_features = num_init_features
        for i, num_layers in enumerate(block_config):
            # Dense block
            block = DenseBlock(num_layers, num_features, growth_rate, bn_size)
            self.features.add_module(f'denseblock{i+1}', block)
            num_features = num_features + num_layers * growth_rate

            # Transition (except after last block)
            if i != len(block_config) - 1:
                trans_channels = int(num_features * compression)
                trans = TransitionLayer(num_features, trans_channels)
                self.features.add_module(f'transition{i+1}', trans)
                num_features = trans_channels

        # Final batch norm
        self.features.add_module('norm_final', nn.BatchNorm2d(num_features))

        # Classifier
        self.classifier = nn.Linear(num_features, num_classes)

        self._initialize_weights()

    def forward(self, x):
        features = self.features(x)
        out = torch.relu(features)
        out = torch.nn.functional.adaptive_avg_pool2d(out, (1, 1))
        out = torch.flatten(out, 1)
        out = self.classifier(out)
        return out

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.constant_(m.bias, 0)


# Factory functions
def densenet121(num_classes=1000):
    """DenseNet-121: (6, 12, 24, 16) layers in 4 dense blocks."""
    return DenseNet(growth_rate=32, block_config=(6, 12, 24, 16),
                   num_init_features=64, num_classes=num_classes)

def densenet169(num_classes=1000):
    """DenseNet-169: (6, 12, 32, 32) layers."""
    return DenseNet(growth_rate=32, block_config=(6, 12, 32, 32),
                   num_init_features=64, num_classes=num_classes)

def densenet201(num_classes=1000):
    """DenseNet-201: (6, 12, 48, 32) layers."""
    return DenseNet(growth_rate=32, block_config=(6, 12, 48, 32),
                   num_init_features=64, num_classes=num_classes)


# ── Usage ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    models = [
        ('DenseNet-121', densenet121()),
        ('DenseNet-169', densenet169()),
        ('DenseNet-201', densenet201()),
    ]

    x = torch.randn(2, 3, 224, 224)

    print("DenseNet: Extreme feature reuse through dense connections")
    print("=" * 60)

    for name, model in models:
        y = model(x)
        params = sum(p.numel() for p in model.parameters())
        print(f"{name}: {params:,} params, output: {y.shape}")

    # Compare to ResNet-50
    print(f"\nFor reference, ResNet-50 has ~25.6M parameters")
    print(f"DenseNet-121 achieves similar accuracy with ~8M parameters!")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of DenseNet with dense blocks, bottleneck layers,
                and transition layers. Each dense layer concatenates its output to all
                subsequent layers.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="densenet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Implementation note:</strong> DenseNet concatenates feature maps
                along the channel dimension. This means channel counts grow rapidly—
                transition layers with compression are essential for deeper networks.
            </div>
        </>
    )
}




export const DENSENET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
