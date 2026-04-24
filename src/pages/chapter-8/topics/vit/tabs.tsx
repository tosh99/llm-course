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
            year: "2017",
            title: "Transformers Revolutionize NLP",
            context:
                "The Transformer architecture (Attention Is All You Need) had just replaced RNNs and LSTMs in natural language processing. Self-attention proved remarkably effective at modeling long-range dependencies in text.",
            what:
                "Researchers began wondering: if transformers work so well on sequences of words, could they work on sequences of image patches? Convolutions had dominated computer vision since 2012, but their local inductive bias might also be a limitation.",
            impact:
                "The success of Vision Transformers proved that convolution is not necessary for high-performance image recognition. This challenged a decade of assumptions and opened the door for unified architectures across vision and language.",
        },
        {
            year: "2020",
            title: "An Image is Worth 16×16 Words",
            context:
                "Google Research (Dosovitskiy et al.) asked a radical question: what if we treat an image as a sequence of patches, just like a sentence is a sequence of words?",
            what:
                "They introduced the Vision Transformer (ViT). Images are split into fixed-size patches (e.g., 16×16 pixels), linearly embedded, and fed into a standard Transformer encoder with position embeddings. A special [CLS] token aggregates global information for classification.",
            impact:
                "ViT matched or exceeded state-of-the-art CNNs on ImageNet when pre-trained on large datasets (JFT-300M). It demonstrated that pure attention scales better than convolutions with enough data, fundamentally changing vision architecture research.",
        },
        {
            year: "2021–2023",
            title: "Multimodal Models Emerge",
            context:
                "Once vision and language shared the same architecture (Transformer), combining them became natural. Models needed to understand both images and text simultaneously.",
            what:
                "CLIP (OpenAI) used separate image and text encoders (both Transformers) trained with contrastive learning to align visual and linguistic representations. DALL-E and Stable Diffusion used ViT-like encoders as components in text-to-image generation.",
            impact:
                "ViT became the de facto vision backbone for multimodal AI. From GPT-4V to Gemini, virtually every modern multimodal system uses Transformer-based vision encoders. The vision-language unification that ViT enabled is the foundation of today's generative AI boom.",
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
            <h2>ViT: Solving a Picture Puzzle</h2>

            <Analogy label="The Jigsaw Puzzle">
                Imagine you have a big picture, but instead of looking at the whole thing
                at once, you cut it into small squares—like a jigsaw puzzle!
                <br /><br />
                Now, imagine each puzzle piece is a "word" in a sentence. Just like you
                can understand a sentence by reading each word and how they relate to each
                other, the computer looks at each puzzle piece and figures out how they
                connect to understand the whole picture.
            </Analogy>

            <Analogy label="The Special Classification Token">
                In the puzzle, there's one special piece with a question mark on it.
                This piece doesn't show part of the picture—instead, it reads all the
                other pieces and decides what the whole image is!
                <br /><br />
                Is it a cat? A dog? A car? This special piece (called the [CLS] token)
                makes the final guess after talking to all the other puzzle pieces.
            </Analogy>

            <DefBlock label="Why This Is Different from CNNs">
                CNNs are like looking at the picture through a small window that slides
                around. They only see a tiny neighborhood at a time, building up from
                edges to shapes to objects.
                <br /><br />
                ViT is different: every puzzle piece can instantly talk to every other
                piece! If there's a cat ear in the top-left and a cat tail in the
                bottom-right, they can immediately recognize they belong together—even
                though they're far apart.
            </DefBlock>

            <Analogy label="Position Matters">
                If you scrambled all the puzzle pieces, you'd need to know where each
                piece originally belonged, right? ViT adds "position stickers" to each
                piece so it knows whether a patch came from the top, bottom, left, or
                right of the image. Without these stickers, the puzzle would be impossible!
            </Analogy>

            <div className="ch-callout">
                <strong>Cool fact:</strong> ViT was inspired by how GPT reads text!
                Instead of words like "cat" and "dog," it reads image patches.
                This means the same AI brain can learn to understand BOTH pictures
                and sentences—opening the door for AI that can describe photos or
                draw images from text descriptions!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>ViT: Vision Transformers Explained</h2>

            <p>
                The Vision Transformer (ViT) applies the Transformer architecture—originally
                designed for text—directly to images. Instead of processing pixels with
                convolutional filters, ViT splits an image into patches, embeds each patch
                into a vector, and processes the sequence with self-attention.
            </p>

            <h3>Image Patches</h3>
            <p>
                A 224×224 image is divided into non-overlapping 16×16 patches, yielding
                (224/16)² = 196 patches. Each patch contains 16×16×3 = 768 pixel values.
                These are flattened and projected via a learned linear layer to a
                D-dimensional embedding vector (typically D = 768).
            </p>

            <h3>Patch Embeddings + Positional Embeddings</h3>
            <p>
                Unlike words in a sentence, image patches have spatial structure. ViT adds
                learned positional embeddings to each patch embedding, encoding where the
                patch came from in the original image. Without this, the model would be
                permutation-invariant and lose all spatial information.
            </p>

            <DefBlock label="The [CLS] Token">
                Borrowed from BERT, a special classification token is prepended to the
                patch sequence. This token has no image content; instead, it attends to
                all patches during every self-attention layer. After the final Transformer
                block, the [CLS] token's representation is fed into a classification head
                (typically an MLP) to predict the image label.
            </DefBlock>

            <h3>Transformer Encoder</h3>
            <p>
                The sequence of patch embeddings (+ [CLS]) passes through L identical
                Transformer encoder layers. Each layer consists of:
            </p>
            <ul>
                <li><strong>Multi-Head Self-Attention:</strong> Every token attends to every other token, allowing global context aggregation from the first layer.</li>
                <li><strong>MLP:</strong> A feed-forward network applied independently to each token.</li>
                <li><strong>LayerNorm + Residuals:</strong> Pre-normalization or post-normalization with skip connections, exactly as in the original Transformer.</li>
            </ul>

            <h3>CNNs vs ViT</h3>
            <p>
                <strong>CNNs</strong> have a strong local inductive bias: nearby pixels are
                processed together, and features are built hierarchically (edges → textures →
                objects). This is efficient but may miss long-range relationships in early layers.
                <br /><br />
                <strong>ViT</strong> has no built-in spatial bias except positional embeddings.
                It learns spatial relationships entirely from data. With enough training data,
                this flexibility becomes an advantage. With limited data, CNNs typically
                generalize better due to their stronger priors.
            </p>

            <div className="ch-callout">
                <strong>Data scaling:</strong> ViT underperforms ResNets when trained on
                ImageNet alone, but surpasses them dramatically when pre-trained on larger
                datasets (JFT-300M, ImageNet-21k). This reveals a key insight: self-attention
                is more expressive but needs more data to learn its inductive biases.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>ViT: Mathematical Details</h2>

            <h3>Patch Projection</h3>
            <p>
                For an image x ∈ ℝ^{'{H×W×C}'} and patch resolution P, the number of patches
                is N = HW/P². Each patch is flattened and projected:
            </p>
            <MathBlock tex="z_0 = [x_{class}; x_p^1 E; x_p^2 E; \cdots; x_p^N E] + E_{pos}" />
            <p>
                where E ∈ ℝ^{'{(P²·C)×D}'} is the patch embedding matrix, E_pos ∈ ℝ^{'{(N+1)×D}'}
                are positional embeddings, and x_class is the learned [CLS] token.
            </p>

            <h3>Self-Attention over Patches</h3>
            <p>
                In each encoder layer ℓ, multi-head self-attention computes:
            </p>
            <MathBlock tex="\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{D_k}}\right) V" />
            <p>
                where Q, K, V are linear projections of the input. For N patches + 1 [CLS] token,
                the attention matrix is (N+1) × (N+1). Every patch can attend to every other patch
                in a single layer—this is the source of ViT's global receptive field.
            </p>

            <h3>Computational Complexity</h3>
            <p>
                Self-attention has O(N² · D) complexity where N is the number of patches.
                For 224×224 images with P = 16, N = 196, giving N² = 38,416. Compare to a
                CNN's O(N · D² · k²) where k is kernel size.
            </p>
            <MathBlock tex="\text{ViT per layer: } O(N^2 \cdot D) \quad \text{vs} \quad \text{CNN per layer: } O(N \cdot D^2 \cdot k^2)" />
            <p>
                ViT is computationally cheaper than CNNs when N is small (large patch sizes),
                but the quadratic scaling in N becomes expensive for high-resolution images.
                Hybrid approaches (e.g., CNN stem + Transformer) address this.
            </p>

            <h3>Classification Head</h3>
            <p>
                After L encoder layers, the [CLS] token representation z_L^0 is fed into
                an MLP classifier:
            </p>
            <MathBlock tex="y = \text{softmax}(W_{cls} \cdot \text{LayerNorm}(z_L^0) + b_{cls})" />
            <p>
                The [CLS] token aggregates global image information through self-attention,
                making it suitable for classification. For dense prediction tasks (segmentation,
                detection), all patch tokens are typically used.
            </p>
        </>
    )
}

const PYTHON_CODE = `import torch
import torch.nn as nn
import math

# ── Vision Transformer (ViT) in PyTorch ────────────────────────────────────────

class PatchEmbedding(nn.Module):
    """
    Split image into patches and embed each patch.
    Input:  (B, C, H, W)
    Output: (B, N, D) where N = num_patches
    """
    def __init__(self, img_size=224, patch_size=16, in_chans=3, embed_dim=768):
        super().__init__()
        self.img_size = img_size
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2

        # Use a Conv2d with stride=patch_size as an efficient patch splitter
        self.proj = nn.Conv2d(
            in_chans, embed_dim,
            kernel_size=patch_size, stride=patch_size
        )

    def forward(self, x):
        # (B, C, H, W) -> (B, D, H/P, W/P) -> (B, D, N) -> (B, N, D)
        x = self.proj(x)
        x = x.flatten(2)
        x = x.transpose(1, 2)
        return x


class MultiHeadAttention(nn.Module):
    def __init__(self, embed_dim=768, num_heads=12, dropout=0.0):
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        self.scale = self.head_dim ** -0.5

        self.qkv = nn.Linear(embed_dim, embed_dim * 3)
        self.attn_drop = nn.Dropout(dropout)
        self.proj = nn.Linear(embed_dim, embed_dim)
        self.proj_drop = nn.Dropout(dropout)

    def forward(self, x):
        B, N, C = x.shape

        # (B, N, 3*C) -> (B, N, 3, num_heads, head_dim) -> (3, B, num_heads, N, head_dim)
        qkv = self.qkv(x).reshape(B, N, 3, self.num_heads, self.head_dim).permute(2, 0, 3, 1, 4)
        q, k, v = qkv[0], qkv[1], qkv[2]

        # Attention: (B, heads, N, head_dim) @ (B, heads, head_dim, N) -> (B, heads, N, N)
        attn = (q @ k.transpose(-2, -1)) * self.scale
        attn = attn.softmax(dim=-1)
        attn = self.attn_drop(attn)

        # (B, heads, N, N) @ (B, heads, N, head_dim) -> (B, heads, N, head_dim)
        x = (attn @ v).transpose(1, 2).reshape(B, N, C)
        x = self.proj(x)
        x = self.proj_drop(x)
        return x


class TransformerBlock(nn.Module):
    def __init__(self, embed_dim=768, num_heads=12, mlp_ratio=4.0, dropout=0.0):
        super().__init__()
        self.norm1 = nn.LayerNorm(embed_dim)
        self.attn = MultiHeadAttention(embed_dim, num_heads, dropout)
        self.norm2 = nn.LayerNorm(embed_dim)

        hidden_dim = int(embed_dim * mlp_ratio)
        self.mlp = nn.Sequential(
            nn.Linear(embed_dim, hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, embed_dim),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        # Pre-norm with residual connections
        x = x + self.attn(self.norm1(x))
        x = x + self.mlp(self.norm2(x))
        return x


class VisionTransformer(nn.Module):
    """
    ViT-Base: 12 layers, 768 dim, 12 heads, ~86M parameters.
    """
    def __init__(
        self,
        img_size=224,
        patch_size=16,
        in_chans=3,
        num_classes=1000,
        embed_dim=768,
        depth=12,
        num_heads=12,
        mlp_ratio=4.0,
        dropout=0.0,
    ):
        super().__init__()

        self.patch_embed = PatchEmbedding(img_size, patch_size, in_chans, embed_dim)
        num_patches = self.patch_embed.num_patches

        # Learnable [CLS] token and positional embeddings
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, num_patches + 1, embed_dim))
        self.pos_drop = nn.Dropout(dropout)

        # Transformer encoder
        self.blocks = nn.ModuleList([
            TransformerBlock(embed_dim, num_heads, mlp_ratio, dropout)
            for _ in range(depth)
        ])

        self.norm = nn.LayerNorm(embed_dim)

        # Classification head
        self.head = nn.Linear(embed_dim, num_classes)

        # Initialize weights
        nn.init.normal_(self.cls_token, std=0.02)
        nn.init.normal_(self.pos_embed, std=0.02)
        self.apply(self._init_weights)

    def _init_weights(self, m):
        if isinstance(m, nn.Linear):
            nn.init.trunc_normal_(m.weight, std=0.02)
            if m.bias is not None:
                nn.init.constant_(m.bias, 0)
        elif isinstance(m, nn.LayerNorm):
            nn.init.constant_(m.bias, 0)
            nn.init.constant_(m.weight, 1.0)

    def forward(self, x):
        B = x.shape[0]

        # Patch embedding: (B, N, D)
        x = self.patch_embed(x)

        # Prepend [CLS] token: (B, N+1, D)
        cls_tokens = self.cls_token.expand(B, -1, -1)
        x = torch.cat([cls_tokens, x], dim=1)

        # Add positional embeddings
        x = x + self.pos_embed
        x = self.pos_drop(x)

        # Transformer blocks
        for block in self.blocks:
            x = block(x)

        # Final layer norm
        x = self.norm(x)

        # Classify using [CLS] token
        cls_output = x[:, 0]
        return self.head(cls_output)


# ── Usage ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    model = VisionTransformer(
        img_size=224,
        patch_size=16,
        num_classes=1000,
        embed_dim=768,
        depth=12,
        num_heads=12,
    )

    x = torch.randn(2, 3, 224, 224)
    y = model(x)

    params = sum(p.numel() for p in model.parameters())
    print(f"Parameters: {params:,}")  # ~86M
    print(f"Input:  {x.shape}")
    print(f"Output: {y.shape}")`;

function PythonTab() {
    return (
        <>
            <p>
                PyTorch implementation of a standard Vision Transformer (ViT-Base).
                Includes patch embedding via strided convolution, multi-head self-attention,
                pre-normalization Transformer blocks, and the [CLS] token for classification.
            </p>
            <CodeBlock code={PYTHON_CODE} filename="vit.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Implementation note:</strong> Using Conv2d with stride=patch_size
                is mathematically equivalent to flattening patches and applying a linear
                projection, but more efficient on GPUs. The positional embeddings are
                learned, not sinusoidal.
            </div>
        </>
    )
}




export const VIT_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
