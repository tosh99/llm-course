import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Python sample code ────────────────────────────────────────────────────────

const PY_CODE = `import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# ── Task: Sentiment classification ───────────────────────────────────────────

TASK_DESC = "Classify the sentiment of the review as Positive or Negative."

EXAMPLES = [
    ("The food was incredible and the service was fantastic.", "Positive"),
    ("I waited 45 minutes and the soup was cold.", "Negative"),
    ("Absolutely loved every bite. Will be back!", "Positive"),
    ("Rude staff, tiny portions, overpriced.", "Negative"),
]

TEST_INPUT = "The atmosphere was lovely but the pasta was undercooked."


def build_prompt(n_shots: int) -> str:
    """Build a prompt with n_shots in-context examples."""
    lines = [TASK_DESC, ""]
    for review, label in EXAMPLES[:n_shots]:
        lines.append(f"Review: {review}")
        lines.append(f"Sentiment: {label}")
        lines.append("")
    lines.append(f"Review: {TEST_INPUT}")
    lines.append("Sentiment:")
    return "\\n".join(lines)


def classify(n_shots: int) -> str:
    prompt = build_prompt(n_shots)
    print(f"--- {n_shots}-shot prompt ---")
    print(prompt)
    print()

    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=5,
        temperature=0,
    )
    answer = response.choices[0].text.strip()
    print(f"Model answer ({n_shots}-shot): {answer}")
    print()
    return answer


# ── Run all three settings ────────────────────────────────────────────────────

print("=== Zero-shot ===")
classify(0)

print("=== One-shot ===")
classify(1)

print("=== Few-shot (4 examples) ===")
classify(4)

# ── Expected output ───────────────────────────────────────────────────────────
# Zero-shot:  model guesses, often wrong or inconsistent
# One-shot:   model usually gets the format right but may miss the label
# Few-shot:   model reliably answers "Negative" for the test input
`

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Learning without learning</h2>
            <p>
                In-context learning (ICL) is one of the most surprising behaviors to emerge from
                large language models: a model can perform a new task&mdash;translation, arithmetic,
                classification&mdash;simply by reading a handful of input&ndash;output examples in
                its prompt, with <em>no changes to its weights</em>. There is no gradient descent,
                no optimizer step, no parameter update of any kind. The model's "learning" happens
                entirely in the forward pass, inside a fixed network. This was not designed into
                GPT-3; it emerged from training on a sufficiently large and diverse corpus of
                human-generated text.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017&ndash;2019</div>
                    <div className="ch-tl-section-label">Prior paradigm</div>
                    <div className="ch-tl-title">Fine-tuning is the dominant paradigm</div>
                    <div className="ch-tl-body">
                        Before GPT-3, adapting a pretrained model to a new task required a
                        two-step process: (a) collect a labeled dataset for that task, and
                        (b) run gradient descent on the pretrained model weights using that data.
                        BERT (Devlin et al., 2019) established this as the standard pipeline and
                        achieved state-of-the-art results across eleven benchmarks. Even with
                        excellent pretraining, the fine-tuning step required thousands of labeled
                        examples and hours of GPU compute per task. Each new task required a new
                        fine-tuned checkpoint.
                    </div>
                    <div className="ch-tl-impact">Impact: Set the expectation that task-specific training data was always necessary</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">February 2019</div>
                    <div className="ch-tl-section-label">Early signal</div>
                    <div className="ch-tl-title">GPT-2 hints at zero-shot transfer</div>
                    <div className="ch-tl-body">
                        Radford et al. found that GPT-2 could perform reading comprehension,
                        translation, and summarization without any fine-tuning&mdash;just by reading
                        a task description in the prompt. This was not a designed feature; it
                        emerged from training on a large and diverse web corpus (WebText, ~40 GB).
                        Radford called it "unsupervised multitask learning" and argued that diverse
                        training text implicitly contains many task demonstrations. GPT-2 was too
                        small to be competitive with fine-tuned models, but the phenomenon was
                        real.
                    </div>
                    <div className="ch-tl-impact">Impact: First evidence that scale + diversity could produce zero-shot generalization</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">May 2020</div>
                    <div className="ch-tl-section-label">Formalization</div>
                    <div className="ch-tl-title">GPT-3 formalizes in-context learning</div>
                    <div className="ch-tl-body">
                        Brown et al. (OpenAI) introduced the term "in-context learning" and
                        systematically studied three settings: <em>zero-shot</em> (task description
                        only), <em>one-shot</em> (one demonstration), and <em>few-shot</em> (up to
                        32 demonstrations). The few-shot results were dramatic: GPT-3 with 32
                        examples matched or exceeded fine-tuned BERT on several SuperGLUE tasks.
                        Crucially, performance scaled sharply with model size&mdash;smaller GPT-3
                        variants (1B, 6.7B) showed minimal ICL benefit, while the 175B model
                        showed large gains. This dependence on scale became one of the central
                        findings about ICL.
                    </div>
                    <div className="ch-tl-impact">Impact: Established ICL as a major research direction and enabled zero-shot product deployment</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2021&ndash;2022</div>
                    <div className="ch-tl-section-label">Mechanistic theory</div>
                    <div className="ch-tl-title">Transformers as meta-learners and implicit gradient descent</div>
                    <div className="ch-tl-body">
                        Garg et al. (2022) showed that Transformers trained on function-learning
                        tasks can implement gradient descent in their forward pass&mdash;effectively
                        acting as meta-learners that run a learning algorithm when given examples.
                        Dai et al. (2022) demonstrated that ICL is formally dual to gradient
                        descent: the attention mechanism's weight updates during the forward pass
                        are mathematically equivalent to a gradient step on the in-context examples.
                        A third theoretical lens is Bayesian inference: the model maintains an
                        implicit prior over task hypotheses and updates it when examples arrive,
                        producing predictions that approximate Bayesian posteriors.
                    </div>
                    <div className="ch-tl-impact">Impact: Gave ICL a theoretical foundation and connected it to classical learning theory</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Extension</div>
                    <div className="ch-tl-title">Chain-of-Thought (Wei et al.)</div>
                    <div className="ch-tl-body">
                        Wei et al. (Google) showed that adding intermediate reasoning steps to
                        few-shot examples dramatically improved performance on arithmetic and
                        commonsense reasoning tasks. Appending "Let's think step by step" to a
                        query prompted the model to generate a reasoning chain before its answer.
                        This was a major generalization of ICL: the <em>format</em> of examples
                        (not just the input&ndash;output pairs) matters enormously. Showing worked
                        solutions rather than bare answers enabled GPT-3-class models to solve
                        multi-step math problems that were previously intractable. Chain-of-thought
                        gained only negligible performance on models below ~100B parameters,
                        confirming that it is an emergent ICL extension.
                    </div>
                    <div className="ch-tl-impact">Impact: Transformed prompt engineering from "what to ask" to "how to demonstrate reasoning"</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2022</div>
                    <div className="ch-tl-section-label">Alignment interaction</div>
                    <div className="ch-tl-title">Instruction tuning amplifies ICL reliability</div>
                    <div className="ch-tl-body">
                        InstructGPT (Ouyang et al., 2022) showed that RLHF fine-tuning and
                        instruction tuning both dramatically improved the quality and reliability
                        of in-context learning. Models fine-tuned to follow instructions used
                        in-context examples more faithfully, were less likely to ignore them, and
                        generated outputs better aligned with user intent. The combination of
                        instruction tuning and ICL became the foundation of the first commercially
                        deployed chatbot products. This also exposed a tension: instruction-tuned
                        models sometimes override in-context examples when the examples conflict
                        with their RLHF-instilled preferences.
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled reliable ICL at product scale; raised questions about example vs. instruct priority</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2023</div>
                    <div className="ch-tl-section-label">Long-context era</div>
                    <div className="ch-tl-title">Retrieval-augmented and long-context ICL</div>
                    <div className="ch-tl-body">
                        Models with 100K+ token context windows (Claude 2, Gemini 1.5) allowed
                        thousands of in-context examples, blurring the boundary between ICL and
                        fine-tuning. Retrieval-Augmented Generation (RAG) systems retrieved the
                        most relevant examples from a database at inference time, dynamically
                        constructing the few-shot context for each query. Long-context ICL with
                        retrieval effectively replaced task-specific fine-tuning for many
                        applications in industry&mdash;it was faster to set up, easier to update,
                        and required no GPU training budget.
                    </div>
                    <div className="ch-tl-impact">Impact: Made ICL the default deployment strategy for LLM applications in most domains</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>The core mystery:</strong> Nobody programmed GPT-3 to do in-context
                learning. It emerged from next-token prediction on text that happened to contain
                enormous amounts of human demonstrations of learning from examples&mdash;instruction
                manuals, tutoring transcripts, textbooks with worked problems, Q&amp;A forums. The
                model learned "how learning works" by reading about it, then applied that
                meta-knowledge at inference time. This is perhaps the clearest example in deep
                learning of a capability arising as an unintended consequence of scale and data
                diversity.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>The model that reads the instructions right before the test</h2>

            <Analogy label="Learning by Reading the Instructions">
                In-context learning is like being handed an instruction manual right before a
                test. You do not study for weeks&mdash;you read the examples in the manual just
                before answering. The model's "brain" does not change at all while it reads the
                examples. It just uses them to figure out what kind of answers are expected. As
                soon as the conversation ends, the examples are gone&mdash;next time, it has to
                read them again.
            </Analogy>

            <Analogy label="The Copycat Pattern Finder">
                Give the model: "sky &#8594; blue, grass &#8594; green, sun &#8594; ?" and it
                answers "yellow." It is not doing math. It is not looking anything up. It is
                finding the pattern in the examples and extending it. Like a really good copycat
                who can figure out the rule from just a few examples. Give it different examples
                and it will follow a completely different rule, without any retraining.
            </Analogy>

            <Analogy label="Why Bigger Models Are Better at This">
                Small models look at the examples and say: "I see them, but I cannot figure out
                the pattern." Medium models say: "I need at least ten examples to get it." Big
                models say: "I can figure it out from one example." Even bigger models say: "Just
                describe the task in words and I will do it, no examples needed." Scale turns the
                pattern-finding superpower on, step by step.
            </Analogy>

            <Analogy label="Chain of Thought: Showing Your Work">
                If you put "Let me think step by step..." into the examples, the model learns to
                show its reasoning before answering. Like the difference between a textbook that
                just lists answers versus one that shows all the working. The worked-out examples
                make the model much better at hard problems&mdash;it learns to plan before
                committing to an answer.
            </Analogy>

            <Analogy label="The Prompt Is the Program">
                With in-context learning, you do not program the computer in Python&mdash;you
                program it in English by giving it examples. The examples are the program. Change
                the examples, and the model's behavior changes completely, with no retraining
                needed. This means anyone who can write clearly can "program" a language model,
                not just software engineers.
            </Analogy>

            <Analogy label="Why This Is Surprising">
                Nobody taught GPT-3 to do in-context learning on purpose. It just happened
                because the training text included enormous amounts of humans learning from
                examples&mdash;textbooks, tutorials, Q&amp;A sites, instruction manuals. The model
                read so many examples of "here is how you explain something to a learner" that it
                figured out how learning from examples works. It learned how to learn.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The mechanics and theory of in-context learning</h2>

            <h3>Formal Definition</h3>
            <p>
                In-context learning is a purely inference-time phenomenon. Given a pretrained
                model M with fixed parameters &#952;, a task description T, and k demonstrations
                D = &#123;(x&#8321;, y&#8321;), &hellip;, (x&#8342;, y&#8342;)&#125;, the model
                produces output:
            </p>
            <MathBlock tex="\hat{y} = \arg\max_{y} \; p_\theta(y \mid T, x_1, y_1, \ldots, x_k, y_k, x_{\text{test}})" />
            <p>
                The critical constraint is that &#952; is <em>never updated</em>. There is no
                gradient computation, no optimizer step. The demonstrations D shift the model's
                output distribution entirely through the attention mechanism's forward pass.
            </p>

            <DefBlock label="In-Context Learning (ICL) &mdash; Formal Definition">
                ICL is the ability of a pretrained language model to perform a novel task by
                conditioning on a prompt containing a natural-language task description and zero
                or more labeled input&ndash;output demonstrations, without any modification of
                the model parameters.
            </DefBlock>

            <h3>Bayesian Interpretation</h3>
            <p>
                One influential theoretical lens treats ICL as approximate Bayesian inference.
                The model maintains an implicit prior P(c) over possible task "concepts" c
                (mappings from inputs to outputs). Given demonstrations D, it forms a posterior:
            </p>
            <MathBlock tex="P(c \mid D) \propto P(D \mid c) \; P(c) = \prod_{i=1}^{k} P(y_i \mid x_i, c) \cdot P(c)" />
            <p>
                The predicted output marginalizes over all concepts weighted by the posterior:
            </p>
            <MathBlock tex="\hat{y} = \mathbb{E}_{c \sim P(c \mid D)}\bigl[p(y \mid x_{\text{test}}, c)\bigr]" />
            <p>
                Xie et al. (2022) showed that a Transformer pretrained on data generated by a
                mixture of latent concepts will implement this Bayesian inference approximately
                in its forward pass, provided the pretraining distribution is sufficiently
                diverse.
            </p>

            <h3>Implicit Gradient Descent Theory (Dai et al.)</h3>
            <p>
                A second theoretical account connects ICL to gradient descent. For a linear
                Transformer layer with query&ndash;key weight W&#8346;&#8342;, the attention
                output on in-context examples induces a weight update equivalent to:
            </p>
            <MathBlock tex="\Delta W_{QK} \;\propto\; \sum_{i=1}^{k} \bigl(y_i - f(x_i)\bigr) \, x_i^\top" />
            <p>
                This is precisely the gradient of a mean-squared-error loss on the in-context
                examples. The Transformer "runs" this gradient update implicitly during the
                forward pass, without storing gradients or touching the weight matrices. The
                update exists only in the residual stream and is discarded after the forward
                pass completes.
            </p>

            <h3>Prompt Sensitivity and Calibration</h3>
            <p>
                ICL is brittle in practice. Lu et al. (2022) showed that the ordering of few-shot
                examples has a large effect on task accuracy&mdash;up to 30 percentage points of
                variance on some benchmarks, depending on which permutation of the same examples
                is used. The model is not performing ideal Bayesian inference; it is highly
                sensitive to surface-level formatting, the choice of label words, and recency
                bias (examples near the end of the context have more influence).
            </p>
            <p>
                Calibration correction can reduce sensitivity. For a binary classification task
                with labels "Positive" / "Negative", the calibrated prediction is:
            </p>
            <MathBlock tex="\hat{y} = \arg\max_{y \in \mathcal{Y}} \frac{p_\theta(y \mid \text{prompt})}{p_\theta(y \mid \text{content-free prompt})}" />
            <p>
                Dividing by the model's prior probability under a content-free prompt (e.g. "N/A")
                removes label bias introduced by the model's pretraining distribution, substantially
                reducing the variance from example ordering.
            </p>

            <h3>Chain-of-Thought Scaling</h3>
            <p>
                Wei et al. showed that chain-of-thought (CoT) prompting produces negligible gains
                for models below approximately 100B parameters and large gains above that
                threshold. A CoT prompt asks the model to generate a reasoning trace before
                producing the final answer. The probability of a correct multi-step solution is:
            </p>
            <MathBlock tex="p(\hat{y} \mid x) = \sum_{z} p(\hat{y} \mid z, x) \; p(z \mid x)" />
            <p>
                where z is the intermediate reasoning chain. For small models, p(z | x) produces
                incoherent reasoning chains and the sum degrades performance. For large models,
                p(z | x) generates valid reasoning steps, and the sum amplifies performance on
                tasks requiring multi-step planning. This threshold behavior is strong evidence
                that CoT is an emergent capability requiring a minimum circuit complexity.
            </p>

            <hr className="ch-sep" />

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive &mdash; Mathematics</span>
                    <span className="ch-expandable-desc">Meta-learning duality &middot; Bayesian ICL &middot; Garg et al. derivation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">OpenAI API &middot; zero-shot / one-shot / few-shot comparison</span>
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
            <h2>ICL as meta-learning: full derivation</h2>

            <h3>The meta-learning framing (Garg et al.)</h3>
            <p>
                Garg et al. (2022) set up ICL as a function-learning problem. They trained
                Transformers from scratch on tasks of the form: given (x&#8321;, f(x&#8321;)),
                &hellip;, (x&#8342;, f(x&#8342;)), predict f(x&#8342;&#8330;&#8321;). Here f is
                drawn i.i.d. from a function class F (e.g., linear functions, sparse linear
                functions, two-layer neural nets). The pretrained Transformer is then tested on
                new functions from the same class. Key result: Transformers trained this way
                achieve in-context learning error close to the Bayes-optimal predictor, without
                any architecture changes.
            </p>
            <p>
                For the linear function class F = &#123;f : f(x) = w&middot;x, w &#8712;
                &#8477;&#7496;&#125;, the Bayes-optimal predictor given demonstrations is the
                ridge regression estimator:
            </p>
            <MathBlock tex="\hat{w} = \bigl(X^\top X + \lambda I\bigr)^{-1} X^\top \mathbf{y}" />
            <p>
                where X &#8712; &#8477;&#8317;&#7503;&#215;&#7496;&#8318; is the matrix of in-context
                inputs and y &#8712; &#8477;&#7503; is the vector of outputs. The Transformer
                achieves prediction error indistinguishable from this estimator&mdash;meaning it
                is implicitly computing ridge regression in its forward pass.
            </p>

            <h3>Dual form: ICL as gradient descent</h3>
            <p>
                Dai et al. (2022) proved the following duality for a single-layer linear
                self-attention layer. The attention output for query q given key&ndash;value pairs
                (K, V) is:
            </p>
            <MathBlock tex="\text{Attn}(q, K, V) = V \cdot \text{softmax}\!\left(\frac{K^\top q}{\sqrt{d}}\right)" />
            <p>
                Under the linear attention approximation (removing the softmax), this becomes:
            </p>
            <MathBlock tex="\text{LinAttn}(q, K, V) = \frac{1}{k} V K^\top q" />
            <p>
                Now let K be the in-context inputs &#123;x&#8321;, &hellip;, x&#8342;&#125; and
                V be their labels &#123;y&#8321;, &hellip;, y&#8342;&#125;. Then:
            </p>
            <MathBlock tex="\text{LinAttn}(x_{\text{test}}, X, Y) = \frac{1}{k} \sum_{i=1}^{k} y_i \, x_i^\top x_{\text{test}}" />
            <p>
                This is the gradient-descent update to a zero-initialized linear predictor after
                one step with learning rate 1/k and loss L(w) = (1/2k) &sum;&#7522;
                (y&#7522; &minus; w&middot;x&#7522;)&#178;:
            </p>
            <MathBlock tex="\nabla_w L = -\frac{1}{k}\sum_{i=1}^k (y_i - w \cdot x_i)\,x_i \;\xrightarrow{w=0}\; -\frac{1}{k}\sum_{i=1}^k y_i\,x_i" />
            <p>
                So the attention output equals &minus;(gradient step from zero), establishing the
                duality. Each layer performs one implicit gradient step; a deep Transformer
                performs multiple steps, corresponding to a multi-step gradient descent on the
                in-context examples.
            </p>

            <h3>Bayesian ICL: latent concept model</h3>
            <p>
                Xie et al. (2022) proved that if the pretraining corpus is generated by a hidden
                Markov model (HMM) with latent states (concepts) c &#8712; C, and documents are
                i.i.d. sequences from a randomly drawn concept, then next-token prediction
                implicitly learns the posterior:
            </p>
            <MathBlock tex="p_\theta(y \mid x_1,y_1,\ldots,x_k,y_k,x) \;\approx\; \sum_{c \in \mathcal{C}} p(y \mid x, c) \; \frac{P(c) \prod_{i=1}^k p(y_i \mid x_i, c)}{\sum_{c'} P(c') \prod_{i=1}^k p(y_i \mid x_i, c')}" />
            <p>
                This is exact Bayesian inference over concepts, weighted by the posterior given
                demonstrations. The model does not need to be told what concept class to use;
                it infers the concept from the demonstrations, exactly as Bayesian inference
                prescribes.
            </p>

            <DefBlock label="Key Insight">
                The three theories&mdash;meta-learning, implicit gradient descent, and Bayesian
                inference&mdash;all agree on one point: ICL works by extracting task structure
                from demonstrations and applying it to the test query within a single forward
                pass. They differ only in the mathematical language used to describe the same
                underlying computation.
            </DefBlock>

            <div className="ch-callout">
                <strong>Open problem:</strong> All three theories assume the test task is drawn
                from the same distribution as pretraining tasks. When the in-context examples
                describe a genuinely novel concept (e.g., a new programming language invented
                after the model's training cutoff), the theoretical guarantees break down. This
                is one reason why ICL degrades on out-of-distribution tasks even when fine-tuning
                does not.
            </div>
        </>
    )
}

function PythonContent() {
    return (
        <>
            <p>
                The code below calls the OpenAI API with the same sentiment-classification task
                under three different prompt structures: zero-shot, one-shot, and four-shot. The
                test input is identical in all three cases. Running this shows concretely how
                adding demonstrations shifts the model's output distribution toward the correct
                label format and answer.
            </p>
            <CodeBlock
                code={PY_CODE}
                filename="incontext_demo.py"
                lang="python"
                langLabel="Python"
            />
        </>
    )
}

// ── Tab content map ───────────────────────────────────────────────────────────

export const INCONTEXT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
