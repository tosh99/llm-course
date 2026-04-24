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
            year: "2014",
            title: "Generative Adversarial Networks",
            context:
                "Deep learning had excelled at classification and regression, but generating realistic data remained difficult. Existing approaches like Restricted Boltzmann Machines and autoencoders produced blurry samples.",
            what:
                "Ian Goodfellow and colleagues proposed GANs: pit a Generator network against a Discriminator network in a minimax game. The generator learns to create fake data; the discriminator learns to distinguish real from fake. Both improve by competing.",
            impact:
                "GANs opened a new frontier in generative modeling. Within years they produced photorealistic faces, artwork, and synthetic training data. The adversarial training principle became one of the most influential ideas in modern AI.",
        },
        {
            year: "2015–2016",
            title: "DCGAN & Stable Training",
            context:
                "Early GANs were notoriously unstable—training often collapsed or produced mode collapse (only a few output varieties). Researchers struggled to find architectural tricks that worked reliably.",
            what:
                "Radford et al. introduced DCGAN: deep convolutional GANs with strided convolutions, BatchNorm, and no fully connected layers. This design made GANs train stably for the first time and established best practices still used today.",
            impact:
                "DCGAN proved GANs could generate coherent, high-resolution images. It became the standard architecture for unconditional image generation and inspired conditional variants (cGAN) that could control output class.",
        },
        {
            year: "2018–2019",
            title: "StyleGAN & Progressive Growing",
            context:
                "Even with DCGAN, controlling fine details (hairstyle, pose, lighting) was impossible. Generated images often had artifacts and lacked diversity.",
            what:
                "NVIDIA's StyleGAN separated high-level attributes from stochastic variation using adaptive instance normalization. Progressive growing started from 4×4 pixels and gradually increased resolution. StyleGAN2 later fixed artifact issues.",
            impact:
                "StyleGAN produced near-photorealistic human faces, rooms, and cars. It demonstrated that GANs could rival professional photography and became a cornerstone of synthetic media, fashion design, and game asset generation.",
        },
        {
            year: "2020+",
            title: "Diffusion Models Eclipse GANs",
            context:
                "GANs dominated generative AI but suffered from training instability, mode collapse, and limited diversity. Researchers sought alternatives.",
            what:
                "Diffusion models (Denoising Diffusion Probabilistic Models) learned to reverse a noise corruption process. They offered stable training, better mode coverage, and scalable architectures.",
            impact:
                "DALL-E 2, Stable Diffusion, and Midjourney all use diffusion—not GANs. But GANs' adversarial training philosophy lives on in discriminator-based losses (e.g., GAN loss in diffusion) and remains essential knowledge for understanding generative AI history.",
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
            <h2>GANs: The Art Forger vs The Detective</h2>

            <Analogy label="The Forger and the Detective">
                Imagine a clever art forger who wants to paint fake money. He practices
                every day, getting better and better at making his bills look real.
                <br /><br />
                But there's a super-smart detective whose job is to spot the fakes.
                Every time the forger makes a new bill, the detective examines it with
                a magnifying glass and says "Fake!" or "Real!"
            </Analogy>

            <Analogy label="They Both Get Better Together">
                Here's the twist: every time the detective correctly spots a fake, the
                forger learns from his mistake and improves. And every time the forger
                fools the detective, the detective learns to look closer next time.
                <br /><br />
                They are locked in an endless game of cat and mouse—except BOTH of them
                keep getting smarter! After millions of rounds, the forger's fake bills
                are so perfect that even the detective can't tell them from real ones.
            </Analogy>

            <DefBlock label="Generator = Forger, Discriminator = Detective">
                The <strong>Generator</strong> is the forger. It starts with random noise
                (like scribbles) and learns to create realistic images.
                <br /><br />
                The <strong>Discriminator</strong> is the detective. It looks at real images
                and fake images, learning to tell them apart.
                <br /><br />
                They train together in a competition—an <em>adversarial</em> game where
                both players push each other to improve.
            </DefBlock>

            <Analogy label="Why This Is Brilliant">
                Before GANs, computers learned by copying examples (like tracing a picture).
                GANs are different: the computer learns by trying to FOOL another computer!
                <br /><br />
                It's like learning to draw by having a strict art teacher who only says
                "good" or "bad." Eventually, your drawings become so good that even the
                teacher can't tell they're not from a famous artist.
            </Analogy>

            <div className="ch-callout">
                <strong>Cool fact:</strong> The first GANs created blurry faces. Within
                four years, GANs generated photorealistic human faces that most people
                couldn't distinguish from real photos. Today, GANs are used to create
                synthetic training data, design fashion, and even generate video game worlds!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GANs: Adversarial Training Explained</h2>

            <p>
                A Generative Adversarial Network consists of two neural networks locked
                in competition. The <strong>Generator</strong> G learns to map random
                noise z to realistic data samples. The <strong>Discriminator</strong> D
                learns to classify inputs as real or fake. They train in turns, each
                improving at the expense of the other.
            </p>

            <h3>The Generator Network</h3>
            <p>
                The generator takes a random vector z (typically from a standard normal
                distribution) and transforms it through upsampling layers into a data
                sample. For images, this often uses transposed convolutions or upsampling
                followed by convolutions.
            </p>

            <DefBlock label="Latent Space">
                The input z lives in a low-dimensional "latent space." Each point in this
                space maps to a generated sample. By smoothly interpolating between two
                z vectors, we can create smooth transitions between generated images—like
                morphing one face into another.
            </DefBlock>

            <h3>The Discriminator Network</h3>
            <p>
                The discriminator is a binary classifier. It outputs a single probability
                D(x) ∈ [0, 1] indicating how confident it is that input x is real. Real
                samples should score near 1; fake samples near 0.
            </p>

            <h3>Alternating Training</h3>
            <p>
                Training proceeds in alternating steps:
            </p>
            <ul>
                <li><strong>Step 1 — Train D:</strong> Show D real samples (label 1) and fake samples from G (label 0). Update D to better distinguish them.</li>
                <li><strong>Step 2 — Train G:</strong> Generate new fakes and pass them through D. Update G to maximize D's score (fool the discriminator). D's weights are frozen.</li>
            </ul>

            <h3>Challenges</h3>
            <p>
                <strong>Mode collapse:</strong> G learns to produce only a small variety
                of samples that consistently fool D, ignoring the full data distribution.
                <br /><br />
                <strong>Vanishing gradients:</strong> If D becomes too good too early, G
                receives no useful gradient signal and stops learning.
                <br /><br />
                <strong>Non-convergence:</strong> Unlike standard optimization, GAN training
                is a game. It may oscillate indefinitely rather than settle to an equilibrium.
            </p>

            <div className="ch-callout">
                <strong>Why it works:</strong> At equilibrium, the generator perfectly
                matches the real data distribution and the discriminator can do no better
                than random guessing (outputting 0.5 for everything). This is the Nash
                equilibrium of the minimax game.
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
            <h2>GANs: Mathematical Formulation</h2>

            <h3>The Minimax Objective</h3>
            <p>
                GANs optimize a two-player minimax game with value function V(D, G):
            </p>
            <MathBlock tex="\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]" />
            <p>
                The discriminator D maximizes log-probability of correctly classifying
                real and fake samples. The generator G minimizes the log-probability that
                D correctly identifies its fakes.
            </p>

            <h3>Optimal Discriminator</h3>
            <p>
                For a fixed G, the optimal discriminator is:
            </p>
            <MathBlock tex="D^*_G(x) = \frac{p_{data}(x)}{p_{data}(x) + p_g(x)}" />
            <p>
                where p_g is the distribution induced by G(z). When p_g = p_data, the
                optimal D outputs 1/2 everywhere—it cannot distinguish real from fake.
            </p>

            <h3>Generator Loss Variants</h3>
            <p>
                The original minimax loss can cause vanishing gradients. An alternative
                is the non-saturating loss:
            </p>
            <MathBlock tex="\min_G -\mathbb{E}_{z \sim p_z}[\log D(G(z))]" />
            <p>
                This flips the objective: G now tries to maximize log D(G(z)) directly,
                providing stronger gradients when D confidently rejects fakes.
            </p>

            <h3>Mode Collapse</h3>
            <p>
                Mode collapse occurs when the generator maps many z values to the same
                output, collapsing the support of p_g. The Jensen-Shannon divergence
                (implied by the original GAN loss) poorly penalizes this. Wasserstein
                GAN addresses this by using the Earth Mover's distance:
            </p>
            <MathBlock tex="W(p_{data}, p_g) = \inf_{\gamma \in \Pi} \mathbb{E}_{(x, y) \sim \gamma}[\|x - y\|]" />
            <p>
                WGAN replaces the discriminator with a critic that must be Lipschitz
                continuous (enforced via weight clipping or gradient penalty). This
                provides meaningful gradients even when distributions don't overlap.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn
import torch.optim as optim

# ── Simple GAN for MNIST ───────────────────────────────────────────────────────

class Generator(nn.Module):
    """
    Generator: maps latent vector z -> 28x28 image.
    Uses transposed convolutions to upsample.
    """
    def __init__(self, latent_dim=100):
        super().__init__()
        self.model = nn.Sequential(
            nn.ConvTranspose2d(latent_dim, 128, kernel_size=7, stride=1, padding=0),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),

            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),

            nn.ConvTranspose2d(64, 1, kernel_size=4, stride=2, padding=1),
            nn.Tanh(),  # Output in [-1, 1]
        )

    def forward(self, z):
        # z: (batch, latent_dim) -> reshape to (batch, latent_dim, 1, 1)
        z = z.view(z.size(0), -1, 1, 1)
        return self.model(z)


class Discriminator(nn.Module):
    """
    Discriminator: classifies 28x28 image as real (1) or fake (0).
    """
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=4, stride=2, padding=1),
            nn.LeakyReLU(0.2, inplace=True),

            nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2, inplace=True),

            nn.Flatten(),
            nn.Linear(128 * 7 * 7, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.model(x)


# ── Training Loop ──────────────────────────────────────────────────────────────

def train_gan(generator, discriminator, dataloader, epochs=20, lr=0.0002, latent_dim=100):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    generator.to(device)
    discriminator.to(device)

    criterion = nn.BCELoss()
    opt_g = optim.Adam(generator.parameters(), lr=lr, betas=(0.5, 0.999))
    opt_d = optim.Adam(discriminator.parameters(), lr=lr, betas=(0.5, 0.999))

    for epoch in range(epochs):
        for real_images, _ in dataloader:
            real_images = real_images.to(device)
            batch_size = real_images.size(0)
            real_labels = torch.ones(batch_size, 1).to(device)
            fake_labels = torch.zeros(batch_size, 1).to(device)

            # ── Train Discriminator ──
            opt_d.zero_grad()

            # Real images
            d_real = discriminator(real_images)
            loss_d_real = criterion(d_real, real_labels)

            # Fake images
            z = torch.randn(batch_size, latent_dim).to(device)
            fake_images = generator(z)
            d_fake = discriminator(fake_images.detach())
            loss_d_fake = criterion(d_fake, fake_labels)

            loss_d = (loss_d_real + loss_d_fake) / 2
            loss_d.backward()
            opt_d.step()

            # ── Train Generator ──
            opt_g.zero_grad()

            z = torch.randn(batch_size, latent_dim).to(device)
            fake_images = generator(z)
            d_fake = discriminator(fake_images)

            # Generator wants discriminator to classify fakes as real
            loss_g = criterion(d_fake, real_labels)
            loss_g.backward()
            opt_g.step()

        print(f"Epoch [{epoch+1}/{epochs}] | D Loss: {loss_d.item():.4f} | G Loss: {loss_g.item():.4f}")

    return generator, discriminator


# ── Generate Samples ───────────────────────────────────────────────────────────
def generate_images(generator, num=16, latent_dim=100):
    device = next(generator.parameters()).device
    z = torch.randn(num, latent_dim).to(device)
    with torch.no_grad():
        images = generator(z)
    return images  # Shape: (num, 1, 28, 28)


# Usage:
# generator = Generator(latent_dim=100)
# discriminator = Discriminator()
# train_gan(generator, discriminator, mnist_dataloader, epochs=20)`;

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of a simple DCGAN-style architecture for MNIST.
                The generator uses transposed convolutions to upsample from a latent vector
                to a 28×28 image. The discriminator uses strided convolutions to downsample.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="gan.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Training tips:</strong> 1) Use Adam with β₁=0.5 for stability.
                2) Label smoothing (real labels = 0.9 instead of 1.0) helps prevent D from
                becoming too confident. 3) Train D more steps than G if D wins too easily.
            </div>
        </>
    )
}




export const GAN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
