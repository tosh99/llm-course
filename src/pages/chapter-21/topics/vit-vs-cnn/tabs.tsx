import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Timeline helper ────────────────────────────────────────────────────────────

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

// ── HistoryTab ─────────────────────────────────────────────────────────────────

function HistoryTab() {
    const items: TlItem[] = [
        {
            year: "2012",
            title: "AlexNet Establishes the CNN Paradigm",
            context:
                "AlexNet's 2012 ImageNet victory inaugurated an eight-year era of unquestioned CNN dominance. Every subsequent milestone &mdash; VGGNet, GoogLeNet, ResNet, EfficientNet, MobileNet &mdash; refined the same core inductive biases: locality (convolutions examine local P&times;P neighborhoods), weight sharing (the same filter is applied at every spatial position, enforcing translation equivariance), and hierarchical composition (early layers detect edges, middle layers detect parts, late layers detect objects).",
            what:
                "These biases were not arbitrary engineering choices. They encoded genuine assumptions about natural images: nearby pixels are correlated; patterns repeat across positions; objects are composed of parts. The assumptions are correct, and they made CNNs extraordinarily sample-efficient. A ResNet-50 trained on 1.2M ImageNet images achieves 76% top-1 accuracy &mdash; a feat that would require far more data from an architecture with fewer priors.",
            impact:
                "For eight years, the CNN inductive bias was treated as settled truth. Computer vision research explored depth, width, efficiency, and augmentation &mdash; but rarely questioned whether the convolution operation itself was the optimal computational primitive for image understanding.",
        },
        {
            year: "2020",
            title: "Dosovitskiy et al. &mdash; ViT Challenges the Paradigm",
            context:
                "Following the Transformer's dominance of NLP (2017&ndash;2020), Dosovitskiy and colleagues at Google Brain asked: what if we apply a standard Transformer directly to images, with no convolutional layers at all? The result, the Vision Transformer (ViT), split images into 16&times;16 pixel patches, embedded each patch as a token, and fed the sequence into a standard Transformer encoder.",
            what:
                "On ImageNet alone, ViT underperformed ResNets &mdash; it lacked the CNN's spatial priors and needed more data to learn them from scratch. But pre-trained on JFT-300M (300 million images), ViT-L/16 achieved 88.55% top-1 accuracy, matching or exceeding the best CNNs. The paper raised an immediate academic question: is the CNN's inductive bias a strength (efficient learning from limited data) or a straitjacket (limits ultimate expressiveness)? The answer, it turned out, was both &mdash; and it depended entirely on how much data and compute you had.",
            impact:
                "ViT cracked open a decade of architectural consensus. Within 18 months, hundreds of ViT variants, hybrid architectures, and cross-architecture ablation studies flooded the literature, collectively establishing the empirical laws governing when each approach excels.",
        },
        {
            year: "2021",
            title: "MLP-Mixer and Architecture Ablations",
            context:
                "If self-attention was the key ingredient in ViT, then removing it should collapse performance. Tolstikhin et al. (Google Brain) tested this hypothesis with MLP-Mixer: a model that replaced both convolutions and self-attention with simple MLPs applied to patches, achieving competitive ImageNet accuracy.",
            what:
                "MLP-Mixer suggested that the critical innovation in ViT was the patch tokenization &mdash; the act of breaking the image into fixed-size local patches and treating them as a sequence &mdash; rather than the self-attention mechanism itself. Concurrently, multiple ablation studies showed that the performance gap between CNNs and ViTs narrowed dramatically as dataset size increased, and that training recipe differences (optimizer, augmentation, schedule) accounted for a large fraction of the apparent architectural advantage.",
            impact:
                "The architecture debate became more nuanced: ViT's strength lay not only in self-attention's expressiveness but also in the inductive-bias-free framework that allowed any form of global computation to be learned. This reframing shifted attention to training at scale as the critical variable.",
        },
        {
            year: "2022",
            title: "Liu et al. &mdash; ConvNeXt: A CNN Trained Like a ViT",
            context:
                "The ViT community had developed a superior training recipe: AdamW optimizer, heavy augmentation (RandAugment, Mixup, CutMix), cosine LR schedule over long training runs. These tricks were not routinely applied to CNNs, whose training recipes had stagnated at SGD + standard augmentation.",
            what:
                "Zhuang Liu and colleagues at Meta AI (Facebook Research) took a standard ResNet-50 and systematically applied the DeiT/ViT training recipe, then progressively modernized the architecture: larger kernels (7&times;7 depthwise conv), inverted bottleneck, GELU activations, fewer normalization layers, Layer Normalization instead of Batch Normalization. The result, ConvNeXt, matched or exceeded DeiT and Swin Transformer at every scale. ConvNeXt-XL achieved 87.8% top-1 on ImageNet, comparable to ViT-L.",
            impact:
                "ConvNeXt proved that the CNN architecture was not the bottleneck &mdash; the training recipe was. It reignited the &ldquo;CNNs are still competitive&rdquo; camp and forced a more careful separation of architectural vs. training recipe effects in all future comparisons. The paper is the definitive rebuttal to the claim that CNNs are fundamentally limited.",
        },
        {
            year: "2022",
            title: "Representation Analysis &mdash; Shape Bias, Texture Bias, and CKA",
            context:
                "With multiple architectures achieving similar benchmark accuracy, researchers turned to a deeper question: do CNNs and ViTs learn the same representations, or different ones that happen to yield similar classification accuracy?",
            what:
                "Geirhos et al. (2019, confirmed for ViTs in 2022) showed that CNNs trained on ImageNet develop a strong texture bias: 80% of misclassifications on &ldquo;Stylized ImageNet&rdquo; (natural shapes with shuffled textures) go by texture. ViTs show higher shape bias (&asymp;60% shape preference). Park et al. showed ViTs have lower texture bias globally. Raghu et al. used Centered Kernel Alignment (CKA) and found that ViT representations are more uniform across layers &mdash; global information is present from shallow layers &mdash; whereas CNN representations build hierarchically from local to global. ViTs and CNNs solve image classification by learning qualitatively different features.",
            impact:
                "These studies explained why the two architectures fail on different examples and why ensembling a CNN with a ViT typically outperforms either alone. They also motivated the design of robustness benchmarks (ImageNet-C, Stylized ImageNet) that expose texture-reliant failures invisible on standard benchmarks.",
        },
        {
            year: "2022&ndash;2023",
            title: "Large-Scale Pre-training &mdash; The Scaling Verdict",
            context:
                "EVA (BAAI), DINOv2 (Meta AI), and MAE (He et al., Meta AI) pushed ViT pre-training to unprecedented scales: ViT-G (1.8B parameters) on JFT-3B and web-scale data, evaluated across dozens of downstream tasks.",
            what:
                "The scaling results were unambiguous above &asymp;1B parameters: ViT continues to improve log-linearly with compute; CNNs scale sublinearly and plateau. ViT-G pre-trained with DINOv2 achieved top-1 accuracy on ImageNet that no CNN has matched. The Chinchilla-style analysis applied to vision showed that at fixed compute budgets above &sim;10&sup2; petaflop-days, ViTs are more compute-efficient than CNNs. Below that threshold, CNNs remain competitive or superior.",
            impact:
                "The large-scale evidence established a pragmatic consensus: ViTs win at large scale; CNNs win or tie at small scale. This is not an architectural quality judgment &mdash; it is an empirical fact about how inductive biases trade against expressiveness as data grows.",
        },
        {
            year: "2023",
            title: "Practical Convergence &mdash; The Peace Treaty",
            context:
                "By 2023, the academic debate had resolved into an engineering question: for a given compute budget and dataset size, which architecture maximizes performance? The answer increasingly pointed to hybrids.",
            what:
                "Swin Transformer (Liu et al., 2021) introduced hierarchical local windows and shifted window attention, giving ViT the CNN's hierarchical receptive field growth while retaining attention. ConvNeXt v2 (2023) added global response normalization to match ViT's global normalization behavior. EfficientViT, CMT, and FastViT combined CNN feature extraction in early stages (cheap, efficient for high-resolution) with Transformer attention in late stages (necessary for global context). The &ldquo;CNN vs ViT&rdquo; debate had become &ldquo;choose the right architecture for your compute budget and data regime.&rdquo;",
            impact:
                "The practical outcome: production vision systems routinely use hybrid architectures. Foundation model backbones (DINOv2, SAM, EVA-CLIP) use pure ViTs at scale. Mobile and edge systems use efficient CNNs or early-CNN/late-ViT hybrids. No single architecture dominates all regimes, and the community now selects architectures empirically rather than ideologically.",
        },
    ]

    return (
        <>
            <p>
                Between 2020 and 2023, computer vision experienced its most significant architectural debate since the deep learning era began: Vision Transformers (ViT) versus Convolutional Neural Networks (CNNs). The debate produced not a winner but a map &mdash; a detailed empirical understanding of exactly when and why each architecture excels, grounded in inductive biases, data efficiency, scaling behavior, and representation geometry.
            </p>

            <div className="ch-timeline">
                {items.map((item) => (
                    <TimelineItem key={item.year} item={item} />
                ))}
            </div>

            <div className="ch-callout">
                <strong>The lasting lesson:</strong> Inductive biases are not free. A CNN's built-in locality and translation equivariance are worth roughly 10&times; the training data in the low-data regime. In the high-data regime, those same biases cap the expressiveness of the model. The history of ViT vs CNN is the history of that trade-off becoming visible as scale increased.
            </div>

            <Analogy label="What comes next &mdash; Scaling Laws &amp; GPT-3">
                Vision Transformers settled one question: the Transformer architecture, given enough data, outperforms architectures with hand-crafted inductive biases. But this raised a larger question: how much data and compute is &ldquo;enough&rdquo;? Is there a formula for predicting when a model will be worth training before you spend the money? In 2020, Jared Kaplan and colleagues at OpenAI published an answer &mdash; scaling laws &mdash; showing that language model loss follows precise power-law curves as a function of parameters, data, and compute. Chapter 22 traces that discovery and its consequences for the design of GPT-3 and every large model that followed.
            </Analogy>
        </>
    )
}

// ── KidTab ─────────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <Analogy label="Two Different Ways of Learning to Read">
                Imagine learning to read a book. CNNs are like reading letter by letter, then word by word, then sentence by sentence &mdash; always building from small local pieces upward. First you recognize &ldquo;c,&rdquo; then &ldquo;cat,&rdquo; then &ldquo;the cat sat.&rdquo; Vision Transformers are different: they photograph the whole page at once and immediately look for connections between any two words, no matter how far apart. A ViT can notice that &ldquo;cat&rdquo; in the first line and &ldquo;meowed&rdquo; on the last line are related, without reading everything in between first.
            </Analogy>

            <Analogy label="The Rulebook vs. the Blank Slate">
                CNNs come with a rulebook already written in: &ldquo;nearby pixels matter more than far-away pixels&rdquo; and &ldquo;the same pattern is equally important whether it appears in the top-left corner or the bottom-right corner.&rdquo; These rules are baked into the architecture before training even starts. ViTs start with a blank slate and must learn these rules entirely from the data. The rulebook helps enormously when you have a small amount of data &mdash; the CNN already knows the important rules. The blank slate is more powerful when you have oceans of data, because ViT can discover rules that the CNN rulebook never imagined.
            </Analogy>

            <Analogy label="The Tactician vs. the Strategist">
                Imagine a chess player who is brilliant at local tactics &mdash; spotting a fork or a pin in the next three moves &mdash; versus a player who thinks about the whole board at once. CNNs are tacticians: extraordinary at local pattern recognition like edges, textures, and corners. ViTs are strategists: extraordinary at global relationship detection. If a bird&apos;s beak is in the top-left and its tail feathers are in the bottom-right of the image, a ViT can immediately connect them as belonging to the same animal. A CNN has to build up to that conclusion layer by layer. Neither is better in isolation &mdash; it depends on whether the task requires local sharpness or global context.
            </Analogy>

            <Analogy label="The Texture Trap">
                CNNs have a famous weakness: they often classify images by surface texture rather than shape. If you take a photo of a cat and paste elephant skin texture all over it, a CNN will often say &ldquo;elephant!&rdquo; &mdash; because it has learned to recognize elephant skin texture as a strong signal. ViTs are harder to fool this way: they pay attention to the overall shape and how different parts relate to each other, not just what the surface looks like. Researchers call this the shape-texture bias difference, and it explains why CNNs and ViTs fail on very different types of tricky images.
            </Analogy>

            <Analogy label="Why Scale Changes Everything">
                At 1 million training images: the CNN wins, because it already knows the rules and ViT is still learning them from scratch. At 10 million images: roughly tied. At 100 million images or more: ViT wins by a growing margin, because its global attention can discover patterns that CNN filters fundamentally cannot see. Scale amplifies the advantage of expressiveness over built-in rules. This is why big tech companies building massive vision models switched to ViTs, while your phone&apos;s camera app still uses efficient CNN variants.
            </Analogy>

            <Analogy label="The Hybrid Peace Treaty">
                By 2022, both sides had learned from each other. Swin Transformer took ViT and added local windows (like CNN locality) with shifted windows between layers (like CNN receptive field growth). ConvNeXt took a CNN and adopted ViT&apos;s training tricks and normalization design. EfficientViT used CNN layers for the first stages of processing (cheap and good at local detail) and Transformer attention for the final stages (necessary for global context). The &ldquo;CNN vs ViT war&rdquo; ended in a peace treaty: modern architectures steal the best ideas from both sides and combine them based on what the task and compute budget require.
            </Analogy>

            <div className="ch-callout">
                <strong>The bottom line for kids:</strong> CNNs are fast learners because they start with good rules about nearby pixels. ViTs are slow starters that become unstoppable when given enough examples. Modern systems use whichever one fits their situation &mdash; or combine both.
            </div>
        </>
    )
}

// ── HighSchoolTab ──────────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <p>
                The CNN vs ViT comparison is not a simple contest of one architecture beating another. It is a systematic study of how inductive biases, computational structure, and representation geometry interact with dataset scale. Understanding the trade-offs precisely requires examining each dimension independently.
            </p>

            <h3>Inductive Biases: What Each Architecture Assumes</h3>
            <p>
                CNN inductive biases are structural: <strong>locality</strong> (each convolution examines a P&times;P neighborhood, not the whole image), <strong>weight sharing</strong> (the same kernel applies at every spatial location, enforcing translation equivariance), and <strong>hierarchical composition</strong> (early layers detect edges, middle layers compose edges into parts, final layers compose parts into objects). These biases are encoded in the architecture regardless of training data.
            </p>
            <p>
                ViT has no vision-specific inductive biases. Self-attention is globally <em>permutation-equivariant</em>: it treats all patch positions symmetrically. ViT must learn spatial relationships &mdash; including locality and approximate translation invariance &mdash; entirely from data. The only spatial prior is the learned positional embedding, which is far weaker than the structural locality of convolution.
            </p>

            <DefBlock label="Translation Equivariance (Formal)">
                A function f is translation-equivariant if shifting the input by t shifts the output by t: f(T_t(x)) = T_t(f(x)). CNNs satisfy this exactly (up to border effects). ViTs learn approximate equivariance from data but do not have it structurally. This is why CNNs generalize better under spatial shift augmentation at small scale, and why ViTs need strong augmentation to compensate.
            </DefBlock>

            <MathBlock tex="f(T_t(\mathbf{x})) = T_t(f(\mathbf{x}))" />

            <h3>Computational Complexity</h3>
            <p>
                Self-attention scales quadratically with sequence length: for N patches of dimension D, the attention matrix is N&times;N, giving O(N&sup2;D) per layer. For a 224&times;224 image with 16&times;16 patches, N = 196 &mdash; manageable. For 2&times;2 patches: N = 12,544, making naive attention prohibitive (O(&asymp;1.5B) operations per layer).
            </p>
            <p>
                A convolutional layer with kernel size k, C_in input channels, C_out output channels, and spatial size N is O(N &middot; k&sup2; &middot; C_in &middot; C_out) &mdash; linear in spatial size. Swin Transformer resolves ViT&apos;s quadratic cost with local window attention of size w: O(N &middot; w&sup2; &middot; D), restoring linear scaling.
            </p>

            <MathBlock tex="\text{Self-Attention: } O(N^2 D) \quad \text{Conv layer: } O(N \cdot k^2 \cdot C_{in} \cdot C_{out}) \quad \text{Swin Window: } O(N \cdot w^2 \cdot D)" />

            <h3>Representation Analysis &mdash; CKA and Layer Geometry</h3>
            <p>
                Raghu et al. (2021) used Centered Kernel Alignment (CKA) to measure representation similarity across layers of CNNs and ViTs. CKA is a normalized similarity metric for two representation matrices X and Y:
            </p>

            <MathBlock tex="\text{CKA}(X, Y) = \frac{\|Y^T X\|_F^2}{\|X^T X\|_F \cdot \|Y^T Y\|_F}" />

            <p>
                The CKA analysis revealed a fundamental structural difference. In CNNs, each layer&apos;s representation is most similar to its immediate neighbors and progressively less similar to distant layers &mdash; a clear gradient from local (early) to global (late) features. In ViTs, even shallow layers show high CKA similarity to deep layers, meaning global information propagates immediately through self-attention. ViTs process local and global information simultaneously rather than hierarchically.
            </p>

            <h3>Shape vs. Texture Bias</h3>
            <p>
                Geirhos et al. introduced Stylized ImageNet: natural images with textures replaced by artistic style-transferred patterns. A model with pure shape bias would be unaffected; a model with pure texture bias would fail completely. CNNs trained on standard ImageNet showed 80% texture bias &mdash; classifying &ldquo;cat shape with elephant texture&rdquo; as elephant in most trials. ViTs showed &asymp;60% shape preference: a significant but incomplete advantage.
            </p>
            <p>
                The mechanistic reason: convolutions respond to local spatial frequency patterns (textures) at every position, which is exactly what local texture is. Attention weights, by contrast, depend on the content and position of all tokens jointly &mdash; making global shape configurations naturally salient. This difference explains why ViTs are more robust to certain distribution shifts (texture changes, style transfer) but may fail differently on spatial corruptions (rotation, scaling) where CNNs&apos; equivariance is protective.
            </p>

            <h3>Scaling Laws: When Does Each Architecture Win?</h3>
            <p>
                The empirical consensus from ViT, DeiT, DINOv2, and EVA pre-training experiments can be summarized as a dataset-size phase diagram:
            </p>
            <ul>
                <li><strong>Below &sim;1M images</strong> (e.g., CIFAR-100, small domain datasets): CNNs win clearly &mdash; inductive biases substitute for data.</li>
                <li><strong>1M&ndash;10M images</strong> (e.g., ImageNet-1k with standard augmentation): CNNs and ViTs tie, contingent on training recipe quality. ConvNeXt matches DeiT here.</li>
                <li><strong>10M&ndash;300M images</strong> (e.g., ImageNet-21k, JFT-300M): ViTs begin to pull ahead, especially at larger model sizes. The ViT scaling curve is steeper.</li>
                <li><strong>Above 300M images</strong> (JFT-3B, web-scale data): ViTs dominate and the gap grows with model size. No CNN architecture has matched ViT-G at this scale.</li>
            </ul>

            <p>
                The inflection point lies at approximately 10M&ndash;30M images per class in the training set &mdash; where the ViT&apos;s expressiveness begins to overcome the CNN&apos;s data efficiency advantage.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">CKA analysis &middot; FLOPs derivation &middot; translation equivariance proof</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">ResNet-50 vs ViT-Small &middot; side-by-side forward pass</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── MathsContent ───────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h3>1. Centered Kernel Alignment (CKA)</h3>
            <p>
                Given two representation matrices X &isin; &#x211D;<sup>n&times;p</sup> and Y &isin; &#x211D;<sup>n&times;q</sup> (n examples, p and q features), define the Gram matrices K = XX&sup2; and L = YY&sup2;. The (biased) HSIC estimator is:
            </p>
            <MathBlock tex="\text{HSIC}(K, L) = \frac{1}{(n-1)^2} \text{tr}(KHLH)" />
            <p>
                where H = I &minus; (1/n)11&sup2; is the centering matrix. CKA normalizes this:
            </p>
            <MathBlock tex="\text{CKA}(X, Y) = \frac{\text{HSIC}(XX^T,\, YY^T)}{\sqrt{\text{HSIC}(XX^T,\, XX^T) \cdot \text{HSIC}(YY^T,\, YY^T)}}" />
            <p>
                CKA = 1 means the representations are identical up to linear transformation and scaling. CKA = 0 means they are completely unrelated. Raghu et al. computed CKA between every pair of layers across ResNet-50 and ViT-B/16, revealing ViT&apos;s uniform inter-layer similarity versus CNN&apos;s gradient structure.
            </p>

            <h3>2. FLOPs: Self-Attention vs. Convolution</h3>
            <p>
                For a single self-attention layer with sequence length N, dimension D, and H heads (head dimension d = D/H):
            </p>
            <MathBlock tex="\text{FLOPs}_{\text{attn}} = 4ND^2 + 2N^2D" />
            <p>
                The 4ND&sup2; term covers the Q, K, V projections and the output projection. The 2N&sup2;D term covers the attention matrix computation (QK&sup2;) and the weighted sum (AV). For N = 196 (ViT-B with 16&times;16 patches), D = 768:
            </p>
            <MathBlock tex="\text{FLOPs}_{\text{ViT-B layer}} = 4 \cdot 196 \cdot 768^2 + 2 \cdot 196^2 \cdot 768 \approx 461\text{M} + 59\text{M} \approx 520\text{M}" />
            <p>
                For a convolutional layer with spatial size H&times;W (N = HW), kernel k&times;k, C_in input and C_out output channels:
            </p>
            <MathBlock tex="\text{FLOPs}_{\text{conv}} = 2 \cdot N \cdot k^2 \cdot C_{in} \cdot C_{out}" />
            <p>
                A ResNet-50 bottleneck block (1&times;1, 3&times;3, 1&times;1) at 14&times;14 spatial resolution with 256 channels and 64 bottleneck channels: &asymp;116M FLOPs. Total ResNet-50 FLOPs &asymp; 4.1 GFLOP; ViT-B/16 &asymp; 17.5 GFLOP. ViT-B requires more compute than ResNet-50 at the same resolution.
            </p>

            <h3>3. Translation Equivariance: Formal Proof for Convolutions</h3>
            <p>
                Let T_&delta; denote a spatial shift operator: (T_&delta;f)(x) = f(x &minus; &delta;). A discrete convolution with kernel w is:
            </p>
            <MathBlock tex="(w * f)(x) = \sum_{k} w(k)\, f(x - k)" />
            <p>
                Applying T_&delta; to the output:
            </p>
            <MathBlock tex="T_\delta(w * f)(x) = (w * f)(x - \delta) = \sum_k w(k)\, f(x - \delta - k) = (w * T_\delta f)(x)" />
            <p>
                Therefore T_&delta;(w * f) = w * (T_&delta;f): shifting the input shifts the output by the same amount. This holds for any kernel w and any shift &delta;, making convolution structurally translation-equivariant, independent of training. Self-attention, by contrast, is permutation-equivariant (reordering inputs reorders outputs) but not translation-equivariant: the output at position i depends on learned positional embeddings, not on relative shifts.
            </p>

            <h3>4. Scaling Power Laws for Vision</h3>
            <p>
                Empirical scaling results from DINOv2 and EVA suggest that downstream task error E follows a power law in the pre-training dataset size N and model parameter count P:
            </p>
            <MathBlock tex="E(N, P) \approx A \cdot N^{-\alpha} \cdot P^{-\beta}" />
            <p>
                For ViT pre-trained on curated web data: &alpha; &asymp; 0.27 (error halves every &asymp; 13&times; increase in data), &beta; &asymp; 0.12. For CNN (EfficientNet family): &alpha; &asymp; 0.18, &beta; &asymp; 0.09. The steeper exponents for ViTs confirm that they extract more value per unit of additional data and parameters, explaining their eventual dominance at large scale.
            </p>
        </>
    )
}

// ── PY_CODE ────────────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn

# ═══════════════════════════════════════════════════════════════════════════════
# SIDE-BY-SIDE: ResNet-50 block vs ViT-Small block
# Key structural differences highlighted with comments
# ═══════════════════════════════════════════════════════════════════════════════


# ── ResNet: Bottleneck Block ───────────────────────────────────────────────────
# Inductive biases: LOCAL (3x3 conv sees 3x3 neighborhood),
#                   WEIGHT SHARING (same kernel at every spatial location),
#                   HIERARCHICAL (builds from edges -> parts -> objects)

class ResNetBottleneck(nn.Module):
    """
    ResNet-50 bottleneck block: 1x1 -> 3x3 -> 1x1 convolutions.
    Skip connection (residual) allows gradients to flow through.
    Translation equivariant by construction.
    """
    expansion = 4

    def __init__(self, in_channels, bottleneck_channels):
        super().__init__()
        out_channels = bottleneck_channels * self.expansion

        # 1x1 conv: reduce channels (no spatial mixing)
        self.conv1 = nn.Conv2d(in_channels, bottleneck_channels,
                               kernel_size=1, bias=False)
        self.bn1   = nn.BatchNorm2d(bottleneck_channels)

        # 3x3 conv: LOCAL spatial mixing (only 3x3 neighborhood)
        self.conv2 = nn.Conv2d(bottleneck_channels, bottleneck_channels,
                               kernel_size=3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(bottleneck_channels)

        # 1x1 conv: restore channels
        self.conv3 = nn.Conv2d(bottleneck_channels, out_channels,
                               kernel_size=1, bias=False)
        self.bn3   = nn.BatchNorm2d(out_channels)

        self.relu  = nn.ReLU(inplace=True)

        # Skip connection (identity or projection)
        self.skip  = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels),
        ) if in_channels != out_channels else nn.Identity()

    def forward(self, x):
        identity = self.skip(x)
        out = self.relu(self.bn1(self.conv1(x)))   # 1x1 reduce
        out = self.relu(self.bn2(self.conv2(out))) # 3x3 LOCAL mix
        out = self.bn3(self.conv3(out))            # 1x1 expand
        return self.relu(out + identity)           # residual add


# ── ViT: Transformer Block ─────────────────────────────────────────────────────
# Inductive biases: NONE for vision — all-to-all attention is permutation-
#                   equivariant, not translation-equivariant.
#                   Learns spatial relationships from data.

class ViTBlock(nn.Module):
    """
    ViT-Small Transformer block: LayerNorm -> MHSA -> residual,
                                  LayerNorm -> MLP  -> residual.
    GLOBAL: every patch attends to every other patch simultaneously.
    Pre-norm design (LayerNorm before attention, not after).
    """
    def __init__(self, dim=384, num_heads=6, mlp_ratio=4.0, dropout=0.0):
        super().__init__()
        self.norm1 = nn.LayerNorm(dim)   # LayerNorm (not BatchNorm!)
        self.norm2 = nn.LayerNorm(dim)

        # Multi-head self-attention: ALL patches attend to ALL patches
        # O(N^2 * D) complexity — the key architectural difference from conv
        self.attn  = nn.MultiheadAttention(
            embed_dim=dim,
            num_heads=num_heads,
            dropout=dropout,
            batch_first=True,
        )

        # MLP: applied independently per token (no cross-token mixing here)
        hidden = int(dim * mlp_ratio)
        self.mlp = nn.Sequential(
            nn.Linear(dim, hidden),
            nn.GELU(),              # GELU (not ReLU) — ViT standard
            nn.Dropout(dropout),
            nn.Linear(hidden, dim),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        # x: (B, N, D)  -- B batch, N patches, D dimension
        normed = self.norm1(x)
        # GLOBAL attention: every patch reads every other patch
        attn_out, _ = self.attn(normed, normed, normed)
        x = x + attn_out           # residual (same as ResNet!)

        x = x + self.mlp(self.norm2(x))  # MLP + residual
        return x


# ── Structural Comparison Demo ─────────────────────────────────────────────────

def compare_forward_passes():
    B = 2   # batch size
    H = W = 14  # spatial size (after ResNet stem, before global pool)
    C_in, C_bn = 256, 64   # ResNet: 256 in -> 64 bottleneck -> 256 out

    N   = 196   # ViT: 14x14 patches (from 224x224 / 16x16)
    D   = 384   # ViT-Small dimension

    # ── ResNet block ──
    resnet_block = ResNetBottleneck(C_in, C_bn)
    x_cnn = torch.randn(B, C_in, H, W)     # (B, C, H, W) — spatial tensor
    y_cnn = resnet_block(x_cnn)

    # ── ViT block ──
    vit_block = ViTBlock(dim=D, num_heads=6)
    x_vit = torch.randn(B, N, D)            # (B, N, D) — sequence tensor
    y_vit = vit_block(x_vit)

    print("=== ResNet Bottleneck Block ===")
    print(f"  Input shape:  {tuple(x_cnn.shape)}  (B, C_in, H, W)")
    print(f"  Output shape: {tuple(y_cnn.shape)}  (B, C_out, H, W)")
    print(f"  Receptive field: 3x3 (LOCAL — only neighbors)")
    params_cnn = sum(p.numel() for p in resnet_block.parameters())
    print(f"  Parameters: {params_cnn:,}")

    print()
    print("=== ViT-Small Transformer Block ===")
    print(f"  Input shape:  {tuple(x_vit.shape)}  (B, N_patches, D)")
    print(f"  Output shape: {tuple(y_vit.shape)}  (B, N_patches, D)")
    print(f"  Receptive field: ALL {N} patches (GLOBAL — everyone sees everyone)")
    params_vit = sum(p.numel() for p in vit_block.parameters())
    print(f"  Parameters: {params_vit:,}")

    print()
    print("=== Key Structural Differences ===")
    print("  Normalization: ResNet uses BatchNorm | ViT uses LayerNorm")
    print("  Activation:    ResNet uses ReLU      | ViT uses GELU")
    print("  Mixing:        ResNet 3x3 conv LOCAL | ViT attention GLOBAL")
    print("  Complexity:    ResNet O(N*k^2*C^2)   | ViT O(N^2*D) per layer")
    print("  Equivariance:  ResNet translation-EQ | ViT permutation-EQ only")


if __name__ == "__main__":
    compare_forward_passes()
`

// ── PythonContent ──────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                Side-by-side implementation of a ResNet-50 bottleneck block and a ViT-Small Transformer block. The structural comments highlight the precise locations where the inductive bias differences manifest: local 3&times;3 convolution versus global self-attention, BatchNorm versus LayerNorm, ReLU versus GELU, and spatial tensor shapes versus sequence tensor shapes.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="vit_vs_cnn_comparison.py"
                lang="python"
                langLabel="Python"
            />
            <div className="ch-callout">
                <strong>Shape tells the story:</strong> The ResNet block operates on (B, C, H, W) &mdash; a spatial 2D tensor where the H and W dimensions encode position structurally. The ViT block operates on (B, N, D) &mdash; a flat sequence where position is carried only by the learned positional embeddings added before the first block. This shape difference is not cosmetic: it is the computational expression of the locality vs. globality trade-off.
            </div>
        </>
    )
}

// ── Export ─────────────────────────────────────────────────────────────────────

export const VIT_VS_CNN_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
}
