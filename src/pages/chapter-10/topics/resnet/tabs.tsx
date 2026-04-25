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
            year: "2014 &ndash; 2015",
            title: "The Degradation Paradox",
            context:
                "By 2014, the pattern seemed clear: more depth equals better accuracy. AlexNet (8 layers) beat everything before it. VGGNet (16&ndash;19 layers) beat AlexNet. GoogLeNet (22 layers) beat VGGNet. The natural prediction: go deeper. Researchers tried networks with 30, 50, and 100 layers. Something unexpected happened: they got worse. Not on the test set (that could be overfitting) &mdash; on the training set. Adding more layers was making it harder to even memorise the training data.",
            what:
                "This was called the degradation problem. It was not a gradient problem in the traditional sense: batch normalisation had made gradients flow reasonably well. It was something subtler. A deeper network contains a shallower network as a special case: the extra layers could, in principle, learn identity mappings (output = input) and produce exactly the same result as the shallow network. But gradient descent could not find this solution. The optimisation landscape for deep networks had too many saddle points and flat regions where learning stalled.",
            impact:
                "The degradation paradox forced the community to confront a fundamental question: is deeper always better, or does depth impose its own barriers? Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun at Microsoft Research Asia would answer this question in 2015 with a deceptively simple architectural modification.",
        },
        {
            year: "2015",
            title: "Srivastava, Greff &amp; Schmidhuber &mdash; Highway Networks",
            context:
                "Just before the ResNet paper, the LSTM community had long used gated connections that allowed information to bypass layers selectively. Rupesh Srivastava, Klaus Greff, and Jürgen Schmidhuber at IDSIA formalised this idea for feedforward networks: Highway Networks.",
            what:
                "Highway Networks added a gating mechanism to each layer: H(x) = T(x) &middot; F(x) + (1 &minus; T(x)) &middot; x, where T(x) is a learned &quot;transform gate&quot; (a sigmoid-activated linear function of x). When T(x) = 0, the layer passes x through unchanged. When T(x) = 1, it transforms it. This enabled the network to learn, for each position, whether to transform or to pass through. Highway Networks trained successfully to 900 layers.",
            impact:
                "Highway Networks proved the principle: gated identity shortcuts enable training of very deep networks. ResNet simplified this dramatically by removing the gate and using an unconditional identity shortcut. The unconditional version turned out to work better than the gated version in practice &mdash; a lesson about the value of architectural simplicity.",
        },
        {
            year: "2015",
            title: "He, Zhang, Ren &amp; Sun &mdash; Deep Residual Learning for Image Recognition",
            context:
                "Kaiming He, Xiangyu Zhang, Shaoqing Ren, and Jian Sun at Microsoft Research Asia submitted to ILSVRC 2015. Their architecture was called ResNet. The paper's central insight was a reframing of what each layer learns: instead of learning the desired output H(x) directly, let each layer learn the residual F(x) = H(x) &minus; x. The actual output is then F(x) + x, computed via a skip connection that adds the input directly to the layer's output.",
            what:
                "A residual block computes y = F(x, W) + x. If the optimal function is close to the identity (a reasonable assumption when you're adding capacity to a well-performing network), then F(x) only needs to learn values near zero &mdash; a much easier optimisation problem than learning the identity from scratch. At initialisation, F(x) &asymp; 0, so y &asymp; x. The network starts as a near-identity mapping and learns deviations. ResNet-152 won ILSVRC 2015 with 3.57% top-5 error &mdash; better than the human benchmark of 5.1% on that test set.",
            impact:
                "ResNet-152 was 152 layers deep. ResNet-1000 was later trained and worked. The degradation paradox was solved: with residual connections, deeper is always at least as good as shallower (because additional layers can learn identity). The skip connection became the single most influential architectural element in all of deep learning, appearing in every major architecture since: Transformers, U-Nets, StyleGAN, DALL-E, GPT. ResNet is the most cited architecture in computer science history.",
        },
        {
            year: "2015 &ndash; 2016",
            title: "The Skip Connection Spreads",
            context:
                "The ResNet paper was submitted to ILSVRC 2015 in July and published in December. By that point, the paper had been on arXiv for months and was being read and implemented across the entire deep learning community. The principle &mdash; add the input to the output &mdash; was so simple that it could be added to any existing architecture.",
            what:
                "Within 12 months of the ResNet paper: Inception-v4 combined skip connections with Inception modules. DenseNet extended the idea from single-step to all-pairs connections. Stochastic Depth (Huang et al., 2016) randomly dropped entire residual blocks during training, using the identity path as a survival mechanism. Wide ResNets (Zagoruyko &amp; Komodakis, 2016) showed that fewer, wider layers with residual connections could match deep thin ResNets with fewer parameters.",
            impact:
                "The skip connection is now a fixed feature of the deep learning toolkit, not an architecture-specific choice. It is present in: Transformer encoder and decoder blocks (residual connection around self-attention), U-Net (skip connections between encoder and decoder), every modern CNN backbone, diffusion model denoisers, large language model layers, and graph neural networks. ResNet's contribution to deep learning is analogous to calculus's contribution to physics: it unlocked a domain that was previously intractable.",
        },
        {
            year: "2016",
            title: "He et al. &mdash; Identity Mappings in Deep Residual Networks",
            context:
                "Having demonstrated that residual connections worked, He et al. asked a follow-up question: does the order of operations within a residual block matter? The original ResNet used a post-activation design: Conv &rarr; BN &rarr; ReLU, then add skip. A 2016 follow-up paper studied the alternative: pre-activation, or BN &rarr; ReLU &rarr; Conv.",
            what:
                "Pre-activation ResNets (sometimes called ResNet-v2) move the batch normalisation and ReLU before the convolution. The skip connection then flows through completely unobstructed, since the additions happen before any non-linearity. This creates a &quot;clean&quot; gradient path where the gradient can flow directly through the skip connection without any activation function. Pre-activation ResNets trained slightly better, especially at very high depth (&gt;1000 layers).",
            impact:
                "Pre-activation ResNets established the principle that the skip connection should be a completely clean identity path. Any non-linearity on the skip branch can interfere with gradient flow. Modern architectures (including Transformers with pre-norm rather than post-norm) follow the pre-activation convention.",
        },
        {
            year: "2017 &ndash; present",
            title: "ResNet Becomes the Backbone of Everything",
            context:
                "As vision tasks expanded beyond ImageNet classification to detection, segmentation, depth estimation, and pose estimation, researchers needed a reliable feature extractor. ResNet filled this role because its residual connections made it both easy to train and easy to extend.",
            what:
                "Feature Pyramid Networks (Lin et al., 2017) built multi-scale feature hierarchies on top of ResNet backbones for object detection. Mask R-CNN (He et al., 2017) combined ResNet + FPN for instance segmentation. Detectron, the Facebook AI research platform, built ResNet-based detection pipelines used in billions of products. Every major vision paper from 2015 to 2022 used some variant of ResNet as the default backbone.",
            impact:
                "ResNet-50, ResNet-101, and ResNet-152 became the benchmarking standard: a result is not considered meaningful unless it is compared to a ResNet baseline. Even after Vision Transformers (ViT, 2020) demonstrated competitive accuracy, ConvNeXt (Liu et al., 2022) showed that modernised ResNets with Transformer-inspired design choices could match ViT accuracy, confirming that the residual connection &mdash; not any other specific design choice &mdash; is the essential ingredient.",
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
            <h2>ResNet: The Skip Road Around Every Problem</h2>

            <Analogy label="The Deeper Is Worse Paradox">
                By 2014, everyone agreed: deeper networks should be smarter. More layers = more
                processing = better understanding. So researchers started building 30-layer, 50-layer,
                100-layer networks.
                <br /><br />
                They all got worse. Not just on new photos they hadn't seen &mdash; on the training
                photos too. The network was somehow less able to learn when given more layers.
                <br /><br />
                This made no sense. If you have a 20-layer network that works, a 30-layer network
                should be able to do at least as well &mdash; just make the extra 10 layers do nothing
                (pass information through unchanged). But the network couldn't figure out how to
                make layers do nothing. Gradient descent kept trying to make every layer change things,
                even when changing was the wrong move.
            </Analogy>

            <Analogy label="The Bypass Road">
                ResNet's solution: build a bypass road around every layer.
                <br /><br />
                Imagine driving from London to Edinburgh. There's the main road (through the city centres,
                full of junctions and detours). And there's a bypass motorway that goes around each city.
                <br /><br />
                A ResNet layer has both:
                The main road: two convolutions that process and transform the signal.
                The bypass: a direct connection from the input to the output that adds the original
                signal back in at the end.
                <br /><br />
                If the layer is learning something useful, most of the information takes the main road.
                If the layer is confused or unnecessary, information just takes the bypass. The network
                can choose how much to use each path, and it can choose differently for each input.
            </Analogy>

            <Analogy label="Learning the Difference Instead of Everything">
                The mathematical trick is elegant. Instead of asking each layer: &quot;transform
                this input into the best output,&quot; ResNet asks: &quot;what small change would
                improve this signal?&quot;
                <br /><br />
                The output is: (what the layer computes) + (the original input).
                <br /><br />
                If the layer figures out the original input was already pretty good, it just computes
                nearly zero &mdash; and the bypass adds the original signal back. Net result: almost
                no change. The layer effectively says &quot;I pass&quot; without causing any harm.
                <br /><br />
                This is why it's called a residual connection: the layer learns the residual
                (the difference) between what it received and what it should output.
            </Analogy>

            <Analogy label="The Two Block Shapes">
                ResNet uses two types of blocks depending on how deep the network goes:
                <br /><br />
                <strong>Basic Block (for smaller ResNets, 18 or 34 layers):</strong>
                Two 3&times;3 convolutions with a bypass. Clean and simple.
                <br /><br />
                <strong>Bottleneck Block (for deeper ResNets, 50/101/152 layers):</strong>
                Three convolutions &mdash; a 1&times;1 that squeezes the channels down, a 3&times;3
                that does the main work, then a 1&times;1 that expands channels back up &mdash; with
                a bypass around all three. This is more efficient because the expensive 3&times;3
                operates on fewer channels.
            </Analogy>

            <Analogy label="Better Than Humans">
                ResNet-152 achieved 3.57% top-5 error on the ImageNet test. The best human
                performance on the same test was estimated at about 5.1%.
                <br /><br />
                For the first time, a computer was better than humans at recognising images from
                1,000 different categories. Not just slightly better &mdash; 30% more accurate.
                <br /><br />
                This happened with a 152-layer network &mdash; but that depth was only possible
                because of the bypass roads. Without skip connections, adding layer 30 would have
                made things worse. With them, adding layer 152 made things better.
            </Analogy>

            <div className="ch-callout">
                <strong>The universal building block:</strong> The skip connection appears in every
                modern AI system. The Transformer architecture (the engine behind GPT and ChatGPT)
                uses a skip connection around every attention layer and every feed-forward layer.
                Without ResNet's insight, the GPT family would not exist in its current form.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>ResNet: Residual Learning and the Gradient Highway</h2>

            <p>
                ResNet's contribution can be stated in one sentence: replace each layer's task
                from learning H(x) to learning F(x) = H(x) &minus; x, and add x back via a skip
                connection. Everything else &mdash; the block types, depth variants, projection
                shortcuts &mdash; follows from this single reformulation.
            </p>

            <h3>The Degradation Problem, Precisely</h3>
            <p>
                If we add L extra layers to an already-trained n-layer network, the optimal
                behaviour for those extra layers is to learn identity functions: F_l(x) = x for
                each extra layer l. With standard architectures, this requires each layer to learn
                a complex function (a ReLU-activated composition of linear maps) that approximates
                the identity. This is surprisingly hard for gradient descent to find in high dimensions,
                especially when many such layers must cooperate.
            </p>
            <p>
                The key insight: if identity is hard to learn, change the parameterisation so that
                identity is the easiest thing to learn.
            </p>

            <DefBlock label="Residual Block Formulation">
                Let x be the block's input. The block output is:
                <br /><br />
                y = F(x, W) + x
                <br /><br />
                where F(x, W) represents the residual function learned by the layer(s). For a
                two-layer block: F(x, W) = W&#8322; &middot; &sigma;(BN(W&#8321; &middot; x)),
                where &sigma; is ReLU and BN is batch normalisation.
                <br /><br />
                At initialisation with near-zero weights, F(x, W) &asymp; 0, so y &asymp; x.
                The block starts as a near-identity mapping. Gradient descent only needs to learn
                the small corrections F(x) from this starting point.
            </DefBlock>

            <h3>Why Gradient Flow Is Better</h3>
            <p>
                During backpropagation, the gradient through a residual block:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x} = \frac{\partial \mathcal{L}}{\partial y} \cdot \frac{\partial y}{\partial x} = \frac{\partial \mathcal{L}}{\partial y} \cdot \left(1 + \frac{\partial F}{\partial x}\right)" />
            <p>
                Even if &part;F/&part;x is small (the residual path vanishes), the gradient still
                propagates through the identity term: (&part;L/&part;y) &middot; 1. This guarantees
                a gradient highway from the output back to any layer in the network, regardless of
                depth. For a ResNet with L blocks, the gradient path to layer l includes the direct
                identity path that bypasses all blocks between l and L.
            </p>

            <h3>Basic Block vs. Bottleneck Block</h3>
            <p>
                <strong>Basic Block (ResNet-18/34):</strong> Two 3&times;3 convolutions with
                same-padding, each followed by BatchNorm + ReLU. Skip connection adds input to
                the output before the final ReLU.
            </p>
            <p>
                <strong>Bottleneck Block (ResNet-50/101/152):</strong> 1&times;1 conv (reduces
                channels from C to C/4) &rarr; 3&times;3 conv (processes in the reduced space) &rarr;
                1&times;1 conv (expands back to C). Three operations versus two, but the expensive
                3&times;3 operates on C/4 channels instead of C &mdash; a 16&times; compute reduction
                for the spatial processing step.
            </p>

            <h3>Projection Shortcuts</h3>
            <p>
                When the skip connection's input and the block's output have different dimensions
                (different channels or spatial size), the identity skip cannot be added directly.
                ResNet uses a 1&times;1 convolution with the appropriate stride to project the input:
            </p>
            <MathBlock tex="y = F(x, W_F) + W_s \, x" />
            <p>
                where W_s is the projection matrix (a 1&times;1 conv). This is applied only at
                the boundaries between ResNet stages (where spatial downsampling occurs by stride 2
                and channel count doubles). Within a stage, pure identity shortcuts are used.
            </p>

            <div className="ch-callout">
                <strong>ResNet in Transformers:</strong> The Transformer architecture (Chapter 16)
                uses residual connections around every self-attention block and every feedforward block.
                The residual connection is so fundamental that it's baked into Transformer design:
                output = LayerNorm(x + SelfAttention(x)). Without this, training Transformers
                of depth 12, 24, or 96 layers would face the same degradation problem that
                motivated ResNet in 2015.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Gradient flow derivation &middot; bottleneck FLOPs &middot; loss landscape analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch BasicBlock &middot; BottleneckBlock &middot; ResNet-18/50/152</span>
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
            <h2>ResNet: Mathematical Analysis</h2>

            <h3>Residual Learning Formulation</h3>
            <p>
                Let H(x) be the desired mapping. A standard layer learns:
            </p>
            <MathBlock tex="y = H(x) = F(x, W)" />
            <p>
                A residual block instead learns F(x) = H(x) &minus; x, and computes:
            </p>
            <MathBlock tex="y = F(x, W) + x" />
            <p>
                If the optimal H(x) is close to the identity, F(x) = H(x) &minus; x should be
                close to zero. This is much easier to learn than learning the exact identity through
                a composition of non-linear transformations.
            </p>

            <h3>Gradient Flow Through Skip Connections</h3>
            <p>
                For a network with L residual blocks, the output of block l is:
            </p>
            <MathBlock tex="x_{l+1} = x_l + F(x_l, W_l)" />
            <p>
                Unrolling from block 1 to block L:
            </p>
            <MathBlock tex="x_L = x_1 + \sum_{l=1}^{L-1} F(x_l, W_l)" />
            <p>
                The gradient from the loss L with respect to x&#8321;:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_1} = \frac{\partial \mathcal{L}}{\partial x_L} \cdot \frac{\partial x_L}{\partial x_1} = \frac{\partial \mathcal{L}}{\partial x_L} \cdot \left(1 + \sum_{l=1}^{L-1} \frac{\partial F(x_l, W_l)}{\partial x_1}\right)" />
            <p>
                The term &part;L/&part;x_L &middot; 1 is the direct gradient path from output to
                x&#8321;, unobstructed by any layer transformations. This guarantees the gradient
                is never smaller than &part;L/&part;x_L &mdash; the gradient from the final layer.
            </p>

            <h3>Bottleneck Block FLOPs</h3>
            <p>
                For a bottleneck block with C input channels and C/4 intermediate channels:
            </p>
            <MathBlock tex="\text{FLOPs} = H \cdot W \cdot \left(\underbrace{C \cdot \frac{C}{4}}_{\text{1}\times\text{1 down}} + \underbrace{9 \cdot \frac{C}{4} \cdot \frac{C}{4}}_{\text{3}\times\text{3}} + \underbrace{\frac{C}{4} \cdot C}_{\text{1}\times\text{1 up}}\right)" />
            <MathBlock tex="= H \cdot W \cdot C^2 \left(\frac{1}{4} + \frac{9}{16} + \frac{1}{4}\right) = H \cdot W \cdot C^2 \cdot \frac{17}{16}" />
            <p>
                Compare to two 3&times;3 convolutions (basic block): 2 &times; 9 &times; H&times;W&times;C&sup2; = 18H&times;W&times;C&sup2;.
                The bottleneck uses 17/16 &divide; 18 &asymp; 5.9% of the compute for the same receptive field,
                with the same skip connection structure.
            </p>

            <DefBlock label="He Initialisation Matches ResNets">
                ResNet typically uses He initialisation (Kaiming, 2015): weights drawn from
                N(0, 2/fan_in). The factor of 2 accounts for ReLU zeroing half of all pre-activations.
                This keeps the signal variance constant across layers during the forward pass.
                For a residual block at initialisation: F(x) &asymp; 0 (near-zero weights),
                so y &asymp; x. The variance of x propagates unchanged, and He initialisation
                ensures this remains stable across an arbitrary number of blocks.
            </DefBlock>

            <h3>Loss Landscape Interpretation</h3>
            <p>
                Li et al. (2018) visualised the loss landscapes of ResNet and plain networks.
                Plain networks (no skip connections) exhibit chaotic, narrow ravines. ResNets
                exhibit smooth, wide minima. Formally, the Hessian of the loss at a ResNet
                minimum has better-conditioned eigenvalue distributions &mdash; fewer extremely
                large eigenvalues &mdash; making gradient descent more stable and allowing larger
                learning rates.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── Residual Blocks ────────────────────────────────────────────────────────────

class BasicBlock(nn.Module):
    """
    Basic residual block for ResNet-18 and ResNet-34.
    Two 3x3 convolutions. Skip connection adds input to output.
    When dimensions change, a 1x1 projection shortcut matches them.
    """
    expansion = 1

    def __init__(self, in_ch: int, out_ch: int, stride: int = 1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(out_ch)

        # Projection shortcut: match dimensions when stride > 1 or channels differ
        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_ch),
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Main path: Conv -> BN -> ReLU -> Conv -> BN
        out  = torch.relu(self.bn1(self.conv1(x)))
        out  = self.bn2(self.conv2(out))
        # Skip path + merge (ReLU after addition)
        out += self.shortcut(x)
        return torch.relu(out)


class BottleneckBlock(nn.Module):
    """
    Bottleneck block for ResNet-50/101/152.
    1x1 (reduce) -> 3x3 (process) -> 1x1 (expand) with skip connection.
    The 3x3 conv operates on C/4 channels -- 16x cheaper than operating on C.
    """
    expansion = 4   # output channels = 4 * out_ch

    def __init__(self, in_ch: int, out_ch: int, stride: int = 1):
        super().__init__()
        # 1x1: reduce
        self.conv1 = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.bn1   = nn.BatchNorm2d(out_ch)
        # 3x3: process (in reduced channel space)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(out_ch)
        # 1x1: expand
        self.conv3 = nn.Conv2d(out_ch, out_ch * self.expansion, 1, bias=False)
        self.bn3   = nn.BatchNorm2d(out_ch * self.expansion)

        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch * self.expansion:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_ch, out_ch * self.expansion, 1, stride=stride, bias=False),
                nn.BatchNorm2d(out_ch * self.expansion),
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out  = torch.relu(self.bn1(self.conv1(x)))
        out  = torch.relu(self.bn2(self.conv2(out)))
        out  = self.bn3(self.conv3(out))
        out += self.shortcut(x)     # F(x) + x
        return torch.relu(out)


# ── ResNet Architecture ────────────────────────────────────────────────────────

class ResNet(nn.Module):
    def __init__(self, block, layers: list[int], num_classes: int = 1000):
        super().__init__()
        self.in_ch = 64

        # Stem: single large conv before residual stages
        self.stem = nn.Sequential(
            nn.Conv2d(3, 64, 7, stride=2, padding=3, bias=False),
            nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1),
        )

        # Four stages, each doubling channels and halving spatial resolution
        self.stage1 = self._make_stage(block,  64, layers[0], stride=1)
        self.stage2 = self._make_stage(block, 128, layers[1], stride=2)
        self.stage3 = self._make_stage(block, 256, layers[2], stride=2)
        self.stage4 = self._make_stage(block, 512, layers[3], stride=2)

        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc   = nn.Linear(512 * block.expansion, num_classes)

        # He initialisation
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)

    def _make_stage(self, block, out_ch: int, num_blocks: int, stride: int) -> nn.Sequential:
        layers = [block(self.in_ch, out_ch, stride)]
        self.in_ch = out_ch * block.expansion
        for _ in range(1, num_blocks):
            layers.append(block(self.in_ch, out_ch, stride=1))
        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        x = self.stage1(x)
        x = self.stage2(x)
        x = self.stage3(x)
        x = self.stage4(x)
        x = self.pool(x)
        return self.fc(torch.flatten(x, 1))


# Factory functions
def resnet18(nc=1000):  return ResNet(BasicBlock,      [2, 2, 2, 2], nc)
def resnet34(nc=1000):  return ResNet(BasicBlock,      [3, 4, 6, 3], nc)
def resnet50(nc=1000):  return ResNet(BottleneckBlock, [3, 4, 6, 3], nc)
def resnet101(nc=1000): return ResNet(BottleneckBlock, [3, 4, 23, 3], nc)
def resnet152(nc=1000): return ResNet(BottleneckBlock, [3, 8, 36, 3], nc)


# ── Compare all ResNet variants ────────────────────────────────────────────────
if __name__ == "__main__":
    x = torch.randn(2, 3, 224, 224)
    models = [
        ('ResNet-18',  resnet18()),
        ('ResNet-34',  resnet34()),
        ('ResNet-50',  resnet50()),
        ('ResNet-101', resnet101()),
        ('ResNet-152', resnet152()),
    ]
    for name, m in models:
        y = m(x)
        p = sum(q.numel() for q in m.parameters())
        print(f"{name:12s}  {p:>12,} params  output: {y.shape}")

    print()
    print("ResNet-152 achieved 3.57% top-5 error on ILSVRC 2015.")
    print("Human-level performance on the same benchmark: ~5.1%.")`

function PythonContent() {
    return (
        <>
            <p>
                A clean ResNet implementation with both BasicBlock (ResNet-18/34) and
                BottleneckBlock (ResNet-50/101/152). The projection shortcut handles
                dimension mismatches at stage boundaries. He initialisation pairs
                naturally with residual learning: at init, F(x) &asymp; 0 so y &asymp; x,
                giving a near-identity start throughout.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="resnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>The F(x) + x insight:</strong> Run the code and note that ResNet-50
                has ~25M parameters &mdash; 18% of VGGNet-16 &mdash; at substantially better
                accuracy. The bottleneck blocks and global average pooling together achieve
                this efficiency. Every parameter counts because the architecture doesn't
                allow waste: the skip connection ensures each layer only needs to learn
                what it uniquely contributes.
            </div>
        </>
    )
}

export const RESNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
