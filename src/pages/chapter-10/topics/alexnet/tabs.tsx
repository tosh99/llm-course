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
            year: "2006 &ndash; 2011",
            title: "Four Tools Are Assembled",
            context:
                "Chapter 9 traced how the deep learning community spent half a decade assembling a toolkit. Hinton's 2006 Deep Belief Networks provided a pre-training strategy that gave deep stacks a warm start. Nair and Hinton's 2010 ReLU paper showed that replacing sigmoid and tanh with max(0, x) eliminated the vanishing gradient problem for positive activations. Hinton and Srivastava's Dropout gave a computationally cheap regularizer that could handle overparameterised networks. And Glorot, Bengio, and He developed principled weight initialisation schemes that set variance so signals neither explode nor vanish at the first forward pass. By 2011, each tool existed in the literature. No one had yet combined all four in a single, large convolutional network trained on a dataset large enough to prove the point.",
            what:
                "ILSVRC &mdash; the ImageNet Large Scale Visual Recognition Challenge &mdash; had been running since 2010. Its training set contained 1.2 million photographs from 1,000 categories. Every entry used hand-engineered features: SIFT descriptors, HOG gradients, Fisher vectors stacked on top of SVMs. The winning top-5 error in 2011 was 25.8%. Researchers understood CNNs conceptually since LeCun's LeNet-5 (1998), but nobody had successfully trained a deep CNN on ImageNet because the computational cost was prohibitive on CPUs.",
            impact:
                "By 2011 the pieces were in place: large labelled data (ImageNet), cheap compute (commodity GPUs), and four hard-won algorithmic innovations. The stage was set for someone to put them all together and train something much larger than anything attempted before. That convergence would arrive in 2012, and it would permanently change the direction of computer science.",
        },
        {
            year: "2012",
            title: "Krizhevsky, Sutskever &amp; Hinton &mdash; ImageNet Classification with Deep Convolutional Neural Networks",
            context:
                "Alex Krizhevsky was a PhD student under Geoffrey Hinton at the University of Toronto. He had spent the previous year writing CUDA kernels from scratch to train convolutional networks on GPUs &mdash; work that was practically unknown outside Toronto. Ilya Sutskever, also a Hinton PhD student, joined the effort. The three submitted an entry to ILSVRC 2012 that they called SuperVision, later known universally as AlexNet.",
            what:
                "AlexNet stacked 5 convolutional layers followed by 3 fully connected layers &mdash; 8 learnable layers in total, 60 million parameters. It used ReLU throughout (training 6&times; faster than tanh). Because no single GTX 580 had enough memory for the full network, Krizhevsky split it across two cards: each GPU held half the feature maps, with cross-GPU communication only at certain layers. Local Response Normalisation (LRN) created lateral inhibition between adjacent feature maps. Dropout with p = 0.5 was applied in the two largest fully connected layers. Data augmentation &mdash; random 224&times;224 crops from 256&times;256 images, horizontal flips, and PCA-based colour jitter &mdash; artificially multiplied the effective dataset size.",
            impact:
                "AlexNet achieved 15.3% top-5 error. The second-place entry scored 26.2%. A gap of nearly 11 percentage points was not noise: it was a phase transition. Every computer vision laboratory in the world noticed immediately. Within eighteen months, every competitive ILSVRC entry used a deep CNN. NVIDIA's data-centre GPU revenue began a decade-long exponential rise. The academic paper attracted over 100,000 citations &mdash; the most cited computer science paper of the 2010s.",
        },
        {
            year: "2012 &ndash; 2013",
            title: "Industry Wakes Up",
            context:
                "Before 2012, deep learning was a niche academic topic funded by NSERC grants in Canada and a few DARPA contracts in the US. Computer vision practitioners regarded neural networks with suspicion: hand-engineered features had a thirty-year track record; neural networks had a fifteen-year track record of disappointing results on hard benchmarks.",
            what:
                "After ILSVRC 2012, Google acquired the startup DNNresearch (Hinton, Srivastava, Krizhevsky) for $44 million. Facebook hired Yann LeCun, the father of CNNs, to lead its new AI research lab. Baidu assembled a GPU cluster in Sunnyvale for deep speech recognition. Microsoft Research Beijing trained deep CNNs for speech. Every large tech company reorganised research priorities around deep learning within 18 months of the AlexNet paper.",
            impact:
                "The economic shock of AlexNet restructured AI research funding globally. US university labs found industry offering five- to ten-times academic salaries for deep learning expertise. The GPU computing ecosystem &mdash; CUDA libraries, multi-GPU training frameworks, cloud GPU instances &mdash; was rapidly built to meet demand. Every advance in the rest of this chapter, and in every chapter after, is downstream of this single ILSVRC result.",
        },
        {
            year: "2013",
            title: "ZFNet &mdash; Zeiler &amp; Fergus Visualise What AlexNet Learned",
            context:
                "A central criticism of deep learning after AlexNet was that the networks were black boxes. You could see that a CNN achieved 15% error, but you could not explain which visual patterns it was detecting or why depth helped. This lack of interpretability made it harder to build the next architecture because you had no principled way to diagnose failures.",
            what:
                "Matthew Zeiler and Rob Fergus at NYU developed DeconvNet: a method that projects activations back through the network to visualise which image patches maximally activated each feature map. They applied this to a retrained AlexNet variant (ZFNet) with smaller first-layer filters (7&times;7 stride 2, down from 11&times;11 stride 4) and more feature maps in the intermediate layers. ZFNet won ILSVRC 2013 with 14.8% top-5 error, improving on AlexNet by just under 0.5 points.",
            impact:
                "More important than the marginal accuracy gain, the visualisations revealed that AlexNet's first layer had learned Gabor-like edge detectors and colour blobs. Later layers showed progressively more abstract patterns: textures in layer 2, object parts in layer 3, class-specific forms in layers 4 and 5. This confirmed that deep CNNs learn a genuine hierarchy of visual features and gave researchers a diagnostic tool for architecture improvement.",
        },
        {
            year: "2014",
            title: "The Arms Race Accelerates &mdash; VGGNet, GoogLeNet, and Two Philosophies",
            context:
                "With AlexNet proven and ZFNet refined, two large laboratories &mdash; Oxford's Visual Geometry Group and Google Brain in Mountain View &mdash; raced to win ILSVRC 2014. Both accepted that depth was the key variable but drew opposite conclusions about how to add it. Oxford's VGG group argued for uniformity: use only 3&times;3 filters, stack as many as possible. Google argued for modularity: build reusable multi-scale blocks (Inception modules) and focus on parameter efficiency.",
            what:
                "VGGNet (Simonyan and Zisserman) and GoogLeNet (Szegedy et al.) were submitted simultaneously to ILSVRC 2014. VGGNet placed second with 7.3% top-5 error; GoogLeNet placed first with 6.7%. Both architectures dwarfed AlexNet in depth: VGG-16 had 16 learnable layers; GoogLeNet had 22. The two philosophies produced networks with dramatically different parameter counts: VGG-16 had 138 million parameters while GoogLeNet had only 6.8 million.",
            impact:
                "The 2014 contest established that the dominant variable in CNN performance was architectural depth, not filter design or hyperparameter tuning. It also revealed a tension that every architect must resolve: raw depth (VGG) versus parameter efficiency (GoogLeNet). The chapters that follow &mdash; ResNet and DenseNet &mdash; each resolve this tension differently.",
        },
        {
            year: "2015 &ndash; 2017",
            title: "The Legacy of AlexNet's Design Choices",
            context:
                "By 2015, AlexNet's specific architecture had been superseded. VGGNet's 3&times;3 uniformity replaced its irregular filter sizes; ResNet's skip connections eliminated its depth limit; batch normalisation replaced LRN. No practitioner trained an AlexNet for competitive vision work after 2014.",
            what:
                "Yet AlexNet's individual technical choices became the permanent vocabulary of CNN design. ReLU is now the default activation in every deep learning framework. Dropout remained standard for fully connected layers until the advent of batch normalisation. Data augmentation (crops, flips, colour jitter) is applied without thought to every vision training run. The two-GPU training split was superseded by distributed training, but the idea that large networks need distributed hardware became universal.",
            impact:
                "AlexNet's lasting contribution is not the architecture but the proof of concept: that an off-the-shelf supervised CNN, trained end-to-end with backpropagation, can outperform decades of hand-engineered vision pipelines by an enormous margin. Every subsequent CNN was a refinement of AlexNet's core claim, not a refutation of it.",
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
            <h2>AlexNet: The Network That Changed Everything</h2>

            <p className="ch-story-intro">
                Chapter 9 gave neural networks four new tools: a training warm-up trick (DBNs), a better on/off switch (ReLU), a way to avoid memorising (Dropout), and stable starting weights (He-init). Chapter 10 is what happens when you combine all four and point them at 1.2 million photographs. In 2012, AlexNet did exactly that &mdash; and won a competition by such a large margin that the entire field of computer vision changed direction overnight.
            </p>

            <Analogy label="The Photo-Guessing Contest">
                Imagine the world's hardest photo-identification contest. You have 1,000 categories &mdash; 1,000 different types of things: dogs, boats, trumpets, sponges, fire trucks. You get shown a million photos to study, then tested on 150,000 more you've never seen.
                <br /><br />
                For years, the best contestants were humans who had spent their careers carefully listing visual rules: &quot;look for these shapes, these colours, these textures&quot;. They got about 1 in 4 photos wrong. In 2012, AlexNet entered the contest &mdash; a computer that had never been given any rules, just photos and their labels &mdash; and got only 1 in 7 wrong. The human-rules team was beaten by more than 10 percentage points overnight.
            </Analogy>

            <Analogy label="The Five Secret Weapons">
                AlexNet didn't invent any one trick &mdash; it combined five that had each been discovered separately:
                <br /><br />
                <strong>1. ReLU (the fast switch):</strong> Old networks used a dimmer switch &mdash; values could be anywhere from fully off to fully on, but the dimmer itself slowed everything down. ReLU is a crisp on/off. Either the neuron fires (positive) or it doesn't (negative). Gradient flows fast, learning is 6&times; quicker.<br /><br />
                <strong>2. Two Graphics Cards:</strong> The full network had 60 million settings to tune &mdash; too large for one gaming GPU. Krizhevsky split it: each card ran half the network. They only talked to each other at two specific layers.<br /><br />
                <strong>3. Dropout:</strong> During practice, 50% of neurons are randomly switched off each time. The remaining neurons can't rely on their neighbours, so they all have to learn to do their job independently. At test time, all neurons are on &mdash; you get the average of many different smaller networks.<br /><br />
                <strong>4. Data Augmentation:</strong> You only have one million photos, but you can make millions more by cropping each photo to a slightly different region, flipping it left-right, or tweaking the colours. AlexNet saw each photo in dozens of different versions without needing new photos.<br /><br />
                <strong>5. Local Response Normalisation:</strong> Like telling the loudest singer in a choir to turn down so you can hear the others. Neurons in the same area of an image compete: if one fires very strongly, its neighbours are turned down. This creates healthy competition between feature detectors.
            </Analogy>

            <Analogy label="The Shape of What AlexNet Learned">
                AlexNet's 8 layers are like a detective team with a clear chain of command:
                <br /><br />
                Layers 1&ndash;2 look for basic clues: edges at 45 degrees, patches of colour, simple textures. If you display what these neurons care about, they look like striped patterns and colour gradients.
                <br /><br />
                Layers 3&ndash;5 are middle managers: they combine the basic clues into shapes. Circles. Rectangles. Fur-like textures. Wheel shapes. Things that start to look recognisable.
                <br /><br />
                Layers 6&ndash;8 are the senior analysts. They look at everything the middle layers found and ask: &quot;Given all these shapes and textures, what is this most likely to be?&quot; They output a probability for each of the 1,000 categories.
            </Analogy>

            <Analogy label="Why Deeper Is Better">
                Why do you need 8 layers? Why not just one very complicated layer?
                <br /><br />
                Think of recognising a golden retriever. The dog has: fur (a texture), four legs with paws (a shape built from curves), two ears folded down (another shape), and a colour range from cream to dark gold.
                <br /><br />
                A one-layer network would have to somehow capture all of this in one shot. An 8-layer network can build understanding progressively: first learn what fur looks like, then learn what a paw looks like (fur + round shape), then what a leg looks like (paw + long shape), and finally what a golden retriever looks like (four legs + folded ears + golden fur). Each step is simple; depth makes complex patterns tractable.
            </Analogy>

            <Analogy label="The Night That Changed AI">
                Legend says that when the ILSVRC 2012 results were announced at a conference in Florence, Italy, the room went quiet. The gap was just too large to explain away. Deep learning researchers had believed for years that their approach would eventually win; now it had won by so much that nobody could argue it was a fluke.
                <br /><br />
                Within 18 months, Google bought Hinton's startup for $44 million. Facebook hired the inventor of CNNs to lead a new lab. Every major tech company started a deep learning team. The entire AI industry reorganised around what one student's 60-million-parameter network had demonstrated in a Florentine conference centre.
            </Analogy>

            <div className="ch-callout">
                <strong>Fun fact:</strong> AlexNet was trained on two GTX 580 GPUs, each with 3 GB of memory &mdash; less than many modern smartphones have. Krizhevsky wrote custom CUDA code by hand because no deep learning framework existed yet. PyTorch and TensorFlow were both still years away.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>AlexNet: Architecture, Decisions, and Why They Worked</h2>

            <p>
                Chapter 9 delivered four algorithmic building blocks: warm initialisation from DBNs,
                ReLU activations, Dropout regularisation, and He/Xavier weight initialisation. AlexNet
                was the first architecture to combine all four in a large CNN trained end-to-end on a
                dataset of genuine scale. Understanding why each architectural decision was made &mdash;
                and what would have happened without it &mdash; is the right way to read this chapter.
            </p>

            <h3>The ILSVRC Benchmark and Why It Mattered</h3>
            <p>
                ImageNet contains 14 million labelled photographs. ILSVRC uses a 1,000-class
                subset with 1.28 million training images, 50,000 validation images, and
                150,000 test images. The evaluation metric is top-5 error: a prediction counts
                as correct if the true label is among the model's five most confident guesses.
                This is a hard benchmark &mdash; the 1,000 classes include fine-grained distinctions
                like 120 breeds of dog.
            </p>
            <p>
                Before 2012, winning entries used the SIFT + Fisher Vector + SVM pipeline.
                The 2011 winner (26.2% top-5 error) represented peak hand-engineered vision.
                AlexNet's 15.3% was not a small increment; it was a discontinuity.
            </p>

            <h3>Architecture: Layer by Layer</h3>
            <p>
                AlexNet processes 224&times;224 RGB images through 5 convolutional layers then 3
                fully connected layers. The key design decisions at each stage:
            </p>
            <ul>
                <li>
                    <strong>Conv1 (96 filters, 11&times;11, stride 4):</strong> The large first filter
                    and aggressive stride rapidly reduce spatial dimensions from 224&times;224 to 55&times;55.
                    Krizhevsky later acknowledged this was too aggressive &mdash; ZFNet improved accuracy
                    by reducing it to 7&times;7 stride 2. But in 2012, memory constraints forced the compromise.
                </li>
                <li>
                    <strong>Conv2 (256 filters, 5&times;5):</strong> Processes features at a slightly larger
                    receptive field. After a max-pool, spatial size drops to 13&times;13.
                </li>
                <li>
                    <strong>Conv3&ndash;5 (384, 384, 256 filters, all 3&times;3):</strong> Three consecutive
                    3&times;3 layers without pooling between them. Together they span an effective receptive
                    field equivalent to a 7&times;7 filter but with three non-linearities instead of one.
                </li>
                <li>
                    <strong>FC6&ndash;7 (4,096 neurons each):</strong> With Dropout (p=0.5). These two layers
                    contain most of AlexNet's 60 million parameters.
                </li>
                <li>
                    <strong>FC8 (1,000 neurons):</strong> Final classifier, followed by softmax.
                </li>
            </ul>

            <h3>Local Response Normalisation (LRN)</h3>
            <p>
                After ReLU activations in Conv1 and Conv2, AlexNet applies Local Response
                Normalisation across adjacent feature maps. The motivation is biological:
                lateral inhibition in the mammalian visual cortex creates competition between
                nearby neurons, enhancing the responses of strongly activated neurons relative
                to weakly activated ones. LRN was later superseded by Batch Normalisation
                (Ioffe &amp; Szegedy, 2015), which achieves a similar regularisation effect
                more efficiently and with less sensitivity to hyperparameters.
            </p>

            <h3>The Two-GPU Architecture</h3>
            <p>
                The GTX 580 had 3 GB of memory in 2012. AlexNet's parameters and activations
                required more than one card could hold. Krizhevsky's solution: partition the
                feature maps in every layer between two GPUs. The two halves operate independently
                except at Conv3 (where both GPUs read from both halves of Conv2's output) and
                at the fully connected layers. This is an early form of model parallelism &mdash;
                a technique that remains essential for training very large models today.
            </p>

            <DefBlock label="Dropout &mdash; Formal Definition">
                During training, each neuron output h is set to zero with probability p = 0.5:
                <br /><br />
                h_dropped = h &middot; mask, where mask ~ Bernoulli(1 &minus; p) independently.
                <br /><br />
                At test time, all neurons are active but outputs are scaled by (1 &minus; p) to
                match the expected value during training. Equivalently, using &quot;inverted dropout,&quot;
                training activations are scaled by 1/(1&minus;p), and test activations are unchanged.
                Dropout prevents co-adaptation: because any neuron may be absent, every neuron must
                learn features that are useful independently.
            </DefBlock>

            <h3>Data Augmentation</h3>
            <p>
                AlexNet used two forms of data augmentation that have become universal:
            </p>
            <ul>
                <li>
                    <strong>Random crops + horizontal flips:</strong> Images are resized to 256&times;256,
                    then 224&times;224 patches are randomly extracted during training. At test time,
                    ten patches are extracted (four corners + centre, each mirrored) and their
                    predictions averaged.
                </li>
                <li>
                    <strong>PCA colour augmentation:</strong> The top-3 principal components of
                    the RGB values across the training set are computed. Random multiples of these
                    components are added to each training image, simulating variation in illumination
                    intensity and colour. This reduced top-1 error by more than 1%.
                </li>
            </ul>

            <div className="ch-callout">
                <strong>Hindsight:</strong> LRN, the two-GPU split, and the large first-layer filter
                are design choices that disappeared in subsequent architectures. What survived
                permanently: ReLU activations, Dropout, data augmentation (crops and flips), and
                the general principle that convolutional layers should be followed by fully connected
                classifiers trained with a cross-entropy loss. AlexNet's influence is measured
                not by what it got right in detail but by what it proved possible in principle.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Convolution dimensions &middot; LRN formula &middot; Dropout analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch AlexNet &middot; original + modern variant</span>
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
            <h2>AlexNet: Mathematical Details</h2>

            <h3>Convolution Output Dimensions</h3>
            <p>
                For a 2D convolution with input width W, kernel size K, padding P, and stride S:
            </p>
            <MathBlock tex="W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - K + 2P}{S} \right\rfloor + 1" />
            <p>
                AlexNet Conv1: W_in = 224, K = 11, P = 2, S = 4 &Rightarrow; W_out = &#8970;(224 &minus; 11 + 4) / 4&#8971; + 1 = 55.
                After 3&times;3 max-pool with stride 2: &#8970;(55 &minus; 3) / 2&#8971; + 1 = 27.
            </p>

            <h3>ReLU and Its Gradient</h3>
            <MathBlock tex="\text{ReLU}(x) = \max(0, x), \qquad \frac{d}{dx}\text{ReLU}(x) = \mathbf{1}[x > 0]" />
            <p>
                For sigmoid: d&sigma;/dx = &sigma;(x)(1 &minus; &sigma;(x)) &le; 0.25. Multiplied across
                L layers: gradient shrinks by at most 0.25^L. For L = 8 this is 1.5&times;10^&#8722;5.
                For ReLU with positive pre-activations: gradient is exactly 1, so no shrinkage through active neurons.
            </p>

            <h3>Local Response Normalisation</h3>
            <MathBlock tex="b_{x,y}^i = \frac{a_{x,y}^i}{\left(k + \alpha \displaystyle\sum_{j=\max(0,\,i-n/2)}^{\min(N-1,\,i+n/2)} \left(a_{x,y}^j\right)^2\right)^\beta}" />
            <p>
                where a_&#123;x,y&#125;^i is the activation of feature map i at spatial position (x,y). AlexNet
                used k = 2, &alpha; = 10^&#8722;4, &beta; = 0.75, n = 5. The sum runs over the 5 nearest
                feature maps. Feature maps with large magnitude suppress their neighbours, creating
                local competition analogous to lateral inhibition in V1.
            </p>

            <h3>Dropout: Expectation Analysis</h3>
            <p>
                Let h be a neuron's output. With dropout probability p, the masked output is:
            </p>
            <MathBlock tex="\tilde{h} = h \cdot m, \quad m \sim \text{Bernoulli}(1-p)" />
            <MathBlock tex="\mathbb{E}[\tilde{h}] = (1-p) \cdot h" />
            <p>
                At test time without dropout: output = h. To match the training expectation, scale by (1&minus;p):
                output = (1&minus;p) &middot; h. Alternatively, scale training by 1/(1&minus;p) (inverted dropout)
                and leave test time unchanged. Inverted dropout is the standard modern implementation.
            </p>
            <p>
                Dropout can be interpreted as training an ensemble of 2^n different network architectures
                (where n is the number of dropout units) sharing weights, then averaging their predictions
                at test time.
            </p>

            <h3>Softmax and Cross-Entropy Loss</h3>
            <MathBlock tex="\hat{p}_k = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}, \qquad \mathcal{L} = -\sum_{k=1}^{K} y_k \log \hat{p}_k" />
            <p>
                For one-hot labels (y_k = 1 only for the correct class c), the loss reduces to
                &minus;log &hat;p_c. The gradient of L with respect to pre-softmax logit z_k is
                simply (&hat;p_k &minus; y_k) &mdash; a clean signal that directly measures the
                probability excess or deficit compared to the ground truth.
            </p>

            <DefBlock label="Parameter Count">
                Conv1: 96 &times; (3 &times; 11&sup2; + 1) = 34,944. Conv2: 256 &times; (96 &times; 5&sup2; + 1) = 614,656.
                Conv3&ndash;5: 384 &times; (256 &times; 9 + 1) + 384 &times; (384 &times; 9 + 1) + 256 &times; (384 &times; 9 + 1) &asymp; 8.4M.
                FC6&ndash;7: 2 &times; (9216 &times; 4096 + 4096) &asymp; 75.5M. FC8: 4096 &times; 1000 + 1000 &asymp; 4.1M.
                Total: approximately 60 million parameters.
            </DefBlock>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── AlexNet Architecture ──────────────────────────────────────────────────────

class AlexNet(nn.Module):
    """
    AlexNet: the 2012 ILSVRC winner that launched the deep learning era.
    8 learnable layers: 5 conv + 3 fully connected.
    60M parameters. ReLU + Dropout + LRN (approximated by BN here).
    """
    def __init__(self, num_classes: int = 1000, dropout: float = 0.5):
        super().__init__()

        self.features = nn.Sequential(
            # Conv1: 224x224 -> 55x55 (stride 4 aggressively downsamples)
            nn.Conv2d(3, 96, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.LocalResponseNorm(size=5, alpha=1e-4, beta=0.75, k=2),
            nn.MaxPool2d(kernel_size=3, stride=2),                # -> 27x27

            # Conv2: 27x27 -> 27x27 (same padding) -> 13x13 after pool
            nn.Conv2d(96, 256, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.LocalResponseNorm(size=5, alpha=1e-4, beta=0.75, k=2),
            nn.MaxPool2d(kernel_size=3, stride=2),                # -> 13x13

            # Conv3-5: 13x13, no pooling between them
            nn.Conv2d(256, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),                # -> 6x6
        )

        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))

        self.classifier = nn.Sequential(
            nn.Dropout(p=dropout),
            nn.Linear(256 * 6 * 6, 4096),   # 9216 -> 4096
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
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
                nn.init.normal_(m.weight, mean=0, std=0.01)
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, mean=0, std=0.01)
                nn.init.constant_(m.bias, 1)   # AlexNet initialised FC biases to 1


# ── Inspect architecture ───────────────────────────────────────────────────────
if __name__ == "__main__":
    model = AlexNet(num_classes=1000)
    x = torch.randn(4, 3, 224, 224)

    y = model(x)
    print(f"Input shape:  {x.shape}")
    print(f"Output shape: {y.shape}")   # (4, 1000)

    total     = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Total parameters: {total:,}")       # ~60M
    print(f"Trainable:        {trainable:,}")

    # Parameter breakdown
    feat_params = sum(p.numel() for p in model.features.parameters())
    cls_params  = sum(p.numel() for p in model.classifier.parameters())
    print(f"  Conv layers:       {feat_params:,}  ({feat_params/total*100:.1f}%)")
    print(f"  FC  layers:        {cls_params:,}  ({cls_params/total*100:.1f}%)")
    # Typical output: Conv ~2.3M (4%), FC ~57.7M (96%)
    # This imbalance motivated later architectures to eliminate large FC layers.`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of AlexNet faithful to the original paper. The key implementation
                details: LocalResponseNorm after Conv1 and Conv2 (now usually replaced by BatchNorm),
                Dropout with p=0.5 before each large FC layer, and the unusual bias initialisation
                (constant 1 in FC layers) that Krizhevsky used to accelerate training.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="alexnet.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>The 96% problem:</strong> Notice that 96% of AlexNet's parameters live in
                the three fully connected layers, not the convolutions. This is the bottleneck that
                VGGNet pushed further and GoogLeNet/ResNet later eliminated via global average pooling.
            </div>
        </>
    )
}

export const ALEXNET_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
