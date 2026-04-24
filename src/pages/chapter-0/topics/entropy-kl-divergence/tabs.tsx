import { Analogy, CodeBlock, DefBlock, DiagramBlock, InlineMath, MathBlock } from "../../shared"
import { EntropyDiagram, KLDiagram } from "../information-theory/diagrams"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TlItem({ item }: { item: TlItem }) {
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
    const items: TlItem[] = [
        {
            year: "1928",
            title: "Hartley — Measuring Information Logarithmically",
            challenge:
                "Engineers at Bell Labs designing early telegraph and radio systems needed a way to quantify how much information a signal could carry. Was there a fundamental limit to how many distinct messages you could send over a noisy channel?",
            what: "Ralph Hartley proposed that if you have N equally likely possible messages, the natural measure of information content is log(N). Why logarithm? Because adding a new binary digit (bit) doubles the number of distinguishable messages — a logarithmic relationship. A system with 8 possible symbols carries log₂(8) = 3 bits of information per symbol.",
            impact: "Hartley's insight was the first mathematical definition of information. Though limited to equally-likely cases, it established the logarithmic foundation that Shannon later generalised. Every digital communication system — from Morse code to 5G to WiFi — uses Hartley's principle as its theoretical bedrock.",
        },
        {
            year: "1948",
            title: "Shannon — A Mathematical Theory of Communication",
            challenge:
                "Communication engineers had struggled for decades with a paradox: why does adding redundancy (repeating a message) help fight noise, but reduce the effective data rate? Is there a fundamental capacity limit for any channel, and if so, what determines it?",
            what: "Claude Shannon's landmark paper 'A Mathematical Theory of Communication' solved both problems simultaneously. He introduced entropy H(X) = −Σ p(x) log₂ p(x) as the fundamental measure of information, proved that any discrete channel has a finite capacity C (bits/second), and showed that you can communicate arbitrarily close to capacity with codes that add just enough structured redundancy — without sacrificing efficiency.",
            impact: "Shannon single-handedly founded the field of information theory. His source-coding theorem says entropy is the lower bound for lossless compression. His channel-coding theorem says capacity is the upper bound for reliable communication. Together they define the two fundamental limits of all digital systems. Every modern error-correcting code (used in CDs, satellite TV, LTE, and deep-space communication) is a practical implementation of Shannon's theorems.",
        },
        {
            year: "1951",
            title: "Kullback & Leibler — Relative Entropy",
            challenge:
                "Shannon's entropy measured uncertainty in a single distribution. But in statistics and communication, you constantly need to compare two distributions: the true distribution P over outcomes versus an approximation Q that you use instead. How do you quantify the 'loss' from using Q instead of P?",
            what: "Solomon Kullback and Richard Leibler introduced the relative entropy — now called KL divergence: D(P‖Q) = Σ P(x) log(P(x)/Q(x)). This measures the extra bits needed to encode samples from P using a code optimised for Q. Crucially, it is always ≥ 0, and = 0 only when P = Q exactly.",
            impact: "KL divergence is everywhere in modern ML. It appears as the cross-entropy loss when Q is your model and P is the true data distribution. Variational inference uses KL divergence to approximate intractable posteriors. The ELBO (evidence lower bound) in VAEs is a KL regulariser. Generative models like VAEs, diffusion models, and language models all minimise KL-style objectives.",
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
            <h2>Surprise and information are the same thing</h2>

            <Analogy label="Information = Surprise">
                Think about a friend telling you something. If they say <em>"The sun rose this morning"</em> — you already knew that. No new information. Zero surprise. But if they say <em>"A snowstorm hit Hawaii!"</em> — that's shocking. A lot of new information. The more surprised you are, the more information you just received.
            </Analogy>

            <Analogy label="The fair coin = maximum suspense">
                Flip a completely fair coin. Before you look, you have no idea what it will be. Heads or tails — both equally likely. This is maximum <strong>entropy</strong> — the most uncertain, the most suspenseful. The outcome teaches you exactly 1 bit of information.
            </Analogy>

            <Analogy label="The biased coin = less suspense">
                Now flip a coin that comes up heads 99% of the time. Before you flip, you're almost certain it will be heads. Not very suspenseful. Almost no information when it lands heads. Very little surprise — and therefore very little information — when heads lands.
            </Analogy>

            <DiagramBlock title="Entropy — fair coin (max surprise) vs biased coin (low surprise)">
                <EntropyDiagram />
            </DiagramBlock>

            <Analogy label="Entropy = how much suspense there is on average">
                <strong>Entropy</strong> is the average amount of surprise across all possible outcomes. Think of it as the average "information content" of a random event. A fair coin has 1 bit of entropy — you learn 1 bit on average per flip. A completely predictable coin has 0 bits — you already know what will happen.
            </Analogy>

            <Analogy label="Why does entropy matter for AI?">
                A language model that always says the same word has zero entropy — it's useless. A good language model spreads its probability across many possible next words, especially for surprising contexts. The cross-entropy loss measures exactly how well your model matches the true entropy of human language. When the model becomes as "surprised" by the real next word as the real world would be — you've minimised cross-entropy. You've learned to model language as well as a human does.
            </Analogy>

            <Analogy label="KL divergence = how much your approximation costs you">
                Imagine the true distribution of outcomes is P — the actual world. You approximate it with Q — your model or hypothesis. KL(P‖Q) measures the <em>extra cost</em> in surprise bits when you use Q to encode P. It's always ≥ 0, and it's only zero if your approximation is perfect. In ML, your model is Q and the real data is P — you want to minimise KL(P‖Q) as a loss.
            </Analogy>

            <DiagramBlock title="KL divergence — the extra cost of using Q instead of P">
                <KLDiagram />
            </DiagramBlock>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From coin flips to logarithms</h2>

            <p>
                You already know that a probability is a number between 0 and 1. <strong>Information theory</strong>{" "}
                asks: if an event with probability p happens, how much information does that convey? The answer
                turns out to be <InlineMath tex="-\log_2 p" /> bits.
            </p>

            <h3>Why a logarithm?</h3>
            <p>
                If you flip two fair coins independently, there are 4 equally likely outcomes. You've learned{" "}
                <strong>2 bits</strong> of information — and log₂(4) = 2. With n independent fair coin flips,
                there are 2ⁿ equally likely outcomes, so each outcome carries n bits of information — and
                log₂(2ⁿ) = n. The logarithm is the natural answer because it converts the multiplicative
                number of equally-likely outcomes into an additive information measure.
            </p>

            <h3>Shannon Entropy</h3>
            <p>
                Entropy is the <em>average</em> information across all possible outcomes, weighted by their
                probabilities:
            </p>
            <MathBlock tex="H(X) = -\sum_{x} p(x)\,\log_2 p(x)" />
            <p>
                H is always ≥ 0. It reaches its maximum when all outcomes are equally likely (maximum
                uncertainty). If one outcome is certain (p = 1), H = 0 because there's no information gained.
            </p>
            <p>
                <strong>Example — Fair coin:</strong> p(H) = p(T) = 0.5
            </p>
            <MathBlock tex="H = -[0.5 \times (-1) + 0.5 \times (-1)] = 1\;\text{bit}" />
            <p>
                <strong>Example — Biased coin (p(H) = 0.9, p(T) = 0.1):</strong>
            </p>
            <MathBlock tex="H = -[0.9 \log_2 0.9 + 0.1 \log_2 0.1] \approx 0.47\;\text{bits}" />
            <p>
                The biased coin is less surprising on average — less entropy.
            </p>

            <DiagramBlock title="Entropy comparison — fair vs biased">
                <EntropyDiagram />
            </DiagramBlock>

            <h3>Cross-Entropy and KL Divergence</h3>
            <p>
                The cross-entropy H(P, Q) measures the average bits needed to encode events from the true
                distribution P using a code optimised for approximation Q:
            </p>
            <MathBlock tex="H(P, Q) = -\sum_x p(x)\,\log_2 q(x)" />
            <p>
                The <strong>KL divergence</strong> measures the extra cost — the inefficiency — of using Q
                instead of the true P:
            </p>
            <MathBlock tex="D_{\text{KL}}(P \| Q) = \sum_x p(x)\,\log_2 \frac{p(x)}{q(x)} = H(P, Q) - H(P)" />
            <p>
                Since log(1) = 0, when P = Q the KL divergence is zero. By a fundamental result (Gibbs'
                inequality), KL divergence is always ≥ 0 and only zero when P = Q. This is why it makes a
                natural loss function — you can minimise it towards zero but never go below.
            </p>

            <DiagramBlock title="KL divergence — the gap between P and Q">
                <KLDiagram />
            </DiagramBlock>

            <h3>Why This Matters in Machine Learning</h3>
            <ul>
                <li>
                    <strong>Cross-entropy loss</strong> is the standard loss for classification — it's exactly
                    H(P, Q) where P is the one-hot true label and Q is your model's predicted probabilities.
                </li>
                <li>
                    <strong>Perplexity</strong> of a language model = 2<sup>H</sup>, where H is the cross-entropy
                    of the model's next-token distribution vs real text. Lower perplexity = better model.
                </li>
                <li>
                    <strong>KL divergence</strong> appears in VAEs (as a regulariser between the posterior and
                    a prior), in reinforcement learning (as KL constraint on policy updates), and in
                    fine-tuning (to keep the new model close to the original).
                </li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Foundations</h2>

            <DefBlock label="Definition — Self-Information">
                For a discrete random variable X with probability mass function p(x) = Pr(X = x), the{" "}
                <strong>self-information</strong> of the event X = x is:
                <MathBlock tex="I(x) = -\log_2 p(x) \quad \text{[bits]}" />
                Self-information is non-negative, equals 0 when p(x) = 1 (certain), and increases as p(x)
                → 0 (rare events are highly informative). It is additive for independent events: I(x,y) =
                I(x) + I(y) because p(x,y) = p(x)p(y) implies −log p(x,y) = −log p(x) − log p(y).
            </DefBlock>

            <h3>Shannon Entropy</h3>
            <p>
                The <strong>entropy</strong> of a discrete random variable X is the expected self-information —
                the average number of bits needed to encode outcomes drawn from p:
            </p>
            <MathBlock tex="H(X) = \mathbb{E}_{x \sim p}[I(x)] = -\sum_{x} p(x)\,\log_2 p(x)" />
            <p>
                H(X) = 0 iff X is deterministic (one outcome has probability 1). H(X) is maximised when X
                is uniformly distributed. For a d-ary uniform source, H(X) = log₂ d.
            </p>
            <p>
                In ML we almost always use natural log (ln) in theory, yielding units of{" "}
                <em>nats</em> rather than bits. The base change is just a constant factor (1 nat = 1/ln 2
                bits).
            </p>

            <h3>Joint and Conditional Entropy</h3>
            <p>
                <strong>Joint entropy</strong> extends the definition to pairs of variables:
            </p>
            <MathBlock tex="H(X, Y) = -\sum_x \sum_y p(x, y)\,\log_2 p(x, y)" />
            <p>
                <strong>Conditional entropy</strong> H(Y | X) is the expected entropy of Y after observing X:
            </p>
            <MathBlock tex="H(Y|X) = \sum_x p(x)\,H(Y|X=x) = -\sum_x \sum_y p(x, y)\,\log_2 p(y|x)" />
            <p>
                The <strong>chain rule</strong> relates joint and conditional:
            </p>
            <MathBlock tex="H(X, Y) = H(X) + H(Y|X)" />
            <p>
                This is a fundamental decomposition — the total uncertainty in (X, Y) equals the uncertainty
                in X plus the remaining uncertainty in Y after X is known.
            </p>

            <h3>KL Divergence</h3>
            <p>
                The <strong>KL divergence</strong> from P to Q measures the relative entropy — the
                inefficiency of using Q to encode samples from P:
            </p>
            <MathBlock tex="D_{\text{KL}}(P \| Q) = \sum_x p(x)\,\log\frac{p(x)}{q(x)}" />
            <p>
                Two key properties:
            </p>
            <ul>
                <li>
                    <strong>Non-negativity</strong> (Gibbs' inequality):{" "}
                    <InlineMath tex="D_{\text{KL}}(P \| Q) \geq 0" />, with equality iff P = Q
                </li>
                <li>
                    <strong>Asymmetry</strong>:{" "}
                    <InlineMath tex="D_{\text{KL}}(P \| Q) \neq D_{\text{KL}}(Q \| P)" /> in general. This
                    matters — fitting Q to P is not the same as fitting P to Q.
                </li>
            </ul>
            <p>
                The <strong>cross-entropy</strong> H(P, Q) is:
            </p>
            <MathBlock tex="H(P, Q) = -\sum_x p(x)\,\log_2 q(x) = H(P) + D_{\text{KL}}(P \| Q)" />
            <p>
                Since H(P) is constant with respect to Q, minimising H(P, Q) is equivalent to minimising
                D<sub>KL</sub>(P ‖ Q). This is why cross-entropy loss is used for classification — it is the
                KL divergence between the true label distribution and the model's predicted distribution.
            </p>

            <DiagramBlock title="KL divergence — P (true) vs Q (model)">
                <KLDiagram />
            </DiagramBlock>

            <h3>Connections to Machine Learning</h3>
            <ul>
                <li>
                    <strong>Cross-entropy loss</strong> = H(truth, model) = H(truth) + D<sub>KL</sub>(truth ‖
                    model). Since H(truth) is fixed for one-hot labels, minimising cross-entropy is
                    equivalent to minimising KL divergence from the true distribution to the model's
                    distribution.
                </li>
                <li>
                    <strong>Language model perplexity</strong> = 2<sup>H</sup> where H is the cross-entropy
                    of the model on real text. Perplexity is the effective branching factor — a perplexity
                    of 50 means the model is as uncertain as a 50-sided die at each step.
                </li>
                <li>
                    <strong>VAE ELBO</strong>: The evidence lower bound is a lower bound on log p(data) that
                    decomposes as reconstruction loss minus KL(latent | prior).
                </li>
                <li>
                    <strong>Maximum likelihood</strong> in generative models is equivalent to minimising
                    D<sub>KL</sub>(data ‖ model) — the same objective that cross-entropy loss minimises for
                    discrete data.
                </li>
            </ul>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.distributions import Normal, Categorical, kl_divergence

# ── 1. Entropy via torch.distributions ───────────────────────────────────
print("[Entropy] torch.distributions")

log2 = torch.log(torch.tensor(2.0))
d_fair = Categorical(probs=torch.tensor([0.5, 0.5]))
d_bias = Categorical(probs=torch.tensor([0.9, 0.1]))
d_uni4 = Categorical(probs=torch.ones(4) / 4)

print(f"  Fair coin:    H = {(d_fair.entropy() / log2).item():.4f} bits")
print(f"  Biased coin:  H = {(d_bias.entropy() / log2).item():.4f} bits")
print(f"  Uniform-4:    H = {(d_uni4.entropy() / log2).item():.4f} bits")

# ── 2. KL divergence — torch.distributions.kl_divergence ─────────────────
print("\\n[KL divergence]")

P = Categorical(probs=torch.tensor([0.7, 0.2, 0.1]))
Q = Categorical(probs=torch.tensor([0.6, 0.25, 0.15]))
kl = kl_divergence(P, Q)
print(f"  KL(P||Q) = {kl.item():.6f} nats  (≥ 0: {kl.item() >= 0})")
print(f"  KL(Q||P) = {kl_divergence(Q, P).item():.6f} nats  (asymmetric!)")

# Gaussian KL — the VAE regularisation term
P_g = Normal(torch.tensor(0.3), torch.tensor(0.8))
Q_g = Normal(torch.tensor(0.0), torch.tensor(1.0))   # N(0,1) prior
kl_g = kl_divergence(P_g, Q_g)
print(f"\\n  KL(N(0.3, 0.8) || N(0,1)) = {kl_g.item():.6f} nats")
print(f"  (VAE ELBO minimises this to keep latents near the prior)")

# ── 3. nn.CrossEntropyLoss — what you use every training step ─────────────
print("\\n[CrossEntropyLoss]")

logits  = torch.tensor([[2.0, 1.0, 0.1],
                         [0.5, 2.1, 0.3],
                         [0.1, 0.2, 3.0]])
targets = torch.tensor([0, 1, 2])

ce = nn.CrossEntropyLoss()(logits, targets)
print(f"  CE loss: {ce.item():.4f}")

# Manual: CE = -log p(true class) = -log(softmax(logit_true))
manual = -F.log_softmax(logits, dim=1)[range(3), targets].mean()
print(f"  Manual:  {manual.item():.4f}  (match: {torch.isclose(ce, manual).item()})")

# ── 4. Batched KL over a full vocabulary — knowledge distillation ─────────
print("\\n[Batched KL] 32k-token vocabulary in one vectorised call")

vocab   = 32_000
P_log   = F.log_softmax(torch.randn(vocab), dim=0)   # log-probs of teacher
Q_log   = F.log_softmax(torch.randn(vocab), dim=0)   # log-probs of student
P_probs = P_log.exp()

# F.kl_div(input=log Q, target=P); reduction='sum' → scalar KL
kl_vocab = F.kl_div(Q_log, P_probs, reduction='sum')
print(f"  KL(teacher || student) = {kl_vocab.item():.4f} nats")
print(f"  Used in: knowledge distillation, RLHF KL penalty, distilBERT")

# ── 5. Perplexity from sequence cross-entropy ─────────────────────────────
print("\\n[Perplexity]")

token_nll = torch.tensor([1.8, 2.3, 1.5, 2.1, 3.0, 1.9])   # per-token NLL (nats)
ppl = torch.exp(token_nll.mean())
print(f"  mean NLL = {token_nll.mean():.4f}  →  PPL = {ppl:.1f}")
print(f"  (as uncertain as a {ppl:.0f}-sided die per next token)")`

function PythonTab() {
    return (
        <>
            <p>
                PyTorch's <code>torch.distributions</code> and <code>nn.CrossEntropyLoss</code>{" "}
                implement the exact same quantities from the Maths tab — entropy, KL divergence,
                cross-entropy — at training scale, with batched vectorisation built in.
            </p>
            <CodeBlock code={PY_CODE} filename="entropy_kl_divergence.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> <code>nn.CrossEntropyLoss</code> is the KL divergence
                between the true one-hot label and the model's softmax output. Minimising it
                is equivalent to maximum-likelihood estimation under a categorical distribution —
                the theoretical basis for training every classification model.
            </div>
        </>
    )
}




// ── Tab content map ───────────────────────────────────────────────────────────

export const ENTROPY_KL_DIVERGENCE_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
}
