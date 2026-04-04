import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import { KMeansDiagram, ElbowDiagram } from "./diagrams"
import type { TabId } from "../../types"

// ── k-Means Clustering tabs ──────────────────────────────────────────────────

function HistoryTab() {
    const items = [
        {
            year: "1957",
            title: "Stuart Lloyd — Least-Squares Quantisation",
            challenge: "Bell Labs engineers needed a way to compress speech signals for telephone transmission. The challenge was to represent a continuous distribution of voice amplitudes using only a small finite set of codewords, minimising the overall distortion.",
            what: "Stuart Lloyd derived an iterative algorithm for optimal scalar quantisation: alternate between (1) assigning each input value to its nearest codeword and (2) replacing each codeword with the mean of all inputs assigned to it. He noted convergence to a local minimum but did not publish the result until 1982 due to internal Bell Labs review processes.",
            impact: "Lloyd's algorithm is the mathematical foundation of k-means. Every modern implementation of k-means is, in essence, Lloyd's algorithm applied to vector-valued data. The same alternating assignment-update structure appears in dozens of unsupervised learning methods.",
        },
        {
            year: "1967",
            title: "James MacQueen — k-Means Clustering",
            challenge: "Statisticians wanted a practical method to discover natural groupings in multivariate data without assuming any particular distributional form. Gaussian mixture models existed but required specifying the covariance structure and were computationally expensive.",
            what: "MacQueen introduced the term 'k-means' and formalised the algorithm as minimising the total within-cluster sum of squares (WCSS). Unlike Lloyd's offline algorithm, MacQueen's original version updated centroids online — after each new data point — making it suitable for streaming data.",
            impact: "MacQueen's k-means became the most widely used clustering algorithm in the world. Its simplicity and scalability made it the default choice for exploratory data analysis, customer segmentation, image compression, and as a pre-processing step for more complex models.",
        },
        {
            year: "1975",
            title: "Forgy — Hard Assignment & the Algorithm's Modern Form",
            challenge: "MacQueen's online update was hard to parallelise and could produce inconsistent results depending on the order in which data points were presented. A batch version with cleaner convergence guarantees was needed.",
            what: "Edward Forgy independently described the batch version of k-means that is used today: (1) initialise K centroids, (2) assign every point to its nearest centroid, (3) recompute each centroid as the mean of its assigned points, (4) repeat until assignments stabilise. This is the standard form in scikit-learn and virtually every modern library.",
            impact: "Forgy's formulation clarified the objective function being minimised (WCSS) and made the algorithm's convergence properties easier to prove. It is the variant most people mean when they say 'k-means'.",
        },
        {
            year: "2007",
            title: "k-Means++ — Smart Initialisation",
            challenge: "Standard k-means with random initialisation can converge to arbitrarily bad local optima, sometimes producing clusters that are orders of magnitude worse than the optimal partition. This is especially problematic when clusters are well-separated — where the algorithm ought to perform best.",
            what: "Arthur and Vassilvitskii proposed k-means++: instead of choosing all K initial centroids uniformly at random, choose the first centroid uniformly, then choose each subsequent centroid with probability proportional to its squared distance from the nearest already-chosen centroid. This spreads out the initial centroids, reducing the chance of bad convergence.",
            impact: "k-means++ has an O(log K) approximation guarantee for the WCSS objective — the first provably good initialisation strategy. It became the default initialisation in scikit-learn and is now considered the standard. In practice it produces 2–10× better results than random initialisation with negligible overhead.",
        },
    ]

    return (
        <div className="ch3-timeline">
            {items.map((item) => (
                <div key={item.year} className="ch3-tl-item">
                    <div className="ch3-tl-year">{item.year}</div>
                    <div className="ch3-tl-title">{item.title}</div>
                    <div className="ch3-tl-section-label">The challenge</div>
                    <div className="ch3-tl-body">{item.challenge}</div>
                    <div className="ch3-tl-section-label">What was introduced</div>
                    <div className="ch3-tl-body">{item.what}</div>
                    <div className="ch3-tl-section-label">Why it mattered</div>
                    <div className="ch3-tl-body ch3-tl-impact">{item.impact}</div>
                </div>
            ))}
        </div>
    )
}

function KidTab() {
    return (
        <>
            <h2>Sorting things into piles by moving the middle</h2>

            <Analogy label="What k-means does">
                Imagine you have a bag of mixed candy — red, blue, and yellow ones — scattered on a table. You want to sort them into three groups, but nobody told you which group each candy belongs to. <strong>k-means</strong> lets the computer figure it out automatically.
            </Analogy>

            <Analogy label="Step 1 — Place three imaginary flags">
                Start by placing three flags randomly on the table. These flags are your "cluster centres" — the middle of each group.
            </Analogy>

            <DiagramBlock title="k-Means — three clusters with centroids (triangles)">
                <KMeansDiagram />
            </DiagramBlock>

            <Analogy label="Step 2 — Every candy picks its nearest flag">
                Each candy moves to the group whose flag is closest. The red candies cluster around the red flag, blue around the blue, and so on. Candies don't move — they just decide which flag they belong to.
            </Analogy>

            <Analogy label="Step 3 — Move the flags to the middle of their group">
                Now move each flag to the exact middle (the average position) of all the candies that chose it. The flag slides toward the centre of its group.
            </Analogy>

            <Analogy label="Repeat until nothing changes">
                Go back to Step 2, let candies re-choose their nearest flag (some may switch!), then Step 3 again. Keep going until no candy switches groups. The algorithm has found a stable arrangement — that's your clustering.
            </Analogy>

            <Analogy label="How many piles? — The elbow method">
                The tricky part is: how do you know whether to use 3 groups or 5 groups? You can try different numbers and measure how "tight" each cluster is (how close the candies are to their flag). Plot this tightness vs. K and look for an "elbow" — the point where adding more groups stops helping much.
            </Analogy>

            <DiagramBlock title="Elbow method — pick K at the 'bend' in the inertia curve">
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
                where μₖ is the <strong>centroid</strong> (mean) of cluster Cₖ, and ‖·‖² is squared Euclidean distance.
            </p>

            <h3>The Lloyd Algorithm</h3>
            <ol>
                <li><strong>Initialise:</strong> Choose K initial centroids (randomly or via k-means++)</li>
                <li><strong>Assignment step:</strong> Assign each point xᵢ to the nearest centroid: <br />
                    <code>Cₖ = &#123;xᵢ : k = argmin_j ‖xᵢ − μⱼ‖²&#125;</code></li>
                <li><strong>Update step:</strong> Recompute centroids: <code>μₖ = (1/|Cₖ|) Σᵢ∈Cₖ xᵢ</code></li>
                <li><strong>Repeat</strong> steps 2–3 until assignments stop changing</li>
            </ol>

            <h3>Convergence</h3>
            <p>
                Each step either decreases WCSS or leaves it unchanged. Since there are only finitely many partitions of n points into K clusters, the algorithm must converge. However, it converges to a <em>local</em> minimum, not necessarily the global one. Multiple random restarts are standard practice.
            </p>

            <h3>Choosing K — The Elbow Method</h3>
            <p>
                Plot WCSS vs K. WCSS always decreases as K increases (K = n gives WCSS = 0). Look for the "elbow" — the K where the rate of decrease sharply slows. More principled alternatives include the <strong>silhouette score</strong> and the <strong>gap statistic</strong>.
            </p>

            <h3>Assumptions and Limitations</h3>
            <ul>
                <li><strong>Spherical clusters:</strong> Uses Euclidean distance — assumes clusters are roughly spherical and equal-sized</li>
                <li><strong>Hard assignment:</strong> Each point belongs to exactly one cluster</li>
                <li><strong>Sensitive to initialisation:</strong> Different starts can give very different results — use k-means++</li>
                <li><strong>Sensitive to scale:</strong> Always standardise features before running k-means</li>
                <li><strong>Non-convex clusters:</strong> Fails on ring-shaped or moon-shaped clusters — use DBSCAN instead</li>
            </ul>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Formal Framework</h2>

            <DefBlock label="Definition — k-Means Objective">
                Given n observations X = &#123;x₁,...,xₙ&#125; ⊂ ℝᵈ and an integer K, find the partition C = &#123;C₁,...,Cₖ&#125; and centroids μ = &#123;μ₁,...,μₖ&#125; that minimise:
                <br /><br />
                J(C, μ) = Σₖ Σᵢ∈Cₖ ‖xᵢ − μₖ‖²
                <br /><br />
                This is NP-hard in general (even for K=2 in ℝ²), but Lloyd's algorithm provides an efficient local optimisation.
            </DefBlock>

            <h3>Equivalence to Matrix Factorisation</h3>
            <p>
                Define indicator matrix Z ∈ &#123;0,1&#125;ⁿˣᴷ where Zᵢₖ = 1 iff xᵢ ∈ Cₖ. The objective becomes:
            </p>
            <MathBlock tex="\min_{Z, M} \|X - ZM\|_F^2 \quad \text{s.t. } Z \in \{0,1\}^{n \times K},\, Z\mathbf{1} = \mathbf{1}" />
            <p>
                where M ∈ ℝᴷˣᵈ is the matrix of centroids. This connects k-means to matrix factorisation and spectral methods.
            </p>

            <h3>Relationship to Gaussian Mixture Models</h3>
            <p>
                k-Means is the hard-assignment limit of the EM algorithm for GMMs with equal, isotropic covariances (Σₖ = σ²I). As σ² → 0, the soft responsibilities converge to hard 0/1 assignments and the EM updates converge to the Lloyd update steps.
            </p>
            <MathBlock tex="\lim_{\sigma^2 \to 0} r_{nk} = \begin{cases} 1 & k = \arg\min_j \|x_n - \mu_j\|^2 \\ 0 & \text{otherwise} \end{cases}" />

            <h3>k-Means++: Initialisation Guarantee</h3>
            <p>
                Choose the first centroid uniformly from X. For each subsequent centroid, sample xᵢ with probability:
            </p>
            <MathBlock tex="P(\text{choose } x_i) = \frac{D(x_i)^2}{\sum_j D(x_j)^2}" />
            <p>
                where D(xᵢ) = min_&#123;already chosen μ&#125; ‖xᵢ − μ‖ is the distance to the nearest chosen centroid. <strong>Theorem (Arthur & Vassilvitskii 2007):</strong> The expected cost of k-means++ is O(log K) times the optimal cost. This is the only initialisation with a provable approximation guarantee.
            </p>

            <h3>Complexity</h3>
            <p>
                Each iteration is O(nKd) time. In practice, convergence takes O(1)–O(n) iterations depending on the data. Total: O(nKdI) where I is the number of iterations. For large n, mini-batch k-means (Sculley 2010) uses random subsamples of size b per step, reducing per-iteration cost to O(bKd).
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

# ── Generate synthetic data — 3 true clusters ─────────────────────
np.random.seed(42)
centers = [[1.5, 4.7], [4.6, 4.3], [3.1, 1.5]]
X = np.vstack([
    np.random.randn(80, 2) * [0.6, 0.8] + c
    for c in centers
])

# Always standardise before k-means!
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ── Elbow method — find optimal K ─────────────────────────────────
inertias, silhouettes = [], []
ks = range(2, 9)
for k in ks:
    km = KMeans(n_clusters=k, init="k-means++", n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))

# Best K by silhouette
best_k = ks[np.argmax(silhouettes)]
print(f"Best K by silhouette: {best_k}")  # → 3

# ── Fit final model ────────────────────────────────────────────────
km = KMeans(n_clusters=3, init="k-means++", n_init=20, random_state=42)
labels = km.fit_predict(X_scaled)

print(f"Inertia: {km.inertia_:.2f}")
print(f"Silhouette score: {silhouette_score(X_scaled, labels):.3f}")
print(f"Cluster sizes: {np.bincount(labels)}")

# Centroids (back in original scale)
centroids_orig = scaler.inverse_transform(km.cluster_centers_)
print(f"Centroids:\\n{centroids_orig}")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="kmeans.py" lang="python" langLabel="Python" />
            <div className="ch3-callout">
                <strong>Key tips:</strong> Always standardise features — k-means uses Euclidean distance, so a feature with range 0–1000 will dominate one with range 0–1. Use <code>n_init=10</code> (or 20) to run multiple random restarts. <code>silhouette_score</code> measures how well-separated clusters are (range −1 to 1; higher = better separated).
            </div>
        </>
    )
}

const TS_CODE = `// ── k-Means implementation (TypeScript) ──────────────────────────

type Point = number[]

function distance(a: Point, b: Point): number {
  return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0))
}

function mean(points: Point[]): Point {
  const d = points[0].length
  const sum = new Array(d).fill(0)
  for (const p of points) p.forEach((v, i) => { sum[i] += v })
  return sum.map(v => v / points.length)
}

/** Assign each point to its nearest centroid */
function assign(points: Point[], centroids: Point[]): number[] {
  return points.map(p =>
    centroids.reduce(
      (best, c, ci) =>
        distance(p, c) < distance(p, centroids[best]) ? ci : best,
      0
    )
  )
}

export function kMeans(
  data: Point[],
  k: number,
  maxIter = 100
): { labels: number[]; centroids: Point[]; inertia: number } {
  // k-means++ initialisation
  const centroids: Point[] = [data[Math.floor(Math.random() * data.length)]]
  while (centroids.length < k) {
    const dists = data.map(p =>
      Math.min(...centroids.map(c => distance(p, c) ** 2))
    )
    const total = dists.reduce((s, d) => s + d, 0)
    let r = Math.random() * total
    for (let i = 0; i < data.length; i++) {
      r -= dists[i]
      if (r <= 0) { centroids.push(data[i]); break }
    }
  }

  let labels = assign(data, centroids)

  for (let iter = 0; iter < maxIter; iter++) {
    // Update centroids
    for (let ci = 0; ci < k; ci++) {
      const cluster = data.filter((_, i) => labels[i] === ci)
      if (cluster.length > 0) centroids[ci] = mean(cluster)
    }
    const newLabels = assign(data, centroids)
    // Converged?
    if (newLabels.every((l, i) => l === labels[i])) break
    labels = newLabels
  }

  const inertia = data.reduce(
    (sum, p, i) => sum + distance(p, centroids[labels[i]]) ** 2, 0
  )
  return { labels, centroids, inertia }
}

// ── Demo ──────────────────────────────────────────────────────────
const data: Point[] = [
  [1,4],[1.5,5],[2,4.5],[4,4],[5,4.5],[4.5,5],
  [3,1],[3.5,2],[2.5,1.5],[3.8,1.2],
]
const result = kMeans(data, 3)
console.log("Labels:", result.labels)
console.log("Inertia:", result.inertia.toFixed(2))`

function CodeTab() {
    return (
        <>
            <p>
                A complete k-means implementation with k-means++ initialisation. The key insight: the outer loop alternates assignment and centroid update until convergence — this is guaranteed to terminate because there are only finitely many possible assignments.
            </p>
            <CodeBlock code={TS_CODE} filename="kmeans.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch3-callout">
                <strong>Complexity note:</strong> The <code>assign</code> function is O(nK) per call. For large datasets, use a k-d tree (O(n log K) average) or approximate nearest-neighbour structures. For very large K, consider hierarchical k-means or FAISS.
            </div>
        </>
    )
}

export const KMEANS_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
