import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

interface TlItem {
    year: string
    title: string
    challenge: string
    what: string
    impact: string
}

function TimelineItem({ item }: { item: TlItem }) {
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
            year: "1927 – 1940",
            title: "Hartley — The First Quantitative Definition of Information",
            challenge:
                "Telephone and telegraph engineers at Bell Labs faced a concrete engineering problem: a telegram costs money per symbol, and a transatlantic cable has strictly limited bandwidth. How many symbols can you reliably send per second through a given channel? And what, exactly, is 'information'? There was no mathematical definition — engineers worked by intuition and experiment. A message seemed to 'contain more information' when it was surprising, but nobody had quantified this in a principled way.",
            what:
                "Ralph Hartley (1928) defined the information in a message of length L over an alphabet of S symbols as H = L times log<sub>2</sub>(S). This was the first quantitative, unit-bearing definition of information. Hartley's 'Hartley unit' (log<sub>2</sub> of the number of choices) treats all symbols as equally likely — its critical limitation. The logarithm base 2 gives information in bits: choosing one of two equally likely symbols gives log<sub>2</sub>(2) = 1 bit. Choosing one of eight gives 3 bits.",
            impact:
                "Hartley's work established that information is logarithmic in the number of choices — the fundamental insight that Shannon would complete twenty years later. Hartley also established that information is additive for independent messages: two independent 1-bit choices together give 2 bits. Additivity under independence, and the logarithm as its consequence, are the axiomatic foundations of the entropy function.",
        },
        {
            year: "1948",
            title: "Shannon — A Mathematical Theory of Communication",
            challenge:
                "Shannon's 1948 paper, published in the Bell System Technical Journal, is arguably the most important technical paper of the 20th century. The problem he set out to solve: given a noisy communication channel (a telephone line, a radio link, a magnetic tape), what is the maximum amount of information that can be transmitted reliably per second? And how do you measure 'information' in a way that accounts for the fact that some symbols are far more probable than others? Hartley's definition treated all symbols equally — it was obviously wrong for natural language where 'e' is far more common than 'z'.",
            what:
                "Shannon introduced four foundational concepts in a single 55-page paper. First, entropy: H(X) = minus sum of p(x) times log<sub>2</sub>(p(x)) — the expected number of bits needed to encode a message from source X, maximised when all symbols are equally likely and zero when the outcome is certain. Second, channel capacity: C = max over p(x) of I(X;Y) — the maximum mutual information between input and output of a noisy channel. Third, the source coding theorem: a source with entropy H can be compressed to at least H bits per symbol on average. Fourth, the noisy channel coding theorem: for any rate below C, there exist codes that transmit with arbitrarily small error probability.",
            impact:
                "Shannon's entropy H(X) is the negative log-likelihood averaged over the distribution — the same quantity Fisher maximised in 1922, now given a completely different physical interpretation. Cross-entropy loss in neural networks is H(p, q) = minus sum of p(x) times log q(x) — the average code length when you use model distribution q but the true distribution is p. Every loss function in deep learning is an entropy or cross-entropy in disguise. Shannon also proved fundamentally that information has a quantity — it is not vague or metaphorical. This precision is what made machine learning a rigorous science.",
        },
        {
            year: "1948 – 1951",
            title: "Shannon, Kullback, and Leibler — Relative Entropy and Mutual Information",
            challenge:
                "The noisy channel theorem relied on a quantity Shannon called 'mutual information' I(X;Y) — how much knowing Y tells you about X. This was deeper than correlation (which measures linear relationships only) or likelihood (which fits a model to data). Shannon needed a measure applicable to arbitrary probability distributions. Kullback and Leibler independently formalised the divergence between two distributions as an information-theoretic quantity.",
            what:
                "Mutual information: I(X;Y) = H(X) minus H(X given Y) = sum over (x,y) of p(x,y) times log(p(x,y) divided by p(x)p(y)). If X and Y are independent, I(X;Y) = 0. If knowing Y completely determines X, I(X;Y) = H(X). Solomon Kullback and Richard Leibler (1951) derived the KL divergence D<sub>KL</sub>(p||q) = sum of p(x) times log(p(x)/q(x)) as the 'information gain' when replacing assumption q with reality p. KL divergence is zero only when p = q and is always non-negative (Gibbs' inequality).",
            impact:
                "Mutual information became a universal measure of statistical dependence, generalising correlation to nonlinear relationships. Feature selection by mutual information: add feature X if I(X;Y) is large. Contrastive self-supervised learning (CLIP, SimCLR) trains models by maximising mutual information between different augmented views of the same image. KL divergence is the penalty in variational autoencoders (VAEs), the regularisation term in RLHF (PPO's KL penalty prevents the model from moving too far from the reference policy), and the loss in knowledge distillation.",
        },
        {
            year: "1943 – 1953",
            title: "Shannon, McCulloch, and the Macy Conferences",
            challenge:
                "Shannon's communication theory and McCulloch's neural network theory were developing simultaneously — Shannon at Bell Labs, McCulloch at Illinois. Were they related? Shannon and Turing had actually met during the war (1943) when Turing visited Bell Labs for speech encryption work. The Macy Conferences (1946-1953) — interdisciplinary meetings in New York — brought Shannon, McCulloch, Hebb, Wiener, and von Neumann into the same room to debate connections between neuroscience, communication, and computation.",
            what:
                "Shannon and McCulloch were both at the 1948 Macy Conference, both reading each other's papers. Shannon's channel capacity theorem asked: given a noisy channel, what is the maximum reliable information rate? McCulloch's neuron model asked: given a network of noisy threshold units, what functions can it compute? These are the same question phrased differently. Shannon also proved that a binary symmetric channel with error rate p has capacity 1 minus H(p), connecting neural noise to information capacity.",
            impact:
                "The Macy Conferences are the historical reason Shannon and McCulloch appear in the same chapter: they were in the same room, arguing about whether neurons and communication channels could be understood with the same mathematics. They could. Shannon's framework became the mathematical language of machine learning. Neural networks are now understood as learned communication channels that maximise the mutual information between input and output representations. Every loss function in this course is entropy minimisation.",
        },
        {
            year: "1965 – present",
            title: "Algorithmic Information Theory and MDL",
            challenge:
                "Shannon's entropy H(X) depends on knowing the true probability distribution p(x) — a distribution that is often unknown in practice. Kolmogorov (1965), Solomonoff (1964), and Chaitin (1966) independently asked: can we define the information content of an individual string, without reference to any probability distribution? Shannon's theory applies to sources; they wanted a theory for individual objects.",
            what:
                "Kolmogorov complexity K(x) is defined as the length of the shortest computer program that outputs x. A random-looking string has high Kolmogorov complexity (no short description); a structured string (like 'AAAA...A repeated a million times') has low complexity. Rissanen (1978) applied this to model selection via the Minimum Description Length (MDL) principle: the best model is the one that minimises the total description length of the model plus the description of the data given the model. This is equivalent to Bayesian model selection with a universal prior.",
            impact:
                "MDL provided the information-theoretic justification for regularisation: a regularised model is one with a shorter description. L2 weight decay penalises large weights because they require more bits to describe. Dropout can be viewed as learning a compressed description of the weight distribution. Large language models trained on internet text are performing a form of MDL compression — they learn the shortest 'program' (the weights) that can regenerate the training data, which requires learning the statistical structure of human language.",
        },
        {
            year: "1998 – present",
            title: "Information Theory in Modern Deep Learning",
            challenge:
                "The loss functions, regularisation methods, and evaluation metrics of deep learning were developed empirically. Only later did researchers recognise that they were applying Shannon's theory at scale. The theoretical connections between information theory and deep learning are still being actively developed — why do neural networks generalise? What information do internal representations contain? How should we measure model capacity?",
            what:
                "Key connections formalised in the modern era: (1) Tishby's Information Bottleneck (1999, 2017) claimed that neural networks learn to compress the input X while preserving information about the output Y — compressing toward I(T;Y) while minimising I(T;X). (2) ELBO in VAEs: log p(x) is lower bounded by E[log p(x given z)] minus D<sub>KL</sub>(q(z given x) || p(z)) — an information-theoretic decomposition of reconstruction quality versus latent compression. (3) Mutual information maximisation: CLIP trains by maximising I(image; text) across matched pairs. (4) Data compression as intelligence: LLM perplexity is literally the per-token entropy of the model on the test distribution.",
            impact:
                "Information theory is no longer a separate field from machine learning — it is the mathematical language in which modern ML is written. Cross-entropy loss is not an arbitrary choice; it is the uniquely justified measure of model-data mismatch from first principles. KL divergence is not a mathematical convenience; it is the fundamental measure of the cost of using the wrong model. Understanding Shannon's 1948 paper is understanding the theoretical foundations of every objective function used in modern deep learning.",
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
            <h2>How much information does a message really contain?</h2>

            <p className="ch-story-intro">
                In 1943, McCulloch and Pitts built a mathematical model of a neuron — a logical gate that could be ON or OFF. Five years later, Claude Shannon asked a question that sounded completely different but turned out to be deeply connected: when you receive a message, how much new information did it actually give you? The answer became the foundation of the internet, CDs, MP3s, and every loss function ever used to train a neural network.
            </p>

            <Analogy label="Information equals surprise">
                Here is Shannon's key insight: information is the opposite of predictability. If I tell you "the sun rose this morning" — you already knew that. Zero surprise, zero information. If I tell you "it snowed in the Sahara in July" — enormous surprise, enormous information.
                <br /><br />
                Shannon made this precise: the information in an event with probability p is log<sub>2</sub>(1/p) bits. Probability 1 (certain) gives 0 bits. Probability 1/2 (coin flip) gives 1 bit. Probability 1/8 gives 3 bits. Rarer events carry more information — this is the definition.
            </Analogy>

            <Analogy label="Entropy — the average surprise">
                If you have a random variable X (like the weather: sun / rain / snow), Shannon defined the <strong>entropy</strong> H(X) as the average amount of surprise you experience when you observe X. It equals the average number of bits needed to encode a message from this source.
                <br /><br />
                If it is sunny every day (probability 1), H = 0 bits — no surprise, no information. If sun and rain are equally likely, H = 1 bit. Maximum entropy occurs when all outcomes are equally likely, giving log<sub>2</sub>(N) bits for N possible outcomes. The English language has entropy of roughly 1.3 bits per letter — far less than log<sub>2</sub>(26) = 4.7 bits per letter, because letters are very predictable from context.
            </Analogy>

            <Analogy label="Cross-entropy — using the wrong codebook">
                Imagine you are a decoder trying to interpret messages from a weather station. If you know the true probabilities of each outcome, you can build the perfect encoding that uses exactly H(X) bits per message on average — the optimal codebook.
                <br /><br />
                But what if you <em>think</em> the weather follows distribution q when it actually follows p? You will use a suboptimal codebook, and on average you will use H(p,q) = minus sum of p(x) times log q(x) bits — the <strong>cross-entropy</strong>. The extra cost compared to the ideal is the <strong>KL divergence</strong>: D<sub>KL</sub>(p||q) = H(p,q) minus H(p). When a neural network minimises cross-entropy loss, it is literally trying to build the best possible model of the training data distribution.
            </Analogy>

            <Analogy label="Mutual information — how much do two things share?">
                Flip a fair coin (X) and roll a die (Y). Do these share any information? No — knowing the coin tells you nothing about the die. Mutual information I(X;Y) = 0. Now let X = today's weather and Y = whether people carry umbrellas. These share a lot of information — knowing one tells you a lot about the other. I(X;Y) is large.
                <br /><br />
                Mutual information is a universal measure of statistical dependence that works for any pair of variables, not just linearly related ones. Feature selection by mutual information, causal discovery, and the contrastive learning methods that trained CLIP (which powers image search in every major app) all maximise mutual information.
            </Analogy>

            <Analogy label="Channel capacity — the fundamental limit">
                Shannon proved that every noisy channel has a maximum information rate called <strong>channel capacity</strong> C, measured in bits per second. No matter how clever your encoding scheme, you cannot reliably transmit more than C bits per second. Below C, perfect (error-free) transmission is possible with the right code. Above C, errors are inevitable.
                <br /><br />
                This theorem shocked engineers — it seemed impossible that you could transmit perfectly through a noisy channel. Shannon proved not only that it was possible, but that there is a sharp threshold at capacity. Modern Wi-Fi and 5G operate close to their theoretical Shannon limits.
            </Analogy>

            <Analogy label="What comes next — from communication to learning">
                Shannon proved that any channel has a maximum information rate. McCulloch proved that networks of neurons can compute any logical function. Hebb (next topic) proposed that synapses change based on co-activity. Put these together: a neural network is a communication channel that can be trained to maximise the information it passes from input to output — the fundamental idea of representation learning that the rest of this course explains in detail.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Entropy, channel capacity, and mutual information</h2>

            <h3>Shannon Entropy</h3>
            <p>
                For a discrete random variable X with probability mass function p(x):
            </p>
            <MathBlock tex="H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x) \quad \text{(in bits)}" />
            <p>
                H(X) is the expected number of bits needed to encode a symbol from X optimally (Shannon's source coding theorem). Properties:
            </p>
            <ul>
                <li><strong>Non-negative:</strong> H(X) is at least 0, with equality iff X is deterministic</li>
                <li><strong>Maximised at uniform:</strong> H(X) is at most log<sub>2</sub>|X|, with equality iff p is uniform</li>
                <li><strong>Chain rule:</strong> H(X,Y) = H(X) + H(Y given X)</li>
                <li><strong>Additivity:</strong> H(X,Y) = H(X) + H(Y) when X and Y are independent</li>
            </ul>

            <h3>Cross-Entropy and KL Divergence</h3>
            <p>
                The cross-entropy between true distribution p and model distribution q:
            </p>
            <MathBlock tex="H(p, q) = -\sum_x p(x) \log q(x)" />
            <p>
                The KL divergence (relative entropy) measures the information lost by using q instead of p:
            </p>
            <MathBlock tex="D_{\text{KL}}(p \| q) = \sum_x p(x) \log \frac{p(x)}{q(x)} = H(p,q) - H(p) \geq 0" />
            <p>
                D<sub>KL</sub> = 0 iff p = q (Gibbs inequality). The cross-entropy loss in neural network training is:
            </p>
            <MathBlock tex="\mathcal{L} = H(p_{\text{data}}, p_{\text{model}}) = H(p_{\text{data}}) + D_{\text{KL}}(p_{\text{data}} \| p_{\text{model}})" />
            <p>
                Since H(p<sub>data</sub>) is constant with respect to model parameters, minimising cross-entropy exactly equals minimising KL divergence from data to model.
            </p>

            <h3>Mutual Information</h3>
            <MathBlock tex="I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = D_{\text{KL}}(p(x,y) \| p(x)p(y))" />
            <p>
                I(X;Y) measures the reduction in uncertainty about X gained by knowing Y. It equals the KL divergence between the joint distribution and the product of marginals — zero iff X and Y are independent. Mutual information generalises correlation: correlation measures only linear dependence; I(X;Y) measures any statistical dependence.
            </p>

            <h3>Channel Capacity</h3>
            <p>
                A noisy channel Y = f(X, noise) has capacity:
            </p>
            <MathBlock tex="C = \max_{p(x)} I(X; Y) \quad \text{(bits per channel use)}" />
            <p>
                Shannon's noisy channel coding theorem: for any rate R less than C, there exist codes that transmit reliably (error probability approaching zero). For R greater than C, reliable transmission is impossible regardless of the coding scheme.
            </p>

            <DefBlock label="The Connections to Deep Learning">
                Cross-entropy loss = H(p<sub>data</sub>, p<sub>model</sub>) — minimised during training<br />
                Perplexity = 2 to the power of H(p, q) — standard NLP evaluation metric<br />
                VAE ELBO = log p(x) minus D<sub>KL</sub>(q(z given x) || p(z)) — variational inference<br />
                RLHF KL penalty = D<sub>KL</sub>(pi<sub>theta</sub> || pi<sub>ref</sub>) — prevents reward hacking<br />
                InfoNCE / contrastive loss is a lower bound on I(X;Y) — used in CLIP<br />
                Knowledge distillation loss = D<sub>KL</sub>(p<sub>teacher</sub> || p<sub>student</sub>) — model compression
            </DefBlock>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>The deep unity:</strong> Fisher (1922) maximised likelihood — equivalent to minimising KL divergence from model to data. Shannon (1948) minimised description length — equivalent to maximising likelihood. They are the same mathematical operation wearing two different hats. Every ML training objective is entropy minimisation, viewed from the right angle.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Gibbs inequality · source coding theorem · channel capacity</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Entropy · KL divergence · mutual information · cross-entropy</span>
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
            <h2>Information Theory: Formal Proofs</h2>

            <DefBlock label="Gibbs Inequality (KL non-negativity)">
                For any probability distributions p and q over the same discrete alphabet: D<sub>KL</sub>(p||q) is at least 0, with equality iff p = q everywhere. Proof: by Jensen's inequality applied to the convex function f(t) = minus log(t). The KL divergence is the unique non-negative, additive measure of distributional dissimilarity (up to a multiplicative constant) satisfying continuity and invariance under sufficient statistics.
            </DefBlock>

            <h3>Shannon's Source Coding Theorem</h3>
            <p>
                For a discrete memoryless source X with entropy H(X), define the code length for symbol x as l(x). Shannon proved:
            </p>
            <MathBlock tex="\mathbb{E}[l(X)] \geq H(X)" />
            <p>
                and that there exists a prefix-free code (Huffman code) achieving:
            </p>
            <MathBlock tex="H(X) \leq \mathbb{E}[l(X)] < H(X) + 1" />
            <p>
                The entropy H(X) is the minimum average description length achievable. This is why cross-entropy loss measures model quality: it equals the average description length when using model q to encode data drawn from p.
            </p>

            <h3>Data Processing Inequality</h3>
            <p>
                For any Markov chain X to Y to Z (Z depends on Y only through Y, not directly on X):
            </p>
            <MathBlock tex="I(X; Z) \leq I(X; Y)" />
            <p>
                Processing data can only lose information, never create it. In neural networks, this means each layer can only reduce the information about the input relative to the previous layer — unless it uses external information (labels). This is the formal basis of the Information Bottleneck principle: deep networks learn to compress the input while preserving task-relevant information.
            </p>

            <h3>Continuous Differential Entropy</h3>
            <p>
                For a continuous random variable X with density f(x), the differential entropy is:
            </p>
            <MathBlock tex="h(X) = -\int f(x) \log f(x) \, dx" />
            <p>
                The Gaussian distribution N(mu, sigma-squared) has the maximum differential entropy among all distributions with fixed variance: h(N) = 1/2 times log(2 times pi times e times sigma-squared). This maximum-entropy property is why the Gaussian is the natural noise model — it makes the fewest assumptions beyond fixed mean and variance.
            </p>

            <div className="ch-callout">
                <strong>VAE connection:</strong> The VAE ELBO is log p(x) minus or equal to E<sub>q</sub>[log p(x given z)] minus D<sub>KL</sub>(q(z given x) || p(z)). The first term is reconstruction quality (cross-entropy). The second term penalises the posterior q(z given x) for deviating from the prior p(z) — an information-theoretic regularisation that limits the information the latent code z carries about the input x. This is the Information Bottleneck objective made practical.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Shannon Entropy ──────────────────────────────────────────────────────────
def entropy(p, base=2):
    """H(X) = -sum p(x) log p(x). p should sum to 1."""
    p = np.array(p, dtype=float)
    p = p[p > 0]               # remove zero-probability events
    return -np.sum(p * np.log(p) / np.log(base))

# Fair coin: maximum entropy = 1 bit
print(f"Fair coin entropy: {entropy([0.5, 0.5]):.4f} bits")
# Biased coin: less entropy
print(f"Biased coin (0.9/0.1): {entropy([0.9, 0.1]):.4f} bits")
# Uniform over 8 outcomes: maximum = 3 bits
print(f"Uniform over 8: {entropy([1/8]*8):.4f} bits")

# ── Cross-Entropy ────────────────────────────────────────────────────────────
def cross_entropy(p, q, base=2):
    """H(p, q) = -sum p(x) log q(x)"""
    p, q = np.array(p, dtype=float), np.array(q, dtype=float)
    q = np.clip(q, 1e-12, 1)    # avoid log(0)
    return -np.sum(p * np.log(q) / np.log(base))

p_true = np.array([0.7, 0.2, 0.1])   # true distribution
q_bad  = np.array([1/3, 1/3, 1/3])   # uniform model (wrong)
q_good = np.array([0.7, 0.2, 0.1])   # perfect model

print(f"\\nH(p):    {entropy(p_true):.4f}")
print(f"H(p,q_bad):  {cross_entropy(p_true, q_bad):.4f}  (extra cost of uniform model)")
print(f"H(p,q_good): {cross_entropy(p_true, q_good):.4f}  (optimal model)")

# ── KL Divergence ────────────────────────────────────────────────────────────
def kl_divergence(p, q, base=2):
    """D_KL(p||q) = sum p log(p/q) = H(p,q) - H(p)"""
    return cross_entropy(p, q, base) - entropy(p, base)

print(f"\\nKL(p || q_bad):  {kl_divergence(p_true, q_bad):.4f} bits wasted")
print(f"KL(p || q_good): {kl_divergence(p_true, q_good):.6f} (should be ~0)")

# ── Mutual Information ───────────────────────────────────────────────────────
def mutual_information(joint_p, base=2):
    """
    I(X;Y) = H(X) + H(Y) - H(X,Y)
    joint_p: 2D array of shape (|X|, |Y|)
    """
    joint = np.array(joint_p, dtype=float)
    joint /= joint.sum()
    p_x = joint.sum(axis=1)     # marginal X
    p_y = joint.sum(axis=0)     # marginal Y

    H_x = entropy(p_x, base)
    H_y = entropy(p_y, base)
    H_xy = entropy(joint.flatten(), base)
    return H_x + H_y - H_xy

# Perfectly correlated (diagonal): I = H(X) = maximum
joint_corr = np.diag([0.3, 0.5, 0.2])
# Independent (outer product of marginals): I = 0
joint_indep = np.outer([0.3, 0.5, 0.2], [0.4, 0.4, 0.2])

print(f"\\nI(X;Y) perfectly correlated: {mutual_information(joint_corr):.4f} bits")
print(f"I(X;Y) independent:           {mutual_information(joint_indep):.4f} bits")

# ── Neural network cross-entropy loss ────────────────────────────────────────
def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def cross_entropy_loss(logits, true_class):
    """Categorical cross-entropy: -log p(true_class)"""
    p = softmax(logits)
    return -np.log(p[true_class] + 1e-12)

logits_good = np.array([0.1, 3.0, 0.5])   # model is confident
logits_bad  = np.array([1.0, 1.0, 1.0])   # model is uncertain
true_class  = 1                             # correct class is 1

print(f"\\nCross-entropy (confident): {cross_entropy_loss(logits_good, true_class):.4f}")
print(f"Cross-entropy (uniform):   {cross_entropy_loss(logits_bad, true_class):.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                Pure NumPy implementations of entropy, cross-entropy, KL divergence, and mutual information — the four quantities that underlie every loss function in deep learning. The neural network cross-entropy example shows the direct connection to classification training.
            </p>
            <CodeBlock code={PY_CODE} filename="information_theory.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> Minimising cross-entropy loss is identical to minimising KL divergence between the data distribution and the model distribution. The entropy term H(p<sub>data</sub>) is constant — it does not depend on model parameters. This is why cross-entropy is the canonical loss for classification, not an arbitrary choice.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const SHANNON_INFORMATION_THEORY_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
