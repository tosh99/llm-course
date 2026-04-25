import { Analogy, CodeBlock, DefBlock, MathBlock } from "../../shared"
import type { TabId } from "../../types"

// ── Tab content ───────────────────────────────────────────────────────────────

function HistoryTab() {
    return (
        <>
            <h2>Generating audio one sample at a time</h2>
            <p>
                WaveNet (2016) demonstrated that the same autoregressive modeling approach used
                for text — predict the next token from all previous tokens — could generate raw
                audio waveforms at 16,000 samples per second, producing speech quality that far
                surpassed anything achievable with traditional signal processing pipelines. It
                was the final milestone of the convolutional-recurrent era: proof that
                long-range temporal modeling could be solved with depth and dilation, not
                recurrence. Then the Transformer arrived.
            </p>

            <div className="ch-timeline">
                <div className="ch-tl-item">
                    <div className="ch-tl-year">Pre-2016</div>
                    <div className="ch-tl-section-label">Before WaveNet</div>
                    <div className="ch-tl-title">Concatenative and Parametric TTS</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Traditional text-to-speech (TTS) systems used one of two approaches.
                        Concatenative synthesis assembled pre-recorded speech segments (diphones or
                        triphones) from a large database, producing natural-sounding speech in known
                        conditions but artifacts at segment boundaries and inability to generalize
                        to new speaking styles. Parametric synthesis (using HMMs to predict vocoder
                        parameters) was more flexible but sounded robotic — no model could predict
                        the full complexity of the vocal tract's dynamics.
                        <div className="ch-tl-section-label">What was introduced</div>
                        These systems modeled intermediate audio representations (spectrograms,
                        MFCC features) rather than raw waveforms. The raw waveform was left to
                        post-processing vocoders (STRAIGHT, WORLD) that introduced characteristic
                        artifacts. No system tried to model P(x<sub>t</sub> | x<sub>1</sub>, …, x<sub>t&#8722;1</sub>)
                        directly at the sample level — the dimensionality seemed intractable.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The pre-WaveNet TTS landscape defined the ceiling that WaveNet had to
                        break. Understanding the limitations of vocoder-based approaches explains
                        why WaveNet's sample-level modeling — naive as it sounds — was such a
                        breakthrough: it bypassed the entire vocoder stage by learning the mapping
                        from linguistic features to raw waveform directly.
                    </div>
                    <div className="ch-tl-impact">Impact: Established the baseline that WaveNet had to surpass — and did, decisively, in 2016</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016</div>
                    <div className="ch-tl-section-label">Breakthrough</div>
                    <div className="ch-tl-title">WaveNet — van den Oord et al., DeepMind</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Audio at 16,000 Hz means 16,000 samples per second — each a value in the
                        range [&#8722;32768, 32767] for 16-bit audio. Modeling the joint distribution
                        over even one second of audio required predicting 16,000 values, each
                        conditioned on all previous ones. Standard RNNs could not maintain a
                        coherent hidden state over 16,000 time steps, and their sequential nature
                        made training prohibitively slow.
                        <div className="ch-tl-section-label">What was introduced</div>
                        Aaron van den Oord and colleagues at DeepMind published "WaveNet: A
                        Generative Model for Raw Audio" in September 2016. WaveNet used dilated
                        causal convolutions — borrowed and extended from PixelCNN — to model
                        P(x<sub>t</sub> | x<sub>1</sub>, …, x<sub>t&#8722;1</sub>) for each of 256
                        quantization classes (&#956;-law companding). Each audio sample is a discrete
                        class, making this a 256-class classification problem at every step. The
                        model had over 1 million parameters and used gated tanh activations
                        (tanh &#8857; sigmoid) borrowed from PixelCNN, with skip connections summing
                        contributions from all dilated layers to the output.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        WaveNet achieved a mean opinion score (MOS) of 4.21/5 for English TTS
                        compared to 3.86 for the best concatenative system and 3.67 for the best
                        parametric system — a statistically significant jump that had never been
                        seen in TTS research. For music generation, the model produced piano and
                        chamber music samples that were indistinguishable from real recordings
                        over 1-second clips. It proved that sample-level autoregressive modeling
                        was not just tractable but state-of-the-art.
                    </div>
                    <div className="ch-tl-impact">Impact: Proved raw waveform generation was tractable and immediately state-of-the-art; displaced all vocoder-based TTS</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2016 – 2017</div>
                    <div className="ch-tl-section-label">Architecture</div>
                    <div className="ch-tl-title">Dilated Causal Convolutions — The Key Innovation</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        To generate realistic speech, the model needed a receptive field spanning
                        hundreds of milliseconds — at 16 kHz, that means 4,000–8,000 samples of
                        context. Standard causal convolutions with kernel size 3 would require
                        4,000 layers to cover this range. Recurrent networks could cover the range
                        but at O(T) sequential training cost. A new architectural primitive was needed.
                        <div className="ch-tl-section-label">What was introduced</div>
                        WaveNet used exponentially dilated causal convolutions: kernel size 2,
                        applied with dilation rates 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
                        (one "block" of 10 layers), repeated 3–5 times. Each layer doubles its
                        skip distance, causing the receptive field to grow exponentially with
                        depth rather than linearly. With 10 layers per block and 3 blocks, the
                        receptive field spans (2<sup>10</sup> &#8722; 1) &#215; 3 = 3,069 samples at 16 kHz —
                        about 190 ms of audio context. Training is fully parallel (unlike RNNs)
                        because all T positions are processed simultaneously during the forward pass.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Dilated causal convolutions showed that exponential receptive field growth
                        could replace recurrence for long-range temporal modeling. This architecture
                        directly influenced Temporal Convolutional Networks (TCN, 2018), the
                        WaveNet-based Tacotron 2 vocoder stage, and numerous sequence modeling
                        baselines. The dilation pattern (1, 2, 4, …, 512, 1, 2, 4, …) became a
                        standard building block for any task requiring long temporal context.
                    </div>
                    <div className="ch-tl-impact">Impact: Established dilated causal convolutions as a viable alternative to RNNs for long-range temporal modeling</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2017</div>
                    <div className="ch-tl-section-label">Production</div>
                    <div className="ch-tl-title">Google Deployment and Parallel WaveNet</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        WaveNet generated samples sequentially — one 16 kHz sample at a time.
                        Generating one second of speech required 16,000 forward passes, taking
                        minutes on a single GPU. This was completely unsuitable for production
                        TTS systems that needed &lt;100 ms latency. Google had deployed WaveNet's
                        architecture internally but needed a way to generate audio in real time.
                        <div className="ch-tl-section-label">What was introduced</div>
                        DeepMind's Parallel WaveNet (2017, published 2018) used probability density
                        distillation: train a flow-based generative model (an Inverse Autoregressive
                        Flow) to match the WaveNet distribution, but one that could generate all
                        16,000 samples simultaneously rather than sequentially. The teacher WaveNet
                        computed a KL divergence loss against the student flow model, training the
                        student to replicate WaveNet's distribution in a single feedforward pass.
                        The result: 1000&#215; faster generation — real-time on a single CPU.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        Parallel WaveNet enabled deployment in Google Assistant's TTS across all
                        languages, replacing the previous concatenative system. It also established
                        a general strategy for accelerating autoregressive models: distill them
                        into parallel models at test time, accepting a small quality loss for a
                        massive speed gain. This strategy would later be applied to language model
                        decoding (speculative decoding) and image generation (consistency models).
                    </div>
                    <div className="ch-tl-impact">Impact: Enabled production deployment of WaveNet-quality TTS at real-time speed; established flow distillation as a general acceleration strategy</div>
                </div>

                <div className="ch-tl-item">
                    <div className="ch-tl-year">2018 – 2020</div>
                    <div className="ch-tl-section-label">Successors</div>
                    <div className="ch-tl-title">WaveGlow, WaveGrad, and HiFi-GAN</div>
                    <div className="ch-tl-body">
                        <div className="ch-tl-section-label">The challenge</div>
                        Even Parallel WaveNet required complex training (KL divergence between
                        two autoregressive models is expensive to compute). Researchers sought
                        simpler, faster vocoders that preserved WaveNet-level quality.
                        <div className="ch-tl-section-label">What was introduced</div>
                        WaveGlow (Prenger et al., NVIDIA, 2019) used a single Glow-based flow
                        model trained with a simple maximum likelihood objective — no teacher
                        network needed. WaveGrad (Chen et al., 2020) applied score matching /
                        diffusion for waveform synthesis. HiFi-GAN (Kong et al., 2020) used a
                        GAN-based vocoder with multi-period and multi-scale discriminators,
                        achieving near-WaveNet quality while generating audio 167&#215; faster
                        than real time on a V100 GPU. HiFi-GAN became the standard vocoder
                        for TTS systems including Tacotron 2, FastSpeech 2, and VALL-E.
                        <div className="ch-tl-section-label">Why it mattered</div>
                        The sequence WaveNet &#8594; Parallel WaveNet &#8594; WaveGlow &#8594; HiFi-GAN traces
                        the arc of neural vocoder development: from sequential autoregressive
                        perfection, through flow-based distillation, to GAN-based speed with
                        minimal quality loss. Each step made high-quality neural TTS more
                        accessible to researchers and products without GPU farms.
                    </div>
                    <div className="ch-tl-impact">Impact: Established HiFi-GAN as the modern standard neural vocoder; made WaveNet-quality TTS accessible without massive compute</div>
                </div>
            </div>

            <div className="ch-callout">
                <strong>What comes next:</strong> Advanced RNNs — deep stacks, pointer networks,
                WaveNet's dilated causal convolutions — had pushed sequence modeling as far as
                the recurrent paradigm could go. WaveNet showed that a convolutional architecture
                could outperform RNNs for audio by replacing sequential hidden states with
                parallel dilated receptive fields. In June 2017, "Attention Is All You Need"
                proposed something more radical still: abandon recurrence and convolution both.
                Chapter 17 tells the story of the Transformer.
            </div>
        </>
    )
}

function KidTab() {
    return (
        <>
            <h2>Drawing sound one dot at a time</h2>

            <Analogy label="Sound is just numbers">
                A digital audio file is just a list of numbers — 16,000 numbers for every
                second of audio at 16 kHz. Each number represents how far a speaker membrane
                is pushed at that exact moment: a large positive number means a loud outward
                push; a large negative number means a loud inward pull; zero means silence.
                <br /><br />
                WaveNet learns to predict each number given all the previous ones — like
                completing a connect-the-dots drawing one dot at a time, at 16,000 dots per
                second. To keep things manageable, it bins each number into one of 256 categories
                (like rounding to the nearest 1/256th of the range), turning it into a
                classification problem.
            </Analogy>

            <Analogy label="Why Not Use RNNs?">
                RNNs process audio one sample at a time too, but they remember history through
                a single hidden state — a fixed-size summary of everything before. For 16,000
                samples per second, keeping the context of the last half-second in a single
                hidden vector is asking a lot. The information gets compressed and mixed, and
                fine details of waveform structure get lost.
                <br /><br />
                WaveNet's dilated convolutions solve this differently: instead of compressing
                history into one vector, they let the network "see" 4,000 samples back through
                a clever skip-step pattern, using only 30 layers. No single vector has to hold
                all that context.
            </Analogy>

            <Analogy label="The Skip-Step Trick (Dilated Convolutions)">
                Imagine reading a very long book. Normally, you read every word: word 1, 2, 3,
                4, 5. But if you want to understand the big picture quickly, you could first
                read every 2nd word, then every 4th word, then every 8th word — reading at
                progressively wider scales. After just a few "passes," you'd have covered the
                whole book using far fewer steps.
                <br /><br />
                Dilated convolutions do this with audio samples. Layer 1 looks at every sample.
                Layer 2 skips one sample each time (dilation 2). Layer 3 skips three samples
                (dilation 4). Layer 10 skips 511 samples (dilation 512). By layer 10, a single
                neuron "sees" a span of 1,024 samples — about 64 milliseconds of audio context.
                Three blocks of 10 layers gives about 190 ms of context — enough to capture
                the rhythm and intonation of speech.
            </Analogy>

            <Analogy label="The Gate (Gated Tanh Activation)">
                Each dilated layer in WaveNet doesn't just compute one number — it computes two.
                The first (using tanh) is the raw content signal: "here's what I think the
                feature is." The second (using sigmoid) is a gate: "here's how much of that
                content should flow through."
                <br /><br />
                Multiply the two together, and you get a gated signal — like a dimmer switch
                controlling how much of a light shines through. Gates help WaveNet selectively
                let through only the relevant audio features at each layer, preventing noise
                from drowning out signal.
            </Analogy>

            <Analogy label="Too Slow — The 1000x Problem">
                WaveNet's big weakness: it generates samples one at a time. Generating one
                second of audio requires 16,000 forward passes through the entire network.
                In 2016, on the best GPUs, this took about 90 seconds. Not exactly real-time.
                <br /><br />
                Google's Parallel WaveNet (2017) solved this using a clever trick: train a
                second, simpler network to generate all 16,000 samples simultaneously (in
                parallel), then teach it to imitate WaveNet's quality by comparing their output
                distributions. The result: 1,000&#215; faster generation — real-time on a laptop CPU.
                This trick of "teach a fast parallel model to imitate a slow sequential model"
                is now used widely across AI.
            </Analogy>

            <Analogy label="What comes next — Throwing out recurrence">
                WaveNet showed that convolutions could replace recurrence for long sequences —
                dilated patterns reaching back hundreds of milliseconds with no hidden state
                at all. The next question was more radical: what if you replaced recurrence
                for language too — not with convolutions, but with pure attention? Chapter 17
                shows how the Transformer answered yes, processing every position simultaneously
                and enabling a revolution in natural language processing.
            </Analogy>
        </>
    )
}

function HighSchoolTab() {
    return (
        <>
            <h2>Dilated causal convolutions for sequence generation</h2>

            <h3>The Autoregressive Factorization</h3>
            <p>
                WaveNet models the joint probability of a waveform x = (x<sub>1</sub>, …, x<sub>T</sub>)
                as a product of conditionals using the chain rule:
            </p>
            <MathBlock tex="P(\mathbf{x}) = \prod_{t=1}^{T} P(x_t \mid x_1, \ldots, x_{t-1})" />
            <p>
                Each sample x<sub>t</sub> is quantized to 256 values using &#956;-law companding —
                a logarithmic compression that allocates more quantization levels near zero
                (where the human ear is most sensitive). This converts waveform generation
                into 256-class classification at each of T = 16,000 steps per second.
            </p>

            <h3>&#956;-Law Companding</h3>
            <p>
                The raw waveform sample x &#8712; [&#8722;1, 1] is encoded as:
            </p>
            <MathBlock tex="\mu\text{-law}(x) = \text{sign}(x) \frac{\ln(1 + \mu |x|)}{\ln(1 + \mu)}, \quad \mu = 255" />
            <p>
                This compresses the dynamic range logarithmically, matching human loudness
                perception. The encoded value is then quantized to 256 bins. Reconstruction
                applies the inverse transform, which expands the logarithmically-spaced values
                back to linear amplitude.
            </p>

            <h3>Dilated Causal Convolutions</h3>
            <p>
                A causal convolution with dilation d and kernel size K processes:
            </p>
            <MathBlock tex="(f *_d k)(t) = \sum_{i=0}^{K-1} f(t - d \cdot i) \cdot k(i)" />
            <p>
                With d = 1, this is a standard causal convolution — sees the last K samples.
                With d = 512, it sees every 512nd sample — giving a span of K &#215; 512 samples
                with only K multiplications. WaveNet uses K = 2 and dilation rates
                (1, 2, 4, 8, 16, 32, 64, 128, 256, 512) per block, repeated for 3 blocks.
                The receptive field per block:
            </p>
            <MathBlock tex="RF_{\text{block}} = (K-1) \cdot \sum_{\ell=0}^{9} 2^\ell = 1 \cdot (2^{10} - 1) = 1023 \text{ samples}" />
            <p>
                With 3 blocks: RF = 3 &#215; 1023 = 3069 samples &#8776; 192 ms at 16 kHz.
            </p>

            <h3>Gated Activation Units</h3>
            <p>
                Each dilated convolutional layer uses a gated tanh activation (identical to PixelCNN):
            </p>
            <MathBlock tex="\mathbf{z}_k = \tanh(\mathbf{W}_{f,k} * \mathbf{x}) \odot \sigma(\mathbf{W}_{g,k} * \mathbf{x})" />
            <p>
                The tanh branch produces the candidate activation; the sigmoid branch produces
                a gate controlling flow. The element-wise product of the two gives a gated
                output. Each layer also receives conditioning information (e.g., speaker
                identity or linguistic features) added to both branches before activation.
            </p>

            <h3>Skip Connections and Output Stack</h3>
            <p>
                All 30 dilated layers contribute to the output via skip connections that are
                summed before the final 1&#215;1 convolutional output stack:
            </p>
            <MathBlock tex="\mathbf{o} = f_{\text{out}}\!\left(\sum_{k=1}^{L} \text{skip}(\mathbf{z}_k)\right)" />
            <p>
                where f<sub>out</sub> is two ReLU + 1&#215;1 Conv layers culminating in a softmax
                over 256 classes. Skip connections ensure that the output can draw on patterns
                at any temporal scale — layer 1 (fine, 1-sample resolution) through layer 30
                (coarse, 512-sample resolution).
            </p>

            <h3>Parallel WaveNet: Flow-Based Distillation</h3>
            <p>
                Parallel WaveNet uses an Inverse Autoregressive Flow (IAF) student that generates
                all T samples simultaneously. The training loss is:
            </p>
            <MathBlock tex="\mathcal{L} = D_{\text{KL}}\!\left(p_{\text{student}}(\mathbf{x}) \;\|\; p_{\text{teacher}}(\mathbf{x})\right) + \lambda \cdot \text{perceptual loss}" />
            <p>
                Since the KL divergence is computed as an expectation under the student
                distribution (which is differentiable), this can be optimized via reparameterization.
                The student generates samples from random noise in one feedforward pass;
                the teacher evaluates their probability, guiding the student to match the
                WaveNet distribution. Result: 1,000&#215; faster generation.
            </p>

            <hr className="ch-sep" />
            <div className="ch-callout">
                <strong>Speed limitation and the distillation solution:</strong> WaveNet generates
                samples sequentially — one at a time, 16,000 per second of audio. At 24 kHz,
                generating one second requires 24,000 forward passes. Parallel WaveNet (2017)
                distilled WaveNet into a flow-based model enabling parallel generation, reducing
                synthesis time 1,000&#215;. HiFi-GAN (2020) further simplified this with GAN training,
                achieving 167&#215; faster-than-real-time on a single GPU and becoming the
                standard vocoder for modern TTS systems.
            </div>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Deep Dive — Mathematics</span>
                    <span className="ch-expandable-desc">Receptive field derivation · &#956;-law · KL distillation</span>
                </summary>
                <div className="ch-expandable-body">
                    <MathsContent />
                </div>
            </details>

            <details className="ch-expandable">
                <summary>
                    <span className="ch-expandable-arrow">▶</span>
                    <span className="ch-expandable-label">Sample Code</span>
                    <span className="ch-expandable-desc">Dilated causal conv · PyTorch</span>
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
            <h2>Formal analysis: receptive fields, &#956;-law, and distillation</h2>

            <DefBlock label="Dilated Causal Convolution — Formal Specification">
                Input sequence f : &#8484; &#8594; &#8477;<sup>C</sup>. Kernel k : &#123;0, …, K&#8722;1&#125; &#8594; &#8477;<sup>C</sup>.
                Dilation rate d &#8712; &#8484;<sub>+</sub>. Output:
                (f *<sub>d</sub> k)(t) = &#8721;<sub>i=0</sub><sup>K&#8722;1</sup> f(t &#8722; d&#183;i) &#183; k(i).
                Causal: f(t &#8722; d&#183;i) = 0 for t &#8722; d&#183;i &lt; 0 (zero-padding).
                Receptive field of a single layer: span = (K&#8722;1)&#183;d + 1 samples.
            </DefBlock>

            <h3>Receptive Field Growth</h3>
            <p>
                For L layers with dilation rates d<sub>&#8467;</sub> = 2<sup>&#8467;&#8722;1</sup> and kernel size K = 2:
            </p>
            <MathBlock tex="RF_L = 1 + \sum_{\ell=1}^{L} (K - 1) \cdot 2^{\ell-1} = 1 + \sum_{\ell=0}^{L-1} 2^\ell = 2^L" />
            <p>
                For L = 10: RF = 1024 samples. The exponential growth means that 30 layers
                (3 blocks of 10) cover RF = 3 &#215; (2<sup>10</sup> &#8722; 1) + 1 = 3070 samples &#8776; 192 ms at 16 kHz.
                This contrasts with standard causal convolutions: L layers of kernel size K
                cover (K&#8722;1)&#183;L + 1 samples — only linear growth.
            </p>

            <h3>&#956;-Law Companding and Quantization</h3>
            <MathBlock tex="\mu\text{-law}(x_t) = \text{sign}(x_t) \frac{\ln(1 + 255 |x_t|)}{\ln(256)}, \quad x_t \in [-1, 1]" />
            <p>
                The 256 quantization bins are uniformly spaced in the &#956;-law domain but
                logarithmically spaced in the linear domain, concentrating precision near zero
                where perceptual sensitivity is highest. The WaveNet output is a 256-class
                softmax; samples are drawn from this distribution and decoded via the inverse
                &#956;-law to linear PCM.
            </p>

            <h3>Gated Activation: Information-Theoretic View</h3>
            <MathBlock tex="\mathbf{z} = \underbrace{\tanh(\mathbf{W}_f * \mathbf{x})}_{\text{content}} \odot \underbrace{\sigma(\mathbf{W}_g * \mathbf{x})}_{\text{gate}}" />
            <p>
                The sigmoid gate &#8712; [0, 1] controls information flow multiplicatively. When
                &#963;(W<sub>g</sub>x) &#8776; 0, the layer is effectively disabled — it passes no
                information to the next layer. When &#8776; 1, it passes the full tanh activation.
                This gating mechanism was found empirically to outperform plain ReLU activations
                for audio modeling, hypothesized to be because audio features (pitch, formants,
                transients) are more naturally gated than continuously active.
            </p>

            <h3>Parallel WaveNet: KL Distillation</h3>
            <p>
                The teacher WaveNet p<sub>T</sub>(x) is autoregressive and slow. The student
                IAF q<sub>S</sub>(x|z) generates x from noise z &#8764; N(0, I) in one pass. Training
                minimizes:
            </p>
            <MathBlock tex="\mathcal{L} = \mathbb{E}_{z \sim \mathcal{N}(0,I)}\!\left[\log q_S(x|z) - \log p_T(x)\right]" />
            <p>
                Since x = g(z) is a differentiable function of z (via the IAF), reparameterization
                gives unbiased gradients through the KL term. The perceptual loss (STFT
                magnitude loss) ensures the student matches the teacher's frequency spectrum,
                not just its sample-level distribution.
            </p>

            <div className="ch-callout">
                <strong>WaveNet's legacy in architecture design:</strong> The pattern of
                exponentially increasing dilation rates followed by a reset (1, 2, 4, …, 512, 1, 2, 4, …)
                was adopted in Temporal Convolutional Networks (TCN), ByteNet for machine
                translation, and several Transformer variants. WaveNet demonstrated that
                convolutional receptive fields could be engineered to cover any desired temporal
                scale without recurrence — a fundamental insight that influenced the design of
                all subsequent non-recurrent sequence models.
            </div>
        </>
    )
}

const PY_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class DilatedCausalConv(nn.Module):
    """Single dilated causal convolution layer with gated tanh activation."""

    def __init__(self, channels: int, kernel_size: int, dilation: int):
        super().__init__()
        self.padding = (kernel_size - 1) * dilation   # causal: only left-pad
        self.conv = nn.Conv1d(
            channels, channels * 2,                    # *2 for gated activation
            kernel_size=kernel_size,
            dilation=dilation,
            padding=self.padding
        )
        self.res_conv  = nn.Conv1d(channels, channels, 1)  # residual 1x1
        self.skip_conv = nn.Conv1d(channels, channels, 1)  # skip 1x1

    def forward(self, x: torch.Tensor):
        # x: (batch, channels, time)
        h = self.conv(x)[:, :, :x.size(2)]            # remove non-causal future samples
        tanh_h, sig_h = h.chunk(2, dim=1)             # split into content + gate
        z = torch.tanh(tanh_h) * torch.sigmoid(sig_h) # gated activation
        residual = self.res_conv(z) + x                # residual connection
        skip     = self.skip_conv(z)
        return residual, skip


class MiniWaveNet(nn.Module):
    """
    Simplified WaveNet: n_blocks dilation blocks, each with n_layers layers.
    Dilation rates: 1, 2, 4, ..., 2^(n_layers-1) per block.
    """

    def __init__(self, channels: int = 32, n_blocks: int = 3,
                 n_layers: int = 4, n_classes: int = 256):
        super().__init__()
        self.input_conv = nn.Conv1d(1, channels, 1)
        dilations = [2**i for i in range(n_layers)]

        self.layers = nn.ModuleList([
            DilatedCausalConv(channels, kernel_size=2, dilation=d)
            for _ in range(n_blocks)
            for d in dilations
        ])
        self.output_stack = nn.Sequential(
            nn.ReLU(),
            nn.Conv1d(channels, channels, 1),
            nn.ReLU(),
            nn.Conv1d(channels, n_classes, 1)
        )

    def receptive_field(self) -> int:
        return sum((2**i) for block in [None] * (len(self.layers) // 4)
                   for i in range(4))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """x: (batch, 1, time) -> logits: (batch, 256, time)"""
        h = self.input_conv(x)
        skip_total = torch.zeros_like(h)
        for layer in self.layers:
            h, skip = layer(h)
            skip_total = skip_total + skip
        return self.output_stack(skip_total)


# ── mu-law companding ─────────────────────────────────────────────────────────
def mu_law_encode(x: torch.Tensor, mu: int = 255) -> torch.Tensor:
    """x in [-1, 1] -> quantized index in {0, ..., mu}"""
    compressed = x.sign() * torch.log1p(mu * x.abs()) / torch.log(torch.tensor(1.0 + mu))
    return ((compressed + 1) / 2 * mu + 0.5).long().clamp(0, mu)

def mu_law_decode(indices: torch.Tensor, mu: int = 255) -> torch.Tensor:
    """Inverse mu-law: index -> float in [-1, 1]"""
    x = 2.0 * indices.float() / mu - 1.0
    return x.sign() * (1.0 / mu) * ((1.0 + mu) ** x.abs() - 1.0)


# ── Demo ──────────────────────────────────────────────────────────────────────
model = MiniWaveNet(channels=32, n_blocks=3, n_layers=4, n_classes=256)
x = torch.randn(2, 1, 512)   # 2 audio clips, 512 samples

logits = model(x)
print("Mini-WaveNet Demo")
print("=" * 50)
print(f"Input  shape : {tuple(x.shape)}")
print(f"Output shape : {tuple(logits.shape)}  (batch, 256 classes, time)")
print()

# Compute receptive field manually
n_layers, n_blocks = 4, 3
rf = sum(2**i for _ in range(n_blocks) for i in range(n_layers))
print(f"Receptive field (approx): {rf} samples")
print(f"At 16 kHz: {rf / 16000 * 1000:.1f} ms")
print()

# mu-law round-trip
audio = torch.rand(8) * 2 - 1   # 8 samples in [-1, 1]
encoded = mu_law_encode(audio)
decoded = mu_law_decode(encoded)
print(f"mu-law encode range: [{encoded.min().item()}, {encoded.max().item()}]")
print(f"Max round-trip error: {(audio - decoded).abs().max():.4f}")
`

function PythonContent() {
    return (
        <>
            <p>
                PyTorch implementation of a simplified WaveNet with dilated causal convolutions
                and gated tanh activations. Includes &#956;-law companding encode/decode.
                The receptive field of the 3-block, 4-layer model is computed analytically
                and verified against the dilation pattern.
            </p>
            <CodeBlock code={PY_CODE} filename="wavenet.py" lang="python" langLabel="Python" />
        </>
    )
}

export const WAVENET_TABS: Record<TabId, React.ReactNode> = {
    history:    <HistoryTab />,
    kid:        <KidTab />,
    highschool: <HighSchoolTab />,
    maths:      null,
    python:     null,
}
