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
            year: "1838 – 1845",
            title: "Verhulst — The Logistic Curve and Population Growth",
            challenge:
                "Thomas Malthus had argued in 1798 that populations grow exponentially without bound, eventually outstripping food supply and leading to catastrophe. Pierre-Francois Verhulst, a Belgian mathematician, observed that real populations do not grow exponentially forever — they slow as they approach the carrying capacity of their environment. The growth is S-shaped (sigmoidal): fast in the middle, slow at the beginning when the population is small, and slow again at the end when resources become scarce. No existing mathematical function captured this shape.",
            what:
                "Verhulst derived the logistic differential equation dP/dt = rP(1 minus P/K), where r is the intrinsic growth rate and K is the carrying capacity. Its solution is the logistic function P(t) = K divided by (1 plus e to the power of negative r times (t minus t-zero)) — an S-shaped curve that rises from near zero to K. He named it 'logistic' from the Greek for 'reckoning'. The crucial property: the function maps any real number on the time axis to a value strictly between 0 and K. It is bounded.",
            impact:
                "Verhulst's curve lay dormant for nearly a century as a population model. But when statisticians needed a function that maps a linear predictor (ranging from negative infinity to positive infinity) to a probability (between 0 and 1), the logistic function was the perfect solution. The S-shape represents a deep truth about evidence: there are diminishing returns. The first piece of evidence moves you from 50% to 70% certainty; the hundredth piece moves you from 99.9% to 99.91%. Overwhelming evidence pushes probability near 1 but never past it.",
        },
        {
            year: "1958",
            title: "Cox — Logistic Regression as a Statistical Model for Binary Outcomes",
            challenge:
                "Fisher's MLE and linear regression predicted continuous outcomes — crop yield, blood pressure, exam score. But many of the most important scientific questions are binary: does this patient have the disease or not? Does this email contain spam? Does this customer buy? Fitting a straight line to binary 0/1 data produced probabilities outside the range [0,1] for extreme predictor values, violating all of linear regression's assumptions. There was no principled, general framework for modelling binary outcomes as a function of covariates.",
            what:
                "David Cox formalised logistic regression in his 1958 paper 'The Regression Analysis of Binary Sequences'. The model specifies: log(p divided by (1 minus p)) = beta-zero plus beta-one x-one plus ... plus beta-p x-p, where p/(1 minus p) is the odds ratio and log(p/(1 minus p)) is the log-odds or logit. Inverting gives p = sigma(X-beta) where sigma(z) = 1 divided by (1 plus e to the power of negative z) is the logistic sigmoid. Parameters are estimated by maximising the Bernoulli log-likelihood — a convex optimisation problem with a unique global minimum found by Newton's method.",
            impact:
                "Cox's logistic regression is the direct statistical ancestor of the output layer of every neural network used for classification. The sigmoid activation, cross-entropy loss, and gradient-based optimisation of a single-layer network are identical to logistic regression. Understanding logistic regression completely — its geometry, its gradient, its probabilistic interpretation — is understanding every classifier in deep learning, just without the hidden layers that transform the features before the final sigmoid.",
        },
        {
            year: "1972",
            title: "Nelder and Wedderburn — Generalised Linear Models",
            challenge:
                "Logistic regression (binary outcomes), linear regression (Gaussian outcomes), Poisson regression (count data), and gamma regression (positive-valued outcomes) all seemed like entirely separate specialised methods. Each had its own derivation, its own fitting algorithm, its own diagnostic tools. There was no unifying framework that could generate all of them from a common set of principles and compute them with a single algorithm.",
            what:
                "John Nelder and Robert Wedderburn introduced Generalised Linear Models (GLMs): a unified family defined by three components. First, the random component — the distribution of the response, drawn from the exponential family (Gaussian, Bernoulli, Poisson, Gamma, etc.). Second, the systematic component — the linear predictor eta = X-beta. Third, the link function — a monotone function g such that g(mu) = X-beta, where mu = E[y given x]. Logistic regression is a GLM with Bernoulli random component and logit link. The universal fitting algorithm is Iteratively Reweighted Least Squares (IRLS), which converges to the MLE for any GLM.",
            impact:
                "GLMs are the workhorse of applied statistics and make precise why neural networks work: a neural network is a GLM where the linear predictor is replaced by a nonlinear function of the input, learned layer by layer. Backpropagation is gradient descent on the GLM log-likelihood generalised to arbitrary nonlinear function classes. The sigmoid, softmax, and tanh activations used in neural networks are all link functions from the GLM family.",
        },
        {
            year: "1983",
            title: "McCullagh and Nelder — The Textbook That Unified Applied Statistics",
            challenge:
                "Despite the elegance of the 1972 GLM framework, practical statisticians struggled to apply it consistently. There was no comprehensive treatment of the theory — how to choose link functions, how to interpret coefficients, how to diagnose model fit, how to handle overdispersion. Each application domain had its own ad-hoc adaptations.",
            what:
                "Peter McCullagh and John Nelder published 'Generalised Linear Models' (1983, second edition 1989) — the definitive reference that made GLMs the standard tool of applied statistics worldwide. They systematised the exponential family, proved the existence and consistency of MLE for all GLM families, developed quasi-likelihood methods for overdispersed data, and provided a unified treatment of residual diagnostics. The book became one of the most cited in statistics.",
            impact:
                "McCullagh and Nelder's textbook is why GLMs are taught in every applied statistics course and why 'logistic regression' and 'Poisson regression' are standard terms in data science. The exponential family perspective — showing that all common distributions share a common form enabling unified inference — directly inspires modern probabilistic programming frameworks (Stan, PyMC) and variational inference methods in deep learning.",
        },
        {
            year: "1990s – 2000s",
            title: "Stochastic Gradient Descent and Cross-Entropy for Large-Scale Classification",
            challenge:
                "Cox's MLE for logistic regression could be computed exactly via Newton's method or IRLS. But these algorithms require computing and inverting the Hessian matrix — cost that scales as the cube of the number of parameters. With thousands or millions of features (text classification, image recognition, recommendation systems), Newton's method was computationally impossible.",
            what:
                "The solution was stochastic gradient descent (SGD) applied to the cross-entropy loss: pick a random minibatch of examples, compute the gradient of the negative log-likelihood, take a small step in the opposite direction. For logistic regression with sigmoid output and cross-entropy loss, the gradient takes a beautifully simple form: the prediction error times the input. This is identical to the Widrow-Hoff delta rule (1960) applied to probabilistic outputs. SGD on this loss converges to the MLE and scales to billions of parameters.",
            impact:
                "SGD on cross-entropy loss is the universal training algorithm of modern deep learning. Every language model, image classifier, and recommendation system trains this way. The output layer of GPT-4 is logistic regression (softmax over vocabulary) stacked on top of 96 Transformer layers. The 1958 Cox model, the 1960 Widrow-Hoff rule, and the 1986 backpropagation paper combine here: backprop computes the gradient of the cross-entropy loss through the entire network; SGD uses that gradient to update all parameters at once. Chapter 2 begins the story of what happens when you stack nonlinear layers between the input and the logistic output.",
        },
        {
            year: "2012 – present",
            title: "Softmax and the Multinomial Extension at Scale",
            challenge:
                "Logistic regression handles binary outcomes (spam or not spam). But real classification problems often have many classes — 1,000 ImageNet categories, 50,000 words in a vocabulary, millions of product categories. Applying binary logistic regression required training one-versus-rest classifiers for each class, which was inefficient and inconsistent (probabilities across classes did not sum to one).",
            what:
                "The softmax function generalises the sigmoid to K classes: p(y=k given x) = exp(w-k-transpose x) divided by the sum over j of exp(w-j-transpose x). Each class has its own weight vector. Training minimises categorical cross-entropy — the multinomial generalisation of binary cross-entropy. Softmax ensures that all K class probabilities sum to exactly 1 and each is positive, making it a valid probability distribution. The modern ImageNet-era neural network (Krizhevsky et al., 2012) used a softmax output layer over 1,000 classes, trained with categorical cross-entropy via backpropagation.",
            impact:
                "Softmax is the output layer of virtually every multi-class neural network ever built. Language models generate text by sampling from a softmax over the vocabulary. Recommendation systems score items with a softmax over products. Image classifiers use softmax over categories. Logistic regression — Cox's 1958 binary model — scales to millions of classes through the softmax, and its gradient through a neural network is computed by the same backpropagation algorithm that Rumelhart, Hinton, and Williams demonstrated in 1986.",
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
                Imagine you are trying to predict whether someone will buy a product (1 = yes, 0 = no) based on their age. If you use ordinary linear regression, you can get predictions like negative 0.3 or 1.7 — which make no sense as probabilities. A probability must be between 0 and 1.
                <br /><br />
                You need a function that squashes any number into the range (0, 1). Nature solved this problem millions of years ago: the S-shaped curve that describes how populations grow, how drugs are absorbed, how neurons respond to stimulation. Verhulst described it for populations in 1838. Cox applied it to classification in 1958. Now it is the most important function in machine learning.
            </Analogy>

            <Analogy label="The sigmoid — the S-shaped squasher">
                The <strong>sigmoid function</strong> sigma(z) = 1 divided by (1 plus e to the power of negative z) takes any real number and maps it to a number between 0 and 1. When z is very negative (say, negative 10), the output is nearly 0. When z = 0, the output is exactly 0.5. When z is very positive (say, positive 10), the output is nearly 1.
                <br /><br />
                The input z is a weighted sum of features — the same linear combination Gauss used for regression. The sigmoid just wraps that weighted sum in an S-curve, converting a score (which can be any real number) into a probability (which must be between 0 and 1).
            </Analogy>

            <Analogy label="Training — finding the weights with cross-entropy">
                How do we find the right weights? Fisher's maximum likelihood: choose the weights that make the labels you actually observed as probable as possible. For binary labels, this is equivalent to minimising the <strong>cross-entropy loss</strong>: negative [y times log(p) plus (1 minus y) times log(1 minus p)].
                <br /><br />
                If y = 1 (it was a yes) and the model predicted p = 0.9, the loss is small — good prediction, small penalty. If the model predicted p = 0.1, the loss is large — terrible prediction, large penalty. Gradient descent finds the weights that minimise this total penalty across all training examples. The gradient has a beautiful form: the prediction error times the input.
            </Analogy>

            <Analogy label="The decision boundary — drawing a line">
                When the model outputs p greater than 0.5, it predicts class 1. When p is less than 0.5, it predicts class 0. The boundary where p = 0.5 exactly is where z = 0, which means w-transpose x + b = 0. This is a straight line (or hyperplane in higher dimensions).
                <br /><br />
                This means logistic regression is fundamentally a linear classifier — it draws one straight line to separate classes. It works beautifully when classes are roughly separable by a line. But real problems are rarely so tidy: cat photos and dog photos are separated by a wildly nonlinear boundary in pixel space. That is why we need hidden layers.
            </Analogy>

            <Analogy label="Softmax — one-vs-rest for many classes">
                Logistic regression handles two classes. What about ten classes (digits 0-9)? Or 1,000 classes (ImageNet)? The softmax function generalises the sigmoid: for each class, compute a score, take the exponential of each score, and divide by the sum of all exponentials.
                <br /><br />
                The result is K numbers between 0 and 1 that sum to exactly 1 — a proper probability distribution over K classes. Softmax is the output layer of every multi-class neural network. A language model generating text is choosing the next word from a softmax over 50,000 vocabulary items — logistic regression at enormous scale.
            </Analogy>

            <Analogy label="What comes next — stacking layers">
                Logistic regression draws a single straight line in feature space to separate classes. The solution to nonlinear boundaries? Instead of feeding raw features into the sigmoid, first transform the features through one or more hidden layers of nonlinear functions. This is the key idea of a neural network — and it is exactly what Chapter 2 begins to explore. The mathematician who made it possible was a 28-year-old neurophysiologist who had never heard of logistic regression: Warren McCulloch.
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
                For binary classification (y in {"{0, 1}"}), model the conditional probability using the sigmoid function:
            </p>
            <MathBlock tex="P(y=1 \mid \mathbf{x}) = \sigma(\mathbf{w}^\top \mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^\top \mathbf{x} + b)}}" />
            <p>
                The log-odds (logit) is linear in the features:
            </p>
            <MathBlock tex="\log \frac{P(y=1|\mathbf{x})}{P(y=0|\mathbf{x})} = \mathbf{w}^\top \mathbf{x} + b" />
            <p>
                Each unit increase in feature x<sub>j</sub> multiplies the odds by exp(w<sub>j</sub>). This log-odds linearity is what makes logistic regression interpretable: each coefficient has a direct odds-ratio interpretation.
            </p>

            <h3>Training via Maximum Likelihood</h3>
            <p>
                Assume the n training examples are i.i.d. Bernoulli(p<sub>i</sub>) where p<sub>i</sub> = sigma(w-transpose x-i + b). The log-likelihood is:
            </p>
            <MathBlock tex="\ell(\mathbf{w}, b) = \sum_{i=1}^n \left[ y_i \log p_i + (1-y_i) \log(1-p_i) \right]" />
            <p>
                Minimising the negative log-likelihood equals minimising the <strong>binary cross-entropy loss</strong>. This loss is convex in (w, b) — gradient descent converges to the unique global minimum.
            </p>

            <h3>The Gradient — Beautifully Simple</h3>
            <p>
                The gradient of the cross-entropy loss with respect to w takes a remarkably clean form:
            </p>
            <MathBlock tex="\nabla_\mathbf{w} \mathcal{L} = \frac{1}{n} \sum_{i=1}^n (\hat{p}_i - y_i) \, \mathbf{x}_i = \frac{1}{n} X^\top (\hat{\mathbf{p}} - \mathbf{y})" />
            <p>
                This is the prediction error (p-hat minus y) times the input, summed over all examples — the same form as the perceptron update rule (Chapter 2) and the backpropagation gradient (Chapter 5). The sigmoid derivative cancels out perfectly against the cross-entropy derivative, leaving only the error.
            </p>

            <h3>Multiclass Extension — Softmax</h3>
            <DefBlock label="Softmax for K &gt; 2 classes">
                Replace sigmoid with softmax: P(y=k given x) = exp(w<sub>k</sub>-transpose x) divided by the sum over j of exp(w<sub>j</sub>-transpose x). Each class has its own weight vector. Training minimises categorical cross-entropy. Softmax is the output layer of every multi-class neural network — logistic regression is the K=2 special case.
            </DefBlock>

            <h3>Regularised Logistic Regression</h3>
            <p>
                Add L2 or L1 penalties to prevent overfitting in high dimensions:
            </p>
            <MathBlock tex="\mathcal{L}_{\text{reg}} = \mathcal{L}_{\text{CE}} + \lambda \|\mathbf{w}\|_2^2 \quad \text{(Ridge — MAP with Gaussian prior)}" />
            <MathBlock tex="\mathcal{L}_{\text{reg}} = \mathcal{L}_{\text{CE}} + \lambda \|\mathbf{w}\|_1 \quad \text{(Lasso — MAP with Laplace prior)}" />

            <h3>Decision Boundary</h3>
            <p>
                The decision boundary (where P(y=1 given x) = 0.5) is where w-transpose x + b = 0 — a hyperplane. Logistic regression is therefore a <strong>linear classifier</strong>: it can only separate classes with a straight line (or hyperplane). The XOR problem — two diagonally opposite classes — is not linearly separable, and logistic regression cannot solve it. Neural networks solve this by learning nonlinear features before the final sigmoid layer.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Chapter 1 complete.</strong> We now have the complete classical statistical toolkit: linear regression (Gauss 1801) for continuous targets, PCA (Pearson 1901) for structure discovery, statistical inference (Fisher 1922) for confidence in patterns, and logistic regression (Cox 1958) for classification. Each is optimal for its task under its assumptions. Each breaks down when the relationship is nonlinear. Chapter 2 begins the story of how nonlinearity enters machine learning — through a mathematical model of a biological neuron, published in 1943.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Convexity proof · Newton's method · information geometry</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">NumPy from scratch · sklearn · SGD training loop</span>
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
            <h2>Logistic Regression: Formal Theory</h2>

            <DefBlock label="Convexity of the Cross-Entropy Loss">
                The negative log-likelihood (cross-entropy loss) for logistic regression is:
                L(w, b) = minus the sum over i of [y-i times log sigma(z-i) + (1 minus y-i) times log(1 minus sigma(z-i))], where z-i = w-transpose x-i + b.
                The Hessian of L with respect to w is X-transpose times diag(p-i times (1 minus p-i)) times X, which is positive semidefinite for all w. Therefore L is convex — gradient descent converges to the global minimum.
            </DefBlock>

            <h3>Newton's Method (IRLS)</h3>
            <p>
                Newton's method for logistic regression uses both the gradient and Hessian:
            </p>
            <MathBlock tex="\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} - (X^\top W X)^{-1} X^\top (\hat{\mathbf{p}} - \mathbf{y})" />
            <p>
                where W = diag(p<sub>i</sub>(1 minus p<sub>i</sub>)) is the diagonal weight matrix. This is equivalent to Iteratively Reweighted Least Squares (IRLS): at each step, solve a weighted linear regression problem with adjusted response z<sub>i</sub> = w-transpose x-i + (y<sub>i</sub> minus p<sub>i</sub>) divided by (p<sub>i</sub>(1 minus p<sub>i</sub>)).
            </p>

            <h3>Information Geometry</h3>
            <p>
                In information geometry, the family of logistic regression models forms an <em>exponential family</em>:
            </p>
            <MathBlock tex="p(y \mid x, w) = \exp\!\left(y \cdot w^\top x - \log(1 + e^{w^\top x})\right)" />
            <p>
                The log-partition function A(w) = log(1 + e to the w-transpose x) is the cumulant generating function. Its first derivative gives the mean (the predicted probability p); its second derivative gives the variance (p times (1 minus p)). The Fisher information metric on this family equals the Hessian of the cross-entropy loss — connecting statistical curvature to the optimisation landscape.
            </p>

            <h3>Connection to Neural Networks</h3>
            <MathBlock tex="\text{Neural network: } \hat{y} = \sigma(W_L \cdot \text{ReLU}(W_{L-1} \cdots \text{ReLU}(W_1 x) \cdots))" />
            <p>
                Every layer except the last applies a nonlinear activation. The last layer is exactly logistic regression (or softmax for multi-class) applied to the learned features from the previous layer. Backpropagation computes the gradient of the cross-entropy loss through the composition — the chain rule applied to nested functions. The gradient at the output layer is p-hat minus y (the logistic regression gradient); it then flows backward through all preceding layers.
            </p>

            <div className="ch-callout">
                <strong>Key insight:</strong> Logistic regression is a neural network with zero hidden layers. Adding hidden layers allows the model to learn the features that make classification easy — transforming the input space so that the logistic boundary becomes a good fit. The sigmoid, the cross-entropy, and the gradient form (p-hat minus y) times x are preserved exactly through this extension.
            </div>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, log_loss

np.random.seed(42)

# ── Logistic regression from scratch (SGD) ──────────────────────────────────
def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def cross_entropy_loss(y, p):
    p = np.clip(p, 1e-12, 1 - 1e-12)   # avoid log(0)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

def logistic_regression_sgd(X, y, lr=0.1, epochs=500):
    n, p = X.shape
    w = np.zeros(p)
    b = 0.0
    losses = []

    for epoch in range(epochs):
        # Full-batch gradient descent (use minibatches for large n)
        z = X @ w + b
        p_hat = sigmoid(z)
        error = p_hat - y                    # gradient of cross-entropy through sigmoid
        grad_w = X.T @ error / n            # dL/dw
        grad_b = error.mean()               # dL/db
        w -= lr * grad_w
        b -= lr * grad_b
        if epoch % 100 == 0:
            losses.append(cross_entropy_loss(y, p_hat))

    return w, b, losses

# ── Generate binary classification data ─────────────────────────────────────
X, y = make_classification(n_samples=500, n_features=4, n_informative=3,
                             random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      random_state=42)

# ── Train from scratch ────────────────────────────────────────────────────────
w, b, losses = logistic_regression_sgd(X_train, y_train, lr=0.1, epochs=500)
print("Loss history:", [f"{l:.4f}" for l in losses])

z_test = X_test @ w + b
y_pred = (sigmoid(z_test) >= 0.5).astype(int)
print(f"Scratch accuracy: {accuracy_score(y_test, y_pred):.4f}")

# ── Compare with sklearn ─────────────────────────────────────────────────────
clf = LogisticRegression(max_iter=500, C=1e6)   # C=1/lambda; large C = no regularisation
clf.fit(X_train, y_train)
y_sk = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:, 1]
print(f"sklearn accuracy: {accuracy_score(y_test, y_sk):.4f}")
print(f"Cross-entropy:    {log_loss(y_test, y_prob):.4f}")

# ── Softmax (multiclass) ─────────────────────────────────────────────────────
def softmax(Z):
    """Z shape: (n, K)"""
    E = np.exp(Z - Z.max(axis=1, keepdims=True))   # subtract max for stability
    return E / E.sum(axis=1, keepdims=True)

X3, y3 = make_classification(n_samples=300, n_classes=3, n_informative=4,
                               n_redundant=0, random_state=0)
K = 3
W = np.zeros((X3.shape[1], K))
lr = 0.1

for _ in range(1000):
    P = softmax(X3 @ W)
    Y_onehot = np.eye(K)[y3]
    W -= lr * (X3.T @ (P - Y_onehot)) / len(y3)

preds3 = softmax(X3 @ W).argmax(axis=1)
print(f"\\nSoftmax 3-class accuracy: {accuracy_score(y3, preds3):.4f}")`

function PythonContent() {
    return (
        <>
            <p>
                Logistic regression implemented from scratch with SGD and cross-entropy loss, then compared against scikit-learn. The softmax extension shows how binary logistic regression generalises to multiple classes with minimal code changes.
            </p>
            <CodeBlock code={PY_CODE} filename="logistic_regression.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The gradient of cross-entropy loss through a sigmoid is simply (p-hat minus y) times x — prediction error times input. This elegant form means the gradient computation at the output layer of any neural network is identical to logistic regression. Everything that backpropagation adds is just the chain rule applied to get this same error signal back through earlier layers.
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
