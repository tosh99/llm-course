import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Autoencoder Diagram ───────────────────────────────────────────────────────

function AutoencoderDiagram() {
    const w = 480, h = 220

    // Layer widths
    const layers = [
        { label: "Input",    nodes: 5, x: 50,  color: "#5a9ab9" },
        { label: "Hidden 1", nodes: 4, x: 150, color: "#8e8a82" },
        { label: "Bottleneck",nodes: 2, x: 240, color: "#e8a838" },
        { label: "Hidden 2", nodes: 4, x: 330, color: "#8e8a82" },
        { label: "Output",   nodes: 5, x: 430, color: "#5ab98c" },
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

            {/* Connections between adjacent layers */}
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

            {/* Encoder / Decoder labels */}
            <rect x={50} y={28} width={150} height={18} rx="3" fill="rgba(90,154,185,0.08)" stroke="rgba(90,154,185,0.25)" strokeWidth="1" />
            <text x={125} y={40} textAnchor="middle" fill="#5a9ab9" fontSize="6.5" fontFamily="JetBrains Mono,monospace">ENCODER</text>
            <rect x={240} y={28} width={190} height={18} rx="3" fill="rgba(90,185,140,0.08)" stroke="rgba(90,185,140,0.25)" strokeWidth="1" />
            <text x={335} y={40} textAnchor="middle" fill="#5ab98c" fontSize="6.5" fontFamily="JetBrains Mono,monospace">DECODER</text>

            {/* Nodes */}
            {nodePositions.map((layerNodes, li) =>
                layerNodes.map((node, ni) => (
                    <circle key={`n-${li}-${ni}`}
                        cx={node.x} cy={node.y} r={nodeR}
                        fill={li === 2 ? "#e8a838" : "#141420"}
                        stroke={node.color} strokeWidth={li === 2 ? "2" : "1.5"}
                        opacity={li === 2 ? "0.9" : "0.85"} />
                ))
            )}

            {/* Layer labels */}
            {layers.map((layer, li) => (
                <text key={li} x={layer.x} y={h - 8} textAnchor="middle"
                    fill={layer.color} fontSize="5.5" fontFamily="JetBrains Mono,monospace">
                    {layer.label}
                </text>
            ))}

            {/* Bottleneck annotation */}
            <line x1={240} y1={cy + 60} x2={240} y2={cy + 46}
                stroke="#e8a838" strokeWidth="1" strokeDasharray="3,2" />
            <text x={240} y={cy + 70} textAnchor="middle" fill="#e8a838"
                fontSize="5.5" fontFamily="JetBrains Mono,monospace">z (latent code)</text>

            {/* Reconstruction arrow */}
            <text x={240} y={16} textAnchor="middle" fill="#3a3a50"
                fontSize="5" fontFamily="JetBrains Mono,monospace">
                x → f_enc(x) → z → f_dec(z) → x̂  ·  minimise ‖x − x̂‖²
            </text>
        </svg>
    )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1986",
            title: "Rumelhart, Hinton & Williams — Autoencoders and Unsupervised Representation Learning",
            challenge: "Backpropagation (also 1986) made it possible to train multi-layer networks on supervised tasks. But labeled datasets were expensive and scarce. Most data in the world — images, text, audio — had no labels attached. Could the same backpropagation algorithm train a network without any supervision at all?",
            what: "Rumelhart, Hinton, and Williams proposed the autoencoder: train a network to output a copy of its input, but force the signal through a narrow hidden layer called the bottleneck. The encoder compresses the input to a low-dimensional code z; the decoder reconstructs the original from z. Backpropagation minimises the reconstruction error ‖x − x̂‖². No labels needed — the input is its own target.",
            impact: "The autoencoder was the first practical demonstration that backpropagation could be used for unsupervised learning. The bottleneck forces the network to discover compact, useful representations — the same principle that later drove Word2Vec (2013), denoising autoencoders (2008, covered in Chapter 9), variational autoencoders (2013, covered in Chapter 11), and BERT's masked pretraining (2018, covered in Chapter 19). The key insight — that you can train a network without labels by making it reconstruct its own input — became one of the most productive ideas in deep learning.",
        },
        {
            year: "1989",
            title: "Baldi & Hornik — Linear Autoencoders Rediscover PCA",
            challenge: "The autoencoder's bottleneck seemed to compress information, but was it doing anything fundamentally different from classical dimensionality reduction? Researchers needed to understand what linear autoencoders actually learned.",
            what: "Baldi and Hornik proved that a linear autoencoder (encoder and decoder are both affine transformations, no nonlinear activations) has the same global minima as PCA: the encoder weights span the same subspace as the top-k principal components of the data covariance matrix. Any solution to the linear autoencoder is equivalent to a rotation of the PCA solution.",
            impact: "This result clarified exactly what nonlinear activations add: the ability to discover curved, non-linear manifolds that PCA cannot capture. It also validated the autoencoder objective — reconstruction error is a principled criterion for finding structure in data. The connection between autoencoders and PCA (Chapter 1) runs in both directions: PCA is a special case of the autoencoder, and deep nonlinear autoencoders are the natural generalization of PCA. The next step in the 1986 story was not compressing data — it was adding memory. Chapter 6 covers what happens when you feed a network's own outputs back as inputs, giving it the ability to reason about sequences.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch-tl-item">
                    <div className="ch-tl-year">{item.year}</div>
                    <div className="ch-tl-title">{item.title}</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">{item.challenge}</div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">{item.what}</div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>A network that learns to squish and unsquish information</h2>

            <p className="ch-story-intro">
                Backpropagation let neural networks learn from labeled examples. But labels are expensive — most data in the world comes without them. The autoencoder was backpropagation's first answer to that problem: make the network learn by reconstructing its own input, with no labels at all.
            </p>

            <Analogy label="The basic idea">
                Imagine taking a very detailed photo, compressing it into a tiny thumbnail, and then trying to reconstruct the original photo from the thumbnail. If you succeed, you've learned something important about what the photo "really is" — you've learned which parts of the photo matter most.
                <br /><br />
                An <strong>autoencoder</strong> does exactly this: it is a neural network trained to compress its input into a small "summary" (the bottleneck) and then reconstruct the original. The only supervision it needs is the input data itself — it doesn't need labels.
            </Analogy>

            <DiagramBlock title="Autoencoder — compress to bottleneck, then reconstruct">
                <AutoencoderDiagram />
            </DiagramBlock>

            <Analogy label="The encoder half">
                The first half (encoder) squishes the input down to a compact vector called the <strong>latent code</strong> or <strong>z</strong>. If the input has 784 dimensions (a 28×28 image) and z has 32 dimensions, the encoder must decide what 32 numbers best summarise the image.
            </Analogy>

            <Analogy label="The decoder half">
                The second half (decoder) takes the 32-number summary and tries to recreate the original 784-dimensional image. The network is trained to minimise the difference between the original and the reconstruction.
            </Analogy>

            <Analogy label="What it learns">
                After training, the bottleneck z contains the most important features of the data — it has learned a compressed vocabulary for describing inputs. Two images that look similar will have similar z values. You can also <em>generate new data</em> by feeding random z values through the decoder.
            </Analogy>

            <Analogy label="What comes next — networks with memory">
                Autoencoders treat each input independently — they compress and reconstruct one image at a time, with no memory of what came before. But the world is full of sequences: speech, text, music, video. What if the network could remember past inputs and use them to understand the current one?
                <br /><br />
                That question — and its answer — is Chapter 6: Recurrent Neural Networks. The same backpropagation algorithm from Chapter 5, applied to networks with feedback loops that carry information forward in time.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Unsupervised representation learning via reconstruction</h2>

            <p>
                An autoencoder consists of two parts: an <strong>encoder</strong> f : ℝᵈ → ℝᵏ (k &lt; d) and a <strong>decoder</strong> g : ℝᵏ → ℝᵈ. Training minimises the reconstruction loss:
            </p>
            <MathBlock tex="\mathcal{L} = \frac{1}{n} \sum_{i=1}^n \|x_i - g(f(x_i))\|^2" />

            <h3>Connection to PCA</h3>
            <p>
                A linear autoencoder (encoder and decoder are both affine transformations, no activation functions) minimises the same objective as PCA. Baldi & Hornik (1989) proved that the global minima of a linear autoencoder are exactly the projections onto the top-k principal components. Non-linear activations break this equivalence and allow autoencoders to learn curved, non-linear manifolds.
            </p>

            <h3>Regularised Variants</h3>
            <ul>
                <li><strong>Denoising AE:</strong> Train on corrupted input, reconstruct clean original. Forces learning of the data manifold. Loss: ‖x − g(f(x̃))‖² where x̃ = x + noise</li>
                <li><strong>Sparse AE:</strong> Add L1 penalty on the hidden activations: ℒ + λ‖z‖₁. Forces only a few neurons to be active per input</li>
                <li><strong>Contractive AE:</strong> Penalise the Frobenius norm of the encoder Jacobian — the code should be insensitive to small input perturbations</li>
                <li><strong>Variational AE:</strong> Encoder outputs (μ, σ); KL divergence regularises q(z|x) toward 𝒩(0,I)</li>
            </ul>

            <h3>Applications</h3>
            <ul>
                <li><strong>Dimensionality reduction:</strong> Compress high-d data for visualisation or downstream ML</li>
                <li><strong>Pretraining:</strong> Use encoder weights to initialise a supervised model (historically important before ImageNet-scale labels)</li>
                <li><strong>Anomaly detection:</strong> Train on normal data; anomalies have high reconstruction error</li>
                <li><strong>Generative modelling (VAE):</strong> Sample z ~ 𝒩(0,I), decode to generate new data</li>
            </ul>


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
            <h2>Variational Autoencoders — The Full Framework</h2>

            <DefBlock label="ELBO Objective (VAE)">
                The VAE maximises the Evidence Lower Bound:
                <br /><br />
                ℒ(θ, φ; x) = 𝔼_&#123;q_φ(z|x)&#125;[ln p_θ(x|z)] − KL(q_φ(z|x) ‖ p(z))
                <br /><br />
                where θ are decoder parameters, φ are encoder parameters, q_φ(z|x) = 𝒩(μ_φ(x), Σ_φ(x)) is the approximate posterior, and p(z) = 𝒩(0, I) is the prior.
            </DefBlock>

            <h3>Reparameterisation Trick</h3>
            <p>
                To backpropagate through the stochastic sample z ~ q_φ(z|x), reparameterise:
            </p>
            <MathBlock tex="z = \mu_\phi(x) + \sigma_\phi(x) \odot \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, I)" />
            <p>
                The randomness ε is now in a fixed distribution; gradients flow through μ_φ and σ_φ. Without this trick, the gradient estimator has too high variance to train.
            </p>

            <h3>KL Divergence (Closed Form for Gaussians)</h3>
            <p>
                With q = 𝒩(μ, diag(σ²)) and p = 𝒩(0, I), the KL has a closed form:
            </p>
            <MathBlock tex="\text{KL}(q \| p) = -\frac{1}{2} \sum_{j=1}^k \left(1 + \ln\sigma_j^2 - \mu_j^2 - \sigma_j^2\right)" />
            <p>
                This acts as a regulariser: it pushes encodings toward the unit Gaussian prior, ensuring the latent space is smooth and densely populated (unlike a deterministic autoencoder's latent space, which can have large gaps).
            </p>

            <h3>Reconstruction Term</h3>
            <p>
                For continuous outputs: p_θ(x|z) = 𝒩(x; g_θ(z), σ²I), so the reconstruction term is proportional to −‖x − g_θ(z)‖² / (2σ²) — the standard MSE loss. For binary data (MNIST pixels): use Bernoulli likelihood, which gives the binary cross-entropy loss.
            </p>

            <h3>Posterior Collapse</h3>
            <p>
                A failure mode: the KL term is minimised by σ → 1, μ → 0, making the encoder output uninformative. The decoder then ignores z entirely (learns the marginal distribution). Mitigated by KL annealing (start with KL weight β=0, gradually increase to β=1) or by using a more expressive prior.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# ── Variational Autoencoder ────────────────────────────────────────
class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=256, latent_dim=16):
        super().__init__()
        # Encoder
        self.enc_fc1 = nn.Linear(input_dim, hidden_dim)
        self.enc_mu  = nn.Linear(hidden_dim, latent_dim)
        self.enc_log_var = nn.Linear(hidden_dim, latent_dim)
        # Decoder
        self.dec_fc1 = nn.Linear(latent_dim, hidden_dim)
        self.dec_fc2 = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.enc_fc1(x))
        return self.enc_mu(h), self.enc_log_var(h)

    def reparameterise(self, mu, log_var):
        if self.training:
            std = torch.exp(0.5 * log_var)
            eps = torch.randn_like(std)   # ε ~ N(0,I)
            return mu + eps * std          # reparameterisation trick
        return mu  # deterministic at eval time

    def decode(self, z):
        h = F.relu(self.dec_fc1(z))
        return torch.sigmoid(self.dec_fc2(h))

    def forward(self, x):
        mu, log_var = self.encode(x)
        z = self.reparameterise(mu, log_var)
        return self.decode(z), mu, log_var


def vae_loss(x_hat, x, mu, log_var, beta=1.0):
    # Reconstruction loss (binary cross-entropy per pixel)
    recon = F.binary_cross_entropy(x_hat, x, reduction="sum")
    # KL divergence (closed form for Gaussian)
    kl = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
    return recon + beta * kl


# ── Training loop (abbreviated) ────────────────────────────────────
model = VAE(latent_dim=16)
optimiser = torch.optim.Adam(model.parameters(), lr=1e-3)

# Assume loader provides (batch_x, batch_y) with batch_x in [0,1]
# for epoch in range(20):
#     for x, _ in loader:
#         x = x.view(-1, 784)
#         x_hat, mu, log_var = model(x)
#         loss = vae_loss(x_hat, x, mu, log_var)
#         optimiser.zero_grad()
#         loss.backward()
#         optimiser.step()

# ── Sample new images ──────────────────────────────────────────────
# model.eval()
# with torch.no_grad():
#     z = torch.randn(16, 16)           # sample from prior
#     samples = model.decode(z)          # decode to pixel space
#     samples = samples.view(16, 1, 28, 28)`

function PythonContent() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="vae.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Implementation notes:</strong> The <code>reparameterise</code> method only samples at training time — at eval, return the mean (deterministic encoding). The <code>beta</code> parameter in the loss controls the weight of the KL term — β=1 is standard VAE, β&gt;1 (β-VAE) encourages more disentangled representations. Start with <code>latent_dim=2</code> to visualise the latent space directly.
            </div>
        </>
    )
}




export const AUTOENCODERS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
