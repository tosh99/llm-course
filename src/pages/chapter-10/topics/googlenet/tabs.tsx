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
            year: "2013",
            title: "Lin, Chen &amp; Yan &mdash; Network in Network and the 1&times;1 Revolution",
            context:
                "In 2013, while AlexNet was still the definitive deep learning baseline, Min Lin, Qiang Chen, and Shuicheng Yan published a paper called 'Network in Network.' The paper made an observation that seems trivial in retrospect but was revolutionary in practice: a 1&times;1 convolution is a fully connected operation applied pointwise across the channel dimension. Instead of a spatial filter, it combines information from all channels at a single pixel. This means it can reduce or increase the number of channels (feature maps) without touching the spatial dimensions.",
            what:
                "The 1&times;1 convolution can be thought of as a tiny multi-layer perceptron applied to every spatial location independently. With a 1&times;1 conv reducing 256 channels to 64, you take 256 numbers at each pixel and mix them into 64 numbers &mdash; a learnable dimensionality reduction. This allows you to inject an efficient compression step before any expensive 3&times;3 or 5&times;5 convolution. The paper also proposed global average pooling as a replacement for fully connected layers, a design choice that GoogLeNet would adopt.",
            impact:
                "The 1&times;1 convolution became the key building block of efficient architectures. Szegedy et al. at Google read the Network in Network paper and realised it solved a critical bottleneck: to add more filter sizes in parallel, you need a way to keep the computation tractable. The 1&times;1 bottleneck was the answer.",
        },
        {
            year: "2014",
            title: "Szegedy et al. &mdash; Going Deeper with Convolutions (GoogLeNet)",
            context:
                "Christian Szegedy, Wei Liu, Yangqing Jia, Pierre Sermanet, Scott Reed, Dragomir Anguelov, Dumitru Erhan, Vincent Vanhoucke, and Andrew Rabinovich at Google Brain and Google DeepMind submitted to ILSVRC 2014. Their paper was titled 'Going Deeper with Convolutions' &mdash; a play on the team name (Google) and the architecture name (Inception, from the film). The question they asked: how do you make a CNN both deeper and more efficient at the same time?",
            what:
                "The Inception module applies four operations in parallel to the same input: a 1&times;1 convolution, a 1&times;1 bottleneck followed by a 3&times;3 convolution, a 1&times;1 bottleneck followed by a 5&times;5 convolution, and a 3&times;3 max-pool followed by a 1&times;1 convolution. The four outputs are concatenated along the channel dimension. GoogLeNet stacked 9 such modules, preceded by two conventional convolutional layers, for a total of 22 layers. To address vanishing gradients across such depth, two auxiliary classifiers were attached at intermediate layers (Inception 4a and 4d): small classification heads that contributed gradient signal to the early layers during training and were discarded at test time.",
            impact:
                "GoogLeNet won ILSVRC 2014 with 6.67% top-5 error &mdash; below the estimated human-level error of 5.1% on that benchmark. More remarkably, it achieved this with only 6.8 million parameters, versus VGGNet's 138 million. The 20&times; parameter reduction at superior accuracy proved that architectural innovation could substitute for brute-force parameter scaling.",
        },
        {
            year: "2015",
            title: "Inception-v2 and Batch Normalisation",
            context:
                "GoogLeNet trained for roughly one week on a modest GPU cluster. The training procedure was delicate: the auxiliary classifiers required careful weighting, and the depth made the loss landscape difficult to navigate. Ioffe and Szegedy's batch normalisation paper arrived simultaneously in 2015, and the Google team immediately applied it to Inception.",
            what:
                "Inception-v2 inserted batch normalisation after every convolution in both the main GoogLeNet body and the Inception modules. The results were dramatic: training time dropped by a factor of 14 with higher accuracy. The batch normalisation paper (Ioffe &amp; Szegedy, 2015) itself benchmarked on Inception, showing that a BN-Inception model trained with 14&times; fewer steps matched the original GoogLeNet's accuracy. Inception-v2 also replaced 5&times;5 convolutions with two 3&times;3 convolutions (the same insight VGGNet had used) to reduce parameters while maintaining receptive field.",
            impact:
                "Batch normalisation became the universal training stabiliser for deep networks. It eliminated the need for careful learning rate tuning, allowed higher learning rates, reduced sensitivity to initialisation, and acted as a regulariser. After 2015, essentially no competitive CNN was trained without it. The combination of BN + Inception became a template for every subsequent Google vision model.",
        },
        {
            year: "2015 &ndash; 2016",
            title: "Inception-v3: Factorisation and Auxiliary Redesign",
            context:
                "With batch normalisation solving training instability, the Google team focused on further reducing computation while maintaining accuracy. Inception-v3 (Szegedy et al., 2015) introduced systematic factorisation of convolutions: large convolutions can be approximated by sequences of smaller ones.",
            what:
                "Inception-v3 factorised 7&times;7 convolutions into a 7&times;1 followed by a 1&times;7 (asymmetric factorisation). The two one-dimensional filters have 14 parameters versus the 49 of a single 7&times;7. A 5&times;5 was factorised into two 3&times;3 convolutions. The auxiliary classifiers were redesigned: instead of two complex auxiliary heads, a single simplified auxiliary classifier (with one convolution and one FC layer, plus batch normalisation) at Inception 4a. Inception-v3 achieved 4.2% top-5 error on a single model, substantially better than GoogLeNet's 6.67%.",
            impact:
                "Asymmetric factorisation (n&times;1 and 1&times;n convolutions) became another standard architectural primitive. The insight generalises: an n&times;n convolution can be factorised into an n&times;1 followed by a 1&times;n, with roughly 2n/n&sup2; = 2/n the parameter count. For n=7, this is 14/49 &asymp; 29% of the original cost.",
        },
        {
            year: "2016 &ndash; 2017",
            title: "Inception-v4 and Inception-ResNet: Convergence",
            context:
                "By 2016, ResNet's skip connections had demonstrated a new training trick: residual learning. The Google team wondered whether Inception modules and residual connections were complementary, and whether combining them could yield further gains.",
            what:
                "Inception-v4 (Szegedy et al., 2017) redesigned the Inception topology for uniformity and removed some ad-hoc design choices. Inception-ResNet-v1 and v2 added residual connections within each Inception module: the module's input was added back to its output (matching AlexNet residual connections conceptually though published in a different order). The combined architecture achieved 3.7% and 3.0% top-5 error on ILSVRC, approaching the best ResNets.",
            impact:
                "Inception-ResNet confirmed that residual connections and multi-scale parallel processing were orthogonal improvements that both helped and could be combined. Modern architectural search and neural architecture search (NAS) results often converge on hybrid designs with residual connections, multi-scale processing, and 1&times;1 bottlenecks &mdash; the principles that Inception and ResNet independently developed.",
        },
        {
            year: "2017 &ndash; present",
            title: "The Inception Legacy in Efficiency",
            context:
                "After 2017, the frontier moved to EfficientNet, RegNet, and transformer-based vision models. But the principles GoogLeNet introduced &mdash; parameter efficiency, multi-scale processing, 1&times;1 bottlenecks, global average pooling &mdash; became permanent features of efficient architecture design.",
            what:
                "MobileNet (Howard et al., 2017) extended the 1&times;1 bottleneck idea with depthwise separable convolutions: separate spatial filtering (one filter per channel) from channel mixing (1&times;1 convolutions). MobileNet-v2 and MobileNet-v3 both use inverted residual blocks with 1&times;1 expansions and compressions. EfficientNet's compound scaling rule, which scales width, depth, and resolution jointly, was applied to a network that uses 1&times;1 bottlenecks throughout.",
            impact:
                "The 1&times;1 convolution and global average pooling, both pioneered in the Network in Network paper and operationalised in GoogLeNet, are now present in essentially every efficient neural network deployed on edge devices, mobile phones, and IoT hardware. GoogLeNet is the direct ancestor of billions of vision inferences performed on smartphones every day.",
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
            <h2>GoogLeNet: Four Teams Looking at Every Photo at Once</h2>

            <Analogy label="The Problem with One Magnifying Glass">
                AlexNet and VGGNet both looked at photos in a single way at each layer. One filter
                size. One level of zoom. One type of question being asked at a time.
                <br /><br />
                But objects in photos don't come at one size. A bird might fill the entire frame, or
                be a tiny speck against the sky. A car might be close up (big) or far away (small).
                If you choose one filter size, you're guaranteed to miss something.
                <br /><br />
                GoogLeNet's idea: don't choose. Ask all questions at once.
            </Analogy>

            <Analogy label="The Detective Squad">
                Imagine four detective teams all examining the same photograph simultaneously:
                <br /><br />
                <strong>Team 1&times;1 (The Quick Scanner):</strong> Doesn't look at any neighbourhood at all.
                Just asks: &quot;At this exact pixel, what is the most important information across all channels?&quot;
                It's like reading the table of contents before reading a book.<br /><br />
                <strong>Team 3&times;3 (The Neighbourhood Inspector):</strong> Looks at small 3&times;3 patches.
                Finds edges, local textures, small shapes.<br /><br />
                <strong>Team 5&times;5 (The Region Analyst):</strong> Looks at wider 5&times;5 patches.
                Sees broader structures that span multiple neighbourhoods.<br /><br />
                <strong>Team Pool (The Average Taker):</strong> Takes the strongest activation from
                each small region. Good at finding dominant features regardless of exact position.<br /><br />
                All four teams report their findings, and everything gets combined into one big report.
                That combined report is richer than any single team could produce.
            </Analogy>

            <Analogy label="The 1&times;1 Shrinking Machine">
                Before the 3&times;3 and 5&times;5 teams start work, there's a clever trick: a
                1&times;1 &quot;shrinking machine&quot; that compresses the information first.
                <br /><br />
                Imagine you have 256 different coloured crayons, but most of them are similar shades
                of the same colour. Before starting a big drawing, you pick the most distinct 64 colours.
                Now the drawing takes less time and uses less paper.
                <br /><br />
                That's what the 1&times;1 convolution does before the big filters. It takes 256 channels
                and squeezes them to 32 or 64. The expensive 3&times;3 or 5&times;5 then only has to
                process those 64 channels instead of all 256. Same result, fraction of the work.
            </Analogy>

            <Analogy label="No More Giant Classifiers">
                AlexNet and VGGNet ended with three enormous decider layers containing tens of millions
                of connections. GoogLeNet did something radical: it replaced those with a single averaging operation.
                <br /><br />
                For each of the 1,024 feature maps at the end of the network, take the average value
                across the entire spatial grid. That gives you 1,024 numbers. Feed those 1,024 numbers
                directly to the final classifier.
                <br /><br />
                No giant layers. No 25,000&times;4,096 weight matrices. Just averaging and a small
                final step. This is called global average pooling, and it eliminated roughly 90% of
                the parameters compared to VGGNet's classifier.
            </Analogy>

            <Analogy label="The Two Training Assistants">
                Training a 22-layer network is hard because signals have to travel all the way back
                from the output to the early layers. By the time they reach layer 5 out of 22, the
                signal is very faint.
                <br /><br />
                GoogLeNet's solution: attach two small &quot;assistant teachers&quot; partway through
                the network. Each assistant teacher learns the same classification problem from an
                intermediate layer, providing extra signal to the early parts of the network.
                <br /><br />
                During training, the assistants help teach the early layers. At test time, the
                assistants are switched off &mdash; only the final, most capable classifier is used.
            </Analogy>

            <div className="ch-callout">
                <strong>The numbers:</strong> GoogLeNet had 22 layers but only 6.8 million parameters.
                AlexNet had 8 layers and 60 million parameters. VGGNet had 16 layers and 138 million.
                GoogLeNet was 20&times; lighter than VGGNet and still won the competition. This proved
                that intelligent architecture design beats brute-force parameter scaling.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GoogLeNet: Multi-Scale Processing and Parameter Efficiency</h2>

            <p>
                GoogLeNet's central claim was that parameter efficiency and accuracy were not in
                conflict. By applying multiple filter sizes in parallel and using 1&times;1 bottlenecks
                to control computation, it achieved better accuracy than VGGNet with 20&times; fewer
                parameters. Understanding the Inception module requires understanding three ideas:
                multi-scale parallelism, the 1&times;1 bottleneck, and global average pooling.
            </p>

            <h3>The Inception Module</h3>
            <p>
                An Inception module takes a feature map with H&times;W spatial dimensions and C
                input channels, and runs four branches in parallel:
            </p>
            <ul>
                <li><strong>Branch 1:</strong> 1&times;1 conv &rarr; O&#8321; output channels</li>
                <li><strong>Branch 2:</strong> 1&times;1 conv (R&#8322; channels) &rarr; 3&times;3 conv (O&#8322; channels)</li>
                <li><strong>Branch 3:</strong> 1&times;1 conv (R&#8323; channels) &rarr; 5&times;5 conv (O&#8323; channels)</li>
                <li><strong>Branch 4:</strong> 3&times;3 max-pool &rarr; 1&times;1 conv (O&#8324; channels)</li>
            </ul>
            <p>
                All branches use same-padding to preserve H&times;W. Outputs are concatenated along
                the channel dimension: total output channels = O&#8321; + O&#8322; + O&#8323; + O&#8324;.
            </p>

            <DefBlock label="The 1&times;1 Bottleneck Computation Savings">
                For H&times;W input with C=256 channels, naive 3&times;3 producing O=128 output:
                <br /><br />
                Naive: H &times; W &times; 256 &times; 9 &times; 128 = H&times;W &times; 294,912 operations
                <br /><br />
                With 1&times;1 reduction to R=64, then 3&times;3:
                H &times; W &times; (256 &times; 64 + 64 &times; 9 &times; 128) = H&times;W &times; (16,384 + 73,728) = H&times;W &times; 90,112
                <br /><br />
                Savings: 69% reduction in multiply-accumulate operations.
            </DefBlock>

            <h3>Global Average Pooling</h3>
            <p>
                VGGNet's final feature map (7&times;7&times;512) was flattened to 25,088 values and
                fed to a 25,088&times;4,096 FC layer: 102 million parameters. GoogLeNet's final
                feature map (7&times;7&times;1024) is processed with global average pooling:
            </p>
            <ul>
                <li>For each of the 1,024 channels, compute the mean across the 7&times;7 grid</li>
                <li>Output: a 1,024-dimensional vector, one value per channel</li>
                <li>Feed this to a single 1,024&times;1,000 linear layer: 1.02 million parameters</li>
                <li>Versus VGGNet's FC6 alone: 102 million parameters</li>
            </ul>
            <p>
                This design choice was directly motivated by the Network in Network paper.
                It also has a regularisation benefit: because the final representation is an
                average rather than a learned projection, it is harder to overfit.
            </p>

            <h3>Auxiliary Classifiers: Gradient Injection</h3>
            <p>
                At GoogLeNet's depth (22 layers), gradients from the output must travel far to
                reach early layers. The auxiliary classifiers attached at Inception 4a and 4d
                provide additional gradient injection points. Each auxiliary classifier contains:
                a 5&times;5 average pool, a 1&times;1 conv, two FC layers, and a softmax. Their
                loss is added to the main loss with weight 0.3:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{main}} + 0.3 \cdot \mathcal{L}_{\text{aux1}} + 0.3 \cdot \mathcal{L}_{\text{aux2}}" />

            <h3>The Inception Evolution: v1 to v4</h3>
            <p>
                Each Inception version introduced a key new idea:
            </p>
            <ul>
                <li><strong>Inception-v1 (GoogLeNet, 2014):</strong> Multi-scale parallel processing + 1&times;1 bottleneck + GAP</li>
                <li><strong>Inception-v2 (2015):</strong> Add Batch Normalisation everywhere</li>
                <li><strong>Inception-v3 (2015):</strong> Asymmetric factorisation (7&times;7 &rarr; 7&times;1 + 1&times;7)</li>
                <li><strong>Inception-v4 / Inception-ResNet (2017):</strong> Add residual skip connections within modules</li>
            </ul>

            <div className="ch-callout">
                <strong>The deeper principle:</strong> GoogLeNet's architecture encodes a belief
                that convolutional networks should be both deep (many layers) and wide (multiple
                filter sizes in parallel), but that width should be achieved efficiently via
                bottlenecks, not by simply increasing filter counts. Every efficient CNN after
                2014 &mdash; MobileNet, EfficientNet, RegNet &mdash; implements some version of this principle.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">FLOPs analysis &middot; bottleneck derivation &middot; GAP interpretation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch Inception module &middot; full GoogLeNet &middot; GAP comparison</span>
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

            <h3>Inception Module FLOPs</h3>
            <p>
                For an H&times;W feature map with C_in input channels, the four branches cost:
            </p>
            <p><strong>1&times;1 branch:</strong></p>
            <MathBlock tex="\text{FLOPs}_1 = H \cdot W \cdot C_{\text{in}} \cdot O_1" />
            <p><strong>3&times;3 branch (with 1&times;1 reduction to R&#8322;):</strong></p>
            <MathBlock tex="\text{FLOPs}_2 = H \cdot W \cdot \bigl(C_{\text{in}} \cdot R_2 + 9 \cdot R_2 \cdot O_2\bigr)" />
            <p><strong>5&times;5 branch (with 1&times;1 reduction to R&#8323;):</strong></p>
            <MathBlock tex="\text{FLOPs}_3 = H \cdot W \cdot \bigl(C_{\text{in}} \cdot R_3 + 25 \cdot R_3 \cdot O_3\bigr)" />
            <p><strong>Pool branch (pooling negligible, then 1&times;1):</strong></p>
            <MathBlock tex="\text{FLOPs}_4 = H \cdot W \cdot C_{\text{in}} \cdot O_4" />
            <p>
                Total output channels: C_out = O&#8321; + O&#8322; + O&#8323; + O&#8324;.
                The bottleneck reductions R&#8322; and R&#8323; are the primary levers for controlling compute.
            </p>

            <h3>Why 1&times;1 Convolutions Are Sufficient for Channel Mixing</h3>
            <p>
                A 1&times;1 convolution with C_in inputs and C_out outputs applies the following
                transformation at each spatial position (i, j):
            </p>
            <MathBlock tex="y_{i,j} = W \cdot x_{i,j} + b, \quad W \in \mathbb{R}^{C_{\text{out}} \times C_{\text{in}}}" />
            <p>
                This is identical to a fully connected layer applied independently at each spatial
                position. It performs arbitrary linear combinations of channels without any spatial
                mixing. When C_out &lt; C_in, this is a learned dimensionality reduction; when
                C_out &gt; C_in, it is a learned expansion (as in MobileNet-v2 inverted residuals).
            </p>

            <h3>Global Average Pooling vs. Fully Connected</h3>
            <p>
                Let the final feature map be F of shape H&times;W&times;C. Global average pooling:
            </p>
            <MathBlock tex="\text{GAP}(F)_c = \frac{1}{H \cdot W} \sum_{i=1}^{H} \sum_{j=1}^{W} F_{i,j,c}" />
            <p>
                This produces a C-dimensional vector representing the global spatial average of
                each channel. The subsequent linear classifier has C&times;K parameters (K classes).
                Compare to the FC approach: H&times;W&times;C&times;D parameters where D is the hidden size.
                For GoogLeNet: GAP gives 1024&times;1000 = 1.02M vs. FC would give 50176&times;4096 = 205M.
            </p>

            <h3>Inception Auxiliary Loss</h3>
            <p>
                The total GoogLeNet training objective with auxiliary classifiers at layers a and b:
            </p>
            <MathBlock tex="\mathcal{L} = \mathcal{L}_{\text{main}}(\theta) + \lambda_a \,\mathcal{L}_{\text{aux},a}(\theta_{\leq a}) + \lambda_b \,\mathcal{L}_{\text{aux},b}(\theta_{\leq b})" />
            <p>
                where &lambda;_a = &lambda;_b = 0.3 in the original paper. The gradient of the
                auxiliary loss propagates only to layers at or before the attachment point,
                providing a &quot;shortcut&quot; gradient path for early layers analogous to
                ResNet's skip connections.
            </p>

            <DefBlock label="Inception vs. VGGNet Parameter Comparison">
                GoogLeNet: 6.8M parameters, 6.67% top-5 ILSVRC 2014 error.
                VGGNet-16: 138M parameters, 7.32% top-5 ILSVRC 2014 error.
                Ratio: VGGNet has 20.3&times; more parameters for 0.65% worse accuracy.
                This factor-of-20 efficiency advantage is the quantitative case for architectural
                innovation over brute-force scaling.
            </DefBlock>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn

# ── Inception Module ───────────────────────────────────────────────────────────

class InceptionModule(nn.Module):
    """
    The Inception module: four parallel branches processing the same input.
    1x1 bottlenecks reduce computation before expensive 3x3 and 5x5 convolutions.
    All branches preserve spatial dimensions (same-padding) and are concatenated.
    """
    def __init__(self, in_ch: int,
                 out_1x1: int,
                 red_3x3: int, out_3x3: int,
                 red_5x5: int, out_5x5: int,
                 out_pool: int):
        super().__init__()

        # Branch 1: 1x1 conv
        self.b1 = nn.Sequential(
            nn.Conv2d(in_ch, out_1x1, 1), nn.BatchNorm2d(out_1x1), nn.ReLU(inplace=True))

        # Branch 2: 1x1 -> 3x3
        self.b2 = nn.Sequential(
            nn.Conv2d(in_ch, red_3x3, 1),   nn.BatchNorm2d(red_3x3), nn.ReLU(inplace=True),
            nn.Conv2d(red_3x3, out_3x3, 3, padding=1), nn.BatchNorm2d(out_3x3), nn.ReLU(inplace=True))

        # Branch 3: 1x1 -> 5x5  (can also use two 3x3s: same RF, fewer params)
        self.b3 = nn.Sequential(
            nn.Conv2d(in_ch, red_5x5, 1),   nn.BatchNorm2d(red_5x5), nn.ReLU(inplace=True),
            nn.Conv2d(red_5x5, out_5x5, 5, padding=2), nn.BatchNorm2d(out_5x5), nn.ReLU(inplace=True))

        # Branch 4: 3x3 pool -> 1x1
        self.b4 = nn.Sequential(
            nn.MaxPool2d(3, stride=1, padding=1),
            nn.Conv2d(in_ch, out_pool, 1),  nn.BatchNorm2d(out_pool), nn.ReLU(inplace=True))

        self.out_channels = out_1x1 + out_3x3 + out_5x5 + out_pool

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return torch.cat([self.b1(x), self.b2(x), self.b3(x), self.b4(x)], dim=1)


# ── Simplified GoogLeNet ───────────────────────────────────────────────────────

class GoogLeNet(nn.Module):
    """
    GoogLeNet (Inception-v1) with BatchNorm and global average pooling.
    6.8M parameters vs. VGGNet-16's 138M -- at HIGHER accuracy on ILSVRC 2014.
    """
    def __init__(self, num_classes: int = 1000):
        super().__init__()

        # Initial stem: two conv layers before Inception modules
        self.stem = nn.Sequential(
            nn.Conv2d(3, 64, 7, stride=2, padding=3), nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1),                   # 56x56
            nn.Conv2d(64, 64, 1), nn.BatchNorm2d(64), nn.ReLU(inplace=True),
            nn.Conv2d(64, 192, 3, padding=1), nn.BatchNorm2d(192), nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1),                   # 28x28
        )

        # Inception modules: (in, 1x1, red3, 3x3, red5, 5x5, pool)
        self.inception3a = InceptionModule(192, 64,  96, 128, 16,  32,  32)   # -> 256
        self.inception3b = InceptionModule(256, 128, 128, 192, 32,  96,  64)  # -> 480
        self.pool3       = nn.MaxPool2d(3, stride=2, padding=1)               # 14x14

        self.inception4a = InceptionModule(480, 192, 96,  208, 16,  48,  64)  # -> 512
        self.inception4b = InceptionModule(512, 160, 112, 224, 24,  64,  64)  # -> 512
        self.inception4c = InceptionModule(512, 128, 128, 256, 24,  64,  64)  # -> 512
        self.inception4d = InceptionModule(512, 112, 144, 288, 32,  64,  64)  # -> 528
        self.inception4e = InceptionModule(528, 256, 160, 320, 32, 128, 128)  # -> 832
        self.pool4       = nn.MaxPool2d(3, stride=2, padding=1)               # 7x7

        self.inception5a = InceptionModule(832, 256, 160, 320, 32, 128, 128)  # -> 832
        self.inception5b = InceptionModule(832, 384, 192, 384, 48, 128, 128)  # -> 1024

        # Global average pooling: replaces all FC layers (eliminates ~100M params)
        self.gap      = nn.AdaptiveAvgPool2d((1, 1))
        self.dropout  = nn.Dropout(p=0.4)
        self.fc       = nn.Linear(1024, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        x = self.inception3a(x)
        x = self.inception3b(x)
        x = self.pool3(x)
        x = self.inception4a(x)
        x = self.inception4b(x)
        x = self.inception4c(x)
        x = self.inception4d(x)
        x = self.inception4e(x)
        x = self.pool4(x)
        x = self.inception5a(x)
        x = self.inception5b(x)
        x = self.gap(x)
        x = torch.flatten(x, 1)
        x = self.dropout(x)
        return self.fc(x)


# ── Compare parameter counts ──────────────────────────────────────────────────
if __name__ == "__main__":
    model = GoogLeNet(num_classes=1000)
    x     = torch.randn(2, 3, 224, 224)
    y     = model(x)

    total = sum(p.numel() for p in model.parameters())
    print(f"GoogLeNet parameters: {total:,}")        # ~6.8M

    print(f"Input:  {x.shape}")
    print(f"Output: {y.shape}")                       # (2, 1000)

    # Show per-module breakdown
    stem_p = sum(p.numel() for p in model.stem.parameters())
    fc_p   = sum(p.numel() for p in model.fc.parameters())
    print(f"  Stem:        {stem_p:>10,}")
    print(f"  FC head:     {fc_p:>10,}")
    print(f"  Inception:   {total - stem_p - fc_p:>10,}")

    # For comparison: VGGNet-16 FC6 alone has 102M params
    # GoogLeNet entire model has 6.8M -- the 1x1 bottleneck wins.`

function PythonContent() {
    return (
        <>
            <p>
                The InceptionModule class implements the four parallel branches with 1&times;1 bottlenecks.
                The full GoogLeNet replaces large FC layers with global average pooling, reducing
                the classifier from ~102M parameters (VGGNet FC6) to 1.02M while achieving
                better accuracy.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="googlenet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Run and compare:</strong> The parameter breakdown shows inception modules
                dominating the count at roughly 5.7M &mdash; but none of these are wasteful FC
                parameters. Every parameter does spatial filtering or channel mixing. The global
                average pooling at the end is the single most parameter-efficient operation in CNN history.
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
