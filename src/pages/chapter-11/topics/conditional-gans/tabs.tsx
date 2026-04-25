import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Guiding generation with conditions</h2>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2014</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Mirza &amp; Osindero &mdash; Conditional Generative Adversarial Nets</div>
                    <div className="ch-tl-body">
                        Just months after Goodfellow's GAN paper, Mehdi Mirza and Simon Osindero
                        published "Conditional Generative Adversarial Nets," extending the framework
                        with a simple but powerful modification: feed a conditioning variable y into
                        both the generator and discriminator.
                        <br /><br />
                        G(z, y) generates samples conditioned on y. D(x, y) judges whether x is a
                        real sample <em>of class y</em>. The conditioning information y can be a
                        class label (concatenated as a one-hot vector), any structured side
                        information, or even another image. On MNIST digit generation, the cGAN
                        could generate specific digits on demand: G(z, y=7) reliably produced a 7.
                        <br /><br />
                        This modification transformed GANs from random image machines into
                        <em> steerable generators</em>: instead of asking &quot;generate something
                        from this distribution,&quot; you could ask &quot;generate something from
                        this specific conditional distribution.&quot; The game now rewarded the
                        generator for producing something that looked real <em>given the condition</em>,
                        not just real in general.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that GAN generation could be precisely controlled by conditioning on arbitrary side information &mdash; a foundational step toward text-to-image and any-to-any generation.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 &ndash; 2017</div>
                    <div className="ch-tl-section-label">Image Translation</div>
                    <div className="ch-tl-title">Pix2Pix &mdash; Isola, Zhu, Zhou &amp; Efros</div>
                    <div className="ch-tl-body">
                        Phillip Isola, Jun-Yan Zhu, Tinghui Zhou, and Alexei Efros at Berkeley
                        published "Image-to-Image Translation with Conditional Adversarial Networks"
                        in 2017 (first on arXiv in 2016). They applied conditional GANs to paired
                        image translation: the condition is an input image; the generator must
                        produce the corresponding output image.
                        <br /><br />
                        Training pairs: (sketch, photograph), (aerial view, street map), (building
                        facade labels, building photo), (daytime, nighttime), (depth map, colour image).
                        The generator uses a U-Net architecture (encoder-decoder with skip connections)
                        that takes the input image and produces the translated output. The discriminator
                        takes both input and output and judges whether the pair (input, output) is real
                        or generated.
                        <br /><br />
                        The loss combines adversarial loss with pixel-wise L1 reconstruction:
                        L = L_cGAN + &lambda; &middot; L_L1. The adversarial term ensures perceptual
                        realism; the L1 term penalises blurry outputs that fool the discriminator
                        but deviate from ground truth. &lambda; = 100 proved the right balance.
                        The &quot;PatchGAN&quot; discriminator classifies overlapping 70&times;70 pixel
                        patches as real or fake, focusing on high-frequency local texture rather than
                        global image structure.
                    </div>
                    <div className="ch-tl-impact">Impact: Established paired image-to-image translation as a general-purpose framework &mdash; one architecture demonstrated dozens of different vision tasks without task-specific engineering.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Unpaired Translation</div>
                    <div className="ch-tl-title">CycleGAN &mdash; Zhu, Park, Isola &amp; Efros</div>
                    <div className="ch-tl-body">
                        Jun-Yan Zhu, Taesung Park, Phillip Isola, and Alexei Efros published
                        "Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial
                        Networks." CycleGAN removed the requirement for paired training data &mdash;
                        the most significant practical limitation of Pix2Pix.
                        <br /><br />
                        Two generators are trained simultaneously: G_AB translates from domain A
                        to domain B; G_BA translates from domain B to domain A. The key innovation
                        is the <em>cycle consistency loss</em>: translating an image from A to B
                        and back should recover the original: G_BA(G_AB(x)) &asymp; x. This constraint
                        prevents mode collapse (generators cannot map all A images to the same B image,
                        because the inverse generator could not then recover the originals) and forces
                        the generators to preserve content while changing style.
                        <br /><br />
                        Famous examples: horse &harr; zebra, summer &harr; winter, Monet paintings
                        &harr; photographs, apple &harr; orange. These required only a collection of
                        each domain's images &mdash; no matched pairs. A photographer who had never
                        seen a Monet and an art historian who had never been to a meadow could
                        each contribute to the training set.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that controllable image translation could work without paired training data, dramatically expanding practical applicability to cases where paired data is expensive or impossible to collect.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Multi-Domain</div>
                    <div className="ch-tl-title">StarGAN &mdash; Choi et al.</div>
                    <div className="ch-tl-body">
                        Yunjey Choi, Minje Choi, Munyoung Kim, Jung-Woo Ha, Sunghun Kim, and Jaegul
                        Choo at Kakao Brain published StarGAN. The limitation of CycleGAN was
                        scalability: to translate between N domains, you needed N(N-1) generator-discriminator
                        pairs. StarGAN introduced a single generator and discriminator that handled all
                        domains simultaneously.
                        <br /><br />
                        A single generator G(x, c) takes an image x and a target domain label c (one-hot),
                        and produces a translated image. A single discriminator D both judges real/fake
                        and predicts the domain of real images (using an auxiliary classification head).
                        Domain labels are included as an additional input channel (for images) or
                        concatenated vector (for latent codes). StarGAN applied this to facial attribute
                        editing: one model could change hair colour, gender, age, and expression
                        independently using different domain labels.
                    </div>
                    <div className="ch-tl-impact">Impact: Scaled multi-domain image translation to N domains with a single model, eliminating the O(N&sup2;) model proliferation of pairwise approaches. This efficiency is now the standard in multi-attribute editing systems.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Semantic Synthesis</div>
                    <div className="ch-tl-title">SPADE / GauGAN &mdash; Park et al., NVIDIA</div>
                    <div className="ch-tl-body">
                        Taesung Park, Ming-Yu Liu, Ting-Chuan Wang, and Jun-Yan Zhu at NVIDIA Research
                        published SPADE (Spatially-Adaptive Normalisation) &mdash; the architecture
                        behind NVIDIA's GauGAN demo. The problem they addressed: when translating a
                        semantic segmentation map (labelled regions like &quot;sky,&quot; &quot;grass,&quot;
                        &quot;water&quot;) to a realistic photograph, standard batch normalisation
                        layers destroyed the semantic information because normalisation washed out
                        the activations corresponding to each region.
                        <br /><br />
                        SPADE computed the normalisation parameters (&gamma; and &beta; in standard
                        batch norm) from the segmentation map itself, separately for each semantic
                        region. Sky pixels got one set of normalisation parameters; grass pixels got
                        another; water pixels got a third. This allowed the generator to maintain
                        region-specific appearance statistics throughout the generation process.
                        <br /><br />
                        GauGAN allowed users to paint rough segmentation maps and immediately generate
                        photorealistic landscape photographs from them &mdash; changing a blue region
                        to &quot;sky&quot; or a green region to &quot;forest&quot; and seeing the
                        result instantaneously.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated real-time photorealistic synthesis from semantic layouts, establishing SPADE normalisation as a key technique for spatially-conditioned generation used in subsequent text-to-image systems.</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 &ndash; present</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">Text-Conditioning and the Diffusion Bridge</div>
                    <div className="ch-tl-body">
                        The principle of conditioning generation on arbitrary side information &mdash;
                        class labels, images, segmentation maps &mdash; translated directly to
                        text-to-image generation. CLIP (Radford et al., OpenAI, 2021) learned a joint
                        embedding space for text and images, enabling text strings to be used as
                        conditioning vectors in the same way that one-hot labels were used in the
                        original conditional GAN.
                        <br /><br />
                        DALL-E 2 (Ramesh et al., 2022) and Stable Diffusion (Rombach et al., 2022)
                        used diffusion models (not GANs) as their backbone, but both conditioned
                        the generation on CLIP text embeddings &mdash; implementing the conditional
                        GAN principle in a diffusion framework. The guidance mechanism
                        (classifier-free guidance: train the model both with and without the condition,
                        then interpolate between them at inference) is a direct descendant of
                        conditional GAN conditioning.
                    </div>
                    <div className="ch-tl-impact">Impact: The conditional generation framework from the 2014 cGAN paper, refined through Pix2Pix, CycleGAN, StarGAN, and SPADE, became the conceptual foundation of the text-to-image generation that powers DALL-E, Stable Diffusion, and Midjourney.</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Bridge to Chapter 12:</strong> Conditional GANs proved that generative
                models could be guided and controlled &mdash; conditioning on class labels,
                segmentation maps, or image domains. But training both GANs and VAEs exposed
                a persistent infrastructure problem: vanilla gradient descent was too slow and
                too unstable for large competing networks. The field had been developing better
                optimisers in parallel for years &mdash; Momentum since 1986, Adam since 2014
                &mdash; and Chapter 12 collects those tools into the training infrastructure
                that all deep learning now depends on.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>An artist who takes requests</h2>

            <Analogy label="The Directed Artist">
                A regular GAN is like an artist who wakes up every morning and draws something
                random &mdash; sometimes a cat, sometimes a mountain, sometimes a face. You have
                no control over what comes out.
                <br /><br />
                A conditional GAN is like an artist who responds to requests: &quot;Draw a cat.&quot;
                &quot;Draw the number 7.&quot; &quot;Draw a smiling woman with glasses.&quot; The artist
                uses the same imagination as before &mdash; but now the request shapes what they
                imagine.
                <br /><br />
                The trick: during training, the request (condition y) is fed to both the artist
                (generator) and the art critic (discriminator). The critic doesn't just ask
                &quot;is this painting good?&quot; &mdash; it asks &quot;is this a good painting
                <em> of what was requested</em>?&quot; That extra check forces the artist to
                actually follow the brief.
            </Analogy>

            <Analogy label="Pix2Pix: Sketch to Photo">
                You draw a rough sketch of a cat &mdash; two triangles for ears, circles for
                eyes, an oval for the head. You hand it to the Pix2Pix network.
                <br /><br />
                The network looks at your sketch and asks itself: &quot;what photograph would
                produce this sketch?&quot; It fills in realistic fur patterns, adds depth with
                shadows, gives the eyes a reflective sheen, and returns a convincing photograph
                of a cat that follows your sketch exactly.
                <br /><br />
                The magic: the network learned this skill by seeing thousands of (sketch,
                photograph) pairs during training &mdash; it learned to match the shapes in the
                sketch while adding all the realistic detail that sketches leave out.
                The U-Net architecture ensures every spatial detail of the sketch influences
                the corresponding region of the output.
            </Analogy>

            <Analogy label="CycleGAN: No Need for Pairs">
                Pix2Pix needed matched pairs: exactly this sketch &rarr; exactly this photo.
                CycleGAN dropped that requirement. To turn photos into Monet paintings, you
                just need: a pile of photos (any photos), and a pile of Monets (any Monets).
                No matching required.
                <br /><br />
                The trick: two translators are trained together. Translator A&rarr;B turns photos
                into Monet-style images. Translator B&rarr;A turns Monet-style back into photos.
                The rule: if you convert a photo to Monet and back again, you should get the
                original photo. This &quot;round trip&quot; rule forces the translators to actually
                translate the style &mdash; not just ignore the input and output random Monets.
                If they cheated (output a random Monet regardless of input), the return trip
                would produce a very different photo &mdash; violating the round-trip rule.
            </Analogy>

            <Analogy label="StarGAN: One Artist, Many Styles">
                CycleGAN needed a separate translator for every pair of styles: photo&rarr;Monet,
                photo&rarr;Van Gogh, photo&rarr;Cézanne, and back. With 10 styles, that's 90 translators.
                <br /><br />
                StarGAN trained one artist who could do all styles at once. You hand them a photo
                and a colour-coded tag: &quot;Monet tag&quot; means paint in Monet style. &quot;Van Gogh tag&quot;
                means paint in Van Gogh style. The same artist, the same brain &mdash; but a
                different tag changes everything they produce.
                <br /><br />
                For faces, this meant one StarGAN could change hair colour, add or remove glasses,
                change gender expression, and adjust apparent age &mdash; all from a single model,
                just by changing which condition tag you attach.
            </Analogy>

            <Analogy label="GauGAN: Paint with Labels, Not Colours">
                NVIDIA's GauGAN (powered by SPADE) works like painting with category labels instead
                of colours. Instead of picking &quot;blue&quot; and painting, you pick &quot;sky&quot; and paint.
                Instead of picking &quot;green,&quot; you pick &quot;grass.&quot;
                <br /><br />
                The network understands what sky looks like (blue gradients, wispy clouds, maybe a
                sun). It understands what grass looks like (green, textured, slight variation). When
                you paint a region as &quot;sky,&quot; it generates photorealistic sky textures there.
                When you paint &quot;mountain,&quot; it generates rocky slopes and snow.
                <br /><br />
                The technical secret: SPADE lets each semantic region (sky, grass, water) have its
                own private way of adjusting the image &mdash; sky regions are normalised differently
                from grass regions from water regions. The generator stays informed about which
                region it's working in at every layer, not just at the start.
            </Analogy>

            <Analogy label="What comes next &mdash; The better learning engine">
                Even the best generative model is only as good as its training algorithm. Training
                a GAN means running two competing networks simultaneously &mdash; and vanilla
                gradient descent makes that unstable and slow. Chapter 12 shows how the field
                built smarter optimisers &mdash; Momentum, Adam, and Batch Normalisation &mdash;
                that make training faster, more stable, and capable of going much deeper.
            </Analogy>

            <div className="ch-callout">
                <strong>From cGAN to ChatGPT images:</strong> When you type a description into
                an image generator and it produces exactly what you described, that's conditional
                generation &mdash; the same principle as the 2014 cGAN paper. The condition is
                now a text embedding instead of a one-hot class label, and the generator is now
                a diffusion model instead of a GAN, but the core idea is identical: condition y
                steers the generation.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Conditioning, paired translation, and cycle consistency</h2>

            <h3>Conditional GAN Objective</h3>
            <p>
                Extend the GAN objective by conditioning both G and D on side information y:
            </p>
            <MathBlock tex="\min_G \max_D \; V(D, G) = \mathbb{E}_{x,y}[\log D(x \mid y)] + \mathbb{E}_{z,y}[\log(1 - D(G(z \mid y) \mid y))]" />
            <p>
                The conditioning variable y can be: a class label (one-hot vector), an image,
                text embeddings, or any structured side information. It is typically concatenated
                to the input of both networks (channel-wise for images, vector-wise for latents).
                The discriminator now rewards the generator for producing something that looks
                real <em>and</em> matches the condition.
            </p>

            <h3>Pix2Pix: Paired Image Translation</h3>
            <p>
                For paired translation, the condition y is the source image. The full Pix2Pix
                loss combines adversarial and L1 terms:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{Pix2Pix}} = \mathcal{L}_{\text{cGAN}}(G, D) + \lambda \cdot \mathcal{L}_{L1}(G)" />
            <MathBlock tex="\mathcal{L}_{L1}(G) = \mathbb{E}_{x,y,z}\bigl[\|y - G(x, z)\|_1\bigr]" />
            <p>
                Why L1 rather than L2? L2 loss minimises mean-squared error, which produces
                blurry outputs (the optimal prediction under L2 with uncertain outputs is the mean).
                L1 loss produces slightly sharper predictions and is more robust to outliers,
                while remaining convex and easy to optimise.
            </p>

            <h3>PatchGAN Discriminator</h3>
            <p>
                Rather than classifying the full image as real/fake, PatchGAN classifies N&times;N
                patches. The output is an H&times;W grid of real/fake scores (not a single scalar).
                Each score covers a 70&times;70 pixel receptive field. Advantages:
            </p>
            <ul>
                <li>Fewer parameters than a full-image discriminator</li>
                <li>Focuses on local texture fidelity rather than global layout</li>
                <li>Can be applied to images of arbitrary resolution at test time</li>
                <li>Generates stronger gradients for local texture details</li>
            </ul>

            <h3>CycleGAN: Cycle Consistency Loss</h3>
            <p>
                For unpaired translation between domains A and B, define two generators:
                G_AB: A &rarr; B and G_BA: B &rarr; A. The cycle consistency constraint is:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{cyc}}(G_{AB}, G_{BA}) = \mathbb{E}_{x \sim A}\bigl[\|G_{BA}(G_{AB}(x)) - x\|_1\bigr] + \mathbb{E}_{y \sim B}\bigl[\|G_{AB}(G_{BA}(y)) - y\|_1\bigr]" />
            <p>
                The full CycleGAN objective:
            </p>
            <MathBlock tex="\mathcal{L} = \mathcal{L}_{\text{GAN}}(G_{AB}, D_B) + \mathcal{L}_{\text{GAN}}(G_{BA}, D_A) + \lambda \cdot \mathcal{L}_{\text{cyc}}(G_{AB}, G_{BA})" />
            <p>
                with &lambda; = 10. Two discriminators (D_A, D_B) are trained alongside the
                two generators. The cycle consistency prevents mode collapse by requiring
                that translations be invertible.
            </p>

            <h3>SPADE: Spatially-Adaptive Normalisation</h3>
            <p>
                Standard batch normalisation in a conditional generator normalises all spatial
                positions equally, washing out semantic regional differences. SPADE computes
                separate normalisation parameters for each semantic region:
            </p>
            <MathBlock tex="\text{SPADE}(h_{n,c,y,x}, s) = \gamma_{c,y,x}(s) \cdot \frac{h_{n,c,y,x} - \mu_c}{\sigma_c} + \beta_{c,y,x}(s)" />
            <p>
                where &gamma; and &beta; are spatially-varying scale and shift computed from the
                segmentation map s via small convolution networks. Each semantic class (sky, grass,
                water) gets its own &gamma; and &beta;, allowing the generator to maintain distinct
                appearance statistics for each region throughout the generation process.
            </p>

            <div className="ch-callout">
                <strong>Identity loss:</strong> CycleGAN also adds an optional identity loss
                ||G_AB(y) &minus; y||_1 for y in domain B, ensuring the generator does not
                unnecessarily change inputs already in the target domain. For colour-critical
                applications (photo&harr;painting), without identity loss the generator may
                shift colour distributions even for images that are already paintings.
            </div>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Conditioning theory &middot; cycle consistency derivation &middot; PatchGAN receptive field</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch conditional generator &middot; Pix2Pix U-Net &middot; PatchGAN loss</span>
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
            <h2>Conditioning mechanisms, PatchGAN theory, and cycle consistency</h2>

            <DefBlock label="Conditional GAN (cGAN) Factorisation">
                A cGAN models the conditional distribution p(x|y). The generator defines an
                implicit distribution p_G(x|y) by sampling z ~ p(z) and computing G(z, y).
                The optimal discriminator for fixed G is:
                <br /><br />
                D*(x, y) = p_data(x|y) / (p_data(x|y) + p_G(x|y))
                <br /><br />
                At equilibrium, p_G(x|y) = p_data(x|y) for all y. The cGAN converges to the
                correct conditional distribution independently for each value of y.
            </DefBlock>

            <h3>Why Conditioning Helps Training Stability</h3>
            <p>
                In an unconditional GAN on a multi-class dataset, p_data is a mixture of
                many modes. The generator may collapse to generating one mode. With class
                conditioning, the generator is only required to model each class separately
                &mdash; a much simpler distribution. The discriminator's task is also easier
                (it knows which class to expect). Mode collapse within a class is still
                possible but much less severe.
            </p>

            <h3>PatchGAN Receptive Field</h3>
            <p>
                For an N-layer convolutional discriminator with kernel size k and stride s,
                the receptive field grows as:
            </p>
            <MathBlock tex="\text{RF}_n = \text{RF}_{n-1} + (k-1) \cdot \prod_{i=1}^{n-1} s_i" />
            <p>
                Isola et al. found that a 70&times;70 receptive field (achieved with 4 layers,
                k=4, s=2) gave the best balance between capturing enough texture context and
                remaining computationally tractable. The output is a feature map of size
                approximately (H/16)&times;(W/16), each cell scoring a 70&times;70 patch of
                the original image pair.
            </p>

            <h3>Cycle Consistency as a Bijection Constraint</h3>
            <p>
                CycleGAN's cycle consistency enforces that G_AB and G_BA are (approximately)
                inverse functions. Without this, the generators can learn any mapping
                f: A &rarr; B that fools D_B, ignoring the structure of A. The cycle loss
                constrains the mapping to be content-preserving: it must be possible to recover
                x from G_AB(x).
            </p>
            <MathBlock tex="\mathcal{L}_{\text{cyc}} = \mathbb{E}_x[\|G_{BA}(G_{AB}(x)) - x\|_1] + \mathbb{E}_y[\|G_{AB}(G_{BA}(y)) - y\|_1]" />
            <p>
                This is a sufficient (though not necessary) condition for bijectivity. In
                practice it prevents one-to-many mappings (where all inputs collapse to one
                output) because the inverse generator could not then recover the original.
            </p>

            <h3>Identity Mapping Regularisation</h3>
            <MathBlock tex="\mathcal{L}_{\text{id}} = \mathbb{E}_{y \sim B}[\|G_{AB}(y) - y\|_1] + \mathbb{E}_{x \sim A}[\|G_{BA}(x) - x\|_1]" />
            <p>
                Without identity loss, the generators may shift the colour distribution even
                for inputs already in the target domain. The identity loss acts as a regulariser
                that encourages G_AB to be the identity function on B.
            </p>

            <div className="ch-callout">
                <strong>Limitations:</strong> Cycle consistency does not guarantee a unique
                or faithful mapping. The generators may learn to hide information in imperceptible
                steganographic noise that survives the cycle &mdash; the &quot;hidden information&quot;
                problem studied by Chu et al. (2017). This motivates stronger constraints in
                follow-up work like CUT (Contrastive Unpaired Translation, 2020), which uses
                contrastive learning to enforce patch-level correspondence without requiring
                explicit cycle reconstruction.
            </div>
        </>
    )
}

const CGAN_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Pix2Pix U-Net Generator ────────────────────────────────────────────────────
# Encoder-decoder with skip connections for image-to-image translation.
# Condition: source image (concatenated as input channel).
class UNetBlock(nn.Module):
    """Single U-Net block: Conv -> BN -> activation."""
    def __init__(self, in_ch, out_ch, down=True, bn=True, dropout=False, skip_ch=0):
        super().__init__()
        in_channels = in_ch + skip_ch
        if down:
            conv = nn.Conv2d(in_channels, out_ch, 4, 2, 1, bias=False)
            act  = nn.LeakyReLU(0.2, inplace=True)
        else:
            conv = nn.ConvTranspose2d(in_channels, out_ch, 4, 2, 1, bias=False)
            act  = nn.ReLU(inplace=True)
        layers = [conv]
        if bn:
            layers.append(nn.BatchNorm2d(out_ch))
        if dropout:
            layers.append(nn.Dropout(0.5))
        layers.append(act)
        self.block = nn.Sequential(*layers)

    def forward(self, x):
        return self.block(x)

class Pix2PixGenerator(nn.Module):
    """
    U-Net for 256x256 images.
    Encoder: 256->128->64->32->16->8->4->2->1
    Decoder: 1->2->4->8->16->32->64->128->256
    Skip connections carry encoder features to each decoder stage.
    """
    def __init__(self, in_ch=3, out_ch=3, ngf=64):
        super().__init__()
        # Encoder (downsampling)
        self.e1 = nn.Conv2d(in_ch, ngf,    4, 2, 1, bias=False)    # 128
        self.e2 = UNetBlock(ngf,    ngf*2,  down=True,  bn=True)    # 64
        self.e3 = UNetBlock(ngf*2,  ngf*4,  down=True,  bn=True)    # 32
        self.e4 = UNetBlock(ngf*4,  ngf*8,  down=True,  bn=True)    # 16
        self.e5 = UNetBlock(ngf*8,  ngf*8,  down=True,  bn=True)    # 8
        self.e6 = UNetBlock(ngf*8,  ngf*8,  down=True,  bn=True)    # 4
        self.e7 = UNetBlock(ngf*8,  ngf*8,  down=True,  bn=True)    # 2
        self.e8 = nn.Sequential(                                     # 1 (bottleneck)
            nn.Conv2d(ngf*8, ngf*8, 4, 2, 1, bias=False), nn.ReLU())

        # Decoder (upsampling with skip connections)
        self.d1 = UNetBlock(ngf*8,  ngf*8, down=False, bn=True,  dropout=True, skip_ch=0)
        self.d2 = UNetBlock(ngf*8,  ngf*8, down=False, bn=True,  dropout=True, skip_ch=ngf*8)
        self.d3 = UNetBlock(ngf*8,  ngf*8, down=False, bn=True,  dropout=True, skip_ch=ngf*8)
        self.d4 = UNetBlock(ngf*8,  ngf*8, down=False, bn=True,               skip_ch=ngf*8)
        self.d5 = UNetBlock(ngf*8,  ngf*4, down=False, bn=True,               skip_ch=ngf*8)
        self.d6 = UNetBlock(ngf*4,  ngf*2, down=False, bn=True,               skip_ch=ngf*4)
        self.d7 = UNetBlock(ngf*2,  ngf,   down=False, bn=True,               skip_ch=ngf*2)
        self.d8 = nn.Sequential(
            nn.ConvTranspose2d(ngf*2, out_ch, 4, 2, 1),
            nn.Tanh()   # pixel values in [-1, 1]
        )

    def forward(self, x):
        # Encode
        e1 = self.e1(x)
        e2 = self.e2(e1);  e3 = self.e3(e2);  e4 = self.e4(e3)
        e5 = self.e5(e4);  e6 = self.e6(e5);  e7 = self.e7(e6)
        e8 = self.e8(e7)
        # Decode with skip connections (concatenate matching encoder features)
        d1 = self.d1(e8)
        d2 = self.d2(torch.cat([d1, e7], 1))
        d3 = self.d3(torch.cat([d2, e6], 1))
        d4 = self.d4(torch.cat([d3, e5], 1))
        d5 = self.d5(torch.cat([d4, e4], 1))
        d6 = self.d6(torch.cat([d5, e3], 1))
        d7 = self.d7(torch.cat([d6, e2], 1))
        return self.d8(torch.cat([d7, e1], 1))

# ── PatchGAN Discriminator ─────────────────────────────────────────────────────
# Classifies 70x70 patches. Input: (real_A, real_B) or (real_A, fake_B) concatenated.
class PatchDiscriminator(nn.Module):
    def __init__(self, in_ch=6, ndf=64):  # in_ch = source + target channels
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch,    ndf,   4, 2, 1, bias=False), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(ndf,      ndf*2, 4, 2, 1, bias=False), nn.BatchNorm2d(ndf*2), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(ndf*2,    ndf*4, 4, 2, 1, bias=False), nn.BatchNorm2d(ndf*4), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(ndf*4,    ndf*8, 4, 1, 1, bias=False), nn.BatchNorm2d(ndf*8), nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(ndf*8,    1,     4, 1, 1, bias=False),   # output: patch-wise scores
        )

    def forward(self, x):
        return self.net(x)  # shape: (batch, 1, H', W') -- one score per patch

# ── Pix2Pix Combined Loss ──────────────────────────────────────────────────────
def pix2pix_losses(D, G, real_A, real_B, lambda_l1=100.0):
    bce = nn.BCEWithLogitsLoss()
    fake_B = G(real_A)

    # Discriminator: real pair vs. fake pair
    pred_real = D(torch.cat([real_A, real_B], 1))
    pred_fake = D(torch.cat([real_A, fake_B.detach()], 1))
    loss_D = (bce(pred_real, torch.ones_like(pred_real)) +
              bce(pred_fake, torch.zeros_like(pred_fake))) * 0.5

    # Generator: cGAN loss + L1 pixel loss
    pred_g    = D(torch.cat([real_A, fake_B], 1))
    loss_G    = bce(pred_g, torch.ones_like(pred_g)) + lambda_l1 * F.l1_loss(fake_B, real_B)

    return loss_D, loss_G

# ── Test forward pass ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    device = torch.device('cpu')
    G = Pix2PixGenerator(in_ch=3, out_ch=3).to(device)
    D = PatchDiscriminator(in_ch=6).to(device)

    src  = torch.randn(1, 3, 256, 256)  # source image (e.g. edge map)
    tgt  = torch.randn(1, 3, 256, 256)  # target image (e.g. photo)
    out  = G(src)

    print(f"Generator params:     {sum(p.numel() for p in G.parameters()):,}")
    print(f"Discriminator params: {sum(p.numel() for p in D.parameters()):,}")
    print(f"Input:  {src.shape}")          # (1, 3, 256, 256)
    print(f"Output: {out.shape}")           # (1, 3, 256, 256)

    patch_score = D(torch.cat([src, out], 1))
    print(f"PatchGAN output: {patch_score.shape}")  # (1, 1, 30, 30) -- 30x30 patches`

function PythonContent() {
    return (
        <>
            <p>
                A Pix2Pix implementation with U-Net generator and PatchGAN discriminator. The
                generator uses skip connections at every resolution scale to preserve spatial
                detail from the source image. The discriminator takes concatenated (source, output)
                pairs and classifies each 70&times;70 patch as real or fake &mdash; focusing on
                local texture fidelity rather than global coherence.
            </p>
            <CodeBlock code={CGAN_CODE} filename="pix2pix.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>The conditioning mechanism:</strong> In Pix2Pix, the condition is the source
                image, concatenated as input to G. The discriminator receives both source and output
                concatenated &mdash; this is what makes it &quot;conditional:&quot; D learns to
                judge whether the output is a plausible translation of that specific input,
                not just whether it looks realistic in isolation.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CONDITIONAL_GANS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
