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
            year: "2010–2018 — The Supervised-Only Era",
            title: "Every task required labeled examples; generalization was narrow",
            context: "From the deep learning revival of 2012 through 2018, the dominant paradigm was supervised fine-tuning from scratch or from pretrained representations. Building a sentiment classifier meant collecting thousands of labeled reviews. Building a named entity recognizer meant hand-tagging news articles. Even when transfer learning was used — taking ImageNet-pretrained features for a new vision task, or using GloVe embeddings for NLP — the fine-tuning step required substantial labeled data for every target task. Zero-shot generalization was an academic curiosity confined to attribute-based image classification, not a practical capability.",
            what: "In NLP, the standard pipeline circa 2017 was: (1) train word embeddings on unlabeled text (Word2Vec, GloVe, fastText); (2) design a task-specific architecture (LSTM, CNN, CRF); (3) fine-tune on labeled task data. The pretrained embeddings gave a head start, but the model still needed hundreds to thousands of labeled examples per class. BERT (2018) improved step 1 dramatically — pretraining the entire encoder gave much richer representations — but fine-tuning still required labeled data. The idea that a model might perform well on a task it had never seen any labeled examples for was not yet a mainstream expectation.",
            impact: "This paradigm created two bottlenecks that motivated zero-shot research: annotation cost (labeling data is expensive and slow) and generalization breadth (a model trained on 50 tasks still failed on task 51). The GPT-2 result was surprising precisely because it showed that zero-shot transfer was not just theoretically possible — it emerged spontaneously from scale alone, without any explicit design for zero-shot capability.",
        },
        {
            year: "February 2019 — GPT-2 and Unsupervised Multitask Learning",
            title: "Zero-shot transfer emerges from scale, not design",
            context: "When Radford et al. evaluated GPT-2 on reading comprehension (CoQA), translation (WMT14 En&#8594;Fr), summarization (CNN/DailyMail), and question answering (Natural Questions), they discovered that the model performed at competitive levels without a single labeled fine-tuning example. This was not built in — GPT-2 was trained purely on next-token prediction over WebText, with no task-specific supervision. The zero-shot capability emerged as a side effect of training on a sufficiently diverse and large corpus.",
            what: "The key mechanism was that WebText contained millions of implicit task demonstrations. TL;DR posts taught summarization. Bilingual paragraphs taught translation. FAQ pages taught question answering. The model had seen so many examples of each task format during pretraining that it learned the input-output mapping implicitly. Radford et al. coined the term 'unsupervised multitask learner' to describe this behavior. The evaluation methodology introduced task-framing via natural language prompts: appending 'TL;DR:' to elicit summaries, formatting 'Q: &#123;question&#125; A:' to elicit answers.",
            impact: "GPT-2's zero-shot transfer fundamentally changed the framing of language model evaluation. Before, evaluating a language model meant measuring perplexity. After GPT-2, evaluation meant measuring task performance under zero-shot prompting. This shift in framing — from 'how well does the model predict text?' to 'what can the model do when prompted?' — is the conceptual foundation of every language model benchmark published since 2019, including BIG-Bench, MMLU, HellaSwag, and TruthfulQA.",
        },
        {
            year: "May 2020 — GPT-3 and In-Context Learning",
            title: "Few-shot examples in the prompt replace gradient updates",
            context: "Brown et al. at OpenAI trained GPT-3 — 175B parameters, 300B training tokens — and evaluated it on 42 NLP tasks in three settings: zero-shot (task description only), one-shot (one example), and few-shot (up to 32 examples). The few-shot results were dramatic: on many tasks, GPT-3 with 32 in-context examples matched or exceeded fine-tuned BERT-large, without any gradient updates to the model's parameters. The model appeared to perform 'learning' inside a single forward pass.",
            what: "Brown et al. introduced the term 'in-context learning' to describe this phenomenon: providing input-output demonstrations directly in the prompt allows the model to infer the task mapping from examples, without weight updates. The mechanism was scale-dependent — smaller GPT-3 variants showed little in-context learning benefit, while the full 175B model showed large gains from examples. This scale dependence suggested that in-context learning was an emergent capability, not something that could be engineered into small models. The paper also introduced the distinction between meta-learning (what GPT-3 was doing — it had seen similar task demonstrations during pretraining) and true few-shot learning.",
            impact: "GPT-3's in-context learning launched prompt engineering as a research field and a professional skill. It also demonstrated that model scale was a prerequisite for in-context learning capability, fueling the race toward larger models. The GPT-3 API, released in June 2020, made in-context learning accessible to developers for the first time, spawning hundreds of applications that required no machine learning expertise beyond crafting the right prompt. It was the first public demonstration that a language model could be a general-purpose reasoning tool.",
        },
        {
            year: "2021 — Instruction Tuning: Making Zero-Shot Reliable",
            title: "Fine-tuning on diverse NLP tasks phrased as instructions dramatically improves held-out zero-shot",
            context: "Pure zero-shot via prompting was fragile: small changes in wording could change outputs dramatically, the format had to closely match what the model had seen during pretraining, and performance on tasks very different from those formats was poor. Wei et al. at Google Brain hypothesized that if you fine-tuned a large language model on a collection of NLP tasks phrased as natural language instructions, it would learn to follow the instruction format generically — enabling much better zero-shot performance on new tasks never seen during fine-tuning.",
            what: "The FLAN (Finetuned Language Net) paper (Wei et al., 2021) fine-tuned a 137B LaMDA-PT model on 62 NLP datasets clustered into 12 task types, each task phrased as multiple natural language instruction templates (e.g., 'Translate this sentence to French:', 'What is the French translation of:', 'Rephrase in French:'). On 25 held-out tasks (tasks not seen during fine-tuning), FLAN dramatically outperformed GPT-3 zero-shot, and outperformed GPT-3 few-shot on most tasks. The key insight: instruction tuning teaches the model to follow the format of instructions, generalizing to new task formats.",
            impact: "FLAN triggered the instruction-tuning wave that defined 2022–2023. Flan-T5, InstructGPT (the basis of ChatGPT), Alpaca, Vicuna, and every subsequent instruction-tuned model trace directly to this paper. Instruction tuning also clarified the relationship between pretraining scale and instruction-following: models below a threshold size did not benefit from instruction tuning, while models above the threshold saw large gains — another instance of emergent capability. The practical implication was that instruction tuning was the bridge from 'language model' to 'assistant'.",
        },
        {
            year: "2022 — Chain-of-Thought Prompting",
            title: "'Let's think step by step' enables multi-step reasoning at scale",
            context: "Even with instruction tuning, large language models struggled with multi-step reasoning tasks: arithmetic word problems, commonsense reasoning chains, and symbolic manipulation. Standard prompting asked the model to jump directly from question to answer, which worked for pattern-matching tasks but failed when the correct answer required intermediate steps. Wei et al. (2022) at Google Brain observed that when a few-shot prompt included worked-out reasoning steps alongside the answers, model performance on reasoning tasks improved dramatically — but only for models above approximately 100B parameters.",
            what: "Chain-of-thought (CoT) prompting prepends reasoning chains to few-shot examples: 'Q: Roger has 5 balls. He buys 2 more cans of 3 balls each. How many? A: He starts with 5. Each can has 3 balls, so 2 cans is 6. 5+6=11. The answer is 11.' When the model is shown this format, it generates its own reasoning chain before producing the answer. The paper also introduced the zero-shot CoT trick (Kojima et al., 2022): simply appending 'Let's think step by step.' to a question elicits a reasoning chain from sufficiently large models, without any in-context examples.",
            impact: "Chain-of-thought prompting revealed that the mechanism underlying in-context learning could be extended to support reasoning — not just pattern matching. It was also the clearest example of an emergent capability: CoT prompting with small models actively hurt performance (models generated irrelevant chains), while with large models it consistently helped. CoT became the foundation of techniques like least-to-most prompting, self-consistency (sampling multiple chains and majority-voting), and tree-of-thought reasoning, all of which extended the basic insight that intermediate computation improves final answers.",
        },
        {
            year: "2022–2024 — Calibration, Limits, and RLHF",
            title: "Prompt sensitivity, Goodhart's Law, and the evolution toward aligned behavior",
            context: "By 2022, the limitations of zero-shot and few-shot prompting were becoming as important as the capabilities. Models were highly sensitive to prompt wording — rephrasing a question could change the answer dramatically, even when the semantic content was identical. This 'prompt brittleness' made deployment unreliable. Models also inherited biases from pretraining data: they performed better on tasks involving demographic groups overrepresented in web text, and their zero-shot outputs could amplify harmful stereotypes. And Goodhart's Law applied: when benchmark performance became a target, models appeared to saturate benchmarks without corresponding gains in real-world utility.",
            what: "Reinforcement Learning from Human Feedback (RLHF), introduced by Christiano et al. (2017) and scaled by Stiennon et al. (2020) and Ouyang et al. (2022, InstructGPT), addressed prompt brittleness by fine-tuning models to match human preferences rather than just to predict text or follow instructions. A reward model is trained on human preference comparisons, then used to fine-tune the language model via PPO. The result — demonstrated dramatically by ChatGPT (November 2022) — was a model that followed instructions reliably, declined harmful requests consistently, and gave useful responses across diverse prompts without carefully engineered prompt formats.",
            impact: "RLHF did not eliminate zero-shot capability — it built on top of it. The underlying mechanism was still in-context learning from pretraining data, instruction-following from fine-tuning, and chain-of-thought reasoning from scale. RLHF added a reliability layer: it aligned the model's behavior with human preferences, reducing prompt sensitivity and harmful outputs. The transition from 'zero-shot via prompting' to 'RLHF-aligned assistant' is the arc of Chapter 25, and the story that connects GPT-2's surprising 2019 zero-shot results to the deployment of conversational AI used by hundreds of millions of people today.",
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
            <Analogy label="The Trivia Night Expert">
                Imagine walking into a trivia contest about movies, history, science, cooking, and
                geography. You never specifically studied for this contest. But you have read
                thousands of books, watched documentaries, listened to podcasts, and browsed
                Wikipedia your whole life. When a question comes up, you piece together what you
                know from all those scattered sources and give a surprisingly good answer. That is
                zero-shot learning — solving a task using general knowledge absorbed from a huge
                variety of sources, without any task-specific practice.
                <br /><br />
                GPT-2 was the first AI to pull this off convincingly. It never studied translation
                or summarization directly. But it had read so much text that contained translations
                and summaries that it could do both — just from the patterns it had absorbed.
            </Analogy>

            <Analogy label="The Preview Round">
                Now imagine the trivia host gives you three example questions with answers before
                the real round starts. "Movie from 1994: Forrest Gump. Director of Inception:
                Christopher Nolan. Lead actor of The Matrix: Keanu Reeves." You quickly learn the
                pattern — this round is about movies. When the next question comes, you are better
                at guessing even though you did not study movies before arriving.
                <br /><br />
                That is few-shot in-context learning. You did not change your brain — you just read
                a few examples and figured out the pattern. GPT-3 (2020) made this work at a scale
                that shocked researchers: give it 32 examples in the prompt, and it could match
                performance that previously required training a whole new model.
            </Analogy>

            <Analogy label="The Instruction Card">
                Suppose instead of example questions, the trivia host hands you a little card that
                says: "For each question, answer with just the name — no extra words, no 'I think',
                just the name." You follow the format exactly, and your answers become much more
                useful.
                <br /><br />
                That is instruction tuning (FLAN, 2021). Researchers fine-tuned language models on
                hundreds of different tasks, each phrased as a natural language instruction. The
                models learned to follow the instruction format in general — so when they encountered
                a completely new task with a new instruction, they knew how to respond in the right
                format even without any examples.
            </Analogy>

            <Analogy label="Think Out Loud">
                Here is a harder question: "A shop has 5 red apples and 3 green apples. Someone
                buys 4. How many remain?" If you just guess immediately, you might get it wrong.
                But if you think out loud — "5 red plus 3 green is 8 total. They bought 4, so
                8 minus 4 is 4. The answer is 4." — you are much more likely to be correct.
                <br /><br />
                Chain-of-thought prompting (2022) taught AI the same trick. Just by adding a few
                examples that showed the reasoning steps, or even just adding the phrase "Let's
                think step by step," researchers found that big AI models became dramatically better
                at multi-step math and logic problems. Showing your work helps the AI just as much
                as it helps you.
            </Analogy>

            <Analogy label="The Unreliable Genius">
                There is a problem with a student who has read millions of books but never had any
                feedback on their answers: they can be brilliant one moment and completely wrong
                the next, depending on how the question is phrased. Ask "What is the capital of
                France?" and you get "Paris." Ask "Is Paris the capital of France or Germany?" and
                you might get a weird answer. The model is sensitive to tiny wording changes.
                <br /><br />
                This is the main limitation of zero-shot learning: prompt brittleness. The model
                has no way to know which phrasing is clearest — it just pattern-matches. This is
                why labs spent 2022 and 2023 developing RLHF (Reinforcement Learning from Human
                Feedback), which trained models to be reliably helpful rather than just clever.
            </Analogy>

            <Analogy label="What Comes Next — Transformers for Images">
                GPT-2 showed that a big enough language model could solve almost any text task
                without task-specific training. The next question researchers asked was: could the
                same idea work for images? In 2020, a team at Google Brain cut images into small
                square patches — treating each patch like a word in a sentence — and fed them
                through a Transformer. Chapter 21 follows the Vision Transformer (ViT) as it
                crossed the boundary between language and vision, proving that the architecture
                that conquered language could conquer images too.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Zero-shot, few-shot, and in-context learning — mechanisms and limits</h2>

            <h3>Zero-Shot Prompting: Task Framing via Likelihood</h3>
            <p>
                In zero-shot prompting, the model is given a natural language task description
                and asked to produce the answer without any labeled examples. The simplest
                implementation for classification: format the input x and each candidate label y
                as a string, compute the conditional log-probability of y given x, and return
                the highest-scoring label.
            </p>
            <p>
                This works because during pretraining the model has seen billions of implicit task
                demonstrations. Summarization examples appeared in TL;DR posts. Translation appeared
                in bilingual paragraphs. Question answering appeared in FAQ pages. The model learns
                the input-output pattern without any explicit supervision.
            </p>

            <h3>Few-Shot In-Context Learning</h3>
            <p>
                Few-shot prompting prepends k input-output demonstration pairs before the actual
                query. The model's weights are not updated — all "learning" happens inside the
                forward pass through the context window:
            </p>
            <ul>
                <li><strong>Format:</strong> [demo<sub>1</sub> input] &#8594; [demo<sub>1</sub> output] ... [demo<sub>k</sub> input] &#8594; [demo<sub>k</sub> output] [query input] &#8594;</li>
                <li><strong>Mechanism:</strong> Attention layers match patterns between the query and demonstrations, biasing the output distribution toward the demonstrated format.</li>
                <li><strong>Scale dependence:</strong> GPT-3 (175B) showed large few-shot gains; smaller models showed near-zero improvement. This is a canonical emergent capability.</li>
            </ul>

            <h3>Instruction Tuning</h3>
            <p>
                Instruction tuning (Wei et al., 2021) fine-tunes the model on a large collection
                of NLP tasks each phrased as a natural language instruction. On held-out tasks
                never seen during instruction tuning, the model generalizes strongly — far better
                than zero-shot prompting of the same base model. The key insight: instruction
                tuning teaches the task format, not the task content.
            </p>
            <p>
                FLAN (Finetuned Language Net) used 62 datasets in 12 task clusters. Each dataset
                had 10 prompt templates (different phrasings of the same instruction). Training on
                11 clusters and testing on the 12th showed near-zero degradation — the model had
                learned to follow instructions in general.
            </p>

            <h3>Chain-of-Thought Prompting</h3>
            <p>
                Chain-of-thought prompting adds intermediate reasoning steps to few-shot
                demonstrations. The model learns to generate a reasoning chain before the final
                answer. Zero-shot chain-of-thought: append "Let's think step by step." to any
                question; this alone elicits a reasoning chain from models above &#8776;100B
                parameters.
            </p>
            <p>
                The mechanism: CoT allocates additional token predictions to intermediate
                computation. Each reasoning step is a token prediction, and the model can use
                its entire residual stream to "compute" each step before moving to the next.
                This is a form of test-time compute — the model uses its inference budget to do
                work rather than just pattern-match.
            </p>

            <h3>Calibration and Prompt Sensitivity</h3>
            <p>
                A major limitation of zero-shot and few-shot prompting is that performance
                depends heavily on prompt wording. Rephrasing "Translate to French:" as "What
                is the French equivalent of:" can change accuracy by 10–20 percentage points on
                the same model. This sensitivity arises because the model is essentially asking
                "which continuation looks most like pretraining data?" — and the prior over
                continuations shifts with surface wording changes.
            </p>
            <p>
                Calibration techniques (Brown et al., 2020; Zhao et al., 2021) address this by
                subtracting the unconditional label probability (the prior) from the conditional
                score, reducing the effect of label frequency in pretraining data.
            </p>

            <h3>Limits: Goodhart's Law and Bias Amplification</h3>
            <p>
                Zero-shot models inherit biases from their pretraining corpus. Models evaluated
                on majority-culture examples or English text outperform on minority-culture or
                multilingual equivalents. Benchmark saturation is also a persistent problem:
                GPT-4 saturated SuperGLUE, but human-evaluated quality on open-ended generation
                still had substantial room for improvement — measuring benchmark performance
                conflated with measuring capability.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>The RLHF bridge:</strong> Zero-shot and instruction tuning addressed the
                "what can the model do?" question. RLHF addressed "does the model do what I
                want reliably?" — training models to maximize human preference ratings rather than
                next-token prediction likelihood. The combination of instruction tuning (zero-shot
                generalization) and RLHF (preference alignment) is the recipe for every
                commercial AI assistant deployed since 2022.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations &middot; proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">&#9658;</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation &middot; Python &middot; NumPy</span>
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
            <h2>Likelihood-based zero-shot classification and calibration</h2>

            <DefBlock label="Zero-Shot Classification via LM Scoring">
                For a classification task with candidate labels Y = &#123;y&#8321;, ..., y<sub>k</sub>&#125;,
                the zero-shot approach formats the input x and each label as a complete string
                s(x, y) and selects the label maximizing the conditional log-probability:
            </DefBlock>
            <MathBlock tex="\hat{y} = \arg\max_{y \in Y}\;\log P_\theta\!\bigl(y \mid x\bigr) = \arg\max_{y \in Y}\sum_{t=1}^{|y|}\log P_\theta(y_t \mid x,\, y_{<t})" />
            <p>
                For autoregressive models (GPT-2, GPT-3), this is computed by concatenating x and
                y into a single sequence and summing the log-probabilities of all y tokens. For
                encoder-decoder models (T5), x is fed to the encoder and the sum is over the
                decoder's generation of y. This is exact for causal LMs and approximate (via
                teacher forcing) for encoder-decoders.
            </p>

            <h3>Length-Normalized Scoring</h3>
            <p>
                A naive problem: longer labels accumulate more log-probability terms, biasing the
                argmax toward shorter labels. Length normalization divides by label token count:
            </p>
            <MathBlock tex="\text{score}_{\text{len}}(y \mid x) = \frac{1}{|y|}\sum_{t=1}^{|y|}\log P_\theta(y_t \mid x,\, y_{<t})" />
            <p>
                This is the average per-token log-probability, equivalent to the negative
                perplexity of the label string conditioned on the input. It is the standard
                scoring method for multiple-choice evaluation on tasks like RACE, ARC, and
                HellaSwag.
            </p>

            <h3>Calibrated Likelihood Scoring</h3>
            <p>
                Even with length normalization, labels that appear frequently in pretraining data
                receive higher unconditional probabilities. Zhao et al. (2021) proposed
                context-free calibration: subtract the log-probability of the label under the
                unconditional distribution (no input context):
            </p>
            <MathBlock tex="\text{score}_{\text{cal}}(y \mid x) = \frac{1}{|y|}\sum_{t=1}^{|y|}\log P_\theta(y_t \mid x,\, y_{<t}) - \frac{1}{|y|}\sum_{t=1}^{|y|}\log P_\theta(y_t \mid \text{N/A})" />
            <p>
                The subtracted term is the unconditional log-probability of the label given a
                neutral context ("N/A"). This removes the prior bias: if "positive" is inherently
                more likely than "negative" in the language model's distribution, calibration
                subtracts this advantage, leveling the playing field. Calibration typically
                improves zero-shot accuracy by 5–15% on sentiment and NLI tasks.
            </p>

            <h3>Multiple-Choice Ranking</h3>
            <p>
                For k-way multiple choice with choices c<sub>1</sub>, ..., c<sub>k</sub>, the
                standard approach concatenates the question q with each choice and ranks by
                average per-token log-probability of the full sequence:
            </p>
            <MathBlock tex="\hat{c} = \arg\max_{c_i} \frac{1}{|q\oplus c_i|}\sum_{t=1}^{|q \oplus c_i|}\log P_\theta(w_t \mid w_{<t})" />
            <p>
                Where q &#8853; c<sub>i</sub> denotes concatenation. This is how GPT-2 and GPT-3
                were evaluated on HellaSwag, PIQA, StoryCloze, and RACE. The concatenation format
                means the model is not explicitly "comparing" choices — it is computing the
                probability of each full string independently and returning the most likely one.
            </p>

            <h3>In-Context Learning: A Bayesian Perspective</h3>
            <p>
                One theoretical account of in-context learning treats the k demonstrations as
                approximate Bayesian inference over the task hypothesis h. The model's prior over
                tasks is P(h), and after observing k examples it updates to:
            </p>
            <MathBlock tex="P(h \mid \{(x_i, y_i)\}_{i=1}^k) \propto P(h) \prod_{i=1}^k P(y_i \mid x_i, h)" />
            <p>
                Under this view, in-context learning is implicit Bayesian task inference: the
                attention layers compute a posterior over tasks given the demonstrations, and the
                output is drawn from the task-conditional distribution. The scale-dependence of
                in-context learning suggests that this implicit Bayesian inference requires
                sufficient model capacity to represent a rich task prior P(h).
            </p>

            <div className="ch-callout">
                <strong>Why it works at all:</strong> During pretraining on diverse text, the
                model is exposed to millions of implicit (input, output) pairs for every task that
                appears in natural language. Summarization is everywhere — in TL;DRs, in
                abstracts, in book descriptions. Translation is everywhere — in bilingual pages,
                in quoted passages. Zero-shot capability is not a separate skill; it is the
                natural consequence of training a sufficiently large and diverse language model on
                a sufficiently large and diverse corpus.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np

# ── Zero-Shot Classification via LM Likelihood Scoring ────────────────────────

def length_normalized_score(log_probs: np.ndarray) -> float:
    """
    Compute the average per-token log-probability (length-normalized).
    log_probs: array of log P(token_t | context, tokens_<t) for each token t
    """
    return float(np.mean(log_probs))

def calibrated_score(conditional_log_probs: np.ndarray,
                     unconditional_log_probs: np.ndarray) -> float:
    """
    Zhao et al. (2021) context-free calibration:
    Subtract unconditional log-prob to remove label prior bias.
    """
    return float(np.mean(conditional_log_probs) - np.mean(unconditional_log_probs))

def zero_shot_classify(label_conditional_lps: dict,
                       label_unconditional_lps: dict = None,
                       calibrate: bool = False) -> str:
    """
    Classify by selecting the label with highest (calibrated) LM score.
    label_conditional_lps: {label: array of conditional log-probs}
    label_unconditional_lps: {label: array of unconditional log-probs} (for calibration)
    """
    scores = {}
    for label, cond_lps in label_conditional_lps.items():
        if calibrate and label_unconditional_lps:
            scores[label] = calibrated_score(cond_lps, label_unconditional_lps[label])
        else:
            scores[label] = length_normalized_score(cond_lps)
    return max(scores, key=scores.get), scores

# ── Simulated Demo ────────────────────────────────────────────────────────────
# In a real system, these would come from a language model's forward pass.
# Here we simulate log-probs for "sentiment: This film was absolutely stunning."

rng = np.random.default_rng(42)

# Conditional: log-probs of each label given the input
cond = {
    "positive": np.array([-0.31, -0.28, -0.33]),   # "pos", "itive", "."
    "negative": np.array([-2.10, -1.95, -2.05]),
    "neutral":  np.array([-1.40, -1.60, -1.55]),
}
# Unconditional: log-probs of the same label tokens with neutral context "N/A"
uncond = {
    "positive": np.array([-0.55, -0.50, -0.48]),
    "negative": np.array([-0.58, -0.52, -0.50]),
    "neutral":  np.array([-0.80, -0.75, -0.72]),
}

print("Zero-Shot Classification Demo")
print("Input: 'This film was absolutely stunning.'")
print()

pred_raw, scores_raw = zero_shot_classify(cond, calibrate=False)
pred_cal, scores_cal = zero_shot_classify(cond, uncond, calibrate=True)

print("Without calibration:")
for label, s in scores_raw.items():
    marker = " <-- predicted" if label == pred_raw else ""
    print(f"  {label:10s}  avg log-prob = {s:.3f}{marker}")

print()
print("With calibration (Zhao et al. 2021):")
for label, s in scores_cal.items():
    marker = " <-- predicted" if label == pred_cal else ""
    print(f"  {label:10s}  calibrated score = {s:.3f}{marker}")
`

function PythonContent() {
    return (
        <>
            <p>
                Python implementation of likelihood-based zero-shot classification: length-
                normalized LM scoring to select the most probable label, and Zhao et al. (2021)
                context-free calibration to remove label prior bias — the two core methods used
                to evaluate GPT-2 and GPT-3 on zero-shot benchmarks.
            </p>
            <CodeBlock code={PY_CODE} filename="zero_shot.py" lang="python" langLabel="Python" />
        </>
    )
}


// ── Tab content map ───────────────────────────────────────────────────────────

export const ZERO_SHOT_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
