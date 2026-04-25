import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Hierarchical Clustering tabs ─────────────────────────────────────────────

/** Dendrogram SVG */
function DendrogramDiagram() {
    const w = 480, h = 210
    const leaves = ["A","B","C","D","E","F","G","H"]
    const lx = leaves.map((_, i) => 44 + i * 50)
    const ly = 185

    type Node = { x: number; topY: number }
    const nodes: Node[] = lx.map(x => ({ x, topY: ly }))

    interface Merge { l: Node; r: Node; h: number }
    const merges: Merge[] = []
    const y = (h: number) => ly - h * 1.45

    function merge(l: Node, r: Node, height: number): Node {
        merges.push({ l, r, h: height })
        return { x: (l.x + r.x) / 2, topY: y(height) }
    }

    const ab  = merge(nodes[0], nodes[1], 22)
    const cd  = merge(nodes[2], nodes[3], 18)
    const ef  = merge(nodes[4], nodes[5], 15)
    const gh  = merge(nodes[6], nodes[7], 28)
    const abcd = merge(ab, cd, 50)
    const efgh = merge(ef, gh, 42)
    merge(abcd, efgh, 90)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="ch-diagram-svg">
            <rect width={w} height={h} fill="#0f0f14" rx="4" />
            <text x={12} y={14} fill="#3a3a50" fontSize="5.5" fontFamily="JetBrains Mono,monospace" letterSpacing="1">DENDROGRAM — AGGLOMERATIVE CLUSTERING</text>

            <line x1={24} y1={ly} x2={24} y2={20} stroke="#252535" strokeWidth="1" />
            {[0,25,50,75].map(v => {
                const vy = y(v)
                return (
                    <g key={v}>
                        <line x1={20} y1={vy} x2={28} y2={vy} stroke="#3a3a50" strokeWidth="1" />
                        <text x={18} y={vy+3} textAnchor="end" fill="#3a3a50"
                            fontSize="4.5" fontFamily="JetBrains Mono,monospace">{v}</text>
                    </g>
                )
            })}
            <text x={12} y={100} fill="#3a3a50" fontSize="4.5"
                fontFamily="JetBrains Mono,monospace" transform="rotate(-90,12,100)">Distance</text>

            {merges.map((m, i) => {
                const top = y(m.h)
                return (
                    <g key={i}>
                        <line x1={m.l.x} y1={top} x2={m.r.x} y2={top}
                            stroke="#e8a838" strokeWidth={i === merges.length - 1 ? 2 : 1.5} opacity={0.6 + i*0.06} />
                        <line x1={m.l.x} y1={m.l.topY} x2={m.l.x} y2={top}
                            stroke="#e8a838" strokeWidth={1.5} opacity={0.5} />
                        <line x1={m.r.x} y1={m.r.topY} x2={m.r.x} y2={top}
                            stroke="#e8a838" strokeWidth={1.5} opacity={0.5} />
                    </g>
                )
            })}

            {leaves.map((label, i) => (
                <g key={label}>
                    <circle cx={lx[i]} cy={ly} r="4" fill="#5a9ab9" opacity="0.7" />
                    <text x={lx[i]} y={ly+13} textAnchor="middle" fill="#8e8a82"
                        fontSize="7" fontFamily="JetBrains Mono,monospace">{label}</text>
                </g>
            ))}

            <line x1={30} y1={y(35)} x2={w-10} y2={y(35)}
                stroke="#9b7fc7" strokeWidth="1.2" strokeDasharray="6,4" />
            <text x={w-8} y={y(35)-4} textAnchor="end" fill="#9b7fc7"
                fontSize="5.5" fontFamily="JetBrains Mono,monospace">cut &#x2192; 4 clusters</text>
        </svg>
    )
}

function HistoryTab() {
    const items = [
        {
            year: "1958",
            title: "Sokal &amp; Michener — Numerical Taxonomy and the Dendrogram",
            challenge: "Biologists of the 1950s classified organisms through subjective expert judgment — a curator's trained eye assigned species to families and orders. This process was irreproducible between institutions and impossible to automate as specimen collections grew into the millions. Social scientists faced the same problem with survey respondents and cultural groups: hierarchies of similarity existed in the data, but no systematic method extracted them.",
            what: "Robert Sokal and Peter Michener formalised numerical taxonomy — the practice of building taxonomic hierarchies entirely from quantitative measurements of specimens' traits. Their 1958 paper introduced the dendrogram as the standard output representation: a binary tree whose leaves are individual specimens, whose internal nodes are cluster merges, and whose branch heights encode the distance at which groups were joined. They introduced average linkage and the cophenetic correlation coefficient to evaluate how faithfully a dendrogram represented pairwise distances.",
            impact: "The dendrogram became the canonical visualisation for hierarchical relationships across biology, genetics, linguistics, and social science. The cophenetic correlation is still used to compare linkage methods and validate tree quality. Sokal and Michener's numerical taxonomy tradition seeded the entire field of computational phylogenetics, which today reconstructs evolutionary trees from genomic sequences using extensions of their framework.",
        },
        {
            year: "1963",
            title: "Ward — Minimum Variance Criterion",
            challenge: "Single and complete linkage had been used since the 1950s, but both had well-known pathologies. Single linkage produced long, chain-like clusters that violated users' intuitions about natural groupings. Complete linkage was sensitive to outliers — a single distant point could prevent two large, well-separated clusters from merging until late in the hierarchy. Social scientists and psychometricians needed a linkage criterion that produced compact, interpretable clusters aligned with the structure statisticians cared about.",
            what: "Joe Ward proposed an agglomerative method that at each step merged the two clusters whose union minimised the total within-cluster sum of squares — equivalently, the increase in WCSS caused by the merge. Ward's criterion explicitly optimises a statistical objective (variance minimisation) at every step, not just a pairwise distance. This connects hierarchical clustering directly to k-means: Ward's linkage is the hierarchical analogue of k-means, applied greedily top-down through the merge sequence.",
            impact: "Ward's linkage remains the most widely used agglomerative method in practice. Its statistical foundation makes it interpretable, and it consistently produces compact, roughly equal-sized clusters that match human intuition better than other linkage criteria. It is the default linkage in most statistics software and the recommended starting point for biological and social science applications.",
        },
        {
            year: "1967",
            title: "Lance &amp; Williams — A Unifying Update Formula",
            challenge: "By the mid-1960s, at least five different linkage criteria existed (single, complete, average, Ward, median), each with a separate distance update rule. When two clusters merged, each method had its own formula for computing the distance from the merged cluster to all other clusters. Implementing and comparing these methods required separate codebases, and deriving new linkage criteria required rederiving the update formulas from scratch.",
            what: "G.N. Lance and W.T. Williams published a recurrence that unified all known linkage criteria under a single parametric update formula. After merging clusters C<sub>i</sub> and C<sub>j</sub> into C<sub>ij</sub>, the distance to any other cluster C<sub>k</sub> is computed as a weighted combination of the three pairwise distances. Different choices of four scalar parameters (&alpha;<sub>i</sub>, &alpha;<sub>j</sub>, &beta;, &gamma;) recover each linkage criterion exactly. New criteria could be designed by choosing new parameter values.",
            impact: "The Lance-Williams formula enabled a single, general implementation of all agglomerative methods. It is the basis of the linkage computation in scipy, R's hclust, and virtually every modern hierarchical clustering library. The unification also made it possible to study linkage criteria theoretically — comparing their statistical properties in a common framework — and led directly to Ward's criterion being expressible as a Lance-Williams instance.",
        },
        {
            year: "1973 / 1977",
            title: "SLINK and CLINK — Optimal O(n²) Algorithms",
            challenge: "Naïve agglomerative clustering required O(n³) time and O(n²) space — computing and updating an n×n distance matrix after every merge. As gene expression profiling began producing datasets with thousands of samples in the early 1970s, O(n³) became prohibitive. A dataset of 2,000 samples required 8 billion operations — impossible on the hardware of the era.",
            what: "Sibson (1973) derived SLINK: an O(n²) time, O(n) space algorithm for exact single-linkage clustering. It processes data in a single pass, maintaining a compact pointer representation of the dendrogram rather than an explicit distance matrix. Defays (1977) derived CLINK, the equivalent for complete-linkage. Both algorithms process each new point by incrementally updating the dendrogram structure rather than recomputing all distances.",
            impact: "SLINK and CLINK made hierarchical clustering practical for the gene expression revolution of the 1980s and 1990s. Modern implementations in scipy and R use these or equivalent algorithms, allowing hierarchical clustering of tens of thousands of genes in seconds on modern hardware. The pointer-representation idea in SLINK directly influenced the union-find data structure used in network analysis and graph algorithms.",
        },
        {
            year: "1990s–2000s",
            title: "Bioinformatics — Hierarchical Clustering as the Standard Tool",
            challenge: "Gene microarray experiments in the 1990s produced expression profiles for thousands of genes across dozens of experimental conditions — dense matrices of continuous measurements. Researchers needed to discover which genes were co-regulated (expressed together) and which experimental conditions were similar. No algorithm was well-suited to this task except hierarchical clustering, whose dendrogram output allowed visualisation at multiple resolutions.",
            what: "Eisen et al. (1998) published 'Cluster and TreeView' — a software implementation of hierarchical clustering specifically designed for gene expression data, visualising the dendrogram alongside a heat map of expression values. This paper (one of the most-cited biology papers of the decade) popularised Ward's linkage and average linkage for genomics, and the heat map + dendrogram visualisation became the standard figure in gene expression papers.",
            impact: "Hierarchical clustering is still the dominant method for initial exploration of genomic data. The heat map + dendrogram figure appears in thousands of biology papers annually. Modern bioinformatics tools (seurat, scanpy) use hierarchical clustering for cell type identification in single-cell RNA sequencing, with datasets of hundreds of thousands of cells. The scalability challenge motivated approximate methods such as BIRCH and scalable Ward linkage algorithms.",
        },
        {
            year: "2010s",
            title: "Scalable Hierarchical Clustering — Approximate and Online Methods",
            challenge: "Standard agglomerative algorithms scale at best O(n² log n) — infeasible for the internet-scale datasets of the 2010s. Social network analysis, web-scale document clustering, and point-cloud segmentation for autonomous vehicles required clustering millions or billions of points. A completely new algorithmic approach was needed.",
            what: "Researchers developed several scalable variants: BIRCH (1996) builds a compact Clustering Feature tree as data arrives, enabling online agglomerative clustering in O(n) time. Approximate nearest-neighbour methods (using locality-sensitive hashing or k-d trees) reduced the cost of finding merge candidates. HDBSCAN (2013) extended single-linkage clustering with a density-aware measure and automatic cluster extraction, enabling robust hierarchical clustering of noisy data.",
            impact: "Modern scalable hierarchical methods run on datasets of millions of points in minutes. HDBSCAN in particular has become a default tool for exploratory data analysis in Python (available in sklearn from version 1.3), combining the dendrogram's resolution-free output with the noise-robustness of density-based methods. These developments ensured hierarchical clustering remained competitive with flat methods despite the computational challenge of large datasets.",
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
            <h2>Building a family tree of similar things</h2>

            <Analogy label="The basic idea">
                Imagine you have a pile of animals — dogs, cats, wolves, and lions. You want to group them, but you also want a record of <em>how</em> they were grouped. <strong>Hierarchical clustering</strong> builds a family tree: first pair the two most similar animals, then pair the most similar pairs, and keep going until everything is in one big group. The result is a tree diagram called a <strong>dendrogram</strong> — and unlike k-means, you don't have to decide how many groups you want in advance.
            </Analogy>

            <DiagramBlock title="Dendrogram — the merge tree with a cut for K=4 clusters">
                <DendrogramDiagram />
            </DiagramBlock>

            <Analogy label="Bottom-up (agglomerative) — starting from individuals">
                Start with every animal in its own group (n groups for n animals). Find the two most similar animals and put them in the same group. Now find the two most similar groups and merge them. Repeat until you have one group containing everyone. This creates the dendrogram — a tree you can read at any level of resolution. It is the bottom-up approach: start with individuals, build up to the whole.
            </Analogy>

            <Analogy label="How do you measure similarity between groups?">
                When you're merging individual animals, "nearest" is easy — just compare them directly. But when you're merging groups, what does "nearest" mean? Different answers give different algorithms:
                <br /><br />
                <strong>Single linkage:</strong> Distance between groups = distance between their two closest members. Fast but produces long chain-like groups.<br />
                <strong>Complete linkage:</strong> Distance = distance between their two furthest members. Produces compact groups but is sensitive to outliers.<br />
                <strong>Ward's method:</strong> Merge the two groups that cause the smallest increase in total spread (variance). Usually the best default.
            </Analogy>

            <Analogy label="Choosing where to cut the tree">
                The dendrogram gives you a hierarchy — not a fixed number of clusters. To extract K clusters, draw a horizontal line across the dendrogram. Where the line crosses branches, those are your K groups. Draw the line high: you get a few large groups. Draw it low: you get many small groups. The tree lets you explore structure at every resolution without re-running the algorithm.
            </Analogy>

            <Analogy label="When is hierarchical clustering better than k-means?">
                k-Means requires you to choose K before you start, and it always produces round, blob-shaped groups. Hierarchical clustering gives you the whole family tree — you can choose K afterwards by inspecting the dendrogram. It also handles non-spherical shapes better. The downside: for very large datasets (millions of points), it is much slower than k-means.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Agglomerative clustering and linkage criteria</h2>

            <p>
                Hierarchical clustering builds a <strong>dendrogram</strong> — a binary tree whose leaves are individual data points and whose internal nodes represent cluster merges at a given distance. To extract a flat clustering of K groups, cut the dendrogram at a height that yields K connected components.
            </p>

            <h3>Agglomerative Algorithm</h3>
            <ol>
                <li>Start: n clusters, one point each</li>
                <li>Compute the n&times;n distance matrix D (usually Euclidean)</li>
                <li>Find the pair (i, j) with minimum inter-cluster distance d(C<sub>i</sub>, C<sub>j</sub>)</li>
                <li>Merge C<sub>i</sub> and C<sub>j</sub> into a new cluster C<sub>ij</sub></li>
                <li>Update D using the Lance-Williams formula; remove rows/cols i and j, add ij</li>
                <li>Repeat from step 3 until one cluster remains</li>
            </ol>

            <h3>Linkage Criteria — Measuring Inter-Cluster Distance</h3>
            <MathBlock tex="\text{Single:}\quad d(C_i, C_j) = \min_{a \in C_i,\, b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Complete:}\quad d(C_i, C_j) = \max_{a \in C_i,\, b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Average (UPGMA):}\quad d(C_i, C_j) = \frac{1}{|C_i||C_j|} \sum_{a \in C_i} \sum_{b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Ward:}\quad \Delta(C_i, C_j) = \frac{|C_i||C_j|}{|C_i|+|C_j|} \|\mu_i - \mu_j\|^2" />

            <h3>Lance-Williams Unifying Formula</h3>
            <p>
                After merging C<sub>i</sub> and C<sub>j</sub> into C<sub>ij</sub>, the distance to any other cluster C<sub>k</sub> is:
            </p>
            <MathBlock tex="d(C_{ij}, C_k) = \alpha_i\,d(C_i,C_k) + \alpha_j\,d(C_j,C_k) + \beta\,d(C_i,C_j) + \gamma\,|d(C_i,C_k) - d(C_j,C_k)|" />
            <p>
                Different parameter choices (&alpha;<sub>i</sub>, &alpha;<sub>j</sub>, &beta;, &gamma;) recover all standard linkage criteria. Ward's linkage: &alpha;<sub>i</sub> = (n<sub>i</sub>+n<sub>k</sub>)/(n<sub>i</sub>+n<sub>j</sub>+n<sub>k</sub>), &alpha;<sub>j</sub> = (n<sub>j</sub>+n<sub>k</sub>)/(n<sub>i</sub>+n<sub>j</sub>+n<sub>k</sub>), &beta; = &minus;n<sub>k</sub>/(n<sub>i</sub>+n<sub>j</sub>+n<sub>k</sub>), &gamma; = 0.
            </p>

            <h3>Comparing Linkage Criteria</h3>
            <ul>
                <li><strong>Single:</strong> Finds elongated, chain-like clusters. Prone to "chaining" — one outlier can bridge two distinct groups.</li>
                <li><strong>Complete:</strong> Produces compact, spherical clusters. Sensitive to outliers — one distant point inflates the inter-cluster distance.</li>
                <li><strong>Average:</strong> Compromise between single and complete. Standard in phylogenetics (UPGMA).</li>
                <li><strong>Ward:</strong> Minimises within-cluster variance at each merge. Generally the best default for compact, interpretable clusters.</li>
            </ul>

            <h3>Complexity</h3>
            <p>
                Naïve implementation: O(n<sup>3</sup>) time, O(n<sup>2</sup>) space. SLINK/CLINK: O(n<sup>2</sup>) time, O(n) space. For n = 10,000 points, even O(n<sup>2</sup>) takes minutes — use approximate methods (BIRCH, HDBSCAN) or subsample for large datasets.
            </p>

            <hr className="ch-sep" />

            <div className="ch-callout">
                <strong>When to use hierarchical vs k-means:</strong> Use hierarchical clustering when you need to explore structure at multiple resolutions (the dendrogram lets you pick K after fitting), when you have no prior idea how many clusters to expect, or when cluster shape is non-spherical (single linkage handles chains; Ward handles compact blobs). For n &gt; 10,000 points, prefer k-means or mini-batch variants — hierarchical clustering's O(n<sup>2</sup>) cost becomes prohibitive.
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
                    <span className="ch-expandable-desc">Implementation · NumPy · scipy</span>
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
            <h2>Lance-Williams Update Formula and Ultrametric Properties</h2>

            <DefBlock label="Lance-Williams Recurrence">
                After merging clusters C<sub>i</sub> and C<sub>j</sub> into C<sub>ij</sub>, the distance from any other cluster C<sub>k</sub> to the merged cluster is:
                <br /><br />
                d(C<sub>ij</sub>, C<sub>k</sub>) = &alpha;<sub>i</sub>&middot;d(C<sub>i</sub>,C<sub>k</sub>) + &alpha;<sub>j</sub>&middot;d(C<sub>j</sub>,C<sub>k</sub>) + &beta;&middot;d(C<sub>i</sub>,C<sub>j</sub>) + &gamma;&middot;|d(C<sub>i</sub>,C<sub>k</sub>) &minus; d(C<sub>j</sub>,C<sub>k</sub>)|
                <br /><br />
                Different choices of (&alpha;<sub>i</sub>, &alpha;<sub>j</sub>, &beta;, &gamma;) recover every standard linkage criterion, enabling a single general implementation.
            </DefBlock>

            <h3>Ward's Linkage — Full Derivation</h3>
            <p>
                Ward's merge criterion is the increase in total within-cluster sum of squares:
            </p>
            <MathBlock tex="\Delta(C_i, C_j) = \frac{|C_i||C_j|}{|C_i|+|C_j|}\|\mu_i - \mu_j\|^2" />
            <p>
                For Ward's Lance-Williams parameters with cluster sizes n<sub>i</sub>, n<sub>j</sub>, n<sub>k</sub>:
            </p>
            <MathBlock tex="\alpha_i = \frac{n_i + n_k}{n_i + n_j + n_k},\quad \alpha_j = \frac{n_j + n_k}{n_i + n_j + n_k},\quad \beta = \frac{-n_k}{n_i + n_j + n_k},\quad \gamma = 0" />

            <h3>Ultrametric Property</h3>
            <p>
                The merge heights in a dendrogram form an <strong>ultrametric</strong> — a distance function satisfying the strengthened triangle inequality:
            </p>
            <MathBlock tex="d(x, z) \leq \max\bigl(d(x, y),\; d(y, z)\bigr) \quad \forall\, x, y, z" />
            <p>
                This is strictly stronger than the ordinary triangle inequality (which uses sum, not max). Every dendrogram defines an ultrametric on its leaf set, and conversely every ultrametric corresponds to a unique dendrogram. This is the mathematical reason a dendrogram is a valid hierarchical representation of any pairwise distance matrix.
            </p>

            <h3>Cophenetic Correlation</h3>
            <p>
                The quality of a dendrogram is measured by comparing dendrogram distances to original pairwise distances. The <strong>cophenetic distance</strong> c(x<sub>i</sub>, x<sub>j</sub>) is the height at which x<sub>i</sub> and x<sub>j</sub> are first in the same cluster. The cophenetic correlation r<sub>c</sub> is the Pearson correlation between the n(n&minus;1)/2 pairwise distances and the cophenetic distances:
            </p>
            <MathBlock tex="r_c = \frac{\sum_{i<j}(d_{ij} - \bar{d})(c_{ij} - \bar{c})}{\sqrt{\sum_{i<j}(d_{ij}-\bar{d})^2 \cdot \sum_{i<j}(c_{ij}-\bar{c})^2}}" />
            <p>
                r<sub>c</sub> &gt; 0.75 indicates a good dendrogram. r<sub>c</sub> &lt; 0.6 suggests the chosen linkage poorly represents the data's geometry. Single linkage typically achieves the highest cophenetic correlation; Ward's linkage may score lower but produce more interpretable clusters.
            </p>

            <h3>Equivalence to k-Means (Greedy Limit)</h3>
            <p>
                Ward's agglomerative clustering is the greedy bottom-up version of k-means partitioning. At each step, Ward merges the two clusters whose union increases WCSS by the minimum amount — the greedy inverse of k-means' assignment step. The difference: k-means globally optimises WCSS for a fixed K; Ward's method makes locally optimal merge decisions without global coordination. For well-separated clusters, both converge to similar partitions.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster, cophenet
from scipy.spatial.distance import pdist
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler

# ── Generate data ──────────────────────────────────────────────────
X, y_true = make_blobs(n_samples=80, centers=4, random_state=42)
X = StandardScaler().fit_transform(X)

# ── Compute linkage matrix ─────────────────────────────────────────
# pdist returns the condensed distance matrix: n*(n-1)/2 values
dists = pdist(X, metric="euclidean")

# linkage method: "ward", "complete", "average", "single"
Z = linkage(dists, method="ward")
# Z is shape (n-1, 4):
#   Z[i] = [left_cluster, right_cluster, merge_distance, cluster_size]

# ── Extract flat clusters ──────────────────────────────────────────
# Option 1: cut at a distance threshold
labels_h = fcluster(Z, t=3.0, criterion="distance")

# Option 2: specify exactly K clusters
labels_k = fcluster(Z, t=4, criterion="maxclust")
print(f"Cluster sizes (k=4): {np.bincount(labels_k)}")

# ── Cophenetic correlation ─────────────────────────────────────────
c, coph_dists = cophenet(Z, dists)
print(f"Cophenetic correlation: {c:.3f}")  # > 0.75 is good

# ── Compare linkage methods ────────────────────────────────────────
for method in ["ward", "complete", "average", "single"]:
    Z_m = linkage(dists, method=method)
    c_m, _ = cophenet(Z_m, dists)
    labels_m = fcluster(Z_m, t=4, criterion="maxclust")
    # Adjusted Rand Index measures agreement with true labels
    from sklearn.metrics import adjusted_rand_score
    ari = adjusted_rand_score(y_true, labels_m)
    print(f"{method:10s}: cophenetic={c_m:.3f}, ARI={ari:.3f}")

# ── Plot dendrogram (uncomment to display) ────────────────────────
# import matplotlib.pyplot as plt
# plt.figure(figsize=(10, 4))
# dendrogram(Z, truncate_mode="level", p=4, leaf_rotation=90)
# plt.title("Ward Linkage Dendrogram")
# plt.xlabel("Sample index or (cluster size)")
# plt.ylabel("Ward distance")
# plt.tight_layout()
# plt.savefig("dendrogram.png", dpi=150)`

function PythonContent() {
    return (
        <>
            <p>
                The code uses scipy's hierarchical clustering, which implements the Lance-Williams update formula internally for all linkage methods. The adjusted Rand index compares clustering quality against ground truth labels.
            </p>
            <CodeBlock code={PY_CODE} filename="hierarchical.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Practical choice:</strong> Start with Ward's linkage — it minimises within-cluster variance and typically produces the most interpretable clusters. Check the cophenetic correlation; if it is below 0.70, try average linkage. For genomics, average linkage (UPGMA) is traditional. For noisy data with varying density, consider HDBSCAN (available as <code>sklearn.cluster.HDBSCAN</code> since sklearn 1.3) which handles noise points explicitly rather than forcing every point into a cluster.
            </div>
        </>
    )
}


export const HIERARCHICAL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
