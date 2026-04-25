import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Autoencoder Diagram ───────────────────────────────────────────────────────

function AutoencoderDiagram() {
    const w = 480, h = 220

    const layers = [
        { label: "Input",      nodes: 5, x: 50,  color: "#5a9ab9" },
        { label: "Hidden 1",   nodes: 4, x: 150, color: "#8e8a82" },
        { label: "Bottleneck", nodes: 2, x: 240, color: "#e8a838" },
        { label: "Hidden 2",   nodes: 4, x: 330, color: "#8e8a82" },
        { label: "Output",     nodes: 5, x: 430, color: "#5ab98c" },
    ]

    const cy = h / 2
    const nodeR = 9
    const nodeSpacing = 30

    type NodePos = { x: number; y: number; color: string }
    const nodePositions: NodePos[][] = layers.map(layer => {
        const total = (layer.nodes - 1) * nodeSpacing
        const startY = cy - total / 2
        return Array.from({ length: layer.nodes }, (_, i) => ({
            x: layer.x,
            y: startY + i * nodeSpacing,
            color: layer.color,
        }))
    })

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">AUTOENCODER — ENCODER → BOTTLENECK → DECODER</text>

            {nodePositions.slice(0, -1).map((fromLayer, li) =>
                fromLayer.flatMap((from, fi) =>
                    nodePositions[li + 1].map((to, ti) => (
                        <line key={`${li}-${fi}-${ti}`}
                            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                            stroke={li === 1 ? "#e8a838" : "#252535"}
                            strokeWidth={li === 1 ? "0.8" : "0.6"}
                            opacity={li === 1 ? "0.25" : "0.18"} />
                    ))
                )
            )}

            <rect x={50} y={28} width={150} height={18} rx="3" fill="rgba(90,154,185,0.08)" stroke="rgba(90,154,185,0.25)" strokeWidth="1" />
            <text x={125} y={40} textAnchor="middle" fill="#5a9ab9" fontSize="6.5" fontFamily="JetBrains Mono,monospace">ENCODER</text>
            <rect x={240} y={28} width={190} height={18} rx="3" fill="rgba(90,185,140,0.08)" stroke="rgba(90,185,140,0.25)" strokeWidth="1" />
            <text x={335} y={40} textAnchor="middle" fill="#5ab98c" fontSize="6.5" fontFamily="JetBrains Mono,monospace">DECODER</text>

            {nodePositions.map((layerNodes, li) =>
                layerNodes.map((node, ni) => (
                    <circle key={`n-${li}-${ni}`}
                        cx={node.x} cy={node.y} r={nodeR}
                        fill={li === 2 ? "#e8a838" : "#141420"}
                        stroke={node.color} strokeWidth={li === 2 ? "2" : "1.5"}
                        opacity={li === 2 ? "0.9" : "0.85"} />
                ))
            )}

            {layers.map((layer, li) => (
                <text key={li} x={layer.x} y={h - 8} textAnchor="middle"
                    fill={layer.color} fontSize="5.5" fontFamily="JetBrains Mono,monospace">
                    {layer.label}
                </text>
            ))}

            <line x1={240} y1={cy + 60} x2={240} y2={cy + 46}
                stroke="#e8a838" strokeWidth="1" strokeDasharray="3,2" />
            <text x={240} y={cy + 70} textAnchor="middle" fill="#e8a838"
                fontSize="5.5" fontFamily="JetBrains Mono,monospace">z (latent code)</text>

            <text x={240} y={16} textAnchor="middle" fill="#3a3a50"
                fontSize="5" fontFamily="JetBrains Mono,monospace">
                x → f_enc(x) → z → f_dec(z) → x&#770;  ·  minimise ‖x − x&#770;‖²
            </text>
        </svg>
    )
}

// ── Timeline ──────────────────────────────────────────────────────────────────

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
            year: "1986",
            title: "Rumelhart, Hinton and Williams — Backpropagation Without Labels",
            challenge:
                "Backpropagation (also 1986) made it possible to train multi-layer networks on supervised tasks. But labeled datasets were expensive and scarce. Most data in the world — images, text, audio — had no labels attached. The perceptron and MLP had been conceived as supervised learners. Could the same backpropagation algorithm train a network without any external supervision at all? The question was whether the algorithm could be turned inward — using the data as its own teacher.",
            what: "Rumelhart, Hinton, and Williams proposed the autoencoder in the same 1986 backpropagation paper that launched the connectionist revolution. The architecture was symmetric: an encoder half compressed the input through progressively smaller layers to a narrow bottleneck, and a decoder half reconstructed the original from the bottleneck code. Backpropagation minimised the reconstruction error between input and output — no labels needed, since the input itself was the target.",
            impact:
                "The autoencoder was the first practical demonstration that backpropagation could be used for unsupervised representation learning. The bottleneck forced the network to discover compact, useful internal representations — the same principle that later drove Word2Vec (2013), denoising autoencoders (2008), variational autoencoders (2013, covered in Chapter 11), and BERT's masked pretraining (2018, covered in Chapter 19). The key insight — train a network by making it reconstruct its own input — became one of the most productive ideas in all of deep learning.",
        },
        {
            year: "1988 – 1989",
            title: "Cottrell, Baldi and Hornik — What Does the Bottleneck Actually Learn?",
            challenge:
                "The autoencoder idea was elegant, but what exactly did it learn? Two competing interpretations existed. The first: the bottleneck was simply compressing the data, finding a low-dimensional representation by trial and error. The second: the autoencoder was discovering statistically meaningful structure — finding the dimensions along which the data actually varied, not just an arbitrary compression. Understanding which interpretation was correct would determine how much to trust autoencoder representations.",
            what: "Garrison Cottrell and Janet Metcalfe (1987) applied autoencoders to face recognition, showing that the bottleneck representations were interpretable and generalised to new faces. Baldi and Hornik (1989, Neural Networks) proved the decisive theoretical result: a linear autoencoder has the same global minima as Principal Component Analysis. The encoder's weight matrix spans the same subspace as the top-k eigenvectors of the data covariance matrix. Any global minimum is a rotation of the PCA solution.",
            impact:
                "The Baldi-Hornik theorem connected autoencoders to a century of statistical tradition (PCA, factor analysis, dimensionality reduction). It validated the reconstruction objective as a principled criterion for finding linear structure in data. Equally important, it clarified what non-linear activations add: the ability to find curved, non-linear manifolds that PCA cannot capture. A linear autoencoder is PCA; a non-linear autoencoder is its generalisation.",
        },
        {
            year: "1991 – 1993",
            title: "Kramer — Non-Linear PCA and Manifold Learning",
            challenge:
                "The Baldi-Hornik theorem showed linear autoencoders were PCA. The natural question was what non-linear autoencoders learned. If data lay on a curved low-dimensional manifold embedded in high-dimensional space — like a Swiss roll in 3D — PCA would fail to unroll it. Non-linear autoencoders might succeed. But without a theory analogous to the PCA theorem, researchers couldn't predict or control what the bottleneck representations would look like.",
            what: "Mark Kramer (1991, AIChE Journal) introduced non-linear PCA using autoencoders with sigmoid hidden layers, applying them to chemical process monitoring. He demonstrated that non-linear autoencoders could extract curved manifold structure that linear PCA missed, and that the latent code provided a more compact and interpretable representation for process data. The term 'non-linear PCA' framed autoencoders as a natural extension of a classical method.",
            impact:
                "Kramer's engineering application showed autoencoders working at a practical scale on real industrial data. More conceptually, it established the manifold learning interpretation: the encoder maps data from high-dimensional space to the intrinsic low-dimensional manifold, and the decoder maps back. This framing became central to the variational autoencoder (Kingma and Welling, 2013) and to the latent diffusion models (Rombach et al., 2022) that power modern image generation.",
        },
        {
            year: "1994 – 2000",
            title: "Pretraining and Compression — Autoencoders in the AI Winter",
            challenge:
                "Through the mid-1990s, neural networks were losing ground to support vector machines and other statistical methods. Autoencoders, however, retained a niche: they were the primary tool for unsupervised feature learning, used for data compression and dimensionality reduction in domains where labeled data was unavailable. They also appeared as a diagnostic tool — if an autoencoder trained on normal data fails to reconstruct an input accurately, that input is likely anomalous.",
            what: "Cottrell and colleagues continued refining face compression using autoencoders. Research groups applied autoencoders to compression of satellite imagery, financial time series, and biosignals. LeCun and colleagues used autoencoder-like objectives in the contrastive self-supervised learning framework that would later evolve into modern self-supervised learning. The period was one of consolidation rather than breakthrough — the basic autoencoder idea was being applied and its properties understood.",
            impact:
                "Anomaly detection via reconstruction error became a standard industrial application: train on normal examples, flag inputs with high reconstruction loss as anomalies. This pattern remains in use today for fraud detection, manufacturing defect inspection, and network intrusion detection. The insight — that a model trained only on normal data will reconstruct abnormal data poorly — is simple, principled, and surprisingly effective.",
        },
        {
            year: "2006",
            title: "Hinton — Autoencoders as Deep Generative Models",
            challenge:
                "The deep learning revival of 2006 (Hinton et al., Science) used greedy layer-wise pretraining with Restricted Boltzmann Machines to initialise deep networks. But Hinton also showed that the same idea could be reformulated as a deep autoencoder: pretrain each pair of layers as an RBM, then unfold the result into an encoder-decoder pair and fine-tune end-to-end with backpropagation. This gave a practical recipe for training deep autoencoders — something that had been impossible with random initialisation due to vanishing gradients.",
            what: "Hinton and Salakhutdinov's Science paper (2006) demonstrated that deep autoencoders — 4-5 hidden layers per side — learned dramatically better representations than shallow autoencoders or linear PCA. On a 20,000-dimensional document bag-of-words dataset, a deep autoencoder with a 2D bottleneck produced a 2D map of documents that revealed semantic clusters invisible to PCA. On image data, deep autoencoders reconstructed images far more faithfully than shallow ones.",
            impact:
                "This paper demonstrated that depth genuinely helped autoencoders learn better representations — not just in theory (UAT) but empirically, on real data. It also established the autoencoder as a pre-training tool: use the encoder weights to initialise a deep supervised classifier, then fine-tune. This pretraining strategy dominated the field from 2006 to 2012, when supervised deep networks with ReLU and dropout became practical without pretraining.",
        },
        {
            year: "2008 – 2013 and beyond",
            title: "Denoising, Sparse, Variational — The Autoencoder Family Branches",
            challenge:
                "The basic autoencoder was powerful but had a known failure mode: given a large enough bottleneck, it could simply learn the identity function and copy inputs to outputs without learning any useful structure. The bottleneck was a blunt architectural constraint. Researchers wanted principled ways to control what the network learned — representations that were not just compact but robust, interpretable, and generative.",
            what: "Vincent et al. (2008, ICML) introduced the denoising autoencoder: corrupt the input (add Gaussian noise, mask pixels) and train to reconstruct the clean original. This forced the network to learn the data manifold rather than just memorise inputs. Kingma and Welling (2013, ICLR 2014) introduced the variational autoencoder (VAE): the encoder output is a distribution (mean and variance), the latent code is sampled from it, and a KL divergence term regularises the latent space toward a standard Gaussian. VAEs enabled principled generation of new data by sampling from the latent prior.",
            impact:
                "The autoencoder family — standard, denoising, sparse, contractive, variational — covers the spectrum from compression to generation. Denoising autoencoders are the conceptual ancestor of diffusion models (Chapter 23). VAEs remain a foundation of generative modelling. The reconstruction objective, introduced in 1986, proved to be one of the most productive training signals in deep learning — enabling self-supervised learning decades before the term was coined. Chapter 6 takes up a question autoencoders cannot answer: what happens when you need to model temporal sequences rather than static inputs?",
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

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>A network that learns to squish and unsquish information</h2>

            <p className="ch-story-intro">
                Backpropagation let neural networks learn from labeled examples. But labels are expensive — most data in the world comes without them. The autoencoder was backpropagation's first answer to that problem: make the network learn by reconstructing its own input, with no labels at all.
            </p>

            <Analogy label="The Basic Idea — Compress and Reconstruct">
                Imagine taking a very detailed photo, compressing it into a tiny thumbnail, and then trying to reconstruct the original photo from the thumbnail. If you succeed, you've learned something important about what the photo "really is" — you've discovered which parts of it matter most and which can be discarded.
                <br /><br />
                An <strong>autoencoder</strong> does exactly this: it is a neural network trained to compress its input into a small "summary" (the bottleneck) and then reconstruct the original from that summary. The only supervision it needs is the input data itself. No labels required.
            </Analogy>

            <DiagramBlock title="Autoencoder — compress to bottleneck, then reconstruct">
                <AutoencoderDiagram />
            </DiagramBlock>

            <Analogy label="The Encoder Half">
                The first half (the encoder) squishes the input down to a compact vector called the <strong>latent code</strong> or simply <strong>z</strong>. If the input has 784 dimensions (a 28×28 image) and z has 32 dimensions, the encoder must decide what 32 numbers best summarise the image.
                <br /><br />
                Think of it as a translator who must express a full paragraph in a single sentence. The translator has to decide what is essential and what can be safely left out. The network learns to make this decision automatically — not because it was told what "essential" means, but because whatever it keeps must be enough for the decoder to reconstruct the original.
            </Analogy>

            <Analogy label="The Decoder Half">
                The second half (the decoder) takes the compact code and tries to recreate the original input. The whole network is trained end-to-end to minimise the difference between the original and the reconstruction.
                <br /><br />
                After training, the bottleneck z contains only the most important information about the input. Two inputs that are similar will have similar z values. Inputs that are very different — a cat photo vs. a car photo — will have very different z values, even though both have been compressed to the same number of dimensions.
            </Analogy>

            <Analogy label="What Autoencoders Learn — A Secret Code">
                After training, the bottleneck has learned a "secret code" for describing inputs. For a dataset of face images, the code might capture: how old does the person look? How wide is the face? Is there facial hair? Not because anyone told the network those were the right features — but because those happen to be the dimensions along which face images vary most.
                <br /><br />
                This is the same insight as PCA (Chapter 1), but richer: where PCA finds the directions of maximum variance with a linear transformation, a non-linear autoencoder can find curved directions on the data manifold. Baldi and Hornik proved in 1989 that a linear autoencoder literally is PCA; a non-linear one is PCA's more powerful cousin.
            </Analogy>

            <Analogy label="Uses — Compression, Anomaly Detection, Generation">
                Autoencoders have three main practical uses. First, <strong>dimensionality reduction</strong>: use the encoder to compress data for visualisation or for feeding into another model. Second, <strong>anomaly detection</strong>: train only on normal data; when shown an anomaly (a defective product, a fraudulent transaction), the autoencoder won't know how to reconstruct it well, so the reconstruction error will be high — flagging it as unusual. Third, with the variational autoencoder, <strong>generation</strong>: sample a random code z and pass it through the decoder to generate a new image that resembles the training data.
            </Analogy>

            <Analogy label="What comes next — networks with memory">
                Autoencoders treat each input independently — they compress and reconstruct one image at a time, with no memory of what came before. But the world is full of sequences: speech, text, music, video. The meaning of a word depends on the words that preceded it. A single frame of a video only makes sense in the context of the frames before and after.
                <br /><br />
                That question — how to give a network memory of past inputs — is exactly what Chapter 6 addresses. Recurrent Neural Networks use the same backpropagation algorithm from Chapter 5, but apply it to networks with feedback loops that carry information forward in time. Where the autoencoder compressed space, the RNN will learn to compress time.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>Unsupervised representation learning via reconstruction</h2>

            <p>
                An autoencoder consists of two parts: an encoder <InlineMath tex="f_\phi: \mathbb{R}^d \to \mathbb{R}^k" /> (k &lt; d) and a decoder <InlineMath tex="g_\theta: \mathbb{R}^k \to \mathbb{R}^d" />. Training minimises the reconstruction loss over the dataset:
            </p>
            <MathBlock tex="\mathcal{L} = \frac{1}{n} \sum_{i=1}^n \|x_i - g_\theta(f_\phi(x_i))\|^2" />
            <p>
                For binary-valued inputs (e.g. MNIST pixels in &#123;0,1&#125;), the binary cross-entropy loss is used instead. The bottleneck dimension <em>k</em> is the key hyperparameter: too large and the network copies inputs trivially; too small and reconstruction quality degrades.
            </p>

            <h3>Connection to PCA</h3>
            <p>
                Baldi and Hornik (1989) proved that a linear autoencoder — encoder and decoder both affine, no activation functions — minimises the reconstruction loss if and only if its encoder weight matrix spans the same subspace as the top-k eigenvectors of the data covariance matrix <InlineMath tex="\Sigma = \mathbb{E}[xx^\top]" />. Non-linear activations break this equivalence, allowing autoencoders to find curved, non-linear manifolds that PCA cannot capture.
            </p>

            <h3>The autoencoder family</h3>
            <ul>
                <li><strong>Denoising AE (Vincent et al., 2008):</strong> train on corrupted input <InlineMath tex="\tilde{x}" />, reconstruct clean <em>x</em>. Loss: <InlineMath tex="\|x - g_\theta(f_\phi(\tilde{x}))\|^2" />. Forces learning of the data manifold rather than identity.</li>
                <li><strong>Sparse AE:</strong> add L1 penalty on latent activations: <InlineMath tex="\mathcal{L} + \lambda \|z\|_1" />. Encourages only a few neurons to activate per input — interpretable local features.</li>
                <li><strong>Contractive AE (Rifai et al., 2011):</strong> penalise the Frobenius norm of the encoder Jacobian <InlineMath tex="\|J_{f_\phi}(x)\|_F^2" />. Makes the code insensitive to small perturbations in input space.</li>
                <li><strong>Variational AE (Kingma and Welling, 2013):</strong> encoder outputs distribution parameters <InlineMath tex="(\mu_\phi(x), \sigma_\phi(x))" />; KL divergence regularises toward <InlineMath tex="\mathcal{N}(0, I)" />. Enables principled generation.</li>
            </ul>

            <h3>Applications</h3>
            <ul>
                <li><strong>Dimensionality reduction:</strong> compress high-d data for downstream ML or 2D/3D visualisation</li>
                <li><strong>Anomaly detection:</strong> train on normal data; reconstruction error is a principled anomaly score</li>
                <li><strong>Pre-training:</strong> use encoder weights to initialise supervised classifiers (historically important before large labeled datasets)</li>
                <li><strong>Generative modelling (VAE):</strong> sample <InlineMath tex="z \sim \mathcal{N}(0, I)" />, decode to generate new examples</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>What autoencoders cannot do:</strong> a standard autoencoder treats every input independently — there is no memory of previous inputs, and no mechanism for reasoning about sequences or temporal context. This is the fundamental limitation that Chapter 6 addresses: Recurrent Neural Networks apply the same backpropagation objective to networks with feedback connections, giving the network a form of memory across time.
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

// ── Maths Content ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Variational Autoencoders — The Full Framework</h2>

            <DefBlock label="Evidence Lower Bound (ELBO)">
                The VAE maximises a lower bound on the log-likelihood of the data. For a latent variable model <InlineMath tex="p_\theta(x) = \int p_\theta(x|z) p(z) dz" />, direct maximisation is intractable. The ELBO is:
                <MathBlock tex="\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{q_\phi(z|x)}\!\left[\ln p_\theta(x|z)\right] - \text{KL}\!\left(q_\phi(z|x) \,\|\, p(z)\right)" />
                where <InlineMath tex="q_\phi(z|x) = \mathcal{N}(\mu_\phi(x), \text{diag}(\sigma_\phi^2(x)))" /> is the encoder (approximate posterior) and <InlineMath tex="p(z) = \mathcal{N}(0, I)" /> is the prior. Maximising the ELBO simultaneously trains the decoder to reconstruct well and the encoder to produce latent codes close to the prior.
            </DefBlock>

            <h3>Reparameterisation trick</h3>
            <p>
                To backpropagate through the stochastic sample <InlineMath tex="z \sim q_\phi(z|x)" />, write:
            </p>
            <MathBlock tex="z = \mu_\phi(x) + \sigma_\phi(x) \odot \varepsilon, \qquad \varepsilon \sim \mathcal{N}(0, I)" />
            <p>
                The randomness <InlineMath tex="\varepsilon" /> is now in a fixed distribution. Gradients flow through <InlineMath tex="\mu_\phi" /> and <InlineMath tex="\sigma_\phi" /> as in any deterministic network. Without this trick the gradient estimator has prohibitively high variance.
            </p>

            <h3>KL divergence — closed form for Gaussians</h3>
            <p>
                With <InlineMath tex="q = \mathcal{N}(\mu, \text{diag}(\sigma^2))" /> and <InlineMath tex="p = \mathcal{N}(0, I)" />, the KL has a closed form:
            </p>
            <MathBlock tex="\text{KL}(q \,\|\, p) = -\frac{1}{2} \sum_{j=1}^k \left(1 + \ln\sigma_j^2 - \mu_j^2 - \sigma_j^2\right)" />
            <p>
                This regularises the latent space: it pushes encodings toward the unit Gaussian prior, ensuring the latent space is smooth and densely populated. A deterministic autoencoder's latent space has large gaps between codes — you can't sample from gaps and get meaningful reconstructions. The KL term eliminates these gaps.
            </p>

            <h3>Reconstruction term</h3>
            <p>
                For continuous outputs with Gaussian likelihood: <InlineMath tex="p_\theta(x|z) = \mathcal{N}(g_\theta(z), I)" />, the reconstruction term is <InlineMath tex="-\|x - g_\theta(z)\|^2 / 2" /> — equivalent to MSE loss. For binary inputs, Bernoulli likelihood gives binary cross-entropy:
            </p>
            <MathBlock tex="\ln p_\theta(x|z) = \sum_j \left[x_j \ln \hat{x}_j + (1-x_j)\ln(1-\hat{x}_j)\right]" />

            <h3>Linear autoencoder = PCA (Baldi and Hornik, 1989)</h3>
            <p>
                For a linear autoencoder <InlineMath tex="\hat{x} = W_d W_e x" /> where <InlineMath tex="W_e \in \mathbb{R}^{k \times d}" /> and <InlineMath tex="W_d \in \mathbb{R}^{d \times k}" />, minimising <InlineMath tex="\mathbb{E}[\|x - W_d W_e x\|^2]" /> is equivalent to finding the best rank-k approximation to the data covariance matrix. By the Eckart-Young theorem, this is achieved when the columns of <InlineMath tex="W_d" /> span the top-k eigenvectors of the sample covariance <InlineMath tex="\hat\Sigma = \frac{1}{n} X^\top X" />.
            </p>

            <div className="ch-callout">
                <strong>Posterior collapse:</strong> a failure mode of VAEs where the KL term is minimised by pushing <InlineMath tex="\sigma \to 1, \mu \to 0" />, making the encoder output uninformative. The decoder then ignores <em>z</em> entirely and learns the marginal distribution <InlineMath tex="p(x)" />. Mitigated by KL annealing: start with KL weight <InlineMath tex="\beta = 0" />, ramp to <InlineMath tex="\beta = 1" /> over training — giving the decoder time to learn to use <em>z</em> before being regularised.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

const PY_CODE = `import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Simple deterministic autoencoder (NumPy) ──────────────────────────────────
class SimpleAutoencoder:
    """
    Linear autoencoder — learns PCA decomposition.
    Theorem (Baldi-Hornik 1989): global minima span the top-k PCA components.
    """
    def __init__(self, d_in, d_bottleneck, lr=0.01):
        # Encoder: d_in -> d_bottleneck
        self.W_enc = np.random.randn(d_bottleneck, d_in) * 0.1
        self.b_enc = np.zeros(d_bottleneck)
        # Decoder: d_bottleneck -> d_in
        self.W_dec = np.random.randn(d_in, d_bottleneck) * 0.1
        self.b_dec = np.zeros(d_in)
        self.lr = lr

    def encode(self, X):
        return X @ self.W_enc.T + self.b_enc

    def decode(self, Z):
        return Z @ self.W_dec.T + self.b_dec

    def train_step(self, X):
        Z    = self.encode(X)                      # (n, k)
        Xhat = self.decode(Z)                      # (n, d)
        # Reconstruction loss gradient
        dL_dXhat = (Xhat - X) / X.shape[0]        # (n, d)
        # Decoder gradients
        dL_dW_dec = dL_dXhat.T @ Z                 # (d, k)
        dL_db_dec = dL_dXhat.sum(axis=0)
        # Encoder gradients
        dL_dZ    = dL_dXhat @ self.W_dec           # (n, k)
        dL_dW_enc = dL_dZ.T @ X
        dL_db_enc = dL_dZ.sum(axis=0)
        # Update
        self.W_dec -= self.lr * dL_dW_dec
        self.b_dec -= self.lr * dL_db_dec
        self.W_enc -= self.lr * dL_dW_enc
        self.b_enc -= self.lr * dL_db_enc
        return 0.5 * np.mean((Xhat - X)**2)

# Synthetic 3D data on a 2D plane
np.random.seed(42)
n = 200
z_true = np.random.randn(n, 2)               # true 2D structure
A = np.random.randn(3, 2)                    # embedding into 3D
X = z_true @ A.T + 0.05 * np.random.randn(n, 3)

ae = SimpleAutoencoder(d_in=3, d_bottleneck=2, lr=0.05)
for epoch in range(2000):
    loss = ae.train_step(X)
    if epoch % 400 == 0:
        print(f"Epoch {epoch:4d} | Reconstruction loss: {loss:.5f}")

# ── Variational Autoencoder (PyTorch) ─────────────────────────────────────────
class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=256, latent_dim=16):
        super().__init__()
        # Encoder
        self.enc_fc      = nn.Linear(input_dim, hidden_dim)
        self.enc_mu      = nn.Linear(hidden_dim, latent_dim)
        self.enc_log_var = nn.Linear(hidden_dim, latent_dim)
        # Decoder
        self.dec_fc1     = nn.Linear(latent_dim, hidden_dim)
        self.dec_fc2     = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.enc_fc(x))
        return self.enc_mu(h), self.enc_log_var(h)

    def reparameterise(self, mu, log_var):
        if self.training:
            std = torch.exp(0.5 * log_var)
            eps = torch.randn_like(std)
            return mu + eps * std   # reparameterisation trick
        return mu                   # deterministic at eval time

    def decode(self, z):
        h = F.relu(self.dec_fc1(z))
        return torch.sigmoid(self.dec_fc2(h))

    def forward(self, x):
        mu, log_var = self.encode(x)
        z = self.reparameterise(mu, log_var)
        return self.decode(z), mu, log_var


def vae_loss(x_hat, x, mu, log_var, beta=1.0):
    # Reconstruction: binary cross-entropy per pixel
    recon = F.binary_cross_entropy(x_hat, x, reduction="sum")
    # KL divergence (closed form for Gaussian)
    kl = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
    return recon + beta * kl, recon, kl


model     = VAE(latent_dim=16)
optimiser = torch.optim.Adam(model.parameters(), lr=1e-3)

# ── Abbreviated training loop (fill in data loader for real use) ───────────────
# for epoch in range(50):
#     for x, _ in train_loader:
#         x = x.view(-1, 784)
#         x_hat, mu, log_var = model(x)
#         loss, recon, kl = vae_loss(x_hat, x, mu, log_var, beta=1.0)
#         optimiser.zero_grad(); loss.backward(); optimiser.step()

# ── Generation: sample from prior, decode ─────────────────────────────────────
# model.eval()
# with torch.no_grad():
#     z = torch.randn(16, 16)           # sample from N(0,I) prior
#     samples = model.decode(z)         # shape (16, 784)
#     samples = samples.view(16, 1, 28, 28)

print("\\nVAE architecture:")
print(model)`

function PythonContent() {
    return (
        <>
            <p>
                Two implementations: a NumPy linear autoencoder that demonstrates the Baldi-Hornik
                theorem (the bottleneck learns PCA-like structure on 3D data with known 2D geometry),
                and a PyTorch VAE with the reparameterisation trick and KL divergence loss.
            </p>
            <CodeBlock code={PY_CODE} filename="autoencoders.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Implementation notes:</strong> the <code>reparameterise</code> method only
                samples at training time — returning the mean deterministically at eval time gives
                stable reconstructions for visualisation. For the VAE, start with
                <code>latent_dim=2</code> on MNIST to visualise the learned latent space directly
                — you will see the ten digit classes arrange themselves as clusters without any
                label supervision. The <code>beta</code> parameter controls disentanglement:
                beta &gt; 1 encourages more independent latent dimensions at some cost in
                reconstruction quality.
            </div>
        </>
    )
}

// ── Tab content map ──────────────────────────────────────────────────────────

export const AUTOENCODERS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsContent />,
    python:     <PythonContent />,
}
