import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python code ───────────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
from transformers import BertModel, BertConfig

# ── Pfeiffer Adapter Module ────────────────────────────────────────────────────
class AdapterModule(nn.Module):
    """
    A Pfeiffer-style adapter: down-project -> GELU -> up-project + skip.
    Inserted after the FFN sublayer of each Transformer layer.
    """
    def __init__(self, d_model: int, bottleneck: int):
        super().__init__()
        self.down = nn.Linear(d_model, bottleneck)
        self.act  = nn.GELU()
        self.up   = nn.Linear(bottleneck, d_model)
        # Near-zero init on W_up so h_prime ~ h at init (near-identity)
        nn.init.zeros_(self.up.weight)
        nn.init.zeros_(self.up.bias)

    def forward(self, h: torch.Tensor) -> torch.Tensor:
        # h: (batch, seq_len, d_model)
        return h + self.up(self.act(self.down(h)))   # skip connection

    def parameter_count(self) -> int:
        return sum(p.numel() for p in self.parameters())


# ── Wrapping a frozen BERT layer with an adapter ───────────────────────────────
class BertLayerWithAdapter(nn.Module):
    """
    Wraps a single BertLayer, freezes it, and attaches a Pfeiffer adapter
    after the FFN output.
    """
    def __init__(self, bert_layer: nn.Module, d_model: int, bottleneck: int):
        super().__init__()
        self.bert_layer = bert_layer
        self.adapter    = AdapterModule(d_model, bottleneck)
        # Freeze the original BERT layer
        for param in self.bert_layer.parameters():
            param.requires_grad = False

    def forward(self, hidden_states, attention_mask=None, **kwargs):
        # Run the frozen BERT layer
        outputs = self.bert_layer(hidden_states, attention_mask=attention_mask, **kwargs)
        hidden  = outputs[0]
        # Apply adapter (only adapter parameters receive gradients)
        hidden  = self.adapter(hidden)
        return (hidden,) + outputs[1:]


# ── Inject adapters into all BERT layers ──────────────────────────────────────
def add_pfeiffer_adapters(model: BertModel, bottleneck: int = 64) -> BertModel:
    d_model = model.config.hidden_size
    for i, layer in enumerate(model.encoder.layer):
        model.encoder.layer[i] = BertLayerWithAdapter(layer, d_model, bottleneck)
    return model


# ── Demo ──────────────────────────────────────────────────────────────────────
config = BertConfig.from_pretrained("bert-base-uncased")
model  = BertModel(config)

total_params  = sum(p.numel() for p in model.parameters())
print(f"BERT-base total params:     {total_params:,}")

model = add_pfeiffer_adapters(model, bottleneck=64)

trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Trainable (adapter) params: {trainable:,}")
print(f"Adapter overhead:           {100 * trainable / total_params:.2f}%")

# Forward pass
input_ids      = torch.randint(0, config.vocab_size, (2, 128))
attention_mask = torch.ones(2, 128, dtype=torch.long)
outputs        = model(input_ids=input_ids, attention_mask=attention_mask)
print(f"Output shape: {outputs.last_hidden_state.shape}")  # (2, 128, 768)
`

// ── Tab components ────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The bottleneck that proved efficiency was possible</h2>
            <p>
                Before adapters, the only path to task-specific performance was full fine-tuning
                &mdash; updating every weight in the model for every new task. With models growing
                toward hundreds of billions of parameters, this was becoming operationally
                unsustainable. In 2019, Houlsby et al. showed that inserting tiny bottleneck
                modules into a frozen Transformer &mdash; touching less than 4% of its parameters
                &mdash; was enough to match full fine-tuning on every GLUE benchmark.
                That single result cracked open the entire field of parameter-efficient fine-tuning.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017&ndash;2018</div>
                    <div className="ch-tl-section-label">Precedent</div>
                    <div className="ch-tl-title">Progressive Neural Networks and multi-task inefficiency</div>
                    <div className="ch-tl-body">
                        As deep learning moved to multi-task and multi-domain settings, the naive
                        approach was to maintain entirely separate model copies for each task &mdash;
                        expensive in storage and GPU memory. Progressive Neural Networks (Rusu et al.,
                        2016) added lateral connections from previous task columns to new ones, but
                        still required storing all previous columns. There was no principled method
                        for adapting a single shared model efficiently to many tasks simultaneously.
                    </div>
                    <div className="ch-tl-impact">Impact: Exposed the scalability wall of per-task model copies</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">Sep 2019</div>
                    <div className="ch-tl-section-label">Invention</div>
                    <div className="ch-tl-title">Houlsby et al. &mdash; "Parameter-Efficient Transfer Learning for NLP"</div>
                    <div className="ch-tl-body">
                        The adapter paper. Key contribution: insert two small adapter modules per
                        Transformer layer (one after the attention sublayer, one after the FFN
                        sublayer). Each adapter is a bottleneck &mdash; a down-projection
                        W&#x2093;&nbsp;&isin;&nbsp;&#8477;<sup>d&times;r</sup> reducing from d to r,
                        a GELU nonlinearity, an up-projection W&#x1D467;&nbsp;&isin;&nbsp;&#8477;<sup>r&times;d</sup>
                        restoring to d, plus a skip connection. Only W&#x2093; and W&#x1D467; are
                        trained; the Transformer's original weights are frozen. With r&nbsp;=&nbsp;64
                        on BERT-base (d&nbsp;=&nbsp;768), adapters add 3.6% extra parameters and
                        match full fine-tuning on GLUE within 0.4%.
                    </div>
                    <div className="ch-tl-impact">Impact: First proof that &lt;4% parameters suffices for full performance</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Ecosystem</div>
                    <div className="ch-tl-title">AdapterHub (Pfeiffer et al.) &mdash; composable adapters</div>
                    <div className="ch-tl-body">
                        Pfeiffer et al. released AdapterHub, a framework for composing and sharing
                        adapters across tasks. The key finding: adapters for different tasks can be
                        stacked or combined without interfering with each other, because the base
                        model's weights are shared and unchanged. This enabled "adapter stacking"
                        &mdash; a language-understanding adapter, a domain adapter, and a task
                        adapter, each trained independently, combined at inference.
                    </div>
                    <div className="ch-tl-impact">Impact: Made adapters composable and community-shareable</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020</div>
                    <div className="ch-tl-section-label">Simplification</div>
                    <div className="ch-tl-title">Pfeiffer adapters &mdash; one adapter per layer</div>
                    <div className="ch-tl-body">
                        Pfeiffer et al. showed that inserting only one adapter per layer (after the
                        FFN, not after attention) achieved the same accuracy as Houlsby's two-adapter
                        design with half the parameters and 20% less inference latency. The attention
                        sublayer adapter was largely redundant. This single-adapter design became the
                        standard adapter configuration and the baseline for all subsequent comparisons.
                    </div>
                    <div className="ch-tl-impact">Impact: Halved adapter cost with no accuracy loss &mdash; became the standard</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2020&ndash;2021</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">MAD-X &mdash; cross-lingual adapter composition</div>
                    <div className="ch-tl-body">
                        Pfeiffer et al. (2020) extended adapters to multilingual settings: language
                        adapters trained on monolingual corpora, task adapters trained on English
                        labeled data, and a composition mechanism combining them for zero-shot
                        cross-lingual transfer. By swapping language adapters, a model fine-tuned
                        only on English NLI data could transfer to any of 42 languages without
                        additional labeled data in the target language.
                    </div>
                    <div className="ch-tl-impact">Impact: Zero-shot transfer to 42 languages via adapter swapping</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Competition</div>
                    <div className="ch-tl-title">Comparison with LoRA &mdash; the latency trade-off</div>
                    <div className="ch-tl-body">
                        Hu et al.'s LoRA analysis showed that LoRA matches adapter performance while
                        adding zero inference latency, because LoRA matrices merge into the base
                        weights at deployment. Adapters add forward-pass latency proportional to
                        bottleneck size &mdash; extra linear transformations that run on every
                        forward pass and cannot be precomputed away. In high-throughput serving
                        (GPT-3 API scale), this latency difference becomes significant. Adapters
                        retain an advantage in modularity: they can be composed without retraining.
                    </div>
                    <div className="ch-tl-impact">Impact: LoRA won production deployments; adapters retained the composition niche</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Benchmark</div>
                    <div className="ch-tl-title">Unified PEFT benchmarks &mdash; complementary strengths</div>
                    <div className="ch-tl-body">
                        Large-scale PEFT benchmarks showed adapters perform comparably to LoRA on
                        instruction-following tasks but slightly worse on few-shot classification.
                        One hypothesis: the FFN bottleneck captures feature transformations
                        efficiently but cannot modify attention patterns directly, whereas LoRA's
                        W&#x2082;&nbsp;/&nbsp;W&#x1D463; targeting adjusts how tokens attend to each
                        other. The two methods are best understood as complementary &mdash; adapters
                        for modular multi-task composition, LoRA for efficient single-task deployment.
                    </div>
                    <div className="ch-tl-impact">Impact: Established PEFT as a rigorous research field with clear trade-off maps</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>Why adapters matter historically:</strong> Before Houlsby et al., the
                community assumption was that parameter count and fine-tuning performance were
                tightly coupled. Adapters broke that assumption decisively, launching the PEFT
                research program that produced LoRA, prefix-tuning, prompt tuning, and
                (IA)&#x00B3; &mdash; methods that now underpin virtually every production LLM
                fine-tuning workflow.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Little rooms that teach the building new tricks</h2>

            <Analogy label="The Extra Rooms in the House">
                Think of a Transformer as a tall building with many floors. Each floor does some work
                on the information passing through it. An adapter is like adding a tiny extra room
                to each floor. The building's structure stays completely the same &mdash; you never
                move any walls or rewire any electricity. You just add a small room that quietly
                adjusts what comes out of each floor. The original building is never touched.
            </Analogy>

            <Analogy label="Bottleneck: Squeeze and Expand">
                Each adapter room works like a funnel. Information flows in (768 numbers) and gets
                squeezed into a tiny corridor (64 numbers). Inside the corridor, a small function
                figures out what changes need to be made. Then the corridor expands back to the
                original size (768 numbers) and the result gets added back to the original
                information. The squeeze-and-expand design forces the adapter to learn the most
                important change it can in a very small space.
            </Analogy>

            <Analogy label="Plug and Play Adapters">
                Because the big model is never changed, you can swap adapters in and out. Install a
                "legal document" adapter &mdash; the model now helps with contracts and case law.
                Remove it and install a "poetry" adapter &mdash; the same model now writes sonnets.
                The base model weighs gigabytes; each adapter weighs a few megabytes. One building,
                many tiny rooms, each teaching it something new.
            </Analogy>

            <Analogy label="The Latency Problem: Why LoRA Won">
                There is one downside to the extra rooms: every single time information walks through
                the building, it has to enter and exit each extra room. That takes extra time. LoRA
                (which came after adapters) found a smarter trick: its changes can be folded directly
                into the building's original walls before anyone visits, so there is no extra room to
                walk through at all. For a server handling millions of visitors per day, those saved
                milliseconds add up to real money.
            </Analogy>

            <Analogy label="Cross-Lingual Adapters: Language Swap">
                Imagine you train a "French language" adapter and a "German language" adapter. Then
                separately you train a "sentiment analysis" adapter using only English data. Now:
                want to analyze sentiment in French? Stack the French adapter and the sentiment
                adapter together. Want German sentiment? Stack the German adapter and the sentiment
                adapter together. You never needed any French or German sentiment labels &mdash; just
                the two types of adapters combined.
            </Analogy>

            <Analogy label="Why Adapters Proved the Idea">
                Before adapters, everyone assumed you had to update every single parameter in a huge
                model to make it work well on a new task. Adapters proved that updating only 3.6% of
                the parameters was enough to get the same results. That proof &mdash; that small
                changes in the right places beat large changes everywhere &mdash; opened the door to
                LoRA, prompt tuning, and the whole family of efficient fine-tuning methods that
                researchers use today.
            </Analogy>
        </>
    )
}

function MathsContent() {
    return (
        <>
            <h2>Adapter mathematics &mdash; initialization and capacity</h2>

            <DefBlock label="Near-identity initialization">
                The adapter applies h&prime; = W&#x1D467; &middot; GELU(W&#x2093; &middot; h) + h.
                To ensure the adapter is a near-identity map at the start of training &mdash; so
                that the base model's pre-trained behavior is preserved &mdash; W&#x1D467; is
                initialized to near-zero (e.g., zeros or very small Gaussian noise):
            </DefBlock>

            <MathBlock tex="\text{At init: } W_{\text{up}} \approx 0 \implies h' = W_{\text{up}}\,\text{GELU}(W_{\text{down}}\,h) + h \approx h" />

            <p>
                This means gradients at the very first step flow through the skip connection
                h without distortion. Training begins from the stable pre-trained representation
                and incrementally learns the task-specific residual &Delta;h.
            </p>

            <h3>Capacity of a rank-r bottleneck</h3>
            <p>
                Full fine-tuning of a layer of dimension d updates a matrix of rank up to d,
                with d&sup2; parameters. An adapter with bottleneck r learns a composition
                W&#x1D467; W&#x2093; whose rank is at most r, with only 2dr parameters:
            </p>

            <MathBlock tex="\text{rank}(W_{\text{up}} W_{\text{down}}) \leq r \ll d" />

            <MathBlock tex="\text{Full fine-tune params: } d^2 \qquad \text{Adapter params: } 2dr \qquad \text{Ratio: } \frac{2r}{d}" />

            <p>
                For BERT-base (d&nbsp;=&nbsp;768, r&nbsp;=&nbsp;64): ratio is 2&times;64/768&nbsp;&asymp;&nbsp;16.7%.
                Houlsby uses 2 adapters per layer (after attention and FFN), so the per-layer
                overhead is 4dr. Pfeiffer uses 1 adapter (after FFN), halving it to 2dr.
            </p>

            <MathBlock tex="\text{Houlsby (12 layers, }d{=}768,r{=}64\text{): } 4 \times 12 \times 768 \times 64 = 2{,}359{,}296 \approx 3.6\%\ \text{of BERT-base}" />

            <h3>Why low-rank suffices</h3>
            <p>
                Empirically, the weight changes required to adapt a pre-trained model to a
                downstream task lie in a low-dimensional subspace of the full parameter space.
                Aghajanyan et al. (2020) measured this "intrinsic dimensionality" and found that
                for many NLP tasks it is under 200. A rank-64 bottleneck (128 directions per
                adapter weight matrix) comfortably spans this subspace.
            </p>

            <MathBlock tex="d_{\text{intrinsic}} \ll r \cdot L \leq \text{adapter parameter count}" />
        </>
    )
}

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of a Pfeiffer adapter module, then wrapping a frozen
                HuggingFace BERT with adapters and verifying the trainable parameter count.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="adapter_bert.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Adapter layers &mdash; architecture, placement, and trade-offs</h2>

            <h3>Adapter Architecture</h3>
            <p>
                For a Transformer layer with hidden dimension d and adapter bottleneck r, the adapter
                applies a residual bottleneck transformation to the layer's output h:
            </p>
            <MathBlock tex="h' = W_{\text{up}} \cdot \text{GELU}(W_{\text{down}} \cdot h) + h" />
            <p>
                where W&#x2093;&nbsp;&isin;&nbsp;&#8477;<sup>r&times;d</sup> (down-projection from d to r)
                and W&#x1D467;&nbsp;&isin;&nbsp;&#8477;<sup>d&times;r</sup> (up-projection from r to d).
                The skip connection h ensures h&prime;&nbsp;&asymp;&nbsp;h at initialization (W&#x1D467;
                initialized near zero). Parameter count per adapter: 2dr. For BERT-base
                (12 layers, d&nbsp;=&nbsp;768, r&nbsp;=&nbsp;64):
            </p>
            <MathBlock tex="\text{Houlsby (2 adapters/layer): } 4 \times 12 \times 768 \times 64 = 2{,}359{,}296 \approx 3.6\%\ \text{of BERT-base (65M params)}" />

            <DefBlock label="Bottleneck Adapter">
                A module of the form h&prime; = W&#x1D467;&nbsp;GELU(W&#x2093;&nbsp;h)&nbsp;+&nbsp;h
                where W&#x2093;&nbsp;&isin;&nbsp;&#8477;<sup>r&times;d</sup>,
                W&#x1D467;&nbsp;&isin;&nbsp;&#8477;<sup>d&times;r</sup>, r&nbsp;&lt;&lt;&nbsp;d.
                Only W&#x2093; and W&#x1D467; are trained; the base Transformer weights are frozen.
            </DefBlock>

            <h3>Placement Analysis</h3>
            <p>
                Houlsby adapters are inserted at two positions per layer: after the multi-head
                attention sublayer and after the feed-forward network (FFN) sublayer. Pfeiffer
                adapters use only one position &mdash; after the FFN. The residual form of the full
                layer with a Pfeiffer adapter is:
            </p>
            <MathBlock tex="h_{\text{out}} = \text{Adapter}\!\left(\text{LayerNorm}\!\left(h_{\text{in}} + \text{FFN}(h_{\text{in}})\right)\right)" />
            <p>
                The attention sublayer processes inter-token relationships (contextual mixing);
                the FFN sublayer processes each token's representation independently (token-level
                feature transformation). Task-specific knowledge tends to reside in FFN weights,
                which explains why a single FFN-adapter matches two attention+FFN adapters while
                using half the parameters and 20% less latency.
            </p>

            <h3>Adapter Composition (MAD-X Framework)</h3>
            <p>
                Let A&#x2097;&nbsp; denote a language adapter and A&#x1D461; a task adapter. Because
                each adapter has a skip connection, the composition is approximately additive:
            </p>
            <MathBlock tex="h'' = A_{\text{task}}\!\left(A_{\text{lang}}(h_{\text{base}})\right) \approx h_{\text{base}} + \Delta_{\text{lang}} + \Delta_{\text{task}}" />
            <p>
                Independence holds when r is small enough that cross-task interference is minimal.
                Language adapters are trained on monolingual corpora; task adapters are trained on
                English labeled data. For target-language inference, only the language adapter is
                swapped &mdash; no target-language labeled data required.
            </p>

            <h3>MAD-X Cross-Lingual Transfer</h3>
            <p>
                The MAD-X protocol:
            </p>
            <ol>
                <li>
                    Pretrain language adapters &#123;A&#x2097;,&#x1D456;&#125; on monolingual corpora
                    for each language i (e.g., French Wikipedia, German news).
                </li>
                <li>
                    Train task adapter A&#x1D461; on English labeled data with the base model frozen
                    (no language adapter active).
                </li>
                <li>
                    Transfer: compose A&#x2097;,target&nbsp;+&nbsp;A&#x1D461; for the target language.
                    The language adapter shifts the representation space; the task adapter reasons
                    within it.
                </li>
            </ol>
            <MathBlock tex="P(y \mid x_{\text{target}}) = f_{\theta_0,\, A_{\text{lang,target}},\, A_{\text{task}}}(x_{\text{target}})" />
            <p>
                Evaluated on XNLI across 42 languages, MAD-X outperformed mBERT zero-shot transfer
                by an average of 3.6 percentage points without any target-language task labels.
            </p>

            <h3>Latency Comparison: Adapters vs. LoRA</h3>
            <p>
                Adapter forward pass adds extra matrix multiplications on every inference call.
                For a single Pfeiffer adapter with d&nbsp;=&nbsp;4096, r&nbsp;=&nbsp;64, sequence
                length T&nbsp;=&nbsp;1024, over L&nbsp;=&nbsp;96 layers:
            </p>
            <MathBlock tex="\text{Adapter extra FLOPs} \approx 2 \times L \times T \times d \times r = 2 \times 96 \times 1024 \times 4096 \times 64 \approx 51\text{B FLOPs}" />
            <p>
                This is roughly 10% of base-model FLOPs per forward pass. LoRA's extra parameters,
                by contrast, are merged into W&#x2080; at deployment:
            </p>
            <MathBlock tex="W_{\text{deploy}} = W_0 + \Delta W = W_0 + BA \implies \text{zero extra FLOPs at inference}" />
            <p>
                For a high-throughput API serving millions of requests per day, the adapter's latency
                overhead becomes a meaningful cost. This is the primary reason LoRA displaced adapters
                as the default PEFT method in production settings, even though both achieve similar
                accuracy.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Near-identity init &middot; rank capacity &middot; intrinsic dimensionality</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch adapter module &middot; frozen BERT &middot; parameter audit</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const ADAPTER_LAYERS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
}
