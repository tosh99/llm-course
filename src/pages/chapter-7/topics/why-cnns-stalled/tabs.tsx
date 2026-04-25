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
            year: "1998–2006",
            title: "Computational Limits — No GPU Acceleration",
            challenge:
                "LeNet-5 worked on 32&#215;32 grayscale MNIST images with 60,000 training examples on 1990s CPUs. Scaling to real-world visual recognition required far larger images (224&#215;224 or larger), colour channels, and much larger datasets. Training a network 10&#215; larger than LeNet-5 on 100&#215; more data would take 1,000&#215; longer — on 1998 CPUs, feasible experiments that took days would take years. The compute barrier was not a matter of engineering patience; it was a fundamental limit that blocked progress.",
            what: "Through the early 2000s, CNNs were applied only to small, constrained problems: handwritten character recognition, face detection in controlled conditions, document classification. Every time researchers tried to scale beyond these domains, training time became impractical. GPU computing existed (NVIDIA released the first GPGPU architecture in 2002) but CUDA, the programming interface that made GPUs accessible for general computation, was not released until 2007. Early GPU experiments required hand-coding in graphics shader languages — a formidable barrier for researchers not fluent in computer graphics programming.",
            impact:
                "The compute barrier was the single largest bottleneck preventing CNN adoption in the 2000s. When CUDA arrived (2007) and NVIDIA's GTX 280 offered 933 GFLOPS compared to 50 GFLOPS for a contemporary CPU, the effective speedup was 18&#215;. By 2012, two GTX 580 GPUs could train AlexNet in five to six days — feasible for research. The same training on 2002-era CPUs would have taken years. The GPU revolution is not an exaggeration; it was a genuinely qualitative change that unlocked a decade's worth of accumulated algorithmic ideas.",
        },
        {
            year: "1998–2009",
            title: "Insufficient Labelled Data — No ImageNet",
            challenge:
                "LeNet-5 achieved 99% accuracy on MNIST's 60,000 training examples. But MNIST contains 28&#215;28 greyscale images of ten digit classes under controlled conditions — an extremely simple problem by visual recognition standards. Real-world object recognition requires distinguishing thousands of categories (different dog breeds, car models, bird species) across enormous variation in pose, lighting, background, scale, and occlusion. Training a network to handle this required millions of labelled examples — which simply did not exist in a single, curated dataset before 2009.",
            what: "The largest image datasets available before ImageNet were CIFAR-10 (60,000 images, 10 classes, collected by Krizhevsky and Hinton in 2009) and Caltech-101 (9,146 images, 101 classes). These were far too small to train deep networks without severe overfitting. ImageNet was collected by Fei-Fei Li and colleagues using Amazon Mechanical Turk for labelling, releasing 1.2 million training images across 1,000 categories in 2010 for the ILSVRC challenge. The PASCAL VOC dataset (20 classes, ~10,000 images per year from 2005-2012) provided an intermediate benchmark but was still too small for deep CNN training.",
            impact:
                "ImageNet was a dataset contribution as important as any algorithmic advance. Without 1.2 million labelled training examples, AlexNet would have overfit catastrophically — its 60 million parameters were vastly overparameterised relative to CIFAR or Caltech. The availability of ImageNet is why 2012 was the breakthrough year: it provided the scale of data that deep CNNs required to demonstrate their potential. The lesson generalises: for every subsequent domain (medical imaging, satellite analysis, autonomous driving), the creation of large labelled datasets preceded the demonstrated success of deep learning.",
        },
        {
            year: "1998–2010",
            title: "Vanishing Gradients in Deep CNNs — Sigmoid Activations",
            challenge:
                "Researchers attempting to train deeper CNNs (10, 15, 20 layers) encountered the same vanishing gradient problem that plagued deep feedforward networks. With sigmoid or tanh activations, the derivative at each layer is at most 0.25 or 1.0 respectively. For a 20-layer network with sigmoid activations, the gradient at layer 1 is at most 0.25&#178;&#176; &#8776; 10&#8315;&#185;&#178; times the gradient at layer 20 — numerically zero. Early layers received no learning signal and converged to random initial values.",
            what: "The solution came not from RNN research (where LSTM provided a gating-based fix) but from a simpler observation by Vinod Nair and Geoffrey Hinton (2010): Rectified Linear Units (ReLU) have gradient exactly 1 for positive inputs, allowing arbitrarily deep networks without gradient vanishing. Xavier Glorot, Antoine Bordes, and Yoshua Bengio (2011) provided a formal analysis showing that ReLU-activated networks train faster and generalise better than tanh networks. AlexNet (2012) used ReLU throughout, reporting 6&#215; faster convergence than tanh-based alternatives.",
            impact:
                "ReLU unlocked deep CNN training and is now the default activation in virtually all deep learning models. Its success disproved the assumption that activation functions should be smooth and symmetric — ReLU is neither smooth (non-differentiable at zero) nor symmetric (zero for all negative inputs), yet both properties help rather than hurt. The lesson: empirical results matter more than theoretical aesthetics, and the right activation for a task is determined by trying it, not by intuition.",
        },
        {
            year: "2002–2012",
            title: "The Reign of SVMs and Hand-Crafted Features",
            challenge:
                "During the period when CNNs were stalled, computer vision was dominated by a very different paradigm: hand-crafted feature extraction followed by Support Vector Machines. Researchers would carefully design feature descriptors — algorithms that converted raw images into fixed-size vectors capturing locally invariant properties — and then apply SVMs to classify these feature vectors. This approach required deep domain expertise but was reliable, interpretable, and achievable with the compute and data available.",
            what: "The dominant hand-crafted features were SIFT (Scale-Invariant Feature Transform, Lowe 2004), HOG (Histogram of Oriented Gradients, Dalal-Triggs 2005), and SURF (Speeded-Up Robust Features, Bay et al. 2006). SIFT described local image patches using gradient histograms, invariant to scale and rotation. HOG described object appearance using dense gradient histograms across overlapping blocks — the basis for Dalal-Triggs's celebrated pedestrian detector. These features were combined in bag-of-words models or spatial pyramid matching, then classified by SVMs with RBF or histogram intersection kernels.",
            impact:
                "The SVM+hand-crafted-feature paradigm produced steady progress through the 2000s and was the standard for computer vision research. It required deep domain knowledge (how to engineer the right features for each task) and generalised poorly across domains (pedestrian detection features did not help for scene recognition). The contrast with CNNs — which learn task-appropriate features automatically — became the central argument for end-to-end learning after AlexNet's 2012 victory. The hand-crafted feature paradigm was not just displaced; it was suddenly visible as a costly workaround for the lack of suitable architecture and infrastructure.",
        },
        {
            year: "2012",
            title: "The Perfect Storm — AlexNet and the CNN Renaissance",
            challenge:
                "By 2012, all four barriers had fallen simultaneously. GPUs were fast and programmable (CUDA 5.0). ImageNet provided 1.2 million labelled images. ReLU solved the vanishing gradient. Dropout (Srivastava et al., 2012) provided an effective regularisation method for overparameterised networks. The question was whether these advances together would produce a qualitatively better system or just a marginal improvement over the SVM+HOG baseline.",
            what: "Krizhevsky, Sutskever, and Hinton submitted AlexNet to ILSVRC 2012. The architecture had five convolutional layers and three fully-connected layers, using ReLU activations throughout, dropout in the fully-connected layers, local response normalisation (an early form of normalisation that helped with ReLU's lack of saturation), data augmentation (random crops, horizontal flips, colour jitter), and training on two GTX 580 GPUs for 5-6 days. Top-5 error: 15.3%, versus 26.2% for the second-best entry — a margin of nearly 11 percentage points. The gap between AlexNet and the best hand-crafted-feature systems was stunning: previous year-over-year improvements had been measured in fractions of a percent.",
            impact:
                "AlexNet's margin was so large that it instantly and permanently changed the field. Within one year, every top-5 ILSVRC entrant used a deep CNN. Within three years, CNNs matched human-level performance on ImageNet. The 14-year gap between LeNet-5 (1998) and AlexNet (2012) was not a failure of ideas but a failure of infrastructure — compute, data, and training techniques. Once those prerequisites fell into place simultaneously, the accumulated knowledge of 40 years of CNN research produced an immediate, decisive breakthrough. The CNNs-stalled era is the strongest evidence in machine learning history that algorithmic ideas and infrastructure must be aligned for a breakthrough to occur.",
        },
        {
            year: "2012–Present",
            title: "The Bridge to Classical ML — Why SVMs and Random Forests Also Mattered",
            challenge:
                "While CNNs were waiting for their moment, the years 1998-2012 saw the golden age of classical machine learning: SVMs with kernel tricks, AdaBoost and boosted classifiers, Random Forests, and gradient boosted trees. These methods did not require large datasets or GPU compute, were theoretically well-understood, and produced reliable results across many domains. They dominated tabular data, scientific data, NLP (via bag-of-words features), and every computer vision task where deep learning was not yet competitive.",
            what: "SVMs (Vapnik and Cortes, 1995) provided theoretically grounded maximum-margin classification. Boosting methods (Schapire 1990, Freund-Schapire 1997) showed that combining many weak classifiers could produce strong classifiers — the basis for AdaBoost, which Viola and Jones used for real-time face detection in 2001. Random Forests (Breiman, 2001) provided an ensemble method that was fast, interpretable, and resistant to overfitting. These methods dominated the KDD Cup, Netflix Prize, and Kaggle competition era of 2005-2012.",
            impact:
                "Classical ML methods remain essential in 2024 for structured/tabular data, where deep learning often underperforms gradient boosted trees (XGBoost, LightGBM). The 2000s were not a wasted decade — they produced the theoretical and practical foundations of ensemble methods, SVMs, and kernel machines that are still used in production systems worldwide. Chapter 8 covers this golden age of classical ML in detail, tracing the development from SVMs through Random Forests to gradient boosting — the algorithms that ruled while CNNs waited for their moment.",
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
            <h2>Why the superhero suit took a very long nap</h2>

            <Analogy label="A Superhero Suit Without Power">
                Imagine you have a superhero suit (LeNet-5) that can theoretically let you see and recognise anything. But the suit has four problems:
                <br /><br />
                <strong>Problem 1 — No batteries.</strong> The suit needs enormous power to work on big, complex pictures. In the 1990s, computers were like tiny batteries. They could run the suit on tiny 28&#215;28 pixel images of digits, but anything bigger made the suit too slow to be useful. You'd have to wait hours for each guess.
                <br /><br />
                <strong>Problem 2 — Not enough practice photos.</strong> The suit needs millions of example photos to get good at recognising things. In 1998, nobody had organised millions of labelled photos into one place. It was too expensive and too much work before the internet made collecting images easy.
                <br /><br />
                <strong>Problem 3 — The learning signal fades.</strong> When the suit made mistakes and tried to learn from them, the correction signal got smaller and smaller as it travelled through the layers. By the time it reached the early layers, the signal was gone — like trying to hear a whisper through a thick wall. The suit couldn't improve its early-layer skills.
                <br /><br />
                <strong>Problem 4 — Stubborn competition.</strong> While the superhero suit was struggling, other engineers had built different systems — not superheroes, but very clever detectives (SVMs and HOG features). These detectives were slower and required more human help, but they worked reliably right now. Most scientists stuck with the reliable detectives.
            </Analogy>

            <Analogy label="SIFT, HOG, and the Detective Era">
                The competing approach to CNNs was to hand-design the features yourself. Instead of letting the network learn what edges and textures to look for, human experts wrote mathematical formulas describing them.
                <br /><br />
                SIFT (2004) described local patches using histograms of pixel gradients — a clever mathematical summary of what an image patch looks like from any angle. HOG (2005) described objects by counting edge orientations in small blocks across the image — the basis for one of the best pedestrian detectors ever built without neural networks.
                <br /><br />
                These hand-crafted features, combined with SVMs (a clever mathematical classifier), could recognise faces in photos in real-time on 2001 hardware. That was remarkable, and it's why the computer vision community trusted them and was skeptical of LeNet-style networks that couldn't yet compete.
            </Analogy>

            <Analogy label="2012 — All Four Problems Solved at Once">
                By 2012, all four problems had been solved, and they were all solved around the same time:
                <br /><br />
                <strong>Problem 1 solved:</strong> NVIDIA released CUDA in 2007, and by 2012 a pair of graphics cards could do what a server farm did in 2002, at 18&#215; the speed. Suddenly training a big network took days, not years.
                <br /><br />
                <strong>Problem 2 solved:</strong> Fei-Fei Li and colleagues used Amazon Mechanical Turk to label 1.2 million images across 1,000 categories. The ImageNet dataset was born, and it was 20&#215; larger than anything before.
                <br /><br />
                <strong>Problem 3 solved:</strong> Researchers discovered ReLU — a ridiculously simple activation function (keep positive values, zero out negative values) — that let the learning signal flow cleanly through 20+ layers without fading.
                <br /><br />
                <strong>Problem 4 solved:</strong> When AlexNet entered the 2012 ImageNet competition and won by the biggest margin ever seen — 15.3% error versus 26.2% for second place — the detectives conceded. The superhero suit had finally woken up.
            </Analogy>

            <Analogy label="The Lesson — Ideas Need Infrastructure">
                LeNet-5 in 1998 was the right idea at the wrong time. The architecture was correct — essentially the same as AlexNet 2012 — but it needed three things that didn't exist yet: fast compute, large datasets, and ReLU. Without all three simultaneously, the idea couldn't prove itself.
                <br /><br />
                This pattern repeats throughout technology: a correct idea arrives before its supporting infrastructure, waits in relative obscurity, then explodes into dominance when the prerequisites align. The CNN's 14-year hiatus is not a failure — it's the normal lifecycle of a breakthrough idea that arrived ahead of its time.
            </Analogy>

            <Analogy label="What comes next — the Classical ML Golden Age">
                While CNNs were waiting for GPUs and ImageNet, a completely different group of algorithms was thriving: SVMs, Random Forests, and gradient boosted trees. These methods dominated the competitions and real-world deployments of the 2000s. They required no GPU, no millions of images, and were theoretically well-understood.
                <br /><br />
                Chapter 8 tells their story — from Vapnik's Support Vector Machine (1995) through Breiman's Random Forests (2001) to the gradient boosted trees that still outperform deep learning on many tabular data problems today. Understanding these methods is essential both historically (they dominated for 14 years) and practically (XGBoost and LightGBM are still the best tools for structured data in 2024).
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The four barriers — a quantitative post-mortem</h2>

            <h3>Barrier 1: Compute — The GPU Gap</h3>
            <p>
                Training time scales approximately as:
            </p>
            <MathBlock tex="T \approx \frac{B \times H \times W \times C_{\text{in}} \times C_{\text{out}} \times k^2 \times N \times E}{\text{FLOPS/s}}" />
            <p>
                where N = dataset size and E = epochs. For AlexNet-scale training:
            </p>
            <ul>
                <li>N = 1.2M images, E = 90 epochs, &#8776; 10&#185;&#8312; FLOPs total</li>
                <li>2002 CPU at 50 GFLOPS: 10&#185;&#8312;/(5&#215;10&#185;&#185;) &#8776; 200,000 seconds &#8776; 55 hours per layer</li>
                <li>2012 GTX 580 at 1.5 TFLOPS: same 10&#185;&#8312; FLOPs in &#8776; 67 seconds per layer</li>
                <li>AlexNet on 2 GPUs: 5-6 days — feasible research. On 2002 CPU: 10+ years — not feasible</li>
            </ul>

            <h3>Barrier 2: Data Scarcity</h3>
            <p>
                The VC dimension of AlexNet is approximately proportional to its parameter count:
                d&#8486; &#8776; 60 million. PAC learning theory bounds the number of samples needed:
            </p>
            <MathBlock tex="N \geq \Omega\!\left(\frac{d_{VC}}{\varepsilon^2}\right)" />
            <p>
                For &#949; = 0.05 error tolerance: N &#8805; 60M/0.0025 = 24 billion samples. This is
                far larger than achievable, but in practice CNNs generalise with far fewer samples
                due to the strong inductive bias from weight sharing. Empirically, AlexNet requires
                &#8776; 1,000 images per class (1,200 per class for 1,000 classes) — the ImageNet scale.
                CIFAR-10's 6,000 images per class (60K total, 10 classes) is too small for a 60M
                parameter network without severe regularisation.
            </p>

            <h3>Barrier 3: Vanishing Gradients with Sigmoid/Tanh</h3>
            <p>
                For a network with L layers using sigmoid activation, the gradient at layer 1:
            </p>
            <MathBlock tex="\left\|\frac{\partial \mathcal{L}}{\partial W^{(1)}}\right\| \leq (0.25)^L \cdot \left\|\frac{\partial \mathcal{L}}{\partial W^{(L)}}\right\|" />
            <p>
                At L = 8 (AlexNet depth): 0.25&#8312; &#8776; 1.5 &#215; 10&#8315;&#8309; — gradients at layer 1 are 66,000&#215; smaller
                than at the output. Training stalls. With ReLU (gradient = 1 for positive inputs):
            </p>
            <MathBlock tex="\left\|\frac{\partial \mathcal{L}}{\partial W^{(1)}}\right\| \leq 1^L \cdot \left\|\frac{\partial \mathcal{L}}{\partial W^{(L)}}\right\| = \left\|\frac{\partial \mathcal{L}}{\partial W^{(L)}}\right\|" />
            <p>
                Gradient magnitude at layer 1 equals gradient magnitude at the output — no decay.
                AlexNet reported 6&#215; faster convergence with ReLU over tanh for the same architecture.
            </p>

            <h3>Barrier 4: The SVM+HOG Paradigm</h3>
            <p>
                The SIFT feature descriptor for a 16&#215;16 image patch produces a 128-dimensional vector:
                4&#215;4 spatial blocks, each with an 8-bin gradient histogram. HOG for pedestrian detection
                used 64&#215;128 pixel windows, 8&#215;8 pixel cells, 2&#215;2 block overlap, producing &#8776; 3,780
                dimensional feature vectors. SVMs with RBF kernels on these features achieved:
            </p>
            <ul>
                <li>PASCAL VOC 2010 (20 classes): 41.6% mAP with SVM+SIFT (DPM)</li>
                <li>PASCAL VOC 2012 (20 classes): 53.3% mAP with CNN (AlexNet) — 28% relative improvement</li>
                <li>ILSVRC 2012: 26.2% top-5 error with SVM+SIFT vs 15.3% with AlexNet — 42% relative improvement</li>
            </ul>
            <p>
                AlexNet's margin over SVMs was far larger than any year-over-year improvement in the SVM era.
                This is why 2012 was a phase transition, not an incremental improvement.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The lesson for infrastructure and ideas:</strong> The four barriers fell independently — GPUs arrived in 2007 (CUDA), ImageNet in 2010, ReLU in 2010-2011, dropout in 2012. Any single advance was insufficient. All four together were necessary and sufficient. This is a general pattern: breakthrough technologies often require multiple independent prerequisites to align simultaneously, which is why they appear sudden despite decades of prior work. The "overnight success" of AlexNet was built on 23 years of foundations from Fukushima (1980) to CUDA (2007) to ImageNet (2010).
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
            <h2>Mathematical analysis of the four barriers</h2>

            <DefBlock label="Compute Complexity of CNN Training">
                For a convolutional layer with H&#215;W output spatial size, C&#7495;&#7510; input channels, C&#7506;&#7512;&#7511; output channels,
                and k&#215;k kernel, the forward pass FLOPs per image are:
                <MathBlock tex="\text{FLOPs} = 2 \times H \times W \times C_{\text{out}} \times k^2 \times C_{\text{in}}" />
                (factor 2 for multiply-add). For AlexNet's 5 conv layers + 3 FC layers: &#8776; 1.4 GFLOPs per image.
                At batch size 128, 1.2M images, 90 epochs: &#8776; 1.92 &#215; 10&#185;&#178; FLOPs total.
            </DefBlock>

            <h3>Vanishing Gradient in Deep Sigmoid Networks</h3>
            <p>
                For L sigmoid layers with weights initialised from &#119977;(0, &#963;&#178;), the variance of the gradient
                at layer 1 relative to layer L satisfies:
            </p>
            <MathBlock tex="\text{Var}\left[\frac{\partial \mathcal{L}}{\partial W^{(1)}}\right] = \text{Var}\left[\frac{\partial \mathcal{L}}{\partial W^{(L)}}\right] \cdot \prod_{l=1}^{L-1} \left[n_l \sigma^2 \cdot \frac{1}{4}\right]^2" />
            <p>
                where n&#8319; is the width of layer l and 1/4 = max(&#963;'(z))&#178;. For n&#8319;&#963;&#178;/4 &#60; 1, this variance
                vanishes exponentially with L. Glorot-Bengio (2010) showed the "Xavier" initialisation
                &#963;&#178; = 2/(n&#7497;&#7510; + n&#7506;&#7512;&#7511;) achieves variance &#8776; 1 per layer for tanh, but not for sigmoid.
            </p>

            <h3>ReLU Solves the Gradient Problem</h3>
            <p>
                For ReLU, the derivative is 1 for positive inputs (probability p &#8776; 0.5 at initialisation):
            </p>
            <MathBlock tex="\mathbb{E}\!\left[\text{ReLU}'(z)^2\right] = P(z > 0) = \frac{1}{2}" />
            <p>
                With He initialisation &#963;&#178; = 2/n&#7497;&#7510;, the variance is preserved:
                <InlineMath tex="n_{\text{in}} \cdot \sigma^2 \cdot \frac{1}{2} = 1" />.
                Gradients neither vanish nor explode regardless of depth L.
            </p>

            <h3>SVM Margin — Why SVMs Were Trusted</h3>
            <p>
                An SVM with RBF kernel &#954;(x,x') = exp(-&#947;&#61026;x-x'&#61026;&#178;) maximises the margin between classes.
                The dual problem:
            </p>
            <MathBlock tex="\max_\alpha \sum_i \alpha_i - \frac{1}{2}\sum_{i,j} \alpha_i \alpha_j y_i y_j \kappa(x_i, x_j) \quad \text{s.t.} \quad 0 \leq \alpha_i \leq C" />
            <p>
                SVMs have strong PAC learning guarantees: for margin &#947; and VC bound d, the generalisation
                error is bounded by O(d&#178;/&#947;&#178;m) for m samples — a bound that does not explicitly depend
                on the input dimension, making SVMs very effective for high-dimensional hand-crafted features.
                This theoretical grounding (versus CNNs' empirical performance) is why SVMs were trusted
                while CNNs were not, in the pre-AlexNet era.
            </p>

            <h3>Dropout — The Missing Regulariser</h3>
            <p>
                Dropout (Srivastava, Hinton et al., 2014) randomly zeros activations with probability p
                during training. At inference, activations are scaled by (1-p). The expected output is:
            </p>
            <MathBlock tex="\mathbb{E}[\tilde{h}] = (1-p) \cdot h" />
            <p>
                Dropout is equivalent to training an exponential ensemble of sub-networks: with n units
                and dropout probability 0.5, there are 2&#8319; possible sub-networks. This ensemble effect
                provides strong regularisation for overparameterised networks like AlexNet (60M params
                on 1.2M images). Without dropout, AlexNet would overfit catastrophically on ImageNet.
            </p>

            <div className="ch-callout">
                <strong>Timeline of prerequisites:</strong> Each barrier was solved independently, years
                before AlexNet demonstrated their combined effect. GPU acceleration (CUDA 2007) preceded
                ImageNet (2010) by 3 years; ImageNet preceded ReLU's recognition (2010-2011) by 0-1 years;
                all preceded dropout's formalisation (2012) by 2 years. The 2012 breakthrough required
                all four simultaneously — explaining why progress appeared sudden despite 14 years of
                preparatory work.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import numpy as np

# ── Demonstrating vanishing gradients with depth ────────────────────────────────
def gradient_magnitude_at_depth(depth, activation='sigmoid'):
    """Measure gradient magnitude at layer 1 vs. layer depth."""
    layers = []
    for _ in range(depth):
        layers.append(nn.Linear(64, 64))
        if activation == 'sigmoid':
            layers.append(nn.Sigmoid())
        elif activation == 'tanh':
            layers.append(nn.Tanh())
        elif activation == 'relu':
            layers.append(nn.ReLU())

    model = nn.Sequential(*layers)

    x = torch.randn(8, 64, requires_grad=True)
    out = model(x)
    out.sum().backward()

    return x.grad.abs().mean().item()

print("Gradient magnitude at input layer vs. depth:")
print(f"{'Depth':>8}  {'sigmoid':>12}  {'tanh':>12}  {'relu':>12}")
for d in [2, 5, 10, 20, 50]:
    g_sig  = gradient_magnitude_at_depth(d, 'sigmoid')
    g_tanh = gradient_magnitude_at_depth(d, 'tanh')
    g_relu = gradient_magnitude_at_depth(d, 'relu')
    print(f"{d:8d}  {g_sig:12.2e}  {g_tanh:12.2e}  {g_relu:12.2e}")

print()
print("Conclusion:")
print("  - Sigmoid: gradient vanishes rapidly (max derivative 0.25)")
print("  - Tanh: better but still vanishes at depth > 20")
print("  - ReLU: gradient stays roughly constant regardless of depth!")

# ── Compute efficiency: GPU vs CPU ─────────────────────────────────────────────
print()
print("=" * 55)
print("Compute efficiency comparison (estimated)")
print("=" * 55)

# AlexNet total FLOPs: ~1.4 GFLOPs per image
flops_per_image = 1.4e9
n_images = 1_200_000   # ImageNet
n_epochs = 90
batch_size = 128

total_flops = flops_per_image * n_images * n_epochs * 3  # 3x for backward

cpu_gflops  = 50      # 2002 CPU (GFLOPS)
gpu_gflops  = 1500    # 2012 GTX 580 x2 (GFLOPS)

cpu_seconds = total_flops / (cpu_gflops * 1e9)
gpu_seconds = total_flops / (gpu_gflops * 1e9)

print(f"Total FLOPs for AlexNet training: {total_flops:.2e}")
print()
print(f"2002 CPU  ({cpu_gflops:4d} GFLOPS): {cpu_seconds:,.0f}s = {cpu_seconds/86400:.0f} days")
print(f"2012 GPU  ({gpu_gflops:4d} GFLOPS): {gpu_seconds:,.0f}s = {gpu_seconds/3600:.1f} hours")
print(f"Speedup: {cpu_seconds/gpu_seconds:.0f}x")
print()
print("Without GPU: training AlexNet on 2002 hardware would take decades.")
print("With GPU: 5-6 days. The difference is why 2012 was the breakthrough year.")

# ── SVM vs CNN feature comparison ─────────────────────────────────────────────
print()
print("=" * 55)
print("Feature engineering vs. learning (conceptual)")
print("=" * 55)
print("SVM + HOG pipeline:")
print("  1. Compute pixel gradients (manual)")
print("  2. Build gradient histograms per cell (manual)")
print("  3. Normalise blocks (manual)")
print("  4. Concatenate to feature vector (manual)")
print("  5. Train SVM on feature vectors")
print("  Parameters: SVM alphas + HOG hyperparameters")
print()
print("CNN pipeline:")
print("  1. Learn filters from data (automatic)")
print("  2. Learn higher-level combinations (automatic)")
print("  3. Learn all the way to class probabilities (automatic)")
print("  Parameters: All conv + FC weights (learned end-to-end)")
print()
print("ILSVRC 2012 results:")
print("  HOG + SVM (best non-neural): 26.2% top-5 error")
print("  AlexNet (CNN):               15.3% top-5 error")
print("  Improvement:                 42% relative error reduction")`

function PythonContent() {
    return (
        <>
            <p>
                Three experiments: (1) measuring gradient magnitude at the input layer as a function
                of network depth, comparing sigmoid, tanh, and ReLU; (2) estimating training time
                for AlexNet on 2002-era CPUs vs. 2012-era GPUs; and (3) a conceptual comparison
                of the SVM+HOG pipeline versus the CNN end-to-end learning pipeline.
            </p>
            <CodeBlock code={PY_CODE} filename="cnn_barriers.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Looking ahead:</strong> While CNNs were stalled from 1998-2012, the classical ML
                era produced SVMs (1995), AdaBoost (1997), Random Forests (2001), and gradient boosting
                (2001). These algorithms are covered in Chapter 8. Today, gradient boosted trees
                (XGBoost, LightGBM, CatBoost) still outperform deep learning on most tabular datasets —
                the classical ML golden age was not made obsolete by CNNs, just displaced from image tasks.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const WHY_CNNS_STALLED_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
