import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# ── Patch Embedding Module ─────────────────────────────────────────────────────

class PatchEmbedding(nn.Module):
    """
    Splits an image into non-overlapping patches and linearly projects each.

    Key insight: a Conv2d with kernel_size=P and stride=P is mathematically
    identical to flattening each PxP patch and multiplying by a weight matrix.
    The Conv2d implementation is preferred for GPU efficiency.

    Input:  (B, C, H, W)
    Output: (B, N, D)  where N = (H/P) * (W/P)
    """
    def __init__(self, img_size=224, patch_size=16, in_chans=3, embed_dim=768):
        super().__init__()
        assert img_size % patch_size == 0, "Image size must be divisible by patch size"

        self.img_size   = img_size
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2  # N = (H/P)*(W/P)

        # This Conv2d IS the linear projection E in R^(P^2*C x D)
        # kernel_size=P, stride=P => no overlap, one output pixel per patch
        self.proj = nn.Conv2d(
            in_chans, embed_dim,
            kernel_size=patch_size,
            stride=patch_size,
            bias=True,
        )

        self._init_weights()

    def _init_weights(self):
        # Fan-out initialisation (common for ViT patch projection)
        fan_in = self.proj.in_channels * self.proj.kernel_size[0] ** 2
        nn.init.trunc_normal_(self.proj.weight, std=math.sqrt(2.0 / fan_in))
        nn.init.zeros_(self.proj.bias)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # (B, C, H, W) -> (B, D, H/P, W/P)
        x = self.proj(x)
        # (B, D, H/P, W/P) -> (B, D, N) -> (B, N, D)
        x = x.flatten(2).transpose(1, 2)
        return x


# ── Full input assembly (patches + CLS + positional embeddings) ─────────────

class ViTInputAssembly(nn.Module):
    """
    Assembles the full token sequence fed into the Transformer encoder:
        z_0 = [x_cls ; z_1 E ; z_2 E ; ... ; z_N E] + E_pos

    where E is the patch embedding projection (inside PatchEmbedding),
    and E_pos are learned 1D positional embeddings of shape (N+1, D).
    """
    def __init__(self, img_size=224, patch_size=16, in_chans=3, embed_dim=768, dropout=0.1):
        super().__init__()

        self.patch_embed = PatchEmbedding(img_size, patch_size, in_chans, embed_dim)
        num_patches = self.patch_embed.num_patches

        # [CLS] token: learnable, shape (1, 1, D) -> broadcast over batch
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))

        # Positional embeddings: one per patch + one for [CLS], shape (1, N+1, D)
        self.pos_embed = nn.Parameter(torch.zeros(1, num_patches + 1, embed_dim))

        self.pos_drop = nn.Dropout(dropout)

        # Initialise with small Gaussian (ViT paper uses std=0.02)
        nn.init.trunc_normal_(self.cls_token, std=0.02)
        nn.init.trunc_normal_(self.pos_embed, std=0.02)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B = x.shape[0]

        # Step 1: embed patches  (B, N, D)
        patches = self.patch_embed(x)

        # Step 2: expand and prepend [CLS] token  -> (B, N+1, D)
        cls_tokens = self.cls_token.expand(B, -1, -1)
        tokens = torch.cat([cls_tokens, patches], dim=1)

        # Step 3: add positional embeddings element-wise  (B, N+1, D)
        tokens = tokens + self.pos_embed
        tokens = self.pos_drop(tokens)

        return tokens   # ready for Transformer encoder


# ── Positional embedding interpolation for higher-resolution fine-tuning ──────

def interpolate_pos_embed(
    pos_embed: torch.Tensor,
    new_num_patches: int,
) -> torch.Tensor:
    """
    When fine-tuning at a higher image resolution the sequence length increases.
    The pretrained 1D positional embeddings must be bilinearly interpolated to
    match the new grid size.

    pos_embed: (1, N_old+1, D)  — pretrained embeddings
    new_num_patches: int        — new N = (H_new/P) * (W_new/P)
    returns:   (1, N_new+1, D)
    """
    cls_embed, patch_embed = pos_embed[:, :1, :], pos_embed[:, 1:, :]

    old_n    = patch_embed.shape[1]               # e.g. 196
    old_grid = int(math.sqrt(old_n))              # e.g. 14
    new_grid = int(math.sqrt(new_num_patches))    # e.g. 16 for 256x256 images
    D        = patch_embed.shape[-1]

    # Reshape to 2-D spatial grid for F.interpolate
    patch_embed = patch_embed.reshape(1, old_grid, old_grid, D).permute(0, 3, 1, 2)
    # (1, D, old_grid, old_grid) -> (1, D, new_grid, new_grid)
    patch_embed = F.interpolate(
        patch_embed,
        size=(new_grid, new_grid),
        mode="bilinear",
        align_corners=False,
    )
    # Back to (1, new_n, D)
    patch_embed = patch_embed.permute(0, 2, 3, 1).reshape(1, -1, D)

    return torch.cat([cls_embed, patch_embed], dim=1)


# ── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    batch_size = 2
    img_size   = 224
    patch_size = 16
    embed_dim  = 768

    assembler = ViTInputAssembly(
        img_size=img_size,
        patch_size=patch_size,
        embed_dim=embed_dim,
    )

    images = torch.randn(batch_size, 3, img_size, img_size)
    tokens = assembler(images)

    N = (img_size // patch_size) ** 2
    print(f"Image shape:   {images.shape}")          # (2, 3, 224, 224)
    print(f"Num patches:   {N}")                     # 196
    print(f"Token seq:     {tokens.shape}")          # (2, 197, 768)  [CLS + 196 patches]
    print(f"CLS token:     {tokens[:, 0, :].shape}") # (2, 768)
    print(f"Patch tokens:  {tokens[:, 1:, :].shape}")# (2, 196, 768)

    # Demonstrate position interpolation for 256x256 input
    new_n   = (256 // patch_size) ** 2              # 256
    new_pos = interpolate_pos_embed(assembler.pos_embed, new_n)
    print(f"Old pos embed: {assembler.pos_embed.shape}")  # (1, 197, 768)
    print(f"New pos embed: {new_pos.shape}")              # (1, 257, 768)
`

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <p>
                Once Dosovitskiy et al. decided to apply a standard Transformer to images, the first
                engineering question was deceptively simple: how do you turn an image into a sequence
                of tokens? Natural language has words; images have pixels. The answer they settled on
                &mdash; divide the image into fixed-size rectangular patches and treat each patch as a
                token &mdash; seems obvious in hindsight. But it required navigating real design
                choices about patch size, projection dimensionality, positional encoding strategy, and
                an extra learnable token for classification. Each of those choices has a history.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1986</div>
                    <div className="ch-tl-section-label">Precursor</div>
                    <div className="ch-tl-title">Convolutional Filters as Implicit Local Feature Extractors</div>
                    <div className="ch-tl-body">
                        LeCun's early work on convolutional networks (1986&ndash;1989, culminating in
                        LeNet-5 in 1998) showed that images could be processed by sliding a small
                        kernel across the spatial grid, producing local feature responses. This was
                        the dominant paradigm for turning images into useful representations for three
                        decades.
                        <br /><br />
                        Crucially, convolutions always operated <em>implicitly</em>. They produced
                        feature maps &mdash; tensors of shape (H&prime;&times;W&prime;&times;C) &mdash; not
                        explicit sequences of tokens. The idea of extracting a patch from a specific
                        spatial location, flattening it into a vector, and treating it as a discrete
                        "word" was never articulated in the convolutional framework. The shift from
                        feature maps to token sequences was the conceptual leap that patch embeddings
                        eventually made.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Established local feature extraction as the default image processing primitive, but without the token abstraction that would later enable Transformers.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2015&ndash;2019</div>
                    <div className="ch-tl-section-label">Dead End</div>
                    <div className="ch-tl-title">Pixel-Level Sequence Models: PixelRNN and PixelCNN</div>
                    <div className="ch-tl-body">
                        WaveNet (van den Oord et al., 2016) demonstrated that raw audio waveforms
                        could be modeled autoregressively as a 1-D sequence. Researchers asked
                        whether images could be treated the same way. PixelRNN and PixelCNN
                        (van den Oord et al., 2016) scanned images pixel-by-pixel, left-to-right
                        and top-to-bottom, generating each pixel conditioned on all previous ones.
                        <br /><br />
                        The results were impressive for image generation, but the sequence length was
                        catastrophic for self-attention: a 256&times;256 image produces 65,536
                        tokens. Self-attention has O(N&sup2;) complexity in sequence length, so
                        applying a Transformer to pixel sequences at this scale required roughly
                        4.3&nbsp;billion attention computations per layer &mdash; completely
                        infeasible. Pixel-level models remained confined to small images or
                        required tricks like local attention windows. The core lesson: pixels are
                        not the right unit of tokenization for Transformers.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Proved the pixel-as-token approach was computationally dead on arrival at realistic image resolutions; motivated the search for coarser tokenization units.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">First Patch Idea</div>
                    <div className="ch-tl-title">Image Transformer &mdash; Parmar et al. Argue for Patch Sequences</div>
                    <div className="ch-tl-body">
                        Parmar et al. (2018&ndash;2019) published the Image Transformer, the first
                        paper to explicitly argue that images should be processed as sequences of
                        patches rather than sequences of pixels. They used 2&times;2 pixel patches
                        with local self-attention windows, dramatically reducing the effective
                        sequence length compared to PixelRNN.
                        <br /><br />
                        The Image Transformer was primarily a generative model and its patches were
                        very small: a 2&times;2 patch contains only 12 raw pixel values (4 pixels
                        &times; 3 channels). These micro-patches were not individually semantically
                        meaningful &mdash; you cannot identify any object from a 2&times;2 block.
                        Parmar's work also used local attention only, preserving a convolutional
                        inductive bias. The insight that patches should be large enough to carry
                        semantic content, and that global (not local) attention should be applied,
                        came later.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: First explicit use of patches as Transformer tokens; proved the sequence length could be tamed, but did not yet achieve the full global-attention ViT architecture.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">The Design Decision</div>
                    <div className="ch-tl-title">ViT &mdash; The 16&times;16 Sweet Spot</div>
                    <div className="ch-tl-body">
                        Dosovitskiy et al. at Google Brain ran an extensive ablation over patch
                        sizes. For a 224&times;224 image: a 32&times;32 patch grid gives only
                        49 tokens (too few; the model lacks enough positional resolution to
                        distinguish fine spatial structure). An 8&times;8 patch grid gives
                        784 tokens (computation becomes expensive and the patches contain too
                        little context to be individually meaningful). A 16&times;16 patch gives
                        exactly 196 tokens &mdash; small enough for efficient Transformer
                        computation, large enough that each patch contains a recognizable fragment
                        of image content.
                        <br /><br />
                        The choice was also validated empirically: ViT-L/16 significantly
                        outperformed ViT-L/32 on ImageNet when pre-trained on JFT-300M, showing
                        that the finer spatial resolution of 16&times;16 patches captured important
                        information that 32&times;32 patches lost. The 16&times;16 decision became
                        the canonical default for the entire ViT family.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Established 16&times;16 patches as the standard ViT tokenization unit; the 196-token sequence length became a design anchor for downstream work.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Linear Projection</div>
                    <div className="ch-tl-title">The Patch Embedding Layer &mdash; A Convolution in Disguise</div>
                    <div className="ch-tl-body">
                        The ViT paper described the patch embedding as: flatten each
                        16&times;16&times;3 patch into a vector of 768 raw pixel values, then
                        multiply by a learned weight matrix E &isin; &#8477;<sup>768&times;D</sup>.
                        This is a simple linear projection with no nonlinearity.
                        <br /><br />
                        What the paper noted in passing &mdash; and what later implementations
                        made central &mdash; is that this linear projection is exactly equivalent
                        to a 2-D convolution with kernel size 16, stride 16, and D output channels.
                        A Conv2d(3, D, kernel_size=16, stride=16) applied to the full image
                        produces the same tensor as manually slicing, flattening, and projecting
                        every patch. This equivalence is why virtually every production ViT
                        implementation uses Conv2d internally for the patch projection: it is
                        faster on GPU due to optimized memory layout. The conceptual framing, however,
                        remained "tokens" rather than "feature maps" &mdash; a subtle but consequential
                        mental shift that unified vision with the NLP Transformer vocabulary.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Bridged the convolutional and attention paradigms; the Conv2d-as-patch-embedder trick is now universal in ViT implementations.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Positional Encoding</div>
                    <div className="ch-tl-title">1-D Learned Embeddings Surprisingly Beat 2-D Sinusoidal</div>
                    <div className="ch-tl-body">
                        Without positional encodings a Transformer is permutation-invariant:
                        shuffling the 196 patch tokens produces identical outputs. Dosovitskiy
                        et al. tested three strategies: (1) no positional encoding, (2) 1-D
                        learned embeddings (one vector per position, 0 to N, trained from
                        scratch), (3) 2-D sinusoidal encodings that explicitly encode row and
                        column coordinates, and (4) relative position encodings.
                        <br /><br />
                        The surprising result: all three learned variants performed nearly
                        identically on ImageNet. The 2-D structure that seemed like it should
                        be important was apparently learnable from 1-D encodings alone, because
                        the model could infer 2-D relationships from the statistical patterns of
                        co-occurring patches. However, one positional encoding detail mattered
                        greatly: when fine-tuning ViT on higher-resolution images (e.g., from
                        224&times;224 to 384&times;384), the number of patches increases from
                        196 to 576. The pretrained 1-D embeddings for positions 0&ndash;196
                        cannot simply be extended to 0&ndash;576. Instead, Dosovitskiy et al.
                        showed that bilinear interpolation of the pretrained embeddings on the
                        2-D grid recovers most of the pretrained position information and
                        enables fast fine-tuning at higher resolutions.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Simplified ViT implementation (no need for complex 2-D encodings); interpolation trick became standard practice for resolution transfer learning.
                    </div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021&ndash;2023</div>
                    <div className="ch-tl-section-label">Evolution</div>
                    <div className="ch-tl-title">Masking, Windows, Distillation, and Flexible Patches</div>
                    <div className="ch-tl-body">
                        Subsequent work pushed the patch embedding idea in several directions.
                        DeiT (Touvron et al., 2021) added a <em>distillation token</em> alongside
                        the [CLS] token, allowing the ViT to learn from a CNN teacher. MAE
                        (He et al., 2022) showed that masking 75% of patches at training time
                        and asking the model to reconstruct the hidden patches is a highly
                        effective self-supervised objective; the high masking ratio forces the
                        model to develop strong contextual reasoning about each patch's content.
                        <br /><br />
                        Swin Transformer (Liu et al., 2021) returned to the idea of local
                        attention, processing patches only within non-overlapping windows of
                        7&times;7 patches, with shifted windows between layers to allow
                        cross-window information flow. This gave O(N) rather than O(N&sup2;)
                        complexity and was better for dense prediction tasks. FlexViT (Beyer
                        et al., 2022) trained a single model with variable patch sizes
                        simultaneously, showing that one model can serve multiple
                        speed-accuracy operating points by adjusting the patch size at
                        inference time.
                    </div>
                    <div className="ch-tl-impact">
                        Impact: Patch embeddings became a modular design space; masking, window attention, and variable-size patches each addressed different practical limitations of the original ViT design.
                    </div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The big picture:</strong> Patch embeddings are the bridge that allowed a
                decade of Transformer research in NLP to transfer directly to vision. The choice
                of patch size, projection dimension, and positional encoding strategy collectively
                define the "vocabulary" of a Vision Transformer. Getting that vocabulary right
                &mdash; neither too fine-grained nor too coarse &mdash; was the key engineering
                insight of the ViT paper, and it opened the door to unified vision&ndash;language
                architectures that now underpin virtually all large multimodal AI systems.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Turning a Photo into Words the Computer Can Read</h2>

            <Analogy label="Breaking a Photo into Puzzle Pieces">
                Imagine you have a big photograph that is 224 pixels wide and 224 pixels
                tall. Now imagine you take a pair of scissors and cut it into small squares,
                each one exactly 16 pixels wide and 16 pixels tall.
                <br /><br />
                How many squares do you get? 224 &divide; 16 = 14 columns, and 14 rows, so
                14 &times; 14 = 196 little tiles. Each tile is one "word" that the Vision
                Transformer will read &mdash; just like a sentence has many words, your photo
                now has 196 tile-words. The computer reads them one by one and figures out
                what the photo shows.
            </Analogy>

            <Analogy label="The Translator Between Images and Language">
                Each tile is just a grid of coloured pixels &mdash; a flat list of 768
                numbers (16 &times; 16 pixels, each with a red, green, and blue value).
                Those 768 numbers describe colour, not meaning.
                <br /><br />
                The patch embedding layer is a <em>translator</em>. It takes those 768
                colour numbers and multiplies them by a big table of weights it learned
                during training, producing a shorter, smarter list of numbers &mdash; say,
                768 "meaning" numbers (the embedding vector). That new vector speaks the
                same language as a word embedding in a text Transformer. The machine now
                sees each image tile the same way it would see a word like "dog" or "sky".
            </Analogy>

            <Analogy label="The Dummy Passenger Seat">
                Imagine a school bus where 196 students (the image tiles) sit in their
                seats. But there is one extra special seat at the very front &mdash; seat
                number zero &mdash; and no real tile sits there. Instead, a blank dummy
                passenger sits there with an empty notepad.
                <br /><br />
                As the bus drives (as the Transformer runs layer after layer), every
                student can pass notes to every other student, including the dummy at the
                front. By the time the bus arrives, the dummy's notepad is filled with
                summaries from all 196 students. The teacher (the classification head)
                only reads the dummy's notepad to decide what the photo shows. This special
                seat is called the <strong>[CLS] token</strong> &mdash; short for "class
                token" &mdash; and it is what the model uses to make its final prediction.
            </Analogy>

            <Analogy label="How Does It Know Where Things Are?">
                Here is a tricky problem: if you mix up all 196 tiles and hand them to the
                Transformer in random order, it cannot tell which tile came from the
                top-left corner and which came from the bottom-right. To the Transformer,
                an unordered bag of tiles looks the same no matter what.
                <br /><br />
                The fix is <strong>positional embeddings</strong>: before reading the tiles,
                the computer adds a small, unique "sticker number" to each tile's meaning
                vector. Tile 0 gets sticker 0, tile 1 gets sticker 1, and so on up to
                tile 195. Now the Transformer can always tell where each tile came from
                in the original photo. It learns what each sticker means during training,
                the same way you learn which shelf number in a library holds which book.
            </Analogy>

            <Analogy label="Why 16&times;16 and Not Smaller?">
                What if you used 2&times;2 tiles instead? A 224&times;224 photo would give
                you 112 &times; 112 = 12,544 tiny tiles. Self-attention has to compare every
                tile to every other tile &mdash; that is 12,544 &times; 12,544 &approx; 157
                million comparisons per layer. Way too slow.
                <br /><br />
                What if you used 64&times;64 tiles? You only get (224 &divide; 64)&sup2; &asymp;
                12 tiles. So few tiles that the model can barely describe where things are
                in the image &mdash; it loses all the fine detail.
                <br /><br />
                16&times;16 is the Goldilocks size: 196 tiles, each large enough to show a
                recognizable piece of an object (an eye, a wheel, a patch of sky), and
                small enough that the Transformer can handle all of them without overheating.
            </Analogy>

            <Analogy label="Masking for Learning (MAE)">
                Once researchers had the patch idea, they asked: what is the best way to
                teach a model using unlabelled photos? Their answer was brilliant in its
                simplicity. Before showing the model a photo, randomly hide 75 out of every
                100 tiles by covering them with grey boxes. Show the remaining 25 tiles to
                the model and ask: can you draw what was hidden?
                <br /><br />
                This is like handing someone only a quarter of a jigsaw puzzle and asking
                them to draw the missing three-quarters. To succeed, the model must deeply
                understand textures, shapes, and the relationship between different parts of
                an image. This technique &mdash; called Masked Autoencoder (MAE) training
                &mdash; turned out to be one of the most powerful ways to pretrain Vision
                Transformers without needing any labels at all.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>Position Embedding Interpolation: Formal Derivation</h3>
            <p>
                When ViT is fine-tuned at resolution H&prime;&times;W&prime; instead of the
                pretrained H&times;W, the number of patches changes from
                N&nbsp;=&nbsp;HW/P&sup2; to N&prime;&nbsp;=&nbsp;H&prime;W&prime;/P&sup2;.
                The pretrained positional embedding matrix
                E<sub>pos</sub>&nbsp;&isin;&nbsp;&#8477;<sup>(N+1)&times;D</sup> must be
                adapted. Removing the [CLS] row, the patch rows form an (N&times;D) matrix
                which can be reshaped into a (&#8730;N &times; &#8730;N &times; D) spatial
                grid.
            </p>
            <MathBlock tex="\hat{E}^{(i,j)}_{pos} = \text{BilinearInterp}\!\left(E_{pos}^{patch},\; \frac{i \cdot (\sqrt{N}-1)}{\sqrt{N'}-1},\; \frac{j \cdot (\sqrt{N}-1)}{\sqrt{N'}-1}\right)" />
            <p>
                The bilinear interpolation samples the old grid at fractional coordinates
                proportional to the ratio of grid sizes. After interpolation the result is
                reshaped back to (N&prime;&times;D) and the [CLS] row is prepended unchanged.
                This procedure preserves the relative geometry of the pretrained position
                encodings while extending them to more positions.
            </p>

            <h3>What Do Learned Position Embeddings Encode?</h3>
            <p>
                Dosovitskiy et al. visualized the cosine similarity between every pair of
                learned positional embedding vectors. The resulting N&times;N similarity
                matrix reveals a clear 2-D spatial structure even though the embeddings
                are nominally 1-D: patches that are nearby in the image have high cosine
                similarity, and the similarity decays with spatial distance. The matrix
                also exhibits horizontal and vertical striping corresponding to the row and
                column structure of the patch grid.
            </p>
            <MathBlock tex="\text{sim}(i,j) = \frac{E_{pos}^{(i)} \cdot E_{pos}^{(j)}}{\|E_{pos}^{(i)}\|\,\|E_{pos}^{(j)}\|}" />
            <p>
                This self-organization into a spatial structure emerges purely from
                training on image classification, without any explicit 2-D inductive bias
                in the positional embedding definition. It explains why 1-D learned
                embeddings match the performance of explicitly 2-D sinusoidal encodings:
                the model discovers 2-D structure on its own.
            </p>

            <h3>Patch Embedding as a Rank Constraint</h3>
            <p>
                The patch embedding matrix E&nbsp;&isin;&nbsp;&#8477;<sup>P&sup2;C&times;D</sup>
                where D&nbsp;&lt;&nbsp;P&sup2;C (e.g., 768&nbsp;&lt;&nbsp;768 for P=16 is
                equal, but for P=32 we have P&sup2;C&nbsp;=&nbsp;3072 while D&nbsp;=&nbsp;768).
                The projection compresses each patch into a lower-dimensional space, acting
                as a learned dimensionality reduction. Unlike PCA (which minimizes
                reconstruction error), the patch embedding is trained end-to-end and
                therefore learns to preserve dimensions that are discriminative for the
                downstream task, not dimensions with highest variance.
            </p>
            <MathBlock tex="\text{rank}(E) \leq \min(P^2 C,\; D)" />
            <p>
                In practice D is chosen equal to P&sup2;C for P=16 (both equal 768 for
                ViT-Base), so the projection is square and can theoretically be full rank.
                Larger models use D&nbsp;=&nbsp;1024 (ViT-Large) or D&nbsp;=&nbsp;1280
                (ViT-Huge), which are wider than P&sup2;C=768 for P=16, effectively
                projecting into a higher-dimensional embedding space.
            </p>
        </>
    )
}

function PythonContent() {
    return (
        <>
            <p>
                The code below implements a standalone <code>PatchEmbedding</code> module
                using Conv2d (the efficient GPU-friendly formulation), a full
                <code>ViTInputAssembly</code> that prepends the [CLS] token and adds
                positional embeddings, and a utility for bilinear positional embedding
                interpolation used during higher-resolution fine-tuning.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="patch_embedding.py"
                lang="python"
                langLabel="Python"
            />
            <div className="ch-callout">
                <strong>Key equivalence:</strong> <code>nn.Conv2d(C, D, kernel_size=P, stride=P)</code>
                is mathematically identical to flattening each P&times;P patch and multiplying by
                E&nbsp;&isin;&nbsp;&#8477;<sup>P&sup2;C&times;D</sup>, but runs faster on GPU
                because Conv2d benefits from highly optimized CUDA kernels and cache-friendly
                memory access patterns.
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Patch Embeddings: Images as Token Sequences</h2>
            <p>
                The central challenge of applying a Transformer to images is bridging two
                incompatible representations: images are 2-D grids of pixel values, while
                Transformers expect 1-D sequences of fixed-dimensional vectors. Patch
                embeddings solve this with a pipeline of four operations: spatial splitting,
                linear projection, class token insertion, and positional encoding.
            </p>

            <h3>1. Patch Splitting</h3>
            <p>
                Given an image x&nbsp;&isin;&nbsp;&#8477;<sup>H&times;W&times;C</sup> with height H,
                width W, and C colour channels, choose a patch size P. The image is partitioned
                into non-overlapping P&times;P patches on a regular grid. The total number of
                patches is:
            </p>
            <MathBlock tex="N = \frac{H \cdot W}{P^2}" />
            <p>
                Each patch x<sub>p</sub>&nbsp;&isin;&nbsp;&#8477;<sup>P&times;P&times;C</sup>
                is flattened into a 1-D vector of length P&sup2;C. For the canonical ViT-B/16
                configuration (H=W=224, P=16, C=3): N&nbsp;=&nbsp;224&sup2;/256&nbsp;=&nbsp;196
                patches, each with P&sup2;C&nbsp;=&nbsp;768 values.
            </p>
            <MathBlock tex="\mathbf{x}_p^{\text{flat}} \in \mathbb{R}^{P^2 C}, \quad p = 1, \ldots, N" />

            <hr className="ch-sep" />

            <h3>2. Linear Projection (Patch Embedding Layer)</h3>
            <p>
                Each flattened patch is projected into a D-dimensional embedding space
                via a learned weight matrix E&nbsp;&isin;&nbsp;&#8477;<sup>P&sup2;C&times;D</sup>:
            </p>
            <MathBlock tex="\mathbf{z}_p = \mathbf{x}_p^{\text{flat}} \cdot E \in \mathbb{R}^D" />
            <p>
                This is a simple linear transformation with no nonlinearity. Its role is
                analogous to a word embedding lookup in NLP: it converts raw input (pixels)
                into a dense vector that lives in the same space as all other token
                representations in the model.
            </p>
            <DefBlock label="Equivalence to Convolution">
                The linear projection on flattened patches with stride P is algebraically
                identical to a 2-D convolution with kernel size P, stride P, and D output
                channels: Conv2d(C, D, kernel_size=P, stride=P). Applying this convolution
                to the full image produces a (D&times;H/P&times;W/P) output tensor, which
                when flattened and transposed is exactly the (N&times;D) matrix of patch
                embeddings. Production ViT code uses Conv2d for GPU efficiency.
            </DefBlock>

            <hr className="ch-sep" />

            <h3>3. [CLS] Token and Full Input Assembly</h3>
            <p>
                Borrowing from BERT, a learnable class token x<sub>class</sub>&nbsp;&isin;&nbsp;&#8477;<sup>D</sup>
                is prepended to the sequence of N patch embeddings. This produces a sequence of
                length N+1. Learned 1-D positional embeddings
                E<sub>pos</sub>&nbsp;&isin;&nbsp;&#8477;<sup>(N+1)&times;D</sup>
                are then added element-wise. The full input to the Transformer encoder is:
            </p>
            <MathBlock tex="\mathbf{z}_0 = \bigl[\mathbf{x}_{class};\; \mathbf{z}_1;\; \mathbf{z}_2;\; \ldots;\; \mathbf{z}_N\bigr] + E_{pos} \in \mathbb{R}^{(N+1) \times D}" />
            <p>
                The [CLS] token starts as a learned parameter with no image content. After
                L Transformer encoder layers, its final state z<sub>L</sub><sup>0</sup>&nbsp;&isin;&nbsp;&#8477;<sup>D</sup>
                aggregates global image information through self-attention and is fed to the
                classification head. For dense prediction tasks (segmentation, detection),
                all N patch tokens z<sub>L</sub><sup>1</sup>&nbsp;&hellip;&nbsp;z<sub>L</sub><sup>N</sup>
                are typically used instead.
            </p>

            <hr className="ch-sep" />

            <h3>4. Positional Embedding Variants</h3>
            <p>
                A Transformer with no positional encoding is permutation-invariant: the output
                does not depend on the order of input tokens. For images this would mean
                a shuffled bag of patches produces the same representation as the original
                image. Several positional encoding strategies have been studied:
            </p>
            <ul>
                <li>
                    <strong>1-D Learned (ViT baseline):</strong> A trainable vector e<sub>i</sub>&nbsp;&isin;&nbsp;&#8477;<sup>D</sup>
                    for each position i&nbsp;&isin;&nbsp;&#123;0,&nbsp;&hellip;,&nbsp;N&#125;.
                    Simple, flexible, and empirically as good as 2-D alternatives.
                </li>
                <li>
                    <strong>2-D Sinusoidal:</strong> Separate sinusoidal encodings for row
                    and column coordinates, concatenated or summed. Encodes 2-D structure
                    explicitly but yields no accuracy improvement over 1-D learned in practice.
                </li>
                <li>
                    <strong>Relative Position Bias (Swin):</strong> Instead of adding absolute
                    position to each token, a learnable bias is added to each attention logit
                    based on the relative row/column offset between two tokens:
                </li>
            </ul>
            <MathBlock tex="\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{D_k}} + B\right)V" />
            <p>
                where B&nbsp;&isin;&nbsp;&#8477;<sup>N&times;N</sup> is a learned bias matrix
                indexed by relative position. When fine-tuning at higher resolutions, 1-D
                learned positional embeddings are bilinearly interpolated on the 2-D patch
                grid (see Deep Dive below).
            </p>

            <hr className="ch-sep" />

            <h3>5. The Patch Embedding IS a Convolution</h3>
            <p>
                The mathematical equivalence between patch embedding and convolution can be
                stated precisely. Let X&nbsp;&isin;&nbsp;&#8477;<sup>C&times;H&times;W</sup>
                be the image (channel-first). Define a Conv2d layer with weight tensor
                W<sub>conv</sub>&nbsp;&isin;&nbsp;&#8477;<sup>D&times;C&times;P&times;P</sup>,
                kernel size P, and stride P. Its output on input X is:
            </p>
            <MathBlock tex="\text{Conv}(X)_{d,\,i,\,j} = \sum_{c=1}^{C}\sum_{r=0}^{P-1}\sum_{s=0}^{P-1} W_{conv}^{(d,c,r,s)} \cdot X_{c,\;iP+r,\;jP+s}" />
            <p>
                Now define the patch embedding matrix E&nbsp;&isin;&nbsp;&#8477;<sup>P&sup2;C&times;D</sup>
                by reshaping W<sub>conv</sub>: column d of E is the flattened kernel for output
                channel d. Then for patch p at grid position (i,j):
            </p>
            <MathBlock tex="\mathbf{x}_p^{\text{flat}} \cdot E = \text{vec}\!\left(X_{:,\,iP:iP+P,\,jP:jP+P}\right)^\top E = \text{Conv}(X)_{:,i,j}" />
            <p>
                The outputs are identical. The Conv2d formulation is preferred in production
                because it allows batch processing of all patches simultaneously with
                hardware-optimized convolution kernels.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Interpolation derivation &middot; embedding geometry &middot; rank analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch PatchEmbedding &middot; CLS token &middot; position interpolation</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const PATCH_EMBEDDINGS_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
}
