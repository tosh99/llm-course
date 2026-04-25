import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    label: string
    title: string
    body: React.ReactNode
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-section-label">{item.label}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-body">{item.body}</div>
            <div className="ch-tl-impact">{item.impact}</div>
        </div>
    )
}

// ── HistoryTab ────────────────────────────────────────────────────────────────

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "June 2017 — Attention is All You Need",
            label: "Context",
            title: "Vaswani et al. invent the Transformer for NLP",
            body: (
                <>
                    When Vaswani et al. published &ldquo;Attention is All You Need&rdquo; in June
                    2017, the motivation was entirely text. Self-attention replaced recurrence in
                    sequence-to-sequence translation models, and the result was faster training,
                    better long-range dependency modeling, and state-of-the-art BLEU scores on
                    WMT English&ndash;German and English&ndash;French. Nobody in the paper
                    mentioned images. The Transformer was a text architecture, designed for text
                    problems, evaluated exclusively on text benchmarks.
                    <br /><br />
                    The reason vision was not considered is straightforward: a 224&times;224
                    color image contains 50,176 pixels. If you try to apply full self-attention
                    to every pixel, the attention matrix is 50,176&times;50,176 &mdash; roughly
                    2.5 billion entries. That is computationally intractable for any hardware
                    available in 2017. CNNs, by contrast, restrict each computation to a small
                    local neighborhood (a 3&times;3 or 5&times;5 kernel), keeping complexity
                    linear in image size. The dominant view of 2017: Transformers are for
                    sequences of words; CNNs are for grids of pixels.
                </>
            ),
            impact:
                "The Transformer's self-attention mechanism was the seed from which ViT would grow three years later, but in 2017 the vision community barely noticed.",
        },
        {
            year: "2018–2019 — Hybrid Attempts",
            label: "Problem",
            title: "Researchers try adding attention to CNNs &mdash; with limited success",
            body: (
                <>
                    As BERT and GPT demonstrated the power of pure attention in NLP, vision
                    researchers began asking whether attention could augment CNN architectures.
                    Wang et al. (2018) introduced Non-Local Means for video, adding a single
                    self-attention layer on top of a ResNet. Ramachandran et al. (2019) replaced
                    convolutions with local self-attention in a restricted neighborhood. Ho et al.
                    (2019) and Huang et al. (2019) explored axial attention and music generation
                    with Transformers. Sparse Transformer (Child et al., 2019) made attention more
                    tractable by attending to only a structured subset of positions.
                    <br /><br />
                    None of these approaches produced a pure-Transformer image model. The
                    fundamental constraint was O(n&sup2;) attention over pixel positions &mdash;
                    even with sparsity, the engineering cost was high and the benchmark gains
                    over strong CNN baselines were modest. The consensus in the vision community
                    remained: attention is a useful add-on to CNNs, not a replacement. EfficientNet
                    (Tan &amp; Le, 2019) set the state of the art on ImageNet using a carefully
                    scaled convolutional architecture with no attention at all.
                </>
            ),
            impact:
                "Hybrid approaches showed attention could help vision models at the margins, but did not challenge the fundamental CNN dominance &mdash; that required a different framing entirely.",
        },
        {
            year: "2019 — Image Transformer &amp; Sparse Transformers",
            label: "Precursor",
            title: "Parmar et al. and Child et al. apply attention to image generation",
            body: (
                <>
                    Two papers in 2019 pushed the envelope but stopped short of the ViT insight.
                    Parmar et al.&apos;s Image Transformer applied local self-attention to image
                    generation as a pixel-by-pixel autoregressive model &mdash; predicting the
                    next pixel given all previous ones. It produced sharp samples but was
                    extraordinarily slow: generating a single 256&times;256 image required
                    millions of attention operations. It was a proof of concept for the
                    expressiveness of attention in vision, but wildly impractical for
                    classification at scale.
                    <br /><br />
                    OpenAI&apos;s Sparse Transformer (Child et al., 2019) introduced factored
                    sparse attention patterns that reduced the cost from O(n&sup2;) to
                    O(n&radic;n), making it feasible to apply attention to 64&times;64 images
                    and long text sequences alike. It also showed impressive density estimation
                    results on CIFAR-10. But sparse attention was complex to implement, and the
                    results on standard image classification benchmarks still lagged behind
                    EfficientNet. The community noted both papers with interest and moved on.
                </>
            ),
            impact:
                "These papers proved attention could work in the visual domain if the computational cost was managed &mdash; the missing ingredient was the patch-as-token insight that would make standard Transformers directly applicable.",
        },
        {
            year: "October 2020 — An Image is Worth 16&times;16 Words",
            label: "Breakthrough",
            title: "Dosovitskiy et al. (Google Brain) publish the ViT paper",
            body: (
                <>
                    In October 2020, Dosovitskiy, Beyer, Kolesnikov, Weissenborn, Zhai,
                    Unterthiner, Dehghani, Minderer, Heigold, Gelly, Uszkoreit, and Houlsby at
                    Google Brain posted &ldquo;An Image is Worth 16x16 Words: Transformers for
                    Image Recognition at Scale.&rdquo; The key insight was elegantly simple:
                    instead of applying attention to individual pixels, split the image into
                    fixed-size non-overlapping patches and treat each patch as a token. A
                    224&times;224 image divided into 16&times;16 patches produces exactly
                    196 patch tokens &mdash; a sequence length manageable by a standard
                    Transformer encoder.
                    <br /><br />
                    Each 16&times;16&times;3 patch (768 raw values) is linearly projected to a
                    D-dimensional embedding. A learnable [CLS] token is prepended &mdash;
                    identical in spirit to BERT&apos;s [CLS]. Learnable 1D positional embeddings
                    are added. The full sequence of 197 tokens is fed to a standard Transformer
                    encoder with multi-head self-attention, layer normalization, and MLP blocks.
                    The [CLS] token&apos;s final hidden state is passed to a classification head.
                    No convolutions anywhere. The architecture is the same Transformer encoder
                    BERT uses for text, applied verbatim to image patches.
                    <br /><br />
                    Trained on ImageNet-1k (1.2M images) alone, ViT-Large underperformed
                    ResNet-based models &mdash; confirming the concern that Transformers lack
                    the inductive biases CNNs provide. But trained on JFT-300M (Google&apos;s
                    internal dataset of 300 million labeled images), ViT-Large achieved 88.55%
                    top-1 accuracy on ImageNet, matching or surpassing the best CNN results
                    for the first time. The conclusion: given sufficient data, a pure Transformer
                    can match a CNN for image classification.
                </>
            ),
            impact:
                "The ViT paper demonstrated that CNNs&apos; architectural inductive biases are not fundamental requirements for vision &mdash; they are shortcuts that become unnecessary at sufficient data scale.",
        },
        {
            year: "2021 — DeiT, DINO, and BEiT",
            label: "Ecosystem",
            title: "The ViT ecosystem surpasses CNNs even on small datasets",
            body: (
                <>
                    The original ViT&apos;s dependence on 300M training images was a serious
                    practical limitation &mdash; few organizations have JFT-300M. Three 2021
                    papers dismantled this constraint from different directions.
                    <br /><br />
                    Touvron et al.&apos;s DeiT (Data-efficient Image Transformers, Facebook AI)
                    trained ViT on ImageNet-1k alone using knowledge distillation from a CNN
                    teacher (RegNet). The distillation token &mdash; an additional learnable
                    token trained to match the teacher&apos;s softmax output &mdash; gave the
                    ViT richer supervision than one-hot labels alone. DeiT-Base achieved 81.8%
                    top-1 on ImageNet, competitive with EfficientNet-B4, trained in 3 days on
                    8 GPUs. The JFT-300M bottleneck was broken.
                    <br /><br />
                    DINO (Caron et al., Facebook AI) applied self-supervised learning to ViT
                    using a self-distillation objective: a student network is trained to match
                    the output of an exponential moving average &ldquo;teacher&rdquo; network.
                    The result was surprising: visualizing the [CLS] token&apos;s attention maps
                    revealed that ViT naturally learned to segment objects &mdash; the attention
                    concentrated on foreground objects with remarkable precision, without any
                    segmentation supervision whatsoever. BEiT (Bao et al., Microsoft) adapted
                    BERT-style masked image patch prediction, masking random patches and training
                    the model to reconstruct discrete visual tokens predicted by a DALL-E tokenizer.
                </>
            ),
            impact:
                "By the end of 2021, ViT had surpassed CNNs on ImageNet with only 1.2M training images and without convolutions, making it the new default starting point for vision research.",
        },
        {
            year: "2021 — Swin Transformer",
            label: "Refinement",
            title: "Liu et al. (Microsoft) introduce hierarchical shifted-window attention",
            body: (
                <>
                    Pure ViT has a flat architecture: every layer computes attention over all
                    197 tokens at the same spatial resolution. This is fine for image
                    classification but problematic for dense prediction tasks like object
                    detection and semantic segmentation, which require multi-scale feature maps
                    (a property CNNs naturally provide through pooling). Additionally, for
                    higher-resolution images, the number of patches grows quadratically and
                    full attention becomes expensive again.
                    <br /><br />
                    Liu et al.&apos;s Swin Transformer (Shifted WINdow) addressed both issues.
                    It divides the image into non-overlapping windows and computes self-attention
                    within each window (linear complexity in image size). Shifted windows in
                    alternating layers allow information to flow across window boundaries,
                    restoring global context without full O(n&sup2;) attention. A hierarchical
                    patch merging operation progressively reduces spatial resolution while
                    doubling channel dimensions &mdash; exactly the feature pyramid structure
                    CNNs produce. Swin-Large won COCO object detection and ADE20K semantic
                    segmentation benchmarks in 2021, outperforming all prior CNN and
                    Transformer methods.
                </>
            ),
            impact:
                "Swin proved that Transformer-based vision backbones could match and exceed CNNs on dense prediction tasks, completing ViT&apos;s conquest of the vision benchmark landscape.",
        },
        {
            year: "2022–2024 — ViT Becomes the Foundation Model Backbone",
            label: "Impact",
            title: "MAE, CLIP, Stable Diffusion, GPT-4V &mdash; ViT is everywhere",
            body: (
                <>
                    He et al.&apos;s Masked Autoencoders (MAE, 2022) showed that masking 75%
                    of image patches and training a ViT encoder to reconstruct the missing
                    patches (via a lightweight decoder) is a highly effective self-supervised
                    pretraining strategy. MAE pretraining of ViT-Huge followed by fine-tuning
                    on ImageNet achieved 87.8% top-1 &mdash; better than any prior supervised
                    approach. The 75% masking rate was surprisingly high: unlike NLP where
                    15% masking is standard, images have enormous spatial redundancy, and
                    aggressive masking forces the model to reason about global structure.
                    <br /><br />
                    ViT became the vision encoder of choice for multimodal foundation models.
                    CLIP (Radford et al., OpenAI, 2021) trained a ViT image encoder and a
                    Transformer text encoder jointly with a contrastive objective on 400M
                    image&ndash;text pairs. DALL-E 2, Stable Diffusion, Imagen, and Parti all
                    use ViT-based image encoders or operate in latent spaces learned by ViTs.
                    GPT-4V (OpenAI, 2023) and Gemini (Google, 2023) process images through ViT
                    encoders before the language model. The ViT architecture, introduced in a
                    2020 preprint, became the universal vision encoder for multimodal AI within
                    three years of publication.
                </>
            ),
            impact:
                "The 2020 ViT paper reshaped the entire vision field: from 2022 onward, large vision models are almost universally built on the Transformer architecture rather than CNNs.",
        },
    ]

    return (
        <>
            <p className="ch-story-intro">
                Chapter 20 showed that the Transformer architecture could handle any text sequence
                &mdash; GPT-2 generated fluent prose and code from a pure decoder, while T5
                demonstrated that an encoder-decoder Transformer could unify every NLP task under
                a single text-to-text interface. By 2019, Transformers had completely displaced
                recurrent networks for language. The natural next question, asked quietly in
                corridors and loudly in arxiv preprints: could the same architecture handle
                images? CNNs had reigned over computer vision for a decade, since AlexNet won
                ImageNet in 2012. They had inductive biases &mdash; locality, translation
                equivariance &mdash; purpose-built for 2D spatial data. Applying a Transformer
                to an image seemed to require either accepting O(n&sup2;) complexity over
                millions of pixels, or rethinking what an &ldquo;image token&rdquo; even is.
                The Vision Transformer resolved both problems with a single elegant idea.
            </p>
            <div className="ch-timeline">
                {items.map((item) => (
                    <TlItem key={item.year} item={item} />
                ))}
            </div>
            <div className="ch-callout">
                <strong>The ViT legacy:</strong> The 2020 paper &ldquo;An Image is Worth 16x16
                Words&rdquo; did not just improve image classification accuracy &mdash; it
                unified the architecture of NLP and vision under a single framework. By 2023,
                the same Transformer encoder that BERT uses for text is the vision backbone
                inside CLIP, GPT-4V, Gemini, and Stable Diffusion. The architectural monoculture
                that once privileged CNNs for vision and RNNs for text gave way to a single
                universal architecture that processes any modality as a sequence of learned
                token embeddings.
            </div>
        </>
    )
}

// ── KidTab ────────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                In Chapter 20, we saw how GPT-2 and T5 learned to read and write by treating
                words as tokens &mdash; little numbered pieces &mdash; and passing them through
                a Transformer that lets every word pay attention to every other word. Those
                models were incredibly powerful at understanding and generating text. But what
                about pictures? For ten years, computers used a completely different kind of
                brain for images &mdash; called a CNN &mdash; that worked totally differently
                from the Transformer. In 2020, a team at Google asked: what if we just
                &hellip; used the exact same Transformer for pictures too?
            </p>

            <Analogy label="The Puzzle Piece Trick">
                Here is the key idea behind Vision Transformers. Imagine you have a photograph
                of a dog. Instead of looking at it all at once, you cut it up into a grid of
                equal-sized square tiles &mdash; say, 14 columns and 14 rows, giving you
                196 little squares. Each square is about the size of a postage stamp cut out
                of the photo.
                <br /><br />
                Now you number the tiles: tile 1, tile 2, tile 3 &hellip; all the way to 196.
                You squish each tile into a list of numbers (its colors, flattened out), and
                you pass that list of 196 number-bundles into the exact same Transformer
                that reads sentences. The Transformer doesn&apos;t know these are image pieces;
                as far as it&apos;s concerned, it&apos;s just reading a sentence that happens
                to be 196 &ldquo;words&rdquo; long. The tiles are image words.
                <br /><br />
                This is the whole trick. The researchers didn&apos;t invent a new kind of
                AI brain for images. They just chopped the image into tiles and fed the
                tiles to the old Transformer brain. It worked surprisingly well &mdash;
                eventually better than anything before it.
            </Analogy>

            <Analogy label="Why CNNs See Like a Magnifying Glass">
                Before the Vision Transformer, computers looked at images using a CNN
                (Convolutional Neural Network). Imagine the CNN is holding a tiny magnifying
                glass. It places the glass over one small corner of the image, records what
                it sees, then moves it one step to the right. It slowly scans across the
                whole image, one little window at a time, building up an understanding of
                the picture piece by piece.
                <br /><br />
                This magnifying-glass approach is great for spotting edges, textures, and
                small shapes. But to understand that the floppy ear in the top-left corner
                belongs to the same dog as the wagging tail in the bottom-right corner, the
                CNN has to build up that connection through many, many layers. It can&apos;t
                just directly compare the ear tile with the tail tile from the very start.
                <br /><br />
                The Vision Transformer skips the magnifying glass entirely. From the very
                first layer, every tile can &ldquo;look at&rdquo; every other tile directly.
                Tile 3 (the ear) can immediately check tile 189 (the tail) and say: &ldquo;hey,
                we match &mdash; we&apos;re probably part of the same dog.&rdquo; This
                whole-image-at-once view is the Transformer&apos;s superpower.
            </Analogy>

            <Analogy label="The Class Detective">
                Here is something clever the ViT researchers borrowed from BERT: a special
                extra tile called the [CLS] token (short for &ldquo;class&rdquo; token).
                Unlike the 196 image tiles, this one doesn&apos;t come from the image at
                all. It&apos;s added at the very front of the sequence, like a detective
                who walks into a room full of witnesses.
                <br /><br />
                The Transformer runs its attention mechanism over all 197 tokens (196 tiles
                plus 1 detective). The detective tile gets to question every single image
                tile: &ldquo;What did you see? What color were you? Were there any edges
                nearby?&rdquo; After all the layers of attention are done, the detective
                tile has absorbed information from the entire image. Then it delivers its
                verdict: &ldquo;This is a golden retriever.&rdquo; That verdict is the
                model&apos;s classification answer.
                <br /><br />
                The detective tile starts out knowing nothing &mdash; it is just a random
                vector at the beginning of training. But through millions of training examples,
                it learns exactly what questions to ask and what answers to listen for.
            </Analogy>

            <Analogy label="Why You Need a Giant Textbook to Learn Without Rules">
                CNNs have rules built in. One big rule is: nearby pixels matter more than
                far-away pixels. Another rule is: if a pattern (like an edge) works in one
                spot, it probably works everywhere else in the image too. These built-in
                rules let CNNs learn quickly from a relatively small number of pictures,
                because they don&apos;t have to figure out those rules from scratch.
                <br /><br />
                The Vision Transformer has none of these built-in rules. Every tile can
                talk to every other tile equally, which is more flexible &mdash; but
                it means the model has to learn from experience that nearby tiles are
                usually more related than distant tiles, and that patterns repeat across
                the image. Learning those facts from scratch requires seeing a lot more
                examples.
                <br /><br />
                That&apos;s why the original ViT needed to train on 300 million labeled
                images (Google&apos;s private JFT-300M dataset) to beat CNNs. On the
                standard 1.2-million-image ImageNet dataset that everyone uses, ViT
                actually did worse than a good CNN. It needed a much bigger textbook
                because it had no shortcuts built in.
            </Analogy>

            <Analogy label="DeiT&apos;s Clever Teacher">
                Having to use 300 million images was a problem &mdash; most researchers
                don&apos;t have access to Google&apos;s private data. In 2021, researchers
                at Facebook figured out a way around it using a &ldquo;knowledge
                distillation&rdquo; trick: instead of just giving the ViT the right answer
                (e.g., &ldquo;this is a cat&rdquo;), they also gave it a teacher.
                <br /><br />
                The teacher was a well-trained CNN that had already mastered ImageNet.
                For each image, the teacher didn&apos;t just say &ldquo;cat&rdquo; &mdash;
                it gave its full probability distribution: &ldquo;I&apos;m 87% sure this
                is a cat, 9% sure it&apos;s a lynx, 3% sure it&apos;s a bobcat&hellip;&rdquo;
                This richer feedback &mdash; not just the right answer, but how confident
                the teacher was about every possible wrong answer &mdash; gave the ViT
                student much more information per image.
                <br /><br />
                The result was DeiT (Data-efficient Image Transformers). Trained on just
                1.2 million images with the teacher&apos;s help, DeiT matched CNN
                performance. The 300-million-image bottleneck was cracked open. Now
                any research lab could train a competitive ViT.
            </Analogy>

            <Analogy label="The Attention Map Superpower">
                One of the most magical discoveries from ViT research came from a technique
                called DINO (2021). Researchers trained a ViT without any labels at all
                &mdash; no one told it &ldquo;this is a dog&rdquo; or &ldquo;this is a
                car.&rdquo; The model just learned by predicting its own outputs in a
                clever self-supervised way.
                <br /><br />
                When they finished training, they visualized which image tiles the
                detective [CLS] token was paying the most attention to. And something
                surprising appeared: the attention maps drew almost perfect outlines around
                the main objects in the images. Show it a picture of a dog, and the high-
                attention tiles form a dog-shaped blob. Show it a horse, and you get
                a horse outline. Show it a person, and you get a person silhouette
                &mdash; without ever being told what a dog, horse, or person looks like,
                without any segmentation labels.
                <br /><br />
                The network learned to segment objects as a free side effect of learning
                to understand images. The Transformer&apos;s attention mechanism, designed
                for language, turned out to naturally group related image regions together.
            </Analogy>

            <Analogy label="Why ViT Now Runs Everything">
                By 2022, the Vision Transformer had become the engine inside almost every
                major AI system that deals with images. CLIP (by OpenAI) uses a ViT to
                understand images so well that it can match them to text descriptions &mdash;
                that is how you can search a photo library by typing &ldquo;a red bicycle
                near a canal.&rdquo; Stable Diffusion uses a ViT-based encoder as part of
                its image generation pipeline. GPT-4V (the version of GPT-4 that can see
                images) feeds images through a ViT before the language model reads them.
                Google&apos;s Gemini does the same.
                <br /><br />
                In four years, a 2020 paper that asked &ldquo;what if we just chop images
                into tiles and use a Transformer?&rdquo; became the foundation of the
                entire multimodal AI era. The next time you upload an image to an AI and
                it understands what is in it, there is a very good chance a Vision
                Transformer is the part doing the seeing.
            </Analogy>
        </>
    )
}

// ── HighSchoolTab ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Patch projection, positional encoding, and attention mechanics</h2>

            <DefBlock label="Why Linear Patch Projection Works">
                Each 16&times;16&times;3 patch contains P&sup2;C = 768 raw pixel values. The
                linear projection E &isin; &#8477;<sup>P&sup2;C &times; D</sup> maps this
                768-dimensional vector to a D-dimensional embedding. This is equivalent to
                a single convolutional layer with kernel size P, stride P, and D output
                channels &mdash; a strided convolution that does not overlap. The key
                insight is that this projection is learned end-to-end: the model discovers
                which linear combinations of pixel values are useful features, rather than
                having hand-designed filters. Visualizing the rows of E after training
                reveals Gabor-filter-like patterns &mdash; the same local edge detectors
                CNNs learn in their first layer, but discovered purely through gradient
                descent on a classification objective.
            </DefBlock>

            <h3>Patch Projection: Formal Derivation</h3>
            <p>
                Given an image x &isin; &#8477;<sup>H&times;W&times;C</sup>, reshape it
                into N non-overlapping patches where N = HW / P&sup2;. Each patch
                x<sub>p</sub><sup>i</sup> &isin; &#8477;<sup>P&sup2;C</sup> is flattened
                and projected:
            </p>
            <MathBlock tex="\mathbf{z}_i = \mathbf{x}_p^i \mathbf{E}, \quad \mathbf{E} \in \mathbb{R}^{P^2 C \times D}, \quad i = 1, \ldots, N" />
            <p>
                For ViT-Base with P = 16, H = W = 224, C = 3: N = (224&times;224) / 256 = 196
                patches, P&sup2;C = 768 input dimensions, D = 768 embedding dimensions.
                The projection matrix E has 768&times;768 = 589,824 parameters &mdash; a
                tiny fraction of the total model, yet it is the entire vision-specific
                component. Everything else is a standard Transformer.
            </p>

            <h3>The Full Input Sequence</h3>
            <p>
                A learnable class token x<sub>class</sub> &isin; &#8477;<sup>D</sup> is
                prepended to the patch embeddings. Learnable 1D positional embeddings
                E<sub>pos</sub> &isin; &#8477;<sup>(N+1)&times;D</sup> are added to encode
                spatial order. The full input to the Transformer encoder is:
            </p>
            <MathBlock tex="\mathbf{z}_0 = \bigl[\mathbf{x}_{\text{class}};\; \mathbf{x}_p^1 \mathbf{E};\; \mathbf{x}_p^2 \mathbf{E};\; \ldots;\; \mathbf{x}_p^N \mathbf{E}\bigr] + \mathbf{E}_{\text{pos}}" />
            <p>
                Note that E<sub>pos</sub> is learned, not fixed sinusoidal. The ViT paper
                compared several positional encoding schemes (no encoding, 1D learned,
                2D-aware learned, relative) and found 1D learned embeddings performed
                comparably to all alternatives. Interestingly, after training, the
                positional embedding similarity matrix shows a clear 2D spatial structure:
                patches close together in the image have similar positional embeddings,
                even though the embeddings were initialized randomly and learned with
                no explicit 2D constraint.
            </p>

            <h3>Sinusoidal vs. Learned Positional Embeddings for Patches</h3>
            <p>
                The original Transformer used sinusoidal position encodings defined by:
            </p>
            <MathBlock tex="\text{PE}(pos, 2k) = \sin\!\Bigl(\frac{pos}{10000^{2k/D}}\Bigr), \quad \text{PE}(pos, 2k{+}1) = \cos\!\Bigl(\frac{pos}{10000^{2k/D}}\Bigr)" />
            <p>
                For 1D sequences, sinusoidal encodings generalize to sequence lengths not
                seen during training. For 2D images, a natural extension uses separate
                sin/cos encodings for row and column indices. However, the ViT paper found
                that learned 1D embeddings matched or exceeded all positional encoding
                strategies on ImageNet. The reason: with only 196 patch positions and
                training on millions of images, the model has ample data to learn optimal
                positional representations from scratch.
            </p>

            <h3>Multi-Head Self-Attention Over Patches</h3>
            <p>
                The Transformer encoder applies L layers of multi-head self-attention (MSA)
                and MLP blocks with residual connections and LayerNorm. For layer &ell;:
            </p>
            <MathBlock tex="\mathbf{z}'_\ell = \text{MSA}(\text{LN}(\mathbf{z}_{\ell-1})) + \mathbf{z}_{\ell-1}" />
            <MathBlock tex="\mathbf{z}_\ell = \text{MLP}(\text{LN}(\mathbf{z}'_\ell)) + \mathbf{z}'_\ell" />
            <p>
                Multi-head attention with h heads computes scaled dot-product attention in
                parallel subspaces of dimension d<sub>k</sub> = D/h:
            </p>
            <MathBlock tex="\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\!\left(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{d_k}}\right)\mathbf{V}" />
            <p>
                The critical property: every patch token attends to every other patch token
                (including [CLS]) with complexity O(N&sup2;D). For N = 196 and D = 768,
                this is entirely tractable. The [CLS] token participates in every attention
                operation, accumulating a global summary of all patch information layer
                by layer.
            </p>

            <h3>Classification Head and the Role of [CLS]</h3>
            <p>
                After L Transformer layers, the [CLS] token&apos;s final hidden state
                z<sub>L</sub><sup>0</sup> &isin; &#8477;<sup>D</sup> is extracted and
                passed to a classification MLP:
            </p>
            <MathBlock tex="\hat{y} = \text{MLP}_{\text{head}}\!\left(\mathbf{z}_L^0\right)" />
            <p>
                During pretraining on large datasets, this MLP has two layers with GELU
                activation. During fine-tuning on downstream tasks, it is replaced with
                a single linear projection: &#374; = z<sub>L</sub><sup>0</sup> W where
                W &isin; &#8477;<sup>D&times;K</sup> and K is the number of classes.
                The design choice to use only the [CLS] token (rather than average-pooling
                all N patch tokens) is deliberate: it forces the model to compress the
                global image representation into a single learned vector, which trains
                the [CLS] token to gather the most task-relevant information through
                attention.
            </p>

            <h3>Alternative: Global Average Pooling</h3>
            <p>
                Some ViT variants (including MAE and DINOv2) replace the [CLS] token with
                global average pooling over all N patch tokens:
            </p>
            <MathBlock tex="\hat{y} = \text{MLP}_{\text{head}}\!\left(\frac{1}{N}\sum_{i=1}^{N} \mathbf{z}_L^i\right)" />
            <p>
                This removes one hyperparameter (the [CLS] embedding) and has been shown
                to perform comparably or better on some tasks. The choice between [CLS]
                and GAP is still debated; [CLS] is more faithful to BERT&apos;s design,
                while GAP avoids privileging any single token position.
            </p>

            <div className="ch-callout">
                <strong>Why scale cures the inductive bias deficit:</strong> CNNs encode
                locality (convolutions have finite receptive fields) and translation
                equivariance (a filter learned at one position applies everywhere). ViT
                has neither &mdash; full attention has infinite receptive field from
                layer 1, and the same patch at different positions has different positional
                embeddings. Learning locality and translation invariance from data requires
                observing the regularities of natural images millions of times. With
                JFT-300M (300M images) this is feasible; with ImageNet-1k (1.2M images)
                it is not. This explains the famous crossover: ViT underperforms CNNs
                below ~100M training images and surpasses them above that threshold.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import math

# ── Patch Embedding ───────────────────────────────────────────────────────────

class PatchEmbedding(nn.Module):
    """
    Split image into non-overlapping patches and project each to D dimensions.
    Equivalent to a single Conv2d with kernel_size=patch_size, stride=patch_size.
    """
    def __init__(self, image_size=224, patch_size=16, in_channels=3, embed_dim=768):
        super().__init__()
        self.patch_size = patch_size
        self.num_patches = (image_size // patch_size) ** 2
        # Linear projection via strided convolution: no weight sharing within a patch
        self.proj = nn.Conv2d(
            in_channels, embed_dim,
            kernel_size=patch_size, stride=patch_size
        )

    def forward(self, x):
        # x: (B, C, H, W)
        x = self.proj(x)          # (B, D, H/P, W/P)
        x = x.flatten(2)          # (B, D, N) where N = (H/P)*(W/P)
        x = x.transpose(1, 2)     # (B, N, D)
        return x


# ── Vision Transformer ────────────────────────────────────────────────────────

class ViT(nn.Module):
    """
    Minimal Vision Transformer (ViT-Base configuration by default).
    Follows Dosovitskiy et al. 2020 exactly:
      - Patch embedding -> [CLS] prepend -> positional embedding -> Transformer encoder
      - [CLS] token output -> classification head
    """
    def __init__(
        self,
        image_size=224,
        patch_size=16,
        in_channels=3,
        num_classes=1000,
        embed_dim=768,
        depth=12,          # number of Transformer encoder layers
        num_heads=12,
        mlp_ratio=4.0,
        dropout=0.1,
    ):
        super().__init__()
        self.patch_embed = PatchEmbedding(image_size, patch_size, in_channels, embed_dim)
        num_patches = self.patch_embed.num_patches

        # Learnable [CLS] token (prepended to patch sequence)
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))

        # Learnable 1D positional embeddings for [CLS] + N patches
        self.pos_embed = nn.Parameter(torch.zeros(1, num_patches + 1, embed_dim))

        self.dropout = nn.Dropout(dropout)

        # Standard Transformer encoder (PyTorch built-in)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim,
            nhead=num_heads,
            dim_feedforward=int(embed_dim * mlp_ratio),
            dropout=dropout,
            activation="gelu",
            batch_first=True,
            norm_first=True,   # Pre-norm (ViT uses LayerNorm before each sub-block)
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=depth)
        self.norm = nn.LayerNorm(embed_dim)

        # Classification head: single linear layer (fine-tuning regime)
        self.head = nn.Linear(embed_dim, num_classes)

        self._init_weights()

    def _init_weights(self):
        # Initialize patch projection like a linear layer
        nn.init.trunc_normal_(self.pos_embed, std=0.02)
        nn.init.trunc_normal_(self.cls_token, std=0.02)
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.trunc_normal_(m.weight, std=0.02)
                if m.bias is not None:
                    nn.init.zeros_(m.bias)

    def forward(self, x):
        B = x.shape[0]

        # 1. Patch embedding: (B, C, H, W) -> (B, N, D)
        x = self.patch_embed(x)

        # 2. Prepend [CLS] token: (B, N, D) -> (B, N+1, D)
        cls = self.cls_token.expand(B, -1, -1)
        x = torch.cat([cls, x], dim=1)

        # 3. Add positional embeddings
        x = x + self.pos_embed
        x = self.dropout(x)

        # 4. Transformer encoder over all N+1 tokens
        x = self.transformer(x)
        x = self.norm(x)

        # 5. Extract [CLS] token (position 0) and classify
        cls_output = x[:, 0]          # (B, D)
        logits = self.head(cls_output) # (B, num_classes)
        return logits


# ── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # ViT-Base/16: patch_size=16, embed_dim=768, depth=12, num_heads=12
    model = ViT(
        image_size=224, patch_size=16, in_channels=3,
        num_classes=1000, embed_dim=768, depth=12, num_heads=12,
    )

    total_params = sum(p.numel() for p in model.parameters())
    print(f"ViT-Base/16 parameters: {total_params:,}")

    # Forward pass with a batch of 4 random images
    x = torch.randn(4, 3, 224, 224)
    logits = model(x)
    print(f"Input shape : {x.shape}")
    print(f"Output shape: {logits.shape}")
    # Expected: torch.Size([4, 1000])

    # Inspect patch embedding output
    patches = model.patch_embed(x)
    print(f"Patch tokens: {patches.shape}")
    # Expected: torch.Size([4, 196, 768]) — 196 patches, each 768-dim
`

function PythonContent() {
    return (
        <>
            <p>
                A minimal but complete PyTorch implementation of ViT-Base/16, following
                Dosovitskiy et al. (2020) exactly: patch embedding via strided convolution,
                learnable [CLS] token, learned 1D positional embeddings, a standard
                pre-norm Transformer encoder, and a linear classification head on the
                [CLS] token output. The model is fully trainable and produces the correct
                output shape for ImageNet classification.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="vit.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Vision Transformers: architecture and mathematical foundations</h2>

            <h3>Image Tokenization: Patches as Tokens</h3>
            <p>
                The fundamental operation in ViT is converting an image into a sequence of
                fixed-size tokens. Given an image x &isin; &#8477;<sup>H&times;W&times;C</sup>,
                we divide it into N non-overlapping patches of size P&times;P pixels, where:
            </p>
            <MathBlock tex="N = \frac{HW}{P^2}" />
            <p>
                For the standard ViT-Base configuration: H = W = 224, P = 16, C = 3, giving
                N = 196 patches. Each patch is a P&times;P&times;C = 768-dimensional raw
                pixel array. This array is flattened and linearly projected by a learnable
                matrix E &isin; &#8477;<sup>P&sup2;C &times; D</sup> to produce a D-dimensional
                patch embedding. The projection E is the only vision-specific component in
                the entire architecture &mdash; it is equivalent to a single strided
                convolution with no nonlinearity. Everything downstream is identical to
                a standard NLP Transformer.
            </p>
            <MathBlock tex="\mathbf{e}_i = \mathbf{x}_p^i \mathbf{E}, \quad \mathbf{E} \in \mathbb{R}^{P^2 C \times D}, \quad i = 1, \ldots, N" />

            <h3>The Input Sequence</h3>
            <p>
                ViT borrows the [CLS] token from BERT: a learnable vector
                x<sub>class</sub> &isin; &#8477;<sup>D</sup> is prepended to the N patch
                embeddings, producing a sequence of length N + 1. Learnable positional
                embeddings E<sub>pos</sub> &isin; &#8477;<sup>(N+1)&times;D</sup> are added
                element-wise to encode spatial order (since self-attention is permutation-
                invariant). The complete input to the Transformer encoder is:
            </p>
            <MathBlock tex="\mathbf{z}_0 = \bigl[\mathbf{x}_{\text{class}};\;\mathbf{e}_1;\;\mathbf{e}_2;\;\ldots;\;\mathbf{e}_N\bigr] + \mathbf{E}_{\text{pos}}" />
            <p>
                The positional embeddings are initialized randomly and learned from data.
                After training, they exhibit a clear 2D spatial structure in their
                similarity matrix: patches that are adjacent in the image have similar
                positional embeddings, even without any explicit 2D constraint in the
                loss function.
            </p>

            <h3>Transformer Encoder</h3>
            <p>
                The encoder consists of L alternating blocks of multi-head self-attention
                (MSA) and feed-forward MLP, with LayerNorm applied before each sub-block
                (pre-norm) and residual connections:
            </p>
            <MathBlock tex="\mathbf{z}'_\ell = \mathrm{MSA}\!\left(\mathrm{LN}(\mathbf{z}_{\ell-1})\right) + \mathbf{z}_{\ell-1}" />
            <MathBlock tex="\mathbf{z}_\ell = \mathrm{MLP}\!\left(\mathrm{LN}(\mathbf{z}'_\ell)\right) + \mathbf{z}'_\ell" />
            <p>
                Scaled dot-product attention with h heads (each of dimension d<sub>k</sub>
                = D/h) over all N + 1 tokens:
            </p>
            <MathBlock tex="\mathrm{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \mathrm{softmax}\!\left(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{d_k}}\right)\mathbf{V}" />
            <p>
                The key property: every token (including [CLS]) attends to every other
                token from layer 1 onward. No convolutional locality bias. The
                computational complexity per layer is O((N+1)&sup2; D), which for N = 196
                and D = 768 is approximately 23M multiply-adds per layer &mdash; tractable
                on modern GPUs.
            </p>

            <h3>Classification Head</h3>
            <p>
                After L layers, the [CLS] token&apos;s final representation
                z<sub>L</sub><sup>0</sup> &isin; &#8477;<sup>D</sup> has aggregated
                information from all N image patches through L rounds of attention. It is
                passed to a classification MLP:
            </p>
            <MathBlock tex="\hat{y} = \mathrm{MLP}_{\mathrm{head}}\!\left(\mathrm{LN}\!\left(\mathbf{z}_L^0\right)\right)" />
            <p>
                During JFT-300M pretraining: a two-layer MLP with a GELU nonlinearity and
                hidden size D. During fine-tuning on ImageNet: a single linear layer
                z<sub>L</sub><sup>0</sup> W, W &isin; &#8477;<sup>D&times;K</sup>. The
                pre-training head is discarded and the linear head is trained from scratch
                during fine-tuning.
            </p>

            <h3>Why Scale Matters: ViT&apos;s Missing Inductive Biases</h3>
            <p>
                CNNs encode two structural priors about natural images:
            </p>
            <ul>
                <li>
                    <strong>Locality:</strong> Convolutional kernels operate on small
                    spatial neighborhoods (e.g., 3&times;3). Features at position (i, j)
                    depend only on pixels within the kernel&apos;s receptive field.
                </li>
                <li>
                    <strong>Translation equivariance:</strong> A filter learned to detect
                    a horizontal edge at position (10, 10) is applied identically at
                    every other position. The same filter weights produce the same response
                    to the same local pattern, regardless of where it appears.
                </li>
            </ul>
            <p>
                ViT has neither property. Self-attention is a global operation from layer
                1 &mdash; every patch influences every other patch. Positional embeddings
                break translation equivariance: the same patch content at different
                positions gets different treatment. These priors are not wrong, but they
                are constraints that reduce the model&apos;s effective hypothesis space,
                allowing CNNs to learn faster from smaller datasets.
            </p>
            <p>
                Without these shortcuts, ViT must infer locality and translation regularity
                from data alone. The empirical evidence quantifies the crossover:
                ViT-Large with ImageNet-1k (1.2M images) achieves ~81% top-1 accuracy,
                below BiT-L (ResNet-based) at 87.5%. ViT-Large with JFT-300M (300M images)
                achieves 88.6%, surpassing all CNN baselines. The crossover occurs around
                100M training images.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The architectural unification:</strong> ViT demonstrated that the
                same Transformer encoder &mdash; unchanged &mdash; that processes sequences
                of word embeddings can process sequences of patch embeddings and achieve
                state-of-the-art image classification. The only vision-specific component
                is a single linear projection matrix. This architectural unification is
                why ViT became the backbone of multimodal systems: a single Transformer
                can process text tokens and image patch tokens in the same embedding space,
                enabling direct cross-attention between modalities.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">
                        Formal derivations &middot; positional encoding analysis &middot; scaling theory
                    </span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">
                        PyTorch implementation &middot; ViT-Base/16 forward pass
                    </span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Tab map ───────────────────────────────────────────────────────────────────

export const VIT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
