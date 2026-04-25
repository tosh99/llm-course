import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>KV Cache</h2>
            <p className="ch-story-intro">
                The architectural innovations covered so far &mdash; RoPE, Flash Attention, GQA,
                and MoE &mdash; addressed training efficiency, positional encoding, and model
                capacity. But inference remained a separate bottleneck. Generating one token at
                a time autoregressively means running a forward pass for every new token over
                an ever-growing context window. Without caching, this is catastrophically
                expensive. The KV cache is the single optimization that makes autoregressive
                LLM deployment practical at scale: store the key and value projections of all
                previously generated tokens and reuse them rather than recomputing them at
                every step.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Foundation</div>
                    <div className="ch-tl-title">Autoregressive Generation Baseline &mdash; O(N&sup2;) Inference</div>
                    <div className="ch-tl-body">
                        The original Transformer (Vaswani et al., 2017) was designed primarily
                        for sequence-to-sequence tasks like translation, where the encoder and
                        decoder are computed in parallel at training time. But autoregressive
                        generation &mdash; producing one token at a time, each conditioned on
                        all previous tokens &mdash; was a different regime. Without any caching,
                        generating token t requires running the full Transformer forward pass
                        over all t tokens: attending from each of the t positions to every other
                        position. For t = 1000, this means 1000 full forward passes, each
                        attending to an increasing number of tokens. Total attention computation:
                        O(t&sup2;&sdot;d) for t tokens with hidden dimension d. Inference was
                        estimated to be 100&ndash;1000&times; slower per parameter than a single
                        training forward pass, making deployment of large models effectively
                        prohibitive.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the quadratic inference bottleneck that would drive the most impactful single optimization in LLM deployment history</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020 &ndash; 2021</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">KV Caching Becomes Standard &mdash; O(N) Amortized</div>
                    <div className="ch-tl-body">
                        The KV cache insight is simple but profound. At generation step t,
                        tokens 1&hellip;t&minus;1 have already been processed. Their key and
                        value projections &mdash; K = xW<sub>K</sub> and V = xW<sub>V</sub>
                        &mdash; are fixed: they do not change when a new token is generated.
                        Store them. At step t: compute Q<sub>t</sub>, K<sub>t</sub>, V<sub>t</sub>
                        only for the new token; retrieve cached K and V for all previous tokens;
                        compute attention over all t positions. The cost per step is O(t&sdot;d)
                        instead of O(t&sup2;&sdot;d). Total cost for N tokens: O(N&sup2;&sdot;d/2)
                        vs. O(N&sup3;&sdot;d/3) without cache. This is the single most impactful
                        inference optimization in all of LLM deployment &mdash; and it is
                        essentially free: no architectural change, no quality loss, just bookkeeping.
                        By 2021, every serious LLM inference system implemented KV caching as a
                        matter of course.
                    </div>
                    <div className="ch-tl-impact">Impact: Reduced autoregressive generation from O(N&sup3;) to O(N&sup2;) total compute; became universal standard for LLM inference</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Constraint</div>
                    <div className="ch-tl-title">Memory Implications &mdash; KV Cache as the New Bottleneck</div>
                    <div className="ch-tl-body">
                        KV cache memory per step t (all layers, float16):
                        2 &times; L &times; H &times; d<sub>h</sub> &times; t &times; 2 bytes,
                        where L is the number of layers, H the number of heads, and
                        d<sub>h</sub> the head dimension. For LLaMA 65B (L=80, H=64,
                        d<sub>h</sub>=128, float16): 2 &times; 80 &times; 64 &times; 128
                        &times; t &times; 2 = 2.6MB per token. At t = 2048: 5.4GB just for
                        KV cache &mdash; comparable to the model weights themselves on many
                        GPU setups. At t = 32K (a context window that became common in
                        2023): 84GB, far exceeding a single A100&rsquo;s 80GB capacity.
                        This drove three mitigations: MQA/GQA (reducing H), sliding window
                        attention (bounding t), and quantized KV caches (reducing 2 bytes to
                        1 or 0.5 bytes).
                    </div>
                    <div className="ch-tl-impact">Impact: Made KV cache memory the primary constraint on context length and batch size; motivated GQA, sliding windows, and KV quantization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Systems</div>
                    <div className="ch-tl-title">Paged Attention (vLLM) &mdash; Eliminating Fragmentation</div>
                    <div className="ch-tl-body">
                        Serving many concurrent requests with variable sequence lengths exposed
                        a memory management crisis. Naive KV cache management requires
                        pre-allocating contiguous memory for the maximum possible sequence
                        length for every request &mdash; even if most requests finish at 100
                        tokens, each slot reserves memory for 4096. The result: severe
                        fragmentation and wasted GPU memory. Kwon et al. (2023) introduced
                        PagedAttention in the vLLM serving system, directly inspired by OS
                        virtual memory paging. KV cache is divided into fixed-size
                        non-contiguous &ldquo;pages&rdquo; (typically 16 tokens per page).
                        A block table maps logical page indices for each request to physical
                        GPU memory pages. Memory is allocated one page at a time as the
                        sequence grows. Fragmentation: at most (B&minus;1) wasted tokens per
                        request for page size B. vLLM demonstrated 24&times; higher throughput
                        than prior systems on the same hardware, and PagedAttention became the
                        architectural foundation of the LLM serving infrastructure ecosystem.
                    </div>
                    <div className="ch-tl-impact">Impact: 24&times; throughput improvement; PagedAttention became the standard architecture for production LLM serving</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Efficiency</div>
                    <div className="ch-tl-title">Prefix Caching &mdash; Sharing System Prompts</div>
                    <div className="ch-tl-body">
                        Most production LLM deployments share a common prefix: a system prompt
                        that may run to 2000 tokens or more. Without prefix caching, every
                        request recomputes the KV vectors for this prefix from scratch. With
                        prefix caching: hash the prefix, check if its KV cache already exists
                        in memory, and if so, skip computation for those tokens entirely.
                        For a 2000-token system prompt at 2.6MB per token (LLaMA 65B),
                        prefix caching saves 5.2GB of KV computation for every request that
                        shares the prompt. With 100 concurrent requests: 520GB of avoided
                        computation per generation batch. Eviction follows LRU (least recently
                        used). Prefix caching is now implemented by all major LLM APIs
                        (OpenAI, Anthropic, Google) and most open-source serving frameworks.
                    </div>
                    <div className="ch-tl-impact">Impact: Eliminates redundant computation for shared system prompts; saves tens to hundreds of GB per batch in production deployments</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Speed</div>
                    <div className="ch-tl-title">Speculative Decoding &mdash; Draft, Verify, Advance</div>
                    <div className="ch-tl-body">
                        Speculative decoding (Leviathan et al., Chen et al., 2023) exploits an
                        asymmetry: running a large model in parallel over k tokens costs roughly
                        the same as running it on 1 token, because the bottleneck is memory
                        bandwidth, not compute. A small &ldquo;draft&rdquo; model generates k
                        token proposals autoregressively. The large target model verifies all k
                        in a single forward pass using parallel attention over the k+1 positions.
                        Each token is accepted with probability min(1, P<sub>target</sub> /
                        P<sub>draft</sub>); rejected tokens are resampled from a corrected
                        distribution that preserves the exact distribution of the target model.
                        The first rejected token terminates the accepted run. With typical
                        acceptance rate &alpha; &approx; 0.7&ndash;0.9, expected accepted tokens
                        per verification pass: 3&ndash;10. The KV cache is crucial here:
                        the verifier must handle branched KV state for the k speculative
                        tokens efficiently. Typical end-to-end throughput improvement:
                        3&ndash;5&times; on modern hardware.
                    </div>
                    <div className="ch-tl-impact">Impact: 3&ndash;5&times; end-to-end throughput improvement with identical output distribution to the target model</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2024</div>
                    <div className="ch-tl-section-label">Compression</div>
                    <div className="ch-tl-title">Quantized KV Cache &mdash; int8 / int4 / int2</div>
                    <div className="ch-tl-body">
                        Storing KV tensors in float16 uses 2 bytes per value. Quantizing to
                        int8 or int4 halves or quarters the memory footprint. Unlike weight
                        quantization, KV quantization suffers minimal accumulated error: KV
                        vectors are consumed exactly once per generation step (not repeatedly
                        across forward passes), so quantization noise does not accumulate.
                        KIVI (Liu et al., 2024) achieved near-lossless int2 KV quantization
                        by separating outlier channels &mdash; a small number of dimensions with
                        large magnitude are kept in float16 while the rest are quantized to int2.
                        At int4, KV cache memory for LLaMA 65B drops from 2.6MB/token to
                        0.65MB/token. Combined with GQA and paged attention, this made
                        100K+ token context windows practical on mid-range hardware (single
                        A100 or even consumer GPUs with 24GB VRAM).
                    </div>
                    <div className="ch-tl-impact">Impact: 2&ndash;4&times; reduction in KV cache memory; enabled 100K+ context on mid-range hardware</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why the KV cache is the most impactful single inference optimization:</strong>{" "}
                It requires zero architectural changes, introduces zero quality loss, and reduces
                autoregressive generation from an O(N&sup3;) to an O(N&sup2;) total-compute
                problem &mdash; a saving that compounds with every new token. Every downstream
                optimization in this chapter (PagedAttention, prefix caching, speculative
                decoding, quantized KV) is built on top of this foundation. Without the KV
                cache, production LLM inference as it exists today would be impossible.
            </div>

            <Analogy label="What comes next &mdash; Reasoning &amp; Chain-of-Thought">
                The architectural innovations of Chapter 28 &mdash; RoPE, Flash Attention, GQA,
                MoE, and KV caching &mdash; made frontier LLMs faster, longer-context, and more
                memory-efficient. But raw capability and inference efficiency alone don&rsquo;t
                make a model that reasons well. A model that can generate 100K tokens quickly
                is not necessarily a model that can solve a multi-step math problem correctly.
                Chapter 29 covers the techniques developed between 2022 and 2024 to elicit and
                improve genuine reasoning: chain-of-thought prompting, self-consistency,
                tree-of-thoughts search, and process reward models &mdash; the approaches that
                transformed LLMs from fluent text generators into systems capable of systematic
                problem solving.
            </Analogy>
        </>
    )
}

// ── Kid Tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>The cheat sheet that grows with every word</h2>

            <Analogy label="The Cheat Sheet You Keep Updating">
                Without KV cache: to answer question number 1000, re-read the entire
                conversation from the very beginning every single time. All 999 previous
                exchanges, from scratch, before you can write word number 1000. With KV
                cache: keep a growing cheat sheet of everything said so far. When the 1000th
                word arrives, glance at the cheat sheet (already there) and just figure out
                the new word. Same result, 1000&times; less work.
            </Analogy>

            <Analogy label="Why Generation Is Slow Without It">
                Imagine writing an essay one word at a time &mdash; but before writing each
                new word, you re-read the entire essay from word 1. If the essay is 500 words
                long, you&rsquo;ve done 500 + 499 + &hellip; + 1 reads: 125&thinsp;000 total
                word-reads just to produce 500 words. That&rsquo;s O(N&sup2;) reading. The KV
                cache is like keeping a running mental model of the essay: you just check the
                new word against your existing understanding, not against the raw text. One
                read per word instead of N.
            </Analogy>

            <Analogy label="The Memory Bill">
                The KV cache is the main reason long conversations eat GPU memory. Every token
                you generate adds a small entry to the cache &mdash; the model has to remember
                the &ldquo;key&rdquo; and &ldquo;value&rdquo; it computed for that token in
                every layer. For a very large model, each token costs about 2.6 megabytes of
                GPU memory. A 10&thinsp;000-token conversation takes 26 gigabytes &mdash;
                roughly as much as the model itself. This is why your phone can&rsquo;t run
                GPT-4 and why context length is still a hard engineering constraint.
            </Analogy>

            <Analogy label="Paged Attention: The Hotel Room Problem">
                Without paging: the hotel reserves a full suite for every guest the moment
                they book, even if they only stay one night in a single room. Half the suites
                sit empty while new guests are turned away. PagedAttention fixes this: rooms
                are allocated in small blocks only as the guest actually needs them. A
                one-night stay gets one block; a two-week stay gets blocks allocated one by
                one as the days pass. The hotel handles 24&times; more guests on the same
                number of rooms &mdash; that&rsquo;s the real-world throughput improvement
                vLLM measured.
            </Analogy>

            <Analogy label="Prefix Caching: Shared Textbooks">
                Every student in a class uses the same textbook (the system prompt). Without
                prefix caching: each student re-reads the textbook from page one before
                starting their homework. With prefix caching: one shared copy of the
                textbook&rsquo;s KV cache sits in memory; all students borrow from it. The
                teacher only &ldquo;read&rdquo; the textbook once, and everyone benefits.
                With 100 students and a 2000-page textbook, this saves 199 full re-reads
                per homework session.
            </Analogy>

            <Analogy label="Speculative Decoding: Guess and Verify">
                A small fast assistant guesses the next 5 words. The big slow expert checks
                all 5 guesses in one shot &mdash; parallel reading, not sequential. If the
                expert agrees with 4 of the 5 guesses, the conversation advances by 4 words
                for roughly the cost of 1 expert check. When the assistant is right most of
                the time, you get 3&ndash;5&times; the speed. The output is identical to what
                the expert would have written alone &mdash; rejected guesses are simply
                replaced with the expert&rsquo;s actual word and the process restarts.
            </Analogy>
        </>
    )
}

// ── High School Tab ───────────────────────────────────────────────────────────

function HighSchoolTab() {
    return (
        <>
            <h2>KV cache: algorithm, memory, and production optimizations</h2>

            <h3>KV Cache Algorithm</h3>
            <p>
                At generation step t, only the new token x<sub>t</sub> needs fresh
                projections. The algorithm:
            </p>
            <ol>
                <li>Compute Q<sub>t</sub> = x<sub>t</sub>W<sub>Q</sub>, K<sub>t</sub> = x<sub>t</sub>W<sub>K</sub>, V<sub>t</sub> = x<sub>t</sub>W<sub>V</sub>.</li>
                <li>Append K<sub>t</sub> to K<sub>cache</sub>[1:t] and V<sub>t</sub> to V<sub>cache</sub>[1:t].</li>
                <li>Compute attention: A<sub>t</sub> = softmax(Q<sub>t</sub> K<sub>cache</sub>[1:t]<sup>T</sup> / &radic;d<sub>h</sub>) &sdot; V<sub>cache</sub>[1:t].</li>
                <li>Output O<sub>t</sub> = A<sub>t</sub>, then feed x<sub>t+1</sub>.</li>
            </ol>
            <p>
                Per-step complexity with KV cache:
            </p>
            <MathBlock tex="\text{cost}_t = O(t \cdot d_h) \quad\text{vs.}\quad O(t^2 \cdot d_h) \text{ without cache}" />
            <p>
                Total cost for N tokens:
            </p>
            <MathBlock tex="\sum_{t=1}^{N} O(t \cdot d_h) = O\!\left(\frac{N^2 \cdot d_h}{2}\right) \quad\text{vs.}\quad O\!\left(\frac{N^3 \cdot d_h}{3}\right) \text{ without cache}" />

            <h3>Memory Formula</h3>
            <p>
                KV cache memory at sequence length t (float16, all layers):
            </p>
            <MathBlock tex="\text{Mem}_{KV}(t) = 2 \times L \times H \times d_h \times t \times 2 \text{ bytes}" />
            <p>
                For LLaMA 2 70B (L=80, H=64, d<sub>h</sub>=128) at t tokens:
            </p>
            <MathBlock tex="\text{Mem}_{KV}(t) = 2 \times 80 \times 64 \times 128 \times t \times 2 = 2{,}621{,}440 \cdot t \approx 2.6\,\text{MB} \times t" />
            <p>
                GQA with G=8 query groups (reducing H from 64 to 8) shrinks this by 8&times;:
            </p>
            <MathBlock tex="\text{Mem}_{KV}^{\text{GQA}}(t) = 2 \times 80 \times 8 \times 128 \times t \times 2 \approx 0.33\,\text{MB} \times t" />
            <p>
                At t = 32K tokens: MHA uses 84 GB; GQA uses 10.5 GB.
            </p>

            <h3>PagedAttention Block Management</h3>
            <p>
                KV cache is divided into non-contiguous pages of B tokens each. A block
                table maps logical page index j for request r to a physical GPU memory page.
                Total memory across a batch of R concurrent requests:
            </p>
            <MathBlock tex="\text{Mem}_{\text{batch}} = \sum_{r=1}^{R} \left\lceil \frac{t_r}{B} \right\rceil \times B \times \text{KV}_{\text{per-token}}" />
            <p>
                Maximum fragmentation: at most B&minus;1 wasted token-slots per request.
                Fragmentation overhead fraction:
            </p>
            <MathBlock tex="\text{frag} \leq \frac{B - 1}{B} \xrightarrow{B \to \infty} 1 \quad\text{(avoid large B); typical: } B = 16 \implies \text{frag} \leq \frac{15}{16} \approx 94\%\text{ max, } \approx 50\%\text{ average}" />
            <p>
                For B=16 and uniformly distributed lengths: expected fragmentation &asymp;
                B/2 = 8 tokens per request, much less than the worst case.
            </p>

            <h3>Prefix Caching</h3>
            <p>
                A prefix of length P is shared across R concurrent requests. Hash the prefix
                tokens to look up its KV cache. Cache hit: skip P token forward passes,
                serve from position P+1. Cache miss: compute and store. Cache eviction: LRU.
            </p>
            <p>
                Computation saved per cache hit:
            </p>
            <MathBlock tex="\text{Savings} = P \times \text{KV}_{\text{per-token}} \times R = P \times 2.6\,\text{MB} \times R" />
            <p>
                For P=2000, R=100 (100 concurrent requests): 520 GB of avoided KV computation
                per generation batch.
            </p>

            <h3>Speculative Decoding</h3>
            <p>
                Draft model M<sub>q</sub> proposes k tokens autoregressively:
                x&#x0302;<sub>t+1</sub>, &hellip;, x&#x0302;<sub>t+k</sub>. Target model M
                verifies all k in one parallel forward pass. Token i is accepted if:
            </p>
            <MathBlock tex="U[0,1] < \min\!\left(1,\; \frac{P_M(x_{t+i} \mid x_{1:t+i-1})}{P_q(x_{t+i} \mid x_{1:t+i-1})}\right)" />
            <p>
                If token i is rejected, resample from the corrected distribution
                (P<sub>M</sub> &minus; P<sub>q</sub>) clipped and normalised. For acceptance
                rate &alpha; per token, expected number of accepted tokens per verification
                pass:
            </p>
            <MathBlock tex="\mathbb{E}[\text{accepted}] = \sum_{i=0}^{k-1} \alpha^i = \frac{1 - \alpha^k}{1 - \alpha} \;\xrightarrow{k\to\infty}\; \frac{1}{1-\alpha}" />
            <p>
                For &alpha; = 0.8: expected 5 accepted tokens per pass. For &alpha; = 0.7:
                expected 3.3. Typical end-to-end speedup: 3&ndash;5&times;.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The KV cache as enabling infrastructure:</strong> PagedAttention, prefix
                caching, and speculative decoding are not independent optimizations &mdash; they
                are all built on top of the KV cache abstraction. PagedAttention controls how
                the cache is laid out in memory; prefix caching reuses cache entries across
                requests; speculative decoding requires branched cache states for draft
                verification. Understanding the cache is understanding the infrastructure
                layer of modern LLM inference.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Speculative decoding acceptance analysis &middot; optimal draft model size</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">KV cache class &middot; speculative decoding accept/reject loop</span>
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
            <h2>Speculative decoding: acceptance analysis and optimal draft model</h2>

            <DefBlock label="Exact Distribution Guarantee">
                Speculative decoding produces outputs with the exact distribution of the
                target model M, not an approximation. The accept/reject rule with correction
                sampling from (P<sub>M</sub> &minus; P<sub>q</sub>)<sub>+</sub> / Z ensures
                that the marginal distribution of each accepted token is exactly P<sub>M</sub>.
                This is a consequence of rejection sampling: the corrected distribution
                compensates for any bias introduced by the draft model.
            </DefBlock>

            <h3>Formal Acceptance Probability Analysis</h3>
            <p>
                Let P<sub>M</sub>(x) and P<sub>q</sub>(x) be the target and draft distributions
                at a given position. Token x is accepted with probability:
            </p>
            <MathBlock tex="\alpha(x) = \min\!\left(1,\; \frac{P_M(x)}{P_q(x)}\right)" />
            <p>
                Marginal acceptance probability over the draft&rsquo;s sampling distribution:
            </p>
            <MathBlock tex="\alpha = \mathbb{E}_{x \sim P_q}\!\left[\min\!\left(1,\; \frac{P_M(x)}{P_q(x)}\right)\right] = \sum_x \min\!\left(P_q(x),\, P_M(x)\right) = 1 - \frac{1}{2}\|P_M - P_q\|_1" />
            <p>
                This is exactly 1 minus half the total variation distance between M and q.
                High acceptance rate requires the draft model to be close to the target in
                total variation &mdash; not just in perplexity or cross-entropy.
            </p>

            <h3>Expected Tokens per Verification Pass</h3>
            <p>
                With k draft tokens and per-token acceptance rate &alpha;, the probability
                of accepting exactly m tokens (m &lt; k):
            </p>
            <MathBlock tex="P(\text{accept exactly } m) = \alpha^m (1 - \alpha), \quad m \in \{0,1,\ldots,k-1\}" />
            <MathBlock tex="P(\text{accept all } k) = \alpha^k" />
            <p>
                Expected accepted tokens (including the one resampled on rejection):
            </p>
            <MathBlock tex="\mathbb{E}[\text{tokens}] = \sum_{m=0}^{k-1}(m+1)\alpha^m(1-\alpha) + (k+1)\alpha^k = \frac{1-\alpha^{k+1}}{1-\alpha}" />
            <p>
                For large k (k &rarr; &infin;): E &rarr; 1/(1&minus;&alpha;). For &alpha;=0.8,
                k=5: E = (1&minus;0.8<sup>6</sup>)/(0.2) &asymp; 4.6 tokens per pass.
            </p>

            <h3>Optimal Draft Model Size</h3>
            <p>
                Let the target model have N<sub>M</sub> parameters and the draft model N<sub>q</sub>.
                The wall-clock speedup from speculative decoding:
            </p>
            <MathBlock tex="\text{Speedup} = \frac{\mathbb{E}[\text{tokens per pass}]}{\text{Cost per pass} / \text{Cost}_{\text{target}}} \approx \frac{(1-\alpha^{k+1})/(1-\alpha)}{1 + k \cdot (N_q / N_M)}" />
            <p>
                For memory-bandwidth-bound inference (the typical regime for large models),
                cost &prop; parameter count. The optimal k and N<sub>q</sub>/N<sub>M</sub>
                ratio depends on &alpha;, which itself decreases as N<sub>q</sub>/N<sub>M</sub>
                decreases. Empirically: the sweet spot is N<sub>q</sub> &asymp; N<sub>M</sub>/10
                to N<sub>M</sub>/20, with k = 4&ndash;8 draft tokens. Larger draft models
                improve &alpha; but reduce the speedup from parallelism; smaller draft models
                reduce cost but hurt &alpha; too much.
            </p>

            <div className="ch-callout">
                <strong>Connection to importance sampling:</strong> Speculative decoding is
                structurally identical to importance sampling with M<sub>q</sub> as the proposal
                distribution and M as the target. The accept/reject rule is the standard
                importance-weighted rejection sampler. This framing shows why the TV distance
                (not KL divergence) controls the acceptance rate: importance weights are
                bounded when P<sub>M</sub>(x)/P<sub>q</sub>(x) is bounded, i.e., when the
                proposal has heavier tails than the target &mdash; which is why draft models
                are often tuned to be slightly more diffuse.
            </div>
        </>
    )
}

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn.functional as F
from dataclasses import dataclass, field

# ── KV Cache ──────────────────────────────────────────────────────────────────

@dataclass
class KVCache:
    """
    Per-layer KV cache for autoregressive generation.
    Stores all key and value projections seen so far.
    """
    max_seq_len: int
    n_heads: int
    head_dim: int
    dtype: torch.dtype = torch.float16

    k_cache: torch.Tensor = field(init=False)
    v_cache: torch.Tensor = field(init=False)
    seq_len: int = field(default=0, init=False)

    def __post_init__(self):
        # Pre-allocate contiguous cache tensors
        self.k_cache = torch.zeros(
            self.max_seq_len, self.n_heads, self.head_dim, dtype=self.dtype
        )
        self.v_cache = torch.zeros(
            self.max_seq_len, self.n_heads, self.head_dim, dtype=self.dtype
        )

    def append(self, k_new: torch.Tensor, v_new: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Append a single new token's K and V, return full cached K and V.
        k_new, v_new: (n_heads, head_dim)
        Returns: k_full, v_full each (seq_len+1, n_heads, head_dim)
        """
        self.k_cache[self.seq_len] = k_new
        self.v_cache[self.seq_len] = v_new
        self.seq_len += 1
        return self.k_cache[:self.seq_len], self.v_cache[:self.seq_len]

    def memory_bytes(self) -> int:
        """Current KV cache memory usage in bytes."""
        bytes_per_element = 2 if self.dtype == torch.float16 else 4
        return 2 * self.seq_len * self.n_heads * self.head_dim * bytes_per_element


def cached_attention_step(
    x_new: torch.Tensor,        # (1, d_model)
    W_Q: torch.Tensor,          # (d_model, n_heads * head_dim)
    W_K: torch.Tensor,
    W_V: torch.Tensor,
    cache: KVCache,
) -> torch.Tensor:
    """
    One autoregressive attention step using KV cache.
    Cost: O(seq_len * head_dim) instead of O(seq_len^2 * head_dim).
    """
    n_heads, head_dim = cache.n_heads, cache.head_dim

    # Project new token only
    q = (x_new @ W_Q).reshape(n_heads, head_dim)         # (H, d_h)
    k_new = (x_new @ W_K).reshape(n_heads, head_dim)     # (H, d_h)
    v_new = (x_new @ W_V).reshape(n_heads, head_dim)     # (H, d_h)

    # Append to cache and retrieve full K, V
    k_full, v_full = cache.append(k_new, v_new)           # (t, H, d_h)

    # Scaled dot-product attention: Q against all cached K
    # q: (H, d_h), k_full: (t, H, d_h) -> scores: (H, t)
    scores = torch.einsum("hd,thd->ht", q, k_full) / (head_dim ** 0.5)
    attn   = F.softmax(scores, dim=-1)                    # (H, t)

    # Weighted sum of cached V: (H, t) x (t, H, d_h) -> (H, d_h)
    out = torch.einsum("ht,thd->hd", attn, v_full)        # (H, d_h)
    return out.reshape(1, -1)                              # (1, H*d_h)


# ── Speculative Decoding ──────────────────────────────────────────────────────

def speculative_decode_step(
    prompt_tokens: list[int],
    draft_model_logits_fn,   # callable: tokens -> logits (vocab,)
    target_model_logits_fn,  # callable: tokens -> logits (vocab,)
    k: int = 5,
    temperature: float = 1.0,
) -> list[int]:
    """
    One round of speculative decoding:
      1. Draft model proposes k tokens autoregressively.
      2. Target model verifies all k in one parallel forward pass.
      3. Accept/reject with correction; return accepted tokens.

    Output distribution is identical to target_model_logits_fn sampling.
    """
    # Step 1: Draft model generates k proposals autoregressively
    draft_tokens: list[int] = []
    draft_probs:  list[torch.Tensor] = []
    context = list(prompt_tokens)

    for _ in range(k):
        logits = draft_model_logits_fn(context)             # (vocab,)
        probs  = F.softmax(logits / temperature, dim=-1)
        token  = torch.multinomial(probs, 1).item()
        draft_tokens.append(token)
        draft_probs.append(probs)
        context.append(token)

    # Step 2: Target model verifies all k tokens in one forward pass
    # Run target over [prompt + draft_tokens], get logits at each draft position
    accepted: list[int] = []
    all_tokens = list(prompt_tokens) + draft_tokens

    for i, (draft_tok, p_q) in enumerate(zip(draft_tokens, draft_probs)):
        # Target logits at position (len(prompt) + i)
        target_logits = target_model_logits_fn(all_tokens[:len(prompt_tokens) + i])
        p_M = F.softmax(target_logits / temperature, dim=-1)

        # Accept/reject: min(1, P_M / P_q)
        acceptance_prob = min(1.0, (p_M[draft_tok] / (p_q[draft_tok] + 1e-9)).item())
        u = torch.rand(1).item()

        if u < acceptance_prob:
            accepted.append(draft_tok)
        else:
            # Resample from corrected distribution: (P_M - P_q)+ normalised
            corrected = F.relu(p_M - p_q)
            if corrected.sum() > 0:
                corrected = corrected / corrected.sum()
            else:
                corrected = p_M
            resampled = torch.multinomial(corrected, 1).item()
            accepted.append(resampled)
            break  # First rejection ends the accepted run

    return accepted


# ── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # KV cache memory demo
    cache = KVCache(max_seq_len=4096, n_heads=64, head_dim=128, dtype=torch.float16)
    print("KV Cache Memory Demo (LLaMA 65B, 1 layer, float16)")
    print(f"  At   100 tokens: {100 * 64 * 128 * 2 * 2 / 1e6:.2f} MB")
    print(f"  At  2048 tokens: {2048 * 64 * 128 * 2 * 2 / 1e6:.2f} MB")
    print(f"  At 32768 tokens: {32768 * 64 * 128 * 2 * 2 / 1e6:.2f} MB")
    print()

    # Speculative decoding acceptance rate
    alpha = 0.8
    k = 5
    expected = (1 - alpha ** (k + 1)) / (1 - alpha)
    print(f"Speculative Decoding (alpha={alpha}, k={k})")
    print(f"  Expected accepted tokens per pass: {expected:.2f}")
    print(f"  Theoretical max (k->inf):           {1/(1-alpha):.2f}")
`

function PythonContent() {
    return (
        <>
            <p>
                Two implementations: (a) a{" "}
                <code>KVCache</code> class with pre-allocated tensors, append/retrieve
                semantics, and memory reporting; (b) one round of speculative decoding with
                the exact accept/reject correction that preserves the target model&rsquo;s
                output distribution.
            </p>
            <CodeBlock code={PY_CODE} filename="kv_cache.py" lang="python" langLabel="Python" />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const KV_CACHE_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
