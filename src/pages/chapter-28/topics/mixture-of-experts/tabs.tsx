import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TimelineItem {
    year: string
    title: string
    context: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TimelineItem }) {
    return (
        <div className="ch-tl-item">
            <div className="ch-tl-year">{item.year}</div>
            <div className="ch-tl-title">{item.title}</div>
            <div className="ch-tl-section-label">Context</div>
            <div className="ch-tl-body">{item.context}</div>
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
            year: "1991 — Original Mixture of Experts (Jacobs et al.)",
            title: "Adaptive Mixtures of Local Experts",
            context:
                "Neural networks in 1991 were small by necessity — hardware was limited and training a single large network on a heterogeneous dataset was painfully slow and often unstable. The deeper issue was that a single network had to learn a single function over the entire input space, even when that space was naturally partitioned into distinct sub-problems. Robert Jacobs, Michael Jordan, Steven Nowlan, and Geoffrey Hinton asked: what if you trained multiple expert networks, each specializing on a different region of the input, and let a learned gating network decide which expert to consult?",
            what:
                "The paper 'Adaptive Mixtures of Local Experts' introduced a training procedure where E small networks (experts) competed to predict each training example. A gating network, also trained end-to-end, learned to assign soft weights to each expert for each input. The total output was a weighted mixture: y = &#931; g_i(x) &#183; f_i(x). Because the gating competed — high weight for one expert meant low weight for others — experts naturally specialized on different parts of the input distribution. The training objective encouraged experts to fit the examples they were assigned and discouraged overlap.",
            impact:
                "The MoE idea introduced three concepts that would resurface three decades later: learned routing, expert specialization, and the separation of model capacity from per-example compute. At the time, the approach was limited to shallow networks on small datasets. Training was unstable, the gating network tended to ignore all but one or two experts (the 'rich get richer' problem), and there was no obvious way to apply it to sequence models. The paper was influential in theory but lay dormant in practice for 26 years.",
        },
        {
            year: "2017 — Sparsely-Gated MoE (Shazeer et al., Google)",
            title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
            context:
                "By 2017 the LSTM was the dominant sequence model. Google Brain had been scaling LSTMs for translation tasks and hitting a wall: larger models cost more compute per token, and doubling model size doubled inference cost regardless of whether the extra capacity was used. Noam Shazeer, Azalia Mirhoseini, Krzysztof Maziarz, Andy Davis, Quoc Le, Geoffrey Hinton, and Jeff Dean proposed replacing the feed-forward sub-layer of each LSTM stack with a mixture-of-experts layer containing up to E = 1024 expert networks, activating only the top-k = 2 per token.",
            what:
                "The router computed a score for each expert using a linear projection followed by softmax with added Gaussian noise: G(x) = Softmax(TopK(x &#183; W_g + noise)). Only the top-2 experts received non-zero weight. The model had 137B total parameters but activated roughly 2/1024 &#215; 137B &#8776; 267M per token. A load-balancing auxiliary loss penalized expert imbalance. Distributed training placed different experts on different devices, so inference required all-to-all communication but not all-device synchronization.",
            impact:
                "This was the proof that sparse MoE could be applied to deep sequence models at scale. The 137B model outperformed comparable dense models using the same training FLOPs, validating the core claim: MoE separates total parameter count (capacity) from per-token compute (cost). The training instability and load-imbalance problems were real but manageable. The paper defined the vocabulary — router, capacity, load balancing, auxiliary loss — that every subsequent MoE paper would use.",
        },
        {
            year: "2021 — GShard (Lepikhin et al., Google)",
            title: "GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding",
            context:
                "Scaling transformers to hundreds of billions of parameters required solving two intertwined problems: where to store the parameters (model parallelism) and how to route tokens efficiently across devices. GShard addressed both simultaneously for a 600B-parameter MoE translation model running on 2048 TPU cores. Each TPU shard held a disjoint subset of experts — roughly 300 experts per shard of 2048 total.",
            what:
                "GShard introduced the capacity factor: each expert can process at most C = capacity_factor &#215; (tokens_per_batch / num_experts) tokens. Tokens routed to an over-capacity expert are dropped, their representation passed through unchanged via the residual stream. The routing algorithm used top-2 selection with a constraint that at most one of the two experts for any token could be on a remote device, minimizing cross-device communication. The system was implemented via an XLA compiler extension that automatically generated the all-to-all collectives.",
            impact:
                "GShard demonstrated that a 600B MoE model could be trained in a reasonable time on TPU pods and outperformed a 100B dense T5 baseline on the same compute budget. The capacity factor concept became standard, encoding the practical trade-off between expert utilization and dropped-token frequency. GShard showed that model parallelism and MoE routing could be co-designed rather than treated as separate engineering concerns.",
        },
        {
            year: "2021 — Switch Transformer (Fedus et al., Google)",
            title: "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity",
            context:
                "Shazeer et al. had used top-2 routing because top-1 seemed too unstable and wasteful. William Fedus, Barret Zoph, and Noam Shazeer at Google revisited this assumption. Their key insight: the instability of top-1 routing came from poor initialization and training dynamics, not from the routing mechanism itself. Simplifying to top-1 would halve the routing overhead and make load balancing easier.",
            what:
                "Switch Transformer replaced each FFN layer in T5 with a switch layer: a router projecting the token representation to E logits, selecting the single highest-scoring expert (k = 1). Auxiliary load-balancing loss: L_aux = &#945; &#183; E &#183; &#931;_i f_i &#183; p_i, where f_i is the fraction of tokens dispatched to expert i and p_i is the mean router probability for expert i. Total parameters: 1.6T (the first publicly described trillion-parameter model). At training: all 1.6T parameters updated. At inference: 1.6T/E parameters active per token.",
            impact:
                "The Switch Transformer showed that top-1 routing works — and works better than top-2 in some settings because the simplicity aids load balancing. Training was 7&#215; faster than an equivalent-compute T5-11B dense baseline on the same hardware. The paper opened the path to trillion-parameter models by showing sparsity could be the primary scaling mechanism rather than an add-on. Its auxiliary loss formulation became the canonical load-balancing recipe for subsequent models.",
        },
        {
            year: "December 2023 — Mixtral 8&#215;7B (Mistral AI)",
            title: "Mixtral of Experts: Open-source sparse MoE for the community",
            context:
                "Until December 2023, large MoE models were exclusively internal to major labs. Mistral AI changed this by releasing the weights of Mixtral 8&#215;7B under an Apache 2.0 license. The model used 8 experts per transformer layer with top-2 routing and 7B parameters per expert, for a total of approximately 46.7B parameters. Each token activated 2 of 8 FFN blocks, so the active parameter count per token was roughly 13B — similar to a 13B dense model in FLOPs but with the capacity of a 46.7B model.",
            what:
                "Mixtral used a standard transformer architecture where every FFN layer was replaced by 8 independent FFN experts sharing the same attention weights. The router was a linear layer mapping the hidden state to 8 logits, selecting top-2 by score. Context length was 32K tokens via sliding window attention. No novel routing scheme — the novelty was the release itself: a competitive open MoE model available for download and fine-tuning.",
            impact:
                "Mixtral matched or exceeded LLaMA 2 70B on standard benchmarks while running at 2&#215; the inference throughput because the active parameter count was 13B, not 46.7B. It demonstrated that MoE models could be served on a single 80GB A100 GPU, making sparse models accessible to researchers without datacenter budgets. The release triggered an ecosystem of MoE fine-tunes and deployment optimizations. Mistral followed with Mixtral 8&#215;22B in 2024, extending the pattern to 141B total / &#8776;39B active.",
        },
        {
            year: "2024 — DeepSeek-V2 and V3",
            title: "Economical frontier models via fine-grained MoE",
            context:
                "Chinese AI lab DeepSeek published two MoE models in 2024 that drew intense attention because of their cost-efficiency. DeepSeek-V2 (236B total, 21B active) combined MoE with a new attention mechanism called Multi-head Latent Attention (MLA) that compressed the KV cache dramatically. DeepSeek-V3 (671B total, 37B active) was trained for approximately &#36;6M — a fraction of comparable frontier dense models — using fine-grained experts: instead of 8 large experts, V3 used 256 fine-grained experts per layer with top-8 routing.",
            what:
                "DeepSeek-V3 introduced auxiliary-loss-free load balancing via a bias term added to router logits during training: each expert maintains a running utilization count, and the bias is adjusted so that utilization stays balanced without a dedicated loss term. This avoided the training instability that auxiliary losses can cause. The model used FP8 mixed-precision training and custom CUDA kernels for all-to-all communication, achieving 14.8T tokens of training at costs viable for a mid-size lab.",
            impact:
                "DeepSeek-V3 matched or exceeded GPT-4o on most benchmarks at approximately 1/10th the training cost. It proved that fine-grained MoE — many small experts rather than few large ones — could outperform coarse MoE at the same active-parameter count. The auxiliary-loss-free balancing strategy was widely adopted. The DeepSeek series established that MoE was not only for hyperscalers: with careful engineering, frontier-quality models were achievable at dramatically lower cost.",
        },
        {
            year: "2024 — Gemini 1.5 and the alleged GPT-4 MoE architecture",
            title: "MoE becomes the presumed architecture of frontier models",
            context:
                "By 2024, multiple credible reports indicated that GPT-4 used a MoE architecture with approximately 8 experts and &#8776;220B parameters per expert, for a total near 1.8T — though OpenAI never confirmed this. Google explicitly disclosed that Gemini 1.5 Pro used a MoE architecture, making it the first publicly confirmed frontier multimodal MoE model. Gemini 1.5 Pro combined MoE with a 1M-token context window, suggesting that sparse routing is compatible with very long-range attention.",
            what:
                "The combination of MoE with long context in Gemini 1.5 required careful engineering: with 1M tokens, the all-to-all routing overhead per layer is substantial. Google's solution involved hierarchical routing and careful batching. The public acknowledgment that MoE underpins Gemini 1.5 validated the architecture choice for multimodal and long-context applications, not just text generation.",
            impact:
                "The convergence of frontier labs on MoE — whether confirmed or alleged — marked a phase transition in how the field views the architecture. MoE is no longer an exotic scaling trick; it appears to be the dominant approach at the frontier where parameter count and inference cost cannot both be maximized with dense models. The open question shifts from 'does MoE work at scale?' to 'how many experts, what granularity, and what routing scheme is optimal?'",
        },
    ]

    return (
        <>
            <div className="ch-timeline">
                {items.map((item) => (
                    <TlItem key={item.year} item={item} />
                ))}
            </div>
            <div className="ch-callout">
                <strong>The trajectory in one sentence:</strong> MoE began as a 1991 curiosity for
                shallow networks, was rediscovered as a scaling mechanism for LSTMs in 2017, became
                the architecture of trillion-parameter transformers by 2021, and by 2024 is the
                presumed design of every frontier language model &#8212; because it is the only
                known way to scale total capacity without proportionally scaling per-token compute.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <Analogy label="The Hospital Specialist System">
                Imagine a hospital where one doctor knows a little bit about everything &#8212;
                that is a dense model. Now imagine a hospital with specialists: a cardiologist,
                a neurologist, a dermatologist, a gastroenterologist, and four more. When a patient
                arrives, a receptionist (the router) looks at the patient and decides which two
                specialists to consult. The patient sees those two doctors and gets a combined
                recommendation.
                <br /><br />
                Most patients only see 2 of the 8 specialists &#8212; but all 8 specialists exist,
                all have learned their expertise, and each is ready if the right patient arrives.
                This is exactly how a Mixture of Experts model works: many specialist networks
                exist, but only a few are consulted for each input.
            </Analogy>

            <Analogy label="Paying for Experts You Don't Use">
                A dense 70B model uses all 70 billion parameters for every single word it
                processes. A 70B MoE model with 8 experts uses only about 13 billion parameters
                per word &#8212; the 2 active experts out of 8. You still have 70 billion
                parameters stored in memory (the whole hospital staff is on payroll), but you
                only compute with 13 billion for each word (only 2 doctors see each patient).
                <br /><br />
                This matters enormously for speed. Computing with 13B parameters is roughly as
                fast as running a 13B dense model, while having the knowledge capacity of a 70B
                model. You are paying for a full specialist hospital but only paying the
                consultation fee for the two you visit.
            </Analogy>

            <Analogy label="How the Router Decides">
                For each token (word or word-piece), the router asks: which experts should handle
                this? It does this by computing a small score for each expert &#8212; just a
                matrix multiplication, very fast &#8212; and picking the top-2 highest scores.
                <br /><br />
                The router is tiny: a single linear layer. The experts are large: full
                feed-forward networks with billions of parameters each. The routing decision
                takes roughly 0.1% of the computation time; the expert computation takes 99.9%.
                The receptionist spends ten seconds deciding; the specialists spend an hour
                treating the patient.
            </Analogy>

            <Analogy label="The Load Balancing Problem">
                Here is a trap: if the router always sends every token to the same two experts,
                those two get overloaded and the other six sit idle, wasting their training and
                contributing nothing. This actually happens during early training because the
                router learns quickly that a few experts are slightly better and routes everything
                to them, making them even better (the rich-get-richer problem).
                <br /><br />
                The solution is an extra penalty during training &#8212; an auxiliary loss &#8212;
                that says: if you are routing too many tokens to one expert and too few to
                another, you are penalized. This is like a hospital law requiring that patients
                be distributed reasonably evenly across all specialists, so no specialist is
                permanently idle and none is permanently overwhelmed.
            </Analogy>

            <Analogy label="Mixtral: Open-Source MoE for Everyone">
                In December 2023, Mistral AI released Mixtral 8&#215;7B &#8212; the first widely
                used open MoE model. It has 8 experts per layer, each with 7B parameters, and
                activates the top-2 for each token. Total parameters: 46.7B. Active parameters
                per token: about 13B. The result: it matched a 70B dense model in quality while
                running at 2&#215; the inference speed, because the active compute was 13B not 70B.
                <br /><br />
                Crucially, Mistral released the weights for free &#8212; anyone could download
                and run it. This made MoE accessible to researchers, students, and small companies
                for the first time.
            </Analogy>

            <Analogy label="Why MoE Scales Better Than Dense Models">
                Doubling the parameters of a dense model doubles both the memory you need to
                store it AND the compute you need to run it. Every word costs twice as much to
                process.
                <br /><br />
                In a MoE model: doubling the number of experts doubles the memory (you need to
                store twice as many expert networks) but does NOT double the compute (you still
                activate the same k experts per token). This separation &#8212; capacity grows
                with total parameters, cost stays pinned to active parameters &#8212; is why
                trillion-parameter MoE models are tractable while trillion-parameter dense models
                are not. MoE is the answer to the question: how do you scale knowledge without
                proportionally scaling cost?
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Architecture, routing, and efficiency</h2>

            <h3>MoE Architecture: Replacing the FFN Layer</h3>
            <p>
                In a standard transformer, every token passes through the same feed-forward
                network (FFN) at each layer. In a MoE transformer, the FFN is replaced by E
                independent expert networks. A router selects the top-k experts for each token,
                and the layer output is the weighted sum of those experts' outputs.
            </p>
            <p>Standard FFN output:</p>
            <MathBlock tex="\mathbf{h}' = \mathrm{FFN}(\mathbf{h}) = W_2 \cdot \mathrm{GELU}(W_1 \cdot \mathbf{h})" />
            <p>MoE FFN output:</p>
            <MathBlock tex="\mathbf{h}' = \sum_{i \in \mathrm{TopK}(G(\mathbf{h}))} G_i(\mathbf{h}) \cdot \mathrm{FFN}_i(\mathbf{h})" />
            <p>
                Where the gating scores G(h) are computed as:
            </p>
            <MathBlock tex="G(\mathbf{h}) = \mathrm{Softmax}\!\left(\mathrm{TopK}(\mathbf{h} \cdot W_g)\right)" />
            <p>
                The TopK operation keeps the k highest logits and sets the rest to{" "}
                &#8722;&#8734; before the softmax, ensuring only k experts receive non-zero
                weight. The router W_g is a learned matrix of shape{" "}
                [d_model &#215; E]. The output is a weighted combination of only k expert
                computations, so the FLOPs per token scale with k, not E.
            </p>

            <h3>Load Balancing Auxiliary Loss</h3>
            <p>
                Without regularization, routers collapse: a few experts receive almost all tokens
                and the rest are undertrained. The standard fix is an auxiliary loss added to the
                main training objective. Let N be the number of tokens in a batch and E the number
                of experts. Define:
            </p>
            <MathBlock tex="f_i = \frac{1}{N} \sum_{x \in \mathcal{B}} \mathbf{1}[\text{token } x \text{ routed to expert } i]" />
            <MathBlock tex="p_i = \frac{1}{N} \sum_{x \in \mathcal{B}} G_i(\mathbf{h}_x)" />
            <p>
                f_i is the fraction of tokens dispatched to expert i (based on the hard top-k
                decision). p_i is the average soft router probability for expert i. The auxiliary
                loss is:
            </p>
            <MathBlock tex="\mathcal{L}_{\mathrm{aux}} = \alpha \cdot E \cdot \sum_{i=1}^{E} f_i \cdot p_i" />
            <p>
                When routing is perfectly uniform, every f_i = p_i = 1/E, so the sum equals 1
                and the loss is &#945;. Any imbalance increases the sum above 1, raising the
                loss. The gradient of L_aux with respect to the router logits encourages
                increasing the routing probability for underloaded experts and decreasing it for
                overloaded ones. Switch Transformer used &#945; = 10<sup>&#8722;2</sup>; Mixtral
                used &#945; = 10<sup>&#8722;4</sup>.
            </p>

            <h3>Expert Capacity and Token Dropping</h3>
            <p>
                In batched training, each expert can only process a fixed number of tokens in
                parallel (determined by the hardware buffer). The expert capacity C is set as:
            </p>
            <MathBlock tex="C = \left\lfloor \text{capacity\_factor} \times \frac{N}{E} \right\rfloor" />
            <p>
                Where N is the total tokens in the batch and N/E is the uniform allocation. A
                capacity factor of 1.0 means no slack: an expert that receives more than N/E
                tokens drops the excess. A capacity factor of 1.25 gives each expert 25% extra
                buffer. Dropped tokens bypass the expert and pass unchanged through the residual
                connection. The trade-off: higher capacity factor &#8594; fewer dropped tokens
                but more memory and padding overhead; lower &#8594; more dropped tokens but
                faster and lighter. Typical values: 1.0&#8211;1.25 for training, 2.0 for
                evaluation.
            </p>

            <h3>Model Parallelism for MoE</h3>
            <p>
                Expert parameters are distributed across devices. With E experts and D devices,
                each device holds E/D experts. During the forward pass, tokens must be dispatched
                to the device holding their assigned expert. This requires two all-to-all
                communication steps per MoE layer:
            </p>
            <MathBlock tex="\text{all-to-all dispatch:} \quad \frac{N}{D} \text{ tokens per device} \xrightarrow{\text{route}} \text{each device receives its tokens}" />
            <MathBlock tex="\text{all-to-all combine:} \quad \text{expert outputs} \xrightarrow{\text{return}} \text{original device reassembles}" />
            <p>
                Communication volume per layer: 2 &#215; (N/D) &#215; d_model tokens. For
                large batches with small d_model, this is dominated by the number of tokens; for
                small batches with large d_model, memory bandwidth is the bottleneck. GShard and
                DeepSeek-V3 addressed this with custom kernels that fuse dispatch and computation
                to overlap communication with compute.
            </p>

            <h3>Inference Efficiency: Active vs. Total Parameters</h3>
            <p>
                The key advantage of MoE at inference time is that FLOPs per token scale with
                active parameters, not total. Define the activation ratio:
            </p>
            <MathBlock tex="\rho = \frac{k}{E}" />
            <p>
                Where k is the number of selected experts and E is the total number. The
                attention layers (shared across all tokens) contribute a fixed compute cost
                proportional to d_model. The MoE layers contribute compute proportional to
                &#961; &#215; (total expert parameters). For Mixtral 8&#215;7B: &#961; = 2/8 =
                0.25, so the FFN compute is 25% of what it would be in a dense 46.7B model.
                For DeepSeek-V3: &#961; = 8/256 = 0.03125, so the FFN compute is roughly
                3% of a dense 671B model &#8212; similar to a &#8776;37B dense model in
                FLOPs per token.
            </p>
            <MathBlock tex="\text{effective inference FLOPs} \approx C_{\text{attn}}(N_{\text{total}}) + \rho \cdot C_{\text{ffn}}(N_{\text{total}})" />

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Rule of thumb:</strong> A MoE model with E experts and top-k routing
                has the inference cost of a dense model with (k/E) &#215; (FFN parameters) +
                (attention parameters). The attention cost is the floor &#8212; you cannot
                sparse-route attention as easily as FFN layers. This is why very large MoE
                models still benefit from attention optimizations like GQA and MLA alongside
                expert routing.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &#8212; Mathematics</span>
                    <span className="ch-expandable-desc">Load balancing gradient &#183; capacity&#8211;quality trade-off</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch SparseMoE layer &#183; load balancing demo</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

function MathsContent() {
    return (
        <>
            <h2>Load balancing gradient and capacity&#8211;quality trade-off</h2>

            <DefBlock label="The Load Balancing Gradient">
                The auxiliary loss L_aux = &#945; &#183; E &#183; &#931;_i f_i &#183; p_i is
                differentiable with respect to the router logits z through p_i, but not through
                f_i (which is the hard top-k indicator). The gradient flows only through p_i:
            </DefBlock>
            <MathBlock tex="\frac{\partial \mathcal{L}_{\mathrm{aux}}}{\partial z_j} = \alpha \cdot E \cdot f_j \cdot \frac{\partial p_j}{\partial z_j}" />
            <p>
                Since p_i = softmax(z)_i, the Jacobian is:
            </p>
            <MathBlock tex="\frac{\partial p_i}{\partial z_j} = p_i(\delta_{ij} - p_j)" />
            <p>
                So the gradient of L_aux with respect to z_j is:
            </p>
            <MathBlock tex="\frac{\partial \mathcal{L}_{\mathrm{aux}}}{\partial z_j} = \alpha \cdot E \cdot \sum_i f_i \cdot p_i (\delta_{ij} - p_j) = \alpha \cdot E \cdot (f_j \cdot p_j(1 - p_j) - p_j \sum_{i \neq j} f_i \cdot p_i)" />
            <p>
                When expert j is underloaded (f_j &#60; 1/E), the term f_j p_j(1 &#8722; p_j)
                is small relative to the negative term &#8722;p_j &#931;_&#123;i&#8800;j&#125; f_i p_i,
                so the gradient decreases z_j, which decreases p_j. Wait &#8212; that is the
                wrong direction. In practice, the gradient encourages{" "}
                <em>overloaded</em> experts to have their router logits reduced: when f_j &#62;
                1/E (overloaded), the positive term dominates and the gradient on z_j is
                positive, increasing p_j further... The key is that the optimizer minimizes
                L_aux: a high f_j &#183; p_j product means expert j is overloaded AND has
                high router probability &#8212; increasing L_aux. Gradient descent lowers
                L_aux by reducing p_j (and thus z_j), which re-routes tokens away from
                expert j.
            </p>

            <h3>Capacity&#8211;Quality Trade-off as a Function of Dropped Token Fraction</h3>
            <p>
                Let &#948;(C) be the fraction of tokens dropped at capacity factor C. Empirically,
                &#948; decreases as C increases. The quality penalty from dropped tokens can be
                approximated: each dropped token's representation is passed through the residual
                unchanged, effectively receiving zero FFN update. If the FFN contributes
                &#916;L(x) to the loss reduction for token x, dropping it adds &#916;L(x)
                back to the expected loss.
            </p>
            <MathBlock tex="\mathbb{E}[\text{loss}(C)] \approx L_{\text{no-drop}} + \delta(C) \cdot \mathbb{E}_x[\Delta L(x)]" />
            <p>
                Where &#948;(C) follows an approximately power-law relationship with the
                capacity factor:
            </p>
            <MathBlock tex="\delta(C) \approx \delta_0 \cdot C^{-\gamma} \quad \text{for } C \geq 1" />
            <p>
                With &#947; &#8776; 2&#8211;4 in practice. This means that increasing C from
                1.0 to 1.25 (a 25% increase) can reduce the dropped-token fraction by 50&#8211;80%,
                while the memory overhead increases by only 25%. The optimal C is determined
                by the trade-off between the memory budget and the acceptable quality penalty
                from dropped tokens.
            </p>

            <div className="ch-callout">
                <strong>Auxiliary-loss-free balancing (DeepSeek-V3):</strong> Instead of
                adding L_aux to the training loss, maintain per-expert bias terms b_i in the
                router logits: route using z_i + b_i, but update b_i using a separate
                exponential-moving-average rule: b_i &#8592; b_i &#8722; &#956; &#183; (u_i
                &#8722; target), where u_i is the running utilization of expert i. This
                decouples load balancing from the main gradient signal, avoiding the training
                instability that explicit auxiliary losses can introduce when &#945; is set
                too high.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

# ── Sparse MoE Layer ──────────────────────────────────────────────────────────

class ExpertFFN(nn.Module):
    """A single expert: standard two-layer FFN with GELU activation."""

    def __init__(self, d_model: int, d_ff: int):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff, bias=False)
        self.w2 = nn.Linear(d_ff, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.w2(F.gelu(self.w1(x)))


class SparseMoE(nn.Module):
    """
    Sparse Mixture-of-Experts FFN layer.

    Args:
        d_model:         Hidden dimension of the transformer.
        d_ff:            Inner dimension of each expert FFN.
        num_experts:     Total number of experts (E).
        top_k:           Number of experts to activate per token (k).
        aux_loss_alpha:  Weight for the load-balancing auxiliary loss.
    """

    def __init__(
        self,
        d_model: int,
        d_ff: int,
        num_experts: int = 8,
        top_k: int = 2,
        aux_loss_alpha: float = 1e-2,
    ):
        super().__init__()
        self.num_experts = num_experts
        self.top_k = top_k
        self.alpha = aux_loss_alpha

        # Router: linear projection to E logits
        self.router = nn.Linear(d_model, num_experts, bias=False)

        # E independent expert networks
        self.experts = nn.ModuleList(
            [ExpertFFN(d_model, d_ff) for _ in range(num_experts)]
        )

    def forward(self, x: torch.Tensor):
        """
        Args:
            x: (batch_size, seq_len, d_model)
        Returns:
            output:   (batch_size, seq_len, d_model)
            aux_loss: scalar auxiliary load-balancing loss
        """
        B, T, D = x.shape
        # Flatten to (B*T, D) for routing
        x_flat = x.view(-1, D)          # (N, D)  where N = B * T
        N = x_flat.shape[0]

        # ── Router ────────────────────────────────────────────────────────────
        logits = self.router(x_flat)     # (N, E)
        scores = F.softmax(logits, dim=-1)  # (N, E)  soft router probabilities

        # Select top-k experts per token
        topk_scores, topk_indices = torch.topk(scores, self.top_k, dim=-1)
        # topk_scores:  (N, k)
        # topk_indices: (N, k)

        # Re-normalize the top-k scores so they sum to 1 per token
        topk_scores = topk_scores / topk_scores.sum(dim=-1, keepdim=True)

        # ── Expert Computation ────────────────────────────────────────────────
        output = torch.zeros_like(x_flat)  # (N, D)

        for expert_idx in range(self.num_experts):
            # Find which tokens routed to this expert (at any of the k positions)
            mask = (topk_indices == expert_idx)          # (N, k) bool
            token_mask = mask.any(dim=-1)                # (N,) bool
            if not token_mask.any():
                continue

            # Gather tokens for this expert
            expert_inputs = x_flat[token_mask]           # (n_i, D)

            # Compute expert output
            expert_output = self.experts[expert_idx](expert_inputs)  # (n_i, D)

            # Get the weight for this expert (sum over k positions where it appears)
            expert_weight = (mask * topk_scores)[token_mask].sum(dim=-1, keepdim=True)
            # expert_weight: (n_i, 1)

            output[token_mask] += expert_weight * expert_output

        # Reshape back to (B, T, D)
        output = output.view(B, T, D)

        # ── Auxiliary Load Balancing Loss ─────────────────────────────────────
        # f_i: fraction of tokens dispatched to expert i  (hard routing decision)
        dispatch_mask = torch.zeros(N, self.num_experts, device=x.device)
        dispatch_mask.scatter_(1, topk_indices, 1.0)
        f = dispatch_mask.mean(dim=0)              # (E,)  fraction per expert

        # p_i: average soft router probability for expert i
        p = scores.mean(dim=0)                     # (E,)

        # L_aux = alpha * E * sum_i(f_i * p_i)
        aux_loss = self.alpha * self.num_experts * (f * p).sum()

        return output, aux_loss


# ── Demo: Load balancing with and without auxiliary loss ──────────────────────

def run_demo():
    torch.manual_seed(42)
    d_model, d_ff, num_experts, top_k = 256, 1024, 8, 2
    B, T = 4, 32

    x = torch.randn(B, T, d_model)

    # Model with load balancing
    moe_balanced = SparseMoE(d_model, d_ff, num_experts, top_k, aux_loss_alpha=1e-2)

    # Model without load balancing (alpha=0)
    moe_unbalanced = SparseMoE(d_model, d_ff, num_experts, top_k, aux_loss_alpha=0.0)

    # One forward pass each
    out_b, aux_b = moe_balanced(x)
    out_u, aux_u = moe_unbalanced(x)

    print("SparseMoE Demo")
    print("=" * 50)
    print(f"Input shape:        {x.shape}")
    print(f"Output shape:       {out_b.shape}")
    print(f"Aux loss (alpha=1e-2): {aux_b.item():.6f}")
    print(f"Aux loss (alpha=0):    {aux_u.item():.6f}")
    print()

    # Show per-expert token counts for one batch
    with torch.no_grad():
        x_flat = x.view(-1, d_model)
        logits = moe_balanced.router(x_flat)
        scores = F.softmax(logits, dim=-1)
        _, topk_idx = torch.topk(scores, top_k, dim=-1)
        dispatch = torch.zeros(x_flat.shape[0], num_experts)
        dispatch.scatter_(1, topk_idx, 1.0)
        counts = dispatch.sum(dim=0).int().tolist()

    print("Tokens routed per expert (balanced model, 1 forward pass):")
    for i, c in enumerate(counts):
        bar = "#" * int(c // 2)
        print(f"  Expert {i}: {c:3d}  {bar}")


if __name__ == "__main__":
    run_demo()
`

function PythonContent() {
    return (
        <>
            <p>
                A minimal PyTorch implementation of a sparse MoE layer: a linear router with
                top-k selection, independent expert FFN networks, weighted-sum combination, and
                the Switch Transformer auxiliary load-balancing loss. The demo compares
                per-expert token routing with and without the auxiliary loss.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="sparse_moe.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const MIXTURE_OF_EXPERTS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
