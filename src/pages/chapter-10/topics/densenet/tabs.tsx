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
            year: "2016",
            title: "Huang, Liu, van der Maaten &amp; Weinberger &mdash; Taking Skip Connections to Their Logical Extreme",
            context:
                "ResNet proved that skip connections from one layer to the next enabled training of very deep networks. But ResNet's connections were sparse: each block skipped only one position. Gao Huang, Zhuang Liu, Laurens van der Maaten, and Kilian Weinberger at Cornell, Tsinghua, and Facebook AI Research asked a natural follow-up question: what happens if you connect every layer to every other layer? Not just adjacent layers, but all possible pairs.",
            what:
                "DenseNet, published at CVPR 2017, introduced dense blocks where the l-th layer receives as input the feature maps from all preceding layers 0, 1, ..., l-1, concatenated along the channel dimension. In a dense block with L layers, there are L(L+1)/2 direct connections. Each layer produces k new feature maps (the growth rate). After layer l, the total input width is k_0 + k(l-1) channels, where k_0 is the input channel count. Between dense blocks, transition layers compress the channel dimension with a 1&times;1 convolution and halve the spatial dimensions with a 2&times;2 average pool.",
            impact:
                "DenseNet achieved state-of-the-art accuracy on CIFAR-10, CIFAR-100, and ImageNet with substantially fewer parameters than ResNet. DenseNet-121 with k=32 uses 8 million parameters to match ResNet-50's accuracy (25 million). The parameter efficiency came from aggressive feature reuse: because every later layer can directly access every earlier layer's features, the network does not need to relearn features that were already computed.",
        },
        {
            year: "2017 &ndash; 2018",
            title: "Medical Imaging &mdash; Where DenseNet Excelled",
            context:
                "In standard computer vision, the dominant metric is top-1 accuracy on ImageNet. By this metric, ResNet-50 and later ResNeXt were competitive with DenseNet while using established infrastructure. But in medical imaging, a different trade-off applied: datasets were small (thousands, not millions), label noise was high, and the cost of false negatives (missed diagnoses) was high. These conditions changed which architecture won.",
            what:
                "DenseNet's feature reuse made it exceptionally sample-efficient: with fewer parameters and more gradient paths, it generalised better from small datasets. The CheXNet paper (Rajpurkar et al., 2017) from Stanford Medical School used DenseNet-121 to detect pneumonia from chest X-rays, achieving radiologist-level performance. DenseNets were also deployed for diabetic retinopathy grading, skin lesion classification (ISIC 2018 challenge), and brain tumour segmentation from MRI.",
            impact:
                "DenseNet became the default architecture for medical AI, a domain where it remained dominant through 2020. Its success in low-data regimes confirmed the theoretical prediction: feature reuse reduces redundancy, which reduces the effective number of parameters needed to achieve a given generalisation level. This made it a natural choice whenever data was limited.",
        },
        {
            year: "2017 &ndash; 2019",
            title: "Dense Connections in Segmentation &mdash; FC-DenseNets and U-Nets",
            context:
                "Image classification requires one global label per image. Image segmentation requires a label for every pixel. This demands architectures with both a contracting path (to build high-level understanding) and an expanding path (to recover spatial resolution). U-Net, published in 2015 for medical segmentation, used skip connections between encoder and decoder at matching spatial scales. DenseNet's dense connectivity offered a richer version of these connections.",
            what:
                "FC-DenseNet (Jégou et al., 2017) applied dense blocks within the U-Net encoder-decoder framework. Each dense block in the encoder connected to all subsequent blocks in both the encoder and the matching decoder block. This created a very rich information flow: features from the earliest layers (with fine spatial detail) were directly available to the latest decoder layers (which needed to recover spatial precision). FC-DenseNet achieved state-of-the-art on CamVid road scene segmentation.",
            impact:
                "The combination of dense connectivity with encoder-decoder architecture generalised across many structured prediction tasks. The principles from FC-DenseNet influenced HRNet, SegFormer, and other segmentation architectures that maintained multi-scale feature access throughout the network.",
        },
        {
            year: "2018 &ndash; 2020",
            title: "EfficientNet &mdash; The Architecture That Synthesised the Lessons",
            context:
                "By 2018, the field had a collection of architectural insights: VGGNet's 3&times;3 uniformity, GoogLeNet's 1&times;1 bottlenecks and multi-scale processing, ResNet's skip connections, DenseNet's feature reuse. Mingxing Tan and Quoc Le at Google Brain asked: what is the optimal way to combine all of these and scale them up together?",
            what:
                "EfficientNet (Tan and Le, 2019) defined a compound scaling rule: simultaneously scale network depth, width (number of channels), and resolution in a fixed ratio determined by neural architecture search. The base network (EfficientNet-B0) used mobile inverted bottleneck blocks with 1&times;1 expansions &mdash; the direct descendant of DenseNet's bottleneck idea. EfficientNet-B7 achieved 84.3% top-1 accuracy on ImageNet, then state-of-the-art, with 8.4&times; fewer parameters than previous models at comparable accuracy.",
            impact:
                "EfficientNet demonstrated that the design principles discovered across 2012&ndash;2017 (AlexNet through DenseNet) could be combined and scaled systematically. It is the natural conclusion of the CNN architecture story told in this chapter: each architecture contributed one key insight, and EfficientNet showed how to compose all of them.",
        },
        {
            year: "2020 &ndash; present",
            title: "The CNN Architecture Story Reaches Its Limit &mdash; and Vision Transformers Arrive",
            context:
                "By 2020, the field had produced ResNeXt, SENet, RegNet, EfficientNet, and dozens of NAS-discovered variants. Each improved on the previous generation in top-1 accuracy, but the improvements were increasingly marginal. The CNN architecture space had been extensively explored. Simultaneously, the Transformer architecture &mdash; which used self-attention rather than convolution for mixing spatial information &mdash; had revolutionised NLP and was beginning to challenge CNNs in vision.",
            what:
                "The Vision Transformer (ViT, Dosovitskiy et al., 2020) applied the Transformer encoder directly to sequences of image patches. At large scale, ViT outperformed state-of-the-art CNNs. ConvNeXt (Liu et al., 2022) responded by modernising ResNets with Transformer-inspired design choices (larger kernels, inverted bottlenecks, fewer activation functions, LayerNorm instead of BatchNorm), showing that CNNs could match ViTs if designed with the same principles.",
            impact:
                "The CNN-vs-Transformer debate is not resolved by a winner: both architectures succeeded by applying the same underlying principles &mdash; skip connections, feature reuse, multi-scale processing &mdash; in different computational frameworks. DenseNet's feature reuse principle survives in cross-attention, multi-scale feature pyramids, and the skip connections in every Transformer decoder. The CNN architecture story from AlexNet to DenseNet ran in parallel with a completely separate thread: generative modelling. Variational Autoencoders (2013) and Generative Adversarial Networks (2014) were being invented while ResNets and DenseNets were being published. Chapter 11 tells that generative story.",
        },
        {
            year: "2017 &ndash; 2020",
            title: "DenseNet in Practice: Memory vs. Parameters",
            context:
                "DenseNet's theoretical parameter efficiency came with a practical memory cost. Because every layer must retain its feature maps for all subsequent layers to concatenate, the peak memory usage during training grows quadratically with the number of layers in a dense block.",
            what:
                "Efficient DenseNet implementations use gradient checkpointing: rather than storing all intermediate activations for the backward pass, they recompute them during backpropagation. This trades compute time for memory. With checkpointing, a DenseNet-264 with k=32 was trainable on a single GPU with 12 GB of memory. Without it, the same model required 3&times; the memory of a comparable ResNet.",
            impact:
                "The memory trade-off limited DenseNet's practical depth in production settings. ResNet-50, with its more memory-efficient residual addition (rather than concatenation), became the dominant backbone for production computer vision systems. DenseNet retained its niche in medical imaging and other small-data domains where its parameter efficiency was worth the memory overhead.",
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
            <h2>DenseNet: Every Layer Talks to Every Other Layer</h2>

            <Analogy label="Three Ways to Build a Team">
                Imagine a research team working on a big project over many weeks. There are three
                ways to organise them:
                <br /><br />
                <strong>Normal network team:</strong> Each person works alone, passes their report
                to the next person, and forgets everything they did before.
                <br /><br />
                <strong>ResNet team:</strong> Each person reads the previous person's work, adds
                their own contribution, and passes both forward. The previous work is preserved.
                <br /><br />
                <strong>DenseNet team:</strong> Everyone is in the same open office. Every new
                person can see everything everyone before them has produced &mdash; all their notes,
                all their drafts, all their findings &mdash; at any time, all at once.
                <br /><br />
                DenseNet is the open office. Any layer can directly use anything from any earlier layer.
            </Analogy>

            <Analogy label="The Growing Inbox">
                Imagine each DenseNet layer as a new researcher joining a project team:
                <br /><br />
                Researcher 1 produces k pages of notes (the growth rate).<br />
                Researcher 2 reads those k pages and produces k more pages of their own.<br />
                Researcher 3 reads all 2k pages and produces k more.<br />
                Researcher 10 reads all 9k pages from everyone before them and produces k more.<br />
                <br />
                By the 10th researcher, the shared inbox contains k_0 + 9k pages &mdash; all the original
                input plus 9 rounds of new insights. Every new researcher starts with the full
                accumulated knowledge of the team.
            </Analogy>

            <Analogy label="Why This Prevents Re-Learning">
                In a ResNet, layer 15 might need to detect edges. But layer 3 already detected edges!
                ResNet preserves the information from layer 3 (via skip connections) but only as
                one step back.
                <br /><br />
                In DenseNet, layer 15 directly receives layer 3's output in its input. It doesn't
                need to rediscover edges &mdash; they're already there in the inbox. Layer 15 can
                skip straight to: &quot;given that we already know the edges (layer 3's job), what
                higher-level pattern can I find?&quot;
                <br /><br />
                Less re-learning = fewer parameters needed = more efficient network.
            </Analogy>

            <DefBlock label="Growth Rate (k): Staying Lean">
                Each DenseNet layer only produces k new feature maps (typically k = 12, 24, or 32).
                Even though each layer's input grows because it concatenates all previous layers' outputs,
                each layer's own contribution is just k maps.
                <br /><br />
                This is the key to parameter efficiency: layers stay small individually. The growing
                input doesn't require each layer to get bigger &mdash; it just has more context to draw from.
            </DefBlock>

            <Analogy label="The Transition: Moving to a Smaller Office">
                After each dense block, DenseNet uses a transition layer &mdash; like moving to a
                smaller office with only the essential files:
                <br /><br />
                1. A 1&times;1 convolution picks the most important information from all the accumulated feature maps (reduces channels by half).
                2. A 2&times;2 average pool makes the spatial grid smaller (halves width and height).
                3. The next dense block starts fresh with this compressed, essential summary.
                <br /><br />
                Without transitions, the accumulating channels would grow too large too fast. Transitions
                keep the architecture tractable.
            </Analogy>

            <Analogy label="What comes next &mdash; networks that create, not just recognise">
                AlexNet, VGGNet, GoogLeNet, ResNet, DenseNet &mdash; all of these networks learned
                to understand images: classify them, detect objects, segment regions. But while this
                progress was happening, a completely different question was being asked in a parallel
                thread: can a network generate new images? Can it dream?
                <br /><br />
                Variational Autoencoders (2013) and GANs (2014) said yes. Chapter 11 is their story.
            </Analogy>

            <div className="ch-callout">
                <strong>The numbers:</strong> DenseNet-121 uses only 8 million parameters to match
                ResNet-50 (25 million) on ImageNet. It does this not by being cleverer at any single
                computation, but by eliminating redundant computations entirely. Features computed
                once are never computed again.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>DenseNet: L(L+1)/2 Connections and Feature Reuse</h2>

            <p>
                ResNet adds the previous layer's output to the current output: y = F(x) + x.
                DenseNet concatenates all previous layers' outputs: x_l = H_l([x_0, x_1, ..., x_&#123;l-1&#125;]).
                This is the same residual intuition taken to its logical extreme: not one skip
                connection per block, but one skip connection from every layer to every subsequent layer.
            </p>

            <h3>Dense Block Connectivity</h3>
            <p>
                In a dense block with L layers, layer l receives as input the concatenation of
                all feature maps from layers 0 through l&minus;1:
            </p>
            <MathBlock tex="x_\ell = H_\ell\!\bigl([x_0,\, x_1,\, \ldots,\, x_{\ell-1}]\bigr)" />
            <p>
                where [&middot;] denotes concatenation along the channel dimension, and H_l is
                a composite function: BN &rarr; ReLU &rarr; 3&times;3 Conv. Each layer produces
                k new feature maps (the growth rate). The input to layer l has width:
            </p>
            <MathBlock tex="C_\ell = k_0 + k \cdot \ell" />
            <p>
                where k_0 is the number of input channels to the dense block.
            </p>

            <DefBlock label="Number of Connections vs. ResNet">
                For a dense block with L layers:
                <br /><br />
                &bull; Layer 1 receives connections from: 1 (its own input)<br />
                &bull; Layer 2 receives connections from: 2 (input + layer 1)<br />
                &bull; Layer l receives connections from: l previous layers<br />
                &bull; Total connections: 1 + 2 + ... + L = L(L+1)/2<br /><br />
                ResNet with L blocks has L skip connections (one per block).
                DenseNet with L layers has L(L+1)/2 connections &mdash; O(L&sup2;) vs. O(L).
                For L=12 (a small dense block): 78 connections vs. 12.
            </DefBlock>

            <h3>Transition Layers</h3>
            <p>
                Dense blocks accumulate channels rapidly: after L layers with growth rate k,
                the output has k_0 + Lk channels. To prevent this from growing unmanageable,
                transition layers compress between blocks:
            </p>
            <ul>
                <li><strong>1&times;1 Conv:</strong> Reduces channels from C to &lfloor;&theta;C&rfloor; where &theta; = 0.5 (compression factor)</li>
                <li><strong>2&times;2 Average Pool:</strong> Halves spatial dimensions</li>
            </ul>
            <p>
                DenseNets with transition layers are called DenseNet-BC (Bottleneck + Compression).
                DenseNet-121, DenseNet-169, and DenseNet-201 all use this BC variant.
            </p>

            <h3>Why Feature Reuse Reduces Parameters</h3>
            <p>
                In a standard CNN or ResNet, every layer must learn to produce features that contain
                all information needed by subsequent layers. If layer 5 needs to detect horizontal
                edges (which layer 2 already detected), layer 5 must re-learn this from its input.
                In DenseNet, layer 5's input already contains layer 2's horizontal edge detectors.
                Layer 5 can skip that re-learning entirely and focus on higher-order patterns.
            </p>
            <p>
                This reduces the effective number of parameters needed at each layer. In practice:
                DenseNet-121 (8M params) matches ResNet-50 (25M params) on ImageNet.
            </p>

            <h3>DenseNet-121/169/201 Configurations</h3>
            <ul>
                <li><strong>DenseNet-121:</strong> Dense blocks of [6, 12, 24, 16] layers, k=32, 8M params</li>
                <li><strong>DenseNet-169:</strong> Dense blocks of [6, 12, 32, 32] layers, k=32, 14M params</li>
                <li><strong>DenseNet-201:</strong> Dense blocks of [6, 12, 48, 32] layers, k=32, 20M params</li>
            </ul>

            <div className="ch-callout">
                <strong>Memory cost:</strong> DenseNet's concatenation means all intermediate
                feature maps must be stored simultaneously during the backward pass. ResNet uses
                addition (which doesn't increase the channel dimension) while DenseNet uses
                concatenation (which grows the channel dimension). This makes DenseNet's peak
                memory usage higher than ResNet at comparable parameter counts, requiring gradient
                checkpointing for deeper variants.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Channel growth formula &middot; connection count &middot; parameter efficiency proof</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch DenseLayer &middot; DenseBlock &middot; TransitionLayer &middot; DenseNet-121</span>
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
            <h2>DenseNet: Mathematical Analysis</h2>

            <h3>Channel Growth in a Dense Block</h3>
            <p>
                Let k_0 be the input channel count of a dense block, k the growth rate. The input
                width to layer l is:
            </p>
            <MathBlock tex="C_\ell = k_0 + k \cdot \ell, \quad \ell = 0, 1, \ldots, L-1" />
            <p>
                The total output channel count of the block (before the transition layer) is:
            </p>
            <MathBlock tex="C_{\text{out}} = k_0 + k \cdot L" />
            <p>
                For DenseNet-121, block 1: k_0=64, L=6, k=32 &rarr; C_out = 64 + 192 = 256.
            </p>

            <h3>Number of Direct Connections</h3>
            <MathBlock tex="\text{Connections} = \sum_{\ell=1}^{L} \ell = \frac{L(L+1)}{2}" />
            <p>
                For a 12-layer block: 78 connections. For a 24-layer block: 300 connections.
                Compare to ResNet: L connections (one per block). DenseNet is O(L&sup2;) connectivity.
            </p>

            <h3>Parameter Count Per Layer</h3>
            <p>
                DenseNet uses a bottleneck variant: each layer first applies a 1&times;1 conv to
                reduce to 4k channels, then a 3&times;3 conv to produce k output channels:
            </p>
            <MathBlock tex="\text{Params}_\ell = \underbrace{C_\ell \cdot 4k}_{\text{1}\times\text{1 bottleneck}} + \underbrace{4k \cdot 9 \cdot k}_{\text{3}\times\text{3 conv}}" />
            <MathBlock tex="= k(4 C_\ell + 36k) = k\bigl(4(k_0 + k\ell) + 36k\bigr)" />
            <p>
                Total parameters in the block:
            </p>
            <MathBlock tex="\text{Params}_{\text{block}} = \sum_{\ell=0}^{L-1} k\bigl(4k_0 + 4k\ell + 36k\bigr) = k\Bigl(4k_0 L + 2kL(L-1) + 36kL\Bigr)" />

            <h3>Transition Layer Compression</h3>
            <MathBlock tex="C_{\text{trans}} = \lfloor \theta \cdot C_{\text{out}} \rfloor, \quad \theta = 0.5" />
            <p>
                For block 1 output (256 channels): C_trans = 128. This halves the channel count,
                followed by 2&times;2 average pooling to halve spatial dimensions. Prevents
                channel explosion across multiple dense blocks.
            </p>

            <h3>Implicit Deep Supervision</h3>
            <p>
                Because every later layer receives all earlier layers' feature maps, the gradient
                from the loss flows back to earlier layers through many paths:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_j} = \sum_{\ell > j} \frac{\partial \mathcal{L}}{\partial x_\ell} \cdot \frac{\partial x_\ell}{\partial x_j}" />
            <p>
                Each path from x_l to x_j contributes gradient signal. The total number of gradient
                paths from the final layer to layer j is L &minus; j (one for each subsequent layer).
                This is equivalent to implicit deep supervision: every layer is supervised by multiple
                downstream layers simultaneously, not just the final output.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Dense Layer ────────────────────────────────────────────────────────────────

class DenseLayer(nn.Module):
    """
    A single layer in a dense block (bottleneck variant, DenseNet-BC).
    BN -> ReLU -> 1x1 (reduce to 4k channels) -> BN -> ReLU -> 3x3 (produce k maps).
    Each layer only produces k new feature maps, but reads all previous ones.
    """
    def __init__(self, in_ch: int, growth_rate: int, bn_size: int = 4):
        super().__init__()
        mid_ch = bn_size * growth_rate
        self.block = nn.Sequential(
            nn.BatchNorm2d(in_ch),   nn.ReLU(inplace=True),
            nn.Conv2d(in_ch, mid_ch, 1, bias=False),          # 1x1 bottleneck
            nn.BatchNorm2d(mid_ch),  nn.ReLU(inplace=True),
            nn.Conv2d(mid_ch, growth_rate, 3, padding=1, bias=False),  # 3x3
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.block(x)


# ── Dense Block ────────────────────────────────────────────────────────────────

class DenseBlock(nn.Module):
    """
    A dense block: each layer receives ALL previous layers' feature maps concatenated.
    L layers -> L(L+1)/2 direct connections.
    """
    def __init__(self, num_layers: int, in_ch: int, growth_rate: int, bn_size: int = 4):
        super().__init__()
        # Layer l gets in_ch + l*k input channels
        self.layers = nn.ModuleList([
            DenseLayer(in_ch + i * growth_rate, growth_rate, bn_size)
            for i in range(num_layers)
        ])
        self.out_channels = in_ch + num_layers * growth_rate

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = [x]
        for layer in self.layers:
            # Each new layer concatenates ALL previous feature maps
            new_feat = layer(torch.cat(features, dim=1))
            features.append(new_feat)
        return torch.cat(features, dim=1)


# ── Transition Layer ───────────────────────────────────────────────────────────

class TransitionLayer(nn.Module):
    """
    Between dense blocks: halve channels (theta=0.5) and spatial dimensions (2x2 pool).
    Prevents channel count from growing uncontrollably across multiple dense blocks.
    """
    def __init__(self, in_ch: int, compression: float = 0.5):
        super().__init__()
        out_ch = int(in_ch * compression)
        self.block = nn.Sequential(
            nn.BatchNorm2d(in_ch), nn.ReLU(inplace=True),
            nn.Conv2d(in_ch, out_ch, 1, bias=False),
            nn.AvgPool2d(2, stride=2),
        )
        self.out_channels = out_ch

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.block(x)


# ── DenseNet ───────────────────────────────────────────────────────────────────

class DenseNet(nn.Module):
    """
    DenseNet-BC: dense blocks with bottleneck layers and transition compression.
    DenseNet-121: block_config=(6,12,24,16), k=32, 8M params -- matches ResNet-50 accuracy.
    """
    def __init__(self, block_config: tuple[int,...] = (6, 12, 24, 16),
                 growth_rate: int = 32, init_features: int = 64,
                 compression: float = 0.5, num_classes: int = 1000):
        super().__init__()

        # Initial stem
        self.stem = nn.Sequential(
            nn.Conv2d(3, init_features, 7, stride=2, padding=3, bias=False),
            nn.BatchNorm2d(init_features), nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1),
        )

        # Build dense blocks + transitions
        blocks: list[nn.Module] = []
        in_ch = init_features
        for i, num_layers in enumerate(block_config):
            block = DenseBlock(num_layers, in_ch, growth_rate)
            blocks.append(block)
            in_ch = block.out_channels
            if i < len(block_config) - 1:       # no transition after last block
                trans = TransitionLayer(in_ch, compression)
                blocks.append(trans)
                in_ch = trans.out_channels

        self.blocks = nn.Sequential(*blocks)
        self.norm   = nn.BatchNorm2d(in_ch)
        self.pool   = nn.AdaptiveAvgPool2d((1, 1))
        self.fc     = nn.Linear(in_ch, num_classes)

        self._init_weights()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        x = self.blocks(x)
        x = F.relu(self.norm(x))
        x = self.pool(x)
        return self.fc(torch.flatten(x, 1))

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.constant_(m.bias, 0)


def densenet121(nc=1000): return DenseNet((6,12,24,16), 32, 64, num_classes=nc)
def densenet169(nc=1000): return DenseNet((6,12,32,32), 32, 64, num_classes=nc)
def densenet201(nc=1000): return DenseNet((6,12,48,32), 32, 64, num_classes=nc)


# ── Compare DenseNet vs ResNet efficiency ─────────────────────────────────────
if __name__ == "__main__":
    x = torch.randn(2, 3, 224, 224)
    for name, model in [('DenseNet-121', densenet121()),
                        ('DenseNet-169', densenet169()),
                        ('DenseNet-201', densenet201())]:
        y = model(x)
        p = sum(q.numel() for q in model.parameters())
        print(f"{name}: {p:>10,} params  output: {y.shape}")

    print()
    print("For reference: ResNet-50  has ~25.6M params")
    print("               ResNet-101 has ~44.5M params")
    print("DenseNet achieves ResNet-50 accuracy with 3x fewer parameters.")`

function PythonContent() {
    return (
        <>
            <p>
                A clean DenseNet-BC implementation. The DenseBlock accumulates feature maps by
                concatenation: each new layer's forward pass receives torch.cat of all previous
                outputs. The TransitionLayer prevents channel explosion between blocks. The full
                DenseNet-121 competes with ResNet-50 at one-third the parameter count.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="densenet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>The concatenation vs. addition distinction:</strong> ResNet adds
                (F(x) + x), which keeps channel count constant across the skip. DenseNet
                concatenates ([x_0, ..., x_l]), which grows the channel count. Addition is
                memory-efficient but discards feature identity. Concatenation is memory-intensive
                but preserves every prior feature for direct reuse.
            </div>
        </>
    )
}

export const DENSENET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
