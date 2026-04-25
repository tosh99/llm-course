import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python Code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn.functional as F
import math
import time

# ── Setup ─────────────────────────────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
dtype  = torch.float16

B, H, N, d = 1, 8, 4096, 64    # batch, heads, seq length, head dim
scale = 1.0 / math.sqrt(d)

Q = torch.randn(B, H, N, d, device=device, dtype=dtype)
K = torch.randn(B, H, N, d, device=device, dtype=dtype)
V = torch.randn(B, H, N, d, device=device, dtype=dtype)

# ── Standard attention (materializes full N×N matrix in HBM) ──────────────────
def standard_attention(Q, K, V, scale):
    S = torch.matmul(Q, K.transpose(-2, -1)) * scale   # (B, H, N, N)  ← O(N²) HBM write
    A = torch.softmax(S, dim=-1)                        # (B, H, N, N)  ← O(N²) HBM read/write
    O = torch.matmul(A, V)                              # (B, H, N, d)
    return O

# ── Flash Attention via PyTorch 2.0 (uses FlashAttention kernel internally) ───
def flash_attention(Q, K, V):
    # scaled_dot_product_attention dispatches to FlashAttention when:
    #   - running on CUDA
    #   - dtype is float16 or bfloat16
    #   - head dim <= 128
    # It never materializes the full N×N attention matrix in HBM.
    return F.scaled_dot_product_attention(Q, K, V, scale=scale)

# ── Warm-up (GPU lazy init) ───────────────────────────────────────────────────
if device.type == "cuda":
    for _ in range(3):
        standard_attention(Q, K, V, scale)
        flash_attention(Q, K, V)
    torch.cuda.synchronize()

# ── Benchmark: standard attention ─────────────────────────────────────────────
REPS = 20
if device.type == "cuda":
    torch.cuda.synchronize()
t0 = time.perf_counter()
for _ in range(REPS):
    out_std = standard_attention(Q, K, V, scale)
if device.type == "cuda":
    torch.cuda.synchronize()
t_std = (time.perf_counter() - t0) / REPS * 1000   # ms per call

# ── Benchmark: Flash Attention ────────────────────────────────────────────────
if device.type == "cuda":
    torch.cuda.synchronize()
t0 = time.perf_counter()
for _ in range(REPS):
    out_fa = flash_attention(Q, K, V)
if device.type == "cuda":
    torch.cuda.synchronize()
t_fa = (time.perf_counter() - t0) / REPS * 1000    # ms per call

# ── Results ───────────────────────────────────────────────────────────────────
print(f"Sequence length N = {N},  head dim d = {d}")
print(f"Standard attention : {t_std:.2f} ms   memory O(N²) = {N*N*2/1e6:.1f} MB per head")
print(f"Flash Attention    : {t_fa:.2f} ms   memory O(Nd)  = {N*d*2/1e6:.3f} MB per head")
print(f"Speedup            : {t_std / t_fa:.2f}x")

# Verify numerical equivalence (within fp16 tolerance)
if device.type == "cuda":
    max_diff = (out_std.float() - out_fa.float()).abs().max().item()
    print(f"Max absolute difference: {max_diff:.6f}  (should be < 0.01 for fp16)")

# ── Memory usage breakdown ────────────────────────────────────────────────────
bytes_per_elem = 2   # float16
N_vals = [512, 2048, 8192, 32768]
print("\\nHBM usage comparison (single head, float16):")
print(f"{'N':>8}  {'Standard O(N²)':>18}  {'FlashAttn O(Nd)':>18}")
for n in N_vals:
    std_mb  = n * n * bytes_per_elem / 1e6
    fa_mb   = n * d * bytes_per_elem / 1e6
    print(f"{n:>8}  {std_mb:>16.1f}MB  {fa_mb:>16.3f}MB")
`

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Flash Attention</h2>
            <p className="ch-story-intro">
                The Transformer&rsquo;s attention mechanism was, from its introduction in 2017, quadratic
                in sequence length &mdash; both in compute and in memory. For years this was managed
                by keeping contexts short. When researchers tried to extend context to tens of thousands
                of tokens, the memory wall became absolute: the N&nbsp;&times;&nbsp;N attention matrix
                simply could not fit on a GPU. Approximate attention methods offered one path around
                this wall, but at the cost of accuracy. In 2022, Tri Dao and colleagues at Stanford
                identified that the real bottleneck was not arithmetic operations but memory bandwidth
                &mdash; and that exact attention could be computed with a fundamentally different
                memory access pattern. Flash Attention changed the trajectory of long-context LLM research.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Bottleneck Established</div>
                    <div className="ch-tl-title">Standard Attention and Its Quadratic Memory Cost</div>
                    <div className="ch-tl-body">
                        The original Transformer (Vaswani et al., 2017) computed attention as
                        S&nbsp;=&nbsp;QK&#7488;, producing an N&times;N score matrix stored in GPU
                        high-bandwidth memory (HBM). Softmax was applied across each row of S to
                        produce A, then the output O&nbsp;=&nbsp;AV was computed. At every step,
                        S and A had to be written to HBM and read back. For
                        N&nbsp;=&nbsp;2048 and head dimension d&nbsp;=&nbsp;64: the score matrix
                        holds 2048&#178;&nbsp;&asymp;&nbsp;4M entries, costing 8&nbsp;MB per head per
                        layer in float16. For N&nbsp;=&nbsp;32768: 32768&#178;&nbsp;&asymp;&nbsp;1B
                        entries &mdash; 2&nbsp;GB per head. A single A100 (40&nbsp;GB HBM) would
                        exhaust its memory on the attention matrices of just 20 layer-heads at
                        32K context. The quadratic memory cost was the fundamental barrier to
                        long-context training.
                    </div>
                    <div className="ch-tl-impact">Impact: Established O(N&#178;) HBM memory as the defining constraint on Transformer context length</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019&ndash;2021</div>
                    <div className="ch-tl-section-label">Approximate Workarounds</div>
                    <div className="ch-tl-title">Reformer, Linformer, Longformer, BigBird</div>
                    <div className="ch-tl-body">
                        A wave of efficient-attention papers proposed approximations to avoid
                        materializing the full N&times;N matrix.{" "}
                        <strong>Reformer</strong> (Kitaev et al., 2020) used locality-sensitive
                        hashing to group similar queries and keys, approximating attention in
                        O(N log N).{" "}
                        <strong>Linformer</strong> (Wang et al., 2020) projected keys and values
                        to a low-rank subspace, achieving O(N) complexity.{" "}
                        <strong>Longformer</strong> and <strong>BigBird</strong> used sparse
                        local&nbsp;+&nbsp;global attention patterns, attending to a fixed window
                        of nearby tokens plus a small set of global tokens.
                        None of these methods achieved widespread adoption in production training
                        stacks: each introduced approximation error that degraded downstream
                        quality, and all required non-trivial changes to model architecture. The
                        community was searching for exact attention with better scaling.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that approximate attention traded quality for efficiency; no method became the standard training algorithm</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">Flash Attention &mdash; Dao et al. (Stanford)</div>
                    <div className="ch-tl-body">
                        &ldquo;FlashAttention: Fast and Memory-Efficient Exact Attention with
                        IO-Awareness&rdquo; (Dao et al., NeurIPS 2022). The key insight was a
                        hardware observation: a modern GPU has two tiers of memory with a 10&times;
                        bandwidth gap. HBM (off-chip, 40&ndash;80&nbsp;GB, ~2&nbsp;TB/s) is large
                        and slow; SRAM (on-chip, ~20&nbsp;MB total across all streaming
                        multiprocessors, ~20&nbsp;TB/s) is tiny and fast. Standard attention is
                        HBM-bound: every intermediate result (S, A) is written to HBM and read
                        back, burning bandwidth on data the algorithm only needs momentarily.
                        Flash Attention tiles Q, K, V into blocks small enough to fit in SRAM,
                        computes attention within each block entirely on-chip, and uses an online
                        softmax recurrence to accumulate the correct result across tiles without
                        ever writing S or A to HBM. Result: exact attention, O(N) HBM footprint
                        (down from O(N&#178;)), 2&ndash;4&times; wall-clock speedup on A100.
                    </div>
                    <div className="ch-tl-impact">Impact: Exact attention at O(N) HBM memory; 2&ndash;4&times; speedup; redefined what long-context training was possible</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Rapid Adoption</div>
                    <div className="ch-tl-title">Integration into PyTorch, HuggingFace, Megatron-LM</div>
                    <div className="ch-tl-body">
                        Flash Attention&rsquo;s adoption was exceptionally fast for a research paper.
                        Within months of the NeurIPS publication, it was integrated into PyTorch
                        2.0 as{" "}
                        <code>torch.nn.functional.scaled_dot_product_attention</code> (which
                        dispatches to the Flash Attention CUDA kernel when the inputs satisfy
                        the required conditions). HuggingFace Transformers added native Flash
                        Attention support across GPT, LLaMA, Mistral, and other architectures.
                        NVIDIA&rsquo;s Megatron-LM &mdash; the training framework behind many
                        frontier models &mdash; adopted it as the default attention implementation.
                        GPT-4 is widely believed to use Flash Attention. LLaMA&nbsp;2 explicitly
                        acknowledges it in the paper. By 2023 it was the de facto standard for
                        any serious LLM training.
                    </div>
                    <div className="ch-tl-impact">Impact: Became the default attention kernel in every major LLM training stack within one year of publication</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Iteration</div>
                    <div className="ch-tl-title">Flash Attention 2 &mdash; Improved GPU Utilization</div>
                    <div className="ch-tl-body">
                        Dao (2023) identified that Flash Attention 1&rsquo;s main remaining
                        bottleneck was suboptimal thread-block scheduling on the GPU. FA1 achieved
                        only ~35% of an A100&rsquo;s theoretical FLOP/s because softmax rescaling
                        required warp synchronization barriers that stalled other warps. FA2
                        repartitioned the work: the outer loop iterates over query blocks (instead
                        of key/value blocks), allowing each thread block to be fully independent
                        with no inter-warp communication during the forward pass. The backward
                        pass was also restructured to parallelize over the sequence dimension.
                        On A100: FA2 achieves ~230&nbsp;TFLOP/s (~50&ndash;73% of theoretical
                        peak) vs. ~73&nbsp;TFLOP/s for FA1 and ~25&nbsp;TFLOP/s for standard
                        PyTorch attention.
                    </div>
                    <div className="ch-tl-impact">Impact: 3&times; FLOP/s utilization improvement over FA1; became the default implementation in virtually all frameworks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Hardware Specialization</div>
                    <div className="ch-tl-title">Flash Attention 3, FlashDecoding, and H100 Variants</div>
                    <div className="ch-tl-body">
                        Flash Attention 3 (Shah et al., 2024) targeted NVIDIA H100&rsquo;s new
                        warp-specialized programming model and FP8 tensor core support. The H100
                        separates warp execution into &ldquo;producer&rdquo; and &ldquo;consumer&rdquo;
                        warps, allowing async memory copies to overlap with arithmetic. FA3 exploited
                        this to pipeline data loading and GEMM execution, achieving ~74% of H100
                        theoretical FP16 peak and ~1.5&ndash;2&times; speedup over FA2 on H100.
                        Separately, <strong>FlashDecoding</strong> (Dao et al., 2023) addressed
                        the inference regime: during autoregressive decoding, each step processes a
                        single new token against a long KV cache, under-utilizing the GPU&rsquo;s
                        parallelism. FlashDecoding introduced split-K parallelism &mdash; splitting
                        the key/value sequence across thread blocks &mdash; recovering GPU utilization
                        in the long-context inference setting. Variants for AMD ROCm followed.
                    </div>
                    <div className="ch-tl-impact">Impact: FA3 achieves 74% H100 peak; FlashDecoding addresses the inference bottleneck that FA2 left unsolved</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Downstream Impact</div>
                    <div className="ch-tl-title">The Long-Context Era Made Practical</div>
                    <div className="ch-tl-body">
                        Flash Attention&rsquo;s O(N) HBM memory footprint directly unlocked
                        context lengths that were previously impossible to train or serve.
                        Anthropic&rsquo;s Claude reached 100K context; Google&rsquo;s Gemini 1.5
                        extended to 1M tokens; specialized models demonstrated 2M+ token contexts.
                        Without Flash Attention, a 100K context at standard attention would
                        require 100000&#178;&nbsp;&asymp;&nbsp;10B attention matrix entries per
                        head &mdash; 20&nbsp;GB in float16, filling an entire A100 with a single
                        head&rsquo;s attention matrix. The entire long-context era of 2023&ndash;2024
                        was made practically feasible by this one algorithm change.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled 100K&ndash;1M token context lengths; the long-context era is a direct consequence of Flash Attention</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core insight:</strong> Flash Attention is not a mathematical
                approximation &mdash; it computes the exact same result as standard attention.
                The innovation is purely algorithmic: reordering memory access patterns to
                exploit the GPU&rsquo;s on-chip SRAM, which is 10&times; faster than HBM but
                only ~20&nbsp;MB in total. By tiling the computation and maintaining running
                softmax statistics, Flash Attention eliminates the need to ever write the
                N&times;N attention matrix to slow memory. IO-awareness &mdash; treating memory
                bandwidth as the binding constraint, not FLOPs &mdash; is the lesson that
                generalizes far beyond attention.
            </div>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>Flash Attention: doing math at the desk instead of the filing cabinet</h2>

            <Analogy label="The Speed vs. Distance Problem">
                A GPU has two kinds of memory: a tiny desk (SRAM) that is right in front of
                you and insanely fast, and a huge filing cabinet across the room (HBM) that
                holds everything but takes much longer to reach. Standard attention constantly
                walks to the filing cabinet to write out a giant table (the N&times;N attention
                matrix) and then walk back to read it again. Flash Attention does all its work
                at the desk, only visiting the filing cabinet to pick up small chunks of data
                at a time &mdash; and it never leaves a giant table lying around in the cabinet.
            </Analogy>

            <Analogy label="Tiling: Do the Work in Pieces">
                Imagine you need to add up all the products on a 1000&times;1000 multiplication
                table, but your desk only fits a 10&times;10 section at once. Instead of
                printing the entire table (filling the filing cabinet), you work through
                10&times;10 tiles: grab a tile, do the arithmetic, write down one small
                running total, put the tile back, get the next tile. When you&rsquo;re done,
                your running total is exactly right &mdash; you never needed the full table
                at once. That is Flash Attention&rsquo;s tiling strategy.
            </Analogy>

            <Analogy label="The Online Softmax Trick">
                Softmax needs to know the largest value in an entire row before it can
                compute the probabilities &mdash; but Flash Attention processes the row
                in chunks. The trick: keep a running maximum as you go. When you see a
                new chunk with a bigger number, you rescale everything you&rsquo;ve computed
                so far to match. Like computing the average of a stream of numbers by
                updating a running total and count &mdash; you never need to store all the
                numbers at once. The math works out exactly; nothing is approximated.
            </Analogy>

            <Analogy label="Exact, Not Approximate">
                Earlier attempts to make attention faster (Linformer, Reformer) changed the
                math to skip some calculations &mdash; like rounding numbers to save time.
                Flash Attention does not skip anything. It computes the mathematically
                identical result to standard attention. If you compare the output of Flash
                Attention and standard attention on the same input, the numbers match to
                floating-point precision. Faster, less memory, zero quality loss.
            </Analogy>

            <Analogy label="2&ndash;4&times; Faster with No Accuracy Trade-Off">
                On a real A100 GPU training a language model with sequence length 2048:
                Flash Attention is 2&ndash;4&times; faster than standard PyTorch attention
                and uses a fraction of the GPU memory. This is why it was adopted by every
                major LLM framework &mdash; PyTorch, HuggingFace, NVIDIA Megatron &mdash;
                within months of the paper&rsquo;s release. Same model quality. Same math.
                Just dramatically less time and memory.
            </Analogy>

            <Analogy label="Why Long Contexts Were Impossible Before">
                For a sequence of 32,768 tokens, the standard attention matrix has
                32768&times;32768&nbsp;&asymp;&nbsp;1 billion entries. In float16, that is
                2&nbsp;GB per attention head per layer. An A100 has 40&nbsp;GB total &mdash;
                so just 20 attention heads would fill the entire GPU with nothing but
                attention matrices, leaving no room for the model weights or anything else.
                Flash Attention never stores that matrix, so 32K contexts become routine.
                100K contexts became possible. 1M contexts followed. The long-context era
                was enabled by this one algorithmic insight.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>The mathematics of IO-aware exact attention</h2>

            <h3>Standard Attention: IO Complexity Analysis</h3>
            <p>
                Standard attention executes four HBM-bound operations for a single head.
                Let N be the sequence length, d the head dimension. Each matrix is stored
                in HBM as float16 (2 bytes per element):
            </p>
            <MathBlock tex="\underbrace{S = QK^\top}_{\text{(B, N, N) HBM write: } O(N^2)}, \quad \underbrace{A = \operatorname{softmax}(S / \sqrt{d})}_{\text{(B, N, N) HBM read+write: } O(N^2)}, \quad \underbrace{O = AV}_{\text{(B, N, d) HBM write: } O(Nd)}" />
            <p>
                Total HBM accesses (reads + writes): O(Nd&nbsp;+&nbsp;N&#178;). For practical
                values N&nbsp;=&nbsp;2048 and d&nbsp;=&nbsp;64: N&#178;&nbsp;=&nbsp;4.2M
                vs.&nbsp;Nd&nbsp;=&nbsp;131K. The N&#178; term dominates by 32&times; at this
                sequence length and by 512&times; at N&nbsp;=&nbsp;32768. Memory bandwidth
                is the binding constraint, not arithmetic throughput.
            </p>
            <MathBlock tex="\text{HBM bytes (standard)} = 4N^2 \cdot 2 \;\text{bytes} \quad (\text{S write, S read, A write, A read})" />

            <h3>Flash Attention: Tiled Computation</h3>
            <p>
                Partition Q into blocks of row-size B&#7523; and K, V into blocks of column-size
                B&#7520;, chosen so that one triple (Q&#7522;, K&#11785;, V&#11785;) fits in
                SRAM. For each block pair, compute local attention scores, update running
                softmax statistics m&#7522; (running maximum) and l&#7522; (running denominator),
                and accumulate the output O&#7522; &mdash; all without writing intermediates to HBM.
            </p>
            <MathBlock tex="S_{ij} = Q_i K_j^\top \in \mathbb{R}^{B_r \times B_c} \quad\text{(computed in SRAM, never written to HBM)}" />
            <MathBlock tex="\text{HBM bytes (Flash)} = O(Nd) \quad\text{(only Q, K, V reads and O write)}" />
            <p>
                The ratio of HBM accesses saved is N/d. For N&nbsp;=&nbsp;32768 and
                d&nbsp;=&nbsp;64: that is 512&times; fewer HBM bytes for the attention
                intermediate results &mdash; explaining the observed wall-clock speedup
                even though the total FLOPs are slightly higher (due to recomputation in the
                backward pass).
            </p>

            <h3>Online Softmax with Running Statistics</h3>
            <p>
                Standard softmax over row i of S requires the full row to compute the
                normalizer. Flash Attention replaces this with an online recurrence. After
                processing tile j, the running statistics are updated as follows:
            </p>
            <MathBlock tex="m_i^{(j)} = \max\!\left(m_i^{(j-1)},\; \max_k S_{ij_k}\right)" />
            <MathBlock tex="l_i^{(j)} = l_i^{(j-1)} \cdot e^{m_i^{(j-1)} - m_i^{(j)}} \;+\; \sum_k e^{S_{ij_k} - m_i^{(j)}}" />
            <MathBlock tex="O_i^{(j)} = O_i^{(j-1)} \cdot e^{m_i^{(j-1)} - m_i^{(j)}} \;+\; e^{S_{ij} - m_i^{(j)}} V_j" />
            <p>
                After the final tile T, the output is O&#7522;&nbsp;=&nbsp;O&#7522;&#8317;&#7488;&#8318;
                &nbsp;/&nbsp;l&#7522;&#8317;&#7488;&#8318;. This equals the exact softmax result.
                The rescaling factor exp(m&#8347;&#8320;&#8321;&#8330;&#8317;&#7480;&#8315;&#185;&#8318;&nbsp;&minus;&nbsp;m&#8347;&#8320;&#8321;&#8330;&#8317;&#7480;&#8318;)
                corrects for the change in running maximum between tiles, ensuring numerical
                stability throughout.
            </p>

            <h3>Backward Pass: Recomputation vs. Storage</h3>
            <p>
                The attention backward pass requires the attention matrix A to compute
                gradients dQ, dK, dV. Standard attention stores A during the forward pass
                (O(N&#178;) memory). Flash Attention instead discards A and recomputes it from
                Q, K during the backward pass using the same tiled algorithm. The trade-off:
            </p>
            <MathBlock tex="\underbrace{\text{Standard backward}}_{\text{load A from HBM: } O(N^2) \text{ HBM reads}} \quad\text{vs.}\quad \underbrace{\text{Flash backward}}_{\text{recompute A in SRAM: } O(N^2) \text{ extra FLOPs, } O(Nd) \text{ HBM reads}}" />
            <p>
                On modern GPUs, arithmetic is cheap relative to memory bandwidth. The A100
                can perform ~312&nbsp;TFLOP/s of FP16 arithmetic but only ~2&nbsp;TB/s of HBM
                bandwidth. Recomputing A costs extra FLOPs, but saving 2&times; the HBM reads
                of the N&#178; attention matrix is worth it. Flash Attention backward uses
                approximately 2&times; more FLOPs than standard attention backward but achieves
                similar or faster wall-clock time due to reduced HBM traffic.
            </p>

            <h3>Flash Attention 2: Thread-Block Parallelism</h3>
            <p>
                FA1&rsquo;s remaining bottleneck was warp-level serialization. In FA1, the outer
                loop iterates over K/V blocks, with softmax rescaling requiring synchronization
                between warps sharing the same output row. FA2 swaps the loop order: the outer
                loop iterates over Q blocks. Each thread block handles an independent set of
                query rows, eliminating inter-warp communication in the forward pass. GPU
                utilization (fraction of theoretical peak FLOP/s achieved) improved as follows:
            </p>
            <MathBlock tex="\text{Utilization} = \frac{\text{Observed FLOP/s}}{\text{Peak FLOP/s}} \;:\quad \text{Standard} \approx 8\%,\quad \text{FA1} \approx 35\%,\quad \text{FA2} \approx 60\%" />
            <p>
                FA2 also partitioned the backward pass across the sequence dimension,
                enabling larger effective batch sizes and better occupancy on long-sequence
                workloads.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Online softmax proof &middot; SRAM block-size optimization</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Standard attention vs. Flash Attention &middot; timing &middot; memory comparison</span>
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
            <h2>Online softmax derivation and SRAM block-size optimization</h2>

            <DefBlock label="Claim: Online Recurrence Produces Exact Softmax">
                Let row i of S have entries s&#7522;&#8321;, s&#7522;&#8322;, &hellip;, s&#7522;ₙ processed in tiles
                of size B&#7520;. The online recurrence defined above produces the unique output:
            </DefBlock>
            <MathBlock tex="O_i = \operatorname{softmax}(s_{i,1},\ldots,s_{i,N}) \cdot V" />
            <p>
                <strong>Proof sketch.</strong> Define the true softmax denominator
                Z&#7522;&nbsp;=&nbsp;&Sigma;&#8337; exp(s&#7522;&#8337;&nbsp;&minus;&nbsp;m&#7522;) where
                m&#7522;&nbsp;=&nbsp;max&#8337; s&#7522;&#8337; (safe softmax normalization). After
                tile j, the running denominator l&#7522;&#8317;&#7490;&#8318; equals:
            </p>
            <MathBlock tex="l_i^{(j)} = \sum_{k=1}^{j \cdot B_c} \exp\!\left(s_{ik} - m_i^{(j)}\right)" />
            <p>
                When the maximum increases from m&#7522;&#8317;&#7480;&#8315;&#185;&#8318; to m&#7522;&#8317;&#7480;&#8318;, all
                previous exponentials must be rescaled by
                exp(m&#7522;&#8317;&#7480;&#8315;&#185;&#8318;&nbsp;&minus;&nbsp;m&#7522;&#8317;&#7480;&#8318;). This is the
                &ldquo;correction factor&rdquo; in the recurrence. After the final tile T:
            </p>
            <MathBlock tex="l_i^{(T)} = \sum_{k=1}^{N} \exp\!\left(s_{ik} - m_i^{(T)}\right) = Z_i" />
            <p>
                The accumulated output O&#7522;&#8317;&#7488;&#8318; is the sum of exp(s&#7522;&#8337;&nbsp;&minus;&nbsp;m&#7522;&#8317;&#7488;&#8318;)&nbsp;&times;&nbsp;V&#8337;
                over all j. Dividing by l&#7522;&#8317;&#7488;&#8318;&nbsp;=&nbsp;Z&#7522; gives exactly
                the standard softmax-weighted sum. &#8718;
            </p>

            <h3>SRAM Block Size Optimization</h3>
            <p>
                The block sizes B&#7523; (query block rows) and B&#7520; (key/value block columns)
                are hyperparameters constrained by SRAM capacity. Each streaming
                multiprocessor (SM) on an A100 has 192&nbsp;KB of shared memory (SRAM).
                One attention tile requires three matrices in SRAM simultaneously:
            </p>
            <MathBlock tex="\text{SRAM usage} = \underbrace{B_r \cdot d}_{\text{Q block}} + \underbrace{B_c \cdot d}_{\text{K block}} + \underbrace{B_c \cdot d}_{\text{V block}} + \underbrace{B_r \cdot B_c}_{\text{S block}} \leq M_{\text{SRAM}}" />
            <p>
                For d&nbsp;=&nbsp;64, float16 (2 bytes), M&#8336;&#8345;&#8344;&#8331;&nbsp;=&nbsp;192&nbsp;KB&nbsp;=&nbsp;98304 elements,
                the constraint becomes B&#7523;(2d&nbsp;+&nbsp;B&#7520;)&nbsp;+&nbsp;dB&#7520;&nbsp;&leq;&nbsp;98304.
                The number of HBM reads of Q, K, V is:
            </p>
            <MathBlock tex="\text{HBM reads} = \left\lceil \frac{N}{B_r} \right\rceil \cdot Nd + Nd = O\!\left(\frac{N^2 d}{B_r} + Nd\right)" />
            <p>
                To minimize HBM reads, maximize B&#7523;. The optimal strategy (Dao et al.)
                sets B&#7523;&nbsp;=&nbsp;B&#7520;&nbsp;=&nbsp;&lfloor;M&#8336;&#8345;&#8344;&#8331;&nbsp;/&nbsp;(4d)&rfloor;
                under the symmetric approximation (dropping the B&#7523;&middot;B&#7520; term, which
                is small when d&nbsp;&gg;&nbsp;1). For d&nbsp;=&nbsp;64 and M&nbsp;=&nbsp;98304 elements:
                B&#8338;&nbsp;&asymp;&nbsp;384, meaning tiles of 384 tokens each fit in SRAM.
            </p>

            <div className="ch-callout">
                <strong>The deeper lesson &mdash; IO complexity as algorithm design:</strong>{" "}
                Flash Attention introduced the idea that asymptotic HBM access count (IO
                complexity) is the right complexity measure for GPU algorithms, not FLOPs.
                The same framework &mdash; tiling to fit in fast on-chip memory, maintaining
                running statistics to avoid re-reading data &mdash; applies to matrix
                multiplication (already exploited in cuBLAS), layer normalization,
                and other attention variants. Flash Attention made IO-awareness a first-class
                design criterion in deep learning systems research.
            </div>
        </>
    )
}

// ── Python Content ────────────────────────────────────────────────────────────

function PythonContent() {
    return (
        <>
            <p>
                Side-by-side comparison of standard attention (materializes the full N&times;N
                matrix in HBM) vs. Flash Attention via{" "}
                <code>torch.nn.functional.scaled_dot_product_attention</code> (dispatches to
                the Flash Attention CUDA kernel on compatible hardware). Includes timing,
                memory footprint table, and numerical equivalence check.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="flash_attention_benchmark.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const FLASH_ATTENTION_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
