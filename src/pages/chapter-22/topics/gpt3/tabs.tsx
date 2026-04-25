import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The 175-billion-parameter leap</h2>
            <p>
                By the end of 2019, the NLP community had absorbed two lessons: pre-training on
                large text corpora works (GPT-1, BERT), and scaling that pre-training improves
                results (GPT-2). But how far would scaling go? OpenAI's answer arrived in May
                2020 &mdash; a 175-billion-parameter model called GPT-3 that could answer questions,
                summarize articles, translate languages, and write code without being fine-tuned
                for any of these tasks. Its performance landed not through new ideas, but through
                one very large bet on scale.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Origins</div>
                    <div className="ch-tl-title">GPT-1 (117M) &mdash; the first generative pre-trained Transformer</div>
                    <div className="ch-tl-body">
                        Radford et al. introduced the first GPT: a 12-layer decoder-only Transformer
                        pre-trained on BooksCorpus (800M words) with a next-token prediction objective.
                        Fine-tuned on four NLP benchmarks, it surpassed LSTM-based models across the
                        board. The architecture was deliberately simple: learned positional embeddings,
                        masked self-attention, GELU activations, and a final linear head.
                        <br /><br />
                        The key insight was not the architecture but the paradigm: a language model
                        pre-trained to predict text already encodes enough world knowledge to be
                        useful for tasks it was never told about. A model that learns to predict the
                        next word learns grammar, facts, reasoning patterns, and discourse structure
                        as side effects.
                    </div>
                    <div className="ch-tl-impact">Impact: Established pre-train &rarr; fine-tune as the standard NLP pipeline</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2019</div>
                    <div className="ch-tl-section-label">Scale-up</div>
                    <div className="ch-tl-title">GPT-2 (1.5B) &mdash; zero-shot transfer and the first safety controversy</div>
                    <div className="ch-tl-body">
                        Radford et al. scaled to 1.5 billion parameters trained on WebText &mdash; 40&nbsp;GB
                        of text scraped from Reddit-curated web pages. The key finding was
                        zero-shot task transfer: GPT-2 could summarize, translate, and answer questions
                        with no task-specific training, simply by framing the task as a text completion
                        problem. Asking &ldquo;TL;DR:&rdquo; after an article produced a summary. Asking
                        &ldquo;Q: What is the capital of France? A:&rdquo; produced &ldquo;Paris.&rdquo;
                        <br /><br />
                        OpenAI initially withheld the full model weights, citing concerns that GPT-2
                        could be used to generate disinformation at scale. This sparked the first major
                        public debate about AI safety communications &mdash; critics argued the model was
                        not dangerous enough to justify the partial release, while others praised the
                        caution. The full model was released six months later without incident.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved zero-shot transfer; established the template for AI safety announcements</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">GPT-3 paper &mdash; "Language Models are Few-Shot Learners"</div>
                    <div className="ch-tl-body">
                        Brown et al. published a 175-billion-parameter model trained on approximately
                        300 billion tokens drawn from a mixture of Common Crawl (filtered), WebText2,
                        Books1, Books2, and Wikipedia. The architecture was unchanged from GPT-2 in
                        design: decoder-only Transformer with pre-LayerNorm. Only the scale changed &mdash;
                        96 layers, 96 attention heads, a 12,288-dimensional embedding space,
                        and a 2,048-token context window.
                        <br /><br />
                        The central claim was few-shot learning: given a handful of input&ndash;output
                        examples directly in the prompt, GPT-3 could perform tasks it had never been
                        fine-tuned for &mdash; arithmetic, reading comprehension, translation, cloze
                        tests, and SuperGLUE benchmarks &mdash; without any gradient updates at all.
                        On several tasks, few-shot GPT-3 matched fine-tuned BERT-large. Training
                        compute was estimated at ~3.14&times;10&sup2;&sup3; FLOPs, costing roughly
                        $4.6M on A100 GPUs.
                    </div>
                    <div className="ch-tl-impact">Impact: Demonstrated that scale alone could produce broad general-purpose language ability</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">June 2020</div>
                    <div className="ch-tl-section-label">Deployment</div>
                    <div className="ch-tl-title">GPT-3 API &mdash; AI as a commercial service</div>
                    <div className="ch-tl-body">
                        OpenAI released GPT-3 not as open weights, but as a paid API. This was a
                        strategic break from the research norm: instead of publishing a model that
                        anyone could run, OpenAI offered access to GPT-3 as a cloud service billed
                        per token. Developers could send prompts and receive completions without
                        ever touching the weights.
                        <br /><br />
                        The API enabled a wave of startups to build GPT-3-powered products within
                        months of the model's release. GitHub Copilot (code completion), Jasper
                        (marketing copy generation), and early versions of Notion AI all ran on GPT-3
                        under the hood. The API model became the template for how frontier AI would
                        be commercialized going forward.
                    </div>
                    <div className="ch-tl-impact">Impact: Turned a research artifact into a product platform; created the LLM API economy</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Codex &mdash; GPT-3 fine-tuned on code</div>
                    <div className="ch-tl-body">
                        Chen et al. at OpenAI fine-tuned a GPT-3-class model on 159&nbsp;GB of Python
                        source code from GitHub, producing Codex. To measure code generation quality,
                        they introduced HumanEval: a benchmark of 164 hand-written programming
                        problems, each with a set of unit tests. A solution &ldquo;passes&rdquo; only
                        if it produces correct output on all test cases. Codex-12B solved 28.8% of
                        problems.
                        <br /><br />
                        Codex became the engine behind GitHub Copilot, launched in June 2021. For
                        the first time, millions of developers had an AI assistant that could complete
                        functions, suggest variable names, and write docstrings in real time. This
                        demonstrated a critical point: general language model pre-training transfers
                        to code generation because code is text, and predicting the next token in
                        code is structurally identical to predicting the next token in prose.
                    </div>
                    <div className="ch-tl-impact">Impact: Launched AI-assisted programming as a mass-market product; introduced HumanEval</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021 &ndash; 2022</div>
                    <div className="ch-tl-section-label">Race</div>
                    <div className="ch-tl-title">GPT-3 ignites the LLM scaling race</div>
                    <div className="ch-tl-body">
                        GPT-3's demonstration that scale alone could produce emergent capabilities
                        triggered a wave of competing systems from every major AI lab. Jurassic-1
                        (AI21 Labs, 178B parameters), Megatron-Turing NLG (NVIDIA and Microsoft,
                        530B), Gopher (DeepMind, 280B), and PaLM (Google, 540B) all followed within
                        18 months. DeepMind's Chinchilla (70B, 1.4T tokens) then showed that many
                        of these giant models were under-trained &mdash; smaller models with more
                        data matched or beat them.
                        <br /><br />
                        GPT-3 also changed the strategic posture of AI research. Before 2020, most
                        major model releases came with detailed technical papers, open weights, and
                        benchmark tables. After GPT-3, the frontier shifted toward closed APIs and
                        commercial products, with technical details increasingly withheld.
                    </div>
                    <div className="ch-tl-impact">Impact: Triggered the competitive LLM era; established scale as the primary axis of competition</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">March 2023</div>
                    <div className="ch-tl-section-label">Successor</div>
                    <div className="ch-tl-title">GPT-4 &mdash; and the end of open research papers</div>
                    <div className="ch-tl-body">
                        OpenAI's GPT-4 introduced multimodal inputs (text and images) and substantially
                        better reasoning and instruction-following compared to GPT-3. It is widely
                        believed to use a mixture-of-experts architecture, though OpenAI published
                        no architecture paper &mdash; only a short technical report with benchmark
                        results and safety evaluations.
                        <br /><br />
                        The contrast with the original GPT-3 paper, which ran to 75 pages of
                        architecture details, training procedures, and benchmark analyses, was stark.
                        The shift from openly published research to opaque commercial product became
                        permanent. GPT-3 was both the peak of OpenAI's open-research era and the
                        last large model they described in full technical detail.
                    </div>
                    <div className="ch-tl-impact">Impact: Marked the definitive transition from open AI research to closed frontier development</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The central lesson of GPT-3:</strong> A single architectural idea
                &mdash; predict the next token &mdash; scaled to 175 billion parameters and
                300 billion training tokens produces a system with broad, general-purpose language
                ability that no one explicitly programmed. The capabilities that emerged &mdash;
                arithmetic, translation, code, analogical reasoning &mdash; were not designed;
                they were consequences of scale. This changed not just what AI could do, but
                what researchers believed AI <em>was</em>.
            </div>
        </>
    )
}

// ── Kid tab ───────────────────────────────────────────────────────────────────

function KidTab() {
    return (
        <>
            <h2>The world's most well-read robot</h2>

            <Analogy label="The World's Biggest Read-a-Lot">
                GPT-3 read more text than any human could manage in thousands of lifetimes. It read
                every English Wikipedia article, millions of books, and billions of web pages. It
                did not read them to understand stories or learn facts on purpose &mdash; it just
                practiced one game over and over: given the words so far, what word comes next?
                After doing that billions of times, something surprising happened: it got very good
                at almost everything.
            </Analogy>

            <Analogy label="Why 175 Billion Is Different from 1.5 Billion">
                The previous version, GPT-2, had 1.5 billion pieces (called parameters). GPT-3
                had 175 billion &mdash; more than 100 times as many. GPT-2 could write text that
                sounded real. But GPT-3 could write text, answer questions, translate between
                languages, write computer programs, summarize long articles, and do simple math.
                Nobody taught it those specific skills &mdash; they just appeared when the model
                got big enough. It is like upgrading from a pocket calculator to a supercomputer:
                the new one can do everything the old one did, plus a whole lot more that surprised
                even the scientists who built it.
            </Analogy>

            <Analogy label="Few-Shot Learning: Learning from Three Examples">
                Most AI systems need thousands of labeled examples before they can learn a task.
                GPT-3 can learn from just two or three examples shown right inside the question.
                If you write &ldquo;apple &rarr; red, banana &rarr; yellow, grape &rarr; ?&rdquo;
                it answers &ldquo;purple&rdquo; &mdash; without anyone training it to do color
                lookup. It reads your examples, figures out the pattern, and applies it. Scientists
                call this &ldquo;in-context learning&rdquo; &mdash; learning that happens inside
                the conversation, without the model changing at all.
            </Analogy>

            <Analogy label="The API: Renting a Brain">
                Instead of giving GPT-3 away for free, OpenAI let people &ldquo;rent&rdquo; it
                over the internet. You send a question, GPT-3 sends back an answer, and you pay
                a tiny amount per word. This meant that any developer anywhere in the world could
                build an app powered by GPT-3 &mdash; without needing to own a supercomputer or
                even understand how GPT-3 works. Hundreds of companies built products this way,
                almost overnight.
            </Analogy>

            <Analogy label="Codex: Reading a Million Programs">
                Scientists took GPT-3 and fed it even more text &mdash; but this time it was
                Python programs instead of web pages. After reading hundreds of millions of lines
                of code, GPT-3 learned to write programs too. They called this version Codex, and
                it became the engine of GitHub Copilot. You start typing a function, and Copilot
                finishes it for you &mdash; because it has seen millions of similar functions and
                learned what usually comes next. It is like having a programming assistant who has
                read every program ever written.
            </Analogy>

            <Analogy label="The Emergent Surprise">
                Nobody designed GPT-3 to solve arithmetic problems. But when you ask it
                &ldquo;What is 17 plus 28?&rdquo; it often gets the right answer &mdash; weakly,
                but noticeably better than random guessing. This is called &ldquo;emergence&rdquo;:
                a skill that nobody built in, but that appeared on its own as the model grew.
                Every time researchers doubled the number of parameters, new skills appeared that
                the smaller model could not do at all. This was the strangest and most exciting
                thing about GPT-3: the surprises did not stop once the training finished.
            </Analogy>
        </>
    )
}

// ── High school tab ───────────────────────────────────────────────────────────

const PY_CODE = `import torch
import torch.nn as nn
import math

# ── GPT-3-style Model (simplified) ───────────────────────────────────────────
# GPT-3 actual: 96 layers, 96 heads, d_model=12288, context=2048
# This demo: 4 layers, 8 heads, d_model=512 — same design, smaller scale

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_head  = d_model // n_heads
        self.qkv     = nn.Linear(d_model, 3 * d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)
        self.scale   = math.sqrt(self.d_head)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C = x.shape
        qkv = self.qkv(x).chunk(3, dim=-1)          # three (B, T, C) tensors
        q, k, v = [
            t.view(B, T, self.n_heads, self.d_head).transpose(1, 2)
            for t in qkv
        ]                                             # (B, n_heads, T, d_head)

        # Causal (masked) scaled dot-product attention
        attn = (q @ k.transpose(-2, -1)) / self.scale  # (B, H, T, T)
        mask = torch.tril(torch.ones(T, T, device=x.device)).bool()
        attn = attn.masked_fill(~mask, float("-inf"))
        attn = torch.softmax(attn, dim=-1)

        out = attn @ v                                # (B, H, T, d_head)
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.out_proj(out)


class MLP(nn.Module):
    """Position-wise feed-forward block (expand 4x, GELU, project back)."""
    def __init__(self, d_model: int):
        super().__init__()
        self.fc1  = nn.Linear(d_model, 4 * d_model)
        self.act  = nn.GELU()
        self.fc2  = nn.Linear(4 * d_model, d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.fc2(self.act(self.fc1(x)))


class TransformerBlock(nn.Module):
    """Pre-LayerNorm decoder block (the GPT-3 variant)."""
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        self.ln1  = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ln2  = nn.LayerNorm(d_model)
        self.mlp  = MLP(d_model)
        self.drop = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.drop(self.attn(self.ln1(x)))   # residual + attention
        x = x + self.drop(self.mlp(self.ln2(x)))    # residual + MLP
        return x


class GPT3Style(nn.Module):
    """
    Decoder-only GPT-3-style language model.

    GPT-3 actual dimensions:
        vocab_size = 50257   (BPE vocabulary)
        d_model    = 12288
        n_layers   = 96
        n_heads    = 96      (d_head = 128)
        ctx_len    = 2048
        params     ~ 175B
    """
    def __init__(
        self,
        vocab_size: int = 50257,
        d_model: int    = 512,     # 12288 in real GPT-3
        n_layers: int   = 4,       # 96 in real GPT-3
        n_heads: int    = 8,       # 96 in real GPT-3
        ctx_len: int    = 2048,
        dropout: float  = 0.1,
    ):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(ctx_len, d_model)   # learned, like GPT-3
        self.drop    = nn.Dropout(dropout)
        self.blocks  = nn.ModuleList([
            TransformerBlock(d_model, n_heads, dropout)
            for _ in range(n_layers)
        ])
        self.ln_f    = nn.LayerNorm(d_model)            # final layer norm
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)

        # Weight tying: embedding and LM head share weights (reduces params)
        self.lm_head.weight = self.tok_emb.weight

    def forward(self, idx: torch.Tensor) -> torch.Tensor:
        B, T = idx.shape
        pos  = torch.arange(T, device=idx.device).unsqueeze(0)  # (1, T)
        x    = self.drop(self.tok_emb(idx) + self.pos_emb(pos))
        for block in self.blocks:
            x = block(x)
        x    = self.ln_f(x)
        return self.lm_head(x)   # (B, T, vocab_size) — logits


# ── Demo ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    model = GPT3Style()
    n_params = sum(p.numel() for p in model.parameters())
    print(f"Demo model parameters: {n_params:,}")

    # Real GPT-3 parameter count (approximate)
    # 96 layers x (4 * d^2 attn + 8 * d^2 MLP) + embeddings
    d = 12288
    gpt3_approx = 96 * (4 * d**2 + 8 * d**2) + 50257 * d
    print(f"GPT-3 approx parameters: {gpt3_approx:,} (~175B)")

    # Forward pass sanity check
    x   = torch.randint(0, 50257, (2, 64))   # batch=2, seq_len=64
    out = model(x)
    print(f"Input shape:  {x.shape}")
    print(f"Output shape: {out.shape}")   # (2, 64, 50257)

    # Cross-entropy training loss
    targets = torch.randint(0, 50257, (2, 64))
    loss    = torch.nn.functional.cross_entropy(
        out.view(-1, 50257), targets.view(-1)
    )
    print(f"Training loss (random init): {loss.item():.3f}")
    print(f"Expected (ln vocab_size):    {math.log(50257):.3f}")
`

function MathsContent() {
    return (
        <>
            <h2>Derivations and formal notation</h2>

            <DefBlock label="Language Model Objective">
                GPT-3 is trained to minimize the negative log-likelihood of the next token
                given all preceding tokens. For a sequence of T tokens
                (x&#8321;, x&#8322;, &hellip;, x&#8348;), the objective is:
            </DefBlock>
            <MathBlock tex="\mathcal{L} = -\frac{1}{T} \sum_{t=1}^{T} \log P_\theta(x_t \mid x_1, \ldots, x_{t-1})" />
            <p>
                The parameters &theta; are shared across all positions. At each position the
                model produces a distribution over the full 50,257-token vocabulary, and the loss
                is the average negative log probability assigned to the correct token.
            </p>

            <h3>Few-shot conditioning</h3>
            <p>
                In few-shot evaluation, the model receives K input&ndash;output demonstration
                pairs followed by a test input x. No gradient updates occur. The predicted
                output y is:
            </p>
            <MathBlock tex="P(y \mid x, \mathcal{D}_K) = P_\theta\!\left(y \;\middle|\; (x_1^{(1)}, y_1^{(1)}), \ldots, (x_K^{(K)}, y_K^{(K)}), x\right)" />
            <p>
                where &#120491;&#8318; = &#123;(x&#8321;&sup1;, y&#8321;&sup1;), &hellip;, (x&#8342;&sup1;, y&#8342;&sup1;)&#125; are
                the demonstration examples concatenated into the context window. The model
                conditions on all preceding tokens simultaneously; the &ldquo;learning&rdquo;
                is entirely a function of the attention pattern over the context, not of weight
                updates.
            </p>

            <h3>Parameter count</h3>
            <p>
                For a decoder-only Transformer with L layers, embedding dimension d, vocabulary
                size V, and context length T, the dominant parameter cost is:
            </p>
            <MathBlock tex="N \approx L \cdot \left(4d^2_{\text{attn}} + 8d^2_{\text{mlp}}\right) + V \cdot d" />
            <p>
                In GPT-3: L=96, d=12288, d&#8320;=12288, V=50257. The attention matrices
                (Q, K, V, O each of size d&times;d) contribute 4d&#178; per layer; the MLP
                (two linear layers of size d&times;4d and 4d&times;d) contributes 8d&#178; per
                layer. This gives approximately 175 billion non-embedding parameters.
            </p>

            <h3>Training compute</h3>
            <p>
                The standard estimate for training compute is:
            </p>
            <MathBlock tex="C \approx 6 N D" />
            <p>
                where N is the number of (non-embedding) parameters and D is the number of
                training tokens. The factor of 6 accounts for one forward pass (2ND FLOPs)
                and one backward pass (4ND FLOPs). For GPT-3: N&nbsp;&asymp;&nbsp;175&times;10&sup9;,
                D&nbsp;&asymp;&nbsp;300&times;10&sup9;, giving C&nbsp;&asymp;&nbsp;3.15&times;10&sup2;&sup3;&nbsp;FLOPs.
            </p>

            <h3>BPE tokenization</h3>
            <p>
                GPT-3 uses Byte-Pair Encoding (BPE) with a vocabulary of 50,257 tokens. BPE
                starts with a character-level vocabulary and iteratively merges the most frequent
                adjacent pair until the vocabulary reaches its target size. The merge rule at
                step s selects:
            </p>
            <MathBlock tex="\text{merge}_s = \operatorname*{arg\,max}_{(a,b)} \text{count}(ab)" />
            <p>
                where the count is computed over the current segmentation of the training
                corpus. After all merges are determined, the tokenizer applies them greedily
                left-to-right at inference time. The 50,257 vocabulary was chosen empirically
                to balance vocabulary coverage against embedding table size.
            </p>

            <div className="ch-callout">
                <strong>Key number:</strong> GPT-3's training compute of ~3.14&times;10&sup2;&sup3;&nbsp;FLOPs
                sits exactly on the Kaplan scaling law prediction for a model that achieves
                its loss. This was not a coincidence &mdash; OpenAI used the scaling law to
                choose the model size and token count before training began.
            </div>
        </>
    )
}

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of a GPT-3&ndash;style decoder-only Transformer. The
                demo model uses smaller dimensions (d=512, 4 layers, 8 heads) but the same
                architecture as GPT-3: pre-LayerNorm blocks, learned positional embeddings,
                GELU activations, and weight tying between the token embedding and the LM
                head. A comment shows how to scale the dimensions to reach the actual GPT-3
                175B configuration.
            </p>
            <CodeBlock code={PY_CODE} filename="gpt3_model.py" lang="python" langLabel="Python" />
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Architecture, training, and the few-shot paradigm</h2>

            <h3>GPT-3 architecture</h3>
            <p>
                GPT-3 is a decoder-only Transformer &mdash; the same design as GPT-1 and GPT-2,
                just much larger. The key dimensions are:
            </p>
            <ul>
                <li><strong>Layers (L):</strong> 96</li>
                <li><strong>Attention heads (H):</strong> 96 (d&#8320; = 128 per head)</li>
                <li><strong>Embedding dimension (d):</strong> 12,288</li>
                <li><strong>Context window:</strong> 2,048 tokens</li>
                <li><strong>Total parameters:</strong> ~175 billion</li>
            </ul>
            <p>
                Every layer uses Pre-LayerNorm: the layer norm is applied <em>before</em> the
                attention and MLP sub-layers rather than after (as in the original Transformer).
                This stabilizes training at large scale. Alternating layers use sparse attention
                patterns, though the full model also includes dense attention layers. Activations
                are GELU throughout.
            </p>
            <MathBlock tex="N \approx L \cdot (4d^2 + 8d^2) + V \cdot d \approx 175 \times 10^9" />

            <h3>Training data and tokenization</h3>
            <p>
                GPT-3 was trained on a weighted mixture of corpora totaling approximately
                300 billion tokens:
            </p>
            <ul>
                <li><strong>Common Crawl</strong> (filtered and deduplicated) &mdash; 410B tokens in the raw corpus, 60% of training weight</li>
                <li><strong>WebText2</strong> (Reddit-curated, GPT-2&ndash;style) &mdash; 19B tokens, 22% weight</li>
                <li><strong>Books1 and Books2</strong> &mdash; 67B tokens, 8% weight each</li>
                <li><strong>Wikipedia (English)</strong> &mdash; 3B tokens, 3% weight</li>
            </ul>
            <p>
                Tokenization uses Byte-Pair Encoding with a vocabulary of 50,257 tokens. The
                training objective is next-token prediction via cross-entropy:
            </p>
            <MathBlock tex="\mathcal{L} = -\frac{1}{T} \sum_{t=1}^{T} \log P_\theta(x_t \mid x_1, \ldots, x_{t-1})" />
            <p>
                The learning rate schedule uses cosine decay with a linear warmup over 375
                million tokens, decaying to 10% of the peak learning rate by the end of training.
            </p>

            <h3>Few-shot, one-shot, and zero-shot evaluation</h3>
            <p>
                Brown et al. defined three evaluation protocols that have become standard:
            </p>
            <ul>
                <li><strong>Zero-shot:</strong> task description only &mdash; no examples</li>
                <li><strong>One-shot:</strong> task description + one input&ndash;output example</li>
                <li><strong>Few-shot:</strong> task description + up to 32 input&ndash;output examples</li>
            </ul>
            <p>
                In all three modes, no gradient updates are made. The model conditions on the
                full context and generates a completion. Performance improves monotonically from
                zero-shot to few-shot. The formal conditioning is:
            </p>
            <MathBlock tex="P(y \mid x, \mathcal{D}_K) = P_\theta\!\left(y \;\middle|\; (x_1, y_1), \ldots, (x_K, y_K), x\right)" />
            <p>
                On SuperGLUE, few-shot GPT-3 scored 71.8 vs. fine-tuned BERT-large at 69.0,
                despite GPT-3 receiving no task-specific gradient updates. On TriviaQA, few-shot
                GPT-3 achieved 77.5% accuracy, surpassing the state-of-the-art fine-tuned model
                at the time.
            </p>

            <h3>Calibration and limitations</h3>
            <p>
                GPT-3 is a powerful but unreliable reasoner. Several systematic failure modes
                were identified in the original paper and subsequent work:
            </p>
            <ul>
                <li>
                    <strong>Prompt sensitivity:</strong> small rewording of a prompt &mdash; changing
                    &ldquo;Q:&rdquo; to &ldquo;Question:&rdquo; &mdash; can shift accuracy by 10&ndash;20
                    percentage points on some benchmarks.
                </li>
                <li>
                    <strong>Overconfidence:</strong> on TriviaQA, GPT-3 achieves 64.3% accuracy on its
                    top answer but shows high confidence on incorrect answers outside its training
                    distribution.
                </li>
                <li>
                    <strong>Compositional reasoning:</strong> GPT-3 struggles with tasks requiring
                    systematic application of a rule across novel combinations, such as multi-step
                    arithmetic or logical chaining.
                </li>
                <li>
                    <strong>Sycophancy:</strong> GPT-3 tends to agree with incorrect premises stated
                    in the prompt, producing confident errors when users frame questions with false
                    assumptions.
                </li>
            </ul>
            <p>
                These limitations motivated the fine-tuning approaches explored in InstructGPT
                (Chapter 25), which applied reinforcement learning from human feedback to make
                GPT-3 more honest and helpful.
            </p>

            <h3>Compute and the economics of scale</h3>
            <p>
                Using the standard approximation C &asymp; 6ND for Transformer training compute:
            </p>
            <MathBlock tex="C \approx 6 \times 175 \times 10^9 \times 300 \times 10^9 \approx 3.14 \times 10^{23} \text{ FLOPs}" />
            <p>
                An NVIDIA A100 at peak throughput delivers approximately 312 TFLOP/s. Running
                at realistic utilization (~40%), the effective throughput is ~125 TFLOP/s.
                At that rate, GPT-3&rsquo;s training compute requires:
            </p>
            <MathBlock tex="\frac{3.14 \times 10^{23}}{1.25 \times 10^{14}} \approx 2.5 \times 10^{9} \text{ GPU-seconds} \approx 1{,}160 \text{ GPU-years}" />
            <p>
                Across thousands of GPUs in parallel (OpenAI used ~10,000 A100s), this
                translates to a wall-clock training time of weeks, at an estimated cost of
                $4.6M at 2020 cloud GPU prices. The cost has since risen as GPU time became
                more expensive. GPT-3 was the first model to make clear that frontier AI
                requires institutional capital &mdash; it cannot be trained by individuals or
                small teams.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">BPE tokenization &middot; few-shot conditioning &middot; compute formula</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">PyTorch &middot; GPT-3&ndash;style decoder model</span>
                </summary>
                <div className="ch-expandable-body">
                    <PythonContent />
                </div>
            </details>
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const GPT3_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
