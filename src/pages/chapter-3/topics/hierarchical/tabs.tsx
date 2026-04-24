import { Analogy, CodeBlock, DefBlock, DiagramBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Hierarchical Clustering tabs ─────────────────────────────────────────────

/** Dendrogram SVG */
function DendrogramDiagram() {
    const w = 480, h = 210
    // 8 leaf nodes, labels
    const leaves = ["A","B","C","D","E","F","G","H"]
    const lx = leaves.map((_, i) => 44 + i * 50)
    const ly = 185

    // Merges: [left-idx, right-idx, height, parent-x]
    // (using leaf indices; compound clusters get a new x)
    type Node = { x: number; topY: number }
    const nodes: Node[] = lx.map(x => ({ x, topY: ly }))

    // Merge sequence (approximately single-linkage)
    // (A,B)@30, (C,D)@25, (E,F)@20, (G,H)@35, (AB,CD)@60, (EF,GH)@55, (ABCD,EFGH)@100
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

            {/* Height axis */}
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

            {/* Merge lines */}
            {merges.map((m, i) => {
                const top = y(m.h)
                return (
                    <g key={i}>
                        {/* Horizontal bar at merge height */}
                        <line x1={m.l.x} y1={top} x2={m.r.x} y2={top}
                            stroke="#e8a838" strokeWidth={i === merges.length - 1 ? 2 : 1.5} opacity={0.6 + i*0.06} />
                        {/* Left vertical drop */}
                        <line x1={m.l.x} y1={m.l.topY} x2={m.l.x} y2={top}
                            stroke="#e8a838" strokeWidth={1.5} opacity={0.5} />
                        {/* Right vertical drop */}
                        <line x1={m.r.x} y1={m.r.topY} x2={m.r.x} y2={top}
                            stroke="#e8a838" strokeWidth={1.5} opacity={0.5} />
                    </g>
                )
            })}

            {/* Leaf labels */}
            {leaves.map((label, i) => (
                <g key={label}>
                    <circle cx={lx[i]} cy={ly} r="4" fill="#5a9ab9" opacity="0.7" />
                    <text x={lx[i]} y={ly+13} textAnchor="middle" fill="#8e8a82"
                        fontSize="7" fontFamily="JetBrains Mono,monospace">{label}</text>
                </g>
            ))}

            {/* Cut line annotation */}
            <line x1={30} y1={y(35)} x2={w-10} y2={y(35)}
                stroke="#9b7fc7" strokeWidth="1.2" strokeDasharray="6,4" />
            <text x={w-8} y={y(35)-4} textAnchor="end" fill="#9b7fc7"
                fontSize="5.5" fontFamily="JetBrains Mono,monospace">cut → 4 clusters</text>
        </svg>
    )
}

function HistoryTab() {
    const items = [
        {
            year: "1958",
            title: "Ward — Hierarchical Grouping of Multivariate Data",
            challenge: "Social scientists and biologists needed a way to discover hierarchical structure in data — some species or survey respondents were more similar to each other than to others, forming nested groups at different levels of granularity. No algorithm captured this hierarchy.",
            what: "Joe Ward proposed an agglomerative method that at each step merges the two clusters whose union minimises the total within-cluster variance (Ward's linkage). Unlike single or complete linkage, Ward's method explicitly minimises a statistical criterion at each merge, producing compact, roughly equal-sized clusters.",
            impact: "Ward's linkage is still the most widely used agglomerative method in practice. Its statistical foundation (minimising WCSS variance) makes it interpretable, and it tends to produce clusters that match human intuition better than other linkage criteria.",
        },
        {
            year: "1963",
            title: "Sokal & Sneath — Numerical Taxonomy and the Dendrogram",
            challenge: "Biologists needed a way to systematically classify organisms based on measured traits — without relying on subjective expert judgement. The result should be a tree that could be read at multiple levels of taxonomic resolution.",
            what: "Sokal and Sneath formalised the dendrogram as the output of hierarchical clustering and popularised numerical taxonomy — the practice of building taxonomies entirely from quantitative measurements. They introduced multiple linkage criteria (single, complete, average) and the cophenetic correlation coefficient to evaluate tree quality.",
            impact: "The dendrogram became the standard visualisation for hierarchical relationships in biology, gene expression analysis, linguistics, and social science. The cophenetic correlation is still used to assess how faithfully a dendrogram represents pairwise distances.",
        },
        {
            year: "1984",
            title: "SLINK / CLINK — O(n²) Optimal Algorithms",
            challenge: "Naive agglomerative clustering required O(n³) time — recomputing all pairwise distances after each merge. For the n=1000 gene expression datasets emerging in biology, this was prohibitively slow.",
            what: "Sibson (1973, SLINK) and Defays (1977, CLINK) derived O(n²) time and O(n) space algorithms for single-linkage and complete-linkage respectively. SLINK processes data in a single pass, maintaining a pointer representation of the dendrogram rather than an explicit distance matrix.",
            impact: "SLINK made hierarchical clustering practical for the gene expression revolution. Modern implementations in scipy and R use these or equivalent algorithms, allowing hierarchical clustering of tens of thousands of genes in seconds.",
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
                Imagine you have a pile of animals — dogs, cats, wolves, and lions. You want to group them, but you want to keep a record of <em>how</em> they were grouped. <strong>Hierarchical clustering</strong> builds a family tree: first pair the two most similar animals, then pair the most similar pairs, and keep going until everything is in one big group.
            </Analogy>

            <DiagramBlock title="Dendrogram — the merge tree with a cut for K=4 clusters">
                <DendrogramDiagram />
            </DiagramBlock>

            <Analogy label="Bottom-up (agglomerative)">
                Start with every animal in its own group (n groups). Find the two most similar animals and put them in the same group. Now find the two most similar groups and merge them. Repeat until you have one group containing everyone. This creates a <strong>dendrogram</strong> — a tree diagram you can read at any level.
            </Analogy>

            <Analogy label="Top-down (divisive)">
                Or start with everyone in one group and keep splitting into two smaller groups. This is like splitting a country into states, then into counties. Less common in practice but useful for very large datasets.
            </Analogy>

            <Analogy label="Choosing where to cut the tree">
                To get K clusters, draw a horizontal line across the dendrogram. Where the line intersects the branches, those are your K clusters. The higher you draw the line, the fewer (and larger) clusters you get.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Agglomerative clustering and linkage criteria</h2>

            <p>
                Hierarchical clustering builds a <strong>dendrogram</strong> — a binary tree whose leaves are individual data points and whose internal nodes represent cluster merges. To extract a flat clustering, cut the dendrogram at a chosen height.
            </p>

            <h3>Agglomerative Algorithm</h3>
            <ol>
                <li>Start: n clusters, one point each</li>
                <li>Compute the n×n distance matrix D (usually Euclidean)</li>
                <li>Find the pair (i, j) with minimum inter-cluster distance d(Cᵢ, Cⱼ)</li>
                <li>Merge Cᵢ and Cⱼ into a new cluster C_&#123;ij&#125;</li>
                <li>Update D — replace rows/columns i and j with the merged cluster</li>
                <li>Repeat from step 3 until one cluster remains</li>
            </ol>

            <h3>Linkage Criteria — How to Measure Inter-Cluster Distance</h3>
            <MathBlock tex="\text{Single linkage:}\quad d(C_i, C_j) = \min_{a \in C_i,\, b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Complete linkage:}\quad d(C_i, C_j) = \max_{a \in C_i,\, b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Average linkage:}\quad d(C_i, C_j) = \frac{1}{|C_i||C_j|} \sum_{a \in C_i} \sum_{b \in C_j} \|a - b\|" />
            <MathBlock tex="\text{Ward's linkage:}\quad d(C_i, C_j) = \sqrt{\frac{2|C_i||C_j|}{|C_i|+|C_j|}} \|\mu_i - \mu_j\|" />

            <h3>Comparing Linkage Criteria</h3>
            <ul>
                <li><strong>Single:</strong> Finds elongated, chain-like clusters. Prone to "chaining" — one outlier can bridge two distinct groups</li>
                <li><strong>Complete:</strong> Produces compact, spherical clusters. Sensitive to outliers (one distant point inflates the distance)</li>
                <li><strong>Average:</strong> Compromise between single and complete</li>
                <li><strong>Ward:</strong> Minimises within-cluster variance at each merge — generally the best default</li>
            </ul>

            <h3>Complexity</h3>
            <p>
                Naïve implementation: O(n³) time, O(n²) space. SLINK/CLINK algorithms: O(n²) time, O(n) space. For n = 10,000 points, even O(n²) can take minutes — use approximate methods or mini-batch variants for large datasets.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Lance-Williams Update Formula</h2>

            <DefBlock label="Lance-Williams Recurrence">
                After merging clusters Cᵢ and Cⱼ into C_&#123;ij&#125;, the distance from any other cluster Cₖ to the merged cluster can be computed as:
                <br /><br />
                d(C_&#123;ij&#125;, Cₖ) = αᵢ·d(Cᵢ,Cₖ) + αⱼ·d(Cⱼ,Cₖ) + β·d(Cᵢ,Cⱼ) + γ·|d(Cᵢ,Cₖ) − d(Cⱼ,Cₖ)|
                <br /><br />
                Different choices of (αᵢ, αⱼ, β, γ) give different linkage criteria.
            </DefBlock>

            <p>
                For Ward's linkage with cluster sizes nᵢ, nⱼ, nₖ:
            </p>
            <MathBlock tex="\alpha_i = \frac{n_i + n_k}{n_i + n_j + n_k},\quad \alpha_j = \frac{n_j + n_k}{n_i + n_j + n_k},\quad \beta = \frac{-n_k}{n_i + n_j + n_k},\quad \gamma = 0" />

            <h3>Ultrametric Property</h3>
            <p>
                The heights in a dendrogram define an <strong>ultrametric</strong> — a distance function satisfying the strengthened triangle inequality:
            </p>
            <MathBlock tex="d(x, z) \leq \max(d(x, y),\, d(y, z)) \quad \forall\, x, y, z" />
            <p>
                This is stronger than the ordinary triangle inequality (which uses sum, not max). Every hierarchical clustering defines an ultrametric, and every ultrametric corresponds to a dendrogram.
            </p>

            <h3>Cophenetic Correlation</h3>
            <p>
                The quality of a dendrogram is measured by how well the dendrogram distances approximate the original pairwise distances. The <strong>cophenetic distance</strong> c(xᵢ, xⱼ) = height at which xᵢ and xⱼ are first in the same cluster. The cophenetic correlation is:
            </p>
            <MathBlock tex="r_c = \frac{\sum_{i<j}(d_{ij} - \bar{d})(c_{ij} - \bar{c})}{\sqrt{\sum_{i<j}(d_{ij}-\bar{d})^2 \sum_{i<j}(c_{ij}-\bar{c})^2}}" />
            <p>
                rₒ &gt; 0.75 is considered a good fit; rₒ &lt; 0.6 suggests the dendrogram is a poor representation of the data's geometry.
            </p>
        </>
    )
}

const PY_CODE = `import numpy as np
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from scipy.spatial.distance import pdist
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler

# ── Generate data ──────────────────────────────────────────────────
X, y_true = make_blobs(n_samples=80, centers=4, random_state=42)
X = StandardScaler().fit_transform(X)

# ── Compute linkage matrix ─────────────────────────────────────────
# Condensed distance matrix (n*(n-1)/2 values)
dists = pdist(X, metric="euclidean")
# Linkage: "ward", "complete", "average", "single"
Z = linkage(dists, method="ward")

# Z is shape (n-1, 4):
# Z[i] = [left_cluster, right_cluster, merge_distance, cluster_size]

# ── Extract flat clusters by cutting the dendrogram ───────────────
# Option 1: cut at a height threshold
labels_height = fcluster(Z, t=3.0, criterion="distance")

# Option 2: specify number of clusters
labels_k = fcluster(Z, t=4, criterion="maxclust")
print(f"Cluster sizes (k=4): {np.bincount(labels_k)}")

# ── Cophenetic correlation ─────────────────────────────────────────
from scipy.cluster.hierarchy import cophenet
c, coph_dists = cophenet(Z, dists)
print(f"Cophenetic correlation: {c:.3f}")

# ── Plot dendrogram ────────────────────────────────────────────────
# import matplotlib.pyplot as plt
# plt.figure(figsize=(10, 4))
# dendrogram(Z, truncate_mode="level", p=4, leaf_rotation=90)
# plt.title("Ward Linkage Dendrogram")
# plt.xlabel("Sample index or (cluster size)")
# plt.ylabel("Distance")`

function PythonTab() {
    return (
        <>
            <CodeBlock code={PY_CODE} filename="hierarchical.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>When to use hierarchical vs k-means:</strong> Use hierarchical when you need to <em>explore</em> structure at multiple resolutions (dendrograms let you pick K after fitting), when you have no idea how many clusters to expect, or when you need linkage methods like Ward's that are more robust than Euclidean k-means. For n &gt; 10,000, prefer k-means or mini-batch variants.
            </div>
        </>
    )
}

const TS_CODE = `// ── Agglomerative Clustering (Complete Linkage) ───────────────────

type Matrix = number[][]

/** Euclidean distance between two points */
function dist(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((s, ai, i) => s + (ai - b[i]) ** 2, 0))
}

/** Complete-linkage distance between two clusters */
function completeLinkage(ci: number[][], cj: number[][]): number {
  let max = -Infinity
  for (const a of ci)
    for (const b of cj)
      max = Math.max(max, dist(a, b))
  return max
}

interface Merge { left: number; right: number; distance: number; size: number }

/** Build agglomerative dendrogram; returns merge sequence */
export function agglomerative(data: number[][]): Merge[] {
  const n = data.length
  const clusters: Map<number, number[][]> = new Map(
    data.map((p, i) => [i, [p]])
  )
  const merges: Merge[] = []
  let nextId = n

  while (clusters.size > 1) {
    const ids = [...clusters.keys()]
    let best = { i: 0, j: 1, d: Infinity }

    for (let a = 0; a < ids.length; a++) {
      for (let b = a + 1; b < ids.length; b++) {
        const d = completeLinkage(
          clusters.get(ids[a])!,
          clusters.get(ids[b])!
        )
        if (d < best.d) best = { i: ids[a], j: ids[b], d }
      }
    }

    // Merge best pair into a new cluster
    const merged = [...clusters.get(best.i)!, ...clusters.get(best.j)!]
    merges.push({ left: best.i, right: best.j, distance: best.d, size: merged.length })
    clusters.delete(best.i)
    clusters.delete(best.j)
    clusters.set(nextId++, merged)
  }

  return merges
}

// ── Demo ──────────────────────────────────────────────────────────
const data = [[1,2],[1.5,1.8],[5,8],[8,8],[1,0.6],[9,11]]
const tree = agglomerative(data)
tree.forEach(m =>
  console.log(\`Merge \${m.left}+\${m.right} at distance \${m.distance.toFixed(2)}\`)
)`

function CodeTab() {
    return (
        <>
            <p>
                A complete agglomerative clustering implementation using complete linkage. The algorithm is O(n³) — at each of the n−1 merge steps, we scan all remaining pairs to find the minimum-distance pair.
            </p>
            <CodeBlock code={TS_CODE} filename="hierarchical.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>Optimisation path:</strong> Replace the O(n²) pair scan with a priority queue (min-heap of distances). For Ward's and average linkage, use the Lance-Williams formula to update distances in O(n) after each merge instead of recomputing from scratch. This brings total complexity to O(n² log n).
            </div>
        </>
    )
}

export const HIERARCHICAL_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      <MathsTab />,
    python:     <PythonTab />,
    code:       <CodeTab />,
}
