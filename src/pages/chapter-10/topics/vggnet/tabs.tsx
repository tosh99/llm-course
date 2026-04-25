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
            year: "2012 &ndash; 2013",
            title: "Searching for the Right Variables",
            context:
                "AlexNet proved depth worked, but it left an open question: which variables actually drive performance? AlexNet mixed many choices at once &mdash; an irregular filter size sequence (11&times;11, 5&times;5, 3&times;3), Local Response Normalisation, a specific two-GPU split, particular pooling frequencies. Any of these could be responsible for the accuracy gain. The field needed a systematic ablation. Karen Simonyan and Andrew Zisserman at the Oxford Visual Geometry Group designed their experiments precisely to isolate one variable: depth.",
            what:
                "The VGG group's methodology was rigorous: hold everything constant except the number of layers and their filter sizes. They trained a series of networks with an identical template &mdash; blocks of 3&times;3 convolutions followed by 2&times;2 max-pools, doubling filter count at each block &mdash; and varied only how many layers were in each block. They tested VGG-11 (11 learnable layers), VGG-13, VGG-16, and VGG-19. Each new network was deeper than the previous.",
            impact:
                "The systematic comparison showed unambiguously that depth improved accuracy, and that 3&times;3 convolutions were sufficient to achieve this. Larger filters did not help. The 3&times;3 revolution was launched: from 2014 onwards, almost every competitive CNN architecture used only 3&times;3 convolutions in its main body.",
        },
        {
            year: "2014",
            title: "ILSVRC 2014 &mdash; VGGNet Submits",
            context:
                "ILSVRC 2014 received entries from Oxford (VGGNet), Google (GoogLeNet), Clarifai, and dozens of other teams. VGGNet was trained on four NVIDIA Titan Black GPUs over two to three weeks. The team submitted VGG-16 and VGG-19. At 138 million parameters, VGG-16 was the largest CNN that had been publicly trained at the time.",
            what:
                "GoogLeNet placed first with 6.67% top-5 error; VGGNet placed second with 7.32%. But the evaluation used an ensemble of 7 VGGNet models, and VGG's single-model performance (7.89%) was notable. More important than the placement: VGGNet's simplicity made it easy to understand, reproduce, and adapt. Simonyan and Zisserman released pre-trained weights publicly, making it an off-the-shelf feature extractor.",
            impact:
                "Placing second was commercially irrelevant: VGGNet became the most widely used CNN feature extractor in the years that followed. Transfer learning on VGG-16 was the dominant approach for medical imaging, fine-grained recognition, and industrial computer vision from 2014 to 2016. The Oxford 102 Flowers dataset, CUB-200 Bird dataset, and FGVC-Aircraft benchmarks were all routinely solved by fine-tuning VGG-16's convolutional layers.",
        },
        {
            year: "2014 &ndash; 2016",
            title: "VGGNet as Universal Feature Extractor",
            context:
                "A pre-trained ImageNet model learns features that transfer. The key insight: the early layers of any CNN trained on diverse, large-scale data learn general visual primitives (edges, colours, textures, shapes) that are useful for almost any visual task. The specific ImageNet categories don't matter &mdash; what matters is the rich visual environment that forced the network to learn them.",
            what:
                "Researchers discovered that removing VGGNet's final classifier and using the fc7 layer (the second-to-last fully connected layer, producing a 4,096-dimensional vector) as a fixed feature extractor, then training a small linear classifier on top, matched or exceeded hand-crafted features on many benchmarks. Fine-tuning (unfreezing VGGNet's weights and continuing training on the target dataset) improved further. This practice became the dominant paradigm in computer vision for two years.",
            impact:
                "VGGNet demonstrated transfer learning as a practical strategy rather than a theoretical possibility. The practice generalised far beyond vision: pre-train a large model on a large generic dataset, then fine-tune on a small specific dataset. In 2014 this meant VGGNet and ImageNet; by 2018 it meant BERT and Wikipedia; by 2023 it meant GPT-4 and the internet. VGGNet's contribution to this paradigm shift should not be underestimated.",
        },
        {
            year: "2015 &ndash; 2016",
            title: "The Memory Problem and Its Lessons",
            context:
                "VGGNet's 138 million parameters posed practical problems. At 32-bit precision, the weights alone require 528 MB. Storing activations and gradients during training requires several gigabytes. Running inference on a mobile device or in a latency-sensitive server application was expensive. These constraints motivated a wave of network compression research.",
            what:
                "Techniques including weight pruning (Han et al., 2015), knowledge distillation (Hinton et al., 2015), and quantisation (using 8-bit instead of 32-bit weights) were developed specifically in response to VGGNet's memory footprint. GoogLeNet's concurrent demonstration that 6.8 million parameters could achieve first place at ILSVRC 2014 made the 138 million parameter count look wasteful. ResNet (2015) and subsequent networks achieved better accuracy with fewer parameters by eliminating large fully connected layers.",
            impact:
                "VGGNet's excessive memory cost was the direct catalyst for global average pooling (replacing FC layers with spatial averaging), network architecture search, and efficient architecture design. Every mobile-optimised network &mdash; MobileNet, ShuffleNet, EfficientNet &mdash; exists partly as a response to the question VGGNet implicitly posed: can we be more efficient than this?",
        },
        {
            year: "2017 &ndash; present",
            title: "VGGNet as a Teaching Standard",
            context:
                "By 2017, VGGNet had been surpassed in accuracy by ResNet, DenseNet, and SENet. No competitive system used VGGNet as its primary backbone. Nevertheless, the architecture retained enormous value as a teaching tool because of its radical simplicity.",
            what:
                "VGGNet has a single design principle: use 3&times;3 convolutions, double the filters at each max-pool, repeat. This makes it the ideal architecture to explain to students, to use in fast prototyping, and to test new ideas against because there is nothing obscure about it. Every deep learning curriculum, every introductory textbook, every practical tutorial reaches for VGGNet when it needs a clear example of a deep CNN.",
            impact:
                "The ultimate legacy of VGGNet is as a demonstration that architectural simplicity and depth are not in conflict. The 3&times;3 convolution became the universal building block. Its receptive field equivalence proof (two 3&times;3 = one 5&times;5, three 3&times;3 = one 7&times;7) is cited in virtually every architecture paper since 2014. This single insight survives intact into every modern CNN family including ResNet, EfficientNet, and ConvNeXt.",
        },
        {
            year: "2014 &ndash; 2015",
            title: "The 3&times;3 Revolution Propagates",
            context:
                "When VGGNet and GoogLeNet both achieved top results using small filters, the remaining doubters in the community were converted. The question shifted from 'what filter size should we use?' to 'how do we arrange 3&times;3 filters most effectively?'",
            what:
                "ResNet, DenseNet, Inception-v3, SENet, and essentially every CNN architecture after 2014 uses 3&times;3 convolutions as its primary operation. Exceptions (depthwise separable convolutions in MobileNet, 1&times;1 pointwise convolutions in bottleneck blocks) are all modifications of the 3&times;3 theme rather than rejections of it. The 11&times;11, 7&times;7, and 5&times;5 filters of AlexNet became museum pieces.",
            impact:
                "The 3&times;3 filter is now so standard that hardware accelerators (NVIDIA Tensor Cores, Google TPUs, Apple Neural Engine) are explicitly designed and optimised to compute 3&times;3 convolutions efficiently. VGGNet's architectural choice became a hardware specification.",
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
            <h2>VGGNet: The Power of Keeping It Simple</h2>

            <Analogy label="Building a Skyscraper with One Brick Type">
                After AlexNet won the 2012 contest, researchers had a debate: what was the secret?
                Was it the big 11&times;11 filter in the first layer? The two GPUs? The specific sizes
                of the middle layers? Some combination of all of these?
                <br /><br />
                The Oxford VGG group had a different approach. Instead of adding complexity, they
                stripped everything away. Pick one type of filter &mdash; 3&times;3, the smallest
                meaningful size &mdash; and use it everywhere. Then just stack as many as you can.
                <br /><br />
                It's like building a skyscraper with only one type of brick. The result is taller
                than any mixed-material building, simpler to construct, and easier to understand
                exactly why it holds up.
            </Analogy>

            <Analogy label="Why Small Filters Beat Big Ones">
                Imagine you want to recognise a 5&times;5 patch of pixels. You could use one big 5&times;5 filter
                (25 connections). Or you could use two 3&times;3 filters stacked on top of each other
                (18 connections total).
                <br /><br />
                The two small filters see the same area as the one big one &mdash; but they use
                fewer connections AND they can make two separate decisions about it, not just one.
                Two filters &times; one ReLU each = two chances to find a pattern. One big filter = one chance.
                <br /><br />
                Three stacked 3&times;3 filters see the same area as a 7&times;7 filter: 27 connections
                instead of 49, three chances to find a pattern instead of one. Small wins.
            </Analogy>

            <Analogy label="VGGNet's Recipe Card">
                VGGNet follows a recipe so simple you can write it on a recipe card:
                <br /><br />
                Start with 64 filters. Apply 2 or 3 of those 3&times;3 layers. Take a photo and cut it in half (max-pool).
                Now use 128 filters. Apply 2 or 3 more 3&times;3 layers. Cut in half again.
                Use 256 filters. 2&ndash;4 layers. Cut in half.
                Use 512 filters. 2&ndash;4 layers. Cut in half.
                Use 512 filters again. 2&ndash;4 layers.
                <br /><br />
                At the end, three big decider layers. Then guess what's in the photo.
                <br /><br />
                That's it. Every single layer in VGGNet is either a 3&times;3 convolution, a max-pool,
                or one of the final classifiers. Nothing else. No special cases. No weird shapes.
            </Analogy>

            <Analogy label="The Price of Simplicity">
                There's a catch. VGGNet has 138 million parameters &mdash; more than twice AlexNet's 60 million.
                Almost all of these live in the three final decider layers. Those layers have to
                connect 7&times;7 spatial features &times; 512 channels = 25,088 numbers to 4,096 neurons to 4,096 neurons to 1,000 outputs.
                That's enormous.
                <br /><br />
                GoogLeNet, which also came out in 2014, realised this was wasteful and replaced
                those giant layers with a simple average. VGGNet didn't. This single choice made
                VGGNet too heavy for mobile devices &mdash; and inspired every efficient network
                that came after.
            </Analogy>

            <Analogy label="The Best Backup Player">
                VGGNet came second in its competition (GoogLeNet won). But sometimes the runner-up
                ends up being more useful in the long run.
                <br /><br />
                VGGNet's simplicity made it the go-to starting point whenever someone had a new
                visual problem to solve. Medical imaging? Start with VGGNet, tune the final layers.
                Counting cells in a microscope? VGGNet. Identifying bird species? VGGNet. Its
                pre-trained weights were the Swiss Army Knife of computer vision from 2014 to 2017.
            </Analogy>

            <div className="ch-callout">
                <strong>Lasting legacy:</strong> The 3&times;3 convolution filter is now so standard
                that computer chips are physically designed to run it as fast as possible.
                Hardware accelerators from NVIDIA, Google, and Apple all have special circuits for
                3&times;3 convolutions &mdash; a direct consequence of VGGNet proving they were all you needed.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>VGGNet: Systematic Depth Through Uniform 3&times;3 Convolutions</h2>

            <p>
                Where AlexNet combined multiple new ideas simultaneously, VGGNet was a controlled
                experiment. Simonyan and Zisserman held every architectural choice constant and
                varied only depth, using exclusively 3&times;3 filters. The result confirmed that
                depth was the most important architectural variable &mdash; and established the
                3&times;3 convolution as the universal building block of CNN design.
            </p>

            <h3>The Receptive Field Equivalence Argument</h3>
            <p>
                A key insight: two stacked 3&times;3 convolutions have the same receptive field as
                one 5&times;5 convolution. Three stacked 3&times;3 convolutions match a 7&times;7.
                The argument:
            </p>
            <ul>
                <li>A single 3&times;3 filter looks at a 3&times;3 patch of its input</li>
                <li>A second 3&times;3 filter on top looks at a 3&times;3 patch of the first layer's output,
                    which corresponds to a 5&times;5 region of the original input (because each position in
                    the first output depends on a 3&times;3 region, and the second filter spans 3 such positions)</li>
                <li>A third 3&times;3 filter extends this to 7&times;7 of the original input</li>
            </ul>

            <DefBlock label="Parameter Count: 3&times;3 vs Larger Filters">
                For C input channels and C output channels:
                <br /><br />
                &bull; One 5&times;5 filter: 5&sup2; &times; C&sup2; = 25C&sup2; parameters<br />
                &bull; Two 3&times;3 filters: 2 &times; 3&sup2; &times; C&sup2; = 18C&sup2; parameters<br />
                &bull; Savings: 28% fewer parameters, same effective receptive field<br /><br />
                &bull; One 7&times;7 filter: 7&sup2; &times; C&sup2; = 49C&sup2; parameters<br />
                &bull; Three 3&times;3 filters: 3 &times; 3&sup2; &times; C&sup2; = 27C&sup2; parameters<br />
                &bull; Savings: 45% fewer parameters, same receptive field, plus three non-linearities vs one
            </DefBlock>

            <h3>VGGNet Architecture Pattern</h3>
            <p>
                VGGNet follows a consistent block-and-pool structure. Each block contains 2, 3,
                or 4 convolutional layers (depending on the variant), all with 3&times;3 filters
                and padding 1 to preserve spatial dimensions. After each block, a 2&times;2 max-pool
                with stride 2 halves the spatial dimensions.
            </p>
            <p>
                The filter count doubles at each spatial halving: 64 &rarr; 128 &rarr; 256 &rarr; 512 &rarr; 512.
                This maintains roughly constant compute per block: spatial area halves, filter count doubles,
                so total operations remain approximately constant across blocks.
            </p>

            <h3>Transfer Learning: Why VGGNet Became Universal</h3>
            <p>
                Pre-training on ImageNet and fine-tuning on a target task proved effective because:
            </p>
            <ul>
                <li>
                    <strong>Low-level features generalise:</strong> Conv1&ndash;2 learn edge detectors,
                    colour gradients, and texture primitives that are useful for almost any visual task.
                </li>
                <li>
                    <strong>High-level features are task-specific:</strong> FC6&ndash;8 encode ImageNet
                    class structure, which is irrelevant for detecting tumours or identifying bird species.
                </li>
                <li>
                    <strong>Optimal strategy:</strong> Freeze Conv1&ndash;2 (very generic), fine-tune
                    Conv3&ndash;5 (task-adaptable), replace FC layers with new randomly initialised heads.
                </li>
            </ul>

            <h3>VGG-16 Parameter Distribution</h3>
            <p>
                A striking property of VGGNet: the vast majority of parameters are in the fully
                connected layers, not the convolutions. Total: ~138 million parameters.
            </p>
            <ul>
                <li>All convolutional layers combined: ~14.7 million (10.6%)</li>
                <li>FC6 alone (25,088 &rarr; 4,096): ~102.7 million (74.4%)</li>
                <li>FC7 (4,096 &rarr; 4,096): ~16.8 million (12.1%)</li>
                <li>FC8 (4,096 &rarr; 1,000): ~4.1 million (3.0%)</li>
            </ul>

            <div className="ch-callout">
                <strong>The lesson GoogLeNet drew:</strong> 74% of parameters in a single FC layer
                is inefficient. GoogLeNet replaced VGGNet's FC layers with global average pooling
                &mdash; directly averaging each feature map to a single value. This cut 138M
                parameters to 6.8M at similar accuracy. ResNet followed suit. VGGNet's parameter
                distribution exposed the bottleneck that everyone else raced to eliminate.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Receptive field calculation &middot; parameter count &middot; expressivity argument</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch VGGNet &middot; configurable depth &middot; transfer learning setup</span>
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

            <h3>Receptive Field Growth</h3>
            <p>
                The receptive field (RF) grows additively with each convolution. For a 3&times;3
                filter with stride 1 and same-padding:
            </p>
            <MathBlock tex="\text{RF}_n = \text{RF}_{n-1} + (k - 1) = \text{RF}_{n-1} + 2" />
            <p>
                Starting from RF_0 = 1 (single pixel):
            </p>
            <ul>
                <li>After 1 conv (3&times;3): RF = 3</li>
                <li>After 2 convs (3&times;3 each): RF = 5 &mdash; same as one 5&times;5</li>
                <li>After 3 convs (3&times;3 each): RF = 7 &mdash; same as one 7&times;7</li>
            </ul>
            <p>
                After a max-pool (stride 2), subsequent convolutions cover twice the previous
                area per step. The general formula with pooling jumps:
            </p>
            <MathBlock tex="\text{RF}_{\text{total}} = 1 + \sum_{l=1}^{L} (k_l - 1) \cdot \prod_{p < l} s_p" />
            <p>
                where s_p is the stride at layer p (2 at pooling layers, 1 elsewhere).
            </p>

            <h3>Parameter Efficiency of Stacked Small Filters</h3>
            <p>
                For C input channels and C output channels per layer:
            </p>
            <MathBlock tex="\text{Params}(1 \times 7\!\times\!7) = 49 C^2 + C" />
            <MathBlock tex="\text{Params}(3 \times 3\!\times\!3) = 3 \times (9 C^2 + C) = 27C^2 + 3C" />
            <p>
                Ratio: 49/27 &asymp; 1.81. Three stacked 3&times;3 filters are 45% cheaper
                than one 7&times;7, have the same receptive field, and apply 3 non-linearities
                vs 1. More non-linearities &Rightarrow; more expressive function class.
            </p>

            <h3>Expressivity of Stacked Non-Linearities</h3>
            <p>
                With a single linear filter and one ReLU:
            </p>
            <MathBlock tex="f(x) = \text{ReLU}(W_1 x + b_1)" />
            <p>
                With two stacked filters and two ReLUs:
            </p>
            <MathBlock tex="f(x) = \text{ReLU}(W_2 \cdot \text{ReLU}(W_1 x + b_1) + b_2)" />
            <p>
                The second form is a piecewise linear function with exponentially more pieces
                than the first. In d dimensions, a piecewise linear network with L layers and
                n neurons per layer can produce up to O((n/d)^(d(L-1)) n^d) linear regions
                (Montufar et al., 2014). More layers = exponentially more linear pieces =
                exponentially more expressive function approximation.
            </p>

            <h3>VGG-16 Output Dimension Trace</h3>
            <MathBlock tex="\underbrace{224^2 \times 3}_{\text{input}} \xrightarrow{\text{block1}} \underbrace{112^2 \times 64}_{\text{pool1}} \xrightarrow{\text{block2}} \underbrace{56^2 \times 128}_{\text{pool2}} \xrightarrow{\text{block3}} \underbrace{28^2 \times 256}_{\text{pool3}} \xrightarrow{\text{block4}} \underbrace{14^2 \times 512}_{\text{pool4}} \xrightarrow{\text{block5}} \underbrace{7^2 \times 512}_{\text{pool5}}" />
            <p>
                Then flatten: 7&sup2; &times; 512 = 25,088. FC6: 25,088 &rarr; 4,096. FC7: 4,096 &rarr; 4,096.
                FC8: 4,096 &rarr; 1,000. Softmax: 1,000 probabilities.
            </p>
            <p>
                FC6 parameter count: 25,088 &times; 4,096 + 4,096 bias = 102,764,544 &mdash; 74% of total.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── VGGNet: Depth Through Simplicity ──────────────────────────────────────────

# Architecture configurations: number of conv layers per block
# M = MaxPool. Integer = conv layer with that many output channels.
VGG_CONFIGS = {
    'VGG11': [64, 'M', 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],
    'VGG13': [64, 64, 'M', 128, 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],
    'VGG16': [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512, 'M', 512, 512, 512, 'M'],
    'VGG19': [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 256, 'M', 512, 512, 512, 512, 'M', 512, 512, 512, 512, 'M'],
}

def make_features(config: list, batch_norm: bool = False) -> nn.Sequential:
    """Build the convolutional feature extractor from a VGG config list."""
    layers: list[nn.Module] = []
    in_channels = 3
    for v in config:
        if v == 'M':
            layers.append(nn.MaxPool2d(kernel_size=2, stride=2))
        else:
            out_channels = int(v)
            layers.append(nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1))
            if batch_norm:
                layers.append(nn.BatchNorm2d(out_channels))
            layers.append(nn.ReLU(inplace=True))
            in_channels = out_channels
    return nn.Sequential(*layers)


class VGG(nn.Module):
    """
    VGGNet: uniform 3x3 convolutions stacked to arbitrary depth.
    The key insight: stack small filters for large effective receptive fields
    while using fewer parameters and more non-linearities than large filters.
    """
    def __init__(self, config_name: str = 'VGG16', num_classes: int = 1000,
                 batch_norm: bool = False, dropout: float = 0.5):
        super().__init__()

        self.features    = make_features(VGG_CONFIGS[config_name], batch_norm)
        self.avgpool     = nn.AdaptiveAvgPool2d((7, 7))   # handle non-224 inputs

        # The parameter-heavy classifier block (74% of VGG-16 params!)
        self.classifier = nn.Sequential(
            nn.Linear(512 * 7 * 7, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),
            nn.Linear(4096, num_classes),
        )

        self._init_weights()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

    def _init_weights(self) -> None:
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)


# ── Transfer learning: replace classifier head ─────────────────────────────────
def vgg16_for_transfer(num_classes: int, freeze_features: bool = True) -> VGG:
    """VGG-16 configured for transfer learning to a new dataset."""
    model = VGG('VGG16', num_classes=1000)  # load with original head

    if freeze_features:
        # Freeze all convolutional layers: only fine-tune the classifier
        for param in model.features.parameters():
            param.requires_grad = False

    # Replace final classifier layer
    model.classifier[-1] = nn.Linear(4096, num_classes)
    return model


# ── Usage ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    x = torch.randn(2, 3, 224, 224)

    for name in ['VGG11', 'VGG13', 'VGG16', 'VGG19']:
        model  = VGG(name, num_classes=1000)
        y      = model(x)
        total  = sum(p.numel() for p in model.parameters())
        feat_p = sum(p.numel() for p in model.features.parameters())
        cls_p  = sum(p.numel() for p in model.classifier.parameters())
        print(f"{name}: {total:>12,} params  "
              f"(features {feat_p:>10,} | classifier {cls_p:>10,})")

    # Transfer learning demo
    print()
    model_tl = vgg16_for_transfer(num_classes=102)  # Oxford 102 Flowers
    trainable = sum(p.numel() for p in model_tl.parameters() if p.requires_grad)
    total_tl  = sum(p.numel() for p in model_tl.parameters())
    print(f"Transfer to 102 classes: {trainable:,} trainable / {total_tl:,} total")`

function PythonContent() {
    return (
        <>
            <p>
                A clean PyTorch VGGNet implementation using config lists. The architecture builds
                itself from a simple description: integers specify conv layer output channels,
                'M' inserts a max-pool. The transfer learning wrapper shows how to freeze the
                convolutional feature extractor and fine-tune only the classifier &mdash; the
                dominant computer vision practice of 2014&ndash;2017.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="vggnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Parameter breakdown reveals the design flaw:</strong> Run the code and check
                the feature vs. classifier split. VGG-16's 14.7M convolutional parameters do the
                actual visual reasoning; the 123.6M classifier parameters are a wasteful mapping.
                GoogLeNet and ResNet both replaced this with global average pooling &mdash; one of
                the most impactful architecture decisions of the 2010s.
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
