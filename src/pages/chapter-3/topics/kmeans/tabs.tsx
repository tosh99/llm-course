import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { KMeansDiagram, ElbowDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── k-Means Clustering tabs ──────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1957",
            title: "Stuart Lloyd — Least-Squares Quantisation at Bell Labs",
            challenge: "The year is 1957 — the same year Rosenblatt demonstrated the perceptron. But at Bell Labs, Stuart Lloyd was working on a problem with no labels at all: given a continuous stream of speech amplitudes, how do you represent them compactly using only a small, finite set of codewords? There are no categories to learn from, no right answers to correct toward. The algorithm had to discover structure on its own, minimising the distortion between the original signal and its compressed representation.",
            what: "Lloyd derived an iterative algorithm for optimal scalar quantisation: alternate between (1) assigning each input value to its nearest codeword and (2) replacing each codeword with the mean of all inputs assigned to it. He proved the algorithm converges to a local minimum of the total squared distortion but did not publish the result until 1982, held back by Bell Labs' internal review processes for 25 years.",
            impact: "Lloyd's algorithm is the mathematical foundation of k-means. Every modern implementation of k-means is, in essence, Lloyd's algorithm applied to vector-valued data. The same alternating assignment-update structure appears in dozens of unsupervised learning methods, from vector quantisation in audio codecs to the encoder stage of modern learned image compression systems.",
        },
        {
            year: "1965",
            title: "Edward Forgy — The First Published k-Means Variant",
            challenge: "By the mid-1960s, statisticians were accumulating large multivariate datasets from surveys, biological measurements, and early computing experiments. There was no standard algorithm for partitioning such data into natural groups without first specifying those groups by hand. Clustering was performed manually — plotting data, eyeballing groups, drawing ellipses. This did not scale to high-dimensional data or large sample sizes.",
            what: "Edward Forgy published the batch form of what we now call k-means: (1) choose K initial centroids, (2) assign every point to its nearest centroid, (3) recompute each centroid as the mean of its assigned points, (4) repeat until assignments stabilise. This is the standard form in scikit-learn and virtually every modern library today, preceding MacQueen's formal paper by two years.",
            impact: "Forgy's formulation clarified the objective function being minimised — total within-cluster sum of squares — and made the algorithm's convergence properties easier to study. It separated the two concerns of initialisation and iteration, opening the door to independent improvements on each. The batch update also made the algorithm easier to parallelise than the online variants that followed.",
        },
        {
            year: "1967",
            title: "James MacQueen — Naming 'k-Means' and Online Updates",
            challenge: "Statisticians wanted a practical method to discover natural groupings in multivariate data without assuming any particular distributional form. Gaussian mixture models existed but required specifying the full covariance structure and were computationally expensive on the mainframe hardware of the era. A simpler, parameter-light method was needed — one that could be explained in a few lines and run on a dataset of hundreds of observations in reasonable time.",
            what: "MacQueen introduced the term 'k-means' and formalised the algorithm as minimising the total within-cluster sum of squares. Unlike Forgy's offline batch algorithm, MacQueen's original formulation updated centroids online — after each new data point arrived — making it suitable for streaming data. He proved convergence for the batch case and noted the algorithm's connection to the method of moments for density estimation.",
            impact: "MacQueen's k-means became the most widely used clustering algorithm in the world. Its simplicity and scalability made it the default choice for exploratory data analysis, customer segmentation, image compression, and as a pre-processing step for more complex models. His naming of the algorithm as 'k-means' gave it a stable identity in the literature, distinguishing it from the broader class of vector quantisation methods.",
        },
        {
            year: "1977",
            title: "The Curse of Dimensionality — When k-Means Struggles",
            challenge: "As computers became more powerful through the 1970s, datasets grew in both size and dimensionality. Researchers began applying k-means to data with dozens or hundreds of features — gene expression profiles, spectroscopic measurements, early text representations. The algorithm produced clusters, but those clusters were less and less meaningful as dimensionality increased. Distance ceased to discriminate: in high dimensions, every pair of points is almost equally far apart.",
            what: "Richard Bellman had coined 'the curse of dimensionality' in 1961, but its specific effects on distance-based clustering were worked out through the 1970s and 1980s. In high dimensions, the ratio of the maximum to minimum pairwise distance concentrates around 1 — making the 'nearest centroid' assignment nearly random. Feature selection, PCA pre-processing, and dimensionality reduction became standard prerequisites for k-means in practice.",
            impact: "The curse of dimensionality is why modern ML pipelines almost never run k-means directly on raw high-dimensional data. Instead, a learned low-dimensional representation (autoencoder, PCA, UMAP) is computed first, and k-means is applied in that embedded space. The curse also motivated the Gaussian Mixture Model (GMM) as a more geometrically flexible alternative — our next topic in this chapter.",
        },
        {
            year: "1982",
            title: "Lloyd's 1957 Paper — Finally Published",
            challenge: "The vector quantisation community had been independently re-discovering Lloyd's ideas for 25 years, producing dozens of related algorithms under different names. The lack of a canonical citation created confusion in the literature and prevented researchers from building coherently on each other's work. Bell Labs finally cleared Lloyd's 1957 memo for publication.",
            what: "Lloyd's IEEE Transactions on Information Theory paper appeared 25 years after the original memo, immediately becoming the canonical reference for k-means convergence theory. It formalised the Nearest-Neighbour condition (each input goes to the nearest codeword) and the Centroid condition (each codeword is the mean of its assigned inputs) as the two necessary conditions for a locally optimal partition — now called the Lloyd optimality conditions.",
            impact: "The belated publication unified the vector quantisation and statistics communities around a common framework. The Lloyd optimality conditions became the standard way to describe the fixed-point structure of k-means and its generalisations. They also made the connection to EM explicit: the Nearest-Neighbour condition is the E-step; the Centroid condition is the M-step — both applied in the hard-assignment limit.",
        },
        {
            year: "2007",
            title: "k-Means++ — The First Provably Good Initialisation",
            challenge: "Standard k-means with random initialisation can converge to arbitrarily bad local optima, sometimes producing clusters orders of magnitude worse than the optimal partition. This was especially problematic for well-separated clusters — where the algorithm ought to perform best. Practitioners resorted to multiple random restarts (running the algorithm 10–20 times and keeping the best result), but had no theoretical guarantee on the quality of the result.",
            what: "David Arthur and Sergei Vassilvitskii proposed k-means++: instead of choosing all K initial centroids uniformly at random, choose the first centroid uniformly, then choose each subsequent centroid with probability proportional to its squared distance from the nearest already-chosen centroid. This spreads out the initial centroids, dramatically reducing the chance of degenerate convergence.",
            impact: "k-means++ has an O(log K) approximation guarantee for the WCSS objective — the first provably good initialisation strategy for any clustering algorithm. It became the default initialisation in scikit-learn and is now the standard. In practice it produces 2–10 times better results than random initialisation with negligible computational overhead — a rare case where a theoretical improvement also delivers strong empirical gains.",
        },
    ]

    return (
        <div className="ch-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch-tl-item">
                    <div className="ch-tl-year">{item.year}</div>
                    <div className="ch-tl-title">{item.title}</div>
                    <div className="ch-tl-section-label">The challenge</div>
                    <div className="ch-tl-body">{item.challenge}</div>
                    <div className="ch-tl-section-label">What was introduced</div>
                    <div className="ch-tl-body">{item.what}</div>
                    <div className="ch-tl-section-label">Why it mattered</div>
                    <div className="ch-tl-body ch-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Sorting things into piles by moving the middle</h2>

            <p className="ch-story-intro">
                Chapter 2 ended with the AI Winter: Minsky's 1969 proof that perceptrons couldn't learn XOR froze neural network research for nearly two decades. But there was a completely parallel universe of algorithms — ones that never needed labels to begin with. While the neural network field slept, statisticians and engineers at Bell Labs were building methods for finding structure in unlabeled data. k-Means is the oldest and simplest of them — born in 1957, the same year Rosenblatt built the perceptron, but from a completely different tradition.
            </p>

            <Analogy label="What k-means does">
                Imagine you have a bag of mixed candy — red, blue, and yellow ones — scattered on a table. You want to sort them into three groups, but nobody told you which group each candy belongs to. <strong>k-means</strong> lets the computer figure it out automatically, with no labels, no examples of correct answers — just the positions of the candies on the table.
            </Analogy>

            <Analogy label="Step 1 — Place three imaginary flags">
                Start by placing three flags randomly on the table. These flags are your "cluster centres" — the imaginary middle of each group. At the beginning, their positions are just guesses. They'll move into the right place as the algorithm runs. The number of flags (K) is the only thing you have to decide in advance.
            </Analogy>

            <DiagramBlock title="k-Means — three clusters with centroids (triangles)">
                <KMeansDiagram />
            </DiagramBlock>

            <Analogy label="Step 2 — Every candy picks its nearest flag">
                Each candy looks at all three flags and joins the group whose flag is closest. The red candies cluster around the red flag, blue around the blue, and so on. Candies don't move — they just decide which flag they belong to. This is the assignment step: every point gets a label based purely on distance.
            </Analogy>

            <Analogy label="Step 3 — Move the flags to the middle of their group">
                Now move each flag to the exact geometric middle (the average position) of all the candies that chose it. The flag slides toward the centre of its group. A flag with 30 candies around it moves to the mean of those 30 positions. This is the update step: every centroid becomes the mean of its assigned points — that's where "k-means" gets its name.
            </Analogy>

            <Analogy label="Repeat until nothing changes">
                Go back to Step 2 — let candies re-choose their nearest flag. Some may switch groups! Then Step 3 again — move flags to the new centres. Keep alternating until no candy switches groups on an iteration. The algorithm has found a stable arrangement — a local minimum where no reassignment reduces the total distance from each candy to its flag.
            </Analogy>

            <Analogy label="How many piles? — The elbow method">
                The tricky part is: how do you know whether to use 3 groups or 5 groups? You can try different values of K and measure how "tight" each clustering is — how close the candies are to their flag on average. Plot this tightness (called inertia) versus K. It always decreases as K increases (more groups = tighter groups), but look for the "elbow" — the point where adding more groups stops helping much. That's your K.
            </Analogy>

            <DiagramBlock title="Elbow method — pick K at the bend in the inertia curve">
                <ElbowDiagram />
            </DiagramBlock>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Partitioning data by minimising within-cluster variance</h2>

            <p>
                k-Means partitions n data points into K clusters by minimising the <strong>total within-cluster sum of squares (WCSS)</strong>, also called <em>inertia</em>:
            </p>
            <MathBlock tex="\text{WCSS} = \sum_{k=1}^K \sum_{x_i \in C_k} \|x_i - \mu_k\|^2" />
            <p>
                where <strong>&mu;</strong><sub>k</sub> is the centroid (mean) of cluster C<sub>k</sub> and &Vert;&middot;&Vert;<sup>2</sup> is squared Euclidean distance. This is a combinatorial optimisation problem — NP-hard in general — but the Lloyd algorithm solves it efficiently to a local minimum.
            </p>

            <h3>The Lloyd Algorithm</h3>
            <ol>
                <li><strong>Initialise:</strong> Choose K initial centroids, either randomly or via k-means++</li>
                <li><strong>Assignment step:</strong> Assign each point x<sub>i</sub> to its nearest centroid:
                    C<sub>k</sub> = &#123;x<sub>i</sub> : k = argmin<sub>j</sub> &Vert;x<sub>i</sub> &minus; &mu;<sub>j</sub>&Vert;<sup>2</sup>&#125;</li>
                <li><strong>Update step:</strong> Recompute each centroid as the mean of its assigned points</li>
                <li><strong>Repeat</strong> steps 2–3 until assignments stop changing</li>
            </ol>

            <h3>Convergence Guarantee</h3>
            <p>
                Each iteration either strictly decreases WCSS or leaves it unchanged. Since there are only finitely many partitions of n points into K clusters, the algorithm must terminate in finite steps. However, it converges to a <em>local</em> minimum — not necessarily the global one. Running with multiple random restarts and keeping the best result is standard practice. k-means++ initialisation dramatically reduces the probability of bad convergence.
            </p>

            <h3>Choosing K — Elbow Method and Silhouette Score</h3>
            <p>
                WCSS always decreases as K increases (K = n gives WCSS = 0). The elbow method plots WCSS versus K and looks for the inflection point. More principled alternatives include the <strong>silhouette score</strong> — which measures how much closer each point is to its own centroid vs the next nearest — and the <strong>gap statistic</strong>, which compares WCSS to that of a null reference distribution.
            </p>

            <h3>Assumptions and Limitations</h3>
            <ul>
                <li><strong>Spherical clusters:</strong> Uses Euclidean distance — assumes clusters are roughly spherical and equal-sized</li>
                <li><strong>Hard assignment:</strong> Each point belongs to exactly one cluster (see GMM for soft assignments)</li>
                <li><strong>Sensitive to initialisation:</strong> Different random starts can give very different results — always use k-means++</li>
                <li><strong>Sensitive to scale:</strong> Standardise all features before running k-means</li>
                <li><strong>Non-convex clusters:</strong> Fails on ring-shaped or crescent-shaped clusters — use DBSCAN or spectral clustering</li>
                <li><strong>Curse of dimensionality:</strong> In high dimensions, Euclidean distance concentrates — apply PCA or UMAP first</li>
            </ul>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>Connection to the EM algorithm:</strong> k-Means is the hard-assignment limit of EM applied to Gaussian Mixture Models with equal spherical covariances (&Sigma;<sub>k</sub> = &sigma;<sup>2</sup>I). As &sigma;<sup>2</sup> &rarr; 0, the soft responsibilities (posterior probabilities) collapse to hard 0/1 assignments, and the EM update equations become the Lloyd assignment and centroid update steps. GMMs — covered in the next topic — are the natural soft generalisation of k-means.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Formal derivations · proofs</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Implementation · NumPy · scikit-learn</span>
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
            <h2>Formal Framework</h2>

            <DefBlock label="Definition — k-Means Objective">
                Given n observations X = &#123;x&#8321;,...,x&#8345;&#125; &sub; &#8477;<sup>d</sup> and an integer K, find the partition
                C = &#123;C&#8321;,...,C&#8342;&#125; and centroids &mu; = &#123;&mu;&#8321;,...,&mu;&#8342;&#125; minimising:
                <br /><br />
                J(C, &mu;) = &sum;<sub>k</sub> &sum;<sub>i&isin;C<sub>k</sub></sub> &Vert;x<sub>i</sub> &minus; &mu;<sub>k</sub>&Vert;<sup>2</sup>
                <br /><br />
                This is NP-hard in general (even for K = 2 in &#8477;<sup>2</sup>), but Lloyd's algorithm provides an efficient local optimisation.
            </DefBlock>

            <h3>Equivalence to Matrix Factorisation</h3>
            <p>
                Define indicator matrix Z &isin; &#123;0,1&#125;<sup>n&times;K</sup> where Z<sub>ik</sub> = 1 iff x<sub>i</sub> &isin; C<sub>k</sub>. The objective becomes:
            </p>
            <MathBlock tex="\min_{Z,\, M} \|X - ZM\|_F^2 \quad \text{s.t. } Z \in \{0,1\}^{n \times K},\; Z\mathbf{1} = \mathbf{1}" />
            <p>
                where M &isin; &#8477;<sup>K&times;d</sup> is the matrix of centroids. This connects k-means to matrix factorisation and spectral methods. Non-negative matrix factorisation (NMF) is a related relaxation that allows soft assignments.
            </p>

            <h3>Relationship to Gaussian Mixture Models</h3>
            <p>
                k-Means is the hard-assignment limit of the EM algorithm for GMMs with equal, isotropic covariances &Sigma;<sub>k</sub> = &sigma;<sup>2</sup>I. As &sigma;<sup>2</sup> &rarr; 0:
            </p>
            <MathBlock tex="\lim_{\sigma^2 \to 0} r_{nk} = \begin{cases} 1 & k = \arg\min_j \|x_n - \mu_j\|^2 \\ 0 & \text{otherwise} \end{cases}" />
            <p>
                The soft responsibilities r<sub>nk</sub> collapse to hard 0/1 assignments, and the EM update equations collapse to the Lloyd assignment and centroid update steps.
            </p>

            <h3>k-Means++ Initialisation Guarantee</h3>
            <p>
                Choose the first centroid uniformly from X. For each subsequent centroid, sample x<sub>i</sub> with probability proportional to its squared distance from the nearest already-chosen centroid:
            </p>
            <MathBlock tex="P(\text{choose } x_i) = \frac{D(x_i)^2}{\sum_j D(x_j)^2}" />
            <p>
                <strong>Theorem (Arthur &amp; Vassilvitskii 2007):</strong> The expected WCSS of k-means++ initialisation followed by Lloyd's algorithm satisfies E[WCSS] &le; 8(ln K + 2) &middot; OPT, where OPT is the globally optimal WCSS. This O(log K) approximation guarantee is the only provably good initialisation result for any clustering algorithm.
            </p>

            <h3>Complexity Analysis</h3>
            <p>
                Each Lloyd iteration costs O(nKd): n points, K centroids, d dimensions. Convergence typically occurs in O(1)–O(n) iterations. Total worst-case: O(nKdI) where I is iteration count. For large n, mini-batch k-means (Sculley 2010) uses random subsamples of size b per step, reducing per-iteration cost to O(bKd) and enabling online updates — trading a small loss in solution quality for a large gain in speed.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# ── Generate synthetic data — 3 true clusters ─────────────────────
np.random.seed(42)
centers = [[1.5, 4.7], [4.6, 4.3], [3.1, 1.5]]
X = np.vstack([
    np.random.randn(80, 2) * [0.6, 0.8] + c
    for c in centers
])

# Always standardise before k-means!
# k-means uses Euclidean distance — unscaled features dominate.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Elbow method + silhouette — find optimal K ────────────────────
inertias, silhouettes = [], []
ks = range(2, 9)
for k in ks:
    km = KMeans(n_clusters=k, init="k-means++", n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))

best_k = list(ks)[np.argmax(silhouettes)]
print(f"Best K by silhouette: {best_k}")  # -> 3

# ── Fit final model ────────────────────────────────────────────────
km = KMeans(n_clusters=3, init="k-means++", n_init=20, random_state=42)
labels = km.fit_predict(X_scaled)

print(f"Inertia:          {km.inertia_:.2f}")
print(f"Silhouette score: {silhouette_score(X_scaled, labels):.3f}")
print(f"Cluster sizes:    {np.bincount(labels)}")
print(f"Iterations:       {km.n_iter_}")

# Centroids back in original scale
centroids_orig = scaler.inverse_transform(km.cluster_centers_)
print(f"Centroids (original scale):\\n{centroids_orig.round(2)")

# ── NumPy from-scratch implementation ─────────────────────────────
def kmeans_np(X, K, n_init=10, max_iter=300, tol=1e-4, seed=0):
    rng = np.random.default_rng(seed)
    best_wcss, best_labels, best_centers = np.inf, None, None

    for _ in range(n_init):
        # k-means++ initialisation
        idx = [rng.integers(len(X))]
        for __ in range(K - 1):
            D2 = np.min(np.sum((X - X[idx, None]) ** 2, axis=-1), axis=0)
            idx.append(rng.choice(len(X), p=D2 / D2.sum()))
        centers = X[idx].copy()

        for ___ in range(max_iter):
            # Assignment step
            dists = np.sum((X[:, None] - centers[None]) ** 2, axis=2)
            labels = np.argmin(dists, axis=1)
            # Update step
            new_centers = np.array([X[labels == k].mean(axis=0) for k in range(K)])
            if np.max(np.linalg.norm(new_centers - centers, axis=1)) < tol:
                break
            centers = new_centers

        wcss = sum(np.sum((X[labels == k] - centers[k]) ** 2) for k in range(K))
        if wcss < best_wcss:
            best_wcss, best_labels, best_centers = wcss, labels, centers

    return best_labels, best_centers, best_wcss

labels_np, centers_np, wcss_np = kmeans_np(X_scaled, K=3)
print(f"NumPy WCSS: {wcss_np:.2f}")  # matches sklearn`

function PythonContent() {
    return (
        <>
            <p>
                The code below demonstrates k-means with scikit-learn (using k-means++ initialisation and the silhouette score for model selection) alongside a NumPy from-scratch implementation of the full Lloyd algorithm with k-means++ initialisation and multiple restarts.
            </p>
            <CodeBlock code={PY_CODE} filename="kmeans.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key tips:</strong> Always standardise features before k-means — a feature with range 0–1000 will dominate one with range 0–1. Use <code>n_init=10</code> or higher to run multiple random restarts and keep the best result. The silhouette score (range &minus;1 to 1, higher is better) is a more reliable model-selection criterion than the elbow method, which requires subjective judgment about where the "bend" is.
            </div>
        </>
    )
}


export const KMEANS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
