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
        </>
    )
}

function MathsTab() {
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

function PythonTab() {
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

const TS_CODE = `// ── GAN Training Loop in TypeScript ────────────────────────────────────────────
// Minimal numeric simulation showing adversarial training dynamics

type Matrix = number[][];

// ── Utility Functions ──────────────────────────────────────────────────────────

function randomNormal(rows: number, cols: number): Matrix {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            Math.sqrt(-2 * Math.log(Math.random())) *
            Math.cos(2 * Math.PI * Math.random())
        )
    );
}

function matMul(a: Matrix, b: Matrix): Matrix {
    const [m, n] = [a.length, b[0].length];
    const p = b.length;
    const result: Matrix = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

function addBias(mat: Matrix, bias: number[]): Matrix {
    return mat.map(row => row.map((val, j) => val + bias[j]));
}

function sigmoid(mat: Matrix): Matrix {
    return mat.map(row => row.map(v => 1 / (1 + Math.exp(-v))));
}

function relu(mat: Matrix): Matrix {
    return mat.map(row => row.map(v => Math.max(0, v)));
}

function matAdd(a: Matrix, b: Matrix): Matrix {
    return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function scaleMat(mat: Matrix, s: number): Matrix {
    return mat.map(row => row.map(v => v * s));
}

// ── Simple MLP Layer ───────────────────────────────────────────────────────────

class Layer {
    weights: Matrix;
    bias: number[];
    gradW: Matrix;
    gradB: number[];

    constructor(inFeatures: number, outFeatures: number) {
        this.weights = randomNormal(inFeatures, outFeatures).map(
            row => row.map(v => v * Math.sqrt(2 / inFeatures))
        );
        this.bias = Array(outFeatures).fill(0);
        this.gradW = Array.from({ length: inFeatures }, () => Array(outFeatures).fill(0));
        this.gradB = Array(outFeatures).fill(0);
    }

    forward(input: Matrix): Matrix {
        return addBias(matMul(input, this.weights), this.bias);
    }

    zeroGrad() {
        this.gradW = this.gradW.map(row => row.map(() => 0));
        this.gradB = this.gradB.map(() => 0);
    }
}

// ── Generator: z (latent) -> synthetic data ────────────────────────────────────

class SimpleGenerator {
    fc1: Layer;
    fc2: Layer;
    fc3: Layer;

    constructor(latentDim: number = 10, hiddenDim: number = 32, dataDim: number = 4) {
        this.fc1 = new Layer(latentDim, hiddenDim);
        this.fc2 = new Layer(hiddenDim, hiddenDim);
        this.fc3 = new Layer(hiddenDim, dataDim);
    }

    forward(z: Matrix): Matrix {
        let h = relu(this.fc1.forward(z));
        h = relu(this.fc2.forward(h));
        return this.fc3.forward(h);  // Linear output
    }

    parameters(): Layer[] {
        return [this.fc1, this.fc2, this.fc3];
    }
}

// ── Discriminator: data -> probability [0, 1] ──────────────────────────────────

class SimpleDiscriminator {
    fc1: Layer;
    fc2: Layer;
    fc3: Layer;

    constructor(dataDim: number = 4, hiddenDim: number = 32) {
        this.fc1 = new Layer(dataDim, hiddenDim);
        this.fc2 = new Layer(hiddenDim, hiddenDim);
        this.fc3 = new Layer(hiddenDim, 1);
    }

    forward(x: Matrix): Matrix {
        let h = relu(this.fc1.forward(x));
        h = relu(this.fc2.forward(h));
        return sigmoid(this.fc3.forward(h));
    }

    parameters(): Layer[] {
        return [this.fc1, this.fc2, this.fc3];
    }
}

// ── Binary Cross-Entropy Loss ──────────────────────────────────────────────────

function bceLoss(predictions: Matrix, targets: Matrix): number {
    let loss = 0;
    const n = predictions.length * predictions[0].length;
    for (let i = 0; i < predictions.length; i++) {
        for (let j = 0; j < predictions[0].length; j++) {
            const p = Math.max(1e-7, Math.min(1 - 1e-7, predictions[i][j]));
            loss -= (targets[i][j] * Math.log(p) + (1 - targets[i][j]) * Math.log(1 - p));
        }
    }
    return loss / n;
}

// ── Simplified SGD Update ──────────────────────────────────────────────────────

function sgdUpdate(layers: Layer[], lr: number) {
    for (const layer of layers) {
        for (let i = 0; i < layer.weights.length; i++) {
            for (let j = 0; j < layer.weights[0].length; j++) {
                layer.weights[i][j] -= lr * layer.gradW[i][j];
            }
        }
        for (let j = 0; j < layer.bias.length; j++) {
            layer.bias[j] -= lr * layer.gradB[j];
        }
    }
}

// ── Numerical Gradients (finite differences) ───────────────────────────────────

function computeGradients(
    model: SimpleGenerator | SimpleDiscriminator,
    input: Matrix,
    targets: Matrix,
    epsilon: number = 1e-5
): number {
    const layers = model.parameters();
    let totalLoss = 0;

    // Forward to compute loss
    const output = model.forward(input);
    totalLoss = bceLoss(output, targets);

    for (const layer of layers) {
        layer.zeroGrad();
        for (let i = 0; i < layer.weights.length; i++) {
            for (let j = 0; j < layer.weights[0].length; j++) {
                layer.weights[i][j] += epsilon;
                const lossPlus = bceLoss(model.forward(input), targets);
                layer.weights[i][j] -= 2 * epsilon;
                const lossMinus = bceLoss(model.forward(input), targets);
                layer.weights[i][j] += epsilon;
                layer.gradW[i][j] = (lossPlus - lossMinus) / (2 * epsilon);
            }
        }
        for (let j = 0; j < layer.bias.length; j++) {
            layer.bias[j] += epsilon;
            const lossPlus = bceLoss(model.forward(input), targets);
            layer.bias[j] -= 2 * epsilon;
            const lossMinus = bceLoss(model.forward(input), targets);
            layer.bias[j] += epsilon;
            layer.gradB[j] = (lossPlus - lossMinus) / (2 * epsilon);
        }
    }

    return totalLoss;
}

// ── Training Simulation ────────────────────────────────────────────────────────

function trainGANSimulation(
    epochs: number = 200,
    batchSize: number = 32,
    latentDim: number = 10,
    dataDim: number = 4,
    lr: number = 0.05
) {
    const generator = new SimpleGenerator(latentDim, 32, dataDim);
    const discriminator = new SimpleDiscriminator(dataDim, 32);

    // Real data distribution: multivariate normal with mean [2, -1, 0.5, 1]
    const realMean = [2, -1, 0.5, 1];

    for (let epoch = 0; epoch < epochs; epoch++) {
        // ── Train Discriminator ──
        // Sample real data
        const realData: Matrix = Array.from({ length: batchSize }, () =>
            realMean.map(m => m + Math.random() - 0.5)
        );
        const realLabels: Matrix = Array.from({ length: batchSize }, () => [1]);

        // Sample fake data
        const z: Matrix = randomNormal(batchSize, latentDim).map(
            row => row.map(v => v * 0.5)
        );
        const fakeData = generator.forward(z);
        const fakeLabels: Matrix = Array.from({ length: batchSize }, () => [0]);

        // Combined batch for discriminator
        const dInput = [...realData, ...fakeData];
        const dLabels = [...realLabels, ...fakeLabels];

        const dLoss = computeGradients(discriminator, dInput, dLabels);
        sgdUpdate(discriminator.parameters(), lr);

        // ── Train Generator ──
        const z2: Matrix = randomNormal(batchSize, latentDim).map(
            row => row.map(v => v * 0.5)
        );
        const fakeData2 = generator.forward(z2);
        const gLabels: Matrix = Array.from({ length: batchSize }, () => [1]);

        const gLoss = computeGradients(generator, fakeData2, gLabels);
        sgdUpdate(generator.parameters(), lr);

        if (epoch % 40 === 0) {
            console.log(
                "Epoch " + String(epoch).padStart(3, "0") + " | D Loss: " + dLoss.toFixed(4) + " | G Loss: " + gLoss.toFixed(4)
            );
        }
    }

    // Test: generate samples and check discriminator confidence
    const testZ = randomNormal(8, latentDim).map(row => row.map(v => v * 0.5));
    const generated = generator.forward(testZ);
    const dScores = discriminator.forward(generated);

    console.log("\\nGenerated samples (first 3):");
    console.log(generated.slice(0, 3).map(row => row.map(v => v.toFixed(3))));
    console.log("Discriminator scores (should approach 0.5):");
    console.log(dScores.slice(0, 3).map(row => row.map(v => v.toFixed(3))));
}

// Run simulation
trainGANSimulation();
console.log("\\nAt equilibrium, D outputs ~0.5 (cannot distinguish real from fake).");`;

function CodeTab() {
    return (
        <>
            <p>
                TypeScript implementation of a minimal GAN training loop using plain numeric
                arrays. This demonstrates the adversarial dynamics: generator and discriminator
                trained alternately with binary cross-entropy loss.
            </p>
            <CodeBlock code={TS_CODE} filename="gan.ts" lang="typescript" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Even this tiny simulation shows the minimax
                dynamics. At equilibrium, the discriminator outputs ~0.5 for generated samples—
                it has learned that it cannot reliably distinguish them from real data.
            </div>
        </>
    )
}

export const GAN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
