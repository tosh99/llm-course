import { Analogy, DefBlock, MathBlock } from "../../shared"
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
            title: "Hartley and the Origins — Measuring Information Without Probability",
            challenge:
                "Telephone and telegraph engineers at Bell Labs had a concrete problem: a telegram costs money per symbol, and a transatlantic cable has limited bandwidth. How many symbols can you reliably send per second? There was no mathematical definition of 'information' — engineers worked by intuition and experiment. Ralph Hartley, a Bell Labs engineer, noticed that if you have n possible symbols, choosing one gives you log(n) units of 'information'. But this ignored an obvious fact: rare symbols carry more information than common ones.",
            what:
                "Hartley (1928) defined the information in a message of length L over an alphabet of S symbols as H = L · log₂(S). This was the first quantitative, unit-bearing definition of information. His 'Hartley' unit (log₂ of the number of choices) treats all symbols as equally likely — a critical limitation. At the Macy Conferences (1946–1953) — the interdisciplinary meetings that also featured McCulloch, Hebb, Wiener, and von Neumann — these ideas began to collide with neuroscience and computation.",
            impact:
                "Hartley's work established that information is logarithmic in the number of choices — the fundamental insight that Shannon would complete. The Macy Conferences are the historical reason Shannon and McCulloch appear in the same chapter: they were literally in the same room, arguing about whether neurons and communication channels could be understood with the same mathematics. They could.",
        },
        {
            year: "1948",
            title: "Shannon — A Mathematical Theory of Communication",
            challenge:
                "Shannon's 1948 paper, published in the Bell System Technical Journal, is arguably the most important technical paper of the 20th century. The problem he set out to solve: given a noisy communication channel (a telephone line, a radio link, a magnetic tape), what is the maximum amount of information that can be transmitted reliably per second? And how do you measure 'information' in a way that accounts for the fact that some symbols are more likely than others?",
            what:
                "Shannon introduced four foundational concepts in a single paper. First, entropy: H(X) = −Σ p(x) log₂ p(x) — the expected number of bits needed to encode a message from source X, maximised when all symbols are equally likely and zero when the outcome is certain. Second, channel capacity: C = max_{p(x)} I(X;Y) — the maximum mutual information between input and output of a noisy channel. Third, the source coding theorem: a source with entropy H can be compressed to at least H bits per symbol and no further. Fourth, the noisy channel coding theorem: for any rate below channel capacity, there exist codes that can transmit at that rate with arbitrarily small error probability — a result so counterintuitive it shocked engineers.",
            impact:
                "Shannon's entropy H(X) is the negative log-likelihood averaged over the distribution — the same quantity Fisher maximised in 1922, now given a completely different interpretation. Cross-entropy loss in neural networks is H(p, q) = −Σ p(x) log q(x) — the average code length when you use model distribution q but the true distribution is p. KL divergence D_{KL}(p||q) = H(p,q) − H(p) measures how much extra information you waste by using q instead of p. Every loss function in this course is an entropy in disguise.",
        },
        {
            year: "1948 – 1951",
            title: "Shannon — Mutual Information and KL Divergence",
            challenge:
                "The noisy channel theorem relied on a quantity Shannon called 'mutual information' I(X;Y) — the amount of information that knowing Y reveals about X. This was deeper than correlation (which measures linear relationships) or likelihood (which fits a model to data). Shannon needed a measure that applied to arbitrary probability distributions, including discrete, continuous, and mixed cases.",
            what:
                "Mutual information: I(X;Y) = H(X) − H(X|Y) = Σ_{x,y} p(x,y) log(p(x,y) / (p(x)p(y))). If X and Y are independent, I(X;Y) = 0. If knowing Y completely determines X, I(X;Y) = H(X). Solomon Kullback and Richard Leibler (1951) independently derived the KL divergence D_{KL}(p||q) = Σ p(x) log(p(x)/q(x)) as a measure of the 'information gain' from assuming distribution p rather than q. It is zero only when p = q and always non-negative (Gibbs' inequality).",
            impact:
                "Mutual information became a universal measure of statistical dependence, generalising correlation. Feature selection by mutual information: add feature X if I(X; Y) is large. Contrastive self-supervised learning (CLIP, SimCLR, 2020) trains models by maximising mutual information between different views of the same image. KL divergence is the penalty in variational autoencoders (VAEs), the regularisation term in RLHF (PPO's KL penalty prevents the model moving too far from the reference), and the loss in knowledge distillation.",
        },
        {
            year: "1948 – 1960",
            title: "Shannon and Turing — Information and Computation",
            challenge:
                "Shannon's communication theory and Turing's computation theory were developing simultaneously at Bell Labs and at Bletchley Park / Cambridge. Were they related? Shannon and Turing actually met during the war (1943) when Turing visited Bell Labs to work on speech encryption. They debated whether the brain was a form of communication channel and whether intelligence could be quantified in information-theoretic terms.",
            what:
                "Shannon (1948) proved that the entropy H sets a fundamental limit on compression — no lossless encoding can, on average, use fewer than H bits per symbol. Turing (1950) asked 'Can machines think?' and proposed the imitation game. Their shared insight: intelligence is information processing. Shannon also proved that a noisy channel of capacity C can support reliable communication at any rate below C. The 'bandwidth' of a neural network, the 'expressivity' of a function class are all attempts to quantify this channel capacity for artificial systems.",
            impact:
                "Shannon's framework became the mathematical language of machine learning. Cross-entropy loss = average description length. Mutual information = statistical dependence. KL divergence = model-data mismatch. Entropy = irreducible randomness. These are not metaphors — they are the exact quantities that appear in every ML training objective. Hebb (1949) would publish the learning rule one year after Shannon — and both were thinking about the same question: how does a system update its internal representation in response to information? That connection is why they appear in the same chapter.",
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

            <Analogy label="Information = surprise">
                Here's the key insight: information is the opposite of predictability.
                <br /><br />
                If I tell you "the sun rose this morning" — you already knew that. No information. If I tell you "it snowed in July in the Sahara" — huge surprise, huge information. Shannon made this precise: the information in an event with probability p is log₂(1/p) bits. Probability 1 (certain) → 0 bits. Probability 0.5 (coin flip) → 1 bit. Probability 1/8 → 3 bits.
            </Analogy>

            <Analogy label="Entropy — the average surprise">
                If you have a random variable X (like the weather: sun / rain / snow), Shannon defined the <strong>entropy</strong> H(X) as the average amount of surprise you experience when you observe X:
                <br /><br />
                H(X) = −Σ p(x) · log₂(p(x))
                <br /><br />
                If it's sunny every day (p(sun)=1), H = 0 — no surprise, no information. If sun and rain are equally likely, H = 1 bit — one fair coin flip of information per day. Maximum entropy occurs when all outcomes are equally likely, giving log₂(N) bits for N possible outcomes.
            </Analogy>

            <Analogy label="Cross-entropy — using the wrong codebook">
                Imagine you're a decoder trying to interpret the messages from a weather station. If you know the true probabilities of each outcome, you can build the perfect codebook (Huffman code) that uses exactly H(X) bits per message on average.
                <br /><br />
                But what if you <em>think</em> the weather is one distribution (your model q) when it's actually a different distribution (the truth p)? You'll use a suboptimal codebook, and on average you'll use H(p,q) = −Σ p(x) log q(x) bits per message — the <strong>cross-entropy</strong>. The extra cost compared to the ideal is the <strong>KL divergence</strong>: D_KL(p||q) = H(p,q) − H(p).
                <br /><br />
                When a neural network trains on cross-entropy loss, it is literally trying to build the best possible codebook for predicting the training labels. Minimising cross-entropy is the same as minimising model-data mismatch — in information-theoretic terms.
            </Analogy>

            <Analogy label="Mutual information — how much do two things share?">
                Imagine you flip a fair coin (X) and then roll a die (Y). Do these share any information? No — knowing the coin tells you nothing about the die. Mutual information I(X;Y) = 0.
                <br /><br />
                Now imagine X = today's weather and Y = whether people carry umbrellas. These share a lot of information — knowing one tells you a lot about the other. I(X;Y) is large.
                <br /><br />
                Mutual information is a universal measure of statistical dependence that works for any pair of variables, not just linearly related ones. Feature selection, causal discovery, and the contrastive learning methods that trained CLIP (which powers image search in every major app) all maximise mutual information.
            </Analogy>

            <Analogy label="What comes next — from communication to learning">
                Shannon proved that any channel has a maximum information rate called the <strong>channel capacity</strong>. McCulloch proved that networks of neurons can compute any logical function. Hebb (1949 — next topic) proved that synapses change based on co-activity. Put these together: a neural network is a communication channel that can be trained to maximise the information it passes from input to output. That is the fundamental idea of representation learning — and it is exactly what the next 37 chapters of this course explain in detail.
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
                <li><strong>Non-negative:</strong> H(X) ≥ 0, with equality iff X is deterministic</li>
                <li><strong>Maximised at uniform:</strong> H(X) ≤ log₂|X|, with equality iff p is uniform</li>
                <li><strong>Chain rule:</strong> H(X,Y) = H(X) + H(Y|X)</li>
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
                D_KL = 0 iff p = q (Gibbs inequality). The cross-entropy loss in neural network training is:
            </p>
            <MathBlock tex="\mathcal{L} = H(p_{\text{data}}, p_{\text{model}}) = H(p_{\text{data}}) + D_{\text{KL}}(p_{\text{data}} \| p_{\text{model}})" />
            <p>
                Since H(p_data) is constant with respect to model parameters, minimising cross-entropy exactly equals minimising KL divergence from the data distribution to the model distribution.
            </p>

            <h3>Mutual Information</h3>
            <MathBlock tex="I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = D_{\text{KL}}(p(x,y) \| p(x)p(y))" />
            <p>
                I(X;Y) measures the reduction in uncertainty about X gained by knowing Y (and vice versa). It equals the KL divergence between the joint distribution and the product of marginals — zero iff X and Y are independent. Mutual information generalises correlation: correlation only captures linear dependence, I(X;Y) captures any statistical dependence.
            </p>

            <h3>Channel Capacity</h3>
            <p>
                A noisy channel Y = f(X, noise) has capacity:
            </p>
            <MathBlock tex="C = \max_{p(x)} I(X; Y) \quad \text{(bits per channel use)}" />
            <p>
                Shannon's noisy channel coding theorem: for any rate R &lt; C, there exist codes that transmit reliably (error probability → 0). For R &gt; C, reliable transmission is impossible regardless of coding scheme.
            </p>

            <DefBlock label="The Connections to Deep Learning">
                Cross-entropy loss = H(p_data, p_model) — minimised at training<br />
                Perplexity = 2^H(p, q) — standard NLP evaluation metric<br />
                VAE ELBO = log p(x) − D_KL(q(z|x) || p(z)) — variational inference<br />
                RLHF KL penalty = D_KL(π_θ || π_ref) — prevents reward hacking<br />
                InfoNCE / contrastive loss ≈ lower bound on I(X;Y) — used in CLIP<br />
                Knowledge distillation loss = D_KL(p_teacher || p_student) — model compression
            </DefBlock>

            <div className="ch-callout">
                <strong>The deep unity:</strong> Fisher (1922) maximised likelihood — equivalent to minimising KL divergence from model to data. Shannon (1948) minimised description length — equivalent to maximising likelihood. They are the same mathematical operation wearing two different hats. Every ML training objective is entropy minimisation, viewed from the right angle.
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
