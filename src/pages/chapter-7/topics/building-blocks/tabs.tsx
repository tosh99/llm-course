import { Analogy, CodeBlock, DefBlock, InlineMath, MathBlock } from "../../shared"
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
            year: "1980–1998",
            title: "Convolution — The Core Operation",
            challenge:
                "The fundamental question for image processing was: what is the right operation for detecting local patterns in images? Fully-connected layers are too general — they make no assumption about spatial structure. Hand-crafted filters (Sobel, Laplacian, Gabor) were effective but required domain expertise. The challenge was to find an operation that was both mathematically principled and learnable from data.",
            what: "The sliding dot product — convolution — emerged as the answer. A small kernel K slides across the input, computing the dot product at each position. This single operation captures both local connectivity (the kernel sees only a small patch) and weight sharing (the same kernel applies everywhere). The mathematical form is (X &#42; K)[i,j] = &#931;&#7490;,&#7491; X[i+m,j+n] &#183; K[m,n] + b. LeNet-5 established the 5&#215;5 kernel as the standard; VGGNet's 2014 result showing 3&#215;3 stacks outperform larger kernels changed the field's default to 3&#215;3 for all subsequent architectures.",
            impact:
                "Convolution is the defining operation of CNNs. It is computationally efficient (implemented as matrix multiplication via im2col transforms), parallelisable on GPUs, and learnable by gradient descent. Every operation in modern CNN architectures — depthwise convolution, dilated convolution, transposed convolution, 1&#215;1 convolution — is a variant or combination of the basic 2D convolution.",
        },
        {
            year: "1980–2012",
            title: "Pooling — Spatial Aggregation and Translation Tolerance",
            challenge:
                "Convolutional layers produce feature maps that are equivariant to translation — the feature map shifts when the input shifts. For classification, we need approximate invariance: a cat in the top-left and a cat in the bottom-right should produce the same output label. The challenge was to reduce the sensitivity to small spatial variations while preserving the essential feature information.",
            what: "Fukushima's neocognitron used spatial pooling (C-cells pooling over S-cells) in 1980. LeNet-5 formalised average pooling in 1998. AlexNet (2012) used max pooling and showed it outperformed average pooling for classification. Max pooling takes the maximum value in each k&#215;k window: this selects the strongest feature activation in each region, making the representation invariant to small shifts within the pooling window. Global Average Pooling (GAP), introduced in Network in Network (Lin et al., 2013), replaces the final fully-connected layers with a per-channel average, reducing parameters dramatically.",
            impact:
                "Max pooling became standard in all major CNN architectures from AlexNet through ResNet. Global Average Pooling replaced the parameter-heavy FC layers in GoogLeNet, ResNet, and all subsequent architectures — reducing parameters by millions and improving generalisation. The evolution from average pool (LeNet) to max pool (AlexNet) to global average pool (ResNet) represents a steady refinement of the spatial aggregation strategy.",
        },
        {
            year: "2010–2011",
            title: "ReLU — The Non-linearity That Unlocked Depth",
            challenge:
                "LeNet-5 and all early CNNs used tanh or sigmoid activations. For 5-7 layer networks, these worked acceptably. But as researchers tried to build deeper networks (10+ layers), the vanishing gradient problem from the deep feedforward literature reappeared: tanh derivatives can be much less than 1, causing gradients to shrink at every layer. Initialisation tricks helped but did not fully solve the problem for very deep networks.",
            what: "Nair and Hinton (2010) showed that Rectified Linear Units (ReLU, f(x) = max(0,x)) dramatically accelerated training of restricted Boltzmann machines. Glorot, Bordes, and Bengio (2011) analysed ReLU's properties for deep networks: ReLU has gradient exactly 1 for positive inputs (no vanishing) and exactly 0 for negative inputs (sparse activation). Their paper 'Deep Sparse Rectifier Neural Networks' showed that ReLU networks train faster and achieve higher accuracy than tanh networks. AlexNet (2012) used ReLU throughout, citing 6x training speedup over tanh.",
            impact:
                "ReLU is now the default activation in virtually all deep learning models. Its success comes from three properties: (1) gradient is 1 (not less than 1) for positive inputs, preventing gradient vanishing in deep networks; (2) computation is a simple max operation, much cheaper than exponentials in sigmoid/tanh; (3) sparse activation (roughly half of neurons output zero) provides implicit regularisation. Variants (Leaky ReLU, ELU, GELU, SiLU) address ReLU's dying neuron problem while preserving its speed and gradient-flow advantages.",
        },
        {
            year: "2015",
            title: "Batch Normalisation — Training Stability and Deeper Networks",
            challenge:
                "Even with ReLU activations, training very deep CNNs (20+ layers) was unstable. The distribution of layer inputs shifted as parameters updated — a phenomenon Ioffe and Szegedy called 'internal covariate shift.' This required careful learning rate tuning, good initialisation, and slow training. Researchers wanted a way to train networks 10-100 layers deep without this instability.",
            what: "Ioffe and Szegedy published 'Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift' (2015). Batch normalisation normalises the activations within each mini-batch to zero mean and unit variance, then applies learnable scale &#947; and shift &#946; parameters: BN(x) = &#947;(x &#8722; &#956;)/&#963; + &#946;. This is applied after each convolutional layer (or linear layer) and before the activation. The normalisation stabilises the distribution of pre-activations, allowing larger learning rates and reducing sensitivity to initialisation.",
            impact:
                "Batch normalisation is now a standard component of nearly every deep CNN. It allows training networks 10-100&#215; deeper than was practical before, reduces the need for careful initialisation, acts as a regulariser (reducing the need for dropout in some settings), and speeds up training by 2-10&#215;. ResNet, DenseNet, EfficientNet, and virtually every modern architecture include batch normalisation after every convolutional layer. It is arguably the most impactful single improvement to CNN training since ReLU.",
        },
        {
            year: "1989–Present",
            title: "Flatten and Fully-Connected — The Classification Head",
            challenge:
                "After extracting spatial features through convolutional and pooling layers, a CNN must produce a fixed-size class probability vector. The spatial feature maps (e.g., 7&#215;7&#215;512 for a ResNet on ImageNet) must be collapsed into a single classification decision. The challenge is to do this efficiently without introducing too many parameters or losing too much spatial information.",
            what: "Early CNNs (LeNet-5) flattened the final feature maps to a vector and processed them through two or three fully-connected layers. This works but is expensive: a 7&#215;7&#215;512 feature map flattened to 25,088 values, connected to 4,096 FC neurons, requires 102 million parameters — more than the entire convolutional backbone. Global Average Pooling (Lin et al., 2013) averages each 7&#215;7 map to a single value, producing a 512-dimensional vector directly connectable to the output layer. This reduces the classification head from 100M parameters to 512&#215;1000 = 512,000 — a 200&#215; reduction.",
            impact:
                "Modern CNNs use Global Average Pooling as the bridge between the convolutional backbone and the classification head. This eliminates millions of parameters, reduces overfitting, and makes the network size-agnostic at inference time (the same network can classify any size image). ResNet, GoogLeNet, MobileNet, and EfficientNet all use GAP before the final linear layer. The fully-connected classification head from LeNet-5 survives only in older architectures like AlexNet and VGG.",
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
            <h2>The LEGO bricks of convolutional networks</h2>

            <Analogy label="The Magnifying Glass — Convolution">
                The heart of every CNN is the convolution operation. Imagine you have a small magnifying glass — say 3 pixels by 3 pixels. You place it on the top-left corner of an image and ask: "how much does this tiny patch match the pattern I'm looking for?" You write down the answer, move the glass one pixel to the right, and repeat — all the way across and down the image.
                <br /><br />
                The "pattern you're looking for" is encoded in the 9 numbers of your 3&#215;3 filter. If those numbers describe a horizontal edge, the glass lights up wherever there's a horizontal edge. The result — a new image showing where the pattern appears — is called a <strong>feature map</strong>. One layer of convolution produces many feature maps, one per filter learned.
            </Analogy>

            <Analogy label="The Squinting Step — Pooling">
                After finding where patterns are, CNNs typically squint — they look at small blocks of the feature map and keep only the most important value. For <strong>max pooling</strong>, you keep the largest value in each 2&#215;2 block. For <strong>average pooling</strong>, you keep the average.
                <br /><br />
                Why squint? Two reasons: (1) it makes the feature map smaller, reducing computation for all subsequent layers; and (2) it makes the representation less sensitive to exact position — if a pattern moves 1 pixel, the max in a 2&#215;2 block might stay the same. Squinting gives approximate position tolerance without losing the important "where is the pattern?" information.
            </Analogy>

            <Analogy label="The On-Off Switch — ReLU Activation">
                After each convolution, every value in the feature map goes through an <strong>activation function</strong>. The most popular one, ReLU, is beautifully simple: if the value is positive, keep it exactly; if it's negative, replace it with zero.
                <br /><br />
                f(x) = max(0, x). That's it.
                <br /><br />
                Why does this simple rule matter so much? Because negative values mean "the pattern is absent here" and positive values mean "the pattern is present here." ReLU says: "I only care about where patterns are detected, not about how absent they are." It also has a crucial mathematical property: the gradient is exactly 1 for positive values, not some fraction — so deep networks can learn without the gradient shrinking to zero.
            </Analogy>

            <Analogy label="The Librarian — Batch Normalisation">
                Imagine a library where books arrive in random order — sometimes 100 tiny books, sometimes 5 enormous books. If you try to sort them without organising first, everything becomes chaotic.
                <br /><br />
                <strong>Batch normalisation</strong> is like a librarian who standardises everything before it goes on the shelf: every batch of activations gets rescaled so the average is 0 and the spread is 1. Then the network can apply its own custom scale and shift. This keeps the statistics of each layer's inputs stable throughout training, allowing larger learning rates and faster convergence.
            </Analogy>

            <Analogy label="The Final Decision — Flatten, Pool, and Classify">
                After many convolution-pool-ReLU-BatchNorm blocks, you have a set of feature maps that describe what patterns appear where in the image. Now you need a final answer: "what is this image?"
                <br /><br />
                Modern CNNs use <strong>Global Average Pooling</strong>: for each feature map, compute the average value over its entire spatial extent. If you have 512 feature maps, you end up with 512 numbers — one representing how strongly each feature was present anywhere in the image. Then a single fully-connected layer takes those 512 numbers and produces class probabilities.
                <br /><br />
                The classic pattern: many Conv-Pool-ReLU blocks (the backbone), then Global Average Pooling (collapse space), then one Linear layer (classify). That's the recipe for ResNet, EfficientNet, and every modern CNN.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The operations that compose a complete convolutional network</h2>

            <h3>1. The Convolution Operation</h3>
            <p>
                For a multi-channel input X &#8712; &#8477;&#8314;&#215;&#8544;&#215;&#8310;&#7495;&#7510; and C&#7506;&#7512;&#7511; filters each of size k&#215;k, the output feature map for channel c:
            </p>
            <MathBlock tex="Y^{(c)}[i,j] = \sum_{c'=1}^{C_{\text{in}}} \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} X^{(c')}[i \cdot s + m,\; j \cdot s + n] \cdot K^{(c,c')}[m,n] + b^{(c)}" />
            <p>
                Key hyperparameters:
            </p>
            <ul>
                <li><strong>Kernel size k:</strong> 3&#215;3 is standard (most compute-efficient; two 3&#215;3 layers = one 5&#215;5 receptive field with fewer params)</li>
                <li><strong>Stride s:</strong> step size of the sliding window. s=1 preserves spatial size; s=2 halves it</li>
                <li><strong>Padding p:</strong> zeros added to border. p=(k-1)/2 gives "same" padding — output same size as input for s=1</li>
                <li><strong>Output size:</strong> <InlineMath tex="H_{\text{out}} = \lfloor (H + 2p - k)/s \rfloor + 1" /></li>
            </ul>

            <h3>2. Max Pooling</h3>
            <p>
                For a pool size p and stride s:
            </p>
            <MathBlock tex="\text{MaxPool}(X)[i,j] = \max_{0 \leq m,n &lt; p} X[i \cdot s + m,\; j \cdot s + n]" />
            <p>
                No learnable parameters. The gradient flows back to the position of the maximum value
                only — all other positions receive zero gradient. This is the "winner-take-all" property.
                Standard: p=2, s=2 (halves spatial dimensions). Global Average Pooling: p=H, s=1
                (reduces entire feature map to one value per channel).
            </p>

            <h3>3. ReLU Activation</h3>
            <MathBlock tex="\text{ReLU}(x) = \max(0, x), \quad \text{ReLU}'(x) = \begin{cases} 1 & x > 0 \\ 0 & x \leq 0 \end{cases}" />
            <p>
                The gradient is always exactly 0 or 1 — no exponential decay over layers. For a
                k-layer network, the gradient at layer 1 from a loss at layer k passes through k ReLU
                derivatives: if all activations are positive, the gradient is 1&#1089; = 1, unchanged.
                Compare to tanh: (0.7)&#1089; for k=20 gives &#8776; 0.0008.
            </p>

            <h3>4. Batch Normalisation</h3>
            <p>
                For a batch of N samples, BN normalises the activation at each spatial position and channel:
            </p>
            <MathBlock tex="\hat{x} = \frac{x - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \quad y = \gamma \hat{x} + \beta" />
            <p>
                where &#956;&#8335; = (1/N)&#931;&#7495;x&#7495; and &#963;&#178;&#8335; = (1/N)&#931;&#7495;(x&#7495; &#8722; &#956;&#8335;)&#178; are batch statistics.
                &#947; and &#946; are learnable scale and shift parameters (per channel). At inference, running
                statistics (computed during training) replace batch statistics.
            </p>

            <h3>5. The Modern CNN Block Pattern</h3>
            <p>
                The standard building block in modern CNNs (ResNet, EfficientNet, ConvNeXt):
            </p>
            <MathBlock tex="\text{Block}(x) = \text{Conv} \to \text{BN} \to \text{ReLU} \to \text{Conv} \to \text{BN} \to \text{ReLU}" />
            <p>
                In ResNet, this becomes a residual block:
            </p>
            <MathBlock tex="\text{ResBlock}(x) = x + \text{Block}(x)" />
            <p>
                The skip connection x ensures a direct gradient path from output to input, solving
                the vanishing gradient for very deep networks (100+ layers).
            </p>

            <h3>Receptive Field Growth</h3>
            <p>
                For n stacked 3&#215;3 convolutions with stride 1, the receptive field at layer n is:
            </p>
            <MathBlock tex="RF(n) = 2n + 1" />
            <p>
                Each pooling layer with stride 2 doubles the effective receptive field. After 5 conv
                layers and 2 pool layers in VGG-16: RF &#8776; 11 &#215; 4 = 44 pixels. After all layers of
                ResNet-50: RF &#8776; 483 pixels — almost the entire 224&#215;224 input.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The minimal CNN vocabulary:</strong> Every modern convolutional network, from LeNet-5 to GPT-4V's image encoder, is composed of five operation types: Conv2d (spatial feature detection), ReLU (non-linearity and gradient stability), BatchNorm (training stability), MaxPool or AvgPool (spatial aggregation), and Linear (final classification). Understanding these five operations in detail gives you the conceptual vocabulary to read and understand any CNN architecture paper.
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
            <h2>Formal analysis of CNN building blocks</h2>

            <DefBlock label="Parameter Count for a Convolutional Layer">
                For C&#7495;&#7510; input channels, C&#7506;&#7512;&#7511; output channels, kernel size k&#215;k:
                <MathBlock tex="\text{Parameters} = \underbrace{k^2 \cdot C_{\text{in}} \cdot C_{\text{out}}}_{\text{weights}} + \underbrace{C_{\text{out}}}_{\text{biases}} = C_{\text{out}}(k^2 C_{\text{in}} + 1)" />
                For a 3&#215;3 conv with 64 input and 128 output channels: (9&#215;64+1)&#215;128 = 73,856 params.
                Compare to a fully-connected layer with the same spatial feature maps as input/output:
                <MathBlock tex="\text{FC Parameters} = H_{\text{in}} \cdot W_{\text{in}} \cdot C_{\text{in}} \cdot H_{\text{out}} \cdot W_{\text{out}} \cdot C_{\text{out}} \gg k^2 \cdot C_{\text{in}} \cdot C_{\text{out}}" />
            </DefBlock>

            <h3>Batch Normalisation — Gradient Analysis</h3>
            <p>
                The key effect of BN on gradient flow: for a loss &#8466; and pre-normalised activation x:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial x_i} = \frac{\gamma}{\sqrt{\sigma^2 + \epsilon}} \left(\frac{\partial \mathcal{L}}{\partial \hat{x}_i} - \frac{1}{N}\sum_j \frac{\partial \mathcal{L}}{\partial \hat{x}_j} - \frac{\hat{x}_i}{N}\sum_j \frac{\partial \mathcal{L}}{\partial \hat{x}_j} \hat{x}_j \right)" />
            <p>
                The term 1/&#8730;(&#963;&#178;+&#949;) scales the gradient by the inverse of the activation's standard
                deviation. If activations become very large (&#963;&#178; &#8811; 1), the gradient is automatically
                scaled down — preventing gradient explosion. If activations collapse (&#963;&#178; &#8594; 0), the
                gradient is scaled up — preventing gradient vanishing. BN provides automatic gradient
                magnitude control at every layer.
            </p>

            <h3>Depthwise Separable Convolution (MobileNet)</h3>
            <p>
                Standard convolution: (k&#178; &#183; C&#7495;&#7510; + 1) &#183; C&#7506;&#7512;&#7511; parameters. Depthwise separable convolution
                factorises this into two operations:
            </p>
            <MathBlock tex="\text{Depthwise: } k^2 \cdot C_{\text{in}} \text{ params} \quad + \quad \text{Pointwise: } C_{\text{in}} \cdot C_{\text{out}} \text{ params}" />
            <p>
                Total: k&#178; &#183; C&#7495;&#7510; + C&#7495;&#7510; &#183; C&#7506;&#7512;&#7511; = C&#7495;&#7510;(k&#178; + C&#7506;&#7512;&#7511;). For k=3, C&#7495;&#7510; = C&#7506;&#7512;&#7511; = 128:
                128&#215;(9+128) = 17,536 vs. 73,856 — a 4.2&#215; reduction. MobileNet uses depthwise
                separable convolution throughout, achieving 8-9&#215; overall parameter reduction
                with less than 1% accuracy loss on ImageNet.
            </p>

            <h3>Dilated Convolution</h3>
            <p>
                With dilation factor d, the kernel has holes inserted between elements:
            </p>
            <MathBlock tex="(X *_d K)[i,j] = \sum_{m,n} X[i + d \cdot m,\; j + d \cdot n] \cdot K[m,n]" />
            <p>
                A 3&#215;3 kernel with dilation d=2 has the same parameter count as a normal 3&#215;3 kernel
                but an effective receptive field of 5&#215;5 (skipping every other pixel). This allows
                large receptive fields without additional parameters — used extensively in semantic
                segmentation (DeepLab) and speech processing (WaveNet).
            </p>

            <div className="ch-callout">
                <strong>The 1&#215;1 convolution:</strong> A 1&#215;1 convolutional filter with k=1 is simply a
                linear projection of the channel dimension: for each spatial position (i,j),
                it applies an n&#7506;&#7512;&#7511;&#215;n&#7495;&#7510; linear transformation. With no spatial mixing, 1&#215;1 convs
                serve as channel projections: increasing channels (bottleneck expansion), decreasing
                channels (dimensionality reduction), and non-linear channel mixing when paired with ReLU.
                GoogLeNet's Inception modules use 1&#215;1 convs extensively to reduce channel count before
                expensive 3&#215;3 and 5&#215;5 operations. They are also key to ResNet's bottleneck blocks.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Standard CNN Building Block ────────────────────────────────────────────────
class ConvBNReLU(nn.Module):
    """Conv2d -> BatchNorm2d -> ReLU (the standard modern block)."""

    def __init__(self, in_ch, out_ch, kernel=3, stride=1, padding=1):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, kernel, stride=stride,
                      padding=padding, bias=False),  # bias=False with BN
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.block(x)


# ── ResNet-style Residual Block ────────────────────────────────────────────────
class ResBlock(nn.Module):
    """Residual block: x + F(x)"""

    def __init__(self, channels):
        super().__init__()
        self.body = nn.Sequential(
            ConvBNReLU(channels, channels, 3, padding=1),
            nn.Conv2d(channels, channels, 3, padding=1, bias=False),
            nn.BatchNorm2d(channels),
        )
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        return self.relu(x + self.body(x))  # skip connection!


# ── Depthwise Separable Convolution ───────────────────────────────────────────
class DepthwiseSeparable(nn.Module):
    """Depthwise + Pointwise: parameter-efficient alternative to Conv2d."""

    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        # Depthwise: each channel separately
        self.dw = nn.Conv2d(in_ch, in_ch, 3, stride=stride,
                             padding=1, groups=in_ch, bias=False)
        self.dw_bn = nn.BatchNorm2d(in_ch)
        # Pointwise: 1x1 to mix channels
        self.pw = nn.Conv2d(in_ch, out_ch, 1, bias=False)
        self.pw_bn = nn.BatchNorm2d(out_ch)

    def forward(self, x):
        x = F.relu(self.dw_bn(self.dw(x)))
        x = F.relu(self.pw_bn(self.pw(x)))
        return x


# ── Demo: Parameter comparison ─────────────────────────────────────────────────
in_ch, out_ch = 64, 128

# Standard Conv2d
std_conv = nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False)
std_params = sum(p.numel() for p in std_conv.parameters())

# Depthwise Separable
dws = DepthwiseSeparable(in_ch, out_ch)
dws_params = sum(p.numel() for p in dws.parameters())

print("Parameter comparison (64 -> 128 channels, 3x3):")
print(f"  Standard Conv2d:       {std_params:8,} params")
print(f"  Depthwise Separable:   {dws_params:8,} params")
print(f"  Reduction:             {std_params / dws_params:.1f}x")
print()

# Test shapes
x = torch.randn(2, 64, 32, 32)   # batch=2, 64ch, 32x32
print("Shape progression through blocks:")
print(f"  Input:         {x.shape}")

# ConvBNReLU (stride 1, same size)
block = ConvBNReLU(64, 64, stride=1)
y = block(x)
print(f"  ConvBNReLU:    {y.shape}")

# ResBlock (preserves channels and spatial dims)
res = ResBlock(64)
y2 = res(x)
print(f"  ResBlock:      {y2.shape}")

# Max pool (halves spatial dims)
pool = nn.MaxPool2d(2, 2)
y3 = pool(x)
print(f"  MaxPool(2,2):  {y3.shape}")

# Global Average Pooling (collapses spatial to 1x1)
gap = nn.AdaptiveAvgPool2d(1)
y4 = gap(x)
print(f"  GlobalAvgPool: {y4.shape}")

y5 = y4.view(y4.size(0), -1)
print(f"  After flatten: {y5.shape}")

# Classification head
fc = nn.Linear(64, 10)
logits = fc(y5)
print(f"  After FC:      {logits.shape}")

print()
print("Standard modern CNN pattern:")
print("  [ConvBNReLU -> ConvBNReLU -> MaxPool] x N")
print("  -> GlobalAvgPool -> Linear -> Softmax")`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementations of all five CNN building blocks: the Conv-BN-ReLU stack,
                a ResNet-style residual block, depthwise separable convolution, and a demonstration
                of shape progression and parameter efficiency comparison.
            </p>
            <CodeBlock code={PY_CODE} filename="cnn_blocks.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Note:</strong> When using BatchNorm, set <code>bias=False</code> in Conv2d
                — the BatchNorm layer's shift parameter &#946; serves the same purpose as the conv bias.
                Including both wastes parameters and doesn't improve performance.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const BUILDING_BLOCKS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
