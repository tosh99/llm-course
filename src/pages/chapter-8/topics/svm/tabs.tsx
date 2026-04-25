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
            year: "1963",
            title: "Vapnik & Chervonenkis — The Margin Concept",
            challenge:
                "By the early 1990s, backpropagation (Chapter 5, 1986) had revived neural networks, but training deep nets remained difficult and unpredictable. The field needed a supervised learning algorithm with a solid theoretical foundation — one that explained not just how to find a decision boundary, but why one boundary generalises better than another. Vladimir Vapnik and Alexey Chervonenkis, working at Moscow's Institute of Control Sciences, had developed the conceptual groundwork in the early 1960s: the idea that the gap between a classifier and the nearest training examples — the margin — was the key quantity governing generalisation.",
            what:
                "Vapnik and Chervonenkis introduced the theoretical concept of the margin: the distance from the decision boundary to the nearest training point on either side. They proved (eventually published in 1971 and expanded in 1995) that generalisaton error is bounded by a term involving the margin and the data distribution — specifically, that classifiers with larger margins have smaller VC dimension and hence smaller generalisation error for any fixed number of training examples.",
            impact:
                "The margin concept became the foundation of an entire learning theory — Structural Risk Minimisation (SRM) — that unified the bias-variance tradeoff, generalisation bounds, and model selection into a single mathematical framework. Every time a paper discusses 'large-margin' methods — contrastive learning, metric learning, even RLHF's KL penalty — the intellectual ancestor is Vapnik & Chervonenkis 1963.",
        },
        {
            year: "1992",
            title: "Boser, Guyon & Vapnik — The Kernel Trick and Nonlinear SVM",
            challenge:
                "The hard-margin SVM found the widest linear separator. But most real-world problems — handwriting recognition, protein folding, image classification — are not linearly separable. The obvious fix — map data into a high-dimensional feature space where it becomes linearly separable — was computationally prohibitive: hundreds or thousands of new features meant hundreds of thousands of pairwise dot products to compute.",
            what:
                "Boser, Guyon, and Vapnik showed that the SVM's dual formulation involves data only through dot products xᵢ·xⱼ. If you replace each dot product with a kernel function K(xᵢ, xⱼ) = ⟨φ(xᵢ), φ(xⱼ)⟩, you compute the inner product in the high-dimensional feature space without ever computing φ explicitly. The Gaussian RBF kernel K(x,z) = exp(−γ||x−z||²) corresponds to an infinite-dimensional feature space — and still costs only O(n²d) to evaluate.",
            impact:
                "The kernel trick transformed SVM into the most powerful non-linear classifier of its era. It also generalised to kernel PCA, kernel regression, Gaussian processes, and any algorithm expressible in terms of dot products. The insight that you can work in infinite-dimensional spaces through kernel functions shaped how practitioners thought about feature engineering — and later, how attention mechanisms in Transformers were designed (the attention matrix is a kernel matrix between query and key vectors).",
        },
        {
            year: "1995",
            title: "Cortes & Vapnik — Soft Margin SVM",
            challenge:
                "The 1992 hard-margin SVM required perfect linear separability in the kernel space — a condition rarely met with noisy real-world data. If any training point was misclassified in the feature space, the optimisation had no feasible solution. Practitioners needed a way to allow some violations while still favouring large margins.",
            what:
                "Cortes and Vapnik introduced slack variables ξᵢ ≥ 0, one per training point. The soft-margin SVM allows points inside the margin or on the wrong side, penalised by C·Σξᵢ. The objective becomes min ½||w||² + C·Σξᵢ. C controls the tradeoff: large C → narrow margin (prioritise correct classification); small C → wide margin (allow more violations). This made SVM practical on real-world noisy data.",
            impact:
                "Soft-margin SVM is the form used in virtually all practical applications. The hyperparameter C is exactly the reciprocal of the ridge regression λ — they control the same tradeoff from opposite directions. This unified the SVM and regularised regression traditions: both are solving the bias-variance tradeoff with the same mathematical tool, just expressed differently. SVMs dominated NLP (1998–2010), bioinformatics (2000–2010), and computer vision (2005–2012) before deep learning surpassed them on large-scale tasks.",
        },
        {
            year: "1998 – 2005",
            title: "The SVM Era — Text, Genes, and the Rise of LIBSVM",
            challenge:
                "SVMs were powerful but slow to train on large datasets. The quadratic programming problem grew as O(n³) with the number of training examples, making SVM impractical for datasets with hundreds of thousands of examples — common in text classification (millions of documents) and genomics (tens of thousands of patients).",
            what:
                "Platt (1999) introduced Sequential Minimal Optimisation (SMO): decompose the quadratic programming problem into a sequence of 2-variable subproblems, each solvable analytically. Fan et al. (2005) released LIBSVM — a robust, fast implementation that became the standard. Joachims (1998) showed that linear-kernel SVMs with efficient solvers could train on millions of text documents. Combined with bag-of-words or n-gram features, SVMs achieved state-of-the-art on text classification, spam filtering, and sentiment analysis.",
            impact:
                "The SVM era showed that a well-engineered classical method with solid theoretical foundations could outperform neural networks across most benchmarks — given sufficient data and good features. This was why deep learning's 2012 AlexNet result (Chapter 9) was so shocking: it suggested the domain of feature engineering that had given SVMs their edge could be learned automatically from raw pixels. The bridge between SVMs and deep learning is the next chapter: classical ML's golden age ends in 2001; deep learning's reignition begins in 2006.",
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
            <h2>Finding the widest street between two neighbourhoods</h2>

            <p className="ch-story-intro">
                LeNet-5 (1998, Chapter 7) had shown that CNNs could read digits. But the data and computing power needed to make them competitive didn't exist. While neural networks waited, a completely different approach was reaching its peak — one built not on biology but on geometry and optimisation theory. Vladimir Vapnik's Support Vector Machine became the dominant classification method from 1992 to 2012.
            </p>

            <Analogy label="The problem — drawing the best line">
                Imagine two groups of points on a map: red dots on the east side, blue dots on the west. You want to draw a line separating them. But many lines would work — near the edge of the red area, near the edge of the blue area, or right down the middle. Which is best?
                <br /><br />
                Vapnik's answer: the line with the most empty space on both sides — the <strong>maximum margin</strong>. A line crammed against one group will misclassify new points that arrive near it. A line with a wide buffer zone is more confident and more robust.
            </Analogy>

            <Analogy label="Support vectors — the critical points">
                After you draw the best line, most of the training points could be moved without changing it. Only the points touching the edge of the empty buffer zone matter — if you moved them, the line would shift. Vapnik called these the <strong>support vectors</strong>. Everything else is irrelevant.
                <br /><br />
                This is why SVMs are robust: they ignore the "easy" points and focus entirely on the hardest cases — the ones right at the decision boundary.
            </Analogy>

            <Analogy label="The kernel trick — seeing through walls">
                Some problems can't be separated by any straight line — like a ring of red points surrounding a cluster of blue points. You can't draw a straight line between a ring and its interior.
                <br /><br />
                The kernel trick: add a new feature (e.g., distance from the centre). Now what was a ring on a 2D surface becomes two separate groups in 3D — and a flat plane can separate them. The kernel function computes the similarity between points in this higher-dimensional space <em>without actually computing the coordinates</em>. It's a mathematical shortcut that makes infinite-dimensional features practical.
            </Analogy>

            <Analogy label="What came next — the limits of the margin">
                SVMs were unbeatable on well-engineered features. The catch: you had to design those features yourself — convert pixels into colour histograms, convert text into word counts, convert proteins into amino acid patterns. The year LeNet-5 was published (1998), someone had to manually decide what features to feed the SVM.
                <br /><br />
                That bottleneck — human feature engineering — is what deep neural networks eliminated in 2012. They learned the features automatically from raw data. Chapter 9 tells that story.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Maximum-margin classification and the kernel trick</h2>

            <h3>Hard Margin SVM</h3>
            <p>
                Find the separating hyperplane w·x + b = 0 that maximises the margin (distance between the two class boundaries). Margin = 2/||w||. Equivalently:
            </p>
            <MathBlock tex="\min_{w,b} \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 \;\; \forall i" />
            <p>
                Constraint ensures all points are at least unit distance from the boundary (in the normalised parameterisation). Only feasible when data is linearly separable.
            </p>

            <h3>Soft Margin</h3>
            <MathBlock tex="\min_{w,b,\xi} \frac{1}{2}\|w\|^2 + C\sum_{i=1}^n \xi_i \quad \text{s.t.} \quad y_i(w \cdot x_i + b) \geq 1 - \xi_i,\;\; \xi_i \geq 0" />
            <p>
                Hinge loss: each ξᵢ = max(0, 1 − yᵢ(w·xᵢ+b)). The total loss is ½||w||² + C·Σ max(0, 1−yf(x)) — L2-regularised hinge loss. This is convex and solvable via quadratic programming.
            </p>

            <h3>Dual Formulation and Kernel Trick</h3>
            <p>
                The Lagrangian dual: max Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼ (xᵢ·xⱼ), subject to 0 ≤ αᵢ ≤ C. Only support vectors have αᵢ &gt; 0. Replace xᵢ·xⱼ with K(xᵢ, xⱼ):
            </p>
            <MathBlock tex="K_{\text{RBF}}(x, z) = \exp\!\left(-\gamma\|x - z\|^2\right) \quad \text{(universal approximator)}" />
            <MathBlock tex="K_{\text{poly}}(x, z) = (x \cdot z + c)^d \quad \text{(degree-}d\text{ interactions)}" />
            <p>
                Decision function: f(x) = sign(Σᵢ αᵢ yᵢ K(xᵢ, x) + b). The kernel must satisfy Mercer's condition (be a positive semi-definite function).
            </p>

            <h3>VC Dimension and Generalisation</h3>
            <MathBlock tex="\text{Test error} \leq \text{Train error} + \sqrt{\frac{h(\log(2n/h)+1) - \log(\delta/4)}{n}}" />
            <p>
                where h is the VC dimension (effective model complexity) and n is the training size. Maximising the margin minimises h — hence tighter generalisation bounds regardless of the input dimensionality.
            </p>

            <DefBlock label="SVM vs Logistic Regression — loss function comparison">
                Logistic regression: L = log(1 + exp(−yf(x))) — smooth, penalises all points<br />
                SVM hinge loss: L = max(0, 1 − yf(x)) — zero for correctly classified points beyond margin<br />
                Both + L2 regularisation → similar decision boundaries. SVM is sparser (only support vectors contribute). Logistic gives calibrated probabilities; SVM does not.
            </DefBlock>

            <div className="ch-callout">
                <strong>Bridge to Chapter 9:</strong> SVMs dominated classification from 1992–2012 because human-engineered features (HOG, SIFT, TF-IDF) gave the kernel a good space to work in. AlexNet (2012) showed that features could be learned automatically from raw pixels — eliminating the need for feature engineering and the main advantage SVMs had over neural networks.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────

export const SVM_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: null,
    python: null,
}
