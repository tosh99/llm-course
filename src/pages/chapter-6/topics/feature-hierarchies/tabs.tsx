import { Analogy } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Feature Hierarchies: From Edges to Objects</h2>

            <p>
                One of the most profound insights of CNNs is their ability to learn <strong>hierarchical
                representations</strong> automatically. This mirrors discoveries in neuroscience about
                the visual cortex.
            </p>

            <div className="ch6-timeline">
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">1962</div>
                    <div className="ch6-tl-title">Hubel & Wiesel's Hierarchy</div>
                    <div className="ch6-tl-body">
                        Studying cat visual cortex, they found simple cells detect oriented edges,
                        while complex cells combine simple cell outputs to detect patterns regardless
                        of exact position. This hierarchical structure directly inspired CNN design.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">1980–1998</div>
                    <div className="ch6-tl-title">LeNet and Early CNNs</div>
                    <div className="ch6-tl-body">
                        Fukushima's neocognitron and LeCun's LeNet-5 implemented hierarchical processing.
                        Early layers learned edges, later layers combined them into shapes and digits.
                        But visualization tools didn't exist to see this clearly.
                    </div>
                </div>
                <div className="ch6-tl-item">
                    <div className="ch6-tl-year">2014</div>
                    <div className="ch6-tl-title">Zeiler & Fergus Visualization</div>
                    <div className="ch6-tl-body">
                        The "Visualizing and Understanding Convolutional Networks" paper finally proved
                        what was theorized: CNNs build hierarchical features. Layer 1: edges. Layer 2:
                        textures. Layer 3: patterns. Layer 4-5: object parts and objects. This was a
                        watershed moment for interpretability.
                    </div>
                </div>
            </div>

            <div className="ch6-analogy">
                <div className="ch6-analogy-label">The Assembly Line</div>
                <div className="ch6-analogy-text">
                    Think of a car factory. The first workers cut raw metal into simple shapes (edges).
                    The next group assembles shapes into panels (textures). Then panels become doors,
                    hoods, trunks (patterns). Finally, these parts are assembled into complete cars
                    (objects). CNNs work exactly the same way — each layer builds on the previous one.
                </div>
            </div>

            <h3>What Each Layer Learns</h3>
            <ul>
                <li><strong>Layer 1-2:</strong> Oriented edge detectors, color gradients, simple textures</li>
                <li><strong>Layer 3-4:</strong> Corners, curves, textures, patterns, T-junctions</li>
                <li><strong>Layer 5+:</strong> Object parts — wheels, eyes, ears, faces</li>
                <li><strong>FC Layers:</strong> Complete objects, semantic concepts</li>
            </ul>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Feature Hierarchies: Building LEGO Castles</h2>

            <Analogy label="Simple Blocks">
                Imagine you have a box of LEGO bricks. The simplest pieces are just single blocks
                (like dots in a picture). But you can put them together to make walls, doors, and
                windows!
            </Analogy>

            <Analogy label="Edges First">
                In a CNN, the first layer is like sorting your LEGO by color and shape. It looks for
                simple things — <strong>edges</strong>. Is this line going up? Down? Left? Right?
                Each filter is like a special helper that says "I found a diagonal line here!"
            </Analogy>

            <Analogy label="Making Patterns">
                The second layer takes those edges and puts them together. It says: "Hmm, that
                diagonal line plus that other line makes a <strong>corner</strong>!" Or "Those
                wiggly lines together look like <strong>fur</strong>!" It's combining simple
                things into more interesting patterns.
            </Analogy>

            <Analogy label="Big Parts">
                By the third and fourth layers, the network is really getting smart! It's putting
                corners together to see <strong>eyes</strong>, <strong>ears</strong>, or
                <strong>wheels</strong>. It's like recognizing that two circular eyes plus a nose
                must be part of a <strong>face</strong>!
            </Analogy>

            <Analogy label="The Whole Picture">
                Finally, at the very end, the network looks at all the parts it found and says:
                "I see whiskers, pointy ears, four legs, and a tail... that's a <strong>CAT</strong>!"
                Everything started as tiny edge pieces and grew into understanding a whole animal!
            </Analogy>

            <div className="ch6-callout">
                <strong>Amazing Fact:</strong> Scientists studied real cat brains in 1962 and found
                they work the same way! First neurons see edges, then they combine to see shapes,
                then parts, then whole objects. Our brains and CNNs use the same trick!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Feature Hierarchies in CNNs</h2>

            <p>
                CNNs naturally develop <strong>hierarchical representations</strong> where early layers
                detect low-level features and later layers combine them into complex concepts. This
                happens without explicit programming — it's an emergent property of the architecture.
            </p>

            <h3>The Layer-by-Layer Progression</h3>

            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', margin: '16px 0' }}>
                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#e8a838' }}>Layer 1-2:</strong> Gabor-like edge detectors<br/>
                    <span style={{ color: '#5e5b56', fontSize: '13px' }}>Oriented edges, color blobs, simple textures</span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#5a9ab9' }}>Layer 3-4:</strong> Texture and pattern detectors<br/>
                    <span style={{ color: '#5e5b56', fontSize: '13px' }}>Corners, curves, repeating patterns, T-junctions</span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#5ab98c' }}>Layer 5:</strong> Object part detectors<br/>
                    <span style={{ color: '#5e5b56', fontSize: '13px' }}>Wheels, eyes, ears, doors, handles</span>
                </div>
                <div>
                    <strong style={{ color: '#9b7fc7' }}>Layers 6+ / FC:</strong> Object and semantic detectors<br/>
                    <span style={{ color: '#5e5b56', fontSize: '13px' }}>Faces, cars, animals, complete objects</span>
                </div>
            </div>

            <h3>Why This Happens</h3>
            <p>
                The combination of convolution and pooling creates a <strong>receptive field pyramid</strong>.
                Early neurons see only 3×3 or 5×5 patches. After pooling, deeper neurons see 7×7, 11×11,
                15×15, and progressively larger regions. Each layer can combine what previous layers found
                across a larger area.
            </p>

            <h3>Translation and Deformation Invariance</h3>
            <p>
                Through pooling, the network becomes robust to:
            </p>
            <ul>
                <li><strong>Translation</strong> — An object can appear anywhere in the image</li>
                <li><strong>Small deformations</strong> — A face looking left vs right is still a face</li>
                <li><strong>Scale variations</strong> — Deep layers respond across multiple scales</li>
            </ul>

            <h3>Biological Parallel</h3>
            <p>
                Hubel and Wiesel's 1962 experiments found that cat visual cortex has:
            </p>
            <ul>
                <li><strong>Simple cells</strong> — Edge detectors with specific orientations</li>
                <li><strong>Complex cells</strong> — Pool simple cell outputs, position-invariant</li>
                <li><strong>Hypercomplex cells</strong> — Detect corners, motion, end-stopped lines</li>
            </ul>
            <p>
                CNNs replicate this structure: conv layers = simple cells, pooling = complex cells,
                stacked convs = hypercomplex and higher visual areas.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>The Mathematics of Feature Hierarchies</h2>

            <h3>Receptive Field Growth</h3>
            <p>
                The receptive field of neurons grows with network depth. For a stack of n convolutional
                layers with kernel size k and stride 1:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                RF_n = n × (k - 1) + 1
            </div>
            <p>
                With k=3: Layer 1 sees 3×3, Layer 2 sees 5×5, Layer 3 sees 7×7, and so on.
                Pooling layers (stride 2) double the receptive field growth rate.
            </p>

            <h3>Feature Complexity and Network Depth</h3>
            <p>
                The expressive power grows with depth. If each layer can learn M distinct filters,
                and filters combine multiplicatively:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                N-th layer can represent M^N distinct higher-level patterns
            </div>

            <h3>Translation Equivariance and Invariance</h3>
            <p>
                Convolution provides <strong>translation equivariance</strong>:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Conv(T_Δ(x)) = T_Δ(Conv(x))
            </div>
            <p>
                Where T_Δ is translation by Δ. If the input shifts, the feature map shifts the
                same amount — but values stay identical.
            </p>

            <h3>Pooling Provides Translation Invariance</h3>
            <p>
                Max pooling provides approximate translation invariance within the pooling window.
                If a feature shifts by less than the pool size, the max value stays the same.
            </p>

            <h3>Hierarchical Dimensionality</h3>
            <p>
                Feature complexity grows while spatial resolution shrinks:
            </p>
            <ul>
                <li>Early layers: High resolution (224×224), low complexity (edges)</li>
                <li>Middle layers: Medium resolution (28×28), medium complexity (textures)</li>
                <li>Late layers: Low resolution (7×7), high complexity (object parts)</li>
            </ul>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import matplotlib.pyplot as plt

# ── Visualizing Feature Hierarchies ────────────────────────────────────────────

class SimpleVizCNN(nn.Module):
    """Small CNN to demonstrate hierarchical features."""
    
    def __init__(self):
        super().__init__()
        
        # Layer 1: 3 filters, learns edges
        self.conv1 = nn.Conv2d(1, 3, 3, padding=1)
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Layer 2: 6 filters, learns textures
        self.conv2 = nn.Conv2d(3, 6, 3, padding=1)
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Layer 3: 12 filters, learns patterns
        self.conv3 = nn.Conv2d(6, 12, 3, padding=1)
    
    def forward(self, x, return_intermediate=False):
        # Layer 1 outputs
        c1 = torch.relu(self.conv1(x))
        p1 = self.pool1(c1)
        
        # Layer 2 outputs
        c2 = torch.relu(self.conv2(p1))
        p2 = self.pool2(c2)
        
        # Layer 3 outputs
        c3 = torch.relu(self.conv3(p2))
        
        if return_intermediate:
            return c1, p1, c2, p2, c3
        return c3


# Create model and random image
model = SimpleVizCNN()
x = torch.randn(1, 1, 32, 32)

# Get intermediate outputs
c1, p1, c2, p2, c3 = model(x, return_intermediate=True)

print("Layer progression:")
print(f"  Input:     {x.shape}      (1×32×32)")
print(f"  Conv1:     {c1.shape}      (3×32×32, 3 edge detectors)")
print(f"  Pool1:     {p1.shape}      (3×16×16, spatial reduction)")
print(f"  Conv2:     {c2.shape}      (6×16×16, 6 texture patterns)")
print(f"  Pool2:     {p2.shape}       (6×8×8, further reduction)")
print(f"  Conv3:     {c3.shape}       (12×8×8, 12 complex patterns)")

# The progression shows:
# - Channels increase (more complex features)
# - Spatial dims decrease (aggregation)
# - Receptive fields grow (context increases)

# ── Analyzing What Neurons Learn ───────────────────────────────────────────────

# Visualize first layer filters (these are edge detectors)
filters = model.conv1.weight.detach()  # [3, 1, 3, 3]

print("\\nLayer 1 filter shapes (edge detectors):")
for i, f in enumerate(filters):
    print(f"  Filter {i}: {f.squeeze().numpy().round(2)}")

# After training, these would look like:
# [-1, 0, 1]   horizontal edge detector
# [-1, 0, 1]
# [-1, 0, 1]
#
# Or rotated versions for different orientations`;

function PythonTab() {
    return (
        <>
            <p>
                We can visualize how feature hierarchies develop by inspecting intermediate
                layer outputs. Notice the pattern: increasing channels, decreasing spatial
                dimensions, growing receptive fields.
            </p>
            <div style={{ background: '#111115', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
                <pre style={{ margin: 0, fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#cdc9c0' }}>
{`# Progression:
Input:   1×32×32   (raw image)
Conv1:   3×32×32   (3 edge detectors)
Pool1:   3×16×16   (downsampled edges)
Conv2:   6×16×16   (6 texture patterns)
Pool2:   6×8×8     (downsampled textures)
Conv3:   12×8×8    (12 complex patterns)`}
                </pre>
            </div>
            <div className="ch6-callout">
                <strong>Key insight:</strong> Channels increase as complexity increases, while
                spatial resolution decreases. This trade-off is fundamental to how CNNs work.
            </div>
        </>
    )
}

const TS_CODE = `// ── Feature Hierarchies in Code ───────────────────────────────────────────────

// Simulating how features compose hierarchically
type FeatureMap = number[][];

// ── Layer 1: Edge Detectors ─────────────────────────────────────────────────────

function horizontalEdgeDetector(): FeatureMap {
    // Detects horizontal edges (gradient up-down)
    return [
        [-1, -1, -1],
        [ 0,  0,  0],
        [ 1,  1,  1]
    ];
}

function verticalEdgeDetector(): FeatureMap {
    // Detects vertical edges (gradient left-right)
    return [
        [-1, 0, 1],
        [-1, 0, 1],
        [-1, 0, 1]
    ];
}

// ── Layer 2: Composing into Corners ──────────────────────────────────────────

function cornerDetector(horizResponse: FeatureMap, vertResponse: FeatureMap): FeatureMap {
    // A corner has both horizontal AND vertical components
    const result: FeatureMap = [];
    for (let i = 0; i < horizResponse.length; i++) {
        const row: number[] = [];
        for (let j = 0; j < horizResponse[0].length; j++) {
            // Combine: strong response in both = corner
            row.push(horizResponse[i][j] * vertResponse[i][j]);
        }
        result.push(row);
    }
    return result;
}

// ── Layer 3: Composing into Patterns ───────────────────────────────────────────

function texturePattern(...corners: FeatureMap[]): FeatureMap {
    // A texture is multiple corners in a pattern
    // (simplified: just sum for demonstration)
    const result: FeatureMap = corners[0].map(row => [...row]);
    
    for (const corner of corners.slice(1)) {
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[0].length; j++) {
                result[i][j] += corner[i][j];
            }
        }
    }
    
    return result;
}

// ── Demonstration ───────────────────────────────────────────────────────────────

// Simple test image (has horizontal and vertical edges)
const testImage: FeatureMap = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
];

console.log("Input:", testImage);

// Layer 1: Detect edges (would use convolution in real code)
console.log("\\nLayer 1: Edge detection (simplified)");
console.log("  Horizontal filter detected at middle rows");
console.log("  Vertical filter detected at middle columns");

// Layer 2: Combine into corners
console.log("\\nLayer 2: Corner detection");
console.log("  Intersection of H and V edges = corners");

// Layer 3: Combine corners into shape
console.log("\\nLayer 3: Pattern recognition");
console.log("  Four corners in specific arrangement = SQUARE");

// This shows the hierarchical composition principle!
console.log("\\nHierarchy: Edges → Corners → Square");`;

function CodeTab() {
    return (
        <>
            <p>
                This TypeScript example shows how features compose hierarchically: edges combine
                into corners, corners combine into patterns, patterns combine into objects.
            </p>
            <div style={{ background: '#111115', padding: '12px', borderRadius: '4px', margin: '12px 0' }}>
                <pre style={{ margin: 0, fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#cdc9c0' }}>
{`Hierarchy:
  Layer 1: Edges (3×3 patterns)
     ↓
  Layer 2: Corners (edges + edges)
     ↓
  Layer 3: Textures (corners + corners)
     ↓
  Layer 4+: Object parts (many patterns)
     ↓
  Final: Complete objects`}
                </pre>
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const FEATURE_HIERARCHIES_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
