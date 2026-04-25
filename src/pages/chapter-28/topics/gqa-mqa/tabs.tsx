import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>From one head per query to shared heads across groups</h2>
            <p>
                Multi-Head Attention works beautifully during training — but at inference time, it
                becomes a memory and bandwidth bottleneck. Every new token generated requires reading
                the cached keys and values for every previous token across all heads. As context
                lengths grew from 2K to 32K+, this KV cache began to consume more GPU memory than
                the model weights themselves. Multi-Query Attention and Grouped-Query Attention
                emerged as the surgical fix: reduce the number of K/V heads while keeping all
                query heads.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Baseline</div>
                    <div className="ch-tl-title">Multi-Head Attention — the KV Cache Problem</div>
                    <div className="ch-tl-body">
                        Vaswani et al.&#39;s MHA: H query heads, H key heads, H value heads, each of
                        dimension d/H. For H=32 heads and d_model=4096, each head has d_head=128.
                        K and V projections hold H&times;d_head = 32&times;128 = 4096 values per
                        token, per layer. For a 2048-token context and 32 layers, the KV cache is
                        roughly 2&times;32&times;2048&times;4096&times;2 bytes &asymp; 1 GB.
                        At 100K tokens: 48 GB just for KV cache — dominating GPU memory.
                    </div>
                    <div className="ch-tl-impact">Impact: KV cache became the binding constraint for long-context inference</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Multi-Query Attention — Shazeer, Google</div>
                    <div className="ch-tl-body">
                        Noam Shazeer&#39;s paper &#8220;Fast Transformer Decoding: One Write-Head is
                        All You Need&#8221; proposed a radical simplification: keep H query heads but
                        collapse to a single key head and a single value head shared across all
                        queries. Q: H&times;d_head per token; K, V: 1&times;d_head each. KV cache
                        shrinks by H&times; (32&times; for H=32). Since decoding is
                        memory-bandwidth bound — reading the KV cache dominates every forward pass
                        — reading H&times; less data means H&times; faster decoding. Quality loss
                        was small but measurable. PaLM (540B) and Falcon adopted MQA.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved that sharing K/V heads sacrifices little quality but saves enormous memory</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Refinement</div>
                    <div className="ch-tl-title">Grouped-Query Attention — Ainslie et al., Google</div>
                    <div className="ch-tl-body">
                        &#8220;GQA: Training Generalized Multi-Query Transformer Models from
                        Multi-Head Checkpoints&#8221; introduced G groups, each with one K/V head
                        shared across H/G query heads. MHA is the special case G=H; MQA is G=1;
                        GQA sits in between. The key empirical finding: G=8 groups achieves quality
                        nearly identical to full MHA at a KV cache size nearly identical to MQA.
                        LLaMA 2 (34B and 70B, G=8), Mistral-7B (G=8), and Gemma-7B all adopted GQA.
                    </div>
                    <div className="ch-tl-impact">Impact: GQA became the default attention variant for production-scale models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Technique</div>
                    <div className="ch-tl-title">Converting MHA Checkpoints to GQA</div>
                    <div className="ch-tl-body">
                        Ainslie et al. also showed how to retrofit GQA onto a pretrained MHA model
                        without full retraining: (1) partition the H K/V head matrices into G groups;
                        (2) mean-pool each group into a single head; (3) run brief continued
                        pretraining to recover quality. This made it practical to upgrade
                        MHA-trained checkpoints — including LLaMA 1 style models — to GQA
                        without starting over.
                    </div>
                    <div className="ch-tl-impact">Impact: Existing model libraries could adopt GQA at low additional cost</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Scale</div>
                    <div className="ch-tl-title">KV Cache Becomes the Binding Constraint at 32K+ Context</div>
                    <div className="ch-tl-body">
                        As context lengths grew to 32K tokens, KV cache dominated GPU memory budgets.
                        For LLaMA 2 70B at 32K context: MHA KV cache &asymp;
                        2&times;80 layers&times;32K tokens&times;8192d&times;2 bytes &asymp; 84 GB
                        (exceeds one A100). GQA with G=8 divides by 8: about 10.5 GB, fitting
                        comfortably on a single 80 GB A100. GQA became mandatory for any
                        long-context large model.
                    </div>
                    <div className="ch-tl-impact">Impact: GQA unlocked 32K+ context on single-GPU deployments</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Infrastructure</div>
                    <div className="ch-tl-title">PagedAttention — vLLM and the OS for KV Cache</div>
                    <div className="ch-tl-body">
                        Kwon et al.&#39;s vLLM introduced PagedAttention: manage KV cache like OS
                        virtual memory, allocating non-contiguous physical memory blocks (pages)
                        for each request&#39;s KV cache. This eliminates memory fragmentation from
                        variable-length requests and enables 24&times; more concurrent requests
                        on the same GPU compared to naive contiguous allocation.
                        GQA + PagedAttention became the standard production serving stack.
                    </div>
                    <div className="ch-tl-impact">Impact: Defined the modern LLM serving architecture used by virtually all inference engines</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Sliding Window Attention and Hybrid Architectures</div>
                    <div className="ch-tl-body">
                        Mistral&#39;s sliding window attention (Jiang et al.) constrains each token
                        to attend only to the most recent W tokens (W=4096). Combined with GQA, the
                        KV cache is bounded at W tokens regardless of total context length.
                        Information from earlier positions propagates through intermediate layer
                        activations — the effective receptive field grows with depth even though
                        each attention layer has a fixed window.
                    </div>
                    <div className="ch-tl-impact">Impact: Made unbounded autoregressive generation with fixed memory overhead practical</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The throughput equation:</strong> Autoregressive decoding is
                memory-bandwidth bound, not compute bound. The time to generate one token is
                proportional to the bytes read from HBM: model weights plus KV cache. GQA
                reduces KV cache bytes by H/G&times;, directly accelerating decode throughput
                without touching the model&#39;s expressive capacity.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Sharing filing cabinets so the librarians work faster</h2>

            <Analogy label="The Library of Questions and Answers">
                Imagine a library with 32 librarians (query heads). In the original design, each
                librarian has their own private filing cabinet of answers (K and V heads). When you
                ask a question, all 32 librarians must each search their own cabinet. MQA gives all
                32 librarians ONE shared filing cabinet to search. GQA splits the librarians into 8
                teams of 4, each team sharing one cabinet. Much less storage, nearly the same
                quality of answers.
            </Analogy>

            <Analogy label="Why the Filing Cabinet Matters">
                Every time the model generates a new word, it has to remember every single word it
                has seen so far. These memories are stored in the KV cache — like a stack of filing
                cabinets that grows with every word. For a long essay or document, the stack
                becomes enormous. GQA shrinks the cabinets by 8 times, so the model can hold much
                longer conversations in the same space.
            </Analogy>

            <Analogy label="The Bandwidth Bottleneck">
                When generating one new word, the GPU reads through the entire KV cache but only
                writes a tiny new entry. It is like having to flip through a 1000-page book every
                time you add a single sentence. The faster you can flip through the book, the
                faster you generate text. GQA makes the book 8 times thinner, so reading it takes
                8 times less time.
            </Analogy>

            <Analogy label="Quality vs. Efficiency — The Sweet Spot">
                Three options exist. Full MHA: 32 separate cabinets, best quality, 32&times;
                the storage. MQA: 1 shared cabinet, 32&times; less storage, small quality drop.
                GQA with 8 groups: 8&times; less storage, almost zero quality drop. Experiments
                showed GQA-8 hits a sweet spot — essentially as good as full MHA but almost
                as cheap as MQA.
            </Analogy>

            <Analogy label="Converting an Old Model to GQA">
                Suppose you trained a model with 32 separate K/V cabinets. To convert it to GQA,
                you group the 32 cabinets into 8 clusters, average together the contents of each
                cluster into one combined cabinet, then let the model study briefly to adjust.
                Like merging 32 filing cabinets into 8 organized shared ones — some tidying up
                is needed, but no knowledge is lost.
            </Analogy>

            <Analogy label="PagedAttention — The Operating System for KV Cache">
                Naive serving reserves a big contiguous block of memory for every request&#39;s KV
                cache upfront, even if the request ends up being short. This wastes space the same
                way reserving a whole hotel floor for a single guest does. PagedAttention instead
                allocates small fixed-size pages on demand — like an operating system assigning
                RAM — so the GPU memory is always fully used and can serve many more simultaneous
                conversations.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>GQA and MQA — the mathematics and engineering</h2>

            <h3>MHA vs. MQA vs. GQA Parameterization</h3>
            <p>
                Let H be the number of query heads, d_h = d_model/H the per-head dimension, N the
                sequence length, and G the number of K/V groups. The three variants differ only in
                the shape of K and V:
            </p>

            <DefBlock label="GQA Attention for Group g">
                Each group g contains H/G query heads. The attention output for group g is:
            </DefBlock>
            <MathBlock tex="\mathbf{A}_g = \text{softmax}\!\left(\frac{\mathbf{Q}_g \mathbf{K}_g^\top}{\sqrt{d_h}}\right)\mathbf{V}_g" />
            <p>
                where <strong>Q</strong>_g &isin; R<sup>(H/G)&times;N&times;d_h</sup>,
                <strong>K</strong>_g &isin; R<sup>N&times;d_h</sup>,
                <strong>V</strong>_g &isin; R<sup>N&times;d_h</sup>.
                MHA is the case G=H (every head has its own K/V).
                MQA is G=1 (one K/V shared globally).
                GQA interpolates with 1 &lt; G &lt; H.
            </p>

            <h3>KV Cache Size Across Variants</h3>
            <p>
                Per layer, per token, the KV cache stores two tensors of shape G&times;d_h in
                float16 (2 bytes each):
            </p>
            <MathBlock tex="\text{KV bytes per token per layer} = 2 \times G \times d_h \times 2" />
            <p>
                For LLaMA 2 70B: H=64, d_h=128, 80 layers.
                MHA (G=64): 2&times;64&times;128&times;2&times;80 &asymp; 1.3 MB per token.
                At 32K tokens: 42 GB.
                GQA with G=8: 2&times;8&times;128&times;2&times;80 &asymp; 0.16 MB per token.
                At 32K tokens: 5.2 GB — an 8&times; reduction.
            </p>
            <MathBlock tex="\text{KV cache reduction} = \frac{H}{G}" />

            <h3>Quality: GQA vs. MHA</h3>
            <p>
                Ainslie et al. fine-tuned T5-Large from MHA to GQA by mean-pooling groups of K/V
                heads, then continued pretraining briefly. ROUGE-2 results on summarization:
            </p>
            <ul>
                <li><strong>MHA (G=H):</strong> 43.4</li>
                <li><strong>GQA G=8:</strong> 43.1 (&minus;0.3, within noise)</li>
                <li><strong>MQA (G=1):</strong> 42.7 (&minus;0.7)</li>
            </ul>
            <p>
                The quality interpolates roughly as a function of G. The GQA quality gap from
                MHA is a fraction of the MQA gap, while the memory saving is nearly identical to MQA:
            </p>
            <MathBlock tex="\text{Quality}(G) \approx \text{Quality}_\text{MHA} - c \cdot \frac{1}{G}" />

            <h3>Decode Throughput: Memory-Bandwidth Model</h3>
            <p>
                Autoregressive decoding reads (model parameters + KV cache) from HBM for every
                new token. The time per token is approximately:
            </p>
            <MathBlock tex="\text{time/token} \approx \frac{\text{param bytes} + \text{KV cache bytes}}{\text{HBM bandwidth}}" />
            <p>
                On an A100 80GB (HBM bandwidth &asymp; 2 TB/s), for LLaMA 2 70B at 32K context:
                MHA: (140 GB params + 42 GB KV) / 2 TB/s &asymp; 91 ms/token.
                GQA G=8: (140 GB + 5.2 GB) / 2 TB/s &asymp; 73 ms/token — 20% faster, free.
            </p>

            <h3>Sliding Window Attention</h3>
            <p>
                Mistral&#39;s SWA restricts token at position t to attend only to positions in
                [max(0, t&minus;W), t]. The causal banded mask is:
            </p>
            <MathBlock tex="M_{ij} = \begin{cases} 0 & \text{if } \max(0,\,i - W) \leq j \leq i \\ -\infty & \text{otherwise} \end{cases}" />
            <p>
                The KV cache is bounded at W tokens regardless of total sequence length. After L
                stacked attention layers, the effective receptive field at layer l grows to l&times;W
                because information from distant positions propagates via intermediate activations:
            </p>
            <MathBlock tex="\text{receptive field at layer } l = l \times W" />

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">KV cache derivation &middot; decode throughput model &middot; PagedAttention block allocation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9654;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch MHA, MQA, GQA &middot; KV cache sizing &middot; timing comparison</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Deep Dive ─────────────────────────────────────────────────────────────────

function MathsContent() {
    return (
        <>
            <h2>KV cache memory, decode throughput, and PagedAttention</h2>

            <h3>Deriving the KV Cache Memory Formula</h3>
            <p>
                For a model with L transformer layers, H query heads per layer, G K/V heads per
                layer (G &le; H), per-head dimension d_h, and maximum context length N, the total
                KV cache in float16 is:
            </p>
            <MathBlock tex="\text{KV cache (bytes)} = 2 \times L \times G \times N \times d_h \times 2" />
            <p>
                The leading factor of 2 accounts for storing both K and V. The trailing factor of
                2 is bytes per float16 element. Plugging in LLaMA 2 70B values
                (L=80, H=64, G=8, N=32768, d_h=128):
            </p>
            <MathBlock tex="\text{GQA KV} = 2 \times 80 \times 8 \times 32768 \times 128 \times 2 = 5.37 \text{ GB}" />

            <DefBlock label="Memory Reduction Ratio">
                The ratio of MHA KV cache to GQA KV cache is exactly H/G, independent of all
                other model dimensions:
            </DefBlock>
            <MathBlock tex="\frac{\text{KV}_\text{MHA}}{\text{KV}_\text{GQA}} = \frac{H}{G}" />

            <h3>Decode Throughput Model</h3>
            <p>
                Each decode step reads all model parameters once and all KV cache once from HBM.
                Let P be parameter bytes, K(n) be KV cache bytes at sequence position n, and BW
                be HBM bandwidth:
            </p>
            <MathBlock tex="\text{latency}(n) = \frac{P + K(n)}{\text{BW}}" />
            <p>
                With MHA, K(n) = 2&times;L&times;H&times;n&times;d_h&times;2 grows linearly with
                n. With GQA (G groups), K(n) = 2&times;L&times;G&times;n&times;d_h&times;2. The
                throughput advantage of GQA over MHA at position n is:
            </p>
            <MathBlock tex="\frac{\text{latency}_\text{MHA}(n)}{\text{latency}_\text{GQA}(n)} = \frac{P + 2LHnd_h \cdot 2}{P + 2LGnd_h \cdot 2}" />
            <p>
                At long context where KV cache dominates (K(n) &#8811; P), the ratio approaches H/G.
                At short context where parameters dominate, the ratio approaches 1. GQA&#39;s
                benefit grows with context length.
            </p>

            <h3>PagedAttention Block Allocation</h3>
            <p>
                PagedAttention partitions each request&#39;s KV cache into fixed-size blocks of B
                tokens. A block table maps logical block indices to physical GPU memory pages.
                For a request of current length n, the number of allocated blocks is:
            </p>
            <MathBlock tex="\text{blocks}(n) = \left\lceil \frac{n}{B} \right\rceil" />
            <p>
                Memory is allocated one block at a time as the sequence grows. The maximum
                internal fragmentation per request is at most B&minus;1 tokens&#39; worth of KV.
                With B=16 and float16 storage, one block holds 16&times;G&times;d_h&times;4 bytes.
                Physical pages need not be contiguous; the block table redirects accesses at
                minimal overhead, enabling fine-grained memory sharing across requests (e.g. for
                parallel sampling or prefix sharing).
            </p>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import time

# ── Multi-Head Attention (baseline) ──────────────────────────────────────────
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        assert d_model % num_heads == 0
        self.H = num_heads
        self.d_h = d_model // num_heads
        self.Wq = nn.Linear(d_model, d_model, bias=False)
        self.Wk = nn.Linear(d_model, d_model, bias=False)
        self.Wv = nn.Linear(d_model, d_model, bias=False)
        self.Wo = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x):
        B, N, D = x.shape
        Q = self.Wq(x).view(B, N, self.H, self.d_h).transpose(1, 2)
        K = self.Wk(x).view(B, N, self.H, self.d_h).transpose(1, 2)
        V = self.Wv(x).view(B, N, self.H, self.d_h).transpose(1, 2)
        # Q,K,V: (B, H, N, d_h)
        scores = (Q @ K.transpose(-2, -1)) / math.sqrt(self.d_h)
        attn = F.softmax(scores, dim=-1)
        out = (attn @ V).transpose(1, 2).reshape(B, N, -1)
        return self.Wo(out)

    def kv_cache_bytes(self, seq_len: int) -> int:
        # 2 tensors (K,V), H heads, seq_len tokens, d_h dims, 2 bytes (fp16)
        return 2 * self.H * seq_len * self.d_h * 2


# ── Multi-Query Attention (G=1) ───────────────────────────────────────────────
class MultiQueryAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        self.H = num_heads
        self.d_h = d_model // num_heads
        self.Wq = nn.Linear(d_model, d_model, bias=False)
        # single K and V head
        self.Wk = nn.Linear(d_model, self.d_h, bias=False)
        self.Wv = nn.Linear(d_model, self.d_h, bias=False)
        self.Wo = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x):
        B, N, D = x.shape
        Q = self.Wq(x).view(B, N, self.H, self.d_h).transpose(1, 2)
        # K,V: (B, 1, N, d_h) — broadcast across H
        K = self.Wk(x).view(B, N, 1, self.d_h).transpose(1, 2)
        V = self.Wv(x).view(B, N, 1, self.d_h).transpose(1, 2)
        scores = (Q @ K.transpose(-2, -1)) / math.sqrt(self.d_h)
        attn = F.softmax(scores, dim=-1)
        out = (attn @ V).transpose(1, 2).reshape(B, N, -1)
        return self.Wo(out)

    def kv_cache_bytes(self, seq_len: int) -> int:
        # G=1: only 1 K and 1 V head
        return 2 * 1 * seq_len * self.d_h * 2


# ── Grouped-Query Attention (1 < G < H) ───────────────────────────────────────
class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int, num_groups: int):
        super().__init__()
        assert num_heads % num_groups == 0
        self.H = num_heads
        self.G = num_groups
        self.d_h = d_model // num_heads
        self.Wq = nn.Linear(d_model, d_model, bias=False)
        self.Wk = nn.Linear(d_model, num_groups * self.d_h, bias=False)
        self.Wv = nn.Linear(d_model, num_groups * self.d_h, bias=False)
        self.Wo = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x):
        B, N, D = x.shape
        H, G, d_h = self.H, self.G, self.d_h
        Q = self.Wq(x).view(B, N, H, d_h).transpose(1, 2)       # (B,H,N,d_h)
        K = self.Wk(x).view(B, N, G, d_h).transpose(1, 2)       # (B,G,N,d_h)
        V = self.Wv(x).view(B, N, G, d_h).transpose(1, 2)       # (B,G,N,d_h)
        # Repeat K,V so each query head sees its group's K/V
        heads_per_group = H // G
        K = K.repeat_interleave(heads_per_group, dim=1)          # (B,H,N,d_h)
        V = V.repeat_interleave(heads_per_group, dim=1)
        scores = (Q @ K.transpose(-2, -1)) / math.sqrt(d_h)
        attn = F.softmax(scores, dim=-1)
        out = (attn @ V).transpose(1, 2).reshape(B, N, -1)
        return self.Wo(out)

    def kv_cache_bytes(self, seq_len: int) -> int:
        return 2 * self.G * seq_len * self.d_h * 2


# ── KV cache comparison ───────────────────────────────────────────────────────
d_model, H, G = 4096, 32, 8
num_layers = 32

mha = MultiHeadAttention(d_model, H)
mqa = MultiQueryAttention(d_model, H)
gqa = GroupedQueryAttention(d_model, H, G)

for ctx in [2048, 8192, 32768]:
    mha_kb = mha.kv_cache_bytes(ctx) * num_layers / 1024 / 1024 / 1024
    mqa_kb = mqa.kv_cache_bytes(ctx) * num_layers / 1024 / 1024 / 1024
    gqa_kb = gqa.kv_cache_bytes(ctx) * num_layers / 1024 / 1024 / 1024
    print(f"Context {ctx:>6} tokens | MHA: {mha_kb:.2f} GB | "
          f"GQA-{G}: {gqa_kb:.2f} GB | MQA: {mqa_kb:.2f} GB")

# ── Forward pass timing ───────────────────────────────────────────────────────
device = "cuda" if torch.cuda.is_available() else "cpu"
x = torch.randn(1, 512, d_model, device=device)

for name, model in [("MHA", mha), ("GQA-8", gqa), ("MQA", mqa)]:
    model = model.to(device)
    # Warm up
    for _ in range(3):
        _ = model(x)
    t0 = time.perf_counter()
    for _ in range(20):
        _ = model(x)
    elapsed = (time.perf_counter() - t0) / 20 * 1000
    print(f"{name:>6}: {elapsed:.2f} ms/forward  |  "
          f"KV@8K tokens = {model.kv_cache_bytes(8192)/1024/1024:.1f} MB")
`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementations of MHA, MQA, and GQA as drop-in replacements with
                identical interfaces. The script computes KV cache sizes across context lengths
                and times a forward pass for each variant.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="gqa_mqa_attention.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GQA_MQA_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
