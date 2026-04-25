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
            year: "1959–1962",
            title: "Hubel &amp; Wiesel — The Biological Blueprint for Visual Processing",
            challenge:
                "Chapter 6 addressed the challenge of sequential data — how neural networks could remember across time. But a fundamentally different challenge had been building in parallel: how do you build a network that recognises objects in images, regardless of where in the image they appear? Early neural networks applied to images treated each pixel as an independent input feature. A 64&#215;64 image has 4,096 pixels. If each pixel connects to 1,000 neurons, that's 4 million weights — just for one layer. Worse, the network had to separately learn that a cat in the top-left corner and a cat in the bottom-right corner are the same kind of object. There was no principled mechanism for location-invariant recognition.",
            what: "David Hubel and Torsten Wiesel at Harvard Medical School conducted a series of experiments on cats' visual cortex that earned them the 1981 Nobel Prize in Physiology or Medicine. Using microelectrodes inserted into individual neurons, they discovered that the primary visual cortex (V1) contains two types of cells: simple cells that respond to edges at specific orientations in specific locations, and complex cells that respond to the same oriented edges regardless of their exact position within a larger receptive field. They also found that the cortex is organised into orientation columns — adjacent neurons detecting similar orientations — and that deeper visual areas (V2, V4, IT cortex) respond to progressively more complex patterns.",
            impact:
                "Hubel and Wiesel provided the first neurological evidence that visual recognition is hierarchical: simple features (edges) are detected first, combined into complex features (shapes), and combined again into object representations. They also demonstrated that neurons in visual cortex have local receptive fields — they respond only to stimuli in a specific spatial region — and that complex cells pool simple cell outputs to achieve position invariance. These two observations — local receptive fields and hierarchical feature combination — directly inspired the CNN architecture twenty years later.",
        },
        {
            year: "1980",
            title: "Fukushima — The Neocognitron, the First Convolutional Architecture",
            challenge:
                "In the two decades after Hubel and Wiesel, researchers attempted to build computational models of visual cortex that could perform pattern recognition. The challenge was to translate the biological observations — local receptive fields, complex cells, hierarchical processing — into an actual trainable computational architecture. Early attempts were largely hand-coded with fixed weight values, not learned from data.",
            what: "Kunihiko Fukushima at NHK Science and Technology Research Laboratories published 'Neocognitron: A Self-Organizing Neural Network Model for a Mechanism of Pattern Recognition Unaffected by Shift in Position' (Biological Cybernetics, 1980). The neocognitron had alternating S-layers (simple cells — edge detectors with local receptive fields) and C-layers (complex cells — pooling over local regions for position tolerance). Crucially, Fukushima implemented weight sharing within each S-layer: all simple cells detecting the same feature orientation shared the same weights, regardless of their position in the image. The network was not trained with backpropagation — weights were set by unsupervised competitive learning — but the architectural principle was established.",
            impact:
                "The neocognitron introduced the two essential structural innovations of CNNs: local connectivity (each neuron sees only a small patch of the input) and weight sharing across spatial positions (the same filter is applied everywhere in the image). Both of these reduce the parameter count from quadratic in image size to constant — a key to making visual recognition tractable. The alternating convolution-pooling structure that Fukushima established in 1980 still appears in essentially the same form in ResNets, VGG, and EfficientNet today.",
        },
        {
            year: "1989",
            title: "LeCun — Backpropagation Applied to Handwritten Zip Code Recognition",
            challenge:
                "Fukushima's neocognitron was not trained with gradient descent — its weights were set by hand or by Hebbian learning. The crucial missing piece was training the convolutional architecture end-to-end using backpropagation. This required extending the backpropagation algorithm to handle weight sharing: since the same filter is used at every spatial position, the gradient for that filter is the sum of contributions from every position, not just one.",
            what: "Yann LeCun, working at AT&amp;T Bell Labs, published 'Backpropagation Applied to Handwritten Zip Code Recognition' (Neural Computation, 1989). LeCun extended backpropagation to networks with shared-weight connections, correctly deriving that the gradient for a shared weight is the sum of gradients computed at every position where that weight is used. Applying this to a convolutional network for recognising handwritten zip code digits on envelopes, he achieved near-human performance — demonstrating for the first time that a convolutional network could be trained end-to-end from raw pixels to class labels.",
            impact:
                "The 1989 paper established that CNNs could be trained by gradient descent — connecting Fukushima's structural intuition with the learning machinery of backpropagation. It was immediately practical: the system was deployed at AT&amp;T to read zip codes on mail envelopes, processing millions of pieces of mail per day. This was among the first commercial deployments of a neural network trained on real data, demonstrating that the architecture worked not just in the laboratory but at production scale.",
        },
        {
            year: "1998",
            title: "LeCun, Bottou, Bengio &amp; Haffner — LeNet-5",
            challenge:
                "The 1989 system worked for zip codes but was relatively small and operated on constrained inputs. The field needed a full, clean specification of the convolutional architecture — layer types, dimensions, activation functions, training procedure — that could serve as a reference design for future work. Additionally, the system needed to be demonstrated on a standard benchmark that would allow fair comparison across methods.",
            what: "LeCun, Bottou, Bengio, and Haffner published 'Gradient-Based Learning Applied to Document Recognition' in the Proceedings of the IEEE (1998). The paper introduced LeNet-5: a seven-layer architecture processing 32&#215;32 grayscale images through two convolutional layers (with average pooling after each) and three fully-connected layers, ending in a 10-class output (digits 0-9). The paper also introduced the MNIST benchmark — 60,000 training examples, 10,000 test examples of handwritten digits — which became the standard evaluation for image classification for over a decade.",
            impact:
                "LeNet-5 established the blueprint for all subsequent CNN architectures: alternating convolution and pooling layers, progressively increasing feature depth while decreasing spatial resolution, followed by fully-connected classification layers. The paper's 98.9% test accuracy on MNIST was remarkable for 1998. The architecture was deployed in ATM machines across the United States to read handwritten amounts on checks, processing millions of checks per day with high reliability. For many researchers in the late 1990s, this deployment was the most convincing argument that neural networks had practical value.",
        },
        {
            year: "1998–2012",
            title: "The Dormant Years — SVMs, HOG, and the CNN Hiatus",
            challenge:
                "Despite LeNet-5's success, CNNs failed to scale to more complex recognition tasks through the 2000s. The combination of limited GPU compute, small datasets, and vanishing gradient problems with sigmoid activations meant that deeper networks could not be trained effectively. Meanwhile, Support Vector Machines and hand-crafted feature descriptors (SIFT, HOG) produced state-of-the-art results on the classification benchmarks of the era. Neural networks fell out of fashion in computer vision.",
            what: "The period 1998-2012 saw incremental progress in CNN-adjacent research — mostly theoretical refinements and small-scale applications — while the mainstream vision community focused on SVMs with kernel functions and engineered features. The PASCAL VOC challenge (started 2005) and the ImageNet Large Scale Visual Recognition Challenge (ILSVRC, started 2010) provided new, larger benchmarks. Hinton's group at Toronto, Bengio's at Montreal, and LeCun's at NYU continued deep learning research with limited resources but growing conviction that scale was the key missing ingredient.",
            impact:
                "The 2000s hiatus is a crucial lesson in the relationship between ideas and infrastructure. LeNet-5 was architecturally correct in 1998 but computationally premature. The combination of GPUs, ReLU activations, dropout regularisation, and large-scale datasets (ImageNet's 1.2 million images) that arrived between 2006 and 2012 unlocked the potential that had been latent since 1989. AlexNet's 2012 ILSVRC victory — surpassing the previous best by a margin of nearly 10 percentage points — vindicated decades of patience and persistence in the neural network community.",
        },
        {
            year: "2012",
            title: "AlexNet — The CNN Renaissance",
            challenge:
                "The 2012 ILSVRC challenge featured the same 1,000-class classification task over 1.2 million images that had been dominated by hand-crafted features and SVMs. The challenge was to build a system that could correctly classify images of 1,000 object categories — from specific dog breeds to kitchen appliances to geological formations — from raw pixels alone.",
            what: "Krizhevsky, Sutskever, and Hinton submitted AlexNet to ILSVRC 2012 — a deep convolutional network with five convolutional layers, three fully-connected layers, ReLU activations throughout, dropout regularisation, and training on two GTX 580 GPUs for five to six days. AlexNet achieved 15.3% top-5 error, versus 26.2% for the second-best entry. The architecture introduced several innovations beyond just scaling LeNet-5: ReLU activations (replacing tanh, with faster training and no saturation), dropout (preventing overfitting in fully-connected layers), local response normalisation, and data augmentation.",
            impact:
                "AlexNet's margin of victory was so large that it immediately and permanently changed computer vision. Within one year, every top entry in ILSVRC used a deep convolutional network. Within three years, CNNs had surpassed human performance on the ImageNet classification benchmark. The 2012 result launched the modern era of deep learning and demonstrated that the ideas developed from Hubel-Wiesel (1962) through Fukushima (1980) through LeCun (1989, 1998) were correct — they had simply been waiting for the compute and data to prove it.",
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
            <h2>Teaching a computer to see — the story of convolutional networks</h2>

            <p className="ch-story-intro">
                Chapter 6 gave neural networks memory across time — sequences, sentences, speech. But there's an entirely different challenge: recognising objects in images. A cat is a cat whether it's in the top-left or bottom-right of the photo, whether it's big or small, whether it's sitting or leaping. A fully-connected network would need to separately learn every possible location, size, and pose. Chapter 7 introduces the solution: Convolutional Neural Networks, which are specifically designed to exploit the spatial structure of images.
            </p>

            <Analogy label="The Cat's Brain — How Animals See">
                In 1959, two scientists named Hubel and Wiesel did something remarkable. They put tiny wires into a cat's brain — specifically the part that processes vision — and then showed the cat pictures while watching which neurons fired.
                <br /><br />
                They discovered something beautiful: the brain doesn't try to understand the whole picture at once. First, some neurons detect simple things — an edge going left-to-right, or one going diagonally. Then other neurons combine those edges into shapes. Then more neurons combine shapes into object parts. The brain reads pictures like a hierarchy, starting with the simplest pieces and building up to the whole.
                <br /><br />
                This discovery won Hubel and Wiesel the Nobel Prize in 1981, and it directly inspired the design of CNNs.
            </Analogy>

            <Analogy label="The Magnifying Glass That Slides Around">
                Imagine you're looking for a particular pattern — say, a horizontal edge — in a photo. You wouldn't stare at the whole photo at once. You'd slide a small magnifying glass across it, checking each small region: "is there a horizontal edge here? Here? Here?"
                <br /><br />
                That's exactly what a <strong>convolutional filter</strong> does. It's a small detector (maybe 3 pixels wide and 3 pixels tall) that slides across the entire image, checking every small region for its particular pattern. The result is a <strong>feature map</strong>: a new image where each pixel's brightness tells you how strongly the pattern was detected at that location.
                <br /><br />
                One filter detects horizontal edges. Another detects vertical edges. Another detects diagonal ones. Together, they create a rich set of feature maps describing what kind of edges appear where.
            </Analogy>

            <Analogy label="Why the Same Detector Works Everywhere — Weight Sharing">
                Here's the key magic trick: the same detector is used at every location. You don't need one detector for the top-left corner, a different one for the middle, and another for the bottom-right. The same set of filter weights slides across every pixel.
                <br /><br />
                This is called <strong>weight sharing</strong>, and it's why CNNs are so efficient. A 3&#215;3 filter has only 9 numbers. No matter how large the image is, those same 9 numbers detect the pattern everywhere. Compare this to a fully-connected network, which would need a separate set of weights for every pixel — thousands or millions of numbers just to detect one simple pattern.
            </Analogy>

            <Analogy label="Building Up — Layers of Understanding">
                CNNs work in layers, each building on the previous one:
                <br /><br />
                <strong>Layer 1:</strong> Simple filters detect edges — horizontal, vertical, diagonal. Each filter is just a small array of numbers that lights up when it finds its pattern.
                <br /><br />
                <strong>Layer 2:</strong> More complex filters combine edges into shapes — corners, curves, and textures. A corner is just two edges meeting at a point.
                <br /><br />
                <strong>Layer 3:</strong> Even more complex patterns appear — circles, grids, fur textures, feather patterns.
                <br /><br />
                <strong>Layer 4+:</strong> Object parts start to appear — eyes, wheels, windows, leaves.
                <br /><br />
                <strong>Final layers:</strong> Whole objects — "this is a dog," "this is a fire engine."
            </Analogy>

            <Analogy label="Fukushima and LeCun — The Pioneers">
                In 1980, a Japanese scientist named Fukushima built the first network inspired by Hubel and Wiesel's cat brain experiments. He called it the Neocognitron. It used the same sliding-detector idea, but the filters weren't learned from data — they were set by hand.
                <br /><br />
                In 1989, Yann LeCun at Bell Labs had the crucial insight: what if you let backpropagation learn the filter weights automatically? He applied gradient descent to train the filters from examples, and the network learned to detect the right patterns on its own — edges, curves, digit parts — without any human telling it what to look for. His system could read handwritten zip codes on mail envelopes, processing millions of letters per day at the post office. That was the birth of the modern CNN.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From pixels to understanding — the CNN design principles</h2>

            <h3>Why Fully-Connected Networks Fail on Images</h3>
            <p>
                Consider a modest 224&#215;224 RGB image (the standard ImageNet input size).
                As a flat vector, it has 224 &#215; 224 &#215; 3 = 150,528 values. A fully-connected
                layer with 1,000 hidden neurons would require:
            </p>
            <MathBlock tex="150{,}528 \times 1{,}000 + 1{,}000 = 150{,}529{,}000 \text{ parameters}" />
            <p>
                That's 150 million parameters for just the first layer. Modern networks have dozens of
                such layers. The parameter count would be in the tens of billions — far too many to
                train on any available dataset without severe overfitting.
            </p>
            <p>
                Worse, a fully-connected layer treats every pixel as a separate independent feature.
                It has no way to know that adjacent pixels are spatially related, that an edge in the
                top-left is similar to an edge in the bottom-right, or that a cat in different positions
                should be recognised as the same kind of object.
            </p>

            <h3>The Three CNN Principles</h3>
            <p>
                CNNs address all of these problems through three structural inductive biases:
            </p>
            <ol style={{ paddingLeft: "1.4em", lineHeight: "1.85" }}>
                <li><strong>Local connectivity:</strong> Each neuron connects to only a small spatial region (the receptive field), not the entire input. A 3&#215;3 filter connects to 9 input values, not 150,528.</li>
                <li><strong>Weight sharing (parameter sharing):</strong> The same filter weights are used at every spatial position. One 3&#215;3 filter has 9 weights that detect a pattern anywhere in the image.</li>
                <li><strong>Hierarchical composition:</strong> Multiple layers stack local detectors to build up complex, abstract representations — edges combine into textures, textures into parts, parts into objects.</li>
            </ol>

            <h3>The Convolution Operation</h3>
            <p>
                For a 2D input X and kernel K of size k&#215;k, the convolution output at position (i, j) is:
            </p>
            <MathBlock tex="(X * K)[i,j] = \sum_{m=0}^{k-1}\sum_{n=0}^{k-1} X[i+m,\;j+n] \cdot K[m,n] + b" />
            <p>
                This is a dot product between the kernel and a k&#215;k patch of the input, summed over
                all positions in the patch. The kernel slides across the entire input, producing one
                output value per position — the <strong>feature map</strong>.
            </p>

            <h3>Parameter Efficiency</h3>
            <p>
                For a convolutional layer with C&#7495;&#7510; input channels, C&#7506;&#7512;&#7511; output channels, and a k&#215;k kernel:
            </p>
            <MathBlock tex="\text{Parameters} = (k^2 \cdot C_{\text{in}} + 1) \times C_{\text{out}}" />
            <p>
                For a 3&#215;3 filter, 3 input channels (RGB), and 64 output channels:
                (9 &#215; 3 + 1) &#215; 64 = 1,792 parameters — versus 150M for a fully-connected layer
                with the same input size. That is an 84,000-fold reduction.
            </p>

            <h3>Translation Equivariance</h3>
            <p>
                Weight sharing gives CNNs a fundamental geometric property: if you translate the input
                image by &#916; pixels, the feature map translates by the same &#916;:
            </p>
            <MathBlock tex="f(T_\Delta(\mathbf{x})) = T_\Delta(f(\mathbf{x}))" />
            <p>
                where T&#916; denotes translation by &#916; and f is the convolution operation.
                This is called <strong>translation equivariance</strong>: the same feature detected
                at position (i, j) will be detected at position (i+&#916;x, j+&#916;y) if the input
                is shifted. Subsequent pooling converts this to approximate <strong>translation invariance</strong>:
                the final classification doesn't change if the object moves slightly.
            </p>

            <h3>The Biological Connection</h3>
            <p>
                Hubel and Wiesel's simple cells directly correspond to CNN filters: they respond to
                edges at specific orientations in specific locations. Their complex cells correspond
                to pooling layers: they respond to the same oriented edge regardless of its exact position
                within a larger region. The stacked hierarchy of visual areas (V1 &#8594; V2 &#8594; V4 &#8594; IT) directly
                corresponds to successive CNN layers. The CNN is not an abstract mathematical construction
                — it is an engineering implementation of a visual processing strategy that evolution
                discovered over millions of years.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The historical irony:</strong> The biological blueprint for CNNs was discovered in 1962 by Hubel and Wiesel. The first computational implementation (Neocognitron) appeared in 1980. The first version trained by backpropagation (LeCun) appeared in 1989. The first version that proved the architecture correct at scale (AlexNet) appeared in 2012. From neuroscience discovery to computational vindication took fifty years — not because the idea was wrong, but because the infrastructure (compute, data, training techniques) took that long to arrive.
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
            <h2>Formal derivation of convolution and its gradient</h2>

            <DefBlock label="2D Discrete Convolution">
                For input X &#8712; &#8477;&#8314;&#215;&#8544; and kernel K &#8712; &#8477;&#1089;&#215;&#1089;, the output feature map is:
                <MathBlock tex="(X * K)[i, j] = \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} X[i+m,\; j+n] \cdot K[m, n] + b" />
                For C&#7495;&#7510; input channels and C&#7506;&#7512;&#7511; filters, the multi-channel output is:
                <MathBlock tex="Y^{(c)}[i,j] = \sum_{c'=1}^{C_{\text{in}}} \sum_{m,n} X^{(c')}[i+m, j+n] \cdot K^{(c,c')}[m,n] + b^{(c)}" />
                where K&#8317;&#7580;&#46;&#7580;&#8217;&#8318; &#8712; &#8477;&#1089;&#215;&#1089; is the filter for input channel c' and output channel c.
            </DefBlock>

            <h3>Output Spatial Dimensions</h3>
            <p>
                For input size H &#215; W, kernel size k, stride s, and padding p:
            </p>
            <MathBlock tex="H_{\text{out}} = \left\lfloor \frac{H - k + 2p}{s} \right\rfloor + 1" />
            <MathBlock tex="W_{\text{out}} = \left\lfloor \frac{W - k + 2p}{s} \right\rfloor + 1" />
            <p>
                "Same" padding: p = (k-1)/2 gives H&#7506;&#7512;&#7511; = H/s (integer division). With s=1 and same padding,
                output size equals input size.
            </p>

            <h3>Gradient of Convolution (Backpropagation)</h3>
            <p>
                Given the gradient &#948;Y&#8317;&#7580;&#8318;[i,j] = &#8706;&#8466;/&#8706;Y&#8317;&#7580;&#8318;[i,j], the gradients for kernel and input are:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial K^{(c,c')}[m,n]} = \sum_{i,j} \delta Y^{(c)}[i,j] \cdot X^{(c')}[i+m,\, j+n]" />
            <p>
                This is a cross-correlation between the incoming gradient and the input — itself a
                convolution-like operation. For the input gradient:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial X^{(c')}[i,j]} = \sum_{c} \sum_{m,n} \delta Y^{(c)}[i-m,\, j-n] \cdot K^{(c,c')}[m,n]" />
            <p>
                This is a convolution of the incoming gradient with the <em>flipped</em> kernel —
                the "transposed convolution" or "deconvolution" operation used in generative models.
            </p>

            <h3>Weight Sharing Gradient Accumulation</h3>
            <p>
                Because K&#8317;&#7580;&#46;&#7580;&#8217;&#8318;[m,n] is the same weight used at every output position (i,j), the
                gradient sums over all positions:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial K^{(c,c')}[m,n]} = \sum_{i=0}^{H_{\text{out}}-1} \sum_{j=0}^{W_{\text{out}}-1} \delta Y^{(c)}[i,j] \cdot X^{(c')}[i+m,\, j+n]" />
            <p>
                This is LeCun's key 1989 derivation: the gradient for a shared filter weight is the
                sum (not the single value at one position) of contributions from all output positions
                where that weight was used in the forward pass.
            </p>

            <div className="ch-callout">
                <strong>Translation equivariance — formal proof:</strong> Let T&#916; be the translation
                operator: (T&#916;X)[i,j] = X[i-&#916;x, j-&#916;y]. Then
                <InlineMath tex="(T_\Delta X * K)[i,j] = \sum_{m,n} X[i+m-\Delta x, j+n-\Delta y] \cdot K[m,n] = (X*K)[i-\Delta x, j-\Delta y] = (T_\Delta(X*K))[i,j]" />.
                Hence <InlineMath tex="T_\Delta X * K = T_\Delta(X * K)" /> — convolution commutes with translation.
                This is the mathematical statement of weight sharing: the same filter response at different
                positions is produced by the same weights, not by position-specific weights.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Manual 2D Convolution — showing the sliding dot product ────────────────────
import numpy as np

def manual_conv2d(X, K, b=0, stride=1, padding=0):
    """
    2D convolution by hand.
    X: (H, W) — single-channel input
    K: (k, k) — single filter
    Returns: feature map (H_out, W_out)
    """
    H, W = X.shape
    k = K.shape[0]

    # Add padding
    if padding > 0:
        X = np.pad(X, padding, mode='constant')
        H, W = X.shape

    H_out = (H - k) // stride + 1
    W_out = (W - k) // stride + 1

    Y = np.zeros((H_out, W_out))
    for i in range(H_out):
        for j in range(W_out):
            patch = X[i*stride:i*stride+k, j*stride:j*stride+k]
            Y[i, j] = np.sum(patch * K) + b

    return Y

# Create a simple test image with a vertical edge
img = np.array([
    [0, 0, 255, 255, 255],
    [0, 0, 255, 255, 255],
    [0, 0, 255, 255, 255],
    [0, 0, 255, 255, 255],
    [0, 0, 255, 255, 255],
], dtype=float) / 255.0

# Vertical edge detector (Sobel-like)
K_vertical = np.array([
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
], dtype=float)

feature_map = manual_conv2d(img, K_vertical)
print("Input image (5x5, vertical edge at column 2):")
print(img.round(1))
print("\\nVertical edge detector feature map (3x3):")
print(feature_map.round(2))
print()
print("Observation: large positive values at the edge location!")

# ── PyTorch: automatic parameter efficiency ─────────────────────────────────────
print("\\n" + "=" * 55)
print("Parameter count: Conv2d vs Linear (same spatial input)")
print("=" * 55)

# Image: 3-channel, 224x224
# Conv2d: 64 filters of size 3x3
conv = nn.Conv2d(3, 64, kernel_size=3, padding=1)
conv_params = sum(p.numel() for p in conv.parameters())

# Linear: same 224x224x3 input -> 224x224x64 output (conceptually)
fc = nn.Linear(3*224*224, 64*224*224)
fc_params = sum(p.numel() for p in fc.parameters())

print(f"Conv2d (3->64 ch, 3x3): {conv_params:>15,} parameters")
print(f"Linear equivalent:       {fc_params:>15,} parameters")
print(f"Reduction:               {fc_params // conv_params:>15,}x fewer params")
print()

# ── Translation equivariance demonstration ─────────────────────────────────────
print("Translation equivariance demo:")
conv_test = nn.Conv2d(1, 1, kernel_size=3, padding=1, bias=False)

x1 = torch.zeros(1, 1, 8, 8)
x1[0, 0, 3, 3] = 1.0        # point source at center

x2 = torch.zeros(1, 1, 8, 8)
x2[0, 0, 5, 5] = 1.0        # point source shifted by (2,2)

with torch.no_grad():
    y1 = conv_test(x1)
    y2 = conv_test(x2)

# Check: y2 should be y1 shifted by (2,2)
peak1 = y1.squeeze().numpy().argmax()
peak2 = y2.squeeze().numpy().argmax()
print(f"  Input  peak at: {np.unravel_index(peak1.item(), (8,8))}")
print(f"  Output peak at: {np.unravel_index(peak2.item(), (8,8))}")
print("  (shifted by same amount -> translation equivariant!)")`

function PythonContent() {
    return (
        <>
            <p>
                A manual NumPy implementation of 2D convolution showing the sliding dot product,
                followed by a parameter efficiency comparison between Conv2d and Linear, and a
                demonstration of translation equivariance — the same response at shifted positions.
            </p>
            <CodeBlock code={PY_CODE} filename="cnn_intro.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The parameter reduction from fully-connected to
                convolutional is not approximate — it's exact. A 3&#215;3 filter with 3 input channels
                has exactly 28 parameters (27 weights + 1 bias) regardless of whether the image
                is 28&#215;28, 224&#215;224, or 4096&#215;4096. The same 28 numbers process images of any size.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const INTRODUCTION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
