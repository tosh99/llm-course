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
            year: "2013&ndash;2020 &mdash; Prior Text-to-Image Work",
            label: "Context",
            title: "GAN-based approaches limited to narrow domains",
            body: (
                <>
                    Before DALL-E, the dominant approach to text-to-image generation used
                    Generative Adversarial Networks (GANs). Reed et al. (2016) showed a GAN
                    could generate plausible 64&times;64 bird images from text descriptions.
                    StackGAN (Zhang et al., 2017) scaled this to 256&times;256 using a
                    two-stage pipeline: a first GAN generated a rough 64&times;64 sketch
                    conditioned on text, a second GAN refined and upsampled it. AttnGAN and
                    DF-GAN improved visual quality by incorporating word-level attention and
                    deeper fusion between text and image features.
                    <br /><br />
                    All these systems shared a critical limitation: they were trained and
                    evaluated on domain-specific datasets (Oxford flowers, CUB birds, COCO
                    captions). A model trained on birds could not generate flowers; a model
                    trained on flowers could not generate vehicles. The networks learned to
                    combine visual statistics within a narrow domain, not to interpret
                    open-ended natural language describing arbitrary concepts. Creative
                    prompts like &ldquo;an armchair in the shape of an avocado&rdquo; were
                    entirely outside their capability. General creative text-to-image
                    generation remained an unsolved problem.
                </>
            ),
            impact:
                "GAN-based text-to-image systems demonstrated the concept was feasible but remained fundamentally domain-constrained, unable to generalize to open-ended creative prompts.",
        },
        {
            year: "2019 &mdash; VQ-VAE-2 and Image Discretization",
            label: "Precursor",
            title: "Van den Oord et al. show images can be compressed to discrete codebook tokens",
            body: (
                <>
                    The key intellectual precursor to DALL-E was not a text-to-image paper at
                    all. Van den Oord et al.&apos;s VQ-VAE (2017) introduced the idea of
                    vector quantization for image compression: an encoder maps an image to a
                    continuous latent grid, each spatial position is then &ldquo;snapped&rdquo;
                    to the nearest entry in a discrete codebook of K learned vectors. The
                    decoder reconstructs the image from the sequence of codebook indices.
                    The result: an image becomes a sequence of integers.
                    <br /><br />
                    VQ-VAE-2 (Razavi et al., 2019) extended this to a hierarchical two-level
                    codebook and demonstrated that 256&times;256 images of faces and bedrooms
                    could be compressed to a 32&times;32 grid of discrete tokens (1024 tokens,
                    codebook size 512) and reconstructed with high visual fidelity. Crucially,
                    the authors showed that after training the VQ-VAE, you could separately
                    train a PixelCNN on the discrete token sequences to generate new images
                    by sampling from the prior. Images had become a generative sequence
                    modeling problem &mdash; and sequence models were a domain where the NLP
                    community had just made extraordinary advances.
                </>
            ),
            impact:
                "VQ-VAE-2 established that images could be treated as sequences of discrete tokens, directly enabling the application of large autoregressive language models to image generation.",
        },
        {
            year: "January 2021 &mdash; DALL-E (Ramesh et al., OpenAI)",
            label: "Breakthrough",
            title: "12B-parameter Transformer trained to generate images from text",
            body: (
                <>
                    In January 2021, Aditya Ramesh, Mikhail Pavlov, Gabriel Goh, Scott Gray,
                    Chelsea Voss, Alec Radford, Mark Chen, and Ilya Sutskever published
                    &ldquo;Zero-Shot Text-to-Image Generation&rdquo; alongside a blog post
                    that demonstrated something the AI community had never seen at this scale:
                    a single model generating creative, high-quality images from arbitrary
                    English text prompts.
                    <br /><br />
                    The architecture had two stages. First, a discrete VAE (dVAE) was
                    pretrained to compress 256&times;256 images to a 32&times;32 grid of
                    discrete tokens from a codebook of size 8192 &mdash; 1024 image tokens
                    per image. Second, a 12-billion-parameter autoregressive Transformer was
                    trained on 250 million (text, image) pairs scraped from the internet.
                    Text was tokenized with BPE into up to 256 tokens. The Transformer
                    modeled the joint sequence of 256 text tokens followed by 1024 image
                    tokens, learning p(image&nbsp;tokens | text&nbsp;tokens) by predicting
                    each token autoregressively.
                    <br /><br />
                    At inference time: given a text prompt, generate 512 candidate image
                    token sequences autoregressively, decode each to a pixel image using
                    the dVAE decoder, then use CLIP to re-rank all 512 candidates and return
                    the top-scoring image. The demonstrations were remarkable: &ldquo;an
                    armchair in the shape of an avocado,&rdquo; &ldquo;a painting of a
                    capybara sitting in a field at sunrise in the style of Rembrandt,&rdquo;
                    &ldquo;the text &apos;OpenAI&apos; made out of sushi.&rdquo;
                </>
            ),
            impact:
                "DALL-E was the first demonstration that a large autoregressive Transformer, trained at scale on internet data, could achieve general creative text-to-image generation across arbitrary open-ended prompts.",
        },
        {
            year: "April 2022 &mdash; DALL-E 2 (Ramesh et al.)",
            label: "Successor",
            title: "Diffusion model in CLIP embedding space replaces the autoregressive Transformer",
            body: (
                <>
                    DALL-E 2 (Ramesh et al., April 2022) replaced the autoregressive image
                    token Transformer with a diffusion-based architecture operating in CLIP&apos;s
                    embedding space. The system had two components. First, a &ldquo;prior&rdquo;
                    model (itself a diffusion model) maps the CLIP text embedding of the prompt
                    to a CLIP image embedding &mdash; p(z<sub>img</sub> | z<sub>text</sub>).
                    Second, an image decoder &mdash; called unCLIP &mdash; is a conditional
                    diffusion model that generates a 64&times;64 image conditioned on the CLIP
                    image embedding, then upsamples to 256&times;256 and 1024&times;1024
                    using two cascade diffusion models.
                    <br /><br />
                    The CLIP embedding bottleneck enforces semantic alignment: the prior must
                    produce an image embedding that is geometrically close to CLIP image
                    embeddings of real images matching the text. The diffusion decoder then
                    adds photorealistic visual detail to match that embedding. The result was
                    a qualitative leap in image quality and text-image alignment compared to
                    DALL-E 1, producing 1024&times;1024 photorealistic images. The
                    autoregressive approach of DALL-E 1 was superseded within 15 months.
                </>
            ),
            impact:
                "DALL-E 2 demonstrated that diffusion models operating in semantic embedding spaces dramatically outperform autoregressive image token models, setting the template for subsequent commercial image generators.",
        },
        {
            year: "August 2022 &mdash; Stable Diffusion and Democratization",
            label: "Democratization",
            title: "Rombach et al. release open-source Latent Diffusion Models",
            body: (
                <>
                    Rombach, Blattmann, Lorenz, Esser, and Ommer at LMU Munich and Stability AI
                    published &ldquo;High-Resolution Image Synthesis with Latent Diffusion
                    Models&rdquo; (CVPR 2022). The core insight: instead of running the diffusion
                    process in pixel space (where a 512&times;512 image is a 786,432-dimensional
                    vector), first compress the image to a VAE latent z = Enc(x) &isin;
                    &#8477;<sup>64&times;64&times;4</sup> (16,384 dimensions &mdash; approximately
                    48&times; smaller), then run diffusion in that latent space. The final step
                    decodes the denoised latent to pixels: x&#770; = Dec(z&#771;<sub>0</sub>).
                    Text conditioning enters via cross-attention layers in the U-Net.
                    <br /><br />
                    In August 2022, Stability AI released the full model weights, training code,
                    and inference code publicly under a permissive license. Within 72 hours,
                    the model had been downloaded hundreds of thousands of times. Within weeks,
                    community members had built local inference tools, fine-tuning frameworks,
                    and creative extensions. For the first time, anyone with a consumer GPU
                    (8 GB VRAM) could generate photorealistic images from text prompts locally,
                    at no cost, with no API restrictions. DALL-E had been API-only; Stable
                    Diffusion made text-to-image a tool anyone could run on their own hardware.
                </>
            ),
            impact:
                "Stable Diffusion&apos;s open release democratized text-to-image generation, triggering an explosion of creative applications, fine-tuned variants, and open-source tooling that redefined what &ldquo;making art with AI&rdquo; meant.",
        },
        {
            year: "October 2023 &mdash; DALL-E 3 (Betker et al.)",
            label: "Refinement",
            title: "Synthetic recaptioning dramatically improves text-following",
            body: (
                <>
                    DALL-E 3 (Betker, Goh, Jing, et al., October 2023) addressed a fundamental
                    data quality problem that limited all prior text-to-image systems: internet
                    image-text pairs have poor captions. Alt-text attributes are often filenames
                    (&ldquo;photo_2021_08_15.jpg&rdquo;), uninformative marketing copy, or
                    descriptions that mention the subject but omit color, position, count, and
                    compositional details that a generative model needs to follow precisely.
                    <br /><br />
                    OpenAI&apos;s solution was synthetic recaptioning: train a large image
                    captioning model (based on a pretrained vision-language model fine-tuned
                    on human-annotated descriptive captions) to regenerate detailed,
                    compositionally accurate captions for all training images. The original
                    internet alt-text was discarded. Training on these synthetic captions
                    &mdash; rather than on noisy human-written captions &mdash; dramatically
                    improved the model&apos;s ability to follow fine-grained text instructions:
                    correct object counts, precise spatial relationships, accurate color
                    attributes. DALL-E 3 was integrated into ChatGPT in November 2023,
                    making high-quality text-to-image generation available to over 100 million
                    users through a conversational interface.
                </>
            ),
            impact:
                "DALL-E 3 showed that training data quality &mdash; specifically caption quality &mdash; is as important as model scale for text-to-image alignment, establishing synthetic recaptioning as a standard technique.",
        },
        {
            year: "2023&ndash;2024 &mdash; The Diffusion Era",
            label: "Impact",
            title: "Diffusion architectures dominate; autoregressive approaches revisited",
            body: (
                <>
                    By 2023, the landscape of text-to-image generation had settled into
                    diffusion-based architectures across all major systems. Midjourney v5 and v6
                    produced images that were frequently indistinguishable from professional
                    photography. Adobe Firefly integrated text-to-image into creative workflows.
                    Google&apos;s Imagen 2 and Parti explored diffusion and autoregressive
                    approaches respectively. Black Forest Labs&apos; FLUX.1 (2024) combined
                    a rectified flow transformer with a multimodal transformer backbone,
                    achieving state-of-the-art quality on photorealism and text rendering
                    benchmarks.
                    <br /><br />
                    The original autoregressive token approach of DALL-E 1 was largely
                    superseded in commercial systems, though academic research continued to
                    explore it. LlamaGen (Sun et al., 2024) showed that scaling autoregressive
                    image generation with large language model training infrastructure could
                    achieve competitive quality. The convergence of language model and image
                    model training pipelines &mdash; both treating generation as next-token
                    prediction over discrete vocabularies &mdash; remained an active research
                    direction, motivated by the prospect of unified multimodal models that
                    generate text and images within a single autoregressive framework.
                </>
            ),
            impact:
                "The 2021&ndash;2024 period transformed text-to-image generation from a research curiosity into a widely deployed consumer technology, with DALL-E&apos;s architectural innovations &mdash; scale, internet training, and CLIP re-ranking &mdash; catalyzing the entire field.",
        },
    ]

    return (
        <>
            <p className="ch-story-intro">
                Chapter 26 traces how vision and language models merged into unified systems.
                CLIP (Radford et al., 2021) showed that a contrastive objective on 400 million
                image&ndash;text pairs could produce image and text embeddings in a shared
                semantic space. DALL-E, published the same month, took the complementary
                direction: instead of learning to match images to text, could a model learn to
                generate images from text? The answer required combining two ideas from
                entirely different research traditions &mdash; the discrete image tokenization
                of VQ-VAE and the autoregressive modeling power of GPT &mdash; into a single
                12-billion-parameter system trained on a quarter-billion internet images. What
                followed was the most rapid expansion of a technology in the history of AI art.
            </p>
            <div className="ch-timeline">
                {items.map((item) => (
                    <TlItem key={item.year} item={item} />
                ))}
            </div>
            <div className="ch-callout">
                <strong>The DALL-E legacy:</strong> The January 2021 paper demonstrated that
                scale + internet data + autoregressive modeling could unlock general creative
                text-to-image generation. Within three years, this capability had become a
                consumer product used by hundreds of millions of people. The specific
                architecture &mdash; autoregressive image token prediction &mdash; was
                rapidly superseded by diffusion, but DALL-E&apos;s core contributions
                endured: training on internet-scale paired data, using CLIP for quality
                filtering and re-ranking, and framing image generation as a language modeling
                problem. Every major text-to-image system that followed inherited at least
                one of these ideas.
            </div>
        </>
    )
}

// ── KidTab ────────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <p className="ch-story-intro">
                We have seen how CLIP learned to connect images and words by looking at
                400 million pictures with captions and learning which ones matched. But CLIP
                only looks at images &mdash; it does not make them. DALL-E asked a different
                question: what if we could teach a computer to draw pictures from words?
                Not just simple sketches of one thing, but creative, surprising images &mdash;
                like an avocado shaped like an armchair, or a capybara painted in the style
                of Rembrandt. Here is how DALL-E made that happen.
            </p>

            <Analogy label="The Image Typewriter">
                Imagine you have a magic typewriter that can turn any picture into a secret
                code made of exactly 1024 numbers. Each number is between 0 and 8191 &mdash;
                like a special word from a dictionary of 8192 image &ldquo;words.&rdquo; The
                typewriter squishes the picture into a 32&times;32 grid of little squares,
                and each square gets one number from the dictionary.
                <br /><br />
                Now imagine a second machine that can turn that code back into a picture.
                If the code is right, the picture looks great. If the code is slightly off,
                the picture looks a little blurry. But the amazing thing is: now a picture
                is just a list of 1024 numbers. And lists of numbers are exactly what
                language models are good at predicting.
                <br /><br />
                DALL-E&apos;s first trick was building this magic typewriter &mdash; called
                a discrete VAE (dVAE). Once images were codes, a language model could learn
                to predict those codes from text descriptions. Generating an image became
                the same kind of task as writing a sentence: predict the next token, one
                at a time.
            </Analogy>

            <Analogy label="The Art Director and the Artist">
                DALL-E has two jobs working together. The &ldquo;artist&rdquo; is the big
                Transformer that generates 512 different candidate images given your text
                prompt. It does this by predicting one image token at a time, 1024 tokens
                per image, 512 times in a row. That is a lot of drawing.
                <br /><br />
                The &ldquo;art director&rdquo; is CLIP. Remember CLIP learned to score how
                well an image matches a text description. After the artist finishes all
                512 drawings, the art director looks at every single one and gives each a
                score: how well does this image match the original text prompt? Then DALL-E
                picks the drawing with the highest score.
                <br /><br />
                This two-step process &mdash; generate many candidates, pick the best one
                &mdash; is why DALL-E&apos;s outputs look so impressive. The artist produces
                many versions, some better than others. The art director picks only the
                winner. You never see the 511 rejected drawings.
            </Analogy>

            <Analogy label="Why &lsquo;Avocado Armchair&rsquo; Works">
                DALL-E was trained on 250 million pictures from the internet, each with a
                text caption. The internet contains an enormous variety of creative, unusual
                image&ndash;text pairings &mdash; product photos, art, memes, illustrations,
                book covers, advertising, scientific diagrams. Within this massive collection,
                the model encountered thousands of images of avocados, thousands of images
                of armchairs, and many examples of creative combinations of objects.
                <br /><br />
                When DALL-E trained to predict &ldquo;what image tokens come after these
                text tokens,&rdquo; it learned statistical patterns connecting word concepts
                to visual features. &ldquo;Avocado&rdquo; activates certain visual patterns
                (green, oval, bumpy texture, pit in the center). &ldquo;Armchair&rdquo;
                activates other visual patterns (four legs, padded seat, armrests). The
                model learned to combine these patterns when both words appear in the prompt.
                <br /><br />
                The internet&apos;s collective creativity became DALL-E&apos;s training
                signal. Any unusual concept combination that had ever appeared in a human-
                written caption was something the model could potentially generate. The scale
                of internet data &mdash; 250 million examples &mdash; is what made this
                generalization possible.
            </Analogy>

            <Analogy label="Diffusion: Sculpting From Noise">
                DALL-E 2 used a completely different approach called diffusion. Imagine
                starting with a picture that is pure TV static &mdash; every pixel is a
                random color, total chaos. A diffusion model is trained to slowly remove
                the noise, step by step, guided by your text description.
                <br /><br />
                At step 1000, the picture is pure noise. At step 999, it still looks like
                noise, but maybe some patches are very slightly organized. By step 500,
                you can start to see rough shapes. By step 100, the image is blurry but
                recognizable. By step 0, it is a clear, detailed image.
                <br /><br />
                Each step, the model asks: &ldquo;Given this noisy image and the text
                prompt, what should I remove to make this look more like a real image that
                matches the text?&rdquo; It is like a sculptor chipping away at a block
                of marble &mdash; each chip removes a bit of the noise and reveals more
                of the final image hidden inside. The result was much better quality than
                DALL-E 1&apos;s autoregressive approach.
            </Analogy>

            <Analogy label="Stable Diffusion: Art for Everyone">
                DALL-E was only available through OpenAI&apos;s website and API. You had
                to pay per image, and OpenAI decided what images were allowed. In August
                2022, a group of researchers released Stable Diffusion &mdash; a diffusion
                model for images that anyone could download and run on their own computer.
                <br /><br />
                Within days, millions of people downloaded it. Within weeks, a whole
                community had built tools for running it faster, training it on new art
                styles, and combining it with other techniques. Artists started using it
                to generate concept art. Game developers used it for textures. Researchers
                used it to study how AI generates images. Anyone with a gaming computer
                could generate any image they could describe.
                <br /><br />
                This was a big change. Before, text-to-image AI was a service controlled
                by a company. After, it was a tool anyone could use, study, and modify.
                The same shift had happened with Linux versus Windows for operating systems,
                and with Wikipedia versus encyclopedias for information. Open release
                accelerated progress enormously &mdash; the community built things the
                original researchers had never imagined.
            </Analogy>

            <Analogy label="Better Captions = Better Images">
                Here is a problem nobody talks about: the captions that come with internet
                images are usually terrible. When someone posts a photo online, the
                &ldquo;caption&rdquo; that gets saved with it might be the filename
                (&ldquo;IMG_3847.jpg&rdquo;), some marketing text (&ldquo;Shop now!&rdquo;),
                or a vague description (&ldquo;Nice sunset&rdquo;). It almost never says
                &ldquo;a woman in a red dress standing on a wooden pier at sunset, with
                orange reflections on the water and mountains in the background.&rdquo;
                <br /><br />
                DALL-E 3 (2023) realized that if you train on bad captions, you get a model
                that is bad at following detailed text instructions. The fix: use a captioning
                AI to look at every training image and write a proper, detailed description.
                Then throw away the original caption and train on the AI-written one instead.
                <br /><br />
                This &ldquo;synthetic recaptioning&rdquo; dramatically improved how well
                DALL-E 3 followed specific instructions &mdash; correct object counts, right
                colors, accurate spatial relationships. The lesson: for AI models, the quality
                of the training data matters as much as the size of the model. Better labels
                can beat bigger models.
            </Analogy>
        </>
    )
}

// ── HighSchoolTab ─────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>Deep dives: dVAE gradients, DDPM loss, and CLIP re-ranking theory</h2>

            <DefBlock label="dVAE Straight-Through Gradient Estimation">
                The discrete VAE quantization step z = argmin<sub>k</sub> &#x2016;Enc(x) &minus;
                e<sub>k</sub>&#x2016;<sub>2</sub> is not differentiable: argmin is a step
                function with zero gradient almost everywhere. The straight-through estimator
                (Bengio et al., 2013) bypasses this: during the forward pass, use the discrete
                codebook index; during the backward pass, treat the quantization as an identity
                function and pass gradients directly from the decoder input to the encoder
                output. Formally, for encoder output h and quantized code z<sub>q</sub>:
                forward pass uses z<sub>q</sub>, backward pass computes &part;L / &part;h
                as if z<sub>q</sub> = h. This enables end-to-end gradient flow through
                an otherwise non-differentiable discrete bottleneck.
            </DefBlock>

            <h3>DALL-E dVAE Training Objective</h3>
            <p>
                The dVAE is trained with a relaxed ELBO. Let x be the image, z be the
                discrete token sequence (1024 tokens, each from vocabulary of size K = 8192),
                q(z|x) the encoder distribution (approximated via Gumbel-softmax relaxation
                with temperature &tau; &rarr; 0), and p(x|z) the decoder distribution. The
                objective is:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{dVAE}} = \mathbb{E}_{q_\phi(z|x)}\bigl[\log p_\theta(x \mid z)\bigr] - \beta \cdot D_{\mathrm{KL}}\bigl(q_\phi(z|x) \;\|\; p(z)\bigr)" />
            <p>
                During dVAE pretraining, p(z) is a uniform prior over the K<sup>N</sup>
                possible token sequences. The reconstruction term forces the codebook to
                encode all visual detail necessary to reconstruct x. The KL term prevents
                codebook collapse (all inputs mapping to the same token). After dVAE
                pretraining, the codebook is fixed and the Transformer is trained separately.
            </p>

            <h3>DDPM Loss for DALL-E 2&apos;s Diffusion Prior</h3>
            <p>
                DALL-E 2&apos;s prior models p(z<sub>img</sub> | z<sub>text</sub>) using
                a denoising diffusion probabilistic model (DDPM). The forward process adds
                Gaussian noise to the CLIP image embedding z<sub>img</sub> over T = 1000
                timesteps:
            </p>
            <MathBlock tex="q(z_t \mid z_0) = \mathcal{N}\!\left(z_t;\; \sqrt{\bar{\alpha}_t}\, z_0,\; (1 - \bar{\alpha}_t)\,\mathbf{I}\right)" />
            <p>
                where z<sub>0</sub> = z<sub>img</sub> is the original CLIP image embedding
                and &alpha;&#772;<sub>t</sub> = &prod;<sub>s=1</sub><sup>t</sup>(1 &minus;
                &beta;<sub>s</sub>) is the cumulative noise schedule. The denoising network
                &epsilon;<sub>&theta;</sub>(z<sub>t</sub>, t, z<sub>text</sub>) predicts the
                noise added at timestep t, conditioned on the noisy embedding and the CLIP
                text embedding. The training objective is:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{prior}} = \mathbb{E}_{z_0,\,\epsilon,\,t}\!\left[\left\|\epsilon - \epsilon_\theta\!\left(\sqrt{\bar{\alpha}_t}\,z_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon,\; t,\; z_{\text{text}}\right)\right\|^2\right]" />
            <p>
                At inference, the prior samples z<sub>img</sub> by starting from Gaussian
                noise z<sub>T</sub> &#126; &#120032;(0, I) and iteratively denoising using
                the DDPM reverse process, conditioned on z<sub>text</sub>. The result is
                a CLIP image embedding that is semantically consistent with the text prompt
                but stochastically varied &mdash; different samples correspond to different
                valid visual interpretations of the same text.
            </p>

            <h3>Latent Diffusion ELBO (Stable Diffusion)</h3>
            <p>
                Rombach et al. derive the latent diffusion training objective by composing
                the VAE&apos;s encoding with the DDPM loss. For image x, VAE encoder
                z = Enc(x) &isin; &#8477;<sup>(H/f)&times;(W/f)&times;C</sup> with
                downsampling factor f = 8. The latent diffusion model learns:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{LDM}} = \mathbb{E}_{\mathcal{E}(x),\,\epsilon \sim \mathcal{N}(0,1),\,t}\!\left[\left\|\epsilon - \epsilon_\theta\!\left(z_t,\, t,\, \tau_\theta(y)\right)\right\|^2\right]" />
            <p>
                where z<sub>t</sub> is the noisy latent at timestep t, &tau;<sub>&theta;</sub>(y)
                is a text encoder (CLIP or BERT) producing the conditioning signal y, and
                cross-attention layers in the U-Net implement the conditioning:
                Attn(Q, K, V) = softmax(QK<sup>T</sup>/&#8730;d)V where Q = W<sub>Q</sub>
                &phi;<sub>i</sub>(z<sub>t</sub>), K = W<sub>K</sub>&tau;<sub>&theta;</sub>(y),
                V = W<sub>V</sub>&tau;<sub>&theta;</sub>(y). The spatial feature map
                &phi;<sub>i</sub>(z<sub>t</sub>) of the U-Net is projected to queries, and
                the text embedding is projected to keys and values. This cross-attention
                mechanism is the primary channel through which text conditioning enters
                the image generation process.
            </p>

            <div className="ch-callout">
                <strong>Why latent diffusion is ~50&times; cheaper than pixel diffusion:</strong>{" "}
                For 512&times;512 RGB images, the pixel space has 512&times;512&times;3 = 786,432
                dimensions. With f = 8 downsampling and 4 latent channels, the latent space
                has 64&times;64&times;4 = 16,384 dimensions. Each diffusion step operates
                on 16,384 values instead of 786,432. Since the U-Net cost scales roughly
                quadratically with spatial resolution (due to attention layers), the
                computational saving is approximately (512/64)<sup>2</sup> = 64&times; for
                the attention operations. The VAE encode/decode steps add a fixed overhead
                but are performed only once at the beginning and end, not at each of the
                1000 diffusion steps.
            </div>
        </>
    )
}

const PY_CODE = `from diffusers import StableDiffusionPipeline
import torch

# ── Load Stable Diffusion ─────────────────────────────────────────────────────
# Stable Diffusion v1.5 is an open-source latent diffusion model.
# It uses:
#   - CLIP text encoder (ViT-L/14) to encode the text prompt
#   - A U-Net denoising network operating in VAE latent space (64x64x4)
#   - A VAE decoder to convert the denoised latent back to pixels (512x512x3)

model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16,   # Use fp16 for faster inference on GPU
)
pipe = pipe.to("cuda")           # Move to GPU

# Optional: enable attention slicing to reduce VRAM usage
pipe.enable_attention_slicing()


# ── Stage 1: Tokenize and encode text ─────────────────────────────────────────
# The pipeline handles this internally, but here is what happens:
#
#   tokens = tokenizer(prompt)                   # BPE tokenization (max 77 tokens)
#   text_embeddings = text_encoder(tokens)       # CLIP text encoder: (1, 77, 768)
#   uncond_embeddings = text_encoder([""])       # Unconditional (empty string)
#   embeddings = torch.cat([uncond_embeddings, text_embeddings])
#   # Combined for classifier-free guidance (CFG):
#   # noise_pred = uncond + guidance_scale * (cond - uncond)


# ── Stage 2: Denoise in latent space ──────────────────────────────────────────
# The pipeline samples random Gaussian noise z_T ~ N(0, I) of shape (1, 4, 64, 64).
# Then runs T=50 DDIM steps (fewer than the 1000 DDPM training steps):
#
#   for t in scheduler.timesteps:           # t = 981, 961, ..., 21, 1
#       noise_pred = unet(z_t, t, embeddings)   # U-Net with cross-attention
#       z_{t-1} = scheduler.step(noise_pred, t, z_t)  # DDIM update rule


# ── Stage 3: Decode latent to pixels ──────────────────────────────────────────
# After denoising, z_0 has shape (1, 4, 64, 64).
# The VAE decoder upsamples back to pixels:
#   image = vae.decode(z_0 / vae.scaling_factor)   # -> (1, 3, 512, 512)
#   image = (image / 2 + 0.5).clamp(0, 1)          # unnormalize to [0, 1]


# ── Run the full pipeline ──────────────────────────────────────────────────────
prompt = "an armchair in the shape of an avocado, product photography, studio lighting"
negative_prompt = "blurry, low quality, distorted"

image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=50,    # number of denoising steps (more = higher quality, slower)
    guidance_scale=7.5,        # classifier-free guidance scale (higher = more prompt-adherent)
    width=512,
    height=512,
).images[0]

image.save("avocado_armchair.png")
print("Saved avocado_armchair.png")


# ── Comparison: DALL-E API (for reference) ─────────────────────────────────────
# The original DALL-E 1 architecture:
#   1. dVAE encodes 256x256 image -> 32x32 grid of discrete tokens (1024 tokens, vocab=8192)
#   2. Autoregressive Transformer (12B params) predicts image tokens given text tokens:
#      p(z_1, ..., z_1024 | t_1, ..., t_256)
#   3. At inference: generate 512 candidates, re-rank with CLIP, return top image
#
# import openai
# response = openai.images.generate(
#     model="dall-e-3",        # DALL-E 3 uses diffusion + synthetic recaptioning
#     prompt=prompt,
#     n=1,
#     size="1024x1024",
# )
# image_url = response.data[0].url
`

function PythonContent() {
    return (
        <>
            <p>
                A complete example using the Hugging Face{" "}
                <code>diffusers</code> library to load Stable Diffusion v1.5 and generate
                an image from a text prompt. The code is annotated to show what is happening
                at each stage of the latent diffusion pipeline: text tokenization and CLIP
                encoding, iterative DDIM denoising in VAE latent space, and VAE decoding
                back to pixels. A reference comment block shows the corresponding DALL-E 1
                autoregressive pipeline for contrast.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="stable_diffusion_demo.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>DALL-E: architecture, mathematics, and the diffusion transition</h2>

            <h3>Stage 1 &mdash; dVAE: Image Tokenization</h3>
            <p>
                DALL-E&apos;s first component is a discrete Variational Autoencoder (dVAE)
                that compresses a 256&times;256 RGB image to a 32&times;32 grid of discrete
                tokens. The encoder maps each local image patch to a continuous vector, then
                quantizes it by finding the nearest entry in a learned codebook of K = 8192
                vectors:
            </p>
            <MathBlock tex="z_{ij} = \underset{k \in \{1,\ldots,K\}}{\arg\min}\;\left\|\mathrm{Enc}(x)_{ij} - \mathbf{e}_k\right\|_2" />
            <p>
                The 32&times;32 grid of indices z<sub>ij</sub> &isin; &#123;1, &hellip;, 8192&#125;
                represents the entire image in 1024 integers. The decoder is trained
                to reconstruct the image from this sequence: p<sub>&theta;</sub>(x | z). Because
                argmin is not differentiable, gradients are passed through using the
                straight-through estimator: the backward pass treats quantization as an
                identity function, allowing the encoder weights to receive gradient signal
                from the reconstruction loss.
            </p>

            <DefBlock label="Why Discrete Tokens Enable Autoregressive Generation">
                Once images are sequences of discrete integers, the image generation problem
                becomes identical in structure to text generation. A language model trained
                to predict &ldquo;given these text tokens, what text tokens come next?&rdquo;
                can be repurposed to predict &ldquo;given these text tokens, what image
                tokens come next?&rdquo; No architectural changes are required &mdash; only
                the training data changes. This reframing is the core conceptual move in
                DALL-E.
            </DefBlock>

            <h3>Stage 2 &mdash; Autoregressive Transformer</h3>
            <p>
                The DALL-E Transformer models the joint probability of text tokens t and image
                tokens z autoregressively. Text is tokenized with BPE (up to 256 tokens); the
                1024 image tokens follow. The model learns the conditional distribution:
            </p>
            <MathBlock tex="p(z_1, \ldots, z_{1024} \mid t_1, \ldots, t_{256}) = \prod_{i=1}^{1024} p\!\left(z_i \mid z_{<i},\; t_1, \ldots, t_{256}\right)" />
            <p>
                The combined 1280-token sequence (256 text + 1024 image) is processed by a
                12-billion-parameter Transformer with 96 layers, 64 attention heads, and
                4096-dimensional embeddings. Standard full self-attention over 1280 tokens
                would require a 1280&times;1280 attention matrix &mdash; feasible, but the
                paper used sparse attention patterns (row, column, and convolutional attention)
                to reduce cost. At inference, the model generates all 1024 image tokens
                autoregressively given the text prefix, one token at a time.
            </p>

            <h3>Stage 3 &mdash; CLIP Re-ranking</h3>
            <p>
                Because autoregressive sampling is stochastic, different samples from the same
                text prompt produce images of varying quality and semantic accuracy. DALL-E
                generates N<sub>gen</sub> = 512 candidate image token sequences, decodes each
                with the dVAE decoder, and scores each decoded image using CLIP:
            </p>
            <MathBlock tex="\mathrm{score}(i) = \frac{f_V(\mathrm{image}_i) \cdot f_T(\mathrm{text\_prompt})}{\tau}" />
            <p>
                where f<sub>V</sub> and f<sub>T</sub> are the CLIP image and text encoders,
                &middot; is the dot product in the joint embedding space, and &tau; is the
                learned CLIP temperature. The candidate with the highest CLIP score is
                returned. This generate-then-rank pipeline is critical: the autoregressive
                model provides diversity (512 varied candidates), and CLIP provides semantic
                discriminability (selecting the most text-aligned image). Neither component
                alone achieves the full result.
            </p>

            <h3>DALL-E 2 &mdash; Diffusion in CLIP Space (unCLIP)</h3>
            <p>
                DALL-E 2 replaced the autoregressive image token Transformer with a two-stage
                diffusion system. A &ldquo;prior&rdquo; model P(z<sub>img</sub> | z<sub>text</sub>)
                maps the CLIP text embedding to a CLIP image embedding using a DDPM. A
                conditional diffusion decoder &mdash; called unCLIP &mdash; then generates the
                image conditioned on the image embedding. The DDPM score function for the prior
                is parameterized by a Transformer that predicts the noise:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{prior}} = \mathbb{E}_{t,\,\epsilon}\!\left[\left\|\epsilon - \epsilon_\theta\!\left(\sqrt{\bar{\alpha}_t}\,z_{\text{img}} + \sqrt{1 - \bar{\alpha}_t}\,\epsilon,\; t,\; z_{\text{text}}\right)\right\|^2\right]" />
            <p>
                The CLIP image embedding z<sub>img</sub> &isin; &#8477;<sup>1024</sup> serves as
                a semantic bottleneck: it encodes what the image should contain (matching the
                text semantics) while leaving photorealistic detail to the diffusion decoder.
                The cascade (64&times;64 &rarr; 256&times;256 &rarr; 1024&times;1024) upsamples
                using two additional diffusion models, each conditioned on the lower-resolution
                image and the CLIP image embedding.
            </p>

            <h3>Latent Diffusion (Stable Diffusion)</h3>
            <p>
                Rombach et al.&apos;s key insight was to apply diffusion in the VAE&apos;s latent
                space rather than pixel space. For a 512&times;512 image x, the VAE encoder
                produces z = Enc(x) &isin; &#8477;<sup>64&times;64&times;4</sup>. The latent
                diffusion U-Net denoises in this 16,384-dimensional space rather than the
                786,432-dimensional pixel space &mdash; approximately 48&times; fewer
                dimensions. Text conditioning enters via cross-attention in each U-Net block:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{LDM}} = \mathbb{E}_{\mathcal{E}(x),\,\epsilon,\,t}\!\left[\left\|\epsilon - \epsilon_\theta\!\left(z_t,\, t,\, \tau_\theta(y)\right)\right\|^2\right]" />
            <p>
                where z<sub>t</sub> = &#8730;&alpha;&#772;<sub>t</sub>z + &#8730;(1&minus;&alpha;&#772;<sub>t</sub>)&epsilon;
                is the noisy latent, &tau;<sub>&theta;</sub>(y) is the text encoder output, and
                the cross-attention projects text embeddings to keys and values: K = W<sub>K</sub>
                &tau;<sub>&theta;</sub>(y), V = W<sub>V</sub>&tau;<sub>&theta;</sub>(y). The final
                image is recovered by decoding the denoised latent: x&#770; = Dec(z&#771;<sub>0</sub>).
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The architectural shift in two years:</strong> DALL-E 1 (January 2021)
                treated image generation as autoregressive language modeling over discrete image
                tokens &mdash; predict 1024 tokens one at a time. DALL-E 2 (April 2022) replaced
                this with diffusion in CLIP&apos;s continuous embedding space. Stable Diffusion
                (August 2022) moved diffusion to a VAE latent space for computational efficiency.
                In 19 months, three fundamentally different architectures each achieved state-of-the-art
                results. The constant across all three: training on internet-scale paired data
                and using CLIP&apos;s joint embedding space either for re-ranking, conditioning,
                or as the diffusion target.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">
                        dVAE ELBO &middot; DDPM loss derivation &middot; latent diffusion ELBO
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
                        Stable Diffusion pipeline &middot; latent denoising stages &middot; DALL-E API reference
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

export const DALL_E_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
