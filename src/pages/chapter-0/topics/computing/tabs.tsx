import type { TabId } from "../../types"
import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import { CpuGpuDiagram, MemoryHierarchyDiagram, DiagramBlock } from "./diagrams"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">The challenge</div>
            <div className="ch-tl-body">{item.challenge}</div>
            <div className="ch-tl-section-label">What was introduced</div>
            <div className="ch-tl-body">{item.what}</div>
            <div className="ch-tl-section-label">Why it mattered</div>
            <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
        </div>
    )
}

function HistoryTab() {
    const items: TimelineItem[] = [
        {
            year: "1945 — Eckert & Mauchly — ENIAC",
            title: "Sequential computing: one instruction at a time",
            challenge:
                "Scientists needed fast numerical calculation for ballistics tables, weather prediction, and nuclear simulations. Human \"computers\" — rooms of people with mechanical calculators — took weeks to compute a single artillery trajectory.",
            what:
                "The Electronic Numerical Integrator and Computer (ENIAC) was the first programmable general-purpose electronic computer: 18,000 vacuum tubes, 5,000 additions per second. It followed the von Neumann architecture that all computers still use — a CPU fetches an instruction from memory, decodes it, executes it, writes the result back, and repeats. One instruction stream, one step at a time.",
            impact:
                "Every CPU today descends from this sequential model. Over 70 years it evolved into an extraordinarily fast single-threaded processor with deep caches, branch prediction, and out-of-order execution. But it remained fundamentally sequential. ML requires a radically different shape of computation — the same arithmetic done millions of times in parallel — which the von Neumann CPU was never designed for.",
        },
        {
            year: "1965 — Gordon Moore — Moore's Law",
            title: "Forty years of free performance",
            challenge:
                "After ENIAC, the bottleneck was transistor density. More transistors meant faster, more capable chips — but fabricating them was expensive and difficult. There was no obvious trajectory for how computing power would evolve.",
            what:
                "Intel co-founder Gordon Moore observed that transistor count on a chip doubled roughly every 18–24 months at constant cost. This was not a physical law — it was an engineering and economic trajectory that the semiconductor industry self-fulfilled through sustained investment in lithography and chip design.",
            impact:
                "For four decades, software got faster for free — just wait for the next chip generation. By 2005 this stalled: clock speeds hit a wall as power and heat became limiting factors. The industry pivoted to multi-core CPUs. But ML requires far more parallelism than 4–16 cores can provide. This failure of single-threaded scaling is precisely why GPUs — massively parallel chips — became the engine of the deep learning revolution.",
        },
        {
            year: "1999 — NVIDIA — GeForce 256",
            title: "Graphics cards become parallel processors",
            challenge:
                "Video games need to apply the same rendering calculation to millions of pixels every frame — an inherently parallel problem. CPUs with a few fast cores were the wrong architecture. Dedicated hardware was needed, but existing graphics chips were fixed-function and not programmable.",
            what:
                "The GeForce 256, marketed as the first GPU, brought hardware transform and lighting to consumer graphics. Instead of a few complex cores optimised for sequential logic, it had hundreds of simpler execution units all performing the same operation on different pixels simultaneously — Single Instruction, Multiple Data (SIMD). The architecture prioritised raw parallel throughput over per-thread intelligence.",
            impact:
                "The GPU accidentally became the perfect machine for ML. Matrix multiplication — the core operation of every neural network layer — is embarrassingly parallel: each output element is an independent dot product and can be computed simultaneously. Researchers in the early 2000s noticed that training neural networks on GPUs (via hacked OpenGL shader code) was dramatically faster than CPUs. This observation eventually changed the entire field.",
        },
        {
            year: "2006 — NVIDIA — CUDA 1.0",
            title: "GPUs become general-purpose",
            challenge:
                "By 2006, researchers knew GPUs were fast for parallel math, but programming them required encoding computations as fake textures and shaders — a painful and limited workaround using a graphics API never designed for scientific computing.",
            what:
                "CUDA (Compute Unified Device Architecture) let programmers write C-like code that executed across thousands of GPU threads. A CUDA kernel launches as a grid of thread blocks; each block runs on a Streaming Multiprocessor (SM) with shared memory and registers. Threads within a warp (32 threads) execute the same instruction in lockstep — Single Instruction, Multiple Threads (SIMT). Divergent branches serialise the warp.",
            impact:
                "CUDA made GPUs general-purpose. When Alex Krizhevsky trained AlexNet on two GTX 580s in 2012 — slashing ImageNet top-5 error from 26.2% to 15.3% — he used CUDA. Every major ML framework today (PyTorch, TensorFlow, JAX) compiles down to CUDA kernels. Understanding CUDA means understanding why your model trains 50× faster on a GPU than a CPU.",
        },
        {
            year: "2016 — Google — TPU v1",
            title: "Custom silicon for matrix multiply",
            challenge:
                "As ML inference scaled to billions of requests per day at Google, even fast GPUs were not efficient enough. GPUs are general-purpose parallel processors — they support diverse compute patterns (texture sampling, rasterisation, ray tracing) that are irrelevant to ML inference. Those transistors represent wasted power and area.",
            what:
                "The Tensor Processing Unit (TPU) is an ASIC (Application-Specific Integrated Circuit) designed exclusively for matrix multiply. Its core is a 256×256 systolic array: a mesh of multiply-accumulate units where data flows through like water in a pipe — each unit multiplies two values, accumulates the result, and passes outputs to the next unit. No cache hierarchy, no branch prediction, no wasted logic.",
            impact:
                "TPU v1 achieved 92 TOPS (tera-operations per second) with a fraction of the power of a contemporary GPU — 30–80× more efficient for inference. This proved that hardware-software co-design (building silicon specifically for a known workload) crushes general-purpose hardware. Google's LLMs (PaLM, Gemini) train on pods of thousands of TPUs, and this hardware advantage is one reason large-scale LLM training is economically feasible at all.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <TlItem key={item.year} item={item} />
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>How computers run AI — in plain terms</h2>

            <Analogy label="CPU = one brilliant chef, GPU = 1000 line cooks">
                Imagine making sandwiches for a school. A brilliant chef can make any sandwich —
                complicated recipes, special requests, adjusting on the fly. But they make them one at a time.
                <br /><br />
                Now imagine 1,000 line cooks, each trained to do one simple step simultaneously.
                One spreads the butter, one slices the bread, one adds the filling — all at the same time.
                For making 1,000 identical sandwiches, the assembly line crushes the lone chef.
                <br /><br />
                That is the CPU vs GPU. The CPU is brilliant but sequential — perfect for web browsers,
                spreadsheets, any task that branches unpredictably. The GPU has thousands of simpler
                processors doing the <em>same</em> thing simultaneously — perfect for AI, where every
                layer of a neural network is just multiplying and adding millions of numbers at once.
            </Analogy>

            <Analogy label="Memory = desk, bookshelf, warehouse">
                Think about studying. Some things you hold in your head right now (fastest — like a CPU
                register). Your desk has a few open notebooks (L1 cache — tiny, ultra-fast). The bookshelf
                behind you has more (RAM — large but takes a moment). The library two blocks away has
                everything but takes minutes to fetch (hard disk — enormous, slow).
                <br /><br />
                The golden rule: the closer the data, the faster the computer. Training a neural network
                means repeatedly using the same weights and numbers. If they fit on the "desk" (fast GPU
                memory), training flies. If the GPU keeps fetching from the "warehouse" (CPU RAM or disk),
                it stalls and waits most of the time.
            </Analogy>

            <Analogy label="Why AI needs GPUs — parallel maths">
                A neural network layer is just: for every neuron in the output, multiply each input by
                a weight, add them all up. Do that for a thousand neurons. Do it for a batch of a hundred
                examples. That is millions of identical multiply-and-add operations with no special logic.
                <br /><br />
                A CPU with 8 cores does 8 at once. A GPU with 10,000 cores does 10,000 at once. The GPU
                finishes the same work 1,000× faster. This is not magic — it is the right architecture
                for the right job.
            </Analogy>

            <Analogy label="Moving data between CPU and GPU is expensive">
                Your GPU is like a fast kitchen far from the main pantry (CPU RAM). Every time you need
                new ingredients, someone has to carry them down the hallway (PCIe bus). That hallway is
                much slower than working inside the kitchen.
                <br /><br />
                Good AI code loads all the data into the kitchen at the start (move tensors to GPU once)
                and keeps cooking (computation) without running back to the pantry (avoid CPU↔GPU transfers
                in hot loops). When you see <code>tensor.cuda()</code> in PyTorch, that is the carry trip.
                Do it once per batch, not once per operation.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Cores, caches, and the memory wall</h2>

            <p>
                Understanding why GPUs dominate ML comes down to one idea: ML is <strong>embarrassingly
                parallel</strong> — the same arithmetic applied to millions of independent elements. The
                hardware that wins is the one built for that shape of work.
            </p>

            <DiagramBlock title="CPU vs GPU — few powerful cores vs thousands of simple ones">
                <CpuGpuDiagram />
            </DiagramBlock>

            <h3>CPU architecture</h3>
            <p>
                A modern CPU has 4–32 large, complex cores. Each core has deep hardware for sequential
                speed: <strong>out-of-order execution</strong> (reorders instructions to avoid stalls),
                <strong>branch prediction</strong> (guesses which path an if-statement takes),
                <strong>speculative execution</strong> (computes down both branches pre-emptively), and
                large private caches (L1: 32–64 KB, L2: 256 KB–1 MB per core). Clock speeds run 3–5 GHz.
                A single CPU core is the fastest thing alive for sequential, branchy code — compilers,
                databases, web servers, anything that jumps around unpredictably.
            </p>

            <h3>GPU architecture</h3>
            <p>
                A modern GPU has thousands of small <strong>CUDA cores</strong> grouped into
                <strong>Streaming Multiprocessors (SMs)</strong> — each SM has 64–128 cores and manages
                a pool of 32-thread <strong>warps</strong>. Every thread in a warp executes the
                same instruction simultaneously (SIMT — Single Instruction, Multiple Threads). If threads
                diverge (different if-branches), the warp serialises — half the cores sit idle.
                Clock speeds run ~1–2 GHz, slower per core than a CPU. But with 10,000+ cores, aggregate
                throughput crushes the CPU for regular, predictable work.
            </p>

            <h3>Memory hierarchy</h3>
            <p>
                Every level of memory trades off size for speed. Fast memory (registers, L1 cache) is
                tiny and close to the compute units. Slow memory (RAM, disk) is vast but far away.
                The gap between the fastest and slowest levels spans six orders of magnitude in latency.
            </p>

            <DiagramBlock title="Memory hierarchy — size vs speed">
                <MemoryHierarchyDiagram />
            </DiagramBlock>

            <h3>The memory wall</h3>
            <p>
                Modern GPUs can execute hundreds of TFLOPS — but they can only feed data at
                ~1–2 TB/s from VRAM. If each operation reads 4 bytes and does 1 FLOP,
                maximum sustained throughput is limited to ~250–500 GFLOPS — a fraction of peak.
                Operations that do little math per byte fetched (element-wise adds, ReLU) are
                <strong>memory-bound</strong>: compute units sit idle waiting for data.
                Operations that reuse data heavily (matrix multiply) are <strong>compute-bound</strong>:
                bytes fetched are divided among many FLOPs, so the hardware stays busy.
            </p>
            <p>
                This is why large batch sizes and large matrix dimensions matter in ML: bigger matrices
                give more FLOPs per byte, pushing operations from memory-bound into compute-bound territory
                where the GPU's peak throughput is actually achievable.
            </p>

            <h3>Vectorised operations on CPU (SIMD)</h3>
            <p>
                Even CPUs have parallel arithmetic via <strong>SIMD</strong> (Single Instruction,
                Multiple Data). AVX-512 instructions operate on 16 float32 values simultaneously in
                a single CPU cycle. NumPy automatically uses these via BLAS/LAPACK. This is why
                a NumPy element-wise add is 10–50× faster than a Python for-loop: it runs physically
                different instructions, not just the same logic faster.
            </p>

            <h3>PCIe — the expensive bridge</h3>
            <p>
                CPU RAM and GPU VRAM are separate physical memories connected by PCIe.
                Bandwidth is ~16–64 GB/s — fast in absolute terms, but 10–50× slower than VRAM
                bandwidth (600–1000 GB/s). Any <code>.cuda()</code> / <code>.cpu()</code> call
                crosses this bridge. The pattern in production ML: load data once, keep everything
                on the GPU, and only move results back to CPU at the very end.
            </p>

            <div className="ch-callout">
                <strong>Why ML and GPUs are a natural fit:</strong> Neural network training is almost
                entirely matrix multiplications (compute-bound, fully parallel, no branching) and
                element-wise activations (memory-bound but simple). There is no random access, no
                complex control flow, no dependency between outputs of the same layer. This is
                exactly the workload GPUs were built to handle — even before ML existed.
            </div>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>FLOP counting, arithmetic intensity, and the roofline model</h2>
            <p>
                These three tools let you predict, before running any code, whether an operation will
                be limited by compute or by memory bandwidth — and by how much.
            </p>

            <DefBlock label="Definition — FLOP">
                A floating-point operation (FLOP) is one multiply or add on a float. A multiply-accumulate
                (MAC, used in matrix multiply) counts as 2 FLOPs. Hardware peak is quoted in FLOP/s:
                the maximum rate if every execution unit is busy every cycle.
            </DefBlock>

            <h3>Counting FLOPs in matrix multiply</h3>
            <p>
                The matrix product C = AB where A ∈ ℝ^(m×k) and B ∈ ℝ^(k×n) computes m·n output
                elements. Each element is a dot product of length k: k multiplications and k−1
                additions ≈ 2k FLOPs. Total:
            </p>
            <MathBlock tex="\text{FLOPs}(A \cdot B) = 2 \cdot m \cdot k \cdot n" />
            <p>
                Example: a linear layer with weight W ∈ ℝ^(4096×4096) applied to a batch of 512 tokens:
            </p>
            <MathBlock tex="2 \times 512 \times 4096 \times 4096 \approx 17.2 \text{ GFLOPs per layer}" />
            <p>
                A transformer with 32 such layers processes {">"}500 GFLOPs per forward pass. On an
                80 TFLOPS GPU this takes ~6 ms — consistent with observed inference latencies.
            </p>

            <DefBlock label="Definition — Arithmetic Intensity">
                Arithmetic intensity I is the ratio of FLOPs performed to bytes of memory accessed
                (reads + writes). It measures how much computation the hardware gets per byte fetched.
            </DefBlock>
            <MathBlock tex="I = \frac{\text{FLOPs}}{\text{bytes accessed}} \quad [\text{FLOP/byte}]" />

            <h3>Arithmetic intensity of common operations</h3>
            <p>
                For float32 (4 bytes), a square matrix multiply of size n×n reads 2n² matrices and
                writes one n² result = 3n²·4 bytes. FLOPs = 2n³. Therefore:
            </p>
            <MathBlock tex="I_{\text{matmul}} = \frac{2n^3}{12n^2} = \frac{n}{6} \; \text{FLOP/byte}" />
            <p>
                At n = 4096: I ≈ 683 FLOP/byte — strongly compute-bound on any GPU.
                For element-wise ReLU: one max(0, x) per element, 4 bytes read + 4 bytes written = 8 bytes:
            </p>
            <MathBlock tex="I_{\text{ReLU}} = \frac{1}{8} = 0.125 \; \text{FLOP/byte}" />

            <h3>The roofline model</h3>
            <p>
                Given peak compute P (FLOP/s) and memory bandwidth B (bytes/s), achieved performance is
                bounded by whichever limit is hit first:
            </p>
            <MathBlock tex="\text{Performance} \leq \min\!\left(P,\; B \cdot I\right)" />
            <p>
                The crossover point I* = P / B is the ridge point. Operations with I {"<"} I* are
                <strong> memory-bound</strong>; those with I {">"} I* are <strong>compute-bound</strong>.
            </p>
            <p>
                Example: RTX 4090 — P = 82.6 TFLOPS (BF16), B = 1008 GB/s.
                Ridge point: I* = 82,600 / 1,008 ≈ 82 FLOP/byte.
            </p>
            <p>
                Matrix multiply at n=512 has I = 512/6 ≈ 85 {">"} 82: just barely compute-bound.
                At n=128: I = 21 {"<"} 82: memory-bound — the GPU is mostly idle waiting for data.
                This is why small batch sizes underutilise GPUs.
            </p>

            <h3>Amdahl's law — the limit of parallelism</h3>
            <p>
                If a fraction p of a workload is perfectly parallelisable and fraction (1−p) is
                strictly sequential, speedup on N processors is:
            </p>
            <MathBlock tex="S(N) = \frac{1}{(1-p) + \dfrac{p}{N}} \xrightarrow{N \to \infty} \frac{1}{1-p}" />
            <p>
                Example: if data loading takes 10% of wall time (sequential, CPU-bound) and GPU
                training takes 90%:
            </p>
            <MathBlock tex="S(\infty) = \frac{1}{0.1} = 10\times \text{ max speedup, regardless of GPU count}" />
            <p>
                This is why <code>DataLoader(num_workers=N)</code> and pre-fetching matter: the
                sequential fraction must be minimised before adding GPUs provides diminishing returns.
            </p>

            <h3>Warp divergence — when parallelism collapses</h3>
            <p>
                A GPU warp is 32 threads executing the same instruction each cycle. If threads take
                different branches (if-else), the warp serialises: it runs the if-branch with some
                threads active (others masked off), then reruns with the remaining threads for the
                else-branch. Effective throughput halves per divergence level.
            </p>
            <p>
                Neural networks avoid this naturally: ReLU is a single <code>max(0, x)</code> with no
                true branching, softmax is a sequence of element-wise operations, and matrix multiply
                has no conditionals. This regularity is a deliberate design advantage — it maps
                cleanly onto the SIMT execution model.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> The arithmetic intensity of an operation determines
                whether it is memory- or compute-bound on given hardware. Large matrix multiplications
                have intensity ~n/6 — a linear function of size. This means scaling up sequence length,
                batch size, or model width simultaneously increases work and pushes operations toward the
                compute-bound regime where the GPU's full throughput is utilised.
            </div>
        </>
    )
}

const PY_CODE = `import time
import torch
import numpy as np

# ── Device detection ──────────────────────────────────────────────────────
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available:  {torch.cuda.is_available()}")

if torch.cuda.is_available():
    props = torch.cuda.get_device_properties(0)
    print(f"GPU:             {props.name}")
    print(f"VRAM:            {props.total_memory / 1e9:.1f} GB")
    print(f"SMs:             {props.multi_processor_count}")
    print(f"CUDA version:    {torch.version.cuda}")

# ── CPU vs GPU matmul benchmark ───────────────────────────────────────────
N = 4096
flops = 2 * N**3  # FLOPs for one matmul: 2 * m * k * n
print(f"\\nMatrix: {N}×{N}  →  {flops/1e9:.1f} GFLOP per matmul")

A = torch.randn(N, N)
B = torch.randn(N, N)

n_iters = 5

# CPU
t0 = time.perf_counter()
for _ in range(n_iters):
    C = torch.mm(A, B)
cpu_ms = (time.perf_counter() - t0) / n_iters * 1000
cpu_tflops = (flops / (cpu_ms / 1000)) / 1e12
print(f"\\nCPU:  {cpu_ms:.1f} ms  →  {cpu_tflops:.3f} TFLOPS")

if torch.cuda.is_available():
    A_gpu = A.cuda()
    B_gpu = B.cuda()

    # Warm up — first call has overhead from kernel compilation
    _ = torch.mm(A_gpu, B_gpu)
    torch.cuda.synchronize()  # GPU ops are async; sync before timing

    t0 = time.perf_counter()
    for _ in range(n_iters):
        C_gpu = torch.mm(A_gpu, B_gpu)
    torch.cuda.synchronize()  # must sync before stopping the clock
    gpu_ms = (time.perf_counter() - t0) / n_iters * 1000
    gpu_tflops = (flops / (gpu_ms / 1000)) / 1e12

    print(f"GPU:  {gpu_ms:.1f} ms  →  {gpu_tflops:.3f} TFLOPS")
    print(f"Speedup: {cpu_ms / gpu_ms:.1f}×")

# ── Arithmetic intensity demo ─────────────────────────────────────────────
# matmul: I = n/6 FLOP/byte (compute-bound for large n)
# element-wise: I = 0.125 FLOP/byte (memory-bound)
for n in [128, 512, 2048, 4096]:
    intensity = n / 6
    bound = "compute-bound" if intensity > 82 else "memory-bound"  # RTX 4090 ridge ~82
    print(f"  matmul {n:4d}×{n}: I = {intensity:6.1f} FLOP/byte  →  {bound}")

# ── Data transfer cost ────────────────────────────────────────────────────
if torch.cuda.is_available():
    x = torch.randn(8000, 8000)  # ~256 MB tensor
    mb = x.element_size() * x.nelement() / 1e6

    t0 = time.perf_counter()
    for _ in range(10):
        x_gpu = x.cuda()
    torch.cuda.synchronize()
    transfer_ms = (time.perf_counter() - t0) / 10 * 1000

    bandwidth = mb / (transfer_ms / 1000) / 1000  # GB/s
    print(f"\\nPCIe transfer: {mb:.0f} MB  in {transfer_ms:.1f} ms  ({bandwidth:.1f} GB/s)")
    print("Tip: .cuda() once — avoid CPU↔GPU round-trips in training loops")

# ── Memory layout: strides and contiguity ─────────────────────────────────
a = torch.randn(1000, 1000)
b = a.T   # transpose — swaps strides, no data copy

print(f"\\na.stride():          {a.stride()}")          # (1000, 1) — row-major
print(f"a.T.stride():        {b.stride()}")            # (1, 1000) — column-major
print(f"a.is_contiguous():   {a.is_contiguous()}")     # True
print(f"a.T.is_contiguous(): {b.is_contiguous()}")     # False

# contiguous() forces a copy with a cache-friendly memory layout
c = b.contiguous()
print(f"a.T.contiguous():    {c.is_contiguous()}")     # True

# ── Device-agnostic code pattern ──────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"\\nDevice: {device}")

# Create tensors directly on the target device — no transfer cost
x = torch.randn(32, 512, device=device)   # batch 32, features 512
W = torch.randn(512, 256, device=device)  # weight matrix
y = x @ W                                  # stays on device

print(f"x: {tuple(x.shape)} on {x.device}")
print(f"y: {tuple(y.shape)} on {y.device}")`

function PythonTab() {
    return (
        <>
            <p>
                Practical code for benchmarking CPU vs GPU throughput, measuring data transfer cost,
                and understanding memory layout. These are the diagnostics every ML practitioner needs
                when a model trains slower than expected.
            </p>
            <CodeBlock code={PY_CODE} filename="gpu_computing.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key rules:</strong> (1) Always call <code>torch.cuda.synchronize()</code>
                before stopping a GPU timer — GPU ops are asynchronous. (2) Warm up before benchmarking —
                the first kernel call has JIT overhead. (3) Move tensors to GPU once; never copy
                back and forth in training loops. (4) Prefer creating tensors directly
                with <code>device=device</code> over creating on CPU then calling <code>.cuda()</code>.
            </div>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const COMPUTING_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
