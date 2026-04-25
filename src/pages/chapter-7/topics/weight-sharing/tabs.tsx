import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

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
            year: "1959–1962",
            title: "Hubel &amp; Wiesel — Local Receptive Fields in Biology",
            challenge:
                "Before Hubel and Wiesel, the dominant model of visual processing was essentially fully-connected: it was assumed that each neuron in the visual cortex received input from many or all parts of the visual field. Under this model, weight sharing was not a natural concept — each neuron had its own unique set of weights for its position in the field. The challenge was that this model couldn't account for how animals recognised objects independently of their position in the visual field.",
            what: "Hubel and Wiesel discovered that neurons in primary visual cortex (V1) respond to stimuli only within a small spatial region — their local receptive field. Simple cells respond to edges in specific orientations within that region; complex cells pool the responses of simple cells with the same preferred orientation across a small neighbourhood, making them position-tolerant within that neighbourhood. Crucially, the orientation preference is the same for all simple cells — the cortex uses the same edge-detection logic everywhere, just oriented differently at different positions.",
            impact:
                "The biological discovery of local receptive fields with shared feature preferences was the direct inspiration for CNN weight sharing. If evolution found it beneficial for the brain to reuse the same edge-detection logic across all spatial positions, this was strong evidence that position-independent feature detection was a powerful inductive bias for vision. LeCun has explicitly cited Hubel-Wiesel as the primary inspiration for the CNN architecture.",
        },
        {
            year: "1980",
            title: "Fukushima — The Neocognitron and Explicit Weight Sharing",
            challenge:
                "Before Fukushima's neocognitron, pattern recognition networks used position-specific weights: a network trained to recognise a '3' in the center of an image had to re-learn everything to recognise the same '3' slightly to the left. There was no mechanism for position-invariant recognition — a fundamental requirement for practical visual systems, which must recognise objects regardless of their location in the image.",
            what: "Fukushima's 1980 neocognitron was the first computational implementation of weight sharing. In his architecture, all simple-cell units at a given depth detecting the same feature type shared identical weights — the same filter was 'replicated' at every spatial position. This is exactly parameter sharing in modern CNNs. Fukushima called this 'S-cell planes': each plane was defined by a single prototype pattern (the filter), and every unit in the plane detected that pattern at its specific location. The weights within a plane were constrained to be identical.",
            impact:
                "The neocognitron proved that weight sharing was computationally tractable and produced pattern recognition networks with position tolerance. Without backpropagation, Fukushima trained his network using unsupervised competitive learning, which limited the quality of learned features. But the structural principle — one filter pattern, many positions — was established and would be refined into the modern CNN by LeCun's backpropagation-trained version nine years later.",
        },
        {
            year: "1989",
            title: "LeCun — Deriving the Shared-Weight Gradient",
            challenge:
                "Applying backpropagation to a weight-sharing architecture required solving a mathematical subtlety: since the same weight appears at multiple positions in the forward computation, the gradient for that weight is the sum of contributions from all positions where it was used. This is not how gradients are computed in a standard feedforward network, where each weight appears in exactly one multiplication in the forward pass.",
            what: "LeCun's 1989 paper explicitly derived this shared-weight gradient. For a convolutional layer where filter weight K[m,n] is used at every output position (i,j), the gradient is: &#8706;&#8466;/&#8706;K[m,n] = &#931;&#7495;,&#8322; (&#948;Y[i,j] &#215; X[i+m, j+n]). This is the cross-correlation of the incoming error gradient &#948;Y with the input X — itself a convolution-like operation. LeCun implemented this gradient correctly in C code and verified that it matched finite-difference approximations, confirming the derivation was correct.",
            impact:
                "Correct shared-weight gradient computation is what makes CNN training possible. Without it, you cannot update the filter weights correctly from data. LeCun's derivation opened the door to learning filters automatically from labelled examples, replacing Fukushima's hand-set or unsupervised-learned filters with discriminatively trained ones — which are always superior for classification tasks.",
        },
        {
            year: "1989–1998",
            title: "LeCun and Bell Labs — From Zip Codes to Checks",
            challenge:
                "After proving the concept on zip code recognition, the question was whether the weight-sharing architecture could scale to practical deployment. Millions of letters were processed daily by postal services, and millions of checks were handled by banks. Both required character recognition at high speed and accuracy, with limited computation (early 1990s hardware was far slower than today). The architecture needed to be efficient enough to run on the hardware of the era.",
            what: "Between 1989 and 1998, LeCun and collaborators at Bell Labs refined the convolutional architecture for commercial deployment. The key insight was that weight sharing not only reduced parameters (making the network trainable with less data) but also made inference faster: a convolution operation can be implemented as a sliding window with the same filter, which is highly parallelisable and cache-efficient on 1990s hardware. By 1998, the LeNet-5 system (a cleaned-up, larger version of the 1989 network) was processing over 10% of all checks written in the United States at that time.",
            impact:
                "The successful deployment validated weight sharing as an engineering choice, not just a theoretical one. The weight-sharing constraint reduced the parameter count of the zip-code network from millions (if fully connected) to tens of thousands, making it both trainable and fast enough for real-time processing on 1990s hardware. This demonstrated that inductive biases (structural assumptions about the problem) could be encoded in the architecture to make learning dramatically more efficient.",
        },
        {
            year: "2012–2015",
            title: "AlexNet, VGG, GoogLeNet — Weight Sharing at Scale",
            challenge:
                "After the 2012 AlexNet breakthrough, the question was how to design better CNN architectures. All of them used weight sharing — the question was how many filters, what sizes, how deep. The field needed systematic exploration of the design space to understand which architectural choices mattered most.",
            what: "VGGNet (Simonyan and Zisserman, 2014) showed that using many small (3&#215;3) filters stacked deep was more effective than using fewer large filters. Stacking two 3&#215;3 filters gives a 5&#215;5 effective receptive field with 2&#215;(3&#215;3&#215;C&#178;) = 18C&#178; parameters versus one 5&#215;5 filter's 25C&#178; parameters — fewer parameters, more non-linearity, better performance. GoogLeNet introduced parallel filter banks (Inception modules) with 1&#215;1, 3&#215;3, and 5&#215;5 filters at the same level, allowing the network to capture patterns at multiple scales simultaneously.",
            impact:
                "The systematic exploration of CNN architectures confirmed that weight sharing is the essential mechanism — the specific filter sizes and depths are secondary. All competitive architectures from 2012 to the present use weight sharing throughout their convolutional layers. The principle that the same detector should apply everywhere in an image — first articulated biologically by Hubel-Wiesel and computationally by Fukushima — proved to be the single most important architectural decision in visual recognition.",
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
            <h2>The same glasses everywhere — why sharing weights is genius</h2>

            <Analogy label="The Magic Glasses Analogy">
                Imagine you have special glasses that help you find stripes. You put on the glasses and look at a photo of a zebra. The stripes light up! Now here's the cool part: the glasses work the same whether the zebra is in the top-left, the middle, or the bottom-right of the photo. You don't need different glasses for different parts of the image.
                <br /><br />
                That's <strong>weight sharing</strong> in a nutshell. The same "glasses" (the filter weights) are used everywhere in the image. One set of 9 numbers (for a 3&#215;3 filter) detects stripes at every single location in the photo.
            </Analogy>

            <Analogy label="Why Without Sharing Is Crazy">
                Imagine if you needed different glasses for each tiny patch of the image:
                <br /><br />
                &bull; Glasses for the top-left 3&#215;3 patch? Need 9 special numbers.<br />
                &bull; Glasses for the patch one pixel to the right? Need 9 different numbers.<br />
                &bull; And so on, for all 224&#215;224 = 50,176 patches...
                <br /><br />
                Without weight sharing, you'd need 50,176 &#215; 9 = 451,584 numbers just to detect one type of pattern. With weight sharing, you need exactly 9. That's a 50,000-fold reduction! And you still detect the pattern equally well everywhere.
            </Analogy>

            <Analogy label="Your Brain Does This Too">
                This isn't just a clever trick — your brain does the exact same thing! Scientists Hubel and Wiesel discovered in 1959 that the neurons in your visual cortex have two jobs: (1) detect a simple feature like a horizontal edge, and (2) do it everywhere in your field of view.
                <br /><br />
                The same neural "program" runs across your entire visual field. That's why you recognise a cat whether it's in the corner of your eye or right in the center — your visual cortex uses the same feature detectors everywhere. CNNs copied this design from your brain.
            </Analogy>

            <Analogy label="Position Doesn't Change What Something Is">
                Think about the letter "A". It's an "A" whether you write it big or small, left or right, upside down (well, almost). The essential pattern — two diagonal lines meeting at the top with a horizontal bar — is the same regardless of where on the page it appears.
                <br /><br />
                A neural network without weight sharing has to separately learn that "A" at position (100, 50) and "A" at position (200, 150) are the same letter. With weight sharing, the same filter detects the "A" pattern everywhere, so the network only has to learn the pattern once.
            </Analogy>

            <Analogy label="One Filter, Many Detections">
                Here's how to picture a convolutional filter in action:
                <br /><br />
                Take a 3&#215;3 magnifying glass and slide it across the image, one pixel at a time. At each position, you ask: "does this 3&#215;3 patch match the pattern I'm looking for?" The answer (a number showing how well it matches) goes into a new image — the feature map — at the corresponding position.
                <br /><br />
                The 9 numbers in the magnifying glass are the filter weights. They never change as the glass slides around. That's weight sharing: the same 9 numbers produce one response at the top-left, another at the center, another at the bottom-right — all using identical weights.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of weight sharing — why it works and what it implies</h2>

            <h3>Weight Sharing — The Formal Definition</h3>
            <p>
                In a standard fully-connected layer, each output unit y&#7495; has its own weight vector w&#7495;:
            </p>
            <MathBlock tex="y_i = \sum_j W_{ij} \cdot x_j + b_i \quad \text{(unique weights per output)}" />
            <p>
                In a convolutional layer, a single filter kernel K is applied at every spatial position:
            </p>
            <MathBlock tex="Y[i, j] = \sum_{m}\sum_{n} K[m, n] \cdot X[i+m,\; j+n] + b \quad \text{(shared weights everywhere)}" />
            <p>
                The same K[m,n] values appear in the computation for every (i,j). This is the defining
                property — the weights are <em>tied</em> across positions.
            </p>

            <h3>Parameter Count Comparison</h3>
            <p>
                For a 32&#215;32 input with 1 channel (like MNIST), producing 32&#215;32 output with 64 channels:
            </p>
            <MathBlock tex="\text{Fully-connected: } (32 \times 32 + 1) \times (32 \times 32 \times 64) = 67{,}174{,}400 \text{ params}" />
            <MathBlock tex="\text{Conv (3\times3, 64 filters): } (3 \times 3 \times 1 + 1) \times 64 = 640 \text{ params}" />
            <p>
                Weight sharing achieves a <strong>104,960&#215;</strong> parameter reduction for this layer,
                with equivalent spatial coverage. The reduction grows quadratically with image size.
            </p>

            <h3>Translation Equivariance vs. Invariance</h3>
            <p>
                Weight sharing gives convolution a precise geometric property:
            </p>
            <MathBlock tex="(T_{\Delta} X) * K = T_{\Delta}(X * K)" />
            <p>
                If the input X is shifted by &#916; pixels, the output feature map shifts by the same &#916;.
                This is <strong>translation equivariance</strong>: the representation transforms consistently
                with the input transformation. It is <em>not</em> yet invariance — the output changes
                when the input shifts.
            </p>
            <p>
                <strong>Translation invariance</strong> is achieved by subsequent pooling, which collapses
                small spatial shifts into the same pooled value. The combination of conv (equivariant) +
                pool (reduces sensitivity to small shifts) approximates invariance at each scale.
            </p>

            <h3>The Inductive Bias Argument</h3>
            <p>
                Weight sharing encodes a strong prior assumption about the problem: <em>the statistical
                properties of the input are translation-invariant</em>. Edges, textures, and patterns
                appear at many positions in natural images, and the same detector should fire regardless
                of position. This inductive bias is correct for natural images, which is why CNNs
                generalise well from limited data. For tasks where position matters (e.g., detecting
                whether a digit is in the top-left box of a form), weight sharing would be the wrong bias.
            </p>

            <h3>Receptive Field Growth Through Stacking</h3>
            <p>
                With n stacked 3&#215;3 convolutions (stride 1), the receptive field — the region of the
                original input that influences each output neuron — grows as:
            </p>
            <MathBlock tex="RF(n) = n \times (k-1) + 1 = 2n + 1 \quad (k=3)" />
            <p>
                Two 3&#215;3 layers: RF = 5&#215;5 with 2&#215;9 = 18 parameters (per channel).
                One 5&#215;5 layer: RF = 5&#215;5 with 25 parameters.
                Three 3&#215;3 layers: RF = 7&#215;7 with 3&#215;9 = 27 parameters (per channel) — same as one 7&#215;7.
                Stacking small filters achieves large receptive fields with fewer parameters and more non-linearity.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Why 3&#215;3 filters dominate modern CNNs:</strong> VGGNet (2014) showed that
                stacking 3&#215;3 convolutions outperforms using larger filters. Three 3&#215;3 layers have the
                same receptive field as one 7&#215;7 layer (both see a 7&#215;7 region of the input) but use
                3 &#215; 9 = 27 parameters per channel instead of 49 — and have three non-linearities
                instead of one. More non-linearity allows learning more complex functions with the same
                parameter budget. This is why essentially all modern CNNs (ResNet, EfficientNet,
                ConvNeXt) use 3&#215;3 convolutions as their primary building block.
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
            <h2>Weight sharing as parameter tying — formal analysis</h2>

            <DefBlock label="Weight Sharing as Parameter Constraint">
                A convolutional layer is a fully-connected layer with a specific parameter-tying
                constraint. Define the full weight matrix W &#8712; &#8477;&#8314;&#215;&#8544; where H = H&#7506;&#7512;&#7511; &#215; W&#7506;&#7512;&#7511; &#215; C&#7506;&#7512;&#7511; and
                I = H&#7495;&#7510; &#215; W&#7495;&#7510; &#215; C&#7495;&#7510;. The weight-sharing constraint forces:
                <MathBlock tex="W_{(i,j,c),\,(i+m,j+n,c')} = K^{(c,c')}[m,n] \quad \forall\, (i,j)" />
                All entries in W that correspond to the same offset (m,n) between the same pair of
                channels (c,c') are tied to the same scalar K&#8317;&#7580;&#46;&#7580;&#8217;&#8318;[m,n].
            </DefBlock>

            <h3>The Shared Gradient as a Cross-Correlation</h3>
            <p>
                Because K[m,n] appears in the forward computation for every output position (i,j):
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial K[m,n]} = \sum_{i,j} \frac{\partial \mathcal{L}}{\partial Y[i,j]} \cdot X[i+m,\; j+n]" />
            <p>
                This is the cross-correlation of the incoming error &#948;Y with the input X:
            </p>
            <MathBlock tex="\nabla_K \mathcal{L} = \delta Y \star X" />
            <p>
                where &#9733; denotes cross-correlation. The gradient computation for a convolutional
                layer is itself a convolution-like operation — a property that allows all gradient
                computations to be implemented using the same hardware primitives as the forward pass.
            </p>

            <h3>Effective Capacity vs. Parameter Count</h3>
            <p>
                Weight sharing reduces the parameter count but not the functional capacity of each
                layer. A convolution with a 3&#215;3 kernel can still represent any linear function
                within each 3&#215;3 receptive field — it just uses the same function at every position.
                The reduced parameter count reduces the risk of overfitting (via a stronger inductive
                bias) but not the expressiveness within the bias class.
            </p>
            <p>
                More formally: the set of all convolutions with n&#215;n input and k&#215;k kernel is a
                linear subspace of all n&#178; &#215; n&#178; linear maps, with dimension k&#178; (the filter size) rather
                than n&#8308; (the full linear map). The inductive bias constrains the search space to this
                subspace, which is a much better match to natural image statistics than the full space.
            </p>

            <h3>Weight Sharing and Sample Complexity</h3>
            <p>
                For a model with p parameters and VC dimension d, the PAC learning bound requires
                O(d/&#949;) samples to achieve error &#949;. For CNNs, the effective VC dimension grows
                with the number of filters (not the spatial size), dramatically reducing the required
                training data:
            </p>
            <MathBlock tex="\text{FC VC dim} \approx n^4 C_{\text{in}} C_{\text{out}}, \quad \text{Conv VC dim} \approx k^2 C_{\text{in}} C_{\text{out}} \cdot \log(n^2)" />
            <p>
                The logarithmic dependence on spatial size n (vs. quartic for FC) explains why CNNs
                can generalise from thousands of examples per class while FC networks on raw pixels
                would require orders of magnitude more data.
            </p>

            <div className="ch-callout">
                <strong>The fundamental insight:</strong> Weight sharing is not just a parameter-reduction
                trick — it encodes the correct inductive bias for visual recognition. Natural images
                have approximately stationary statistics: an edge detector that works at position (50, 50)
                works equally well at position (100, 200). By constraining the model to use the same
                detector everywhere, we encode this stationarity as a hard constraint rather than something
                that must be learned from data. This is the source of CNNs' extraordinary data efficiency
                on visual tasks.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import numpy as np

# ── Demonstrating Weight Sharing ───────────────────────────────────────────────

# Create an image
img = torch.randn(1, 1, 8, 8)    # batch=1, channels=1, 8x8

# Conv layer with 4 filters, 3x3 kernel
conv = nn.Conv2d(1, 4, kernel_size=3, padding=1, bias=True)

# The weight tensor: (out_ch, in_ch, k, k)
print("Conv2d weight shape:", conv.weight.shape)   # [4, 1, 3, 3]
print("Conv2d bias shape:  ", conv.bias.shape)     # [4]
print()

# Only 4 * (3*3*1 + 1) = 40 parameters total
n_params = sum(p.numel() for p in conv.parameters())
print(f"Total parameters: {n_params}")

# Apply convolution - same weights used at all 8x8=64 positions
out = conv(img)
print(f"Input shape:  {img.shape}")
print(f"Output shape: {out.shape}")
print()

# ── Manual demonstration: the same weights at every position ────────────────────
print("Demonstrating weight sharing manually:")
print("The same 9 weights detect the pattern at every 3x3 patch.")
print()

# Show one filter's weights
filter_0 = conv.weight[0, 0].detach().numpy()
print(f"Filter 0 weights (3x3):\\n{filter_0.round(3)}")
print()

# These exact weights are used at position (0,0), (0,1), ..., (7,7)
# Let's verify: compute manually at position (2,2) and (5,5)
x_np = img[0, 0].detach().numpy()

def apply_filter(X, K, i, j, b=0.0):
    """Apply filter K at position (i,j) of image X."""
    patch = X[i:i+3, j:j+3]
    return float(np.sum(patch * K) + b)

bias_0 = float(conv.bias[0].detach())
val_22 = apply_filter(x_np, filter_0, 2, 2, bias_0)
val_55 = apply_filter(x_np, filter_0, 5, 5, bias_0)
val_22_torch = float(out[0, 0, 2, 2].detach())
val_55_torch = float(out[0, 0, 5, 5].detach())

print(f"At (2,2): manual={val_22:.4f}, PyTorch={val_22_torch:.4f}")
print(f"At (5,5): manual={val_55:.4f}, PyTorch={val_55_torch:.4f}")
print("(Should match — same weights used at every position!)")
print()

# ── Translation equivariance ──────────────────────────────────────────────────
print("=" * 50)
print("Translation equivariance demo")
print("=" * 50)

# One hot: a spike at (3,3)
x1 = torch.zeros(1, 1, 10, 10)
x1[0, 0, 3, 3] = 1.0

# Same pattern, shifted by (2,2)
x2 = torch.zeros(1, 1, 10, 10)
x2[0, 0, 5, 5] = 1.0

with torch.no_grad():
    y1 = conv(x1[:, :, :, :])   # Use a 1-ch conv
    y2 = conv(x2[:, :, :, :])

# The output at (3,3) in y1 should equal the output at (5,5) in y2
val1 = float(y1[0, 0, 3, 3].detach())
val2 = float(y2[0, 0, 5, 5].detach())
print(f"y1 at (3,3): {val1:.6f}")
print(f"y2 at (5,5): {val2:.6f}")
print(f"Equal: {abs(val1 - val2) < 1e-5}")
print()
print("Conclusion: shifting the input shifts the output by the same amount.")
print("This is translation equivariance — a direct consequence of weight sharing.")`

function PythonContent() {
    return (
        <>
            <p>
                A hands-on demonstration of weight sharing: first confirming that the same filter
                weights produce the correct output at every spatial position, then verifying translation
                equivariance — a shifted input produces a shifted output with identical values.
            </p>
            <CodeBlock code={PY_CODE} filename="weight_sharing.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The weight shape is (out_channels, in_channels, k, k) — no
                spatial dimensions. This is why a Conv2d layer trained on 32&#215;32 images can be applied
                to 512&#215;512 images at inference time: the same weights slide across any image size.
                Fully-connected layers cannot do this — their weight matrix is tied to a specific input size.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const WEIGHT_SHARING_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
