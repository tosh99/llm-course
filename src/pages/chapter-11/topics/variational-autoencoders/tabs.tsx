import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From recognition to generation</h2>
            <p>
                Chapter 10's CNN architectures &mdash; from AlexNet to DenseNet &mdash; had mastered
                classification: given an image, identify it. But they could not run in reverse: given
                a category, synthesise what it looks like. Two entirely different generative frameworks
                emerged in 2013 and 2014, running in parallel with the CNN papers being published.
                The Variational Autoencoder was the first principled probabilistic answer to the
                question: how do you teach a network to imagine?
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2006</div>
                    <div className="ch-tl-section-label">Precursor</div>
                    <div className="ch-tl-title">Hinton &amp; Salakhutdinov &mdash; Deep Autoencoders</div>
                    <div className="ch-tl-body">
                        Hinton and Salakhutdinov's 2006 paper "Reducing the Dimensionality of Data
                        with Neural Networks" demonstrated that a deep autoencoder could compress
                        high-dimensional data into a compact code and reconstruct it with high
                        fidelity. The encoder maps input x to a low-dimensional code z; the decoder
                        maps z back to a reconstruction x&#700;. Trained end-to-end with reconstruction
                        loss, the network learned meaningful structure: the codes for similar faces
                        clustered together, the codes for digits organised by class.
                        <br /><br />
                        The limitation: the latent space was <em>unstructured</em>. Because there was
                        no constraint on where codes landed in z-space, most of the latent space was
                        empty &mdash; you could not sample a random z and get a meaningful output.
                        The model had learned to compress but not to generate. If you picked a random
                        point in z-space and decoded it, the output was noise.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved deep autoencoders could learn compact, meaningful representations &mdash; but revealed the generation gap: compression without structure cannot generate.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2007 &ndash; 2012</div>
                    <div className="ch-tl-section-label">Context</div>
                    <div className="ch-tl-title">Restricted Boltzmann Machines and Generative Limitations</div>
                    <div className="ch-tl-body">
                        Before VAEs, the dominant approach to generative modelling was Restricted
                        Boltzmann Machines (RBMs) and Deep Boltzmann Machines (DBMs). These
                        probabilistic models defined a joint distribution over visible and hidden
                        units and could, in principle, generate new samples by running Markov Chain
                        Monte Carlo (MCMC) &mdash; repeatedly sampling from the joint distribution
                        until it converged.
                        <br /><br />
                        In practice, MCMC sampling was extremely slow: thousands of steps were
                        needed to mix properly. Generating a single image from a DBM on MNIST took
                        minutes. The models were also difficult to scale: training required
                        contrastive divergence approximations that left the learned distribution
                        systematically biased. By 2012, as discriminative CNNs were solving
                        classification at ImageNet scale, generative models were still struggling
                        to produce clean 28&times;28 MNIST digits quickly.
                    </div>
                    <div className="ch-tl-impact">Impact: Exposed the critical bottleneck of prior generative methods: slow sampling. Any viable generative model needed to produce samples in a single forward pass, not a long Markov chain.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Kingma &amp; Welling &mdash; Auto-Encoding Variational Bayes</div>
                    <div className="ch-tl-body">
                        Diederik Kingma and Max Welling's paper "Auto-Encoding Variational Bayes,"
                        submitted to ICLR 2014, introduced the Variational Autoencoder (VAE).
                        The key idea: instead of encoding an input to a single point in latent
                        space, encode it to a <em>probability distribution</em> &mdash; a Gaussian
                        with mean &mu; and standard deviation &sigma; for each latent dimension.
                        <br /><br />
                        The <strong>reparameterization trick</strong> made this trainable: rather
                        than sampling z directly from N(&mu;, &sigma;&sup2;), write z = &mu; + &sigma; &middot; &epsilon;
                        where &epsilon; ~ N(0, I). This keeps the sampling operation outside the
                        gradient computation path, allowing backpropagation to flow through &mu; and &sigma;
                        without any approximation.
                        <br /><br />
                        A KL divergence penalty forces the learned distributions q(z|x) to stay close
                        to a standard normal prior N(0, I), ensuring the latent space is continuous
                        and fully populated &mdash; you can sample any z ~ N(0, I) and decode it into
                        a plausible output.
                    </div>
                    <div className="ch-tl-impact">Impact: First principled generative model with a structured, continuous latent space enabling smooth interpolation and fast single-pass sampling from a learned distribution.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 &ndash; 2016</div>
                    <div className="ch-tl-section-label">Applications</div>
                    <div className="ch-tl-title">Image Synthesis, Drug Discovery, and Anomaly Detection</div>
                    <div className="ch-tl-body">
                        VAEs proved productive across multiple domains rapidly after the original paper.
                        On the CelebA face dataset, VAEs learned a latent space where you could interpolate
                        smoothly between two faces &mdash; morphing expression, pose, or identity
                        continuously without discrete jumps. The interpolation worked because the KL
                        regularisation ensured the space between two encoded faces was populated
                        with plausible intermediate faces.
                        <br /><br />
                        In drug discovery, researchers mapped chemical compounds (represented as SMILES
                        strings) into VAE latent spaces and performed gradient-based optimisation in
                        z-space to find molecules with desired properties such as drug-likeness and
                        binding affinity. This workflow &mdash; encode molecules to latent space,
                        optimise continuously in that space, decode back to molecular structure &mdash;
                        was computationally intractable in the discrete molecular graph space but
                        became practical with the VAE's continuous latent representation.
                        <br /><br />
                        In anomaly detection, the reconstruction error served as an anomaly score:
                        normal samples (seen during training) reconstructed faithfully, producing low
                        reconstruction loss. Anomalies (unseen patterns) could not be mapped to a
                        plausible region of the learned latent space, producing high reconstruction error.
                    </div>
                    <div className="ch-tl-impact">Impact: Established VAEs as versatile tools for generation, interpolation, representation learning, and anomaly detection across vision, chemistry, and time-series domains.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">&beta;-VAE &mdash; Disentangled Representations</div>
                    <div className="ch-tl-body">
                        Higgins et al. (2017) introduced &beta;-VAE by scaling the KL term in the
                        ELBO by a coefficient &beta; &gt; 1. The standard VAE uses &beta; = 1; larger
                        &beta; places a stronger constraint on the latent space, forcing it to be
                        more like the isotropic prior N(0, I).
                        <br /><br />
                        The surprising effect: with sufficiently large &beta;, the learned latent
                        dimensions become disentangled &mdash; each dimension corresponds to an
                        independent generative factor in the data. For a face dataset, one dimension
                        might control only lighting, another only pose, another only smile intensity.
                        Traversing a single latent dimension changes only that attribute, leaving all
                        others fixed. This is not guaranteed at &beta; = 1.
                    </div>
                    <div className="ch-tl-impact">Impact: Revealed that the KL weight is a dial between reconstruction fidelity (&beta; = 1) and interpretable disentanglement (&beta; &gt;&gt; 1), enabling controllable generation of complex attributes.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 &ndash; 2022</div>
                    <div className="ch-tl-section-label">Influence</div>
                    <div className="ch-tl-title">VQ-VAE, DALL-E, and the Diffusion Connection</div>
                    <div className="ch-tl-body">
                        The VAE framework proved to be the foundation for the image generation
                        revolution of the early 2020s, though not in its original form. The
                        Vector-Quantised VAE (VQ-VAE, van den Oord et al., 2017) replaced the
                        continuous Gaussian latent space with a discrete codebook: the encoder maps
                        to a sequence of discrete tokens, and the decoder reconstructs from those tokens.
                        <br /><br />
                        DALL-E (OpenAI, 2021) used a VQ-VAE as its image tokeniser: photographs were
                        compressed to a grid of discrete tokens, and a Transformer was trained to
                        predict these token sequences given text descriptions. Stable Diffusion (2022)
                        used a standard continuous VAE as its latent space: images were compressed to
                        a 4&times;64&times;64 latent representation, the diffusion process operated in
                        this compressed latent space rather than pixel space, and the trained decoder
                        expanded the latent back to a full image. The &ldquo;latent diffusion&rdquo;
                        approach reduced computation by a factor of roughly 8&times; compared to
                        pixel-space diffusion.
                    </div>
                    <div className="ch-tl-impact">Impact: The VAE encoder-decoder structure became the standard image tokeniser for the most powerful generative systems of the 2020s, from DALL-E to Stable Diffusion to Sora.</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Legacy:</strong> The VAE framework &mdash; encoding to distributions rather
                than points, regularising the latent space with a KL penalty, and using the
                reparameterisation trick for differentiable sampling &mdash; became a foundational
                primitive. Conditional VAEs, hierarchical VAEs, and VQ-VAEs all descend from
                Kingma and Welling's 2013 paper. The paper has been cited over 30,000 times.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Teaching a computer to dream</h2>

            <p className="ch-story-intro">
                Chapter 10 built the world's best image recognisers. By 2013, a computer could name
                almost any photo. But could it <em>draw</em> one? Variational Autoencoders changed
                that in 2013 &mdash; for the first time, a neural network could generate realistic
                images by navigating a compressed map of everything it had ever seen.
            </p>

            <Analogy label="The Compression Tube">
                A regular autoencoder is like a photocopier with a very narrow tube. You put a
                photo in one end, it squeezes through the tube as a tiny bundle of numbers, and
                comes out the other end as a copy.
                <br /><br />
                The problem: the tiny bundle doesn't cover every possible picture. There are huge
                gaps in bundle-space that don't correspond to anything meaningful. If you pick a
                random bundle and push it through the output side, you get garbage.
                <br /><br />
                The VAE adds one twist: instead of recording a single precise bundle, it records a
                <em> fuzzy cloud</em> &mdash; &quot;this face is probably somewhere in this region of
                face-space, give or take.&quot; That fuzziness fills in the gaps and lets you generate
                new faces by picking any point inside any cloud.
            </Analogy>

            <Analogy label="The Map of All Faces">
                Imagine a giant map where every face ever drawn is plotted as a dot. Faces that
                look similar are close together. Baby faces cluster in one corner. Old faces in
                another. Smiling faces along one edge, frowning along the opposite.
                <br /><br />
                The VAE learns this map. To generate a new face, you pick any point on the map and
                ask: &quot;what face lives here?&quot; The network has learned to answer that question for
                every single point &mdash; even points it never saw during training. Because the
                clouds filled in the map continuously, there are no blank spots.
            </Analogy>

            <Analogy label="Why the Fuzziness Is the Key">
                During training, the VAE is forced to be a bit unsure about where each face belongs
                on the map. It can't pin a face to a single exact point &mdash; it has to say
                &quot;somewhere in this region.&quot;
                <br /><br />
                This sounds like a weakness, but it's actually the superpower. Because every face
                claims a region (not just a point), all the regions overlap and cover the whole map.
                Now you can walk anywhere on the map and generate something meaningful. That's
                the difference between a recogniser and a dreamer.
            </Analogy>

            <Analogy label="The Magic Maths Trick: Reparameterisation">
                Here's a tricky problem: the VAE needs to sample randomly from its fuzzy cloud.
                But random sampling breaks the learning process &mdash; you can't work out how
                to improve a random step.
                <br /><br />
                The reparameterisation trick is the solution. Instead of sampling z from the cloud
                directly, the VAE writes: z = centre + spread &times; random_noise. The centre and
                spread are learned; the random_noise is just a fixed random number drawn once.
                <br /><br />
                Now the randomness is separated from the parts that need to be learned. You can
                improve the centre and the spread (by flowing information backwards), while the
                random_noise stays safely separate. It's like asking: &quot;what if I had moved
                my umbrella 10 cm to the right?&quot; &mdash; the rain (random_noise) doesn't change,
                only where you're holding the umbrella.
            </Analogy>

            <Analogy label="Blurry Images: The Known Limitation">
                VAEs have a famous flaw: their generated images tend to be blurry. Why?
                <br /><br />
                The reconstruction loss (the part that says &quot;make the output look like the input&quot;)
                is measured by average pixel error. If the VAE is unsure whether a pixel should be
                slightly dark or slightly light, it hedges by making it a medium grey. The average
                of two possibilities is always blurrier than either possibility alone.
                <br /><br />
                GANs (the next topic) solved this problem by replacing the pixel-comparison loss with
                a discriminator &mdash; a second network that judges whether the output looks real.
                A discriminator can tell the difference between &quot;blurry and averaged&quot; versus
                &quot;crisp and committed.&quot; VAEs still use pixel comparison, so they still produce
                blurry images. But VAEs have a far better and more useful latent space than GANs &mdash;
                which is why Stable Diffusion uses a VAE encoder/decoder alongside a diffusion model.
            </Analogy>

            <Analogy label="Drug Discovery in Latent Space">
                One of the most exciting uses of VAEs is in medicine. A molecule is a complex graph
                of atoms &mdash; hard to search or modify directly. But encode millions of molecules
                into a VAE latent space, and they become points in a smooth, searchable map.
                <br /><br />
                Researchers can then ask: &quot;walk in the direction of the map that makes molecules
                more drug-like.&quot; They take a molecule, encode it to a latent point, take a step in
                the target direction, decode back to a molecule, and test it. This gradient-guided
                drug discovery was impossible before VAEs turned the jagged space of all molecules
                into a smooth navigable map.
            </Analogy>

            <div className="ch-callout">
                <strong>The stable diffusion connection:</strong> When you use Stable Diffusion to
                create AI art, your image is being generated in a VAE latent space. The diffusion
                model works in a compressed 64&times;64 space (not full pixels), and the VAE decoder
                expands the result back to a full image. The 2013 VAE paper lives inside every
                AI art generator used today.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Probabilistic encoders, KL regularization, and the ELBO</h2>

            <h3>The Problem with Regular Autoencoders</h3>
            <p>
                A standard autoencoder trains with reconstruction loss only:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{AE}} = \|x - \hat{x}\|^2" />
            <p>
                The encoder E(x) maps x to a single point z in latent space. The decoder D(z)
                maps z back to x&#700;. With only reconstruction loss, the encoder can place latent
                codes arbitrarily far apart in z-space. The result: a <em>discontinuous</em> latent
                space full of holes. Sampling a random z from that space and decoding it produces
                garbage, because most of z-space was never visited during training.
            </p>

            <h3>VAE: Encode to a Distribution</h3>
            <p>
                The VAE replaces the deterministic encoder with a <em>probabilistic</em> encoder
                q&phi;(z|x) that outputs a Gaussian distribution over z:
            </p>
            <MathBlock tex="q_\phi(z \mid x) = \mathcal{N}(z \,;\, \mu_\phi(x),\, \text{diag}(\sigma^2_\phi(x)))" />
            <p>
                Two neural networks (sharing an encoder backbone) predict &mu; and log&sigma;&sup2; for
                each input x. The latent variable z is then <em>sampled</em> from this distribution.
            </p>

            <h3>The Reparameterization Trick</h3>
            <p>
                Sampling z ~ N(&mu;, &sigma;&sup2;) is not differentiable &mdash; you cannot backpropagate
                through a random draw. The reparameterization trick resolves this by rewriting the
                sample as:
            </p>
            <MathBlock tex="z = \mu_\phi(x) + \sigma_\phi(x) \cdot \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, I)" />
            <p>
                Now the randomness (&epsilon;) is in a fixed, parameter-free distribution. The gradients
                flow through &mu; and &sigma; to the encoder weights &phi; without obstruction.
                The stochastic node (&epsilon;) is never differentiated &mdash; it is treated as an
                external input sampled before the computation graph begins.
            </p>

            <h3>The VAE Loss: ELBO</h3>
            <p>
                VAE training maximises the Evidence Lower BOund (ELBO):
            </p>
            <MathBlock tex="\mathcal{L}_{\text{VAE}} = \underbrace{\mathbb{E}_{q_\phi(z|x)}\bigl[\log p_\theta(x \mid z)\bigr]}_{\text{Reconstruction term}} - \underbrace{D_{\text{KL}}\bigl(q_\phi(z \mid x) \;\|\; p(z)\bigr)}_{\text{Regularization term}}" />
            <p>
                The two terms play opposing roles:
            </p>
            <ul>
                <li><strong>Reconstruction term</strong> &mdash; maximise the likelihood of reconstructing
                    x from a sampled z. Minimised as mean-squared error (Gaussian decoder) or
                    binary cross-entropy (Bernoulli decoder).</li>
                <li><strong>KL divergence term</strong> &mdash; penalise how far the learned posterior
                    q&phi;(z|x) deviates from the prior p(z) = N(0, I). This forces all latent
                    distributions toward the origin, ensuring the space is densely covered.</li>
            </ul>

            <h3>Closed-Form KL for Gaussians</h3>
            <p>
                When both distributions are Gaussian, the KL has an analytic form:
            </p>
            <MathBlock tex="D_{\text{KL}}\bigl(\mathcal{N}(\mu, \sigma^2) \;\|\; \mathcal{N}(0, I)\bigr) = \frac{1}{2} \sum_{j=1}^{d} \left(\mu_j^2 + \sigma_j^2 - \log \sigma_j^2 - 1\right)" />
            <p>
                This can be computed analytically &mdash; no Monte Carlo estimation needed.
                The encoder outputs log&sigma;&sup2; directly for numerical stability, giving
                &sigma;&sup2; = exp(log&sigma;&sup2;).
            </p>

            <div className="ch-callout">
                <strong>The tension:</strong> The reconstruction term wants the encoder to be precise
                (encode to tight, distinct distributions). The KL term wants all distributions to be
                identical unit Gaussians. The ELBO weight &beta; in &beta;-VAEs controls this trade-off:
                higher &beta; yields more disentangled latent dimensions at the cost of reconstruction
                fidelity.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">ELBO derivation &middot; Jensen's inequality &middot; variational inference</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch VAE &middot; encoder &middot; decoder &middot; reparameterization</span>
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
            <h2>Deriving the ELBO from first principles</h2>

            <DefBlock label="The Generative Model">
                We assume data x is generated by a latent variable z via p&theta;(x, z) = p&theta;(x|z) &middot; p(z).
                The prior p(z) = N(0, I). We want to find &theta; that maximises the marginal
                log-likelihood log p&theta;(x) = log &int; p&theta;(x|z) p(z) dz.
                This integral is intractable for neural network decoders.
            </DefBlock>

            <h3>Introducing the Variational Posterior</h3>
            <p>
                Introduce an approximate posterior q&phi;(z|x) (the encoder). By Jensen's inequality
                applied to the concave log function:
            </p>
            <MathBlock tex="\log p_\theta(x) = \log \int p_\theta(x \mid z)\, p(z)\, dz \geq \mathbb{E}_{q_\phi(z \mid x)}\!\left[\log \frac{p_\theta(x \mid z)\, p(z)}{q_\phi(z \mid x)}\right]" />
            <p>
                Expanding:
            </p>
            <MathBlock tex="\text{ELBO}(\theta, \phi; x) = \mathbb{E}_{q_\phi(z|x)}\bigl[\log p_\theta(x \mid z)\bigr] - D_{\text{KL}}\!\bigl(q_\phi(z \mid x) \;\|\; p(z)\bigr)" />
            <p>
                The gap between log p&theta;(x) and the ELBO equals the KL divergence of q from the
                true posterior p&theta;(z|x). Maximising ELBO simultaneously: (1) pushes q toward
                the true posterior, and (2) maximises a lower bound on the data likelihood.
            </p>

            <h3>Closed-Form KL for Diagonal Gaussians</h3>
            <MathBlock tex="D_{\text{KL}}\!\bigl(\mathcal{N}(\mu, \sigma^2 I) \;\|\; \mathcal{N}(0, I)\bigr) = \frac{1}{2}\sum_j \!\left(\mu_j^2 + \sigma_j^2 - \ln \sigma_j^2 - 1\right)" />
            <p>
                In practice, the encoder outputs log &sigma;&sup2; (not &sigma;&sup2;) for numerical
                stability. Then &sigma;&sup2; = exp(log &sigma;&sup2;), and the KL becomes:
            </p>
            <MathBlock tex="\frac{1}{2}\sum_j \!\left(\mu_j^2 + e^{s_j} - s_j - 1\right), \quad s_j = \log \sigma_j^2" />

            <h3>Reparameterization Gradient</h3>
            <p>
                The reconstruction term requires gradients through a sampling operation. Let:
            </p>
            <MathBlock tex="z^{(l)} = \mu_\phi(x) + \sigma_\phi(x) \odot \varepsilon^{(l)}, \quad \varepsilon^{(l)} \sim \mathcal{N}(0, I)" />
            <p>
                Then the Monte Carlo estimator of the reconstruction term is unbiased:
            </p>
            <MathBlock tex="\nabla_{\!\phi}\, \mathbb{E}_{q_\phi}\!\bigl[\log p_\theta(x \mid z)\bigr] \approx \frac{1}{L}\sum_{l=1}^{L} \nabla_{\!\phi}\, \log p_\theta\!\bigl(x \mid z^{(l)}\bigr)" />
            <p>
                In practice L = 1 works well &mdash; a single sample per forward pass provides
                sufficient gradient signal when batches are large.
            </p>

            <div className="ch-callout">
                <strong>The information-theoretic view:</strong> The ELBO can be rewritten as
                E[log p(x|z)] &minus; KL = &minus;(reconstruction cost) &minus; (information
                rate). This is the rate-distortion trade-off: the KL measures how many bits
                the encoder uses to describe z, and the reconstruction term measures how well
                those bits let the decoder recover x. The VAE simultaneously minimises distortion
                and constrains the information rate.
            </div>
        </>
    )
}

const VAE_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Encoder ────────────────────────────────────────────────────────────────────
class Encoder(nn.Module):
    """Maps input x to distribution parameters (mu, log_var) in latent space."""
    def __init__(self, input_dim: int, hidden_dim: int, latent_dim: int):
        super().__init__()
        self.fc1      = nn.Linear(input_dim, hidden_dim)
        self.fc_mu    = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)

    def forward(self, x: torch.Tensor):
        h = F.relu(self.fc1(x))
        mu      = self.fc_mu(h)
        log_var = self.fc_logvar(h)   # log sigma^2 for numerical stability
        return mu, log_var

# ── Decoder ────────────────────────────────────────────────────────────────────
class Decoder(nn.Module):
    """Maps latent sample z back to reconstruction x_hat."""
    def __init__(self, latent_dim: int, hidden_dim: int, output_dim: int):
        super().__init__()
        self.fc1 = nn.Linear(latent_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, z: torch.Tensor):
        h = F.relu(self.fc1(z))
        return torch.sigmoid(self.fc2(h))  # pixel values in [0, 1]

# ── VAE ────────────────────────────────────────────────────────────────────────
class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=512, latent_dim=20):
        super().__init__()
        self.encoder = Encoder(input_dim, hidden_dim, latent_dim)
        self.decoder = Decoder(latent_dim, hidden_dim, input_dim)

    def reparameterize(self, mu: torch.Tensor, log_var: torch.Tensor) -> torch.Tensor:
        """z = mu + sigma * epsilon,  epsilon ~ N(0, I)"""
        if self.training:
            std = torch.exp(0.5 * log_var)      # sigma = exp(log_var / 2)
            eps = torch.randn_like(std)          # epsilon ~ N(0, I)
            return mu + std * eps               # reparameterized sample
        else:
            return mu                            # deterministic at eval time

    def forward(self, x: torch.Tensor):
        mu, log_var = self.encoder(x)
        z = self.reparameterize(mu, log_var)
        x_hat = self.decoder(z)
        return x_hat, mu, log_var

    def generate(self, num_samples: int, device: torch.device) -> torch.Tensor:
        """Sample z ~ N(0, I) and decode to new images."""
        z = torch.randn(num_samples, self.encoder.fc_mu.out_features).to(device)
        return self.decoder(z)

# ── Loss function (negative ELBO) ──────────────────────────────────────────────
def vae_loss(x: torch.Tensor, x_hat: torch.Tensor,
             mu: torch.Tensor, log_var: torch.Tensor) -> torch.Tensor:
    """
    ELBO = E[log p(x|z)] - KL[q(z|x) || p(z)]
    Loss = -ELBO = reconstruction_loss + kl_divergence
    """
    # Reconstruction: binary cross-entropy (pixel-wise, summed over pixels)
    recon = F.binary_cross_entropy(x_hat, x, reduction='sum')

    # KL divergence: closed-form for Gaussians
    # KL = -0.5 * sum(1 + log_var - mu^2 - exp(log_var))
    kl = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())

    return recon + kl

# ── Training loop ──────────────────────────────────────────────────────────────
def train_vae():
    import torchvision
    import torchvision.transforms as transforms
    from torch.utils.data import DataLoader

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # MNIST: 28x28 grayscale -> flatten to 784
    transform = transforms.Compose([transforms.ToTensor()])
    dataset = torchvision.datasets.MNIST('./data', train=True,
                                         download=True, transform=transform)
    loader  = DataLoader(dataset, batch_size=128, shuffle=True)

    model = VAE(input_dim=784, hidden_dim=512, latent_dim=20).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    for epoch in range(10):
        total_loss = 0.0
        for x, _ in loader:
            x = x.view(-1, 784).to(device)   # flatten images
            optimizer.zero_grad()
            x_hat, mu, log_var = model(x)
            loss = vae_loss(x, x_hat, mu, log_var)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        avg = total_loss / len(dataset)
        print(f"Epoch {epoch+1:2d} | Loss/sample: {avg:.2f}")

    # Generate new samples from N(0,I)
    model.eval()
    with torch.no_grad():
        samples = model.generate(16, device)   # 16 generated images
        samples = samples.view(16, 1, 28, 28)
    print(f"Generated samples shape: {samples.shape}")

if __name__ == '__main__':
    train_vae()
`

function PythonContent() {
    return (
        <>
            <p>
                A complete PyTorch VAE for MNIST. The encoder outputs &mu; and log&sigma;&sup2;;
                the reparameterization trick makes sampling differentiable; the ELBO loss combines
                binary cross-entropy reconstruction with the closed-form KL divergence.
            </p>
            <CodeBlock code={VAE_CODE} filename="vae.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Generation vs. reconstruction:</strong> At training time, the encoder
                produces &mu; and &sigma;, we sample z = &mu; + &sigma;&middot;&epsilon;, and decode z.
                At generation time (model.generate), we skip the encoder entirely and sample
                z ~ N(0, I) directly &mdash; the KL regularisation has ensured the prior covers
                the full latent space.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const VAE_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
