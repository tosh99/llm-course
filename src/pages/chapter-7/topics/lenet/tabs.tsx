import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The context</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "1989",
            title: "The First Deployment — Zip Code Recognition at AT&amp;T Bell Labs",
            challenge:
                "LeCun had proven that backpropagation could train convolutional networks in theory, but theory was not enough for AT&amp;T Bell Labs, which needed a system that could reliably read handwritten zip codes on millions of mail pieces per day. The challenge was three-fold: the network had to be accurate enough for production use (errors meant misrouted mail), fast enough to run in real-time on 1989 hardware, and small enough to fit on the available memory. No existing system met all three requirements.",
            what: "LeCun built a convolutional network to read zip code digits from envelopes. The network took 16&#215;16 grayscale images of individual digits and processed them through three layers of computation: a convolutional layer with 12 feature maps, a subsampling (pooling) layer, and two fully-connected layers leading to a 10-class output. The system used shared-weight convolution and was trained on 7,291 digit images with 2,007 for testing. Performance: 99.0% accuracy on the test set, and fast enough for real-time processing.",
            impact:
                "The 1989 system was deployed at AT&amp;T and processed a large fraction of US mail within a few years. This was one of the first commercial deployments of a neural network trained end-to-end on real data, demonstrating that the architecture was not just a laboratory curiosity. It also provided a crucial proof of concept for the more ambitious LeNet-5 architecture that would follow in 1998.",
        },
        {
            year: "1998",
            title: "LeNet-5 — The Definitive Architecture",
            challenge:
                "After a decade of working on convolutional networks, LeCun and his collaborators at Bell Labs wanted to publish a definitive, comprehensive account of the architecture: its layer structure, parameter count, training procedure, and theoretical justification. They also needed a clean benchmark — a standardised dataset that would allow fair comparison across methods — to demonstrate the architecture's capabilities conclusively.",
            what: "LeCun, Bottou, Bengio, and Haffner published 'Gradient-Based Learning Applied to Document Recognition' in the Proceedings of the IEEE (1998). The paper introduced LeNet-5 — a seven-layer network processing 32&#215;32 grayscale images through two convolutional layers with pooling, then three fully-connected layers, ending in a 10-class classifier. The paper also introduced the MNIST benchmark: 60,000 training examples and 10,000 test examples of handwritten digits from Census Bureau employees and high school students, scanned and centred on a 28&#215;28 pixel canvas. LeNet-5 achieved 0.95% error on MNIST — better than any existing system.",
            impact:
                "The 1998 paper established the canonical CNN blueprint that persists to this day: alternating convolutional and pooling layers progressively extracting features, followed by fully-connected classification layers. The MNIST benchmark became the standard evaluation for image classification for over a decade. LeNet-5 was deployed in ATM machines across the United States to read the amounts on handwritten checks, processing millions of checks per day. LeCun later estimated that at its peak, LeNet-5 was reading 10% to 20% of all checks written in the US.",
        },
        {
            year: "1998",
            title: "The Architecture in Detail — Layer by Layer",
            challenge:
                "The specific design choices in LeNet-5 — filter sizes, feature map counts, activation functions, pooling method — were not arbitrary. Each was chosen to balance computational cost (constrained by 1990s hardware), representational capacity, and generalisation ability. The choice of average pooling over max pooling, tanh over sigmoid, and RBF over softmax for the output were all deliberate engineering decisions with specific rationales.",
            what: "LeNet-5 processes a 32&#215;32 input through: C1 (6 feature maps, 5&#215;5 conv, output 28&#215;28), S2 (6 feature maps, 2&#215;2 average pool with learnable weight and sigmoid, output 14&#215;14), C3 (16 feature maps, 5&#215;5 conv with partial connections from S2, output 10&#215;10), S4 (16 feature maps, 2&#215;2 pool, output 5&#215;5), C5 (120 units, 5&#215;5 conv reducing to 1&#215;1 — effectively fully-connected), F6 (84 units, fully-connected), and the output layer (10 Radial Basis Function units, not softmax). The C3 partial connections — where each C3 feature map connects to only some of the S2 feature maps — were included to break symmetry and force diversity in learned features.",
            impact:
                "The detailed architectural specification made LeNet-5 the first published CNN architecture that others could reproduce exactly. The paper's 50+ pages included full mathematical derivations, training curves, comparison to other methods, and analysis of learned features. It served as the primary reference for CNN architecture design for over a decade. Modern architectures — VGG, ResNet, EfficientNet — all use the same fundamental pattern: conv-pool-conv-pool-fc-output, with increasing feature depth and decreasing spatial resolution.",
        },
        {
            year: "1998–2012",
            title: "LeNet's Limitations — Why It Couldn't Scale",
            challenge:
                "LeNet-5 achieved remarkable accuracy on MNIST but failed to scale to more complex visual tasks. When tested on CIFAR-10 (10 classes, colour images) or the emerging ImageNet dataset, performance was mediocre. The architecture had three fundamental limitations that would not be solved until the 2012 AlexNet era: insufficient depth (7 layers couldn't represent complex hierarchies), sigmoid/tanh activations causing vanishing gradients in deeper versions, and no effective regularisation preventing overfitting on larger datasets.",
            what: "Research in the 2000s attempted to extend LeNet-style architectures to more complex tasks with limited success. The vanishing gradient problem prevented training more than ~7-8 layers effectively with sigmoid/tanh activations. Data augmentation and regularisation techniques were not yet systematic. Without ReLU activations (which wouldn't appear in the context of deep CNNs until Nair and Hinton's 2010 restricted Boltzmann machine work and Glorot et al.'s 2011 paper), deeper networks simply did not train. The field turned to SVMs and hand-crafted features (HOG, SIFT) which produced better results on the harder benchmarks of the era.",
            impact:
                "LeNet's limitations defined the research agenda for the next decade: find activations that don't vanish (ReLU), find regularisation that prevents overfitting (dropout), find a large enough dataset (ImageNet), and exploit enough compute (GPUs). All four were available by 2012, and AlexNet's architecture was essentially a deeper, wider, GPU-accelerated LeNet with ReLU and dropout. The principles were all in the 1998 paper — the execution required a decade of waiting for the infrastructure to catch up.",
        },
        {
            year: "2012–Present",
            title: "LeNet's Legacy — Every Modern CNN Is LeNet's Descendant",
            challenge:
                "After AlexNet in 2012, CNNs rapidly scaled to hundreds of layers (ResNet-152, DenseNet-201) and hundreds of millions of parameters (VGG-19). The question of how these modern architectures relate to LeNet-5 is instructive: they are all elaborations of the same fundamental design, adding depth, skip connections, batch normalisation, and more sophisticated training, but keeping the core principle unchanged.",
            what: "The LeNet blueprint — conv&#8594;pool&#8594;conv&#8594;pool&#8594;fc&#8594;output — appears in every major CNN architecture, sometimes obscured by residual connections or attention modules but structurally present. ResNet uses the same layer types (conv, batch norm, ReLU, pooling) with added skip connections. EfficientNet uses the same depth-width-resolution scaling framework with more sophisticated compound scaling. Vision Transformers patch-embed images in a way that creates a learned analogue of convolutional filters. The hierarchy of local&#8594;global feature extraction that LeNet-5 demonstrated is the organisational principle of all of them.",
            impact:
                "LeNet-5 is to CNNs what the 1969 MLP is to feedforward networks: the founding architecture, still recognisable in every descendant, still taught as the entry point to the field. The 1998 paper has been cited over 35,000 times. The key insight it established — that convolutional, pooling, and fully-connected layers arranged hierarchically can learn visual representations from raw pixels — has proven robust across six orders of magnitude of scale, from LeNet-5's 60K training images and 60K parameters to GPT-4V's billions of parameters trained on billions of images.",
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
            <h2>LeNet-5: The robot that learned to read checks at the bank</h2>

            <Analogy label="The Bank's Problem">
                Banks receive millions of handwritten checks every day. Each check has a handwritten amount — "one hundred and fifty dollars," scrawled by someone in a hurry. A person would need to read every single one. Yann LeCun, working at Bell Labs in the late 1980s, built a robot brain that could read these handwritten numbers automatically.
                <br /><br />
                That robot brain was LeNet-5: the first practical convolutional neural network, deployed at a scale of millions of operations per day. By the mid-1990s, LeCun's system was reading 10% to 20% of all checks written in the United States.
            </Analogy>

            <Analogy label="The Seven Layers — How LeNet-5 Thinks">
                LeNet-5 processes a 32&#215;32 pixel image of a digit through seven layers:
                <br /><br />
                <strong>Layer 1 (C1):</strong> Six magnifying glasses (filters), each 5&#215;5 pixels, slide across the image. One might find vertical edges, another horizontal edges, another diagonal curves. Output: six 28&#215;28 feature maps.
                <br /><br />
                <strong>Layer 2 (S2):</strong> Each feature map is squinted — every 2&#215;2 block is replaced by its average. The maps shrink from 28&#215;28 to 14&#215;14. This makes the features slightly position-tolerant.
                <br /><br />
                <strong>Layer 3 (C3):</strong> Sixteen more magnifying glasses, each looking at combinations of the six S2 maps. They find more complex patterns — curves, corners, loops — the building blocks of digits.
                <br /><br />
                <strong>Layer 4 (S4):</strong> Another squint, shrinking from 10&#215;10 to 5&#215;5.
                <br /><br />
                <strong>Layers 5-6 (C5, F6):</strong> Now the network switches to thinking abstractly — 120 neurons that each consider all 400 values from S4, then 84 neurons combining those, recognising high-level patterns like "this has a loop at the top" or "this has two bumps on the right."
                <br /><br />
                <strong>Layer 7 (Output):</strong> Ten neurons, one per digit, each measuring "how much does this look like my digit?" The winner is the answer.
            </Analogy>

            <Analogy label="Reading with Confidence">
                When LeNet-5 sees the digit "7", here's what happens in plain English:
                <br /><br />
                Layer 1 finds horizontal and diagonal edges. Layer 2 preserves the pattern but makes it robust to small shifts. Layer 3 discovers that there's a long top horizontal stroke and a diagonal line going down — the signature of a "7". By Layer 6, the network has a rich representation: "long top stroke, diagonal, no loops, no curves at bottom." The output neuron for "7" lights up strongly; the one for "1" lights up a little (similar diagonal), and the one for "0" stays dark (no loops match).
            </Analogy>

            <Analogy label="Sixty Thousand Parameters — Why So Few?">
                LeNet-5 has about 60,000 parameters — numbers that are learned from training data. That sounds like a lot, but it's tiny by modern standards (GPT-4 has hundreds of billions of parameters).
                <br /><br />
                The secret is weight sharing: the same filter weights are used at every position in the image. A 5&#215;5 filter has 25 weights. Instead of needing 25 weights per position (28&#215;28 = 784 positions in C1), weight sharing means those same 25 weights detect the pattern everywhere. 25 weights instead of 19,600. That's why the total parameter count is only 60,000 — without weight sharing it would be in the millions.
            </Analogy>

            <Analogy label="The Legacy — Every Phone Uses LeNet's Descendants">
                When you take a photo and your phone automatically identifies that it's a photo of a dog, or when your camera focuses on your face, or when an app reads a restaurant menu for you — all of those are built on the same foundation that LeNet-5 established.
                <br /><br />
                The specific LeNet-5 architecture from 1998 wasn't powerful enough for these tasks. But the blueprint — convolutional filters, pooling, hierarchical feature extraction, fully-connected classification — scaled up with more layers, GPUs, and huge datasets to become the modern CNN. Every image recognition system in every phone and every website traces its ancestry directly to LeNet-5.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>LeNet-5: architecture analysis and parameter accounting</h2>

            <h3>Layer-by-Layer Dimension Analysis</h3>
            <p>
                LeNet-5 takes a 32&#215;32 grayscale image (1,024 values) and transforms it through
                seven computational layers. The output size formula for each convolutional layer:
            </p>
            <MathBlock tex="H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - k}{s} \right\rfloor + 1 \quad \text{(no padding)}" />
            <p>
                With k=5, s=1: 32&#8722;5+1 = 28. With 2&#215;2 average pooling (stride 2): 28/2 = 14.
            </p>

            <h3>Complete Parameter Table</h3>
            <p>
                The LeNet-5 parameter counts, derived from first principles:
            </p>
            <div className="ch-table" style={{ margin: "16px 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: "10px 12px" }}>Layer</th>
                            <th style={{ textAlign: "center", padding: "10px 12px" }}>Output Shape</th>
                            <th style={{ textAlign: "right", padding: "10px 12px" }}>Parameters</th>
                            <th style={{ textAlign: "right", padding: "10px 12px" }}>Formula</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>C1 — Conv</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>6 &#215; 28 &#215; 28</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>156</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>(5&#215;5&#215;1+1)&#215;6</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>S2 — Avg Pool</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>6 &#215; 14 &#215; 14</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>12</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>(1+1)&#215;6</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>C3 — Conv (partial)</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>16 &#215; 10 &#215; 10</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>1,516</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>&#931; n&#7495;&#215;25+1</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>S4 — Avg Pool</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>16 &#215; 5 &#215; 5</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>32</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>(1+1)&#215;16</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>C5 — FC-Conv</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>120</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>48,120</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>(400+1)&#215;120</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>F6 — FC</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>84</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>10,164</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>(120+1)&#215;84</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "9px 12px" }}>Output — RBF</td>
                            <td style={{ textAlign: "center", padding: "9px 12px" }}>10</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>840</td>
                            <td style={{ textAlign: "right", padding: "9px 12px" }}>84&#215;10</td>
                        </tr>
                        <tr style={{ fontWeight: 600 }}>
                            <td style={{ padding: "10px 12px" }}>Total</td>
                            <td></td>
                            <td style={{ textAlign: "right", padding: "10px 12px", color: "#e8a838" }}>60,840</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>The C3 Partial Connection Scheme</h3>
            <p>
                C3's 16 feature maps do not each connect to all 6 S2 maps. LeCun used a specific
                partial connection table (from the 1998 paper):
            </p>
            <ul>
                <li>Maps 0-5: connect to 3 consecutive S2 maps each (60 feature detectors &#215; 25+1 = 1,560 params)</li>
                <li>Maps 6-11: connect to 4 consecutive S2 maps each (and wrap around)</li>
                <li>Maps 12-14: connect to 4 alternating S2 maps</li>
                <li>Map 15: connects to all 6 S2 maps (for global feature)</li>
            </ul>
            <p>
                This partial connectivity forces different C3 feature maps to detect different combinations
                of lower-level features, breaking the symmetry that would cause many maps to converge to
                the same detector. Without it, all 16 maps might learn very similar features, wasting capacity.
            </p>

            <h3>The RBF Output Layer</h3>
            <p>
                The original LeNet-5 used Radial Basis Function units rather than softmax:
            </p>
            <MathBlock tex="y_j = \sum_i (x_i - w_{ji})^2" />
            <p>
                where w&#8336;&#7495; is a bitmap template for digit j (84-bit ASCII-like encoding). Small y&#8336; means
                x is close to the template — a "match." The network minimises the distance to the correct
                class template. Modern implementations replace RBF with softmax+cross-entropy, which
                is equivalent but easier to train.
            </p>

            <h3>Tanh vs. ReLU — Why LeNet Struggled with Depth</h3>
            <p>
                LeNet-5 used tanh activations (max derivative = 1.0). For 7 layers, this was fine.
                But for 10+ layers with tanh: 0.8&#185;&#176; &#8776; 0.1 — gradient factor at layer 1 is already
                one-tenth of its value at the output. With ReLU (derivative = 1 for positive inputs),
                this factor is 1&#185;&#176; = 1 regardless of depth. This is why ReLU-based CNNs (AlexNet, 2012)
                could go to 8 layers with no gradient issues — and why modern 100+ layer networks use
                skip connections to add additional gradient paths.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Why LeNet-5 failed to scale to ImageNet (2010):</strong> MNIST has 60K greyscale
                28&#215;28 images of one type of object (digits). ImageNet has 1.2M colour 224&#215;224 images
                of 1,000 object categories. LeNet-5 on ImageNet would need: (1) 49&#215; more input resolution,
                (2) 3 colour channels, (3) far more feature maps to distinguish 1,000 categories, (4) much
                deeper processing for fine-grained discrimination. All of this requires ReLU to prevent
                gradient vanishing, dropout to prevent overfitting, and GPUs to make training tractable.
                None of these existed in 1998. AlexNet in 2012 was LeNet-5 with all four additions.
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
            <h2>LeNet-5: complete mathematical specification</h2>

            <DefBlock label="LeNet-5 Forward Pass">
                Input X &#8712; &#8477;&#185;&#215;&#179;&#178;&#215;&#179;&#178; (one channel, 32&#215;32):
                <MathBlock tex="\begin{aligned} A^{C1}_{c,i,j} &= \tanh\!\left(\sum_{m,n} W^{C1}_{c,m,n} \cdot X_{i+m,j+n} + b^{C1}_c\right) & c=1,\ldots,6 \\ A^{S2}_{c,i,j} &= \tanh\!\left(w_c \cdot \frac{1}{4}\sum_{p,q \in 2\times2} A^{C1}_{c,2i+p,2j+q} + b_c\right) & \text{(average pool + scale)} \end{aligned}" />
                Note S2's pooling has learnable per-channel scale and bias — different from modern average pooling. C3, S4, C5, F6 follow analogously with the partial connection scheme and tanh non-linearity.
            </DefBlock>

            <h3>Forward Pass Computation Count</h3>
            <p>
                For C1 (6 filters, 5&#215;5 kernel, 28&#215;28 output):
            </p>
            <MathBlock tex="\text{FLOPs}_{C1} = 6 \times 28 \times 28 \times (2 \times 5 \times 5) = 235{,}200" />
            <p>
                Multiplied for all 7 layers, total forward pass: ~340,000 FLOPs. On a 1990s CPU at
                100 MFLOPS, this takes ~3.4 milliseconds — fast enough for real-time check scanning.
            </p>

            <h3>The 84-Dimensional Code</h3>
            <p>
                F6's 84 outputs were designed to match a 7&#215;12 ASCII-like bitmap encoding of each digit:
            </p>
            <MathBlock tex="w_j \in \{-1, +1\}^{84}, \quad j = 0, 1, \ldots, 9" />
            <p>
                The template w&#8336; was a 7&#215;12 grid where +1 means "ink" and -1 means "no ink" for digit j.
                F6's 84 activations were intended to reconstruct the bitmap, and the RBF output measured
                the squared distance between F6 and each template. This was LeCun's approach to structured
                output prediction — the forerunner of modern structured output models.
            </p>

            <h3>Why Average Pooling, Not Max Pooling?</h3>
            <p>
                LeNet-5 used average pooling: each 2&#215;2 block is replaced by its mean, then scaled and
                bias-shifted with learnable parameters. This was a deliberate choice: average pooling
                is linear and differentiable everywhere, making analysis easier. Max pooling is piecewise
                linear and more commonly used today because it provides stronger feature selection (keeping
                only the strongest activation in each region). Modern networks (VGG, ResNet, AlexNet) all
                use max pooling — the one clear architectural improvement over LeNet-5.
            </p>

            <div className="ch-callout">
                <strong>Connection to modern architectures:</strong> The LeNet-5 pattern
                (conv&#8594;pool&#8594;conv&#8594;pool&#8594;fc&#8594;fc&#8594;output) maps directly to ResNet's backbone
                (stem&#8594;stage1&#8594;stage2&#8594;stage3&#8594;stage4&#8594;global avg pool&#8594;fc) — the same
                structural template with more layers and ResNet's skip connections. The key difference
                is that modern CNNs are much deeper (50-200 layers vs. 7) and wider (thousands of channels
                vs. 16), enabled by ReLU and residual connections.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet5(nn.Module):
    """
    LeNet-5 faithful implementation (LeCun et al., 1998).

    Architecture:
      Input: 1 x 32 x 32 (grayscale)
      C1:  Conv(1->6, 5x5)     -> tanh -> 6 x 28 x 28
      S2:  AvgPool(2x2, s=2)   ->         6 x 14 x 14
      C3:  Conv(6->16, 5x5)    -> tanh -> 16 x 10 x 10
      S4:  AvgPool(2x2, s=2)   ->         16 x 5 x 5
      C5:  Conv(16->120, 5x5)  -> tanh -> 120 x 1 x 1 (effectively FC)
      F6:  Linear(120->84)     -> tanh -> 84
      Out: Linear(84->10)      ->         10
    """

    def __init__(self, num_classes=10):
        super().__init__()
        # Feature extraction
        self.C1 = nn.Conv2d(1,  6,   kernel_size=5)
        self.S2 = nn.AvgPool2d(kernel_size=2, stride=2)
        self.C3 = nn.Conv2d(6,  16,  kernel_size=5)
        self.S4 = nn.AvgPool2d(kernel_size=2, stride=2)
        self.C5 = nn.Conv2d(16, 120, kernel_size=5)  # reduces 5x5 -> 1x1
        # Classification
        self.F6  = nn.Linear(120, 84)
        self.out = nn.Linear(84, num_classes)

    def forward(self, x):
        # x: (B, 1, 32, 32)
        x = torch.tanh(self.C1(x))  # (B,  6, 28, 28)
        x = self.S2(x)               # (B,  6, 14, 14)
        x = torch.tanh(self.C3(x))  # (B, 16, 10, 10)
        x = self.S4(x)               # (B, 16,  5,  5)
        x = torch.tanh(self.C5(x))  # (B, 120, 1,  1)
        x = x.view(x.size(0), -1)   # (B, 120)
        x = torch.tanh(self.F6(x))  # (B, 84)
        x = self.out(x)              # (B, 10)
        return x


class ModernLeNet5(nn.Module):
    """
    LeNet-5 upgraded with modern techniques:
    - ReLU instead of tanh (no vanishing gradient)
    - MaxPool instead of AvgPool (stronger selection)
    - Dropout (regularisation)
    - Softmax cross-entropy instead of RBF
    """

    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 6, 5), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(6, 16, 5), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 120, 5), nn.ReLU(),
        )
        self.classifier = nn.Sequential(
            nn.Linear(120, 84), nn.ReLU(), nn.Dropout(0.5),
            nn.Linear(84, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)


if __name__ == "__main__":
    # Count parameters
    model = LeNet5()
    n_params = sum(p.numel() for p in model.parameters())
    print(f"LeNet-5 total parameters: {n_params:,}")
    # Should be ~60,840

    x = torch.randn(4, 1, 32, 32)
    logits = model(x)
    print(f"Output shape: {logits.shape}")   # [4, 10]

    # Compare with modern version
    modern = ModernLeNet5()
    modern_params = sum(p.numel() for p in modern.parameters())
    print(f"Modern LeNet-5 parameters: {modern_params:,}")

    # Layer-by-layer shapes
    print("\\nLayer-by-layer activations (LeNet-5):")
    model2 = LeNet5()
    x = torch.randn(1, 1, 32, 32)
    with torch.no_grad():
        x1 = model2.C1(x)
        print(f"  After C1: {x1.shape}")
        x2 = model2.S2(x1)
        print(f"  After S2: {x2.shape}")
        x3 = model2.C3(x2)
        print(f"  After C3: {x3.shape}")
        x4 = model2.S4(x3)
        print(f"  After S4: {x4.shape}")
        x5 = model2.C5(x4)
        print(f"  After C5: {x5.shape}")
        x5f = x5.view(1, -1)
        print(f"  Flattened: {x5f.shape}")
        x6 = model2.F6(x5f)
        print(f"  After F6: {x6.shape}")`

function PythonContent() {
    return (
        <>
            <p>
                Faithful PyTorch implementation of LeNet-5 (1998) alongside a modern version with
                ReLU, MaxPool, and Dropout. The original uses tanh and average pooling; the modern
                version trains faster and achieves higher accuracy due to better gradient flow and
                regularisation.
            </p>
            <CodeBlock code={PY_CODE} filename="lenet5.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Historical note:</strong> The original LeNet-5 used an RBF output layer
                with ASCII-like digit templates, not softmax. Modern training replaces this with
                <code>nn.CrossEntropyLoss()</code>, which is equivalent but much easier to train
                and generalises to arbitrary label sets.
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
