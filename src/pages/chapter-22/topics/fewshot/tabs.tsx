import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>The spectrum of generalization</h2>
            <p>
                One of the most striking results in the GPT-3 paper was not a new architecture or
                training recipe &mdash; it was a systematic demonstration that a single large language
                model could perform dozens of tasks without any parameter updates, simply by reading
                a handful of examples in the prompt. Brown et al. formalized a spectrum: zero-shot,
                one-shot, and few-shot learning. This framework reorganized how the field thought
                about generalization, shifting the question from "how do we fine-tune for each task?"
                to "how do we communicate the task to the model?"
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2009 &ndash; 2011</div>
                    <div className="ch-tl-section-label">Precursors</div>
                    <div className="ch-tl-title">Zero-Shot and One-Shot Learning in Computer Vision</div>
                    <div className="ch-tl-body">
                        The term "zero-shot learning" originated in vision research. Lampert et al.
                        (2009) introduced attribute-based zero-shot classification: a model trained
                        on "animals with stripes" and "animals with four legs" could classify zebras
                        without ever seeing a labeled zebra image, by composing known attributes.
                        Lake et al.'s Omniglot dataset (2011) introduced one-shot character
                        recognition &mdash; learning a new handwritten character from a single example.
                        These were task-specific engineered systems, not general-purpose language
                        models, and they required careful feature engineering for each domain.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the conceptual vocabulary of zero-shot and one-shot generalization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018</div>
                    <div className="ch-tl-section-label">Encoder Models</div>
                    <div className="ch-tl-title">BERT's Zero-Shot Capabilities via Prompt Templates</div>
                    <div className="ch-tl-body">
                        BERT's masked language modeling enabled limited zero-shot transfer to NLU
                        tasks through careful prompt design. A sentiment classifier could be built
                        by framing input as "The movie was [MASK]" and checking whether the model
                        predicted "great" or "terrible." But BERT was an encoder, not a generator
                        &mdash; it could not produce open-ended outputs and required NLI-framing or
                        template matching for zero-shot transfer. Every task still needed bespoke
                        engineering of the output space, limiting generality.
                    </div>
                    <div className="ch-tl-impact">Impact: Showed zero-shot is possible but awkward in encoder-only models</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">February 2019</div>
                    <div className="ch-tl-section-label">Autoregressive Models</div>
                    <div className="ch-tl-title">GPT-2 and Zero-Shot Multitask Transfer</div>
                    <div className="ch-tl-body">
                        GPT-2 established that autoregressive language models have natural zero-shot
                        capabilities. The model saw question-answer pairs, reading comprehension
                        passages, and instruction-like text during pretraining &mdash; so it implicitly
                        learned to answer questions about passages. Radford et al. evaluated GPT-2
                        zero-shot on 8 NLP benchmarks and found competitive but not state-of-the-art
                        results. The key insight was architectural: because the output is always a
                        token sequence, zero-shot requires no output-space engineering. The same
                        model generates translations, summaries, and answers with no task-specific
                        layers.
                    </div>
                    <div className="ch-tl-impact">Impact: First demonstration that scale alone could produce zero-shot multitask transfer</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Formalization</div>
                    <div className="ch-tl-title">GPT-3 Formalizes the Zero / One / Few-Shot Taxonomy</div>
                    <div className="ch-tl-body">
                        Brown et al. systematically evaluated GPT-3 across all three settings on
                        dozens of benchmarks. Few-shot results were the most striking: 32-shot
                        GPT-3 on SuperGLUE scored 71.8, compared to fine-tuned BERT-Large at 90.0
                        &mdash; remarkably competitive given no gradient updates whatsoever. One-shot
                        results were roughly 5 points below few-shot. Zero-shot was the weakest but
                        still non-trivial, beating many supervised baselines from 2018. The paper
                        also documented the steep scaling of few-shot performance: larger models
                        extracted more signal from the same K examples.
                    </div>
                    <div className="ch-tl-impact">Impact: Redefined the evaluation protocol for foundation models; few-shot became the standard baseline</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Meta-Learning Alternative</div>
                    <div className="ch-tl-title">Prototypical Networks and Metric-Based Few-Shot</div>
                    <div className="ch-tl-body">
                        Snell et al.'s Prototypical Networks and related work (MAML, Matching
                        Networks) offered an alternative approach to few-shot learning in vision:
                        instead of in-context learning, train a model over many few-shot tasks so
                        it learns <em>how</em> to learn quickly from few examples. These
                        meta-learning methods remain competitive with ICL on structured
                        classification tasks. Unlike ICL, they update a task-specific head at
                        inference time &mdash; a hybrid between zero-shot and fine-tuning. The debate
                        over which approach dominates depends heavily on the task and data regime.
                    </div>
                    <div className="ch-tl-impact">Impact: Provided a principled alternative to ICL with better calibration on low-shot structured tasks</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021</div>
                    <div className="ch-tl-section-label">Efficiency Comparison</div>
                    <div className="ch-tl-title">T-Few and Parameter-Efficient Fine-Tuning Recovery</div>
                    <div className="ch-tl-body">
                        Liu et al.'s T-Few (2022) showed that parameter-efficient fine-tuning on
                        as few as 32 labeled examples could dramatically outperform 32-shot ICL,
                        suggesting that in-context learning is not the optimal way to use labeled
                        examples when gradient updates are available. T-Few updated only a small
                        fraction of model weights using (IA)³ rescaling vectors, achieving
                        state-of-the-art few-shot performance with a fraction of the compute. But
                        ICL remains valuable when gradient updates are unavailable at inference
                        time: API-only model access, strict latency requirements, or environments
                        where retraining is impossible.
                    </div>
                    <div className="ch-tl-impact">Impact: Clarified the trade-offs between ICL and parameter-efficient fine-tuning</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Industry Response</div>
                    <div className="ch-tl-title">The Prompt Engineering Profession</div>
                    <div className="ch-tl-body">
                        As GPT-3 became commercially available via the OpenAI API, "prompt
                        engineering" emerged as a recognized skill &mdash; the practice of crafting
                        zero-shot and few-shot prompts that reliably elicit high-quality outputs.
                        Documented techniques included: role prompting ("You are an expert
                        editor..."), chain-of-thought ("Let's think step by step"), self-consistency
                        (sampling multiple chains and taking the majority answer), zero-shot CoT,
                        emotional priming ("This is very important to my career"), and calibration
                        methods to reduce format sensitivity. The variance in ICL performance
                        across prompt wordings created an industry around optimizing them
                        systematically.
                    </div>
                    <div className="ch-tl-impact">Impact: Transformed the user interface of AI from fine-tuning to prompting; spawned a new job category</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The enduring tension:</strong> Few-shot ICL is elegant &mdash; the same model,
                with no weight updates, adapts to new tasks by reading examples. But it is also
                wasteful: the examples consume precious context-window tokens, and the model
                cannot "remember" the task across requests. Fine-tuning is more efficient per
                inference call but requires data, compute, and a new model checkpoint per task.
                The optimal point on this spectrum depends on the number of requests, the cost
                of labeled data, and the latency budget.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Learning from examples &mdash; zero, one, or a few</h2>

            <Analogy label="The Test You Never Studied For (Zero-Shot)">
                Imagine walking into a test you have never prepared for. You have no notes, no
                practice problems &mdash; just everything you have learned in your entire life. GPT-3
                "studied" by reading billions of web pages, books, and articles. So when you ask
                it to translate a sentence into French without any examples, it can still do it
                &mdash; because it has already seen thousands of translations during its reading. That
                is zero-shot: no examples, just general knowledge.
            </Analogy>

            <Analogy label="The Cheat Sheet (Few-Shot)">
                Few-shot is like being allowed to bring a small cheat sheet into that same test.
                Your cheat sheet has 5&ndash;10 example problems with their answers. You read the
                examples, understand the format, and answer the new question in the same style.
                For GPT-3, the "cheat sheet" is typed directly into the prompt: "Translate English
                to French. sea otter &rarr; loutre de mer. cheese &rarr; fromage. What is: peanut?"
                The model reads the pattern and continues it.
            </Analogy>

            <Analogy label="How Many Examples Do You Need?">
                Think about teaching someone a new card game. Zero examples: hand them the cards
                and say "play" &mdash; they will guess randomly. One example hand: they understand the
                basic idea and do much better. Eight example hands: they are nearly an expert.
                One hundred example hands: barely better than eight. GPT-3 follows the same curve.
                Zero examples gives decent results. One example is much better. Eight examples
                is even better. Thirty-two examples levels off. More examples are good, but there
                are diminishing returns.
            </Analogy>

            <Analogy label="Why Bigger Models Get the Hint Faster">
                Imagine two students. A novice student reads 8 example problems and still cannot
                figure out the pattern. An expert student reads 1 example and immediately
                understands what is being asked. Bigger language models are like expert students:
                they need fewer examples to understand the task, because they have already
                internalized more patterns from their "studies." Small models might need 32
                examples to match what a large model does with 4.
            </Analogy>

            <Analogy label="Prompt Engineering: Talking to the Robot">
                The exact wording of your question matters a lot. "What is 2+2?" might get a
                different answer than "2+2=?" or "The sum of 2 and 2 is ___". This is not a bug
                &mdash; it is just how the model works: it predicts what text comes next based on all
                the text it has seen before. Learning to phrase your request well is called prompt
                engineering, and it is its own skill, like learning how to type the right search
                query into Google instead of just describing your problem in plain English.
            </Analogy>

            <Analogy label="The Line Between Few-Shot and Fine-Tuning">
                Few-shot means: put 32 examples in the prompt, do not touch the model's "brain"
                (its weights), and ask your question. Fine-tuning means: show the model 32
                examples and actually update its brain based on them. Fine-tuning is usually
                better &mdash; the model truly learns the task. But few-shot is faster and cheaper,
                because you do not need to retrain the model at all. And if you only have access
                to the model through an app or website, few-shot is the only option you have.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>In-context learning: formalism and limits</h2>

            <h3>The Three Settings Defined</h3>
            <p>
                Brown et al. (2020) defined three evaluation settings based on how much task
                information is provided at inference time, with no parameter updates in any case.
                Let <em>x</em> be the input, <em>y</em> be the output, and <em>d</em> be a natural-language
                task description:
            </p>

            <DefBlock label="Zero / One / K-Shot Settings">
                Zero-shot: the model receives only a task description and the input.
                One-shot: one labeled example is prepended.
                K-shot: K labeled examples are prepended. All examples live in the context window.
            </DefBlock>

            <MathBlock tex={String.raw`\text{Zero-shot: } P(y \mid d, x) \\[6pt] \text{One-shot: } P(y \mid d,\, x_1, y_1,\, x) \\[6pt] \text{K-shot: } P(y \mid d,\, x_1, y_1,\, \ldots,\, x_K, y_K,\, x)`} />

            <p>
                For GPT-3, the context window is 2,048 tokens, limiting K to roughly 32 examples
                on most tasks. Every token spent on examples is a token unavailable for the input
                itself, creating a direct trade-off between demonstration richness and input length.
            </p>

            <h3>Performance as a Function of K and Model Size N</h3>
            <p>
                Empirically, performance improves with both K (more examples) and N (more
                parameters), and the two effects are multiplicative. A 175B model with K&nbsp;=&nbsp;32
                outperforms a 7B model with K&nbsp;=&nbsp;32 by roughly the same margin as a 175B model
                at K&nbsp;=&nbsp;0 vs K&nbsp;=&nbsp;32. This can be approximated as a separable scaling law:
            </p>

            <MathBlock tex={String.raw`\text{Acc}(N, K) \approx \alpha \cdot \log N + \beta \cdot \log(K+1) + \gamma`} />

            <p>
                where &alpha;, &beta;, &gamma; are task-dependent constants fit empirically. The
                log(K+1) term captures the diminishing returns of additional examples: going from
                0 to 1 example is worth far more than going from 31 to 32.
            </p>

            <h3>Zero-Shot Chain-of-Thought</h3>
            <p>
                Kojima et al. (2022) discovered that appending "Let's think step by step" to a
                zero-shot prompt dramatically improves accuracy on multi-step reasoning tasks.
                On GSM8K arithmetic benchmarks with text-davinci-002, zero-shot accuracy rose
                from roughly 18% to 79% with this single phrase. Formally, the model computes a
                latent reasoning chain <em>z</em> before generating the answer:
            </p>

            <MathBlock tex={String.raw`P(y \mid d, x, \text{"Let's think step by step"}) = \sum_{z} P(y \mid z,\, d,\, x)\; P(z \mid d,\, x,\, \text{"Let's think step by step"})`} />

            <p>
                The phrase works zero-shot because the model has seen vast quantities of
                step-by-step reasoning in pretraining text (textbooks, worked examples, forum
                posts). The trigger phrase acts as a context switch that activates a
                reasoning-generation subroutine embedded in the model's weights.
            </p>

            <h3>Sensitivity and Variance Across Prompt Orderings</h3>
            <p>
                Lu et al. (2022) showed that the order in which few-shot examples are presented
                has a dramatic effect on accuracy. For GPT-3 on 12-class classification,
                permuting the order of 12 examples produced accuracy ranging from near-chance to
                near-state-of-the-art &mdash; a spread of over 40 percentage points on some tasks.
                This sensitivity arises because the model assigns higher probability to outputs
                that resemble the most recent examples in the context.
            </p>
            <p>
                Zhao et al. (2021) proposed calibration to reduce format bias. Estimate the
                model's unconditional preference for each label using a content-free input
                (e.g., "N/A"), then subtract it from the log-probability scoring:
            </p>

            <MathBlock tex={String.raw`\hat{P}(y \mid \text{prompt}, x) = \frac{P(y \mid \text{prompt}, x)}{P(y \mid \text{prompt}, \text{"N/A"})}`} />

            <p>
                This calibration step normalizes out the model's surface-level label bias
                (e.g., preferring "Positive" over "Negative" due to training corpus imbalance)
                and substantially reduces variance across prompt orderings.
            </p>

            <h3>Prototypical Networks vs. In-Context Learning</h3>
            <p>
                Two fundamentally different mechanisms can achieve few-shot generalization.
                Prototypical Networks (Snell et al., 2017) compute a class prototype by averaging
                the embeddings of K support examples, then classify a query by nearest-prototype
                distance:
            </p>

            <MathBlock tex={String.raw`c_k = \frac{1}{K}\sum_{i=1}^{K} f_\theta(x_i^{(k)}) \qquad \hat{y} = \arg\min_k \;\|f_\theta(x) - c_k\|_2^2`} />

            <p>
                In-context learning instead concatenates all examples into a single sequence and
                lets the Transformer's self-attention mechanism extract the task structure
                implicitly. The computational cost is:
            </p>

            <MathBlock tex={String.raw`\text{ProtoNet inference: } O(K \cdot d) \qquad \text{ICL inference: } O\!\left((K \cdot L_{\text{ex}} + L_x)^2 \cdot d\right)`} />

            <p>
                where <em>d</em> is the model dimension and L is sequence length. For K&nbsp;=&nbsp;32
                examples of 64 tokens each and a query of 64 tokens, ICL runs self-attention over
                a sequence of 2,112 tokens &mdash; roughly 4.5&nbsp;&times; the attention compute of
                a zero-shot query. ProtoNets are more compute-efficient but require a compatible
                embedding space; ICL works out of the box with any generative model.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Bayesian ICL &middot; variance decomposition &middot; formal analysis</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Python &middot; prompt construction &middot; zero / one / few-shot</span>
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
            <h2>ICL as Bayesian Inference and Variance Decomposition</h2>

            <DefBlock label="ICL as Implicit Bayesian Inference (Xie et al., 2021)">
                Xie et al. showed that under a latent-concept generative model, in-context
                learning is equivalent to Bayesian inference over a latent task variable &theta;.
                The model implicitly maintains a posterior over which task is being requested,
                updated by each example it sees.
            </DefBlock>

            <p>
                Suppose the data is generated by a latent concept &theta; drawn from a prior
                p(&theta;). Each example (x&#x1D62;, y&#x1D62;) is drawn i.i.d. from
                p(x,&nbsp;y&nbsp;|&nbsp;&theta;). Given K examples, the posterior over &theta; is:
            </p>

            <MathBlock tex={String.raw`p(\theta \mid x_1,y_1,\ldots,x_K,y_K) \propto p(\theta)\prod_{i=1}^{K}p(x_i,y_i \mid \theta)`} />

            <p>
                The predictive distribution for a new input x is then:
            </p>

            <MathBlock tex={String.raw`P(y \mid x,\, S_K) = \int P(y \mid x, \theta)\, p(\theta \mid S_K)\, d\theta`} />

            <p>
                where S&#x1D37; = &#123;(x&#x1D62;,y&#x1D62;)&#125;&#x1D62;&#x2081;&#x1D37; is the support set. As K increases,
                the posterior concentrates around the true &theta;, explaining why more examples
                improve ICL accuracy. The model implicitly implements this Bayesian update through
                its attention mechanism without any gradient steps.
            </p>

            <h3>Variance Decomposition Across Example Orderings</h3>
            <p>
                Let &sigma;² denote the total variance in model accuracy over all permutations of
                K examples. We can decompose it into three sources:
            </p>

            <MathBlock tex={String.raw`\sigma^2_{\text{total}} = \sigma^2_{\text{recency}} + \sigma^2_{\text{label-imbalance}} + \sigma^2_{\text{residual}}`} />

            <ul>
                <li>
                    <strong>&sigma;²&#x2095;&#x2097;&#x2091;&#x2090;&#x2093;&#x2091;&#x2099;&#x2093;&#x209A;</strong>: Models overweight the most recent examples
                    in context (a primacy/recency effect from causal attention). Permutations
                    that place harder examples last increase accuracy.
                </li>
                <li>
                    <strong>&sigma;²&#x2097;&#x2090;&#x2095;&#x2097;&#x2091;&#x2097;&ndash;&#x1D35;&#x2098;&#x2095;&#x2097;&#x2090;&#x2099;&#x2098;&#x2093;&#x2091;</strong>: When K examples include unequal
                    numbers of positive and negative labels, the model develops a surface bias
                    toward the majority label.
                </li>
                <li>
                    <strong>&sigma;²&#x2085;&#x2091;&#x2090;&#x1D35;&#x2093;&#x1D35;&#x2090;&#x2097;</strong>: Unexplained variance from
                    interaction effects between specific examples.
                </li>
            </ul>

            <p>
                Calibration (Zhao et al.) primarily reduces &sigma;²&#x2097;&#x2090;&#x2095;&#x2097;&#x2091;&#x2097;&ndash;&#x1D35;&#x2098;&#x2095;&#x2097;&#x2090;&#x2099;&#x2098;&#x2093;&#x2091;.
                Self-consistency (Wang et al.) reduces &sigma;²&#x2085;&#x2091;&#x2090;&#x1D35;&#x2093;&#x1D35;&#x2090;&#x2097; by averaging over
                multiple sampled chains of thought. Neither technique fully eliminates ordering
                sensitivity.
            </p>

            <h3>The Minimum Description Length View</h3>
            <p>
                An alternative theoretical lens: ICL works because large models have compressed
                the training distribution into a short description of the world. The K in-context
                examples serve as additional side information that refines which part of that
                compressed representation is relevant. Formally, the model minimizes:
            </p>

            <MathBlock tex={String.raw`\mathcal{L}_{\text{ICL}}(\theta) = -\sum_{t}\log P_\theta\!\left(y_t \;\Big|\; \underbrace{d,\, x_1,y_1,\ldots,x_K,y_K}_{\text{context prefix}},\, x_t\right)`} />

            <p>
                This is just the standard autoregressive cross-entropy loss, but conditioned on
                the full context prefix. The model never trained with this exact prefix during
                pretraining &mdash; it generalizes by composing representations. Whether this
                constitutes "learning" or "retrieval" is still an active research question.
            </p>

            <div className="ch-callout">
                <strong>Open problem:</strong> We do not have a satisfying theory of <em>when</em>
                ICL will fail. Empirically, ICL degrades when the task requires skills not
                represented in pretraining data, when examples are misleading or atypical, and
                when the task's output format is unusual. Predicting these failure modes in
                advance remains an open challenge in interpretability research.
            </div>
        </>
    )
}

const PY_CODE = `import random
from typing import Literal

# ── Zero / One / Few-Shot Prompt Construction ─────────────────────────────────
# Simulates the prompt engineering workflow for sentiment classification.
# In production, replace the mock "model" with an actual API call.

EXAMPLES = [
    ("The acting was superb and the plot kept me riveted.", "Positive"),
    ("I walked out after twenty minutes. Absolutely dreadful.", "Negative"),
    ("A masterpiece of modern cinema.", "Positive"),
    ("Predictable, boring, and poorly edited.", "Negative"),
    ("The cinematography alone is worth the price of admission.", "Positive"),
    ("Save your money — this film is a complete waste of time.", "Negative"),
    ("Heartfelt performances carry an otherwise thin script.", "Positive"),
    ("The dialogue felt stilted and the pacing was all wrong.", "Negative"),
]

TEST_INPUTS = [
    ("An unforgettable experience from start to finish.", "Positive"),
    ("I regret buying a ticket.", "Negative"),
    ("Interesting premise, muddled execution.", "Negative"),
]

TASK_DESCRIPTION = (
    "Classify the sentiment of a movie review as either Positive or Negative.\\n"
    "Respond with exactly one word: Positive or Negative."
)


# ── Prompt builders ───────────────────────────────────────────────────────────

def build_zero_shot(review: str) -> str:
    return f"{TASK_DESCRIPTION}\\n\\nReview: {review}\\nSentiment:"


def build_one_shot(review: str) -> str:
    ex = EXAMPLES[0]
    return (
        f"{TASK_DESCRIPTION}\\n\\n"
        f"Review: {ex[0]}\\nSentiment: {ex[1]}\\n\\n"
        f"Review: {review}\\nSentiment:"
    )


def build_few_shot(review: str, k: int = 8) -> str:
    shots = EXAMPLES[:k]
    lines = [TASK_DESCRIPTION, ""]
    for rev, label in shots:
        lines.append(f"Review: {rev}")
        lines.append(f"Sentiment: {label}")
        lines.append("")
    lines.append(f"Review: {review}")
    lines.append("Sentiment:")
    return "\\n".join(lines)


# ── Mock model (replace with real API call) ───────────────────────────────────

def mock_model(prompt: str, true_label: str) -> str:
    """Simulate improving accuracy with more context in the prompt."""
    n_examples = prompt.count("Sentiment: Positive") + prompt.count("Sentiment: Negative")
    # Zero-shot: 65% accuracy; one-shot: 78%; 8-shot: 92%
    if n_examples == 0:
        accuracy = 0.65
    elif n_examples == 1:
        accuracy = 0.78
    else:
        accuracy = min(0.65 + 0.034 * n_examples, 0.95)
    return true_label if random.random() < accuracy else (
        "Negative" if true_label == "Positive" else "Positive"
    )


# ── Evaluation ────────────────────────────────────────────────────────────────

def evaluate(
    setting: Literal["zero", "one", "few"],
    n_trials: int = 200,
    k: int = 8,
) -> float:
    correct = 0
    for _ in range(n_trials):
        for review, label in TEST_INPUTS:
            if setting == "zero":
                prompt = build_zero_shot(review)
            elif setting == "one":
                prompt = build_one_shot(review)
            else:
                prompt = build_few_shot(review, k=k)
            pred = mock_model(prompt, label)
            correct += int(pred == label)
    total = n_trials * len(TEST_INPUTS)
    return correct / total


# ── Demo ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    random.seed(42)

    print("Sentiment Classification — Zero / One / Few-Shot Accuracy")
    print("=" * 55)

    for setting, label in [("zero", "Zero-shot (0 examples)"),
                            ("one",  "One-shot  (1 example) "),
                            ("few",  "Few-shot  (8 examples)")]:
        acc = evaluate(setting)  # type: ignore[arg-type]
        bar = "#" * int(acc * 40)
        print(f"{label}: {acc:.1%}  |{bar}")

    print()
    print("Example prompts")
    print("-" * 55)
    review = "The film left me speechless."
    print("ZERO-SHOT:")
    print(build_zero_shot(review))
    print()
    print("ONE-SHOT:")
    print(build_one_shot(review))
    print()
    print("FEW-SHOT (first 3 of 8 shown):")
    prompt = build_few_shot(review, k=3)
    print(prompt)
`

function PythonContent() {
    return (
        <>
            <p>
                Python demonstrating how to construct zero-shot, one-shot, and few-shot prompts
                for a sentiment classification task. A mock model simulates the empirical accuracy
                gains from Brown et al. (2020): zero-shot &asymp; 65%, one-shot &asymp; 78%,
                8-shot &asymp; 92%. Replace the mock model with an actual API call to reproduce
                the real scaling curve.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="fewshot_demo.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const FEWSHOT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
