import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Contrastive Language&#8209;Image Pretraining</h2>
            <p className="ch-story-intro">
                Chapter 25 solved the alignment problem for text &mdash; teaching models to follow
                instructions safely through RLHF and Constitutional AI. But alignment assumed models
                that only processed text. Throughout 2021&ndash;2022, a parallel revolution was
                happening: building models that understand both images and language together. The
                breakthrough was not trying to build one combined architecture from scratch, but to
                train two separate encoders &mdash; one for images, one for text &mdash; to produce
                embeddings that live in a shared meaning space. CLIP was the first demonstration that
                this contrastive approach could work at internet scale, and it changed everything about
                how we think about vision and language as unified modalities.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2013 &ndash; 2019</div>
                    <div className="ch-tl-section-label">Prior Work</div>
                    <div className="ch-tl-title">Vision&#8209;Language Models Before CLIP</div>
                    <div className="ch-tl-body">
                        Early vision-language models required expensive per-task labeled data. VQA
                        (Visual Question Answering, Antol et al. 2015) paired images with natural
                        language questions and trained classifiers over curated answer sets. ViLBERT
                        (Lu et al. 2019) extended BERT with a dual-stream architecture, using
                        cross-attention between image regions (from an object detector) and text
                        tokens. These achieved strong task-specific results but required separate
                        fine-tuning on each downstream dataset &mdash; expensive, brittle, and
                        fundamentally not generalizable to tasks not seen during training.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved the modalities could be connected, but only for pre-specified tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019 &ndash; 2020</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Self&#8209;Supervised Contrastive Learning for Vision</div>
                    <div className="ch-tl-body">
                        MoCo (He et al., 2019), SimCLR (Chen et al., 2020), and SwAV demonstrated
                        that powerful visual representations could be learned without any labels using
                        contrastive objectives. The core idea: augmented views of the same image
                        should produce similar embeddings; embeddings for different images should be
                        pushed apart. SimCLR showed that with large batches (4096+) and strong
                        augmentations, contrastive learning rivaled supervised ImageNet pretraining.
                        These methods worked for vision alone &mdash; the extension to language
                        remained an open problem.
                    </div>
                    <div className="ch-tl-impact">Impact: Validated contrastive learning at scale; proved labels were not necessary for strong representations</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">January 2021</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Radford et al. &mdash; CLIP (OpenAI)</div>
                    <div className="ch-tl-body">
                        &ldquo;Learning Transferable Visual Models From Natural Language Supervision.&rdquo;
                        The key innovation: apply contrastive learning to vision-language pairs at
                        internet scale. OpenAI collected WIT (WebImageText): 400 million (image,
                        alt-text) pairs scraped from the web. Two encoders were trained jointly &mdash;
                        a Vision Transformer (ViT-B/32, ViT-B/16, or ViT-L/14) for images, and a
                        12-layer Transformer for text. For each batch of N pairs, the objective
                        maximizes the cosine similarity of the N correct (image, text) pairs and
                        minimizes similarity of the N&#178;&minus;N incorrect pairs. After training, both
                        encoders map their inputs into the same 512-dimensional space where semantically
                        related content clusters together.
                    </div>
                    <div className="ch-tl-impact">Impact: First demonstration that contrastive vision-language pretraining works at internet scale</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">January 2021</div>
                    <div className="ch-tl-section-label">Result</div>
                    <div className="ch-tl-title">Zero&#8209;Shot ImageNet: 76.2% Top&#8209;1</div>
                    <div className="ch-tl-body">
                        CLIP&rsquo;s headline result: zero-shot classification on ImageNet by computing
                        cosine similarity between an image&rsquo;s embedding and the text embeddings of
                        &ldquo;a photo of a {"{classname}"}&rdquo; for each of ImageNet&rsquo;s 1000 classes. CLIP achieved
                        76.2% top-1 accuracy on ImageNet &mdash; matching a ResNet-101 trained on
                        ImageNet with full supervision. No ImageNet training data was used, no
                        per-class labels, no fine-tuning. The model generalized purely through its
                        learned correspondence between images and language. This was widely considered
                        one of the most surprising results in computer vision to date.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that zero-shot vision transfer via language was competitive with supervised baselines</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Application</div>
                    <div className="ch-tl-title">CLIP Enables DALL&#8209;E</div>
                    <div className="ch-tl-body">
                        OpenAI used CLIP&rsquo;s shared image-text embedding space to build DALL-E: a
                        Transformer that generates VQ-VAE image tokens conditioned on text prompts.
                        CLIP served a dual role in this pipeline. First, it provided the semantic
                        signal that connected generated images to their text descriptions. Second,
                        CLIP became the reranking criterion: DALL-E generated 512 candidate images
                        for each prompt, then CLIP scored each candidate by the cosine similarity
                        of the image embedding to the text embedding, and the highest-scoring image
                        was returned. CLIP was not just a model &mdash; it became the semantic
                        evaluation criterion for text-to-image generation.
                    </div>
                    <div className="ch-tl-impact">Impact: CLIP&rsquo;s embedding space became the semantic glue of the first text-to-image systems</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Extensions</div>
                    <div className="ch-tl-title">Open&#8209;CLIP, SigLIP, MetaCLIP</div>
                    <div className="ch-tl-body">
                        Open-CLIP (LAION, 2022) reproduced CLIP training on LAION-400M and LAION-5B
                        (5 billion image-text pairs from the web), releasing weights publicly and
                        enabling the research community to build on CLIP-quality representations.
                        SigLIP (Zhai et al., Google, 2023) replaced CLIP&rsquo;s softmax-normalized
                        contrastive loss with a sigmoid loss that operates on pairs rather than full
                        batches, removing the dependence on large batch sizes. MetaCLIP (2023)
                        curated the training distribution to match the statistical properties of
                        CLIP&rsquo;s original WIT data, recovering CLIP-level performance with 10&times;
                        less training data.
                    </div>
                    <div className="ch-tl-impact">Impact: Open-sourced the CLIP paradigm; enabled the research community to iterate on the training recipe</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022 &ndash; 2024</div>
                    <div className="ch-tl-section-label">Legacy</div>
                    <div className="ch-tl-title">CLIP as the Universal Vision Backbone</div>
                    <div className="ch-tl-body">
                        Every major language-multimodal model built after 2022 &mdash; LLaVA,
                        Flamingo, GPT-4V, Gemini, Claude 3 &mdash; uses a CLIP or CLIP-variant
                        vision encoder to process images before feeding them to a language model.
                        The CLIP ViT-L/14 trained on LAION-2B became the most widely deployed
                        vision backbone in the world. The learned embedding space &mdash; where
                        &ldquo;a dog running&rdquo; as text is geometrically close to a photo of a running dog
                        &mdash; became the foundation on which the entire field of multimodal AI was
                        constructed.
                    </div>
                    <div className="ch-tl-impact">Impact: CLIP ViT-L/14 is the standard vision backbone of virtually every large multimodal model</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> You do not need human-labeled image categories to
                teach a model what images mean. The internet provides 400 million natural language
                descriptions of images for free. Train two encoders to agree on which description
                matches which image, and you get a general-purpose vision-language representation
                that transfers zero-shot to tasks the model has never seen.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>How computers learned to see and read at the same time</h2>

            <Analogy label="Matching Game at Internet Scale">
                CLIP plays a matching game. Show it 400 million images, each with a caption someone
                wrote on the internet. For every batch of images and captions, it tries to match
                each image to its correct caption &mdash; and push all the wrong pairings far apart.
                After 400 million rounds of this game, it learned what images and words actually
                mean, because they now share a common language.
            </Analogy>

            <Analogy label="The Shared Map">
                After training, images and texts live on the same invisible map. If you place the
                words &ldquo;a red sunset&rdquo; on this map, and you place a photo of a red sunset on the
                same map, they land near each other. &ldquo;A dog running&rdquo; and a photo of a running dog
                are neighbors. To classify a photo, just ask: which class label is the nearest
                neighbor to this image on the map?
            </Analogy>

            <Analogy label="Zero-Shot: Testing Without Studying">
                CLIP never studied for the ImageNet exam. It never saw a single ImageNet training
                label. Yet when you show it an ImageNet image and ask which of 1000 categories it
                belongs to, it gets the right answer 76% of the time &mdash; as often as a
                model that trained on ImageNet for weeks. It&rsquo;s like an exam where you can bring a
                dictionary instead of memorizing answers: you reason from meanings, not from
                memorized examples.
            </Analogy>

            <Analogy label="Why 400 Million Pairs?">
                Almost every image on the internet has words attached to it &mdash; an alt-text
                attribute, a caption, a surrounding sentence. CLIP collected 400 million such
                (image, words) pairs without any human labeling. The internet itself was the
                training dataset. No one sat and labeled &ldquo;cat,&rdquo; &ldquo;dog,&rdquo; or &ldquo;sunset&rdquo; &mdash; the
                captions that humans naturally wrote while uploading images did that work for free.
            </Analogy>

            <Analogy label="How DALL-E Used CLIP">
                DALL-E generates images from text, but how do you know if the generated image is
                actually good? CLIP can judge: it computes how well the image matches the text
                prompt. So the system works like this &mdash; DALL-E produces hundreds of candidate
                images, and CLIP scores each one. The image with the highest score wins. CLIP is
                the judge; DALL-E is the artist.
            </Analogy>

            <Analogy label="CLIP&rsquo;s Blind Spots">
                CLIP is powerful but not perfect. It struggles with spatial relationships: &ldquo;the
                ball is to the LEFT of the cup&rdquo; &mdash; it understands &ldquo;ball&rdquo; and &ldquo;cup&rdquo; separately,
                but not their relative positions. It also cannot reliably read text that appears
                inside images. These limitations are why more complex architectures like Flamingo
                and GPT-4V were needed to go further.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of shared image&#8209;text embeddings</h2>

            <h3>Contrastive Loss (InfoNCE)</h3>
            <p>
                For a batch of N matched (image, text) pairs &#123;(I<sub>i</sub>, T<sub>i</sub>)&#125;, compute
                L2-normalized image embeddings <strong>f</strong><sub>v</sub>(I<sub>i</sub>) &isin; &#8477;<sup>d</sup> and
                text embeddings <strong>f</strong><sub>t</sub>(T<sub>i</sub>) &isin; &#8477;<sup>d</sup>. Build an
                N&times;N similarity matrix S where S<sub>ij</sub> = <strong>f</strong><sub>v</sub>(I<sub>i</sub>) &middot; <strong>f</strong><sub>t</sub>(T<sub>j</sub>) / &tau;,
                with temperature &tau; as a learned scalar. The loss treats each row and column as
                a classification problem over N classes:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{CLIP}} = -\frac{1}{2N} \sum_{i=1}^{N} \left[ \log \frac{\exp(S_{ii})}{\sum_{j=1}^{N} \exp(S_{ij})} + \log \frac{\exp(S_{ii})}{\sum_{j=1}^{N} \exp(S_{ji})} \right]" />
            <p>
                The first term is image-to-text cross-entropy (each image should retrieve its
                matching caption). The second is text-to-image cross-entropy (each caption should
                retrieve its matching image). Both directions are averaged. The N&sup2;&minus;N
                off-diagonal entries are the negative examples. Larger batch sizes N provide more
                negatives per step, which is why CLIP used batch size 32,768.
            </p>

            <h3>Zero&#8209;Shot Classification</h3>
            <p>
                Given an image I and K class descriptions &#123;c<sub>1</sub>, &hellip;, c<sub>K</sub>&#125;
                (e.g., &ldquo;a photo of a {"{classname}"}&rdquo; for each ImageNet class), compute text embeddings
                &#123;<strong>f</strong><sub>t</sub>(c<sub>k</sub>)&#125; once and cache them. At inference,
                predict the class with the highest cosine similarity to the image embedding:
            </p>
            <MathBlock tex="k^* = \operatorname*{arg\,max}_{k \in \{1,\ldots,K\}} \; \mathbf{f}_v(I) \cdot \mathbf{f}_t(c_k)" />
            <p>
                The exact wording of the class description (the &ldquo;prompt template&rdquo;) matters
                significantly. The CLIP paper Appendix shows that ensembling 80 prompt templates
                such as &ldquo;a photo of a {"{classname}"}&rdquo;, &ldquo;a blurry photo of a {"{classname}"}&rdquo;, and
                &ldquo;a sketch of a {"{classname}"}&rdquo; and averaging the resulting text embeddings improves
                ImageNet top-1 accuracy by approximately +3.5 percentage points over the plain
                &ldquo;{"{classname}"}&rdquo; template alone.
            </p>

            <h3>Encoder Architectures</h3>
            <p>
                CLIP was trained with three image encoder variants and one text encoder. The image
                encoder processes 224&times;224 images split into non-overlapping patches; the patch
                size determines the encoder variant:
            </p>
            <ul>
                <li><strong>ViT-B/32:</strong> patch 32&times;32, 7&times;7 = 49 patches, 88M parameters</li>
                <li><strong>ViT-B/16:</strong> patch 16&times;16, 14&times;14 = 196 patches, 86M parameters</li>
                <li><strong>ViT-L/14:</strong> patch 14&times;14, 16&times;16 = 256 patches, 307M parameters</li>
            </ul>
            <p>
                The text encoder is a 12-layer Transformer, 512-wide, 8 attention heads, with BPE
                tokenizer and maximum context length of 77 tokens (63M parameters). Both encoders
                project to the same output dimension d:
            </p>
            <MathBlock tex="\mathbf{f}_v \colon \mathbb{R}^{H \times W \times 3} \to \mathbb{R}^{d}, \quad \mathbf{f}_t \colon \mathbb{Z}^{\leq 77} \to \mathbb{R}^{d}, \quad d \in \{512, 768\}" />
            <p>
                At ViT-L/14 scale &mdash; the variant that became the dominant multimodal backbone
                &mdash; the image encoder has 307M parameters and the text encoder has 63M, for a
                combined model of 370M parameters producing 768-dimensional embeddings.
            </p>

            <h3>Training Scale and Data Curation</h3>
            <p>
                CLIP&rsquo;s training set WIT (WebImageText) consisted of 400M (image URL, alt-text)
                pairs collected from the internet and filtered for quality. Training used a batch
                size of 32,768 pairs per step. This batch size is critical for contrastive
                learning: each image in a batch sees N&minus;1 = 32,767 negative text examples per
                step. The number of negative pairs per batch grows quadratically:
            </p>
            <MathBlock tex="|\text{negatives per batch}| = N^2 - N = 32{,}768^2 - 32{,}768 \approx 1.07 \times 10^9" />
            <p>
                Training required approximately 256 V100 GPUs over 18 days (roughly 4,000
                GPU-days). Extrapolating to training on 32 billion pairs (as the paper notes
                would be needed for a model trained as long as JFT-3B) would have required
                approximately 10,000 GPU-years &mdash; making data curation rather than raw scale
                the key lever for improving CLIP-like models.
            </p>

            <h3>Transfer Learning Analysis</h3>
            <p>
                CLIP&rsquo;s zero-shot transfer was systematically compared against linear probe
                transfer (training a linear classifier on top of frozen CLIP features) and full
                fine-tuning across 27 datasets. The key findings:
            </p>
            <ul>
                <li>
                    <strong>In-distribution datasets</strong> (natural images similar to internet photos):
                    zero-shot &asymp; linear probe. The embedding space already captures the relevant structure.
                </li>
                <li>
                    <strong>Specialized datasets</strong> (satellite imagery, medical X-rays, traffic signs):
                    linear probe &gg; zero-shot. CLIP&rsquo;s training distribution does not represent
                    these domains, so the embeddings carry limited domain-specific information.
                </li>
                <li>
                    <strong>Few-shot performance</strong>: with only 1&ndash;4 labeled examples per class,
                    CLIP&rsquo;s zero-shot outperforms linear probe &mdash; because the few-shot linear probe
                    cannot accurately estimate the class mean from so little data.
                </li>
            </ul>
            <p>
                This analysis established an important principle: CLIP&rsquo;s zero-shot capability is
                bounded by distribution shift. Tasks well-represented in internet images transfer
                well; tasks requiring specialized visual knowledge require at least light fine-tuning.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">InfoNCE derivation &middot; temperature analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">HuggingFace CLIP &middot; zero-shot classification</span>
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
            <h2>InfoNCE loss and the temperature parameter</h2>

            <DefBlock label="InfoNCE as Mutual Information Maximization">
                The InfoNCE loss is a lower bound on the mutual information I(X; Y) between the
                image random variable X and text random variable Y. Given a batch of N matched
                pairs and N&sup2;&minus;N unmatched pairs as negatives, InfoNCE estimates:
            </DefBlock>
            <MathBlock tex="\mathcal{L}_{\text{InfoNCE}} = -\mathbb{E}\left[\log \frac{\exp(\mathbf{f}_v(x) \cdot \mathbf{f}_t(y) / \tau)}{\frac{1}{N}\sum_{j=1}^{N} \exp(\mathbf{f}_v(x) \cdot \mathbf{f}_t(y_j) / \tau)}\right]" />
            <p>
                This is equivalent to the cross-entropy loss of a softmax classifier over N
                classes where the &ldquo;correct&rdquo; class is the matched pair. As N &rarr; &infin; this
                lower bound on mutual information becomes tight. The contrastive objective is
                therefore directly maximizing the statistical dependence between the image
                and text representations.
            </p>

            <h3>Role of Temperature &tau;</h3>
            <p>
                The temperature &tau; is a learned scalar (initialized to 1/0.07 &asymp; 14.3 in the
                CLIP paper). It controls the concentration of the embedding space:
            </p>
            <MathBlock tex="S_{ij} = \frac{\mathbf{f}_v(I_i) \cdot \mathbf{f}_t(T_j)}{\tau}" />
            <ul>
                <li>
                    <strong>Small &tau; (sharp distribution):</strong> The softmax over similarities
                    becomes nearly one-hot. The loss focuses intensely on the hardest negatives (the
                    pairs with highest off-diagonal similarity). This encourages the model to produce
                    very concentrated, discriminative embeddings, but can cause training instability
                    if similar images and captions from different pairs are penalized too harshly.
                </li>
                <li>
                    <strong>Large &tau; (uniform distribution):</strong> The softmax is spread across all
                    negatives evenly. The model sees no strong gradient signal from hard negatives,
                    leading to poorly separated representations. Training becomes too easy and the
                    learned space lacks fine-grained discrimination.
                </li>
            </ul>
            <p>
                The optimal &tau; is learned jointly with the encoder parameters. CLIP clamps
                &tau; &ge; 0.01 to prevent numerical instability. In practice, &tau; converges
                to approximately 0.07 for the best-performing CLIP models.
            </p>

            <h3>Gradient Analysis</h3>
            <p>
                The gradient of the image-to-text loss with respect to the image embedding
                <strong>f</strong><sub>v</sub>(I<sub>i</sub>) reveals which negatives drive learning:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}}{\partial \mathbf{f}_v(I_i)} = \frac{1}{\tau} \left( \sum_{j \neq i} p_{ij} \cdot \mathbf{f}_t(T_j) - \mathbf{f}_t(T_i) \right)" />
            <p>
                where p<sub>ij</sub> = softmax(S<sub>i</sub>)<sub>j</sub> is the probability assigned to the
                j-th text. The gradient pulls <strong>f</strong><sub>v</sub>(I<sub>i</sub>) toward the
                matched text embedding <strong>f</strong><sub>t</sub>(T<sub>i</sub>) and pushes it away
                from all non-matched text embeddings, weighted by how confusable they currently are.
                Hard negatives (large p<sub>ij</sub> for j &ne; i) dominate the gradient, which is
                why large batch sizes that provide diverse hard negatives improve training quality.
            </p>

            <div className="ch-callout">
                <strong>Why this works:</strong> The InfoNCE objective forces the two encoders into
                a shared geometry where image-text co-occurrence on the internet &mdash; a weak
                supervisory signal &mdash; is sufficient to learn semantically meaningful
                representations. Each caption is a free-form description of an image&rsquo;s content,
                so alignment pressure on 400M such pairs teaches the model everything from object
                categories to scene types to abstract concepts.
            </div>
        </>
    )
}

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn.functional as F
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# ── Load model and processor ──────────────────────────────────────────────────
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

# ── Zero-shot ImageNet-style classification ───────────────────────────────────
# Define candidate classes and prompt template
class_names = ["cat", "dog", "airplane", "car", "ship"]
prompt_template = "a photo of a {}"
texts = [prompt_template.format(c) for c in class_names]

# Load and preprocess image (replace with your image path)
image = Image.open("example.jpg").convert("RGB")

inputs = processor(
    text=texts,
    images=image,
    return_tensors="pt",
    padding=True,
)

# ── Forward pass ──────────────────────────────────────────────────────────────
with torch.no_grad():
    outputs = model(**inputs)

# Image and text embeddings (already L2-normalized by CLIP)
image_embeds = outputs.image_embeds          # shape: (1, 512)
text_embeds  = outputs.text_embeds           # shape: (num_classes, 512)

# Cosine similarity (CLIP uses logit_scale = exp(log_scale) ≈ 100)
logit_scale = model.logit_scale.exp()        # learned temperature scalar
logits = logit_scale * image_embeds @ text_embeds.T   # shape: (1, num_classes)

# Zero-shot prediction
probs = F.softmax(logits, dim=-1).squeeze()
predicted_class = class_names[probs.argmax().item()]

print("Class probabilities:")
for name, prob in zip(class_names, probs.tolist()):
    print(f"  {name:<12} {prob:.4f}")
print(f"Predicted: {predicted_class}")

# ── Manual contrastive similarity (without logit_scale) ──────────────────────
cos_sim = (image_embeds @ text_embeds.T).squeeze()  # raw cosine similarities

print("\\nRaw cosine similarities:")
for name, sim in zip(class_names, cos_sim.tolist()):
    print(f"  {name:<12} {sim:.4f}")

# ── Encode a batch of images and texts ───────────────────────────────────────
# Useful for building an image retrieval index
images = [Image.open(f"img_{i}.jpg").convert("RGB") for i in range(4)]
captions = [
    "a red sunset over the ocean",
    "a dog playing in the snow",
    "a crowded city street at night",
    "a bowl of fresh fruit",
]

batch_inputs = processor(
    text=captions, images=images, return_tensors="pt", padding=True
)

with torch.no_grad():
    batch_outputs = model(**batch_inputs)

img_emb = F.normalize(batch_outputs.image_embeds, dim=-1)  # (4, 512)
txt_emb = F.normalize(batch_outputs.text_embeds,  dim=-1)  # (4, 512)

# N x N similarity matrix — diagonal should be highest for correct pairs
sim_matrix = img_emb @ txt_emb.T
print("\\nSimilarity matrix (images x captions):")
print(sim_matrix.numpy().round(3))
`

function PythonContent() {
    return (
        <>
            <p>
                Loading a pretrained CLIP model with HuggingFace Transformers, encoding images and
                texts into the shared embedding space, and performing zero-shot classification by
                comparing image embeddings to prompt-formatted class name embeddings.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="clip_zero_shot.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const CLIP_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
