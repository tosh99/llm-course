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
            year: "1959–1962",
            title: "Hubel &amp; Wiesel — The Biological Hierarchy",
            challenge:
                "Before Hubel and Wiesel, vision science had no systematic account of how the brain processes images into object recognition. The dominant model treated vision as pattern matching against templates stored in memory — no hierarchy, no feature composition. This couldn't explain how humans recognise objects at any scale, orientation, or lighting condition, or why small perturbations rarely cause misidentification.",
            what: "Hubel and Wiesel's electrophysiology experiments revealed that the visual cortex processes images through a hierarchy: primary visual cortex (V1) contains simple cells detecting oriented edges at specific locations, and complex cells that pool over simple cells to achieve position tolerance within a local region. Higher visual areas (V2, V4, IT) respond to progressively more complex stimuli: V2 responds to contours and textures; V4 to colour, shape, and curvature; the inferotemporal cortex (IT) to whole objects, faces, and categories. Each level represents a more abstract, position-invariant feature.",
            impact:
                "The biological hierarchy provided the conceptual template for CNN architecture: alternating detection (simple cells = convolution) and pooling (complex cells = max pool) stages, stacked to build from edges to objects. Forty years of neuroscience research confirmed and extended this hierarchy, providing ongoing inspiration for deep learning architecture design. The parallel between CNN layers and brain areas is the most successful brain-inspired computation ever developed.",
        },
        {
            year: "1999",
            title: "Riesenhuber &amp; Poggio — HMAX Model of Visual Hierarchy",
            challenge:
                "Despite the biological inspiration, there was no quantitative computational model that could explain how the brain's hierarchical visual processing achieved object recognition. Hand-crafted models of individual brain areas existed, but a unified hierarchical model that predicted both neurophysiology and psychophysics was lacking. Researchers needed a mathematical framework connecting the neural hierarchy to computational capabilities.",
            what: "Maximilian Riesenhuber and Tomaso Poggio at MIT published 'Hierarchical Models of Object Recognition in Cortex' (Nature Neuroscience, 1999). Their HMAX model formalised the Hubel-Wiesel hierarchy: alternating S (simple, template matching) and C (complex, max pooling) units, with the S-units at higher layers implementing more complex templates built from the C-units below. The model predicted neural responses in V1, V2, V4, and IT and could perform basic object categorisation. Critically, HMAX showed mathematically that the alternating S-C hierarchy achieves a specific trade-off between selectivity (detecting specific features) and invariance (tolerating position changes).",
            impact:
                "HMAX became the standard computational model for primate visual cortex and a major inspiration for deep CNN design. It provided the first theoretical analysis of why the hierarchy works: each C-layer pools over spatial positions, building in tolerance to position shifts. Each subsequent S-layer combines the invariant C-layer outputs to detect more complex, position-tolerant patterns. This selectivity-invariance trade-off is the mathematical justification for the CNN's conv-pool-conv-pool structure.",
        },
        {
            year: "2009–2012",
            title: "Lee, Ng et al. — Visualising What Deep Networks Learn",
            challenge:
                "By 2009, deep neural networks were being trained on image data, but it was unclear what they actually learned. The weights of a convolutional layer are abstract numbers — without visualisation, there was no way to confirm that the network was learning edges in early layers and object parts in later layers, as theory predicted. The 'black box' criticism of neural networks depended partly on this opacity.",
            what: "Honglak Lee, Roger Grosse, Rajesh Ranganath, and Andrew Ng published 'Convolutional Deep Belief Networks for Scalable Unsupervised Learning of Hierarchical Representations' (ICML, 2009). By training a convolutional deep belief network on unlabelled images, they could visualise what each layer learned. Their visualisations confirmed the hierarchy: first-layer filters looked like Gabor functions (oriented edge detectors, matching V1 simple cells); second-layer filters combined these into texture patches; higher layers showed increasingly complex patterns. This was the first empirical confirmation in a trained deep network that the feature hierarchy was real, not theoretical.",
            impact:
                "Lee et al.'s visualisations were immediately convincing to researchers. Seeing that a network trained on natural images spontaneously learns Gabor-like edge detectors — without being told to — was powerful evidence that the hierarchical organisation was a natural consequence of the architecture, not an imposed constraint. This visualisation tradition was extended by Zeiler-Fergus (2014) and deepened into the interpretability research field.",
        },
        {
            year: "2014",
            title: "Zeiler &amp; Fergus — Visualising and Understanding Convolutional Networks",
            challenge:
                "AlexNet (2012) had demonstrated that deep CNNs were state-of-the-art for visual recognition, but the reasons for its success were not fully understood. Which layers were most important? What features did each layer compute? How did architectural choices like filter size and depth affect the learned representations? Without answers to these questions, improving on AlexNet was a matter of trial and error rather than principled design.",
            what: "Matthew Zeiler and Rob Fergus published 'Visualizing and Understanding Convolutional Networks' (ECCV, 2014). They introduced deconvolution networks (deconvnets): for each unit in a CNN layer, find the input image patch that maximally activates that unit, and project that activation back through the network to pixel space. This revealed what each unit 'sees.' The results were spectacular: Layer 1 learned oriented edges and blobs; Layer 2 learned corners, circles, and simple textures; Layer 3 learned grids, honeycombs, and more complex patterns; Layer 4 learned dog faces, bird legs, and specific object parts; Layer 5 learned whole objects at various scales. The paper also used these insights to improve AlexNet, developing ZFNet that won ILSVRC 2013.",
            impact:
                "Zeiler-Fergus provided the most clear and convincing visualisation of CNN feature hierarchies, directly confirming the Hubel-Wiesel-inspired theoretical predictions from the 1980s. Their deconvnet visualisation technique spawned a subfield of neural network interpretability research. More practically, their architectural insights — that AlexNet's first layer filters were suboptimal — led to design improvements that were incorporated into all subsequent architectures. The paper changed the culture of deep learning: from black-box engineering to principled, interpretation-guided design.",
        },
        {
            year: "2015–Present",
            title: "Transfer Learning — Hierarchies as Reusable Features",
            challenge:
                "Training a CNN from scratch on a new visual task requires large amounts of labelled data — potentially millions of images. For many practical applications (medical imaging, satellite analysis, rare object detection), collecting millions of labels is infeasible. The question was: could the feature hierarchy learned on one large dataset (like ImageNet) be reused for a different but related task?",
            what: "Donahue, Jia, Vinyals, Hoffman, Zhang, Tzeng, and Darrell (2014) published 'DeCAF: A Deep Convolutional Activation Feature for Generic Visual Recognition,' showing that features extracted from intermediate CNN layers transfer remarkably well to new visual tasks. Features from ImageNet-pretrained AlexNet were used as-is for fine-grained bird recognition, scene recognition, and domain adaptation — all outperforming task-specific hand-crafted features. The key insight: early CNN layers learn general features (edges, textures) that are universally useful; later layers learn task-specific features (ImageNet categories) that may need fine-tuning.",
            impact:
                "Transfer learning became the dominant paradigm for practical deep learning in computer vision. Rather than training from scratch, practitioners initialise with ImageNet-pretrained weights and fine-tune for their specific task. This approach achieves near-state-of-the-art performance on new tasks with as few as hundreds or thousands of labelled examples, rather than millions. The success of transfer learning is direct evidence that the hierarchical representations learned by CNNs capture genuine visual structure that generalises beyond the training distribution — the most compelling evidence that the feature hierarchy is a real and useful computational primitive.",
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
            <h2>How CNNs build understanding layer by layer</h2>

            <Analogy label="The LEGO Castle Story">
                Imagine you're building a castle out of LEGO. You start with the smallest, simplest pieces: individual bricks. Then you combine bricks into walls and towers. Then towers into turrets. Then turrets into a full castle. Every level of the hierarchy builds on what came before.
                <br /><br />
                A CNN builds understanding of images exactly this way. The first layer sees only the tiniest features — individual edges. The next layer combines edges into shapes. The next layer combines shapes into object parts. The final layers put it all together to recognise whole objects.
            </Analogy>

            <Analogy label="Layer by Layer — What the CNN Actually Sees">
                Scientists can look inside a trained CNN and see what each neuron responds to. Here's what they found:
                <br /><br />
                <strong>Layer 1:</strong> Gabor-like patterns — oriented edges, colour gradients, bright spots. These are the same patterns that neurons in your visual cortex (V1) respond to! The CNN independently discovered the same representation your brain uses.
                <br /><br />
                <strong>Layer 2:</strong> Curves, corners, textures. Groups of edges combining into more complex patterns. Some neurons respond to checkerboards; others to diagonal stripes.
                <br /><br />
                <strong>Layer 3:</strong> Complex textures, mesh patterns, circles, spirals. Now the patterns have structure within structure — a spiral is made of curves, which are made of edges.
                <br /><br />
                <strong>Layer 4:</strong> Object parts! Wheels, eyes, dog noses, bird beaks, human faces (side view). The network has learned what makes up the things it needs to recognise.
                <br /><br />
                <strong>Layer 5+:</strong> Whole objects — a complete dog face, a full car, a specific type of bird. The network now votes on: "what category does all this evidence point to?"
            </Analogy>

            <Analogy label="Why Early Layers Transfer to New Tasks">
                Here's something remarkable: if you train a CNN to recognise 1,000 different kinds of things (ImageNet), and then want to train it to recognise something new (say, types of skin lesions in dermatology), you don't have to start from scratch.
                <br /><br />
                The early layers — which learned edges and textures — are useful for any visual task. Edges are edges whether you're looking at a dog or a skin cell. The middle layers — which learned patterns and shapes — are also general. Only the very last layers, which learned "this collection of dog parts = Golden Retriever," are task-specific.
                <br /><br />
                So you can take a network trained on millions of ImageNet photos, keep the early layers (which learned general visual features), and only retrain the last few layers on your specific task. This is called <strong>transfer learning</strong>, and it means you can build excellent models with only hundreds of examples instead of millions.
            </Analogy>

            <Analogy label="Your Brain Does This Too">
                Hubel and Wiesel discovered in 1959 that your visual cortex does exactly the same hierarchy! The primary visual cortex (V1) responds to edges. V2 and V4 respond to shapes and colours. The inferotemporal cortex responds to whole objects and faces.
                <br /><br />
                A CNN trained on natural images independently discovers the same hierarchy — without anyone telling it to. This is one of the most striking results in all of neuroscience and AI: the same hierarchical organisation emerges from both biological evolution and machine learning when optimising for visual recognition. Nature and machine learning discovered the same algorithm.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Hierarchical representations — from edges to objects</h2>

            <h3>The Receptive Field Pyramid</h3>
            <p>
                The receptive field — the region of the original input that influences each neuron —
                grows with network depth. For n stacked 3&#215;3 convolutions with stride 1:
            </p>
            <MathBlock tex="RF(n) = 2n + 1" />
            <p>
                Each 2&#215;2 max pooling with stride 2 doubles the effective receptive field. In a typical
                CNN (VGG-16 style):
            </p>
            <ul>
                <li>Layer 1 neurons: see 3&#215;3 region (9 pixels)</li>
                <li>After 2 convolutions + 1 pool: see 10&#215;10 region</li>
                <li>After 4 convolutions + 2 pools: see 22&#215;22 region</li>
                <li>After 10 convolutions + 4 pools: see ~100&#215;100 region</li>
            </ul>
            <p>
                Early layers detect fine-grained local features; later layers integrate information
                from large regions of the image, enabling context-aware recognition.
            </p>

            <h3>What Each Layer Learns — Empirical Evidence</h3>
            <p>
                Zeiler and Fergus (2014) used deconvolution to visualise what each AlexNet layer
                responds to:
            </p>
            <div style={{ background: "#111115", padding: "16px", borderRadius: "4px", margin: "16px 0" }}>
                <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#e8a838" }}>Layer 1 (3&#215;3 RF):</strong> Oriented edge detectors and colour blobs
                    <br /><span style={{ color: "#5e5b56", fontSize: "13px" }}>Matches V1 simple cells — same as Gabor functions</span>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#5a9ab9" }}>Layer 2 (10&#215;10 RF):</strong> Texture and contour patterns, circles
                    <br /><span style={{ color: "#5e5b56", fontSize: "13px" }}>Matches V2 — complex texture selectivity</span>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#5ab98c" }}>Layer 3 (22&#215;22 RF):</strong> Complex patterns — honeycombs, meshes, spirals
                    <br /><span style={{ color: "#5e5b56", fontSize: "13px" }}>Matches V4 — shape and curvature processing</span>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#9b7fc7" }}>Layer 4 (50&#215;50 RF):</strong> Object parts — dog faces, bird legs, wheels
                    <br /><span style={{ color: "#5e5b56", fontSize: "13px" }}>Matches IT cortex — part-based representation</span>
                </div>
                <div>
                    <strong style={{ color: "#cdc9c0" }}>Layer 5+ (100&#215;100 RF):</strong> Whole objects at multiple scales
                    <br /><span style={{ color: "#5e5b56", fontSize: "13px" }}>Category-level representation</span>
                </div>
            </div>

            <h3>Translation and Scale Invariance</h3>
            <p>
                The combination of convolution and pooling builds in approximate invariances:
            </p>
            <ul>
                <li><strong>Translation invariance:</strong> If an object moves by less than the pooling window size, the pooled feature remains the same. After 4 max-pool(2,2) layers: invariant to shifts up to 16 pixels.</li>
                <li><strong>Scale invariance:</strong> CNNs trained with data augmentation (random resizing) learn scale-tolerant representations. Multi-scale feature pyramids (FPN) detect objects at any scale explicitly.</li>
                <li><strong>Deformation tolerance:</strong> Max pooling over local neighbourhoods tolerates small deformations without exact spatial precision.</li>
            </ul>

            <h3>Transfer Learning — Why Hierarchies Generalise</h3>
            <p>
                ImageNet-pretrained CNN features transfer because visual hierarchies are domain-general.
                Quantitatively: feature extraction with frozen ImageNet weights typically achieves 80-90%
                of the performance of training from scratch with full data, using only 1% of the training
                examples. The fraction of layers to fine-tune increases for more domain-specific tasks:
            </p>
            <ul>
                <li>Medical imaging (X-ray, pathology): fine-tune last 2-3 layers; early layers transfer well</li>
                <li>Satellite imagery: fine-tune all layers; different textures but shared edge structure</li>
                <li>Artistic style: fine-tune everything; very different visual statistics from natural photos</li>
            </ul>

            <h3>Biological Parallel — The Evidence</h3>
            <p>
                The correspondence between CNN layers and visual cortex areas is quantitative, not just qualitative.
                Yamins and DiCarlo (2016) showed that CNN activations can linearly predict IT cortex
                neural responses better than any other model, with correlation r &#8776; 0.7-0.8. The CNN hierarchy
                is the best computational model of primate visual cortex currently known — a remarkable
                convergence between machine learning optimisation and evolutionary biology.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The deep insight:</strong> Feature hierarchies are not a design choice imposed on CNNs — they are an emergent property that arises whenever you train a deep convolutional network to classify natural images. The hierarchy is there because it is the optimal solution to the visual recognition problem: local features are most efficiently detected by small filters, and complex objects are most efficiently represented by combinations of simpler parts. CNNs discover this because gradient descent finds it, just as evolution found it for the visual cortex.
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
            <h2>Mathematical analysis of hierarchical representations</h2>

            <DefBlock label="Receptive Field Formula">
                For n convolutional layers with kernel size k and stride s, plus p pooling layers each
                with pooling factor f:
                <MathBlock tex="RF = \left(k + (k-1)(n-1)\right) \cdot f^p = (n(k-1) + 1) \cdot f^p" />
                For k=3, n=5 conv layers, p=2 pool layers with f=2:
                RF = (5&#215;2+1)&#215;4 = 44 pixels in the original image.
            </DefBlock>

            <h3>Hierarchical Complexity — Exponential Expressivity</h3>
            <p>
                If each layer has M filters and the network has L layers, the number of distinct
                patterns representable at layer L grows at least as:
            </p>
            <MathBlock tex="\text{Patterns}(L) \geq M^L" />
            <p>
                For M=64 filters and L=5 layers: 64&#8309; = 1,073,741,824 — over one billion distinct
                detectable patterns. This exponential expressivity is what allows CNNs to discriminate
                1,000 or 10,000 object categories with millions of possible intra-category variations.
            </p>

            <h3>The Selectivity-Invariance Trade-off (Riesenhuber-Poggio)</h3>
            <p>
                Define selectivity S as the ability to distinguish stimuli, and invariance I as the
                ability to respond consistently to transformations. There is a fundamental tension:
            </p>
            <MathBlock tex="\text{Selectivity} \times \text{Invariance} \leq C" />
            <p>
                for some constant C that depends on the task. Max pooling increases I while decreasing
                S (it makes the representation more invariant but less precise). The optimal hierarchy
                finds the maximum product SI at each level by applying the right amount of pooling
                at each stage.
            </p>

            <h3>Transfer Learning — Formal Bound</h3>
            <p>
                For source task S and target task T with feature representations &#934;&#8337;(x) and &#934;&#8347;(x),
                transfer learning bounds (Ben-David et al.) give:
            </p>
            <MathBlock tex="\varepsilon_T(h) \leq \varepsilon_S(h) + d_{\mathcal{H}\Delta\mathcal{H}}(\mathcal{D}_S, \mathcal{D}_T) + \lambda" />
            <p>
                where d&#8460;&#916;&#8460; is the domain divergence and &#955; is the irreducible error. When
                &#934;&#8337; and &#934;&#8347; share early-layer features (edges, textures), the domain divergence
                for those features is small, explaining why transfer works well between natural image tasks.
            </p>

            <h3>Deconvolution Visualisation (Zeiler-Fergus)</h3>
            <p>
                For a unit h&#8325;&#8348;&#7495; at layer l, location (i,j), channel c, the deconvnet
                finds the input image x&#8727; that maximises h&#8325;&#8348;&#7495;(x):
            </p>
            <MathBlock tex="x^* = \arg\max_x h_l^{(i,j,c)}(x) \quad \text{s.t.} \quad \|x\| = 1" />
            <p>
                The solution is approximated by backpropagating through the activations, replacing
                ReLU backward passes with "guided backpropagation" that passes only positive gradients
                through positive activations. The result is a feature visualisation showing what
                spatial pattern the unit detects.
            </p>

            <div className="ch-callout">
                <strong>Correspondence with neuroscience:</strong> The similarity between CNN layer
                representations and primate visual cortex responses is measured by representation
                similarity analysis (RSA) and linear regression. Yamins et al. (2014) found
                r &#8776; 0.73 between AlexNet penultimate layer activations and IT cortex neural responses —
                significantly higher than any hand-crafted model. This convergence is not
                coincidence: both systems optimise for visual categorisation, and the hierarchical
                architecture is the optimal solution in both biological and artificial neural networks.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn

# ── Visualising feature hierarchies via intermediate layer outputs ──────────────

class SimpleHierarchyCNN(nn.Module):
    """Small CNN to demonstrate hierarchical feature extraction."""

    def __init__(self):
        super().__init__()
        # Layer 1: learns edges (3x3 RF)
        self.conv1 = nn.Conv2d(1, 8,  3, padding=1)
        self.pool1 = nn.MaxPool2d(2, 2)   # RF doubles to 6x6

        # Layer 2: learns textures (6x6 RF)
        self.conv2 = nn.Conv2d(8, 16, 3, padding=1)
        self.pool2 = nn.MaxPool2d(2, 2)   # RF doubles to 12x12

        # Layer 3: learns patterns (12x12 RF)
        self.conv3 = nn.Conv2d(16, 32, 3, padding=1)

    def forward(self, x, return_intermediate=True):
        c1 = torch.relu(self.conv1(x))
        p1 = self.pool1(c1)
        c2 = torch.relu(self.conv2(p1))
        p2 = self.pool2(c2)
        c3 = torch.relu(self.conv3(p2))
        if return_intermediate:
            return c1, p1, c2, p2, c3
        return c3


# Create model
model = SimpleHierarchyCNN()
x = torch.randn(1, 1, 32, 32)  # one 32x32 grayscale image

c1, p1, c2, p2, c3 = model(x)

print("Feature hierarchy — shape progression:")
print(f"  Input:          {x.shape}   (32x32 image)")
print(f"  Conv1 output:   {c1.shape}   (8 feature maps, RF=3x3)")
print(f"  Pool1 output:   {p1.shape}   (spatial halved, RF=6x6)")
print(f"  Conv2 output:   {c2.shape}  (16 feature maps, RF=8x8)")
print(f"  Pool2 output:   {p2.shape}  (spatial halved, RF=16x16)")
print(f"  Conv3 output:   {c3.shape}  (32 feature maps, RF=18x18)")
print()

# Key observation: channels increase as spatial dims decrease
# This is the fundamental hierarchy:
# - Early layers: high spatial resolution, few abstract features
# - Late layers: low spatial resolution, many abstract features
print("The hierarchy in one table:")
print(f"  Layer  Spatial   Channels  What it detects")
print(f"  Conv1  {c1.shape[2]:2}x{c1.shape[3]:2}     {c1.shape[1]:3}      Edges")
print(f"  Pool1  {p1.shape[2]:2}x{p1.shape[3]:2}     {p1.shape[1]:3}      Edges (position-tolerant)")
print(f"  Conv2  {c2.shape[2]:2}x{c2.shape[3]:2}     {c2.shape[1]:3}      Textures, corners")
print(f"  Pool2  {p2.shape[2]:2}x{p2.shape[3]:2}     {p2.shape[1]:3}      Textures (position-tolerant)")
print(f"  Conv3   {c3.shape[2]:1}x{c3.shape[3]:1}      {c3.shape[1]:3}      Patterns, object parts")

# ── Transfer learning demo ─────────────────────────────────────────────────────
print()
print("=" * 55)
print("Transfer learning: freeze early layers, fine-tune late layers")
print("=" * 55)

# Imagine this is an ImageNet-pretrained CNN
pretrained = SimpleHierarchyCNN()

# Freeze early layers (general features)
for param in pretrained.conv1.parameters():
    param.requires_grad = False
for param in pretrained.pool1.parameters():
    param.requires_grad = False
for param in pretrained.conv2.parameters():
    param.requires_grad = False

# Count trainable vs frozen parameters
total = sum(p.numel() for p in pretrained.parameters())
trainable = sum(p.numel() for p in pretrained.parameters() if p.requires_grad)
frozen = total - trainable

print(f"Total parameters:    {total:,}")
print(f"Frozen (early):      {frozen:,} ({100*frozen/total:.0f}%)")
print(f"Trainable (late):    {trainable:,} ({100*trainable/total:.0f}%)")
print()
print("By fine-tuning only the last layer, we need:")
print("  - far less training data (no need to re-learn edges/textures)")
print("  - far less compute (only a fraction of params updated)")
print("  - often achieve 85-95% of from-scratch accuracy with 1% of data")`

function PythonContent() {
    return (
        <>
            <p>
                A demonstration of hierarchical feature extraction: tracking how channels increase
                while spatial dimensions decrease through each layer, and a practical example of
                transfer learning by freezing early (general) layers and fine-tuning only late
                (task-specific) layers.
            </p>
            <CodeBlock code={PY_CODE} filename="feature_hierarchies.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Practical tip:</strong> When using a pretrained CNN for transfer learning,
                start by freezing all layers and training only the classification head. Then
                unfreeze the last block and fine-tune with a lower learning rate (typically 10-100&#215;
                smaller than the head learning rate). Only unfreeze earlier layers if you have
                large domain shift and sufficient data.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const FEATURE_HIERARCHIES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
