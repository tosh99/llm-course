import { Analogy, CodeBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ────────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Why CNNs Stalled Through the 2000s</h2>

            <p>
                Despite LeNet-5's success in digit recognition, convolutional networks fell into obscurity
                through much of the 2000s. The ImageNet competition of 2012 (won by AlexNet) would
                finally reignite interest, but the intervening decade highlighted crucial limitations.
            </p>

            <h3>The Four Barriers</h3>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Barrier 1</div>
                    <div className="ch-tl-title">Limited Compute</div>
                    <div className="ch-tl-body">
                        Training deep CNNs requires massive matrix operations. In the 1990s and 2000s,
                        CPUs were the only option. A modern ResNet-50 would take months to train on CPU.
                        GPUs, originally designed for graphics, would prove essential — but their general-purpose
                        computing capabilities (CUDA, 2006) were not yet mature.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Barrier 2</div>
                    <div className="ch-tl-title">Scarcity of Labeled Data</div>
                    <div className="ch-tl-body">
                        LeNet worked because digits are simple and the MNIST dataset (60,000 examples)
                        was sufficient. Real-world images are far more complex and variable. There was no
                        ImageNet (14 million images, 21,000 categories) — collecting and labeling such data
                        was prohibitively expensive before crowdsourcing platforms like Amazon Mechanical Turk.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Barrier 3</div>
                    <div className="ch-tl-title">Vanishing Gradients</div>
                    <div className="ch-tl-body">
                        Training deep networks with sigmoid/tanh activations caused gradients to vanish
                        as they propagated backward. By the time updates reached early layers, they were
                        effectively zero. Techniques like ReLU (2010), batch normalization (2015), and better
                        initialization that would solve this problem were not yet discovered.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Barrier 4</div>
                    <div className="ch-tl-title">Dominance of Feature Engineering</div>
                    <div className="ch-tl-body">
                        Computer vision researchers believed hand-crafted features (SIFT, HOG, SURF) were
                        superior to learned representations. The prevailing wisdom held that domain expertise
                        in designing features outweighed the benefits of end-to-end learning. LeCun's
                        conviction that networks should learn features from data was considered radical.
                    </div>
                </div>
            </div>

            <h3>The Path Forward</h3>
            <p>
                By 2012, all four barriers had begun to fall. GPUs were fast and programmable. ImageNet
                provided ample data. ReLU (2010) and dropout (2012) solved training difficulties. And
                researchers had grown frustrated with the limitations of hand-crafted features. AlexNet's
                victory would prove that end-to-end learning with sufficient data and compute could
                shatter previous benchmarks.
            </p>

            <div className="ch-callout">
                <strong>A Lesson in Timing</strong> — LeNet-5 was the right architecture but the wrong era.
                Sometimes scientific breakthroughs depend as much on infrastructure (data, compute) as
                on algorithmic insight. The "AI winter" of the 2000s wasn't a failure of ideas but
                a failure of prerequisites.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Why Did Neural Networks Take a Nap?</h2>

            <Analogy label="The Superhero Without Powers">
                Imagine you have a superhero suit that lets you see amazing patterns (that's LeNet-5!).
                But there are four problems:
                <br /><br />
                <strong>Problem 1: No Battery!</strong><br/>
                The suit needs LOTS of energy to work. In the 1990s, computers were like tiny batteries.
                They just couldn't power the suit for big jobs. The suit only worked on tiny pictures
                (like handwritten numbers), not big photos!
            </Analogy>

            <Analogy label="Missing Homework">
                <strong>Problem 2: Not Enough Training!</strong><br/>
                The superhero suit needs to practice with MILLIONS of pictures to get good. But in the
                1990s and 2000s, nobody had collected millions of photos with labels. It would cost
                too much money! Without practice, the suit couldn't learn to recognize cats, dogs, or cars.
            </Analogy>

            <Analogy label="The Learning Problem">
                <strong>Problem 3: Brain Freeze!</strong><br/>
                When the suit made mistakes, it needed to learn from them. But the learning message
                got quieter and quieter as it traveled back through the suit — like a game of telephone!
                By the time it reached the early parts, the message was gone. The suit couldn't learn
                properly. (Scientists later invented ReLU to fix this in 2010!)
            </Analogy>

            <Analogy label="Old-School Competition">
                <strong>Problem 4: Old Heroes Were Stubborn!</strong><br/>
                Other scientists said: "We're already doing fine with our special tricks!" They had
                complicated math formulas (SIFT, HOG) that they believed were better. They thought the
                superhero suit was just a toy. They were wrong, but it took until 2012 to prove it!
            </Analogy>

            <div className="ch-callout">
                <strong>The Happy Ending:</strong> By 2012, everything was ready! Fast computers (GPUs!),
                millions of photos (ImageNet!), better learning tricks (ReLU!), and smart people who
                were ready to try again. AlexNet won a big contest and everyone went: "Wow, the superhero
                suit actually works!"
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>The CNN Winter: Why Progress Stalled</h2>

            <p>
                After LeNet-5's success in the 1990s, neural network research entered a period now
                called the "AI Winter." Despite having the right fundamental architecture, CNNs
                couldn't scale to real-world problems. Understanding why teaches us about prerequisites.
            </p>

            <h3>Barrier 1: Computational Limits</h3>
            <p>
                Training a deep CNN requires billions of floating-point operations. In 2000:
            </p>
            <ul>
                <li>Top CPUs: ~1 GFLOPS (billion operations/second)</li>
                <li>Training ResNet-50: ~10¹⁸ operations</li>
                <li>Time on CPU: ~300 years of continuous compute</li>
            </ul>
            <p>
                GPUs changed this. A modern GPU delivers ~100 TFLOPS — 100,000× faster than 2000s CPUs.
                NVIDIA released CUDA in 2006, but adoption took years and early GPUs had memory limitations.
            </p>

            <h3>Barrier 2: Data Scarcity</h3>
            <p>
                MNIST has 60,000 grayscale digit images. That's manageable for 1990s hardware. But for
                real-world images:
            </p>
            <ul>
                <li>ImageNet (2010): 14 million labeled images, 21,000 categories</li>
                <li>Labeling cost: ~$0.10/image × 14M = $1.4M just for labeling</li>
                <li>Before Mechanical Turk (2005), crowdsourcing was logistically impossible</li>
            </ul>

            <h3>Barrier 3: Vanishing Gradients</h3>
            <p>
                Sigmoid and tanh activations squash inputs to [-1, 1] or [0, 1]. Their derivatives peak at 0.25
                and 1 respectively, but are often much smaller. In a deep network:
            </p>
            <div style={{ background: '#111115', padding: '12px', borderRadius: '4px', fontFamily: 'JetBrains Mono', margin: '12px 0' }}>
                Gradient through n sigmoid layers: (0.25)^n<br/>
                After 10 layers: 0.25¹⁰ ≈ 9.5 × 10⁻⁷
            </div>
            <p>
                Early layers get essentially zero update. ReLU (f(x) = max(0,x)), introduced in 2010,
                has derivative 1 for positive inputs — solving this problem.
            </p>

            <h3>Barrier 4: Prevailing Paradigm</h3>
            <p>
                Computer vision in the 2000s was dominated by <strong>feature engineering</strong>:
            </p>
            <ul>
                <li><strong>SIFT</strong> — Scale-Invariant Feature Transform (2004)</li>
                <li><strong>HOG</strong> — Histogram of Oriented Gradients (2005)</li>
                <li><strong>SURF</strong> — Speeded Up Robust Features (2006)</li>
            </ul>
            <p>
                These required manual design by domain experts. The prevailing view was that learned
                features were inferior. AlexNet's 2012 victory — 10% error vs. 26% for hand-crafted
                features — changed this paradigm forever.
            </p>
        </>
    )
}

function MathsTab() {
    return (
        <>
            <h2>Mathematical Analysis of Training Barriers</h2>

            <h3>Compute Scaling</h3>
            <p>
                Training time for a CNN scales with:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                T ≈ O(B × H × W × C_in × C_out × k² × I × E)
            </div>
            <p>
                Where B = batch size, H×W = spatial dims, C = channels, k = kernel, I = images, E = epochs.
                For ImageNet-scale training with 2000s hardware:
            </p>
            <ul>
                <li>I = 1.2M images, E = 90 epochs</li>
                <li>Operations: ~10¹⁸ FLOPs</li>
                <li>2000s CPU: ~1 GFLOPS → ~30 years</li>
                <li>2012 GPU: ~1 TFLOPS → ~11 days</li>
            </ul>

            <h3>Vanishing Gradients: Mathematical Analysis</h3>
            <p>
                For sigmoid activation σ(x) = 1/(1 + e⁻ˣ):
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                σ'(x) = σ(x) × (1 - σ(x)) ≤ 0.25
            </div>
            <p>
                Maximum gradient through one layer: 0.25. Through n layers: (0.25)ⁿ.
                For a 20-layer network: 0.25²⁰ ≈ 9 × 10⁻¹³ — effectively zero.
            </p>

            <p>
                Tanh suffers similarly: tanh'(x) = 1 - tanh²(x), maximum value 1, but typically much less.
            </p>

            <h3>ReLU: The Fix</h3>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                ReLU(x) = max(0, x)<br/>
                ReLU'(x) = 1 if x {`>`} 0, else 0
            </div>
            <p>
                For positive activations, gradient flows with factor 1 — no attenuation.
                This enables training networks with 100+ layers.
            </p>

            <h3>Data Requirements</h3>
            <p>
                The Vapnik–Chervonenkis (VC) dimension bounds generalization:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                N ≥ O(VC × log(1/ε) / ε)
            </div>
            <p>
                Where N is samples needed, ε is error tolerance. Modern CNNs have VC dimensions in millions,
                requiring millions of examples to generalize well — explaining why early CNNs with limited
                data overfit despite low training error.
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn

# ── Demonstrating Vanishing Gradients ──────────────────────────────────────────

def create_deep_network(depth, activation='sigmoid'):
    """Create a deep network to test gradient flow."""
    layers = []
    for i in range(depth):
        layers.append(nn.Linear(100, 100))
        if activation == 'sigmoid':
            layers.append(nn.Sigmoid())
        elif activation == 'tanh':
            layers.append(nn.Tanh())
        elif activation == 'relu':
            layers.append(nn.ReLU())
    
    return nn.Sequential(*layers)


# Test gradient magnitudes at different depths
def test_gradient_flow(depth, activation):
    model = create_deep_network(depth, activation)
    
    # Random input
    x = torch.randn(1, 100, requires_grad=True)
    
    # Forward pass
    output = model(x)
    
    # Backward pass
    output.sum().backward()
    
    # Get gradient at input
    return x.grad.abs().mean().item()


print("Gradient flow test:")
print("=" * 50)

for depth in [5, 10, 20]:
    print(f"\\nNetwork depth: {depth} layers")
    
    for act in ['sigmoid', 'tanh', 'relu']:
        grad = test_gradient_flow(depth, act)
        print(f"  {act:8s}: {grad:.2e}")

# Results will show:
# - Sigmoid: gradients vanish exponentially
# - Tanh: similar problem, though slightly better
# - ReLU: maintains gradient magnitude (or zero, but not vanishing!)

# ── Demonstrating Compute Requirements ───────────────────────────────────────────

# Simple FLOP counting
def count_flops_conv(h, w, c_in, c_out, k, stride=1):
    """FLOPs for one convolution layer."""
    out_h = (h - k) // stride + 1
    out_w = (w - k) // stride + 1
    
    # Each output pixel requires: k*k*c_in multiplies and (k*k*c_in - 1) adds
    ops_per_pixel = 2 * k * k * c_in
    
    return out_h * out_w * c_out * ops_per_pixel


# Estimate training time for small vs large dataset
dataset_flops = 0

# Simulate a simple CNN on 32x32 images
layers = [
    (32, 32, 3, 16, 3),    # Conv: 32x32, 3→16 channels, 3x3 kernel
    (30, 30, 16, 32, 3),   # Conv: 30x30, 16→32 channels
    (28, 28, 32, 64, 3),   # Conv: 28x28, 32→64 channels
]

for h, w, c_in, c_out, k in layers:
    dataset_flops += count_flops_conv(h, w, c_in, c_out, k)

images = 60000  # MNIST size vs
images_large = 1200000  # ImageNet size

epochs = 10

print(f"\\n{'='*50}")
print("Compute estimation:")
print(f"Small dataset (MNIST):   {images:,} images")
print(f"Large dataset (ImageNet): {images_large:,} images")
print(f"\\nFLOPs per forward pass: {dataset_flops:,.0e}")
print(f"Total training FLOPs (small):  {images * epochs * dataset_flops * 3:,.0e}")
print(f"Total training FLOPs (large):  {images_large * epochs * dataset_flops * 3:,.0e}")

# The factor of 3 accounts for forward + 2 backward passes (simplified estimate)`;

function PythonTab() {
    return (
        <>
            <p>
                This code demonstrates two key barriers: vanishing gradients with old activations
                and the computational explosion of training on large datasets.
            </p>
            <CodeBlock code={PY_CODE} filename="cnn_barriers.py" lang="python" langLabel="Python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> ReLU maintains gradients for positive values, enabling
                deep networks. Meanwhile, ImageNet-scale datasets require 20× more compute than
                MNIST — feasible only with GPU acceleration.
            </div>
        </>
    )
}

const TS_CODE = `// ── Demonstrating Training Barriers in TypeScript ────────────────────────────

// ── Vanishing Gradients ───────────────────────────────────────────────────────

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x: number): number {
    const s = sigmoid(x);
    return s * (1 - s);  // Maximum 0.25 at x=0!
}

function relu(x: number): number {
    return Math.max(0, x);
}

function reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;  // Either 1 or 0 — no decay!
}

// Simulate gradient flow through network
function simulateGradientFlow(
    depth: number,
    activation: (x: number) => number,
    derivative: (x: number) => number
): number {
    let gradient = 1.0;  // Initial gradient
    
    for (let i = 0; i < depth; i++) {
        // Simulate random input
        const x = Math.random() * 2 - 1;  // -1 to 1
        
        // Chain rule: multiply by local derivative
        gradient *= derivative(x);
        
        // Early exit if effectively zero
        if (gradient < 1e-10) {
            console.log(\`  Gradient vanished at layer \${i + 1}\`);
            return 0;
        }
    }
    
    return gradient;
}

console.log("Gradient Flow Simulation:");
console.log("=" .repeat(40));

for (const depth of [5, 10, 20]) {
    console.log(\`\\nDepth: \${depth} layers\`);
    
    // Sigmoid: should show exponential decay
    const sigGrad = simulateGradientFlow(depth, sigmoid, sigmoidDerivative);
    console.log(\`  Sigmoid: \${sigGrad.toExponential(2)}\`);
    
    // Tanh: similar to sigmoid (derivative = 1 - tanh², max 1)
    const tanhGrad = simulateGradientFlow(depth, Math.tanh, (x) => 1 - Math.tanh(x)**2);
    console.log(\`  Tanh:    \${tanhGrad.toExponential(2)}\`);
    
    // ReLU: should maintain gradient (or hit zero, but not vanish slowly)
    const reluGrad = simulateGradientFlow(depth, relu, reluDerivative);
    console.log(\`  ReLU:    \${reluGrad.toFixed(4)}\`);
}

// ── Compute Scaling ─────────────────────────────────────────────────────────────

interface LayerConfig {
    h: number;
    w: number;
    c_in: number;
    c_out: number;
    k: number;
}

function estimateFlops(layers: LayerConfig[], images: number, epochs: number): number {
    let totalFlops = 0;
    
    for (const layer of layers) {
        const { h, w, c_in, c_out, k } = layer;
        const out_h = h - k + 1;
        const out_w = w - k + 1;
        
        // Each output pixel requires k*k*c_in muls + (k*k*c_in-1) adds
        const opsPerPixel = 2 * k * k * c_in;
        const layerFlops = out_h * out_w * c_out * opsPerPixel;
        
        totalFlops += layerFlops;
    }
    
    // Forward + 2 backward passes ≈ 3x
    return totalFlops * images * epochs * 3;
}

// Example CNN
const simpleCNN: LayerConfig[] = [
    { h: 32, w: 32, c_in: 3, c_out: 16, k: 3 },
    { h: 30, w: 30, c_in: 16, c_out: 32, k: 3 },
    { h: 28, w: 28, c_in: 32, c_out: 64, k: 3 },
];

const flopsSmall = estimateFlops(simpleCNN, 60000, 10);    // MNIST scale
const flopsLarge = estimateFlops(simpleCNN, 1200000, 10);  // ImageNet scale

console.log("\\n" + "=".repeat(40));
console.log("Compute Estimate:");
console.log(\`Small dataset: \${flopsSmall.toExponential(2)} FLOPs\`);
console.log(\`Large dataset: \${flopsLarge.toExponential(2)} FLOPs\`);
console.log(\`Ratio: \${flopsLarge / flopsSmall:.0f}x more compute\`);

// ── Summary ─────────────────────────────────────────────────────────────────────

console.log("\\n" + "=".repeat(40));
console.log("Key Barriers in 2000s:");
console.log("1. Vanishing gradients with sigmoid/tanh");
console.log("2. Compute: 20x more data = 20x more time");
console.log("3. No GPUs, no CUDA, no ImageNet");
console.log("4. Dominance of hand-crafted features");`;

function CodeTab() {
    return (
        <>
            <p>
                This simulation shows why CNNs couldn't work in the 2000s: vanishing gradients
                killed deep networks, and compute scaled linearly with dataset size.
            </p>
            <CodeBlock code={TS_CODE} filename="cnn_barriers.ts" lang="typescript" langLabel="TypeScript" />
            <div className="ch-callout">
                <strong>2012 was the inflection point:</strong> GPUs + ReLU + ImageNet + dropout
                broke all four barriers simultaneously, enabling AlexNet's breakthrough.
            </div>
        </>
    )
}

// ── Tab content map ─────────────────────────────────────────────────────────────

export const WHY_CNNS_STALLED_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths: <MathsTab />,
    python: <PythonTab />,
    code: <CodeTab />,
}
