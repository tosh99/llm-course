import { Analogy, CodeBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Weight Sharing: The Breakthrough Insight</h2>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1962</div>
                    <div className="ch-tl-title">Hubel & Wiesel's Discovery</div>
                    <div className="ch-tl-body">
                        Studying cats' visual cortex, they found neurons with localized receptive fields
                        — each neuron only responds to stimuli in a specific area. Simple cells detect
                        edges at specific orientations; complex cells pool simple cell outputs to detect
                        patterns regardless of exact position.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1980</div>
                    <div className="ch-tl-title">Fukushima's Neocognitron</div>
                    <div className="ch-tl-body">
                        The first CNN implementation. Used weight sharing explicitly — the same feature
                        detectors were replicated across spatial locations, mirroring the biological
                        findings of pattern-selective cells with translation-invariant responses.
                    </div>
                </div>
                <div className="ch-tl-item">
                    <div className="ch-tl-year">1989–1998</div>
                    <div className="ch-tl-title">LeCun's Practical CNNs</div>
                    <div className="ch-tl-body">
                        Applying backpropagation to CNNs for real-world problems. The ATMs that read
                        checks used weight sharing: an edge detector learned once works everywhere
                        in the image, cutting parameters by 97% versus fully-connected layers.
                    </div>
                </div>
            </div>

            <div className="ch-analogy">
                <div className="ch-analogy-label">The Power of Sharing</div>
                <div className="ch-analogy-text">
                    Imagine teaching a robot to find cats in photos. Instead of teaching it to look for
                    ears at specific coordinates (top-left: x=50,y=30, bottom-right: x=200,y=180), you
                    teach it to find ears — <em>anywhere</em> in the image. The same skill applies everywhere.
                    That's weight sharing.
                </div>
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Weight Sharing for Kids: Same Glasses, Everywhere!</h2>

            <Analogy label="The Magic Glasses">
                Imagine you have special glasses that help you find stripes. You put on the glasses and
                look at a picture of a zebra. The stripes light up! Now here's the cool part: the glasses
                work the same no matter where the zebra is in the picture — top, bottom, left, or right.
            </Analogy>

            <Analogy label="Why This Saves Work">
                Without weight sharing, you'd need different glasses for each spot in the picture:
                <br /><br />
                • Glasses for the top-left corner?<br />
                • Glasses for the top-middle?<br />
                • Glasses for the top-right?<br />
                • ...and a million more!<br /><br />
                That's crazy! With weight sharing, you use the <em>same</em> glasses everywhere. Much easier!
            </Analogy>

            <Analogy label="How Computers Do This">
                When a computer looks for edges, colors, or shapes in a picture, it slides a small window
                (like a magnifying glass) across the entire image. The window looks for the same thing
                everywhere — that's weight sharing! One set of numbers (weights) gets reused over and over.
            </Analogy>

            <Analogy label="A Number Game">
                Imagine a small 3×3 window (9 numbers total). With weight sharing, you only need to learn
                those 9 numbers once. They then work for looking at any 3×3 section of the picture!
                If you had 100 different places to check, without weight sharing you'd need 9×100=900 numbers!
            </Analogy>

            <div className="ch-callout">
                <strong>Fun fact:</strong> Your brain does the same thing! Neurons in your visual cortex
                use the same pattern detectors for different locations in your field of view. Mother Nature
                invented weight sharing millions of years ago!
            </div>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Weight Sharing: The Math That Makes CNNs Possible</h2>

            <p>
                <strong>Weight sharing</strong> means using the same parameters (weights) across multiple
                positions in the input. This is the defining characteristic that makes convolutional
                layers different from fully-connected layers.
            </p>

            <h3>Parameter Count Comparison</h3>
            <p>
                Let's compare a fully-connected layer vs. a convolutional layer for the same task:
            </p>

            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', margin: '16px 0' }}>
                <strong>Fully-Connected:</strong><br />
                Input: 32×32 = 1,024 pixels<br />
                Output: 28×26 = 728 neurons<br />
                Parameters: (1,024 + 1) × 728 = <strong>746,200</strong>
            </div>

            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', margin: '16px 0' }}>
                <strong>Convolutional (5×5 filter, 26 outputs):</strong><br />
                Output: 28×26 = 728 neurons<br />
                Parameters: (5×5 + 1) × 26 = <strong>676</strong>
            </div>

            <p>
                <strong>That's 1,100× fewer parameters!</strong> And the convolutional version actually captures
                spatial relationships better.
            </p>

            <h3>Why This Works: Translation Equivariance</h3>
            <p>
                Weight sharing gives CNNs a powerful property called <strong>translation equivariance</strong>.
                If you shift the input image by a few pixels, the output feature map shifts by the same
                amount — but the <em>values</em> stay the same. This is exactly what we want for visual tasks.
            </p>

            <p>
                Formally: if f is our convolution and T is translation by Δx, then:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                f(T(x)) = T(f(x))
            </div>

            <p>
                This means the network learns features that are <em>position-independent</em> — a cat ear
                is a cat ear whether it's in the top-left or bottom-right of the image.
            </p>


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
                    <span className="ch-expandable-desc">Implementation · NumPy · PyTorch</span>
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
            <h2>The Mathematics of Weight Sharing</h2>

            <h3>Discrete Convolution with Weight Sharing</h3>
            <p>
                In a standard matrix multiplication, each output element has its own row of weights:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                yᵢ = Σ_j Wᵢⱼ · xⱼ + bᵢ
            </div>
            <p>
                Here, W has shape (out, in) — each output neuron gets unique weights for every input.
            </p>

            <p>
                In convolution with weight sharing:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                y[i, j] = Σ_m Σ_n K[m, n] · x[i+m, j+n] + b
            </div>
            <p>
                The same kernel <strong>K</strong> is used for every output position (i, j). Only |K| + 1
                parameters for the entire output feature map!
            </p>

            <h3>Parameter Efficiency</h3>
            <p>
                For a convolution layer with:
            </p>
            <ul>
                <li>C_in input channels</li>
                <li>C_out output channels</li>
                <li>Kernel size: k × k</li>
                <li>Input spatial size: H × W</li>
            </ul>
            <p>
                The total parameters are:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Parameters = (k² · C_in + 1) · C_out
            </div>
            <p>
                Compare to fully-connected:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                Parameters_FC = (H · W · C_in + 1) · (H' · W' · C_out)
            </div>

            <h3>Receptive Field Growth</h3>
            <p>
                With n stacked 3×3 convolutions, the receptive field grows as:
            </p>
            <div style={{ background: '#111115', padding: '16px', borderRadius: '4px', fontFamily: 'JetBrains Mono', marginBottom: '16px' }}>
                RF(n) = 2n + 1
            </div>
            <p>
                Two 3×3 layers can see 5×5 regions with only 2 × (3×3 + 1) = 20 parameters.
                A single 5×5 filter would need 5×5 + 1 = 26 parameters. Weight sharing across
                <em>layers</em> saves even more!
            </p>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn

# ── Demonstrating Weight Sharing ─────────────────────────────────────────────────

# Create an image
img = torch.randn(1, 1, 28, 28)

# Conv layer with 8 filters, 3×3 kernel
conv = nn.Conv2d(1, 8, kernel_size=3, padding=1)

# Each filter has the same 3×3 weights everywhere!
print("Weight shape:", conv.weight.shape)  # [8, 1, 3, 3]
print("Bias shape:", conv.bias.shape)      # [8]

# Only 8 × (3×3 × 1 + 1) = 80 parameters
print(f"\\nTotal parameters: {sum(p.numel() for p in conv.parameters())}")

# Apply convolution
out = conv(img)
print(f"Output shape: {out.shape}")  # [1, 8, 28, 28]

# ── Custom Implementation Showing Weight Sharing ────────────────────────────────

class ManualConv2d(nn.Module):
    """Conv2d implemented manually to show weight sharing"""
    
    def __init__(self, in_ch, out_ch, k):
        super().__init__()
        # ONE set of weights shared everywhere!
        self.weight = nn.Parameter(torch.randn(out_ch, in_ch, k, k))
        self.bias = nn.Parameter(torch.zeros(out_ch))
        self.k = k
    
    def forward(self, x):
        batch, _, h, w = x.shape
        out_h, out_w = h, w  # With padding
        out_ch = self.weight.shape[0]
        
        # Pad input
        x_padded = torch.nn.functional.pad(x, [1, 1, 1, 1])
        
        output = torch.zeros(batch, out_ch, out_h, out_w)
        
        # For each output position, apply the SAME weights
        for i in range(out_h):
            for j in range(out_w):
                # Extract region
                region = x_padded[:, :, i:i+self.k, j:j+self.k]
                
                # SAME weights for every position!
                # region: [batch, 1, 3, 3]
                # weight: [8, 1, 3, 3]
                # → element-wise multiply and sum
                for oc in range(out_ch):
                    output[:, oc, i, j] = (
                        (region * self.weight[oc:oc+1]).sum(dim=(1, 2, 3)) + self.bias[oc]
                    )
        
        return output

# Verify they work the same (approximately)
manual_conv = ManualConv2d(1, 8, 3)
manual_conv.weight.data = conv.weight.data.clone()
manual_conv.bias.data = conv.bias.data.clone()

manual_out = manual_conv(img)
print(f"\\nPyTorch output [0,0,0,:5]: {out[0,0,0,:5].detach()}")
print(f"Manual output [0,0,0,:5]:   {manual_out[0,0,0,:5].detach()}")

# ── The Efficiency: FC vs Conv ───────────────────────────────────────────────────

# Fully-connected equivalent would need:
# Input: 28×28 = 784
# Output: 28×28×8 = 6,272
fc_params = (784 + 1) * 6272  # 4,926,720 parameters!

conv_params = 80  # Same as before

print(f"\\nFC parameters:  {fc_params:,}")
print(f"Conv parameters: {conv_params}")
print(f"Savings: {fc_params / conv_params:,.0f}x")`;

function PythonContent() {
    return (
        <>
            <p>
                The PyTorch implementation shows how weight sharing works in practice.
                The same weight tensor is used for every spatial position — no matter
                how large the input is!
            </p>
            <CodeBlock code={PY_CODE} filename="weight_sharing.py" lang="python" />
            <div className="ch-callout">
                <strong>Key insight:</strong> The weight shape is{' '}
                <code>(out_channels, in_channels, k, k)</code> — no spatial dimensions!
                This is why CNNs work on any size image with the same parameter count.
            </div>
        </>
    )
}




// ── Tab content map ─────────────────────────────────────────────────────────────

export const WEIGHT_SHARING_TABS: Record<TabId, React.ReactNode> = {
    history: <HistoryTab />,
    kid: <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
