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
            year: "1838 – 1845",
            title: "Verhulst — The Logistic Function and Population Growth",
            challenge:
                "Malthus had argued in 1798 that populations grow exponentially without bound, eventually outstripping food supply. Pierre-François Verhulst, a Belgian mathematician, observed that real populations slow as they approach the environment's carrying capacity — growth was S-shaped (sigmoidal), not purely exponential. He needed a mathematical function that started slow, accelerated, then levelled off.",
            what:
                "Verhulst derived the logistic differential equation dP/dt = rP(1 − P/K), where r is the growth rate and K is the carrying capacity. Its solution is the logistic function P(t) = K / (1 + e^{−r(t−t₀)}) — an S-shaped curve that rises from 0 to K. He named it 'logistic' from the Greek for 'reckoning' or 'proportion'. The function maps any real number to the interval (0, K).",
            impact:
                "Verhulst's curve lay dormant for a century as a population model. But when statisticians needed a function that maps a linear predictor (−∞ to +∞) to a probability (0 to 1), the logistic function was the perfect solution. The S-shape represents a biological truth: there are diminishing returns to evidence. Overwhelming evidence pushes probability near 1 but never past it.",
        },
        {
            year: "1958",
            title: "Cox — Logistic Regression as a Statistical Model",
            challenge:
                "Fisher's MLE and linear regression predicted continuous outcomes — crop yield, blood pressure, test score. But many scientific questions are binary: does this patient have the disease or not? Does this customer buy or not? Fitting a straight line to binary 0/1 data produces probabilities outside [0,1] for extreme inputs, and violates all of linear regression's assumptions. There was no principled, general framework for binary classification.",
            what:
                "David Cox formalised logistic regression in his 1958 paper 'The Regression Analysis of Binary Sequences'. The model is: log(p/(1−p)) = β₀ + β₁x₁ + ... + βₚxₚ, where p/(1−p) is the odds ratio and log(p/(1−p)) is the log-odds (logit). Inverting gives p = σ(Xβ) where σ(z) = 1/(1+e^{−z}) is the logistic sigmoid. Parameters are estimated by maximising the Bernoulli log-likelihood — a convex optimisation problem with a unique global minimum.",
            impact:
                "Cox's logistic regression is the direct statistical ancestor of the output layer of every neural network used for classification. The sigmoid activation, cross-entropy loss, and gradient-based optimisation of a single-layer network are identical to logistic regression. Understanding logistic regression is understanding every classifier in deep learning — just without the hidden layers. That gap — what hidden layers add — is exactly what Chapter 2 begins to address.",
        },
        {
            year: "1972",
            title: "Nelder & Wedderburn — Generalised Linear Models",
            challenge:
                "Logistic regression (binary outcomes), linear regression (Gaussian outcomes), Poisson regression (count data), and gamma regression (positive-valued outcomes) all seemed like separate specialised methods. There was no unifying framework that could generate all of them from a common set of principles and compute them with a single algorithm.",
            what:
                "Nelder and Wedderburn introduced Generalised Linear Models (GLMs): a unified family defined by three components: (1) a random component — the distribution family from the exponential family; (2) a systematic component — the linear predictor Xβ; (3) a link function — a monotone function g such that g(μ) = Xβ. Logistic regression is a GLM with Bernoulli distribution and logit link. The universal fitting algorithm is Iteratively Reweighted Least Squares (IRLS), which converges to the MLE for any GLM.",
            impact:
                "GLMs are the workhorse of applied statistics. They also make precise why neural networks work: a neural network is a GLM where the linear predictor is replaced by a nonlinear function of the input, learned layer by layer. Backpropagation is gradient descent on the GLM log-likelihood, generalised to arbitrary nonlinear function classes. The sigmoid, softmax, and tanh activations used in neural networks are all link functions from the GLM family.",
        },
        {
            year: "1989 – present",
            title: "Gradient Descent for Logistic Regression — the Bridge to Neural Networks",
            challenge:
                "Cox's MLE for logistic regression can be computed exactly via Newton's method (IRLS). But Newton's method requires computing and inverting the Hessian matrix — O(p³) cost that becomes prohibitive when p is large (thousands or millions of features). Deep learning pushed this problem to scales where even storing the Hessian is impossible.",
            what:
                "Stochastic gradient descent (SGD) applied to the logistic cross-entropy loss: pick a random minibatch of examples, compute the gradient of the negative log-likelihood, take a small step downhill. For logistic regression with sigmoid output and cross-entropy loss, the gradient simplifies to ∇L = (σ(Xβ) − y)ᵀX — the error times the input. This is Widrow-Hoff (1960) applied to probabilistic outputs. SGD on this loss converges to the MLE and scales to billions of parameters.",
            impact:
                "SGD on cross-entropy loss is the universal training algorithm of modern deep learning. Every language model, image classifier, and recommendation system trains this way. The output layer of GPT-4 is logistic regression (softmax over vocabulary) stacked on top of 96 Transformer layers. The 1958 Cox model, the 1965 SGD algorithm, and the 1986 backpropagation paper combine here: backprop computes the gradient of the cross-entropy loss through the entire network; SGD uses that gradient to update all parameters at once. Chapter 2 begins the story of what happens when you stack nonlinear layers between the input and the logistic output.",
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
            <h2>From numbers to yes/no — predicting categories</h2>

            <p className="ch-story-intro">
                Regression predicts a number on a continuous scale — house price, temperature, exam score. But many of the most important questions in science and technology demand a different kind of answer: yes or no. Does this email contain spam? Does this X-ray show a tumour? Will this customer click the advertisement? Logistic regression is the first algorithm designed specifically for this — and it turns out to be the same function that lives at the output of every modern AI classifier.
            </p>

            <Analogy label="The problem with a straight line for yes/no questions">
                Imagine you're trying to predict whether someone will buy a product (1 = yes, 0 = no) based on their age. If you use ordinary linear regression, you can get predictions like −0.3 or 1.7 — which make no sense as probabilities. A probability must be between 0 and 1.
                <br /><br />
                You need a function that squashes any number into the range (0, 1). Nature solved this problem millions of years ago: the S-shaped curve that describes how populations grow, how drugs are absorbed, how neurons respond to stimulation. Verhulst (1838) described it for populations. Cox (1958) applied it to classification.
            </Analogy>

            <Analogy label="The sigmoid function — the S-shaped squasher">
                The <strong>sigmoid function</strong> σ(z) = 1/(1+e^&#123;−z&#125;) takes any real number and maps it to a number between 0 and 1:
                <ul style={{ paddingLeft: "1.4em", marginBottom: "14px" }}>
                    <li>z = −10 → σ(z) ≈ 0.00005 (nearly zero: very unlikely yes)</li>
                    <li>z = 0 → σ(z) = 0.5 (fifty-fifty)</li>
                    <li>z = +10 → σ(z) ≈ 0.99995 (nearly certain yes)</li>
                </ul>
                The input z is a weighted sum of features — the same linear combination Gauss used for regression. The sigmoid just wraps it in an S-curve.
            </Analogy>

            <Analogy label="Training — finding the weights">
                How do we find the right weights w? Fisher's maximum likelihood: try all possible weight vectors and choose the one that makes the labels you actually observed as probable as possible. For binary labels, this becomes the <strong>cross-entropy loss</strong>:
                <br /><br />
                Loss = −[y · log(p) + (1−y) · log(1−p)]
                <br /><br />
                If y = 1 (it was a yes) and the model predicted p = 0.9, loss ≈ 0.1 — small, good. If it predicted p = 0.1, loss ≈ 2.3 — large, punished. Gradient descent finds the weights that minimise the total loss across all training examples.
            </Analogy>

            <Analogy label="What comes next — stacking layers">
                Logistic regression draws a single straight line (hyperplane) in feature space to separate classes. It works beautifully when classes are roughly linearly separable. But real problems are rarely that tidy — the boundary between cat photos and dog photos is wildly nonlinear.
                <br /><br />
                The solution? Instead of feeding raw features into the sigmoid, first transform the features through one or more hidden layers of nonlinear functions. This is the key idea of a neural network — and it's exactly what Chapter 2 begins to explore. The mathematician who made it possible was a 28-year-old neurophysiologist who had never heard of logistic regression: Warren McCulloch.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>From linear regression to probabilistic classification</h2>

            <h3>The Logistic Model</h3>
            <p>
                For binary classification (y ∈ {"{0, 1}"}), model the conditional probability:
            </p>
            <MathBlock tex="P(y=1 \mid \mathbf{x}) = \sigma(\mathbf{w}^\top \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^\top \mathbf{x} + b)}}" />
            <p>
                The log-odds (logit) is linear in the features:
            </p>
            <MathBlock tex="\log \frac{P(y=1|\mathbf{x})}{P(y=0|\mathbf{x})} = \mathbf{w}^\top \mathbf{x} + b" />
            <p>
                Each unit increase in feature x_j multiplies the odds by exp(w_j). This log-odds linearity is what makes logistic regression interpretable: each coefficient has a direct odds-ratio interpretation.
            </p>

            <h3>Training via Maximum Likelihood</h3>
            <p>
                Assume the n training examples are i.i.d. Bernoulli(pᵢ) where pᵢ = σ(wᵀxᵢ+b). The log-likelihood is:
            </p>
            <MathBlock tex="\ell(\mathbf{w}, b) = \sum_{i=1}^n \left[ y_i \log p_i + (1-y_i) \log(1-p_i) \right]" />
            <p>
                Minimising the negative log-likelihood is exactly minimising the <strong>binary cross-entropy loss</strong>. This loss is convex in (w, b) — gradient descent converges to the unique global minimum.
            </p>

            <h3>The Gradient</h3>
            <p>
                The gradient of the cross-entropy loss with respect to w is remarkably clean:
            </p>
            <MathBlock tex="\nabla_\mathbf{w} \mathcal{L} = \frac{1}{n} \sum_{i=1}^n (\hat{p}_i - y_i) \, \mathbf{x}_i = \frac{1}{n} X^\top (\hat{\mathbf{p}} - \mathbf{y})" />
            <p>
                This is the prediction error (ŷ − y) times the input, summed over all examples — the same form as the perceptron update rule (Chapter 2) and the backpropagation gradient (Chapter 5). The gradient of cross-entropy through a sigmoid is just the error; the sigmoid derivative cancels out perfectly.
            </p>

            <DefBlock label="Multiclass Extension — Softmax">
                For K &gt; 2 classes, replace sigmoid with softmax: P(y=k|x) = exp(wₖᵀx) / Σⱼ exp(wⱼᵀx). Each class has its own weight vector. Training minimises categorical cross-entropy. Softmax is the output layer of every multi-class neural network — logistic regression is the K=2 special case.
            </DefBlock>

            <h3>Regularised Logistic Regression</h3>
            <p>
                Add L2 or L1 penalty to prevent overfitting in high dimensions:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{reg}} = \mathcal{L}_{\text{CE}} + \lambda \|\mathbf{w}\|_2^2 \quad \text{(Ridge = MAP with Gaussian prior)}" />
            <MathBlock tex="\mathcal{L}_{\text{reg}} = \mathcal{L}_{\text{CE}} + \lambda \|\mathbf{w}\|_1 \quad \text{(Lasso = MAP with Laplace prior)}" />

            <h3>Decision Boundary</h3>
            <p>
                The decision boundary (where P(y=1|x) = 0.5) is where wᵀx + b = 0 — a hyperplane. Logistic regression is therefore a <strong>linear classifier</strong>: it can only separate classes with a straight line (or hyperplane in higher dimensions). The XOR problem — two diagonally opposite classes — is not linearly separable, and logistic regression cannot solve it. Neural networks solve this by learning nonlinear features before the final sigmoid layer.
            </p>

            <div className="ch-callout">
                <strong>Chapter 1 complete.</strong> We now have the complete statistical learning toolkit: linear regression (Gauss 1801) for continuous targets, PCA (Pearson 1901) for structure discovery, statistical inference (Fisher 1922) for confidence in patterns, and logistic regression (Cox 1958) for classification. Each is optimal for its task under its assumptions. Each breaks down when the relationship is nonlinear. Chapter 2 begins the story of how nonlinearity enters machine learning — through a mathematical model of a biological neuron, published in 1943.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const LOGISTIC_REGRESSION_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
