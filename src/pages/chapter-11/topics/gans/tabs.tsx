import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The adversarial framework</h2>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Goodfellow et al. &mdash; Generative Adversarial Nets</div>
                    <div className="ch-tl-body">
                        Ian Goodfellow, along with Jean Pouget-Abadie, Mehdi Mirza, Bing Xu,
                        David Warde-Farley, Sherjil Ozair, Aaron Courville, and Yoshua Bengio,
                        published "Generative Adversarial Nets" at NeurIPS 2014. The framework
                        was deceptively simple: train two networks simultaneously in a minimax game.
                        <br /><br />
                        The <strong>Generator G</strong> takes random noise z ~ N(0, I) and
                        produces a fake sample G(z). It wants to fool the discriminator.
                        The <strong>Discriminator D</strong> takes either a real sample x or a
                        fake G(z) and outputs a probability of being real. It wants to correctly
                        classify real from fake.
                        <br /><br />
                        The key insight: neither network needs explicit knowledge of the data
                        distribution. The discriminator learns it implicitly by seeing real examples.
                        The generator improves by receiving gradient signal from the discriminator.
                        Legend holds that Goodfellow conceived the idea at a bar after a colleague's
                        party and implemented the first working version that same night.
                    </div>
                    <div className="ch-tl-impact">Impact: Introduced a new paradigm for generative modeling &mdash; implicit density estimation via adversarial training, requiring no explicit likelihood function.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014 &ndash; 2015</div>
                    <div className="ch-tl-section-label">Growing Pains</div>
                    <div className="ch-tl-title">Mode Collapse and Training Instability</div>
                    <div className="ch-tl-body">
                        The original GAN paper demonstrated proof-of-concept results on MNIST
                        and CIFAR-10 but the training was notoriously unstable. Two failure modes
                        emerged repeatedly in practice.
                        <br /><br />
                        <strong>Mode collapse:</strong> The generator finds a small set of outputs
                        that consistently fool the discriminator and collapses to producing only
                        those outputs, ignoring the diversity of the real data distribution.
                        If the discriminator becomes slightly overconfident in one class direction,
                        the generator exploits this, and the discriminator then updates to close
                        the gap, causing the generator to collapse to a different mode. This
                        oscillation rather than convergence is a fundamental instability.
                        <br /><br />
                        <strong>Vanishing gradients:</strong> When the discriminator is too strong,
                        D(G(z)) &asymp; 0 for all generated samples. The generator's gradient
                        &part;log(1&minus;D(G(z)))/&part;&theta;_G approaches zero because the
                        discriminator saturates. Training stalls completely.
                    </div>
                    <div className="ch-tl-impact">Impact: These failures motivated a decade of research into GAN training stabilisation, alternative objectives, and architectural constraints &mdash; including DCGAN, WGAN, spectral normalisation, and progressive growing.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015</div>
                    <div className="ch-tl-section-label">Architecture Advance</div>
                    <div className="ch-tl-title">DCGAN &mdash; Radford, Metz &amp; Chintala</div>
                    <div className="ch-tl-body">
                        Alec Radford, Luke Metz, and Soumith Chintala's paper "Unsupervised
                        Representation Learning with Deep Convolutional Generative Adversarial
                        Networks" translated the GAN framework into convolutional architectures
                        with a set of empirically-derived design rules that made training reliable.
                        <br /><br />
                        DCGAN replaced fully connected layers with strided convolutions (discriminator)
                        and fractional-stride transposed convolutions (generator). It added Batch
                        Normalization throughout (except the generator output and discriminator input),
                        used LeakyReLU (slope 0.2) in the discriminator and ReLU in the generator,
                        used Tanh at the generator output, and removed all pooling layers.
                        <br /><br />
                        The result was a dramatic improvement in image quality and training
                        stability. DCGAN produced sharp 64&times;64 bedroom and face images.
                        Its latent spaces had meaningful vector arithmetic: the encoding of a smiling
                        woman minus a neutral woman plus a neutral man produced a smiling man.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the convolutional GAN template that dominated for years, and proved that GAN latent spaces encode interpretable, semantically meaningful directions.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Stability Fix</div>
                    <div className="ch-tl-title">Wasserstein GAN &mdash; Arjovsky, Chintala &amp; Bottou</div>
                    <div className="ch-tl-body">
                        Mart&iacute;n Arjovsky, Soumith Chintala, and L&eacute;on Bottou diagnosed the root
                        cause of GAN training instability. The original GAN minimises Jensen-Shannon
                        divergence between p_data and p_G. When the two distributions have disjoint
                        support (true at the beginning of training when the generator produces garbage),
                        the JS divergence is a constant (log 2) with zero gradient &mdash; providing
                        no learning signal.
                        <br /><br />
                        Their solution: replace JS divergence with the Wasserstein-1 distance (Earth
                        Mover Distance), which measures the minimum cost of transporting probability
                        mass from one distribution to the other. Unlike JS, Wasserstein distance is
                        continuous and differentiable everywhere, providing meaningful gradients even
                        when distributions are far apart.
                        <br /><br />
                        The practical constraint: the discriminator (now called a &quot;critic&quot;) must
                        be 1-Lipschitz. The original implementation used weight clipping (crude);
                        WGAN-GP (Gulrajani et al., 2017) enforced the constraint via a gradient
                        penalty on interpolated samples.
                    </div>
                    <div className="ch-tl-impact">Impact: Gave the first theoretical explanation for GAN instability and a principled fix. WGAN-GP became the standard training objective for high-quality image generation through 2019.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Scale</div>
                    <div className="ch-tl-title">Progressive GAN &mdash; Karras et al., NVIDIA</div>
                    <div className="ch-tl-body">
                        Tero Karras, Timo Aila, Samuli Laine, and Jaakko Lehtinen at NVIDIA Research
                        published "Progressive Growing of GANs." The key innovation: start training
                        at 4&times;4 resolution, then gradually add new generator and discriminator
                        layers as training converges at each resolution, progressing up to 1024&times;1024.
                        <br /><br />
                        At each resolution transition, the new higher-resolution layers were faded in
                        smoothly: the output was a blend of the current high-res layer and an upsampled
                        version of the previous stage, with the blend weight transitioning from 0 to 1
                        over thousands of training iterations. This prevented any sudden distribution
                        shift that would destabilise training.
                        <br /><br />
                        The result: photorealistic 1024&times;1024 face images, far beyond anything
                        previously achieved. Progressive GAN also significantly improved training stability
                        by starting with the simplest possible task (model a 4&times;4 distribution)
                        before gradually increasing difficulty.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that megapixel-resolution GAN synthesis was achievable through curriculum-style progressive training, producing the first photorealistic high-resolution face generation.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">State of the Art</div>
                    <div className="ch-tl-title">StyleGAN &mdash; Karras et al., NVIDIA</div>
                    <div className="ch-tl-body">
                        Tero Karras, Samuli Laine, and Timo Aila published "A Style-Based Generator
                        Architecture for Generative Adversarial Networks" (StyleGAN). The key
                        architectural innovation: separate the content of the generated image (controlled
                        by the latent z) from its style at each resolution level (controlled by adaptive
                        instance normalisation, AdaIN).
                        <br /><br />
                        A mapping network f: Z &rarr; W (an 8-layer MLP) transformed the initial latent
                        z into an intermediate latent w in a disentangled W-space. This W-space was
                        more suitable for controlling image attributes because the mapping network
                        could learn to un-tangle the correlations in the original Z-space. At each
                        resolution block, the style vector w controlled the feature map statistics
                        (mean and variance) via AdaIN.
                        <br /><br />
                        StyleGAN also introduced stochastic noise injection: separate Gaussian noise
                        was added to each resolution block, allowing the network to produce
                        natural stochastic variation (hair curl patterns, freckles, pores) without
                        encoding it in the latent code.
                    </div>
                    <div className="ch-tl-impact">Impact: Produced the most photorealistic and controllable high-resolution face generation of the 2010s. The StyleGAN architecture and its W-space became the standard for GAN-based editing and interpolation research.</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Legacy:</strong> The GAN framework became the foundation of every
                high-fidelity image generation system of the late 2010s. Even as diffusion models
                surpassed GANs in quality by 2022, the adversarial discriminator idea survived as
                a loss component in many hybrid systems including Stable Diffusion's VAE training
                and video generation pipelines. GANs introduced the concept of implicit density
                estimation &mdash; learning a distribution by training a network to distinguish
                samples from it, without ever specifying the distribution explicitly.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>A contest between a forger and a detective</h2>

            <Analogy label="The Forger and the Detective">
                Imagine two people: a counterfeiter trying to print fake banknotes, and a bank
                fraud detective trying to catch fakes.
                <br /><br />
                At first, the counterfeiter is terrible &mdash; the bills are obviously wrong. The
                detective catches them immediately. But the detective has to explain <em>why</em>
                the bills are fake (wrong colour, wrong texture, wrong size). That explanation
                reaches the counterfeiter, who tries to fix exactly those problems.
                <br /><br />
                Next round: better fakes, but the detective adapts too. This arms race continues
                for thousands of rounds. Eventually the counterfeiter gets so good that even the
                expert detective can't reliably tell real from fake. That's a trained GAN.
                <br /><br />
                The counterfeiter is the <strong>Generator</strong>. The detective is the
                <strong> Discriminator</strong>. Neither knows the &quot;rules&quot; for what a real
                banknote looks like &mdash; the generator only learns from the feedback, and the
                discriminator only learns by seeing real banknotes and comparing.
            </Analogy>

            <Analogy label="Why the Contest Sometimes Breaks">
                What if the counterfeiter figures out one type of fake that always fools the
                detective, and decides to only make that one type forever? They would stop
                improving. This is called <strong>mode collapse</strong> &mdash; the generator
                gets stuck producing the same output over and over, ignoring the full variety
                of the real data.
                <br /><br />
                Or: what if the detective gets so good so fast that it just says &quot;FAKE!&quot;
                to everything with 100% confidence? Then there's no feedback at all &mdash; the
                detective's criticism is just noise. The counterfeiter can't improve because
                &quot;everything is equally wrong&quot; is not useful feedback. This is the
                <strong> vanishing gradient</strong> problem.
                <br /><br />
                The Wasserstein GAN fixed this by giving the detective a better measuring stick:
                instead of saying &quot;real or fake&quot;, it says &quot;how far from real is this?&quot;
                That distance signal is always informative, even when the fake is very far from real.
                If the fake is terrible, the distance is large. If it's nearly perfect, the distance
                is tiny. The counterfeiter always knows exactly how much to improve.
            </Analogy>

            <Analogy label="DCGAN: Giving the Artists Better Tools">
                The first GANs (2014) produced blurry, low-resolution images because they used simple
                &quot;flat&quot; networks. DCGAN (2015) gave both the forger and the detective
                convolutional eyes &mdash; the same type of visual processing that made AlexNet
                so powerful at recognising images.
                <br /><br />
                With convolutional networks, the forger learned to build images in layers:
                first getting the overall composition right at low resolution, then adding texture
                and sharpness at higher resolution. The detective learned to check each of these
                levels too &mdash; not just the final image but how it looks at different scales.
                The result: sharp, detailed bedroom and face images instead of blurry blobs.
            </Analogy>

            <Analogy label="Progressive Growing: Start Small, Go Big">
                NVIDIA's Progressive GAN (2018) had an elegant solution to the challenge of
                generating very large images. Instead of training on 1024&times;1024 from the start
                (which would be extremely hard), it started at the smallest possible resolution.
                <br /><br />
                Train at 4&times;4 pixels. That's 16 pixels total &mdash; easy. Once the network
                can generate reasonable 4&times;4 images, add a new layer and go to 8&times;8.
                Then 16&times;16. Then 32&times;32. All the way to 1024&times;1024.
                <br /><br />
                At each step, the network already has a good foundation &mdash; it's not starting
                from scratch. Each new resolution only has to add the fine details that the previous
                resolution couldn't capture. This curriculum-style training produced the first
                photorealistic megapixel face images.
            </Analogy>

            <Analogy label="StyleGAN: Separating Content from Style">
                StyleGAN (2019) asked: &quot;what if we could control style (texture, colour, fine
                details) separately from content (face shape, identity)?&quot;
                <br /><br />
                Imagine a portrait artist with two tools: one that draws the overall structure of
                a face (bone structure, head shape, eye placement), and one that adds the surface
                style (skin tone, hair curl, lighting). You can mix-and-match: take the face
                structure of person A and apply the skin and hair style of person B.
                <br /><br />
                StyleGAN does exactly this. A mapping network translates the random noise into a
                &quot;style code&quot; W. At each layer of the generator, this style code controls
                the statistics (how bright, how detailed) of the features at that layer. Change
                W at early layers = change face shape. Change W at late layers = change texture and
                colour. The separation is automatic, learned from data.
            </Analogy>

            <Analogy label="The Famous Bar Story">
                GANs were invented at a Montreal bar. Ian Goodfellow was at a party with PhD
                colleagues when someone mentioned an unresolved problem in generative modelling.
                Goodfellow thought he had an idea. His colleagues were sceptical. He went home
                that night and coded the first working GAN.
                <br /><br />
                The first results were on MNIST digits. The generated images were blurry and
                imperfect. But it worked. The generator learned to produce believable digits
                without ever being told what a digit should look like &mdash; only by receiving
                feedback from the discriminator.
            </Analogy>

            <div className="ch-callout">
                <strong>The people whose faces don't exist:</strong> The website thispersondoesnotexist.com
                shows a new AI-generated face every time you refresh. Every face is produced by a
                StyleGAN network &mdash; trained on hundreds of thousands of real photographs,
                it generates entirely synthetic people who have never existed. This is the GAN
                framework taken to its logical conclusion.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Minimax training, mode collapse, and the Wasserstein fix</h2>

            <h3>The GAN Objective</h3>
            <p>
                GANs are defined by the following minimax game between generator G and
                discriminator D:
            </p>
            <MathBlock tex="\min_G \max_D \; V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p(z)}[\log(1 - D(G(z)))]" />
            <ul>
                <li><strong>D maximises</strong>: assign high probability to real data, low to fakes</li>
                <li><strong>G minimises</strong>: produce fakes that D assigns high probability to</li>
            </ul>

            <h3>Training in Practice</h3>
            <p>
                Because log(1 &minus; D(G(z))) saturates when D is strong (D(G(z)) &asymp; 0 means the
                gradient of G is nearly zero), in practice G is trained to maximise log D(G(z))
                instead &mdash; the non-saturating loss:
            </p>
            <MathBlock tex="\mathcal{L}_G = -\mathbb{E}_{z \sim p(z)}[\log D(G(z))]" />
            <p>
                D is trained for k steps per G update (commonly k = 1 &ndash; 5), balancing the
                feedback quality vs. generator stagnation.
            </p>

            <h3>Why Original GANs Fail: JS Divergence</h3>
            <p>
                The original GAN's optimal discriminator objective equals:
            </p>
            <MathBlock tex="V(D^*, G) = 2 \cdot D_{\text{JS}}(p_{\text{data}} \;\|\; p_G) - \log 4" />
            <p>
                Jensen-Shannon divergence is bounded in [0, log 2] and equals log 2 whenever
                the two distributions have disjoint support. When G produces outputs that look
                nothing like real data, D distinguishes them perfectly, JS = log 2 (constant),
                and the gradient to G is exactly zero. Training stalls.
            </p>

            <h3>Wasserstein GAN: Earth Mover Distance</h3>
            <p>
                WGAN replaces the JS divergence with the Wasserstein-1 distance (Earth Mover
                Distance), which measures the minimum cost of transporting probability mass:
            </p>
            <MathBlock tex="W(p_{\text{data}}, p_G) = \inf_{\gamma \in \Pi} \mathbb{E}_{(x,y) \sim \gamma}\bigl[\|x - y\|\bigr]" />
            <p>
                By the Kantorovich-Rubinstein duality, this equals:
            </p>
            <MathBlock tex="W(p, q) = \sup_{\|f\|_L \leq 1} \;\mathbb{E}_{x \sim p}[f(x)] - \mathbb{E}_{x \sim q}[f(x)]" />
            <p>
                where the supremum is over all 1-Lipschitz functions f. The critic (discriminator)
                is trained to approximate this supremum. The gradient penalty (WGAN-GP) enforces
                the Lipschitz constraint:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{GP}} = \lambda \;\mathbb{E}_{\hat{x}}\!\left[\left(\|\nabla_{\hat{x}} D(\hat{x})\|_2 - 1\right)^2\right]" />

            <h3>DCGAN Architecture Guidelines</h3>
            <p>
                Key design choices that made DCGAN stable:
            </p>
            <ul>
                <li>Replace pooling with strided convolutions (discriminator) and transposed
                    convolutions (generator)</li>
                <li>Batch Normalisation in every layer except D input and G output</li>
                <li>LeakyReLU (slope 0.2) in the discriminator; ReLU in the generator</li>
                <li>Tanh at the generator output; Sigmoid at the discriminator output</li>
                <li>No fully connected hidden layers &mdash; all convolutional</li>
                <li>Weight initialisation from N(0, 0.02)</li>
            </ul>

            <div className="ch-callout">
                <strong>Mode collapse intuition:</strong> If G finds one output that D consistently
                misclassifies as real, gradient descent will collapse G toward producing only that
                output. The generator's loss is minimised, but it covers only one mode of the true
                distribution. WGAN's Earth Mover loss penalises this collapse because moving all
                probability mass to one point incurs a large transport cost from the real distribution.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Minimax derivation &middot; JS vs Wasserstein &middot; Lipschitz theory</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch DCGAN &middot; generator &middot; discriminator &middot; training loop</span>
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
            <h2>Optimal discriminator, JS divergence, and Wasserstein theory</h2>

            <DefBlock label="The GAN Value Function">
                For fixed G, the optimal discriminator D* is derived by maximising V(D, G)
                pointwise for each x:
                <MathBlock tex="D^*(x) = \frac{p_{\text{data}}(x)}{p_{\text{data}}(x) + p_G(x)}" />
            </DefBlock>

            <h3>Substituting D* Back</h3>
            <p>
                With D = D*, the generator objective becomes:
            </p>
            <MathBlock tex="C(G) = \mathbb{E}_{x \sim p_{\text{data}}}\!\left[\log \frac{p_{\text{data}}(x)}{p_{\text{data}}(x)+p_G(x)}\right] + \mathbb{E}_{x \sim p_G}\!\left[\log \frac{p_G(x)}{p_{\text{data}}(x)+p_G(x)}\right]" />
            <p>
                Rewriting in terms of Jensen-Shannon divergence (JS):
            </p>
            <MathBlock tex="C(G) = 2 D_{\text{JS}}(p_{\text{data}} \;\|\; p_G) - \log 4" />
            <p>
                The global minimum C(G) = &minus;log 4 is achieved if and only if p_G = p_data.
                The JS divergence is symmetric and bounded in [0, log 2].
            </p>

            <h3>Why JS Fails: Disjoint Supports</h3>
            <p>
                If p_data and p_G have disjoint support (true early in training), then for almost
                every x: either p_data(x) = 0 or p_G(x) = 0, so D*(x) &isin; &#123;0, 1&#125;.
                The JS divergence equals log 2 (maximum). The gradient of C(G) with respect to
                G's parameters is zero almost everywhere. Training stalls completely.
            </p>

            <h3>Wasserstein-1 Distance</h3>
            <MathBlock tex="W_1(p, q) = \inf_{\gamma \in \Pi(p,q)} \int \|x - y\| \,d\gamma(x,y)" />
            <p>
                Unlike JS, W_1 is finite and continuous even for disjoint distributions. It gives
                a meaningful gradient signal at every point in training. By Kantorovich-Rubinstein:
            </p>
            <MathBlock tex="W_1(p, q) = \sup_{\|f\|_L \leq 1}\; \mathbb{E}_{x \sim p}[f(x)] - \mathbb{E}_{x \sim q}[f(x)]" />
            <p>
                The critic f (constrained to be 1-Lipschitz) approximates this supremum.
                The WGAN training objectives are:
            </p>
            <MathBlock tex="\max_{\|f\|_L \leq 1} \; \mathbb{E}_x[f(x)] - \mathbb{E}_z[f(G(z))]" />
            <MathBlock tex="\min_G \; -\mathbb{E}_z[f(G(z))]" />

            <h3>Gradient Penalty (WGAN-GP)</h3>
            <p>
                Weight clipping enforces 1-Lipschitz constraint crudely. WGAN-GP (Gulrajani et al.,
                2017) enforces it via a penalty on interpolated samples &hat;x = &alpha;x + (1&minus;&alpha;)G(z):
            </p>
            <MathBlock tex="\mathcal{L}_D = \underbrace{\mathbb{E}_z[f(G(z))] - \mathbb{E}_x[f(x)]}_{\text{Wasserstein estimate}} + \lambda \underbrace{\mathbb{E}_{\hat{x}}\!\left[\left(\|\nabla_{\hat{x}} f(\hat{x})\|_2 - 1\right)^2\right]}_{\text{gradient penalty}}" />
            <p>
                The gradient penalty is differentiable and avoids the capacity under-use caused
                by weight clipping. &lambda; = 10 is the standard setting.
            </p>

            <div className="ch-callout">
                <strong>Theorem (Goodfellow 2014):</strong> The minimax GAN game has a unique
                global equilibrium where p_G = p_data and D*(x) = 1/2 everywhere (the discriminator
                cannot distinguish real from generated). In practice, this equilibrium is never
                perfectly reached &mdash; the game is played on finite data, with finite-capacity
                networks, using alternating gradient descent rather than simultaneous optimisation.
            </div>
        </>
    )
}

const DCGAN_CODE = `import torch
import torch.nn as nn

# ── DCGAN Generator ────────────────────────────────────────────────────────────
# Maps z (100-dim noise) -> 64x64 RGB image via transposed convolutions
class Generator(nn.Module):
    def __init__(self, z_dim=100, ngf=64, nc=3):
        super().__init__()
        # Input: (batch, z_dim, 1, 1)
        self.net = nn.Sequential(
            # Layer 1: 1x1 -> 4x4
            nn.ConvTranspose2d(z_dim, ngf*8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf*8),
            nn.ReLU(inplace=True),
            # Layer 2: 4x4 -> 8x8
            nn.ConvTranspose2d(ngf*8, ngf*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*4),
            nn.ReLU(inplace=True),
            # Layer 3: 8x8 -> 16x16
            nn.ConvTranspose2d(ngf*4, ngf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*2),
            nn.ReLU(inplace=True),
            # Layer 4: 16x16 -> 32x32
            nn.ConvTranspose2d(ngf*2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf),
            nn.ReLU(inplace=True),
            # Output: 32x32 -> 64x64  (no BatchNorm, Tanh)
            nn.ConvTranspose2d(ngf, nc, 4, 2, 1, bias=False),
            nn.Tanh()   # images in [-1, 1]
        )

    def forward(self, z):
        return self.net(z)

# ── DCGAN Discriminator ────────────────────────────────────────────────────────
# Maps 64x64 RGB image -> real/fake probability
class Discriminator(nn.Module):
    def __init__(self, ndf=64, nc=3):
        super().__init__()
        # Input: (batch, nc, 64, 64)
        self.net = nn.Sequential(
            # No BatchNorm on first layer (per DCGAN paper)
            nn.Conv2d(nc, ndf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            # 32x32
            nn.Conv2d(ndf, ndf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf*2),
            nn.LeakyReLU(0.2, inplace=True),
            # 16x16
            nn.Conv2d(ndf*2, ndf*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf*4),
            nn.LeakyReLU(0.2, inplace=True),
            # 8x8
            nn.Conv2d(ndf*4, ndf*8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf*8),
            nn.LeakyReLU(0.2, inplace=True),
            # 4x4 -> 1x1
            nn.Conv2d(ndf*8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x).view(-1)

# ── Training step ──────────────────────────────────────────────────────────────
def train_step(real_imgs, G, D, opt_G, opt_D, z_dim=100, device='cpu'):
    batch = real_imgs.size(0)
    real  = real_imgs.to(device)
    criterion = nn.BCELoss()

    # ── Train Discriminator ────────────────────────────────────────────────────
    opt_D.zero_grad()
    pred_real = D(real)
    loss_real = criterion(pred_real, torch.ones(batch, device=device))
    z = torch.randn(batch, z_dim, 1, 1, device=device)
    fake = G(z).detach()   # detach: don't backprop through G here
    pred_fake = D(fake)
    loss_fake = criterion(pred_fake, torch.zeros(batch, device=device))
    loss_D = (loss_real + loss_fake) / 2
    loss_D.backward()
    opt_D.step()

    # ── Train Generator ────────────────────────────────────────────────────────
    opt_G.zero_grad()
    z = torch.randn(batch, z_dim, 1, 1, device=device)
    fake = G(z)
    pred = D(fake)
    # Non-saturating loss: maximise log D(G(z)) instead of minimising log(1-D(G(z)))
    loss_G = criterion(pred, torch.ones(batch, device=device))
    loss_G.backward()
    opt_G.step()

    return loss_D.item(), loss_G.item()

# ── Instantiate and test ───────────────────────────────────────────────────────
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
G = Generator().to(device)
D = Discriminator().to(device)

# Weight initialisation: N(0, 0.02) for Conv and BatchNorm (DCGAN paper)
def weights_init(m):
    classname = m.__class__.__name__
    if 'Conv' in classname:
        nn.init.normal_(m.weight.data, 0.0, 0.02)
    elif 'BatchNorm' in classname:
        nn.init.normal_(m.weight.data, 1.0, 0.02)
        nn.init.constant_(m.bias.data, 0)

G.apply(weights_init)
D.apply(weights_init)

print(f"Generator params:     {sum(p.numel() for p in G.parameters()):,}")
print(f"Discriminator params: {sum(p.numel() for p in D.parameters()):,}")

z_test    = torch.randn(4, 100, 1, 1, device=device)
img_test  = G(z_test)
score     = D(img_test)
print(f"Generated image shape: {img_test.shape}")   # (4, 3, 64, 64)
print(f"Discriminator output:  {score.shape}")       # (4,)
`

function PythonContent() {
    return (
        <>
            <p>
                A full DCGAN implementation following the original Radford et al. architecture:
                strided convolutions throughout, BatchNorm in all layers except D input and G output,
                LeakyReLU in the discriminator, ReLU in the generator, and the standard weight
                initialisation from N(0, 0.02). The non-saturating generator loss (maximise
                log D(G(z)) rather than minimise log(1&minus;D(G(z)))) is used to prevent
                vanishing gradients early in training.
            </p>
            <CodeBlock code={DCGAN_CODE} filename="dcgan.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Two networks, two optimisers:</strong> G and D each have their own Adam
                optimiser. They update alternately &mdash; D updates k times, then G updates once.
                The detach() call on fake during D's update is critical: without it, backprop
                would flow through G, corrupting G's gradient signal with D's update.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GANS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
